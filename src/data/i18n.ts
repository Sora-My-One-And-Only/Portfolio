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
    id: 'oni-blade-combat',
    code: 'SPEC-01',
    span: 'wide',
    image: PORTFOLIO_IMAGES.combatSystem,
    roleTag: {
      ja: '戦闘企画 · アクションフレーム設計',
      zh: '战斗策划 · 动作帧数与受击判定设计',
      en: 'Battle Planner · Frame Data & Hitbox Spec',
    },
    engineTag: 'Unity 6 / C# / Web Frame Tool',
    year: '2026',
    title: {
      ja: '『鬼刃 -ONI BLADE-』剣戟パリィ＆ヒットストップ検証仕様書',
      zh: '《鬼刃 -ONI BLADE-》剑戟弹反与卡肉帧数验证企划案',
      en: 'ONI BLADE: Sword Parry & Hitstop Frame Validation System',
    },
    summary: {
      ja: '60FPS基準の近接戦闘アクションプロトタイプ。発生・持続・硬直フレームとジャストパリィ受付窓口（6F）を定量化し、リスクとリターンの手触りを徹底追求。',
      zh: '基于 60FPS 标准的近战动作原型。量化设计攻击前摇、持续、后摇与精准弹反判定窗口（6F），打磨高风险高回报的刀剑博弈手感。',
      en: '60FPS melee combat prototype quantifying startup, active, and recovery frames alongside a 6F Just-Parry window for crisp risk-reward swordplay.',
    },
    designIntent: {
      ja: '日本のハイスピード剣戟アクション（『SEKIRO』『Devil May Cry』等）における「敵の予備動作を見てから反応できるギリギリの納得感」を検証するため、人間の視覚反応速度（約15〜18F）を基準にボスの強攻撃予備動作を22Fに設定。パリィ成功時は10Fのヒットストップとカメラシェイクを同期させ、体幹ゲージ削り量を通常の3.2倍に設計しました。',
      zh: '为了还原日式高速剑戟动作游戏（如《只狼》《鬼泣》）中“看清起手动作后再反应依然来得及”的爽快感与公平性，以人类视觉反应极限（约 15~18 帧）为基准，将精英怪重劈前摇定为 22F。成功触发精准弹反时同步施加 10F 卡肉停顿与镜头震动，架势槽削减倍率设为普通防御的 3.2 倍。',
      en: 'Designed around human visual reaction thresholds (15-18F at 60FPS), setting heavy enemy windups to 22F so players feel fair mastery. Successful Just-Parries trigger a synchronized 10F hitstop and 3.2x posture damage multiplier.',
    },
    keyMechanics: {
      ja: [
        '先行入力バッファ（8フレーム）によるコンボ途切れ防止と直感的なレスポンス',
        'ヒットストップの動的スケーリング：弱攻撃（3F）・強攻撃（7F）・弾き返し（10F）',
        'キャンセルルート設計：通常斬り持続最終フレームからステップ・居合納刀へ派生可能',
      ],
      zh: [
        '8 帧预输入缓冲窗口（Input Buffer），消除连段断触感并提升操作容错',
        '动态卡肉缩放机制：轻击（3F）· 重劈（7F）· 完美弹反（10F）',
        '派生取消路由：普通斩击有效帧末段可直接派生垫步闪避或居合纳刀蓄力',
      ],
      en: [
        '8-frame input buffer window preventing dropped chains during high-tempo exchanges',
        'Dynamic hitstop scaling: Light Slash (3F), Heavy Cleave (7F), Perfect Deflect (10F)',
        'Cancel routing: Late active frames branch seamlessly into quick-step or Iai stance',
      ],
    },
    metrics: [
      { label: { ja: '目標フレームレート', zh: '目标基准帧率', en: 'Target Frame Rate' }, value: '60 FPS (16.6ms)' },
      { label: { ja: 'ジャストパリィ受付', zh: '完美弹反窗口', en: 'Just-Parry Window' }, value: '6 Frames (100ms)' },
      { label: { ja: 'テストプレイ満足度', zh: '实机手感测试评分', en: 'Playtest Feel Score' }, value: '4.85 / 5.0 (N=42)' },
    ],
    frameTable: [
      {
        moveName: { ja: '壱ノ型・袈裟斬り (Light 1)', zh: '壹之型·袈裟斩 (轻击1)', en: 'Slash I: Diagonal Cut' },
        startup: '8F',
        active: '3F',
        recovery: '14F',
        onBlock: '-2F',
        damage: '110',
      },
      {
        moveName: { ja: '居合・抜刀一閃 (Iai Burst)', zh: '居合·拔刀一闪 (蓄力派生)', en: 'Iai Stance: Flash Draw' },
        startup: '12F',
        active: '4F',
        recovery: '18F',
        onBlock: '+3F',
        damage: '240',
      },
      {
        moveName: { ja: '見切り・弾き返し (Deflect)', zh: '见切·弹反架势 (防御反击)', en: 'Deflect Counter' },
        startup: '2F',
        active: '6F',
        recovery: '15F',
        onBlock: '+12F (Stagger)',
        damage: '0 (Posture 320)',
      },
      {
        moveName: { ja: '兜割り・跳躍重撃 (Plunge)', zh: '兜割·跳跃重劈 (破防技)', en: 'Helm Breaker Plunge' },
        startup: '21F',
        active: '5F',
        recovery: '26F',
        onBlock: '-8F',
        damage: '360',
      },
    ],
    repoName: 'oni-blade-combat-frame-lab',
  },
  {
    id: 'citadel-level-topography',
    code: 'SPEC-02',
    span: 'normal',
    image: PORTFOLIO_IMAGES.levelTopography,
    roleTag: {
      ja: 'レベルデザイン · 箱庭動線設計',
      zh: '关卡策划 · 立体箱庭动线与视线引导',
      en: 'Level Designer · 3D Box-Garden Topology',
    },
    engineTag: 'Unreal Engine 5 / Greybox Tool',
    year: '2026',
    title: {
      ja: '『灰鐘の城塞』高低差ループ＆一方通行ショートカット設計',
      zh: '《灰钟城塞》多层立体回环与单向捷径关卡设计案',
      en: 'Ashen Bell Citadel: Vertical Loop & Shortcut Level Spec',
    },
    summary: {
      ja: '1つの篝火（拠点）を中心に3層の垂直探索ルートが交差する箱庭マップ。「先に見えるが行けないランドマーク」と開通時のカタルシスを構造化。',
      zh: '以单一营火（核心存档点）为圆心交织三层垂直探索动线的立体箱庭地图。系统化设计“看得见却暂时去不了的视觉地标”与捷径打通时的柳暗花明感。',
      en: 'Three-tier vertical box-garden level anchored around a single central hub, structured around visual landmarks and shortcut catharsis.',
    },
    designIntent: {
      ja: 'プレイヤーが迷子にならずに探索の緊張感を楽しめるよう、城門入口から最上層のボス部屋を最初に視界へ収める「ランドマーク視線誘導（Sightline Anchoring）」を採用。中盤の地下牢を抜けた後の昇降機が初期広場へ繋がる構造により、再挑戦時の移動時間を72%短縮しています。',
      zh: '为了让玩家在无小地图指引下依然保持方向感，在踏入城门第 5 秒即通过高差豁口让玩家仰视远处的顶层钟楼（视觉锚点引导）。经历地下水道高强度遭遇战后开启升降梯直通初始庭院，使跑图重试耗时缩短 72%。',
      en: 'Uses Sightline Anchoring so players spot the bell-tower boss arena within 5 seconds of entry, culminating in an elevator shortcut that cuts boss runback time by 72%.',
    },
    keyMechanics: {
      ja: [
        '視線誘導（30度仰角ルール）と暖色松明ライティングによる非言語ナビゲーション',
        '緊張と緩和のペーシング曲線：探索（低負荷）→ 伏兵遭遇（高負荷）→ ショートカット開通（解放）',
        '遮蔽物（柱・高低差）を活用した遠距離弓兵と近接騎士の複合エンカウンター配置',
      ],
      zh: [
        '30 度仰角视觉地标法则与暖色火把冷暖对比，实现零 UI 非语言动线引导',
        '张弛有度的心流节奏曲线：安静探索 → 伏兵遭遇波峰 → 开启单向捷径的情绪释放',
        '利用高低差连廊与断柱掩体，设计远程弓箭手与重甲巡逻兵的立体交叉遭遇战',
      ],
      en: [
        '30-degree elevation sightlines and warm torch contrast for HUD-free navigation',
        'Pacing curve alternating quiet exploration, ambush spikes, and shortcut relief',
        'Multi-elevation combat encounters combining ranged archers and melee knights',
      ],
    },
    metrics: [
      { label: { ja: '平均初回クリア時間', zh: '首次探索平均时长', en: 'First-Run Playtime' }, value: '38 Mins' },
      { label: { ja: 'ショートカット短縮率', zh: '捷径打通跑图缩减率', en: 'Shortcut Time Saved' }, value: '-72% Runback' },
      { label: { ja: '道迷い離脱率', zh: '无UI迷路受挫率', en: 'Navigation Drop Rate' }, value: '< 4.2%' },
    ],
    frameTable: [
      {
        moveName: { ja: 'Zone A: 城門外郭 (Intro)', zh: '区域A：城门外郭（教学引导区）', en: 'Zone A: Outer Gatehouse' },
        startup: '0-6m',
        active: 'Low Tension (30%)',
        recovery: 'Sightline Reveal',
        onBlock: '1 Patrol Guard',
        damage: 'Landmark Visible',
      },
      {
        moveName: { ja: 'Zone B: 地下水路 (Ambush)', zh: '区域B：幽暗水道（高压遭遇区）', en: 'Zone B: Sunken Crypts' },
        startup: '6-18m',
        active: 'High Tension (85%)',
        recovery: 'Gate Key Found',
        onBlock: '3 Melee + 2 Ranged',
        damage: 'Loop 1 Unlocked',
      },
      {
        moveName: { ja: 'Zone C: 鐘楼昇降機 (Shortcut)', zh: '区域C：钟楼升降梯（捷径打通）', en: 'Zone C: Bell Lift Hub' },
        startup: '18-22m',
        active: 'Relief Drop (15%)',
        recovery: 'Hub Connected',
        onBlock: 'Safe Bonfire',
        damage: '-72% Travel Time',
      },
    ],
    repoName: 'ashen-citadel-level-topology',
  },
  {
    id: 'eclipse-boss-ai',
    code: 'SPEC-03',
    span: 'normal',
    image: PORTFOLIO_IMAGES.bossAiBehavior,
    roleTag: {
      ja: 'ボス戦闘企画 · AI行動ツリー設計',
      zh: 'Boss战斗策划 · 行为状态机与场地机制',
      en: 'Boss Combat Planner · Behavior Tree & Arena',
    },
    engineTag: 'TypeScript / Behavior Tree Sim',
    year: '2025',
    title: {
      ja: '『黒鉄の月蝕騎士』3フェーズAI行動＆距離別技抽選テーブル',
      zh: '《黑铁月蚀骑士》三阶段 AI 状态机与距离扇区出招表',
      en: 'Eclipse Rider Kurogane: 3-Phase Boss AI & Sector Weighting',
    },
    summary: {
      ja: 'プレイヤーとの相対距離（近・中・遠）と角度に応じて攻撃パターンを動的に重み付けするボスAI仕様。作業感を排除するクールタイム制御を実装。',
      zh: '根据玩家相对距离（近/中/远）与方位角动态调整出招权重的 Boss 战斗企划。通过反套路冷却修正消除“背板回合制”枯燥感。',
      en: 'Dynamic boss AI weighting attack patterns by player distance and sector angle, eliminating repetitive AI exploits.',
    },
    designIntent: {
      ja: 'ボス戦が単調な「同じ技誘発ループ」に陥るのを防ぐため、プレイヤーが背後に回り続けた場合は2.5秒以内に「後方薙ぎ払い＋バックステップ」の抽選重みを+65%上昇させる動的ヘイト・空間制御テーブルを設計しました。',
      zh: '为防止 Boss 战变成单调的“绕后骗招循环”，设计了基于空间扇区停留时长的动态权重补偿表：当玩家持续处于 Boss 背后扇区超过 2.5 秒时，“回身横扫+后撤步拉开”的触发权重自动上浮 65%。',
      en: 'Prevents circle-strafe cheese by boosting the boss’s "Rear Sweep + Backstep" probability weight by +65% when a player lingers in the rear cone for over 2.5s.',
    },
    keyMechanics: {
      ja: [
        '距離別3段階（0-3m / 3-8m / 8m+）× 相対角度4扇区の技抽選マトリクス',
        'HP 60%・30%での形態変化（フェーズ移行）とアリーナ安全地帯の段階的縮小',
        '大技後の確定反撃窓口（Recovery Punish Window: 45F）による達成感の保証',
      ],
      zh: [
        '三段距离区间（0-3m / 3-8m / 8m+）× 四象限方位角的动态出招权重矩阵',
        '60% 与 30% 血量阈值触发二/三阶段转场，伴随场地安全扇区动态压缩',
        '大招收招后保留明确的 45 帧硬直惩罚窗口（Punish Window），确保博弈正反馈',
      ],
      en: [
        '3 distance rings × 4 angular sectors driving dynamic move probability weights',
        'Phase transitions at 60% and 30% HP with progressive arena hazard zones',
        'Guaranteed 45F punish window after signature finishers to reward clean dodges',
      ],
    },
    metrics: [
      { label: { ja: '行動ノード総数', zh: '状态机行为节点数', en: 'Behavior Nodes' }, value: '28 States' },
      { label: { ja: '確定反撃猶予', zh: '大招惩罚窗口', en: 'Punish Window' }, value: '45 Frames (0.75s)' },
      { label: { ja: '平均撃破試行回数', zh: '测试玩家平均通关次数', en: 'Avg Attempts to Clear' }, value: '6.4 Tries' },
    ],
    frameTable: [
      {
        moveName: { ja: '月輪薙ぎ (Lunar Cleave 300°)', zh: '月轮大横扫 (300°扇形AOE)', en: 'Lunar Cleave (300° Arc)' },
        startup: '24F',
        active: '6F',
        recovery: '32F',
        onBlock: 'Guard Crush',
        damage: '185',
      },
      {
        moveName: { ja: '疾風突き (Gap-Closer Thrust)', zh: '疾风突刺 (中远距追击)', en: 'Gale Gap-Closer Thrust' },
        startup: '16F',
        active: '5F',
        recovery: '28F',
        onBlock: '-12F',
        damage: '140',
      },
      {
        moveName: { ja: '背面パリィ返し (Rear Turn Slash)', zh: '回身逆袈裟 (防绕后修正技)', en: 'Rear Discipline Slash' },
        startup: '13F',
        active: '4F',
        recovery: '20F',
        onBlock: '-4F',
        damage: '130',
      },
    ],
    repoName: 'boss-behavior-tree-visualizer',
  },
  {
    id: 'famicom-level-deconstruction',
    code: 'SPEC-04',
    span: 'wide',
    image: PORTFOLIO_IMAGES.retroArchive,
    roleTag: {
      ja: 'ゲーム史研究 · 古典レベル構造解析',
      zh: '游戏史研究 · 经典日式关卡结构拆解库',
      en: 'Game History Archive · Classic Level Analysis',
    },
    engineTag: 'React 19 / SVG Canvas / Markdown',
    year: '2025',
    title: {
      ja: '『起承転結（岸本式・宮本式）』古典名作40選のレベル节奏データベース',
      zh: '“起承转合”日本经典动作游戏 40 选关卡节奏拆解数据库',
      en: 'Kishotenketsu in Action: 40 Classic Japanese Level Breakdowns',
    },
    summary: {
      ja: '1985年の『スーパーマリオブラザーズ』1-1から『ロックマンX』『悪魔城ドラキュラ月下の夜想曲』まで、テキストに頼らないチュートリアル設計を方眼紙レベルで図解・コード化。',
      zh: '从 1985 年《超级马里奥兄弟》1-1 到《洛克人X》《恶魔城：月下夜想曲》，以方格纸级精度拆解日本黄金年代“零文字教学”与“起承转合”关卡设计法则。',
      en: 'Grid-level interactive breakdowns of 40 iconic Japanese stages from Super Mario Bros. 1-1 to Mega Man X and Symphony of the Night.',
    },
    designIntent: {
      ja: '温故知新の精神に基づき、ハードウェア制約が厳しかった8-bit/16-bit時代に日本の先人プランナーたちがどのように「安全な場所でのギミック提示（起）→ 応用（承）→ 複合ツイスト（転）→ ゴール前のクライマックス（結）」を構築したかをインタラクティブなWeb図鑑として実装しました。',
      zh: '秉持“温故知新”的策划信条，深入研究 8-bit/16-bit 硬件受限时代日本前辈策划大师如何构建“安全区机制初见（起）→ 进阶挑战（承）→ 复合变奏（转）→ 终点前高潮验证（合）”，并用前端代码将其做成可交互的在线关卡拆解图鉴。',
      en: 'Preserves and digitizes how 8-bit and 16-bit Japanese level designers taught complex mechanics wordlessly through safe introduction, development, twist, and mastery.',
    },
    keyMechanics: {
      ja: [
        '4段階構造（起・承・転・結）ごとのギミック密度・落下リスク比率の定量グラフ化',
        'カメラのスクロール境界と敵スポーン位置の相関シミュレーター',
        '日本語・中国語・英語での企画書エクスポートおよび面接プレゼンモード搭載',
      ],
      zh: [
        '按“起·承·转·合”四阶段量化统计机关密度、死亡惩罚率与安全落脚点占比',
        '复刻经典横版卷轴相机边界与敌人刷新触发点的交互模拟器',
        '支持中/日/英三语企划拆解报告导出与面试演示模式',
      ],
      en: [
        'Quantifies hazard density and safe-platform ratios across all 4 Kishotenketsu phases',
        'Camera scroll boundary and enemy spawn trigger simulator',
        'Trilingual design breakdown viewer built for live interview walkthroughs',
      ],
    },
    metrics: [
      { label: { ja: '解析済み名作ステージ', zh: '已拆解经典关卡数', en: 'Stages Deconstructed' }, value: '40 Stages' },
      { label: { ja: 'ギミック分類タグ', zh: '机关与机制分类标签', en: 'Mechanic Taxonomy' }, value: '128 Patterns' },
      { label: { ja: 'GitHub スター数', zh: '开源社区 Star 数', en: 'Community Stars' }, value: '340+ Stars' },
    ],
    frameTable: [
      {
        moveName: { ja: '第1段階：起 (Safe Intro)', zh: '第一阶段：起（零惩罚安全初见）', en: 'Phase 1: Ki (Safe Intro)' },
        startup: '0-20% Stage',
        active: '0% Pitfall Risk',
        recovery: 'Mechanic Learned',
        onBlock: 'Single Enemy/Gimmick',
        damage: '100% Clear Rate',
      },
      {
        moveName: { ja: '第2段階：承 (Development)', zh: '第二阶段：承（移除安全网进阶）', en: 'Phase 2: Sho (Development)' },
        startup: '20-55% Stage',
        active: '35% Hazard Risk',
        recovery: 'Timing Mastery',
        onBlock: 'Moving Platform + Enemy',
        damage: 'Reward: Secret Sub-tank',
      },
      {
        moveName: { ja: '第3段階：転 (Twist & Combo)', zh: '第三阶段：转（双机制复合变奏）', en: 'Phase 3: Ten (Twist)' },
        startup: '55-85% Stage',
        active: '75% Peak Tension',
        recovery: 'Skill Synthesis',
        onBlock: 'Wind + Narrow Ledge',
        damage: 'High Mastery Check',
      },
    ],
    repoName: 'kishotenketsu-level-design-archive',
  },
];

