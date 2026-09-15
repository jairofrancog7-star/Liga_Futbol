/* V38 FIX47 — capa final: se ejecuta después de fixes antiguos y repara América de forma idempotente. */
(()=>{'use strict';
if(window.__JR78Fix47)return;
window.__JR78Fix47=true;

const BUILD='38-47';
const AMERICA='./assets/branding/america-veteranos-35-user.png';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const isAmericaName=v=>/(^| )AMERICA( |$)/.test(norm(v));
let selectedUntil=0,timer=0,observer=null;

function imageUrl(){return AMERICA+'?v='+BUILD+'-r1'}
function setImg(img){
  if(!img)return;
  const wanted=imageUrl();
  if(img.getAttribute('src')!==wanted)img.setAttribute('src',wanted);
  img.removeAttribute('srcset');
  img.alt='Club América Veteranos 35+';
  img.title='Club América Veteranos 35+';
  img.loading='eager';img.decoding='async';
}
function teamName(card){
  return card?.dataset?.v27TeamCard||card?.dataset?.team||card?.dataset?.jr63Team||card?.dataset?.jr64Team||card?.getAttribute?.('aria-label')||card?.textContent||'';
}
function isAmericaCard(card){return isAmericaName(teamName(card))}
function headMarkup(){return `<div class="jr78-america-head"><div class="jr78-america-logo"><img src="${imageUrl()}" alt="Club América Veteranos 35+"></div><div class="jr78-america-info"><div class="jr78-america-name">América</div><div class="jr78-america-category">Veteranos 35+ · Juventino Rosas</div><div class="jr78-america-stats"><span><b>17</b> JJ</span><span><b>13</b> PTS</span><span><b>4</b> G</span><span><b>1</b> E</span><span><b>12</b> P</span><span><b>22</b> GF</span><span><b>48</b> GC</span></div></div></div>`}
function repairCard(card){
  if(!card)return;
  card.classList.add('jr78-america-card');
  card.dataset.v27TeamCard='América';
  card.setAttribute('aria-label','Abrir perfil de América');
  let head=$(':scope > .jr78-america-head',card);
  if(!head){card.insertAdjacentHTML('afterbegin',headMarkup());head=$(':scope > .jr78-america-head',card)}
  const img=$('.jr78-america-logo img',head);setImg(img);
  let hint=$('.v27-team-hint',card);
  if(!hint){hint=document.createElement('small');hint.className='v27-team-hint';hint.textContent='Ver perfil · partidos · estadísticas →';card.appendChild(hint)}
}
function miniRows(){
  return $$('button,a,li,.row,.team-row,.club-row,.jr31-teamcell,.team-list-item,#teamsGrid > *').filter(el=>{
    if(el.closest('.jr78-america-head'))return false;
    const txt=norm(el.textContent||'');
    const data=norm([el.dataset?.team,el.dataset?.v27TeamCard,el.getAttribute?.('aria-label')].filter(Boolean).join(' '));
    return isAmericaName(data)||txt==='AMERICA'||txt.startsWith('AMERICA ');
  });
}
function repairMini(el){
  if(!el||el.matches('#teamsGrid > *'))return;
  let box=$(':scope > .jr78-america-mini',el);
  if(!box){box=document.createElement('span');box.className='jr78-america-mini';box.innerHTML='<img alt="Club América Veteranos 35+">';el.insertBefore(box,el.firstChild)}
  setImg($('img',box));
}
function visibleDetailCandidate(){
  if(Date.now()>selectedUntil)return null;
  const roots=$$('#view-teams .card,#view-teams article,#teamsGrid > *,.jr60-team-card,.jr63-fixed-team-card').filter(el=>el.offsetParent!==null);
  const exact=roots.find(isAmericaCard);if(exact)return exact;
  return roots.find(el=>{const t=norm(el.textContent||'');return t.includes('VER PERFIL')&&t.includes('PARTIDOS')&&t.includes('ESTADISTICAS')})||null;
}
function repair(){
  const cards=new Set();
  $$('#teamsGrid > *,.team-card,.club-card,[data-team-card],[data-v27-team-card],.jr60-team-card,.jr63-fixed-team-card').forEach(c=>{if(isAmericaCard(c))cards.add(c)});
  const detail=visibleDetailCandidate();if(detail)cards.add(detail);
  cards.forEach(repairCard);
  miniRows().forEach(repairMini);
  document.documentElement.dataset.jr78Fix47='ready';
}
function queue(ms=60){clearTimeout(timer);timer=setTimeout(repair,ms)}
document.addEventListener('click',e=>{
  const hit=e.target.closest('button,a,li,.row,.team-row,.club-row,#teamsGrid > *,[data-v27-team-card]');
  if(hit&&isAmericaName(teamName(hit))){selectedUntil=Date.now()+15000;[20,90,220,500,1000,1800].forEach(ms=>setTimeout(repair,ms))}
  else queue(100);
},true);
function observe(){if(observer)return;observer=new MutationObserver(()=>queue(70));observer.observe(document.body,{childList:true,subtree:true})}
function start(){repair();observe();[120,350,800,1500,2600,4500,7500,11000].forEach(ms=>setTimeout(repair,ms))}
addEventListener('hashchange',()=>queue(40));addEventListener('pageshow',()=>queue(40));addEventListener('focus',()=>queue(70));
window.JRFix47={build:BUILD,refresh:repair,logo:AMERICA};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
