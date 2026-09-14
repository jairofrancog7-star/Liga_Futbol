/* V38 FIX31 — tarjetas de equipos uniformes en TODAS las categorías.
   Un panel de escudo + un mini escudo; elimina cajas visuales heredadas/duplicadas. */
(()=>{'use strict';
if(window.__JR63Fix31)return;window.__JR63Fix31=true;window.__JR62Fix30=true;window.__JR59PrimeraStrict=true;

const BUILD='38-31';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png?build=38-31';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
const initials=v=>String(v||'?').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase();

let data=null;
let logoIndex=new Map();
let officialNames=[];

function logoValue(v){
  if(typeof v==='string')return v;
  return v?.local||v?.source||'';
}
function rebuildIndex(){
  logoIndex=new Map();
  Object.entries(data?.team_logos||{}).forEach(([team,v])=>{
    const src=logoValue(v);
    if(src)logoIndex.set(norm(team),{team,src});
  });
  officialNames=[...logoIndex.values()].sort((a,b)=>b.team.length-a.team.length);
}
async function loadOfficial(){
  try{
    const r=await fetch(`./data/official-live.json?build=${BUILD}&t=${Date.now()}`,{cache:'no-store',credentials:'omit'});
    if(r.ok){data=await r.json();rebuildIndex();}
  }catch(_){}
}
function explicitName(card){
  return [
    card?.dataset?.jr60team,card?.dataset?.jr62Team,card?.dataset?.jr63Team,
    card?.dataset?.v27TeamCard,card?.dataset?.team,card?.dataset?.club,
    card?.getAttribute?.('data-team-name'),card?.getAttribute?.('data-v27-team')
  ].find(Boolean)||'';
}
function headingName(card){
  const nodes=$$('h2,h3,h4,h5,b,strong,[data-team-name]',card);
  for(const el of nodes){
    const t=String(el.textContent||'').trim();
    const n=norm(t);
    if(!n||n.length>60)continue;
    if(/PRIMERA FUERZA|INTERMEDIA|SEGUNDA FUERZA|VETERANOS|TORNEO|COPA|FINAL/.test(n))continue;
    return t;
  }
  return '';
}
function existingImage(card){
  return $$('img',card).map(img=>img.getAttribute('src')||img.currentSrc||img.src||'')
    .find(src=>src&&!/primera-fuerza-hd/i.test(src))||'';
}
function resolveTeam(card){
  let name=explicitName(card);
  let hit=name?logoIndex.get(norm(name)):null;
  if(!hit){
    const text=norm(card?.textContent||'');
    hit=officialNames.find(x=>text.includes(norm(x.team)))||null;
  }
  if(hit)return {team:hit.team,src:hit.src};
  if(!name)name=headingName(card);
  if(!name)return null;
  const byName=logoIndex.get(norm(name));
  return {team:byName?.team||name,src:byName?.src||existingImage(card)};
}
function isCategorySummary(card){
  if(card?.parentElement?.id==='teamsGrid')return false;
  const t=norm(card?.textContent||'');
  return /PRIMERA FUERZA|INTERMEDIA|SEGUNDA FUERZA|VETERANOS 35|VETERANOS 50/.test(t)&&
         /EQUIPOS|JUGADORES|PENDIENTES|JUGADOS/.test(t)&&!explicitName(card);
}
function teamCards(){
  const set=new Set();
  $$('#teamsGrid > *').forEach(x=>set.add(x));
  ['.team-card','[data-v27-team-card]','[data-team-card]','.club-card','.jr60-team-card'].forEach(s=>$$(s).forEach(x=>set.add(x)));
  return [...set].filter(x=>!isCategorySummary(x));
}
function removeOldFixNodes(card){
  $$(':scope > .jr62-team-hero-logo,:scope > .jr62-secondary-team-logo-wrap,:scope > .jr63-team-hero-logo,:scope > .jr63-mini-logo',card).forEach(n=>n.remove());
}
function isVisualOnly(el){
  if(!el||el.children.length===0)return !(el.textContent||'').trim();
  const text=(el.textContent||'').trim();
  return !text&&[...el.children].every(c=>c.matches?.('img,picture,svg'));
}
function hideLegacyVisuals(card,team){
  const miniNorm=norm(initials(team));
  const visualSelectors=[
    '.team-logo','.team-badge','.club-logo','.club-badge','.crest','.avatar',
    '.jr31-teamcell__logo','.jr31-avatar','.v32-team-logo','.v31-team-logo',
    '[class*="team-logo"]','[class*="club-logo"]','[class*="team-badge"]','[class*="club-badge"]','[class*="crest"]','[class*="avatar"]'
  ].join(',');
  $$(visualSelectors,card).forEach(el=>{
    if(el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))return;
    el.classList.add('jr63-legacy-visual');
  });
  $$('img,picture,svg',card).forEach(el=>{
    if(el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))return;
    el.classList.add('jr63-legacy-visual');
    const p=el.parentElement;
    if(p&&p!==card&&isVisualOnly(p))p.classList.add('jr63-legacy-visual');
  });
  $$('div,span',card).forEach(el=>{
    if(el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))return;
    const t=norm(el.textContent||'');
    if(t&&t===miniNorm&&el.children.length===0)el.classList.add('jr63-legacy-initial-box');
  });
}
function logoMarkup(team,src,small=false){
  if(src)return `<img src="${String(src).replace(/"/g,'&quot;')}" alt="Escudo ${String(team).replace(/"/g,'&quot;')}" loading="lazy" decoding="async">`;
  return `<span class="jr63-logo-fallback${small?' small':''}">${initials(team)}</span>`;
}
function patchTeamCard(card){
  const resolved=resolveTeam(card);
  if(!resolved)return false;
  const {team,src}=resolved;
  removeOldFixNodes(card);
  card.classList.add('jr63-fixed-team-card');
  if(card.parentElement?.id==='teamsGrid')card.classList.add('jr63-grid-team-card');
  card.dataset.jr63Team=team;

  hideLegacyVisuals(card,team);

  const hero=document.createElement('div');
  hero.className='jr63-team-hero-logo';
  hero.innerHTML=logoMarkup(team,src,false);
  card.insertBefore(hero,card.firstChild);

  const mini=document.createElement('span');
  mini.className='jr63-mini-logo';
  mini.innerHTML=logoMarkup(team,src,true);
  hero.insertAdjacentElement('afterend',mini);
  return true;
}

