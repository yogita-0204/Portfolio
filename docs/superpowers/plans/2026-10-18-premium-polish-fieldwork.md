# Premium Polish + Fieldwork Accordion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise PortfolioY to a premium finish — real-photo specimen plates, consistent FIG system, legible labels, airy rhythm, dead-code cleanup, and Fieldwork restructured from a 7,000px sticky-stack of full-detail cards into a scannable index-card accordion.

**Architecture:** No routing/structure change (single-page stays). Phase A = surgical visual/asset edits across ~7 existing files. Phase B = one new component (`CaseFile.jsx`) + rewrite of `FieldWork.jsx`; accordion expands via CSS `grid-template-rows: 0fr → 1fr` (content stays in DOM for SEO/prerender, no height-measuring JS). `portfolioData.js` is the single content source and is NOT changed.

**Tech Stack:** Vite 6 + React 19 + Tailwind 4 (utility + tiny `index.css` design system), GSAP bits, Python 3 + Pillow (asset pipeline only), WebBridge (visual verification), puppeteer-core prerender (already in build).

**Verification model (no unit-test framework exists in this repo — do NOT add one without asking):** every task verifies via `npm run build` (prerender must stay green), targeted `dist/` greps, and WebBridge screenshots (day + night + 390px). Screenshot scripts live in `C:\Users\nikhi\AppData\Local\Temp\opencode` and use `wbp.py` (session `refs`, daemon `http://127.0.0.1:10086`).

**Environment notes:**
- Dev server: `http://localhost:5173` (already running; HMR applies edits).
- WebBridge daemon: if `Test-NetConnection 127.0.0.1 -Port 10086` fails → `& "$HOME\.kimi-webbridge\bin\kimi-webbridge.exe" start`, then re-`navigate` with `newTab:true` (new daemon = session has no tab).
- PowerShell 5.1: run Python via script files, export `$env:PYTHONIOENCODING='utf-8'` before Python runs that print non-ASCII.
- User's global rules: conventional commits; **ask before `git push`**.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `scripts/make-plates.py` | Create | Pillow pipeline: real PNG → hero webp (clean) + about webp (duotone + grain) |
| `assets-src/` | Create (gitignored) | Original 2.4MB source photo, kept out of `public/` |
| `public/assets/yogita-portrait.webp` | Create | Hero halftone source (clean resize) |
| `public/assets/about-plate.webp` | Create | About section treated plate (ink/paper duotone + grain) |
| `public/assets/yogita-profile.jpg` / `.png` | Delete (after swap verified) | Old assets, replaced |
| `src/data/portfolioData.js:11` | Modify | `profileImage` → `/assets/yogita-portrait.webp` |
| `src/components/Statement.jsx:44,47` | Modify | About plate src + `FIG. 02.1` caption |
| `src/components/Hero.jsx:178` | Modify | Caption → `FIG. 01 — YOGITA YADAV, SPECIMEN Nº 04` |
| `src/index.css:140-154` | Modify | `.label` / `.fig` contrast (`--ink-3` → `--ink-2`), tracking 0.16em → 0.14em |
| `src/components/ui/Section.jsx:27,34,39` | Modify | Header rhythm (mb-14 md:mb-20, mt-8, mt-6) |
| `src/components/Metrics.jsx:6` | Modify | Row padding `py-8` → `py-9` |
| `src/components/CaseFile.jsx` | Create | Index-card accordion case file (compact + expandable detail) |
| `src/components/FieldWork.jsx` | Rewrite | Accordion state, map `projectsData` → `CaseFile`; ScrollStack + parallax removed |
| Dead: `Hero3D.jsx`, `AudioBanner.jsx`, `ProjectModal.jsx`, `AnimatedCounter.jsx`, `scene/ChromeKnot.jsx`, `bits/ScrollStack.jsx` | Delete | Confirmed unused (grep, 2026-10-18) |
| `package.json` | Modify | Remove `three`, `@types/three` (only ChromeKnot imported three) |
| `.gitignore` | Modify | Add `assets-src/` |
| `PRODUCT.md` | Modify | Hero description + fieldwork description refresh |

