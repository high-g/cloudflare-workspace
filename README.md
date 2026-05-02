# cloudflare-workspace

Cloudflare Workers / D1 / Pages の学習用リポジトリ。

## スタック

| ツール | 用途 |
|--------|------|
| [Hono](https://hono.dev) | Cloudflare Workers 上で動かす API フレームワーク |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Cloudflare CLI（dev / deploy / D1 操作） |
| [Drizzle ORM](https://orm.drizzle.team) | D1 / sqlite-core（予定） |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | SQLite 互換 DB（予定） |
| [Cloudflare Pages](https://pages.cloudflare.com) | Next.js デプロイ先（予定） |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) | linter（Rust 製、高速） |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) | formatter（Rust 製、Prettier 互換） |

## ディレクトリ構成

```
cloudflare-workspace/
└── hono-api/        # Cloudflare Workers + Hono API
    ├── src/
    │   └── index.ts
    ├── wrangler.toml
    ├── tsconfig.json
    └── package.json
```

## 開発

```bash
cd hono-api
pnpm wrangler dev   # ローカル開発サーバー → http://localhost:8787
pnpm lint           # oxlint
pnpm fmt            # oxfmt
```

## 関連リポジトリ

- `nextjs-workspace` — Docker + AWS（EC2 / CodeDeploy / ECS）← 完了済み
- `lambda-workspace` — AWS Lambda + API Gateway（未着手）
