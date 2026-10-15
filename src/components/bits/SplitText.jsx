import { Fragment, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * React Bits — SplitText (adapted from TextAnimations/SplitText, JS variant).
 * type='chars' splits per character but keeps every char inside an inline-block
 * word wrapper, so the stagger runs per char while words never break mid-word.
 * The visible split units are aria-hidden; one sr-only copy of the string
 * keeps assistive output intact. Reduced motion renders plain text.
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  type = 'chars',
  stagger = 0.02,
  duration = 0.8,
  delay = 0,
  y = 44,
  once = true,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const parts = el.querySelectorAll('[data-split]');
    const from = { opacity: 0, y };
    const to = { opacity: 1, y: 0 };
    if (type !== 'words') {
      // Per-char 3D tilt needs its own perspective, else rotationX reads as a flat squash.
      from.rotationX = -30;
      from.transformPerspective = 600;
      to.rotationX = 0;
    }

    const tween = gsap.fromTo(parts, from, {
      ...to,
      duration,
      delay: Math.max(0, delay),
      ease: 'power3.out',
      stagger,
      scrollTrigger: { trigger: el, start: 'top 88%', once },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(parts, { clearProps: 'transform,opacity' });
    };
  }, [text, type, stagger, duration, delay, y, once]);

  if (prefersReducedMotion()) return <Tag className={className}>{text}</Tag>;

  const words = String(text ?? '').split(' ');

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 ? ' ' : null}
            {type === 'words' ? (
              <span data-split className="inline-block">
                {word}
              </span>
            ) : (
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, ci) => (
                  <span key={ci} data-split className="inline-block">
                    {char}
                  </span>
                ))}
              </span>
            )}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