---

## Phase A — Premium Polish

### Task A1: Plate asset pipeline

**Files:**
- Create: `scripts/make-plates.py`
- Create: `assets-src/` (move source), modify `.gitignore`
- Create: `public/assets/yogita-portrait.webp`, `public/assets/about-plate.webp`

- [ ] **Step 1: Ensure Pillow**

Run: `python -c "import PIL; print(PIL.__version__)"`
Expected: a version like `10.x.x`. If it errors → `pip install pillow` then re-run.

- [ ] **Step 2: Move source out of `public/`, gitignore it**

```powershell
New-Item -ItemType Directory -Force "D:\PortfolioY\assets-src" | Out-Null
Move-Item "D:\PortfolioY\public\assets\yogita-profile.png" "D:\PortfolioY\assets-src\yogita-profile.png"
```

Append to `.gitignore` (create if missing): `assets-src/`

- [ ] **Step 3: Write `scripts/make-plates.py`**

```python
"""Generate specimen plates from the source portrait.

hero  -> clean grayscale-neutral webp (the live WebGL halftone shader does the mono work)
about -> baked duotone (ink <-> paper) + film grain, journal plate for the About section

Run: python scripts/make-plates.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "yogita-profile.png"
OUT = ROOT / "public" / "assets"

INK = (25, 21, 16)      # t-day --ink
PAPER = (246, 243, 237)  # t-day --paper


def load_source(max_w):
    img = Image.open(SRC).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    return img


def hero_plate():
    # Shader samples luminance; a gentle autocontrast keeps the business-suit
    # midtones from collapsing into a single dot size.
    img = load_source(1400)
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    out = Image.merge("RGB", (gray, gray, gray))
    out.save(OUT / "yogita-portrait.webp", quality=84, method=6)


def about_plate():
    img = load_source(1000)
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    duotone = ImageOps.colorize(gray, black=INK, white=PAPER)
    # effect_noise returns mean-128 Gaussian noise; a low blend reads as print grain.
    grain = Image.effect_noise(duotone.size, 24).convert("RGB")
    out = Image.blend(duotone, grain, 0.07)
    out.save(OUT / "about-plate.webp", quality=82, method=6)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    hero_plate()
    about_plate()
    for name in ("yogita-portrait.webp", "about-plate.webp"):
        p = OUT / name
        print(f"{name}: {p.stat().st_size // 1024} KB")
```

- [ ] **Step 4: Run it**

Run: `python scripts\make-plates.py`
Expected: two lines, each roughly `80–200 KB`. If either > 250 KB, lower `quality` by 4 and rerun.

- [ ] **Step 5: Visually inspect both outputs**

Read `public/assets/about-plate.webp` and `public/assets/yogita-portrait.webp` (image preview).
Expected: about-plate = warm paper/ink duotone, face readable, subtle grain; portrait = neutral grayscale, face neither blown nor muddy. If about-plate face is muddy, change `cutoff=1` → `cutoff=0` and/or blend 0.07 → 0.05, rerun.

- [ ] **Step 6: Commit**

```bash
git add scripts/make-plates.py .gitignore public/assets/yogita-portrait.webp public/assets/about-plate.webp
git commit -m "feat(assets): real portrait plates — hero webp + treated about plate"
```

---

### Task A2: Swap assets in code + FIG captions

**Files:**
- Modify: `src/data/portfolioData.js:11`
- Modify: `src/components/Statement.jsx:44,47`
- Modify: `src/components/Hero.jsx:178`
- Check: `index.html` for any `yogita-profile` reference (og:image etc.)

- [ ] **Step 1: Check Hero.jsx line 178 exact text**

Run: `Select-String -Path src\components\Hero.jsx -Pattern "Fig\. 1"`
Expected: `<p className="fig">Fig. 1 — Yogita Yadav, Specimen Nº 04</p>`

