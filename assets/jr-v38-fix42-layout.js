/* V38 FIX42 R2 — detector robusto de grupos de categorías. */
(()=>{'use strict';
if(window.__JR74Fix42)return;window.__JR74Fix42=true;
const BUILD='38-42';
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const CATS=['VETERANOS 35+','VETERANOS 50+','PRIMERA FUERZA','INTERMEDIA','SEGUNDA FUERZA'];
const CARD_SEL='.jr66-category-summary,.jr71-category-card,.jr69-category-compact,.jr64-category-summary-card';
function key(card){const n=norm([card?.dataset?.jr66Category,card?.dataset?.jr64Category,card?.dataset?.category,card?.textContent].filter(Boolean).join(' '));return CATS.find(k=>n.includes(k))||''}
function cardsInside(root){return $$(CARD_SEL,root).filter(c=>key(c))}
function uniqueCount(root){return new Set(cardsInside(root).map(key).filter(Boolean)).size}
function directCarrier(card,root){let n=card;while(n&&n.parentElement&&n.parentElement!==root)n=n.parentElement;return n&&n.parentElement===root?n:null}
function patchRoot(root){
 if(!root||root===document.body||root===document.documentElement)return false;
 const cards=cardsInside(root),names=new Set(cards.map(key).filter(Boolean));
 if(names.size<3)return false;
 const carriers=[...new Set(cards.map(c=>directCarrier(c,root)).filter(Boolean))];
 if(carriers.length<2)return false;
 root.classList.add('jr74-category-rail');
 [...root.children].forEach(ch=>{
   const has=carriers.includes(ch);
   ch.classList.toggle('jr74-category-slot',has);
   ch.classList.toggle('jr74-category-extra',!has);
 });
 cards.forEach(c=>c.classList.add('jr74-category-card'));
 return true;
}
function patchCard(card){
 if(!key(card))return;
 card.classList.add('jr74-category-card');
 let p=card.parentElement;
 for(let depth=0;p&&p!==document.body&&depth<9;depth++,p=p.parentElement){
   if(uniqueCount(p)>=3&&patchRoot(p))break;
 }
}
function patchLegacy(){
 ['.jr68-category-grid','.jr69-category-strip','.jr71-category-rail'].forEach(sel=>$$(sel).forEach(root=>{
   root.classList.add('jr74-category-rail');
   cardsInside(root).forEach(c=>c.classList.add('jr74-category-card'));
   [...root.children].forEach(ch=>{const has=!!ch.querySelector?.(CARD_SEL)||ch.matches?.(CARD_SEL);if(has)ch.classList.add('jr74-category-slot')});
 }));
}
function patchAll(){
 patchLegacy();
 $$(CARD_SEL).forEach(patchCard);
 $$('.jr71-category-slot,.jr69-category-slot,.jr74-category-slot').forEach(slot=>patchRoot(slot.parentElement));
 document.documentElement.dataset.jr74Layout='ready';
}
function schedule(){[0,30,80,180,360,700,1300,2400,4200,7000].forEach(ms=>setTimeout(patchAll,ms))}
document.addEventListener('click',e=>{if(e.target.closest('[data-view],[data-category],button,a'))[20,80,220,520,1000].forEach(ms=>setTimeout(patchAll,ms))},true);
addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);addEventListener('resize',()=>setTimeout(patchAll,60),{passive:true});addEventListener('focus',()=>setTimeout(patchAll,80));
window.JRFix42={build:BUILD,refresh:patchAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
