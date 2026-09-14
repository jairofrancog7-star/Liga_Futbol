/* V38 FIX30 — corrección visual de escudos de equipo + Primera Fuerza.
   Mantiene un escudo principal grande y un segundo escudo pequeño.
   Usa primero el snapshot público data/official-live.json. */
(()=>{'use strict';
if(window.__JR62Fix30)return;window.__JR62Fix30=true;window.__JR59PrimeraStrict=true;

const BUILD='38-30';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png?build=38-30';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();

let data=null;
let logoIndex=new Map();
let teamNames=[];

function logoValue(v){
  if(typeof v==='string')return v;
  return v?.local||v?.source||'';
}
function rebuildIndex(){
  logoIndex=new Map();
  const map=data?.team_logos||{};
  Object.entries(map).forEach(([team,v])=>{
    const src=logoValue(v);
    if(src)logoIndex.set(norm(team),{team,src});
  });
  teamNames=[...logoIndex.values()].sort((a,b)=>b.team.length-a.team.length);
}
async function loadOfficial(){
  try{
    const r=await fetch(`./data/official-live.json?build=${BUILD}&t=${Date.now()}`,{cache:'no-store',credentials:'omit'});
    if(r.ok){data=await r.json();rebuildIndex();}
  }catch(_){}
}
function teamFrom(card){
  const explicit=[
    card?.dataset?.jr60team,card?.dataset?.team,card?.dataset?.club,
    card?.getAttribute?.('data-v27-team'),card?.getAttribute?.('data-team-name')
  ].find(Boolean);
  if(explicit){
    const hit=logoIndex.get(norm(explicit));
    if(hit)return hit;
  }
  const text=norm(card?.textContent||'');
  return teamNames.find(x=>text.includes(norm(x.team)))||null;
}
function isCategoryLike(card){
  const t=norm(card?.textContent||'');
  return /PRIMERA FUERZA|INTERMEDIA|SEGUNDA FUERZA|VETERANOS 35|VETERANOS 50/.test(t) &&
         /EQUIPOS|JUGADORES|PENDIENTES|JUGADOS/.test(t) &&
         !teamFrom(card);
}
function teamCards(){
  const sels=[
    '.team-card','[data-v27-team-card]','[data-team-card]','.club-card',
    '#view-teams .card','.jr60-team-card'
  ];
  const set=new Set();
  sels.forEach(s=>$$(s).forEach(x=>set.add(x)));
  return [...set].filter(x=>!isCategoryLike(x));
}
function singleImageParent(img){
  const p=img?.parentElement;
  if(!p)return null;
  const visual=[...p.children].filter(x=>x.matches?.('img,picture,svg'));
  return visual.length===1 && p.children.length===1 ? p : null;
}
function makeHero(card,hit){
  let stage=$(':scope > .jr62-team-hero-logo',card);
  if(!stage){
    stage=document.createElement('div');
    stage.className='jr62-team-hero-logo';
    const img=document.createElement('img');
    stage.appendChild(img);
    card.insertBefore(stage,card.firstChild);
  }
  const img=$('img',stage);
  img.src=hit.src;
  img.alt=`Escudo ${hit.team}`;
  img.removeAttribute('srcset');
  img.loading='lazy';
  img.decoding='async';
  return stage;
}
function patchTeamCard(card){
  const hit=teamFrom(card);
  if(!hit)return false;
  card.classList.add('jr62-fixed-team-card');
  card.dataset.jr62Team=hit.team;

  const stage=makeHero(card,hit);
  const otherImgs=$$('img',card).filter(img=>!stage.contains(img));

  if(otherImgs.length){
    otherImgs.forEach((img,i)=>{
      img.removeAttribute('srcset');
      img.src=hit.src;
      img.alt=`Escudo ${hit.team}`;
      img.classList.toggle('jr62-secondary-team-logo',i===0);
      img.classList.toggle('jr62-extra-team-logo',i>0);
      const p=singleImageParent(img);
      if(p){
        p.classList.toggle('jr62-secondary-team-logo-wrap',i===0);
        p.classList.toggle('jr62-extra-team-logo-wrap',i>0);
      }
    });
  }else{
    let small=$(':scope > .jr62-secondary-team-logo-wrap',card);
    if(!small){
      small=document.createElement('span');
      small.className='jr62-secondary-team-logo-wrap jr62-generated-secondary';
      const im=document.createElement('img');
      im.className='jr62-secondary-team-logo';
      small.appendChild(im);
      stage.insertAdjacentElement('afterend',small);
    }
    const im=$('img',small);
    im.src=hit.src;im.alt=`Escudo ${hit.team}`;im.loading='lazy';im.decoding='async';
  }
  return true;
}

function categoryCards(){
  const sels=[
    '[data-category]','[data-v20-cat]','[data-v21-cat]','[data-v22-cat]',
    '[data-v23-cat]','[data-v24-cat]','[data-v25-cat]','[data-v26-cat]',
    '[data-v27-cat]','[data-v30-cat]','[data-v31-cat]',
    '.category-card','[class*="category-card"]','[class*="categoria-card"]','[class*="cat-card"]'
  ];
  const set=new Set();
  sels.forEach(s=>$$(s).forEach(x=>set.add(x)));
  return [...set];
}
function patchPrimera(){
  categoryCards().forEach(card=>{
    if(card.closest('.team-card,.club-card,[data-v27-team-card],[data-team-card],.jr60-team-card'))return;
    const t=norm(card.textContent||card.dataset?.category||'');
    if(!t.includes('PRIMERA FUERZA'))return;

    let img=$$('img',card).find(i=>!i.closest('.team-card,.club-card,.jr60-team-card'));
    if(!img){
      let wrap=$('.jr62-pf-category-wrap',card);
      if(!wrap){
        wrap=document.createElement('span');
        wrap.className='jr62-pf-category-wrap';
        img=document.createElement('img');
        wrap.appendChild(img);
        card.insertBefore(wrap,card.firstChild);
      }else img=$('img',wrap);
    }
    img.src=PF_LOGO;
    img.alt='Primera Fuerza · Juventino Rosas';
    img.removeAttribute('srcset');
    img.classList.add('jr62-pf-category-logo');
    const p=singleImageParent(img);
    if(p)p.classList.add('jr62-pf-category-wrap');
    card.dataset.jr62Primera='1';
  });
}

function patchLeagueLogoInsidePrimera(){
  $$('[data-category],[class*="category"],[class*="categoria"],[class*="cat-card"]').forEach(block=>{
    const t=norm(block.textContent||'');
    if(!t.includes('PRIMERA FUERZA'))return;
    $$('img',block).forEach(img=>{
      if(img.closest('.team-card,.club-card,.jr60-team-card'))return;
      const sig=norm([img.alt,img.title,img.getAttribute('src')].filter(Boolean).join(' '));
      if(sig.includes('LIGA JUVENTINO')||sig.includes('LIGA FUTBOL')||sig.includes('PRIMERA FUERZA')){
        img.src=PF_LOGO;
        img.alt='Primera Fuerza · Juventino Rosas';
        img.removeAttribute('srcset');
        img.classList.add('jr62-pf-category-logo');
      }
    });
  });
}

function patchAll(){
  teamCards().forEach(patchTeamCard);
  patchPrimera();
  patchLeagueLogoInsidePrimera();
  document.documentElement.dataset.jr62Logos='ready';
}
function schedule(){
  [0,120,420,1000,2200,4500].forEach(ms=>setTimeout(patchAll,ms));
}
async function init(){
  await loadOfficial();
  schedule();
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-view],[data-category],[data-v27-team-card],button,a'))setTimeout(patchAll,120);
},true);
document.addEventListener('change',e=>{
  if(e.target.matches('select,input'))setTimeout(patchAll,120);
},true);
addEventListener('hashchange',schedule);
addEventListener('pageshow',schedule);
addEventListener('focus',()=>setTimeout(patchAll,80));
window.JRLogoFixV3830={build:BUILD,refresh:patchAll,reload:async()=>{await loadOfficial();patchAll();}};
window.JRPrimeraLogoV3827={build:BUILD,logo:PF_LOGO,refresh:patchAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();