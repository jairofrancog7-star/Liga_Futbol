(function(){
"use strict";

const CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();

function injectStyles(){
  if(q("#jrV36Styles"))return;
  const s=document.createElement("style");
  s.id="jrV36Styles";
  s.textContent=`
  #v14CinematicHero .v14-stage{position:relative!important;min-height:clamp(360px,52vw,610px)!important;overflow:hidden!important;isolation:isolate;background:radial-gradient(circle at 52% 44%,rgba(69,237,145,.16),transparent 35%),radial-gradient(circle at 50% 72%,rgba(12,112,60,.17),transparent 44%),linear-gradient(180deg,rgba(3,12,8,.10),rgba(3,12,8,.52))!important}
  #v14CinematicHero #jrV14Canvas,#v14CinematicHero #jrAstraFootballScene{display:none!important;pointer-events:none!important}
  #jrV36BallCanvas{position:absolute;inset:0;z-index:2;width:100%!important;height:100%!important;display:block;touch-action:none;cursor:grab;filter:drop-shadow(0 26px 38px rgba(0,0,0,.28))}
  #jrV36BallCanvas:active{cursor:grabbing}
  #v14CinematicHero .v14-chip{z-index:8!important;cursor:pointer!important;user-select:none;-webkit-user-select:none;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
  #v14CinematicHero .v14-chip[role="button"]:focus-visible{outline:3px solid #45ed91;outline-offset:4px}
  @media(hover:hover) and (pointer:fine){#v14CinematicHero .v14-chip:hover{transform:translateY(-3px) scale(1.02);border-color:rgba(69,237,145,.55)!important;box-shadow:0 14px 28px rgba(0,0,0,.30)}}
  .jr-v36-cat-bg{position:fixed;inset:0;z-index:140000;display:none;place-items:center;padding:14px;background:rgba(0,0,0,.76);backdrop-filter:blur(14px)}
  .jr-v36-cat-bg.show{display:grid}
  .jr-v36-cat-modal{width:min(540px,100%);border:1px solid rgba(69,237,145,.22);border-radius:24px;padding:18px;color:#f3fff8;background:#07100c;box-shadow:0 30px 90px rgba(0,0,0,.52)}
  .jr-v36-cat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.jr-v36-cat-head h3{margin:0;font:800 22px/1.1 Sora,system-ui}
  .jr-v36-close{width:42px;height:42px;border:1px solid rgba(255,255,255,.12);border-radius:13px;color:#fff;background:#142019;font-size:25px}
  .jr-v36-cat-list{display:grid;gap:9px}.jr-v36-cat{min-height:50px;padding:11px 14px;border:1px solid rgba(69,237,145,.16);border-radius:14px;color:#eefaf2;background:linear-gradient(180deg,#14261c,#0d1813);text-align:left;font-weight:850}
  .jr-v36-cat small{display:block;margin-top:3px;color:#8ea99a;font-size:10px;font-weight:700}
  .jr-v36-ball-tip{position:absolute;left:50%;bottom:18px;z-index:7;transform:translateX(-50%);padding:7px 11px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(5,14,10,.66);color:rgba(242,255,247,.76);font-size:10px;font-weight:800;pointer-events:none;backdrop-filter:blur(8px)}
  @media(max-width:620px){#v14CinematicHero .v14-stage{min-height:400px!important}.jr-v36-ball-tip{bottom:10px;font-size:9px}}
  @media(prefers-reduced-motion:reduce){#v14CinematicHero .v14-chip{transition:none}}
  `;
  document.head.appendChild(s);
}

function toast(text){
  if(typeof window.showToast==="function"){try{window.showToast(text);return}catch(_){}}
  if(typeof window.toast==="function"){try{window.toast(text);return}catch(_){}}
  const el=document.createElement("div");el.textContent=text;
  Object.assign(el.style,{position:"fixed",left:"50%",bottom:"110px",transform:"translateX(-50%)",zIndex:"150000",padding:"10px 13px",borderRadius:"12px",background:"#132219",color:"#fff",font:"700 12px system-ui",boxShadow:"0 10px 30px rgba(0,0,0,.38)"});
  document.body.appendChild(el);setTimeout(()=>el.remove(),1700);
}

function go(view){
  const target=document.getElementById("view-"+view);
  if(!target){toast("Sección no disponible.");return false}
  if(typeof window.showView==="function"){try{window.showView(view);return true}catch(_){}}
  const c=qa("[data-view]").find(el=>norm(el.dataset.view)===norm(view));
  if(c){try{c.click();return true}catch(_){}}
  target.scrollIntoView({behavior:"smooth",block:"start"});return true;
}

function activateCategory(cat){
  try{localStorage.setItem("jrCategory",cat)}catch(_){}
  qa(".categoryText").forEach(el=>el.textContent=cat);
  const control=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(el=>{
    const v=el.dataset.category||el.dataset.v20Cat||el.dataset.v21Cat||"";
    return norm(v)===norm(cat);
  });
  if(control){try{control.click()}catch(_){}}
  setTimeout(()=>{go("matches");toast("Categoría: "+cat)},80);
}

function categoriesModal(){
  let bg=q("#jrV36Categories");
  if(!bg){
    bg=document.createElement("div");bg.id="jrV36Categories";bg.className="jr-v36-cat-bg";
    bg.innerHTML=`<section class="jr-v36-cat-modal" role="dialog" aria-modal="true" aria-labelledby="jrV36CatTitle">
      <div class="jr-v36-cat-head"><h3 id="jrV36CatTitle">5 categorías</h3><button class="jr-v36-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="jr-v36-cat-list">${CATS.map(c=>`<button type="button" class="jr-v36-cat" data-jr-v36-cat="${c}">${c}<small>Abrir partidos de esta categoría</small></button>`).join("")}</div>
    </section>`;
    document.body.appendChild(bg);
    q(".jr-v36-close",bg).onclick=()=>bg.classList.remove("show");
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};
    qa("[data-jr-v36-cat]",bg).forEach(btn=>btn.onclick=()=>{bg.classList.remove("show");activateCategory(btn.dataset.jrV36Cat)});
  }
  bg.classList.add("show");
}

function openLiguilla(){
  if(go("cup"))return;
  const b=q(".bracket-inner");if(b)b.scrollIntoView({behavior:"smooth",block:"center"});
  else toast("La liguilla no está disponible en esta vista.");
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
function runAction(a){
  if(a==="cats")categoriesModal();
  else if(a==="match")go("matchcenter");
  else if(a==="matchday"||a==="jornada")go("matches");
  else if(a==="cup")openLiguilla();
}
function makeInteractive(el,a){
  if(!el||el.dataset.jrV36Bound==="1")return;
  el.dataset.jrV36Bound="1";el.dataset.jrV36Action=a;
  if(!["BUTTON","A"].includes(el.tagName)){
    el.setAttribute("role","button");el.tabIndex=0;
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();runAction(a)}});
  }
  el.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();runAction(a)});
}
function wireHeroControls(){
  const hero=q("#v14CinematicHero");if(!hero)return;
  qa(".v14-chip,button,a,[role='button']",hero).forEach(el=>{const a=actionFromText(el.textContent||"");if(a)makeInteractive(el,a)});
}

