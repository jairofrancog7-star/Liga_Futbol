
(function(){
'use strict';
if(window.__JR47Fix15)return;
window.__JR47Fix15=true;
window.__JR47DisableLegacyMotion=true;

const BUILD='38-15';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);

const VIDEOS={
 home:'./assets/motion/v38-soccer-hero.mp4',
 matches:'./assets/motion/v38-soccer-matchday.mp4',
 table:'./assets/motion/v38-emirates-table.mp4',
 stats:'./assets/motion/v38-emirates-stats.mp4',
 more:'./assets/motion/v38-emirates-community.mp4',
 teams:'./assets/motion/v38-emirates-teams.mp4',
 bracket:'./assets/motion/v38-soccer-liguilla.mp4',
 fields:'./assets/motion/v38-soccer-fields-rain.mp4',
 matchcenter:'./assets/motion/v38-emirates-matchcenter.mp4',
 credential:'./assets/motion/v38-emirates-teams.mp4'
};

const HOME_PLAYLIST=[
 VIDEOS.home,
 './assets/motion/v38-fix12-motion-field-lite.mp4',
 './assets/motion/v38-fix12-motion-tactics-lite.mp4',
 VIDEOS.more,
 VIDEOS.matchcenter
];

let stableVideo=null;
let currentSrc='';
let homeObserver=null;
let clickTimer=0;

function refreshBuild(){
 try{
  const old=localStorage.getItem('jr47-build');
  localStorage.setItem('jr47-build',BUILD);
  if(old!==BUILD&&'caches'in window){
   caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  }
  if(navigator.serviceWorker){
   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
  }
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

function killLegacy(){
 [
  '#jr44VideoSources','#jr45AtlasHost','#jr46AtlasHost',
  '#jr44AmbientCanvas','#jr44AmbientShade',
  '#jr45PageBg','#jr45PageShade',
  '#jr46PageCanvas','#jr46PageShade'
 ].forEach(sel=>{
  const el=q(sel);
  if(!el)return;
  qa('video',el).forEach(v=>{
   try{v.pause();v.removeAttribute('src');v.load()}catch(_){}
  });
  el.remove();
 });
 qa('.jr44-motion-canvas,.jr44-motion-shade,.jr44-stage-motion,.jr44-stage-shade,.jr45-motion-canvas,.jr45-motion-shade,.jr46-canvas,.jr46-shade')
   .forEach(n=>n.remove());
}

function createStableVideo(){
 if(reduced.matches||saveData){
  document.body.classList.add('jr47-save');
  return;
 }
 stableVideo=document.createElement('video');
 stableVideo.id='jr47StableVideo';
 stableVideo.muted=true;
 stableVideo.loop=true;
 stableVideo.playsInline=true;
 stableVideo.preload='metadata';
 stableVideo.setAttribute('muted','');
 stableVideo.setAttribute('playsinline','');
 stableVideo.setAttribute('aria-hidden','true');

 const shade=document.createElement('div');
 shade.id='jr47StableShade';
 document.body.prepend(shade);
 document.body.prepend(stableVideo);
}

function setVideo(src){
 if(!stableVideo||!src||src===currentSrc)return;
 currentSrc=src;
 stableVideo.pause();
 stableVideo.src=src;
 stableVideo.load();
 const p=stableVideo.play();
 if(p&&p.catch)p.catch(()=>{
  if(src!==VIDEOS.home){
   currentSrc='';
   setVideo(VIDEOS.home);
  }
 });
}

function activeView(){
 const hash=(location.hash||'').replace(/^#/,'').toLowerCase();
 if(hash&&VIDEOS[hash])return hash;
 const shown=qa('[id^="view-"]').find(v=>{
  const cs=getComputedStyle(v);
  return cs.display!=='none'&&cs.visibility!=='hidden';
 });
 if(shown){
  const id=shown.id.replace(/^view-/,'');
  if(VIDEOS[id])return id;
 }
 return 'home';
}

function setViewMotion(id){
 setVideo(VIDEOS[id]||VIDEOS.home);
 if(id==='home')setupHomeObserver();
 else stopHomeObserver();
}

function glassify(){
 const selectors=[
  '.card','.panel','.section','.table-wrap','.match-card','.match-row',
  '.fixture-card','.team-card','.stat-card','.tool-card','.access-card',
  '.feature-card','.sponsor-card','.credential-card','.leader-card',
  '.metric-card','.glass-card','.jr-card',
  '[class*="card"]:not(button):not(a)',
  '[class*="panel"]:not(button):not(a)'
 ].join(',');

 qa(selectors).forEach(el=>{
  if(el.closest('#jr44Register')||el.closest('.topbar,.bottom-nav'))return;
  el.classList.add('jr47-glass');
  const r=el.getBoundingClientRect();
  if(r.width>650||r.height>250)el.classList.add('jr47-big');
 });

 qa('table').forEach(table=>{
  const wrap=table.closest('.table-wrap,.section,.card,.panel,[class*="table"],[class*="card"]')||table.parentElement;
  if(wrap){
   wrap.classList.add('jr47-glass','jr47-table');
  }
 });
}

function forceDistinctBannerVideos(){
 const map={
  table:VIDEOS.table,
  stats:VIDEOS.stats
 };
 Object.entries(map).forEach(([id,src])=>{
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
   const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }
 });
}

function setupHomeObserver(){
 stopHomeObserver();
 if(!('IntersectionObserver'in window)||reduced.matches||saveData)return;

 const sections=qa('#view-home > section,#view-home > .section,#view-home > .card')
   .filter(el=>el.getBoundingClientRect().height>160);

 homeObserver=new IntersectionObserver(entries=>{
  const hit=entries
   .filter(e=>e.isIntersecting)
   .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!hit)return;
  const idx=Math.max(0,sections.indexOf(hit.target));
  setVideo(HOME_PLAYLIST[idx%HOME_PLAYLIST.length]);
 },{threshold:[.18,.35,.55],rootMargin:'-18% 0px -28% 0px'});

 sections.forEach(s=>homeObserver.observe(s));
}

function stopHomeObserver(){
 if(homeObserver){homeObserver.disconnect();homeObserver=null}
}

function buttons(){
 qa('button,.btn-primary,.primary-btn,.btn-ghost,.ghost-btn,.nav-btn,.tab-btn').forEach(btn=>{
  if(btn.dataset.jr47Btn)return;
  btn.dataset.jr47Btn='1';
  btn.addEventListener('click',()=>{
   btn.classList.remove('jr47-pop');
   void btn.offsetWidth;
   btn.classList.add('jr47-pop');
   setTimeout(()=>btn.classList.remove('jr47-pop'),260);
  });
 });
}

function rescan(){
 killLegacy();
 glassify();
 forceDistinctBannerVideos();
 buttons();
 setViewMotion(activeView());
}

function hookNavigation(){
 if(typeof window.showView==='function'&&!window.showView.__jr47){
  const old=window.showView;
  const wrapped=function(){
   const out=old.apply(this,arguments);
   const id=String(arguments[0]||'home').toLowerCase();
   setTimeout(()=>{
    glassify();
    forceDistinctBannerVideos();
    buttons();
    setViewMotion(VIDEOS[id]?id:activeView());
   },50);
   return out;
  };
  wrapped.__jr47=true;
  window.showView=wrapped;
 }

 document.addEventListener('click',()=>{
  clearTimeout(clickTimer);
  clickTimer=setTimeout(()=>{
   glassify();
   forceDistinctBannerVideos();
   buttons();
   setViewMotion(activeView());
  },110);
 },{passive:true});
}

function visibility(){
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
   stableVideo?.pause();
   qa('.jr39-view-banner>video').forEach(v=>v.pause());
  }else if(!reduced.matches&&!saveData){
   const p=stableVideo?.play();if(p&&p.catch)p.catch(()=>{});
   forceDistinctBannerVideos();
  }
 });
}

function init(){
 document.body.classList.add('jr47-stable');
 refreshBuild();
 killLegacy();
 createStableVideo();
 glassify();
 forceDistinctBannerVideos();
 buttons();
 hookNavigation();
 visibility();
 setViewMotion(activeView());

 // Una sola limpieza tardía. Sin observador DOM y sin loop adicional.
 setTimeout(()=>{
  killLegacy();
  glassify();
  forceDistinctBannerVideos();
 },900);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
