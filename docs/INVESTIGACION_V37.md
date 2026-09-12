## Una plataforma de fútbol para tu liga

La combinación más útil para Liga Juventino Rosas es una portada con identidad verde y dorada, información verificable de cada campo y herramientas deportivas que funcionen con tus propios partidos. El acabado cinematográfico acompaña esas funciones. La prioridad operativa sigue siendo saber dónde se juega y quién confirmó el terreno.

La investigación revisó 48 repositorios, sus metadatos y los archivos README/LICENSE disponibles, además de documentación meteorológica, demos de autores y recursos visuales externos. Incluye los 25 proyectos que enviaste y ocho alternativas adicionales. La disponibilidad de una demo no garantiza que su servidor, datos o funciones de pago sean gratuitos.

### Qué quedó implementado en el código V37

| Área | Resultado preparado |
| --- | --- |

| Portada | Texto de tus capturas: FÚTBOL con contorno transparente, QUE SE / SIENTE en verde y EN VIVO. en blanco. Balones con pentágonos, hexágonos y costuras; órbitas incluidas en el cálculo de cámara. Marco dorado con luz y letras en movimiento. |

| Antes del partido | Pronóstico regional por hora, reportes de 14 campos, revisión vencida, estados del partido y exportación de borradores para publicar. |

| Herramientas de fútbol | Soccer Tactics Studio en 3D; alineaciones con geometría de Campos; calendario .ics adaptado de World Cup Dashboard; comparación de equipos y simulación con MatchOra. |

Publicación: GitHub rechazó crear la rama con “403 · Resource not accessible by integration”. La versión preparada se entrega como código y parche; no se modificó la página publicada. La verificación de lógica y DOM pasó. La comparación visual local quedó bloqueada por la política del navegador de esta sesión.

Base revisada: V36.26, commit 2631d38925b4f85e8947e90cabc43d2108b75410. [1]


---

## Clima y campos antes de los efectos

La lluvia prevista y el estado del terreno son datos distintos. Un campo puede seguir encharcado después de que deje de llover. V37 muestra “Sin revisión” cuando falta una confirmación; no inventa que un campo está apto.

| Dato | Comportamiento de V37 |
| --- | --- |

| Clima regional | Probabilidad de lluvia, precipitación en mm, viento, ráfagas, tormenta y horas. Caché de 30 minutos; lectura descartada tras 6 horas. Valores ausentes: Sin dato. |

| Revisión del terreno | Apto, En revisión, Pesado/encharcado, No apto o Cerrado. La confirmación vence a las 12 horas: decisión de esta implementación, ajustable según operación. |

| Situación del partido | Programado, Por confirmar, Retrasado o Suspendido. Fecha y hora completas introducidas por quien publica; los horarios aislados de boletines no se convierten automáticamente en partidos de hoy. |

| Regla operativa | La lluvia nunca suspende por sí sola. Campo no apto/cerrado se muestra como no disponible. La decisión final corresponde a la liga. |

Se reconocen Sur 1, 2 y 3; Emiliano Zapata 4; Cerrito de Gasca; Tavera; San Juan de la Cruz; Santiago de Cuenda; San Antonio de Romerillo; Fraccionamiento; Pozos; Rincón de Centeno; San José y San Julián. Es un catálogo normalizado de nombres del proyecto; no una inspección física.

El pronóstico usa el centro de Santa Cruz de Juventino Rosas, 20.64337, -100.99286. Los campos comparten esa referencia regional porque no se verificaron sus coordenadas exactas. Open-Meteo permite pronóstico horario sin llave en su API pública, sujeto a condiciones de uso. [2]

JR Control guarda borradores en el dispositivo. Publicarlos exige descargar el JSON y actualizarlo en GitHub. Una futura edición con foto y publicación inmediata necesita autenticación, base de datos y permisos; no está conectada todavía. Esto evita presentar un borrador local como un reporte visible para toda la liga.


---

## Tus 25 referencias: 1 a 5

