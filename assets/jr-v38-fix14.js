
(function(){
'use strict';
if(window.__JR46Fix14)return;
window.__JR46Fix14=true;

const BUILD='38-14';
const ATLAS='./assets/motion/v38-fix14-atlas36.mp4';
const COLS=6,ROWS=6,TW=320,TH=180,TILES=36;
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const coarse=window.matchMedia?matchMedia('(pointer:coarse)').matches:false;
const mobile=innerWidth<780||coarse;
const FPS=mobile?8:12;
const visible=new Set();
let atlas=null,pageCanvas=null,observer=null,last=0,raf=0,scanTimer=0;

const BANNER_VIDEO={
 table:'./assets/motion/v38-emirates-table.mp4',
 stats:'./assets/motion/v38-emirates-stats.mp4'
};

function refreshBuild(){
 try{
  const prev=localStorage.getItem('jr46-build');
  localStorage.setItem('jr46-build',BUILD);
  if(prev!==BUILD&&'caches'in window){
   caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  }
  if(navigator.serviceWorker){
   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
  }
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function disableOldMotion(){
 q('#jr45AtlasHost')?.remove();
 q('#jr45PageBg')?.remove();
 q('#jr45PageShade')?.remove();
 q('#jr44VideoSources')?.remove();
 q('#jr44AmbientCanvas')?.remove();
 q('#jr44AmbientShade')?.remove();
 qa('.jr45-motion-canvas,.jr45-motion-shade,.jr44-motion-canvas,.jr44-motion-shade,.jr44-stage-motion,.jr44-stage-shade')
   .forEach(n=>n.remove());
}

function makeSources(){
 if(reduced.matches||saveData){
  document.body.classList.add('jr46-save-data');
  return;
 }
 const host=document.createElement('div');
 host.id='jr46AtlasHost';
 atlas=document.createElement('video');
 atlas.id='jr46Atlas';
 atlas.src=ATLAS;
 atlas.muted=true;atlas.loop=true;atlas.playsInline=true;atlas.preload='auto';
 atlas.setAttribute('muted','');atlas.setAttribute('playsinline','');
 host.appendChild(atlas);
 document.body.appendChild(host);

 pageCanvas=document.createElement('canvas');
 pageCanvas.id='jr46PageCanvas';
 const shade=document.createElement('div');shade.id='jr46PageShade';
 document.body.prepend(shade);
 document.body.prepend(pageCanvas);

 const p=atlas.play();if(p&&p.catch)p.catch(()=>{});
 observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
   if(e.isIntersecting&&e.intersectionRatio>.01)visible.add(e.target);
   else visible.delete(e.target);
  });
 },{threshold:[0,.01,.08],rootMargin:'100px 0px'});
 raf=requestAnimationFrame(render);
}

function hash(s){
 let h=2166136261;
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return h>>>0;
}

function sig(el,index){
 const text=(el.getAttribute('aria-label')||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,140);
 return `${el.tagName}|${el.id}|${el.className}|${text}|${index}`;
}

function assign(el,index){
 const h=hash(sig(el,index));
 let a=h%TILES;
 let b=((h>>>8)+(index*11)+7)%TILES;
 if(a===b)b=(b+13)%TILES;
 el.dataset.jr46a=String(a);
 el.dataset.jr46b=String(b);
 el.dataset.jr46v=String((h>>>16)%31);
}

function tileRect(tile,ratio,phase,t){
 const col=tile%COLS,row=Math.floor(tile/COLS);
 const bx=col*TW,by=row*TH,tr=TW/TH;
 let sx=bx,sy=by,sw=TW,sh=TH;
 if(ratio>tr){
  sh=TW/ratio;
  sy=by+(TH-sh)*(.5+.22*Math.sin(t/2400+phase));
 }else{
  sw=TH*ratio;
  sx=bx+(TW-sw)*(.5+.24*Math.cos(t/2700+phase));
 }
 return [sx,sy,sw,sh];
}

function sizeCanvas(c,el){
 const r=el.getBoundingClientRect();
 const maxW=mobile?300:480;
 const scale=Math.min(1,maxW/Math.max(1,r.width));
 const w=Math.max(120,Math.round(r.width*scale));
 const h=Math.max(72,Math.round(r.height*scale));
 if(c.width!==w||c.height!==h){c.width=w;c.height=h}
}