- [ ] **Step 2: Apply edits**

`portfolioData.js:11`:
```js
profileImage: "/assets/yogita-portrait.webp",
```

`Statement.jsx:44`:
```jsx
<img src="/assets/about-plate.webp" alt="Portrait of Yogita Yadav" loading="lazy" />
```

`Statement.jsx:47`:
```jsx
<p className="fig mt-3">FIG. 02.1 — THE SUBJECT, 2026</p>
```

`Hero.jsx:178`:
```jsx
<p className="fig">FIG. 01 — YOGITA YADAV, SPECIMEN Nº 04</p>
```

- [ ] **Step 3: Check for other references to the old files**

Run: `Select-String -Path src\**,index.html -Pattern "yogita-profile"` (also grep `public/`)
Expected: no matches. If `index.html` has an og:image with the old path, update it to `/assets/yogita-portrait.webp`.

- [ ] **Step 4: Delete replaced public assets**

```powershell
Remove-Item "D:\PortfolioY\public\assets\yogita-profile.jpg" -ErrorAction SilentlyContinue
```
(Only after Step 3 shows zero references. The `.png` already moved in A1.)

- [ ] **Step 5: Screenshot hero + about (day + night)**

WebBridge eval+shot at `http://localhost:5173/` (1440×900): hero at scrollY 0; Statement ≈ scrollY 1000. Then toggle theme (`button[aria-label^="Switch to"]`) and re-shoot both.
Expected: hero halftone portrait = real photo, plate reads like a specimen print (white backdrop = paper, suit/face = dots); no "docum" clipping after animations settle (wait ~2 s after scroll before shot). About plate = duotone, no warm-illustration clash.

- [ ] **Step 6: Commit**

```bash
git add src/data/portfolioData.js src/components/Statement.jsx src/components/Hero.jsx index.html
git commit -m "feat(hero,about): real-photo plates + FIG 01/02.1 caption system"
```

---

### Task A3: Label & figure legibility

**Files:**
- Modify: `src/index.css:140-154`

- [ ] **Step 1: Edit `.label` and `.fig`**

`.label` block (line 140): `color: var(--ink-3);` → `color: var(--ink-2);` and `letter-spacing: 0.16em;` → `letter-spacing: 0.14em;`

`.fig` block (line 149): `color: var(--ink-3);` → `color: var(--ink-2);`

Do NOT change font-size (10.5px) — layout must not shift.

- [ ] **Step 2: Contrast sanity check**

Day: `#4a443a` on `#f6f3ed` ≈ 8.9:1. Night: `#b9b1a4` on `#0d0c0a` ≈ 9.4:1. Both pass AA for small text with margin.

- [ ] **Step 3: Screenshot skim (both themes, hero + apparatus + fieldwork header)**

Expected: mono labels clearly readable, still secondary to titles (no "competition" with headings). If they now feel TOO strong, revert to `--ink-3` and instead bump `font-weight: 500` → `600` only; re-shoot once.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style(typography): raise label/fig contrast to ink-2, tighten tracking"
```

---

### Task A4: Section rhythm

**Files:**
- Modify: `src/components/ui/Section.jsx:27,34,39`
- Modify: `src/components/Metrics.jsx:6`

- [ ] **Step 1: Edit**

`Section.jsx:27`: `mb-12 md:mb-16` → `mb-14 md:mb-20`
`Section.jsx:34`: `className="h-section mt-7 max-w-4xl"` → `mt-8`
`Section.jsx:39`: `mt-5` → `mt-6`

`Metrics.jsx:6` (`ROW_GRID`): `py-8` → `py-9`
`Metrics.jsx` ROW rows keep everything else.

- [ ] **Step 2: Screenshot metrics + one mid-page section (both themes)**

Expected: visibly airier section tops; metrics rows still dense enough to read as a ledger. No overflow, no clipped reveals.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Section.jsx src/components/Metrics.jsx
git commit -m "style(rhythm): airier section headers and metric rows"
```

---

