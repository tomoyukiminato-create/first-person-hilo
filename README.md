# First Person HiLo PWA（正しい的中確率版）

写真レイアウトを維持し、LOW側を左・HIGH側を右に配置したPWAです。

## 修正した確率ロジック

Evolution公式の First Person HiLo ルールに合わせています。

- 通常（3〜K）
  - 左：Lower or Same
  - 右：Higher or Same
- 2
  - 左：Same
  - 右：Higher
- A
  - 左：Lower
  - 右：Same
- 次のカードは毎回、新しい52枚デッキから配られるため、過去カードは確率から減算しません。

### 例：現在カードが7
- Lower or Same = 2,3,4,5,6,7 = 6ランク × 4枚 = 24/52 = 46.1538%
- Higher or Same = 7,8,9,10,J,Q,K,A = 8ランク × 4枚 = 32/52 = 61.5385%

### 端のカード
- 2: Same = 4/52 = 7.6923%、Higher = 48/52 = 92.3077%
- A: Lower = 48/52 = 92.3077%、Same = 4/52 = 7.6923%

## EV
EV = 的中確率 × 払戻し倍率

## iPhoneで使う
1. ZIPを展開
2. 中身をGitHub Pagesのリポジトリ直下へアップロード
3. SafariでGitHub Pages URLを開く
4. 共有 → ホーム画面に追加 → 追加

Service Workerのキャッシュ名も更新しているため、GitHub Pagesへ上書き後に新しい版へ更新されやすい構成です。
