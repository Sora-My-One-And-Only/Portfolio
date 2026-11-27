/**
 * 配色テーマの生成（npm run gen:palettes）。
 *
 * 色は OKLCH（知覚的に均等な色空間）で決める。
 *   - テーマは昼か夜のどちらか一方。地の明るさと主な色調で振り分ける
 *   - 役割ごとの明度（背景・面・罫・文字 3 段）は全テーマで共通。変えるのは色相と彩度だけなので、
 *     どのテーマでも見た目の強弱（階層）が同じになる
 *   - 中間色は純粋な灰ではなく、テーマの「地」の色相に少しだけ寄せる
 *   - 差し色は 1 色（面積は 1 割程度）と、低彩度の補助色 1 色
 *   - sRGB の色域から出る色は、明度と色相を保ったまま彩度だけ下げる
 *   - 文字と差し色は、背景に対して WCAG 4.5:1 以上になるよう検算する（満たさなければ失敗）
 *
 * 出力：src/index.css の配色ブロック、src/content/themes.ts（設定ウィンドウの一覧）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- OKLCH -> sRGB ---------- */
const toLinear = (L, C, h) => {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
const encode = (v) => {
  const x = Math.min(1, Math.max(0, v));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
};
/** 色域外なら彩度だけを下げて収める */
const oklch = (L, C, h) => {
  let c = C;
  if (!inGamut(toLinear(L, c, h))) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(toLinear(L, mid, h))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  const rgb = toLinear(L, c, h).map(encode).map((v) => Math.round(v * 255));
  return { hex: '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(), rgb, L, C: c, h };
};
const luminance = ({ rgb }) => {
  const [r, g, b] = rgb.map((v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (x, y) => {
  const a = luminance(x);
  const b = luminance(y);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/* ---------- 役割ごとの明度（全テーマ共通） ---------- */
const LADDER = {
  light: { bg: 0.962, surface: 0.985, inset: 0.93, rule: 0.875, ink3: 0.535, ink2: 0.43, ink: 0.235, cover: 0.945 },
  dark: { bg: 0.195, surface: 0.235, inset: 0.16, rule: 0.315, ink3: 0.67, ink2: 0.79, ink: 0.935, cover: 0.18 },
};
// 中間色の彩度の倍率（地は控えめ、罫と文字は少しだけ色を持たせる）
const NC = { bg: 1, surface: 0.6, inset: 1.2, rule: 1.4, ink3: 1.6, ink2: 1.8, ink: 2, cover: 1.15 };
const TEXT_ROLES = ['ink', 'ink2', 'ink3'];

/**
 * テーマ定義。テーマは昼か夜のどちらか一方（mode）。地の明るさと主な色調で振り分けている。
 * d の中身：
 *   n / nc: 中間色の色相と彩度（地の色）
 *   a / ac: 差し色の色相と彩度
 *   a2 / a2c: 補助色の色相と彩度（a2ink なら文字色と同じ）
 *   textC: 文字の彩度の上限（既定 0.02）
 *   ladder: 役割ごとの明度を上書き（明度差を極端にしたいテーマだけ）
 *   accentL: 差し色の明度を固定（4.5:1 の検算はそのまま行う）
 *   a2L: 補助色の明度を固定（差し色との明度差で、金属の照り返しと陰を作るときなど）
 *
 * ゲームの色は想像で決めず、公式の絵から測った値を使う（scripts/analyze-cover-colors.mjs と同じ OKLab の k-means）：
 *   - public/play-covers の公式カバー、Steam の公式アート（ヘッダー・ライブラリ用の絵・ロゴ）、公式サイトのキービジュアル
 *   - 昼／夜は絵の平均明度とジャンルの雰囲気で分け、色相はクラスタの値をそのまま使う（彩度だけ、差し色として読める程度に上げる）
 *   - 手元で測れない任天堂の 4 本は、公開されているロゴ・ブランド色を参照
 * 名前はシリーズ名だけ（副題・番号は付けない）。シリーズからは 1 作だけ。並びはプレイ時間の長い順。
 */
const T = (id, mode, group, d, name) => ({ id, mode, group, d, name });
const N = (ja, zh, en) => ({ ja, zh, en });
const THEMES = [
  /* ===== ゲーム：昼 ===== */
  T('g01', 'light', 'game', { n: 255, nc: 0.012, a: 250, ac: 0.1, a2: 116, a2c: 0.05 }, N('グランブルーファンタジー', '碧蓝幻想', 'Granblue Fantasy')),
  T('g02', 'light', 'game', { n: 275, nc: 0.007, a: 285, ac: 0.1, a2: 314, a2c: 0.04 }, N('ヘブンバーンズレッド', '炽焰天穹', 'Heaven Burns Red')),
  T('g03', 'light', 'game', { n: 238, nc: 0.014, a: 248, ac: 0.15, a2: 234, a2c: 0.06 }, N('Horizon', '地平线', 'Horizon')),
  T('g04', 'light', 'game', { n: 90, nc: 0.006, a: 80, ac: 0.1, a2: 93, a2c: 0.012 }, N('ゴースト・オブ・ヨウテイ', '羊蹄山之魂', 'Ghost of Yōtei')),
  T('g05', 'light', 'game', { n: 262, nc: 0.008, a: 264, ac: 0.19, a2: 267, a2c: 0.05 }, N('アストロボット', '宇宙机器人', 'Astro Bot')),
  T('g06', 'light', 'game', { n: 200, nc: 0.008, a: 229, ac: 0.13, a2: 55, a2c: 0.12 }, N('ポータル', '传送门', 'Portal')),
  T('g07', 'light', 'game', { n: 100, nc: 0.015, a: 200, ac: 0.11, a2: 135, a2c: 0.07 }, N('ゼルダの伝説', '塞尔达传说', 'The Legend of Zelda')),
  T('g08', 'light', 'game', { n: 95, nc: 0.01, a: 255, ac: 0.14, a2: 95, a2c: 0.16 }, N('ポケットモンスター', '宝可梦', 'Pokémon')),
  T('g09', 'light', 'game', { n: 350, nc: 0.012, a: 355, ac: 0.16, a2: 95, a2c: 0.12 }, N('星のカービィ', '星之卡比', 'Kirby')),
  T('g10', 'light', 'game', { n: 90, nc: 0.02, a: 185, ac: 0.1, a2: 135, a2c: 0.08 }, N('どうぶつの森', '动物森友会', 'Animal Crossing')),

  /* ===== ゲーム：夜 ===== */
  T('g11', 'dark', 'game', { n: 175, nc: 0.022, a: 79, ac: 0.095, a2: 127, a2c: 0.03 }, N('エルデンリング', '艾尔登法环', 'Elden Ring')),
  // 金は 1 色だと平たく見えるので、明るいシャンパンゴールド（差し色）と暗いブロンズ（補助色）の明度差で金属の照りを作る
  T('g12', 'dark', 'game', { n: 217, nc: 0.012, a: 84, ac: 0.1, accentL: 0.8, a2: 66, a2c: 0.085, a2L: 0.5 }, N('デス・ストランディング', '死亡搁浅', 'Death Stranding')),
  T('g13', 'dark', 'game', { n: 27, nc: 0.022, a: 26, ac: 0.07, a2: 47, a2c: 0.02 }, N('紅の砂漠', '红色沙漠', 'Crimson Desert')),
  T('g14', 'dark', 'game', { n: 160, nc: 0.02, a: 162, ac: 0.11, a2: 165, a2c: 0.04 }, N('ファイナルファンタジー', '最终幻想', 'Final Fantasy')),
  T('g16', 'dark', 'game', { n: 264, nc: 0.004, a: 36, ac: 0.09, a2: 57, a2c: 0.02 }, N('The Last of Us', '最后生还者', 'The Last of Us')),
  T('g17', 'dark', 'game', { n: 280, nc: 0.008, a: 254, ac: 0.09, a2: 252, a2c: 0.03 }, N('ゴッド・オブ・ウォー', '战神', 'God of War')),
  T('g18', 'dark', 'game', { n: 228, nc: 0.015, a: 55, ac: 0.16, a2: 105, a2c: 0.04 }, N('Outer Wilds', '星际拓荒', 'Outer Wilds')),
  T('g19', 'dark', 'game', { n: 277, nc: 0.035, a: 170, ac: 0.12, a2: 288, a2c: 0.1 }, N('ANIMAL WELL', '动物井', 'Animal Well')),
  T('g20', 'dark', 'game', { n: 318, nc: 0.008, a: 10, ac: 0.09, a2: 264, a2c: 0.015 }, N('バイオハザード', '生化危机', 'Resident Evil')),
  // 黒・白・灰・赤だけ。明度差を最大にするため、共通の明度の段を上書きする（真っ黒の地、真っ白の文字、無彩色の灰、#FF0000 の赤）
  T('g21', 'dark', 'game', {
    n: 0, nc: 0, a: 29.23, ac: 0.2577, accentL: 0.628, a2: 0, a2c: 0, a2ink: true,
    ladder: { bg: 0, surface: 0.235, inset: 0.15, rule: 0.36, ink3: 0.7, ink2: 0.84, ink: 1, cover: 0 },
  }, N('グランツーリスモ', 'GT赛车', 'Gran Turismo')),

  /* ===== 美術・旧世紀 ===== */
  T('c01', 'light', 'classic', { n: 55, nc: 0.011, a: 8, ac: 0.085, a2: 140, a2c: 0.05 }, N('アール・ヌーヴォー', '新艺术运动', 'Art Nouveau')),
  T('c02', 'light', 'classic', { n: 80, nc: 0.018, a: 250, ac: 0.1, a2: 25, a2c: 0.08 }, N('浮世絵', '浮世绘', 'Ukiyo-e')),
  T('c03', 'light', 'classic', { n: 95, nc: 0.012, a: 315, ac: 0.09, a2: 145, a2c: 0.06 }, N('印象派', '印象派', 'Impressionism')),
  T('c04', 'light', 'classic', { n: 250, nc: 0.004, a: 27, ac: 0.15, a2: 250, a2c: 0.01 }, N('水墨画', '水墨画', 'Ink Wash')),
  T('c05', 'dark', 'classic', { n: 60, nc: 0.014, a: 48, ac: 0.12, a2: 22, a2c: 0.09 }, N('レンブラント', '伦勃朗', 'Rembrandt')),
  T('c06', 'dark', 'classic', { n: 30, nc: 0.006, a: 32, ac: 0.17, a2: 25, a2c: 0.09 }, N('漆と朱', '漆与朱', 'Lacquer & Vermilion')),
  T('c07', 'dark', 'classic', { n: 270, nc: 0.012, a: 262, ac: 0.15, a2: 18, a2c: 0.12 }, N('ステンドグラス', '彩色玻璃', 'Stained Glass')),
  T('c08', 'dark', 'classic', { n: 220, nc: 0.025, a: 185, ac: 0.07, a2: 150, a2c: 0.04 }, N('ホイッスラーのノクターン', '惠斯勒的夜曲', 'Whistler’s Nocturnes')),

  /* ===== 美術・近現代 ===== */
  T('m01', 'light', 'modern', { n: 70, nc: 0.007, a: 32, ac: 0.055, a2: 165, a2c: 0.025 }, N('モランディ', '莫兰迪', 'Morandi')),
  T('m02', 'light', 'modern', { n: 85, nc: 0.006, a: 265, ac: 0.15, a2: 32, a2c: 0.12 }, N('マティスの切り絵', '马蒂斯剪纸', 'Matisse Cut-outs')),
  T('m03', 'light', 'modern', { n: 90, nc: 0.005, a: 150, ac: 0.06, a2: 50, a2c: 0.05 }, N('北欧ミニマル', '北欧极简', 'Nordic Minimal')),
  T('m09', 'light', 'modern', { n: 95, nc: 0.003, a: 29, ac: 0.2, a2: 95, a2c: 0.003, a2ink: true }, N('バウハウス', '包豪斯', 'Bauhaus')),
  T('m05', 'dark', 'modern', { n: 12, nc: 0.03, a: 40, ac: 0.15, a2: 8, a2c: 0.1 }, N('ロスコ', '罗斯科', 'Rothko')),
  T('m06', 'dark', 'modern', { n: 115, nc: 0.007, a: 50, ac: 0.055, a2: 150, a2c: 0.03 }, N('ハンマースホイ', '哈默修伊', 'Hammershøi')),
  T('m07', 'dark', 'modern', { n: 170, nc: 0.02, a: 95, ac: 0.1, a2: 45, a2c: 0.06 }, N('ホッパーの夜', '霍珀的夜', 'Hopper’s Nighthawks')),
  T('m08', 'dark', 'modern', { n: 265, nc: 0.01, a: 265, ac: 0.2, a2: 265, a2c: 0.03 }, N('クライン・ブルー', '克莱因蓝', 'Klein Blue')),

  /* ===== 暮らしの色 ===== */
  T('t01', 'light', 'living', { n: 200, nc: 0.01, a: 190, ac: 0.1, a2: 30, a2c: 0.12 }, N('珊瑚礁', '珊瑚礁', 'Coral Reef')),
  T('t02', 'light', 'living', { n: 50, nc: 0.02, a: 40, ac: 0.13, a2: 90, a2c: 0.05 }, N('テラコッタ', '赤陶', 'Terracotta')),
  T('t03', 'light', 'living', { n: 95, nc: 0.012, a: 135, ac: 0.1, a2: 60, a2c: 0.05 }, N('抹茶と生成り', '抹茶与本白', 'Matcha & Cotton')),
  T('t04', 'light', 'living', { n: 300, nc: 0.012, a: 305, ac: 0.1, a2: 120, a2c: 0.06 }, N('ラベンダー畑', '薰衣草田', 'Lavender Field')),
  T('t05', 'dark', 'living', { n: 280, nc: 0.01, a: 285, ac: 0.17, a2: 320, a2c: 0.08 }, N('薄明', '薄暮', 'Twilight')),
  T('t06', 'dark', 'living', { n: 290, nc: 0.03, a: 300, ac: 0.17, a2: 165, a2c: 0.1 }, N('極光', '极光', 'Aurora')),
  T('t07', 'dark', 'living', { n: 255, nc: 0.015, a: 162, ac: 0.14, a2: 255, a2c: 0.06 }, N('雨上がりの石畳', '雨后的石板路', 'After the Rain')),
  T('t08', 'dark', 'living', { n: 350, nc: 0.015, a: 355, ac: 0.15, a2: 320, a2c: 0.08 }, N('ベリー', '莓果', 'Berries')),
];

const DEFAULT = { light: 'm09', dark: 'g12' };

const build = (mode, d) => {
  const ladder = { ...LADDER[mode], ...d.ladder };
  const out = {};
  for (const role of Object.keys(ladder)) {
    const c = d.nc * NC[role];
    out[role] = oklch(ladder[role], TEXT_ROLES.includes(role) ? Math.min(d.textC ?? 0.02, c) : c, d.n);
  }
  // 差し色：本文サイズでも 4.5:1 を満たすまで明度を動かす
  let aL = d.accentL ?? (mode === 'light' ? 0.56 : 0.68);
  let accent = oklch(aL, d.ac, d.a);
  for (let i = 0; i < 40 && contrast(accent, out.bg) < 4.6; i++) {
    aL += mode === 'light' ? -0.01 : 0.01;
    accent = oklch(aL, d.ac, d.a);
  }
  out.accent = accent;
  out.accent2 = d.a2ink ? out.ink : oklch(d.a2L ?? (mode === 'light' ? 0.5 : 0.64), d.a2c, d.a2);
  return out;
};

const ids = new Set();
const built = THEMES.map((t) => {
  if (ids.has(t.id)) throw new Error('duplicate id ' + t.id);
  ids.add(t.id);
  return { ...t, p: build(t.mode, t.d) };
});
for (const mode of ['light', 'dark']) {
  if (!built.some((t) => t.mode === mode && t.id === DEFAULT[mode])) throw new Error(`default ${mode} theme missing`);
}

// 検算：文字 3 段と差し色のコントラスト比
let failed = false;
let worst = 99;
for (const t of built) {
  for (const k of ['ink', 'ink2', 'ink3', 'accent']) {
    const c = contrast(t.p[k], t.p.bg);
    worst = Math.min(worst, c);
    if (c < 4.5) {
      failed = true;
      console.error(`${t.id} ${t.mode} ${k} ${c.toFixed(2)}`);
    }
  }
}
const count = (mode, group) => built.filter((t) => t.mode === mode && t.group === group).length;
for (const g of ['game', 'classic', 'modern', 'living']) console.log(`${g.padEnd(8)} day ${count('light', g)} / night ${count('dark', g)}`);
console.log(`${built.length} themes, lowest contrast ${worst.toFixed(2)}:1`);
if (failed) process.exit(1);

/* ---------- index.css ---------- */
const cssBlock = (t) => {
  const { p, mode } = t;
  const isDefault = DEFAULT[mode] === t.id;
  const sel =
    mode === 'light'
      ? `${isDefault ? ':root,\n  ' : ''}html:not(.dark)[data-light="${t.id}"]`
      : `${isDefault ? 'html.dark,\n  ' : ''}html.dark[data-dark="${t.id}"]`;
  return `  /* ${t.id} ${t.name.ja} */
  ${sel} {
    --c-bg: ${p.bg.hex};
    --c-surface: ${p.surface.hex};
    --c-inset: ${p.inset.hex};
    --c-ink: ${p.ink.hex};
    --c-ink-2: ${p.ink2.hex};
    --c-ink-3: ${p.ink3.hex};
    --c-rule: ${p.rule.hex};
    --c-accent: ${p.accent.hex};
    --c-accent-2: ${p.accent2.hex};
    --cover-bg: ${p.cover.hex};
    --cover-ink: ${p.ink.hex};
    --cover-accent: ${p.accent.hex};
    --cover-alpha: ${mode === 'light' ? 0.8 : 0.75};
  }
`;
};
let css = `  /*
   * 配色テーマ（scripts/gen-palettes.mjs が生成。手で直さず、スクリプトを直して npm run gen:palettes）
   * 役割ごとの明度は全テーマ共通、変えるのは中間色の色相・彩度と差し色だけ。文字と差し色は背景に対して 4.5:1 以上
   */
`;
for (const mode of ['light', 'dark']) {
  css += `  /* ===== ${mode === 'light' ? '昼' : '夜'} ===== */\n`;
  // 既定のテーマを先に書き、ほかのテーマが後から上書きできるようにする
  const list = built.filter((t) => t.mode === mode);
  for (const t of [list.find((x) => x.id === DEFAULT[mode]), ...list.filter((x) => x.id !== DEFAULT[mode])]) css += cssBlock(t) + '\n';
}

const cssPath = path.join(root, 'src/index.css');
const s = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');
const start = s.search(/ {2}\/\*\n {3}\* 配色テーマ|  \/\* ===== 昼/);
const end = s.indexOf('@layer base {\n  html {');
if (start < 0 || end < 0) throw new Error('palette markers not found in index.css');
fs.writeFileSync(cssPath, s.slice(0, start) + css + s.slice(end));

/* ---------- themes.ts ---------- */
const sw = (p) => `['${p.bg.hex}', '${p.ink.hex}', '${p.accent.hex}', '${p.accent2.hex}']`;
const q = (o) => `{ ja: ${JSON.stringify(o.ja)}, zh: ${JSON.stringify(o.zh)}, en: ${JSON.stringify(o.en)} }`;
const ts = `// scripts/gen-palettes.mjs が生成（手で直さない）
import type { Locale } from './interface-copy';

export type ThemeMode = 'light' | 'dark';
export type ThemeGroup = 'game' | 'classic' | 'modern' | 'living';
export type ThemeOption = {
  id: string;
  /** 昼のテーマか夜のテーマか */
  mode: ThemeMode;
  group: ThemeGroup;
  name: Record<Locale, string>;
  /** 背景・文字・差し色・補助色 */
  swatch: [string, string, string, string];
};

export const DEFAULT_THEME: Record<ThemeMode, string> = ${JSON.stringify(DEFAULT)};

export const THEMES: ThemeOption[] = [
${built
  .map(
    (t) =>
      `  {\n    id: '${t.id}',\n    mode: '${t.mode}',\n    group: '${t.group}',\n    name: ${q(t.name)},\n    swatch: ${sw(t.p)},\n  },`
  )
  .join('\n')}
];
`;
fs.writeFileSync(path.join(root, 'src/content/themes.ts'), ts);
console.log('wrote src/index.css and src/content/themes.ts');
