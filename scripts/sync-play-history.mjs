/**
 * Steam / PlayStation のプレイ履歴を取得して
 * src/content/generated/play-history.json に書き出します。
 *
 * - 認証情報は環境変数（ローカルでは .env.local、GitHub Actions では Secrets）から読みます。
 * - 出力するのはゲームの情報（タイトル・プレイ時間・実績/トロフィー・画像）だけです。
 *   Steam ID・PSN のアカウント ID・ユーザー名・API キーは書き出しません。
 * - 取得に失敗したプラットフォームは、前回のデータをそのまま残します。
 *
 * 使い方: npm run sync:play
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  getUserPlayedGames,
  getUserTitles,
  getUserTrophiesForSpecificTitle,
} from 'psn-api';

const OUT_FILE = new URL('../src/content/generated/play-history.json', import.meta.url);
/** 外すゲームの一覧（サイト側の src/content/profile.ts も同じファイルを使う） */
const EXCLUSIONS = JSON.parse(
  await readFile(new URL('../src/content/play-exclusions.json', import.meta.url), 'utf8')
);
const MIN_LIST_HOURS = Number(EXCLUSIONS.minListHours ?? 0);
/** カバー画像はサイト内に保存する（外部 CDN の URL にはゲームの内部 ID が含まれるため公開しない） */
const COVER_DIR = new URL('../public/play-covers/', import.meta.url);

try {
  process.loadEnvFile(new URL('../.env.local', import.meta.url));
} catch {
  // .env.local がなければ、環境変数だけを使う
}

const env = (name) => (process.env[name] ?? '').trim();
/** 取得するタイトル数の上限（0 または未設定なら全件） */
const MAX_GAMES = Number(env('PLAY_SYNC_LIMIT') || 0) || Infinity;
const STEAM_LANG = env('STEAM_LANG') || 'japanese';

/** 公開データに載せる ID。プラットフォーム内部の ID（Steam appid・PSN npCommunicationId）は出さない */
const publicId = (platform, title) =>
  `${platform}-${createHash('sha256').update(`${platform}:${title}`).digest('hex').slice(0, 10)}`;

const SECRET_NAMES = ['STEAM_API_KEY', 'STEAM_ID', 'PSN_NPSSO'];

/** エラーメッセージから認証情報を取り除く（ログに出さないため） */
function safeMessage(error) {
  let message = error instanceof Error ? error.message : String(error);
  for (const name of SECRET_NAMES) {
    const value = env(name);
    if (value) message = message.split(value).join('***');
  }
  return message.replace(/key=[^&\s]+/gi, 'key=***').replace(/steamid=[^&\s]+/gi, 'steamid=***');
}

/** 並列数を絞って順番に処理する */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

/* ------------------------------------------------------------------
 * Steam
 * ------------------------------------------------------------------ */

