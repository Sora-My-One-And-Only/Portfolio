/**
 * 01 · 療養院（屋内の箱庭・見下ろしの平面図・3 フロア）
 * 吹き抜けの中央ホール（ロゴの位置）を回廊が囲む、警察署や療養院のような屋内の箱庭。
 * B1・1F・2F の 3 枚の図面がページとして重なり、階を移るとページがめくれる。下の階の部屋は点線で透ける。
 * 鍵と扉：東病棟は病棟の鍵（B1 霊安室）、院長室は太陽と月の 2 つの紋章（1F 資料室・2F 東病棟）。
 * 部屋は「未探索・アイテムあり・探索済み（✓）」で塗り分ける。
 * 敵：1F 回廊の徘徊者は足音で気づいて追い、西階段の扉の外で待ち伏せる。B1 の見張りは視界を回している。
 * 最後は配膳リフトで 1F に下り、玄関ホールへ戻って輪がつながる。
 */
import { ACCENT, INK, Kit, clamp01, distUntil, easeInOut, easeOut, gridPath, inR, noteAlpha, pal, partOf, pointAt, polyLength, type Pt, type R4, type Scene } from './kit';

const AW = 46;
const AH = 28;
const COURT: R4 = [14, 8, 18, 12]; // 中央ホールの吹き抜け（ロゴの位置）
type ElKind = 'room' | 'corr' | 'door';
type DoorKind = 'normal' | 'locked' | 'boss' | 'secret';
type Tag = 'start' | 'save' | 'boss' | 'secret';
type El = { kind: ElKind; r: R4; name?: string; tag?: Tag; door?: DoorKind; dir?: 'h' | 'v' };
type Stairs = { r: R4; to: number; dir: 'up' | 'down' };
type Lift = { r: R4; to: number };
type Item = { x: number; y: number; kind: 'key' | 'sun' | 'moon'; ev: string };
type Floor = { label: string; els: El[]; stairs: Stairs[]; lifts: Lift[]; items: Item[]; gallery?: boolean };

