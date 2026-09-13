# Clima y campos V38

## Recuperación y correcciones de V37

Se revisaron `assets/jr-weather-fields-v37.js`, `data/field-status-v37.json`, `docs/V37_IMPLEMENTACION.md` y `docs/VALIDACION_V37.md` de `origin/feature/v37-futbol-clima-campos`. Se conserva el flujo de consulta de campos y exportación de borradores. El módulo V38 es JavaScript propio del proyecto; no incorpora código de un proveedor meteorológico ni una dependencia GPL/AGPL.

V37 consultaba una coordenada regional para todos los campos, carecía de temperatura y responsable de revisión y empleaba un desplazamiento fijo al editar fechas. V38 requiere coordenadas verificadas para cada terreno, consulta la hora del partido confirmado e interpreta la edición de fechas mediante `America/Mexico_City`. Un identificador de partido incluye boletín, categoría y ambos equipos para evitar colisiones entre jornadas.

Los nombres y alias de los 14 campos provienen del módulo V37 y de los boletines existentes en `assets/v18-clubs.js`. No se inventaron coordenadas, fechas, reportes del terreno ni decisiones de partidos. La programación recibida contiene horas como `04:00`, sin fecha completa ni confirmación de mañana/tarde; V38 no las convierte en partidos de hoy. Los encuentros históricos se conservan en su programación original.

## Tres entidades independientes

- **Pronóstico**: modelo regional de Open-Meteo consultado en coordenadas verificadas del campo. Muestra hora del partido, hora del dato, probabilidad de lluvia, temperatura en °C y viento en km/h, fuente, cobertura y última consulta. La hora de emisión del modelo no se deduce de la hora de consulta. No mide lodo ni drenaje.
- **Terreno**: APTO, REVISIÓN, PESADO, NO APTO o SIN REPORTE. Cada registro requiere responsable, fuente y fecha de revisión; notas y enlace de evidencia son opcionales. Más de 12 horas convierte el estado actual en SIN REPORTE, conserva visible el estado anterior y lo marca desactualizado.
- **Partido**: programado, en revisión, suspendido o reprogramado exclusivamente por registro publicado con responsable, fuente y actualización. El pronóstico no cambia esa decisión. Un partido sin fuente aparece sin confirmación oficial, aunque exista en un boletín.

Una alerta meteorológica señala lluvia probable, tormenta o ráfagas adversas y pide consultar a la liga. No es una decisión de suspensión ni garantía de que se juega.

## Datos públicos y verificación

`data/field-status-v38.json` contiene `schemaVersion: 2`, `publicationState: published`, `fields`, `reports` y `matches`. Los tres mapas están vacíos porque no se recibieron datos verificables. La interfaz explica estos vacíos y permite revisar los partidos y sedes existentes.

Para incorporar información real, una persona con permisos del repositorio prepara los siguientes campos en una rama de revisión:

| Mapa | Clave | Campos |
| --- | --- | --- |
| `fields` | ID del campo de `JRFieldsV38.FIELDS` | `latitude`, `longitude` numéricos, `verified: true`, `verifiedAt` ISO con zona, `responsible`, `source` URL HTTP(S) de la verificación |
| `reports` | ID del campo | `status`: `fit`, `review`, `heavy`, `unfit` o `unknown`; `reviewedAt` ISO con zona; `responsible`; `source`; `note` opcional; `evidence` URL HTTP(S) opcional |
| `matches` | `JRFieldsV38.matchId(categoria, partido, boletinId)` | `status`: `scheduled`, `review`, `suspended` o `rescheduled`; `updatedAt` ISO con zona; `responsible`; `source`; `kickoff` ISO con zona o `null`; `kickoffConfirmed: true` si hay inicio confirmado; `note` opcional |

Las marcas de verificación forman parte de la revisión editorial del repositorio, no prueban por sí solas una inspección física. El navegador no autentica a un responsable. La autorización para escribir información pública sigue siendo la del repositorio y de su proceso de revisión. Solo se aceptan decisiones de partidos identificados en los boletines reales. El lector conserva decisiones de boletines históricos aunque la pantalla de campos se concentre en el más reciente.

Los enlaces a Maps son búsquedas por nombre y se rotulan así; no equivalen a verificar una coordenada. No se reutiliza la coordenada del centro municipal de V37 como ubicación del campo.

## Borradores y exportación

JR Control guarda únicamente en `jr38-field-drafts` del dispositivo. Guardar un terreno o una decisión no cambia `publicData`, la portada ni los reportes públicos. Se requieren responsable y fuente; las revisiones futuras, fechas imposibles, horas sin zona y enlaces no HTTP(S) se rechazan.

La descarga `field-status-v38-propuesta.json` combina una copia de los reportes públicos cargados con los borradores válidos y mantiene **`publicationState: draft`**. El lector público rechaza ese archivo mientras sea borrador. La descarga se bloquea si no se pudo consultar el archivo público, para evitar perder reportes desconocidos.

Flujo para una revisión posterior:

1. Preparar y guardar borradores en JR Control; descargar la propuesta.
2. Verificar sus fuentes, responsables, fechas y evidencia, y revisar el diff contra `data/field-status-v38.json`.
3. Solo después de la revisión editorial, cambiar `publicationState` a `published` en una rama y reemplazar el archivo de datos. Esa marca no despliega el sitio.
4. Revisar la rama y autorizar por separado su publicación con el flujo del repositorio. Los visitantes no verán cambios hasta que termine un despliegue autorizado.

