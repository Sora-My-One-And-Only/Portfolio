import type { Locale } from './interface-copy';
import syncedPlayHistory from './generated/play-history.json';
import playExclusions from './play-exclusions.json';

type Text = Record<Locale, string>;

export type ProfileTopic = 'intro' | 'qa' | 'playlog' | 'skills';

/* ------------------------------------------------------------------
 * 詳しい自己紹介（段落ごとに見出しと本文）
 * TODO の段落は、これまでの経歴やゲームとの出会いなどに書き換えてください。
 * ------------------------------------------------------------------ */

export interface IntroSection {
  heading: Text;
  body: Text;
}

export const INTRO_SECTIONS: IntroSection[] = [
  {
    heading: { ja: 'はじめまして', zh: '你好', en: 'Hello' },
    body: {
      ja: 'Soraです。ゲームプランナーを目指し、日本でゲーム制作を学びながら、Unityでチーム制作に取り組んでいます。',
      zh: '我是 Sora。以游戏策划为目标，在日本学习游戏制作，同时用 Unity 参与团队开发。',
      en: 'I am Sora. Aiming to become a game designer, I study game development in Japan and work on a Unity team project.',
    },
  },
  {
    heading: { ja: 'これまでの歩み', zh: '经历', en: 'Background' },
    body: {
      ja: 'TODO: ゲーム制作を始めたきっかけや、これまでの経歴',
      zh: 'TODO：开始做游戏的契机，以及到目前为止的经历',
      en: 'TODO: how you got into game development, and your background so far',
    },
  },
  {
    heading: { ja: '制作の進め方', zh: '制作方式', en: 'How I work' },
    body: {
      ja: '企画は動かしてみて初めて確かめられるもの。まず遊べるプロトタイプを作り、触りながら磨いていきます。検証に必要な道具は自分で作ります。',
      zh: '设计要动起来才能验证。我会先做出能玩的原型，再边玩边打磨；验证需要的工具就自己做。',
      en: 'A design is only proven once it moves. I build a playable prototype first and refine it by playing, and I build my own tools when testing needs them.',
    },
  },
  {
    heading: { ja: '取り組んでいる領域', zh: '专注方向', en: 'Focus' },
    body: {
      ja: 'バトルデザインでは、戦闘中に「いつ何をするか」の判断を作ること。レベルデザインでは、グレーボックスでジャンプ軌道・視界・動線を検証することに取り組んでいます。',
      zh: '战斗设计方面，设计战斗中“什么时候做什么”的决策；关卡设计方面，用白盒验证跳跃轨迹、视野与动线。',
      en: 'In combat design, I shape in-combat decisions about what to do and when. In level design, I test jump arcs, sight lines and routes with greyboxes.',
    },
  },
];

/*
 * 自己紹介ページの「趣味」「好きなゲーム」「長所・短所」
 * TODO を実際の内容に書き換えてください。
 */
export const INTERESTS: Text[] = [
  { ja: 'TODO: 趣味 1', zh: 'TODO：兴趣 1', en: 'TODO: interest 1' },
  { ja: 'TODO: 趣味 2', zh: 'TODO：兴趣 2', en: 'TODO: interest 2' },
  { ja: 'TODO: 趣味 3', zh: 'TODO：兴趣 3', en: 'TODO: interest 3' },
];

/** 好きなゲーム BEST 10（上から 1 位〜10 位。タイトルだけを書きます） */
export const FAVORITE_GAMES: string[] = [
  'TODO: 1 位',
  'TODO: 2 位',
  'TODO: 3 位',
  'TODO: 4 位',
  'TODO: 5 位',
  'TODO: 6 位',
  'TODO: 7 位',
  'TODO: 8 位',
  'TODO: 9 位',
  'TODO: 10 位',
];

export interface Trait {
  title: Text;
  body: Text;
}

