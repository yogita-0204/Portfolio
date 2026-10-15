import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './ui/Section';
import TiltedCard from './bits/TiltedCard';
import GlareHover from './bits/GlareHover';
import ScrambleText from './bits/ScrambleText';
import { projectsData } from '../data/portfolioData';
import { prefersReducedMotion } from '../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

const patent = projectsData.find((project) => project.id === 'patent-iot-seat');

const MONO = "'JetBrains Mono', monospace";

const LAYERS = [
  { y: 18, label: 'PERFORATED FABRIC' },
  { y: 50, label: 'SENSOR MATRIX' },
  { y: 82, label: 'THERMAL SPREADER' },
  { y: 114, label: 'PCM HONEYCOMB' },
  { y: 146, label: 'PELTIER MODULES' },
];

function SeatSchematic() {
  return (
    <svg
      viewBox="0 0 440 304"
      fill="none"
      role="img"
      aria-label="Exploded cross-section of the smart seat thermal stack — perforated fabric, sensor matrix, thermal spreader, PCM honeycomb and Peltier modules — controlled by an ESP32 linked to a phone over Bluetooth and Wi-Fi."
      className="w-full h-auto"
    >
      <line x1="124" y1="12" x2="124" y2="170" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 3" />

      {LAYERS.map((layer) => (
        <g key={layer.label}>
          <rect x="24" y={layer.y} width="200" height="18" rx="3" stroke="var(--ink-2)" strokeWidth="1" />
          <line x1="224" y1={layer.y + 9} x2="262" y2={layer.y + 9} stroke="var(--ink-3)" strokeWidth="1" />
          <line x1="262" y1={layer.y + 5} x2="262" y2={layer.y + 13} stroke="var(--ink-3)" strokeWidth="1" />
          <text
            x="270"
            y={layer.y + 12}
            fontFamily={MONO}
            fontSize="8"
            letterSpacing="1"
            fill="var(--ink-3)"
          >
            {layer.label}
          </text>
        </g>
      ))}

      <line x1="59" y1="168" x2="59" y2="212" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" />
      <rect x="24" y="212" width="70" height="24" rx="3" stroke="var(--ink-2)" strokeWidth="1" />
      <text x="59" y="227" textAnchor="middle" fontFamily={MONO} fontSize="8" letterSpacing="1" fill="var(--ink-2)">
        ESP32
      </text>

      <line x1="94" y1="220" x2="210" y2="220" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="94" y1="232" x2="210" y2="232" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
      <text x="108" y="214" fontFamily={MONO} fontSize="8" letterSpacing="1" fill="var(--ink-3)">
        BT / WI-FI
      </text>

      <rect x="210" y="206" width="44" height="84" rx="7" stroke="var(--ink-2)" strokeWidth="1" />
      <line x1="222" y1="280" x2="242" y2="280" stroke="var(--ink-3)" strokeWidth="1" />
    </svg>
  );
}

export default function Exhibit() {
  const cardRef = useRef(null);

  // Document card enters tipped back, then lies flat — scrub keyed to the
  // card's own pass through the viewport.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return undefined;

    const tween = gsap.fromTo(
      card,
      { rotateX: 16, y: 40, transformPerspective: 900 },
      {
        rotateX: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 40%', scrub: true },
      }
    );

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(card, { clearProps: 'transform' });
    };
  }, []);

  return (
    <Section
      id="exhibit"
      label="EXHIBIT A — CERTIFIED HARDWARE"
      figure="FIG. 07"
      inv
      title={
        <>
          A patent,
          <br />
          <em>granted.</em>
        </>
      }
      lede="Co-invented IoT seat-temperature regulation — Phase Change Material thermal buffering with active ESP32 control. Filed, examined, granted."
    >
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7" data-reveal>
          <p className="body-2 text-[15px]">{patent.summary}</p>

          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-6"
            style={{ border: '1px solid var(--line-2)', background: 'var(--line)' }}
          >
            {patent.metrics.map((metric) => (
              <div key={metric.label} style={{ background: 'var(--paper)', padding: 12 }}>
                <p className="fig" style={{ fontSize: 10 }}>
                  {metric.label}
                </p>
                <p className="font-mono mt-1" style={{ fontSize: 13, color: 'var(--ink)' }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <ul className="mt-8 pt-6" style={{ borderTop: '1px solid var(--line)' }}>
            {patent.highlights.map((highlight) => (
              <li key={highlight} className="body-2 text-sm py-1.5 flex gap-3">
                <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>
                  —
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4" style={{ border: '1px solid var(--line)' }}>
            <p className="label">SYSTEM CHAIN</p>
            <p className="font-mono mt-3 leading-relaxed" style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              {patent.deepDive.architecture}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5" data-reveal data-reveal-delay="0.06">
          <span className="stamp" style={{ fontSize: 13, padding: '8px 16px' }}>
            <ScrambleText text="GRANTED" trigger="view" />
          </span>

          <div className="mt-6">
            <SeatSchematic />
            <p className="fig mt-3">FIG. 07.a — EXPLODED SECTION, NOT TO SCALE</p>
          </div>

          {/* Certificate card: gsap flattens this wrapper, tilt stays on the inner
              TiltedCard (glare transform would otherwise fight it). Specular sweep
              is white because the document image itself is dark in both scopes. */}
          <div ref={cardRef} className="mt-10">
            <TiltedCard>
              <GlareHover glareColor="rgba(255, 255, 255, 0.22)">
                <div className="plate group overflow-hidden">
                  <img
                    src={patent.image}
                    alt="IoT smart car seat patent prototype"
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </GlareHover>
            </TiltedCard>
          </div>
        </div>
      </div>
    </Section>
  );
}
