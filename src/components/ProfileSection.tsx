import { useEffect, useId, useRef, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  MessageCircleQuestion,
  Gamepad2,
  Trophy,
  Clock,
  UserRound,
  Wrench,
} from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import {
  DESIGN_SKILLS,
  FAVORITE_GAMES,
  INTERESTS,
  INTRO_SECTIONS,
  formatHours,
  sortPlayRecords,
  type PlaylogSort,
  STRENGTHS,
  TOOL_GROUPS,
  WEAKNESSES,
  type Trait,
  PLATFORM_SYNCED_AT,
  PLAY_RECORDS,
  PROFILE_COPY,
  PROFILE_QA,
  PROFILE_TOPICS,
  TOOL_SKILLS,
  TROPHY_RANK_LABEL,
  recordsByPlatform,
  totalAchievements,
  trophyGradeTotals,
  totalPlayHours,
  type PlatformId,
  type PlatformInfo,
  type PlayRecord,
  type ProfileTopic,
  type TrophyRank,
} from '../content/profile';
import { soundFX } from '../utils/sound';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

const TOPIC_ICONS: Record<ProfileTopic, typeof Trophy> = {
  intro: UserRound,
  qa: MessageCircleQuestion,
  playlog: Gamepad2,
  skills: Wrench,
};

/** トロフィーの線の色（グレードごとに 1 色・フラット） */
const TROPHY_COLOR: Record<TrophyRank, string> = {
  platinum: '#4F86C6',
  gold: '#C48F12',
  silver: '#858C96',
  bronze: '#A9652F',
};

/** グレードが上がるほど線と特効が増える（ブロンズ 0 → プラチナ 3） */
const TROPHY_TIER: Record<TrophyRank, number> = { bronze: 0, silver: 1, gold: 2, platinum: 3 };

/** 中心 (12,12)、半径 r の六角形（表紙の紋章と同じ向き） */
const hexPoints = (r: number, cy = 12) =>
  [-90, -30, 30, 90, 150, 210]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return `${(12 + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');

/** 4 方向に尖ったきらめき（✦） */
const Star: FC<{ x: number; y: number; r: number; color: string; className?: string }> = ({ x, y, r, color, className }) => (
  <path
    d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`}
    fill={color}
    stroke="none"
    className={className}
  />
);

/**
 * グレード別のトロフィー（フラットな線画）。
 * 六角形を基にした角ばった杯。グレードごとにシルエットが変わり、
 * 上のグレードほど線の特効（光線・きらめき・回転する枠）が加わる。
 */
