'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const w = require('../assets/jr-weather-fields-v38.js');
const now = Date.parse('2026-09-12T18:00:00Z');
const timestamp = new Date(now).toISOString();
const fixture = {home:'Equipo A de prueba',away:'Equipo B de prueba',category:'Categoría de prueba',bulletinId:'boletin-prueba'};
fixture.id = w.matchId(fixture.category,fixture,fixture.bulletinId);
const report = {status:'fit',reviewedAt:timestamp,responsible:'Responsable de prueba',source:'Acta de prueba',note:'Prueba aislada',evidence:'https://example.com/evidencia'};
const match = {status:'scheduled',updatedAt:timestamp,responsible:'Liga de prueba',source:'Boletín de prueba',kickoff:'2026-09-13T10:30:00-06:00',kickoffConfirmed:true};
const coords = {latitude:0,longitude:0,verified:true,verifiedAt:timestamp,responsible:'Verificador de prueba',source:'https://example.com/coordenadas'};
const weather = {hourly_units:{temperature_2m:'°C',precipitation_probability:'%',wind_speed_10m:'km/h',wind_gusts_10m:'km/h',weather_code:'wmo code'},hourly:{time:[now/1000,now/1000+3600],temperature_2m:[0,null],precipitation_probability:[0,null],wind_speed_10m:[0,null],wind_gusts_10m:[0,null],weather_code:[0,null]}};

