
(function(){
'use strict';
if(window.__JR53Fix21)return;
window.__JR53Fix21=true;

const BUILD='38-21';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const coarse=window.matchMedia?matchMedia('(pointer:coarse)').matches:false;
const mobile=innerWidth<780||coarse;

/* Objetivos EXACTOS de las capturas. No se decora el resto. */
const TARGETS=[
  {
    id:'explore',
    keys:['explora la liga'],
    hints:['community','teams'],
    phase:.20
  },
  {
    id:'access',
    keys:['entrar a liga juventino rosas'],
    hints:['matchcenter','match','teams'],
    phase:.85
  },
  {
    id:'ocr',
    keys:['credenciales con ocr'],
    hints:['teams','community','hero'],
    phase:1.45
  },
  {
    id:'master',
    keys:['todo juventino rosas, en un solo lugar','todo juventino rosas en un solo lugar'],
    hints:['teams','matchcenter','hero'],
    phase:2.05
  },
  {
    id:'experience',
    keys:['tu liga, mas viva e interactiva','tu liga, más viva e interactiva'],
    hints:['matchday','matchcenter','hero'],
    phase:2.70
  }
];

let sources=[];
let groups=[];
let pool=[];
let io=null;
let timer=0;
let sourceUsed=new Set();
let lastPoolKey='';

const FPS=mobile?3:4;
const POOL_SIZE=mobile?1:2;

function norm(v){
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ')
    .trim().toLowerCase();
}

function buildRefresh(){
  try{
    const old=localStorage.getItem('jr53-build');
    localStorage.setItem('jr53-build',BUILD);

    if(old!==BUILD&&'caches'in window){
      caches.keys()
        .then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
        .catch(()=>{});
    }

    if(navigator.serviceWorker){
      navigator.serviceWorker.getRegistrations()
        .then(rs=>rs.forEach(r=>r.update()))
        .catch(()=>{});
    }
  }catch(_){}

  addEventListener('pageshow',e=>{
    if(e.persisted)location.reload();
  });
}

function getSources(){
  const list=Array.isArray(window.__JR53MotionSources)
    ?window.__JR53MotionSources
    :[];

  const seen=new Set();

  return list.filter(s=>{
    if(!s||!s.src)return false;
    if(/atlas/i.test(s.src))return false;

    const key=s.hash||s.src;
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  });
}

function score(src,hints){
  const n=norm((src.name||'')+' '+(src.src||''));
  let total=0;

  hints.forEach((hint,i)=>{
    if(n.includes(norm(hint)))total+=30-(i*4);
  });

  /* Evitar otra vez cinco fondos de balón seguidos. */
  if(/ball|balon/.test(n))total-=12;

  /* Clips ya orientados a secciones tienen prioridad. */
  if(/emirates|matchcenter|teams|community|matchday|field|tactics/.test(n))total+=4;

  return total;
}

function pickSource(def,index){
  if(!sources.length)return null;

  const ranked=sources
    .map(s=>({s,score:score(s,def.hints)}))
    .sort((a,b)=>b.score-a.score || (a.s.bytes||0)-(b.s.bytes||0));

  let found=ranked.find(x=>!sourceUsed.has(x.s.hash||x.s.src));

  if(!found){
    /* Sólo cuando se agotaron las fuentes únicas permitimos reutilizar. */
    sourceUsed.clear();
    found=ranked[index%ranked.length];
  }

  sourceUsed.add(found.s.hash||found.s.src);
  return found.s;
}

function headingFor(def){
  const nodes=qa(
    'h1,h2,h3,h4,'+
    '[class*="title"],[class*="heading"],[class*="headline"],'+
    '[class*="section-label"],[class*="eyebrow"]'
  );

  return nodes.find(node=>{
    const t=norm(node.textContent);
    return def.keys.some(k=>t.includes(norm(k)));
  })||null;
}

function rootFor(node){
  if(!node)return null;

  const preferred=node.closest(
    'section,.section,.panel,.glass-card,'+
    '[class*="section"],[class*="experience"],'+
    '[class*="access"],[class*="master"],[class*="community"]'
  );

  if(preferred){
    const r=preferred.getBoundingClientRect();
    if(r.width>300&&r.height>85)return preferred;
  }

  let el=node.parentElement;

  for(let depth=0;depth<6&&el;depth++,el=el.parentElement){
    const r=el.getBoundingClientRect();

    if(
      r.width>Math.min(560,innerWidth*.52) &&
      r.height>90 &&
      r.height<innerHeight*1.75
    ){
      return el;
    }
  }

  return node.parentElement;
}

function createGroup(def,index){
  const heading=headingFor(def);
  if(!heading)return null;

  const root=rootFor(heading);
  if(!root||root.dataset.jr53Target)return null;

  const src=pickSource(def,index);
  if(!src)return null;

  root.dataset.jr53Target=def.id;
  root.dataset.jr53Source=src.src;
  root.classList.add('jr53-target-motion');

  const canvas=document.createElement('canvas');
  canvas.className='jr53-bg-canvas';
  canvas.setAttribute('aria-hidden','true');

  const shade=document.createElement('span');
  shade.className='jr53-bg-shade';
  shade.setAttribute('aria-hidden','true');

  root.insertBefore(shade,root.firstChild);
  root.insertBefore(canvas,root.firstChild);

  return {
    id:def.id,
    index,
    phase:def.phase,
    root,
    canvas,
    src,
    ratio:0,
    assigned:-1,
    drawn:false
  };
}

function createPool(){
  const host=document.createElement('div');
  host.id='jr53DecoderPool';

  Object.assign(host.style,{
    position:'fixed',
    width:'2px',
    height:'2px',
    left:'-20px',
    top:'-20px',
    overflow:'hidden',
    opacity:'.001',
    pointerEvents:'none',
    zIndex:'-99999'
  });

  for(let i=0;i<POOL_SIZE;i++){
    const video=document.createElement('video');

    video.muted=true;
    video.loop=true;
    video.playsInline=true;
    video.preload='metadata';

    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('aria-hidden','true');

    host.appendChild(video);

    pool.push({
      video,
      src:'',
      group:null
    });
  }

  document.body.appendChild(host);
}

function groupDistance(g){
  const r=g.root.getBoundingClientRect();
  return Math.abs(((r.top+r.bottom)/2)-(innerHeight/2));
}

function selectGroups(){
  if(reduced.matches||saveData||!pool.length)return;

  const active=groups
    .filter(g=>g.ratio>.01&&g.root.isConnected)
    .sort((a,b)=>
      (b.ratio-a.ratio) ||
      (groupDistance(a)-groupDistance(b))
    )
    .slice(0,POOL_SIZE);

  const key=active.map(g=>g.id).join('|');
  if(key===lastPoolKey)return;
  lastPoolKey=key;

  groups.forEach(g=>g.assigned=-1);

  pool.forEach((slot,i)=>{
    const group=active[i]||null;
    slot.group=group;

    if(!group){
      try{slot.video.pause()}catch(_){}
      return;
    }

    group.assigned=i;

    if(slot.src!==group.src.src){
      slot.src=group.src.src;
      try{slot.video.pause()}catch(_){}
      slot.video.src=group.src.src;
      slot.video.load();
    }

    if(!document.hidden){
      const p=slot.video.play();
      if(p&&p.catch)p.catch(()=>{});
    }
  });
}

function ensureCanvas(g){
  const r=g.root.getBoundingClientRect();

  /* Resolución deliberadamente baja: es fondo atmosférico,
     no contenido primario. */
  const maxW=mobile?300:500;
  const scale=Math.min(1,maxW/Math.max(1,r.width));

  const w=Math.max(180,Math.round(r.width*scale));
  const h=Math.max(92,Math.round(r.height*scale));

  if(g.canvas.width!==w||g.canvas.height!==h){
    g.canvas.width=w;
    g.canvas.height=h;
  }

  return {w,h};
}

function crop(video,ratio,phase,t){
  const vw=video.videoWidth||1280;
  const vh=video.videoHeight||720;
  const srcRatio=vw/vh;

  let sx=0,sy=0,sw=vw,sh=vh;

  if(ratio>srcRatio){
    sh=vw/ratio;
    const room=vh-sh;
    sy=room*(.50+.10*Math.sin(t/5200+phase));
  }else{
    sw=vh*ratio;
    const room=vw-sw;
    sx=room*(.50+.11*Math.cos(t/5600+phase));
  }

  return [sx,sy,sw,sh];
}

function drawGroup(g,t){
  if(g.assigned<0)return;

  const slot=pool[g.assigned];
  const video=slot&&slot.video;

  if(!video||video.readyState<2)return;

  const {w,h}=ensureCanvas(g);
  const ctx=g.canvas.getContext('2d',{alpha:false});
  const source=crop(video,w/h,g.phase,t);

  try{
    ctx.save();
    ctx.clearRect(0,0,w,h);

    /* Alternar espejo ayuda a que dos clips similares no parezcan clones,
       sin cambiar el diseño del bloque. */
    if(g.index%2){
      ctx.translate(w,0);
      ctx.scale(-1,1);
    }

    ctx.drawImage(video,...source,0,0,w,h);
    ctx.restore();

    if(!g.drawn){
      g.drawn=true;
      g.root.classList.add('jr53-has-frame');
    }
  }catch(_){}
}

function tick(){
  try{
    if(!document.hidden&&!reduced.matches&&!saveData){
      const now=performance.now();
      groups.forEach(g=>{
        if(g.assigned>=0)drawGroup(g,now);
      });
    }
  }finally{
    clearTimeout(timer);
    timer=setTimeout(tick,Math.round(1000/FPS));
  }
}

function setupObserver(){
  io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const g=groups.find(x=>x.root===entry.target);
      if(g){
        g.ratio=entry.isIntersecting
          ?entry.intersectionRatio
          :0;
      }
    });

    selectGroups();
  },{
    threshold:[0,.01,.10,.22,.45,.70],
    rootMargin:'120px 0px'
  });

  groups.forEach(g=>io.observe(g.root));
}

