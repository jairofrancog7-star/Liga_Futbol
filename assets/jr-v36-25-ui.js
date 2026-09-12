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
    title.innerHTML='<span class="outline">FÚTBOL</span><br><span class="electric">QUE SE<br>SIENTE</span><br><span class="jr37-live">EN VIVO.</span>';
  }

  const lead=q(".v14-lead",hero);
  q("#jrV3625Heritage",hero)?.remove();

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
    <button type="button" class="ghost-btn" data-jr-v3625-view="bracket">🏆 Liguilla</button>`;

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
