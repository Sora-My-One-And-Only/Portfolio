# Sora Portfolio

ゲーム企画の作品集です。ゲームと制作ツールを題材に、企画の狙い、仕組み、制作で担当した内容を紹介しています。

**[ポートフォリオサイトを開く](https://sora-my-one-and-only.github.io/Portfolio/)**

## 掲載作品

| 作品 | サイトで紹介する内容 |
| --- | --- |
| **ARCANE CHRONICLE — ルミアの冒険譚** | 近接攻撃で詠唱の時間を作る戦闘設計と、足場が崩れる火竜戦のレベル設計 |
| **Level Builder** | 視界とジャンプ軌道を確認しながら、ブラウザでグレーボックスの動線を試すツール |
| **GSParticleStudio** | 複数のレイヤーを重ねて魔法エフェクトを組み立てるパーティクルエディタ |

## サイトの見方

表紙と目次はゲームの設定資料集をイメージしています。作品一覧から詳細を開くと、企画意図と主な仕組みを読めます。日本語を初期表示とし、中国語と英語に切り替えられます。

## ファイル構成

| 編集したい内容 | ファイル |
| --- | --- |
| 作品名、概要、担当、設計事例、オンライン体験リンク | [src/content/works.ts](src/content/works.ts) |
| 表紙、目次、自己紹介、スキルの文言 | [src/content/site-copy.ts](src/content/site-copy.ts) |
| 30秒ガイド、体験リンク、制作の記録、クレジット | [src/content/section-copy.ts](src/content/section-copy.ts) |
| GitHubや連絡フォームの文言 | [src/content/interface-copy.ts](src/content/interface-copy.ts) |
| 制作ノートと別冊のツール作品 | [src/content/design-notes.ts](src/content/design-notes.ts) |
| 画面の構成と部品 | [src/App.tsx](src/App.tsx)、[src/components/](src/components/) |
| 配色とレイアウト | [src/index.css](src/index.css) |
| 作品カードのイメージ図とサイトのBGM | [src/assets/illustrations/](src/assets/illustrations/)、[public/audio/](public/audio/) |

## 使用技術

React・TypeScriptで画面を作り、Viteで静的サイトとしてビルドしてGitHub Pagesに公開します。ローカルでは `npm ci` の後に `npm run dev` で確認できます。
