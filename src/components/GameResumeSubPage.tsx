import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Gamepad2,
  Wrench,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { Locale } from '../data/i18n';
import { OTHER_WORKS_DATA } from '../data/gamePortfolioData';
import { soundFX } from '../utils/sound';

interface GameResumeSubPageProps {
  locale: Locale;
  initialSubTab?: 'playHistory' | 'otherWorks';
  onBackToMain: () => void;
}

export const GAMER_PLAY_LOGS = [
  {
    id: 'gh-slot-1',
    title: '[機能展示枠 01 / 功能展示位 01：ゲームタイトル / 游戏名称槽位 01]',
    hours: '[HOURS]',
    tag: {
      ja: '[機能展示枠：やり込み度・達成ランク・実績タグ 01]',
      zh: '[功能展示位：通关进度 / 成就段位标签槽位 01]',
      en: '[Functional Slot: Completion / Rank / Achievement Tag 01]',
    },
    note: {
      ja: '/* 機能展示位置注釈：該当タイトルのシステム逆解析・レベル構造研究メモを1〜2行で記載する枠です。 */',
      zh: '/* 功能展示位置注释：在此填写针对该游戏的机制拆解、关卡分析或数值研究简记（点击可进入完整别册子页面）。 */',
      en: '/* Functional Slot Annotation: Place a 1-2 line system deconstruction or level analysis note for Game 01 here. */',
    },
  },
  {
    id: 'gh-slot-2',
    title: '[機能展示枠 02 / 功能展示位 02：ゲームタイトル / 游戏名称槽位 02]',
    hours: '[HOURS]',
    tag: {
      ja: '[機能展示枠：やり込み度・達成ランク・実績タグ 02]',
      zh: '[功能展示位：通关进度 / 成就段位标签槽位 02]',
      en: '[Functional Slot: Completion / Rank / Achievement Tag 02]',
    },
    note: {
      ja: '/* 機能展示位置注釈：ゲーム 02 のシステム解析・設計考察メモ枠。 */',
      zh: '/* 功能展示位置注释：在此填写游戏 02 的机制拆解或手感研究笔记。 */',
      en: '/* Functional Slot Annotation: System deconstruction note slot for Game 02. */',
    },
  },
  {
    id: 'gh-slot-3',
    title: '[機能展示枠 03 / 功能展示位 03：ゲームタイトル / 游戏名称槽位 03]',
    hours: '[HOURS]',
    tag: {
      ja: '[機能展示枠：やり込み度・達成ランク・実績タグ 03]',
      zh: '[功能展示位：通关进度 / 成就段位标签槽位 03]',
      en: '[Functional Slot: Completion / Rank / Achievement Tag 03]',
    },
    note: {
      ja: '/* 機能展示位置注釈：ゲーム 03 のシステム解析・設計考察メモ枠。 */',
      zh: '/* 功能展示位置注释：在此填写游戏 03 的关卡动线或系统拆解笔记。 */',
      en: '/* Functional Slot Annotation: System deconstruction note slot for Game 03. */',
    },
  },
  {
    id: 'gh-slot-4',
    title: '[機能展示枠 04 / 功能展示位 04：ゲームタイトル / 游戏名称槽位 04]',
    hours: '[HOURS]',
    tag: {
      ja: '[機能展示枠：やり込み度・達成ランク・実績タグ 04]',
      zh: '[功能展示位：通关进度 / 成就段位标签槽位 04]',
      en: '[Functional Slot: Completion / Rank / Achievement Tag 04]',
    },
    note: {
      ja: '/* 機能展示位置注釈：ゲーム 04 のシステム解析・設計考察メモ枠。 */',
      zh: '/* 功能展示位置注释：在此填写游戏 04 的核心机制拆解笔记。 */',
      en: '/* Functional Slot Annotation: System deconstruction note slot for Game 04. */',
    },
  },
];

