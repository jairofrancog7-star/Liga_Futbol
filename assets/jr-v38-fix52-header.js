/* V38 FIX52 — mantiene el escudo y los botones del encabezado después de cualquier render */
(()=>{'use strict';
if(window.__JR52HeaderFix)return;window.__JR52HeaderFix=true;
const BUILD='38-52-r1';
const LOGO='./assets/branding/america-veteranos-35.svg?v='+BUILD;
const q=(s,r=document)=>r.querySelector(s);
function patch(){
  const logo=q('.topbar .logo');
  if(logo){
    logo.classList.add('logo-america');
    logo.removeAttribute('aria-hidden');
    logo.setAttribute('aria-label','Club América Veteranos Juventino Rosas');
    if(!logo.querySelector('[data-jr52-america-logo]')){
      logo.innerHTML='<img data-jr52-america-logo src="'+LOGO+'" alt="Club América Veteranos Juventino Rosas" width="44" height="44">';
    }
  }
  const actions=q('.topbar .top-actions');
  if(actions){
    actions.classList.add('jr52-top-actions');
    actions.querySelectorAll(':scope > *').forEach(el=>{
      el.classList.remove('hide-mobile','hidden');
      el.hidden=false;
      el.removeAttribute('aria-hidden');
      el.style.removeProperty('display');
    });
  }
  document.documentElement.dataset.jr52Header='ready';
}
function needsPatch(){
  const logo=q('.topbar .logo');
  const actions=q('.topbar .top-actions');
  return !logo||!logo.querySelector('[data-jr52-america-logo]')||
    !actions||Array.from(actions.children).some(el=>el.hidden||el.classList.contains('hide-mobile')||el.getAttribute('aria-hidden')==='true');
}
function start(){
  patch();
  [100,300,700,1400,2600,5000].forEach(ms=>setTimeout(()=>{if(needsPatch())patch()},ms));
  const mo=new MutationObserver(()=>{if(needsPatch())patch()});
  if(document.body)mo.observe(document.body,{childList:true,subtree:true});
}
window.JRHeaderFixV3852={build:BUILD,refresh:patch,logo:LOGO};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();