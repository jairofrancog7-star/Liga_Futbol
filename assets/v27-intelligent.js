
/* MASTER V27 — categorías funcionales, UI sin duplicados, perfiles de equipos,
   estadísticas por categoría y simulador estadístico determinista. */
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

/* Tabla oficial recibida por el usuario en las imágenes del proyecto. */
const OFFICIAL_V35=[
  {team:"C. de Gasca",jj:17,g:13,e:1,p:3,gf:54,gc:17,dg:37,pts:40},
  {team:"Juventus",jj:17,g:10,e:4,p:3,gf:47,gc:27,dg:20,pts:34},
  {team:"Cuenda",jj:17,g:11,e:0,p:6,gf:41,gc:22,dg:19,pts:33},
  {team:"Pozos FC",jj:17,g:10,e:2,p:5,gf:48,gc:36,dg:12,pts:32},
  {team:"Boavista",jj:17,g:8,e:3,p:6,gf:38,gc:27,dg:11,pts:27},
  {team:"PSV",jj:17,g:9,e:0,p:8,gf:49,gc:40,dg:9,pts:27},
  {team:"A. Santiago",jj:17,g:7,e:1,p:9,gf:36,gc:57,dg:-21,pts:22},
  {team:"F. Tavera",jj:17,g:4,e:2,p:11,gf:27,gc:50,dg:-23,pts:14},
  {team:"América",jj:17,g:4,e:1,p:12,gf:22,gc:48,dg:-26,pts:13},
  {team:"Huracán",jj:17,g:2,e:0,p:15,gf:19,gc:69,dg:-50,pts:6}
];

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const api=()=>window.LJR_V20_API||null;
const data=()=>window.LJR_V20||api()?.data||window.LJR_V18||null;
const currentView=()=>q(".view.active")?.id||"";
const activeCat=()=>api()?.getCategory?.()||localStorage.getItem("jrCategory")||"Veteranos 35+";
const load=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch(e){return f}};
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

function cleanName(s){
  return String(s||"")
    .replace(/^CCuenda$/i,"Cuenda")
    .replace(/AmÃ©rica/gi,"América")
    .replace(/Terricolas/gi,"Terrícolas")
    .replace(/Galacticos/gi,"Galácticos")
    .replace(/Tapatio/gi,"Tapatío")
    .replace(/San Julian/gi,"San Julián")
    .replace(/San Jose/gi,"San José")
    .replace(/Huracan/gi,"Huracán")
    .trim();
}
function teams(cat){
  const d=data();
  const a=d?.rosters?.[cat];
  if(Array.isArray(a)&&a.length)return a.map(x=>cleanName(x.name||x.team||x)).filter(Boolean);
  return FALLBACK[cat]||[];
}
function teamKey(s){return norm(cleanName(s)).replace(/\bfc\b/g,"").replace(/\s+/g," ").trim()}
function sameTeam(a,b){return teamKey(a)===teamKey(b)}
function n(v){const x=Number(v);return Number.isFinite(x)?x:0}

