
/* MASTER V26 — quita Guía 3D/Open Source y hace funcionales las categorías en JR Control. */
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
const api=()=>window.LJR_V20_API||null;

function activeView(){ return q(".view.active")?.id||""; }
function activeCat(){
  try{
    return api()?.getCategory?.() || localStorage.getItem("jrCategory") || "Primera Fuerza";
  }catch(e){return "Primera Fuerza"}
}
function teams(cat){
  const d=window.LJR_V20||api()?.data||window.LJR_V18||null;
  const a=d?.rosters?.[cat];
  if(Array.isArray(a)&&a.length)return a.map(x=>x.name||x.team||x).filter(Boolean);
  return FALLBACK[cat]||[];
}
function removeGuide(){
  q("#v23GuideBtn")?.remove();
  qa("button,a").forEach(el=>{
    const t=(el.textContent||"").trim().toLowerCase();
    if(t==="guía 3d / open source" || t==="guia 3d / open source") el.remove();
  });
}
function updateActive(cat){
  qa("[data-category]").forEach(el=>{
    el.classList.toggle("active",el.dataset.category===cat);
    el.setAttribute("aria-pressed",el.dataset.category===cat?"true":"false");
  });
  qa("[data-v21-cat]").forEach(el=>el.classList.toggle("active",el.dataset.v21Cat===cat));
  qa("[data-v20-cat]").forEach(el=>el.classList.toggle("active",el.dataset.v20Cat===cat));
  qa("[data-v25-cat]").forEach(el=>el.classList.toggle("active",el.dataset.v25Cat===cat));
  qa(".categoryText").forEach(el=>el.textContent=cat);
  qa(".v25-current-cat").forEach(el=>el.textContent=cat);
}
function selectCategoryInAdminForms(cat){
  qa("#view-admin select").forEach(sel=>{
    const options=[...sel.options].map(o=>o.value||o.textContent);
    if(options.includes(cat)){
      sel.value=cat;
      try{sel.dispatchEvent(new Event("change",{bubbles:true}))}catch(e){}
    }
  });
}
function refreshLegacy(cat){
  try{window.currentCategory=cat}catch(e){}
  const names=[
    "renderDashboard","renderPlayers","renderTeams","renderMatches","renderScorers",
    "renderStandings","renderSanctions","renderReports","renderAudit","renderFields"
  ];
  names.forEach(n=>{
    try{ if(typeof window[n]==="function") window[n](); }catch(e){}
  });
  try{api()?.renderStandings?.()}catch(e){}
  try{api()?.renderTeams?.()}catch(e){}
}
function ensureContext(){
  const view=q("#view-admin"); if(!view)return;
  let box=q("#v26AdminCategoryContext");
  if(!box){
    box=document.createElement("div");
    box.id="v26AdminCategoryContext";
    box.className="v26-admin-category-context";
    const title=q(".section-title",view);
    if(title)title.insertAdjacentElement("afterend",box); else view.prepend(box);
  }
  const cat=activeCat();
  box.innerHTML=`<div><small>Categoría administrativa activa</small><strong>${esc(cat)}</strong></div>
    <div class="v26-count">${teams(cat).length} equipos registrados</div>`;
}
function applyCategory(cat){
  if(!CATS.includes(cat))return;
  try{localStorage.setItem("jrCategory",cat)}catch(e){}
  try{api()?.setCategory?.(cat)}catch(e){}
  try{
    if(typeof currentCategory!=="undefined") currentCategory=cat;
  }catch(e){}
  updateActive(cat);
  selectCategoryInAdminForms(cat);
  refreshLegacy(cat);
  ensureContext();

  const selected=qa("[data-category]").find(el=>el.dataset.category===cat);
  if(selected) selected.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});

  try{
    document.dispatchEvent(new CustomEvent("jr:categorychange",{detail:{category:cat,source:"MASTER_V26"}}));
  }catch(e){}
  try{
    if(typeof window.toast==="function") window.toast("Categoría activa: "+cat,"success");
  }catch(e){}
}
function adminCategoryCapture(e){
  if(activeView()!=="view-admin")return;
  const btn=e.target.closest?.("[data-category]");
  if(!btn)return;
  const cat=btn.dataset.category;
  if(!CATS.includes(cat))return;

  // Este listener vive en window/captura y se ejecuta antes del interceptador antiguo de V21.
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  applyCategory(cat);
}
function boot(){
  removeGuide();
  ensureContext();
  updateActive(activeCat());
  window.addEventListener("click",adminCategoryCapture,true);

  // Limpieza corta por si V23 intenta reconstruir Más después del arranque.
  setTimeout(removeGuide,350);
  setTimeout(removeGuide,1200);

  document.addEventListener("click",e=>{
    if(e.target.closest?.('[data-view="admin"]')){
      setTimeout(()=>{ensureContext();updateActive(activeCat());removeGuide()},120);
    }
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();