Código público, licencia revisada y encaje específico con Liga JR. “No confirmada” significa que no se obtuvo una licencia concreta aplicable; no afirma que el autor nunca pueda conceder permiso.

| Proyecto y acceso | Uso y decisión para tu proyecto |
| --- | --- |

| 1. Emirates Sport ClubCódigo [3]Licencia: MITDemo / sitio del autor [4] | Referencia principal de composición y movimiento: SvelteKit, GSAP y Lenis. En V37 se adaptó la dirección visual al HTML existente; se preservó el aviso de licencia. Sus videos, marca y fotografías no se copiaron. |

| 2. World Cup 2026 DashboardCódigo [5]Licencia: MITDemo / sitio del autor [6] | React/TypeScript con filtros, horarios y exportación .ics. V37 reutiliza y adapta el exportador del calendario. El feed del Mundial no cubre partidos municipales. LICENSE nombra a Steven Hatch; se conserva ese texto aunque el README identifique a otro autor. |

| 3. Soccer Tournament DashboardCódigo [7]Licencia: MITDemo / sitio del autor [8] | Buena referencia para calendario, clasificación y navegación por competición. Su conexión deportiva necesita datos/proveedor. V37 conserva las jornadas y tablas existentes; no conecta automáticamente una API que conozca tu liga. |

| 4. MatchOraCódigo [9]Licencia: MITSin demo del autor confirmada en esta revisión. | La clasificación se deriva de estados de partidos y reglas de desempate. Se reutilizó su ordenación para una simulación hipotética de Veteranos 35+. No se activaron feed en vivo ni clasificación matemática oficial sin el calendario completo. |

| 5. CamposCódigo [10]Licencia: MITDemo / sitio del autor [11] | Biblioteca React de superficies y visualizaciones futbolísticas. V37 reutiliza geometría de cancha y coordenadas de cuatro formaciones en un editor ligero con nombres, borrador y descarga SVG; no añade React a toda la web. |

La licencia del software y las condiciones de sus fotografías, modelos, videos o datos se revisan por separado. Los contenidos y el reglamento de tu liga continúan siendo la fuente de verdad.


---

## Tus 25 referencias: 6 a 10

Código público, licencia revisada y encaje específico con Liga JR. “No confirmada” significa que no se obtuvo una licencia concreta aplicable; no afirma que el autor nunca pueda conceder permiso.

| Proyecto y acceso | Uso y decisión para tu proyecto |
| --- | --- |

| 6. Soccer Tactics StudioCódigo [12]Licencia: MITSin demo del autor confirmada en esta revisión. | Prioridad 3D: campo, jugadores, trayectorias y cámaras. Integrado en tools/tactics-3d/, con fuentes TypeScript, distribución compilada y licencia. Se carga al abrirlo; requiere WebGL 2. Parte de los controles avanzados conserva el inglés. |

| 7. Tactical BoardCódigo [13]Licencia: No confirmadaSin demo del autor confirmada en esta revisión. | Propuesta de pizarra táctica con React y animación. La revisión no confirmó un archivo de licencia aplicable. No se debe repetir “MIT” sólo por aparecer en una lista previa. No se copió; hay alternativas con MIT confirmado. |

| 8. Football Analytics DashboardCódigo [14]Licencia: No confirmadaSin demo del autor confirmada en esta revisión. | Referencia para administración y estadísticas. Un badge/README que menciona MIT no sustituye revisar el texto de licencia aplicable. No se confirmó ese archivo en la revisión. No se incorporaron su autenticación ni su backend Supabase. |

| 9. UCL TrackerCódigo [15]Licencia: No confirmadaSin demo del autor confirmada en esta revisión. | Referencia visual de seguimiento de Champions. No se confirmó la licencia de reutilización. Sus equipos, escudos y feeds tampoco se convierten en información municipal por copiar la interfaz. Se dejó fuera del código integrado. |

