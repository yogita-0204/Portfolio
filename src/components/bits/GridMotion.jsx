/**
 * React Bits — GridMotion (adapted from Backgrounds/GridMotion, JS variant).
 * Pure-CSS perspective floor: two gradient planes tilted into the horizon,
 * rising one grid cell per loop at different speeds/depths to fake parallax.
 * No canvas and no JS loop — and because the gradients use var() live, theme
 * token flips are picked up with zero code. Size/position the root via
 * className (e.g. "absolute inset-0 z-0") and it fills it via .gm-wrap.
 */
const CSS = `
.gm-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 420px;
  pointer-events: none;
}
.gm-plane {
  --gm-tilt: 58deg;
  --gm-speed: 12s;
  position: absolute;
  left: 50%;
  bottom: -22%;
  width: 260%;
  height: 220%;
  margin-left: -130%;
  transform-origin: 50% 100%;
  transform: rotateX(var(--gm-tilt)) translateY(0);
  background-image: linear-gradient(to right, var(--grid-major) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-major) 1px, transparent 1px);
  background-size: 44px 44px;
  /* Decal-space fade: glued to the plane's far rows, so it reads as distance
     fog instead of a hard horizon edge that would move in screen space. */
  mask-image: linear-gradient(to bottom, transparent, #000 32%);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 32%);
  animation: gm-rise var(--gm-speed) linear infinite;
  will-change: transform;
}
.gm-plane--far {
  --gm-tilt: 62deg;
  --gm-speed: 19s;
  opacity: 0.4;
}
.gm-plane--near {
  --gm-tilt: 57deg;
  --gm-speed: 11s;
  opacity: 0.8;
}
/* One full background cell per cycle: translate distance === background-size,
   so the loop restart is invisible. Tilt is a var so each layer keeps its own
   angle inside the same keyframes. */
@keyframes gm-rise {
  from { transform: rotateX(var(--gm-tilt)) translateY(0); }
  to { transform: rotateX(var(--gm-tilt)) translateY(-44px); }
}
@media (prefers-reduced-motion: reduce) {
  .gm-plane { animation: none; }
}
`;

export default function GridMotion({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{CSS}</style>
      <div className="gm-wrap">
        <div className="gm-plane gm-plane--far" />
        <div className="gm-plane gm-plane--near" />
      </div>
    </div>
  );
}
