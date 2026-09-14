
const fs=require('fs'),path=require('path');

const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

const idx=read('index.html');
const js=read('assets/jr-v38-fix21.js');
const css=read('assets/jr-v38-fix21.css');
const manifest=read('assets/jr-v38-fix21-manifest.js');

let sources=[];
try{
  const m=manifest.match(/window\.__JR53MotionSources\s*=\s*(\[[\s\S]*\])\s*;/);
  sources=m?JSON.parse(m[1]):[];
}catch(_){}

const hashes=new Set(sources.map(x=>x.hash||x.src));

const tests=[
 ['FIX21 CSS conectado',idx.includes('jr-v38-fix21.css?v=38-21')],
 ['FIX21 manifest conectado',idx.includes('jr-v38-fix21-manifest.js?v=38-21')],
 ['FIX21 JS conectado',idx.includes('jr-v38-fix21.js?v=38-21')],
 ['manifest antes de runtime',idx.indexOf('jr-v38-fix21-manifest.js?v=38-21')<idx.indexOf('jr-v38-fix21.js?v=38-21')],
 ['FIX20 desconectado',!idx.includes('jr-v38-fix20.js')&&!idx.includes('jr-v38-fix20.css')],
 ['FIX16 sigue conectado',idx.includes('jr-v38-fix16.js')&&idx.includes('jr-v38-fix16.css')],
 ['FIX16 archivos existen',exists('assets/jr-v38-fix16.js')&&exists('assets/jr-v38-fix16.css')],
 ['manifest tiene fuentes',sources.length>=4],
 ['manifest sin duplicados hash',hashes.size===sources.length],
 ['manifest excluye atlas',sources.every(x=>!/atlas/i.test(x.src||''))],
 ['objetivo Explora solamente',js.includes("id:'explore'")&&js.includes("'explora la liga'")],
 ['objetivo Entrar solamente',js.includes("id:'access'")&&js.includes("'entrar a liga juventino rosas'")],
 ['objetivo OCR solamente',js.includes("id:'ocr'")&&js.includes("'credenciales con ocr'")],
 ['objetivo Master solamente',js.includes("id:'master'")&&js.includes("'todo juventino rosas")],
 ['objetivo Experiencia solamente',js.includes("id:'experience'")&&js.includes("'tu liga, mas viva e interactiva'")],
 ['no barre todos los cards del sitio',!js.includes("qa('.card',document)")],
 ['no cambia headings globales',!css.includes('body.jr53-fix21 h1{')],
 ['no cambia botones globales',!css.includes('body.jr53-fix21 button{')],
 ['oculta jr48 sólo dentro target',css.includes('.jr53-target-motion.jr53-has-frame .jr48-card-canvas')],
 ['resto FIX16 no se apaga',!css.includes('#jr48PageCanvas{display:none')],
 ['pool 1 móvil 2 PC',js.includes('const POOL_SIZE=mobile?1:2')],
 ['FPS 3 móvil 4 PC',js.includes('const FPS=mobile?3:4')],
 ['requestIdleCallback',js.includes('requestIdleCallback')],
 ['IntersectionObserver',js.includes('new IntersectionObserver')],
 ['sin MutationObserver',!/\bMutationObserver\s*\(/.test(js)],
 ['sin setInterval',!/\bsetInterval\s*\(/.test(js)],
 ['preload metadata',js.includes("video.preload='metadata'")],
 ['pausa pestaña oculta',js.includes('visibilitychange')&&js.includes('document.hidden')],
 ['saveData',js.includes('saveData')],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['ticker con gutters',css.includes('#jr42Ticker')&&css.includes('margin-left:clamp(16px,3vw,38px)')],
 ['ticker sin corte duro',css.includes('mask-image:linear-gradient')],
 ['track con padding lateral',css.includes('#jr42Ticker .track')&&css.includes('padding-left:clamp(52px,6vw,96px)')],
 ['texto ticker nowrap',css.includes('#jr42Ticker span')&&css.includes('white-space:nowrap!important')],
 ['cache refresh 38-21',js.includes("BUILD='38-21'")&&js.includes('caches.keys')],
 ['no toca videos con controles',js.includes("video:not([controls])")],
 ['Gran Final delante',css.includes('video[controls]')&&css.includes('z-index:10')],
 ['source uniqueness',js.includes('sourceUsed.has')&&js.includes('sourceUsed.add')],
 ['evita prioridad a ball',js.includes("if(/ball|balon/.test(n))total-=12")],
 ['no commit/push en runtime',!js.includes('git ')],
];

let fail=0;
for(const [name,ok] of tests){
  console.log(`${ok?'OK':'FAIL'} - ${name}`);
  if(!ok)fail++;
}
console.log(`\n${tests.length} pruebas FIX21; ${fail} fallos.`);
process.exit(fail?1:0);
