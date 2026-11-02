/**
 * Three.js background: 28 wireframe meshes (14 under 768px) drifting behind
 * the page. Fixed transparent canvas, pointer-events none. Rendering pauses
 * while the tab is hidden, and with prefers-reduced-motion a single static
 * frame is rendered instead.
 */
import * as THREE from 'three';

const canvas = document.getElementById('bg3d') as HTMLCanvasElement | null;

if (canvas) {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 768;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const PALETTE = [0x121212, 0xfbff48, 0xff70a6, 0x3b82f6];
  const geometries = [
    new THREE.BoxGeometry(3.5, 3.5, 3.5),
    new THREE.IcosahedronGeometry(3),
    new THREE.OctahedronGeometry(3),
    new THREE.TorusGeometry(2.5, 0.8, 8, 16),
  ];

  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const materials: THREE.MeshBasicMaterial[] = [];
  const count = isSmall ? 14 : 28;

  // Protected central region: meshes never spawn inside it, so wireframes
  // stay clear of the hero heading, tagline panel and buttons (content sits
  // above the canvas; the exclusion keeps the centre visually clean).
  const SAFE_X = 26;
  const SAFE_Y = 20;
  const spawnPosition = () => {
    for (let attempt = 0; attempt < 40; attempt++) {
      const x = rand(-37.5, 37.5);
      const y = rand(-37.5, 37.5);
      if (Math.abs(x) >= SAFE_X || Math.abs(y) >= SAFE_Y) return { x, y };
    }
    // Fallback: push to the nearest horizontal edge.
    const side = Math.random() < 0.5 ? -1 : 1;
    return { x: side * rand(SAFE_X, 37.5), y: rand(-37.5, 37.5) };
  };

  for (let i = 0; i < count; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    });
    const mesh = new THREE.Mesh(geometry, material);
    const pos = spawnPosition();
    mesh.position.set(pos.x, pos.y, rand(-17.5, 17.5));
    mesh.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI));
    mesh.userData.spin = {
      x: rand(0.002, 0.0075) * (Math.random() < 0.5 ? -1 : 1),
      y: rand(0.002, 0.0075) * (Math.random() < 0.5 ? -1 : 1),
    };
    materials.push(material);
    meshes.push(mesh);
    group.add(mesh);
  }
  scene.add(group);

  // Mouse follow (fine pointers only) + scroll tilt, both eased at 0.05.
  // Rotation is bounded so meshes never swing from the side bands into the
  // protected centre.
  const MAX_SWING = 0.28; // radians
  let mouseX = 0;
  let mouseY = 0;
  let scrollTilt = 0;

  const onPointerMove = (e: PointerEvent) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onScroll = () => {
    scrollTilt = Math.min(window.scrollY * 0.0003, 0.3);
  };
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !isSmall) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  const renderFrame = () => {
    for (const mesh of meshes) {
      mesh.rotation.x += mesh.userData.spin.x as number;
      mesh.rotation.y += mesh.userData.spin.y as number;
    }
    const targetY = THREE.MathUtils.clamp(mouseX * 0.6, -MAX_SWING, MAX_SWING);
    const targetX = THREE.MathUtils.clamp(mouseY * 0.6 + scrollTilt, -MAX_SWING, MAX_SWING);
    group.rotation.y += (targetY - group.rotation.y) * 0.05;
    group.rotation.x += (targetX - group.rotation.x) * 0.05;
    renderer.render(scene, camera);
  };

  let rafId = 0;
  const loop = () => {
    rafId = requestAnimationFrame(loop);
    if (document.hidden) return; // pause while the tab is hidden
    renderFrame();
  };

  const dispose = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pagehide', dispose);
    for (const mesh of meshes) group.remove(mesh);
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    renderer.dispose();
  };
  window.addEventListener('pagehide', dispose, { once: true });

  if (reduce) {
    renderFrame(); // static frame only
  } else {
    loop();
  }
}
