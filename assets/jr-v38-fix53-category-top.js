/* V38 FIX53 — promueve la fila de categorías justo debajo de los chips superiores */
(()=>{'use strict';
if(window.__JR53TopOrder)return;window.__JR53TopOrder=true;
const BUILD='38-53-r2';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=[
 {name:'Primera Fuerza',phase:'Torneo de Copa J5',teams:11,players:291,played:20,pending:35,logo:'./assets/branding/primera-fuerza-hd.png?v='+BUILD},
 {name:'Intermedia',phase:'Torneo de Copa J5',teams:13,players:332,played:22,pending:54,logo:''},
 {name:'Segunda Fuerza',phase:'Torneo de Copa J5',teams:12,players:312,played:23,pending:42,logo:''},
 {name:'Veteranos 35+',phase:'FINAL',teams:10,players:0,played:0,pending:0,logo:''},
 {name:'Veteranos 50+',phase:'Torneo de Copa J6',teams:6,players:109,played:15,pending:30,logo:''}
];
function current(){
 try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch(_){return 'Primera Fuerza'}
}
function markup(){
 return '<div class="jr81-cat-row jr53-js-category-row">'+CATS.map(c=>
  '<button type="button" class="jr81-cat-btn" data-category="'+esc(c.name)+'" data-jr81-category="'+esc(c.name)+'">'+
  (c.logo?'<span class="jr81-cat-icon"><img src="'+c.logo+'" alt="'+esc(c.name)+'"></span>':'<span class="jr81-cat-icon" aria-hidden="true"></span>')+
  '<span class="jr81-cat-title">'+esc(c.name)+'</span>'+
  '<span class="jr81-cat-phase">'+esc(c.phase)+'</span>'+
  '<span class="jr81-cat-stats"><span>'+c.teams+' equipos</span><span>'+c.players+' jugadores</span><span>'+c.played+' jugados</span><span>'+c.pending+' pendientes</span></span>'+
  '</button>').join('')+'</div>';
}
function syncActive(){
 const active=current();
 $$('#jr53TopCategoryHost .jr81-cat-btn, #jr76CategoryRow [data-jr76-category], #jr75CategoryRow [data-jr75-category]').forEach(b=>{
  const value=b.dataset.category||b.dataset.jr76Category||b.dataset.jr75Category||'';
  const on=norm(value)===norm(active);
  b.classList.toggle('active',on);
  b.classList.toggle('is-active',on);
 });
}
function ensureTop(){
 const host=$('#jr53TopCategoryHost');
 if(!host)return;
 if(!host.querySelector('.jr81-cat-row')&&!$('#jr76CategoryRow')&&!$('#jr75CategoryRow'))host.innerHTML=markup();
 host.dataset.jr53Ready='true';
 syncActive();
}
function promote(){
 const bar=$('#categoryBar');
 const row=$('#jr76CategoryRow')||$('#jr75CategoryRow');
 if(bar&&row&&row!==bar.nextElementSibling)bar.insertAdjacentElement('afterend',row);
 syncActive();
 document.documentElement.dataset.jr53Category='top';
}
function setCategory(cat){
 try{localStorage.setItem('jrCategory',cat)}catch(_){}
 try{window.LJR_V20_API?.setCategory?.(cat)}catch(_){}
 try{window.LJR_V27?.setCategory?.(cat)}catch(_){}
 setTimeout(syncActive,0);
 setTimeout(syncActive,120);
}
function onClick(e){
 const b=e.target.closest?.('#jr53TopCategoryHost .jr81-cat-btn, #jr76CategoryRow [data-jr76-category], #jr75CategoryRow [data-jr75-category]');
 if(!b)return;
 const cat=b.dataset.category||b.dataset.jr76Category||b.dataset.jr75Category;
 if(cat)setCategory(cat);
}
let timer=0;
function queue(ms=80){clearTimeout(timer);timer=setTimeout(()=>{ensureTop();promote()},ms)}
function start(){
 ensureTop();
 promote();
 [120,350,800,1600,3000,6000,10000].forEach(ms=>setTimeout(()=>{ensureTop();promote()},ms));
 document.addEventListener('click',onClick,true);
 const mo=new MutationObserver(()=>queue());
 if(document.body)mo.observe(document.body,{childList:true,subtree:true});
 addEventListener('hashchange',()=>queue(30));
 addEventListener('pageshow',()=>queue(30));
 addEventListener('resize',()=>queue(90),{passive:true});
 document.documentElement.dataset.jr53Category='top';
}
window.JRTopCategoriesV3853={build:BUILD,refresh:()=>{ensureTop();promote()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();