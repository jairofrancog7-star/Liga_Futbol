
(function(){
'use strict';
if(window.__JR42Fix10)return;window.__JR42Fix10=true;
const BUILD='38-10';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MOTION=[
 './assets/motion/v38-fix10-hero-motion.mp4','./assets/motion/v38-fix10-field-motion.mp4','./assets/motion/v38-fix10-tactics-motion.mp4',
 './assets/motion/v38-soccer-matchday.mp4','./assets/motion/v38-emirates-matchcenter.mp4','./assets/motion/v38-soccer-fields-rain.mp4',
 './assets/motion/v38-emirates-teams.mp4','./assets/motion/v38-soccer-liguilla.mp4','./assets/motion/v38-emirates-table.mp4',
 './assets/motion/v38-emirates-stats.mp4','./assets/motion/v38-emirates-community.mp4','./assets/motion/v38-soccer-hero.mp4'
];
const managed=new Set();
let vo=null;
function mkVideo(src,cls=''){
 if(reduced.matches||saveData)return null;
 const v=document.createElement('video');v.className=cls;v.dataset.src=src;v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';
 v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.dataset.visible='false';managed.add(v);if(vo)vo.observe(v);return v;
}
function src(v){if(!v.src&&v.dataset.src){v.src=v.dataset.src;v.preload='metadata';v.load()}}
function update(v){if(v.dataset.visible==='true'&&!document.hidden&&!reduced.matches&&!saveData){src(v);const p=v.play();if(p&&p.catch)p.catch(()=>{})}else v.pause()}
vo='IntersectionObserver'in window?new IntersectionObserver(es=>{es.forEach(e=>{e.target.dataset.visible=(e.isIntersecting&&e.intersectionRatio>.025)?'true':'false';if(e.isIntersecting)src(e.target)});managed.forEach(v=>document.body.contains(v)&&update(v))},{threshold:[0,.025,.12],rootMargin:'250px 0px'}):null;

function refreshBuild(){
 try{
  const old=localStorage.getItem('jr42-build');localStorage.setItem('jr42-build',BUILD);
  if(old!==BUILD&&'caches'in window)caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
  if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
 }catch(_){}
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}
function mountAmbient(){
 if(q('#jr42Ambient')||reduced.matches||saveData)return;
 const h=document.createElement('div');h.id='jr42Ambient';
 const a=mkVideo(MOTION[2]),b=mkVideo(MOTION[0]);if(a){a.classList.add('active');a.dataset.visible='true';h.appendChild(a)}if(b){b.dataset.visible='true';h.appendChild(b)}
 document.body.prepend(h);const vs=qa('video',h);let active=0,i=2;
 const swap=()=>{if(vs.length<2)return;i=(i+1)%MOTION.length;const n=1-active,nv=vs[n],ov=vs[active];nv.pause();nv.removeAttribute('src');nv.dataset.src=MOTION[i];src(nv);const p=nv.play();if(p&&p.catch)p.catch(()=>{});nv.classList.add('active');ov.classList.remove('active');active=n};
 setInterval(swap,16000);
}
function fixHero(){
 const hero=q('#v14CinematicHero');if(!hero)return;
 const title=q('.v14-title',hero);
 if(title)title.innerHTML='<span class="outline">FÚTBOL</span><span class="electric">QUE SE SIENTE</span><span class="jr37-live">EN VIVO.</span>';
 const stage=q('.v14-stage',hero);
 if(stage&&!q('.jr42-hero-film',stage)){const v=mkVideo(MOTION[0],'jr42-hero-film');if(v)stage.insertBefore(v,stage.firstChild)}
}
function clubHero(){
 const home=q('#view-home');if(!home||q('#jr42ClubHero'))return;
 const s=document.createElement('section');s.id='jr42ClubHero';
 const v=mkVideo(MOTION[0]);if(v)s.appendChild(v);
 s.innerHTML+=(`
 <div class="jr42-club-copy">
   <small>LIGA JUVENTINO ROSAS · GUANAJUATO</small>
   <h1>FÚTBOL <span class="green">QUE SE SIENTE</span> EN VIVO.</h1>
   <p>Una liga municipal presentada como club premium: jornadas, equipos, Match Center, campos, clima y liguilla en una experiencia cinematográfica propia.</p>
   <div class="jr42-club-actions"><button class="primary-btn" data-view="matches">Ver jornada →</button><button class="ghost-btn" data-view="teams">Equipos</button><button class="ghost-btn" data-view="fields">Clima y campos</button></div>
 </div>`);
 const anchor=q('#v14CinematicHero');if(anchor)anchor.insertAdjacentElement('beforebegin',s);else home.prepend(s);
}
function ticker(){
 if(q('#jr42Ticker'))return;const home=q('#view-home');if(!home)return;
 const vals=['<b>5 categorías</b>','<b>LIVE</b> Match Center','<b>Matchday</b> Jornada','<b>Liguilla</b> Cruces','<b>Clima por localidad</b> Campos','<b>OCR</b> Credenciales'];
 const t=document.createElement('div');t.id='jr42Ticker';const x=vals.map(v=>`<span>${v}</span>`).join('');t.innerHTML=`<div class="track">${x}${x}</div>`;
 const a=q('#jr42ClubHero')||q('#v14CinematicHero');if(a)a.insertAdjacentElement('afterend',t);else home.prepend(t);
}
function decorateCards(){
 let i=0;
 const sel='.card,.section,.table-wrap,.matchday-bar,.jr40-film-card,.jr41-weather-card';
 qa(sel).forEach(el=>{
  if(el.closest('#jr42Ocr')||el.id==='v14CinematicHero'||el.id==='jr42ClubHero'||el.id==='jr42FieldWeather'||el.id==='jr42Ticker'||el.classList.contains('jr42-motion-card'))return;
  if(el.childElementCount===0)return;
  el.classList.add('jr42-motion-card');const v=mkVideo(MOTION[(i++ + 3)%MOTION.length],'jr42-card-film');if(v)el.insertBefore(v,el.firstChild);
 });
}
function modernButtons(){
 qa('button,.primary-btn,.ghost-btn,.btn-primary,.btn-ghost').forEach(b=>{
  if(b.dataset.jr42)return;b.dataset.jr42='1';
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--x',(e.clientX-r.left)+'px');b.style.setProperty('--y',(e.clientY-r.top)+'px')});
 });
}

/* Weather by locality, without inventing exact field coordinates. */
const LOCS=[
 {id:'rincon-centeno',label:'Rincón de Centeno',query:'Rincón de Centeno, Guanajuato, Mexico'},
 {id:'jaralillo',label:'Jaralillo',query:'Jaralillo, Guanajuato, Mexico'},
 {id:'cuenda',label:'Cuenda',query:'Cuenda, Guanajuato, Mexico'},
 {id:'juventino',label:'Juventino Rosas (regional)',lat:20.64337,lon:-100.99286}
];
const WX='jr42-wx-cache-v1';
function loadWx(){try{return JSON.parse(localStorage.getItem(WX)||'{}')}catch(_){return{}}}
function saveWx(x){try{localStorage.setItem(WX,JSON.stringify(x))}catch(_){}}
async function resolveLoc(loc){
 if(Number.isFinite(loc.lat))return{lat:loc.lat,lon:loc.lon,name:loc.label,source:'coordenada regional configurada'};
 const key='geo:'+loc.id,cache=loadWx();if(cache[key]&&Date.now()-cache[key].t<7*864e5)return cache[key].v;
 const u='https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(loc.query)+'&count=5&language=es&format=json';
 const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('geo');const d=await r.json();const hit=(d.results||[])[0];if(!hit)throw new Error('geo');
 const v={lat:hit.latitude,lon:hit.longitude,name:[hit.name,hit.admin2||hit.admin1,hit.country].filter(Boolean).join(', '),source:'localidad resuelta por geocodificación'};
 cache[key]={t:Date.now(),v};saveWx(cache);return v;
}
async function forecast(loc,date){
 const geo=await resolveLoc(loc);const key='fc:'+loc.id+':'+date,cache=loadWx();if(cache[key]&&Date.now()-cache[key].t<30*60e3)return cache[key].v;
 const u=`https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max&timezone=America%2FMexico_City&forecast_days=14`;
 const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('forecast');const d=await r.json();const dates=d.daily?.time||[];let idx=dates.indexOf(date);if(idx<0)idx=0;
 const v={geo,date:dates[idx]||date,prob:d.daily.precipitation_probability_max?.[idx]??null,rain:d.daily.precipitation_sum?.[idx]??null,gust:d.daily.wind_gusts_10m_max?.[idx]??null,max:d.daily.temperature_2m_max?.[idx]??null,min:d.daily.temperature_2m_min?.[idx]??null,code:d.daily.weather_code?.[idx]??null};
 cache[key]={t:Date.now(),v};saveWx(cache);return v;
}
function risk(w){
 const storm=[95,96,99].includes(w.code);const heavy=(w.rain??0)>=8;const wet=(w.rain??0)>=2||(w.prob??0)>=70;const gust=(w.gust??0)>=55;
 if(storm||heavy||gust)return{label:'REVISIÓN PRIORITARIA',text:'Pronóstico adverso. Revisar el campo y confirmar oficialmente antes del partido.'};
 if(wet)return{label:'VIGILAR CAMPO',text:'Hay señal de lluvia. El terreno debe revisarse; no suspende por sí sola.'};
 return{label:'SIN ALERTA METEOROLÓGICA',text:'El pronóstico no muestra una alerta fuerte. La Liga conserva la decisión oficial.'};
}
function weather(){
 if(q('#jr42FieldWeather'))return;const home=q('#view-home');if(!home)return;
 const s=document.createElement('section');s.id='jr42FieldWeather';s.innerHTML=`
 <div class="jr42-weather-head"><div><div class="eyebrow">CLIMA POR CANCHA / LOCALIDAD</div><h2>Antes de jugar, revisa el lugar.</h2>
 <p>Rincón de Centeno, Jaralillo, Cuenda o cualquier otra localidad. Si no hay coordenadas verificadas del campo, el pronóstico se etiqueta como localidad y nunca se presenta como una medición exacta del césped.</p></div></div>
 <div class="jr42-weather-controls"><select id="jr42Loc">${LOCS.map((x,i)=>`<option value="${i}">${x.label}</option>`).join('')}<option value="custom">Otra localidad…</option></select><input id="jr42Custom" placeholder="Ej. San Antonio, Guanajuato" disabled><input id="jr42Date" type="date"><button id="jr42Check" class="primary-btn">Consultar</button></div>
 <div class="jr42-weather-grid">
  <div class="jr42-wx"><small>Pronóstico</small><strong id="jr42Forecast">Selecciona lugar</strong><p id="jr42Meta">Temperatura, lluvia y rachas.</p></div>
  <div class="jr42-wx"><small>Ubicación usada</small><strong id="jr42Resolved">—</strong><p id="jr42Source">No se inventan coordenadas exactas.</p></div>
  <div class="jr42-wx suggest"><small>Sugerencia automática</small><strong id="jr42Suggestion">—</strong><p id="jr42SuggestText">La sugerencia no cambia el estado oficial.</p></div>
  <div class="jr42-wx official"><small>Decisión oficial</small><strong>La Liga confirma</strong><p>Programado · Por confirmar · Retrasado · Suspendido. La lluvia sola no suspende.</p></div>
 </div>`;
 const a=q('#jr42Ticker')||q('#v14CinematicHero');if(a)a.insertAdjacentElement('afterend',s);else home.prepend(s);
 const loc=q('#jr42Loc'),custom=q('#jr42Custom'),date=q('#jr42Date');date.value=new Date().toLocaleDateString('en-CA');
 loc.onchange=()=>custom.disabled=loc.value!=='custom';
 q('#jr42Check').onclick=async()=>{
  let L;if(loc.value==='custom'){const name=custom.value.trim();if(!name){alert('Escribe una localidad.');return}L={id:'custom-'+name.toLowerCase().replace(/\W+/g,'-'),label:name,query:name+', Guanajuato, Mexico'}}else L=LOCS[+loc.value];
  q('#jr42Forecast').textContent='Consultando…';
  try{
   const w=await forecast(L,date.value),r=risk(w);
   q('#jr42Forecast').textContent=`${Math.round(w.max??0)}°/${Math.round(w.min??0)}° · lluvia ${w.prob??'—'}%`;
   q('#jr42Meta').textContent=`Acumulado ${w.rain??'—'} mm · rachas ${w.gust??'—'} km/h · ${w.date}`;
   q('#jr42Resolved').textContent=w.geo.name;q('#jr42Source').textContent=w.geo.source+'.';
   q('#jr42Suggestion').textContent=r.label;q('#jr42SuggestText').textContent=r.text;
  }catch(_){q('#jr42Forecast').textContent='No se pudo actualizar';q('#jr42Meta').textContent='Revisa conexión o escribe otra localidad.'}
 };
}

/* OCR: CURP / INE, all browser-side; sensitive docs are never persisted. */
const STATE={AS:'Aguascalientes',BC:'Baja California',BS:'Baja California Sur',CC:'Campeche',CL:'Coahuila',CM:'Colima',CS:'Chiapas',CH:'Chihuahua',DF:'Ciudad de México',DG:'Durango',GT:'Guanajuato',GR:'Guerrero',HG:'Hidalgo',JC:'Jalisco',MC:'Estado de México',MN:'Michoacán',MS:'Morelos',NT:'Nayarit',NL:'Nuevo León',OC:'Oaxaca',PL:'Puebla',QT:'Querétaro',QR:'Quintana Roo',SP:'San Luis Potosí',SL:'Sinaloa',SR:'Sonora',TC:'Tabasco',TS:'Tamaulipas',TL:'Tlaxcala',VZ:'Veracruz',YN:'Yucatán',ZS:'Zacatecas',NE:'Nacido en el extranjero'};
let tp=null;
function tesseract(){if(window.Tesseract)return Promise.resolve(window.Tesseract);if(tp)return tp;tp=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>ok(window.Tesseract);s.onerror=no;document.head.appendChild(s)});return tp}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function curp(text){const raw=norm(text).replace(/[^A-Z0-9]/g,'');const m=raw.match(/[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/);return m?m[0]:''}
function curpInfo(c){c=String(c||'').toUpperCase().replace(/\s/g,'');if(c.length!==18)return null;const yy=+c.slice(4,6),mm=+c.slice(6,8),dd=+c.slice(8,10),y=(/[A-Z]/.test(c[16])?2000:1900)+yy,d=new Date(y,mm-1,dd);if(d.getFullYear()!==y||d.getMonth()!==mm-1||d.getDate()!==dd)return null;const n=new Date();let age=n.getFullYear()-y;if((n.getMonth()+1)*100+n.getDate()<mm*100+dd)age--;return{dob:`${y}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`,age,state:STATE[c.slice(11,13)]||''}}
function lines(text){return String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
function afterLabel(text,rx,stop=/CURP|CLAVE|FECHA|FOLIO|REGISTRO|VIGENCIA|SECCION/i,max=4){const a=lines(text),i=a.findIndex(x=>rx.test(x));if(i<0)return'';const o=[];for(let j=i+1;j<Math.min(a.length,i+1+max);j++){if(stop.test(a[j]))break;o.push(a[j])}return o.join(' ').replace(/\s+/g,' ').trim()}
function nameFrom(text){return afterLabel(text,/\bNOMBRE(?:S)?\b/i,/CURP|CLAVE|FECHA|FOLIO|REGISTRO|DOMICILIO|VIGENCIA|SECCION/i,4)}
function placeFrom(text){return afterLabel(text,/LUGAR DE NACIMIENTO|ENTIDAD DE NACIMIENTO|ENTIDAD FEDERATIVA|MUNICIPIO DE NACIMIENTO/i,/CURP|CLAVE|FECHA|FOLIO|REGISTRO|VIGENCIA/i,3)}
function residence(text){return afterLabel(text,/DOMICILIO/i,/CURP|CLAVE|FECHA|SECCION|VIGENCIA|ELECTOR/i,5)}
async function OCR(file,tag,setp){if(!file)return'';if(!/^image\//.test(file.type)){setp(tag+': usa foto JPG/PNG/WebP para lectura automática.');return''}const T=await tesseract();const r=await T.recognize(file,'spa',{logger:m=>{if(m.status==='recognizing text')setp(`${tag}: ${Math.round((m.progress||0)*100)}%`)}});return r?.data?.text||''}
function dataURL(file){return new Promise(res=>{if(!file)return res('');const fr=new FileReader();fr.onload=()=>res(String(fr.result||''));fr.onerror=()=>res('');fr.readAsDataURL(file)})}
function modal(){
 if(q('#jr42Ocr'))return q('#jr42Ocr');
 const m=document.createElement('div');m.id='jr42Ocr';m.innerHTML=`<div class="jr42-dialog"><div class="jr42-dialog-head"><b>Registro rápido de jugador · OCR</b><button class="jr42-close">×</button></div><div class="jr42-dialog-body">
 <div class="jr42-note"><b>Privacidad:</b> CURP completa, imagen de CURP, INE y texto OCR no se guardan en GitHub ni en localStorage. El OCR rellena el formulario para que el administrador confirme. La credencial puede mostrar la CURP durante esta sesión si tú decides generarla.</div>
 <div class="jr42-docs"><div class="jr42-doc"><b>Documento CURP</b><small>Detecta CURP, fecha/edad, estado de nacimiento y, si el documento trae texto legible, nombre y lugar de nacimiento.</small><input id="jr42CurpDoc" type="file" accept="image/*,.pdf" capture="environment"></div><div class="jr42-doc"><b>INE</b><small>Intenta detectar nombre y domicilio/localidad. Confirma siempre la lectura.</small><input id="jr42IneDoc" type="file" accept="image/*,.pdf" capture="environment"></div></div>
 <div class="jr42-actions"><button class="primary-btn" id="jr42Scan">Escanear documentos</button><button class="ghost-btn" id="jr42Clear">Limpiar OCR</button></div><div id="jr42Progress">También puedes llenar manualmente.</div>
 <div class="jr42-form">
  <div class="jr42-field full"><label>Nombre completo</label><input id="jr42Name"></div>
  <div class="jr42-field"><label>CURP</label><input id="jr42Curp" maxlength="18"></div>
  <div class="jr42-field"><label>Fecha de nacimiento</label><input id="jr42Dob" type="date"></div>
  <div class="jr42-field"><label>Edad</label><input id="jr42Age" readonly></div>
  <div class="jr42-field"><label>Estado de nacimiento (CURP)</label><input id="jr42State"></div>
  <div class="jr42-field"><label>Lugar de nacimiento leído del documento</label><input id="jr42BirthPlace" placeholder="Sólo si aparece en el documento"></div>
  <div class="jr42-field full"><label>Domicilio/localidad leído de INE</label><input id="jr42Residence"></div>
  <div class="jr42-field"><label>Posición</label><select id="jr42Pos"><option>Portero</option><option>Defensa central</option><option>Lateral</option><option>Medio defensivo</option><option>Medio</option><option>Extremo</option><option>Delantero</option><option>Sin definir</option></select></div>
  <div class="jr42-field"><label>Número</label><input id="jr42Num" type="number" min="0" max="99"></div>
  <div class="jr42-field full"><label>Foto para credencial</label><input id="jr42Photo" type="file" accept="image/*" capture="user"></div>
 </div>
 <div class="jr42-actions"><button id="jr42Credential" class="primary-btn">Generar credencial</button></div><div id="jr42CredHost"></div>
 </div></div>`;
 document.body.appendChild(m);q('.jr42-close',m).onclick=()=>m.classList.remove('show');m.onclick=e=>{if(e.target===m)m.classList.remove('show')};return m;
}
function openOcr(){
 const m=modal();m.classList.add('show');const p=x=>q('#jr42Progress',m).textContent=x;
 q('#jr42Scan',m).onclick=async()=>{const cf=q('#jr42CurpDoc',m).files[0],inf=q('#jr42IneDoc',m).files[0];if(!cf&&!inf){p('Selecciona CURP o INE.');return}q('#jr42Scan',m).disabled=true;try{let ct='',it='';if(cf)ct=await OCR(cf,'CURP',p);if(inf)it=await OCR(inf,'INE',p);const c=curp(ct+' '+it);if(c){q('#jr42Curp',m).value=c;const z=curpInfo(c);if(z){q('#jr42Dob',m).value=z.dob;q('#jr42Age',m).value=z.age;q('#jr42State',m).value=z.state}}const nm=nameFrom(ct)||nameFrom(it);if(nm)q('#jr42Name',m).value=nm;const bp=placeFrom(ct);if(bp)q('#jr42BirthPlace',m).value=bp;const rs=residence(it);if(rs)q('#jr42Residence',m).value=rs;p('OCR terminado. Confirma nombre, CURP, fecha, localidad y posición antes de generar la credencial.')}catch(_){p('OCR no disponible. Puedes continuar manualmente.')}finally{q('#jr42Scan',m).disabled=false}};
 q('#jr42Curp',m).oninput=()=>{const z=curpInfo(q('#jr42Curp',m).value);if(z){q('#jr42Dob',m).value=z.dob;q('#jr42Age',m).value=z.age;q('#jr42State',m).value=z.state}};
 q('#jr42Clear',m).onclick=()=>['#jr42Curp','#jr42Dob','#jr42Age','#jr42State','#jr42BirthPlace','#jr42Residence'].forEach(s=>q(s,m).value='');
 q('#jr42Credential',m).onclick=async()=>{const name=q('#jr42Name',m).value.trim(),c=q('#jr42Curp',m).value.trim().toUpperCase();if(!name){alert('Confirma el nombre.');return}const photo=await dataURL(q('#jr42Photo',m).files[0]);const rec={name,curp:c,dob:q('#jr42Dob',m).value,age:q('#jr42Age',m).value,state:q('#jr42State',m).value,birth:q('#jr42BirthPlace',m).value,residence:q('#jr42Residence',m).value,pos:q('#jr42Pos',m).value,num:q('#jr42Num',m).value,photo};renderCred(m,rec);const safe={...rec,curp:c?c.slice(0,4)+'************'+c.slice(-2):'',photo:''};try{const a=JSON.parse(localStorage.getItem('jrV25Players')||'[]');a.unshift({...safe,createdAt:new Date().toISOString(),source:'FIX10 OCR'});localStorage.setItem('jrV25Players',JSON.stringify(a))}catch(_){}};
}
function renderCred(m,r){const h=q('#jr42CredHost',m);h.innerHTML=`<div class="jr42-cred">${r.photo?`<img src="${r.photo}">`:'<div></div>'}<div><small>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS A.C.</small><h3>${esc(r.name)}</h3><p>${esc(r.pos)}${r.num?' · #'+esc(r.num):''}${r.age?' · '+esc(r.age)+' años':''}<br>${esc(r.birth||r.state||'')}<br>CURP: ${esc(r.curp||'')}</p></div></div><div class="jr42-actions"><button id="jr42Print" class="ghost-btn">Imprimir / PDF</button></div>`;q('#jr42Print',m).onclick=()=>print();}
function ocrIntercept(){document.addEventListener('click',e=>{const b=e.target.closest('[data-v25-action="player"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openOcr()},true)}

function nav(){document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;const id=b.dataset.view;if(typeof window.showView==='function'){e.preventDefault();window.showView(id)}},true)}
function init(){document.body.classList.add('jr42-fix10');refreshBuild();mountAmbient();clubHero();fixHero();ticker();weather();decorateCards();modernButtons();ocrIntercept();nav();document.addEventListener('visibilitychange',()=>managed.forEach(update));const mo=new MutationObserver(()=>{decorateCards();modernButtons();fixHero()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();