const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;

const i=read('index.html');
const j=read('assets/jr-v38-fix12.js');
const c=read('assets/jr-v38-fix12.css');

const vids=[
  'v38-fix12-motion-hero-lite.mp4',
  'v38-fix12-motion-field-lite.mp4',
  'v38-fix12-motion-tactics-lite.mp4'
];

const tests=[
 ['CSS FIX12 conectado',i.includes('jr-v38-fix12.css?v=38-12')],
 ['JS FIX12 conectado',i.includes('jr-v38-fix12.js?v=38-12')],
 ['motion lite disponible',vids.every(x=>size('assets/motion/'+x)>20000)],
 ['capas antiguas removidas',!/jr-v38-(?:fix8|fix10|fix11|emirates-motion)\.(?:js|css)/.test(i)],
 ['shared video compositor',j.includes('jr44VideoSources')&&j.includes('drawCover')&&j.includes('jr44-motion-canvas')],
 ['todos cuadros elegibles se decoran',j.includes('decorateAll')&&j.includes('[class*="card"]')],
 ['sin MutationObserver',!j.includes('MutationObserver')],
 ['mobile usa un decoder',j.includes('sourceCount=mobile?1:3')],
 ['hero conserva 3D y motion debajo',j.includes('jr44-stage-motion')&&c.includes('canvas:not(.jr44-stage-motion)')],
 ['titulo correcto',j.includes('QUE SE SIENTE')&&j.includes('EN VIVO.')],
 ['OCR automatico al subir',j.includes('onchange=e=>scanDoc')&&j.includes('tesseract.js@5')],
 ['detecta CURP o INE',j.includes('detectDocType')&&j.includes('CREDENCIAL PARA VOTAR')],
 ['CURP calcula edad',j.includes('curpInfo')&&j.includes('age')],
 ['libres menor CURP mayor INE',j.includes('menor de edad')&&j.includes('mayor de edad')],
 ['veteranos INE obligatoria',j.includes('INE obligatoria para registro')],
 ['foto jugador',j.includes('jr44Photo')&&j.includes('Foto del jugador')],
 ['genera credencial canvas',j.includes('generateCredential')&&j.includes('jr44CredentialCanvas')],
 ['descarga PNG',j.includes("toDataURL('image/png')")&&j.includes('Descargar credencial PNG')],
 ['CURP completa no persiste',j.includes('curpMasked')&&!j.includes("localStorage.setItem('curp'")],
 ['clima localidades',j.includes('Rincón de Centeno')&&j.includes('Jaralillo')&&j.includes('Cuenda')],
 ['lluvia no suspende sola',j.includes('La lluvia no suspende por sí sola')],
 ['refresh 38-12',j.includes('38-12')&&j.includes('caches.keys')]
];

let f=0;
for(const [n,o] of tests){
 console.log(`${o?'OK':'FAIL'} - ${n}`);
 if(!o)f++;
}
console.log(`\n${tests.length} pruebas FIX12; ${f} fallos.`);
process.exit(f?1:0);
