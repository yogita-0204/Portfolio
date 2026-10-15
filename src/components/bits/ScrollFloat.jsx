import { Fragment, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * React Bits — ScrollFloat (adapted from TextAnimations/ScrollFloat, JS variant).
 * Word-level scrub: words start dimmed (opacity 0.14) and resolve to full ink as
 * the block crosses the viewport, so the reader wipes the paragraph in. Scrub
 * ties progress to scroll position, the stagger spreads the resolve across it.
 * Reduced motion renders flat text; words stay inline-block with real spaces
 * between them so whitespace renders exactly as authored.
 */
export default function ScrollFloat({ text, className = '', as: Tag = 'p' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const words = el.querySelectorAll('[data-float]');
    const tween = gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(words, { clearProps: 'opacity' });
    };
  }, [text]);

  if (prefersReducedMotion()) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={className}>
      {String(text ?? '')
        .split(' ')
        .map((word, i) => (
          <Fragment key={i}>
            {i > 0 ? ' ' : null}
            <span data-float className="inline-block">
              {word}
            </span>
          </Fragment>
        ))}
    </Tag>
  );
}
