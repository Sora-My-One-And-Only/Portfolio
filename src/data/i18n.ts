export type Locale = 'ja' | 'zh' | 'en';

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
  frameTable: {
    moveName: Record<Locale, string>;
    startup: string;
    active: string;
    recovery: string;
    onBlock: string;
    damage: string;
  }[];
  repoName: string;
}

export interface EraNode {
  id: string;
  yearRange: string;
  eraBadge: string;
  consoleInspiration: Record<Locale, string>;
  title: Record<Locale, string>;
  philosophy: Record<Locale, string>;
  studentMilestone: Record<Locale, string>;
  analyzedGames: string[];
  coreTakeaway: Record<Locale, string>;
}

export interface FallbackRepo {
  id: number;
  name: string;
  html_url: string;
  description: Record<Locale, string>;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  latestCommit: {
    sha: string;
    message: Record<Locale, string>;
    date: string;
  };
}

export const PORTFOLIO_IMAGES = {
  combatSystem: new URL(
    '../assets/images/portfolio_combat_frame_system_1793888637807.jpg',
    import.meta.url
  ).href,
  levelTopography: new URL(
    '../assets/images/portfolio_level_topography_1793888661621.jpg',
    import.meta.url
  ).href,
  bossAiBehavior: new URL(
    '../assets/images/portfolio_boss_ai_behavior_1793888626526.jpg',
    import.meta.url
  ).href,
  retroArchive: new URL(
    '../assets/images/portfolio_retro_console_archive_1793888665880.jpg',
    import.meta.url
  ).href,
};

