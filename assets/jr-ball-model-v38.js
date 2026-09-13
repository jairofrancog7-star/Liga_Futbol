/* Liga JR: original truncated-icosahedron geometry from V37, developed for V38.
 * 12 pentagons and 20 hexagons. No external ball models, textures or marks. */
(function (root) {
  'use strict';
  const add = (a, b) => a.map((x, i) => x + b[i]);
  const mul = (a, n) => a.map(x => x * n);
  const dot = (a, b) => a.reduce((n, x, i) => n + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const unit = a => mul(a, 1 / Math.hypot(...a));
  const CENTERS = [[.78, 1.83], [-.78, -1.83]];
  function panels() {
    const p = (1 + Math.sqrt(5)) / 2;
    const vertices = [[0, 1, p], [0, -1, p], [0, 1, -p], [0, -1, -p], [1, p, 0], [-1, p, 0], [1, -p, 0], [-1, -p, 0], [p, 0, 1], [-p, 0, 1], [p, 0, -1], [-p, 0, -1]].map(unit);
    const edge = (i, j) => Math.abs(dot(vertices[i], vertices[j]) - 1 / Math.sqrt(5)) < 1e-6;
    const cut = (i, j) => unit(add(mul(vertices[i], 2), vertices[j]));
    const result = [];
    function face(points, dark) {
      const center = unit(points.reduce(add, [0, 0, 0]));
      const u = unit(cross(center, Math.abs(center[1]) > .9 ? [1, 0, 0] : [0, 1, 0])), w = cross(center, u);
      points.sort((a, b) => Math.atan2(dot(a, w), dot(a, u)) - Math.atan2(dot(b, w), dot(b, u)));
      result.push({ dark, center, points: points.map(x => unit(add(mul(x, .978), mul(center, .022)))) });
    }
    vertices.forEach((_, i) => face(vertices.flatMap((_, j) => edge(i, j) ? [cut(i, j)] : []), true));
    for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) {
      if (edge(a, b) && edge(b, c) && edge(c, a)) face([cut(a, b), cut(b, a), cut(b, c), cut(c, b), cut(c, a), cut(a, c)], false);
    }
    return result;
  }
  const shape = panels();
  // Equal scale and z for both balls. This envelope fits even fully tilted rings.
  function frame(width, height) {
    const scale = Math.max(6.5 / Math.max(1, width), 8.65 / Math.max(1, height));
    return { halfWidth: width * scale / 2, halfHeight: height * scale / 2, pixelsPerUnit: 1 / scale };
  }
  function mesh(T, gold) {
    const group = new T.Group();
    group.add(new T.Mesh(new T.SphereGeometry(1.51, 40, 28), new T.MeshStandardMaterial({ color: gold ? 0x382817 : 0x082419, roughness: .8 })));
    const materials = [
      new T.MeshPhysicalMaterial({ color: gold ? 0xf2c14e : 0x22e07a, roughness: .39, metalness: .15, clearcoat: .24 }),
      new T.MeshPhysicalMaterial({ color: gold ? 0x59401b : 0x0c3d2b, roughness: .5, metalness: .08, clearcoat: .16 })
    ];
    const stitchMaterial = new T.LineBasicMaterial({ color: gold ? 0xffe4a1 : 0xa7ffcc, transparent: true, opacity: .6 });
    shape.forEach(face => {
      const positions = [];
      function tri(a, b, c, depth) {
        if (depth) {
          const ab = unit(add(a, b)), bc = unit(add(b, c)), ca = unit(add(c, a));
          tri(a, ab, ca, depth - 1); tri(ab, b, bc, depth - 1); tri(ca, bc, c, depth - 1); tri(ab, bc, ca, depth - 1);
        } else positions.push(...mul(a, 1.52), ...mul(b, 1.52), ...mul(c, 1.52));
      }
      face.points.forEach((p, i) => tri(face.center, p, face.points[(i + 1) % face.points.length], 3));
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new T.Float32BufferAttribute(positions.map(x => x / 1.52), 3));
      group.add(new T.Mesh(geometry, materials[face.dark ? 1 : 0]));
      if (face.dark) {
        const points = [];
        face.points.forEach((a, i) => {
          const b = face.points[(i + 1) % face.points.length];
          for (let j = 0; j < 12; j++) points.push(new T.Vector3(...mul(unit(add(mul(a, 1 - j / 12), mul(b, j / 12))), 1.525)));
        });
        group.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(points), stitchMaterial));
      }
    });
    return group;
  }
  function fallback(stage) {
    const canvas = document.createElement('canvas'); canvas.className = 'jr38-ball-fallback'; canvas.setAttribute('aria-hidden', 'true'); stage.appendChild(canvas);
    const context = canvas.getContext('2d');
    function draw() {
      if (!context) return;
      const rect = stage.getBoundingClientRect(), width = rect.width, height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(root.devicePixelRatio || 1, 1.25);
      canvas.width = width * dpr; canvas.height = height * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = frame(width, height).pixelsPerUnit, radius = 1.52 * scale;
      context.clearRect(0, 0, width, height);
      CENTERS.forEach((center, index) => {
        const gold = !!index;
        context.save(); context.translate(width / 2 + center[0] * scale, height / 2 - center[1] * scale);
        context.strokeStyle = gold ? '#f2c14e90' : '#22e07a90'; context.lineWidth = 1;
        [.3, -.6, .85].forEach((angle, i) => { context.beginPath(); context.ellipse(0, 0, (2.08 + i * .03) * scale, radius * (.45 + i * .15), angle, 0, Math.PI * 2); context.stroke(); });
        context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.fillStyle = gold ? '#382817' : '#082419'; context.fill(); context.clip();
        const rotate = a => { const c = .87, s = .493; return [c * a[0] + s * a[2], a[1] * .97 - (c * a[2] - s * a[0]) * .243, a[1] * .243 + (c * a[2] - s * a[0]) * .97]; };
        const faces = shape.map(f => ({ ...f, center: rotate(f.center), points: f.points.map(rotate) })).sort((a, b) => a.center[2] - b.center[2]);
        faces.forEach(face => {
          context.beginPath();
          face.points.forEach((a, i) => {
            const b = face.points[(i + 1) % face.points.length];
            for (let j = 0; j < 16; j++) {
              const p = unit(add(mul(a, 1 - j / 16), mul(b, j / 16)));
              if (!i && !j) context.moveTo(p[0] * radius, -p[1] * radius); else context.lineTo(p[0] * radius, -p[1] * radius);
            }
          });
          context.closePath(); context.fillStyle = face.dark ? gold ? '#59401b' : '#0c3d2b' : gold ? '#f2c14e' : '#22e07a'; context.fill();
          context.strokeStyle = face.dark ? gold ? '#ffdd86' : '#8af2b8' : gold ? '#775d27' : '#185f37'; context.lineWidth = .8; context.stroke();
        });
        const light = context.createRadialGradient(-radius * .4, -radius * .4, radius * .02, radius * .2, radius * .25, radius * 1.13);
        light.addColorStop(0, '#ffffff70'); light.addColorStop(.5, '#00000000'); light.addColorStop(1, '#000000cd');
        context.fillStyle = light; context.fillRect(-radius, -radius, radius * 2, radius * 2); context.restore();
      });
    }
    draw(); return { canvas, draw };
  }
  const api = { mesh, fallback, frame, CENTERS, panels: shape };
  root.JRBallModelV38 = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
