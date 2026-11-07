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
    id: 'gh-1',
    title: 'SEKIRO: SHADOWS DIE TWICE',
    hours: '340h',
    tag: {
      ja: '全実績 · 苦難＋鐘鬼 ボス連戦ノーダメ',
      zh: '全成就 · 双难连战全 Boss 无伤',
      en: '100% · Charmless No-Hit Boss Rush',
    },
    note: {
      ja: '弾き受付（30F→7F減衰）と体幹削り計算式をフレーム単位で逆解析。',
      zh: '逐帧拆解招架窗口衰减（30F→7F）与架势槽恢复公式。',
      en: 'Reverse-engineered deflect window decay (30F to 7F) and posture math.',
    },
  },
  {
    id: 'gh-2',
    title: 'STREET FIGHTER 6',
    hours: '520h',
    tag: {
      ja: 'MASTERランク · 全キャラ確定反撃フレーム把握',
      zh: 'MASTER 大师段位 · 全角色确反帧差研究',
      en: 'MASTER Rank · Full Roster Frame Data',
    },
    note: {
      ja: '発生・持続・硬直差と先行入力バッファ(8F)のレスポンス設計を研究。',
      zh: '研究 1/60s 发生/持续/被防帧差与预输入缓冲手感。',
      en: 'Studied 1/60s frame advantage and input buffer responsiveness.',
    },
  },
  {
    id: 'gh-3',
    title: 'ELDEN RING / DARK SOULS',
    hours: '680h',
    tag: {
      ja: 'プラチナ獲得 · 15ダンジョン高低差断面図作成',
      zh: '全白金 · 测绘 15 座立体城塞高低差动线图',
      en: 'Platinum · Mapped 15 Multi-Tier Dungeons',
    },
    note: {
      ja: '30度仰角ランドマーク誘導と一方通行ショートカットのループ構造を解析。',
      zh: '提炼 30° 仰角视觉地标引导与单向升降梯捷径回路。',
      en: 'Analyzed 30° landmark sightlines and vertical shortcut loops.',
    },
  },
  {
    id: 'gh-4',
    title: 'SUPER MARIO BROS. 3 / ロックマンX',
    hours: '260h',
    tag: {
      ja: '古典40ステージを方眼紙＆JSONデータベース化',
      zh: '40 个经典关卡“起承转合”方格纸数字化建档',
      en: '40 Classic Stages Digitized on Grid Paper',
    },
    note: {
      ja: 'テキスト説明ゼロでギミックを教える「安全な初見→応用→転」の配置を研究。',
      zh: '拆解零文字弹窗教学的“安全初见 → 进阶 → 变奏”地形法则。',
      en: 'Deconstructed wordless tutorials using safe intro, twist, and mastery.',
    },
  },
  {
    id: 'gh-5',
    title: 'MONSTER HUNTER: WORLD / ICEBORNE',
    hours: '600h',
    tag: {
      ja: 'ミラボレアス・アルバトリオン 太刀/大剣ソロ討伐',
      zh: '黑龙与煌黑龙 太刀/大剑单人无猫车讨伐',
      en: 'Solo Fatalis & Alatreon (LS / GS)',
    },
    note: {
      ja: '距離別・角度別モンスター行動抽選テーブルと部位破壊ダウン報酬を研究。',
      zh: '分析大型怪物距离环/扇区出招权重表与部位破坏正反馈。',
      en: 'Analyzed boss distance-ring move weights and part-break stagger rewards.',
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
              {locale === 'ja' ? '目次・設定集へ戻る' : locale === 'zh' ? '返回设定集目录' : 'Back to Archive Index'}
            </span>
          </button>
        </div>

        <div className="mb-10">
          <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
            APPENDIX // ARCHIVAL NOTES & PROTOTYPES
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight">
            {locale === 'ja'
              ? '実機解析ノート ＆ 別冊作品録'
              : locale === 'zh'
              ? '深度游戏拆解笔记 & 别册作品录'
              : 'Analytical Play Log & Appendix Works'}
          </h1>
        </div>

        <div className="flex items-center gap-3 mb-12">
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
              {locale === 'ja' ? '01 // やり込み・逆解析ノート' : locale === 'zh' ? '01 // 深度游玩与逆向拆解笔记' : '01 // Analytical Play History'}
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
              {locale === 'ja' ? '02 // 別冊：サブ作品・GameJam' : locale === 'zh' ? '02 // 别册：更多作品与工具' : '02 // Appendix: Other Works'}
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
                    <span className="text-[#C84B31] dark:text-[#E57052]">ARCHIVE 0{idx + 1}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {item.hours}
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <div className="mt-1 text-xs font-mono text-[#C84B31] dark:text-[#E57052]">
                      {item.tag[locale]}
                    </div>
                  </div>

                  <div className="lg:col-span-6 text-sm sm:text-base text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    ─── {item.note[locale]}
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
                    <h3 className="font-editorial text-2xl font-semibold leading-snug">
                      {ow.title[locale]}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
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
                      <span>GITHUB ARCHIVE</span>
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
