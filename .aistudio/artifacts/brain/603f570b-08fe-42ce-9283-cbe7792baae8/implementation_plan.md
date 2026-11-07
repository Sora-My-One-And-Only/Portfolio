# 个人求职主页重构方案：低密度呼吸感排版与柔和视差动效

本次重构旨在进一步降低主页的信息密度与视觉压迫感：通过极致精简 Hero 首屏文字、将 About 与 Skills 升级为大间距轻量半透明卡片并调低字重，同时为五大核心版块引入标题与卡片网格的柔和纵向错位视差效果（Parallax Scroll），打造克制、舒适、富有层次感的阅读体验。

## User Review & Critical Decisions

> [!IMPORTANT]
> 以下为您在问答阶段确认的核心设计决策，确认无误后点击 **Proceed** 即可立即执行代码重构：

- **Confirmed Decision 1（Hero 首屏极简重构）**：仅保留「姓名与求职方向标识」、「核心定位短句」与「单一主行动按钮（查看代表作）」，移除原有的长句副标题与次要按钮，留出充足首屏呼吸空间。
- **Confirmed Decision 2（About 与 Skills 轻量半透明卡片）**：采用轻量半透明毛玻璃表面（`bg-white/70 dark:bg-[#131722]/65 backdrop-blur-md`）搭配细微边框，大幅拉大版块留白（`py-28 lg:py-36`）与卡片内外间距（`p-8 sm:p-10`、`gap-8 lg:gap-12`），将标题与正文字重调低至 `font-medium` / `font-normal`，并将主页 Skills 与游戏履历条目精简为最核心的 **4 项**（完整列表仍可在独立子页面查阅）。
- **Confirmed Decision 3（柔和纵向错位视差）**：基于 `useScroll`、`useTransform` 与 `useSpring` 构建可复用的柔和视差容器，使每个版块的「章节标题栏」与「内容卡片组」随页面滚动产生平滑的微幅纵向位移差（如标题缓移 `-14px ~ +14px`，卡片组缓移 `+24px ~ -24px`），营造自然的景深层次。

---

## 1. Overview & Core Concept

- **What It Does**：对个人求职展示网站的主页（Main View）进行全面减法与视觉降噪，在不丢失任何独立子页面（企划仕样书详情页、完整游戏履历与作品集子页）深度内容的前提下，让主页成为呼吸感十足的「第一印象导览画廊」。
- **Target Audience / Persona**：日本游戏行业的招聘负责人（人事・リードプランナー）。在快速浏览时不会被密集的文字墙或粗重字重干扰，能够舒服地捕捉核心定位并顺畅点入代表作仕样书。
- **Key Value**：更低的信息密度、更克制的字重对比、更柔和的滚动视差韵律。

---

## 2. User Experience & Visual Design

### 视觉识别与排版降噪（Visual Identity & Typography）
- **Color & Surface Atmosphere（60-30-10 法则）**：
  - **60% 柔和画布**：浅色模式采用温润宣纸白（`#F7F5F0`），深色模式采用深邃静谧墨黑（`#0B0D13`）。
  - **30% 轻量半透明卡片**：卡片表面统一升级为 `bg-white/70 dark:bg-[#131722]/65 backdrop-blur-md`，配以低对比度细边框（`border-slate-200/70 dark:border-[#23293A]/70`），消除厚重色块的生硬分割。
  - **10% 视觉焦点**：仅在单一主按钮、章节序号与激活态使用绯红强调色（`#E11D48`）。
- **Typography & Lowered Font Weight（调低字重与行距优化）**：
  - **Hero 主标题**：由 `font-bold` 调低为 `font-medium tracking-tight leading-[1.18]`，字号克制优雅。
  - **版块标题（Section Headings）**：由 `font-bold` 调低为 `font-medium`（600/500 权重过渡），搭配宽松字距。
  - **卡片内标题与技能项**：统一采用 `font-medium` 替代原来的 `font-bold`，正文描述采用 `font-normal leading-relaxed text-slate-500 dark:text-slate-400`，大幅减轻阅读疲劳。

### 各版块空间重构细节（Section-by-Section Layout）
1. **Hero 首屏（极简聚焦）**：
   - 垂直居中留白（`min-h-[86vh]`），仅呈现：
     1. 顶部轻量身份行：`林 海斗 (Kaito Lin) · GAME PLANNER`
     2. 单句核心短句：`1/60秒の手触りと、立体箱庭を設計する。`（支持中/日/英切换）
     3. 单一主按钮：`作品・仕様書を見る`（点击平滑滚动至作品区）
   - 底部保留轻盈的 `SCROLL` 呼吸箭头，并随首屏向下滚动产生柔和淡出与位移视差。
