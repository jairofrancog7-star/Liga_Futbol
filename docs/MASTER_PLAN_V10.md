# MASTER PLAN V10 — Liga Juventino Rosas

## Objetivo definitivo

Mantener **un solo repositorio** y una sola experiencia coherente:

- **JR Fútbol**: público, deportivo, visual, mobile-first.
- **JR Control**: administración privada.
- **Una sola fuente de datos** en producción.
- **Un solo stack principal**: Next.js + React + TypeScript + Tailwind + Supabase/PostgreSQL/Auth/Storage/Broadcast/PWA.

La raíz del repositorio conserva `index.html` como demo funcional y vista inmediata. La migración productiva debe hacerse sin romper esta referencia.

## Los 10 proyectos estudiados y qué portar

1. `prkedia81/football-league-management` — administración: jugadores, oficiales, reprogramación, walkover, reportes, alineaciones, disciplina.
2. `daniyal-h/soccer-tournament-dashboard` — experiencia pública: match cards, calendario por fecha, perfiles, forma, rankings, bracket.
3. `drodolfo/copa-facil` — patrones React/Supabase/Auth/servicios.
4. `MikolajP13/FootballTournamentsAndLeaguesManager` — motor de competiciones, fixtures, goles, asistencias, tarjetas, timeline.
5. `kaimg/Sports-League-Management-System` — modelo relacional de temporadas, equipos, jugadores, árbitros, partidos y estadios.
6. `houssamb4/Tournify` — separación conceptual público/admin/backend/mobile. Respetar Apache-2.0.
7. `swarn6402/freefa` — portada live, Match Center, countdowns, horarios y estilo Next moderno.
8. `josueluchoc/torneo-acolitos-2025` — microestética, galería, countdown y glassmorphism moderado.
9. `SuzuSuzu-HaruHaru/league-standings` — criterios de clasificación/desempate configurables.
10. `Suleiman700/Bot-League` — patrones de realtime/live viewer; para producción preferir Supabase Broadcast si el stack final es Supabase.

## NO hacer

- No pegar los 10 repos completos.
- No meter React + Angular + Java + Flask + Next en producción.
- No reescribir sin auditar el código actual.
- No exponer `.env`, `service_role`, CURP, INE, documentos o respaldos.
- No usar GPL/copyleft sin revisión legal/técnica específica.
- No copiar proyectos sin licencia.

## Entregas V10 ya demostradas en `index.html`

- JR Matchday.
- Match Center y timeline.
- Tabla, goleadores, equipos, jugadores.
- Bracket.
- Noticias, avisos, juntas y videos.
- JR Control.
- Operador móvil.
- Alta demo de jugador/equipo/partido/sanción.
- Importación CSV y exportación demo.
- Fan Zone.
- Favoritos.
- Pronósticos.
- Encuestas y reacciones.
- Tarjeta de resultado descargable.
- Shot map clicable.
- Credencial digital descargable.
- Generador round-robin.
- Árbitros/oficiales demo.
- Disciplina automática demo.
- Auditoría de acciones.
- PWA básica.
- `.ics`.

## Pendiente para producción

- Reemplazar `localStorage` por Supabase.
- Autenticación y roles reales.
- RLS.
- Storage de fotos/escudos/documentos.
- Broadcast/Realtime.
- Validación server-side.
- Fixture con restricciones reales de canchas/horarios.
- PDF arbitral.
- QR real con ficha pública limitada.
- Notificaciones push.
- Históricos y métricas avanzadas.
- Pruebas automáticas.
