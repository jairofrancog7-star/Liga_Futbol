# V38 FIX22 — móvil, APK, campos y clima por horario

## Sincronización PC / Chrome móvil / APK

- Build web: `38-22`
- Versión APK: `1.2.0`
- VersionCode: `3`
- La PWA abre con `?app=pwa&build=38-22`.
- El APK abre con `?app=android&build=38-22`.
- El navegador consulta `build-v38.json` sin caché cuando vuelve a primer plano.
- El service worker sigue desactivado y elimina caches antiguas para evitar que el teléfono se quede en una versión anterior.
- El APK limpia la caché **una sola vez por build**, no en cada arranque.
- El WebView del APK ahora admite `<input type=file>` de imagen para CURP/INE/OCR.

## Campos

El registro incluye los campos usados en la temporada y los que pidió la liga.

Las precisiones son explícitas:

- `exact`: pin de cancha verificado en datos abiertos.
- `complex`: pin del complejo deportivo, no del rectángulo exacto de una cancha interna.
- `near-field`: referencia oficial junto al campo.
- `locality`: centro/referencia de la comunidad; útil para meteorología, pero el pin del césped debe confirmarse.
- `pending`: no se encontró un pin responsable; la UI permite guardarlo en JR Control.
- `regional`: último recurso meteorológico, claramente etiquetado.

No se inventan coordenadas de campo.

## Clima

El dato programático usa **Open-Meteo**, no una API privada de Google Weather.

Google se usa para:

- abrir Google Maps;
- obtener ruta;
- abrir una búsqueda de clima en Google como comprobación visual.

El pronóstico se consulta alrededor del horario del partido:

- 1 hora antes;
- hora de inicio;
- hasta 2 horas después.

Patrón operativo pedido por la liga:

- Veteranos 35+ / 50+: sábado; horas `03:00`–`07:00` de sus boletines se interpretan como tarde (`15:00`–`19:00`).
- Primera Fuerza / Intermedia / Segunda Fuerza: domingo; se respetan horarios de mañana/mediodía.
- Si la temporada no trae fecha explícita, se muestra claramente **fecha estimada por patrón de la liga**.

## Decisión de juego

El sistema automatiza **alertas**, no una suspensión oficial irreversible:

1. Pronóstico.
2. Estado real del terreno.
3. Decisión oficial de la Liga.

Una tormenta, lluvia intensa o racha fuerte produce `ALERTA ALTA · revisión obligatoria`.
La Liga debe confirmar `Suspendido`.

Esto evita cancelar por un falso positivo del pronóstico o dejar jugar en un campo encharcado aunque ya haya dejado de llover.

## Avisos

- `Activar avisos`: Notification API cuando el navegador lo permita.
- `Compartir aviso`: Web Share en móvil.
- `Copiar aviso`: texto listo para WhatsApp/grupo.
- Para push masivo con la página cerrada hace falta un backend de Web Push/Supabase/Firebase. FIX22 no finge que existe.

## APK

El repositorio actual tenía APK 1.1 / code 2, construido como DEBUG. FIX22 actualiza a 1.2.0 / code 3.

El instalador intenta compilar:

1. `gradlew.bat` si existe.
2. `gradle` del PATH.
3. una distribución Gradle ya presente en `%USERPROFILE%\.gradle\wrapper\dists`.
4. si hay Android SDK + Java 17 pero no Gradle, puede descargar Gradle 8.10.2.

Si compila, reemplaza `downloads/Liga_Juventino_Rosas.apk`, recalcula SHA-256 y actualiza README_APK.

El APK sigue siendo DEBUG/prueba. Para distribución formal se necesita una RELEASE firmada; el keystore privado nunca debe subirse a GitHub.
