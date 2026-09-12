# Liga Juventino Rosas · V37

Plataforma de la Liga Municipal de Fútbol Juventino Rosas A.C.

Sitio: https://jairofrancog7-star.github.io/Liga_Futbol/

Esta actualización parte de V36.26 (`2631d38925b4f85e8947e90cabc43d2108b75410`). La publicación depende de integrar los cambios en GitHub y completar GitHub Pages.

## Novedades

- Portada FÚTBOL / QUE SE SIENTE / EN VIVO., contorno blanco, verde y blanco.
- Balones esféricos con 32 paneles y costuras; órbitas con margen de cámara, marco dorado y letras en movimiento.
- Pronóstico regional por hora y revisión manual de 14 campos. Los datos ausentes no se presentan como buen tiempo.
- Borradores de campo y partido en JR Control, exportación JSON y publicación mediante GitHub.
- Descarga de partidos con fecha confirmada al calendario (.ics), adaptada de World Cup Dashboard.
- Editor de alineaciones con geometría de Campos: cuatro formaciones, nombres, borrador y descarga SVG.
- Estudio táctico realmente 3D basado en Soccer Tactics Studio, abierto a petición del usuario.
- Comparación de equipos y simulación de un partido adicional con ordenación de MatchOra. La tabla oficial no se modifica.

Se conservan jornadas, resultados, equipos, goleadores, liguilla y las cinco categorías existentes.

## Uso y validación

El sitio principal sigue siendo HTML/CSS/JavaScript estático. Se puede alojar directamente en GitHub Pages; no hay instalación para visitantes. Para ejecutarlo localmente usa un servidor HTTP, por ejemplo `python -m http.server 8000`.

`node scripts/test-v37.cjs` comprueba la geometría, reportes, fechas y calendario. El estudio 3D incluye su código TypeScript y distribución ya compilada.

Consulta [la implementación V37](docs/V37_IMPLEMENTACION.md) para las licencias, reconstrucción y publicación de reportes. El informe de investigación se entrega también como PDF.

La API pública gratuita de Open-Meteo permite uso no comercial bajo sus términos. Antes de activar publicidad real hay que utilizar un proveedor o plan compatible. El estado del terreno nunca se deduce de la lluvia ni se suspende automáticamente un partido.

Los borradores no son reportes publicados. La edición desde el celular con publicación automática requiere conectar un backend autenticado.

> No publiques INE, CURP, contraseñas, tokens ni archivos privados en este repositorio público.
