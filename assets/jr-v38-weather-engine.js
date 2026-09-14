/* V38 FIX23 — motor inteligente meteorológico explicable.
   UMD: usable in browser and Node tests. No external AI key required. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.JR55WeatherEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;

  function terrainEstimate(p24,p48){
    const a=num(p24?.precipTotal), b=num(p48?.precipTotal);
    if(a>=18||b>=30)return {level:'very-wet',label:'Muy saturado probable',detail:'La lluvia acumulada de las 24–48 h previas puede dejar zonas pesadas o encharcadas.'};
    if(a>=10||b>=18)return {level:'wet',label:'Pesado/húmedo probable',detail:'Hay acumulado suficiente para que el drenaje y la revisión física del campo sean importantes.'};
    if(a>=4||b>=8)return {level:'damp',label:'Humedad moderada probable',detail:'Hubo o se prevé lluvia previa; conviene revisar zonas blandas antes de autorizar.'};
    return {level:'dry',label:'Bajo impacto de lluvia previa',detail:'El acumulado de las 24–48 h previas es bajo según la referencia meteorológica.'};
  }

  function verdictFor(probability){
    const p=clamp(Math.round(num(probability)),0,100);
    if(p>=80)return {key:'yes',label:'ALTA PROBABILIDAD DE JUGAR',short:'SÍ · MUY PROBABLE',tone:'good'};
    if(p>=65)return {key:'likely',label:'PROBABLEMENTE SE JUEGA',short:'SÍ · PROBABLE',tone:'good'};
    if(p>=45)return {key:'review',label:'REVISAR CAMPO · POR CONFIRMAR',short:'REVISAR',tone:'watch'};
    return {key:'risk',label:'ALTO RIESGO DE NO JUGAR',short:'NO · ALTO RIESGO',tone:'high'};
  }

  function confidenceFor(precision,hours){
    let c=92;
    const p=String(precision||'regional');
    if(p==='exact'||p==='admin-pin')c=96;
    else if(p==='complex'||p==='near-field')c=88;
    else if(p==='locality')c=78;
    else if(p==='regional')c=64;
    else if(p==='pending')c=55;
    const total=num(hours?.hours);
    if(total<3)c-=15;
    return clamp(Math.round(c),35,98);
  }

  function scorePlayability(input){
    const m=input?.match||null;
    const p24=input?.prior24||{};
    const p48=input?.prior48||{};
    const precision=input?.precision||'regional';
    if(!m)return {
      probability:null,
      confidence:confidenceFor(precision,p48),
      verdict:{key:'na',label:'SIN DATOS SUFICIENTES',short:'SIN DATOS',tone:'na'},
      terrain:terrainEstimate(p24,p48),
      reasons:['No hay datos meteorológicos suficientes para el horario seleccionado.']
    };

    let score=96;
    const reasons=[];

    const code=num(m.code);
    const gust=num(m.gustMax);
    const rainMax=num(m.rainMax);
    const precipMax=num(m.precipMax);
    const prob=num(m.probMax);
    const p24sum=num(p24.precipTotal);
    const p48sum=num(p48.precipTotal);

    if(code>=95){score-=42;reasons.push('Tormenta eléctrica prevista cerca del horario.');}
    else if(code>=80){score-=10;reasons.push('Tiempo inestable cerca del horario.');}

    if(rainMax>=8){score-=35;reasons.push('Lluvia horaria fuerte prevista durante la ventana del partido.');}
    else if(rainMax>=2.5){score-=25;reasons.push('Lluvia moderada prevista durante la ventana del partido.');}
    else if(rainMax>=1){score-=13;reasons.push('Lluvia ligera prevista durante la ventana del partido.');}

    if(prob>=85){score-=16;reasons.push('Probabilidad de precipitación muy alta a la hora del partido.');}
    else if(prob>=65){score-=10;reasons.push('Probabilidad de precipitación elevada a la hora del partido.');}
    else if(prob>=45){score-=5;reasons.push('Existe posibilidad de precipitación a la hora del partido.');}

    if(gust>=70){score-=24;reasons.push('Rachas de viento fuertes.');}
    else if(gust>=50){score-=10;reasons.push('Rachas de viento a vigilar.');}

    if(p48sum>=30){score-=31;reasons.push('Acumulado muy alto en las 48 h previas: posible saturación del terreno.');}
    else if(p48sum>=18){score-=23;reasons.push('Acumulado alto en las 48 h previas.');}
    else if(p48sum>=8){score-=13;reasons.push('Lluvia relevante en las 48 h previas.');}
    else if(p48sum>=3){score-=6;reasons.push('Algo de lluvia en las 48 h previas.');}

    if(p24sum>=18){score-=18;reasons.push('Mucha lluvia en las 24 h inmediatamente previas.');}
    else if(p24sum>=10){score-=12;reasons.push('Lluvia importante en las 24 h previas.');}
    else if(p24sum>=4){score-=6;reasons.push('Lluvia moderada en las 24 h previas.');}

    // Precipitación máxima incluye lluvia+chubascos; pequeña corrección si no apareció en rain.
    if(precipMax>=5 && rainMax<2.5){score-=6;reasons.push('Precipitación total relevante cerca del horario.');}

    score=clamp(Math.round(score),5,98);
    const terrain=terrainEstimate(p24,p48);
    const verdict=verdictFor(score);
    if(!reasons.length)reasons.push('No se detectan señales meteorológicas fuertes ni acumulados importantes en las 48 h previas.');

    return {
      probability:score,
      confidence:confidenceFor(precision,p48),
      verdict,
      terrain,
      reasons
    };
  }

  function signature(result){
    if(!result)return 'na';
    return [result.verdict?.key||'na',result.probability??'na',result.terrain?.level||'na'].join('|');
  }

  return {
    clamp,
    terrainEstimate,
    verdictFor,
    confidenceFor,
    scorePlayability,
    signature
  };
});
