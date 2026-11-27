import type { FC } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowUp } from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { EXTENDED_COPY } from '../content/section-copy';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * Closing credits (`#ending`)
 */
export const EndingCreditsSection: FC<{
  locale: Locale;
  onScrollToSection: (sectionId: string) => void;
}> = ({ locale, onScrollToSection }) => {
  const t = EXTENDED_COPY[locale];
  return (
    <section
      id="ending"
      className="py-14 lg:py-20 rule-top"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="p-8 sm:p-14 card-3d-console border-2 border-[var(--c-ink)] dark:border-[var(--c-ink)] space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--c-ink)] dark:bg-[var(--c-ink)] text-[var(--c-bg)] dark:text-[var(--c-bg)] text-xs font-mono tracking-[0.22em]">
            <Trophy className="w-3.5 h-3.5 text-[var(--c-accent)] dark:text-[var(--c-accent)]" />
            <span>{t.endingBanner}</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
            {t.endingTitle}
          </h2>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onScrollToSection('top')}
              className="inline-flex items-center gap-2 h-11 px-5 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[var(--c-accent)] dark:text-[var(--c-accent)]" />
              <span>{t.replayBtn}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
