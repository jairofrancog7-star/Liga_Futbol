/* FIX55 compatibility loader -> FIX56 */
(()=>{if(window.__JR55Compat56)return;window.__JR55Compat56=true;
const v='38-56-r1';
if(!document.querySelector('link[data-jr56]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./assets/jr-v38-fix56.css?v='+v;l.dataset.jr56='1';document.head.appendChild(l)}
if(!document.querySelector('script[data-jr56]')){const s=document.createElement('script');s.src='./assets/jr-v38-fix56.js?v='+v;s.defer=true;s.dataset.jr56='1';document.head.appendChild(s)}
})();