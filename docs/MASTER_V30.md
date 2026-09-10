# MASTER V30.4

Correccion de estabilidad.

La causa del colapso visual no estaba ya en V30.3. La capa `v28-functional.js`
seguia siendo cargada desde `v27-intelligent.js`.

V28 contiene una rutina `fixPlayerCards()` que busca `.card, article, div`
con nombres de goleadores y reescribe `innerHTML`. Un contenedor grande puede
coincidir y terminar convertido en una sola tarjeta de jugador.

V30.4 elimina esa capa antigua:
- quita el loader de V28 de V27;
- elimina los assets V28;
- elimina V28 del cache del Service Worker;
- conserva V30 estable;
- restaura el enlace de la pagina en README.
