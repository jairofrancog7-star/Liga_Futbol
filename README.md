# Liga Juventino Rosas

Repositorio de trabajo para evolucionar el sistema actual de la Liga Juventino Rosas hacia una plataforma moderna de fútbol municipal, sin tirar el trabajo existente.

## Objetivo

Separar el producto en dos experiencias conectadas por la misma fuente de datos:

- **JR Fútbol (público):** portada deportiva, partidos, jornadas, tabla, goleadores, perfiles de equipos y jugadores, Copa/Liguilla, noticias, avisos, videos y Match Center.
- **JR Control (privado):** jugadores, equipos, jornadas, partidos, árbitros, sanciones, reportes, importaciones/exportaciones, configuración y operación móvil desde cancha.

## Principio principal

**No reescribir todo desde cero.** Primero se debe auditar el código existente, proteger los datos y secretos, y luego modernizar por fases.

## Stack objetivo recomendado

- Next.js / React
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- PWA

> La versión exacta de Next.js/React deberá confirmarse al auditar el código existente y mantenerse actualizada y parcheada.

## Primeros entregables

1. Auditoría técnica del código actual.
2. Design system y navegación responsive.
3. Home pública deportiva.
4. Jornadas, tabla y goleadores.
5. Match Center.
6. Operador móvil de partido.
7. Realtime.
8. Administración y disciplina mejoradas.
9. Copa/Liguilla, actas y tarjetas compartibles.
10. PWA, favoritos y Fan Zone.

## Documentación

- `docs/PROJECT_SPEC.md`
- `docs/ROADMAP.md`
- `docs/GITLAB_DUO_PROMPT.md`
- `docs/Auditoria_profunda_Liga_Juventino_Rosas.pdf`

## Seguridad

No subir al repositorio:
- `.env`
- claves privadas
- tokens
- contraseñas
- claves `service_role`
- respaldos reales
- exportaciones con datos personales de jugadores
- documentos de identidad
