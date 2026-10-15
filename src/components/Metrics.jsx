import Section from './ui/Section';
import Counter from './bits/Counter';
import { personalInfo } from '../data/portfolioData';

const ROW_GRID =
  'grid grid-cols-1 gap-3 py-8 transition-transform duration-300 group-hover:translate-x-2 lg:grid-cols-[56px_1fr_minmax(0,380px)_1fr] lg:items-baseline lg:gap-8';
const ROW_SHELL =
  'group hairline-b transition-colors duration-300 hover:bg-[var(--accent-soft)]';

export default function Metrics() {
  return (
    <Section
      id="metrics"
      label="BY THE NUMBERS"
      figure="FIG. 03"
      title={
        <>
          Measured, <em>not marketed.</em>
        </>
      }
      lede="Every figure below traces to a shipped project or a granted patent — the receipts live in the sections that follow."
    >
      <ul>
        {/* Patent stat is rendered below as the stamped flagship row, not a Counter. */}
        {personalInfo.stats
          .filter((stat) => stat.label !== 'IoT Hardware Patents')
          .map((stat, i) => (
          <li
            key={stat.label}
            className={ROW_SHELL}
            data-reveal
            data-reveal-delay={String((i * 0.06).toFixed(2))}
          >
            <div className={ROW_GRID}>
              <span className="fig">{String(i + 1).padStart(2, '0')}</span>
              <span className="label" style={{ color: 'var(--ink-2)' }}>
                {stat.label}
              </span>
              <div style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.3rem)', lineHeight: 1 }}>
                <Counter value={stat.value} className="display" />
              </div>
              <span className="fig">{stat.highlight}</span>
            </div>
          </li>
        ))}

        {/* Flagship credential gets a stamped banner row instead of a Counter. */}
        <li className={ROW_SHELL} data-reveal data-reveal-delay="0.24">
          <div className={ROW_GRID}>
            <span aria-hidden="true" className="fig" />
            <span className="label" style={{ color: 'var(--ink-2)' }}>
              IOT HARDWARE PATENT · CO-INVENTOR
            </span>
            <div>
              <span className="stamp">PATENT Nº 01 — GRANTED</span>
            </div>
            {/* Year is absent from portfolioData — verbatim highlight used instead. */}
            <span className="fig">Thermal PCM + ESP32</span>
          </div>
        </li>
      </ul>
    </Section>
  );
}
