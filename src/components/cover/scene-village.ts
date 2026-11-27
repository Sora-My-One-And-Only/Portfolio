/**
 * 02 · 村（屋外の大きな地図・ハブ＆スポーク）
 * 湖（ロゴの位置）を囲んで、拠点の村から 5 つの領域へ道が延びる。村は何度も戻ってくるハブ。
 * 最初は領域が霧（斜線）に覆われていて、足を踏み入れると建物が描き込まれる。
 * 流れ：村に着く → 村人に囲まれ、家に立てこもって鐘が鳴るまで耐える → 商人 → 農場 → 城（追跡者に追われる・クランク）
 *      → 裏門から外へ（城の外までは追ってこない）→ ダムの水門を開けて水位を下げる（水没した道が通れる）
 *      → 工場の主を倒して紋章 A → 裏口から屋敷へ・紋章 B → 屋敷の正門を内から開けて村へ（輪）→ 教会の扉が開く
 * 道は点と辺のグラフで、主人公は道の上だけを通る。閉じた道（水没・施錠）は開くまで通らない。
 */
import { ACCENT, INK, Kit, clamp01, easeInOut, graphPath, lerp, noteAlpha, pal, partOf, pointAt, polyLength, rng, type Pt, type Scene } from './kit';

const W = 46;
const H = 28;
type P2 = [number, number];
type Zone = { id: string; name: string; pts: P2[]; at: P2 };
const ZONES: Zone[] = [
  { id: 'village', name: '村（拠点）', pts: [[14.6, 21.6], [19, 20.7], [26, 20.9], [31.6, 21.8], [32.4, 25], [30.4, 27.6], [23, 27.9], [15.6, 27.5], [14.2, 24.6]], at: [15.4, 21.3] },
  { id: 'farm', name: '農場', pts: [[2, 15.6], [7, 14.8], [11.4, 15.6], [12.8, 19], [12.4, 24.6], [9, 26.6], [4, 26.4], [1.6, 22]], at: [2.4, 14.9] },
  { id: 'castle', name: '城', pts: [[2, 1.2], [8, 0.6], [13.4, 1.4], [13.8, 7], [12.6, 12.6], [7.5, 13.2], [2.6, 12.4], [1.2, 6.6]], at: [2.2, 0.5] },
  { id: 'dam', name: '貯水池のダム', pts: [[15, 0.5], [23, 0.2], [31.2, 0.6], [31.6, 4.4], [23, 4.9], [14.8, 4.4]], at: [24.6, 0.1] },
  { id: 'factory', name: '工場', pts: [[33.4, 1.2], [39, 0.6], [44.6, 1.4], [44.8, 7], [44, 11], [38, 11.4], [33.2, 10.4], [32.8, 5]], at: [39.6, 0.5] },
  { id: 'manor', name: '屋敷', pts: [[33.6, 15.2], [39, 14.4], [44.6, 15.2], [44.8, 21], [44, 26.4], [38, 26.8], [33.4, 26], [32.8, 20]], at: [39.8, 14.1] },
];
const LAKE_C: P2 = [23, 13.4];
const NODES: Pt[] = [
  { x: 23, y: 27.3 }, // 0 村の入口
  { x: 23, y: 24.3 }, // 1 広場
  { x: 15.2, y: 23.6 }, // 2 西の門
  { x: 7.5, y: 21 }, // 3 農場
  { x: 7.5, y: 12.4 }, // 4 城の門
  { x: 7.5, y: 8.6 }, // 5 城の中庭
  { x: 6, y: 4.6 }, // 6 天守
  { x: 12.6, y: 3.2 }, // 7 城の裏門
  { x: 16.5, y: 2.6 }, // 8 ダムの西
  { x: 23, y: 2.4 }, // 9 水門
  { x: 29.5, y: 2.6 }, // 10 ダムの東
  { x: 34.4, y: 5.4 }, // 11 工場の門
  { x: 39.5, y: 6.2 }, // 12 工場の奥（ボス）
  { x: 30.8, y: 23.6 }, // 13 東の門
  { x: 34.4, y: 20.6 }, // 14 屋敷の正門
  { x: 39.5, y: 20.6 }, // 15 屋敷
  { x: 27.6, y: 22.6 }, // 16 教会
  { x: 19, y: 25.7 }, // 17 商人
  { x: 39.5, y: 12.9 }, // 18 工場の裏道
  { x: 20, y: 22.7 }, // 19 立てこもる家
];
const EDGES: [number, number][] = [
  [0, 1], [1, 17], [17, 2], [1, 19], [1, 16], [1, 13], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 18], [18, 15], [15, 14], [14, 13],
];
/** 開くまで通れない道：[a, b, 開く出来事, 閉じている理由] */
const GATES: [number, number, string, string][] = [
  [9, 10, 'drain', '水没した道'],
  [12, 18, 'boss', '工場の裏口（内から開く）'],
  [14, 15, 'manor', '屋敷の正門（閉ざされている）'],
  [1, 16, 'manor', '教会の扉（紋章 2 つ）'],
];
type Way = { n: number; ev?: string; note?: string; pause?: number };
const ROUTE: Way[] = [
  { n: 0 },
  { n: 1, ev: 'arrive', note: '村に着く — 村人が集まってくる', pause: 0.5 },
  { n: 19, ev: 'siege', note: '家に立てこもる · 鐘が鳴るまで耐える', pause: 4.4 },
  { n: 17, ev: 'merchant', note: '商人 · 武器を強化', pause: 0.9 },
  { n: 3, ev: 'farm' },
  { n: 5, ev: 'stalker', note: '大柄な追跡者が現れる', pause: 0.5 },
  { n: 6, ev: 'crank', note: '天守でクランクを入手', pause: 0.8 },
  { n: 7, ev: 'escape', note: '裏門から外へ — 城の外までは追ってこない', pause: 1.1 },
  { n: 9, ev: 'drain', note: 'クランクで水門を開く → 水位が下がる', pause: 1.6 },
  { n: 12, ev: 'boss', note: '工場の主を撃破 · 紋章 A', pause: 1.8 },
  { n: 15, ev: 'manor', note: '裏口から屋敷へ · 紋章 B', pause: 1.0 },
  { n: 13, ev: 'hub', note: '正門を内から開けて村へ — 道がつながる', pause: 0.9 },
  { n: 16, ev: 'church', note: '2 つの紋章で教会の扉が開く', pause: 2.4 },
];
/** 村人（立てこもりで家を囲む） */
const VILLAGERS: P2[] = [
  [16.4, 26.4], [25.4, 26.9], [28.6, 24.6], [30.2, 22.4], [17.2, 21.9], [23.6, 21.5], [26.8, 25.9],
];
/** 取らずに残す宝箱（その領域は「アイテムあり」のまま） */
const CHESTS: { zone: string; at: P2 }[] = [
  { zone: 'farm', at: [4.4, 24.4] },
  { zone: 'castle', at: [10.6, 10.6] },
];
const SPEED = 9;