const RING: El[] = [
  { kind: 'corr', r: [11, 5, 24, 2], name: 'ホール回廊' },
  { kind: 'corr', r: [33, 7, 2, 14] },
  { kind: 'corr', r: [11, 21, 24, 2] },
  { kind: 'corr', r: [11, 7, 2, 14] },
];
const FLOORS: Floor[] = [
  {
    label: 'B1',
    els: [
      { kind: 'room', r: [2, 16, 7, 6], name: '西階段 B1' },
      { kind: 'door', r: [4, 22, 2, 1], door: 'normal', dir: 'h' },
      { kind: 'corr', r: [4, 23, 2, 3] },
      { kind: 'corr', r: [6, 24, 14, 2], name: '配管通路' },
      { kind: 'door', r: [20, 24, 1, 2], door: 'normal', dir: 'v' },
      { kind: 'room', r: [21, 22, 8, 6], name: '霊安室' },
      { kind: 'door', r: [29, 25, 1, 1], door: 'secret', dir: 'v' },
      { kind: 'corr', r: [30, 25, 4, 1] },
      { kind: 'door', r: [34, 25, 1, 1], door: 'secret', dir: 'v' },
      { kind: 'room', r: [35, 23, 7, 5], name: '隠し保管庫', tag: 'secret' },
    ],
    stairs: [{ r: [3, 17, 3, 3], to: 1, dir: 'up' }],
    lifts: [],
    items: [{ x: 24, y: 24, kind: 'key', ev: 'key' }],
  },
  {
    label: '1F',
    els: [
      { kind: 'room', r: [17, 24, 12, 4], name: '玄関ホール', tag: 'start' },
      { kind: 'door', r: [22, 23, 2, 1], door: 'normal', dir: 'h' },
      ...RING,
      { kind: 'door', r: [10, 7, 1, 1], door: 'normal', dir: 'v' },
      { kind: 'room', r: [2, 4, 8, 8], name: '診察室' },
      { kind: 'door', r: [9, 18, 2, 1], door: 'normal', dir: 'v' },
      { kind: 'room', r: [2, 16, 7, 6], name: '西階段' },
      { kind: 'door', r: [22, 4, 1, 1], door: 'normal', dir: 'h' },
      { kind: 'room', r: [17, 0, 12, 4], name: '資料室' },
      { kind: 'door', r: [35, 15, 1, 1], door: 'locked', dir: 'v' },
      { kind: 'room', r: [36, 12, 8, 8], name: '東病棟' },
    ],
    stairs: [
      { r: [3, 17, 3, 3], to: 0, dir: 'down' },
      { r: [40, 13, 3, 3], to: 2, dir: 'up' },
    ],
    lifts: [{ r: [3, 9, 2, 2], to: 2 }],
    items: [{ x: 23, y: 1, kind: 'sun', ev: 'sun' }],
  },
  {
    label: '2F',
    gallery: true,
    els: [
      ...RING.map((e, i) => (i === 0 ? { ...e, name: '回廊（吹き抜けを見下ろす）' } : e)),
      { kind: 'door', r: [35, 15, 1, 1], door: 'normal', dir: 'v' },
      { kind: 'room', r: [36, 12, 8, 8], name: '東病棟 2F' },
      { kind: 'door', r: [35, 6, 1, 1], door: 'normal', dir: 'v' },
      { kind: 'room', r: [36, 1, 8, 8], name: 'ナースステーション', tag: 'save' },
      { kind: 'door', r: [10, 6, 1, 1], door: 'boss', dir: 'v' },
      { kind: 'room', r: [2, 1, 8, 11], name: '院長室', tag: 'boss' },
    ],
    stairs: [{ r: [40, 13, 3, 3], to: 1, dir: 'down' }],
    lifts: [{ r: [3, 9, 2, 2], to: 1 }],
    items: [{ x: 39, y: 17, kind: 'moon', ev: 'moon' }],
  },
];
type Way = { f: number; x: number; y: number; event?: string; note?: string; pause?: number; sneak?: boolean; to?: { f: number; x: number; y: number } };
const ROUTE: Way[] = [
  { f: 1, x: 22, y: 25 },
  { f: 1, x: 34, y: 15, event: 'locked', note: '鍵がかかっている（病棟の鍵が必要）', pause: 1.0 },
  { f: 1, x: 23, y: 1, event: 'sun', note: '太陽の紋章を入手', pause: 1.0 },
  { f: 1, x: 4, y: 18, event: 'stairs', note: '西階段に逃げ込み B1 へ', pause: 0.3, to: { f: 0, x: 4, y: 18 } },
  { f: 0, x: 4, y: 23, event: 'wait', note: '見張りが向こうを向くまで待つ', pause: 1.2 },
  { f: 0, x: 24, y: 24, event: 'key', note: '霊安室で病棟の鍵を入手', pause: 0.9, sneak: true },
  { f: 0, x: 4, y: 18, event: 'stairs', note: '1F へ戻る', pause: 0.3, sneak: true, to: { f: 1, x: 4, y: 18 } },
  { f: 1, x: 11, y: 18, event: 'fight', note: '扉の外で待ち伏せていた患者を撃退', pause: 0.9 },
  { f: 1, x: 34, y: 15, event: 'unlock', note: '病棟の鍵で東病棟を開ける', pause: 0.9 },
  { f: 1, x: 41, y: 14, event: 'stairs', note: '病棟の階段で 2F へ', pause: 0.3, to: { f: 2, x: 41, y: 14 } },
  { f: 2, x: 39, y: 17, event: 'moon', note: '月の紋章を入手', pause: 0.9 },
  { f: 2, x: 39, y: 4, event: 'save', note: 'セーブ · 安全な部屋', pause: 0.9 },
  { f: 2, x: 11, y: 6, event: 'bossdoor', note: '2 つの紋章をはめる → 院長室が開く', pause: 1.2 },
  { f: 2, x: 5, y: 5, event: 'clear', note: 'ボス撃破', pause: 1.1 },
  { f: 2, x: 3, y: 9, event: 'lift', note: '配膳リフトで 1F の診察室へ', pause: 0.3, to: { f: 1, x: 3, y: 9 } },
  { f: 1, x: 22, y: 25, event: 'loop', note: '玄関ホールへ — 近道で輪がつながる', pause: 2.2 },
];
const SENTRY = { x: 12.5, y: 25.4, w: (Math.PI * 2) / 5, reach: 4.2 };
const HUNTER = { home: 15, y: 21.5, cornerX: 11.5, stopY: 19.6, speed: 6 };
const SNEAK_SPEED = 6;
const STEP = 0.16;
const FLIP = 0.8;
const SPEED = 11;

type Leg = { f: number; pts: Pt[]; t0: number; t1: number; pause: number; event?: string; note?: string; to?: Way['to'] };

