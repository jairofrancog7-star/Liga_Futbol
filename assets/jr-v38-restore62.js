/* V38.62 — restauración visual: tabla física + estadísticas + banners estáticos, sin reemplazar datos reales. */
(()=>{'use strict';
if(window.__JR62Restore)return;window.__JR62Restore=true;
const BUILD='38-62-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();

const META={
 '3':{name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
 '5':{name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
 '4':{name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
 '2':{name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
 '1':{name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
};
const BYNAME=Object.fromEntries(Object.entries(META).map(([id,m])=>[norm(m.name),id]));

const FALLBACK_35=[
 ['1','C. de Gasca','17','13','1','3','54','17','37','40',['G','G','G','P','G']],
 ['2','Juventus','17','10','4','3','47','27','20','34',['G','G','E','G','P']],
 ['3','Cuenda','17','11','0','6','41','22','19','33',['G','P','G','G','P']],
 ['4','Pozos FC','17','10','2','5','48','36','12','32',['P','G','E','G','G']],
 ['5','Boavista','17','8','3','6','38','27','11','27',['G','E','P','G','P']],
 ['6','PSV','17','9','0','8','49','40','9','27',['P','P','G','P','G']],
 ['7','A. Santiago','17','7','1','9','36','57','-21','22',['G','P','P','G','P']],
 ['8','F. Tavera','17','4','2','11','27','50','-23','14',['P','P','G','P','P']],
 ['9','América','17','4','1','12','22','48','-26','13',['P','E','P','P','G']],
 ['10','Huracán','17','2','0','15','18','70','-52','6',['P','P','P','P','P']]
];

const LOGO_FALLBACK={
 'c de gasca':'./assets/teams/deportivo-cg.webp',
 'cerrito de gasca':'./assets/teams/deportivo-cg.webp',
 'juventus':'./assets/teams/juventus.webp',
 'cuenda':'./assets/teams/tc-cuenda.webp',
 'pozos fc':'./assets/teams/pozos-fc.webp',
 'boavista':'./assets/teams/boavista-fc.webp',
 'boavista fc':'./assets/teams/boavista-fc.webp',
 'psv':'./assets/teams/psv.webp',
 'america':'./assets/branding/america-veteranos-35-user.png',
 'huracan':'./assets/teams/huracan.webp'
};

let data=null,timer=0;

function currentCat(){
  try{
    const stored=norm(localStorage.getItem('jrCategory')||'');
    if(BYNAME[stored])return BYNAME[stored];
  }catch(_){}
  const active=$('#jr53TopCategoryHost .jr81-cat-btn[aria-pressed="true"],#jr53TopCategoryHost .jr81-cat-btn.active');
  if(active){
    const raw=active.dataset.category||active.querySelector('.jr81-cat-title')?.textContent||active.textContent;
    const id=BYNAME[norm(raw)];
    if(id)return id;
  }
  return '2';
}
function sourceRows(id){
  const c=data?.categories?.[id];
  return c?.standings?.flatMap(t=>{
    const hs=(t?.headers||[]).map(norm);
    return hs.some(h=>h.includes('equipo'))&&Array.isArray(t.rows)?t.rows:[];
  })||[];
}
function normalizeRow(r,i){
  return [
    String(r?.[0]??i+1),String(r?.[1]??'Equipo'),String(r?.[2]??''),String(r?.[3]??''),
    String(r?.[4]??''),String(r?.[5]??''),String(r?.[6]??''),String(r?.[7]??''),
    String(r?.[8]??''),String(r?.[9]??''),[]
  ];
}
function rowsFor(id){
  const src=sourceRows(id);
  if(src.length)return src.map(normalizeRow);
  if(id==='2')return FALLBACK_35.map(r=>r.slice());
  return [];
}
function logo(name){
  const entries=Object.entries(data?.team_logos||{});
  const hit=entries.find(([k])=>norm(k)===norm(name));
  const v=hit?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return v.local;
  return LOGO_FALLBACK[norm(name)]||'';
}
function crest(name,cls='jr62-crest'){
  const src=logo(name);
  return src?`<img class="${cls}" src="${esc(src)}?v=${BUILD}" alt="Escudo ${esc(name)}">`:`<span class="${cls} jr62-ball" aria-hidden="true">⚽</span>`;
}
function formPills(form){
  if(!Array.isArray(form)||!form.length)return '<span class="jr62-form-empty">—</span>';
  return `<span class="jr62-form">${form.map(x=>`<i class="${x==='G'?'g':x==='P'?'p':'e'}">${esc(x)}</i>`).join('')}</span>`;
}
function controls(){
  return `<div class="jr62-actions">
    <button type="button" data-jr59-export="table">Descargar PNG completo</button>
    <button type="button" data-jr59-share="table">Compartir PNG</button>
    <button type="button" data-jr59-csv="table">Descargar CSV</button>
    <a href="#stats" data-view="stats">Ver estadísticas</a>
  </div>`;
}
function header(id,title){
  const m=META[id]||META['2'];
  return `<div class="jr62-head">
    <img src="./assets/liga-logo.webp?v=${BUILD}" alt="Liga Juventino Rosas">
    <div><small>LIGA JUVENTINO ROSAS</small><h2>${esc(title)}</h2><p>${esc(m.name)}</p></div>
    <img src="${m.logo}?v=${BUILD}" alt="${esc(m.name)}">
  </div>`;
}
function top3(rs){
  return `<div class="jr62-podium">${rs.slice(0,3).map((r,i)=>`
    <article class="jr62-podium-card ${i===0?'leader':''}">
      <span class="jr62-pos">${esc(r[0])}</span>
      ${crest(r[1],'jr62-podium-crest')}
      <div class="jr62-podium-copy"><small>${i===0?'LÍDER':'POSICIÓN '+(i+1)}</small><strong>${esc(r[1])}</strong></div>
      <b class="jr62-points">${esc(r[9])}<small>PTS</small></b>
    </article>`).join('')}</div>`;
}
function physicalTable(id,withHeader=true){
  const rs=rowsFor(id),m=META[id]||META['2'];
  if(!rs.length)return `<div class="jr62-empty"><strong>Sin tabla general recibida para ${esc(m.name)}.</strong><p>Se mantienen las jornadas oficiales sin inventar puntos.</p></div>`;
  const note=(id==='2'&&!sourceRows(id).length)
    ?'Tabla visible restaurada de Veteranos 35+ · 17 jornadas. Se usa como respaldo visual mientras la fuente actual no publique una clasificación general.'
    :'Tabla oficial recibida desde la fuente actual.';
  return `${withHeader?top3(rs):''}
    <div class="jr62-note"><strong>Tabla de clasificación:</strong> ${esc(note)}</div>
    <div class="jr62-table-wrap" role="region" aria-label="Tabla de posiciones completa" tabindex="0">
      <table class="jr62-table">
        <thead><tr><th>#</th><th>EQUIPO</th><th>JJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>FORMA</th><th>PTS</th></tr></thead>
        <tbody>${rs.map(r=>`<tr>
          <td>${esc(r[0])}</td>
          <td><span class="jr62-team">${crest(r[1])}<b>${esc(r[1])}</b></span></td>
          <td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td><td>${esc(r[5])}</td>
          <td>${esc(r[6])}</td><td>${esc(r[7])}</td><td>${esc(r[8])}</td>
          <td>${formPills(r[10])}</td><td class="jr62-pts">${esc(r[9])}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;
}
function ensurePanel(viewSel,id,afterSel){
  const view=$(viewSel);if(!view)return null;
  let el=$('#'+id,view);
  if(!el){el=document.createElement('section');el.id=id;el.className='jr62-panel';
    const after=$(afterSel,view);
    if(after)after.insertAdjacentElement('afterend',el);else view.append(el);
  }
  return el;
}
function renderTable(){
  const id=currentCat();
  const old=$('#jr59Table');if(old)old.classList.add('jr62-hidden-old');
  const el=ensurePanel('#view-table','jr62TableRestore','#jr59Table');
  if(!el)return;
  el.innerHTML=header(id,'Tabla de clasificación')+physicalTable(id,true)+controls();
  el.dataset.category=id;
}
function statsCards(rs){
  if(!rs.length)return '<div class="jr62-empty">Sin estadísticas publicadas para esta categoría.</div>';
  const leader=rs[0],teams=rs.length,jj=Math.max(...rs.map(r=>Number(r[2])||0)),goals=rs.reduce((a,r)=>a+(Number(r[6])||0),0);
  return `<div class="jr62-kpis">
    <article><small>EQUIPOS</small><b>${teams}</b><span>${esc(META[currentCat()]?.name||'Categoría')}</span></article>
    <article><small>JORNADAS REGISTRADAS</small><b>${jj}</b><span>TABLA VISIBLE</span></article>
    <article><small>GOLES REGISTRADOS</small><b>${goals}</b><span>SUMA GF</span></article>
    <article><small>LÍDER ACTUAL</small><b>${esc(leader[9])}</b><span>${esc(leader[1])} · PTS</span></article>
  </div>`;
}
function performance(rs){
  return `<div class="jr62-performance">${rs.slice(0,6).map(r=>`<article>
    <span class="jr62-pos">${esc(r[0])}</span>${crest(r[1])}
    <div><b>${esc(r[1])}</b><small>JJ ${esc(r[2])} · G ${esc(r[3])} · E ${esc(r[4])} · P ${esc(r[5])} · GF ${esc(r[6])} · GC ${esc(r[7])} · DG ${esc(r[8])}</small></div>
    <strong>${esc(r[9])}<small>PTS</small></strong>
  </article>`).join('')}</div>`;
}
function renderStats(){
  const id=currentCat(),rs=rowsFor(id);
  const old=$('#jr59Stats');if(old)old.classList.add('jr62-hidden-old');
  const el=ensurePanel('#view-stats','jr62StatsRestore','#jr59Stats');
  if(!el)return;
  el.innerHTML=header(id,'Goleo y rendimiento')
    +`<div class="jr62-category-line"><span>Categoría activa: <b>${esc(META[id]?.name||'Categoría')}</b></span><span>Fuente: ${sourceRows(id).length?'tabla oficial recibida':'respaldo visual restaurado'}</span></div>`
    +statsCards(rs)
    +`<h3>Rendimiento de equipos</h3>`
    +performance(rs)
    +`<div class="jr62-inline-table-title"><div><small>CLASIFICACIÓN</small><h3>Tabla de posiciones</h3></div><a href="#table" data-view="table">Abrir Tabla</a></div>`
    +physicalTable(id,true)+controls();
  el.dataset.category=id;
}
function staticBanner(viewId,src,alt){
  const view=$('#view-'+viewId);if(!view)return;
  const banner=$('.jr39-view-banner',view);if(!banner)return;
  $$('video',banner).forEach(v=>{try{v.pause()}catch(_){}v.remove()});
  let img=$('.jr62-banner-still',banner);
  if(!img){img=document.createElement('img');img.className='jr62-banner-still';banner.prepend(img)}
  img.src=src+'?v='+BUILD;img.alt=alt;
  banner.classList.add('jr62-static-banner');
}
function patchBanners(){
  staticBanner('table','./assets/motion/v38-fix10-field.jpg','Vista de tabla y estadísticas de Liga Juventino Rosas');
  staticBanner('stats','./assets/motion/v38-fix10-tactics.jpg','Vista de análisis y rendimiento de Liga Juventino Rosas');
}
function navigation(){
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('#jr62TableRestore [data-view],#jr62StatsRestore [data-view]');
    if(!a)return;
    const view=a.dataset.view;if(!view)return;
    if(typeof window.showView==='function'){e.preventDefault();window.showView(view)}
  },true);
}
function render(){patchBanners();renderTable();renderStats();document.documentElement.dataset.jr62='restored'}
function schedule(){clearTimeout(timer);timer=setTimeout(render,120)}
function start(){
  navigation();render();
  [250,700,1500,3000,6000].forEach(ms=>setTimeout(render,ms));
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);
}
fetch('./data/official-live.json?restore='+BUILD,{cache:'no-store'})
 .then(r=>r.ok?r.json():Promise.reject())
 .then(d=>{data=d;start()})
 .catch(()=>{data={categories:{},team_logos:{}};start()});
})();