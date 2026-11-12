import type { Locale } from './interface-copy';

export interface ProjectSpec {
  id: string;
  code: string;
  span: 'wide' | 'normal';
  image: string;
  roleTag: Record<Locale, string>;
  engineTag: string;
  year: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  designIntent: Record<Locale, string>;
  keyMechanics: Record<Locale, string[]>;
  metrics: {
    label: Record<Locale, string>;
    value: string;
  }[];
  spellCommands: {
    name: Record<Locale, string>;
    input: string;
    element: string;
  }[];
  repoName: string;
  playUrl?: string;
}

const WORK_ILLUSTRATIONS = {
  combatSystem: new URL(
    '../assets/illustrations/combat-design.jpg',
    import.meta.url
  ).href,
  levelTopography: new URL(
    '../assets/illustrations/level-design.jpg',
    import.meta.url
  ).href,
  bossAiBehavior: new URL(
    '../assets/illustrations/boss-behavior.jpg',
    import.meta.url
  ).href,
};

export const LEVEL_BUILDER_URL = 'https://sora-my-one-and-only.github.io/Level-Builder/';
export const LEVEL_BUILDER_REPOSITORY = 'https://github.com/Sora-My-One-And-Only/Level-Builder';

export const PROJECTS_DATA: ProjectSpec[] = [
  {
    "id": "arcane-chronicle",
    "code": "ARCANE CHRONICLE",
    "span": "wide",
    "image": WORK_ILLUSTRATIONS.combatSystem,
    "roleTag": {
      "ja": "ゲーム企画・チーム制作",
      "zh": "游戏策划 · 团队制作",
      "en": "Game design · Team project"
    },
    "engineTag": "Unity / C#",
    "year": "2026",
    "title": {
      "ja": "ルミアの冒険譚",
      "zh": "ルミアの冒険譚",
      "en": "Lumia’s Adventure"
    },
    "summary": {
      "ja": "戦闘中にコマンドを入力して魔法を詠唱する3Dアクションゲーム。剣で魔力を回復し、敵をブレイクさせた隙に強力な魔法を狙います。",
      "zh": "在战斗中输入指令、咏唱魔法的 3D 动作游戏。近战恢复魔力，打出 Break 后就有机会释放强力魔法。",
      "en": "A 3D action game about entering commands to cast spells in combat. Sword attacks restore mana and build Break, creating time for more powerful spells."
    },
    "designIntent": {
      "ja": "敵の動きを見て、いつ魔法を使うかを選ぶアクションを目指しました。小さな隙には短いコマンドを差し込み、長いコマンドを使うなら、近接攻撃で先に詠唱の時間を作ります。魔法コマンドと火竜戦の仕様整理に携わりました。",
      "zh": "设计目标是让玩家在交战中判断何时施法。短指令能抓住小破绽，长指令则需要用近战主动创造咏唱机会。我参与了魔法指令与火龙战的规格整理。",
      "en": "The player chooses when to cast while reading the enemy. Short commands fit into brief openings. Longer commands reward using melee attacks to create a casting window. I contributed to the specifications for spell commands and the fire dragon encounter."
    },
    "keyMechanics": {
      "ja": [
        "剣で魔力を回復し、ブレイクを狙う。",
        "短いコマンドと長いコマンドを、敵の隙に応じて使い分ける。",
        "火竜が足場を崩すたびに移動先を選ぶ。最後の崩壊に先立ち、中央の足場がせり上がる。"
      ],
      "zh": [
        "用剑攻击恢复魔力并积累 Break。",
        "根据敌人的破绽选择短指令或长指令。",
        "火龙摧毁平台后重新选择落脚点。最后一次崩塌前，中心平台会升起。"
      ],
      "en": [
        "Restore mana and build Break through melee attacks.",
        "Choose a short or long spell command based on the available opening.",
        "Choose a new foothold when the fire dragon destroys a platform. The central platform rises before the final collapse."
      ]
    },
    "metrics": [
      {
        "label": {
          "ja": "ジャンル",
          "zh": "类型",
          "en": "Genre"
        },
        "value": "3D Action"
      },
      {
        "label": {
          "ja": "開発状況",
          "zh": "开发阶段",
          "en": "Status"
        },
        "value": "In development"
      },
      {
        "label": {
          "ja": "火竜戦の外周足場",
          "zh": "火龙战外围平台",
          "en": "Outer boss platforms"
        },
        "value": "3"
      }
    ],
    "spellCommands": [
      {
        "name": {
          "ja": "火球",
          "zh": "火球",
          "en": "Fireball"
        },
        "input": "↑ → + □",
        "element": "Fire"
      },
      {
        "name": {
          "ja": "強化火球",
          "zh": "强化火球",
          "en": "Enhanced fireball"
        },
        "input": "↑ → ↑ → + □",
        "element": "Fire"
      },
      {
        "name": {
          "ja": "貫通火球",
          "zh": "贯穿火球",
          "en": "Piercing fireball"
        },
        "input": "↑ → → + □",
        "element": "Fire"
      }
    ],
    "repoName": ""
  },
  {
    "id": "level-builder",
    "code": "LEVEL BUILDER",
    "span": "normal",
    "image": WORK_ILLUSTRATIONS.levelTopography,
    "roleTag": {
      "ja": "レベル設計ツール",
      "zh": "关卡设计工具",
      "en": "Level design tool"
    },
    "engineTag": "TypeScript / Three.js",
    "year": "2026",
    "title": {
      "ja": "Level Builder",
      "zh": "Level Builder",
      "en": "Level Builder"
    },
    "summary": {
      "ja": "ブラウザでグレーボックスを組み、視界やジャンプ軌道を確認しながらステージの動線を試せるツールです。",
      "zh": "在浏览器搭建白盒关卡，通过角色视野和跳跃轨迹验证关卡动线。",
      "en": "A browser-based greybox editor for checking sight lines, jump trajectories and level routes."
    },
    "designIntent": {
      "ja": "次の足場が見えるか、そこまで跳べるか。ステージを組む途中で、視点を切り替えたり実際に動いたりしながら確認できるようにしました。",
      "zh": "在搭建关卡的过程中，就能检查下一处平台是否看得见、跳得到，并实际操作角色走一遍路线。",
      "en": "The editor lets you check whether a player can see or reach the next platform while the level is still being laid out."
    },
    "keyMechanics": {
      "ja": [
        "3つのビューを連動させ、配置を確認する。",
        "プレイヤーの視界とジャンプ軌道を表示する。",
        "ブラウザ内で動線を試し、Unity C#、glTF、OBJに書き出す。"
      ],
      "zh": [
        "通过联动的三个视口检查布局。",
        "显示角色视野与跳跃轨迹。",
        "在浏览器中试玩动线，支持导出 Unity C#、glTF、OBJ。"
      ],
      "en": [
        "Inspect placement across three linked views.",
        "Visualize player sight lines and jump trajectories.",
        "Playtest routes in the browser and export to Unity C#, glTF or OBJ."
      ]
    },
    "metrics": [
      {
        "label": {
          "ja": "動作環境",
          "zh": "运行环境",
          "en": "Platform"
        },
        "value": "Web"
      },
      {
        "label": {
          "ja": "連動ビュー",
          "zh": "联动视口",
          "en": "Linked views"
        },
        "value": "3"
      },
      {
        "label": {
          "ja": "試遊",
          "zh": "在线体验",
          "en": "Availability"
        },
        "value": "Online"
      }
    ],
    "spellCommands": [],
    "repoName": "Level-Builder",
    "playUrl": LEVEL_BUILDER_URL
  },
  {
    "id": "gs-particle-studio",
    "code": "GS PARTICLE STUDIO",
    "span": "normal",
    "image": WORK_ILLUSTRATIONS.bossAiBehavior,
    "roleTag": {
      "ja": "エフェクト制作ツール",
      "zh": "特效制作工具",
      "en": "Effects authoring tool"
    },
    "engineTag": "GLSL",
    "year": "2026",
    "title": {
      "ja": "GSParticleStudio",
      "zh": "GSParticleStudio",
      "en": "GSParticleStudio"
    },
    "summary": {
      "ja": "魔法エフェクトを制作するためのパーティクルエディタです。複数のレイヤーを重ねて演出を組み立てます。",
      "zh": "用于制作魔法特效的粒子编辑器。通过叠加多个图层组合演出。",
      "en": "A particle editor for spell effects. It layers multiple elements to build an effect."
    },
    "designIntent": {
      "ja": "魔法の発動から消えるまでの変化を、複数のレイヤーに分けて調整できるようにしました。",
      "zh": "把魔法从发动到消散的演出拆成多个图层，便于分别调整。",
      "en": "Separate a spell’s buildup, burst and fade into layers that can be adjusted independently."
    },
    "keyMechanics": {
      "ja": [
        "魔法の演出をレイヤーに分ける。",
        "複数のレイヤーを重ねて一つのエフェクトにする。",
        "専用ランタイムで再生する。"
      ],
      "zh": [
        "把魔法演出拆分成图层。",
        "叠加多个图层组合成一个特效。",
        "通过专用运行时播放。"
      ],
      "en": [
        "Separate a spell effect into layers.",
        "Combine those layers into one effect.",
        "Play it through a dedicated runtime."
      ]
    },
    "metrics": [
      {
        "label": {
          "ja": "用途",
          "zh": "用途",
          "en": "Purpose"
        },
        "value": "VFX"
      },
      {
        "label": {
          "ja": "構成",
          "zh": "构成",
          "en": "Authoring"
        },
        "value": "Layers"
      },
      {
        "label": {
          "ja": "公開状況",
          "zh": "公开状态",
          "en": "Availability"
        },
        "value": "Private"
      }
    ],
    "spellCommands": [],
    "repoName": ""
  }
];

