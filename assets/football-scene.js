(function(){
"use strict";

const VERSION="36.6";
const CATS=[
  "Primera Fuerza",
  "Intermedia",
  "Segunda Fuerza",
  "Veteranos 35+",
  "Veteranos 50+"
];

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||"")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"")
  .toLowerCase()
  .replace(/\s+/g," ")
  .trim();

function toast(text){
  if(typeof window.showToast==="function"){
    try{window.showToast(text);return}catch(_){ }
  }
  const el=document.createElement("div");
  el.textContent=text;
  Object.assign(el.style,{
    position:"fixed",left:"50%",bottom:"110px",transform:"translateX(-50%)",
    zIndex:"170000",padding:"10px 13px",borderRadius:"12px",
    background:"#132219",color:"#fff",font:"700 12px system-ui",
    boxShadow:"0 10px 30px rgba(0,0,0,.38)"
  });
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}

function go(view){
  const destination=view==="match"?"matchcenter":view;
  const target=document.getElementById("view-"+destination);

  if(!target){
    toast("Sección no disponible.");
    return false;
  }

  if(typeof window.showView==="function"){
    try{window.showView(destination);return true}catch(_){ }
  }

  const control=qa("[data-view]").find(el=>norm(el.dataset.view)===norm(destination));
  if(control){
    try{control.click();return true}catch(_){ }
  }

  target.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
}

function activateCategory(cat){
  try{localStorage.setItem("jrCategory",cat)}catch(_){ }
  qa(".categoryText").forEach(el=>el.textContent=cat);

  const control=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(el=>{
    const value=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat||"";
    return norm(value)===norm(cat);
  });

  if(control){
    try{control.click()}catch(_){ }
  }

  setTimeout(()=>{go("matches");toast("Categoría: "+cat);},80);
}

function categoriesModal(){
  let bg=q("#jrV366Categories");
  if(!bg){
    bg=document.createElement("div");
    bg.id="jrV366Categories";
    bg.className="jr-v366-cat-bg";
    bg.innerHTML=`
      <section class="jr-v366-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV366CatTitle">
        <div class="jr-v366-cat-head">
          <h3 id="jrV366CatTitle">5 categorías</h3>
          <button class="jr-v366-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="jr-v366-cat-list">
          ${CATS.map(c=>`
            <button type="button" class="jr-v366-cat" data-jr-v366-cat="${c}">
              ${c}
              <small>Abrir partidos de esta categoría</small>
            </button>`).join("")}
        </div>
      </section>`;
    document.body.appendChild(bg);
    q(".jr-v366-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};
    qa("[data-jr-v366-cat]",bg).forEach(btn=>{
      btn.onclick=()=>{bg.classList.remove("show");activateCategory(btn.dataset.jrV366Cat);};
    });
  }
  bg.classList.add("show");
}

function openLiguilla(){
  if(go("cup")) return;
  const bracket=q(".bracket-inner");
  if(bracket){bracket.scrollIntoView({behavior:"smooth",block:"center"});return;}
  toast("La liguilla no está disponible en esta vista.");
}

function removeOldBlocks(){
  [
    "#v12CinematicHero",
    "#jrV365SecondSection",
    "#jrV365SecondArt",
    "#jrV364SecondSection",
    "#jrV362SecondBall",
    "#jrV363SecondBall",
    "#jrV36SecondBall",
    "#jrV365GoldBall"
  ].forEach(sel=>qa(sel).forEach(el=>el.remove()));
}

function heroMarkup(){
  const source="./assets/hero-v36-4.png?v=36-6";
  return `
    <div id="jrV366HeroArt" aria-label="Portada Liga Juventino Rosas">
      <img class="jr-v366-image" src="${source}" alt="Liga Juventino Rosas: La liga se vive en tiempo real." draggable="false">
      <div class="jr-v366-orbit" aria-hidden="true"></div>
      <div class="jr-v366-ball-window" data-jr-v366-ball="top" aria-hidden="true">
        <div class="jr-v366-ball-rotor">
          <img class="jr-v366-ball-source" src="${source}" alt="" draggable="false">
        </div>
      </div>
      <button class="jr-v366-hotspot jr-v366-match" data-jr-v366="match" aria-label="Abrir Match Center">Match Center</button>
      <button class="jr-v366-hotspot jr-v366-jornada" data-jr-v366="jornada" aria-label="Abrir Jornada">Jornada</button>
      <button class="jr-v366-hotspot jr-v366-liguilla" data-jr-v366="cup" aria-label="Abrir Liguilla">Liguilla</button>
      <button class="jr-v366-hotspot jr-v366-categorias" data-jr-v366="cats" aria-label="Elegir una de las 5 categorías">5 categorías</button>
      <button class="jr-v366-hotspot jr-v366-live" data-jr-v366="match" aria-label="Abrir LIVE Match Center">LIVE Match Center</button>
      <button class="jr-v366-hotspot jr-v366-matchday" data-jr-v366="matchday" aria-label="Abrir JR Matchday">JR Matchday</button>
    </div>`;
}

function mountSingleHero(){
  const hero=q("#v14CinematicHero");
  if(!hero) return;
  removeOldBlocks();
  hero.innerHTML=heroMarkup();
}

function bindActions(){
  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-jr-v366]");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const action=btn.dataset.jrV366;
    if(action==="cats") categoriesModal();
    else if(action==="match") go("matchcenter");
    else if(action==="matchday"||action==="jornada") go("matches");
    else if(action==="cup") openLiguilla();
  },true);
}

function startMotion(){
  const rotor=q('[data-jr-v366-ball="top"] .jr-v366-ball-rotor');
  if(!rotor) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){
    rotor.style.transform="rotate(0deg)";
    return;
  }

  rotor.animate(
    [
      {transform:"rotate(0deg) scale(1)"},
      {transform:"rotate(18deg) scale(1.01)"},
      {transform:"rotate(36deg) scale(1)"}
    ],
    {
      duration:18000,
      easing:"linear",
      iterations:Infinity
    }
  );
}

function boot(){
  mountSingleHero();
  bindActions();
  requestAnimationFrame(()=>requestAnimationFrame(startMotion));
  window.LJR_V366={version:VERSION,go,categoriesModal,remount:()=>{mountSingleHero();requestAnimationFrame(startMotion);}};
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{boot();}
})();
