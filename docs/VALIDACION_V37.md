# Validación V37

## Resultado de lógica e integración: aprobado

- `node scripts/test-v37.cjs`: 32 paneles de balón (12 pentágonos, 20 hexágonos), geometría normalizada, nombres de campos, caducidad de reportes, ausencia de lluvia vs cero, estados de partido, rutas de assets, calendario UTC, exclusión de suspendidos y plegado UTF-8.
- DOM con index.html y scripts reales: 14 campos, encabezado solicitado, navegación, marco y franja dorados, borradores separados de datos públicos, estados de partido, tabla comparativa, alineaciones y simulación. Sin excepciones detectadas.
- Soccer Tactics Studio: TypeScript sin errores y build Vite correcto. Recursos compilados y licencias incluidos.
- Revisión de espacios del código fuente: correcta. La distribución generada conserva espacios dentro de shaders de Three.js y el aviso MIT de Emirates se conserva tal como fue recibido; se excluyen esos archivos de la comprobación de formato.

## Resultado visual del sitio: bloqueado

Se inspeccionaron las capturas proporcionadas y la web pública existente. El navegador remoto bloqueó el acceso al proyecto local. No se realizó comparación visual del render de V37 ni prueba de WebGL en hardware móvil. Se requiere esa comprobación antes de integrar la rama en main.

## Publicación: pendiente

La integración GitHub respondió 403 al crear la rama. No se publicó la versión ni se modificó main. El paquete permite preparar una rama local y subirla desde una cuenta con permisos.
