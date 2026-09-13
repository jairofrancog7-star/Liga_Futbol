# V38 FIX15 — ANTI-FREEZE

El congelamiento después de ~3 segundos venía de una combinación demasiado costosa:
- FIX14 escaneaba `section, article, div`;
- añadía canvas a muchos elementos anidados;
- un MutationObserver volvía a escanear cuando esos nodos se insertaban;
- FIX12/FIX13/FIX14 podían coexistir y mantener bucles de animación anteriores.

## FIX15
- desconecta FIX13 y FIX14 del `index.html`;
- conserva FIX12 para OCR, credenciales y clima;
- añade guards a FIX12 para desactivar únicamente su motion legacy;
- usa un solo `<video>` global activo;
- los cuadros son translúcidos y dejan ver el video debajo;
- las vistas cambian a videos diferentes;
- Home cambia el video según la sección visible;
- Tabla y Estadísticas quedan forzadas a películas distintas;
- no usa MutationObserver;
- no crea canvas por tarjeta;
- pausa video cuando la pestaña se oculta;
- respeta saveData y prefers-reduced-motion.

El balón 3D y su velocidad de FIX14 no se revierten.
