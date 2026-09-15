/* V38.64 — restaura Tabla y Estadísticas como en las capturas, sin tocar Partidos. */
(()=>{'use strict';
if(window.__JR64_EXACT)return;window.__JR64_EXACT=true;
const BUILD='38-64-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const META={
 '3':{name:'Primera Fuerza'},'5':{name:'Intermedia'},'4':{name:'Segunda Fuerza'},'2':{name:'Veteranos 35+'},'1':{name:'Veteranos 50+'}
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
 'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp',
 'juventus':'./assets/teams/juventus.webp','cuenda':'./assets/teams/tc-cuenda.webp','pozos fc':'./assets/teams/pozos-fc.webp',
 'boavista':'./assets/teams/boavista-fc.webp','boavista fc':'./assets/teams/boavista-fc.webp','psv':'./assets/teams/psv.webp',
 'america':'./assets/branding/america-veteranos-35-user.png','huracan':'./assets/teams/huracan.webp'
};
let data=null,lastCategory='';

function currentId(){
  try{const s=norm(localStorage.getItem('jrCategory')||'');if(BYNAME[s])return BYNAME[s]}catch(_){}
  const a=$('#jr53TopCategoryHost .jr81-cat-btn[aria-pressed="true"],#jr53TopCategoryHost .jr81-cat-btn.active,#categoryBar .chip.active');
  if(a){const raw=a.dataset.category||a.querySelector('.jr81-cat-title')?.textContent||a.textContent;const id=BYNAME[norm(raw)];if(id)return id}
  return '2';
}
function sourceRows(id){
  const c=data?.categories?.[id];
  return c?.standings?.flatMap(t=>{
    const hs=(t?.headers||[]).map(norm);
    return hs.some(h=>h.includes('equipo'))&&Array.isArray(t.rows)?t.rows:[];
  })||[];
}
function normalRow(r,i){return [String(r?.[0]??i+1),String(r?.[1]??'Equipo'),String(r?.[2]??''),String(r?.[3]??''),String(r?.[4]??''),String(r?.[5]??''),String(r?.[6]??''),String(r?.[7]??''),String(r?.[8]??''),String(r?.[9]??''),[]]}
function rows(id){const src=sourceRows(id);if(src.length)return src.map(normalRow);return id==='2'?FALLBACK_35.map(r=>r.slice()):[]}
function logo(name){
  const hit=Object.entries(data?.team_logos||{}).find(([k])=>norm(k)===norm(name));const v=hit?.[1];
  if(typeof v==='string')return v;if(v?.local)return v.local;return LOGO_FALLBACK[norm(name)]||'';
}
function crest(name){const src=logo(name);return src?`<img class="jr64-crest" src="${esc(src)}?v=${BUILD}" alt="Escudo ${esc(name)}">`:`<span class="jr64-crest" aria-hidden="true">⚽</span>`}
function form(xs){return Array.isArray(xs)&&xs.length?`<span class="jr64-form">${xs.map(x=>`<i class="${x==='G'?'g':x==='P'?'p':'e'}">${esc(x)}</i>`).join('')}</span>`:'—'}
function actions(){return `<div class="jr64-actions"><button type="button" data-jr59-export="table">Descargar PNG completo</button><button type="button" data-jr59-share="table">Compartir PNG</button><button type="button" data-jr59-csv="table">Descargar CSV</button></div>`}
function hero(type){
 if(type==='table')return `<section class="jr64-hero table"><div class="jr64-hero-copy"><div class="jr64-kicker">TABLA Y ESTADÍSTICAS</div><h2>LA TEMPORADA, DE UN VISTAZO.</h2><p>Posiciones, goleadores y rendimiento con jerarquía visual y movimiento contenido.</p><div class="jr64-pills"><span>Tabla</span><span>Goleadores</span><span>Rendimiento</span></div></div></section>`;
 return `<section class="jr64-hero stats"><div class="jr64-hero-copy"><div class="jr64-kicker">ANÁLISIS DE FÚTBOL</div><h2>DATOS DENTRO DE LA CANCHA.</h2><p>Táctica y visualización inspiradas en fútbol asociación, no en fútbol americano.</p><div class="jr64-pills"><span>Formación</span><span>Táctica</span><span>Estadísticas</span></div></div></section>`;
}
function podium(rs){return `<div class="jr64-podium">${rs.slice(0,3).map((r,i)=>`<article class="jr64-podium-card"><span class="jr64-rank">${esc(r[0])}</span>${crest(r[1])}<div class="jr64-teamcopy"><small>${i===0?'LÍDER':'POSICIÓN '+(i+1)}</small><b>${esc(r[1])}</b></div><strong class="jr64-points">${esc(r[9])}<small>PTS</small></strong></article>`).join('')}</div>`}
function table(rs,id){
 if(!rs.length)return `<div class="jr64-note"><strong>Sin tabla general recibida para ${esc(META[id]?.name||'esta categoría')}.</strong> Se conservan las jornadas sin inventar puntos.</div>`;
 const note=(id==='2'&&!sourceRows(id).length)?'actualmente está restaurada la tabla de Veteranos 35+ (17 juegos). Para las demás categorías se muestran sus datos oficiales cuando existan.':'tabla oficial recibida desde la fuente actual.';
 return `${podium(rs)}<div class="jr64-note"><strong>Tablas oficiales recibidas:</strong> ${esc(note)}</div><div class="jr64-table-wrap"><table class="jr64-table"><thead><tr><th>#</th><th>EQUIPO</th><th>JJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>FORMA</th><th>PTS</th></tr></thead><tbody>${rs.map(r=>`<tr><td>${esc(r[0])}</td><td><span class="jr64-team">${crest(r[1])}<b>${esc(r[1])}</b></span></td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td><td>${esc(r[5])}</td><td>${esc(r[6])}</td><td>${esc(r[7])}</td><td>${esc(r[8])}</td><td>${form(r[10])}</td><td class="jr64-pts">${esc(r[9])}</td></tr>`).join('')}</tbody></table></div>`;
}
function statsKpis(rs,id){
 if(!rs.length)return '';
 const leader=rs[0],teams=rs.length,jj=Math.max(...rs.map(r=>Number(r[2])||0)),goals=rs.reduce((a,r)=>a+(Number(r[6])||0),0);
 return `<div class="jr64-kpis"><article class="jr64-kpi"><small>EQUIPOS</small><b>${teams}</b><span>${esc(META[id]?.name||'Categoría')}</span></article><article class="jr64-kpi"><small>JORNADAS REGISTRADAS</small><b>${jj}</b><span>TABLA OFICIAL</span></article><article class="jr64-kpi"><small>GOLES REGISTRADOS</small><b>${goals}</b><span>SUMA GF</span></article><article class="jr64-kpi"><small>LÍDER ACTUAL</small><b>${esc(leader[9])}</b><span>${esc(leader[1])} · PTS</span></article></div>`;
}
function performance(rs){return `<div class="jr64-performance">${rs.slice(0,6).map(r=>`<article><span class="jr64-rank">${esc(r[0])}</span><div class="jr64-performance-copy"><b>${esc(r[1])}</b><small>JJ ${esc(r[2])} · G ${esc(r[3])} · E ${esc(r[4])} · P ${esc(r[5])} · GF ${esc(r[6])} · GC ${esc(r[7])} · DG ${esc(r[8])}</small></div><strong>${esc(r[9])}<small>PTS</small></strong></article>`).join('')}</div>`}
function mount(){
 const id=currentId(),rs=rows(id),tv=$('#view-table'),sv=$('#view-stats');lastCategory=id;
 if(tv){tv.removeAttribute('data-jr59-official');tv.innerHTML=`<div id="jr64TableRestore" class="jr64-shell">${hero('table')}<div class="jr64-section-head"><div><small>COMPETENCIA</small><h3>Tabla de posiciones</h3></div><span class="jr64-season">Temporada 2025</span></div>${table(rs,id)}${actions()}</div>`}
 if(sv){sv.removeAttribute('data-jr59-official');sv.innerHTML=`<div id="jr64StatsRestore" class="jr64-shell">${hero('stats')}<div class="jr64-section-head"><div><small>ESTADÍSTICAS</small><h3>Goleo y rendimiento</h3></div></div><div class="jr64-category-line"><span>Categoría activa: <b>${esc(META[id]?.name||'Categoría')}</b></span><span>Fuente: ${sourceRows(id).length?'Tabla oficial recibida':'Tabla restaurada'} · ${rs.length?Math.max(...rs.map(r=>Number(r[2])||0)):0} jornadas</span></div>${statsKpis(rs,id)}<div><h3 class="jr64-performance-title">Rendimiento de equipos</h3>${performance(rs)}</div></div>`}
}
function schedule(){setTimeout(()=>{const id=currentId();if(id!==lastCategory||!$('#jr64TableRestore')||!$('#jr64StatsRestore'))mount()},90)}
function start(){
 mount();
 document.addEventListener('click',e=>{
   if(e.target.closest('#categoryBar [data-category],#jr53TopCategoryHost [data-category]'))schedule();
 },true);
 addEventListener('hashchange',()=>setTimeout(mount,80));addEventListener('pageshow',()=>setTimeout(mount,80));
 [250,700,1500,3000,6000].forEach(ms=>setTimeout(mount,ms));
 new MutationObserver(()=>schedule()).observe(document.body,{childList:true,subtree:true});
}
fetch('./data/official-live.json?restore='+BUILD,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{data=d;start()}).catch(()=>{data={categories:{},team_logos:{}};start()});
})();
