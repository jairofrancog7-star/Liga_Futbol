/* V38 FIX32 — limpia tarjetas de categoría y conserva FIX31 en equipos.
   En Primera Fuerza deja SOLO el logo de Primera Fuerza; quita Liga Juventino Rosas.
   Reordena texto/métricas de todos los botones de categoría sin romper sus datasets/clicks. */
(()=>{'use strict';
if(window.__JR64Fix32)return;
window.__JR64Fix32=true;
window.__JR63Fix31=true;
window.__JR62Fix30=true;
window.__JR59PrimeraStrict=true;

const BUILD='38-32';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png?build=38-32';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=v=>String(v||'?').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase();

const CAT_META={
  'VETERANOS 35+':{name:'Veteranos 35+',phase:'FINAL',fallback:{Equipos:10,Jugadores:0,'Partidos Jugados':0,'Partidos Pendientes':0}},
  'VETERANOS 50+':{name:'Veteranos 50+',phase:'Torneo de Copa J6',fallback:{Equipos:6,Jugadores:109,'Partidos Jugados':15,'Partidos Pendientes':30}},
  'PRIMERA FUERZA':{name:'Primera Fuerza',phase:'Torneo de Copa J5',fallback:{Equipos:11,Jugadores:291,'Partidos Jugados':20,'Partidos Pendientes':35}},
  'INTERMEDIA':{name:'Intermedia',phase:'Torneo de Copa J5',fallback:{Equipos:13,Jugadores:332,'Partidos Jugados':22,'Partidos Pendientes':54}},
  'SEGUNDA FUERZA':{name:'Segunda Fuerza',phase:'Torneo de Copa J5',fallback:{Equipos:12,Jugadores:312,'Partidos Jugados':23,'Partidos Pendientes':42}}
};

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
  return [card?.dataset?.jr60team,card?.dataset?.jr62Team,card?.dataset?.jr63Team,card?.dataset?.jr64Team,
    card?.dataset?.v27TeamCard,card?.dataset?.team,card?.dataset?.club,
    card?.getAttribute?.('data-team-name'),card?.getAttribute?.('data-v27-team')].find(Boolean)||'';
}
function headingName(card){
  const nodes=$$('h2,h3,h4,h5,b,strong,[data-team-name]',card);
  for(const el of nodes){
    const t=String(el.textContent||'').trim(),n=norm(t);
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
  if(!hit){const text=norm(card?.textContent||'');hit=officialNames.find(x=>text.includes(norm(x.team)))||null;}
  if(hit)return {team:hit.team,src:hit.src};
  if(!name)name=headingName(card);
  if(!name)return null;
  const byName=logoIndex.get(norm(name));
  return {team:byName?.team||name,src:byName?.src||existingImage(card)};
}
function isCategorySummary(card){
  if(card?.parentElement?.id==='teamsGrid')return false;
  const t=norm(card?.textContent||'');
  return Object.keys(CAT_META).some(k=>t.includes(k))&&/EQUIPOS|JUGADORES|PENDIENTES|JUGADOS/.test(t)&&!explicitName(card);
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
  const visualSelectors=['.team-logo','.team-badge','.club-logo','.club-badge','.crest','.avatar','.jr31-teamcell__logo','.jr31-avatar','.v32-team-logo','.v31-team-logo','[class*="team-logo"]','[class*="club-logo"]','[class*="team-badge"]','[class*="club-badge"]','[class*="crest"]','[class*="avatar"]'].join(',');
  $$(visualSelectors,card).forEach(el=>{if(!el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))el.classList.add('jr63-legacy-visual');});
  $$('img,picture,svg',card).forEach(el=>{
    if(el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))return;
    el.classList.add('jr63-legacy-visual');
    const p=el.parentElement;if(p&&p!==card&&isVisualOnly(p))p.classList.add('jr63-legacy-visual');
  });
  $$('div,span',card).forEach(el=>{
    if(el.closest('.jr63-team-hero-logo,.jr63-mini-logo'))return;
    const t=norm(el.textContent||'');if(t&&t===miniNorm&&el.children.length===0)el.classList.add('jr63-legacy-initial-box');
  });
}
function logoMarkup(team,src,small=false){
  if(src)return `<img src="${esc(src)}" alt="Escudo ${esc(team)}" loading="lazy" decoding="async">`;
  return `<span class="jr63-logo-fallback${small?' small':''}">${esc(initials(team))}</span>`;
}
function patchTeamCard(card){
  const resolved=resolveTeam(card);if(!resolved)return false;
  const {team,src}=resolved;
  removeOldFixNodes(card);
  card.classList.add('jr63-fixed-team-card');
  if(card.parentElement?.id==='teamsGrid')card.classList.add('jr63-grid-team-card');
  card.dataset.jr64Team=team;
  hideLegacyVisuals(card,team);
  const hero=document.createElement('div');hero.className='jr63-team-hero-logo';hero.innerHTML=logoMarkup(team,src,false);card.insertBefore(hero,card.firstChild);
  const mini=document.createElement('span');mini.className='jr63-mini-logo';mini.innerHTML=logoMarkup(team,src,true);hero.insertAdjacentElement('afterend',mini);
  return true;
}

