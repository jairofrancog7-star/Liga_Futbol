/* V38 FIX42 — detecta cada grupo local de categorías por separado.
   FIX39 intentaba encontrar un único ancestro para TODAS las copias de categorías de la página;
   con duplicados podía no marcar el rail y dejaba una tarjeta gigante con la siguiente cortada. */
(()=>{'use strict';
if(window.__JR74Fix42)return;window.__JR74Fix42=true;
const BUILD='38-42';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const CATS=['VETERANOS 35+','VETERANOS 50+','PRIMERA FUERZA','INTERMEDIA','SEGUNDA FUERZA'];
const CARD_SEL='.jr66-category-summary,.jr71-category-card,.jr69-category-compact,.jr64-category-summary-card';
function key(card){
 const n=norm([card?.dataset?.jr66Category,card?.dataset?.jr64Category,card?.dataset?.category,card?.textContent].filter(Boolean).join(' '));
 return CATS.find(k=>n.includes(k))||'';
}
function directCards(el){return el.matches?.(CARD_SEL)?[el]:$$(':scope > '+CARD_SEL,el)}
function patchParent(parent){
 if(!parent||parent===document.body||parent===document.documentElement)return false;
 const children=[...parent.children];
 const carriers=children.filter(ch=>directCards(ch).some(key));
 const names=new Set(carriers.flatMap(ch=>directCards(ch)).map(key).filter(Boolean));
 if(names.size<3||carriers.length<2)return false;
 parent.classList.add('jr74-category-rail');
 children.forEach(ch=>{
   const cards=directCards(ch).filter(c=>key(c));
   if(cards.length){ch.classList.add('jr74-category-slot');cards.forEach(c=>c.classList.add('jr74-category-card'))}
   else ch.classList.add('jr74-category-extra');
 });
 return true;
}
function patchCard(card){
 if(!key(card))return;
 card.classList.add('jr74-category-card');
 let p=card.parentElement;
 for(let depth=0;p&&p!==document.body&&depth<5;depth++,p=p.parentElement){
   if(patchParent(p))break;
 }
}
function patchAll(){
 $$(CARD_SEL).forEach(patchCard);
 /* Caso típico de FIX39: slots ya marcados pero el rail quedó sin clase. */
 $$('.jr71-category-slot,.jr69-category-slot,.jr74-category-slot').forEach(slot=>patchParent(slot.parentElement));
 document.documentElement.dataset.jr74Layout='ready';
}
function schedule(){[0,40,120,280,620,1200,2400,4800,8000].forEach(ms=>setTimeout(patchAll,ms))}
document.addEventListener('click',e=>{if(e.target.closest('[data-view],[data-category],button,a'))[30,120,320,700].forEach(ms=>setTimeout(patchAll,ms))},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('resize',()=>setTimeout(patchAll,80),{passive:true});
window.JRFix42={build:BUILD,refresh:patchAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
