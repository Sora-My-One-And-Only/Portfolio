import { useEffect, type FC } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { ANALYSIS_COPY, GAME_ANALYSES } from '../content/game-analysis';
import { soundFX } from '../utils/sound';
import { SubPageFrame } from './ProfileSection';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * トップページの「ゲーム分析・研究」章 (`#analysis`)
 */
export const GameAnalysisSection: FC<{
  locale: Locale;
  onOpen: (analysisId?: string) => void;
}> = ({ locale, onOpen }) => {
  const t = ANALYSIS_COPY[locale];

  return (
    <section
      id="analysis"
      className="py-28 lg:py-40 border-t border-[var(--c-rule)] dark:border-[var(--c-rule)]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-8 rule-bottom"
        >
          <div className="min-w-0 max-w-3xl">
            <div className="text-xs font-mono tracking-[0.24em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4 editorial-callout-line">
              {t.chapter}
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.12]">
              {t.title}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
              {t.lead}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpen()}
            className="inline-flex items-center justify-between gap-2.5 h-11 min-w-[220px] px-5 text-xs font-mono tracking-wider btn-3d-secondary self-start lg:self-auto cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>{t.readAll}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </motion.div>

        <div className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)] border-b border-[var(--c-rule)] dark:border-[var(--c-rule)]">
          {GAME_ANALYSES.map((g, idx) => (
            <motion.button
              key={g.id}
              type="button"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx * 0.07, ease: EASE_OUT_EXPO }}
              onMouseEnter={() => soundFX.playBlip(560)}
              onClick={() => onOpen(g.id)}
              className="group w-full text-left min-h-[112px] py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center hover:bg-white/60 dark:hover:bg-[var(--c-surface)] px-4 -mx-4 transition-colors cursor-pointer"
            >
              <div className="lg:col-span-2 text-xs font-mono text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="lg:col-span-4 min-w-0">
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight group-hover:text-[var(--c-accent)] dark:group-hover:text-[var(--c-accent)] transition-colors">
                  {g.title}
                </h3>
                <div className="mt-1 text-xs font-mono text-[var(--c-ink-3)]">
                  {g.category[locale]}
                </div>
              </div>

              <p className="lg:col-span-5 text-sm text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed line-clamp-2">
                {g.impression[locale]}
              </p>

              <div className="hidden lg:flex lg:col-span-1 justify-end">
                <ArrowRight className="w-4 h-4 text-[var(--c-ink-3)] group-hover:text-[var(--c-accent)] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * 「ゲーム分析・研究」の専用ページ
 */
export const GameAnalysisPage: FC<{
  locale: Locale;
  focusId?: string;
  onBackToMain: () => void;
}> = ({ locale, focusId, onBackToMain }) => {
  const t = ANALYSIS_COPY[locale];

  useEffect(() => {
    const el = focusId ? document.getElementById(`analysis-${focusId}`) : null;
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80 });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [focusId]);

  return (
    <SubPageFrame
      backLabel={t.back}
      onBack={onBackToMain}
      tag={t.pageTag}
      title={t.pageTitle}
      lead={t.pageLead}
    >
      <div className="space-y-10">
        {GAME_ANALYSES.map((g, idx) => (
          <article
            key={g.id}
            id={`analysis-${g.id}`}
            className={`p-7 sm:p-10 card-3d-console scroll-mt-24 ${
              g.id === focusId ? 'ring-1 ring-[var(--c-accent)] dark:ring-[var(--c-accent)]' : ''
            }`}
          >
            <div className="pb-6 mb-6 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)]">
              <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                ANALYSIS {String(idx + 1).padStart(2, '0')} // {g.category[locale]}
              </div>
              <h2 className="mt-1 font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
                {g.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div className="text-xs font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-3">
                  ── {t.impression}
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
                  {g.impression[locale]}
                </p>
              </div>

              <div className="lg:col-span-7 lg:border-l border-[var(--c-rule)] dark:border-[var(--c-rule)] lg:pl-10">
                <div className="text-xs font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4">
                  ── {t.analysis}
                </div>
                <div className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
                  {g.points.map((p, pIdx) => (
                    <div key={pIdx} className="py-4 first:pt-0 last:pb-0">
                      <div className="text-xs font-mono text-[var(--c-ink-3)]">
                        [{String(pIdx + 1).padStart(2, '0')}] {p.heading[locale]}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed">{p.body[locale]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SubPageFrame>
  );
};
