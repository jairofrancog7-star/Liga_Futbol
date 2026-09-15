/* V38 FIX54 restored — category cards remain functional and all cedulas stay inside Liga Juventino Rosas */
(()=>{'use strict';
const host=document.getElementById('jr53TopCategoryHost');
host?.addEventListener('click',e=>{
 const b=e.target.closest('button[data-category]');if(!b)return;
 const chip=Array.from(document.querySelectorAll('#categoryBar [data-category]')).find(x=>x.dataset.category===b.dataset.category);
 if(chip)chip.click();
 host.querySelectorAll('button').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on))});
});
window.addEventListener('click',e=>{
 const a=e.target.closest?.('a[href*="cedula-arbitral/"]');if(!a)return;
 e.preventDefault();e.stopImmediatePropagation();
 const id=(a.getAttribute('href')||'').match(/cedula-arbitral\/(\d+)/)?.[1]||'';
 location.href='./cedulas.html'+(id?'?cedula='+encodeURIComponent(id):'');
},true);
const actions=document.querySelector('.top-actions');
if(actions&&!document.getElementById('jr54Cedulas')){const a=document.createElement('a');a.id='jr54Cedulas';a.href='./cedulas.html';a.className='ghost-btn';a.textContent='Cédulas';actions.append(a)}
})();

/* V38 FIX58 loader — cruces completos + filtros categoría/jornada + logos oficiales del usuario */
(()=>{'use strict';
if(window.__JR58_LOADER)return;window.__JR58_LOADER=true;
const VERSION='38-58-r2';
const LOGOS={
 segunda:'https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/1c7da512-5529-4da3-afb6-008c20f599ec.png',
 veteranos35:'https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/be5a48b7-b293-4e6e-a0ae-e965dbf7d2bc.png'
};
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim()}
function ensureAssets(){
 if(!document.querySelector('link[data-jr58-loader]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./assets/jr-v38-fix58.css?v='+VERSION;l.dataset.jr58Loader='1';document.head.append(l)}
 if(!document.querySelector('script[data-jr58-loader]')){const s=document.createElement('script');s.src='./assets/jr-v38-fix58.js?v='+VERSION;s.defer=true;s.dataset.jr58Loader='1';document.body.append(s)}
}
function forceOfficialLogos(){
 document.querySelectorAll('#jr53TopCategoryHost .jr81-cat-btn,[data-jr81-category]').forEach(card=>{
   const raw=card.dataset.category||card.dataset.jr81Category||card.querySelector('.jr81-cat-title')?.textContent||card.textContent;
   const n=norm(raw);const src=n.includes('segunda fuerza')?LOGOS.segunda:(n.includes('veteranos 35')?LOGOS.veteranos35:'');if(!src)return;
   const img=card.querySelector('.jr81-cat-icon img')||card.querySelector('img');if(img&&img.src!==src){img.src=src;img.alt='Logo oficial '+(n.includes('segunda')?'Segunda Fuerza':'Veteranos 35+')}
 });
 document.querySelectorAll('#jr58MatchCenter [data-jr58-cat]').forEach(btn=>{
   const id=btn.dataset.jr58Cat;const src=id==='4'?LOGOS.segunda:(id==='2'?LOGOS.veteranos35:'');const img=btn.querySelector('img');if(src&&img&&img.src!==src)img.src=src;
 });
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(()=>{ensureAssets();forceOfficialLogos()},80)}
function start(){ensureAssets();forceOfficialLogos();[250,700,1500,3000,6000,10000].forEach(t=>setTimeout(forceOfficialLogos,t));new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',schedule);addEventListener('pageshow',schedule)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
