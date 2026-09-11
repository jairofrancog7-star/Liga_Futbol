(function(){
"use strict";

const VERSION="36.5";
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
  let bg=q("#jrV365Categories");

  if(!bg){
    bg=document.createElement("div");
    bg.id="jrV365Categories";
    bg.className="jr-v365-cat-bg";
    bg.innerHTML=`
      <section class="jr-v365-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV365CatTitle">
        <div class="jr-v365-cat-head">
          <h3 id="jrV365CatTitle">5 categorías</h3>
          <button class="jr-v365-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="jr-v365-cat-list">
          ${CATS.map(c=>`
            <button type="button" class="jr-v365-cat" data-jr-v365-cat="${c}">
              ${c}
              <small>Abrir partidos de esta categoría</small>
            </button>`).join("")}
        </div>
      </section>`;

    document.body.appendChild(bg);
    q(".jr-v365-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};

    qa("[data-jr-v365-cat]",bg).forEach(btn=>{
      btn.onclick=()=>{
        bg.classList.remove("show");
        activateCategory(btn.dataset.jrV365Cat);
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

function removeOldThirdBall(){
  /* Este era el hero viejo que aparece como tercer balón blanco. */
  const v12=q("#v12CinematicHero");
  if(v12){
    v12.setAttribute("aria-hidden","true");
    v12.hidden=true;
  }

  [
    "#jrV362SecondBall",
    "#jrV363SecondBall",
    "#jrV364SecondSection",
    "#jrV365SecondSection",
    "#jrV36BallCanvas",
    "#jrV362TopBall",
    "#jrV362BottomBall",
    "#jrV363TopBall",
    "#jrV363BottomBall"
  ].forEach(sel=>qa(sel).forEach(el=>el.remove()));
}

function movingBallMarkup(source,kind){
  const klass=kind==="gold"?"jr-v365-gold-ball":"jr-v365-top-ball";
  return `
    <div class="jr-v365-ball-window ${klass}" data-jr-v365-ball="${kind}" aria-hidden="true">
      <div class="jr-v365-ball-rotor">
        <img class="jr-v365-ball-source" src="${source}" alt="" draggable="false">
      </div>
    </div>`;
}

function heroMarkup(){
  const source="./assets/hero-v36-4.png?v=36-5";
  return `
    <div id="jrV365HeroArt" aria-label="Portada Liga Juventino Rosas">
      <img
        class="jr-v365-image"
        src="${source}"
        alt="Liga Juventino Rosas: La liga se vive en tiempo real."
        draggable="false">

      <div class="jr-v365-orbit top" aria-hidden="true"></div>
      ${movingBallMarkup(source,"top")}

      <button class="jr-v365-hotspot jr-v365-match" data-jr-v365="match" aria-label="Abrir Match Center">Match Center</button>
      <button class="jr-v365-hotspot jr-v365-jornada" data-jr-v365="jornada" aria-label="Abrir Jornada">Jornada</button>
      <button class="jr-v365-hotspot jr-v365-liguilla" data-jr-v365="cup" aria-label="Abrir Liguilla">Liguilla</button>
      <button class="jr-v365-hotspot jr-v365-categorias" data-jr-v365="cats" aria-label="Elegir una de las 5 categorías">5 categorías</button>
      <button class="jr-v365-hotspot jr-v365-live" data-jr-v365="match" aria-label="Abrir LIVE Match Center">LIVE Match Center</button>
      <button class="jr-v365-hotspot jr-v365-matchday" data-jr-v365="matchday" aria-label="Abrir JR Matchday">JR Matchday</button>
    </div>`;
}

function secondMarkup(){
  const source="./assets/segundo-balon-v36-4.png?v=36-5";
  const section=document.createElement("section");
  section.id="jrV365SecondSection";
  section.innerHTML=`
    <div id="jrV365SecondArt" aria-label="Segundo diseño de Liga Juventino Rosas">
      <img
        class="jr-v365-image"
        src="${source}"
        alt="Segundo diseño con balón grafito y dorado."
        draggable="false">

      <div class="jr-v365-orbit gold" aria-hidden="true"></div>
      ${movingBallMarkup(source,"gold")}
    </div>`;
  return section;
}

function mountExactlyTwo(){
  const hero=q("#v14CinematicHero");
  if(!hero) return;

  removeOldThirdBall();

  /* Primer diseño: imagen completa + el MISMO balón animado encima. */
  hero.innerHTML=heroMarkup();

  /* Segundo y último diseño. */
  const second=secondMarkup();
  hero.insertAdjacentElement("afterend",second);
}

function bindActions(){
  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-jr-v365]");
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const action=btn.dataset.jrV365;

    if(action==="cats") categoriesModal();
    else if(action==="match") go("matchcenter");
    else if(action==="matchday"||action==="jornada") go("matches");
    else if(action==="cup") openLiguilla();
  },true);
}

function spinRotor(rotor,direction,index){
  if(!rotor) return;

  if(matchMedia("(prefers-reduced-motion: reduce)").matches){
    rotor.style.transform="rotate(0deg)";
    return;
  }

  /* Giro fuerte al abrir: 920 grados, tal como se pidió. */
  const introDegrees=direction*920;
  const introDuration=index===0?4300:4900;

  const intro=rotor.animate(
    [
      {transform:"rotate(0deg) scale(1)"},
      {transform:`rotate(${introDegrees}deg) scale(1.018)`}
    ],
    {
      duration:introDuration,
      easing:"cubic-bezier(.18,.76,.22,1)",
      fill:"forwards"
    }
  );

  intro.onfinish=()=>{
    rotor.style.transform=`rotate(${introDegrees}deg)`;

    /*
     * Después del giro inicial no se queda quieto:
     * continúa girando despacio de forma infinita.
     */
    rotor.animate(
      [
        {transform:`rotate(${introDegrees}deg)`},
        {transform:`rotate(${introDegrees + direction*360}deg)`}
      ],
      {
        duration:index===0?14500:17200,
        easing:"linear",
        iterations:Infinity
      }
    );
  };
}

function startMotion(){
  const top=q('[data-jr-v365-ball="top"] .jr-v365-ball-rotor');
  const gold=q('[data-jr-v365-ball="gold"] .jr-v365-ball-rotor');

  spinRotor(top,1,0);
  spinRotor(gold,-1,1);
}

function verifyExactlyTwo(){
  const cards=qa("#jrV365HeroArt,#jrV365SecondArt");
  const windows=qa("[data-jr-v365-ball]");

  if(cards.length!==2||windows.length!==2){
    console.warn(
      "[Liga JR V36.5] Se esperaban exactamente 2 diseños y 2 balones.",
      {cards:cards.length,balls:windows.length}
    );
  }
}

function boot(){
  mountExactlyTwo();
  bindActions();

  /* Esperar a que el navegador pinte las imágenes antes de comenzar el giro. */
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      startMotion();
      verifyExactlyTwo();
    });
  });

  window.LJR_V365={
    version:VERSION,
    categoriesModal,
    go,
    remount:()=>{
      mountExactlyTwo();
      requestAnimationFrame(startMotion);
    }
  };
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();