export const ERA_CHRONICLES: EraNode[] = [
  {
    id: 'era-8bit',
    yearRange: '1983 — 1989',
    eraBadge: '8-BIT FAMICOM ERA',
    consoleInspiration: {
      ja: 'ファミリーコンピュータ (FC) · 1画面と4音の美学',
      zh: '红白机 (FC / NES) · 方格纸与四声道的设计原初',
      en: 'Famicom / NES · Grid Paper & 4-Channel Precision',
    },
    title: {
      ja: '第1章：文字を使わない「起承転結」チュートリアルの原点',
      zh: '第一章：不依赖一行文字的“起承转合”关卡启蒙',
      en: 'Chapter I: Wordless Tutorials & The Birth of Kishotenketsu',
    },
    philosophy: {
      ja: '容量わずか40KBの制約下で生まれた「1画面目でルールを教え、2画面目で試させ、3画面目でひねる」レベルデザイン哲学。私のステージ設計における「説明テキストを極限まで削り、地形と敵配置だけでプレイヤーを導く」信条のルーツです。',
      zh: '在仅有 40KB 卡带容量的极限约束下诞生的“第一屏安全示教、第二屏去保护验证、第三屏复合变奏”法则。这奠定了我作为关卡策划的核心信条：克制冗长的文字弹窗，仅靠地形高差、奖励摆放与敌人朝向自然引导玩家。',
      en: 'Born under strict 40KB ROM limits, this era proved that terrain geometry and coin placement can teach any mechanic without text popups—the foundation of my level design philosophy.',
    },
    studentMilestone: {
      ja: '大学1年次：方眼紙とJavaScript Canvasで初代『マリオ』『悪魔城』のジャンプ軌道（重力加速度切替）を完全再現・数値化。',
      zh: '大一研习里程碑：使用方格纸手绘与 Canvas 代码 1:1 复刻《超级马里奥》《恶魔城》跳跃抛物线（按键时长分段重力加速度模型）。',
      en: 'Freshman Milestone: Reconstructed variable-gravity jump arcs from Mario & Castlevania in HTML5 Canvas to quantify air-control feel.',
    },
    analyzedGames: ['Super Mario Bros. (1985)', 'Mega Man 2 (1988)', 'Castlevania III (1989)'],
    coreTakeaway: {
      ja: '「安全な失敗」が最高のチュートリアルを作る',
      zh: '“零死亡成本的安全试错”是最好的新手引导',
      en: 'Safe failure is the ultimate tutorial',
    },
  },
  {
    id: 'era-16bit',
    yearRange: '1990 — 1995',
    eraBadge: '16-BIT ARCADE & SFC ERA',
    consoleInspiration: {
      ja: 'スーパーファミコン & アーケード筐体 · 1/60秒の攻防',
      zh: '超任 (SFC) 与街机黄金期 · 1/60 秒的立回与帧数博弈',
      en: 'Super Famicom & Arcade · 1/60s Footsies & Frame Data',
    },
    title: {
      ja: '第2章：攻撃判定（Hitbox）と食らい判定（Hurtbox）の定量芸術',
      zh: '第二章：攻击框（Hitbox）与受击框（Hurtbox）的定量艺术',
      en: 'Chapter II: The Quantitative Art of Hitboxes & Frame Advantage',
    },
    philosophy: {
      ja: '『ストリートファイターII』『ロックマンX』が確立した、1フレーム単位の「発生・持続・硬直・ヒットストップ」の力学。ボタンを押した瞬間の気持ちよさ（手触り）は感覚論ではなく、明確なフレーム数と視覚エフェクトの同期で設計できることを学びました。',
      zh: '《街头霸王II》与《洛克人X》确立了精确到 1/60 秒的“发生帧·持续帧·硬直帧·卡肉停顿”力学体系。让我深刻领悟到：所谓的“打击感”绝非玄学，而是帧数分配、受击框内缩外扩与受击音效的精密数学同步。',
      en: 'Street Fighter II and Mega Man X proved that "combat feel" is not magic—it is the precise mathematical synchronization of startup frames, hitstop pause, and hurtbox shifts.',
    },
    studentMilestone: {
      ja: '大学2年次：Webブラウザ上で動作する60FPSフレームデータ＆判定ボックスエディタを開発し、インディー格闘アクション制作に導入。',
      zh: '大二研习里程碑：独立使用 React + TypeScript 开发浏览器端 60FPS 动作帧数与碰撞盒可视化编辑器，并应用于独立动作游戏开发。',
      en: 'Sophomore Milestone: Built a web-based 60FPS Frame Data & Hitbox Editor in TypeScript used for tuning indie action prototypes.',
    },
    analyzedGames: ['Street Fighter II Turbo (1992)', 'Mega Man X (1993)', 'Chrono Trigger (1995)'],
    coreTakeaway: {
      ja: '手触り（Game Feel）は1フレームの数値で制御できる',
      zh: '手感（Game Feel）可以用精确到 1 帧的参数来定量控制',
      en: 'Game feel is engineered one frame at a time',
    },
  },
  {
    id: 'era-32bit',
    yearRange: '1996 — 2005',
    eraBadge: '32-BIT / 3D SPATIAL ERA',
    consoleInspiration: {
      ja: 'PlayStation / N64 · Z軸ターゲットと立体箱庭の誕生',
      zh: '次世代 3D 黎明 · Z 轴锁定与立体箱庭拓扑结构',
      en: 'PlayStation & N64 · Z-Targeting & 3D Box-Garden Topology',
    },
    title: {
      ja: '第3章：カメラ視線誘導とメトロイドヴァニア回帰ルート設計',
      zh: '第三章：3D 镜头视线锚点与银河城回环捷径设计',
      en: 'Chapter III: Sightline Anchoring & Interconnected Loops',
    },
    philosophy: {
      ja: '2Dから3Dへの転換期、『ゼルダの伝説 時のオカリナ』のZ注目システムと『悪魔城ドラキュラX 月下の夜想曲』の探索マップ構造が示した空間設計の革命。戦闘カメラの死角制御と、探索の「往復」を楽しくするショートカット開通設計を徹底研究しました。',
      zh: '从 2D 迈向 3D 的历史转折点，《塞尔达传说：时之笛》的 Z 轴锁定与《恶魔城：月下夜想曲》的立体城塞揭示了空间设计的革命。我在此阶段深入拆解了多人围攻时的镜头防穿帮机制，以及如何用单向捷径让“折返跑图”充满惊喜。',
      en: 'Ocarina of Time’s Z-Targeting and Symphony of the Night’s interconnected castle taught me how camera framing and shortcut loops turn 3D navigation into pure joy.',
    },
    studentMilestone: {
      ja: '大学3年次：Unreal Engine 5にて高低差3層のダンジョン『灰鐘の城塞』グレイボックスを制作、プレイヤー動線ヒートマップ計測を実施。',
      zh: '大三研习里程碑：在 Unreal Engine 5 中完成三层高差箱庭《灰钟城塞》白盒关卡（Greybox），并编写脚本采集 40 名测试玩家动线热力图。',
      en: 'Junior Milestone: Greyboxed a 3-tier vertical dungeon in Unreal Engine 5 and logged player movement heatmaps across 40 playtesters.',
    },
    analyzedGames: ['Castlevania: SotN (1997)', 'Zelda: Ocarina of Time (1998)', 'Devil May Cry 3 (2005)'],
    coreTakeaway: {
      ja: '空間の「見通し」と「近道の発見」が探索の脳汁を生む',
      zh: '空间的“视线远眺”与“捷径豁然开朗”是探索爽感的源泉',
      en: 'Sightlines and shortcuts drive exploration dopamine',
    },
  },
  {
    id: 'era-modern',
    yearRange: '2015 — 2026',
    eraBadge: 'NEXT-GEN & PROTOTYPE ERA',
    consoleInspiration: {
      ja: '現代アクション × フロントエンド高速プロトタイピング',
      zh: '现代动作设计 × 前端工程化高速原型验证',
      en: 'Modern Action RPGs × Rapid Web Tooling & Prototyping',
    },
    title: {
      ja: '第4章：仕様書を「動くコード」で提示する次世代ゲームプランナーへ',
      zh: '第四章：用“可交互的前端代码”交付企划书的新世代策划',
      en: 'Chapter IV: The Code-Empowered Planner Building Playable Specs',
    },
    philosophy: {
      ja: '『SEKIRO』『ELDEN RING』『モンスターハンター』が世界に示した日本発アクションゲームの到達点。私は従来の静的なExcel/Word仕様書だけでなく、React/TypeScriptやゲームエンジンを用いて「その場で触って検証できるインタラクティブ仕様書」を作れるプランナーを目指しています。',
      zh: '《只狼》《艾尔登法环》《怪物猎人》向世界展示了日本动作与箱庭关卡设计的巅峰。作为一名兼具前端工程能力的学生策划，我不仅撰写严谨的日文企划仕样书，更坚持用 React/TypeScript 将战斗帧数表与关卡节奏直接做成“面试官伸手就能玩的交互原型”。',
      en: 'Inspired by Sekiro, Elden Ring, and Monster Hunter, I bridge design and engineering—delivering not just static docs, but interactive web sandboxes that teams can test immediately.',
    },
    studentMilestone: {
      ja: '現在（2026年卒予定・就職活動中）：日本ゲーム業界の戦闘企画職・レベルデザイナー職を第一志望としてポートフォリオと検証ツール群を公開。',
      zh: '当前状态（应届求职中）：以日本游戏业界「战斗策划 / 关卡策划」为第一志愿，持续开源游戏机制拆解工具与可玩原型库。',
      en: 'Present (Seeking Grad / Intern Roles in Japan): Actively applying for Battle & Level Planner roles with a suite of open-source design tools.',
    },
    analyzedGames: ['Sekiro: Shadows Die Twice (2019)', 'Monster Hunter Wilds / World', 'Elden Ring: Shadow of the Erdtree'],
    coreTakeaway: {
      ja: '企画書を「読むもの」から「触って納得するもの」へ進化させる',
      zh: '把企划书从“只能读的文档”进化为“一摸就懂的交互原型”',
      en: 'Transform specs from static docs into playable proof',
    },
  },
];

