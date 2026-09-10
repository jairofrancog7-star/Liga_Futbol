(function(){
"use strict";

const VERSION="34-astra-continuacion";
const RULEBOOK="./docs/Reglamento_Liga_Juventino_Rosas_2026-2027.pdf";
const ICON="./assets/icons/";
const CAT_DEFAULT="Veteranos 35+";
const FORMATIONS={
  "4-3-3":[4,3,3],
  "4-4-2":[4,4,2],
  "4-2-3-1":[4,2,3,1],
  "3-5-2":[3,5,2]
};

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function showViewSafe(view){
  const target=document.getElementById("view-"+view);
  if(!target || typeof window.showView!=="function") return false;
  try{window.showView(view);return true}catch(_){return false}
}

function modal(){
  let bg=q("#jr34Modal");
  if(bg)return bg;
  bg=document.createElement("div");
  bg.id="jr34Modal";
  bg.className="jr34-modal-bg";
  bg.innerHTML=`
    <section class="jr34-modal" role="dialog" aria-modal="true" aria-labelledby="jr34ModalTitle">
      <header class="jr34-modal-head">
        <h3 id="jr34ModalTitle">Liga Juventino Rosas</h3>
        <button class="jr34-close" type="button" aria-label="Cerrar">×</button>
      </header>
      <div class="jr34-modal-body" id="jr34ModalBody"></div>
    </section>`;
  document.body.appendChild(bg);
  q(".jr34-close",bg).addEventListener("click",()=>bg.classList.remove("show"));
  bg.addEventListener("click",e=>{if(e.target===bg)bg.classList.remove("show")});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")bg.classList.remove("show")});
  return bg;
}
function openModal(title,html){
  const bg=modal();
  q("#jr34ModalTitle",bg).textContent=title;
  q("#jr34ModalBody",bg).innerHTML=html;
  bg.classList.add("show");
  return bg;
}

function publicHub(){
  const home=q("#view-home");
  if(!home||q("#jr34ExperienceStrip"))return;
  const sec=document.createElement("section");
  sec.id="jr34ExperienceStrip";
  sec.innerHTML=`
    <div class="jr34-kicker">Liga Municipal · Experiencia 2026</div>
    <div class="jr34-strip-head">
      <h2>Tu liga, más viva e interactiva.</h2>
      <p>Acceso rápido a Match Center, pizarra táctica, reglamento oficial e instalación en Android, iPhone y PC.</p>
    </div>
    <div class="jr34-quick-grid">
      <button class="jr34-card" type="button" data-jr34="matchcenter">
        <img src="${ICON}trophy.svg" alt=""><b>Match Center</b>
        <small>Abre el centro del partido sin clics recursivos.</small>
      </button>
      <button class="jr34-card" type="button" data-jr34="tactics">
        <img src="${ICON}chart-no-axes-column-increasing.svg" alt=""><b>Pizarra táctica</b>
        <small>Forma dos equipos, mueve jugadores, dibuja flechas y guarda.</small>
      </button>
      <a class="jr34-card" href="${RULEBOOK}" target="_blank" rel="noopener">
        <img src="${ICON}calendar-days.svg" alt=""><b>Reglamento 2026–2027</b>
        <small>Consulta el reglamento público de la Liga Juventino Rosas A.C.</small>
      </a>
      <button class="jr34-card" type="button" data-jr34="install">
        <img src="${ICON}house.svg" alt=""><b>Instalar / acceso directo</b>
        <small>Android, iPhone y PC desde la misma plataforma.</small>
      </button>
    </div>`;
  const hero=q("#v14CinematicHero",home);
  const v25=q("#v25LeagueHub",home);
  if(v25)v25.insertAdjacentElement("afterend",sec);
  else if(hero)hero.insertAdjacentElement("afterend",sec);
  else home.prepend(sec);
}

function moreTools(){
  const more=q("#view-more")||q("#view-home");
  if(!more||q("#jr34Tools"))return;
  const sec=document.createElement("section");
  sec.id="jr34Tools";
  sec.className="jr34-tools";
  sec.innerHTML=`
    <h3>Herramientas de la liga</h3>
    <p>Complementan la operación actual sin cambiar resultados oficiales.</p>
    <div class="jr34-tool-grid">
      <button class="jr34-tool" type="button" data-jr34="simulator">
        <strong>⚽ Simulador de jornada</strong>
        <small>Genera un pronóstico local con los partidos visibles y nunca modifica marcadores oficiales.</small>
      </button>
      <button class="jr34-tool" type="button" data-jr34="tactics">
        <strong>🧠 Pizarra táctica</strong>
        <small>Formaciones de ambos equipos, arrastre táctil, flechas, guardado y exportación PNG.</small>
      </button>
      <a class="jr34-tool" href="${RULEBOOK}" target="_blank" rel="noopener">
        <strong>📘 Reglamento público</strong>
        <small>Documento oficial 2026–2027 disponible directamente desde la plataforma.</small>
      </a>
    </div>`;
  more.prepend(sec);
}

function extendAccessHub(){
  const grid=q("#v22AccessHub .v22-access-grid");
  if(!grid||q('[data-jr34="install"]',grid))return;
  const b=document.createElement("button");
  b.type="button";
  b.className="v22-access-card";
  b.dataset.jr34="install";
  b.innerHTML='<span class="v22-access-icon">📱</span><strong>Instalar la liga</strong><small>Acceso directo en Android, iPhone y PC.</small>';
  grid.appendChild(b);
}

let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
});
function standalone(){
  return matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
}
async function installApp(){
  if(standalone()){
    openModal("Liga ya instalada",`
      <div class="jr34-install-state">✓ Ejecutándose como aplicación / acceso directo</div>
      <div class="jr34-install-list">
        <div class="jr34-install-step"><b>Listo</b><p>La Liga Juventino Rosas ya está abierta en modo independiente.</p></div>
      </div>`);
    return;
  }
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    try{await deferredInstallPrompt.userChoice}catch(_){}
    deferredInstallPrompt=null;
    return;
  }
  const ua=navigator.userAgent;
  const ios=/iPhone|iPad|iPod/i.test(ua);
  const android=/Android/i.test(ua);
  openModal("Instalar Liga Juventino Rosas",`
    <div class="jr34-install-list">
      <div class="jr34-install-step"><b>iPhone / iPad</b><p>Abre esta página en Safari → Compartir → Añadir a pantalla de inicio.</p></div>
      <div class="jr34-install-step"><b>Android</b><p>En Chrome abre el menú ⋮ → Instalar aplicación o Añadir a pantalla principal.</p></div>
      <div class="jr34-install-step"><b>PC</b><p>En Chrome o Edge usa el icono Instalar de la barra de direcciones o el menú del navegador.</p></div>
      <div class="jr34-install-state">${ios?"iPhone/iPad detectado":android?"Android detectado":"PC / navegador detectado"}</div>
    </div>`);
}

