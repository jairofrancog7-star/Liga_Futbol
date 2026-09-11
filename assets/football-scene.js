(function(){
"use strict";

const VERSION="36.2";
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
  if(control){try{control.click();return true;}catch(_){}}
  target.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
}

function activateCategory(cat){
  try{localStorage.setItem("jrCategory",cat)}catch(_){}
  qa(".categoryText").forEach(el=>el.textContent=cat);
  const control=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(el=>{
    const value=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat||"";
    return norm(value)===norm(cat);
  });
  if(control){try{control.click();}catch(_){}}
  setTimeout(()=>{go("matches");toast("Categoría: "+cat);},80);
}

function categoriesModal(){
  let bg=q("#jrV362Categories");
  if(!bg){
    bg=document.createElement("div");
    bg.id="jrV362Categories";
    bg.className="jr-v362-cat-bg";
    bg.innerHTML=`<section class="jr-v362-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV362CatTitle">
      <div class="jr-v362-cat-head"><h3 id="jrV362CatTitle">5 categorías</h3><button class="jr-v362-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="jr-v362-cat-list">${CATS.map(c=>`<button type="button" class="jr-v362-cat" data-jr-v362-cat="${c}">${c}<small>Abrir partidos de esta categoría</small></button>`).join("")}</div>
    </section>`;
    document.body.appendChild(bg);
    q(".jr-v362-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show");};
    qa("[data-jr-v362-cat]",bg).forEach(btn=>btn.onclick=()=>{bg.classList.remove("show");activateCategory(btn.dataset.jrV362Cat);});
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
  if(!el||el.dataset.jrV362Bound==="1")return;
  el.dataset.jrV362Bound="1";
  el.dataset.jrV362Action=action;
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
  if(!hero||q("#jrV362SecondBall"))return q("#jrV362SecondBall");
  const section=document.createElement("section");
  section.id="jrV362SecondBall";
  section.innerHTML=`<div class="jr-v362-second-copy"><div class="eyebrow">SEGUNDO DISEÑO · ORO / VERDE</div><h3>El fútbol sigue aquí.</h3><p>Un segundo balón con identidad distinta, movimiento propio y acabado cinematográfico.</p></div><div class="jr-v362-second-stage" id="jrV362SecondStage"></div><div class="jr-v362-second-tags"><span class="jr-v362-tag">Arrastra</span><span class="jr-v362-tag">Toca para girar</span><span class="jr-v362-tag">Diseño 3D</span></div>`;
  hero.insertAdjacentElement("afterend",section);
  return section;
}

function loadThree(){
  if(window.THREE&&window.THREE.WebGLRenderer)return Promise.resolve(window.THREE);
  return new Promise((resolve,reject)=>{
    let script=q('script[data-jr-v362-three]');
    if(script){
      script.addEventListener("load",()=>resolve(window.THREE),{once:true});
      script.addEventListener("error",reject,{once:true});
      return;
    }
    script=document.createElement("script");
    script.dataset.jrV362Three="1";
    script.src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
    script.async=true;
    script.onload=()=>window.THREE?resolve(window.THREE):reject(new Error("THREE no disponible"));
    script.onerror=reject;
    document.head.appendChild(script);
  });
}

function footballDirections(THREE){
  const p=(1+Math.sqrt(5))/2;
  return [[0,1,p],[0,-1,p],[0,1,-p],[0,-1,-p],[1,p,0],[-1,p,0],[1,-p,0],[-1,-p,0],[p,0,1],[-p,0,1],[p,0,-1],[-p,0,-1]].map(v=>new THREE.Vector3(v[0],v[1],v[2]).normalize());
}

function labelTexture(THREE,text,color){
  const c=document.createElement("canvas");
  c.width=256;c.height=256;
  const ctx=c.getContext("2d");
  ctx.clearRect(0,0,256,256);
  ctx.fillStyle=color;
  ctx.font="900 96px system-ui";
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.fillText(text,128,132);
  const t=new THREE.CanvasTexture(c);
  t.needsUpdate=true;
  return t;
}

function addJRBadge(THREE,ball,color){
  const tex=labelTexture(THREE,"JR",color);
  const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(.44,.44),mat);
  plane.position.set(0,0,1.535);
  ball.add(plane);
}

