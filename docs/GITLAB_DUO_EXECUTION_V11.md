# GITLAB DUO — EJECUCIÓN V11

No empieces desde cero.

## Paso 1 — Auditoría real
Lee:
- `index.html`
- `docs/MASTER_PLAN_V10.md`
- `docs/REPO_FILE_MAP_V11.md`
- `docs/FEATURE_MATRIX_V10.md`
- `docs/SUPABASE_SCHEMA_V10.sql`
- `docs/RLS_GUIDE_V10.sql`

Luego entrega una tabla:
`YA EXISTE | FALTA | MEJORAR | FUENTE DE REFERENCIA | ARCHIVOS A TOCAR`.

## Paso 2 — Prioridad de 10 módulos

1. **Modelo de datos Supabase real**
   - seasons/categories/competitions/teams/players/venues/rounds/matches/match_events/match_officials/sanctions/shots.
   - migraciones versionadas.
   - RLS antes de datos reales.

2. **Auth y roles**
   - superadmin;
   - admin liga;
   - operador partido;
   - árbitro;
   - delegado;
   - público.

3. **Jugadores/equipos**
   - alta/baja;
   - foto/escudo;
   - folio;
   - categoría;
   - plantilla;
   - historial;
   - documentos privados fuera del público.

4. **Calendario profesional**
   - round robin;
   - doble vuelta opcional;
   - canchas;
   - conflictos de fecha/hora;
   - reprogramación;
   - cancelado/suspendido/walkover.

5. **Match Center**
   - goles;
   - asistencia;
   - amarilla;
   - roja;
   - cambio;
   - penal;
   - HT/FT;
   - alineaciones;
   - árbitros;
   - acta.

6. **Tabla y estadísticas**
   - puntos;
   - GF/GC/DG;
   - forma;
   - desempates configurables según reglamento;
   - goleadores/asistencias/tarjetas.

7. **Liga + Copa**
   - jornadas;
   - cuartos;
   - semifinales;
   - final;
   - bracket;
   - campeón;
   - historial por temporada.

8. **Tiempo real**
   - operador móvil escribe;
   - público recibe sin recargar;
   - usar Supabase Broadcast/Realtime;
   - evitar duplicados.

9. **Contenido y comunidad**
   - noticias;
   - avisos;
   - juntas;
   - galería;
   - Facebook;
   - patrocinadores;
   - Fan Zone;
   - MVP;
   - favoritos;
   - pronósticos sin dinero;
   - encuestas/reacciones.

10. **Premium**
   - PWA;
   - TV mode;
   - `.ics`;
   - acta PDF;
   - export Excel/CSV;
   - QR/credencial;
   - shot map;
   - push;
   - auditoría.

## Paso 3 — No mezclar frameworks

El resultado final debe converger a:
**Next.js + React + TypeScript + Tailwind + Supabase/PostgreSQL + Auth + Storage + Broadcast + PWA**.

Porta lógica/ideas de Angular, Java, Flask, FastAPI o Socket.IO sólo cuando sean útiles. No mantengas cinco backends.

## Paso 4 — commits

Un módulo por commit/PR. No hagas una mega-reescritura.

## Paso 5 — seguridad

No subir:
- `.env`;
- service_role;
- secretos;
- CURP/INE;
- documentos privados;
- backups.

## Definición de terminado

Un botón no cuenta como “terminado” si sólo abre un modal. En producción debe:
- escribir/leer datos reales;
- validar;
- respetar rol;
- dejar auditoría;
- manejar loading/error/empty;
- ser responsive;
- tener prueba mínima.
