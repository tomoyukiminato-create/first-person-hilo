
const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let selectedIndex=4;
const $=id=>document.getElementById(id);
const money=n=>Math.round(n).toLocaleString("ja-JP");

const exactOptions=[
  {leftName:"SAME",leftSub:"同じ",rightName:"HIGHER",rightSub:"高い",leftCards:4,rightCards:48},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:8,rightCards:48},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:12,rightCards:44},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:16,rightCards:40},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:20,rightCards:36},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:24,rightCards:32},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:28,rightCards:28},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:32,rightCards:24},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:36,rightCards:20},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:40,rightCards:16},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:44,rightCards:12},
  {leftName:"LOWER / SAME",leftSub:"低い または 同じ",rightName:"HIGHER / SAME",rightSub:"高い または 同じ",leftCards:48,rightCards:8},
  {leftName:"LOWER",leftSub:"低い",rightName:"SAME",rightSub:"同じ",leftCards:48,rightCards:4}
];

function model(){return exactOptions[selectedIndex]}
function gcd(a,b){return b?gcd(b,a%b):a}
function frac(n,d){const g=gcd(n,d);return `${n/g}/${d/g}`}
function evHtml(ev){return `${ev>=0?"+":""}${ev.toFixed(3)}<br><small>(${ev>=0?"+":""}${(ev*100).toFixed(2)}%)</small>`}

function renderRanks(){
  const g=$("rankGrid");g.innerHTML="";
  ranks.forEach((r,i)=>{
    const b=document.createElement("button");
    b.className="rank-btn"+(i===selectedIndex?" selected":"");
    b.textContent=r;
    b.onclick=()=>{selectedIndex=i;renderRanks();calculate()};
    g.appendChild(b);
  });
}

function calculate(){
  const stake=Math.max(0,parseFloat($("stake").value)||0);
  const lp=Math.max(0,parseFloat($("lowerPayout").value)||0);
  const hp=Math.max(0,parseFloat($("higherPayout").value)||0);
  const lo=stake>0?lp/stake:0;
  const hi=stake>0?hp/stake:0;
  const m=model();

  $("lowerOddsName").textContent=m.leftName;
  $("lowerOddsSub").textContent=m.leftSub;
  $("higherOddsName").textContent=m.rightName;
  $("higherOddsSub").textContent=m.rightSub;
  $("lowerPayoutLabel").textContent=`${m.leftName} 当選金`;
  $("higherPayoutLabel").textContent=`${m.rightName} 当選金`;
  $("lowerResultName").textContent=m.leftName;
  $("higherResultName").textContent=m.rightName;

  $("lowerOdds").textContent=lo.toFixed(2);
  $("higherOdds").textContent=hi.toFixed(2);
  $("ratioLow").textContent=lo.toFixed(2);
  $("ratioHigh").textContent=hi.toFixed(2);

  const plo=m.leftCards/52, phi=m.rightCards/52;
  $("lowerProb").textContent=(plo*100).toFixed(2)+"%";
  $("higherProb").textContent=(phi*100).toFixed(2)+"%";
  $("lowerFrac").textContent=`${m.leftCards}/52 = ${frac(m.leftCards,52)}`;
  $("higherFrac").textContent=`${m.rightCards}/52 = ${frac(m.rightCards,52)}`;

  const evL=plo*lo-1, evH=phi*hi-1;
  $("lowerEv").innerHTML=evHtml(evL);
  $("higherEv").innerHTML=evHtml(evH);
  $("lowerEv").className=evL>=0?"positive":"negative";
  $("higherEv").className=evH>=0?"positive":"negative";

  const pl=lp-stake, ph=hp-stake;
  $("lowerProfit").textContent=(pl>=0?"+":"")+money(pl)+"円";
  $("higherProfit").textContent=(ph>=0?"+":"")+money(ph)+"円";

  const left=evL>=evH;
  $("recText").textContent=left?m.leftName:m.rightName;
  $("recSub").textContent=left?m.leftSub:m.rightSub;
}

["stake","lowerPayout","higherPayout"].forEach(id=>$(id).addEventListener("input",calculate));
$("resetBtn").onclick=()=>{selectedIndex=4;$("stake").value="47";$("lowerPayout").value="123";$("higherPayout").value="68";renderRanks();calculate()};
$("helpBtn").onclick=()=>$("helpDialog").showModal();

renderRanks();calculate();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"))}
