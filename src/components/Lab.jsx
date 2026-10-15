import { useEffect, useRef, useState } from 'react';
import Section from './ui/Section';
import Counter from './bits/Counter';

const THRESHOLD_HIGH = 0.65;
const THRESHOLD_LOW = 0.35;

const DEFAULTS = {
  charges: 75,
  tenure: 12,
  contract: 'Month-to-month',
  techCalls: 3,
  internet: 'Fiber optic',
};

// Ported from the deployed simulator (seed 42): logistic score over the
// production feature set, sigmoid + [0.05, 0.95] clamp. Do not retune — the
// footer claim "same logic as the pipeline" depends on this staying exact.
function churnProbability({ charges, tenure, contract, techCalls, internet }) {
  let z = -0.6;
  z += ((charges - 20) / 100) * 1.5;
  z -= ((tenure - 1) / 71) * 2.2;
  if (contract === 'Month-to-month') z += 1.2;
  if (contract === 'One year') z -= 0.6;
  if (contract === 'Two year') z -= 1.4;
  if (techCalls >= 4) z += 0.8;
  else if (techCalls === 0) z += 0.2;
  else z -= 0.4;
  if (internet === 'Fiber optic') z += 0.4;
  else if (internet === 'DSL') z -= 0.2;
  else z -= 0.7;
  return Math.min(Math.max(1 / (1 + Math.exp(-z)), 0.05), 0.95);
}

function recommendation(prob, { tenure, charges, contract }) {
  if (prob >= THRESHOLD_HIGH) {
    if (contract === 'Month-to-month')
      return 'Trigger retention desk — offer a 12-month contract migration with a locked tariff.';
    if (charges > 80) return 'Trigger retention desk — review tariff against usage and issue a loyalty credit.';
    return 'Trigger retention desk — queue a personalised CLV-protection offer.';
  }
  if (prob >= THRESHOLD_LOW) {
    if (tenure < 12) return 'Monitor quarterly — enroll in onboarding nurture before the first renewal window.';
    return 'Monitor quarterly — schedule a satisfaction check-in and watch the next billing cycle.';
  }
  if (tenure < 12) return 'Healthy signal, but early tenure — route into onboarding nurture.';
  return 'Healthy cohort — maintain cadence; surface the upsell path.';
}

function RangeField({ label, display, value, min, max, onChange }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="label">{label}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 cursor-pointer"
        style={{ accentColor: 'var(--accent)', width: '100%' }}
      />
    </div>
  );
}

function SegmentedField({ label, options, value, display, onChange }) {
  return (
    <div className="mb-6">
      <span className="label">{label}</span>
      <div className="mt-3 flex" role="group" aria-label={label}>
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className="-ml-px first:ml-0 cursor-pointer px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors"
              style={{
                border: '1px solid var(--line-2)',
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? 'var(--paper)' : 'var(--ink-2)',
              }}
            >
              {display ? display(option) : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Lab() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [prob, setProb] = useState(() => churnProbability(DEFAULTS));
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setProb(churnProbability(inputs)), 150);
    return () => clearTimeout(id);
  }, [inputs]);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  const set = (key) => (value) => setInputs((prev) => ({ ...prev, [key]: value }));

  const run = () => {
    setProb(churnProbability(inputs));
    setPulse(true);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 300);
  };

  const pct = prob * 100;
  const clvAtRisk = Math.round(inputs.charges * Math.max(72 - inputs.tenure, 6) * prob);
  const verdict =
    prob >= THRESHOLD_HIGH
      ? { text: 'HIGH RISK — INTERVENE NOW', color: 'var(--signal)' }
      : prob >= THRESHOLD_LOW
        ? { text: 'MONITOR QUARTERLY', color: 'var(--ink)' }
        : { text: 'HEALTHY — MAINTAIN', color: 'var(--ink-3)' };

  return (
    <Section
      id="lab"
      label="LIVE APPARATUS — CHURN MODEL"
      figure="FIG. 06"
      title={
        <>
          Run the model
          <br />
          <em>yourself.</em>
        </>
      }
      lede="A deterministic in-browser simulation of the telecom retention system — same feature logic as the deployed FastAPI pipeline, seeded as in production."
    >
      <div data-reveal style={{ border: '1px solid var(--line-2)' }}>
        <div className="grid lg:grid-cols-2">
          <div className="p-6 md:p-8">
            <RangeField
              label="Monthly charges"
              display={`$${inputs.charges}/mo`}
              value={inputs.charges}
              min={20}
              max={120}
              onChange={set('charges')}
            />
            <RangeField
              label="Customer tenure"
              display={`${inputs.tenure} months`}
              value={inputs.tenure}
              min={1}
              max={72}
              onChange={set('tenure')}
            />
            <SegmentedField
              label="Contract term"
              options={['Month-to-month', 'One year', 'Two year']}
              value={inputs.contract}
              onChange={set('contract')}
            />
            <RangeField
              label="Tech support tickets"
              display={`${inputs.techCalls}`}
              value={inputs.techCalls}
              min={0}
              max={8}
              onChange={set('techCalls')}
            />
            <SegmentedField
              label="Broadband tier"
              options={['Fiber optic', 'DSL', 'No']}
              value={inputs.internet}
              display={(option) => (option === 'No' ? 'None (voice)' : option)}
              onChange={set('internet')}
            />
          </div>

          <div className="p-6 md:p-8 lg:border-l" style={{ borderColor: 'var(--line)' }}>
            <span className="label">Churn probability</span>
            <div
              className="mt-3 transition-opacity duration-300"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', opacity: pulse ? 0.4 : 1 }}
            >
              <Counter key={pct.toFixed(2)} value={`${pct.toFixed(0)}%`} className="display" duration={900} />
            </div>
            <div className="tick-bar mt-6">
              <div className="fill" style={{ width: `${pct}%` }} />
              <div className="cap" style={{ left: `${pct}%` }} />
            </div>
            <span className="label mt-4 block" style={{ color: verdict.color }}>
              {verdict.text}
            </span>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <span className="fig">CLV at risk</span>
              <span className="font-mono" style={{ fontSize: 15, color: 'var(--ink)' }}>
                ${clvAtRisk.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="label">Recommended action</span>
              <p className="mt-3 font-mono" style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--ink-2)' }}>
                {recommendation(prob, inputs)}
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-3 p-4"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <button type="button" className="btn btn-solid" onClick={run}>
            RUN MODEL
          </button>
          <span className="fig">SEED 42 · DETERMINISTIC · 35 PYTEST GATES IN PRODUCTION</span>
        </div>
      </div>
    </Section>
  );
}
