/* V38.69 — correcciones puntuales solicitadas: San Juan FC, escudos duplicados, podio duplicado y hero animado. */
(()=>{'use strict';
if(window.__JR69_FINAL)return;window.__JR69_FINAL=true;
const BUILD='38-69-r1';
const $=(s,r=document)=>r?.querySelector(s)||null, $$=(s,r=document)=>Array.from(r?.querySelectorAll(s)||[]);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const FALLBACK={
 'san juan fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJuanFC_jhprtf',
 'san julian':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJulianFC_wetv0z',
 'san jose jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseJR_dio2dt',
 'tavera fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TaveraFC_gpdbhg'
};
function logoFor(name){
 const k=norm(name);if(FALLBACK[k])return FALLBACK[k];
 try{const x=window.JRRestore67?.logoFor?.(name);if(x)return x}catch(_){}
 return '';
}
function img(name,src,cls){
 const im=document.createElement('img');im.className=cls;im.alt='Escudo '+name;im.loading='lazy';im.decoding='async';im.src=src+(src.startsWith('.')?('?v='+BUILD):'');return im;
}
function cleanPodium(){
 const restore=$('#jr64TableRestore');if(!restore)return;
 const hero=$('.jr64-hero.table',restore),head=$('.jr64-section-head',restore);
 if(hero&&restore.firstElementChild!==hero)restore.prepend(hero);
 const pods=$$('.jr64-podium',restore);
 let keep=pods[0]||null;
 if(head&&pods.length>1){keep=pods.find(p=>Boolean(head.compareDocumentPosition(p)&Node.DOCUMENT_POSITION_FOLLOWING))||pods[0]}
 pods.forEach(p=>{if(p!==keep)p.remove()});
 if(head&&keep&&head.nextElementSibling!==keep)head.insertAdjacentElement('afterend',keep);
 $$('#view-table > *').forEach(n=>{
   if(n===restore)return;
   const t=norm(n.textContent);
   if(t.includes('lider')&&t.includes('posicion 2')&&t.includes('posicion 3'))n.classList.add('jr69-hide-duplicate');
 });
}
function podiumLogos(){
 $$('#view-table .jr64-podium-card').forEach(card=>{
   const name=$('.jr64-teamcopy b',card)?.textContent?.trim();if(!name)return;
   let src=logoFor(name);
   const existing=$$('img',card).find(x=>x.currentSrc||x.src);
   if(!src&&existing)src=existing.currentSrc||existing.src;
   $$('img,.jr64-crest,.jr67-podium-crest',card).forEach(n=>{if(!n.classList?.contains('jr69-single-crest'))n.remove()});
   let one=$('.jr69-single-crest',card);
   if(!src){one?.remove();return}
   if(!one){one=img(name,src,'jr69-single-crest');const rank=$('.jr64-rank',card);rank?rank.insertAdjacentElement('afterend',one):card.prepend(one)}
   else if((one.getAttribute('src')||'').split('?')[0]!==src.split('?')[0])one.src=src;
 });
}
function tableSanJuan(){
 $$('#view-table .jr64-table tbody tr').forEach(row=>{
   const team=$('.jr64-team',row),name=$('b',team)?.textContent?.trim();if(norm(name)!=='san juan fc')return;
   const src=FALLBACK['san juan fc'];
   const current=$('img',team);
   if(current){current.src=src;current.alt='Escudo SAN JUAN FC';return}
   const im=img('SAN JUAN FC',src,'jr64-crest');team?.prepend(im);
 });
}
function performanceLogos(){
 $$('#view-stats .jr64-performance article').forEach(card=>{
   const copy=$('.jr64-performance-copy',card),name=$('b',copy)?.textContent?.trim();if(!name)return;
   const oldImgs=$$('img',card),existingSrc=oldImgs.find(x=>x.currentSrc||x.src)?.currentSrc||oldImgs.find(x=>x.src)?.src||'';
   const src=logoFor(name)||existingSrc;
   $$('.jr67-performance-crest,.jr66-performance-crest,.jr69-performance-crest',card).forEach(n=>n.remove());
   oldImgs.forEach(n=>n.remove());
   if(!src||!copy)return;
   const wrap=document.createElement('span');wrap.className='jr69-performance-crest';wrap.append(img(name,src,'jr69-performance-img'));
   card.insertBefore(wrap,copy);
 });
}
function heroMotion(){
 const hero=$('#view-table .jr64-hero.table');if(!hero)return;
 $$('video',hero).forEach(v=>{try{v.pause()}catch(_){}v.style.display='none'});
 if(!$('.jr69-hero-motion',hero)){const m=document.createElement('span');m.className='jr69-hero-motion';m.setAttribute('aria-hidden','true');hero.prepend(m)}
 if(!$('.jr69-hero-shade',hero)){const s=document.createElement('span');s.className='jr69-hero-shade';s.setAttribute('aria-hidden','true');hero.append(s)}
 if(!$('.jr69-edge-dots',hero)){const d=document.createElement('span');d.className='jr69-edge-dots';d.setAttribute('aria-hidden','true');d.innerHTML='<i></i><i></i><i></i><i></i><i></i>';hero.append(d)}
}
function polish(){cleanPodium();podiumLogos();tableSanJuan();performanceLogos();heroMotion()}
let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(polish,90)}
function start(){
 polish();[250,700,1500,3000,6000].forEach(ms=>setTimeout(polish,ms));
 const ob=new MutationObserver(muts=>{if(muts.some(m=>Array.from(m.addedNodes).some(n=>n.nodeType===1&&!n.matches?.('.jr69-single-crest,.jr69-performance-crest,.jr69-hero-motion,.jr69-hero-shade,.jr69-edge-dots'))))queue()});
 ob.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target.closest('#categoryBar [data-category],#jr53TopCategoryHost [data-category],.bottom-nav button,.bottom-nav a'))setTimeout(polish,120)},true);
 addEventListener('hashchange',()=>setTimeout(polish,120));addEventListener('pageshow',()=>setTimeout(polish,120));
}
window.JRRestore69={build:BUILD,refresh:polish};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
