/* V38 FIX28 — aliases/sedes observadas en programación pública. */
(function(){
'use strict';
function apply(){
 const r=window.LJR_FIELD_REGISTRY_V3822;if(!r?.fields)return false;
 const by=id=>r.fields.find(x=>x.id===id);
 const one=by('sur-1');if(one){one.aliases=[...new Set([...(one.aliases||[]),'Campo 1 (Empastado)','Campo 1 Empastado'])]}
 const sur2=by('sur-2');if(sur2)sur2.aliases=[...new Set([...(sur2.aliases||[]),'Campo 2'])];
 const sur3=by('sur-3');if(sur3)sur3.aliases=[...new Set([...(sur3.aliases||[]),'Campo 3'])];
 const c4=by('zapata-4');if(c4)c4.aliases=[...new Set([...(c4.aliases||[]),'Campo 4'])];
 if(!by('maravillas'))r.fields.push({
  id:'maravillas',name:'Campo / localidad Maravillas',
  aliases:['Maravillas','San Antonio de las Maravillas','DEP. MARAVILLAS'],
  community:'San Antonio de las Maravillas',
  latitude:20.58245,longitude:-100.89421,precision:'locality',weatherEligible:true,
  mapsQuery:'Campo de futbol San Antonio de las Maravillas, Santa Cruz de Juventino Rosas, Guanajuato',
  address:'San Antonio de las Maravillas, Santa Cruz de Juventino Rosas, Guanajuato',
  source:'https://mapcarta.com/es/31368886',
  sourceNote:'Referencia meteorológica de la localidad; no se presenta como pin exacto de la cancha.'
 });
 window.dispatchEvent(new CustomEvent('jr60:fields-ready'));
 return true;
}
let n=0;const t=setInterval(()=>{n++;if(apply()||n>40)clearInterval(t)},100);
})();
