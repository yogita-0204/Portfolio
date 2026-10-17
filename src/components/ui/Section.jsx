import { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { initReveals } from '../../utils/reveal';

/**
 * Shared section shell — consistent anatomy for every section:
 * hairline top rule, mono label row (left label / right figure number),
 * display title, lede, then children. `inv` renders the section in the
 * OPPOSITE theme scope (inverted print) regardless of the active theme.
 */
export default function Section({ id, label, figure, title, lede, inv = false, className = '', children }) {
  const { invClass } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    return initReveals(ref.current);
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`scope relative ${inv ? invClass : ''} ${className}`}
    >
      <div className="container-x py-20 md:py-28">
        {(label || title || lede) && (
          <header className="mb-14 md:mb-20">
            <div className="hairline-t" />
            <div className="pt-5 flex items-center justify-between" data-reveal>
              <span className="label">{label}</span>
              {figure && <span className="fig">{figure}</span>}
            </div>
            {title && (
              <h2 className="h-section mt-8 max-w-4xl" data-reveal data-reveal-delay="0.06">
                {title}
              </h2>
            )}
            {lede && (
              <p className="body-2 mt-6 max-w-2xl text-[15px] md:text-base" data-reveal data-reveal-delay="0.12">
                {lede}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
