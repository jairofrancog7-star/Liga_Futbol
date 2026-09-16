(()=>{'use strict';
if(window.__JR77_MOBILE)return;window.__JR77_MOBILE=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const COUNTS={'Primera Fuerza':'11 equipos','Intermedia':'13 equipos','Segunda Fuerza':'12 equipos','Veteranos 35+':'10 equipos','Veteranos 50+':'6 equipos'};
function repairCategories(){
 const host=$('#jr53TopCategoryHost');if(!host)return;
 host.classList.remove('jr75-hidden-source');host.classList.add('jr77-category-host');
 const rail=$('.jr53-static-category-row',host)||$('.jr81-cat-row',host)||host.firstElementChild;if(rail)rail.classList.add('jr77-category-rail');
 $$('#jr53TopCategoryHost button[data-category]').forEach(btn=>{
  const cat=btn.dataset.category||btn.dataset.jr81Category||$('.jr81-cat-title',btn)?.textContent?.trim()||'Categoría';
  const img=$('img',btn);const src=img?.getAttribute('src')||btn.dataset.jr77Logo||'';if(src)btn.dataset.jr77Logo=src;
  const label=COUNTS[cat]||'Ver categoría';const wanted=norm(cat+' '+label);
  if(btn.dataset.jr77Sig!==wanted||!$('.jr77-cat-copy',btn)){
   btn.innerHTML=`<span class="jr77-cat-logo">${src?`<img src="${esc(src)}" alt="${esc(cat)}">`:'<span aria-hidden="true">⚽</span>'}</span><span class="jr77-cat-copy"><strong>${esc(cat)}</strong><small>${esc(label)}</small></span>`;
   btn.dataset.jr77Sig=wanted;
  }
 });
 const duplicate=$('#jr75CategoryStrip');if(duplicate)duplicate.setAttribute('hidden','');
}
function makeScrollable(root){
 if(!root)return;
 root.querySelectorAll('.table-wrap, .standings-wrap, .stats-table-wrap, [class*="table-wrap"]').forEach(w=>w.classList.add('jr77-scrollbox'));
 root.querySelectorAll('table').forEach(t=>{t.classList.add('jr77-wide-table');const p=t.parentElement;if(p)p.classList.add('jr77-scrollbox')});
 const cards=$$('.match-card,.match-row,.fixture-card,.fixture,.schedule-card',root);
 const parents=new Set();cards.forEach(c=>{c.classList.add('jr77-match-wide');if(c.parentElement)parents.add(c.parentElement)});parents.forEach(p=>p.classList.add('jr77-match-rail'));
}
function ensureSwipeHint(viewId,text){
 const view=$('#'+viewId);if(!view||$('#jr77Hint-'+viewId))return;
 const hint=document.createElement('div');hint.id='jr77Hint-'+viewId;hint.className='jr77-swipe-hint';hint.innerHTML=`<span aria-hidden="true">↔</span><b>${esc(text)}</b><button type="button">Ir a la derecha</button>`;
 const title=$('.section-title',view);(title||view.firstElementChild)?.insertAdjacentElement('afterend',hint);
 $('button',hint).onclick=()=>{
  const scroller=$$('.jr77-scrollbox,.jr77-match-rail',view).find(el=>el.scrollWidth>el.clientWidth+8);
  if(scroller)scroller.scrollTo({left:scroller.scrollWidth,behavior:'smooth'});
 };
}
function ensureQuickTools(){
 const view=$('#view-matches');if(!view||$('#jr77QuickTools'))return;
 const bar=document.createElement('div');bar.id='jr77QuickTools';bar.className='jr77-quick-tools';
 bar.innerHTML='<button type="button" data-act="left">← Inicio</button><button type="button" data-act="right">Final →</button><button type="button" data-act="compact">Vista compacta</button>';
 const hint=$('#jr77Hint-view-matches');(hint||$('.section-title',view)||view.firstElementChild)?.insertAdjacentElement('afterend',bar);
 bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const rail=$$('.jr77-scrollbox,.jr77-match-rail',view).find(el=>el.scrollWidth>el.clientWidth+8);if(b.dataset.act==='left'&&rail)rail.scrollTo({left:0,behavior:'smooth'});if(b.dataset.act==='right'&&rail)rail.scrollTo({left:rail.scrollWidth,behavior:'smooth'});if(b.dataset.act==='compact'){view.classList.toggle('jr77-compact');b.textContent=view.classList.contains('jr77-compact')?'Vista completa':'Vista compacta';}}
 );
}
function sync(){repairCategories();makeScrollable($('#view-matches'));makeScrollable($('#view-table'));ensureSwipeHint('view-matches','Desliza horizontalmente para ver cada partido completo');ensureSwipeHint('view-table','Desliza horizontalmente para ver todas las columnas');ensureQuickTools();}
let t=0;function queue(){clearTimeout(t);t=setTimeout(sync,80)}
function start(){sync();[180,500,1200,2600].forEach(ms=>setTimeout(sync,ms));addEventListener('hashchange',queue);addEventListener('pageshow',queue);document.addEventListener('click',queue,true);new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
