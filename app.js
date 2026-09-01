
const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let selectedIndex = 5;

const $ = (id) => document.getElementById(id);
const fmtMoney = (n) => Math.round(n).toLocaleString("ja-JP");

function createRankButtons(){
  const grid = $("rankGrid");
  grid.innerHTML = "";
  ranks.forEach((rank, i) => {
    const btn = document.createElement("button");
    btn.className = "rank-btn" + (i === selectedIndex ? " selected" : "");
    btn.textContent = rank;
    btn.addEventListener("click", () => {
      selectedIndex = i;
      createRankButtons();
      calculate();
    });
    grid.appendChild(btn);
  });
}

// Evolution First Person Hi Lo:
 // 各判定ごとに新しい52枚デッキから次のカードが配られる。
 // 各ランクは4枚なので、ランク確率は常に4/52 = 1/13。
 function probabilityLowerSame(){
   const ranksAtOrBelow = selectedIndex + 1;
   return (ranksAtOrBelow * 4) / 52;
 }
 function probabilityHigherSame(){
   const ranksAtOrAbove = 13 - selectedIndex;
   return (ranksAtOrAbove * 4) / 52;
 }

function signed(n, digits=3){
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}`;
}
function evHtml(ev){
  const pct = ev * 100;
  return `${signed(ev,3)}<br><small>(${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%)</small>`;
}

function calculate(){
  const lo = Math.max(0, parseFloat($("lowerOdds").value) || 0);
  const hi = Math.max(0, parseFloat($("higherOdds").value) || 0);
  const currentBet = Math.max(0, parseFloat($("currentBet").value) || 0);
  const nextBet = Math.max(0, parseFloat($("nextBet").value) || 0);

  const pLo = probabilityLowerSame();
  const pHi = probabilityHigherSame();
  const evLo = pLo * lo - 1;
  const evHi = pHi * hi - 1;
  const profitLo = nextBet * Math.max(0, lo - 1);
  const profitHi = nextBet * Math.max(0, hi - 1);
  const ratio = currentBet > 0 ? nextBet / currentBet : 0;

  const loRanks = selectedIndex + 1;
  const hiRanks = 13 - selectedIndex;
  $("lowerProb").textContent = (pLo * 100).toFixed(2) + "%";
  $("higherProb").textContent = (pHi * 100).toFixed(2) + "%";
  $("lowerProb").title = `${loRanks}/13 = ${loRanks*4}/52`;
  $("higherProb").title = `${hiRanks}/13 = ${hiRanks*4}/52`;

  $("lowerEv").innerHTML = evHtml(evLo);
  $("higherEv").innerHTML = evHtml(evHi);
  $("lowerEv").className = evLo >= 0 ? "positive" : "negative";
  $("higherEv").className = evHi >= 0 ? "positive" : "negative";

  $("lowerProfit").textContent = "+" + fmtMoney(profitLo) + " 円";
  $("higherProfit").textContent = "+" + fmtMoney(profitHi) + " 円";
  $("betRatio").textContent = ratio.toFixed(2);

  const lowerWins = evLo > evHi;
  const rec = $("recommendation");
  if (lowerWins){
    rec.className = "recommend lower-rec";
    $("recText").textContent = "LOWER / SAME";
    $("recSub").textContent = "（低い または 同じ）";
  } else {
    rec.className = "recommend higher-rec";
    $("recText").textContent = "HIGHER / SAME";
    $("recSub").textContent = "（高い または 同じ）";
  }
}

["lowerOdds","higherOdds","currentBet","nextBet"].forEach(id => {
  $(id).addEventListener("input", calculate);
});

$("resetBtn").addEventListener("click", () => {
  selectedIndex = 5;
  $("lowerOdds").value = "2.10";
  $("higherOdds").value = "1.60";
  $("currentBet").value = "1000";
  $("nextBet").value = "1500";
  createRankButtons();
  calculate();
});

$("helpBtn").addEventListener("click", () => $("infoDialog").showModal());
$("menuBtn").addEventListener("click", () => $("infoDialog").showModal());
$("historyBtn").addEventListener("click", () => alert("履歴機能は次版で追加できます。"));
$("statsBtn").addEventListener("click", () => alert("統計機能は次版で追加できます。"));
$("settingsBtn").addEventListener("click", () => $("infoDialog").showModal());

createRankButtons();
calculate();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
