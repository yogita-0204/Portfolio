import { Fragment, useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/reveal';

/**
 * React Bits — TextLoop (JS variant).
 * State-driven word cycler: the incoming word rides down from above
 * (translateY -100% -> 0) while the outgoing one is pushed out below
 * (0 -> 100%). Both words share one inline-grid cell (grid-area 1/1) so the
 * box keeps a single line-height and overflow-hidden clips the motion.
 * The first word mounts unanimated; keyed remounts restart the keyframes on
 * every swap. Reduced motion switches instantly with no animation classes.
 */
export default function TextLoop({ words = [], interval = 2200, className = '', accentClassName = '' }) {
  const [state, setState] = useState({ index: 0, prev: null });
  const list = Array.isArray(words) ? words : [];

  useEffect(() => {
    if (list.length < 2) return undefined;
    const id = setInterval(() => {
      setState((s) => ({ index: (s.index + 1) % list.length, prev: s.index }));
    }, Math.max(200, interval));
    return () => clearInterval(id);
  }, [list.length, interval]);

  const reduced = prefersReducedMotion();
  const count = list.length;
  if (!count) return null;

  const current = state.index % count;
  const prev = !reduced && state.prev !== null && state.prev < count ? state.prev : null;

  return (
    <Fragment>
      <span className={className} aria-label={list.join(', ')}>
        <span aria-hidden="true" className="inline-grid overflow-hidden">
          {prev !== null && (
            <span key={`out-${state.prev}`} className={`text-loop-out ${accentClassName}`}>
              {list[prev]}
            </span>
          )}
          <span key={`in-${current}`} className={`${prev !== null ? 'text-loop-in' : ''} ${accentClassName}`}>
            {list[current]}
          </span>
        </span>
      </span>
      <style>{`.text-loop-in, .text-loop-out {
        grid-area: 1 / 1;
        white-space: nowrap;
        will-change: transform;
      }
      .text-loop-in { animation: text-loop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .text-loop-out { animation: text-loop-out 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      @keyframes text-loop-in {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
      @keyframes text-loop-out {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .text-loop-in, .text-loop-out { animation: none; }
      }`}</style>
    </Fragment>
  );
}