async function steamGet(path, params) {
  const url = new URL(`https://api.steampowered.com/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`${path.split('/')[1]} HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** Steam ストアのゲーム以外のアプリ（ソフトウェア・動画・ハードウェア）の appid 一覧 */
async function fetchSteamNonGameAppIds(key) {
  const ids = new Set();
  let last = 0;
  for (let page = 0; page < 20; page++) {
    const res = await steamGet('IStoreService/GetAppList/v1/', {
      key,
      include_games: false,
      include_dlc: false,
      include_software: true,
      include_videos: true,
      include_hardware: true,
      max_results: 50000,
      last_appid: last,
    });
    for (const a of res?.response?.apps ?? []) ids.add(a.appid);
    if (!res?.response?.have_more_results) break;
    last = res.response.last_appid;
  }
  return ids;
}

async function syncSteam() {
  const key = env('STEAM_API_KEY');
  const steamid = env('STEAM_ID');
  if (!key || !steamid) return null;

  const owned = await steamGet('IPlayerService/GetOwnedGames/v1/', {
    key,
    steamid,
    include_appinfo: 1,
    include_played_free_games: 1,
  });
  const games = owned?.response?.games;
  if (!Array.isArray(games)) {
    throw new Error(
      'ゲーム一覧を取得できませんでした。Steam のプライバシー設定で「ゲームの詳細」を公開にしてください。'
    );
  }

  // Steam ストアでソフトウェア・動画・ハードウェア扱いのもの（Blender、Wallpaper Engine など）はゲームではないので外す
  const software = await fetchSteamNonGameAppIds(key);

  const played = games
    .filter((g) => g.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, MAX_GAMES);

  return mapLimit(played, 4, async (g) => {
    const record = {
      id: publicId('steam', g.name),
      title: g.name,
      platform: 'steam',
      // ゲーム以外（ソフトウェアなど）は合計には入れるが、一覧には載せない
      ...(software.has(g.appid) ? { excluded: true } : {}),
      hours: roundHours(g.playtime_forever / 60),
      image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
      // 実績アイコンの取得にだけ使う一時的な値（書き出す前に消す）
      _appid: g.appid,
    };

    try {
      const stats = await steamGet('ISteamUserStats/GetPlayerAchievements/v1/', {
        key,
        steamid,
        appid: g.appid,
        l: STEAM_LANG,
      });
      const list = stats?.playerstats?.achievements ?? [];
      if (list.length > 0) {
        const unlocked = list.filter((a) => a.achieved === 1);
        record.achievements = { unlocked: unlocked.length, total: list.length };
        record._unlocked = unlocked.map((a) => a.apiname);
      }
    } catch {
      // 実績のないゲーム（400 など）は実績なしとして扱う
    }
    return record;
  });
}

/* ------------------------------------------------------------------
 * PlayStation（非公式 API: psn-api）
 * ------------------------------------------------------------------ */

/**
 * 一覧に載せてよいか（合計には外したゲームも入れる。外すのは一覧だけ）
 *   - ゲーム以外（excluded）・play-exclusions.json の一覧・実績機能のないゲームは載せない
 */
function isListable(r) {
  if (r.excluded || isExcluded(r.title)) return false;
  if (EXCLUSIONS.excludeNoAchievements && !((r.achievements?.total ?? 0) > 0)) return false;
  return true;
}

/** play-exclusions.json に載っているか（末尾 * は前方一致） */
function isExcluded(title) {
  const t = normalize(title);
  return [...(EXCLUSIONS.idle ?? []), ...(EXCLUSIONS.achievementFarming ?? []), ...(EXCLUSIONS.notGames ?? [])].some(
    (pattern) => (pattern.endsWith('*') ? t.startsWith(normalize(pattern.slice(0, -1))) : t === normalize(pattern))
  );
}

const normalize = (name) =>
  String(name ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** "PT228H56M33S" → 228.9（時間、小数のまま） */
function isoDurationToHours(value) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value ?? '');
  if (!m) return undefined;
  const minutes = Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0) + Number(m[3] ?? 0) / 60;
  return minutes / 60;
}

/** 0.1 時間単位に丸める */
const roundHours = (h) => Math.round(h * 10) / 10;

/** PSN の「遊んだゲーム」をページ送りで全件取得する */
async function fetchAllPlayedGames(auth) {
  const all = [];
  let offset = 0;
  for (let page = 0; page < 50; page++) {
    const res = await getUserPlayedGames(auth, 'me', {
      limit: 200,
      offset,
      categories: 'ps4_game,ps5_native_game',
    });
    all.push(...(res.titles ?? []));
    if (!res.nextOffset || !res.titles?.length) break;
    offset = res.nextOffset;
  }
  return all;
}

const CATEGORY_DEVICE = { ps4_game: 'PS4', ps5_native_game: 'PS5' };

