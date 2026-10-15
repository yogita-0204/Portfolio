import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * React Bits — ScrollReveal (adapted from Animations/AnimatedContent, JS variant).
 * GSAP ScrollTrigger rise+fade: the trigger fires when the element's top crosses
 * (1 - threshold) of the viewport, tweens `y` -> 0 with power3.out, `once`
 * controls whether leaving back reverses the tween. Same prop contract and
 * defaults as the previous stub (as/className/delay/y/threshold/once).
 */
export default function ScrollReveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  y = 20,
  threshold = 0.18,
  once = true,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => gsap.set(el, { clearProps: 'transform,opacity,visibility' }),
    });
    tl.fromTo(
      el,
      { y, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', delay: Math.max(0, delay) }
    );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${(1 - threshold) * 100}%`,
      once,
      onEnter: () => tl.play(),
      onLeaveBack: once ? undefined : () => tl.reverse(),
    });

    return () => {
      trigger.kill();
      tl.kill();
      gsap.set(el, { clearProps: 'all' });
    };
  }, [delay, y, threshold, once]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
