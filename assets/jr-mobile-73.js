(()=>{'use strict';
if(window.__JR73_MOBILE)return;window.__JR73_MOBILE=true;
const BUILD='38-73';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const CAT_META={
 'Primera Fuerza':{phase:'Torneo de Copa J5',teams:11,players:291,played:20,pending:35,logo:'./assets/branding/primera-fuerza-hd.png'},
 'Intermedia':{phase:'Torneo de Copa J5',teams:13,players:332,played:22,pending:54},
 'Segunda Fuerza':{phase:'Torneo de Copa J5',teams:12,players:312,played:23,pending:42},
 'Veteranos 35+':{phase:'FINAL',teams:10,players:0,played:0,pending:0},
 'Veteranos 50+':{phase:'Torneo de Copa J6',teams:6,players:109,played:15,pending:30}
};
const TEAMS={
 'Primera Fuerza':['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas'],
 'Intermedia':['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta'],
 'Segunda Fuerza':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'],
 'Veteranos 35+':['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán'],
 'Veteranos 50+':['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']
};
const CAT_ID={'Veteranos 50+':'1','Veteranos 35+':'2','Primera Fuerza':'3','Segunda Fuerza':'4','Intermedia':'5'};
const LOGO_FALLBACK={
 'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp','juventus':'./assets/teams/juventus.webp',
 'cuenda':'./assets/teams/tc-cuenda.webp','pozos fc':'./assets/teams/pozos-fc.webp','boavista':'./assets/teams/boavista-fc.webp','boavista fc':'./assets/teams/boavista-fc.webp',
 'psv':'./assets/teams/psv.webp','america':'./assets/branding/america-veteranos-35-user.png','huracan':'./assets/teams/huracan.webp'
};
let liveData=null;
function activeCategory(){
 try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch(_){return 'Primera Fuerza'}
}
function categoryTeams(cat){
 const roster=window.LJR_V20?.rosters?.[cat]||window.LJR_V20_API?.data?.rosters?.[cat];
 if(Array.isArray(roster)&&roster.length){const a=roster.map(x=>String(x?.name||x?.team||x||'').trim()).filter(Boolean);if(a.length)return [...new Set(a)]}
 return TEAMS[cat]||[];
}
function teamLogo(name){
 const hit=Object.entries(liveData?.team_logos||{}).find(([k])=>norm(k)===norm(name));const v=hit?.[1];
 if(typeof v==='string')return v;if(v?.local)return v.local;return LOGO_FALLBACK[norm(name)]||'';
}

/* Repara el bloque superior que quedó con letras verticales / imágenes duplicadas. */
function normalizeTopCards(){
 const host=$('#jr53TopCategoryHost');if(!host)return;
 $$('.jr81-cat-btn',host).forEach(b=>{
   const cat=b.dataset.category||b.dataset.jr81Category||$('.jr81-cat-title',b)?.textContent?.trim();
   if(!CAT_META[cat])return;
   const oldSrc=$('img',b)?.getAttribute('src')||'';const m=CAT_META[cat];
   const src=m.logo||oldSrc;
   const pressed=b.getAttribute('aria-pressed');
   b.dataset.jr73Normalized='1';
   b.innerHTML=`<span class="jr81-cat-icon">${src?`<img src="${esc(src)}?v=${BUILD}" alt="${esc(cat)}">`:''}</span><span class="jr81-cat-title">${esc(cat)}</span><span class="jr81-cat-phase">${esc(m.phase)}</span><span class="jr81-cat-stats"><span>${m.teams} equipos</span><span>${m.players} jugadores</span><span>${m.played} jugados</span><span>${m.pending} pendientes</span></span>`;
   if(pressed!==null)b.setAttribute('aria-pressed',pressed);
 });
}

/* Garantiza escudo al costado del nombre en podio y tabla. */
function ensureTableLogos(){
 const root=$('#jr64TableRestore');if(!root)return;
 $$('.jr64-podium-card',root).forEach(card=>{
   const name=$('.jr64-teamcopy b',card)?.textContent?.trim();if(!name)return;const src=teamLogo(name);if(!src)return;
   let crest=$('.jr64-crest',card);
   if(!(crest instanceof HTMLImageElement)){const im=document.createElement('img');im.className='jr64-crest';im.alt='Escudo '+name;if(crest)crest.replaceWith(im);else $('.jr64-teamcopy',card)?.before(im);crest=im}
   if(crest.getAttribute('src')!==src)crest.src=src;
 });
 $$('.jr64-team',root).forEach(team=>{
   const name=$('b',team)?.textContent?.trim();if(!name)return;const src=teamLogo(name);if(!src)return;
   let crest=$('.jr64-crest',team);
   if(!(crest instanceof HTMLImageElement)){const im=document.createElement('img');im.className='jr64-crest';im.alt='Escudo '+name;if(crest)crest.replaceWith(im);else team.prepend(im);crest=im}
   if(crest.getAttribute('src')!==src)crest.src=src;
 });
}

function labelText(label){return String(label?.childNodes?.[0]?.textContent||label?.textContent||'').trim()}
function fieldForLabel(root,re){
 const label=$$('label',root).find(l=>re.test(labelText(l)));if(!label)return null;
 const wrap=label.closest('.jr42-field,.field,.form-field,.jr57-field')||label.parentElement;
 return {label,wrap,control:$('input,select',wrap)||label.control||null};
}
function makeSelectForInput(input,cls){
 if(!input||input.tagName==='SELECT')return input;
 let sel=input.parentElement?.querySelector('select.'+cls);if(sel)return sel;
 sel=document.createElement('select');sel.className=cls;sel.setAttribute('aria-label',input.getAttribute('aria-label')||input.name||'Selector');
 input.classList.add('jr73-team-hidden');input.setAttribute('aria-hidden','true');input.tabIndex=-1;input.insertAdjacentElement('beforebegin',sel);
 sel.addEventListener('change',()=>{input.value=sel.value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))});
 return sel;
}
function populateSelect(sel,values,current,placeholder='Selecciona una opción'){
 if(!sel)return;const old=current??sel.value;sel.innerHTML=`<option value="">${esc(placeholder)}</option>`+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');if(values.includes(old))sel.value=old;
}
function credentialRoots(){return [...new Set([$('#jr42Ocr'),$('#view-credential'),...$$('[id*="credential" i],[class*="credential" i]')].filter(Boolean))]}
function enhanceCredentialRoot(root){
 if(!root)return;
 const catField=fieldForLabel(root,/^categor[ií]a\b/i);
 let catSel=catField?.control;
 if(catSel&&catSel.tagName!=='SELECT'){
   const original=catSel;catSel=makeSelectForInput(original,'jr73-category-select');populateSelect(catSel,CATS,original.value||activeCategory(),'Selecciona categoría');
 }
 if(catSel?.tagName==='SELECT'&&!catSel.dataset.jr73Cats){
   const old=catSel.value||activeCategory();populateSelect(catSel,CATS,CATS.includes(old)?old:activeCategory(),'Selecciona categoría');catSel.dataset.jr73Cats='1';
 }
 const teamField=fieldForLabel(root,/^equipo\b/i);if(!teamField?.control)return;
 const originalTeam=teamField.control;const teamSel=originalTeam.tagName==='SELECT'?originalTeam:makeSelectForInput(originalTeam,'jr73-team-select');teamSel.classList.add('jr73-team-select');
 const refresh=()=>{const cat=(catSel?.value&&CATS.includes(catSel.value))?catSel.value:activeCategory();const current=teamSel.value||originalTeam.value;populateSelect(teamSel,categoryTeams(cat),current,'Selecciona equipo');if(teamSel.value){originalTeam.value=teamSel.value}}
 if(!teamSel.dataset.jr73Bound){teamSel.dataset.jr73Bound='1';catSel?.addEventListener('change',refresh);document.addEventListener('jr-category-change',refresh)}
 refresh();
}
function enhanceCredentials(){credentialRoots().forEach(enhanceCredentialRoot)}

