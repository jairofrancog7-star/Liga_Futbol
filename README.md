# Liga Juventino Rosas - MASTER V16

Correccion total de texto/codificacion y agregado visible de la Gran Final de Veteranos.

# Liga Juventino Rosas · MASTER V14

Continuacion directa del trabajo de Work/Astral Max. Se conserva MASTER V12/V13 y se agrega la capa cinematografica 3D con el logo oficial.

**Sitio:** https://jairofrancog7-star.github.io/Liga_Futbol/

**Repo:** https://github.com/jairofrancog7-star/Liga_Futbol

---
# Liga Juventino Rosas · MASTER V12 3D

**Repositorio:** https://github.com/jairofrancog7-star/Liga_Futbol

**GitHub Pages:** https://jairofrancog7-star.github.io/Liga_Futbol/

**Vista HTMLPreview:** https://htmlpreview.github.io/?https://github.com/jairofrancog7-star/Liga_Futbol/blob/main/index.html

V12 conserva las funciones de MASTER V11 y añade una capa visual cinematografica 3D en Inicio, usando el logo real de la Liga Municipal de Futbol Juventino Rosas A.C. El 3D tiene fallback para moviles/reduced-motion y no reemplaza los modulos administrativos.

---
# Liga Juventino Rosas · MASTER V11

Plataforma unificada de la **Liga Municipal de Fútbol Juventino Rosas** en un solo repositorio:

- **JR Fútbol** (público): portada deportiva, JR Matchday, Match Center, tabla, goleadores, equipos, jugadores, Copa/Liguilla, noticias y avisos.
- **JR Control** (privado): jugadores, equipos, jornadas, partidos, campos, árbitros, sanciones, actas, reportes, importar/exportar y respaldos.

## Abrir la plataforma

**Sitio en vivo (GitHub Pages)**

https://jairofrancog7-star.github.io/liga-juventino-rosas/

**Repositorio de desarrollo (GitLab)**

https://gitlab.com/huig7563037/liga-juventino-rosas

## Categorías

- Primera Fuerza
- Intermedia
- Segunda Fuerza
- Veteranos 35+
- Veteranos 50+

## Funciones actuales (V11)

**Zona pública · JR Fútbol**
- JR Matchday y partidos del día
- Match Center con timeline de eventos, alineaciones y estadísticas
- Tabla de posiciones y goleo
- Perfiles públicos de equipos y jugadores
- Copa / Liguilla
- Noticias, avisos, juntas y multimedia
- Fan Zone: favoritos, pronósticos, encuestas, reacciones, votación MVP y tarjeta de resultado
- Shot map y credencial digital
- Búsqueda global
- Modo TV para juntas, finales y pantalla grande
- Calendario `.ics`
- Patrocinadores
- Tema claro / oscuro y navegación móvil
- PWA instalable

**Zona administrativa · JR Control**
- Registro de jugadores (folio, CURP, posición, número)
- Equipos, jornadas y partidos
- Estados de partido: normal, suspendido, cancelado, walkover
- Administración de campos y detector de conflictos de horario/campo
- Árbitros y oficiales
- Acta arbitral digital, imprimible o guardada como PDF desde el navegador
- Sanciones y disciplina
- Generador automático de fixture
- Reportes por jornada
- Importación / exportación CSV y respaldos
- Operador móvil de partido desde la cancha
- Auditoría de cambios

## Funcionamiento

La versión actual es una **demo funcional de interfaz** en un solo `index.html`. Las altas de jugadores, equipos, partidos, sanciones y los eventos del Match Center se guardan en `localStorage` del navegador para poder probar el flujo sin base de datos.

No sustituye todavía a Supabase/PostgreSQL de producción.

## Estructura del repositorio

- `index.html`: aplicación completa (público + administración).
- `sw.js` y `manifest.webmanifest`: PWA.
- `icon.svg`: icono de la liga.
- `docs/`: plan maestro, matriz de funciones, esquema Supabase y guías de ejecución.
- `documentacion/`: auditoría, roadmap y especificaciones.
- `scripts/`: utilidades.

## Stack objetivo

Next.js + React + TypeScript + Tailwind CSS + Supabase/PostgreSQL + Supabase Auth + Storage + Realtime + PWA.

El principio es **no reescribir todo desde cero**: se conserva el motor administrativo actual y se moderniza por fases, sustituyendo las funciones demo por Supabase y código productivo sin romper lo que ya funciona.

## Documentación para GitLab Duo

Leer en este orden:

1. `docs/GITLAB_DUO_EXECUTION_V11.md` (desarrollo dividido en 10 módulos)
2. `docs/REPO_FILE_MAP_V11.md` (mapa de repositorios open source de referencia)
3. `docs/DELTA_V11.md`
4. `docs/MASTER_PLAN_V10.md`
5. `docs/FEATURE_MATRIX_V10.md`
6. `docs/OPEN_SOURCE_MAP_V10.md`
7. `docs/ACCEPTANCE_CRITERIA_V10.md`
8. `docs/SUPABASE_SCHEMA_V10.sql`
9. `docs/RLS_GUIDE_V10.sql`

De los repositorios de referencia solo se trasladan módulos y patrones útiles al stack único del proyecto, verificando primero su licencia. No se copian aplicaciones completas.

## Seguridad

No subir al repositorio:

- `.env`
- claves `service_role` y secretos de Supabase
- contraseñas o tokens
- CURP, INE o documentos personales reales
- respaldos de producción o exportaciones con datos personales de jugadores


