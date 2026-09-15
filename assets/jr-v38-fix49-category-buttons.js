/* V38 FIX49 — monta las categorías EXACTAMENTE debajo de "Explora la liga"
   y restaura los botones originales de la vista Más. */
(()=>{'use strict';
if(window.__JR80Fix49)return;
window.__JR80Fix49=true;

const BUILD='38-49-r1';
const PF='./assets/branding/primera-fuerza-hd.png?v='+BUILD;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();

const CATS=[
  {name:'Primera Fuerza',phase:'Torneo de Copa J5',teams:11,players:291,played:20,pending:35,logo:PF},
  {name:'Intermedia',phase:'Torneo de Copa J5',teams:13,players:332,played:22,pending:54},
  {name:'Segunda Fuerza',phase:'Torneo de Copa J5',teams:12,players:312,played:23,pending:42},
  {name:'Veteranos 35+',phase:'FINAL',teams:10,players:0,played:0,pending:0},
  {name:'Veteranos 50+',phase:'Torneo de Copa J6',teams:6,players:109,played:15,pending:30}
];

const MORE_FALLBACK=[
  ['teams','🛡️','Equipos','Ver equipos'],
  ['players','👤','Jugadores','Ver jugadores'],
  ['bracket','🏆','Liguilla','Ver liguilla'],
  ['news','📣','Avisos','Ver avisos'],
  ['media','🎥','Videos','Ver videos'],
  ['history','🗂️','Historial','Ver historial'],
  ['admin','⚙️','JR Control','Abrir panel administrativo'],
  ['fanzone','🔥','Fan Zone','Abrir Fan Zone'],
  ['shotmap','🎯','Shot Map','Ver mapa de tiros'],
  ['credential','🪪','Credencial','Ver credencial digital'],
  ['matchdaypro','⏱️','JR Matchday+','Abrir JR Matchday+']
];

let timer=0,observer=null;

function esc(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function moreRoot(){return document.getElementById('view-more')}
function currentCategory(){
  try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch(_){return 'Primera Fuerza'}
}
function setCategory(name){
  try{localStorage.setItem('jrCategory',name)}catch(_){}
  try{window.LJR_V20_API?.setCategory?.(name)}catch(_){}
  try{window.LJR_V27?.setCategory?.(name)}catch(_){}
  try{if(typeof window.currentCategory!=='undefined')window.currentCategory=name}catch(_){}
  $$('#jr80CategoryHost [data-jr80-category]').forEach(b=>b.classList.toggle('is-active',b.dataset.jr80Category===name));

  // Sin depender de un único fix viejo: notifica también a controles originales si existen.
  const original=$$('[data-category]').find(el=>!el.closest('#jr80CategoryHost') && norm(el.dataset.category||'')===norm(name));
  if(original){
    try{original.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))}catch(_){}
  }
  document.dispatchEvent(new CustomEvent('jr:category-change',{detail:{category:name,source:'fix49'}}));
}

function button(cat){
  const icon=cat.logo
    ? `<span class="jr80-cat-icon"><img src="${cat.logo}" alt="${esc(cat.name)}"></span>`
    : `<span class="jr80-cat-icon" aria-hidden="true"></span>`;
  return `<button type="button" class="jr80-category-btn" data-jr80-category="${esc(cat.name)}" data-category="${esc(cat.name)}">
    ${icon}
    <span class="jr80-cat-title">${esc(cat.name)}</span>
    <span class="jr80-cat-phase">${esc(cat.phase)}</span>
    <span class="jr80-cat-stats">
      <span>${cat.teams} equipos</span><span>${cat.players} jugadores</span>
      <span>${cat.played} jugados</span><span>${cat.pending} pendientes</span>
    </span>
  </button>`;
}

function ensureMoreGrid(root){
  let grid=root.querySelector(':scope > .more-grid');
  if(!grid){
    grid=document.createElement('div');
    grid.className='more-grid';
    root.appendChild(grid);
  }
  grid.hidden=false;
  grid.removeAttribute('aria-hidden');
  grid.classList.remove('hidden','jr76-hide-legacy');
  grid.style.removeProperty('display');
  grid.style.removeProperty('visibility');
  grid.style.removeProperty('opacity');

  if(!grid.querySelector('.more-link,[data-view]')){
    grid.innerHTML=MORE_FALLBACK.map(([view,icon,label,aria])=>
      `<button class="more-link" type="button" data-view="${view}" aria-label="${esc(aria)}"><span>${icon}</span><b>${esc(label)}</b></button>`
    ).join('');
  }

  $$(':scope > .more-link,:scope > button,:scope > a',grid).forEach(el=>{
    el.hidden=false;
    el.removeAttribute('aria-hidden');
    el.classList.remove('hidden');
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.style.removeProperty('opacity');
  });
  return grid;
}

function wireMoreGrid(grid){
  if(grid.dataset.jr80Wired==='1')return;
  grid.dataset.jr80Wired='1';
  grid.addEventListener('click',e=>{
    const b=e.target.closest('[data-view]');
    if(!b)return;
    const view=b.dataset.view;
    if(!view)return;
    try{
      if(typeof window.showView==='function'){
        e.preventDefault();
        window.showView(view);
        history.replaceState(null,'','#'+view);
      }
    }catch(_){}
  });
}

function mount(){
  const root=moreRoot();
  if(!root)return false;

  // La causa del fallo anterior: el host se insertaba dentro del DIV interno
  // de .section-title. FIX49 lo coloca como hijo DIRECTO de #view-more.
  const title=root.querySelector(':scope > .section-title')||root.querySelector('.section-title');
  const grid=ensureMoreGrid(root);
  wireMoreGrid(grid);

  let host=document.getElementById('jr80CategoryHost');
  if(!host){
    host=document.createElement('section');
    host.id='jr80CategoryHost';
    host.setAttribute('aria-label','Categorías de la liga');
  }

  // Debe quedar exactamente entre el título "Explora la liga" y .more-grid.
  if(host.parentElement!==root || host.nextElementSibling!==grid){
    root.insertBefore(host,grid);
  }

  const desired=`<div class="jr80-category-row">${CATS.map(button).join('')}</div>`;
  if(host.innerHTML!==desired)host.innerHTML=desired;

  const active=currentCategory();
  $$('[data-jr80-category]',host).forEach(b=>{
    b.classList.toggle('is-active',b.dataset.jr80Category===active);
    if(b.dataset.jr80Wired==='1')return;
    b.dataset.jr80Wired='1';
    b.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      setCategory(b.dataset.jr80Category);
    });
  });

  // Hosts viejos fuera de su sitio no deben tapar los botones nuevos.
  $$('#view-more .jr76-category-host,#view-more .jr75-category-host').forEach(old=>{
    if(old!==host){
      old.hidden=true;
      old.setAttribute('aria-hidden','true');
    }
  });

  document.documentElement.dataset.jr80Fix49='ready';
  return true;
}

function queue(ms=60){
  clearTimeout(timer);
  timer=setTimeout(mount,ms);
}
function start(){
  mount();
  [100,300,700,1300,2500,4500,8000].forEach(ms=>setTimeout(mount,ms));
  const root=moreRoot();
  if(root && !observer){
    observer=new MutationObserver(()=>queue(70));
    observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
  }
  document.addEventListener('click',()=>queue(90),true);
  addEventListener('hashchange',()=>queue(30));
  addEventListener('pageshow',()=>queue(30));
  addEventListener('focus',()=>queue(50));
  addEventListener('resize',()=>queue(100),{passive:true});
}
window.JRFix49={build:BUILD,refresh:mount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
