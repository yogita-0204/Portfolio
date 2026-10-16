---
name: Yogita Yadav — Specimen Nº 04
description: A portfolio designed as a research journal — data, documented.
colors:
  archival-paper: "#f6f3ed"
  paper-plate: "#efeae0"
  number-tab: "#ece7da"
  iron-gall: "#191510"
  iron-gall-soft: "#4a443a"
  iron-gall-muted: "#6e6759"
  laboratory-cobalt: "#2133d6"
  on-cobalt: "#f6f3ed"
  specimen-red: "#c4372b"
  graphite: "#0d0c0a"
  graphite-plate: "#151310"
  bone-ink: "#eae4da"
  lavender-blueprint: "#8a94ff"
  signal-night: "#e0705c"
  hairline: "rgba(25, 21, 16, 0.14)"
  hairline-strong: "rgba(25, 21, 16, 0.32)"
  grid-minor: "rgba(25, 21, 16, 0.055)"
  grid-major: "rgba(25, 21, 16, 0.1)"
typography:
  display:
    fontFamily: "Gambetta, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Gambetta, Georgia, serif"
    fontSize: "clamp(2rem, 4.6vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Switzer, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 500
    letterSpacing: "0.16em"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  pill: "999px"
  media: "16px"
spacing:
  section-y: "80px (mobile) / 112px (desktop)"
  container-x: "clamp(20px, 4vw, 52px)"
  container-max: "1240px"
components:
  button-accent:
    backgroundColor: "{colors.laboratory-cobalt}"
    textColor: "{colors.on-cobalt}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.iron-gall}"
    rounded: "{rounded.pill}"
    padding: "12.5px 24px"
  button-solid:
    backgroundColor: "{colors.iron-gall}"
    textColor: "{colors.archival-paper}"
    rounded: "{rounded.pill}"
    padding: "12.5px 24px"
  label-tag:
    textColor: "{colors.iron-gall-muted}"
    typography: "{typography.label}"
---

# Design System: Yogita Yadav — Specimen Nº 04

## Overview

**Creative North Star: "The Research Journal"**

The site is a field journal that happens to be a portfolio: sections are catalogue plates, every project carries a FIG. number, and annotations sit in the margins in mono type. The system reads as printed evidence — warm paper, iron-gall ink, one laboratory accent — not as a screen product. Density is deliberate and uneven: generous editorial air around display type, tight analytical rows inside data plates.

The component feel is a **measured instrument**: hairline rules instead of shadows, pill actions instead of rounded cards, mono micro-labels instead of icon noise. Two scoped themes are first-class citizens — day is Archival Paper, night is Graphite — and every plate must read correctly in both, including inverted sections that intentionally flip the paper.

**Key Characteristics:**
- Warm paper base with iron-gall text; one cobalt accent per plate.
- Hairline (1px) rules and grid textures carry all structure; shadows are absent.
- Gambetta italic accents paired with JetBrains Mono annotations; Switzer carries body.
- Sections open with a mono label row (label left, FIG. number right) under a hairline.
- Interactive accents are canvas/WebGL artefacts that follow theme tokens live.

## Colors

A two-paper archival palette: warm paper and near-black ink by day, graphite and bone by night, with a single electric accent per theme.

