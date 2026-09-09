# Liga Juventino Rosas

Repositorio único del proyecto **Liga Juventino Rosas**.

## Abrir la plataforma

**Vista directa para celular y PC**

https://htmlpreview.github.io/?https://github.com/jairofrancog7-star/liga-juventino-rosas/blob/main/index.html

**GitHub Pages**

https://jairofrancog7-star.github.io/liga-juventino-rosas/

## Estructura del mismo repositorio

- index.html: vista pública / demo funcional.
- docs/ o documentacion/: auditoría, roadmap y especificaciones.
- El código de la aplicación y del panel administrativo debe permanecer en este mismo repositorio.
- Los datos privados y secretos NO se guardan en GitHub.

> Este repositorio sustituye la necesidad de mantener un repositorio separado llamado $DemoRepo.

---
# Liga Juventino Rosas

Repositorio de trabajo para evolucionar el sistema actual de la Liga Juventino Rosas hacia una plataforma moderna de fÃºtbol municipal, sin tirar el trabajo existente.

## Objetivo

Separar el producto en dos experiencias conectadas por la misma fuente de datos:

- **JR FÃºtbol (pÃºblico):** portada deportiva, partidos, jornadas, tabla, goleadores, perfiles de equipos y jugadores, Copa/Liguilla, noticias, avisos, videos y Match Center.
- **JR Control (privado):** jugadores, equipos, jornadas, partidos, Ã¡rbitros, sanciones, reportes, importaciones/exportaciones, configuraciÃ³n y operaciÃ³n mÃ³vil desde cancha.

## Principio principal

**No reescribir todo desde cero.** Primero se debe auditar el cÃ³digo existente, proteger los datos y secretos, y luego modernizar por fases.

## Stack objetivo recomendado

- Next.js / React
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- PWA

> La versiÃ³n exacta de Next.js/React deberÃ¡ confirmarse al auditar el cÃ³digo existente y mantenerse actualizada y parcheada.

## Primeros entregables

1. AuditorÃ­a tÃ©cnica del cÃ³digo actual.
2. Design system y navegaciÃ³n responsive.
3. Home pÃºblica deportiva.
4. Jornadas, tabla y goleadores.
5. Match Center.
6. Operador mÃ³vil de partido.
7. Realtime.
8. AdministraciÃ³n y disciplina mejoradas.
9. Copa/Liguilla, actas y tarjetas compartibles.
10. PWA, favoritos y Fan Zone.

## DocumentaciÃ³n

- `docs/PROJECT_SPEC.md`
- `docs/ROADMAP.md`
- `docs/GITLAB_DUO_PROMPT.md`
- `docs/Auditoria_profunda_Liga_Juventino_Rosas.pdf`

## Seguridad

No subir al repositorio:
- `.env`
- claves privadas
- tokens
- contraseÃ±as
- claves `service_role`
- respaldos reales
- exportaciones con datos personales de jugadores
- documentos de identidad

