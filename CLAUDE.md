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
  - `src/index.ts` 作成（GET `/` / GET `/posts`）
  - oxlint / oxfmt / wrangler / @cloudflare/workers-types インストール済み
  - `pnpm wrangler dev` でローカル動作確認済み（http://localhost:8787）
- Wrangler ログイン済み・Cloudflare Workers へデプロイ済み ✅
  - サブドメイン: `high-g.workers.dev`
  - デプロイ先: https://hono-api.high-g.workers.dev/
  - 動作確認済み（GET `/` / GET `/posts`）

### 次にやること

1. **D1 データベース作成**

```bash
cd hono-api
pnpm wrangler d1 create hono-db
```

2. **`wrangler.toml` に D1 バインディング追加**

```toml
[[d1_databases]]
binding = "DB"
database_name = "hono-db"
database_id = "<作成時に表示されるID>"
```

3. **Drizzle ORM セットアップ（sqlite-core）**

```bash
pnpm add drizzle-orm
pnpm add -D drizzle-kit
```

4. **スキーマ定義・マイグレーション・CRUD 実装**

5. **Next.js → Cloudflare Pages にデプロイ**

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
静的サイトおよび SSR アプリのホスティングサービス。Next.js は `@cloudflare/next-on-pages` を使ってデプロイする。Edge Runtime 制約（Node.js API 不可）があるため、既存コードが動かない箇所が出ることがある。Workers より後に取り組む。

**oxlint**
OXC プロジェクトが開発した Rust 製 linter。ESLint より大幅に高速。`oxlint src` で実行。

**oxfmt**
OXC プロジェクトが開発した Rust 製 formatter。Prettier 互換で約30倍高速。`oxfmt` で実行、`oxfmt --check` でチェックのみ。

**compatibility_date**
`wrangler.toml` に記載する Workers ランタイムのバージョン固定設定。その日付時点の挙動が保証される。プロジェクト作成日を設定するのが一般的。
