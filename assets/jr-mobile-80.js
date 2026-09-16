(()=>{'use strict';
if(window.__JR80_CATEGORY_FIX)return;window.__JR80_CATEGORY_FIX=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FALLBACK={
  'Primera Fuerza':'./assets/branding/primera-fuerza-hd.png?v=38-80-1',
  'Intermedia':'./assets/categories/intermedia.webp?v=38-80-1',
  'Segunda Fuerza':'./assets/categories/segunda-fuerza.webp?v=38-80-1',
  'Veteranos 35+':'./assets/categories/veteranos-35.webp?v=38-80-1',
  'Veteranos 50+':'./assets/categories/veteranos-50.webp?v=38-80-1'
};
let busy=false,timer=0;
function categoryName(btn){
  return (btn.dataset.category||btn.dataset.jr81Category||$('.jr81-cat-title',btn)?.textContent||$('.jr79-cat-title',btn)?.textContent||$('.jr80-cat-title',btn)?.textContent||'Categoría').trim();
}
function normalize(){
  if(busy)return;busy=true;
  try{
    const host=$('#jr53TopCategoryHost');if(!host)return;
    host.classList.add('jr80-category-host');
    const rail=$('.jr53-static-category-row',host)||$('.jr81-cat-row',host)||host.firstElementChild;
    if(rail)rail.classList.add('jr80-category-rail');
    $$('#categoryBar,#jr75CategoryStrip,[id^="jr75CategoryStrip"]').forEach(x=>{
      x.hidden=true;x.setAttribute('aria-hidden','true');
    });
    $$('button[data-category],button[data-jr81-category],.jr81-cat-btn',host).forEach(btn=>{
      const cat=categoryName(btn);
      const oldImg=$('img',btn);
      const existing=oldImg?.getAttribute('src')||'';
      const src=existing||FALLBACK[cat]||'';
      btn.classList.add('jr80-cat-btn');
      btn.dataset.category=btn.dataset.category||cat;
      btn.dataset.jr81Category=btn.dataset.jr81Category||cat;
      btn.setAttribute('aria-label',cat);
      const active=btn.classList.contains('active')||btn.classList.contains('is-active')||btn.getAttribute('aria-pressed')==='true';
      btn.setAttribute('aria-pressed',active?'true':'false');
      const sig=`jr80:${cat}:${src}`;
      if(btn.dataset.jr80Sig!==sig||!$('.jr80-cat-title',btn)){
        btn.dataset.jr80Sig=sig;
        btn.innerHTML=`<span class="jr80-cat-logo">${src?`<img src="${esc(src)}" alt="${esc(cat)}" loading="eager" decoding="async">`:'<span aria-hidden="true">⚽</span>'}</span><span class="jr80-cat-title">${esc(cat)}</span>`;
      }
    });
  }finally{busy=false}
}
function queue(){clearTimeout(timer);timer=setTimeout(normalize,25)}
function start(){
  normalize();
  [80,180,350,700,1200,2000,3500,6000].forEach(ms=>setTimeout(normalize,ms));
  const host=$('#jr53TopCategoryHost');
  if(host)new MutationObserver(queue).observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-pressed','data-category','data-jr81-category']});
  addEventListener('pageshow',queue);
  addEventListener('hashchange',queue);
  addEventListener('resize',queue,{passive:true});
  document.addEventListener('click',queue,true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
