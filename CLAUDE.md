# 生成AIによる編集について

本プロジェクトは学習用に作成しているものなので、生成AIによる編集は、メインのプロジェクトは受け付けない。
ROADMAP.mdやCLAUDE.mdは編集してok
ファイルの編集は全て人がやるので、コードや設定ファイルの変更は手順・内容の提示のみ行う。

---

## プロジェクト概要

### モチベ

- Cloudflare Workers / D1 / Pages の基本を抑える
- nextjs-workspace（Docker + AWS）との比較・違いを理解する

### スタック

- Hono（Cloudflare Workers 上で動かす）
- Wrangler（Cloudflare の CLI）
- Drizzle ORM（D1 / sqlite-core）
- Cloudflare D1（SQLite 互換 DB）
- Cloudflare Pages（Next.js のデプロイ先）
- oxlint（linter、Rust 製）
- oxfmt（formatter、Rust 製、Prettier 互換）

### 学習の流れ

1. Hono API → Cloudflare Workers としてデプロイ
2. Cloudflare D1 との連携（Drizzle + sqlite-core）
3. Next.js → Cloudflare Pages にデプロイ

### 関連リポジトリ

- `nextjs-workspace`: Docker + AWS（EC2 / CodeDeploy / ECS）← 完了済み
- `cloudflare-workspace`: 本リポジトリ
- `lambda-workspace`: AWS Lambda + API Gateway（未着手）

全体ロードマップは `nextjs-workspace/ROADMAP.md` で管理している。

---

## 現在の状況

### 完了済み

- Cloudflare アカウント作成済み（Google アカウントで登録）
- `cloudflare-workspace` リポジトリ作成・GitHub push 済み
- `hono-api/` セットアップ完了
  - `wrangler.toml` 作成（compatibility_date = "2026-05-02"）
  - `tsconfig.json` 作成（target: ESNext、noEmit: true）
  - oxlint / oxfmt / wrangler / @cloudflare/workers-types インストール済み
  - `pnpm wrangler dev` でローカル動作確認済み（http://localhost:8787）
- Wrangler ログイン済み・Cloudflare Workers へデプロイ済み
  - サブドメイン: `high-g.workers.dev`
  - デプロイ先: https://hono-api.high-g.workers.dev/
  - 動作確認済み（GET `/` / GET `/posts`）
- Cloudflare D1 との連携完了
  - D1 データベース作成済み（`hono-db`、APAC リージョン）
  - `wrangler.toml` に D1 バインディング追加（`binding = "DB"`）
  - Drizzle ORM + drizzle-kit インストール済み
  - `src/db/schema.ts` 作成（posts テーブル: id / title / content）
  - `drizzle.config.ts` 作成（dialect: sqlite）
  - `src/db/index.ts` 作成（`createDb` 関数）
  - マイグレーション生成・ローカル & 本番 D1 に適用済み
  - CRUD 実装済み（GET `/posts` / POST `/posts`）
  - ローカル・本番どちらも動作確認済み

- `nextjs-app/` 作成・デプロイ完了（Next.js 16.2.4 / React 19.2.4 / Tailwind CSS v4）
  - oxlint / oxfmt インストール済み
  - OpenNext（`@opennextjs/cloudflare`）でビルド・デプロイ済み
  - デプロイ先: https://nextjs-app.high-g.workers.dev
  - ローカルプレビュー確認済み（`pnpm preview` → http://localhost:8788）

- pnpm workspace + concurrently によるモノレポ化完了
  - ルートに `pnpm-workspace.yaml` 作成（`hono-api` / `nextjs-app`）
  - `concurrently` インストール済み（ルートの devDependencies）
  - ルートの `pnpm dev` で hono-api + nextjs-app を同時起動できる
  - ルートにデプロイスクリプト追加（`deploy:hono-api` / `deploy:nextjs-app` / `deploy:both`）

- App Router の主要機能実装・デプロイ確認完了
  - Route Handlers: `app/api/posts/route.ts`（hono-api へのプロキシ）
  - Server Components: `app/posts/page.tsx`（hono-api から posts 一覧を取得・描画）
  - Server Actions: `app/posts/action.ts`（フォームから POST、`revalidatePath` でキャッシュ破棄）
  - `src/lib/api.ts` に `postJson` ヘルパー作成
  - `wrangler.jsonc` の `vars` に `HONO_API_URL` 設定
  - 本番（https://nextjs-app.high-g.workers.dev/posts）で動作確認済み

