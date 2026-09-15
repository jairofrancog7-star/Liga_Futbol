/* V38 FIX54 restored — category cards remain functional and all cedulas stay inside Liga Juventino Rosas */
(()=>{'use strict';
const host=document.getElementById('jr53TopCategoryHost');
host?.addEventListener('click',e=>{
 const b=e.target.closest('button[data-category]');if(!b)return;
 const chip=Array.from(document.querySelectorAll('#categoryBar [data-category]')).find(x=>x.dataset.category===b.dataset.category);
 if(chip)chip.click();
 host.querySelectorAll('button').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on))});
});
window.addEventListener('click',e=>{
 const a=e.target.closest?.('a[href*="cedula-arbitral/"]');if(!a)return;
 e.preventDefault();e.stopImmediatePropagation();
 const id=(a.getAttribute('href')||'').match(/cedula-arbitral\/(\d+)/)?.[1]||'';
 location.href='./cedulas.html'+(id?'?cedula='+encodeURIComponent(id):'');
},true);
const actions=document.querySelector('.top-actions');
if(actions&&!document.getElementById('jr54Cedulas')){const a=document.createElement('a');a.id='jr54Cedulas';a.href='./cedulas.html';a.className='ghost-btn';a.textContent='Cédulas';actions.append(a)}
})();

/* V38.67 loader — regeneración estable de Tabla, Estadísticas, Partidos y Cédulas. */
(()=>{'use strict';
if(window.__JR67_LOADER)return;window.__JR67_LOADER=true;
const V='38-67-r1';
function addCss(key,href){if(document.querySelector(`link[data-${key}]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(`data-${key}`,'1');document.head.append(l)}
function addJs(key,src){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(`data-${key}`,'1');document.body.append(s)}
function ensure(){
 addCss('jr64-exact','./assets/jr-v38-restore64-exact.css?v='+V);
 addJs('jr64-exact','./assets/jr-v38-restore64-exact.js?v='+V);
 addCss('jr65-partidos','./assets/jr-v38-restore65-partidos.css?v='+V);
 addJs('jr65-partidos','./assets/jr-v38-restore65-partidos.js?v='+V);
 addCss('jr66-polish','./assets/jr-v38-restore66-polish.css?v='+V);
 addJs('jr66-polish','./assets/jr-v38-restore66-polish.js?v='+V);
 addCss('jr67-regenerate','./assets/jr-v38-restore67-regenerate.css?v='+V);
 addJs('jr67-regenerate','./assets/jr-v38-restore67-regenerate.js?v='+V);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
})();
