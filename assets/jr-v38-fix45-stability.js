/* V38 FIX45 — estabilidad de categorías + restaurar cuadro América */
(()=>{'use strict';
if(window.__JR76Fix45)return;
window.__JR76Fix45=true;

const BUILD='38-45';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png';
const AMERICA_LOGO='./assets/branding/america-veteranos-35-user.png';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ORDER=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const FALLBACK={
  'Primera Fuerza':{phase:'Torneo de Copa J5',equipos:11,jugadores:291,jugados:20,pendientes:35,logo:PF_LOGO},
  'Intermedia':{phase:'Torneo de Copa J5',equipos:13,jugadores:332,jugados:22,pendientes:54,logo:''},
  'Segunda Fuerza':{phase:'Torneo de Copa J5',equipos:12,jugadores:312,jugados:23,pendientes:42,logo:''},
  'Veteranos 35+':{phase:'FINAL',equipos:10,jugadores:0,jugados:0,pendientes:0,logo:''},
  'Veteranos 50+':{phase:'Torneo de Copa J6',equipos:6,jugadores:109,jugados:15,pendientes:30,logo:''}
};

let DATA=null;
let timer=0;

async function loadData(){
  try{
    const r=await fetch('./data/official-live.json?fix='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});
    if(r.ok) DATA=await r.json();
  }catch(_){}
}

function catFromData(name){
  const hit=Object.values(DATA?.categories||{}).find(c=>norm(c?.name)===norm(name));
  if(!hit)return null;
  const counts=hit?.counts||hit?.dashboard?.counts||{};
  return {
    name,
    phase:hit?.current_phase||FALLBACK[name].phase,
    equipos:Number(counts.Equipos ?? FALLBACK[name].equipos ?? 0),
    jugadores:Number(counts.Jugadores ?? FALLBACK[name].jugadores ?? 0),
    jugados:Number(counts['Partidos Jugados'] ?? FALLBACK[name].jugados ?? 0),
    pendientes:Number(counts['Partidos Pendientes'] ?? FALLBACK[name].pendientes ?? 0),
    logo:FALLBACK[name].logo||''
  };
}
function cats(){return ORDER.map(name=>catFromData(name)||{name,...FALLBACK[name]})}
function viewMore(){return $('#view-more')||$('[data-view="more"]')||$('[id*="view-more"]')}
function findAnchor(root){
  const title=$$('h1,h2,h3,.section-title,.eyebrow',root).find(el=>/EXPLORA LA LIGA/i.test(el.textContent||''));
  if(title)return title.closest('section,div')||title.parentElement||root.firstElementChild||root;
  return root.firstElementChild||root;
}
function legacyRows(root){
  return $$('.jr68-category-grid,.jr69-category-strip,.jr71-category-rail,.jr74-category-rail,.jr75-category-row,[class*="category-row"]',root)
    .filter(el=>!el.closest('.jr76-category-host'));
}
function hideLegacy(root){legacyRows(root).forEach(el=>el.classList.add('jr76-hide-legacy'))}
function iconHtml(cat){
  return cat.logo
    ? `<span class="jr76-category-icon"><img src="${esc(cat.logo)}?v=${BUILD}" alt="${esc(cat.name)}"></span>`
    : `<span class="jr76-category-icon"></span>`;
}
function cardHtml(cat){
  return `<button class="jr76-category-btn" type="button" data-jr76-category="${esc(cat.name)}">
    ${iconHtml(cat)}
    <span class="jr76-category-name">${esc(cat.name)}</span>
    <span class="jr76-category-phase">${esc(cat.phase)}</span>
    <span class="jr76-left-stats">
      <span class="jr76-metric"><b>${esc(cat.equipos)}</b> <span>equipos</span></span>
      <span class="jr76-metric jr76-played"><b>${esc(cat.jugados)}</b> <span>jugados</span></span>
    </span>
    <span class="jr76-right-stats">
      <span class="jr76-metric"><b>${esc(cat.jugadores)}</b> <span>jugadores</span></span>
      <span class="jr76-metric jr76-pending"><b>${esc(cat.pendientes)}</b> <span>pendientes</span></span>
    </span>
  </button>`;
}
function clickOriginalCategory(name){
  const n=norm(name);
  const candidates=$$('[data-category],button,a,[role="button"]').filter(el=>!el.closest('.jr76-category-host'));
  const exact=candidates.find(el=>norm(el.dataset.category||'')===n);
  if(exact){exact.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));return true}
  const byText=candidates.find(el=>{
    const t=norm(el.textContent||'');
    return t.includes(n)&&!t.includes('AMERICA')&&!t.includes('POZOS');
  });
  if(byText){byText.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));return true}
  return false;
}
function markActive(name){
  $$('.jr76-category-btn').forEach(btn=>btn.classList.toggle('is-active',norm(btn.dataset.jr76Category)===norm(name)));
}
function renderRow(){
  const root=viewMore(); if(!root)return;
  hideLegacy(root);
  let host=$('.jr76-category-host',root);
  const anchor=findAnchor(root);
  if(!host){
    host=document.createElement('section');
    host.className='jr76-category-host';
    anchor.insertAdjacentElement('afterend',host);
  }
  const html=`<div class="jr76-category-row">${cats().map(cardHtml).join('')}</div>`;
  if(host.innerHTML!==html)host.innerHTML=html;
  $$('.jr76-category-btn',host).forEach(btn=>{
    if(btn.dataset.jr76Wired==='1')return;
    btn.dataset.jr76Wired='1';
    btn.addEventListener('click',()=>{
      const name=btn.dataset.jr76Category||'';
      markActive(name);
      clickOriginalCategory(name);
    });
  });
  if(!$('.jr76-category-btn.is-active',host))markActive('Primera Fuerza');
}

