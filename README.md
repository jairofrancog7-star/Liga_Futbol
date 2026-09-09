# Liga Juventino Rosas · MASTER V16

Plataforma unificada de la **Liga Municipal de Fútbol Juventino Rosas A.C.**

MASTER V16 es la versión actual del proyecto. Este README deja fuera los encabezados y enlaces de versiones anteriores para mostrar solamente el estado vigente.

## Abrir la plataforma

**Sitio en vivo (GitHub Pages)**  
https://jairofrancog7-star.github.io/Liga_Futbol/

**Repositorio oficial**  
https://github.com/jairofrancog7-star/Liga_Futbol

## Gran Final de Veteranos

**Pozos FC vs Juventus**  
**Sábado 12 de septiembre de 2026**  
**4:00 pm**  
**Campo 1 · Unidad Deportiva Sur**

La Gran Final queda destacada dentro de la portada y conectada con Match Center, jornada y tabla.

## Categorías

- Primera Fuerza
- Intermedia
- Segunda Fuerza
- Veteranos 35+
- Veteranos 50+

## JR Fútbol · Zona pública

- Portada deportiva premium
- JR Matchday
- Match Center
- Partidos EN VIVO
- Jornadas y resultados
- Tabla de posiciones
- Goleadores y estadísticas
- Equipos y jugadores
- Copa / Liguilla
- Noticias y avisos
- Juntas y multimedia
- Fan Zone
- Favoritos
- Pronósticos sin dinero
- Encuestas y reacciones
- Votación MVP
- Shot map
- Credencial digital
- Búsqueda global
- Modo TV
- Calendario `.ics`
- Patrocinadores
- Tema claro / oscuro
- Navegación móvil
- PWA instalable

## JR Control · Administración

- Registro de jugadores
- Equipos y plantillas
- Jornadas y partidos
- Campos y detección de conflictos
- Árbitros y oficiales
- Alineaciones
- Goles, asistencias y tarjetas
- Cambios y penales
- Estados normal, suspendido, cancelado y walkover
- Acta arbitral digital
- Sanciones y disciplina
- Generador automático de fixture
- Reportes
- Importación y exportación CSV
- Respaldos
- Operador móvil desde la cancha
- Auditoría de cambios

## Diseño MASTER V16

- Estilo **Sports Broadcast + Premium App**
- Fondo oscuro minimalista
- Verde eléctrico como acento principal
- Tipografías Sora, Bebas Neue y Manrope
- Efectos 3D en títulos y marcadores
- Botones con profundidad
- Portada cinematográfica
- Logo oficial de la Liga Municipal de Fútbol Juventino Rosas A.C.
- Animaciones y scroll con fallback para móvil
- Soporte para `prefers-reduced-motion`

## Funcionamiento actual

La versión actual continúa siendo una **demo funcional de interfaz**. Las altas de jugadores, equipos, partidos, sanciones y eventos del Match Center se guardan localmente en el navegador mientras se completa la migración productiva.

El objetivo técnico final es:

**Next.js + React + TypeScript + Tailwind CSS + Supabase/PostgreSQL + Supabase Auth + Storage + Realtime + PWA.**

## Estructura principal

- `index.html`: aplicación pública + administración
- `assets/`: identidad visual y recursos del diseño
- `sw.js`: service worker de la PWA
- `manifest.webmanifest`: configuración instalable
- `docs/`: arquitectura, seguridad, Supabase y continuidad del desarrollo
- `documentacion/`: auditoría, especificaciones y roadmap

## Seguridad

No subir al repositorio:

- `.env`
- claves `service_role`
- secretos de Supabase
- contraseñas o tokens
- CURP, INE o documentos personales reales
- respaldos de producción con datos personales

---

**Versión actual: MASTER V16**  
**Proyecto único: Liga_Futbol**
