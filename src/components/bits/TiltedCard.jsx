import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — TiltedCard (adapted from Components/TiltedCard, JS variant).
 * Ports the upstream rAF spring pipeline: rotateX/rotateY and hover lift are
 * integrated with a critically-damped spring (substepped at 240Hz) instead of
 * CSS transitions, and the glare tracks the pointer via CSS vars. Same prop
 * contract as the stub (children/className/max/scale/glare).
 */
const OMEGA = 20 * Math.pow(0.2, 0.6); // upstream default smoothness (0.6)
const ZETA = 0.82;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const step = (state, key, target, omega, zeta, dt) => {
  const velocity = `v${key}`;
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    state[velocity] += (omega * omega * (target - state[key]) - 2 * zeta * omega * state[velocity]) * h;
    state[key] += state[velocity] * h;
  }
  const settled = Math.abs(target - state[key]) < 0.001 && Math.abs(state[velocity]) < 0.01;
  if (settled) {
    state[key] = target;
    state[velocity] = 0;
  }
  return !settled;
};

const glareStrength = (glare) => (glare === true ? 0.5 : glare === false ? 0 : clamp(Number(glare) || 0, 0, 1));

export default function TiltedCard({ children, className = '', max = 7, scale = 1.012, glare = true }) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const glareOn = glareStrength(glare) > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const strength = glareStrength(glare);
    const amplitude = clamp(max, 0, 60);
    const hoverScale = Math.max(0.5, scale);

    const state = { rx: 0, vrx: 0, ry: 0, vry: 0, lift: 0, vlift: 0 };
    const pointer = { nx: 0, ny: 0, inside: false };
    let raf = 0;
    let last = 0;

    const frame = (now) => {
      raf = 0;
      const dt = clamp((now - last) / 1000 || 0, 0, 0.05);
      last = now;
      let busy = step(state, 'rx', pointer.inside ? -pointer.ny * amplitude : 0, OMEGA, ZETA, dt);
      busy = step(state, 'ry', pointer.inside ? pointer.nx * amplitude : 0, OMEGA, ZETA, dt) || busy;
      busy = step(state, 'lift', pointer.inside ? 1 : 0, OMEGA, Math.max(ZETA, 0.85), dt) || busy;

      const lift = state.lift;
      const turn = 1 + (hoverScale - 1) * lift;
      el.style.transform = `perspective(1000px) rotateX(${state.rx.toFixed(3)}deg) rotateY(${state.ry.toFixed(3)}deg) scale(${turn.toFixed(4)})`;
      el.toggleAttribute('data-active', lift > 0.01);

      const glow = glareRef.current;
      if (glow) {
        const reach = Math.max(amplitude, 1);
        const energy = Math.min(1, Math.hypot(state.rx, state.ry) / reach);
        glow.style.opacity = (strength * Math.max(lift, energy)).toFixed(3);
        glow.style.setProperty('--gx', `${(50 + (state.ry / reach) * 46).toFixed(2)}%`);
        glow.style.setProperty('--gy', `${(50 - (state.rx / reach) * 46).toFixed(2)}%`);
      }
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      pointer.nx = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1);
      pointer.ny = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1, -1, 1);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };

    el.addEventListener('pointerenter', onMove);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', onMove);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
      el.removeAttribute('data-active');
    };
  }, [max, scale, glare]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
      {glareOn && (
        <span
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in srgb, var(--ink) 14%, transparent), transparent 62%)',
            opacity: 0,
          }}
        />
      )}
    </div>
  );
}
