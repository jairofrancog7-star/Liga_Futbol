
(function(){
'use strict';
if(window.__JR50Fix18)return;
window.__JR50Fix18=true;
window.__JR47DisableLegacyMotion=true;

const BUILD='38-18';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const mobile=innerWidth<780||(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const FPS=mobile?3:5;

/* 11 motion reales que YA existen en la rama V38.
   No se descargan videos inventados ni se depende de créditos al ejecutar. */
const SOURCES={
  matchday:'./assets/motion/v38-soccer-matchday.mp4',
  rain:'./assets/motion/v38-soccer-fields-rain.mp4',
  teams:'./assets/motion/v38-soccer-teams.mp4',
  liguilla:'./assets/motion/v38-soccer-liguilla.mp4',
  soccerStats:'./assets/motion/v38-soccer-stats.mp4',
  hero:'./assets/motion/v38-soccer-hero.mp4',
  community:'./assets/motion/v38-emirates-community.mp4',
  matchcenter:'./assets/motion/v38-emirates-matchcenter.mp4',
  table:'./assets/motion/v38-emirates-table.mp4',
  stats:'./assets/motion/v38-emirates-stats.mp4',
  emiratesTeams:'./assets/motion/v38-emirates-teams.mp4'
};

const VIEW_POOLS={
  home:['matchday','teams','community'],
  matches:['matchday','matchcenter','liguilla'],
  table:['table','teams','matchcenter'],
  stats:['stats','soccerStats','teams'],
  more:['community','emiratesTeams','rain'],
  teams:['teams','emiratesTeams','community'],
  fields:['rain','matchday','community'],
  bracket:['liguilla','matchcenter','matchday'],
  matchcenter:['matchcenter','matchday','teams'],
  credential:['teams','community','matchcenter']
};

const COLORS=['jr50-p0','jr50-p1','jr50-p2','jr50-p3','jr50-p4','jr50-p5'];
const visible=new Set();
let videos=[];
let pageCanvas=null;
let observer=null;
let timer=0;
let serial=0;
let poolName='';
let rescanTimer=0;

function refreshBuild(){
  try{
    const old=localStorage.getItem('jr50-build');
    localStorage.setItem('jr50-build',BUILD);
    if(old!==BUILD&&'caches'in window){
      caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
    }
    if(navigator.serviceWorker){
      navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
    }
  }catch(_){}
  addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function activeView(){
  const hash=(location.hash||'').replace(/^#/,'').toLowerCase();
  if(hash)return hash;
  const shown=qa('[id^="view-"]').find(v=>{
    const cs=getComputedStyle(v),r=v.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
  });
  return shown?shown.id.replace(/^view-/,''):'home';
}

function visibleRoot(){
  const shown=qa('[id^="view-"]').find(v=>{
    const cs=getComputedStyle(v),r=v.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
  });
  return shown||q('main')||document.body;
}

function makeEngines(){
  if(reduced.matches||saveData){
    document.body.classList.add('jr50-save');
    return;
  }
  const host=document.createElement('div');
  host.id='jr50VideoHost';
  Object.assign(host.style,{
    position:'fixed',width:'2px',height:'2px',left:'-20px',top:'-20px',
    opacity:'.001',overflow:'hidden',pointerEvents:'none',zIndex:'-99999'
  });

  for(let i=0;i<3;i++){
    const v=document.createElement('video');
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';
    v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');
    v.dataset.slot=String(i);
    host.appendChild(v);videos.push(v);
  }
  document.body.appendChild(host);

  pageCanvas=document.createElement('canvas');
  pageCanvas.id='jr50PageCanvas';
  const shade=document.createElement('div');shade.id='jr50PageShade';
  document.body.prepend(shade);document.body.prepend(pageCanvas);

  observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&e.intersectionRatio>.01)visible.add(e.target);
      else visible.delete(e.target);
    });
  },{threshold:[0,.01,.15],rootMargin:'90px 0px'});

  setPool(true);
  schedule();
}

function setPool(force){
  if(!videos.length)return;
  const view=activeView();
  const names=VIEW_POOLS[view]||VIEW_POOLS.home;
  const key=view+':'+names.join(',');
  if(!force&&key===poolName)return;
  poolName=key;

  videos.forEach((v,i)=>{
    const src=SOURCES[names[i]]||SOURCES.matchday;
    if(!v.src.endsWith(src.replace('./',''))){
      v.pause();
      v.src=src;
      v.load();
    }
    const p=v.play();
    if(p&&p.catch)p.catch(()=>{});
  });
}