/** 長所（作品やプロフィールから書けるものを入れています。必要に応じて書き換えてください） */
export const STRENGTHS: Trait[] = [
  {
    title: { ja: 'まず形にして確かめる', zh: '先做出来再验证', en: 'Build first, then test' },
    body: {
      ja: 'アイデアを議論だけで終わらせず、遊べるプロトタイプにして手触りで判断します。',
      zh: '不让想法停留在讨论上，而是做成能玩的原型，用手感来判断。',
      en: 'Rather than leaving ideas as discussion, I turn them into playable prototypes and judge by feel.',
    },
  },
  {
    title: { ja: '必要な道具を自分で作れる', zh: '能自己做需要的工具', en: 'I build the tools I need' },
    body: {
      ja: '検証に足りないものがあれば、Level Builder や GSParticleStudio のようにツールから作ります。',
      zh: '验证缺什么，就像 Level Builder 和 GSParticleStudio 那样从工具做起。',
      en: 'When testing needs something missing, I build the tool — as with Level Builder and GSParticleStudio.',
    },
  },
];

/** 短所と、その向き合い方 */
export const WEAKNESSES: Trait[] = [
  {
    title: { ja: 'TODO: 短所', zh: 'TODO：短处', en: 'TODO: weakness' },
    body: {
      ja: 'TODO: どう向き合っているか・改善のために何をしているか',
      zh: 'TODO：如何面对、为改进做了什么',
      en: 'TODO: how you deal with it and what you do to improve',
    },
  },
];

/* ------------------------------------------------------------------
 * Q&A 形式の自己紹介
 * ------------------------------------------------------------------ */

export interface ProfileQA {
  q: Text;
  a: Text;
}

export const PROFILE_QA: ProfileQA[] = [
  {
    q: {
      ja: '志望している職種は？',
      zh: '目标岗位是什么？',
      en: 'What role are you aiming for?',
    },
    a: {
      ja: 'ゲームプランナーです。特にバトルデザインとレベルデザインに取り組んでいます。',
      zh: '游戏策划，重点方向是战斗设计和关卡设计。',
      en: 'Game designer, focusing on combat design and level design.',
    },
  },
  {
    q: {
      ja: '今は何をしていますか？',
      zh: '现在在做什么？',
      en: 'What are you doing now?',
    },
    a: {
      ja: '日本でゲーム制作を学びながら、Unityでチーム制作に取り組んでいます。',
      zh: '在日本学习游戏制作，同时用 Unity 参与团队开发。',
      en: 'I study game development in Japan and work on a Unity team project.',
    },
  },
  {
    q: {
      ja: '企画で大切にしていることは？',
      zh: '做策划时最看重什么？',
      en: 'What matters most to you in design?',
    },
    a: {
      ja: '企画は動かしてみて初めて確かめられるもの。まず遊べるプロトタイプを作り、触りながら磨いていきます。',
      zh: '设计要动起来才能验证。我会先做出能玩的原型，再边玩边打磨。',
      en: 'A design is only proven once it moves. I build a playable prototype first, then refine it by playing.',
    },
  },
  {
    q: {
      ja: '得意なことは？',
      zh: '擅长什么？',
      en: 'What are you good at?',
    },
    a: {
      ja: '戦闘中に「いつ何をするか」の判断を作ることと、グレーボックスで動線や視界を検証することです。',
      zh: '设计战斗中“什么时候做什么”的决策，以及用白盒验证动线和视野。',
      en: 'Designing in-combat decisions about what to do and when, and testing routes and sight lines with greyboxes.',
    },
  },
  {
    q: {
      ja: 'なぜツールも作るのですか？',
      zh: '为什么还自己做工具？',
      en: 'Why do you also build tools?',
    },
    a: {
      ja: '検証に必要な道具は自分で作ります。レベル設計用のLevel Builderや、魔法エフェクト用のGSParticleStudioを制作しました。',
      zh: '验证需要的工具就自己做。做过关卡设计用的 Level Builder 和魔法特效用的 GSParticleStudio。',
      en: 'If I need a tool to test an idea, I build it — Level Builder for level layout and GSParticleStudio for spell effects.',
    },
  },
];

