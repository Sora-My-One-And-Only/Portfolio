import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Play,
} from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { PROJECTS_DATA, type ProjectSpec } from '../content/works';
import { soundFX } from '../utils/sound';

interface WorkDetailSubPageProps {
  project: ProjectSpec;
  locale: Locale;
  githubUsername: string;
  startPlaying?: boolean;
  onBackToMain: () => void;
  onSelectProject: (proj: ProjectSpec) => void;
}

type DocTab = 'overview' | 'specTable';

const PLAY_COPY = {
  ja: { play: 'ブラウザで遊ぶ', newTab: '新しいタブで開く', soon: 'ブラウザ版は準備中です', role: '担当' },
  zh: { play: '网页版试玩', newTab: '在新标签页打开', soon: '网页版制作中', role: '担当' },
  en: { play: 'Play in browser', newTab: 'Open in new tab', soon: 'Browser build coming soon', role: 'My role' },
};

/**
 * 作品のイメージ図と、ブラウザ版（playUrl がある作品のみ）
 */
const WorkPlayStage: React.FC<{
  project: ProjectSpec;
  locale: Locale;
  startPlaying: boolean;
}> = ({ project, locale, startPlaying }) => {
  const t = PLAY_COPY[locale];
  const [playing, setPlaying] = useState<boolean>(startPlaying && !!project.playUrl);

  useEffect(() => {
    setPlaying(startPlaying && !!project.playUrl);
  }, [project.id, startPlaying, project.playUrl]);

  return (
    <div className="mb-12">
      <div className="relative aspect-video w-full bg-[var(--c-ink)] overflow-hidden border border-[var(--c-rule)] dark:border-[var(--c-rule)]">
        {playing && project.playUrl ? (
          <iframe
            src={project.playUrl}
            title={project.title[locale]}
            className="absolute inset-0 w-full h-full"
            allow="fullscreen; gamepad; autoplay"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={project.image}
              alt={project.title[locale]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {project.playUrl ? (
              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setPlaying(true);
                }}
                className="absolute inset-0 flex items-center justify-center bg-[#131210]/45 hover:bg-[#131210]/30 transition-colors cursor-pointer group"
              >
                <span className="inline-flex items-center gap-2.5 px-6 h-12 text-sm font-mono tracking-wider btn-3d-primary">
                  <Play className="w-4 h-4" />
                  {t.play}
                </span>
              </button>
            ) : (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#181A1C]/80 backdrop-blur-sm text-[11px] font-mono tracking-[0.12em] text-[#F7F6F2]">
                {t.soon}
              </div>
            )}
          </>
        )}
      </div>

      {project.playUrl && (
        <div className="mt-3 flex justify-end">
          <a
            href={project.playUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] hover:text-[var(--c-accent)] dark:hover:text-[var(--c-accent)] transition-colors"
          >
            <span>{t.newTab}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};

export const WorkDetailSubPage: React.FC<WorkDetailSubPageProps> = ({
  project,
  locale,
  githubUsername,
  startPlaying = false,
  onBackToMain,
  onSelectProject,
}) => {
  const [tab, setTab] = useState<DocTab>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setTab('overview');
  }, [project.id]);

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === project.id);
  const prevProject =
    PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

  return (
    <motion.div
      key={`work-subpage-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen py-16 sm:py-24"
    >
      <div className="max-w-6xl mx-auto px-6 sm:py-0 sm:px-12">
        {/* Top Archive Folio Bar: Back Button + Repo Link */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-12 border-b border-[var(--c-rule)] dark:border-[var(--c-rule)]">
          <button
            type="button"
            onClick={() => {
              soundFX.playPageTurn();
              onBackToMain();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--c-accent)] dark:text-[var(--c-accent)]" />
            <span>
              {locale === 'ja'
                ? 'トップへ戻る'
                : locale === 'zh'
                ? '返回首页'
                : 'Back to portfolio'}
            </span>
          </button>

          {project.repoName && (
          <a
            href={`https://github.com/${githubUsername}/${project.repoName}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] hover:text-[var(--c-accent)] dark:hover:text-[var(--c-accent)] btn-3d-secondary"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          )}
        </div>

        {/* Asymmetric Editorial Spread Header: Title + Telemetry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 mb-12 rule-bottom">
          <div className="lg:col-span-8">
            <div className="text-xs font-mono tracking-[0.22em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-3 editorial-callout-line">
              {project.code} · {project.roleTag[locale]} · {project.engineTag}
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.14]">
              {project.title[locale]}
            </h1>
            <p className="mt-5 text-sm sm:text-base font-mono text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)] leading-relaxed">
              {project.summary[locale]}
            </p>
            <div className="mt-5 p-4 bg-[var(--c-inset)]/85 dark:bg-[var(--c-surface)]/90 border-l-2 border-l-[var(--c-accent)] dark:border-l-[var(--c-accent)]">
              <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-1">
                {PLAY_COPY[locale].role}
              </div>
              <p className="text-sm leading-relaxed">{project.role[locale]}</p>
            </div>
          </div>

          <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[var(--c-rule)] dark:border-[var(--c-rule)] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
            <div className="text-[11px] font-mono tracking-[0.2em] text-[var(--c-ink-3)] mb-4">
              ── WORK OVERVIEW
            </div>
            <div className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)] font-mono tabular-nums">
              {project.metrics.map((m, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-baseline justify-between gap-4">
                  <span className="text-xs text-[var(--c-ink-3)]">0{i + 1}. {m.label[locale]}</span>
                  <span className="text-sm sm:text-base font-medium text-[var(--c-accent)] dark:text-[var(--c-accent)]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* イメージ図とブラウザ版 */}
        <WorkPlayStage
          project={project}
          locale={locale}
          startPlaying={startPlaying}
        />

        {/* Editorial Section Switcher */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pt-4">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setTab('overview');
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider cursor-pointer ${
              tab === 'overview' ? 'btn-3d-primary' : 'btn-3d-secondary'
            }`}
          >
            <span>
              {locale === 'ja'
                ? '企画意図・主な仕組み'
                : locale === 'zh'
                ? '企划意图与核心机制'
                : 'Design Intent & Mechanics'}
            </span>
          </button>

          {project.spellCommands.length > 0 && (
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setTab('specTable');
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider cursor-pointer ${
              tab === 'specTable' ? 'btn-3d-primary' : 'btn-3d-secondary'
            }`}
          >
            <span>
              {locale === 'ja'
                ? '魔法コマンド'
                : locale === 'zh'
                ? '魔法指令'
                : 'Spell Commands'}
            </span>
          </button>
          )}
        </div>

        {/* Annotated Document Body */}
        <div className="py-10 rule-top rule-bottom">
          <AnimatePresence mode="wait">
            {tab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-5">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-3">
                    ── {locale === 'ja' ? '企画意図' : locale === 'zh' ? '企划意图' : 'DESIGN INTENT'}
                  </div>
                  <p className="text-xs sm:text-sm font-mono leading-relaxed text-[var(--c-ink-2)] dark:text-[var(--c-ink-2)]">
                    {project.designIntent[locale]}
                  </p>
                </div>

                <div className="lg:col-span-7 lg:border-l border-[var(--c-rule)] dark:border-[var(--c-rule)] lg:pl-10">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--c-accent)] dark:text-[var(--c-accent)] mb-4">
                    ── {locale === 'ja' ? '主な仕組み' : locale === 'zh' ? '核心机制' : 'CORE MECHANICS'}
                  </div>
                  <div className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
                    {project.keyMechanics[locale].map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-baseline gap-4 text-xs sm:text-sm font-mono">
                        <span className="text-xs font-mono text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0">
                          [0{idx + 1}]
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="specTable"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono tabular-nums">
                    <thead>
                      <tr className="border-b border-[var(--c-ink)] dark:border-[var(--c-ink)] text-[var(--c-ink-3)]">
                        <th className="py-3.5 px-4">{ { ja: '魔法', zh: '魔法', en: 'Spell' }[locale] }</th>
                        <th className="py-3.5 px-4">{ { ja: 'コマンド', zh: '指令', en: 'Command' }[locale] }</th>
                        <th className="py-3.5 px-4">{ { ja: '属性', zh: '属性', en: 'Element' }[locale] }</th>



                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--c-rule)] dark:divide-[var(--c-rule)]">
                      {project.spellCommands.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-4 px-4 font-medium">
                            {row.name[locale]}
                          </td>
                          <td className="py-4 px-4 text-[var(--c-accent)] dark:text-[var(--c-accent)]">{row.input}</td>
                          <td className="py-4 px-4 font-medium">{row.element}</td>



                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prev / Next Plate Navigation */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onSelectProject(prevProject);
            }}
            className="text-left p-5 btn-3d-secondary flex items-center gap-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-[var(--c-ink-3)]">PREVIOUS // {prevProject.code}</div>
              <div className="font-editorial text-lg font-semibold mt-0.5">{prevProject.title[locale]}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onSelectProject(nextProject);
            }}
            className="text-right p-5 btn-3d-secondary flex items-center justify-end gap-4 cursor-pointer"
          >
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-[var(--c-ink-3)]">NEXT // {nextProject.code}</div>
              <div className="font-editorial text-lg font-semibold mt-0.5">{nextProject.title[locale]}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--c-accent)] dark:text-[var(--c-accent)] shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