type WorkDesignNote = {
  party: Record<Locale, string>;
  challenge: Record<Locale, string>;
  solution: Record<Locale, string>;
  result: Record<Locale, string>;
};

export const WORK_DESIGN_NOTES: Record<string, WorkDesignNote> = {
  "arcane-chronicle": {
    "party": {
      "ja": "チーム制作 / ゲーム企画",
      "zh": "团队制作 / 游戏策划",
      "en": "Team project / Game design"
    },
    "challenge": {
      "ja": "戦闘中に、長いコマンドを使う判断と時間を作る。",
      "zh": "让玩家在战斗中判断何时使用长指令，并主动争取输入时间。",
      "en": "Give the player a reason and a window to enter a long spell command."
    },
    "solution": {
      "ja": "剣で攻めて詠唱の時間を作る。近接攻撃と魔法の役割を一つの戦闘にまとめます。",
      "zh": "用近战主动创造咏唱时间，让剑与魔法在战斗中各有作用。",
      "en": "Use sword attacks to create a spellcasting window, giving melee and magic complementary roles."
    },
    "result": {
      "ja": "短い隙には短い魔法を、ブレイク後には強力な魔法を狙えます。",
      "zh": "小破绽可用短指令应对，Break 后可尝试强力魔法。",
      "en": "Short openings suit short commands, while Break gives time for stronger spells."
    }
  },
  "level-builder": {
    "party": {
      "ja": "ブラウザ向けレベル設計ツール",
      "zh": "浏览器关卡设计工具",
      "en": "Browser level design tool"
    },
    "challenge": {
      "ja": "配置を考えながら、視界や移動可能な範囲を確認する。",
      "zh": "在搭建布局的同时确认玩家视野和可到达范围。",
      "en": "Check sight and reach while the layout is still taking shape."
    },
    "solution": {
      "ja": "足場の配置をグレーボックスで組み、どこが見えるか、どこまで移動できるかを確認します。",
      "zh": "先搭建白盒，确认玩家站在这里能看到哪里、能移动到哪里。",
      "en": "Use greyboxes to test where a player can see and move from a given point."
    },
    "result": {
      "ja": "3ビューとブラウザ試遊で配置と動線を確認できます。",
      "zh": "三个联动视口与浏览器试玩可用于验证布局和动线。",
      "en": "Three linked views and browser playtesting support layout checks."
    }
  },
  "gs-particle-studio": {
    "party": {
      "ja": "パーティクルエディタ",
      "zh": "粒子特效编辑器",
      "en": "Particle editor"
    },
    "challenge": {
      "ja": "発動から消失までの演出を個別に調整する。",
      "zh": "分别调整魔法从发动到消失的各段演出。",
      "en": "Adjust the buildup, burst and fade as individual elements."
    },
    "solution": {
      "ja": "演出を複数のレイヤーに分けて構成する。",
      "zh": "将演出分成多个可单独调整的图层。",
      "en": "Build the effect from individually editable layers."
    },
    "result": {
      "ja": "重ねたレイヤーを専用ランタイムで再生できます。",
      "zh": "组合后的特效可在专用运行时播放。",
      "en": "Layered effects play back in a dedicated runtime."
    }
  }
};
