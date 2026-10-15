import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * Variant tuning is data, not branches — both themes must read as intentional.
 * day  → brighter exposure so chrome sits on paper without washing out.
 * night→ lower exposure + stronger env so the knot separates from graphite.
 */
const VARIANTS = {
  day: { exposure: 1.15, envIntensity: 1.0, color: 0xf3efe7 },
  night: { exposure: 0.85, envIntensity: 1.1, color: 0xe8e2d6 },
};

// Interaction budgets: small on purpose — the knot is a specimen, not a toy.
const TILT_MAX = 0.12; // rad (~7°) of extra tilt at a viewport edge
const SHIFT_MAX = 0.15; // world units the group drifts toward the cursor
const SPIN_SCROLL = 1.2; // rad of extra y-spin per viewport scrolled (hero exit)

export default function ChromeKnot({ className = '', variant = 'day' }) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const tune = VARIANTS[variant] ?? VARIANTS.day;
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = tune.exposure;
    renderer.setClearAlpha(0);

    const canvas = renderer.domElement;
    canvas.className = 'block h-full w-full touch-none select-none';
    host.appendChild(canvas);

    // RoomEnvironment gives the metal something real to mirror — without it,
    // metalness 1.0 renders almost black.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    // One soft key light on top of the env map to sharpen the specular edge.
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3.5, 5, 4);
    scene.add(key);

    const material = new THREE.MeshPhysicalMaterial({
      color: tune.color,
      metalness: 1.0,
      roughness: 0.15,
      envMapIntensity: tune.envIntensity,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
    });

    // Two interlocked knots read as one machined specimen; one shared material.
    const geoMain = new THREE.TorusKnotGeometry(0.92, 0.3, 240, 32, 2, 3);
    const geoRing = new THREE.TorusKnotGeometry(0.6, 0.17, 180, 24, 3, 4);
    const knot = new THREE.Group();
    const meshMain = new THREE.Mesh(geoMain, material);
    const meshRing = new THREE.Mesh(geoRing, material);
    meshRing.rotation.set(Math.PI / 2.2, Math.PI / 3, 0);
    knot.add(meshMain, meshRing);
    // Tumble accumulates in `spin`; the static pose below covers the reduced-motion frame.
    const spin = { x: -0.4, y: 0.6, z: 0.15 };
    knot.rotation.set(spin.x, spin.y, spin.z);
    scene.add(knot);

    // Press state eases toward targets each frame so press/release both feel smooth.
    const press = { boost: 0, boostTo: 0, scale: 1, scaleTo: 1 };

    // Parallax + scroll offsets: listeners only set targets, the frame loop eases values.
    const par = { tx: 0, ty: 0, x: 0, y: 0 };
    const scroll = { target: 0, value: 0 };

    const onDown = (e) => {
      e.stopPropagation(); // hero owns the surrounding copy — no text selection on press
      if (reduced) return;
      press.boostTo = 1;
      press.scaleTo = 1.06;
    };
    const onUp = () => {
      press.boostTo = 0;
      press.scaleTo = 1;
    };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // Viewport-normalized cursor (-1..1) — reacts wherever the pointer is on the page.
    const onPointerMove = (e) => {
      par.tx = (e.clientX / window.innerWidth) * 2 - 1;
      par.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.target = Math.min(1, window.scrollY / window.innerHeight);
    };
    if (!reduced) {
      // Mid-page reload: start already spun instead of easing in from the top.
      scroll.target = scroll.value = Math.min(1, window.scrollY / window.innerHeight);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const render = () => renderer.render(scene, camera);

    let raf = 0;
    let onScreen = true;
    const clock = new THREE.Clock();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05); // clamp tab-restore spikes
      const ease = Math.min(1, dt * 7);
      press.boost += (press.boostTo - press.boost) * ease;
      press.scale += (press.scaleTo - press.scale) * ease;
      par.x += (par.tx - par.x) * ease;
      par.y += (par.ty - par.y) * ease;
      scroll.value += (scroll.target - scroll.value) * ease;
      spin.y += dt * 0.32 * (1 + press.boost * 7);
      spin.x += dt * 0.06;
      // Offsets apply on top of the accumulated spin — adding into it would
      // permanently bend the tumble path.
      knot.rotation.set(
        spin.x - par.y * TILT_MAX,
        spin.y + par.x * TILT_MAX + scroll.value * SPIN_SCROLL,
        spin.z
      );
      knot.position.x = par.x * SHIFT_MAX;
      knot.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.07 - par.y * SHIFT_MAX;
      knot.scale.setScalar(press.scale);
      render();
    };

    // Start/stop the loop rather than skipping frames — off-screen costs zero.
    const sync = () => {
      const should = !reduced && onScreen && !document.hidden;
      if (should && !raf) {
        clock.getDelta(); // drop the paused-time gap so easing doesn't jump
        raf = requestAnimationFrame(frame);
      } else if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(host);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // past 2 buys pixels, not looks
      renderer.setSize(w, h, false); // CSS classes own layout, buffer stays crisp
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) render(); // keep the one static frame correct through resizes
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    apiRef.current = { renderer, materials: [material], render };

    if (reduced) render();
    else sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      scene.environment = null;
      envRT.dispose();
      pmrem.dispose();
      geoMain.dispose();
      geoRing.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scene builds once; variant updates apply below
  }, []);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    const tune = VARIANTS[variant] ?? VARIANTS.day;
    api.renderer.toneMappingExposure = tune.exposure;
    for (const m of api.materials) {
      m.envMapIntensity = tune.envIntensity;
      m.color.setHex(tune.color);
    }
    api.render(); // covers reduced-motion / paused states with a fresh frame
  }, [variant]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
