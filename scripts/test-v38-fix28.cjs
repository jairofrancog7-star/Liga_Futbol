const fs=require('fs'),path=require('path');
const root=process.argv[2]||process.cwd();
let n=0,f=0;
const ok=(name,v)=>{n++;if(v)console.log('OK - '+name);else{f++;console.error('FAIL - '+name)}};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

const idx=read('index.html');
const js=read('assets/jr-v38-fix28.js');
const css=read('assets/jr-v38-fix28.css');
const fields=read('assets/jr-v38-fix28-fields.js');
const sync=read('scripts/sync_adminfut_public.py');
const build=JSON.parse(read('build-v38.json'));
const gradle=read('android-wrapper/app/build.gradle');
const main=read('android-wrapper/app/src/main/java/com/ligajuventinorosas/app/MainActivity.java');

ok('build 38-28',build.build==='38-28');
ok('web 38.28',build.webVersion==='38.28');
ok('APK 1.4.0',build.androidVersionName==='1.4.0');
ok('APK code 9',build.androidVersionCode===9);
ok('index conecta FIX28 CSS',idx.includes('jr-v38-fix28.css?v=38-28'));
ok('index conecta FIX28 JS',idx.includes('jr-v38-fix28.js?v=38-28'));
ok('index conecta campos FIX28',idx.includes('jr-v38-fix28-fields.js?v=38-28'));
ok('Android build 38-28',main.includes('38-28'));
ok('Android versionName',/versionName\s+'1\.4\.0'/.test(gradle));
ok('Android versionCode',/versionCode\s+9\b/.test(gradle));

ok('Veteranos 50 cuenta oficial',js.includes("Equipos:6,'Partidos Jugados':15,'Partidos Pendientes':30,Jugadores:109"));
ok('Primera cuenta oficial',js.includes("Equipos:11,'Partidos Jugados':20,'Partidos Pendientes':35,Jugadores:291"));
ok('Segunda cuenta oficial',js.includes("Equipos:12,'Partidos Jugados':23,'Partidos Pendientes':42,Jugadores:312"));
ok('Intermedia cuenta oficial',js.includes("Equipos:13,'Partidos Jugados':22,'Partidos Pendientes':54,Jugadores:332"));

ok('tab Resumen',js.includes('data-jr60tab="resumen"'));
ok('tab Partidos',js.includes('data-jr60tab="partidos"'));
ok('tab Equipos',js.includes('data-jr60tab="equipos"'));
ok('tab Jugadores',js.includes('data-jr60tab="jugadores"'));
ok('tab Posiciones',js.includes('data-jr60tab="posiciones"'));
ok('tab Goleo',js.includes('data-jr60tab="goleo"'));
ok('tab Tarjetas',js.includes('data-jr60tab="tarjetas"'));
ok('tab Castigados',js.includes('data-jr60tab="castigados"'));
ok('tab Reglamento',js.includes('data-jr60tab="reglamento"'));
ok('reglamento PDF existente',js.includes('Reglamento_Liga_Juventino_Rosas_2026_2027.pdf'));

ok('jugadores muestran goles',js.includes('p.goals'));
ok('jugadores muestran amarillas',js.includes('p.yellow'));
ok('jugadores muestran rojas',js.includes('p.red'));
ok('jugadores muestran sanción',js.includes('p.susp'));
ok('jugadores muestran uso en cédulas',js.includes('p.used')&&js.includes('cédulas'));
ok('partidos muestran campo',js.includes('m.field'));
ok('partidos Google Maps',js.includes('google.com/maps/search'));
ok('partidos abren clima',js.includes('data-jr60clima'));
ok('partidos muestran resultado',js.includes("status(m)==='Jugado'"));
ok('búsqueda jugadores/equipos',js.includes('jr60Search'));
ok('filtro por equipo',js.includes('jr60Team'));