export const TrophyIcon: FC<{
  rank: TrophyRank;
  className?: string;
  label?: string;
  /** 特効（きらめき・光線など）を付けるか */
  effects?: boolean;
  /** 線の上を白い光の帯が流れる（0〜1 で明るさ。なしなら流れない） */
  sheen?: number;
  /** 光が流れ始めるまでの秒数（並んだトロフィーを順に光らせて、光の波にする） */
  sheenDelay?: number;
}> = ({ rank, className = 'w-4 h-4', label, effects = true, sheen, sheenDelay = 0 }) => {
  const color = TROPHY_COLOR[rank];
  const tier = TROPHY_TIER[rank];
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const shapeId = `tr-shape-${uid}`;
  const sheenId = `tr-sheen-${uid}`;
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 overflow-visible ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {sheen !== undefined && (
        <defs>
          {/* 細く明るい斜めの光。左上から右下へ線の上をすべり、少し間をおいてまた流れる */}
          <linearGradient id={sheenId} gradientUnits="userSpaceOnUse" x1="-7" y1="-7" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.42" stopColor="#fff" stopOpacity={sheen * 0.35} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={sheen} />
            <stop offset="0.58" stopColor="#fff" stopOpacity={sheen * 0.35} />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
            {!reduceMotion && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-4 -4; 30 30; 30 30"
                keyTimes="0; 0.45; 1"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0 0 1 1"
                dur="3.2s"
                begin={`${sheenDelay}s`}
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
        </defs>
      )}
      <g id={shapeId}>
      {tier === 0 && (
        /* ブロンズ：シンプルなゴブレット */
        <>
          <path d="M7 4 H17 L15.2 11.5 H8.8 Z" />
          <path d="M12 11.5 V16.5" />
          <path d="M8.6 16.5 H15.4 L16.2 20.4 H7.8 Z" />
          {effects && <Star x={17.8} y={3.4} r={2} color={color} className="trophy-glint" />}
        </>
      )}

      {tier === 1 && (
        /* シルバー：丸い杯と大きな取っ手のラビングカップ */
        <>
          <path d="M5.8 5 H18.2" />
          <path d="M6.5 5 V8 A5.5 5.5 0 0 0 17.5 8 V5" />
          <path d="M6.5 6.4 C2.9 6.4 3 11.2 7.7 11.3 M17.5 6.4 C21.1 6.4 21 11.2 16.3 11.3" strokeWidth="1.1" />
          <path d="M12 13.5 V16.4" />
          <path d="M9.2 16.4 H14.8 L15.4 18.2 H8.6 Z" strokeWidth="1.1" />
          <path d="M7.4 18.2 H16.6 V20.6 H7.4 Z" />
          {effects && <Star x={20.2} y={2.6} r={2.4} color={color} className="trophy-twinkle" />}
        </>
      )}

      {tier === 2 && (
        /* ゴールド：蓋と飾りの付いた壺に、左右の翼 */
        <>
          {effects && (
            <g strokeWidth="1" className="trophy-rays">
              <path d="M12 -0.2 V-2 M9.4 0.3 L8.4 -1.2 M14.6 0.3 L15.6 -1.2" />
            </g>
          )}
          <path d="M12 0.9 L12.8 1.8 L12 2.7 L11.2 1.8 Z" strokeWidth="0.9" />
          <path d="M8.6 6 Q12 2.9 15.4 6" />
          <path d="M7.2 6 H16.8" />
          <path d="M7.6 6.6 H16.4 L15.9 9.6 L13.6 12.6 H10.4 L8.1 9.6 Z" />
          <path d="M12 7.6 L13 9.2 L12 10.8 L11 9.2 Z" strokeWidth="0.8" />
          {/* 翼（左右対称） */}
          <path d="M8 7.4 C6.2 5.6 4.2 4.6 2.2 4.4 C2.6 5.6 3.3 6.4 4.1 6.9 C3.3 7.1 2.9 7.8 2.9 8.5 C3.9 8.7 4.8 8.7 5.4 8.4 C4.9 9 4.9 9.7 5.2 10.3 C6.2 10.1 7.3 9.7 8.3 9.2" strokeWidth="1" />
          <path d="M8 7.4 C6.2 5.6 4.2 4.6 2.2 4.4 C2.6 5.6 3.3 6.4 4.1 6.9 C3.3 7.1 2.9 7.8 2.9 8.5 C3.9 8.7 4.8 8.7 5.4 8.4 C4.9 9 4.9 9.7 5.2 10.3 C6.2 10.1 7.3 9.7 8.3 9.2" strokeWidth="1" transform="translate(24 0) scale(-1 1)" />
          <path d="M12 12.6 V15.6" />
          <path d="M9.4 15.6 H14.6 L15.3 17.5 H8.7 Z" strokeWidth="1.1" />
          <path d="M6.9 17.5 H17.1 V20.2 H6.9 Z" />
          <path d="M5.4 20.2 H18.6" strokeWidth="1" />
          {effects && (
            <>
              <Star x={20.6} y={2} r={2.5} color={color} className="trophy-twinkle" />
              <Star x={3.4} y={2.6} r={1.6} color={color} className="trophy-twinkle trophy-twinkle-late" />
            </>
          )}
        </>
      )}

      {tier >= 3 && (
        /* プラチナ：表紙の紋章を思わせる六角柱のクリスタル */
        <>
          {effects && (
            <>
              <polygon points={hexPoints(9.4, 11)} strokeWidth="0.8" className="trophy-ripple" />
              <polygon points={hexPoints(11.6, 11)} strokeWidth="0.6" strokeDasharray="0.9 1.6" className="trophy-spin" />
              <g className="trophy-orbit">
                <circle cx="12" cy="-0.6" r="0.75" fill={color} stroke="none" />
              </g>
            </>
          )}
          <path d="M12 2.4 L15.6 5.6 V12.4 L12 15.4 L8.4 12.4 V5.6 Z" />
          <path d="M12 2.4 V15.4 M8.4 5.6 L12 7.8 L15.6 5.6" strokeWidth="0.8" />
          <path d="M8.4 11.2 L6.6 13.2 V15.4 H17.4 V13.2 L15.6 11.2" strokeWidth="1.1" />
          <path d="M8 15.4 L7 18.2 H17 L16 15.4" strokeWidth="1.1" />
          <path d="M5.6 18.2 H18.4 V20.8 H5.6 Z" />
          <path d="M9.6 19.5 H14.4" strokeWidth="0.7" />
          {effects && (
            <>
              <Star x={20.8} y={2.2} r={2.6} color={color} className="trophy-twinkle" />
              <Star x={3} y={4.4} r={1.7} color={color} className="trophy-twinkle trophy-twinkle-late" />
            </>
          )}
        </>
      )}
      </g>
      {/* 同じ線をもう一度、光の帯の色で重ねる → 線の上だけを光が流れる */}
      {sheen !== undefined && <use href={`#${shapeId}`} stroke={`url(#${sheenId})`} />}
    </svg>
  );
};

