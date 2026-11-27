/**
 * 04 · 地下聖堂（横から見た 1 つのエリア・メトロイドヴァニア型）
 * ひとつの大きなエリアを、壁と扉で区切った 11 の小部屋の組み合わせとして見せる。ロゴの位置は岩盤。
 * 流れ：はじまりの間 → 縦穴：7 マスの段差は届かない（二段ジャンプが必要）→ 落ちて地底洞へ、這う敵を踏みつける
 *      → 地底湖のトゲを跳び越える → 祠で二段ジャンプ → 天井の穴を抜けて塔を登る → 上層の回廊・鐘の間で飛ぶ敵を斬る
 *      → 右からしか壊せない壁を壊す（縦穴への近道）→ ボスの間
 * 縦穴の横には本筋から外れた隠し部屋があり、踏破率は 100% にならない（取り残しの設計）。
 * 部屋に入ると、上部の見出しに部屋の名前が出る。
 */
import { ACCENT, INK, Kit, clamp01, easeOut, noteAlpha, type Pt, type R4, type Scene } from './kit';

const BW = 48;
const BH = 28;
type BEl = { r: R4; name?: string; kind: 'room' | 'door' | 'pit' | 'hole' | 'break'; door?: 'normal' | 'boss'; secret?: boolean };
const ELS: BEl[] = [
  { r: [2, 12, 8, 4], name: 'はじまりの間', kind: 'room' },
  { r: [10, 14, 1, 2], kind: 'door', door: 'normal' },
  { r: [11, 3, 4, 22], name: '縦穴', kind: 'room' },
  { r: [15, 23, 1, 2], kind: 'door', door: 'normal' },
  { r: [16, 21, 9, 4], name: '地底洞', kind: 'room' },
  { r: [20, 25, 3, 2], kind: 'pit' },
  { r: [25, 23, 1, 2], kind: 'door', door: 'normal' },
  { r: [26, 21, 12, 4], name: '地底湖', kind: 'room' },
  { r: [30, 25, 3, 2], kind: 'pit' },
  { r: [38, 23, 1, 2], kind: 'door', door: 'normal' },
  { r: [39, 18, 7, 7], name: '祠', kind: 'room' },
  { r: [40, 17, 2, 1], kind: 'hole' },
  { r: [39, 3, 7, 14], name: '塔', kind: 'room' },
  { r: [38, 4, 1, 2], kind: 'door', door: 'normal' },
  { r: [32, 3, 6, 3], name: '回廊 東', kind: 'room' },
  { r: [31, 4, 1, 2], kind: 'door', door: 'normal' },
  { r: [25, 2, 6, 4], name: '鐘の間', kind: 'room' },
  { r: [24, 4, 1, 2], kind: 'door', door: 'normal' },
  { r: [16, 3, 8, 3], name: '回廊 西', kind: 'room' },
  { r: [15, 3, 1, 3], kind: 'break' },
  { r: [10, 7, 1, 2], kind: 'door', door: 'boss' },
  { r: [2, 2, 8, 7], name: 'ボスの間', kind: 'room' },
  { r: [9, 20, 2, 2], kind: 'door', door: 'normal' },
  { r: [2, 18, 7, 4], name: '隠し部屋', kind: 'room', secret: true },
];
/** すり抜けられる足場：[x0, x1, y] */
const PLATS: [number, number, number][] = [
  [11, 13, 16],
  [11, 15, 9],
  [11, 13, 22],
  [39, 42, 21],
  [39, 43, 14],
  [42, 46, 10],
  [39, 43, 6],
];
type Move = { kind: 'walk' | 'jump' | 'fall' | 'djump'; x: number; y: number; h?: number; event?: string; note?: string; pause?: number };
const MOVES: Move[] = [
  { kind: 'walk', x: 12, y: 16 },
  { kind: 'jump', x: 12, y: 16, h: 3.6, event: 'cant', note: '届かない（7 マス）→ 二段ジャンプが必要', pause: 1.2 },
  { kind: 'walk', x: 12.9, y: 16 },
  { kind: 'fall', x: 13.6, y: 25 },
  { kind: 'walk', x: 19.6, y: 25 },
  { kind: 'jump', x: 23.6, y: 25, h: 2.6, event: 'stomp', note: '這ってくる敵を踏みつけて倒す', pause: 0.4 },
  { kind: 'walk', x: 29.4, y: 25 },
  { kind: 'jump', x: 33.6, y: 25, h: 2.4 },
  { kind: 'walk', x: 43, y: 25, event: 'ability', note: '二段ジャンプを入手', pause: 1.0 },
  { kind: 'walk', x: 40.5, y: 25 },
  { kind: 'jump', x: 40.5, y: 21, h: 4.4 },
  { kind: 'djump', x: 40.5, y: 14, h: 7.6, note: '二段ジャンプで天井の穴を抜ける', pause: 0.2 },
  { kind: 'jump', x: 43.6, y: 10, h: 4.6 },
  { kind: 'jump', x: 40.4, y: 6, h: 4.6 },
  { kind: 'walk', x: 29.2, y: 6 },
  { kind: 'jump', x: 27.6, y: 6, h: 2.6, event: 'bat', note: '飛びかかる敵を空中で斬る', pause: 0.4 },
  { kind: 'walk', x: 16.6, y: 6, event: 'break', note: '壁を壊す（右からだけ）→ 縦穴への近道', pause: 0.9 },
  { kind: 'walk', x: 15, y: 6 },
  { kind: 'fall', x: 14.2, y: 9 },
  { kind: 'walk', x: 6, y: 9, event: 'clear', note: 'ボス撃破', pause: 1.6 },
];
const STEP = 0.24;
const AREA = '沈んだ地下聖堂';
const ROOMS = ELS.map((e, i) => (e.kind === 'room' ? i : -1)).filter((i) => i >= 0);

