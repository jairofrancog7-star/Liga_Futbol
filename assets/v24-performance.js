/* MASTER V24 - performance / estabilidad */
(function(){
"use strict";
const doc=document.documentElement;
const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const lite=!!(conn&&conn.saveData) || (navigator.deviceMemory&&navigator.deviceMemory<=4) ||
           (navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4) ||
           /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

doc.classList.add("v24-ready");
if(lite) doc.classList.add("v24-lite");

function optimizeMedia(){
  const videos=[...document.querySelectorAll("video")];
  videos.forEach((v,i)=>{
    v.autoplay=false;
    v.loop=false;
    v.preload=i===0 ? "metadata" : "none";
    try{v.pause()}catch(e){}
  });

  const imgs=[...document.querySelectorAll("img")];
  imgs.forEach((img,i)=>{
    if(i>2 && !img.loading) img.loading="lazy";
    if(i>2 && !img.decoding) img.decoding="async";
  });

  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(x=>{
        const v=x.target;
        if(!x.isIntersecting){
          try{v.pause()}catch(e){}
        }
      });
    },{rootMargin:"300px 0px"});
    videos.forEach(v=>io.observe(v));
  }
}

function pauseWhenHidden(){
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      document.querySelectorAll("video").forEach(v=>{try{v.pause()}catch(e){}});
    }
  },{passive:true});
}

function boot(){
  optimizeMedia();
  pauseWhenHidden();
  // A second light pass catches media inserted after older scripts finish.
  setTimeout(optimizeMedia,1600);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();
/* MASTER V25 loader */
(function(){
  if(document.querySelector('script[data-v25-loader]'))return;
  var l=document.createElement('link');
  l.rel='stylesheet';l.href='./assets/v25-ambitious.css?v=25.0';
  document.head.appendChild(l);
  var s=document.createElement('script');
  s.src='./assets/v25-ambitious.js?v=34-1';
  s.defer=true;s.dataset.v25Loader='1';
  document.body.appendChild(s);
})();