function normalizeStanding(x){
  if(!x)return null;
  const team=cleanName(x.team??x.name??x.equipo??x.club??"");
  if(!team)return null;
  const jj=n(x.jj??x.played??x.jugados??x.matches);
  const gf=n(x.gf??x.goalsFor??x.golesFavor??x.goals_for);
  const gc=n(x.gc??x.goalsAgainst??x.golesContra??x.goals_against);
  const g=n(x.g??x.wins??x.ganados);
  const e=n(x.e??x.draws??x.empatados);
  const p=n(x.p??x.losses??x.perdidos);
  const pts=n(x.pts??x.points??x.puntos);
  return {team,jj,g,e,p,gf,gc,dg:n(x.dg??x.goalDifference??x.diferencia??(gf-gc)),pts};
}
function parseStandingArray(a){
  if(!Array.isArray(a))return [];
  return a.map(normalizeStanding).filter(Boolean);
}
function standings(cat){
  const d=data();
  const candidates=[
    d?.standings?.[cat],d?.tables?.[cat],d?.positions?.[cat],
    d?.standings?.[norm(cat)],d?.tables?.[norm(cat)]
  ];
  for(const c of candidates){
    const rows=parseStandingArray(c);
    if(rows.length>=2)return {rows,source:"Datos oficiales de la aplicación",confidence:"alta"};
  }
  if(cat==="Veteranos 35+"){
    return {rows:OFFICIAL_V35.map(x=>({...x})),source:"Tabla oficial recibida · 17 jornadas",confidence:"alta"};
  }

  /* Último recurso: leer una tabla ya renderizada si coincide con la categoría activa. */
  if(activeCat()===cat){
    const trs=qa("#view-table tbody tr").filter(r=>qa("td",r).length>=8);
    const rows=trs.map(r=>{
      const c=qa("td",r).map(td=>td.textContent.trim());
      if(c.length<8)return null;
      return normalizeStanding({
        team:c[1],jj:c[2],g:c[3],e:c[4],p:c[5],gf:c[6],gc:c[7],
        dg:c[8],pts:c[c.length-1]
      });
    }).filter(Boolean);
    if(rows.length>=2)return {rows,source:"Tabla mostrada en la página",confidence:"media"};
  }
  return {rows:[],source:"Sin tabla oficial suficiente",confidence:"sin datos"};
}
function bulletins(){
  const d=data();
  return Array.isArray(d?.bulletins)?[...d.bulletins].sort((a,b)=>n(a.order)-n(b.order)):[];
}
function groupGames(cat){
  const out=[];
  bulletins().forEach(b=>{
    (b.groups||[]).forEach(g=>{
      if(g.category!==cat)return;
      (g.games||[]).forEach(game=>{
        if(game.rest)return;
        out.push({...game,bulletin:b.title||b.label||"",order:n(b.order)});
      });
    });
  });
  return out;
}
function latestFixtures(cat){
  const bs=bulletins();
  for(const b of bs){
    const group=(b.groups||[]).find(g=>g.category===cat);
    if(group){
      const games=(group.games||[]).filter(x=>!x.rest&&x.home&&x.away);
      if(games.length)return {games,bulletin:b.title||b.label||"Jornada actual"};
    }
  }
  return {games:[],bulletin:""};
}
function fixtureSignals(cat){
  const map={};
  const ensure=t=>{
    const k=teamKey(t);
    if(!map[k])map[k]={team:cleanName(t),wins:0,losses:0,decisions:0};
    return map[k];
  };
  groupGames(cat).forEach(g=>{
    const note=String(g.note||"").trim();
    const m=note.match(/^gana\s+(.+)$/i);
    if(!m)return;
    const h=ensure(g.home),a=ensure(g.away),winner=cleanName(m[1]);
    if(sameTeam(winner,g.home)){h.wins++;h.decisions++;a.losses++;a.decisions++}
    else if(sameTeam(winner,g.away)){a.wins++;a.decisions++;h.losses++;h.decisions++}
  });
  return map;
}