export const metroArea = (k: Kit): Scene => {
  const { ctx } = k;
  const X = k.X;
  const Y = k.Y;

  const carved = new Uint8Array(BW * BH);
  const owner = new Int16Array(BW * BH).fill(-1);
  ELS.forEach((e, i) => {
    for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++)
      for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) {
        carved[y * BW + x] = 1;
        if (owner[y * BW + x] === -1) owner[y * BW + x] = i;
      }
  });
  const breakIdx = ELS.findIndex((e) => e.kind === 'break');
  const open = (x: number, y: number, broken: boolean) => {
    if (x < 0 || y < 0 || x >= BW || y >= BH) return false;
    const kk = y * BW + x;
    if (!carved[kk]) return false;
    return !(owner[kk] === breakIdx && !broken);
  };

  /* ---------- 段取り ---------- */
  type Sample = { t: number; x: number; y: number };
  const samples: Sample[] = [];
  const events: { t: number; note: string; event?: string; pause: number }[] = [];
  const elAt = ELS.map((_, i) => 0.4 + i * STEP);
  let t = 0.4 + ELS.length * STEP + 0.6;
  const playStart = t;
  {
    let x = 4;
    let y = 16;
    samples.push({ t, x, y });
    for (const m of MOVES) {
      const x0 = x;
      const y0 = y;
      const dx = m.x - x0;
      const dy = m.y - y0;
      let dur = 0;
      let fn: (kk: number) => [number, number] = (kk) => [x0 + dx * kk, y0 + dy * kk];
      if (m.kind === 'walk') dur = Math.abs(dx) / 7.5;
      if (m.kind === 'jump' || m.kind === 'djump') {
        const h = m.h ?? 3;
        dur = 0.42 + Math.abs(dx) * 0.035 + h * 0.045;
        const top = Math.min(y0, m.y) - (h - Math.max(0, y0 - m.y));
        fn = (kk) => [x0 + dx * kk, (1 - kk) * (1 - kk) * y0 + 2 * (1 - kk) * kk * (2 * top - (y0 + m.y) / 2) + kk * kk * m.y];
      }
      if (m.kind === 'fall') {
        dur = 0.25 + Math.sqrt(Math.abs(dy)) * 0.16;
        fn = (kk) => [x0 + dx * Math.min(1, kk * 1.6), y0 + dy * kk * kk];
      }
      const steps = Math.max(2, Math.ceil(dur * 40));
      for (let i = 1; i <= steps; i++) {
        const [px, py] = fn(i / steps);
        samples.push({ t: t + (dur * i) / steps, x: px, y: py });
      }
      t += dur;
      x = m.x;
      y = m.y;
      if (m.note) events.push({ t, note: m.note, event: m.event, pause: m.pause ?? 0 });
      if (m.pause) {
        samples.push({ t: t + m.pause, x, y });
        t += m.pause;
      }
    }
  }
  const end = t + 1.4;
  const evT = (name: string) => events.find((e) => e.event === name)?.t ?? Infinity;
  const roomAt = (p: Pt) => {
    const o = owner[Math.floor(p.y - 0.5) * BW + Math.floor(p.x)];
    return o >= 0 && ELS[o].kind === 'room' ? o : -1;
  };

  const render = (tt: number, g: number) => {
    k.fit(BW, BH);
    const cs = k.cs;
    const broken = tt >= evT('break');
    const hasAbility = tt >= evT('ability');
    let pos: Pt | null = null;
    const trail: Pt[] = [];
    if (!k.reduceMotion && tt >= playStart) {
      for (let i = 0; i < samples.length; i++) {
        const s = samples[i];
        if (s.t > tt) {
          const p0 = samples[Math.max(0, i - 1)];
          const kk = clamp01((tt - p0.t) / Math.max(0.0001, s.t - p0.t));
          pos = { x: p0.x + (s.x - p0.x) * kk, y: p0.y + (s.y - p0.y) * kk };
          trail.push(pos);
          break;
        }
        trail.push({ x: s.x, y: s.y });
        pos = { x: s.x, y: s.y };
      }
    }
    // 部屋ごとの到達と、入った順
    const visited: number[] = [];
    for (const p of trail) {
      const o = roomAt(p);
      if (o >= 0 && !visited.includes(o)) visited.push(o);
    }
    const curRoom = pos ? roomAt(pos) : -1;

    // 床
    ELS.forEach((e, i) => {
      const a = clamp01((tt - elAt[i]) / 0.3);
      if (a <= 0 || e.kind === 'door' || e.kind === 'hole') return;
      const vis = easeOut(a);
      ctx.save();
      ctx.beginPath();
      ctx.rect(X(e.r[0]) - 2, Y(e.r[1]) - 2, e.r[2] * cs * vis + 4, e.r[3] * cs + 4);
      ctx.clip();
      ctx.fillStyle = i === curRoom ? ACCENT(0.08) : visited.includes(i) ? ACCENT(0.04) : e.kind === 'pit' ? INK(0.015) : INK(0.022);
      if (e.kind !== 'break' || broken) ctx.fillRect(X(e.r[0]), Y(e.r[1]), e.r[2] * cs, e.r[3] * cs);
      ctx.restore();
    });
    // 壁
    const solid = new Path2D();
    ELS.forEach((e, i) => {
      if (tt < elAt[i]) return;
      if (e.kind === 'break' && !broken) return;
      for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++)
        for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) {
          if (owner[y * BW + x] !== i) continue;
          const sides: [number, number, number, number, number, number][] = [
            [x, y - 1, x, y, x + 1, y],
            [x, y + 1, x, y + 1, x + 1, y + 1],
            [x - 1, y, x, y, x, y + 1],
            [x + 1, y, x + 1, y, x + 1, y + 1],
          ];
          for (const [nx, ny, x1, y1, x2, y2] of sides) {
            if (open(nx, ny, broken)) continue;
            solid.moveTo(X(x1) + 0.5, Y(y1) + 0.5);
            solid.lineTo(X(x2) + 0.5, Y(y2) + 0.5);
          }
        }
    });
    ctx.strokeStyle = INK(0.5);
    ctx.lineWidth = 2;
    ctx.lineCap = 'square';
    ctx.stroke(solid);
    ctx.lineCap = 'butt';
    // 隠し部屋は点線で（まだ誰も入っていない）
    const secret = ELS.find((e) => e.secret);
    if (secret && tt > elAt[ELS.indexOf(secret)]) {
      k.label('?', X(secret.r[0] + secret.r[2] / 2), Y(secret.r[1] + secret.r[3] / 2) + 6, 0.6, { size: 18, align: 'center', mono: true, color: ACCENT });
    }

    // すり抜け足場
    PLATS.forEach(([x0, x1, y], i) => {
      const host = owner[(y - 1) * BW + x0];
      const a = clamp01((tt - (elAt[host] ?? 0) - 0.2 - i * 0.04) / 0.3);
      if (a <= 0) return;
      ctx.strokeStyle = INK(0.6 * a);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(X(x0), Y(y) + 0.5);
      ctx.lineTo(X(x1), Y(y) + 0.5);
      ctx.stroke();
      ctx.strokeStyle = INK(0.25 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let xx = X(x0) + 4; xx < X(x1); xx += 6) {
        ctx.moveTo(xx, Y(y) + 2);
        ctx.lineTo(xx - 3, Y(y) + 6);
      }
      ctx.stroke();
    });
    // トゲ・扉・壊せる壁
    ELS.forEach((e, i) => {
      const a = clamp01((tt - elAt[i] - 0.1) / 0.3);
      if (a <= 0) return;
      if (e.kind === 'pit') {
        ctx.beginPath();
        const by = Y(e.r[1] + e.r[3]);
        for (let x = X(e.r[0]); x < X(e.r[0] + e.r[2]) - 1; x += cs / 2) {
          ctx.moveTo(x, by);
          ctx.lineTo(x + cs / 4, by - cs * 0.5);
          ctx.lineTo(x + cs / 2, by);
        }
        ctx.strokeStyle = ACCENT(0.7 * a);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (e.kind === 'door') {
        ctx.fillStyle = e.door === 'boss' ? ACCENT(0.85 * a) : INK(0.55 * a);
        ctx.fillRect(X(e.r[0]) + (e.r[2] * cs) / 2 - 2, Y(e.r[1]) + 1, 4, e.r[3] * cs - 2);
      }
      if (e.kind === 'break' && !broken) {
        ctx.strokeStyle = INK(0.55 * a);
        ctx.lineWidth = 1;
        for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++) {
          ctx.strokeRect(X(e.r[0]) + 3.5, Y(y) + 3.5, cs - 7, cs - 7);
          ctx.beginPath();
          ctx.moveTo(X(e.r[0]) + 5, Y(y) + 6);
          ctx.lineTo(X(e.r[0]) + cs / 2, Y(y) + cs / 2);
          ctx.lineTo(X(e.r[0]) + cs - 6, Y(y) + cs - 8);
          ctx.stroke();
        }
      }
      if (e.kind === 'break' && broken) {
        const kk = clamp01((tt - evT('break')) / 0.8);
        ctx.fillStyle = INK(0.5 * (1 - kk));
        for (let j = 0; j < 6; j++) ctx.fillRect(X(e.r[0] + 0.5) + Math.cos(j * 1.3) * kk * 30 - 2, Y(e.r[1] + 1.5) + Math.sin(j * 1.7) * kk * 20 + kk * kk * 30 - 2, 4, 4);
      }
    });
    // 地底洞の這う敵：こちらへ這ってきて踏みつけられる
    if (tt > elAt[4] + 0.3) {
      const st = evT('stomp');
      const ex = 23.6 + clamp01((st - tt) / 1.4) * 0.9;
      const squash = clamp01((tt - st) / 0.25);
      const gone = clamp01((tt - st - 0.25) / 0.5);
      if (gone < 1) {
        const cx = X(ex);
        const fy = Y(25);
        const w = cs * 0.5;
        const h = cs * 0.38 * (1 - squash * 0.75);
        ctx.save();
        ctx.globalAlpha *= 1 - gone;
        ctx.beginPath();
        ctx.ellipse(cx, fy, w, h, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = INK(0.55);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - w * 0.45, fy - h * 0.5, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT(0.95);
        ctx.fill();
        ctx.restore();
        if (squash > 0) k.burst(cx, fy - 4, gone, 6);
      }
    }
    // 鐘の間の飛ぶ敵：主人公が近づくと急降下し、跳んだところを斬られる
    if (tt > elAt[16] + 0.3) {
      const bt = evT('bat');
      const dive = clamp01((tt - (bt - 0.9)) / 0.7);
      const bx = 27.6 + Math.sin(tt * 2.2) * 1.4 * (1 - dive);
      const by = 3 + dive * 1.2 + Math.sin(tt * 5) * 0.15;
      if (tt < bt + 0.05) {
        const cx = X(bx);
        const cy = Y(by);
        const flap = Math.sin(tt * 18) * 4;
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy - flap);
        ctx.lineTo(cx - 3, cy);
        ctx.lineTo(cx, cy - 3);
        ctx.lineTo(cx + 3, cy);
        ctx.lineTo(cx + 9, cy - flap);
        ctx.strokeStyle = INK(0.7);
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy + 1, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT(0.95);
        ctx.fill();
        if (dive > 0) k.label('!', cx, cy - 8, 0.95, { size: 12, mono: true, align: 'center', color: ACCENT });
      } else k.downed(X(27.6), Y(4.2), 1, tt - bt);
    }
    // 能力の台座・セーブ像・ボス
    if (tt > elAt[10] + 0.3) {
      const ax = X(43.5);
      const ay = Y(24.2);
      ctx.strokeStyle = INK(0.55);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(ax - 7.5, ay - 2.5, 15, 8);
      if (!hasAbility) {
        ctx.beginPath();
        ctx.arc(ax, ay - 12 + Math.sin(g * 2.4) * 2, 5, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT(0.8);
        ctx.fill();
      }
    }
    if (tt > elAt[0] + 0.3) k.iconSave(X(4.5), Y(16) - 12, 1, tt >= playStart, g);
    const bossI = ELS.findIndex((e) => e.name === 'ボスの間');
    if (tt > elAt[bossI] + 0.3) k.iconBoss(X(6), Y(9) - 16, 1, tt >= evT('clear'), g);
    // 部屋の名前
    ELS.forEach((e, i) => {
      if (!e.name || e.secret) return;
      const a = clamp01((tt - elAt[i] - 0.2) / 0.3);
      k.label(e.name, X(e.r[0]) + 5, Y(e.r[1]) + 13, (i === curRoom ? 0.85 : 0.5) * a, { color: i === curRoom ? ACCENT : INK });
    });
    // 設計の注記
    const notesAt = playStart - 0.4;
    if (tt > notesAt) {
      const a = clamp01((tt - notesAt) / 0.5);
      const dx = X(15) + 8;
      ctx.strokeStyle = INK(0.4 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dx + 0.5, Y(9));
      ctx.lineTo(dx + 0.5, Y(16));
      ctx.moveTo(dx - 3, Y(9) + 0.5);
      ctx.lineTo(dx + 4, Y(9) + 0.5);
      ctx.moveTo(dx - 3, Y(16) + 0.5);
      ctx.lineTo(dx + 4, Y(16) + 0.5);
      ctx.stroke();
      k.label('7', dx + 5, Y(12.8), 0.55 * a, { size: 9, mono: true });
      k.callout(X(41), Y(17), hasAbility ? '天井の穴（二段ジャンプで通れる）' : '天井の穴 · 二段ジャンプのゲート', a, true);
      k.callout(X(21.5), Y(26.6), 'トゲ', a, false);
      if (!broken) k.callout(X(15.5), Y(3), '壊せる壁（右からだけ）', a, true);
    }
    // 主人公と跡
    if (pos && trail.length > 1) k.trail([trail], g, (p) => ({ x: X(p.x), y: Y(p.y) - cs * 0.5 }));
    if (pos) {
      const px = X(pos.x);
      const py = Y(pos.y);
      ctx.fillStyle = ACCENT(0.95);
      ctx.beginPath();
      ctx.roundRect(px - cs * 0.28, py - cs * 1.15, cs * 0.56, cs * 1.1, cs * 0.2);
      ctx.fill();
      for (const e of events) {
        const since = tt - e.t;
        if (since < 0 || since > e.pause + 0.9) continue;
        k.callout(px, py - cs * 1.2, e.note, noteAlpha(since, e.pause + 0.9), e.event !== undefined);
      }
    }
    // 見出し：エリア名と、いま居る部屋
    if (k.showText() && k.width >= 640) {
      const cx = k.width / 2;
      const y0 = Math.max(30, Y(0) - 22);
      ctx.font = `10px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = INK(0.45);
      ctx.textAlign = 'center';
      ctx.fillText(`— ${AREA} —`, cx, y0);
      if (curRoom >= 0) {
        const first = trail.findIndex((p) => roomAt(p) === curRoom);
        const since = first >= 0 ? tt - (samples[Math.min(first, samples.length - 1)]?.t ?? tt) : 9;
        const a = clamp01(since / 0.3);
        ctx.font = `12px "Noto Sans JP", sans-serif`;
        ctx.fillStyle = ACCENT(0.85 * a);
        ctx.fillText(ELS[curRoom].name ?? '', cx, y0 + 16);
      }
      ctx.textAlign = 'left';
    }

    k.legend([
      ['部屋（壁と扉で区切る）', (x, y) => k.swatchBox(x, y, INK(0.06), INK(0.5))],
      ['すり抜け足場', (x, y) => k.swatchLine(x, y, INK(0.6), 2)],
      ['トゲ', (x, y) => {
        ctx.strokeStyle = ACCENT(0.8);
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 4);
        ctx.lineTo(x - 4, y - 3);
        ctx.lineTo(x, y + 4);
        ctx.lineTo(x + 4, y - 3);
        ctx.lineTo(x + 8, y + 4);
        ctx.stroke();
      }],
      ['扉 ／ ボス扉', (x, y) => {
        ctx.fillStyle = INK(0.55);
        ctx.fillRect(x - 6, y - 6, 3, 12);
        ctx.fillStyle = ACCENT(0.85);
        ctx.fillRect(x + 3, y - 6, 3, 12);
      }],
      ['壊せる壁', (x, y) => {
        ctx.strokeStyle = INK(0.55);
        ctx.strokeRect(x - 5.5, y - 5.5, 11, 11);
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4);
        ctx.lineTo(x + 4, y + 4);
        ctx.stroke();
      }],
      ['ジャンプの軌跡', (x, y) => {
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = ACCENT(0.75);
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 4);
        ctx.quadraticCurveTo(x, y - 10, x + 8, y + 4);
        ctx.stroke();
        ctx.setLineDash([]);
      }],
    ]);
    const pct = Math.round((visited.length / ROOMS.length) * 100);
    const phase = tt < playStart ? '部屋割り' : !hasAbility ? '探索 · 能力なし' : tt < evT('clear') ? '探索 · 二段ジャンプ' : 'エリア踏破';
    k.titleBlock('AREA MAP — SIDE VIEW', phase, `MAP ${pct}%`, `ROOM ${visited.length}/${ROOMS.length} · ABILITY ${hasAbility ? 1 : 0}/1`);
  };

  return { end, still: playStart - 0.01, render };
};