export const FALLBACK_GITHUB_REPOS: FallbackRepo[] = [
  {
    id: 101,
    name: 'oni-blade-combat-frame-lab',
    html_url: 'https://github.com/kurogane-dev/oni-blade-combat-frame-lab',
    description: {
      ja: '60FPSアクションゲーム向けの発生・持続・硬直フレーム＆Hitbox/Hurtbox可視化シミュレーター（TypeScript / React / Unity連携）',
      zh: '面向 60FPS 动作游戏的攻击前摇/持续/后摇帧数与 Hitbox/Hurtbox 碰撞盒可视化调优工具（支持导出 Unity ScriptableObject JSON）',
      en: '60FPS action combat frame data & hitbox/hurtbox visualizer with Unity ScriptableObject JSON export.',
    },
    language: 'TypeScript',
    stargazers_count: 184,
    forks_count: 29,
    updated_at: '2026-10-28T14:20:00Z',
    topics: ['battle-planner', 'frame-data', 'hitbox', 'game-design', 'typescript'],
    latestCommit: {
      sha: '8f4a21c',
      message: {
        ja: 'feat(parry): ジャストパリィ成功時のヒットストップ(10F)と体幹削り倍率計算式を追加',
        zh: 'feat(parry): 新增完美弹反 10F 卡肉停顿与架势槽削减倍率计算公式',
        en: 'feat(parry): add 10F hitstop freeze and posture multiplier formula on perfect deflect',
      },
      date: '2 days ago',
    },
  },
  {
    id: 102,
    name: 'ashen-citadel-level-topology',
    html_url: 'https://github.com/kurogane-dev/ashen-citadel-level-topology',
    description: {
      ja: '3D箱庭ダンジョンの動線ループ効率・一方通行ショートカット・プレイヤー緊張度（Tension Curve）を自動算出するレベルデザイン検証ツール',
      zh: '3D 箱庭关卡动线回路比、单向捷径省时率与玩家心流紧张度曲线（Tension Curve）自动测算沙盘工具',
      en: 'Box-garden level topology analyzer calculating shortcut loop efficiency, sightlines, and player tension curves.',
    },
    language: 'TypeScript',
    stargazers_count: 142,
    forks_count: 18,
    updated_at: '2026-10-24T09:15:00Z',
    topics: ['level-design', 'metroidvania', 'pacing-curve', 'unreal-engine-5'],
    latestCommit: {
      sha: '3c9e10b',
      message: {
        ja: 'docs(spec): 灰鐘の城塞 Zone-B 地下水路の伏兵エンカウンター視線誘導図を更新',
        zh: 'docs(spec): 更新《灰钟城塞》B区水道伏兵遭遇战的 30° 视线引导平面图',
        en: 'docs(spec): update 30-deg sightline guidance diagram for Zone-B crypt ambush',
      },
      date: '5 days ago',
    },
  },
  {
    id: 103,
    name: 'kishotenketsu-level-design-archive',
    html_url: 'https://github.com/kurogane-dev/kishotenketsu-level-design-archive',
    description: {
      ja: '日本名作アクション40選（マリオ1-1、ロックマンX、月下の夜想曲など）の「起承転結」ギミック配置・落下リスク定量解析データベース',
      zh: '日本经典动作游戏 40 选（马里奥 1-1、洛克人X、月下夜想曲等）“起承转合”机关密度与零文字引导量化拆解库',
      en: 'Quantitative deconstruction of 40 classic Japanese action stages using the Kishotenketsu 4-act structure.',
    },
    language: 'JavaScript',
    stargazers_count: 346,
    forks_count: 54,
    updated_at: '2026-10-19T18:40:00Z',
    topics: ['game-history', 'kishotenketsu', 'nintendo-design', 'level-analysis'],
    latestCommit: {
      sha: 'e71d94a',
      message: {
        ja: 'feat(archive): ロックマンX オープニングステージの「VAVA戦・敗北イベント」緊張度データを追加',
        zh: 'feat(archive): 新增《洛克人X》序章公路关卡与霸法剧情战的心流节奏量化对比',
        en: 'feat(archive): add Mega Man X highway intro stage tension & safe-platform metrics',
      },
      date: '1 week ago',
    },
  },
  {
    id: 104,
    name: 'boss-behavior-tree-visualizer',
    html_url: 'https://github.com/kurogane-dev/boss-behavior-tree-visualizer',
    description: {
      ja: 'ボスAIの距離別・角度別技抽選テーブルとクールタイム補正をリアルタイム検証するC#/Webハイブリッドシミュレーター',
      zh: 'Boss 战斗 AI 距离环/扇区出招权重矩阵与防绕后动态冷却补偿模拟器（C# & Web 双端验证）',
      en: 'Boss AI sector-based move probability matrix and anti-circle-strafe cooldown simulator.',
    },
    language: 'C#',
    stargazers_count: 98,
    forks_count: 14,
    updated_at: '2026-10-11T11:05:00Z',
    topics: ['boss-design', 'behavior-tree', 'combat-ai', 'unity3d'],
    latestCommit: {
      sha: '5a2b88f',
      message: {
        ja: 'fix(weights): プレイヤーが背面扇区に2.5秒以上滞在した際の振り返り斬り重み補正を+65%に調整',
        zh: 'fix(weights): 调整玩家在背后扇区停留超 2.5 秒时的回身斩权重补偿至 +65%',
        en: 'fix(weights): tune rear-sector linger counter slash weight boost to +65% after 2.5s',
      },
      date: '2 weeks ago',
    },
  },
  {
    id: 105,
    name: 'jrpg-damage-curve-balancer',
    html_url: 'https://github.com/kurogane-dev/jrpg-damage-curve-balancer',
    description: {
      ja: 'アクションRPG・コマンドRPG向けのレベル成長曲線、武器強化期待値、TTK（Time-To-Kill）モンテカルロ検証スイート',
      zh: '面向动作与指令 RPG 的数值成长曲线、武器强化期望值与 TTK（击杀耗时）蒙特卡洛仿真测试套件',
      en: 'Monte Carlo TTK (Time-To-Kill) and weapon scaling curve balancer for Action & Command RPGs.',
    },
    language: 'Python',
    stargazers_count: 76,
    forks_count: 11,
    updated_at: '2026-09-29T08:30:00Z',
    topics: ['combat-balance', 'ttk-simulation', 'rpg-mechanics', 'monte-carlo'],
    latestCommit: {
      sha: '9d0c41e',
      message: {
        ja: 'feat(sim): ボス戦における回復薬枯渇ターン分布の10,000回シミュレーション機能を追加',
        zh: 'feat(sim): 新增 Boss 战恢复药耗尽回合分布的 10,000 次蒙特卡洛模拟统计',
        en: 'feat(sim): add 10,000-run Monte Carlo potion depletion distribution in boss encounters',
      },
      date: '3 weeks ago',
    },
  },
  {
    id: 106,
    name: 'gamepad-input-buffer-debugger',
    html_url: 'https://github.com/kurogane-dev/gamepad-input-buffer-debugger',
    description: {
      ja: 'Web Gamepad APIを活用した先行入力バッファ（Input Buffer）・コマンド成立猶予フレームのリアルタイム計測オーバーレイ',
      zh: '基于 Web Gamepad API 的手柄预输入缓冲窗口（Input Buffer）与搓招指令成立宽限帧实时监测面板',
      en: 'Real-time gamepad input buffer and motion-input leniency debugger built with Web Gamepad API.',
    },
    language: 'TypeScript',
    stargazers_count: 115,
    forks_count: 16,
    updated_at: '2026-09-18T16:10:00Z',
    topics: ['gamepad-api', 'input-buffer', 'fighting-games', 'action-feel'],
    latestCommit: {
      sha: '1b7f33d',
      message: {
        ja: 'perf(polling): 120Hzポーリング対応と6F/8F先行入力ウィンドウ比較モードを実装',
        zh: 'perf(polling): 支持 120Hz 手柄轮询并新增 6F 与 8F 预输入窗口手感盲测对比模式',
        en: 'perf(polling): support 120Hz gamepad polling and 6F vs 8F buffer A/B test mode',
      },
      date: '1 month ago',
    },
  },
];

