import { Children, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

const STACK_TOP = 'calc(68px + 16px)'; // clears the fixed header when a card parks

const CSS = `
.stack-item { position: static; }
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .stack-item { position: sticky; top: ${STACK_TOP}; }
}
`;

/**
 * React Bits — ScrollStack (adapted from Components/ScrollStack, JS variant).
 * Cards pile via position:sticky (no ScrollTrigger pinning); gsap only ties
 * each card's inner div to the NEXT card's approach — it scales to ~0.94,
 * dims to 0.75 and lifts slightly as the next one slides over. Below 768px or
 * with reduced motion, the CSS media query drops sticky and gsap is skipped,
 * leaving a plain stacked list.
 */
export default function ScrollStack({ children, className = '', itemClassName = '' }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (prefersReducedMotion() || !window.matchMedia('(min-width: 768px)').matches) return undefined;

    const items = Array.from(root.querySelectorAll(':scope > .stack-item'));
    const triggers = [];

    items.forEach((item, index) => {
      const next = items[index + 1];
      const card = item.firstElementChild;
      if (!next || !card) return;
      // The next card's travel (viewport bottom -> layout top) is this card's
      // clock, so the deflate ends exactly when the new card has covered it.
      const tween = gsap.fromTo(
        card,
        { scale: 1, opacity: 1, y: 0, transformOrigin: '50% 0%' },
        {
          scale: 0.94,
          opacity: 0.75,
          y: -10,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      items.forEach((item) => {
        const card = item.firstElementChild;
        if (card) gsap.set(card, { clearProps: 'transform,opacity' });
      });
    };
  }, [children]);

  const cards = Children.toArray(children);

  return (
    <div ref={rootRef} className={className}>
      <style>{CSS}</style>
      {cards.map((child, index) => (
        <div key={index} className={`stack-item ${itemClassName}`}>
          {/* Inner div is the animation target — transforming the sticky item
              itself would fight the stickiness. */}
          <div>{child}</div>
        </div>
      ))}
    </div>
  );
}