| 10. Fullstack UltraskorCódigo [16]Licencia: MITSin demo del autor confirmada en esta revisión. | Código de resultados, filtros y tablas de una generación anterior de React. Útil para estudiar organización de jornadas. Requiere revisar dependencias y proveedor de datos antes de reutilizarlo; no es una capa que se añada a tu HTML sin adaptación. |

La licencia del software y las condiciones de sus fotografías, modelos, videos o datos se revisan por separado. Los contenidos y el reglamento de tu liga continúan siendo la fuente de verdad.


---

## Tus 25 referencias: 11 a 15

Código público, licencia revisada y encaje específico con Liga JR. “No confirmada” significa que no se obtuvo una licencia concreta aplicable; no afirma que el autor nunca pueda conceder permiso.

| Proyecto y acceso | Uso y decisión para tu proyecto |
| --- | --- |

| 11. Tournament MakerCódigo [17]Licencia: MITDemo / sitio del autor [18] | Herramienta de llaves de eliminación que puede adaptarse a liguilla de fútbol. La asignación de cuartos y avances debe seguir el reglamento municipal. En V37 se corrige el acceso a la liguilla existente; no se reemplaza ese reglamento. |

| 12. SoccerAnimationCódigo [19]Licencia: MITSin demo del autor confirmada en esta revisión. | Animación de acciones de fútbol sobre cancha. Útil cuando hay eventos registrados (gol, saque, ataque); sin ellos sólo sería una demostración. No se generan ataques ni posesión ficticios para hacer parecer vivo un partido. |

| 13. Pitchverse / Soccer PredictorCódigo [20]Licencia: MIT del código, con exclusionesDemo / sitio del autor [21] | Interfaz de comparación y predicción. El LICENSE excluye modelos entrenados y derechos de datos de terceros. V37 añade comparación descriptiva sobre la tabla existente; no incorpora pesos ni afirma probabilidades de victoria de tu liga. |

| 14. Soccer Tactics BoardCódigo [22]Licencia: MITDemo / sitio del autor [23] | Alternativa sencilla en HTML/CSS/JavaScript con pizarra, formaciones y enfoque offline. Encaja mejor con la arquitectura actual que migrar toda la aplicación a React. Buena opción para evolucionar la pizarra 2D que ya conserva tu página. |

| 15. TacticBoardCódigo [24]Licencia: MITDemo / sitio del autor [25] | Astro, TypeScript y Canvas para pizarra táctica con interacción táctil. La demo se presenta como tablero de fútbol 8: conviene revisar número de jugadores y formato antes de asumir fútbol 11. Alternativa ligera, no integrada en V37. |

La licencia del software y las condiciones de sus fotografías, modelos, videos o datos se revisan por separado. Los contenidos y el reglamento de tu liga continúan siendo la fuente de verdad.


---

## Tus 25 referencias: 16 a 20

Código público, licencia revisada y encaje específico con Liga JR. “No confirmada” significa que no se obtuvo una licencia concreta aplicable; no afirma que el autor nunca pueda conceder permiso.

| Proyecto y acceso | Uso y decisión para tu proyecto |
| --- | --- |

| 16. Football VizCódigo [26]Licencia: MITSin demo del autor confirmada en esta revisión. | Visualización futbolística con React/TypeScript y StatsBomb Open Data. Puede servir para mapas de tiros y eventos. La licencia del código no reemplaza la de los datos; esos eventos profesionales no son estadísticas de jugadores municipales. |

| 17. Breaking The Lines VizCódigo [27]Licencia: AGPL-3.0Demo / sitio del autor [28] | Librería de gráficos y cancha deportiva. No es MIT. La integración/modificación debe contemplar las obligaciones de código fuente de AGPL, incluido el uso en red cuando aplica. No se incorpora para mantener acotada esta entrega. |

| 18. Mundial ’26Código [29]Licencia: MITSin demo del autor confirmada en esta revisión. | Expo y React Native con partidos, grupos y eliminatorias. Interesante si posteriormente se reconstruye una app móvil. No reemplaza automáticamente tu APK actual; V37 modifica la web y no recompila el APK. |

