/* ==========================================================
   LIGA JUVENTINO ROSAS — V38 FIX8
   OCR + CLIMA + MOBILE PARITY + FULL MOTION
   ========================================================== */
(function(){
'use strict';
if(window.__JR41Fix8)return;
window.__JR41Fix8=true;
document.documentElement.classList.add('jr41-js');

const BUILD='38-9';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const saveData=!!(navigator.connection&&navigator.connection.saveData);

const ASSETS={
 hero:'./assets/motion/v38-soccer-hero.mp4',
 matches:'./assets/motion/v38-soccer-matchday.mp4',
 fields:'./assets/motion/v38-soccer-fields-rain.mp4',
 teams:'./assets/motion/v38-emirates-teams.mp4',
 bracket:'./assets/motion/v38-soccer-liguilla.mp4',
 table:'./assets/motion/v38-emirates-table.mp4',
 stats:'./assets/motion/v38-emirates-stats.mp4',
 more:'./assets/motion/v38-emirates-community.mp4',
 matchcenter:'./assets/motion/v38-emirates-matchcenter.mp4',
 teamsAlt:'./assets/motion/v38-soccer-teams.mp4',
 statsAlt:'./assets/motion/v38-soccer-stats.mp4'
};

const VIEWS={
 matches:{asset:'matches',k:'JORNADA · MATCHDAY',t:'Partidos y resultados',d:'Horarios, campos y resultados con movimiento cinematográfico sin reemplazar los datos de la Liga.',chips:['Jornada','Horarios','Campos']},
 matchcenter:{asset:'matchcenter',k:'LIVE · MATCH CENTER',t:'El partido se siente en vivo.',d:'Marcador y eventos permanecen funcionales; el video sólo crea atmósfera.',chips:['LIVE','Eventos','Alineaciones']},
 fields:{asset:'fields',k:'CAMPOS · CLIMA',t:'Primero mira el terreno.',d:'Pronóstico, revisión real del campo y decisión oficial siguen siendo tres cosas distintas.',chips:['Pronóstico','Terreno','Decisión oficial']},
 teams:{asset:'teams',k:'EQUIPOS · JUGADORES',t:'La liga tiene nombres propios.',d:'Escudos, plantillas y perfiles con presentación de club premium.',chips:['Equipos','Jugadores','Categorías']},
 bracket:{asset:'bracket',k:'COPA · LIGUILLA',t:'Cada cruce cuenta.',d:'La fase final recibe una entrada ceremonial sin inventar marcadores.',chips:['Cuartos','Semifinal','Final']},
 table:{asset:'table',k:'TABLA · TEMPORADA',t:'La temporada, de un vistazo.',d:'La tabla conserva sus números y gana una película propia.',chips:['Tabla','Puntos','Rendimiento']},
 stats:{asset:'stats',k:'DATOS · RENDIMIENTO',t:'Datos dentro de la cancha.',d:'Estadísticas y goleadores usan un film diferente al de la tabla.',chips:['Goleo','Forma','Análisis']},
 more:{asset:'more',k:'COMUNIDAD · LIGA',t:'Fútbol que vive fuera de la cancha.',d:'Herramientas, historias y comunidad con su propia atmósfera.',chips:['Comunidad','Historias','Herramientas']},
 admin:{asset:'teamsAlt',k:'JR CONTROL · OPERACIÓN',t:'Administrar sin escribir de más.',d:'Registro OCR de jugadores, credenciales y herramientas administrativas.',chips:['OCR','Credenciales','Control']}
};

function buildRefresh(){
  try{
    const old=localStorage.getItem('jr41-build');
    localStorage.setItem('jr41-build',BUILD);
    if(old!==BUILD && 'caches' in window){
      caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
    }
    if(navigator.serviceWorker){
      navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update())).catch(()=>{});
    }
  }catch(_){}
  addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
}

