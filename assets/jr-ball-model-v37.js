/* Liga JR: spherical truncated icosahedron, 12 pentagons + 20 hexagons.
 * Original geometry. No third-party ball logos, textures or models. */
(function(root){
  'use strict';
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const mul=(a,s)=>a.map(x=>x*s);
  const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=a=>mul(a,1/Math.hypot(...a));
  function panels(){
    const p=(1+Math.sqrt(5))/2;
    const v=[[0,1,p],[0,-1,p],[0,1,-p],[0,-1,-p],[1,p,0],[-1,p,0],[1,-p,0],[-1,-p,0],[p,0,1],[-p,0,1],[p,0,-1],[-p,0,-1]].map(unit);
    const edge=(i,j)=>Math.abs(dot(v[i],v[j])-1/Math.sqrt(5))<1e-6;
    const cut=(i,j)=>unit(add(mul(v[i],2),v[j]));
    const result=[];
    function face(points,dark){
      const center=unit(points.reduce(add,[0,0,0]));
      const u=unit(cross(center,Math.abs(center[1])>.9?[1,0,0]:[0,1,0])),w=cross(center,u);
      points.sort((a,b)=>Math.atan2(dot(a,w),dot(a,u))-Math.atan2(dot(b,w),dot(b,u)));
      result.push({dark,center,points:points.map(x=>unit(add(mul(x,.978),mul(center,.022))))});
    }
    v.forEach((_,i)=>face(v.flatMap((_,j)=>edge(i,j)?[cut(i,j)]:[]),true));
    for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)for(let c=b+1;c<12;c++){
      if(edge(a,b)&&edge(b,c)&&edge(c,a))face([cut(a,b),cut(b,a),cut(b,c),cut(c,b),cut(c,a),cut(a,c)],false);
    }
    return result;
  }
  const shape=panels();
  function mesh(T,gold){
    const group=new T.Group();
    group.add(new T.Mesh(new T.SphereGeometry(1.51,48,32),new T.MeshStandardMaterial({color:0x15191a,roughness:.85})));
    const materials=[new T.MeshPhysicalMaterial({color:gold?0xf0dfbb:0xf5f6ef,roughness:.54,metalness:.02,clearcoat:.10}),new T.MeshPhysicalMaterial({color:gold?0x342719:0x121815,roughness:.64,metalness:.02})];
    shape.forEach(face=>{
      const positions=[];
      function tri(a,b,c,depth){
        if(depth){const ab=unit(add(a,b)),bc=unit(add(b,c)),ca=unit(add(c,a));tri(a,ab,ca,depth-1);tri(ab,b,bc,depth-1);tri(ca,bc,c,depth-1);tri(ab,bc,ca,depth-1);return;}
        positions.push(...mul(a,1.52),...mul(b,1.52),...mul(c,1.52));
      }
      face.points.forEach((p,i)=>tri(face.center,p,face.points[(i+1)%face.points.length],3));
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      geo.setAttribute('normal',new T.Float32BufferAttribute(positions.map(x=>x/1.52),3));
      const panel=new T.Mesh(geo,materials[face.dark?1:0]);group.add(panel);
      // Fine accent stitching around the dark pentagons.
      if(face.dark){
        const points=[];
        face.points.forEach((a,i)=>{const b=face.points[(i+1)%face.points.length];for(let j=0;j<9;j++)points.push(new T.Vector3(...mul(unit(add(mul(a,1-j/9),mul(b,j/9))),1.525)));});
        group.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:gold?0xd9ad54:0x36bc7a,transparent:true,opacity:.48})));
      }
    });
    return group;
  }
  function fallback(stage,gold){
    const canvas=document.createElement('canvas');canvas.className='jr37-ball-fallback';canvas.setAttribute('aria-label','Balón de fútbol con pentágonos, hexágonos y costuras');canvas.setAttribute('role','img');stage.appendChild(canvas);
    const ctx=canvas.getContext('2d');if(!ctx)return canvas;
    function draw(){
      const b=stage.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height),d=Math.min(root.devicePixelRatio||1,1.5);
      canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);
      const x=w/2,y=h/2,r=Math.min(w*.37,h*.36);
      const rotate=a=>{const c=.87,s=.493;return [c*a[0]+s*a[2],a[1]*.97-(c*a[2]-s*a[0])*.243,a[1]*.243+(c*a[2]-s*a[0])*.97];};
      ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(x,y);
      ctx.strokeStyle=gold?'#d9ad5480':'#36bc7a80';ctx.lineWidth=1;
      [0,.5,-.35].forEach((a,i)=>{ctx.beginPath();ctx.ellipse(0,0,r*1.24,r*(.46+i*.10),a,0,Math.PI*2);ctx.stroke();});
      ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle='#18221c';ctx.fill();ctx.clip();
      const faces=shape.map(f=>({...f,center:rotate(f.center),points:f.points.map(rotate)})).sort((a,b)=>a.center[2]-b.center[2]);
      faces.forEach(f=>{ctx.beginPath();f.points.forEach((a,i)=>{const b=f.points[(i+1)%f.points.length];for(let j=0;j<16;j++){const p=unit(add(mul(a,1-j/16),mul(b,j/16)));if(i===0&&j===0)ctx.moveTo(p[0]*r,-p[1]*r);else ctx.lineTo(p[0]*r,-p[1]*r);}});ctx.closePath();
        ctx.fillStyle=f.dark?(gold?'#403122':'#121b17'):(gold?'#e8d4a3':'#eff4ed');ctx.fill();ctx.strokeStyle=f.dark?(gold?'#ba944d':'#2b8760'):'#445249';ctx.lineWidth=.8;ctx.stroke();});
      const g=ctx.createRadialGradient(-r*.4,-r*.4,r*.05,r*.2,r*.25,r*1.13);g.addColorStop(0,'#ffffff48');g.addColorStop(.55,'#00000000');g.addColorStop(1,'#000000bb');ctx.fillStyle=g;ctx.fillRect(-r,-r,2*r,2*r);ctx.restore();
    }
    if(root.ResizeObserver)new ResizeObserver(draw).observe(stage);else root.addEventListener('resize',draw);draw();
    return canvas;
  }
  root.JRBallModel={mesh,fallback,panels:shape};
  if(typeof module!=='undefined')module.exports={panels:shape};
})(typeof window!=='undefined'?window:globalThis);
