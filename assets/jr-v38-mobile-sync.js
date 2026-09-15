(()=>{'use strict';
if(window.JRMobileRefresh?.build==='38-36')return;
const BUILD='38-36',INTERVAL=300000;let last=0,busy=false;
document.documentElement.dataset.jrBuild=BUILD;
function addCss(href,key){if(document.querySelector(`link[data-${key}]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(`data-${key}`,'1');document.head.appendChild(l)}
function addJs(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(`data-${key}`,'1');document.head.appendChild(s)}
function injectFixes(){
 addCss('./assets/jr-v38-fix33-social.css?v='+BUILD,'jr65');
 addJs('./assets/jr-v38-fix33-social.js?v='+BUILD,'jr65');
 addCss('./assets/jr-v38-fix34-category-cleanup.css?v='+BUILD,'jr66');
 addJs('./assets/jr-v38-fix34-category-cleanup.js?v='+BUILD,'jr66');
 addCss('./assets/jr-v38-fix35-roster-social.css?v='+BUILD,'jr67');
 addJs('./assets/jr-v38-fix35-roster-social.js?v='+BUILD,'jr67');
 addCss('./assets/jr-v38-fix36.css?v='+BUILD,'jr68');
 addJs('./assets/jr-v38-fix36.js?v='+BUILD,'jr68');
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
window.JRMobileRefresh={check,build:BUILD};injectFixes();check();
addEventListener('focus',()=>check());document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