export const PROJECTS_DATA: ProjectSpec[] = [
  {
    id: 'work-slot-01',
    code: 'SLOT-01',
    span: 'wide',
    image: PORTFOLIO_IMAGES.combatSystem,
    roleTag: {
      ja: '[機能展示位置：担当職種・役割タグ 01]',
      zh: '[功能展示位置：担任职责与岗位标签 01]',
      en: '[Functional Slot: Role & Specialty Tag 01]',
    },
    engineTag: '[ENGINE / TOOL TAG 01]',
    year: 'YYYY',
    title: {
      ja: '[機能展示位置：代表作タイトル枠 01（クリックで詳細・試遊サブページへ）]',
      zh: '[功能展示位置：代表作主标题槽位 01（点击进入详情与试玩子页面）]',
      en: '[Functional Slot: Flagship Work Title 01 (Click to Open Spec & Playable Subpage)]',
    },
    summary: {
      ja: '/* 機能展示位置注釈：ここに代表作 01 の概要テキスト（1〜2文の要約・コア体験の説明）を配置します。 */',
      zh: '/* 功能展示位置注释：此处用于展示代表作 01 的核心简介文本（1~2句话概括玩法特征与个人贡献）。 */',
      en: '/* Functional Slot Annotation: Place a 1-2 sentence summary describing Flagship Work 01 and your core contribution here. */',
    },
    designIntent: {
      ja: '/* 機能展示位置注釈：作品詳細サブページ内の「企画意図 (DESIGN INTENT)」テキスト枠。制作背景やターゲット体験を記述します。 */',
      zh: '/* 功能展示位置注释：作品详情子页面内的「企划意图 (DESIGN INTENT)」正文展示位，用于阐述立项背景与核心体验目标。 */',
      en: '/* Functional Slot Annotation: "Design Intent" body slot inside the Work Detail Subpage. */',
    },
    keyMechanics: {
      ja: [
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 01-A]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 01-B]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 01-C]',
      ],
      zh: [
        '[功能展示位置：核心机制/亮点图版旁注槽位 01-A]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 01-B]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 01-C]',
      ],
      en: [
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 01-A]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 01-B]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 01-C]',
      ],
    },
    metrics: [
      {
        label: {
          ja: '[指標ラベル枠 01]',
          zh: '[参数指标名称槽位 01]',
          en: '[Metric Label Slot 01]',
        },
        value: '[VALUE 01]',
      },
      {
        label: {
          ja: '[指標ラベル枠 02]',
          zh: '[参数指标名称槽位 02]',
          en: '[Metric Label Slot 02]',
        },
        value: '[VALUE 02]',
      },
      {
        label: {
          ja: '[指標ラベル枠 03]',
          zh: '[参数指标名称槽位 03]',
          en: '[Metric Label Slot 03]',
        },
        value: '[VALUE 03]',
      },
    ],
    frameTable: [
      {
        moveName: {
          ja: '[仕様データ表・行 01]',
          zh: '[仕样参数表·数据行 01]',
          en: '[Spec Data Table Row 01]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
      {
        moveName: {
          ja: '[仕様データ表・行 02]',
          zh: '[仕样参数表·数据行 02]',
          en: '[Spec Data Table Row 02]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
      {
        moveName: {
          ja: '[仕様データ表・行 03]',
          zh: '[仕样参数表·数据行 03]',
          en: '[Spec Data Table Row 03]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
    ],
    repoName: 'project-repo-slot-01',
  },
  {
    id: 'work-slot-02',
    code: 'SLOT-02',
    span: 'normal',
    image: PORTFOLIO_IMAGES.levelTopography,
    roleTag: {
      ja: '[機能展示位置：担当職種・役割タグ 02]',
      zh: '[功能展示位置：担任职责与岗位标签 02]',
      en: '[Functional Slot: Role & Specialty Tag 02]',
    },
    engineTag: '[ENGINE / TOOL TAG 02]',
    year: 'YYYY',
    title: {
      ja: '[機能展示位置：代表作タイトル枠 02（クリックで詳細・試遊サブページへ）]',
      zh: '[功能展示位置：代表作主标题槽位 02（点击进入详情与试玩子页面）]',
      en: '[Functional Slot: Flagship Work Title 02 (Click to Open Spec & Playable Subpage)]',
    },
    summary: {
      ja: '/* 機能展示位置注釈：ここに代表作 02 の概要テキスト（レベル設計やシステム仕様の要約）を配置します。 */',
      zh: '/* 功能展示位置注释：此处用于展示代表作 02 的核心简介文本（支持多语言无跳变切换）。 */',
      en: '/* Functional Slot Annotation: Place a summary describing Flagship Work 02 here. */',
    },
    designIntent: {
      ja: '/* 機能展示位置注釈：作品 02 の詳細サブページ内「企画意図」テキスト枠。 */',
      zh: '/* 功能展示位置注释：作品 02 详情子页面内的「企划意图」正文展示位。 */',
      en: '/* Functional Slot Annotation: "Design Intent" body slot for Work 02. */',
    },
    keyMechanics: {
      ja: [
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 02-A]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 02-B]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 02-C]',
      ],
      zh: [
        '[功能展示位置：核心机制/亮点图版旁注槽位 02-A]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 02-B]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 02-C]',
      ],
      en: [
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 02-A]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 02-B]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 02-C]',
      ],
    },
    metrics: [
      {
        label: {
          ja: '[指標ラベル枠 01]',
          zh: '[参数指标名称槽位 01]',
          en: '[Metric Label Slot 01]',
        },
        value: '[VALUE 01]',
      },
      {
        label: {
          ja: '[指標ラベル枠 02]',
          zh: '[参数指标名称槽位 02]',
          en: '[Metric Label Slot 02]',
        },
        value: '[VALUE 02]',
      },
      {
        label: {
          ja: '[指標ラベル枠 03]',
          zh: '[参数指标名称槽位 03]',
          en: '[Metric Label Slot 03]',
        },
        value: '[VALUE 03]',
      },
    ],
    frameTable: [
      {
        moveName: {
          ja: '[仕様データ表・行 01]',
          zh: '[仕样参数表·数据行 01]',
          en: '[Spec Data Table Row 01]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
      {
        moveName: {
          ja: '[仕様データ表・行 02]',
          zh: '[仕样参数表·数据行 02]',
          en: '[Spec Data Table Row 02]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
    ],
    repoName: 'project-repo-slot-02',
  },
  {
    id: 'work-slot-03',
    code: 'SLOT-03',
    span: 'normal',
    image: PORTFOLIO_IMAGES.bossAiBehavior,
    roleTag: {
      ja: '[機能展示位置：担当職種・役割タグ 03]',
      zh: '[功能展示位置：担任职责与岗位标签 03]',
      en: '[Functional Slot: Role & Specialty Tag 03]',
    },
    engineTag: '[ENGINE / TOOL TAG 03]',
    year: 'YYYY',
    title: {
      ja: '[機能展示位置：代表作タイトル枠 03（クリックで詳細・試遊サブページへ）]',
      zh: '[功能展示位置：代表作主标题槽位 03（点击进入详情与试玩子页面）]',
      en: '[Functional Slot: Flagship Work Title 03 (Click to Open Spec & Playable Subpage)]',
    },
    summary: {
      ja: '/* 機能展示位置注釈：ここに代表作 03 の概要テキストを配置します。 */',
      zh: '/* 功能展示位置注释：此处用于展示代表作 03 的核心简介文本。 */',
      en: '/* Functional Slot Annotation: Place a summary describing Flagship Work 03 here. */',
    },
    designIntent: {
      ja: '/* 機能展示位置注釈：作品 03 の詳細サブページ内「企画意図」テキスト枠。 */',
      zh: '/* 功能展示位置注释：作品 03 详情子页面内的「企划意图」正文展示位。 */',
      en: '/* Functional Slot Annotation: "Design Intent" body slot for Work 03. */',
    },
    keyMechanics: {
      ja: [
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 03-A]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 03-B]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 03-C]',
      ],
      zh: [
        '[功能展示位置：核心机制/亮点图版旁注槽位 03-A]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 03-B]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 03-C]',
      ],
      en: [
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 03-A]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 03-B]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 03-C]',
      ],
    },
    metrics: [
      {
        label: {
          ja: '[指標ラベル枠 01]',
          zh: '[参数指标名称槽位 01]',
          en: '[Metric Label Slot 01]',
        },
        value: '[VALUE 01]',
      },
      {
        label: {
          ja: '[指標ラベル枠 02]',
          zh: '[参数指标名称槽位 02]',
          en: '[Metric Label Slot 02]',
        },
        value: '[VALUE 02]',
      },
      {
        label: {
          ja: '[指標ラベル枠 03]',
          zh: '[参数指标名称槽位 03]',
          en: '[Metric Label Slot 03]',
        },
        value: '[VALUE 03]',
      },
    ],
    frameTable: [
      {
        moveName: {
          ja: '[仕様データ表・行 01]',
          zh: '[仕样参数表·数据行 01]',
          en: '[Spec Data Table Row 01]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
      {
        moveName: {
          ja: '[仕様データ表・行 02]',
          zh: '[仕样参数表·数据行 02]',
          en: '[Spec Data Table Row 02]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
    ],
    repoName: 'project-repo-slot-03',
  },
  {
    id: 'work-slot-04',
    code: 'SLOT-04',
    span: 'wide',
    image: PORTFOLIO_IMAGES.retroArchive,
    roleTag: {
      ja: '[機能展示位置：担当職種・役割タグ 04]',
      zh: '[功能展示位置：担任职责与岗位标签 04]',
      en: '[Functional Slot: Role & Specialty Tag 04]',
    },
    engineTag: '[ENGINE / TOOL TAG 04]',
    year: 'YYYY',
    title: {
      ja: '[機能展示位置：代表作タイトル枠 04（クリックで詳細・試遊サブページへ）]',
      zh: '[功能展示位置：代表作主标题槽位 04（点击进入详情与试玩子页面）]',
      en: '[Functional Slot: Flagship Work Title 04 (Click to Open Spec & Playable Subpage)]',
    },
    summary: {
      ja: '/* 機能展示位置注釈：ここに代表作 04 の概要テキストを配置します。 */',
      zh: '/* 功能展示位置注释：此处用于展示代表作 04 的核心简介文本。 */',
      en: '/* Functional Slot Annotation: Place a summary describing Flagship Work 04 here. */',
    },
    designIntent: {
      ja: '/* 機能展示位置注釈：作品 04 の詳細サブページ内「企画意図」テキスト枠。 */',
      zh: '/* 功能展示位置注释：作品 04 详情子页面内的「企划意图」正文展示位。 */',
      en: '/* Functional Slot Annotation: "Design Intent" body slot for Work 04. */',
    },
    keyMechanics: {
      ja: [
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 04-A]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 04-B]',
        '[機能展示位置：主要メカニクス・特徴コールアウト注釈 04-C]',
      ],
      zh: [
        '[功能展示位置：核心机制/亮点图版旁注槽位 04-A]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 04-B]',
        '[功能展示位置：核心机制/亮点图版旁注槽位 04-C]',
      ],
      en: [
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 04-A]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 04-B]',
        '[Functional Slot: Key Mechanic / Feature Callout Annotation 04-C]',
      ],
    },
    metrics: [
      {
        label: {
          ja: '[指標ラベル枠 01]',
          zh: '[参数指标名称槽位 01]',
          en: '[Metric Label Slot 01]',
        },
        value: '[VALUE 01]',
      },
      {
        label: {
          ja: '[指標ラベル枠 02]',
          zh: '[参数指标名称槽位 02]',
          en: '[Metric Label Slot 02]',
        },
        value: '[VALUE 02]',
      },
      {
        label: {
          ja: '[指標ラベル枠 03]',
          zh: '[参数指标名称槽位 03]',
          en: '[Metric Label Slot 03]',
        },
        value: '[VALUE 03]',
      },
    ],
    frameTable: [
      {
        moveName: {
          ja: '[仕様データ表・行 01]',
          zh: '[仕样参数表·数据行 01]',
          en: '[Spec Data Table Row 01]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
      {
        moveName: {
          ja: '[仕様データ表・行 02]',
          zh: '[仕样参数表·数据行 02]',
          en: '[Spec Data Table Row 02]',
        },
        startup: '[COL-A]',
        active: '[COL-B]',
        recovery: '[COL-C]',
        onBlock: '[COL-D]',
        damage: '[COL-E]',
      },
    ],
    repoName: 'project-repo-slot-04',
  },
];