function setCategory(cat){
  if(!CATS.includes(cat))return;
  try{localStorage.setItem("jrCategory",cat)}catch(e){}
  try{api()?.setCategory?.(cat)}catch(e){}
  try{if(typeof window.currentCategory!=="undefined")window.currentCategory=cat}catch(e){}
  qa("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));
  qa("[data-v21-cat]").forEach(b=>b.classList.toggle("active",b.dataset.v21Cat===cat));
  qa("[data-v25-cat]").forEach(b=>b.classList.toggle("active",b.dataset.v25Cat===cat));
  qa(".categoryText,.v25-current-cat").forEach(x=>x.textContent=cat);
}
function goView(name){
  const b=q(`[data-view="${name}"]`);
  if(b){b.click();return true}
  try{if(typeof window.showView==="function"){window.showView(name);return true}}catch(e){}
  return false;
}

function modal(){
  let m=q("#v27Modal");
  if(m)return m;
  m=document.createElement("div");
  m.id="v27Modal";m.className="v27-modal-bg";
  m.innerHTML=`<div class="v27-modal" role="dialog" aria-modal="true">
    <div class="v27-modal-head"><h3 id="v27ModalTitle">Liga Juventino Rosas</h3><button class="v27-close" aria-label="Cerrar">×</button></div>
    <div class="v27-modal-body" id="v27ModalBody"></div>
  </div>`;
  document.body.appendChild(m);
  q(".v27-close",m).onclick=()=>m.classList.remove("show");
  m.onclick=e=>{if(e.target===m)m.classList.remove("show")};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")m.classList.remove("show")});
  return m;
}
function openModal(title,html){
  const m=modal();
  q("#v27ModalTitle",m).textContent=title;
  q("#v27ModalBody",m).innerHTML=html;
  m.classList.add("show");
  return m;
}

/* ---------- ESTADÍSTICAS ---------- */
function renderStats(cat=activeCat()){
  if(currentView()!=="view-stats" && !q("#view-stats"))return;
  const sk=q("#statsKpis"), sg=q("#scorersGrid");
  if(!sk||!sg)return;
  const box=standings(cat),rows=[...box.rows].sort((a,b)=>b.pts-a.pts||b.dg-a.dg||b.gf-a.gf);
  let ctx=q("#v27StatsContext");
  if(!ctx){
    ctx=document.createElement("div");ctx.id="v27StatsContext";ctx.className="v27-stats-context";
    sk.insertAdjacentElement("beforebegin",ctx);
  }
  ctx.innerHTML=`<span>Categoría activa: <strong>${esc(cat)}</strong></span><span>Fuente: ${esc(box.source)}</span>`;

  const section=sg.closest(".section");
  const title=section?.querySelector(".section-title h3");

  if(rows.length){
    const totalGF=rows.reduce((s,x)=>s+x.gf,0);
    const maxJJ=Math.max(...rows.map(x=>x.jj));
    const leader=rows[0];
    sk.innerHTML=`
      <div class="card stat-card v27-kpi"><small>Equipos</small><strong>${rows.length}</strong><small>${esc(cat)}</small></div>
      <div class="card stat-card v27-kpi"><small>Jornadas registradas</small><strong>${maxJJ}</strong><small>tabla oficial</small></div>
      <div class="card stat-card v27-kpi"><small>Goles registrados</small><strong>${totalGF}</strong><small>suma GF</small></div>
      <div class="card stat-card v27-kpi"><small>Líder actual</small><strong>${leader.pts}</strong><small>${esc(leader.team)} · PTS</small></div>`;
    if(title)title.textContent="Rendimiento de equipos";
    sg.className="v27-performance-grid";
    sg.innerHTML=rows.slice(0,6).map((x,i)=>`
      <article class="v27-performance" data-v27-team="${esc(x.team)}">
        <div class="v27-pos">${i+1}</div>
        <div><b>${esc(x.team)}</b><small>JJ ${x.jj} · G ${x.g} · E ${x.e} · P ${x.p} · GF ${x.gf} · GC ${x.gc} · DG ${x.dg>0?"+":""}${x.dg}</small></div>
        <div class="v27-pts">${x.pts}<small>PTS</small></div>
      </article>`).join("");
  }else{
    const games=groupGames(cat);
    const decisions=Object.values(fixtureSignals(cat)).reduce((s,x)=>s+x.wins,0);
    sk.innerHTML=`
      <div class="card stat-card v27-kpi"><small>Equipos registrados</small><strong>${teams(cat).length}</strong><small>${esc(cat)}</small></div>
      <div class="card stat-card v27-kpi"><small>Partidos en calendarios</small><strong>${games.length}</strong><small>programaciones recibidas</small></div>
      <div class="card stat-card v27-kpi"><small>Ganadores confirmados</small><strong>${decisions}</strong><small>notas “Gana...”</small></div>
      <div class="card stat-card v27-kpi"><small>Tabla general</small><strong>—</strong><small>pendiente de captura</small></div>`;
    if(title)title.textContent="Estado estadístico";
    sg.className="";
    sg.innerHTML=`<div class="v27-empty"><b>${esc(cat)}</b>: todavía no se ha recibido una tabla oficial completa de posiciones/goleo para calcular estadísticas individuales sin inventar datos. La página sí usa los equipos y calendarios oficiales que ya están cargados.</div>`;
  }
}

/* ---------- SIMULADOR INTELIGENTE ---------- */
function poisson(k,l){let f=1;for(let i=2;i<=k;i++)f*=i;return Math.exp(-l)*Math.pow(l,k)/f}
function prediction(cat,home,away){
  const box=standings(cat),rows=box.rows;
  const H=rows.find(x=>sameTeam(x.team,home)),A=rows.find(x=>sameTeam(x.team,away));

  if(H&&A&&H.jj>0&&A.jj>0){
    const sumJJ=rows.reduce((s,x)=>s+x.jj,0)||1;
    const sumGF=rows.reduce((s,x)=>s+x.gf,0);
    const avgGoals=clamp(sumGF/sumJJ,.65,2.4);
    const avgPPG=clamp(rows.reduce((s,x)=>s+(x.pts/Math.max(1,x.jj)),0)/rows.length,.5,2.7);

    const attH=clamp((H.gf/H.jj)/avgGoals,.45,1.8);
    const attA=clamp((A.gf/A.jj)/avgGoals,.45,1.8);
    const defH=clamp((H.gc/H.jj)/avgGoals,.45,1.9);
    const defA=clamp((A.gc/A.jj)/avgGoals,.45,1.9);
    const strH=clamp((H.pts/H.jj)/avgPPG,.45,1.7);
    const strA=clamp((A.pts/A.jj)/avgPPG,.45,1.7);

    let lh=avgGoals*Math.sqrt(attH*defA)*Math.sqrt(strH/strA)*1.08;
    let la=avgGoals*Math.sqrt(attA*defH)*Math.sqrt(strA/strH)*.92;
    lh=clamp(lh,.20,4.3);la=clamp(la,.18,4.1);

    let hw=0,dr=0,aw=0,best={h:0,a:0,p:-1};
    for(let h=0;h<=7;h++)for(let a=0;a<=7;a++){
      const p=poisson(h,lh)*poisson(a,la);
      if(h>a)hw+=p;else if(h===a)dr+=p;else aw+=p;
      if(p>best.p)best={h,a,p};
    }
    const total=hw+dr+aw||1;
    return {
      ok:true,home:cleanName(home),away:cleanName(away),score:[best.h,best.a],
      probs:[hw/total,dr/total,aw/total],
      xg:[lh,la],source:box.source,
      confidence:Math.min(H.jj,A.jj)>=10?"Alta":Math.min(H.jj,A.jj)>=5?"Media":"Baja",
      basis:`${H.jj} JJ de ${H.team} y ${A.jj} JJ de ${A.team}; GF, GC, puntos y fortaleza relativa.`
    };
  }

  /* Sin tabla: sólo usar resultados explícitamente confirmados en boletines. */
  const sig=fixtureSignals(cat),h=sig[teamKey(home)],a=sig[teamKey(away)];
  if(h&&a&&h.decisions>=2&&a.decisions>=2){
    const wh=(h.wins+1)/(h.decisions+2),wa=(a.wins+1)/(a.decisions+2);
    const lh=clamp(1.15 + (wh-wa)*1.10 + .16,.35,2.9);
    const la=clamp(1.10 + (wa-wh)*1.10,.30,2.7);
    let hw=0,dr=0,aw=0,best={h:0,a:0,p:-1};
    for(let i=0;i<=6;i++)for(let j=0;j<=6;j++){
      const p=poisson(i,lh)*poisson(j,la);
      if(i>j)hw+=p;else if(i===j)dr+=p;else aw+=p;
      if(p>best.p)best={h:i,a:j,p};
    }
    const total=hw+dr+aw||1;
    return {
      ok:true,home:cleanName(home),away:cleanName(away),score:[best.h,best.a],
      probs:[hw/total,dr/total,aw/total],xg:[lh,la],
      source:"Resultados parciales confirmados en los boletines",
      confidence:"Baja",
      basis:`Sólo hay señales de ganadores anteriores (${h.decisions} y ${a.decisions} resultados).`
    };
  }
  return {ok:false,reason:"No hay estadísticas oficiales suficientes de ambos equipos para producir un pronóstico serio. V27 no inventa resultados."};
}
function percent(v){return Math.round(v*100)+"%"}
function predMarkup(p){
  if(!p.ok)return `<div class="v27-empty">${esc(p.reason)}</div>`;
  return `<div class="v27-score-hero">
      <small>PRONÓSTICO ESTADÍSTICO · NO ES RESULTADO OFICIAL</small>
      <strong>${esc(p.home)} ${p.score[0]} – ${p.score[1]} ${esc(p.away)}</strong>
      <span class="v27-confidence">Confianza ${esc(p.confidence)}</span>
    </div>
    <div class="v27-prob">
      <div><small>GANA LOCAL</small><b>${percent(p.probs[0])}</b></div>
      <div><small>EMPATE</small><b>${percent(p.probs[1])}</b></div>
      <div><small>GANA VISITA</small><b>${percent(p.probs[2])}</b></div>
    </div>
    <div class="v27-note">xG estimado: ${p.xg[0].toFixed(2)} – ${p.xg[1].toFixed(2)}. Base: ${esc(p.source)}. ${esc(p.basis)}</div>`;
}
function openSmartSimulator(){
  const cat=activeCat();
  const m=openModal("Simulador de jornada inteligente",`
    <div class="v27-note"><b>Ahora sí usa estadísticas.</b> No genera números al azar: calcula un escenario determinista con GF, GC, puntos y partidos jugados cuando existe tabla oficial. Si faltan datos, te lo dice y no inventa.</div>
    <div class="v27-grid2">
      <div class="v27-field"><label>Categoría</label><select id="v27SimCat">${CATS.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
      <div class="v27-field"><label>Modo</label><select id="v27SimMode"><option value="one">Un partido</option><option value="round">Jornada más reciente</option></select></div>
      <div class="v27-field"><label>Local</label><select id="v27SimHome"></select></div>
      <div class="v27-field"><label>Visitante</label><select id="v27SimAway"></select></div>
    </div>
    <div class="v27-actions"><button class="v27-btn primary" id="v27RunSim">Calcular pronóstico</button></div>
    <div class="v27-sim-result" id="v27SimResult"></div>`);
  const cs=q("#v27SimCat",m),hs=q("#v27SimHome",m),as=q("#v27SimAway",m),mode=q("#v27SimMode",m);
  function fill(){
    const ts=teams(cs.value);
    hs.innerHTML=ts.map(t=>`<option>${esc(t)}</option>`).join("");
    as.innerHTML=ts.map((t,i)=>`<option ${i===1?"selected":""}>${esc(t)}</option>`).join("");
  }
  fill();cs.onchange=fill;
  q("#v27RunSim",m).onclick=()=>{
    const host=q("#v27SimResult",m);
    if(mode.value==="one"){
      if(sameTeam(hs.value,as.value)){host.innerHTML='<div class="v27-empty">Elige dos equipos diferentes.</div>';return}
      host.innerHTML=predMarkup(prediction(cs.value,hs.value,as.value));
      return;
    }
    const fx=latestFixtures(cs.value);
    if(!fx.games.length){host.innerHTML='<div class="v27-empty">No hay una jornada cargada para esta categoría.</div>';return}
    const rows=fx.games.map(g=>{
      const p=prediction(cs.value,g.home,g.away);
      return p.ok
        ? `<div class="v27-fixture-row"><b>${esc(cleanName(g.home))}</b><span>${p.score[0]}–${p.score[1]}</span><b>${esc(cleanName(g.away))}</b></div>`
        : `<div class="v27-fixture-row"><b>${esc(cleanName(g.home))}</b><span>—</span><b>${esc(cleanName(g.away))}</b></div>`;
    }).join("");
    const usable=fx.games.filter(g=>prediction(cs.value,g.home,g.away).ok).length;
    host.innerHTML=`<div class="v27-note"><b>${esc(fx.bulletin)}</b> · ${usable} de ${fx.games.length} partidos tienen base estadística suficiente. Los demás quedan “—”, sin inventar.</div><div class="v27-fixture-list">${rows}</div>`;
  };
}

/* ---------- PERFIL DE EQUIPO ---------- */
function findCategoryForTeam(team){
  const act=activeCat();
  if(teams(act).some(t=>sameTeam(t,team)))return act;
  return CATS.find(c=>teams(c).some(t=>sameTeam(t,team)))||act;
}
function findTeamFromCard(card){
  const text=cleanName(card?.textContent||"");
  const all=[...new Set(CATS.flatMap(teams))].sort((a,b)=>b.length-a.length);
  return all.find(t=>norm(text).includes(norm(t)))||"";
}
function teamGames(cat,team){
  return groupGames(cat).filter(g=>sameTeam(g.home,team)||sameTeam(g.away,team)).slice(0,7);
}
function logoFromCard(team){
  const card=qa("#teamsGrid > *").find(c=>sameTeam(findTeamFromCard(c),team));
  return card?.querySelector("img")?.src||"";
}
function openTeamProfile(team){
  team=cleanName(team);
  const cat=findCategoryForTeam(team),box=standings(cat);
  const row=box.rows.find(x=>sameTeam(x.team,team));
  const games=teamGames(cat,team);
  const delegate=load("jrV25Delegates",[]).find(d=>sameTeam(d.team,team));
  const logo=logoFromCard(team);
  const initial=team.charAt(0).toUpperCase()||"⚽";
  const desc=`${team} está registrado en ${cat}. Desde esta ficha puedes revisar su calendario, rendimiento oficial disponible y el contacto del delegado cuando esté capturado.`;

  const stats=row?`
    <div class="v27-team-metrics">
      <div><small>JJ</small><b>${row.jj}</b></div><div><small>PTS</small><b>${row.pts}</b></div>
      <div><small>GF</small><b>${row.gf}</b></div><div><small>GC</small><b>${row.gc}</b></div>
      <div><small>G</small><b>${row.g}</b></div><div><small>E</small><b>${row.e}</b></div>
      <div><small>P</small><b>${row.p}</b></div><div><small>DG</small><b>${row.dg>0?"+":""}${row.dg}</b></div>
    </div>`:`<div class="v27-empty" style="margin-top:12px">La tabla oficial completa de ${esc(cat)} todavía no está cargada; no se muestran puntos inventados.</div>`;

  const gameHtml=games.length?games.map(g=>`
    <div class="v27-game"><span>${esc(cleanName(g.home))}</span><em>${esc(g.time||"VS")}</em><span>${esc(cleanName(g.away))}</span></div>`).join("")
    :`<div class="v27-empty">No hay partidos cargados para esta ficha.</div>`;

  const phone=String(delegate?.phone||"").replace(/\D/g,"");
  const m=openModal(team,`
    <div class="v27-team-hero">
      <div class="v27-team-avatar">${logo?`<img src="${esc(logo)}" alt="">`:esc(initial)}</div>
      <div><div style="color:var(--v27-green);font:850 9px/1 system-ui;text-transform:uppercase;letter-spacing:.12em">${esc(cat)}</div>
      <h4>${esc(team)}</h4><p>${esc(desc)}</p></div>
    </div>
    ${stats}
    <div class="v27-actions">
      <button class="v27-btn primary" id="v27TeamMatches">Ver sus partidos</button>
      <button class="v27-btn" id="v27TeamTable">Ver tabla</button>
      <button class="v27-btn" id="v27TeamFavorite">⭐ Seguir equipo</button>
      ${phone?`<a class="v27-btn" target="_blank" rel="noopener" href="https://wa.me/${phone}">WhatsApp del delegado</a>`:""}
    </div>
    <h4 style="margin:18px 0 8px">Programaciones recientes</h4>
    <div class="v27-games">${gameHtml}</div>
    ${delegate?`<div class="v27-note" style="margin-top:12px">Delegado/encargado: <b>${esc(delegate.name)}</b> · ${esc(delegate.role||"Delegado")}</div>`:""}`);
  q("#v27TeamMatches",m).onclick=()=>{setCategory(cat);m.classList.remove("show");goView("matches")};
  q("#v27TeamTable",m).onclick=()=>{setCategory(cat);m.classList.remove("show");goView("table")};
  q("#v27TeamFavorite",m).onclick=()=>{localStorage.setItem("jrV25FavoriteTeam",team);q("#v27TeamFavorite",m).textContent="✓ Equipo seguido"};
}
function enhanceTeamCards(){
  qa("#teamsGrid > *").forEach(card=>{
    const team=findTeamFromCard(card);
    if(!team)return;
    card.dataset.v27TeamCard=team;
    card.setAttribute("role","button");
    card.setAttribute("tabindex","0");
    card.setAttribute("aria-label","Abrir perfil de "+team);
    if(!q(".v27-team-hint",card)){
      const hint=document.createElement("small");
      hint.className="v27-team-hint";
      hint.textContent="Ver perfil · partidos · estadísticas →";
      card.appendChild(hint);
    }
  });
}

/* ---------- CUATRO TARJETAS DE V23 FUNCIONALES ---------- */
function openBracket(){
  const br=q("#shareBracket");
  if(!br){goView("more");return}
  const view=br.closest(".view");
  if(view){
    const name=view.id.replace(/^view-/,"");
    goView(name);
    setTimeout(()=>br.closest("section,.section")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
  }else br.scrollIntoView({behavior:"smooth",block:"center"});
}
function triggerTactics(){
  const b=q('[data-v23-open="tactics"]')||q("#v23TacticsBtn");
  if(b)b.click();
}
function enhanceFeatures(){
  const cards=qa("#v23FootballOS .v23-feature");
  const actions=["hero","match","tactics","cup"];
  cards.forEach((c,i)=>{
    c.dataset.v27Feature=actions[i]||"";
    c.setAttribute("role","button");c.setAttribute("tabindex","0");
  });
}

/* ---------- LIMPIEZA + EVENTOS ---------- */
function cleanDuplicates(){
  /* Se dejan en DOM por compatibilidad, pero ocultos por CSS. */
  q("#v25TableCats")?.setAttribute("aria-hidden","true");
  qa("#view-matches .v21-category-tabs,#v20CalendarArchiveMatches .v21-category-tabs,#v20CalendarArchive .v21-category-tabs")
    .forEach(x=>x.setAttribute("aria-hidden","true"));
}
function afterCategory(cat){
  setTimeout(()=>{
    if(currentView()==="view-stats")renderStats(cat);
    if(currentView()==="view-teams")enhanceTeamCards();
    cleanDuplicates();
  },120);
}
function capture(e){
  const cat=e.target.closest?.("[data-category]");
  if(cat&&CATS.includes(cat.dataset.category)){
    const c=cat.dataset.category;
    /* V21 hará la sincronización normal. V27 completa Estadísticas, que V21 no refrescaba. */
    afterCategory(c);
  }

  const sim=e.target.closest?.('[data-v23-open="simulator"],#v23SimulatorBtn');
  if(sim){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openSmartSimulator();return;
  }
}
function clickHandler(e){
  const card=e.target.closest?.("[data-v27-team-card]");
  if(card&&!e.target.closest("a,button,input,select")){
    openTeamProfile(card.dataset.v27TeamCard);return;
  }
  const perf=e.target.closest?.("[data-v27-team]");
  if(perf){openTeamProfile(perf.dataset.v27Team);return}

  const feat=e.target.closest?.("[data-v27-feature]");
  if(feat){
    const a=feat.dataset.v27Feature;
    if(a==="hero"){goView("home");setTimeout(()=>q("#v14CinematicHero")?.scrollIntoView({behavior:"smooth",block:"start"}),90)}
    else if(a==="match")goView("matchcenter");
    else if(a==="tactics")triggerTactics();
    else if(a==="cup")openBracket();
    return;
  }

  const nav=e.target.closest?.("[data-view]");
  if(nav){
    const v=nav.dataset.view;
    if(v==="stats")setTimeout(()=>renderStats(activeCat()),120);
    if(v==="teams")setTimeout(enhanceTeamCards,140);
    if(v==="table"||v==="matches")setTimeout(cleanDuplicates,100);
  }
}
function keyHandler(e){
  if(e.key!=="Enter"&&e.key!==" ")return;
  const card=e.target.closest?.("[data-v27-team-card]");
  if(card){e.preventDefault();openTeamProfile(card.dataset.v27TeamCard);return}
  const feat=e.target.closest?.("[data-v27-feature]");
  if(feat){e.preventDefault();feat.click()}
}
function relabelSimulator(){
  qa('[data-v23-open="simulator"],#v23SimulatorBtn').forEach(b=>{
    if(b.id==="v23SimulatorBtn"){
      const bold=b.querySelector("b"); if(bold)bold.textContent="Simulador inteligente";
      else b.textContent="📈 Simulador inteligente";
    }else{
      b.textContent="📊 Simular jornada inteligente";
    }
  });
}
function boot(){
  cleanDuplicates();
  enhanceFeatures();
  enhanceTeamCards();
  relabelSimulator();
  if(currentView()==="view-stats")renderStats(activeCat());

  window.addEventListener("click",capture,true);
  document.addEventListener("click",clickHandler);
  document.addEventListener("keydown",keyHandler);
  q("#teamSearch")?.addEventListener("input",()=>setTimeout(enhanceTeamCards,80));

  /* Una pasada corta tras los renderizadores antiguos; sin MutationObserver ni bucles. */
  setTimeout(()=>{cleanDuplicates();enhanceFeatures();enhanceTeamCards();relabelSimulator();if(currentView()==="view-stats")renderStats(activeCat())},850);

  window.LJR_V27={renderStats,openSmartSimulator,openTeamProfile,setCategory,prediction};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();

/* MASTER V28 loader */
(function(){
  if(document.querySelector('script[data-v28-loader]'))return;
  var l=document.createElement('link');
  l.rel='stylesheet';l.href='./assets/v28-functional.css?v=28.0';
  document.head.appendChild(l);
  var s=document.createElement('script');
  s.src='./assets/v28-functional.js?v=28.0';
  s.defer=true;s.dataset.v28Loader='1';
  document.body.appendChild(s);
})();