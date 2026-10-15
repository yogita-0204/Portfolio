import Section from './ui/Section';
import SpotlightCard from './bits/SpotlightCard';
import { educationData, certificationsData } from '../data/portfolioData';

export default function Credentials() {
  return (
    <Section
      id="credentials"
      label="APPENDIX — EDUCATION & CERTIFICATIONS"
      figure="FIG. 09"
      title="The paper trail."
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          {educationData.map((item, index) => {
            const isLast = index === educationData.length - 1;
            return (
              <SpotlightCard key={item.institution}>
                <article
                  data-reveal
                  data-reveal-delay={(index * 0.06).toFixed(2)}
                  className="py-6"
                  style={{
                    borderTop: '1px solid var(--line)',
                    borderBottom: isLast ? '1px solid var(--line)' : undefined,
                  }}
                >
                  <p className="fig">{item.period}</p>
                  <h3 className="mt-2 text-[15px] font-medium" style={{ color: 'var(--ink)' }}>
                    {item.degree}
                  </h3>
                  <p className="body-2 mt-1 text-sm">
                    {item.institution} · {item.location}
                  </p>
                  <p className="mt-3 font-mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
                    {item.score}
                  </p>
                </article>
              </SpotlightCard>
            );
          })}
        </div>

        <div>
          {certificationsData.map((cert, index) => (
            <SpotlightCard key={cert.title}>
              <article
                data-reveal
                data-reveal-delay={(0.1 + index * 0.06).toFixed(2)}
                className="mb-4 p-6"
                style={{ border: '1px solid var(--line)' }}
              >
                <span className="label" style={{ color: 'var(--accent)' }}>
                  {cert.issuer}
                </span>
                <h3 className="display mt-2" style={{ fontSize: '1.2rem' }}>
                  {cert.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="tagx">{cert.badge}</span>
                  <span className="fig">{cert.date}</span>
                </div>
                <p className="body-2 mt-3 text-sm">{cert.description}</p>
              </article>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
