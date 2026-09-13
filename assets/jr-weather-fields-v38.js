/* Liga JR V38. Forecast, terrain reports and official match decisions are independent.
 * Based on the league's V37 workflow, rebuilt without unverified regional coordinates.
 * Open-Meteo data attribution: https://open-meteo.com/ / CC BY 4.0.
 */
(function (root) {
  'use strict';
  const TZ = 'America/Mexico_City';
  const TTL = 30 * 60 * 1000, MAX_AGE = 6 * 60 * 60 * 1000, REVIEW_AGE = 12 * 60 * 60 * 1000;
  const DRAFT_KEY = 'jr38-field-drafts', CACHE_KEY = 'jr38-field-weather:';
  const STATUS = Object.freeze({fit:'APTO', review:'REVISIÓN', heavy:'PESADO', unfit:'NO APTO', unknown:'SIN REPORTE'});
  const MATCH = Object.freeze({scheduled:'Programado', review:'En revisión', suspended:'Suspendido', rescheduled:'Reprogramado'});
  // Names and aliases already used by the repository's bulletins; none have verified coordinates here.
  const FIELDS = Object.freeze([
    ['sur-1','Campo 1 · Unidad Deportiva Sur',['1','Campo 1']],
    ['sur-2','Campo 2 · Unidad Deportiva Sur',['2','Campo 2']],
    ['sur-3','Campo 3 · Unidad Deportiva Sur',['3','Campo 3']],
    ['zapata-4','Campo 4 · Emiliano Zapata',['4','Campo 4']],
    ['cerrito','Cerrito de Gasca',['C. de Gasca']], ['tavera','Tavera',[]],
    ['san-juan','San Juan de la Cruz',['San Juan','S. Juan de la Cruz']],
    ['cuenda','Santiago de Cuenda',['Cuenda']], ['romerillo','San Antonio de Romerillo',['Romerillo']],
    ['fraccionamiento','Fraccionamiento',[]], ['pozos','Pozos',[]], ['rincon','Rincón de Centeno',[]],
    ['san-jose','San José',[]], ['san-julian','San Julián',[]]
  ].map(([id,name,aliases]) => Object.freeze({id,name,aliases:Object.freeze(aliases)})));
  const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const plain = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0,max) : '';
  const own = (obj,key) => !!obj && Object.prototype.hasOwnProperty.call(obj,key);
  const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const copy = value => JSON.parse(JSON.stringify(value));
  function fieldFor(value) { return FIELDS.find(f => [f.id,f.name,...f.aliases].some(a => norm(a) === norm(value))) || null; }
  function matchId(category, game, bulletinId = 'actual-final-j6-j5') {
    return [bulletinId,category,game.home,game.away].map(norm).map(s => s.replace(/[^a-z0-9]+/g,'-')).join('__');
  }
  // Reject floating local times, impossible calendar dates and coercion of null/blank to epoch.
  function parseInstant(value) {
    if (typeof value !== 'string') return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    if (!m) return null;
    const y=+m[1], month=+m[2], day=+m[3], h=+m[4], min=+m[5], sec=+(m[6] || 0);
    if (y < 1900 || month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(y,month,0)).getUTCDate() || h > 23 || min > 59 || sec > 59) return null;
    if (m[7] !== 'Z' && (+m[7].slice(1,3) > 14 || +m[7].slice(4) > 59 || (+m[7].slice(1,3) === 14 && +m[7].slice(4) !== 0))) return null;
    const at = Date.parse(value);
    return Number.isFinite(at) ? at : null;
  }
  function zonedParts(at) {
    return Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(at)).filter(p => p.type !== 'literal').map(p => [p.type,p.value]));
  }
  function dayKey(at) { const p=zonedParts(at); return `${p.year}-${p.month}-${p.day}`; }
  function localInput(at) { const p=zonedParts(at); return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`; }
  function localToISO(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
    const naive=parseInstant(value+':00Z'); if (naive === null) return null;
    // Resolve through the IANA database, rather than assuming the device's time zone or a fixed offset.
    let candidate=naive;
    for (let i=0;i<3;i++) { const p=zonedParts(candidate); const represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second); candidate += naive-represented; }
    return localInput(candidate) === value ? new Date(candidate).toISOString() : null;
  }
  function safeURL(value) {
    try { const url=new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
  }
  function cleanCoordinates(value, now = Date.now()) {
    if (!record(value) || typeof value.latitude !== 'number' || typeof value.longitude !== 'number' || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude) || Math.abs(value.latitude) > 90 || Math.abs(value.longitude) > 180) return null;
    const at=parseInstant(value.verifiedAt), source=safeURL(value.source), responsible=plain(value.responsible,120);
    if (at === null || at > now+60000 || !source || !responsible || value.verified !== true) return null;
    return {latitude:value.latitude,longitude:value.longitude,verified:true,verifiedAt:new Date(at).toISOString(),responsible,source};
  }
  function cleanReport(value, now = Date.now()) {
    if (!record(value) || !own(STATUS,value.status)) return null;
    const at=parseInstant(value.reviewedAt), responsible=plain(value.responsible,120), source=plain(value.source,300);
    if (at === null || at > now+60000 || !responsible || !source) return null;
    return {status:value.status,reviewedAt:new Date(at).toISOString(),responsible,source,note:plain(value.note),evidence:safeURL(value.evidence)};
  }
  function readReport(id, reports = {}, now = Date.now()) {
    const report=cleanReport(reports[id],now);
    if (!report) return {status:'unknown',stale:false,report:null};
    const stale=now-parseInstant(report.reviewedAt)>REVIEW_AGE;
    return {status:stale?'unknown':report.status,stale,report};
  }
  function cleanMatch(value, now = Date.now()) {
    if (!record(value) || !own(MATCH,value.status)) return null;
    const at=parseInstant(value.updatedAt), responsible=plain(value.responsible,120), source=plain(value.source,300);
    if (at === null || at > now+60000 || !responsible || !source) return null;
    let kickoff=null;
    if (value.kickoff !== null && value.kickoff !== undefined && value.kickoff !== '') {
      const start=parseInstant(value.kickoff);
      if (start === null || value.kickoffConfirmed !== true) return null;
      kickoff=new Date(start).toISOString();
    }
    return {status:value.status,updatedAt:new Date(at).toISOString(),responsible,source,kickoff,kickoffConfirmed:kickoff!==null,note:plain(value.note)};
  }
  function emptyPublic() { return {schemaVersion:2,publicationState:'published',fields:{},reports:{},matches:{}}; }
  function parsePublic(value, games = [], now = Date.now()) {
    if (!record(value) || value.schemaVersion !== 2 || value.publicationState !== 'published' || !record(value.fields) || !record(value.reports) || !record(value.matches)) return null;
    const output=emptyPublic(), ids=new Set(games.map(g => g.id));
    FIELDS.forEach(f => { const c=cleanCoordinates(value.fields[f.id],now), r=cleanReport(value.reports[f.id],now); if(c)output.fields[f.id]=c; if(r)output.reports[f.id]=r; });
    Object.entries(value.matches).forEach(([id,v]) => { const m=cleanMatch(v,now); if(ids.has(id) && m)output.matches[id]=m; });
    return output;
  }
  function exportProposal(publicData, drafts, games = [], now = Date.now()) {
    const candidate=copy(publicData);
    Object.entries(drafts.reports || {}).forEach(([id,value]) => {const r=cleanReport(value,now);if(r)candidate.reports[id]=r;});
    Object.entries(drafts.matches || {}).forEach(([id,value]) => {const m=cleanMatch(value,now);if(m)candidate.matches[id]=m;});
    const merged=parsePublic(candidate,games,now) || emptyPublic();
    return {...merged,publicationState:'draft',exportedAt:new Date(now).toISOString()};
  }
  function weatherHours(data) {
    const h=data?.hourly, units=data?.hourly_units;
    if (!Array.isArray(h?.time)) return [];
    const n=(key,i,min,max,unit) => { const v=h[key]?.[i]; return units?.[key] === unit && typeof v === 'number' && Number.isFinite(v) && v>=min && v<=max ? v : null; };
    return h.time.flatMap((t,i) => typeof t === 'number' && Number.isFinite(t) && t>0 ? [{
      at:t*1000,prob:n('precipitation_probability',i,0,100,'%'),temperature:n('temperature_2m',i,-100,70,'°C'),
      wind:n('wind_speed_10m',i,0,500,'km/h'),gust:n('wind_gusts_10m',i,0,500,'km/h'),code:n('weather_code',i,0,99,'wmo code')
    }] : []).sort((a,b) => a.at-b.at);
  }
  function weatherAt(data, kickoff) {
    const at=parseInstant(kickoff); if(at === null)return null;
    const hour=Math.floor(at/3600000)*3600000;
    return weatherHours(data).find(h => h.at === hour) || null;
  }
  function weatherRisk(weather) {
    if (!weather) return null;
    if ((weather.code !== null && weather.code >= 95) || (weather.gust !== null && weather.gust >= 60)) return 'Pronóstico de condiciones adversas: consulta a la liga. No indica suspensión.';
    if (weather.prob !== null && weather.prob >= 60) return 'Posible lluvia: conviene revisar el terreno. La liga decide si se juega.';
    return null;
  }
  function cacheState(entry, key, now = Date.now()) {
    if (!record(entry) || entry.key !== key || typeof entry.fetchedAt !== 'number' || !Number.isFinite(entry.fetchedAt) || entry.fetchedAt > now || !weatherHours(entry.data).length) return 'missing';
    const age=now-entry.fetchedAt;
    return age>MAX_AGE?'expired':age>TTL?'stale':'fresh';
  }
  function forecastKey(coords) { return [coords.latitude,coords.longitude,TZ,'celsius','kmh','v38'].join(':'); }
  function forecastURL(coords) {
    const params=new URLSearchParams({latitude:String(coords.latitude),longitude:String(coords.longitude),hourly:'temperature_2m,precipitation_probability,wind_speed_10m,wind_gusts_10m,weather_code',forecast_days:'7',timezone:TZ,timeformat:'unixtime',temperature_unit:'celsius',wind_speed_unit:'kmh'});
    return 'https://api.open-meteo.com/v1/forecast?'+params;
  }
  async function fetchJSON(url, {fetchImpl=root.fetch?.bind(root),timeoutMs=10000,cache='no-cache'} = {}) {
    const abort=new AbortController(); let timer;
    try {
      const timeout=new Promise((_,reject) => { timer=setTimeout(() => { abort.abort(); const e=new Error('Tiempo de espera agotado'); e.name='TimeoutError'; reject(e); },timeoutMs); });
      return await Promise.race([(async () => { const response=await fetchImpl(url,{signal:abort.signal,cache,credentials:'omit'}); if(!response.ok)throw new Error('HTTP '+response.status); return response.json(); })(),timeout]);
    } finally { clearTimeout(timer); }
  }
  const utils={TZ,TTL,MAX_AGE,REVIEW_AGE,STATUS,MATCH,FIELDS,fieldFor,matchId,parseInstant,dayKey,localInput,localToISO,safeURL,cleanCoordinates,cleanReport,readReport,cleanMatch,emptyPublic,parsePublic,exportProposal,weatherHours,weatherAt,weatherRisk,cacheState,forecastKey,forecastURL,fetchJSON};
  if (typeof module !== 'undefined') module.exports=utils;
  if (!root.document) return;

  const doc=root.document, q=(s,r=doc) => r.querySelector(s), qa=(s,r=doc) => [...r.querySelectorAll(s)];
  const esc=value => String(value ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const format=(v,unit) => v === null || v === undefined ? 'Sin dato' : `${new Intl.NumberFormat('es-MX',{maximumFractionDigits:1}).format(v)}${unit}`;
  const time=at => new Intl.DateTimeFormat('es-MX',{timeZone:TZ,day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at));
  let publicData=emptyPublic(), publicError='', publicLoaded=false, drafts={reports:{},matches:{}}, selected=FIELDS[0].id, selectedMatch='';
  const forecastEntries=new Map(), weatherErrors=new Map(), loading=new Set(), homeHosts=new Set();
  function fixtures(all = false) {
    const bulletins=[...(root.LJR_V20?.bulletins || [])].sort((a,b) => a.order-b.order), latest=bulletins[0];
    return (all?bulletins:latest?[latest]:[]).flatMap(bulletin => (bulletin.groups || []).flatMap(group => (group.games || []).filter(g => g.home && g.away).map(g => ({...g,category:group.category,bulletinId:bulletin.id,id:matchId(group.category,g,bulletin.id)}))));
  }
  function officialFor(id) { return cleanMatch(publicData.matches[id]); }
  function todayMatches(now=Date.now()) { return fixtures().flatMap(g => {const m=officialFor(g.id);return m?.kickoff && dayKey(parseInstant(m.kickoff))===dayKey(now)?[{...g,...m}]:[];}); }
  function snapshot() { return {...copy(publicData),loaded:publicLoaded,error:publicError}; }
  function readLocal(key) { try { return JSON.parse(root.localStorage.getItem(key) || 'null'); } catch { return null; } }
  function storeLocal(key,value) { try { root.localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } }
  function emitUpdate() { doc.dispatchEvent(new CustomEvent('jr:fields-updated')); }
  function sourceMarkup(source) { const url=safeURL(source); return url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Ver fuente ↗</a>`:esc(source); }
  function badge(id) { const r=readReport(id,publicData.reports); return `<span class="jr38f-status jr38f-${r.status}">${STATUS[r.status]}</span>`; }
  function renderHomeSummary(host) {
    if (host) homeHosts.add(host);
    homeHosts.forEach(el => {
      if(!el.isConnected){homeHosts.delete(el);return;}
      const recent=FIELDS.filter(f => readReport(f.id,publicData.reports).status!=='unknown').length;
      el.innerHTML=`<div class="jr38f-home-summary"><div><p class="jr38f-eyebrow">ANTES DEL SILBATAZO</p><h2>Estado de campos</h2><p>${publicError?esc(publicError):`${recent} de ${FIELDS.length} campos con reporte reciente. La liga confirma si se juega.`}</p></div><button type="button" class="ghost-btn" data-jr38-field-open="">Consultar campos</button></div><div class="jr38f-home-fields">${FIELDS.slice(0,3).map(f => `<button type="button" data-jr38-field-open="${f.id}"><span>${esc(f.name)}</span>${badge(f.id)}</button>`).join('')}</div>`;
    });
  }
  function fieldGames() { return fixtures().filter(g => fieldFor(g.field)?.id===selected); }
  function chooseMatch() { const games=fieldGames(); if(!games.some(g => g.id===selectedMatch))selectedMatch=games.find(g => officialFor(g.id)?.kickoff)?.id || games[0]?.id || ''; }
  function renderField() {
    const host=q('#jr38FieldDetail'); if(!host)return;
    chooseMatch(); const f=fieldFor(selected), state=readReport(f.id,publicData.reports), r=state.report, coords=cleanCoordinates(publicData.fields[f.id]);
    q('#jr38Field').value=f.id;
    host.innerHTML=`<div class="jr38f-title"><h3>${esc(f.name)}</h3>${badge(f.id)}</div>${state.stale?`<p class="jr38f-warning">Reporte desactualizado. Último estado: ${STATUS[r.status]}. Hace falta una nueva revisión; no confirma las condiciones actuales.</p>`:''}<p>${r?`Responsable: ${esc(r.responsible)} · ${time(r.reviewedAt)} (Guanajuato).`:'Sin reporte público del terreno. Consulta al responsable del campo.'}</p>${r?`<p>Fuente: ${sourceMarkup(r.source)}</p>${r.note?`<p>${esc(r.note)}</p>`:''}${r.evidence?`<a href="${esc(r.evidence)}" target="_blank" rel="noopener noreferrer">Ver evidencia del reporte ↗</a>`:''}`:''}<p class="jr38f-muted">La revisión del terreno y la decisión oficial del partido son registros distintos. Un reporte de más de 12 horas se marca como desactualizado.</p><p>${coords?`Ubicación verificada por ${esc(coords.responsible)} · ${time(coords.verifiedAt)}. ${sourceMarkup(coords.source)}`:'Coordenadas del campo pendientes de verificación. No se atribuye el clima de otra sede a este terreno.'}</p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name+' Juventino Rosas Guanajuato')}" target="_blank" rel="noopener noreferrer">Buscar el campo por nombre ↗</a>`;
    qa('[data-jr38-field-card]').forEach(b => { b.classList.toggle('selected',b.dataset.jr38FieldCard===f.id);b.setAttribute('aria-pressed',String(b.dataset.jr38FieldCard===f.id));b.innerHTML=`<b>${esc(fieldFor(b.dataset.jr38FieldCard).name)}</b>${badge(b.dataset.jr38FieldCard)}`; });
    const games=fieldGames(), selector=q('#jr38WeatherMatch');
    selector.innerHTML=games.length?games.map(g => `<option value="${esc(g.id)}">${esc(g.category)} · ${esc(g.home)} vs ${esc(g.away)}</option>`).join(''):'<option value="">Sin partido en el boletín más reciente</option>';
    selector.value=selectedMatch; selector.disabled=!games.length;
    q('#jr38FieldMatches').innerHTML='<h3>Decisión oficial del partido</h3><p class="jr38f-muted">Partidos del boletín más reciente recibido; su presencia aquí no confirma que sean de hoy.</p>'+(games.length?games.map(g => {
      const m=officialFor(g.id);
      return `<article class="jr38f-game"><h4>${esc(g.home)} vs ${esc(g.away)}</h4><p>${esc(g.category)} · <strong>${m?MATCH[m.status]:'Sin confirmación oficial de estado'}</strong></p><p>${m?.kickoff?`${time(m.kickoff)} · Guanajuato`:'Fecha y hora completas por confirmar'}${!m?.kickoff && g.time?` · El boletín indica ${esc(g.time)} sin fecha completa.`:''}</p>${m?`<p>Fuente: ${sourceMarkup(m.source)} · ${esc(m.responsible)} · ${time(m.updatedAt)}.</p>${m.note?`<p>${esc(m.note)}</p>`:''}`:''}${m?.kickoff&&['scheduled','rescheduled'].includes(m.status)?`<button class="ghost-btn" type="button" data-jr38-field-calendar="${esc(g.id)}">Agregar al calendario</button>`:''}</article>`;
    }).join(''):'<p>No hay partidos de este campo en el boletín más reciente.</p>');
    renderWeather();
  }
  function renderWeather() {
    const host=q('#jr38WeatherDetail'), button=q('#jr38WeatherRefresh'); if(!host || !button)return;
    const coords=cleanCoordinates(publicData.fields[selected]), m=officialFor(selectedMatch), key=coords?forecastKey(coords):null;
    if(key && !forecastEntries.has(key)){const saved=readLocal(CACHE_KEY+key);if(saved)forecastEntries.set(key,saved);}
    const entry=key?forecastEntries.get(key):null, state=key?cacheState(entry,key):'missing', busy=key&&loading.has(key), error=key?weatherErrors.get(key):null;
    button.disabled=!!busy || !coords || !m?.kickoff;
    const missing=[];
    if(!coords)missing.push('Faltan coordenadas verificadas de este campo.');
    if(!m?.kickoff)missing.push('Falta fecha y hora confirmadas por una fuente oficial para el partido.');
    if(missing.length) { host.innerHTML=`<p class="jr38f-empty">${missing.join(' ')} El pronóstico por partido estará disponible cuando estén registrados esos datos.</p>`; return; }
    const usable=['fresh','stale'].includes(state), hourly=usable?weatherAt(entry.data,m.kickoff):null;
    let message=busy?'Consultando Open-Meteo…':error || (usable?'':'Pronóstico aún no consultado.');
    if(state==='expired')message+=' La caché superó 6 horas y sus valores se descartaron.';
    if(state==='stale')message+=' Caché desactualizada: lectura guardada de hace más de 30 minutos; actualiza antes de usarla.';
    if(usable && !hourly)message+=' No hay cobertura de pronóstico para la hora confirmada de este partido.';
    host.innerHTML=`<p>Inicio confirmado: <strong>${time(m.kickoff)}</strong> · Guanajuato.</p><p role="status" class="${state==='stale'?'jr38f-warning':'jr38f-muted'}">${esc(message)}</p>${entry && state!=='missing'?`<p>Última consulta: ${time(entry.fetchedAt)}. La hora de emisión del modelo no está disponible en esta respuesta.</p>`:''}<div class="jr38f-metrics"><div><b>${format(hourly?.prob,'%')}</b><span>Probabilidad de lluvia</span></div><div><b>${format(hourly?.temperature,' °C')}</b><span>Temperatura a 2 m</span></div><div><b>${format(hourly?.wind,' km/h')}</b><span>Viento a 10 m</span></div></div>${hourly?`<p>Hora del dato: ${time(hourly.at)} · resolución horaria. La probabilidad corresponde a precipitación &gt; 0.1 mm en la hora precedente.</p>${weatherRisk(hourly)?`<p class="jr38f-warning">${weatherRisk(hourly)}</p>`:''}`:''}<p class="jr38f-muted">Modelo meteorológico de cobertura regional consultado en las coordenadas verificadas del campo (${coords.latitude}, ${coords.longitude}); no mide lodo, charcos ni drenaje. La lluvia nunca suspende automáticamente un partido.</p>`;
  }
  async function loadWeather(force=false) {
    const coords=cleanCoordinates(publicData.fields[selected]), m=officialFor(selectedMatch); if(!coords || !m?.kickoff)return;
    const key=forecastKey(coords); if(loading.has(key))return;
    const cached=forecastEntries.get(key) || readLocal(CACHE_KEY+key);
    if(cached)forecastEntries.set(key,cached);
    if(!force && cacheState(cached,key)==='fresh'){renderWeather();return;}
    loading.add(key);weatherErrors.delete(key);renderWeather();
    try {
      const data=await fetchJSON(forecastURL(coords));
      if(!weatherHours(data).length)throw new Error('Respuesta sin horas meteorológicas válidas');
      const entry={key,fetchedAt:Date.now(),data}; forecastEntries.set(key,entry);storeLocal(CACHE_KEY+key,entry);
    } catch(e) { weatherErrors.set(key,e.name==='TimeoutError' || e.name==='AbortError'?'Se agotó el tiempo de espera del pronóstico. Puedes reintentar.':'No se pudo consultar el pronóstico. Puedes reintentar.'); }
    finally {loading.delete(key);renderWeather();}
  }
  async function loadReports() {
    q('#jr38PublicRefresh')?.setAttribute('disabled','');
    try { const data=await fetchJSON('./data/field-status-v38.json'); const parsed=parsePublic(data,fixtures(true));if(!parsed)throw new Error('Archivo público no válido');publicData=parsed;publicError='';publicLoaded=true; }
    catch { publicData=emptyPublic();publicError='No se pudieron cargar los reportes públicos. Consulta a la liga.';publicLoaded=false; }
    q('#jr38PublicRefresh')?.removeAttribute('disabled');
    const message=q('#jr38PublicMessage');if(message)message.textContent=publicError || 'Reportes públicos del repositorio. Los borradores de JR Control no aparecen aquí.';
    renderField();renderHomeSummary();renderRows();emitUpdate();
  }
  function navigate(id) { if(fieldFor(id))selected=fieldFor(id).id;renderField();root.showView?.('fields'); }
  function renderRows() {
    qa('[data-jr38-current="true"][data-jr38-field]').forEach(row => {
      const f=fieldFor(row.dataset.jr38Field); if(!f)return;
      let button=q('.jr38f-row-button',row);if(!button){button=doc.createElement('button');button.type='button';button.className='jr38f-row-button';row.appendChild(button);}
      button.dataset.jr38FieldOpen=f.id;
      const m=officialFor(row.dataset.jr38Match);
      button.innerHTML=`Terreno actual: ${badge(f.id)}${m?` · ${MATCH[m.status]}`:''} · Consultar`;
    });
  }
  function download(name,value) { const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download=name;a.click();setTimeout(() => URL.revokeObjectURL(url),1000); }
  function mountEditor() {
    const admin=q('#view-admin');if(!admin || q('#jr38FieldEditor'))return;
    const saved=readLocal(DRAFT_KEY);if(record(saved)){drafts={reports:record(saved.reports)?saved.reports:{},matches:record(saved.matches)?saved.matches:{}};}
    const section=doc.createElement('section');section.id='jr38FieldEditor';section.className='jr38f-panel jr38f-editor';
    section.innerHTML=`<p class="jr38f-eyebrow">JR CONTROL · ESTE DISPOSITIVO</p><h2>Reportes de campos y partidos</h2><p>Prepara un borrador local y descarga una propuesta para revisión. Guardar aquí no publica reportes para otros visitantes.</p><form id="jr38ReportForm"><h3>Reporte del terreno</h3><div class="jr38f-form-grid"><label>Campo<select name="field">${FIELDS.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select></label><label>Estado<select name="status">${Object.entries(STATUS).map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}</select></label><label>Responsable<input name="responsible" required maxlength="120" autocomplete="name"></label><label>Fecha y hora de revisión · Guanajuato<input name="reviewedAt" type="datetime-local" required></label></div><label>Fuente o acta de revisión<input name="source" required maxlength="300" placeholder="Identificación del reporte o enlace a su fuente"></label><label>Notas<textarea name="note" maxlength="500" rows="3"></textarea></label><label>Evidencia (enlace opcional)<input name="evidence" type="url" placeholder="https://…"></label><button type="submit" class="primary-btn">Guardar borrador local del terreno</button><p id="jr38ReportMessage" role="status"></p></form><form id="jr38MatchForm"><h3>Decisión oficial del partido · borrador</h3><label>Partido<select name="match">${fixtures().map(g => `<option value="${esc(g.id)}">${esc(g.category)} · ${esc(g.home)} vs ${esc(g.away)}</option>`).join('')}</select></label><div class="jr38f-form-grid"><label>Estado<select name="status">${Object.entries(MATCH).map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}</select></label><label>Responsable de la decisión<input name="responsible" required maxlength="120"></label></div><label>Fuente oficial o acta<input name="source" required maxlength="300"></label><label>Inicio confirmado · fecha y hora de Guanajuato (opcional)<input name="kickoff" type="datetime-local"></label><label class="jr38f-check"><input name="confirmed" type="checkbox">La fuente confirma expresamente la fecha y la hora indicadas</label><label>Motivo o aviso<textarea name="note" maxlength="500" rows="2"></textarea></label><button type="submit" class="primary-btn">Guardar borrador local del partido</button><p id="jr38MatchMessage" role="status"></p></form><button class="ghost-btn" type="button" id="jr38ExportReports">Descargar propuesta para revisión</button><p id="jr38ExportMessage" role="status"></p><details><summary>Revisar y compartir con la liga</summary><p>La descarga conserva <code>publicationState: draft</code>. Una persona con permisos del repositorio debe verificar responsable, fuente, fecha y evidencia, cambiar el estado a <code>published</code> en una rama de revisión y proponer el archivo <code>data/field-status-v38.json</code>. Los visitantes lo verán únicamente tras la publicación autorizada del sitio.</p><p>No hay un servicio autenticado de escritura conectado a esta pantalla.</p></details>`;
    admin.prepend(section);
    const form=q('#jr38ReportForm'),msg=q('#jr38ReportMessage'),matchForm=q('#jr38MatchForm'),matchMsg=q('#jr38MatchMessage');
    function showReportDraft() {
      const d=cleanReport(drafts.reports[form.elements.field.value]);
      form.elements.status.value=d?.status || 'review';form.elements.responsible.value=d?.responsible || '';form.elements.source.value=d?.source || '';form.elements.note.value=d?.note || '';form.elements.evidence.value=d?.evidence || '';form.elements.reviewedAt.value=d?localInput(parseInstant(d.reviewedAt)):'';
      msg.textContent=d?'Borrador local recuperado. No está publicado.':'Sin borrador local para este campo.';
    }
    form.elements.field.onchange=showReportDraft;
    form.onsubmit=e => {
      e.preventDefault();const elements=form.elements;
      const value=cleanReport({status:elements.status.value,responsible:elements.responsible.value,source:elements.source.value,note:elements.note.value,evidence:elements.evidence.value,reviewedAt:localToISO(elements.reviewedAt.value)});
      if(!value || (elements.evidence.value && !value.evidence)){msg.textContent='Revisa la fecha (no futura), responsable, fuente y enlace de evidencia.';return;}
      drafts.reports[elements.field.value]=value;const ok=storeLocal(DRAFT_KEY,drafts);msg.textContent=ok?'Borrador guardado en este dispositivo. El reporte público no cambió.':'No se pudo guardar en el dispositivo. Descarga la propuesta para conservarlo.';
    };
    function showMatchDraft() {const d=cleanMatch(drafts.matches[matchForm.elements.match.value]),f=matchForm.elements;f.status.value=d?.status || 'review';f.responsible.value=d?.responsible || '';f.source.value=d?.source || '';f.note.value=d?.note || '';f.kickoff.value=d?.kickoff?localInput(parseInstant(d.kickoff)):'';f.confirmed.checked=!!d?.kickoff;matchMsg.textContent=d?'Borrador local recuperado. No está publicado.':'Sin borrador local para este partido.';}
    matchForm.elements.match.onchange=showMatchDraft;
    matchForm.onsubmit=e => {e.preventDefault();const f=matchForm.elements, kickoff=f.kickoff.value?localToISO(f.kickoff.value):null;if(f.kickoff.value && (!kickoff || !f.confirmed.checked)){matchMsg.textContent='Verifica la fecha completa y marca que la fuente confirma el inicio.';return;}const m=cleanMatch({status:f.status.value,responsible:f.responsible.value,source:f.source.value,note:f.note.value,kickoff,kickoffConfirmed:f.confirmed.checked,updatedAt:new Date().toISOString()});if(!m){matchMsg.textContent='Falta una fuente oficial, responsable o fecha válida.';return;}drafts.matches[f.match.value]=m;const ok=storeLocal(DRAFT_KEY,drafts);matchMsg.textContent=ok?'Borrador guardado en este dispositivo. La decisión pública no cambió.':'No se pudo guardar en el dispositivo. Descarga la propuesta para conservarlo.';};
    q('#jr38ExportReports').onclick=() => {const m=q('#jr38ExportMessage');if(!publicLoaded){m.textContent='Primero carga los reportes públicos desde Clima y campos para evitar sobrescribir información que no se pudo consultar.';return;}download('field-status-v38-propuesta.json',exportProposal(publicData,drafts,fixtures(true)));m.textContent='Propuesta descargada con estado de borrador. Hace falta revisión y publicación autorizada del repositorio.';};
    showReportDraft();showMatchDraft();
  }
  function mount() {
    if(q('#view-fields'))return;
    const home=q('#view-home');if(!home)return;
    const view=doc.createElement('section');view.id='view-fields';view.className='view jr38-fields';view.setAttribute('aria-label','Clima y campos');
    view.innerHTML=`<header class="jr38f-heading"><div><p class="jr38f-eyebrow">ANTES DEL SILBATAZO</p><h1>Clima y campos</h1><p>Pronóstico, terreno y decisión de la liga: consulta cada fuente.</p></div><button class="ghost-btn" type="button" id="jr38PublicRefresh">Actualizar reportes públicos</button></header><p id="jr38PublicMessage" role="status">Cargando reportes públicos…</p><div class="jr38f-layout"><section class="jr38f-panel"><h2>Reporte del terreno</h2><label for="jr38Field">Elige un campo</label><select id="jr38Field">${FIELDS.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select><div id="jr38FieldDetail" aria-live="polite"></div></section><section class="jr38f-panel"><h2>Pronóstico meteorológico</h2><label for="jr38WeatherMatch">Partido en este campo</label><select id="jr38WeatherMatch"></select><div id="jr38WeatherDetail" aria-live="polite"></div><button type="button" class="ghost-btn" id="jr38WeatherRefresh">Consultar / actualizar pronóstico</button><p class="jr38f-muted">Fuente: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Hora de Guanajuato: America/Mexico_City.</p></section></div><div class="jr38f-field-grid">${FIELDS.map(f => `<button type="button" data-jr38-field-card="${f.id}"></button>`).join('')}</div><section class="jr38f-panel" id="jr38FieldMatches"></section>`;
    home.insertAdjacentElement('afterend',view);
    q('#jr38Field').onchange=e => {selected=e.target.value;renderField();};q('#jr38WeatherMatch').onchange=e => {selectedMatch=e.target.value;renderWeather();};q('#jr38WeatherRefresh').onclick=() => loadWeather();q('#jr38PublicRefresh').onclick=loadReports;
    doc.addEventListener('click',e => {
      const open=e.target.closest('[data-jr38-field-open]');if(open){navigate(open.dataset.jr38FieldOpen);return;}
      const card=e.target.closest('[data-jr38-field-card]');if(card){selected=card.dataset.jr38FieldCard;renderField();q('#jr38Field').focus();return;}
      const calendar=e.target.closest('[data-jr38-field-calendar]');if(calendar){const g=fixtures().find(g => g.id===calendar.dataset.jr38FieldCalendar),m=g&&officialFor(g.id);if(m?.kickoff){const api=root.JRCalendarV38 || root.JRCalendarV37;if(api?.download)api.download([{...g,...m}]);}}
    });
    ['#view-matchcenter','#view-matches','#view-more'].forEach(selector => {const host=q(selector);if(host){const b=doc.createElement('button');b.type='button';b.className='ghost-btn jr38f-entry';b.dataset.jr38FieldOpen='';b.textContent='Clima y estado de campos';host.prepend(b);}});
    doc.addEventListener('jr:calendar-rendered',renderRows);
    mountEditor();renderField();renderRows();loadReports();
    setInterval(() => {if(!doc.hidden){renderField();renderHomeSummary();renderRows();}},60000);
    if(root.location.hash==='#fields')navigate();
  }
  root.JRFieldsV38={...utils,fixtures,officialFor,todayMatches,snapshot,navigate,renderHomeSummary,renderRows,loadReports};
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(typeof window !== 'undefined' ? window : globalThis);
