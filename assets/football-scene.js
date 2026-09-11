(function(){
"use strict";

const VERSION="36.3";
const CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();

function toast(text){
  if(typeof window.showToast==="function"){try{window.showToast(text);return}catch(_){}}
  if(typeof window.toast==="function"){try{window.toast(text);return}catch(_){}}
  const el=document.createElement("div");
  el.textContent=text;
  Object.assign(el.style,{position:"fixed",left:"50%",bottom:"110px",transform:"translateX(-50%)",zIndex:"150000",padding:"10px 13px",borderRadius:"12px",background:"#132219",color:"#fff",font:"700 12px system-ui",boxShadow:"0 10px 30px rgba(0,0,0,.38)"});
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}

function go(view){
  const destination=view==="match"?"matchcenter":view;
  const target=document.getElementById("view-"+destination);
  if(!target){toast("Sección no disponible.");return false;}
  if(typeof window.showView==="function"){
    try{window.showView(destination);return true;}catch(_){}
  }
  const control=qa("[data-view]").find(el=>norm(el.dataset.view)===norm(destination));
  if(control){try{control.click();return true;}catch(_){} }
  target.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
}

function activateCategory(cat){
  try{localStorage.setItem("jrCategory",cat)}catch(_){ }
  qa(".categoryText").forEach(el=>el.textContent=cat);
  const control=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(el=>{
    const value=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat||"";
    return norm(value)===norm(cat);
  });
  if(control){try{control.click();}catch(_){} }
  setTimeout(()=>{go("matches");toast("Categoría: "+cat);},80);
}

function categoriesModal(){
  let bg=q("#jrV363Categories");
  if(!bg){
    bg=document.createElement("div");
    bg.id="jrV363Categories";
    bg.className="jr-v363-cat-bg";
    bg.innerHTML=`<section class="jr-v363-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV363CatTitle">
      <div class="jr-v363-cat-head"><h3 id="jrV363CatTitle">5 categorías</h3><button class="jr-v363-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="jr-v363-cat-list">${CATS.map(c=>`<button type="button" class="jr-v363-cat" data-jr-v363-cat="${c}">${c}<small>Abrir partidos de esta categoría</small></button>`).join("")}</div>
    </section>`;
    document.body.appendChild(bg);
    q(".jr-v363-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show");};
    qa("[data-jr-v363-cat]",bg).forEach(btn=>btn.onclick=()=>{bg.classList.remove("show");activateCategory(btn.dataset.jrV363Cat);});
  }
  bg.classList.add("show");
}

function openLiguilla(){
  if(go("cup"))return;
  const bracket=q(".bracket-inner");
  if(bracket){bracket.scrollIntoView({behavior:"smooth",block:"center"});return;}
  toast("La liguilla no está disponible en esta vista.");
}

function actionFromText(text){
  const t=norm(text);
  if(t.includes("5 categorias"))return"cats";
  if(t.includes("live match center")||t==="match center"||t.includes("abrir match center"))return"match";
  if(t.includes("jr matchday"))return"matchday";
  if(t==="jornada"||t.includes("ver jornada"))return"jornada";
  if(t==="liguilla"||t.includes("ver liguilla"))return"cup";
  return"";
}

function runAction(action){
  if(action==="cats")categoriesModal();
  else if(action==="match")go("matchcenter");
  else if(action==="matchday"||action==="jornada")go("matches");
  else if(action==="cup")openLiguilla();
}

function bindControl(el,action){
  if(!el||el.dataset.jrV363Bound==="1")return;
  el.dataset.jrV363Bound="1";
  if(!["BUTTON","A"].includes(el.tagName)){
    el.setAttribute("role","button");
    el.tabIndex=0;
    el.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();runAction(action);}
    });
  }
  el.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();runAction(action);});
}

function wireControls(){
  const hero=q("#v14CinematicHero");
  if(!hero)return;
  qa(".v14-chip,.v14-actions button,button,a,[role='button']",hero).forEach(el=>{
    const action=actionFromText(el.textContent||"");
    if(action)bindControl(el,action);
  });
}

