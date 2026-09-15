(()=>{'use strict';
if(window.JRMobileRefresh)return;
const BUILD='38-33',INTERVAL=300000;let last=0,busy=false;
document.documentElement.dataset.jrBuild=BUILD;
function injectFix33(){
 if(!document.querySelector('link[data-jr65]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./assets/jr-v38-fix33-social.css?v='+BUILD;l.dataset.jr65='1';document.head.appendChild(l)}
 if(!document.querySelector('script[data-jr65]')){const s=document.createElement('script');s.src='./assets/jr-v38-fix33-social.js?v='+BUILD;s.defer=true;s.dataset.jr65='1';document.head.appendChild(s)}
}
async function check(manual=false){
 if(busy||(!manual&&Date.now()-last<INTERVAL))return;
 busy=true;last=Date.now();const status=document.getElementById('jr57Status');
 try{const response=await fetch('./build-v38.json?t='+Date.now(),{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error();const meta=await response.json();if(!/^\d+-\d+$/.test(meta.build))throw Error();
 if(meta.build!==BUILD){const marker=BUILD+'>'+meta.build;let tried=false;try{tried=sessionStorage.getItem('jr57-refresh-attempt')===marker;sessionStorage.setItem('jr57-refresh-attempt',marker)}catch(_){}
 if(tried){if(status)status.textContent='La publicación está propagándose. Intenta actualizar en unos minutos.';return}
 const u=new URL(location.href);u.searchParams.set('refresh',meta.build);u.searchParams.set('n',Date.now());location.replace(u.href);
 }else if(manual&&status)status.textContent='Versión '+BUILD+' actualizada.';
 }catch(_){if(manual&&status)status.textContent='No se pudo comprobar la versión. Revisa tu conexión.'}finally{busy=false}
}
window.JRMobileRefresh={check,build:BUILD};injectFix33();check();
addEventListener('focus',()=>check());document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
