/* V38 FIX48 — tarjeta canónica de América. Reemplaza el contenido viejo, no lo apila. */
(()=>{'use strict';
if(window.__JR79Fix48)return;window.__JR79Fix48=true;
const BUILD='38-48-r1';
const PNG='https://jairofrancog7-star.github.io/Liga_Futbol/assets/branding/america-veteranos-35-user.png?v='+BUILD;
const SVG='https://jairofrancog7-star.github.io/Liga_Futbol/assets/branding/america-veteranos-35.svg?v='+BUILD;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
let timer=0;
function america(card){
  const data=norm([card?.dataset?.v27TeamCard,card?.dataset?.team,card?.dataset?.club,card?.getAttribute?.('aria-label')].filter(Boolean).join(' '));
  if(/(^| )AMERICA( |$)/.test(data))return true;
  const first=card?.querySelector?.('b,strong,h3,h4,.team-name,.club-name');
  return /(^| )AMERICA( |$)/.test(norm(first?.textContent||''));
}
function markup(){return `<div class="jr79-america-layout">
  <div class="jr79-america-logo"><img data-jr79-logo alt="Club América Veteranos Juventino Rosas"><span class="jr79-america-fallback">A</span></div>
  <div class="jr79-america-copy">
    <div class="jr79-america-title">América</div>
    <div class="jr79-america-category">Veteranos 35+ · Juventino Rosas</div>
    <div class="jr79-america-stats"><span><b>17</b> JJ</span><span><b>13</b> PTS</span><span><b>4</b> G</span><span><b>1</b> E</span><span><b>12</b> P</span><span><b>22</b> GF</span><span><b>48</b> GC</span></div>
    <div class="jr79-america-summary">Equipo registrado en Veteranos 35+. Escudo oficial de América Veteranos Juventino Rosas.</div>
    <div class="jr79-america-hint">Ver perfil · partidos · estadísticas →</div>
  </div>
</div>`}
function wireImage(root){
  const img=$('[data-jr79-logo]',root); if(!img)return;
  const fallback=$('.jr79-america-fallback',root);
  let triedSvg=false;
  img.onload=()=>{img.style.display='block';if(fallback)fallback.style.display='none'};
  img.onerror=()=>{
    if(!triedSvg){triedSvg=true;img.src=SVG;return}
    img.style.display='none';if(fallback)fallback.style.display='grid';
  };
  img.src=PNG;
}
function replaceCard(card){
  if(!card)return;
  card.classList.add('jr79-america-card');
  card.dataset.v27TeamCard='América';
  card.dataset.jr79='48';
  card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-label','Abrir perfil de América');
  if(!$(':scope > .jr79-america-layout',card) || card.children.length!==1){card.innerHTML=markup()}
  wireImage(card);
}
function repairCards(){
  const cards=new Set();
  $$('#teamsGrid > *').forEach(c=>{if(america(c))cards.add(c)});
  $$('#view-teams [data-v27-team-card],#view-teams [data-team],#view-teams .team-card,#view-teams .club-card').forEach(c=>{if(america(c))cards.add(c)});
  cards.forEach(replaceCard);
}
function repairModal(){
  const m=$('#v27Modal.show,#v27Modal'); if(!m)return;
  const title=norm($('#v27ModalTitle',m)?.textContent||'');
  if(!/(^| )AMERICA( |$)/.test(title))return;
  const avatar=$('.v27-team-avatar',m); if(!avatar)return;
  if(!avatar.querySelector('[data-jr79-modal-logo]')){
    avatar.innerHTML='<img data-jr79-modal-logo alt="Club América Veteranos Juventino Rosas" style="display:block;width:100%;height:100%;object-fit:contain">';
  }
  const img=avatar.querySelector('[data-jr79-modal-logo]');
  let svg=false;img.onerror=()=>{if(!svg){svg=true;img.src=SVG}};img.src=PNG;
}
function run(){repairCards();repairModal();document.documentElement.dataset.jr79Fix48='ready'}
function queue(ms=80){clearTimeout(timer);timer=setTimeout(run,ms)}
function start(){run();[120,350,800,1500,2600,4500,8000].forEach(ms=>setTimeout(run,ms));const mo=new MutationObserver(()=>queue());mo.observe(document.body,{childList:true,subtree:true});document.addEventListener('click',()=>queue(100),true);addEventListener('hashchange',()=>queue(50));addEventListener('pageshow',()=>queue(50));addEventListener('focus',()=>queue(80))}
window.JRFix48={build:BUILD,refresh:run,logo:PNG};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
