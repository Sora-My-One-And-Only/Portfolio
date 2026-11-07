import { Locale } from './i18n';

export interface HiddenCharacter {
  id: string;
  num: string;
  stageLocation: string;
  emojiSvg: string;
  accentColor: string;
  name: Record<Locale, string>;
  roleTitle: Record<Locale, string>;
  lore: Record<Locale, string>;
  hint: Record<Locale, string>;
}

export interface TrophyItem {
  id: string;
  code: string;
  rarity: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  title: Record<Locale, string>;
  desc: Record<Locale, string>;
}

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

export const HIDDEN_CHARACTERS: HiddenCharacter[] = [
  {
    id: 'char-slime',
    num: 'No.01',
    stageLocation: 'STAGE 0: TITLE / HERO',
    emojiSvg: '👾',
    accentColor: '#10B981',
    name: {
      ja: 'ほうがんスライム (Grid Slime)',
      zh: '方格纸史莱姆 (Grid Slime)',
      en: 'Grid-Paper Slime',
    },
    roleTitle: {
      ja: '初期配置モンスター · チュートリアル担当',
      zh: '1-1 新手引导怪 · 跳跃高度测试员',
      en: 'World 1-1 Tutorial Tester',
    },
    lore: {
      ja: '方眼紙の1マス（16×16px）から生まれた企画見習いモンスター。プレイヤーが最初のジャンプ操作を安全に練習できるよう、絶対に攻撃してこない優しい性格。',
      zh: '诞生于方格纸 16×16 像素格里的见习小怪。为了让玩家在第一屏安全练习跳跃手感，它永远只会慢吞吞地巡逻而不会主动伤人。',
      en: 'Born on 16×16px graph paper. It patrols slowly in World 1-1 so players can safely master jump arcs without taking unfair damage.',
    },
    hint: {
      ja: 'ファーストビュー（タイトル画面）の右下に隠れています',
      zh: '躲在首屏（Title 区域）右下角的阴影里',
      en: 'Hiding near the bottom-right of the Title / Hero area',
    },
  },
  {
    id: 'char-knight',
    num: 'No.02',
    stageLocation: 'STAGE 1: 30s PROFILE',
    emojiSvg: '⚔️',
    accentColor: '#F43F5E',
    name: {
      ja: 'アカワク剣士 (Hitbox Ronin)',
      zh: '朱红判定剑士 (Hitbox Ronin)',
      en: 'Crimson Hitbox Ronin',
    },
    roleTitle: {
      ja: '戦闘企画の化身 · 持続4フレームの達人',
      zh: '战斗企划化身 · 4帧持续判定达人',
      en: 'Master of the 4-Frame Active Window',
    },
    lore: {
      ja: '1/60秒の世界に生きる剣士。彼の抜刀術は「発生9F・持続4F・ヒットストップ6F」で厳密に定義されており、ジャストパリィの火花が大好物。',
      zh: '存活于 1/60 秒间隙中的浪人剑客。他的拔刀斩严格遵循“发生9F·持续4F·卡肉6F”的黄金帧数比，最喜欢听完美弹反时的打铁火花声。',
      en: 'Lives inside 1/60s intervals. His slash is tuned to 9F startup, 4F active, and 6F hitstop—and he loves the ring of a perfect parry.',
    },
    hint: {
      ja: '「STAGE 1: 30秒でわかる私」セクションのカード付近にいます',
      zh: '藏在「STAGE 1：30秒快速了解我」区域的卡片角落',
      en: 'Resting near the STAGE 1: 30-Second Profile cards',
    },
  },
  {
    id: 'char-hound',
    num: 'No.03',
    stageLocation: 'STAGE 2: MAIN WORKS',
    emojiSvg: '🦊',
    accentColor: '#F59E0B',
    name: {
      ja: '近道キツネ (Shortcut Fox)',
      zh: '捷径引路狐 (Shortcut Fox)',
      en: 'Shortcut Lantern Fox',
    },
    roleTitle: {
      ja: 'レベルデザイン守護獣 · 視線誘導係',
      zh: '箱庭关卡守护兽 · 视觉引导担当',
      en: 'Guardian of Sightlines & Loops',
    },
    lore: {
      ja: '迷子になりそうなプレイヤーの前に現れ、尻尾の灯りで「一方通行の扉」や「昇降機ショートカット」へ視線を誘導してくれる頼もしい相棒。',
      zh: '每当玩家在立体城塞中快要迷路时，它就会摇着暖黄色的灯笼尾巴出现在高处连廊，引导玩家打开通往初始营火的单向升降梯捷径。',
      en: 'Appears on elevated ledges with a warm tail lantern, guiding lost players toward one-way doors that loop back to the central bonfire.',
    },
    hint: {
      ja: '「STAGE 2: MAIN WORKS（代表作）」のフィルターバー付近を探してみてください',
      zh: '在「STAGE 2：代表作（Main Works）」的筛选栏附近摇尾巴',
      en: 'Look around the filter bar in STAGE 2: Main Works',
    },
  },
  {
    id: 'char-owl',
    num: 'No.04',
    stageLocation: 'STAGE 2: SPEC MODAL',
    emojiSvg: '🦉',
    accentColor: '#38BDF8',
    name: {
      ja: '起承転結フクロウ (Pacing Owl)',
      zh: '起承转合猫头鹰 (Pacing Owl)',
      en: 'Kishotenketsu Owl',
    },
    roleTitle: {
      ja: '仕様書ライブラリアン · 難易度曲線監督',
      zh: '企划书馆长 · 心流曲线监督',
      en: 'Chief Librarian of Pacing Curves',
    },
    lore: {
      ja: '企画仕様書（モーダル）の奥深くに生息する賢者。ステージの「緊張と緩和」のバランスが崩れるとホーホーと鳴いてプランナーに警告する。',
      zh: '栖息在企划仕样书详情弹窗深处的学者。只要关卡里的遭遇战密度超标、缺少安全休息区，它就会咕咕叫着提醒策划修改心流曲线。',
      en: 'Dwells inside the Project Specification Modal. Hoots a gentle warning whenever combat tension stays high for too long without a relief room.',
    },
    hint: {
      ja: 'いずれかの代表作カードをクリックして「仕様書モーダル」を開くと見つかります',
      zh: '点开任意一张代表作卡片，在弹出的「仕样书详情窗口」右上角就能发现它',
      en: 'Open any Main Work card to inspect its Specification Modal!',
    },
  },
  {
    id: 'char-golem',
    num: 'No.05',
    stageLocation: 'STAGE 3: OTHER WORKS',
    emojiSvg: '🗿',
    accentColor: '#A855F7',
    name: {
      ja: '白箱ゴーレム (Greybox Golem)',
      zh: '白盒魔像 (Greybox Golem)',
      en: 'Greybox Collision Golem',
    },
    roleTitle: {
      ja: 'プロトタイプ検証機 · 1mグリッドの巨人',
      zh: '白盒测试巨人 · 1米标准网格体',
      en: '1-Meter Grid Greybox Giant',
    },
    lore: {
      ja: 'アート素材が入る前の「グレイボックス（白箱）」工程で作られた試作ゴーレム。見た目は無骨な立方体だが、ジャンプ距離と遮蔽物の高さ検証には欠かせない存在。',
      zh: '在美术资产导入前的“白盒阶段（Greybox）”用基础几何体拼成的测试魔像。虽然外表朴素，却是测量角色跳跃跨度与掩体高度的功臣。',
      en: 'Built from raw Unreal/Unity primitive cubes before art assets arrive. Essential for testing jump clearance and cover sightlines.',
    },
    hint: {
      ja: '「STAGE 3: OTHER WORKS（その他の作品・小品集）」セクションに潜んでいます',
      zh: '潜伏在「STAGE 3：更多作品与原型（Other Works）」标题右侧',
      en: 'Standing guard in STAGE 3: Other Works & Mini-Prototypes',
    },
  },
  {
    id: 'char-fairy',
    num: 'No.06',
    stageLocation: 'STAGE 4: TIMELINE',
    emojiSvg: '🧚',
    accentColor: '#EC4899',
    name: {
      ja: '先行入力フェアリー (Buffer Pixie)',
      zh: '预输入妖精 (Buffer Pixie)',
      en: '8-Frame Buffer Pixie',
    },
    roleTitle: {
      ja: '操作レスポンスの妖精 · 8Fの猶予',
      zh: '操作手感妖精 · 8帧记忆守护者',
      en: 'Keeper of the 8-Frame Input Memory',
    },
    lore: {
      ja: 'プレイヤーが硬直終了の少し前に押したボタン入力を「8フレーム間」だけ大切に預かり、硬直が解けた瞬間に最速で技を出してくれる陰の功労者。',
      zh: '替玩家把收招硬直结束前按下的指令小心翼翼保管 8 帧的幕后功臣。有了它，玩家再也不会抱怨“我明明按出闪避了却没反应”。',
      en: 'Holds onto button presses made 8 frames before recovery ends, firing them on the first legal frame so controls feel silky smooth.',
    },
    hint: {
      ja: '「STAGE 4: ゲーム史と経歴（Timeline & Skills）」セクションに隠れています',
      zh: '躲在「STAGE 4：游戏史与个人履历」区域的年代选项卡旁',
      en: 'Floating inside STAGE 4: Game History & Designer Timeline',
    },
  },
  {
    id: 'char-mimic',
    num: 'No.07',
    stageLocation: 'STAGE 5: GITHUB REPOS',
    emojiSvg: '📦',
    accentColor: '#14B8A6',
    name: {
      ja: 'コミットミミック (Repo Mimic)',
      zh: '代码库宝箱怪 (Repo Mimic)',
      en: 'GitHub Commit Mimic',
    },
    roleTitle: {
      ja: 'オープンソース番人 · JSON出力係',
      zh: '开源仓库守门员 · 仕样书代码化担当',
      en: 'Guardian of Open-Source Specs',
    },
    lore: {
      ja: 'GitHubリポジトリの中に擬態している宝箱モンスター。開けると牙を剥く代わりに、綺麗に整理されたTypeScriptとC#の検証ツールコードを吐き出す。',
      zh: '伪装成 GitHub 仓库卡片的宝箱怪。打开它不仅不会咬人，还会吐出整理得干干净净的 TypeScript 与 Unity C# 策划工具源码。',
      en: 'Disguised as a GitHub repository box. Instead of biting, it drops clean TypeScript and Unity C# game design tooling scripts.',
    },
    hint: {
      ja: 'ページ下部「STAGE 5: GitHub リポジトリ動態」のヘッダー付近にいます',
      zh: '藏在页面底部「STAGE 5：GitHub 仓库动态」标题区域',
      en: 'Hiding near the header of STAGE 5: GitHub Live Feed',
    },
  },
  {
    id: 'char-dragon',
    num: 'No.08',
    stageLocation: 'FINAL STAGE: ENDING',
    emojiSvg: '🐉',
    accentColor: '#EAB308',
    name: {
      ja: '黄金のエンディング竜 (Clear Dragon)',
      zh: '黄金通关古龙 (Clear Dragon)',
      en: 'Golden Stage-Clear Dragon',
    },
    roleTitle: {
      ja: '最終ステージの主 · 縁結びの守護竜',
      zh: '终局关卡之主 · 面试结缘守护龙',
      en: 'Final Stage Guardian of New Adventures',
    },
    lore: {
      ja: 'ポートフォリオの最後までスクロールしてくれた採用担当者様・訪問者様だけに姿を現す伝説のドラゴン。「ここまで読んでくれてありがとう！」と祝福のファンファーレを鳴らす。',
      zh: '只向耐心浏览到作品集最后一页的面试官与访客现身的传说古龙。会奏响欢快的 8-bit 通关号角，祝愿我们能在下一款伟大的游戏中并肩作战！',
      en: 'Appears only to visitors and recruiters who reach the final Ending & Contact stage, sounding a celebratory 8-bit fanfare!',
    },
    hint: {
      ja: '一番下の「FINAL STAGE: エンディング＆連絡フォーム」に鎮座しています',
      zh: '镇守在页面最底部的「FINAL STAGE：通关结算与联系表单」区域',
      en: 'Waiting at the very bottom in FINAL STAGE: Ending & Contact',
    },
  },
];

