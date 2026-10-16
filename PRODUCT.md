# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, hiring managers and data/ML teams screening Yogita Yadav for full-time 2026 roles — they scan for role fit, shipped proof, and a fast path to contact. Secondary: freelance design/data clients evaluating whether to commission product-design or analytics work.

## Product Purpose

A personal portfolio that presents Yogita Yadav's work as a documented research record — ML pipelines, analytics, a granted IoT patent, and interface craft. Success means inbound outreach: emails, LinkedIn messages, interview calls.

## Positioning

The portfolio is structured as a scientific specimen journal ("Specimen Nº 04"): every project is a catalogued figure with metrics, method notes and evidence, rather than a generic project grid. This research-journal framing is the differentiator a neighboring portfolio could not truthfully copy.

## Operating Context

Evaluated in short recruiter scans (1–2 minutes, often desktop) and longer client reviews; mobile must hold up too. Built as a Vite + React SPA with a build-time prerender step so no-JS crawlers and AI tools still receive the full rendered page. Content lives in the codebase (`src/data/portfolioData.js`), not a CMS. Deployment target: Vercel, from the GitHub repo `yogita-0204/Portfolio`.

## Capabilities and Constraints

- Single-page portfolio; sections: hero (3D chrome knot), field work (case studies), apparatus, lab, exhibit (patent + certifications), practice (UX case studies), credentials, contact.
- Day/night theme system, default day-first hydration, visitor-persisted; interactive canvas accents follow the theme tokens.
- No backend, no contact form — email is shown openly with a one-click copy button.
- Constraint: the build-time prerender (`scripts/prerender.mjs`) must keep working — every deploy must ship rendered HTML, never an empty SPA shell.
- No downloadable CV is linked on the site (open gap, not a constraint).

## Brand Commitments

- "Yogita Yadav — Specimen Nº 04" is a locked brand device (confirmed): the specimen-catalogue voice, FIG. numbering, mono annotations and research-journal structure are deliberate and future work preserves them.
- Voice: precise, measured, field-notebook formal — "Data, documented."

## Evidence on Hand

- Case studies with metrics in `src/data/portfolioData.js` (Dabba Garam UX redesign, churn/SHAP analytics work, Power BI intelligence) — real and publishable.
- Granted IoT patent, co-inventor (Exhibit section, exploded cross-section diagram).
- LPU final-year Computer Science Engineering; Github/LinkedIn linked and real.
- Absent: no testimonials, client logos, or press exist — future work must not fabricate them.

## Product Principles

1. Evidence over adjectives — every claim pairs with a metric, a figure number, or an artefact.
2. The specimen frame is load-bearing — sections are catalogue plates, not marketing blocks.
3. Two speeds: recruiters scan in minutes, clients study in depth; both paths must hold.
4. Contact stays frictionless — visible email plus one-click copy, no forms.
5. Prerender survives every build — no-JS readers get the real page, not an empty shell.

## Accessibility & Inclusion

Reduced-motion is respected across all animated components (canvas scenes, reveals, pulses); new interactive work must keep that guarantee.
