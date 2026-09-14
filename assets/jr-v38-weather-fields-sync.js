/* V38 FIX23 — clima compacto por partido/campo + avisos automáticos.
   Reemplaza la grilla masiva de FIX22 por un buscador compacto.
   Motor inteligente explicable: clima de la hora + lluvia 24/48h previas + ubicación.
   NO sustituye la revisión física ni la decisión oficial de la Liga. */
(function(){
'use strict';
if(window.__JR55WeatherSmart)return;
window.__JR55WeatherSmart=true;

const BUILD='38-28';
const TZ='America/Mexico_City';
const CACHE_TTL=20*60*1000;
const ALERT_KEY='jr55-smart-alerts';
const cfg=window.LJR_FIELD_REGISTRY_V3822;
const engine=window.JR55WeatherEngine;
if(!cfg||!Array.isArray(cfg.fields)||!engine){
  console.warn('[FIX23] Falta registro de campos o motor meteorológico.');
  return;
}

const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const wxCache=new Map();

let hub=null;
let fixtures=[];
let mode='match';
let selectedCategory='';
let selectedMatch='';
let selectedField='';
let lastAnalysis=null;
let refreshTimer=0;
let lastAlertCheck=0;

function mapField(value){
  const n=norm(value);
  return cfg.fields.find(f=>[f.id,f.name,...(f.aliases||[])].some(a=>norm(a)===n))||null;
}

function overrideCoords(field){
  if(!field)return null;
  try{
    const raw=JSON.parse(localStorage.getItem('jr54-field-pin:'+field.id)||'null');
    if(raw&&Number.isFinite(raw.latitude)&&Number.isFinite(raw.longitude)&&Math.abs(raw.latitude)<=90&&Math.abs(raw.longitude)<=180){
      return {...field,latitude:raw.latitude,longitude:raw.longitude,precision:'admin-pin',weatherEligible:true,sourceNote:'Pin confirmado localmente por JR Control en este dispositivo.'};
    }
  }catch(_){}
  return field;
}

function precisionLabel(p){
  return ({
    exact:'Campo exacto',
    complex:'Complejo deportivo',
    locality:'Referencia de comunidad',
    'near-field':'Referencia junto al campo',
    'admin-pin':'Pin JR Control',
    pending:'Pin pendiente',
    regional:'Referencia regional'
  })[p]||p||'Referencia';
}

function weatherCoords(field){
  const f=overrideCoords(field);
  if(f&&Number.isFinite(f.latitude)&&Number.isFinite(f.longitude)){
    return {latitude:f.latitude,longitude:f.longitude,precision:f.precision,label:f.name};
  }
  const r=cfg.regionalFallback;
  return {latitude:r.latitude,longitude:r.longitude,precision:'regional',label:r.label};
}

function mapsSearch(field){
  const f=overrideCoords(field);
  if(!f)return '#';
  const exact=(f.precision==='exact'||f.precision==='admin-pin')&&Number.isFinite(f.latitude);
  const target=exact?`${f.latitude},${f.longitude}`:(f.mapsQuery||f.address||f.name);
  return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(target);
}

function mapsDirections(field){
  const f=overrideCoords(field);
  if(!f)return '#';
  const exact=(f.precision==='exact'||f.precision==='admin-pin')&&Number.isFinite(f.latitude);
  const target=exact?`${f.latitude},${f.longitude}`:(f.mapsQuery||f.address||f.name);
  return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(target);
}

function googleWeather(field){
  const f=overrideCoords(field);
  return 'https://www.google.com/search?q='+encodeURIComponent('clima '+(f?.community||f?.name||'Juventino Rosas')+' Guanajuato');
}

function localToEpoch(local){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(local||'')))return null;
  const [ds,ts]=local.split('T');
  const [y,m,d]=ds.split('-').map(Number);
  const [hh,mm]=ts.split(':').map(Number);
  const naive=Date.UTC(y,m-1,d,hh,mm,0);
  let cand=naive;
  for(let i=0;i<3;i++){
    const parts=Object.fromEntries(
      new Intl.DateTimeFormat('en-CA',{
        timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',
        hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
      }).formatToParts(new Date(cand)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value])
    );
    const represented=Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second);
    cand+=naive-represented;
  }
  return cand;
}

