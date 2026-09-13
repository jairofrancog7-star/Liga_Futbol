
(function(){
'use strict';
if(window.__JR48Fix16)return;
window.__JR48Fix16=true;
window.__JR47DisableLegacyMotion=true;

const BUILD='38-16';
const ATLAS='./assets/motion/v38-fix14-atlas36.mp4';
const COLS=6,ROWS=6,TW=320,TH=180,TILES=36,PAIR_COUNT=TILES*(TILES-1);

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const coarse=window.matchMedia?matchMedia('(pointer:coarse)').matches:false;
const mobile=innerWidth<780||coarse;
const FPS=mobile?4:6;

let atlas=null;
let pageCanvas=null;
let observer=null;
let timer=0;
let serial=0;
let rescanTimer=0;

const visibleCards=new Set();
const visibleButtons=new Set();

const VIEW_VIDEO={
 table:'./assets/motion/v38-emirates-table.mp4',
 stats:'./assets/motion/v38-emirates-stats.mp4'
};

function refreshBuild(){
 try{
  const old=localStorage.getItem('jr48-build');
  localStorage.setItem('jr48-build',BUILD);
  if(old!==BUILD&&'caches'in window){
   caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  }
  if(navigator.serviceWorker){
   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
  }
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function removeOldVisuals(){
 [
  '#jr44VideoSources','#jr45AtlasHost','#jr46AtlasHost',
  '#jr47StableVideo','#jr47StableShade',
  '#jr44AmbientCanvas','#jr44AmbientShade',
  '#jr45PageBg','#jr45PageShade',
  '#jr46PageCanvas','#jr46PageShade'
 ].forEach(sel=>q(sel)?.remove());

 qa('.jr44-motion-canvas,.jr44-motion-shade,.jr44-stage-motion,.jr44-stage-shade,.jr45-motion-canvas,.jr45-motion-shade,.jr46-canvas,.jr46-shade')
   .forEach(n=>n.remove());
}

function createEngine(){
 if(reduced.matches||saveData){
  document.body.classList.add('jr48-save');
  return;
 }

 const host=document.createElement('div');
 host.id='jr48AtlasHost';

 atlas=document.createElement('video');
 atlas.id='jr48Atlas';
 atlas.src=ATLAS;
 atlas.muted=true;
 atlas.loop=true;
 atlas.playsInline=true;
 atlas.preload='auto';
 atlas.setAttribute('muted','');
 atlas.setAttribute('playsinline','');
 atlas.setAttribute('aria-hidden','true');

 host.appendChild(atlas);
 document.body.appendChild(host);

 pageCanvas=document.createElement('canvas');
 pageCanvas.id='jr48PageCanvas';
 const shade=document.createElement('div');
 shade.id='jr48PageShade';

 document.body.prepend(shade);
 document.body.prepend(pageCanvas);

 observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
   const el=e.target;
   const set=el.classList.contains('jr48-motion-button')?visibleButtons:visibleCards;
   if(e.isIntersecting&&e.intersectionRatio>.01){
    set.add(el);
   }else{
    set.delete(el);
   }
  });
 },{threshold:[0,.01,.12],rootMargin:'80px 0px'});

 const p=atlas.play();
 if(p&&p.catch)p.catch(()=>{});

 scheduleTick();
}

function scheduleTick(){
 clearTimeout(timer);
 timer=setTimeout(tick,Math.round(1000/FPS));
}

function tick(){
 try{
  if(!document.hidden&&!reduced.matches&&!saveData&&atlas&&atlas.readyState>=2){
   const now=performance.now();
   drawPage(now);
   visibleCards.forEach(el=>{
    if(el.isConnected&&isActuallyVisible(el))drawCard(el,now);
    else visibleCards.delete(el);
   });
   visibleButtons.forEach(el=>{
    if(el.isConnected&&isActuallyVisible(el))drawButton(el,now);
    else visibleButtons.delete(el);
   });
  }
 }finally{
  scheduleTick();
 }
}

function isActuallyVisible(el){
 const r=el.getBoundingClientRect();
 return r.width>0&&r.height>0&&r.bottom>-80&&r.top<innerHeight+80;
}

function uniquePair(n){
 const idx=n%PAIR_COUNT;
 const a=Math.floor(idx/(TILES-1));
 let b=idx%(TILES-1);
 if(b>=a)b++;
 return [a,b];
}

