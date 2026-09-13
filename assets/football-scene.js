/* Liga Juventino Rosas V38. One persistent scene, two equal-sized balls.
 * Geometry and motion are original to this repository. Three.js r128: MIT. */
(function () {
  'use strict';
  const MOTION_KEY = 'jr-motion-v38';
  let threePromise, instance;
  function loadThree() {
    if (window.THREE?.WebGLRenderer) return Promise.resolve(window.THREE);
    if (threePromise) return threePromise;
    threePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => finish(new Error('Tiempo de carga agotado')), 10000);
      function finish(error) {
        clearTimeout(timer);
        script.onload = script.onerror = null;
        if (error) { script.remove(); reject(error); }
        else resolve(window.THREE);
      }
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
      script.async = true;
      script.dataset.jr38Three = '1';
      script.onload = () => finish(window.THREE?.WebGLRenderer ? null : new Error('Motor no disponible'));
      script.onerror = () => finish(new Error('Motor no disponible'));
      document.head.appendChild(script);
    }).catch(error => { threePromise = null; throw error; });
    return threePromise;
  }
  function mount() {
    if (instance) { instance.refresh(); return instance; }
    const hero = document.getElementById('v14CinematicHero');
    const stage = hero?.querySelector('.v14-stage');
    const model = window.JRBallModelV38;
    if (!stage || !model) return null;
    // Remove obsolete presentation nodes only; the league's views remain mounted.
    document.getElementById('jrV369SecondSection')?.remove();
    stage.replaceChildren();
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Dos balones de fútbol, verde y dorado, con paneles y órbitas completas');
    const fallback = model.fallback(stage);
    const controls = document.createElement('div');
    controls.className = 'jr38-scene-controls';
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.id = 'jr38MotionToggle'; controls.appendChild(toggle);
    stage.insertAdjacentElement('afterend', controls);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let preference = 'on';
    try { preference = localStorage.getItem(MOTION_KEY) || 'on'; } catch (_) {}
    let renderer, scene, camera, canvas, balls = [], attempted = false, loading = false, lost = false;
    let raf = 0, last = 0, elapsed = 0, visible = false, width = 0, height = 0;
    let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0, scrollAmount = 0;
    const isMoving = () => preference !== 'off' && !reduced.matches && !connection?.saveData;
    const isVisible = () => visible && !document.hidden && stage.isConnected && stage.getBoundingClientRect().width > 0;
    function updateControl() {
      toggle.disabled = reduced.matches || !!connection?.saveData || stage.dataset.jr38Fallback === 'true';
      toggle.setAttribute('aria-pressed', String(isMoving()));
      toggle.textContent = connection?.saveData ? 'Ahorro de datos · imagen estática' : stage.dataset.jr38Fallback === 'true' ? 'Vista estática · 3D no disponible' : reduced.matches ? 'Movimiento reducido · imagen estática' : isMoving() ? 'Pausar movimiento' : 'Activar movimiento';
      hero.dataset.jr38Motion = isMoving() ? 'on' : 'off';
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    function requestFrame() {
      if (renderer && !lost && isVisible() && !raf) raf = requestAnimationFrame(frame);
    }
    function resize() {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width; height = rect.height; fallback.draw();
      if (!renderer) return;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, matchMedia('(max-width: 760px)').matches ? 1.25 : 1.5));
      renderer.setSize(width, height, false);
      const frameSize = model.frame(width, height);
      camera.left = -frameSize.halfWidth; camera.right = frameSize.halfWidth;
      camera.top = frameSize.halfHeight; camera.bottom = -frameSize.halfHeight;
      camera.updateProjectionMatrix(); requestFrame();
    }
    function frame(now) {
      raf = 0;
      if (!renderer || lost || !isVisible()) { last = 0; return; }
      const moving = isMoving(), delta = last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      if (moving) {
        elapsed += delta;
        const ease = 1 - Math.exp(-delta * 5);
        smoothX += (pointerX - smoothX) * ease; smoothY += (pointerY - smoothY) * ease;
        const rect = hero.getBoundingClientRect();
        const target = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        scrollAmount += (target - scrollAmount) * ease;
      }
      balls.forEach((ball, index) => {
        if (moving) {
          ball.body.rotation.set(.2 + smoothY * .07 + scrollAmount * .3, elapsed * (index ? -.19 : .22) + index * .7 + scrollAmount * 1.4 + smoothX * .10, index ? -.14 : .10);
          ball.orbits.rotation.set(.08 * Math.sin(elapsed * .3), elapsed * (index ? .07 : -.08), scrollAmount * .12);
          ball.group.position.y = model.CENTERS[index][1] + Math.sin(elapsed * .65 + index * 2) * .06;
        }
      });
      renderer.render(scene, camera);
      if (moving) requestFrame();
    }
    async function start() {
      if (attempted || loading || connection?.saveData || !isVisible()) return;
      loading = true; attempted = true;
      try {
        const T = await loadThree();
        if (connection?.saveData) { attempted = false; return; }
        canvas = document.createElement('canvas'); canvas.className = 'jr38-ball-canvas'; canvas.setAttribute('aria-hidden', 'true');
        renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: !matchMedia('(max-width: 760px)').matches, powerPreference: 'low-power' });
        renderer.setClearColor(0x000000, 0); renderer.outputEncoding = T.sRGBEncoding;
        renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18;
        scene = new T.Scene(); camera = new T.OrthographicCamera(-4, 4, 5, -5, .1, 60); camera.position.z = 18;
        scene.add(new T.HemisphereLight(0xf2fff7, 0x101914, 1));
        const key = new T.DirectionalLight(0xffffff, 2.4); key.position.set(-4, 7, 8); scene.add(key);
        const rim = new T.DirectionalLight(0xb8e6ff, .8); rim.position.set(4, 2, -5); scene.add(rim);
        const warm = new T.PointLight(0xffd98a, .7, 18); warm.position.set(-3, -3, 5); scene.add(warm);
        balls = model.CENTERS.map((center, index) => {
          const group = new T.Group(), body = model.mesh(T, !!index), orbits = new T.Group();
          group.position.set(center[0], center[1], 0); body.rotation.set(.2, index * .7, index ? -.14 : .1);
          [[2.08, .012, 1.12, .24, .65], [2.17, .008, .75, -.60, .34], [1.95, .006, 1.65, .78, .26]].forEach(([radius, tube, tilt, turn, opacity]) => {
            const ring = new T.Mesh(new T.TorusGeometry(radius, tube, 6, 112), new T.MeshBasicMaterial({ color: index ? 0xf2c14e : 0x22e07a, transparent: true, opacity, depthWrite: false }));
            ring.rotation.set(tilt, turn, .2); orbits.add(ring);
          });
          group.add(body, orbits); scene.add(group); return { group, body, orbits };
        });
        canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; stop(); fallback.canvas.hidden = false; canvas.hidden = true; });
        canvas.addEventListener('webglcontextrestored', () => { lost = false; canvas.hidden = false; fallback.canvas.hidden = true; resize(); requestFrame(); });
        stage.appendChild(canvas); fallback.canvas.hidden = true; resize(); requestFrame();
      } catch (_) {
        renderer?.dispose(); renderer = null; canvas?.remove(); fallback.canvas.hidden = false; stage.dataset.jr38Fallback = 'true'; updateControl();
      } finally { loading = false; }
    }
    function refresh() {
      updateControl();
      if (connection?.saveData) { stop(); fallback.canvas.hidden = false; if (canvas) canvas.hidden = true; return; }
      if (renderer && !lost) { canvas.hidden = false; fallback.canvas.hidden = true; }
      if (!isVisible()) { stop(); return; }
      resize(); start(); if (!isMoving()) stop(); requestFrame();
    }
    toggle.addEventListener('click', () => {
      preference = preference === 'off' ? 'on' : 'off';
      try { localStorage.setItem(MOTION_KEY, preference); } catch (_) {} refresh();
    });
    stage.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || !isMoving()) return;
      const rect = stage.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    document.addEventListener('visibilitychange', refresh); window.addEventListener('pageshow', refresh);
    reduced.addEventListener?.('change', refresh); connection?.addEventListener?.('change', refresh);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize', resize, { passive: true });
    if (window.IntersectionObserver) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; refresh(); }, { threshold: .01 }).observe(stage);
    } else {
      const check = () => { const r = stage.getBoundingClientRect(); visible = r.bottom > 0 && r.top < innerHeight; refresh(); };
      window.addEventListener('scroll', check, { passive: true }); check();
    }
    instance = { refresh, inspect: () => ({ rendererCount: renderer ? 1 : 0, running: !!raf, elapsed, rotation: balls.map(ball => ball.body.rotation.y), moving: isMoving(), fallback: !fallback.canvas.hidden, canvas }) };
    refresh(); return instance;
  }
  window.JRSceneV38 = { mount, loadThree, inspect: () => instance?.inspect() || null };
  // Kept for existing integrations. Remount is idempotent and never resets rotation.
  window.LJR_V369 = { version: '38.0', remount: mount, go: view => window.showView?.(view === 'cup' ? 'bracket' : view) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
