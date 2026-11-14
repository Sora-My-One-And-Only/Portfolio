/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
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
  Volume2,
  VolumeX,
  Music,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Clock,
  ArrowRight,
  Play,
  FileText,
} from 'lucide-react';
import type { Locale } from './content/interface-copy';
import { PROJECTS_DATA, WORK_DESIGN_NOTES, type ProjectSpec } from './content/works';
import { CORE_SKILLS, EDITORIAL_COPY } from './content/site-copy';
import { DESIGN_NOTES } from './content/design-notes';
import {
  soundFX,
  SoundEngineSnapshot,
} from './utils/sound';
import { WorkDetailSubPage } from './components/WorkDetailSubPage';
import { DesignNotesPage } from './components/DesignNotesPage';
import {
  QuickGuideSection,
  PlayGamesPortalSection,
  WhatICanDoSection,
  EndingCreditsSection,
} from './components/PortfolioSections';

type ActivePageView = 'main' | 'spec-detail' | 'resume-detail';

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
  openSpecLabel: string;
  playNowLabel: string;
  onOpenSpec: (proj: ProjectSpec, mode: 'video' | 'playable') => void;
}

const EditorialWorkSpread: React.FC<EditorialWorkSpreadProps> = ({
  project,
  idx,
  locale,
  platePrefix,
  annotationHeader,
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
        <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.18em] text-[#888E94] mb-2.5">
          <span>
            FIG. {plateNumber} — {project.code}
          </span>
          <span>{project.engineTag}</span>
        </div>

        {/* Large Artbook Visual Plate with Inner Parallax */}
        <div
          onClick={() => onOpenSpec(project, 'video')}
          className="relative aspect-[16/10] w-full bg-[#181A1C] overflow-hidden border border-[#E2E0D8] dark:border-[#2E2924] cursor-pointer"
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
            {platePrefix} #{plateNumber} · 60FPS SPEC
          </div>
        </div>

        {/* Under-Plate Technical Callout Caption (图片下方图文注释) */}
        <div className="mt-3 pt-2.5 min-h-[2.25rem] border-t border-[#E2E0D8] dark:border-[#2E2924] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#555B61] dark:text-[#B0A89E]">
          <span>
            ───● {project.keyMechanics[locale][0]}
          </span>
          <span className="text-[#C84B31] dark:text-[#E57052] shrink-0">
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
          <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052] mb-3">
            {annotationHeader} #{plateNumber}
          </div>

          <h3
            onClick={() => onOpenSpec(project, 'video')}
            className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.24] min-h-[2.48em] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors cursor-pointer"
          >
            {project.title[locale]}
          </h3>

          <p className="mt-4 text-sm sm:text-base text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[5.2rem]">
            {project.summary[locale]}
          </p>

          {/* Marginalia Spec Callout List (设定集参数注释条) */}
          <div className="mt-6 pt-5 border-t border-[#E2E0D8] dark:border-[#2E2924] space-y-2">
            {project.metrics.slice(0, 3).map((m, mIdx) => (
              <div
                key={mIdx}
                className="min-h-[1.5rem] flex items-center justify-between gap-4 text-xs font-mono"
              >
                <span className="text-[#888E94]">
                  0{mIdx + 1}. {m.label[locale]}
                </span>
                <span className="font-medium text-[#181A1C] dark:text-[#F2EFE9] tabular-nums shrink-0">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* DEV LOG (課題 → 解決 → 結果) & PARTY Block (Inspired by haru2401game.github.io/portfolio/#featured-works) */}
          {designNote && (
            <div className="mt-5 p-4 bg-[#EFEDE6]/85 dark:bg-[#1B1916]/90 border border-[#E2E0D8] dark:border-[#2E2924] space-y-2 text-xs">
              <div className="font-mono text-[11px] text-[#C84B31] dark:text-[#E57052] pb-1.5 border-b border-[#E2E0D8] dark:border-[#2E2924]">
                {designNote.party[locale]}
              </div>
              <div className="text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                {designNote.challenge[locale]}
              </div>
              <div className="text-[#181A1C] dark:text-[#F2EFE9] leading-relaxed">
                {designNote.solution[locale]}
              </div>
              <div className="font-mono text-[11px] text-[#C84B31] dark:text-[#E57052] pt-1">
                ★ {designNote.result[locale]}
              </div>
            </div>
          )}
        </div>

        {/* Editorial Action Links (Fixed Button Dimensions Across Locales) */}
        <div className="mt-7 pt-6 border-t border-[#181A1C] dark:border-[#F2EFE9] flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenSpec(project, 'video')}
            className="inline-flex items-center justify-center gap-2 h-10 min-w-[188px] px-4 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>{openSpecLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onOpenSpec(project, 'playable')}
            className="inline-flex items-center justify-center gap-2 h-10 min-w-[156px] px-4 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052] shrink-0" />
            <span>{playNowLabel}</span>
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('ja');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const canvasWaveRef = useRef<HTMLDivElement | null>(null);
  const themeAnimRafRef = useRef<number | null>(null);
  const themeSweepTimerRef = useRef<number | null>(null);
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
  const [subPageStageMode, setSubPageStageMode] = useState<'video' | 'playable'>('video');
  const [resumeSubTab, setResumeSubTab] = useState<'playHistory' | 'otherWorks'>('playHistory');

  // Page 1 Showreel active slide index (0..3)
  const [reelIdx, setReelIdx] = useState<number>(0);

  // Page 2 Table of Contents active cursor index (0..4)
  const [activeMenuIdx, setActiveMenuIdx] = useState<number>(0);

  useEffect(() => {
    return soundFX.subscribe((snap) => {
      setSoundState(snap);
    });
  }, []);

  useEffect(() => {
    if (activeView !== 'main') return;
    const interval = setInterval(() => {
      setReelIdx((prev) => (prev + 1) % PROJECTS_DATA.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [activeView]);

  useEffect(() => {
    return () => {
      if (bgmToastTimerRef.current !== null) {
        window.clearTimeout(bgmToastTimerRef.current);
      }
      if (sfxToastTimerRef.current !== null) {
        window.clearTimeout(sfxToastTimerRef.current);
      }
      if (themeSweepTimerRef.current !== null) {
        window.clearTimeout(themeSweepTimerRef.current);
      }
      if (themeAnimRafRef.current !== null) {
        cancelAnimationFrame(themeAnimRafRef.current);
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

    if (themeSweepTimerRef.current !== null) {
      window.clearTimeout(themeSweepTimerRef.current);
      themeSweepTimerRef.current = null;
    }
    if (themeAnimRafRef.current !== null) {
      cancelAnimationFrame(themeAnimRafRef.current);
      themeAnimRafRef.current = null;
    }

    const root = document.documentElement;
    const viewportH = Math.max(1, window.innerHeight);
    const STAGGER_MS = 380;
    const DURATION_MS = 720;
    const TOTAL_MS = STAGGER_MS + DURATION_MS;

    // 1. Assign top-to-bottom viewport-relative transition delay (--theme-delay) to every visible space, border & text node
    const elements = document.querySelectorAll<HTMLElement>(
      '#root header, #root nav, #root section, #root article, #root aside, #root footer, #root div, #root h1, #root h2, #root h3, #root p, #root span, #root a, #root button, #root label, #root input, #root textarea, #root svg'
    );
    const touchedElements: HTMLElement[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom >= -120 && rect.top <= viewportH + 120) {
        const anchorY =
          rect.height > viewportH * 0.45
            ? Math.max(0, rect.top)
            : rect.top + rect.height * 0.25;
        const normY = Math.max(0, Math.min(1, anchorY / viewportH));
        const delayMs = Math.round(normY * STAGGER_MS);
        el.style.setProperty('--theme-delay', `${delayMs}ms`);
        touchedElements.push(el);
      }
    });

    // 2. Enable global smooth color/surface transition class and flush styles BEFORE toggling .dark
    root.classList.add('theme-transitioning');
    void root.offsetHeight;

    // 3. Toggle .dark class & React state so all text, borders, and surfaces begin their top-to-bottom CSS transition
    if (nextDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    flushSync(() => {
      setDarkMode(nextDark);
    });

    // 4. Drive the Fixed Spatial Canvas (`canvasWaveRef`) with the exact same top-to-bottom mathematical wave
    const fromRGB: [number, number, number] = nextDark ? [247, 246, 242] : [19, 18, 16];
    const toRGB: [number, number, number] = nextDark ? [19, 18, 16] : [247, 246, 242];
    const startTime = performance.now();
    const STOP_COUNT = 10;

    const stepCanvasWave = (now: number) => {
      const elapsed = now - startTime;
      const canvasEl = canvasWaveRef.current;

      if (canvasEl && elapsed < TOTAL_MS) {
        const stops: string[] = [];
        for (let i = 0; i <= STOP_COUNT; i++) {
          const normY = i / STOP_COUNT;
          const localRaw = Math.max(0, Math.min(1, (elapsed - normY * STAGGER_MS) / DURATION_MS));
          const inv = 1 - localRaw;
          const eased = 1 - inv * inv * inv;

          const r = Math.round(fromRGB[0] + (toRGB[0] - fromRGB[0]) * eased);
          const g = Math.round(fromRGB[1] + (toRGB[1] - fromRGB[1]) * eased);
          const b = Math.round(fromRGB[2] + (toRGB[2] - fromRGB[2]) * eased);
          stops.push(`rgb(${r}, ${g}, ${b}) ${(normY * 100).toFixed(1)}%`);
        }

        const topRaw = Math.max(0, Math.min(1, elapsed / DURATION_MS));
        const topEased = 1 - Math.pow(1 - topRaw, 3);
        const darkRatio = nextDark ? topEased : 1 - topEased;
        const a1 = (0.055 * darkRatio).toFixed(4);
        const a2 = (0.035 * darkRatio).toFixed(4);

        canvasEl.style.backgroundImage =
          `radial-gradient(ellipse 85% 45% at 50% 0%, rgba(212, 175, 122, ${a1}), transparent 70%), ` +
          `radial-gradient(ellipse 65% 40% at 85% 25%, rgba(229, 112, 82, ${a2}), transparent 65%), ` +
          `linear-gradient(to bottom, ${stops.join(', ')})`;

        themeAnimRafRef.current = requestAnimationFrame(stepCanvasWave);
      } else {
        if (canvasEl) {
          canvasEl.style.backgroundImage = '';
        }
        themeAnimRafRef.current = null;
      }
    };

    themeAnimRafRef.current = requestAnimationFrame(stepCanvasWave);

    // 5. Clean up transition class and inline delays after the wave completes
    themeSweepTimerRef.current = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
      if (canvasWaveRef.current) {
        canvasWaveRef.current.style.backgroundImage = '';
      }
      touchedElements.forEach((el) => {
        el.style.removeProperty('--theme-delay');
      });
      themeSweepTimerRef.current = null;
    }, TOTAL_MS + 60);
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
  const [activeNavSection, setActiveNavSection] = useState<string>('main-menu');
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

    // Show floating 'Back to Top' button once the user scrolls past the second screen (#main-menu)
    const mainMenuEl = document.getElementById('main-menu');
    const secondScreenThreshold = mainMenuEl
      ? mainMenuEl.offsetTop + mainMenuEl.offsetHeight * 0.85
      : vh * 1.85;
    const pastSecondScreen =
      activeView === 'main' ? latestY > secondScreenThreshold : latestY > vh * 0.9;

    if (pastSecondScreen !== prevPastSecondScreenRef.current) {
      prevPastSecondScreenRef.current = pastSecondScreen;
      setShowBackToTop(pastSecondScreen);
    }

    // Update active top nav chapter highlight smoothly during scroll
    if (activeView === 'main') {
      const sectionIds = [
        'resume',
        'skills',
        'play-games',
        'works',
        'about',
        'main-menu',
      ];
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
      const headerOffset = id === 'main-menu' ? 0 : 56;
      const targetTop = Math.max(0, rect.top + window.scrollY - headerOffset);
      animateScrollTo(targetTop);
    }
  }, []);

  // When returning from a subpage ('spec-detail' / 'resume-detail') to 'main', wait via rAF until target section is mounted
  useEffect(() => {
    if (activeView !== 'main' || !pendingScrollIdRef.current) return;
    const targetId = pendingScrollIdRef.current;
    let attempts = 0;
    let rafId: number;

    const tryScrollWhenMounted = () => {
      attempts += 1;
      if (targetId === 'top') {
        pendingScrollIdRef.current = null;
        animateScrollTo(0);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        pendingScrollIdRef.current = null;
        executeSectionScroll(targetId);
      } else if (attempts < 45) {
        rafId = requestAnimationFrame(tryScrollWhenMounted);
      } else {
        pendingScrollIdRef.current = null;
      }
    };

    rafId = requestAnimationFrame(tryScrollWhenMounted);
    return () => cancelAnimationFrame(rafId);
  }, [activeView, executeSectionScroll]);

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

  // Allow keyboard Up/Down arrow navigation when viewing the Table of Contents (Page 2)
  useEffect(() => {
    if (activeView !== 'main') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * 1.65) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundFX.playBlip(600);
        setActiveMenuIdx((prev) => (prev + 1) % c.menuItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundFX.playBlip(640);
        setActiveMenuIdx((prev) => (prev - 1 + c.menuItems.length) % c.menuItems.length);
      } else if (e.key === 'Enter') {
        const target = c.menuItems[activeMenuIdx];
        if (target) {
          scrollToSection(target.id);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeView, activeMenuIdx, c.menuItems, scrollToSection]);

  const openSpecPage = (proj: ProjectSpec, mode: 'video' | 'playable' = 'video') => {
    soundFX.playPageTurn();
    setSelectedProject(proj);
    setSubPageStageMode(mode);
    setActiveView('spec-detail');
  };

  const openResumePage = (tab: 'playHistory' | 'otherWorks') => {
    soundFX.playPageTurn();
    setResumeSubTab(tab);
    setActiveView('resume-detail');
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
      {/* Fixed Viewport Spatial Canvas Underlay — Flows Top-to-Bottom in Lockstep with Staggered DOM Elements */}
      <div
        ref={canvasWaveRef}
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
          className="h-2.5 bg-[#EFEDE6]/95 dark:bg-[#0D0C0A]/95 border-b border-[#E2E0D8] dark:border-[#2E2924] px-4 flex items-center gap-3 select-none"
        >
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-[0.2em] text-[#888E94] shrink-0">
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
                      ? 'bg-[#C84B31] dark:bg-[#E57052]'
                      : 'bg-[#D8D5CC] dark:bg-[#2E2924] hover:bg-[#C84B31]/50'
                  }`}
                />
              );
            })}
          </div>

          <span className="text-[9px] font-mono tabular-nums tracking-wider text-[#555B61] dark:text-[#B0A89E] shrink-0">
            P.{String(scrollPct).padStart(3, '0')}
          </span>
        </div>

        {/* Editorial Running Header — Full-Width 3-Zone Layout: [Left Logo | Center Navigation | Right Controls] */}
        <header className="border-b border-[#E2E0D8] dark:border-[#2E2924] bg-[#F7F6F2]/94 dark:bg-[#131210]/94 backdrop-blur-md">
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
                className="inline-flex items-baseline gap-3 text-left cursor-pointer group whitespace-nowrap"
              >
                <span className="font-editorial text-lg sm:text-xl font-semibold tracking-[0.2em] text-[#181A1C] dark:text-[#F2EFE9]">
                  [BRAND LOGO]
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono tracking-[0.22em] text-[#888E94] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                  SORA PORTFOLIO
                </span>
              </button>
            </div>

            {/* CENTER ZONE: Expanded Chapter Jump Links (No Truncation, Stable Slot Widths Across JA/ZH/EN) */}
            <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-6 justify-self-center text-xs font-mono tracking-wider text-[#555B61] dark:text-[#B0A89E]">
              {[
                { id: 'main-menu', label: c.nav.menu, num: '00' },
                { id: 'about', label: c.nav.about, num: '01' },
                { id: 'works', label: c.nav.works, num: '02' },
                { id: 'play-games', label: c.nav.playGames, num: '2B' },
                { id: 'skills', label: c.nav.skills, num: '03' },
                { id: 'resume', label: c.nav.resume, num: '04' },
              ].map((item) => {
                const isCurrent = activeView === 'main' && activeNavSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative h-10 min-w-[82px] xl:min-w-[94px] px-1.5 inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'text-[#181A1C] dark:text-[#F2EFE9] font-medium'
                        : 'hover:text-[#181A1C] dark:hover:text-[#F2EFE9]'
                    }`}
                  >
                    <span
                      className={`text-[10px] text-[#C84B31] dark:text-[#E57052] transition-opacity shrink-0 ${
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
                        className="absolute left-2 right-2 bottom-1 h-[1.5px] bg-[#C84B31] dark:bg-[#E57052]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT ZONE: Language Switcher + Standalone BGM Toggle + Standalone SFX Toggle + Theme Switcher */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Fixed-Cell Language Switcher */}
              <div className="grid grid-cols-3 h-8 border border-[#E2E0D8] dark:border-[#2E2924] bg-white/60 dark:bg-[#1B1916]">
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
                        ? 'bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] font-medium'
                        : 'text-[#555B61] dark:text-[#B0A89E] hover:text-[#181A1C] dark:hover:text-[#F2EFE9]'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {/* 1. Standalone Pre-Generated JRPG BGM Toggle Button */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={toggleBgm}
                  aria-label={
                    soundState.bgmEnabled ? 'Pause JRPG BGM' : 'Play JRPG BGM'
                  }
                  aria-pressed={soundState.bgmEnabled}
                  title={
                    soundState.bgmEnabled
                      ? 'JRPG Sanctuary BGM: ON'
                      : 'JRPG Sanctuary BGM: OFF'
                  }
                  className={`relative h-8 min-w-[68px] sm:min-w-[74px] px-2.5 border flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider cursor-pointer transition-colors whitespace-nowrap ${
                    showBgmToast
                      ? 'border-[#C84B31] dark:border-[#E57052]'
                      : 'border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#181A1C] dark:hover:border-[#F2EFE9]'
                  } ${
                    soundState.bgmEnabled
                      ? 'text-[#181A1C] dark:text-[#F2EFE9]'
                      : 'text-[#888E94]'
                  }`}
                >
                  {/* Brief Expanding Pulse Ring on BGM Toggle */}
                  <AnimatePresence>
                    {bgmPulseKey > 0 && (
                      <motion.span
                        key={`bgm-pulse-${bgmPulseKey}`}
                        initial={{ opacity: 0.85, scale: 0.92 }}
                        animate={{ opacity: 0, scale: 1.45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 border ${
                          soundState.bgmEnabled
                            ? 'border-[#C84B31] dark:border-[#E57052]'
                            : 'border-[#888E94]'
                        }`}
                      />
                    )}
                  </AnimatePresence>

                  <Music
                    className={`w-3.5 h-3.5 shrink-0 ${
                      soundState.bgmEnabled
                        ? 'text-[#C84B31] dark:text-[#E57052]'
                        : 'text-[#888E94]'
                    }`}
                  />
                  <span>BGM</span>
                </button>

                {/* BGM Toggle Toast Indicator */}
                <AnimatePresence>
                  {showBgmToast && (
                    <motion.div
                      key={`bgm-toast-${bgmPulseKey}`}
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 24,
                        mass: 0.5,
                      }}
                      className="pointer-events-none absolute right-0 top-full mt-2 z-50 px-2.5 py-1.5 bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] border border-[#C84B31] dark:border-[#E57052] shadow-md flex items-center gap-2 whitespace-nowrap"
                    >
                      {soundState.bgmEnabled ? (
                        <span
                          aria-hidden="true"
                          className="inline-flex items-end gap-[2px] h-2.5"
                        >
                          <motion.span
                            animate={{ scaleY: [0.4, 1, 0.5] }}
                            transition={{ duration: 0.45, repeat: Infinity }}
                            className="w-[2px] h-full bg-[#E57052] dark:bg-[#C84B31] origin-bottom"
                          />
                          <motion.span
                            animate={{ scaleY: [1, 0.35, 1] }}
                            transition={{ duration: 0.45, repeat: Infinity }}
                            className="w-[2px] h-full bg-[#E57052] dark:bg-[#C84B31] origin-bottom"
                          />
                          <motion.span
                            animate={{ scaleY: [0.55, 0.95, 0.4] }}
                            transition={{ duration: 0.45, repeat: Infinity }}
                            className="w-[2px] h-full bg-[#E57052] dark:bg-[#C84B31] origin-bottom"
                          />
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="w-2 h-[1.5px] bg-[#888E94]"
                        />
                      )}

                      <span className="text-[10px] font-mono tracking-[0.14em]">
                        {soundState.bgmEnabled
                          ? locale === 'ja'
                            ? 'BGM ON · JRPG 聖域の室内楽'
                            : locale === 'zh'
                            ? 'BGM ON · 日式RPG原声音乐播放中'
                            : 'BGM ON · JRPG SANCTUARY OST'
                          : locale === 'ja'
                          ? 'BGM OFF · 背景音楽停止'
                          : locale === 'zh'
                          ? 'BGM OFF · 背景音乐已关闭'
                          : 'BGM OFF · PAUSED'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Standalone Paper & Page-Turn Foley SFX Button */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={toggleSfx}
                  aria-label={
                    soundState.sfxEnabled
                      ? 'Mute paper & page-turn sound effects'
                      : 'Unmute paper & page-turn sound effects'
                  }
                  aria-pressed={soundState.sfxEnabled}
                  title={
                    soundState.sfxEnabled
                      ? 'Paper & Page-Turn Foley SFX: ON'
                      : 'Paper & Page-Turn Foley SFX: OFF'
                  }
                  className={`relative h-8 min-w-[68px] sm:min-w-[74px] px-2.5 border flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    showSfxToast
                      ? 'border-[#C84B31] dark:border-[#E57052]'
                      : 'border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#181A1C] dark:hover:border-[#F2EFE9]'
                  } ${
                    soundState.sfxEnabled
                      ? 'text-[#181A1C] dark:text-[#F2EFE9]'
                      : 'text-[#888E94]'
                  }`}
                >
                  {/* Brief Expanding Pulse Ring on SFX Toggle */}
                  <AnimatePresence>
                    {sfxPulseKey > 0 && (
                      <motion.span
                        key={`sfx-pulse-${sfxPulseKey}`}
                        initial={{ opacity: 0.85, scale: 0.92 }}
                        animate={{ opacity: 0, scale: 1.48 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 border ${
                          soundState.sfxEnabled
                            ? 'border-[#C84B31] dark:border-[#E57052]'
                            : 'border-[#888E94]'
                        }`}
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={soundState.sfxEnabled ? 'sfx-on-icon' : 'sfx-off-icon'}
                      initial={{ scale: 0.65, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.65, opacity: 0 }}
                      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                      className="block shrink-0"
                    >
                      {soundState.sfxEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                  <span>SFX</span>
                </button>

                {/* Brief Editorial Text Toast Indicator Anchored Below SFX Button */}
                <AnimatePresence>
                  {showSfxToast && (
                    <motion.div
                      key={`sfx-toast-${sfxPulseKey}`}
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 24,
                        mass: 0.5,
                      }}
                      className="pointer-events-none absolute right-0 top-full mt-2 z-50 px-2.5 py-1.5 bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] border border-[#C84B31] dark:border-[#E57052] shadow-md flex items-center gap-2 whitespace-nowrap"
                    >
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full ${
                          soundState.sfxEnabled
                            ? 'bg-[#E57052] dark:bg-[#C84B31]'
                            : 'bg-[#888E94]'
                        }`}
                      />
                      <span className="text-[10px] font-mono tracking-[0.14em]">
                        {soundState.sfxEnabled
                          ? locale === 'ja'
                            ? 'SFX ON · 紙質＆ページめくり音'
                            : locale === 'zh'
                            ? 'SFX ON · 设定集纸质翻页音效'
                            : 'SFX ON · PAPER & PAGE FOLEY'
                          : locale === 'ja'
                          ? 'SFX OFF · 効果音ミュート'
                          : locale === 'zh'
                          ? 'SFX OFF · 翻页音效已静音'
                          : 'SFX OFF · FOLEY MUTED'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Smooth Top-to-Bottom Theme Switcher */}
              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label="Toggle Light/Dark Theme"
                title="Switch Day Print / Night Archive Edition"
                className="w-8 h-8 flex items-center justify-center border border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#181A1C] dark:hover:border-[#F2EFE9] text-[#181A1C] dark:text-[#F2EFE9] transition-colors cursor-pointer overflow-hidden shrink-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? 'dark-icon' : 'light-icon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-[#D4AF7A]" /> : <Moon className="w-3.5 h-3.5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
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
              initialStageMode={subPageStageMode}
              onBackToMain={() => {
                setActiveView('main');
              }}
              onSelectProject={(proj) => openSpecPage(proj, 'video')}
            />
          </motion.div>
        )}

        {activeView === 'resume-detail' && (
          <motion.div
            key="resume-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="relative z-10 pt-16 will-change-transform"
          >
            <DesignNotesPage
              locale={locale}
              initialSubTab={resumeSubTab}
              onBackToMain={() => {
                setActiveView('main');
              }}
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
                PAGE 01 (FIRST SCREEN): FULL-VIEWPORT NON-INTERACTIVE LOGO & SHOWREEL
                (100vh full-bleed simultaneous crossfade showreel + studio logo, zero flash)
               ========================================================= */}
            <section
              id="logo-stage"
              className="relative w-full h-screen bg-[#131210] flex flex-col items-center justify-center select-none overflow-hidden pointer-events-none"
            >
              {/* Full-Screen Simultaneous Crossfade Works Showreel Background (Never flashes white/blank) */}
              <motion.div
                style={{
                  y: coverBgY,
                  scale: coverBgScale,
                }}
                className="absolute inset-0 w-full h-full will-change-transform"
              >
                {PROJECTS_DATA.map((proj, idx) => {
                  const isActive = idx === reelIdx;
                  return (
                    <motion.img
                      key={proj.id}
                      src={proj.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 1.06,
                      }}
                      transition={{
                        opacity: { duration: 1.4, ease: 'easeInOut' },
                        scale: { duration: 3.6, ease: 'easeOut' },
                      }}
                      className="absolute inset-0 w-full h-full object-cover will-change-transform"
                    />
                  );
                })}
              </motion.div>

              {/* Balanced Editorial Vignette Scrim */}
              <div className="
                absolute inset-0
                bg-gradient-to-b from-[#131210]/50 via-[#131210]/40 to-[#131210]/75
              " />

              {/* Centered Studio Emblem & Serif Display Logo Only (Minimal Text, Zero Interaction) */}
              <motion.div
                style={{
                  y: coverLogoY,
                  scale: coverLogoScale,
                  opacity: coverLogoOpacity,
                }}
                className="relative z-20 flex flex-col items-center text-center text-white px-6 will-change-transform"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-6 text-white/90">
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                      <polygon
                        points="60,8 106,34 106,86 60,112 14,86 14,34"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M60 24 L67 60 L60 96 L53 60 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <h1 className="font-editorial text-4xl sm:text-7xl font-semibold tracking-[0.22em] pl-[0.22em]">
                    SORA PORTFOLIO
                  </h1>
                  <p className="mt-4 text-xs sm:text-sm font-mono tracking-[0.28em] text-white/80 pl-[0.28em]">
                    {c.titleMain}
                  </p>
                </div>
              </motion.div>

              {/* Subtle Passive Scroll Down Cue */}
              <motion.div
                style={{ opacity: coverCueOpacity }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 z-20 text-white/70"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>

              {/* Bottom Scanline-Wipe Seam */}
              <motion.div
                style={{ scaleX: coverLaserScaleX }}
                className="absolute bottom-0 left-0 right-0 h-[2px] z-20 scanline-laser-beam will-change-transform"
              />
            </section>

            {/* =========================================================
                PAGE 02 (SECOND SCREEN ON SCROLL DOWN):
                EDITORIAL ARTBOOK TABLE OF CONTENTS / MAIN MENU SPREAD (目次)
               ========================================================= */}
            <section
              id="main-menu"
              className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 sm:pb-24 px-6 sm:px-12 max-w-6xl mx-auto select-none"
            >
              {/* Top Archive Folio Header Line (Expanded Across JA/ZH/EN) */}
              <div className="min-h-[2.75rem] flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E2E0D8] dark:border-[#2E2924] text-[11px] font-mono tracking-[0.2em] text-[#888E94]">
                <span>{c.editionTag}</span>
                <span className="shrink-0">FOLIO // 00 — {c.tocSub}</span>
              </div>

              {/* Asymmetric 12-Column Editorial Table of Contents Spread (Locked Row Geometry) */}
              <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left 5 Cols: Monumental Editorial Title & Author Attribution */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
                      INDEX & MAIN MENU
                    </div>
                    <h2 className="font-editorial text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.98]">
                      {c.tocHeading}
                    </h2>
                    <p className="mt-4 font-editorial text-xl sm:text-2xl text-[#555B61] dark:text-[#B0A89E]">
                      {c.titleSubName} — {c.titleMain}
                    </p>
                  </div>

                  <div className="mt-10 pt-6 border-t border-[#E2E0D8] dark:border-[#2E2924] min-h-[4.5rem] flex flex-col justify-between gap-2">
                    <div className="text-[11px] font-mono tracking-[0.18em] text-[#888E94]">
                      {c.roleSubtitle}
                    </div>
                    <p className="text-xs font-mono text-[#888E94]">
                      * {c.tocNote}
                    </p>
                  </div>
                </div>

                {/* Right 7 Cols: Editorial Chapter Index Rows with Locked Row Height & Expanded Text */}
                <div className="lg:col-span-7 border-t border-[#181A1C] dark:border-[#F2EFE9]">
                  {c.menuItems.map((item, idx) => {
                    const isSelected = activeMenuIdx === idx;

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={false}
                        animate={{
                          x: isSelected ? 6 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 240,
                          damping: 22,
                        }}
                        onMouseEnter={() => {
                          if (activeMenuIdx !== idx) {
                            soundFX.playBlip(580 + idx * 30);
                            setActiveMenuIdx(idx);
                          }
                        }}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full min-h-[76px] sm:min-h-[82px] py-3 px-4 border-b border-[#E2E0D8] dark:border-[#2E2924] grid grid-cols-12 items-center gap-3 text-left transition-colors duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210]'
                            : 'hover:bg-white/70 dark:hover:bg-[#1B1916]'
                        }`}
                      >
                        <div className="col-span-7 sm:col-span-6 flex items-baseline gap-3 min-w-0">
                          <span
                            className={`text-xs font-mono tracking-widest shrink-0 ${
                              isSelected
                                ? 'text-[#E57052] dark:text-[#C84B31]'
                                : 'text-[#C84B31] dark:text-[#E57052]'
                            }`}
                          >
                            {item.code}
                          </span>
                          <span className="font-editorial text-xl sm:text-2xl lg:text-[26px] font-semibold tracking-wide">
                            {item.cmd}
                          </span>
                        </div>

                        {/* Dotted Editorial Leader Line (Locked Column Span) */}
                        <div
                          className={`hidden sm:block sm:col-span-2 border-b border-dotted ${
                            isSelected
                              ? 'border-[#F7F6F2]/30 dark:border-[#131210]/30'
                              : 'border-[#888E94]/40'
                          }`}
                        />

                        <div className="col-span-5 sm:col-span-4 flex items-baseline justify-end gap-3 min-w-0">
                          <span
                            className={`text-xs sm:text-sm text-right ${
                              isSelected
                                ? 'text-[#F7F6F2]/90 dark:text-[#131210]/90'
                                : 'text-[#555B61] dark:text-[#B0A89E]'
                            }`}
                          >
                            {item.sub}
                          </span>
                          <span
                            className={`text-xs font-mono tabular-nums w-9 text-right shrink-0 ${
                              isSelected
                                ? 'text-[#E57052] dark:text-[#C84B31]'
                                : 'text-[#888E94]'
                            }`}
                          >
                            {item.page}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Folio Marginalia */}
              <div className="h-8 flex items-center justify-between text-[11px] font-mono tracking-[0.18em] text-[#888E94]">
                <span>KUROGANE ARCHIVE PRESS</span>
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="inline-flex items-center gap-2 hover:text-[#C84B31] transition-colors cursor-pointer"
                >
                  <span>TURN TO CHAPTER 01</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 00B. QUICK GUIDE
                (Inspired by haru2401game.github.io/portfolio/#quick-guide)
               ========================================================= */}
            <QuickGuideSection
              locale={locale}
              onOpenSpec={openSpecPage}
            />

            {/* =========================================================
                CHAPTER 01. 人物设定与企划哲学 (EDITORIAL FEATURE SPREAD)
                Oversized Serif Headline + Left Marginalia Dossier + Right Annotated Pillars
               ========================================================= */}
            <section
              id="about"
              className="py-28 lg:py-40 border-t border-[#E2E0D8] dark:border-[#2E2924]"
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-12">
                {/* Chapter Header & Oversized Display Title (Expanded Multi-Locale Height) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                  className="max-w-4xl mb-20"
                >
                  <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
                    {c.aboutChapter}
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-5xl lg:text-[50px] font-semibold tracking-tight leading-[1.18] min-h-[2.36em]">
                    {c.aboutTitle}
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-[#555B61] dark:text-[#B0A89E] leading-relaxed max-w-3xl min-h-[5.25rem]">
                    {c.aboutLead}
                  </p>
                </motion.div>

                {/* 12-Column Annotated Spread: 4-Col Marginalia Dossier + 8-Col Design Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 border-t border-[#181A1C] dark:border-[#F2EFE9]">
                  {/* Left 4 Columns: Marginalia Author Dossier (人物設定・基本仕様) */}
                  <motion.aside
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    className="lg:col-span-4 space-y-6"
                  >
                    <div className="text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                      ── {c.aboutMarginLabel}
                    </div>

                    <div className="border-t border-[#E2E0D8] dark:border-[#2E2924]">
                      {c.profileFacts.map((fact, idx) => (
                        <div
                          key={idx}
                          className="min-h-[74px] py-3 border-b border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-center gap-1"
                        >
                          <span className="text-[11px] font-mono tracking-wider text-[#888E94]">
                            0{idx + 1} / {fact.label}
                          </span>
                          <span className="text-sm sm:text-base font-medium">
                            {fact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.aside>

                  {/* Right 8 Columns: 3 Annotated Design Philosophy Notes */}
                  <div className="lg:col-span-8 divide-y divide-[#E2E0D8] dark:divide-[#2E2924]">
                    {c.aboutAnnotations.map((note, idx) => (
                      <motion.div
                        key={note.num}
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.8,
                          delay: idx * 0.1,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="py-7 first:pt-0 last:pb-0 min-h-[168px] grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start"
                      >
                        <div className="sm:col-span-3">
                          <span className="text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                            [{note.num}]
                          </span>
                        </div>
                        <div className="sm:col-span-9 min-w-0">
                          <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight leading-[1.25] min-h-[1.3em] mb-2.5">
                            {note.title}
                          </h3>
                          <p className="text-sm sm:text-base text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[4.5rem]">
                            {note.desc}
                          </p>
                          <div className="mt-3 text-[11px] font-mono tracking-[0.16em] text-[#888E94]">
                            ↳ {note.caption}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 02. 作品设定资料集 (LARGE PLATES + ANNOTATED MARGINALIA)
                Alternating Asymmetric Magazine Spreads with Multi-Plane Parallax
               ========================================================= */}
            <section
              id="works"
              className="py-28 lg:py-40 border-t border-[#E2E0D8] dark:border-[#2E2924]"
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-12">
                {/* Chapter Header (Expanded Text & Stable Button Width) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                  className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24 pb-10 border-b border-[#181A1C] dark:border-[#F2EFE9]"
                >
                  <div className="max-w-3xl min-w-0">
                    <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
                      {c.worksChapter}
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight leading-[1.12] min-h-[1.15em]">
                      {c.worksTitle}
                    </h2>
                    <p className="mt-5 text-base sm:text-lg text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[3.5rem]">
                      {c.worksLead}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openResumePage('otherWorks')}
                    className="inline-flex items-center justify-between gap-2.5 h-11 min-w-[248px] px-5 text-xs font-mono tracking-wider btn-3d-secondary self-start lg:self-auto cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>{c.moreWorksBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
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
                      openSpecLabel={c.openSpec}
                      playNowLabel={c.playNowBtn}
                      onOpenSpec={openSpecPage}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 02B. TRY ONLINE (#play-games)
                (Inspired by haru2401game.github.io/portfolio/#play-games)
               ========================================================= */}
            <PlayGamesPortalSection locale={locale} />

            {/* =========================================================
                CHAPTER 03. 核心策划与工程指标 (ANNOTATED SPECIFICATION TABLE)
               ========================================================= */}
            <section
              id="skills"
              className="py-28 lg:py-40 border-t border-[#E2E0D8] dark:border-[#2E2924]"
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  {/* Left 4 Columns: Chapter Title & Marginalia Commentary */}
                  <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                    className="lg:col-span-4"
                  >
                    <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
                      {c.skillsChapter}
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] min-h-[2.3em]">
                      {c.skillsTitle}
                    </h2>
                    <p className="mt-5 text-sm text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[4.5rem]">
                      {c.skillsMarginNote}
                    </p>
                  </motion.div>

                  {/* Right 8 Columns: Annotated Parameter Index */}
                  <div className="lg:col-span-8 border-t border-[#181A1C] dark:border-[#F2EFE9] divide-y divide-[#E2E0D8] dark:divide-[#2E2924]">
                    {CORE_SKILLS.map((sk, idx) => (
                      <motion.div
                        key={sk.code}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.8,
                          delay: idx * 0.08,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="min-h-[124px] py-5 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="flex items-baseline gap-3 min-w-0">
                            <span className="text-xs font-mono text-[#C84B31] dark:text-[#E57052] shrink-0">
                              [{sk.code}]
                            </span>
                            <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight">
                              {sk.name[locale]}
                            </h3>
                          </div>
                          <span className="text-lg font-mono tabular-nums font-medium text-[#C84B31] dark:text-[#E57052] shrink-0">
                            {{ja:'制作実例',zh:'作品实例',en:'Project example'}[locale]}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
                          ↳ {sk.annotation[locale]}
                        </p>

                        <div className="w-full h-[3px] bg-[#E2E0D8] dark:bg-[#2E2924] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: sk.pct }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.15,
                              delay: idx * 0.08,
                              ease: EASE_OUT_EXPO,
                            }}
                            className="h-full bg-[#181A1C] dark:bg-[#F2EFE9]"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                CHAPTER 03B. WHAT I CAN DO IN GAME PRODUCTION (#what-i-can-do)
                (Inspired by haru2401game.github.io/portfolio/#what-i-can-do)
               ========================================================= */}
            <WhatICanDoSection locale={locale} />

            {/* =========================================================
                CHAPTER 04. 游戏履历与拆解笔记 (EDITORIAL ARCHIVE INDEX)
               ========================================================= */}
            <section
              id="resume"
              className="py-28 lg:py-40 border-t border-[#E2E0D8] dark:border-[#2E2924]"
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-12">
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                  className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-8 border-b border-[#181A1C] dark:border-[#F2EFE9]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
                      {c.gamesChapter}
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.12] min-h-[1.15em]">
                      {c.gamesTitle}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => openResumePage('playHistory')}
                    className="inline-flex items-center justify-between gap-2.5 h-11 min-w-[248px] px-5 text-xs font-mono tracking-wider btn-3d-secondary self-start lg:self-auto cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>{c.gamesMoreBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </motion.div>

                {/* Annotated Editorial Deconstruction Rows */}
                <div className="divide-y divide-[#E2E0D8] dark:divide-[#2E2924] border-b border-[#E2E0D8] dark:border-[#2E2924]">
                  {DESIGN_NOTES.slice(0, 4).map((g, idx) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.75,
                        delay: idx * 0.07,
                        ease: EASE_OUT_EXPO,
                      }}
                      whileHover={{ x: 6 }}
                      onMouseEnter={() => soundFX.playBlip(560)}
                      onClick={() => openResumePage('playHistory')}
                      className="group min-h-[112px] py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/60 dark:hover:bg-[#1B1916] px-4 -mx-4 transition-colors cursor-pointer"
                    >
                      <div className="lg:col-span-2 flex items-center gap-3 text-xs font-mono text-[#888E94]">
                        <span className="text-[#C84B31] dark:text-[#E57052]">
                          LOG 0{idx + 1}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3" />
                          {g.badge}
                        </span>
                      </div>

                      <div className="lg:col-span-4 min-w-0">
                        <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                          {g.title}
                        </h3>
                        <div className="mt-1 text-xs font-mono text-[#888E94]">
                          {g.tag[locale]}
                        </div>
                      </div>

                      <div className="lg:col-span-5 text-sm text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[2.75rem]">
                        ─── {g.note[locale]}
                      </div>

                      <div className="lg:col-span-1 flex justify-end">
                        <ArrowRight className="w-4 h-4 text-[#888E94] group-hover:text-[#C84B31] group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* =========================================================
                CLOSING NOTE (#ending)
                (Inspired by haru2401game.github.io/portfolio/#ending)
               ========================================================= */}
            <EndingCreditsSection
              locale={locale}
              onScrollToSection={scrollToSection}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Floating Editorial 'Back to Top' Button — Appears after scrolling past Page 2 (#main-menu) */}
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
              setActiveNavSection('main-menu');
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
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group flex items-center gap-2.5 px-4 py-3 bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] border border-[#181A1C] dark:border-[#F2EFE9] hover:bg-[#C84B31] hover:border-[#C84B31] dark:hover:bg-[#E57052] dark:hover:border-[#E57052] dark:hover:text-white shadow-lg cursor-pointer select-none"
          >
            <ArrowUp className="w-4 h-4 text-[#E57052] dark:text-[#C84B31] group-hover:text-white transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="text-xs font-mono tracking-[0.18em] whitespace-nowrap">
              {locale === 'ja' ? 'TOP · 巻頭へ' : locale === 'zh' ? 'TOP · 返回卷首' : 'BACK TO TOP'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Editorial Colophon Footer (奥付 / COLOPHON) */}
      <footer className="relative z-10 py-12 border-t border-[#E2E0D8] dark:border-[#2E2924] text-xs text-[#888E94]">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-mono tracking-wider">
            COLOPHON // © {new Date().getFullYear()} {c.name} · OFFICIAL GAME DESIGN WORKS
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono hover:text-[#C84B31] dark:hover:text-[#E57052] transition-colors"
          >
            GitHub · {GITHUB_USERNAME}
          </a>
        </div>
      </footer>
    </div>
  );
}
