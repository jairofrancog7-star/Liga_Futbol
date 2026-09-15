/* V38 FIX38 — logo América EXACTO de la imagen del usuario + categorías compactas como antes */
(()=>{'use strict';
if(window.__JR70Fix38)return;window.__JR70Fix38=true;
const BUILD='38-38';
const AMERICA='https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/6d030b5d-8fc1-4520-83eb-0b523228ff65.png';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
function setAmericaImage(im){if(!im)return;im.dataset.jr70America='1';im.onerror=null;im.src=AMERICA;im.removeAttribute('srcset');im.loading='eager';im.decoding='async';im.alt='Club América Veteranos 35+ Juventino Rosas 1916-2026'}
function isAmerica(card){const text=norm([card?.dataset?.team,card?.dataset?.jr64Team,card?.getAttribute?.('aria-label'),card?.textContent].filter(Boolean).join(' '));return /(^| )AMERICA( |$)/.test(text)&&(/VETERANOS 35/.test(text)||/FINAL/.test(text))}
function patchAmerica(){
 const set=new Set();
 ['#teamsGrid > *','.team-card','[data-team-card]','[data-v27-team-card]','.jr60-team-card','.club-card','.jr63-team-card','.jr64-team-card','.jr65-team-card','.jr63-fixed-team-card'].forEach(s=>$$(s).forEach(x=>set.add(x)));
 [...set].filter(isAmerica).forEach(card=>{
   card.dataset.jr70America='1';card.classList.add('jr70-america-card');
   let hero=$('.jr65-america-hero,.jr69-america-hero,.jr70-america-hero',card);
   if(!hero){hero=document.createElement('div');hero.className='jr65-america-hero jr70-america-hero';const im=document.createElement('img');hero.appendChild(im);card.insertBefore(hero,card.firstChild)}
   hero.classList.add('jr70-america-hero');setAmericaImage($('img',hero));
   let mini=$('.jr65-america-mini,.jr70-america-mini',card);
   if(!mini){mini=document.createElement('span');mini.className='jr65-america-mini jr70-america-mini';mini.innerHTML='<img alt="">';hero.insertAdjacentElement('afterend',mini)}
   mini.classList.add('jr70-america-mini');setAmericaImage($('img',mini));
   $$('img',card).forEach(im=>{if(im.closest('.category-badge,.jr66-cat-badge,.jr68-cat-badge'))return;if(im.closest('.jr70-america-hero,.jr70-america-mini'))return;const sig=norm([im.alt,im.title,im.getAttribute('src')].filter(Boolean).join(' '));if(sig.includes('AMERICA')||String(im.src).includes('america-veteranos-35'))setAmericaImage(im)});
   $$('.jr63-team-hero-logo,.jr63-mini-logo,.jr62-team-hero-logo,.jr62-secondary-team-logo-wrap',card).forEach(x=>{if(!x.closest('.jr70-america-hero,.jr70-america-mini'))x.classList.add('jr70-hide-old-america')});
 });
}
function nearestCategoryRoot(card){let p=card.parentElement,depth=0;while(p&&p!==document.body&&depth<6){if(p.querySelectorAll('.jr66-category-summary').length>=3)return p;p=p.parentElement;depth++}return null}
function patchCategoryButtons(){
 const cards=$$('.jr66-category-summary');
 // FIX37 anterior ponía grid en cada padre individual; eso hacía un botón enorme por fila.
 $$('.jr69-category-grid').forEach(p=>p.classList.remove('jr69-category-grid'));
 $$('.jr69-category-card').forEach(c=>c.classList.remove('jr69-category-card'));
 $$('.jr70-category-row,.jr70-category-slot').forEach(x=>x.classList.remove('jr70-category-row','jr70-category-slot'));
 const roots=new Set();
 cards.forEach(card=>{card.classList.add('jr70-category-card');const root=nearestCategoryRoot(card);if(root)roots.add(root)});
 roots.forEach(root=>{
   root.classList.add('jr70-category-row');
   $$('.jr66-category-summary',root).forEach(card=>{if(card.parentElement!==root)card.parentElement?.classList.add('jr70-category-slot')});
 });
}
function patchMoreButtons(){const view=$('#view-more');if(!view)return;const grid=$('.more-grid',view);if(grid)grid.classList.add('jr70-more-grid');$$('.more-link',view).forEach(x=>x.classList.add('jr70-more-button'))}
function patchFunctionalPills(){const map={'TABLA':'table','GOLEADORES':'stats','RENDIMIENTO':'stats'};$$('button,.chip,[role="button"]').forEach(el=>{const t=norm(el.textContent);if(!map[t])return;el.classList.add('jr70-functional-pill');if(el.dataset.jr70Wired)return;el.dataset.jr70Wired='1';el.tabIndex=0;el.addEventListener('click',e=>{const target=map[t];const b=$$(`[data-view="${target}"]`).find(x=>x.offsetParent!==null)||$(`[data-view="${target}"]`);if(b&&b!==el){e.preventDefault();b.click()}else location.hash=target})})}
function patchPublicationTile(){const view=$('#view-more'),grid=view&&$('.more-grid',view);if(!grid)return;const b=$('.jr68-publications-link',grid);if(b){b.classList.add('jr70-more-button');b.innerHTML='<span>📣</span><b>Publicaciones</b><small>Tablas · resultados · calendario</small>'}}
function patchAll(){patchAmerica();patchCategoryButtons();patchMoreButtons();patchFunctionalPills();patchPublicationTile();document.documentElement.dataset.jr70='ready'}
[0,60,160,360,760,1500,3000,5600,9000].forEach(ms=>setTimeout(patchAll,ms));
document.addEventListener('click',e=>{if(e.target.closest('[data-view],[data-category],button,a,.team-card'))[35,130,330,720].forEach(ms=>setTimeout(patchAll,ms))},true);
addEventListener('hashchange',()=>setTimeout(patchAll,100));addEventListener('pageshow',()=>setTimeout(patchAll,80));addEventListener('focus',()=>setTimeout(patchAll,120));
window.JRFix38={build:BUILD,refresh:patchAll,americaLogo:AMERICA};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchAll,{once:true});else patchAll();
})();