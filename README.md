# ODYSSEY — Design Lab

**Global Rare Disease Match Network.** Design exploration phase: ten visual directions for the same
product, rendered against one shared synthetic dataset so they can be compared on identical content.

> **DEMONSTRATION DATA — NOT FOR CLINICAL USE.**
> No real patients, clinicians, institutions or genomic results are represented. ODYSSEY is not a
> diagnostic AI: the interface communicates *potential match*, *evidence similarity*, *AI-assisted
> extraction*, *requires clinician review* and *clinically verified* — never a diagnosis.

## Run

```bash
npm install
npm run dev      # http://localhost:3000/design-lab
```

`npm run build` · `npm run typecheck`

## The lab

| Route | What it shows |
| --- | --- |
| `/design-lab` | Index of all ten directions plus the product spine |
| `/design-lab/[concept]/[screen]` | One concept rendering one of the six core screens |

Keyboard, anywhere in the lab: `1`–`9`, `0` switch direction · `↑`/`↓` previous/next direction ·
`←`/`→` previous/next screen · `G` info panel.

### Directions

| # | Name | Visual thesis |
| --- | --- | --- |
| 01 | Clinical Command | Hospital command centre — architectural grid, graphite, restrained cobalt |
| 02 | Molecular Atlas | Dark molecular intelligence — node graphs, luminous cyan, clinical not cyberpunk |
| 03 | Swiss Clinical | International Typographic Style — black, white, one red; information *is* the design |
| 04 | Evidence Archive | Premium medical archive — ivory, serif, burgundy, provenance on every claim |
| 05 | Precision Laboratory | Diagnostic instrumentation — calibration rules, thresholds, signal-green |
| 06 | Global Network | Geography as the organising device — nodes, institutions, one line KZ → DE |
| 07 | Quiet Luxury MedTech | Authority through restraint — off-white, navy, brass, almost no borders |
| 08 | Bio Glass | Biological intelligence — ice and mint, depth rationed to one floating layer |
| 09 | Medical Operating System | Split panes, command palette, evidence inspector, high density |
| 10 | Human + Machine | Two visual languages in dialogue, joined by a seam at every handoff |

### Screens (identical content in all ten)

1. **Doctor Dashboard** — attention queue, case queue, network activity, contribution, the new match
2. **Create Case** — nine-section structured intake, upload, AI extraction, clinician verification
3. **Case Intelligence** — ODY-001 phenotype, genetics, timeline, completeness, matching signals
4. **Potential Match** — ODY-001 ↔ ODY-742, evidence-by-evidence, provenance, divergence
5. **Case Comparison** — Kazakhstan vs Germany, signal by signal, agreement marked per row
6. **Collaboration Room** — doctor ↔ doctor, evidence, decision log, two-clinician verification

## Architecture

```
app/
  layout.tsx                     fonts (13 families, next/font)
  globals.css                    shared motion vocabulary + lab chrome tokens
  design-lab/page.tsx            index of the ten directions
  design-lab/[concept]/[screen]/ statically generated, 60 routes
src/
  data/odyssey.ts                the single synthetic dataset — every concept reads this
  data/world.ts                  generated coastline + dot matrix (scripts/build-world.mjs)
  lib/concepts.ts                concept + screen registry
  components/LabFrame.tsx        lab chrome: selector, keyboard, info panel
  components/kit.tsx             token-driven primitives (map, radar, pedigree, ring, …)
  concepts/NN-name/theme.css     that direction's complete token system, scoped to .cNN
  concepts/NN-name/index.tsx     that direction's chassis + six screens
```

Every primitive in `components/kit.tsx` paints with `currentColor` or a CSS variable, so a concept
restyles it entirely from its own `theme.css`. Nothing in the kit carries a colour of its own.

### Adding integrations later

The data module is the only source of truth and is already shaped like an API response
(`CaseRecord`, `EvidenceDimension`, `Message`, `NetworkNode`). Replacing it with fetched data
requires no change to any concept. No backend, database, auth, blockchain or medical API is present
or assumed.

## Scripts

`scripts/build-world.mjs` regenerates `src/data/world.ts` from Natural Earth (build-time only).
`scripts/shot.mjs` and `scripts/sweep.mjs` are local QA helpers (screenshots, overflow/error sweep).

### QA helper scripts

`scripts/shot.mjs` (screenshots) and `scripts/sweep.mjs` (overflow/console sweep across all 60
screens) are local tools, not part of the build. `scripts/build-world.mjs` regenerates the committed
`src/data/world.ts`. They need packages that are deliberately **not** in `package.json`, so Vercel
does not install them on every deploy:

```bash
npm i -D playwright-core world-atlas topojson-client d3-geo
```
