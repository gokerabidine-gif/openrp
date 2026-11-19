import * as THREE from 'three';
import { City } from './world.ts';
import './map-preview.css';

const root = document.querySelector<HTMLElement>('#viewport')!;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 650);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.13;
renderer.outputColorSpace = THREE.SRGBColorSpace;
root.append(renderer.domElement);

const city = new City(scene, renderer);
city.setQuality('low');

let yaw = 0.48;
let pitch = 0.72;
let distance = 112;
let dragging = false;
let lastX = 0;
let lastY = 0;
let elapsed = 0;
const focus = new THREE.Vector3(0, 0, 0);

function placeCamera() {
  const horizontal = Math.cos(pitch) * distance;
  camera.position.set(
    focus.x + Math.sin(yaw) * horizontal,
    focus.y + Math.sin(pitch) * distance,
    focus.z + Math.cos(yaw) * horizontal,
  );
  camera.lookAt(focus);
}
placeCamera();

renderer.domElement.addEventListener('pointerdown', (event) => {
  dragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  yaw -= (event.clientX - lastX) * 0.006;
  pitch = THREE.MathUtils.clamp(pitch + (event.clientY - lastY) * 0.004, 0.12, 1.35);
  lastX = event.clientX;
  lastY = event.clientY;
  placeCamera();
});
const stopDrag = () => { dragging = false; };
renderer.domElement.addEventListener('pointerup', stopDrag);
renderer.domElement.addEventListener('pointercancel', stopDrag);
renderer.domElement.addEventListener('wheel', (event) => {
  distance = THREE.MathUtils.clamp(distance + event.deltaY * 0.07, 32, 190);
  placeCamera();
}, { passive: true });

let pinchStart = 0;
renderer.domElement.addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) {
    pinchStart = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    );
  }
}, { passive: true });
renderer.domElement.addEventListener('touchmove', (event) => {
  if (event.touches.length !== 2 || !pinchStart) return;
  const next = Math.hypot(
    event.touches[0].clientX - event.touches[1].clientX,
    event.touches[0].clientY - event.touches[1].clientY,
  );
  distance = THREE.MathUtils.clamp(distance * pinchStart / Math.max(1, next), 32, 190);
  pinchStart = next;
  placeCamera();
}, { passive: true });

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', resize);

function frame() {
  requestAnimationFrame(frame);
  elapsed += 1 / 60;
  city.update(elapsed, 1 / 60, camera.position);
  renderer.render(scene, camera);
}
frame();