/**
 * 表紙の設計図アニメーションの共通部品：配色・方眼・注記・表題欄・凡例・最短路。
 * 各場面（scene-*.ts）はこの Kit を受け取り、自分の地図だけを描く。
 */

export const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
export const JP = '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", "Meiryo", sans-serif';
export const G = 24; // 方眼 1 マス（px）

export type Pt = { x: number; y: number };
export type R4 = [number, number, number, number]; // [x, y, 幅, 高さ]（マス）
export type Rect = { x0: number; y0: number; x1: number; y1: number };

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
export const easeInOut = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const polyLength = (pts: Pt[]) => {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return total;
};
export const pointAt = (pts: Pt[], p: number): Pt => {
  let remain = polyLength(pts) * clamp01(p);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (remain <= seg) {
      const k = seg ? remain / seg : 0;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
    remain -= seg;
  }
  return pts[pts.length - 1];
};
/** 道筋の途中まで（通った跡） */
export const partOf = (pts: Pt[], p: number): Pt[] => {
  const out: Pt[] = [pts[0]];
  let remain = polyLength(pts) * clamp01(p);
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (remain >= seg) {
      out.push(pts[i]);
      remain -= seg;
    } else {
      const k = seg ? remain / seg : 0;
      out.push({ x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k });
      break;
    }
  }
  return out;
};
/** 道筋の上で、条件を最初に満たす点までの距離 */
export const distUntil = (pts: Pt[], test: (p: Pt) => boolean) => {
  let d = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.ceil(seg * 4));
    for (let k = 1; k <= n; k++) {
      const p = { x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n };
      if (test(p)) return d + (seg * k) / n;
    }
    d += seg;
  }
  return d;
};
export const inR = (r: R4, x: number, y: number) => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3];

/** 決まった種から作る乱数（毎回同じ地図になる） */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * 方眼の上の最短路（4 方向）。ok(x, y) が通れるマス。
 * 戻り値はマスの中心を結んだ折れ線（曲がり角だけを残す）。たどり着けなければ空の配列。
 */
export const gridPath = (W: number, H: number, ok: (x: number, y: number) => boolean, s: [number, number], t: [number, number]): Pt[] => {
  const prev = new Int32Array(W * H).fill(-1);
  const seen = new Uint8Array(W * H);
  const sk = s[1] * W + s[0];
  const tk = t[1] * W + t[0];
  const q = [sk];
  seen[sk] = 1;
  let head = 0;
  while (head < q.length) {
    const k = q[head++];
    if (k === tk) break;
    const x = k % W;
    const y = Math.floor(k / W);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const nk = ny * W + nx;
      if (seen[nk] || !ok(nx, ny)) continue;
      seen[nk] = 1;
      prev[nk] = k;
      q.push(nk);
    }
  }
  if (!seen[tk]) return [];
  const cells: Pt[] = [];
  for (let k = tk; k !== -1; k = prev[k]) {
    cells.push({ x: (k % W) + 0.5, y: Math.floor(k / W) + 0.5 });
    if (k === sk) break;
  }
  cells.reverse();
  const out: Pt[] = [cells[0]];
  for (let i = 1; i < cells.length - 1; i++) {
    const a = out[out.length - 1];
    const b = cells[i];
    const c = cells[i + 1];
    if ((a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y)) continue;
    out.push(b);
  }
  if (cells.length > 1) out.push(cells[cells.length - 1]);
  return out;
};

/** 点と辺のグラフの上の最短路（道・通路網用）。edges は [i, j]、blocked(i, j) が真の辺は通れない */
export const graphPath = (nodes: Pt[], edges: [number, number][], from: number, to: number, blocked: (i: number, j: number) => boolean = () => false): number[] => {
  const n = nodes.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const done = new Array(n).fill(false);
  dist[from] = 0;
  for (;;) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0 || u === to) break;
    done[u] = true;
    for (const [a, b] of edges) {
      const v = a === u ? b : b === u ? a : -1;
      if (v < 0 || done[v] || blocked(u, v)) continue;
      const d = dist[u] + Math.hypot(nodes[u].x - nodes[v].x, nodes[u].y - nodes[v].y);
      if (d < dist[v]) {
        dist[v] = d;
        prev[v] = u;
      }
    }
  }
  if (dist[to] === Infinity) return [];
  const out: number[] = [];
  for (let v = to; v !== -1; v = prev[v]) out.push(v);
  return out.reverse();
};

