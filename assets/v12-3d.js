
(function(){
  // Replace topbar emoji with the real league crest.
  const logo=document.querySelector('.topbar .logo');
  if(logo && !logo.querySelector('img')){
    logo.innerHTML='<img src="./assets/liga-logo.webp" alt="Logo Liga Municipal de Fútbol Juventino Rosas">';
    logo.removeAttribute('aria-hidden');
  }

  // Reveal existing cards/sections without altering their click handlers.
  const targets=[...document.querySelectorAll('#view-home .section, #view-home .card')];
  targets.forEach((el,i)=>{
    if(i<26)el.classList.add('v12-reveal');
    if(el.classList.contains('card'))el.classList.add('v12-depth-card');
  });
  const io=new IntersectionObserver(entries=>{
    entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');io.unobserve(x.target)}})
  },{threshold:.08,rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.v12-reveal').forEach(el=>io.observe(el));

  // Premium tilt only on precise-pointer devices.
  if(window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.addEventListener('pointermove',e=>{
      const card=e.target.closest('.v12-depth-card');
      if(!card)return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-2px)`;
    },{passive:true});
    document.addEventListener('pointerout',e=>{
      const card=e.target.closest&&e.target.closest('.v12-depth-card');
      if(card)card.style.transform='';
    },{passive:true});
  }

  // GSAP is optional: if CDN loads, improve reveals/scroll parallax.
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.v12-stage',{
      yPercent:-7,
      ease:'none',
      scrollTrigger:{trigger:'#v12CinematicHero',start:'top top',end:'bottom top',scrub:.7}
    });
    gsap.from('.v12-orbit-chip',{
      opacity:0,scale:.75,y:18,duration:.8,stagger:.12,ease:'back.out(1.8)',delay:.25
    });
  }
})();
