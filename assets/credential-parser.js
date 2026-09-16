/* Local OCR field extraction. Never validates identity or infers missing club/position. */
(function(root){
'use strict';
function date(y,m,d){const n=new Date(Date.UTC(+y,+m-1,+d));return n.getUTCFullYear()===+y&&n.getUTCMonth()===+m-1&&n.getUTCDate()===+d?`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`:''}
function age(birth,now=new Date()){if(!/^\d{4}-\d{2}-\d{2}$/.test(birth||''))return '';const [y,m,d]=birth.split('-').map(Number);if(!date(y,m,d))return '';const a=now.getFullYear()-y-(now.getMonth()+1<m||(now.getMonth()+1===m&&now.getDate()<d)?1:0);return a>=0&&a<=120?String(a):''}
function parse(raw){
 const lines=String(raw||'').normalize('NFC').split(/\r?\n/).map(s=>s.trim()).filter(Boolean),upper=lines.join('\n').toUpperCase();
 const curp=(upper.match(/\b[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z\d]\d\b/)||[])[0]||'';
 const boundary=/^(DOMICILIO|CURP|CLAVE|FECHA|SEXO|EDAD|EQUIPO|POSICI[ÓO]N|ENTIDAD|NACIONALIDAD|DATOS|REGISTRO|VIGENCIA|A[ÑN]O|EMISI[ÓO]N|ESTADO|MUNICIPIO|CIUDAD|C[ÓO]DIGO)/i;
 function field(rx){const i=lines.findIndex(s=>rx.test(s));if(i<0)return '';const own=lines[i].replace(rx,'').replace(/^\s*[:\-]\s*/,'').trim();return own||(!boundary.test(lines[i+1]||'')?lines[i+1]||'':'')}
 let name='';const ni=lines.findIndex(s=>/^NOMBRE(?:\s*\(?S\)?)?\b/i.test(s));if(ni>=0){const first=lines[ni].replace(/^NOMBRE(?:\s*\(?S\)?)?\s*:?\s*/i,'');name=first||lines.slice(ni+1,ni+4).filter((s,i,a)=>!a.slice(0,i+1).some(x=>boundary.test(x))).join(' ')}
 let birth='';const marked=upper.match(/FECHA\s+DE\s+NACIMIENTO\s*[:\s]*?(\d{2})[\/ .-](\d{2})[\/ .-](\d{4})/);if(marked)birth=date(marked[3],marked[2],marked[1]);
 if(!birth&&curp){const y=(/\d/.test(curp[16])?1900:2000)+Number(curp.slice(4,6));birth=date(y,curp.slice(6,8),curp.slice(8,10))}
 let city=field(/^(?:CIUDAD|MUNICIPIO)(?:\s+DE\s+RESIDENCIA)?\s*:?\s*/i);
 if(!city){const di=lines.findIndex(s=>/^DOMICILIO\b/i.test(s));if(di>=0){const address=[];for(const l of lines.slice(di+1,di+5)){if(boundary.test(l))break;address.push(l)}const last=address.at(-1)||'';if(/,\s*[A-ZÁÉÍÓÚ. ]{2,}$/i.test(last))city=last.replace(/\b\d{5}\b/g,'').trim()}}
 return {name:name.replace(/\s+/g,' ').trim(),curp,birth,age:age(birth),city,team:field(/^EQUIPO\s*:?\s*/i),position:field(/^POSICI[ÓO]N\s*:?\s*/i)};
}
const api={parse,age};if(typeof module==='object'&&module.exports)module.exports=api;else root.JRCredentialParser=api;
})(typeof window!=='undefined'?window:globalThis);
