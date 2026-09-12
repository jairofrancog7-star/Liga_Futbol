# V37 · Fútbol, clima y estado de campos

Base: `2631d38925b4f85e8947e90cabc43d2108b75410` (V36.26).

## Cambios

- Encabezado principal: FÚTBOL / QUE SE SIENTE / EN VIVO. Contorno blanco transparente, verde y blanco. Eliminado el rótulo secundario duplicado.
- Balones originales con geometría esférica de 12 pentágonos y 20 hexágonos, costuras y ribete verde o dorado. Las órbitas y el margen de animación se consideran al ajustar la cámara. Si WebGL falla, queda un balón en Canvas 2D.
- Marco dorado con luz que recorre el borde y franja de letras en movimiento. Respeta reducir movimiento.
- Dirección editorial inspirada en Emirates: titulares grandes, dos escenas diferenciadas, entrada suave de textos y acercamiento moderado del video existente. Se conservan los contenidos de la liga.
- Clima regional por hora, probabilidad de precipitación, milímetros, viento, ráfagas y códigos de tormenta. Caché 30 minutos; descarte tras 6 horas. Los valores ausentes aparecen como “Sin dato”.
- 14 campos: Sur 1, 2 y 3; Emiliano Zapata 4; Cerrito de Gasca; Tavera; San Juan de la Cruz; Santiago de Cuenda; San Antonio de Romerillo; Fraccionamiento; Pozos; Rincón de Centeno; San José; San Julián.
- Reportes públicos independientes del clima. Un reporte con más de 12 horas vuelve a “Sin revisión”, mostrando su último estado y fecha.
- JR Control permite preparar reportes del terreno y estados programado, por confirmar, retrasado o suspendido de los partidos. La fecha completa se introduce explícitamente; no se convierte “04:00” automáticamente en un partido de hoy.
- La programación actual muestra el estado actual del campo y el estado del partido, cuando está publicado. Los boletines históricos no reciben el estado del terreno de hoy.
- Frente a frente descriptivo de Veteranos 35+, basado en la tabla ya registrada; sin inventar probabilidades de victoria ni datos de otras categorías.
- Soccer Tactics Studio integrado como herramienta independiente y descargada sólo al abrirla. La pizarra 2D anterior sigue disponible.

- Calendario .ics de partidos programados/retrasados con fecha completa, con zona horaria correcta y nombres escapados.
- Campos: cancha reglada en SVG y cuatro formaciones (4-3-3, 4-4-2, 4-2-3-1, 3-5-2), edición de once nombres, borrador y descarga de la propuesta.
- MatchOra: ordenación de una tabla hipotética tras simular un partido adicional. Usa supuestos explícitos 3/1/0 y diferencia/goles; no declara clasificación matemática ni cambia resultados oficiales.

## Publicación de reportes

1. Abrir JR Control y elegir el campo o partido.
2. Guardar borrador. Esto sólo afecta este navegador y no cambia el reporte público.
3. Descargar `field-status-v37.json`.
4. Revisar su contenido y sustituir `data/field-status-v37.json` en GitHub.
5. Guardar el cambio y esperar a que GitHub Pages termine de publicar.

Este flujo usa el control de escritura de GitHub. No se presentan botones de administrador de la demo como autenticación real. Para editar desde el celular y publicar directamente sin GitHub hace falta un backend autenticado; no está conectado en esta versión.

## Pronóstico y ubicación

Se consulta Open-Meteo para el centro de Santa Cruz de Juventino Rosas (20.64337, -100.99286), localizado mediante su servicio de geocodificación. No se afirma que sea la ubicación exacta de cada campo. Los accesos a Maps son búsquedas por nombre, no coordenadas verificadas.

La API pública gratuita de Open-Meteo exige uso no comercial y atribución. Antes de activar anuncios o patrocinio publicitario real, usar un plan que lo permita o un proveedor compatible, por ejemplo MET Norway mediante una integración que cumpla su identificación y caché. No se contrató ningún servicio.

Nunca se suspende automáticamente un partido porque aumente la lluvia prevista. El estado de campo y el estado de partido son registros separados.

## Código y licencias

