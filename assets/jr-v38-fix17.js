
(function(){
'use strict';
if(window.__JR49Fix17)return;
window.__JR49Fix17=true;
window.__JR47DisableLegacyMotion=true;

const BUILD='38-17';
const ATLAS='./assets/motion/jr-v38-fix17-atlas10.mp4';
const COLS=5,ROWS=2,TW=256,TH=144,TILES=10,PAIR_COUNT=TILES*(TILES-1);

const SCENES=[
 'stadium-run',        // 0 jugadores corriendo / estadio
 'goalkeeper-dive',    // 1 portero atajando
 'bicycle-kick',       // 2 chilena
 'goal-net',           // 3 tiro / portería / red
 'boots',              // 4 botines
 'rain-pitch',         // 5 clima / lluvia / cancha
 'tactics',            // 6 táctica / datos
 'crowd-lights',       // 7 afición / estadio
 'referee',            // 8 árbitro / reglamento
 'ball-920'            // 9 balón completo rotando 920°
];

const COLORS=[
 ['#58a6ff','#41d9ff'],['#ff5263','#ff8a63'],['#f2c14e','#ff7b54'],
 ['#41d9ff','#a879ff'],['#ff6f91','#f2c14e'],['#57c7ff','#3b82f6'],
 ['#22e07a','#41d9ff'],['#a879ff','#ff5263'],['#f2c14e','#58a6ff'],
 ['#41d9ff','#ff5263']
];

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const coarse=window.matchMedia?matchMedia('(pointer:coarse)').matches:false;
const mobile=innerWidth<780||coarse;
const FPS=mobile?3:5;

let atlas=null,pageCanvas=null,observer=null,timer=0,serial=0,rescanTimer=0;
const visibleCards=new Set(),visibleButtons=new Set();

function refreshBuild(){
 try{
  const old=localStorage.getItem('jr49-build');
  localStorage.setItem('jr49-build',BUILD);
  if(old!==BUILD&&'caches'in window){
   caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  }
  if(navigator.serviceWorker){
   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
  }
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function cleanOldMotion(){
 document.body.classList.remove('jr47-stable','jr48-fix16');
 [
  '#jr44VideoSources','#jr45AtlasHost','#jr46AtlasHost','#jr47StableVideo','#jr47StableShade',
  '#jr48AtlasHost','#jr48PageCanvas','#jr48PageShade',
  '#jr44AmbientCanvas','#jr44AmbientShade','#jr45PageBg','#jr45PageShade','#jr46PageCanvas','#jr46PageShade'
 ].forEach(sel=>q(sel)?.remove());
 qa('.jr44-motion-canvas,.jr44-motion-shade,.jr44-stage-motion,.jr44-stage-shade,.jr45-motion-canvas,.jr45-motion-shade,.jr46-canvas,.jr46-shade,.jr48-card-canvas,.jr48-card-shade,.jr48-btn-canvas')
  .forEach(n=>n.remove());
}

function createEngine(){
 if(reduced.matches||saveData){
  document.body.classList.add('jr49-save');
  return;
 }
 const host=document.createElement('div');
 host.id='jr49AtlasHost';

 atlas=document.createElement('video');
 atlas.id='jr49Atlas';
 atlas.src=ATLAS;
 atlas.muted=true; atlas.loop=true; atlas.playsInline=true; atlas.preload='auto';
 atlas.setAttribute('muted',''); atlas.setAttribute('playsinline',''); atlas.setAttribute('aria-hidden','true');

 host.appendChild(atlas);
 document.body.appendChild(host);

 pageCanvas=document.createElement('canvas');
 pageCanvas.id='jr49PageCanvas';
 const shade=document.createElement('div'); shade.id='jr49PageShade';
 document.body.prepend(shade); document.body.prepend(pageCanvas);

 observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
   const el=e.target;
   const set=el.classList.contains('jr49-motion-button')?visibleButtons:visibleCards;
   if(e.isIntersecting&&e.intersectionRatio>.01)set.add(el); else set.delete(el);
  });
 },{threshold:[0,.01,.16],rootMargin:'90px 0px'});

 const p=atlas.play(); if(p&&p.catch)p.catch(()=>{});
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
    if(el.isConnected&&onscreen(el))drawElement(el,'.jr49-card-canvas',now,'card');
    else visibleCards.delete(el);
   });
   visibleButtons.forEach(el=>{
    if(el.isConnected&&onscreen(el))drawElement(el,'.jr49-btn-canvas',now,'button');
    else visibleButtons.delete(el);
   });
  }
 }finally{scheduleTick()}
}
function onscreen(el){
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
function semanticTile(el){
 const s=(el.textContent||'').toLowerCase();
 if(/clima|lluvia|pronóstico|pronostico|terreno|campo|cancha/.test(s))return 5;
 if(/portero|portería|porteria|gol|marcador|resultado/.test(s))return 3;
 if(/final|liguilla|copa|eliminatoria/.test(s))return 2;
 if(/tabla|posición|posicion|estadística|estadistica|goleo|rendimiento|dato/.test(s))return 6;
 if(/árbitro|arbitro|reglamento|sanción|sancion/.test(s))return 8;
 if(/equipo|jugador|plantilla|credencial|registro/.test(s))return 0;
 if(/afición|aficion|patrocin|comunidad|fan/.test(s))return 7;
 if(/táctica|tactica|simulador|pizarra/.test(s))return 6;
 if(/botín|botin|calzado/.test(s))return 4;
 if(/partido|jornada|match|calendario/.test(s))return 0;
 return -1;
}
function tileRect(tile,ratio,phase,t,contain){
 const col=tile%COLS,row=Math.floor(tile/COLS);
 const bx=col*TW,by=row*TH,tileRatio=TW/TH;
 let sx=bx,sy=by,sw=TW,sh=TH;

 if(contain)return [sx,sy,sw,sh];

 if(ratio>tileRatio){
  sh=TW/ratio;
  const room=TH-sh;
  sy=by+room*(.5+.16*Math.sin(t/3300+phase));
 }else{
  sw=TH*ratio;
  const room=TW-sw;
  sx=bx+room*(.5+.18*Math.cos(t/3600+phase));
 }
 return [sx,sy,sw,sh];
}
function ensureSize(canvas,el,kind){
 const r=el.getBoundingClientRect();
 const maxW=kind==='button'?(mobile?135:175):(mobile?270:365);
 const scale=Math.min(1,maxW/Math.max(1,r.width));
 const w=Math.max(kind==='button'?72:118,Math.round(r.width*scale));
 const h=Math.max(kind==='button'?26:64,Math.round(r.height*scale));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
}
function drawContain(ctx,src,dstW,dstH){
 const [sx,sy,sw,sh]=src;
 const sr=sw/sh,dr=dstW/dstH;
 let w=dstW,h=dstH,x=0,y=0;
 if(dr>sr){w=dstH*sr;x=(dstW-w)/2}else{h=dstW/sr;y=(dstH-h)/2}
 ctx.drawImage(atlas,sx,sy,sw,sh,x,y,w,h);
}
function drawElement(el,selector,t,kind){
 const canvas=q(':scope > '+selector,el);
 if(!canvas||!atlas||atlas.readyState<2)return;
 ensureSize(canvas,el,kind);
 const ctx=canvas.getContext('2d',{alpha:false});
 const w=canvas.width,h=canvas.height,ratio=w/h;
 const a=+el.dataset.jr49a,b=+el.dataset.jr49b,v=+el.dataset.jr49v;
 const full=(a===9)&&el.classList.contains('jr49-ball-full');
 const ra=tileRect(a,ratio,v*.31,t,full);
 const rb=tileRect(b,ratio,v*.57,t+900,false);

 ctx.clearRect(0,0,w,h);
 ctx.save();
 if(v%2 && !full){ctx.translate(w,0);ctx.scale(-1,1)}
 try{
  if(full)drawContain(ctx,ra,w,h);
  else ctx.drawImage(atlas,...ra,0,0,w,h);
 }catch(_){}
 ctx.restore();

 ctx.save();
 ctx.globalAlpha=kind==='button'?.16:.10;
 ctx.globalCompositeOperation=(v%2===0)?'screen':'soft-light';
 try{ctx.drawImage(atlas,...rb,0,0,w,h)}catch(_){}
 ctx.restore();
}
function activeViewName(){
 const hash=(location.hash||'').replace(/^#/,'').toLowerCase();
 if(hash)return hash;
 const shown=qa('[id^="view-"]').find(v=>{
  const cs=getComputedStyle(v),r=v.getBoundingClientRect();
  return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
 });
 return shown?shown.id.replace(/^view-/,''):'home';
}
function pageTile(){
 const id=activeViewName();
 return ({home:7,matches:0,table:6,stats:1,more:8,teams:0,fields:5,bracket:2,matchcenter:3,credential:4})[id]??7;
}
function drawPage(t){
 if(!pageCanvas||!atlas||atlas.readyState<2)return;
 const dpr=Math.min(devicePixelRatio||1,mobile?1:1.1);
 const w=Math.max(320,Math.round(innerWidth*dpr)),h=Math.max(240,Math.round(innerHeight*dpr));
 if(pageCanvas.width!==w||pageCanvas.height!==h){pageCanvas.width=w;pageCanvas.height=h}
 const ctx=pageCanvas.getContext('2d',{alpha:false});
 const r=tileRect(pageTile(),w/h,1.4,t,false);
 ctx.clearRect(0,0,w,h);
 try{ctx.drawImage(atlas,...r,0,0,w,h)}catch(_){}
}
function applyIdentity(el,forceTile){
 const id=serial++;
 let [a,b]=uniquePair(id);
 const semantic=semanticTile(el);
 if(Number.isInteger(forceTile)&&forceTile>=0)a=forceTile;
 else if(semantic>=0)a=semantic;
 if(b===a)b=(a+1+(id%8))%TILES;

 el.dataset.jr49a=String(a);
 el.dataset.jr49b=String(b);
 el.dataset.jr49v=String(id%37);

 const [ca,cb]=COLORS[a%COLORS.length];
 el.style.setProperty('--jr49-a',ca);
 el.style.setProperty('--jr49-b',cb);
 return a;
}
function cardSelectors(){
 return [
  '.card','.panel','.section','.table-wrap','.match-card','.match-row','.fixture-card','.fixture',
  '.team-card','.stat-card','.tool-card','.access-card','.feature-card','.sponsor-card','.news-card',
  '.credential-card','.leader-card','.metric-card','.schedule-card','.category-card','.glass-card','.jr-card',
  '.jr39-view-banner','[class*="card"]:not(button):not(a)','[class*="panel"]:not(button):not(a)','section'
 ].join(',');
}
function cardEligible(el){
 if(!el||el.dataset.jr49Motion)return false;
 if(el.closest('#jr49AtlasHost,.topbar,.bottom-nav,#jr44Register'))return false;
 const r=el.getBoundingClientRect();
 if(r.width<145||r.height<56)return false;
 if(r.width>innerWidth*.985&&r.height>innerHeight*1.7&&!el.matches('section'))return false;
 return true;
}
function decorateCard(el,forceTile){
 if(!cardEligible(el))return false;
 const r=el.getBoundingClientRect();
 const lowText=(el.textContent||'').trim().length<24;
 const forceBall=lowText&&r.width>300&&r.height>150&&(r.width/r.height)>1.35;
 const tile=applyIdentity(el,forceBall?9:forceTile);

 el.dataset.jr49Motion='1';
 el.classList.add('jr49-motion-card');
 if(r.width>650||r.height>250)el.classList.add('jr49-large');
 if(tile===9&&forceBall)el.classList.add('jr49-ball-full');

 const canvas=document.createElement('canvas');canvas.className='jr49-card-canvas';
 const shade=document.createElement('span');shade.className='jr49-card-shade';
 el.insertBefore(shade,el.firstChild);el.insertBefore(canvas,el.firstChild);
 if(observer)observer.observe(el);
 return true;
}
function decorateButton(btn){
 if(!btn||btn.dataset.jr49Motion)return false;
 if(btn.closest('#jr49AtlasHost'))return false;
 const r=btn.getBoundingClientRect();
 if(r.width<38||r.height<22)return false;

 const parent=btn.closest('.jr49-motion-card');
 const force=parent?+parent.dataset.jr49a:-1;
 applyIdentity(btn,Number.isFinite(force)?force:-1);

 btn.dataset.jr49Motion='1';btn.classList.add('jr49-motion-button');
 const canvas=document.createElement('canvas');canvas.className='jr49-btn-canvas';
 btn.insertBefore(canvas,btn.firstChild);
 btn.addEventListener('click',()=>{
  btn.classList.remove('jr49-pop');void btn.offsetWidth;btn.classList.add('jr49-pop');
  setTimeout(()=>btn.classList.remove('jr49-pop'),260);
 });
 if(observer)observer.observe(btn);
 return true;
}
function visibleRoot(){
 const views=qa('[id^="view-"]');
 const shown=views.find(v=>{
  const cs=getComputedStyle(v),r=v.getBoundingClientRect();
  return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
 });
 return shown||q('main')||document.body;
}
function decorateActiveView(){
 const root=visibleRoot();
 qa(cardSelectors(),root).forEach(el=>{
  let force=-1;
  if(el.matches('#view-table .jr39-view-banner'))force=6;
  if(el.matches('#view-stats .jr39-view-banner'))force=1;
  decorateCard(el,force);
 });
 qa('table',root).forEach(table=>{
  const wrap=table.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||table.parentElement;
  if(wrap){wrap.classList.add('jr49-table-motion');decorateCard(wrap,6)}
 });
 qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn,.nav-btn,.tab-btn,[role="button"]',root).forEach(decorateButton);
 qa('.bottom-nav button,.topbar button,.bottom-nav [role="button"],.topbar [role="button"]').forEach(decorateButton);
}
function scheduleRescan(){
 clearTimeout(rescanTimer);
 rescanTimer=setTimeout(decorateActiveView,120);
 setTimeout(decorateActiveView,650);
}
function hookNavigation(){
 if(typeof window.showView==='function'&&!window.showView.__jr49){
  const old=window.showView;
  const wrapped=function(){const out=old.apply(this,arguments);scheduleRescan();return out};
  wrapped.__jr49=true;window.showView=wrapped;
 }
 addEventListener('hashchange',scheduleRescan,{passive:true});
 document.addEventListener('click',scheduleRescan,{passive:true});
}
function visibility(){
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)atlas?.pause();
  else if(atlas&&!reduced.matches&&!saveData){
   const p=atlas.play();if(p&&p.catch)p.catch(()=>{});
  }
 });
}
function init(){
 document.body.classList.add('jr49-fix17');
 refreshBuild();cleanOldMotion();createEngine();decorateActiveView();hookNavigation();visibility();
 setTimeout(()=>{cleanOldMotion();decorateActiveView()},850);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
