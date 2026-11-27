/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Play,
  FileText,
} from 'lucide-react';
import type { Locale } from './content/interface-copy';
import { PROJECTS_DATA, WORK_DESIGN_NOTES, type ProjectSpec } from './content/works';
import { EDITORIAL_COPY } from './content/site-copy';
import type { ProfileTopic } from './content/profile';
import {
  soundFX,
  SoundEngineSnapshot,
} from './utils/sound';
import { WorkDetailSubPage } from './components/WorkDetailSubPage';
import { ProfileCards, ProfileDetailPage } from './components/ProfileSection';
import { GameAnalysisSection, GameAnalysisPage } from './components/GameAnalysis';
import { EndingCreditsSection } from './components/PortfolioSections';
import { StudioMark } from './components/StudioMark';
import { CoverBackdrop } from './components/CoverBackdrop';
import { SettingsMenu } from './components/SettingsMenu';

type ActivePageView = 'main' | 'spec-detail' | 'profile-detail' | 'analysis-detail';

const GITHUB_USERNAME = 'Sora-My-One-And-Only';

// Signature 3A / Editorial Expo-Quintic Easing Curve: snappy launch + long, silky deceleration tail
const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];
const EASE_IN_OUT_QUINT: [number, number, number, number] = [0.83, 0, 0.17, 1];

/**
 * Custom rAF Smooth Scroll Engine with C∞-Continuous Editorial Quintic Curve
 * - Zero piecewise jumps (100% continuous position, velocity, and acceleration)
 * - Adaptive duration scaled by scroll distance (640ms–1080ms)
 * - Instant user wheel/touch interruption so it never fights manual trackpad scrolling
 */
let activeScrollAnimId: number | null = null;
let activeSpringScrollControl: { stop: () => void } | null = null;
let removeScrollInterruptListeners: (() => void) | null = null;

function cancelActiveSmoothScroll() {
  if (activeScrollAnimId !== null) {
    cancelAnimationFrame(activeScrollAnimId);
    activeScrollAnimId = null;
  }
  if (activeSpringScrollControl !== null) {
    activeSpringScrollControl.stop();
    activeSpringScrollControl = null;
  }
  if (removeScrollInterruptListeners) {
    removeScrollInterruptListeners();
    removeScrollInterruptListeners = null;
  }
}

/**
 * Spring-Physics Scroll to Target Y (used by Floating Back-to-Top Button)
 * Uses a critically damped physical spring with instant manual wheel/touch interruption
 */
function animateSpringScrollTo(targetY = 0) {
  if (typeof window === 'undefined') return;
  cancelActiveSmoothScroll();

  const startY = window.scrollY;
  if (Math.abs(startY - targetY) < 2) return;

  const onUserInterrupt = () => {
    cancelActiveSmoothScroll();
  };
  window.addEventListener('wheel', onUserInterrupt, { passive: true, once: true });
  window.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true });
  removeScrollInterruptListeners = () => {
    window.removeEventListener('wheel', onUserInterrupt);
    window.removeEventListener('touchstart', onUserInterrupt);
  };

  activeSpringScrollControl = animate(startY, targetY, {
    type: 'spring',
    stiffness: 78,
    damping: 21,
    mass: 0.62,
    restDelta: 0.5,
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
    onComplete: () => {
      window.scrollTo(0, targetY);
      cancelActiveSmoothScroll();
    },
  });
}

/**
 * Continuous asymmetric editorial curve:
 * Gentle ease-in over the first ~16% of time followed by a long, silky quintic deceleration tail.
 * Mathematically C∞ continuous across [0, 1] with f(0)=0, f(1)=1, f'(0)=0, f'(1)=0.
 */
function easeEditorialQuintInOut(t: number): number {
  // Smoothstep acceleration blended seamlessly with a quintic ease-out tail:
  // At t=0: value=0, slope=0. Peak velocity around t=0.22, long cushioned landing to t=1.
  const inv = 1 - t;
  const quintOut = 1 - inv * inv * inv * inv * inv;
  const softStart = t < 0.2 ? (t / 0.2) * (t / 0.2) * (3 - 2 * (t / 0.2)) : 1;
  return quintOut * softStart;
}