/* ---- Motion system ---- */
const managed=new Set();
let observer=null;
function makeVideo(src,cls=''){
  if(!src||reduced.matches||saveData)return null;
  const v=document.createElement('video');
  v.className=cls;
  v.dataset.src=src;
  v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';
  v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');
  v.dataset.visible='false';
  managed.add(v);
  if(observer)observer.observe(v);
  return v;
}
function source(v){if(!v.src&&v.dataset.src){v.src=v.dataset.src;v.preload='metadata';v.load()}}
function refreshVideo(v){
  if(v.dataset.visible==='true'&&!document.hidden&&!reduced.matches&&!saveData){
    source(v);const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }else v.pause();
}
observer='IntersectionObserver' in window?new IntersectionObserver(es=>{
  es.forEach(e=>{e.target.dataset.visible=(e.isIntersecting&&e.intersectionRatio>.03)?'true':'false';if(e.isIntersecting)source(e.target)});
  managed.forEach(v=>document.body.contains(v)&&refreshVideo(v));
},{threshold:[0,.03,.15],rootMargin:'240px 0px'}):null;

let ambientIndex=0;
const AMBIENT=['hero','matchcenter','fields','table','stats','teams','bracket','more'];
function mountAmbient(){
  if(q('#jr41Ambient')||reduced.matches||saveData)return;
  const host=document.createElement('div');host.id='jr41Ambient';
  const a=makeVideo(ASSETS.hero,'active'),b=makeVideo(ASSETS.matchcenter,'');
  if(a){a.dataset.visible='true';source(a);host.appendChild(a)}
  if(b){b.dataset.visible='true';source(b);host.appendChild(b)}
  document.body.prepend(host);
  const vids=qa('video',host);
  if(!vids.length)return;
  let active=0;
  function swap(assetKey){
    if(!ASSETS[assetKey]||vids.length<2)return;
    const next=1-active,nv=vids[next],ov=vids[active];
    nv.pause();nv.removeAttribute('src');nv.dataset.src=ASSETS[assetKey];source(nv);
    const p=nv.play();if(p&&p.catch)p.catch(()=>{});
    requestAnimationFrame(()=>{nv.classList.add('active');ov.classList.remove('active')});
    active=next;
  }
  window.__JR41AmbientSwap=swap;
  setInterval(()=>{
    ambientIndex=(ambientIndex+1)%AMBIENT.length;
    swap(AMBIENT[ambientIndex]);
  },18000);
}

function banner(id,view){
  const c=VIEWS[id];if(!c||!view||q('.jr41-view-banner',view))return;
  const s=document.createElement('section');s.className='jr41-view-banner';
  const v=makeVideo(ASSETS[c.asset],'');
  if(v)s.appendChild(v);
  const copy=document.createElement('div');copy.className='jr41-banner-copy';
  copy.innerHTML=`<div class="jr41-kicker">${c.k}</div><h2>${c.t}</h2><p>${c.d}</p><div class="jr41-chips">${c.chips.map(x=>`<span>${x}</span>`).join('')}</div>`;
  s.appendChild(copy);
  view.insertBefore(s,view.firstChild);
}
function scanViews(){Object.keys(VIEWS).forEach(id=>{const v=q('#view-'+id);if(v)banner(id,v)})}

/* ---- Moving values rail ---- */
function mountTicker(){
  if(q('#jr41Ticker'))return;
  const hero=q('#v14CinematicHero'),home=q('#view-home');
  if(!home)return;
  const t=document.createElement('div');t.id='jr41Ticker';
  const values=[
    '<b>5 categorías</b> · Primera · Intermedia · Segunda · Veteranos 35+ · Veteranos 50+',
    '<b>LIVE</b> · Match Center',
    '<b>Matchday</b> · Jornadas',
    '<b>Liguilla</b> · Cruces y final',
    '<b id="jr41TickerWeather">Clima regional</b>',
    '<b>JR Control</b> · Registro OCR y credenciales'
  ];
  const joined=values.map(x=>`<span>${x}</span>`).join('');
  t.innerHTML=`<div class="track">${joined}${joined}</div>`;
  if(hero)hero.insertAdjacentElement('afterend',t);else home.prepend(t);
}