function makeBall(THREE,opts){
  const ball=new THREE.Group();
  const shell=new THREE.Mesh(new THREE.SphereGeometry(1.50,64,48),new THREE.MeshPhysicalMaterial({color:opts.base,roughness:opts.roughness||.32,metalness:opts.metalness||.04,clearcoat:.48,clearcoatRoughness:.30}));
  shell.castShadow=true;shell.receiveShadow=true;ball.add(shell);
  const zAxis=new THREE.Vector3(0,0,1);
  const patchMat=new THREE.MeshStandardMaterial({color:opts.patch,roughness:.42,metalness:.03,side:THREE.DoubleSide});
  footballDirections(THREE).forEach((dir,i)=>{
    const geo=new THREE.CircleGeometry(.305,5);geo.rotateZ((i%5)*.16);
    const patch=new THREE.Mesh(geo,patchMat);
    patch.position.copy(dir).multiplyScalar(1.515);
    patch.quaternion.setFromUnitVectors(zAxis,dir);
    patch.castShadow=true;ball.add(patch);
  });
  ball.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.522,2)),new THREE.LineBasicMaterial({color:opts.seam,transparent:true,opacity:.11})));
  addJRBadge(THREE,ball,opts.badge);
  return ball;
}

function makeFallback(stage,opts){
  const canvas=document.createElement("canvas");
  canvas.className="jr-v362-canvas";
  stage.appendChild(canvas);
  const ctx=canvas.getContext("2d");
  let w=1,h=1,dpr=1,angle=0,visible=true;
  function resize(){const r=stage.getBoundingClientRect();w=Math.max(280,r.width);h=Math.max(330,r.height);dpr=Math.min(devicePixelRatio||1,1.4);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  function pent(cx,cy,r,a){ctx.beginPath();for(let i=0;i<5;i++){const t=a-Math.PI/2+i*Math.PI*2/5,x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.fill();}
  function draw(){requestAnimationFrame(draw);if(!visible||document.hidden)return;ctx.clearRect(0,0,w,h);const R=Math.min(w,h)*(opts.fallbackScale||.27),cx=w*(opts.fallbackX||.58),cy=h*(opts.fallbackY||.52);const glow=ctx.createRadialGradient(cx,cy,8,cx,cy,R*1.65);glow.addColorStop(0,opts.glow);glow.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);const g=ctx.createRadialGradient(cx-R*.36,cy-R*.42,R*.04,cx,cy,R);g.addColorStop(0,"#fff");g.addColorStop(.50,opts.base2d);g.addColorStop(1,opts.edge2d);ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.translate(-cx,-cy);ctx.fillStyle=opts.patch2d;pent(cx,cy,R*.22,0);[[.47,-.24],[-.45,-.27],[.33,.44],[-.34,.45]].forEach(([a,b],i)=>pent(cx+a*R,cy+b*R,R*.15,i*.5));ctx.restore();angle+=(opts.spin||.008);}
  if("IntersectionObserver"in window)new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;},{threshold:.03}).observe(stage);
  resize();window.addEventListener("resize",resize,{passive:true});draw();
}

