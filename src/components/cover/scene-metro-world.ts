/**
 * 05 · 世界地図（メトロイドヴァニア型・複数のエリアからなる全体図）
 * 6 つのエリアが王城（ロゴの位置）を囲み、各エリアの中には小部屋が並ぶ（1 マス＝ゲームの 1 画面）。
 * エリアどうしは能力で開く関門でつながる：ダッシュ（裂け目）・二段ジャンプ（高い段差）・潜水（水没した通路）・3 つの印（王城の門）。
 * 最初はエリアの枠だけの全体図。エリアに入ると中の部屋割りが見え、通った部屋が塗られていく。
 * 流れ：村 → 水没した水道は通れない → 森の関門（ダッシュが必要）→ 森の主からダッシュ → 時計塔で二段ジャンプ
 *      → 氷の洞窟で潜水 → 地底湖 → 潜水で水道を抜けて村へ（近道）→ 森を抜けて王城の門へ（3 つの印）
 * 始まりの村の中だけを拡大して見せ、村を出ると全体へ引いていく。
 */
import { ACCENT, G, INK, Kit, clamp01, easeInOut, inR, lerp, noteAlpha, pal, partOf, pointAt, polyLength, rng, type Pt, type R4, type Scene } from './kit';

const W = 46;
const H = 27;
type AreaSpec = { name: string; r: R4; seed: number; force: R4[] };
const AREAS: AreaSpec[] = [
  { name: '始まりの村', r: [1, 18, 12, 8], seed: 11, force: [[2, 23, 2, 2], [6, 18, 1, 1], [12, 23, 1, 1]] },
  { name: '囁きの森', r: [1, 4, 12, 13], seed: 12, force: [[2, 5, 2, 2], [6, 16, 1, 1], [12, 5, 1, 1], [12, 12, 1, 1]] },
  { name: '時計塔', r: [14, 0, 18, 7], seed: 13, force: [[28, 1, 2, 2], [14, 5, 1, 1], [31, 3, 1, 1], [20, 3, 2, 1]] },
  { name: '氷の洞窟', r: [33, 1, 12, 13], seed: 14, force: [[42, 9, 2, 2], [33, 3, 1, 1], [39, 13, 1, 1]] },
  { name: '地底湖', r: [33, 15, 12, 11], seed: 15, force: [[39, 15, 1, 1], [33, 23, 1, 1], [40, 21, 2, 2]] },
  { name: '地下水道', r: [14, 21, 18, 5], seed: 16, force: [[14, 23, 1, 1], [31, 23, 1, 1]] },
];
const CASTLE: R4 = [14, 8, 18, 12];
type Need = 'none' | 'dash' | 'djump' | 'swim' | 'seal';
/** 関門：通路のマスと、その両端のマス、開ける能力 */
const GATES: { at: [number, number]; a: [number, number]; b: [number, number]; need: Need }[] = [
  { at: [6, 17], a: [6, 18], b: [6, 16], need: 'none' },
  { at: [13, 23], a: [12, 23], b: [14, 23], need: 'swim' },
  { at: [13, 5], a: [12, 5], b: [14, 5], need: 'dash' },
  { at: [32, 3], a: [31, 3], b: [33, 3], need: 'djump' },
  { at: [39, 14], a: [39, 13], b: [39, 15], need: 'none' },
  { at: [32, 23], a: [33, 23], b: [31, 23], need: 'swim' },
  { at: [13, 12], a: [12, 12], b: [14, 12], need: 'seal' },
];
const NEED_LABEL: Record<Need, string> = { none: '', dash: 'ダッシュ', djump: '二段ジャンプ', swim: '潜水', seal: '3 つの印' };
/** 特別な部屋：[x, y, 種類, 能力] */
const SPECIAL: { at: [number, number]; kind: 'start' | 'boss' | 'save'; gives?: Need }[] = [
  { at: [2, 23], kind: 'start' },
  { at: [2, 5], kind: 'boss', gives: 'dash' },
  { at: [28, 1], kind: 'boss', gives: 'djump' },
  { at: [42, 9], kind: 'boss', gives: 'swim' },
  { at: [40, 21], kind: 'save' },
  { at: [20, 3], kind: 'save' },
];
type Way = { x: number; y: number; ev?: string; note?: string; pause?: number; gives?: Need };
const ROUTE: Way[] = [
  { x: 2, y: 23 },
  { x: 12, y: 23, ev: 'flooded', note: '水没した通路 — 潜水が必要', pause: 0.9 },
  { x: 12, y: 5, ev: 'rift', note: '裂け目 — ダッシュが必要', pause: 0.9 },
  { x: 2, y: 5, ev: 'dash', note: '森の主を倒す · ダッシュを入手', pause: 1.1, gives: 'dash' },
  { x: 28, y: 1, ev: 'djump', note: '時計塔の主 · 二段ジャンプを入手', pause: 1.1, gives: 'djump' },
  { x: 42, y: 9, ev: 'swim', note: '氷の洞窟の主 · 潜水を入手', pause: 1.1, gives: 'swim' },
  { x: 40, y: 21, ev: 'save', note: 'セーブ', pause: 0.6 },
  { x: 3, y: 24, ev: 'home', note: '潜水で水道を抜けて村へ — 近道', pause: 1.0 },
  { x: 14, y: 12, ev: 'seal', note: '3 つの印で王城の門が開く', pause: 2.4 },
];
const SPEED = 12;

