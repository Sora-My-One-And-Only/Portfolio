/**
 * 03 · 城塞（立体の箱庭・分解アクソメ図）
 * 3 つの階（B1 地下墓所・1F 城下・2F 城壁）を、建築の分解アクソメ図のように上下に離して重ねる。
 * 階と階は、階段・梯子・飛び降り・昇降機の縦の線でつながる。
 * 流れ（死にゲーの「輪」）：篝火 → 隣の扉は向こう側から閂 → 階段で城壁へ → 塔の弓兵に狙われながら城壁を進む
 *      → 塔から 1F へ飛び降りる（戻れない）→ 梯子で地下墓所へ → 天井から落ちてくる敵 → 霧の門の先のボス
 *      → 昇降機で 1F の閂の小部屋へ → 閂を外す → 篝火に戻る（近道で輪がつながる）
 * 各階の中は方眼の最短路で歩くので、壁を通り抜けない。
 */
import { ACCENT, G, INK, Kit, clamp01, easeInOut, gridPath, inR, lerp, noteAlpha, pal, polyLength, rng, type Pt, type R4, type Scene } from './kit';

const LW = 30;
const LH = 16;
const A = 0.9; // 横の傾き
const B = 0.34; // 奥行きのつぶれ
const HZ = 8.5; // 階の間隔（マス）
const WH = 0.9; // 壁の高さ（マス）
type LEl = { kind: 'room' | 'corr' | 'door'; r: R4; name?: string; door?: 'normal' | 'oneway' | 'fog' };
type Layer = { label: string; name: string; els: LEl[] };
const LAYERS: Layer[] = [
  {
    label: 'B1',
    name: '地下墓所',
    els: [
      { kind: 'room', r: [24, 0, 6, 6], name: '納骨堂' },
      { kind: 'corr', r: [26, 6, 2, 5] },
      { kind: 'door', r: [26, 11, 2, 1], door: 'fog' },
      { kind: 'room', r: [10, 12, 20, 4], name: '墓所の大広間' },
      { kind: 'corr', r: [5, 13, 5, 2] },
      { kind: 'room', r: [0, 8, 5, 8], name: '昇降機の底' },
      { kind: 'room', r: [17, 7, 6, 4], name: '骸骨の間' },
      { kind: 'door', r: [19, 6, 1, 1], door: 'normal' },
      { kind: 'corr', r: [10, 4, 13, 2], name: '地下水路' },
      { kind: 'door', r: [23, 4, 1, 1], door: 'normal' },
    ],
  },
  {
    label: '1F',
    name: '城下',
    els: [
      { kind: 'room', r: [0, 11, 6, 5], name: '篝火の間' },
      { kind: 'door', r: [1, 10, 2, 1], door: 'oneway' },
      { kind: 'room', r: [0, 6, 4, 4], name: '閂の小部屋' },
      { kind: 'door', r: [1, 5, 1, 1], door: 'normal' },
      { kind: 'room', r: [0, 1, 5, 4], name: '兵舎' },
      { kind: 'door', r: [6, 12, 1, 1], door: 'normal' },
      { kind: 'room', r: [7, 2, 15, 12], name: '大中庭' },
      { kind: 'door', r: [22, 3, 2, 1], door: 'normal' },
      { kind: 'room', r: [24, 0, 6, 6], name: '門楼' },
      { kind: 'corr', r: [24, 6, 2, 8] },
      { kind: 'room', r: [26, 10, 4, 6], name: '武器庫' },
    ],
  },
  {
    label: '2F',
    name: '城壁',
    els: [
      { kind: 'room', r: [1, 12, 6, 4], name: '見張り台' },
      { kind: 'corr', r: [2, 3, 2, 9] },
      { kind: 'corr', r: [2, 1, 24, 2], name: '城壁の通路' },
      { kind: 'room', r: [26, 0, 4, 5], name: '弓兵の塔' },
      { kind: 'door', r: [4, 5, 1, 1], door: 'normal' },
      { kind: 'room', r: [5, 4, 4, 4], name: '西の小塔' },
      { kind: 'corr', r: [14, 3, 1, 1] },
      { kind: 'room', r: [12, 4, 5, 4], name: '鐘楼' },
    ],
  },
];
type VKind = 'stairs' | 'drop' | 'ladder' | 'lift';
/** 階をまたぐ縦のつながり */
const VERTS: { kind: VKind; x: number; y: number; z0: number; z1: number; label: string }[] = [
  { kind: 'stairs', x: 4, y: 13, z0: 1, z1: 2, label: '階段' },
  { kind: 'drop', x: 27, y: 3, z0: 1, z1: 2, label: '飛び降り（一方通行）' },
  { kind: 'ladder', x: 28, y: 1, z0: 0, z1: 1, label: '梯子' },
  { kind: 'lift', x: 1, y: 8, z0: 0, z1: 1, label: '昇降機' },
];
type Way = { z: number; x: number; y: number; ev?: string; note?: string; pause?: number; to?: { z: number; kind: VKind } };
const ROUTE: Way[] = [
  { z: 1, x: 2, y: 13 },
  { z: 1, x: 2, y: 11, ev: 'gatecheck', note: '開かない — 向こう側から閂', pause: 0.9 },
  { z: 1, x: 4, y: 13, ev: 'up', note: '階段で城壁へ', pause: 0.1, to: { z: 2, kind: 'stairs' } },
  { z: 2, x: 6, y: 2, ev: 'archer', note: '塔の弓兵に狙われる — 胸壁に隠れて進む', pause: 0.4 },
  { z: 2, x: 25, y: 2, ev: 'archerdown', note: '塔の弓兵を倒す', pause: 0.8 },
  { z: 2, x: 27, y: 3, ev: 'drop', note: '飛び降りる — 戻れない一方通行', pause: 0.3, to: { z: 1, kind: 'drop' } },
  { z: 1, x: 28, y: 1, ev: 'ladder', note: '梯子で地下墓所へ', pause: 0.1, to: { z: 0, kind: 'ladder' } },
  { z: 0, x: 26, y: 8, ev: 'ambush', note: '天井から敵が落ちてくる → 返り討ち', pause: 1.0 },
  { z: 0, x: 26, y: 11, ev: 'fog', note: '霧の門 — この先にボス', pause: 0.9 },
  { z: 0, x: 21, y: 14, ev: 'boss', note: '墓所の主を撃破', pause: 1.8 },
  { z: 0, x: 1, y: 8, ev: 'lift', note: '昇降機で上へ', pause: 0.1, to: { z: 1, kind: 'lift' } },
  { z: 1, x: 1, y: 9, ev: 'shortcut', note: '閂を外す — 篝火への近道が開く', pause: 1.0 },
  { z: 1, x: 2, y: 13, ev: 'loop', note: '篝火に戻る — 輪がつながった', pause: 2.4 },
];
const SPEED = 10;
const V_DUR: Record<VKind, number> = { stairs: 0.8, drop: 0.45, ladder: 0.9, lift: 1.5 };
const ARCHER = { x: 27.5, y: 2.5 };
const BOSS_AT = { x: 23.5, y: 13.6 };

