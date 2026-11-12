import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Gamepad2,
  Compass,
  Clock,
  Trophy,
  Sparkles,
  BookOpen,
  ExternalLink,
  Play,
  ArrowRight,
  ArrowUp,
  Heart,
  Mail,
  Users,
  Wrench,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { EXTENDED_COPY } from '../content/section-copy';
import { PROJECTS_DATA, type ProjectSpec } from '../content/works';
import { soundFX } from '../utils/sound';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface ExtendedSectionsProps {
  locale: Locale;
  githubUsername: string;
  onScrollToSection: (sectionId: string) => void;
  onOpenSpec: (proj: ProjectSpec, mode: 'video' | 'playable') => void;
}

/**
 * 1. Purpose-Driven Mode Selector + 30-Second Recruiter Quick Guide (`#quick-guide`)
 */
export const QuickRecruiterGuideSection: React.FC<ExtendedSectionsProps> = ({
  locale,
  onScrollToSection,
  onOpenSpec,
}) => {
  const t = EXTENDED_COPY[locale];
  const modeIcons = [Briefcase, Wrench, Gamepad2];

  return (
    <section
      id="quick-guide"
      className="py-20 lg:py-28 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-14">
        {/* SELECT MODE: 3 Purpose-Driven Jump Cards */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] editorial-callout-line">
              {t.modeSelectTag}
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-semibold">
              {t.modeSelectTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.modes.map((m, idx) => {
              const Icon = modeIcons[idx] || Compass;
              return (
                <button
                  key={m.id}
                  type="button"
                  onMouseEnter={() => soundFX.playBlip(560 + idx * 30)}
                  onClick={() => onScrollToSection(m.target)}
                  className="group p-5 sm:p-6 text-left card-3d-console flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 shrink-0 border border-[#E2E0D8] dark:border-[#2E2924] bg-[#EFEDE6] dark:bg-[#131210] flex items-center justify-center text-[#C84B31] dark:text-[#E57052] group-hover:bg-[#C84B31] group-hover:text-white dark:group-hover:bg-[#E57052] dark:group-hover:text-[#131210] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono tracking-[0.2em] text-[#888E94]">
                        0{idx + 1} // {m.badge}
                      </div>
                      <div className="mt-1 font-editorial text-lg sm:text-xl font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {m.title}
                      </div>
                      <div className="mt-1 text-xs font-mono text-[#555B61] dark:text-[#B0A89E]">
                        {m.sub}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#888E94] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 30-SECOND RECRUITER SUMMARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="p-7 sm:p-10 card-3d-console border-t-2 border-t-[#181A1C] dark:border-t-[#F2EFE9]"
        >
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2E0D8] dark:border-[#2E2924]">
            <div>
              <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052]">
                {t.quickGuideTag}
              </div>
              <h2 className="mt-1 font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
                {t.quickGuideTitle}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#E2E0D8] dark:border-[#2E2924] bg-[#EFEDE6] dark:bg-[#131210] text-xs font-mono text-[#C84B31] dark:text-[#E57052]">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.quickTimer}</span>
            </div>
          </div>

          {/* 4-Quadrant Quick Dossier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 01. Target Role */}
            <div className="lg:col-span-6 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-2">
                {t.quickItems.roleLabel}
              </div>
              <div className="font-editorial text-xl sm:text-2xl font-semibold">
                {t.quickItems.roleMain}
              </div>
              <p className="mt-2 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
                {t.quickItems.roleSub}
              </p>
            </div>

            {/* 02. Core Tech & Design Tags */}
            <div className="lg:col-span-6 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.skillLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {t.quickItems.skillTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] text-[#181A1C] dark:text-[#F2EFE9]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 03. Flagship Works Quick Jump */}
            <div className="lg:col-span-7 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924]">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.worksLabel}
              </div>
              <div className="space-y-2.5">
                {PROJECTS_DATA.slice(0, 2).map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onOpenSpec(proj, proj.playUrl ? 'playable' : 'video')}
                    className="w-full p-3 bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#C84B31] dark:hover:border-[#E57052] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="font-editorial text-base sm:text-lg font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {proj.title[locale]}
                      </div>
                      <div className="text-xs font-mono text-[#555B61] dark:text-[#B0A89E]">
                        {proj.roleTag[locale]} · {proj.engineTag}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C84B31] dark:text-[#E57052] shrink-0">
                      <Play className="w-3 h-3" />
                      <span>PLAY</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 04. Achievement Numbers Counter */}
            <div className="lg:col-span-5 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.statsLabel}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {t.quickItems.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] text-center"
                  >
                    <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#C84B31] dark:text-[#E57052] tabular-nums">
                      {st.val}
                    </div>
                    <div className="mt-0.5 text-[11px] font-mono text-[#555B61] dark:text-[#B0A89E]">
                      {st.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-[#E2E0D8] dark:border-[#2E2924] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
              {t.quickContactPrompt}
            </p>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onScrollToSection('play-games')}
                className="inline-flex items-center gap-2 h-10 px-4 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
                <span>{t.quickPlayBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('contact')}
                className="inline-flex items-center gap-2 h-10 px-5 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.quickMailBtn}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * 2. Play Games & Web Portals Section (`#play-games`)
 */
export const PlayGamesPortalSection: React.FC<ExtendedSectionsProps> = ({
  locale,
  githubUsername,
  onOpenSpec,
}) => {
  const t = EXTENDED_COPY[locale];

  return (
    <section
      id="play-games"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
            {t.playGamesChapter}
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
            {t.playGamesTitle}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
            {t.playGamesLead}
          </p>
        </motion.div>

        {/* 3 External Game Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
          {t.platforms.map((pf, idx) => (
            <motion.a
              key={pf.id}
              href={
                pf.id === 'freegame'
                  ? `https://github.com/${githubUsername}`
                  : pf.url
              }
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
              onMouseEnter={() => soundFX.playBlip(580 + idx * 25)}
              onClick={() => soundFX.playSelect()}
              className="group p-6 sm:p-7 card-3d-console flex flex-col justify-between min-h-[228px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono tracking-[0.18em] text-[#C84B31] dark:text-[#E57052] mb-3">
                  <span>{pf.code}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                  {pf.name}
                </h3>
                <div className="mt-2 inline-block px-2 py-0.5 text-[10px] font-mono bg-[#EFEDE6] dark:bg-[#131210] text-[#555B61] dark:text-[#B0A89E] border border-[#E2E0D8] dark:border-[#2E2924]">
                  {pf.badge}
                </div>
                <p className="mt-4 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                  {pf.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E0D8] dark:border-[#2E2924] flex items-center justify-between text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052]">
                <span>{pf.cta}</span>
                <Gamepad2 className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Featured Browser Game & 60FPS Spec Sandbox Portal */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="p-7 sm:p-10 card-3d-console border-l-2 border-l-[#C84B31] dark:border-l-[#E57052]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.browserLabTag}</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.22]">
                {t.browserLabTitle}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                {t.browserLabDesc}
              </p>
              <ul className="space-y-2 pt-2">
                {t.browserLabFeatures.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right 6 Cols: Direct 1-Click Stage Launchers for All 4 Playable Works */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-mono tracking-wider text-[#888E94] mb-2">
                {t.browserLabStageSelect}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PROJECTS_DATA.map((proj, idx) => (
                  <button
                    key={proj.id}
                    type="button"
                    onMouseEnter={() => soundFX.playBlip(600 + idx * 25)}
                    onClick={() => onOpenSpec(proj, proj.playUrl ? 'playable' : 'video')}
                    className="group p-4 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#C84B31] dark:hover:border-[#E57052] text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#C84B31] dark:text-[#E57052]">
                        <span>STAGE 0{idx + 1} // {proj.code}</span>
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                      <div className="mt-1.5 font-editorial text-sm sm:text-base font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {proj.title[locale]}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#555B61] dark:text-[#B0A89E] flex items-center justify-between pt-2 border-t border-[#E2E0D8] dark:border-[#2E2924]">
                      <span>{proj.roleTag[locale]}</span>
                      <span className="text-[#C84B31] dark:text-[#E57052] shrink-0">DETAILS →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * 3. What I Can Do in Game Production (`#what-i-can-do`)
 */
export const WhatICanDoSection: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = EXTENDED_COPY[locale];
  const icons = [Gamepad2, Compass, Layers, Users];

  return (
    <section
      id="what-i-can-do"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
            {t.whatICanDoChapter}
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
            {t.whatICanDoTitle}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
            {t.whatICanDoLead}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.capabilities.map((cap, idx) => {
            const Icon = icons[idx] || Wrench;
            return (
              <motion.div
                key={cap.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                className="p-7 sm:p-8 card-3d-console flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                      {cap.num} // {cap.category}
                    </span>
                    <Icon className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0" />
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight leading-[1.28]">
                    {cap.title}
                  </h3>

                  <p className="mt-3.5 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    {cap.desc}
                  </p>

                  <div className="mt-4 p-3 bg-[#F7F6F2] dark:bg-[#131210] border-l-2 border-l-[#C84B31] dark:border-l-[#E57052] text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9]">
                    {cap.example}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E0D8] dark:border-[#2E2924] flex flex-wrap gap-2">
                  {cap.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[11px] font-mono bg-[#EFEDE6] dark:bg-[#131210] text-[#555B61] dark:text-[#B0A89E] border border-[#E2E0D8] dark:border-[#2E2924]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/**
 * 4. Production Activity Timeline & Game Design Blog Section (`#timeline`)
 */
export const TimelineAndBlogSection: React.FC<{
  locale: Locale;
  githubUsername: string;
}> = ({ locale, githubUsername }) => {
  const t = EXTENDED_COPY[locale];

  return (
    <section
      id="timeline"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-24">
        {/* Part A: Stage-Select Production Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mb-14 pb-8 border-b border-[#181A1C] dark:border-[#F2EFE9] flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            <div>
              <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
                {t.timelineChapter}
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
                {t.timelineTitle}
              </h2>
            </div>
            <div className="text-xs font-mono tracking-[0.18em] text-[#888E94]">
              {t.timelineSub}
            </div>
          </motion.div>

          <div className="relative border-l-2 border-[#C84B31]/40 dark:border-[#E57052]/40 ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-8">
            {t.timelineNodes.map((node, idx) => (
              <motion.div
                key={node.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.07, ease: EASE_OUT_EXPO }}
                className="relative p-6 sm:p-7 card-3d-console"
              >
                {/* Stage Node Marker */}
                <span className="absolute -left-[33px] sm:-left-[49px] top-7 w-4 h-4 bg-[#C84B31] dark:bg-[#E57052] border-4 border-[#F7F6F2] dark:border-[#131210]" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="font-semibold text-[#C84B31] dark:text-[#E57052]">
                      {node.stage}
                    </span>
                    <span className="text-[#888E94]">// {node.period}</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210]">
                    {node.badge}
                  </span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight">
                  {node.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                  {node.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part B: Game Design Notes & Analytical Blog */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E2E0D8] dark:border-[#2E2924]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052] mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.blogHeader}</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] max-w-3xl">
                {t.blogDesc}
              </p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFX.playSelect()}
              className="inline-flex items-center gap-2 h-10 px-5 text-xs font-mono tracking-wider btn-3d-secondary self-start lg:self-auto shrink-0 whitespace-nowrap"
            >
              <span>
                {locale === 'ja'
                  ? 'GitHubを見る ↗'
                  : locale === 'zh'
                  ? '查看 GitHub ↗'
                  : '[Action Button: Open External Blog ↗]'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {t.blogArticles.map((art, i) => (
              <a
                key={i}
                href={art.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundFX.playBlip(600 + i * 20)}
                onClick={() => soundFX.playSelect()}
                className="group p-6 card-3d-console flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#888E94] mb-3">
                    <span>{art.date}</span>
                    <span className="text-[#C84B31] dark:text-[#E57052]">{art.tag}</span>
                  </div>
                  <h4 className="font-editorial text-lg sm:text-xl font-semibold leading-[1.32] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                    {art.title}
                  </h4>
                  <p className="mt-3 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E0D8] dark:border-[#2E2924] text-xs font-mono text-[#C84B31] dark:text-[#E57052] flex items-center justify-between">
                  <span>README</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * 5. Ending Credits & All Stages Clear Section (`#ending`)
 */
export const EndingCreditsSection: React.FC<{
  locale: Locale;
  onScrollToSection: (sectionId: string) => void;
}> = ({ locale, onScrollToSection }) => {
  const t = EXTENDED_COPY[locale];
  const [kudosCount, setKudosCount] = useState<number>(0);
  const [kudosClicked, setKudosClicked] = useState<boolean>(false);

  const handleSendKudos = () => {
    soundFX.playPageTurn();
    setKudosCount((prev) => prev + 1);
    setKudosClicked(true);
  };

  return (
    <section
      id="ending"
      className="py-24 lg:py-32 border-t border-[#181A1C] dark:border-[#F2EFE9]"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="p-8 sm:p-14 card-3d-console border-2 border-[#181A1C] dark:border-[#F2EFE9] space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] text-xs font-mono tracking-[0.22em]">
            <Trophy className="w-3.5 h-3.5 text-[#E57052] dark:text-[#C84B31]" />
            <span>{t.endingBanner}</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
              {t.endingTitle}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] max-w-2xl mx-auto leading-relaxed">
              {t.endingLead}
            </p>
          </div>

          {/* Editorial Cast & Credits Roll */}
          <div className="py-6 border-y border-[#E2E0D8] dark:border-[#2E2924] grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {t.credits.map((cr, idx) => (
              <div
                key={idx}
                className={idx === t.credits.length - 1 ? 'sm:col-span-2 pt-2 border-t border-dotted border-[#E2E0D8] dark:border-[#2E2924]' : ''}
              >
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                  {cr.role}
                </div>
                <div className="mt-1 font-editorial text-base sm:text-lg font-semibold">
                  {cr.name}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Kudos / Like Button + Replay / Contact Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleSendKudos}
              className={`inline-flex items-center gap-2.5 h-11 px-6 text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                kudosClicked
                  ? 'bg-[#C84B31] dark:bg-[#E57052] text-white border-[#C84B31] dark:border-[#E57052]'
                  : 'bg-[#F7F6F2] dark:bg-[#131210] text-[#181A1C] dark:text-[#F2EFE9] border-[#C84B31] dark:border-[#E57052] hover:bg-[#C84B31] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${kudosClicked ? 'fill-current' : ''}`} />
              <span>{kudosClicked ? t.kudosSent : t.kudosBtn}</span>
              <span className="px-2 py-0.5 bg-black/15 text-[11px] tabular-nums">
                {kudosCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onScrollToSection('top')}
              className="inline-flex items-center gap-2 h-11 px-5 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
              <span>{t.replayBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onScrollToSection('contact')}
              className="inline-flex items-center gap-2 h-11 px-6 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.contactBtn}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
