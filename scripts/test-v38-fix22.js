
const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const idx=read('index.html');
const m=JSON.parse(read('manifest.webmanifest'));
const b=JSON.parse(read('build-v38.json'));
const fields=JSON.parse(read('data/fields-v38-22.json'));
const weather=read('assets/jr-v38-weather-fields-sync.js');
const mobile=read('assets/jr-v38-mobile-sync.js');
const gradle=read('android-wrapper/app/build.gradle');
const main=read('android-wrapper/app/src/main/java/com/ligajuventinorosas/app/MainActivity.java');
const sw=read('sw.js');

const ids=new Set(fields.fields.map(x=>x.id));
const tests=[
 ['build 38-22',b.build==='38-22'],
 ['CSS clima conectado',idx.includes('jr-v38-weather-fields-sync.css?v=38-22')],
 ['JS clima conectado',idx.includes('jr-v38-weather-fields-sync.js?v=38-22')],
 ['registro campos conectado',idx.includes('fields-v38-22.js?v=38-22')],
 ['mobile CSS conectado',idx.includes('jr-v38-mobile-sync.css?v=38-22')],
 ['mobile JS conectado',idx.includes('jr-v38-mobile-sync.js?v=38-22')],
 ['FIX21 no eliminado por FIX22',!idx.includes('JR_V38_FIX22_DISABLE_FIX21')],
 ['14 campos/aliases base',fields.fields.length>=14&&ids.has('pozos')&&ids.has('tavera')&&ids.has('rincon')&&ids.has('san-juan')&&ids.has('san-julian')&&ids.has('romerillo')],
 ['Pozos exacto',fields.fields.some(x=>x.id==='pozos'&&x.precision==='exact'&&Math.abs(x.latitude-20.61767)<.00001)],
 ['Unidad Sur configurada',fields.fields.some(x=>x.id==='sur-1'&&x.precision==='complex')],
 ['Cerrito configurado',fields.fields.some(x=>x.id==='cerrito'&&x.weatherEligible)],
 ['Tavera configurado',fields.fields.some(x=>x.id==='tavera'&&x.weatherEligible)],
 ['San Juan configurado',fields.fields.some(x=>x.id==='san-juan'&&x.weatherEligible)],
 ['Cuenda configurado',fields.fields.some(x=>x.id==='cuenda'&&x.weatherEligible)],
 ['Romerillo configurado',fields.fields.some(x=>x.id==='romerillo'&&x.weatherEligible)],
 ['Rincón configurado',fields.fields.some(x=>x.id==='rincon'&&x.weatherEligible)],
 ['San José configurado',fields.fields.some(x=>x.id==='san-jose'&&x.weatherEligible)],
 ['San Julián cerca de cancha',fields.fields.some(x=>x.id==='san-julian'&&x.precision==='near-field')],
 ['Google Maps links',weather.includes('google.com/maps/search')&&weather.includes('google.com/maps/dir')],
 ['Google clima enlace',weather.includes('google.com/search?q=')],
 ['Open-Meteo horario',weather.includes('api.open-meteo.com/v1/forecast')&&weather.includes('hourly:')],
 ['forecast 16 días',weather.includes("forecast_days:'16'")],
 ['timezone Mexico City',weather.includes("TZ='America/Mexico_City'")],
 ['Veteranos sábado',fields.playPatterns['Veteranos 35+'].dayOfWeek===6&&fields.playPatterns['Veteranos 50+'].dayOfWeek===6],
 ['categorías abiertas domingo',fields.playPatterns['Primera Fuerza'].dayOfWeek===0&&fields.playPatterns['Intermedia'].dayOfWeek===0&&fields.playPatterns['Segunda Fuerza'].dayOfWeek===0],
 ['Veteranos tarde',weather.includes("if(/^Veteranos/i.test(category)&&h>=1&&h<=7)h+=12")],
 ['riesgo por ventana de horario',weather.includes('matchAt-60*60*1000')&&weather.includes('matchAt+2*60*60*1000')],
 ['lluvia no suspende automáticamente',weather.includes('no cambia por sí solo el estado oficial a “Suspendido”')||weather.includes('no cambia por sí solo el estado oficial a “Suspendido”.')],
 ['alertas navegador',weather.includes("Notification'in window")&&weather.includes('notifyHighRisks')],
 ['compartir aviso',weather.includes('navigator.share')],
 ['ajustar pin campo',weather.includes("localStorage.setItem('jr54-field-pin:'")],
 ['PWA build query',m.start_url.includes('build=38-22')],
 ['PWA shortcut campos',m.shortcuts.some(x=>x.name==='Campos y clima')],
 ['SW sigue desactivado',sw.includes('unregister()')&&sw.includes('caches.delete')],
 ['mobile build checker',mobile.includes("fetch('./build-v38.json")&&mobile.includes("BUILD='38-22'")],
 ['versionName APK 1.2.0',/versionName\s+['"]1\.2\.0['"]/.test(gradle)],
 ['versionCode APK 3',/versionCode\s+3\b/.test(gradle)],
 ['APK apunta build 38-22',main.includes('WEB_BUILD = "38-22"')],
 ['APK upload OCR',main.includes('onShowFileChooser')&&main.includes('image/*')],
 ['APK abre externos',main.includes('Intent.ACTION_VIEW')],
 ['APK cache one-time',main.includes('clearCache(true)')&&main.includes('jr_mobile_sync')],
 ['APK media autoplay permitido',main.includes('setMediaPlaybackRequiresUserGesture(false)')],
 ['scripts sintaxis presentes',exists('scripts/test-v38-fix22.js')],
];
let fail=0;
for(const [n,ok] of tests){console.log(`${ok?'OK':'FAIL'} - ${n}`);if(!ok)fail++}
console.log(`\n${tests.length} pruebas FIX22; ${fail} fallos.`);
process.exit(fail?1:0);
