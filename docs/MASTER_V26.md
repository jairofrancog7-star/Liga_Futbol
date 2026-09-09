# MASTER V26 — Fix botones JR Control

Cambios:
- Se elimina del menú la tarjeta “Guía 3D / Open Source”.
- Los cinco botones de categoría de JR Control quedan funcionales:
  Primera Fuerza, Intermedia, Segunda Fuerza, Veteranos 35+, Veteranos 50+.
- Al tocar una categoría:
  - se guarda como categoría activa;
  - cambia el estado visual del botón;
  - actualiza los textos de categoría;
  - intenta refrescar tablas/equipos/jugadores y vistas administrativas existentes;
  - sincroniza selectores de categoría del panel;
  - muestra un contexto visible: “Categoría administrativa activa”.
- Corrige desplazamiento horizontal en móvil.
- No agrega WebGL ni observadores pesados.

Motivo técnico:
V21 interceptaba los botones globales en la fase de captura y detenía la propagación.
V26 captura en `window` antes de V21 cuando la vista activa es JR Control, aplica el cambio
completo y evita que el interceptador anterior anule el toque.
