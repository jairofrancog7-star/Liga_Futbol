
(function(){
 const logo=document.querySelector('.topbar .logo');
 if(logo&&!logo.querySelector('img')){logo.classList.add('v14-logo');logo.innerHTML='<img src="./assets/liga-logo.webp" alt="Liga Municipal de Fútbol Juventino Rosas A.C.">';logo.removeAttribute('aria-hidden')}
 const els=[...document.querySelectorAll('#view-home .section,#view-home .card')].slice(0,30);
 els.forEach(el=>{el.classList.add('v14-reveal');if(el.classList.contains('card'))el.classList.add('v14-depth')});
 const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.08,rootMargin:'0px 0px -36px'});
 document.querySelectorAll('.v14-reveal').forEach(x=>io.observe(x));
 if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.addEventListener('pointermove',e=>{const c=e.target.closest('.v14-depth');if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(820px) rotateX(${-y*3.5}deg) rotateY(${x*4.5}deg) translateY(-2px)`},{passive:true});
  document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.v14-depth');if(c)c.style.transform=''},{passive:true})
 }
 if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);gsap.to('.v14-stage',{yPercent:-7,ease:'none',scrollTrigger:{trigger:'#v14CinematicHero',start:'top top',end:'bottom top',scrub:.7}});gsap.from('.v14-chip',{opacity:0,scale:.78,y:16,duration:.8,stagger:.12,ease:'back.out(1.7)',delay:.2})}
})();