function animateScrollTo(targetY: number, customDuration?: number) {
  if (typeof window === 'undefined') return;
  cancelActiveSmoothScroll();

  const startY = window.scrollY;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const clampedTarget = Math.max(0, Math.min(targetY, maxScroll));
  const delta = clampedTarget - startY;
  if (Math.abs(delta) < 2) return;

  // Scale duration smoothly with distance so short hops feel snappy and multi-screen glides feel cinematic
  const viewportHeight = Math.max(600, window.innerHeight);
  const distanceScreens = Math.abs(delta) / viewportHeight;
  const duration =
    customDuration ??
    Math.round(Math.min(1080, Math.max(620, 560 + Math.sqrt(distanceScreens) * 240)));

  const startTime = performance.now();

  const onUserInterrupt = () => {
    cancelActiveSmoothScroll();
  };
  window.addEventListener('wheel', onUserInterrupt, { passive: true, once: true });
  window.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true });
  removeScrollInterruptListeners = () => {
    window.removeEventListener('wheel', onUserInterrupt);
    window.removeEventListener('touchstart', onUserInterrupt);
  };

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeEditorialQuintInOut(progress);

    window.scrollTo(0, startY + delta * eased);

    if (progress < 1) {
      activeScrollAnimId = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, clampedTarget);
      cancelActiveSmoothScroll();
    }
  };

  activeScrollAnimId = requestAnimationFrame(step);
}

/**
 * Annotated Editorial Work Plate with True Multi-Plane Scroll Parallax & Kinetic Reveal
 */
interface EditorialWorkSpreadProps {
  project: ProjectSpec;
  idx: number;
  locale: Locale;
  platePrefix: string;
  annotationHeader: string;
  roleLabel: string;
  openSpecLabel: string;
  playNowLabel: string;
  onOpenSpec: (proj: ProjectSpec, play?: boolean) => void;
}

