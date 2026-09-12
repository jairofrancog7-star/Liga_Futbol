const app = document.getElementById('app')!;
const probe = document.createElement('canvas');
const gl = probe.getContext('webgl2');
if (!gl) {
  app.innerHTML = '<section style="max-width:640px;margin:auto;padding:28px;font:17px/1.7 system-ui"><h1>Estudio táctico 3D</h1><p>Este navegador no tiene WebGL 2 disponible. Puedes usar la pizarra 2D de la liga para mover jugadores, dibujar flechas y exportar tu formación.</p><a style="color:#45ed91" href="../../#more">Volver a las herramientas de la liga</a></section>';
} else {
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  import('./main').catch(() => {
    app.innerHTML = '<section style="margin:auto;padding:28px"><h1>No se pudo abrir la escena</h1><a href="../../#more">Volver a la liga</a></section>';
  });
}
const back = document.createElement('a');
back.className = 'jr37-back';back.href='../../#matchcenter';back.textContent='← Volver a la liga';document.body.appendChild(back);
import './styles.css';
