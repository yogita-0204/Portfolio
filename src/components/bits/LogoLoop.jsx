import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — LogoLoop (adapted from Animations/LogoLoop, JS variant).
 * Same string-items API as the stub. Ports upstream's constant-velocity
 * pacing: instead of a fixed sweep time the marquee duration is measured
 * from one copy's width so px/s stays constant regardless of item count;
 * re-measured on resize, item changes and webfont load. The .marquee class
 * in index.css handles the -50% keyframe, hover pause and reduced motion.
 */
const SPEED = 80; // px per second

export default function LogoLoop({ items = [], className = '', itemClassName = '', separator = '·' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !items.length || prefersReducedMotion()) return undefined;

    const measure = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) track.style.animationDuration = `${(half / SPEED).toFixed(2)}s`;
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items]);

  const row = (keyPrefix, hidden = false) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${keyPrefix}-${i}`} className={`flex items-center whitespace-nowrap ${itemClassName}`}>
          <span>{item}</span>
          <span className="mx-6 opacity-40 select-none" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="marquee" style={{ willChange: 'transform' }}>
        {row('a')}
        {row('b', true)}
      </div>
    </div>
  );
}