function optimizeStartup(){
  /* FIX16 ya existe y se conserva. Sólo reducimos su impacto durante
     el primer render; después lo reanudamos. */
  const atlas=q('#jr48Atlas');

  if(atlas){
    try{atlas.pause()}catch(_){}
    atlas.preload='metadata';

    setTimeout(()=>{
      if(document.hidden||reduced.matches||saveData)return;

      const p=atlas.play();
      if(p&&p.catch)p.catch(()=>{});
    },mobile?900:650);
  }

  /* Videos no visibles con preload agresivo pasan a metadata.
     No tocamos videos con controles ni el video visible de Gran Final. */
  qa('video:not([controls])').forEach(v=>{
    if(v.id==='jr48Atlas')return;
    const r=v.getBoundingClientRect();

    if(r.bottom<0||r.top>innerHeight*1.5){
      v.preload='metadata';
    }
  });
}

function visibility(){
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      pool.forEach(s=>{
        try{s.video.pause()}catch(_){}
      });
    }else{
      selectGroups();

      pool.forEach(s=>{
        if(!s.group)return;
        const p=s.video.play();
        if(p&&p.catch)p.catch(()=>{});
      });
    }
  });
}

function recalc(){
  setTimeout(()=>{
    groups.forEach(g=>{
      const r=g.root.getBoundingClientRect();

      if(r.bottom<=0||r.top>=innerHeight){
        g.ratio=0;
        return;
      }

      const visible=Math.max(
        0,
        Math.min(r.bottom,innerHeight)-Math.max(r.top,0)
      );

      g.ratio=Math.min(1,visible/Math.max(1,r.height));
    });

    selectGroups();
  },140);
}

