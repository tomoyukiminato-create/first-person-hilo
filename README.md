# First Person HiLo PWA（写真レイアウト版）

写真のUIに合わせ、LOWを左・HIGHを右に配置した完成版です。

## iPhoneで使う
1. このフォルダ一式をGitHub PagesなどHTTPSのWebサーバーへアップロード
2. iPhoneのSafariでURLを開く
3. 共有 →「ホーム画面に追加」→「追加」
4. ホーム画面のHiLoアイコンから起動

## 実装
- 2〜Aのカードタップ
- LOW左 / HIGH右
- 倍率直接入力
- 賭け金＋LOW/HIGH払戻し総額から倍率自動計算
- LOW/HIGH確率
- EV比較
- 大きなおすすめ表示
- 判定履歴を端末内保存
- HIGH/LOW比率、平均EV、カード別回数の統計
- 使い方画面
- PWAホーム画面追加
- Service Workerによるオフライン起動
- iPhone用Apple Touch Icon

## 確率ロジック
画像の例「7 → HIGH 53.85% / LOW 46.15%」に合わせたロジックです。
