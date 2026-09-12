/* MatchOra MIT standings ordering, applied only to a hypothetical extra match. */
import { sortTallies } from '../vendor/matchora/standings.js';
export function simulate(teams,home,away,hg,ag){
  if(home===away||![hg,ag].every(n=>Number.isInteger(n)&&n>=0&&n<=40)||!teams[home]||!teams[away])return null;
  const rows=teams.map((t,i)=>({teamId:String(i),name:t.team,points:t.pts,played:t.jj,won:t.jg||0,drawn:t.je||0,lost:t.jp||0,goalsFor:t.gf,goalsAgainst:t.gc}));
  const h=rows[home],a=rows[away];h.played++;a.played++;h.goalsFor+=hg;h.goalsAgainst+=ag;a.goalsFor+=ag;a.goalsAgainst+=hg;
  h.points+=hg>ag?3:hg===ag?1:0;a.points+=ag>hg?3:hg===ag?1:0;
  return sortTallies(rows,[],{pointsWin:3,pointsDraw:1,pointsLoss:0,tiebreakers:['points','goal_difference','goals_for']});
}
function mount(){
  const teams=window.LJR_V20?.standings_veteranos_35,host=document.querySelector('#view-matchcenter');if(!teams?.length||!host||document.querySelector('#jr37Simulator'))return;
  const section=document.createElement('section');section.className='jr37-panel';section.id='jr37Simulator';
  section.innerHTML='<h3>¿Cómo se movería la tabla?</h3><p>Simula un partido adicional de Veteranos 35+. Supuesto: victoria 3 puntos, empate 1; desempates por diferencia y goles a favor. La clasificación oficial conserva sus datos.</p><form class="jr37-simulation-form"><label>Local<select name="home"></select></label><label>Goles local<input type="number" name="hg" min="0" max="40" step="1" required value="0"></label><label>Visitante<select name="away"></select></label><label>Goles visitante<input type="number" name="ag" min="0" max="40" step="1" required value="0"></label><button class="primary-btn" type="submit">Simular resultado</button></form><p role="status"></p><div class="jr37-table-scroll"></div>';
  host.appendChild(section);const form=section.querySelector('form'),message=section.querySelector('[role=status]'),out=section.querySelector('.jr37-table-scroll');
  ['home','away'].forEach((s,i)=>{teams.forEach((t,j)=>form.elements[s].add(new Option(t.team,String(j))));form.elements[s].value=String(i);});
  form.onsubmit=e=>{e.preventDefault();const rows=simulate(teams,Number(form.elements.home.value),Number(form.elements.away.value),Number(form.elements.hg.value),Number(form.elements.ag.value));
    if(!rows){message.textContent='Elige dos equipos distintos y marcadores de 0 a 40.';out.replaceChildren();return;}
    const table=document.createElement('table');table.innerHTML='<caption>Escenario hipotético · no oficial</caption><thead><tr><th>Pos.</th><th>Equipo</th><th>PJ</th><th>DG</th><th>Puntos</th></tr></thead>';const body=document.createElement('tbody');
    rows.forEach((r,i)=>{const tr=document.createElement('tr');[i+1,r.name,r.played,r.goalsFor-r.goalsAgainst,r.points].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td);});body.appendChild(tr);});table.appendChild(body);out.replaceChildren(table);message.textContent='Escenario calculado. Los empates completos conservan un orden de presentación; no asignan una clasificación oficial.';
  };
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();}
