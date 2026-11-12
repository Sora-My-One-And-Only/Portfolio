import { LEVEL_BUILDER_REPOSITORY, LEVEL_BUILDER_URL } from './works';

export const EXTENDED_COPY = {
  "ja": {
    "modeSelectTag": "閲覧メニュー",
    "modeSelectTitle": "見たい内容を選ぶ",
    "modes": [
      {
        "id": "recruit",
        "target": "quick-guide",
        "badge": "MODE 01 // RECRUITER",
        "title": "採用担当の方へ",
        "sub": "概要と代表作を短く確認できます。"
      },
      {
        "id": "gamedev",
        "target": "what-i-can-do",
        "badge": "MODE 02 // COLLABORATOR",
        "title": "制作や協業に関心のある方へ",
        "sub": "制作で取り組んでいることを紹介します。"
      },
      {
        "id": "play",
        "target": "play-games",
        "badge": "MODE 03 // PLAYABLE",
        "title": "公開作品を試したい方へ",
        "sub": "ブラウザで公開ツールを体験できます。"
      }
    ],
    "quickGuideTag": "QUICK GUIDE",
    "quickGuideTitle": "30秒でわかるSora",
    "quickTimer": "0:30",
    "quickItems": {
      "roleLabel": "志望職種",
      "roleMain": "ゲームプランナー志望",
      "roleSub": "バトルデザイン・レベルデザイン",
      "skillLabel": "制作環境",
      "skillTags": [
        "Unity",
        "C#",
        "Combat Design",
        "Level Design"
      ],
      "worksLabel": "まず見てほしい作品",
      "statsLabel": "掲載内容",
      "stats": [
        {
          "val": "3",
          "unit": "掲載作品"
        },
        {
          "val": "1",
          "unit": "ゲーム"
        },
        {
          "val": "2",
          "unit": "制作ツール"
        },
        {
          "val": "3",
          "unit": "表示言語"
        }
      ]
    },
    "quickContactPrompt": "代表作の設計と、公開ツールを確認できます。",
    "quickPlayBtn": "オンライン体験へ",
    "quickMailBtn": "連絡先へ",
    "playGamesChapter": "CHAPTER 02B // TRY ONLINE",
    "playGamesTitle": "オンライン体験",
    "playGamesLead": "Level Builderをブラウザで試せます。",
    "platforms": [
      {
        "id": "public-0",
        "code": "PORTAL 01",
        "name": "Level Builder",
        "badge": "公開ツール",
        "desc": "視界やジャンプ軌道を確認しながら、グレーボックスの動線を試せます。",
        "url": LEVEL_BUILDER_URL,
        "cta": "ブラウザで試す"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "ソースコード",
        "desc": "レベルデザインツールのソースコードと説明を公開しています。",
        "url": LEVEL_BUILDER_REPOSITORY,
        "cta": "ソースを見る"
      },
      {
        "id": "public-2",
        "code": "PORTAL 03",
        "name": "Sora / GitHub",
        "badge": "プロフィール",
        "desc": "制作活動と公開リポジトリをまとめています。",
        "url": "https://github.com/Sora-My-One-And-Only",
        "cta": "プロフィールを見る"
      }
    ],
    "browserLabTag": "作品プレビュー",
    "browserLabTitle": "作品詳細と関連資料",
    "browserLabDesc": "気になった作品を選んで、企画意図や仕組みを確認できます。",
    "browserLabFeatures": [],
    "browserLabStageSelect": "作品を選ぶ",
    "whatICanDoChapter": "CHAPTER 03B // CAPABILITIES",
    "whatICanDoTitle": "制作でできること",
    "whatICanDoLead": "取り組んでいる設計と制作を、実例とあわせて紹介します。",
    "capabilities": [
      {
        "num": "CAPABILITY 01",
        "category": "バトル設計",
        "title": "近接と魔法の役割をつなぐ",
        "desc": "近接で魔力を回復し、ブレイク後に長い詠唱を狙う流れを考えます。",
        "example": "魔法コマンドとブレイク",
        "tags": [
          "Unity",
          "Break"
        ]
      },
      {
        "num": "CAPABILITY 02",
        "category": "レベル設計",
        "title": "動線を試せる形にする",
        "desc": "グレーボックスで足場と視界を確認し、プレイヤーの進み方を検討します。",
        "example": "火竜戦の足場変化",
        "tags": [
          "Greybox",
          "Playtest"
        ]
      },
      {
        "num": "CAPABILITY 03",
        "category": "ツール制作",
        "title": "検証を助けるツールを作る",
        "desc": "視界、ジャンプ軌道、エフェクトなどを試せるツールを制作します。",
        "example": "Level Builder / GSParticleStudio",
        "tags": [
          "Web",
          "VFX"
        ]
      },
      {
        "num": "CAPABILITY 04",
        "category": "チーム制作",
        "title": "仕様をチームで共有する",
        "desc": "操作や敵の挙動を整理し、チームで使える仕様に落とし込みます。",
        "example": "『ルミアの冒険譚』の制作",
        "tags": [
          "Unity",
          "Design Spec"
        ]
      }
    ],
    "timelineChapter": "CHAPTER 04B // PROJECTS",
    "timelineTitle": "制作の記録",
    "timelineSub": "制作テーマ",
    "timelineNodes": [
      {
        "stage": "WORK 01",
        "period": "2026",
        "badge": "チーム制作",
        "title": "ルミアの冒険譚",
        "desc": "近接で魔力を回復し、ブレイク後に長い詠唱を狙う流れを考えます。"
      },
      {
        "stage": "WORK 02",
        "period": "2026",
        "badge": "ツール制作",
        "title": "Level Builder",
        "desc": "視界、ジャンプ軌道、エフェクトなどを試せるツールを制作します。"
      },
      {
        "stage": "WORK 03",
        "period": "2026",
        "badge": "ツール制作",
        "title": "GSParticleStudio",
        "desc": "視界、ジャンプ軌道、エフェクトなどを試せるツールを制作します。"
      }
    ],
    "blogHeader": "公開ドキュメント",
    "blogDesc": "レベルデザインツールのソースコードと説明を公開しています。",
    "blogArticles": [
      {
        "date": "2026",
        "tag": "LEVEL DESIGN",
        "title": "Level Builder",
        "summary": "レベルデザインツールのソースコードと説明を公開しています。",
        "url": LEVEL_BUILDER_REPOSITORY + '#readme'
      }
    ],
    "endingBanner": "CREDITS",
    "endingTitle": "ご覧いただきありがとうございます",
    "endingLead": "作品や制作活動については、GitHubの公開ページもご覧ください。",
    "credits": [
      {
        "role": "制作名義",
        "name": "Sora"
      },
      {
        "role": "サイト制作",
        "name": "React / TypeScript"
      },
      {
        "role": "掲載作品",
        "name": "ARCANE CHRONICLE / Level Builder / GSParticleStudio"
      }
    ],
    "kudosBtn": "応援する",
    "kudosSent": "ありがとうございます",
    "replayBtn": "先頭へ",
    "contactBtn": "連絡先へ"
  },
  "zh": {
    "modeSelectTag": "浏览导航",
    "modeSelectTitle": "选择想看的内容",
    "modes": [
      {
        "id": "recruit",
        "target": "quick-guide",
        "badge": "MODE 01 // RECRUITER",
        "title": "招聘方入口",
        "sub": "快速浏览个人概况与代表作。"
      },
      {
        "id": "gamedev",
        "target": "what-i-can-do",
        "badge": "MODE 02 // COLLABORATOR",
        "title": "制作与协作",
        "sub": "查看我在设计和制作中的实践。"
      },
      {
        "id": "play",
        "target": "play-games",
        "badge": "MODE 03 // PLAYABLE",
        "title": "体验公开作品",
        "sub": "在浏览器体验公开工具。"
      }
    ],
    "quickGuideTag": "QUICK GUIDE",
    "quickGuideTitle": "30 秒了解 Sora",
    "quickTimer": "0:30",
    "quickItems": {
      "roleLabel": "目标岗位",
      "roleMain": "游戏策划求职",
      "roleSub": "战斗设计 · 关卡设计",
      "skillLabel": "制作环境",
      "skillTags": [
        "Unity",
        "C#",
        "Combat Design",
        "Level Design"
      ],
      "worksLabel": "优先看这两项",
      "statsLabel": "当前展示",
      "stats": [
        {
          "val": "3",
          "unit": "展示作品"
        },
        {
          "val": "1",
          "unit": "游戏"
        },
        {
          "val": "2",
          "unit": "制作工具"
        },
        {
          "val": "3",
          "unit": "语言版本"
        }
      ]
    },
    "quickContactPrompt": "查看代表作的设计和公开工具。",
    "quickPlayBtn": "前往在线体验",
    "quickMailBtn": "查看联系方式",
    "playGamesChapter": "CHAPTER 02B // TRY ONLINE",
    "playGamesTitle": "在线体验",
    "playGamesLead": "可以在浏览器中直接体验 Level Builder。",
    "platforms": [
      {
        "id": "public-0",
        "code": "PORTAL 01",
        "name": "Level Builder",
        "badge": "公开工具",
        "desc": "借助视野和跳跃轨迹验证白盒关卡动线。",
        "url": LEVEL_BUILDER_URL,
        "cta": "在线体验"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "源代码",
        "desc": "查看关卡设计工具的源码和说明。",
        "url": LEVEL_BUILDER_REPOSITORY,
        "cta": "查看源码"
      },
      {
        "id": "public-2",
        "code": "PORTAL 03",
        "name": "Sora / GitHub",
        "badge": "个人主页",
        "desc": "查看制作活动和公开仓库。",
        "url": "https://github.com/Sora-My-One-And-Only",
        "cta": "查看主页"
      }
    ],
    "browserLabTag": "作品预览",
    "browserLabTitle": "查看作品与相关资料",
    "browserLabDesc": "选择作品，查看企划意图和机制说明。",
    "browserLabFeatures": [],
    "browserLabStageSelect": "选择作品",
    "whatICanDoChapter": "CHAPTER 03B // CAPABILITIES",
    "whatICanDoTitle": "我在制作中做什么",
    "whatICanDoLead": "这些能力都对应具体的作品实践。",
    "capabilities": [
      {
        "num": "CAPABILITY 01",
        "category": "战斗设计",
        "title": "让近战和魔法互相配合",
        "desc": "用近战恢复魔力，在打出 Break 后为长咏唱争取时间。",
        "example": "魔法指令与 Break",
        "tags": [
          "Unity",
          "Break"
        ]
      },
      {
        "num": "CAPABILITY 02",
        "category": "关卡设计",
        "title": "把动线做成能玩的白盒",
        "desc": "搭建白盒确认视野和落脚点，检查玩家能怎么走。",
        "example": "火龙战平台变化",
        "tags": [
          "Greybox",
          "Playtest"
        ]
      },
      {
        "num": "CAPABILITY 03",
        "category": "工具制作",
        "title": "制作设计验证工具",
        "desc": "制作能验证视野、跳跃和特效演出的工具。",
        "example": "Level Builder / GSParticleStudio",
        "tags": [
          "Web",
          "VFX"
        ]
      },
      {
        "num": "CAPABILITY 04",
        "category": "团队制作",
        "title": "整理团队规格",
        "desc": "梳理操作和敌人行为，写成团队可用的规格。",
        "example": "《ルミアの冒険譚》团队制作",
        "tags": [
          "Unity",
          "Design Spec"
        ]
      }
    ],
    "timelineChapter": "CHAPTER 04B // PROJECTS",
    "timelineTitle": "制作记录",
    "timelineSub": "制作主题",
    "timelineNodes": [
      {
        "stage": "WORK 01",
        "period": "2026",
        "badge": "团队制作",
        "title": "ルミアの冒険譚",
        "desc": "用近战恢复魔力，在打出 Break 后为长咏唱争取时间。"
      },
      {
        "stage": "WORK 02",
        "period": "2026",
        "badge": "工具制作",
        "title": "Level Builder",
        "desc": "制作能验证视野、跳跃和特效演出的工具。"
      },
      {
        "stage": "WORK 03",
        "period": "2026",
        "badge": "工具制作",
        "title": "GSParticleStudio",
        "desc": "制作能验证视野、跳跃和特效演出的工具。"
      }
    ],
    "blogHeader": "公开文档",
    "blogDesc": "查看关卡设计工具的源码和说明。",
    "blogArticles": [
      {
        "date": "2026",
        "tag": "LEVEL DESIGN",
        "title": "Level Builder",
        "summary": "查看关卡设计工具的源码和说明。",
        "url": LEVEL_BUILDER_REPOSITORY + '#readme'
      }
    ],
    "endingBanner": "CREDITS",
    "endingTitle": "感谢阅读",
    "endingLead": "也可以在 GitHub 查看公开作品和制作记录。",
    "credits": [
      {
        "role": "制作署名",
        "name": "Sora"
      },
      {
        "role": "网站制作",
        "name": "React / TypeScript"
      },
      {
        "role": "展示作品",
        "name": "ARCANE CHRONICLE / Level Builder / GSParticleStudio"
      }
    ],
    "kudosBtn": "支持一下",
    "kudosSent": "谢谢支持",
    "replayBtn": "返回顶部",
    "contactBtn": "查看联系方式"
  },
  "en": {
    "modeSelectTag": "Browse",
    "modeSelectTitle": "Choose what to explore",
    "modes": [
      {
        "id": "recruit",
        "target": "quick-guide",
        "badge": "MODE 01 // RECRUITER",
        "title": "Recruiters",
        "sub": "Read the overview and see featured work."
      },
      {
        "id": "gamedev",
        "target": "what-i-can-do",
        "badge": "MODE 02 // COLLABORATOR",
        "title": "Development and collaboration",
        "sub": "See examples of what I contribute."
      },
      {
        "id": "play",
        "target": "play-games",
        "badge": "MODE 03 // PLAYABLE",
        "title": "Try a public work",
        "sub": "Open the published browser tool."
      }
    ],
    "quickGuideTag": "QUICK GUIDE",
    "quickGuideTitle": "Sora in 30 seconds",
    "quickTimer": "0:30",
    "quickItems": {
      "roleLabel": "Target role",
      "roleMain": "Aspiring Game Designer",
      "roleSub": "Combat Design · Level Design",
      "skillLabel": "Tools and skills",
      "skillTags": [
        "Unity",
        "C#",
        "Combat Design",
        "Level Design"
      ],
      "worksLabel": "Featured work",
      "statsLabel": "Portfolio contents",
      "stats": [
        {
          "val": "3",
          "unit": "Works"
        },
        {
          "val": "1",
          "unit": "Game"
        },
        {
          "val": "2",
          "unit": "Tools"
        },
        {
          "val": "3",
          "unit": "Languages"
        }
      ]
    },
    "quickContactPrompt": "Explore the design cases and try the published tool.",
    "quickPlayBtn": "Try online",
    "quickMailBtn": "Contact",
    "playGamesChapter": "CHAPTER 02B // TRY ONLINE",
    "playGamesTitle": "Try Online",
    "playGamesLead": "Level Builder runs in the browser.",
    "platforms": [
      {
        "id": "public-0",
        "code": "PORTAL 01",
        "name": "Level Builder",
        "badge": "Published tool",
        "desc": "Check greybox routes with sight lines and jump trajectories.",
        "url": LEVEL_BUILDER_URL,
        "cta": "Try in browser"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "Source code",
        "desc": "Read the level editor’s source code and documentation.",
        "url": LEVEL_BUILDER_REPOSITORY,
        "cta": "View source"
      },
      {
        "id": "public-2",
        "code": "PORTAL 03",
        "name": "Sora / GitHub",
        "badge": "Profile",
        "desc": "Browse development activity and public repositories.",
        "url": "https://github.com/Sora-My-One-And-Only",
        "cta": "View profile"
      }
    ],
    "browserLabTag": "Work Previews",
    "browserLabTitle": "Works and related material",
    "browserLabDesc": "Select a work to read about its design goals and mechanics.",
    "browserLabFeatures": [],
    "browserLabStageSelect": "Choose a work",
    "whatICanDoChapter": "CHAPTER 03B // CAPABILITIES",
    "whatICanDoTitle": "What I Can Contribute",
    "whatICanDoLead": "Design and production skills illustrated by actual work.",
    "capabilities": [
      {
        "num": "CAPABILITY 01",
        "category": "Combat design",
        "title": "Connect melee and spellcasting",
        "desc": "Use melee to regain mana and Break to create a long casting window.",
        "example": "Spell commands and Break",
        "tags": [
          "Unity",
          "Break"
        ]
      },
      {
        "num": "CAPABILITY 02",
        "category": "Level design",
        "title": "Prototype routes for playtesting",
        "desc": "Greybox footholds and sight lines to test where players can move.",
        "example": "Fire dragon arena changes",
        "tags": [
          "Greybox",
          "Playtest"
        ]
      },
      {
        "num": "CAPABILITY 03",
        "category": "Tool development",
        "title": "Build tools for iteration",
        "desc": "Build tools to test sight lines, jumps and visual effects.",
        "example": "Level Builder / GSParticleStudio",
        "tags": [
          "Web",
          "VFX"
        ]
      },
      {
        "num": "CAPABILITY 04",
        "category": "Team production",
        "title": "Share design specifications",
        "desc": "Document controls and enemy behavior so the team can work from the same spec.",
        "example": "Lumia’s Adventure team project",
        "tags": [
          "Unity",
          "Design Spec"
        ]
      }
    ],
    "timelineChapter": "CHAPTER 04B // PROJECTS",
    "timelineTitle": "Project Notes",
    "timelineSub": "Production Focus",
    "timelineNodes": [
      {
        "stage": "WORK 01",
        "period": "2026",
        "badge": "Team production",
        "title": "ルミアの冒険譚",
        "desc": "Use melee to regain mana and Break to create a long casting window."
      },
      {
        "stage": "WORK 02",
        "period": "2026",
        "badge": "Tool development",
        "title": "Level Builder",
        "desc": "Build tools to test sight lines, jumps and visual effects."
      },
      {
        "stage": "WORK 03",
        "period": "2026",
        "badge": "Tool development",
        "title": "GSParticleStudio",
        "desc": "Build tools to test sight lines, jumps and visual effects."
      }
    ],
    "blogHeader": "Public Documentation",
    "blogDesc": "Read the level editor’s source code and documentation.",
    "blogArticles": [
      {
        "date": "2026",
        "tag": "LEVEL DESIGN",
        "title": "Level Builder",
        "summary": "Read the level editor’s source code and documentation.",
        "url": LEVEL_BUILDER_REPOSITORY + '#readme'
      }
    ],
    "endingBanner": "CREDITS",
    "endingTitle": "Thanks for reading",
    "endingLead": "See more public work and development activity on GitHub.",
    "credits": [
      {
        "role": "Byline",
        "name": "Sora"
      },
      {
        "role": "Site",
        "name": "React / TypeScript"
      },
      {
        "role": "Featured work",
        "name": "ARCANE CHRONICLE / Level Builder / GSParticleStudio"
      }
    ],
    "kudosBtn": "Send kudos",
    "kudosSent": "Thanks for the support",
    "replayBtn": "Back to top",
    "contactBtn": "Contact"
  }
};