/* ---- Weather ---- */
const WEATHER_KEY='jr41-weather-cache';
function wxLabel(code){
  if(code===0)return'Despejado';
  if([1,2].includes(code))return'Parcialmente nublado';
  if(code===3)return'Nublado';
  if([45,48].includes(code))return'Niebla';
  if([51,53,55,56,57].includes(code))return'Llovizna';
  if([61,63,65,66,67,80,81,82].includes(code))return'Lluvia';
  if([95,96,99].includes(code))return'Tormenta';
  return'Condición variable';
}
function cachedWeather(){
  try{
    const x=JSON.parse(localStorage.getItem(WEATHER_KEY)||'null');
    if(x&&Date.now()-x.savedAt<30*60*1000)return x.data;
  }catch(_){}
  return null;
}
function saveWeather(data){try{localStorage.setItem(WEATHER_KEY,JSON.stringify({savedAt:Date.now(),data}))}catch(_){}}
async function fetchWeather(force=false){
  const cached=!force&&cachedWeather();
  if(cached)return cached;
  const url='https://api.open-meteo.com/v1/forecast?latitude=20.64337&longitude=-100.99286&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m&hourly=precipitation_probability&timezone=America%2FMexico_City&forecast_days=2';
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok)throw new Error('weather');
  const d=await r.json();
  const cur=d.current||{},times=d.hourly?.time||[],probs=d.hourly?.precipitation_probability||[];
  let prob='—';
  if(cur.time&&times.length){
    let best=0,dist=Infinity,t=Date.parse(cur.time);
    times.forEach((x,i)=>{const dd=Math.abs(Date.parse(x)-t);if(dd<dist){dist=dd;best=i}});
    prob=Number.isFinite(probs[best])?Math.round(probs[best])+'%':'—';
  }
  const out={
    temp:Number.isFinite(cur.temperature_2m)?Math.round(cur.temperature_2m)+'°C':'—',
    feels:Number.isFinite(cur.apparent_temperature)?Math.round(cur.apparent_temperature)+'°C':'—',
    prob,
    gust:Number.isFinite(cur.wind_gusts_10m)?Math.round(cur.wind_gusts_10m)+' km/h':'—',
    label:wxLabel(cur.weather_code),
    time:cur.time||''
  };
  saveWeather(out);return out;
}
function mountWeather(){
  if(q('#jr41Weather'))return;
  const home=q('#view-home');if(!home)return;
  const s=document.createElement('section');s.id='jr41Weather';s.className='section';
  s.innerHTML=`
    <div class="jr41-weather-head">
      <div><div class="eyebrow">CLIMA Y CAMPOS</div><h2>Pronóstico ≠ terreno ≠ decisión.</h2>
      <p>Referencia meteorológica regional de Juventino Rosas. La lluvia por sí sola nunca suspende un partido; la Liga confirma la decisión oficial.</p></div>
      <button type="button" class="ghost-btn" id="jr41WxRefresh">Actualizar clima</button>
    </div>
    <div class="jr41-weather-grid">
      <article class="jr41-weather-card forecast"><small>🌦 Pronóstico regional</small><strong id="jr41WxMain">Consultando…</strong><p id="jr41WxMeta">Temperatura, lluvia y rachas.</p></article>
      <article class="jr41-weather-card field"><small>🏟 Estado del terreno</small><strong id="jr41FieldState">Revisión física requerida</strong><p>Un campo puede seguir pesado o encharcado aunque ya no esté lloviendo.</p></article>
      <article class="jr41-weather-card official"><small>✓ Decisión oficial</small><strong>La Liga confirma</strong><p>Programado · Por confirmar · Retrasado · Suspendido. No se deduce sólo del porcentaje de lluvia.</p></article>
    </div>
    <div class="jr41-weather-actions"><button class="primary-btn" type="button" data-view="fields">Abrir Campos →</button><button class="ghost-btn" type="button" data-view="matches">Ver jornada</button></div>`;
  const anchor=q('#jr40FilmRail')||q('#jr39Ops')||q('#jr41Ticker')||q('#v14CinematicHero');
  if(anchor)anchor.insertAdjacentElement('afterend',s);else home.prepend(s);
  const update=async(force=false)=>{
    const main=q('#jr41WxMain'),meta=q('#jr41WxMeta');
    try{
      if(force){main.textContent='Actualizando…';}
      const w=await fetchWeather(force);
      main.textContent=`${w.temp} · ${w.label} · lluvia ${w.prob}`;
      meta.textContent=`Sensación ${w.feels} · rachas ${w.gust}${w.time?' · '+new Date(w.time).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}):''}`;
      const tw=q('#jr41TickerWeather');if(tw)tw.textContent=`Clima ${w.temp} · lluvia ${w.prob}`;
    }catch(_){
      main.textContent='Sin conexión meteorológica';
      meta.textContent='La revisión de campo y la decisión oficial siguen disponibles.';
    }
  };
  q('#jr41WxRefresh').onclick=()=>update(true);
  update(false);
}