function draw(el,t){
 const c=q(':scope > .jr46-canvas',el);
 if(!c||!atlas||atlas.readyState<2)return;
 sizeCanvas(c,el);
 const ctx=c.getContext('2d',{alpha:false});
 const w=c.width,h=c.height,r=w/h;
 const a=+el.dataset.jr46a,b=+el.dataset.jr46b,v=+el.dataset.jr46v;
 const ra=tileRect(a,r,v*.37,t);
 const rb=tileRect(b,r,v*.61,t+700);

 ctx.save();
 ctx.clearRect(0,0,w,h);
 ctx.filter=`brightness(${.82+(v%6)*.025}) saturate(${.88+(v%5)*.045}) hue-rotate(${((v*9)%29)-14}deg)`;
 if(v%2){ctx.translate(w,0);ctx.scale(-1,1)}
 try{ctx.drawImage(atlas,...ra,0,0,w,h)}catch(_){}
 ctx.restore();

 ctx.save();
 ctx.globalAlpha=.09+(v%4)*.025;
 ctx.globalCompositeOperation=(v%3===0)?'screen':'soft-light';
 try{ctx.drawImage(atlas,...rb,-w*.03,-h*.03,w*1.06,h*1.06)}catch(_){}
 ctx.restore();
}

function drawPage(t){
 if(!pageCanvas||!atlas||atlas.readyState<2)return;
 const dpr=Math.min(devicePixelRatio||1,mobile?1:1.15);
 const w=Math.max(320,Math.round(innerWidth*dpr));
 const h=Math.max(240,Math.round(innerHeight*dpr));
 if(pageCanvas.width!==w||pageCanvas.height!==h){pageCanvas.width=w;pageCanvas.height=h}
 const ctx=pageCanvas.getContext('2d',{alpha:false});
 const ratio=w/h;
 const tile=((Math.floor(t/13000)*5)+31)%TILES;
 const r=tileRect(tile,ratio,1.3,t);
 ctx.clearRect(0,0,w,h);
 ctx.filter='brightness(.68) saturate(.92) contrast(1.1)';
 try{ctx.drawImage(atlas,...r,0,0,w,h)}catch(_){}
}

function render(t){
 raf=requestAnimationFrame(render);
 if(document.hidden||reduced.matches||saveData||!atlas)return;
 if(t-last<1000/FPS)return;
 last=t;
 drawPage(t);
 visible.forEach(el=>{
  if(!el.isConnected){visible.delete(el);return}
  draw(el,t);
 });
}