export const TROPHY_LIST: TrophyItem[] = [
  {
    id: 'trophy-start',
    code: 'TR-01',
    rarity: 'BRONZE',
    title: {
      ja: '冒険の始まり (Press Start)',
      zh: '冒险启程 (Press Start)',
      en: 'Press Start to Begin',
    },
    desc: {
      ja: 'プレイアブル・ポートフォリオの世界へ足を踏み入れた',
      zh: '踏入这座可游玩的交互式游戏策划作品集',
      en: 'Entered the playable game planner portfolio',
    },
  },
  {
    id: 'trophy-30s',
    code: 'TR-02',
    rarity: 'BRONZE',
    title: {
      ja: '30秒の理解者 (Quick Scout)',
      zh: '30秒伯乐 (Quick Scout)',
      en: '30-Second Scout',
    },
    desc: {
      ja: '「30秒でわかる自己PR」で候補者の強みを確認した',
      zh: '在「30秒快速了解我」模块查阅了核心求职优势',
      en: 'Reviewed the 30-Second Candidate Pitch',
    },
  },
  {
    id: 'trophy-spec-open',
    code: 'TR-03',
    rarity: 'SILVER',
    title: {
      ja: '仕様書の査読者 (Spec Inspector)',
      zh: '仕样书审阅官 (Spec Inspector)',
      en: 'Specification Inspector',
    },
    desc: {
      ja: '代表作（Main Works）の詳細企画仕様書モーダルを開いた',
      zh: '点开并查阅了一份代表作的完整企划仕样书与数值表',
      en: 'Opened a Main Work specification modal',
    },
  },
  {
    id: 'trophy-spec-all',
    code: 'TR-04',
    rarity: 'GOLD',
    title: {
      ja: '全企画コンプリート (Master Producer)',
      zh: '全企划制霸 (Master Producer)',
      en: 'Master Producer',
    },
    desc: {
      ja: '4つすべての代表作（戦闘・レベル・AI・古典解析）の仕様書を閲覧した',
      zh: '完整审阅了全部 4 份核心代表作（战斗/关卡/Boss AI/名作拆解）',
      en: 'Inspected all 4 Main Work design specifications',
    },
  },
  {
    id: 'trophy-char-first',
    code: 'TR-05',
    rarity: 'BRONZE',
    title: {
      ja: '初めての遭遇 (First Encounter)',
      zh: '初次邂逅 (First Encounter)',
      en: 'First Mascot Encounter',
    },
    desc: {
      ja: 'サイト内に隠されたオリジナルキャラクターを初めて発見した',
      zh: '在网页角落发现了第 1 只隐藏的原创游戏吉祥物',
      en: 'Found your first hidden game character on the page',
    },
  },
  {
    id: 'trophy-char-half',
    code: 'TR-06',
    rarity: 'SILVER',
    title: {
      ja: '敏腕デバッガー (Sharp Tester)',
      zh: '敏锐测试员 (Sharp Tester)',
      en: 'Sharp Playtester',
    },
    desc: {
      ja: '隠されたキャラクターを4体以上見つけ出した',
      zh: '累计收集了 4 只以上的隐藏游戏角色图鉴',
      en: 'Collected 4 or more hidden characters into the Encyclopedia',
    },
  },
  {
    id: 'trophy-char-all',
    code: 'TR-07',
    rarity: 'PLATINUM',
    title: {
      ja: '伝説の図鑑コンプリート (100% Dex)',
      zh: '全图鉴收集狂魔 (100% Dex)',
      en: '100% Character Encyclopedia',
    },
    desc: {
      ja: '全8種類の隠れキャラクターをすべて発見し図鑑を完成させた！',
      zh: '找齐全部 8 只隐藏在各关卡中的原创角色，达成完美收集！',
      en: 'Found all 8 hidden characters across every portfolio stage!',
    },
  },
  {
    id: 'trophy-polyglot',
    code: 'TR-08',
    rarity: 'SILVER',
    title: {
      ja: 'グローバル開発者 (Trilingual Bridge)',
      zh: '跨国协作者 (Trilingual Bridge)',
      en: 'Trilingual Bridge',
    },
    desc: {
      ja: '日本語・中国語・英語の言語切り替え機能を試した',
      zh: '体验了中 / 日 / 英三语实时切换功能',
      en: 'Switched languages between Japanese, Chinese, and English',
    },
  },
  {
    id: 'trophy-recruiter-mode',
    code: 'TR-09',
    rarity: 'SILVER',
    title: {
      ja: '採用担当者の視点 (Fast-Track Mode)',
      zh: '高效面试官模式 (Fast-Track Mode)',
      en: 'Recruiter Fast-Track Mode',
    },
    desc: {
      ja: 'OPTIONSまたはヘッダーから「採用担当者向け高速閲覧モード」を切り替えた',
      zh: '切换体验了专为招聘官准备的「高速审阅模式 / OPTIONS 设置」',
      en: 'Toggled the Recruiter Quick-Read Mode or OPTIONS menu',
    },
  },
  {
    id: 'trophy-chronicle',
    code: 'TR-10',
    rarity: 'BRONZE',
    title: {
      ja: '温故知新の探求者 (Retro Historian)',
      zh: '温故知新研究者 (Retro Historian)',
      en: 'Video Game Historian',
    },
    desc: {
      ja: 'ゲーム史年代記（8-bit〜現代）のタブを切り替えて閲覧した',
      zh: '在电子游戏史与个人成长年表中切换查阅了不同世代篇章',
      en: 'Explored different eras in the Video Game History Chronicle',
    },
  },
  {
    id: 'trophy-github',
    code: 'TR-11',
    rarity: 'SILVER',
    title: {
      ja: 'コードを読む企画者 (Code-Literate Planner)',
      zh: '懂代码的策划 (Code-Literate Planner)',
      en: 'Code-Literate Planner',
    },
    desc: {
      ja: 'GitHubリポジトリ動態または .github.io 設定を操作した',
      zh: '在 GitHub 模块进行了仓库筛选、账号同步或查看部署配置',
      en: 'Interacted with the GitHub repository feed or .github.io config',
    },
  },
  {
    id: 'trophy-ending',
    code: 'TR-12',
    rarity: 'GOLD',
    title: {
      ja: 'エンディング到達 (Thank You For Playing!)',
      zh: '全关卡クリア！(Thank You For Playing!)',
      en: 'Stage Clear: Reached the Ending!',
    },
    desc: {
      ja: '最終ステージのエンディング＆スタッフロールを発動または連絡を送った',
      zh: '触发了底部的通关结算感谢演出或填写了面试联系表单',
      en: 'Triggered the Ending Credits celebration or used the Contact Form',
    },
  },
];

