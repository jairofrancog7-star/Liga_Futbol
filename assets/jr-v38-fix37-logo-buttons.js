/* V38 FIX37 — logo exacto América Veteranos 35+ + botones/categorías compactos */
(()=>{'use strict';
if(window.__JR69Fix37)return;window.__JR69Fix37=true;
const BUILD='38-37';
const AMERICA_EXACT='https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/6d030b5d-8fc1-4520-83eb-0b523228ff65.png';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
function isAmericaCard(card){
 const t=norm([card?.dataset?.team,card?.dataset?.jr64Team,card?.textContent].filter(Boolean).join(' '));
 return /(^| )AMERICA( |$)/.test(t)&&(/VETERANOS 35/.test(t)||/VETERANOS 35\+/.test(t)||card.closest('[data-category="Veteranos 35+"]'));
}
function patchAmerica(){
 const set=new Set();
 ['#teamsGrid > *','.team-card','.club-card','[data-team-card]','[data-v27-team-card]','.jr60-team-card','.jr63-fixed-team-card'].forEach(s=>$$(s).forEach(x=>set.add(x)));
 [...set].filter(isAmericaCard).forEach(card=>{
   card.classList.add('jr69-america-exact');
   let imgs=$$('img',card);
   let targeted=imgs.filter(img=>/america-veteranos-35|club america|américa|america/i.test([img.getAttribute('src'),img.alt,img.title].filter(Boolean).join(' ')));
   if(!targeted.length) targeted=imgs.filter(img=>img.closest('.jr65-america-hero,.jr65-america-mini,.jr63-team-hero-logo,.jr63-mini-logo,.jr62-team-hero-logo,.jr62-secondary-team-logo-wrap'));
   targeted.forEach(img=>{img.src=AMERICA_EXACT;img.removeAttribute('srcset');img.alt='Club América Veteranos 35+ Juventino Rosas 1916-2026';img.decoding='async';img.loading='eager';});
   let hero=$('.jr65-america-hero',card);
   if(!hero){hero=document.createElement('div');hero.className='jr65-america-hero jr69-america-hero';hero.innerHTML=`<img src="${AMERICA_EXACT}" alt="Club América Veteranos 35+ Juventino Rosas 1916-2026">`;card.insertBefore(hero,card.firstChild)}
   else{hero.classList.add('jr69-america-hero');const im=$('img',hero);if(im)im.src=AMERICA_EXACT}
   let mini=$('.jr65-america-mini',card);
   if(!mini){mini=document.createElement('span');mini.className='jr65-america-mini jr69-america-mini';mini.innerHTML=`<img src="${AMERICA_EXACT}" alt="">`;hero.insertAdjacentElement('afterend',mini)}
   else{mini.classList.add('jr69-america-mini');const im=$('img',mini);if(im)im.src=AMERICA_EXACT}
   $$('.jr63-team-hero-logo,.jr63-mini-logo,.jr62-team-hero-logo,.jr62-secondary-team-logo-wrap',card).forEach(x=>{if(!x.classList.contains('jr65-america-hero')&&!x.classList.contains('jr65-america-mini'))x.classList.add('jr69-hide-old-america')});
 });
}
function compactCategoryCards(){
 const cards=$$('.jr66-category-summary');
 cards.forEach(card=>{
   card.classList.add('jr69-category-compact');
   const slot=card.parentElement;
   if(slot&&slot!==document.body&&slot.querySelectorAll('.jr66-category-summary').length===1){slot.classList.add('jr69-category-slot')}
 });
 const ancestors=new Map();
 cards.forEach(card=>{let p=card.parentElement,depth=0;while(p&&p!==document.body&&depth<5){const count=p.querySelectorAll('.jr66-category-summary').length;if(count>=3){ancestors.set(p,count);break}p=p.parentElement;depth++}});
 ancestors.forEach((count,p)=>{if(count>=3)p.classList.add('jr69-category-strip')});
}
function patch(){patchAmerica();compactCategoryCards();document.documentElement.dataset.jr69Fix37='ready'}
[0,80,220,520,1100,2200,4200,7600].forEach(ms=>setTimeout(patch,ms));
document.addEventListener('click',e=>{if(e.target.closest('button,a,[data-category],[data-view],.team-card,.jr66-category-summary'))[40,160,420,900].forEach(ms=>setTimeout(patch,ms))},true);
addEventListener('hashchange',()=>setTimeout(patch,120));addEventListener('pageshow',()=>setTimeout(patch,100));addEventListener('focus',()=>setTimeout(patch,140));
window.JRFix37={build:BUILD,refresh:patch,americaLogo:AMERICA_EXACT};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
})();