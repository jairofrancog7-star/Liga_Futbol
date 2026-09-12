(function(){
  'use strict';
  const q=s=>document.querySelector(s);
  function mount(){
    const gold=q('#jrV369SecondSection'),hero=q('#v14CinematicHero');
    if(gold&&hero){
      hero.insertAdjacentElement('afterend',gold);
      gold.insertAdjacentHTML('afterbegin','<svg class="jr37-gold-frame" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x=".3" y=".3" width="99.4" height="99.4" rx="3" pathLength="100"/></svg>');
      const ticker=document.createElement('div');ticker.className='jr37-gold-ticker';ticker.setAttribute('aria-hidden','true');
      const labels=['JUVENTINO ROSAS','NUESTROS EQUIPOS','NUESTRAS CANCHAS','NUESTRA HISTORIA','FÚTBOL QUE SE SIENTE VIVO'];
      ticker.innerHTML='<div>'+[...labels,...labels].map(s=>'<span>'+s+'</span>').join('')+'</div>';gold.appendChild(ticker);
    }
    ['#view-matchcenter','#jr34Tools'].forEach(selector=>{const el=q(selector);if(el){const a=document.createElement('a');a.className='jr37-tactics-link';a.href='./tools/tactics-3d/';a.target='_blank';a.rel='noopener';a.textContent='Abrir estudio táctico 3D ↗';el.appendChild(a);}});
    // Emirates-inspired restrained entrance, adapted to the existing vanilla site.
    // Only new/owned content is animated. Reading and buttons remain available.
    if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const els=[q('#v14CinematicHero .v14-copy'),q('.jr-v369-second-copy')].filter(Boolean);
      const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){window.gsap.from(e.target,{y:24,opacity:.65,duration:.8,ease:'power3.out',clearProps:'transform,opacity'});observer.unobserve(e.target);}}),{threshold:.1});els.forEach(el=>observer.observe(el));
      const video=q('#v21FinalVideoHome video');
      if(video&&window.ScrollTrigger&&matchMedia('(pointer:fine)').matches){
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.fromTo(video,{scale:1.035},{scale:1,ease:'none',scrollTrigger:{trigger:video,start:'top bottom',end:'center center',scrub:.7}});
      }
    }
    compare();
  }
  function compare(){
    const data=window.LJR_V20?.standings_veteranos_35,host=q('#view-matchcenter');if(!data?.length||!host)return;
    const el=document.createElement('section');el.className='jr37-panel';el.id='jr37Compare';
    el.innerHTML='<h3>Frente a frente</h3><p>Veteranos 35+ · Tabla registrada de la temporada. Estadísticas descriptivas; no es un pronóstico del resultado.</p><div class="jr37-compare"><div><label for="jr37TeamA">Primer equipo</label><select id="jr37TeamA"></select><div id="jr37StatsA"></div></div><div><label for="jr37TeamB">Segundo equipo</label><select id="jr37TeamB"></select><div id="jr37StatsB"></div></div></div>';host.appendChild(el);
    ['A','B'].forEach((side,index)=>{const sel=q('#jr37Team'+side);data.forEach((team,i)=>sel.add(new Option(team.team,String(i))));sel.value=String(index?Math.min(3,data.length-1):0);const render=()=>{const t=data[Number(sel.value)],box=q('#jr37Stats'+side);box.replaceChildren();[['Puntos',t.pts],['Partidos jugados',t.jj],['Goles a favor',t.gf],['Goles recibidos',t.gc],['Diferencia',t.dg],['Goles por partido',t.jj>0?(t.gf/t.jj).toFixed(2):'Sin dato']].forEach(([label,value])=>{const row=document.createElement('div');row.className='jr37-compare-stat';const name=document.createElement('span'),number=document.createElement('b');name.textContent=label;number.textContent=String(value??'Sin dato');row.append(name,number);box.appendChild(row);});};sel.onchange=render;render();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