export const OTHER_WORKS_DATA: OtherWorkItem[] = [
  {
    id: 'ow-1',
    year: '2026.02',
    category: {
      ja: 'Unity 3D アクション試作',
      zh: 'Unity 3D 锁定镜头原型',
      en: 'Unity 3D Camera Prototype',
    },
    tech: 'Unity 6 / Cinemachine / C#',
    duration: {
      ja: '制作期間：2週間（個人制作）',
      zh: '开发周期：2周（独立完成）',
      en: 'Duration: 2 Weeks (Solo)',
    },
    title: {
      ja: '壁際でカメラがめり込まない「Z注目＆複数敵ロックオン補正」',
      zh: '墙角防穿帮“Z轴锁定与多目标动态构图”镜头控制器',
      en: 'Wall-Safe Z-Targeting & Multi-Enemy Framing Camera',
    },
    desc: {
      ja: '3Dアクションゲームで最もストレスになりやすい「壁際でのカメラ視界不良」を解決するため、壁面法線に応じた動的仰角シフトと半透明ディザリングを実装。',
      zh: '针对 3D 动作游戏常见的“狭窄墙角锁定视角丢失”痛点，实现基于墙面法线的动态俯仰角补偿与角色半透明抖动剔除。',
      en: 'Solves wall-corner camera clipping in 3D melee combat via surface-normal elevation shifts and dithered occlusion.',
    },
    highlight: {
      ja: '企画ポイント：プレイヤーと敵の距離に応じて視野角（FOV 50°〜68°）を自動補間',
      zh: '策划亮点：根据玩家与 Boss 间距自动插值 FOV（50°~68°），兼顾压迫感与周边视野',
      en: 'Planner Highlight: Auto-interpolates FOV (50°–68°) based on enemy distance',
    },
    repoUrl: 'https://github.com/kurogane-dev/z-target-camera-solver',
  },
  {
    id: 'ow-2',
    year: '2025.11',
    category: {
      ja: 'ゲームジャム受賞作 (48時間)',
      zh: '48小时 Game Jam 优胜作品',
      en: '48h Game Jam Winner',
    },
    tech: 'Godot 4 / WebGL Playable',
    duration: {
      ja: '制作期間：48時間（企画・レベル担当 / 3人チーム）',
      zh: '开发周期：48小时（担任主策划与全部关卡设计 / 3人组）',
      en: 'Duration: 48 Hours (Lead Planner / Team of 3)',
    },
    title: {
      ja: '『一閃・影送り』残像を足場に変える2Dハイスピード忍者パズルアクション',
      zh: '《一闪·影送》将攻击残影化作踏板的 2D 高速忍者动作解谜',
      en: 'Shadow Step Issen: 2D Ninja Action Platformer',
    },
    desc: {
      ja: '「攻撃アクション」と「移動ギミック」を1つのボタンに統合。斬撃を放った軌跡に3秒間だけ実体化する「影の足場」を使って進む全8ステージを設計。',
      zh: '将“挥刀战斗”与“平台搭建”合二为一：玩家挥砍留下的刀光残影会在 3 秒内凝固为可踩踏的实体跳板，独立设计全部 8 关“起承转合”节奏。',
      en: 'Unifies combat and platforming into one verb: your sword slash leaves a solid shadow ledge for 3 seconds across 8 handcrafted stages.',
    },
    highlight: {
      ja: '企画ポイント：テキスト説明ゼロで第1ステージクリア率96%を達成',
      zh: '策划亮点：全程无一行文字教程，展会现场 50 名试玩者第一关通过率达 96%',
      en: 'Planner Highlight: 96% Stage-1 clear rate across 50 booth playtesters with zero text tutorials',
    },
    repoUrl: 'https://github.com/kurogane-dev/shadow-step-issen',
  },
  {
    id: 'ow-3',
    year: '2025.08',
    category: {
      ja: '企画支援ツール・自動化',
      zh: '策划工具链与数值插件',
      en: 'Game Balance Tooling',
    },
    tech: 'TypeScript / Python / Excel VBA',
    duration: {
      ja: '制作期間：3週間（個人制作）',
      zh: '开发周期：3周（独立完成）',
      en: 'Duration: 3 Weeks (Solo)',
    },
    title: {
      ja: 'Excel仕様書からUnity ScriptableObjectへ一発変換する型安全エクスポーター',
      zh: 'Excel 数值配置表一键生成 Unity ScriptableObject 与类型校验工具',
      en: 'Type-Safe Excel Spec to Unity ScriptableObject Pipeline',
    },
    desc: {
      ja: 'プランナーが編集したスキル倍率・フレーム表の異常値（発生0F以下や硬直マイナスなど）を自動検出し、プログラマーの手を煩わせずに実機へ反映するパイプライン。',
      zh: '自动检测策划表中的非法帧数或倍率填表错误（如前摇 ≤0F、空引用等），一键导出 C# 数据资产，消除策划与程序之间的导表沟通损耗。',
      en: 'Automatically validates frame-data tables for illegal values and exports clean Unity assets without engineering bottlenecks.',
    },
    highlight: {
      ja: '企画ポイント：チームのパラメータ調整〜実機確認イテレーション速度を約4倍に高速化',
      zh: '策划亮点：将团队战斗数值调优到实机测试的迭代效率提升了约 4 倍',
      en: 'Planner Highlight: Accelerated combat parameter tuning iteration speed by 4x',
    },
    repoUrl: 'https://github.com/kurogane-dev/spec-to-unity-pipeline',
  },
];