function hash32(str){
  let h=2166136261>>>0;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function teamLabel(el){
  if(!el)return "";
  const clone=el.cloneNode(true);
  qa("img,svg,picture",clone).forEach(n=>n.remove());
  return(clone.textContent||"").replace(/\s+/g," ").trim();
}
function currentCategory(){
  try{return localStorage.getItem("jrCategory")||CAT_DEFAULT}catch(_){return CAT_DEFAULT}
}
function visibleGames(){
  return qa("#view-matches .v20-game,#view-calendar .v20-game")
    .filter(el=>el.offsetParent!==null)
    .map(el=>{
      const t=qa(".v20-team-name",el);
      return{home:teamLabel(t[0]),away:teamLabel(t[1])};
    }).filter(g=>g.home&&g.away);
}
function simulate(){
  const games=visibleGames();
  if(!games.length){
    openModal("Simulador de jornada",'<p class="jr34-sim-note">Abre primero Partidos y una categoría con partidos visibles. El simulador no inventa partidos que no estén en tu calendario.</p>');
    return;
  }
  const cat=currentCategory();
  const rows=games.map(g=>{
    const h=hash32(`${cat}|${g.home}|${g.away}|JR34`);
    const a=h%4,b=(h>>>5)%4;
    return`<div class="jr34-sim-row"><b>${esc(g.home)}</b><span class="jr34-pred">${a} — ${b}</span><b class="away">${esc(g.away)}</b></div>`;
  }).join("");
  openModal(`Pronóstico · ${cat}`,`
    <p class="jr34-sim-note"><b>Simulación recreativa.</b> No son resultados oficiales y no se guardan en estadísticas.</p>
    <div class="jr34-sim-list">${rows}</div>`);
}

/* Pizarra táctica */
let tacticsRuntime=null;
function formation(name,side){
  const lines=FORMATIONS[name]||FORMATIONS["4-3-3"],out=[];
  const mirror=x=>side==="B"?1-x:x;
  out.push({id:`${side}-GK`,side,n:1,x:mirror(.07),y:.5});
  let number=2;
  const xSteps=lines.length===3?[.25,.48,.72]:[.22,.40,.60,.78];
  lines.forEach((count,li)=>{
    for(let i=0;i<count;i++){
      out.push({id:`${side}-${number}`,side,n:number++,x:mirror(xSteps[li]||(.25+li*.17)),y:(i+1)/(count+1)});
    }
  });
  return out;
}
function defaultTactics(a="4-3-3",b="4-4-2"){
  return{formationA:a,formationB:b,players:[...formation(a,"A"),...formation(b,"B")],arrows:[]};
}
function openTactics(){
  const bg=openModal("Pizarra táctica",`
    <div class="jr34-tactics-shell">
      <div class="jr34-tactics-toolbar">
        <label>Local <select id="jr34FormA">${Object.keys(FORMATIONS).map(x=>`<option>${x}</option>`).join("")}</select></label>
        <label>Visitante <select id="jr34FormB">${Object.keys(FORMATIONS).map(x=>`<option>${x}</option>`).join("")}</select></label>
        <button type="button" id="jr34ArrowMode">↗ Flecha</button>
        <button type="button" id="jr34SaveTac">Guardar</button>
        <button type="button" id="jr34LoadTac">Cargar</button>
        <button type="button" id="jr34ClearArrows">Borrar flechas</button>
        <button type="button" id="jr34ExportTac">Exportar PNG</button>
      </div>
      <div class="jr34-pitch-wrap"><canvas id="jr34TacticsCanvas" width="960" height="600"></canvas></div>
      <p class="jr34-tactics-help">Arrastra jugadores con dedo o mouse. Activa “Flecha” y arrastra sobre la cancha para dibujar movimientos. Guardar usa este dispositivo.</p>
    </div>`);
  setTimeout(()=>initTactics(bg),0);
}
function initTactics(bg){
  const canvas=q("#jr34TacticsCanvas",bg);
  if(!canvas)return;
  const ctx=canvas.getContext("2d");
  let state=defaultTactics(),dragging=null,arrowMode=false,arrowStart=null;
  const selA=q("#jr34FormA",bg),selB=q("#jr34FormB",bg);

  function point(ev){
    const r=canvas.getBoundingClientRect();
    return{x:(ev.clientX-r.left)/r.width,y:(ev.clientY-r.top)/r.height};
  }
  function drawArrow(a,b){
    const x1=a.x*canvas.width,y1=a.y*canvas.height,x2=b.x*canvas.width,y2=b.y*canvas.height;
    const ang=Math.atan2(y2-y1,x2-x1);
    ctx.save();ctx.strokeStyle="#f2c14e";ctx.fillStyle="#f2c14e";ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x2,y2);
    ctx.lineTo(x2-18*Math.cos(ang-Math.PI/6),y2-18*Math.sin(ang-Math.PI/6));
    ctx.lineTo(x2-18*Math.cos(ang+Math.PI/6),y2-18*Math.sin(ang+Math.PI/6));
    ctx.closePath();ctx.fill();ctx.restore();
  }
  function draw(){
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0d6334");g.addColorStop(1,"#063d22");
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(255,255,255,.72)";ctx.lineWidth=4;ctx.strokeRect(28,28,W-56,H-56);
    ctx.beginPath();ctx.moveTo(W/2,28);ctx.lineTo(W/2,H-28);ctx.stroke();
    ctx.beginPath();ctx.arc(W/2,H/2,78,0,Math.PI*2);ctx.stroke();
    ctx.strokeRect(28,H*.27,150,H*.46);ctx.strokeRect(W-178,H*.27,150,H*.46);
    ctx.strokeRect(28,H*.39,62,H*.22);ctx.strokeRect(W-90,H*.39,62,H*.22);
    state.arrows.forEach(a=>drawArrow(a.a,a.b));
    state.players.forEach(p=>{
      const x=p.x*W,y=p.y*H;ctx.save();
      ctx.shadowColor="rgba(0,0,0,.42)";ctx.shadowBlur=10;ctx.shadowOffsetY=5;
      ctx.beginPath();ctx.arc(x,y,23,0,Math.PI*2);ctx.fillStyle=p.side==="A"?"#45ed91":"#f2c14e";ctx.fill();
      ctx.shadowColor="transparent";ctx.lineWidth=3;ctx.strokeStyle=p.side==="A"?"#062816":"#3f2b00";ctx.stroke();
      ctx.fillStyle=p.side==="A"?"#062816":"#3f2b00";ctx.font="900 18px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(p.n),x,y+1);ctx.restore();
    });
  }
  function rebuild(side,form){
    state.players=[...state.players.filter(p=>p.side!==side),...formation(form,side)];
    if(side==="A")state.formationA=form;else state.formationB=form;draw();
  }
  selA.value=state.formationA;selB.value=state.formationB;
  selA.onchange=()=>rebuild("A",selA.value);selB.onchange=()=>rebuild("B",selB.value);

  canvas.addEventListener("pointerdown",ev=>{
    canvas.setPointerCapture?.(ev.pointerId);const p=point(ev);
    if(arrowMode){arrowStart=p;return}
    let best=null,dist=.07;
    state.players.forEach(pl=>{const d=Math.hypot(pl.x-p.x,pl.y-p.y);if(d<dist){dist=d;best=pl}});
    dragging=best;
  });
  canvas.addEventListener("pointermove",ev=>{
    if(!dragging)return;const p=point(ev);
    dragging.x=Math.max(.035,Math.min(.965,p.x));dragging.y=Math.max(.055,Math.min(.945,p.y));draw();
  });
  canvas.addEventListener("pointerup",ev=>{
    const p=point(ev);
    if(arrowMode&&arrowStart&&Math.hypot(p.x-arrowStart.x,p.y-arrowStart.y)>.03)state.arrows.push({a:arrowStart,b:p});
    arrowStart=null;dragging=null;draw();
  });

  q("#jr34ArrowMode",bg).onclick=e=>{arrowMode=!arrowMode;e.currentTarget.classList.toggle("active",arrowMode)};
  q("#jr34ClearArrows",bg).onclick=()=>{state.arrows=[];draw()};
  q("#jr34SaveTac",bg).onclick=()=>{
    try{localStorage.setItem("jr34Tactics",JSON.stringify(state))}catch(_){}
    q("#jr34SaveTac",bg).textContent="✓ Guardado";setTimeout(()=>{const b=q("#jr34SaveTac",bg);if(b)b.textContent="Guardar"},1000);
  };
  q("#jr34LoadTac",bg).onclick=()=>{
    try{
      const x=JSON.parse(localStorage.getItem("jr34Tactics")||"null");
      if(x&&Array.isArray(x.players)){state=x;selA.value=state.formationA||"4-3-3";selB.value=state.formationB||"4-4-2";draw()}
    }catch(_){}
  };
  q("#jr34ExportTac",bg).onclick=()=>{
    draw();const a=document.createElement("a");a.download=`pizarra-liga-jr-${Date.now()}.png`;a.href=canvas.toDataURL("image/png");a.click();
  };
  tacticsRuntime={draw,state};draw();
}

