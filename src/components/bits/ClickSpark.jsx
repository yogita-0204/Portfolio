import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

const FALLBACK_ACCENT = '#2133d6';
const LIFE = 0.35; // 350ms per burst
const SPARKS_MIN = 9;
const SPARKS_MAX = 12;

/**
 * React Bits — ClickSpark (adapted from Animations/ClickSpark, JS variant).
 * Fixed viewport-wide canvas: every pointerdown spawns a short radial burst
 * that shoots out with ease-out, holds, then fades. The stroke color is read
 * from --accent at spawn time (unless `color` is given) so it follows the
 * theme. The rAF loop only lives while bursts are active — idle costs nothing.
 */
export default function ClickSpark({ color = null }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined; // purely decorative — skip entirely
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const size = { w: 1, h: 1, dpr: 1 };
    let bursts = [];
    let raf = 0;
    let last = 0;

    const accentNow = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return value || FALLBACK_ACCENT;
    };

    const draw = () => {
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      for (const burst of bursts) {
        const p = burst.age / LIFE;
        const ease = 1 - Math.pow(1 - p, 3);
        // Extend fast, hold a beat, then fade — reads as "shoot out, dissolve".
        const alpha = p < 0.45 ? 1 : 1 - (p - 0.45) / 0.55;
        const inner = burst.spread * 0.35 * ease;
        const outer = burst.spread * ease;
        ctx.strokeStyle = burst.color;
        ctx.globalAlpha = alpha;
        for (const seg of burst.segs) {
          ctx.beginPath();
          ctx.moveTo(burst.x + seg.ux * inner, burst.y + seg.uy * inner);
          ctx.lineTo(burst.x + seg.ux * outer * seg.len, burst.y + seg.uy * outer * seg.len);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      bursts = bursts.filter((burst) => (burst.age += dt) < LIFE);
      draw();
      if (bursts.length) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    const onDown = (event) => {
      const count = SPARKS_MIN + Math.floor(Math.random() * (SPARKS_MAX - SPARKS_MIN + 1));
      const phase = Math.random() * Math.PI * 2;
      const segs = [];
      for (let i = 0; i < count; i += 1) {
        const angle = phase + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.22;
        segs.push({ ux: Math.cos(angle), uy: Math.sin(angle), len: 0.7 + Math.random() * 0.3 });
      }
      bursts.push({
        x: event.clientX,
        y: event.clientY,
        age: 0,
        spread: 24 + Math.random() * 12,
        segs,
        color: color || accentNow(),
      });
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR — bursts are tiny
      size.w = Math.max(1, rect.width);
      size.h = Math.max(1, rect.height);
      canvas.width = Math.max(1, Math.round(size.w * size.dpr));
      canvas.height = Math.max(1, Math.round(size.h * size.dpr));
      draw(); // width assignment wipes the canvas — repaint any live bursts
    };

    resize();
    // Fixed canvas tracks the viewport, so the observer also catches DPR moves.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointerdown', onDown, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointerdown', onDown);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
