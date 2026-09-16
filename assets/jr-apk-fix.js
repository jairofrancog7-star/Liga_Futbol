(function(){
"use strict";

const VERSION="81-platform-merge";
const APK="./downloads/Liga_Juventino_Rosas.apk";
const APK_LABEL="Descargar APK Android";
const APK_DESC="APK real de Liga Juventino Rosas · versión 1.6";
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  emit("install-available",runtimeSnapshot());
});
window.addEventListener("appinstalled",()=>{
  deferredInstallPrompt=null;
  refreshRuntime();
  emit("installed",runtimeSnapshot());
});

function apkHref(){
  return APK+"?v=81-1";
}

function isAndroidWrapper(){
  try{
    const params=new URLSearchParams(location.search);
    if(params.get("app")==="android"||params.get("runtime")==="apk") return true;
  }catch(_){}
  return !!(window.LigaAndroid&&typeof window.LigaAndroid.getMode==="function");
}

function isStandalone(){
  return !!(
    (window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||
    navigator.standalone===true
  );
}

function runtimeMode(){
  if(isAndroidWrapper()) return "apk";
  if(isStandalone()) return "app";
  return "browser";
}

function runtimeSnapshot(){
  const mode=runtimeMode();
  return {
    version:VERSION,
    mode,
    browser:mode==="browser",
    app:mode==="app",
    apk:mode==="apk",
    canInstall:mode==="browser"&&!!deferredInstallPrompt,
    apkUrl:apkHref(),
    build:(()=>{
      try{return window.LigaAndroid&&window.LigaAndroid.getBuild?window.LigaAndroid.getBuild():null}catch(_){return null}
    })()
  };
}

function emit(name,detail){
  try{window.dispatchEvent(new CustomEvent("jr:platform:"+name,{detail}))}catch(_){}
}

function refreshRuntime(){
  const snap=runtimeSnapshot();
  document.documentElement.dataset.jrRuntime=snap.mode;
  document.documentElement.dataset.jrPlatformVersion=VERSION;
  try{document.body&&document.body.setAttribute("data-jr-runtime",snap.mode)}catch(_){}
  emit("change",snap);
  return snap;
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
  a.dataset.platformAction="apk";
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
  return ok;
}

async function install(){
  const mode=runtimeMode();
  if(mode==="apk"||mode==="app") return {ok:true,mode,alreadyInstalled:true};
  if(deferredInstallPrompt){
    try{
      deferredInstallPrompt.prompt();
      const choice=await deferredInstallPrompt.userChoice;
      deferredInstallPrompt=null;
      refreshRuntime();
      return {ok:choice&&choice.outcome==="accepted",mode:"browser",outcome:choice&&choice.outcome};
    }catch(error){
      deferredInstallPrompt=null;
    }
  }
  if(window.LJR_V34&&typeof window.LJR_V34.installApp==="function"){
    window.LJR_V34.installApp();
    return {ok:true,mode:"browser",fallback:true};
  }
  return {ok:false,mode:"browser",reason:"install-prompt-unavailable"};
}

function downloadApk(){
  const a=document.createElement("a");
  a.href=apkHref();
  a.download="Liga_Juventino_Rosas.apk";
  a.rel="noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return apkHref();
}

function openInBrowser(url){
  const target=url||location.href.replace(/([?&])app=android(&|$)/,"$1").replace(/[?&]$/," ").trim();
  try{
    if(window.LigaAndroid&&typeof window.LigaAndroid.openBrowser==="function"){
      window.LigaAndroid.openBrowser(target);
      return true;
    }
  }catch(_){}
  try{
    const w=window.open(target,"_blank","noopener");
    return !!w;
  }catch(_){return false}
}

async function share(data){
  const payload=typeof data==="string"?{text:data}:{...(data||{})};
  if(!payload.url) payload.url=location.href;
  if(navigator.share){
    try{await navigator.share(payload);return {ok:true,native:true}}catch(error){
      if(error&&error.name==="AbortError") return {ok:false,cancelled:true};
    }
  }
  try{
    if(window.LigaAndroid&&typeof window.LigaAndroid.shareText==="function"){
      window.LigaAndroid.shareText([payload.title,payload.text,payload.url].filter(Boolean).join("\n"));
      return {ok:true,android:true};
    }
  }catch(_){}
  try{
    await navigator.clipboard.writeText([payload.text,payload.url].filter(Boolean).join("\n"));
    return {ok:true,copied:true};
  }catch(_){return {ok:false}}
}

function platformAction(action,el){
  if(action==="install") return install();
  if(action==="apk"){
    if(el&&el.tagName==="A") return null;
    return downloadApk();
  }
  if(action==="browser") return openInBrowser(el&&el.dataset.platformUrl);
  if(action==="share") return share({title:"Liga Juventino Rosas",url:location.href});
  if(action==="refresh"){location.reload();return true}
  return null;
}

function bindCompatibilityActions(){
  document.addEventListener("click",e=>{
    const el=e.target.closest('[data-platform-action],[data-app-action]');
    if(!el) return;
    const action=el.dataset.platformAction||el.dataset.appAction;
    if(action==="apk"&&el.tagName==="A") return;
    if(!["install","apk","browser","share","refresh"].includes(action)) return;
    e.preventDefault();
    platformAction(action,el);
  },true);
}

function exposePlatform(){
  const api={
    version:VERSION,
    get mode(){return runtimeMode()},
    get state(){return runtimeSnapshot()},
    get apk(){return APK},
    get apkUrl(){return apkHref()},
    refresh:refreshRuntime,
    install,
    downloadApk,
    verifyApk,
    openInBrowser,
    share,
    action:platformAction
  };
  window.LigaPlatform=api;
  window.JRPlatform=api;
  window.LJR_APK_V351={apk:APK,refresh:verifyApk,platform:api};
  return api;
}

function boot(){
  exposePlatform();
  refreshRuntime();
  renamePwa();
  injectHome();
  injectAccess();
  injectMore();
  verifyApk();
  bindCompatibilityActions();

  document.addEventListener("click",e=>{
    if(e.target.closest('[data-view],[data-jr34],[data-jr35]')){
      setTimeout(()=>{
        renamePwa();
        injectHome();
        injectAccess();
        injectMore();
        refreshRuntime();
      },160);
    }
  },true);

  if(window.matchMedia){
    const media=window.matchMedia("(display-mode: standalone)");
    if(media.addEventListener) media.addEventListener("change",refreshRuntime);
  }
  window.addEventListener("pageshow",refreshRuntime);
  emit("ready",runtimeSnapshot());
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();