function ensureSecondSection(){
  const hero=q("#v14CinematicHero");
  if(!hero)return null;
  let section=q("#jrV363SecondBall");
  if(section)return section;
  q("#jrV362SecondBall")?.remove();
  section=document.createElement("section");
  section.id="jrV363SecondBall";
  section.innerHTML=`<div class="jr-v363-second-copy"><div class="eyebrow">SEGUNDO BALÓN · GRAFITO / ORO</div><h3>Dos estilos, una misma liga.</h3><p>El segundo balón usa un acabado oscuro con paneles dorados y movimiento propio.</p></div><div class="jr-v363-second-stage" id="jrV363SecondStage"></div><div class="jr-v363-second-tags"><span class="jr-v363-tag">Arrastra</span><span class="jr-v363-tag">Toca para patear</span><span class="jr-v363-tag">32 paneles</span></div>`;
  hero.insertAdjacentElement("afterend",section);
  return section;
}

function loadThree(){
  if(window.THREE&&window.THREE.WebGLRenderer)return Promise.resolve(window.THREE);
  return new Promise((resolve,reject)=>{
    let script=q('script[data-jr-v363-three]');
    if(script){
      script.addEventListener("load",()=>resolve(window.THREE),{once:true});
      script.addEventListener("error",reject,{once:true});
      return;
    }
    script=document.createElement("script");
    script.dataset.jrV363Three="1";
    script.src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
    script.async=true;
    script.onload=()=>window.THREE?resolve(window.THREE):reject(new Error("THREE no disponible"));
    script.onerror=reject;
    document.head.appendChild(script);
  });
}

const ICO_FACES=[
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
];

