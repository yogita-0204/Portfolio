import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — Magnet (adapted from Animations/Magnet, JS variant).
 * Ports the upstream shared pointer field + registry arbitration: only the
 * nearest magnet inside its reach engages (one set of window listeners for
 * all instances), pull is spring-integrated (stiffness/damping/mass) and
 * falls off with smoothstep near the reach edge. Same prop contract as the
 * stub (children/className/strength where strength = max px pull at the edge).
 */
const SPRING = { stiffness: 170, damping: 16, mass: 1 };
const PADDING = 90; // magnetic reach beyond the wrapper, upstream default is 100

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const reach = (rect, pointer) => {
  const dx = pointer.x - (rect.left + rect.width / 2);
  const dy = pointer.y - (rect.top + rect.height / 2);
  const ox = Math.max(0, Math.abs(dx) - rect.width / 2);
  const oy = Math.max(0, Math.abs(dy) - rect.height / 2);
  return { dx, dy, outside: Math.hypot(ox, oy) };
};

const registry = new Set();
const field = { pointer: null, owner: null };
let detach = null;

const arbitrate = () => {
  let winner = null;
  let nearest = Infinity;
  if (field.pointer) {
    for (const entry of registry) {
      if (entry.reduce) continue;
      const near = reach(entry.wrapper.getBoundingClientRect(), field.pointer);
      if (near.outside <= PADDING && near.outside < nearest) {
        winner = entry;
        nearest = near.outside;
      }
    }
  }
  const previous = field.owner;
  field.owner = winner;
  if (previous && previous !== winner) previous.wake();
  if (winner) winner.wake();
};

const attach = () => {
  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    field.pointer = { x: event.clientX, y: event.clientY };
    arbitrate();
  };
  const onPointerGone = () => {
    field.pointer = null;
    arbitrate();
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', arbitrate, { passive: true, capture: true });
  document.documentElement.addEventListener('pointerleave', onPointerGone);
  window.addEventListener('blur', onPointerGone);
  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', arbitrate, { capture: true });
    document.documentElement.removeEventListener('pointerleave', onPointerGone);
    window.removeEventListener('blur', onPointerGone);
  };
};

export default function Magnet({ children, className = '', strength = 18 }) {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return undefined;

    const reduce = prefersReducedMotion();
    const pull = Math.max(0, strength);
    const current = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    let active = false;

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const entry = { wrapper, reduce, wake };

    const solve = (target, dt) => {
      let resting = true;
      for (const key of ['x', 'y']) {
        const force = SPRING.stiffness * (target[key] - current[key]) - SPRING.damping * velocity[key];
        velocity[key] += (force / SPRING.mass) * dt;
        current[key] += velocity[key] * dt;
        if (Math.abs(target[key] - current[key]) > 0.05 || Math.abs(velocity[key]) > 0.05) resting = false;
      }
      return resting;
    };

    const measure = () => {
      const target = { x: 0, y: 0 };
      if (reduce || !field.pointer || field.owner !== entry) return { target, engaged: false };
      const rect = wrapper.getBoundingClientRect();
      const { dx, dy, outside } = reach(rect, field.pointer);
      if (outside > PADDING) return { target, engaged: false };
      const falloff = 1 - smoothstep(PADDING * 0.5, PADDING, outside);
      target.x = clamp(dx / Math.max(rect.width / 2, 1), -1.6, 1.6) * pull * falloff;
      target.y = clamp(dy / Math.max(rect.height / 2, 1), -1.6, 1.6) * pull * falloff;
      return { target, engaged: true };
    };

    function frame(now) {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      const { target, engaged } = measure();
      if (engaged !== active) {
        active = engaged;
        wrapper.toggleAttribute('data-magnet-active', engaged);
      }
      const steps = Math.ceil(dt / (1 / 120));
      let resting = true;
      for (let i = 0; i < steps; i++) resting = solve(target, dt / steps) && resting;
      if (resting) {
        current.x = target.x;
        current.y = target.y;
        velocity.x = 0;
        velocity.y = 0;
      }
      inner.style.transform =
        resting && !engaged ? '' : `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      if (!resting) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    registry.add(entry);
    if (!detach) detach = attach();

    return () => {
      cancelAnimationFrame(raf);
      inner.style.transform = '';
      wrapper.removeAttribute('data-magnet-active');
      registry.delete(entry);
      if (field.owner === entry) field.owner = null;
      if (!registry.size && detach) {
        detach();
        detach = null;
      }
    };
  }, [strength]);

  return (
    <span ref={wrapperRef} className={`inline-block ${className}`}>
      <span ref={innerRef} className="inline-block" style={{ willChange: 'transform' }}>
        {children}
      </span>
    </span>
  );
}
