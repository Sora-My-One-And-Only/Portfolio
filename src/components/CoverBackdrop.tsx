import { useEffect, useRef, type FC } from 'react';
import { G, INK, Kit, MONO, clamp01, pal, type Scene } from './cover/kit';
import { sanatorium } from './cover/scene-sanatorium';
import { village } from './cover/scene-village';
import { legacy } from './cover/scene-legacy';
import { metroArea } from './cover/scene-metro-area';
import { metroWorld } from './cover/scene-metro-world';

/**
 * 表紙の背景（すべてコードで描くオリジナルのアニメーション）。5 枚のレベルデザインの設計図を順に見せる。
 *
 * 01 療養院     屋内の箱庭・見下ろしの平面図・3 フロア（鍵と扉、ページをめくって階を移る）
 * 02 村         屋外の大きな地図・ハブ＆スポーク（霧が晴れていく領域、立てこもり、追跡者、水位）
 * 03 城塞       立体の箱庭・分解アクソメ図（階段・梯子・飛び降り・昇降機、近道で輪がつながる）
 * 04 地下聖堂   横から見た 1 エリア（壁と扉で区切った小部屋、能力ゲート、壊せる壁）
 * 05 世界地図   複数エリアの全体図（エリアの中の部屋割り、能力で開く関門）
 *
 * 各場面の地図は手で設計し、主人公の道筋は地図の「通れる」マスや道の上で探索して作るので、壁を通り抜けない。
 * 色はページの配色（CSS 変数 --cover-*）に従い、昼夜・配色の切り替え中は毎コマ読み直す。
 * 画面外・別タブでは止まり、「視差効果を減らす」設定では 01 の平面図を 1 枚だけ表示する。
 */