/* Cuenta: añade el icono superior sin reemplazar el acceso existente. */
function readSession(){
 let name='',role='';try{
  for(const k of ['jrUser','jrUsername','v22User','ljrUser']){const v=localStorage.getItem(k);if(v){try{name=JSON.parse(v)?.name||JSON.parse(v)?.username||v}catch{name=v}break}}
  for(const k of ['jrRole','v22Role','ljrRole']){const v=localStorage.getItem(k);if(v){role=v;break}}
 }catch(_){}
 return {name:name||'Visitante',role:role||'Acceso local'};
}
function ensureAccount(){
 const actions=$('.top-actions');if(!actions)return;
 let b=$('#jr73AccountButton');if(!b){b=document.createElement('button');b.id='jr73AccountButton';b.type='button';b.className='icon-btn';b.setAttribute('aria-label','Cuenta');b.textContent='👤';actions.append(b)}
 let d=$('#jr73AccountPanel');if(!d){d=document.createElement('dialog');d.id='jr73AccountPanel';d.innerHTML='<div class="jr73-account-head"><div class="jr73-account-avatar">JR</div><div class="jr73-account-copy"><b id="jr73AccountName">Visitante</b><small id="jr73AccountRole">Acceso local</small></div><button type="button" data-jr73-close>×</button></div><div class="jr73-account-body"><button type="button" class="primary-btn" id="jr73OpenAccess">Abrir acceso de la liga</button><button type="button" class="ghost-btn" id="jr73AccountClose">Cerrar</button></div>';document.body.append(d);
   d.addEventListener('click',e=>{if(e.target.matches('[data-jr73-close],#jr73AccountClose'))d.close()});
   $('#jr73OpenAccess',d).onclick=()=>{d.close();const t=$('#v22AccessHub,[data-v22-access],[data-open-access],#v22AccessBtn');if(t){if(t.tagName==='BUTTON'||t.tagName==='A')t.click();else t.scrollIntoView({behavior:'smooth',block:'center'})}else{location.hash='more'}};
 }
 b.onclick=()=>{const s=readSession();$('#jr73AccountName',d).textContent=s.name;$('#jr73AccountRole',d).textContent=s.role;d.showModal()};
}