| 19. AI-3DSoccerCódigo [30]Licencia: No confirmadaSin demo del autor confirmada en esta revisión. | Experimento de fútbol con Three.js. No se confirmó una licencia concreta de reutilización. Se priorizó Soccer Tactics Studio con licencia verificada, en vez de copiar escenas de un proyecto sin permiso claramente identificado. |

| 20. The Other HalfCódigo [31]Licencia: MIT del código; assets aparteDemo / sitio del autor [32] | Corrección a la lista anterior: la demo inspeccionada es una historia de un pequeño planeta, no una liga ni un estadio de fútbol. Sirve como referencia cinematográfica general. Assets con términos separados; no se copiaron a la liga. |

La licencia del software y las condiciones de sus fotografías, modelos, videos o datos se revisan por separado. Los contenidos y el reglamento de tu liga continúan siendo la fuente de verdad.


---

## Tus 25 referencias: 21 a 25

Código público, licencia revisada y encaje específico con Liga JR. “No confirmada” significa que no se obtuvo una licencia concreta aplicable; no afirma que el autor nunca pueda conceder permiso.

| Proyecto y acceso | Uso y decisión para tu proyecto |
| --- | --- |

| 21. THREEx Sport BallsCódigo [33]Licencia: MITDemo / sitio del autor [34] | Ejemplo veterano de balones Three.js, con compatibilidad que requiere revisión. En V37 se construyó una geometría original de 12 pentágonos y 20 hexágonos; se evita depender de una textura plana antigua que deforma los paneles. |

| 22. FSPro Football SimulatorCódigo [35]Licencia: MIT del código; imágenes aparteDemo / sitio del autor [36] | Motor y estructura de simulación de fútbol. El enlace es documentación, no garantía de juego completo en línea. Incluye términos distintos para imágenes; nombres e identidades de clubes/jugadores requieren revisión propia. No se añade su servidor. |

| 23. OpenFootManagerCódigo [37]Licencia: GPL-3.0Demo / sitio del autor [38] | Juego de gestión con Rust/Tauri y frontend React. Es un proyecto de alcance mayor que una página municipal. Puede orientar un módulo de gestión futuro; reutilizarlo exige atender GPL y su arquitectura. No se incluye en V37. |

| 24. Awwwards 3DCódigo [39]Licencia: MITSin demo del autor confirmada en esta revisión. | Referencia general de técnicas Three.js, GSAP y scroll. El repositorio es una colección de plantillas/instrucciones de desarrollo, no una plataforma de fútbol terminada ni una librería que active todas esas escenas al cargar un script. |

| 25. R3F Scroll RigCódigo [40]Licencia: MIT en LICENSESin demo del autor confirmada en esta revisión. | Sincroniza React Three Fiber y elementos HTML. El LICENSE revisado indica MIT; prevalece revisar ese archivo frente a metadatos antiguos ISC. No se carga en V37 porque añadir React/R3F a la portada sólo para el efecto ampliaría el coste de integración. |

La licencia del software y las condiciones de sus fotografías, modelos, videos o datos se revisan por separado. Los contenidos y el reglamento de tu liga continúan siendo la fuente de verdad.


---

## Más código de fútbol que sí merece revisar

| Proyecto | Por qué podría servir |
| --- | --- |

| TacticBasicsFootballCódigo [41]Demo [42] | MIT. Pizarra 2D/3D en español, formaciones y ejercicios. Es la alternativa nueva que mejor encaja para entrenadores y delegados. |

| Board · Tactics JournalCódigo [43]Demo [44] | MIT. Pizarra táctil y exportaciones. El servicio alojado limita el plan gratis a tres proyectos; alojar el código por tu cuenta permite las funciones locales, sin convertir los servicios de nube de pago en gratuitos. |

| sport-statsCódigo [45]Demo [46] | MIT. Componentes de visualización de fútbol con React, D3 y Three.js. Buen material para eventos y cancha; dependencias antiguas requieren adaptación. |