No hay POST, credenciales públicas, enlace de edición de `main` ni publicación simulada desde localStorage. No se contrató un backend ni un plan meteorológico.

## Proveedor y condiciones consultadas

Consulta documental: **12 de septiembre de 2026**. Fuentes primarias revisadas antes de escribir la integración:

- [Términos de Open-Meteo](https://open-meteo.com/en/terms): API gratuita para uso no comercial; menos de 10 000 llamadas al día, 5 000 por hora y 600 por minuto. Los sitios con anuncios o suscripciones y las actividades promocionales se consideran comerciales. No ofrece garantía de disponibilidad ni exactitud.
- [Licencia y atribución](https://open-meteo.com/en/license): los datos requieren atribución CC BY 4.0. La interfaz muestra Open-Meteo y el enlace a esa licencia junto al pronóstico.
- [Documentación Forecast API](https://open-meteo.com/en/docs): se solicita `temperature_2m`, `precipitation_probability`, `wind_speed_10m`, `wind_gusts_10m`, `weather_code`, `timeformat=unixtime`, `timezone=America/Mexico_City`, Celsius y km/h. El proveedor combina modelos regionales/globales y algunas variables pueden faltar. La probabilidad corresponde a más de 0.1 mm en la hora precedente.

El repositorio muestra espacios de patrocinador sin anunciantes reales. La integración se plantea para el uso informativo no comercial de la liga y permanece sin consultas mientras falten coordenadas y horarios verificados. **Antes de incorporar publicidad, suscripciones o uso promocional real**, revisar estas condiciones y configurar un servicio compatible; no insertar una clave comercial secreta en JavaScript público. La caché por dispositivo reduce consultas repetidas, pero no controla el consumo total de todos los visitantes; una audiencia que supere los límites requiere una solución del lado del servidor autorizada.

No se copió el servidor Open-Meteo ni su código; se usa su API HTTP. La licencia de los datos no se confunde con la licencia de implementación del proveedor.

## Caché, fallos y datos ausentes

La consulta meteorológica es explícita, solo disponible con coordenadas y comienzo confirmados. Tiene timeout de 10 segundos, también para lectura del cuerpo JSON. Maneja fallo HTTP, JSON inválido, conexión caída y respuesta vacía. Un botón permite reintentar. Consultar reportes públicos también tiene timeout y deja un estado honesto si falla.

La caché se separa por latitud, longitud, zona y unidades. Caduca a los 30 minutos, se etiqueta desactualizada y descarta sus valores después de 6 horas. Una fecha futura o respuesta malformada invalida la entrada. Temperatura, lluvia o viento ausentes son `null` y se muestran como Sin dato; un cero numérico permanece cero. Las unidades de respuesta se verifican antes de mostrar un valor. Fuera de las horas cubiertas por el pronóstico no se reutiliza el dato de otro día.

La pantalla muestra resolución horaria; para un inicio a media hora usa la hora del dato que contiene ese inicio y la identifica, sin fingir resolución de minutos. Una búsqueda de campo no hace geolocalización del visitante.

## Integración

Incluir `assets/jr-weather-fields-v38.css` y el script diferido `assets/jr-weather-fields-v38.js` después de los datos V20. El módulo agrega `#view-fields` a la navegación existente y el editor a `#view-admin`.

API de navegador `window.JRFieldsV38`:

- `navigate(id?)`: abre Clima y campos; omitir ID conserva la selección.
- `fixtures(all = false)`: copia los partidos reales del boletín más reciente; `true` incluye todos los boletines, con IDs estables.
- `officialFor(id)`: decisión pública validada o `null`.
- `todayMatches(now?)`: solo partidos del último boletín con fecha completa publicada correspondiente al día de Guanajuato.
- `snapshot()`: copia de datos públicos, `loaded` y `error`; no expone los borradores.
- `renderHomeSummary(host)`: agrega resumen de estados y acceso a campos; lo actualiza al recibir reportes.
- `fieldFor`, `matchId`, `cleanMatch`, `readReport`, validación y utilidades de pronóstico/fecha: también exportadas para pruebas Node.

Evento `jr:fields-updated` al cargar los datos públicos. Filas de la jornada actual pueden usar `data-jr38-current="true"`, `data-jr38-field` y `data-jr38-match`; emitir `jr:calendar-rendered` actualiza sus enlaces de terreno. Los boletines históricos no reciben el estado actual del campo. Los botones ICS delegan a `JRCalendarV38.download` y solo aparecen para inicios confirmados programados/reprogramados.

## Verificación

`node scripts/test-weather-v38.cjs` comprueba ausencia frente a cero, unidades, horas fuera de cobertura, fechas imposibles, cambio de día de Guanajuato, reglas IANA históricas, coordenadas verificadas y rango, expiración del terreno, fuentes oficiales, separación de borradores, rechazo de publicación accidental, TTL, errores y timeouts de red/cuerpo, y partidos/campos del repositorio sin fechas fabricadas. Los datos `example.com` existen exclusivamente dentro de la prueba y nunca se cargan en la web.

La revisión de navegador de la rama se documenta en la entrega general V38. Esta prueba automatizada no afirma una consulta meteorológica real para una sede todavía sin coordenadas verificadas.
