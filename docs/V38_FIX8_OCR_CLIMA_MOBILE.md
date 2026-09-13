# V38 FIX8 — OCR + clima + mobile + full motion

## Registro OCR de jugadores

El botón existente **Registrar jugador** abre ahora un flujo OCR más rápido:

1. foto/imagen del documento CURP;
2. foto/imagen de INE;
3. OCR en navegador con Tesseract.js;
4. propuesta de CURP, fecha de nacimiento, edad, estado de nacimiento, nombre y domicilio/localidad;
5. el operador confirma/corrige;
6. se registra posición, categoría, equipo y número;
7. fotografía del jugador;
8. credencial PNG o impresión/PDF.

### Privacidad

La página pública está en GitHub Pages. Por eso FIX8 **no persiste**:
- CURP completa;
- imagen de INE;
- imagen de documento CURP;
- texto OCR bruto.

Sólo se guarda CURP enmascarada y datos operativos confirmados, siguiendo la política que ya existía en el proyecto.
La foto se usa en la credencial de la sesión; no se sube automáticamente a GitHub.

Para producción con documentos reales: autenticación + storage privado + RLS/permisos y auditoría.

## Clima

- Open-Meteo;
- referencia regional de Juventino Rosas;
- cache 30 minutos;
- pronóstico ≠ revisión real del terreno ≠ decisión oficial;
- lluvia sola nunca significa partido suspendido.

## Motion / Emirates

Se reutilizan 11 clips Higgsfield ya generados.
No se genera un duodécimo clip en FIX8 porque el balance disponible de Higgsfield al preparar el paquete era de 3 créditos.

- fondo cinematográfico global con crossfade;
- video distinto por vista;
- ticker de valores en movimiento;
- mantiene badges Categorías / LIVE / Matchday / Jornada / Liguilla;
- reduced-motion y saveData;
- videos se pausan fuera de viewport.

## Mobile

FIX8 corrige específicamente el hero mostrado en las capturas:
- limita altura del stage;
- reduce el canvas/ball en <=760px;
- conserva badges;
- compacta marca/header;
- query versions `?v=38-8`;
- limpia Cache Storage al cambiar build;
- fuerza actualización de registros de service worker existentes.