| Soccer Board 3DCódigo [47] | MIT. Otra base de tablero tridimensional. Útil como referencia comparativa; Soccer Tactics Studio ya cubre ese papel en esta entrega. |

| Footy Run 3DCódigo [48]Demo [49] | MIT. Minijuego de carrera con temática futbolística. Puede incorporarse después a una zona de aficionados, con carga a petición para no pesar sobre las jornadas. |

| Football Tactics HubCódigo [50] | MIT. Base de comunidad para publicar y compartir tácticas. Tiene componentes de servidor; requiere moderación, cuentas y despliegue propios. |

| footballTacticsAnimatorCódigo [51] | MIT. Animación táctica con Flutter. Interesante para herramientas móviles; no se pega directamente sobre el HTML existente. |

| Football PredictorCódigo [52] | MIT. Ejemplo de predicción con aprendizaje automático sobre fútbol profesional. Útil para estudiar; no produce un modelo municipal fiable sin datos históricos adecuados. |


---

## Fuera de GitHub: gratis no siempre significa libre

También se revisaron recursos externos. Para tu objetivo conviene distinguir el archivo descargable, el código, la licencia de los assets y la suscripción del servicio.

| Recurso | Resultado de la revisión |
| --- | --- |

| Openfootball [53] | Datos, formatos y ejemplos de fútbol de dominio público. Sirve para organizar calendarios/resultados; no contiene por sí mismo datos de tu liga municipal. |

| Balón de Bl1ffed en Sketchfab [54] | Modelo de 960 triángulos anunciado con atribución CC BY. Puede ser una alternativa ligera si se descarga y acredita correctamente. No fue descargado ni incorporado: V37 usa geometría propia. |

| wearebrand.io [55] | Referencia de agencia y acabado visual. No se confirmó una licencia que permita copiar el sitio ni una entrega gratuita de código. |

| Horizonx [56] | El acceso completo se anuncia por 24.99 USD/mes. Revisar licencia y precio del recurso concreto; “explorar” la web no concede derechos sobre todo su catálogo. |

| Weblove [57] | La comunidad se anuncia por 20 USD/mes y restringe contenidos/código a miembros. No se cuenta como recurso gratuito para el proyecto. |

Los enlaces cortos de TikTok, el perfil, el canal de YouTube, mdx.so/bio y los enlaces compartidos de ChatGPT no pudieron inspeccionarse de forma suficiente en esta sesión. Las dos capturas adjuntas sí se usaron para recuperar el texto y la composición. No se atribuyen técnicas, licencias o código a videos no observados.

### Coste del clima

Open-Meteo separa la licencia de datos CC BY 4.0 del uso de la API pública gratuita, reservado a uso no comercial. Publicidad o patrocinio comercial real requiere revisar la elegibilidad o cambiar de proveedor/plan. MET Norway permite usos comerciales bajo sus condiciones de identificación, atribución y caché, pero no está integrado en V37. [58] [59]


---

## Qué se puede reutilizar y qué falta conectar

MIT permite modificar y redistribuir el código, incluso para usos comerciales, conservando los avisos exigidos. Un repositorio público sin licencia identificada no concede automáticamente ese permiso. Esta investigación verifica archivos, no reemplaza una revisión de los términos específicos del material que se publique. [60]

GPL y AGPL no significan “no comercial”: imponen obligaciones de distribución o acceso al código fuente según cómo se integre y ofrezca el software. Para esta entrega se seleccionaron componentes MIT verificados. GSAP mantiene una licencia propia; que su uso sea gratuito bajo sus términos no lo convierte en MIT. [61] [62] [63]

| Ya preparado | Pendiente o fuera de esta entrega |
| --- | --- |

| Fuentes y licencias | La carpeta vendor conserva Campos, MatchOra y World Cup Dashboard. tools contiene Soccer Tactics Studio y Three.js. Emirates queda como referencia adaptada con aviso conservado. |

