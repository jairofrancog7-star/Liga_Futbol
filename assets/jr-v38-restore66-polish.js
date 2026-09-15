/* V38.66 — ajustes finales de Tabla, Estadísticas y Partidos solicitados por el usuario. */
(()=>{'use strict';
if(window.__JR66_POLISH)return;window.__JR66_POLISH=true;
const BUILD='38-66-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const I={
 pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
 cloud:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a5 5 0 0 1-.7-9.95A7 7 0 0 1 19.7 11 4 4 0 0 1 17.5 19Z"/></svg>',
 target:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></svg>',
 bell:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
 clipboard:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4"/></svg>',
 download:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>',
 share:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.9 7.6-4.5M8.2 13.1l7.6 4.5"/></svg>',
 sheet:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l3 3v17H6Z"/><path d="M15 2v4h4M9 10h6M9 14h6M9 18h6"/></svg>',
 filter:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
 check:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
 calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>'
};
function addIcon(el,key){if(!el||el.querySelector(':scope > .jr66-action-icon'))return;const s=document.createElement('span');s.className='jr66-action-icon';s.innerHTML=I[key]||'';el.prepend(s)}
function dedupePodium(){
 $$('.jr64-podium-card').forEach(card=>{
   const imgs=$$('img',card),seen=new Set();
   imgs.forEach(img=>{const k=(img.currentSrc||img.src||'').split('?')[0];if(k&&seen.has(k))img.remove();else if(k)seen.add(k)});
   const crests=$$('.jr64-crest',card);crests.slice(1).forEach(x=>x.remove());
 });
}
function performanceLogos(){
 const map=new Map();
 $$('#jr64TableRestore .jr64-table tbody tr').forEach(tr=>{const b=$('.jr64-team b',tr),img=$('img.jr64-crest',tr);if(b&&img)map.set(norm(b.textContent),img)});
 $$('#jr64StatsRestore .jr64-performance article').forEach(article=>{
   if($('.jr66-performance-crest',article))return;
   const copy=$('.jr64-performance-copy',article),name=$('b',copy)?.textContent||'';if(!copy||!name)return;
   const src=map.get(norm(name));
   const wrap=document.createElement('span');wrap.className='jr66-performance-crest';
   if(src){const clone=src.cloneNode(true);clone.removeAttribute('loading');wrap.append(clone)}
   else{const fallback=document.createElement('span');fallback.className='jr64-crest';fallback.textContent='⚽';wrap.append(fallback)}
   article.insertBefore(wrap,copy);
 });
}
function buttonIcons(){
 $$('#view-matches .jr65-actions a,#view-matches .jr65-actions button').forEach(el=>{
   const t=norm(el.textContent);if(t.includes('como llegar'))addIcon(el,'pin');
   else if(t.includes('clima'))addIcon(el,'cloud');
   else if(t.includes('match center'))addIcon(el,'target');
   else if(t.includes('recordar'))addIcon(el,'bell');
   else if(t.includes('cedula oficial'))addIcon(el,'clipboard');
 });
 $$('#view-matches .jr65-status button').forEach(el=>{const t=norm(el.textContent);if(t==='todos')addIcon(el,'filter');else if(t==='jugados')addIcon(el,'check');else if(t.includes('proxim'))addIcon(el,'calendar')});
 $$('#view-table .jr64-actions button,#view-table .jr64-actions a').forEach(el=>{const t=norm(el.textContent);if(t.includes('png completo'))addIcon(el,'download');else if(t.includes('compartir'))addIcon(el,'share');else if(t.includes('csv'))addIcon(el,'sheet')});
}
function enableTableSwipe(){
 $$('#view-table .jr64-table-wrap').forEach(w=>{w.style.touchAction='pan-x pan-y';w.style.webkitOverflowScrolling='touch';w.style.overflowX='scroll';w.style.pointerEvents='auto';});
}
function polish(){dedupePodium();performanceLogos();buttonIcons();enableTableSwipe()}
let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(polish,80)}
function start(){polish();[250,700,1400,3000,6000].forEach(t=>setTimeout(polish,t));new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',()=>setTimeout(polish,100));addEventListener('pageshow',()=>setTimeout(polish,100))}
window.JRRestore66Polish={build:BUILD,refresh:polish};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