/* ---- CURP / INE OCR player registration ---- */
const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const FALLBACK={
 'Primera Fuerza':['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas'],
 'Intermedia':['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta'],
 'Segunda Fuerza':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'],
 'Veteranos 35+':['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán'],
 'Veteranos 50+':['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']
};
const STATE_CODES={
 AS:'Aguascalientes',BC:'Baja California',BS:'Baja California Sur',CC:'Campeche',CL:'Coahuila',CM:'Colima',CS:'Chiapas',CH:'Chihuahua',
 DF:'Ciudad de México',DG:'Durango',GT:'Guanajuato',GR:'Guerrero',HG:'Hidalgo',JC:'Jalisco',MC:'Estado de México',MN:'Michoacán',
 MS:'Morelos',NT:'Nayarit',NL:'Nuevo León',OC:'Oaxaca',PL:'Puebla',QT:'Querétaro',QR:'Quintana Roo',SP:'San Luis Potosí',
 SL:'Sinaloa',SR:'Sonora',TC:'Tabasco',TS:'Tamaulipas',TL:'Tlaxcala',VZ:'Veracruz',YN:'Yucatán',ZS:'Zacatecas',NE:'Nacido en el extranjero'
};
function load(k,f=[]){try{return JSON.parse(localStorage.getItem(k))??f}catch(_){return f}}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function folio(){const n=(load('jrV25Folio',1000)||1000)+1;store('jrV25Folio',n);return'JR-'+new Date().getFullYear()+'-'+String(n).padStart(5,'0')}
function teams(cat){
  const d=window.LJR_V20||window.LJR_V20_API?.data||window.LJR_V18;
  const r=d?.rosters?.[cat];
  if(Array.isArray(r)&&r.length)return r.map(x=>x.name||x.team||x).filter(Boolean);
  return FALLBACK[cat]||[];
}
function normalizeOCR(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function extractCurp(text){
  const raw=normalizeOCR(text).replace(/[^A-Z0-9]/g,'');
  const rx=/[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/g;
  const m=raw.match(rx);
  return m?m[0]:'';
}
function curpInfo(curp){
  const c=String(curp||'').toUpperCase().replace(/\s/g,'');
  if(c.length!==18)return null;
  const yy=+c.slice(4,6),mm=+c.slice(6,8),dd=+c.slice(8,10);
  const century=/[A-Z]/.test(c[16])?2000:1900;
  const y=century+yy;
  const dob=new Date(y,mm-1,dd);
  if(dob.getFullYear()!==y||dob.getMonth()!==mm-1||dob.getDate()!==dd)return null;
  const now=new Date();let age=now.getFullYear()-y;
  const md=(now.getMonth()+1)*100+now.getDate();
  if(md<mm*100+dd)age--;
  return{
    dob:`${y}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`,
    age,
    birthState:STATE_CODES[c.slice(11,13)]||''
  };
}
function extractName(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const i=lines.findIndex(x=>/\bNOMBRE\b/i.test(x));
  if(i<0)return'';
  const stop=/DOMICILIO|CLAVE|CURP|FECHA|SECCION|VIGENCIA|ELECTOR/i;
  return lines.slice(i+1,i+4).filter(x=>!stop.test(x)&&x.length>2).join(' ').replace(/\s+/g,' ').trim();
}
function extractResidence(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const i=lines.findIndex(x=>/DOMICILIO/i.test(x));
  if(i<0)return'';
  const stop=/CLAVE|CURP|FECHA|SECCION|VIGENCIA|ELECTOR/i;
  const block=[];
  for(let j=i+1;j<Math.min(lines.length,i+5);j++){if(stop.test(lines[j]))break;block.push(lines[j])}
  return block.join(', ').replace(/\s+/g,' ').trim();
}
let tesseractPromise=null;
function loadTesseract(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  if(tesseractPromise)return tesseractPromise;
  tesseractPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.crossOrigin='anonymous';s.onload=()=>resolve(window.Tesseract);s.onerror=reject;
    document.head.appendChild(s);
  });
  return tesseractPromise;
}
async function ocr(file,label,progress){
  if(!file)return'';
  if(!/^image\//.test(file.type)){progress(`${label}: para OCR automático usa JPG/PNG/WebP; el PDF queda para revisión manual.`);return''}
  const T=await loadTesseract();
  const r=await T.recognize(file,'spa',{logger:m=>{
    if(m.status==='recognizing text')progress(`${label}: ${Math.round((m.progress||0)*100)}%`);
    else if(m.status)progress(`${label}: ${m.status}`);
  }});
  return r?.data?.text||'';
}
function fileData(file){
  return new Promise(res=>{
    if(!file){res('');return}
    const fr=new FileReader();fr.onload=()=>res(String(fr.result||''));fr.onerror=()=>res('');fr.readAsDataURL(file)
  })
}
function mountOcrModal(){
  if(q('#jr41OcrModal'))return q('#jr41OcrModal');
  const m=document.createElement('div');m.id='jr41OcrModal';
  m.innerHTML=`<div class="jr41-ocr-dialog" role="dialog" aria-modal="true" aria-labelledby="jr41OcrTitle">
    <div class="jr41-ocr-head"><h3 id="jr41OcrTitle">Registrar jugador con OCR</h3><button class="jr41-close" type="button" aria-label="Cerrar">×</button></div>
    <div class="jr41-ocr-body">
      <div class="jr41-privacy"><b>Privacidad:</b> el OCR se ejecuta en el navegador. La CURP completa, la imagen de INE y la imagen del documento CURP no se guardan en localStorage ni se suben al repositorio. Guarda sólo CURP enmascarada y datos operativos revisados. La lectura OCR puede equivocarse: confirma la información antes de registrar.</div>
      <div class="jr41-ocr-upload-grid">
        <div class="jr41-docbox"><strong>1. Documento CURP</strong><small>Toma foto o sube imagen. Extrae el número CURP, fecha/edad y estado de nacimiento.</small><div class="jr41-field" style="margin-top:10px"><input id="jr41CurpDoc" type="file" accept="image/*,.pdf" capture="environment"></div></div>
        <div class="jr41-docbox"><strong>2. INE</strong><small>Toma foto o sube imagen. Intenta leer nombre y domicilio/localidad para que tú los confirmes.</small><div class="jr41-field" style="margin-top:10px"><input id="jr41IneDoc" type="file" accept="image/*,.pdf" capture="environment"></div></div>
      </div>
      <div class="jr41-ocr-actions"><button class="primary-btn" id="jr41RunOcr" type="button">Escanear documentos</button><button class="ghost-btn" id="jr41ClearOcr" type="button">Limpiar lectura</button></div>
      <div class="jr41-ocr-progress" id="jr41OcrProgress">También puedes llenar todo manualmente.</div>
      <div class="jr41-player-grid">
        <div class="jr41-field full"><label>Nombre completo</label><input id="jr41Name" autocomplete="off"></div>
        <div class="jr41-field"><label>Categoría</label><select id="jr41Cat">${CATS.map(c=>`<option>${c}</option>`).join('')}</select></div>
        <div class="jr41-field"><label>Equipo</label><select id="jr41Team"></select></div>
        <div class="jr41-field"><label>Número</label><input id="jr41Num" type="number" min="0" max="99"></div>
        <div class="jr41-field"><label>Posición</label><select id="jr41Pos"><option>Portero</option><option>Defensa central</option><option>Lateral</option><option>Medio defensivo</option><option>Medio</option><option>Extremo</option><option>Delantero</option><option>Sin definir</option></select></div>
        <div class="jr41-field"><label>CURP detectada / confirmada</label><input id="jr41Curp" maxlength="18" autocomplete="off"></div>
        <div class="jr41-field"><label>Fecha de nacimiento</label><input id="jr41Dob" type="date"></div>
        <div class="jr41-field"><label>Edad</label><input id="jr41Age" inputmode="numeric" readonly></div>
        <div class="jr41-field"><label>Estado de nacimiento (CURP)</label><input id="jr41BirthState"></div>
        <div class="jr41-field full"><label>Domicilio/localidad leída de INE — confirma manualmente</label><input id="jr41Residence" placeholder="No se usa como domicilio oficial sin revisión"></div>
        <div class="jr41-field"><label>Foto del jugador para credencial</label><input id="jr41Photo" type="file" accept="image/*" capture="user"></div>
        <div class="jr41-field"><label>Vista de foto</label><img id="jr41PhotoPreview" class="jr41-photo-preview" alt="Vista de la fotografía"></div>
      </div>
      <div class="jr41-ocr-actions"><button class="primary-btn" id="jr41SavePlayer" type="button">Registrar y generar credencial</button></div>
      <div id="jr41CredentialHost"></div>
    </div></div>`;
  document.body.appendChild(m);
  q('.jr41-close',m).onclick=()=>m.classList.remove('show');
  m.onclick=e=>{if(e.target===m)m.classList.remove('show')};
  addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('show')});
  return m;
}
function openOcrPlayer(){
  const m=mountOcrModal();m.classList.add('show');
  const cat=q('#jr41Cat',m),team=q('#jr41Team',m);
  const active=localStorage.getItem('jrCategory');if(active&&CATS.includes(active))cat.value=active;
  const fill=()=>{team.innerHTML=teams(cat.value).map(x=>`<option>${esc(x)}</option>`).join('')};fill();cat.onchange=fill;
  const progress=msg=>q('#jr41OcrProgress',m).textContent=msg;

  q('#jr41RunOcr',m).onclick=async()=>{
    const cfile=q('#jr41CurpDoc',m).files[0],ifile=q('#jr41IneDoc',m).files[0];
    if(!cfile&&!ifile){progress('Selecciona al menos una imagen de CURP o INE.');return}
    q('#jr41RunOcr',m).disabled=true;
    try{
      let ct='',it='';
      if(cfile){progress('Preparando OCR de CURP…');ct=await ocr(cfile,'CURP',progress)}
      if(ifile){progress('Preparando OCR de INE…');it=await ocr(ifile,'INE',progress)}
      const curp=extractCurp(ct+' '+it);
      if(curp){
        q('#jr41Curp',m).value=curp;
        const info=curpInfo(curp);
        if(info){q('#jr41Dob',m).value=info.dob;q('#jr41Age',m).value=info.age;q('#jr41BirthState',m).value=info.birthState}
      }
      const name=extractName(it);if(name)q('#jr41Name',m).value=name;
      const residence=extractResidence(it);if(residence)q('#jr41Residence',m).value=residence;
      progress(`OCR terminado. ${curp?'CURP encontrada. ':'CURP no encontrada automáticamente. '}Confirma todos los campos antes de guardar.`);
    }catch(e){
      progress('No se pudo completar el OCR. Puedes registrar manualmente; las imágenes no se guardaron.');
    }finally{q('#jr41RunOcr',m).disabled=false}
  };
  q('#jr41ClearOcr',m).onclick=()=>{
    ['#jr41Curp','#jr41Dob','#jr41Age','#jr41BirthState','#jr41Residence'].forEach(s=>{const x=q(s,m);if(x)x.value=''});
    progress('Lectura limpiada. Puedes volver a escanear.');
  };
  q('#jr41Curp',m).oninput=()=>{
    const info=curpInfo(q('#jr41Curp',m).value);
    if(info){q('#jr41Dob',m).value=info.dob;q('#jr41Age',m).value=info.age;q('#jr41BirthState',m).value=info.birthState}
  };
  q('#jr41Dob',m).onchange=()=>{
    const d=new Date(q('#jr41Dob',m).value+'T12:00:00');if(Number.isNaN(+d))return;
    const n=new Date();let a=n.getFullYear()-d.getFullYear();if((n.getMonth()*100+n.getDate())<(d.getMonth()*100+d.getDate()))a--;
    q('#jr41Age',m).value=a;
  };
  q('#jr41Photo',m).onchange=async()=>{
    const data=await fileData(q('#jr41Photo',m).files[0]);q('#jr41PhotoPreview',m).src=data||'';
  };
  q('#jr41SavePlayer',m).onclick=async()=>{
    const name=q('#jr41Name',m).value.trim(),curp=q('#jr41Curp',m).value.trim().toUpperCase().replace(/\s/g,'');
    if(!name){alert('Confirma el nombre del jugador.');return}
    if(curp&&curp.length!==18){alert('La CURP debe tener 18 caracteres.');return}
    const id=folio(),photoFile=q('#jr41Photo',m).files[0],photo=await fileData(photoFile);
    const rec={
      id,name,category:cat.value,team:team.value,
      number:q('#jr41Num',m).value||'',
      position:q('#jr41Pos',m).value,
      dob:q('#jr41Dob',m).value||'',
      age:q('#jr41Age',m).value||'',
      birthState:q('#jr41BirthState',m).value.trim(),
      residence:q('#jr41Residence',m).value.trim(),
      curpMasked:curp?curp.slice(0,4)+'************'+curp.slice(-2):'',
      hasINE:!!q('#jr41IneDoc',m).files[0],
      hasCURPDoc:!!q('#jr41CurpDoc',m).files[0],
      hasPhoto:!!photoFile,
      createdAt:new Date().toISOString(),
      source:'FIX8 OCR (reviewed by operator)'
    };
    const arr=load('jrV25Players',[]);arr.unshift(rec);store('jrV25Players',arr);
    window.__JR41LastCredential={...rec,photo};
    renderCredential(m,window.__JR41LastCredential);
    progress('Jugador registrado. La CURP completa y los documentos no se guardaron.');
  };
}
function renderCredential(m,rec){
  const h=q('#jr41CredentialHost',m);
  h.innerHTML=`<div class="jr41-credential">
    ${rec.photo?`<img src="${rec.photo}" alt="">`:`<div class="jr41-photo-preview"></div>`}
    <div><div class="jr41-kicker">LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</div><h4>${esc(rec.name)}</h4>
    <p>${esc(rec.team)} · ${esc(rec.category)}<br>${esc(rec.position)}${rec.number?` · #${esc(rec.number)}`:''}${rec.age?` · ${esc(rec.age)} años`:''}<br>${esc(rec.birthState||'')}</p>
    <span class="jr41-folio">${esc(rec.id)}</span></div></div>
    <div class="jr41-ocr-actions"><button class="ghost-btn" id="jr41CredentialPng" type="button">Descargar credencial PNG</button><button class="ghost-btn" id="jr41CredentialPrint" type="button">Imprimir / PDF</button></div>`;
  q('#jr41CredentialPng',m).onclick=()=>credentialPng(rec);
  q('#jr41CredentialPrint',m).onclick=()=>credentialPrint(rec);
}
async function imgFrom(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function credentialPng(rec){
  const c=document.createElement('canvas');c.width=1012;c.height=638;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#07120e');g.addColorStop(1,'#101712');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='#22e07a';x.lineWidth=8;x.strokeRect(12,12,c.width-24,c.height-24);
  x.fillStyle='#22e07a';x.font='700 24px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS A.C.',48,62);
  if(rec.photo){try{const im=await imgFrom(rec.photo);x.save();x.beginPath();x.roundRect(48,110,260,360,28);x.clip();x.drawImage(im,48,110,260,360);x.restore()}catch(_){}}
  x.fillStyle='#fff';x.font='700 46px Arial';wrap(x,rec.name,350,160,600,54);
  x.fillStyle='#b9c3be';x.font='28px Arial';wrap(x,`${rec.team} · ${rec.category}`,350,280,600,38);
  wrap(x,`${rec.position}${rec.number?' · #'+rec.number:''}${rec.age?' · '+rec.age+' años':''}`,350,330,600,38);
  if(rec.birthState)wrap(x,`Nacimiento: ${rec.birthState}`,350,380,600,38);
  x.fillStyle='#22e07a';x.font='700 32px Arial';x.fillText(rec.id,350,465);
  x.fillStyle='#808b85';x.font='22px Arial';x.fillText('Documento interno de la Liga · no muestra CURP completa',350,515);
  const a=document.createElement('a');a.download=`${rec.id}-credencial.png`;a.href=c.toDataURL('image/png');a.click();
}
function wrap(ctx,text,x,y,max,line){
  const words=String(text||'').split(/\s+/);let row='',yy=y;
  words.forEach(w=>{const t=row?row+' '+w:w;if(ctx.measureText(t).width>max&&row){ctx.fillText(row,x,yy);row=w;yy+=line}else row=t});
  if(row)ctx.fillText(row,x,yy);
}
function credentialPrint(rec){
  const w=open('','_blank','width=760,height=850');if(!w)return;
  w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(rec.id)}</title><style>body{font-family:Arial;background:#eee;padding:30px}.c{width:560px;background:#07120e;color:#fff;border:4px solid #22e07a;border-radius:28px;padding:24px}.p{width:145px;height:190px;object-fit:cover;border-radius:18px;float:left;margin-right:24px}.k{color:#22e07a;font-size:12px;font-weight:bold}.id{color:#22e07a;font-weight:bold;font-size:20px}.m{color:#b7c0bb}.clear{clear:both}</style><div class="c">${rec.photo?`<img class="p" src="${rec.photo}">`:''}<div class="k">LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS A.C.</div><h2>${esc(rec.name)}</h2><p class="m">${esc(rec.team)} · ${esc(rec.category)}<br>${esc(rec.position)}${rec.number?` · #${esc(rec.number)}`:''}${rec.age?` · ${esc(rec.age)} años`:''}<br>${esc(rec.birthState||'')}</p><div class="id">${esc(rec.id)}</div><div class="clear"></div></div><script>setTimeout(()=>print(),350)<\/script>`);
  w.document.close();
}

