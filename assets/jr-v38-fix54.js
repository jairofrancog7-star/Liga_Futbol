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

/* V38.64 loader — restauración exacta de Tabla y Estadísticas; Partidos permanece intacto. */
(()=>{'use strict';
if(window.__JR64_LOADER)return;window.__JR64_LOADER=true;
const VERSION='38-64-r1';
function ensure(){
 if(!document.querySelector('link[data-jr64-exact]')){
   const l=document.createElement('link');l.rel='stylesheet';l.href='./assets/jr-v38-restore64-exact.css?v='+VERSION;l.dataset.jr64Exact='1';document.head.append(l);
 }
 if(!document.querySelector('script[data-jr64-exact]')){
   const s=document.createElement('script');s.src='./assets/jr-v38-restore64-exact.js?v='+VERSION;s.defer=true;s.dataset.jr64Exact='1';document.body.append(s);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
})();