function loadThree(){
  if(window.THREE&&window.THREE.WebGLRenderer)return Promise.resolve(window.THREE);
  return new Promise((resolve,reject)=>{
    const old=q('script[data-jr-v36-three]');
    if(old){old.addEventListener("load",()=>resolve(window.THREE),{once:true});old.addEventListener("error",reject,{once:true});return}
    const s=document.createElement("script");s.dataset.jrV36Three="1";s.src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";s.async=true;
    s.onload=()=>window.THREE?resolve(window.THREE):reject(new Error("THREE no disponible"));s.onerror=reject;document.head.appendChild(s);
  });
}
function dirs(THREE){
  const p=(1+Math.sqrt(5))/2;
  return [[0,1,p],[0,-1,p],[0,1,-p],[0,-1,-p],[1,p,0],[-1,p,0],[1,-p,0],[-1,-p,0],[p,0,1],[-p,0,1],[p,0,-1],[-p,0,-1]]
    .map(v=>new THREE.Vector3(...v).normalize());
}
function fallback2D(stage){
  const c=document.createElement("canvas");c.id="jrV36BallCanvas";stage.appendChild(c);const x=c.getContext("2d");let w=1,h=1,dpr=1,r=0;
  function size(){const b=stage.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.5);w=Math.max(280,b.width);h=Math.max(340,b.height);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);x.setTransform(dpr,0,0,dpr,0,0)}
  function pent(cx,cy,rr,a){x.beginPath();for(let i=0;i<5;i++){const t=a-Math.PI/2+i*Math.PI*2/5,px=cx+Math.cos(t)*rr,py=cy+Math.sin(t)*rr;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.fill()}
  function draw(){x.clearRect(0,0,w,h);const R=Math.min(w,h)*.28,cx=w*.5,cy=h*.48;const g=x.createRadialGradient(cx-R*.35,cy-R*.42,R*.04,cx,cy,R);g.addColorStop(0,"#fff");g.addColorStop(.55,"#eef2ef");g.addColorStop(1,"#7c8981");x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.fill();x.save();x.translate(cx,cy);x.rotate(r);x.translate(-cx,-cy);x.fillStyle="#0c1510";pent(cx,cy,R*.22,0);[[.47,-.24],[-.45,-.27],[.33,.44],[-.34,.45]].forEach(([a,b],i)=>pent(cx+a*R,cy+b*R,R*.15,i*.5));x.restore();r+=.008;requestAnimationFrame(draw)}
  size();window.addEventListener("resize",size,{passive:true});draw();
}