| Operación municipal | Faltan coordenadas verificadas por campo, primeras revisiones reales y fechas completas de partidos. El JSON público inicial está vacío a propósito: no hay inspecciones ficticias. |

| Actualización desde celular | Hoy se prepara y exporta el borrador. Faltan backend autenticado, permisos de administradores y fotos para publicar directamente desde el teléfono. |

| Resultados en vivo | No se compró ni conectó un feed municipal. No se afirma que copiar UCL, Mundial o Pitchverse produzca marcadores de tu liga. |

| Calidad y despliegue | Pruebas de lógica/DOM y build TypeScript/Vite correctos. Falta revisión visual en navegador real del paquete y prueba de WebGL en teléfonos. GitHub rechazó la escritura y el APK no fue reconstruido. |

Orden sugerido después de publicar: confirmar campos y fechas; conectar edición autenticada; revisar liguilla con el reglamento oficial; añadir eventos reales de partido; optimizar escenas 3D con medidas de rendimiento en celulares. R3F, juegos y simuladores mayores quedan después de esa operación básica.


---

## Fuentes y enlaces completos

Consulta realizada el 12 de septiembre de 2026. Se priorizaron repositorios de los autores, archivos de licencia, documentación oficial y demos enlazadas por ellos. Las pruebas de acceso a demos no equivalen a verificar todas sus funciones. Las decisiones sobre qué integrar son una valoración técnica para este proyecto.

## Fuentes