type Sample = { t: number; x: number; y: number; z: number };

export const legacy = (k: Kit): Scene => {
  const { ctx } = k;
  let cx = 0;
  let cy = 0;
  let cs = G;
  const P = (x: number, y: number, z: number, h = 0) => ({ x: cx + (x - y) * A * cs, y: cy + (x + y) * B * cs - (z * HZ + h) * cs });
  const layout = () => {
    // 横の幅：(LW + LH)·A、縦：(LW + LH)·B + 2 階ぶんの間隔 + 壁の高さ
    const spanX = (LW + LH) * A;
    const spanY = (LW + LH) * B + 2 * HZ + WH + 1;
    const raw = Math.min((k.width * 0.94) / spanX, (k.height - 70) / spanY);
    cs = raw >= G ? G : Math.max(8, Math.floor(raw));
    k.cs = cs;
    const minX = -LH * A;
    cx = Math.round(k.width / 2 - (minX + spanX / 2) * cs);
    const top = -(2 * HZ + WH);
    const bottom = (LW + LH) * B;
    cy = Math.round(k.height / 2 - ((top + bottom) / 2) * cs + 10);
  };

  const walk = LAYERS.map((L) => {
    const g = new Uint8Array(LW * LH);
    for (const e of L.els) for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++) for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) g[y * LW + x] = 1;
    return g;
  });
  const walkable = (z: number, x: number, y: number) => x >= 0 && y >= 0 && x < LW && y < LH && walk[z][y * LW + x] === 1;

  /* ---------- 段取り ---------- */
  let t = 0.3;
  const elAt: number[][] = LAYERS.map(() => []);
  const layerAt: number[] = [];
  LAYERS.forEach((L, z) => {
    layerAt[z] = t;
    t += 0.3;
    L.els.forEach((_, j) => (elAt[z][j] = t + j * 0.14));
    t += L.els.length * 0.14 + 0.2;
  });
  const vertAt = t;
  t += 0.8;
  const playStart = t;
  const samples: Sample[] = [{ t, x: ROUTE[0].x + 0.5, y: ROUTE[0].y + 0.5, z: ROUTE[0].z }];
  const notes: { t: number; text: string; hold: number }[] = [];
  const evAt: Record<string, number> = {};
  const ev = (name: string) => evAt[name] ?? Infinity;
  notes.push({ t, text: '篝火 · 休息（ここが拠点）', hold: 1.6 });
  evAt.bonfire = t;
  t += 1.2;
  samples.push({ t, x: samples[0].x, y: samples[0].y, z: samples[0].z });
  {
    let cur = { z: ROUTE[0].z, x: ROUTE[0].x, y: ROUTE[0].y };
    let shortcut = false;
    for (let i = 1; i < ROUTE.length; i++) {
      const w = ROUTE[i];
      const z = cur.z;
      const closed = (x: number, y: number) => LAYERS[z].els.some((e) => e.kind === 'door' && e.door === 'oneway' && !shortcut && inR(e.r, x, y));
      const pts = gridPath(LW, LH, (x, y) => walkable(z, x, y) && !closed(x, y), [cur.x, cur.y], [w.x, w.y]);
      if (import.meta.env.DEV && pts.length < 2) console.warn('[cover:legacy] unreachable leg', i);
      const len = polyLength(pts);
      const dur = len / SPEED;
      let acc = 0;
      for (let j = 1; j < pts.length; j++) {
        acc += Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y);
        samples.push({ t: t + (acc / Math.max(0.001, len)) * dur, x: pts[j].x, y: pts[j].y, z });
      }
      t += dur;
      if (w.ev) evAt[w.ev] = t;
      if (w.note) notes.push({ t, text: w.note, hold: (w.pause ?? 0) + 1.0 });
      if (w.ev === 'shortcut') shortcut = true;
      t += w.pause ?? 0;
      samples.push({ t, x: w.x + 0.5, y: w.y + 0.5, z });
      if (w.to) {
        const d = V_DUR[w.to.kind];
        const steps = 12;
        for (let s = 1; s <= steps; s++) {
          const kk = s / steps;
          const e = w.to.kind === 'drop' ? kk * kk : easeInOut(kk);
          samples.push({ t: t + d * kk, x: w.x + 0.5, y: w.y + 0.5, z: lerp(z, w.to.z, e) });
        }
        t += d;
        cur = { z: w.to.z, x: w.x, y: w.y };
      } else cur = { z, x: w.x, y: w.y };
    }
  }
  const end = t + 1.2;

  const playerAt = (tt: number) => {
    if (tt <= samples[0].t) return { pos: samples[0], idx: 0 };
    for (let i = 1; i < samples.length; i++) {
      const s = samples[i];
      if (s.t >= tt) {
        const p = samples[i - 1];
        const kk = clamp01((tt - p.t) / Math.max(0.0001, s.t - p.t));
        return { pos: { t: tt, x: lerp(p.x, s.x, kk), y: lerp(p.y, s.y, kk), z: lerp(p.z, s.z, kk) }, idx: i };
      }
    }
    return { pos: samples[samples.length - 1], idx: samples.length };
  };

  /* ---------- 描画 ---------- */
  const poly = (pts: { x: number; y: number }[]) => {
    const p = new Path2D();
    pts.forEach((q, i) => (i ? p.lineTo(q.x, q.y) : p.moveTo(q.x, q.y)));
    p.closePath();
    return p;
  };
  const rectAt = (r: R4, z: number, h = 0) => poly([P(r[0], r[1], z, h), P(r[0] + r[2], r[1], z, h), P(r[0] + r[2], r[1] + r[3], z, h), P(r[0], r[1] + r[3], z, h)]);

  const drawLayer = (z: number, tt: number, g: number, focus: number) => {
    const L = LAYERS[z];
    const la = clamp01((tt - layerAt[z]) / 0.5);
    if (la <= 0) return;
    const dim = lerp(0.62, 1, focus);
    // 階の板（下の階を少し隠す）
    const slab = rectAt([0, 0, LW, LH], z);
    ctx.fillStyle = pal.bg;
    ctx.globalAlpha *= 0.72 * la;
    ctx.fill(slab);
    ctx.globalAlpha /= 0.72 * la || 1;
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = INK(0.16 * la);
    ctx.lineWidth = 1;
    ctx.stroke(slab);
    ctx.setLineDash([]);
    const tagP = P(0, LH, z);
    k.label(`${L.label}  ${L.name}`, tagP.x - 8, tagP.y + 18, (0.45 + 0.4 * focus) * la, { size: 11, color: focus > 0.5 ? ACCENT : INK, align: 'right' });

    // 床
    L.els.forEach((e, i) => {
      const a = clamp01((tt - elAt[z][i]) / 0.3);
      if (a <= 0) return;
      ctx.fillStyle = e.kind === 'door' ? INK(0.05 * a * dim) : INK((e.kind === 'corr' ? 0.035 : 0.05) * a * dim);
      ctx.fill(rectAt(e.r, z));
    });
    // 壁：歩けるマスの境目を、床の線と壁の上端の線の 2 本で（立ち上がりが見える）
    const base = new Path2D();
    const top = new Path2D();
    const posts = new Path2D();
    const faces = new Path2D();
    L.els.forEach((e, i) => {
      const a = clamp01((tt - elAt[z][i]) / 0.3);
      if (a <= 0) return;
      for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++)
        for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) {
          const sides: [number, number, number, number, number, number][] = [
            [x, y - 1, x, y, x + 1, y],
            [x, y + 1, x, y + 1, x + 1, y + 1],
            [x - 1, y, x, y, x, y + 1],
            [x + 1, y, x + 1, y, x + 1, y + 1],
          ];
          for (const [nx, ny, x1, y1, x2, y2] of sides) {
            if (walkable(z, nx, ny)) continue;
            const p1 = P(x1, y1, z);
            const p2 = P(x2, y2, z);
            base.moveTo(p1.x, p1.y);
            base.lineTo(p2.x, p2.y);
            const q1 = P(x1, y1, z, WH);
            const q2 = P(x2, y2, z, WH);
            faces.moveTo(p1.x, p1.y);
            faces.lineTo(p2.x, p2.y);
            faces.lineTo(q2.x, q2.y);
            faces.lineTo(q1.x, q1.y);
            faces.closePath();
            top.moveTo(q1.x, q1.y);
            top.lineTo(q2.x, q2.y);
          }
        }
      if (e.kind !== 'door')
        for (const [x, y] of [
          [e.r[0], e.r[1]],
          [e.r[0] + e.r[2], e.r[1]],
          [e.r[0] + e.r[2], e.r[1] + e.r[3]],
          [e.r[0], e.r[1] + e.r[3]],
        ]) {
          const p = P(x, y, z);
          const q = P(x, y, z, WH);
          posts.moveTo(p.x, p.y);
          posts.lineTo(q.x, q.y);
        }
    });
    ctx.fillStyle = INK(0.07 * dim * la);
    ctx.fill(faces);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = INK(0.6 * dim * la);
    ctx.stroke(base);
    ctx.lineWidth = 1;
    ctx.strokeStyle = INK(0.34 * dim * la);
    ctx.stroke(top);
    ctx.stroke(posts);
    // 胸壁（城壁の通路の外側の凸凹）
    if (z === 2) {
      ctx.fillStyle = INK(0.3 * dim * la);
      for (let x = 2.3; x < 26; x += 1) {
        const q = P(x, 1, z, WH);
        ctx.fillRect(q.x - 2, q.y - 4, 4, 4);
      }
    }
    // 扉
    L.els.forEach((e, i) => {
      if (e.kind !== 'door') return;
      const a = clamp01((tt - elAt[z][i]) / 0.3) * dim;
      if (a <= 0) return;
      const [x, y, w, h] = e.r;
      const horizontal = w >= h; // 横長の扉：南北の通り抜け
      const m1 = horizontal ? P(x, y + 0.5, z) : P(x + 0.5, y, z);
      const m2 = horizontal ? P(x + w, y + 0.5, z) : P(x + 0.5, y + h, z);
      if (e.door === 'oneway') {
        const o = clamp01((tt - ev('shortcut')) / 0.5);
        if (o < 1) {
          ctx.beginPath();
          ctx.moveTo(m1.x, m1.y);
          ctx.lineTo(m2.x, m2.y);
          ctx.strokeStyle = ACCENT(0.9 * a * (1 - o));
          ctx.lineWidth = 3;
          ctx.stroke();
          k.iconLock((m1.x + m2.x) / 2 - 14, (m1.y + m2.y) / 2 - 2, a * (1 - o));
        }
      } else if (e.door === 'fog') {
        const gone = clamp01((tt - ev('boss')) / 0.8);
        if (gone < 1) {
          const wall = rectAt([x, y + 0.45, w, 0.1], z);
          ctx.fillStyle = ACCENT(0.14 * a * (1 - gone));
          ctx.fill(rectAt(e.r, z));
          ctx.strokeStyle = ACCENT(0.7 * a * (1 - gone));
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 0; s <= 6; s++) {
            const p = P(x + (w * s) / 6, y + 0.5, z, 0.25 + Math.sin(g * 4 + s) * 0.15);
            if (s) ctx.lineTo(p.x, p.y);
            else ctx.moveTo(p.x, p.y);
          }
          ctx.stroke();
          void wall;
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(m1.x, m1.y);
        ctx.lineTo(m2.x, m2.y);
        ctx.strokeStyle = INK(0.35 * a);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    // 部屋の名前（奥の角に）
    L.els.forEach((e, i) => {
      if (!e.name) return;
      const a = clamp01((tt - elAt[z][i] - 0.2) / 0.3);
      const p = P(e.r[0] + 0.4, e.r[1] + 0.4, z, WH);
      k.label(e.name, p.x + 4, p.y - 4, (0.3 + 0.35 * focus) * a, { size: 10 });
    });
  };

  const drawVerts = (tt: number) => {
    const a = clamp01((tt - vertAt) / 0.6);
    if (a <= 0) return;
    for (const v of VERTS) {
      const lo = P(v.x + 0.5, v.y + 0.5, v.z0);
      const hi = P(v.x + 0.5, v.y + 0.5, v.z1);
      ctx.beginPath();
      ctx.moveTo(hi.x, hi.y);
      ctx.lineTo(lo.x, lerp(hi.y, lo.y, a));
      ctx.lineWidth = v.kind === 'lift' ? 1.4 : 1;
      ctx.setLineDash(v.kind === 'drop' ? [3, 3] : v.kind === 'ladder' ? [1, 3] : []);
      const used = v.kind === 'lift' ? tt >= ev('lift') : v.kind === 'drop' ? tt >= ev('drop') : true;
      ctx.strokeStyle = (v.kind === 'drop' || v.kind === 'lift' ? ACCENT : INK)((used ? 0.7 : 0.45) * a);
      ctx.stroke();
      ctx.setLineDash([]);
      if (v.kind === 'stairs') {
        // 段のしるし
        ctx.beginPath();
        for (let s = 1; s < 8; s++) {
          const y = lerp(hi.y, lo.y, s / 8);
          ctx.moveTo(hi.x - 4, y);
          ctx.lineTo(hi.x + 4, y);
        }
        ctx.strokeStyle = INK(0.3 * a);
        ctx.stroke();
      }
      if (v.kind === 'drop') {
        ctx.beginPath();
        ctx.moveTo(lo.x - 4, lo.y - 7);
        ctx.lineTo(lo.x, lo.y - 2);
        ctx.lineTo(lo.x + 4, lo.y - 7);
        ctx.strokeStyle = ACCENT(0.8 * a);
        ctx.stroke();
      }
      if (v.kind === 'lift') {
        // 昇降機の籠：使うまでは下、使った後は上に止まる
        const li = ev('lift');
        const kk = tt < li ? 0 : easeInOut((tt - li - 0.1) / V_DUR.lift);
        const c = { x: lo.x, y: lerp(lo.y, hi.y, kk) };
        ctx.strokeStyle = ACCENT(0.8 * a);
        ctx.strokeRect(c.x - 7, c.y - 4, 14, 8);
      }
      const mid = { x: hi.x, y: (hi.y + lo.y) / 2 };
      k.label(v.label, mid.x + 8, mid.y + 3, 0.5 * a, { size: 9 });
    }
  };

  const drawActors = (tt: number, g: number) => {
    // 篝火
    const bf = P(2.5, 13.5, 1);
    k.iconFire(bf.x + 16, bf.y - 6, clamp01((tt - elAt[1][0]) / 0.4), tt >= ev('bonfire'), g);
    // 塔の弓兵：主人公が城壁の通路にいる間、矢を放つ
    const ar = P(ARCHER.x, ARCHER.y, 2);
    const downAt = ev('archerdown') + 0.1;
    if (tt > layerAt[2] + 0.5) {
      if (tt >= downAt) k.downed(ar.x, ar.y, 1, tt - downAt);
      else {
        const shooting = tt >= ev('archer') - 0.6;
        k.enemy(ar.x, ar.y, 1, Math.PI, 0, shooting);
        if (shooting) {
          const since = tt - (ev('archer') - 0.6);
          const n = Math.floor(since / 0.7);
          for (let i = Math.max(0, n - 1); i <= n; i++) {
            const fire = ev('archer') - 0.6 + i * 0.7;
            const kk = (tt - fire) / 0.45;
            if (kk < 0 || kk > 1 || fire >= downAt) continue;
            const target = playerAt(fire).pos;
            // 胸壁に当たって止まる（少し手前で）
            const ex = lerp(ARCHER.x, target.x, 0.9);
            const ey = lerp(ARCHER.y, target.y, 0.9) - 0.5;
            const hx = lerp(ARCHER.x, ex, kk);
            const hy = lerp(ARCHER.y, ey, kk);
            const tx = lerp(ARCHER.x, ex, Math.max(0, kk - 0.12));
            const ty = lerp(ARCHER.y, ey, Math.max(0, kk - 0.12));
            const h1 = P(hx, hy, 2, 0.5);
            const t1 = P(tx, ty, 2, 0.5);
            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.lineTo(h1.x, h1.y);
            ctx.strokeStyle = ACCENT(0.9);
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }
        }
      }
    }
    // 天井から落ちてくる敵
    const am = ev('ambush');
    if (tt > am - 0.55) {
      const fall = clamp01((tt - (am - 0.55)) / 0.4);
      const p = P(26.5, 7.6, lerp(1, 0, fall * fall));
      if (tt >= am + 0.35) k.downed(p.x, p.y, 1, tt - am - 0.35);
      else k.enemy(p.x, p.y, 1, undefined, 0, true);
    }
    // ボス
    const b = P(BOSS_AT.x, BOSS_AT.y, 0);
    if (tt > elAt[0][3]) {
      const cleared = tt >= ev('boss') + 1.0;
      k.iconBoss(b.x, b.y, clamp01((tt - elAt[0][3]) / 0.4), cleared, g);
      if (tt > ev('boss') - 0.2 && tt < ev('boss') + 1.2) {
        const r = rng(Math.floor(tt * 10));
        k.burst(b.x + (r() - 0.5) * 18, b.y + (r() - 0.5) * 10, (tt * 3) % 1, 4);
      }
    }
  };

  const render = (tt: number, g: number) => {
    layout();
    const pl = k.reduceMotion ? null : tt >= playStart ? playerAt(tt) : null;
    const focusZ = pl ? pl.pos.z : 1;
    for (let z = 0; z < LAYERS.length; z++) {
      const focus = clamp01(1 - Math.abs(focusZ - z));
      drawLayer(z, tt, g, k.reduceMotion ? 1 : focus);
    }
    drawVerts(tt);
    if (!k.reduceMotion) drawActors(tt, g);
    if (pl) {
      // 通った跡（階ごとに折れ線）
      const lines: Pt[][] = [];
      let line: Pt[] = [];
      for (let i = 0; i < pl.idx && i < samples.length; i++) {
        const s = samples[i];
        line.push(P(s.x, s.y, s.z));
      }
      line.push(P(pl.pos.x, pl.pos.y, pl.pos.z));
      lines.push(line);
      line = [];
      k.trail(lines, g, (p) => p);
      const q = P(pl.pos.x, pl.pos.y, pl.pos.z);
      // 立っている印（床から少し上に）
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x, q.y - 10);
      ctx.strokeStyle = ACCENT(0.8);
      ctx.lineWidth = 1.4;
      ctx.stroke();
      k.player(q.x, q.y - 10, g);
      for (const n of notes) {
        const since = tt - n.t;
        if (since < 0 || since > n.hold) continue;
        k.callout(q.x, q.y - 10, n.text, noteAlpha(since, n.hold), true);
      }
    }
    k.legend([
      ['床と壁（立ち上がり）', (x, y) => {
        k.swatchLine(x, y + 3, INK(0.5), 1.5);
        k.swatchLine(x, y - 3, INK(0.25), 1);
      }],
      ['階段 ／ 梯子', (x, y) => k.swatchLine(x, y, INK(0.5), 1, [1, 3])],
      ['飛び降り（一方通行）', (x, y) => k.swatchLine(x, y, ACCENT(0.8), 1, [3, 3])],
      ['昇降機', (x, y) => {
        ctx.strokeStyle = ACCENT(0.8);
        ctx.strokeRect(x - 7, y - 4, 14, 8);
      }],
      ['閂の扉（片側から開く）', (x, y) => k.swatchLine(x, y, ACCENT(0.9), 3)],
      ['霧の門', (x, y) => k.swatchBox(x, y, ACCENT(0.2), ACCENT(0.7))],
      ['篝火', (x, y) => k.iconFire(x, y, 1, true, 0)],
      ['プレイヤーの動線', (x, y) => k.swatchLine(x, y, ACCENT(0.75), 1.5, [3, 4])],
    ]);
    const phase = tt < playStart ? '分解アクソメ図' : tt < ev('shortcut') ? '攻略' : '近道で輪がつながった';
    const zLabel = pl ? LAYERS[Math.round(pl.pos.z)].label : '—';
    k.titleBlock(`STRONGHOLD — ${zLabel}`, phase, 'LEGACY DUNGEON', `${LAYERS.length} LEVELS · LOOP & SHORTCUT`);
  };

  return { end, still: playStart - 0.01, render };
};
