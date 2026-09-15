/* V38 FIX44 — reemplazo duro del rail de categorías roto.
   Localiza el rail REAL por su contenido, lo oculta completo y pone una fila nueva.
   No depende de las clases antiguas FIX32/FIX34/FIX37/FIX42/FIX43. */
(()=>{'use strict';
if(window.__JR76Fix44)return;window.__JR76Fix44=true;
const BUILD='38-44';
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
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let DATA=null,mo=null,busy=false;
function nameIn(el){const t=norm(el?.textContent||'');const hits=NAMES.filter(n=>t.includes(norm(n)));return hits.length===1?hits[0]:''}
function summarySignal(el){const t=norm(el?.textContent||'');return /TORNEO DE COPA|FINAL/.test(t)||/(EQUIPOS|JUGADORES).*(JUGADOS|PENDIENTES)|(JUGADOS|PENDIENTES).*(EQUIPOS|JUGADORES)/.test(t)||el.matches?.('[data-jr66-category],[data-jr64-category],.jr66-category-summary,.jr69-category-compact,.jr64-category-summary-card,.jr71-category-card,.jr74-category-card')}
function rawCandidates(){return $$('button,a,article,section,div').filter(el=>!el.closest('#jr76CategoryRow')&&nameIn(el)&&summarySignal(el))}
function leafCandidates(){const raw=rawCandidates();return raw.filter(el=>!raw.some(ch=>ch!==el&&el.contains(ch)&&nameIn(ch)===nameIn(el)))}
function minimalGroup(cards){
 let best=null,bestScore=1e9;
 cards.forEach(card=>{
   let p=card.parentElement,depth=0;
   while(p&&p!==document.body&&p!==document.documentElement&&depth<10){
     if(p.id==='jr76CategoryRow')break;
     const inside=cards.filter(c=>p.contains(c));
     const names=new Set(inside.map(nameIn).filter(Boolean));
     if(names.size>=3){
       const score=inside.length*100+p.querySelectorAll('*').length+depth;
       if(score<bestScore){best=p;bestScore=score}
       break;
     }
     p=p.parentElement;depth++;
   }
 });
 return best;
}
function official(name){
 const f=FALLBACK[name],hit=Object.values(DATA?.categories||{}).find(c=>norm(c?.name)===norm(name)),co=hit?.counts||hit?.dashboard?.counts||{};
 return {phase:hit?.current_phase||f.phase,teams:co.Equipos??f.teams,players:co.Jugadores??f.players,played:co['Partidos Jugados']??f.played,pending:co['Partidos Pendientes']??f.pending,logo:f.logo};
}
function style(){if($('#jr76Fix44Style'))return;const s=document.createElement('style');s.id='jr76Fix44Style';s.textContent=`
html[data-jr76-fix44="ready"] .jr76-old-category-rail{display:none!important;width:0!important;height:0!important;min-width:0!important;min-height:0!important;max-width:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;border:0!important;visibility:hidden!important}
#jr76CategoryRow{box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important;width:calc(100vw - 64px)!important;max-width:1800px!important;min-width:0!important;margin:0 auto 14px!important;padding:0!important;overflow:visible!important;position:relative!important;left:auto!important;right:auto!important;transform:none!important;float:none!important;clear:both!important}
#jr76CategoryRow .jr76-card{appearance:none!important;-webkit-appearance:none!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:42px minmax(0,1fr)!important;align-items:center!important;gap:8px!important;width:100%!important;min-width:0!important;max-width:none!important;height:80px!important;min-height:80px!important;max-height:80px!important;margin:0!important;padding:8px 10px!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;background:linear-gradient(180deg,#17171d,#111116)!important;color:#f5f7f6!important;text-align:left!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 4px 14px rgba(0,0,0,.18)!important;transform:none!important;flex:none!important;position:relative!important;inset:auto!important}
#jr76CategoryRow .jr76-card.noicon{grid-template-columns:minmax(0,1fr)!important}
#jr76CategoryRow .jr76-icon{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;min-width:42px!important;max-width:42px!important;overflow:hidden!important;border-radius:10px!important;background:#020806!important;border:1px solid rgba(46,236,164,.18)!important}
#jr76CategoryRow .jr76-icon img{display:block!important;width:36px!important;height:36px!important;max-width:36px!important;object-fit:contain!important;margin:0!important;padding:0!important;border:0!important}
#jr76CategoryRow .jr76-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:2px!important;min-width:0!important;overflow:hidden!important}
#jr76CategoryRow .jr76-title{font-size:11px!important;line-height:1.08!important;font-weight:900!important;white-space:normal!important;overflow:hidden!important}
#jr76CategoryRow .jr76-phase{color:#8f9f97!important;font-size:7.6px!important;line-height:1.08!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#jr76CategoryRow .jr76-stats{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:1px 5px!important;margin-top:1px!important;color:#d4ded9!important;font-size:7.4px!important;line-height:1.05!important;min-width:0!important}
#jr76CategoryRow .jr76-stats span{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;min-width:0!important}
#jr76CategoryRow .jr76-stats strong{color:#fff!important;font-size:7.8px!important;font-weight:900!important}
@media(max-width:980px){#jr76CategoryRow{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:calc(100vw - 32px)!important}}
@media(max-width:620px){#jr76CategoryRow{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;width:calc(100vw - 20px)!important}#jr76CategoryRow .jr76-card{height:76px!important;min-height:76px!important;max-height:76px!important;grid-template-columns:38px minmax(0,1fr)!important;padding:7px 8px!important}#jr76CategoryRow .jr76-icon{width:38px!important;height:38px!important;min-width:38px!important;max-width:38px!important}#jr76CategoryRow .jr76-icon img{width:32px!important;height:32px!important}}
`;document.head.appendChild(s)}
function markup(name){const m=official(name),icon=m.logo?`<span class="jr76-icon"><img src="${esc(m.logo)}?v=${BUILD}" alt="${esc(name)}"></span>`:'';return `<button type="button" class="jr76-card${m.logo?'':' noicon'}" data-jr76-category="${esc(name)}">${icon}<span class="jr76-copy"><b class="jr76-title">${esc(name)}</b><small class="jr76-phase">${esc(m.phase)}</small><span class="jr76-stats"><span><strong>${esc(m.teams)}</strong> equipos</span><span><strong>${esc(m.players)}</strong> jugadores</span><span><strong>${esc(m.played)}</strong> jugados</span><span><strong>${esc(m.pending)}</strong> pendientes</span></span></span></button>`}
function activate(name){
 const exact=$$('[data-category]').find(x=>!x.closest('#jr76CategoryRow')&&norm(x.dataset.category)===norm(name));
 if(exact){try{exact.click();return}catch(_){}}
 try{localStorage.setItem('jrCategory',name)}catch(_){}
 const select=$$('select').find(x=>[...x.options||[]].some(o=>norm(o.textContent)===norm(name)));
 if(select){select.value=[...select.options].find(o=>norm(o.textContent)===norm(name))?.value||name;select.dispatchEvent(new Event('change',{bubbles:true}))}
}
function mount(group){
 let row=$('#jr76CategoryRow');
 if(!row){row=document.createElement('div');row.id='jr76CategoryRow';row.setAttribute('aria-label','Categorías de la liga')}
 row.innerHTML=NAMES.map(markup).join('');
 $$('[data-jr76-category]',row).forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();activate(b.dataset.jr76Category)});
 if(group&&group.parentElement){if(row.parentElement!==group.parentElement||row.nextElementSibling!==group)group.parentElement.insertBefore(row,group);group.classList.add('jr76-old-category-rail')}
 else{
   const host=$('#view-more')||$('.view.active')||$('.app')||document.body;
   const title=$('.section-title',host);
   if(title)title.insertAdjacentElement('afterend',row);else host.prepend(row);
 }
 return row;
}
function cleanExtras(row,group){
 // FIX43 anterior: si existe, se elimina para que sólo quede una fila canónica.
 const old=$('#jr75CategoryRow');if(old&&old!==row)old.remove();
 // Oculta tarjetas resumen sueltas que hayan quedado fuera del rail detectado.
 leafCandidates().forEach(c=>{if(!row.contains(c)&&(!group||!group.contains(c)))c.classList.add('jr76-old-category-rail')});
}
function fix(){if(busy)return;busy=true;try{style();const cards=leafCandidates(),group=minimalGroup(cards),row=mount(group);cleanExtras(row,group);document.documentElement.dataset.jr76Fix44='ready'}finally{busy=false}}
async function load(){try{const r=await fetch('./data/official-live.json?v='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});if(r.ok)DATA=await r.json()}catch(_){}fix()}
function schedule(){[0,30,90,220,500,1000,1800,3200,5500,9000,14000].forEach(ms=>setTimeout(fix,ms))}
function observe(){if(mo)return;mo=new MutationObserver(()=>{clearTimeout(observe.t);observe.t=setTimeout(fix,80)});mo.observe(document.documentElement,{childList:true,subtree:true})}
document.addEventListener('click',e=>{if(e.target.closest('[data-view],.bottom-nav,button,a'))[20,100,260,600].forEach(ms=>setTimeout(fix,ms))},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('resize',()=>setTimeout(fix,80),{passive:true});addEventListener('focus',()=>setTimeout(fix,80));
window.JRFix44={build:BUILD,refresh:fix,reload:load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{load();schedule();observe()},{once:true});else{load();schedule();observe()}
})();
