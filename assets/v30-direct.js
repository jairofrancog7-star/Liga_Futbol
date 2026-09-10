(function(){
'use strict';

const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const TEAM_META={
  'pozos fc':['Veteranos 35+','Pozos, Santa Cruz de Juventino Rosas, Guanajuato','Equipo representativo de la comunidad de Pozos.'],
  'c. de gasca':['Veteranos 35+','Cerrito de Gasca, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de Cerrito de Gasca y finalista de Veteranos 35+.'],
  'juventus':['Veteranos 35+','Santa Cruz de Juventino Rosas, Guanajuato','Equipo participante de la liga municipal.'],
  'cuenda':['Veteranos 35+','Santiago de Cuenda, Santa Cruz de Juventino Rosas, Guanajuato','Equipo identificado con la zona de Cuenda.'],
  'boavista':['Veteranos 35+','Santa Cruz de Juventino Rosas, Guanajuato','Equipo registrado en la competencia municipal.'],
  'psv':['Veteranos 35+','Santa Cruz de Juventino Rosas, Guanajuato','Equipo participante de Veteranos 35+.'],
  'a. santiago':['Veteranos 35+','Santiago de Cuenda, Santa Cruz de Juventino Rosas, Guanajuato','Equipo participante de la zona de Santiago de Cuenda.'],
  'f. tavera':['Veteranos 35+','Tavera, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de la comunidad de Tavera.'],
  'américa':['Veteranos 35+','Santa Cruz de Juventino Rosas, Guanajuato','Equipo inscrito en Veteranos 35+.'],
  'huracán':['Veteranos 35+','Santa Cruz de Juventino Rosas, Guanajuato','Equipo inscrito en Veteranos 35+.'],
  'san juan fc':['Segunda Fuerza','San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de San Juan de la Cruz.'],
  'san julián':['Segunda Fuerza','San Julián Tierra Blanca, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de San Julián / Tierra Blanca.'],
  'tavera fc':['Segunda Fuerza','Tavera, Santa Cruz de Juventino Rosas, Guanajuato','Equipo de la comunidad de Tavera.'],
  'san josé fc':['Primera Fuerza','San José, Santa Cruz de Juventino Rosas, Guanajuato','Equipo de la zona de San José.'],
  'san josé jrs':['Segunda Fuerza','San José, Santa Cruz de Juventino Rosas, Guanajuato','Equipo registrado de la zona de San José.'],
  'san antonio jrs':['Intermedia','San Antonio de Romerillo, Santa Cruz de Juventino Rosas, Guanajuato','Equipo de la zona San Antonio / Romerillo.'],
  'san antonio fc':['Segunda Fuerza','San Antonio de Romerillo, Santa Cruz de Juventino Rosas, Guanajuato','Equipo de la zona San Antonio / Romerillo.'],
  'galeana':['Intermedia','Santa Cruz de Juventino Rosas, Guanajuato','Equipo participante de Intermedia.'],
  'la huerta':['Intermedia','La Huerta, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de La Huerta.'],
  'la cuadrilla':['Intermedia','La Cuadrilla, Santa Cruz de Juventino Rosas, Guanajuato','Representativo de La Cuadrilla.'],
  'dep. zapata':['Segunda Fuerza','Colonia Emiliano Zapata, Santa Cruz de Juventino Rosas, Guanajuato','Equipo identificado con la zona Emiliano Zapata.']
};
const TEAM_NAMES=[
  'C. de Gasca','Pozos FC','Juventus','Cuenda','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán',
  'Hermanos','San José FC','Linces','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas',
  'La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta',
  'Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata',
  'La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Manchester'
].sort((a,b)=>b.length-a.length);

const PLAYER_META={
  'jugador destacado':{name:'Jugador destacado',team:'Pozos FC',goals:9,assists:4,category:'Veteranos 35+'},
  'segundo goleador':{name:'Segundo goleador',team:'Juventus',goals:7,assists:3,category:'Veteranos 35+'},
  'carlos martínez':{name:'Carlos Martínez',team:'Boavista',goals:6,assists:5,category:'Veteranos 35+'},
  'miguel lópez':{name:'Miguel López',team:'América',goals:5,assists:6,category:'Veteranos 35+'}
};

const VENUES={
  '1':{title:'Campo 1 · Unidad Deportiva Sur',address:'Blvrd Lic. Manuel M. Moreno, Zona Centro, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'},
  '2':{title:'Campo 2 · Unidad Deportiva Sur',address:'Blvrd Lic. Manuel M. Moreno, Zona Centro, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'},
  '3':{title:'Campo 3 · Unidad Deportiva Sur',address:'Blvrd Lic. Manuel M. Moreno, Zona Centro, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'},
  '4':{title:'Campo 4 · Zona Emiliano Zapata',address:'Colonia Emiliano Zapata, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Colonia+Emiliano+Zapata%2C+Juventino+Rosas%2C+Guanajuato'},
  'cerrito de gasca':{title:'Cerrito de Gasca',address:'Cerrito de Gasca, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Cerrito+de+Gasca%2C+Juventino+Rosas%2C+Guanajuato'},
  'pozos':{title:'Pozos',address:'Pozos, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Pozos%2C+Juventino+Rosas%2C+Guanajuato'},
  'tavera':{title:'Tavera',address:'Tavera, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Tavera%2C+Juventino+Rosas%2C+Guanajuato'},
  'san juan':{title:'San Juan de la Cruz',address:'San Juan de la Cruz, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=San+Juan+de+la+Cruz%2C+Juventino+Rosas%2C+Guanajuato'},
  'san julian':{title:'San Julián / Tierra Blanca',address:'San Julián Tierra Blanca, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=San+Julian+Tierra+Blanca%2C+Juventino+Rosas%2C+Guanajuato'},
  'romerillo':{title:'San Antonio de Romerillo',address:'San Antonio de Romerillo, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=San+Antonio+de+Romerillo%2C+Juventino+Rosas%2C+Guanajuato'},
  'cuenda':{title:'Santiago de Cuenda',address:'Santiago de Cuenda, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Santiago+de+Cuenda%2C+Juventino+Rosas%2C+Guanajuato'},
  'fraccionamiento':{title:'Fraccionamiento',address:'Juventino Rosas, Gto.',maps:'https://www.google.com/maps/search/?api=1&query=Fraccionamiento+Juventino+Rosas+Guanajuato'},
  'comontuoso':{title:'Fraccionamiento Comontuoso',address:'Fraccionamiento Comontuoso, Juventino Rosas, Gto.',maps:'https://www.google.com/maps/dir/?api=1&destination=Fraccionamiento+Comontuoso%2C+Juventino+Rosas%2C+Guanajuato'}
};

function q(s,r=document){return r.querySelector(s)}
function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
function norm(t){return (t||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function teamFromText(text){const n=norm(text);return TEAM_NAMES.find(t=>n===norm(t) || n.startsWith(norm(t)+' ') || n.endsWith(' '+norm(t)))||''}

function ensureModal(){
  let bg=q('#v303Modal');
  if(bg)return bg;
  bg=document.createElement('div');
  bg.id='v303Modal';
  bg.className='v30-modal-bg';
  bg.innerHTML='<div class="v30-modal"><div class="v30-modal-head"><h3></h3><button class="v30-close" type="button">×</button></div><div class="v30-modal-body"></div></div>';
  document.body.appendChild(bg);
  q('.v30-close',bg).onclick=()=>bg.classList.remove('show');
  bg.addEventListener('click',e=>{if(e.target===bg)bg.classList.remove('show')});
  return bg;
}
function openModal(title,html){
  const bg=ensureModal();
  q('h3',bg).textContent=title;
  q('.v30-modal-body',bg).innerHTML=html;
  bg.classList.add('show');
  return bg;
}
function toast(msg){
  let t=q('#v303Toast');
  if(!t){t=document.createElement('div');t.id='v303Toast';t.className='v30-toast';document.body.appendChild(t)}
  t.textContent=msg;t.style.display='block';
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.style.display='none',1800);
}
function clickText(exacts){
  const arr=Array.isArray(exacts)?exacts:[exacts];
  const el=qa('button,a,[data-view]').find(x=>arr.some(v=>norm(x.textContent)===norm(v)));
  if(el){el.click();return true}
  return false;
}
function go(view){
  const m={
    matches:['Partidos','Ver jornada','Jornada'],
    table:['Tabla','Ver tabla','Tabla de posiciones'],
    stats:['Estadísticas','Goleo'],
    matchcenter:['Abrir Match Center','LIVE Match Center','Match Center'],
    more:['Más'],
    home:['Inicio']
  };
  if(clickText(m[view]||view))return;
  const el=qa('h1,h2,h3,h4').find(x=>(m[view]||[]).some(v=>norm(x.textContent)===norm(v)));
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}
function setCategory(cat){
  localStorage.setItem('jrCategory',cat);
  const b=qa('button,a').find(x=>norm(x.textContent)===norm(cat));
  if(b)b.click();
}
function logoFor(team){
  const n=norm(team);
  const img=qa('img').find(i=>norm(i.alt||'').includes(n)||norm(i.title||'').includes(n));
  return img?img.src:'';
}
function openTeam(team){
  const meta=TEAM_META[norm(team)]||[localStorage.getItem('jrCategory')||'Liga','Santa Cruz de Juventino Rosas, Guanajuato','Equipo registrado en la Liga Municipal de Fútbol Juventino Rosas.'];
  const logo=logoFor(team);
  const bg=openModal(team,`
    <div class="v30-hero">
      <div class="v30-avatar">${logo?`<img src="${esc(logo)}" alt="${esc(team)}">`:esc(initials(team))}</div>
      <div><div class="v30-chip">${esc(meta[0])}</div><h4>${esc(team)}</h4><p>${esc(meta[2])}</p></div>
    </div>
    <div class="v30-grid">
      <div class="v30-card"><small>Origen / comunidad</small>${esc(meta[1])}</div>
      <div class="v30-card"><small>Acceso rápido</small>Consulta sus partidos y la tabla de su categoría.</div>
    </div>
    <div class="v30-actions">
      <button class="v30-btn primary" id="v303Matches">Ver partidos</button>
      <button class="v30-btn" id="v303Table">Ver tabla</button>
      <a class="v30-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta[1])}">Ver zona en Maps</a>
    </div>`);
  q('#v303Matches',bg).onclick=()=>{setCategory(meta[0]);bg.classList.remove('show');go('matches')};
  q('#v303Table',bg).onclick=()=>{setCategory(meta[0]);bg.classList.remove('show');go('table')};
}
function venueKey(text){
  const n=norm(text);
  if(/^1$/.test(n)||n.includes('campo 1'))return '1';
  if(/^2$/.test(n)||n.includes('campo 2'))return '2';
  if(/^3$/.test(n)||n.includes('campo 3'))return '3';
  if(/^4$/.test(n)||n.includes('campo 4'))return '4';
  if(n.includes('cerrito de gasca'))return 'cerrito de gasca';
  if(n==='pozos'||n.includes('campo pozos'))return 'pozos';
  if(n.includes('tavera'))return 'tavera';
  if(n.includes('san juan'))return 'san juan';
  if(n.includes('san jul'))return 'san julian';
  if(n.includes('romerillo'))return 'romerillo';
  if(n.includes('cuenda'))return 'cuenda';
  if(n.includes('fraccionamiento'))return 'fraccionamiento';
  if(n.includes('comontuoso'))return 'comontuoso';
  return '';
}
function openVenue(key){
  const v=VENUES[key];
  if(!v)return;
  openModal(v.title,`
    <div class="v30-hero"><div class="v30-avatar">📍</div><div><div class="v30-chip">Cancha / sede</div><h4>${esc(v.title)}</h4><p>${esc(v.address)}</p></div></div>
    <div class="v30-actions"><a class="v30-btn primary" target="_blank" rel="noopener" href="${esc(v.maps)}">Cómo llegar en Google Maps</a></div>
  `);
}
function openPlayer(name){
  const p=PLAYER_META[norm(name)];
  if(!p)return;
  const bg=openModal(p.name,`
    <div class="v30-hero"><div class="v30-avatar">👤</div><div><div class="v30-chip">${esc(p.category)}</div><h4>${esc(p.name)}</h4><p>${esc(p.team)} · ${p.goals} goles · ${p.assists} asistencias</p></div></div>
    <div class="v30-actions"><button class="v30-btn primary" id="v303PlayerTeam">Ver equipo</button><button class="v30-btn" id="v303PlayerStats">Ver estadísticas</button></div>
  `);
  q('#v303PlayerTeam',bg).onclick=()=>{bg.classList.remove('show');openTeam(p.team)};
  q('#v303PlayerStats',bg).onclick=()=>{bg.classList.remove('show');go('stats')};
}
function openCats(){
  const bg=openModal('5 categorías',`<div class="v30-note">Elige una categoría y abriré directamente sus partidos.</div><div class="v30-actions">${CATS.map(c=>`<button class="v30-btn" data-v303-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>`);
  qa('[data-v303-cat]',bg).forEach(b=>b.onclick=()=>{setCategory(b.dataset.v303Cat);bg.classList.remove('show');go('matches')});
}
function openFinal(){
  const bg=openModal('Gran Final · Veteranos 35+',`
    <div class="v30-hero"><div class="v30-avatar">🏆</div><div><div class="v30-chip">Sábado 12 de septiembre de 2026 · 4:00 pm</div><h4>C. de Gasca vs Pozos FC</h4><p>Campo 1 · Unidad Deportiva Sur. Campeón por definir.</p></div></div>
    <div class="v30-actions"><button class="v30-btn primary" id="v303MC">Abrir Match Center</button><button class="v30-btn" id="v303Venue">Cómo llegar</button></div>
  `);
  q('#v303MC',bg).onclick=()=>{bg.classList.remove('show');go('matchcenter')};
  q('#v303Venue',bg).onclick=()=>openVenue('1');
}

function safeStaticPatch(){
  // Sólo nodos concretos y pequeños. Nunca reemplaza DIVs grandes ni tarjetas enteras.
  qa('button,a,span,b,strong,small').forEach(el=>{
    const t=(el.textContent||'').trim();
    if(!t)return;
    if(/^5 categorias$/i.test(norm(t))||/^5 categorías$/i.test(t)){el.dataset.v303='cats';el.classList.add('v30-clickable');}
    if(/^LIVE Match Center$/i.test(t)){el.dataset.v303='matchcenter';el.classList.add('v30-clickable');}
    if(/^JR Matchday$/i.test(t)){el.dataset.v303='matches';el.classList.add('v30-clickable');}
    if(/MASTER V\d+/i.test(t)&&/SPORTS 3D/i.test(t)){el.textContent='Liga Juventino Rosas · Centro de competencia';el.dataset.v303='league';el.classList.add('v30-clickable');}
  });

  // Logos sólo en celdas de tablas, nunca en divs contenedores.
  qa('td').forEach(td=>{
    if(td.dataset.v303Logo)return;
    const txt=(td.textContent||'').trim();
    const team=TEAM_NAMES.find(t=>norm(t)===norm(txt));
    if(!team)return;
    td.dataset.v303Logo='1';
    td.dataset.v303Team=team;
    td.classList.add('v30-clickable');
    const logo=logoFor(team);
    if(logo){
      const wrap=document.createElement('span');
      wrap.className='v30-team-badge';
      const mini=document.createElement('span');
      mini.className='v30-mini';
      mini.innerHTML=`<img src="${esc(logo)}" alt="${esc(team)}">`;
      const label=document.createElement('span');
      label.textContent=txt;
      wrap.append(mini,label);
      td.textContent='';
      td.appendChild(wrap);
    }
  });
}

function handleClick(e){
  const t=e.target.closest('button,a,span,b,strong,small,td,th');
  if(!t)return;
  const txt=(t.textContent||'').trim();

  if(t.dataset.v303==='cats'){e.preventDefault();return openCats()}
  if(t.dataset.v303==='matchcenter'){e.preventDefault();return go('matchcenter')}
  if(t.dataset.v303==='matches'){e.preventDefault();return go('matches')}
  if(t.dataset.v303==='league'){e.preventDefault();return openModal('Liga Juventino Rosas','<div class="v30-note">Consulta jornadas, resultados, tablas, equipos, jugadores y sedes desde una sola plataforma.</div>')}

  if(CATS.some(c=>norm(c)===norm(txt))){e.preventDefault();setCategory(CATS.find(c=>norm(c)===norm(txt)));return go('matches')}
  if(/gran final/i.test(txt)){e.preventDefault();return openFinal()}
  if(/c\. de gasca\s+vs\s+pozos fc/i.test(norm(txt))){e.preventDefault();return openFinal()}

  const player=Object.keys(PLAYER_META).find(k=>norm(txt)===norm(k)||norm(txt).startsWith(norm(k)));
  if(player){e.preventDefault();return openPlayer(PLAYER_META[player].name)}

  const team=t.dataset.v303Team||teamFromText(txt);
  if(team){e.preventDefault();return openTeam(team)}

  const vk=venueKey(txt);
  if(vk && (t.tagName==='TD' || /campo|cerrito|pozos|tavera|san juan|san jul|romerillo|cuenda|fraccionamiento|comontuoso/i.test(txt))){
    e.preventDefault();return openVenue(vk);
  }
}

function boot(){
  safeStaticPatch();
  document.addEventListener('click',handleClick,true);
  // Una sola pasada adicional, no reescribe la página a los 2 segundos.
  setTimeout(safeStaticPatch,300);
  window.LJR_V303={openTeam,openVenue,openPlayer,openCats,openFinal};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();