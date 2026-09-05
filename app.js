
const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let selectedIndex = 4; // 6

const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ja-JP");

function makeRanks(){
  const g = $("rankGrid");
  g.innerHTML = "";
  ranks.forEach((r,i)=>{
    const b = document.createElement("button");
    b.className = "rank-btn" + (i===selectedIndex ? " selected":"");
    b.textContent = r;
    b.onclick = ()=>{ selectedIndex=i; makeRanks(); calculate(); };
    g.appendChild(b);
  });
}

function optionModel(){
  // Evolution First Person HiLo exact option structure:
  // 2  : SAME / HIGHER
  // 3-K: LOWER OR SAME / HIGHER OR SAME
  // A  : LOWER / SAME
  if(selectedIndex === 0){
    return {
      leftName:"SAME", leftSub:"同じ",
      rightName:"HIGHER", rightSub:"高い",
      leftCards:4, rightCards:48
    };
  }
  if(selectedIndex === 12){
    return {
      leftName:"LOWER", leftSub:"低い",
      rightName:"SAME", rightSub:"同じ",
      leftCards:48, rightCards:4
    };
  }
  return {
    leftName:"LOWER / SAME", leftSub:"低い または 同じ",
    rightName:"HIGHER / SAME", rightSub:"高い または 同じ",
    leftCards:(selectedIndex+1)*4,
    rightCards:(13-selectedIndex)*4
  };
}
function pLowerSame(){ return optionModel().leftCards/52; }
function pHigherSame(){ return optionModel().rightCards/52; }
function reducedFraction(num, den){
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const g=gcd(num,den);
  return `${num/g}/${den/g}`;
}
function evHtml(ev){
  return `${ev>=0?"+":""}${ev.toFixed(3)}<br><small>(${ev>=0?"+":""}${(ev*100).toFixed(2)}%)</small>`;
}
function calculate(){
  const stake = Math.max(0, parseFloat($("stake").value)||0);
  const loPay = Math.max(0, parseFloat($("lowerPayout").value)||0);
  const hiPay = Math.max(0, parseFloat($("higherPayout").value)||0);

  const loOdds = stake>0 ? loPay/stake : 0;
  const hiOdds = stake>0 ? hiPay/stake : 0;

  $("lowerOdds").textContent = loOdds.toFixed(2);
  $("higherOdds").textContent = hiOdds.toFixed(2);
  $("ratioLow").textContent = loOdds.toFixed(2);
  $("ratioHigh").textContent = hiOdds.toFixed(2);

  const m = optionModel();

  // Dynamic labels are important for 2 and A.
  $("lowerOddsName").textContent = m.leftName;
  $("lowerOddsSub").textContent = m.leftSub;
  $("higherOddsName").textContent = m.rightName;
  $("higherOddsSub").textContent = m.rightSub;
  $("lowerPayoutLabel").textContent = `${m.leftName} 当選金`;
  $("higherPayoutLabel").textContent = `${m.rightName} 当選金`;
  $("lowerResultName").textContent = m.leftName;
  $("higherResultName").textContent = m.rightName;

  const plo = m.leftCards/52;
  const phi = m.rightCards/52;

  $("lowerProb").textContent=(plo*100).toFixed(2)+"%";
  $("higherProb").textContent=(phi*100).toFixed(2)+"%";
  $("lowerFrac").textContent=`${m.leftCards}/52 = ${reducedFraction(m.leftCards,52)}`;
  $("higherFrac").textContent=`${m.rightCards}/52 = ${reducedFraction(m.rightCards,52)}`;

  // Net expected return per 1 unit staked:
  // EV = P(win) * gross payout multiplier - 1
  const evLo=plo*loOdds-1;
  const evHi=phi*hiOdds-1;

  $("lowerEv").innerHTML=evHtml(evLo);
  $("higherEv").innerHTML=evHtml(evHi);
  $("lowerEv").className=evLo>=0?"positive":"negative";
  $("higherEv").className=evHi>=0?"positive":"negative";

  const loProfit=loPay-stake;
  const hiProfit=hiPay-stake;
  $("lowerProfit").textContent=(loProfit>=0?"+":"")+money(loProfit)+"円";
  $("higherProfit").textContent=(hiProfit>=0?"+":"")+money(hiProfit)+"円";

  const chooseLeft = evLo >= evHi;
  $("recText").textContent = chooseLeft ? m.leftName : m.rightName;
  $("recSub").textContent = chooseLeft ? m.leftSub : m.rightSub;
  $("recommendation").className = "recommend " + (chooseLeft ? "low-rec":"high-rec");
}
["stake","lowerPayout","higherPayout"].forEach(id=>$(id).addEventListener("input",calculate));
$("resetBtn").onclick=()=>{
  selectedIndex=4;
  $("stake").value="47";
  $("lowerPayout").value="123";
  $("higherPayout").value="68";
  makeRanks(); calculate();
};
$("helpBtn").onclick=()=>$("helpDialog").showModal();

makeRanks();
calculate();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
}
