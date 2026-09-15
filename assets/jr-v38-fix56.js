/* V38 FIX56 — correcciones solicitadas 2026-09-15 */
(()=>{'use strict';
if(window.__JR56)return;window.__JR56=true;
const BUILD='38-56-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+.\s]/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CATEGORY_LOGOS={
 'primera fuerza':'./assets/branding/primera-fuerza-hd.png?v='+BUILD,
 'intermedia':'./assets/categories/intermedia.webp?v='+BUILD,
 'segunda fuerza':'./assets/categories/segunda-fuerza.webp?v='+BUILD,
 'veteranos 35+':'./assets/categories/veteranos-35.webp?v='+BUILD,
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

const CREDENTIALS=[
 {cat:'Segunda Fuerza',team:'Tapatio',name:'Rafael Torres',src:'./assets/credential-references/segunda-tapatio-rafael-torres.webp?v='+BUILD},
 {cat:'Categoría por confirmar',team:'Cuenda',name:'Abel Linares Cuevas',src:'./assets/credential-references/primera-cuenda-abel-linares-cuevas.webp?v='+BUILD},
 {cat:'Intermedia',team:'Malvinas',name:'Santiago Godínez',src:'./assets/credential-references/intermedia-malvinas-santiago-godinez.webp?v='+BUILD},
 {cat:'Veteranos 35+',team:'Pozos',name:'Fernando Palma Morales',src:'./assets/credential-references/veteranos35-pozos-fernando-palma-morales.webp?v='+BUILD},
 {cat:'Intermedia',team:'La Huerta',name:'Juan Hortelano',src:'./assets/credential-references/intermedia-la-huerta-juan-hortelano.webp?v='+BUILD},
 {cat:'Veteranos 35+',team:'PSV',name:'Martín Guerrero García',src:'./assets/credential-references/veteranos35-psv-martin-guerrero-garcia.webp?v='+BUILD},
 {cat:'Veteranos',team:'Pozos FC',name:'Julio César Pardini',src:'./assets/credential-references/veteranos-pozos-julio-cesar-pardini.webp?v='+BUILD}
];

function teamLogo(name){
 const k=norm(name);
 return TEAM_LOGOS[k]||TEAM_LOGOS[k.replace(/^fc\s+/,'')]||'';
}

function patchCategoryCards(){
 const home=$('#view-home');
 if(home){
   const small=$('#categoryBar',home); if(small)small.style.setProperty('display','none','important');
   $$('.v21-category-tabs',home).forEach(el=>el.style.setProperty('display','none','important'));
 }
 $$('.jr81-cat-btn,[data-jr81-category]').forEach(card=>{
   const cat=card.dataset.category||card.dataset.jr81Category||'';
   const src=CATEGORY_LOGOS[norm(cat)];
   if(!src)return;
   let icon=$('.jr81-cat-icon',card);
   if(!icon){icon=document.createElement('span');icon.className='jr81-cat-icon';card.prepend(icon)}
   let img=$('img',icon);
   if(!img){img=document.createElement('img');icon.replaceChildren(img)}
   if(img.getAttribute('src')!==src)img.src=src;
   img.alt=cat;
 });
}

function getTeamNameFromCell(cell){
 if(!cell)return'';
 const clone=cell.cloneNode(true);
 clone.querySelectorAll('img,.jr56-team-logo').forEach(x=>x.remove());
 return clone.textContent.replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').replace(/\s+/g,' ').trim();
}
function decorateTeamElement(el,name){
 const src=teamLogo(name); if(!src||!el)return;
 if(el.querySelector(':scope > .jr56-team-logo'))return;
 const old=el.textContent.replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').replace(/\s+/g,' ').trim();
 el.textContent='';
 el.classList.add('jr56-team-name');
 const img=document.createElement('img');img.className='jr56-team-logo';img.src=src;img.alt=name;
 const span=document.createElement('span');span.textContent=old||name;
 el.append(img,span);
}
function patchStandings(){
 const view=$('#view-table'); if(!view)return;
 $$('tbody tr',view).forEach(tr=>{
   const tds=$$('td',tr); if(tds.length<2)return;
   const cell=tds[1], name=getTeamNameFromCell(cell);
   const strong=$('strong',cell)||cell;
   if(teamLogo(name))decorateTeamElement(strong,name);
 });
 $$('strong,b,h3,h4,.team-name,[data-team],.v25-summary-team',view).forEach(el=>{
   if(el.closest('table'))return;
   const text=el.dataset.team||el.textContent||'';
   const clean=text.replace(/[🟢⚪🔵🟡🟠🔴🟣⚫🟤]/g,'').trim();
   if(teamLogo(clean))decorateTeamElement(el,clean);
 });
 $$('*',view).forEach(el=>{
   if(el.children.length===0 && /^[\s🟢⚪🔵🟡🟠🔴🟣⚫🟤]+$/.test(el.textContent||'')){
     const p=el.parentElement; const txt=p?.textContent||'';
     if(Object.keys(TEAM_LOGOS).some(k=>norm(txt).includes(norm(k)))) el.remove();
   }
 });
}

function renderCredentials(){
 const view=$('#view-credential'); if(!view||$('#jr56CredentialGallery',view))return;
 const host=document.createElement('section');host.id='jr56CredentialGallery';
 const groups=[...new Set(CREDENTIALS.map(x=>x.cat))];
 const cats=['Todas',...groups];
 host.innerHTML=`
  <div class="jr56-cred-head">
   <div><h3>Credenciales Liga Municipal</h3><p>Imágenes de referencia aportadas por la liga, clasificadas por categoría.</p></div>
  </div>
  <div class="jr56-cred-filters">${cats.map((c,i)=>`<button type="button" class="jr56-cred-filter ${i===0?'active':''}" data-jr56-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <div class="jr56-cred-groups">${groups.map(cat=>`
    <section class="jr56-cred-group" data-jr56-group="${esc(cat)}">
      <h4>${esc(cat)}</h4>
      <div class="jr56-cred-grid">${CREDENTIALS.filter(x=>x.cat===cat).map(x=>`
        <a class="jr56-cred-card" href="${x.src}" target="_blank" rel="noopener">
          <img src="${x.src}" alt="Credencial de ${esc(x.name)} - ${esc(x.team)} - ${esc(x.cat)}" loading="lazy">
          <span class="jr56-cred-meta"><b>${esc(x.name)}</b><span>${esc(x.team)} · ${esc(x.cat)}</span></span>
        </a>`).join('')}
      </div>
    </section>`).join('')}</div>`;
 const title=$('.section-title',view);
 if(title)title.insertAdjacentElement('afterend',host); else view.prepend(host);
 host.addEventListener('click',e=>{
   const b=e.target.closest('[data-jr56-filter]');if(!b)return;
   const f=b.dataset.jr56Filter;
   $$('.jr56-cred-filter',host).forEach(x=>x.classList.toggle('active',x===b));
   $$('.jr56-cred-group',host).forEach(g=>g.style.display=(f==='Todas'||g.dataset.jr56Group===f)?'':'none');
 });
}

function ensureCedulaPanel(){
 const view=$('#view-matches'); if(!view)return;
 if($('#jr56CedulaToolbar',view))return;
 const title=$('.section-title',view);
 const toolbar=document.createElement('div');toolbar.id='jr56CedulaToolbar';
 toolbar.innerHTML='<button type="button" id="jr56CedulasBtn">📋 Cédulas oficiales</button>';
 const panel=document.createElement('section');panel.id='jr56CedulaPanel';
 panel.innerHTML='<div class="jr56-cedula-title"><h3>Cédulas oficiales de partidos</h3><span>Fuente deportiva pública</span></div><div class="jr56-cedula-list"><div class="jr56-cedula-item"><strong>Cargando…</strong></div></div>';
 if(title){title.insertAdjacentElement('afterend',toolbar);toolbar.insertAdjacentElement('afterend',panel)}else{view.prepend(panel);view.prepend(toolbar)}
 $('#jr56CedulasBtn',toolbar)?.addEventListener('click',async()=>{
   panel.classList.toggle('open');
   if(panel.dataset.loaded)return;
   panel.dataset.loaded='1';
   try{
     const r=await fetch('./data/official-live.json?fix='+BUILD,{cache:'no-store'});
     const data=await r.json();
     const rows=[];
     Object.values(data.categories||{}).forEach(c=>{
       const ids=c?.dashboard?.current_cedulas||[];
       ids.forEach(id=>rows.push({id,cat:c.name||'Categoría'}));
     });
     rows.sort((a,b)=>a.cat.localeCompare(b.cat)||a.id-b.id);
     $('.jr56-cedula-list',panel).innerHTML=rows.length?rows.map(x=>`
       <a class="jr56-cedula-item" href="https://www.juventinorosasliga.com/cedula-arbitral/${encodeURIComponent(x.id)}/" target="_blank" rel="noopener">
        <strong>Cédula oficial #${x.id}</strong><span>${esc(x.cat)}</span><em>Ver cédula →</em>
       </a>`).join(''):'<div class="jr56-cedula-item"><strong>No hay cédulas actuales publicadas.</strong></div>';
   }catch(err){
     $('.jr56-cedula-list',panel).innerHTML='<div class="jr56-cedula-item"><strong>No se pudieron cargar las cédulas.</strong><span>Intenta actualizar la página.</span></div>';
   }
 });
}

function patchBottomNav(){
 $$('.nav-btn').forEach(b=>{
   if(norm(b.dataset.view)==='stats')b.textContent='Estadísticas';
   if(norm(b.dataset.view)==='more')b.textContent='Más';
 });
}

let t=0;
function run(){patchCategoryCards();patchStandings();renderCredentials();ensureCedulaPanel();patchBottomNav();document.documentElement.dataset.jr56='ready'}
function queue(){clearTimeout(t);t=setTimeout(run,80)}
function start(){
 run();
 [150,400,900,1600,3000,6000].forEach(ms=>setTimeout(run,ms));
 const mo=new MutationObserver(queue);mo.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',()=>setTimeout(run,80),true);
 addEventListener('hashchange',queue);addEventListener('pageshow',queue);addEventListener('focus',queue);
}
window.JRFix56={build:BUILD,refresh:run};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();