export const PLAYABLE_PORTFOLIO_TEXT = {
  ja: {
    stageBar: [
      { id: 'hero', code: 'STAGE 1', name: '30秒でわかる私' },
      { id: 'works', code: 'STAGE 2', name: 'MAIN WORKS' },
      { id: 'other-works', code: 'STAGE 3', name: 'OTHER WORKS' },
      { id: 'chronicle', code: 'STAGE 4', name: 'TIMELINE & SKILLS' },
      { id: 'github', code: 'STAGE 5', name: 'GITHUB & ENDING' },
    ],
    hud: {
      charDexBtn: 'キャラ図鑑',
      trophyBtn: 'トロフィー',
      optionsBtn: 'OPTIONS',
      fastModeOn: '採用担当モード: ON (一括表示)',
      fastModeOff: 'ゲーム演出モード: ON',
      toastCharFound: '隠れキャラクターを発見！図鑑に登録されました',
      toastTrophyUnlocked: 'トロフィー獲得！',
    },
    quick30s: {
      badge: 'STAGE 1 · 30-SECOND RECRUITER DIGEST',
      title: '30秒でわかる「林 海斗（リン・カイト）」',
      subtitle: 'お忙しい採用担当者様へ：私の志望職種・3つの強み・制作実績を30秒で把握できるサマリーです。（ページ内の隠れキャラ探しやトロフィー要素もぜひお楽しみください！）',
      targetRoleLabel: '第一志望職種',
      targetRoleValue: 'ゲームプランナー（戦闘企画 / レベルデザイナー）',
      statusLabel: '現在のステータス',
      statusValue: '情報工学専攻 大学4年（2026/2027年卒・インターン/新卒選考応募中）',
      strengths: [
        {
          num: '武器 01',
          title: '「動く企画仕様書」を自らコードで作れる実装力',
          desc: 'Excelやスライドの仕様書だけでなく、React/TypeScriptやUnity/UE5を使って「その場で触って手触りを検証できるプロトタイプ」を素早く実装し、プログラマーやアーティストと共通言語で対話できます。',
        },
        {
          num: '武器 02',
          title: '1/60秒の戦闘フレームと「起承転結」箱庭レベルの定量設計',
          desc: '「なんだか気持ちいい」を感覚で終わらせず、発生・持続・硬直フレームやヒットストップ、視線誘導角度（30°ルール）やショートカット短縮率など、明確な根拠と数値を持って設計します。',
        },
        {
          num: '武器 03',
          title: '日本ゲーム史への深いリスペクト × 日中英トリリンガル（JLPT N1）',
          desc: 'FC/SFC時代の名作から現代のフロム・ソフトウェアやカプコン作品まで40ステージ以上を方眼紙レベルで構造解析。JLPT N1（172/180点）の日本語力で日本の開発現場に即座に溶け込みます。',
        },
      ],
    },
    otherWorks: {
      badge: 'STAGE 3 · OTHER WORKS & MINI-PROTOTYPES',
      title: 'その他の制作物・ゲームジャム・企画支援ツール',
      subtitle: '代表作以外にも、カメラ制御の試作や48時間ゲームジャム受賞作、プランナー業務を効率化するツールなどを継続的に開発しています。',
    },
    ending: {
      badge: 'FINAL STAGE · PORTFOLIO CLEAR & STAFF ROLL',
      title: 'THANK YOU FOR PLAYING! — 最後までご覧いただきありがとうございます',
      subtitle: 'このポートフォリオ自体を「1本の小さなゲーム」として楽しんでいただけたなら幸いです。あなたのプレイ結果（探索スコア）はこちらです！',
      statsChars: '発見した隠れキャラ',
      statsTrophies: '獲得したトロフィー',
      statsSpecs: '査読した代表作仕様書',
      statsRank: '総合プレイランク',
      rollBtn: 'エンディング祝福花火を鳴らす 🎉',
      dexHintBtn: '未発見キャラのヒントを見る',
    },
  },
  zh: {
    stageBar: [
      { id: 'hero', code: 'STAGE 1', name: '30秒读懂我' },
      { id: 'works', code: 'STAGE 2', name: '核心代表作' },
      { id: 'other-works', code: 'STAGE 3', name: '更多作品集' },
      { id: 'chronicle', code: 'STAGE 4', name: '游戏史与履历' },
      { id: 'github', code: 'STAGE 5', name: 'GitHub与通关' },
    ],
    hud: {
      charDexBtn: '角色图鉴',
      trophyBtn: '成就奖杯',
      optionsBtn: 'OPTIONS 设置',
      fastModeOn: 'HR极速审阅模式: ON',
      fastModeOff: '游戏闯关模式: ON',
      toastCharFound: '发现隐藏角色！已收入角色图鉴',
      toastTrophyUnlocked: '解锁成就奖杯！',
    },
    quick30s: {
      badge: 'STAGE 1 · 30-SECOND RECRUITER DIGEST',
      title: '30秒快速了解「林 海斗 (Lin Kaito)」',
      subtitle: '致忙碌的招聘官与制作人：把作品集本身做成一款可收集、可通关的小游戏！您可以在 30 秒内掌握我的核心竞争力，也可以在浏览途中寻找隐藏的 8 只原创角色与 12 座奖杯。',
      targetRoleLabel: '第一志愿岗位',
      targetRoleValue: '日本游戏策划（战斗策划 Battle Planner / 关卡策划 Level Designer）',
      statusLabel: '当前求职状态',
      statusValue: '计算机科学大四在读（2026/2027 应届新卒 / 实习皆可 · 随时可赴东京/大阪）',
      strengths: [
        {
          num: '核心武器 01',
          title: '能亲手写出“可游玩企划书”的复合型策划（前端 + 引擎原型）',
          desc: '不止于静态的 Word/Excel 文档，更能用 React/TypeScript 与 Unity/UE5 快速搭建可交互原型，用程序和美术听得懂的工程语言高效推进开发。',
        },
        {
          num: '核心武器 02',
          title: '精确到 1/60 秒的动作帧数手感与“起承转合”立体箱庭设计',
          desc: '拒绝玄学手感，坚持用发生/持续/硬直帧数、卡肉停顿、30° 仰角视觉地标引导与单向捷径省时率等定量指标来推导每一处战斗与关卡设计。',
        },
        {
          num: '核心武器 03',
          title: '深厚的日本电子游戏史积淀 × 日中英三语无障碍协作（JLPT N1）',
          desc: '以方格纸精度拆解过从红白机《马里奥1-1》到《只狼》等 40 余个经典日本游戏关卡；日语 N1 高分（172/180），可直接用日文撰写严谨的现场仕样书。',
        },
      ],
    },
    otherWorks: {
      badge: 'STAGE 3 · OTHER WORKS & MINI-PROTOTYPES',
      title: '更多独立原型、Game Jam 获奖作与策划工具链',
      subtitle: '除核心代表作外，我还持续开发解决 3D 动作镜头痛点的实验原型、48 小时极限开发获奖作品与导表自动化工具。',
    },
    ending: {
      badge: 'FINAL STAGE · PORTFOLIO CLEAR & STAFF ROLL',
      title: 'THANK YOU FOR PLAYING! — 感谢您一路通关本作品集',
      subtitle: '希望这段将“个人求职网站”化作“一场小型寻宝游戏”的旅程能给您留下愉快的印象！以下是您的本局探索结算成绩：',
      statsChars: '已收集隐藏角色',
      statsTrophies: '已解锁成就奖杯',
      statsSpecs: '已审阅核心仕样书',
      statsRank: '本局探索综合评级',
      rollBtn: '奏响通关庆典号角 🎉',
      dexHintBtn: '查看未收集角色线索',
    },
  },
  en: {
    stageBar: [
      { id: 'hero', code: 'STAGE 1', name: '30s Digest' },
      { id: 'works', code: 'STAGE 2', name: 'Main Works' },
      { id: 'other-works', code: 'STAGE 3', name: 'Other Works' },
      { id: 'chronicle', code: 'STAGE 4', name: 'Timeline' },
      { id: 'github', code: 'STAGE 5', name: 'GitHub & Ending' },
    ],
    hud: {
      charDexBtn: 'Character Dex',
      trophyBtn: 'Trophies',
      optionsBtn: 'OPTIONS',
      fastModeOn: 'Recruiter Fast Mode: ON',
      fastModeOff: 'Game Mode: ON',
      toastCharFound: 'Hidden Character Found! Added to Encyclopedia',
      toastTrophyUnlocked: 'Trophy Unlocked!',
    },
    quick30s: {
      badge: 'STAGE 1 · 30-SECOND RECRUITER DIGEST',
      title: 'Kaito Lin in 30 Seconds (Quick Recruiter Summary)',
      subtitle: 'Built on the philosophy of making the portfolio itself playable like a game! Skim my core strengths in 30 seconds below—or hunt for 8 hidden characters and 12 trophies across the stages.',
      targetRoleLabel: 'Target Role',
      targetRoleValue: 'Game Planner (Battle Planner / Level Designer in Japan)',
      statusLabel: 'Current Status',
      statusValue: 'B.S. CS Senior · JLPT N1 (172/180) · Open to New Grad & Internships in Tokyo/Osaka',
      strengths: [
        {
          num: 'Weapon 01',
          title: 'Code-Empowered Planner Building Playable Specifications',
          desc: 'Beyond static spreadsheets, I build playable web and engine prototypes in TypeScript, Unity, and UE5 so teams can feel and validate mechanics immediately.',
        },
        {
          num: 'Weapon 02',
          title: 'Quantitative 60FPS Combat Feel & Kishotenketsu Level Topology',
          desc: 'Grounds every design decision in measurable metrics: startup/active/recovery frames, hitstop freeze, 30-degree sightline anchoring, and shortcut runback savings.',
        },
        {
          num: 'Weapon 03',
          title: 'Deep Video Game History Mastery × Trilingual Fluency (JA/ZH/EN)',
          desc: 'Deconstructed 40+ classic Japanese stages from Famicom to modern action RPGs. Fluent in writing authentic Japanese studio specifications (企画仕様書).',
        },
      ],
    },
    otherWorks: {
      badge: 'STAGE 3 · OTHER WORKS & MINI-PROTOTYPES',
      title: 'Other Works, Game Jam Winners & Planner Tooling',
      subtitle: 'Alongside my main specifications, I build 3D camera solvers, 48-hour game jam action platformers, and automated data pipelines.',
    },
    ending: {
      badge: 'FINAL STAGE · PORTFOLIO CLEAR & STAFF ROLL',
      title: 'THANK YOU FOR PLAYING! — Portfolio Stage Clear Results',
      subtitle: 'Thank you for exploring my portfolio to the very end! Here is your live playthrough summary:',
      statsChars: 'Hidden Characters Found',
      statsTrophies: 'Trophies Unlocked',
      statsSpecs: 'Main Specs Inspected',
      statsRank: 'Overall Play Rank',
      rollBtn: 'Trigger Stage Clear Fanfare 🎉',
      dexHintBtn: 'View Missing Character Hints',
    },
  },
};