const RANKS: TrophyRank[] = ['platinum', 'gold', 'silver', 'bronze'];

/** Steam の実績アイコンを 1 列に並べる数（実績バーの幅に合わせて等分する） */
const STEAM_ICON_SLOTS = 10;

/**
 * 枠の光り方。
 *   ring    … 縁の太さ
 *   flow    … 縁を光が一周する（すべて同じ速さ・時計回り）
 *   ai      … 枠全体がグラデーションで光ってめぐり、外側に光晕がにじむ（Apple Intelligence の縁の光のような表現）。
 *             rainbow（1 番レア）→ gold（2 番）→ silver（3 番）の順に光晕が小さくなる
 */
type GlowPreset = {
  color: string;
  ring: number;
  flow?: boolean;
  /** 縁を流れる光の本数 */
  streaks?: 1 | 2 | 4;
  /** 枠の金属の質感 */
  metal?: 'gold' | 'silver' | 'bronze';
  ai?: 'rainbow' | 'gold' | 'silver';
};

/** 流れる光の色 */
const FLOW_COLOR = { gold: '#FFC53D', silver: '#D3DAE4', bronze: '#C47A43' };

const GLOW = {
  // Steam：すべての実績アイコンの縁を光が流れる。
  //   1 番レア … 虹色 / 2 番 … 金 / 3 番 … 銀：枠全体がグラデーションで光り、光晕がにじむ（光晕は順に小さく）
  //   それ以外 … 銅の金属の枠に、白い光が 1 本流れる
  // 流れる光はすべて同じ速さ（3 秒で 1 周）・時計回り。速さは index.css の .gf-flow で決めている
  steam1: { color: FLOW_COLOR.gold, ring: 3, flow: true, ai: 'rainbow' },
  steam2: { color: FLOW_COLOR.gold, ring: 2, flow: true, ai: 'gold' },
  steam3: { color: FLOW_COLOR.silver, ring: 2, flow: true, ai: 'silver' },
  steamRest: { color: FLOW_COLOR.bronze, ring: 1, flow: true, streaks: 1, metal: 'bronze' },
} satisfies Record<string, GlowPreset>;

/** PS のトロフィーの線を流れる白い光の明るさ（上のグレードほど明るい。速さはすべて同じ） */
const PS_SHEEN: Record<TrophyRank, number> = { platinum: 1, gold: 0.9, silver: 0.7, bronze: 0.5 };
/** プラチナ→ゴールド→シルバー→ブロンズの順に少しずつ遅らせ、光が左から右へ波のように渡る */
const PS_SHEEN_DELAY: Record<TrophyRank, number> = { platinum: 0, gold: 0.18, silver: 0.36, bronze: 0.54 };

/** 包み枠（外枠・台紙・内枠）。glow を渡すと縁を光が流れ、ai なら枠全体がグラデーションで光る */
const GlowFrame: FC<{ glow?: GlowPreset; className?: string; children: ReactNode }> = ({
  glow,
  className = '',
  children,
}) => (
  <div
    className={`gf ${glow?.flow ? 'gf-flow' : ''} ${glow?.streaks ? `gf-streaks-${glow.streaks}` : ''} ${glow?.metal ? `gf-metal-${glow.metal}` : ''} ${glow?.ai ? `gf-ai gf-ai-${glow.ai}` : ''} ${className}`}
    style={
      glow
        ? ({
            padding: glow.ring,
            '--flow': glow.color,
          } as CSSProperties)
        : undefined
    }
  >
    <span className="gf-ring" aria-hidden />
    <div className="gf-mat">{children}</div>
  </div>
);

/** サイト内に保存したカバー画像はベース URL を付けて読み込む */
const coverSrc = (image: string) =>
  /^https?:\/\//.test(image) ? image : `${import.meta.env.BASE_URL}${image}`;

const isCompleted = (r: PlayRecord) =>
  !!r.achievements && r.achievements.total > 0 && r.achievements.unlocked >= r.achievements.total;

/* ------------------------------------------------------------------
 * 小さな部品
 * ------------------------------------------------------------------ */

