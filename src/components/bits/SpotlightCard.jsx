/**
 * React Bits — SpotlightCard (adapted from Components/SpotlightCard, JS variant).
 * Pointer position lands in --mx/--my custom props; an absolutely positioned
 * overlay paints a radial accent glow at that point. Hover only toggles CSS
 * opacity, so there is no rAF loop and the glow follows the theme via tokens.
 */
export default function SpotlightCard({ children, className = '', size = 260, as: Tag = 'div' }) {
  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Tag onPointerMove={onPointerMove} className={`group relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)`,
        }}
      />
      {/* Positioned wrapper keeps children above the absolutely positioned glow. */}
      <div className="relative">{children}</div>
    </Tag>
  );
}
