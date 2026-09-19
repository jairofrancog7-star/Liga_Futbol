# Política de datos oficiales

La fuente de verdad para equipos, plantillas, goleadores, resultados, clasificación, tarjetas y cédulas públicas es AdminFut / https://www.juventinorosasliga.com/.

Reglas para las interfaces de la Liga:
- No inventar nombres de equipos, jugadores, goleadores, marcadores, estadísticas ni palmarés.
- Mostrar únicamente datos presentes en `data/official-live.json` o en una fuente oficial verificada.
- Si una métrica no está publicada, mostrar “No publicado” o dejar el campo vacío.
- Los escudos deben resolverse desde los activos oficiales sincronizados; si falta un escudo, usar un fallback neutro sin atribuir un logo de otro club.
- Las cédulas y credenciales deben conservar los nombres tal como aparecen en el registro oficial.

El workflow `sync-oficial-liga.yml` mantiene `data/official-live.json` sincronizado con AdminFut.
