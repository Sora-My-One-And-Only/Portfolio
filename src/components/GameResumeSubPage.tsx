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
    "id": "spell-commands",
    "title": "ARCANE CHRONICLE / Combat",
    "hours": "Break",
    "tag": {
      "ja": "バトル設計",
      "zh": "战斗设计",
      "en": "Combat design"
    },
    "note": {
      "ja": "敵の動きを見て、いつ魔法を使うかを選ぶアクションを目指しました。小さな隙には短いコマンドを差し込み、長いコマンドを使うなら、近接攻撃で先に詠唱の時間を作ります。魔法コマンドと火竜戦の仕様整理に携わりました。",
      "zh": "设计目标是让玩家在交战中判断何时施法。短指令能抓住小破绽，长指令则需要用近战主动创造咏唱机会。我参与了魔法指令与火龙战的规格整理。",
      "en": "The player chooses when to cast while reading the enemy. Short commands fit into brief openings. Longer commands reward using melee attacks to create a casting window. I contributed to the specifications for spell commands and the fire dragon encounter."
    }
  },
  {
    "id": "fire-dragon",
    "title": "ARCANE CHRONICLE / Fire Dragon",
    "hours": "3",
    "tag": {
      "ja": "レベル設計",
      "zh": "关卡设计",
      "en": "Level design"
    },
    "note": {
      "ja": "火竜が足場を崩すたびに移動先を選ぶ。最後の崩壊に先立ち、中央の足場がせり上がる。",
      "zh": "火龙摧毁平台后重新选择落脚点。最后一次崩塌前，中心平台会升起。",
      "en": "Choose a new foothold when the fire dragon destroys a platform. The central platform rises before the final collapse."
    }
  },
  {
    "id": "greybox-tools",
    "title": "Level Builder",
    "hours": "3 Views",
    "tag": {
      "ja": "ツール制作",
      "zh": "工具制作",
      "en": "Tool development"
    },
    "note": {
      "ja": "次の足場が見えるか、そこまで跳べるか。ステージを組む途中で、視点を切り替えたり実際に動いたりしながら確認できるようにしました。",
      "zh": "在搭建关卡的过程中，就能检查下一处平台是否看得见、跳得到，并实际操作角色走一遍路线。",
      "en": "The editor lets you check whether a player can see or reach the next platform while the level is still being laid out."
    }
  }
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
            APPENDIX
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight">
            {locale === 'ja'
              ? '制作ノート・ツール作品'
              : locale === 'zh'
              ? '制作笔记与工具作品'
              : 'Design Notes & Tools'}
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
                ? '設計ノート'
                : locale === 'zh'
                ? '设计笔记'
                : 'Design Notes'}
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
                ? 'ツール作品'
                : locale === 'zh'
                ? '工具作品'
                : 'Tool Projects'}
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
                    <span className="text-[#C84B31] dark:text-[#E57052]">WORK 0{idx + 1}</span>
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
                      href={ow.repoUrl || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] hover:text-[#C84B31] dark:hover:text-[#E57052] transition-colors"
                    >
                      <span>GitHub</span>
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