/* ------------------------------------------------------------------
 * プレイ履歴（プラットフォーム別）
 * 成就・トロフィー・実績は、それぞれのゲームの下に表示します。
 * TODO: 実際に遊んだタイトルに置き換えてください。
 *   hours        … プレイ時間（不明なら省略）
 *   achievements … 解除数 / 総数（Steam 実績・PS トロフィー共通）
 *   trophies     … PlayStation のみ。グレード別の獲得数
 * ------------------------------------------------------------------ */

export type PlatformId = 'steam' | 'playstation' | 'xbox';

export interface PlatformInfo {
  id: PlatformId;
  label: string;
  /** 実績の呼び方 */
  achievementLabel: Text;
  color: string;
  /** true にするとサイトに表示しない（データは残る） */
  hidden?: boolean;
}

export const PLATFORMS: PlatformInfo[] = [
  {
    id: 'steam',
    label: 'Steam',
    achievementLabel: { ja: '実績', zh: '成就', en: 'Achievements' },
    color: '#1B2838',
  },
  {
    id: 'playstation',
    label: 'PlayStation',
    achievementLabel: { ja: 'トロフィー', zh: '奖杯', en: 'Trophies' },
    color: '#0070D1',
  },
  {
    id: 'xbox',
    label: 'Xbox',
    achievementLabel: { ja: '実績', zh: '成就', en: 'Achievements' },
    color: '#107C10',
    // 記録が少ないため非表示（表示するときはこの行を消す）
    hidden: true,
  },
];

export type TrophyRank = 'platinum' | 'gold' | 'silver' | 'bronze';

export const TROPHY_RANK_LABEL: Record<TrophyRank, Text> = {
  platinum: { ja: 'プラチナ', zh: '白金', en: 'Platinum' },
  gold: { ja: 'ゴールド', zh: '金', en: 'Gold' },
  silver: { ja: 'シルバー', zh: '银', en: 'Silver' },
  bronze: { ja: 'ブロンズ', zh: '铜', en: 'Bronze' },
};

export interface PlayRecord {
  id: string;
  title: string;
  platform: PlatformId;
  /** PS5 / PS4 など機種を書きたいとき */
  device?: string;
  /** カバー画像の URL */
  image?: string;
  hours?: number;
  /** ゲーム以外（Steam のソフトウェアなど）。合計には入れるが一覧には載せない */
  excluded?: boolean;
  achievements?: { unlocked: number; total: number };
  trophies?: Record<TrophyRank, number>;
  /** PlayStation のみ。グレード別のトロフィー総数 */
  trophyTotals?: Record<TrophyRank, number>;
  /** Steam のみ。解除した実績のアイコン（取得率の低い順） */
  achievementIcons?: { name: string; rate: number; icon: string }[];
  note?: Text;
}

/** 自動取得のデータがまだないときに表示する見本 */
const SAMPLE_PLAY_RECORDS: PlayRecord[] = [
  {
    id: 'steam-1',
    title: 'Game Title 1',
    platform: 'steam',
    hours: 0,
    achievements: { unlocked: 0, total: 0 },
    note: {
      ja: 'TODO: 印象に残った点を一行で',
      zh: 'TODO：用一句话写印象最深的地方',
      en: 'TODO: one line on what stood out',
    },
  },
  {
    id: 'ps-1',
    title: 'Game Title 2',
    platform: 'playstation',
    device: 'PS5',
    hours: 0,
    achievements: { unlocked: 0, total: 0 },
    trophies: { platinum: 0, gold: 0, silver: 0, bronze: 0 },
    note: {
      ja: 'TODO: 印象に残った点を一行で',
      zh: 'TODO：用一句话写印象最深的地方',
      en: 'TODO: one line on what stood out',
    },
  },
];

/* ------------------------------------------------------------------
 * 自動取得したプレイ履歴（npm run sync:play で更新）
 *   generated/play-history.json はスクリプトが書き出すファイルです。直接編集しないでください。
 *   ゲームごとの一言コメントは PLAY_NOTES に、自動取得できない作品は MANUAL_PLAY_RECORDS に書きます。
 * ------------------------------------------------------------------ */

