import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Film,
  Gamepad2,
  RotateCcw,
  Shield,
  Sword,
  Zap,
  Link2,
} from 'lucide-react';
import { Locale, ProjectSpec } from '../data/i18n';
import { soundFX } from '../utils/sound';

interface InteractiveGameStageProps {
  project: ProjectSpec;
  locale: Locale;
  initialMode?: 'video' | 'playable';
}

export const InteractiveGameStage: React.FC<InteractiveGameStageProps> = ({
  project,
  locale,
  initialMode = 'video',
}) => {
  const [stageMode, setStageMode] = useState<'video' | 'playable'>(initialMode);
  const [customMediaUrl, setCustomMediaUrl] = useState<string>('');
  const [customIframeUrl, setCustomIframeUrl] = useState<string>('');
  const [showUrlConfig, setShowUrlConfig] = useState<boolean>(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);

  // Built-in 60FPS Playable Combat / Level Mini-Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerState, setPlayerState] = useState<'idle' | 'slash' | 'parry' | 'dodge' | 'hitstop'>('idle');
  const [bossFrame, setBossFrame] = useState<number>(0);
  const [bossPosture, setBossPosture] = useState<number>(35);
  const [playerCombo, setPlayerCombo] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<string>('READY · 60FPS INTERACTIVE STAGE');

  const stateRef = useRef({
    playerAction: 'idle' as 'idle' | 'slash' | 'parry' | 'dodge' | 'hitstop',
    actionTimer: 0,
    bossCycle: 0,
    hitstopFrames: 0,
    playerX: 190,
    bossX: 450,
    sparkTimer: 0,
    posture: 35,
  });

  useEffect(() => {
    setStageMode(initialMode);
  }, [initialMode, project.id]);

  // Trigger Player Actions in Playable Mode or Demo Loop in Video Mode
  const triggerSlash = () => {
    const s = stateRef.current;
    if (s.hitstopFrames > 0) return;
    soundFX.playSlashHit();
    s.playerAction = 'slash';
    s.actionTimer = 18;
    s.sparkTimer = 8;
    s.posture = Math.min(100, s.posture + 14);
    setPlayerState('slash');
    setBossPosture(s.posture);
    setPlayerCombo((c) => c + 1);
    setLastFeedback(
      locale === 'ja'
        ? '斬撃ヒット！ 発生8F / 持続3F / 有利+2F'
        : locale === 'zh'
        ? '斩击命中！前摇 8F / 持续 3F / 帧差 +2F'
        : 'SLASH HIT! Startup 8F / Active 3F / +2F Adv'
    );
  };

  const triggerParry = () => {
    const s = stateRef.current;
    // Check if boss is in active windup/strike window (frames 42..68 of 110 cycle)
    const inJustWindow = s.bossCycle >= 38 && s.bossCycle <= 72;
    s.playerAction = 'parry';
    s.actionTimer = 20;
    setPlayerState('parry');

    if (inJustWindow) {
      soundFX.playParrySpark();
      s.hitstopFrames = 10;
      s.sparkTimer = 16;
      s.posture = Math.min(100, s.posture + 32);
      setBossPosture(s.posture);
      setPlayerCombo((c) => c + 1);
      setLastFeedback(
        locale === 'ja'
          ? '★ ジャストパリィ成立！ (6F受付 / ヒットストップ10F / 硬直差 +12F)'
          : locale === 'zh'
          ? '★ 完美弹反成立！(6F 窗口 / 10F 卡肉停顿 / 帧差 +12F)'
          : '★ JUST PARRY! (6F Window / 10F Hitstop / +12F Stagger)'
      );
    } else {
      soundFX.playBlip(420);
      setLastFeedback(
        locale === 'ja'
          ? 'ガード構え (6Fパリィ受付ウィンドウ待機中...)'
          : locale === 'zh'
          ? '防御架势 (等待红光闪现瞬间按下触发 6F 完美弹反)'
          : 'GUARD STANCE (Time with Boss Red Flash for 6F Just-Parry)'
      );
    }
  };

  const triggerDodge = () => {
    const s = stateRef.current;
    soundFX.playBlip(720);
    s.playerAction = 'dodge';
    s.actionTimer = 15;
    setPlayerState('dodge');
    setLastFeedback(
      locale === 'ja'
        ? 'ステップ回避！ 無敵フレーム 1F〜11F (I-Frames)'
        : locale === 'zh'
        ? '垫步闪避！触发 1F~11F 无敌帧 (I-Frames)'
        : 'QUICK-STEP DODGE! Invulnerable 1F–11F (I-Frames)'
    );
  };

  const resetMiniGame = () => {
    soundFX.playSelect();
    stateRef.current.posture = 0;
    stateRef.current.bossCycle = 0;
    setBossPosture(0);
    setPlayerCombo(0);
    setLastFeedback('STAGE RESET · 60FPS READY');
  };

  // Keyboard bindings when in Playable Mode
  useEffect(() => {
    if (stageMode !== 'playable') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'KeyJ') {
        e.preventDefault();
        triggerSlash();
      } else if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        triggerParry();
      } else if (e.code === 'KeyL' || e.code === 'ShiftLeft') {
        e.preventDefault();
        triggerDodge();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stageMode, locale]);

  // 60FPS Canvas Loop for both Demo Reel (Video/GIF preview) and Interactive Playable Trial
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const s = stateRef.current;

      if (stageMode === 'video' && !isPlayingVideo) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Handle Hitstop Freeze
      if (s.hitstopFrames > 0) {
        s.hitstopFrames--;
      } else {
        s.bossCycle = (s.bossCycle + 1) % 110;
        if (s.actionTimer > 0) {
          s.actionTimer--;
          if (s.actionTimer === 0) {
            s.playerAction = 'idle';
            setPlayerState('idle');
          }
        }
        // In automated Video/GIF preview mode, auto-demo parry & slash!
        if (stageMode === 'video' && s.bossCycle === 54) {
          s.playerAction = 'parry';
          s.actionTimer = 16;
          s.sparkTimer = 14;
          s.hitstopFrames = 7;
        }
      }

      if (s.sparkTimer > 0) s.sparkTimer--;
      if (tick % 4 === 0) {
        setBossFrame(s.bossCycle);
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle console arena background
      ctx.fillStyle = '#151C24';
      ctx.fillRect(0, 0, w, h);

      // Tactical 60FPS Grid Lines
      ctx.strokeStyle = 'rgba(56, 178, 166, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Ground plane line
      const groundY = h - 54;
      ctx.strokeStyle = 'rgba(56, 178, 166, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, groundY);
      ctx.lineTo(w - 24, groundY);
      ctx.stroke();

      // Determine Boss Attack Telegraph & Strike State
      const isWindup = s.bossCycle >= 32 && s.bossCycle < 52;
      const isActiveStrike = s.bossCycle >= 52 && s.bossCycle <= 66;
      const bossOffset = isActiveStrike ? -95 : isWindup ? 18 : Math.sin(tick * 0.05) * 6;
      const currentBossX = s.bossX + bossOffset;

      // Draw Player Character (Hurtbox + Action State)
      const dodgeShift = s.playerAction === 'dodge' ? -45 : s.playerAction === 'slash' ? 35 : 0;
      const px = s.playerX + dodgeShift;
      const py = groundY - 76;

      // Player Hurtbox (Sky during I-Frames, Emerald normally)
      ctx.fillStyle =
        s.playerAction === 'dodge'
          ? 'rgba(56, 189, 248, 0.25)'
          : 'rgba(52, 211, 153, 0.2)';
      ctx.strokeStyle = s.playerAction === 'dodge' ? '#38BDF8' : '#34D399';
      ctx.lineWidth = 2;
      ctx.fillRect(px, py, 46, 76);
      ctx.strokeRect(px, py, 46, 76);

      // Player Label
      ctx.fillStyle = '#E6EDF3';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(
        s.playerAction === 'dodge' ? 'PLAYER [I-FRAME]' : 'PLAYER [60FPS]',
        px - 6,
        py - 8
      );

      // Player Slash Hitbox or Parry Shield Arc
      if (s.playerAction === 'slash') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.fillRect(px + 46, py + 10, 115, 48);
        ctx.strokeRect(px + 46, py + 10, 115, 48);
        ctx.fillStyle = '#BAE6FD';
        ctx.fillText('HITBOX (ACTIVE 3F)', px + 52, py + 38);
      } else if (s.playerAction === 'parry') {
        ctx.strokeStyle = '#38B2A6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px + 48, py + 38, 42, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();
        ctx.fillStyle = '#99F6E4';
        ctx.fillText('DEFLECT 6F', px + 58, py + 20);
      }

      // Draw Boss Entity
      const by = groundY - 96;
      ctx.fillStyle = isWindup
        ? 'rgba(56, 189, 248, 0.26)'
        : isActiveStrike
        ? 'rgba(244, 63, 94, 0.35)'
        : 'rgba(56, 178, 166, 0.16)';
      ctx.strokeStyle = isWindup ? '#38BDF8' : isActiveStrike ? '#F43F5E' : '#38B2A6';
      ctx.lineWidth = 2;
      ctx.fillRect(currentBossX, by, 64, 96);
      ctx.strokeRect(currentBossX, by, 64, 96);

      ctx.fillStyle = isWindup ? '#7DD3FC' : isActiveStrike ? '#FDA4AF' : '#38B2A6';
      ctx.fillText(
        isWindup
          ? '⚠ WINDUP (22F) - PARRY NOW!'
          : isActiveStrike
          ? 'BOSS ACTIVE STRIKE (6F)'
          : `BOSS AI [FRAME ${String(s.bossCycle).padStart(3, '0')}]`,
        currentBossX - 24,
        by - 10
      );

      // Boss Active Cleave Hitbox
      if (isActiveStrike) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
        ctx.strokeStyle = '#F43F5E';
        ctx.fillRect(currentBossX - 110, by + 18, 110, 56);
        ctx.strokeRect(currentBossX - 110, by + 18, 110, 56);
      }

      // Draw Parry / Clash Sparks
      if (s.sparkTimer > 0) {
        const cx = (px + 46 + currentBossX) / 2;
        const cy = groundY - 48;
        ctx.strokeStyle = '#5EEAD4';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4 + tick * 0.1;
          const r1 = 6;
          const r2 = 28 + (16 - s.sparkTimer) * 1.5;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }
      }

      // Top-left HUD Telemetry inside Canvas
      ctx.fillStyle = 'rgba(21, 28, 36, 0.82)';
      ctx.fillRect(16, 14, 240, 32);
      ctx.strokeStyle = 'rgba(56, 178, 166, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 14, 240, 32);
      ctx.fillStyle = '#38B2A6';
      ctx.fillText(
        s.hitstopFrames > 0
          ? `HITSTOP FREEZE: ${s.hitstopFrames}F`
          : `60FPS FRAME TIMELINE · ${String(s.bossCycle).padStart(3, '0')}F / 110F`,
        26,
        34
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [stageMode, isPlayingVideo]);

  const isGifUrl = customMediaUrl.toLowerCase().endsWith('.gif');

  return (
    <div className="rounded-lg border border-[#DCE2E8] dark:border-[#2A3543] bg-white dark:bg-[#1C2530] overflow-hidden mb-10 card-3d-console">
      {/* Top Stage Mode Switcher Bar */}
      <div className="px-5 py-3.5 border-b border-[#DCE2E8] dark:border-[#2A3543] bg-[#F3F5F6] dark:bg-[#151C24] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setStageMode('video');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded cursor-pointer ${
              stageMode === 'video'
                ? 'bg-[#1D7A74] dark:bg-[#38B2A6] text-white dark:text-[#11171D] btn-3d-primary'
                : 'bg-white dark:bg-[#1C2530] text-[#5C6B77] dark:text-[#8FA0B0] border border-[#CFD8E0] dark:border-[#2E3A48] btn-3d-secondary'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>
              {locale === 'ja'
                ? '実機映像 / GIFプレビュー'
                : locale === 'zh'
                ? '实机视频 / GIF 演示'
                : 'Gameplay Video / GIF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setStageMode('playable');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded cursor-pointer ${
              stageMode === 'playable'
                ? 'bg-[#1D7A74] dark:bg-[#38B2A6] text-white dark:text-[#11171D] btn-3d-primary'
                : 'bg-white dark:bg-[#1C2530] text-[#5C6B77] dark:text-[#8FA0B0] border border-[#CFD8E0] dark:border-[#2E3A48] btn-3d-secondary'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>
              {locale === 'ja'
                ? 'ブラウザで今すぐ試遊 (Web試遊)'
                : locale === 'zh'
                ? '网页即点即玩 (立即试玩)'
                : 'Play Web Prototype Now'}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playBlip(540);
            setShowUrlConfig((v) => !v);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono rounded bg-white dark:bg-[#1C2530] border border-[#CFD8E0] dark:border-[#2E3A48] text-[#5C6B77] dark:text-[#8FA0B0] hover:text-[#1D7A74] dark:hover:text-[#38B2A6] btn-3d-secondary cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>
            {locale === 'ja'
              ? 'MP4 / GIF / WebGL URL設定'
              : locale === 'zh'
              ? '嵌入自定义 MP4 / GIF / 网页游戏链接'
              : 'Set MP4 / GIF / WebGL URL'}
          </span>
        </button>
      </div>

      {/* Optional Custom Video / GIF / WebGL URL Drawer */}
      {showUrlConfig && (
        <div className="px-5 py-3.5 bg-[#E8ECEF] dark:bg-[#151C24] border-b border-[#DCE2E8] dark:border-[#2A3543] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[#5C6B77] dark:text-[#8FA0B0]">MP4/GIF:</span>
            <input
              type="url"
              value={customMediaUrl}
              onChange={(e) => setCustomMediaUrl(e.target.value)}
              placeholder="https://example.com/gameplay.mp4 or .gif"
              className="flex-1 px-2.5 py-1.5 rounded bg-white dark:bg-[#1C2530] border border-[#CFD8E0] dark:border-[#2A3543] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[#5C6B77] dark:text-[#8FA0B0]">WebGL URL:</span>
            <input
              type="url"
              value={customIframeUrl}
              onChange={(e) => setCustomIframeUrl(e.target.value)}
              placeholder="https://your-id.github.io/webgl-game/"
              className="flex-1 px-2.5 py-1.5 rounded bg-white dark:bg-[#1C2530] border border-[#CFD8E0] dark:border-[#2A3543] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* STAGE BODY: VIDEO/GIF REEL OR INSTANT PLAYABLE WEB GAME */}
      {stageMode === 'video' ? (
        <div className="relative bg-[#151C24]">
          {customMediaUrl.trim() ? (
            isGifUrl ? (
              <img
                src={customMediaUrl}
                alt={project.title[locale]}
                className="w-full h-72 sm:h-96 object-contain bg-[#151C24]"
              />
            ) : (
              <video
                src={customMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-72 sm:h-96 object-contain bg-[#151C24]"
              />
            )
          ) : (
            <div className="relative h-72 sm:h-96 w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left 5 Cols: Key Visual Artwork Backdrop */}
              <div className="relative hidden lg:block lg:col-span-5 h-full overflow-hidden border-r border-[#2A3543]">
                <img
                  src={project.image}
                  alt={project.title[locale]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151C24]/90 via-[#151C24]/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-[#E6EDF3]">
                  <div className="text-[#38B2A6] mb-1">[KEY VISUAL / ARTWORK SLOT]</div>
                  <div>{project.title[locale]}</div>
                </div>
              </div>

              {/* Right 7 Cols: Live 60FPS Gameplay Loop / GIF-Style Motion Reel */}
              <div className="lg:col-span-7 relative h-full flex flex-col justify-between bg-[#151C24]">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={280}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#E6EDF3] bg-[#151C24]/80 backdrop-blur-sm px-3.5 py-2 rounded border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#1D7A74] text-white rounded shrink-0">
                      LIVE 60FPS DEMO SLOT
                    </span>
                    <span>
                      {locale === 'ja'
                        ? '[機能展示枠：実機映像 / GIF / 60FPS自動デモ再生エリア]'
                        : locale === 'zh'
                        ? '[功能展示位：实机视频 / GIF / 60FPS 动画演示区]'
                        : '[Functional Slot: Gameplay Video / GIF / 60FPS Reel Area]'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo((p) => !p)}
                    className="p-1 rounded hover:bg-white/15 cursor-pointer shrink-0"
                    title={isPlayingVideo ? 'Pause Reel' : 'Play Reel'}
                  >
                    {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PLAYABLE WEB GAME MODE */
        <div className="bg-[#151C24] text-[#E6EDF3]">
          {customIframeUrl.trim() ? (
            <div className="w-full h-[420px] bg-[#151C24]">
              <iframe
                src={customIframeUrl}
                title={project.title[locale]}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; gamepad"
              />
            </div>
          ) : (
            <div>
              {/* Top Posture & Combo Bar inside Playable Stage */}
              <div className="px-5 py-3 bg-[#1C2530] border-b border-[#2A3543] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                  <span className="text-[#38B2A6] shrink-0">[GAUGE SLOT]:</span>
                  <div className="flex-1 max-w-xs h-2.5 bg-[#11171D] border border-[#2E3A48] p-[1px]">
                    <div
                      className="h-full bg-gradient-to-r from-[#1D7A74] to-[#38B2A6] transition-all duration-150"
                      style={{ width: `${bossPosture}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-[#38B2A6]">{bossPosture}%</span>
                </div>

                <div className="flex items-center gap-4 tabular-nums">
                  <span>
                    FRAME: <strong className="text-[#38B2A6]">{String(bossFrame).padStart(3, '0')}F</strong>
                  </span>
                  <span>
                    COUNT: <strong className="text-emerald-400">{playerCombo}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={resetMiniGame}
                    className="inline-flex items-center gap-1 text-[#8FA0B0] hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>
              </div>

              {/* Interactive 60FPS Game Canvas */}
              <div className="relative h-64 sm:h-72 w-full">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={260}
                  onClick={triggerSlash}
                  className="w-full h-full object-cover cursor-crosshair"
                />
              </div>

              {/* Tactile 3D Arcade Controller Deck */}
              <div className="p-5 bg-[#1C2530] border-t border-[#2A3543] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#38B2A6]">
                  ▶ [INTERACTIVE STAGE LOG]: {lastFeedback} ({playerState.toUpperCase()})
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={triggerSlash}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium rounded bg-[#232F3D] text-[#E6EDF3] border border-[#38B2A6]/40 btn-3d-primary cursor-pointer"
                  >
                    <Sword className="w-3.5 h-3.5 text-[#38B2A6]" />
                    <span>[ACTION BTN 01 // J]</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerParry}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium rounded bg-[#1D7A74] text-white btn-3d-primary cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>[ACTION BTN 02 // SPACE]</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerDodge}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium rounded bg-[#232F3D] text-[#E6EDF3] border border-[#2E3A48] btn-3d-secondary cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-400" />
                    <span>[ACTION BTN 03 // L]</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
