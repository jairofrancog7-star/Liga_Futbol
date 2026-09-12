/* Football markings and formation coordinates from Campos (MIT).
 * Local editor by Liga JR; exported artwork is a tactical proposal. */
import { computePitchMarkings } from '../vendor/campos/pitch.js';
import formations from '../vendor/campos/formations.js';
const NS='http://www.w3.org/2000/svg',KEY='jr37-lineup-draft';
function svgEl(tag,attributes={}){const el=document.createElementNS(NS,tag);Object.entries(attributes).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
function pitch(){
  const svg=svgEl('svg',{viewBox:'-3 -3 74 111',role:'img','aria-label':'Propuesta de alineación sobre cancha de fútbol'});
  svg.appendChild(svgEl('rect',{x:-3,y:-3,width:74,height:111,fill:'#123d2a'}));
  const lines=svgEl('g',{stroke:'#bad4c4','stroke-width':.28,fill:'none'});
  computePitchMarkings('full','vertical').forEach(m=>{
    const attrs={};let tag=m.type;
    if(tag==='arc'){tag='path';const a=m.startAngle,b=m.endAngle;attrs.d=`M ${m.cx+m.r*Math.cos(a)} ${m.cy+m.r*Math.sin(a)} A ${m.r} ${m.r} 0 ${b-a>Math.PI?1:0} 1 ${m.cx+m.r*Math.cos(b)} ${m.cy+m.r*Math.sin(b)}`;}
    else ['x','y','width','height','x2','y2','cx','cy','r'].forEach(k=>{if(m[k]!==undefined)attrs[tag==='line'&&k==='x'?'x1':tag==='line'&&k==='y'?'y1':k]=m[k];});
    if(m.filled)attrs.fill='#bad4c4';if(m.thick)attrs['stroke-width']=.65;lines.appendChild(svgEl(tag,attrs));
  });svg.appendChild(lines);return svg;
}
function mount(){
  const host=document.querySelector('#view-matchcenter');if(!host||document.querySelector('#jr37Lineup'))return;
  const section=document.createElement('section');section.className='jr37-panel';section.id='jr37Lineup';
  section.innerHTML='<h3>Tu once, sobre la cancha</h3><p>Prepara una propuesta de alineación y descárgala. Puedes guardar un borrador en este dispositivo.</p><div class="jr37-lineup-layout"><div><label for="jr37Formation">Formación</label><select id="jr37Formation"></select><div id="jr37LineupNames"></div><div class="jr37-editor-actions"><button class="ghost-btn" id="jr37SaveLineup">Guardar borrador</button><button class="primary-btn" id="jr37ExportLineup">Descargar cancha SVG</button></div><p id="jr37LineupMessage" role="status"></p></div><div id="jr37LineupPitch"></div></div>';
  host.appendChild(section);const select=section.querySelector('select'),names=section.querySelector('#jr37LineupNames'),preview=section.querySelector('#jr37LineupPitch'),msg=section.querySelector('[role=status]');
  Object.keys(formations).forEach(k=>select.add(new Option(k.split('').join('-'),k)));
  let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
  select.value=Object.hasOwn(formations,saved?.formation)?saved.formation:'433';
  const inputs=Array.from({length:11},(_,i)=>{
    const label=document.createElement('label');label.textContent=String(i+1).padStart(2,'0');const input=document.createElement('input');input.type='text';input.maxLength=24;input.setAttribute('aria-label','Nombre del jugador '+(i+1));input.value=typeof saved?.names?.[i]==='string'?saved.names[i].slice(0,24):'';input.placeholder='Jugador '+(i+1);input.addEventListener('input',render);label.appendChild(input);names.appendChild(label);return input;
  });
  function render(){
    const svg=pitch();formations[select.value].forEach((p,i)=>{
      const x=p.y*.68,y=(100-p.x)*1.05,g=svgEl('g',{transform:`translate(${x} ${y})`});
      g.appendChild(svgEl('circle',{r:2.3,fill:i?'#43e591':'#e6be69',stroke:'#091f14','stroke-width':.3}));
      const number=svgEl('text',{'text-anchor':'middle','dominant-baseline':'central',fill:'#092016','font-family':'Arial,sans-serif','font-size':2.4,'font-weight':700});number.textContent=String(i+1);g.appendChild(number);
      const label=svgEl('text',{y:4.4,'text-anchor':'middle',fill:'#ffffff','font-family':'Arial,sans-serif','font-size':2.1,'paint-order':'stroke',stroke:'#123d2a','stroke-width':.7});
      const name=inputs[i].value.trim()||p.code;label.textContent=name.length>14?name.slice(0,13)+'…':name;g.appendChild(label);svg.appendChild(g);
    });preview.replaceChildren(svg);
  }
  select.onchange=render;
  section.querySelector('#jr37SaveLineup').onclick=()=>{try{localStorage.setItem(KEY,JSON.stringify({formation:select.value,names:inputs.map(x=>x.value)}));msg.textContent='Borrador guardado en este dispositivo.';}catch{msg.textContent='No se pudo guardar. Descarga la cancha para conservarla.';}};
  section.querySelector('#jr37ExportLineup').onclick=()=>{const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(preview.firstChild)],{type:'image/svg+xml;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='liga-jr-alineacion-'+select.value+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);msg.textContent='Cancha descargada. Es una propuesta; no modifica la alineación oficial.';};render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
