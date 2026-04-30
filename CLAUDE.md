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
- Drizzle ORM（D1 / sqlite-core）
- Cloudflare D1（SQLite 互換 DB）
- Cloudflare Pages（Next.js のデプロイ先）
- Wrangler（Cloudflare の CLI）

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

## 現在の状況（Workers セットアップ開始）

- Cloudflare アカウント作成済み（Google アカウントで登録）
- `cloudflare-workspace` リポジトリ作成・GitHub push 済み
- Wrangler のインストール・ログインはまだ

### 次にやること

1. **pnpm 初期化 & Wrangler インストール**

```bash
pnpm init
pnpm add -D wrangler
pnpm wrangler login
```

2. **hono-api ディレクトリ作成・初期化**

```bash
mkdir hono-api && cd hono-api
pnpm init
pnpm add hono
pnpm add -D wrangler typescript
```

3. **`wrangler.toml` 作成**

```toml
name = "hono-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
```

4. **`src/index.ts` を Workers 用に作成**

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello from Workers!' }))

export default app
```

5. **ローカル動作確認**

```bash
pnpm wrangler dev
```

6. **デプロイ**

```bash
pnpm wrangler deploy
```

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
| ポート             | 3001                            | Wrangler が自動割り当て                          |

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