### Primary
- **Laboratory Cobalt** (#2133d6, day) / **Lavender Blueprint** (#8a94ff, night): the only accent. Used for links, italic display accents, the primary CTA pill, active navigation pill, inner contour rings, and `::selection`. Never as body text.
- **On-Cobalt** (#f6f3ed day / #0d0c0a night): text and sheen placed on the accent.

### Secondary
- **Specimen Red** (#c4372b day / #e0705c night): reserved signal color (`--signal`); use only for alerts, warnings, or a single emphatic mark — its rarity is the point.

### Neutral
- **Archival Paper** (#f6f3ed): day page background.
- **Paper Plate** (#efeae0) / **Number Tab** (#ece7da): tonal layering for inset surfaces and figure tabs — depth comes from paper tone, not shadow.
- **Iron Gall** (#191510): day primary text.
- **Iron Gall Soft** (#4a443a): day secondary text.
- **Iron Gall Muted** (#6e6759): mono annotations, figures, captions.
- **Graphite** (#0d0c0a) / **Graphite Plate** (#151310): night page and inset surfaces.
- **Bone Ink** (#eae4da): night primary text.
- **Hairline** (rgba(25,21,16,0.14) day / rgba(234,228,218,0.13) night) and **Hairline Strong** (0.32 alpha): all borders and rules. **Grid Minor** (0.055) / **Grid Major** (0.1): graph-paper textures.

### Named Rules
**The One Accent Rule.** Laboratory Cobalt / Lavender Blueprint is the only chromatic accent; it appears on ≤10% of any plate. Its rarity is the point.

**The Two Papers Rule.** Every component ships with both theme scopes (`.t-day` / `.t-night`). A component that only reads on one paper is unfinished.

## Typography

**Display Font:** Gambetta (with Georgia, serif)
**Body Font:** Switzer (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** An editorial serif with true italics carries the voice; a Swiss-style grotesque carries reading; a mono face acts as the lab's hand — annotations, figures, measurements. The italic accent phrase in cobalt (`What I do`-style two-tone headings) is the signature pairing.

### Hierarchy
- **Display** (600, fluid to viewport, line-height 1.04): hero statements only, with an italic cobalt phrase inside.
- **Headline** (600, clamp(2rem, 4.6vw, 3.6rem), 1.05): section titles; second line is the italic accent.
- **Body** (400, 16px, 1.6): running text at 15–16px; keep lines under ~70ch via `max-w-2xl`.
- **Label** (500, 10.5px, letterspacing 0.16em, uppercase): section labels, chips, button captions.
- **Figure** (400, 10.5px, letterspacing 0.08em): FIG. numbers, metadata rows, tooltips, captions.

### Named Rules
**The Marginalia Rule.** Mono is the lab hand: annotations, numbers, microcopy. Body copy is never mono, display type never mono.

**The Italic Accent Rule.** Display and headline italics take the accent color; roman text never does.

## Layout

A single centered column, `max-width: 1240px`, horizontal padding `clamp(20px, 4vw, 52px)`. Vertical rhythm: sections give `80px` top/bottom on mobile, `112px` on desktop. Every section opens the same way — hairline top rule, then a mono label row (label left, FIG. number right) — and this anatomy is fixed across all ten plates. Grid textures (`32px` minor / `160px` major squares) sit behind select areas as graph paper. Breakpoints follow Tailwind defaults (sm 640 / md 768 / lg 1024). The reference viewport is ~1536×730; the journal is designed for desktop reading with mobile falling back to a single column.

## Elevation & Depth

The system is flat, by doctrine. There is no shadow vocabulary — depth is conveyed through paper tone (`Archival Paper` vs `Paper Plate`), 1px hairlines, and inset number tabs. The single dimensional element is the navigator's glass frame (local soft shadow, backdrop blur) which floats over content. A legacy `--shadow` token exists in both scopes but is unused by components.

### Named Rules
**The Flat Evidence Rule.** Surfaces are flat plates. If something needs emphasis, add a hairline or change the paper tone — never a drop shadow.

## Shapes

Two form languages. Actions and wayfinding are pills (999px radius): buttons, social bubbles, nav pills, the email pill. Evidence surfaces are squared plates with 1px hairlines and no corner rounding. A soft 16px radius is reserved for media/scroll surfaces where imagery needs framing. Icons are 1.5–2px stroke line glyphs, never filled brand marks (brand glyphs are vendored as stroked SVG).

## Components

### Buttons
- **Shape:** pill (999px), 1px border.
- **Primary:** accent background, on-accent text, generous padding (16px 32px for the contact-scale pill, 12.5px 24px standard).
- **Hover / Focus:** brightness 1.08 on accent (background holds); outline buttons fill with ink 8% mix; focus-visible = 2px accent outline at 3px offset.
- **Variants:** `btn-accent` (primary), `btn` outline (default), `btn-solid` (ink fill, paper text).

### Chips / Labels
- **Style:** no background; JetBrains Mono 10.5px, uppercase, letterspacing 0.16em, muted ink. Used as the section label row, metadata and tooltips.

### Cards / Containers
- **Corner Style:** squared (no radius) for evidence plates; 16px for media frames.
- **Background:** `Archival Paper` plates on `Paper Plate` ground (day), `Graphite Plate` on `Graphite` (night); inverted sections flip the pair.
- **Shadow Strategy:** none (see Elevation). **Border:** 1px hairline. **Internal Padding:** 12–24px, tight analytical rows.

### Navigation
- **Style:** floating glass frame (backdrop blur, hairline border, local soft shadow) with pill items; active item is an accent pill with on-accent label. Wordmark in mono caps left; the "Say hi" action is an ink pill right. Mobile collapses to a menu sheet.

### Email Copy Pill (signature)
The contact action: one accent pill split by a 25%-opacity hairline — mail icon + address (mailto) on the left, a mono COPY button on the right that flips to COPIED with a check for 1.8s. The pill carries magnetic pull (Magnet) and a glare sweep on hover, and a mono caption sits beneath: "Click to open your mail app — or copy the address."

## Do's and Don'ts

### Do:
- **Do** keep structure on 1px hairlines and paper tone changes (`--line`, `--paper-2`).
- **Do** use the mono label row (label left / FIG. number right) to open every section.
- **Do** drive every color from the theme tokens so both scopes stay correct; accents re-read tokens live (canvas MutationObserver pattern).
- **Do** guard every animation with `prefers-reduced-motion` and pause off-screen loops via IntersectionObserver.
- **Do** pair every claim with a figure, metric, or FIG. number — evidence over adjectives.

### Don't:
- **Don't** introduce drop shadows on plates (the navigator's glass frame is the only exception).
- **Don't** add a second chromatic accent; Specimen Red stays reserved for signal duty.
- **Don't** set body or display copy in mono, or use italics without the accent/roman split.
- **Don't** fabricate evidence — no testimonials, client logos, or press that do not exist.
- **Don't** break the prerender: every build must emit rendered HTML (`scripts/prerender.mjs`), never an empty SPA shell.