### Task A5: Dead-code + dependency cleanup

**Files:**
- Delete: `src/components/Hero3D.jsx`, `src/components/AudioBanner.jsx`, `src/components/ProjectModal.jsx`, `src/components/AnimatedCounter.jsx`, `src/components/scene/ChromeKnot.jsx`
- Modify: `package.json` (remove `three`, `@types/three`)

- [ ] **Step 1: Confirm nothing imports them (except each other)**

```powershell
Select-String -Path src\* -Recurse -Pattern "Hero3D|AudioBanner|ProjectModal|AnimatedCounter|ChromeKnot"
```
Expected: only the files' own definitions (and `AnimatedCounter` only inside `Hero3D.jsx`). If anything live imports one, STOP and report.

- [ ] **Step 2: Delete + uninstall**

```powershell
Remove-Item src\components\Hero3D.jsx, src\components\AudioBanner.jsx, src\components\ProjectModal.jsx, src\components\AnimatedCounter.jsx, src\components\scene\ChromeKnot.jsx
npm uninstall three @types/three
```
Keep `src/utils/audioEffects.js` — `TerminalLab.jsx` (live) imports it.

- [ ] **Step 3: Build + bundle check**

Run: `npm run build`
Expected: build green, `[prerender] wrote …` line present; JS chunk size down vs before (note both numbers in the commit body). If `scene/` is now empty, remove the folder too.

- [ ] **Step 4: Commit**

```bash
git add -A src/components package.json package-lock.json
git commit -m "chore(cleanup): remove dead components and orphaned three.js dependency"
```

---

## Phase B — Fieldwork Index-Card Accordion

### Task B1: `CaseFile.jsx` component

**Files:**
- Create: `src/components/CaseFile.jsx` (~170 lines)

Content is fully data-driven from `projectsData` fields (verified present): `id, title, categoryLabel, summary, metrics[{label,value}], techStack[], links{github?,figma?,live?,demoLabel?}, highlights[], deepDive{problem,solution,architecture}, image`.

- [ ] **Step 1: Write `src/components/CaseFile.jsx`**

