
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

function pLowerSame(){
  return ((selectedIndex+1)*4)/52;
}
function pHigherSame(){
  return ((13-selectedIndex)*4)/52;
}
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

  const plo = pLowerSame();
  const phi = pHigherSame();
  const loNum=(selectedIndex+1)*4;
  const hiNum=(13-selectedIndex)*4;

  $("lowerProb").textContent=(plo*100).toFixed(2)+"%";
  $("higherProb").textContent=(phi*100).toFixed(2)+"%";
  $("lowerFrac").textContent=`${loNum}/52 = ${reducedFraction(loNum,52)}`;
  $("higherFrac").textContent=`${hiNum}/52 = ${reducedFraction(hiNum,52)}`;

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

  const chooseLow = evLo >= evHi;
  $("recText").textContent = chooseLow ? "LOWER / SAME" : "HIGHER / SAME";
  $("recSub").textContent = chooseLow ? "低い または 同じ" : "高い または 同じ";
  $("recommendation").className = "recommend " + (chooseLow ? "low-rec":"high-rec");
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
