(function(){
"use strict";

const q=(s,r=document)=>r.querySelector(s);

function showView(name){
  const dest=name==="match"?"matchcenter":name;
  if(typeof window.showView==="function"){
    try{window.showView(dest);return true}catch(_){}
  }
  const t=document.getElementById("view-"+dest);
  if(t){t.scrollIntoView({behavior:"smooth",block:"start"});return true}
  return false;
}

function restoreHero(){
  const hero=q("#v14CinematicHero");
  if(!hero)return;

  const title=q(".v14-title",hero);
  if(title){
    title.innerHTML='<span class="outline">LA LIGA</span><br><span class="electric">SE VIVE</span><br>EN TIEMPO REAL.';
  }

  const lead=q(".v14-lead",hero);
  if(lead && !q("#jrV3625Heritage",hero)){
    const sig=document.createElement("div");
    sig.id="jrV3625Heritage";
    sig.setAttribute("aria-label","Fútbol que se siente en vivo");
    sig.innerHTML='<span class="football">FÚTBOL</span><span class="feel">QUE SE SIENTE</span><span class="live">EN VIVO.</span>';
    lead.insertAdjacentElement("afterend",sig);
  }

  let actions=q(".v14-actions",hero);
  if(!actions){
    actions=document.createElement("div");
    actions.className="v14-actions";
    const sig=q("#jrV3625Heritage",hero);
    (sig||lead||title).insertAdjacentElement("afterend",actions);
  }

  actions.innerHTML=`
    <button type="button" class="primary-btn" data-jr-v3625-view="matchcenter">🔴 Match Center</button>
    <button type="button" class="ghost-btn" data-jr-v3625-view="matches">⚽ Jornada</button>
    <button type="button" class="ghost-btn" data-jr-v3625-view="cup">🏆 Liguilla</button>`;

  actions.querySelectorAll("[data-jr-v3625-view]").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.preventDefault();
      e.stopPropagation();
      showView(btn.dataset.jrV3625View);
    });
  });
}

function boot(){
  restoreHero();
  window.addEventListener("pageshow",()=>setTimeout(restoreHero,100));
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();
