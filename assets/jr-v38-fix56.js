/* V38 FIX57 — restore internal cedulas, digital credential design, category buttons/logos */
(()=>{'use strict';
if(window.__JR57)return;window.__JR57=true;
const BUILD='38-57-r1';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+.\s]/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CATEGORY_LOGOS={
 'primera fuerza':'./assets/branding/primera-fuerza-hd.png?v='+BUILD,
 'intermedia':'./assets/categories/intermedia.webp?v='+BUILD,
 'segunda fuerza':'./assets/categories/segunda-fuerza.webp',
 'veteranos 35+':'./assets/categories/veteranos-35-user.png',
 'veteranos 50+':'./assets/categories/veteranos-50.webp?v='+BUILD
};
const TEAM_LOGOS={
 'c. de gasca':'./assets/teams/deportivo-cg.webp?v='+BUILD,
 'c de gasca':'./assets/teams/deportivo-cg.webp?v='+BUILD,
 'cerrito de gasca':'./assets/teams/deportivo-cg.webp?v='+BUILD,
 'juventus':'./assets/teams/juventus.webp?v='+BUILD,
 'cuenda':'./assets/teams/tc-cuenda.webp?v='+BUILD,
 'pozos fc':'./assets/teams/pozos-fc.webp?v='+BUILD,
 'pozos':'./assets/teams/pozos-fc.webp?v='+BUILD,
 'boavista':'./assets/teams/boavista-fc.webp?v='+BUILD,
 'psv':'./assets/teams/psv.webp?v='+BUILD,
 'america':'./assets/branding/america-veteranos-35-user.png?v='+BUILD,
 'américa':'./assets/branding/america-veteranos-35-user.png?v='+BUILD
};
function teamLogo(name){const k=norm(name);return TEAM_LOGOS[k]||TEAM_LOGOS[k.replace(/^fc\s+/,'')]||''}

function patchCategories(){
 const bar=$('#categoryBar'); if(bar){bar.hidden=true;bar.setAttribute('aria-hidden','true')}
 $$('.v21-category-tabs,.jr53-small-category-row').forEach(x=>{if(!x.closest('#view-admin'))x.style.setProperty('display','none','important')});
 $$('#jr53TopCategoryHost .jr81-cat-btn,[data-jr81-category]').forEach(card=>{
   const cat=card.dataset.category||card.dataset.jr81Category||'';
   const src=CATEGORY_LOGOS[norm(cat)];
   if(!src)return;
   let icon=$('.jr81-cat-icon',card);
   if(!icon){icon=document.createElement('span');icon.className='jr81-cat-icon';card.prepend(icon)}
   let img=$('img',icon);
   if(!img){img=document.createElement('img');icon.replaceChildren(img)}
   img.src=src; img.alt='Logo '+cat;
 });
}

function getTeamNameFromCell(cell){
 if(!cell)return'';
 const clone=cell.cloneNode(true);
 clone.querySelectorAll('img,.jr56-team-logo,.jr57-team-logo').forEach(x=>x.remove());
 return clone.textContent.replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').replace(/\s+/g,' ').trim();
}
function decorateTeamElement(el,name){
 const src=teamLogo(name); if(!src||!el)return;
 if(el.querySelector(':scope > .jr57-team-logo,:scope > .jr56-team-logo'))return;
 const old=el.textContent.replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').replace(/\s+/g,' ').trim();
 el.textContent='';el.classList.add('jr57-team-name');
 const img=document.createElement('img');img.className='jr57-team-logo';img.src=src;img.alt='';
 const span=document.createElement('span');span.textContent=old||name;el.append(img,span);
}
function patchStandings(){
 const view=$('#view-table'); if(!view)return;
 $$('tbody tr',view).forEach(tr=>{const tds=$$('td',tr);if(tds.length<2)return;const cell=tds[1],name=getTeamNameFromCell(cell);const strong=$('strong',cell)||cell;if(teamLogo(name))decorateTeamElement(strong,name)});
 $$('strong,b,h3,h4,.team-name,[data-team],.v25-summary-team',view).forEach(el=>{if(el.closest('table'))return;const clean=(el.dataset.team||el.textContent||'').replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').trim();if(teamLogo(clean))decorateTeamElement(el,clean)});
}

function patchCredential(){
 $('#jr56CredentialGallery')?.remove();
 const card=$('#credentialCard'); if(!card)return;
 if(card.dataset.jr57==='1')return;
 card.dataset.jr57='1';
 let category='Primera Fuerza';try{category=window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||category}catch(_){}
 const catLogo=CATEGORY_LOGOS[norm(category)]||CATEGORY_LOGOS['primera fuerza'];
 card.innerHTML=`
  <div class="jr57-id-top">
    <img class="jr57-league-logo" src="./assets/liga-logo.webp?v=${BUILD}" alt="Liga Juventino Rosas">
    <div><small>LIGA MUNICIPAL DE FÚTBOL</small><strong>JUVENTINO ROSAS A.C.</strong><span>CREDENCIAL DIGITAL DE JUGADOR</span></div>
    <img class="jr57-cat-logo" src="${catLogo}" alt="${esc(category)}">
  </div>
  <div class="jr57-id-body">
    <div class="jr57-photo"><span aria-hidden="true">👤</span><small>FOTO DEL JUGADOR</small></div>
    <div class="jr57-fields">
      <label>NOMBRE<b>Jugador destacado</b></label>
      <label>EQUIPO<b>Pozos FC</b></label>
      <div class="jr57-two"><label>CATEGORÍA<b>${esc(category)}</b></label><label>TEMPORADA<b>2026–27</b></label></div>
      <div class="jr57-two"><label>FOLIO<b>LJR-00471</b></label><label>ESTATUS<b class="jr57-enabled">HABILITADO</b></label></div>
    </div>
    <div class="jr57-qr" id="qrBox" aria-label="Código visual de credencial"></div>
  </div>
  <div class="jr57-id-foot"><span>Documento digital de la Liga Juventino Rosas</span><b>Validación interna</b></div>`;
}

function localCedulaHref(id){return './cedulas.html'+(id?'?cedula='+encodeURIComponent(id):'')}
function rewriteCedulaLinks(root=document){
 $$('a[href*="cedula-arbitral/"]',root).forEach(a=>{
   const id=(a.getAttribute('href')||'').match(/cedula-arbitral\/(\d+)/)?.[1]||'';
   a.href=localCedulaHref(id);a.removeAttribute('target');a.rel='';
   if(/c[eé]dula/i.test(a.textContent||''))a.title='Abrir cédula dentro de Liga Juventino Rosas';
 });
}
function cedulaRows(data){
 const rows=[];
 Object.values(data.categories||{}).forEach(c=>{
   const full=Array.isArray(c.cedulas)?c.cedulas:[];
   if(full.length){full.forEach(x=>rows.push({id:x.id,cat:c.name||'Categoría',local:x.local||'',away:x.away||'',when:x.when||x.fecha||''}));return}
   const ids=c?.dashboard?.current_cedulas||[];
   ids.forEach(id=>rows.push({id,cat:c.name||'Categoría',local:'',away:'',when:''}));
 });
 const seen=new Set();
 return rows.filter(x=>x.id&&!seen.has(String(x.id))&&seen.add(String(x.id))).sort((a,b)=>a.cat.localeCompare(b.cat,'es')||Number(a.id)-Number(b.id));
}
function ensureCedulas(){
 $('#jr56CedulaToolbar')?.remove();$('#jr56CedulaPanel')?.remove();
 const view=$('#view-matches');if(!view||$('#jr57CedulaToolbar',view))return;
 const title=$('.section-title',view);
 const toolbar=document.createElement('div');toolbar.id='jr57CedulaToolbar';
 toolbar.innerHTML='<button type="button" id="jr57CedulasBtn">📋 Cédulas oficiales de la liga</button><a href="./cedulas.html" class="jr57-generate">＋ Generar cédula</a>';
 const panel=document.createElement('section');panel.id='jr57CedulaPanel';
 panel.innerHTML='<div class="jr57-cedula-title"><div><small>LIGA JUVENTINO ROSAS</small><h3>Cédulas de partidos</h3></div><span>Se abren dentro de esta página</span></div><div class="jr57-cedula-list"><div class="jr57-cedula-item"><strong>Cargando…</strong></div></div>';
 if(title){title.insertAdjacentElement('afterend',toolbar);toolbar.insertAdjacentElement('afterend',panel)}else{view.prepend(panel);view.prepend(toolbar)}
 $('#jr57CedulasBtn',toolbar)?.addEventListener('click',async()=>{
   panel.classList.toggle('open');if(panel.dataset.loaded)return;panel.dataset.loaded='1';
   try{
     const r=await fetch('./data/official-live.json?fix='+BUILD,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);
     const rows=cedulaRows(await r.json());
     $('.jr57-cedula-list',panel).innerHTML=rows.length?rows.map(x=>`
      <a class="jr57-cedula-item" href="${localCedulaHref(x.id)}">
       <strong>Cédula #${esc(x.id)}</strong>
       <span>${esc(x.cat)}</span>
       <b>${x.local||x.away?esc((x.local||'Local')+' vs '+(x.away||'Visitante')):'Partido registrado'}</b>
       <em>Ver cédula propia →</em>
      </a>`).join(''):'<div class="jr57-cedula-item"><strong>No hay cédulas disponibles.</strong></div>';
   }catch(err){$('.jr57-cedula-list',panel).innerHTML='<div class="jr57-cedula-item"><strong>No se pudieron cargar las cédulas.</strong><span>Actualiza la página e inténtalo de nuevo.</span></div>'}
 });
}
function patchBottomNav(){
 $$('.nav-btn').forEach(b=>{
   if(norm(b.dataset.view)==='stats' && b.textContent!=='Estadísticas')b.textContent='Estadísticas';
   if(norm(b.dataset.view)==='more' && b.textContent!=='Más')b.textContent='Más';
 });
}
function run(){
 patchCategories();patchStandings();patchCredential();ensureCedulas();rewriteCedulaLinks();patchBottomNav();
 document.documentElement.dataset.jr57='ready';
}
let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(run,80)}
function start(){
 run();[120,350,800,1600,3000,6000,10000].forEach(ms=>setTimeout(run,ms));
 const mo=new MutationObserver(queue);mo.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{
   const a=e.target.closest?.('a[href*="cedula-arbitral/"]');if(a){e.preventDefault();e.stopImmediatePropagation();const id=(a.getAttribute('href')||'').match(/cedula-arbitral\/(\d+)/)?.[1]||'';location.href=localCedulaHref(id);return}
   setTimeout(run,60);
 },true);
 addEventListener('hashchange',queue);addEventListener('pageshow',queue);addEventListener('focus',queue);
}
window.JRFix57={build:BUILD,refresh:run};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();