- `assets/jr-ball-model-v37.js`, `assets/jr-weather-fields-v37.js`, `assets/jr-experience-v37.js` y `assets/jr-v37.css`: implementación propia para la liga.
- Soccer Tactics Studio: https://github.com/in-c0/soccer-tactics-studio, revisión `e11c94762654428eb0410e38aa6a69dee298a012`, MIT, copyright 2026 in-c0. Fuente adaptada en `tools/tactics-3d-source/`; distribución en `tools/tactics-3d/`. Se conservan LICENSE y licencia de Three.js. Adaptaciones: acceso de regreso, color de liga, varios rótulos en español, aviso cuando WebGL 2 no está disponible, menor resolución y pausa al ocultar la pestaña. Algunos controles avanzados conservan el inglés del original.
- Emirates Sport Club: https://github.com/tahsinmert/emirates-sport-club, revisión `42e80eda19d5735b4a6921fccc0c30aa9795c62a`, MIT. Referencia de composición y animación; adaptación propia al HTML existente. Aviso conservado en `docs/licenses/EMIRATES-MIT.txt`. No se copiaron sus videos ni su marca.
- Pitchverse: https://github.com/roni-altshuler/soccer_predictor. Referencia de comparaciones y claridad estadística. No se incorporó su modelo entrenado ni sus datos; LICENSE excluye esos derechos.
- R3F Scroll Rig no se cargó: necesita React Three Fiber, mientras esta aplicación usa JavaScript directo. Awwwards 3D es una colección de plantillas/instrucciones para crear escenas; no constituye una función futbolística para activar con una etiqueta script.

- World Cup Dashboard: https://github.com/zehan12/world-cup-2026-dashboard, revisión `18664c4a2393a6ca8959e03cfba3d4d59bb57d27`. Se adapta `calendar-helpers.ts` a partidos municipales, escapado de saltos de línea y plegado UTF-8. LICENSE conserva el copyright que figura en el archivo: Steven Hatch, 2026. El README original nombra a otro autor; no se modifica el aviso legal.
- Campos: https://github.com/withqwerty/campos, revisión `54bedb1d58bd09673cebda393720c4e19bcb387e`. Se reutilizan `geometry/pitch.ts`, `constants.ts` y cuatro juegos de coordenadas de `formation-positions.json`. Los controles del editor son propios. MIT 2026 withqwerty.
- MatchOra: https://github.com/ikarolaborda/matchora, revisión `8e7df16e3d080874559cc857410198522d8f3473`. `sortTallies` de `packages/shared/src/standings.ts` alimenta la simulación; MIT. Se conservan fuente y LICENSE. No se incorpora servidor ni feed de marcadores.

Las tres fuentes anteriores están en `vendor/`, junto con sus licencias y JavaScript compilado. No se incluyeron imágenes ni escudos de esos proyectos. Para reconstruir los archivos de Campos/MatchOra puede emplearse esbuild sobre sus TS, con `--format=esm --target=es2020`; no requiere React en la portada.

## Construir la herramienta 3D

```sh
cd tools/tactics-3d-source
npm ci --ignore-scripts
npm run build -- --outDir ../tactics-3d
```

Para producir el directorio público exactamente:

```sh
npx tsc --noEmit
npx vite build --outDir ../tactics-3d
cp LICENSE ../tactics-3d/LICENSE
cp node_modules/three/LICENSE ../tactics-3d/THREE-LICENSE.txt
```

El sitio principal sigue siendo estático, sin instalar Node para utilizarlo.

## Validación

`node scripts/test-v37.cjs` verifica geometría de balón, nombres de campos, vencimiento de reportes, datos meteorológicos ausentes, estados de partido y rutas locales.

La integración con los scripts reales se comprobó además mediante un DOM de pruebas: navegación, encabezado, consultas de campo, borradores separados del reporte público, comparación de equipos, alineaciones, simulación y badges de jornada. El editor 3D pasó comprobación de TypeScript y compilación de producción. La revisión visual local en el navegador remoto quedó bloqueada por su política de acceso a archivos locales; no se afirma una prueba real en Android/iOS ni WebGL de hardware.