2. **01. About（个人定位 · 3 张大间距半透明卡片）**：
   - 外层上下内边距扩大至 `py-28 lg:py-36`，卡片间距扩大至 `gap-8 lg:gap-10`，卡片内边距提升至 `p-8 sm:p-10`。
   - 每张卡片仅保留柔和序号、简短标题（`font-medium`）与精炼至 20 字以内的单行要点。
3. **02. Selected Works（代表作 · 视觉优先 2×2 画廊）**：
   - 扩大网格间距至 `gap-8 lg:gap-10`，卡片底部信息区去繁就简，仅展示作品名（`font-medium`）与核心标签，点击即平滑切换至独立仕样书详情页。
4. **03 & 04. Skills & Game Log（核心技能与游戏履历 · 精简 4 项 + 呼吸感卡片）**：
   - 双栏间距扩大至 `gap-12 lg:gap-16`。
   - **Skills 卡片**：精选 **4 项**最具代表性的核心能力（战斗帧数设计、3D 箱庭关卡、Boss AI 平衡、前端与引擎原型开发），进度条变细为 `h-1.5`，行距拉大至 `space-y-7`，字重降为 `font-normal`。
   - **Game Log 卡片**：精选 **4 部**核心拆解代表作，每行间距拉大至 `py-5 px-6`，字体改为轻量 `font-normal` / `font-medium`，点击可进入完整拆解子页。
5. **05. GitHub & Contact（底部开源动态与联系表单）**：
   - 同步应用半透明卡片样式、`py-28` 呼吸间距、轻量字重与纵向视差容器。

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1：基于 Scroll Offset 的双层错位视差（Dual-Layer Parallax）**
  - *Chosen Approach*：为每个版块封装独立的视差追踪容器，利用 `useScroll({ target, offset: ['start end', 'end start'] })` 分别驱动「章节标题层（Header Layer）」与「内容卡片层（Content Grid Layer）」的 `translateY`，并通过 `useSpring` 赋予阻尼缓冲。
  - *Why*：仅使用 GPU 合成层属性（`transform: translate3d`），保证 60FPS 丝滑帧率，同时让标题与卡片在滚动时产生微妙的呼吸错位感，避免生硬呆板的整块平移。
- **Decision 2：主页精简为 4 项核心技能与履历，详情沉入子页**
  - *Chosen Approach*：主页 Skills 与 Game Log 各展示 4 项精选条目，配合大内边距半透明卡片；更多作品与深度解析保留在独立子页面。
  - *Why*：减少主页垂直堆叠的横条数量，让每一项核心技能都拥有充足的视觉留白。

---

## 4. Technical Architecture & Data Strategy

### 组件与视差架构图（Architecture & Parallax Flow）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        App Root & Sticky Header                         │
│    [Brand: KUROGANE]  ───  [5 Minimal Nav Links]  ───  [Lang + Theme]   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     Main Showcase View ('main')   │ │  Animated Sub-Pages (AnimatePres) │
│  (Low-Density + Soft Parallax)    │ │  - WorkDetailSubPage ('spec')     │
└─────────────────┬─────────────────┘ │  - GameResumeSubPage ('resume')   │
                  │                   └───────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Hero Parallax Stage (useScroll -> yText / opacity fade)              │
│    - Name & Role Kicker + Concise 1-Line Headline + Single Primary CTA  │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. ParallaxSection Wrapper (Reusable per-section scroll tracker)        │
│    ├─ Header Layer: smooth spring y-offset [-14px -> +14px]             │
│    └─ Cards Layer:  smooth spring y-offset [+28px -> -28px]             │
│       ├─ 01. About: 3 Semi-Translucent Cards (p-9, gap-9, font-medium)  │
│       ├─ 02. Works: 2x2 Visual Cards (gap-9, clean 1-line footer)       │
│       ├─ 03. Skills & Game Log: 4 Core Items Each (h-1.5 bar, space-y-7)│
│       ├─ 04. GitHubLiveModule: 3 Semi-Translucent Repo Cards            │
│       └─ 05. ContactFormSection: Airy Semi-Translucent Contact Card     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 交互与状态映射（Interactive State Mapping）
- **视差滚动计算（`ParallaxSection` & Hero Parallax）**：每个版块通过独立 `ref` 监听自身在视口中的滚动进度 `scrollYProgress (0 → 1)`，经 `useSpring(progress, { stiffness: 90, damping: 26 })` 平滑处理后，映射为标题层与内容层的错位 `y` 偏移量。
- **平滑锚点与子页路由**：点击 Hero 单一主按钮平滑滚动至 `#works`；点击任意作品卡片或游戏履历条目，通过 `AnimatePresence` 切换至对应独立子页面并自动滚动至顶部。
