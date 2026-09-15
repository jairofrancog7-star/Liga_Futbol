/* V38 FIX58 — logos oficiales de categoría + cruces completos por categoría/jornada */
(()=>{'use strict';
if(window.__JR58)return; window.__JR58=true;
const BUILD='38-58-r1';
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
const FALLBACK_LOGOS={
 'franco fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7',
 'hermanos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh',
 'lobos cdg':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib',
 'juventus':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b',
 'galacticos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Galacticos_olurwb',
 'san jose fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d',
 'napoli':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv',
 'herreras fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/HerreraFC_mnmlsd',
 'linces':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c',
 'abejas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Abejas_lxn6l9',
 'terricolas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Terricolas_ltbrzy',
 'populares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt',
 'malvinas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9',
 'aldama fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Aldama_mqm3r1',
 'atl galeana':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Galeana_kujrh0',
 'capibaras':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl',
 'mazacotes fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Mazacotes_ko8o0w',
 'promesas fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PromesasFC_w4lwk8',
 'la cuadrilla':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CuadrillaFC_vpfbtr',
 'la huerta':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaHuertaCuenda_bm4fxj',
 'la canchita deportes':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaCanchita_enf6ca',
 'osasuna':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa',
 'dep maravillas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx',
 'san antonio jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioJR_jzmfka',
 'boavista':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_qiq0dy',
 'manchester':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/ManchesterU_zltkh0',
 'toros de cuenda':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TorosCuenda_od8vcf',
 'la esperanza':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaEsperanzaFC_vazya7',
 'dynamo':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dinamo_rgamvy'
};
const state={data:null,cat:'3',jornada:'all',status:'all'};
function catObj(id=state.cat){return state.data?.categories?.[String(id)]||{}}
function categoryName(id){return catObj(id)?.name||CAT_META[id]?.name||'Categoría'}
function logoValue(team){
 const all=state.data?.team_logos||{}; const wanted=norm(team);
 for(const [name,v] of Object.entries(all)){
   if(norm(name)!==wanted)continue;
   if(typeof v==='string')return v;
   return v?.local||v?.path||v?.source||'';
 }
 return FALLBACK_LOGOS[wanted]||'';
}
function initials(team){return String(team||'?').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase()}
function crest(team){const src=logoValue(team);return src?`<img class="jr58-team-logo" src="${esc(src)}" alt="Escudo ${esc(team)}" loading="lazy" decoding="async">`:`<span class="jr58-team-logo jr58-fallback">${esc(initials(team))}</span>`}
function parseFixtures(c){
 const out=[];
 for(const block of (Array.isArray(c?.fixtures)?c.fixtures:[])){
   const hs=(block.headers||[]).map(norm); const g=hs.map((x,i)=>x==='goles'?i:-1).filter(i=>i>=0);
   for(const r of (block.rows||[])){
     const get=(names,def='')=>{for(const n of names){const i=hs.indexOf(norm(n));if(i>=0)return r[i]??def}return def};
     out.push({
       no:get(['#']), jornada:String(get(['Jornada'])), home:get(['Local']), hg:g.length?String(r[g[0]]??''):'',
       away:get(['Visitante']), ag:g.length>1?String(r[g[1]]??''):'', field:get(['Campo']), date:get(['Fecha/Hora','Fecha Hora']), referee:get(['Árbitro','Arbitro'])
     });
   }
 }
 return out.filter(m=>m.home||m.away);
}
function played(m){return !['','-','—'].includes(String(m.hg).trim())&&!['','-','—'].includes(String(m.ag).trim())}
function score(m){return played(m)?`${esc(m.hg)} : ${esc(m.ag)}`:'VS'}
function mapHref(field){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((field||'Campo de futbol')+', Santa Cruz de Juventino Rosas, Guanajuato')}
function categoryLogo(id){return CAT_META[id]?.logo||''}
function syncLegacyCategory(id){
 const name=categoryName(id); const n=norm(name);
 const legacy=$$('#categoryBar [data-category],#categoryBar button').find(x=>norm(x.dataset.category||x.textContent)===n);
 if(legacy)try{legacy.click()}catch(_){}
 try{localStorage.setItem('jrCategory',name)}catch(_){}
}
function patchCategoryCards(){
 $$('#jr53TopCategoryHost .jr81-cat-btn,[data-jr81-category]').forEach(card=>{
   const raw=card.dataset.category||card.dataset.jr81Category||$('.jr81-cat-title',card)?.textContent||card.textContent;
   const id=CAT_ORDER.find(i=>norm(CAT_META[i].name)===norm(raw)); if(!id)return;
   let icon=$('.jr81-cat-icon',card); if(!icon){icon=document.createElement('span');icon.className='jr81-cat-icon';card.prepend(icon)}
   let img=$('img',icon); if(!img){img=document.createElement('img');icon.replaceChildren(img)}
   img.src=categoryLogo(id)+'?v='+BUILD;img.alt='Logo '+CAT_META[id].name;
 });
}
function categoryButtons(){
 return CAT_ORDER.map(id=>`<button type="button" class="jr58-cat ${id===state.cat?'active':''}" data-jr58-cat="${id}"><img src="${esc(categoryLogo(id))}?v=${BUILD}" alt=""><span>${esc(categoryName(id))}</span></button>`).join('');
}
function jornadaButtons(ms){
 const js=[...new Set(ms.map(m=>m.jornada).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
 return `<button type="button" class="jr58-j ${state.jornada==='all'?'active':''}" data-jr58-j="all">Todas</button>`+js.map(j=>`<button type="button" class="jr58-j ${state.jornada===j?'active':''}" data-jr58-j="${esc(j)}">J${esc(j)}</button>`).join('');
}
function filterMatches(ms){
 let out=ms;
 if(state.jornada!=='all')out=out.filter(m=>m.jornada===state.jornada);
 if(state.status==='played')out=out.filter(played);
 if(state.status==='pending')out=out.filter(m=>!played(m));
 return out;
}
function matchCard(m){
 const done=played(m); const field=m.field&&m.field!=='-'?m.field:'Campo por confirmar';
 return `<article class="jr58-match ${done?'played':'pending'}">
   <div class="jr58-match-top"><span>Jornada ${esc(m.jornada||'—')}</span><b>${done?'FINALIZADO':'PROGRAMADO'}</b></div>
   <div class="jr58-versus">
    <div class="jr58-team">${crest(m.home)}<strong>${esc(m.home||'Local')}</strong></div>
    <div class="jr58-score">${score(m)}</div>
    <div class="jr58-team">${crest(m.away)}<strong>${esc(m.away||'Visitante')}</strong></div>
   </div>
   <div class="jr58-meta"><span>🕒 ${esc(m.date||'Fecha por confirmar')}</span><span>📍 ${esc(field)}</span></div>
   <div class="jr58-actions"><a href="${mapHref(field)}" target="_blank" rel="noopener">Cómo llegar</a><button type="button" data-jr58-clima="${esc(field)}">Clima</button><a href="./cedulas.html" class="jr58-cedula">Cédula oficial</a></div>
  </article>`;
}
function render(){
 const host=$('#jr58MatchCenter'); if(!host||!state.data)return;
 const all=parseFixtures(catObj()), ms=filterMatches(all);
 host.innerHTML=`<div class="jr58-head"><div><small>LIGA JUVENTINO ROSAS · TORNEO DE COPA 2026</small><h3>Cruces por categoría y jornada</h3><p>${esc(categoryName(state.cat))} · ${all.length} partidos cargados</p></div><div class="jr58-status"><button data-jr58-status="all" class="${state.status==='all'?'active':''}">Todos</button><button data-jr58-status="played" class="${state.status==='played'?'active':''}">Jugados</button><button data-jr58-status="pending" class="${state.status==='pending'?'active':''}">Próximos</button></div></div>
 <div class="jr58-cats">${categoryButtons()}</div>
 <div class="jr58-rounds" aria-label="Filtro de jornada">${jornadaButtons(all)}</div>
 <div class="jr58-list">${ms.length?ms.map(matchCard).join(''):'<div class="jr58-empty">No hay partidos para este filtro.</div>'}</div>`;
 bind();
}
function bind(){
 const host=$('#jr58MatchCenter'); if(!host)return;
 $$('[data-jr58-cat]',host).forEach(b=>b.onclick=()=>{state.cat=b.dataset.jr58Cat;state.jornada='all';syncLegacyCategory(state.cat);render();patchCategoryCards()});
 $$('[data-jr58-j]',host).forEach(b=>b.onclick=()=>{state.jornada=b.dataset.jr58J;render()});
 $$('[data-jr58-status]',host).forEach(b=>b.onclick=()=>{state.status=b.dataset.jr58Status;render()});
 $$('[data-jr58-clima]',host).forEach(b=>b.onclick=()=>{try{window.JRFieldsV38?.navigate?.()}catch(_){};const btn=document.querySelector('[data-view="weather"],[data-view="fields"]');if(btn)btn.click()});
}
async function loadData(){
 if(state.data)return state.data;
 try{const r=await fetch('./data/official-live.json?fix='+BUILD+'&t='+Date.now(),{cache:'no-store'});if(r.ok)state.data=await r.json()}catch(_){}
 return state.data;
}
async function ensureMatchCenter(){
 const view=$('#view-matches'); if(!view)return;
 let host=$('#jr58MatchCenter',view);
 if(!host){host=document.createElement('section');host.id='jr58MatchCenter';host.className='jr58-center';const title=$('.section-title',view);if(title)title.insertAdjacentElement('afterend',host);else view.prepend(host)}
 if(!state.data){host.innerHTML='<div class="jr58-loading">Cargando cruces oficiales…</div>';await loadData()}
 if(state.data)render(); else host.innerHTML='<div class="jr58-empty">No se pudieron cargar los partidos. Actualiza la página.</div>';
}
function fixNav(){
 $$('.nav-btn').forEach(b=>{const v=norm(b.dataset.view);if(v==='stats')b.textContent='Estadísticas';if(v==='more')b.textContent='Más'});
}
let queued=0;function run(){patchCategoryCards();fixNav();ensureMatchCenter()}
function schedule(){clearTimeout(queued);queued=setTimeout(run,120)}
function start(){run();[300,900,1800,4000,8000].forEach(t=>setTimeout(run,t));new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});addEventListener('hashchange',schedule);addEventListener('pageshow',schedule)}
window.JRFix58={build:BUILD,refresh:run};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