const EditorialWorkSpread: React.FC<EditorialWorkSpreadProps> = ({
  project,
  idx,
  locale,
  platePrefix,
  annotationHeader,
  roleLabel,
  openSpecLabel,
  playNowLabel,
  onOpenSpec,
}) => {
  const spreadRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: spreadRef,
    offset: ['start end', 'end start'],
  });

  const smoothSpread = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 22,
    mass: 0.5,
  });

  // Multi-plane parallax: inner artwork glides counter to scroll while annotation column floats with depth
  const imageParallaxY = useTransform(smoothSpread, [0, 1], ['-7%', '7%']);
  const imageParallaxScale = useTransform(smoothSpread, [0, 0.5, 1], [1.1, 1.03, 1.1]);
  const noteColumnY = useTransform(smoothSpread, [0, 1], [34, -34]);

  const isEven = idx % 2 === 1;
  const designNote = WORK_DESIGN_NOTES[project.id];
  const plateNumber = `0${idx + 1}`;

  return (
    <motion.article
      ref={spreadRef}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
    >
      {/* Large Visual Plate Column (7 Columns) */}
      <div
        className={`lg:col-span-7 ${
          isEven ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        {/* Top Plate Index Caption */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.18em] text-[var(--c-ink-3)] mb-2.5">
          <span>
            FIG. {plateNumber} — {project.code}
          </span>
          <span>{project.engineTag}</span>
        </div>

        {/* Large Artbook Visual Plate with Inner Parallax */}
        <div
          onClick={() => onOpenSpec(project)}
          className="relative aspect-[16/10] w-full bg-[var(--c-ink)] overflow-hidden border border-[var(--c-rule)] dark:border-[var(--c-rule)] cursor-pointer"
        >
          <motion.img
            src={project.image}
            alt={project.title[locale]}
            referrerPolicy="no-referrer"
            style={{ y: imageParallaxY, scale: imageParallaxScale }}
            className="w-full h-full object-cover will-change-transform transition-filter duration-500 group-hover:brightness-105"
          />
          {/* Subtle Plate Number Stamp */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#181A1C]/80 backdrop-blur-sm text-[10px] font-mono tracking-[0.2em] text-[#F7F6F2]">
            {platePrefix} #{plateNumber}
          </div>
        </div>

        {/* Under-Plate Technical Callout Caption (图片下方图文注释) */}
        <div className="mt-3 pt-2.5 min-h-[2.25rem] border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
          <span>
            ───● {project.keyMechanics[locale][0]}
          </span>
          <span className="text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0">
            [{project.roleTag[locale]}]
          </span>
        </div>
      </div>

      {/* Annotated Margin Commentary Column (5 Columns) with Parallax Depth & Locked Cross-Locale Geometry */}
      <motion.div
        style={{ y: noteColumnY }}
        className={`lg:col-span-5 flex flex-col justify-between will-change-transform ${
          isEven ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        <div>
          <div className="text-xs font-mono tracking-[0.22em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-3">
            {annotationHeader} #{plateNumber}
          </div>

          <h3
            onClick={() => onOpenSpec(project)}
            className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.24] group-hover:text-[var(--c-accent)] dark:group-hover:text-[var(--c-accent)] transition-colors cursor-pointer"
          >
            {project.title[locale]}
          </h3>

          <p className="mt-4 text-sm sm:text-base text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
            {project.summary[locale]}
          </p>

          {/* 担当 */}
          <div className="mt-4 pl-3 border-l-2 border-l-[var(--c-accent)] dark:border-l-[var(--c-accent)]">
            <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)]">
              {roleLabel}
            </div>
            <p className="mt-0.5 text-sm leading-relaxed">{project.role[locale]}</p>
          </div>

          {/* Marginalia Spec Callout List (设定集参数注释条) */}
          <div className="mt-6 pt-5 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] space-y-2">
            {project.metrics.slice(0, 3).map((m, mIdx) => (
              <div
                key={mIdx}
                className="min-h-[1.5rem] flex items-center justify-between gap-4 text-xs font-mono"
              >
                <span className="text-[var(--c-ink-3)]">
                  0{mIdx + 1}. {m.label[locale]}
                </span>
                <span className="font-medium text-[var(--c-ink)] dark:text-[var(--c-ink)] tabular-nums shrink-0">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* DEV LOG (課題 → 解決 → 結果) */}
          {designNote && (
            <div className="mt-5 p-4 bg-[var(--c-inset)]/85 dark:bg-[var(--c-surface)]/90 border border-[var(--c-rule)] dark:border-[var(--c-rule)] space-y-2 text-xs">
              <div className="text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
                {designNote.challenge[locale]}
              </div>
              <div className="text-[var(--c-ink)] dark:text-[var(--c-ink)] leading-relaxed">
                {designNote.solution[locale]}
              </div>
              <div className="font-mono text-[11px] text-[var(--c-accent)] dark:text-[var(--c-accent)] pt-1">
                ★ {designNote.result[locale]}
              </div>
            </div>
          )}
        </div>

        {/* Editorial Action Links (Fixed Button Dimensions Across Locales) */}
        <div className="mt-7 pt-6 rule-top flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenSpec(project)}
            className="inline-flex items-center justify-center gap-2 h-10 min-w-[188px] px-4 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>{openSpecLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          {project.playUrl && (
            <button
              type="button"
              onClick={() => onOpenSpec(project, true)}
              className="inline-flex items-center justify-center gap-2 h-10 min-w-[156px] px-4 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0" />
              <span>{playNowLabel}</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('ja');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [soundState, setSoundState] = useState<SoundEngineSnapshot>(() =>
    soundFX.getSnapshot()
  );

  // Separate Visual Feedback State for BGM Toggle vs Paper Foley SFX Toggle
  const [bgmPulseKey, setBgmPulseKey] = useState<number>(0);
  const [showBgmToast, setShowBgmToast] = useState<boolean>(false);
  const bgmToastTimerRef = useRef<number | null>(null);

  const [sfxPulseKey, setSfxPulseKey] = useState<number>(0);
  const [showSfxToast, setShowSfxToast] = useState<boolean>(false);
  const sfxToastTimerRef = useRef<number | null>(null);

  const [activeView, setActiveView] = useState<ActivePageView>('main');
  const [selectedProject, setSelectedProject] = useState<ProjectSpec>(PROJECTS_DATA[0]);
  const [startPlaying, setStartPlaying] = useState<boolean>(false);
  const [profileTopic, setProfileTopic] = useState<ProfileTopic>('intro');
  const [analysisFocusId, setAnalysisFocusId] = useState<string | undefined>(undefined);


  useEffect(() => {
    return soundFX.subscribe((snap) => {
      setSoundState(snap);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (bgmToastTimerRef.current !== null) {
        window.clearTimeout(bgmToastTimerRef.current);
      }
      if (sfxToastTimerRef.current !== null) {
        window.clearTimeout(sfxToastTimerRef.current);
      }
    };
  }, []);

  const toggleBgm = () => {
    const next = !soundState.bgmEnabled;
    soundFX.setBgmEnabled(next);
    soundFX.playSelect();
    setBgmPulseKey((prev) => prev + 1);
    setShowBgmToast(true);
    setShowSfxToast(false);
    if (bgmToastTimerRef.current !== null) {
      window.clearTimeout(bgmToastTimerRef.current);
    }
    bgmToastTimerRef.current = window.setTimeout(() => {
      setShowBgmToast(false);
    }, 2200);
  };

  const toggleSfx = () => {
    const next = !soundState.sfxEnabled;
    soundFX.setSfxEnabled(next);
    setSfxPulseKey((prev) => prev + 1);
    setShowSfxToast(true);
    setShowBgmToast(false);
    if (sfxToastTimerRef.current !== null) {
      window.clearTimeout(sfxToastTimerRef.current);
    }
    sfxToastTimerRef.current = window.setTimeout(() => {
      setShowSfxToast(false);
    }, 1900);
    if (next) {
      soundFX.playPageTurn();
    }
  };

  const handleToggleTheme = () => {
    const nextDark = !darkMode;
    soundFX.playThemeSwitch(nextDark);
    // 色の移り変わりは index.css に任せる（@property で登録した配色の変数を html で補間するので、
    // ページのすべての要素・疑似要素・グラデーション・設定ウィンドウ・表紙のキャンバスが同じ速さで変わる）
    document.documentElement.classList.toggle('dark', nextDark);
    setDarkMode(nextDark);
  };

  // Physics-interpolated scroll MotionValues for ultra-smooth 60FPS Page 1 -> Page 2 transition
  const { scrollY, scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 72,
    damping: 20,
    mass: 0.55,
    restDelta: 0.1,
  });

  const [vh, setVh] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.max(1, window.innerHeight) : 900
  );
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [showTopChrome, setShowTopChrome] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [activeNavSection, setActiveNavSection] = useState<string>('');
  const prevEnteredMenuRef = useRef<boolean>(false);
  const prevPastSecondScreenRef = useRef<boolean>(false);
  const pendingScrollIdRef = useRef<string | null>(null);

  useEffect(() => {
    const onResize = () => setVh(Math.max(1, window.innerHeight));
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const nextPct = Math.round(clamped * 100);
    setScrollPct((prev) => (prev === nextPct ? prev : nextPct));
  });

  useMotionValueEvent(scrollY, 'change', (latestY) => {
    const enteredMenu = latestY > vh * 0.48;
    if (enteredMenu !== prevEnteredMenuRef.current) {
      prevEnteredMenuRef.current = enteredMenu;
      setShowTopChrome(enteredMenu);
    }

    // Show floating 'Back to Top' button once the user scrolls past the cover
    const pastSecondScreen = latestY > vh * 0.9;

    if (pastSecondScreen !== prevPastSecondScreenRef.current) {
      prevPastSecondScreenRef.current = pastSecondScreen;
      setShowBackToTop(pastSecondScreen);
    }

    // Update active top nav chapter highlight smoothly during scroll
    if (activeView === 'main') {
      const sectionIds = ['analysis', 'works', 'about'];
      const probeY = latestY + vh * 0.32;
      for (const secId of sectionIds) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.offsetTop;
          if (probeY >= top) {
            setActiveNavSection((prev) => (prev === secId ? prev : secId));
            break;
          }
        }
      }
    }
  });

  // Spring-driven Page 1 (Cover) -> Page 2 (Contents) MotionValues (Continuous & Flash-Free)
  const coverBgY = useTransform(smoothScrollY, [0, vh], ['0%', '18%']);
  const coverBgScale = useTransform(smoothScrollY, [0, vh], [1, 1.1]);
  const coverLogoY = useTransform(smoothScrollY, [0, vh * 0.85], [0, -110]);
  const coverLogoScale = useTransform(smoothScrollY, [0, vh * 0.85], [1, 0.92]);
  const coverLogoOpacity = useTransform(smoothScrollY, [0, vh * 0.7], [1, 0]);
  const coverLaserScaleX = useTransform(smoothScrollY, [0, vh * 0.7], [0.25, 1]);
  const coverCueOpacity = useTransform(smoothScrollY, [0, vh * 0.35], [0.75, 0]);

  const isHeaderVisible = activeView !== 'main' || showTopChrome;

  const TOTAL_BLOCKS = 36;
  const filledBlocks = Math.round((scrollPct / 100) * TOTAL_BLOCKS);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const c = EDITORIAL_COPY[locale];

  const executeSectionScroll = useCallback((id: string) => {
    if (id === 'top') {
      animateScrollTo(0);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      // Account for sticky top header chrome height (56px) on chapter sections
      const headerOffset = 56;
      const targetTop = Math.max(0, rect.top + window.scrollY - headerOffset);
      animateScrollTo(targetTop);
    }
  }, []);

  // When returning from a subpage ('spec-detail' / 'resume-detail') to 'main', wait via rAF until target section is mounted
  useEffect(() => {
    if (activeView !== 'main' || !pendingScrollIdRef.current) return;
    const targetId = pendingScrollIdRef.current;
    const deadline = performance.now() + 3000;
    let timerId: number;

    // ページが切り替わった直後なので、アニメーションせずに目的の章へ移動する
    const tryScrollWhenMounted = () => {
      if (targetId === 'top') {
        pendingScrollIdRef.current = null;
        window.scrollTo(0, 0);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        pendingScrollIdRef.current = null;
        cancelActiveSmoothScroll();
        window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 56));
      } else if (performance.now() < deadline) {
        timerId = window.setTimeout(tryScrollWhenMounted, 30);
      } else {
        pendingScrollIdRef.current = null;
      }
    };

    timerId = window.setTimeout(tryScrollWhenMounted, 0);
    return () => window.clearTimeout(timerId);
  }, [activeView]);

  const scrollToSection = useCallback(
    (id: string) => {
      soundFX.playSelect();
      setActiveNavSection(id);

      if (activeView !== 'main') {
        pendingScrollIdRef.current = id;
        setActiveView('main');
      } else {
        executeSectionScroll(id);
      }
    },
    [activeView, executeSectionScroll]
  );

  const openSpecPage = (proj: ProjectSpec, play = false) => {
    soundFX.playPageTurn();
    setSelectedProject(proj);
    setStartPlaying(play);
    setActiveView('spec-detail');
  };

  const openProfilePage = (topic: ProfileTopic) => {
    soundFX.playPageTurn();
    setProfileTopic(topic);
    setActiveView('profile-detail');
  };

  const openAnalysisPage = (analysisId?: string) => {
    soundFX.playPageTurn();
    setAnalysisFocusId(analysisId);
    setActiveView('analysis-detail');
  };

  // 専用ページから戻ったら、開いた章の位置に戻す
  const backToMainAt = (sectionId: string) => {
    pendingScrollIdRef.current = sectionId;
    setActiveView('main');
  };

  const handleGaugeSeek = (blockIndex: number) => {
    soundFX.playBlip(520 + blockIndex * 8);
    const ratio = blockIndex / (TOTAL_BLOCKS - 1);
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      animateScrollTo(ratio * maxScroll, 880);
    }
  };

  return (
    <div className="min-h-screen theme-surface font-normal relative">
      {/* 画面全体の地の色（配色の変数に合わせて、ほかの要素と同じ速さで色が移る） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-console-canvas"
      />

      {/* Top Editorial Folio Chrome — Hidden on Page 1, Revealed with Spring Physics on Page 2 */}
      <motion.div
        initial={false}
        animate={{
          y: isHeaderVisible ? '0%' : '-110%',
          opacity: isHeaderVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 24,
          mass: 0.65,
        }}
        className={`fixed top-0 left-0 right-0 z-50 will-change-transform ${
          isHeaderVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Top Segmented Reading Progress Folio Bar */}
        <div
          role="progressbar"
          aria-valuenow={scrollPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Archive Reading Progress"
          className="h-2.5 bg-[var(--c-inset)]/95 dark:bg-[var(--c-inset)]/95 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)] px-4 flex items-center gap-3 select-none"
        >
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-[0.2em] text-[var(--c-ink-3)] shrink-0">
            {scrollPct >= 99 ? 'END OF VOLUME' : 'ARCHIVE FOLIO'}
          </span>

          <div className="flex-1 h-1 flex items-center gap-[2px]">
            {Array.from({ length: TOTAL_BLOCKS }).map((_, idx) => {
              const isFilled = idx < filledBlocks;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleGaugeSeek(idx)}
                  title={`Page ${Math.round((idx / (TOTAL_BLOCKS - 1)) * 100)}%`}
                  className={`flex-1 h-full transition-colors duration-75 cursor-pointer ${
                    isFilled
                      ? 'bg-[var(--c-accent)] dark:bg-[var(--c-accent)]'
                      : 'bg-[#D8D5CC] dark:bg-[var(--c-rule)] hover:bg-[var(--c-accent)]/50'
                  }`}
                />
              );
            })}
          </div>

          <span className="text-[9px] font-mono tabular-nums tracking-wider text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] shrink-0">
            P.{String(scrollPct).padStart(3, '0')}
          </span>
        </div>

        {/* Editorial Running Header — Full-Width 3-Zone Layout: [Left Logo | Center Navigation | Right Controls] */}
        <header className="border-b border-[var(--c-rule)] dark:border-[var(--c-rule)] bg-[var(--c-bg)]/94 dark:bg-[var(--c-bg)]/94 backdrop-blur-md">
          <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* LEFT ZONE: Main Title & Editorial Brand Logo */}
            <div className="justify-self-start flex items-center">
              <button
                type="button"
                onClick={() => {
                  soundFX.playBlip(520);
                  if (activeView !== 'main') {
                    pendingScrollIdRef.current = 'top';
                    setActiveView('main');
                  } else {
                    animateScrollTo(0);
                  }
                }}
                className="inline-flex items-center gap-3 text-left cursor-pointer group whitespace-nowrap"
              >
                <StudioMark
                  className="w-12 h-12 shrink-0 text-[var(--c-ink)] dark:text-[var(--c-ink)] transition-transform duration-300 group-hover:rotate-[-6deg]"
                />
                <span className="font-logo text-xl sm:text-[22px] font-semibold tracking-[0.04em] leading-none text-[var(--c-ink)] dark:text-[var(--c-ink)]">
                  Sora
                </span>
              </button>
            </div>

            {/* CENTER ZONE: Expanded Chapter Jump Links (No Truncation, Stable Slot Widths Across JA/ZH/EN) */}
            <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-6 justify-self-center text-xs font-mono tracking-wider text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
              {[
                { id: 'about', label: c.nav.about, num: '01' },
                { id: 'works', label: c.nav.works, num: '02' },
                { id: 'analysis', label: c.nav.analysis, num: '03' },
              ].map((item) => {
                const isCurrent = activeView === 'main' && activeNavSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative h-10 min-w-[82px] xl:min-w-[94px] px-1.5 inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'text-[var(--c-ink)] dark:text-[var(--c-ink)] font-medium'
                        : 'hover:text-[var(--c-ink)] dark:hover:text-[var(--c-ink)]'
                    }`}
                  >
                    <span
                      className={`text-[10px] text-[var(--c-accent)] dark:text-[var(--c-accent)] transition-opacity shrink-0 ${
                        isCurrent ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'
                      }`}
                    >
                      {item.num}.
                    </span>
                    <span>{item.label}</span>

                    {isCurrent && (
                      <motion.span
                        layoutId="top-nav-active-underline"
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 30,
                          mass: 0.6,
                        }}
                        className="absolute left-2 right-2 bottom-1 h-[1.5px] bg-[var(--c-accent)] dark:bg-[var(--c-accent)]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 右側：言語・昼夜の切り替えと「設定」（サウンドと配色テーマ） */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Fixed-Cell Language Switcher */}
              <div className="grid grid-cols-3 h-8 border border-[var(--c-rule)] dark:border-[var(--c-rule)] bg-white/60 dark:bg-[var(--c-surface)]">
                {(['ja', 'zh', 'en'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      soundFX.playBlip(600);
                      setLocale(loc);
                    }}
                    className={`w-7 sm:w-8 h-full flex items-center justify-center text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      locale === loc
                        ? 'bg-[var(--c-ink)] dark:bg-[var(--c-ink)] text-[var(--c-bg)] dark:text-[var(--c-bg)] font-medium'
                        : 'text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] hover:text-[var(--c-ink)] dark:hover:text-[var(--c-ink)]'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {/* 3. Smooth Top-to-Bottom Theme Switcher */}
              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label="Toggle Light/Dark Theme"
                title="Switch Day Print / Night Archive Edition"
                className="w-8 h-8 flex items-center justify-center border border-[var(--c-rule)] dark:border-[var(--c-rule)] hover:border-[var(--c-ink)] dark:hover:border-[var(--c-ink)] text-[var(--c-ink)] dark:text-[var(--c-ink)] transition-colors cursor-pointer overflow-hidden shrink-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? 'dark-icon' : 'light-icon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-[var(--c-accent)]" /> : <Moon className="w-3.5 h-3.5" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              <SettingsMenu
                locale={locale}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
                bgmEnabled={soundState.bgmEnabled}
                sfxEnabled={soundState.sfxEnabled}
                onToggleBgm={toggleBgm}
                onToggleSfx={toggleSfx}
              />
            </div>
          </div>
        </header>
      </motion.div>

      {/* Main View vs Sub-Page Router with Smooth Flash-Free Transitions */}
      <AnimatePresence mode="wait">
        {activeView === 'spec-detail' && (
          <motion.div
            key="spec-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="relative z-10 pt-16 will-change-transform"
          >
            <WorkDetailSubPage
              project={selectedProject}
              locale={locale}
              githubUsername={GITHUB_USERNAME}
              startPlaying={startPlaying}
              onBackToMain={() => backToMainAt('works')}
              onSelectProject={(proj) => openSpecPage(proj)}
            />
          </motion.div>
        )}

        {activeView === 'profile-detail' && (
          <motion.div
            key="profile-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="relative z-10 pt-16 will-change-transform"
          >
            <ProfileDetailPage
              locale={locale}
              initialTopic={profileTopic}
              onBackToMain={() => backToMainAt('about')}
            />
          </motion.div>
        )}

        {activeView === 'analysis-detail' && (
          <motion.div
            key="analysis-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="relative z-10 pt-16 will-change-transform"
          >
            <GameAnalysisPage
              locale={locale}
              focusId={analysisFocusId}
              onBackToMain={() => backToMainAt('analysis')}
            />
          </motion.div>
        )}

        {activeView === 'main' && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="relative z-10"
          >
            {/* =========================================================
                PAGE 01 (FIRST SCREEN): 表紙。オリジナルのアニメーション背景に、工作室のマークと名前
               ========================================================= */}
            <section
              id="logo-stage"
              className="relative w-full h-screen bg-[var(--cover-bg)] flex flex-col items-center justify-center select-none overflow-hidden pointer-events-none"
            >
              {/* 背景：コードで描くオリジナルのアニメーション（等高線・六角形・光の粒） */}
              <motion.div
                style={{ y: coverBgY, scale: coverBgScale }}
                className="absolute inset-0 w-full h-full will-change-transform"
              >
                <CoverBackdrop />
              </motion.div>

              {/* 中央をほんのり明るく、四隅を沈める */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cover-bg)_85%,transparent)_0%,color-mix(in_srgb,var(--cover-bg)_45%,transparent)_35%,transparent_70%)]" />

              {/* 設定資料集の表紙のようなトンボ（四隅の細い L 字） */}
              <div className="absolute inset-5 sm:inset-8 z-10 text-[var(--cover-ink)]/25">
                <span className="absolute left-0 top-0 w-6 h-6 border-l border-t border-current" />
                <span className="absolute right-0 top-0 w-6 h-6 border-r border-t border-current" />
                <span className="absolute left-0 bottom-0 w-6 h-6 border-l border-b border-current" />
                <span className="absolute right-0 bottom-0 w-6 h-6 border-r border-b border-current" />
              </div>

              {/* マークと名前だけを中央に */}
              <motion.div
                style={{
                  y: coverLogoY,
                  scale: coverLogoScale,
                  opacity: coverLogoOpacity,
                }}
                className="relative z-20 flex flex-col items-center text-center text-[var(--cover-ink)] px-6 will-change-transform"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
                >
                  <StudioMark className="w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 text-[var(--cover-ink)]" title="Sora Studio" />
                </motion.div>

                {/* ロゴタイプ：大きな SORA と、字間を広げた STUDIO */}
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.25, ease: EASE_OUT_EXPO }}
                  className="mt-8 sm:mt-10 font-logo flex flex-col items-center"
                  aria-label="Sora Studio"
                >
                  <span className="block text-6xl sm:text-8xl lg:text-[7.5rem] font-semibold leading-none tracking-[0.12em] pl-[0.12em]">
                    SORA
                  </span>
                  <span className="mt-4 sm:mt-5 flex items-center gap-4 sm:gap-5 text-xs sm:text-base font-light tracking-[0.75em] pl-[0.75em] text-[var(--cover-ink)]/75">
                    <motion.i
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
                      className="block h-px w-8 sm:w-14 bg-[var(--cover-ink)]/35 origin-right"
                    />
                    STUDIO
                    <motion.i
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
                      className="block h-px w-8 sm:w-14 bg-[var(--cover-accent)] origin-left"
                    />
                  </span>
                </motion.h1>
              </motion.div>

              {/* スクロールの合図 */}
              <motion.div
                style={{ opacity: coverCueOpacity }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 z-20 text-[var(--cover-ink)]/60"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>

              {/* 下端のライン */}
              <motion.div
                style={{ scaleX: coverLaserScaleX }}
                className="absolute bottom-0 left-0 right-0 h-[2px] z-20 scanline-laser-beam will-change-transform"
              />
            </section>

            {/* =========================================================
                CHAPTER 01. PROFILE
                上段：見出し（左）＋基本情報（右） / 下段：4枚のカード（クリックで専用ページへ）
               ========================================================= */}
            <section
              id="about"
              className="lg:min-h-screen flex items-center py-20 lg:py-24 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]"
            >
              <div className="w-full max-w-6xl mx-auto px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                    className="lg:col-span-7"
                  >
                    <div className="text-xs font-mono tracking-[0.24em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4 editorial-callout-line">
                      {c.aboutChapter}
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[36px] font-semibold tracking-tight leading-[1.25]">
                      {c.aboutTitle}
                    </h2>
                    <p className="mt-5 text-sm sm:text-base text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
                      {c.aboutLead}
                    </p>
                  </motion.div>

                  {/* 基本情報 */}
                  <motion.dl
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.08, ease: EASE_OUT_EXPO }}
                    className="lg:col-span-5 grid grid-cols-3 gap-x-5 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]"
                  >
                    {c.profileFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className={`py-3.5 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)] flex flex-col gap-1 ${idx === c.profileFacts.length - 1 ? 'col-span-3' : ''}`}
                      >
                        <dt className="text-[11px] font-mono tracking-wider text-[var(--c-ink-3)]">
                          0{idx + 1} / {fact.label}
                        </dt>
                        <dd className="text-sm font-medium">{fact.value}</dd>
                      </div>
                    ))}
                  </motion.dl>
                </div>

                <div className="mt-12 pt-10 rule-top">
                  <ProfileCards locale={locale} onOpenTopic={openProfilePage} />
                </div>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 02. 作品设定资料集 (LARGE PLATES + ANNOTATED MARGINALIA)
                Alternating Asymmetric Magazine Spreads with Multi-Plane Parallax
               ========================================================= */}
            <section
              id="works"
              className="py-28 lg:py-40 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]"
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-12">
                {/* Chapter Header (Expanded Text & Stable Button Width) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                  className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24 pb-10 rule-bottom"
                >
                  <div className="max-w-3xl min-w-0">
                    <div className="text-xs font-mono tracking-[0.24em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4 editorial-callout-line">
                      {c.worksChapter}
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight leading-[1.12] min-h-[1.15em]">
                      {c.worksTitle}
                    </h2>
                    <p className="mt-5 text-base sm:text-lg text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed min-h-[3.5rem]">
                      {c.worksLead}
                    </p>
                  </div>
                </motion.div>

                {/* Full-Spread Annotated Artbook Plates with Multi-Plane Parallax */}
                <div className="space-y-28 lg:space-y-36">
                  {PROJECTS_DATA.map((project, idx) => (
                    <EditorialWorkSpread
                      key={project.id}
                      project={project}
                      idx={idx}
                      locale={locale}
                      platePrefix={c.platePrefix}
                      annotationHeader={c.annotationHeader}
                      roleLabel={c.roleLabel}
                      openSpecLabel={c.openSpec}
                      playNowLabel={c.playNowBtn}
                      onOpenSpec={openSpecPage}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 03. ゲーム分析・研究 (#analysis)
               ========================================================= */}
            <GameAnalysisSection locale={locale} onOpen={openAnalysisPage} />

            {/* =========================================================
                CREDITS (#ending)
               ========================================================= */}
            <EndingCreditsSection
              locale={locale}
              onScrollToSection={scrollToSection}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Floating Editorial 'Back to Top' Button — Appears after scrolling past the cover */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="floating-back-to-top"
            type="button"
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              mass: 0.6,
            }}
            onMouseEnter={() => soundFX.playBlip(660)}
            onClick={() => {
              soundFX.playSelect();
              setActiveNavSection('');
              animateSpringScrollTo(0);
            }}
            aria-label={
              locale === 'ja'
                ? '巻頭（トップ）へ戻る'
                : locale === 'zh'
                ? '平滑返回设定集卷首'
                : 'Return to Top of Portfolio'
            }
            title={
              locale === 'ja'
                ? '巻頭へ戻る (Back to Top)'
                : locale === 'zh'
                ? '返回顶部 (Back to Top)'
                : 'Back to Top'
            }
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group flex items-center gap-2.5 px-4 py-3 bg-[var(--c-ink)] dark:bg-[var(--c-ink)] text-[var(--c-bg)] dark:text-[var(--c-bg)] border border-[var(--c-ink)] dark:border-[var(--c-ink)] hover:bg-[var(--c-accent)] hover:border-[var(--c-accent)] dark:hover:bg-[var(--c-accent)] dark:hover:border-[var(--c-accent)] dark:hover:text-white shadow-lg cursor-pointer select-none"
          >
            <ArrowUp className="w-4 h-4 text-[var(--c-accent)] dark:text-[var(--c-accent)] group-hover:text-white transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="text-xs font-mono tracking-[0.18em] whitespace-nowrap">
              {locale === 'ja' ? 'TOP · 巻頭へ' : locale === 'zh' ? 'TOP · 返回卷首' : 'BACK TO TOP'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Editorial Colophon Footer (奥付 / COLOPHON) */}
      <footer className="relative z-10 py-12 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)] text-xs text-[var(--c-ink-3)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-mono tracking-wider">
            COLOPHON // © {new Date().getFullYear()} {c.name} · OFFICIAL GAME DESIGN WORKS
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono hover:text-[var(--c-accent)] dark:hover:text-[var(--c-accent)] transition-colors"
          >
            GitHub · {GITHUB_USERNAME}
          </a>
        </div>
      </footer>
    </div>
  );
}
