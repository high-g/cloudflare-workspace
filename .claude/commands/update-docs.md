以下の手順でREADME.mdとCLAUDE.mdを現在のプロジェクト状態に合わせて更新せよ。

1. 以下のファイル・ディレクトリを読み取る
   - /Users/tanifumiya/cloudflare-workspace/README.md
   - /Users/tanifumiya/cloudflare-workspace/CLAUDE.md
   - /Users/tanifumiya/cloudflare-workspace/ 以下のディレクトリ構造（find コマンドで取得）
   - 各パッケージの package.json
   - wrangler.toml（存在する場合）
   - tsconfig.json（存在する場合）

2. 読み取った情報をもとに、以下の観点でREADME.mdとCLAUDE.mdを更新する
   - 「現在の状況」セクションを実際の状態に更新（完了済みの項目・未完了の項目）
   - 「次にやること」を現時点での正確な次ステップに更新
   - スタック・ツール情報を実際にインストールされているものに合わせる（oxlint / oxfmt / tsconfig の設定等）
   - 古くなったコマンド例・設定値を修正（compatibility_date 等）
   - 用語解説に不足があれば追記

3. 更新時の制約
   - CLAUDE.mdの「生成AIによる編集について」セクションの冒頭ルールは削除・変更しない
   - nextjs-workspaceとの比較表は構造を維持したまま内容のみ更新
   - 学習の流れ・モチベ・関連リポジトリのセクション構造は維持する