const logoHits=(js.match(/res\.cloudinary\.com\/rdk7ndhb\/image\/upload\/v1\/logos\//g)||[]).length;
ok('40 logos oficiales embebidos como fallback',logoHits>=40);
ok('Abejas oficial',js.includes('Abejas_lxn6l9'));
ok('Tavera oficial',js.includes('TaveraFC_gpdbhg'));
ok('La Huerta oficial',js.includes('LaHuertaCuenda_bm4fxj'));
ok('sin logo falso BOCA',!js.match(/'BOCA JRS'\s*:/));
ok('sin logo falso Galacticos',!js.match(/'GALACTICOS'\s*:/));
ok('placeholder neutral para falta de escudo',js.includes('jr60-crest-fallback'));
ok('tablas muestran escudo de equipo',js.includes('jr60-table-team')&&js.includes("crest(x,'tiny')"));

ok('credencial digital existe',js.includes('jr60CredentialModal'));
ok('credencial abre OCR privado',js.includes('jr44OpenRegister'));
ok('credencial no publica CURP',js.includes('no se publica CURP, INE ni documentos'));
ok('capa pública no implementa OCR de documentos',!js.includes('Tesseract.recognize'));
ok('credencial usa diseño propio sin foto documental',css.includes('.jr60-credential'));

ok('ticker 100vw',css.includes('width:100vw!important'));
ok('ticker llega a borde izquierdo',css.includes('margin-left:calc(50% - 50vw)!important'));
ok('ticker llega a borde derecho',css.includes('margin-right:calc(50% - 50vw)!important'));
ok('ticker elimina radio lateral',css.includes('border-radius:0!important'));
ok('ticker móvil mantiene full bleed',css.includes('@media(max-width:760px)'));

ok('Campo 1 Empastado alias',fields.includes('Campo 1 (Empastado)'));
ok('Campo 2 alias',fields.includes("'Campo 2'"));
ok('Campo 3 alias',fields.includes("'Campo 3'"));
ok('Campo 4 alias',fields.includes("'Campo 4'"));
ok('Maravillas incluida',fields.includes("id:'maravillas'"));
ok('Maravillas es locality no exacta',fields.includes("precision:'locality'")&&fields.includes('no se presenta como pin exacto'));

ok('scraper AdminFut público',sync.includes("BASE='https://juventinorosasliga.com/'"));
ok('scraper cédulas',sync.includes('cedula-arbitral'));
ok('scraper goleo cards',sync.includes('player-card-small')&&sync.includes("['#','Jugador','Equipo','Goles']"));
ok('scraper tarjetas roja/amarilla',sync.includes("['Tipo','Jugador','Equipo','Total']"));
ok('scraper castigados',sync.includes("['Jugador','Equipo','Castigo','Pendientes']"));
ok('scraper uso jugador por cédulas',sync.includes("'player_usage'")&&sync.includes("'cedulas':0"));
ok('scraper corrige variante Veteranos',sync.includes('GUMERSINDO GRANADOS RAMIREZ S'));
ok('scraper fuerza logos oficiales conocidos',sync.includes('OFFICIAL_LOGO_PUBLIC_IDS'));
ok('scraper no asigna logo a BOCA',sync.includes("all_logo_urls.pop('BOCA JRS',None)"));
ok('scraper no asigna logo a GALACTICOS',sync.includes("all_logo_urls.pop('GALACTICOS',None)"));
ok('sync workflow 30 minutos',read('.github/workflows/sync-oficial-liga.yml').includes('7,37 * * * *'));
ok('sync full semanal',read('.github/workflows/sync-oficial-liga.yml').includes('23 18 * * 0'));
ok('sync respaldo URL',exists('data/official-seed-url.txt'));
ok('documentación FIX28',exists('docs/V38_FIX28.md'));

if(exists('data/official-live.json')){
  const d=JSON.parse(read('data/official-live.json'));
  ok('snapshot tiene Primera',!!d.categories?.['3']);
  ok('snapshot tiene Intermedia',!!d.categories?.['5']);
  ok('snapshot tiene Segunda',!!d.categories?.['4']);
  ok('snapshot tiene Veteranos50',!!d.categories?.['1']);
  const p=d.categories['3'];
  const pc=p.counts||p.dashboard?.counts||{};
  const pn=Number(p.public_player_count_scraped??p.public_names_reconstructed??Object.values(p.rosters||{}).flat().length);
  ok('Primera registrada >= 291 actual',Number(pc.Jugadores)>=291);
  ok('Primera nombres públicos coherentes',pn>0&&pn<=Number(pc.Jugadores));
  const i=d.categories['5'],ic=i.counts||i.dashboard?.counts||{};
  const inn=Number(i.public_player_count_scraped??i.public_names_reconstructed??Object.values(i.rosters||{}).flat().length);
  ok('Intermedia registrada >= nombres públicos',Number(ic.Jugadores)>=inn);
  ok('snapshot contiene fixtures',Array.isArray(p.fixtures)&&p.fixtures.length>0);
  ok('snapshot contiene rosters',p.rosters&&Object.keys(p.rosters).length>0);
  ok('snapshot contiene logos o mapa vacío explícito',d.team_logos&&typeof d.team_logos==='object');
}else{
  console.log('INFO - data/official-live.json se crea al ejecutar SINCRONIZAR_DATOS_OFICIALES.');
}

console.log(`\n${n} pruebas FIX28; ${f} fallos.`);
process.exit(f?1:0);