/* Historias/Momentos locales: imagen o video guardados en IndexedDB del dispositivo. */
const DB_NAME='jr73-moments',STORE='moments';
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function dbAll(){try{const db=await openDB();return await new Promise((res,rej)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)})}catch{return[]}}
async function dbPut(v){const db=await openDB();return new Promise((res,rej)=>{const q=db.transaction(STORE,'readwrite').objectStore(STORE).put(v);q.onsuccess=()=>res(v);q.onerror=()=>rej(q.error)})}
function momentDialog(){
 let d=$('#jr73MomentDialog');if(d)return d;d=document.createElement('dialog');d.id='jr73MomentDialog';d.innerHTML=`<h3>Agregar momento</h3><p>Sube una foto o video desde este dispositivo. Se guarda localmente en este navegador.</p><div class="jr73-form-grid"><label>Foto o video<input id="jr73MomentFile" type="file" accept="image/*,video/*"></label><label>Texto<textarea id="jr73MomentText" maxlength="160" placeholder="Ej. Gol, jornada, festejo, resultado..."></textarea></label><label>Categoría<select id="jr73MomentCat">${CATS.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label></div><div class="jr73-dialog-actions"><button class="primary-btn" id="jr73MomentSave">Guardar momento</button><button class="ghost-btn" data-close>Cancelar</button></div>`;document.body.append(d);$('[data-close]',d).onclick=()=>d.close();$('#jr73MomentSave',d).onclick=async()=>{const f=$('#jr73MomentFile',d).files?.[0];if(!f){alert('Selecciona una imagen o video.');return}if(f.size>25*1024*1024){alert('Usa un archivo menor de 25 MB.');return}const row={id:Date.now()+'-'+Math.random().toString(36).slice(2),type:f.type.startsWith('video/')?'video':'image',blob:f,text:$('#jr73MomentText',d).value.trim(),category:$('#jr73MomentCat',d).value,created:Date.now()};await dbPut(row);d.close();$('#jr73MomentFile',d).value='';$('#jr73MomentText',d).value='';renderMoments()};return d;
}
function viewer(){let d=$('#jr73MomentViewer');if(d)return d;d=document.createElement('dialog');d.id='jr73MomentViewer';d.innerHTML='<div id="jr73ViewerMedia"></div><p class="jr73-moment-caption" id="jr73ViewerText"></p><div class="jr73-dialog-actions"><button class="ghost-btn" data-close>Cerrar</button></div>';document.body.append(d);$('[data-close]',d).onclick=()=>d.close();return d}
async function showMoment(row){const d=viewer(),host=$('#jr73ViewerMedia',d);host.innerHTML='';const url=URL.createObjectURL(row.blob);const el=document.createElement(row.type==='video'?'video':'img');el.className='jr73-view-media';el.src=url;if(row.type==='video'){el.controls=true;el.playsInline=true;el.autoplay=true}host.append(el);$('#jr73ViewerText',d).textContent=row.text||row.category||'';d.addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});d.showModal()}
function ensureMoments(){
 const home=$('#view-home');if(!home||$('#jr73MomentsSection'))return;
 const s=document.createElement('section');s.id='jr73MomentsSection';s.innerHTML='<div class="jr73-section-head"><div><small>MOMENTOS</small><h3>Historias de la liga</h3></div><small>Fotos y videos</small></div><div class="jr73-moments" id="jr73MomentsRail"></div>';
 const anchor=$('#jr53TopCategoryHost');if(anchor&&home.contains(anchor))anchor.insertAdjacentElement('afterend',s);else home.prepend(s);renderMoments();
}
async function renderMoments(){
 const rail=$('#jr73MomentsRail');if(!rail)return;const rows=(await dbAll()).sort((a,b)=>b.created-a.created);rail.innerHTML='<button class="jr73-story jr73-story-add" type="button" data-add><span class="jr73-story-ring"><span>＋</span></span><b>Agregar</b></button>'+
 `<button class="jr73-story" type="button" data-view="matches"><span class="jr73-story-ring"><span>⚽</span></span><b>Partidos</b></button><button class="jr73-story" type="button" data-view="bracket"><span class="jr73-story-ring"><span>🏆</span></span><b>Liguilla</b></button>`;
 $('[data-add]',rail).onclick=()=>{const d=momentDialog();$('#jr73MomentCat',d).value=activeCategory();d.showModal()};
 $$('[data-view]',rail).forEach(b=>b.onclick=()=>goView(b.dataset.view));
 rows.slice(0,20).forEach(row=>{const b=document.createElement('button');b.type='button';b.className='jr73-story';const ring=document.createElement('span');ring.className='jr73-story-ring';if(row.type==='image'){const img=document.createElement('img');const u=URL.createObjectURL(row.blob);img.src=u;img.onload=()=>URL.revokeObjectURL(u);ring.append(img)}else{const sp=document.createElement('span');sp.textContent='▶';ring.append(sp)}b.append(ring);const tx=document.createElement('b');tx.textContent=row.text||row.category||'Momento';b.append(tx);b.onclick=()=>showMoment(row);rail.append(b)});
}

