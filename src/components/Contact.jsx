import { Mail, MapPin } from 'lucide-react';
import Section from './ui/Section';
import ContourField from './scene/ContourField';
import { personalInfo } from '../data/portfolioData';

// lucide-react v1 dropped brand icons — vendored lucide glyphs instead.
function GithubGlyph({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinGlyph({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socials = [
  { label: 'GitHub', href: personalInfo.github, external: true, glyph: <GithubGlyph /> },
  { label: 'LinkedIn', href: personalInfo.linkedin, external: true, glyph: <LinkedinGlyph /> },
  { label: 'Email', href: `mailto:${personalInfo.email}`, glyph: <Mail size={17} aria-hidden="true" /> },
];

export default function Contact() {
  return (
    <Section
      id="contact"
      label="CORRESPONDENCE"
      figure="FIG. 10"
      title={
        <>
          Say hi —
          <br />
          <em>build something measurable.</em>
        </>
      }
      lede="Open to full-time roles, research collaborations and product work in 2026. The fastest route is email."
    >
      {/* Decorative contour texture — sits in the section's empty right half. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-60px] top-6 hidden h-[500px] w-[500px] lg:block"
      >
        <ContourField className="h-full w-full" />
      </div>

      <a
        className="btn btn-accent"
        style={{ fontSize: '1rem', padding: '1rem 2rem' }}
        href={`mailto:${personalInfo.email}`}
        data-reveal
      >
        <Mail size={16} aria-hidden="true" />
        {personalInfo.email}
      </a>

      <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4" data-reveal data-reveal-delay="0.06">
        <span className="fig flex items-center gap-1.5">
          <MapPin size={12} aria-hidden="true" />
          {personalInfo.location}
        </span>
        <span className="fig flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          />
          {personalInfo.status}
        </span>
      </div>

      <div className="mt-12 flex gap-3" data-reveal data-reveal-delay="0.12">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex items-center justify-center transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            style={{ width: 46, height: 46, border: '1px solid var(--line-2)', borderRadius: 999 }}
          >
            {social.glyph}
          </a>
        ))}
      </div>
    </Section>
  );
}