function isAmerica(card){
  const txt=norm([card?.dataset?.team,card?.dataset?.jr64Team,card?.dataset?.jr63Team,card?.textContent].filter(Boolean).join(' '));
  return txt.includes('AMERICA');
}
function patchAmericaCard(card){
  if(!card)return;
  card.classList.add('jr76-america-card');
  card.dataset.jr76America='1';

  let hero=$('.jr76-america-hero',card);
  if(!hero){
    hero=document.createElement('div');
    hero.className='jr76-america-hero';
    card.insertBefore(hero,card.firstChild);
  }
  hero.innerHTML=`<img src="${AMERICA_LOGO}?v=${BUILD}" alt="Club América Veteranos 35+">`;

  let info=$('.jr76-america-info',card);
  if(!info){
    info=document.createElement('div');
    info.className='jr76-america-info';
    hero.insertAdjacentElement('afterend',info);
  }
  info.innerHTML=`
    <div class="jr76-america-name">América</div>
    <div class="jr76-america-sub">Veteranos 35+</div>
    <div class="jr76-america-meta">
      <div><b>Equipo:</b> América</div>
      <div><b>Categoría:</b> Veteranos 35+</div>
      <div><b>Estado:</b> Equipo registrado</div>
      <div><b>Escudo:</b> Juventino Rosas 1916–2026</div>
    </div>`;

  const legacySelectors='.jr69-hide-old-america,.jr63-team-hero-logo,.jr63-mini-logo,.jr62-team-hero-logo,.jr62-secondary-team-logo-wrap,.jr65-america-hero,.jr65-america-mini,.jr69-america-hero,.jr69-america-mini';
  $$(legacySelectors,card).forEach(el=>{
    if(!el.closest('.jr76-america-hero')&&!el.closest('.jr76-america-info'))el.style.setProperty('display','none','important');
  });

  $$('img',card).forEach(img=>{
    if(img.closest('.jr76-america-hero'))return;
    const sig=norm([img.alt,img.title,img.src].filter(Boolean).join(' '));
    if(sig.includes('AMERICA')){
      img.src=AMERICA_LOGO+'?v='+BUILD;
      img.removeAttribute('srcset');
    }
  });
}
function patchAmerica(){
  const candidates=new Set();
  ['#teamsGrid > *','.team-card','.club-card','[data-team-card]','[data-v27-team-card]','.jr60-team-card','.jr63-fixed-team-card']
    .forEach(s=>$$(s).forEach(el=>candidates.add(el)));
  [...candidates].filter(isAmerica).forEach(patchAmericaCard);
}
function run(){renderRow();patchAmerica()}
function queue(){clearTimeout(timer);timer=setTimeout(run,80)}

async function init(){
  await loadData();
  run();
  const mo=new MutationObserver(queue);
  mo.observe(document.body,{childList:true,subtree:true});
  [0,180,500,1200,2500,4200].forEach(ms=>setTimeout(run,ms));
  document.addEventListener('click',queue,true);
  document.addEventListener('change',queue,true);
  addEventListener('hashchange',queue);
  addEventListener('pageshow',queue);
  addEventListener('focus',queue);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
