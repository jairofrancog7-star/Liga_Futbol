# MASTER V27 — Inteligencia de liga y limpieza visual

## Problemas corregidos
1. Estadísticas: los botones de categoría cambiaban visualmente, pero V21 sólo refrescaba Tabla y Equipos. V27 refresca también Estadísticas.
2. Estadísticas demo: se sustituyen las cifras genéricas por datos de la categoría activa cuando hay tabla oficial.
3. Duplicación: se ocultan las filas de categorías repetidas dentro de Tabla y Partidos; queda una sola fila global.
4. Equipos: las tarjetas pasan a ser perfiles interactivos con descripción, partidos, estadísticas y delegado cuando exista.
5. Simular jornada: deja de ser un simple formulario de marcador manual y se convierte en un pronóstico estadístico.
6. Las cuatro tarjetas de “Inicio cinematográfico / Match Center animado / Tácticas 2D-3D / Copa + escenarios” ahora son clicables.

## Simulador
El resultado proyectado NO es un resultado real ni oficial. Es un pronóstico determinista:
- usa JJ, GF, GC y puntos cuando hay tabla oficial;
- calcula ataque, defensa, fortaleza relativa, xG aproximado y probabilidades;
- usa una distribución de Poisson para el marcador más probable;
- si faltan datos suficientes, no inventa.

La tabla de Veteranos 35+ incluida en V27 corresponde a la tabla oficial que el usuario proporcionó:
C. de Gasca 40; Juventus 34; Cuenda 33; Pozos FC 32; Boavista 27; PSV 27;
A. Santiago 22; F. Tavera 14; América 13; Huracán 6 (17 JJ).

## Rendimiento
No se agregan observadores globales, loops de animación ni nuevas dependencias WebGL.
