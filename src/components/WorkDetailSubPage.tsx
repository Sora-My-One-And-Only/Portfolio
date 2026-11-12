import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Locale, PROJECTS_DATA, ProjectSpec } from '../data/i18n';
import { soundFX } from '../utils/sound';
import { InteractiveGameStage } from './InteractiveGameStage';

interface WorkDetailSubPageProps {
  project: ProjectSpec;
  locale: Locale;
  githubUsername: string;
  initialStageMode?: 'video' | 'playable';
  onBackToMain: () => void;
  onSelectProject: (proj: ProjectSpec) => void;
}

type DocTab = 'overview' | 'specTable';

export const WorkDetailSubPage: React.FC<WorkDetailSubPageProps> = ({
  project,
  locale,
  githubUsername,
  initialStageMode = 'video',
  onBackToMain,
  onSelectProject,
}) => {
  const [tab, setTab] = useState<DocTab>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="flex items-center justify-between gap-4 pb-6 mb-12 border-b border-[#E2E0D8] dark:border-[#2E2924]">
          <button
            type="button"
            onClick={() => {
              soundFX.playPageTurn();
              onBackToMain();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
            <span>
              {locale === 'ja'
                ? 'トップへ戻る'
                : locale === 'zh'
                ? '返回首页'
                : 'Back to portfolio'}
            </span>
          </button>

          {(project.playUrl || project.repoName) && (
          <a
            href={project.playUrl || `https://github.com/${githubUsername}/${project.repoName}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] hover:text-[#C84B31] dark:hover:text-[#E57052] btn-3d-secondary"
          >
            <span>{project.playUrl ? { ja: 'ブラウザで試す', zh: '在线体验', en: 'Try in browser' }[locale] : 'GitHub'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          )}
        </div>

        {/* Asymmetric Editorial Spread Header: Title + Telemetry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 mb-12 border-b border-[#181A1C] dark:border-[#F2EFE9]">
          <div className="lg:col-span-8">
            <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
              {project.code} · {project.roleTag[locale]} · {project.engineTag}
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.14]">
              {project.title[locale]}
            </h1>
            <p className="mt-5 text-sm sm:text-base font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
              {project.summary[locale]}
            </p>
          </div>

          <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#E2E0D8] dark:border-[#2E2924] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
            <div className="text-[11px] font-mono tracking-[0.2em] text-[#888E94] mb-4">
              ── WORK OVERVIEW
            </div>
            <div className="divide-y divide-[#E2E0D8] dark:divide-[#2E2924] font-mono tabular-nums">
              {project.metrics.map((m, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-baseline justify-between gap-4">
                  <span className="text-xs text-[#888E94]">0{i + 1}. {m.label[locale]}</span>
                  <span className="text-sm sm:text-base font-medium text-[#C84B31] dark:text-[#E57052]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Interactive Video / GIF Showcase & Instant Playable Web Game Stage */}
        <InteractiveGameStage
          project={project}
          locale={locale}
          initialMode={initialStageMode}
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

          {project.frameTable.length > 0 && (
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
        <div className="py-10 border-t border-b border-[#181A1C] dark:border-[#F2EFE9]">
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
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#C84B31] dark:text-[#E57052] mb-3">
                    ── {locale === 'ja' ? '企画意図' : locale === 'zh' ? '企划意图' : 'DESIGN INTENT'}
                  </div>
                  <p className="text-xs sm:text-sm font-mono leading-relaxed text-[#555B61] dark:text-[#B0A89E]">
                    {project.designIntent[locale]}
                  </p>
                </div>

                <div className="lg:col-span-7 lg:border-l border-[#E2E0D8] dark:border-[#2E2924] lg:pl-10">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#C84B31] dark:text-[#E57052] mb-4">
                    ── {locale === 'ja' ? '主な仕組み' : locale === 'zh' ? '核心机制' : 'CORE MECHANICS'}
                  </div>
                  <div className="divide-y divide-[#E2E0D8] dark:divide-[#2E2924]">
                    {project.keyMechanics[locale].map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-baseline gap-4 text-xs sm:text-sm font-mono">
                        <span className="text-xs font-mono text-[#C84B31] dark:text-[#E57052] shrink-0">
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
                      <tr className="border-b border-[#181A1C] dark:border-[#F2EFE9] text-[#888E94]">
                        <th className="py-3.5 px-4">{ { ja: '魔法', zh: '魔法', en: 'Spell' }[locale] }</th>
                        <th className="py-3.5 px-4">{ { ja: 'コマンド', zh: '指令', en: 'Command' }[locale] }</th>
                        <th className="py-3.5 px-4">{ { ja: '属性', zh: '属性', en: 'Element' }[locale] }</th>



                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E0D8] dark:divide-[#2E2924]">
                      {project.frameTable.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-4 px-4 font-medium">
                            {row.moveName[locale]}
                          </td>
                          <td className="py-4 px-4 text-[#C84B31] dark:text-[#E57052]">{row.startup}</td>
                          <td className="py-4 px-4 font-medium">{row.active}</td>



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
            <ArrowLeft className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-[#888E94]">PREVIOUS // {prevProject.code}</div>
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
              <div className="text-[11px] font-mono text-[#888E94]">NEXT // {nextProject.code}</div>
              <div className="font-editorial text-lg font-semibold mt-0.5">{nextProject.title[locale]}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
