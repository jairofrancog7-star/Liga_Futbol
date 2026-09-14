const fs=require('fs'),assert=require('node:assert/strict'),vm=require('vm');
const read=p=>fs.readFileSync(p,'utf8');
const meta=JSON.parse(read('build-v38.json'));assert.equal(meta.build,'38-25');assert.equal(meta.androidVersionCode,6);
const index=read('index.html');for(const file of ['jr-v38-fix25.css','jr-v38-fix25.js','jr-ball-model-v38.js'])assert(index.includes(file));
for(const file of ['assets/jr-v38-fix25.js','assets/jr-v38-mobile-sync.js','assets/football-scene.js'])new vm.Script(read(file));
assert(read('android-wrapper/app/src/main/java/com/ligajuventinorosas/app/MainActivity.java').includes('38-25'));
// Exercise refresh with a stale page: one redirect, then stop instead of looping.
(async()=>{const saved=new Map();let redirects=0;const context={window:{},document:{documentElement:{dataset:{}},getElementById:()=>null,addEventListener(){}},fetch:async()=>({ok:true,json:async()=>({build:'38-26'})}),Date,URL,sessionStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},location:{href:'https://example.com/Liga_Futbol/#matches',replace:u=>{assert(u.includes('#matches'));redirects++}},addEventListener(){}};vm.runInNewContext(read('assets/jr-v38-mobile-sync.js'),context);await new Promise(r=>setImmediate(r));await context.window.JRMobileRefresh.check(true);assert.equal(redirects,1);console.log('FIX25: build, syntax, Android target and refresh anti-loop passed.');})().catch(e=>{console.error(e);process.exitCode=1});
