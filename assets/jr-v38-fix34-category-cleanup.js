/* V38 FIX34 — corrige botones/cuadros de categoría.
   Primera Fuerza conserva SOLO su logo. Los demás botones eliminan el logo genérico de Liga Juventino Rosas.
   Reacomoda título, fase y métricas sin tocar tarjetas de equipos ni sus clics. */
(()=>{'use strict';
if(window.__JR66Fix34)return;window.__JR66Fix34=true;
const BUILD='38-34';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png?build='+BUILD;
const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const META={
 'Primera Fuerza':{phase:'Torneo de Copa J5',fallback:{Equipos:11,Jugadores:291,'Partidos Jugados':20,'Partidos Pendientes':35}},
 'Intermedia':{phase:'Torneo de Copa J5',fallback:{Equipos:13,Jugadores:332,'Partidos Jugados':22,'Partidos Pendientes':54}},
 'Segunda Fuerza':{phase:'Torneo de Copa J5',fallback:{Equipos:12,Jugadores:312,'Partidos Jugados':23,'Partidos Pendientes':42}},
 'Veteranos 35+':{phase:'FINAL',fallback:{Equipos:10,Jugadores:0,'Partidos Jugados':0,'Partidos Pendientes':0}},
 'Veteranos 50+':{phase:'Torneo de Copa J6',fallback:{Equipos:6,Jugadores:109,'Partidos Jugados':15,'Partidos Pendientes':30}}
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let DATA=null;
function isTeamContext(el){return !!el.closest('#teamsGrid,.team-card,.club-card,[data-v27-team-card],[data-team-card],.jr60-team-card,.jr63-fixed-team-card')}
function keyFor(el){
 const vals=[el?.dataset?.category,el?.dataset?.v20Cat,el?.dataset?.v21Cat,el?.dataset?.v22Cat,el?.dataset?.v23Cat,el?.dataset?.v24Cat,el?.dataset?.v25Cat,el?.dataset?.v26Cat,el?.dataset?.v27Cat,el?.dataset?.v30Cat,el?.dataset?.v31Cat].filter(Boolean);
 for(const v of vals){const hit=CATS.find(c=>norm(v)===norm(c));if(hit)return hit}
 const t=norm(el?.textContent||'');return CATS.find(c=>t.includes(norm(c)))||'';
}
function candidates(){
 const set=new Set();
 ['[data-category]','[data-v20-cat]','[data-v21-cat]','[data-v22-cat]','[data-v23-cat]','[data-v24-cat]','[data-v25-cat]','[data-v26-cat]','[data-v27-cat]','[data-v30-cat]','[data-v31-cat]','.category-card','[class*="category-card"]','[class*="categoria-card"]','[class*="cat-card"]'].forEach(s=>$$(s).forEach(x=>set.add(x)));
 return [...set].filter(el=>el instanceof HTMLElement&&!isTeamContext(el)&&keyFor(el));
}
function leagueLogo(img){
 const src=String(img.getAttribute('src')||img.currentSrc||'').toLowerCase();
 const sig=norm([img.alt,img.title,img.className].filter(Boolean).join(' '));
 return /liga-logo|liga_?juventino|icon-192|icon-512|\/icon\.svg/.test(src)||(sig.includes('LIGA')&&sig.includes('JUVENTINO'));
}
function removeEmptyVisualWrapper(img){
 const p=img.parentElement;if(!p)return;
 const t=(p.textContent||'').trim();const visuals=p.querySelectorAll('img,picture,svg').length;
 if(!t&&visuals<=1&&p.children.length<=1&&p.parentElement&&!p.matches('button,a'))p.remove();else img.remove();
}
function nonLeagueLogo(el,key){
 if(key==='Primera Fuerza')return PF_LOGO;
 const img=$$('img',el).find(x=>!leagueLogo(x)&&!/primera-fuerza-hd/i.test(x.getAttribute('src')||''));
 return img?.getAttribute('src')||img?.currentSrc||'';
}
function official(key){
 const found=Object.values(DATA?.categories||{}).find(c=>norm(c?.name)===norm(key));
 return {counts:found?.counts||found?.dashboard?.counts||META[key].fallback,phase:found?.current_phase||META[key].phase};
}
function isSummary(el){
 if(el.classList.contains('jr64-category-summary-card')||el.classList.contains('jr66-category-summary'))return true;
 const t=norm(el.textContent||'');let n=0;['EQUIPOS','JUGADORES','JUGADOS','PENDIENTES','PARTIDOS JUGADOS','PARTIDOS PENDIENTES'].forEach(w=>{if(t.includes(w))n++});
 return n>=2;
}
function iconMarkup(key,src){return src?`<span class="jr66-cat-icon"><img src="${esc(src)}" alt="${esc(key)}" loading="lazy" decoding="async"></span>`:''}
function patchSummary(el,key){
 const src=nonLeagueLogo(el,key),o=official(key),c=o.counts||{};
 el.classList.add('jr66-category-clean','jr66-category-summary');
 el.dataset.jr66Category=key;
 el.classList.toggle('jr66-no-icon',!src);
 el.innerHTML=`${iconMarkup(key,src)}<span class="jr66-cat-copy"><b class="jr66-cat-title">${esc(key)}</b><small class="jr66-cat-phase">${esc(o.phase||'')}</small><span class="jr66-cat-stats"><span><strong>${esc(c.Equipos??'—')}</strong> equipos</span><span><strong>${esc(c.Jugadores??'—')}</strong> jugadores</span><span><strong>${esc(c['Partidos Jugados']??'—')}</strong> jugados</span><span><strong>${esc(c['Partidos Pendientes']??'—')}</strong> pendientes</span></span></span>`;
}
function patchSimple(el,key){
 el.classList.add('jr66-category-clean');el.dataset.jr66Category=key;
 $$('img',el).filter(leagueLogo).forEach(removeEmptyVisualWrapper);
 if(key==='Primera Fuerza'){
   $$('img',el).filter(img=>!/primera-fuerza-hd/i.test(img.getAttribute('src')||'')).forEach(img=>{if(leagueLogo(img))removeEmptyVisualWrapper(img)});
   if(!$('img[src*="primera-fuerza-hd"]',el)){
     const wrap=document.createElement('span');wrap.className='jr66-simple-icon';wrap.innerHTML=`<img src="${PF_LOGO}" alt="Primera Fuerza" loading="lazy" decoding="async">`;el.insertBefore(wrap,el.firstChild);
   }
 }
}
function cleanResidualLeagueLogos(){
 candidates().forEach(el=>$$('img',el).filter(leagueLogo).forEach(removeEmptyVisualWrapper));
}
function patchAll(){
 candidates().forEach(el=>{const key=keyFor(el);if(!key)return;if(isSummary(el))patchSummary(el,key);else patchSimple(el,key)});
 cleanResidualLeagueLogos();
 document.documentElement.dataset.jr66CategoryButtons='ready';
}
async function load(){try{const r=await fetch('./data/official-live.json?build='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});if(r.ok)DATA=await r.json()}catch(_){}patchAll()}
function schedule(){[0,60,180,420,900,1800,3400,6200,9000].forEach(ms=>setTimeout(patchAll,ms))}
document.addEventListener('click',e=>{if(e.target.closest('button,a,[data-category],[data-v20-cat],[data-v21-cat],[data-v25-cat],[data-view]'))[35,160,420,900].forEach(ms=>setTimeout(patchAll,ms))},true);
document.addEventListener('change',e=>{if(e.target.matches('select,input'))[60,220].forEach(ms=>setTimeout(patchAll,ms))},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('focus',()=>setTimeout(patchAll,160));
window.JRCategoryCleanupV3834={build:BUILD,refresh:patchAll,reload:load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{load();schedule()},{once:true});else{load();schedule()}
})();