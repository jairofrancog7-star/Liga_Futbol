# Liga Juventino Rosas · MASTER V12 3D

**Repositorio:** https://github.com/jairofrancog7-star/Liga_Futbol

**GitHub Pages:** https://jairofrancog7-star.github.io/Liga_Futbol/

**Vista HTMLPreview:** https://htmlpreview.github.io/?https://github.com/jairofrancog7-star/Liga_Futbol/blob/main/index.html

V12 conserva las funciones de MASTER V11 y añade una capa visual cinematografica 3D en Inicio, usando el logo real de la Liga Municipal de Futbol Juventino Rosas A.C. El 3D tiene fallback para moviles/reduced-motion y no reemplaza los modulos administrativos.

---
# Liga Juventino Rosas Â· MASTER V11

Plataforma unificada de la **Liga Municipal de FÃºtbol Juventino Rosas** en un solo repositorio:

- **JR FÃºtbol** (pÃºblico): portada deportiva, JR Matchday, Match Center, tabla, goleadores, equipos, jugadores, Copa/Liguilla, noticias y avisos.
- **JR Control** (privado): jugadores, equipos, jornadas, partidos, campos, Ã¡rbitros, sanciones, actas, reportes, importar/exportar y respaldos.

## Abrir la plataforma

**Sitio en vivo (GitHub Pages)**

https://jairofrancog7-star.github.io/liga-juventino-rosas/

**Repositorio de desarrollo (GitLab)**

https://gitlab.com/huig7563037/liga-juventino-rosas

## CategorÃ­as

- Primera Fuerza
- Intermedia
- Segunda Fuerza
- Veteranos 35+
- Veteranos 50+

## Funciones actuales (V11)

**Zona pÃºblica Â· JR FÃºtbol**
- JR Matchday y partidos del dÃ­a
- Match Center con timeline de eventos, alineaciones y estadÃ­sticas
- Tabla de posiciones y goleo
- Perfiles pÃºblicos de equipos y jugadores
- Copa / Liguilla
- Noticias, avisos, juntas y multimedia
- Fan Zone: favoritos, pronÃ³sticos, encuestas, reacciones, votaciÃ³n MVP y tarjeta de resultado
- Shot map y credencial digital
- BÃºsqueda global
- Modo TV para juntas, finales y pantalla grande
- Calendario `.ics`
- Patrocinadores
- Tema claro / oscuro y navegaciÃ³n mÃ³vil
- PWA instalable

**Zona administrativa Â· JR Control**
- Registro de jugadores (folio, CURP, posiciÃ³n, nÃºmero)
- Equipos, jornadas y partidos
- Estados de partido: normal, suspendido, cancelado, walkover
- AdministraciÃ³n de campos y detector de conflictos de horario/campo
- Ãrbitros y oficiales
- Acta arbitral digital, imprimible o guardada como PDF desde el navegador
- Sanciones y disciplina
- Generador automÃ¡tico de fixture
- Reportes por jornada
- ImportaciÃ³n / exportaciÃ³n CSV y respaldos
- Operador mÃ³vil de partido desde la cancha
- AuditorÃ­a de cambios

## Funcionamiento

La versiÃ³n actual es una **demo funcional de interfaz** en un solo `index.html`. Las altas de jugadores, equipos, partidos, sanciones y los eventos del Match Center se guardan en `localStorage` del navegador para poder probar el flujo sin base de datos.

No sustituye todavÃ­a a Supabase/PostgreSQL de producciÃ³n.

## Estructura del repositorio

- `index.html`: aplicaciÃ³n completa (pÃºblico + administraciÃ³n).
- `sw.js` y `manifest.webmanifest`: PWA.
- `icon.svg`: icono de la liga.
- `docs/`: plan maestro, matriz de funciones, esquema Supabase y guÃ­as de ejecuciÃ³n.
- `documentacion/`: auditorÃ­a, roadmap y especificaciones.
- `scripts/`: utilidades.

## Stack objetivo

Next.js + React + TypeScript + Tailwind CSS + Supabase/PostgreSQL + Supabase Auth + Storage + Realtime + PWA.

El principio es **no reescribir todo desde cero**: se conserva el motor administrativo actual y se moderniza por fases, sustituyendo las funciones demo por Supabase y cÃ³digo productivo sin romper lo que ya funciona.

## DocumentaciÃ³n para GitLab Duo

Leer en este orden:

1. `docs/GITLAB_DUO_EXECUTION_V11.md` (desarrollo dividido en 10 mÃ³dulos)
2. `docs/REPO_FILE_MAP_V11.md` (mapa de repositorios open source de referencia)
3. `docs/DELTA_V11.md`
4. `docs/MASTER_PLAN_V10.md`
5. `docs/FEATURE_MATRIX_V10.md`
6. `docs/OPEN_SOURCE_MAP_V10.md`
7. `docs/ACCEPTANCE_CRITERIA_V10.md`
8. `docs/SUPABASE_SCHEMA_V10.sql`
9. `docs/RLS_GUIDE_V10.sql`

De los repositorios de referencia solo se trasladan mÃ³dulos y patrones Ãºtiles al stack Ãºnico del proyecto, verificando primero su licencia. No se copian aplicaciones completas.

## Seguridad

No subir al repositorio:

- `.env`
- claves `service_role` y secretos de Supabase
- contraseÃ±as o tokens
- CURP, INE o documentos personales reales
- respaldos de producciÃ³n o exportaciones con datos personales de jugadores

