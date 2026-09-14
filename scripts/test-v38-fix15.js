const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const idx=read('index.html');
const js=read('assets/jr-v38-fix15.js');
const css=read('assets/jr-v38-fix15.css');
const f12=read('assets/jr-v38-fix12.js');

const tests=[
 ['CSS FIX15 conectado',idx.includes('jr-v38-fix15.css?v=38-15')],
 ['JS FIX15 conectado',idx.includes('jr-v38-fix15.js?v=38-15')],
 ['flag legacy antes de scripts',idx.includes('window.__JR47DisableLegacyMotion=true')],
 ['FIX13 desconectado',!idx.includes('jr-v38-fix13.js?v=38-13')&&!idx.includes('jr-v38-fix13.css?v=38-13')],
 ['FIX14 desconectado',!idx.includes('jr-v38-fix14.js?v=38-14')&&!idx.includes('jr-v38-fix14.css?v=38-14')],
 ['FIX12 OCR se conserva',idx.includes('jr-v38-fix12.js?v=38-12')],
 ['FIX12 motion guard initSources',f12.includes('function initSources(){if(window.__JR47DisableLegacyMotion)return;')],
 ['FIX12 motion guard addMotion',f12.includes('function addMotion(el,stage=false,index=0){if(window.__JR47DisableLegacyMotion)return;')],
 ['FIX12 motion guard decorateAll',f12.includes('function decorateAll(){if(window.__JR47DisableLegacyMotion)return;')],
 ['un solo video global',js.includes("stableVideo=document.createElement('video')")&&js.includes('jr47StableVideo')],
 ['sin MutationObserver FIX15',!/new\s+MutationObserver\s*\(|\bMutationObserver\s*\(/.test(js)],
 ['sin canvas por tarjeta FIX15',!js.includes("document.createElement('canvas')")],
 ['videos tabla/stats distintos',js.includes("table:'./assets/motion/v38-emirates-table.mp4'")&&js.includes("stats:'./assets/motion/v38-emirates-stats.mp4'")],
 ['cards translucidas',js.includes('glassify')&&css.includes('.jr47-glass')],
 ['tablas translucidas',js.includes('jr47-table')&&css.includes('.jr47-table tr')],
 ['hero contain',css.includes('object-fit:contain!important')],
 ['botones ligeros',js.includes('jr47-pop')&&css.includes('@keyframes jr47-sweep')],
 ['pause pestaña',js.includes('visibilitychange')&&js.includes('document.hidden')],
 ['saveData',js.includes('saveData')],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['refresh 38-15',js.includes("BUILD='38-15'")&&js.includes('caches.keys')]
];

let f=0;
for(const [n,o] of tests){
 console.log(`${o?'OK':'FAIL'} - ${n}`);
 if(!o)f++;
}
console.log(`\n${tests.length} pruebas FIX15; ${f} fallos.`);
process.exit(f?1:0);
