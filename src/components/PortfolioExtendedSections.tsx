import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Gamepad2,
  Compass,
  Clock,
  Trophy,
  Sparkles,
  BookOpen,
  ExternalLink,
  Play,
  ArrowRight,
  ArrowUp,
  Heart,
  Mail,
  Users,
  Wrench,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Locale, PROJECTS_DATA, ProjectSpec } from '../data/i18n';
import { soundFX } from '../utils/sound';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface ExtendedSectionsProps {
  locale: Locale;
  githubUsername: string;
  onScrollToSection: (sectionId: string) => void;
  onOpenSpec: (proj: ProjectSpec, mode: 'video' | 'playable') => void;
}

const EXTENDED_COPY = {
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
        "url": "https://sora-my-one-and-only.github.io/Level-Builder/",
        "cta": "ブラウザで試す"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "ソースコード",
        "desc": "レベルデザインツールのソースコードと説明を公開しています。",
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder",
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
        "desc": "白箱で足場と視界を確認し、プレイヤーの進み方を検討します。",
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
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder#readme"
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
        "url": "https://sora-my-one-and-only.github.io/Level-Builder/",
        "cta": "在线体验"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "源代码",
        "desc": "查看关卡设计工具的源码和说明。",
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder",
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
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder#readme"
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
        "url": "https://sora-my-one-and-only.github.io/Level-Builder/",
        "cta": "Try in browser"
      },
      {
        "id": "public-1",
        "code": "PORTAL 02",
        "name": "Level Builder / GitHub",
        "badge": "Source code",
        "desc": "Read the level editor’s source code and documentation.",
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder",
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
        "url": "https://github.com/Sora-My-One-And-Only/Level-Builder#readme"
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

/**
 * 1. Purpose-Driven Mode Selector + 30-Second Recruiter Quick Guide (`#quick-guide`)
 */
export const QuickRecruiterGuideSection: React.FC<ExtendedSectionsProps> = ({
  locale,
  onScrollToSection,
  onOpenSpec,
}) => {
  const t = EXTENDED_COPY[locale];
  const modeIcons = [Briefcase, Wrench, Gamepad2];

  return (
    <section
      id="quick-guide"
      className="py-20 lg:py-28 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-14">
        {/* SELECT MODE: 3 Purpose-Driven Jump Cards */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] editorial-callout-line">
              {t.modeSelectTag}
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-semibold">
              {t.modeSelectTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.modes.map((m, idx) => {
              const Icon = modeIcons[idx] || Compass;
              return (
                <button
                  key={m.id}
                  type="button"
                  onMouseEnter={() => soundFX.playBlip(560 + idx * 30)}
                  onClick={() => onScrollToSection(m.target)}
                  className="group p-5 sm:p-6 text-left card-3d-console flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 shrink-0 border border-[#E2E0D8] dark:border-[#2E2924] bg-[#EFEDE6] dark:bg-[#131210] flex items-center justify-center text-[#C84B31] dark:text-[#E57052] group-hover:bg-[#C84B31] group-hover:text-white dark:group-hover:bg-[#E57052] dark:group-hover:text-[#131210] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono tracking-[0.2em] text-[#888E94]">
                        0{idx + 1} // {m.badge}
                      </div>
                      <div className="mt-1 font-editorial text-lg sm:text-xl font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {m.title}
                      </div>
                      <div className="mt-1 text-xs font-mono text-[#555B61] dark:text-[#B0A89E]">
                        {m.sub}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#888E94] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 30-SECOND RECRUITER SUMMARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="p-7 sm:p-10 card-3d-console border-t-2 border-t-[#181A1C] dark:border-t-[#F2EFE9]"
        >
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2E0D8] dark:border-[#2E2924]">
            <div>
              <div className="text-xs font-mono tracking-[0.22em] text-[#C84B31] dark:text-[#E57052]">
                {t.quickGuideTag}
              </div>
              <h2 className="mt-1 font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
                {t.quickGuideTitle}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#E2E0D8] dark:border-[#2E2924] bg-[#EFEDE6] dark:bg-[#131210] text-xs font-mono text-[#C84B31] dark:text-[#E57052]">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.quickTimer}</span>
            </div>
          </div>

          {/* 4-Quadrant Quick Dossier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 01. Target Role */}
            <div className="lg:col-span-6 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-2">
                {t.quickItems.roleLabel}
              </div>
              <div className="font-editorial text-xl sm:text-2xl font-semibold">
                {t.quickItems.roleMain}
              </div>
              <p className="mt-2 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
                {t.quickItems.roleSub}
              </p>
            </div>

            {/* 02. Core Tech & Design Tags */}
            <div className="lg:col-span-6 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.skillLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {t.quickItems.skillTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] text-[#181A1C] dark:text-[#F2EFE9]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 03. Flagship Works Quick Jump */}
            <div className="lg:col-span-7 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924]">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.worksLabel}
              </div>
              <div className="space-y-2.5">
                {PROJECTS_DATA.slice(0, 2).map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onOpenSpec(proj, proj.playUrl ? 'playable' : 'video')}
                    className="w-full p-3 bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#C84B31] dark:hover:border-[#E57052] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="font-editorial text-base sm:text-lg font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {proj.title[locale]}
                      </div>
                      <div className="text-xs font-mono text-[#555B61] dark:text-[#B0A89E]">
                        {proj.roleTag[locale]} · {proj.engineTag}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C84B31] dark:text-[#E57052] shrink-0">
                      <Play className="w-3 h-3" />
                      <span>PLAY</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 04. Achievement Numbers Counter */}
            <div className="lg:col-span-5 p-5 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] flex flex-col justify-between">
              <div className="text-xs font-mono tracking-wider text-[#C84B31] dark:text-[#E57052] mb-3">
                {t.quickItems.statsLabel}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {t.quickItems.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#1B1916] border border-[#E2E0D8] dark:border-[#2E2924] text-center"
                  >
                    <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#C84B31] dark:text-[#E57052] tabular-nums">
                      {st.val}
                    </div>
                    <div className="mt-0.5 text-[11px] font-mono text-[#555B61] dark:text-[#B0A89E]">
                      {st.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-[#E2E0D8] dark:border-[#2E2924] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
              {t.quickContactPrompt}
            </p>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onScrollToSection('play-games')}
                className="inline-flex items-center gap-2 h-10 px-4 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
                <span>{t.quickPlayBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('contact')}
                className="inline-flex items-center gap-2 h-10 px-5 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.quickMailBtn}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * 2. Play Games & Web Portals Section (`#play-games`)
 */
export const PlayGamesPortalSection: React.FC<ExtendedSectionsProps> = ({
  locale,
  githubUsername,
  onOpenSpec,
}) => {
  const t = EXTENDED_COPY[locale];

  return (
    <section
      id="play-games"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
            {t.playGamesChapter}
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
            {t.playGamesTitle}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
            {t.playGamesLead}
          </p>
        </motion.div>

        {/* 3 External Game Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
          {t.platforms.map((pf, idx) => (
            <motion.a
              key={pf.id}
              href={
                pf.id === 'freegame'
                  ? `https://github.com/${githubUsername}`
                  : pf.url
              }
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
              onMouseEnter={() => soundFX.playBlip(580 + idx * 25)}
              onClick={() => soundFX.playSelect()}
              className="group p-6 sm:p-7 card-3d-console flex flex-col justify-between min-h-[228px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono tracking-[0.18em] text-[#C84B31] dark:text-[#E57052] mb-3">
                  <span>{pf.code}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                  {pf.name}
                </h3>
                <div className="mt-2 inline-block px-2 py-0.5 text-[10px] font-mono bg-[#EFEDE6] dark:bg-[#131210] text-[#555B61] dark:text-[#B0A89E] border border-[#E2E0D8] dark:border-[#2E2924]">
                  {pf.badge}
                </div>
                <p className="mt-4 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                  {pf.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E0D8] dark:border-[#2E2924] flex items-center justify-between text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052]">
                <span>{pf.cta}</span>
                <Gamepad2 className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Featured Browser Game & 60FPS Spec Sandbox Portal */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="p-7 sm:p-10 card-3d-console border-l-2 border-l-[#C84B31] dark:border-l-[#E57052]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.browserLabTag}</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.22]">
                {t.browserLabTitle}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                {t.browserLabDesc}
              </p>
              <ul className="space-y-2 pt-2">
                {t.browserLabFeatures.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right 6 Cols: Direct 1-Click Stage Launchers for All 4 Playable Works */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-mono tracking-wider text-[#888E94] mb-2">
                {t.browserLabStageSelect}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PROJECTS_DATA.map((proj, idx) => (
                  <button
                    key={proj.id}
                    type="button"
                    onMouseEnter={() => soundFX.playBlip(600 + idx * 25)}
                    onClick={() => onOpenSpec(proj, proj.playUrl ? 'playable' : 'video')}
                    className="group p-4 bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] hover:border-[#C84B31] dark:hover:border-[#E57052] text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#C84B31] dark:text-[#E57052]">
                        <span>STAGE 0{idx + 1} // {proj.code}</span>
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                      <div className="mt-1.5 font-editorial text-sm sm:text-base font-semibold group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                        {proj.title[locale]}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#555B61] dark:text-[#B0A89E] flex items-center justify-between pt-2 border-t border-[#E2E0D8] dark:border-[#2E2924]">
                      <span>{proj.roleTag[locale]}</span>
                      <span className="text-[#C84B31] dark:text-[#E57052] shrink-0">DETAILS →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * 3. What I Can Do in Game Production (`#what-i-can-do`)
 */
export const WhatICanDoSection: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = EXTENDED_COPY[locale];
  const icons = [Gamepad2, Compass, Layers, Users];

  return (
    <section
      id="what-i-can-do"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-4 editorial-callout-line">
            {t.whatICanDoChapter}
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
            {t.whatICanDoTitle}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
            {t.whatICanDoLead}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.capabilities.map((cap, idx) => {
            const Icon = icons[idx] || Wrench;
            return (
              <motion.div
                key={cap.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                className="p-7 sm:p-8 card-3d-console flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                      {cap.num} // {cap.category}
                    </span>
                    <Icon className="w-4 h-4 text-[#C84B31] dark:text-[#E57052] shrink-0" />
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight leading-[1.28]">
                    {cap.title}
                  </h3>

                  <p className="mt-3.5 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    {cap.desc}
                  </p>

                  <div className="mt-4 p-3 bg-[#F7F6F2] dark:bg-[#131210] border-l-2 border-l-[#C84B31] dark:border-l-[#E57052] text-xs font-mono text-[#181A1C] dark:text-[#F2EFE9]">
                    {cap.example}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E0D8] dark:border-[#2E2924] flex flex-wrap gap-2">
                  {cap.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[11px] font-mono bg-[#EFEDE6] dark:bg-[#131210] text-[#555B61] dark:text-[#B0A89E] border border-[#E2E0D8] dark:border-[#2E2924]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/**
 * 4. Production Activity Timeline & Game Design Blog Section (`#timeline`)
 */
export const TimelineAndBlogSection: React.FC<{
  locale: Locale;
  githubUsername: string;
}> = ({ locale, githubUsername }) => {
  const t = EXTENDED_COPY[locale];

  return (
    <section
      id="timeline"
      className="py-28 lg:py-36 border-t border-[#E2E0D8] dark:border-[#2E2924]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-24">
        {/* Part A: Stage-Select Production Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mb-14 pb-8 border-b border-[#181A1C] dark:border-[#F2EFE9] flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            <div>
              <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
                {t.timelineChapter}
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15]">
                {t.timelineTitle}
              </h2>
            </div>
            <div className="text-xs font-mono tracking-[0.18em] text-[#888E94]">
              {t.timelineSub}
            </div>
          </motion.div>

          <div className="relative border-l-2 border-[#C84B31]/40 dark:border-[#E57052]/40 ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-8">
            {t.timelineNodes.map((node, idx) => (
              <motion.div
                key={node.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.07, ease: EASE_OUT_EXPO }}
                className="relative p-6 sm:p-7 card-3d-console"
              >
                {/* Stage Node Marker */}
                <span className="absolute -left-[33px] sm:-left-[49px] top-7 w-4 h-4 bg-[#C84B31] dark:bg-[#E57052] border-4 border-[#F7F6F2] dark:border-[#131210]" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="font-semibold text-[#C84B31] dark:text-[#E57052]">
                      {node.stage}
                    </span>
                    <span className="text-[#888E94]">// {node.period}</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210]">
                    {node.badge}
                  </span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight">
                  {node.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                  {node.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part B: Game Design Notes & Analytical Blog */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E2E0D8] dark:border-[#2E2924]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052] mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.blogHeader}</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] max-w-3xl">
                {t.blogDesc}
              </p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFX.playSelect()}
              className="inline-flex items-center gap-2 h-10 px-5 text-xs font-mono tracking-wider btn-3d-secondary self-start lg:self-auto shrink-0 whitespace-nowrap"
            >
              <span>
                {locale === 'ja'
                  ? '[機能ボタン：外部ブログ一覧へ ↗]'
                  : locale === 'zh'
                  ? '[功能按钮：前往外部专栏主页 ↗]'
                  : '[Action Button: Open External Blog ↗]'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {t.blogArticles.map((art, i) => (
              <a
                key={i}
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundFX.playBlip(600 + i * 20)}
                onClick={() => soundFX.playSelect()}
                className="group p-6 card-3d-console flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#888E94] mb-3">
                    <span>{art.date}</span>
                    <span className="text-[#C84B31] dark:text-[#E57052]">{art.tag}</span>
                  </div>
                  <h4 className="font-editorial text-lg sm:text-xl font-semibold leading-[1.32] group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors">
                    {art.title}
                  </h4>
                  <p className="mt-3 text-xs font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E0D8] dark:border-[#2E2924] text-xs font-mono text-[#C84B31] dark:text-[#E57052] flex items-center justify-between">
                  <span>README</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * 5. Ending Credits & All Stages Clear Section (`#ending`)
 */
export const EndingCreditsSection: React.FC<{
  locale: Locale;
  onScrollToSection: (sectionId: string) => void;
}> = ({ locale, onScrollToSection }) => {
  const t = EXTENDED_COPY[locale];
  const [kudosCount, setKudosCount] = useState<number>(0);
  const [kudosClicked, setKudosClicked] = useState<boolean>(false);

  const handleSendKudos = () => {
    soundFX.playPageTurn();
    setKudosCount((prev) => prev + 1);
    setKudosClicked(true);
  };

  return (
    <section
      id="ending"
      className="py-24 lg:py-32 border-t border-[#181A1C] dark:border-[#F2EFE9]"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="p-8 sm:p-14 card-3d-console border-2 border-[#181A1C] dark:border-[#F2EFE9] space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#181A1C] dark:bg-[#F2EFE9] text-[#F7F6F2] dark:text-[#131210] text-xs font-mono tracking-[0.22em]">
            <Trophy className="w-3.5 h-3.5 text-[#E57052] dark:text-[#C84B31]" />
            <span>{t.endingBanner}</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-editorial text-2xl sm:text-4xl font-semibold tracking-tight">
              {t.endingTitle}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] max-w-2xl mx-auto leading-relaxed">
              {t.endingLead}
            </p>
          </div>

          {/* Editorial Cast & Credits Roll */}
          <div className="py-6 border-y border-[#E2E0D8] dark:border-[#2E2924] grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {t.credits.map((cr, idx) => (
              <div
                key={idx}
                className={idx === t.credits.length - 1 ? 'sm:col-span-2 pt-2 border-t border-dotted border-[#E2E0D8] dark:border-[#2E2924]' : ''}
              >
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                  {cr.role}
                </div>
                <div className="mt-1 font-editorial text-base sm:text-lg font-semibold">
                  {cr.name}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Kudos / Like Button + Replay / Contact Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleSendKudos}
              className={`inline-flex items-center gap-2.5 h-11 px-6 text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                kudosClicked
                  ? 'bg-[#C84B31] dark:bg-[#E57052] text-white border-[#C84B31] dark:border-[#E57052]'
                  : 'bg-[#F7F6F2] dark:bg-[#131210] text-[#181A1C] dark:text-[#F2EFE9] border-[#C84B31] dark:border-[#E57052] hover:bg-[#C84B31] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${kudosClicked ? 'fill-current' : ''}`} />
              <span>{kudosClicked ? t.kudosSent : t.kudosBtn}</span>
              <span className="px-2 py-0.5 bg-black/15 text-[11px] tabular-nums">
                {kudosCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onScrollToSection('top')}
              className="inline-flex items-center gap-2 h-11 px-5 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
              <span>{t.replayBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onScrollToSection('contact')}
              className="inline-flex items-center gap-2 h-11 px-6 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.contactBtn}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
