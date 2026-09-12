(function(){
"use strict";
const VERSION="36.26",LOGO="./assets/liga-logo.webp?v=36-26",CATS=["Primera Fuerza","Intermedia","Segunda Fuerza","Veteranos 35+","Veteranos 50+"];
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
function ensureV3626HeroOrbits(h){
  if(!h)return;
  const stage=q(".v14-stage",h);
  if(!stage||q("#jrV3626HeroOrbits",stage))return;
  const wrap=document.createElement("div");
  wrap.id="jrV3626HeroOrbits";
  wrap.className="jr-v3626-orbits";
  wrap.setAttribute("aria-hidden","true");
  wrap.innerHTML=`
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
      <defs>
        <filter id="jrV3626Glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation=".55" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse class="o o1" cx="50" cy="50" rx="47" ry="35" pathLength="100"/>
      <ellipse class="o o2" cx="50" cy="50" rx="43" ry="46" transform="rotate(31 50 50)" pathLength="100"/>
      <ellipse class="o o3" cx="50" cy="50" rx="46" ry="28" transform="rotate(-17 50 50)" pathLength="100"/>
    </svg>`;
  stage.insertBefore(wrap,stage.firstChild);
}
function wire(){const h=q("#v14CinematicHero");if(!h)return;ensureSideRail(h);ensureV3626HeroOrbits(h);const li=q(".v14-lockup img",h);if(li){li.src=LOGO;li.alt="Liga Municipal de Fútbol Juventino Rosas"}qa(".v14-chip,button,a,[role='button']",h).forEach(e=>{const a=fromText(e.textContent||"");if(!a||e.dataset.jrV369Bound)return;e.dataset.jrV369Bound="1";if(!["BUTTON","A"].includes(e.tagName)){e.setAttribute("role","button");e.tabIndex=0}e.addEventListener("click",x=>{x.preventDefault();x.stopPropagation();action(a)});e.addEventListener("keydown",x=>{if(x.key==="Enter"||x.key===" "){x.preventDefault();action(a)}})})}
function cleanup(){["#jrV365SecondSection","#jrV364SecondSection","#jrV367SecondSection","#jrV366HeroArt","#jrV365HeroArt","#jrV365SecondArt","#jrV362SecondBall","#jrV363SecondBall","#jrV36SecondBall","#jrV365GoldBall","#jrV369SecondSection"].forEach(s=>qa(s).forEach(e=>e.remove()));const h=q("#v14CinematicHero");if(h){qa(".jr-v367-canvas,.jr-v367-tip,.jr-v369-canvas,.jr-v369-tip",h).forEach(e=>e.remove());const st=q(".v14-stage",h);if(st)delete st.dataset.jrV369Ready}}
function second(){const h=q("#v14CinematicHero");if(!h||q("#jrV369SecondSection"))return;const s=document.createElement("section");s.id="jrV369SecondSection";s.innerHTML=`<div class="jr-v369-second-grid"><div class="jr-v369-second-copy"><div class="jr-v369-second-lockup"><img src="${LOGO}" alt="Logo Liga Municipal de Fútbol Juventino Rosas"><span><b>LIGA MUNICIPAL DE FÚTBOL</b><small>JUVENTINO ROSAS A.C.</small></span></div><div class="jr-v369-eyebrow">SEGUNDO UNIVERSO DE LA LIGA</div><h3>EL FÚTBOL <span>TAMBIÉN BRILLA</span> FUERA DE LA CANCHA.</h3><p>Explora equipos, jornadas, historias y reglamento en una segunda experiencia visual. El balón dorado es independiente del balón principal y conserva accesos funcionales.</p><div class="jr-v369-second-actions"><button class="primary" data-jr-v369-action="teams">Equipos</button><button data-jr-v369-action="jornada">Partidos</button><button data-jr-v369-action="more">Historias</button><button data-jr-v369-action="rules">Reglamento</button></div><div class="jr-v369-second-stats"><div class="jr-v369-stat"><b>5 categorías</b><small>Primera, Intermedia, Segunda y Veteranos</small></div><div class="jr-v369-stat"><b>JR Matchday</b><small>Jornadas y resultados</small></div><div class="jr-v369-stat"><b>Match Center</b><small>Seguimiento de la liga</small></div></div></div><div id="jrV369SecondStage" aria-label="Balón dorado 3D interactivo"></div></div>`;h.insertAdjacentElement("afterend",s);qa("[data-jr-v369-action]",s).forEach(b=>b.onclick=()=>action(b.dataset.jrV369Action))}
function loadThree(){if(window.THREE&&window.THREE.WebGLRenderer)return Promise.resolve(window.THREE);return new Promise((res,rej)=>{let s=q('script[data-jr-v369-three]');if(s){s.addEventListener("load",()=>res(window.THREE),{once:true});s.addEventListener("error",rej,{once:true});return}s=document.createElement("script");s.dataset.jrV369Three="1";s.src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";s.async=true;s.onload=()=>window.THREE?res(window.THREE):rej();s.onerror=rej;document.head.appendChild(s)})}
function dirs(T){const p=(1+Math.sqrt(5))/2;return [[0,1,p],[0,-1,p],[0,1,-p],[0,-1,-p],[1,p,0],[-1,p,0],[1,-p,0],[-1,-p,0],[p,0,1],[-p,0,1],[p,0,-1],[-p,0,-1]].map(v=>new T.Vector3(...v).normalize())}
/* V36.25 REAL BALL SURFACE START */
function jrV3625Surface(T,o){
  const W=2048,H=1024;
  const mapCanvas=document.createElement("canvas");
  const bumpCanvas=document.createElement("canvas");
  mapCanvas.width=bumpCanvas.width=W;
  mapCanvas.height=bumpCanvas.height=H;

  const ctx=mapCanvas.getContext("2d");
  const bctx=bumpCanvas.getContext("2d");

  const gold=(
    o.accent===0xffb52e ||
    o.o1===0xffce55 ||
    o.key===0xfff3cf
  );

  const base=gold?"#eee7d8":"#f4f4ef";
  const base2=gold?"#ded4bd":"#e5ebe7";
  const dark=gold?"#3b3020":"#0d2521";
  const dark2=gold?"#6f5b35":"#163d35";
  const accent=gold?"#e6b53f":"#18c982";
  const accent2=gold?"#ff7b24":"#28bff0";
  const seam=gold?"rgba(63,50,31,.42)":"rgba(23,42,36,.35)";

  const grad=ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0,base);
  grad.addColorStop(.55,"#ffffff");
  grad.addColorStop(1,base2);
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,W,H);

  bctx.fillStyle="#bdbdbd";
  bctx.fillRect(0,0,W,H);

  /* textura tipo cuero, muy sutil */
  for(let y=3;y<H;y+=9){
    for(let x=3;x<W;x+=9){
      const k=((x*13+y*7)%17)/17;
      ctx.fillStyle=`rgba(30,40,34,${0.012+k*.018})`;
      ctx.fillRect(x+(y%18?1:0),y,1.2,1.2);
    }
  }

  const R=112;
  const DX=Math.sqrt(3)*R;
  const DY=1.5*R;

  function polyPath(c,cx,cy,r,sides,rot){
    c.beginPath();
    for(let i=0;i<sides;i++){
      const a=rot+i*Math.PI*2/sides;
      const px=cx+Math.cos(a)*r;
      const py=cy+Math.sin(a)*r;
      if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
    }
    c.closePath();
  }

  function seamHex(cx,cy,rot){
    ctx.save();
    ctx.strokeStyle=seam;
    ctx.lineWidth=3.1;
    polyPath(ctx,cx,cy,R,6,rot);
    ctx.stroke();

    bctx.save();
    bctx.strokeStyle="#717171";
    bctx.lineWidth=7;
    polyPath(bctx,cx,cy,R,6,rot);
    bctx.stroke();
    bctx.restore();
    ctx.restore();
  }

  function modernPanel(cx,cy,rot,variant){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);

    /* panel oscuro principal con forma moderna, sin logos de terceros */
    const g=ctx.createLinearGradient(-90,-90,90,90);
    g.addColorStop(0,dark2);
    g.addColorStop(1,dark);
    ctx.fillStyle=g;
    ctx.strokeStyle=gold?"rgba(255,237,181,.26)":"rgba(161,255,214,.23)";
    ctx.lineWidth=4;

    ctx.beginPath();
    ctx.moveTo(-88,-25);
    ctx.quadraticCurveTo(-46,-86,15,-76);
    ctx.quadraticCurveTo(73,-64,90,-6);
    ctx.quadraticCurveTo(54,16,32,79);
    ctx.quadraticCurveTo(-26,86,-71,44);
    ctx.quadraticCurveTo(-87,18,-88,-25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /* ala/pétalo secundario */
    ctx.fillStyle=variant%2?dark:dark2;
    ctx.beginPath();
    ctx.moveTo(-50,-66);
    ctx.quadraticCurveTo(-15,-24,4,0);
    ctx.quadraticCurveTo(36,-20,72,-52);
    ctx.quadraticCurveTo(46,-4,28,34);
    ctx.quadraticCurveTo(-12,18,-50,-66);
    ctx.closePath();
    ctx.fill();

    /* líneas de acento como balón moderno */
    ctx.lineCap="round";
    ctx.lineJoin="round";

    ctx.strokeStyle=accent;
    ctx.lineWidth=10;
    ctx.beginPath();
    ctx.moveTo(-83,42);
    ctx.bezierCurveTo(-30,12,4,-14,75,-64);
    ctx.stroke();

    ctx.strokeStyle=accent2;
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(-78,55);
    ctx.bezierCurveTo(-20,18,18,-13,78,-52);
    ctx.stroke();

    ctx.strokeStyle="rgba(255,255,255,.62)";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(-70,31);
    ctx.bezierCurveTo(-25,7,8,-18,63,-55);
    ctx.stroke();

    ctx.restore();

    /* relieve del panel y sus costuras */
    bctx.save();
    bctx.translate(cx,cy);
    bctx.rotate(rot);
    bctx.fillStyle="#8e8e8e";
    bctx.beginPath();
    bctx.moveTo(-88,-25);
    bctx.quadraticCurveTo(-46,-86,15,-76);
    bctx.quadraticCurveTo(73,-64,90,-6);
    bctx.quadraticCurveTo(54,16,32,79);
    bctx.quadraticCurveTo(-26,86,-71,44);
    bctx.quadraticCurveTo(-87,18,-88,-25);
    bctx.closePath();
    bctx.fill();
    bctx.strokeStyle="#5c5c5c";
    bctx.lineWidth=8;
    bctx.stroke();
    bctx.restore();
  }

  let idx=0;
  for(let row=-1;row<7;row++){
    for(let col=-1;col<13;col++){
      const cx=col*DX+(row&1?DX*.5:0)+65;
      const cy=row*DY+75;
      seamHex(cx,cy,Math.PI/6);

      /* repartir paneles oscuros, sin llenar todo de "cuadritos" */
      if(((row*7+col*3+19)%5===0) || ((row+col)%9===0)){
        modernPanel(cx,cy,(idx%7)*.23,idx++);
      }
    }
  }

  /* arcos largos adicionales, parecidos a costuras/paneles modernos */
  ctx.save();
  ctx.globalAlpha=.55;
  ctx.strokeStyle=accent;
  ctx.lineWidth=4;
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(-120,H*(.12+i*.19));
    ctx.bezierCurveTo(
      W*.28,H*(.02+i*.20),
      W*.66,H*(.26+i*.11),
      W+130,H*(.11+i*.18)
    );
    ctx.stroke();
  }
  ctx.strokeStyle=accent2;
  ctx.lineWidth=2;
  for(let i=0;i<4;i++){
    ctx.beginPath();
    ctx.moveTo(W*(.05+i*.26),-80);
    ctx.bezierCurveTo(
      W*(.18+i*.22),H*.30,
      W*(.08+i*.26),H*.68,
      W*(.23+i*.24),H+80
    );
    ctx.stroke();
  }
  ctx.restore();

  const map=new T.CanvasTexture(mapCanvas);
  const bump=new T.CanvasTexture(bumpCanvas);
  if(T.sRGBEncoding)map.encoding=T.sRGBEncoding;
  map.wrapS=T.RepeatWrapping;
  map.wrapT=T.ClampToEdgeWrapping;
  bump.wrapS=T.RepeatWrapping;
  bump.wrapT=T.ClampToEdgeWrapping;
  map.anisotropy=4;
  bump.anisotropy=2;

  return {map,bump};
}
/* V36.25 REAL BALL SURFACE END */
async function makeBall(stage,o){if(!stage||stage.dataset.jrV369Ready)return;stage.dataset.jrV369Ready="1";let T;try{T=await loadThree()}catch(_){toast("No se pudo cargar el motor 3D.");return}const c=document.createElement("canvas");c.className="jr-v369-canvas";stage.appendChild(c);const tip=document.createElement("div");tip.className="jr-v369-tip";tip.textContent="Arrastra · giro 960° · toca para patear";stage.appendChild(tip);let R;try{R=new T.WebGLRenderer({canvas:c,alpha:true,antialias:true,powerPreference:"high-performance"})}catch(_){toast("WebGL no está disponible.");return}R.setClearColor(0,0);R.shadowMap.enabled=true;if("outputEncoding" in R&&T.sRGBEncoding)R.outputEncoding=T.sRGBEncoding;const S=new T.Scene(),C=new T.PerspectiveCamera(30,1,.1,100),W=new T.Group(),M=new T.Group(),B=new T.Group(),O=new T.Group();S.add(W);W.add(M);M.add(B);M.add(O);/* V36.25 REAL BALL MESH START */
const jrSurface=jrV3625Surface(T,o);
const shell=new T.Mesh(
  new T.SphereGeometry(1.52,96,72),
  new T.MeshPhysicalMaterial({
    color:0xffffff,
    map:jrSurface.map,
    bumpMap:jrSurface.bump,
    bumpScale:.038,
    roughness:.34,
    metalness:.015,
    clearcoat:.40,
    clearcoatRoughness:.34
  })
);
shell.castShadow=true;
shell.receiveShadow=true;
B.add(shell);
/* V36.25 REAL BALL MESH END */[[1.92,.018,o.o1,.38,1.20,.20],[1.74,.013,o.o2,.26,.90,-.32],[2.10,.010,o.o3,.18,1.44,.48]].forEach(v=>{const t=new T.Mesh(new T.TorusGeometry(v[0],v[1],8,128),new T.MeshBasicMaterial({color:v[2],transparent:true,opacity:v[3]}));t.rotation.x=v[4];t.rotation.z=v[5];O.add(t)});const pg=new T.BufferGeometry(),n=96,a=new Float32Array(n*3);for(let i=0;i<n;i++){const an=Math.random()*Math.PI*2,r=1.55+Math.random()*.26;a[i*3]=Math.cos(an)*r;a[i*3+1]=(Math.random()-.5)*2.4;a[i*3+2]=Math.sin(an)*r*.5}pg.setAttribute("position",new T.BufferAttribute(a,3));O.add(new T.Points(pg,new T.PointsMaterial({color:o.part,size:.028,transparent:true,opacity:.76})));S.add(new T.HemisphereLight(0xffffff,0x07100c,1.20));const k=new T.DirectionalLight(o.key,2.45);k.position.set(-3.2,4.8,5.2);S.add(k);const ac=new T.PointLight(o.accent,1.75,12);ac.position.set(3.2,-.9,3.5);S.add(ac);const rim=new T.PointLight(o.rim,.95,12);rim.position.set(-3,1.4,-2.2);S.add(rim);let drag=false,downX=0,downY=0,lastX=0,lastY=0,yaw=0,pitch=0,kick=0,last=performance.now(),visible=true,orbitScale=1;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,RAD960=T.MathUtils.degToRad(960);function size(){
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
   * V36.24
   * VERDE DEL MISMO TAMANO VISUAL QUE EL AMARILLO.
   * No se reduce el balon para dejar hueco a la botonera:
   * se acerca la camara y se desplaza el conjunto a la izquierda.
   */
  orbitScale=isSecond?(mob?.62:.64):(mob?.60:.62);
  O.scale.setScalar(orbitScale);
  O.position.x=0;

  const desiredDiameter=isSecond
        ? Math.min(h*(mob?.84:.86), w*(mob?.92:.94))
        : Math.min(h*(mob?.84:.86), w*(mob?.92:.94)),
        targetRadiusPx=Math.max(135,desiredDiameter*.5),
        effectiveBallRadius=1.52*sc,
        zForPixels=(effectiveBallRadius*(h*.5))/(targetRadiusPx*hf),
        minZ=isSecond?(mob?5.72:5.58):(mob?5.66:5.52);

  C.position.z=Math.max(minZ,zForPixels);

  /*
   * HERO: mover a la izquierda, pero mantener todo el balon dentro.
   * Solo reservamos el inicio real del rail, no todo un bloque enorme.
   */
  const ballRadiusPx=(effectiveBallRadius*(h*.5))/(C.position.z*hf),
        leftPad=mob?14:18,
        rightRailStart=w-(mob?82:90),
        minCenter=leftPad+ballRadiusPx,
        maxCenter=w-leftPad-ballRadiusPx,
        naturalCenter=isHero?w*(mob?.46:.47):w*.5,
        targetCenterPx=isHero
          ? Math.max(minCenter,Math.min(maxCenter,naturalCenter))
          : w*.5,
        deltaPx=targetCenterPx-w*.5,
        worldPerPx=(2*C.position.z*hf)/h;

  W.position.set(deltaPx*worldPerPx,o.y||0,0);
}
c.addEventListener("pointerdown",e=>{drag=true;downX=lastX=e.clientX;downY=lastY=e.clientY;try{c.setPointerCapture(e.pointerId)}catch(_){}});c.addEventListener("pointermove",e=>{if(!drag)return;yaw+=(e.clientX-lastX)*.009;pitch+=(e.clientY-lastY)*.007;pitch=Math.max(-1.15,Math.min(1.15,pitch));lastX=e.clientX;lastY=e.clientY});function end(e){if(!drag)return;drag=false;if(Math.hypot(e.clientX-downX,e.clientY-downY)<10&&!reduced)kick=performance.now()}c.addEventListener("pointerup",end);c.addEventListener("pointercancel",()=>drag=false);if("IntersectionObserver" in window)new IntersectionObserver(e=>visible=!!e[0]?.isIntersecting,{threshold:.02}).observe(stage);if("ResizeObserver" in window)new ResizeObserver(size).observe(stage);else addEventListener("resize",size,{passive:true});function anim(now){requestAnimationFrame(anim);if(document.hidden||!visible)return;const dt=Math.min(.05,(now-last)/1000||.016);last=now;const phase=((now%o.duration)/o.duration)*RAD960;if(!drag&&!reduced){B.rotation.y=phase+yaw;B.rotation.x=.18*Math.sin(phase*.55)+pitch;B.rotation.z=.08*Math.sin(phase*.28);O.rotation.y=-phase*.55;O.rotation.x=.22*Math.sin(phase*.35);O.rotation.z=phase*.34;M.rotation.z=.05*Math.sin(now*.0007);M.position.y=.08*Math.sin(now*.0011)}if(kick){const t=(now-kick)/900;if(t<1){const ar=Math.sin(Math.PI*t);B.position.y=ar*.24;B.position.z=ar*.14;B.scale.setScalar(1+ar*.022);O.scale.setScalar(orbitScale*(1+ar*.012))}else{kick=0;B.position.set(0,0,0);B.scale.setScalar(1);O.scale.setScalar(orbitScale)}}R.render(S,C)}size();requestAnimationFrame(anim)}
async function mount(){cleanup();second();wire();const h=q("#v14CinematicHero"),top=h?q(".v14-stage",h):null;if(top){delete top.dataset.jrV369Ready;await makeBall(top,{shell:0xf2f4f2,panel:0x0a1510,seam:0x67736c,o1:0x45ed91,o2:0x27c6ff,o3:0xa5ffd0,part:0x58ffac,key:0xffffff,accent:0x45ed91,rim:0x31baff,scale:1.38,y:0,duration:15500})}const ss=q("#jrV369SecondStage");if(ss){delete ss.dataset.jrV369Ready;await makeBall(ss,{shell:0xe5dfcf,panel:0x17130d,seam:0x736955,o1:0xffce55,o2:0xff7b24,o3:0xffef9b,part:0xffc84e,key:0xfff3cf,accent:0xffb52e,rim:0xff6830,scale:1.32,y:.02,duration:17800})}wire()}
function boot(){mount();addEventListener("pageshow",()=>setTimeout(wire,100));window.LJR_V369={version:VERSION,remount:mount,categoriesModal,go}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
