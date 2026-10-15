import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Play } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useTheme } from '../theme/ThemeProvider';
import { prefersReducedMotion } from '../utils/reveal';
import Magnet from './bits/Magnet';
import SplitText from './bits/SplitText';
import TextLoop from './bits/TextLoop';
import DotGrid from './bits/DotGrid';
import GridMotion from './bits/GridMotion';
import ChromeKnot from './scene/ChromeKnot';

gsap.registerPlugin(ScrollTrigger);

const LEAD = personalInfo.summary.split('. ').slice(0, 2).join('. ');
const SUMMARY_LEAD = LEAD.endsWith('.') ? LEAD : `${LEAD}.`;

// HUD role cycler: "Data Scientist, ML Engineer & UX Product Architect" → 3 roles.
const ROLES = personalInfo.title
  .split(/[,&]/)
  .map((word) => word.trim())
  .filter(Boolean);

function istTime() {
  return new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
}

function IstClock() {
  const [time, setTime] = useState(istTime);

  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="fig">IST {time}</span>;
}

export default function Hero() {
  const { theme } = useTheme();
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const knotRef = useRef(null);
  const dotsRef = useRef(null);

  // Hero exit scrub. gsap.to (never from/fromTo) starts each tween from the
  // element's natural state, so a throttled ticker can never leave anything
  // hidden — values only interpolate toward the exit while scrolling.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const hero = heroRef.current;
    const copy = copyRef.current;
    const knot = knotRef.current;
    const dots = dotsRef.current;
    if (!hero || !copy || !knot || !dots) return undefined;

    const shared = { trigger: hero, start: 'top top', end: 'bottom 40%', scrub: true };
    const tweens = [
      gsap.to(copy, { y: -60, opacity: 0.15, ease: 'none', scrollTrigger: { ...shared } }),
      gsap.to(knot, { y: -40, scale: 1.18, ease: 'none', scrollTrigger: { ...shared } }),
      gsap.to(dots, { opacity: 0, ease: 'none', scrollTrigger: { ...shared } }),
    ];

    return () => {
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[96px] pb-24"
    >
      {/* Background paint order: receding floor → flat major grid → accent wash → dot grid. */}
      <GridMotion className="hero-floor pointer-events-none absolute inset-x-0 bottom-0 h-[55%]" />
      <div aria-hidden="true" className="grid-bg-major pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(at 70% 30%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 60%)',
        }}
      />
      <div ref={dotsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <DotGrid className="h-full w-full" />
      </div>

      <div className="container-x relative z-10">
        <div ref={copyRef} className="max-w-[640px]">
          <div className="hero-enter hairline-b flex items-center justify-between gap-4 pb-4">
            <span className="label">SPECIMEN Nº 04 — PORTFOLIO</span>
            <span className="label hidden sm:inline">LPU · CSE '26</span>
          </div>

          {/* No hero-enter on the h1 — SplitText owns the headline reveal (no double animation). */}
          <h1 className="display mt-10 text-[clamp(2.9rem,7vw,6.2rem)]">
            <SplitText text="Data," type="chars" stagger={0.024} duration={0.9} delay={0.25} />
            <br />
            <SplitText as="em" text="documented." type="chars" stagger={0.024} duration={0.9} delay={0.35} />
          </h1>

          <p
            className="hero-enter body-2 mt-6 max-w-[540px] text-[15px] md:text-base"
            style={{ animationDelay: '0.45s' }}
          >
            {SUMMARY_LEAD}
          </p>

          <div
            className="hero-enter mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '0.6s' }}
          >
            <Magnet>
              <a className="btn btn-solid" href="#fieldwork">
                FIELD WORK <ArrowDown size={14} aria-hidden="true" />
              </a>
            </Magnet>
            <Magnet>
              <a className="btn" href="#lab">
                RUN THE MODEL <Play size={14} aria-hidden="true" />
              </a>
            </Magnet>
          </div>
        </div>
      </div>

      <div className="absolute right-[3vw] top-1/2 hidden -translate-y-1/2 md:block">
        <div ref={knotRef} style={{ width: 'min(44vw, 560px)', height: 'min(44vw, 560px)' }}>
          <ChromeKnot variant={theme} />
        </div>
        <div className="mt-2 flex flex-col items-center">
          <p className="fig">HOLD TO RUN THE MODEL</p>
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-11 bg-[var(--accent)]"
            style={{ animation: 'hero-pulse-line 2.6s ease-in-out infinite' }}
          />
        </div>
      </div>

      <div className="hairline-t absolute inset-x-0 bottom-0 z-10">
        <div className="container-x relative flex items-center justify-between py-4">
          <span aria-hidden="true" className="label absolute bottom-full mb-3 hidden md:block">
            SCROLL ↓
          </span>
          <span className="fig hidden md:inline">BASED IN · PUNJAB, INDIA</span>
          <span className="fig hidden items-baseline gap-1.5 uppercase md:inline-flex">
            ROLE ·
            <TextLoop words={ROLES} />
          </span>
          <IstClock />
        </div>
      </div>

      <style>{`@keyframes hero-pulse-line {
        0%, 100% { transform: scaleX(0.4); opacity: 0.35; }
        50% { transform: scaleX(1); opacity: 0.9; }
      }
      @keyframes hero-enter {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      /* CSS-driven so copy is never gated on JS (LCP + hidden-tab safe). */
      .hero-enter { animation: hero-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
      /* Floor horizon dissolves into the paper instead of ending on a hard line. */
      .hero-floor {
        -webkit-mask-image: linear-gradient(to bottom, transparent, #000 38%);
        mask-image: linear-gradient(to bottom, transparent, #000 38%);
      }
      @media (prefers-reduced-motion: reduce) {
        .hero-enter { animation: none; }
      }`}</style>
    </section>
  );
}