export const sanatorium = (k: Kit): Scene => {
  const { ctx } = k;
  const X = k.X;
  const Y = k.Y;

  const walk = FLOORS.map((fl) => {
    const g = new Uint8Array(AW * AH);
    for (const e of fl.els) for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++) for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) g[y * AW + x] = 1;
    return g;
  });
  const walkable = (f: number, x: number, y: number) => x >= 0 && y >= 0 && x < AW && y < AH && walk[f][y * AW + x] === 1;

  /* ---------- 段取り ---------- */
  const legs: Leg[] = [];
  const flips: { t: number; from: number; to: number }[] = [];
  const elAt: number[][] = FLOORS.map(() => []);
  const evAt: Record<string, number> = {};
  const visitAt = new Map<string, number>();
  let sentryT0 = 0;
  const hunter = { alert: Infinity, fight: Infinity };
  const sentryAngle = (t: number) => 0.45 + SENTRY.w * (t - sentryT0);

  let t = 0.3;
  const order = [1, 0, 2];
  order.forEach((f, i) => {
    if (i > 0) {
      flips.push({ t, from: order[i - 1], to: f });
      t += FLIP;
    }
    FLOORS[f].els.forEach((_, j) => (elAt[f][j] = t + j * STEP));
    t += FLOORS[f].els.length * STEP + 0.5;
  });
  flips.push({ t, from: 2, to: 1 });
  t += FLIP + 0.3;
  const playStart = t;
  {
    let cur: { f: number; x: number; y: number } = ROUTE[0];
    let unlocked = false;
    let bossOpen = false;
    for (let i = 1; i < ROUTE.length; i++) {
      const w = ROUTE[i];
      const f = cur.f;
      const closed = (x: number, y: number) => {
        const e = FLOORS[f].els.find((el) => el.kind === 'door' && inR(el.r, x, y));
        if (!e) return false;
        if (e.door === 'locked') return !unlocked;
        if (e.door === 'boss') return !bossOpen;
        return e.door === 'secret';
      };
      const pts = gridPath(AW, AH, (x, y) => walkable(f, x, y) && !closed(x, y), [cur.x, cur.y], [w.x, w.y]);
      if (import.meta.env.DEV && pts.length < 2) console.warn('[cover:sanatorium] unreachable leg', i);
      const speed = w.sneak ? SNEAK_SPEED : SPEED;
      // 見張りの前を通る区間：通路に入る瞬間に、視界が向こうを向いているよう時刻を合わせる
      if (w.sneak && f === 0) {
        const goingEast = w.x > cur.x;
        const enterT = t + distUntil(pts, (p) => (goingEast ? p.x >= 8 : p.x <= 17)) / speed;
        if (w.event === 'key') sentryT0 = enterT;
        else {
          const off = (((0.45 - sentryAngle(enterT)) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const extra = off / SENTRY.w;
          t += extra;
          const prev = legs[legs.length - 1];
          if (prev) prev.pause += extra;
        }
      }
      const dur = polyLength(pts) / speed;
      legs.push({ f, pts, t0: t, t1: t + dur, pause: w.pause ?? 0, event: w.event, note: w.note, to: w.to });
      if (w.to?.f === 0 && hunter.alert === Infinity) hunter.alert = t + distUntil(pts, (p) => p.x < 13.5 && p.y > 13) / speed;
      // 部屋に初めて入った時刻
      let dd = 0;
      for (let j = 1; j < pts.length; j++) {
        const a = pts[j - 1];
        const b = pts[j];
        const seg = Math.hypot(b.x - a.x, b.y - a.y);
        const n = Math.max(1, Math.ceil(seg * 2));
        for (let s = 0; s <= n; s++) {
          const p = { x: a.x + ((b.x - a.x) * s) / n, y: a.y + ((b.y - a.y) * s) / n };
          FLOORS[f].els.forEach((e, ei) => {
            if (e.kind !== 'room' || !inR(e.r, Math.floor(p.x), Math.floor(p.y))) return;
            const key = `${f}:${ei}`;
            if (!visitAt.has(key)) visitAt.set(key, t + (dd + (seg * s) / n) / speed);
          });
        }
        dd += seg;
      }
      t += dur;
      if (w.event && w.event !== 'stairs') evAt[w.event] = t;
      if (w.event === 'fight') hunter.fight = t + 0.15;
      if (w.event === 'unlock') unlocked = true;
      if (w.event === 'bossdoor') bossOpen = true;
      const leg = legs[legs.length - 1];
      t += leg.pause;
      if (w.to) {
        flips.push({ t: t - leg.pause * 0.2, from: f, to: w.to.f });
        t += FLIP;
        cur = { f: w.to.f, x: w.to.x, y: w.to.y };
      } else cur = w;
    }
  }
  const end = t + 1.2;

  const pageAt = (tt: number) => {
    let f = 1;
    for (const fl of flips) {
      if (tt < fl.t) break;
      if (tt < fl.t + FLIP) return { from: fl.from, to: fl.to, k: (tt - fl.t) / FLIP };
      f = fl.to;
    }
    return { from: f, to: f, k: 1 };
  };
  const sheet = () => ({ x: X(0) - 14, y: Y(0) - 14, w: AW * k.cs + 28, h: AH * k.cs + 28 });
  const ev = (name: string) => evAt[name] ?? Infinity;

  /* ---------- 描画 ---------- */
  const roomRemaining = (f: number, e: El, tt: number) => FLOORS[f].items.some((it) => inR(e.r, it.x, it.y) && tt < ev(it.ev));
  const roomFill = (f: number, i: number, e: El, tt: number) => {
    if (e.kind !== 'room' || tt < playStart) return e.tag === 'boss' ? ACCENT(0.05) : e.kind === 'corr' ? INK(0.02) : INK(0.03);
    const v = visitAt.get(`${f}:${i}`) ?? Infinity;
    if (tt < v) return INK(0.012);
    return roomRemaining(f, e, tt) ? ACCENT(0.1) : INK(0.065);
  };

  const drawDoor = (e: El, a: number, tt: number) => {
    const cs = k.cs;
    const [cx, cy, w, h] = e.r;
    const x0 = X(cx);
    const y0 = Y(cy);
    const vertical = e.dir === 'v';
    const span = (vertical ? h : w) * cs;
    ctx.lineWidth = 1;
    if (e.door === 'secret') {
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = INK(0.45 * a);
      ctx.beginPath();
      if (vertical) {
        ctx.moveTo(x0 + (w * cs) / 2, y0 + 2);
        ctx.lineTo(x0 + (w * cs) / 2, y0 + span - 2);
      } else {
        ctx.moveTo(x0 + 2, y0 + (h * cs) / 2);
        ctx.lineTo(x0 + span - 2, y0 + (h * cs) / 2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    const openAt = e.door === 'locked' ? ev('unlock') : e.door === 'boss' ? ev('bossdoor') : -Infinity;
    const open = clamp01((tt - openAt) / 0.5);
    const strong = e.door === 'locked' || e.door === 'boss';
    const color = strong ? ACCENT : INK;
    const leaves = span > cs * 1.5 ? 2 : 1;
    const leafLen = span / leaves;
    for (let i = 0; i < leaves; i++) {
      const hingeAlong = i === 0 ? 0 : span;
      const dirSign = i === 0 ? 1 : -1;
      const hx = vertical ? x0 + (w * cs) / 2 : x0 + hingeAlong;
      const hy = vertical ? y0 + hingeAlong : y0 + (h * cs) / 2;
      const closedAng = vertical ? (dirSign > 0 ? Math.PI / 2 : -Math.PI / 2) : dirSign > 0 ? 0 : Math.PI;
      const ang = closedAng + (strong ? open : 1) * (Math.PI / 2) * dirSign * -1;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + Math.cos(ang) * leafLen, hy + Math.sin(ang) * leafLen);
      ctx.strokeStyle = color(0.7 * a);
      ctx.lineWidth = strong ? 2 : 1.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx, hy, leafLen, Math.min(closedAng, ang), Math.max(closedAng, ang));
      ctx.strokeStyle = color(0.25 * a);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (e.door === 'locked' && open < 1) k.iconLock(x0 + (w * cs) / 2 + (vertical ? 12 : 0), y0 + (h * cs) / 2 - (vertical ? 0 : 12), a * (1 - open));
    if (e.door === 'boss' && open < 1) {
      // 2 つの紋章をはめるくぼみ（拾うと埋まる）
      const sx = x0 + w * cs + 14;
      const cy2 = y0 + (h * cs) / 2;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = ACCENT(0.85 * a * (1 - open));
      for (const [dy, name] of [
        [-8, 'sun'],
        [8, 'moon'],
      ] as [number, string][]) {
        ctx.beginPath();
        ctx.arc(sx, cy2 + dy, 5, 0, Math.PI * 2);
        ctx.stroke();
        if (tt >= ev(name)) {
          ctx.fillStyle = ACCENT(0.7 * (1 - open));
          ctx.fill();
        }
      }
    }
  };

  const drawStairs = (s: Stairs, a: number) => {
    const cs = k.cs;
    const [sx, sy, w, h] = s.r;
    const x0 = X(sx);
    const y0 = Y(sy);
    ctx.strokeStyle = INK(0.5 * a);
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + 0.5, y0 + 0.5, w * cs, h * cs);
    ctx.beginPath();
    for (let i = 1; i < 6; i++) {
      const y = y0 + (h * cs * i) / 6 + 0.5;
      ctx.moveTo(x0, y);
      ctx.lineTo(x0 + w * cs, y);
    }
    ctx.strokeStyle = INK(0.3 * a);
    ctx.stroke();
    const cx = x0 + (w * cs) / 2;
    const up = s.dir === 'up';
    ctx.beginPath();
    ctx.moveTo(cx, y0 + (up ? h * cs - 4 : 4));
    ctx.lineTo(cx, y0 + (up ? 6 : h * cs - 6));
    ctx.moveTo(cx - 4, y0 + (up ? 10 : h * cs - 10));
    ctx.lineTo(cx, y0 + (up ? 6 : h * cs - 6));
    ctx.lineTo(cx + 4, y0 + (up ? 10 : h * cs - 10));
    ctx.strokeStyle = ACCENT(0.8 * a);
    ctx.lineWidth = 1.3;
    ctx.stroke();
    k.label(`${up ? 'UP' : 'DN'} ${FLOORS[s.to].label}`, x0 + w * cs + 4, y0 + h * cs - 2, 0.85 * a, { size: 9, mono: true, color: ACCENT });
  };

  const drawLift = (l: Lift, a: number, tt: number) => {
    const cs = k.cs;
    const [lx, ly, w, h] = l.r;
    const x0 = X(lx) + 0.5;
    const y0 = Y(ly) + 0.5;
    const color = tt >= ev('clear') ? ACCENT : INK;
    ctx.strokeStyle = color(0.6 * a);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, y0, w * cs, h * cs);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + w * cs, y0 + h * cs);
    ctx.moveTo(x0 + w * cs, y0);
    ctx.lineTo(x0, y0 + h * cs);
    ctx.strokeStyle = color(0.35 * a);
    ctx.stroke();
    k.label(`配膳リフト ${FLOORS[l.to].label}`, x0 + w * cs + 4, y0 + h * cs - 2, 0.75 * a, { size: 9, color });
  };

  const drawHunter = (tt: number, a: number) => {
    const xAlert = HUNTER.home + Math.sin(hunter.alert * 0.8) * 1.5;
    let hx = HUNTER.home + Math.sin(tt * 0.8) * 1.5;
    let hy = HUNTER.y;
    let facing = Math.cos(tt * 0.8) >= 0 ? 0 : Math.PI;
    if (tt >= hunter.alert) {
      const d = Math.max(0, tt - hunter.alert - 0.4) * HUNTER.speed;
      const leg1 = xAlert - HUNTER.cornerX;
      if (d < leg1) {
        hx = xAlert - d;
        facing = Math.PI;
      } else {
        hx = HUNTER.cornerX;
        hy = Math.max(HUNTER.stopY, HUNTER.y - (d - leg1));
        facing = -Math.PI / 2;
      }
    }
    const x = X(hx);
    const y = Y(hy);
    if (tt >= hunter.fight) {
      k.downed(x, y, a, tt - hunter.fight);
      return;
    }
    const chasing = tt >= hunter.alert;
    k.enemy(x, y, a, facing, k.cs * (chasing ? 3.2 : 2.6), chasing);
    if (chasing && tt < hunter.alert + 1.6) k.callout(x, y, '足音に気づかれた → 追ってくる', a * clamp01((hunter.alert + 1.6 - tt) / 0.3), true);
    else if (!chasing) k.label('徘徊する患者', x + 8, y + 16, 0.5 * a, { size: 9 });
  };

  const drawSentry = (tt: number, a: number) => {
    const th = sentryAngle(tt);
    const watching = Math.sin(th) <= 0.35;
    const x = X(SENTRY.x);
    const y = Y(SENTRY.y);
    ctx.save();
    ctx.beginPath();
    ctx.rect(X(4), Y(23), 16 * k.cs, 3 * k.cs);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, k.cs * SENTRY.reach, th - 0.45, th + 0.45);
    ctx.closePath();
    ctx.fillStyle = ACCENT((watching ? 0.14 : 0.05) * a);
    ctx.fill();
    ctx.strokeStyle = ACCENT((watching ? 0.45 : 0.18) * a);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    k.enemy(x, y, a);
    k.label('見張り（視界が回る）', x + 8, Y(26) + 12, 0.5 * a, { size: 9 });
  };

  const drawTag = (e: El, a: number, tt: number, g: number) => {
    const cx = X(e.r[0] + e.r[2] / 2);
    const cy = Y(e.r[1] + e.r[3] / 2) + 4;
    if (e.tag === 'save') k.iconSave(cx, cy, a, tt >= ev('save'), g);
    if (e.tag === 'boss') k.iconBoss(cx, cy, a, tt >= ev('clear'), g);
    if (e.tag === 'start') k.iconFlag(cx, cy, a);
    if (e.tag === 'secret') {
      k.iconChest(cx, cy, a);
      k.label('任意 · 隠し通路', cx, cy + 20, 0.45 * a, { size: 9, align: 'center' });
    }
  };

  const drawFloor = (f: number, tt: number, g: number) => {
    const cs = k.cs;
    const fl = FLOORS[f];
    const at = elAt[f];
    const below = f - 1;
    if (below >= 0) {
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = INK(0.1);
      ctx.lineWidth = 1;
      for (const e of FLOORS[below].els) if (e.kind === 'room') ctx.strokeRect(X(e.r[0]) + 0.5, Y(e.r[1]) + 0.5, e.r[2] * cs, e.r[3] * cs);
      ctx.setLineDash([]);
    }
    fl.els.forEach((e, i) => {
      const a = clamp01((tt - at[i]) / 0.25);
      if (a <= 0) return;
      const vis = easeOut(a);
      ctx.save();
      ctx.beginPath();
      ctx.rect(X(e.r[0]) - 2, Y(e.r[1]) - 2, e.r[2] * cs * vis + 4, e.r[3] * cs + 4);
      ctx.clip();
      ctx.fillStyle = roomFill(f, i, e, tt);
      ctx.fillRect(X(e.r[0]), Y(e.r[1]), e.r[2] * cs, e.r[3] * cs);
      ctx.restore();
    });
    // 壁：歩けるマスと歩けないマスの境目
    fl.els.forEach((e, i) => {
      const a = clamp01((tt - at[i]) / 0.25);
      if (a <= 0) return;
      const vis = easeOut(a);
      ctx.save();
      ctx.beginPath();
      ctx.rect(X(e.r[0]) - 3, Y(e.r[1]) - 3, e.r[2] * cs * vis + 6, e.r[3] * cs + 6);
      ctx.clip();
      const solid = new Path2D();
      const rail = new Path2D();
      for (let y = e.r[1]; y < e.r[1] + e.r[3]; y++)
        for (let x = e.r[0]; x < e.r[0] + e.r[2]; x++) {
          const sides: [number, number, number, number, number, number][] = [
            [x, y - 1, x, y, x + 1, y],
            [x, y + 1, x, y + 1, x + 1, y + 1],
            [x - 1, y, x, y, x, y + 1],
            [x + 1, y, x + 1, y, x + 1, y + 1],
          ];
          for (const [nx, ny, x1, y1, x2, y2] of sides) {
            if (walkable(f, nx, ny)) continue;
            const target = fl.gallery && inR(COURT, nx, ny) ? rail : solid;
            target.moveTo(X(x1) + 0.5, Y(y1) + 0.5);
            target.lineTo(X(x2) + 0.5, Y(y2) + 0.5);
          }
        }
      ctx.strokeStyle = e.tag === 'boss' ? ACCENT(0.6) : INK(e.kind === 'corr' ? 0.4 : 0.48);
      ctx.lineWidth = e.kind === 'room' ? 2 : 1.6;
      ctx.lineCap = 'square';
      ctx.stroke(solid);
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = INK(0.4);
      ctx.lineWidth = 1;
      ctx.stroke(rail);
      ctx.setLineDash([]);
      ctx.lineCap = 'butt';
      ctx.restore();
    });
    fl.els.forEach((e, i) => {
      if (e.kind !== 'door') return;
      const a = clamp01((tt - at[i]) / 0.25);
      if (a > 0) drawDoor(e, a, tt);
    });
    const hostA = (x: number, y: number, delay: number) => {
      const host = fl.els.findIndex((e) => e.kind === 'room' && inR(e.r, x, y));
      return clamp01((tt - (at[host] ?? 0) - delay) / 0.3);
    };
    fl.stairs.forEach((s) => {
      const a = hostA(s.r[0], s.r[1], 0.2);
      if (a > 0) drawStairs(s, a);
    });
    fl.lifts.forEach((l) => {
      const a = hostA(l.r[0], l.r[1], 0.2);
      if (a > 0) drawLift(l, a, tt);
    });
    fl.els.forEach((e, i) => {
      if (!e.name) return;
      const a = clamp01((tt - at[i] - 0.2) / 0.3);
      if (a <= 0) return;
      k.label(e.name, X(e.r[0]) + 6, Y(e.r[1]) + 14, (e.tag === 'boss' ? 0.8 : 0.55) * a, { color: e.tag === 'boss' ? ACCENT : INK });
      drawTag(e, a, tt, g);
    });
    // 探索済みの部屋の ✓
    if (tt >= playStart && k.showText())
      fl.els.forEach((e, i) => {
        if (e.kind !== 'room') return;
        const v = visitAt.get(`${f}:${i}`) ?? Infinity;
        if (tt < v || roomRemaining(f, e, tt)) return;
        const x = X(e.r[0] + e.r[2]) - 12;
        const y = Y(e.r[1]) + 10;
        ctx.strokeStyle = INK(0.5);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x - 1, y + 3);
        ctx.lineTo(x + 4, y - 3);
        ctx.stroke();
      });
    fl.items.forEach((it) => {
      const a = hostA(it.x, it.y, 0.25);
      if (a <= 0 || tt >= ev(it.ev)) return;
      const cx = X(it.x + 0.5);
      const cy = Y(it.y + 0.5) + Math.sin(g * 2.4 + it.x) * 1.2;
      if (it.kind === 'key') k.iconKey(cx, cy, a);
      else if (it.kind === 'sun') k.iconSun(cx, cy, a);
      else k.iconMoon(cx, cy, a);
    });
    if (tt > playStart - 1.2) {
      const a = clamp01((tt - (playStart - 1.2)) / 0.6);
      if (f === 1) drawHunter(tt, a);
      if (f === 0) drawSentry(tt, a);
    }
  };

  const playerAt = (tt: number) => {
    if (tt < playStart) return null;
    const trails: Pt[][][] = FLOORS.map(() => []);
    let pos: Pt = { x: ROUTE[0].x + 0.5, y: ROUTE[0].y + 0.5 };
    let f = ROUTE[0].f;
    let note: { text: string; a: number; strong: boolean } | null = null;
    for (const leg of legs) {
      if (tt < leg.t0) break;
      if (tt < leg.t1) {
        const p = (tt - leg.t0) / (leg.t1 - leg.t0);
        pos = pointAt(leg.pts, p);
        trails[leg.f].push(partOf(leg.pts, p));
        return { pos, f: leg.f, trails, note };
      }
      trails[leg.f].push(leg.pts);
      pos = leg.pts[leg.pts.length - 1];
      f = leg.f;
      const since = tt - leg.t1;
      if (leg.note && since < leg.pause + 1.0) note = { text: leg.note, a: noteAlpha(since, leg.pause + 1.0), strong: leg.event !== 'stairs' };
      if (leg.to && tt >= leg.t1 + leg.pause * 0.8) {
        f = leg.to.f;
        pos = { x: leg.to.x + 0.5, y: leg.to.y + 0.5 };
      }
    }
    return { pos, f, trails, note };
  };

  const render = (tt: number, g: number) => {
    k.fit(AW, AH);
    const page = pageAt(tt);
    const s = sheet();
    const pl = k.reduceMotion ? null : playerAt(tt);
    for (const d of [2, 1]) {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(s.x + d * 6, s.y - d * 6, s.w, s.h);
      ctx.strokeStyle = INK(0.12);
      ctx.lineWidth = 1;
      ctx.strokeRect(s.x + d * 6 + 0.5, s.y - d * 6 + 0.5, s.w, s.h);
    }
    /** 1 枚の図面。dy だけ上下にずらし、alpha で重ねる（形はつぶさない） */
    const drawPage = (f: number, dy: number, alpha: number, shade: number, lifted: number) => {
      ctx.save();
      ctx.globalAlpha *= alpha;
      ctx.translate(0, dy);
      if (lifted > 0) {
        // 持ち上がった紙の影
        ctx.fillStyle = INK(0.07 * lifted);
        ctx.fillRect(s.x + 6, s.y + 8, s.w, s.h);
      }
      ctx.fillStyle = pal.bg;
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.strokeStyle = INK(0.28);
      ctx.lineWidth = 1;
      ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w, s.h);
      drawFloor(f, tt, g);
      if (pl && pl.f === f) {
        k.trail(pl.trails[f], g, (p) => ({ x: X(p.x), y: Y(p.y) }));
        k.player(X(pl.pos.x), Y(pl.pos.y), g);
      }
      if (shade > 0) {
        ctx.fillStyle = INK(0.08 * shade);
        ctx.fillRect(s.x, s.y, s.w, s.h);
      }
      ctx.restore();
    };
    // 階を移る：上の階へは新しい図面が上から重なり、下の階へは今の図面が下へ抜けて下の図面が現れる
    if (page.k >= 1 || page.from === page.to) drawPage(page.to, 0, 1, 0, 0);
    else {
      const e = easeInOut(page.k);
      const slide = Math.min(s.h * 0.16, 120);
      const lift = Math.sin(page.k * Math.PI);
      if (page.to > page.from) {
        drawPage(page.from, 0, 1, e, 0);
        drawPage(page.to, -(1 - e) * slide, 1 - Math.pow(1 - e, 3), 0, lift);
      } else {
        drawPage(page.to, 0, 1, 1 - e, 0);
        drawPage(page.from, e * slide, 1 - Math.pow(e, 3), 0, lift);
      }
    }

    // 階のつまみ
    const cur = page.k < 0.5 ? page.from : page.to;
    FLOORS.forEach((fl, i) => {
      const tx = s.x + 18 + i * 62;
      const ty = s.y - 24;
      const active = i === cur;
      ctx.fillStyle = pal.bg;
      ctx.fillRect(tx, ty, 56, 24);
      ctx.strokeStyle = active ? ACCENT(0.8) : INK(0.25);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx + 0.5, ty + 24);
      ctx.lineTo(tx + 0.5, ty + 0.5);
      ctx.lineTo(tx + 56.5, ty + 0.5);
      ctx.lineTo(tx + 56.5, ty + 24);
      ctx.stroke();
      ctx.font = `bold 11px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = active ? ACCENT(0.95) : INK(0.45);
      ctx.textAlign = 'center';
      ctx.fillText(fl.label, tx + 28, ty + 16);
      ctx.textAlign = 'left';
    });
    k.taken.push({ x0: s.x, y0: s.y - 26, x1: s.x + 210, y1: s.y });
    if (pl?.note && page.k >= 1) k.callout(X(pl.pos.x), Y(pl.pos.y), pl.note.text, pl.note.a, pl.note.strong);

    k.legend([
      ['未探索の部屋', (x, y) => k.swatchBox(x, y, null)],
      ['アイテムが残る部屋', (x, y) => k.swatchBox(x, y, ACCENT(0.25))],
      ['探索済み（取り残しなし）', (x, y) => k.swatchBox(x, y, INK(0.15))],
      ['鍵扉 ／ 紋章の扉', (x, y) => k.swatchLine(x, y, ACCENT(0.9), 2)],
      ['階段 ／ 配膳リフト', (x, y) => {
        ctx.strokeStyle = INK(0.45);
        ctx.strokeRect(x - 6.5, y - 6.5, 13, 13);
        ctx.beginPath();
        for (const d of [-3, 0, 3]) {
          ctx.moveTo(x - 6, y + d);
          ctx.lineTo(x + 6, y + d);
        }
        ctx.stroke();
      }],
      ['吹き抜け（手すり）', (x, y) => k.swatchLine(x, y, INK(0.45), 1, [4, 3])],
      ['敵 ／ 視界', (x, y) => k.enemy(x, y, 1, 0, 9)],
      ['プレイヤーの動線', (x, y) => k.swatchLine(x, y, ACCENT(0.75), 1.5, [3, 4])],
    ]);
    const phase = tt < playStart ? '平面図' : tt < ev('loop') ? '試遊' : '輪がつながった';
    k.titleBlock(`SANATORIUM — ${FLOORS[cur].label}`, phase, 'INDOOR LEVEL', `${FLOORS.length} FLOORS · KEY & DOOR`);
  };

  return { end, still: playStart - 0.01, render };
};
