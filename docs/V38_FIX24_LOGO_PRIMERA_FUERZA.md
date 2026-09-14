# V38 FIX24 — Logo HD Primera Fuerza + sincronización

## Cambio visual
Se sustituye el emblema visual anterior de la categoría **Primera Fuerza**
por la imagen HD proporcionada por el usuario:

`assets/branding/primera-fuerza-hd.png`

La imagen se usa con `object-fit: contain` y fondo negro para conservar
la composición completa del escudo.

## Dónde se aplica
- Tarjeta/categoría Primera Fuerza en web PC.
- Vista Teams/categorías cuando se renderiza dinámicamente.
- Chrome móvil / PWA.
- APK Android, porque el WebView carga el mismo build web.

No sustituye logos de clubes/equipos individuales.

## Acumulativo
FIX24 conserva e incluye el motor FIX23:
- filtro por categoría + partido;
- un solo análisis de clima;
- lluvia 24/48 h previas;
- buscador de campo;
- avisos automáticos con la página/app activa.

## Versiones
- Web/PWA: 38-24
- APK: 1.2.2
- VersionCode: 5

## Git
El CMD principal es local: NO commit, NO push, NO main.
El publicador opcional usa doble confirmación PUBLICAR.
