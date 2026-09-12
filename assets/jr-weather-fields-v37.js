/* Liga JR V37. Regional forecast and separately verified field reports.
 * Dates from the provider are Unix seconds; all display uses Mexico City time.
 * Drafts never become public reports simply by being saved in this browser. */
(function(root){
  'use strict';
  const TZ='America/Mexico_City', KEY='jr37-field-drafts', CACHE='jr37-regional-weather';
  const TTL=30*60*1000, MAX_AGE=6*60*60*1000, REVIEW_AGE=12*60*60*1000;
  const STATUS={unknown:'Sin revisión',fit:'Apto',review:'En revisión',heavy:'Pesado / encharcado',unfit:'No apto',closed:'Cerrado'};
  const MATCH={scheduled:'Programado',pending:'Por confirmar',delayed:'Retrasado',suspended:'Suspendido'};
  const FIELDS=[
    ['sur-1','Campo 1 · Unidad Deportiva Sur',['1','Campo 1']],
    ['sur-2','Campo 2 · Unidad Deportiva Sur',['2','Campo 2']],
    ['sur-3','Campo 3 · Unidad Deportiva Sur',['3','Campo 3']],
    ['zapata-4','Campo 4 · Emiliano Zapata',['4','Campo 4']],
    ['cerrito','Cerrito de Gasca',['C. de Gasca']],['tavera','Tavera',[]],
    ['san-juan','San Juan de la Cruz',['San Juan','S. Juan de la Cruz']],
    ['cuenda','Santiago de Cuenda',['Cuenda']],['romerillo','San Antonio de Romerillo',['Romerillo']],
    ['fraccionamiento','Fraccionamiento',[]],['pozos','Pozos',[]],['rincon','Rincón de Centeno',[]],
    ['san-jose','San José',[]],['san-julian','San Julián',[]]
  ].map(([id,name,aliases])=>({id,name,aliases}));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function fieldFor(s){return FIELDS.find(f=>[f.id,f.name,...f.aliases].some(a=>norm(a)===norm(s)));}
  const matchId=(category,g)=>[category,g.home,g.away].map(norm).map(x=>x.replace(/[^a-z0-9]+/g,'-')).join('__');
  function cleanMatch(m){
    if(!m||!Object.prototype.hasOwnProperty.call(MATCH,m.status))return null;
    const updated=Date.parse(m.updatedAt),kickoff=m.kickoff?Date.parse(m.kickoff):null;
    if(!Number.isFinite(updated)||updated>Date.now()+60000||m.kickoff&&!Number.isFinite(kickoff))return null;
    return {status:m.status,updatedAt:new Date(updated).toISOString(),kickoff:kickoff===null?null:new Date(kickoff).toISOString(),note:String(m.note||'').slice(0,300)};
  }
  function cleanReport(r,now=Date.now()){
    if(!r||!Object.prototype.hasOwnProperty.call(STATUS,r.status)||r.status==='unknown')return null;
    const at=Date.parse(r.reviewedAt);
    if(!Number.isFinite(at)||at>now+60000)return null;
    return {status:r.status,reviewedAt:new Date(at).toISOString(),note:String(r.note||'').slice(0,300)};
  }
  function readReport(id,reports,now=Date.now()){
    const report=cleanReport(reports[id],now);
    if(!report)return {status:'unknown',stale:false,report:null};
    const stale=now-Date.parse(report.reviewedAt)>REVIEW_AGE;
    return {status:stale?'unknown':report.status,stale,report};
  }
  function weatherHours(data,from,to){
    const h=data?.hourly;
    if(!Array.isArray(h?.time))return [];
    const number=(key,i,min,max)=>{const v=h[key]?.[i];return typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:null;};
    return h.time.flatMap((t,i)=>typeof t==='number'&&t*1000>=from&&t*1000<to?[{
      at:t*1000,prob:number('precipitation_probability',i,0,100),mm:number('precipitation',i,0,1000),
      wind:number('wind_speed_10m',i,0,500),gust:number('wind_gusts_10m',i,0,500),code:number('weather_code',i,0,99)
    }]:[]);
  }
  function summarize(hours){
    const max=k=>{const vals=hours.map(h=>h[k]).filter(v=>v!==null);return vals.length?Math.max(...vals):null;};
    return {prob:max('prob'),mm:hours.length&&hours.every(h=>h.mm!==null)?hours.reduce((a,h)=>a+h.mm,0):null,wind:max('wind'),gust:max('gust'),storm:hours.some(h=>h.code!==null&&h.code>=95),hours:hours.length};
  }
  function risk(status,w){
    if(status==='closed'||status==='unfit')return {level:'red',text:'Campo no disponible · consulta a la liga'};
    if(status==='heavy')return {level:'orange',text:'Terreno pesado · revisión necesaria'};
    if(w?.storm||(w?.gust!==null&&w?.gust>=60))return {level:'orange',text:'Pronóstico adverso · consulta a la liga'};
    if(status==='review'||status==='unknown')return {level:'yellow',text:'Falta confirmar el terreno'};
    if(w?.prob!==null&&w?.prob>=60)return {level:'yellow',text:'Posible lluvia · seguimiento del campo'};
    return {level:'green',text:'Campo apto según la última revisión'};
  }
  const utils={FIELDS,STATUS,MATCH,fieldFor,matchId,cleanMatch,cleanReport,readReport,weatherHours,summarize,risk};
  if(typeof module!=='undefined')module.exports=utils;
  if(!root.document)return;
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time=(at,extra={})=>new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',...extra}).format(new Date(at));
  const date=at=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
  let publicData={reports:{},matches:{}}, drafts={},matchDrafts={}, weather=null, weatherError='',selected='sur-1',requestId=0,busy=false;
  function fixtures(){const groups=root.LJR_V20?.bulletins?.find(b=>b.id==='actual-final-j6-j5')?.groups||[];return groups.flatMap(group=>group.games.filter(g=>g.home&&g.away).map(g=>({...g,category:group.category,id:matchId(group.category,g)})));}
  function readLocal(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
  function storeLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
  function currentWeather(){return weather&&Date.now()-weather.fetchedAt<=MAX_AGE?weather:null;}
  function forecastFor(from,to){const w=currentWeather();return w?summarize(weatherHours(w.data,from,to)):null;}
  function todayHours(){const w=currentWeather();return w?weatherHours(w.data,Date.now()-3600000,Date.now()+7*86400000).filter(h=>date(h.at)===q('#jr37Day')?.value):[];}
  function format(v,suffix,d=0){return v===null||v===undefined?'Sin dato':`${v.toFixed(d)}${suffix}`;}
  function fieldBadge(id){const r=readReport(id,publicData.reports);return `<span class="jr37-status jr37-${r.status}">${esc(STATUS[r.status])}</span>`;}
  function navigateFields(id){selected=id||selected;renderField();root.showView?.('fields');}
  function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function loadWeather(force=false){
    if(busy)return;
    const cached=readLocal(CACHE);
    if(!force&&cached&&Date.now()-cached.fetchedAt<TTL&&cached.fetchedAt<=Date.now()){weather=cached;renderWeather();return;}
    busy=true;weatherError='';renderWeather();const rid=++requestId,abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),10000);
    const params=new URLSearchParams({latitude:'20.64337',longitude:'-100.99286',hourly:'precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',forecast_days:'7',timezone:TZ,timeformat:'unixtime'});
    try{
      const res=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:abort.signal});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!Array.isArray(data?.hourly?.time)||!data.hourly.time.length)throw new Error('Sin horas');
      if(rid===requestId){weather={data,fetchedAt:Date.now()};storeLocal(CACHE,weather);}
    }catch(e){
      if(rid===requestId){weatherError='No se pudo actualizar el pronóstico.';if(cached&&Date.now()-cached.fetchedAt<MAX_AGE&&cached.fetchedAt<=Date.now())weather=cached;}
    }finally{clearTimeout(timeout);busy=false;renderWeather();}
  }
  async function loadReports(){
    try{const r=await fetch('./data/field-status-v37.json',{cache:'no-cache'});if(!r.ok)throw new Error();const d=await r.json();if(d.schemaVersion!==1)throw new Error();publicData={reports:d.reports||{},matches:d.matches||{}};}
    catch{publicData={reports:{},matches:{}};const e=q('#jr37PublicMessage');if(e)e.textContent='Los reportes públicos no están disponibles. Consulta a la liga.';}
    renderField();renderRows();renderSummary();
  }
  function renderSummary(){
    const count=FIELDS.filter(f=>readReport(f.id,publicData.reports).status!=='unknown').length;
    qa('[data-jr37-summary]').forEach(el=>el.textContent=`${count} de ${FIELDS.length} campos con revisión reciente`);
  }
  function renderRows(){
    qa('[data-jr37-current="true"][data-jr37-field]').forEach(row=>{
      const f=fieldFor(row.dataset.jr37Field);if(!f)return;
      let btn=q('.jr37-row-field',row);if(!btn){btn=document.createElement('button');btn.type='button';btn.className='jr37-row-field';row.appendChild(btn);btn.onclick=()=>navigateFields(f.id);}
      const m=cleanMatch(publicData.matches[row.dataset.jr37Match]);
      btn.innerHTML=`${m?esc(MATCH[m.status])+' · ':''}Estado actual del campo: ${fieldBadge(f.id)} <span>Consultar</span>`;
    });
  }
  function renderWeather(){
    const source=q('#jr37WeatherSource'),hours=q('#jr37Hours');if(!source||!hours)return;
    const w=currentWeather(),rows=todayHours()||[],s=summarize(rows);
    source.textContent=busy?'Consultando el pronóstico regional…':w?`${weatherError?weatherError+' Última lectura guardada: ':'Actualizado: '}${time(w.fetchedAt,{day:'numeric',month:'short'})}. Referencia regional; no mide el terreno.`:weatherError||'Pronóstico aún no disponible.';
    q('#jr37Refresh').disabled=busy;
    q('#jr37Rain').textContent=format(s.prob,'%');q('#jr37Mm').textContent=format(s.mm,' mm',1);q('#jr37Wind').textContent=format(s.gust,' km/h');
    hours.innerHTML=rows.length?rows.map(h=>`<tr><th scope="row">${time(h.at)}</th><td>${format(h.prob,'%')}</td><td>${format(h.mm,' mm',1)}</td><td>${format(h.wind,' km/h')}</td><td>${h.code!==null&&h.code>=95?'Tormenta prevista':'—'}</td></tr>`).join(''):'<tr><td colspan="5">No hay pronóstico disponible para estas horas.</td></tr>';
    renderField();
  }
  function renderField(){
    const detail=q('#jr37FieldDetail');if(!detail)return;
    q('#jr37Field').value=selected;const f=FIELDS.find(x=>x.id===selected),r=readReport(f.id,publicData.reports),w=forecastFor(Date.now(),Date.now()+6*3600000),alert=risk(r.status,w);
    detail.innerHTML=`<div class="jr37-field-heading"><h3>${esc(f.name)}</h3>${fieldBadge(f.id)}</div><p class="jr37-risk jr37-${alert.level}">${alert.text}</p><p>${r.report?`${r.stale?'Revisión vencida. Último reporte: '+esc(STATUS[r.report.status])+'. ':''}Revisado ${time(r.report.reviewedAt,{day:'numeric',month:'short'})}. ${esc(r.report.note)}`:'Todavía no hay una revisión publicada para este campo.'}</p><p class="jr37-subtle">${r.stale?'Un reporte con más de 12 horas necesita confirmarse. ':''}La liga confirma si se juega. Un pronóstico de lluvia no suspende partidos.</p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name+' Juventino Rosas Guanajuato')}" target="_blank" rel="noopener">Buscar ubicación del campo ↗</a>`;
    qa('[data-jr37-field-card]').forEach(b=>{b.classList.toggle('selected',b.dataset.jr37FieldCard===selected);b.innerHTML=`<b>${esc(FIELDS.find(f=>f.id===b.dataset.jr37FieldCard).name)}</b>${fieldBadge(b.dataset.jr37FieldCard)}`;});
    qa('[data-jr37-open]').forEach(b=>{if(b.dataset.jr37Open==='sur-1')b.innerHTML=`Campo 1: ${fieldBadge('sur-1')} · Clima y campos`;});
    const games=fixtures().filter(g=>fieldFor(g.field)?.id===f.id);
    if(games.length){const list=document.createElement('div');list.className='jr37-field-matches';list.innerHTML='<h4>Programación registrada en este campo</h4>'+games.map(g=>{
      const m=cleanMatch(publicData.matches[g.id]);const w=m?.kickoff?forecastFor(Date.parse(m.kickoff),Date.parse(m.kickoff)+2*3600000):null;
      return `<article><b>${esc(g.home)} vs ${esc(g.away)}</b><p>${esc(g.category)} · ${m?esc(MATCH[m.status]):'Estado del partido sin confirmar'}</p><p>${m?.kickoff?time(m.kickoff,{day:'numeric',month:'short'}):'Fecha y hora completas por confirmar'}${w?.hours===2?` · Lluvia prevista: ${format(w.prob,'%')} · ${format(w.mm,' mm',1)}`:''}</p>${m?.note?'<p>'+esc(m.note)+'</p>':''}${m?.kickoff&&['scheduled','delayed'].includes(m.status)?'<button type="button" class="ghost-btn jr37-calendar-download" data-jr37-calendar="'+esc(g.id)+'">Agregar al calendario</button>':''}</article>`;
    }).join('');detail.appendChild(list);list.querySelectorAll('[data-jr37-calendar]').forEach(button=>button.onclick=()=>{const g=games.find(g=>g.id===button.dataset.jr37Calendar),m=cleanMatch(publicData.matches[g.id]);if(m)root.JRCalendarV37.download([{...g,...m}]);});}
  }
  function mount(){
    if(q('#view-fields'))return;
    const view=document.createElement('section');view.className='view jr37-fields';view.id='view-fields';view.setAttribute('aria-label','Clima y estado de campos');
    view.innerHTML=`<header class="jr37-heading"><div><p>ANTES DEL SILBATAZO</p><h2>Clima y campos</h2><span data-jr37-summary></span></div><button type="button" class="ghost-btn" id="jr37Refresh">Actualizar pronóstico</button></header>
      <div class="jr37-layout"><section class="jr37-panel"><h3>Revisión del terreno</h3><label for="jr37Field">Campo</label><select id="jr37Field">${FIELDS.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}</select><p id="jr37PublicMessage" class="jr37-subtle"></p><div id="jr37FieldDetail" aria-live="polite"></div></section>
      <section class="jr37-panel"><h3>Pronóstico regional</h3><p>Santa Cruz de Juventino Rosas · Hora de Guanajuato</p><label for="jr37Day">Día a consultar</label><select id="jr37Day">${Array.from({length:7},(_,i)=>{const d=Date.now()+i*86400000;return `<option value="${date(d)}">${new Intl.DateTimeFormat('es-MX',{timeZone:TZ,weekday:'long',day:'numeric',month:'short'}).format(new Date(d))}</option>`;}).join('')}</select><div class="jr37-metrics"><div><b id="jr37Rain">Sin dato</b><span>Máxima probabilidad de lluvia</span></div><div><b id="jr37Mm">Sin dato</b><span>Lluvia acumulada en las horas mostradas</span></div><div><b id="jr37Wind">Sin dato</b><span>Ráfaga máxima prevista</span></div></div><p id="jr37WeatherSource" role="status"></p><details><summary>Ver pronóstico por hora</summary><div class="jr37-table-scroll"><table><thead><tr><th>Hora</th><th>Lluvia</th><th>Cantidad</th><th>Viento</th><th>Tormenta</th></tr></thead><tbody id="jr37Hours"></tbody></table></div></details><p class="jr37-subtle">Datos meteorológicos: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. La referencia es regional; falta verificar la ubicación exacta de cada terreno.</p></section></div><div class="jr37-field-grid">${FIELDS.map(f=>`<button type="button" data-jr37-field-card="${f.id}"></button>`).join('')}</div>`;
    q('#view-home').insertAdjacentElement('afterend',view);
    q('#jr37Field').onchange=e=>{selected=e.target.value;renderField();};q('#jr37Day').onchange=renderWeather;q('#jr37Refresh').onclick=()=>loadWeather(true);
    qa('[data-jr37-field-card]').forEach(b=>b.onclick=()=>{selected=b.dataset.jr37FieldCard;renderField();q('#jr37Field').focus();});
    const strip=document.createElement('aside');strip.className='jr37-field-strip';strip.innerHTML='<div><b>¿Se juega? Revisa el campo.</b><span data-jr37-summary></span></div><button type="button" class="ghost-btn" data-jr37-open="sur-1">Clima y campos</button>';q('#view-home').prepend(strip);
    ['#view-matchcenter','#view-matches'].forEach(selector=>{const host=q(selector);if(host){const button=document.createElement('button');button.type='button';button.className='jr37-match-link';button.dataset.jr37Open='';button.textContent='Consultar clima y estado de campos';host.prepend(button);}});
    const more=q('#view-more');if(more){const button=document.createElement('button');button.type='button';button.className='ghost-btn';button.dataset.jr37Open='';button.textContent='Clima y estado de campos';more.prepend(button);}
    document.addEventListener('click',e=>{const b=e.target.closest('[data-jr37-open]');if(b)navigateFields(b.dataset.jr37Open);});
    document.addEventListener('jr:calendar-rendered',renderRows);
    mountEditor();renderSummary();renderField();renderRows();loadReports();loadWeather();
    // One minute refresh expires field confirmations, without new API calls.
    setInterval(()=>{if(!document.hidden){renderWeather();renderSummary();renderRows();}},60000);
    if(location.hash==='#fields')root.showView?.('fields');
  }
  function mountEditor(){
    const admin=q('#view-admin');if(!admin)return;
    const saved=readLocal(KEY);drafts=saved?.reports&&typeof saved.reports==='object'?saved.reports:{};matchDrafts=saved?.matches&&typeof saved.matches==='object'?saved.matches:{};
    const section=document.createElement('section');section.className='jr37-panel jr37-editor';section.innerHTML=`<h3>Reporte de campo</h3><p>Guarda un borrador en este dispositivo. Para que lo vea toda la liga, descarga el archivo y publícalo en GitHub.</p><form id="jr37ReportForm"><div class="jr37-layout"><label>Campo<select name="field">${FIELDS.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}</select></label><label>Estado del terreno<select name="status">${Object.entries(STATUS).filter(([k])=>k!=='unknown').map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label></div><label>Observaciones<textarea name="note" maxlength="300" rows="3" placeholder="Lodo en el área norte, revisión antes del partido…"></textarea></label><div class="jr37-editor-actions"><button type="submit" class="primary-btn">Guardar borrador local</button><button type="button" class="ghost-btn" id="jr37Export">Descargar reportes para publicar</button></div><p id="jr37DraftMessage" role="status"></p></form><details><summary>Cómo publicar el reporte</summary><p>El archivo incluye las revisiones públicas y tus borradores. Sustituye <code>data/field-status-v37.json</code> en el repositorio y guarda el cambio. Revisa primero sus campos y horas; los visitantes lo verán tras actualizarse GitHub Pages.</p><a href="https://github.com/jairofrancog7-star/Liga_Futbol/edit/main/data/field-status-v37.json" target="_blank" rel="noopener">Abrir el archivo en GitHub ↗</a></details>`;admin.prepend(section);
    const form=q('#jr37ReportForm'),msg=q('#jr37DraftMessage');
    function loadDraft(){const d=cleanReport(drafts[form.elements.field.value]);if(d){form.elements.status.value=d.status;form.elements.note.value=d.note;msg.textContent='Borrador local del '+time(d.reviewedAt,{day:'numeric',month:'short'})+'. No está publicado.';}else{form.elements.status.value='review';form.elements.note.value='';msg.textContent='Sin borrador en este dispositivo.';}}
    form.elements.field.onchange=loadDraft;
    form.onsubmit=e=>{e.preventDefault();const value={status:form.elements.status.value,note:form.elements.note.value.trim(),reviewedAt:new Date().toISOString()};drafts[form.elements.field.value]=value;const ok=storeLocal(KEY,{reports:drafts,matches:matchDrafts});msg.textContent=ok?'Borrador guardado en este dispositivo. Aún no está publicado.':'No se pudo guardar en este dispositivo. Descarga el archivo para conservar el reporte.';};
    q('#jr37Export').onclick=()=>{const merged={...publicData.reports,...drafts};const reports={};FIELDS.forEach(f=>{const r=cleanReport(merged[f.id]);if(r)reports[f.id]=r;});const matches={};Object.entries({...publicData.matches,...matchDrafts}).forEach(([id,m])=>{const v=cleanMatch(m);if(v)matches[id]=v;});download('field-status-v37.json',{schemaVersion:1,reports,matches});msg.textContent='Archivo descargado. Falta publicarlo en GitHub para compartir los reportes.';};loadDraft();
    const gameEditor=document.createElement('form');gameEditor.id='jr37MatchForm';gameEditor.innerHTML=`<h3>Situación del partido</h3><label>Partido<select name="match">${fixtures().map(g=>`<option value="${g.id}">${esc(g.category)} · ${esc(g.home)} vs ${esc(g.away)}</option>`).join('')}</select></label><div class="jr37-layout"><label>Estado<select name="status">${Object.entries(MATCH).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>Fecha y hora de Guanajuato<input name="kickoff" type="datetime-local"></label></div><label>Motivo o aviso<textarea name="note" maxlength="300" rows="2"></textarea></label><button class="primary-btn" type="submit">Guardar situación como borrador</button><p role="status" id="jr37MatchMessage"></p>`;section.appendChild(gameEditor);
    function showMatchDraft(){const d=cleanMatch(matchDrafts[gameEditor.elements.match.value]);gameEditor.elements.status.value=d?.status||'pending';gameEditor.elements.note.value=d?.note||'';gameEditor.elements.kickoff.value=d?.kickoff?new Date(Date.parse(d.kickoff)-6*3600000).toISOString().slice(0,16):'';q('#jr37MatchMessage').textContent=d?'Borrador local. No está publicado.':'Sin borrador local.';}
    gameEditor.elements.match.onchange=showMatchDraft;
    gameEditor.onsubmit=e=>{e.preventDefault();const v=gameEditor.elements.kickoff.value;const record=cleanMatch({status:gameEditor.elements.status.value,kickoff:v?v+':00-06:00':null,note:gameEditor.elements.note.value.trim(),updatedAt:new Date().toISOString()});if(!record)return;matchDrafts[gameEditor.elements.match.value]=record;const ok=storeLocal(KEY,{reports:drafts,matches:matchDrafts});q('#jr37MatchMessage').textContent=ok?'Situación guardada en este dispositivo. Descarga los reportes para publicarla.':'No se pudo guardar. Descarga los reportes para conservarla.';};showMatchDraft();
  }
  root.JRFieldsV37={...utils,navigate:navigateFields};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(typeof window!=='undefined'?window:globalThis);