function icoVertices(THREE){
  const t=(1+Math.sqrt(5))/2;
  return [
    [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
    [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
    [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
  ].map(v=>new THREE.Vector3(v[0],v[1],v[2]).normalize());
}

function orientPolygon(THREE,points){
  if(points.length<3)return points;
  const center=points.reduce((acc,p)=>acc.add(p),new THREE.Vector3()).multiplyScalar(1/points.length);
  const a=points[1].clone().sub(points[0]);
  const b=points[2].clone().sub(points[1]);
  const n=new THREE.Vector3().crossVectors(a,b);
  if(n.dot(center)<0)points.reverse();
  return points;
}

function faceGeometry(THREE,points,radius){
  const pts=points.map(p=>p.clone());
  orientPolygon(THREE,pts);
  const center=pts.reduce((acc,p)=>acc.add(p),new THREE.Vector3()).multiplyScalar(1/pts.length).normalize().multiplyScalar(radius*1.0007);
  const positions=[];
  for(let i=0;i<pts.length;i++){
    const p1=pts[i],p2=pts[(i+1)%pts.length];
    positions.push(center.x,center.y,center.z,p1.x,p1.y,p1.z,p2.x,p2.y,p2.z);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
  geometry.computeVertexNormals();
  return geometry;
}

function seamLoop(THREE,points,color,opacity){
  const pts=points.concat([points[0]]);
  const g=new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
}

function makeClassicBall(THREE,opts){
  const group=new THREE.Group();
  const radius=1.46;
  const vertices=icoVertices(THREE);
  const directed=new Map();
  const dpoint=(a,b)=>{
    const key=a+":"+b;
    if(directed.has(key))return directed.get(key).clone();
    const p=vertices[a].clone().multiplyScalar(2).add(vertices[b]).multiplyScalar(1/3).normalize().multiplyScalar(radius);
    directed.set(key,p.clone());
    return p;
  };

  const shell=new THREE.Mesh(
    new THREE.SphereGeometry(radius-.018,64,48),
    new THREE.MeshPhysicalMaterial({color:opts.shell,roughness:.34,metalness:.02,clearcoat:.38,clearcoatRoughness:.34})
  );
  shell.castShadow=true;
  shell.receiveShadow=true;
  group.add(shell);

  const pentMat=new THREE.MeshPhysicalMaterial({color:opts.pentagon,roughness:.48,metalness:.04,clearcoat:.24,clearcoatRoughness:.42,side:THREE.DoubleSide});
  const hexMat=new THREE.MeshPhysicalMaterial({color:opts.hexagon,roughness:.38,metalness:.03,clearcoat:.34,clearcoatRoughness:.38,side:THREE.DoubleSide});

  const neighbors=Array.from({length:12},()=>new Set());
  ICO_FACES.forEach(([a,b,c])=>{
    neighbors[a].add(b);neighbors[a].add(c);
    neighbors[b].add(a);neighbors[b].add(c);
    neighbors[c].add(a);neighbors[c].add(b);
  });

  for(let i=0;i<12;i++){
    const normal=vertices[i].clone().normalize();
    const ref=Math.abs(normal.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
    const u=new THREE.Vector3().crossVectors(ref,normal).normalize();
    const v=new THREE.Vector3().crossVectors(normal,u).normalize();
    const ordered=[...neighbors[i]].sort((a,b)=>{
      const pa=dpoint(i,a).clone().normalize().sub(normal.clone().multiplyScalar(dpoint(i,a).clone().normalize().dot(normal)));
      const pb=dpoint(i,b).clone().normalize().sub(normal.clone().multiplyScalar(dpoint(i,b).clone().normalize().dot(normal)));
      return Math.atan2(pa.dot(v),pa.dot(u))-Math.atan2(pb.dot(v),pb.dot(u));
    });
    const points=ordered.map(j=>dpoint(i,j));
    orientPolygon(THREE,points);
    const face=new THREE.Mesh(faceGeometry(THREE,points,radius),pentMat);
    face.castShadow=true;
    group.add(face);
    group.add(seamLoop(THREE,points,opts.seam,.52));
  }

  ICO_FACES.forEach(([a,b,c])=>{
    const points=[dpoint(a,b),dpoint(b,a),dpoint(b,c),dpoint(c,b),dpoint(c,a),dpoint(a,c)];
    orientPolygon(THREE,points);
    const face=new THREE.Mesh(faceGeometry(THREE,points,radius),hexMat);
    face.castShadow=true;
    group.add(face);
    group.add(seamLoop(THREE,points,opts.seam,.34));
  });

  return group;
}

function makeFallback(stage,opts){
  const canvas=document.createElement("canvas");
  canvas.className="jr-v363-canvas";
  stage.appendChild(canvas);
  const ctx=canvas.getContext("2d");
  let w=1,h=1,dpr=1,angle=0,visible=true;
  function resize(){
    const r=stage.getBoundingClientRect();
    w=Math.max(280,r.width);h=Math.max(330,r.height);dpr=Math.min(devicePixelRatio||1,1.25);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function pent(cx,cy,r,a){
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const t=a-Math.PI/2+i*Math.PI*2/5,x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();ctx.fill();
  }
  function draw(){
    requestAnimationFrame(draw);
    if(!visible||document.hidden)return;
    ctx.clearRect(0,0,w,h);
    const R=Math.min(w,h)*(opts.fallbackScale||.22),cx=w*(opts.fallbackX||.62),cy=h*(opts.fallbackY||.52);
    const glow=ctx.createRadialGradient(cx,cy,4,cx,cy,R*1.75);glow.addColorStop(0,opts.glow);glow.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const g=ctx.createRadialGradient(cx-R*.36,cy-R*.40,R*.03,cx,cy,R);g.addColorStop(0,"#fff");g.addColorStop(.48,opts.base2d);g.addColorStop(1,opts.edge2d);ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.translate(-cx,-cy);ctx.fillStyle=opts.patch2d;
    pent(cx,cy,R*.20,0);[[.47,-.25],[-.46,-.24],[.34,.43],[-.34,.44]].forEach(([a,b],i)=>pent(cx+a*R,cy+b*R,R*.14,i*.45));
    ctx.restore();angle+=(opts.spin||.006);
  }
  if("IntersectionObserver"in window)new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;},{threshold:.03}).observe(stage);
  resize();window.addEventListener("resize",resize,{passive:true});draw();
}

async function buildScene(stage,opts){
  if(!stage||stage.dataset.jrV363Scene==="1")return null;
  stage.dataset.jrV363Scene="1";
  let THREE;
  try{THREE=await loadThree();}catch(_){makeFallback(stage,opts);return null;}

  const canvas=document.createElement("canvas");
  canvas.className="jr-v363-canvas";
  canvas.id=opts.canvasId;
  canvas.setAttribute("aria-label",opts.aria);
  stage.appendChild(canvas);

  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
  }catch(_){canvas.remove();makeFallback(stage,opts);return null;}

  renderer.setClearColor(0x000000,0);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  if("outputEncoding"in renderer&&THREE.sRGBEncoding)renderer.outputEncoding=THREE.sRGBEncoding;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,1,.1,100);
  const root=new THREE.Group();
  const ball=makeClassicBall(THREE,opts);
  root.add(ball);
  scene.add(root);

  scene.add(new THREE.HemisphereLight(opts.hemiTop,opts.hemiBottom,1.10));
  const key=new THREE.DirectionalLight(0xffffff,2.0);key.position.set(-3.5,4.8,5.8);key.castShadow=true;scene.add(key);
  const fill=new THREE.PointLight(opts.accent1,1.10,14);fill.position.set(3.4,-.7,3.4);scene.add(fill);
  const rim=new THREE.PointLight(opts.accent2,.75,12);rim.position.set(-3.0,1.8,-2.2);scene.add(rim);

  const haloMat1=new THREE.MeshBasicMaterial({color:opts.accent1,transparent:true,opacity:.18,depthWrite:false});
  const halo1=new THREE.Mesh(new THREE.TorusGeometry(2.20,.015,8,96),haloMat1);halo1.position.z=-1.15;halo1.rotation.x=1.24;halo1.rotation.z=.15;root.add(halo1);
  const haloMat2=new THREE.MeshBasicMaterial({color:opts.accent2,transparent:true,opacity:.12,depthWrite:false});
  const halo2=new THREE.Mesh(new THREE.TorusGeometry(1.95,.010,8,96),haloMat2);halo2.position.z=-1.10;halo2.rotation.x=.95;halo2.rotation.y=.40;root.add(halo2);

  if(opts.ground){
    const ground=new THREE.Mesh(new THREE.CircleGeometry(2.25,64),new THREE.ShadowMaterial({color:0x000000,opacity:.28}));
    ground.rotation.x=-Math.PI/2;ground.position.set(0,-1.72,.10);ground.receiveShadow=true;root.add(ground);
  }

  let drag=false,downX=0,downY=0,lastX=0,lastY=0;
  let targetX=opts.rotationX||-.15,targetY=opts.rotationY||.30;
  let kickStart=0,spinBoost=0,visible=true,last=performance.now();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize(){
    const r=stage.getBoundingClientRect();
    const w=Math.max(280,r.width),h=Math.max(330,r.height);
    const mobile=matchMedia("(max-width:760px)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.0:1.35));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.position.set(0,0,mobile?(opts.mobileZ||10.8):(opts.desktopZ||8.8));
    camera.updateProjectionMatrix();
    root.scale.setScalar(mobile?(opts.mobileScale||.88):(opts.desktopScale||.96));
    root.position.x=mobile?(opts.mobileX||.28):(opts.desktopX||.48);
    root.position.y=opts.baseY||0;
  }

  canvas.addEventListener("pointerdown",e=>{
    drag=true;downX=lastX=e.clientX;downY=lastY=e.clientY;
    try{canvas.setPointerCapture(e.pointerId);}catch(_){}
  });
  canvas.addEventListener("pointermove",e=>{
    if(drag){
      targetY+=(e.clientX-lastX)*.007;
      targetX+=(e.clientY-lastY)*.0055;
      targetX=Math.max(-1.0,Math.min(1.0,targetX));
      lastX=e.clientX;lastY=e.clientY;
    }
  });
  function endPointer(e){
    if(!drag)return;
    drag=false;
    if(Math.hypot(e.clientX-downX,e.clientY-downY)<10&&!reduced){kickStart=performance.now();spinBoost=1.0;}
  }
  canvas.addEventListener("pointerup",endPointer);
  canvas.addEventListener("pointercancel",()=>drag=false);

  if("IntersectionObserver"in window)new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;},{threshold:.03}).observe(stage);
  if("ResizeObserver"in window)new ResizeObserver(resize).observe(stage);else window.addEventListener("resize",resize,{passive:true});

  function animate(now){
    requestAnimationFrame(animate);
    if(document.hidden||!visible)return;
    const dt=Math.min(.04,(now-last)/1000||.016);last=now;
    ball.rotation.x+=(targetX-ball.rotation.x)*Math.min(1,dt*6);
    ball.rotation.y+=(targetY-ball.rotation.y)*Math.min(1,dt*6);
    if(!drag&&!reduced){targetY+=dt*(opts.autoSpin||.12);halo1.rotation.z+=dt*.04;halo2.rotation.z-=dt*.035;}
    if(spinBoost>0){targetY+=dt*spinBoost*2.0;spinBoost=Math.max(0,spinBoost-dt*1.7);}
    if(!reduced){
      if(opts.ground){root.position.x=(matchMedia("(max-width:760px)").matches?(opts.mobileX||.28):(opts.desktopX||.48))+Math.sin(now*.00065)*.07;ball.rotation.z+=dt*.07;}
      else{root.position.y=(opts.baseY||0)+Math.sin(now*.0014)*.055;}
    }
    if(kickStart){
      const t=(now-kickStart)/820;
      if(t<1){
        const arc=Math.sin(Math.PI*t);
        ball.position.y=arc*(opts.ground?.22:.48);
        ball.position.z=arc*.30;
        ball.scale.setScalar(1+arc*.035);
      }else{kickStart=0;ball.position.set(0,0,0);ball.scale.setScalar(1);}
    }
    renderer.render(scene,camera);
  }

  resize();requestAnimationFrame(animate);
  return{renderer,scene,camera,ball,root};
}

async function buildBoth(){
  const heroStage=q("#v14CinematicHero .v14-stage");
  if(heroStage&&!heroStage.dataset.jrV363Scene){
    q("#jrV14Canvas",heroStage)?.setAttribute("aria-hidden","true");
    q("#jrAstraFootballScene",heroStage)?.setAttribute("aria-hidden","true");
    if(!q(".jr-v363-tip",heroStage)){
      const tip=document.createElement("div");tip.className="jr-v363-tip";tip.textContent="Arrastra el balón · toca para patear";heroStage.appendChild(tip);
    }
    await buildScene(heroStage,{
      canvasId:"jrV363TopBall",aria:"Balón clásico 3D verde y cian",
      shell:0xf2f4f1,hexagon:0xf6f7f5,pentagon:0x111815,seam:0x4e5a54,
      accent1:0x45ed91,accent2:0x4cc9ff,hemiTop:0xf6fff9,hemiBottom:0x07100c,
      autoSpin:.11,mobileZ:10.9,desktopZ:8.9,mobileScale:.86,desktopScale:.96,
      mobileX:.26,desktopX:.48,baseY:.04,
      fallbackScale:.22,fallbackX:.60,fallbackY:.52,base2d:"#e3e7e4",edge2d:"#7f8b84",patch2d:"#111815",glow:"rgba(69,237,145,.16)",spin:.006
    });
  }

  ensureSecondSection();
  const lower=q("#jrV363SecondStage");
  if(lower&&!lower.dataset.jrV363Scene){
    await buildScene(lower,{
      canvasId:"jrV363BottomBall",aria:"Balón grafito y dorado 3D",
      shell:0x343a38,hexagon:0x555d59,pentagon:0xd0a13a,seam:0x161b18,
      accent1:0xf2c14e,accent2:0x45ed91,hemiTop:0xffedb0,hemiBottom:0x080b09,
      autoSpin:-.09,mobileZ:11.3,desktopZ:9.3,mobileScale:.82,desktopScale:.90,
      mobileX:.42,desktopX:.78,baseY:.16,rotationX:-.08,rotationY:-.25,ground:true,
      fallbackScale:.20,fallbackX:.67,fallbackY:.58,base2d:"#565d59",edge2d:"#252a28",patch2d:"#d0a13a",glow:"rgba(242,193,78,.16)",spin:-.005
    });
  }
}

function boot(){
  q("#jrV362SecondBall")?.remove();
  wireControls();
  buildBoth();
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-view],[data-category],[data-v20-cat],[data-v21-cat]")){
      setTimeout(()=>{wireControls();buildBoth();},180);
    }
  },true);
  window.addEventListener("pageshow",()=>setTimeout(()=>{wireControls();buildBoth();},100));
  window.LJR_V363={version:VERSION,categoriesModal,go,rebuild:buildBoth};
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