async function run() {
  // Missing values must never become a false dry/calm forecast or a fabricated temperature.
  const rows=w.weatherHours(weather);
  assert.deepEqual(rows[0],{at:now,prob:0,temperature:0,wind:0,gust:0,code:0});
  assert.deepEqual(rows[1],{at:now+3600000,prob:null,temperature:null,wind:null,gust:null,code:null});
  assert.equal(w.weatherAt(weather,'2026-09-12T12:30:00-06:00').at,now);
  assert.equal(w.weatherAt(weather,'2026-09-20T12:00:00-06:00'),null);
  assert.equal(w.weatherAt(weather,null),null);
  assert.equal(w.weatherHours({...weather,hourly_units:{}})[0].temperature,null);
  const invalid=structuredClone(weather);invalid.hourly.precipitation_probability=[-1,'0'];invalid.hourly.temperature_2m=[Infinity,NaN];
  assert.deepEqual(w.weatherHours(invalid).map(r => r.prob),[null,null]);
  assert.deepEqual(w.weatherHours(invalid).map(r => r.temperature),[null,null]);
  assert.deepEqual(w.weatherHours({}),[]);

  // Dates use the league's IANA zone, even when the computer is configured for Ojinaga/UTC.
  assert.equal(w.TZ,'America/Mexico_City');
  assert.equal(w.dayKey(Date.parse('2026-09-13T05:59:00Z')),'2026-09-12');
  assert.equal(w.dayKey(Date.parse('2026-09-13T06:00:00Z')),'2026-09-13');
  assert.equal(w.localToISO('2026-09-13T10:30'),'2026-09-13T16:30:00.000Z');
  assert.equal(w.localToISO('2022-07-01T10:30'),'2022-07-01T15:30:00.000Z');
  assert.equal(w.localToISO('2022-04-03T02:30'),null); // Nonexistent hour in historic DST transition.
  for(const value of [null,'','2026-09-13','2026-09-13T10:30','2026-02-30T10:30:00Z','2026-09-13T24:00:00Z','2026-09-13T10:30:00+14:30'])assert.equal(w.parseInstant(value),null);
  assert.equal(w.localToISO('2026-02-30T10:30'),null);
  assert.equal(w.parseInstant('2024-02-29T10:30:00Z'),Date.parse('2024-02-29T10:30:00Z'));

  // Verified coordinates can legitimately contain zero; absent and unverified positions are blocked.
  assert.equal(w.cleanCoordinates(coords,now).latitude,0);
  for(const delta of [{latitude:null},{longitude:''},{latitude:91},{longitude:-181},{verified:false},{responsible:''},{source:'javascript:alert(1)'},{verifiedAt:'2026-09-14T00:00:00Z'}])assert.equal(w.cleanCoordinates({...coords,...delta},now),null);
  assert.equal(w.cleanCoordinates(null,now),null);
  const url=new URL(w.forecastURL(coords));
  assert.equal(url.hostname,'api.open-meteo.com');
  assert.equal(url.searchParams.get('timezone'),w.TZ);
  assert.equal(url.searchParams.get('timeformat'),'unixtime');
  assert.equal(url.searchParams.get('latitude'),'0');
  assert.ok(url.searchParams.get('hourly').includes('temperature_2m'));

  // Terrain records expire independently from match decisions and always retain provenance.
  assert.equal(w.readReport('sur-1',{'sur-1':report},now).status,'fit');
  const old=w.readReport('sur-1',{'sur-1':report},now+w.REVIEW_AGE+1);
  assert.equal(old.status,'unknown');assert.equal(old.stale,true);assert.equal(old.report.status,'fit');
  assert.equal(w.readReport('sur-1',{},now).status,'unknown');
  for(const delta of [{status:'closed'},{responsible:''},{source:''},{reviewedAt:'2026-09-14T00:00:00Z'}])assert.equal(w.cleanReport({...report,...delta},now),null);
  assert.equal(w.cleanReport({...report,evidence:'javascript:alert(1)'},now).evidence,null);
  assert.equal(w.cleanMatch({...match,kickoffConfirmed:false},now),null);
  assert.equal(w.cleanMatch({...match,kickoff:'04:00'},now),null);
  assert.equal(w.cleanMatch({...match,source:''},now),null);
  assert.equal(w.cleanMatch({...match,status:'rain-cancelled'},now),null);
  assert.equal(w.cleanMatch({...match,kickoff:null},now).kickoff,null);
  assert.equal(w.cleanMatch({...match,status:'rescheduled'},now).status,'rescheduled');
  assert.match(w.weatherRisk({prob:100,code:95,gust:80}),/No indica suspensión/);
  assert.equal(w.weatherRisk(null),null);
  assert.equal(w.cleanMatch(match,now).status,'scheduled');
  assert.notEqual(w.matchId(fixture.category,fixture,'j1'),w.matchId(fixture.category,fixture,'j2'));

  // Proposals never become shared reports by saving them to localStorage or downloading them.
  const publicData=w.emptyPublic();publicData.reports['sur-1']=w.cleanReport(report,now);publicData.matches[fixture.id]=w.cleanMatch(match,now);
  const before=JSON.stringify(publicData), drafts={reports:{'sur-1':{...report,status:'unfit'}},matches:{[fixture.id]:{...match,status:'suspended'}}};
  const proposal=w.exportProposal(publicData,drafts,[fixture],now);
  assert.equal(proposal.publicationState,'draft');assert.equal(proposal.reports['sur-1'].status,'unfit');assert.equal(proposal.matches[fixture.id].status,'suspended');
  assert.equal(JSON.stringify(publicData),before);
  const malformed=w.exportProposal(publicData,{reports:{'sur-1':{status:'unfit'}},matches:{[fixture.id]:{status:'suspended'}}},[fixture],now);
  assert.equal(malformed.reports['sur-1'].status,'fit');assert.equal(malformed.matches[fixture.id].status,'scheduled');
  assert.equal(w.parsePublic(proposal,[fixture],now),null);
  const approved=w.parsePublic({...proposal,publicationState:'published'},[fixture],now);
  assert.equal(approved.reports['sur-1'].status,'unfit');
  assert.equal(Object.keys(w.parsePublic({...proposal,publicationState:'published'},[],now).matches).length,0);
  const actual=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/field-status-v38.json'),'utf8'));
  assert.deepEqual(w.parsePublic(actual,[],now),w.emptyPublic());

  // Cache has a real lifetime and is scoped to field coordinates, units and IANA zone.
  const key=w.forecastKey(coords), entry={key,fetchedAt:now,data:weather};
  assert.equal(w.cacheState(entry,key,now),'fresh');
  assert.equal(w.cacheState(entry,key,now+w.TTL+1),'stale');
  assert.equal(w.cacheState(entry,key,now+w.MAX_AGE+1),'expired');
  assert.equal(w.cacheState(entry,key+'other',now),'missing');
  assert.equal(w.cacheState({...entry,fetchedAt:now+1},key,now),'missing');
  assert.equal(w.cacheState({...entry,data:{}},key,now),'missing');

  // Offline, failed HTTP, malformed JSON, hanging network and hanging body all terminate honestly.
  assert.deepEqual(await w.fetchJSON('https://example.com',{fetchImpl:async () => ({ok:true,json:async () => ({ok:1})})}),{ok:1});
  await assert.rejects(w.fetchJSON('https://example.com',{fetchImpl:async () => {throw new Error('offline');}}),/offline/);
  await assert.rejects(w.fetchJSON('https://example.com',{fetchImpl:async () => ({ok:false,status:503})}),/HTTP 503/);
  await assert.rejects(w.fetchJSON('https://example.com',{fetchImpl:async () => ({ok:true,json:async () => {throw new SyntaxError('JSON inválido');}})}),/JSON inválido/);
  let aborted=false;
  await assert.rejects(w.fetchJSON('https://example.com',{timeoutMs:10,fetchImpl:async (_url,options) => {options.signal.addEventListener('abort',() => {aborted=true;});return new Promise(() => {});}}),{name:'TimeoutError'});
  assert.equal(aborted,true);
  await assert.rejects(w.fetchJSON('https://example.com',{timeoutMs:10,fetchImpl:async () => ({ok:true,json:() => new Promise(() => {})})}),{name:'TimeoutError'});

  // Real repository fixtures retain their source identity; no invented game/date enters the public state.
  const source=fs.readFileSync(path.join(__dirname,'../assets/v18-clubs.js'),'utf8');
  const matchData=/const V20=(\{.*\});/.exec(source.split('\n').find(line => line.includes('const V20=')));
  assert.ok(matchData,'Repository V20 data found');
  const data=JSON.parse(matchData[1]);
  const context={window:{LJR_V20:data,document:{readyState:'loading',addEventListener(){}},location:{hash:''}},URL,URLSearchParams,Intl,Date,Map,Set,AbortController,CustomEvent:function(){},setTimeout,clearTimeout};
  context.window.window=context.window;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/jr-weather-fields-v38.js'),'utf8'),context);
  const api=context.window.JRFieldsV38, games=api.fixtures();
  assert.equal(games.length,data.bulletins[0].groups.flatMap(g => g.games.filter(m => m.home && m.away)).length);
  assert.equal(api.fixtures(true).length>games.length,true);
  assert.equal(api.todayMatches(now).length,0);
  assert.equal(api.snapshot().loaded,false);
  assert.equal(games.every(g => !g.kickoff),true);
  assert.equal(games.filter(g => g.field).every(g => api.fieldFor(g.field)),true);
  console.log('V38 clima/campos: datos ausentes/cero, IANA, coordenadas, entidades, caducidad, borradores, HTTP/timeout y fixtures reales OK.');
}
run().catch(error => {console.error(error);process.exitCode=1;});
