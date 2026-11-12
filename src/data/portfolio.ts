export const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
] as const;

export type PortfolioLanguage = (typeof languages)[number]['code'];

type PortfolioCopy = {
  pageTitle: string;
  role: string;
  focus: string;
  intro: string;
  skip: string;
  navigation: string;
  language: string;
  about: string;
  works: string;
  tools: string;
  featured: string;
  seeWork: string;
  tryTool: string;
  cases: string;
  lightMode: string;
  darkMode: string;
  soundEffects: string;
  workTitle: string;
  workType: string;
  workSummary: string;
  contributionLabel: string;
  contribution: string;
  battleTitle: string;
  battleDescription: string;
  battleSteps: readonly [string, string, string];
  arenaTitle: string;
  arenaDescription: string;
  arenaStages: readonly { name: string; description: string }[];
  centerPlatform: string;
  arenaCaption: string;
  levelDescription: string;
  particleDescription: string;
  aboutDescription: string;
  backToTop: string;
};

export const portfolioCopy: Record<PortfolioLanguage, PortfolioCopy> = {
  ja: {
    pageTitle: 'Sora | ゲーム企画ポートフォリオ',
    role: 'ゲームプランナー志望',
    focus: 'バトルデザイン・レベルデザイン',
    intro: '戦闘中の判断やステージの動線を考え、Unityで遊べる形にしています。',
    skip: '本文へ移動',
    navigation: 'ページ内ナビゲーション',
    language: '表示言語',
    about: '自己紹介',
    works: '作品',
    tools: '制作ツール',
    featured: '代表作',
    seeWork: '代表作を見る',
    tryTool: 'Level Builderを試す',
    cases: '設計事例を見る',
    lightMode: 'ライトテーマ',
    darkMode: 'ダークテーマ',
    soundEffects: '効果音',
    workTitle: 'ルミアの冒険譚',
    workType: 'Unity / C# · 3Dアクション · チーム制作',
    workSummary: '戦闘中にコマンドを入力して魔法を詠唱する3Dアクションゲームです。剣で魔力を回復し、敵をブレイクさせて強力な魔法を使う時間を作ります。',
    contributionLabel: '担当',
    contribution: 'ゲーム企画。魔法コマンドと火竜戦の仕様整理に携わりました。',
    battleTitle: '詠唱する時間を自分で作る',
    battleDescription: '敵の小さな隙には短いコマンドで魔法を差し込めます。強力な魔法を狙うときは、先に剣で攻めて敵をブレイクさせ、長いコマンドを入力する時間を作ります。',
    battleSteps: ['剣で攻めて魔力を回復', 'ブレイクで敵の動きを止める', '長いコマンドで強力な魔法を詠唱'],
    arenaTitle: '火竜戦では足場が変わる',
    arenaDescription: '火竜が足場を崩すたびに、次に渡る場所を選びます。移動先では、火竜との距離と攻める位置を考え直す必要があります。',
    arenaStages: [
      { name: '序盤', description: '外周の3つの足場を、小さな足場で行き来できます。中央は溶岩の下にあります。' },
      { name: '終盤への移行', description: '外周の足場が1つになると、最後の崩壊に先立って中央の足場がせり上がります。' },
      { name: '最終局面', description: '最後の外周足場が沈み、戦闘の舞台が中央へ移ります。' },
    ],
    centerPlatform: '中央',
    arenaCaption: '足場の変化を示す模式図',
    levelDescription: 'ブラウザでグレーボックスを組み、プレイヤーの視界とジャンプ軌道を見ながら、次の足場が見えるか、そこまで跳べるかを確かめられます。',
    particleDescription: '魔法エフェクトを制作するパーティクルエディタです。複数のレイヤーを重ね、発動から消えるまでの演出を組み立てます。',
    aboutDescription: '日本でゲーム制作を学んでいます。アイデアを遊べる形にして、手触りや動線を試しながら企画を詰めています。',
    backToTop: 'ページ上部へ',
  },
  zh: {
    pageTitle: 'Sora｜游戏策划作品集',
    role: '游戏策划求职作品集',
    focus: '战斗设计 · 关卡设计',
    intro: '我用 Unity 把战斗中的决策和关卡动线做成能玩的设计。',
    skip: '跳到正文',
    navigation: '页内导航',
    language: '显示语言',
    about: '关于我',
    works: '作品',
    tools: '制作工具',
    featured: '代表作',
    seeWork: '查看代表作',
    tryTool: '体验 Level Builder',
    cases: '查看设计案例',
    lightMode: '浅色主题',
    darkMode: '深色主题',
    soundEffects: '音效',
    workTitle: 'ルミアの冒険譚',
    workType: 'Unity / C# · 3D 动作 · 团队制作',
    workSummary: '一款在战斗中输入指令、咏唱魔法的 3D 动作游戏。玩家用剑攻击恢复魔力，打出 Break 后获得释放强力魔法所需的时间。',
    contributionLabel: '个人担当',
    contribution: '游戏策划。参与魔法指令与火龙战的规格整理。',
    battleTitle: '自己创造咏唱的时间',
    battleDescription: '敌人只露出短暂破绽时，可以用短指令快速施法。想释放强力魔法，就先用剑攻击打出 Break，为输入长指令创造机会。',
    battleSteps: ['近战攻击恢复魔力', '打出 Break 让敌人失去行动能力', '输入长指令咏唱强力魔法'],
    arenaTitle: '火龙战中的平台变化',
    arenaDescription: '火龙每摧毁一处平台，玩家就要选出下一个落脚点。转移之后，还需要重新判断与火龙的距离和进攻位置。',
    arenaStages: [
      { name: '战斗前期', description: '三处外围平台由小平台连接，中心平台沉在岩浆里。' },
      { name: '转入末段', description: '外围平台剩下一处时，中心平台会在最后一次崩塌前升起。' },
      { name: '最终阶段', description: '最后一处外围平台下沉，战斗转移到中心平台。' },
    ],
    centerPlatform: '中心',
    arenaCaption: '平台变化示意图',
    levelDescription: '在浏览器里搭建白盒关卡，借助角色视野和跳跃轨迹，检查下一处平台看不看得见、跳不跳得到。',
    particleDescription: '用于制作魔法特效的粒子编辑器。通过叠加不同图层，组合从发动到消散的演出。',
    aboutDescription: '我在日本学习游戏制作。我习惯先把想法做成可玩的原型，再通过操作手感和关卡动线验证设计。',
    backToTop: '回到顶部',
  },
  en: {
    pageTitle: 'Sora | Game Design Portfolio',
    role: 'Game Design Portfolio',
    focus: 'Combat Design · Level Design',
    intro: 'I use Unity to prototype combat decisions and level routes that players can test.',
    skip: 'Skip to content',
    navigation: 'On this page',
    language: 'Display language',
    about: 'About',
    works: 'Works',
    tools: 'Tools',
    featured: 'Featured work',
    seeWork: 'View featured work',
    tryTool: 'Try Level Builder',
    cases: 'Read the design cases',
    lightMode: 'Light theme',
    darkMode: 'Dark theme',
    soundEffects: 'Sound effects',
    workTitle: 'Lumia’s Adventure',
    workType: 'Unity / C# · 3D action · Team project',
    workSummary: 'A 3D action game where players enter commands to cast spells in combat. Sword attacks restore mana and build Break, giving players time to cast stronger spells.',
    contributionLabel: 'My role',
    contribution: 'Game design. I contributed to the specifications for spell commands and the fire dragon encounter.',
    battleTitle: 'Creating time to cast',
    battleDescription: 'Short commands fit into brief openings. To cast a more powerful spell, the player can fight up close and Break the enemy first, creating time to enter a longer command.',
    battleSteps: ['Restore mana with melee attacks', 'Break the enemy to interrupt it', 'Enter a longer command to cast'],
    arenaTitle: 'A boss arena that changes underfoot',
    arenaDescription: 'Each time the fire dragon destroys a platform, the player chooses where to go next. After crossing, they have to reconsider where and how far away to attack from.',
    arenaStages: [
      { name: 'Opening', description: 'Small platforms connect three outer platforms. The central platform is submerged in lava.' },
      { name: 'Transition', description: 'With one outer platform left, the central platform rises ahead of the final collapse.' },
      { name: 'Final phase', description: 'The last outer platform sinks and the fight moves to the center.' },
    ],
    centerPlatform: 'Center',
    arenaCaption: 'Schematic of the platform changes',
    levelDescription: 'Greybox levels in your browser and check whether a player can see the next platform or reach it, using sight lines and jump trajectories.',
    particleDescription: 'A particle editor for spell effects. Stack layers to design an effect from its first burst to its fade-out.',
    aboutDescription: 'I study game development in Japan. I prototype ideas and use playtesting to refine how they feel and how players move through a level.',
    backToTop: 'Back to top',
  },
};