/* ---------- 配色（ページの CSS 変数から読み直す） ---------- */
export const pal = { bg: '#131210', ink: '242, 239, 233', accent: '229, 112, 82', alpha: 1 };
export const INK = (a: number) => `rgba(${pal.ink}, ${Math.min(1, Math.max(0, a * pal.alpha))})`;
export const ACCENT = (a: number) => `rgba(${pal.accent}, ${Math.min(1, Math.max(0, a * pal.alpha))})`;

export type Scene = {
  /** 場面の長さ（秒）。終わると次の場面へ */
  end: number;
  /** 「視差効果を減らす」設定で止めて見せる時刻 */
  still: number;
  render: (t: number, g: number) => void;
};

export class Kit {
  ctx: CanvasRenderingContext2D;
  width = 0;
  height = 0;
  cs = G;
  ox = 0;
  oy = 0;
  taken: Rect[] = [];
  /** 表題欄の先頭に付ける場面番号（01/05 など） */
  tag = '';
  reduceMotion = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /** 地図の大きさと置き場所（方眼に合わせる） */
  fit(cols: number, rows: number, padY = 96) {
    const raw = Math.min((this.width * 0.94) / cols, (this.height - padY) / rows);
    this.cs = raw >= G ? G : Math.max(8, Math.floor(raw));
    this.ox = Math.round((this.width - cols * this.cs) / 2);
    this.oy = Math.round((this.height - rows * this.cs) / 2 + 8);
    if (this.cs === G) {
      this.ox = Math.round(this.ox / G) * G;
      this.oy = Math.round(this.oy / G) * G;
    }
  }
  X = (c: number) => this.ox + c * this.cs;
  Y = (r: number) => this.oy + r * this.cs;
  showText = () => this.cs >= 14;

