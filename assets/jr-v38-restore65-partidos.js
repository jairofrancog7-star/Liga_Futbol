/* V38.65 — restaura Partidos/Jornada con cuadros, clima, mapa, Match Center, recordar y cédula oficial. */
(()=>{'use strict';
if(window.__JR65_PARTIDOS)return;window.__JR65_PARTIDOS=true;
const BUILD='38-65-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const CAT_ORDER=['3','5','4','2','1'];
const CAT_META={
 '3':{name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
 '5':{name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
 '4':{name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
 '2':{name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
 '1':{name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
};
const FALLBACK={
 'franco fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7',
 'hermanos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh',
 'lobos cdg':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib',
 'juventus':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b',
 'herreras fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/HerreraFC_mnmlsd',
 'linces':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c'
};
const state={data:null,cat:'3',round:'all',status:'all'};
function currentCatFromStorage(){try{const n=norm(localStorage.getItem('jrCategory'));const id=CAT_ORDER.find(x=>norm(CAT_META[x].name)===n);if(id)state.cat=id}catch(_){}}
function cat(){return state.data?.categories?.[state.cat]||{}}
function cname(){return cat()?.name||CAT_META[state.cat].name}
function logoValue(team){const all=state.data?.team_logos||{},wanted=norm(team);for(const [k,v] of Object.entries(all)){if(norm(k)===wanted)return typeof v==='string'?v:(v?.local||v?.path||v?.source||'')}return FALLBACK[wanted]||''}
function initials(team){return String(team||'?').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase()}
function crest(team){const src=logoValue(team);return src?`<img src="${esc(src)}" alt="Escudo ${esc(team)}" loading="lazy" decoding="async">`:`<span class="jr65-fallback">${esc(initials(team))}</span>`}
function fixtures(){const out=[];for(const block of (Array.isArray(cat()?.fixtures)?cat().fixtures:[])){const hs=(block.headers||[]).map(norm), goals=hs.map((x,i)=>x==='goles'?i:-1).filter(i=>i>=0);for(const r of (block.rows||[])){const get=(names,def='')=>{for(const n of names){const i=hs.indexOf(norm(n));if(i>=0)return r[i]??def}return def};out.push({id:get(['#']),round:String(get(['Jornada'])),home:get(['Local']),hg:goals.length?String(r[goals[0]]??''):'',away:get(['Visitante']),ag:goals.length>1?String(r[goals[1]]??''):'',field:get(['Campo']),date:get(['Fecha/Hora','Fecha Hora']),ref:get(['Árbitro','Arbitro'])})}}return out.filter(x=>x.home||x.away)}
function played(m){return !['','-','—'].includes(String(m.hg).trim())&&!['','-','—'].includes(String(m.ag).trim())}
function selected(){let ms=fixtures();if(state.round!=='all')ms=ms.filter(m=>m.round===state.round);if(state.status==='played')ms=ms.filter(played);if(state.status==='pending')ms=ms.filter(m=>!played(m));return ms}
function mapHref(field){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((field&&field!=='-'?field:'Campo de futbol')+', Santa Cruz de Juventino Rosas, Guanajuato')}
function safeFile(s){return String(s||'partido').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()}
function remember(m){const raw=String(m.date||'');const mm=raw.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);let dt='';if(mm)dt=`${mm[3]}${mm[2]}${mm[1]}T${mm[4]}${mm[5]}00`;const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Partido//ES','BEGIN:VEVENT','UID:jr-'+Date.now()+'@ligajuventinorosas','SUMMARY:'+String(m.home||'Local').replace(/,/g,'\\,')+' vs '+String(m.away||'Visitante').replace(/,/g,'\\,'),'LOCATION:'+String(m.field||'Campo por confirmar').replace(/,/g,'\\,')];if(dt)lines.push('DTSTART;TZID=America/Mexico_City:'+dt);lines.push('DESCRIPTION:Liga Juventino Rosas · '+cname(),'END:VEVENT','END:VCALENDAR');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar'}));a.download='recordar-'+safeFile(m.home+'-'+m.away)+'.ics';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),15000)}
function matchCenter(m){try{sessionStorage.setItem('jrSelectedMatch',JSON.stringify({...m,category:cname()}))}catch(_){};if(typeof window.showView==='function')window.showView('matchcenter');else location.hash='matchcenter'}
function weather(m){const field=(m.field&&m.field!=='-')?m.field:'';try{sessionStorage.setItem('jrWeatherField',field)}catch(_){};const b=document.querySelector('[data-view="weather"],[data-view="fields"]');if(b){b.click();return}alert('Clima · '+(field||'fuera de horizonte'))}
function cedulaHref(m){const q=new URLSearchParams({category:cname(),jornada:m.round||'',local:m.home||'',visitante:m.away||''});return './cedulas.html?'+q.toString()}
function stateLabel(m){return played(m)?'FINALIZADO / PENDIENTE DE RESULTADO':'PRÓXIMO PARTIDO / POR JUGAR'}
function score(m){return played(m)?`${esc(m.hg)} : ${esc(m.ag)}`:'VS'}
function card(m,i){const field=m.field&&m.field!=='-'?m.field:'Campo por confirmar';const favKey=safeFile(cname()+'-'+m.round+'-'+m.home+'-'+m.away);let fav=false;try{fav=localStorage.getItem('jrFav-'+favKey)==='1'}catch(_){}return `<article class="jr65-match" data-jr65-index="${i}">
 <div class="jr65-cardtop"><span>J${esc(m.round||'—')} · ${played(m)?'JUGADO':'PROGRAMADO'}</span><button class="jr65-star ${fav?'on':''}" type="button" data-jr65-fav="${esc(favKey)}" aria-label="Marcar partido favorito">☆</button></div>
 <div class="jr65-versus"><div class="jr65-team">${crest(m.home)}<strong>${esc(m.home||'LOCAL')}</strong></div><div class="jr65-score">${score(m)}</div><div class="jr65-team away">${crest(m.away)}<strong>${esc(m.away||'VISITANTE')}</strong></div></div>
 <div class="jr65-state">${stateLabel(m)}</div>
 <div class="jr65-meta"><span>🕒 ${esc(m.date||'Fecha por confirmar')}</span><span>📍 ${esc(field)}${field==='Campo por confirmar'?' · complejo deportivo':''}</span></div>
 <div class="jr65-actions"><a href="${mapHref(field)}" target="_blank" rel="noopener">Cómo llegar</a><button type="button" data-jr65-weather="${i}">Clima · fuera de horizonte</button><button type="button" data-jr65-matchcenter="${i}">Match Center</button><button type="button" data-jr65-remind="${i}">Recordar</button><a class="jr65-cedula" href="${cedulaHref(m)}">Cédula oficial</a></div>
 </article>`}
function catButtons(){return CAT_ORDER.map(id=>`<button class="jr65-cat ${id===state.cat?'active':''}" type="button" data-jr65-cat="${id}"><img src="${CAT_META[id].logo}?v=${BUILD}" alt=""><span>${esc(CAT_META[id].name)}</span></button>`).join('')}
function roundButtons(all){const rs=[...new Set(all.map(m=>m.round).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));return `<button type="button" data-jr65-round="all" class="${state.round==='all'?'active':''}">Todos</button>`+rs.map(r=>`<button type="button" data-jr65-round="${esc(r)}" class="${state.round===r?'active':''}">J${esc(r)}</button>`).join('')}
function syncTopCategory(){const n=norm(cname());$$('#categoryBar [data-category],#jr53TopCategoryHost [data-category]').forEach(b=>{const on=norm(b.dataset.category||b.textContent)===n;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});try{localStorage.setItem('jrCategory',cname())}catch(_){}}
function render(){const root=$('#jr65PartidosRestore');if(!root||!state.data)return;const all=fixtures(),ms=selected();root.innerHTML=`<div class="jr65-shell"><div class="jr65-head"><div><small>LIGA JUVENTINO ROSAS · PARTIDOS Y JORNADAS</small><h3>Partidos de la jornada</h3><p>${esc(cname())} · ${all.length} partidos cargados</p></div><div class="jr65-status"><button data-jr65-status="all" class="${state.status==='all'?'active':''}">Todos</button><button data-jr65-status="played" class="${state.status==='played'?'active':''}">Jugados</button><button data-jr65-status="pending" class="${state.status==='pending'?'active':''}">Próximos</button></div></div><div class="jr65-cats">${catButtons()}</div><div class="jr65-rounds">${roundButtons(all)}</div><div class="jr65-list">${ms.length?ms.map(card).join(''):'<div class="jr65-empty">No hay partidos para este filtro.</div>'}</div></div>`;bind(root,ms);syncTopCategory()}
function bind(root,ms){$$('[data-jr65-cat]',root).forEach(b=>b.onclick=()=>{state.cat=b.dataset.jr65Cat;state.round='all';render()});$$('[data-jr65-round]',root).forEach(b=>b.onclick=()=>{state.round=b.dataset.jr65Round;render()});$$('[data-jr65-status]',root).forEach(b=>b.onclick=()=>{state.status=b.dataset.jr65Status;render()});$$('[data-jr65-weather]',root).forEach(b=>b.onclick=()=>weather(ms[+b.dataset.jr65Weather]));$$('[data-jr65-matchcenter]',root).forEach(b=>b.onclick=()=>matchCenter(ms[+b.dataset.jr65Matchcenter]));$$('[data-jr65-remind]',root).forEach(b=>b.onclick=()=>remember(ms[+b.dataset.jr65Remind]));$$('[data-jr65-fav]',root).forEach(b=>b.onclick=()=>{const k='jrFav-'+b.dataset.jr65Fav;let on=false;try{on=localStorage.getItem(k)==='1';localStorage.setItem(k,on?'0':'1')}catch(_){}b.classList.toggle('on',!on);b.textContent=!on?'★':'☆'})}
async function load(){try{const r=await fetch('./data/official-live.json?restore='+BUILD+'&t='+Date.now(),{cache:'no-store'});if(r.ok)state.data=await r.json()}catch(_){}return state.data}
async function ensure(){const view=$('#view-matches');if(!view)return;let root=$('#jr65PartidosRestore',view);if(!root){root=document.createElement('section');root.id='jr65PartidosRestore';const title=$('.section-title',view);if(title)title.insertAdjacentElement('afterend',root);else view.prepend(root)}root.innerHTML='<div class="jr65-loading">Cargando partidos de la liga…</div>';currentCatFromStorage();if(await load())render();else root.innerHTML='<div class="jr65-empty">No se pudieron cargar los partidos. Actualiza la página.</div>'}
function listenLegacy(){document.addEventListener('click',e=>{const b=e.target.closest?.('#categoryBar [data-category],#jr53TopCategoryHost [data-category]');if(!b)return;const id=CAT_ORDER.find(x=>norm(CAT_META[x].name)===norm(b.dataset.category||b.textContent));if(id&&id!==state.cat){state.cat=id;state.round='all';setTimeout(render,30)}},true)}
function start(){ensure();listenLegacy();[500,1400,3000,6500].forEach(t=>setTimeout(()=>{if(!$('#jr65PartidosRestore .jr65-match'))ensure()},t));addEventListener('hashchange',()=>{if(location.hash==='#matches')setTimeout(ensure,30)});addEventListener('pageshow',()=>setTimeout(ensure,30))}
window.JRRestore65Partidos={build:BUILD,refresh:ensure};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
