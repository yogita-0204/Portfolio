import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

const FALLBACK = { major: 'rgba(25,21,16,0.1)', accent: 'rgba(33,51,214,0.6)' };
const PAD = 90; // pointer reach beyond the host box, px
const BUMP_RADIUS = 0.5; // cursor influence radius, fraction of maxR
const BUMP_LIFT = 0.095; // max radial lift under the cursor, fraction of maxR
const RIPPLE_LIFE = 1.15; // seconds per click ripple
const RIPPLE_AMP = 7; // px peak displacement of the traveling wave

/**
 * Decorative topographic texture: concentric sine-perturbed blobs, 1px strokes.
 * Colors come from the theme tokens (--grid-major / --accent) and re-read on
 * theme flips so the field matches whichever scope it sits in.
 *
 * Interactive (React Bits "Topography" treatment on 2D canvas): the terrain
 * rises under the cursor and a click sends a ripple across the rings. Pointer
 * tracking is window-level because the canvas itself stays pointer-events-none
 * (it is purely decorative); clicks on real controls are ignored.
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
    let maxR = 1;

    // Smoothed interaction state — targets are set by pointer events, the
    // draw loop eases toward them so the terrain never snaps.
    const cursor = { x: 0, y: 0, tx: 0, ty: 0, pull: 0, target: 0 };
    const ripples = [];
    let onScreen = true;

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
          const r0 = k * maxR * wob;
          const bx = cx + Math.cos(a + rot) * r0;
          const by = cy + Math.sin(a + rot) * r0;

          let disp = 0;
          if (cursor.pull > 0.01) {
            const d = Math.hypot(bx - cursor.x, by - cursor.y);
            disp += maxR * BUMP_LIFT * cursor.pull * Math.exp(-Math.pow(d / (maxR * BUMP_RADIUS), 2));
          }
          for (let m = 0; m < ripples.length; m += 1) {
            const rip = ripples[m];
            const d = Math.hypot(bx - rip.x, by - rip.y);
            disp +=
              RIPPLE_AMP *
              Math.sin((d / (maxR * 0.5)) * Math.PI * 2 - rip.age * 9) *
              Math.exp(-rip.age * 2.1) *
              Math.exp(-Math.pow(d / (maxR * 1.05), 2));
          }

          const r = r0 + disp;
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
    let last = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      const interacting = cursor.target > 0.02 || cursor.pull > 0.02 || ripples.length > 0;
      // 45fps while the cursor is on the terrain, ~24fps otherwise — the idle
      // drift needs nothing faster and hovers feel laggy under ~30fps.
      if (now - last < (interacting ? 22 : 40)) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const easeIn = Math.min(1, dt * 6);
      cursor.x += (cursor.tx - cursor.x) * easeIn;
      cursor.y += (cursor.ty - cursor.y) * easeIn;
      cursor.pull += (cursor.target - cursor.pull) * Math.min(1, dt * 5);
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].age += dt;
        if (ripples[i].age > RIPPLE_LIFE) ripples.splice(i, 1);
      }
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

    const toLocal = (event) => {
      const rect = host.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        inside:
          event.clientX > rect.left - PAD &&
          event.clientX < rect.right + PAD &&
          event.clientY > rect.top - PAD &&
          event.clientY < rect.bottom + PAD,
      };
    };

    const onMove = (event) => {
      if (event.pointerType === 'touch') return; // touch drags the page, not the terrain
      const p = toLocal(event);
      cursor.tx = p.x;
      cursor.ty = p.y;
      cursor.target = p.inside ? 1 : 0;
    };

    const onDown = (event) => {
      if (event.target.closest('a,button')) return; // real controls click freely
      const p = toLocal(event);
      if (!p.inside) return;
      ripples.push({ x: p.x, y: p.y, age: 0 });
    };

    const onLeave = () => {
      cursor.target = 0;
    };

    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // cap DPR — retina cost, no visual gain
      size = { w: host.clientWidth || 1, h: host.clientHeight || 1 };
      maxR = Math.min(size.w, size.h) * 0.46;
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
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lineCount is a mount-time choice
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
