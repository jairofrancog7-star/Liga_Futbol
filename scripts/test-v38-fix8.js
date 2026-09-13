const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;
const idx=read('index.html'),js=read('assets/jr-v38-fix8.js'),css=read('assets/jr-v38-fix8.css');
const vids=[
'v38-soccer-hero.mp4','v38-soccer-matchday.mp4','v38-soccer-fields-rain.mp4','v38-soccer-teams.mp4','v38-soccer-liguilla.mp4','v38-soccer-stats.mp4',
'v38-emirates-table.mp4','v38-emirates-stats.mp4','v38-emirates-community.mp4','v38-emirates-teams.mp4','v38-emirates-matchcenter.mp4'
].map(x=>'assets/motion/'+x);
const tests=[
['CSS FIX8 conectado',/jr-v38-fix8\.css\?v=38-8/.test(idx)],
['JS FIX8 conectado',/jr-v38-fix8\.js\?v=38-8/.test(idx)],
['11 videos disponibles',vids.every(p=>size(p)>100000)],
['OCR Tesseract bajo demanda',/tesseract\.js@5/.test(js)&&/(?:Tesseract|\bT)\.recognize/.test(js)&&/loadTesseract/.test(js)],
['CURP OCR y máscara',/extractCurp/.test(js)&&/curpMasked/.test(js)],
['edad desde CURP',/curpInfo/.test(js)&&/age/.test(js)],
['INE/localidad revisable',/extractResidence/.test(js)&&/confirma manualmente/i.test(js)],
['no persiste CURP completa en registro',!/rec=\{[\s\S]{0,800}curp:curp/.test(js)],
['foto de credencial',/jr41Photo/.test(js)&&/credentialPng/.test(js)],
['clima Open-Meteo',/api\.open-meteo\.com/.test(js)],
['clima-terreno-decision separados',/Pronóstico ≠ terreno ≠ decisión/.test(js)],
['lluvia no suspende sola',/lluvia por sí sola nunca suspende/.test(js)],
['fondo video global',/jr41Ambient/.test(js)&&/#jr41Ambient/.test(css)],
['ticker movimiento restaurado',/jr41Ticker/.test(js)&&/@keyframes jr41Ticker/.test(css)],
['mobile ball fix',/v14-stage canvas/.test(css)&&/scale\(\.82\)/.test(css)],
['reduced motion',/prefers-reduced-motion/.test(js)&&/prefers-reduced-motion/.test(css)],
['saveData',/saveData/.test(js)],
['version refresh móvil',/jr41-build/.test(js)&&/caches\.keys/.test(js)&&/38-9/.test(js)],
['banners principales',/matchcenter:/.test(js)&&/fields:/.test(js)&&/admin:/.test(js)]
];
let fail=0;for(const [n,ok] of tests){console.log(`${ok?'OK':'FAIL'} - ${n}`);if(!ok)fail++}
console.log(`\n${tests.length} pruebas FIX8; ${fail} fallos.`);process.exit(fail?1:0);