function semanticSlot(el){
  const s=(el.textContent||'').toLowerCase();
  if(/clima|lluvia|pronóstico|pronostico|terreno|campo|cancha/.test(s))return 0;
  if(/tabla|posición|posicion|estadística|estadistica|goleo|rendimiento|datos/.test(s))return 1;
  if(/final|liguilla|copa|semifinal|cuartos/.test(s))return 2;
  if(/equipo|jugador|plantilla|credencial|registro/.test(s))return 1;
  if(/afición|aficion|comunidad|patrocin/.test(s))return 2;
  if(/partido|jornada|match|resultado|marcador/.test(s))return 0;
  return serial%3;
}

function cardSelectors(){
  return [
    '.card','.panel','.section','.table-wrap','.match-card','.match-row','.fixture-card','.fixture',
    '.team-card','.stat-card','.tool-card','.access-card','.feature-card','.sponsor-card','.news-card',
    '.credential-card','.leader-card','.metric-card','.schedule-card','.category-card','.glass-card','.jr-card',
    '.jr39-view-banner','[class*="card"]:not(button):not(a)','[class*="panel"]:not(button):not(a)'
  ].join(',');
}

function eligible(el){
  if(!el||el.dataset.jr50Motion)return false;
  if(el.closest('#jr50VideoHost,.topbar,.bottom-nav'))return false;
  const r=el.getBoundingClientRect();
  return r.width>=150&&r.height>=58;
}

function addCard(el,forcedSlot){
  if(!eligible(el))return;
  const r=el.getBoundingClientRect();
  const id=serial++;
  const slot=Number.isInteger(forcedSlot)?forcedSlot:semanticSlot(el);
  el.dataset.jr50Motion='1';
  el.dataset.jr50Slot=String(slot%3);
  el.dataset.jr50Seed=String(id%23);
  el.classList.add('jr50-motion-card',COLORS[id%COLORS.length]);
  if(r.width>620||r.height>240)el.classList.add('jr50-wide');

  /* Cuadros visuales anchos con poco texto: reservar look de balón completo.
     El canvas sigue usando object-fit lógico (drawContain) y no crop agresivo. */
  if((el.textContent||'').trim().length<32&&r.width>320&&r.height>150){
    el.classList.add('jr50-ball-full');
  }

  const c=document.createElement('canvas');c.className='jr50-card-canvas';
  const sh=document.createElement('span');sh.className='jr50-card-shade';
  el.insertBefore(sh,el.firstChild);el.insertBefore(c,el.firstChild);
  observer?.observe(el);
}

function addButton(el){
  if(!el||el.dataset.jr50Btn)return;
  const r=el.getBoundingClientRect();
  if(r.width<38||r.height<22)return;
  const id=serial++;
  el.dataset.jr50Btn='1';
  el.classList.add('jr50-button',COLORS[id%COLORS.length]);
  el.addEventListener('click',()=>{
    el.classList.remove('jr50-tap');void el.offsetWidth;el.classList.add('jr50-tap');
    setTimeout(()=>el.classList.remove('jr50-tap'),240);
  },{passive:true});
}

function addTables(root){
  qa('table',root).forEach(t=>{
    const wrap=t.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||t.parentElement;
    if(wrap){
      wrap.classList.add('jr50-table-motion');
      addCard(wrap,1);
    }
  });
}

function decorate(){
  setPool(false);
  const root=visibleRoot();
  qa(cardSelectors(),root).forEach(el=>{
    let force;
    if(el.matches('#view-table .jr39-view-banner'))force=0;
    else if(el.matches('#view-stats .jr39-view-banner'))force=1;
    addCard(el,force);
  });
  addTables(root);
  qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn,.nav-btn,.tab-btn,[role="button"]',root).forEach(addButton);
  qa('.topbar button,.bottom-nav button,.topbar [role="button"],.bottom-nav [role="button"]').forEach(addButton);
}

