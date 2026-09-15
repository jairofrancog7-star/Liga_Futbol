/* V38.67 — regeneración estable: logos correctos, tabla táctil y hero en movimiento. */
(()=>{'use strict';
if(window.__JR67_REGENERATE)return;window.__JR67_REGENERATE=true;
const BUILD='38-67-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const LOGOS={
 'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp',
 'pozos fc':'./assets/teams/pozos-fc.webp','juventus':'./assets/teams/juventus.webp','cuenda':'./assets/teams/tc-cuenda.webp',
 'boavista':'./assets/teams/boavista-fc.webp','psv':'./assets/teams/psv.webp','a santiago':'./assets/teams/atletico-santiago.webp',
 'f tavera':'./assets/teams/franco-tavera-jr-veteranos.webp','america':'./assets/branding/america-veteranos-35-user.png',
 'hermanos':'./assets/teams/club-deportivo-hermanos.webp','san jose fc':'./assets/teams/san-jose.webp','linces':'./assets/teams/linces.webp',
 'lobos cdg':'./assets/teams/lobos-cdg.webp','terricolas':'./assets/teams/terricolas-fc.webp','galacticos':'./assets/teams/galacticos-pozos.webp',
 'franco fc':'./assets/teams/franco-fc.webp','herreras fc':'./assets/teams/herrera-fc.webp',
 'napoli':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv','abejas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Abejas_lxn6l9',
 'la canchita deportes':'./assets/teams/la-canchita.webp','galeana':'./assets/teams/atletico-galeana.webp','aldama fc':'./assets/teams/aldama.webp',
 'malvinas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9','capibaras':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl',
 'la cuadrilla':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CuadrillaFC_vpfbtr','mazacotes fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Mazacotes_ko8o0w',
 'dep maravillas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx','osasuna':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa',
 'san antonio jrs':'./assets/teams/san-antonio-jr.webp','populares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt',
 'promesas':'./assets/teams/promesas-fc-pozos.webp','promesas fc':'./assets/teams/promesas-fc-pozos.webp','la huerta':'./assets/teams/la-huerta-cuenda.webp',
 'tavera fc':'./assets/teams/tavera-fc.webp','san jose jrs':'./assets/teams/san-jose-jr.webp','san julian':'./assets/teams/san-julian-fc.webp',
 'dep nopalero':'./assets/teams/deportivo-nopalero.webp','la esperanza':'./assets/teams/la-esperanza-fc.webp','manchester':'./assets/teams/manchester-united.webp',
 'toros de cuenda':'./assets/teams/tc-cuenda.webp','dynamo':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dinamo_rgamvy'
};
function logoFor(name){return LOGOS[norm(name)]||''}
function makeImg(name,cls='jr64-crest'){
 const src=logoFor(name);if(!src)return null;
 const img=document.createElement('img');img.className=cls;img.alt='Escudo '+name;img.loading='lazy';img.decoding='async';img.src=src+(src.startsWith('.')?('?v='+BUILD):'');
 return img;
}
function fixMatchLogos(){
 $$('#view-matches .jr65-match .jr65-team').forEach(team=>{
   const name=$('strong',team)?.textContent?.trim();if(!name)return;const src=logoFor(name);if(!src)return;
   const old=$('img',team),fallback=$('.jr65-fallback',team);
   if(old){const wanted=src+(src.startsWith('.')?('?v='+BUILD):'');if((old.getAttribute('src')||'')!==wanted)old.src=wanted;old.alt='Escudo '+name;}
   else{const img=makeImg(name,'jr67-match-crest');if(img){fallback?.remove();team.prepend(img)}}
 });
}
function fixPodium(){
 $$('#view-table .jr64-podium-card').forEach(card=>{
   const name=$('.jr64-teamcopy b',card)?.textContent?.trim();if(!name)return;
   $$('img,.jr64-crest,.v32-team-logo,.jr66-performance-crest',card).forEach(n=>n.remove());
   const img=makeImg(name,'jr64-crest jr67-podium-crest');
   const rank=$('.jr64-rank',card);if(img&&rank)rank.insertAdjacentElement('afterend',img);
 });
}
function fixPerformance(){
 $$('#view-stats .jr64-performance article').forEach(card=>{
   const name=$('.jr64-performance-copy b',card)?.textContent?.trim();if(!name)return;
   $$('.jr66-performance-crest,.jr67-performance-crest',card).forEach(n=>n.remove());
   const img=makeImg(name,'jr64-crest');if(!img)return;
   const wrap=document.createElement('span');wrap.className='jr67-performance-crest';wrap.append(img);
   const copy=$('.jr64-performance-copy',card);if(copy)card.insertBefore(wrap,copy);
 });
}
function installHeroMotion(){
 const hero=$('#view-table .jr64-hero.table');if(!hero||$('.jr67-hero-video',hero))return;
 const v=document.createElement('video');v.className='jr67-hero-video';v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.preload='metadata';v.poster='./assets/motion/v38-fix10-field.jpg';v.setAttribute('aria-hidden','true');
 const s=document.createElement('source');s.src='./assets/motion/v38-fix12-motion-field-lite.mp4?v='+BUILD;s.type='video/mp4';v.append(s);v.addEventListener('error',()=>v.remove(),{once:true});hero.prepend(v);
 const glow=document.createElement('span');glow.className='jr67-moving-ball';glow.setAttribute('aria-hidden','true');hero.append(glow);
 const play=()=>v.play().catch(()=>{});if(document.visibilityState==='visible')play();document.addEventListener('visibilitychange',()=>document.visibilityState==='visible'?play():v.pause());
}
function installScroller(){
 $$('#view-table .jr64-table-wrap').forEach(w=>{
   if(w.dataset.jr67Swipe==='1')return;w.dataset.jr67Swipe='1';
   const tools=document.createElement('div');tools.className='jr67-swipe-tools';tools.innerHTML='<button type="button" data-dir="-1" aria-label="Mover tabla a la izquierda">‹</button><span>Desliza ↔ para ver JJ, G, E, P, GF, GC, DG, Forma y PTS</span><button type="button" data-dir="1" aria-label="Mover tabla a la derecha">›</button>';
   w.parentNode.insertBefore(tools,w);
   $$('button',tools).forEach(b=>b.addEventListener('click',()=>w.scrollBy({left:Number(b.dataset.dir)*Math.max(260,w.clientWidth*.72),behavior:'smooth'})));
   let sx=0,sl=0,drag=false,moved=false;
   w.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;sx=e.clientX;sl=w.scrollLeft;drag=true;moved=false;w.classList.add('jr67-dragging');try{w.setPointerCapture(e.pointerId)}catch(_){}});
   w.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;if(moved){w.scrollLeft=sl-dx;e.preventDefault()}});
   const end=e=>{if(!drag)return;drag=false;w.classList.remove('jr67-dragging');try{w.releasePointerCapture(e.pointerId)}catch(_){}};
   w.addEventListener('pointerup',end);w.addEventListener('pointercancel',end);
   w.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&e.shiftKey){w.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
 });
}
function polish(){fixMatchLogos();fixPodium();fixPerformance();installHeroMotion();installScroller()}
let q=0;function queue(){clearTimeout(q);q=setTimeout(polish,70)}
function start(){polish();[250,700,1400,3000,6000].forEach(t=>setTimeout(polish,t));new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',()=>setTimeout(polish,80));addEventListener('pageshow',()=>setTimeout(polish,80))}
window.JRRestore67={build:BUILD,refresh:polish,logoFor};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