export const GameResumeSubPage: React.FC<GameResumeSubPageProps> = ({
  locale,
  initialSubTab = 'playHistory',
  onBackToMain,
}) => {
  const [subTab, setSubTab] = useState<'playHistory' | 'otherWorks'>(initialSubTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      key="resume-subpage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen py-16 sm:py-24"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between gap-4 pb-6 mb-12 border-b border-[#E2E0D8] dark:border-[#2E2924]">
          <button
            type="button"
            onClick={() => {
              soundFX.playBlip(480);
              onBackToMain();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
            <span>
              {locale === 'ja'
                ? '[機能ボタン：メインページへ戻る]'
                : locale === 'zh'
                ? '[功能按钮：返回主页面]'
                : '[Action Button: Back to Main Page]'}
            </span>
          </button>
        </div>

        <div className="mb-10">
          <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
            APPENDIX SUBPAGE // [機能展示位置：別冊アーカイブ・サブページ枠]
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight">
            {locale === 'ja'
              ? '[サブページ見出し：実機解析ノート ＆ 別冊サブ作品一覧枠]'
              : locale === 'zh'
              ? '[子页面标题槽位：深度游戏拆解笔记 & 别册作品列表]'
              : '[Subpage Heading Slot: Play Deconstructions & Appendix Works]'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setSubTab('playHistory');
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider cursor-pointer ${
              subTab === 'playHistory' ? 'btn-3d-primary' : 'btn-3d-secondary'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>
              {locale === 'ja'
                ? 'TAB 01 // [プレイ履歴・システム解析リスト枠]'
                : locale === 'zh'
                ? 'TAB 01 // [深度游戏履历与机制拆解列表槽位]'
                : 'TAB 01 // [Analytical Play Log List Slot]'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setSubTab('otherWorks');
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider cursor-pointer ${
              subTab === 'otherWorks' ? 'btn-3d-primary' : 'btn-3d-secondary'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>
              {locale === 'ja'
                ? 'TAB 02 // [別冊：サブ作品・GameJam・ツール枠]'
                : locale === 'zh'
                ? 'TAB 02 // [别册：小型原型 / Game Jam / 工具槽位]'
                : 'TAB 02 // [Appendix: Sub-Works & Tooling Slot]'}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {subTab === 'playHistory' ? (
            <motion.div
              key="playHistory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="border-t border-[#181A1C] dark:border-[#F2EFE9] divide-y divide-[#E2E0D8] dark:divide-[#2E2924]"
            >
              {GAMER_PLAY_LOGS.map((item, idx) => (
                <div
                  key={item.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline"
                >
                  <div className="lg:col-span-2 flex items-center gap-3 text-xs font-mono text-[#888E94]">
                    <span className="text-[#C84B31] dark:text-[#E57052]">SLOT 0{idx + 1}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {item.hours}
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <div className="mt-1 text-xs font-mono text-[#C84B31] dark:text-[#E57052]">
                      {item.tag[locale]}
                    </div>
                  </div>

                  <div className="lg:col-span-6 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    {item.note[locale]}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="otherWorks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#181A1C] dark:border-[#F2EFE9]"
            >
              {OTHER_WORKS_DATA.map((ow, idx) => (
                <article
                  key={ow.id}
                  className="p-6 flex flex-col justify-between card-3d-console"
                >
                  <div>
                    <div className="text-xs font-mono text-[#C84B31] dark:text-[#E57052] mb-2">
                      APPENDIX 0{idx + 1} · {ow.category[locale]} · {ow.year}
                    </div>
                    <h3 className="font-editorial text-xl font-semibold leading-snug">
                      {ow.title[locale]}
                    </h3>
                    <p className="mt-3 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                      {ow.desc[locale]}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E0D8] dark:border-[#2E2924]">
                    <a
                      href={ow.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] hover:text-[#C84B31] dark:hover:text-[#E57052] transition-colors"
                    >
                      <span>[EXTERNAL REPO LINK SLOT]</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