type SyncedPlatform = { syncedAt: string; records: PlayRecord[] };
const SYNCED = (syncedPlayHistory as { platforms: Partial<Record<PlatformId, SyncedPlatform>> })
  .platforms;

/** 同期した日付（プラットフォームごと） */
export const PLATFORM_SYNCED_AT: Partial<Record<PlatformId, string>> = Object.fromEntries(
  Object.entries(SYNCED).map(([id, p]) => [id, p?.syncedAt ?? ''])
);

/** 自動取得したゲームに付ける一言コメント。キーはゲームのタイトル（例: "Ghost of Tsushima"） */
export const PLAY_NOTES: Record<string, Text> = {};

/** 自動取得できない作品を手で追加するとき */
export const MANUAL_PLAY_RECORDS: PlayRecord[] = [];

const syncedRecords: PlayRecord[] = Object.values(SYNCED).flatMap((p) => p?.records ?? []);

/* ------------------------------------------------------------------
 * 外すゲーム（play-exclusions.json）
 *   挂機・実績稼ぎ・ゲーム以外 … 一覧にも合計にも入れない
 *   minListHours 未満          … 一覧には出さないが、合計には入れる
 * ------------------------------------------------------------------ */

const normalizeTitle = (name: string) =>
  name.normalize('NFKC').toLowerCase().replace(/[™®©]/g, '').replace(/s+/g, ' ').trim();

const EXCLUDED_PATTERNS = [
  ...playExclusions.idle,
  ...playExclusions.achievementFarming,
  ...playExclusions.notGames,
];

/** 外すゲームか（末尾 * は前方一致） */
export const isExcludedGame = (title: string) => {
  const t = normalizeTitle(title);
  return EXCLUDED_PATTERNS.some((p) =>
    p.endsWith('*') ? t.startsWith(normalizeTitle(p.slice(0, -1))) : t === normalizeTitle(p)
  );
};

/**
 * 一覧に載せてよいか。外したゲームも合計（タイトル数・時間・実績）には入れ、一覧からだけ外す。
 */
export const isListableGame = (r: PlayRecord) =>
  !r.excluded &&
  !isExcludedGame(r.title) &&
  (!playExclusions.excludeNoAchievements || (r.achievements?.total ?? 0) > 0);

/** 一覧に載せる最低プレイ時間 */
export const MIN_LIST_HOURS = playExclusions.minListHours;

export const PLAY_RECORDS: PlayRecord[] = (
  syncedRecords.length > 0 ? [...syncedRecords, ...MANUAL_PLAY_RECORDS] : SAMPLE_PLAY_RECORDS
)
  // 非表示のプラットフォームは合計にも入れない
  .filter((r) => !PLATFORMS.find((p) => p.id === r.platform)?.hidden)
  .map((r) => ({ ...r, note: r.note ?? PLAY_NOTES[r.id] ?? PLAY_NOTES[r.title] }));

/* ------------------------------------------------------------------
 * スキル
 * ------------------------------------------------------------------ */

export interface DesignSkill {
  code: string;
  name: Text;
  desc: Text;
  example: string;
}

