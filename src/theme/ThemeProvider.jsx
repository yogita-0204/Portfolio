import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

/**
 * Specimen theme system.
 * 'day'   → paper (light)    'night' → graphite (dark)
 * The opposite class is exposed as `invClass` for inverted-print sections
 * (e.g. Field Work on graphite while the rest of the site is on paper).
 */
const ThemeContext = createContext({ theme: 'day', toggle: () => {}, invClass: 't-night' });

function readInitialTheme() {
  if (typeof window === 'undefined') return 'day';
  const saved = window.localStorage.getItem('specimen-theme');
  if (saved === 'day' || saved === 'night') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
}

export function ThemeProvider({ children }) {
  // First client render is always 'day' so hydration matches the build-time
  // prerender (which always snapshots in light mode). The real saved/system
  // theme is adopted in a layout effect, before first paint.
  const [theme, setTheme] = useState('day');

  useLayoutEffect(() => {
    const initial = readInitialTheme();
    if (initial !== 'day') setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('t-day', 't-night');
    root.classList.add(`t-${theme}`);
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem('specimen-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'day' ? 'night' : 'day'));
  const invClass = theme === 'day' ? 't-night' : 't-day';

  return <ThemeContext.Provider value={{ theme, toggle, invClass }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
