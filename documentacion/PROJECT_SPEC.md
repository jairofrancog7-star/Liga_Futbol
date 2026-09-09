# PROJECT SPEC — Liga Juventino Rosas

## Visión

Convertir el sistema actual en una plataforma pública + administrativa de fútbol municipal, moderna, rápida y usable desde celular y PC.

## 1. JR Fútbol — público

### Inicio
- Logo y nombre de la Liga Juventino Rosas.
- Selector de categoría.
- Partido destacado.
- Estado EN VIVO / próximo / finalizado.
- Partidos del día.
- Mini tabla.
- Top goleadores.
- Avisos importantes.
- Próxima jornada.
- Acceso a Facebook oficial.
- Noticias y videos destacados.

### Jornadas / calendario
- Filtros por categoría, jornada, competencia y cancha.
- Resultados y próximos partidos.
- Liga y Copa.

### Match Center
- Marcador.
- Minuto/estado.
- Campo.
- Árbitros.
- Timeline de eventos.
- Goles.
- Asistencias.
- Amarillas.
- Rojas.
- Sustituciones.
- Penales.
- Medio tiempo y final.
- Alineaciones y banca.
- Estadísticas capturables.
- Compartir resultado.

### Tabla
- JJ, G, E, P, GF, GC, DG, PTS.
- Forma reciente.
- Desempates configurables según reglamento.

### Equipos
- Escudo.
- Colores.
- Plantilla.
- Delegado / DT si se autoriza.
- Posición.
- Forma.
- Próximos partidos.
- Historial.

### Jugadores
- Foto.
- Folio.
- Número.
- Posición.
- Equipo.
- Temporada.
- Goles.
- Asistencias.
- Tarjetas.
- Historial.

### Copa / Liguilla
- Cuartos.
- Semifinales.
- Final.
- Campeón.
- Bracket responsive.

### Noticias / avisos / juntas / videos
- Comunicados.
- Cambios de sede/horario.
- Juntas.
- Videos de cuartos, semifinales y finales.
- Enlaces o embeds de Facebook según viabilidad técnica.

## 2. JR Control — privado

- Dashboard operativo.
- Jugadores.
- Equipos.
- Jornadas.
- Partidos.
- Árbitros.
- Sanciones.
- Reportes.
- Importar/exportar CSV/XLSX.
- Configuración.
- Roles y permisos.

## 3. Operador móvil desde cancha

Pantalla de partido con botones grandes:
- GOL
- AMARILLA
- ROJA
- CAMBIO
- PENAL
- MEDIO TIEMPO
- FINAL

Cada evento debe actualizar el Match Center en tiempo real.

## 4. Datos y entidades

- seasons
- competitions
- categories
- competition_phases
- teams
- players
- player_registrations
- rounds
- venues
- matches
- match_assignments
- lineups
- lineup_players
- match_events
- match_stats
- sanctions
- imports
- import_rows
- audit_log
- articles
- media_assets
- profiles
- roles
- profile_roles
- favorites
- mvp_votes
- predictions

## 5. Roles

- Superadministrador
- Administrador de liga
- Operador de partido
- Árbitro/auxiliar
- Delegado de equipo
- Público

## 6. Migración

1. Congelar copia estable.
2. Backup.
3. Inventariar rutas, tablas, componentes y dependencias.
4. Identificar secretos y eliminarlos del repositorio.
5. Auditar base de datos y RLS.
6. Mantener el motor existente.
7. Crear la capa pública sin romper administración.
8. Migrar por módulos.
9. Probar cada fase antes de retirar pantallas antiguas.

## 7. Reglas de diseño

- Mobile-first.
- Diseño deportivo premium.
- Verde oscuro como identidad base.
- Jerarquía clara.
- Navegación inferior en móvil para público.
- Sidebar/contexto en escritorio.
- Botones contextuales.
- Accesibilidad y buen contraste.
- Microanimaciones breves y funcionales.
