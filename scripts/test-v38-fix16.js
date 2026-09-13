const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();

const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;

const idx=read('index.html');
const js=read('assets/jr-v38-fix16.js');
const css=read('assets/jr-v38-fix16.css');
const f12=read('assets/jr-v38-fix12.js');

const tests=[
 ['CSS FIX16 conectado',idx.includes('jr-v38-fix16.css?v=38-16')],
 ['JS FIX16 conectado',idx.includes('jr-v38-fix16.js?v=38-16')],
 ['FIX15 desconectado',!idx.includes('jr-v38-fix15.js?v=38-15')&&!idx.includes('jr-v38-fix15.css?v=38-15')],
 ['FIX12 OCR/clima/credencial conservado',idx.includes('jr-v38-fix12.js?v=38-12')],
 ['legacy motion sigue bloqueado',idx.includes('window.__JR47DisableLegacyMotion=true')],
 ['guard FIX12 initSources',f12.includes('function initSources(){if(window.__JR47DisableLegacyMotion)return;')],
 ['atlas Higgsfield 36 existe',size('assets/motion/v38-fix14-atlas36.mp4')>1000000],
 ['un solo decoder atlas',js.includes("atlas=document.createElement('video')")&&js.includes('jr48Atlas')],
 ['sin MutationObserver',!/\bMutationObserver\s*\(/.test(js)],
 ['sin barrido generico div',!js.includes("qa('section,article,div'")&&!js.includes("querySelectorAll('div")],
 ['fps limitado 4/6',js.includes('const FPS=mobile?4:6')],
 ['IntersectionObserver visible-only',js.includes('new IntersectionObserver')&&js.includes('visibleCards')&&js.includes('visibleButtons')],
 ['1260 pares unicos',js.includes('PAIR_COUNT=TILES*(TILES-1)')&&js.includes('uniquePair')],
 ['cuadros con canvas motion',js.includes('jr48-card-canvas')&&css.includes('.jr48-motion-card>.jr48-card-canvas')],
 ['botones con canvas motion',js.includes('jr48-btn-canvas')&&css.includes('.jr48-motion-button>.jr48-btn-canvas')],
 ['todos botones selector',js.includes('[role="button"]')&&js.includes('button,.btn-primary')],
 ['tablas animadas',js.includes('jr48-table-motion')&&css.includes('.jr48-table-motion tr')],
 ['texto encima motion',css.includes('z-index:2')&&css.includes('.jr48-card-shade')],
 ['Tabla/Estadisticas distintos',js.includes("table:'./assets/motion/v38-emirates-table.mp4'")&&js.includes("stats:'./assets/motion/v38-emirates-stats.mp4'")],
 ['Gran Final no tapada',css.includes('video[controls]')&&css.includes('z-index:4')],
 ['hero balon contain',css.includes('object-fit:contain!important')],
 ['fondo pagina animado',js.includes('jr48PageCanvas')&&css.includes('#jr48PageCanvas')],
 ['pause pestaña oculta',js.includes('visibilitychange')&&js.includes('document.hidden')],
 ['saveData',js.includes('saveData')],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['refresh 38-16',js.includes("BUILD='38-16'")&&js.includes('caches.keys')],
 ['publicador incluido',exists('scripts/Publicar-V38-FIX16.ps1')]
];

let fail=0;
for(const [name,ok] of tests){
 console.log(`${ok?'OK':'FAIL'} - ${name}`);
 if(!ok)fail++;
}
console.log(`\n${tests.length} pruebas FIX16; ${fail} fallos.`);
process.exit(fail?1:0);