export const CoverBackdrop: FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    const start = performance.now();
    const paper = document.createElement('canvas');
    const kit = new Kit(ctx);
    kit.reduceMotion = reduceMotion;

    /* ---------- 配色（ページの CSS 変数から） ---------- */
    const scratch = document.createElement('canvas').getContext('2d');
    const toTriplet = (value: string, fallback: string) => {
      if (!scratch || !value) return fallback;
      scratch.fillStyle = '#000';
      scratch.fillStyle = value;
      const v = String(scratch.fillStyle);
      if (v.startsWith('#')) {
        const n = parseInt(v.slice(1, 7), 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      }
      const rgb = v.match(/rgba?\(([^)]+)\)/);
      if (rgb) return rgb[1].split(',').slice(0, 3).map((x) => x.trim()).join(', ');
      const srgb = v.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
      if (srgb) return [srgb[1], srgb[2], srgb[3]].map((x) => Math.round(parseFloat(x) * 255)).join(', ');
      return fallback;
    };
    const readPalette = () => {
      const cs = getComputedStyle(canvas);
      pal.bg = cs.getPropertyValue('--cover-bg').trim() || pal.bg;
      pal.ink = toTriplet(cs.getPropertyValue('--cover-ink').trim(), pal.ink);
      pal.accent = toTriplet(cs.getPropertyValue('--cover-accent').trim(), pal.accent);
      pal.alpha = parseFloat(cs.getPropertyValue('--cover-alpha')) || 1;
    };
    let followUntil = 0;
    const followPalette = (now: number) => {
      if (now > followUntil) return false;
      readPalette();
      drawPaper();
      return true;
    };

    /* ---------- 方眼紙・定規 ---------- */
    const drawPaper = () => {
      paper.width = Math.round(width * dpr);
      paper.height = Math.round(height * dpr);
      const p = paper.getContext('2d');
      if (!p) return;
      p.setTransform(dpr, 0, 0, dpr, 0, 0);
      p.fillStyle = pal.bg;
      p.fillRect(0, 0, width, height);
      p.lineWidth = 1;
      for (let x = 0, i = 0; x <= width; x += G, i++) {
        p.beginPath();
        p.moveTo(x + 0.5, 0);
        p.lineTo(x + 0.5, height);
        p.strokeStyle = i % 5 === 0 ? INK(0.042) : INK(0.016);
        p.stroke();
      }
      for (let y = 0, i = 0; y <= height; y += G, i++) {
        p.beginPath();
        p.moveTo(0, y + 0.5);
        p.lineTo(width, y + 0.5);
        p.strokeStyle = i % 5 === 0 ? INK(0.042) : INK(0.016);
        p.stroke();
      }
      p.font = `8px ${MONO}`;
      p.fillStyle = INK(0.22);
      p.strokeStyle = INK(0.2);
      for (let x = 0, i = 0; x <= width; x += G, i++) {
        const major = i % 5 === 0;
        p.beginPath();
        p.moveTo(x + 0.5, 0);
        p.lineTo(x + 0.5, major ? 9 : 4);
        p.stroke();
        if (major && i > 0) p.fillText(String(i), x + 3, 16);
      }
      for (let y = 0, i = 0; y <= height; y += G, i++) {
        const major = i % 5 === 0;
        p.beginPath();
        p.moveTo(0, y + 0.5);
        p.lineTo(major ? 9 : 4, y + 0.5);
        p.stroke();
        if (major && i > 0) p.fillText(String(i), 12, y + 3);
      }
    };

    /* ---------- 場面 ---------- */
    const scenes: Scene[] = [sanatorium(kit), village(kit), legacy(kit), metroArea(kit), metroWorld(kit)];
    let sceneIdx = 0;
    let cycleStart = start;
    /** 開発中の確認用：#cover=1&freeze=3.7 でその時刻に止める */
    let frozenAt: number | null = null;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kit.width = width;
      kit.height = height;
      drawPaper();
    };

    /** 場面の番号（右上の小さな目次） */
    const drawIndex = () => {
      if (width < 640) return;
      const n = scenes.length;
      const x0 = width - 40 - n * 22;
      const y = 34;
      for (let i = 0; i < n; i++) {
        const active = i === sceneIdx;
        ctx.font = `${active ? 'bold ' : ''}9px ${MONO}`;
        ctx.fillStyle = INK(active ? 0.75 : 0.3);
        ctx.fillText(String(i + 1).padStart(2, '0'), x0 + i * 22, y);
        if (active) ctx.fillRect(x0 + i * 22, y + 4, 12, 1.5);
      }
    };

    const render = (now: number) => {
      let t = frozenAt ?? (now - cycleStart) / 1000;
      if (!reduceMotion && t > scenes[sceneIdx].end) {
        sceneIdx = (sceneIdx + 1) % scenes.length;
        cycleStart = now;
        t = 0;
      }
      const scene = reduceMotion ? scenes[0] : scenes[sceneIdx];
      const g = (now - start) / 1000;
      kit.taken = [];
      kit.tag = `${String((reduceMotion ? 0 : sceneIdx) + 1).padStart(2, '0')}/${String(scenes.length).padStart(2, '0')}`;
      ctx.globalAlpha = 1;
      ctx.drawImage(paper, 0, 0, width, height);
      const fade = reduceMotion ? 1 : Math.min(clamp01(t / 0.5), 1 - clamp01((t - (scene.end - 1.0)) / 1.0));
      ctx.globalAlpha = fade;
      scene.render(reduceMotion ? scene.still : t, g);
      ctx.globalAlpha = 1;
      if (!reduceMotion) drawIndex();
    };

    const loop = (now: number) => {
      followPalette(now);
      render(now);
      if (running && visible && !reduceMotion) raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    readPalette();
    resize();
    render(performance.now());
    if (!reduceMotion) startLoop();

    const onResize = () => {
      resize();
      if (reduceMotion || !visible) render(performance.now());
    };
    window.addEventListener('resize', onResize);

    // 画面外・別タブでは止める
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        readPalette();
        drawPaper();
      }
      if (visible && running && !reduceMotion) startLoop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      running = !document.hidden;
      if (running && visible && !reduceMotion) startLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 昼夜の切り替えや配色の変更：色の移り変わり（index.css の 800ms）が終わるまで、毎コマ色を追いかける
    let followRaf = 0;
    const mo = new MutationObserver(() => {
      followUntil = performance.now() + 1000;
      if (reduceMotion || !visible || !running) {
        cancelAnimationFrame(followRaf);
        const step = (now: number) => {
          const more = followPalette(now);
          render(now);
          if (more) followRaf = requestAnimationFrame(step);
        };
        followRaf = requestAnimationFrame(step);
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-light', 'data-dark'] });

    // 開発中の確認：URL に #cover=3 のように付けると、その場面から始める
    if (import.meta.env.DEV) {
      const m = location.hash.match(/cover=(\d)/);
      if (m) sceneIdx = Math.min(scenes.length - 1, Math.max(0, Number(m[1]) - 1));
      const at = location.hash.match(/at=([\d.]+)/);
      if (at) cycleStart = performance.now() - Number(at[1]) * 1000;
      const fz = location.hash.match(/freeze=([\d.]+)/);
      if (fz) frozenAt = Number(fz[1]);
      (window as unknown as { __coverEnds?: number[] }).__coverEnds = scenes.map((s) => s.end);
    }

    return () => {
      mo.disconnect();
      cancelAnimationFrame(followRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden />;
};
