# First Person Hi-Lo v4 PWA

GitHub Pages向けの静的PWAです。ビルド作業は不要です。

## v4の主な機能
- 2〜Aの13枚を常時表示し、現在カードを1タップ入力
- Fresh Deck前提でLOW/HIGH確率を即時計算
- 最初の予想（RTP 99%）/ 成功後（理論RTP 100%）切替
- ゲーム画面の実倍率を入力してEVを即時計算
- EVが高い側を比較表示
- カード履歴を自動保存
- Undo / 履歴リセット
- iPhone縦画面最適化
- PWA / オフライン対応

## GitHub Pagesへの配置
ZIPを展開し、以下をリポジトリのルートに置いてください。

- index.html
- manifest.webmanifest
- sw.js
- icons/

GitHub Pagesを main ブランチ / root から公開すれば動作します。

## iPhone
Safariで公開URLを開く → 共有 →「ホーム画面に追加」

## 確率
各予想を新しい52枚デッキ（13ランク×4枚）として計算します。
履歴は統計表示専用で、次カード確率には反映しません。

※このツールは計算・記録用で、利益や勝利を保証するものではありません。
