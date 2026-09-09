/* MASTER V21 - temporada actual + API de categorias/calendario para controles funcionales */
(function(){
  "use strict";
  const V20={"version":"MASTER V21","season":"2026","categories_order":["Veteranos 35+","Veteranos 50+","Primera Fuerza","Intermedia","Segunda Fuerza"],"current_status":{"Veteranos 35+":"FINAL","Veteranos 50+":"Torneo de Copa J6","Primera Fuerza":"Torneo de Copa J5","Intermedia":"Torneo de Copa J5","Segunda Fuerza":"Torneo de Copa J5"},"rosters":{"Veteranos 35+":[{"name":"C. de Gasca","logo":"deportivo-cg.webp"},{"name":"Juventus","logo":"juventus.webp"},{"name":"Cuenda","logo":null},{"name":"Pozos FC","logo":"pozos-fc.webp"},{"name":"Boavista","logo":"boavista-fc.webp"},{"name":"PSV","logo":"psv.webp"},{"name":"A. Santiago","logo":"atletico-santiago.webp"},{"name":"F. Tavera","logo":"franco-tavera-jr-veteranos.webp"},{"name":"América","logo":null},{"name":"Huracán","logo":null}],"Veteranos 50+":[{"name":"La Esperanza","logo":"la-esperanza-fc.webp"},{"name":"Dynamo","logo":null},{"name":"Boca JRS","logo":null},{"name":"Toros de Cuenda","logo":null},{"name":"Boavista","logo":"boavista-fc.webp"},{"name":"Manchester","logo":"manchester-united.webp"}],"Primera Fuerza":[{"name":"Hermanos","logo":"club-deportivo-hermanos.webp"},{"name":"San José FC","logo":"san-jose.webp"},{"name":"Linces","logo":"linces.webp"},{"name":"Juventus","logo":"juventus.webp"},{"name":"Napoli","logo":null},{"name":"Lobos CDG","logo":"lobos-cdg.webp"},{"name":"Terrícolas","logo":"terricolas-fc.webp"},{"name":"Galácticos","logo":"galacticos-pozos.webp"},{"name":"Franco FC","logo":"franco-fc.webp"},{"name":"Herreras FC","logo":"herrera-fc.webp"},{"name":"Abejas","logo":null}],"Intermedia":[{"name":"La Canchita Deportes","logo":"la-canchita.webp"},{"name":"Galeana","logo":"atletico-galeana.webp"},{"name":"Aldama FC","logo":"aldama.webp"},{"name":"Malvinas","logo":null},{"name":"Capibaras","logo":null},{"name":"La Cuadrilla","logo":null},{"name":"Mazacotes FC","logo":null},{"name":"Dep. Maravillas","logo":null},{"name":"Osasuna","logo":null},{"name":"San Antonio JRS","logo":"san-antonio-jr.webp"},{"name":"Populares","logo":null},{"name":"Promesas","logo":"promesas-fc-pozos.webp"},{"name":"La Huerta","logo":"la-huerta-cuenda.webp"}],"Segunda Fuerza":[{"name":"Tavera FC","logo":"tavera-fc.webp"},{"name":"Pachangas FC","logo":null},{"name":"San Juan FC","logo":null},{"name":"Tapatío","logo":null},{"name":"Dep. La Luz","logo":null},{"name":"San Julián","logo":"san-julian-fc.webp"},{"name":"Barza","logo":null},{"name":"San José JRS","logo":"san-jose-jr.webp"},{"name":"San Antonio FC","logo":null},{"name":"Célticos FC","logo":null},{"name":"Dep. Nopalero","logo":"deportivo-nopalero.webp"},{"name":"Dep. Zapata","logo":null}]},"standings_veteranos_35":[{"pos":1,"team":"C. de Gasca","jj":17,"g":13,"e":1,"p":3,"gf":54,"gc":17,"dg":37,"pts":40},{"pos":2,"team":"Juventus","jj":17,"g":10,"e":4,"p":3,"gf":47,"gc":27,"dg":20,"pts":34},{"pos":3,"team":"Cuenda","jj":17,"g":11,"e":0,"p":6,"gf":41,"gc":22,"dg":19,"pts":33},{"pos":4,"team":"Pozos FC","jj":17,"g":10,"e":2,"p":5,"gf":48,"gc":36,"dg":12,"pts":32},{"pos":5,"team":"Boavista","jj":17,"g":8,"e":3,"p":6,"gf":38,"gc":27,"dg":11,"pts":27},{"pos":6,"team":"PSV","jj":17,"g":9,"e":0,"p":8,"gf":49,"gc":40,"dg":9,"pts":27},{"pos":7,"team":"A. Santiago","jj":17,"g":7,"e":1,"p":9,"gf":36,"gc":57,"dg":-21,"pts":22},{"pos":8,"team":"F. Tavera","jj":17,"g":4,"e":2,"p":11,"gf":27,"gc":50,"dg":-23,"pts":14},{"pos":9,"team":"América","jj":17,"g":4,"e":1,"p":12,"gf":22,"gc":48,"dg":-26,"pts":13},{"pos":10,"team":"Huracán","jj":17,"g":2,"e":0,"p":15,"gf":19,"gc":69,"dg":-50,"pts":6}],"bulletins":[{"id":"actual-final-j6-j5","order":1,"label":"MÁS ACTUAL","color":"blue","title":"Final Veteranos 35+ · Copa J6/J5","subtitle":"Programación más reciente recibida","groups":[{"category":"Veteranos 35+","title":"FINAL","games":[{"home":"C. de Gasca","away":"Pozos FC","time":"04:00","field":"1"}]},{"category":"Veteranos 50+","title":"Torneo de Copa · J6","games":[{"home":"La Esperanza","away":"Dynamo","time":"05:00","field":"3"},{"home":"Boca JRS","away":"Toros de Cuenda","note":"Gana Toros de Cuenda"},{"home":"Boavista","away":"Manchester","time":"03:00","field":"3"}]},{"category":"Primera Fuerza","title":"Torneo de Copa · J5","games":[{"home":"Hermanos","away":"San José FC","time":"10:00","field":"3"},{"home":"Linces","away":"Juventus","time":"08:00","field":"3"},{"home":"Napoli","away":"Lobos CDG","time":"12:00","field":"Cerrito de Gasca"},{"home":"Terrícolas","away":"Galácticos","note":"Gana Terrícolas"},{"home":"Franco FC","away":"Herreras FC","time":"08:00","field":"Romerillo"},{"rest":"Abejas"}]},{"category":"Intermedia","title":"Torneo de Copa · J5","games":[{"home":"La Canchita Deportes","away":"Galeana","time":"10:00","field":"2"},{"home":"Aldama FC","away":"Malvinas","time":"10:00","field":"1"},{"home":"Capibaras","away":"La Cuadrilla","time":"10:00","field":"Tavera"},{"home":"Mazacotes FC","away":"Dep. Maravillas","time":"08:00","field":"1"},{"home":"Osasuna","away":"San Antonio JRS","time":"12:00","field":"1"},{"home":"Populares","away":"Promesas","time":"08:00","field":"Fraccionamiento"},{"rest":"La Huerta"}]},{"category":"Segunda Fuerza","title":"Torneo de Copa · J5","games":[{"home":"Tavera FC","away":"Pachangas FC","time":"12:00","field":"Tavera"},{"home":"San Juan FC","away":"Tapatío","time":"08:00","field":"San Juan"},{"home":"Dep. La Luz","away":"San Julián","time":"10:00","field":"San Julián"},{"home":"Barza","away":"San José JRS","time":"12:00","field":"San José"},{"home":"San Antonio FC","away":"Célticos FC","time":"10:00","field":"Fraccionamiento"},{"home":"Dep. Nopalero","away":"Dep. Zapata","time":"08:00","field":"2"}]}]},{"id":"semifinal-j5-j4","order":2,"label":"ANTERIOR","color":"green","title":"Semifinal Veteranos 35+ · Copa J5/J4","subtitle":"Boletín anterior","groups":[{"category":"Veteranos 35+","title":"SEMIFINAL","games":[{"home":"C. de Gasca","away":"Boavista","time":"03:00","field":"1"},{"home":"Juventus","away":"Pozos FC","time":"05:00","field":"1"}]},{"category":"Veteranos 50+","title":"Torneo de Copa · J5","games":[{"home":"La Esperanza","away":"Boca JRS","note":"Gana La Esperanza"},{"home":"Dynamo","away":"Manchester","time":"03:30","field":"2"},{"home":"Toros de Cuenda","away":"Boavista","time":"05:00","field":"2"}]},{"category":"Primera Fuerza","title":"Torneo de Copa · J4","games":[{"home":"Abejas","away":"Lobos CDG","time":"10:00","field":"Pozos"},{"home":"Galácticos","away":"Napoli","note":"Gana Napoli"},{"home":"Herreras FC","away":"Linces","time":"10:00","field":"1"},{"home":"Juventus","away":"Hermanos","time":"08:00","field":"Romerillo"},{"home":"San José FC","away":"Terrícolas","time":"12:00","field":"San José"},{"rest":"Franco FC"}]},{"category":"Intermedia","title":"Torneo de Copa · J4","games":[{"home":"La Cuadrilla","away":"La Huerta","time":"12:00","field":"2"},{"home":"Dep. Maravillas","away":"Aldama FC","time":"08:00","field":"Fraccionamiento"},{"home":"San Antonio JRS","away":"Populares","time":"10:00","field":"Romerillo"},{"home":"La Canchita Deportes","away":"Mazacotes FC","time":"08:00","field":"2"},{"home":"Galeana","away":"Promesas","time":"10:00","field":"4"},{"home":"Malvinas","away":"Capibaras","time":"10:00","field":"2"},{"rest":"Osasuna"}]},{"category":"Segunda Fuerza","title":"Torneo de Copa · J4","games":[{"home":"Pachangas FC","away":"Dep. Zapata","time":"08:00","field":"1"},{"home":"Célticos FC","away":"Dep. Nopalero","time":"12:00","field":"Fraccionamiento"},{"home":"San José JRS","away":"San Antonio FC","time":"10:00","field":"San José"},{"home":"San Julián","away":"Barza","time":"10:00","field":"Fraccionamiento"},{"home":"Tapatío","away":"Dep. La Luz","time":"12:00","field":"1"},{"home":"Tavera FC","away":"San Juan FC","time":"12:00","field":"S. Juan de la Cruz"}]}]},{"id":"cuartos-pendiente-j4-j3","order":3,"label":"ACTUALIZACIÓN","color":"red","title":"Cuartos de Final · actualización / Copa J4-J3","subtitle":"Publicación con partido pendiente de Veteranos 35+","groups":[{"category":"Veteranos 35+","title":"CUARTOS DE FINAL · PENDIENTE","games":[{"home":"Pozos FC","away":"PSV","time":"05:00","field":"1"}]},{"category":"Veteranos 50+","title":"Torneo de Copa · J4","games":[{"home":"Manchester","away":"Toros de Cuenda","time":"03:30","field":"1"},{"home":"Boca JRS","away":"Dynamo","note":"Gana Dynamo"},{"home":"Boavista","away":"La Esperanza","time":"05:00","field":"3"}]},{"category":"Primera Fuerza","title":"Torneo de Copa · J3","games":[{"home":"Lobos CDG","away":"Galácticos","note":"Gana Lobos CDG"},{"home":"Hermanos","away":"Herreras FC","time":"10:00","field":"1"},{"home":"Napoli","away":"San José FC","time":"12:00","field":"San José"},{"home":"Terrícolas","away":"Juventus","time":"10:00","field":"2"},{"home":"Franco FC","away":"Abejas","time":"10:00","field":"Pozos"},{"rest":"Linces"}]},{"category":"Intermedia","title":"Torneo de Copa · J3","games":[{"home":"Aldama FC","away":"La Canchita Deportes","time":"10:00","field":"Fraccionamiento"},{"home":"Capibaras","away":"Dep. Maravillas","time":"10:00","field":"Tavera"},{"home":"La Huerta","away":"Malvinas","time":"10:00","field":"3"},{"home":"Mazacotes FC","away":"Galeana","time":"08:00","field":"2"},{"home":"Osasuna","away":"La Cuadrilla","time":"09:00","field":"Rincón de Centeno"},{"home":"Promesas","away":"San Antonio JRS","time":"10:00","field":"Romerillo"},{"rest":"Populares"}]},{"category":"Segunda Fuerza","title":"Torneo de Copa · J3","games":[{"home":"San Juan FC","away":"Pachangas FC","time":"08:00","field":"1"},{"home":"Dep. La Luz","away":"Tavera FC","time":"08:00","field":"Fraccionamiento"},{"home":"Barza","away":"Tapatío","time":"12:00","field":"3"},{"home":"San Antonio FC","away":"San Julián","time":"10:00","field":"San Julián"},{"home":"Dep. Nopalero","away":"San José JRS","time":"12:00","field":"1"},{"home":"Dep. Zapata","away":"Célticos FC","time":"08:00","field":"3"}]}]},{"id":"cuartos-completos-j3","order":4,"label":"ANTERIOR","color":"red","title":"Cuartos completos · Copa J3","subtitle":"Programación completa de cuartos de Veteranos 35+","groups":[{"category":"Veteranos 35+","title":"CUARTOS DE FINAL","games":[{"home":"C. de Gasca","away":"F. Tavera","time":"03:30","field":"1"},{"home":"Juventus","away":"A. Santiago","time":"05:00","field":"2"},{"home":"Pozos FC","away":"PSV","time":"05:00","field":"3"},{"home":"Cuenda","away":"Boavista","time":"05:00","field":"1"}]},{"category":"Veteranos 50+","title":"Torneo de Copa · J3","games":[{"home":"La Esperanza","away":"Manchester","time":"03:30","field":"3"},{"home":"Boca JRS","away":"Boavista","note":"Gana Boavista"},{"home":"Toros de Cuenda","away":"Dynamo","time":"03:30","field":"2"}]},{"category":"Primera Fuerza","title":"Torneo de Copa · J3","games":[{"home":"Lobos CDG","away":"Galácticos","note":"Gana Lobos CDG"},{"home":"Hermanos","away":"Herreras FC","time":"10:00","field":"1"},{"home":"Napoli","away":"San José FC","time":"12:00","field":"San José"},{"home":"Terrícolas","away":"Juventus","time":"10:00","field":"2"},{"home":"Franco FC","away":"Abejas","time":"10:00","field":"Pozos"},{"rest":"Linces"}]},{"category":"Intermedia","title":"Torneo de Copa · J3","games":[{"home":"Aldama FC","away":"La Canchita Deportes","time":"10:00","field":"Fraccionamiento"},{"home":"Capibaras","away":"Dep. Maravillas","time":"10:00","field":"Tavera"},{"home":"La Huerta","away":"Malvinas","time":"10:00","field":"3"},{"home":"Mazacotes FC","away":"Galeana","time":"08:00","field":"2"},{"home":"Osasuna","away":"La Cuadrilla","time":"09:00","field":"Rincón de Centeno"},{"home":"Promesas","away":"San Antonio JRS","time":"10:00","field":"Romerillo"},{"rest":"Populares"}]},{"category":"Segunda Fuerza","title":"Torneo de Copa · J3","games":[{"home":"San Juan FC","away":"Pachangas FC","time":"08:00","field":"1"},{"home":"Dep. La Luz","away":"Tavera FC","time":"08:00","field":"Fraccionamiento"},{"home":"Barza","away":"Tapatío","time":"12:00","field":"3"},{"home":"San Antonio FC","away":"San Julián","time":"10:00","field":"San Julián"},{"home":"Dep. Nopalero","away":"San José JRS","time":"12:00","field":"1"},{"home":"Dep. Zapata","away":"Célticos FC","time":"08:00","field":"3"}]}]},{"id":"j17-revision","order":5,"label":"HISTÓRICO","color":"red","title":"Veteranos 35+ · J17 (revisión)","subtitle":"Programación regular previa a liguilla","groups":[{"category":"Veteranos 35+","title":"J17","games":[{"home":"Boavista","away":"Juventus","time":"05:00","field":"1"},{"home":"Pozos FC","away":"PSV","time":"05:00","field":"3"},{"home":"A. Santiago","away":"C. de Gasca","time":"05:00","field":"C. de Gasca"},{"home":"F. Tavera","away":"América","time":"05:00","field":"2"},{"home":"Cuenda","away":"Huracán","time":"05:00","field":"Fraccionamiento"}]},{"category":"Veteranos 50+","title":"AMISTOSO","games":[{"home":"La Esperanza","away":"Dynamo","time":"03:30","field":"1"},{"home":"Manchester","away":"Yustis","time":"03:30","field":"2"}]},{"category":"Amistosos","title":"AMISTOSOS","games":[{"home":"Franco FC","away":"Dep. Maravillas","time":"08:00","field":"1"},{"home":"Linces","away":"La Canchita Deportes","time":"10:00","field":"1"},{"home":"Barza","away":"Populares","time":"08:00","field":"2"},{"home":"Promesas","away":"Rambitos","time":"10:00","field":"2"},{"home":"Capibaras","away":"Malvinas","time":"12:00","field":"2"},{"home":"Mazacotes FC","away":"Dep. Zapata","time":"12:00","field":"1"},{"home":"Galeana","away":"Osasuna","time":"08:00","field":"3"},{"home":"Napoli","away":"Abejas","time":"10:00","field":"3"},{"home":"Hermanos","away":"San Antonio JRS","time":"10:00","field":"Romerillo"}]}]},{"id":"j16-update","order":6,"label":"HISTÓRICO","color":"green","title":"Veteranos 35+ · J16 (actualización)","subtitle":"Hoja corregida recibida","groups":[{"category":"Veteranos 35+","title":"J16","games":[{"home":"Pozos FC","away":"Juventus","time":"03:30","field":"2"},{"home":"A. Santiago","away":"América","time":"05:00","field":"1"},{"home":"Cuenda","away":"PSV","time":"03:30","field":"1"},{"home":"C. de Gasca","away":"Huracán","time":"05:00","field":"C. de Gasca"},{"home":"F. Tavera","away":"Boavista","time":"05:00","field":"2"}]},{"category":"Amistosos","title":"AMISTOSOS","games":[{"home":"La Cuadrilla","away":"Osasuna","time":"10:00","field":"Rincón de Centeno"},{"home":"San Antonio JRS","away":"Franco FC","time":"10:00","field":"Romerillo"},{"home":"Terrícolas","away":"La Huerta","time":"10:00","field":"1"},{"home":"Dep. Maravillas","away":"Mazacotes FC","time":"08:00","field":"1"},{"home":"Populares","away":"Malvinas","time":"08:00","field":"2"},{"home":"Lobos JRS","away":"Galeana","time":"10:00","field":"2"},{"home":"San Julián","away":"Tavera FC","time":"12:00","field":"1"},{"home":"San Juan FC","away":"Promesas","time":"08:00","field":"San Juan de la Cruz"},{"home":"Abejas","away":"Rambitos FC","time":"12:00","field":"2"}]}]},{"id":"j16-original","order":7,"label":"HISTÓRICO","color":"green","title":"Veteranos 35+ · J16 (publicación anterior)","subtitle":"Versión anterior de la hoja J16","groups":[{"category":"Veteranos 35+","title":"J16","games":[{"home":"Pozos FC","away":"Juventus","time":"03:30","field":"2"},{"home":"A. Santiago","away":"América","time":"05:00","field":"1"},{"home":"Cuenda","away":"PSV","time":"03:30","field":"1"},{"home":"C. de Gasca","away":"Huracán","time":"05:00","field":"C. de Gasca"},{"home":"F. Tavera","away":"Boavista","time":"05:00","field":"2"}]},{"category":"Amistosos","title":"AMISTOSOS","games":[{"home":"La Cuadrilla","away":"San Juan FC","time":"10:00","field":"San Juan de la Cruz"},{"home":"San Antonio JRS","away":"Franco FC","time":"10:00","field":"Romerillo"},{"home":"Mazacotes FC","away":"Osasuna","time":"08:00","field":"2"},{"home":"La Canchita Deportes","away":"Promesas","time":"10:00","field":"2"},{"home":"Populares","away":"Malvinas","time":"08:00","field":"1"},{"home":"Lobos JRS","away":"Galeana","time":"10:00","field":"1"},{"home":"Abejas","away":"Rambitos FC","time":"12:00","field":"1"}]}]},{"id":"j15","order":8,"label":"HISTÓRICO","color":"red","title":"Veteranos 35+ · J15","subtitle":"Jornada regular anterior","groups":[{"category":"Veteranos 35+","title":"J15","games":[{"home":"C. de Gasca","away":"PSV","time":"05:00","field":"Cerrito de Gasca"},{"home":"Huracán","away":"América","time":"05:00","field":"2"},{"home":"Pozos FC","away":"Boavista","time":"05:00","field":"1"},{"home":"A. Santiago","away":"F. Tavera","time":"03:30","field":"Cuenda"},{"home":"Cuenda","away":"Juventus","time":"05:00","field":"Cuenda"}]},{"category":"Veteranos 50+","title":"AMISTOSOS","games":[{"home":"La Esperanza","away":"Yustis","time":"03:30","field":"1"},{"home":"Manchester","away":"Cobras","time":"03:30","field":"2"}]},{"category":"Amistosos","title":"AMISTOSOS","games":[{"home":"La Cuadrilla","away":"Osasuna","time":"10:00","field":"Rincón de Centeno"},{"home":"Rambitos","away":"La Huerta","time":"10:00","field":"2"},{"home":"San Juan FC","away":"Innombrables","time":"10:00","field":"San Juan de la Cruz"},{"home":"Mazacotes FC","away":"Populares","time":"08:00","field":"1"},{"home":"San Antonio JRS","away":"Franco FC","time":"10:00","field":"Romerillo"},{"home":"Abejas","away":"Galeana","time":"10:00","field":"1"},{"home":"Barza","away":"Malvinas","time":"12:00","field":"1"},{"home":"Terrícolas","away":"Dep. Zapata","time":"08:00","field":"2"}]}]},{"id":"j1-copa","order":9,"label":"MÁS ANTIGUO","color":"blue","title":"Copa J1 · pendiente Veteranos 35+","subtitle":"Hoja más antigua de las recibidas para Copa","groups":[{"category":"Veteranos 35+","title":"PENDIENTE","games":[{"home":"América","away":"PSV","time":"05:00","field":"1"}]},{"category":"Veteranos 50+","title":"Torneo de Copa · J1","games":[{"home":"La Esperanza","away":"Dynamo","time":"05:00","field":"2"},{"home":"Boca JRS","away":"Toros de Cuenda","time":"03:30","field":"2"},{"home":"Boavista","away":"Manchester","time":"03:30","field":"1"}]},{"category":"Primera Fuerza","title":"Torneo de Copa · J1","games":[{"home":"Galácticos","away":"San José FC","note":"Gana San José"},{"home":"Lobos CDG","away":"Juventus","time":"08:00","field":"1"},{"home":"Hermanos","away":"Franco FC","time":"10:00","field":"Romerillo"},{"home":"Linces","away":"Abejas","time":"08:00","field":"Fraccionamiento"},{"home":"Napoli","away":"Herreras FC","time":"10:00","field":"2"},{"rest":"Terrícolas"}]},{"category":"Intermedia","title":"Torneo de Copa · J1","games":[{"home":"Aldama FC","away":"Galeana","time":"10:00","field":"4"},{"home":"Capibaras","away":"Mazacotes FC","time":"10:00","field":"Tavera"},{"home":"La Huerta","away":"La Canchita Deportes","time":"10:00","field":"Fraccionamiento"},{"home":"Osasuna","away":"Dep. Maravillas","time":"08:00","field":"4"},{"home":"Populares","away":"Malvinas","time":"08:00","field":"2"},{"home":"Promesas","away":"La Cuadrilla","time":"09:00","field":"Rincón de Centeno"},{"rest":"San Antonio JRS"}]},{"category":"Segunda Fuerza","title":"Torneo de Copa · J1","games":[{"home":"El Alto","away":"Pachangas FC","note":"Gana Pachangas"},{"home":"Barza","away":"San Juan FC","time":"12:00","field":"Fraccionamiento"},{"home":"San Antonio FC","away":"Tavera FC","time":"12:00","field":"4"},{"home":"Dep. Nopalero","away":"Tapatío","time":"12:00","field":"1"},{"home":"Dep. Zapata","away":"San Julián","time":"10:00","field":"1"},{"home":"Célticos FC","away":"San José JRS","time":"12:00","field":"2"}]}]}],"notes":["El Alto aparece solo en J1 y no forma parte del padrón vigente de Segunda Fuerza en J5.","Yustis, Cobras, Rambitos, Innombrables y Lobos JRS aparecen en amistosos/histórico y no se agregan al padrón vigente salvo que vuelvan a aparecer en una jornada oficial actual."]};
  window.LJR_V20=V20;
  const LOGOS={"C. de Gasca":"./assets/teams/deportivo-cg.webp","Juventus":"./assets/teams/juventus.webp","Pozos FC":"./assets/teams/pozos-fc.webp","Boavista":"./assets/teams/boavista-fc.webp","PSV":"./assets/teams/psv.webp","A. Santiago":"./assets/teams/atletico-santiago.webp","F. Tavera":"./assets/teams/franco-tavera-jr-veteranos.webp","La Esperanza":"./assets/teams/la-esperanza-fc.webp","Manchester":"./assets/teams/manchester-united.webp","Hermanos":"./assets/teams/club-deportivo-hermanos.webp","San José FC":"./assets/teams/san-jose.webp","Linces":"./assets/teams/linces.webp","Lobos CDG":"./assets/teams/lobos-cdg.webp","Terrícolas":"./assets/teams/terricolas-fc.webp","Galácticos":"./assets/teams/galacticos-pozos.webp","Franco FC":"./assets/teams/franco-fc.webp","Herreras FC":"./assets/teams/herrera-fc.webp","La Canchita Deportes":"./assets/teams/la-canchita.webp","Galeana":"./assets/teams/atletico-galeana.webp","Aldama FC":"./assets/teams/aldama.webp","San Antonio JRS":"./assets/teams/san-antonio-jr.webp","Promesas":"./assets/teams/promesas-fc-pozos.webp","La Huerta":"./assets/teams/la-huerta-cuenda.webp","Tavera FC":"./assets/teams/tavera-fc.webp","San Julián":"./assets/teams/san-julian-fc.webp","San José JRS":"./assets/teams/san-jose-jr.webp","Dep. Nopalero":"./assets/teams/deportivo-nopalero.webp"};
  const CATEGORY_LOGOS={
    "Veteranos 35+":"./assets/categories/veteranos-35.webp",
    "Veteranos 50+":"./assets/categories/veteranos-50.webp",
    "Primera Fuerza":"./assets/liga-logo.webp",
    "Intermedia":"./assets/categories/intermedia.webp",
    "Segunda Fuerza":"./assets/categories/segunda-fuerza.webp"
  };
  let selectedCategory="Veteranos 35+";
  let calendarCategory="Todas";

  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const currentNames=new Set(Object.values(V20.rosters).flat().map(t=>norm(t.name)));
  const initials=name=>name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  function logoFor(name){
    const direct=LOGOS[name]; if(direct) return direct;
    const found=Object.entries(LOGOS).find(([k])=>norm(k)===norm(name));
    return found?found[1]:null;
  }
  function logoHTML(team,cls=""){
    const src=logoFor(team);
    if(!src) return `<div class="v20-fallback ${cls}"><span>${esc(initials(team))}</span></div>`;
    const special=norm(team)==="juventus"?" v20-invert-on-dark":"";
    return `<img class="v20-logo-img ${cls}${special}" src="${src}" alt="Escudo de ${esc(team)}" loading="lazy" decoding="async">`;
  }
  function categoryCount(cat){return (V20.rosters[cat]||[]).length}

  function cleanOldDemoState(){
    try{
      const key="ljr-v12-state";
      const raw=localStorage.getItem(key);
      if(raw){
        const obj=JSON.parse(raw);
        if(Array.isArray(obj.teams)) obj.teams=obj.teams.filter(t=>currentNames.has(norm(t.name)));
        localStorage.setItem(key,JSON.stringify(obj));
      }
      localStorage.setItem("jrCategory",selectedCategory);
    }catch(e){}
    try{
      if(typeof state!=="undefined" && Array.isArray(state.teams)){
        state.teams=state.teams.filter(t=>currentNames.has(norm(t.name)));
      }
    }catch(e){}
  }

  function renderCategoryStrip(){
    return `<div class="v20-cat-grid">${V20.categories_order.map(cat=>`
      <button class="v20-cat-card ${cat===selectedCategory?'active':''}" data-v20-cat="${esc(cat)}">
        <div class="v20-cat-logo">${CATEGORY_LOGOS[cat]?`<img src="${CATEGORY_LOGOS[cat]}" alt="">`:''}</div>
        <div><b>${esc(cat)}</b><small>${categoryCount(cat)} equipos · ${esc(V20.current_status[cat])}</small></div>
      </button>`).join('')}</div>`;
  }

  function renderTeamsV20(){
    const grid=document.getElementById("teamsGrid"); if(!grid) return;
    const search=document.getElementById("teamSearch");
    const q=norm(search?.value||"");
    const teams=(V20.rosters[selectedCategory]||[]).filter(t=>!q||norm(t.name).includes(q));
    grid.innerHTML=teams.length?teams.map(t=>`
      <article class="card v20-team-card" data-v20-team="${esc(t.name)}">
        <div class="v20-team-logo-wrap">${logoHTML(t.name)}</div>
        <div class="v20-team-meta"><span class="v20-team-category">${esc(selectedCategory)}</span><h3>${esc(t.name)}</h3><small>${esc(V20.current_status[selectedCategory])}</small></div>
      </article>`).join(''):`<div class="empty"><div class="empty-title">Sin equipos</div>No hay coincidencias en ${esc(selectedCategory)}.</div>`;
    grid.querySelectorAll('[data-v20-team]').forEach(card=>card.onclick=()=>openTeam(card.dataset.v20Team,selectedCategory));
  }

  function openTeam(name,cat){
    if(typeof openModal!=="function") return;
    const logo=logoHTML(name,"modal");
    openModal("Equipo",`<div class="v20-team-modal"><div class="v20-modal-logo">${logo}</div><div><div class="eyebrow">${esc(cat)}</div><h2>${esc(name)}</h2><p style="color:var(--muted);margin-top:8px">Equipo vigente de la temporada actual.</p><div class="notice">${esc(V20.current_status[cat])}</div></div></div>`);
  }

  function installTeamView(){
    const search=document.getElementById("teamSearch"); if(!search) return;
    let panel=document.getElementById("v20CategoryPanel");
    if(!panel){
      panel=document.createElement("div"); panel.id="v20CategoryPanel"; panel.className="v20-category-panel";
      panel.innerHTML=`<div class="v20-panel-title"><div><div class="eyebrow">Temporada actual</div><h2>Equipos por categoría</h2></div><span class="v20-current">Solo equipos vigentes</span></div>${renderCategoryStrip()}`;
      search.parentNode.insertBefore(panel,search);
    }
    panel.querySelectorAll('[data-v20-cat]').forEach(btn=>btn.onclick=()=>{
      selectedCategory=btn.dataset.v20Cat;
      document.querySelectorAll('.categoryText').forEach(x=>x.textContent=selectedCategory);
      panel.innerHTML=`<div class="v20-panel-title"><div><div class="eyebrow">Temporada actual</div><h2>Equipos por categoría</h2></div><span class="v20-current">Solo equipos vigentes</span></div>${renderCategoryStrip()}`;
      installTeamView(); renderTeamsV20(); renderCurrentStandings();
    });
    search.oninput=renderTeamsV20;
    try{renderTeams=renderTeamsV20}catch(e){}
    renderTeamsV20();
  }

  function renderCurrentStandings(){
    try{
      if(selectedCategory!=="Veteranos 35+"){
        const full=document.getElementById("fullStandings");
        if(full) full.innerHTML=`<tr><td colspan="11"><div class="empty"><div class="empty-title">Tabla no recibida</div>La jornada actual está registrada, pero no voy a inventar puntos de ${esc(selectedCategory)}.</div></td></tr>`;
        return;
      }
      const rows=V20.standings_veteranos_35.map(r=>`<tr><td>${r.pos}</td><td><strong class="v20-table-team">${logoHTML(r.team,'small')}<span>${esc(r.team)}</span></strong></td><td>${r.jj}</td><td>${r.g}</td><td>${r.e}</td><td>${r.p}</td><td>${r.gf}</td><td>${r.gc}</td><td>${r.dg}</td><td>—</td><td class="pts">${r.pts}</td></tr>`).join('');
      const full=document.getElementById("fullStandings"); if(full) full.innerHTML=rows;
      const mini=document.getElementById("miniStandings"); if(mini) mini.innerHTML=V20.standings_veteranos_35.slice(0,4).map(r=>`<tr><td>${r.pos}</td><td><strong class="v20-table-team">${logoHTML(r.team,'small')}<span>${esc(r.team)}</span></strong></td><td>—</td><td class="pts">${r.pts}</td></tr>`).join('');
    }catch(e){}
  }

  function currentStatusCards(){
    return `<div class="v20-status-grid">${V20.categories_order.map(cat=>`<button class="v20-status-card" data-v20-status-cat="${esc(cat)}"><span>${esc(cat)}</span><b>${esc(V20.current_status[cat])}</b><small>${categoryCount(cat)} equipos</small></button>`).join('')}</div>`;
  }

  function gameRow(g){
    if(g.rest) return `<div class="v20-rest">DESCANSA: <b>${esc(g.rest)}</b></div>`;
    return `<div class="v20-game"><span class="v20-team-name">${esc(g.home)}</span><b>VS</b><span class="v20-team-name">${esc(g.away)}</span><span class="v20-time">${esc(g.time||'—')}</span><span class="v20-field">${esc(g.field||g.note||'—')}</span>${g.note?`<small>${esc(g.note)}</small>`:''}</div>`;
  }
  function groupCard(g){
    return `<section class="v20-sheet-group" data-v20-group-cat="${esc(g.category)}"><div class="v20-group-head"><span>${esc(g.category)}</span><b>${esc(g.title)}</b></div><div class="v20-game-head"><span>Local</span><span></span><span>Visitante</span><span>Hora</span><span>Campo / nota</span></div>${g.games.map(gameRow).join('')}</section>`;
  }
  function bulletinCard(b){
    const groups=b.groups.filter(g=>calendarCategory==="Todas"||g.category===calendarCategory||g.category==="Amistosos");
    if(!groups.length) return '';
    return `<article class="v20-calendar-sheet color-${b.color}"><div class="v20-sheet-head"><div><span class="v20-sheet-label">${esc(b.label)}</span><h3>${esc(b.title)}</h3><p>${esc(b.subtitle)}</p></div><span class="v20-sheet-order">#${b.order}</span></div>${groups.map(groupCard).join('')}</article>`;
  }
  function renderCalendarArchive(){
    const target=document.getElementById("v20CalendarArchive"); if(!target) return;
    target.innerHTML=`<div class="v20-calendar-toolbar"><div><div class="eyebrow">Calendario oficial</div><h2>Más actual → más antiguo</h2><p>Hojas reconstruidas con las programaciones que enviaste.</p></div><select id="v20CalendarFilter" class="search"><option>Todas</option>${V20.categories_order.map(c=>`<option ${c===calendarCategory?'selected':''}>${esc(c)}</option>`).join('')}</select></div>${V20.bulletins.sort((a,b)=>a.order-b.order).map(bulletinCard).join('')}`;
    const f=document.getElementById("v20CalendarFilter"); if(f) f.onchange=()=>{calendarCategory=f.value;renderCalendarArchive()};
  }

  function installCalendarViews(){
    ['view-matches','view-calendar'].forEach(id=>{
      const view=document.getElementById(id); if(!view) return;
      let host=view.querySelector('.v20-calendar-archive');
      if(!host){host=document.createElement('div');host.className='v20-calendar-archive';host.id=id==='view-calendar'?'v20CalendarArchive':'v20CalendarArchiveMatches';
        const anchor=view.querySelector('.toolbar')||view.firstElementChild;
        if(anchor&&anchor.nextSibling) view.insertBefore(host,anchor.nextSibling); else view.appendChild(host);
      }
    });
    const cal=document.getElementById('v20CalendarArchive');
    const matches=document.getElementById('v20CalendarArchiveMatches');
    if(cal) renderCalendarArchive();
    if(matches){matches.id='v20CalendarArchive';renderCalendarArchive();matches.id='v20CalendarArchiveMatches';}
  }

  function installHome(){
    const home=document.getElementById('view-home'); if(!home) return;
    let section=document.getElementById('v20CurrentSeason');
    if(!section){
      section=document.createElement('section');section.id='v20CurrentSeason';section.className='section';
      section.innerHTML=`<div class="section-title"><div><div class="eyebrow">Temporada actual</div><h2>Estado de la Liga</h2></div><button class="ghost-btn" data-view="calendar">Ver calendario completo</button></div>${currentStatusCards()}<div class="v20-final-card"><div><span class="live-pill">GRAN FINAL</span><h2>C. de Gasca <span>vs</span> Pozos FC</h2><p>Veteranos 35+ · 04:00 · Campo 1</p></div><div class="v20-final-logos"><div>${logoHTML('C. de Gasca')}</div><b>VS</b><div>${logoHTML('Pozos FC')}</div></div></div>`;
      const hero=home.querySelector('#v14CinematicHero');
      if(hero&&hero.nextSibling) home.insertBefore(section,hero.nextSibling); else home.prepend(section);
    }
    section.querySelectorAll('[data-v20-status-cat]').forEach(b=>b.onclick=()=>{selectedCategory=b.dataset.v20StatusCat;showViewSafe('teams')});
  }

  function showViewSafe(view){
    try{if(typeof showView==='function') showView(view); else document.querySelector(`[data-view="${view}"]`)?.click();}catch(e){}
  }

  function wireInfoButtons(){
    document.querySelectorAll('button').forEach(btn=>{
      const txt=norm(btn.textContent);
      if(txt.includes('informacion')){
        btn.onclick=()=>{
          if(typeof openModal==='function') openModal('Información de la temporada',`<div>${currentStatusCards()}<div class="notice" style="margin-top:14px">El calendario completo está disponible en Partidos y Calendario, ordenado de lo más actual a lo más antiguo.</div></div>`);
        };
      }
    });
  }

  function fixLabels(){
    const m={themeBtn:'Tema',globalSearchBtn:'Buscar',tvModeBtn:'TV'};Object.entries(m).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});
    document.querySelectorAll('[data-view="notifications"]').forEach(el=>el.textContent='Avisos');
    document.querySelectorAll('.bottom-nav [data-view="home"]').forEach(el=>el.textContent='Inicio');
    document.querySelectorAll('.bottom-nav [data-view="matches"]').forEach(el=>el.textContent='Partidos');
    document.querySelectorAll('.bottom-nav [data-view="table"]').forEach(el=>el.textContent='Tabla');
    document.querySelectorAll('.bottom-nav [data-view="stats"]').forEach(el=>el.textContent='Estadísticas');
    document.querySelectorAll('.bottom-nav [data-view="more"]').forEach(el=>el.textContent='Más');
    document.querySelectorAll('.categoryText').forEach(x=>x.textContent=selectedCategory);
  }


  /* ===== API PUBLICA V21 ===== */
  window.LJR_V20_API={
    data:V20,
    getCategory:()=>selectedCategory,
    getCalendarCategory:()=>calendarCategory,
    logoFor,
    logoHTML,
    showViewSafe,
    renderTeams:renderTeamsV20,
    renderStandings:renderCurrentStandings,
    setCalendarCategory(cat){
      calendarCategory=cat||"Todas";
      try{renderCalendarArchive()}catch(e){}
      return calendarCategory;
    },
    setCategory(cat){
      if(!V20.rosters[cat]) return false;
      selectedCategory=cat;
      calendarCategory=cat;
      try{
        if(typeof currentCategory!=="undefined") currentCategory=cat;
      }catch(e){}
      try{localStorage.setItem("jrCategory",cat)}catch(e){}
      document.querySelectorAll(".categoryText").forEach(x=>x.textContent=cat);
      document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("active",x.dataset.category===cat));
      document.querySelectorAll("[data-v20-cat]").forEach(x=>x.classList.toggle("active",x.dataset.v20Cat===cat));
      try{renderTeamsV20()}catch(e){}
      try{renderCurrentStandings()}catch(e){}
      return true;
    }
  };

  function boot(){
    cleanOldDemoState();
    installTeamView();
    renderCurrentStandings();
    installCalendarViews();
    installHome();
    wireInfoButtons();
    fixLabels();
    try{if(typeof renderTeams!=="undefined") renderTeams=renderTeamsV20}catch(e){}
    if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js?v=21',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
