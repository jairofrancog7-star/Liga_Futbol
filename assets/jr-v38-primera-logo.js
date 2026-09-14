/* V38 FIX24 — Logo oficial Primera Fuerza HD.
   Sustituye solamente el emblema visual de la categoría Primera Fuerza.
   No reemplaza logos de equipos. Reescaneo ligero por navegación. */
(function(){
'use strict';
if(window.__JR56PrimeraLogo)return;
window.__JR56PrimeraLogo=true;

const BUILD='38-24';
const LOGO='./assets/branding/primera-fuerza-hd.png?v=38-24';
const NAME='Primera Fuerza';

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

function isPrimeraText(el){
  const t=norm(el?.textContent||'');
  return t.includes('primera fuerza');
}

function looksLikeCategoryCard(el){
  if(!el||!isPrimeraText(el))return false;

  // Strong signals: explicit category controls/card names.
  const d=[
    el.dataset?.category,
    el.dataset?.v20Cat,
    el.dataset?.v21Cat,
    el.dataset?.v22Cat,
    el.dataset?.v23Cat,
    el.dataset?.v24Cat,
    el.dataset?.v25Cat,
    el.dataset?.v26Cat,
    el.dataset?.v27Cat,
    el.dataset?.v30Cat,
    el.dataset?.v31Cat
  ].filter(Boolean).map(norm);
  if(d.includes('primera fuerza'))return true;

  const cls=norm(el.className||'');
  if(/category|categoria|cat-card|league-card|competition-card/.test(cls))return true;

  const t=norm(el.textContent||'');
  if(t.includes('equipos') && (t.includes('torneo')||t.includes('copa')||t.includes('j5')))return true;

  return false;
}

function markImage(img){
  if(!img)return false;
  if(img.dataset.jr56PrimeraLogo==='1')return true;
  img.src=LOGO;
  img.removeAttribute('srcset');
  img.alt='Logo Primera Fuerza · Juventino Rosas GTO';
  img.loading='eager';
  img.decoding='async';
  img.dataset.jr56PrimeraLogo='1';
  img.classList.add('jr56-primera-logo-img');
  return true;
}

function replaceBackground(el){
  if(!el)return false;
  const cs=getComputedStyle(el);
  const bg=cs.backgroundImage||'';
  if(!bg||bg==='none')return false;
  const r=el.getBoundingClientRect();
  if(r.width>110||r.height>110||r.width<18||r.height<18)return false;
  el.style.backgroundImage=`url("${LOGO}")`;
  el.style.backgroundSize='contain';
  el.style.backgroundRepeat='no-repeat';
  el.style.backgroundPosition='center';
  el.dataset.jr56PrimeraBg='1';
  el.classList.add('jr56-primera-logo-bg');
  return true;
}

function injectBadge(card){
  if(!card||q('.jr56-primera-logo-wrap',card))return false;
  const r=card.getBoundingClientRect();
  if(r.height && r.height<52)return false; // evita meter logo dentro de chips compactos.

  const wrap=document.createElement('span');
  wrap.className='jr56-primera-logo-wrap';
  wrap.setAttribute('aria-hidden','true');
  const img=document.createElement('img');
  img.src=LOGO;
  img.alt='';
  img.loading='eager';
  img.decoding='async';
  img.dataset.jr56PrimeraLogo='1';
  img.className='jr56-primera-logo-img';
  wrap.appendChild(img);

  card.insertBefore(wrap,card.firstChild);
  card.classList.add('jr56-primera-category-card');
  return true;
}

function patchCard(card){
  if(!looksLikeCategoryCard(card))return false;
  const parentPatched=card.parentElement?.closest?.('.jr56-primera-category-card');
  if(parentPatched)return false;
  if(q('.jr56-primera-logo-img',card))return false;

  // Nunca sustituir logos de clubes dentro de team cards/listados.
  const cls=norm(card.className||'');
  if(/team-card|club-card|v32-team-inline/.test(cls))return false;

  card.classList.add('jr56-primera-category-card');

  const imgs=qa('img',card).filter(img=>{
    const near=img.closest('.v32-team-inline,.team-card,.club-card');
    return !near;
  });
  if(imgs.length){
    markImage(imgs[0]);
    return true;
  }

  const visual=qa('span,div,i',card).find(el=>{
    const cls=norm(el.className||'');
    if(/logo|badge|avatar|crest|escudo|icon/.test(cls))return true;
    return false;
  });
  if(visual && replaceBackground(visual))return true;

  return injectBadge(card);
}

function candidates(){
  const set=new Set();

  [
    '[data-category="Primera Fuerza"]',
    '[data-v20-cat="Primera Fuerza"]',
    '[data-v21-cat="Primera Fuerza"]',
    '[data-v22-cat="Primera Fuerza"]',
    '[data-v23-cat="Primera Fuerza"]',
    '[data-v24-cat="Primera Fuerza"]',
    '[data-v25-cat="Primera Fuerza"]',
    '[data-v26-cat="Primera Fuerza"]',
    '[data-v27-cat="Primera Fuerza"]',
    '[data-v30-cat="Primera Fuerza"]',
    '[data-v31-cat="Primera Fuerza"]',
    '.category-card',
    '[class*="category-card"]',
    '[class*="categoria-card"]',
    '[class*="cat-card"]',
    '#view-teams article',
    '#view-teams .card',
    '#view-home article',
    '#view-home .card'
  ].forEach(sel=>qa(sel).forEach(el=>set.add(el)));

  // Screenshot pattern: card whose copy says "Primera Fuerza" + "equipos" + "Torneo de Copa J5".
  qa('button,a,article,section,div').forEach(el=>{
    if(!isPrimeraText(el))return;
    const t=norm(el.textContent||'');
    if(t.includes('equipos')&&(t.includes('torneo')||t.includes('copa')))set.add(el);
  });

  return [...set];
}

function patch(){
  let changed=0;
  candidates().forEach(el=>{if(patchCard(el))changed++});

  // If a category card already has our image, keep a cache-busted URL after dynamic re-render.
  qa('img[data-jr56-primera-logo="1"]').forEach(img=>{
    if(!String(img.src).includes('primera-fuerza-hd.png'))markImage(img);
  });

  document.documentElement.dataset.jr56PrimeraLogo=String(changed>0?'ready':'waiting');
  return changed;
}

let timers=[];
function schedule(){
  timers.forEach(clearTimeout);
  timers=[
    setTimeout(patch,0),
    setTimeout(patch,80),
    setTimeout(patch,240),
    setTimeout(patch,700),
    setTimeout(patch,1500)
  ];
}

function hookShowView(){
  if(typeof window.showView==='function'&&!window.showView.__jr56PrimeraLogo){
    const old=window.showView;
    const wrapped=function(){
      const out=old.apply(this,arguments);
      schedule();
      return out;
    };
    wrapped.__jr56PrimeraLogo=true;
    wrapped.__jr56Old=old;
    window.showView=wrapped;
  }
}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-category],[data-v20-cat],[data-v21-cat],[data-view],button,a');
  if(!el)return;
  if(isPrimeraText(el)||el.dataset?.view==='teams')schedule();
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('pageshow',schedule);

window.JRPrimeraLogoV3824={
  build:BUILD,
  logo:LOGO,
  refresh:patch
};

function init(){
  hookShowView();
  schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();