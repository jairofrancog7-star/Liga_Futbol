const fs = require("fs");
const path = require("path");

const root = process.argv[2] || process.cwd();
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const exists = p => fs.existsSync(path.join(root, p));
const size = p => exists(p) ? fs.statSync(path.join(root, p)).size : 0;

function safeRead(p){
  try{return read(p)}catch(_){return ""}
}

const idx = safeRead("index.html");
const scene = safeRead("assets/football-scene.js");
const css = safeRead("assets/jr-v38-soccer-refresh.css");
const js = safeRead("assets/jr-v38-soccer-refresh.js");

const videos = [
  "assets/motion/v38-soccer-hero.mp4",
  "assets/motion/v38-soccer-matchday.mp4",
  "assets/motion/v38-soccer-fields-rain.mp4",
  "assets/motion/v38-soccer-teams.mp4",
  "assets/motion/v38-soccer-liguilla.mp4",
  "assets/motion/v38-soccer-stats.mp4"
];

const sceneConnected =
  /(?:\.\/)?assets\/football-scene\.js(?:\?[^"'<> ]*)?/.test(idx);

const scenePresent =
  scene.length > 1000 &&
  (
    /WebGLRenderer/.test(scene) ||
    /JRBallModel/.test(scene) ||
    /makeBall\s*\(/.test(scene) ||
    /jrAstraFootballScene/.test(scene) ||
    /football[-_ ]?scene/i.test(scene)
  );

const tests = [
  ["index.html existe", exists("index.html")],
  ["football-scene conectado sin exigir version V34", sceneConnected],
  ["football-scene implementa escena actual", scenePresent],
  ["refresh CSS conectado", /jr-v38-soccer-refresh\.css\?v=38\.3/.test(idx)],
  ["refresh JS conectado", /jr-v38-soccer-refresh\.js\?v=38\.3/.test(idx)],
  ["refresh CSS existe", css.length > 1000],
  ["refresh JS existe", js.length > 1000],
  ["hero Higgsfield existe", size(videos[0]) > 100000],
  ["matchday Higgsfield existe", size(videos[1]) > 100000],
  ["campos Higgsfield existe", size(videos[2]) > 100000],
  ["equipos Higgsfield existe", size(videos[3]) > 100000],
  ["liguilla Higgsfield existe", size(videos[4]) > 100000],
  ["estadisticas Higgsfield existe", size(videos[5]) > 100000],
  ["hero V14 existe", /id=["']v14CinematicHero["']/.test(idx)],
  ["solo un hero primario mediante CSS", /#v12CinematicHero\s*\{display:none!important\}/.test(css)],
  ["reduced motion soportado", /prefers-reduced-motion/.test(css) && /prefers-reduced-motion/.test(js)],
  ["ahorro de datos soportado", /saveData/.test(js)],
  ["videos pausables por viewport", /IntersectionObserver/.test(js)],
  ["videos pausables con pestaña oculta", /visibilitychange/.test(js) && /document\.hidden/.test(js)],
  ["clima separado de terreno y decision", /Clima ≠ terreno ≠ decisión oficial/.test(js)],
  ["estado de campo separado", /Estado del terreno/.test(js)],
  ["decision oficial separada", /Decisión oficial/.test(js)],
  ["navegacion Campos integrada", /data-view="fields"/.test(js)],
  ["sin dependencia de Codex", !/codex/i.test(js)]
];

let fail = 0;
for(const [name, ok] of tests){
  console.log(`${ok ? "OK" : "FAIL"} - ${name}`);
  if(!ok) fail++;
}
console.log(`\n${tests.length} pruebas V38; ${fail} fallos.`);
process.exit(fail ? 1 : 0);
