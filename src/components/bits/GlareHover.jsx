/**
 * React Bits — GlareHover (adapted from Animations/GlareHover, JS variant).
 * Hover triggers a skewed highlight bar swept across the surface with a local
 * one-shot keyframe (forwards), so there is no persistent loop and no rAF.
 * glareColor feeds the gradient midpoint; reduced motion disables the sweep.
 */
const CSS = `
.glr-host {
  position: relative;
  overflow: hidden;
}
.glr-bar {
  position: absolute;
  top: -30%;
  bottom: -30%;
  left: 0;
  width: 42%;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-120%) skewX(-18deg);
  will-change: transform, opacity;
}
.glr-host:hover .glr-bar {
  animation: glr-sweep 700ms ease forwards;
}
@keyframes glr-sweep {
  from { opacity: 0; transform: translateX(-120%) skewX(-18deg); }
  15% { opacity: 1; }
  80% { opacity: 1; }
  to { opacity: 0; transform: translateX(120%) skewX(-18deg); }
}
@media (prefers-reduced-motion: reduce) {
  .glr-host:hover .glr-bar { animation: none; }
}
`;

export default function GlareHover({
  children,
  className = '',
  glareColor = 'color-mix(in srgb, var(--paper) 35%, transparent)',
}) {
  return (
    <div className={`glr-host ${className}`}>
      <style>{CSS}</style>
      {/* Sweeps last in paint order: absolutely positioned, so it glides over
          the children without intercepting their pointer events. */}
      <span
        aria-hidden="true"
        className="glr-bar"
        style={{ background: `linear-gradient(105deg, transparent, ${glareColor}, transparent)` }}
      />
      {children}
    </div>
  );
}
