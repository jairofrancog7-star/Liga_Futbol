(function(){
"use strict";

const APK="./downloads/Liga_Juventino_Rosas.apk";
const APK_LABEL="Descargar APK Android";
const APK_DESC="APK real de Liga Juventino Rosas · versión 1.1";
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

function apkHref(){
  return APK+"?v=35-1";
}

function cardHTML(kind){
  if(kind==="v22"){
    return '<span class="v22-access-icon">📲</span><strong>'+APK_LABEL+'</strong><small>'+APK_DESC+'</small><span class="jr-apk-badge">Archivo .APK</span>';
  }
  if(kind==="more"){
    return '<span>📲</span><b>'+APK_LABEL+'</b><small>'+APK_DESC+'</small><span class="jr-apk-badge">Archivo .APK</span>';
  }
  return '<span style="font-size:24px">📲</span><b>'+APK_LABEL+'</b><small>'+APK_DESC+'</small><span class="jr-apk-badge">Archivo .APK</span>';
}

function makeLink(kind){
  const a=document.createElement("a");
  a.href=apkHref();
  a.download="Liga_Juventino_Rosas.apk";
  a.dataset.jrApkReal="1";
  a.className=(kind==="v22"?"v22-access-card":kind==="more"?"more-card":"jr34-card")+" jr-apk-real-card";
  a.setAttribute("aria-label","Descargar APK Android de Liga Juventino Rosas");
  a.innerHTML=cardHTML(kind);
  return a;
}

function renamePwa(){
  qa('[data-jr34="install"],[data-jr35="install"]').forEach(el=>{
    const b=el.querySelector("b,strong");
    const s=el.querySelector("small");
    if(b) b.textContent="Acceso directo (PWA)";
    if(s) s.textContent="Instala el acceso directo en Android, iPhone o PC.";
  });
}

function injectHome(){
  const grid=q("#jr34ExperienceStrip .jr34-quick-grid");
  if(!grid || q('[data-jr-apk-real="1"]',grid)) return;
  const pwa=q('[data-jr34="install"],[data-jr35="install"]',grid);
  const link=makeLink("home");
  if(pwa) pwa.insertAdjacentElement("beforebegin",link);
  else grid.appendChild(link);
}

function injectAccess(){
  const grid=q("#v22AccessHub .v22-access-grid");
  if(!grid || q('[data-jr-apk-real="1"]',grid)) return;
  grid.appendChild(makeLink("v22"));
}

function injectMore(){
  const grid=q("#view-more .more-grid");
  if(!grid || q('[data-jr-apk-real="1"]',grid)) return;
  grid.appendChild(makeLink("more"));
}

async function verifyApk(){
  let ok=false;
  try{
    const r=await fetch(APK+"?check="+Date.now(),{method:"HEAD",cache:"no-store"});
    ok=r.ok;
  }catch(_){}
  qa('[data-jr-apk-real="1"]').forEach(a=>{
    a.classList.toggle("jr-apk-unavailable",!ok);
    const badge=a.querySelector(".jr-apk-badge");
    if(badge) badge.textContent=ok?"✓ APK disponible":"APK no verificada";
  });
}

function boot(){
  renamePwa();
  injectHome();
  injectAccess();
  injectMore();
  verifyApk();

  document.addEventListener("click",e=>{
    if(e.target.closest('[data-view],[data-jr34],[data-jr35]')){
      setTimeout(()=>{
        renamePwa();
        injectHome();
        injectAccess();
        injectMore();
      },160);
    }
  },true);

  window.LJR_APK_V351={apk:APK,refresh:verifyApk};
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();
