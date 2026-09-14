const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const idx=read('index.html');
const js=read('assets/jr-v38-fix18.js');
const css=read('assets/jr-v38-fix18.css');

const sources=[
'assets/motion/v38-soccer-matchday.mp4',
'assets/motion/v38-soccer-fields-rain.mp4',
'assets/motion/v38-soccer-teams.mp4',
'assets/motion/v38-soccer-liguilla.mp4',
'assets/motion/v38-soccer-stats.mp4',
'assets/motion/v38-soccer-hero.mp4',
'assets/motion/v38-emirates-community.mp4',
'assets/motion/v38-emirates-matchcenter.mp4',
'assets/motion/v38-emirates-table.mp4',
'assets/motion/v38-emirates-stats.mp4',
'assets/motion/v38-emirates-teams.mp4'
];

const tests=[
['CSS FIX18 conectado',idx.includes('jr-v38-fix18.css?v=38-18')],
['JS FIX18 conectado',idx.includes('jr-v38-fix18.js?v=38-18')],
['FIX17 no conectado',!idx.includes('jr-v38-fix17.js')&&!idx.includes('jr-v38-fix17.css')],
['FIX16 base conservado',exists('assets/jr-v38-fix16.js')&&exists('assets/jr-v38-fix16.css')],
['OCR FIX12 conservado',exists('assets/jr-v38-fix12.js')],
['11 motion reales disponibles',sources.every(exists)],
['solo 3 decoders max',js.includes('for(let i=0;i<3;i++)')&&js.includes("document.createElement('video')")],
['sin MutationObserver',!/\bMutationObserver\s*\(/.test(js)],
['FPS 3 movil 5 PC',js.includes('const FPS=mobile?3:5')],
['IntersectionObserver',js.includes('new IntersectionObserver')],
['vista Home diversa',js.includes("home:['matchday','teams','community']")],
['Partidos diversa',js.includes("matches:['matchday','matchcenter','liguilla']")],
['Tabla diversa',js.includes("table:['table','teams','matchcenter']")],
['Estadisticas diversa',js.includes("stats:['stats','soccerStats','teams']")],
['Mas diversa',js.includes("more:['community','emiratesTeams','rain']")],
['clima usa lluvia',js.includes("fields:['rain','matchday','community']")],
['cards movimiento real',js.includes('jr50-card-canvas')&&css.includes('.jr50-motion-card>.jr50-card-canvas')],
['tablas animadas',js.includes('jr50-table-motion')&&css.includes('.jr50-table-motion tr')],
['texto por encima',css.includes('z-index:2!important')],
['botones futuristas',css.includes('.jr50-button::before')&&css.includes('@keyframes jr50-orbit')],
['paleta multicolor',css.includes('--jr50-blue')&&css.includes('--jr50-red')&&css.includes('--jr50-gold')&&css.includes('--jr50-violet')],
['texto no negro',css.includes('--jr50-white:#f7f9fc')&&css.includes('color:#fff!important')],
['balon completo contain',js.includes('drawContain')&&css.includes('.jr50-ball-full')],
['hero 3D conservado',css.includes('#v14CinematicHero .jr38-ball-canvas')],
['Gran Final protegida',css.includes('video[controls]')&&css.includes('z-index:5')],
['fondo general en movimiento',js.includes('jr50PageCanvas')&&css.includes('#jr50PageCanvas')],
['saveData',js.includes('saveData')],
['reduced motion',css.includes('prefers-reduced-motion:reduce')],
['pause tab oculta',js.includes('visibilitychange')&&js.includes('document.hidden')],
['cache refresh 38-18',js.includes("BUILD='38-18'")&&js.includes('caches.keys')],
['publicador existe',exists('scripts/Publicar-V38-FIX18.ps1')]
];
let fail=0;
for(const [name,ok] of tests){console.log(`${ok?'OK':'FAIL'} - ${name}`);if(!ok)fail++}
console.log(`\n${tests.length} pruebas FIX18; ${fail} fallos.`);
process.exit(fail?1:0);