type Room = { r: R4; area: number; gone?: boolean };

export const metroWorld = (k: Kit): Scene => {
  const { ctx } = k;

  /* ---------- 部屋割り（エリアごとに決まった種で埋める） ---------- */
  const rooms: Room[] = [];
  const cellRoom = new Int16Array(W * H).fill(-1);
  const place = (r: R4, area: number) => {
    const id = rooms.length;
    rooms.push({ r, area });
    for (let y = r[1]; y < r[1] + r[3]; y++) for (let x = r[0]; x < r[0] + r[2]; x++) cellRoom[y * W + x] = id;
  };
  const free = (r: R4, area: R4) => {
    for (let y = r[1]; y < r[1] + r[3]; y++)
      for (let x = r[0]; x < r[0] + r[2]; x++) if (!inR(area, x, y) || cellRoom[y * W + x] !== -1) return false;
    return true;
  };
  const SHAPES: [number, number][] = [[1, 1], [2, 1], [2, 1], [3, 1], [3, 1], [4, 1], [5, 1], [6, 1], [1, 2], [1, 3], [1, 4], [2, 2], [2, 2], [3, 2]];
  /** エリアごとに、決め打ちの部屋の id がこれより小さい（削らない） */
  const forcedCount: number[] = [];
  AREAS.forEach((A, ai) => {
    const r = rng(A.seed);
    A.force.forEach((f) => place(f, ai));
    forcedCount[ai] = rooms.length;
    for (let y = A.r[1]; y < A.r[1] + A.r[3]; y++)
      for (let x = A.r[0]; x < A.r[0] + A.r[2]; x++) {
        if (cellRoom[y * W + x] !== -1) continue;
        const order = [...SHAPES].sort(() => r() - 0.5);
        for (const [w, h] of order) {
          const cand: R4 = [x, y, w, h];
          if (free(cand, A.r)) {
            place(cand, ai);
            break;
          }
        }
      }
  });
  // 扉：隣り合う部屋の組を全域木でつなぎ、ところどころ輪を足す
  const doors = new Set<string>();
  const doorList: [number, number][] = [];
  const key = (a: number, b: number) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  {
    const r = rng(99);
    const pairs = new Map<string, [number, number][]>();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = y * W + x;
        const a = cellRoom[c];
        if (a < 0) continue;
        for (const n of [x + 1 < W ? c + 1 : -1, y + 1 < H ? c + W : -1]) {
          if (n < 0) continue;
          const b = cellRoom[n];
          if (b < 0 || b === a || rooms[a].area !== rooms[b].area) continue;
          const kk = key(a, b);
          if (!pairs.has(kk)) pairs.set(kk, []);
          pairs.get(kk)!.push([c, n]);
        }
      }
    const parent = rooms.map((_, i) => i);
    const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const entries = [...pairs.entries()].sort(() => r() - 0.5);
    for (const [kk, cells] of entries) {
      const [a, b] = kk.split('|').map(Number);
      const join = find(a) !== find(b);
      if (join || r() < 0.3) {
        if (join) parent[find(a)] = find(b);
        const [c, n] = cells[Math.floor(r() * cells.length)];
        doorList.push([c, n]);
      }
    }
    // 行き止まりの小部屋をところどころ削って、エリアの輪郭に凹凸をつける（つながりは保たれる）
    const deg = rooms.map(() => 0);
    doorList.forEach(([c, n]) => {
      deg[cellRoom[c]]++;
      deg[cellRoom[n]]++;
    });
    const pr = rng(7);
    rooms.forEach((R, i) => {
      if (i < forcedCount[R.area] || deg[i] !== 1 || pr() > 0.5) return;
      R.gone = true;
      for (let y = R.r[1]; y < R.r[1] + R.r[3]; y++) for (let x = R.r[0]; x < R.r[0] + R.r[2]; x++) cellRoom[y * W + x] = -1;
    });
    for (let i = doorList.length - 1; i >= 0; i--) {
      const [c, n] = doorList[i];
      if (cellRoom[c] < 0 || cellRoom[n] < 0) doorList.splice(i, 1);
      else doors.add(key(c, n));
    }
  }
  const gateAt = new Map<number, number>();
  GATES.forEach((g, i) => gateAt.set(g.at[1] * W + g.at[0], i));

  /* ---------- 道筋 ---------- */
  const have = new Set<Need>(['none']);
  const gateOpen = (i: number) => (GATES[i].need === 'seal' ? have.has('dash') && have.has('djump') && have.has('swim') : have.has(GATES[i].need));
  const pass = (c: number, n: number) => {
    const a = cellRoom[c];
    const b = cellRoom[n];
    if (a >= 0 && a === b) return true;
    if (a >= 0 && b >= 0) return doors.has(key(c, n));
    const gc = gateAt.has(c) ? c : gateAt.has(n) ? n : -1;
    if (gc < 0) return false;
    const gi = gateAt.get(gc)!;
    const other = gc === c ? n : c;
    const G2 = GATES[gi];
    if (other !== G2.a[1] * W + G2.a[0] && other !== G2.b[1] * W + G2.b[0]) return false;
    return gateOpen(gi);
  };
  const cellPath = (s: [number, number], t: [number, number]): Pt[] => {
    const prev = new Int32Array(W * H).fill(-1);
    const seen = new Uint8Array(W * H);
    const sk = s[1] * W + s[0];
    const tk = t[1] * W + t[0];
    const q = [sk];
    seen[sk] = 1;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      if (c === tk) break;
      const x = c % W;
      const y = Math.floor(c / W);
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const n = ny * W + nx;
        if (seen[n] || !pass(c, n)) continue;
        seen[n] = 1;
        prev[n] = c;
        q.push(n);
      }
    }
    if (!seen[tk]) return [];
    const out: Pt[] = [];
    for (let c = tk; c !== -1; c = prev[c]) {
      out.push({ x: (c % W) + 0.5, y: Math.floor(c / W) + 0.5 });
      if (c === sk) break;
    }
    return out.reverse();
  };

  let t = 0.3;
  const areaAt = AREAS.map((_, i) => t + i * 0.35);
  t += AREAS.length * 0.35 + 0.3;
  const gateDrawAt = t;
  t += 0.8;
  const playStart = t;
  t += 1.0; // 村へ寄る
  type Leg = { pts: Pt[]; t0: number; t1: number; pause: number; note?: string };
  const legs: Leg[] = [];
  const evAt: Record<string, number> = {};
  const ev = (name: string) => evAt[name] ?? Infinity;
  const roomVisit = rooms.map(() => Infinity);
  const areaVisit = AREAS.map(() => Infinity);
  const gotAt: Partial<Record<Need, number>> = {};
  {
    let cur: [number, number] = [ROUTE[0].x, ROUTE[0].y];
    roomVisit[cellRoom[cur[1] * W + cur[0]]] = t;
    areaVisit[0] = playStart;
    for (let i = 1; i < ROUTE.length; i++) {
      const w = ROUTE[i];
      const cells = cellPath(cur, [w.x, w.y]);
      if (import.meta.env.DEV && cells.length < 2) console.warn('[cover:world] unreachable leg', i);
      const len = polyLength(cells);
      const dur = len / SPEED;
      cells.forEach((p, j) => {
        const id = cellRoom[Math.floor(p.y) * W + Math.floor(p.x)];
        const at = t + (j / Math.max(1, cells.length - 1)) * dur;
        if (id >= 0 && roomVisit[id] === Infinity) roomVisit[id] = at;
        if (id >= 0 && areaVisit[rooms[id].area] === Infinity) areaVisit[rooms[id].area] = at;
      });
      legs.push({ pts: cells, t0: t, t1: t + dur, pause: w.pause ?? 0, note: w.note });
      t += dur;
      if (w.ev) evAt[w.ev] = t;
      if (w.gives) {
        have.add(w.gives);
        gotAt[w.gives] = t;
      }
      t += w.pause ?? 0;
      cur = [w.x, w.y];
    }
  }
  const end = t + 1.4;
  const leaveHome = areaVisit[1];

  const playerAt = (tt: number) => {
    let pos: Pt = { x: ROUTE[0].x + 0.5, y: ROUTE[0].y + 0.5 };
    const trail: Pt[][] = [];
    let note: { text: string; a: number } | null = null;
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
      if (leg.note && since < leg.pause + 1.0) note = { text: leg.note, a: noteAlpha(since, leg.pause + 1.0) };
    }
    return { pos, trail, note };
  };

  /* ---------- カメラ（村だけ寄って、出ると全体へ） ---------- */
  let cs = G;
  let zoom = 1;
  let camX = W / 2;
  let camY = H / 2;
  const SX = (c: number) => k.width / 2 + (c - camX) * cs * zoom;
  const SY = (r: number) => k.height / 2 + 8 + (r - camY) * cs * zoom;
  const camera = (tt: number) => {
    const raw = Math.min((k.width * 0.94) / W, (k.height - 96) / H);
    cs = raw >= G ? G : Math.max(8, Math.floor(raw));
    k.cs = cs;
    const home = AREAS[0].r;
    const hx = home[0] + home[2] / 2 + 3;
    const hy = home[1] + home[3] / 2 - 1;
    const zIn = easeInOut((tt - playStart + 0.2) / 1.0);
    const zOut = easeInOut((tt - leaveHome + 0.8) / 1.4);
    const kk = k.reduceMotion ? 0 : zIn * (1 - zOut);
    zoom = lerp(1, 1.75, kk);
    camX = lerp(W / 2, hx, kk);
    camY = lerp(H / 2, hy, kk);
  };

  /* ---------- 描画 ---------- */
  const rectPx = (r: R4, inset: number) => {
    const x0 = SX(r[0]) + inset;
    const y0 = SY(r[1]) + inset;
    return { x: x0, y: y0, w: r[2] * cs * zoom - inset * 2, h: r[3] * cs * zoom - inset * 2 };
  };

  const render = (tt: number, g: number) => {
    camera(tt);
    const pl = !k.reduceMotion && tt >= playStart ? playerAt(tt) : null;
    const curRoom = pl ? cellRoom[Math.floor(pl.pos.y) * W + Math.floor(pl.pos.x)] : -1;
    // 王城（中央・最深部）
    {
      const p = rectPx(CASTLE, 6);
      const path = new Path2D();
      path.rect(p.x, p.y, p.w, p.h);
      const opened = clamp01((tt - ev('seal')) / 1.2);
      k.hatch(path, INK(0.05 + 0.05 * opened), 9);
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = (opened > 0 ? ACCENT : INK)(0.3 + 0.3 * opened);
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w, p.h);
      ctx.setLineDash([]);
    }
    // エリアの枠
    AREAS.forEach((A, ai) => {
      const a = clamp01((tt - areaAt[ai]) / 0.5);
      if (a <= 0) return;
      const p = rectPx(A.r, -3);
      const entered = clamp01((tt - areaVisit[ai]) / 0.6);
      if (entered < 1) {
        const path = new Path2D();
        path.rect(p.x, p.y, p.w, p.h);
        k.hatch(path, INK(0.06 * a * (1 - entered)), 7);
      }
      ctx.strokeStyle = INK((0.22 + 0.15 * entered) * a);
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w, p.h);
      // 四隅の目印
      ctx.strokeStyle = INK(0.55 * a);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (const [cx, cy, dx, dy] of [
        [p.x, p.y, 1, 1],
        [p.x + p.w, p.y, -1, 1],
        [p.x, p.y + p.h, 1, -1],
        [p.x + p.w, p.y + p.h, -1, -1],
      ]) {
        ctx.moveTo(cx + dx * 8, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * 8);
      }
      ctx.stroke();
      const total = rooms.filter((r) => r.area === ai && !r.gone).length;
      const seen = rooms.filter((r, i) => r.area === ai && !r.gone && tt >= roomVisit[i]).length;
      const label = entered > 0 ? `${A.name}  ${Math.round((seen / total) * 100)}%` : A.name;
      k.label(label, p.x + 2, p.y - 5, (0.5 + 0.3 * entered) * a, { size: 10, color: entered > 0 ? ACCENT : INK });
    });
    // 部屋（エリアに入ると見え、通ると塗られる）
    rooms.forEach((R, i) => {
      if (R.gone) return;
      const shown = k.reduceMotion ? 1 : clamp01((tt - areaVisit[R.area]) / 0.6);
      if (shown <= 0) return;
      const p = rectPx(R.r, 2);
      const visited = tt >= roomVisit[i];
      if (visited) {
        ctx.fillStyle = i === curRoom ? ACCENT(0.32) : INK(0.13);
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }
      ctx.strokeStyle = INK((visited ? 0.6 : 0.28) * shown);
      ctx.lineWidth = visited ? 1.4 : 1;
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);
    });
    // 扉（隣の部屋との短い線）
    ctx.strokeStyle = INK(0.55);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const [c, n] of doorList) {
      const R = rooms[cellRoom[c]];
      if (!k.reduceMotion && tt < areaVisit[R.area] + 0.3) continue;
      const x1 = c % W;
      const y1 = Math.floor(c / W);
      const x2 = n % W;
      const y2 = Math.floor(n / W);
      if (x1 !== x2) {
        const x = SX(Math.max(x1, x2));
        const y = SY(y1 + 0.5);
        ctx.moveTo(x - 3, y);
        ctx.lineTo(x + 3, y);
      } else {
        const x = SX(x1 + 0.5);
        const y = SY(Math.max(y1, y2));
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x, y + 3);
      }
    }
    ctx.stroke();
    // 関門
    const ga = clamp01((tt - gateDrawAt) / 0.6);
    GATES.forEach((G2) => {
      if (ga <= 0) return;
      const [x, y] = G2.at;
      const p = rectPx([x, y, 1, 1], 3);
      const opened = G2.need === 'none' ? 0 : G2.need === 'seal' ? ev('seal') : gotAt[G2.need] ?? Infinity;
      const open = G2.need === 'none' || tt >= opened;
      ctx.fillStyle = pal.bg;
      ctx.fillRect(p.x - 2, p.y - 2, p.w + 4, p.h + 4);
      ctx.strokeStyle = (open ? INK : ACCENT)((open ? 0.55 : 0.9) * ga);
      ctx.lineWidth = open ? 1.2 : 2;
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);
      if (!open) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.w, p.y + p.h);
        ctx.stroke();
      }
      if (G2.need !== 'none') {
        const horizontal = G2.a[1] === G2.b[1];
        const lx = horizontal ? p.x + p.w / 2 : p.x + p.w + 6;
        const ly = horizontal ? p.y - 6 : p.y + p.h / 2 + 3;
        k.label(NEED_LABEL[G2.need], lx, ly, (open ? 0.4 : 0.8) * ga, { size: 9, align: horizontal ? 'center' : 'left', color: open ? INK : ACCENT });
      }
    });
    // 特別な部屋
    SPECIAL.forEach((s) => {
      const id = cellRoom[s.at[1] * W + s.at[0]];
      if (id < 0) return;
      const shown = k.reduceMotion ? 1 : clamp01((tt - areaVisit[rooms[id].area]) / 0.6);
      if (shown <= 0) return;
      const p = rectPx(rooms[id].r, 0);
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;
      if (s.kind === 'boss') k.iconBoss(cx, cy, shown, tt >= (gotAt[s.gives!] ?? Infinity), g);
      else {
        ctx.font = `bold ${Math.round(9 * zoom)}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.fillStyle = (s.kind === 'start' ? ACCENT : INK)(0.85 * shown);
        ctx.textAlign = 'center';
        ctx.fillText('S', cx, cy + 3 * zoom);
        ctx.textAlign = 'left';
      }
    });
    // 主人公
    if (pl) {
      k.trail(pl.trail, g, (p) => ({ x: SX(p.x), y: SY(p.y) }), 0.7);
      const q = { x: SX(pl.pos.x), y: SY(pl.pos.y) };
      k.player(q.x, q.y, g);
      if (pl.note) k.callout(q.x, q.y, pl.note.text, pl.note.a, true);
    }
    k.legend([
      ['エリア（枠）', (x, y) => k.swatchBox(x, y, null, INK(0.5))],
      ['部屋（1 マス＝1 画面）', (x, y) => k.swatchBox(x, y, null, INK(0.3))],
      ['通った部屋', (x, y) => k.swatchBox(x, y, INK(0.2), INK(0.6))],
      ['関門（能力で開く）', (x, y) => {
        ctx.strokeStyle = ACCENT(0.9);
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 5.5, y - 5.5, 11, 11);
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.stroke();
      }],
      ['ボス ／ 能力', (x, y) => k.iconBoss(x, y, 1, false, 0)],
      ['S  セーブ', () => undefined],
      ['プレイヤーの動線', (x, y) => k.swatchLine(x, y, ACCENT(0.75), 1.5, [3, 4])],
    ]);
    const total = rooms.filter((r) => !r.gone).length;
    const seen = roomVisit.filter((v) => tt >= v).length;
    const abil = (['dash', 'djump', 'swim'] as Need[]).filter((n) => tt >= (gotAt[n] ?? Infinity)).length;
    const phase = tt < playStart ? 'エリア構成' : zoom > 1.05 ? 'エリア拡大' : tt < ev('seal') ? '探索 · 全体図' : '王城へ';
    k.titleBlock('WORLD MAP — 6 AREAS', phase, `MAP ${Math.round((seen / total) * 100)}%`, `${total} ROOMS · ABILITY ${abil}/3`);
  };

  return { end, still: playStart - 0.01, render };
};
