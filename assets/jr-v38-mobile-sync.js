
(function(){
'use strict';
if(window.__JR54MobileSync)return;
window.__JR54MobileSync=true;
const BUILD='38-22', CHECK_EVERY=5*60*1000;
let lastCheck=0;
document.documentElement.dataset.jrBuild=BUILD;
async function clearOld(){
  try{
    const old=localStorage.getItem('jr54-mobile-build');
    if(old!==BUILD){
      localStorage.setItem('jr54-mobile-build',BUILD);
      if('caches'in window){
        const keys=await caches.keys();
        await Promise.all(keys.map(k=>caches.delete(k)));
      }
      if(navigator.serviceWorker){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
      }
    }
  }catch(_){}
}
async function checkBuild(){
  if(Date.now()-lastCheck<CHECK_EVERY)return;
  lastCheck=Date.now();
  try{
    const r=await fetch('./build-v38.json?t='+Date.now(),{cache:'no-store',credentials:'omit'});
    if(!r.ok)return;
    const b=await r.json();
    if(b&&b.build&&b.build!==BUILD){
      const u=new URL(location.href);
      u.searchParams.set('refresh',b.build);
      u.searchParams.set('n',Date.now());
      location.replace(u.href);
    }
  }catch(_){}
}
clearOld().finally(checkBuild);
addEventListener('focus',checkBuild,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkBuild()});
})();
