/* V38 FIX45/48 — estabilidad de categorías solamente. América la controla FIX48. */
(()=>{'use strict';
if(window.__JR76Fix45)return;window.__JR76Fix45=true;
const BUILD='38-48';
const PF_LOGO='./assets/branding/primera-fuerza-hd.png';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ORDER=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const FALLBACK={
 'Primera Fuerza':{phase:'Torneo de Copa J5',equipos:11,jugadores:291,jugados:20,pendientes:35,logo:PF_LOGO},
 'Intermedia':{phase:'Torneo de Copa J5',equipos:13,jugadores:332,jugados:22,pendientes:54,logo:''},
 'Segunda Fuerza':{phase:'Torneo de Copa J5',equipos:12,jugadores:312,jugados:23,pendientes:42,logo:''},
 'Veteranos 35+':{phase:'FINAL',equipos:10,jugadores:0,jugados:0,pendientes:0,logo:''},
 'Veteranos 50+':{phase:'Torneo de Copa J6',equipos:6,jugadores:109,jugados:15,pendientes:30,logo:''}
};
let DATA=null,timer=0;
async function loadData(){try{const r=await fetch('./data/official-live.json?fix='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});if(r.ok)DATA=await r.json()}catch(_){}}
function catFromData(name){const hit=Object.values(DATA?.categories||{}).find(c=>norm(c?.name)===norm(name));if(!hit)return null;const c=hit?.counts||hit?.dashboard?.counts||{};return{name,phase:hit?.current_phase||FALLBACK[name].phase,equipos:Number(c.Equipos??FALLBACK[name].equipos??0),jugadores:Number(c.Jugadores??FALLBACK[name].jugadores??0),jugados:Number(c['Partidos Jugados']??FALLBACK[name].jugados??0),pendientes:Number(c['Partidos Pendientes']??FALLBACK[name].pendientes??0),logo:FALLBACK[name].logo||''}}
function cats(){return ORDER.map(name=>catFromData(name)||{name,...FALLBACK[name]})}
function viewMore(){return $('#view-more')||$('[data-view="more"]')||$('[id*="view-more"]')}
function findAnchor(root){const title=$$('h1,h2,h3,.section-title,.eyebrow',root).find(el=>/EXPLORA LA LIGA/i.test(el.textContent||''));return title?.closest('section,div')||title?.parentElement||root.firstElementChild||root}
function hideLegacy(root){$$('.jr68-category-grid,.jr69-category-strip,.jr71-category-rail,.jr74-category-rail,.jr75-category-row,[class*="category-row"]',root).filter(el=>!el.closest('.jr76-category-host')).forEach(el=>el.classList.add('jr76-hide-legacy'))}
function cardHtml(c){const icon=c.logo?`<span class="jr76-category-icon"><img src="${esc(c.logo)}?v=${BUILD}" alt="${esc(c.name)}"></span>`:'<span class="jr76-category-icon"></span>';return `<button class="jr76-category-btn" type="button" data-jr76-category="${esc(c.name)}">${icon}<span class="jr76-category-name">${esc(c.name)}</span><span class="jr76-category-phase">${esc(c.phase)}</span><span class="jr76-left-stats"><span class="jr76-metric"><b>${c.equipos}</b> <span>equipos</span></span><span class="jr76-metric jr76-played"><b>${c.jugados}</b> <span>jugados</span></span></span><span class="jr76-right-stats"><span class="jr76-metric"><b>${c.jugadores}</b> <span>jugadores</span></span><span class="jr76-metric jr76-pending"><b>${c.pendientes}</b> <span>pendientes</span></span></span></button>`}
function clickOriginalCategory(name){const n=norm(name),candidates=$$('[data-category],button,a,[role="button"]').filter(el=>!el.closest('.jr76-category-host'));const exact=candidates.find(el=>norm(el.dataset.category||'')===n);if(exact){exact.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));return}const byText=candidates.find(el=>{const t=norm(el.textContent||'');return t.includes(n)&&!t.includes('AMERICA')&&!t.includes('POZOS')});if(byText)byText.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))}
function markActive(name){$$('.jr76-category-btn').forEach(b=>b.classList.toggle('is-active',norm(b.dataset.jr76Category)===norm(name)))}
function renderRow(){const root=viewMore();if(!root)return;hideLegacy(root);let host=$('.jr76-category-host',root);if(!host){host=document.createElement('section');host.className='jr76-category-host';findAnchor(root).insertAdjacentElement('afterend',host)}const html=`<div class="jr76-category-row">${cats().map(cardHtml).join('')}</div>`;if(host.innerHTML!==html)host.innerHTML=html;$$('.jr76-category-btn',host).forEach(btn=>{if(btn.dataset.jr76Wired==='1')return;btn.dataset.jr76Wired='1';btn.addEventListener('click',()=>{const name=btn.dataset.jr76Category||'';markActive(name);clickOriginalCategory(name)})});if(!$('.jr76-category-btn.is-active',host))markActive('Primera Fuerza')}
function queue(){clearTimeout(timer);timer=setTimeout(renderRow,80)}
async function init(){await loadData();renderRow();const mo=new MutationObserver(queue);mo.observe(document.body,{childList:true,subtree:true});[180,500,1200,2500,4200].forEach(ms=>setTimeout(renderRow,ms));document.addEventListener('click',queue,true);document.addEventListener('change',queue,true);addEventListener('hashchange',queue);addEventListener('pageshow',queue);addEventListener('focus',queue)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
