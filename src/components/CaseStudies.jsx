import { useEffect, useRef, useState } from 'react';
import Section from './ui/Section';
import SpotlightCard from './bits/SpotlightCard';
import { initParallax } from '../utils/motion';
import { projectsData } from '../data/portfolioData';

const EASE = 'cubic-bezier(.16,1,.3,1)';
const CASE_IDS = ['dabbagaram-redesign', 'kitchenette-app'];

function Panel({ open, id, children }) {
  // grid-template-rows 0fr→1fr animates auto height without measuring content
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows .55s ${EASE}`,
      }}
    >
      <div id={id} aria-hidden={!open} style={{ minHeight: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function MonoBlock({ heading, text }) {
  return (
    <div>
      <p className="label">{heading}</p>
      <p className="font-mono mt-3 leading-relaxed" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
        {text}
      </p>
    </div>
  );
}

function CaseCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const figma = project.links.figma;
  const panelId = `casestudy-panel-${project.id}`;

  return (
    // grid chain restores stretch through SpotlightCard's inner wrapper so the card still fills the row
    <SpotlightCard className="grid [&>div.relative]:grid">
      <article
        data-reveal
        className="flex flex-col"
        style={{ border: '1px solid var(--line)' }}
      >
        {/* opposite drifts: the pair reads as depth, not slide */}
        <div
          className="p-2.5"
          data-parallax={index === 0 ? '-5' : '5'}
          style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--line)' }}
        >
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          <h3 className="display" style={{ fontSize: '1.3rem' }}>
            {project.title}
          </h3>
          <p className="body-2 text-sm mt-3">{project.summary}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="fig">{metric.label}</p>
                <p className="font-mono mt-1" style={{ fontSize: 12, color: 'var(--ink)' }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <ul className="mt-5">
            {project.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="body-2 text-[13px] py-1 flex gap-3">
                <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>
                  —
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="flex items-center gap-6 flex-wrap">
              {figma ? (
                <a className="link-arrow" href={figma} target="_blank" rel="noopener noreferrer">
                  OPEN FIGMA STUDY ↗
                </a>
              ) : (
                <button
                  type="button"
                  className="link-arrow"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpen((o) => !o)}
                >
                  {open ? 'COLLAPSE ↑' : 'SPECIMEN DETAIL ↓'}
                </button>
              )}
            </div>

            {!figma && (
              <Panel open={open} id={panelId}>
                <div className="grid sm:grid-cols-2 gap-6 pt-6">
                  <MonoBlock heading="PROBLEM" text={project.deepDive.problem} />
                  <MonoBlock heading="SOLUTION" text={project.deepDive.solution} />
                </div>
                <ul className="mt-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  <li className="body-2 text-[13px] py-1 flex gap-3">
                    <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>
                      —
                    </span>
                    <span>{project.highlights[3]}</span>
                  </li>
                </ul>
              </Panel>
            )}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}

export default function CaseStudies() {
  const cases = projectsData.filter((project) => CASE_IDS.includes(project.id));
  const scopeRef = useRef(null);

  // Section root is internal to <Section>, so the wrapper div is the parallax scope.
  useEffect(() => initParallax(scopeRef.current), []);

  return (
    <div ref={scopeRef}>
      <Section
        id="casestudies"
        label="EXHIBITS C–D — PRODUCT DESIGN PRACTICE"
        figure="FIG. 08"
        title={
          <>
            Interfaces,
            <br />
            <em>field-tested.</em>
          </>
        }
        lede="Two self-directed product redesigns — research, information architecture, design system, prototype. The full practice of product thinking, not just the pretty screens."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          {cases.map((project, index) => (
            <CaseCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}
