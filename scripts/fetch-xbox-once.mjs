/**
 * Xbox のプレイ履歴を一度だけ取得して src/content/generated/play-history.json に追加します。
 *
 * - ログインは Microsoft のデバイスコード方式です。表示されたコードを自分のブラウザで
 *   https://www.microsoft.com/link に入力してサインインします（パスワードはこのスクリプトを通りません）。
 * - 取得したトークンはメモリ上で使うだけで、ファイルにも画面にも出しません。
 * - 書き出すのはゲームの情報（タイトル・プレイ時間・実績・カバー画像）だけです。
 *   Xbox のユーザー ID（XUID）・ゲーマータグ・タイトル ID は書き出しません。
 * - 外すゲームの一覧（src/content/play-exclusions.json）は一覧の表示だけに使い、合計には全ゲームを入れます。
 *
 * 使い方: npm run fetch:xbox
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT_FILE = new URL('../src/content/generated/play-history.json', import.meta.url);
const COVER_DIR = new URL('../public/play-covers/', import.meta.url);
const EXCLUSIONS = JSON.parse(
  await readFile(new URL('../src/content/play-exclusions.json', import.meta.url), 'utf8')
);
const MIN_LIST_HOURS = Number(EXCLUSIONS.minListHours ?? 0);
/** サイトの一覧に載る本数（src/components/ProfileSection.tsx の PLAYLOG_LIMIT と合わせる） */
const COVER_LIMIT = 30;

/** Xbox アプリと同じ公開クライアント ID（デバイスコード方式でサインインできる） */
const CLIENT_ID = '000000004C12AE6F';
const SCOPE = 'service::user.auth.xboxlive.com::MBI_SSL';

/** ログに出すエラーから、長いトークンらしき文字列を伏せる */
const safe = (e) => String(e instanceof Error ? e.message : e).replace(/[A-Za-z0-9._\-+/=]{32,}/g, '***');

