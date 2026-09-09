# OPEN SOURCE 21 — mapa de inspiración MASTER V25

MASTER V25 no pega 21 proyectos completos. Usa patrones compatibles y mantiene una sola aplicación.

1. Football League Management — flujo administrativo, jugadores, árbitros, reportes.
2. MatchTrack / Soccer Tournament Dashboard — UX pública, Match Center, estadísticas.
3. Copa Fácil — servicios, auth/Supabase y estructura de datos.
4. Football Tournaments & Leagues Manager — lógica de competencia y eventos.
5. Sports League Management System — modelo relacional de liga.
6. Tournify — separación público/admin/backend/móvil.
7. FreeFA — inicio live y experiencia futbolística moderna.
8. Torneo Acólitos — microinteracciones y presentación.
9. league-standings — reglas de tabla/desempates.
10. Bot League — patrones de actualización en vivo.
11. OpenLeague — organización diaria, equipos y asistencia.
12. Bracket — fases eliminatorias y llaves.
13. Teamsster — divisiones, registros y permisos.
14. Footy League — tabla, forma reciente y calendario.
15. OpenMatchDay — operación de partido, goles, tarjetas y finales.
16. SidelineStats — perfiles, noticias, galería y temporadas.
17. ArenaOps — sedes/canchas, programación y modo operativo.
18. Emirates Sport Club — estructura visual de club/equipo y contenido.
19. Awwwards 3D — profundidad, scroll y escenas 3D puntuales.
20. Lusion WebGL Scroll Sync / r3f-scroll-rig — sincronización ligera entre interfaz y 3D.
21. React Bits / Magic UI / Motion Primitives — microinteracciones y componentes modernos.

## Lo que V25 aplica ya
- Resumen de tabla rediseñado, sin “TOP 140 / TOP 234”.
- Selector de categorías funcional y usable en móvil.
- Centro público de liga con jornadas, tabla, equipos y directorio.
- Pulso de afición: reacciones, equipo favorito y pronóstico local.
- Centro administrativo JR.
- Registro de jugadores con foto, CURP, INE/CURP como archivo de revisión de sesión.
- Credencial imprimible/guardable como PDF.
- Expedientes y documentos pendientes.
- Directorio de delegados/encargados con contacto por WhatsApp.
- Junta semanal de los martes: asistencia, agenda, acuerdos y minuta imprimible.
- Control de sanciones.
- Checklist de jornada y accesos rápidos a calendario, árbitros, campos, reportes y operador.
- Bitácora local básica.

## Seguridad
La página actual es GitHub Pages y no tiene autenticación real de producción.
Por eso V25 NO persiste CURP completa ni archivos INE/CURP en localStorage y nunca los sube al repositorio.
La versión productiva debe usar Supabase Auth, RLS y un bucket privado para documentos.
