import ScrollVelocity from './bits/ScrollVelocity';

const ITEMS = [
  'MACHINE LEARNING',
  'SHAP EXPLAINABILITY',
  'POWER BI · DAX',
  'PYTHON',
  'ESP32 · IOT',
  'FASTAPI',
  'DJANGO',
  'FIGMA',
  'SQL',
  'THREE.JS',
  'PYSPARK',
];

export default function Ticker() {
  return (
    <div aria-hidden="true" className="hairline-t hairline-b py-4">
      <ScrollVelocity
        items={ITEMS}
        itemClassName="label text-[11px]! text-[color:var(--ink-2)]!"
        separator="·"
        baseVelocity={40}
      />
    </div>
  );
}