async function syncPlayStation() {
  const npsso = env('PSN_NPSSO');
  if (!npsso) return null;

  const accessCode = await exchangeNpssoForAccessCode(npsso);
  const auth = await exchangeAccessCodeForAuthTokens(accessCode);

  const { trophyTitles } = await getUserTitles(auth, 'me', { limit: 800 });
  const played = await fetchAllPlayedGames(auth);

  // トロフィーリストを名前で引けるようにする（PS4 版と PS5 版など同名なら、多く取った方）
  const earnedCount = (t) =>
    t.earnedTrophies.platinum + t.earnedTrophies.gold + t.earnedTrophies.silver + t.earnedTrophies.bronze;
  const trophyByName = new Map();
  for (const t of trophyTitles.filter((x) => !x.hiddenFlag)) {
    const k = normalize(t.trophyTitleName);
    const prev = trophyByName.get(k);
    if (!prev || earnedCount(t) > earnedCount(prev)) trophyByName.set(k, t);
  }

  // 遊んだゲームを作品（concept）単位にまとめる。PS4 版と PS5 版のプレイ時間は合算する
  const games = new Map();
  for (const p of played) {
    const names = [p.localizedName, p.name, p.concept?.name].filter(Boolean);
    const key = p.concept?.id ? `c${p.concept.id}` : normalize(names[0]);
    const g = games.get(key) ?? {
      title: names[0],
      names: new Set(),
      hours: 0,
      devices: new Set(),
      titleIds: new Set(),
      image: p.localizedImageUrl || p.imageUrl,
    };
    names.forEach((n) => g.names.add(normalize(n)));
    if (p.titleId) g.titleIds.add(p.titleId);
    g.hours += isoDurationToHours(p.playDuration) ?? 0;
    if (CATEGORY_DEVICE[p.category]) g.devices.add(CATEGORY_DEVICE[p.category]);
    games.set(key, g);
  }

  // ゲームの titleId（CUSA… / PPSA…）からトロフィーリストを引く（1 回 5 件まで）。
  // 名前は 2 つのリストで微妙に違う（™ の有無、版の名前など）ため、ID で結びつける
  const trophyById = new Map(trophyTitles.map((t) => [t.npCommunicationId, t]));
  const trophyIdsByTitleId = new Map();
  const allTitleIds = [...new Set([...games.values()].flatMap((g) => [...g.titleIds]))];
  const batches = [];
  for (let i = 0; i < allTitleIds.length; i += 5) batches.push(allTitleIds.slice(i, i + 5));
  await mapLimit(batches, 3, async (ids) => {
    try {
      const res = await getUserTrophiesForSpecificTitle(auth, 'me', { npTitleIds: ids.join(',') });
      for (const t of res.titles ?? []) {
        trophyIdsByTitleId.set(t.npTitleId, (t.trophyTitles ?? []).map((x) => x.npCommunicationId));
      }
    } catch {
      // 見つからない ID があっても、名前での照合に任せる
    }
  });

  // 遊んだゲームにトロフィー情報を結びつける（ID で見つからなければ名前で）
  const usedTrophyTitles = new Set();
  const entries = [...games.values()].map((g) => {
    const byId = [...g.titleIds]
      .flatMap((id) => trophyIdsByTitleId.get(id) ?? [])
      .map((npId) => trophyById.get(npId))
      .filter((t) => t && !t.hiddenFlag)
      .sort((a, b) => earnedCount(b) - earnedCount(a))[0];
    const trophy = byId ?? [...g.names].map((n) => trophyByName.get(n)).find(Boolean);
    if (trophy) usedTrophyTitles.add(trophy);
    return { title: trophy?.trophyTitleName ?? g.title, hours: g.hours, devices: [...g.devices], image: trophy?.trophyTitleIconUrl ?? g.image, trophy };
  });

  // プレイ時間の記録がない機種（PS Vita など）のトロフィーリストも載せる
  const usedIds = new Set([...usedTrophyTitles].map((t) => t.npCommunicationId));
  for (const t of trophyByName.values()) {
    if (usedIds.has(t.npCommunicationId)) continue;
    // 同名の別機種版がすでに使われていれば載せない
    if ([...usedTrophyTitles].some((u) => normalize(u.trophyTitleName) === normalize(t.trophyTitleName))) continue;
    entries.push({ title: t.trophyTitleName, hours: undefined, devices: [], image: t.trophyTitleIconUrl, trophy: t });
  }

  // 遊んだ記録のあるゲームはすべて残す（トロフィーなし・短時間も含む）。表示の絞り込みはサイト側で行う
  const list = entries
    .sort(
      (a, b) =>
        (b.hours ?? -1) - (a.hours ?? -1) ||
        Date.parse(b.trophy?.lastUpdatedDateTime ?? 0) - Date.parse(a.trophy?.lastUpdatedDateTime ?? 0)
    )
    .slice(0, MAX_GAMES);

  return mapLimit(list, 3, async ({ title, hours, devices, image, trophy }) => {
    const record = {
      id: publicId('ps', title),
      title,
      platform: 'playstation',
      device: (trophy ? trophy.trophyTitlePlatform.split(',') : devices).join(' / ') || undefined,
      image,
    };
    if (hours !== undefined) record.hours = roundHours(hours);
    if (!trophy) return record;

    const earned = trophy.earnedTrophies;
    const defined = trophy.definedTrophies;
    const sum = (c) => c.platinum + c.gold + c.silver + c.bronze;
    record.achievements = { unlocked: sum(earned), total: sum(defined) };
    record.trophies = {
      platinum: earned.platinum,
      gold: earned.gold,
      silver: earned.silver,
      bronze: earned.bronze,
    };
    record.trophyTotals = {
      platinum: defined.platinum,
      gold: defined.gold,
      silver: defined.silver,
      bronze: defined.bronze,
    };

    return record;
  });
}

