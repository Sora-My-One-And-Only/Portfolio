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
    "id": "level-builder",
    "year": "2026",
    "category": {
      "ja": "レベル設計ツール",
      "zh": "关卡设计工具",
      "en": "Level design tool"
    },
    "tech": "TypeScript / Three.js",
    "duration": {
      "ja": "制作ツール",
      "zh": "制作工具",
      "en": "Production tool"
    },
    "title": {
      "ja": "Level Builder",
      "zh": "Level Builder",
      "en": "Level Builder"
    },
    "desc": {
      "ja": "ブラウザでグレーボックスを組み、視界やジャンプ軌道を確認しながらステージの動線を試せるツールです。",
      "zh": "在浏览器搭建白盒关卡，通过角色视野和跳跃轨迹验证关卡动线。",
      "en": "A browser-based greybox editor for checking sight lines, jump trajectories and level routes."
    },
    "highlight": {
      "ja": "3つのビューを連動させ、配置を確認する。",
      "zh": "通过联动的三个视口检查布局。",
      "en": "Inspect placement across three linked views."
    },
    "repoUrl": "https://github.com/Sora-My-One-And-Only/Level-Builder"
  },
  {
    "id": "gs-particle-studio",
    "year": "2026",
    "category": {
      "ja": "エフェクト制作ツール",
      "zh": "特效制作工具",
      "en": "Effects authoring tool"
    },
    "tech": "GLSL",
    "duration": {
      "ja": "制作ツール",
      "zh": "制作工具",
      "en": "Production tool"
    },
    "title": {
      "ja": "GSParticleStudio",
      "zh": "GSParticleStudio",
      "en": "GSParticleStudio"
    },
    "desc": {
      "ja": "魔法エフェクトを制作するためのパーティクルエディタです。複数のレイヤーを重ねて演出を組み立てます。",
      "zh": "用于制作魔法特效的粒子编辑器。通过叠加多个图层组合演出。",
      "en": "A particle editor for spell effects. It layers multiple elements to build an effect."
    },
    "highlight": {
      "ja": "魔法の演出をレイヤーに分ける。",
      "zh": "把魔法演出拆分成图层。",
      "en": "Separate a spell effect into layers."
    },
    "repoUrl": ""
  }
];
