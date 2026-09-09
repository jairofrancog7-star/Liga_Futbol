# MAPA DE CÓDIGO Y REFERENCIAS V11

Este archivo convierte la investigación de la conversación en tareas concretas.

## 1. Copa Fácil
Repositorio: https://github.com/drodolfo/copa-facil

Usar como referencia para:
- React + TypeScript + Tailwind + Supabase.
- Auth.
- torneos, equipos, partidos, resultados y posiciones.
- servicios separados: `teamService`, `matchService`, `standingsService`, `tournamentService`, `userService`.
- esquema SQL de Supabase.

**Acción GitLab:** localizar esos servicios en la revisión actual del repo y portar solamente patrones compatibles. No asumir rutas exactas sin inspeccionarlas.

## 2. Football Tournaments & Leagues Manager
Repositorio: https://github.com/MikolajP13/FootballTournamentsAndLeaguesManager

Usar para lógica:
- generación automática de calendario;
- liga / eliminación / grupos + eliminación;
- goles, asistencias, amarillas y rojas;
- reportes de partido;
- timeline y estadísticas.

**Acción GitLab:** traducir la lógica a TypeScript/Next; NO meter Angular + Java/Spring dentro del stack final.

## 3. MatchTrack / Soccer Tournament Dashboard
Repositorio: https://github.com/daniyal-h/soccer-tournament-dashboard

Usar para:
- cards de partidos por fecha;
- detalles de encuentro;
- goles, penales, tarjetas, sustituciones;
- tabla;
- perfiles de equipo;
- forma últimos 5;
- rankings;
- búsqueda;
- fase eliminatoria / bracket;
- UX pública moderna.

**Acción GitLab:** estudiar componentes y arquitectura actual antes de portar.

## 4. Sports League Management System
Repositorio: https://github.com/kaimg/Sports-League-Management-System

Usar para modelo conceptual:
- ligas;
- temporadas;
- equipos;
- entrenadores;
- jugadores;
- estadios;
- árbitros;
- árbitros asignados;
- partidos;
- resultados;
- goleadores;
- posiciones.

**Acción GitLab:** comparar este modelo con `SUPABASE_SCHEMA_V10.sql` y crear migraciones incrementales.

## 5. league-standings
Repositorio: https://github.com/SuzuSuzu-HaruHaru/league-standings

Usar para:
- PJ/PG/PE/PP/GF/GC/DG/PTS;
- criterios de desempate;
- enfrentamiento directo;
- prioridades configurables.

**Acción GitLab:** verificar que sus reglas encajan con el reglamento real de Liga Juventino Rosas antes de integrarlo.

## 6. Football League Management
Repositorio: https://github.com/prkedia81/football-league-management

Usar para:
- alineaciones;
- oficiales;
- AR1/AR2;
- reprogramaciones;
- detección de conflictos;
- walkover;
- cancelaciones;
- reportes arbitrales;
- disciplina;
- cargas masivas.

## 7. FreeFA
Repositorio: https://github.com/swarn6402/freefa

Usar como referencia visual/técnica para:
- portada live;
- countdown;
- partido destacado;
- página individual de encuentro;
- tarjetas/sustituciones/goles;
- servicios modernos Next/Supabase.

## 8. Tournify
Repositorio: https://github.com/houssamb4/Tournify

Usar como referencia de separación:
- web pública;
- administración;
- backend;
- móvil.

No mezclar sus frameworks si no coinciden con la arquitectura final.

## 9. Torneo Acólitos
Repositorio: https://github.com/josueluchoc/torneo-acolitos-2025

Usar sólo para:
- microestética;
- glassmorphism moderado;
- galería;
- cuenta regresiva;
- presentación.

## 10. Bot League
Repositorio: https://github.com/Suleiman700/Bot-League

Usar sólo como referencia para:
- live viewer;
- actualización instantánea;
- historial/replay;
- standings/stats.

En producción preferimos Supabase Broadcast/Realtime para no meter otro backend innecesario.

## Ideas de demos/sistemas vistas en la investigación

- Footy League → tabla, forma, jornadas, eliminatorias.
- OpenMatchDay → live, goles por jugador, asistencias, tarjetas, semis/finales, TV.
- SidelineStats → perfiles, noticias, galería, playoffs, play-by-play.
- ArenaOps → programación, venues, notificaciones, búsqueda, dark/light.
- Bracket → formatos de competición y pantalla pública. **No copiar código AGPL dentro del proyecto MIT/privado sin decidir explícitamente aceptar sus obligaciones.**

## Regla de licencias

Antes de copiar cualquier archivo:
1. comprobar el archivo `LICENSE` del commit concreto;
2. registrar origen y licencia;
3. conservar avisos;
4. si hay AGPL/GPL, no copiar ese código al núcleo sin revisión explícita;
5. si no hay licencia, tratarlo como “no reutilizable por defecto”.
