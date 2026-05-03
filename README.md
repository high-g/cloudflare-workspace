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
└── nextjs-app/                # Cloudflare Pages + Next.js 16.2
    ├── src/app/
    ├── next.config.ts
    ├── tsconfig.json
    └── package.json
```

## デプロイ済み

| サービス | URL |
|----------|-----|
| hono-api (Workers) | https://hono-api.high-g.workers.dev/ |

## 開発

```bash
cd hono-api
pnpm wrangler dev   # ローカル開発サーバー → http://localhost:8787
pnpm lint           # oxlint
pnpm fmt            # oxfmt
pnpm wrangler deploy  # Cloudflare Workers へデプロイ
```

## 関連リポジトリ

- `nextjs-workspace` — Docker + AWS（EC2 / CodeDeploy / ECS）← 完了済み
- `lambda-workspace` — AWS Lambda + API Gateway（未着手）