function eligible(el){
 if(!el||el.dataset.jr46Motion)return false;
 if(el.closest('#jr46AtlasHost'))return false;
 if(el.matches('html,body,script,style,link,canvas,video,button,a,input,select,textarea,nav,header,footer,table,thead,tbody,tr,td,th,svg,path'))return false;
 const r=el.getBoundingClientRect();
 if(r.width<145||r.height<56)return false;
 const cs=getComputedStyle(el);
 const radius=parseFloat(cs.borderRadius)||0;
 const border=(parseFloat(cs.borderTopWidth)||0)+(parseFloat(cs.borderBottomWidth)||0);
 const bg=cs.backgroundColor;
 const named=/card|panel|section|tile|tool|access|metric|stat|match|fixture|sponsor|credential|leader|feature|hub|ops|grid-item/i.test(el.className||'');
 const semantic=/Todo Juventino Rosas|Tu liga, más viva|Credenciales con OCR|Patrocinadores|Goleo y rendimiento|Estado de la Liga|Herramientas de la liga|Entrar a Liga Juventino Rosas|Video completo de la Gran Final/i.test(el.textContent||'');
 return named||semantic||radius>=10||border>0||(bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent');
}

function decorate(el,index){
 if(!eligible(el))return false;
 el.dataset.jr46Motion='1';
 assign(el,index);
 el.classList.add('jr46-motion');
 const r=el.getBoundingClientRect();
 if(r.width>650||r.height>250)el.classList.add('jr46-large');
 const c=document.createElement('canvas');c.className='jr46-canvas';
 const s=document.createElement('span');s.className='jr46-shade';
 el.insertBefore(s,el.firstChild);
 el.insertBefore(c,el.firstChild);
 if(observer)observer.observe(el);
 return true;
}

function decorateAll(){
 const roots=qa('#view-home,#view-matches,#view-table,#view-stats,#view-more,#view-fields,#view-teams,#view-bracket,#view-matchcenter,#view-credential,main,.app');
 const seen=new Set();let i=0;
 roots.forEach(root=>{
  qa('section,article,div',root).forEach(el=>{
   if(seen.has(el))return;seen.add(el);
   if(el.closest('.topbar,.bottom-nav,.jr38-scene-controls,#jr44Register'))return;
   if(decorate(el,i))i++;
  });
 });

 qa('table').forEach(table=>{
  const wrap=table.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||table.parentElement;
  if(wrap){
   wrap.classList.add('jr46-table');
   if(!wrap.dataset.jr46Motion)decorate(wrap,i++);
  }
 });
}

function fixSpecificBanners(){
 Object.entries(BANNER_VIDEO).forEach(([id,src])=>{
  const banner=q(`#view-${id} .jr39-view-banner`);
  if(!banner)return;
  const v=q('video',banner);
  if(!v)return;
  if(!v.src.endsWith(src.replace('./',''))){
   v.pause();v.src=src;v.load();
  }
  v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';
  v.setAttribute('muted','');v.setAttribute('playsinline','');
  if(!document.hidden&&!reduced.matches&&!saveData){
   const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }
 });
}

function fixHeroBall(){
 const hero=q('#v14CinematicHero');
 const stage=q('#v14CinematicHero .v14-stage');
 if(!hero||!stage)return;
 stage.dataset.jr46Ball='full';
 const v=q('.jr39-home-video',stage);
 if(v){
  v.style.objectFit='contain';
  v.style.objectPosition='center';
  v.style.transform='none';
 }
 window.JRSceneV38?.mount?.();
}

function animateButtons(){
 qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn,.nav-btn,.tab-btn').forEach(btn=>{
  if(btn.dataset.jr46Btn)return;
  btn.dataset.jr46Btn='1';
  if(!coarse&&!reduced.matches){
   btn.addEventListener('pointermove',e=>{
    const r=btn.getBoundingClientRect();
    const nx=((e.clientX-r.left)/Math.max(1,r.width)-.5)*5;
    const ny=((e.clientY-r.top)/Math.max(1,r.height)-.5)*4-2;
    btn.style.setProperty('--jr46-mx',`${nx.toFixed(1)}px`);
    btn.style.setProperty('--jr46-my',`${ny.toFixed(1)}px`);
   });
   btn.addEventListener('pointerleave',()=>{
    btn.style.setProperty('--jr46-mx','0px');
    btn.style.setProperty('--jr46-my','-2px');
   });
  }
  btn.addEventListener('click',()=>{
   btn.classList.remove('jr46-pop');
   void btn.offsetWidth;
   btn.classList.add('jr46-pop');
   setTimeout(()=>btn.classList.remove('jr46-pop'),330);
  });
 });
}

function rescan(){
 clearTimeout(scanTimer);
 scanTimer=setTimeout(()=>{
  disableOldMotion();
  fixSpecificBanners();
  fixHeroBall();
  decorateAll();
  animateButtons();
 },90);
}

function hookDynamic(){
 const mo=new MutationObserver(rescan);
 mo.observe(document.body,{childList:true,subtree:true});
 if(typeof window.showView==='function'&&!window.showView.__jr46){
  const old=window.showView;
  const wrapped=function(){
   const out=old.apply(this,arguments);
   setTimeout(rescan,40);
   return out;
  };
  wrapped.__jr46=true;
  window.showView=wrapped;
 }
 document.addEventListener('click',()=>setTimeout(rescan,80),{passive:true});
}

function visibility(){
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)atlas?.pause();
  else if(atlas&&!reduced.matches&&!saveData){
   const p=atlas.play();if(p&&p.catch)p.catch(()=>{});
   fixSpecificBanners();
  }
 });
}

function init(){
 document.body.classList.add('jr46-fix14');
 refreshBuild();
 disableOldMotion();
 makeSources();
 fixSpecificBanners();
 fixHeroBall();
 decorateAll();
 animateButtons();
 hookDynamic();
 visibility();
 setTimeout(rescan,700);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
