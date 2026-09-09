/* MASTER V23 — JR Football OS
   Componentes propios inspirados en la guía Open Source del proyecto.
   No copia código ni assets de los repositorios de referencia. */
(function(){
"use strict";
const CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
const FALLBACK={
"Primera Fuerza":["Hermanos","San Jose FC","Linces","Juventus","Napoli","Lobos CDG","Terricolas","Galacticos","Franco FC","Herreras FC","Abejas"],
"Intermedia":["La Canchita Deportes","Galeana","Aldama FC","Malvinas","Capibaras","La Cuadrilla","Mazacotes FC","Dep. Maravillas","Osasuna","San Antonio JRS","Populares","Promesas FC","La Huerta"],
"Segunda Fuerza":["Tavera FC","Pachangas FC","San Juan FC","Tapatio","Dep. La Luz","San Julian","Barza","San Jose JRS","San Antonio FC","Celticos FC","Dep. Nopalero","Dep. Zapata"],
"Veteranos 35+":["C. de Gasca","Juventus","Cuenda","Pozos FC","Boavista","PSV","A. Santiago","F. Tavera","America","Huracan"],
"Veteranos 50+":["La Esperanza","Dynamo","Boca JRS","Toros de Cuenda","Boavista","Manchester"]
};
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
function data(){return window.LJR_V20||window.LJR_V20_API?.data||window.LJR_V18||null}
function category(){return window.LJR_V20_API?.getCategory?.()||localStorage.getItem("jrCategory")||"Veteranos 35+"}
function teams(cat){
  const d=data();
  const a=d?.rosters?.[cat];
  if(Array.isArray(a)&&a.length)return a.map(x=>x.name||x.team||x).filter(Boolean);
  return FALLBACK[cat]||[];
}
function go(name){
  const cands=[`[data-view="${name}"]`,`[data-view="${name.replace("matchcenter","match")}"]`];
  for(const s of cands){const b=q(s);if(b){b.click();return true}}
  if(typeof window.showView==="function"){try{window.showView(name);return true}catch(e){}}
  return false;
}
function modal(){
  let m=q("#v23Modal");if(m)return m;
  m=document.createElement("div");m.id="v23Modal";m.className="v23-modal";
  m.innerHTML=`<div class="v23-dialog" role="dialog" aria-modal="true"><div class="v23-dialog-head"><div><div class="v23-kicker">JR Football OS</div><h3 id="v23ModalTitle">Herramienta</h3></div><button class="v23-close" aria-label="Cerrar">×</button></div><div id="v23ModalBody"></div></div>`;
  document.body.appendChild(m);
  q(".v23-close",m).onclick=()=>m.classList.remove("show");
  m.onclick=e=>{if(e.target===m)m.classList.remove("show")};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")m.classList.remove("show")});
  return m;
}
function openModal(title,html){const m=modal();q("#v23ModalTitle",m).textContent=title;q("#v23ModalBody",m).innerHTML=html;m.classList.add("show");return m}

function insertHome(){
  const home=q("#view-home");if(!home||q("#v23FootballOS"))return;
  const s=document.createElement("section");s.id="v23FootballOS";s.className="v23-os";
  s.innerHTML=`<div class="v23-os-inner">
    <div>
      <div class="v23-kicker">JR Football OS · MASTER V23</div>
      <h2 class="v23-title">FÚTBOL QUE <span>SE MUEVE.</span></h2>
      <p class="v23-copy">El 3D deja de ser decoración: ahora conecta partidos, Match Center, tácticas, equipos, estadísticas y Copa. La experiencia conserva negro + verde y usa efectos fuertes sólo donde aportan.</p>
      <div class="v23-actions">
        <button class="primary-btn" data-v23-open="tactics">⚽ Abrir tablero táctico</button>
        <button class="ghost-btn" data-v23-open="simulator">📊 Simular jornada</button>
        <button class="ghost-btn" data-v23-go="matches">📅 Ver partidos</button>
      </div>
      <div class="v23-mini">Optimizado para móvil y compatible con “reducir movimiento”.</div>
    </div>
    <div class="v23-stage">
      <div class="v23-live-badge">PARTIDO / TÁCTICA 3D</div>
      <div class="v23-pitch" id="v23Pitch">
        <div class="v23-ball"></div>
        <div class="v23-player v23-p1">8</div><div class="v23-player v23-p2">10</div>
        <div class="v23-player rival v23-p3">4</div><div class="v23-player rival v23-p4">5</div>
      </div>
    </div>
  </div>
  <div class="v23-grid" style="padding:0 24px 24px">
    <article class="v23-feature"><span class="v23-icon">🎥</span><b>Inicio cinematográfico</b><small>Scroll, profundidad y movimiento ligados al fútbol real.</small></article>
    <article class="v23-feature"><span class="v23-icon">🟢</span><b>Match Center animado</b><small>Campo, eventos, goles, tarjetas y cambios en una sola lectura.</small></article>
    <article class="v23-feature"><span class="v23-icon">🧠</span><b>Tácticas 2D / 3D</b><small>Formaciones arrastrables, presets y guardado local.</small></article>
    <article class="v23-feature"><span class="v23-icon">🏆</span><b>Copa + escenarios</b><small>Bracket y simulaciones sin tocar la tabla oficial.</small></article>
  </div>`;
  const final=q("#v21FinalVideoHome",home);
  if(final)home.insertBefore(s,final);else home.prepend(s);

  if(!reduce()){
    const pitch=q("#v23Pitch",s);
    s.addEventListener("pointermove",e=>{
      const r=s.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      pitch.style.transform=`rotateX(${59-y*5}deg) rotateZ(${-5+x*4}deg) rotateY(${x*5}deg)`;
    });
    s.addEventListener("pointerleave",()=>pitch.style.transform="");
  }
}

function installMore(){
  const grid=q("#view-more .more-grid");if(!grid)return;
  const add=(id,icon,label,cb)=>{
    if(q("#"+id))return;const b=document.createElement("button");b.id=id;b.className="more-link";
    b.innerHTML=`<span>${icon}</span><b>${label}</b>`;b.onclick=cb;grid.appendChild(b);
  };
  add("v23TacticsBtn","🧠","Tácticas 2D / 3D",openTactics);
  add("v23SimulatorBtn","📈","Simulador de jornada",openSimulator);

}

const formations={
"4-4-2":[[50,91],[18,72],[39,75],[61,75],[82,72],[15,49],[38,53],[62,53],[85,49],[37,26],[63,26]],
"4-3-3":[[50,91],[18,72],[39,75],[61,75],[82,72],[27,51],[50,57],[73,51],[19,26],[50,20],[81,26]],
"3-5-2":[[50,91],[25,73],[50,77],[75,73],[14,50],[32,54],[50,59],[68,54],[86,50],[36,25],[64,25]]
};
function openTactics(){
  const m=openModal("Tablero táctico 2D / 3D",`<div class="v23-tools">
    <button class="v23-tool active" data-form="4-4-2">4-4-2</button><button class="v23-tool" data-form="4-3-3">4-3-3</button><button class="v23-tool" data-form="3-5-2">3-5-2</button>
    <button class="v23-tool" id="v23Toggle3D">Vista 3D</button><button class="v23-tool" id="v23SaveTactics">Guardar</button><button class="v23-tool" id="v23ExportTactics">Descargar JSON</button>
  </div>
  <div class="v23-tactics-wrap"><div class="v23-board" id="v23Board"></div>
    <aside class="v23-side">
      <div class="v23-side-card"><b>Cómo usarlo</b><p>Arrastra cada jugador con el dedo o mouse. Cambia formación con los presets. “Vista 3D” inclina el campo sin perder el control táctil.</p></div>
      <div class="v23-side-card"><b>Guardado</b><p>La formación queda guardada en este dispositivo; no altera alineaciones oficiales hasta que el administrador la capture.</p></div>
      <div class="v23-side-card"><b>Categoría activa</b><p>${esc(category())}</p></div>
    </aside></div>`);
  const board=q("#v23Board",m);
  function setForm(name,pos){
    board.innerHTML="";
    const arr=pos||formations[name]||formations["4-4-2"];
    arr.forEach((p,i)=>{const t=document.createElement("div");t.className="v23-token"+(i===0?" gk":"");t.textContent=i===0?"PT":String(i+1);t.dataset.i=i;t.style.left=`calc(${p[0]}% - 18px)`;t.style.top=`calc(${p[1]}% - 18px)`;board.appendChild(t);drag(t,board)});
    localStorage.setItem("jrTacticsFormation",name);
    qa("[data-form]",m).forEach(b=>b.classList.toggle("active",b.dataset.form===name));
  }
  const saved=JSON.parse(localStorage.getItem("jrTacticsPositions")||"null");
  setForm(localStorage.getItem("jrTacticsFormation")||"4-4-2",saved);
  qa("[data-form]",m).forEach(b=>b.onclick=()=>{localStorage.removeItem("jrTacticsPositions");setForm(b.dataset.form)});
  q("#v23Toggle3D",m).onclick=e=>{board.classList.toggle("is3d");e.currentTarget.classList.toggle("active",board.classList.contains("is3d"))};
  q("#v23SaveTactics",m).onclick=()=>{
    const r=board.getBoundingClientRect();const out=qa(".v23-token",board).map(t=>{const tr=t.getBoundingClientRect();return [Math.round(((tr.left+tr.width/2-r.left)/r.width)*1000)/10,Math.round(((tr.top+tr.height/2-r.top)/r.height)*1000)/10]});
    localStorage.setItem("jrTacticsPositions",JSON.stringify(out));q("#v23SaveTactics",m).textContent="✓ Guardado";
  };
  q("#v23ExportTactics",m).onclick=()=>{
    const payload={category:category(),formation:localStorage.getItem("jrTacticsFormation")||"4-4-2",positions:JSON.parse(localStorage.getItem("jrTacticsPositions")||"null"),savedAt:new Date().toISOString()};
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));a.download="alineacion-jr.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };
}
function drag(t,board){
  let on=false;
  t.addEventListener("pointerdown",e=>{on=true;t.setPointerCapture?.(e.pointerId);e.preventDefault()});
  t.addEventListener("pointermove",e=>{if(!on)return;const r=board.getBoundingClientRect();let x=e.clientX-r.left,y=e.clientY-r.top;x=Math.max(18,Math.min(r.width-18,x));y=Math.max(18,Math.min(r.height-18,y));t.style.left=(x-18)+"px";t.style.top=(y-18)+"px"});
  const off=()=>on=false;t.addEventListener("pointerup",off);t.addEventListener("pointercancel",off);
}

function openSimulator(){
  const cat=category();
  const m=openModal("Simulador de jornada",`<p class="v23-copy" style="margin-bottom:14px">Prueba un resultado hipotético. Es una simulación visual: <b>no modifica</b> la tabla ni resultados oficiales.</p>
    <div class="v23-field" style="margin-bottom:10px"><label>Categoría</label><select id="v23SimCat">${CATS.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
    <div class="v23-sim-grid">
      <div class="v23-field"><label>Local</label><select id="v23SimHome"></select></div>
      <div style="display:flex;gap:5px;align-items:center"><input class="v23-score-input" id="v23HomeScore" type="number" min="0" value="1"><b>–</b><input class="v23-score-input" id="v23AwayScore" type="number" min="0" value="1"></div>
      <div class="v23-field"><label>Visitante</label><select id="v23SimAway"></select></div>
    </div><div class="v23-actions"><button class="primary-btn" id="v23RunSim">Calcular escenario</button></div><div id="v23SimResult"></div>`);
  const cs=q("#v23SimCat",m),hs=q("#v23SimHome",m),as=q("#v23SimAway",m);
  const fill=()=>{const ts=teams(cs.value);hs.innerHTML=ts.map(x=>`<option>${esc(x)}</option>`).join("");as.innerHTML=ts.map((x,i)=>`<option ${i===1?"selected":""}>${esc(x)}</option>`).join("")};fill();cs.onchange=fill;
  q("#v23RunSim",m).onclick=()=>{
    const h=+q("#v23HomeScore",m).value||0,a=+q("#v23AwayScore",m).value||0;let line;
    if(h>a)line=`<strong>${esc(hs.value)}</strong> sumaría 3 puntos; ${esc(as.value)} 0.`;
    else if(a>h)line=`<strong>${esc(as.value)}</strong> sumaría 3 puntos; ${esc(hs.value)} 0.`;
    else line=`Empate: <strong>${esc(hs.value)}</strong> y <strong>${esc(as.value)}</strong> sumarían 1 punto cada uno.`;
    q("#v23SimResult",m).innerHTML=`<div class="v23-result"><b>${esc(cs.value)} · escenario ${h}-${a}</b><p style="margin-top:6px;color:var(--text2)">${line}</p><small style="color:var(--muted)">Simulación local; no altera datos oficiales.</small></div>`;
  };
}

function installMatchField(){
  if(q("#v23MatchField"))return;
  let view=qa(".view").find(v=>/match center/i.test(v.textContent||""));
  if(!view)view=q("#view-matchcenter")||q("#view-match");
  if(!view)return;
  const box=document.createElement("section");box.id="v23MatchField";box.className="v23-match-field";
  box.innerHTML=`<div class="v23-match-head"><div><div class="v23-kicker">Visualización de eventos</div><h3>Cancha animada</h3></div><button class="v23-tool" id="v23Replay">↻ Reproducir secuencia</button></div>
    <div class="v23-event-track"><div class="v23-event-ball" id="v23EventBall"></div><i class="v23-event-dot v23-e1" title="Gol / llegada"></i><i class="v23-event-dot v23-e2" title="Tarjeta / evento"></i><i class="v23-event-dot v23-e3" title="Evento crítico"></i></div>
    <div class="v23-source-note">La cancha es una visualización de interfaz. Los eventos oficiales siguen viniendo del panel administrativo.</div>`;
  const title=q(".section-title",view);if(title)title.insertAdjacentElement("afterend",box);else view.prepend(box);
  q("#v23Replay",box).onclick=()=>{const b=q("#v23EventBall",box);b.style.animation="none";void b.offsetWidth;b.style.animation=""};
}

function analytics(){
  const view=q("#view-table");if(!view||q("#v23Analytics"))return;
  const rows=qa("tbody tr",view).filter(r=>qa("td",r).length>=2);
  const wrap=document.createElement("section");wrap.id="v23Analytics";wrap.className="v23-analytics";
  if(rows.length){
    const top=rows.slice(0,3);
    top.forEach((r,i)=>{const cells=qa("td",r).map(c=>c.textContent.trim());const team=cells[1]||`Equipo ${i+1}`,pts=cells[cells.length-1]||"—";const m=document.createElement("article");m.className="v23-metric";m.innerHTML=`<small style="color:var(--muted)">TOP ${i+1}</small><b>${esc(pts)}</b><div>${esc(team)}</div><div class="v23-bar"><i style="width:${Math.max(28,100-i*18)}%"></i></div>`;wrap.appendChild(m)});
  }else wrap.innerHTML=`<article class="v23-metric"><b>Datos oficiales</b><div style="color:var(--muted);font-size:11px">Las gráficas aparecen cuando exista tabla recibida para la categoría seleccionada.</div></article>`;
  const t=q(".section-title",view);if(t)t.insertAdjacentElement("afterend",wrap);else view.prepend(wrap);
}

function tilt(){
  if(reduce())return;
  qa(".matchday-card,.team-card,.club-card,#view-teams .card,#view-matches .card").forEach(el=>{
    if(el.dataset.v23Tilt)return;el.dataset.v23Tilt="1";el.classList.add("v23-tilt");
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-2px)`});
    el.addEventListener("pointerleave",()=>el.style.transform="");
  });
}

function wire(){
  document.addEventListener("click",e=>{
    const a=e.target.closest("[data-v23-open]");if(a){a.dataset.v23Open==="tactics"?openTactics():openSimulator();return}
    const g=e.target.closest("[data-v23-go]");if(g)go(g.dataset.v23Go);
  });
}
function boot(){
  insertHome();installMore();installMatchField();analytics();wire();
  const later=()=>{installMore();installMatchField();if(!q("#v23Analytics"))analytics();if(!reduce())tilt();};
  if("requestIdleCallback" in window) requestIdleCallback(later,{timeout:1400}); else setTimeout(later,900);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,260));else setTimeout(boot,260);
})();