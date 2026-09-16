/* V38.71 · mejoras táctiles aditivas para Partidos/Jornadas. */
(()=>{'use strict';
if(window.__JR71_MOBILE)return;window.__JR71_MOBILE=true;

const root=document.getElementById('view-matches');
if(!root)return;
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();

const categoryLogos={
 'primera fuerza':'./assets/branding/primera-fuerza-hd.png',
 'intermedia':'./assets/categories/intermedia.webp',
 'segunda fuerza':'./assets/categories/segunda-fuerza.webp',
 'veteranos 35+':'./assets/categories/veteranos-35-user.png',
 'veteranos 50+':'./assets/categories/veteranos-50.webp'
};

function decorateCategoryButtons(){
 document.querySelectorAll('#jr53TopCategoryHost [data-category],#categoryBar [data-category]').forEach(btn=>{
  if(btn.querySelector('.jr71-category-logo'))return;
  const raw=norm(btn.dataset.category||btn.textContent);
  const key=Object.keys(categoryLogos).find(k=>raw===k||raw.includes(k));
  if(!key)return;
  const img=document.createElement('img');
  img.className='jr71-category-logo';
  img.src=categoryLogos[key];
  img.alt='';
  img.loading='lazy';
  img.decoding='async';
  btn.prepend(img);
  btn.classList.add('jr71-category-with-logo');
 });
}

function makeTablesScrollable(){
 root.querySelectorAll('table').forEach(table=>{
  if(table.closest('.jr71-table-scroll,.jr64-table-wrap,.jr59-table-scroll,.v20-table-scroll,.v21-table-scroll,.table-scroll,.table-wrap'))return;
  const parent=table.parentElement;
  if(!parent)return;
  const wrap=document.createElement('div');
  wrap.className='jr71-table-scroll';
  wrap.tabIndex=0;
  wrap.setAttribute('role','region');
  wrap.setAttribute('aria-label','Tabla desplazable horizontalmente');
  parent.insertBefore(wrap,table);
  wrap.appendChild(table);
 });
}

function centerActiveRound(behavior){
 const row=root.querySelector('.jr65-rounds');
 const active=row?.querySelector('button.active');
 if(!row||!active)return;
 const max=Math.max(0,row.scrollWidth-row.clientWidth);
 const wanted=Math.max(0,Math.min(max,active.offsetLeft-(row.clientWidth-active.offsetWidth)/2));
 if(typeof row.scrollTo==='function')row.scrollTo({left:wanted,behavior:behavior|| (reduceMotion()?'auto':'smooth')});
 else row.scrollLeft=wanted;
}

let raf=0;
function scan(){
 cancelAnimationFrame(raf);
 raf=requestAnimationFrame(()=>{
  decorateCategoryButtons();
  makeTablesScrollable();
  if(root.querySelector('.jr65-rounds')?.dataset.jr71Centered!=='1'){
   const row=root.querySelector('.jr65-rounds');
   if(row){row.dataset.jr71Centered='1';centerActiveRound('auto')}
  }
 });
}

root.addEventListener('click',e=>{
 const round=e.target.closest?.('[data-jr65-round]');
 if(round)setTimeout(()=>centerActiveRound(),60);
},true);

document.addEventListener('click',e=>{
 if(e.target.closest?.('#jr53TopCategoryHost [data-category],#categoryBar [data-category]'))setTimeout(decorateCategoryButtons,40);
},true);

const observer=new MutationObserver(scan);
observer.observe(root,{childList:true,subtree:true});
const catHost=document.getElementById('jr53TopCategoryHost');
if(catHost)observer.observe(catHost,{childList:true,subtree:true});
const categoryBar=document.getElementById('categoryBar');
if(categoryBar)observer.observe(categoryBar,{childList:true,subtree:true});

scan();
window.addEventListener('pageshow',scan);
window.addEventListener('resize',()=>centerActiveRound('auto'),{passive:true});
})();