async function buildScene(stage,opts){
  if(!stage||stage.dataset.jrV362Scene==="1")return null;
  stage.dataset.jrV362Scene="1";
  let THREE;
  try{THREE=await loadThree();}catch(_){makeFallback(stage,opts);return null;}
  const canvas=document.createElement("canvas");canvas.className="jr-v362-canvas";canvas.id=opts.canvasId;canvas.setAttribute("aria-label",opts.aria);stage.appendChild(canvas);
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});}catch(_){canvas.remove();makeFallback(stage,opts);return null;}
  renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;if("outputEncoding"in renderer&&THREE.sRGBEncoding)renderer.outputEncoding=THREE.sRGBEncoding;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(31,1,.1,100);const root=new THREE.Group();const ball=makeBall(THREE,opts);root.add(ball);scene.add(root);
  scene.add(new THREE.HemisphereLight(opts.hemiTop,opts.hemiBottom,1.15));
  const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(-3.4,4.8,5.5);key.castShadow=true;scene.add(key);
  const accent1=new THREE.PointLight(opts.accent1,1.45,12);accent1.position.set(3.2,-1.0,3.0);scene.add(accent1);
  const accent2=new THREE.PointLight(opts.accent2,.85,10);accent2.position.set(-3.0,1.6,-1.5);scene.add(accent2);
  const ring1=new THREE.Mesh(new THREE.TorusGeometry(2.10,.020,8,96),new THREE.MeshBasicMaterial({color:opts.accent1,transparent:true,opacity:.34}));ring1.rotation.x=1.24;ring1.rotation.z=.22;root.add(ring1);
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.88,.014,8,96),new THREE.MeshBasicMaterial({color:opts.accent2,transparent:true,opacity:.22}));ring2.rotation.x=.94;ring2.rotation.y=.36;root.add(ring2);
  if(opts.ground){
    const ground=new THREE.Mesh(new THREE.CircleGeometry(2.65,64),new THREE.ShadowMaterial({color:0x000000,opacity:.30}));ground.rotation.x=-Math.PI/2;ground.position.set(0,-1.85,.08);ground.receiveShadow=true;root.add(ground);
    const count=90,positions=new Float32Array(count*3);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,r=1.9+Math.random()*1.8;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=-1.3+Math.random()*1.2;positions[i*3+2]=Math.sin(a)*r*.42;}const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(positions,3));root.add(new THREE.Points(pg,new THREE.PointsMaterial({color:opts.accent1,size:.026,transparent:true,opacity:.55})));
  }
  let drag=false,downX=0,downY=0,lastX=0,lastY=0,targetX=opts.rotationX||-.12,targetY=opts.rotationY||.35,clickStart=0,spinBoost=0,visible=true,last=performance.now();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize(){const r=stage.getBoundingClientRect(),w=Math.max(280,r.width),h=Math.max(330,r.height),mobile=matchMedia("(max-width:760px)").matches;renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.05:1.45));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=mobile?(opts.mobileZ||7.25):(opts.desktopZ||6.35);camera.updateProjectionMatrix();root.scale.setScalar(mobile?(opts.mobileScale||.91):(opts.desktopScale||1.02));}
  canvas.addEventListener("pointerdown",e=>{drag=true;downX=lastX=e.clientX;downY=lastY=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
  canvas.addEventListener("pointermove",e=>{if(drag){targetY+=(e.clientX-lastX)*.008;targetX+=(e.clientY-lastY)*.006;targetX=Math.max(-1.05,Math.min(1.05,targetX));lastX=e.clientX;lastY=e.clientY;}else{const r=canvas.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;targetY=(opts.rotationY||.35)+nx*.45;targetX=(opts.rotationX||-.12)+ny*.22;}});
  function endPointer(e){if(!drag)return;drag=false;const moved=Math.hypot(e.clientX-downX,e.clientY-downY);if(moved<10&&!reduced){clickStart=performance.now();spinBoost=opts.ground?1.15:.55;}}
  canvas.addEventListener("pointerup",endPointer);canvas.addEventListener("pointercancel",()=>drag=false);canvas.addEventListener("pointerleave",()=>{if(!drag){targetX=opts.rotationX||-.12;targetY=opts.rotationY||.35;}});
  if("IntersectionObserver"in window)new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;},{threshold:.03}).observe(stage);
  if("ResizeObserver"in window)new ResizeObserver(resize).observe(stage);else window.addEventListener("resize",resize,{passive:true});
  function animate(now){requestAnimationFrame(animate);if(document.hidden||!visible)return;const dt=Math.min(.04,(now-last)/1000||.016);last=now;ball.rotation.x+=(targetX-ball.rotation.x)*Math.min(1,dt*5.8);ball.rotation.y+=(targetY-ball.rotation.y)*Math.min(1,dt*5.8);if(!drag&&!reduced){targetY+=dt*(opts.autoSpin||.16);ring1.rotation.z+=dt*(opts.ringSpin1||.07);ring2.rotation.z-=dt*(opts.ringSpin2||.05);}if(spinBoost>0){targetY+=dt*spinBoost*2.2;spinBoost=Math.max(0,spinBoost-dt*1.6);}if(!reduced){if(opts.ground){root.position.x=Math.sin(now*.00055)*.17;ball.rotation.z+=dt*.13;}else{root.position.y=Math.sin(now*.0014)*.10;}}if(clickStart){const t=(now-clickStart)/850;if(t<1){const arc=Math.sin(Math.PI*t);if(opts.ground){ball.position.y=arc*.28;ball.position.z=arc*.25;}else{ball.position.y=arc*.62;ball.position.z=arc*.48;}ball.scale.setScalar(1+arc*.045);}else{clickStart=0;ball.position.set(0,0,0);ball.scale.setScalar(1);}}renderer.render(scene,camera);}
  resize();requestAnimationFrame(animate);return{renderer,scene,camera,ball,root};
}