export const ERA_CHRONICLES: EraNode[] = [];

export const FALLBACK_GITHUB_REPOS: FallbackRepo[] = [
  {
    id: 101,
    name: 'github-repo-slot-01',
    html_url: 'https://github.com',
    description: {
      ja: '/* 機能展示位置注釈：GitHub リポジトリカード 01 の説明文表示枠（上の入力欄に GitHub ID を入力すると実データを自動取得します）。 */',
      zh: '/* 功能展示位置注释：GitHub 开源仓库卡片 01 简介槽位（在上方输入您的 GitHub 用户名可实时拉取真实仓库数据）。 */',
      en: '/* Functional Slot Annotation: GitHub Repository Card 01 description slot (Enter your GitHub ID above to fetch live repos). */',
    },
    language: 'LANG-01',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-01-01T00:00:00Z',
    topics: ['topic-slot-1', 'topic-slot-2'],
    latestCommit: {
      sha: '0000000',
      message: {
        ja: '[最新コミットメッセージ表示枠]',
        zh: '[最近 Commit 提交信息展示位]',
        en: '[Latest Commit Message Slot]',
      },
      date: 'YYYY-MM-DD',
    },
  },
  {
    id: 102,
    name: 'github-repo-slot-02',
    html_url: 'https://github.com',
    description: {
      ja: '/* 機能展示位置注釈：GitHub リポジトリカード 02 の説明文表示枠。 */',
      zh: '/* 功能展示位置注释：GitHub 开源仓库卡片 02 简介槽位。 */',
      en: '/* Functional Slot Annotation: GitHub Repository Card 02 description slot. */',
    },
    language: 'LANG-02',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-01-01T00:00:00Z',
    topics: ['topic-slot-1', 'topic-slot-2'],
    latestCommit: {
      sha: '0000000',
      message: {
        ja: '[最新コミットメッセージ表示枠]',
        zh: '[最近 Commit 提交信息展示位]',
        en: '[Latest Commit Message Slot]',
      },
      date: 'YYYY-MM-DD',
    },
  },
  {
    id: 103,
    name: 'github-repo-slot-03',
    html_url: 'https://github.com',
    description: {
      ja: '/* 機能展示位置注釈：GitHub リポジトリカード 03 の説明文表示枠。 */',
      zh: '/* 功能展示位置注释：GitHub 开源仓库卡片 03 简介槽位。 */',
      en: '/* Functional Slot Annotation: GitHub Repository Card 03 description slot. */',
    },
    language: 'LANG-03',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-01-01T00:00:00Z',
    topics: ['topic-slot-1', 'topic-slot-2'],
    latestCommit: {
      sha: '0000000',
      message: {
        ja: '[最新コミットメッセージ表示枠]',
        zh: '[最近 Commit 提交信息展示位]',
        en: '[Latest Commit Message Slot]',
      },
      date: 'YYYY-MM-DD',
    },
  },
];

