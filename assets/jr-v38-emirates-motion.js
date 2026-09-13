/* ==========================================================
   LIGA JUVENTINO ROSAS — V38 EMIRATES MOTION FIX7
   Video-centric motion layer; no business-data replacement.
   ========================================================== */
(function(){
  'use strict';
  if(window.__JR40EmiratesMotion) return;
  window.__JR40EmiratesMotion=true;
  document.documentElement.classList.add('jr40-js');

  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false,addEventListener(){}};
  const coarse=window.matchMedia?matchMedia('(pointer: coarse)'):{matches:false};
  const saveData=!!(navigator.connection&&navigator.connection.saveData);
  const managed=new Set();

  const ASSETS={
    hero:'./assets/motion/v38-soccer-hero.mp4',
    matches:'./assets/motion/v38-soccer-matchday.mp4',
    matchcenter:'./assets/motion/v38-emirates-matchcenter.mp4',
    fields:'./assets/motion/v38-soccer-fields-rain.mp4',
    teams:'./assets/motion/v38-emirates-teams.mp4',
    bracket:'./assets/motion/v38-soccer-liguilla.mp4',
    table:'./assets/motion/v38-emirates-table.mp4',
    stats:'./assets/motion/v38-emirates-stats.mp4',
    more:'./assets/motion/v38-emirates-community.mp4'
  };

  const VIEW_CONFIG={
    matches:{asset:'matches',kicker:'JORNADA · MATCHDAY',title:'Partidos y resultados',desc:'La jornada entra primero por los ojos y después por los datos. Horarios, campos y resultados siguen siendo HTML y datos reales.',pills:['Jornada','Horarios','Campos']},
    matchcenter:{asset:'matchcenter',kicker:'LIVE · MATCH CENTER',title:'El partido se siente en vivo.',desc:'Una entrada cinematográfica distinta para el seguimiento del encuentro, sin reemplazar marcador, eventos ni alineaciones.',pills:['LIVE','Eventos','Alineaciones']},
    fields:{asset:'fields',kicker:'CAMPOS · CLIMA',title:'Primero mira el terreno.',desc:'El pronóstico, la revisión física del campo y la decisión oficial siguen separados.',pills:['Pronóstico','Terreno','Decisión']},
    teams:{asset:'teams',kicker:'EQUIPOS · JUGADORES',title:'La liga tiene nombres propios.',desc:'Presentación de equipos con lenguaje visual de club premium, conservando escudos y datos de la Liga.',pills:['Equipos','Jugadores','Categorías']},
    bracket:{asset:'bracket',kicker:'COPA · LIGUILLA',title:'Cada cruce cuenta.',desc:'La fase final recibe un tratamiento más ceremonial y cinematográfico sin inventar resultados.',pills:['Cuartos','Semifinal','Final']},
    table:{asset:'table',kicker:'TABLA · TEMPORADA',title:'La temporada, de un vistazo.',desc:'Una cancha nocturna distinta para la tabla. Ningún video se reutiliza aquí como fondo de Estadísticas.',pills:['Tabla','Puntos','Rendimiento']},
    stats:{asset:'stats',kicker:'DATOS · RENDIMIENTO',title:'Datos dentro de la cancha.',desc:'Movimiento táctico y tracking visual para estadísticas y goleadores, separado del video de Tabla.',pills:['Goleo','Forma','Análisis']},
    more:{asset:'more',kicker:'COMUNIDAD · LIGA',title:'Fútbol que también vive fuera de la cancha.',desc:'Herramientas, historias y comunidad con una película propia del fútbol municipal de Guanajuato.',pills:['Comunidad','Historias','Herramientas']}
  };

  function motionAllowed(){
    return !reduced.matches&&!saveData&&!document.hidden;
  }

  function makeVideo(src,cls){
    if(!src||reduced.matches||saveData) return null;
    const v=document.createElement('video');
    v.className=cls||'';
    v.dataset.src=src;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.preload='none';
    v.setAttribute('muted','');
    v.setAttribute('playsinline','');
    v.setAttribute('aria-hidden','true');
    v.tabIndex=-1;
    v.dataset.jr40Visible='false';
    v.addEventListener('error',()=>{managed.delete(v);v.remove()},{once:true});
    managed.add(v);
    if(videoObserver) videoObserver.observe(v);
    return v;
  }

  function ensureSource(v){
    if(!v.src&&v.dataset.src){
      v.src=v.dataset.src;
      v.preload='metadata';
      v.load();
    }
  }

  function refreshVideo(v){
    const visible=v.dataset.jr40Visible==='true';
    if(visible&&motionAllowed()){
      ensureSource(v);
      const p=v.play();
      if(p&&p.catch)p.catch(()=>{});
    }else{
      v.pause();
    }
  }

  function refreshAll(){
    managed.forEach(v=>{
      if(!document.body.contains(v)){managed.delete(v);return}
      refreshVideo(v);
    });
  }

  const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const v=e.target;
      const visible=e.isIntersecting&&e.intersectionRatio>.04;
      v.dataset.jr40Visible=visible?'true':'false';
      if(visible) ensureSource(v);
    });
    refreshAll();
  },{threshold:[0,.04,.2],rootMargin:'220px 0px 220px 0px'}):null;

  function createProgress(){
    if(q('#jr40Progress')) return;
    const bar=document.createElement('div');
    bar.id='jr40Progress';
    bar.setAttribute('aria-hidden','true');
    bar.innerHTML='<i></i>';
    document.body.appendChild(bar);
    const line=q('i',bar);
    let raf=0;
    const paint=()=>{
      raf=0;
      const root=document.documentElement;
      const max=Math.max(1,root.scrollHeight-innerHeight);
      const p=Math.max(0,Math.min(1,scrollY/max));
      line.style.transform=`scaleX(${p})`;
    };
    addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});
    addEventListener('resize',paint,{passive:true});
    paint();
  }

  function bannerFor(viewId,view){
    const cfg=VIEW_CONFIG[viewId];
    if(!cfg||!view||q('.jr40-view-banner',view)) return;
    const banner=document.createElement('section');
    banner.className='jr40-view-banner jr40-reveal';
    banner.dataset.jr40View=viewId;
    banner.setAttribute('aria-label',cfg.title);

    const video=makeVideo(ASSETS[cfg.asset],'jr40-banner-video');
    if(video) banner.appendChild(video);

    const inner=document.createElement('div');
    inner.className='jr40-banner-inner';
    inner.innerHTML=`
      <div class="jr40-kicker">${cfg.kicker}</div>
      <h2>${cfg.title}</h2>
      <p>${cfg.desc}</p>
      <div class="jr40-banner-meta">${cfg.pills.map(x=>`<span>${x}</span>`).join('')}</div>`;
    banner.appendChild(inner);
    view.insertBefore(banner,view.firstChild);
  }

  function scanViews(){
    Object.keys(VIEW_CONFIG).forEach(id=>{
      const view=q('#view-'+id);
      if(view) bannerFor(id,view);
    });
  }

  function go(view){
    if(typeof window.showView==='function'){window.showView(view);return}
    const target=q('#view-'+view);
    if(target) target.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
  }

  function filmCard(asset,kicker,title,desc,view){
    const a=document.createElement('article');
    a.className='jr40-film-card jr40-reveal';
    const v=makeVideo(ASSETS[asset],'');
    if(v) a.appendChild(v);
    const copy=document.createElement('div');
    copy.className='jr40-film-copy';
    copy.innerHTML=`<small>${kicker}</small><h3>${title}</h3><p>${desc}</p><button type="button" class="ghost-btn jr40-film-open" data-jr40-view="${view}">Abrir sección →</button>`;
    a.appendChild(copy);
    return a;
  }

  function mountFilmRail(){
    const home=q('#view-home');
    if(!home||q('#jr40FilmRail')) return;
    const rail=document.createElement('section');
    rail.id='jr40FilmRail';
    rail.className='section';
    rail.innerHTML=`
      <div class="jr40-film-heading jr40-reveal">
        <div><div class="eyebrow">LIGA EN MOVIMIENTO</div><h2>Cada sección tiene su propia película.</h2></div>
        <p>Más cercano al lenguaje de Emirates Sport Club: video como atmósfera, datos en HTML, scroll cinematográfico y controles vivos.</p>
      </div>
      <div class="jr40-film-grid"></div>`;
    const grid=q('.jr40-film-grid',rail);
    grid.append(
      filmCard('table','TEMPORADA','La tabla se juega.', 'Posiciones y rendimiento con una cancha nocturna propia.','table'),
      filmCard('teams','EQUIPOS','Vestimos los colores.', 'Plantillas y jugadores con una entrada distinta, no reciclada.','teams'),
      filmCard('more','COMUNIDAD','Fútbol de nuestra gente.', 'Historias, herramientas y vida alrededor de la Liga.','more'),
      filmCard('stats','DATOS','Leer el partido.', 'Tracking visual y movimiento para estadísticas y goleadores.','stats')
    );
    const after=q('#jr39Ops')||q('#jr38Ops')||q('#v14CinematicHero');
    if(after&&after.parentNode) after.insertAdjacentElement('afterend',rail);
    else home.appendChild(rail);
  }

  function magneticButtons(root=document){
    if(coarse.matches||reduced.matches) return;
    qa('.primary-btn,.ghost-btn,.btn-primary,.btn-ghost,.nav-btn,.tab-btn,button[data-view],.jr40-film-open',root).forEach(btn=>{
      if(btn.dataset.jr40Magnetic) return;
      btn.dataset.jr40Magnetic='1';
      btn.classList.add('jr40-magnetic');
      btn.addEventListener('pointermove',ev=>{
        const r=btn.getBoundingClientRect();
        const x=(ev.clientX-r.left-r.width/2)*.08;
        const y=(ev.clientY-r.top-r.height/2)*.12;
        btn.style.setProperty('--jr40-tx',x.toFixed(1)+'px');
        btn.style.setProperty('--jr40-ty',y.toFixed(1)+'px');
      });
      btn.addEventListener('pointerleave',()=>{
        btn.style.setProperty('--jr40-tx','0px');
        btn.style.setProperty('--jr40-ty','0px');
      });
      btn.addEventListener('click',ev=>{
        const r=btn.getBoundingClientRect();
        const s=document.createElement('i');
        s.className='jr40-ripple';
        s.style.left=(ev.clientX-r.left)+'px';
        s.style.top=(ev.clientY-r.top)+'px';
        btn.appendChild(s);
        setTimeout(()=>s.remove(),700);
      });
    });
  }

  function tiltFilmCards(){
    if(coarse.matches||reduced.matches) return;
    qa('.jr40-film-card').forEach(card=>{
      if(card.dataset.jr40Tilt) return;
      card.dataset.jr40Tilt='1';
      card.addEventListener('pointermove',ev=>{
        const r=card.getBoundingClientRect();
        const nx=(ev.clientX-r.left)/Math.max(1,r.width)-.5;
        const ny=(ev.clientY-r.top)/Math.max(1,r.height)-.5;
        card.style.setProperty('--jr40-card-y',(nx*4.5).toFixed(2)+'deg');
        card.style.setProperty('--jr40-card-x',(-ny*3.6).toFixed(2)+'deg');
      });
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--jr40-card-x','0deg');
        card.style.setProperty('--jr40-card-y','0deg');
      });
    });
  }

  let revealObserver=null;
  function reveals(){
    const all=qa('.jr40-reveal');
    if(reduced.matches||!('IntersectionObserver'in window)){
      all.forEach(x=>x.classList.add('jr40-visible'));
      return;
    }
    if(!revealObserver) revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('jr40-visible');
          revealObserver.unobserve(e.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    all.forEach(x=>{
      if(!x.classList.contains('jr40-visible')) revealObserver.observe(x);
    });
  }

  function gsapEnhance(){
    if(reduced.matches||saveData||!window.gsap||!window.ScrollTrigger) return;
    try{
      gsap.registerPlugin(ScrollTrigger);

      qa('.jr40-view-banner').forEach(banner=>{
        const video=q('video',banner);
        const inner=q('.jr40-banner-inner',banner);
        if(video){
          gsap.fromTo(video,{scale:1.07},{scale:1.00,ease:'none',scrollTrigger:{
            trigger:banner,start:'top bottom',end:'bottom top',scrub:.65
          }});
          gsap.to(video,{yPercent:8,ease:'none',scrollTrigger:{
            trigger:banner,start:'top bottom',end:'bottom top',scrub:.8
          }});
        }
        if(inner){
          gsap.from(inner,{y:46,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{
            trigger:banner,start:'top 76%',toggleActions:'play none none reverse'
          }});
        }
      });

      gsap.utils.toArray('.jr40-film-card').forEach((card,i)=>{
        gsap.from(card,{y:54,opacity:0,duration:.85,delay:(i%2)*.05,ease:'power3.out',scrollTrigger:{
          trigger:card,start:'top 88%',toggleActions:'play none none reverse'
        }});
      });
    }catch(_){}
  }

  function loadLenis(){
    if(reduced.matches||saveData||coarse.matches||innerWidth<900||window.__JR40LenisStarted) return;
    window.__JR40LenisStarted=true;

    function start(){
      if(!window.Lenis) return;
      try{
        const lenis=new Lenis({autoRaf:false,duration:1.05,smoothWheel:true,wheelMultiplier:.9});
        window.__JR40Lenis=lenis;
        if(window.gsap&&window.ScrollTrigger){
          lenis.on('scroll',ScrollTrigger.update);
          gsap.ticker.add(time=>lenis.raf(time*1000));
          gsap.ticker.lagSmoothing(0);
        }else{
          const raf=time=>{lenis.raf(time);requestAnimationFrame(raf)};
          requestAnimationFrame(raf);
        }
      }catch(_){}
    }

    if(window.Lenis){start();return}
    const s=document.createElement('script');
    s.src='https://unpkg.com/lenis@1.3.26/dist/lenis.min.js';
    s.async=true;
    s.onload=start;
    s.onerror=()=>{window.__JR40LenisStarted=false};
    document.head.appendChild(s);
  }

  function events(){
    document.addEventListener('click',ev=>{
      const b=ev.target.closest('[data-jr40-view]');
      if(!b) return;
      ev.preventDefault();
      go(b.dataset.jr40View);
    });
    document.addEventListener('visibilitychange',refreshAll);
  }

  function init(){
    document.body.classList.add('jr40-emirates');
    createProgress();
    scanViews();
    mountFilmRail();
    magneticButtons();
    tiltFilmCards();
    reveals();
    events();
    refreshAll();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{gsapEnhance();loadLenis()}));

    const mo=new MutationObserver(()=>{
      scanViews();
      magneticButtons();
      tiltFilmCards();
      reveals();
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();