export const UI_TEXT = {
  ja: {
    brand: 'KUROGANE // 企画研究室',
    nav: {
      combatLab: '戦闘フレーム検証',
      works: '企画仕様書',
      levelSandbox: 'レベル動線盤',
      chronicle: 'ゲーム史と経歴',
      github: 'GitHub 動態',
      contactCta: '面接・選考連絡',
    },
    hero: {
      kicker: '2026/2027 新卒・インターン志望 · 戦闘企画 / レベルデザイナー（フロントエンド実装兼務）',
      headline: '1/60秒の手触りと、迷わせない立体箱庭をコードで設計する。',
      lead: '日本のアクションゲームの「刃が交差する瞬間の納得感」と「起承転結の空間誘導」に魅了された学生ゲーム開発者です。静的な書類にとどまらず、その場で触って検証できるインタラクティブな企画仕様書（プロトタイプ）を武器に、世界に届くアクション体験を創ります。',
      primaryBtn: '企画仕様書を見る',
      secondaryBtn: '下のレベル設計盤を試す',
      candidateName: 'リン・カイト (Lin Kaito / 林 海斗)',
      candidateMeta: '情報工学専攻 B4 · JLPT N1 (172/180) · 東京/大阪勤務可 · Unity / UE5 / TypeScript',
      metrics: [
        { value: '60 FPS', label: 'フレーム単位の攻撃・パリィ判定設計と先行入力バッファ検証' },
        { value: '40+ 名作', label: 'マリオ1-1からSEKIROまで「起承転結」レベル構造の定量解析' },
        { value: '3 言語', label: '日本語（ビジネス・仕様書作成）・中国語（母語）・英語で開発協業' },
        { value: '12+ ツール', label: '企画意図を即座に動かすWeb/Unityプロトタイプとオープンソース群' },
      ],
    },
    combatLab: {
      badge: 'INTERACTIVE SPEC 01 · 60FPS COMBAT FRAME & HITBOX SANDBOX',
      title: '戦闘企画ラボ：発生・持続・硬直＆パリィ検証器',
      subtitle: 'スライダーを動かしてフレームデータを調整し、「攻撃検証」「ジャストパリィ」ボタンを押して手触りと有利フレームの変化を体感してください。',
      presetsLabel: '武器モーションプリセット',
      presets: [
        { id: 'katana', name: '太刀・居合抜刀斬り (標準バランス)' },
        { id: 'greatsword', name: '大剣・溜め兜割り (高威力・重硬直)' },
        { id: 'dual', name: '双剣・疾風連撃 (高速発生・短リーチ)' },
        { id: 'spear', name: '長槍・見切り突き (長リーチ・精密判定)' },
      ],
      startup: '発生 (Startup)',
      active: '持続 (Active Hitbox)',
      recovery: '硬直 (Recovery)',
      hitstop: 'ヒットストップ (Hitstop)',
      reach: '攻撃判定リーチ (Reach)',
      totalFrames: '全体フレーム',
      frameAdvHit: 'ヒット時有利',
      frameAdvBlock: 'ガード時硬直差',
      dpsScore: 'リスク・リターン評価',
      btnAttack: '斬撃判定を再生 (Attack)',
      btnParry: 'ジャストパリィ検証 (6F)',
      btnStep: '1F コマ送り',
      statusIdle: '待機中 (Neutral Stance) — ボタンを押してフレーム再生',
      statusStartup: '予備動作中 (Startup) — 攻撃判定はまだ発生していません（潰されリスクあり）',
      statusActive: '攻撃判定発生！(Active Hitbox) — 赤いHitboxが緑のHurtboxに接触！',
      statusHitstop: 'ヒットストップ硬直中！(Hitstop Freeze) — 打撃の重みを演出する演出停止フレーム',
      statusRecovery: 'フォロースルー硬直 (Recovery) — 無防備な後隙フレーム（キャンセル派生窓口）',
      statusParry: 'ジャストパリィ成立！(Perfect Deflect +12F) — 敵の体幹ゲージを大きく削りました！',
      timelineLegend: '60FPS フレームタイムライン（クリックで任意のフレームを検査）',
    },
    works: {
      sectionTitle: '01. 厳選・企画仕様書＆実装プロトタイプ',
      sectionSub: 'カードをクリックすると、企画意図・フレーム表・レベル平面図を収録した詳細仕様書ビューアが開きます。',
      filterAll: 'すべての企画',
      filterBattle: '戦闘・AI企画',
      filterLevel: 'レベルデザイン',
      openSpecBtn: '仕様書と数値を詳しく見る →',
    },
    levelSandbox: {
      sectionTitle: '02. 箱庭レベルデザイン＆動線・緊張度シミュレーター',
      sectionSub: '8×5の戦術グリッド上に「一方通行ショートカット」「強敵・視界コーン」「鍵ギミック」「休息篝火」を配置し、プレイヤーの探索動線と心流（Tension Curve）をリアルタイム検証できます。',
      archetypesLabel: '名作レベル構造プリセット',
      archetypes: [
        { id: 'souls', name: 'ソウルライク立体ループ（拠点回帰ショートカット型）' },
        { id: 'zelda', name: 'ゼルダ式・鍵とギミック交差型ダンジョン' },
        { id: 'action', name: 'アーケード起承転結・ボスラッシュ直進型' },
      ],
      toolsLabel: '配置エレメント選択（セルをクリックして配置）',
      tools: {
        empty: '通路 (Floor)',
        wall: '遮蔽壁・高台 (Wall)',
        enemy: '強敵・視界 (Elite)',
        key: '鍵・スイッチ (Key)',
        shortcut: '一方通行門 (Shortcut)',
        bonfire: '休息拠点 (Bonfire)',
      },
      simulateBtn: '動線・心流シミュレーション実行',
      resetBtn: '初期配置に戻す',
      tensionTitle: 'プレイヤー緊張度・ペーシング曲線 (Kishotenketsu Pacing Curve)',
      metrics: {
        pathLength: '最短突破ステップ数',
        loopSaving: 'ショートカット短縮率',
        sightlineScore: '視線誘導・発見スコア',
        pacingGrade: '起承転結バランス評価',
      },
      designerNoteTitle: 'プランナー設計メモ（現在のマップ診断）',
    },
    chronicle: {
      sectionTitle: '03. ビデオゲーム史への敬意とプランナー成長年表',
      sectionSub: '8-bitから現代まで、日本のゲーム史が築いた「遊びの文法」をどう学び、自分の武器（企画＋フロントエンド実装）に昇華させたかの記録です。',
      skillsTitle: '職種別コアスキル・マトリクス（戦闘企画 × レベルデザイン × 技術実装）',
      analyzedLabel: '徹底解剖・リバースエンジニアリングした名作：',
      takeawayLabel: '設計信条：',
    },
    github: {
      sectionTitle: '04. GitHub リポジトリ＆開発コミット動態',
      sectionSub: 'リアルタイムでGitHub Public APIから最新の開発リポジトリとコミット履歴を取得します（API制限時は厳選デモデータへ自動フォールバック）。',
      usernameInputPlaceholder: 'GitHub ユーザー名を入力...',
      fetchBtn: 'データ取得',
      presetBtn: 'デモアカウントに戻す',
      liveBadge: 'GitHub API リアルタイム接続中',
      fallbackBadge: '厳選ゲーム開発アーカイブ表示中（即時応答モード）',
      searchPlaceholder: 'リポジトリ名・トピックで検索...',
      sortStars: 'スター数順',
      sortUpdated: '最終更新順',
      allLanguages: '全言語',
      latestCommitLabel: '最新コミット:',
      viewOnGithub: 'GitHubで開く ↗',
    },
    contact: {
      sectionTitle: '05. 採用ご担当者様・チームメンバーへの連絡フォーム',
      sectionSub: '日本国内のゲーム会社様（新卒採用・インターン・カジュアル面談）からのご連絡を心よりお待ちしております。ワンクリックで定型文を挿入できます。',
      roleLabel: 'ご希望のポジション・面談区分',
      roles: [
        { id: 'battle', label: '戦闘企画 / アクションプランナー (Battle Planner)' },
        { id: 'level', label: 'レベルデザイナー / ステージ企画 (Level Designer)' },
        { id: 'system', label: 'システム企画 / 数値バランス (System Planner)' },
        { id: 'proto', label: 'ゲームUI / プロトタイプエンジニア (Frontend / Tool Dev)' },
      ],
      quickTemplateLabel: '面談・連絡テンプレートを自動入力：',
      templates: [
        {
          label: '新卒・インターン選考のご案内',
          subject: '【選考のご案内】戦闘・レベル企画職 カジュアル面談のお誘い',
          message: 'ポートフォリオと戦闘フレーム検証ツールを拝見しました。弊社のアクションゲーム開発チームにて、ぜひ一度オンライン面談（日本語）をお願いしたくご連絡いたしました。',
        },
        {
          label: '企画仕様書・ソースコードに関する質問',
          subject: '【ポートフォリオ質問】箱庭レベルデザイン仕様書について',
          message: '『灰鐘の城塞』の動線設計とGitHub上のツール実装に大変興味を持ちました。実機グレイボックスのデータや追加の企画書があれば共有いただけますでしょうか。',
        },
      ],
      nameLabel: 'お名前 / ご担当者様名',
      namePlaceholder: '例：山田 太郎（株式会社〇〇 採用担当）',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'recruiter@game-studio.co.jp',
      companyLabel: '貴社名・スタジオ名',
      companyPlaceholder: '例：株式会社〇〇 第1開発事業部',
      messageLabel: 'メッセージ本文',
      messagePlaceholder: '面談候補日時やご質問などをご記入ください...',
      submitBtn: 'メッセージを送信する',
      successTitle: '送信が完了しました！',
      successDesc: 'ご連絡ありがとうございます。24時間以内にご記載のメールアドレスへ折り返しご返信いたします。',
      historyTitle: '送信済みメッセージ履歴（ローカル保存）',
    },
  },
  zh: {
    brand: 'KUROGANE // 游戏企划研究室',
    nav: {
      combatLab: '战斗帧数实验室',
      works: '企划仕样书',
      levelSandbox: '关卡动线沙盘',
      chronicle: '游戏史与履历',
      github: 'GitHub 动态',
      contactCta: '面试与联系',
    },
    hero: {
      kicker: '2026/2027 应届生求职 · 日本游戏策划（战斗策划 / 关卡策划 · 兼具前端原型开发）',
      headline: '用代码量化 1/60 秒的刀剑手感，构筑不迷路的立体箱庭。',
      lead: '一名深爱电子游戏历史与日本动作游戏黄金法则的在校学生开发者。不止于编写静态的 Word/Excel 企划文档，更擅长使用前端与游戏引擎将“攻击帧数表”“受击判定盒”与“箱庭关卡动线”直接做成面试官伸手可玩的交互原型。',
      primaryBtn: '审阅企划仕样书',
      secondaryBtn: '试玩关卡动线沙盘',
      candidateName: '林 海斗 (Lin Kaito)',
      candidateMeta: '计算机科学大四在读 · 日语 JLPT N1 (172/180) · 可赴东京/大阪就职 · Unity / UE5 / TypeScript',
      metrics: [
        { value: '60 FPS', label: '精确到单帧的攻击前摇/持续/后摇与完美弹反窗口设计' },
        { value: '40+ 名作', label: '从《马里奥1-1》到《只狼》的“起承转合”关卡结构量化拆解' },
        { value: '中日英三语', label: '地道日本游戏业界仕样书撰写能力，支持中日英无障碍协作' },
        { value: '12+ 原型工具', label: '自研浏览器端帧数编辑器、Boss 状态机与箱庭心流测算工具' },
      ],
    },
    combatLab: {
      badge: 'INTERACTIVE SPEC 01 · 60FPS COMBAT FRAME & HITBOX SANDBOX',
      title: '战斗策划实验室：60FPS 攻击帧数与碰撞盒调优器',
      subtitle: '拖动滑块实时修改前摇、持续、后摇与卡肉停顿帧数，点击“挥砍测试”或“完美弹反”直观检验判定框碰撞与帧数优劣势。',
      presetsLabel: '武器招式预设模组',
      presets: [
        { id: 'katana', name: '太刀·居合拔刀斩 (均衡立回型)' },
        { id: 'greatsword', name: '大剑·蓄力兜割 (高削韧·重后摇)' },
        { id: 'dual', name: '双剑·疾风连击 (极速发生·短距压制)' },
        { id: 'spear', name: '长枪·见切突刺 (长距离精准判定)' },
      ],
      startup: '发生前摇 (Startup)',
      active: '有效持续 (Active Hitbox)',
      recovery: '收招后摇 (Recovery)',
      hitstop: '卡肉停顿 (Hitstop)',
      reach: '攻击框延伸 (Reach)',
      totalFrames: '动作总帧数',
      frameAdvHit: '命中帧优势',
      frameAdvBlock: '被防帧差 (On Block)',
      dpsScore: '风险回报比评级',
      btnAttack: '触发挥砍判定 (Attack)',
      btnParry: '测试完美弹反 (6F)',
      btnStep: '单帧步进 (1F)',
      statusIdle: '待机中立态 (Neutral) — 点击按钮或时间轴检验招式帧数',
      statusStartup: '起手前摇中 (Startup) — 攻击判定尚未激活，此时受击会触发 Counter 惩罚',
      statusActive: '攻击判定生效！(Active Hitbox) — 朱红色攻击框已切入翡翠色受击框！',
      statusHitstop: '卡肉帧停顿中！(Hitstop Freeze) — 顿帧放大刀剑斩入硬物的力量感',
      statusRecovery: '收招硬直中 (Recovery) — 招式后摇阶段，可在此窗口设计垫步取消派生',
      statusParry: '完美弹反成立！(Just Deflect +12F) — 精准切入 6F 窗口，大幅削减敌方架势槽！',
      timelineLegend: '60FPS 逐帧时间轴（点击任意帧格可定格检视碰撞盒状态）',
    },
    works: {
      sectionTitle: '01. 精选游戏企划仕样书与可玩原型',
      sectionSub: '点击任意企划卡片，即可打开包含“设计意图、60FPS 帧数表、立体关卡平面图”的完整仕样书阅读器。',
      filterAll: '全部企划案',
      filterBattle: '战斗与Boss AI策划',
      filterLevel: '箱庭关卡策划',
      openSpecBtn: '查阅完整仕样书与数值表 →',
    },
    levelSandbox: {
      sectionTitle: '02. 立体箱庭关卡动线与心流曲线（Tension Curve）沙盘',
      sectionSub: '在 8×5 战术网格中亲手布置“单向捷径门”“精英怪视野锥”“钥匙机关”与“营火存档点”，点击运行模拟即可测算跑图缩减率与玩家情绪波峰。',
      archetypesLabel: '经典关卡拓扑预设',
      archetypes: [
        { id: 'souls', name: '魂系立体回环（单营火辐射 + 升降梯单向捷径）' },
        { id: 'zelda', name: '塞尔达式锁钥迷宫（视觉地标先行 + 机关解谜回环）' },
        { id: 'action', name: '街机起承转合直通型（安全教学 → 复合陷阱 → Boss房）' },
      ],
      toolsLabel: '选择地形与机关画笔（点击下方网格单元格即可编辑）',
      tools: {
        empty: '普通通路 (Floor)',
        wall: '高差掩体 (Wall)',
        enemy: '精英视野 (Elite)',
        key: '钥匙机关 (Key)',
        shortcut: '单向捷径 (Shortcut)',
        bonfire: '休息营火 (Bonfire)',
      },
      simulateBtn: '运行玩家动线与心流模拟',
      resetBtn: '重置预设地图',
      tensionTitle: '玩家情绪紧张度与心流节奏曲线 (Kishotenketsu Pacing Curve)',
      metrics: {
        pathLength: '主线探索步数',
        loopSaving: '捷径打通省时率',
        sightlineScore: '视觉地标引导分',
        pacingGrade: '起承转合节奏评级',
      },
      designerNoteTitle: '关卡策划实时诊断报告',
    },
    chronicle: {
      sectionTitle: '03. 电子游戏年代史情怀与策划成长年表',
      sectionSub: '从 1983 年红白机的方格纸关卡到现代次时代动作游戏，回顾我如何从经典游戏拆解中汲取养分，成长为懂前端代码实现的复合型策划。',
      skillsTitle: '核心岗位能力矩阵（战斗策划 × 关卡设计 × 前端/引擎原型实现）',
      analyzedLabel: '深度拆解与逆向数值研究的经典名作：',
      takeawayLabel: '核心策划信条：',
    },
    github: {
      sectionTitle: '04. GitHub 仓库动态与开源工具流',
      sectionSub: '实时连接 GitHub REST API 拉取公开仓库、星标数与近期 Commit 记录（当遇 API 速率限制时无缝切换至精选游戏开发演示库）。',
      usernameInputPlaceholder: '输入 GitHub 用户名实时预览...',
      fetchBtn: '同步仓库',
      presetBtn: '恢复精选作品库',
      liveBadge: 'GitHub REST API 实时同步中',
      fallbackBadge: '精选游戏工程仓库展示中（零延迟回退模式）',
      searchPlaceholder: '搜索仓库名称或技术标签...',
      sortStars: '按 Star 数排序',
      sortUpdated: '按最近更新排序',
      allLanguages: '全部语言',
      latestCommitLabel: '最近提交:',
      viewOnGithub: '前往 GitHub 查看 ↗',
    },
    contact: {
      sectionTitle: '05. 招聘官与团队联系通道 (Contact & Interview)',
      sectionSub: '诚意寻觅日本及海内外游戏工作室「战斗策划 / 关卡策划 / 游戏前端实习与新卒」机会。支持一键填入面试邀约模板。',
      roleLabel: '意向沟通岗位方向',
      roles: [
        { id: 'battle', label: '战斗策划 / 动作系统策划 (Battle Planner)' },
        { id: 'level', label: '关卡策划 / 箱庭地图设计 (Level Designer)' },
        { id: 'system', label: '系统策划 / 数值平衡策划 (System Planner)' },
        { id: 'proto', label: '游戏工具链与前端原型开发 (Prototype Engineer)' },
      ],
      quickTemplateLabel: '一键填入快捷沟通模板：',
      templates: [
        {
          label: '战斗/关卡策划面试邀约',
          subject: '【面试邀请】日本动作游戏项目组 — 战斗/关卡策划岗沟通',
          message: '你好！我们审阅了你的互动作品集与 60FPS 战斗帧数沙盒，非常欣赏你用前端代码直接验证游戏手感的策划方式，希望能预约一次线上中文/日文面试。',
        },
        {
          label: '索取完整企划书 PDF 与白盒工程',
          subject: '【作品集交流】申请查看《灰钟城塞》UE5 白盒工程与完整仕样书',
          message: '你好！我们对你的《灰钟城塞》立体箱庭关卡设计与 Boss 行为树权重表很感兴趣，方便分享完整的 PDF 仕样书与演示视频吗？',
        },
      ],
      nameLabel: '您的姓名 / 称呼',
      namePlaceholder: '例如：佐藤 健（XX游戏工作室 制作人 / HR）',
      emailLabel: '联系邮箱',
      emailPlaceholder: 'recruiter@game-studio.jp',
      companyLabel: '所属公司 / 工作室名称',
      companyPlaceholder: '例如：株式会社〇〇 第一开发部',
      messageLabel: '留言内容（面试时间 / 岗位需求）',
      messagePlaceholder: '请输入您的面试邀约或作品集交流内容...',
      submitBtn: '发送联系信息',
      successTitle: '消息已成功发送！',
      successDesc: '感谢您的审阅与联系！我已收到您的留言，将在 24 小时内通过邮件详细回复您。',
      historyTitle: '本机已发送联系记录',
    },
  },
  en: {
    brand: 'KUROGANE // GAME DESIGN LAB',
    nav: {
      combatLab: 'Combat Frame Lab',
      works: 'Design Specs',
      levelSandbox: 'Level Sandbox',
      chronicle: 'Game Era Chronicle',
      github: 'GitHub Feed',
      contactCta: 'Hire / Contact',
    },
    hero: {
      kicker: '2026/2027 New Grad & Intern Candidate · Battle Planner & Level Designer (with Frontend Prototyping)',
      headline: 'Engineering 1/60s combat feel and interconnected level topology in playable code.',
      lead: 'A student game developer pursuing Battle Planner & Level Designer roles in the Japanese game industry. Bridging classic video game history with modern web engineering, I turn static design specifications into interactive frame-data sandboxes and playable level flow simulators.',
      primaryBtn: 'Explore Design Specs',
      secondaryBtn: 'Try Level Pacing Sandbox',
      candidateName: 'Kaito Lin (林 海斗)',
      candidateMeta: 'B.S. Computer Science Senior · JLPT N1 Certified (172/180) · Open to Tokyo/Osaka · Unity / UE5 / TS',
      metrics: [
        { value: '60 FPS', label: 'Frame-accurate startup, active, recovery & Just-Parry window tuning' },
        { value: '40+ Stages', label: 'Quantitative Kishotenketsu breakdowns from Mario 1-1 to Sekiro' },
        { value: 'Trilingual', label: 'Fluent in Japanese industry specs (企画仕様書), Chinese, and English' },
        { value: '12+ Tools', label: 'Open-source web sandboxes and Unity/UE5 greybox prototypes' },
      ],
    },
    combatLab: {
      badge: 'INTERACTIVE SPEC 01 · 60FPS COMBAT FRAME & HITBOX SANDBOX',
      title: 'Battle Planner Lab: 60FPS Frame Data & Hitbox Visualizer',
      subtitle: 'Tune startup, active, recovery, and hitstop sliders in real time, then trigger Attack or Just-Parry tests to inspect hitbox overlap and frame advantage.',
      presetsLabel: 'Weapon Motion Presets',
      presets: [
        { id: 'katana', name: 'Katana: Iai Flash Draw (Balanced Footsies)' },
        { id: 'greatsword', name: 'Greatsword: Helm Cleave (High Stagger / Heavy Recovery)' },
        { id: 'dual', name: 'Dual Blades: Gale Flurry (Fast Startup / Short Reach)' },
        { id: 'spear', name: 'Great Spear: Counter Thrust (Long Reach / Precision Tip)' },
      ],
      startup: 'Startup Frames',
      active: 'Active Hitbox',
      recovery: 'Recovery Frames',
      hitstop: 'Hitstop Freeze',
      reach: 'Hitbox Reach',
      totalFrames: 'Total Duration',
      frameAdvHit: 'Advantage on Hit',
      frameAdvBlock: 'Advantage on Block',
      dpsScore: 'Risk / Reward Grade',
      btnAttack: 'Test Slash Hitbox',
      btnParry: 'Test Just-Parry (6F)',
      btnStep: 'Step +1 Frame',
      statusIdle: 'Neutral Stance — Click Attack, Just-Parry, or any frame cell below',
      statusStartup: 'Startup Windup — Vulnerable to counter-hits before active hitbox spawns',
      statusActive: 'Active Hitbox Live! — Crimson attack box intersects Emerald target hurtbox!',
      statusHitstop: 'Hitstop Freeze Active! — Intentional frame pause selling heavy impact weight',
      statusRecovery: 'Recovery Follow-Through — Vulnerable window; ideal for dodge-cancel routing',
      statusParry: 'Just-Parry Connected! (+12F) — Landed inside the 6F window for massive posture damage!',
      timelineLegend: '60FPS Frame Timeline (Click any cell to scrub and inspect frame state)',
    },
    works: {
      sectionTitle: '01. Selected Game Design Specifications & Playable Prototypes',
      sectionSub: 'Click any project card to launch the full specification reader with design intent, frame tables, and level blueprints.',
      filterAll: 'All Specifications',
      filterBattle: 'Battle & Boss AI',
      filterLevel: 'Level Design',
      openSpecBtn: 'Inspect Full Spec & Data Table →',
    },
    levelSandbox: {
      sectionTitle: '02. Box-Garden Level Topology & Pacing Curve Simulator',
      sectionSub: 'Place One-Way Shortcuts, Elite Sightlines, Keys, and Bonfires on the 8×5 tactical grid, then simulate the player route to compute runback savings and tension curves.',
      archetypesLabel: 'Classic Level Topology Presets',
      archetypes: [
        { id: 'souls', name: 'Souls-like Vertical Loop (Central Hub + Elevator Shortcut)' },
        { id: 'zelda', name: 'Zelda Lock & Key Dungeon (Sightline Tease + Multi-wing Loop)' },
        { id: 'action', name: 'Arcade Kishotenketsu Linear Stage (Safe Intro → Twist → Boss)' },
      ],
      toolsLabel: 'Select Level Tile Brush (Click any grid cell below to paint)',
      tools: {
        empty: 'Corridor (Floor)',
        wall: 'Elevation / Cover',
        enemy: 'Elite Sightline',
        key: 'Gate Key / Lever',
        shortcut: 'One-Way Shortcut',
        bonfire: 'Bonfire Checkpoint',
      },
      simulateBtn: 'Simulate Player Route & Tension',
      resetBtn: 'Reset Preset Map',
      tensionTitle: 'Player Tension & Flow Pacing Curve (Kishotenketsu)',
      metrics: {
        pathLength: 'Critical Path Steps',
        loopSaving: 'Shortcut Runback Saved',
        sightlineScore: 'Sightline Guidance',
        pacingGrade: 'Kishotenketsu Grade',
      },
      designerNoteTitle: 'Live Level Planner Diagnostic',
    },
    chronicle: {
      sectionTitle: '03. Video Game History Homage & Designer Chronicle',
      sectionSub: 'How studying four decades of classic Japanese game design shaped my craft as a code-empowered Battle & Level Planner.',
      skillsTitle: 'Core Competency Matrix (Battle Planning × Level Topology × Frontend Prototyping)',
      analyzedLabel: 'Deconstructed Classic Benchmarks:',
      takeawayLabel: 'Core Design Tenet:',
    },
    github: {
      sectionTitle: '04. Live GitHub Repository & Commit Stream',
      sectionSub: 'Fetches live public repositories and commit activity via the GitHub REST API, with instant fallback to curated game-design repositories.',
      usernameInputPlaceholder: 'Enter GitHub username...',
      fetchBtn: 'Load Profile',
      presetBtn: 'Reset to Curated Archive',
      liveBadge: 'Connected to Live GitHub REST API',
      fallbackBadge: 'Showing Curated Game Dev Archive (Instant Mode)',
      searchPlaceholder: 'Filter repositories by name or topic...',
      sortStars: 'Sort by Stars',
      sortUpdated: 'Sort by Updated',
      allLanguages: 'All Languages',
      latestCommitLabel: 'Latest Commit:',
      viewOnGithub: 'Open on GitHub ↗',
    },
    contact: {
      sectionTitle: '05. Recruiter & Studio Contact Form',
      sectionSub: 'Open to New Grad, Internship, and Junior Game Planner opportunities in Japan and worldwide. Use quick-fill templates below for instant outreach.',
      roleLabel: 'Target Role / Inquiry Type',
      roles: [
        { id: 'battle', label: 'Battle Planner / Combat Designer' },
        { id: 'level', label: 'Level Designer / World Layout Planner' },
        { id: 'system', label: 'System & Balance Game Planner' },
        { id: 'proto', label: 'Gameplay Prototype / UI Engineer' },
      ],
      quickTemplateLabel: 'One-click Recruiter Templates:',
      templates: [
        {
          label: 'Interview Invitation (Battle / Level Planner)',
          subject: '[Interview Invitation] Battle & Level Game Planner Role',
          message: 'Hello Kaito! We explored your interactive combat frame sandbox and level topology specs. We would love to schedule an online interview with our Lead Game Designer.',
        },
        {
          label: 'Request Full Greybox & Spec PDF',
          subject: '[Portfolio Inquiry] Requesting UE5 Greybox & Full Spec Package',
          message: 'Hi Kaito, your Ashen Bell Citadel level design and Boss AI probability tables caught our attention. Could you share the full Japanese/English PDF package?',
        },
      ],
      nameLabel: 'Your Name',
      namePlaceholder: 'e.g., Kenji Sato (Lead Producer / Recruiter)',
      emailLabel: 'Work Email',
      emailPlaceholder: 'recruiter@game-studio.co.jp',
      companyLabel: 'Studio / Company Name',
      companyPlaceholder: 'e.g., Studio Kurogane Tokyo Division 1',
      messageLabel: 'Message',
      messagePlaceholder: 'Share interview availability, role details, or questions...',
      submitBtn: 'Send Message',
      successTitle: 'Message Transmitted!',
      successDesc: 'Thank you for reaching out. Your message has been logged and I will respond within 24 hours.',
      historyTitle: 'Recent Sent Messages (Saved Locally)',
    },
  },
};
