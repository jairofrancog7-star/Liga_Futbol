# Liga Juventino Rosas · mejoras móviles 38-70

Estado: cambios preparados localmente; subida a GitHub bloqueada por revisión automática. No publicados. APK sin compilar todavía.

## Cambios incluidos

- Herramientas en seis tarjetas: credenciales, clasificación, jornadas, liguilla, cédulas y cómo importar desde WhatsApp. Conserva las exportaciones PNG/CSV/calendario y la página de cédulas.
- Registro y liguilla con rutas separadas; el registro ya no muestra los cruces.
- Estilos verdes, correcciones de modo claro y navegación inferior con texto completo.
- Formulario con CURP en lugar de folio, ciudad, nacimiento, edad automática y posición. La lectura al elegir imagen llena los campos disponibles y genera vista previa. Los campos faltantes siguen editables. El OCR no valida identidad.
- Las correcciones manuales no se sobrescriben al volver a interpretar el texto. Borrar limpia documento y datos extraídos.
- Tabla con modos compacta/completa/forma y zona de liguilla configurable localmente. Ningún equipo se declara clasificado sin confirmación del formato.
- Cuadros de 4, 6 u 8 equipos; seis con dos pases directos a semifinal.
- Historias locales de 24 horas con imagen, título y compartir. No son publicaciones globales.
- Código Android 1.6.0 preparado para recibir una imagen con Compartir → Liga JR y abrir el lector. Límite 10 MB. No transmite documentos a un servidor.
- Corregido error existente de acceso a un elemento ausente en los escudos de la tabla.

## Comprobaciones realizadas

- 11 verificaciones del extractor de campos/fechas: `node scripts/test-credential-parser-70.cjs`.
- Integración con DOM simulado: seis tarjetas, categoría, extracción, edad, edición manual, borrado, selector de liguilla 4/6/8, tema y cancelación de vista previa pendiente.
- Comprobación de sintaxis JavaScript y diff.
- Revisión de capturas y video suministrados; inventario de los tres paquetes APK. No se ejecutó ni copió código de esas aplicaciones.

## Pendientes para completar la entrega

1. Autorizar la escritura de esta rama en `jairofrancog7-star/Liga_Futbol`, ejecutar compilación de Android e integrar en main después de revisar resultados.
2. Verificar visualmente móvil y escritorio: el navegador de comprobación no pudo abrir el servidor local. No hay todavía comprobación visual de esta nueva versión.
3. Probar OCR con fotos reales y Compartir en un teléfono Android. Las pruebas actuales validan extracción de texto, no precisión óptica ni ejecución Android.
4. Conectar WhatsApp Business/Twilio y un backend privado para recepción automática al 4121715599. Supabase conectado no tiene proyectos y Twilio no expone herramientas operativas en esta sesión. No se ha activado esa recepción.
5. Las historias son locales; publicación para todos los usuarios requiere almacenamiento y administración autenticada.
6. La compilación configurada es de prueba. Una actualización instalable sobre la APK anterior necesita la firma compatible.

No se ha enviado ningún mensaje ni se han publicado documentos personales.
