import { useEffect, useRef, useState } from 'react';
import Section from './ui/Section';
import SpotlightCard from './bits/SpotlightCard';
import { skillsData } from '../data/portfolioData';
import { prefersReducedMotion } from '../utils/reveal';

function Sheet({ category, index, delay }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <SpotlightCard className="h-full">
      <article
        ref={ref}
        className="border p-6 md:p-8 h-full"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-2)' }}
        data-reveal
        data-reveal-delay={delay}
      >
        <header className="flex items-start justify-between gap-4">
          <h3 className="display" style={{ fontSize: '1.35rem', lineHeight: 1.15 }}>
            {category.name}
          </h3>
          <span className="fig shrink-0">CAT. 0{index + 1}</span>
        </header>

        <p className="body-2 mt-3 mb-7 text-sm">{category.description}</p>

        <ul>
          {category.skills.map((skill) => (
            <li
              key={skill.name}
              className="border-t py-3.5 last:border-b"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {skill.name}
                </span>
                <span className="fig shrink-0">{skill.level}</span>
                <span className="sr-only">level {skill.level} percent</span>
              </div>

              <div className="tick-bar mt-2.5" aria-hidden="true">
                <span className="fill" style={{ width: shown ? `${skill.level}%` : '0%' }} />
                <span className="cap" style={{ left: `${skill.level}%` }} />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {skill.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tagx">
                    {tag}
                  </span>
                ))}
                {skill.tags.length > 3 && <span className="tagx">+{skill.tags.length - 3}</span>}
              </div>
            </li>
          ))}
        </ul>
      </article>
    </SpotlightCard>
  );
}

export default function Apparatus() {
  return (
    <Section
      id="apparatus"
      label="APPARATUS — CAPABILITIES"
      figure="FIG. 04"
      title={
        <>
          The instruments
          <br />
          <em>of the trade.</em>
        </>
      }
      lede="Four working sets — every capability listed has shipped in a real system below."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {skillsData.categories.map((category, index) => (
          <Sheet
            key={category.id}
            category={category}
            index={index}
            delay={String(index * 0.06)}
          />
        ))}
      </div>
    </Section>
  );
}