type Leg = { pts: Pt[]; nodes: number[]; t0: number; t1: number; pause: number; ev?: string; note?: string };

const inPoly = (pts: P2[], x: number, y: number) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

export const village = (k: Kit): Scene => {
  const { ctx } = k;
  const X = k.X;
  const Y = k.Y;
  const px = (p: Pt) => ({ x: X(p.x), y: Y(p.y) });

  /** 角の丸い閉じた曲線（Catmull-Rom） */
  const smooth = (pts: P2[], sx = 1, c: P2 = [0, 0]) => {
    const q = pts.map(([x, y]) => [X(c[0] + (x - c[0]) * sx), Y(c[1] + (y - c[1]) * sx)] as P2);
    const path = new Path2D();
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const p0 = q[(i - 1 + n) % n];
      const p1 = q[i];
      const p2 = q[(i + 1) % n];
      const p3 = q[(i + 2) % n];
      if (i === 0) path.moveTo(p1[0], p1[1]);
      path.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    path.closePath();
    return path;
  };
  const perimeter = (pts: P2[]) => pts.reduce((s, p, i) => s + Math.hypot(p[0] - pts[(i + 1) % pts.length][0], p[1] - pts[(i + 1) % pts.length][1]), 0);

  // 湖の岸（少しゆがんだ楕円）
  const lakePts: P2[] = (() => {
    const r = rng(7);
    return Array.from({ length: 14 }, (_, i) => {
      const th = (i / 14) * Math.PI * 2;
      const j = 0.86 + r() * 0.22;
      return [LAKE_C[0] + Math.cos(th) * 8.2 * j, LAKE_C[1] + Math.sin(th) * 6 * j] as P2;
    });
  })();
  // 木（地図記号）：領域・道・湖から離れた空き地に
  const trees: P2[] = (() => {
    const r = rng(23);
    const out: P2[] = [];
    const nearRoad = (x: number, y: number) =>
      EDGES.some(([a, b]) => {
        const A = NODES[a];
        const B = NODES[b];
        const L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        const u = clamp01(((x - A.x) * (B.x - A.x) + (y - A.y) * (B.y - A.y)) / (L * L));
        return Math.hypot(A.x + (B.x - A.x) * u - x, A.y + (B.y - A.y) * u - y) < 1.2;
      });
    for (let i = 0; i < 400 && out.length < 70; i++) {
      const x = 0.8 + r() * (W - 1.6);
      const y = 0.8 + r() * (H - 1.6);
      if (ZONES.some((z) => inPoly(z.pts, x, y)) || inPoly(lakePts.map(([a, b]) => [LAKE_C[0] + (a - LAKE_C[0]) * 1.12, LAKE_C[1] + (b - LAKE_C[1]) * 1.12] as P2), x, y)) continue;
      if (nearRoad(x, y) || out.some(([a, b]) => Math.hypot(a - x, b - y) < 1.1)) continue;
      out.push([x, y]);
    }
    return out;
  })();
  const zoneOf = (p: Pt) => ZONES.findIndex((z) => inPoly(z.pts, p.x, p.y));
  /** 領域の輪郭：辺を細かく分けて、少しずつずらす（地形らしい凸凹） */
  const outlines: P2[][] = ZONES.map((z, zi) => {
    const r = rng(41 + zi);
    const out: P2[] = [];
    z.pts.forEach((a, i) => {
      const b = z.pts[(i + 1) % z.pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const n = Math.max(1, Math.round(len / 1.6));
      const nx = -(b[1] - a[1]) / (len || 1);
      const ny = (b[0] - a[0]) / (len || 1);
      for (let s = 0; s < n; s++) {
        const kk = s / n;
        const j = s === 0 ? 0 : (r() - 0.5) * 0.9;
        out.push([lerp(a[0], b[0], kk) + nx * j, lerp(a[1], b[1], kk) + ny * j]);
      }
    });
    return out;
  });

  /* ---------- 段取り ---------- */
  let t = 0.3;
  const lakeAt = t;
  t += 0.6;
  const zoneAt = ZONES.map((_, i) => t + i * 0.32);
  t += ZONES.length * 0.32;
  const roadAt = t;
  t += 1.0;
  const treeAt = t - 0.6;
  t += 0.4;
  const playStart = t;
  const evAt: Record<string, number> = {};
  const ev = (name: string) => evAt[name] ?? Infinity;
  const legs: Leg[] = [];
  const visitAt = ZONES.map(() => Infinity);
  {
    const done = new Set<string>();
    let cur = ROUTE[0].n;
    for (let i = 1; i < ROUTE.length; i++) {
      const w = ROUTE[i];
      const ids = graphPath(NODES, EDGES, cur, w.n, (a, b) => GATES.some(([g1, g2, open]) => ((g1 === a && g2 === b) || (g1 === b && g2 === a)) && !done.has(open)));
      if (import.meta.env.DEV && ids.length < 2) console.warn('[cover:village] unreachable leg', i);
      const pts = ids.map((n) => NODES[n]);
      const dur = polyLength(pts) / SPEED;
      // 領域に初めて入った時刻
      for (let s = 0; s <= 40; s++) {
        const z = zoneOf(pointAt(pts, s / 40));
        if (z >= 0 && visitAt[z] === Infinity) visitAt[z] = t + (dur * s) / 40;
      }
      legs.push({ pts, nodes: ids, t0: t, t1: t + dur, pause: w.pause ?? 0, ev: w.ev, note: w.note });
      t += dur;
      if (w.ev) {
        evAt[w.ev] = t;
        done.add(w.ev);
      }
      t += w.pause ?? 0;
      cur = w.n;
    }
    visitAt[0] = Math.min(visitAt[0], playStart);
  }
  const end = t + 1.2;
  const bellAt = ev('siege') + 3.0;

  const playerAt = (tt: number) => {
    let pos: Pt = NODES[ROUTE[0].n];
    const trail: Pt[][] = [];
    let note: { text: string; a: number; strong: boolean } | null = null;
    for (const leg of legs) {
      if (tt < leg.t0) break;
      if (tt < leg.t1) {
        const p = (tt - leg.t0) / (leg.t1 - leg.t0);
        pos = pointAt(leg.pts, p);
        trail.push(partOf(leg.pts, p));
        return { pos, trail, note };
      }
      trail.push(leg.pts);
      pos = leg.pts[leg.pts.length - 1];
      const since = tt - leg.t1;
      if (leg.note && since < leg.pause + 1.0) note = { text: leg.note, a: noteAlpha(since, leg.pause + 1.0), strong: true };
    }
    return { pos, trail, note };
  };
  const posAt = (tt: number) => playerAt(tt).pos;

  /* ---------- 描画 ---------- */
  const drawLake = (tt: number) => {
    const a = clamp01((tt - lakeAt) / 0.6);
    if (a <= 0) return;
    const drained = easeInOut((tt - ev('drain')) / 2.2);
    const s = lerp(1, 0.7, drained);
    // 等高線（岸の外側）
    ctx.setLineDash([2, 4]);
    for (const c of [1.2, 1.42]) {
      ctx.strokeStyle = INK(0.14 * a);
      ctx.lineWidth = 1;
      ctx.stroke(smooth(lakePts, c, LAKE_C));
    }
    ctx.setLineDash([]);
    // 水位が下がった跡（元の岸を薄く）
    if (drained > 0) {
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = INK(0.22 * a);
      ctx.stroke(smooth(lakePts, 1, LAKE_C));
      ctx.setLineDash([]);
    }
    const water = smooth(lakePts, s, LAKE_C);
    ctx.fillStyle = INK(0.03 * a);
    ctx.fill(water);
    ctx.save();
    ctx.clip(water);
    ctx.beginPath();
    for (let y = Y(LAKE_C[1] - 7); y < Y(LAKE_C[1] + 7); y += 7)
      for (let x = X(LAKE_C[0] - 9) + ((y / 7) % 2) * 9; x < X(LAKE_C[0] + 9); x += 18) {
        ctx.moveTo(x, y + 0.5);
        ctx.lineTo(x + 8, y + 0.5);
      }
    ctx.strokeStyle = INK(0.12 * a);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = INK(0.42 * a);
    ctx.lineWidth = 1.4;
    ctx.stroke(water);
  };

  const drawTrees = (tt: number) => {
    const a = clamp01((tt - treeAt) / 0.8);
    if (a <= 0) return;
    ctx.strokeStyle = INK(0.2 * a);
    ctx.lineWidth = 1;
    const r = k.cs * 0.28;
    ctx.beginPath();
    for (const [x, y] of trees) {
      ctx.moveTo(X(x) + r, Y(y));
      ctx.arc(X(x), Y(y), r, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.fillStyle = INK(0.22 * a);
    for (const [x, y] of trees) ctx.fillRect(X(x) - 0.75, Y(y) - 0.75, 1.5, 1.5);
  };

  const drawRoads = (tt: number) => {
    const a = clamp01((tt - roadAt) / 1.0);
    if (a <= 0) return;
    ctx.lineCap = 'round';
    for (const [i, j] of EDGES) {
      const A = px(NODES[i]);
      const B = px(NODES[j]);
      const Bk = { x: lerp(A.x, B.x, a), y: lerp(A.y, B.y, a) };
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(Bk.x, Bk.y);
      ctx.strokeStyle = INK(0.07);
      ctx.lineWidth = k.cs * 0.5;
      ctx.stroke();
      ctx.strokeStyle = INK(0.3);
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.lineCap = 'butt';
    // 閉じた道
    for (const [i, j, open, why] of GATES) {
      const A = NODES[i];
      const B = NODES[j];
      const m = px({ x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 });
      const o = clamp01((tt - ev(open)) / 0.6);
      if (o >= 1) continue;
      if (open === 'drain') {
        // 水没：道の上の波線
        ctx.beginPath();
        const dx = px(B).x - px(A).x;
        for (let s = 0.2; s < 0.8; s += 0.06) {
          const p = px({ x: lerp(A.x, B.x, s), y: lerp(A.y, B.y, s) });
          ctx.moveTo(p.x - 4, p.y + 3);
          ctx.quadraticCurveTo(p.x - 2, p.y, p.x, p.y + 3);
          void dx;
        }
        ctx.strokeStyle = INK(0.45 * a * (1 - o));
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        const ang = Math.atan2(px(B).y - px(A).y, px(B).x - px(A).x) + Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(m.x - Math.cos(ang) * 8, m.y - Math.sin(ang) * 8);
        ctx.lineTo(m.x + Math.cos(ang) * 8, m.y + Math.sin(ang) * 8);
        ctx.strokeStyle = ACCENT(0.85 * a * (1 - o));
        ctx.lineWidth = 2.4;
        ctx.stroke();
        k.iconLock(m.x + 12, m.y - 8, a * (1 - o));
      }
      if (tt > playStart && tt < ev(open)) k.label(why, m.x + 10, m.y + 16, 0.45 * a * (1 - o), { size: 9 });
    }
  };

  /** 領域の中の建物（足を踏み入れると描き込まれる） */
  const drawDetail = (id: string, a: number, tt: number, g: number) => {
    const cs = k.cs;
    const box = (x: number, y: number, w: number, h: number, alpha = 0.5) => {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(X(x), Y(y), w * cs, h * cs);
      ctx.strokeStyle = INK(alpha * a);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(X(x) + 0.5, Y(y) + 0.5, w * cs, h * cs);
      ctx.beginPath();
      ctx.moveTo(X(x), Y(y));
      ctx.lineTo(X(x + w), Y(y + h));
      ctx.strokeStyle = INK(alpha * 0.4 * a);
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    ctx.lineWidth = 1.2;
    if (id === 'village') {
      for (const r of [
        [16.4, 22.4, 1.8, 1.2],
        [17.6, 26.3, 1.6, 1],
        [25, 25.8, 1.8, 1.1],
        [28.6, 25.2, 1.4, 1.5],
        [20.8, 26.4, 1.4, 0.9],
        [24.6, 21.6, 1.4, 1],
        [29.6, 22.6, 1.2, 1],
      ])
        box(r[0], r[1], r[2], r[3], 0.42);
      box(19.3, 21.4, 1.5, 1.1, 0.6); // 立てこもる家
      // 教会（十字）
      box(26.9, 21.1, 2.0, 1.2, 0.6);
      const c = px({ x: 27.9, y: 20.6 });
      ctx.beginPath();
      ctx.moveTo(c.x, c.y - 6);
      ctx.lineTo(c.x, c.y + 4);
      ctx.moveTo(c.x - 3.5, c.y - 3);
      ctx.lineTo(c.x + 3.5, c.y - 3);
      ctx.strokeStyle = INK(0.6 * a);
      ctx.stroke();
      // 井戸
      const w = px({ x: 22.1, y: 23.5 });
      ctx.beginPath();
      ctx.arc(w.x, w.y, 4, 0, Math.PI * 2);
      ctx.stroke();
      // 商人の天幕
      const m = px({ x: 18.6, y: 25 });
      ctx.beginPath();
      ctx.moveTo(m.x - 7, m.y + 5);
      ctx.lineTo(m.x, m.y - 6);
      ctx.lineTo(m.x + 7, m.y + 5);
      ctx.closePath();
      ctx.fillStyle = ACCENT((tt >= ev('merchant') ? 0.12 : 0.25) * a);
      ctx.fill();
      ctx.strokeStyle = ACCENT(0.8 * a);
      ctx.stroke();
      k.label('商人', m.x + 10, m.y + 8, 0.6 * a, { size: 9 });
    }
    if (id === 'farm') {
      box(4, 16.6, 3, 2, 0.55);
      k.label('納屋', X(4) + 4, Y(16.6) - 4, 0.5 * a, { size: 9 });
      ctx.strokeStyle = INK(0.25 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [x0, y0, w, h] of [
        [2.8, 21.6, 3.6, 2.2],
        [8.6, 16.8, 2.8, 3.2],
        [9, 22.4, 2.6, 2.4],
      ]) {
        ctx.rect(X(x0) + 0.5, Y(y0) + 0.5, w * cs, h * cs);
        for (let yy = y0 + 0.4; yy < y0 + h; yy += 0.4) {
          ctx.moveTo(X(x0) + 2, Y(yy) + 0.5);
          ctx.lineTo(X(x0 + w) - 2, Y(yy) + 0.5);
        }
      }
      ctx.stroke();
    }
    if (id === 'castle') {
      // 城壁と塔（4 隅）、天守
      ctx.strokeStyle = INK(0.6 * a);
      ctx.lineWidth = 2;
      ctx.strokeRect(X(3) + 0.5, Y(2) + 0.5, 9 * cs, 9.8 * cs);
      ctx.fillStyle = pal.bg;
      ctx.fillRect(X(7.1), Y(11.6), 0.8 * cs, 0.4 * cs);
      ctx.fillRect(X(11.8), Y(2.8), 0.4 * cs, 0.8 * cs);
      for (const [x, y] of [
        [3, 2],
        [12, 2],
        [3, 11.8],
        [12, 11.8],
      ]) {
        ctx.beginPath();
        ctx.arc(X(x), Y(y), cs * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = pal.bg;
        ctx.fill();
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      box(4.2, 3, 3.6, 2.8, 0.6);
      k.label('天守', X(4.4), Y(3) - 4, 0.5 * a, { size: 9 });
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = INK(0.25 * a);
      ctx.lineWidth = 1;
      ctx.strokeRect(X(5) + 0.5, Y(7.2) + 0.5, 5 * cs, 3 * cs);
      ctx.setLineDash([]);
      k.label('中庭', X(8.6), Y(7.2) - 4, 0.45 * a, { size: 9 });
    }
    if (id === 'dam') {
      ctx.strokeStyle = INK(0.6 * a);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(X(15.6), Y(3.6));
      ctx.lineTo(X(30.6), Y(3.6));
      ctx.stroke();
      // 水門
      const open = clamp01((tt - ev('drain')) / 0.6);
      ctx.fillStyle = pal.bg;
      ctx.fillRect(X(22.2), Y(3.3), 1.6 * cs, 0.6 * cs);
      ctx.strokeStyle = ACCENT(0.85 * a);
      ctx.lineWidth = 1.4;
      ctx.strokeRect(X(22.2) + 0.5, Y(3.3) + 0.5, 1.6 * cs, 0.6 * cs);
      if (open > 0) {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const yy = Y(4.2) + ((g * 18 + i * 8) % 22);
          ctx.moveTo(X(22.5) + i * 7, yy);
          ctx.lineTo(X(22.5) + i * 7, yy + 6);
        }
        ctx.strokeStyle = INK(0.4 * open * a);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      k.label('水門', X(24), Y(3.2) - 2, 0.55 * a, { size: 9 });
    }
    if (id === 'factory') {
      box(35.4, 2, 7.6, 3, 0.55);
      // のこぎり屋根
      ctx.beginPath();
      for (let x = 35.4; x < 43; x += 1.27) {
        ctx.moveTo(X(x), Y(2));
        ctx.lineTo(X(x + 0.63), Y(1.4));
        ctx.lineTo(X(x + 1.27), Y(2));
      }
      ctx.strokeStyle = INK(0.45 * a);
      ctx.lineWidth = 1;
      ctx.stroke();
      for (const x of [36.4, 41.8]) {
        ctx.beginPath();
        ctx.arc(X(x), Y(9.4), cs * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
      box(37.2, 8.6, 3, 1.6, 0.4);
    }
    if (id === 'manor') {
      box(37, 16.6, 5, 2.8, 0.6);
      box(35.8, 17.4, 1.2, 1.8, 0.45);
      box(42, 17.4, 1.2, 1.8, 0.45);
      // 庭の小道と生け垣
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = INK(0.3 * a);
      ctx.lineWidth = 1;
      ctx.strokeRect(X(35.4) + 0.5, Y(22) + 0.5, 8.4 * cs, 3.4 * cs);
      ctx.setLineDash([]);
    }
  };

  const drawZones = (tt: number, g: number) => {
    ZONES.forEach((z, i) => {
      const a = clamp01((tt - zoneAt[i]) / 0.6);
      if (a <= 0) return;
      const path = smooth(outlines[i]);
      const revealed = clamp01((tt - visitAt[i]) / 0.8);
      const hasChest = CHESTS.some((c) => c.zone === z.id);
      const cleared = !hasChest && revealed > 0;
      // 床の色：未踏（霧）→ アイテムあり → 探索済み
      if (revealed > 0) {
        ctx.fillStyle = hasChest ? ACCENT(0.04 * revealed) : INK(0.04 * revealed);
        ctx.fill(path);
      }
      if (revealed < 1) k.hatch(path, INK(0.07 * a * (1 - revealed)), 7);
      // 輪郭を描いていく
      const per = perimeter(outlines[i]) * k.cs * 1.15;
      ctx.setLineDash([per * a, per]);
      ctx.strokeStyle = INK(0.45);
      ctx.lineWidth = 1.6;
      ctx.stroke(path);
      ctx.setLineDash([]);
      k.label(z.name, X(z.at[0]), Y(z.at[1]) + 2, (revealed > 0 ? 0.7 : 0.45) * a, { size: 11 });
      if (!k.reduceMotion && revealed > 0) drawDetail(z.id, revealed, tt, g);
      if (cleared && tt > playStart && k.showText()) {
        const lx = X(z.at[0]) - 10;
        const ly = Y(z.at[1]) - 2;
        ctx.strokeStyle = INK(0.55 * revealed);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(lx - 4, ly);
        ctx.lineTo(lx - 1, ly + 3);
        ctx.lineTo(lx + 4, ly - 3);
        ctx.stroke();
      }
      CHESTS.filter((c) => c.zone === z.id).forEach((c) => revealed > 0 && k.iconChest(X(c.at[0]), Y(c.at[1]), revealed));
    });
    if (k.reduceMotion) ZONES.forEach((z) => drawDetail(z.id, 1, tt, g));
  };

  /** 立てこもり：村人が家を囲み、鐘が鳴ると教会へ引き上げる */
  const drawVillagers = (tt: number) => {
    if (tt < playStart - 0.6) return;
    const a0 = clamp01((tt - (playStart - 0.6)) / 0.6);
    const arrive = ev('arrive') - 0.6;
    const siege = ev('siege');
    const refuge = NODES[19];
    const church = NODES[16];
    VILLAGERS.forEach(([hx, hy], i) => {
      const th = (i / VILLAGERS.length) * Math.PI * 2 + 0.3;
      const slot = { x: refuge.x + Math.cos(th) * 1.9, y: refuge.y + Math.sin(th) * 1.5 };
      let p = { x: hx + Math.sin(tt * 0.7 + i) * 0.3, y: hy };
      let a = a0;
      let alert = false;
      if (tt >= arrive && tt < bellAt) {
        const kk = easeInOut((tt - arrive) / (siege + 1.0 - arrive));
        p = { x: lerp(hx, slot.x, kk), y: lerp(hy, slot.y, kk) };
        alert = true;
      } else if (tt >= bellAt) {
        const kk = easeInOut((tt - bellAt - i * 0.08) / 2.2);
        p = { x: lerp(slot.x, church.x, kk), y: lerp(slot.y, church.y, kk) };
        a = a0 * (1 - kk);
      }
      if (a <= 0.01) return;
      const q = px(p);
      const face = Math.atan2(refuge.y - p.y, refuge.x - p.x);
      k.enemy(q.x, q.y, a, alert ? face : undefined, alert ? k.cs * 1.2 : 0, false);
    });
    // 鐘の音
    const since = tt - bellAt;
    if (since > 0 && since < 2.4) {
      const c = px(church);
      for (let i = 0; i < 3; i++) {
        const kk = (since * 1.2 + i / 3) % 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y - 10, 6 + kk * 26, 0, Math.PI * 2);
        ctx.strokeStyle = ACCENT(0.5 * (1 - kk));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      k.callout(c.x, c.y - 10, '鐘が鳴る → 村人が引き上げる', noteAlpha(since, 2.4), true);
    }
    // 立てこもりの残り時間（家のまわりの円弧）
    if (tt >= siege && tt < bellAt) {
      const c = px(refuge);
      const kk = (tt - siege) / (bellAt - siege);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, -Math.PI / 2, -Math.PI / 2 + kk * Math.PI * 2);
      ctx.strokeStyle = ACCENT(0.8);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  /** 城の追跡者：主人公の足跡を少し遅れてたどる。城の外までは出てこない */
  const drawStalker = (tt: number) => {
    const spawn = ev('stalker') - 0.2;
    if (tt < spawn) return;
    const escape = ev('escape');
    const a = clamp01((tt - spawn) / 0.4);
    const lag = 1.0;
    const freeze = escape - 0.55;
    const tp = Math.min(tt - lag, freeze);
    const p = tp < ev('stalker') - 0.6 ? { x: 9.6, y: 7.6 } : posAt(tp);
    const ahead = posAt(Math.min(tt, freeze) - lag + 0.1);
    const face = Math.atan2(ahead.y - p.y, ahead.x - p.x);
    const q = px(p);
    const chasing = tt < escape + 0.2;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT(0.8 * a);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    k.enemy(q.x, q.y, a, chasing ? face : Math.PI / 4, k.cs * 1.6, chasing);
    if (tt > escape + 0.4) k.label('追跡者（城の中だけ）', q.x - 20, q.y + 22, 0.55 * a, { size: 9 });
  };

  const drawBoss = (tt: number, g: number) => {
    if (tt < visitAt[4]) return;
    const b = px(NODES[12]);
    const fightT = ev('boss');
    const cleared = tt >= fightT + 1.2;
    k.iconBoss(b.x + 16, b.y - 14, clamp01((tt - visitAt[4]) / 0.5), cleared, g);
    if (tt > fightT - 0.2 && tt < fightT + 1.4) {
      const r = rng(Math.floor(tt * 10));
      k.burst(b.x + 16 + (r() - 0.5) * 16, b.y - 14 + (r() - 0.5) * 16, (tt * 3) % 1, 4);
    }
  };

  const render = (tt: number, g: number) => {
    k.fit(W, H);
    drawLake(tt);
    drawTrees(tt);
    drawZones(tt, g);
    drawRoads(tt);
    if (!k.reduceMotion) {
      drawVillagers(tt);
      drawStalker(tt);
      drawBoss(tt, g);
      // 紋章のくぼみ（教会）
      const c = px(NODES[16]);
      if (tt > playStart) {
        ctx.lineWidth = 1.2;
        [ev('boss'), ev('manor')].forEach((at, i) => {
          ctx.beginPath();
          ctx.arc(c.x + 18 + i * 12, c.y - 18, 4, 0, Math.PI * 2);
          ctx.strokeStyle = ACCENT(0.8);
          ctx.stroke();
          if (tt >= at) {
            ctx.fillStyle = ACCENT(0.7);
            ctx.fill();
          }
        });
      }
      if (tt >= playStart) {
        const pl = playerAt(tt);
        k.trail(pl.trail, g, px);
        const q = px(pl.pos);
        k.player(q.x, q.y, g);
        if (pl.note) k.callout(q.x, q.y, pl.note.text, pl.note.a, pl.note.strong);
      }
    }
    k.legend([
      ['未踏の地（霧）', (x, y) => {
        const p = new Path2D();
        p.rect(x - 6, y - 5, 12, 10);
        k.hatch(p, INK(0.4), 3);
        k.swatchBox(x, y, null);
      }],
      ['アイテムが残る', (x, y) => k.swatchBox(x, y, ACCENT(0.25))],
      ['探索済み', (x, y) => k.swatchBox(x, y, INK(0.15))],
      ['道', (x, y) => k.swatchLine(x, y, INK(0.45), 1, [5, 4])],
      ['閉ざされた道', (x, y) => k.swatchLine(x, y, ACCENT(0.9), 2.4)],
      ['敵 ／ 追跡者', (x, y) => k.enemy(x, y, 1)],
      ['プレイヤーの動線', (x, y) => k.swatchLine(x, y, ACCENT(0.75), 1.5, [3, 4])],
    ]);
    const seen = visitAt.filter((v) => tt >= v).length;
    const phase = tt < playStart ? '全体図' : tt < ev('hub') ? '探索' : 'ハブに道がつながった';
    k.titleBlock('VILLAGE — HUB & SPOKE', phase, `AREA ${seen}/${ZONES.length}`, 'OUTDOOR · 5 DOMAINS');
  };

  return { end, still: playStart + 0.01, render };
};