function cropRect(video,ratio,seed,t,contain){
  const vw=video.videoWidth||1280,vh=video.videoHeight||720;
  if(contain)return [0,0,vw,vh];
  const sr=vw/vh;
  let sx=0,sy=0,sw=vw,sh=vh;
  if(ratio>sr){
    sh=vw/ratio;
    sy=(vh-sh)*(.50+.16*Math.sin(t/3400+seed));
  }else{
    sw=vh*ratio;
    sx=(vw-sw)*(.50+.18*Math.cos(t/3900+seed));
  }
  return [sx,sy,sw,sh];
}

function drawContain(ctx,video,w,h){
  const vw=video.videoWidth||1280,vh=video.videoHeight||720;
  const sr=vw/vh,dr=w/h;
  let dw=w,dh=h,x=0,y=0;
  if(dr>sr){dw=h*sr;x=(w-dw)/2}else{dh=w/sr;y=(h-dh)/2}
  ctx.drawImage(video,0,0,vw,vh,x,y,dw,dh);
}

function drawCard(el,t){
  const c=q(':scope > .jr50-card-canvas',el);
  if(!c)return;
  const slot=+(el.dataset.jr50Slot||0);
  const seed=+(el.dataset.jr50Seed||0);
  const v=videos[slot%videos.length];
  if(!v||v.readyState<2)return;
  const r=el.getBoundingClientRect();
  if(r.width<=0||r.height<=0)return;
  const maxW=mobile?280:390;
  const scale=Math.min(1,maxW/r.width);
  const w=Math.max(130,Math.round(r.width*scale));
  const h=Math.max(70,Math.round(r.height*scale));
  if(c.width!==w||c.height!==h){c.width=w;c.height=h}
  const ctx=c.getContext('2d',{alpha:false});
  ctx.clearRect(0,0,w,h);

  const contain=el.classList.contains('jr50-ball-full');
  ctx.save();
  if(seed%2&&!contain){ctx.translate(w,0);ctx.scale(-1,1)}
  try{
    if(contain)drawContain(ctx,v,w,h);
    else{
      const crop=cropRect(v,w/h,seed,t,false);
      ctx.drawImage(v,...crop,0,0,w,h);
    }
  }catch(_){}
  ctx.restore();
}

function drawPage(){
  if(!pageCanvas||!videos[2]||videos[2].readyState<2)return;
  const dpr=Math.min(devicePixelRatio||1,mobile?1:1.1);
  const w=Math.max(320,Math.round(innerWidth*dpr));
  const h=Math.max(240,Math.round(innerHeight*dpr));
  if(pageCanvas.width!==w||pageCanvas.height!==h){pageCanvas.width=w;pageCanvas.height=h}
  const ctx=pageCanvas.getContext('2d',{alpha:false});
  const v=videos[2];
  try{
    const crop=cropRect(v,w/h,7,performance.now(),false);
    ctx.drawImage(v,...crop,0,0,w,h);
  }catch(_){}
}

function onscreen(el){
  const r=el.getBoundingClientRect();
  return r.width>0&&r.height>0&&r.bottom>-100&&r.top<innerHeight+100;
}

function tick(){
  try{
    if(!document.hidden&&!reduced.matches&&!saveData){
      drawPage();
      visible.forEach(el=>{
        if(el.isConnected&&onscreen(el))drawCard(el,performance.now());
        else visible.delete(el);
      });
    }
  }finally{schedule()}
}
function schedule(){
  clearTimeout(timer);
  timer=setTimeout(tick,Math.round(1000/FPS));
}

function rescan(){
  clearTimeout(rescanTimer);
  rescanTimer=setTimeout(()=>{setPool(false);decorate()},120);
  setTimeout(()=>{setPool(false);decorate()},620);
}

function hookNav(){
  if(typeof window.showView==='function'&&!window.showView.__jr50){
    const old=window.showView;
    const wrapped=function(){
      const out=old.apply(this,arguments);
      rescan();
      return out;
    };
    wrapped.__jr50=true;
    window.showView=wrapped;
  }
  addEventListener('hashchange',rescan,{passive:true});
  document.addEventListener('click',rescan,{passive:true});
}

function visibility(){
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)videos.forEach(v=>v.pause());
    else if(!reduced.matches&&!saveData){
      videos.forEach(v=>{
        const p=v.play();if(p&&p.catch)p.catch(()=>{});
      });
    }
  });
}

function init(){
  document.body.classList.add('jr50-fix18');
  refreshBuild();
  makeEngines();
  decorate();
  hookNav();
  visibility();
  setTimeout(decorate,900);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
