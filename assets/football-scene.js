(function(){
"use strict";

const VERSION="36.4";
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
    try{window.showToast(text);return}catch(_){}
  }
  if(typeof window.toast==="function"){
    try{window.toast(text);return}catch(_){}
  }
  const el=document.createElement("div");
  el.textContent=text;
  Object.assign(el.style,{
    position:"fixed",
    left:"50%",
    bottom:"110px",
    transform:"translateX(-50%)",
    zIndex:"170000",
    padding:"10px 13px",
    borderRadius:"12px",
    background:"#132219",
    color:"#fff",
    font:"700 12px system-ui",
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
    try{
      window.showView(destination);
      return true;
    }catch(_){}
  }

  const control=qa("[data-view]").find(el=>norm(el.dataset.view)===norm(destination));
  if(control){
    try{
      control.click();
      return true;
    }catch(_){}
  }

  target.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
}

function activateCategory(cat){
  try{localStorage.setItem("jrCategory",cat)}catch(_){}
  qa(".categoryText").forEach(el=>el.textContent=cat);

  const control=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(el=>{
    const value=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat||"";
    return norm(value)===norm(cat);
  });

  if(control){
    try{control.click()}catch(_){}
  }

  setTimeout(()=>{
    go("matches");
    toast("Categoría: "+cat);
  },80);
}

function categoriesModal(){
  let bg=q("#jrV364Categories");

  if(!bg){
    bg=document.createElement("div");
    bg.id="jrV364Categories";
    bg.className="jr-v364-cat-bg";
    bg.innerHTML=`
      <section class="jr-v364-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV364CatTitle">
        <div class="jr-v364-cat-head">
          <h3 id="jrV364CatTitle">5 categorías</h3>
          <button class="jr-v364-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="jr-v364-cat-list">
          ${CATS.map(c=>`
            <button type="button" class="jr-v364-cat" data-jr-v364-cat="${c}">
              ${c}
              <small>Abrir partidos de esta categoría</small>
            </button>`).join("")}
        </div>
      </section>`;

    document.body.appendChild(bg);
    q(".jr-v364-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};

    qa("[data-jr-v364-cat]",bg).forEach(btn=>{
      btn.onclick=()=>{
        bg.classList.remove("show");
        activateCategory(btn.dataset.jrV364Cat);
      };
    });
  }

  bg.classList.add("show");
}

function openLiguilla(){
  if(go("cup")) return;

  const bracket=q(".bracket-inner");
  if(bracket){
    bracket.scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }

  toast("La liguilla no está disponible en esta vista.");
}

function cleanOldBalls(){
  [
    "#jrV362SecondBall",
    "#jrV363SecondBall",
    "#jrV364SecondSection",
    "#jrV36BallCanvas",
    "#jrV362TopBall",
    "#jrV362BottomBall",
    "#jrV363TopBall",
    "#jrV363BottomBall"
  ].forEach(sel=>qa(sel).forEach(el=>el.remove()));
}

function heroMarkup(){
  return `
    <div id="jrV364HeroArt" aria-label="Portada Liga Juventino Rosas">
      <img
        class="jr-v364-image"
        src="./assets/hero-v36-4.png?v=36-4"
        alt="Liga Juventino Rosas: La liga se vive en tiempo real, con un balón de fútbol realista."
        draggable="false">

      <div class="jr-v364-glow" aria-hidden="true"></div>

      <button class="jr-v364-hotspot jr-v364-match" data-jr-v364="match" aria-label="Abrir Match Center">Match Center</button>
      <button class="jr-v364-hotspot jr-v364-jornada" data-jr-v364="jornada" aria-label="Abrir Jornada">Jornada</button>
      <button class="jr-v364-hotspot jr-v364-liguilla" data-jr-v364="cup" aria-label="Abrir Liguilla">Liguilla</button>
      <button class="jr-v364-hotspot jr-v364-categorias" data-jr-v364="cats" aria-label="Elegir una de las 5 categorías">5 categorías</button>
      <button class="jr-v364-hotspot jr-v364-live" data-jr-v364="match" aria-label="Abrir LIVE Match Center">LIVE Match Center</button>
      <button class="jr-v364-hotspot jr-v364-matchday" data-jr-v364="matchday" aria-label="Abrir JR Matchday">JR Matchday</button>
    </div>`;
}

function secondMarkup(){
  const section=document.createElement("section");
  section.id="jrV364SecondSection";
  section.innerHTML=`
    <div id="jrV364SecondArt" aria-label="Segundo diseño de balón de Liga Juventino Rosas">
      <img
        class="jr-v364-image"
        src="./assets/segundo-balon-v36-4.png?v=36-4"
        alt="Segundo diseño: balón de fútbol grafito y dorado."
        draggable="false">
      <div class="jr-v364-glow" aria-hidden="true"></div>
    </div>`;
  return section;
}

function mountExactlyTwo(){
  const hero=q("#v14CinematicHero");
  if(!hero) return;

  cleanOldBalls();

  /* Sustituye TODO el hero anterior: elimina los balones estrella/3D defectuosos. */
  hero.innerHTML=heroMarkup();

  /* Segundo y último balón: una sola sección debajo. */
  const second=secondMarkup();
  hero.insertAdjacentElement("afterend",second);
}

function bindActions(){
  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-jr-v364]");
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const action=btn.dataset.jrV364;
    if(action==="cats") categoriesModal();
    else if(action==="match") go("matchcenter");
    else if(action==="matchday"||action==="jornada") go("matches");
    else if(action==="cup") openLiguilla();
  },true);
}

function parallax(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(matchMedia("(max-width:760px)").matches) return;

  qa("#jrV364HeroArt,#jrV364SecondArt").forEach(card=>{
    const img=q(".jr-v364-image",card);
    if(!img) return;

    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*5;
      const y=((e.clientY-r.top)/r.height-.5)*4;
      img.style.setProperty("--jr-mx",x.toFixed(2)+"px");
      img.style.setProperty("--jr-my",y.toFixed(2)+"px");
    });

    card.addEventListener("pointerleave",()=>{
      img.style.setProperty("--jr-mx","0px");
      img.style.setProperty("--jr-my","0px");
    });
  });
}

function verifyOnlyTwo(){
  const images=qa("#jrV364HeroArt .jr-v364-image,#jrV364SecondArt .jr-v364-image");
  if(images.length!==2){
    console.warn("[Liga JR V36.4] Se esperaban exactamente 2 diseños, encontrados:",images.length);
  }
}

function boot(){
  mountExactlyTwo();
  bindActions();
  parallax();
  verifyOnlyTwo();

  window.LJR_V364={
    version:VERSION,
    categoriesModal,
    go,
    remount:()=>{
      mountExactlyTwo();
      parallax();
      verifyOnlyTwo();
    }
  };
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();
