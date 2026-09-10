(function(){
'use strict';

const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const TEAMS=[
'C. de Gasca','Pozos FC','Juventus','Cuenda','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán',
'Hermanos','San José FC','Linces','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas',
'La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta',
'Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata',
'La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Manchester'
].sort((a,b)=>b.length-a.length);

const META={
 'pozos fc':['Veteranos 35+','Pozos, Juventino Rosas, Guanajuato'],
 'c. de gasca':['Veteranos 35+','Cerrito de Gasca, Juventino Rosas, Guanajuato'],
 'cuenda':['Veteranos 35+','Santiago de Cuenda, Juventino Rosas, Guanajuato'],
 'f. tavera':['Veteranos 35+','Tavera, Juventino Rosas, Guanajuato'],
 'tavera fc':['Segunda Fuerza','Tavera, Juventino Rosas, Guanajuato'],
 'san juan fc':['Segunda Fuerza','San Juan de la Cruz, Juventino Rosas, Guanajuato'],
 'san julián':['Segunda Fuerza','San Julián, Juventino Rosas, Guanajuato'],
 'san josé fc':['Primera Fuerza','San José, Juventino Rosas, Guanajuato'],
 'san josé jrs':['Segunda Fuerza','San José, Juventino Rosas, Guanajuato'],
 'san antonio jrs':['Intermedia','San Antonio de Romerillo, Juventino Rosas, Guanajuato'],
 'san antonio fc':['Segunda Fuerza','San Antonio de Romerillo, Juventino Rosas, Guanajuato'],
 'la huerta':['Intermedia','La Huerta, Juventino Rosas, Guanajuato'],
 'la cuadrilla':['Intermedia','La Cuadrilla, Juventino Rosas, Guanajuato'],
 'dep. zapata':['Segunda Fuerza','Colonia Emiliano Zapata, Juventino Rosas, Guanajuato']
};

const VENUES={
 'campo 1':['Campo 1 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 2':['Campo 2 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 3':['Campo 3 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 4':['Campo 4 · Emiliano Zapata','Zona colonia Emiliano Zapata, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Colonia+Emiliano+Zapata%2C+Juventino+Rosas%2C+Guanajuato'],
 'cerrito de gasca':['Cerrito de Gasca','Cerrito de Gasca, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Cerrito+de+Gasca%2C+Juventino+Rosas%2C+Guanajuato'],
 'tavera':['Tavera','Tavera, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Tavera%2C+Juventino+Rosas%2C+Guanajuato'],
 'san juan de la cruz':['San Juan de la Cruz','San Juan de la Cruz, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=San+Juan+de+la+Cruz%2C+Juventino+Rosas%2C+Guanajuato'],
 'santiago de cuenda':['Santiago de Cuenda','Santiago de Cuenda, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Santiago+de+Cuenda%2C+Juventino+Rosas%2C+Guanajuato'],
 'san antonio de romerillo':['San Antonio de Romerillo','San Antonio de Romerillo, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=San+Antonio+de+Romerillo%2C+Juventino+Rosas%2C+Guanajuato']
};


const DIRECT_LOGOS={
  'c. de gasca':'./assets/teams/deportivo-cg.webp',
  'pozos fc':'./assets/teams/veteranos-pozos-fc.webp',
  'juventus':'./assets/teams/juventus.webp',
  'boavista':'./assets/teams/boavista-fc.webp',
  'psv':'./assets/teams/psv.webp',
  'a. santiago':'./assets/teams/atletico-santiago.webp',
  'f. tavera':'./assets/teams/franco-tavera-jr-veteranos.webp',
  'hermanos':'./assets/teams/club-deportivo-hermanos.webp',
  'linces':'./assets/teams/linces.webp',
  'lobos cdg':'./assets/teams/lobos-cdg.webp',
  'franco fc':'./assets/teams/franco-fc.webp',
  'terricolas':'./assets/teams/terricolas-fc.webp',
  'la canchita deportes':'./assets/teams/la-canchita.webp',
  'aldama fc':'./assets/teams/aldama.webp',
  'la huerta':'./assets/teams/la-huerta-cuenda.webp',
  'san antonio jrs':'./assets/teams/san-antonio-jr.webp',
  'san jose jrs':'./assets/teams/san-jose-jr.webp',
  'san jose fc':'./assets/teams/san-jose.webp',
  'san julian':'./assets/teams/san-julian-fc.webp',
  'tavera fc':'./assets/teams/tavera-fc.webp',
  'dep. nopalero':'./assets/teams/deportivo-nopalero.webp',
  'la esperanza':'./assets/teams/la-esperanza-fc.webp',
  'manchester':'./assets/teams/manchester-united.webp'
};

const LOGO_CACHE = new Map();
const HERO_TEXT_OLD='Jornadas, resultados, tabla, goleadores, liguilla y un Match Center pensado como una app deportiva moderna. El 3D vive en la portada; los datos siguen siendo rápidos y legibles.';
const HERO_TEXT_NEW='Consulta jornadas, resultados, tabla de posiciones, goleadores y liguilla oficial de la Liga Juventino Rosas. Un espacio pensado para equipos, delegados, directivos y afición, con acceso rápido y claro a la información más importante de cada categoría.';

function q(s,r=document){return r.querySelector(s)}
function qa(s,r=document){return [...r.querySelectorAll(s)]}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(s){return String(s||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function slugify(s){
  return norm(s)
    .replace(/\bc\.\s*de\b/g,'cerrito-de')
    .replace(/\bdep\.\s*/g,'deportivo-')
    .replace(/\bf\.\s*/g,'f-')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
}
function teamFromText(t){const n=norm(t);return TEAMS.find(x=>n===norm(x))||''}
function teamFromAnyText(t){const n=norm(t);return TEAMS.find(x=>n===norm(x)||n.includes(norm(x)))||''}

function logoCandidates(team){
  const slug = slugify(team);
  const alt = [...new Set([
    slug,
    slug.replace(/^cerrito-de-gasca$/,'c-de-gasca'),
    slug.replace(/^deportivo-zapata$/,'dep-zapata'),
    slug.replace(/^deportivo-maravillas$/,'dep-maravillas'),
    slug.replace(/^f-tavera$/,'f-tavera'),
    slug.replace(/^san-jose-jrs$/,'san-jose-jrs'),
    slug.replace(/^san-antonio-jrs$/,'san-antonio-jrs')
  ])];
  const dirs = [
    './assets/logos/','./assets/escudos/','./assets/equipos/','./assets/teams/',
    './img/logos/','./img/escudos/','./img/equipos/','./images/logos/','./logos/','./escudos/'
  ];
  const exts = ['png','webp','jpg','jpeg','svg'];
  const out = [];
  for(const d of dirs){ for(const a of alt){ for(const e of exts){ out.push(`${d}${a}.${e}`) }}}
  return out;
}
function probeImage(url){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload = ()=>resolve(url);
    img.onerror = ()=>resolve('');
    img.src = url;
  });
}
async function logoFor(team){
  const key = norm(team);
  if(LOGO_CACHE.has(key)) return LOGO_CACHE.get(key);

  const direct = DIRECT_LOGOS[key];
  if(direct){
    const found = await probeImage(direct);
    if(found){
      LOGO_CACHE.set(key, found);
      return found;
    }
  }

  const dom = qa('img').find(i=>norm(i.alt||'')===key || norm(i.title||'')===key);
  if(dom && dom.src){
    LOGO_CACHE.set(key, dom.src);
    return dom.src;
  }

  for(const candidate of logoCandidates(team)){
    const found = await probeImage(candidate);
    if(found){
      LOGO_CACHE.set(key, found);
      return found;
    }
  }

  LOGO_CACHE.set(key, '');
  return '';
}

function modal(){
 let m=q('#jr31Modal'); if(m)return m;
 m=document.createElement('div'); m.id='jr31Modal'; m.className='jr31-modal-bg';
 m.innerHTML='<div class="jr31-modal"><div class="jr31-modal__head"><h3></h3><button class="jr31-close" type="button">×</button></div><div class="jr31-modal__body"></div></div>';
 document.body.appendChild(m);
 q('.jr31-close',m).onclick=()=>m.classList.remove('show');
 m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
 return m;
}
function openModal(title,html){
 const m=modal(); q('h3',m).textContent=title; q('.jr31-modal__body',m).innerHTML=html; m.classList.add('show'); return m;
}
function clickText(words){
 const arr=Array.isArray(words)?words:[words];
 const el=qa('button,a,[data-view]').find(x=>arr.some(w=>norm(x.textContent)===norm(w)));
 if(el){el.click();return true} return false;
}
function go(view){
 const target=document.getElementById('view-'+view);
 if(target && typeof window.showView==='function'){
   try{window.showView(view);return}catch(_){}
 }
 const m={home:['Inicio'],matches:['Partidos','Jornada','Ver jornada'],table:['Tabla','Ver tabla'],stats:['Estadísticas','Goleo'],match:['Abrir Match Center','Match Center','LIVE Match Center'],more:['Más']};
 if(clickText(m[view]||view))return;
 const h=qa('h1,h2,h3,h4').find(x=>(m[view]||[]).some(w=>norm(x.textContent)===norm(w)));
 if(h)h.scrollIntoView({behavior:'smooth',block:'start'});
}
function setCat(cat){localStorage.setItem('jrCategory',cat);const b=qa('[data-category],button,a').find(x=>norm(x.dataset?.category||x.textContent)===norm(cat));if(b)b.click()}

async function openTeam(team){
 const key=norm(team), meta=META[key]||[localStorage.getItem('jrCategory')||'Liga','Juventino Rosas, Guanajuato'];
 const logo=await logoFor(team);
 const m=openModal(team,`<div class="jr31-hero"><div class="jr31-avatar">${logo?`<img src="${esc(logo)}" alt="${esc(team)}">`:esc(initials(team))}</div><div><div class="jr31-chip">${esc(meta[0])}</div><h4>${esc(team)}</h4><p>Equipo registrado en la Liga Municipal de Fútbol Juventino Rosas.</p></div></div><div class="jr31-grid"><div class="jr31-card"><small>Origen / zona</small>${esc(meta[1])}</div><div class="jr31-card"><small>Acciones</small>Consulta sus partidos y la tabla de su categoría.</div></div><div class="jr31-actions"><button class="jr31-btn primary" id="jr31Matches">Ver partidos</button><button class="jr31-btn" id="jr31Table">Ver tabla</button><a class="jr31-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta[1])}">Ver zona en Maps</a></div>`);
 q('#jr31Matches',m).onclick=()=>{setCat(meta[0]);m.classList.remove('show');go('matches')};
 q('#jr31Table',m).onclick=()=>{setCat(meta[0]);m.classList.remove('show');go('table')};
}
function venueFromText(text){
 const n=norm(text);
 return Object.keys(VENUES).find(k=>n===norm(k)||n.includes(norm(k)))||'';
}
function openVenue(k){
 const v=VENUES[k]; if(!v)return;
 openModal(v[0],`<div class="jr31-hero"><div class="jr31-avatar">📍</div><div><div class="jr31-chip">Cancha / sede</div><h4>${esc(v[0])}</h4><p>${esc(v[1])}</p></div></div><div class="jr31-actions"><a class="jr31-btn primary" target="_blank" rel="noopener" href="${esc(v[2])}">Cómo llegar en Google Maps</a></div>`);
}
function openCats(){
 const m=openModal('5 categorías',`<div class="jr31-card">Elige una categoría para abrir sus jornadas.</div><div class="jr31-actions">${CATS.map(c=>`<button class="jr31-btn" data-jr31-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>`);
 qa('[data-jr31-cat]',m).forEach(b=>b.onclick=()=>{setCat(b.dataset.jr31Cat);m.classList.remove('show');go('matches')});
}

function textLeaves(el){
  if(!el || el.closest('#jr31Modal')) return false;
  if(el.querySelector('img')) return false;
  const txt=(el.textContent||'').trim();
  if(!txt || txt.length>90) return false;
  if(el.children.length>1) return false;
  return true;
}
function needsLogoCell(el){
  if(!el || el.dataset.jr31Logo) return false;
  if(!textLeaves(el)) return false;
  const matchArea=el.closest('#view-matches,#view-calendar,.v21-archive-card,.v20-archive-card,.v21-group,.v20-group');
  if(!matchArea) return false;
  const txt=(el.textContent||'').trim();
  return !!teamFromText(txt);
}
async function decorateLogos(){
  const nodes = qa('td,span,a,b,strong,small').filter(needsLogoCell);
  for(const el of nodes){
    const label=(el.textContent||'').trim();
    const team=teamFromText(label);
    if(!team) continue;
    el.dataset.jr31Team=team;
    el.classList.add('jr31-click');
    const logo=await logoFor(team);
    if(!logo){ el.dataset.jr31Logo='skip'; continue; }
    el.innerHTML=`<span class="jr31-teamcell"><span class="jr31-teamcell__logo"><img src="${esc(logo)}" alt="${esc(team)}"></span><span>${esc(label)}</span></span>`;
    el.dataset.jr31Logo='1';
  }
}

function fixFinalHero(){
  const section=q('#gran-final-veteranos-v16');
  if(!section) return;
  const teams=qa('.match-hero .team',section);
  if(teams.length<2) return;

  teams[0].innerHTML='<div class="team-logo"><img src="./assets/teams/deportivo-cg.webp" alt="C. de Gasca"></div><b data-jr31-team="C. de Gasca">C. de Gasca</b>';
  teams[1].innerHTML='<div class="team-logo"><img src="./assets/teams/veteranos-pozos-fc.webp" alt="Pozos FC"></div><b data-jr31-team="Pozos FC">Pozos FC</b>';

  teams.forEach(t=>t.classList.add('jr31-click'));
}

function cleanLegacyLogoDuplicates(){
  // V31.2/V31.3 podían agregar logos también en Inicio/Tabla.
  // En esas zonas dejamos el render nativo y retiramos sólo envolturas JR31 antiguas.
  qa('#view-home .jr31-teamcell__logo,#view-table .jr31-teamcell__logo,#view-stats .jr31-teamcell__logo').forEach(logo=>{
    const wrap=logo.closest('.jr31-teamcell');
    if(!wrap) return;
    const label=wrap.querySelector(':scope > span:last-child');
    const text=(label?.textContent||wrap.textContent||'').trim();
    const parent=wrap.parentElement;
    if(parent){
      parent.textContent=text;
      parent.dataset.jr31Logo='native';
      const team=teamFromText(text);
      if(team){parent.dataset.jr31Team=team;parent.classList.add('jr31-click')}
    }
  });

  // Si algún render previo dejó más de una imagen dentro de una misma celda de equipo,
  // conserva sólo la primera. No toca otros elementos de la fila.
  qa('#view-home td,#view-table td,#view-stats .jr31-click,#view-home .team,#view-match .team,#gran-final-veteranos-v16 .team').forEach(cell=>{
    const text=(cell.textContent||'').trim();
    const team=teamFromAnyText(text);
    if(!team) return;
    const imgs=qa('img',cell);
    if(imgs.length<=1) return;
    imgs.slice(1).forEach(img=>{
      const logoWrap=img.closest('.jr31-teamcell__logo');
      if(logoWrap) logoWrap.remove();
      else img.remove();
    });
  });
}


function firstTextNode(el){
  for(const node of el.childNodes){
    if(node.nodeType===Node.TEXT_NODE && node.textContent.trim()) return node;
  }
  return null;
}
function setSingleLogoInBlock(block, team){
  if(!block || !team) return;
  logoFor(team).then(logo=>{
    if(!logo) return;
    const imgs=qa('img',block);
    const unique=[];
    const seen=new Set();
    imgs.forEach(img=>{
      const key=(img.currentSrc||img.src||'').split('?')[0];
      if(!key) return;
      if(seen.has(key)) img.remove();
      else { seen.add(key); unique.push(img); }
    });
    let wrap=q('.team-logo,.jr31-teamcell__logo,.team-badge,.club-logo,.logo',block);
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='team-logo';
      const first=block.firstElementChild;
      if(first) block.insertBefore(wrap, first); else block.prepend(wrap);
    }
    wrap.innerHTML=`<img src="${esc(logo)}" alt="${esc(team)}">`;
    // Remove any other inline logo wrappers in this block.
    qa('.jr31-teamcell__logo,.team-badge,.club-logo,.logo',block).forEach(node=>{ if(node!==wrap) node.remove(); });
    qa('img',block).forEach((img,i)=>{ if(!wrap.contains(img)) img.remove(); });
    // Clean orphan initial placeholders when a real logo exists.
    block.childNodes.forEach(node=>{
      if(node.nodeType===Node.TEXT_NODE && /^[A-Z]{1,2}$/.test(node.textContent.trim())) node.textContent='';
    });
  }).catch(()=>{});
}

function normalizeRepeatedLogos(){
  // Hero / match-center teams: replace placeholders by one real logo and remove mini duplicate logos.
  qa('.match-hero .team, .live-score .team, .match-center .team, .team-card, .fixture-team').forEach(block=>{
    const team=teamFromAnyText(block.textContent||'');
    if(team) setSingleLogoInBlock(block, team);
  });

  // Tables and cards: if a team cell or card has multiple logos, keep a single unique logo.
  qa('td, th, .player-card, .scorer-card, .table-team, .team-row, .fixture-row').forEach(cell=>{
    const team=teamFromAnyText(cell.textContent||'');
    if(!team) return;
    const imgs=qa('img',cell);
    if(!imgs.length) return;
    const seen=new Set();
    let keep=null;
    imgs.forEach(img=>{
      const key=(img.currentSrc||img.src||'').split('?')[0];
      if(!key) return;
      if(!keep){ keep=img; seen.add(key); return; }
      if(seen.has(key) || imgs.length>1) img.remove();
    });
    if(keep){
      const wrappers=qa('.jr31-teamcell__logo',cell);
      wrappers.forEach((w,i)=>{ if(i>0) w.remove(); });
    }
  });

  // Top scorers: separate player name and team label neatly.
  qa('#view-stats .jr31-click, #view-stats .top-scorer-item, #view-stats .scorer-card, #view-stats li').forEach(card=>{
    const txt=(card.textContent||'').trim();
    const team=teamFromAnyText(txt);
    if(!team) return;
    const logoImgs=qa('img',card);
    const logoSrc=logoImgs[0]?.src||'';
    // If team name is jammed into a heading, add a small sublabel instead of duplicating text.
    const heading=q('h3,h4,b,strong',card);
    if(heading){
      const teamNorm=norm(team);
      const raw=heading.textContent||'';
      if(norm(raw).includes(teamNorm)){
        const cleaned=raw.replace(new RegExp(team.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'').replace(/\s{2,}/g,' ').trim();
        if(cleaned) heading.textContent=cleaned;
      }
      let sub=q('.jr31-team-sub',card);
      if(!sub){
        sub=document.createElement('small');
        sub.className='jr31-team-sub';
        heading.insertAdjacentElement('afterend', sub);
      }
      sub.innerHTML=(logoSrc?`<img src="${esc(logoSrc)}" alt="${esc(team)}"> `:'')+esc(team);
    }
  });
}


function scheduleRoot(el){
  return el?.closest('#view-matches,#view-calendar,.v21-archive-card,.v20-archive-card,.v21-group,.v20-group,.match-list,.calendar-list,.calendar-card,.match-card,.fixture-card,.fixture-list');
}
function textOnlyLabel(el){
  if(!el) return '';
  const clone=el.cloneNode(true);
  qa('img,svg,picture,video,canvas',clone).forEach(n=>n.remove());
  return (clone.textContent||'').replace(/\s+/g,' ').trim();
}
function isScheduleTeamCell(el){
  if(!el || !scheduleRoot(el)) return false;
  const txt=textOnlyLabel(el);
  if(!txt || txt.length>40) return false;
  if(/^(local|visitante|hora|campo\s*\/\s*nota|campo|nota|vs)$/i.test(txt)) return false;
  return !!teamFromText(txt);
}
async function renderSingleTeamCell(el){
  if(!isScheduleTeamCell(el)) return false;
  const label=textOnlyLabel(el);
  const team=teamFromText(label);
  if(!team) return false;
  el.dataset.jr31Team=team;
  el.classList.add('jr31-click');
  const logo=await logoFor(team);
  if(!logo){
    el.dataset.jr31Logo='skip';
    return false;
  }
  el.innerHTML=`<span class="jr31-teamcell"><span class="jr31-teamcell__logo"><img src="${esc(logo)}" alt="${esc(team)}"></span><span>${esc(label)}</span></span>`;
  el.dataset.jr31Logo='1';
  return true;
}
async function decorateScheduleLogosAllCategories(){
  const nodes = qa('#view-matches td,#view-matches span,#view-matches a,#view-matches b,#view-matches strong,#view-matches small,#view-calendar td,#view-calendar span,#view-calendar a,#view-calendar b,#view-calendar strong,#view-calendar small,.v21-archive-card td,.v21-archive-card span,.v21-archive-card a,.v21-archive-card b,.v21-archive-card strong,.v21-archive-card small,.v20-archive-card td,.v20-archive-card span,.v20-archive-card a,.v20-archive-card b,.v20-archive-card strong,.v20-archive-card small')
    .filter(el=>!el.closest('.jr31-teamcell'));
  for(const el of nodes){
    await renderSingleTeamCell(el);
  }
}
function dedupeScheduleLogosAllCategories(){
  qa('#view-matches td,#view-calendar td,.v21-archive-card td,.v20-archive-card td,#view-matches span,#view-calendar span,.v21-archive-card span,.v20-archive-card span').forEach(el=>{
    const label=textOnlyLabel(el);
    const team=teamFromText(label) || teamFromAnyText(label);
    if(!team) return;
    const wrappers=qa('.jr31-teamcell',el);
    if(wrappers.length>1){
      const first=wrappers[0].cloneNode(true);
      wrappers.forEach(w=>w.remove());
      el.textContent='';
      el.appendChild(first);
    }
    const allImgs=qa('img',el);
    const teamWrap=q('.jr31-teamcell',el);
    const keepImg=teamWrap ? q('img',teamWrap) : allImgs[0];
    allImgs.forEach(img=>{ if(keepImg && img!==keepImg) img.remove(); });
    qa('.jr31-teamcell__logo',el).forEach((logo,i)=>{ if(i>0) logo.remove(); });
    // If the cell still has plain team text plus one kept logo, normalize exact final HTML.
    if(keepImg){
      const finalLabel=label || team;
      el.innerHTML=`<span class="jr31-teamcell"><span class="jr31-teamcell__logo"><img src="${esc(keepImg.getAttribute('src')||keepImg.src)}" alt="${esc(team)}"></span><span>${esc(finalLabel)}</span></span>`;
      el.dataset.jr31Team=team;
      el.dataset.jr31Logo='1';
      el.classList.add('jr31-click');
    }
  });
}

function replacePublicCopy(){
  const candidates=qa('p').filter(el=>!(el.closest('#jr31Modal')) && el.children.length===0);
  candidates.forEach(el=>{
    const txt=(el.textContent||'').trim().replace(/\s+/g,' ');
    if(txt===HERO_TEXT_OLD){
      el.textContent=HERO_TEXT_NEW;
    }
  });
}
function decorateSafe(){
 qa('button,a,span,b,strong,small,td,th').forEach(el=>{
   const txt=(el.textContent||'').trim(); if(!txt || txt.length>80)return;
   if(norm(txt)==='5 categorias'){el.dataset.jr31='cats';el.classList.add('jr31-click')}
   if(norm(txt)==='live match center'||norm(txt)==='abrir match center'){el.dataset.jr31='match';el.classList.add('jr31-click')}
   if(norm(txt)==='jr matchday'||norm(txt)==='ver jornada'){el.dataset.jr31='matches';el.classList.add('jr31-click')}
   const team=teamFromAnyText(txt);
   if(team){el.dataset.jr31Team=team;el.classList.add('jr31-click')}
   const venue=venueFromText(txt);
   if(venue && /campo|cerrito|tavera|san juan|cuenda|romerillo/i.test(txt)){el.dataset.jr31Venue=venue;el.classList.add('jr31-click')}
 });
 decorateLogos();
 decorateScheduleLogosAllCategories();
 setTimeout(dedupeScheduleLogosAllCategories,60);
}
function clickHandler(e){
 const el=e.target.closest('[data-jr31],[data-jr31-team],[data-jr31-venue]');
 if(!el)return;
 if(el.dataset.jr31==='cats'){e.preventDefault();return openCats()}
 if(el.dataset.jr31==='match'){e.preventDefault();return go('match')}
 if(el.dataset.jr31==='matches'){e.preventDefault();return go('matches')}
 if(el.dataset.jr31Team){e.preventDefault();return openTeam(el.dataset.jr31Team)}
 if(el.dataset.jr31Venue){e.preventDefault();return openVenue(el.dataset.jr31Venue)}
}
function guardAgainstOldCollapse(){
 setTimeout(()=>{
   const bodyText=norm(document.body?.innerText||'');
   const suspicious=bodyText.includes('carlos martinez') && bodyText.length<180;
   if(suspicious && sessionStorage.getItem('jr31Recovered')!=='1'){
     sessionStorage.setItem('jr31Recovered','1');
     Promise.resolve().then(async()=>{
       try{
         if('serviceWorker' in navigator){
           const regs=await navigator.serviceWorker.getRegistrations();
           await Promise.all(regs.map(r=>r.unregister()));
         }
         if('caches' in window){
           const ks=await caches.keys();
           await Promise.all(ks.map(k=>caches.delete(k)));
         }
       }catch(_){}
       location.replace('./?v=31-recover-'+Date.now());
     });
   }
 },1600);
}
function boot(){
 replacePublicCopy();
 fixFinalHero();
 cleanLegacyLogoDuplicates();
 normalizeRepeatedLogos();
 decorateScheduleLogosAllCategories();
 dedupeScheduleLogosAllCategories();
 decorateSafe();
 document.addEventListener('click',clickHandler,true);
 setTimeout(()=>{replacePublicCopy();fixFinalHero();cleanLegacyLogoDuplicates();normalizeRepeatedLogos();decorateScheduleLogosAllCategories();dedupeScheduleLogosAllCategories();decorateSafe()},350);
 setTimeout(()=>{replacePublicCopy();fixFinalHero();cleanLegacyLogoDuplicates();normalizeRepeatedLogos();decorateScheduleLogosAllCategories();dedupeScheduleLogosAllCategories();decorateSafe()},1200);
 guardAgainstOldCollapse();
 window.LJR_V31={openTeam,openVenue,openCats,go,fixFinalHero,cleanLegacyLogoDuplicates};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
