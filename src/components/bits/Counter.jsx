import { useEffect, useRef, useState } from 'react';
import { animate, cubicBezier, useInView } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — Counter (adapted from TextAnimations/CountUp count mode, JS variant).
 * Same display-string API as the stub ("$7.2M+", "0.92", "1 Granted"): the
 * numeric core is parsed out, tweened with motion's animate() + upstream's
 * easeOut cubic-bezier while prefix/suffix/decimals/grouping are preserved.
 * `duration` stays in milliseconds (stub contract), `delay` in seconds.
 */
function parseValue(value) {
  const str = String(value);
  const match = str.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)([\s\S]*)$/);
  if (!match) return null;
  const [, prefix, numRaw, suffix] = match;
  const target = parseFloat(numRaw.replace(/,/g, ''));
  if (Number.isNaN(target)) return null;
  const decimals = numRaw.includes('.') ? numRaw.split('.')[1].length : 0;
  const grouped = numRaw.includes(',');
  return { prefix, suffix, target, decimals, grouped };
}

function format(parsed, n) {
  let num = n.toFixed(parsed.decimals);
  if (parsed.grouped) {
    const [int, frac] = num.split('.');
    num = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac ? `.${frac}` : '');
  }
  return `${parsed.prefix}${num}${parsed.suffix}`;
}

const EASE_OUT = cubicBezier(0.33, 1, 0.68, 1);

export default function Counter({ value, duration = 1700, delay = 0, className = '' }) {
  const parsed = parseValue(value);
  const ref = useRef(null);
  const textRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(() =>
    parsed ? format(parsed, prefersReducedMotion() ? parsed.target : 0) : String(value)
  );

  useEffect(() => {
    if (!parsed || !inView) return undefined;
    const final = format(parsed, parsed.target);
    if (prefersReducedMotion()) {
      setDisplay(final);
      return undefined;
    }
    const total = Math.max(0, duration) / 1000;
    const controls = animate(0, 1, {
      duration: total,
      delay: Math.max(0, delay),
      ease: 'linear',
      onUpdate: (p) => {
        const node = textRef.current;
        if (node) node.textContent = format(parsed, parsed.target * EASE_OUT(Math.min(1, Math.max(0, p))));
      },
      onComplete: () => setDisplay(final),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, delay]);

  return (
    <span ref={ref} className={className}>
      <span ref={textRef}>{display}</span>
    </span>
  );
}
