# PROMPT MAESTRO PARA GITLAB DUO / DEVELOPER — V10

Trabaja sobre este repositorio existente de **Liga Juventino Rosas**.

## Regla 1: NO reconstruir desde cero

Primero audita:
- `index.html`
- `README.md`
- `docs/MASTER_PLAN_V10.md`
- `docs/OPEN_SOURCE_MAP_V10.md`
- `docs/FEATURE_MATRIX_V10.md`
- `docs/SUPABASE_SCHEMA_V10.sql`
- `docs/RLS_GUIDE_V10.sql`
- documentación/auditorías anteriores del repo.

La demo V10 es la referencia funcional/UX. No rompas sus flujos mientras migras a producción.

## Objetivo

Convertir la demo actual en una plataforma productiva:
- JR Fútbol público.
- JR Control privado.
- Next.js + React + TypeScript + Tailwind.
- Supabase/PostgreSQL.
- Supabase Auth.
- Storage.
- Broadcast/Realtime.
- PWA.

## Prioridades

### Fase 0 — Protección
- backup;
- rama estable;
- inventario de secretos/datos;
- no eliminar el proyecto actual.

### Fase 1 — Arquitectura
- crear estructura Next.js;
- adaptar design system de V10;
- mantener ruta/vista pública funcional;
- implementar servicios tipados.

### Fase 2 — Datos
- migraciones SQL;
- RLS;
- roles;
- Storage;
- importación segura.

### Fase 3 — JR Fútbol
- Home;
- JR Matchday;
- jornadas;
- tabla;
- stats;
- equipos;
- jugadores;
- Copa/Liguilla;
- noticias;
- media;
- historial.

### Fase 4 — Match Center
- `match_events` como fuente principal;
- goles, asistencias, tarjetas, cambios, penales, HT, FT;
- lineups;
- árbitros;
- estadísticas;
- Broadcast en vivo.

### Fase 5 — JR Control
- jugadores;
- equipos;
- partidos;
- fixtures;
- oficiales;
- sanciones;
- reportes;
- import/export;
- auditoría.

### Fase 6 — funciones premium
- Fan Zone;
- favoritos;
- MVP;
- pronósticos sin dinero;
- encuestas;
- QR/credencial;
- tarjetas compartibles;
- PWA/push;
- shot map.

## Integración de los 10 repos estudiados

NO hagas forks completos ni pegues frameworks incompatibles. Usa el mapa de `OPEN_SOURCE_MAP_V10.md`.

Debes producir un PR/commit por módulo y documentar cualquier código copiado con su licencia/origen.

## Seguridad

Prohibido subir:
- `.env`;
- claves secretas;
- `service_role`;
- contraseñas/tokens;
- CURP/INE/documentos reales;
- respaldos de producción.

Implementa RLS desde el inicio. El público sólo debe leer información autorizada.

## Criterio de terminado

No declares un módulo terminado sólo por verse bonito. Debe:
- funcionar en celular y PC;
- tener estados loading/empty/error;
- pasar validación;
- no romper accesibilidad;
- no exponer secretos;
- tener pruebas mínimas;
- usar datos reales de Supabase en producción.