```jsx
// Index-card case file: compact specimen sheet that expands in place into the
// full case analysis. Closed content stays in the DOM (grid-rows trick) so
// prerender/SEO still capture the deep-dive text.

const CARD =
  'mx-auto mb-6 w-full max-w-5xl border border-[color:var(--line)] bg-[color:var(--paper)] transition-colors duration-300';
const LINKS = 'link-arrow';

function Caret({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 6"
      className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MetricRow({ metric }) {
  return (
    <div className="hairline-t py-3">
      <span className="label block">{metric.label}</span>
      <span className="mt-1.5 block font-mono text-sm" style={{ color: 'var(--ink)' }}>
        {metric.value}
      </span>
    </div>
  );
}

export default function CaseFile({ project, index, open, onToggle }) {
  const num = String(index + 1).padStart(2, '0');
  const regionId = `casefile-${project.id}`;
  const chips = project.metrics.slice(0, 3);
  const hasLinks = Boolean(project.links.github || project.links.figma || project.links.live);

  return (
    <article
      data-reveal
      data-open={open ? 'true' : undefined}
      className={`${CARD} ${open ? 'border-[color:var(--line-2)]' : ''}`}
    >
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between gap-4">
            <span className="fig">{num}</span>
            <span className="label" style={{ color: 'var(--accent)' }}>
              {project.categoryLabel}
            </span>
          </div>
          <h3 className="display mt-4" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)' }}>
            {project.title}
          </h3>
          <p className="body-2 mt-3 text-[15px]">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {chips.map((metric) => (
              <li
                key={metric.label}
                className="border border-[color:var(--line)] px-3 py-1.5"
              >
                <span className="label">{metric.label}</span>{' '}
                <span className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
                  {metric.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          {/* Parallax-free: the accordion owns the vertical rhythm now. */}
          <div className="plate overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
          <p className="fig mt-3">
            FIG. 05.{index + 1} — {project.categoryLabel}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={regionId}
        className="hairline-t flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors duration-300 hover:bg-[var(--accent-soft)] md:px-8"
      >
        <span className="label" style={{ color: 'var(--ink-2)' }}>
          {open ? 'CLOSE CASE FILE' : 'OPEN CASE FILE'}
        </span>
        <Caret open={open} />
      </button>

      <div
        id={regionId}
        role="region"
        aria-label={`${project.title} case file`}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="hairline-t px-6 py-8 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="grid gap-x-10 sm:grid-cols-2">
                  {project.metrics.map((metric) => (
                    <MetricRow key={metric.label} metric={metric} />
                  ))}
                </div>
                <ul className="hairline-t mt-8 pt-6">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="body-2 flex gap-3 py-1.5 text-sm">
                      <span aria-hidden="true" style={{ color: 'var(--ink-2)' }}>
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <span className="label">TECH STACK</span>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="border border-[color:var(--line)] px-2.5 py-1 font-mono text-[11px]"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hairline-t mt-8 pt-2">
              {[
                ['PROBLEM', project.deepDive.problem],
                ['SOLUTION', project.deepDive.solution],
                ['ARCHITECTURE', project.deepDive.architecture],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="hairline-b grid gap-1 py-3 md:grid-cols-[150px_1fr] md:gap-6"
                >
                  <span className="label">{key}</span>
                  <span className="body-2 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {hasLinks && (
              <div className="hairline-t mt-8 flex flex-wrap items-center gap-6 pt-6">
                {project.links.github && (
                  <a className={LINKS} href={project.links.github} target="_blank" rel="noopener noreferrer">
                    GITHUB ↗
                  </a>
                )}
                {project.links.figma && (
                  <a className={LINKS} href={project.links.figma} target="_blank" rel="noopener noreferrer">
                    FIGMA ↗
                  </a>
                )}
                {project.links.live && project.links.demoLabel && (
                  <a className={LINKS} href={project.links.live}>
                    {project.links.demoLabel} ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Check `link-arrow` renders on paper background**

`index.css:230` `.link-arrow` — read it; it must not rely on `--ink`'s inverted context. Expected: color from `var(--ink)` — fine on fieldwork's `inv` scope. No edit expected; note result.

### Task B2: Rewrite `FieldWork.jsx`

**Files:**
- Rewrite: `src/components/FieldWork.jsx` (142 → ~45 lines)

- [ ] **Step 1: Replace file content**

```jsx
import { useState } from 'react';
import Section from './ui/Section';
import CaseFile from './CaseFile';
import { projectsData } from '../data/portfolioData';