function tileRect(tile,ratio,phase,t){
 const col=tile%COLS,row=Math.floor(tile/COLS);
 const bx=col*TW,by=row*TH;
 const tileRatio=TW/TH;
 let sx=bx,sy=by,sw=TW,sh=TH;

 if(ratio>tileRatio){
  sh=TW/ratio;
  const room=TH-sh;
  sy=by+room*(.5+.20*Math.sin(t/3100+phase));
 }else{
  sw=TH*ratio;
  const room=TW-sw;
  sx=bx+room*(.5+.22*Math.cos(t/3400+phase));
 }
 return [sx,sy,sw,sh];
}

function ensureSize(canvas,el,kind){
 const r=el.getBoundingClientRect();
 const maxW=kind==='button'?(mobile?150:190):(mobile?280:380);
 const scale=Math.min(1,maxW/Math.max(1,r.width));
 const w=Math.max(kind==='button'?80:120,Math.round(r.width*scale));
 const h=Math.max(kind==='button'?28:68,Math.round(r.height*scale));
 if(canvas.width!==w||canvas.height!==h){
  canvas.width=w;
  canvas.height=h;
 }
}

function drawComposite(canvas,el,t,kind){
 if(!atlas||atlas.readyState<2)return;

 ensureSize(canvas,el,kind);
 const ctx=canvas.getContext('2d',{alpha:false});
 const w=canvas.width,h=canvas.height,ratio=w/h;
 const a=+el.dataset.jr48a;
 const b=+el.dataset.jr48b;
 const v=+el.dataset.jr48v;
 const ra=tileRect(a,ratio,v*.37,t);
 const rb=tileRect(b,ratio,v*.61,t+850);

 ctx.save();
 ctx.clearRect(0,0,w,h);
 if(v%2){
  ctx.translate(w,0);
  ctx.scale(-1,1);
 }
 try{ctx.drawImage(atlas,...ra,0,0,w,h)}catch(_){}
 ctx.restore();

 ctx.save();
 ctx.globalAlpha=kind==='button'?.22:(.11+(v%4)*.025);
 ctx.globalCompositeOperation=(v%3===0)?'screen':'soft-light';
 try{ctx.drawImage(atlas,...rb,-w*.02,-h*.02,w*1.04,h*1.04)}catch(_){}
 ctx.restore();
}

function drawCard(el,t){
 const canvas=q(':scope > .jr48-card-canvas',el);
 if(canvas)drawComposite(canvas,el,t,'card');
}

function drawButton(el,t){
 const canvas=q(':scope > .jr48-btn-canvas',el);
 if(canvas)drawComposite(canvas,el,t,'button');
}

function drawPage(t){
 if(!pageCanvas||!atlas||atlas.readyState<2)return;
 const dpr=Math.min(devicePixelRatio||1,mobile?1:1.1);
 const w=Math.max(320,Math.round(innerWidth*dpr));
 const h=Math.max(240,Math.round(innerHeight*dpr));
 if(pageCanvas.width!==w||pageCanvas.height!==h){
  pageCanvas.width=w;
  pageCanvas.height=h;
 }
 const ctx=pageCanvas.getContext('2d',{alpha:false});
 const ratio=w/h;
 const tile=(30+Math.floor(t/14000))%TILES;
 const r=tileRect(tile,ratio,1.7,t);
 ctx.clearRect(0,0,w,h);
 try{ctx.drawImage(atlas,...r,0,0,w,h)}catch(_){}
}

function applyIdentity(el){
 const id=serial++;
 const [a,b]=uniquePair(id);
 el.dataset.jr48a=String(a);
 el.dataset.jr48b=String(b);
 el.dataset.jr48v=String(id%31);
 el.style.setProperty('--jr48-hue',`${((id*11)%31)-15}deg`);
}

function cardSelectors(){
 return [
  '.card','.panel','.section','.table-wrap',
  '.match-card','.match-row','.fixture-card','.fixture',
  '.team-card','.stat-card','.tool-card','.access-card',
  '.feature-card','.sponsor-card','.news-card',
  '.credential-card','.leader-card','.metric-card',
  '.schedule-card','.category-card','.glass-card','.jr-card',
  '[class*="card"]:not(button):not(a)',
  '[class*="panel"]:not(button):not(a)',
  'section'
 ].join(',');
}

function cardEligible(el){
 if(!el||el.dataset.jr48Motion)return false;
 if(el.closest('#jr48AtlasHost,.topbar,.bottom-nav,#jr44Register'))return false;
 if(el.matches('.jr39-view-banner'))return false;
 const r=el.getBoundingClientRect();
 if(r.width<145||r.height<58)return false;

 // Evita convertir contenedores gigantes y genéricos que sólo envuelven toda la app.
 if(r.width>innerWidth*.98&&r.height>innerHeight*1.6&&!el.matches('section'))return false;

 return true;
}

