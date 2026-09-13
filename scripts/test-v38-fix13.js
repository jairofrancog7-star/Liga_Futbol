const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;
const i=read('index.html'),j=read('assets/jr-v38-fix13.js'),c=read('assets/jr-v38-fix13.css');
const tests=[
 ['CSS FIX13 conectado',i.includes('jr-v38-fix13.css?v=38-13')],
 ['JS FIX13 conectado',i.includes('jr-v38-fix13.js?v=38-13')],
 ['FIX12 OCR/clima se conserva',i.includes('jr-v38-fix12.js?v=38-12')],
 ['atlas 24 escenas existe',size('assets/motion/v38-fix13-motion-atlas.mp4')>50000],
 ['fondo pagina existe',size('assets/motion/v38-fix13-page-bg.mp4')>20000],
 ['fondo final existe',size('assets/motion/v38-fix13-final-bg.mp4')>20000],
 ['atlas 6x4 / 24',j.includes('TILE_COLS=6')&&j.includes('TILE_ROWS=4')&&j.includes('TILE_COUNT=24')],
 ['fondos no identicos',j.includes('jr45a')&&j.includes('jr45b')&&j.includes('globalCompositeOperation')],
 ['un solo decoder atlas',j.includes("atlas=document.createElement('video')")&&j.includes('jr45Atlas')],
 ['motion en cards',j.includes('decorateAll')&&j.includes('[class*="card"]')],
 ['motion en tablas',j.includes('decorateTables')&&c.includes('.jr45-table-motion tr')],
 ['motion en hero debajo 3D',j.includes('decorateHero')&&c.includes('canvas:not(.jr45-motion-canvas)')],
 ['fondo exclusivo Gran Final',j.includes('decorateFinal')&&j.includes('FINAL_BG')&&c.includes('.jr45-final-motion video:not(.jr45-final-bg)')],
 ['texto encima de motion',c.includes('z-index:2')&&c.includes('.jr45-motion-shade')],
 ['botones interactivos',j.includes('modernButtons')&&c.includes('--jr45-x')],
 ['desactiva motion FIX12 sin quitar OCR',j.includes('disableFix12Motion')&&c.includes('.jr44-motion-canvas')],
 ['sin MutationObserver',!j.includes('MutationObserver')],
 ['reduced motion',c.includes('prefers-reduced-motion:reduce')],
 ['saveData',j.includes('saveData')],
 ['pause pestana oculta',j.includes('visibilitychange')&&j.includes('document.hidden')],
 ['refresh 38-13',j.includes("BUILD='38-13'")&&j.includes('caches.keys')],
 ['publicador FIX13 incluido',exists('scripts/Publicar-V38-FIX13.ps1')]
];
let f=0;
for(const [n,o] of tests){console.log(`${o?'OK':'FAIL'} - ${n}`);if(!o)f++}
console.log(`\n${tests.length} pruebas FIX13; ${f} fallos.`);
process.exit(f?1:0);
