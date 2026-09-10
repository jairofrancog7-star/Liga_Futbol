
const fs=require("fs");
const path=require("path");
const root=process.argv[2]||process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const idx=read("index.html");
const v31=read("assets/v31-stable.js");
const manifest=JSON.parse(read("manifest.webmanifest").replace(/^\uFEFF/,""));
const exp=read("assets/jr-experience.js");
const scene=read("assets/football-scene.js");

const a=v31.indexOf("function installObservers()");
const b=v31.indexOf("function replacePublicCopy()");
const observerBlock=(a>=0&&b>a)?v31.slice(a,b):"MutationObserver";

const tests=[
 ["jr-diseno conectado",/jr-diseno\.css\?v=34-1/.test(idx)],
 ["jr-experience CSS conectado",/jr-experience\.css\?v=34-1/.test(idx)],
 ["jr-experience JS conectado",/jr-experience\.js\?v=34-1/.test(idx)],
 ["football-scene conectado",/football-scene\.js\?v=34-1/.test(idx)],
 ["reglamento existe",exists("docs/Reglamento_Liga_Juventino_Rosas_2026-2027.pdf")],
 ["texto portada actualizado",idx.includes("El fútbol de Juventino Rosas, en un solo lugar.")],
 ["Match Center corregido",v31.includes("view === 'match' ? 'matchcenter' : view")],
 ["observer function existe",a>=0],
 ["observer global eliminado",!observerBlock.includes("MutationObserver")],
 ["protección logos V32.1",v31.includes("MASTER V32.1 DESACTIVA LOGOS LEGACY END")],
 ["simulador presente",exp.includes("function simulate()")],
 ["pizarra presente",exp.includes("function openTactics()")],
 ["exportar PNG",exp.includes('toDataURL("image/png")')],
 ["guardado local",exp.includes("jr34Tactics")],
 ["instalación PWA",exp.includes("beforeinstallprompt")],
 ["iOS standalone",exp.includes("navigator.standalone")],
 ["reglamento público enlazado",exp.includes("Reglamento_Liga_Juventino_Rosas_2026-2027.pdf")],
 ["escena ligera presente",scene.includes("jrAstraFootballScene")],
 ["manifest standalone",String(manifest.display).toLowerCase()==="standalone"],
 ["Android wrapper existe",exists("android-wrapper/app/src/main/java/com/ligajuventinorosas/app/MainActivity.java")]
];
let fail=0;
for(const [name,ok] of tests){
  console.log(`${ok?"OK":"FAIL"} - ${name}`);
  if(!ok)fail++;
}
console.log(`\n${tests.length} pruebas; ${fail} fallos.`);
process.exit(fail?1:0);
