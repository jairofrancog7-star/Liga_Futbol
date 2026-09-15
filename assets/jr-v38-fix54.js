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
