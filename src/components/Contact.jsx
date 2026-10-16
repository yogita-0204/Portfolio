import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Mail, MapPin } from 'lucide-react';
import Section from './ui/Section';
import ContourField from './scene/ContourField';
import Magnet from './bits/Magnet';
import GlareHover from './bits/GlareHover';
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

/**
 * The address is deliberately visible (recruiters copy it; hiding it just
 * breaks the one action this section exists for) and paired with a copy
 * button so no one has to replay the mailto flow. Obfuscation is skipped:
 * the string ships in the JS bundle anyway, so splits/reversals are theater.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      clearTimeout(timer.current);
      // Reset once the confirmation had time to read; longer just strands the label.
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.warn('[contact] clipboard write failed', error);
    }
  };

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
      {/* Decorative contour texture — sits in the section's empty right half.
          It reacts to the cursor and ripples on clicks anywhere in the section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-60px] top-6 hidden h-[500px] w-[500px] lg:block"
      >
        <ContourField className="h-full w-full" />
      </div>

      <div data-reveal>
        <Magnet strength={10}>
          <GlareHover
            className="inline-block rounded-full"
            glareColor="color-mix(in srgb, var(--on-accent) 40%, transparent)"
          >
            <div
              className="flex items-stretch overflow-hidden rounded-full transition-[filter] duration-200 hover:brightness-[1.06]"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2.5 py-4 pr-4 pl-4 text-[12.5px] font-medium tracking-[0.01em] sm:pr-5 sm:pl-7 sm:text-[15px]"
              >
                <Mail size={16} aria-hidden="true" />
                {personalInfo.email}
              </a>
              <span
                className="my-3.5 w-px opacity-25"
                style={{ background: 'currentColor' }}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
                className="flex items-center gap-2 py-4 pr-4 pl-4 sm:pr-6"
              >
                {copied ? (
                  <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
                <span
                  className="fig"
                  style={{ color: 'inherit', letterSpacing: '0.14em' }}
                  aria-hidden="true"
                >
                  {copied ? 'COPIED' : 'COPY'}
                </span>
              </button>
            </div>
          </GlareHover>
        </Magnet>
        {/* Announce the copy for screen readers; the button label also flips. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>
        <p className="fig mt-3 ml-1 opacity-80">Click to open your mail app — or copy the address.</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4" data-reveal data-reveal-delay="0.06">
        <span className="fig flex items-center gap-1.5">
          <MapPin size={12} aria-hidden="true" />
          {personalInfo.location}
        </span>
        <span className="fig flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none"
              style={{ background: 'var(--accent)', animationDuration: '2.2s' }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </span>
          {personalInfo.status}
        </span>
      </div>

      <div className="mt-12 flex gap-3" data-reveal data-reveal-delay="0.12">
        {socials.map((social) => (
          <Magnet key={social.label} strength={6}>
            <a
              href={social.href}
              aria-label={social.label}
              {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group relative flex items-center justify-center transition-[background-color,color,translate] duration-200 hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              style={{ width: 46, height: 46, border: '1px solid var(--line-2)', borderRadius: 999 }}
            >
              {social.glyph}
              <span className="fig pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {social.label}
              </span>
            </a>
          </Magnet>
        ))}
      </div>
    </Section>
  );
}