function goView(name){const b=$(`[data-view="${CSS.escape(name)}"]`);if(b){b.click();return}const v=$('#view-'+name);if(v){$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');location.hash=name}}
function ensureCompetitionTools(){
 const more=$('#view-more');if(!more||$('#jr73CompetitionTools'))return;const box=document.createElement('div');box.id='jr73CompetitionTools';box.innerHTML='<button type="button" data-go="bracket"><span>🏆</span>Cuadro / Liguilla</button><button type="button" data-go="stats"><span>📊</span>Ranking jugadores</button><button type="button" data-go="home"><span>🎬</span>Momentos</button>';const grid=$('.more-grid',more);if(grid)grid.before(box);else more.append(box);$$('[data-go]',box).forEach(b=>b.onclick=()=>{goView(b.dataset.go);if(b.dataset.go==='stats')setTimeout(()=>$('#jr73PlayerRanking')?.scrollIntoView({behavior:'smooth',block:'start'}),120);if(b.dataset.go==='home')setTimeout(()=>$('#jr73MomentsSection')?.scrollIntoView({behavior:'smooth',block:'start'}),120)})
}

/* Ranking: solo muestra valores que existan en la fuente, sin inventar goles. */
function rankingCandidates(cat){
 const id=CAT_ID[cat];const c=liveData?.categories?.[id];const picks=[liveData?.player_rankings?.[cat],liveData?.rankings?.players?.[cat],liveData?.top_scorers?.[cat],liveData?.players?.[cat],c?.player_rankings,c?.top_scorers,c?.players];
 for(const a of picks)if(Array.isArray(a)&&a.length)return a;return []
}
function normalizePlayer(x){if(!x||typeof x==='string')return null;const name=String(x.name||x.player||x.jugador||'').trim();if(!name)return null;const goals=Number(x.goals??x.goles),assists=Number(x.assists??x.asistencias);if(!Number.isFinite(goals)&&!Number.isFinite(assists))return null;return{name,team:String(x.team||x.equipo||x.club||'').trim(),goals:Number.isFinite(goals)?goals:null,assists:Number.isFinite(assists)?assists:null,photo:x.photo||x.image||x.avatar||''}}
function ensureRanking(){
 const stats=$('#view-stats');if(!stats)return;let sec=$('#jr73PlayerRanking');if(!sec){sec=document.createElement('section');sec.id='jr73PlayerRanking';sec.innerHTML='<div class="jr73-section-head"><div><small>ESTADÍSTICAS</small><h3>Ranking de jugadores</h3></div><small id="jr73RankCat"></small></div><div class="jr73-ranking-tabs"><button class="active" data-rank="goals">Goles</button><button data-rank="assists">Asistencias</button></div><div class="jr73-ranking-list" id="jr73RankList"></div>';stats.append(sec);$$('[data-rank]',sec).forEach(b=>b.onclick=()=>{$$('[data-rank]',sec).forEach(x=>x.classList.toggle('active',x===b));renderRanking(b.dataset.rank)})}renderRanking($('.jr73-ranking-tabs .active',sec)?.dataset.rank||'goals')
}
function renderRanking(metric='goals'){
 const list=$('#jr73RankList');if(!list)return;const cat=activeCategory();$('#jr73RankCat').textContent=cat;const rows=rankingCandidates(cat).map(normalizePlayer).filter(Boolean).filter(x=>Number.isFinite(x[metric])).sort((a,b)=>b[metric]-a[metric]).slice(0,10);
 if(!rows.length){list.innerHTML='<div class="jr73-empty">El ranking queda listo para mostrar goles y asistencias cuando la fuente oficial de esta categoría tenga estadísticas individuales. No se inventan datos.</div>';return}
 list.innerHTML=rows.map((p,i)=>`<article class="jr73-rank-row"><strong>${i+1}</strong>${p.photo?`<img src="${esc(p.photo)}" alt="${esc(p.name)}">`:'<span class="jr73-rank-avatar">👤</span>'}<div class="jr73-rank-copy"><b>${esc(p.name)}</b><small>${esc(p.team||cat)}</small></div><div class="jr73-rank-value">${p[metric]}<small>${metric==='goals'?' G':' A'}</small></div></article>`).join('')
}

let scheduled=false;function repair(){scheduled=false;normalizeTopCards();ensureTableLogos();enhanceCredentials();ensureAccount();ensureMoments();ensureCompetitionTools();ensureRanking()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(repair)}
function start(){repair();[150,500,1200,2600,5200].forEach(ms=>setTimeout(schedule,ms));document.addEventListener('click',e=>{const cat=e.target.closest?.('[data-category]');if(cat){setTimeout(()=>{document.dispatchEvent(new Event('jr-category-change'));schedule()},80)}},true);addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
fetch('./data/official-live.json?v='+BUILD,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{liveData=d;start()}).catch(()=>{liveData={};start()});
})();