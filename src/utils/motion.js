import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './reveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax for [data-parallax] elements inside `scope`.
 * Each element carries its yPercent travel (e.g. data-parallax="-14"); the
 * scrub is keyed to the parent's pass through the viewport (not the element's
 * own visibility), so the drift tracks the section it decorates. Mirrors
 * initReveals: no-ops without a scope or under reduced motion, and returns a
 * cleanup fn for React effect teardown.
 */
export function initParallax(scope, selector = '[data-parallax]') {
  if (!scope || prefersReducedMotion()) return () => {};

  const triggers = [];
  const els = scope.querySelectorAll(selector);

  els.forEach((el) => {
    const yPercent = parseFloat(el.dataset.parallax);
    if (!Number.isFinite(yPercent)) return;

    const tween = gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
  };
}
