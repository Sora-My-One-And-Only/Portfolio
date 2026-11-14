import type { FC } from 'react';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Compass,
  Clock,
  Trophy,
  ExternalLink,
  ArrowRight,
  ArrowUp,
  Wrench,
  Users,
  Layers,
} from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { EXTENDED_COPY } from '../content/section-copy';
import { PROJECTS_DATA, type ProjectSpec } from '../content/works';
import { soundFX } from '../utils/sound';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface QuickGuideProps {
  locale: Locale;
  onOpenSpec: (proj: ProjectSpec, mode: 'video' | 'playable') => void;
}

/**
 * 1. Quick Guide (`#quick-guide`)
 */
export const QuickGuideSection: FC<QuickGuideProps> = ({
  locale,
  onOpenSpec,
}) => {
  const t = EXTENDED_COPY[locale];

  return (
    <section
      id="quick-guide"
      className="py-20 lg:py-28 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-14">
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

          {/* 制作の概要と代表作 */}
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
            <div className="lg:col-span-12 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924]">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.worksLabel}
              </div>
              <div className="space-y-2.5">
                {PROJECTS_DATA.slice(0, 2).map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onOpenSpec(proj, 'video')}
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
                      <ArrowRight className="w-3 h-3" />
                      <span>{{ ja: '詳細', zh: '详情', en: 'Details' }[locale]}</span>
                    </span>
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
 * 2. Play Games & Web Portals Section (`#play-games`)
 */
export const PlayGamesPortalSection: FC<{ locale: Locale }> = ({ locale }) => {
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

        {/* 体験版とソースコード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {t.platforms.map((pf, idx) => (
            <motion.a
              key={pf.id}
              href={pf.url}
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
      </div>
    </section>
  );
};

/**
 * 3. What I Can Do in Game Production (`#what-i-can-do`)
 */
export const WhatICanDoSection: FC<{ locale: Locale }> = ({ locale }) => {
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
 * 4. Closing Note (`#ending`)
 */
export const EndingCreditsSection: FC<{
  locale: Locale;
  onScrollToSection: (sectionId: string) => void;
}> = ({ locale, onScrollToSection }) => {
  const t = EXTENDED_COPY[locale];
  return (
    <section
      id="ending"
      className="py-14 lg:py-20 border-t border-[#181A1C] dark:border-[#F2EFE9]"
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
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onScrollToSection('top')}
              className="inline-flex items-center gap-2 h-11 px-5 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
              <span>{t.replayBtn}</span>
            </button>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