function categoryCards(){
  const set=new Set();
  ['[data-category]','[data-v20-cat]','[data-v21-cat]','[data-v22-cat]','[data-v23-cat]','[data-v24-cat]','[data-v25-cat]','[data-v26-cat]','[data-v27-cat]','[data-v30-cat]','[data-v31-cat]','.category-card','[class*="category-card"]','[class*="categoria-card"]','[class*="cat-card"]'].forEach(s=>$$(s).forEach(x=>set.add(x)));
  return [...set].filter(x=>!x.closest('#teamsGrid,.team-card,.club-card,[data-v27-team-card],[data-team-card],.jr60-team-card'));
}
function catKey(card){
  const raw=[card?.dataset?.category,card?.dataset?.v20Cat,card?.dataset?.v21Cat,card?.dataset?.v22Cat,card?.dataset?.v25Cat,card?.textContent].filter(Boolean).join(' ');
  const n=norm(raw);
  return Object.keys(CAT_META).find(k=>n.includes(k))||'';
}
function officialCounts(meta){
  const found=Object.values(data?.categories||{}).find(c=>norm(c?.name)===norm(meta.name));
  return found?.counts||found?.dashboard?.counts||meta.fallback;
}
function phaseFor(meta){
  const found=Object.values(data?.categories||{}).find(c=>norm(c?.name)===norm(meta.name));
  return found?.current_phase||meta.phase;
}
function isLeagueLogo(img){
  const sig=norm([img?.alt,img?.title,img?.getAttribute?.('src'),img?.getAttribute?.('class')].filter(Boolean).join(' '));
  return sig.includes('LIGA JUVENTINO')||sig.includes('LIGA FUTBOL')||sig.includes('JUVENTINO ROSAS LIGA');
}
function pickExistingCategoryLogo(card,key){
  if(key==='PRIMERA FUERZA')return PF_LOGO;
  const imgs=$$('img',card);
  const img=imgs.find(x=>!isLeagueLogo(x)&&!/primera-fuerza-hd/i.test(x.getAttribute('src')||''));
  return img?.getAttribute('src')||img?.currentSrc||'';
}
function categoryIcon(meta,src){
  if(src)return `<img src="${esc(src)}" alt="${esc(meta.name)}" loading="lazy" decoding="async">`;
  return `<span class="jr64-cat-fallback">${esc(initials(meta.name))}</span>`;
}
function patchCategorySummary(card){
  const key=catKey(card);if(!key)return false;
  const meta=CAT_META[key];
  const t=norm(card.textContent||'');
  if(!/EQUIPOS|JUGADORES|PENDIENTES|JUGADOS/.test(t))return false;
  const src=pickExistingCategoryLogo(card,key);
  const co=officialCounts(meta);
  const phase=phaseFor(meta);
  card.classList.add('jr64-category-summary-card');
  card.dataset.jr64Category=meta.name;
  card.innerHTML=`<span class="jr64-cat-icon">${categoryIcon(meta,src)}</span><span class="jr64-cat-copy"><b class="jr64-cat-title">${esc(meta.name)}</b><small class="jr64-cat-phase">${esc(phase)}</small><span class="jr64-cat-stats"><span><strong>${esc(co.Equipos??'—')}</strong> equipos</span><span><strong>${esc(co.Jugadores??'—')}</strong> jugadores</span><span><strong>${esc(co['Partidos Jugados']??'—')}</strong> jugados</span><span><strong>${esc(co['Partidos Pendientes']??'—')}</strong> pendientes</span></span></span>`;
  return true;
}
function cleanPrimeraNonSummary(card){
  const key=catKey(card);if(key!=='PRIMERA FUERZA')return;
  if(card.classList.contains('jr64-category-summary-card'))return;
  $$('img',card).forEach(img=>{if(isLeagueLogo(img))img.remove();});
  const hadLogo=$$('img',card).some(img=>/primera-fuerza-hd/i.test(img.getAttribute('src')||''));
  if(!hadLogo&&card.matches('.category-card,[class*="category-card"],[class*="categoria-card"],[class*="cat-card"]')){
    const wrap=document.createElement('span');wrap.className='jr63-pf-category-wrap';wrap.innerHTML=`<img class="jr63-pf-category-logo" src="${PF_LOGO}" alt="Primera Fuerza">`;card.insertBefore(wrap,card.firstChild);
  }
}
function patchCategories(){
  categoryCards().forEach(card=>{if(!patchCategorySummary(card))cleanPrimeraNonSummary(card);});
}
function patchAll(){
  teamCards().forEach(patchTeamCard);
  patchCategories();
  document.documentElement.dataset.jr64CategoryCards='ready';
}
function schedule(){[0,70,180,420,850,1600,3000,5200].forEach(ms=>setTimeout(patchAll,ms));}
async function init(){await loadOfficial();schedule();}

document.addEventListener('click',e=>{if(e.target.closest('[data-view],[data-category],[data-v20-cat],[data-v21-cat],[data-v25-cat],[data-v27-team-card],button,a'))setTimeout(patchAll,90);},true);
document.addEventListener('change',e=>{if(e.target.matches('select,input'))setTimeout(patchAll,90);},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('focus',()=>setTimeout(patchAll,80));
window.JRLogoFixV3832={build:BUILD,refresh:patchAll,reload:async()=>{await loadOfficial();patchAll();}};
window.JRLogoFixV3831=window.JRLogoFixV3832;
window.JRLogoFixV3830=window.JRLogoFixV3832;
window.JRPrimeraLogoV3827={build:BUILD,logo:PF_LOGO,refresh:patchAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();