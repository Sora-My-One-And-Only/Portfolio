import type { Locale } from './interface-copy';

type Text = Record<Locale, string>;

/* ------------------------------------------------------------------
 * ゲーム分析・研究
 * 遊んだゲームだけでなく、ゲームに関わるもの（システム、UI、演出、
 * 他の作品や体験から得たヒントなど）の感想と分析をまとめるページです。
 *   category   … 何についての分析か（例: ゲーム / バトルシステム / UI）
 *   impression … 感じたこと
 *   points     … 分析（観察 → 仕組み → 自分の制作への応用 など自由に）
 * TODO: 実際の内容に置き換えてください。
 * ------------------------------------------------------------------ */

export interface AnalysisPoint {
  heading: Text;
  body: Text;
}

export interface GameAnalysis {
  id: string;
  title: string;
  category: Text;
  impression: Text;
  points: AnalysisPoint[];
}

const todoPoints: AnalysisPoint[] = [
  {
    heading: { ja: '観察', zh: '观察', en: 'Observation' },
    body: {
      ja: 'TODO: 気づいたこと',
      zh: 'TODO：注意到的现象',
      en: 'TODO: what you noticed',
    },
  },
  {
    heading: { ja: '仕組み', zh: '机制', en: 'Mechanism' },
    body: {
      ja: 'TODO: それを生んでいる仕組みの分析',
      zh: 'TODO：分析背后的机制',
      en: 'TODO: the mechanism behind it',
    },
  },
  {
    heading: { ja: '応用', zh: '应用', en: 'Takeaway' },
    body: {
      ja: 'TODO: 自分の制作にどう活かすか',
      zh: 'TODO：如何用到自己的制作中',
      en: 'TODO: how you would apply it',
    },
  },
];

export const GAME_ANALYSES: GameAnalysis[] = [
  {
    id: 'analysis-1',
    title: 'Title 1',
    category: { ja: 'ゲーム', zh: '游戏', en: 'Game' },
    impression: {
      ja: 'TODO: 感じたこと',
      zh: 'TODO：感想',
      en: 'TODO: your thoughts',
    },
    points: todoPoints,
  },
  {
    id: 'analysis-2',
    title: 'Title 2',
    category: { ja: 'バトルシステム', zh: '战斗系统', en: 'Combat system' },
    impression: {
      ja: 'TODO: 感じたこと',
      zh: 'TODO：感想',
      en: 'TODO: your thoughts',
    },
    points: todoPoints,
  },
  {
    id: 'analysis-3',
    title: 'Title 3',
    category: { ja: 'UI・演出', zh: 'UI 与演出', en: 'UI & presentation' },
    impression: {
      ja: 'TODO: 感じたこと',
      zh: 'TODO：感想',
      en: 'TODO: your thoughts',
    },
    points: todoPoints,
  },
];

export const ANALYSIS_COPY: Record<
  Locale,
  {
    chapter: string;
    title: string;
    lead: string;
    readAll: string;
    pageTag: string;
    pageTitle: string;
    pageLead: string;
    impression: string;
    analysis: string;
    back: string;
  }
> = {
  ja: {
    chapter: 'CHAPTER 03 // ANALYSIS',
    title: 'ゲーム分析・研究',
    lead: 'ゲームや、ゲームに関わるものについての感想と分析です。',
    readAll: '分析をすべて読む',
    pageTag: 'ANALYSIS',
    pageTitle: 'ゲーム分析・研究',
    pageLead: '感じたことを仕組みに分解して、自分の制作に活かします。',
    impression: '感想',
    analysis: '分析',
    back: 'トップへ戻る',
  },
  zh: {
    chapter: 'CHAPTER 03 // ANALYSIS',
    title: '游戏分析研究',
    lead: '关于游戏以及与游戏相关事物的感想和分析。',
    readAll: '阅读全部分析',
    pageTag: 'ANALYSIS',
    pageTitle: '游戏分析研究',
    pageLead: '把感受拆解成机制，再用到自己的制作中。',
    impression: '感想',
    analysis: '分析',
    back: '返回首页',
  },
  en: {
    chapter: 'CHAPTER 03 // ANALYSIS',
    title: 'Game Analysis',
    lead: 'Thoughts on and analysis of games, and of things related to games.',
    readAll: 'Read all analyses',
    pageTag: 'ANALYSIS',
    pageTitle: 'Game Analysis',
    pageLead: 'Breaking down what I noticed into mechanics I can use in my own work.',
    impression: 'Thoughts',
    analysis: 'Analysis',
    back: 'Back to portfolio',
  },
};