async function build3D(){
  const stage=q("#v14CinematicHero .v14-stage");if(!stage||q("#jrV36BallCanvas"))return;
  const o1=q("#jrV14Canvas",stage),o2=q("#jrAstraFootballScene",stage),fb=q(".v14-fallback",stage);
  if(o1){o1.style.display="none";o1.setAttribute("aria-hidden","true")}if(o2){o2.style.display="none";o2.setAttribute("aria-hidden","true")}if(fb)fb.style.display="none";
  const tip=document.createElement("div");tip.className="jr-v36-ball-tip";tip.textContent="Arrastra el balón · toca para patear";stage.appendChild(tip);

  let THREE;try{THREE=await loadThree()}catch(_){fallback2D(stage);return}
  const c=document.createElement("canvas");c.id="jrV36BallCanvas";c.setAttribute("aria-label","Balón de fútbol 3D interactivo");stage.appendChild(c);
  let renderer;try{renderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true,powerPreference:"high-performance"})}catch(_){c.remove();fallback2D(stage);return}
  renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;if("outputEncoding"in renderer&&THREE.sRGBEncoding)renderer.outputEncoding=THREE.sRGBEncoding;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.1,100);camera.position.set(0,.05,6.8);
  const root=new THREE.Group(),ball=new THREE.Group();scene.add(root);root.add(ball);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(1.52,64,48),new THREE.MeshPhysicalMaterial({color:0xf3f5f2,roughness:.28,metalness:.02,clearcoat:.45,clearcoatRoughness:.32}));shell.castShadow=true;shell.receiveShadow=true;ball.add(shell);
  const z=new THREE.Vector3(0,0,1),pm=new THREE.MeshStandardMaterial({color:0x0b120e,roughness:.45,metalness:.02,side:THREE.DoubleSide});
  dirs(THREE).forEach((d,i)=>{const g=new THREE.CircleGeometry(.305,5);g.rotateZ((i%5)*.15);const m=new THREE.Mesh(g,pm);m.position.copy(d).multiplyScalar(1.525);m.quaternion.setFromUnitVectors(z,d);m.castShadow=true;ball.add(m)});
  ball.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.535,2)),new THREE.LineBasicMaterial({color:0x5c6a62,transparent:true,opacity:.09})));
  const h1=new THREE.Mesh(new THREE.TorusGeometry(2.15,.018,8,96),new THREE.MeshBasicMaterial({color:0x45ed91,transparent:true,opacity:.28}));h1.rotation.x=1.26;h1.rotation.z=.22;root.add(h1);
  const h2=new THREE.Mesh(new THREE.TorusGeometry(1.92,.012,8,96),new THREE.MeshBasicMaterial({color:0x69f0a7,transparent:true,opacity:.16}));h2.rotation.x=.96;h2.rotation.y=.32;root.add(h2);
  scene.add(new THREE.HemisphereLight(0xeafff2,0x07100c,1.15));
  const key=new THREE.DirectionalLight(0xffffff,2.25);key.position.set(-3.4,4.8,5.5);key.castShadow=true;scene.add(key);
  const green=new THREE.PointLight(0x45ed91,1.25,12);green.position.set(3,-1.2,3.2);scene.add(green);
  const rim=new THREE.PointLight(0x7cc9ff,.65,10);rim.position.set(-3.2,1.2,-1.8);scene.add(rim);

  function resize(){const b=stage.getBoundingClientRect(),mobile=matchMedia("(max-width:760px)").matches;renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.18:1.55));renderer.setSize(Math.max(280,b.width),Math.max(340,b.height),false);camera.aspect=Math.max(280,b.width)/Math.max(340,b.height);camera.updateProjectionMatrix();camera.position.z=mobile?7.3:6.4;root.scale.setScalar(mobile?.92:1.06)}
  let drag=false,dx0=0,dy0=0,lx=0,ly=0,trx=-.12,tryy=.35,kick=0,visible=true,last=performance.now(),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  c.addEventListener("pointerdown",e=>{drag=true;dx0=lx=e.clientX;dy0=ly=e.clientY;try{c.setPointerCapture(e.pointerId)}catch(_){}});
  c.addEventListener("pointermove",e=>{if(drag){trx+= (e.clientY-ly)*.006;tryy+=(e.clientX-lx)*.008;trx=Math.max(-1.05,Math.min(1.05,trx));lx=e.clientX;ly=e.clientY}else{const b=c.getBoundingClientRect(),nx=(e.clientX-b.left)/b.width-.5,ny=(e.clientY-b.top)/b.height-.5;tryy=.35+nx*.55;trx=-.12+ny*.28}});
  function end(e){if(!drag)return;drag=false;if(Math.hypot(e.clientX-dx0,e.clientY-dy0)<10&&!reduced)kick=performance.now()}
  c.addEventListener("pointerup",end);c.addEventListener("pointercancel",()=>drag=false);c.addEventListener("pointerleave",()=>{if(!drag){tryy=.35;trx=-.12}});
  if("IntersectionObserver"in window)new IntersectionObserver(e=>{visible=!!e[0]?.isIntersecting},{threshold:.03}).observe(stage);
  if("ResizeObserver"in window)new ResizeObserver(resize).observe(stage);else window.addEventListener("resize",resize,{passive:true});

  function anim(now){requestAnimationFrame(anim);if(document.hidden||!visible)return;const dt=Math.min(.04,(now-last)/1000||.016);last=now;ball.rotation.x+=(trx-ball.rotation.x)*Math.min(1,dt*5.6);ball.rotation.y+=(tryy-ball.rotation.y)*Math.min(1,dt*5.6);if(!drag&&!reduced){tryy+=dt*.16;h1.rotation.z+=dt*.06;h2.rotation.z-=dt*.045}if(kick){const t=(now-kick)/900;if(t<1){const a=Math.sin(Math.PI*t);ball.position.y=a*.72;ball.position.z=a*.52;ball.scale.setScalar(1+a*.055)}else{kick=0;ball.position.set(0,0,0);ball.scale.setScalar(1)}}renderer.render(scene,camera)}
  resize();requestAnimationFrame(anim);window.LJR_V36_BALL={renderer,scene,camera,ball};
}

function boot(){
  injectStyles();wireHeroControls();build3D();
  document.addEventListener("click",e=>{if(e.target.closest("[data-view],[data-category],[data-v20-cat],[data-v21-cat]"))setTimeout(()=>{wireHeroControls();if(!q("#jrV36BallCanvas"))build3D()},180)},true);
  window.addEventListener("pageshow",()=>setTimeout(()=>{wireHeroControls();if(!q("#jrV36BallCanvas"))build3D()},100));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();