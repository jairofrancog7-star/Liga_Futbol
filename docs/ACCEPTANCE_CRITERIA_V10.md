# ACCEPTANCE CRITERIA V10

## Público
- Mobile 360px sin overflow horizontal.
- Desktop 1280px aprovechado.
- Selector de categoría persistente.
- Partido live visible en 1 pantalla.
- Match Center accesible en <=2 toques.
- Tabla legible y ordenada conforme al reglamento.
- Perfiles no exponen datos privados.

## Admin
- Roles reales.
- Eventos de partido auditados.
- Reprogramación detecta conflictos de cancha/hora.
- Walkover/cancelación distinguidos de resultado normal.
- Importación valida antes de insertar.
- Toda acción sensible queda en `audit_log`.

## Realtime
- Evento capturado en operador aparece en público sin refrescar.
- Reconexión no duplica eventos.
- Marcador coherente con timeline.

## Seguridad
- Cero secretos en Git.
- RLS activa.
- Storage privado para documentos.
- URLs firmadas cuando aplique.
- `service_role` sólo server-side.

## Accesibilidad
- Contraste AA.
- Navegación por teclado en web.
- `prefers-reduced-motion`.
- botones con etiquetas claras.
