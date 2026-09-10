(function(){
"use strict";
function boot(){
  const stage=document.querySelector("#v14CinematicHero .v14-stage");
  if(!stage||document.getElementById("jrAstraFootballScene"))return;
  const canvas=document.createElement("canvas");canvas.id="jrAstraFootballScene";canvas.setAttribute("aria-label","Escena de fútbol interactiva");stage.appendChild(canvas);
  const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr=1,w=1,h=1,px=.58,py=.42,tx=px,ty=py,last=0,angle=0,running=true;
  function resize(){
    const r=stage.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.5);
    w=Math.max(280,Math.round(r.width));h=Math.max(260,Math.round(r.height));
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());
  }
  function pitch(){
    const top=h*.37,bottom=h*.90,cx=w*.54;ctx.save();
    const g=ctx.createLinearGradient(0,top,0,bottom);g.addColorStop(0,"rgba(26,120,65,.08)");g.addColorStop(1,"rgba(18,176,88,.28)");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-w*.24,top);ctx.lineTo(cx+w*.24,top);ctx.lineTo(cx+w*.44,bottom);ctx.lineTo(cx-w*.44,bottom);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(197,255,221,.34)";ctx.lineWidth=1.4;ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,top);ctx.lineTo(cx,bottom);ctx.stroke();
    ctx.beginPath();ctx.ellipse(cx,h*.63,w*.08,h*.07,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function ball(x,y,r,rot){
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);
    const shadow=ctx.createRadialGradient(8,r*.9,2,8,r*.9,r*1.25);shadow.addColorStop(0,"rgba(0,0,0,.38)");shadow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(8,r*.95,r*1.1,r*.34,0,0,Math.PI*2);ctx.fill();
    const grad=ctx.createRadialGradient(-r*.35,-r*.42,r*.08,0,0,r);grad.addColorStop(0,"#fff");grad.addColorStop(.38,"#e9f0ec");grad.addColorStop(.78,"#aeb9b2");grad.addColorStop(1,"#65716a");
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#101713";
    [[0,0,.23],[.47,-.22,.16],[-.42,-.28,.16],[.25,.45,.15],[-.34,.43,.14]].forEach(([ax,ay,sz],i)=>{
      const rr=r*sz,xx=r*ax,yy=r*ay;ctx.beginPath();
      for(let k=0;k<5;k++){const a=-Math.PI/2+k*Math.PI*2/5+i*.2,X=xx+Math.cos(a)*rr,Y=yy+Math.sin(a)*rr;if(k===0)ctx.moveTo(X,Y);else ctx.lineTo(X,Y)}
      ctx.closePath();ctx.fill();
    });
    ctx.restore();
  }
  function particles(t){
    for(let i=0;i<22;i++){
      const seed=(i*9173)%997,x=(seed/997)*w,y=((i*71)%101)/101*h,pulse=.18+.18*Math.sin(t*.001+i);
      ctx.fillStyle=`rgba(91,255,163,${Math.max(0,pulse)})`;ctx.beginPath();ctx.arc(x,y,1+(i%3)*.35,0,Math.PI*2);ctx.fill();
    }
  }
  function draw(t){
    ctx.clearRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.58,h*.42,10,w*.58,h*.42,w*.48);glow.addColorStop(0,"rgba(69,237,145,.18)");glow.addColorStop(1,"rgba(69,237,145,0)");
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);particles(t);pitch();
    px+=(tx-px)*.045;py+=(ty-py)*.045;ball(px*w,py*h,Math.min(w,h)*.16,angle);
  }
  function loop(t){
    if(!running)return;
    if(t-last>33){last=t;if(!reduce)angle+=.012;draw(t)}
    requestAnimationFrame(loop);
  }
  stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect();tx=.50+((e.clientX-r.left)/r.width-.5)*.18;ty=.40+((e.clientY-r.top)/r.height-.5)*.10});
  stage.addEventListener("pointerleave",()=>{tx=.58;ty=.42});
  document.addEventListener("visibilitychange",()=>{running=!document.hidden;if(running){last=0;requestAnimationFrame(loop)}});
  window.addEventListener("resize",resize,{passive:true});
  resize();requestAnimationFrame(loop);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