const HoursBar: FC<{ hours: number; max: number }> = ({ hours, max }) => (
  <div className="w-full h-[3px] bg-[var(--c-rule)] dark:bg-[var(--c-rule)] overflow-hidden">
    <div
      className="h-full bg-[var(--c-accent)] dark:bg-[var(--c-accent)]"
      style={{ width: `${max > 0 ? Math.round((hours / max) * 100) : 0}%` }}
    />
  </div>
);

/** ゲーム 1 本ぶんの実績・トロフィー表示 */
const GameAchievements: FC<{ record: PlayRecord; platform: PlatformInfo; locale: Locale }> = ({
  record,
  platform,
  locale,
}) => {
  const t = PROFILE_COPY[locale];
  const a = record.achievements;
  const pct = a && a.total > 0 ? Math.round((a.unlocked / a.total) * 100) : 0;

  return (
    <div className="space-y-2.5">
      {a && (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
              <Trophy className="w-3.5 h-3.5" />
              {platform.achievementLabel[locale]}
              {isCompleted(record) && (
                <span className="ml-1 px-1.5 py-px text-[10px] bg-[var(--c-accent)] dark:bg-[var(--c-accent)] text-white">
                  {t.completed}
                </span>
              )}
            </span>
            <span className="tabular-nums">
              {a.unlocked} / {a.total} · {pct}%
            </span>
          </div>
          <HoursBar hours={a.unlocked} max={a.total} />
        </div>
      )}

      {/* Steam：解除した実績のアイコン（取得率の低い順） */}
      {record.achievementIcons && record.achievementIcons.length > 0 && (
        <ul className="grid grid-cols-10 gap-1.5">
          {record.achievementIcons.slice(0, STEAM_ICON_SLOTS).map((a, i) => (
            <li key={i} title={`${a.name} — ${a.rate}%`} className="aspect-square">
              {/* すべての縁を光が流れる。1 番レアは虹色で光り、2 番は金、3 番は銀、それ以外は銅 */}
              <GlowFrame className="h-full" glow={[GLOW.steam1, GLOW.steam2, GLOW.steam3][i] ?? GLOW.steamRest}>
                <img
                  src={coverSrc(a.icon)}
                  alt={a.name}
                  loading="lazy"
                  className="block w-full h-full object-cover outline outline-1 outline-[var(--c-ink)]/10 dark:outline-[var(--c-ink)]/10"
                />
              </GlowFrame>
            </li>
          ))}
        </ul>
      )}

      {/* PS：グレードごとに 4 等分して、実績バーと同じ幅にそろえる。枠はなし、取ったグレードは線の上を白い光が流れる */}
      {record.trophies && (
        <div className="grid grid-cols-4 gap-3">
          {RANKS.map((rank) => {
            const earned = record.trophies![rank];
            return (
              <div key={rank} className={`flex items-center gap-2.5 ${earned > 0 ? '' : 'opacity-45'}`}>
                <TrophyIcon
                  rank={rank}
                  className="w-8 h-8"
                  label={TROPHY_RANK_LABEL[rank][locale]}
                  sheen={earned > 0 ? PS_SHEEN[rank] : undefined}
                  sheenDelay={PS_SHEEN_DELAY[rank]}
                />
                <div className="min-w-0 leading-tight">
                  <div className="text-base font-mono tabular-nums">
                    <span className="font-semibold">{earned}</span>
                    {record.trophyTotals && (
                      <span className="text-sm text-[var(--c-ink-3)]"> / {record.trophyTotals[rank]}</span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--c-ink-3)] truncate">
                    {TROPHY_RANK_LABEL[rank][locale]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
 * トップページのカード（プレビュー）
 * ------------------------------------------------------------------ */

const CardPreview: FC<{ topic: ProfileTopic; locale: Locale }> = ({
  topic,
  locale,
}) => {
  const t = PROFILE_COPY[locale];

  if (topic === 'intro') {
    return (
      <p className="text-xs sm:text-sm text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed line-clamp-4">
        {INTRO_SECTIONS[0]?.body[locale]}
      </p>
    );
  }

  if (topic === 'qa') {
    const first = PROFILE_QA[0];
    return (
      <div className="text-xs sm:text-sm">
        <div className="font-medium">
          <span className="font-mono text-[var(--c-accent)] dark:text-[var(--c-accent)] mr-1.5">Q.</span>
          {first?.q[locale]}
        </div>
        <p className="mt-1 text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed line-clamp-2">
          {first?.a[locale]}
        </p>
        <div className="mt-2 text-[11px] font-mono text-[var(--c-ink-3)]">
          {PROFILE_QA.length} Q&A
        </div>
      </div>
    );
  }

  if (topic === 'playlog') {
    return (
      <div>
        {/* 合計プレイ時間 */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-editorial text-3xl font-semibold tabular-nums">{totalPlayHours()}</span>
          <span className="text-xs font-mono text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">{t.hoursUnit}</span>
        </div>

        {/* プラットフォームごとに同じ 2 行構成：1 行目は名前とタイトル数・時間、2 行目は実績 */}
        <div className="mt-3 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
          {recordsByPlatform().map(({ platform, records }) => (
            <div key={platform.id} className="py-2 space-y-1 text-[11px] font-mono tabular-nums">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-3 shrink-0" style={{ backgroundColor: platform.color }} />
                  {platform.label}
                </span>
                <span className="text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
                  {records.length} · {totalPlayHours(records)}
                  {t.hoursUnit}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pl-3 text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
                {platform.id === 'playstation' ? (
                  RANKS.map((rank) => (
                    <span key={rank} className="inline-flex items-center gap-0.5">
                      <TrophyIcon rank={rank} className="w-3.5 h-3.5" effects={false} />
                      {trophyGradeTotals(records)[rank]}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {totalAchievements(records)} {platform.achievementLabel[locale]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {TOOL_SKILLS.slice(0, 6).map((tool) => (
        <span
          key={tool}
          className="px-2 py-0.5 text-[11px] font-mono bg-[var(--c-bg)] dark:bg-[var(--c-bg)] border border-[var(--c-rule)] dark:border-[var(--c-rule)]"
        >
          {tool}
        </span>
      ))}
    </div>
  );
};

export const ProfileCards: FC<{
  locale: Locale;
  onOpenTopic: (topic: ProfileTopic) => void;
}> = ({ locale, onOpenTopic }) => {
  const t = PROFILE_COPY[locale];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {PROFILE_TOPICS.map((topic, idx) => {
        const card = t.cards[topic];
        const Icon = TOPIC_ICONS[topic];
        return (
          <motion.button
            key={topic}
            type="button"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: idx * 0.07, ease: EASE_OUT_EXPO }}
            onMouseEnter={() => soundFX.playBlip(580 + idx * 25)}
            onClick={() => onOpenTopic(topic)}
            className="group p-5 card-3d-console text-left flex flex-col gap-4 cursor-pointer"
          >
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                0{idx + 1} // {card.code}
              </span>
              <Icon className="w-4 h-4 text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0" />
            </div>
            <div className="w-full">
              <h3 className="font-editorial text-xl font-semibold tracking-tight group-hover:text-[var(--c-accent)] dark:group-hover:text-[var(--c-accent)] transition-colors">
                {card.title}
              </h3>
              <p className="mt-0.5 text-[11px] font-mono text-[var(--c-ink-3)]">{card.lead}</p>
            </div>
            <div className="w-full flex-1">
              <CardPreview topic={topic} locale={locale} />
            </div>
            <div className="w-full pt-3 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] flex items-center justify-between text-xs font-mono group-hover:text-[var(--c-accent)] dark:group-hover:text-[var(--c-accent)]">
              <span>{t.openCard}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------
 * 専用ページ
 * ------------------------------------------------------------------ */

const SectionLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="text-xs font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4">
    ── {children}
  </div>
);

const TraitList: FC<{ items: Trait[]; locale: Locale; accent: string }> = ({ items, locale, accent }) => (
  <div className="space-y-4">
    {items.map((it, i) => (
      <div key={i} className="pl-4 border-l-2" style={{ borderLeftColor: accent }}>
        <h4 className="font-editorial text-lg font-semibold tracking-tight">{it.title[locale]}</h4>
        <p className="mt-1 text-sm text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">{it.body[locale]}</p>
      </div>
    ))}
  </div>
);

const IntroPanel: FC<{ locale: Locale }> = ({ locale }) => {
  const t = PROFILE_COPY[locale];
  return (
    <div className="space-y-16">
      {/* 経歴・制作の進め方 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {INTRO_SECTIONS.map((sec, i) => (
          <section key={i}>
            <div className="text-xs font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-2">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="font-editorial text-2xl font-semibold tracking-tight">{sec.heading[locale]}</h3>
            <p className="mt-3 text-sm sm:text-base text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-[1.9]">
              {sec.body[locale]}
            </p>
          </section>
        ))}
      </div>

      {/* 趣味・好きなゲーム */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 pt-10 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]">
        <section className="lg:col-span-4">
          <SectionLabel>{t.interests}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((it, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm bg-white dark:bg-[var(--c-surface)] border border-[var(--c-rule)] dark:border-[var(--c-rule)]"
              >
                {it[locale]}
              </span>
            ))}
          </div>
        </section>
        <section className="lg:col-span-8">
          <SectionLabel>{t.favoriteGames}</SectionLabel>
          <ol className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-5 sm:grid-flow-col gap-x-8 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]">
            {FAVORITE_GAMES.map((title, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 py-2.5 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)]"
              >
                <span
                  className={`w-6 shrink-0 text-right font-mono text-sm tabular-nums ${
                    i < 3 ? 'text-[var(--c-accent)] dark:text-[var(--c-accent)] font-semibold' : 'text-[var(--c-ink-3)]'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium truncate">{title}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* 長所・短所 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]">
        <section>
          <SectionLabel>{t.strengths}</SectionLabel>
          <TraitList items={STRENGTHS} locale={locale} accent="var(--c-accent)" />
        </section>
        <section>
          <SectionLabel>{t.weaknesses}</SectionLabel>
          <TraitList items={WEAKNESSES} locale={locale} accent="var(--c-ink-3)" />
        </section>
      </div>
    </div>
  );
};

const QAPanel: FC<{ locale: Locale }> = ({ locale }) => (
  <div className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
    {PROFILE_QA.map((item, i) => (
      <div key={i} className="py-7 first:pt-0 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
        <div className="lg:col-span-5 flex items-baseline gap-3">
          <span className="font-mono text-sm text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0">
            Q{String(i + 1).padStart(2, '0')}.
          </span>
          <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
            {item.q[locale]}
          </h3>
        </div>
        <p className="lg:col-span-7 text-sm sm:text-base text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
          <span className="font-mono text-[var(--c-ink)] dark:text-[var(--c-ink)] mr-2">A.</span>
          {item.a[locale]}
        </p>
      </div>
    ))}
  </div>
);

const PlaylogPanel: FC<{ locale: Locale }> = ({ locale }) => {
  const t = PROFILE_COPY[locale];
  const groups = recordsByPlatform();
  const [active, setActive] = useState<PlatformId>(groups[0]?.platform.id ?? 'steam');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<PlaylogSort>('hours');
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const current = groups.find((g) => g.platform.id === active) ?? groups[0];

  if (!current) return null;
  const { platform, records, listed } = current;
  // 並び替えた上位 PLAYLOG_LIMIT 本だけを、PLAYLOG_PAGE_SIZE 本ずつ表示する
  const ranked = sortPlayRecords(listed, sort).slice(0, PLAYLOG_LIMIT);
  const pageCount = Math.max(1, Math.ceil(ranked.length / PLAYLOG_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PLAYLOG_PAGE_SIZE;
  const pageRecords = ranked.slice(pageStart, pageStart + PLAYLOG_PAGE_SIZE);

  const goToPage = (next: number) => {
    soundFX.playSelect();
    setPage(next);
    const el = listTopRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96 });
  };

  return (
    <div>
      {/* プラットフォームの切り替え */}
      <div role="tablist" className="flex flex-wrap gap-2 mb-8">
        {groups.map(({ platform: p }) => {
          const selected = p.id === platform.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                soundFX.playSelect();
                setActive(p.id);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2.5 h-11 px-5 text-sm font-mono border-2 transition-colors cursor-pointer ${
                selected
                  ? 'text-white'
                  : 'bg-transparent text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] border-[var(--c-rule)] dark:border-[var(--c-rule)] hover:border-current'
              }`}
              style={selected ? { backgroundColor: p.color, borderColor: p.color } : undefined}
            >
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={platform.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {PLATFORM_SYNCED_AT[platform.id] && (
            <div className="mb-4 text-[11px] font-mono text-[var(--c-ink-3)]">
              {t.syncedFrom} · {PLATFORM_SYNCED_AT[platform.id]}
            </div>
          )}

          {/* プラットフォームのまとめ */}
          <div
            className="grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-6 pb-6 mb-2 border-b-2"
            style={{ borderBottomColor: platform.color }}
          >
            {[
              { label: t.gamesCount, value: records.length },
              { label: t.hoursUnit, value: totalPlayHours(records) },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-editorial text-3xl sm:text-4xl font-semibold tabular-nums">{stat.value}</div>
                <div className="mt-1 text-xs font-mono text-[var(--c-ink-3)]">{stat.label}</div>
              </div>
            ))}

            {platform.id === 'playstation' ? (
              RANKS.map((rank) => (
                <div key={rank}>
                  <div className="flex items-center gap-2">
                    {/* 合計の行も、取ったグレードは線の上を光が流れる */}
                    <TrophyIcon
                      rank={rank}
                      className="w-7 h-7 sm:w-8 sm:h-8"
                      sheen={trophyGradeTotals(records)[rank] > 0 ? PS_SHEEN[rank] : undefined}
                      sheenDelay={PS_SHEEN_DELAY[rank]}
                    />
                    <span className="font-editorial text-3xl sm:text-4xl font-semibold tabular-nums">
                      {trophyGradeTotals(records)[rank]}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-[var(--c-ink-3)]">{TROPHY_RANK_LABEL[rank][locale]}</div>
                </div>
              ))
            ) : (
              <div>
                <div className="font-editorial text-3xl sm:text-4xl font-semibold tabular-nums">
                  {totalAchievements(records)}
                </div>
                <div className="mt-1 text-xs font-mono text-[var(--c-ink-3)]">{platform.achievementLabel[locale]}</div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-mono text-[var(--c-ink-3)]">
              {t.shownNote(ranked.length, records.length)}
            </p>

            {/* 並び替え */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[var(--c-ink-3)]">{t.sortLabel}</span>
              <div role="radiogroup" aria-label={t.sortLabel} className="inline-flex border border-[var(--c-rule)] dark:border-[var(--c-rule)]">
                {(['hours', 'trophies'] as PlaylogSort[]).map((key) => {
                  const selected = key === sort;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        if (selected) return;
                        soundFX.playSelect();
                        setSort(key);
                        setPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 h-8 px-3 cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[var(--c-ink)] dark:bg-[var(--c-ink)] text-[var(--c-bg)] dark:text-[var(--c-bg)]'
                          : 'text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] hover:text-[var(--c-ink)] dark:hover:text-[var(--c-ink)]'
                      }`}
                    >
                      {key === 'hours' ? <Clock className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                      {key === 'hours' ? t.sortHours : platform.achievementLabel[locale]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={listTopRef} className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
            {pageRecords.map((r, i) => (
              <article key={r.id} className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-5 min-w-0 flex gap-4">
                  {/* PS・Xbox のアイコンは正方形が多いので全体を表示、Steam は横長（460×215）のバナー */}
                  <div
                    /* 包み枠：外枠・余白（台紙）・内枠（実績アイコンと同じ） */
                    className={`shrink-0 self-start p-1 border border-[#C9C6BC] dark:border-[#3A342E] bg-white dark:bg-[var(--c-surface)] ${
                      platform.id !== 'steam' ? 'w-20 sm:w-24 aspect-square' : 'w-36 sm:w-48 aspect-[460/215]'
                    }`}
                  >
                    {r.image && (
                      <img
                        src={coverSrc(r.image)}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className={`block w-full h-full outline outline-1 outline-[var(--c-ink)]/10 dark:outline-[var(--c-ink)]/10 ${
                          platform.id !== 'steam' ? 'object-contain bg-[#131210]' : 'object-cover'
                        }`}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                  <div className="text-[11px] font-mono tabular-nums text-[var(--c-ink-3)]">#{pageStart + i + 1}</div>
                  <h4 className="font-editorial text-lg sm:text-xl font-semibold tracking-tight leading-snug">{r.title}</h4>
                  <div className="mt-1 text-xs font-mono text-[var(--c-ink-3)] tabular-nums">
                    {[r.device, r.hours !== undefined ? `${formatHours(r.hours)}${t.hoursUnit}` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {r.note && (
                    <p className="mt-2 text-sm text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
                      {r.note[locale]}
                    </p>
                  )}
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <GameAchievements record={r} platform={platform} locale={locale} />
                </div>
              </article>
            ))}
          </div>

          {pageCount > 1 && (
            <Pager page={safePage} pageCount={pageCount} total={ranked.length} start={pageStart} size={pageRecords.length} onChange={goToPage} />
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
};

/** 一覧に載せる本数と、1 ページの本数 */
const PLAYLOG_LIMIT = 30;
const PLAYLOG_PAGE_SIZE = 10;

/** 前へ・ページ番号・次へ */
const Pager: FC<{
  page: number;
  pageCount: number;
  total: number;
  start: number;
  size: number;
  onChange: (page: number) => void;
}> = ({ page, pageCount, total, start, size, onChange }) => {
  const btn =
    'inline-flex items-center justify-center min-w-9 h-9 px-2 text-xs font-mono tabular-nums border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default';
  return (
    <nav className="mt-8 pt-6 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] flex flex-wrap items-center justify-between gap-4">
      <span className="text-xs font-mono tabular-nums text-[var(--c-ink-3)]">
        {start + 1}–{start + size} / {total}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={`${btn} border-[var(--c-rule)] dark:border-[var(--c-rule)] hover:border-current`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onChange(n)}
            className={`${btn} ${
              n === page
                ? 'bg-[var(--c-ink)] dark:bg-[var(--c-ink)] text-[var(--c-bg)] dark:text-[var(--c-bg)] border-[var(--c-ink)] dark:border-[var(--c-ink)]'
                : 'border-[var(--c-rule)] dark:border-[var(--c-rule)] hover:border-current'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className={`${btn} border-[var(--c-rule)] dark:border-[var(--c-rule)] hover:border-current`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};

const SkillsPanel: FC<{ locale: Locale }> = ({ locale }) => {
  const t = PROFILE_COPY[locale];
  return (
    <div className="space-y-14">
      <div>
        <SectionLabel>{t.designSkills}</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DESIGN_SKILLS.map((s) => (
            <div key={s.code} className="p-6 card-3d-console">
              <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                [{s.code}]
              </div>
              <h3 className="mt-1 font-editorial text-xl font-semibold tracking-tight">{s.name[locale]}</h3>
              <p className="mt-3 text-sm text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">{s.desc[locale]}</p>
              <div className="mt-4 p-2.5 bg-[var(--c-bg)] dark:bg-[var(--c-bg)] border-l-2 border-l-[var(--c-accent)] dark:border-l-[var(--c-accent)] text-xs font-mono">
                {t.usedIn}: {s.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{t.toolSkills}</SectionLabel>
        <div className="rule-top divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
          {TOOL_GROUPS.map((group) => (
            <div key={group.code} className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8">
              <div className="md:col-span-3">
                <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                  {group.code}
                </div>
                <div className="mt-0.5 font-medium">{group.name[locale]}</div>
              </div>
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="min-w-0">
                    <div className="font-mono text-sm">{item.name}</div>
                    {item.note && (
                      <div className="text-xs text-[var(--c-ink-3)] mt-0.5">{item.note[locale]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PANELS: Record<ProfileTopic, FC<{ locale: Locale }>> = {
  intro: IntroPanel,
  qa: QAPanel,
  playlog: PlaylogPanel,
  skills: SkillsPanel,
};

export const ProfileDetailPage: FC<{
  locale: Locale;
  initialTopic: ProfileTopic;
  onBackToMain: () => void;
}> = ({ locale, initialTopic, onBackToMain }) => {
  const t = PROFILE_COPY[locale];
  const [topic, setTopic] = useState<ProfileTopic>(initialTopic);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  const Panel = PANELS[topic];

  return (
    <SubPageFrame
      backLabel={t.back}
      onBack={onBackToMain}
      tag="CHAPTER 01 // PROFILE"
      title={t.detailHeading}
    >
      <div role="tablist" className="flex flex-wrap items-center gap-3 mb-10">
        {PROFILE_TOPICS.map((key) => {
          const Icon = TOPIC_ICONS[key];
          const active = key === topic;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                soundFX.playSelect();
                setTopic(key);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider cursor-pointer ${
                active ? 'btn-3d-primary' : 'btn-3d-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.cards[key].title}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-10 rule-top">
        <AnimatePresence mode="wait">
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <Panel locale={locale} />
          </motion.div>
        </AnimatePresence>
      </div>
    </SubPageFrame>
  );
};

/* ------------------------------------------------------------------
 * 専用ページ共通の枠（戻るボタン＋見出し）
 * ------------------------------------------------------------------ */

export const SubPageFrame: FC<{
  backLabel: string;
  onBack: () => void;
  tag: string;
  title: string;
  lead?: string;
  backdrop?: ReactNode;
  children: ReactNode;
}> = ({ backLabel, onBack, tag, title, lead, backdrop, children }) => (
  <div className="relative isolate min-h-screen py-16 sm:py-24">
    {backdrop}
    <div className="max-w-6xl mx-auto px-6 sm:px-12">
      <div className="flex items-center justify-between gap-4 pb-6 mb-12 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)]">
        <button
          type="button"
          onClick={() => {
            soundFX.playPageTurn();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--c-accent)] dark:text-[var(--c-accent)]" />
          <span>{backLabel}</span>
        </button>
      </div>

      <div className="mb-10">
        <div className="text-xs font-mono tracking-[0.22em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-3 editorial-callout-line">
          {tag}
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight">{title}</h1>
        {lead && (
          <p className="mt-5 max-w-3xl text-sm sm:text-base text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
            {lead}
          </p>
        )}
      </div>

      {children}
    </div>
  </div>
);