function installSimulatorButton(){
  const matches=q("#view-matches")||q("#view-calendar");
  if(!matches||q("#jr34SimBtn",matches))return;
  const btn=document.createElement("button");
  btn.id="jr34SimBtn";btn.type="button";btn.className="ghost-btn";btn.dataset.jr34="simulator";btn.textContent="🎯 Simular jornada";
  const actions=q(".v21-toolbar-actions",matches)||q(".section-title",matches);
  if(actions)actions.appendChild(btn);else matches.prepend(btn);
}
function categorySync(){
  document.addEventListener("click",e=>{
    const el=e.target.closest("[data-category],[data-v20-cat],[data-v21-cat]");
    if(!el)return;const cat=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat;if(!cat)return;
    try{localStorage.setItem("jrCategory",cat)}catch(_){}
    requestAnimationFrame(()=>qa(".categoryText").forEach(x=>x.textContent=cat));
  },true);
}
function clicks(){
  document.addEventListener("click",e=>{
    const el=e.target.closest("[data-jr34]");if(!el)return;
    const act=el.dataset.jr34;
    if(act==="matchcenter"){e.preventDefault();showViewSafe("matchcenter")}
    else if(act==="tactics"){e.preventDefault();openTactics()}
    else if(act==="simulator"){e.preventDefault();simulate()}
    else if(act==="install"){e.preventDefault();installApp()}
  });
}
function boot(){
  publicHub();moreTools();extendAccessHub();installSimulatorButton();categorySync();clicks();
  window.LJR_V34={version:VERSION,openTactics,simulate,installApp,showViewSafe};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
