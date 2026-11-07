import { Locale } from './i18n';

export interface OtherWorkItem {
  id: string;
  year: string;
  category: Record<Locale, string>;
  tech: string;
  duration: Record<Locale, string>;
  title: Record<Locale, string>;
  desc: Record<Locale, string>;
  highlight: Record<Locale, string>;
  repoUrl: string;
}

export const OTHER_WORKS_DATA: OtherWorkItem[] = [
  {
    id: 'ow-slot-1',
    year: 'YYYY.MM',
    category: {
      ja: '[機能展示枠：サブ作品カテゴリ 01]',
      zh: '[功能展示位：别册作品分类标签 01]',
      en: '[Functional Slot: Sub-Work Category 01]',
    },
    tech: '[TECH STACK / ENGINE 01]',
    duration: {
      ja: '[制作期間・体制枠 01]',
      zh: '[开发周期与分工槽位 01]',
      en: '[Duration & Team Scope Slot 01]',
    },
    title: {
      ja: '[機能展示位置：別冊・サブ作品タイトル枠 01]',
      zh: '[功能展示位置：别册/小型原型作品标题槽位 01]',
      en: '[Functional Slot: Appendix / Mini-Prototype Title 01]',
    },
    desc: {
      ja: '/* 機能展示位置注釈：Game Jam作品・技術試作・企画支援ツールなど、代表作以外のサブ作品 01 の説明文を配置する枠です。 */',
      zh: '/* 功能展示位置注释：用于展示代表作之外的 Game Jam 作品、技术实验原型或小工具 01 的简介文本。 */',
      en: '/* Functional Slot Annotation: Description slot for Sub-Work / Game Jam / Tool Prototype 01. */',
    },
    highlight: {
      ja: '[機能展示枠：サブ作品 01 のアピールポイント注釈]',
      zh: '[功能展示位：别册作品 01 核心亮点注释]',
      en: '[Functional Slot: Sub-Work 01 Key Highlight Note]',
    },
    repoUrl: 'https://github.com',
  },
  {
    id: 'ow-slot-2',
    year: 'YYYY.MM',
    category: {
      ja: '[機能展示枠：サブ作品カテゴリ 02]',
      zh: '[功能展示位：别册作品分类标签 02]',
      en: '[Functional Slot: Sub-Work Category 02]',
    },
    tech: '[TECH STACK / ENGINE 02]',
    duration: {
      ja: '[制作期間・体制枠 02]',
      zh: '[开发周期与分工槽位 02]',
      en: '[Duration & Team Scope Slot 02]',
    },
    title: {
      ja: '[機能展示位置：別冊・サブ作品タイトル枠 02]',
      zh: '[功能展示位置：别册/小型原型作品标题槽位 02]',
      en: '[Functional Slot: Appendix / Mini-Prototype Title 02]',
    },
    desc: {
      ja: '/* 機能展示位置注釈：サブ作品 02 の概要・担当箇所・成果などを記述するテキスト枠です。 */',
      zh: '/* 功能展示位置注释：用于展示别册作品 02 的概要、负责模块与验证成果的文本槽位。 */',
      en: '/* Functional Slot Annotation: Description slot for Sub-Work / Game Jam / Tool Prototype 02. */',
    },
    highlight: {
      ja: '[機能展示枠：サブ作品 02 のアピールポイント注釈]',
      zh: '[功能展示位：别册作品 02 核心亮点注释]',
      en: '[Functional Slot: Sub-Work 02 Key Highlight Note]',
    },
    repoUrl: 'https://github.com',
  },
  {
    id: 'ow-slot-3',
    year: 'YYYY.MM',
    category: {
      ja: '[機能展示枠：サブ作品カテゴリ 03]',
      zh: '[功能展示位：别册作品分类标签 03]',
      en: '[Functional Slot: Sub-Work Category 03]',
    },
    tech: '[TECH STACK / ENGINE 03]',
    duration: {
      ja: '[制作期間・体制枠 03]',
      zh: '[开发周期与分工槽位 03]',
      en: '[Duration & Team Scope Slot 03]',
    },
    title: {
      ja: '[機能展示位置：別冊・サブ作品タイトル枠 03]',
      zh: '[功能展示位置：别册/小型原型作品标题槽位 03]',
      en: '[Functional Slot: Appendix / Mini-Prototype Title 03]',
    },
    desc: {
      ja: '/* 機能展示位置注釈：サブ作品 03 の概要・担当箇所・成果などを記述するテキスト枠です。 */',
      zh: '/* 功能展示位置注释：用于展示别册作品 03 的概要、负责模块与验证成果的文本槽位。 */',
      en: '/* Functional Slot Annotation: Description slot for Sub-Work / Game Jam / Tool Prototype 03. */',
    },
    highlight: {
      ja: '[機能展示枠：サブ作品 03 のアピールポイント注釈]',
      zh: '[功能展示位：别册作品 03 核心亮点注释]',
      en: '[Functional Slot: Sub-Work 03 Key Highlight Note]',
    },
    repoUrl: 'https://github.com',
  },
];
