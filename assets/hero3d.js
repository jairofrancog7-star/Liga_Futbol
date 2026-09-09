
(function(){
  const stage=document.querySelector('.v12-stage');
  const canvas=document.getElementById('jr3dCanvas');
  if(!stage||!canvas)return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=navigator.connection&&navigator.connection.saveData;
  const tooSmall=window.innerWidth<520;
  if(reduced||saveData||tooSmall||!window.THREE){
    stage.classList.add('static');
    return;
  }

  try{
    const THREE=window.THREE;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(34,1,.1,100);
    camera.position.set(0,0,7.1);

    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.15;

    const world=new THREE.Group();
    scene.add(world);

    // Shiny football core
    const ball=new THREE.Mesh(
      new THREE.SphereGeometry(1.5,72,72),
      new THREE.MeshPhysicalMaterial({
        color:0xf4f5f5,roughness:.24,metalness:.05,clearcoat:1,clearcoatRoughness:.14
      })
    );
    world.add(ball);

    // Stylized black pentagons based on icosahedron directions
    const ico=new THREE.IcosahedronGeometry(1,0);
    const pos=ico.attributes.position;
    const dirs=[];
    for(let i=0;i<pos.count;i++){
      const d=new THREE.Vector3().fromBufferAttribute(pos,i).normalize();
      if(!dirs.some(x=>x.distanceTo(d)<.08))dirs.push(d);
    }
    dirs.slice(0,12).forEach((d,i)=>{
      const p=new THREE.Mesh(
        new THREE.CircleGeometry(.24,5),
        new THREE.MeshPhysicalMaterial({color:0x08090a,roughness:.32,metalness:.18,clearcoat:.8,side:THREE.DoubleSide})
      );
      p.position.copy(d.clone().multiplyScalar(1.505));
      p.lookAt(d.clone().multiplyScalar(3));
      p.rotateZ(i*.38);
      world.add(p);
    });

    // Stadium-energy rings
    const ringMat=new THREE.MeshBasicMaterial({color:0x22e07a,transparent:true,opacity:.26,side:THREE.DoubleSide});
    [2.12,2.38].forEach((r,i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,160),ringMat.clone());
      ring.rotation.x=Math.PI/2.25+i*.18;
      ring.rotation.y=.35+i*.42;
      world.add(ring);
    });
    const blueRing=new THREE.Mesh(
      new THREE.TorusGeometry(2.7,.008,8,180),
      new THREE.MeshBasicMaterial({color:0x1457ff,transparent:true,opacity:.20})
    );
    blueRing.rotation.x=1.05;blueRing.rotation.z=.55;world.add(blueRing);

    // Points / sparks
    const count=300;
    const geo=new THREE.BufferGeometry();
    const arr=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const radius=3+Math.random()*4.5;
      const a=Math.random()*Math.PI*2;
      const b=(Math.random()-.5)*1.6;
      arr[i*3]=Math.cos(a)*radius;
      arr[i*3+1]=b*radius*.42;
      arr[i*3+2]=Math.sin(a)*radius;
    }
    geo.setAttribute('position',new THREE.BufferAttribute(arr,3));
    const points=new THREE.Points(geo,new THREE.PointsMaterial({color:0x84ffc0,size:.024,transparent:true,opacity:.55}));
    scene.add(points);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff,1.45));
    const key=new THREE.DirectionalLight(0xffffff,5.2);key.position.set(-3,4,5);scene.add(key);
    const green=new THREE.PointLight(0x22e07a,35,10);green.position.set(3,-1,3);scene.add(green);
    const blue=new THREE.PointLight(0x1457ff,28,10);blue.position.set(-3,-2,2);scene.add(blue);

    let px=0,py=0,scrollY=0;
    window.addEventListener('pointermove',e=>{
      px=(e.clientX/window.innerWidth-.5);
      py=(e.clientY/window.innerHeight-.5);
    },{passive:true});
    window.addEventListener('scroll',()=>{
      const r=stage.getBoundingClientRect();
      scrollY=Math.max(-1,Math.min(1,-r.top/window.innerHeight));
    },{passive:true});

    function resize(){
      const r=stage.getBoundingClientRect();
      renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
      camera.aspect=r.width/Math.max(1,r.height);
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage);resize();

    const clock=new THREE.Clock();
    function frame(){
      const t=clock.getElapsedTime();
      ball.rotation.y=t*.23+scrollY*.5;
      ball.rotation.x=t*.08;
      world.rotation.z=Math.sin(t*.32)*.04;
      world.position.y=Math.sin(t*.7)*.08-scrollY*.24;
      world.position.x=px*.22;
      camera.position.x+=(px*.55-camera.position.x)*.035;
      camera.position.y+=(-py*.28-camera.position.y)*.035;
      camera.lookAt(0,0,0);
      points.rotation.y=t*.025;
      renderer.render(scene,camera);
      requestAnimationFrame(frame);
    }
    document.body.classList.add('v12-webgl-ready');
    frame();
  }catch(err){
    console.warn('V12 WebGL fallback',err);
    stage.classList.add('static');
  }
})();
