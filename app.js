"use strict";
const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let selectedIndex=5;
const $=id=>document.getElementById(id);
const format=n=>new Intl.NumberFormat("ja-JP",{maximumFractionDigits:4}).format(n);
const amount=n=>($('unit').value==='$'?'$':'')+format(n)+($('unit').value==='円'?'円':'');
function renderRanks(){
  const grid=$('rankGrid');grid.replaceChildren();
  ranks.forEach((rank,index)=>{const button=document.createElement('button');button.type='button';button.className='rank-btn'+(index===selectedIndex?' selected':'');button.setAttribute('aria-pressed',String(index===selectedIndex));button.textContent=rank;button.addEventListener('click',()=>{selectedIndex=index;renderRanks();calculate()});grid.append(button)});
}
function readAmount(id){const value=$(id).value.trim();if(value==='')return null;const number=Number(value);return Number.isFinite(number)&&number>=0?number:null}
function clear(){for(const id of ['cashResult','highResult','lowResult','highProb','lowProb','highDiff','lowDiff','highBreak','lowBreak'])$(id).textContent='—';$('recText').textContent='—';$('recReason').textContent='3つの受取額を入力してください。';$('recommendation').className='recommend'}
function calculate(){
  const cash=readAmount('cashout'),high=readAmount('highPayout'),low=readAmount('lowPayout');
  document.querySelectorAll('.unit-text').forEach(node=>node.textContent=$('unit').value);
  if([cash,high,low].some(value=>value===null)){$('error').hidden=false;clear();return}
  $('error').hidden=true;
  const highCount=13-selectedIndex,lowCount=selectedIndex+1;
  const highEv=high*highCount/13,lowEv=low*lowCount/13;
  $('cashResult').textContent=amount(cash);
  $('highResult').textContent=amount(highEv);
  $('lowResult').textContent=amount(lowEv);
  $('highProb').textContent=`${highCount}/13 (${(highCount/13*100).toFixed(2)}%)`;
  $('lowProb').textContent=`${lowCount}/13 (${(lowCount/13*100).toFixed(2)}%)`;
  for(const [prefix,ev,count] of [['high',highEv,highCount],['low',lowEv,lowCount]]){
    const delta=ev-cash;$(`${prefix}Diff`).textContent=(Math.abs(delta)<1e-10?'':delta>0?'+':'−')+amount(Math.abs(delta));
    $(`${prefix}Diff`).className=delta>1e-9?'positive':delta< -1e-9?'negative':'';
    $(`${prefix}Break`).textContent=amount(cash*13/count);
  }
  const tolerance=1e-10*Math.max(1,cash,highEv,lowEv);
  const best=Math.max(cash,highEv,lowEv);
  let decision='キャッシュアウト',reason='次の1回の期待受取額は、確定額を上回りません。';
  if(best>cash+tolerance){
    if(Math.abs(highEv-lowEv)<=tolerance){decision='HIGH / LOW 同率';reason='両方向の期待受取額が同じで、確定額を上回ります。'}
    else if(highEv>lowEv){decision='HIGH';reason='HIGHの次の1回の期待受取額が最も大きいです。'}
    else{decision='LOW';reason='LOWの次の1回の期待受取額が最も大きいです。'}
  }
  $('recText').textContent=decision;$('recReason').textContent=reason;
  $('recommendation').className='recommend '+(decision==='キャッシュアウト'?'is-cash':decision.startsWith('HIGH')?'is-high':'is-low');
}
for(const id of ['cashout','highPayout','lowPayout','unit'])$(id).addEventListener(id==='unit'?'change':'input',calculate);
$('resetBtn').addEventListener('click',()=>{selectedIndex=5;$('cashout').value='2';$('highPayout').value='3.6';$('lowPayout').value='3.6';$('unit').value='円';renderRanks();calculate()});
$('helpBtn').addEventListener('click',()=>$('helpDialog').showModal());
renderRanks();calculate();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