[1] [jairofrancog7-star/Liga_Futbol](https://github.com/jairofrancog7-star/Liga_Futbol)

[2] [Open-Meteo: documentación](https://open-meteo.com/en/docs)

[3] [tahsinmert/emirates-sport-club](https://github.com/tahsinmert/emirates-sport-club)

[4] [Demo o documentación: https://emirates-sports-club.vercel.app/](https://emirates-sports-club.vercel.app/)

[5] [zehan12/world-cup-2026-dashboard](https://github.com/zehan12/world-cup-2026-dashboard)

[6] [Demo o documentación: https://world-cup-2026-dashboard-three.vercel.app](https://world-cup-2026-dashboard-three.vercel.app)

[7] [daniyal-h/soccer-tournament-dashboard](https://github.com/daniyal-h/soccer-tournament-dashboard)

[8] [Demo o documentación: https://soccer-tournament-dashboard.vercel.app/](https://soccer-tournament-dashboard.vercel.app/)

[9] [ikarolaborda/matchora](https://github.com/ikarolaborda/matchora)

[10] [withqwerty/campos](https://github.com/withqwerty/campos)

[11] [Demo o documentación: https://campos.withqwerty.com](https://campos.withqwerty.com)

[12] [in-c0/soccer-tactics-studio](https://github.com/in-c0/soccer-tactics-studio)

[13] [evjester/tactical-board](https://github.com/evjester/tactical-board)

[14] [davidbanjo13-design/football-analytics-dashboard](https://github.com/davidbanjo13-design/football-analytics-dashboard)

[15] [zaydkassimi/UCL](https://github.com/zaydkassimi/UCL)

[16] [mustafa-cakir/fullstack-ultraskor](https://github.com/mustafa-cakir/fullstack-ultraskor)

[17] [nadun-kosala/tournament-maker](https://github.com/nadun-kosala/tournament-maker)

[18] [Demo o documentación: https://tournament-brackets-maker.netlify.app/](https://tournament-brackets-maker.netlify.app/)

[19] [4ving/SoccerAnimation](https://github.com/4ving/SoccerAnimation)

[20] [roni-altshuler/soccer_predictor](https://github.com/roni-altshuler/soccer_predictor)

[21] [Demo o documentación: https://soccer-stats-predictor-sigma.vercel.app](https://soccer-stats-predictor-sigma.vercel.app)

[22] [yynakayama/soccer-tactics-board](https://github.com/yynakayama/soccer-tactics-board)

[23] [Demo o documentación: https://yynakayama.github.io/soccer-tactics-board/](https://yynakayama.github.io/soccer-tactics-board/)

[24] [hnkatze/TacticBoard](https://github.com/hnkatze/TacticBoard)

[25] [Demo o documentación: https://tactic-board-eight.vercel.app/](https://tactic-board-eight.vercel.app/)

[26] [novojitsaha/football-viz](https://github.com/novojitsaha/football-viz)

[27] [breakingthelines/viz](https://github.com/breakingthelines/viz)

[28] [Demo o documentación: https://breakingthelines.github.io/viz/](https://breakingthelines.github.io/viz/)

[29] [andamagodwin/worldcup26](https://github.com/andamagodwin/worldcup26)

[30] [xbeat/AI-3DSoccer](https://github.com/xbeat/AI-3DSoccer)

[31] [makerjackie/the-other-half](https://github.com/makerjackie/the-other-half)

[32] [Demo o documentación: https://otherhalf.01mvp.com](https://otherhalf.01mvp.com)

[33] [jeromeetienne/threex.sportballs](https://github.com/jeromeetienne/threex.sportballs)

[34] [Demo o documentación: http://jeromeetienne.github.io/threex.sportballs/examples/basic.html](http://jeromeetienne.github.io/threex.sportballs/examples/basic.html)

[35] [LeanKhan/fs-pro](https://github.com/LeanKhan/fs-pro)

[36] [Demo o documentación: https://fspro.sturves.tech/](https://fspro.sturves.tech/)

[37] [openfootmanager/openfootmanager](https://github.com/openfootmanager/openfootmanager)

[38] [Demo o documentación: https://openfootmanager.com/](https://openfootmanager.com/)

[39] [tsogjavklann/awwwards-3d](https://github.com/tsogjavklann/awwwards-3d)

[40] [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)

[41] [meser1905/TacticBasicsFootball](https://github.com/meser1905/TacticBasicsFootball)

[42] [Demo o documentación: https://tacticbasicsfootball.vercel.app/](https://tacticbasicsfootball.vercel.app/)

[43] [TacticsJournal/board](https://github.com/TacticsJournal/board)

[44] [Demo o documentación: https://board.tacticsjournal.com](https://board.tacticsjournal.com)

[45] [alexadam/sport-stats](https://github.com/alexadam/sport-stats)

[46] [Demo o documentación: https://alexadam.github.io/demos/sport-stats/](https://alexadam.github.io/demos/sport-stats/)

[47] [natibekele/soccer-board-3d](https://github.com/natibekele/soccer-board-3d)

[48] [richducat/footy-run-3d](https://github.com/richducat/footy-run-3d)

[49] [Demo o documentación: https://richducat.github.io/footy-run-3d/?embed=1](https://richducat.github.io/footy-run-3d/?embed=1)

[50] [michaelehab/Football-Tactics-Hub](https://github.com/michaelehab/Football-Tactics-Hub)

[51] [MS-Teja/footballTacticsAnimator](https://github.com/MS-Teja/footballTacticsAnimator)

[52] [AndrewCarterUK/football-predictor](https://github.com/AndrewCarterUK/football-predictor)

[53] [Openfootball](https://openfootball.github.io/)

[54] [Soccer Ball Football · Bl1ffed](https://sketchfab.com/3d-models/soccer-ball-football-35e5a8d4b64a4d16b5e594e440ac1e01)

[55] [BRAND](https://wearebrand.io/brand)

[56] [Horizonx Explore](https://horizonx.so/explore)

[57] [Weblove · Skool](https://www.skool.com/weblove-4157/about)

[58] [Open-Meteo: términos](https://open-meteo.com/en/terms)

[59] [MET Norway: términos de servicio](https://developer.yr.no/doc/TermsOfService/)

[60] [GitHub: licencias de repositorios](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

[61] [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html)

[62] [GNU GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.html)

[63] [GSAP: licencia estándar](https://gsap.com/community/standard-license/)
