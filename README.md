# FIRST PERSON HiLo 正確確率版

Evolution First Person HiLo の公式ルールに合わせた確率モデルです。

- 各予想の次カードは新しい52枚デッキから出る
- したがって各ランクの確率は 1/13
- 3〜K: Higher or Same / Lower or Same
- 2: Higher / Same
- A: Same / Lower
- EV = 的中確率 × 配当倍率 − 1

例: 現在カード7
- Higher or Same = 8/13 = 61.5385%
- Lower or Same = 6/13 = 46.1538%
