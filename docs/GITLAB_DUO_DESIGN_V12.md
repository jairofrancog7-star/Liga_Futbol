# GITLAB DUO — DISEÑO V12 3D

Lee primero el código existente. No reconstruyas desde cero.

## Objetivo

Conservar toda la funcionalidad de MASTER V11 y convertir el frontend público en una experiencia `Sports Broadcast + Premium App + Cinematic 3D`.

## Qué ya hace el payload V12

- inserta hero cinematográfico antes del hero de partido;
- usa el escudo/logo real;
- crea balón 3D con Three.js;
- añade luces, partículas y anillos;
- añade parallax/scroll y microanimaciones;
- añade tilt en cards de Inicio;
- mantiene fallback para móvil/reduced-motion.

## Al migrar a Next.js

1. Convertir `assets/hero3d.js` en componente cliente lazy-loaded.
2. Preferir `three` + `@react-three/fiber`; `@react-three/drei` sólo si aporta valor.
3. Mover GSAP a NPM y registrar ScrollTrigger sólo en cliente.
4. Renderizar WebGL únicamente en Home / finales / perfiles premium.
5. Mantener tablas, formularios y JR Control sin WebGL.
6. Crear `PerformanceProfile`:
   - reduced motion;
   - save-data;
   - low-end mobile;
   - desktop high.
7. Usar assets propios de Liga Juventino Rosas.
8. No copiar modelos/texturas/branding cerrados de sitios de inspiración.
9. Si se reutiliza código MIT/Apache, conservar avisos/licencias.
10. Medir LCP, CLS, INP y consumo de GPU antes de dar por terminada la fase.

## Referencias open source de diseño a revisar

- `tsogjavklann/awwwards-3d`
- `lusionltd/WebGL-Scroll-Sync`
- `14islands/r3f-scroll-rig`
- `JosephASG/codrops-cinematic-scroll-animations`
- `tahsinmert/emirates-sport-club`
- `DavidHDev/react-bits`
- `magicuidesign/magicui`
- `ibelick/motion-primitives`
- `in-c0/soccer-tactics-studio`

Verifica `LICENSE` del commit concreto antes de copiar cualquier archivo.
