# DESIGN SYSTEM V12 — Sports Broadcast + Cinematic 3D

## Base verificada

El repositorio objetivo es:

`jairofrancog7-star/Liga_Futbol`

V12 **no reemplaza** MASTER V11. Conserva los botones, vistas, JR Fútbol y JR Control existentes y agrega la capa cinematográfica únicamente encima.

## Dirección visual

- Fondo casi negro, no negro plano.
- Verde eléctrico como acción/acento.
- Azul profundo para luz secundaria 3D.
- Rojo sólo para LIVE/alertas.
- Marcadores y títulos enormes.
- Logo real de Liga Municipal de Fútbol Juventino Rosas A.C.
- WebGL/Three.js fuerte en Inicio.
- Datos, tablas y administración siguen limpios y rápidos.

## Referencias de los videos subidos

Los clips usan patrones de:
- objeto 3D protagonista;
- escena que responde al scroll;
- cámara/parallax suave;
- materiales brillantes/PBR;
- transiciones limpias;
- fondos muy sobrios;
- composición tipo Awwwards.

V12 aplica esos patrones sin copiar branding/texturas/código cerrado de los sitios mostrados.

## Rendimiento

- En pantallas muy pequeñas, ahorro de datos o `prefers-reduced-motion`, se usa el logo estático.
- Pixel ratio WebGL máximo 1.6.
- El 3D no se aplica a tablas, formularios o JR Control.
- En producción Next.js, mover dependencias CDN a NPM y hacer lazy-loading.

## Siguiente fase

Cuando GitLab migre a Next.js:
- Three.js / React Three Fiber;
- GSAP + ScrollTrigger;
- opcional `r3f-scroll-rig` o patrón equivalente;
- assets propios;
- tests de rendimiento móvil.
