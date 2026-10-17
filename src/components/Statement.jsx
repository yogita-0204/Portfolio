import { useEffect, useRef } from 'react';
import Section from './ui/Section';
import ScrollReveal from './bits/ScrollReveal';
import ScrollFloat from './bits/ScrollFloat';
import TiltedCard from './bits/TiltedCard';
import { initParallax } from '../utils/motion';
import { personalInfo } from '../data/portfolioData';

// Split the summary at the patent sentence so the two paragraphs stay verbatim.
const BREAK = personalInfo.summary.indexOf('Co-inventor');
const SUMMARY_LEAD = personalInfo.summary.slice(0, BREAK).trim();
const SUMMARY_IMPACT = personalInfo.summary.slice(BREAK).trim();

const META = [
  { key: 'LOCATION', value: personalInfo.location },
  { key: 'EDUCATION', value: "B.Tech CSE · LPU '26" },
  { key: 'FOCUS', value: 'ML Systems · Analytics · UX' },
];

export default function Statement() {
  const scopeRef = useRef(null);

  // Section root is internal to <Section>, so the wrapper div is the parallax scope.
  useEffect(() => initParallax(scopeRef.current), []);

  return (
    <div ref={scopeRef}>
      <Section id="about" label="ABOUT — THE RESEARCHER" figure="FIG. 02">
        <div data-parallax="-6">
          <ScrollReveal
            as="p"
            className="display max-w-[880px] text-[clamp(1.7rem,3.4vw,2.9rem)]"
          >
            Yogita treats every dataset like field evidence — models built to be <em>explained</em>,
            interfaces built to be <em>understood</em>.
          </ScrollReveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <div data-parallax="-8">
              <TiltedCard>
                <div className="plate">
                  <img src="/assets/about-plate.webp" alt="Portrait of Yogita Yadav" loading="lazy" />
                </div>
              </TiltedCard>
              <p className="fig mt-3">FIG. 02.1 — THE SUBJECT, 2026</p>
            </div>
          </div>

          <div className="lg:col-span-3" data-reveal data-reveal-delay="0.06">
            <ul>
              {META.map((row) => (
                <li key={row.key} className="hairline-t py-3.5">
                  <span className="label block">{row.key}</span>
                  <span className="mt-1.5 block text-sm" style={{ color: 'var(--ink)' }}>
                    {row.value}
                  </span>
                </li>
              ))}
              <li className="hairline-t py-3.5">
                <span className="label block">STATUS</span>
                <span className="mt-1.5 flex items-center gap-2 text-sm" style={{ color: 'var(--ink)' }}>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  {personalInfo.status}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5" data-reveal data-reveal-delay="0.12">
            <ScrollFloat text={SUMMARY_LEAD} className="body-2" />
            <ScrollFloat text={SUMMARY_IMPACT} className="body-2 mt-5" />
            <div className="mt-8 h-px w-7" style={{ background: 'var(--line-2)' }} />
            <p className="display mt-5 italic" style={{ fontSize: '1.6rem' }}>
              — Yogita Yadav
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
