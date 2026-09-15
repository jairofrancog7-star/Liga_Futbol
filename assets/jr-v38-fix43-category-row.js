/* V38 FIX43 — reemplaza el bloque de categorías roto por una fila canónica y funcional. */
(()=>{'use strict';
if(window.__JR75Fix43)return;window.__JR75Fix43=true;
const BUILD='38-43';
const NAMES=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const FALLBACK={
 'Primera Fuerza':{phase:'Torneo de Copa J5',teams:11,players:291,played:20,pending:35,logo:'./assets/branding/primera-fuerza-hd.png'},
 'Intermedia':{phase:'Torneo de Copa J5',teams:13,players:332,played:22,pending:54,logo:''},
 'Segunda Fuerza':{phase:'Torneo de Copa J5',teams:12,players:312,played:23,pending:42,logo:''},
 'Veteranos 35+':{phase:'FINAL',teams:10,players:0,played:0,pending:0,logo:''},
 'Veteranos 50+':{phase:'Torneo de Copa J6',teams:6,players:109,played:15,pending:30,logo:''}
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const SEL='[data-jr66-category],[data-jr64-category],.jr66-category-summary,.jr64-category-summary-card,.jr69-category-compact,.jr71-category-card';
let DATA=null,observer=null;
function key(el){const t=norm([el?.dataset?.jr66Category,el?.dataset?.jr64Category,el?.dataset?.category,el?.textContent].filter(Boolean).join(' '));return NAMES.find(n=>t.includes(norm(n)))||''}
function sourceCards(root=document){return $$(SEL,root).filter(x=>!x.closest('#jr75CategoryRow')&&key(x))}
function sourceFor(name){const view=$('#view-more'),inside=view?sourceCards(view).find(x=>key(x)===name):null;return inside||sourceCards().find(x=>key(x)===name)||null}
function oldRailFor(card,host){if(!card)return null;let p=card.parentElement;for(let i=0;p&&p!==host&&p!==document.body&&i<7;i++,p=p.parentElement){const cards=sourceCards(p),ks=new Set(cards.map(key).filter(Boolean));if(ks.size>=3)return p;if(p.matches?.('.jr68-category-grid,.jr69-category-strip,.jr71-category-rail,.jr74-category-rail'))return p}return null}
function hideLegacy(host){const cards=sourceCards(host);cards.forEach(c=>c.classList.add('jr75-legacy-category-hidden'));const rails=new Set();cards.forEach(c=>{const r=oldRailFor(c,host);if(r&&r!==host)rails.add(r)});rails.forEach(r=>r.classList.add('jr75-legacy-category-hidden'));}
function countsFromData(name){const found=Object.values(DATA?.categories||{}).find(c=>norm(c?.name)===norm(name)),f=FALLBACK[name];const co=found?.counts||found?.dashboard?.counts||{};return{phase:found?.current_phase||f.phase,teams:co.Equipos??f.teams,players:co.Jugadores??f.players,played:co['Partidos Jugados']??f.played,pending:co['Partidos Pendientes']??f.pending,logo:f.logo}}
function icon(meta,name){return meta.logo?`<span class="jr75-cat-icon"><img src="${esc(meta.logo)}?b=${BUILD}" alt="${esc(name)}" loading="eager" decoding="async"></span>`:''}
function cardMarkup(name){const m=countsFromData(name),no=m.logo?'':' jr75-no-icon';return `<button type="button" class="jr75-category-card${no}" data-jr75-category="${esc(name)}">${icon(m,name)}<span class="jr75-cat-copy"><b class="jr75-cat-title">${esc(name)}</b><small class="jr75-cat-phase">${esc(m.phase)}</small><span class="jr75-cat-stats"><span><strong>${esc(m.teams)}</strong> equipos</span><span><strong>${esc(m.players)}</strong> jugadores</span><span><strong>${esc(m.played)}</strong> jugados</span><span><strong>${esc(m.pending)}</strong> pendientes</span></span></span></button>`}
function activate(name){const chip=$$('[data-category]').find(x=>norm(x.dataset.category)===norm(name));if(chip){chip.click();return}const src=sourceFor(name);if(src&&src!==document.activeElement){try{src.click()}catch(_){}}try{localStorage.setItem('jrCategory',name)}catch(_){}}
function ensureRow(){const host=$('#view-more');if(!host)return false;let row=$('#jr75CategoryRow',host);if(!row){row=document.createElement('div');row.id='jr75CategoryRow';row.className='jr75-category-row';const title=$('.section-title',host),grid=$('.more-grid',host);if(title)title.insertAdjacentElement('afterend',row);else if(grid)grid.insertAdjacentElement('beforebegin',row);else host.prepend(row)}row.innerHTML=NAMES.map(cardMarkup).join('');$$('[data-jr75-category]',row).forEach(b=>{b.onclick=e=>{e.preventDefault();activate(b.dataset.jr75Category)}});hideLegacy(host);document.documentElement.dataset.jr75Fix43='ready';return true}
async function load(){try{const r=await fetch('./data/official-live.json?b='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});if(r.ok)DATA=await r.json()}catch(_){}ensureRow()}
function schedule(){[0,40,120,300,700,1400,2600,4800,8000,12000].forEach(ms=>setTimeout(ensureRow,ms))}
function observe(){if(observer)return;observer=new MutationObserver(()=>{clearTimeout(observe.t);observe.t=setTimeout(ensureRow,40)});observer.observe(document.documentElement,{childList:true,subtree:true})}
document.addEventListener('click',e=>{if(e.target.closest('[data-view="more"],.bottom-nav [data-view],button,a'))[20,100,300,700].forEach(ms=>setTimeout(ensureRow,ms))},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('focus',()=>setTimeout(ensureRow,60));
window.JRFix43={build:BUILD,refresh:ensureRow,reload:load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{load();schedule();observe()},{once:true});else{load();schedule();observe()}
})();