function categoryCards(){
  const set=new Set();
  ['[data-category]','[data-v20-cat]','[data-v21-cat]','[data-v22-cat]','[data-v23-cat]','[data-v24-cat]','[data-v25-cat]','[data-v26-cat]','[data-v27-cat]','[data-v30-cat]','[data-v31-cat]','.category-card','[class*="category-card"]','[class*="categoria-card"]','[class*="cat-card"]']
    .forEach(s=>$$(s).forEach(x=>set.add(x)));
  return [...set];
}
function patchPrimera(){
  categoryCards().forEach(card=>{
    if(card.closest('#teamsGrid,.team-card,.club-card,[data-v27-team-card],[data-team-card],.jr60-team-card'))return;
    const t=norm(card.textContent||card.dataset?.category||'');
    if(!t.includes('PRIMERA FUERZA'))return;
    let wrap=$('.jr63-pf-category-wrap',card);
    if(!wrap){
      wrap=document.createElement('span');wrap.className='jr63-pf-category-wrap';
      card.insertBefore(wrap,card.firstChild);
    }
    wrap.innerHTML=`<img class="jr63-pf-category-logo" src="${PF_LOGO}" alt="Primera Fuerza · Juventino Rosas">`;
    $$('img',card).forEach(img=>{
      if(wrap.contains(img)||img.closest('#teamsGrid,.team-card,.club-card,.jr60-team-card'))return;
      const sig=norm([img.alt,img.title,img.getAttribute('src')].filter(Boolean).join(' '));
      if(sig.includes('LIGA JUVENTINO')||sig.includes('LIGA FUTBOL')||sig.includes('PRIMERA FUERZA'))img.classList.add('jr63-old-category-logo');
    });
    card.dataset.jr63Primera='1';
  });
}
function patchAll(){
  teamCards().forEach(patchTeamCard);
  patchPrimera();
  document.documentElement.dataset.jr63Cards='ready';
}
function schedule(){[0,80,220,550,1100,2200,4200].forEach(ms=>setTimeout(patchAll,ms));}
async function init(){await loadOfficial();schedule();}

document.addEventListener('click',e=>{
  if(e.target.closest('[data-view],[data-category],[data-v20-cat],[data-v21-cat],[data-v25-cat],[data-v27-team-card],button,a'))setTimeout(patchAll,120);
},true);
document.addEventListener('change',e=>{if(e.target.matches('select,input'))setTimeout(patchAll,120);},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('focus',()=>setTimeout(patchAll,80));
window.JRLogoFixV3831={build:BUILD,refresh:patchAll,reload:async()=>{await loadOfficial();patchAll();}};
window.JRLogoFixV3830=window.JRLogoFixV3831;
window.JRPrimeraLogoV3827={build:BUILD,logo:PF_LOGO,refresh:patchAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();