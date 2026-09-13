const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;

const idx=read('index.html');
const js=read('assets/jr-v38-fix14.js');
const css=read('assets/jr-v38-fix14.css');
const scene=read('assets/football-scene.js');

const tests=[
 ['CSS FIX14 conectado',idx.includes('jr-v38-fix14.css?v=38-14')],
 ['JS FIX14 conectado',idx.includes('jr-v38-fix14.js?v=38-14')],
 ['refresh football scene 38-14',idx.includes('football-scene.js?v=38-14')],
 ['atlas 36 existe',size('assets/motion/v38-fix14-atlas36.mp4')>1000000],
 ['atlas 6x6',js.includes('COLS=6')&&js.includes('ROWS=6')&&js.includes('TILES=36')],
 ['Tabla video distinto',js.includes("table:'./assets/motion/v38-emirates-table.mp4'")],
 ['Estadisticas video distinto',js.includes("stats:'./assets/motion/v38-emirates-stats.mp4'")],
 ['hero object-fit contain',css.includes('object-fit:contain!important')],
 ['balon giro 920 aprox',scene.includes('index ? -1.18 : 1.34')],
 ['todos cuadros dinamicos',js.includes("qa('section,article,div',root)")&&js.includes('eligible(el)')],
 ['fondos no iguales por hash',js.includes('function hash')&&js.includes('jr46a')&&js.includes('jr46b')],
 ['tablas animadas',js.includes('jr46-table')&&css.includes('.jr46-table tr')],
 ['botones shimmer',css.includes('@keyframes jr46-shine')],
 ['botones magneticos',js.includes('--jr46-mx')&&css.includes('--jr46-mx')],
 ['botones clic pop',js.includes('jr46-pop')&&css.includes('@keyframes jr46-pop')],
 ['MutationObserver dinamico',js.includes('MutationObserver')],
 ['fondo pagina canvas',js.includes('jr46PageCanvas')&&css.includes('#jr46PageCanvas')],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['saveData',js.includes('saveData')],
 ['pause pestaña',js.includes('visibilitychange')&&js.includes('document.hidden')],
 ['OCR FIX12 no eliminado',idx.includes('jr-v38-fix12.js?v=38-12')],
 ['build 38-14',js.includes("BUILD='38-14'")],
 ['publicador incluido',exists('scripts/Publicar-V38-FIX14.ps1')]
];

let fail=0;
for(const [name,ok] of tests){
 console.log(`${ok?'OK':'FAIL'} - ${name}`);
 if(!ok)fail++;
}
console.log(`\n${tests.length} pruebas FIX14; ${fail} fallos.`);
process.exit(fail?1:0);
