(function(){
"use strict";

const CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
const FALLBACK={
  "Primera Fuerza":["Hermanos","San José FC","Linces","Juventus","Napoli","Lobos CDG","Terrícolas","Galácticos","Franco FC","Herreras FC","Abejas"],
  "Intermedia":["La Canchita Deportes","Galeana","Aldama FC","Malvinas","Capibaras","La Cuadrilla","Mazacotes FC","Dep. Maravillas","Osasuna","San Antonio JRS","Populares","Promesas FC","La Huerta"],
  "Segunda Fuerza":["Tavera FC","Pachangas FC","San Juan FC","Tapatío","Dep. La Luz","San Julián","Barza","San José JRS","San Antonio FC","Célticos FC","Dep. Nopalero","Dep. Zapata"],
  "Veteranos 35+":["C. de Gasca","Juventus","Cuenda","Pozos FC","Boavista","PSV","A. Santiago","F. Tavera","América","Huracán"],
  "Veteranos 50+":["La Esperanza","Dynamo","Boca JRS","Toros de Cuenda","Boavista","Manchester"]
};
const TEAM_INFO={
  "pozos fc":{origin:"Comunidad de Pozos, Juventino Rosas, Guanajuato",desc:"Club tradicional de la liga, participante en Veteranos 35+. Cuenta con historial reciente en liguilla y final.",category:"Veteranos 35+"},
  "juventus":{origin:"Equipo registrado en la cabecera municipal de Juventino Rosas (origen puntual por confirmar)",desc:"Plantel participante en varias jornadas oficiales de la liga. Rival directo de alto nivel en Veteranos 35+.",category:"Veteranos 35+"},
  "c. de gasca":{origin:"Cerrito de Gasca, Juventino Rosas, Guanajuato",desc:"Representativo de Cerrito de Gasca. Se encuentra entre los equipos protagonistas de la categoría Veteranos 35+.",category:"Veteranos 35+"},
  "cuenda":{origin:"Comunidad de Cuenda, Juventino Rosas, Guanajuato",desc:"Equipo con presencia constante en la competencia local. Sus programaciones se registran en las jornadas oficiales.",category:"Veteranos 35+"},
  "boavista":{origin:"Equipo inscrito en la liga municipal de Juventino Rosas",desc:"Participante activo en categoría veteranos. Comunidad específica por confirmar con el administrador.",category:"Veteranos 35+"},
  "psv":{origin:"Equipo inscrito en la liga municipal de Juventino Rosas",desc:"Plantel de veteranos con actividad en jornadas oficiales. Comunidad específica por confirmar.",category:"Veteranos 35+"},
  "a. santiago":{origin:"Comunidad de Santiago / zona registrada por el delegado",desc:"Equipo participante de Veteranos 35+ en la liga municipal.",category:"Veteranos 35+"},
  "f. tavera":{origin:"Comunidad Tavera, Juventino Rosas, Guanajuato",desc:"Representativo de la comunidad Tavera dentro de la liga municipal.",category:"Veteranos 35+"},
  "america":{origin:"Equipo inscrito en la liga municipal de Juventino Rosas",desc:"Participante del torneo local. Comunidad específica por confirmar.",category:"Veteranos 35+"},
  "huracan":{origin:"Equipo inscrito en la liga municipal de Juventino Rosas",desc:"Participante del torneo local. Comunidad específica por confirmar.",category:"Veteranos 35+"},
  "san juan fc":{origin:"San Juan de la Cruz, Juventino Rosas, Guanajuato",desc:"Equipo registrado de la comunidad de San Juan de la Cruz.",category:"Segunda Fuerza"},
  "san julian":{origin:"San Julián, Juventino Rosas, Guanajuato",desc:"Representativo de la comunidad San Julián en la liga municipal.",category:"Segunda Fuerza"},
  "san jose fc":{origin:"San José, Juventino Rosas, Guanajuato",desc:"Equipo de comunidad participante de la liga municipal.",category:"Primera Fuerza"},
  "san jose jrs":{origin:"San José, Juventino Rosas, Guanajuato",desc:"Equipo juvenil/segunda de la zona San José inscrito en la competencia.",category:"Segunda Fuerza"},
  "san antonio jrs":{origin:"San Antonio, Juventino Rosas, Guanajuato",desc:"Equipo participante de la categoría Intermedia.",category:"Intermedia"},
  "san antonio fc":{origin:"San Antonio, Juventino Rosas, Guanajuato",desc:"Equipo participante de Segunda Fuerza.",category:"Segunda Fuerza"},
  "galeana":{origin:"Galeana, Juventino Rosas, Guanajuato",desc:"Equipo registrado de comunidad en la liga municipal.",category:"Intermedia"},
  "la huerta":{origin:"La Huerta, Juventino Rosas, Guanajuato",desc:"Equipo de la comunidad La Huerta inscrito en la liga.",category:"Intermedia"},
  "malvinas":{origin:"Malvinas, Juventino Rosas, Guanajuato",desc:"Equipo comunitario con participación oficial en jornadas.",category:"Intermedia"},
  "la cuadrilla":{origin:"La Cuadrilla, Juventino Rosas, Guanajuato",desc:"Representativo de la comunidad La Cuadrilla.",category:"Intermedia"},
  "dep. zapata":{origin:"Atrás de la colonia Emiliano Zapata / zona Zapata, Juventino Rosas",desc:"Equipo registrado de la zona Zapata.",category:"Segunda Fuerza"},
  "barza":{origin:"Equipo inscrito en la liga municipal de Juventino Rosas",desc:"Equipo participante en Segunda Fuerza.",category:"Segunda Fuerza"},
  "tavera fc":{origin:"Tavera, Juventino Rosas, Guanajuato",desc:"Equipo participante de la comunidad Tavera.",category:"Segunda Fuerza"}
};
const PLAYER_INFO={
  "jugador destacado":{name:"Jugador destacado",team:"Pozos FC",goals:9,role:"Delantero",assists:4,img:"👑",category:"Veteranos 35+",note:"Registro destacado visible en la vista de goleo. Puedes reemplazarlo con el nombre real cuando se capture en la base de datos."},
  "segundo goleador":{name:"Segundo goleador",team:"Juventus",goals:7,role:"Delantero",assists:3,img:"👤",category:"Veteranos 35+",note:"Segunda mejor marca mostrada en la vista actual."},
  "carlos martinez":{name:"Carlos Martínez",team:"Boavista",goals:6,role:"Mediocampista",assists:5,img:"👤",category:"Veteranos 35+",note:"Jugador listado en el panel de goleo actual."},
  "miguel lopez":{name:"Miguel López",team:"América",goals:5,role:"Delantero",assists:6,img:"👤",category:"Veteranos 35+",note:"Jugador listado en el panel de goleo actual."}
};
const VENUES={
  "campo 1":{title:"Campo 1 · Unidad Deportiva Sur",desc:"Cancha ubicada dentro de la Unidad Deportiva Sur de Juventino Rosas. Es una de las canchas principales de la deportiva.",maps:"https://www.google.com/maps/search/Unidad+Deportiva+Sur+Juventino+Rosas+Guanajuato"},
  "campo 2":{title:"Campo 2 · Unidad Deportiva Sur",desc:"Segunda cancha de la Unidad Deportiva Sur, dentro del complejo deportivo principal de Juventino Rosas.",maps:"https://www.google.com/maps/search/Unidad+Deportiva+Sur+Juventino+Rosas+Guanajuato"},
  "campo 3":{title:"Campo 3 · Unidad Deportiva Sur",desc:"Tercera cancha dentro de la Unidad Deportiva Sur. Forma parte del conjunto principal de canchas de la deportiva.",maps:"https://www.google.com/maps/search/Unidad+Deportiva+Sur+Juventino+Rosas+Guanajuato"},
  "campo 4":{title:"Campo 4 · Zona Emiliano Zapata",desc:"Cancha ubicada atrás de la colonia Emiliano Zapata, en Juventino Rosas, Guanajuato.",maps:"https://www.google.com/maps/search/Colonia+Emiliano+Zapata+Juventino+Rosas+Guanajuato"},
  "unidad deportiva sur":{title:"Unidad Deportiva Sur",desc:"Complejo deportivo principal donde se encuentran Campo 1, Campo 2 y Campo 3 en Juventino Rosas.",maps:"https://www.google.com/maps/search/Unidad+Deportiva+Sur+Juventino+Rosas+Guanajuato"},
  "comotoso":{title:"Comotoso",desc:"Cancha/comunidad de la zona de Comotoso en Juventino Rosas. La ubicación exacta puede confirmarse con el delegado local.",maps:"https://www.google.com/maps/search/Comotoso+Juventino+Rosas+Guanajuato"},
  "comontuoso":{title:"Comontuoso",desc:"Cancha/comunidad de la zona conocida como Comontuoso en Juventino Rosas. La ubicación exacta puede confirmarse con el delegado local.",maps:"https://www.google.com/maps/search/Comontuoso+Juventino+Rosas+Guanajuato"},
  "cerrito de gasca":{title:"Cerrito de Gasca",desc:"Comunidad de Juventino Rosas donde se realizan partidos y donde participa el equipo de Gasca.",maps:"https://www.google.com/maps/search/Cerrito+de+Gasca+Juventino+Rosas+Guanajuato"},
  "san juan de la cruz":{title:"San Juan de la Cruz",desc:"Comunidad de Juventino Rosas con sede de partidos oficiales de la liga municipal.",maps:"https://www.google.com/maps/search/San+Juan+de+la+Cruz+Juventino+Rosas+Guanajuato"},
  "cuenda":{title:"Cuenda",desc:"Comunidad de Juventino Rosas donde se disputan encuentros oficiales de la liga.",maps:"https://www.google.com/maps/search/Cuenda+Juventino+Rosas+Guanajuato"},
  "tavera":{title:"Tavera",desc:"Comunidad de Juventino Rosas que funciona como sede de partidos oficiales.",maps:"https://www.google.com/maps/search/Tavera+Juventino+Rosas+Guanajuato"},
  "romerillo":{title:"Romerillo",desc:"Comunidad de Juventino Rosas considerada como sede de algunos encuentros de la liga.",maps:"https://www.google.com/maps/search/Romerillo+Juventino+Rosas+Guanajuato"},
  "rincon de centeno":{title:"Rincón de Centeno",desc:"Comunidad de Juventino Rosas sede de partidos amistosos y oficiales de la liga.",maps:"https://www.google.com/maps/search/Rincon+de+Centeno+Juventino+Rosas+Guanajuato"},
  "fraccionamiento":{title:"Fraccionamiento",desc:"Cancha ubicada en la zona de fraccionamiento dentro de Juventino Rosas. La referencia exacta puede ajustarse por el administrador.",maps:"https://www.google.com/maps/search/Fraccionamiento+Juventino+Rosas+Guanajuato"},
  "san jose":{title:"San José",desc:"Comunidad o sede de San José, Juventino Rosas, utilizada para encuentros oficiales.",maps:"https://www.google.com/maps/search/San+Jose+Juventino+Rosas+Guanajuato"},
  "san julian":{title:"San Julián",desc:"Comunidad de Juventino Rosas utilizada como sede de partidos de la liga.",maps:"https://www.google.com/maps/search/San+Julian+Juventino+Rosas+Guanajuato"},
  "zapata":{title:"Zona Zapata",desc:"Zona ubicada detrás o cerca de la colonia Emiliano Zapata en Juventino Rosas.",maps:"https://www.google.com/maps/search/Emiliano+Zapata+Juventino+Rosas+Guanajuato"}
};

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g,' ').trim();
const currentView=()=>q('.view.active')?.id||'';
const activeCat=()=>window.LJR_V27?.setCategory? (localStorage.getItem('jrCategory')||'Veteranos 35+') : (localStorage.getItem('jrCategory')||'Veteranos 35+');
const data=()=>window.LJR_V20||window.LJR_V18||window.LJR_V20_API?.data||{};

function getTeams(cat){
  const r=data()?.rosters?.[cat];
  if(Array.isArray(r)&&r.length)return r.map(x=>String(x.name||x.team||x).trim()).filter(Boolean);
  return FALLBACK[cat]||[];
}
function allTeams(){
  const set=new Set();
  CATS.forEach(c=>getTeams(c).forEach(t=>set.add(t)));
  return [...set].sort((a,b)=>b.length-a.length);
}
function findCategoryByTeam(team){
  const n=norm(team);
  const info=TEAM_INFO[n];
  if(info?.category)return info.category;
  return CATS.find(c=>getTeams(c).some(t=>norm(t)===n))||activeCat();
}
function findTeamInText(text){
  const tx=norm(text);
  return allTeams().find(t=>tx.includes(norm(t)))||'';
}
function toast(msg){
  q('.v28-toast')?.remove();
  const t=document.createElement('div');
  t.className='v28-toast';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2300);
}
function modal(){
  let m=q('#v28Modal');
  if(m)return m;
  m=document.createElement('div');
  m.id='v28Modal';
  m.className='v28-modal-bg';
  m.innerHTML=`<div class="v28-modal" role="dialog" aria-modal="true"><div class="v28-modal-head"><h3 id="v28ModalTitle">Liga Juventino Rosas</h3><button class="v28-close" aria-label="Cerrar">×</button></div><div class="v28-modal-body" id="v28ModalBody"></div></div>`;
  document.body.appendChild(m);
  q('.v28-close',m).onclick=()=>m.classList.remove('show');
  m.onclick=e=>{if(e.target===m)m.classList.remove('show')};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('show')});
  return m;
}
function openModal(title,html){
  const m=modal();
  q('#v28ModalTitle',m).textContent=title;
  q('#v28ModalBody',m).innerHTML=html;
  m.classList.add('show');
  return m;
}
function goView(name){
  const btn=q(`[data-view="${name}"]`);
  if(btn){btn.click();return true}
  if(typeof window.showView==='function'){try{window.showView(name);return true}catch(e){}}
  return false;
}
function setCat(cat){
  try{localStorage.setItem('jrCategory',cat)}catch(e){}
  if(window.LJR_V27?.setCategory)window.LJR_V27.setCategory(cat);
}
function openTeam(team){
  const key=norm(team), info=TEAM_INFO[key]||{};
  const cat=findCategoryByTeam(team);
  const maps=info.origin?`https://www.google.com/maps/search/${encodeURIComponent(info.origin)}`:'';
  const m=openModal(team,`
    <div class="v28-hero"><div class="v28-avatar">${esc(team.charAt(0).toUpperCase()||'⚽')}</div><div><div class="v28-player-chip">${esc(cat)}</div><h4>${esc(team)}</h4><p>${esc(info.desc||'Equipo registrado en la Liga Municipal de Fútbol Juventino Rosas. Desde esta ficha puedes ir directo a sus partidos, tabla y categoría.')}</p></div></div>
    <div class="v28-grid" style="margin-top:12px">
      <div class="v28-card"><small style="display:block;color:#9aa1ad;font:800 10px/1 system-ui;text-transform:uppercase">Origen / comunidad</small><div style="margin-top:8px;font:850 16px/1.35 system-ui">${esc(info.origin||'Por confirmar con el delegado o la administración de la liga')}</div></div>
      <div class="v28-card"><small style="display:block;color:#9aa1ad;font:800 10px/1 system-ui;text-transform:uppercase">Acceso rápido</small><div style="margin-top:8px;color:#d7dce4;font:700 12px/1.55 system-ui">Consulta jornada, tabla de posiciones y más información del equipo.</div></div>
    </div>
    <div class="v28-actions">
      <button class="v28-btn primary" id="v28TeamMatches">Ver sus partidos</button>
      <button class="v28-btn" id="v28TeamTable">Ver tabla</button>
      ${maps?`<a class="v28-btn" href="${maps}" target="_blank" rel="noopener">Ubicación / Maps</a>`:''}
    </div>
    <div class="v28-note" style="margin-top:12px">Si después capturas más datos reales del equipo en la base de datos (delegado, uniforme, escudo, fundación, historial), esta ficha se puede volver todavía más completa.</div>
  `);
  q('#v28TeamMatches',m).onclick=()=>{setCat(cat);m.classList.remove('show');goView('matches')};
  q('#v28TeamTable',m).onclick=()=>{setCat(cat);m.classList.remove('show');goView('table')};
}
function openPlayer(name){
  const p=PLAYER_INFO[norm(name)]||{name,team:'Equipo por definir',goals:'—',role:'Jugador',assists:'—',img:'👤',category:activeCat(),note:'Ficha básica del jugador. Puedes sustituir estos datos cuando ya tengas registro real con foto, CURP/INE y equipo.'};
  const m=openModal(p.name,`
    <div class="v28-hero"><div class="v28-avatar">${esc(p.img||'👤')}</div><div><div class="v28-player-chip">${esc(p.category||activeCat())}</div><h4>${esc(p.name)}</h4><p>${esc(p.note||'Jugador registrado en la plataforma de la liga.')}</p></div></div>
    <div class="v28-grid-4" style="margin-top:12px">
      <div class="v28-metric"><small>Equipo</small><b>${esc(p.team)}</b></div>
      <div class="v28-metric"><small>Goles</small><b>${esc(String(p.goals))}</b></div>
      <div class="v28-metric"><small>Asistencias</small><b>${esc(String(p.assists))}</b></div>
      <div class="v28-metric"><small>Rol</small><b>${esc(p.role)}</b></div>
    </div>
    <div class="v28-actions"><button class="v28-btn primary" id="v28PlayerTeam">Ver equipo</button><button class="v28-btn" id="v28PlayerStats">Ver estadísticas</button></div>
  `);
  q('#v28PlayerTeam',m).onclick=()=>{m.classList.remove('show');openTeam(p.team)};
  q('#v28PlayerStats',m).onclick=()=>{setCat(p.category||activeCat());m.classList.remove('show');goView('stats')};
}
function openVenue(label){
  const key=Object.keys(VENUES).find(k=>norm(label).includes(k))||'';
  const v=VENUES[key]||{title:label,desc:'Sede/cancha registrada en la liga municipal. Puedes afinar la descripción y la dirección exacta desde el panel de administración.',maps:`https://www.google.com/maps/search/${encodeURIComponent(label+' Juventino Rosas Guanajuato')}`};
  openModal(v.title,`
    <div class="v28-hero"><div class="v28-avatar">📍</div><div><div class="v28-player-chip">Cancha / sede</div><h4>${esc(v.title)}</h4><p>${esc(v.desc)}</p></div></div>
    <div class="v28-actions"><a class="v28-btn primary" href="${esc(v.maps)}" target="_blank" rel="noopener">Abrir en Google Maps</a><button class="v28-btn" id="v28VenueMatches">Ver partidos</button></div>
    <div class="v28-note" style="margin-top:12px">Tip: si después capturas coordenadas exactas en tu base de datos, este botón puede abrir la ubicación exacta y no sólo una búsqueda aproximada.</div>
  `);
  setTimeout(()=>{const b=q('#v28VenueMatches'); if(b)b.onclick=()=>{q('#v28Modal')?.classList.remove('show');goView('matches')}},50);
}
function openCategories(){
  const m=openModal('Categorías de la liga',`<div class="v28-note">La liga se administra actualmente en 5 categorías. Elige una para cambiar la vista principal de la plataforma.</div><div class="v28-grid">${CATS.map(c=>`<button class="v28-btn ${c===activeCat()?'primary':''}" data-v28-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>`);
  qa('[data-v28-cat]',m).forEach(b=>b.onclick=()=>{setCat(b.dataset.v28Cat);m.classList.remove('show');toast('Categoría activa: '+b.dataset.v28Cat)});
}
function openLeaguePill(){
  openModal('Liga Municipal de Fútbol Juventino Rosas',`<div class="v28-note">Plataforma oficial en crecimiento para partidos, tabla, estadísticas, jugadores, sanciones y control administrativo. Aquí la idea es que la liga tenga una herramienta moderna, rápida y útil para dueños de equipos, jugadores y afición.</div><div class="v28-actions"><button class="v28-btn primary" id="v28InfoHome">Ir a inicio</button><button class="v28-btn" id="v28InfoAdmin">Abrir JR Control</button></div>`);
  setTimeout(()=>{q('#v28InfoHome')?.addEventListener('click',()=>{q('#v28Modal')?.classList.remove('show');goView('home')});q('#v28InfoAdmin')?.addEventListener('click',()=>{q('#v28Modal')?.classList.remove('show');document.querySelector('[data-view="admin"]')?.click()||document.querySelector('[data-view="more"]')?.click()})},60);
}
function openLiveMinute(min){
  openModal('Estado del partido',`<div class="v28-note">Indicador interactivo del minuto de juego. Puedes conectarlo después a un operador de partido para que el minuto se actualice en vivo desde la administración.</div><div class="v28-hero"><div class="v28-avatar">⏱️</div><div><div class="v28-player-chip">En vivo</div><h4>Minuto ${esc(min)}</h4><p>Marcador en curso y control de tiempo del partido seleccionado.</p></div></div><div class="v28-actions"><button class="v28-btn primary" id="v28GoMatchCenter">Abrir Match Center</button></div>`);
  setTimeout(()=>q('#v28GoMatchCenter')?.addEventListener('click',()=>{q('#v28Modal')?.classList.remove('show');goView('matchcenter')}),60);
}

function patchChampionPending(){
  qa('section,.section,div').forEach(sec=>{
    const t=(sec.textContent||'');
    if(!/Bracket eliminatorio/i.test(t))return;
    qa('*',sec).forEach(el=>{
      const tx=(el.textContent||'').trim();
      if(/^CAMPEÓN$/i.test(tx) || /^🏆\s*CAMPEÓN$/i.test(tx)) el.textContent='🏆 CAMPEÓN POR DEFINIR';
      if(/^Pozos FC$/i.test(tx) && /campeon|campeón/i.test(sec.textContent||'')) el.textContent='Por determinar';
    });
  });
}
function annotateTeamElements(){
  const teams=allTeams();
  const elems=qa('button,a,article,div,span,strong,b,h1,h2,h3,h4,h5,p,small');
  elems.forEach(el=>{
    if(el.dataset.v28Annotated==='1')return;
    const tx=(el.textContent||'').trim();
    if(!tx || tx.length>120)return;
    const team=teams.find(t=>norm(tx)===norm(t) || norm(tx).endsWith(norm(t)) || norm(tx).startsWith(norm(t)));
    if(team){
      el.dataset.v28OpenTeam=team;
      el.tabIndex=0;
      el.dataset.v28Annotated='1';
      const prev=el.previousElementSibling, next=el.nextElementSibling;
      [prev,next].forEach(sib=>{
        if(!sib || sib.dataset.v28OpenTeam) return;
        const st=(sib.textContent||'').trim();
        if(st && st.length<=2){sib.dataset.v28OpenTeam=team;sib.tabIndex=0;sib.dataset.v28Annotated='1'}
      });
    }
  });
}
function fixPlayerCards(){
  const cards=qa('.card,article,div').filter(el=>/Jugador destacado|Segundo goleador|Carlos Martínez|Miguel López/i.test(el.textContent||''));
  const specs=[
    PLAYER_INFO['jugador destacado'],PLAYER_INFO['segundo goleador'],PLAYER_INFO['carlos martinez'],PLAYER_INFO['miguel lopez']
  ];
  cards.slice(0,4).forEach((card,i)=>{
    const p=specs[i];
    if(!p)return;
    card.classList.add('v28-player-fixed');
    card.dataset.v28OpenPlayer=p.name;
    card.setAttribute('tabindex','0');
    card.innerHTML=`<div class="v28-player-avatar">${esc(p.img)}</div><div class="v28-player-info"><span class="v28-player-name">${esc(p.name)}</span><span class="v28-player-team">${esc(p.team)}</span></div><div class="v28-player-stat">${esc(String(p.goals))}</div>`;
  });
}
function patchPillTexts(){
  qa('button,a,div,span').forEach(el=>{
    const tx=(el.textContent||'').trim();
    if(!tx)return;
    if(/5 categorias|5 categorías/i.test(tx) && !el.dataset.v28Badge){
      el.dataset.v28Badge='categories'; el.dataset.v28Action='categories'; el.tabIndex=0;
    }
    if(/MASTER V14/i.test(tx)){
      el.textContent='LIGA JUVENTINO ROSAS · EXPERIENCIA OFICIAL';
      el.classList.add('v28-league-pill');
      el.dataset.v28Action='league-pill'; el.tabIndex=0;
    }
    if(/^73'$/i.test(tx) || /^73’$/i.test(tx)){
      el.dataset.v28Action='live-minute'; el.dataset.v28Minute='73\''; el.tabIndex=0;
      el.innerHTML='<span class="v28-live-indicator live"><span class="dot"></span><span>73\'</span></span>';
    }
    if(/Campo\s*\d|Unidad Deportiva Sur|Comotoso|Comontuoso|Cerrito de Gasca|San Juan de la Cruz|Rincon de Centeno|Rincón de Centeno|Romerillo|Cuenda|Tavera|Fraccionamiento|San Jose|San José|San Julian|San Julián|Zapata/i.test(tx) && !el.dataset.v28OpenVenue){
      el.dataset.v28OpenVenue=tx; el.tabIndex=0;
    }
    if(/^Match Center$/i.test(tx)){el.dataset.v28Action='matchcenter';el.tabIndex=0;}
    if(/^Jornada$/i.test(tx)){el.dataset.v28Action='matches';el.tabIndex=0;}
    if(/^Liguilla$/i.test(tx)){el.dataset.v28Action='bracket';el.tabIndex=0;}
  });
}
function patchChampionDisplayHome(){
  qa('button,a,article,div,span,h3,h4,p').forEach(el=>{
    const tx=(el.textContent||'').trim();
    if(/^Pozos FC$/i.test(tx)){
      const scope=(el.parentElement?.textContent||'')+' '+(el.closest('section,.section,article,div')?.textContent||'');
      if(/Gran Final|EVENTO PRINCIPAL|Bracket eliminatorio|camp(eo|ó)n/i.test(scope)){
        // Sólo en el bloque de final/liguilla, no en todas partes.
        const upper=(el.previousElementSibling?.textContent||'')+' '+(el.parentElement?.previousElementSibling?.textContent||'')+' '+scope;
        if(/campeon|campeón/i.test(upper) || /bracket eliminatorio/i.test(upper)){
          el.textContent='Por determinar';
        }
      }
    }
  });
}
function setupPulse(){
  const host=qa('section,.section,div').find(el=>/Pulso de la afici[oó]n/i.test(el.textContent||''));
  if(!host)return;
  const cards=qa('button,a,article,div',host).filter(el=>/[🔥⚽👏😮]/.test(el.textContent||''));
  if(!cards.length)return;
  const countsKey='jrV28PulseCounts';
  const voteKey='jrV28PulseVote';
  let counts; try{counts=JSON.parse(localStorage.getItem(countsKey)||'null')}catch(e){}
  if(!counts)counts={fire:0,ball:0,clap:0,wow:0};
  const vote=localStorage.getItem(voteKey)||'';
  const keys=['fire','ball','clap','wow'];
  const emojis={fire:'🔥',ball:'⚽',clap:'👏',wow:'😮'};
  cards.slice(0,4).forEach((card,i)=>{
    const key=keys[i];
    card.dataset.v28Pulse=key;
    card.tabIndex=0;
    card.innerHTML=`<div style="display:flex;align-items:center;justify-content:center;gap:12px;font:900 22px/1 system-ui"><span>${emojis[key]}</span><span style="color:#22e07a" data-v28-pulse-count="${key}">${counts[key]||0}</span></div>`;
    if(vote===key)card.style.borderColor='rgba(34,224,122,.38)';
  });
  if(!q('.v28-pulse-note',host)){
    const note=document.createElement('div');
    note.className='v28-note v28-pulse-note';
    note.textContent='Pulso local: un voto por dispositivo. Si vuelves a tocar otro emoji, se moverá tu voto sin duplicarlo.';
    host.appendChild(note);
  }
}
function applyPulseVote(key){
  const countsKey='jrV28PulseCounts';
  const voteKey='jrV28PulseVote';
  let counts; try{counts=JSON.parse(localStorage.getItem(countsKey)||'null')}catch(e){}
  if(!counts)counts={fire:0,ball:0,clap:0,wow:0};
  const prev=localStorage.getItem(voteKey)||'';
  if(prev===key){toast('Ya votaste con esta reacción.'); return}
  if(prev && counts[prev]>0)counts[prev]--;
  counts[key]=(counts[key]||0)+1;
  localStorage.setItem(countsKey,JSON.stringify(counts));
  localStorage.setItem(voteKey,key);
  qa('[data-v28-pulse-count]').forEach(el=>el.textContent=String(counts[el.dataset.v28PulseCount]||0));
  qa('[data-v28-pulse]').forEach(el=>el.style.borderColor='');
  q(`[data-v28-pulse="${key}"]`)?.style.setProperty('border-color','rgba(34,224,122,.38)');
  toast('Voto guardado en este dispositivo.');
}

function bootstrapInteractions(){
  annotateTeamElements();
  patchPillTexts();
  patchChampionPending();
  patchChampionDisplayHome();
  fixPlayerCards();
  setupPulse();
}

function clickHandler(e){
  const pulse=e.target.closest('[data-v28-pulse]');
  if(pulse){e.preventDefault();applyPulseVote(pulse.dataset.v28Pulse);return}

  const teamNode=e.target.closest('[data-v28-open-team],[data-v27-team],[data-v27-team-card]');
  if(teamNode){
    e.preventDefault();
    const team=teamNode.dataset.v28OpenTeam||teamNode.dataset.v27Team||teamNode.dataset.v27TeamCard||findTeamInText(teamNode.textContent||'');
    if(team){openTeam(team);return}
  }

  const playerNode=e.target.closest('[data-v28-open-player]');
  if(playerNode){e.preventDefault();openPlayer(playerNode.dataset.v28OpenPlayer);return}

  const venueNode=e.target.closest('[data-v28-open-venue]');
  if(venueNode){e.preventDefault();openVenue(venueNode.dataset.v28OpenVenue);return}

  const action=e.target.closest('[data-v28-action]');
  if(action){
    e.preventDefault();
    const a=action.dataset.v28Action;
    if(a==='categories'){openCategories();return}
    if(a==='league-pill'){openLeaguePill();return}
    if(a==='live-minute'){openLiveMinute(action.dataset.v28Minute||"73'");return}
    if(a==='matchcenter'){goView('matchcenter');return}
    if(a==='matches'){goView('matches');return}
    if(a==='bracket'){
      const share=q('#shareBracket');
      if(share) share.closest('section,.section')?.scrollIntoView({behavior:'smooth',block:'start'});
      else goView('more');
      return;
    }
  }

  // Click en cualquier texto de equipo todavía no anotado.
  const raw=findTeamInText((e.target.textContent||'').trim());
  if(raw && (e.target.textContent||'').trim().length<80){
    openTeam(raw);
  }
}
function keyHandler(e){
  if(e.key!=='Enter' && e.key!==' ')return;
  const el=e.target.closest('[data-v28-open-team],[data-v28-open-player],[data-v28-open-venue],[data-v28-action],[data-v28-pulse]');
  if(el){e.preventDefault();el.click();}
}
function boot(){
  bootstrapInteractions();
  document.addEventListener('click',clickHandler);
  document.addEventListener('keydown',keyHandler);
  setTimeout(bootstrapInteractions,600);
  setTimeout(bootstrapInteractions,1400);
  window.LJR_V28={openTeam,openPlayer,openVenue,openCategories,bootstrapInteractions};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