/* ------------------------------------------------------------------
 * 実行
 * ------------------------------------------------------------------ */

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf8'));
  } catch {
    return { platforms: {} };
  }
}

/**
 * カバー画像をダウンロードして public/play-covers/ に保存し、image をサイト内のパスに置き換える。
 * 取得できなかった画像は外部 URL を残さず、画像なしにする。
 */
/** サイトの一覧に載る本数（src/components/ProfileSection.tsx の PLAYLOG_LIMIT と合わせる） */
const COVER_LIMIT = 30;

/** サイトの「トロフィー／実績」並びと同じ点数（src/content/profile.ts の trophyScore） */
function coverScore(r) {
  if (r.trophies) {
    const t = r.trophies;
    return t.platinum * 300 + t.gold * 90 + t.silver * 30 + t.bronze * 15;
  }
  return r.achievements && r.achievements.total > 0 ? r.achievements.unlocked / r.achievements.total : 0;
}

/** どちらの並びでも上位 COVER_LIMIT 本に入らないゲームは一覧に出ないので、カバー画像を保存しない */
function coverTargets(records) {
  const hours = (r) => r.hours ?? 0;
  const listed = records.filter((r) => isListable(r) && hours(r) >= MIN_LIST_HOURS);
  const byHours = [...listed].sort((a, b) => hours(b) - hours(a));
  const byScore = [...listed].sort((a, b) => coverScore(b) - coverScore(a) || hours(b) - hours(a));
  return new Set([...byHours.slice(0, COVER_LIMIT), ...byScore.slice(0, COVER_LIMIT)].map((r) => r.id));
}

/** 実績アイコンの保存先 */
const ACH_DIR = new URL('ach/', COVER_DIR);
/** 1 本あたりに並べる実績アイコンの数（取得率の低いものから） */
const ACH_ICON_LIMIT = 10;

/**
 * Steam：一覧に載りうるゲームについて、解除した実績のアイコンを取得率の低い順に保存する。
 * アイコンもサイト内に保存し、Steam の URL や appid は書き出さない。
 */
