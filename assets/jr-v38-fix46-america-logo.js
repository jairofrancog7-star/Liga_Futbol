/* V38 FIX46 — restaurar logo e información de América */
(()=>{'use strict';
if(window.__JR77Fix46)return; window.__JR77Fix46=true;

const BUILD='38-46';
const AMERICA_LOGO='./assets/branding/america-veteranos-35-user.png';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();

function setLogo(img){
  if(!img) return;
  img.src=AMERICA_LOGO+'?v='+BUILD;
  img.removeAttribute('srcset');
  img.alt='Club América Veteranos 35+';
  img.title='Club América Veteranos 35+';
  img.classList.add('jr77-force-visible');
  img.style.setProperty('display','block','important');
  img.style.setProperty('visibility','visible','important');
  img.style.setProperty('opacity','1','important');
  img.style.setProperty('width','100%','important');
  img.style.setProperty('height','100%','important');
  img.style.setProperty('object-fit','contain','important');
}

function looksLikeAmerica(el){
  const text = norm([
    el?.dataset?.team, el?.dataset?.club, el?.dataset?.jr63Team, el?.dataset?.jr64Team,
    el?.getAttribute?.('data-name'), el?.getAttribute?.('aria-label'),
    el?.textContent
  ].filter(Boolean).join(' '));
  return text.includes('AMERICA');
}

function ensureBigCard(card){
  if(card.dataset.jr77Patched==='1') return;
  card.dataset.jr77Patched='1';
  card.classList.add('jr77-america-fixed-card');

  let wrap = $('.jr77-america-logo-wrap',card);
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className='jr77-america-logo-wrap';
    card.insertBefore(wrap, card.firstChild);
  }
  let img = $('img',wrap);
  if(!img){
    img = document.createElement('img');
    wrap.appendChild(img);
  }
  setLogo(img);

  let info = $('.jr77-america-info',card);
  if(!info){
    info = document.createElement('div');
    info.className='jr77-america-info';
    wrap.insertAdjacentElement('afterend', info);
  }
  info.innerHTML = `
    <div class="jr77-america-name">América</div>
    <div class="jr77-america-sub">Veteranos 35+ · Juventino Rosas</div>
    <div class="jr77-america-meta">
      <div><b>Equipo:</b> América</div>
      <div><b>Categoría:</b> Veteranos 35+</div>
      <div><b>Escudo:</b> versión oficial</div>
      <div><b>Estado:</b> visible y restaurado</div>
    </div>
  `;

  const badSelectors = [
    '.jr63-team-hero-logo','.jr62-team-hero-logo','.jr62-secondary-team-logo-wrap',
    '.jr63-mini-logo','.jr65-america-hero','.jr65-america-mini','.jr69-hide-old-america',
    '.jr69-america-hero','.jr69-america-mini'
  ].join(',');
  $$(badSelectors,card).forEach(el=>{
    if(!el.closest('.jr77-america-logo-wrap') && !el.closest('.jr77-america-info')){
      el.classList.add('jr77-hide-bad-america');
    }
  });

  $$('*',card).forEach(el=>{
    const t=norm(el.textContent||'');
    if(t.includes('AMERICA') || t.includes('VETERANOS')){
      el.classList.add('jr77-force-visible');
      el.hidden=false;
    }
  });
}

function ensureMiniLogo(container){
  let slot = $('.jr77-mini-america',container);
  if(!slot){
    slot = document.createElement('span');
    slot.className='jr77-mini-america';
    const ref = $('img',container) || container.firstElementChild;
    if(ref) container.insertBefore(slot, ref);
    else container.insertBefore(slot, container.firstChild);
  }
  let img = $('img',slot);
  if(!img){
    img = document.createElement('img');
    slot.appendChild(img);
  }
  setLogo(img);
}

function patchAmericaEverywhere(){
  const cardSelectors = [
    '#teamsGrid > *','.team-card','.club-card','[data-team-card]','[data-v27-team-card]',
    '.jr60-team-card','.jr63-fixed-team-card','.panel','.glass-card','.card'
  ];
  const candidates = new Set();
  cardSelectors.forEach(sel=> $$(sel).forEach(el=> candidates.add(el)));

  [...candidates].filter(looksLikeAmerica).forEach(card=>{
    const isBig = (card.offsetWidth||0) > 240 || norm(card.textContent||'').includes('VER PERFIL');
    if(isBig) ensureBigCard(card);
    else ensureMiniLogo(card);

    $$('img',card).forEach(img=>{
      const sig = norm([img.alt,img.title,img.src].filter(Boolean).join(' '));
      if(sig.includes('AMERICA') || isBig){
        setLogo(img);
      }
    });
  });

  const listCandidates = [
    '.team-list-item','.squad-list-item','.jr31-teamcell','.jr31-avatar','li','a','button'
  ];
  const seen = new Set();
  listCandidates.forEach(sel=>{
    $$(sel).forEach(el=>{
      if(seen.has(el)) return;
      if(looksLikeAmerica(el)){
        seen.add(el);
        ensureMiniLogo(el);
      }
    });
  });
}

function run(){ patchAmericaEverywhere(); }
function queue(){ clearTimeout(window.__jr77t); window.__jr77t=setTimeout(run,80); }

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    run();
    const mo=new MutationObserver(queue);
    mo.observe(document.body,{childList:true,subtree:true,attributes:true});
    [150,500,1200,2500,4500].forEach(ms=>setTimeout(run,ms));
    document.addEventListener('click',queue,true);
    addEventListener('hashchange',queue);
    addEventListener('focus',queue);
  },{once:true});
}else{
  run();
  const mo=new MutationObserver(queue);
  mo.observe(document.body,{childList:true,subtree:true,attributes:true});
  [150,500,1200,2500,4500].forEach(ms=>setTimeout(run,ms));
  document.addEventListener('click',queue,true);
  addEventListener('hashchange',queue);
  addEventListener('focus',queue);
}
})();