export const DESIGN_SKILLS: DesignSkill[] = [
  {
    code: 'BATTLE',
    name: { ja: 'バトルデザイン', zh: '战斗设计', en: 'Combat design' },
    desc: {
      ja: '近接で魔力を回復し、ブレイク後に長い詠唱を狙う。近接攻撃と魔法の役割を一つの戦闘にまとめます。',
      zh: '用近战恢复魔力，打出 Break 后争取长咏唱，让剑与魔法在战斗中各有作用。',
      en: 'Melee restores mana and Break opens a long casting window, giving sword and magic complementary roles.',
    },
    example: 'ARCANE CHRONICLE',
  },
  {
    code: 'LEVEL',
    name: { ja: 'レベルデザイン', zh: '关卡设计', en: 'Level design' },
    desc: {
      ja: '足場の配置をグレーボックスで組み、どこが見えるか、どこまで移動できるかを確認します。',
      zh: '先搭建白盒，确认玩家站在这里能看到哪里、能移动到哪里。',
      en: 'Greybox footholds to test where a player can see and move from a given point.',
    },
    example: 'ARCANE CHRONICLE / LEVEL BUILDER',
  },
  {
    code: 'TOOLS',
    name: { ja: 'ツール制作', zh: '工具制作', en: 'Tool development' },
    desc: {
      ja: '視界・ジャンプ軌道・エフェクトなど、検証に必要な道具を自分で作ります。',
      zh: '视野、跳跃轨迹、特效等验证需要的工具，自己动手做。',
      en: 'Build the tools needed for testing — sight lines, jump arcs, visual effects.',
    },
    example: 'LEVEL BUILDER / GSPARTICLESTUDIO',
  },
  {
    code: 'SPEC',
    name: { ja: '仕様の共有', zh: '规格整理', en: 'Design specs' },
    desc: {
      ja: '操作や敵の挙動を整理し、チームで使える仕様に落とし込みます。',
      zh: '梳理操作和敌人行为，写成团队可用的规格。',
      en: 'Document controls and enemy behaviour so the team works from the same spec.',
    },
    example: 'ARCANE CHRONICLE',
  },
];

/*
 * 普段使っているツール・開発環境
 * TODO と書いてある項目は、実際に使っているものに書き換えてください（不要なら行ごと削除）。
 */
export interface ToolItem {
  name: string;
  note?: Text;
}

export interface ToolGroup {
  code: string;
  name: Text;
  items: ToolItem[];
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    code: 'ENGINE',
    name: { ja: 'ゲームエンジン', zh: '游戏引擎', en: 'Game engine' },
    items: [
      {
        name: 'Unity',
        note: {
          ja: 'チーム制作・プロトタイプ',
          zh: '团队制作与原型',
          en: 'Team project and prototypes',
        },
      },
    ],
  },
  {
    code: 'LANGUAGE',
    name: { ja: 'プログラミング言語', zh: '编程语言', en: 'Languages' },
    items: [
      { name: 'C#', note: { ja: 'Unity のゲーム制作', zh: 'Unity 游戏开发', en: 'Unity gameplay' } },
      { name: 'C++' },
      {
        name: 'TypeScript',
        note: { ja: 'Level Builder・Web ツール', zh: 'Level Builder 等网页工具', en: 'Level Builder and web tools' },
      },
      { name: 'GLSL', note: { ja: 'エフェクト・シェーダー', zh: '特效与着色器', en: 'Effects and shaders' } },
    ],
  },
  {
    code: '3D / VFX',
    name: { ja: '3D・エフェクト', zh: '3D 与特效', en: '3D & VFX' },
    items: [
      { name: 'Three.js', note: { ja: 'ブラウザの 3D 表示', zh: '浏览器 3D 显示', en: 'Browser 3D' } },
      { name: 'Blender', note: { ja: 'モデル・グレーボックス', zh: '模型与白盒', en: 'Models and greyboxes' } },
    ],
  },
  {
    code: 'DEV ENV',
    name: { ja: '開発環境', zh: '开发环境', en: 'Development environment' },
    items: [
      { name: 'Git / GitHub', note: { ja: 'バージョン管理・公開', zh: '版本管理与发布', en: 'Version control and publishing' } },
      { name: 'TODO: エディタ / IDE（例: Visual Studio, Rider, VS Code）' },
      { name: 'TODO: OS（例: Windows）' },
    ],
  },
  {
    code: 'PLANNING',
    name: { ja: '企画・資料作成', zh: '策划与文档', en: 'Planning & documents' },
    items: [
      { name: 'TODO: 仕様書・資料のツール（例: Excel, Google スプレッドシート, PowerPoint）' },
      { name: 'TODO: 図・ホワイトボード（例: Miro, draw.io）' },
    ],
  },
];

/** カードのプレビュー用（TODO を除いた名前の一覧） */
export const TOOL_SKILLS: string[] = TOOL_GROUPS.flatMap((g) => g.items.map((i) => i.name)).filter(
  (n) => !n.startsWith('TODO')
);

/* ------------------------------------------------------------------
 * 画面の文言
 * ------------------------------------------------------------------ */

