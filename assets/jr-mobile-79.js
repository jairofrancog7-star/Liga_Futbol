(()=>{'use strict';
if(window.__JR79_CATEGORY_FIX)return;window.__JR79_CATEGORY_FIX=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FALLBACK={
 'Primera Fuerza':'./assets/branding/primera-fuerza-hd.png?v=38-79',
 'Intermedia':'./assets/categories/intermedia.webp?v=38-79',
 'Segunda Fuerza':'./assets/categories/segunda-fuerza.webp?v=38-79',
 'Veteranos 35+':'./assets/categories/veteranos-35.webp?v=38-79',
 'Veteranos 50+':'./assets/categories/veteranos-50.webp?v=38-79'
};
let busy=false,timer=0;
function normalize(){
 if(busy)return;busy=true;
 try{
  const host=$('#jr53TopCategoryHost');if(!host)return;
  host.classList.add('jr79-category-host');
  const rail=$('.jr53-static-category-row',host)||$('.jr81-cat-row',host)||host.firstElementChild;
  if(rail)rail.classList.add('jr79-category-rail');
  $$('#categoryBar,#jr75CategoryStrip,[id^="jr75CategoryStrip"]').forEach(x=>{x.hidden=true;x.setAttribute('aria-hidden','true')});
  $$('button[data-category]',host).forEach(btn=>{
   const cat=(btn.dataset.category||btn.dataset.jr81Category||$('.jr81-cat-title',btn)?.textContent||'Categoría').trim();
   const existing=$('img',btn)?.getAttribute('src')||'';
   const src=existing||FALLBACK[cat]||'';
   const sig='jr79:'+cat+':'+src;
   if(btn.dataset.jr79Sig===sig && $('.jr79-cat-title',btn))return;
   btn.dataset.jr79Sig=sig;
   btn.classList.add('jr79-cat-btn');
   btn.setAttribute('aria-label',cat);
   btn.innerHTML=`<span class="jr79-cat-logo">${src?`<img src="${esc(src)}" alt="${esc(cat)}">`:'<span aria-hidden="true">⚽</span>'}</span><span class="jr79-cat-title">${esc(cat)}</span>`;
  });
 }finally{busy=false}
}
function queue(){clearTimeout(timer);timer=setTimeout(normalize,40)}
function start(){
 normalize();
 [120,350,800,1500,3000,6000].forEach(ms=>setTimeout(normalize,ms));
 const host=$('#jr53TopCategoryHost');if(host)new MutationObserver(queue).observe(host,{childList:true,subtree:true});
 addEventListener('pageshow',queue);addEventListener('hashchange',queue);document.addEventListener('click',queue,true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
