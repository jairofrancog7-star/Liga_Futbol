(()=>{'use strict';
if(window.__JR78_MOBILE)return;window.__JR78_MOBILE=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const COUNTS={
 'primera fuerza':'11 equipos',
 'intermedia':'13 equipos',
 'segunda fuerza':'12 equipos',
 'veteranos 35+':'10 equipos',
 'veteranos 50+':'6 equipos'
};
let busy=false,timer=0,observer=null;
function labelFor(cat){return COUNTS[norm(cat)]||'Ver categoría'}
function repair(){
 if(busy)return;busy=true;
 try{
  const host=$('#jr53TopCategoryHost');if(!host)return;
  host.classList.remove('jr75-hidden-source');host.classList.add('jr78-category-host');
  const rail=$('.jr53-static-category-row',host)||$('.jr81-cat-row',host)||host.firstElementChild;
  if(rail)rail.classList.add('jr78-category-rail');
  const old=$('#jr75CategoryStrip');if(old)old.setAttribute('hidden','');
  const chips=$('#categoryBar');if(chips){chips.hidden=true;chips.setAttribute('aria-hidden','true')}
  $$('button[data-category]',host).forEach(btn=>{
    const legacyTitle=$('.jr81-cat-title',btn)?.textContent?.trim();
    const currentTitle=$('.jr78-cat-copy strong',btn)?.textContent?.trim()||$('.jr77-cat-copy strong',btn)?.textContent?.trim();
    const cat=btn.dataset.category||btn.dataset.jr81Category||legacyTitle||currentTitle||'Categoría';
    const oldImg=$('img',btn);let src=oldImg?.getAttribute('src')||btn.dataset.jr78Logo||btn.dataset.jr77Logo||'';
    if(src){btn.dataset.jr78Logo=src;btn.dataset.jr77Logo=src}
    const label=labelFor(cat),sig=norm(cat+'|'+label+'|'+src);
    const valid=$('.jr78-cat-logo',btn)&&$('.jr78-cat-copy',btn)&&btn.dataset.jr78Sig===sig;
    if(!valid){
      btn.innerHTML=`<span class="jr78-cat-logo">${src?`<img src="${esc(src)}" alt="${esc(cat)}">`:'<span aria-hidden="true">⚽</span>'}</span><span class="jr78-cat-copy"><strong>${esc(cat)}</strong><small>${esc(label)}</small></span>`;
      btn.dataset.jr78Sig=sig;
    }
    btn.setAttribute('aria-label',`${cat}, ${label}`);
  });
 }finally{busy=false}
}
function queue(delay=20){clearTimeout(timer);timer=setTimeout(repair,delay)}
function start(){
 repair();[60,180,450,900,1600,2800].forEach(ms=>setTimeout(repair,ms));
 addEventListener('pageshow',()=>queue(0));
 addEventListener('hashchange',()=>queue(0));
 document.addEventListener('click',()=>{queue(0);setTimeout(repair,80);setTimeout(repair,250)},true);
 observer=new MutationObserver(muts=>{
   if(busy)return;
   for(const m of muts){
     const target=m.target?.nodeType===1?m.target:m.target?.parentElement;
     if(target?.closest?.('#jr53TopCategoryHost')||[...m.addedNodes].some(n=>n.nodeType===1&&(n.id==='jr53TopCategoryHost'||n.querySelector?.('#jr53TopCategoryHost')))){queue(0);break}
   }
 });
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
