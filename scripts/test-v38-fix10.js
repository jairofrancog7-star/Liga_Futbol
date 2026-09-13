const fs=require('fs'),path=require('path');const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),exists=p=>fs.existsSync(path.join(root,p)),size=p=>exists(p)?fs.statSync(path.join(root,p)).size:0;
const i=read('index.html'),j=read('assets/jr-v38-fix10.js'),c=read('assets/jr-v38-fix10.css');
const vids=['v38-fix10-hero-motion.mp4','v38-fix10-field-motion.mp4','v38-fix10-tactics-motion.mp4'];
const tests=[
['CSS FIX10 conectado',/jr-v38-fix10\.css\?v=38-10/.test(i)],
['JS FIX10 conectado',/jr-v38-fix10\.js\?v=38-10/.test(i)],
['3 motions nuevos existen',vids.every(x=>size('assets/motion/'+x)>100000)],
['balones 3D no se eliminan',!/remove\(\).*football-scene|display:none[^}]*v14-stage canvas/.test(j+c)],
['hero film debajo de canvas',/jr42-hero-film/.test(j)&&/z-index:-2/.test(c)],
['titulo agrupado',/QUE SE SIENTE/.test(j)&&/EN VIVO\./.test(j)],
['videos debajo del texto en cards',/jr42-card-film/.test(j)&&/jr42-motion-card/.test(c)],
['fondo global movimiento',/jr42Ambient/.test(j)&&/#jr42Ambient/.test(c)],
['weather localidades',/Rincón de Centeno/.test(j)&&/Jaralillo/.test(j)&&/Cuenda/.test(j)],
['geocoding weather',/geocoding-api\.open-meteo\.com/.test(j)],
['forecast weather',/api\.open-meteo\.com/.test(j)],
['no lluvia igual suspension',/La lluvia sola no suspende/.test(j)],
['OCR tesseract',/tesseract\.js@5/.test(j)&&/T\.recognize/.test(j)],
['CURP fecha edad',/curpInfo/.test(j)&&/dob/.test(j)&&/age/.test(j)],
['nombre desde CURP o INE',/nameFrom\(ct\)\|\|nameFrom\(it\)/.test(j)],
['lugar nacimiento OCR',/placeFrom/.test(j)],
['CURP completa no persistida',/curp:c\?c\.slice/.test(j)],
['mobile canvas reducido',/scale\(\.66\)/.test(c)&&/scale\(\.72\)/.test(c)],
['cache build 38-10',/38-10/.test(j)&&/caches\.keys/.test(j)],
['reduced motion',/prefers-reduced-motion/.test(c)&&/prefers-reduced-motion/.test(j)]
];let f=0;for(const [n,o] of tests){console.log(`${o?'OK':'FAIL'} - ${n}`);if(!o)f++}console.log(`\n${tests.length} pruebas FIX10; ${f} fallos.`);process.exit(f?1:0);