async function buildBoth(){
  const heroStage=q("#v14CinematicHero .v14-stage");
  if(heroStage&&!heroStage.dataset.jrV362Scene){
    q("#jrV14Canvas",heroStage)?.setAttribute("aria-hidden","true");
    q("#jrAstraFootballScene",heroStage)?.setAttribute("aria-hidden","true");
    if(!q(".jr-v362-tip",heroStage)){const tip=document.createElement("div");tip.className="jr-v362-tip";tip.textContent="Arrastra el balón · toca para patear";heroStage.appendChild(tip);}
    await buildScene(heroStage,{canvasId:"jrV362TopBall",aria:"Balón superior 3D verde y cian",base:0xe7ece9,patch:0x09100c,seam:0x53645b,badge:"#45ed91",accent1:0x45ed91,accent2:0x4cc9ff,hemiTop:0xf0fff5,hemiBottom:0x07100c,autoSpin:.18,ringSpin1:.075,ringSpin2:.050,mobileScale:.88,desktopScale:1.02,mobileZ:7.35,desktopZ:6.45,fallbackScale:.27,fallbackX:.58,fallbackY:.50,base2d:"#dfe8e2",edge2d:"#7f9188",patch2d:"#09100c",glow:"rgba(69,237,145,.18)",spin:.008});
  }
  ensureSecondSection();
  const lowerStage=q("#jrV362SecondStage");
  if(lowerStage&&!lowerStage.dataset.jrV362Scene){
    await buildScene(lowerStage,{canvasId:"jrV362BottomBall",aria:"Balón inferior 3D dorado y verde",base:0xbec3bd,patch:0x17130d,seam:0x735c34,badge:"#f2c14e",accent1:0xf2c14e,accent2:0x45ed91,hemiTop:0xfff1c2,hemiBottom:0x0b0d0b,autoSpin:-.13,ringSpin1:-.09,ringSpin2:.06,mobileScale:.82,desktopScale:.95,mobileZ:7.6,desktopZ:6.75,rotationX:-.08,rotationY:-.30,ground:true,fallbackScale:.25,fallbackX:.68,fallbackY:.58,base2d:"#d0d0ca",edge2d:"#776f5d",patch2d:"#17130d",glow:"rgba(242,193,78,.18)",spin:-.007});
  }
}

function boot(){
  wireControls();
  buildBoth();
  document.addEventListener("click",e=>{if(e.target.closest("[data-view],[data-category],[data-v20-cat],[data-v21-cat]"))setTimeout(()=>{wireControls();buildBoth();},180);},true);
  window.addEventListener("pageshow",()=>setTimeout(()=>{wireControls();buildBoth();},100));
  window.LJR_V362={version:VERSION,categoriesModal,go,rebuild:buildBoth};
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
