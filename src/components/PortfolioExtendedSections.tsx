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
  ja: {
    modeSelectTag: 'SELECT MODE // [機能展示位置：閲覧目的別ナビゲーション枠]',
    modeSelectTitle: '[機能見出し：訪問者の目的別クイックジャンプ枠]',
    modes: [
      {
        id: 'recruit',
        target: 'quick-guide',
        badge: 'MODE 01 // RECRUITER',
        title: '[機能展示枠 01：採用担当・面接官向け誘導ボタン]',
        sub: '/* クリックで「30秒要約カード (#quick-guide)」へスクロール移動 */',
      },
      {
        id: 'gamedev',
        target: 'what-i-can-do',
        badge: 'MODE 02 // COLLABORATOR',
        title: '[機能展示枠 02：開発チーム・協業者向け誘導ボタン]',
        sub: '/* クリックで「できること一覧 (#what-i-can-do)」へスクロール移動 */',
      },
      {
        id: 'play',
        target: 'play-games',
        badge: 'MODE 03 // PLAYABLE',
        title: '[機能展示枠 03：公開作品をすぐ遊びたい方向け誘導ボタン]',
        sub: '/* クリックで「公開試遊ポータル (#play-games)」へスクロール移動 */',
      },
    ],
    quickGuideTag: 'QUICK GUIDE // [機能展示位置：30秒サマリーカード枠]',
    quickGuideTitle: '[機能見出し：30秒でわかる人物・実績ダイジェスト枠]',
    quickTimer: '0:30 READ SLOT',
    quickItems: {
      roleLabel: '01 // [機能展示枠：志望職種・専門領域スロット]',
      roleMain: '[メインテキスト枠：志望職種・ロール名]',
      roleSub: '/* 注釈：ここに志望ポジション・得意ジャンル・卒業年度などを1行で記載 */',
      skillLabel: '02 // [機能展示枠：使用エンジン・技術・言語タグ群]',
      skillTags: [
        '[技術タグ枠 01]',
        '[技術タグ枠 02]',
        '[技術タグ枠 03]',
        '[技術タグ枠 04]',
        '[資格・語学タグ枠 05]',
        '[ツールタグ枠 06]',
      ],
      worksLabel: '03 // [機能展示枠：まず見てほしい代表作ショートカット枠]',
      statsLabel: '04 // [機能展示枠：実績数値カウンター（4項目）]',
      stats: [
        { val: '[N]', unit: '[実績指標枠 01：制作作品数など]' },
        { val: '[N]', unit: '[実績指標枠 02：受賞・入選歴など]' },
        { val: '[N]', unit: '[実績指標枠 03：イベント・Jam参加数]' },
        { val: '[N]', unit: '[実績指標枠 04：技術記事・ノート数]' },
      ],
    },
    quickContactPrompt: '/* 機能展示位置注釈：カード下部のアクション誘導テキスト枠 */',
    quickPlayBtn: '[機能ボタン：試遊セクションへ移動]',
    quickMailBtn: '[機能ボタン：連絡フォームへ移動]',

    playGamesChapter: 'CHAPTER 02B // [機能展示位置：公開試遊ポータル＆Web試遊ラボ (#play-games)]',
    playGamesTitle: '[機能見出し：公開中のゲーム・外部配信プラットフォーム一覧枠]',
    playGamesLead:
      '/* 機能展示位置注釈：unityroom / itch.io / 夢現 / Steam などの外部ゲーム公開サイトへのリンクカード群と、ブラウザ内試遊ランチャーを配置するセクションです。 */',
    platforms: [
      {
        id: 'unityroom',
        code: 'PORTAL 01 // EXTERNAL LINK SLOT',
        name: '[外部配信サイト枠 01 (例: unityroom)]',
        badge: '[属性バッジ枠：WebGL / 即時試遊]',
        desc: '/* 機能展示位置注釈：外部ゲーム投稿サイト 01 の紹介テキスト枠。クリックで該当プロフィールページを新規タブで開きます。 */',
        url: 'https://unityroom.com/',
        cta: '[外部リンク移動ボタン 01 ↗]',
      },
      {
        id: 'itchio',
        code: 'PORTAL 02 // EXTERNAL LINK SLOT',
        name: '[外部配信サイト枠 02 (例: itch.io)]',
        badge: '[属性バッジ枠：PC Build / ビルド配布]',
        desc: '/* 機能展示位置注釈：外部ゲーム投稿サイト 02 の紹介テキスト枠。実行ファイルや仕様書PDFの配布先リンクとして機能します。 */',
        url: 'https://itch.io/',
        cta: '[外部リンク移動ボタン 02 ↗]',
      },
      {
        id: 'freegame',
        code: 'PORTAL 03 // EXTERNAL LINK SLOT',
        name: '[外部配信サイト枠 03 (例: 夢現 / BOOTH)]',
        badge: '[属性バッジ枠：長編作品 / 資料集配布]',
        desc: '/* 機能展示位置注釈：外部ゲーム投稿サイト 03 または個人配布ページへの誘導枠です。 */',
        url: 'https://freegame-mugen.jp/',
        cta: '[外部リンク移動ボタン 03 ↗]',
      },
    ],
    browserLabTag: 'EMBEDDED PLAYABLE LAB // [機能展示枠：ブラウザ内即時試遊ランチャー]',
    browserLabTitle: '[機能見出し：ページ内60FPS試遊ステージ起動パネル]',
    browserLabDesc:
      '/* 機能展示位置注釈：外部サイトへ移動せず、このポートフォリオ内で直接プレイアブル試作（STAGE 01〜04）を起動する機能ブロックです。 */',
    browserLabFeatures: [
      '[機能説明項目 01：クリックで各作品のインタラクティブ試遊モードを直接起動]',
      '[機能説明項目 02：カスタム WebGL iframe URL または MP4 / GIF プレビューの埋め込みに対応]',
      '[機能説明項目 03：キーボード / マウス操作によるリアルタイム判定表示]',
    ],
    browserLabStageSelect: '── STAGE SELECT // [機能展示枠：試遊ステージ選択ボタン群]',

    whatICanDoChapter: 'CHAPTER 03B // [機能展示位置：制作で担当できること (#what-i-can-do)]',
    whatICanDoTitle: '[機能見出し：職種別・担当可能な業務領域マトリクス（4カード枠）]',
    whatICanDoLead:
      '/* 機能展示位置注釈：スキルの数値バーだけでなく「具体的にチーム開発で何ができるか・どんな成果物を作れるか」を実例とタグ付きで提示する機能セクションです。 */',
    capabilities: [
      {
        num: 'CAPABILITY 01',
        category: '[専門領域タグ枠 01]',
        title: '[機能展示枠 01：担当できる業務・強みの見出し]',
        desc: '/* 機能展示位置注釈：能力カード 01 の詳細説明テキスト枠。具体的な作成ドキュメントや設計手法を記述します。 */',
        example: '[実績・具体例コールアウト枠 01：どの作品でどう活かしたかの1行注釈]',
        tags: ['[スキルタグ 1A]', '[スキルタグ 1B]', '[スキルタグ 1C]'],
      },
      {
        num: 'CAPABILITY 02',
        category: '[専門領域タグ枠 02]',
        title: '[機能展示枠 02：担当できる業務・強みの見出し]',
        desc: '/* 機能展示位置注釈：能力カード 02 の詳細説明テキスト枠。 */',
        example: '[実績・具体例コールアウト枠 02：どの作品でどう活かしたかの1行注釈]',
        tags: ['[スキルタグ 2A]', '[スキルタグ 2B]', '[スキルタグ 2C]'],
      },
      {
        num: 'CAPABILITY 03',
        category: '[専門領域タグ枠 03]',
        title: '[機能展示枠 03：担当できる業務・強みの見出し]',
        desc: '/* 機能展示位置注釈：能力カード 03 の詳細説明テキスト枠。 */',
        example: '[実績・具体例コールアウト枠 03：どの作品でどう活かしたかの1行注釈]',
        tags: ['[スキルタグ 3A]', '[スキルタグ 3B]', '[スキルタグ 3C]'],
      },
      {
        num: 'CAPABILITY 04',
        category: '[専門領域タグ枠 04]',
        title: '[機能展示枠 04：担当できる業務・強みの見出し]',
        desc: '/* 機能展示位置注釈：能力カード 04 の詳細説明テキスト枠。 */',
        example: '[実績・具体例コールアウト枠 04：どの作品でどう活かしたかの1行注釈]',
        tags: ['[スキルタグ 4A]', '[スキルタグ 4B]', '[スキルタグ 4C]'],
      },
    ],

    timelineChapter: 'CHAPTER 04B // [機能展示位置：制作活動の歩み＆発信記事 (#timeline)]',
    timelineTitle: '[機能見出し：時系列ステージ型・制作ヒストリー＆外部ブログ枠]',
    timelineSub: 'CHRONOLOGICAL STAGE MAP // [時系列ノード表示枠]',
    timelineNodes: [
      {
        stage: 'STAGE 01',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[マイルストーン区分 01]',
        title: '[機能展示枠：時系列ヒストリーノード 01 見出し]',
        desc: '/* 機能展示位置注釈：時期 01 の活動内容・学習・制作イベントなどを記述する枠です。 */',
      },
      {
        stage: 'STAGE 02',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[マイルストーン区分 02]',
        title: '[機能展示枠：時系列ヒストリーノード 02 見出し]',
        desc: '/* 機能展示位置注釈：時期 02 の活動内容・チーム開発・受賞歴などを記述する枠です。 */',
      },
      {
        stage: 'STAGE 03',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[マイルストーン区分 03]',
        title: '[機能展示枠：時系列ヒストリーノード 03 見出し]',
        desc: '/* 機能展示位置注釈：時期 03 の活動内容を記述する枠です。 */',
      },
      {
        stage: 'STAGE 04',
        period: '[YYYY.MM - PRESENT]',
        badge: '[現在・直近ステータス]',
        title: '[機能展示枠：時系列ヒストリーノード 04 見出し]',
        desc: '/* 機能展示位置注釈：現在の制作状況や就職活動ステータスを記述する枠です。 */',
      },
    ],
    blogHeader: 'DESIGN NOTES & BLOG // [機能展示枠：外部ブログ・技術記事ピックアップ]',
    blogDesc:
      '/* 機能展示位置注釈：note / Zenn / Qiita / 個人ブログ等で発信している記事リンクを3件ピックアップ展示する枠です。 */',
    blogArticles: [
      {
        date: 'YYYY.MM.DD',
        tag: '[記事カテゴリ枠 01]',
        title: '[機能展示枠：ピックアップ記事タイトル 01]',
        summary: '/* 機能展示位置注釈：記事 01 の要約テキスト枠（クリックで外部記事URLへ遷移）。 */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[記事カテゴリ枠 02]',
        title: '[機能展示枠：ピックアップ記事タイトル 02]',
        summary: '/* 機能展示位置注釈：記事 02 の要約テキスト枠（クリックで外部記事URLへ遷移）。 */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[記事カテゴリ枠 03]',
        title: '[機能展示枠：ピックアップ記事タイトル 03]',
        summary: '/* 機能展示位置注釈：記事 03 の要約テキスト枠（クリックで外部記事URLへ遷移）。 */',
      },
    ],

    endingBanner: '★ ENDING CREDITS SLOT // [機能展示位置：巻末クリア演出バナー] ★',
    endingTitle: '[機能見出し：THANK YOU FOR EXPLORING / 巻末挨拶枠]',
    endingLead:
      '/* 機能展示位置注釈：ページ最下部までスクロールした訪問者への感謝メッセージと、クレジット・いいねボタン・トップ復帰ボタンを配置するエンディング枠です。 */',
    credits: [
      {
        role: '[CREDIT SLOT 01 // 企画・設計担当枠]',
        name: '[氏名・ハンドルネーム表示枠]',
      },
      {
        role: '[CREDIT SLOT 02 // 実装・デザイン担当枠]',
        name: '[使用技術・ツールクレジット表示枠]',
      },
      {
        role: '[CREDIT SLOT 03 // SPECIAL THANKS]',
        name: '[訪問者・採用担当者への謝辞表示枠]',
      },
    ],
    kudosBtn: '[機能ボタン：応援・いいねカウンター]',
    kudosSent: '[機能フィードバック：カウント加算完了！]',
    replayBtn: '[機能ボタン：巻頭（TOP）へ戻る]',
    contactBtn: '[機能ボタン：連絡フォームへスクロール]',
  },
  zh: {
    modeSelectTag: 'SELECT MODE // [功能展示位置：浏览目的分流导航区]',
    modeSelectTitle: '[功能标题槽位：按访客目的快速跳转入口]',
    modes: [
      {
        id: 'recruit',
        target: 'quick-guide',
        badge: 'MODE 01 // RECRUITER',
        title: '[功能展示位 01：面向招聘官/面试官快捷入口]',
        sub: '/* 点击平滑滚动至「30秒速览卡片 (#quick-guide)」 */',
      },
      {
        id: 'gamedev',
        target: 'what-i-can-do',
        badge: 'MODE 02 // COLLABORATOR',
        title: '[功能展示位 02：面向开发团队/合作方快捷入口]',
        sub: '/* 点击平滑滚动至「可胜任工作模块 (#what-i-can-do)」 */',
      },
      {
        id: 'play',
        target: 'play-games',
        badge: 'MODE 03 // PLAYABLE',
        title: '[功能展示位 03：面向想直接试玩作品的访客入口]',
        sub: '/* 点击平滑滚动至「在线试玩平台矩阵 (#play-games)」 */',
      },
    ],
    quickGuideTag: 'QUICK GUIDE // [功能展示位置：30秒速览摘要卡片]',
    quickGuideTitle: '[功能标题槽位：30秒个人核心信息与实绩速览看板]',
    quickTimer: '0:30 READ SLOT',
    quickItems: {
      roleLabel: '01 // [功能展示位：目标岗位与求职方向槽位]',
      roleMain: '[主文本槽位：求职意向岗位名称]',
      roleSub: '/* 注释：在此填写您的意向岗位、毕业届别、可就职地区等核心求职信息 */',
      skillLabel: '02 // [功能展示位：核心技能与开发工具标签组槽位]',
      skillTags: [
        '[技能标签槽位 01]',
        '[技能标签槽位 02]',
        '[技能标签槽位 03]',
        '[技能标签槽位 04]',
        '[语言/证书标签槽位 05]',
        '[工具链标签槽位 06]',
      ],
      worksLabel: '03 // [功能展示位：主打代表作一键试玩跳转槽位]',
      statsLabel: '04 // [功能展示位：个人实绩数字统计看板（4格）]',
      stats: [
        { val: '[N]', unit: '[实绩统计槽位 01：累计作品数]' },
        { val: '[N]', unit: '[实绩统计槽位 02：获奖/入围数]' },
        { val: '[N]', unit: '[实绩统计槽位 03：参展/Jam次数]' },
        { val: '[N]', unit: '[实绩统计槽位 04：专栏文章数]' },
      ],
    },
    quickContactPrompt: '/* 功能展示位置注释：卡片底部的引导说明文本槽位 */',
    quickPlayBtn: '[功能按钮：跳转至在线试玩区]',
    quickMailBtn: '[功能按钮：跳转至联系表单区]',

    playGamesChapter: 'CHAPTER 02B // [功能展示位置：公开试玩平台矩阵与网页实验室 (#play-games)]',
    playGamesTitle: '[功能标题槽位：外部游戏发布平台入口 & 网页内嵌试玩区]',
    playGamesLead:
      '/* 功能展示位置注释：参考 haru2401game.github.io/portfolio/#play-games，此处包含 3 个外部游戏发布平台外链卡片（如 unityroom / itch.io / 夢現 / Steam）以及下方的网页端即点即玩启动台。 */',
    platforms: [
      {
        id: 'unityroom',
        code: 'PORTAL 01 // EXTERNAL LINK SLOT',
        name: '[外部试玩平台卡片 01 (例: unityroom)]',
        badge: '[属性标签槽位：WebGL 在线即玩]',
        desc: '/* 功能展示位置注释：外部游戏平台 01 说明文本槽位。点击卡片可新窗口打开您的对应平台主页。 */',
        url: 'https://unityroom.com/',
        cta: '[外部平台跳转按钮 01 ↗]',
      },
      {
        id: 'itchio',
        code: 'PORTAL 02 // EXTERNAL LINK SLOT',
        name: '[外部试玩平台卡片 02 (例: itch.io)]',
        badge: '[属性标签槽位：PC 独立包体 / 工程下载]',
        desc: '/* 功能展示位置注释：外部游戏平台 02 说明文本槽位。可用于放置 PC 可执行包体与企划书 PDF 下载页链接。 */',
        url: 'https://itch.io/',
        cta: '[外部平台跳转按钮 02 ↗]',
      },
      {
        id: 'freegame',
        code: 'PORTAL 03 // EXTERNAL LINK SLOT',
        name: '[外部试玩平台卡片 03 (例: 夢現 / BOOTH / Steam)]',
        badge: '[属性标签槽位：完整作品与设定集发布]',
        desc: '/* 功能展示位置注释：外部游戏平台 03 说明文本槽位。可用于关联更多作品发布渠道。 */',
        url: 'https://freegame-mugen.jp/',
        cta: '[外部平台跳转按钮 03 ↗]',
      },
    ],
    browserLabTag: 'EMBEDDED PLAYABLE LAB // [功能展示位：网页内嵌试玩实验室]',
    browserLabTitle: '[功能标题槽位：无需跳转、在当前网页直接启动可玩原型]',
    browserLabDesc:
      '/* 功能展示位置注释：左栏用于说明网页内嵌试玩区的功能特性；右栏提供 4 个代表作试玩关卡（STAGE 01~04）的一键启动按钮，点击直接打开作品子页面的可交互试玩模式。 */',
    browserLabFeatures: [
      '[功能特性说明槽位 01：点击右侧任意关卡按钮直接进入 60FPS 交互试玩舞台]',
      '[功能特性说明槽位 02：支持嵌入自定义 WebGL 链接或实机 MP4 / GIF 演示源]',
      '[功能特性说明槽位 03：支持键盘与鼠标实时触发动作判定反馈]',
    ],
    browserLabStageSelect: '── STAGE SELECT // [功能展示位：4 部作品试玩关卡一键启动槽位]',

    whatICanDoChapter: 'CHAPTER 03B // [功能展示位置：可胜任工作与核心能力矩阵 (#what-i-can-do)]',
    whatICanDoTitle: '[功能标题槽位：我在游戏制作中能负责的具体工作（4卡片槽位）]',
    whatICanDoLead:
      '/* 功能展示位置注释：参考 haru2401game.github.io/portfolio/#what-i-can-do，用于向招聘官和团队展示您具体能交付什么文档、原型或工具，每张卡片含标题、职责说明、实际应用案例与技术标签。 */',
    capabilities: [
      {
        num: 'CAPABILITY 01',
        category: '[职责分类标签槽位 01]',
        title: '[功能展示位 01：核心胜任能力标题]',
        desc: '/* 功能展示位置注释：能力卡片 01 的具体工作内容与交付标准描述槽位。 */',
        example: '[实际项目应用案例注释槽位 01：说明该能力在哪个作品中如何落地]',
        tags: ['[能力标签 1A]', '[能力标签 1B]', '[能力标签 1C]'],
      },
      {
        num: 'CAPABILITY 02',
        category: '[职责分类标签槽位 02]',
        title: '[功能展示位 02：核心胜任能力标题]',
        desc: '/* 功能展示位置注释：能力卡片 02 的具体工作内容与交付标准描述槽位。 */',
        example: '[实际项目应用案例注释槽位 02：说明该能力在哪个作品中如何落地]',
        tags: ['[能力标签 2A]', '[能力标签 2B]', '[能力标签 2C]'],
      },
      {
        num: 'CAPABILITY 03',
        category: '[职责分类标签槽位 03]',
        title: '[功能展示位 03：核心胜任能力标题]',
        desc: '/* 功能展示位置注释：能力卡片 03 的具体工作内容与交付标准描述槽位。 */',
        example: '[实际项目应用案例注释槽位 03：说明该能力在哪个作品中如何落地]',
        tags: ['[能力标签 3A]', '[能力标签 3B]', '[能力标签 3C]'],
      },
      {
        num: 'CAPABILITY 04',
        category: '[职责分类标签槽位 04]',
        title: '[功能展示位 04：核心胜任能力标题]',
        desc: '/* 功能展示位置注释：能力卡片 04 的具体工作内容与交付标准描述槽位。 */',
        example: '[实际项目应用案例注释槽位 04：说明该能力在哪个作品中如何落地]',
        tags: ['[能力标签 4A]', '[能力标签 4B]', '[能力标签 4C]'],
      },
    ],

    timelineChapter: 'CHAPTER 04B // [功能展示位置：制作历程时间轴与技术专栏 (#timeline)]',
    timelineTitle: '[功能标题槽位：关卡地图式个人成长时间轴 & 外部文章展示区]',
    timelineSub: 'CHRONOLOGICAL STAGE MAP // [时间轴节点槽位]',
    timelineNodes: [
      {
        stage: 'STAGE 01',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[阶段标签槽位 01]',
        title: '[功能展示位：时间轴里程碑节点 01 标题]',
        desc: '/* 功能展示位置注释：在此填写阶段 01 的学习、项目开发或参赛经历描述。 */',
      },
      {
        stage: 'STAGE 02',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[阶段标签槽位 02]',
        title: '[功能展示位：时间轴里程碑节点 02 标题]',
        desc: '/* 功能展示位置注释：在此填写阶段 02 的团队开发、获奖或工具制作经历描述。 */',
      },
      {
        stage: 'STAGE 03',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[阶段标签槽位 03]',
        title: '[功能展示位：时间轴里程碑节点 03 标题]',
        desc: '/* 功能展示位置注释：在此填写阶段 03 的核心代表作研发或实习经历描述。 */',
      },
      {
        stage: 'STAGE 04',
        period: '[YYYY.MM - PRESENT]',
        badge: '[当前求职/研发状态]',
        title: '[功能展示位：时间轴里程碑节点 04 标题]',
        desc: '/* 功能展示位置注释：在此填写当前最新的项目进展与求职目标说明。 */',
      },
    ],
    blogHeader: 'DESIGN NOTES & BLOG // [功能展示位：外部博客与拆解专栏展示区]',
    blogDesc:
      '/* 功能展示位置注释：参考 haru2401game.github.io/portfolio/#blog，用于展示您在知乎 / 机核 / note / 个人博客发布的精选游戏拆解或开发日志外链卡片（3栏）。 */',
    blogArticles: [
      {
        date: 'YYYY.MM.DD',
        tag: '[文章分类标签 01]',
        title: '[功能展示位：精选专栏文章标题槽位 01]',
        summary: '/* 功能展示位置注释：文章 01 的内容摘要槽位，点击卡片可跳转至外部文章链接。 */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[文章分类标签 02]',
        title: '[功能展示位：精选专栏文章标题槽位 02]',
        summary: '/* 功能展示位置注释：文章 02 的内容摘要槽位，点击卡片可跳转至外部文章链接。 */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[文章分类标签 03]',
        title: '[功能展示位：精选专栏文章标题槽位 03]',
        summary: '/* 功能展示位置注释：文章 03 的内容摘要槽位，点击卡片可跳转至外部文章链接。 */',
      },
    ],

    endingBanner: '★ ENDING CREDITS SLOT // [功能展示位置：卷末通关谢幕横幅] ★',
    endingTitle: '[功能标题槽位：THANK YOU FOR EXPLORING / 卷末致谢区]',
    endingLead:
      '/* 功能展示位置注释：参考 haru2401game.github.io/portfolio/#ending，位于页面最底部的通关结算与致谢模块，包含制作署名栏、互动点赞计数器（Kudos）、返回卷首按钮与联系表单跳转按钮。 */',
    credits: [
      {
        role: '[CREDIT SLOT 01 // 企划与内容署名槽位]',
        name: '[在此填写您的姓名 / 个人品牌名称]',
      },
      {
        role: '[CREDIT SLOT 02 // 技术栈与工具署名槽位]',
        name: '[在此填写作品集与项目使用的技术栈列表]',
      },
      {
        role: '[CREDIT SLOT 03 // SPECIAL THANKS 致谢槽位]',
        name: '[在此填写面向招聘官与试玩访客的致谢语]',
      },
    ],
    kudosBtn: '[功能按钮：互动点赞/应援计数器]',
    kudosSent: '[功能反馈：点赞计数已累加！]',
    replayBtn: '[功能按钮：返回卷首顶部 (TOP)]',
    contactBtn: '[功能按钮：滚动至联系表单]',
  },
  en: {
    modeSelectTag: 'SELECT MODE // [Functional Slot: Purpose-Driven Navigation]',
    modeSelectTitle: '[Heading Slot: Visitor Purpose Quick-Jump Cards]',
    modes: [
      {
        id: 'recruit',
        target: 'quick-guide',
        badge: 'MODE 01 // RECRUITER',
        title: '[Functional Slot 01: Recruiter / Hiring Manager Quick Jump]',
        sub: '/* Scrolls smoothly to the 30-Second Summary Card (#quick-guide) */',
      },
      {
        id: 'gamedev',
        target: 'what-i-can-do',
        badge: 'MODE 02 // COLLABORATOR',
        title: '[Functional Slot 02: Dev Team / Collaborator Quick Jump]',
        sub: '/* Scrolls smoothly to the Capabilities Matrix (#what-i-can-do) */',
      },
      {
        id: 'play',
        target: 'play-games',
        badge: 'MODE 03 // PLAYABLE',
        title: '[Functional Slot 03: Instant Playable Games Quick Jump]',
        sub: '/* Scrolls smoothly to the Playable Games Portal (#play-games) */',
      },
    ],
    quickGuideTag: 'QUICK GUIDE // [Functional Slot: 30-Second Summary Card]',
    quickGuideTitle: '[Heading Slot: 30-Second Candidate & Achievement Digest]',
    quickTimer: '0:30 READ SLOT',
    quickItems: {
      roleLabel: '01 // [Functional Slot: Target Role & Specialty]',
      roleMain: '[Primary Text Slot: Target Job Title]',
      roleSub: '/* Annotation: Place your target role, graduation year, and location preference here */',
      skillLabel: '02 // [Functional Slot: Core Engine, Language & Skill Tags]',
      skillTags: [
        '[Skill Tag 01]',
        '[Skill Tag 02]',
        '[Skill Tag 03]',
        '[Skill Tag 04]',
        '[Language/Cert Tag 05]',
        '[Tooling Tag 06]',
      ],
      worksLabel: '03 // [Functional Slot: Flagship Works Quick-Launch Links]',
      statsLabel: '04 // [Functional Slot: Key Achievement Counters (4 Metrics)]',
      stats: [
        { val: '[N]', unit: '[Stat Slot 01: Total Works]' },
        { val: '[N]', unit: '[Stat Slot 02: Awards Won]' },
        { val: '[N]', unit: '[Stat Slot 03: Jams / Expos]' },
        { val: '[N]', unit: '[Stat Slot 04: Design Articles]' },
      ],
    },
    quickContactPrompt: '/* Functional Slot Annotation: Bottom call-to-action prompt text */',
    quickPlayBtn: '[Action Button: Jump to Playable Games]',
    quickMailBtn: '[Action Button: Jump to Contact Form]',

    playGamesChapter: 'CHAPTER 02B // [Functional Slot: Playable Games Portal & Web Lab (#play-games)]',
    playGamesTitle: '[Heading Slot: External Game Portals & Embedded Browser Sandbox]',
    playGamesLead:
      '/* Functional Slot Annotation: Modeled after haru2401game.github.io/portfolio/#play-games. Houses 3 external distribution platform cards (e.g. unityroom, itch.io, BOOTH/Steam) and an embedded browser game launcher below. */',
    platforms: [
      {
        id: 'unityroom',
        code: 'PORTAL 01 // EXTERNAL LINK SLOT',
        name: '[External Platform Card 01 (e.g. unityroom)]',
        badge: '[Badge Slot: WebGL Instant Play]',
        desc: '/* Functional Slot Annotation: Description for external game platform 01. Clicking opens your profile in a new tab. */',
        url: 'https://unityroom.com/',
        cta: '[External Portal Link 01 ↗]',
      },
      {
        id: 'itchio',
        code: 'PORTAL 02 // EXTERNAL LINK SLOT',
        name: '[External Platform Card 02 (e.g. itch.io)]',
        badge: '[Badge Slot: PC Builds & Spec PDFs]',
        desc: '/* Functional Slot Annotation: Description for external game platform 02 for downloadable builds and documentation. */',
        url: 'https://itch.io/',
        cta: '[External Portal Link 02 ↗]',
      },
      {
        id: 'freegame',
        code: 'PORTAL 03 // EXTERNAL LINK SLOT',
        name: '[External Platform Card 03 (e.g. BOOTH / Steam)]',
        badge: '[Badge Slot: Full Releases & Archives]',
        desc: '/* Functional Slot Annotation: Description for external game platform 03. */',
        url: 'https://freegame-mugen.jp/',
        cta: '[External Portal Link 03 ↗]',
      },
    ],
    browserLabTag: 'EMBEDDED PLAYABLE LAB // [Functional Slot: In-Page Playable Stage Launcher]',
    browserLabTitle: '[Heading Slot: Instant Browser Playable Prototype Launcher]',
    browserLabDesc:
      '/* Functional Slot Annotation: Left column explains the embedded playable sandbox features; right column provides 1-click stage launchers for Works 01-04. */',
    browserLabFeatures: [
      '[Feature Slot 01: 1-click launch into the interactive 60FPS playable stage subpage]',
      '[Feature Slot 02: Supports custom WebGL iframe URLs or MP4/GIF gameplay reels]',
      '[Feature Slot 03: Real-time keyboard & mouse input feedback]',
    ],
    browserLabStageSelect: '── STAGE SELECT // [Functional Slot: 1-Click Playable Stage Launchers]',

    whatICanDoChapter: 'CHAPTER 03B // [Functional Slot: What I Can Do in Production (#what-i-can-do)]',
    whatICanDoTitle: '[Heading Slot: Production Capabilities Matrix (4 Cards)]',
    whatICanDoLead:
      '/* Functional Slot Annotation: Modeled after #what-i-can-do. Presents concrete deliverables, project application examples, and skill tags across 4 cards. */',
    capabilities: [
      {
        num: 'CAPABILITY 01',
        category: '[Category Tag Slot 01]',
        title: '[Functional Slot 01: Core Production Capability Title]',
        desc: '/* Functional Slot Annotation: Detailed description of deliverable and workflow for Capability 01. */',
        example: '[Applied Example Callout 01: 1-line note on how this was applied in a project]',
        tags: ['[Tag 1A]', '[Tag 1B]', '[Tag 1C]'],
      },
      {
        num: 'CAPABILITY 02',
        category: '[Category Tag Slot 02]',
        title: '[Functional Slot 02: Core Production Capability Title]',
        desc: '/* Functional Slot Annotation: Detailed description of deliverable and workflow for Capability 02. */',
        example: '[Applied Example Callout 02: 1-line note on how this was applied in a project]',
        tags: ['[Tag 2A]', '[Tag 2B]', '[Tag 2C]'],
      },
      {
        num: 'CAPABILITY 03',
        category: '[Category Tag Slot 03]',
        title: '[Functional Slot 03: Core Production Capability Title]',
        desc: '/* Functional Slot Annotation: Detailed description of deliverable and workflow for Capability 03. */',
        example: '[Applied Example Callout 03: 1-line note on how this was applied in a project]',
        tags: ['[Tag 3A]', '[Tag 3B]', '[Tag 3C]'],
      },
      {
        num: 'CAPABILITY 04',
        category: '[Category Tag Slot 04]',
        title: '[Functional Slot 04: Core Production Capability Title]',
        desc: '/* Functional Slot Annotation: Detailed description of deliverable and workflow for Capability 04. */',
        example: '[Applied Example Callout 04: 1-line note on how this was applied in a project]',
        tags: ['[Tag 4A]', '[Tag 4B]', '[Tag 4C]'],
      },
    ],

    timelineChapter: 'CHAPTER 04B // [Functional Slot: Production Timeline & Blog (#timeline)]',
    timelineTitle: '[Heading Slot: Stage-Map Activity Timeline & Design Blog Cards]',
    timelineSub: 'CHRONOLOGICAL STAGE MAP // [Timeline Node Slots]',
    timelineNodes: [
      {
        stage: 'STAGE 01',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[Milestone Badge 01]',
        title: '[Functional Slot: Timeline Milestone Node 01 Title]',
        desc: '/* Functional Slot Annotation: Describe milestone 01 activities, studies, or projects here. */',
      },
      {
        stage: 'STAGE 02',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[Milestone Badge 02]',
        title: '[Functional Slot: Timeline Milestone Node 02 Title]',
        desc: '/* Functional Slot Annotation: Describe milestone 02 team production or awards here. */',
      },
      {
        stage: 'STAGE 03',
        period: '[YYYY.MM - YYYY.MM]',
        badge: '[Milestone Badge 03]',
        title: '[Functional Slot: Timeline Milestone Node 03 Title]',
        desc: '/* Functional Slot Annotation: Describe milestone 03 flagship work development here. */',
      },
      {
        stage: 'STAGE 04',
        period: '[YYYY.MM - PRESENT]',
        badge: '[Current Status Badge]',
        title: '[Functional Slot: Timeline Milestone Node 04 Title]',
        desc: '/* Functional Slot Annotation: Describe your current production focus and career goal here. */',
      },
    ],
    blogHeader: 'DESIGN NOTES & BLOG // [Functional Slot: External Blog & Article Showcase]',
    blogDesc:
      '/* Functional Slot Annotation: Displays 3 featured external blog/article cards linking to your design notes or devlogs. */',
    blogArticles: [
      {
        date: 'YYYY.MM.DD',
        tag: '[Article Tag 01]',
        title: '[Functional Slot: Featured Blog Article Title 01]',
        summary: '/* Functional Slot Annotation: Article 01 abstract slot (clicks through to external blog URL). */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[Article Tag 02]',
        title: '[Functional Slot: Featured Blog Article Title 02]',
        summary: '/* Functional Slot Annotation: Article 02 abstract slot (clicks through to external blog URL). */',
      },
      {
        date: 'YYYY.MM.DD',
        tag: '[Article Tag 03]',
        title: '[Functional Slot: Featured Blog Article Title 03]',
        summary: '/* Functional Slot Annotation: Article 03 abstract slot (clicks through to external blog URL). */',
      },
    ],

    endingBanner: '★ ENDING CREDITS SLOT // [Functional Slot: Stage-Clear Ending Banner] ★',
    endingTitle: '[Heading Slot: THANK YOU FOR EXPLORING / Ending Credits]',
    endingLead:
      '/* Functional Slot Annotation: Bottom ending card featuring Cast & Credits slots, an interactive Kudos counter button, Return to Top button, and Contact jump button. */',
    credits: [
      {
        role: '[CREDIT SLOT 01 // Planning & Author Attribution]',
        name: '[Author Name / Handle Slot]',
      },
      {
        role: '[CREDIT SLOT 02 // Engineering & Stack Attribution]',
        name: '[Tech Stack & Engine Credits Slot]',
      },
      {
        role: '[CREDIT SLOT 03 // SPECIAL THANKS]',
        name: '[Thank-You Note Slot for Reviewers & Visitors]',
      },
    ],
    kudosBtn: '[Interactive Button: Kudos / Like Counter]',
    kudosSent: '[Feedback: Kudos Increment Recorded!]',
    replayBtn: '[Action Button: Return to Cover (TOP)]',
    contactBtn: '[Action Button: Scroll to Contact Form]',
  },
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
                    onClick={() => onOpenSpec(proj, 'playable')}
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
                    onClick={() => onOpenSpec(proj, 'playable')}
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
                      <span className="text-[#C84B31] dark:text-[#E57052] shrink-0">START ▶</span>
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
                  <span>[ARTICLE LINK SLOT]</span>
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
