# Estudio táctico 3D · Liga JR

Adaptación de https://github.com/in-c0/soccer-tactics-studio (MIT), revisión e11c94762654428eb0410e38aa6a69dee298a012. Se conserva LICENSE.

Incluye campo 3D, jugadores, trayectorias, cámaras y edición táctica del proyecto original. Cambios de Liga JR: colores verde/dorado, parte de la interfaz en español, regreso al Match Center, resolución limitada, pausa al ocultarse y aviso si WebGL 2 no está disponible.

## Compilar

```sh
npm ci --ignore-scripts
npx tsc --noEmit
npx vite build --outDir ../tactics-3d
```

Después conserva/copía LICENSE y la licencia de Three.js en la distribución. Consulta `../../docs/V37_IMPLEMENTACION.md`. La versión compilada en `../tactics-3d/` ya está incluida; abrirla desde un servidor HTTP, no directamente como archivo local.
