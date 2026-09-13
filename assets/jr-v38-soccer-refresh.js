
/* ==========================================================
   LIGA JUVENTINO ROSAS V38 — SOCCER-ONLY HIGGSFIELD REFRESH
   ========================================================== */
(function(){
  'use strict';
  if(window.__JR39SoccerRefresh) return;
  window.__JR39SoccerRefresh = true;
  document.documentElement.classList.add('jr39-js');

  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false,addEventListener(){}};
  const coarse=window.matchMedia?matchMedia('(pointer: coarse)'):{matches:false};
  const saveData=!!(navigator.connection&&navigator.connection.saveData);
  const STORE='jr39-motion-enabled';
  let motionEnabled=true;
  try{motionEnabled=localStorage.getItem(STORE)!=='0';}catch(_){}
  const managed=new Set();

  const ASSETS={
    hero:'./assets/motion/v38-soccer-hero.mp4',
    matchday:'./assets/motion/v38-soccer-matchday.mp4',
    fields:'./assets/motion/v38-soccer-fields-rain.mp4',
    teams:'./assets/motion/v38-soccer-teams.mp4',
    bracket:'./assets/motion/v38-soccer-liguilla.mp4',
    stats:'./assets/motion/v38-soccer-stats.mp4'
  };

  const VIEW_CONFIG={
    matches:{asset:'matchday',kicker:'JORNADAS · FÚTBOL ASOCIACIÓN',title:'Partidos y resultados',desc:'Tarjetas de jornada más claras, rápidas y pensadas para la liga municipal.',pills:['Jornada','Horarios','Campos']},
    matchcenter:{asset:'matchday',kicker:'MATCH CENTER',title:'El partido, en vivo.',desc:'Marcador, eventos, alineaciones y contexto del encuentro sin perder la identidad de la Liga.',pills:['LIVE','Eventos','Alineaciones']},
    fields:{asset:'fields',kicker:'CAMPOS · COMUNIDADES Y RANCHOS',title:'Primero revisa el terreno.',desc:'El pronóstico, la inspección del campo y la decisión oficial son tres cosas diferentes.',pills:['Pronóstico','Terreno','Decisión oficial']},
    teams:{asset:'teams',kicker:'EQUIPOS Y JUGADORES',title:'La liga tiene nombres propios.',desc:'Perfiles, escudos y plantillas con una presentación más deportiva y cinematográfica.',pills:['Equipos','Jugadores','Categorías']},
    bracket:{asset:'bracket',kicker:'COPA · LIGUILLA',title:'Cada cruce cuenta.',desc:'La fase final gana una presencia premium sin inventar resultados ni modificar los datos oficiales.',pills:['Cuartos','Semifinal','Final']},
    table:{asset:'stats',kicker:'TABLA Y ESTADÍSTICAS',title:'La temporada, de un vistazo.',desc:'Posiciones, goleadores y rendimiento con jerarquía visual y movimiento contenido.',pills:['Tabla','Goleadores','Rendimiento']},
    stats:{asset:'stats',kicker:'ANÁLISIS DE FÚTBOL',title:'Datos dentro de la cancha.',desc:'Táctica y visualización inspiradas en fútbol asociación, no en fútbol americano.',pills:['Formación','Táctica','Estadísticas']}
  };

  function allowed(){return motionEnabled&&!reduced.matches&&!saveData&&!document.hidden}

  function makeVideo(src,cls){
    if(reduced.matches||saveData) return null;
    const v=document.createElement('video');
    v.className=cls||'';
    v.src=src;
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';
    v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');
    v.tabIndex=-1;v.dataset.jr39Visible='false';
    v.addEventListener('error',()=>{managed.delete(v);v.remove()},{once:true});
    managed.add(v);
    if(videoObserver) videoObserver.observe(v); else v.dataset.jr39Visible='true';
    return v;
  }

  function refreshVideo(v){
    const visible=v.dataset.jr39Visible==='true';
    if(allowed()&&visible){
      const p=v.play();if(p&&p.catch)p.catch(()=>{});
    }else v.pause();
  }
  function refreshAll(){managed.forEach(v=>document.body.contains(v)?refreshVideo(v):managed.delete(v))}
  const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(e=>{e.target.dataset.jr39Visible=(e.isIntersecting&&e.intersectionRatio>.08)?'true':'false'});
    refreshAll();
  },{threshold:[0,.08,.25]}):null;

  function setMotion(on){
    motionEnabled=!!on;
    try{localStorage.setItem(STORE,on?'1':'0')}catch(_){}
    qa('.jr39-motion-toggle').forEach(b=>{
      b.setAttribute('aria-pressed',on?'true':'false');
      b.textContent=on?'Movimiento: ON':'Movimiento: OFF';
    });
    refreshAll();
  }

  function mountHero(){
    const hero=q('#v14CinematicHero');
    if(!hero) return;
    document.body.classList.add('jr39-ready');
    const stage=q('.v14-stage',hero);
    if(stage&&!q('.jr39-home-video',stage)){
      const v=makeVideo(ASSETS.hero,'jr39-home-video');
      if(v) stage.insertBefore(v,stage.firstChild);
    }
    const actions=q('.v14-actions',hero);
    if(actions&&!q('.jr39-motion-toggle',actions)){
      const b=document.createElement('button');
      b.type='button';b.className='ghost-btn jr39-motion-toggle';
      b.setAttribute('aria-pressed',motionEnabled?'true':'false');
      b.textContent=motionEnabled?'Movimiento: ON':'Movimiento: OFF';
      if(reduced.matches||saveData){b.disabled=true;b.textContent=reduced.matches?'Movimiento reducido':'Ahorro de datos'}
      b.addEventListener('click',()=>setMotion(!motionEnabled));
      actions.appendChild(b);
    }
    if(stage&&!coarse.matches&&!reduced.matches){
      let raf=0,x=0,y=0;
      const paint=()=>{raf=0;stage.style.setProperty('--jr39-px',x+'px');stage.style.setProperty('--jr39-py',y+'px')};
      stage.addEventListener('pointermove',ev=>{
        const r=stage.getBoundingClientRect();
        x=((ev.clientX-r.left)/Math.max(1,r.width)-.5)*-12;
        y=((ev.clientY-r.top)/Math.max(1,r.height)-.5)*-9;
        if(!raf)raf=requestAnimationFrame(paint);
      });
      stage.addEventListener('pointerleave',()=>{x=0;y=0;if(!raf)raf=requestAnimationFrame(paint)});
    }
  }

  function bannerFor(viewId,view){
    const cfg=VIEW_CONFIG[viewId];
    if(!cfg||!view||q('.jr39-view-banner',view)) return;
    const banner=document.createElement('section');
    banner.className='jr39-view-banner jr39-reveal';
    banner.setAttribute('aria-label',cfg.title);
    const v=makeVideo(ASSETS[cfg.asset],'');
    if(v) banner.appendChild(v);
    const inner=document.createElement('div');
    inner.className='jr39-banner-inner';
    inner.innerHTML=`<div class="jr39-banner-kicker">${cfg.kicker}</div><h2>${cfg.title}</h2><p>${cfg.desc}</p><div class="jr39-banner-pills">${cfg.pills.map(x=>`<span>${x}</span>`).join('')}</div>`;
    banner.appendChild(inner);
    view.insertBefore(banner,view.firstChild);
  }

  function scanViews(){
    Object.keys(VIEW_CONFIG).forEach(id=>{
      const view=q('#view-'+id);
      if(view) bannerFor(id,view);
    });
  }

  function mountOps(){
    if(q('#jr39Ops')) return;
    const home=q('#view-home');
    const hero=q('#v14CinematicHero');
    if(!home) return;
    const s=document.createElement('section');
    s.id='jr39Ops';s.className='section jr39-reveal';
    s.setAttribute('aria-label','Central de clima, estado del campo y decisión oficial');
    s.innerHTML=`
      <div class="jr39-ops-head">
        <div><div class="eyebrow">CENTRAL OPERATIVA V38</div><h2>Clima ≠ terreno ≠ decisión oficial</h2>
        <p>Un porcentaje de lluvia nunca suspende por sí solo un partido. La Liga conserva la decisión oficial.</p></div>
      </div>
      <div class="jr39-ops-grid">
        <article class="jr39-op weather"><small>🌧 Pronóstico</small><strong>Referencia meteorológica</strong><p>Se etiqueta como regional cuando no existen coordenadas exactas verificadas del campo.</p></article>
        <article class="jr39-op field"><small>🏟 Estado del terreno</small><strong id="jr39FieldStatus">Sin revisión reciente</strong><p id="jr39FieldText">Apto, En revisión, Pesado, No apto, Cerrado o Sin revisión.</p></article>
        <article class="jr39-op official"><small>✓ Decisión oficial</small><strong id="jr39OfficialStatus">La Liga confirma</strong><p>Programado, Por confirmar, Retrasado o Suspendido.</p></article>
      </div>
      <div class="jr39-actions"><button type="button" class="primary-btn" data-view="fields">Revisar campos →</button><button type="button" class="ghost-btn" data-view="matches">Ver jornada</button></div>`;
    if(hero&&hero.parentNode) hero.insertAdjacentElement('afterend',s); else home.prepend(s);
  }

  async function hydrateOps(){
    const fs=q('#jr39FieldStatus'),ft=q('#jr39FieldText'),os=q('#jr39OfficialStatus');
    if(!fs||!os) return;
    try{
      const r=await fetch('./data/field-status-v37.json',{cache:'no-store'});
      if(!r.ok) throw new Error();
      const d=await r.json(),now=Date.now();
      const reports=Object.values(d.reports||{}).filter(x=>{
        const t=Date.parse(x&&x.reviewedAt);return Number.isFinite(t)&&t<=now&&now-t<=12*60*60*1000;
      });
      fs.textContent=reports.length?`${reports.length} campo${reports.length===1?'':'s'} con revisión reciente`:'Sin revisión reciente';
      ft.textContent=reports.length?'Abre Campos para consultar la revisión y su hora.':'Una revisión vencida no se presenta como “Apto”.';
      const m=Object.values(d.matches||{}).filter(x=>x&&['scheduled','pending','delayed','suspended'].includes(x.status));
      const c=m.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{});
      const p=[];
      if(c.scheduled)p.push(`${c.scheduled} programado${c.scheduled===1?'':'s'}`);
      if(c.pending)p.push(`${c.pending} por confirmar`);
      if(c.delayed)p.push(`${c.delayed} retrasado${c.delayed===1?'':'s'}`);
      if(c.suspended)p.push(`${c.suspended} suspendido${c.suspended===1?'':'s'}`);
      os.textContent=p.length?p.join(' · '):'La Liga confirma';
    }catch(_){fs.textContent='Consulta la vista Campos';os.textContent='Consulta el estado oficial'}
  }

  function modernButtons(root=document){
    if(coarse.matches) return;
    qa('.primary-btn,.ghost-btn,.btn-primary,.btn-ghost,.nav-btn,.tab-btn,button[data-view]',root).forEach(btn=>{
      if(btn.dataset.jr39Pointer) return;
      btn.dataset.jr39Pointer='1';
      btn.addEventListener('pointermove',ev=>{
        const r=btn.getBoundingClientRect();
        btn.style.setProperty('--jr39-x',Math.round(ev.clientX-r.left)+'px');
        btn.style.setProperty('--jr39-y',Math.round(ev.clientY-r.top)+'px');
      });
    });
  }

  function navigation(){
    document.addEventListener('click',ev=>{
      const b=ev.target.closest('#jr39Ops [data-view]');
      if(!b) return;
      if(typeof window.showView==='function'){ev.preventDefault();window.showView(b.dataset.view)}
    });
  }

  let revealObserver=null;
  function reveals(){
    const all=qa('.jr39-reveal,#view-home > .section,#view-home > .card,.table-wrap,.matchday-bar');
    all.forEach(el=>el.classList.add('jr39-reveal'));
    if(reduced.matches||!('IntersectionObserver'in window)){all.forEach(el=>el.classList.add('jr39-visible'));return}
    if(!revealObserver) revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('jr39-visible');revealObserver.unobserve(e.target)}
    }),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
    all.forEach(el=>{if(!el.classList.contains('jr39-visible'))revealObserver.observe(el)});
  }

  function init(){
    mountHero();mountOps();scanViews();modernButtons();navigation();reveals();hydrateOps();refreshAll();
    const mo=new MutationObserver(()=>{scanViews();modernButtons();reveals()});
    mo.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('visibilitychange',refreshAll);
    if(reduced.addEventListener) reduced.addEventListener('change',refreshAll);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();