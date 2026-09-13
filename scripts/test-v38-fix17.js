const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;
const idx=read('index.html'),js=read('assets/jr-v38-fix17.js'),css=read('assets/jr-v38-fix17.css');
const motion=[
 'atlas10','stadium-run','goalkeeper-dive','bicycle-kick','goal-net','boots',
 'rain-pitch','tactics','crowd-lights','referee','ball-920'
].map(n=>`assets/motion/jr-v38-fix17-${n}.mp4`);
const tests=[
 ['CSS FIX17 conectado',idx.includes('jr-v38-fix17.css?v=38-17')],
 ['JS FIX17 conectado',idx.includes('jr-v38-fix17.js?v=38-17')],
 ['FIX16 desconectado',!idx.includes('jr-v38-fix16.js?v=38-16')&&!idx.includes('jr-v38-fix16.css?v=38-16')],
 ['flag legacy temprano',idx.includes('window.__JR47DisableLegacyMotion=true')],
 ['FIX12 conservado',exists('assets/jr-v38-fix12.js')],
 ['11 archivos motion FIX17',motion.every(exists)],
 ['atlas local valido',size('assets/motion/jr-v38-fix17-atlas10.mp4')>150000],
 ['10 escenas semanticas',js.includes("'stadium-run'")&&js.includes("'goalkeeper-dive'")&&js.includes("'bicycle-kick'")&&js.includes("'goal-net'")&&js.includes("'boots'")&&js.includes("'rain-pitch'")&&js.includes("'tactics'")&&js.includes("'crowd-lights'")&&js.includes("'referee'")&&js.includes("'ball-920'")],
 ['atlas 5x2',js.includes('COLS=5,ROWS=2,TW=256,TH=144,TILES=10')],
 ['90 pares distintos',js.includes('PAIR_COUNT=TILES*(TILES-1)')&&js.includes('uniquePair')],
 ['un solo decoder',js.includes("atlas=document.createElement('video')")&&!js.includes("document.createElement('video');document.createElement('video')")],
 ['sin MutationObserver',!/\bMutationObserver\s*\(/.test(js)],
 ['FPS 3 movil 5 PC',js.includes('const FPS=mobile?3:5')],
 ['IntersectionObserver',js.includes('new IntersectionObserver')&&js.includes('visibleCards')&&js.includes('visibleButtons')],
 ['cards con motion',js.includes('jr49-card-canvas')&&css.includes('.jr49-motion-card>.jr49-card-canvas')],
 ['botones con motion',js.includes('jr49-btn-canvas')&&css.includes('.jr49-motion-button>.jr49-btn-canvas')],
 ['todos botones selector',js.includes('[role="button"]')&&js.includes('button,.btn-primary')],
 ['tablas motion',js.includes('jr49-table-motion')&&css.includes('.jr49-table-motion tr')],
 ['texto siempre arriba',css.includes('z-index:2')&&css.includes('.jr49-card-shade')],
 ['Tabla fuerza tactica',js.includes("el.matches('#view-table .jr39-view-banner')")&&js.includes('force=6')],
 ['Estadisticas fuerza portero',js.includes("el.matches('#view-stats .jr39-view-banner')")&&js.includes('force=1')],
 ['balon 920 completo',js.includes("forceBall?9:forceTile")&&js.includes('drawContain')&&css.includes('.jr49-ball-full')],
 ['clima usa rain-pitch',js.includes("if(/clima|lluvia|pronóstico|pronostico|terreno|campo|cancha/.test(s))return 5")],
 ['chilena para finales',js.includes("if(/final|liguilla|copa|eliminatoria/.test(s))return 2")],
 ['porterias goles',js.includes("if(/portero|portería|porteria|gol|marcador|resultado/.test(s))return 3")],
 ['paleta no solo verde',css.includes('--jr49-blue')&&css.includes('--jr49-red')&&css.includes('--jr49-gold')&&css.includes('--jr49-purple')],
 ['fondo pagina animado',js.includes('jr49PageCanvas')&&css.includes('#jr49PageCanvas')],
 ['Gran Final protegida',css.includes('video[controls]')&&css.includes('z-index:5')],
 ['balones 3D conservados',css.includes('#v14CinematicHero .jr38-ball-canvas')],
 ['saveData',js.includes('saveData')],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['pause pestaña',js.includes('visibilitychange')&&js.includes('document.hidden')],
 ['refresh cache 38-17',js.includes("BUILD='38-17'")&&js.includes('caches.keys')],
 ['publicador incluido',exists('scripts/Publicar-V38-FIX17.ps1')]
];
let fail=0;
for(const [n,ok] of tests){console.log(`${ok?'OK':'FAIL'} - ${n}`);if(!ok)fail++}
console.log(`\n${tests.length} pruebas FIX17; ${fail} fallos.`);
process.exit(fail?1:0);
