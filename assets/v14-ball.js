
(function(){
 const stage=document.querySelector('.v14-stage'),canvas=document.getElementById('jrV14Canvas');
 if(!stage||!canvas)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const saveData=navigator.connection&&navigator.connection.saveData;
 if(reduced||saveData||innerWidth<520||!window.THREE){stage.classList.add('static');return}
 try{
  const T=window.THREE,scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,100);
  camera.position.set(0,0,7.05);
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  const world=new T.Group();scene.add(world);
  const ball=new T.Mesh(new T.SphereGeometry(1.52,72,72),new T.MeshPhysicalMaterial({color:0xf4f6f5,roughness:.22,metalness:.06,clearcoat:1,clearcoatRoughness:.12}));
  world.add(ball);
  const ico=new T.IcosahedronGeometry(1,0),p=ico.attributes.position,dirs=[];
  for(let i=0;i<p.count;i++){const d=new T.Vector3().fromBufferAttribute(p,i).normalize();if(!dirs.some(x=>x.distanceTo(d)<.08))dirs.push(d)}
  dirs.slice(0,12).forEach((d,i)=>{const m=new T.Mesh(new T.CircleGeometry(.245,5),new T.MeshPhysicalMaterial({color:0x08090a,roughness:.3,metalness:.16,clearcoat:.85,side:T.DoubleSide}));m.position.copy(d.clone().multiplyScalar(1.525));m.lookAt(d.clone().multiplyScalar(3));m.rotateZ(i*.39);world.add(m)});
  [[2.14,0x22e07a,.28],[2.43,0x22e07a,.17],[2.72,0x1457ff,.18]].forEach((r,i)=>{const ring=new T.Mesh(new T.TorusGeometry(r[0],.011,8,180),new T.MeshBasicMaterial({color:r[1],transparent:true,opacity:r[2]}));ring.rotation.x=.95+i*.16;ring.rotation.y=.28+i*.38;world.add(ring)});
  const count=300,geo=new T.BufferGeometry(),arr=new Float32Array(count*3);
  for(let i=0;i<count;i++){const rad=3+Math.random()*4.5,a=Math.random()*Math.PI*2,b=(Math.random()-.5)*1.7;arr[i*3]=Math.cos(a)*rad;arr[i*3+1]=b*rad*.4;arr[i*3+2]=Math.sin(a)*rad}
  geo.setAttribute('position',new T.BufferAttribute(arr,3));
  const points=new T.Points(geo,new T.PointsMaterial({color:0x86ffc1,size:.024,transparent:true,opacity:.52}));scene.add(points);
  scene.add(new T.AmbientLight(0xffffff,1.45));
  const key=new T.DirectionalLight(0xffffff,5.2);key.position.set(-3,4,5);scene.add(key);
  const green=new T.PointLight(0x22e07a,35,10);green.position.set(3,-1,3);scene.add(green);
  const blue=new T.PointLight(0x1457ff,30,10);blue.position.set(-3,-2,2);scene.add(blue);
  let mx=0,my=0,sy=0;
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  addEventListener('scroll',()=>{const r=stage.getBoundingClientRect();sy=Math.max(-1,Math.min(1,-r.top/innerHeight))},{passive:true});
  function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix()}
  new ResizeObserver(resize).observe(stage);resize();
  const clock=new T.Clock();
  (function frame(){const t=clock.getElapsedTime();ball.rotation.y=t*.23+sy*.48;ball.rotation.x=t*.075;world.rotation.z=Math.sin(t*.32)*.04;world.position.y=Math.sin(t*.7)*.08-sy*.23;world.position.x=mx*.21;camera.position.x+=(mx*.52-camera.position.x)*.035;camera.position.y+=(-my*.27-camera.position.y)*.035;camera.lookAt(0,0,0);points.rotation.y=t*.025;renderer.render(scene,camera);requestAnimationFrame(frame)})();
 }catch(e){console.warn('V14 WebGL fallback',e);stage.classList.add('static')}
})();
