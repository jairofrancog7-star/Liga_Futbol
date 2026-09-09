# MASTER V25 — Liga Juventino Rosas ambiciosa

V25 conserva V24 y añade una capa de producto enfocada en dos públicos:

## JR Fútbol
- Home con “Centro de Liga”.
- Accesos directos a partidos, tabla, equipos y delegados.
- Selector de categorías móvil corregido.
- Tabla con tarjetas limpias de posición/equipo/puntos.
- Reacciones, equipo favorito y pronóstico local.
- Texto del hero reescrito para hablar de la Liga, no del proceso de construcción.

## JR Control
- Centro administrativo con KPIs.
- Alta de jugador.
- Captura de foto y documentos para revisión de sesión.
- Credencial imprimible.
- Expedientes.
- Delegados/encargados y contacto.
- Juntas de los martes con asistencia, agenda y acuerdos.
- Sanciones.
- Centro de jornada con checklist y accesos rápidos.

## Privacidad
GitHub Pages es público y la demo administrativa actual no tiene Auth real.
No persistir CURP completa, INE ni documentos en el navegador o repositorio.
Para producción: Supabase Auth + RLS + Storage privado + auditoría real.

## Rendimiento
V25 no añade WebGL adicional ni observadores globales del DOM. Se carga sobre V24.