### 次にやること

Phase 6 完了。次は Phase 7: AWS Lambda + API Gateway（`lambda-workspace` リポジトリ）。

---

## nextjs-workspace との違い（重要）

| 項目               | nextjs-workspace（ECS）         | cloudflare-workspace（Workers）                  |
| ------------------ | ------------------------------- | ------------------------------------------------ |
| 実行環境           | Node.js（Docker コンテナ）      | V8 アイソレート                                  |
| DB                 | PostgreSQL（pg）                | D1（SQLite 互換）                                |
| Drizzle adapter    | `drizzle-orm/node-postgres`     | `drizzle-orm/d1`                                 |
| スキーマ           | `pg-core`                       | `sqlite-core`                                    |
| エントリーポイント | `serve()` + `@hono/node-server` | `export default app`                             |
| 環境変数           | `.env` / `dotenv`               | `wrangler.toml` の `[vars]` またはダッシュボード |
| ポート             | 3001                            | Wrangler が自動割り当て（デフォルト 8787）       |
| linter             | ESLint                          | oxlint                                           |
| formatter          | Prettier                        | oxfmt                                            |

**Workers では Node.js の API（`fs` / `net` / TCP など）が使えない。**
`pg` は TCP 接続なので Workers では動かない → D1 を使う。

---

## 補足・用語解説

**Cloudflare Workers**
サーバーレスで動く JavaScript/TypeScript の実行環境。Node.js ではなく V8 アイソレートベース。コールドスタートがほぼゼロ・グローバルエッジ配信・無料枠が広い（1日10万リクエスト）。

**Cloudflare D1**
Cloudflare が提供する SQLite 互換のサーバーレス DB。Workers から `env.DB`（バインディング）経由でアクセスする。`wrangler d1 create <name>` で作成、`wrangler d1 migrations apply` でマイグレーション実行。

**Wrangler**
Cloudflare の CLI ツール。`wrangler login` でブラウザ認証、`wrangler dev` でローカル開発、`wrangler deploy` でデプロイ。`wrangler.toml` がプロジェクト設定ファイル（AWS の `serverless.yml` に相当）。

**バインディング（Bindings）**
Workers が外部リソース（D1 / KV / R2 など）にアクセスするための仕組み。`wrangler.toml` で定義し、ハンドラーの第2引数 `env` 経由でアクセスする。Hono では `c.env.DB` のように型付きで使える。

**Workers のエントリーポイント**
Node.js の `http.createServer` に相当するものが Workers では `fetch` ハンドラー。Hono は `app.fetch` を持つため `export default app` でそのままエントリーポイントになる。

**Cloudflare Pages**
静的サイトおよび SSR アプリのホスティングサービス。Next.js は `@opennextjs/cloudflare`（OpenNext）を使ってデプロイする。`export const runtime = 'edge'` が不要で既存コードをそのまま動かせる。`pnpm dlx @opennextjs/cloudflare migrate` で自動セットアップ。

**oxlint**
OXC プロジェクトが開発した Rust 製 linter。ESLint より大幅に高速。`oxlint src` で実行。

**oxfmt**
OXC プロジェクトが開発した Rust 製 formatter。Prettier 互換で約30倍高速。`oxfmt` で実行、`oxfmt --check` でチェックのみ。

**compatibility_date**
`wrangler.toml` に記載する Workers ランタイムのバージョン固定設定。その日付時点の挙動が保証される。プロジェクト作成日を設定するのが一般的。

---

## 参考ドキュメント

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare D1: https://developers.cloudflare.com/d1/
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
- Hono: https://hono.dev/docs
- Drizzle ORM（D1）: https://orm.drizzle.team/docs/get-started/d1-new
- OpenNext（Cloudflare Pages）: https://opennext.js.org/cloudflare
- oxlint: https://oxc.rs/docs/guide/usage/linter.html
- oxfmt: https://oxc.rs/docs/guide/usage/formatter.html
