(()=>{'use strict';
if(window.JRMobileRefresh?.build==='38-49')return;
const BUILD='38-49',INTERVAL=300000,FIX42REV='38-42-r2',FIX43REV='38-43-r2',FIX44REV='38-44-r1';let last=0,busy=false;
document.documentElement.dataset.jrBuild=BUILD;
function addCss(href,key){if(document.querySelector(`link[data-${key}]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(`data-${key}`,'1');document.head.appendChild(l)}
function addJs(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(`data-${key}`,'1');document.head.appendChild(s)}
function injectFixes(){
 addCss('./assets/jr-v38-fix33-social.css?v='+BUILD,'jr65'); addJs('./assets/jr-v38-fix33-social.js?v='+BUILD,'jr65');
 addCss('./assets/jr-v38-fix34-category-cleanup.css?v='+BUILD,'jr66'); addJs('./assets/jr-v38-fix34-category-cleanup.js?v='+BUILD,'jr66');
 addCss('./assets/jr-v38-fix35-roster-social.css?v='+BUILD,'jr67'); addJs('./assets/jr-v38-fix35-roster-social.js?v='+BUILD,'jr67');
 addCss('./assets/jr-v38-fix36.css?v='+BUILD,'jr68'); addJs('./assets/jr-v38-fix36.js?v='+BUILD,'jr68');
 addCss('./assets/jr-v38-fix37.css?v='+BUILD,'jr70'); addJs('./assets/jr-v38-fix37.js?v='+BUILD,'jr70');
 addCss('./assets/jr-v38-fix39-credential.css?v='+BUILD,'jr72'); addJs('./assets/jr-v38-fix39-credential.js?v='+BUILD,'jr72');
 addCss('./assets/jr-v38-fix40.css?v='+BUILD,'jr73'); addJs('./assets/jr-v38-fix40.js?v='+BUILD,'jr73');
 addCss('./assets/jr-v38-fix42-layout.css?v='+FIX42REV,'jr74'); addJs('./assets/jr-v38-fix42-layout.js?v='+FIX42REV,'jr74');
 addCss('./assets/jr-v38-fix43-category-row.css?v='+FIX43REV,'jr75'); addJs('./assets/jr-v38-fix43-category-row.js?v='+FIX43REV,'jr75');
 addJs('./assets/jr-v38-fix44-category-replace.js?v='+FIX44REV,'jr75x');
 /* FIX45 queda sólo para categorías. FIX46/FIX47 se retiran porque duplicaban América. */
 addCss('./assets/jr-v38-fix45-stability.css?v=38-48-r1','jr76'); addJs('./assets/jr-v38-fix45-stability.js?v=38-48-r1','jr76');
 /* FIX48 es la única capa que toca la tarjeta de América y se carga al final. */
 addCss('./assets/jr-v38-fix48-america-card.css?v=38-48-r1','jr79'); addJs('./assets/jr-v38-fix48-america-card.js?v=38-48-r1','jr79');
 /* FIX49: botones en su lugar, al final. */
 addCss('./assets/jr-v38-fix49-category-buttons.css?v=38-49-r1','jr80'); addJs('./assets/jr-v38-fix49-category-buttons.js?v=38-49-r1','jr80');
}
async function check(manual=false){
 if(busy||(!manual&&Date.now()-last<INTERVAL))return;
 busy=true;last=Date.now();const status=document.getElementById('jr57Status');
 try{
   const response=await fetch('./build-v38.json?t='+Date.now(),{cache:'no-store',credentials:'omit'});
   if(!response.ok)throw Error();const meta=await response.json();if(!/^\d+-\d+$/.test(meta.build))throw Error();
   if(meta.build!==BUILD){
     const marker=BUILD+'>'+meta.build;let tried=false;
     try{tried=sessionStorage.getItem('jr57-refresh-attempt')===marker;sessionStorage.setItem('jr57-refresh-attempt',marker)}catch(_){}
     if(tried){if(status)status.textContent='La publicacion se esta propagando. Intenta actualizar en unos minutos.';return}
     const u=new URL(location.href);u.searchParams.set('refresh',meta.build);u.searchParams.set('n',Date.now());location.replace(u.href);
   }else if(manual&&status)status.textContent='Version '+BUILD+' actualizada.';
 }catch(_){if(manual&&status)status.textContent='No se pudo comprobar la version. Revisa tu conexion.'}finally{busy=false}
}
window.JRMobileRefresh={check,build:BUILD};injectFixes();check();
addEventListener('focus',()=>check());document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
