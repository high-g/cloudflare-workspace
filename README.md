# cloudflare-workspace

Cloudflare Workers / D1 / Pages の学習用リポジトリ。

## スタック

| ツール | 用途 |
|--------|------|
| [Hono](https://hono.dev) | Cloudflare Workers 上で動かす API フレームワーク |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Cloudflare CLI（dev / deploy / D1 操作） |
| [Drizzle ORM](https://orm.drizzle.team) | D1 / sqlite-core |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | SQLite 互換 DB |
| [Cloudflare Pages](https://pages.cloudflare.com) | Next.js デプロイ先 |
| [OpenNext](https://opennext.js.org/cloudflare) | Next.js → Cloudflare Pages アダプター |
| [Next.js 16.2](https://nextjs.org) | フロントエンドフレームワーク |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) | linter（Rust 製、高速） |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) | formatter（Rust 製、Prettier 互換） |

## ディレクトリ構成

```
cloudflare-workspace/
├── pnpm-workspace.yaml        # モノレポ設定
├── package.json               # ルートスクリプト（dev / deploy）
├── hono-api/                  # Cloudflare Workers + Hono API
│   ├── src/
│   │   ├── index.ts           # ルート定義（GET / POST /posts）
│   │   └── db/
│   │       ├── index.ts       # Drizzle クライアント初期化
│   │       └── schema.ts      # posts テーブルスキーマ
│   ├── drizzle/
│   │   └── migrations/        # マイグレーション SQL
│   ├── drizzle.config.ts
│   ├── wrangler.toml
│   ├── tsconfig.json
│   └── package.json
└── nextjs-app/                # Cloudflare Workers + Next.js 16.2（OpenNext）
    ├── src/
    │   ├── app/
    │   │   ├── api/posts/route.ts  # Route Handler（hono-api プロキシ）
    │   │   ├── posts/
    │   │   │   ├── page.tsx        # Server Component（posts 一覧）
    │   │   │   └── action.ts       # Server Action（POST 処理）
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   └── lib/
    │       └── api.ts              # fetch ヘルパー（postJson）
    ├── wrangler.jsonc
    ├── next.config.ts
    ├── tsconfig.json
    └── package.json
```

## デプロイ済み

| サービス | URL |
|----------|-----|
| hono-api (Workers) | https://hono-api.high-g.workers.dev/ |
| nextjs-app (Workers) | https://nextjs-app.high-g.workers.dev/ |

## 開発

```bash
# ルートから一括起動
pnpm dev   # hono-api（:8787）+ nextjs-app（:3000）を同時起動

# 個別起動
pnpm --filter hono-api dev
pnpm --filter nextjs-app dev

# デプロイ
pnpm run deploy:hono-api
pnpm run deploy:nextjs-app
pnpm run deploy:both   # 両方同時デプロイ
```

## 関連リポジトリ

- `nextjs-workspace` — Docker + AWS（EC2 / CodeDeploy / ECS）← 完了済み
- `lambda-workspace` — AWS Lambda + API Gateway（未着手）
