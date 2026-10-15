import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — ScrollVelocity (adapted from Animations/ScrollVelocity, JS variant).
 * Velocity-coupled marquee: two identical halves drift at baseVelocity px/s via
 * gsap.ticker; page scroll injects extra speed (down = forward, up = reverse)
 * that eases back to the base drift, so the strip feels dragged by the scroll.
 * The track wraps on one half's width (-50% equivalent) for a seamless loop.
 * Purely decorative — the whole strip is aria-hidden; reduced motion renders
 * one static row with no ticker.
 */
const BOOST_GAIN = 0.5; // scroll px/s -> extra px/s, tuned so a flick reads as a hard pull
const MAX_BOOST = 800; // px/s ceiling so a fast fling can't launch the strip
const DAMP = 4; // 1/s, how fast boost chases the scroll speed / decays to base

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ScrollVelocity({
  items = [],
  className = '',
  itemClassName = '',
  separator = '·',
  baseVelocity = 40,
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !items.length || prefersReducedMotion()) return undefined;

    let half = track.scrollWidth / 2;
    let x = 0;
    let boost = 0;
    let prevY = window.scrollY;

    const measure = () => {
      half = track.scrollWidth / 2;
    };

    const tick = (time, deltaTime) => {
      const dt = Math.max(0.001, Math.min(deltaTime, 64) / 1000); // clamp tab-restore spikes
      const y = window.scrollY;
      const target = clamp(((y - prevY) / dt) * BOOST_GAIN, -MAX_BOOST, MAX_BOOST);
      prevY = y;
      boost += (target - boost) * Math.min(1, dt * DAMP); // lerp: weighted flick, then decay to base
      x -= (baseVelocity + boost) * dt;
      if (half > 0) x = (((x % half) + half) % half) - half; // wrap into (-half, 0]
      track.style.transform = `translateX(${x}px)`;
    };

    gsap.ticker.add(tick);
    // ResizeObserver also catches late webfont swaps that change the half width.
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, [items, baseVelocity]);

  const row = (keyPrefix) => (
    <div className="flex shrink-0">
      {items.map((item, i) => (
        <span key={`${keyPrefix}-${i}`} className={`flex items-center whitespace-nowrap ${itemClassName}`}>
          <span>{item}</span>
          <span className="mx-6 opacity-40 select-none">{separator}</span>
        </span>
      ))}
    </div>
  );

  if (prefersReducedMotion()) {
    return (
      <div aria-hidden="true" className={`overflow-hidden ${className}`}>
        <div className="flex w-max">{row('a')}</div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max" style={{ willChange: 'transform' }}>
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
