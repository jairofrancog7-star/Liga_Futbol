
(function(){
'use strict';
if(window.__JR44Fix12)return; window.__JR44Fix12=true;

const BUILD='38-12';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const mobile=(innerWidth<780)||(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const FPS=mobile?8:12;
const SOURCE_URLS=[
 './assets/motion/v38-fix12-motion-hero-lite.mp4',
 './assets/motion/v38-fix12-motion-field-lite.mp4',
 './assets/motion/v38-fix12-motion-tactics-lite.mp4'
];
const sourceCount=mobile?1:3;
const sources=[];
const animated=new Set();
let cardObserver=null,lastFrame=0,raf=0;

function normalize(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

/* ---------- cache / refresh ---------- */
function refreshBuild(){
 try{
  const old=localStorage.getItem('jr44-build');
  localStorage.setItem('jr44-build',BUILD);
  if(old!==BUILD && 'caches' in window)caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).catch(()=>{});
  if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

/* ---------- shared-video compositor ---------- */
function initSources(){
 if(reduced.matches||saveData)return;
 const host=document.createElement('div');host.id='jr44VideoSources';document.body.appendChild(host);
 for(let i=0;i<sourceCount;i++){
  const v=document.createElement('video');
  v.src=SOURCE_URLS[i];v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';
  v.setAttribute('muted','');v.setAttribute('playsinline','');host.appendChild(v);sources.push(v);
  const p=v.play();if(p&&p.catch)p.catch(()=>{});
 }
 const a=document.createElement('canvas');a.id='jr44AmbientCanvas';a.width=640;a.height=360;
 const shade=document.createElement('div');shade.id='jr44AmbientShade';
 document.body.prepend(shade);document.body.prepend(a);
 cardObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
   if(e.isIntersecting&&e.intersectionRatio>.01)animated.add(e.target);
   else animated.delete(e.target);
 }),{threshold:[0,.01,.15],rootMargin:'80px 0px'});
 raf=requestAnimationFrame(render);
}
function drawCover(ctx,v,w,h,seed,t){
 if(!v||v.readyState<2||!v.videoWidth)return;
 const vw=v.videoWidth,vh=v.videoHeight;
 const scale=Math.max(w/vw,h/vh)*1.08;
 const sw=w/scale,sh=h/scale;
 const roomX=Math.max(0,vw-sw),roomY=Math.max(0,vh-sh);
 const sx=roomX*(.5+.23*Math.sin(t/2900+seed*1.7));
 const sy=roomY*(.5+.14*Math.cos(t/3400+seed*2.1));
 ctx.clearRect(0,0,w,h);
 try{ctx.drawImage(v,sx,sy,sw,sh,0,0,w,h)}catch(_){}
}
function sizeCanvas(canvas,el,ambient=false){
 if(ambient){const w=mobile?360:640,h=mobile?640:360;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}return}
 const r=el.getBoundingClientRect(),cap=mobile?220:420;
 const scale=Math.min(1,cap/Math.max(1,r.width));
 const w=Math.max(120,Math.round(r.width*scale));
 const h=Math.max(70,Math.round(r.height*scale));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
}
function render(t){
 raf=requestAnimationFrame(render);
 if(document.hidden||reduced.matches||saveData||!sources.length)return;
 if(t-lastFrame<1000/FPS)return;lastFrame=t;
 const amb=q('#jr44AmbientCanvas');
 if(amb&&sources[0]){sizeCanvas(amb,null,true);drawCover(amb.getContext('2d',{alpha:false}),sources[0],amb.width,amb.height,2,t)}
 animated.forEach(el=>{
  if(!document.body.contains(el)){animated.delete(el);return}
  const c=q(':scope > .jr44-motion-canvas',el)||q(':scope > .jr44-stage-motion',el);
  if(!c)return;
  sizeCanvas(c,el);
  const idx=mobile?0:(+el.dataset.jr44Source||0)%sources.length;
  const seed=+el.dataset.jr44Seed||1;
  drawCover(c.getContext('2d',{alpha:false}),sources[idx],c.width,c.height,seed,t);
 });
}
function addMotion(el,stage=false,index=0){
 if(!el||el.dataset.jr44Motion)return;
 const r=el.getBoundingClientRect();
 if(!stage && (r.width<145||r.height<58))return;
 el.dataset.jr44Motion='1';el.dataset.jr44Source=String(index%Math.max(1,sourceCount));
 el.dataset.jr44Seed=String((index*7+3)%31);
 if(stage){
   const c=document.createElement('canvas');c.className='jr44-stage-motion';
   const shade=document.createElement('span');shade.className='jr44-stage-shade';
   el.insertBefore(shade,el.firstChild);el.insertBefore(c,el.firstChild);
 }else{
   el.classList.add('jr44-motion-card');
   const c=document.createElement('canvas');c.className='jr44-motion-canvas';
   const shade=document.createElement('span');shade.className='jr44-motion-shade';
   el.insertBefore(shade,el.firstChild);el.insertBefore(c,el.firstChild);
 }
 if(cardObserver)cardObserver.observe(el);
}
function decorateAll(){
 if(reduced.matches||saveData)return;
 let i=0;
 const selectors=[
  '.card','.section','.table-wrap','.matchday-bar',
  '.match-card','.match-row','.fixture-card','.fixture','.team-card','.stat-card',
  '.tool-card','.access-card','.feature-card','.sponsor-card','.news-card',
  '.jr-card','.panel','.glass-card','.credential-card',
  '[class*="card"]:not(button):not(a)','[class*="panel"]:not(button):not(a)'
 ].join(',');
 qa(selectors).forEach(el=>{
   if(el.closest('#jr44Register')||el.id==='v14CinematicHero'||el.id==='jr44CredentialTools'||el.dataset.jr44Motion)return;
   addMotion(el,false,i++);
 });
 const stage=q('#v14CinematicHero .v14-stage');if(stage)addMotion(stage,true,i++);
}
function fixHeroTitle(){
 const hero=q('#v14CinematicHero'),title=hero&&q('.v14-title',hero);
 if(title)title.innerHTML='<span class="outline">FÚTBOL</span><span class="electric">QUE SE SIENTE</span><span class="jr37-live">EN VIVO.</span>';
}
function hookViews(){
 if(typeof window.showView==='function'&&!window.showView.__jr44){
   const old=window.showView;
   const wrapped=function(){const r=old.apply(this,arguments);setTimeout(decorateAll,60);setTimeout(credentialLauncher,80);return r};
   wrapped.__jr44=true;window.showView=wrapped;
 }
 document.addEventListener('click',()=>setTimeout(()=>{decorateAll();credentialLauncher()},90),{passive:true});
}

/* ---------- interactive buttons ---------- */
function buttons(){
 qa('button,.primary-btn,.ghost-btn,.btn-primary,.btn-ghost').forEach(b=>{
  if(b.dataset.jr44Button)return;b.dataset.jr44Button='1';
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--jr44-x',(e.clientX-r.left)+'px');b.style.setProperty('--jr44-y',(e.clientY-r.top)+'px')});
 });
}

/* ---------- category / document rules ---------- */
const CATEGORIES=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
function activeCategory(){
 const act=qa('.active,[aria-selected="true"]').map(x=>x.textContent.trim()).find(t=>CATEGORIES.some(c=>normalize(t).includes(normalize(c))));
 return CATEGORIES.find(c=>act&&normalize(act).includes(normalize(c)))||'Primera Fuerza';
}
function ruleFor(category,age,docs){
 const libre=['Primera Fuerza','Intermedia','Segunda Fuerza'].includes(category);
 const v35=category==='Veteranos 35+',v50=category==='Veteranos 50+';
 if(v35||v50){
   const min=v50?50:35;
   if(!docs.ine)return{ok:false,level:'bad',text:`${category}: INE obligatoria para registro. ${Number.isFinite(age)?`Edad detectada: ${age}.`:''}`};
   if(Number.isFinite(age)&&age<min)return{ok:false,level:'bad',text:`${category}: la edad detectada (${age}) no cumple el mínimo de ${min} años.`};
   if(!Number.isFinite(age))return{ok:false,level:'warn',text:`${category}: INE detectada. Falta fecha de nacimiento para verificar los ${min}+ años.`};
   return{ok:true,level:'',text:`${category}: INE detectada y edad compatible (${age}).`};
 }
 if(libre){
   if(Number.isFinite(age)&&age<18){
     return docs.curp?{ok:true,level:'',text:`Categoría libre · menor de edad (${age}): CURP detectada.`}:{ok:false,level:'bad',text:`Categoría libre · menor de edad (${age}): se requiere CURP.`};
   }
   if(Number.isFinite(age)&&age>=18){
     return docs.ine?{ok:true,level:'',text:`Categoría libre · mayor de edad (${age}): INE detectada.`}:{ok:false,level:'bad',text:`Categoría libre · mayor de edad (${age}): se requiere INE.`};
   }
   if(docs.ine)return{ok:false,level:'warn',text:'INE detectada. Falta fecha de nacimiento para calcular edad automáticamente.'};
   if(docs.curp)return{ok:false,level:'warn',text:'CURP detectada. Se calculará la edad; si resulta mayor de edad, también se pedirá INE.'};
   return{ok:false,level:'warn',text:'Primera Fuerza, Intermedia y Segunda Fuerza son libres: menor = CURP; mayor de edad = INE.'};
 }
 return{ok:false,level:'warn',text:'Selecciona una categoría.'};
}

/* ---------- OCR ---------- */
const STATES={AS:'Aguascalientes',BC:'Baja California',BS:'Baja California Sur',CC:'Campeche',CL:'Coahuila',CM:'Colima',CS:'Chiapas',CH:'Chihuahua',DF:'Ciudad de México',DG:'Durango',GT:'Guanajuato',GR:'Guerrero',HG:'Hidalgo',JC:'Jalisco',MC:'Estado de México',MN:'Michoacán',MS:'Morelos',NT:'Nayarit',NL:'Nuevo León',OC:'Oaxaca',PL:'Puebla',QT:'Querétaro',QR:'Quintana Roo',SP:'San Luis Potosí',SL:'Sinaloa',SR:'Sonora',TC:'Tabasco',TS:'Tamaulipas',TL:'Tlaxcala',VZ:'Veracruz',YN:'Yucatán',ZS:'Zacatecas',NE:'Nacido en el extranjero'};
let tessPromise=null,qrPromise=null;
function loadTess(){
 if(window.Tesseract)return Promise.resolve(window.Tesseract);
 if(tessPromise)return tessPromise;
 tessPromise=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>ok(window.Tesseract);s.onerror=no;document.head.appendChild(s)});
 return tessPromise;
}
function loadQR(){
 if(window.QRCode&&window.QRCode.toDataURL)return Promise.resolve(window.QRCode);
 if(qrPromise)return qrPromise;
 qrPromise=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js';s.onload=()=>ok(window.QRCode);s.onerror=no;document.head.appendChild(s)});
 return qrPromise;
}
function curpFrom(text){
 const raw=normalize(text).replace(/[^A-Z0-9]/g,'');
 const m=raw.match(/[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/);
 return m?m[0]:'';
}
function curpInfo(c){
 c=String(c||'').toUpperCase().replace(/\s/g,'');if(c.length!==18)return null;
 const yy=+c.slice(4,6),mm=+c.slice(6,8),dd=+c.slice(8,10);
 const year=(/[A-Z]/.test(c[16])?2000:1900)+yy,d=new Date(year,mm-1,dd);
 if(d.getFullYear()!==year||d.getMonth()!==mm-1||d.getDate()!==dd)return null;
 const now=new Date();let age=now.getFullYear()-year;
 if((now.getMonth()+1)*100+now.getDate()<mm*100+dd)age--;
 return{dob:`${year}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`,age,state:STATES[c.slice(11,13)]||''};
}
function parseDateExplicit(text){
 const n=normalize(text);
 const m=n.match(/FECHA\s+DE\s+NACIMIENTO[^0-9]{0,20}(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
 if(!m)return null;
 const d=+m[1],mo=+m[2],y=+m[3],dt=new Date(y,mo-1,d);
 if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d)return null;
 const now=new Date();let age=now.getFullYear()-y;if((now.getMonth()+1)*100+now.getDate()<mo*100+d)age--;
 return{dob:`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`,age};
}
function lines(t){return String(t||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
function afterLabel(text,rx,stop,max=4){
 const a=lines(text),i=a.findIndex(x=>rx.test(normalize(x)));if(i<0)return'';
 const out=[];for(let j=i+1;j<Math.min(a.length,i+1+max);j++){if(stop.test(normalize(a[j])))break;out.push(a[j])}
 return out.join(' ').replace(/\s+/g,' ').trim();
}
function nameFrom(text){
 const a=lines(text),i=a.findIndex(x=>/\bNOMBRE(?:S)?\b/.test(normalize(x)));
 if(i<0)return'';
 const out=[];
 for(let j=i+1;j<Math.min(a.length,i+5);j++){
   if(/CURP|CLAVE|FECHA|DOMICILIO|SEXO|VIGENCIA|SECCION|FOLIO/.test(normalize(a[j])))break;
   out.push(a[j]);
 }
 return out.join(' ').replace(/\s+/g,' ').trim();
}
function residenceFrom(text){
 return afterLabel(text,/DOMICILIO|LOCALIDAD|MUNICIPIO/,/CURP|CLAVE|FECHA|SECCION|VIGENCIA|ELECTOR|FOLIO/,5);
}
function birthPlaceFrom(text){
 return afterLabel(text,/LUGAR DE NACIMIENTO|MUNICIPIO DE NACIMIENTO|ENTIDAD DE NACIMIENTO/,/CURP|CLAVE|FECHA|FOLIO|VIGENCIA/,4);
}
function detectDocType(text){
 const n=normalize(text);
 if(/INSTITUTO NACIONAL ELECTORAL|CREDENCIAL PARA VOTAR|CLAVE DE ELECTOR|SECCION/.test(n))return'INE';
 if(curpFrom(text)||/CLAVE UNICA DE REGISTRO DE POBLACION|CONSTANCIA.*CURP/.test(n))return'CURP';
 return'NO IDENTIFICADO';
}
async function ocrFile(file,label,progress){
 if(!file)return'';
 if(!/^image\//.test(file.type)){progress(`${label}: usa fotografía o imagen JPG/PNG/WebP.`);return''}
 const T=await loadTess();
 const r=await T.recognize(file,'spa',{logger:m=>{if(m.status==='recognizing text')progress(`${label}: ${Math.round((m.progress||0)*100)}%`)}}); 
 return r?.data?.text||'';
}

/* ---------- registration state / modal ---------- */
const REG={primaryText:'',secondaryText:'',docs:{curp:false,ine:false},curp:'',photo:null,photoURL:'',lastCanvas:null};
function resetReg(){
 REG.primaryText='';REG.secondaryText='';REG.docs={curp:false,ine:false};REG.curp='';REG.photo=null;
 if(REG.photoURL){URL.revokeObjectURL(REG.photoURL);REG.photoURL=''}
}
function updateRule(m){
 const age=Number(q('#jr44Age',m).value);const val=Number.isFinite(age)&&q('#jr44Age',m).value!==''?age:NaN;
 const r=ruleFor(q('#jr44Category',m).value,val,REG.docs),box=q('#jr44Rule',m);
 box.className='jr44-rule '+r.level;box.textContent=r.text;box.dataset.ok=r.ok?'1':'0';
}
function fillFromTexts(m){
 const text=REG.primaryText+'\n'+REG.secondaryText;
 REG.curp=curpFrom(text)||REG.curp;
 const ci=REG.curp?curpInfo(REG.curp):null;
 const explicit=parseDateExplicit(text);
 if(REG.curp)q('#jr44Curp',m).value=REG.curp;
 const d=ci||explicit;
 if(d){q('#jr44Dob',m).value=d.dob;q('#jr44Age',m).value=d.age}
 if(ci?.state)q('#jr44BirthState',m).value=ci.state;
 const name=nameFrom(REG.primaryText)||nameFrom(REG.secondaryText);
 if(name&&!q('#jr44Name',m).value)q('#jr44Name',m).value=name;
 const res=residenceFrom(REG.primaryText)||residenceFrom(REG.secondaryText);
 if(res&&!q('#jr44Residence',m).value)q('#jr44Residence',m).value=res;
 const bp=birthPlaceFrom(REG.primaryText)||birthPlaceFrom(REG.secondaryText);
 if(bp&&!q('#jr44BirthPlace',m).value)q('#jr44BirthPlace',m).value=bp;
 updateRule(m);
}
function modal(){
 let m=q('#jr44Register');if(m)return m;
 m=document.createElement('div');m.id='jr44Register';
 m.innerHTML=`<div class="jr44-dialog">
  <div class="jr44-dialog-head"><div><b>Registro rápido de jugador · OCR</b><div style="font-size:12px;color:rgba(247,247,242,.55)">CURP / INE → datos → foto → credencial PNG</div></div><button class="jr44-close" type="button">×</button></div>
  <div class="jr44-dialog-body">
   <div class="jr44-note"><b>Privacidad:</b> la foto de CURP/INE, el texto OCR y la CURP completa se usan sólo durante esta sesión. No se suben a GitHub ni se guardan completos en localStorage. Para un padrón central con documentos se necesita un backend privado, no GitHub Pages público.</div>
   <div class="jr44-grid">
    <div class="jr44-field"><label>Categoría</label><select id="jr44Category">${CATEGORIES.map(c=>`<option>${c}</option>`).join('')}</select></div>
    <div class="jr44-field"><label>Regla documental</label><div id="jr44Rule" class="jr44-rule">Selecciona categoría.</div></div>
    <div class="jr44-upload"><b>1. Documento principal</b><small>Sube foto de CURP o INE. Al seleccionar la imagen el OCR empieza automáticamente.</small><input id="jr44Doc1" type="file" accept="image/*" capture="environment"><div id="jr44Doc1Status" class="jr44-status"></div></div>
    <div class="jr44-upload"><b>2. Documento adicional (cuando aplique)</b><small>Ejemplo: adulto en categoría libre que primero envió CURP; aquí puede subir INE.</small><input id="jr44Doc2" type="file" accept="image/*" capture="environment"><div id="jr44Doc2Status" class="jr44-status"></div></div>
    <div class="jr44-field full"><label>Nombre completo</label><input id="jr44Name" autocomplete="name"></div>
    <div class="jr44-field"><label>CURP detectada</label><input id="jr44Curp" maxlength="18"></div>
    <div class="jr44-field"><label>Fecha de nacimiento</label><input id="jr44Dob" type="date"></div>
    <div class="jr44-field"><label>Edad</label><input id="jr44Age" readonly></div>
    <div class="jr44-field"><label>Entidad de nacimiento</label><input id="jr44BirthState"></div>
    <div class="jr44-field"><label>Lugar/municipio leído del documento</label><input id="jr44BirthPlace" placeholder="Sólo si el documento lo trae"></div>
    <div class="jr44-field full"><label>Domicilio / localidad leído de INE</label><input id="jr44Residence"></div>
    <div class="jr44-field"><label>Posición</label><select id="jr44Position"><option value="">Seleccionar…</option><option>Portero</option><option>Defensa central</option><option>Lateral</option><option>Medio defensivo</option><option>Medio</option><option>Extremo</option><option>Delantero</option></select></div>
    <div class="jr44-field"><label>Número</label><input id="jr44Number" type="number" min="0" max="99"></div>
    <div class="jr44-upload full"><b>3. Foto del jugador para la credencial</b><small>Sube la foto de rostro que irá en la credencial de la Liga.</small><input id="jr44Photo" type="file" accept="image/*" capture="user"><div id="jr44PhotoStatus" class="jr44-status"></div></div>
   </div>
   <div id="jr44Progress">Selecciona una imagen para comenzar el OCR automático.</div>
   <div class="jr44-actions"><button id="jr44Generate" class="primary-btn" type="button">Generar credencial</button><button id="jr44Save" class="ghost-btn" type="button">Guardar registro local</button><button id="jr44Clear" class="ghost-btn" type="button">Limpiar</button></div>
   <div id="jr44Preview" class="jr44-preview" hidden><canvas id="jr44CredentialCanvas" width="1000" height="630"></canvas><div class="jr44-actions"><button id="jr44Download" class="primary-btn" type="button">Descargar credencial PNG</button><button id="jr44Print" class="ghost-btn" type="button">Imprimir / PDF</button></div></div>
  </div>
 </div>`;
 document.body.appendChild(m);
 q('.jr44-close',m).onclick=()=>m.classList.remove('show');
 m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
 wireModal(m);return m;
}
function docStatus(m,slot,type,text){
 q(slot===1?'#jr44Doc1Status':'#jr44Doc2Status',m).textContent=`Detectado: ${type}${curpFrom(text)?' · CURP encontrada':''}`;
}
async function scanDoc(m,file,slot){
 const progress=x=>q('#jr44Progress',m).textContent=x;
 if(!file)return;
 q(slot===1?'#jr44Doc1Status':'#jr44Doc2Status',m).textContent='Leyendo…';
 try{
  const text=await ocrFile(file,slot===1?'Documento principal':'Documento adicional',progress);
  const type=detectDocType(text);
  if(slot===1)REG.primaryText=text;else REG.secondaryText=text;
  if(type==='INE')REG.docs.ine=true;if(type==='CURP'||curpFrom(text))REG.docs.curp=true;
  docStatus(m,slot,type,text);fillFromTexts(m);progress('OCR terminado. Confirma los datos y completa posición/número.');
 }catch(_){progress('No se pudo leer la imagen. Puedes probar otra foto o llenar manualmente.')}
}
function wireModal(m){
 q('#jr44Category',m).onchange=()=>updateRule(m);
 q('#jr44Doc1',m).onchange=e=>scanDoc(m,e.target.files[0],1);
 q('#jr44Doc2',m).onchange=e=>scanDoc(m,e.target.files[0],2);
 q('#jr44Photo',m).onchange=e=>{
   const f=e.target.files[0];REG.photo=f||null;
   if(REG.photoURL){URL.revokeObjectURL(REG.photoURL);REG.photoURL=''}
   if(f){REG.photoURL=URL.createObjectURL(f);q('#jr44PhotoStatus',m).textContent='Foto lista para la credencial.'}
 };
 q('#jr44Curp',m).oninput=()=>{
   const c=q('#jr44Curp',m).value.trim().toUpperCase(),ci=curpInfo(c);
   REG.curp=c;if(ci){q('#jr44Dob',m).value=ci.dob;q('#jr44Age',m).value=ci.age;q('#jr44BirthState',m).value=ci.state;REG.docs.curp=true}
   updateRule(m);
 };
 q('#jr44Dob',m).onchange=()=>{
   const d=new Date(q('#jr44Dob',m).value+'T12:00:00'),now=new Date();
   if(!isNaN(d)){let age=now.getFullYear()-d.getFullYear();if((now.getMonth()+1)*100+now.getDate()<(d.getMonth()+1)*100+d.getDate())age--;q('#jr44Age',m).value=age}
   updateRule(m);
 };
 q('#jr44Generate',m).onclick=()=>generateCredential(m);
 q('#jr44Save',m).onclick=()=>saveRecord(m);
 q('#jr44Clear',m).onclick=()=>{resetReg();m.remove();openRegister()};
 q('#jr44Download',m).onclick=()=>{const c=q('#jr44CredentialCanvas',m),a=document.createElement('a');a.download='credencial-liga-juventino-rosas.png';a.href=c.toDataURL('image/png');a.click()};
 q('#jr44Print',m).onclick=()=>{const c=q('#jr44CredentialCanvas',m),w=open('','_blank');w.document.write(`<img src="${c.toDataURL('image/png')}" style="max-width:100%">`);w.document.close();w.focus();setTimeout(()=>w.print(),250)};
}
function openRegister(){
 const m=modal();q('#jr44Category',m).value=activeCategory();updateRule(m);m.classList.add('show');
}
function registrationData(m){
 const age=q('#jr44Age',m).value===''?NaN:Number(q('#jr44Age',m).value);
 return{
  category:q('#jr44Category',m).value,name:q('#jr44Name',m).value.trim(),
  curp:q('#jr44Curp',m).value.trim().toUpperCase(),dob:q('#jr44Dob',m).value,age,
  birthState:q('#jr44BirthState',m).value.trim(),birthPlace:q('#jr44BirthPlace',m).value.trim(),
  residence:q('#jr44Residence',m).value.trim(),position:q('#jr44Position',m).value,
  number:q('#jr44Number',m).value.trim(),docs:{...REG.docs}
 };
}
function validate(m,needPhoto){
 const d=registrationData(m),rule=ruleFor(d.category,d.age,d.docs);
 if(!d.name)return{ok:false,msg:'Falta confirmar el nombre completo.'};
 if(!d.dob||!Number.isFinite(d.age))return{ok:false,msg:'Falta fecha de nacimiento / edad.'};
 if(!rule.ok)return{ok:false,msg:rule.text};
 if(!d.position)return{ok:false,msg:'Selecciona la posición del jugador.'};
 if(needPhoto&&!REG.photo)return{ok:false,msg:'Sube la foto del jugador para crear la credencial.'};
 return{ok:true,data:d,rule};
}
function folio(){const a=new Uint32Array(1);crypto.getRandomValues(a);return`LJR-${new Date().getFullYear()}-${String(a[0]%1000000).padStart(6,'0')}`}
function imgFrom(src){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=src})}
function drawPhoto(ctx,img,x,y,w,h){
 const s=Math.max(w/img.width,h/img.height),sw=w/s,sh=h/s,sx=(img.width-sw)/2,sy=(img.height-sh)/2;
 ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}
function roundRect(ctx,x,y,w,h,r,fill,stroke){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}
}
async function generateCredential(m){
 const v=validate(m,true);if(!v.ok){q('#jr44Progress',m).textContent=v.msg;return}
 const d=v.data,id=folio(),canvas=q('#jr44CredentialCanvas',m),ctx=canvas.getContext('2d');
 ctx.clearRect(0,0,1000,630);
 const g=ctx.createLinearGradient(0,0,1000,630);g.addColorStop(0,'#06120d');g.addColorStop(.62,'#0b1612');g.addColorStop(1,'#101216');
 roundRect(ctx,0,0,1000,630,34,g,'rgba(34,224,122,.35)');
 ctx.fillStyle='#22e07a';ctx.font='800 24px Sora,Arial';ctx.fillText('LIGA MUNICIPAL JUVENTINO ROSAS',44,55);
 ctx.fillStyle='#f7f7f2';ctx.font='800 52px Sora,Arial';ctx.fillText(d.name.slice(0,29),44,118);
 ctx.fillStyle='rgba(247,247,242,.68)';ctx.font='700 22px Manrope,Arial';ctx.fillText(`${d.category}  ·  ${d.position}${d.number?'  ·  #'+d.number:''}`,44,158);
 const photo=await imgFrom(REG.photoURL);roundRect(ctx,44,195,250,320,24,'#111b16','rgba(255,255,255,.12)');ctx.save();ctx.beginPath();ctx.roundRect(44,195,250,320,24);ctx.clip();drawPhoto(ctx,photo,44,195,250,320);ctx.restore();
 const x=335;ctx.fillStyle='#22e07a';ctx.font='800 18px Manrope,Arial';ctx.fillText('DATOS DEL JUGADOR',x,220);
 const rows=[
  ['Fecha de nacimiento',d.dob],['Edad',`${d.age} años`],['Entidad',d.birthState||'—'],
  ['Lugar leído',d.birthPlace||'—'],['Localidad / domicilio',d.residence||'—'],
  ['CURP',d.curp?d.curp.slice(0,4)+'••••••••••••'+d.curp.slice(-2):'—']
 ];
 ctx.font='700 18px Manrope,Arial';
 rows.forEach((r,i)=>{const yy=262+i*48;ctx.fillStyle='rgba(247,247,242,.52)';ctx.fillText(r[0],x,yy);ctx.fillStyle='#f7f7f2';ctx.fillText(String(r[1]).slice(0,42),x+215,yy)});
 ctx.fillStyle='#22e07a';ctx.font='900 20px Manrope,Arial';ctx.fillText('HABILITADO',44,566);
 ctx.fillStyle='rgba(247,247,242,.55)';ctx.font='700 17px Manrope,Arial';ctx.fillText(`Folio: ${id}`,335,566);
 try{
   const QR=await loadQR(),url=await QR.toDataURL(`Liga Juventino Rosas|${id}|${d.name}|${d.category}`,{margin:1,width:160,color:{dark:'#07110d',light:'#f7f7f2'}});
   const im=await imgFrom(url);ctx.drawImage(im,796,410,160,160);
 }catch(_){}
 q('#jr44Preview',m).hidden=false;REG.lastCanvas=canvas;
 q('#jr44Progress',m).textContent='Credencial generada. CURP mostrada sólo en forma enmascarada.';
 saveSafe(d,id);
}
function saveSafe(d,id){
 try{
  const safe={folio:id||folio(),name:d.name,category:d.category,dob:d.dob,age:d.age,birthState:d.birthState,birthPlace:d.birthPlace,residence:d.residence,position:d.position,number:d.number,curpMasked:d.curp?d.curp.slice(0,4)+'************'+d.curp.slice(-2):'',documentos:{curp:!!d.docs.curp,ine:!!d.docs.ine},createdAt:new Date().toISOString(),source:'FIX12 OCR'};
  const a=JSON.parse(localStorage.getItem('jrV25Players')||'[]');a.unshift(safe);localStorage.setItem('jrV25Players',JSON.stringify(a));
 }catch(_){}
}
function saveRecord(m){
 const v=validate(m,false);if(!v.ok){q('#jr44Progress',m).textContent=v.msg;return}
 saveSafe(v.data);q('#jr44Progress',m).textContent='Registro guardado localmente sin documentos, sin foto y con CURP enmascarada.';
}
function credentialLauncher(){
 if(!q('#jr44CredentialTools')){
   const more=q('#view-more')||q('#view-home');
   if(more){
    const s=document.createElement('section');s.id='jr44CredentialTools';
    s.innerHTML='<div class="eyebrow">REGISTRO DE TEMPORADA</div><h3>Credenciales con OCR</h3><p>Sube CURP o INE y el sistema detecta automáticamente los datos posibles. Primera Fuerza, Intermedia y Segunda Fuerza: menor = CURP, mayor = INE. Veteranos 35+ y 50+: INE obligatoria.</p><div class="jr44-launch-row"><button class="primary-btn" id="jr44OpenRegister" type="button">Registrar jugador con documento</button></div>';
    more.prepend(s);q('#jr44OpenRegister',s).onclick=openRegister;addMotion(s,false,29);
   }
 }
 qa('h1,h2,h3').filter(h=>normalize(h.textContent).includes('CREDENCIAL DIGITAL DE JUGADOR')).forEach(h=>{
  if(q('.jr44-inline-register',h.parentElement))return;
  const b=document.createElement('button');b.className='primary-btn jr44-inline-register';b.type='button';b.textContent='Nueva credencial OCR';b.onclick=openRegister;h.parentElement.appendChild(b);
 });
}
function interceptRegister(){
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-v25-action="player"],button,a');
   if(!b)return;
   const txt=normalize(b.textContent);
   if(b.matches('[data-v25-action="player"]')||txt.includes('REGISTRAR JUGADOR')){
     e.preventDefault();e.stopImmediatePropagation();openRegister();
   }
 },true);
}