async function addSteamAchievementIcons(records) {
  const key = env('STEAM_API_KEY');
  if (!key) return;
  await mkdir(ACH_DIR, { recursive: true });
  const targets = coverTargets(records);
  const keep = new Set();
  await mapLimit(
    records.filter((r) => targets.has(r.id) && r._appid && r._unlocked?.length),
    3,
    async (r) => {
      try {
        const schema = await steamGet('ISteamUserStats/GetSchemaForGame/v2/', { key, appid: r._appid, l: STEAM_LANG });
        const defs = new Map(
          (schema?.game?.availableGameStats?.achievements ?? []).map((a) => [a.name, a])
        );
        const global = await steamGet('ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/', {
          gameid: r._appid,
        });
        const percents = new Map(
          (global?.achievementpercentages?.achievements ?? []).map((a) => [a.name, Number(a.percent)])
        );
        const picks = r._unlocked
          .map((api) => ({ def: defs.get(api), rate: percents.get(api) ?? 100 }))
          .filter((x) => x.def?.icon)
          .sort((a, b) => a.rate - b.rate)
          .slice(0, ACH_ICON_LIMIT);

        const icons = [];
        for (const [i, p] of picks.entries()) {
          const res = await fetch(p.def.icon);
          if (!res.ok) continue;
          const file = `${r.id}-${i}.webp`;
          const img = await sharp(Buffer.from(await res.arrayBuffer()))
            .resize({ width: 64, height: 64, fit: 'cover' })
            .webp({ quality: 80 })
            .toBuffer();
          await writeFile(new URL(file, ACH_DIR), img);
          keep.add(file);
          icons.push({ name: p.def.displayName || p.def.name, rate: Math.round(p.rate * 10) / 10, icon: `play-covers/ach/${file}` });
        }
        if (icons.length) r.achievementIcons = icons;
      } catch {
        // アイコンが取れなくても、件数は表示する
      }
    }
  );
  for (const name of await readdir(ACH_DIR)) {
    if (!keep.has(name)) await rm(new URL(name, ACH_DIR));
  }
}

async function localizeCovers(platform, records) {
  await mkdir(COVER_DIR, { recursive: true });
  const keep = new Set();
  const targets = coverTargets(records);
  await mapLimit(records, 4, async (r) => {
    const sources = [r.image].flat().filter(Boolean);
    delete r.image;
    if (sources.length === 0 || !targets.has(r.id)) return;
    try {
      let thumb;
      for (const src of sources) {
        const res = await fetch(src);
        if (!res.ok) continue;
        const input = Buffer.from(await res.arrayBuffer());
        if (platform === 'steam') {
          // Steam は横長のバナー（460×215）を 460:215 のまま縮小
          thumb = await sharp(input).resize({ width: 384, height: 180, fit: 'cover' }).webp({ quality: 80 }).toBuffer();
        } else {
          // 一覧のサムネイル用に縮小して WebP で保存（表示サイズの約 2 倍）
          thumb = await sharp(input).resize({ width: 200, height: 200, fit: 'inside' }).webp({ quality: 80 }).toBuffer();
        }
        break;
      }
      if (!thumb) return;
      const file = `${r.id}.webp`;
      await writeFile(new URL(file, COVER_DIR), thumb);
      keep.add(file);
      r.image = `play-covers/${file}`;
    } catch {
      // 画像なしで続ける
    }
  });
  // このプラットフォームの古い画像を削除
  const prefix = platform === 'playstation' ? 'ps-' : `${platform}-`;
  for (const name of await readdir(COVER_DIR)) {
    if (name.startsWith(prefix) && !keep.has(name)) await rm(new URL(name, COVER_DIR));
  }
}

/** 今回取得できたプラットフォームだけを置き換える（Xbox など他のデータは残す） */
const updates = {};

for (const [id, sync] of [
  ['steam', syncSteam],
  ['playstation', syncPlayStation],
]) {
  try {
    let records = await sync();
    if (records === null) {
      console.log(`[${id}] 認証情報が未設定のためスキップしました`);
      continue;
    }
    await localizeCovers(id, records);
    if (id === 'steam') await addSteamAchievementIcons(records);
    // 一時的な値（appid など）は書き出さない
    for (const r of records) {
      delete r._appid;
      delete r._unlocked;
    }
    updates[id] = { syncedAt: new Date().toISOString().slice(0, 10), records };
    console.log(`[${id}] ${records.length} タイトルを取得しました`);
  } catch (e) {
    console.warn(`[${id}] 取得に失敗しました（前回のデータを残します）: ${safeMessage(e)}`);
  }
}

// 書き込む直前に読み直して、別のスクリプトが書いた内容を消さないようにする
const output = await readPrevious();
output.platforms = { ...(output.platforms ?? {}), ...updates };
await mkdir(new URL('.', OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`);
