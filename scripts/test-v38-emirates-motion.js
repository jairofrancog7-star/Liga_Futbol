const fs=require('fs');
const path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;

const idx=read('index.html');
const js=read('assets/jr-v38-emirates-motion.js');
const css=read('assets/jr-v38-emirates-motion.css');

const expectedVideos=[
  'assets/motion/v38-emirates-table.mp4',
  'assets/motion/v38-emirates-stats.mp4',
  'assets/motion/v38-emirates-community.mp4',
  'assets/motion/v38-emirates-teams.mp4',
  'assets/motion/v38-emirates-matchcenter.mp4'
];

const mappings=['matches','matchcenter','fields','teams','bracket','table','stats','more'];
const tests=[
  ['CSS Emirates conectado',/jr-v38-emirates-motion\.css\?v=38-7/.test(idx)],
  ['JS Emirates conectado',/jr-v38-emirates-motion\.js\?v=38-7/.test(idx)],
  ['CSS Emirates existe',css.length>3000],
  ['JS Emirates existe',js.length>5000],
  ['5 nuevos Higgsfield existen',expectedVideos.every(p=>size(p)>100000)],
  ['video manager por viewport',/IntersectionObserver/.test(js)&&/dataset\.src/.test(js)],
  ['pause por pestaña oculta',/visibilitychange/.test(js)&&/document\.hidden/.test(js)],
  ['reduced motion',/prefers-reduced-motion/.test(js)&&/prefers-reduced-motion/.test(css)],
  ['saveData',/saveData/.test(js)],
  ['GSAP ScrollTrigger',/gsapEnhance/.test(js)&&/ScrollTrigger/.test(js)],
  ['Lenis 1.3.26',/lenis@1\.3\.26/.test(js)],
  ['magnetic buttons',/magneticButtons/.test(js)&&/jr40-magnetic/.test(css)],
  ['film rail home',/jr40FilmRail/.test(js)&&/jr40-film-grid/.test(css)],
  ['oculta banners antiguos sin borrarlos',/\.jr39-view-banner\{display:none!important\}/.test(css)],
  ['vistas principales configuradas',mappings.every(x=>new RegExp('(?:^|\\s|,)' + x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ':\\{').test(js))],
  ['table usa video propio',/table:\{asset:'table'/.test(js)],
  ['stats usa video propio',/stats:\{asset:'stats'/.test(js)],
  ['more usa video propio',/more:\{asset:'more'/.test(js)],
  ['matchcenter usa video propio',/matchcenter:\{asset:'matchcenter'/.test(js)],
  ['teams usa video propio',/teams:\{asset:'teams'/.test(js)]
];

let fail=0;
for(const [name,ok] of tests){
  console.log(`${ok?'OK':'FAIL'} - ${name}`);
  if(!ok)fail++;
}
console.log(`\n${tests.length} pruebas Emirates Motion; ${fail} fallos.`);
process.exit(fail?1:0);
