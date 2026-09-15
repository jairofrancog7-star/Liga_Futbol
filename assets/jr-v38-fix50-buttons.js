/* V38 FIX50 — botones de categorías en la vista real de Equipos y en Más */
(()=>{'use strict';
if(window.__JR81Fix50)return;window.__JR81Fix50=true;
const BUILD='38-50-r1';
const PF='./assets/branding/primera-fuerza-hd.png?v='+BUILD;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const CATS=[
{name:'Primera Fuerza',phase:'Torneo de Copa J5',teams:11,players:291,played:20,pending:35,logo:PF},
{name:'Intermedia',phase:'Torneo de Copa J5',teams:13,players:332,played:22,pending:54},
{name:'Segunda Fuerza',phase:'Torneo de Copa J5',teams:12,players:312,played:23,pending:42},
{name:'Veteranos 35+',phase:'FINAL',teams:10,players:0,played:0,pending:0},
{name:'Veteranos 50+',phase:'Torneo de Copa J6',teams:6,players:109,played:15,pending:30}
];
const MORE=[['teams','🛡️','Equipos'],['players','👤','Jugadores'],['bracket','🏆','Liguilla'],['news','📣','Avisos'],['media','🎥','Videos'],['history','🗂️','Historial'],['admin','⚙️','JR Control'],['fanzone','🔥','Fan Zone'],['shotmap','🎯','Shot Map'],['credential','🪪','Credencial'],['matchdaypro','⏱️','JR Matchday+']];
let timer=0,observer=null;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function current(){try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch(_){return 'Primera Fuerza'}}
function markup(){return `<div class="jr81-cat-row">${CATS.map(c=>`<button type="button" class="jr81-cat-btn" data-category="${esc(c.name)}" data-jr81-category="${esc(c.name)}">${c.logo?`<span class="jr81-cat-icon"><img src="${c.logo}" alt="${esc(c.name)}"></span>`:`<span class="jr81-cat-icon" aria-hidden="true"></span>`}<span class="jr81-cat-title">${esc(c.name)}</span><span class="jr81-cat-phase">${esc(c.phase)}</span><span class="jr81-cat-stats"><span>${c.teams} equipos</span><span>${c.players} jugadores</span><span>${c.played} jugados</span><span>${c.pending} pendientes</span></span></button>`).join('')}</div>`}
function ensureHost(root,id,before){if(!root)return null;let host=document.getElementById(id);if(!host){host=document.createElement('section');host.id=id;host.className='jr81-cat-host';host.setAttribute('aria-label','Categorías de la liga');host.innerHTML=markup()}if(host.parentElement!==root||host.nextElementSibling!==before)root.insertBefore(host,before||null);return host}
function syncActive(){const active=current();$$('.jr81-cat-btn').forEach(b=>{const on=norm(b.dataset.category)===norm(active);b.classList.toggle('active',on);b.classList.toggle('is-active',on)})}
function ensureMoreGrid(root){if(!root)return null;let grid=root.querySelector(':scope > .more-grid');if(!grid){grid=document.createElement('div');grid.className='more-grid';grid.innerHTML=MORE.map(([v,i,l])=>`<button class="more-link" type="button" data-view="${v}" aria-label="${esc(l)}"><span>${i}</span><b>${esc(l)}</b></button>`).join('');root.appendChild(grid)}grid.hidden=false;grid.removeAttribute('aria-hidden');grid.classList.remove('hidden','jr76-hide-legacy');$$(':scope > *',grid).forEach(el=>{el.hidden=false;el.removeAttribute('aria-hidden');el.classList.remove('hidden')});return grid}
function mountTeams(){const root=$('#view-teams');if(!root)return;const search=$('#teamSearch',root)||$('#teamsGrid',root);const host=ensureHost(root,'jr81TeamsCategoryHost',search);if(host&&host.children.length===0)host.innerHTML=markup()}
function mountMore(){const root=$('#view-more');if(!root)return;const grid=ensureMoreGrid(root);const host=ensureHost(root,'jr81MoreCategoryHost',grid);if(host&&host.children.length===0)host.innerHTML=markup()}
function mount(){mountTeams();mountMore();syncActive();document.documentElement.dataset.jr81Fix50='ready'}
function queue(ms=60){clearTimeout(timer);timer=setTimeout(mount,ms)}
function onCategoryClick(e){const b=e.target.closest?.('.jr81-cat-btn');if(!b)return;const cat=b.dataset.category;if(!cat)return;try{localStorage.setItem('jrCategory',cat)}catch(_){};setTimeout(syncActive,0);setTimeout(syncActive,100);setTimeout(()=>{try{window.LJR_V27?.setCategory?.(cat)}catch(_){ }},0)}
function start(){mount();[100,300,700,1300,2500,4500,8000].forEach(ms=>setTimeout(mount,ms));document.addEventListener('click',onCategoryClick,true);document.addEventListener('click',()=>queue(100),true);observer=new MutationObserver(()=>queue(80));observer.observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',()=>queue(30));addEventListener('pageshow',()=>queue(30));addEventListener('focus',()=>queue(50))}
window.JRFix50={build:BUILD,refresh:mount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