export default function FieldWork() {
  // One case open at a time keeps the section scannable.
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section
      id="fieldwork"
      label="FIELD WORK — SELECTED PROJECTS"
      figure="FIG. 05"
      inv
      title={
        <>
          Six systems,
          <br />
          <em>one method.</em>
        </>
      }
      lede="From churn pipelines to patented hardware — each entry is a full case analysis, not a thumbnail."
    >
      {projectsData.map((project, index) => (
        <CaseFile
          key={project.id}
          project={project}
          index={index}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </Section>
  );
}
```

(`ScrollStack`, `initParallax`, the `CARD` const and `ProjectCard` are all removed.)

- [ ] **Step 2: Dev-server check**

Expected: 6 compact cards; clicking `OPEN CASE FILE` expands that card only; pre-opened cards close when another opens; toggle label + caret flip; no console errors; page total height drops massively.

### Task B3: Fieldwork verification (acceptance)

- [ ] **Step 1: Measure**

WebBridge eval:
```js
JSON.stringify({
  fieldH: document.querySelector('#fieldwork').offsetHeight,
  docH: document.documentElement.scrollHeight
})
```
Expected: `fieldH` < 3,600 (was 7,022); `docH` < 14,000 (was 17,632).

- [ ] **Step 2: Screenshots** (1440×900, both themes): fieldwork collapsed; one card open (expand card №3); mobile 390×844 collapsed + one open.
Expected: compact cards look like a sheet index; expanded state shows metrics grid, highlights, TECH STACK, PROBLEM/SOLUTION/ARCHITECTURE, links; nothing overlaps (previous sticky-ghost problem gone).

- [ ] **Step 3: Keyboard/a11y**

Via eval: focus the toggle `document.querySelector('[aria-controls^="casefile-"]')` → `.focus()`, check `aria-expanded="false"`; click via evaluate; `aria-expanded` → `"true"`; region `#casefile-<id>` exists with content. Tab order sane.

- [ ] **Step 4: Reduced motion**

Emulate via CDP or toggle `prefers-reduced-motion` in DevTools not available via WebBridge — code-level check only: `motion-reduce:transition-none` present in class string. Note in report.

### Task B4: Prerender + ScrollStack removal

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: green; `[prerender] wrote … kB` (should shrink or stay ~similar — content still in DOM).

- [ ] **Step 2: Prerender content check**

Run: `Select-String -Path dist\index.html -Pattern "OPEN CASE FILE","ARCHITECTURE","Six systems"`
Expected: all three found. If `ARCHITECTURE`/deep-dive text missing → the accordion content is NOT in initial DOM; fix by guaranteeing the closed state still renders the region (it does with grid-rows) before proceeding.

- [ ] **Step 3: Remove now-unused ScrollStack**

Run: `Select-String -Path src\* -Recurse -Pattern "ScrollStack"` → expected 0 matches. Then:
```powershell
Remove-Item src\components\bits\ScrollStack.jsx
```

- [ ] **Step 4: Commit**

```bash
git add src/components/FieldWork.jsx src/components/CaseFile.jsx
git rm src/components/bits/ScrollStack.jsx
git commit -m "feat(fieldwork): index-card accordion case files replace sticky stack"
```

---

## Phase C — Final verification + docs

### Task C1: Review + full pass

- [ ] **Step 1: `code-reviewer` subagent** on the full diff (`git diff <base>..HEAD`), addressing BLOCKERs before continuing.
- [ ] **Step 2: Full-page screenshot set** (day/night 1440 + 390) → save to temp for the user to relay to Claude: hero, about, metrics, apparatus, fieldwork collapsed + open, lab, exhibit, casestudies, credentials, contact, footer.
- [ ] **Step 3: Lighthouse/perf sanity (optional, if time):** `npm run build` output JS size before vs after cleanup — report delta.

### Task C2: PRODUCT.md refresh

- [ ] **Step 1:** Read `PRODUCT.md`; update any "3D chrome knot" hero description → "halftone portrait plate", and fieldwork description → "index-card case file accordion". Keep edits minimal, match existing tone.
- [ ] **Step 2: Commit**

```bash
git add PRODUCT.md
git commit -m "docs: sync PRODUCT.md with halftone hero and fieldwork accordion"
```

- [ ] **Step 3: ASK the user before any `git push`.**

---

## Self-Review

- **Spec coverage:** A1–A6 map to design items A1–A6 (photo plate ✓, FIG system ✓, label contrast ✓, rhythm ✓, ticker untouched-but-verified via screenshots ✓, hygiene ✓). Phase B maps to the approved index-card accordion ✓. Docs/PRODUCT refresh ✓. Multi-agent orchestration ✓ (B1/B2 appropriate for `boilerplate-gen`-style dispatch; C1 `code-reviewer`).
- **Placeholders:** none — all edits show final code; commands have expected outputs.
- **Type/name consistency:** `CaseFile` props (`project, index, open, onToggle`) match `FieldWork` usage; region id `casefile-${project.id}` matches `aria-controls`; `projectsData` field names verified against `portfolioData.js` (grep 2026-10-18).
- **Known risks:** halftone shader contrast on the new photo (mitigated: autocontrast pass + visual check in A2 Step 5); accordion content-in-DOM (verified in B4 Step 2); `apt`-style package mirrors irrelevant (npm only).
