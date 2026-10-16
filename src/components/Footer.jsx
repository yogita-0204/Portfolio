import { useEffect, useState } from 'react';
import TextPressure from './bits/TextPressure';

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
          <span className="label">YOGITA</span>
          <span className="fig" suppressHydrationWarning>IST {time}</span>
          <span className="fig">DESIGNED &amp; BUILT 2026</span>
        </div>

        <div
          aria-hidden="true"
          className="select-none overflow-hidden"
          style={{ marginTop: '3rem' }}
        >
          <TextPressure
            text="Yogita"
            fontFamily='"Roboto Serif", Georgia, serif'
            fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wdth,wght@0,8..144,50..150,100..900;1,8..144,50..150,100..900&display=swap"
            className="!text-[clamp(4.5rem,15vw,12rem)]"
            stroke
            strokeColor="var(--line-2)"
            strokeWidth={1.5}
            textColor="transparent"
            idle="wave"
            idleSpeed={0.6}
            radius={0.6}
            minFontSize={64}
          />
        </div>

        <div
          className="mt-6 flex flex-wrap justify-between gap-3 py-5"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <span className="fig">© 2026 Yogita</span>
          <span className="fig">MADE WITH DATA &amp; RESTRAINT</span>
        </div>
      </div>
    </footer>
  );
}
