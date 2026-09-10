
/* MASTER V25 — Liga Juventino Rosas: experiencia pública + operación real de liga.
   Código propio. Usa patrones, no copia archivos de terceros. */
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
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const store=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch(e){}};
const load=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key));return x??fallback}catch(e){return fallback}};
const api=()=>window.LJR_V20_API||null;
const activeCat=()=>api()?.getCategory?.()||localStorage.getItem("jrCategory")||"Veteranos 35+";

function cleanTeam(s){
  return String(s||"")
    .replace(/^CCuenda$/i,"Cuenda")
    .replace(/AmÃ©rica/gi,"América")
    .replace(/Terricolas/gi,"Terrícolas")
    .replace(/Galacticos/gi,"Galácticos")
    .replace(/Tapatio/gi,"Tapatío")
    .replace(/San Julian/gi,"San Julián")
    .replace(/San Jose/gi,"San José")
    .replace(/Huracan/gi,"Huracán");
}
function teams(cat){
  const d=window.LJR_V20||api()?.data||window.LJR_V18||null;
  const r=d?.rosters?.[cat];
  if(Array.isArray(r)&&r.length)return r.map(x=>cleanTeam(x.name||x.team||x)).filter(Boolean);
  return FALLBACK[cat]||[];
}
function goView(name){
  const btn=q(`[data-view="${name}"]`);
  if(btn){btn.click();return true}
  if(typeof window.showView==="function"){try{window.showView(name);return true}catch(e){}}
  return false;
}
function clickAdminText(text){
  const n=norm(text);
  const btn=qa("#view-admin button").find(b=>norm(b.textContent).includes(n));
  if(btn){btn.click();return true}
  return false;
}
function setCategory(cat){
  if(!CATS.includes(cat))return;
  const candidates=qa("[data-category],[data-v21-cat],[data-v20-cat]");
  const original=candidates.find(el=>
    (el.dataset.category||el.dataset.v21Cat||el.dataset.v20Cat)===cat
  );
  if(original){original.click()}
  else{
    try{localStorage.setItem("jrCategory",cat)}catch(e){}
    try{api()?.setCategory?.(cat)}catch(e){}
    qa(".categoryText").forEach(x=>x.textContent=cat);
  }
  setTimeout(()=>{syncV25Cats();renderStandingsSummary();},160);
}
function syncV25Cats(){
  const cat=activeCat();
  qa("[data-v25-cat]").forEach(b=>{
    b.classList.toggle("active",b.dataset.v25Cat===cat);
    if(b.dataset.v25Cat===cat)b.scrollIntoView?.({behavior:"smooth",block:"nearest",inline:"center"});
  });
}
function nextTuesday(){
  const d=new Date(), out=new Date(d);
  const delta=(2-d.getDay()+7)%7;
  out.setDate(d.getDate()+delta);
  if(delta===0 && d.getHours()>=20)out.setDate(out.getDate()+7);
  return out;
}
function dateMx(d){
  return new Intl.DateTimeFormat("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
}
function folio(){
  const n=load("jrV25Folio",1000)+1; store("jrV25Folio",n);
  return "JR-"+new Date().getFullYear()+"-"+String(n).padStart(5,"0");
}
function audit(type,detail){
  const a=load("jrV25Audit",[]);
  a.unshift({at:new Date().toISOString(),type,detail});
  store("jrV25Audit",a.slice(0,100));
}

function modal(){
  let bg=q("#v25Modal");
  if(bg)return bg;
  bg=document.createElement("div");
  bg.id="v25Modal";bg.className="v25-modal-bg";
  bg.innerHTML=`<div class="v25-modal" role="dialog" aria-modal="true">
    <div class="v25-modal-head"><h3 id="v25ModalTitle">Liga Juventino Rosas</h3><button class="v25-close" aria-label="Cerrar">×</button></div>
    <div class="v25-modal-body" id="v25ModalBody"></div>
  </div>`;
  document.body.appendChild(bg);
  q(".v25-close",bg).onclick=()=>bg.classList.remove("show");
  bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")bg.classList.remove("show")});
  return bg;
}
function openModal(title,html){
  const m=modal();
  q("#v25ModalTitle",m).textContent=title;
  q("#v25ModalBody",m).innerHTML=html;
  m.classList.add("show");
  return m;
}

function replaceOldCopy(){
  const lead=q(".v14-lead");
  if(lead){
    lead.textContent="El fútbol de Juventino Rosas, en un solo lugar. Consulta jornadas, descubre a los equipos y sigue los resultados de tu categoría. Nuestra cancha, nuestra gente, nuestra liga.";
  }
  const p=q("#v23FootballOS .v23-copy");
  if(p){
    p.textContent="Un solo sistema para consultar la competencia y para operar la liga: calendarios, Match Center, tácticas, equipos, estadísticas, Copa y herramientas administrativas.";
  }
}

function installHomeHub(){
  const home=q("#view-home");
  if(!home||q("#v25LeagueHub"))return;
  const sec=document.createElement("section");
  sec.id="v25LeagueHub";sec.className="v25-shell";
  sec.innerHTML=`<div class="v25-shell-inner">
    <div class="v25-kicker">Centro de Liga · MASTER V25</div>
    <h2 class="v25-title">Todo Juventino Rosas, en un solo lugar.</h2>
    <p class="v25-lead">Consulta partidos y tablas, sigue a tu equipo y entra a las herramientas que usan quienes organizan la liga. La experiencia pública y JR Control comparten la misma estructura de categorías.</p>
    <div class="v25-status-row">
      <span class="v25-pill">Categoría activa: <strong class="v25-current-cat">${esc(activeCat())}</strong></span>
      <span class="v25-pill">Junta de delegados: <strong>martes</strong></span>
      <span class="v25-pill">Próxima junta: <strong>${esc(dateMx(nextTuesday()))}</strong></span>
    </div>
    <div class="v25-grid">
      <button class="v25-action-card" data-v25-go="matches"><span>📅</span><b>Jornadas y partidos</b><small>Calendarios por categoría y descarga para compartir.</small></button>
      <button class="v25-action-card" data-v25-go="table"><span>🏆</span><b>Tabla de posiciones</b><small>Clasificación oficial y resumen de los primeros lugares.</small></button>
      <button class="v25-action-card" data-v25-go="teams"><span>🛡️</span><b>Equipos de la liga</b><small>Plantillas y categorías vigentes.</small></button>
      <button class="v25-action-card" data-v25-action="contacts"><span>📞</span><b>Directorio de delegados</b><small>Contacto rápido de encargados y responsables de equipos.</small></button>
    </div>
    <div class="v25-fan">
      <div class="v25-fan-box">
        <h4>🔥 Pulso de la afición</h4><p>Reacciones guardadas en este dispositivo. La versión con Supabase podrá sumar votos de toda la liga en tiempo real.</p>
        <div class="v25-reactions" id="v25Reactions"></div>
      </div>
      <div class="v25-fan-box">
        <h4>⭐ Seguir equipo</h4>
        <div class="v25-field"><select id="v25FavoriteTeam"></select></div>
      </div>
      <div class="v25-fan-box">
        <h4>🎯 Pronóstico</h4><p>Guarda un marcador por diversión; no modifica resultados oficiales.</p>
        <div class="v25-form-actions"><button class="v25-btn" data-v25-action="prediction">Crear pronóstico</button></div>
      </div>
    </div>
  </div>`;
  const hero=q("#v14CinematicHero",home)||home.firstElementChild;
  if(hero)hero.insertAdjacentElement("afterend",sec);else home.prepend(sec);
  renderFan();
}

function renderFan(){
  const host=q("#v25Reactions"); if(!host)return;
  const counts=load("jrV25Reactions",{fire:0,ball:0,clap:0,wow:0});
  const defs=[["fire","🔥"],["ball","⚽"],["clap","👏"],["wow","😮"]];
  host.innerHTML=defs.map(([k,e])=>`<button class="v25-reaction" data-v25-react="${k}">${e}<b>${counts[k]||0}</b></button>`).join("");
  const sel=q("#v25FavoriteTeam");
  if(sel){
    const all=[...new Set(CATS.flatMap(teams))].sort((a,b)=>a.localeCompare(b,"es"));
    const fav=localStorage.getItem("jrV25FavoriteTeam")||"";
    sel.innerHTML=`<option value="">Elige un equipo</option>`+all.map(t=>`<option ${t===fav?"selected":""}>${esc(t)}</option>`).join("");
    sel.onchange=()=>{localStorage.setItem("jrV25FavoriteTeam",sel.value);audit("Afición","Equipo favorito: "+sel.value)};
  }
}

function tableCategoryRail(){
  const view=q("#view-table"); if(!view)return;
  let rail=q("#v25TableCats");
  if(!rail){
    rail=document.createElement("div");rail.id="v25TableCats";rail.className="v25-category-rail";
    rail.innerHTML=CATS.map(c=>`<button data-v25-cat="${esc(c)}">${esc(c)}</button>`).join("");
    const title=q(".section-title",view);
    if(title)title.insertAdjacentElement("afterend",rail);else view.prepend(rail);
  }
  syncV25Cats();
}
function renderStandingsSummary(){
  const view=q("#view-table"); if(!view)return;
  q("#v23Analytics")?.remove();
  let wrap=q("#v25StandingsSummary");
  if(!wrap){
    wrap=document.createElement("section");
    wrap.id="v25StandingsSummary";wrap.className="v25-standings-summary";
    const rail=q("#v25TableCats");
    if(rail)rail.insertAdjacentElement("afterend",wrap);
    else view.prepend(wrap);
  }
  const rows=qa("tbody tr",view).filter(r=>qa("td",r).length>=2 && r.offsetParent!==null);
  const cat=activeCat();
  if(!rows.length){
    wrap.innerHTML=`<div class="v25-empty-summary"><b>${esc(cat)}</b><br>La tabla general todavía no está capturada como dato oficial para esta categoría. Las jornadas sí pueden consultarse sin inventar puntos.</div>`;
    return;
  }
  const info=rows.slice(0,3).map((r,i)=>{
    const cells=qa("td",r).map(c=>c.textContent.trim());
    const team=cleanTeam(cells[1]||`Equipo ${i+1}`);
    const pts=cells[cells.length-1]||"—";
    return {i:i+1,team,pts};
  });
  wrap.innerHTML=info.map(x=>`<article class="v25-rank-card">
    <div class="v25-rank-number">${x.i}</div>
    <div class="v25-rank-team"><small>${x.i===1?"Líder":"Posición "+x.i}</small><strong>${esc(x.team)}</strong></div>
    <div class="v25-rank-points">${esc(x.pts)}<small>PTS</small></div>
  </article>`).join("");
}
function installTableUpgrade(){
  tableCategoryRail();
  renderStandingsSummary();
}

function adminCounts(){
  const players=load("jrV25Players",[]);
  const delegates=load("jrV25Delegates",[]);
  const sanctions=load("jrV25Sanctions",[]).filter(x=>x.active!==false);
  const docs=players.filter(x=>!x.hasINE||!x.hasCURPDoc).length;
  return {players:players.length,delegates:delegates.length,sanctions:sanctions.length,docs};
}
function installAdminPro(){
  const view=q("#view-admin");if(!view||q("#v25AdminPro"))return;
  const sec=document.createElement("section");sec.id="v25AdminPro";sec.className="v25-admin";
  sec.innerHTML=`<div class="v25-admin-head">
    <div><div class="v25-kicker">Operación de liga</div><h3>Centro administrativo JR</h3>
    <p>Altas de jugadores, expedientes, credenciales, delegados, juntas de los martes, sanciones y control de jornada. La demo guarda sólo datos operativos en este navegador.</p></div>
  </div>
  <div class="v25-admin-kpis" id="v25AdminKpis"></div>
  <div class="v25-admin-tools">
    <button class="v25-admin-tool" data-v25-action="player"><span>🪪</span><b>Registrar jugador</b><small>Foto, CURP, INE, expediente y credencial.</small></button>
    <button class="v25-admin-tool" data-v25-action="player-list"><span>👥</span><b>Expedientes</b><small>Revisar altas y documentos pendientes.</small></button>
    <button class="v25-admin-tool" data-v25-action="delegates"><span>📇</span><b>Delegados y contactos</b><small>Directorio de responsables por equipo.</small></button>
    <button class="v25-admin-tool" data-v25-action="meeting"><span>🗓️</span><b>Junta de los martes</b><small>Asistencia, agenda, acuerdos y minuta.</small></button>
    <button class="v25-admin-tool" data-v25-action="sanctions"><span>🟥</span><b>Sanciones</b><small>Control por jugador, equipo y partidos.</small></button>
    <button class="v25-admin-tool" data-v25-action="matchday-admin"><span>🎛️</span><b>Centro de jornada</b><small>Checklist, árbitros, campos, resultados y reportes.</small></button>
  </div>`;
  const title=q(".section-title",view);
  if(title)title.insertAdjacentElement("afterend",sec);else view.prepend(sec);
  renderAdminKpis();
}
function renderAdminKpis(){
  const host=q("#v25AdminKpis");if(!host)return;
  const c=adminCounts();
  host.innerHTML=`
    <div class="v25-kpi"><small>Jugadores V25</small><strong>${c.players}</strong></div>
    <div class="v25-kpi"><small>Delegados</small><strong>${c.delegates}</strong></div>
    <div class="v25-kpi"><small>Sanciones activas</small><strong>${c.sanctions}</strong></div>
    <div class="v25-kpi"><small>Expedientes pendientes</small><strong>${c.docs}</strong></div>`;
}
function fileToData(file){
  return new Promise(resolve=>{
    if(!file){resolve("");return}
    const r=new FileReader();r.onload=()=>resolve(String(r.result||""));r.onerror=()=>resolve("");r.readAsDataURL(file);
  });
}
function openPlayerForm(){
  const cat=activeCat();
  const m=openModal("Registrar jugador y generar credencial",`
    <div class="v25-note"><b>Privacidad:</b> esta versión estática NO guarda la CURP completa ni archivos de INE/CURP en localStorage ni en GitHub. Los archivos se usan sólo para revisar/generar la vista en esta sesión. En producción deben ir a almacenamiento privado con autenticación y permisos.</div>
    <div class="v25-form-grid">
      <div class="v25-field full"><label>Nombre completo</label><input id="v25PName" autocomplete="off"></div>
      <div class="v25-field"><label>Categoría</label><select id="v25PCat">${CATS.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
      <div class="v25-field"><label>Equipo</label><select id="v25PTeam"></select></div>
      <div class="v25-field"><label>Número</label><input id="v25PNum" type="number" min="0" max="99"></div>
      <div class="v25-field"><label>Posición</label><select id="v25PPos"><option>Portero</option><option>Defensa</option><option>Medio</option><option>Delantero</option><option>Sin definir</option></select></div>
      <div class="v25-field"><label>Fecha de nacimiento</label><input id="v25PDob" type="date"></div>
      <div class="v25-field"><label>CURP</label><input id="v25PCurp" maxlength="18" autocomplete="off" placeholder="18 caracteres"></div>
      <div class="v25-field"><label>Fotografía del jugador</label><input id="v25PPhoto" type="file" accept="image/*"></div>
      <div class="v25-field"><label>INE (imagen/PDF)</label><input id="v25PIne" type="file" accept="image/*,application/pdf"></div>
      <div class="v25-field"><label>CURP (imagen/PDF)</label><input id="v25PCurpFile" type="file" accept="image/*,application/pdf"></div>
    </div>
    <div class="v25-form-actions"><button class="v25-btn primary" id="v25CreatePlayer">Registrar y generar credencial</button></div>
    <div id="v25CredentialHost"></div>`);
  const catSel=q("#v25PCat",m),teamSel=q("#v25PTeam",m);
  const fill=()=>{teamSel.innerHTML=teams(catSel.value).map(x=>`<option>${esc(x)}</option>`).join("")};fill();catSel.onchange=fill;
  q("#v25CreatePlayer",m).onclick=async()=>{
    const name=q("#v25PName",m).value.trim();
    const curp=q("#v25PCurp",m).value.trim().toUpperCase().replace(/\s/g,"");
    if(!name){alert("Escribe el nombre del jugador.");return}
    if(curp && curp.length!==18){alert("La CURP debe tener 18 caracteres.");return}
    const photoFile=q("#v25PPhoto",m).files[0];
    const ineFile=q("#v25PIne",m).files[0];
    const curpFile=q("#v25PCurpFile",m).files[0];
    const photo=await fileToData(photoFile);
    const id=folio();
    const rec={
      id,name,category:catSel.value,team:teamSel.value,
      number:q("#v25PNum",m).value||"",
      position:q("#v25PPos",m).value,
      dob:q("#v25PDob",m).value||"",
      curpMasked:curp?curp.slice(0,4)+"************"+curp.slice(-2):"",
      hasINE:!!ineFile,hasCURPDoc:!!curpFile,hasPhoto:!!photoFile,
      createdAt:new Date().toISOString()
    };
    const arr=load("jrV25Players",[]);arr.unshift(rec);store("jrV25Players",arr);
    audit("Jugador","Alta "+id+" · "+name+" · "+teamSel.value);
    window.__V25_LAST_CREDENTIAL={...rec,photo};
    q("#v25CredentialHost",m).innerHTML=credentialHtml(rec,photo)+`<div class="v25-form-actions"><button class="v25-btn" id="v25PrintCredential">Imprimir / guardar PDF</button></div>`;
    q("#v25PrintCredential",m).onclick=()=>printCredential(window.__V25_LAST_CREDENTIAL);
    renderAdminKpis();
  };
}
function credentialHtml(rec,photo){
  return `<div class="v25-credential">
    <div class="v25-credential-photo">${photo?`<img src="${photo}" alt="">`:"👤"}</div>
    <div><div class="v25-kicker">Liga Municipal de Fútbol Juventino Rosas A.C.</div><h4>${esc(rec.name)}</h4>
    <p>${esc(rec.team)} · ${esc(rec.category)}<br>${esc(rec.position)}${rec.number?` · #${esc(rec.number)}`:""}</p>
    <div class="v25-credential-code">${esc(rec.id)}</div></div>
  </div>`;
}
function printCredential(rec){
  if(!rec)return;
  const w=window.open("","_blank","width=720,height=900");
  if(!w)return;
  w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(rec.id)}</title><style>
  body{font-family:Arial;background:#eee;padding:24px}.c{width:360px;background:#080a0d;color:#fff;border-radius:24px;padding:20px;border:3px solid #20e883}
  .p{width:100px;height:125px;object-fit:cover;border-radius:14px;background:#222;float:left;margin-right:16px}.k{color:#20e883;font-size:11px;font-weight:bold}.id{font-size:15px;color:#20e883;font-weight:bold;letter-spacing:2px}.clear{clear:both}
  </style><div class="c">${rec.photo?`<img class="p" src="${rec.photo}">`:""}<div class="k">LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS A.C.</div><h2>${esc(rec.name)}</h2><p>${esc(rec.team)}<br>${esc(rec.category)} · ${esc(rec.position)}${rec.number?` · #${esc(rec.number)}`:""}</p><div class="id">${esc(rec.id)}</div><div class="clear"></div></div><script>setTimeout(()=>print(),300)<\/script>`);
  w.document.close();
}
function openPlayers(){
  const arr=load("jrV25Players",[]);
  const rows=arr.length?arr.map(p=>`<div class="v25-list-item"><div><strong>${esc(p.name)}</strong><small>${esc(p.id)} · ${esc(p.team)} · ${esc(p.category)} · ${esc(p.curpMasked||"CURP pendiente")}</small></div><div><span class="v25-badge ${p.hasINE&&p.hasCURPDoc?"good":"warn"}">${p.hasINE&&p.hasCURPDoc?"Expediente completo":"Documentos pendientes"}</span></div></div>`).join(""):`<div class="v25-empty-summary">Todavía no hay altas registradas en V25.</div>`;
  openModal("Expedientes de jugadores",`<div class="v25-note">Se muestran sólo datos operativos guardados en este dispositivo. No se guardan documentos de identidad en esta demo.</div><div class="v25-list">${rows}</div>`);
}

function openDelegates(){
  const m=openModal("Directorio de delegados y responsables",`
    <div class="v25-note">Los delegados/encargados son quienes representan al equipo ante la liga y pueden usar este directorio para comunicación de jornadas, sanciones y juntas.</div>
    <div class="v25-form-grid">
      <div class="v25-field"><label>Equipo</label><select id="v25DTeam">${[...new Set(CATS.flatMap(teams))].sort((a,b)=>a.localeCompare(b,"es")).map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      <div class="v25-field"><label>Nombre</label><input id="v25DName"></div>
      <div class="v25-field"><label>Rol</label><select id="v25DRole"><option>Delegado</option><option>Encargado</option><option>Director técnico</option><option>Auxiliar</option></select></div>
      <div class="v25-field"><label>Teléfono / WhatsApp</label><input id="v25DPhone" inputmode="tel"></div>
      <div class="v25-field full"><label>Correo (opcional)</label><input id="v25DEmail" type="email"></div>
    </div>
    <div class="v25-form-actions"><button class="v25-btn primary" id="v25SaveDelegate">Guardar contacto</button></div>
    <div class="v25-list" id="v25DelegateList"></div>`);
  const render=()=>{
    const a=load("jrV25Delegates",[]);
    q("#v25DelegateList",m).innerHTML=a.length?a.map((d,i)=>{
      const phone=String(d.phone||"").replace(/\D/g,"");
      return `<div class="v25-list-item"><div><strong>${esc(d.name)} · ${esc(d.team)}</strong><small>${esc(d.role)}${d.phone?` · ${esc(d.phone)}`:""}${d.email?` · ${esc(d.email)}`:""}</small></div><div class="v25-form-actions">${phone?`<a class="v25-btn primary" target="_blank" rel="noopener" href="https://wa.me/${phone}">WhatsApp</a>`:""}<button class="v25-btn danger" data-v25-del-delegate="${i}">Quitar</button></div></div>`;
    }).join(""):`<div class="v25-empty-summary">Aún no hay delegados capturados.</div>`;
    qa("[data-v25-del-delegate]",m).forEach(b=>b.onclick=()=>{const x=load("jrV25Delegates",[]);x.splice(+b.dataset.v25DelDelegate,1);store("jrV25Delegates",x);render();renderAdminKpis()});
  };
  render();
  q("#v25SaveDelegate",m).onclick=()=>{
    const name=q("#v25DName",m).value.trim();if(!name){alert("Escribe el nombre.");return}
    const d={team:q("#v25DTeam",m).value,name,role:q("#v25DRole",m).value,phone:q("#v25DPhone",m).value.trim(),email:q("#v25DEmail",m).value.trim(),createdAt:new Date().toISOString()};
    const a=load("jrV25Delegates",[]);a.unshift(d);store("jrV25Delegates",a);audit("Delegado","Alta "+name+" · "+d.team);render();renderAdminKpis();
  };
}
function openContactsPublic(){
  const a=load("jrV25Delegates",[]);
  const rows=a.length?a.map(d=>{
    const phone=String(d.phone||"").replace(/\D/g,"");
    return `<div class="v25-list-item"><div><strong>${esc(d.team)}</strong><small>${esc(d.name)} · ${esc(d.role)}</small></div>${phone?`<a class="v25-btn primary" target="_blank" rel="noopener" href="https://wa.me/${phone}">Contactar</a>`:`<span class="v25-badge">Sin teléfono</span>`}</div>`;
  }).join(""):`<div class="v25-empty-summary">El administrador todavía no ha cargado el directorio de delegados en este dispositivo.</div>`;
  openModal("Directorio de delegados",`<div class="v25-list">${rows}</div>`);
}
function openMeeting(){
  const delegates=load("jrV25Delegates",[]);
  const date=nextTuesday();
  const key=date.toISOString().slice(0,10);
  const saved=load("jrV25Meetings",{})[key]||{};
  const m=openModal("Junta semanal de liga · martes",`
    <div class="v25-note"><b>Próxima junta:</b> ${esc(dateMx(date))}. Aquí se puede llevar asistencia, orden del día y acuerdos.</div>
    <div class="v25-field"><label>Orden del día</label><textarea id="v25Agenda">${esc(saved.agenda||"Revisión de jornada · sanciones · programación · campos · arbitraje · asuntos generales")}</textarea></div>
    <div class="v25-list">${delegates.length?delegates.map((d,i)=>`<label class="v25-list-item"><div><strong>${esc(d.team)}</strong><small>${esc(d.name)} · ${esc(d.role)}</small></div><input type="checkbox" data-v25-att="${i}" ${saved.attendance?.includes(i)?"checked":""}></label>`).join(""):`<div class="v25-empty-summary">Primero agrega delegados para pasar asistencia.</div>`}</div>
    <div class="v25-field" style="margin-top:12px"><label>Acuerdos / minuta</label><textarea id="v25Agreements">${esc(saved.agreements||"")}</textarea></div>
    <div class="v25-form-actions"><button class="v25-btn primary" id="v25SaveMeeting">Guardar junta</button><button class="v25-btn" id="v25PrintMeeting">Imprimir minuta</button></div>`);
  const payload=()=>({date:key,agenda:q("#v25Agenda",m).value,agreements:q("#v25Agreements",m).value,attendance:qa("[data-v25-att]",m).filter(x=>x.checked).map(x=>+x.dataset.v25Att)});
  q("#v25SaveMeeting",m).onclick=()=>{const all=load("jrV25Meetings",{});all[key]=payload();store("jrV25Meetings",all);audit("Junta","Minuta "+key);alert("Junta guardada en este dispositivo.")};
  q("#v25PrintMeeting",m).onclick=()=>{
    const p=payload(),w=window.open("","_blank");if(!w)return;
    const presentes=p.attendance.map(i=>delegates[i]).filter(Boolean).map(d=>`${d.team} — ${d.name}`).join("<br>");
    w.document.write(`<meta charset="utf-8"><title>Minuta ${key}</title><style>body{font-family:Arial;padding:30px;line-height:1.5}h1{font-size:22px}</style><h1>Liga Municipal de Fútbol Juventino Rosas A.C.</h1><h2>Junta semanal · ${esc(dateMx(date))}</h2><h3>Orden del día</h3><p>${esc(p.agenda).replace(/\n/g,"<br>")}</p><h3>Asistencia</h3><p>${presentes||"Sin captura"}</p><h3>Acuerdos</h3><p>${esc(p.agreements).replace(/\n/g,"<br>")||"Sin captura"}</p><script>setTimeout(()=>print(),250)<\/script>`);
    w.document.close();
  };
}
function openSanctions(){
  const m=openModal("Control de sanciones",`
    <div class="v25-form-grid">
      <div class="v25-field"><label>Jugador</label><input id="v25SPlayer"></div>
      <div class="v25-field"><label>Equipo</label><select id="v25STeam">${[...new Set(CATS.flatMap(teams))].sort((a,b)=>a.localeCompare(b,"es")).map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      <div class="v25-field"><label>Partidos de sanción</label><input id="v25SGames" type="number" min="1" value="1"></div>
      <div class="v25-field"><label>Fecha</label><input id="v25SDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="v25-field full"><label>Motivo / acuerdo</label><textarea id="v25SReason"></textarea></div>
    </div>
    <div class="v25-form-actions"><button class="v25-btn primary" id="v25SaveSanction">Registrar sanción</button></div>
    <div class="v25-list" id="v25SanctionList"></div>`);
  const render=()=>{
    const a=load("jrV25Sanctions",[]);
    q("#v25SanctionList",m).innerHTML=a.length?a.map((s,i)=>`<div class="v25-list-item"><div><strong>${esc(s.player)} · ${esc(s.team)}</strong><small>${esc(s.games)} partido(s) · ${esc(s.date)} · ${esc(s.reason)}</small></div><button class="v25-btn ${s.active===false?"":"danger"}" data-v25-san="${i}">${s.active===false?"Cumplida":"Marcar cumplida"}</button></div>`).join(""):`<div class="v25-empty-summary">No hay sanciones capturadas en V25.</div>`;
    qa("[data-v25-san]",m).forEach(b=>b.onclick=()=>{const a=load("jrV25Sanctions",[]);a[+b.dataset.v25San].active=false;store("jrV25Sanctions",a);render();renderAdminKpis()});
  };render();
  q("#v25SaveSanction",m).onclick=()=>{
    const player=q("#v25SPlayer",m).value.trim();if(!player){alert("Escribe el jugador.");return}
    const s={player,team:q("#v25STeam",m).value,games:q("#v25SGames",m).value,date:q("#v25SDate",m).value,reason:q("#v25SReason",m).value.trim(),active:true};
    const a=load("jrV25Sanctions",[]);a.unshift(s);store("jrV25Sanctions",a);audit("Sanción",player+" · "+s.team);render();renderAdminKpis();
  };
}
function openMatchdayAdmin(){
  const key="jrV25MatchdayChecklist";
  const items=[
    ["calendar","Calendario publicado y revisado"],
    ["fields","Campos confirmados sin conflicto"],
    ["refs","Árbitros y oficiales asignados"],
    ["sanctions","Sancionados revisados antes de la jornada"],
    ["delegates","Delegados notificados de cambios"],
    ["reports","Actas y reportes preparados"],
    ["results","Resultados y eventos capturados al cierre"]
  ];
  const state=load(key,{});
  const m=openModal("Centro de control de jornada",`
    <div class="v25-note">Checklist operativo para reducir errores antes, durante y después de la jornada.</div>
    <div class="v25-list">${items.map(([k,t])=>`<label class="v25-list-item"><div><strong>${esc(t)}</strong></div><input type="checkbox" data-v25-check="${k}" ${state[k]?"checked":""}></label>`).join("")}</div>
    <div class="v25-form-actions">
      <button class="v25-btn primary" id="v25SaveChecklist">Guardar checklist</button>
      <button class="v25-btn" data-v25-admin-jump="Calendario">Calendario</button>
      <button class="v25-btn" data-v25-admin-jump="Árbitros">Árbitros</button>
      <button class="v25-btn" data-v25-admin-jump="Campos">Campos</button>
      <button class="v25-btn" data-v25-admin-jump="Reportes">Reportes</button>
      <button class="v25-btn" data-v25-admin-jump="Operador">Operador de partido</button>
    </div>`);
  q("#v25SaveChecklist",m).onclick=()=>{const o={};qa("[data-v25-check]",m).forEach(x=>o[x.dataset.v25Check]=x.checked);store(key,o);audit("Jornada","Checklist actualizado");alert("Checklist guardado.")};
  qa("[data-v25-admin-jump]",m).forEach(b=>b.onclick=()=>{m.classList.remove("show");clickAdminText(b.dataset.v25AdminJump)});
}
function openPrediction(){
  const cat=activeCat(), ts=teams(cat);
  const m=openModal("Pronóstico de partido",`
    <div class="v25-form-grid">
      <div class="v25-field"><label>Local</label><select id="v25PredHome">${ts.map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      <div class="v25-field"><label>Visitante</label><select id="v25PredAway">${ts.map((t,i)=>`<option ${i===1?"selected":""}>${esc(t)}</option>`).join("")}</select></div>
      <div class="v25-field"><label>Goles local</label><input id="v25PredH" type="number" min="0" value="1"></div>
      <div class="v25-field"><label>Goles visitante</label><input id="v25PredA" type="number" min="0" value="1"></div>
    </div><div class="v25-form-actions"><button class="v25-btn primary" id="v25SavePrediction">Guardar pronóstico</button></div><div id="v25PredResult"></div>`);
  q("#v25SavePrediction",m).onclick=()=>{
    const p={cat,home:q("#v25PredHome",m).value,away:q("#v25PredAway",m).value,h:q("#v25PredH",m).value,a:q("#v25PredA",m).value,at:new Date().toISOString()};
    store("jrV25Prediction",p);audit("Afición","Pronóstico "+p.home+" "+p.h+"-"+p.a+" "+p.away);
    q("#v25PredResult",m).innerHTML=`<div class="v25-note"><b>Guardado:</b> ${esc(p.home)} ${esc(p.h)}–${esc(p.a)} ${esc(p.away)}. Es sólo participación de afición; no cambia el resultado oficial.</div>`;
  };
}

function wire(){
  document.addEventListener("click",e=>{
    const go=e.target.closest("[data-v25-go]");
    if(go){goView(go.dataset.v25Go);return}
    const cat=e.target.closest("[data-v25-cat]");
    if(cat){setCategory(cat.dataset.v25Cat);return}
    const react=e.target.closest("[data-v25-react]");
    if(react){
      const c=load("jrV25Reactions",{fire:0,ball:0,clap:0,wow:0});
      c[react.dataset.v25React]=(c[react.dataset.v25React]||0)+1;store("jrV25Reactions",c);renderFan();return;
    }
    const action=e.target.closest("[data-v25-action]");
    if(action){
      const a=action.dataset.v25Action;
      if(a==="player")openPlayerForm();
      else if(a==="player-list")openPlayers();
      else if(a==="delegates")openDelegates();
      else if(a==="contacts")openContactsPublic();
      else if(a==="meeting")openMeeting();
      else if(a==="sanctions")openSanctions();
      else if(a==="matchday-admin")openMatchdayAdmin();
      else if(a==="prediction")openPrediction();
      return;
    }
    if(e.target.closest('[data-view="table"],[data-category],[data-v21-cat],[data-v20-cat]')){
      setTimeout(()=>{installTableUpgrade();syncV25Cats()},220);
    }
    if(e.target.closest('[data-view="admin"]'))setTimeout(()=>{installAdminPro();renderAdminKpis()},160);
  },{passive:false});
}
function boot(){
  replaceOldCopy();
  installHomeHub();
  installTableUpgrade();
  installAdminPro();
  wire();
  setTimeout(()=>{replaceOldCopy();installHomeHub();installTableUpgrade();installAdminPro();},900);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();

/* MASTER V26 loader */
(function(){
  if(document.querySelector('script[data-v26-loader]'))return;
  var l=document.createElement('link');
  l.rel='stylesheet';l.href='./assets/v26-fix-buttons.css?v=26.0';
  document.head.appendChild(l);
  var s=document.createElement('script');
  s.src='./assets/v26-fix-buttons.js?v=26.0';
  s.defer=true;s.dataset.v26Loader='1';
  document.body.appendChild(s);
})();