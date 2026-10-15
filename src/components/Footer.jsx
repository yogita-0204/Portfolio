import { useEffect, useState } from 'react';
import ScrollVelocity from './bits/ScrollVelocity';

function useIstClock() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const read = () =>
      new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    setTime(read());
    const id = setInterval(() => setTime(read()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Footer() {
  const time = useIstClock();

  return (
    <footer className="hairline-t">
      <div className="container-x pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="label">YOGITA YADAV — SPECIMEN Nº 04</span>
          <span className="fig">IST {time}</span>
          <span className="fig">DESIGNED &amp; BUILT 2026</span>
        </div>

        <div
          aria-hidden="true"
          className="select-none overflow-hidden"
          style={{ marginTop: '3rem', marginBottom: '-0.18em' }}
        >
          {/* outline wordmark: unlayered .display outranks utilities, so conflicting props need ! */}
          <ScrollVelocity
            items={['YOGITA YADAV']}
            baseVelocity={24}
            className="display uppercase text-transparent! leading-[0.8]! tracking-[-0.02em]! text-[clamp(5rem,19vw,16rem)] [-webkit-text-stroke:1.5px_var(--line-2)]"
          />
        </div>

        <div
          className="mt-6 flex flex-wrap justify-between gap-3 py-5"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <span className="fig">© 2026 Yogita Yadav</span>
          <span className="fig">MADE WITH DATA &amp; RESTRAINT</span>
        </div>
      </div>
    </footer>
  );
}