/* Intercept only the existing "Registrar jugador" action and replace it with the OCR-enhanced one. */
function installOcrIntercept(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-v25-action="player"]');
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();openOcrPlayer();
  },true);
}

/* ---- Modern touch interactions / navigation / mobile ---- */
function navEvents(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-view]');
    if(!b)return;
    const id=b.dataset.view;
    const c=VIEWS[id];
    if(c&&window.__JR41AmbientSwap)window.__JR41AmbientSwap(c.asset);
  },true);
}
function observeActiveView(){
  const views=qa('[id^="view-"]');
  if(!views.length)return;
  const mo=new MutationObserver(()=>{
    const active=views.find(v=>v.classList.contains('active')||v.style.display!=='none'&&getComputedStyle(v).display!=='none');
    if(active){
      const id=active.id.replace(/^view-/,'');
      const c=VIEWS[id];if(c&&window.__JR41AmbientSwap)window.__JR41AmbientSwap(c.asset);
    }
  });
  views.forEach(v=>mo.observe(v,{attributes:true,attributeFilter:['class','style','hidden']}));
}
function init(){
  document.body.classList.add('jr41-fix8');
  buildRefresh();
  mountAmbient();
  scanViews();
  mountTicker();
  mountWeather();
  installOcrIntercept();
  navEvents();
  observeActiveView();
  document.addEventListener('visibilitychange',()=>managed.forEach(refreshVideo));
  const mo=new MutationObserver(()=>scanViews());
  mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();