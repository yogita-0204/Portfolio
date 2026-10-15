import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — ScrambleText (adapted from TextAnimations/ScrambleText, JS variant).
 * Random glyphs resolve left-to-right into the real string: each frame keeps the
 * already-revealed prefix verbatim and only ever randomizes the unresolved tail,
 * so the final frame lands exactly on the original text. Runs once when the tag
 * is 50% in view (trigger='view') or on mouseenter (trigger='hover'). The real
 * string sits in the tag's aria-label; the animated span is aria-hidden.
 * Reduced motion renders plain text.
 */
const CHARSET = '!<>-_\\/[]{}—=+*^?#';

export default function ScrambleText({
  text,
  className = '',
  as: Tag = 'span',
  trigger = 'view',
  duration = 900,
  fps = 30,
}) {
  const ref = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const span = textRef.current;
    if (!el || !span || prefersReducedMotion()) return undefined;
    const source = String(text ?? '');
    if (!source) return undefined;

    span.textContent = source; // re-sync; a previous run may have mutated the node in place

    const frame = 1000 / Math.max(1, fps);
    const totalFrames = Math.max(1, Math.round(Math.max(1, duration) / frame));
    let timer = 0;
    let observer;

    const start = () => {
      if (timer) return; // already resolving (hover can re-fire mid-run)
      let step = 0;
      timer = window.setInterval(() => {
        step += 1;
        if (step >= totalFrames) {
          span.textContent = source;
          window.clearInterval(timer);
          timer = 0;
          return;
        }
        const revealed = Math.floor((step / totalFrames) * source.length);
        let out = source.slice(0, revealed);
        for (let i = revealed; i < source.length; i += 1) {
          out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
        span.textContent = out;
      }, frame);
    };

    if (trigger === 'hover') {
      el.addEventListener('mouseenter', start);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            start();
            observer.disconnect(); // one-shot: don't re-scramble on every pass
            break;
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
    }

    return () => {
      if (timer) window.clearInterval(timer);
      if (observer) observer.disconnect();
      el.removeEventListener('mouseenter', start);
    };
  }, [text, trigger, duration, fps]);

  if (prefersReducedMotion()) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span ref={textRef} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
