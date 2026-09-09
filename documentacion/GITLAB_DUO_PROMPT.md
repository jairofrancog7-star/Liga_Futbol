# MENSAJE PARA GITLAB DUO / AGENTE DE DESARROLLO

Quiero que trabajes sobre este repositorio existente de **Liga Juventino Rosas**.

## Objetivo
No quiero empezar de cero ni perder el motor administrativo actual. Quiero modernizarlo y convertirlo en una plataforma pública + administrativa de fútbol municipal, compatible con celular y PC.

## Respuestas a tus preguntas

### 1. ¿Qué tecnología usa el sistema actual?
Primero audita el repositorio y determina el stack real a partir de `package.json`, estructura de carpetas, dependencias y configuración. No asumas una reescritura. Si el stack actual permite evolucionar de forma segura, consérvalo y modernízalo. Como arquitectura objetivo se prefiere React/Next.js + TypeScript + Tailwind + Supabase/PostgreSQL/Auth/Storage/Realtime/PWA, pero sólo migra aquello que sea necesario.

### 2. ¿Tengo el logo?
El diseño debe dejar preparado `public/branding/` para el logo de la liga, escudos, favicons e imágenes. Si el logo definitivo aún no está en el repositorio, usa un placeholder claramente marcado y no bloquees el desarrollo.

### 3. ¿Facebook embeds o enlaces?
Quiero ambos donde sea posible:
- Botón/enlace a la página oficial.
- Embeds para videos/publicaciones compatibles.
- Fallback a enlace cuando Facebook no permita incrustar el contenido.

## Funciones requeridas

### Público — JR Fútbol
- Portada con logo.
- Selector de categorías.
- Partidos del día.
- Match Center.
- Calendario/jornadas.
- Tabla.
- Goleadores.
- Equipos.
- Jugadores.
- Copa/Liguilla.
- Cuartos, semifinales y final.
- Noticias.
- Avisos importantes.
- Juntas.
- Videos.
- Facebook oficial.
- Visitante sin login.

### Privado — JR Control
- Jugadores.
- Equipos.
- Jornadas.
- Resultados.
- Tabla.
- Goleo.
- Reportes.
- Reglamento.
- Sanciones.
- Importar/exportar.
- Roles.
- Operador móvil de partido.

## Match Center
Implementa un modelo basado en eventos de partido:
- gol
- asistencia
- amarilla
- roja
- cambio
- penal
- HT
- FT

El marcador, goleadores, tarjetas y acta deben poder derivarse o validarse contra esos eventos.

## Prioridad
1. No romper lo actual.
2. Auditoría técnica.
3. Design system.
4. Home pública.
5. Match Center.
6. Operador móvil + realtime.
7. Admin y disciplina.
8. Copa/Liguilla.
9. PWA/Fan Zone.

## Seguridad
No subas ni expongas:
- `.env`
- tokens
- contraseñas
- claves secretas
- `service_role`
- datos personales reales
- respaldos
- documentos de identidad

## Entrega
Trabaja por ramas y pull requests. Antes de cambios destructivos, crea una copia/backup y documenta cualquier migración.
