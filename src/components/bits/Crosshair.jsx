import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — Crosshair (adapted from Animations/Crosshair, JS variant).
 * Canvas HUD port: smoothed crosshair lines, axis coordinate tags and a click
 * pulse, device-pixel crisp. Zero-prop API (unchanged); ink/paper colors are
 * resolved from the theme CSS vars and kept in sync through a class
 * MutationObserver on the .scope root, so it follows theme switches. The
 * native cursor always stays visible (upstream hideCursor defaults off).
 */
const FONT = '500 10px "JetBrains Mono", ui-monospace, monospace';
const TAG_H = 16;
const FOLLOW = 0.075; // seconds, follow time constant
const PULSE_LIFE = 0.55;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Crosshair() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      inside: false,
      seen: false,
      presence: 0,
      pulses: [],
    };
    const colors = { ink: '', paper: '', dirty: true };
    const size = { w: 0, h: 0, dpr: 1 };
    let raf = 0;
    let last = 0;

    const resolveColors = () => {
      const styles = getComputedStyle(canvas);
      colors.ink = styles.getPropertyValue('--ink').trim();
      colors.paper = styles.getPropertyValue('--paper').trim();
      colors.dirty = false;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * size.dpr));
      canvas.height = Math.max(1, Math.round(rect.height * size.dpr));
    };

    const crisp = (value) => {
      const odd = Math.round(size.dpr) % 2 ? 0.5 : 0;
      return (Math.round(value * size.dpr) + odd) / size.dpr;
    };

    const tag = (text, x, y, align) => {
      ctx.font = FONT;
      const width = ctx.measureText(text).width + 10;
      const left = clamp(align === 'center' ? x - width / 2 : x, 4, Math.max(4, size.w - width - 4));
      const top = clamp(align === 'middle' ? y - TAG_H / 2 : y, 4, Math.max(4, size.h - TAG_H - 4));
      ctx.fillStyle = colors.ink;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(left, top, width, TAG_H, 3);
      else ctx.rect(left, top, width, TAG_H);
      ctx.fill();
      ctx.fillStyle = colors.paper;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, left + width / 2, top + TAG_H / 2 + 0.5);
    };

    const draw = () => {
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      if (state.presence < 0.002) return;
      const x = crisp(state.x);
      const y = crisp(state.y);

      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.ink;
      ctx.globalAlpha = state.presence * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size.w, y);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size.h);
      ctx.stroke();

      for (const pulse of state.pulses) {
        const t = pulse.age / PULSE_LIFE;
        const eased = 1 - Math.pow(1 - t, 3);
        ctx.globalAlpha = Math.pow(1 - t, 2) * state.presence;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 3 + 30 * eased, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = state.presence * 0.9;
      tag(String(Math.round(state.x)), state.x, 8, 'center');
      tag(String(Math.round(state.y)), 8, state.y, 'middle');
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      raf = 0;
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      if (colors.dirty) resolveColors();
      const follow = 1 - Math.exp(-dt / FOLLOW);
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      const wanted = state.inside ? 1 : 0;
      state.presence += (wanted - state.presence) * (1 - Math.exp(-dt / (wanted ? 0.12 : 0.25)));
      if (Math.abs(wanted - state.presence) < 0.002) state.presence = wanted;
      state.pulses = state.pulses.filter((pulse) => (pulse.age += dt) < PULSE_LIFE);
      draw();
      const settling =
        Math.abs(state.tx - state.x) > 0.05 ||
        Math.abs(state.ty - state.y) > 0.05 ||
        state.presence !== wanted ||
        state.pulses.length > 0;
      if (settling) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      state.tx = event.clientX;
      state.ty = event.clientY;
      if (!state.seen) {
        state.seen = true;
        state.x = state.tx;
        state.y = state.ty;
      }
      state.inside = true;
      wake();
    };
    const onDown = (event) => {
      if (event.pointerType === 'touch') return;
      onMove(event);
      state.pulses.push({ x: event.clientX, y: event.clientY, age: 0 });
      wake();
    };
    const onLeave = () => {
      state.inside = false;
      wake();
    };
    const onThemeChange = () => {
      colors.dirty = true;
      wake();
    };

    resize();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    const themeRoot = canvas.closest('.scope') ?? document.documentElement;
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(themeRoot, { attributes: true, attributeFilter: ['class'] });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      themeObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden h-full w-full md:block"
    />
  );
}
