
(function(){
'use strict';
if(window.__JR54WeatherSync)return;
window.__JR54WeatherSync=true;

const BUILD='38-22', TZ='America/Mexico_City', CACHE_TTL=20*60*1000;
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const cfg=window.LJR_FIELD_REGISTRY_V3822;
if(!cfg||!Array.isArray(cfg.fields))return;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const weatherCache=new Map();
let hub, activeTab='matches', fixtures=[], matchWeather=new Map(), refreshTimer=0;

function mapField(value){
  const n=norm(value);
  return cfg.fields.find(f=>[f.id,f.name,...(f.aliases||[])].some(a=>norm(a)===n))||null;
}
function overrideCoords(f){
  try{
    const raw=JSON.parse(localStorage.getItem('jr54-field-pin:'+f.id)||'null');
    if(raw&&Number.isFinite(raw.latitude)&&Number.isFinite(raw.longitude)&&Math.abs(raw.latitude)<=90&&Math.abs(raw.longitude)<=180){
      return {...f,latitude:raw.latitude,longitude:raw.longitude,precision:'admin-pin',weatherEligible:true,sourceNote:'Pin confirmado localmente por JR Control en este dispositivo.'};
    }
  }catch(_){}
  return f;
}
function precisionLabel(p){
  return ({exact:'Campo exacto',complex:'Complejo deportivo',locality:'Referencia de comunidad','near-field':'Referencia junto al campo','admin-pin':'Pin JR Control',pending:'Pin pendiente',regional:'Pronóstico regional'})[p]||p;
}
function mapsSearch(f){
  const x=overrideCoords(f);
  const query=(x.precision==='exact'||x.precision==='admin-pin')&&Number.isFinite(x.latitude)?`${x.latitude},${x.longitude}`:(x.mapsQuery||x.address||x.name);
  return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
}
function mapsDirections(f){
  const x=overrideCoords(f);
  const dest=(x.precision==='exact'||x.precision==='admin-pin')&&Number.isFinite(x.latitude)?`${x.latitude},${x.longitude}`:(x.mapsQuery||x.address||x.name);
  return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(dest);
}
function googleWeather(f){
  return 'https://www.google.com/search?q='+encodeURIComponent('clima '+(f.community||f.name)+' Guanajuato');
}
function weatherCoords(field){
  const f=overrideCoords(field);
  if(Number.isFinite(f.latitude)&&Number.isFinite(f.longitude))return {latitude:f.latitude,longitude:f.longitude,precision:f.precision,label:f.name};
  const r=cfg.regionalFallback;
  return {latitude:r.latitude,longitude:r.longitude,precision:'regional',label:r.label};
}
function dateKey(at){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
function weekday(at){
  return new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short'}).format(new Date(at));
}
function nextLeagueDate(dayOfWeek, kickoff){
  const names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const target=names[dayOfWeek];
  const now=Date.now();
  for(let d=0;d<=8;d++){
    const probe=now+d*86400000;
    if(weekday(probe)!==target)continue;
    const key=dateKey(probe);
    const at=localToEpoch(key+'T'+kickoff);
    if(at&&at>now-30*60*1000)return {date:key,kind:'estimada',at};
  }
  return null;
}
function localToEpoch(local){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))return null;
  const [ds,ts]=local.split('T'), [y,m,d]=ds.split('-').map(Number), [hh,mm]=ts.split(':').map(Number);
  const naive=Date.UTC(y,m-1,d,hh,mm,0);
  let cand=naive;
  for(let i=0;i<3;i++){
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(cand)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    const represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
    cand+=naive-represented;
  }
  return cand;
}
function normalizedTime(category,time){
  if(!/^\d{1,2}:\d{2}$/.test(String(time||'')))return null;
  let [h,m]=time.split(':').map(Number);
  if(/^Veteranos/i.test(category)&&h>=1&&h<=7)h+=12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function phaseGames(categoryName,cat){
  let arr=[], phase=String(cat.current_phase||'');
  if(cat.knockout&&Array.isArray(cat.knockout[phase]))arr=cat.knockout[phase];
  if(!arr.length&&cat.rounds){
    const m=phase.match(/\bJ(\d+)\b/i);
    if(m&&Array.isArray(cat.rounds['J'+m[1]]))arr=cat.rounds['J'+m[1]];
  }
  return arr.filter(g=>g&&g.home&&g.away&&g.time&&g.field).map((g,i)=>{
    const time=normalizedTime(categoryName,g.time);
    const field=mapField(g.field);
    const pattern=cfg.playPatterns[categoryName]||{dayOfWeek:0,label:'Domingo'};
    let schedule=null;
    if(g.date&&/^\d{4}-\d{2}-\d{2}$/.test(g.date)){
      const at=localToEpoch(g.date+'T'+time);
      schedule={date:g.date,kind:'confirmada',at};
    }else{
      schedule=nextLeagueDate(pattern.dayOfWeek,time);
    }
    return {id:norm([categoryName,phase,g.home,g.away,g.field,g.time].join('|')).replace(/[^a-z0-9]+/g,'-'),category:categoryName,phase,home:g.home,away:g.away,time,originalTime:g.time,fieldValue:g.field,field,pattern,schedule};
  });
}
async function loadFixtures(){
  const res=await fetch('./data/temporada-actual-2026.json?build='+BUILD+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});
  if(!res.ok)throw new Error('No se pudo leer temporada actual');
  const data=await res.json();
  return Object.entries(data.categories||{}).flatMap(([name,cat])=>phaseGames(name,cat));
}
function forecastUrl(c){
  const p=new URLSearchParams({
    latitude:String(c.latitude),longitude:String(c.longitude),
    hourly:'temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_gusts_10m',
    forecast_days:'16',timezone:TZ,temperature_unit:'celsius',wind_speed_unit:'kmh'
  });
  return 'https://api.open-meteo.com/v1/forecast?'+p;
}
async function getForecast(field){
  const c=weatherCoords(field);
  const key=[c.latitude,c.longitude].join(',');
  const old=weatherCache.get(key);
  if(old&&Date.now()-old.at<CACHE_TTL)return {data:old.data,coords:c};
  try{
    const stored=JSON.parse(sessionStorage.getItem('jr54wx:'+key)||'null');
    if(stored&&Date.now()-stored.at<CACHE_TTL){
      weatherCache.set(key,stored);
      return {data:stored.data,coords:c};
    }
  }catch(_){}
  const res=await fetch(forecastUrl(c),{cache:'no-store',credentials:'omit'});
  if(!res.ok)throw new Error('Clima HTTP '+res.status);
  const data=await res.json(), entry={at:Date.now(),data};
  weatherCache.set(key,entry);
  try{sessionStorage.setItem('jr54wx:'+key,JSON.stringify(entry))}catch(_){}
  return {data,coords:c};
}
function weatherWindow(data,matchAt){
  const h=data&&data.hourly;
  if(!h||!Array.isArray(h.time))return null;
  const idx=[];
  for(let i=0;i<h.time.length;i++){
    const at=Date.parse(h.time[i]);
    if(Number.isFinite(at)&&at>=matchAt-60*60*1000&&at<=matchAt+2*60*60*1000)idx.push(i);
  }
  if(!idx.length)return null;
  const vals=(key)=>idx.map(i=>Number(h[key]?.[i])).filter(Number.isFinite);
  const max=a=>a.length?Math.max(...a):null;
  const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
  return {
    prob:max(vals('precipitation_probability')),
    precipitation:max(vals('precipitation')),
    rain:max(vals('rain')),
    gust:max(vals('wind_gusts_10m')),
    code:max(vals('weather_code')),
    temp:avg(vals('temperature_2m'))
  };
}
function risk(wx){
  if(!wx)return {level:'na',label:'Sin pronóstico por horario',detail:'La fecha/hora está fuera del rango disponible o falta información.'};
  if((wx.code??0)>=95||(wx.gust??0)>=70||(wx.rain??0)>=8){
    return {level:'high',label:'ALERTA ALTA · revisión obligatoria',detail:'Tormenta, lluvia fuerte o rachas fuertes previstas cerca del horario.'};
  }
  if(((wx.prob??0)>=70&&(wx.precipitation??0)>=1)||(wx.rain??0)>=2.5){
    return {level:'high',label:'ALERTA DE LLUVIA · posible afectación',detail:'Revisar el terreno antes del partido y esperar decisión oficial de la Liga.'};
  }
  if((wx.prob??0)>=50||(wx.rain??0)>=1||(wx.gust??0)>=50){
    return {level:'watch',label:'VIGILANCIA · revisar campo',detail:'Hay señal meteorológica que puede afectar el terreno; confirmar cerca del horario.'};
  }
  return {level:'good',label:'PRONÓSTICO FAVORABLE',detail:'No se detecta señal meteorológica fuerte cerca del horario. El estado real del campo aún debe revisarse.'};
}
function fmtDate(m){
  if(!m.schedule)return 'Fecha pendiente';
  const at=m.schedule.at;
  return new Intl.DateTimeFormat('es-MX',{timeZone:TZ,weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at));
}
function fieldMarkup(raw){
  const f=overrideCoords(raw), p=f.precision;
  return `<article class="jr54-card">
    <div class="jr54-kicker">${esc(f.community||'Campo')}</div>
    <h3>${esc(f.name)}</h3>
    <p>${esc(f.address||'Ubicación por confirmar')}</p>
    <div class="jr54-meta">
      <span class="jr54-pill ${esc(p)}">${esc(precisionLabel(p))}</span>
      ${Number.isFinite(f.latitude)?`<span class="jr54-pill">${f.latitude.toFixed(5)}, ${f.longitude.toFixed(5)}</span>`:''}
    </div>
    <p class="jr54-small">${esc(f.sourceNote||'')}</p>
    <div class="jr54-links">
      <a class="jr54-link" href="${mapsSearch(f)}" target="_blank" rel="noopener">📍 Google Maps</a>
      <a class="jr54-link" href="${mapsDirections(f)}" target="_blank" rel="noopener">🧭 Cómo llegar</a>
      <a class="jr54-link" href="${googleWeather(f)}" target="_blank" rel="noopener">☁️ Clima en Google</a>
      <button class="jr54-btn" data-jr54-pin="${esc(f.id)}">Ajustar pin</button>
    </div>
  </article>`;
}
function matchMarkup(m){
  const res=matchWeather.get(m.id), r=res?.risk||risk(null), f=m.field;
  const precision=res?.coords?.precision||f?.precision||'pending';
  const dateLabel=fmtDate(m)+(m.schedule?.kind==='estimada'?' · fecha estimada por patrón de la liga':'');
  const wx=res?.wx;
  return `<article class="jr54-match">
    <div class="jr54-match-head">
      <div>
        <div class="jr54-kicker">${esc(m.category)} · ${esc(m.phase)}</div>
        <h3>${esc(m.home)} vs ${esc(m.away)}</h3>
        <div class="jr54-scoreline">${esc(dateLabel)}</div>
        <p>${esc(f?.name||m.fieldValue)} · <span class="jr54-pill ${esc(precision)}">${esc(precisionLabel(precision))}</span></p>
      </div>
      <a class="jr54-link" href="${f?mapsSearch(f):'#'}" target="_blank" rel="noopener">Mapa</a>
    </div>
    <div class="jr54-weather">
      <div class="jr54-risk ${esc(r.level)}">${esc(r.label)}</div>
      <p>${esc(r.detail)}</p>
      ${wx?`<p>🌧️ prob. ${wx.prob??'—'}% · lluvia ${wx.rain??'—'} mm/h · precip. ${wx.precipitation??'—'} mm · 🌡️ ${wx.temp==null?'—':wx.temp.toFixed(1)}°C · 💨 racha ${wx.gust??'—'} km/h</p>`:''}
      <p class="jr54-small">Pronóstico ≠ estado del terreno ≠ decisión oficial. La lluvia no cambia por sí sola el partido a “Suspendido”.</p>
    </div>
    <div class="jr54-links">
      <button class="jr54-btn" data-jr54-share="${esc(m.id)}">Compartir aviso</button>
      <button class="jr54-btn" data-jr54-copy="${esc(m.id)}">Copiar aviso</button>
    </div>
  </article>`;
}
function render(){
  if(!hub)return;
  qa('.jr54-tab',hub).forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  const panel=q('.jr54-panel',hub);
  if(activeTab==='fields'){
    panel.innerHTML=`<div class="jr54-grid">${cfg.fields.map(fieldMarkup).join('')}</div>`;
  }else{
    panel.innerHTML=fixtures.length?`<div class="jr54-grid">${fixtures.map(matchMarkup).join('')}</div>`:`<div class="jr54-empty">No hay partidos con campo y horario en la fase actual.</div>`;
  }
}
function notifyHighRisks(){
  if(!('Notification'in window)||Notification.permission!=='granted')return;
  const now=Date.now();
  fixtures.forEach(m=>{
    const x=matchWeather.get(m.id);
    if(!x||x.risk.level!=='high'||!m.schedule?.at)return;
    const delta=m.schedule.at-now;
    if(delta<0||delta>48*3600000)return;
    const key='jr54-alerted:'+m.id+':'+dateKey(m.schedule.at);
    if(localStorage.getItem(key))return;
    try{
      new Notification('Liga JR · alerta de clima',{
        body:`${m.home} vs ${m.away} · ${m.field?.name||m.fieldValue} · ${x.risk.label}. Requiere revisión y decisión oficial.`,
        icon:'./icon-192.png'
      });
      localStorage.setItem(key,'1');
    }catch(_){}
  });
}
async function refreshWeather(){
  hub?.setAttribute('aria-busy','true');
  try{
    const jobs=fixtures.map(async m=>{
      if(!m.field||!m.schedule?.at)return;
      try{
        const {data,coords}=await getForecast(m.field);
        const wx=weatherWindow(data,m.schedule.at);
        matchWeather.set(m.id,{wx,coords,risk:risk(wx)});
      }catch(e){
        matchWeather.set(m.id,{wx:null,coords:weatherCoords(m.field),risk:{level:'na',label:'Clima no disponible',detail:String(e.message||e)}});
      }
    });
    await Promise.all(jobs);
    render();
    notifyHighRisks();
    const stamp=q('.jr54-updated',hub);
    if(stamp)stamp.textContent='Actualizado '+new Intl.DateTimeFormat('es-MX',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  }finally{
    hub?.removeAttribute('aria-busy');
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>{if(!document.hidden)refreshWeather()},CACHE_TTL);
  }
}
function alertText(m){
  const x=matchWeather.get(m.id), r=x?.risk||risk(null), f=m.field?.name||m.fieldValue;
  return `Liga Juventino Rosas\n${m.home} vs ${m.away}\n${fmtDate(m)}\nCampo: ${f}\n${r.label}\n${r.detail}\n\nPronóstico, terreno y decisión oficial son estados separados. Confirma el aviso final de la Liga.`;
}
async function shareMatch(m){
  const text=alertText(m);
  if(navigator.share){
    try{await navigator.share({title:'Liga JR · clima del partido',text,url:location.href});return}catch(_){}
  }
  try{await navigator.clipboard.writeText(text);alert('Aviso copiado.')}catch(_){prompt('Copia el aviso:',text)}
}
function editPin(id){
  const f=cfg.fields.find(x=>x.id===id);if(!f)return;
  const current=overrideCoords(f);
  const lat=prompt(`Latitud exacta para ${f.name}`,Number.isFinite(current.latitude)?String(current.latitude):'');
  if(lat===null)return;
  const lon=prompt(`Longitud exacta para ${f.name}`,Number.isFinite(current.longitude)?String(current.longitude):'');
  if(lon===null)return;
  const latitude=Number(lat), longitude=Number(lon);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){
    alert('Coordenadas no válidas.');return;
  }
  localStorage.setItem('jr54-field-pin:'+id,JSON.stringify({latitude,longitude,updatedAt:new Date().toISOString()}));
  weatherCache.clear();matchWeather.clear();render();refreshWeather();
}
async function enableNotifications(){
  if(!('Notification'in window)){alert('Este navegador no ofrece notificaciones web en esta vista. Los avisos seguirán visibles dentro de la página.');return}
  const p=await Notification.requestPermission();
  if(p==='granted'){alert('Avisos de clima activados mientras esta versión pueda ejecutar notificaciones.');notifyHighRisks()}
}
function mount(){
  if(q('#jr54WeatherHub'))return;
  hub=document.createElement('section');hub.id='jr54WeatherHub';
  hub.innerHTML=`<div class="jr54-head">
    <div><div class="jr54-kicker">Central operativa V38 · clima por campo y horario</div>
      <h2>Campos, ubicación y clima de partido</h2>
      <p>Consulta el pronóstico cerca de la hora real del partido. Para campos sin pin exacto se muestra una referencia de comunidad o regional claramente etiquetada.</p>
    </div>
    <div class="jr54-actions"><button class="jr54-btn primary jr54-refresh">Actualizar clima</button><button class="jr54-btn jr54-notify">Activar avisos</button></div>
  </div>
  <div class="jr54-note"><b>Regla operativa:</b> el sistema puede generar una alerta automática por lluvia, tormenta o viento, pero no cambia por sí solo el estado oficial a “Suspendido”. La Liga confirma después de revisar pronóstico + terreno + horario.</div>
  <div class="jr54-tabs"><button class="jr54-tab active" data-tab="matches">Partidos por horario</button><button class="jr54-tab" data-tab="fields">Todos los campos y Maps</button><span class="jr54-small jr54-updated"></span></div>
  <div class="jr54-panel"></div>`;
  const anchor=q('#jr42FieldWeather')||q('#view-home')||q('main')||document.body;
  if(anchor.id==='jr42FieldWeather')anchor.insertAdjacentElement('afterend',hub);
  else anchor.appendChild(hub);
  hub.addEventListener('click',e=>{
    const tab=e.target.closest('[data-tab]');if(tab){activeTab=tab.dataset.tab;render();return}
    const pin=e.target.closest('[data-jr54-pin]');if(pin){editPin(pin.dataset.jr54Pin);return}
    const sh=e.target.closest('[data-jr54-share]');if(sh){const m=fixtures.find(x=>x.id===sh.dataset.jr54Share);if(m)shareMatch(m);return}
    const cp=e.target.closest('[data-jr54-copy]');if(cp){const m=fixtures.find(x=>x.id===cp.dataset.jr54Copy);if(m){const text=alertText(m);navigator.clipboard?.writeText(text).then(()=>alert('Aviso copiado.')).catch(()=>prompt('Copia el aviso:',text))}return}
    if(e.target.closest('.jr54-refresh')){weatherCache.clear();refreshWeather();return}
    if(e.target.closest('.jr54-notify')){enableNotifications();return}
  });
  render();
}
async function init(){
  mount();
  try{fixtures=await loadFixtures()}catch(e){fixtures=[]}
  render();
  refreshWeather();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()%CACHE_TTL<60000)refreshWeather()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