const normalize = (name) =>
  String(name ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function isExcluded(title) {
  const t = normalize(title);
  return [...(EXCLUSIONS.idle ?? []), ...(EXCLUSIONS.achievementFarming ?? []), ...(EXCLUSIONS.notGames ?? [])].some(
    (p) => (p.endsWith('*') ? t.startsWith(normalize(p.slice(0, -1))) : t === normalize(p))
  );
}

const publicId = (platform, title) =>
  `${platform}-${createHash('sha256').update(`${platform}:${title}`).digest('hex').slice(0, 10)}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function postForm(url, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  return res.json();
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${new URL(url).host} HTTP ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------------
 * サインイン（デバイスコード → Xbox Live のトークン）
 * ------------------------------------------------------------------ */

async function signIn() {
  const device = await postForm('https://login.live.com/oauth20_connect.srf', {
    client_id: CLIENT_ID,
    scope: SCOPE,
    response_type: 'device_code',
  });
  if (!device.user_code) throw new Error('デバイスコードを取得できませんでした');

  console.log('');
  console.log('========================================================');
  console.log(` ブラウザで ${device.verification_uri} を開き、`);
  console.log(` 次のコードを入力して Microsoft アカウントでサインインしてください。`);
  console.log('');
  console.log(`   XBOX_LOGIN_CODE: ${device.user_code}`);
  console.log('');
  console.log(` （${Math.round(device.expires_in / 60)} 分以内。サインインが終わると自動で続きます）`);
  console.log('========================================================');
  console.log('');

  const deadline = Date.now() + device.expires_in * 1000;
  let interval = (device.interval ?? 5) * 1000;
  let accessToken;
  while (Date.now() < deadline) {
    await sleep(interval);
    const token = await postForm('https://login.live.com/oauth20_token.srf', {
      client_id: CLIENT_ID,
      device_code: device.device_code,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });
    if (token.access_token) {
      accessToken = token.access_token;
      break;
    }
    if (token.error === 'slow_down') interval += 5000;
    else if (token.error !== 'authorization_pending') throw new Error(`サインインできませんでした（${token.error}）`);
  }
  if (!accessToken) throw new Error('コードの有効期限が切れました。もう一度実行してください。');
  console.log('サインインしました。Xbox Live に接続しています…');

  // Xbox Live のユーザートークン（RpsTicket の形式はトークンの種類で違うため順に試す）
  let userToken;
  for (const ticket of [`t=${accessToken}`, accessToken, `d=${accessToken}`]) {
    try {
      const res = await postJson(
        'https://user.auth.xboxlive.com/user/authenticate',
        {
          RelyingParty: 'http://auth.xboxlive.com',
          TokenType: 'JWT',
          Properties: { AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: ticket },
        },
        { 'x-xbl-contract-version': '1' }
      );
      userToken = res.Token;
      break;
    } catch {
      // 次の形式を試す
    }
  }
  if (!userToken) throw new Error('Xbox Live のユーザー認証に失敗しました');

  const xsts = await postJson(
    'https://xsts.auth.xboxlive.com/xsts/authorize',
    {
      RelyingParty: 'http://xboxlive.com',
      TokenType: 'JWT',
      Properties: { UserTokens: [userToken], SandboxId: 'RETAIL' },
    },
    { 'x-xbl-contract-version': '1' }
  );
  const claims = xsts.DisplayClaims?.xui?.[0] ?? {};
  if (!xsts.Token || !claims.uhs || !claims.xid) throw new Error('Xbox Live の認可に失敗しました');
  return { authorization: `XBL3.0 x=${claims.uhs};${xsts.Token}`, xuid: claims.xid };
}

/* ------------------------------------------------------------------
 * プレイ履歴・実績・プレイ時間
 * ------------------------------------------------------------------ */

async function fetchTitles({ authorization, xuid }) {
  const url = `https://titlehub.xboxlive.com/users/xuid(${xuid})/titles/titlehistory/decoration/achievement,image,detail?maxItems=1000`;
  const res = await fetch(url, {
    headers: {
      Authorization: authorization,
      'x-xbl-contract-version': '2',
      'Accept-Language': 'ja-JP',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`titlehub HTTP ${res.status}`);
  return (await res.json()).titles ?? [];
}

/** タイトルごとの MinutesPlayed（ゲームが記録していない場合は取れない） */
async function fetchMinutesPlayed({ authorization, xuid }, titleIds) {
  const minutes = new Map();
  for (let i = 0; i < titleIds.length; i += 50) {
    const chunk = titleIds.slice(i, i + 50);
    try {
      const res = await postJson(
        'https://userstats.xboxlive.com/batch',
        {
          arrangebyfield: 'xuid',
          xuids: [xuid],
          groups: [],
          stats: chunk.map((titleId) => ({ name: 'MinutesPlayed', titleId: String(titleId) })),
        },
        { Authorization: authorization, 'x-xbl-contract-version': '2' }
      );
      for (const s of res.statlistscollection?.[0]?.stats ?? []) {
        const v = Number(s.value);
        if (Number.isFinite(v) && v > 0) minutes.set(String(s.titleid), v);
      }
    } catch (e) {
      console.warn(`プレイ時間の一部を取得できませんでした: ${safe(e)}`);
    }
  }
  return minutes;
}

const DEVICE_LABEL = { XboxSeries: 'Xbox Series', XboxOne: 'Xbox One', Xbox360: 'Xbox 360', PC: 'PC' };

/* ------------------------------------------------------------------
 * カバー画像（一覧に載りうるゲームだけ、縮小してサイト内に保存）
 * ------------------------------------------------------------------ */

const coverScore = (r) =>
  r.achievements && r.achievements.total > 0 ? r.achievements.unlocked / r.achievements.total : 0;

async function saveCovers(records) {
  await mkdir(COVER_DIR, { recursive: true });
  const hours = (r) => r.hours ?? 0;
  const listed = records.filter(
    (r) =>
      !isExcluded(r.title) &&
      (!EXCLUSIONS.excludeNoAchievements || (r.achievements?.total ?? 0) > 0) &&
      hours(r) >= MIN_LIST_HOURS
  );
  const targets = new Set(
    [
      ...[...listed].sort((a, b) => hours(b) - hours(a)).slice(0, COVER_LIMIT),
      ...[...listed].sort((a, b) => coverScore(b) - coverScore(a) || hours(b) - hours(a)).slice(0, COVER_LIMIT),
    ].map((r) => r.id)
  );
  const keep = new Set();
  for (const r of records) {
    const src = r.image;
    delete r.image;
    if (!src || !targets.has(r.id)) continue;
    try {
      const res = await fetch(src);
      if (!res.ok) continue;
      const file = `${r.id}.webp`;
      const thumb = await sharp(Buffer.from(await res.arrayBuffer()))
        .resize({ width: 200, height: 200, fit: 'inside' })
        .webp({ quality: 80 })
        .toBuffer();
      await writeFile(new URL(file, COVER_DIR), thumb);
      keep.add(file);
      r.image = `play-covers/${file}`;
    } catch {
      // 画像なしで続ける
    }
  }
  for (const name of await readdir(COVER_DIR)) {
    if (name.startsWith('xbox-') && !keep.has(name)) await rm(new URL(name, COVER_DIR));
  }
}

/* ------------------------------------------------------------------
 * 実行
 * ------------------------------------------------------------------ */

try {
  const session = await signIn();
  const titles = (await fetchTitles(session)).filter((t) => t.type === 'Game');
  const minutes = await fetchMinutesPlayed(
    session,
    titles.map((t) => t.titleId)
  );

  const records = titles
    .map((t) => {
      const a = t.achievement ?? {};
      const record = {
        id: publicId('xbox', t.name),
        title: t.name,
        platform: 'xbox',
        device: [...new Set((t.devices ?? []).map((d) => DEVICE_LABEL[d] ?? d))].join(' / ') || undefined,
        image: t.displayImage,
      };
      const m = minutes.get(String(t.titleId));
      if (m) record.hours = Math.round((m / 60) * 10) / 10;
      if (a.totalAchievements > 0) {
        record.achievements = { unlocked: a.currentAchievements ?? 0, total: a.totalAchievements };
      }
      return record;
    })
    .sort((x, y) => (y.hours ?? -1) - (x.hours ?? -1));

  await saveCovers(records);

  let output = { platforms: {} };
  try {
    output = JSON.parse(await readFile(OUT_FILE, 'utf8'));
  } catch {
    // まだファイルがない
  }
  output.platforms ??= {};
  output.platforms.xbox = { syncedAt: new Date().toISOString().slice(0, 10), records };
  await writeFile(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`);

  const withHours = records.filter((r) => r.hours !== undefined).length;
  console.log(`[xbox] ${records.length} タイトルを保存しました（プレイ時間あり ${withHours}）`);
} catch (e) {
  console.error(`[xbox] 取得に失敗しました: ${safe(e)}`);
  process.exitCode = 1;
}
