
(function(){
'use strict';
if(window.__JR45Fix13)return;
window.__JR45Fix13=true;

const BUILD='38-13';
const TILE_COLS=6,TILE_ROWS=4,TILE_W=240,TILE_H=136,TILE_COUNT=24;
const ATLAS='./assets/motion/v38-fix13-motion-atlas.mp4';
const PAGE_BG='./assets/motion/v38-fix13-page-bg.mp4';
const FINAL_BG='./assets/motion/v38-fix13-final-bg.mp4';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const mobile=(innerWidth<780)||(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const FPS=mobile?8:12;
const visible=new Set();
let atlas=null,observer=null,last=0,raf=0,serial=0;

function refreshBuild(){
 try{
  const old=localStorage.getItem('jr45-build');
  localStorage.setItem('jr45-build',BUILD);
  if(old!==BUILD&&'caches'in window){
   caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  }
  if(navigator.serviceWorker){
   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
  }
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function disableFix12Motion(){
 const host=q('#jr44VideoSources');
 if(host){
  qa('video',host).forEach(v=>{try{v.pause();v.removeAttribute('src');v.load()}catch(_){}});
  host.remove();
 }
 q('#jr44AmbientCanvas')?.remove();
 q('#jr44AmbientShade')?.remove();
 qa('.jr44-motion-canvas,.jr44-motion-shade,.jr44-stage-motion,.jr44-stage-shade').forEach(x=>x.remove());
}

function setupSources(){
 if(reduced.matches||saveData)return;
 const host=document.createElement('div');host.id='jr45AtlasHost';
 atlas=document.createElement('video');atlas.id='jr45Atlas';
 atlas.src=ATLAS;atlas.muted=true;atlas.loop=true;atlas.playsInline=true;atlas.preload='metadata';
 atlas.setAttribute('muted','');atlas.setAttribute('playsinline','');
 host.appendChild(atlas);document.body.appendChild(host);

 const bg=document.createElement('video');bg.id='jr45PageBg';
 bg.src=PAGE_BG;bg.muted=true;bg.loop=true;bg.playsInline=true;bg.preload='metadata';
 bg.setAttribute('muted','');bg.setAttribute('playsinline','');
 const shade=document.createElement('div');shade.id='jr45PageShade';
 document.body.prepend(shade);document.body.prepend(bg);

 [atlas,bg].forEach(v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{})});

 observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
   if(e.isIntersecting&&e.intersectionRatio>.01)visible.add(e.target);
   else visible.delete(e.target);
  });
 },{threshold:[0,.01,.12],rootMargin:'100px 0px'});
 raf=requestAnimationFrame(render);
}

function sizeCanvas(c,el){
 const r=el.getBoundingClientRect();
 const cap=mobile?280:520;
 const s=Math.min(1,cap/Math.max(1,r.width));
 const w=Math.max(120,Math.round(r.width*s));
 const h=Math.max(70,Math.round(r.height*s));
 if(c.width!==w||c.height!==h){c.width=w;c.height=h}
}

function tileRect(tile,targetRatio,phase,t){
 const col=tile%TILE_COLS,row=Math.floor(tile/TILE_COLS);
 const baseX=col*TILE_W,baseY=row*TILE_H;
 const tileRatio=TILE_W/TILE_H;
 let sw=TILE_W,sh=TILE_H,sx=baseX,sy=baseY;
 if(targetRatio>tileRatio){
  sh=TILE_W/targetRatio;
  const room=TILE_H-sh;
  sy=baseY+room*(.5+.28*Math.sin(t/2600+phase));
 }else{
  sw=TILE_H*targetRatio;
  const room=TILE_W-sw;
  sx=baseX+room*(.5+.30*Math.cos(t/2900+phase));
 }
 return [sx,sy,sw,sh];
}

function drawMotion(el,t){
 const c=q(':scope > .jr45-motion-canvas',el);
 if(!c||!atlas||atlas.readyState<2)return;
 sizeCanvas(c,el);
 const ctx=c.getContext('2d',{alpha:false});
 const w=c.width,h=c.height,ratio=w/h;
 const a=+el.dataset.jr45a,b=+el.dataset.jr45b,variant=+el.dataset.jr45variant;
 const ra=tileRect(a,ratio,variant*.73,t);
 const rb=tileRect(b,ratio,variant*1.11,t+900);

 ctx.save();
 ctx.clearRect(0,0,w,h);
 ctx.filter=`brightness(${.88+(variant%5)*.025}) saturate(${.88+(variant%7)*.035}) hue-rotate(${((variant*7)%25)-12}deg)`;
 if(variant%2){ctx.translate(w,0);ctx.scale(-1,1)}
 try{ctx.drawImage(atlas,...ra,0,0,w,h)}catch(_){}
 ctx.restore();

 ctx.save();
 ctx.globalAlpha=.10+(variant%5)*.025;
 ctx.globalCompositeOperation=(variant%3===0)?'screen':'soft-light';
 try{ctx.drawImage(atlas,...rb,-w*.025,-h*.025,w*1.05,h*1.05)}catch(_){}
 ctx.restore();
}

function render(t){
 raf=requestAnimationFrame(render);
 if(document.hidden||reduced.matches||saveData||!atlas)return;
 if(t-last<1000/FPS)return;last=t;
 visible.forEach(el=>{
  if(!document.body.contains(el)){visible.delete(el);return}
  drawMotion(el,t);
 });
}

