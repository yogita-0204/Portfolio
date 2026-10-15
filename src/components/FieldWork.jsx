import { useEffect, useRef } from 'react';
import Section from './ui/Section';
import ScrollStack from './bits/ScrollStack';
import { initParallax } from '../utils/motion';
import { projectsData } from '../data/portfolioData';

// Opaque paper cards so each incoming card fully covers the parked one underneath.
const CARD =
  'mx-auto mb-6 w-full max-w-5xl border border-[color:var(--line)] bg-[color:var(--paper)] p-6 md:p-10';

function ProjectCard({ project, index }) {
  const num = index + 1;
  const no = String(num).padStart(2, '0');
  const hasLinks = Boolean(project.links.github || project.links.figma || project.links.live);

  return (
    <article data-reveal className={CARD}>
      <div className="flex items-center justify-between gap-4">
        <span className="fig">{no}</span>
        <span className="label" style={{ color: 'var(--accent)' }}>
          {project.categoryLabel}
        </span>
      </div>

      <h3 className="display mt-4" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)' }}>
        {project.title}
      </h3>
      <p className="body-2 mt-4 text-[15px]">{project.summary}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ul>
            {project.metrics.map((metric) => (
              <li key={metric.label} className="hairline-t py-3">
                <span className="label block">{metric.label}</span>
                <span className="mt-1.5 block font-mono text-sm" style={{ color: 'var(--ink)' }}>
                  {metric.value}
                </span>
              </li>
            ))}
          </ul>

          <ul className="hairline-t mt-8 pt-6">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="body-2 flex gap-3 py-1.5 text-sm">
                <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>
                  —
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          {/* Parallax stays on the image wrapper only — ScrollStack owns card transforms. */}
          <div data-parallax="-6">
            <div className="plate group overflow-hidden">
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <p className="fig mt-3">
              FIG. 05.{num} — {project.categoryLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Deep-dive rows keep the "full case analysis" claim of the lede — compact spec style. */}
      <ul className="hairline-t mt-8 pt-2">
        {[
          ['PROBLEM', project.deepDive.problem],
          ['SOLUTION', project.deepDive.solution],
          ['ARCHITECTURE', project.deepDive.architecture],
        ].map(([key, value]) => (
          <li key={key} className="hairline-b grid gap-1 py-3 md:grid-cols-[150px_1fr] md:gap-6">
            <span className="label">{key}</span>
            <span className="body-2 text-sm">{value}</span>
          </li>
        ))}
      </ul>

      {hasLinks && (
        <div className="hairline-t mt-8 flex flex-wrap items-center gap-6 pt-6">
          {project.links.github && (
            <a className="link-arrow" href={project.links.github} target="_blank" rel="noopener noreferrer">
              GITHUB ↗
            </a>
          )}
          {project.links.figma && (
            <a className="link-arrow" href={project.links.figma} target="_blank" rel="noopener noreferrer">
              FIGMA ↗
            </a>
          )}
          {project.links.live && project.links.demoLabel && (
            <a className="link-arrow" href={project.links.live}>
              {project.links.demoLabel} ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function FieldWork() {
  const scopeRef = useRef(null);

  // Section root is internal to <Section>, so the wrapper div is the parallax scope.
  useEffect(() => initParallax(scopeRef.current), []);

  return (
    <div ref={scopeRef}>
      <Section
        id="fieldwork"
        label="FIELD WORK — SELECTED PROJECTS"
        figure="FIG. 05"
        inv
        title={
          <>
            Six systems,
            <br />
            <em>one method.</em>
          </>
        }
        lede="From churn pipelines to patented hardware — each entry is a full case analysis, not a thumbnail."
      >
        {/* Keep this chain free of overflow-hidden/transform — either breaks the
            stack-item CSS sticky. */}
        <ScrollStack>
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </ScrollStack>
      </Section>
    </div>
  );
}
