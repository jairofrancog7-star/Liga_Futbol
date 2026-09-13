/* Deterministic checks of geometry bounds, scene lifetime and motion policy. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const model = require('../assets/jr-ball-model-v38.js');
const source = fs.readFileSync(require.resolve('../assets/football-scene.js'), 'utf8');
assert.equal(model.panels.filter(face => face.dark && face.points.length === 5).length, 12);
assert.equal(model.panels.filter(face => !face.dark && face.points.length === 6).length, 20);
for (const width of [280, 320, 360, 390, 768, 1440]) {
  const frame = model.frame(width, 430);
  for (const center of model.CENTERS) {
    assert.ok(Math.abs(center[0]) + 2.178 < frame.halfWidth, 'All orbit orientations fit horizontally');
    assert.ok(Math.abs(center[1]) + .06 + 2.178 < frame.halfHeight, 'Bobbing and orbits fit vertically');
  }
}

class Node {
  constructor() { this.children = []; this.dataset = {}; this.events = {}; this.rotation = { x: 0, y: 0, z: 0, set(x, y, z) { Object.assign(this, { x, y, z }); } }; this.position = { set(x, y, z) { Object.assign(this, { x, y, z }); } }; this.isConnected = true; }
  add(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.children.push(node); }
  replaceChildren(...nodes) { this.children = nodes; }
  insertAdjacentElement(_, node) { this.adjacent = node; }
  setAttribute(key, value) { this[key] = value; }
  remove() { this.removed = true; }
  addEventListener(type, listener) { (this.events[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.events[type] || []) listener(event); }
  getBoundingClientRect() { return { width: 420, height: 540, top: 0, bottom: 540 }; }
}
async function environment(options = {}) {
  const stage = new Node(), hero = new Node(), doc = new Node(), win = new Node(), reduced = new Node(), connection = new Node();
  const fallback = new Node(), storage = new Map(), frames = new Map();
  let observers = [], nextId = 0, rendererCount = 0;
  reduced.matches = !!options.reduced; connection.saveData = !!options.saveData;
  hero.querySelector = () => stage;
  doc.getElementById = id => id === 'v14CinematicHero' ? hero : null;
  doc.createElement = () => new Node(); doc.readyState = 'complete'; doc.hidden = false; doc.head = new Node();
  class Renderer {
    constructor() { if (options.noWebGL) throw Error('WebGL unavailable'); rendererCount++; }
    setClearColor() {} setPixelRatio() {} setSize() {} render() {} dispose() {}
  }
  class Camera extends Node { updateProjectionMatrix() {} }
  const T = { WebGLRenderer: Renderer, Scene: Node, OrthographicCamera: Camera, HemisphereLight: Node, DirectionalLight: Node, PointLight: Node, Group: Node, Mesh: Node, TorusGeometry: Node, MeshBasicMaterial: Node };
  const context = { window: win, document: doc, navigator: { connection }, matchMedia: () => reduced, localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }, devicePixelRatio: 3, innerHeight: 800, requestAnimationFrame: callback => { frames.set(++nextId, callback); return nextId; }, cancelAnimationFrame: id => frames.delete(id), ResizeObserver: class { observe() {} }, IntersectionObserver: class { constructor(callback) { observers.push(callback); } observe() {} }, setTimeout, clearTimeout };
  Object.assign(win, { THREE: T, ResizeObserver: context.ResizeObserver, IntersectionObserver: context.IntersectionObserver, JRBallModelV38: { ...model, mesh: () => new Node(), fallback: () => ({ canvas: fallback, draw() {} }) } });
  vm.runInNewContext(source, context);
  const intersect = value => observers[0]([{ isIntersecting: value }]);
  intersect(true); await Promise.resolve(); await Promise.resolve();
  return { win, doc, stage, hero, reduced, connection, frames, storage, intersect, rendererCount: () => rendererCount,
    step(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); },
    state: () => win.JRSceneV38.inspect(),
    toggle: () => stage.adjacent.children[0].dispatch('click') };
}
(async () => {
  const env = await environment();
  env.step(100); env.step(116);
  assert.equal(env.rendererCount(), 1);
  const first = env.state(), canvas = first.canvas;
  env.win.JRSceneV38.mount(); env.win.LJR_V369.remount();
  assert.equal(env.rendererCount(), 1, 'Repeated mounts keep the original renderer');
  assert.equal(env.state().canvas, canvas);
  env.intersect(false);
  assert.equal(env.frames.size, 0, 'No RAF loop offscreen');
  env.step(10000); assert.equal(env.state().elapsed, first.elapsed);
  env.intersect(true); env.step(10016);
  assert.equal(env.state().elapsed, first.elapsed, 'Return does not jump to an absolute clock angle');
  env.doc.hidden = true; env.doc.dispatch('visibilitychange'); assert.equal(env.frames.size, 0);
  env.doc.hidden = false; env.doc.dispatch('visibilitychange'); env.step(20000);
  assert.equal(env.state().canvas, canvas, 'Navigation and visibility retain canvas identity');
  env.toggle(); env.step(20016); const stopped = env.state().elapsed;
  assert.equal(env.storage.get('jr-motion-v38'), 'off');
  assert.equal(env.frames.size, 0, 'Paused scene renders once, without a waiting RAF loop');
  env.step(20100); assert.equal(env.state().elapsed, stopped);
  const reduced = await environment({ reduced: true }); reduced.step(100);
  assert.equal(reduced.frames.size, 0); assert.equal(reduced.state().moving, false);
  const saving = await environment({ saveData: true });
  assert.equal(saving.rendererCount(), 0); assert.equal(saving.state().fallback, true);
  const unavailable = await environment({ noWebGL: true });
  assert.equal(unavailable.state().rendererCount, 0); assert.equal(unavailable.state().fallback, true);
  console.log('V38 scene: topology, complete orbit bounds, singleton/persistence, hidden/offscreen pause, motion preference, reduced motion, saveData and WebGL fallback passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
