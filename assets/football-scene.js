(function(){
"use strict";
const VERSION="36.21",LOGO="./assets/liga-logo.webp?v=36-21",CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s)),norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
function toast(t){if(typeof window.showToast==="function"){try{window.showToast(t);return}catch(_){}}const e=document.createElement("div");e.textContent=t;Object.assign(e.style,{position:"fixed",left:"50%",bottom:"110px",transform:"translateX(-50%)",zIndex:190000,padding:"10px 13px",borderRadius:"12px",background:"#132219",color:"#fff",font:"700 12px system-ui"});document.body.appendChild(e);setTimeout(()=>e.remove(),1600)}
function go(v){const d=v==="match"?"matchcenter":v,t=document.getElementById("view-"+d);if(!t){toast("Sección no disponible.");return false}if(typeof window.showView==="function"){try{window.showView(d);return true}catch(_){}}const c=qa("[data-view]").find(x=>norm(x.dataset.view)===norm(d));if(c){try{c.click();return true}catch(_){}}t.scrollIntoView({behavior:"smooth",block:"start"});return true}
function activateCategory(c){try{localStorage.setItem("jrCategory",c)}catch(_){}qa(".categoryText").forEach(e=>e.textContent=c);const b=qa("[data-category],[data-v20-cat],[data-v21-cat]").find(e=>norm(e.dataset.category||e.dataset.v20Cat||e.dataset.v21Cat||"")===norm(c));if(b)try{b.click()}catch(_){}setTimeout(()=>{go("matches");toast("Categoría: "+c)},90)}
function categoriesModal(){let bg=q("#jrV369Categories");if(!bg){bg=document.createElement("div");bg.id="jrV369Categories";bg.className="jr-v369-cat-bg";bg.innerHTML=`<section class="jr-v369-cat-modal" role="dialog" aria-modal="true"><div class="jr-v369-cat-head"><h3>5 categorías</h3><button class="jr-v369-close" type="button">×</button></div><div class="jr-v369-cat-list">${CATS.map(c=>`<button class="jr-v369-cat" type="button" data-jr-v369-cat="${c}">${c}<small>Abrir partidos de esta categoría</small></button>`).join("")}</div></section>`;document.body.appendChild(bg);q(".jr-v369-close",bg).onclick=()=>bg.classList.remove("show");bg.onclick=e=>{if(e.target===bg)bg.classList.remove("show")};qa("[data-jr-v369-cat]",bg).forEach(b=>b.onclick=()=>{bg.classList.remove("show");activateCategory(b.dataset.jrV369Cat)})}bg.classList.add("show")}
function cup(){if(go("cup"))return;const b=q(".bracket-inner");if(b)b.scrollIntoView({behavior:"smooth",block:"center"});else toast("La liguilla no está disponible en esta vista.")}
function action(a){if(a==="cats")categoriesModal();else if(a==="match")go("matchcenter");else if(a==="jornada"||a==="matchday")go("matches");else if(a==="cup")cup();else if(a==="teams")go("teams");else if(a==="more")go("more");else if(a==="rules"){if(window.LJR_V35&&typeof window.LJR_V35.rules==="function")window.LJR_V35.rules();else window.open("./docs/Reglamento_Liga_Juventino_Rosas_2026-2027.pdf","_blank","noopener")}}
function fromText(t){t=norm(t);if(t.includes("5 categorias"))return"cats";if(t.includes("live match center")||t==="match center"||t.includes("abrir match center"))return"match";if(t.includes("jr matchday"))return"matchday";if(t==="jornada"||t.includes("ver jornada"))return"jornada";if(t==="liguilla"||t.includes("ver liguilla"))return"cup";return""}
function ensureSideRail(h){
  if(!h)return;
  const stage=q(".v14-stage",h);
  if(!stage||q("#jrV3610SideRail",stage))return;

  const rail=document.createElement("div");
  rail.id="jrV3610SideRail";
  rail.className="jr-v3610-side-rail";
  rail.innerHTML=`
    <button type="button" data-jr-v3610="cats"><span>5</span><small>Categorías</small></button>
    <button type="button" data-jr-v3610="match"><span>🔴</span><small>LIVE</small></button>
    <button type="button" data-jr-v3610="matchday"><span>⚽</span><small>Matchday</small></button>
    <button type="button" data-jr-v3610="jornada"><span>📅</span><small>Jornada</small></button>
    <button type="button" data-jr-v3610="cup"><span>🏆</span><small>Liguilla</small></button>`;
  stage.appendChild(rail);

  qa("[data-jr-v3610]",rail).forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.preventDefault();
      e.stopPropagation();
      action(btn.dataset.jrV3610);
    });
  });
}
function wire(){const h=q("#v14CinematicHero");if(!h)return;ensureSideRail(h);const li=q(".v14-lockup img",h);if(li){li.src=LOGO;li.alt="Liga Municipal de Fútbol Juventino Rosas"}qa(".v14-chip,button,a,[role='button']",h).forEach(e=>{const a=fromText(e.textContent||"");if(!a||e.dataset.jrV369Bound)return;e.dataset.jrV369Bound="1";if(!["BUTTON","A"].includes(e.tagName)){e.setAttribute("role","button");e.tabIndex=0}e.addEventListener("click",x=>{x.preventDefault();x.stopPropagation();action(a)});e.addEventListener("keydown",x=>{if(x.key==="Enter"||x.key===" "){x.preventDefault();action(a)}})})}
function cleanup(){["#jrV365SecondSection","#jrV364SecondSection","#jrV367SecondSection","#jrV366HeroArt","#jrV365HeroArt","#jrV365SecondArt","#jrV362SecondBall","#jrV363SecondBall","#jrV36SecondBall","#jrV365GoldBall","#jrV369SecondSection"].forEach(s=>qa(s).forEach(e=>e.remove()));const h=q("#v14CinematicHero");if(h){qa(".jr-v367-canvas,.jr-v367-tip,.jr-v369-canvas,.jr-v369-tip",h).forEach(e=>e.remove());const st=q(".v14-stage",h);if(st)delete st.dataset.jrV369Ready}}
function second(){const h=q("#v14CinematicHero");if(!h||q("#jrV369SecondSection"))return;const s=document.createElement("section");s.id="jrV369SecondSection";s.innerHTML=`<div class="jr-v369-second-grid"><div class="jr-v369-second-copy"><div class="jr-v369-second-lockup"><img src="${LOGO}" alt="Logo Liga Municipal de Fútbol Juventino Rosas"><span><b>LIGA MUNICIPAL DE FÚTBOL</b><small>JUVENTINO ROSAS A.C.</small></span></div><div class="jr-v369-eyebrow">SEGUNDO UNIVERSO DE LA LIGA</div><h3>EL FÚTBOL <span>TAMBIÉN BRILLA</span> FUERA DE LA CANCHA.</h3><p>Explora equipos, jornadas, historias y reglamento en una segunda experiencia visual. El balón dorado es independiente del balón principal y conserva accesos funcionales.</p><div class="jr-v369-second-actions"><button class="primary" data-jr-v369-action="teams">Equipos</button><button data-jr-v369-action="jornada">Partidos</button><button data-jr-v369-action="more">Historias</button><button data-jr-v369-action="rules">Reglamento</button></div><div class="jr-v369-second-stats"><div class="jr-v369-stat"><b>5 categorías</b><small>Primera, Intermedia, Segunda y Veteranos</small></div><div class="jr-v369-stat"><b>JR Matchday</b><small>Jornadas y resultados</small></div><div class="jr-v369-stat"><b>Match Center</b><small>Seguimiento de la liga</small></div></div></div><div id="jrV369SecondStage" aria-label="Balón dorado 3D interactivo"></div></div>`;h.insertAdjacentElement("afterend",s);qa("[data-jr-v369-action]",s).forEach(b=>b.onclick=()=>action(b.dataset.jrV369Action))}
function loadThree(){if(window.THREE&&window.THREE.WebGLRenderer)return Promise.resolve(window.THREE);return new Promise((res,rej)=>{let s=q('script[data-jr-v369-three]');if(s){s.addEventListener("load",()=>res(window.THREE),{once:true});s.addEventListener("error",rej,{once:true});return}s=document.createElement("script");s.dataset.jrV369Three="1";s.src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";s.async=true;s.onload=()=>window.THREE?res(window.THREE):rej();s.onerror=rej;document.head.appendChild(s)})}
function dirs(T){const p=(1+Math.sqrt(5))/2;return [[0,1,p],[0,-1,p],[0,1,-p],[0,-1,-p],[1,p,0],[-1,p,0],[1,-p,0],[-1,-p,0],[p,0,1],[-p,0,1],[p,0,-1],[-p,0,-1]].map(v=>new T.Vector3(...v).normalize())}
async function makeBall(stage,o){if(!stage||stage.dataset.jrV369Ready)return;stage.dataset.jrV369Ready="1";let T;try{T=await loadThree()}catch(_){toast("No se pudo cargar el motor 3D.");return}const c=document.createElement("canvas");c.className="jr-v369-canvas";stage.appendChild(c);const tip=document.createElement("div");tip.className="jr-v369-tip";tip.textContent="Arrastra · giro 960° · toca para patear";stage.appendChild(tip);let R;try{R=new T.WebGLRenderer({canvas:c,alpha:true,antialias:true,powerPreference:"high-performance"})}catch(_){toast("WebGL no está disponible.");return}R.setClearColor(0,0);R.shadowMap.enabled=true;if("outputEncoding" in R&&T.sRGBEncoding)R.outputEncoding=T.sRGBEncoding;const S=new T.Scene(),C=new T.PerspectiveCamera(30,1,.1,100),W=new T.Group(),M=new T.Group(),B=new T.Group(),O=new T.Group();S.add(W);W.add(M);M.add(B);M.add(O);const shell=new T.Mesh(new T.SphereGeometry(1.52,72,56),new T.MeshPhysicalMaterial({color:o.shell,roughness:.24,metalness:.02,clearcoat:.62,clearcoatRoughness:.23}));B.add(shell);const z=new T.Vector3(0,0,1),pm=new T.MeshStandardMaterial({color:o.panel,roughness:.42,side:T.DoubleSide});dirs(T).forEach((d,i)=>{const g=new T.CircleGeometry(.305,5);g.rotateZ((i%5)*.19);const p=new T.Mesh(g,pm);p.position.copy(d).multiplyScalar(1.526);p.quaternion.setFromUnitVectors(z,d);B.add(p)});B.add(new T.LineSegments(new T.WireframeGeometry(new T.IcosahedronGeometry(1.536,2)),new T.LineBasicMaterial({color:o.seam,transparent:true,opacity:.11})));try{const tx=await new T.TextureLoader().loadAsync(LOGO);if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;const l=new T.Mesh(new T.PlaneGeometry(.58,.58),new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:T.DoubleSide}));l.position.z=1.548;B.add(l)}catch(_){}[[2.14,.020,o.o1,.38,1.20,.20],[1.94,.014,o.o2,.26,.90,-.32],[2.36,.010,o.o3,.18,1.44,.48]].forEach(v=>{const t=new T.Mesh(new T.TorusGeometry(v[0],v[1],8,128),new T.MeshBasicMaterial({color:v[2],transparent:true,opacity:v[3]}));t.rotation.x=v[4];t.rotation.z=v[5];O.add(t)});const pg=new T.BufferGeometry(),n=96,a=new Float32Array(n*3);for(let i=0;i<n;i++){const an=Math.random()*Math.PI*2,r=1.66+Math.random()*.38;a[i*3]=Math.cos(an)*r;a[i*3+1]=(Math.random()-.5)*2.4;a[i*3+2]=Math.sin(an)*r*.5}pg.setAttribute("position",new T.BufferAttribute(a,3));O.add(new T.Points(pg,new T.PointsMaterial({color:o.part,size:.028,transparent:true,opacity:.76})));S.add(new T.HemisphereLight(0xffffff,0x07100c,1.20));const k=new T.DirectionalLight(o.key,2.45);k.position.set(-3.2,4.8,5.2);S.add(k);const ac=new T.PointLight(o.accent,1.75,12);ac.position.set(3.2,-.9,3.5);S.add(ac);const rim=new T.PointLight(o.rim,.95,12);rim.position.set(-3,1.4,-2.2);S.add(rim);let drag=false,downX=0,downY=0,lastX=0,lastY=0,yaw=0,pitch=0,kick=0,last=performance.now(),visible=true,orbitScale=1;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,RAD960=T.MathUtils.degToRad(960);function size(){
  const b=stage.getBoundingClientRect(),
        mob=matchMedia("(max-width:760px)").matches,
        w=Math.max(280,b.width),
        h=Math.max(340,b.height);

  R.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.14:1.50));
  R.setSize(w,h,false);
  C.aspect=w/h;
  C.updateProjectionMatrix();

  const sc=(mob?.92:1.02)*o.scale,
        isHero=!!stage.closest("#v14CinematicHero"),
        isSecond=stage.id==="jrV369SecondStage",
        hf=Math.tan(T.MathUtils.degToRad(C.fov*.5));

  W.scale.setScalar(sc);

  /*
   * V36.21 AREA UTIL:
   * - El balon sigue grande.
   * - Se centra SOLO en el area libre del hero.
   * - Se deja un colchón real para la botonera derecha.
   * - Las orbitas se ajustan aparte.
   */
  orbitScale=isSecond?(mob?.64:.66):(mob?.60:.62);
  O.scale.setScalar(orbitScale);

  const reserveRight=isHero?(mob?108:122):0,
        padLeft=mob?12:18,
        padRight=mob?8:12,
        safeLeft=padLeft,
        safeRight=Math.max(safeLeft+200,w-reserveRight-padRight),
        usableW=safeRight-safeLeft,
        usableH=h-(mob?18:26);

  /*
   * HERO:
   * llena casi todo el ancho útil izquierdo sin invadir la botonera.
   * SEGUNDO:
   * grande y completo en su cuadro.
   */
  const desiredDiameter=isSecond
        ? Math.min(usableW*(mob?.96:.98), usableH*(mob?.82:.84))
        : Math.min(usableW*(mob?.98:1.00), usableH*(mob?.80:.82)),
        targetRadiusPx=Math.max(125,desiredDiameter*.5),
        effectiveBallRadius=1.52*sc,
        zForPixels=(effectiveBallRadius*(h*.5))/(targetRadiusPx*hf),
        minZ=isSecond?(mob?6.00:5.82):(mob?5.92:5.76);

  C.position.z=Math.max(minZ,zForPixels);

  /* Centrar exactamente en el area util izquierda. */
  const targetCenterPx=(safeLeft+safeRight)*.5,
        deltaPx=targetCenterPx-(w*.5),
        worldPerPx=(2*C.position.z*hf)/h,
        extraLeft=isHero?(mob?-.04:-.03):0;

  W.position.set(deltaPx*worldPerPx+extraLeft,o.y||0,0);
}
c.addEventListener("pointerdown",e=>{drag=true;downX=lastX=e.clientX;downY=lastY=e.clientY;try{c.setPointerCapture(e.pointerId)}catch(_){}});c.addEventListener("pointermove",e=>{if(!drag)return;yaw+=(e.clientX-lastX)*.009;pitch+=(e.clientY-lastY)*.007;pitch=Math.max(-1.15,Math.min(1.15,pitch));lastX=e.clientX;lastY=e.clientY});function end(e){if(!drag)return;drag=false;if(Math.hypot(e.clientX-downX,e.clientY-downY)<10&&!reduced)kick=performance.now()}c.addEventListener("pointerup",end);c.addEventListener("pointercancel",()=>drag=false);if("IntersectionObserver" in window)new IntersectionObserver(e=>visible=!!e[0]?.isIntersecting,{threshold:.02}).observe(stage);if("ResizeObserver" in window)new ResizeObserver(size).observe(stage);else addEventListener("resize",size,{passive:true});function anim(now){requestAnimationFrame(anim);if(document.hidden||!visible)return;const dt=Math.min(.05,(now-last)/1000||.016);last=now;const phase=((now%o.duration)/o.duration)*RAD960;if(!drag&&!reduced){B.rotation.y=phase+yaw;B.rotation.x=.18*Math.sin(phase*.55)+pitch;B.rotation.z=.08*Math.sin(phase*.28);O.rotation.y=-phase*.55;O.rotation.x=.22*Math.sin(phase*.35);O.rotation.z=phase*.34;M.rotation.z=.05*Math.sin(now*.0007);M.position.y=.08*Math.sin(now*.0011)}if(kick){const t=(now-kick)/900;if(t<1){const ar=Math.sin(Math.PI*t);B.position.y=ar*.28;B.position.z=ar*.18;B.scale.setScalar(1+ar*.028);O.scale.setScalar(orbitScale*(1+ar*.018))}else{kick=0;B.position.set(0,0,0);B.scale.setScalar(1);O.scale.setScalar(orbitScale)}}R.render(S,C)}size();requestAnimationFrame(anim)}
async function mount(){cleanup();second();wire();const h=q("#v14CinematicHero"),top=h?q(".v14-stage",h):null;if(top){delete top.dataset.jrV369Ready;await makeBall(top,{shell:0xf2f4f2,panel:0x0a1510,seam:0x67736c,o1:0x45ed91,o2:0x27c6ff,o3:0xa5ffd0,part:0x58ffac,key:0xffffff,accent:0x45ed91,rim:0x31baff,scale:1.38,y:0,duration:15500})}const ss=q("#jrV369SecondStage");if(ss){delete ss.dataset.jrV369Ready;await makeBall(ss,{shell:0xe5dfcf,panel:0x17130d,seam:0x736955,o1:0xffce55,o2:0xff7b24,o3:0xffef9b,part:0xffc84e,key:0xfff3cf,accent:0xffb52e,rim:0xff6830,scale:1.32,y:.02,duration:17800})}wire()}
function boot(){mount();addEventListener("pageshow",()=>setTimeout(wire,100));window.LJR_V369={version:VERSION,remount:mount,categoriesModal,go}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
