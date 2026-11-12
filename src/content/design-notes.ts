import type { Locale } from './interface-copy';
import { LEVEL_BUILDER_REPOSITORY } from './works';

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
    "repoUrl": LEVEL_BUILDER_REPOSITORY
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

export const DESIGN_NOTES = [
  {
    "id": "spell-commands",
    "title": "ARCANE CHRONICLE / Combat",
    "badge": "Break",
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
    "badge": "3 platforms",
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
    "badge": "3 Views",
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
