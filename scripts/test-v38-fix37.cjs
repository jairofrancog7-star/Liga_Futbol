const fs=require('fs'),p=require('path');const root=p.resolve(__dirname,'..');
const js=fs.readFileSync(p.join(root,'assets','jr-v38-fix37.js'),'utf8');
const css=fs.readFileSync(p.join(root,'assets','jr-v38-fix37.css'),'utf8');
const refresh=fs.readFileSync(p.join(root,'refresh-v37.html'),'utf8');
const sync=fs.readFileSync(p.join(root,'assets','jr-v38-mobile-sync.js'),'utf8');
const build=JSON.parse(fs.readFileSync(p.join(root,'build-v38.json'),'utf8'));
const tests=[
 ['build 38-37',build.build==='38-37'&&js.includes("BUILD='38-37'")&&refresh.includes('38-37')],
 ['mobile sync carga FIX37',sync.includes('jr-v38-fix37.css')&&sync.includes('jr-v38-fix37.js')&&sync.includes("BUILD='38-37'" )],
 ['credencial física',js.includes('Liga Municipal De Futbol')&&js.includes('Juventino Rosas, A.C.')],
 ['foto local no persistida',js.includes("let DATA=null, PHOTO=''" )&&!js.includes('localStorage.setItem')&&!js.includes('sessionStorage.setItem')],
 ['QR separado',js.includes('Validación digital separada')&&js.includes('jr69Qr')],
 ['legacy demo se reemplaza',js.includes('LJR 00471')&&js.includes('jr69-legacy-credential-replaced')],
 ['categorías 5 columnas',css.includes('repeat(5,minmax(0,1fr))')],
 ['explora 12 columnas',css.includes('repeat(12,minmax(76px,1fr))')],
 ['móvil carrusel categorías',css.includes('grid-auto-columns:186px')],
 ['refresh limpia caches',refresh.includes('caches.keys')&&refresh.includes('serviceWorker')]
];
let bad=0;for(const [n,ok] of tests){console.log(ok?'OK ':'FAIL',n);if(!ok)bad++}console.log(`${tests.length} pruebas FIX37; ${bad} fallos.`);process.exitCode=bad?1:0;