  /** 文字の注記（引き出し線つき。ほかの文字と重ならない向きを選ぶ） */
  callout(ax: number, ay: number, text: string, a: number, strong: boolean) {
    const { ctx } = this;
    if (a <= 0 || !this.showText()) return;
    ctx.font = `11px ${JP}`;
    const tw = ctx.measureText(text).width;
    for (const [dx, dy] of [
      [1, -1],
      [-1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      const bx = ax + dx * 12;
      const by = ay + dy * 12;
      const tx = dx > 0 ? bx + 14 : bx - 14 - tw;
      const rect = { x0: tx - 4, y0: by - 9, x1: tx + tw + 4, y1: by + 9 };
      if (rect.x0 < 16 || rect.x1 > this.width - 16 || rect.y0 < 22 || rect.y1 > this.height - 16) continue;
      if (this.taken.some((t) => rect.x0 < t.x1 && rect.x1 > t.x0 && rect.y0 < t.y1 && rect.y1 > t.y0)) continue;
      this.taken.push(rect);
      ctx.beginPath();
      ctx.moveTo(ax + 0.5, ay + 0.5);
      ctx.lineTo(bx + 0.5, by + 0.5);
      ctx.lineTo(bx + dx * 10 + 0.5, by + 0.5);
      ctx.strokeStyle = INK(0.36 * a);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ax + 0.5, ay + 0.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = INK(0.5 * a);
      ctx.fill();
      ctx.fillStyle = pal.bg;
      ctx.fillRect(rect.x0, rect.y0 + 1, rect.x1 - rect.x0, rect.y1 - rect.y0 - 2);
      ctx.fillStyle = strong ? ACCENT(0.9 * a) : INK(0.62 * a);
      ctx.textBaseline = 'middle';
      ctx.fillText(text, tx, by + 0.5);
      ctx.textBaseline = 'alphabetic';
      return;
    }
  }

  /** 小さな文字ラベル（重なりの記録つき） */
  label(text: string, x: number, y: number, a: number, opts: { size?: number; color?: (a: number) => string; align?: CanvasTextAlign; mono?: boolean } = {}) {
    if (a <= 0 || !this.showText()) return;
    const { ctx } = this;
    const size = opts.size ?? 10;
    ctx.font = `${size}px ${opts.mono ? MONO : JP}`;
    ctx.fillStyle = (opts.color ?? INK)(a);
    ctx.textAlign = opts.align ?? 'left';
    ctx.fillText(text, x, y);
    const w = ctx.measureText(text).width;
    const x0 = opts.align === 'center' ? x - w / 2 : opts.align === 'right' ? x - w : x;
    this.taken.push({ x0: x0 - 2, y0: y - size, x1: x0 + w + 2, y1: y + 4 });
    ctx.textAlign = 'left';
  }

  /** 右下の表題欄 */
  titleBlock(title: string, phase: string, left: string, right: string) {
    const { ctx } = this;
    if (this.width < 640) return;
    const w = 270;
    const h = 48;
    const x = this.width - w - 40;
    const y = this.height - h - 40;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = INK(0.24);
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    ctx.beginPath();
    ctx.moveTo(x, y + 22.5);
    ctx.lineTo(x + w, y + 22.5);
    ctx.moveTo(x + 84.5, y + 22);
    ctx.lineTo(x + 84.5, y + h);
    ctx.stroke();
    ctx.font = `9px ${MONO}`;
    ctx.fillStyle = INK(0.42);
    ctx.fillText(this.tag ? `${this.tag}  ${title}` : title, x + 8, y + 15);
    ctx.font = `9px ${JP}`;
    ctx.fillStyle = ACCENT(0.85);
    ctx.textAlign = 'right';
    ctx.fillText(phase, x + w - 8, y + 15);
    ctx.textAlign = 'left';
    ctx.font = `9px ${MONO}`;
    ctx.fillStyle = ACCENT(0.75);
    ctx.fillText(left, x + 8, y + 39);
    ctx.fillStyle = INK(0.36);
    ctx.fillText(right, x + 94, y + 39);
    this.taken.push({ x0: x, y0: y, x1: x + w, y1: y + h });
  }

  /** 左下の凡例 */
  legend(rowsL: [string, (x: number, y: number) => void][]) {
    const { ctx } = this;
    if (this.width < 900) return;
    const w = 164;
    const h = 22 + rowsL.length * 17;
    const x = 40;
    const y = this.height - h - 40;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = INK(0.24);
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    ctx.font = `9px ${MONO}`;
    ctx.fillStyle = INK(0.42);
    ctx.fillText('LEGEND', x + 8, y + 14);
    rowsL.forEach(([label, icon], i) => {
      const yy = y + 30 + i * 17;
      ctx.save();
      ctx.lineWidth = 1;
      icon(x + 20, yy);
      ctx.restore();
      ctx.font = `10px ${JP}`;
      ctx.fillStyle = INK(0.58);
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + 38, yy + 0.5);
      ctx.textBaseline = 'alphabetic';
    });
    this.taken.push({ x0: x, y0: y, x1: x + w, y1: y + h });
  }

  /** 動線（流れる点線） */
  trail(lines: Pt[][], g: number, toPx: (p: Pt) => Pt, alpha = 0.6) {
    const { ctx } = this;
    ctx.setLineDash([4, 5]);
    ctx.lineDashOffset = -g * 12;
    ctx.strokeStyle = ACCENT(alpha);
    ctx.lineWidth = 1.5;
    for (const line of lines) {
      if (line.length < 2) continue;
      ctx.beginPath();
      line.forEach((p, i) => {
        const q = toPx(p);
        if (i) ctx.lineTo(q.x, q.y);
        else ctx.moveTo(q.x, q.y);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }

  /** 主人公（脈打つ輪つきの点） */
  player(x: number, y: number, g: number, r = 4) {
    const { ctx } = this;
    const ring = (g * 1.4) % 1;
    ctx.beginPath();
    ctx.arc(x, y, r - 1 + ring * 10, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT(0.5 * (1 - ring));
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT(0.95);
    ctx.fill();
  }

  /** 敵（塗りの点）と、向いている方向の視界 */
  enemy(x: number, y: number, a: number, facing?: number, reach = 0, alert = false) {
    const { ctx } = this;
    if (facing !== undefined && reach > 0) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, reach, facing - 0.42, facing + 0.42);
      ctx.closePath();
      ctx.fillStyle = ACCENT((alert ? 0.16 : 0.07) * a);
      ctx.fill();
      ctx.strokeStyle = ACCENT((alert ? 0.5 : 0.22) * a);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x, y - 4.5);
    ctx.lineTo(x + 4.5, y);
    ctx.lineTo(x, y + 4.5);
    ctx.lineTo(x - 4.5, y);
    ctx.closePath();
    ctx.fillStyle = INK(0.75 * a);
    ctx.fill();
    if (alert) {
      ctx.font = `bold 13px ${MONO}`;
      ctx.fillStyle = ACCENT(0.95 * a);
      ctx.textAlign = 'center';
      ctx.fillText('!', x, y - 8);
      ctx.textAlign = 'left';
    }
  }

  /** 倒した敵（× と飛び散る線） */
  downed(x: number, y: number, a: number, since: number) {
    const { ctx } = this;
    ctx.strokeStyle = INK(0.45 * a);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 4);
    ctx.lineTo(x + 4, y + 4);
    ctx.moveTo(x + 4, y - 4);
    ctx.lineTo(x - 4, y + 4);
    ctx.stroke();
    const k = clamp01(since / 0.45);
    if (k < 1) this.burst(x, y, k);
  }
  burst(x: number, y: number, k: number, r0 = 6) {
    const { ctx } = this;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const th = (i / 8) * Math.PI * 2;
      ctx.moveTo(x + Math.cos(th) * (r0 + k * 6), y + Math.sin(th) * (r0 + k * 6));
      ctx.lineTo(x + Math.cos(th) * (r0 + 4 + k * 12), y + Math.sin(th) * (r0 + 4 + k * 12));
    }
    ctx.strokeStyle = ACCENT(0.9 * (1 - k));
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  /* ---------- 地図記号 ---------- */
  iconKey(cx: number, cy: number, a: number) {
    const { ctx } = this;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = ACCENT(0.9 * a);
    ctx.beginPath();
    ctx.arc(cx - 4, cy, 3.5, 0, Math.PI * 2);
    ctx.moveTo(cx - 0.5, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx + 5, cy);
    ctx.lineTo(cx + 5, cy + 3);
    ctx.moveTo(cx + 8, cy);
    ctx.lineTo(cx + 8, cy + 3);
    ctx.stroke();
  }
  iconSun(cx: number, cy: number, a: number) {
    const { ctx } = this;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = ACCENT(0.9 * a);
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    for (let i = 0; i < 8; i++) {
      const th = (i / 8) * Math.PI * 2;
      ctx.moveTo(cx + Math.cos(th) * 6, cy + Math.sin(th) * 6);
      ctx.lineTo(cx + Math.cos(th) * 9, cy + Math.sin(th) * 9);
    }
    ctx.stroke();
  }
  iconMoon(cx: number, cy: number, a: number) {
    const { ctx } = this;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = ACCENT(0.9 * a);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, Math.PI * 0.35, Math.PI * 1.65);
    ctx.arc(cx + 3.5, cy, 5.2, Math.PI * 1.55, Math.PI * 0.45, true);
    ctx.closePath();
    ctx.stroke();
  }
  iconChest(cx: number, cy: number, a: number, opened = false) {
    const { ctx } = this;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = INK(0.55 * a);
    ctx.strokeRect(cx - 7.5, cy - 4.5, 15, 10);
    ctx.beginPath();
    ctx.moveTo(cx - 7.5, cy - 0.5);
    ctx.lineTo(cx + 7.5, cy - 0.5);
    ctx.stroke();
    if (!opened) {
      ctx.fillStyle = ACCENT(0.7 * a);
      ctx.fillRect(cx - 1.5, cy - 2, 3, 3);
    }
  }
  /** セーブ（菱形）。lit で灯る */
  iconSave(cx: number, cy: number, a: number, lit: boolean, g: number) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 6, cy);
    ctx.lineTo(cx, cy + 8);
    ctx.lineTo(cx - 6, cy);
    ctx.closePath();
    ctx.fillStyle = (lit ? ACCENT : INK)((lit ? 0.45 : 0.15 + 0.1 * Math.sin(g * 1.6)) * a);
    ctx.fill();
    ctx.strokeStyle = INK(0.6 * a);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  /** 篝火（祝福）：小さな炎 */
  iconFire(cx: number, cy: number, a: number, lit: boolean, g: number) {
    const { ctx } = this;
    const f = lit ? 1 + 0.15 * Math.sin(g * 9) : 0.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 9 * f);
    ctx.quadraticCurveTo(cx + 6, cy - 2, cx + 3, cy + 3);
    ctx.quadraticCurveTo(cx, cy + 5, cx - 3, cy + 3);
    ctx.quadraticCurveTo(cx - 6, cy - 2, cx, cy - 9 * f);
    ctx.fillStyle = (lit ? ACCENT : INK)((lit ? 0.75 : 0.2) * a);
    ctx.fill();
    ctx.strokeStyle = (lit ? ACCENT : INK)(0.8 * a);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 5);
    ctx.lineTo(cx + 6, cy + 5);
    ctx.strokeStyle = INK(0.55 * a);
    ctx.stroke();
  }
  /** ボス（二重丸に ×）。cleared で薄くなる */
  iconBoss(cx: number, cy: number, a: number, cleared: boolean, g: number) {
    const { ctx } = this;
    const pulse = 0.5 + 0.5 * Math.sin(g * 2.2);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT((cleared ? 0.3 : 0.8) * a);
    ctx.stroke();
    if (!cleared) {
      ctx.beginPath();
      ctx.arc(cx, cy, 14 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT((0.35 - pulse * 0.2) * a);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 4);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.moveTo(cx + 4, cy - 4);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.strokeStyle = ACCENT((cleared ? 0.3 : 0.8) * a);
    ctx.stroke();
  }
  iconFlag(cx: number, cy: number, a: number) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy + 8);
    ctx.lineTo(cx - 5, cy - 8);
    ctx.lineTo(cx + 7, cy - 4.5);
    ctx.lineTo(cx - 5, cy - 1);
    ctx.strokeStyle = INK(0.65 * a);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  iconLock(cx: number, cy: number, a: number) {
    const { ctx } = this;
    ctx.strokeStyle = ACCENT(0.9 * a);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - 3.5, cy - 1, 7, 6);
    ctx.beginPath();
    ctx.arc(cx, cy - 1, 2.5, Math.PI, 0);
    ctx.stroke();
  }

  /** 凡例用の小さな記号 */
  swatchLine(x: number, y: number, color: string, width = 1, dash: number[] = []) {
    const { ctx } = this;
    ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  swatchBox(x: number, y: number, fill: string | null, stroke = INK(0.45), dash: number[] = []) {
    const { ctx } = this;
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(x - 6, y - 5, 12, 10);
    }
    ctx.setLineDash(dash);
    ctx.strokeStyle = stroke;
    ctx.strokeRect(x - 6.5, y - 5.5, 13, 11);
    ctx.setLineDash([]);
  }
  /** 斜線のハッチ（霧・未踏の地・水など） */
  hatch(path: Path2D, color: string, gap = 6, angle = 1) {
    const { ctx } = this;
    ctx.save();
    ctx.clip(path);
    ctx.beginPath();
    for (let d = -this.height; d < this.width + this.height; d += gap) {
      ctx.moveTo(d, 0);
      ctx.lineTo(d - this.height * angle, this.height);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}

/** 試遊の一言（出来事の直後に出て、しばらくして消える） */
export const noteAlpha = (since: number, hold: number) => Math.min(clamp01(since / 0.15), clamp01((hold - since) / 0.3));