function shouldDecorate(el){
 if(!el||el.dataset.jr45Motion)return false;
 if(el.closest('#jr44Register')||el.closest('#jr45AtlasHost'))return false;
 if(el.matches('button,a,input,select,textarea,nav,header,footer,table,thead,tbody,tr,td,th'))return false;
 const r=el.getBoundingClientRect();
 if(r.width<150||r.height<62)return false;
 return true;
}

function addMotion(el,kind='card'){
 if(!shouldDecorate(el))return;
 const n=serial++;
 el.dataset.jr45Motion='1';
 el.dataset.jr45variant=String(n);
 el.dataset.jr45a=String(n%TILE_COUNT);
 el.dataset.jr45b=String((n*7+5)%TILE_COUNT);
 el.classList.add('jr45-motion-card');
 if(kind==='banner')el.classList.add('jr45-banner-motion');
 const c=document.createElement('canvas');c.className='jr45-motion-canvas';
 const s=document.createElement('span');s.className='jr45-motion-shade';
 el.insertBefore(s,el.firstChild);el.insertBefore(c,el.firstChild);
 if(observer)observer.observe(el);
}

function decorateTables(){
 qa('table').forEach(table=>{
  const wrap=table.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||table.parentElement;
  if(!wrap)return;
  wrap.classList.add('jr45-table-motion');
  addMotion(wrap,'card');
 });
}

function decorateHero(){
 const stage=q('#v14CinematicHero .v14-stage');
 if(stage&&!stage.dataset.jr45Motion)addMotion(stage,'banner');
}

function decorateFinal(){
 const candidates=qa('video').filter(v=>!v.id.startsWith('jr45')&&!v.closest('#jr45AtlasHost'));
 for(const v of candidates){
  const box=v.closest('section,.section,.card,article,[class*="card"]')||v.parentElement?.parentElement;
  if(!box||box.dataset.jr45Final)continue;
  const text=(box.textContent||'').toUpperCase();
  if(!text.includes('GRAN FINAL')&&!text.includes('VIDEO COMPLETO'))continue;
  box.dataset.jr45Final='1';box.classList.add('jr45-final-motion');

  const bg=document.createElement('video');bg.className='jr45-final-bg';
  bg.src=FINAL_BG;bg.muted=true;bg.loop=true;bg.playsInline=true;bg.preload='metadata';
  bg.setAttribute('muted','');bg.setAttribute('playsinline','');
  const shade=document.createElement('span');shade.className='jr45-final-shade';
  box.insertBefore(shade,box.firstChild);box.insertBefore(bg,box.firstChild);

  const io=new IntersectionObserver(es=>es.forEach(e=>{
   if(e.isIntersecting&&!document.hidden&&!reduced.matches&&!saveData){
    const p=bg.play();if(p&&p.catch)p.catch(()=>{});
   }else bg.pause();
  }),{threshold:.03,rootMargin:'100px'});
  io.observe(box);
 }
}

function decorateAll(){
 const selectors=[
  '.card','.section','.table-wrap','.matchday-bar','.match-card','.match-row',
  '.fixture-card','.fixture','.team-card','.stat-card','.tool-card','.access-card',
  '.feature-card','.sponsor-card','.news-card','.jr-card','.panel','.glass-card',
  '.credential-card','.leader-card','.metric-card','.hero-card','.schedule-card',
  '.category-card','[class*="card"]:not(button):not(a)',
  '[class*="panel"]:not(button):not(a)','article'
 ].join(',');
 qa(selectors).forEach(el=>{
  if(el.closest('#jr44Register'))return;
  const r=el.getBoundingClientRect();
  addMotion(el,(r.height>250||r.width>650)?'banner':'card');
 });
 decorateTables();decorateHero();decorateFinal();
}

function modernButtons(){
 qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn').forEach(b=>{
  if(b.dataset.jr45Btn)return;b.dataset.jr45Btn='1';
  b.addEventListener('pointermove',e=>{
   const r=b.getBoundingClientRect();
   b.style.setProperty('--jr45-x',(e.clientX-r.left)+'px');
   b.style.setProperty('--jr45-y',(e.clientY-r.top)+'px');
  });
 });
}

function hookViews(){
 if(typeof window.showView==='function'&&!window.showView.__jr45){
  const old=window.showView;
  const wrapped=function(){
   const r=old.apply(this,arguments);
   setTimeout(()=>{decorateAll();modernButtons()},70);
   return r;
  };
  wrapped.__jr45=true;window.showView=wrapped;
 }
 document.addEventListener('click',()=>setTimeout(()=>{
  decorateAll();modernButtons();decorateFinal();
 },100),{passive:true});
}

function visibility(){
 document.addEventListener('visibilitychange',()=>{
  const bg=q('#jr45PageBg');
  if(document.hidden){
   atlas?.pause();bg?.pause();qa('.jr45-final-bg').forEach(v=>v.pause());
  }else if(!reduced.matches&&!saveData){
   [atlas,bg].forEach(v=>{if(v){const p=v.play();if(p&&p.catch)p.catch(()=>{})}});
  }
 });
}

function init(){
 document.body.classList.add('jr45-fix13');
 refreshBuild();
 disableFix12Motion();
 setupSources();
 decorateAll();
 modernButtons();
 hookViews();
 visibility();
 setTimeout(()=>{disableFix12Motion();decorateAll();modernButtons();decorateFinal()},1200);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
