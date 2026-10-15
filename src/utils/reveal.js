import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll-reveal for [data-reveal] elements inside `scope`.
 * Elements are only hidden (reveal-init) when JS runs, so without JS
 * everything stays visible. `data-reveal-delay` (seconds) staggers groups.
 * Returns a cleanup fn for React effect teardown.
 */
export function initReveals(scope, selector = '[data-reveal]') {
  if (!scope || prefersReducedMotion()) return () => {};

  const triggers = [];
  const els = scope.querySelectorAll(selector);

  els.forEach((el) => {
    el.classList.add('reveal-init');
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: parseFloat(el.dataset.revealDelay || '0'),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
    els.forEach((el) => el.classList.remove('reveal-init'));
  };
}

export { prefersReducedMotion };