function decorateCard(el){
 if(!cardEligible(el))return false;

 applyIdentity(el);
 el.dataset.jr48Motion='1';
 el.classList.add('jr48-motion-card');

 const r=el.getBoundingClientRect();
 if(r.width>650||r.height>250)el.classList.add('jr48-large');

 const canvas=document.createElement('canvas');
 canvas.className='jr48-card-canvas';

 const shade=document.createElement('span');
 shade.className='jr48-card-shade';

 el.insertBefore(shade,el.firstChild);
 el.insertBefore(canvas,el.firstChild);

 if(observer)observer.observe(el);
 return true;
}

function decorateButton(btn){
 if(!btn||btn.dataset.jr48Motion)return false;
 if(btn.closest('#jr48AtlasHost'))return false;
 const r=btn.getBoundingClientRect();
 if(r.width<40||r.height<24)return false;

 applyIdentity(btn);
 btn.dataset.jr48Motion='1';
 btn.classList.add('jr48-motion-button');

 const canvas=document.createElement('canvas');
 canvas.className='jr48-btn-canvas';
 btn.insertBefore(canvas,btn.firstChild);

 btn.addEventListener('click',()=>{
  btn.classList.remove('jr48-pop');
  void btn.offsetWidth;
  btn.classList.add('jr48-pop');
  setTimeout(()=>btn.classList.remove('jr48-pop'),260);
 });

 if(observer)observer.observe(btn);
 return true;
}

function visibleRoot(){
 const views=qa('[id^="view-"]');
 const shown=views.find(v=>{
  const cs=getComputedStyle(v);
  const r=v.getBoundingClientRect();
  return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
 });
 return shown||q('main')||document.body;
}

function decorateActiveView(){
 const root=visibleRoot();

 // Cuadros: selectores semánticos, nunca un barrido genérico de todos los div.
 qa(cardSelectors(),root).forEach(decorateCard);

 qa('table',root).forEach(table=>{
  const wrap=table.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||table.parentElement;
  if(wrap){
   wrap.classList.add('jr48-table-motion');
   decorateCard(wrap);
  }
 });

 // Todos los botones visibles de la vista activa.
 qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn,.nav-btn,.tab-btn,[role="button"]',root)
   .forEach(decorateButton);

 // Barra inferior/superior también.
 qa('.bottom-nav button,.topbar button,.bottom-nav [role="button"],.topbar [role="button"]')
   .forEach(decorateButton);
}

function forceDifferentTableStats(){
 Object.entries(VIEW_VIDEO).forEach(([id,src])=>{
  const banner=q(`#view-${id} .jr39-view-banner`);
  const v=banner&&q('video',banner);
  if(!v)return;

  const target=new URL(src,location.href).href;
  if(v.src!==target){
   v.pause();
   v.src=src;
   v.load();
  }

  v.muted=true;
  v.loop=true;
  v.playsInline=true;
  v.preload='metadata';
  v.setAttribute('muted','');
  v.setAttribute('playsinline','');

  if(!document.hidden&&!reduced.matches&&!saveData){
   const p=v.play();
   if(p&&p.catch)p.catch(()=>{});
  }
 });
}

function scheduleRescan(){
 clearTimeout(rescanTimer);
 rescanTimer=setTimeout(()=>{
  decorateActiveView();
  forceDifferentTableStats();
 },110);
}

function hookNavigation(){
 if(typeof window.showView==='function'&&!window.showView.__jr48){
  const old=window.showView;
  const wrapped=function(){
   const out=old.apply(this,arguments);
   scheduleRescan();
   return out;
  };
  wrapped.__jr48=true;
  window.showView=wrapped;
 }

 addEventListener('hashchange',scheduleRescan,{passive:true});
 document.addEventListener('click',scheduleRescan,{passive:true});
}

function visibility(){
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
   atlas?.pause();
   qa('.jr39-view-banner>video').forEach(v=>v.pause());
  }else if(atlas&&!reduced.matches&&!saveData){
   const p=atlas.play();
   if(p&&p.catch)p.catch(()=>{});
   forceDifferentTableStats();
  }
 });
}

function init(){
 document.body.classList.add('jr48-fix16');
 refreshBuild();
 removeOldVisuals();
 createEngine();
 forceDifferentTableStats();
 decorateActiveView();
 hookNavigation();
 visibility();

 // Una revisión tardía única por contenido que aparezca al iniciar.
 setTimeout(()=>{
  removeOldVisuals();
  decorateActiveView();
  forceDifferentTableStats();
 },850);
}

if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',init,{once:true});
}else{
 init();
}
})();