export const UI_TEXT = {
  ja: {
    github: {
      fetchBtn: 'GitHub同期',
    },
    contact: {
      nameLabel: '[機能展示枠：送信者氏名ラベル]',
      namePlaceholder: '[入力枠：氏名・所属]',
      emailLabel: '[機能展示枠：メールアドレスラベル]',
      emailPlaceholder: '[入力枠：email@example.com]',
      messageLabel: '[機能展示枠：メッセージ本文ラベル]',
      messagePlaceholder: '[入力枠：連絡・面談メッセージ本文入力エリア]',
      submitBtn: '[機能ボタン：メッセージ送信]',
      successTitle: '[機能展示枠：送信完了フィードバック見出し]',
      successDesc: '/* 機能展示位置注釈：フォーム送信完了時に表示される確認メッセージ枠です。 */',
    },
  },
  zh: {
    github: {
      fetchBtn: '同步仓库',
    },
    contact: {
      nameLabel: '[功能展示位：寄件人姓名标签]',
      namePlaceholder: '[输入框：姓名 / 所属团队]',
      emailLabel: '[功能展示位：联系邮箱标签]',
      emailPlaceholder: '[输入框：email@example.com]',
      messageLabel: '[功能展示位：留言正文标签]',
      messagePlaceholder: '[输入框：面试邀约或合作留言输入区域]',
      submitBtn: '[功能按钮：发送联系信函]',
      successTitle: '[功能展示位：发送成功状态标题]',
      successDesc: '/* 功能展示位置注释：表单提交成功后显示的反馈提示文本槽位。 */',
    },
  },
  en: {
    github: {
      fetchBtn: 'Sync Repos',
    },
    contact: {
      nameLabel: '[Slot: Sender Name Label]',
      namePlaceholder: '[Input: Name / Studio]',
      emailLabel: '[Slot: Email Label]',
      emailPlaceholder: '[Input: email@example.com]',
      messageLabel: '[Slot: Message Body Label]',
      messagePlaceholder: '[Input: Message / Inquiry Textarea]',
      submitBtn: '[Action Button: Submit Form]',
      successTitle: '[Slot: Submission Confirmed Heading]',
      successDesc: '/* Functional Slot Annotation: Confirmation message displayed after form submission. */',
    },
  },
};