/* ---------- weather ---------- */
const LOCS=[
 {id:'rincon',label:'Rincón de Centeno',query:'Rincón de Centeno, Guanajuato, Mexico'},
 {id:'jaralillo',label:'Jaralillo',query:'Jaralillo, Guanajuato, Mexico'},
 {id:'cuenda',label:'Cuenda',query:'Cuenda, Guanajuato, Mexico'},
 {id:'jr',label:'Juventino Rosas (regional)',lat:20.64337,lon:-100.99286}
],WXKEY='jr44-wx-cache';
function wxLoad(){try{return JSON.parse(localStorage.getItem(WXKEY)||'{}')}catch(_){return{}}}
function wxSave(x){try{localStorage.setItem(WXKEY,JSON.stringify(x))}catch(_){}}
async function resolveLoc(l){
 if(Number.isFinite(l.lat))return{lat:l.lat,lon:l.lon,name:l.label,source:'referencia regional configurada'};
 const c=wxLoad(),k='g:'+l.id;if(c[k]&&Date.now()-c[k].t<7*864e5)return c[k].v;
 const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(l.query)+'&count=5&language=es&format=json',{cache:'no-store'});
 if(!r.ok)throw 0;const d=await r.json(),h=(d.results||[])[0];if(!h)throw 0;
 const v={lat:h.latitude,lon:h.longitude,name:[h.name,h.admin2||h.admin1,h.country].filter(Boolean).join(', '),source:'localidad resuelta por geocodificación'};
 c[k]={t:Date.now(),v};wxSave(c);return v;
}
async function forecast(l,date){
 const g=await resolveLoc(l),c=wxLoad(),k='f:'+l.id+':'+date;if(c[k]&&Date.now()-c[k].t<30*60e3)return c[k].v;
 const u=`https://api.open-meteo.com/v1/forecast?latitude=${g.lat}&longitude=${g.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max&timezone=America%2FMexico_City&forecast_days=14`;
 const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json(),ds=d.daily?.time||[];let i=ds.indexOf(date);if(i<0)i=0;
 const v={g,date:ds[i]||date,p:d.daily.precipitation_probability_max?.[i]??null,r:d.daily.precipitation_sum?.[i]??null,w:d.daily.wind_gusts_10m_max?.[i]??null,max:d.daily.temperature_2m_max?.[i]??null,min:d.daily.temperature_2m_min?.[i]??null,code:d.daily.weather_code?.[i]??null};
 c[k]={t:Date.now(),v};wxSave(c);return v;
}
function weatherRisk(w){
 if([95,96,99].includes(w.code)||(w.r??0)>=8||(w.w??0)>=55)return['REVISIÓN PRIORITARIA','Pronóstico adverso: revisar campo y confirmar oficialmente.'];
 if((w.r??0)>=2||(w.p??0)>=70)return['VIGILAR CAMPO','Puede llover: revisar terreno. La lluvia no suspende por sí sola.'];
 return['SIN ALERTA METEOROLÓGICA','Sin alerta fuerte. La Liga mantiene la decisión oficial.'];
}
function weather(){
 if(q('#jr44Weather'))return;const home=q('#view-home');if(!home)return;
 const s=document.createElement('section');s.id='jr44Weather';s.className='jr44-motion-card';
 s.innerHTML=`<div><div class="eyebrow">CLIMA POR LOCALIDAD / CANCHA</div><h2>Consulta antes del partido.</h2><p style="color:var(--jr44-muted)">Rincón de Centeno, Jaralillo, Cuenda u otra localidad. Si no tenemos coordenadas verificadas del campo, se muestra pronóstico de localidad.</p></div>
 <div class="jr44-weather-controls"><select id="jr44Loc">${LOCS.map((x,i)=>`<option value="${i}">${x.label}</option>`).join('')}<option value="custom">Otra localidad…</option></select><input id="jr44Custom" placeholder="Otra localidad" disabled><input id="jr44Date" type="date"><button id="jr44WeatherGo" class="primary-btn">Consultar</button></div>
 <div class="jr44-weather-grid"><div class="jr44-wx"><small>Pronóstico</small><strong id="jr44Forecast">—</strong><p id="jr44Meta">Temperatura, lluvia y rachas.</p></div><div class="jr44-wx"><small>Ubicación usada</small><strong id="jr44Where">—</strong><p id="jr44Source">No se inventan coordenadas.</p></div><div class="jr44-wx"><small>Sugerencia automática</small><strong id="jr44Risk">—</strong><p id="jr44RiskText">No modifica la decisión oficial.</p></div><div class="jr44-wx"><small>Decisión oficial</small><strong>La Liga confirma</strong><p>Pronóstico ≠ terreno ≠ decisión.</p></div></div>`;
 home.appendChild(s);addMotion(s,false,17);
 const loc=q('#jr44Loc'),custom=q('#jr44Custom'),date=q('#jr44Date');date.value=new Date().toLocaleDateString('en-CA');loc.onchange=()=>custom.disabled=loc.value!=='custom';
 q('#jr44WeatherGo').onclick=async()=>{let L;if(loc.value==='custom'){const n=custom.value.trim();if(!n)return alert('Escribe una localidad.');L={id:'c-'+n.toLowerCase().replace(/\W+/g,'-'),label:n,query:n+', Guanajuato, Mexico'}}else L=LOCS[+loc.value];q('#jr44Forecast').textContent='Consultando…';try{const w=await forecast(L,date.value),r=weatherRisk(w);q('#jr44Forecast').textContent=`${Math.round(w.max??0)}°/${Math.round(w.min??0)}° · lluvia ${w.p??'—'}%`;q('#jr44Meta').textContent=`${w.r??'—'} mm · rachas ${w.w??'—'} km/h · ${w.date}`;q('#jr44Where').textContent=w.g.name;q('#jr44Source').textContent=w.g.source;q('#jr44Risk').textContent=r[0];q('#jr44RiskText').textContent=r[1]}catch(_){q('#jr44Forecast').textContent='No se pudo actualizar'}};
}

/* ---------- init ---------- */
function init(){
 document.body.classList.add('jr44-fix12');refreshBuild();initSources();fixHeroTitle();decorateAll();credentialLauncher();interceptRegister();weather();buttons();hookViews();
 setTimeout(()=>{decorateAll();buttons();credentialLauncher()},900);
 document.addEventListener('visibilitychange',()=>{
   sources.forEach(v=>{if(document.hidden)v.pause();else{const p=v.play();if(p&&p.catch)p.catch(()=>{})}});
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
