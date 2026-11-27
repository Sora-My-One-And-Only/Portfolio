/**
 * ゲームのキービジュアル（public/play-covers の公式カバー）から主な色を取り出す（npm run analyze:covers）。
 * 画像を縮小し、OKLab 色空間で k-means（k=6）にかけ、各色の面積比・明度・彩度・色相を出す。
 * 配色テーマを「想像」ではなく、実際の絵の色から決めるための下調べ用。
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const COVERS = [
  ['Granblue Fantasy: Relink', 'ps-0c202e26cc'],
  ['Rainbow Six Siege', 'steam-6a3a42e3ad'],
  ['Heaven Burns Red', 'steam-b962471a69'],
  ['Elden Ring Nightreign', 'steam-0a5d7a95f3'],
  ['Crimson Desert', 'ps-48f36f875e'],
  ['Ghost Recon Wildlands', 'steam-5882aaf6bc'],
  ['Hunt: Showdown 1896', 'steam-253715610f'],
  ['Helldivers 2', 'steam-7b83915b58'],
  ['Elden Ring', 'ps-d459383454'],
  ['Satisfactory', 'steam-670b6d40dc'],
  ['FF VII Rebirth', 'ps-6cb956f94d'],
  ['FF VII Remake', 'ps-0fcb86900f'],
  ['Horizon Forbidden West', 'ps-f7ecf2ff56'],
  ['Death Stranding', 'steam-4fc9ad48d2'],
  ['Death Stranding 2', 'ps-34b93df1c5'],
  ['Ghost of Tsushima', 'ps-78f9692845'],
  ['FF XVI', 'ps-39224d629e'],
  ['FF XV', 'ps-5ef9842dfb'],
  ['ASTRONEER', 'steam-f655b6a13f'],
  ['ARC Raiders', 'steam-b1690d0b0a'],
  ['Risk of Rain 2', 'steam-4a3fe7a64a'],
  ['Ghost of Yotei', 'ps-e4faa65448'],
  ['God of War Ragnarok', 'ps-3a1e73a894'],
  ['Forza Horizon 4', 'steam-ca8f095458'],
  ['Onimusha: Way of the Sword', 'ps-c596ef4118'],
  ['Tales of ARISE', 'steam-9fedac8a4a'],
  ['The Last of Us Part II', 'ps-e4541625f0'],
  ['Black Myth: Wukong', 'ps-f6f501070e'],
  ['Wo Long', 'ps-5e3d16a637'],
  ['ASTRO BOT', 'ps-541034ebf4'],
  ['Across the Obelisk', 'steam-61690ede01'],
  ['Monster Hunter: World', 'steam-150f970dd7'],
  ['Phantom Blade Zero', 'ps-ff2f539c27'],
  ['Sekiro', 'steam-ff03660b05'],
  ['Ori and the Will of the Wisps', 'steam-677d88282c'],
  ['Hades', 'steam-47fa84f348'],
  ['Cyberpunk 2077', 'steam-c05211491b'],
  ['Portal 2', 'steam-b15fa5f811'],
];

const srgbToLinear = (v) => {
  const x = v / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};
const toOklab = (r, g, b) => {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const lch = ([L, a, b]) => {
  const C = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
};

const kmeans = (pts, k) => {
  // 明度順に初期値を散らす（毎回同じ結果になるように）
  const sorted = [...pts].sort((p, q) => p[0] - q[0]);
  let centers = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) / k) * sorted.length)].slice());
  let assign = new Array(pts.length).fill(0);
  for (let iter = 0; iter < 30; iter++) {
    for (let i = 0; i < pts.length; i++) {
      let best = 0;
      let bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d =
          (pts[i][0] - centers[c][0]) ** 2 + (pts[i][1] - centers[c][1]) ** 2 + (pts[i][2] - centers[c][2]) ** 2;
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      assign[i] = best;
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    pts.forEach((p, i) => {
      const s = sums[assign[i]];
      s[0] += p[0];
      s[1] += p[1];
      s[2] += p[2];
      s[3]++;
    });
    centers = sums.map((s, c) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centers[c]));
  }
  const counts = new Array(k).fill(0);
  assign.forEach((a) => counts[a]++);
  return centers.map((c, i) => ({ ...lch(c), share: counts[i] / pts.length })).sort((a, b) => b.share - a.share);
};

for (const [name, file] of COVERS) {
  const { data, info } = await sharp(path.join(root, 'public/play-covers', file + '.webp'))
    .resize(64, 64, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pts = [];
  for (let i = 0; i < info.width * info.height; i++) pts.push(toOklab(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]));
  const meanL = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const clusters = kmeans(pts, 6);
  // いちばん鮮やかで、ある程度の面積（4% 以上）がある色
  const vivid = clusters.filter((c) => c.share >= 0.04).sort((a, b) => b.C - a.C)[0];
  console.log(
    `${name.padEnd(28)} meanL ${meanL.toFixed(2)}  vivid h${Math.round(vivid.h)} C${vivid.C.toFixed(3)}  | ` +
      clusters.map((c) => `${Math.round(c.share * 100)}% L${c.L.toFixed(2)} C${c.C.toFixed(3)} h${Math.round(c.h)}`).join('  ')
  );
}
