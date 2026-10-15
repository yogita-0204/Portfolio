import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

const FALLBACK = { grid: 'rgba(25,21,16,0.1)', accent: 'rgba(33,51,214,0.85)' };
const FRAME_MS = 25; // ~40fps — repulsion easing needs nothing faster
const EASE = 0.16; // per-frame lerp factor for both push-out and return

/**
 * React Bits — DotGrid (adapted from Backgrounds/DotGrid, JS variant).
 * Canvas dot grid filling its parent: dots within `repulse` px of the cursor
 * push away and tint toward --accent with distance falloff, then lerp back.
 * Static first frame at mount; the rAF loop only runs while the host is on
 * screen (IO-gated, DPR-capped) so off-screen grids cost nothing.
 */
export default function DotGrid({ className = '', spacing = 26, dotRadius = 1.1, repulse = 90 }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement('canvas');
    canvas.className = 'pointer-events-none block h-full w-full';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return undefined;
    }
    const reduced = prefersReducedMotion();

    let colors = { ...FALLBACK };
    const size = { w: 1, h: 1 };
    const pointer = { x: 0, y: 0, active: false };
    let dots = [];
    const maxPush = repulse * 0.42;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        grid: cs.getPropertyValue('--grid-major').trim() || FALLBACK.grid,
        accent: cs.getPropertyValue('--accent').trim() || FALLBACK.accent,
      };
    };

    const rebuild = () => {
      dots = [];
      const cols = Math.ceil(size.w / spacing) + 1;
      const rows = Math.ceil(size.h / spacing) + 1;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          dots.push({ x: (col + 0.5) * spacing, y: (row + 0.5) * spacing, ox: 0, oy: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, size.w, size.h);
      for (const dot of dots) {
        const x = dot.x + dot.ox;
        const y = dot.y + dot.oy;
        const push = Math.min(1, Math.hypot(dot.ox, dot.oy) / maxPush);
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.grid;
        ctx.fill();
        if (push > 0.02) {
          // Accent dot layered on the base dot: alpha tracks current
          // displacement, so the tint fades in/out with the ease instead of
          // snapping at the repulse boundary.
          ctx.globalAlpha = push * 0.9;
          ctx.fillStyle = colors.accent;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    const step = () => {
      const r2 = repulse * repulse;
      for (const dot of dots) {
        let tx = 0;
        let ty = 0;
        if (pointer.active) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < r2) {
            const dist = Math.sqrt(dist2) || 1;
            const force = 1 - dist / repulse;
            tx = (dx / dist) * force * maxPush;
            ty = (dy / dist) * force * maxPush;
          }
        }
        dot.ox += (tx - dot.ox) * EASE;
        dot.oy += (ty - dot.oy) * EASE;
      }
    };

    let raf = 0;
    let onScreen = true;
    let last = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      if (now - last < FRAME_MS) return;
      last = now;
      step();
      draw();
    };

    // Start/stop rather than skip: off-screen loops cost nothing.
    const sync = () => {
      const should = !reduced && onScreen && !document.hidden;
      if (should && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => sync();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR — retina cost, no visual gain
      size.w = host.clientWidth || 1;
      size.h = host.clientHeight || 1;
      canvas.width = Math.round(size.w * dpr);
      canvas.height = Math.round(size.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS px so dot radii stay true
      rebuild();
      // width/height assignment wipes the canvas — repaint the static frame so
      // it survives resizes wherever rAF is throttled.
      draw();
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Theme flips change token values — repaint the static frame immediately.
    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    readColors();
    resize();
    if (!reduced) {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);
      sync();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      canvas.remove();
    };
  }, [spacing, dotRadius, repulse]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