export const PROFILE_COPY: Record<
  Locale,
  {
    cards: Record<ProfileTopic, { code: string; title: string; lead: string }>;
    openCard: string;
    detailHeading: string;
    back: string;
    totalHours: string;
    playedGames: string;
    completed: string;
    syncedFrom: string;
    shownNote: (top: number, total: number) => string;
    sortLabel: string;
    sortHours: string;
    sortTrophies: string;
    hoursUnit: string;
    gamesCount: string;
    designSkills: string;
    toolSkills: string;
    interests: string;
    favoriteGames: string;
    strengths: string;
    weaknesses: string;
    usedIn: string;
  }
> = {
  ja: {
    cards: {
      intro: { code: 'ABOUT', title: '自己紹介', lead: '経歴・趣味・好きなゲーム・長所短所。' },
      qa: { code: 'Q&A', title: '一問一答', lead: '質問形式で自己紹介します。' },
      playlog: { code: 'PLAY LOG', title: 'プレイ履歴', lead: 'プラットフォーム別の作品と実績。' },
      skills: { code: 'SKILLS', title: 'スキル', lead: '設計の得意分野と、普段使うツール・環境。' },
    },
    openCard: '詳しく見る',
    detailHeading: 'プロフィール',
    back: 'トップへ戻る',
    totalHours: '合計プレイ時間',
    playedGames: '遊んだ作品',
    completed: 'コンプリート',
    syncedFrom: '自動取得',
    shownNote: (top, total) => `上位 ${top} タイトルを表示（合計は全 ${total} タイトル）`,
    sortLabel: '並び替え',
    sortHours: 'プレイ時間',
    sortTrophies: 'トロフィー',
    hoursUnit: '時間',
    gamesCount: 'タイトル',
    designSkills: '設計スキル',
    toolSkills: '普段使っているツール・開発環境',
    interests: '趣味',
    favoriteGames: '好きなゲーム BEST 10',
    strengths: '長所',
    weaknesses: '短所と向き合い方',
    usedIn: '実例',
  },
  zh: {
    cards: {
      intro: { code: 'ABOUT', title: '个人介绍', lead: '经历、兴趣、喜欢的游戏与长短处。' },
      qa: { code: 'Q&A', title: '问答式简介', lead: '用一问一答的方式介绍自己。' },
      playlog: { code: 'PLAY LOG', title: '游玩履历', lead: '按平台展示的作品与成就。' },
      skills: { code: 'SKILLS', title: '技能', lead: '擅长的设计方向，以及常用工具与环境。' },
    },
    openCard: '查看详情',
    detailHeading: '个人档案',
    back: '返回首页',
    totalHours: '总游玩时间',
    playedGames: '玩过的作品',
    completed: '全成就',
    syncedFrom: '自动同步',
    shownNote: (top, total) => `显示前 ${top} 款（合计包含全部 ${total} 款）`,
    sortLabel: '排序',
    sortHours: '游玩时长',
    sortTrophies: '奖杯',
    hoursUnit: '小时',
    gamesCount: '部作品',
    designSkills: '设计能力',
    toolSkills: '常用工具与开发环境',
    interests: '兴趣爱好',
    favoriteGames: '喜欢的游戏 BEST 10',
    strengths: '长处',
    weaknesses: '短处与应对',
    usedIn: '实例',
  },
  en: {
    cards: {
      intro: { code: 'ABOUT', title: 'About Me', lead: 'Background, interests, favorite games, strengths.' },
      qa: { code: 'Q&A', title: 'Q&A', lead: 'A short introduction in questions.' },
      playlog: { code: 'PLAY LOG', title: 'Play History', lead: 'Games and achievements by platform.' },
      skills: { code: 'SKILLS', title: 'Skills', lead: 'Design strengths, everyday tools and environment.' },
    },
    openCard: 'View details',
    detailHeading: 'Profile',
    back: 'Back to portfolio',
    totalHours: 'Total play time',
    playedGames: 'Games played',
    completed: 'Completed',
    syncedFrom: 'Synced',
    shownNote: (top, total) => `Showing the top ${top} (totals include all ${total})`,
    sortLabel: 'Sort by',
    sortHours: 'Play time',
    sortTrophies: 'Trophies',
    hoursUnit: 'h',
    gamesCount: 'games',
    designSkills: 'Design skills',
    toolSkills: 'Everyday tools & environment',
    interests: 'Interests',
    favoriteGames: 'Favorite games — Best 10',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses & how I handle them',
    usedIn: 'Example',
  },
};

