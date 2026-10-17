# Specimen Nº 04 — Yogita Yadav Portfolio Redesign

Status: APPROVED (visual companion, 2026-10-16) — design locked, building.
Direction: "Specimen" — editorial research journal. User request: mix of both themes,
clean, premium, with React Bits components and reference-driven 3D.

## References & what was imported

- **vivek0052.in** (analyzed live via Kimi WebBridge + source): persistent chrome 3D
  object over a technical grid; giant italic serif statements; corner HUD labels with
  live clock; full light⇄dark duality; giant ghost wordmark footer.
- **trionn.com** (analyzed via landing.love captures + live): huge statement typography
  with label/meta columns; "HOLD TO BLAST" interaction prompt → "HOLD TO RUN THE
  MODEL"; pill CTAs; underlined arrow links; alternating dark→light section rhythm.
- **reactbits.dev**: source components used (adapted to JS + theme tokens):
  ScrollReveal, CountUp/Counter, TiltedCard, Magnet, LogoLoop, Crosshair, Halftone (hero plate).

## Design system

- Type: **Gambetta** (display serif + italic accent) · **Switzer** (text) ·
  **JetBrains Mono** (data/labels). Loaded via Fontshare + Google Fonts in index.html.
- Themes: scoped classes `.t-day` (paper #F6F3ED / ink #191510 / Klein blue #2133D6)
  and `.t-night` (graphite #0D0C0A / bone #EAE4DA / periwinkle #8A94FF). Toggle in nav,
  persisted to localStorage, initial value respects prefers-color-scheme.
- **Mixed themes**: Field Work + Exhibit sections render in the OPPOSITE scope
  (`inv` prop on Section) — inverted print rhythm in both themes (Trionn influence).
- Utilities (src/index.css): .container-x, .label, .fig, .display, .h-section,
  .btn/.btn-solid/.btn-accent, .link-arrow, .tagx, .plate, .stamp, .tick-bar,
  .marquee, .grid-bg, .hairline-t/b, .reveal-init + GSAP reveals (src/utils/reveal.js).
- Section shell: src/components/ui/Section.jsx (label + figure + title + lede anatomy).

## Architecture (Vite + React 19 + Tailwind 4, JS only, no new deps)

- src/theme/ThemeProvider.jsx — { theme, toggle, invClass }
- src/components/bits/* — React Bits adaptations (fixed prop APIs)
- src/components/scene/* — ContourField (canvas2d)
- src/components/: Nav, Hero, Ticker, Statement, Metrics, Apparatus, FieldWork, Lab,
  Exhibit, CaseStudies, Credentials, Contact, Footer
- src/data/portfolioData.js — untouched, single source of truth for content
- Backups of the previous site: .backup/src-20261016-0220 (recoverable)

## Section anatomy (locked)

1. Nav — fixed, hairline, specimen label, anchor links, theme toggle, availability pill
2. Hero — "Data, *documented.*", halftone portrait plate + HOLD prompt, HUD corner labels,
   live IST clock, 2 CTAs
3. Ticker — LogoLoop strip (stack keywords)
4. Statement — about statement + portrait plate + meta columns
5. Metrics — counters table + patent stamp row
6. Apparatus — 4 skill category sheets with tick-bars
7. FieldWork (inverted) — 6 index-card case files, one-at-a-time accordion deep-dives
8. Lab — live churn simulator (ported logic from old TerminalLab)
9. Exhibit (inverted) — granted IoT patent as certified document
10. CaseStudies — Dabba Garam + Kitchenette practice sheets
11. Credentials — education + certifications
12. Contact — "Say Hi." + socials + meta
13. Footer — ghost wordmark + IST clock + fine print

## Constraints

- No `any`; functional components; files ≤ 300 lines; Tailwind + system utilities only.
- All colors through tokens (var(--ink), var(--accent)...); no hardcoded hex in components.
- a11y: alt text, aria-labels, focus-visible, prefers-reduced-motion respected.
- Content verbatim from portfolioData.js — no invented facts.
- Native cursor kept (Crosshair HUD is additive); no cursor hijacking.

## Verification

- esbuild syntax check per component; `npm run build` green; dev server renders;
  Kimi WebBridge screenshots (both themes) reviewed against this spec.
