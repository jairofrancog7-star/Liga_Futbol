# Liga_Futbol · nuevas referencias encontradas para la siguiente etapa

Este archivo complementa el PDF de investigación existente. No significa que todo deba copiarse.
La regla sigue siendo: conservar el proyecto actual, tomar patrones compatibles y revisar licencia exacta antes de reutilizar código/assets.

## Modelos de balón realistas y descargables

1. Sketchfab · Soccer Ball · Scott VanArsdale
   https://sketchfab.com/3d-models/soccer-ball-0a96f1f19afc432bb22c3d74da546338
   CC BY. Muy ligero: alrededor de 500 triángulos. Excelente candidato futuro para móvil.

2. Sketchfab · Soccer ball (Football) · Bl1ffed
   https://sketchfab.com/3d-models/soccer-ball-football-35e5a8d4b64a4d16b5e594e440ac1e01
   CC BY. Alrededor de 960 triángulos. Buen equilibrio para PWA/APK.

3. Sketchfab · Soccer Ball · Raul VFX
   https://sketchfab.com/3d-models/soccer-ball-99325f780b734f738fe06279a7b9fd83
   CC BY. Incluye glTF/OBJ/FBX; más detallado.

4. Sketchfab · Soccer Ball · Mcx1m
   https://sketchfab.com/3d-models/soccer-ball-11d2bc40b0cd466f9f6c62acd90a0c3d
   CC BY. Patrón clásico hexágono/pentágono, costuras y materiales realistas.

MASTER V36.25 NO descarga ni redistribuye esos modelos: crea un balón propio por código.
Si más adelante se integra uno, debe mantenerse la atribución CC BY correspondiente.

## Repositorios adicionales interesantes

5. PitchSide
   https://github.com/aman-a-shah/pitchside
   Reconstrucción de partidos reales en 3D: replay, cámara jugador, orbit cam, timeline y minimapa.
   Licencia no confirmada en esta investigación: estudiar/inspirarse hasta verificar LICENSE.

6. Stadium OS FIFA 2026
   https://github.com/Akash-AIML/stadium-os-fifa2026
   Hero con estadio 3D, anillos, iluminación y partículas.
   GitHub no declara licencia en metadatos: inspiración solamente salvo permiso/licencia posterior.

7. FIFA Pulse AI
   https://github.com/nisham486/FIFA-CUP-2026
   MIT. Three.js + experiencia 3D/fan, útil para estudiar UI espacial y efectos de estadio.

8. Football Dashboard · DavidRaet
   https://github.com/DavidRaet/football-dashboard
   MIT. Dashboard moderno, rutas por liga y visualizaciones interactivas.

9. Football Dashboard · PeteSSMMSS
   https://github.com/PeteSSMMSS/football-dashboard
   MIT. Calendario, tablas live y tarjetas oscuras responsive con Vanilla JS.

10. Soccer Tactics Board · yynakayama
    https://github.com/yynakayama/soccer-tactics-board
    MIT. HTML/CSS/JS sin framework, PWA, drag/drop, flechas y offline. Muy compatible con GitHub Pages.

11. TacticBoard · hnkatze
    https://github.com/hnkatze/TacticBoard
    MIT. Canvas táctil, formaciones, exportación y persistencia local.

12. Football Stadium / StadiView
    https://github.com/thebuggeddev/football-stadium
    PolyForm Noncommercial 1.0.0. NO tratar como MIT/open source permisivo.
    Puede usarse como inspiración; uso comercial requiere licencia separada.

## Qué conviene incorporar después de V36.25

- Match Center Pro: timeline + alineaciones + shot/pass maps.
- XI ideal de la jornada.
- MVP con un voto por dispositivo.
- Perfil completo de jugador y club.
- Historial de campeones.
- Tarjetas compartibles para WhatsApp/Facebook.
- Panel rápido móvil para capturar resultado, goles y tarjetas.
- Un único motor 3D y fallback estático en móviles lentos.