export const PROFILE_TOPICS: ProfileTopic[] = ['intro', 'qa', 'playlog', 'skills'];

/** 合計プレイ時間（0.1 時間単位の値を足してから整数に丸める） */
export const totalPlayHours = (records: PlayRecord[] = PLAY_RECORDS) =>
  Math.round(records.reduce((sum, r) => sum + (r.hours ?? 0), 0));

/** 1 本ぶんのプレイ時間の表示（10 時間以上は整数、未満は小数 1 桁） */
export const formatHours = (hours: number) =>
  hours >= 10 ? String(Math.round(hours)) : String(Math.round(hours * 10) / 10);

/** PlayStation のトロフィーをグレード別に合計する */
export const trophyGradeTotals = (records: PlayRecord[] = PLAY_RECORDS) =>
  records.reduce(
    (acc, r) => {
      for (const k of ['platinum', 'gold', 'silver', 'bronze'] as TrophyRank[]) acc[k] += r.trophies?.[k] ?? 0;
      return acc;
    },
    { platinum: 0, gold: 0, silver: 0, bronze: 0 } as Record<TrophyRank, number>
  );

export const totalAchievements = (records: PlayRecord[] = PLAY_RECORDS) =>
  records.reduce((sum, r) => sum + (r.achievements?.unlocked ?? 0), 0);

/** 1 本以上あるプラットフォームだけを、PLATFORMS の順に返す */
/** 一覧の並び順 */
export type PlaylogSort = 'hours' | 'trophies';

/**
 * 「トロフィー／実績」で並べるときの点数。
 *   PlayStation … PSN と同じ重みのトロフィーポイント（プラチナ 300・ゴールド 90・シルバー 30・ブロンズ 15）
 *   Steam       … 実績の達成率（実績を大量に付けたゲームが上位を占めないように、数ではなく割合で比べる）
 * ※ scripts/sync-play-history.mjs の coverScore と同じ計算にしておく
 */
const TROPHY_POINTS: Record<TrophyRank, number> = { platinum: 300, gold: 90, silver: 30, bronze: 15 };
export const trophyScore = (r: PlayRecord) =>
  r.trophies
    ? (Object.keys(TROPHY_POINTS) as TrophyRank[]).reduce((sum, k) => sum + r.trophies![k] * TROPHY_POINTS[k], 0)
    : r.achievements && r.achievements.total > 0
      ? r.achievements.unlocked / r.achievements.total
      : 0;

/** 並び替え（同点はプレイ時間の長い順） */
export const sortPlayRecords = (records: PlayRecord[], sort: PlaylogSort) =>
  [...records].sort((a, b) =>
    sort === 'trophies'
      ? trophyScore(b) - trophyScore(a) || (b.hours ?? 0) - (a.hours ?? 0)
      : (b.hours ?? 0) - (a.hours ?? 0)
  );

/**
 * プラットフォームごとに、プレイ時間の長い順で返す。
 *   records … 合計の計算用（外したゲーム以外すべて）
 *   listed  … 一覧に載せる候補（MIN_LIST_HOURS 時間以上）
 */
export const recordsByPlatform = () =>
  PLATFORMS.filter((p) => !p.hidden).map((p) => {
    const records = PLAY_RECORDS.filter((r) => r.platform === p.id).sort(
      (x, y) => (y.hours ?? 0) - (x.hours ?? 0)
    );
    return {
      platform: p,
      records,
      listed: records.filter((r) => isListableGame(r) && (r.hours ?? 0) >= MIN_LIST_HOURS),
    };
  }).filter((g) => g.records.length > 0);
