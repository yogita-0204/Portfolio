import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

const FALLBACK = { major: 'rgba(25,21,16,0.1)', accent: 'rgba(33,51,214,0.6)' };

/**
 * Decorative topographic texture: concentric sine-perturbed blobs, 1px strokes.
 * Colors come from the theme tokens (--grid-major / --accent) and re-read on
 * theme flips so the field matches whichever scope it sits in.
 */
export default function ContourField({ className = '', lineCount = 8 }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement('canvas');
    canvas.className = 'pointer-events-none block h-full w-full';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();

    let colors = { ...FALLBACK };
    let size = { w: 1, h: 1 };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        major: cs.getPropertyValue('--grid-major').trim() || FALLBACK.major,
        accent: cs.getPropertyValue('--accent').trim() || FALLBACK.accent,
      };
    };

    const draw = (t) => {
      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.46;
      const rot = t * 0.04; // whole field turns imperceptibly slowly

      for (let i = 0; i < lineCount; i += 1) {
        const k = (i + 1) / lineCount;
        const inner = i >= lineCount - 2; // innermost rings carry the accent tint
        ctx.strokeStyle = inner ? colors.accent : colors.major;
        ctx.globalAlpha = inner ? 0.55 : 1;
        ctx.beginPath();
        const steps = 140;
        for (let j = 0; j <= steps; j += 1) {
          const a = (j / steps) * Math.PI * 2;
          // Per-line phase offset is small (0.15/line) on purpose: rings stay
          // irregular but never cross each other.
          const wob =
            1 +
            0.14 * Math.sin(3 * a + 0.9 + i * 0.15) +
            0.08 * Math.sin(5 * a - t * 0.4 + i * 0.15) +
            0.045 * Math.sin(7 * a + 2.1 + i * 0.15);
          const r = k * maxR * wob;
          const x = cx + Math.cos(a + rot) * r;
          const y = cy + Math.sin(a + rot) * r;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let onScreen = true;
    let last = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      if (now - last < 40) return; // ~24fps cap — contour drift needs nothing faster
      last = now;
      draw(now * 0.00013);
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

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(host);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // cap DPR — retina cost, no visual gain
      size = { w: host.clientWidth || 1, h: host.clientHeight || 1 };
      canvas.width = Math.round(size.w * dpr);
      canvas.height = Math.round(size.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS px so strokes stay 1px
      // width/height assignment wipes the canvas — repaint the static frame so
      // it survives resize events wherever rAF is throttled.
      draw(0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Theme flips change token values — repaint the static frame immediately.
    const mo = new MutationObserver(() => {
      readColors();
      draw(0);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    readColors();
    resize();
    if (!reduced) sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lineCount is a mount-time choice
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
