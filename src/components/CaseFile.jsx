// Index-card case file: compact specimen sheet that expands in place into the
// full case analysis. Closed content stays in the DOM (grid-rows trick) so
// prerender/SEO still capture the deep-dive text.

const CARD =
  'mx-auto mb-6 w-full max-w-5xl border border-[color:var(--line)] bg-[color:var(--paper)] transition-colors duration-300';
const LINKS = 'link-arrow';

function Caret({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 6"
      className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MetricRow({ metric }) {
  return (
    <div className="hairline-t py-3">
      <span className="label block">{metric.label}</span>
      <span className="mt-1.5 block font-mono text-sm" style={{ color: 'var(--ink)' }}>
        {metric.value}
      </span>
    </div>
  );
}

export default function CaseFile({ project, index, open, onToggle }) {
  const num = String(index + 1).padStart(2, '0');
  const regionId = `casefile-${project.id}`;
  const chips = project.metrics.slice(0, 3);
  const hasLinks = Boolean(project.links.github || project.links.figma || project.links.live);

  return (
    <article
      data-reveal
      data-open={open ? 'true' : undefined}
      className={`${CARD} ${open ? 'border-[color:var(--line-2)]' : ''}`}
    >
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between gap-4">
            <span className="fig">{num}</span>
            <span className="label" style={{ color: 'var(--accent)' }}>
              {project.categoryLabel}
            </span>
          </div>
          <h3 className="display mt-4" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)' }}>
            {project.title}
          </h3>
          <p className="body-2 mt-3 text-[15px]">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {chips.map((metric) => (
              <li
                key={metric.label}
                className="border border-[color:var(--line)] px-3 py-1.5"
              >
                <span className="label">{metric.label}</span>{' '}
                <span className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
                  {metric.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          {/* Parallax-free: the accordion owns the vertical rhythm now. */}
          <div className="plate overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
          <p className="fig mt-3">
            FIG. 05.{index + 1} — {project.categoryLabel}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={regionId}
        className="hairline-t flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors duration-300 hover:bg-[var(--accent-soft)] md:px-8"
      >
        <span className="label" style={{ color: 'var(--ink-2)' }}>
          {open ? 'CLOSE CASE FILE' : 'OPEN CASE FILE'}
        </span>
        <Caret open={open} />
      </button>

      <div
        id={regionId}
        role="region"
        aria-label={`${project.title} case file`}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="hairline-t px-6 py-8 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="grid gap-x-10 sm:grid-cols-2">
                  {project.metrics.map((metric) => (
                    <MetricRow key={metric.label} metric={metric} />
                  ))}
                </div>
                <ul className="hairline-t mt-8 pt-6">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="body-2 flex gap-3 py-1.5 text-sm">
                      <span aria-hidden="true" style={{ color: 'var(--ink-2)' }}>
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <span className="label">TECH STACK</span>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="border border-[color:var(--line)] px-2.5 py-1 font-mono text-[11px]"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hairline-t mt-8 pt-2">
              {[
                ['PROBLEM', project.deepDive.problem],
                ['SOLUTION', project.deepDive.solution],
                ['ARCHITECTURE', project.deepDive.architecture],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="hairline-b grid gap-1 py-3 md:grid-cols-[150px_1fr] md:gap-6"
                >
                  <span className="label">{key}</span>
                  <span className="body-2 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {hasLinks && (
              <div className="hairline-t mt-8 flex flex-wrap items-center gap-6 pt-6">
                {project.links.github && (
                  <a className={LINKS} href={project.links.github} target="_blank" rel="noopener noreferrer">
                    GITHUB ↗
                  </a>
                )}
                {project.links.figma && (
                  <a className={LINKS} href={project.links.figma} target="_blank" rel="noopener noreferrer">
                    FIGMA ↗
                  </a>
                )}
                {project.links.live && project.links.demoLabel && (
                  <a className={LINKS} href={project.links.live}>
                    {project.links.demoLabel} ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