function dateKey(at){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{
    timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(new Date(at)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

function weekday(at){
  return new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short'}).format(new Date(at));
}

function nextLeagueDate(dayOfWeek,kickoff){
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

function normalizedTime(category,time){
  if(!/^\d{1,2}:\d{2}$/.test(String(time||'')))return null;
  let [h,m]=String(time).split(':').map(Number);
  if(/^Veteranos/i.test(category)&&h>=1&&h<=7)h+=12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function phaseGames(categoryName,cat){
  let arr=[];
  const phase=String(cat?.current_phase||'');
  if(cat?.knockout&&Array.isArray(cat.knockout[phase]))arr=cat.knockout[phase];
  if(!arr.length&&cat?.rounds){
    const m=phase.match(/\bJ(\d+)\b/i);
    if(m&&Array.isArray(cat.rounds['J'+m[1]]))arr=cat.rounds['J'+m[1]];
  }
  return arr.filter(g=>g&&g.home&&g.away&&g.time&&g.field).map(g=>{
    const time=normalizedTime(categoryName,g.time);
    const field=mapField(g.field);
    const pattern=cfg.playPatterns[categoryName]||{dayOfWeek:0,label:'Domingo'};
    let schedule=null;
    if(g.date&&/^\d{4}-\d{2}-\d{2}$/.test(g.date)){
      schedule={date:g.date,kind:'confirmada',at:localToEpoch(g.date+'T'+time)};
    }else{
      schedule=nextLeagueDate(pattern.dayOfWeek,time);
    }
    return {
      id:norm([categoryName,phase,g.home,g.away,g.field,g.time].join('|')).replace(/[^a-z0-9]+/g,'-'),
      category:categoryName,phase,home:g.home,away:g.away,time,
      originalTime:g.time,fieldValue:g.field,field,pattern,schedule
    };
  });
}

async function loadFixtures(){
  const res=await fetch('./data/temporada-actual-2026.json?build='+BUILD+'&t='+Date.now(),{
    cache:'no-store',credentials:'omit'
  });
  if(!res.ok)throw new Error('No se pudo leer temporada actual');
  const data=await res.json();
  return Object.entries(data.categories||{}).flatMap(([name,cat])=>phaseGames(name,cat))
    .filter(x=>x.schedule?.at)
    .sort((a,b)=>a.schedule.at-b.schedule.at||a.category.localeCompare(b.category));
}

function forecastUrl(c){
  const p=new URLSearchParams({
    latitude:String(c.latitude),
    longitude:String(c.longitude),
    hourly:'temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_gusts_10m',
    past_days:'2',
    forecast_days:'16',
    timezone:TZ,
    temperature_unit:'celsius',
    wind_speed_unit:'kmh',
    precipitation_unit:'mm'
  });
  return 'https://api.open-meteo.com/v1/forecast?'+p.toString();
}

async function getForecast(field,force=false){
  const c=weatherCoords(field);
  const key=[c.latitude,c.longitude].join(',');
  const old=wxCache.get(key);
  if(!force&&old&&Date.now()-old.at<CACHE_TTL)return {data:old.data,coords:c};

  if(!force){
    try{
      const stored=JSON.parse(sessionStorage.getItem('jr55wx:'+key)||'null');
      if(stored&&Date.now()-stored.at<CACHE_TTL){
        wxCache.set(key,stored);
        return {data:stored.data,coords:c};
      }
    }catch(_){}
  }

  const res=await fetch(forecastUrl(c),{cache:'no-store',credentials:'omit'});
  if(!res.ok)throw new Error('Clima HTTP '+res.status);
  const data=await res.json();
  const entry={at:Date.now(),data};
  wxCache.set(key,entry);
  try{sessionStorage.setItem('jr55wx:'+key,JSON.stringify(entry))}catch(_){}
  return {data,coords:c};
}

function summarize(data,startAt,endAt){
  const h=data?.hourly;
  if(!h||!Array.isArray(h.time))return null;
  const indexes=[];
  for(let i=0;i<h.time.length;i++){
    const at=localToEpoch(String(h.time[i]).slice(0,16));
    if(at&&at>=startAt&&at<=endAt)indexes.push({i,at});
  }
  if(!indexes.length)return null;

  const vals=key=>indexes.map(x=>Number(h[key]?.[x.i])).filter(Number.isFinite);
  const sum=a=>a.length?a.reduce((s,x)=>s+x,0):0;
  const max=a=>a.length?Math.max(...a):null;
  const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
  const now=Date.now();

  return {
    hours:indexes.length,
    observedHours:indexes.filter(x=>x.at<=now).length,
    forecastHours:indexes.filter(x=>x.at>now).length,
    precipTotal:sum(vals('precipitation')),
    rainTotal:sum(vals('rain')),
    rainMax:max(vals('rain')),
    precipMax:max(vals('precipitation')),
    probMax:max(vals('precipitation_probability')),
    gustMax:max(vals('wind_gusts_10m')),
    code:max(vals('weather_code')),
    temp:avg(vals('temperature_2m'))
  };
}

function sourceLabel(s){
  if(!s)return 'sin datos';
  if(s.observedHours&&s.forecastHours)return 'mezcla de horas pasadas + pronóstico';
  if(s.observedHours)return 'horas pasadas/modeladas';
  return 'pronóstico previo al partido';
}

function fmtDate(match){
  if(!match?.schedule?.at)return 'Fecha pendiente';
  return new Intl.DateTimeFormat('es-MX',{
    timeZone:TZ,weekday:'long',day:'numeric',month:'short',
    hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).format(new Date(match.schedule.at));
}

function currentMatch(){
  return fixtures.find(x=>x.id===selectedMatch)||null;
}

function currentField(){
  if(mode==='field')return cfg.fields.find(f=>f.id===selectedField)||null;
  return currentMatch()?.field||null;
}

function availableCategories(){
  return [...new Set(fixtures.map(x=>x.category))];
}

function matchesForCategory(cat){
  return fixtures.filter(x=>x.category===cat);
}

function option(value,label,selected=false){
  return `<option value="${esc(value)}"${selected?' selected':''}>${esc(label)}</option>`;
}

function renderControls(){
  const controls=q('.jr55-controls',hub);
  if(!controls)return;

  if(mode==='field'){
    controls.innerHTML=`
      <label class="jr55-control"><span>Campo</span>
        <select id="jr55FieldSelect">
          ${cfg.fields.map(f=>option(f.id,f.name,f.id===selectedField)).join('')}
        </select>
      </label>
      <button class="jr55-btn primary" data-jr55-action="analyze">Analizar campo</button>
      <button class="jr55-btn" data-jr55-action="match-mode">← Volver a partido</button>
    `;
    return;
  }

  const cats=availableCategories();
  if(!selectedCategory||!cats.includes(selectedCategory))selectedCategory=cats[0]||'';
  const ms=matchesForCategory(selectedCategory);
  if(!selectedMatch||!ms.some(x=>x.id===selectedMatch))selectedMatch=ms[0]?.id||'';

  controls.innerHTML=`
    <label class="jr55-control"><span>Categoría</span>
      <select id="jr55CategorySelect">
        ${cats.map(c=>option(c,c,c===selectedCategory)).join('')}
      </select>
    </label>
    <label class="jr55-control grow"><span>Partido</span>
      <select id="jr55MatchSelect">
        ${ms.map(m=>option(m.id,`${m.home} vs ${m.away} · ${m.time} · ${m.field?.name||m.fieldValue}`,m.id===selectedMatch)).join('')}
      </select>
    </label>
    <button class="jr55-btn primary" data-jr55-action="analyze">Analizar</button>
    <button class="jr55-btn" data-jr55-action="field-mode">Buscar campo</button>
  `;
}

function loadingMarkup(text='Consultando clima…'){
  return `<div class="jr55-loading"><span class="jr55-spinner"></span>${esc(text)}</div>`;
}

function emptyMarkup(text){
  return `<div class="jr55-empty">${esc(text)}</div>`;
}

function metric(label,value,sub=''){
  return `<div class="jr55-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
}

function resultMarkup(ctx){
  const {match,field,coords,windowWx,p24,p48,result,analysisAt}=ctx;
  const p=result.probability;
  const verdict=result.verdict;
  const scoreText=p==null?'—':`${p}%`;
  const precision=coords?.precision||field?.precision||'regional';

  const title=match?`${match.home} vs ${match.away}`:field?.name||'Campo';
  const kicker=match?`${match.category} · ${match.phase}`:'CONSULTA DIRECTA DE CAMPO';
  const when=match
    ? `${fmtDate(match)}${match.schedule?.kind==='estimada'?' · fecha estimada':''}`
    : `Condición meteorológica alrededor de ${new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit'}).format(new Date(analysisAt))}`;

  const r24=p24?`${p24.precipTotal.toFixed(1)} mm`:'—';
  const r48=p48?`${p48.precipTotal.toFixed(1)} mm`:'—';
  const wxProb=windowWx?.probMax==null?'—':`${Math.round(windowWx.probMax)}%`;
  const wxRain=windowWx?.rainMax==null?'—':`${windowWx.rainMax.toFixed(1)} mm/h`;
  const temp=windowWx?.temp==null?'—':`${windowWx.temp.toFixed(1)} °C`;
  const gust=windowWx?.gustMax==null?'—':`${Math.round(windowWx.gustMax)} km/h`;

  return `<article class="jr55-result ${esc(verdict.tone)}">
    <div class="jr55-result-head">
      <div>
        <div class="jr55-kicker">${esc(kicker)}</div>
        <h3>${esc(title)}</h3>
        <p>${esc(when)}</p>
        <p><b>${esc(field?.name||match?.fieldValue||'Campo pendiente')}</b> ·
          <span class="jr55-pill">${esc(precisionLabel(precision))}</span>
        </p>
      </div>
      <div class="jr55-score ${esc(verdict.tone)}">
        <span>Probabilidad orientativa</span>
        <strong>${esc(scoreText)}</strong>
        <b>${esc(verdict.short)}</b>
        <small>confianza ${result.confidence}%</small>
      </div>
    </div>

    <div class="jr55-verdict ${esc(verdict.tone)}">
      <span>ASISTENTE INTELIGENTE</span>
      <strong>${esc(verdict.label)}</strong>
      <p>${esc(result.terrain.label)}. ${esc(result.terrain.detail)}</p>
    </div>

    <div class="jr55-metrics">
      ${metric('Lluvia 24 h previas',r24,sourceLabel(p24))}
      ${metric('Lluvia 48 h previas',r48,sourceLabel(p48))}
      ${metric('Prob. a la hora',wxProb,'ventana -1 h / +2 h')}
      ${metric('Lluvia a la hora',wxRain,'máximo horario')}
      ${metric('Temperatura',temp)}
      ${metric('Racha máxima',gust)}
    </div>

    <details class="jr55-why">
      <summary>¿Por qué da esta probabilidad?</summary>
      <ul>${result.reasons.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
      <p>El motor combina lluvia de las 24/48 h previas, lluvia/tormenta/viento cerca del horario y la precisión del pin. Es una estimación automática explicable, no una inspección física.</p>
    </details>

    <div class="jr55-actions">
      <a class="jr55-btn" href="${field?mapsSearch(field):'#'}" target="_blank" rel="noopener">📍 Mapa</a>
      <a class="jr55-btn" href="${field?mapsDirections(field):'#'}" target="_blank" rel="noopener">🧭 Cómo llegar</a>
      <a class="jr55-btn" href="${field?googleWeather(field):'#'}" target="_blank" rel="noopener">☁️ Google clima</a>
      ${field?`<button class="jr55-btn" data-jr55-action="pin" data-field="${esc(field.id)}">Ajustar pin</button>`:''}
      <button class="jr55-btn" data-jr55-action="share">Compartir aviso</button>
      <button class="jr55-btn" data-jr55-action="copy">Copiar aviso</button>
    </div>

    <div class="jr55-official">
      <b>Automático ≠ oficial.</b> “SÍ/NO probable” es una recomendación meteorológica. El estado oficial Programado / Por confirmar / Retrasado / Suspendido sigue siendo decisión de la Liga tras revisar el terreno.
    </div>
  </article>`;
}

async function analyzeSelection(force=false){
  const panel=q('.jr55-panel',hub);
  if(!panel)return;
  const match=mode==='match'?currentMatch():null;
  const field=currentField();

  if(!field){
    panel.innerHTML=emptyMarkup(mode==='match'?'El partido seleccionado no tiene un campo reconocido.':'Selecciona un campo.');
    return null;
  }

  panel.innerHTML=loadingMarkup('Consultando el campo seleccionado…');
  hub.setAttribute('aria-busy','true');

  try{
    const wx=await getForecast(field,force);
    const analysisAt=match?.schedule?.at||Date.now();
    const windowWx=summarize(wx.data,analysisAt-60*60*1000,analysisAt+2*60*60*1000);
    const p24=summarize(wx.data,analysisAt-24*60*60*1000,analysisAt-1);
    const p48=summarize(wx.data,analysisAt-48*60*60*1000,analysisAt-1);
    const result=engine.scorePlayability({
      match:windowWx,prior24:p24,prior48:p48,precision:wx.coords.precision
    });

    lastAnalysis={match,field,coords:wx.coords,windowWx,p24,p48,result,analysisAt};
    panel.innerHTML=resultMarkup(lastAnalysis);
    const u=q('.jr55-updated',hub);
    if(u)u.textContent='Actualizado '+new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit'}).format(new Date());
    return lastAnalysis;
  }catch(err){
    panel.innerHTML=`<div class="jr55-empty error"><b>No se pudo actualizar el clima.</b><br>${esc(err?.message||err)}<br><button class="jr55-btn" data-jr55-action="analyze">Reintentar</button></div>`;
    return null;
  }finally{
    hub.removeAttribute('aria-busy');
  }
}

function alertText(ctx){
  const m=ctx?.match;
  const r=ctx?.result;
  if(!ctx||!r)return '';
  const subject=m?`${m.home} vs ${m.away}`:ctx.field?.name||'Campo';
  return [
    `Liga Juventino Rosas · ${subject}`,
    `Estimación automática: ${r.verdict.label} (${r.probability??'—'}%).`,
    `Terreno meteorológico: ${r.terrain.label}.`,
    m?`${fmtDate(m)} · ${ctx.field?.name||m.fieldValue}`:`${ctx.field?.name||''}`,
    'La decisión oficial corresponde a la Liga tras revisar el campo.'
  ].filter(Boolean).join('\n');
}

async function shareCurrent(copyOnly=false){
  if(!lastAnalysis)return;
  const text=alertText(lastAnalysis);
  if(!copyOnly&&navigator.share){
    try{await navigator.share({title:'Clima de partido · Liga Juventino Rosas',text});return}catch(_){}
  }
  try{
    await navigator.clipboard.writeText(text);
    miniToast('Aviso copiado.');
  }catch(_){
    prompt('Copia el aviso:',text);
  }
}

function miniToast(text,type='ok'){
  if(typeof window.toast==='function'){
    try{window.toast(text,type==='error'?'error':'success');return}catch(_){}
  }
  let t=q('#jr55Toast');
  if(!t){
    t=document.createElement('div');
    t.id='jr55Toast';
    document.body.appendChild(t);
  }
  t.textContent=text;
  t.className='show '+type;
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.className='',2600);
}

async function adjustPin(fieldId){
  const field=cfg.fields.find(f=>f.id===fieldId);
  if(!field)return;
  const current=overrideCoords(field);
  const lat=prompt(`Latitud exacta para ${field.name}:`,Number.isFinite(current.latitude)?String(current.latitude):'');
  if(lat===null)return;
  const lon=prompt(`Longitud exacta para ${field.name}:`,Number.isFinite(current.longitude)?String(current.longitude):'');
  if(lon===null)return;
  const a=Number(lat),b=Number(lon);
  if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180){
    miniToast('Coordenadas inválidas.','error');return;
  }
  localStorage.setItem('jr54-field-pin:'+field.id,JSON.stringify({latitude:a,longitude:b,updatedAt:Date.now()}));
  wxCache.clear();
  miniToast('Pin guardado en este dispositivo.');
  await analyzeSelection(true);
}

function alertsEnabled(){
  return localStorage.getItem(ALERT_KEY)==='1';
}

function updateAlertButton(){
  const b=q('[data-jr55-action="alerts"]',hub);
  if(!b)return;
  const enabled=alertsEnabled();
  const granted=('Notification'in window)&&Notification.permission==='granted';
  b.classList.toggle('active',enabled);
  b.textContent=enabled?(granted?'🔔 Avisos activos':'🔔 Avisos dentro de la página'):'🔕 Activar avisos';
}

async function toggleAlerts(){
  if(alertsEnabled()){
    localStorage.setItem(ALERT_KEY,'0');
    updateAlertButton();
    miniToast('Avisos automáticos desactivados.');
    return;
  }

  localStorage.setItem(ALERT_KEY,'1');
  if('Notification'in window && Notification.permission==='default'){
    try{await Notification.requestPermission()}catch(_){}
  }
  updateAlertButton();
  miniToast(('Notification'in window&&Notification.permission==='granted')
    ?'Avisos automáticos activados para esta categoría.'
    :'Avisos automáticos activados dentro de la página.');
  await checkCategoryAlerts(true);
}

async function analyzeMatchQuiet(match){
  if(!match?.field||!match.schedule?.at)return null;
  try{
    const wx=await getForecast(match.field,false);
    const at=match.schedule.at;
    const windowWx=summarize(wx.data,at-60*60*1000,at+2*60*60*1000);
    const p24=summarize(wx.data,at-24*60*60*1000,at-1);
    const p48=summarize(wx.data,at-48*60*60*1000,at-1);
    const result=engine.scorePlayability({match:windowWx,prior24:p24,prior48:p48,precision:wx.coords.precision});
    return {match,field:match.field,coords:wx.coords,windowWx,p24,p48,result,analysisAt:at};
  }catch(_){return null}
}

async function checkCategoryAlerts(force=false){
  if(!alertsEnabled()||mode!=='match'||!selectedCategory)return;
  if(!force&&Date.now()-lastAlertCheck<5*60*1000)return;
  lastAlertCheck=Date.now();

  const now=Date.now();
  const upcoming=matchesForCategory(selectedCategory)
    .filter(m=>m.schedule?.at>=now-60*60*1000&&m.schedule?.at<=now+7*86400000)
    .slice(0,4);

  let worst=null;
  for(const m of upcoming){
    const ctx=await analyzeMatchQuiet(m);
    if(!ctx)continue;
    if(!worst||Number(ctx.result.probability)<Number(worst.result.probability))worst=ctx;

    const sig=engine.signature(ctx.result);
    const key='jr55-alert-signature:'+m.id;
    const prev=localStorage.getItem(key);
    if(prev===sig)continue;
    localStorage.setItem(key,sig);

    const title=`${m.category} · ${ctx.result.verdict.short}`;
    const body=`${m.home} vs ${m.away} · ${ctx.result.probability}% · ${ctx.field?.name||m.fieldValue}`;
    if('Notification'in window&&Notification.permission==='granted'){
      try{new Notification(title,{body,tag:'jr55-'+m.id})}catch(_){}
    }
  }

  if(worst&&worst.result.verdict.tone==='high'){
    miniToast(`⚠ ${worst.match.home} vs ${worst.match.away}: ${worst.result.verdict.short}`,'error');
  }
}

function setMode(next){
  mode=next==='field'?'field':'match';
  if(mode==='field'&&!selectedField)selectedField=cfg.fields[0]?.id||'';
  renderControls();
  analyzeSelection(false);
}

function openFields(){
  if(!hub)return;
  setMode('field');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  setTimeout(()=>q('#jr55FieldSelect',hub)?.focus(),250);
}

function openMatches(){
  if(!hub)return;
  setMode('match');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}

function fixLegacyFieldsNavigation(){
  // Evita el error visible "Vista 'fields' no disponible aún".
  qa('[data-view="fields"]').forEach(el=>{
    el.setAttribute('data-jr55-fields','1');
    el.removeAttribute('data-view');
    el.classList.add('jr55-fixed-fields-btn');
  });

  if(typeof window.showView==='function'&&!window.showView.__jr55Fields){
    const old=window.showView;
    const wrapped=function(name,...args){
      if(name==='fields'){openFields();return true}
      return old.apply(this,[name,...args]);
    };
    wrapped.__jr55Fields=true;
    wrapped.__jr55Old=old;
    window.showView=wrapped;
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-jr55-fields]');
    if(!b)return;
    e.preventDefault();
    openFields();
  },true);
}

function bindHub(){
  hub.addEventListener('change',e=>{
    if(e.target.id==='jr55CategorySelect'){
      selectedCategory=e.target.value;
      selectedMatch=matchesForCategory(selectedCategory)[0]?.id||'';
      renderControls();
      analyzeSelection(false);
      checkCategoryAlerts(true);
    }else if(e.target.id==='jr55MatchSelect'){
      selectedMatch=e.target.value;
      analyzeSelection(false);
    }else if(e.target.id==='jr55FieldSelect'){
      selectedField=e.target.value;
      analyzeSelection(false);
    }
  });

  hub.addEventListener('click',async e=>{
    const b=e.target.closest('[data-jr55-action]');
    if(!b)return;
    const a=b.dataset.jr55Action;
    if(a==='analyze')await analyzeSelection(true);
    else if(a==='field-mode')setMode('field');
    else if(a==='match-mode')setMode('match');
    else if(a==='alerts')await toggleAlerts();
    else if(a==='pin')await adjustPin(b.dataset.field);
    else if(a==='share')await shareCurrent(false);
    else if(a==='copy')await shareCurrent(true);
  });
}

async function initData(){
  try{
    fixtures=await loadFixtures();
    const cats=availableCategories();
    selectedCategory=cats[0]||'';
    selectedMatch=matchesForCategory(selectedCategory)[0]?.id||'';
    selectedField=cfg.fields[0]?.id||'';
    renderControls();
    await analyzeSelection(false);
    await checkCategoryAlerts(false);
  }catch(err){
    q('.jr55-panel',hub).innerHTML=emptyMarkup('No se pudo cargar la jornada: '+(err?.message||err));
  }
}

function mount(){
  const old=q('#jr54WeatherHub');
  if(old)old.remove();

  hub=document.createElement('section');
  hub.id='jr54WeatherHub';
  hub.className='jr55-hub';
  hub.setAttribute('aria-label','Clima inteligente por partido y campo');
  hub.innerHTML=`
    <div class="jr55-head">
      <div>
        <div class="jr55-kicker">CENTRAL OPERATIVA V38 · FIX23</div>
        <h2>Clima inteligente del partido</h2>
        <p>Elige categoría y partido. Mostramos <b>un solo análisis</b>: clima del campo, lluvia de 24/48 h previas y probabilidad orientativa de que el terreno esté jugable.</p>
      </div>
      <button class="jr55-btn alert" data-jr55-action="alerts">🔕 Activar avisos</button>
    </div>

    <div class="jr55-rule">
      <b>Automático:</b> el motor inteligente puede avisar “sí probable / revisar / alto riesgo de no jugar”. No cambia por sí solo el estado oficial a “Suspendido”.
    </div>

    <div class="jr55-controls"></div>
    <div class="jr55-status-row">
      <span class="jr55-updated">Preparando análisis…</span>
      <span>Open-Meteo · 2 días previos + hasta 16 días de pronóstico</span>
    </div>
    <div class="jr55-panel" aria-live="polite">${loadingMarkup('Cargando jornada…')}</div>
  `;

  const anchor=q('#jr42FieldWeather')||q('#jr39Ops')||q('#view-home')||q('main')||document.body;
  if(anchor.id==='jr42FieldWeather'||anchor.id==='jr39Ops')anchor.insertAdjacentElement('afterend',hub);
  else anchor.appendChild(hub);

  bindHub();
  fixLegacyFieldsNavigation();
  updateAlertButton();
  initData();

  clearTimeout(refreshTimer);
  const loop=async()=>{
    if(document.visibilityState==='visible'){
      await analyzeSelection(false);
      await checkCategoryAlerts(false);
    }
    refreshTimer=setTimeout(loop,CACHE_TTL);
  };
  refreshTimer=setTimeout(loop,CACHE_TTL);

  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){
      analyzeSelection(false);
      checkCategoryAlerts(false);
    }
  });

  window.addEventListener('focus',()=>{
    checkCategoryAlerts(false);
  });
}

window.JRWeatherV3823={
  build:BUILD,
  openFields,
  openMatches,
  refresh:()=>analyzeSelection(true),
  get mode(){return mode},
  get selectedCategory(){return selectedCategory}
};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();
