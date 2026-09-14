/* V38 FIX28 — AdminFut público integrado: categorías, escudos, jugadores, tablas y credencial digital.
   Sólo datos deportivos públicos. No CURP/INE/domicilios en la capa pública. */
(function(){
'use strict';
if(window.__JR60Fix28)return; window.__JR60Fix28=true;
const BUILD='38-28';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CAT_ORDER=['1','3','5','4','2'];
const CAT_FALLBACK={
 '1':{name:'Veteranos 50+',counts:{Equipos:6,'Partidos Jugados':15,'Partidos Pendientes':30,Jugadores:109}},
 '2':{name:'Veteranos 35+',counts:{Equipos:10,'Partidos Jugados':0,'Partidos Pendientes':0,Jugadores:0}},
 '3':{name:'Primera Fuerza',counts:{Equipos:11,'Partidos Jugados':20,'Partidos Pendientes':35,Jugadores:291}},
 '4':{name:'Segunda Fuerza',counts:{Equipos:12,'Partidos Jugados':23,'Partidos Pendientes':42,Jugadores:312}},
 '5':{name:'Intermedia',counts:{Equipos:13,'Partidos Jugados':22,'Partidos Pendientes':54,Jugadores:332}}
};
const FALLBACK_LOGOS={
'BOAVISTA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_qiq0dy',
'MANCHESTER':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/ManchesterU_zltkh0',
'TOROS DE CUENDA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TorosCuenda_od8vcf',
'LA ESPERANZA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaEsperanzaFC_vazya7',
'DYNAMO':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dinamo_rgamvy',
'TERRICOLAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Terricolas_ltbrzy',
'FRANCO FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7',
'HERRERAS FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/HerreraFC_mnmlsd',
'LINCES':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c',
'JUVENTUS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b',
'HERMANOS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh',
'SAN JOSE FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d',
'LOBOS CDG':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib',
'NAPOLI':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv',
'ABEJAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Abejas_lxn6l9',
'DEP. NOPALERO':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Nopalero_skdsij',
'DEP. ZAPATA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dep.Zapata_a5dsaz',
'SAN JUAN FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJuanFC_jhprtf',
'TAPATIO':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/tapatio_svt6lz',
'SAN ANTONIO FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioFC_tw7bi1',
'CELTICOS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CelticosFC_nv4ukd',
'SAN JULIAN':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJulianFC_wetv0z',
'DEP. LA LUZ':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/DepLaLuz_wibidf',
'TAVERA FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TaveraFC_gpdbhg',
'PACHANGAS FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Pachangas_upqelg',
'SAN JOSE JRS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseJR_dio2dt',
'BARZA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Barcelona_amoaiq',
'MAZACOTES FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Mazacotes_ko8o0w',
'DEP. MARAVILLAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx',
'POPULARES':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt',
'PROMESAS FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PromesasFC_w4lwk8',
'CAPIBARAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl',
'LA CUADRILLA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CuadrillaFC_vpfbtr',
'LA CANCHITA DEPORTES':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaCanchita_enf6ca',
'GALEANA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Galeana_kujrh0',
'ALDAMA FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Aldama_mqm3r1',
'MALVINAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9',
'OSASUNA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa',
'SAN ANTONIO JRS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioJR_jzmfka',
'LA HUERTA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaHuertaCuenda_bm4fxj'
};
const state={data:null,cat:'3',tab:'resumen',team:'',search:''};
let hub=null;

function cats(){return state.data?.categories||{}}
function cat(id=state.cat){return cats()[String(id)]||CAT_FALLBACK[String(id)]||{name:'Categoría',counts:{}}}
function counts(c){return c?.counts||c?.dashboard?.counts||{}}
function logoValue(team){
 const v=state.data?.team_logos?.[team];
 if(typeof v==='string')return v;
 return v?.local||v?.source||FALLBACK_LOGOS[team]||'';
}
function initials(team){return String(team||'?').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase()}
function crest(team,cls=''){
 const u=logoValue(team);
 return u?`<img class="jr60-crest ${cls}" src="${esc(u)}" alt="Escudo ${esc(team)}" loading="lazy" decoding="async">`
         :`<span class="jr60-crest jr60-crest-fallback ${cls}" title="La fuente oficial no publica archivo de escudo">${esc(initials(team))}</span>`;
}
function blocks(kind,c=cat()){return Array.isArray(c?.[kind])?c[kind]:[]}
function rows(kind,c=cat()){return blocks(kind,c).flatMap(b=>(b.rows||[]).map(r=>({h:b.headers||[],r})))}
function col(obj,names,def=''){
 const h=obj.h.map(norm); for(const n of names){const i=h.indexOf(norm(n)); if(i>=0)return obj.r[i]??def} return def;
}
function fixtures(c=cat()){
 return rows('fixtures',c).map(o=>({
  jornada:col(o,['Jornada']),home:col(o,['Local']),hg:col(o,['Goles']),away:col(o,['Visitante']),
  ag:(()=>{const h=o.h.map(norm),idx=h.map((x,i)=>x==='GOLES'?i:-1).filter(i=>i>=0);return idx.length>1?o.r[idx[1]]:''})(),
  field:col(o,['Campo']),date:col(o,['Fecha/Hora','Fecha Hora']),ref:o
 }));
}
function roster(c=cat()){
 const out=[]; Object.entries(c?.rosters||{}).forEach(([team,ps])=>(ps||[]).forEach(name=>out.push({team,name}))); return out;
}
function teams(c=cat()){
 const s=new Set(Object.keys(c?.rosters||{})); fixtures(c).forEach(m=>{if(m.home)s.add(m.home);if(m.away)s.add(m.away)});
 return [...s].filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'));
}
function playerMeta(c=cat()){
 const m=new Map();
 roster(c).forEach(p=>{const u=c?.player_usage?.[norm(p.name)]||{};m.set(norm(p.name),{name:p.name,team:p.team,goals:0,yellow:0,red:0,susp:'',used:Number(u.cedulas)||0})});
 rows('scorers',c).forEach(o=>{const n=col(o,['Jugador']),g=Number(col(o,['Goles']))||0,tm=col(o,['Equipo']);if(!n)return;const k=norm(n),x=m.get(k)||{name:n,team:tm,goals:0,yellow:0,red:0,susp:'',used:0};x.goals=Math.max(x.goals,g);if(tm)x.team=tm;m.set(k,x)});
 rows('cards',c).forEach(o=>{const n=col(o,['Jugador']);if(!n)return;const k=norm(n),x=m.get(k)||{name:n,team:col(o,['Equipo']),goals:0,yellow:0,red:0,susp:'',used:0};const type=norm(col(o,['Tipo'])),num=Number(String(col(o,['Total'])).match(/\d+/)?.[0]||0);if(type.includes('ROJA'))x.red+=num||1;else if(type.includes('AMAR'))x.yellow+=num||1;m.set(k,x)});
 rows('suspensions',c).forEach(o=>{const n=col(o,['Jugador']);if(!n)return;const k=norm(n),x=m.get(k)||{name:n,team:col(o,['Equipo']),goals:0,yellow:0,red:0,susp:'',used:0};x.susp=[col(o,['Castigo']),col(o,['Pendientes'])&&`Pendientes ${col(o,['Pendientes'])}`].filter(Boolean).join(' · ');m.set(k,x)});
 return [...m.values()].sort((a,b)=>a.team.localeCompare(b.team,'es')||a.name.localeCompare(b.name,'es'));
}
function maps(field){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((field||'Campo de futbol')+', Santa Cruz de Juventino Rosas, Guanajuato')}
function status(m){return (String(m.hg).trim()!=='-'&&String(m.ag).trim()!=='-'&&m.hg!==''&&m.ag!=='')?'Jugado':'Pendiente'}
function categoryOptions(){
 const ids=[...new Set([...CAT_ORDER,...Object.keys(cats())])];
 return ids.filter(id=>cats()[id]||CAT_FALLBACK[id]).map(id=>`<option value="${id}" ${id===state.cat?'selected':''}>${esc((cats()[id]||CAT_FALLBACK[id]).name)}</option>`).join('');
}
function tableHtml(kind){
 const bs=blocks(kind); if(!bs.length)return '<div class="jr60-empty">La fuente pública no muestra filas en este reporte.</div>';
 return bs.map(b=>{
   const hs=b.headers||[],teamIndex=hs.map(norm).findIndex(x=>x==='EQUIPO');
   return `<div class="jr60-table-wrap"><table><thead><tr>${hs.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${(b.rows||[]).map(r=>`<tr>${r.map((x,i)=>`<td>${i===teamIndex&&x?`<span class="jr60-table-team">${crest(x,'tiny')}<span>${esc(x)}</span></span>`:esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 }).join('');
}
function renderResumen(){
 const c=cat(),co=counts(c),all=fixtures(c),played=all.filter(m=>status(m)==='Jugado').length,pending=all.filter(m=>status(m)==='Pendiente').length;
 return `<div class="jr60-summary-grid">
  <article><b>${esc(co.Equipos??teams(c).length)}</b><span>Equipos</span></article>
  <article><b>${esc(co['Partidos Jugados']??played)}</b><span>Partidos jugados</span></article>
  <article><b>${esc(co['Partidos Pendientes']??pending)}</b><span>Partidos pendientes</span></article>
  <article><b>${esc(co.Jugadores??roster(c).length)}</b><span>Jugadores registrados</span></article>
 </div>
 <div class="jr60-official-note"><strong>Fuente deportiva pública:</strong> juventinorosasliga.com · ${esc(c.public_names_reconstructed??roster(c).length)} nombres reconstruidos desde cédulas públicas${Number(co.Jugadores)>Number(c.public_names_reconstructed??roster(c).length)?` · ${Number(co.Jugadores)-Number(c.public_names_reconstructed??roster(c).length)} registrado(s) aún sin nombre público visible en cédulas`:''}.</div>
 <div class="jr60-quick-actions"><button data-jr60tab="partidos">Ver partidos</button><button data-jr60tab="jugadores">Ver jugadores</button><button data-jr60tab="tarjetas">Rojas y amarillas</button><button data-jr60tab="castigados">Castigados</button><button data-jr60clima>Clima de campos</button></div>`;
}
function renderEquipos(){
 const c=cat();return `<div class="jr60-team-grid">${teams(c).map(t=>{
  const n=(c.rosters?.[t]||[]).length,ms=fixtures(c).filter(m=>m.home===t||m.away===t),pj=ms.filter(m=>status(m)==='Jugado').length;
  return `<button class="jr60-team-card" data-jr60team="${esc(t)}">${crest(t)}<span><b>${esc(t)}</b><small>${n} jugadores públicos · ${pj} jugados</small></span></button>`;
 }).join('')}</div>`;
}
function renderJugadores(){
 let ps=playerMeta(),q=norm(state.search);if(state.team)ps=ps.filter(x=>x.team===state.team);if(q)ps=ps.filter(x=>norm(x.name+' '+x.team).includes(q));
 return `<div class="jr60-player-toolbar"><select id="jr60Team"><option value="">Todos los equipos</option>${teams().map(t=>`<option ${t===state.team?'selected':''}>${esc(t)}</option>`).join('')}</select><input id="jr60Search" value="${esc(state.search)}" placeholder="Buscar jugador o equipo"></div>
 <div class="jr60-player-grid">${ps.map(p=>`<button class="jr60-player-card" data-jr60player="${esc(p.name)}" data-jr60playerteam="${esc(p.team)}">${crest(p.team)}<span><b>${esc(p.name)}</b><small>${esc(p.team)}</small><em>${p.used?`📝 ${p.used} cédulas `:''}${p.goals?`⚽ ${p.goals}`:''}${p.yellow?` 🟨 ${p.yellow}`:''}${p.red?` 🟥 ${p.red}`:''}${p.susp?` ⛔ ${esc(p.susp)}`:''}</em></span></button>`).join('')}</div>${!ps.length?'<div class="jr60-empty">No hay jugadores con ese filtro.</div>':''}`;
}
function renderPartidos(){
 let ms=fixtures();if(state.team)ms=ms.filter(m=>m.home===state.team||m.away===state.team);const q=norm(state.search);if(q)ms=ms.filter(m=>norm(`${m.home} ${m.away} ${m.field} ${m.date}`).includes(q));
 return `<div class="jr60-player-toolbar"><select id="jr60Team"><option value="">Todos los equipos</option>${teams().map(t=>`<option ${t===state.team?'selected':''}>${esc(t)}</option>`).join('')}</select><input id="jr60Search" value="${esc(state.search)}" placeholder="Buscar equipo, campo o fecha"></div><div class="jr60-fixture-list">${ms.map(m=>`<article class="jr60-fixture"><span class="jr60-jornada">J${esc(m.jornada)}</span><div>${crest(m.home)}<b>${esc(m.home)}</b></div><strong>${status(m)==='Jugado'?`${esc(m.hg)} – ${esc(m.ag)}`:'VS'}</strong><div>${crest(m.away)}<b>${esc(m.away)}</b></div><footer><span>🕒 ${esc(m.date||'Por confirmar')}</span><span>📍 ${esc(m.field||'Campo por confirmar')}</span><a target="_blank" rel="noopener" href="${maps(m.field)}">Cómo llegar</a><button data-jr60clima>Clima</button><span class="jr60-state ${status(m).toLowerCase()}">${status(m)}</span></footer></article>`).join('')}</div>`;
}
function renderBody(){
 if(!hub)return;const body=$('.jr60-body',hub);if(!body)return;
 if(state.tab==='resumen')body.innerHTML=renderResumen();
 else if(state.tab==='equipos')body.innerHTML=renderEquipos();
 else if(state.tab==='jugadores')body.innerHTML=renderJugadores();
 else if(state.tab==='partidos')body.innerHTML=renderPartidos();
 else if(state.tab==='reglamento')body.innerHTML=`<div class="jr60-rules"><h3>Reglamento de la Liga</h3><p>Abre el Reglamento 2026–2027 que ya forma parte de tu plataforma.</p><a class="primary-btn" href="./docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf" target="_blank" rel="noopener">Abrir reglamento PDF</a></div>`;
 else body.innerHTML=tableHtml({posiciones:'standings',goleo:'scorers',tarjetas:'cards',castigados:'suspensions'}[state.tab]||'standings');
 $$('.jr60-tabs button',hub).forEach(b=>b.classList.toggle('active',b.dataset.jr60tab===state.tab));
}
function createHub(){
 if(hub||$('#jr60OfficialHub')){hub=$('#jr60OfficialHub');return}
 const host=$('#view-teams')||$('#view-matches')||$('#view-more')||$('#view-home');if(!host)return;
 hub=document.createElement('section');hub.id='jr60OfficialHub';hub.innerHTML=`
 <div class="jr60-head"><div><span class="jr60-kicker">CENTRAL OFICIAL V38 · ADMINFUT PÚBLICO</span><h2>La liga completa, sin salir de tu página</h2><p>Equipos, escudos, jugadores, partidos, posiciones, goleo, tarjetas y castigados.</p></div><label>Categoría<select id="jr60Cat">${categoryOptions()}</select></label></div>
 <nav class="jr60-tabs"><button data-jr60tab="resumen">Resumen</button><button data-jr60tab="partidos">Partidos</button><button data-jr60tab="equipos">Equipos</button><button data-jr60tab="jugadores">Jugadores</button><button data-jr60tab="posiciones">Posiciones</button><button data-jr60tab="goleo">Goleo</button><button data-jr60tab="tarjetas">Tarjetas</button><button data-jr60tab="castigados">Castigados</button><button data-jr60tab="reglamento">Reglamento</button></nav><div class="jr60-body"></div>`;
 host.appendChild(hub);
 hub.addEventListener('click',e=>{
  const tab=e.target.closest('[data-jr60tab]');if(tab){state.tab=tab.dataset.jr60tab;renderBody();return}
  const team=e.target.closest('[data-jr60team]');if(team){state.team=team.dataset.jr60team;state.tab='jugadores';renderBody();return}
  const player=e.target.closest('[data-jr60player]');if(player){openCredential(player.dataset.jr60player,player.dataset.jr60playerteam);return}
  if(e.target.closest('[data-jr60clima]')){window.JRWeatherV3823?.openMatches?.();window.showView?.('fields');setTimeout(()=>document.getElementById('jr54WeatherHub')?.scrollIntoView({behavior:'smooth'}),100)}
 });
 hub.addEventListener('change',e=>{
  if(e.target.id==='jr60Cat'){state.cat=e.target.value;state.team='';state.search='';renderBody();patchCategoryCards();patchTeamLogos()}
  if(e.target.id==='jr60Team'){state.team=e.target.value;renderBody()}
 });
 hub.addEventListener('input',e=>{if(e.target.id==='jr60Search'){state.search=e.target.value;clearTimeout(hub.__jr60t);hub.__jr60t=setTimeout(renderBody,120)}});
 renderBody();
}
function patchCategoryCards(){
 const data=cats();
 $$('article,button,a,div').forEach(el=>{
  if(el.closest('#jr60OfficialHub')||el.closest('.team-card,.club-card,[data-team]'))return;
  const t=norm(el.textContent);let id=null;
  for(const x of CAT_ORDER){const c=data[x]||CAT_FALLBACK[x];if(c&&t.includes(norm(c.name))&&(t.includes('EQUIP')||/category|categoria|cat-card/i.test(el.className||''))){id=x;break}}
  if(!id||el.dataset.jr60Category)return;
  const c=data[id]||CAT_FALLBACK[id],co=counts(c);el.dataset.jr60Category=id;
  const meta=document.createElement('span');meta.className='jr60-category-meta';meta.textContent=`${co.Equipos??'—'} equipos · ${co.Jugadores??'—'} jugadores · ${co['Partidos Jugados']??'—'} jugados · ${co['Partidos Pendientes']??'—'} pendientes`;
  el.appendChild(meta);
  if(id==='3'&&!el.querySelector('.jr59-primera-logo-img')){ /* FIX24/FIX27 handles category crest */ }
 });
}
function patchTeamLogos(){
 const ts=new Set();Object.values(cats()).forEach(c=>teams(c).forEach(t=>ts.add(t)));Object.keys(FALLBACK_LOGOS).forEach(t=>ts.add(t));
 const sorted=[...ts].sort((a,b)=>b.length-a.length);
 $$('.team-card,.club-card,.v32-team-inline,[data-team],#view-teams article,#view-matches article').forEach(el=>{
  if(el.closest('#jr60OfficialHub'))return;
  const txt=norm(el.textContent),team=sorted.find(t=>txt.includes(norm(t)));if(!team||el.dataset.jr60Logo)return;
  const url=logoValue(team);if(!url){el.dataset.jr60Logo='placeholder';return}
  let img=el.querySelector('img:not(.jr59-primera-logo-img)');if(!img){img=document.createElement('img');img.className='jr60-injected-team-logo';el.insertBefore(img,el.firstChild)}
  img.src=url;img.alt=`Escudo ${team}`;img.removeAttribute('srcset');img.loading='lazy';el.dataset.jr60Logo='1';
 });
}
function openCredential(name,team){
 $('#jr60CredentialModal')?.remove();const c=cat(),p=playerMeta(c).find(x=>norm(x.name)===norm(name))||{name,team,goals:0,yellow:0,red:0,susp:''};
 const modal=document.createElement('div');modal.id='jr60CredentialModal';modal.className='jr60-modal';modal.innerHTML=`<div class="jr60-modal-card"><button class="jr60-close" aria-label="Cerrar">×</button><div class="jr60-credential"><div class="jr60-credential-bg"></div><div class="jr60-credential-title">Liga Municipal de Futbol<br>Juventino Rosas, A.C.</div><div class="jr60-credential-cat">${esc(c.name)}</div><div class="jr60-credential-photo">${crest(team,'big')}</div><div class="jr60-credential-team">${esc(team)}</div><div class="jr60-credential-name">${esc(name)}</div><div class="jr60-credential-stats">${p.goals?`⚽ ${p.goals} `:''}${p.yellow?`🟨 ${p.yellow} `:''}${p.red?`🟥 ${p.red} `:''}${p.susp?`⛔ ${esc(p.susp)}`:''}</div><div class="jr60-credential-brand">V38 · CREDENCIAL DIGITAL</div></div><p class="jr60-credential-note">Diseño digital inspirado en las credenciales que proporcionaste. La foto personal se agrega desde el registro privado; aquí no se publica CURP, INE ni documentos.</p><button class="primary-btn jr60-register">Abrir registro con OCR</button></div>`;
 document.body.appendChild(modal);modal.querySelector('.jr60-close').onclick=()=>modal.remove();modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});modal.querySelector('.jr60-register').onclick=()=>{modal.remove();document.getElementById('jr44OpenRegister')?.click()};
}
async function load(){
 let d=null;try{const r=await fetch(`./data/official-live.json?build=${BUILD}&t=${Date.now()}`,{cache:'no-store'});if(r.ok)d=await r.json()}catch(_){}
 if(!d)d={schema:2,categories:{},team_logos:{},notes:['Snapshot oficial no disponible todavía.']};
 state.data=d;
 for(const [id,v] of Object.entries(CAT_FALLBACK)){if(!state.data.categories[id])state.data.categories[id]={id:Number(id),...v,rosters:{},fixtures:[],standings:[],scorers:[],cards:[],suspensions:[]}}
 createHub();patchCategoryCards();patchTeamLogos();
 document.documentElement.dataset.jr60Official='ready';
}
function schedule(){[0,150,600,1600].forEach(ms=>setTimeout(()=>{createHub();patchCategoryCards();patchTeamLogos()},ms))}
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-view],nav,button,a'))setTimeout(schedule,60)},{passive:true});
window.JR60Official={build:BUILD,refresh:load,open:()=>{window.showView?.('teams');setTimeout(()=>{createHub();hub?.scrollIntoView({behavior:'smooth',block:'start'})},100)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();