function hookNavigation(){
  addEventListener('hashchange',recalc,{passive:true});

  document.addEventListener('click',e=>{
    if(e.target.closest(
      '[data-view],button,a,[role="button"],.bottom-nav,.topbar'
    )){
      recalc();
    }
  },{passive:true});

  addEventListener('resize',recalc,{passive:true});
}

function start(){
  if(reduced.matches||saveData){
    document.body.classList.add('jr53-save','jr53-motion-ready');
    return;
  }

  sources=getSources();

  if(!sources.length){
    document.body.classList.add('jr53-motion-ready');
    return;
  }

  sourceUsed.clear();

  TARGETS.forEach((def,index)=>{
    const g=createGroup(def,index);
    if(g)groups.push(g);
  });

  createPool();
  setupObserver();
  visibility();
  hookNavigation();
  optimizeStartup();

  document.body.classList.add('jr53-motion-ready');

  selectGroups();

  clearTimeout(timer);
  timer=setTimeout(tick,Math.round(1000/FPS));
}

function init(){
  document.body.classList.add('jr53-fix21');
  buildRefresh();

  /* El sitio pinta primero. FIX21 entra después en idle. */
  const launch=()=>start();

  if('requestIdleCallback' in window){
    requestIdleCallback(launch,{timeout:mobile?1350:900});
  }else{
    setTimeout(launch,mobile?850:600);
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init,{once:true});
}else{
  init();
}
})();
