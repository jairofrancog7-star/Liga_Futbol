/* V38 FIX53 — mantiene el logo real de Liga Juventino Rosas y los botones de arriba */
(()=>{'use strict';
if(window.__JR52HeaderFix)return;window.__JR52HeaderFix=true;
const BUILD='38-53-r2';
const LOGO='./assets/liga-logo.webp?v='+BUILD;
const q=(s,r=document)=>r.querySelector(s);
function patch(){
  const logo=q('.topbar .logo');
  if(logo){
    logo.classList.remove('logo-america');
    logo.classList.add('logo-league');
    logo.removeAttribute('aria-hidden');
    logo.setAttribute('aria-label','Logo Liga Municipal de Fútbol Juventino Rosas');
    let img=logo.querySelector('[data-jr53-league-logo]');
    if(!img || img.getAttribute('src')!==LOGO){
      logo.innerHTML='<img data-jr53-league-logo src="'+LOGO+'" alt="Logo Liga Municipal de Fútbol Juventino Rosas" width="44" height="44">';
    }else{
      img.alt='Logo Liga Municipal de Fútbol Juventino Rosas';
      img.width=44;
      img.height=44;
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
  document.documentElement.dataset.jr53Header='ready';
}
function needsPatch(){
  const logo=q('.topbar .logo');
  const actions=q('.topbar .top-actions');
  const img=logo?.querySelector('[data-jr53-league-logo]');
  return !logo||!img||img.getAttribute('src')!==LOGO||logo.classList.contains('logo-america')||
    !actions||Array.from(actions.children).some(el=>el.hidden||el.classList.contains('hide-mobile')||el.getAttribute('aria-hidden')==='true');
}
function start(){
  patch();
  [100,300,700,1400,2600,5000].forEach(ms=>setTimeout(()=>{if(needsPatch())patch()},ms));
  const mo=new MutationObserver(()=>{if(needsPatch())patch()});
  if(document.body)mo.observe(document.body,{childList:true,subtree:true});
}
window.JRHeaderFixV3853={build:BUILD,refresh:patch,logo:LOGO};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();