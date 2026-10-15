import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import ScrambleText from './bits/ScrambleText';

const LINKS = [
  { label: 'FIELD WORK', href: '#fieldwork' },
  { label: 'APPARATUS', href: '#apparatus' },
  { label: 'LAB', href: '#lab' },
  { label: 'EXHIBIT', href: '#exhibit' },
  { label: 'PRACTICE', href: '#casestudies' },
  { label: 'CONTACT', href: '#contact' },
];

const LINK_CLASS =
  'whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--ink-2)] transition-colors hover:text-[color:var(--ink)] hover:underline underline-offset-4';

const CIRCLE_BTN =
  'grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-full border border-[color:var(--line)] bg-transparent text-[color:var(--ink)] transition-colors hover:border-[color:var(--line-2)]';

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      setScrolled(y > 40); // React bails out when the boolean is unchanged
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-[color:var(--line)] transition-[height] duration-300 ease-out ${
        scrolled ? 'h-[54px]' : 'h-[68px]'
      }`}
      style={{
        background: 'color-mix(in srgb, var(--paper) 82%, transparent)',
        backdropFilter: 'blur(14px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
      }}
    >
      <div className="container-x flex h-full items-center justify-between gap-4">
        <a href="#hero" className="flex items-baseline gap-3">
          <ScrambleText
            as="span"
            text="Y.YADAV"
            className="font-mono text-[12px] font-bold tracking-[0.18em]"
            trigger="hover"
            duration={500}
          />
          <span className="label hidden md:inline">SPECIMEN Nº 04</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={`${LINK_CLASS} p-[10px]`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'night' ? 'Switch to day theme' : 'Switch to night theme'}
            className={CIRCLE_BTN}
          >
            {theme === 'night' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <a
            className="btn btn-solid"
            href="#contact"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.8rem' }}
          >
            SAY HI
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`${CIRCLE_BTN} lg:hidden`}
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute -bottom-px left-0 h-[2px] w-full origin-left bg-[var(--accent)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-[color:var(--line)] lg:hidden"
          style={{ background: 'var(--paper)' }}
        >
          <div className="container-x flex flex-col py-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center border-b border-[color:var(--line)] py-[14px] font-mono text-[12px] uppercase tracking-[0.14em] text-[color:var(--ink-2)] last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
