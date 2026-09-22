# ODYSSEY — Global Rare Disease Match Network

**The answer may already exist.**

ODYSSEY helps clinicians with difficult unresolved cases find potentially related clinical cases,
understand *why* two cases are similar, connect with the other clinician, and record clinically
verified knowledge back into the network.

> **DEMONSTRATION DATA — NOT FOR CLINICAL USE.**
> Every case, clinician, variant, laboratory value and result in this application is synthetic. No
> real patients, institutions or genomic results are represented.
>
> **ODYSSEY is not a diagnostic system.** It never claims that AI diagnosed a patient. Output is
> framed as *Potential Match*, *Evidence Similarity*, *AI-Assisted Extraction*, *Requires Clinician
> Review* and *Clinically Verified*.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  → /enter
```

`npm run build` · `npm run typecheck` · `npm run e2e` (drives the whole P0 flow in a headless browser) ·
`npm run e2e:ru` (verifies the Russian interface, including engine-generated sentences)

No account, backend, database or API key is required. State lives in the browser.

## The demo flow

The application supports this story end to end, and `scripts/e2e.mjs` asserts every step of it:

```
Enter demo (Dr Seitkali, Kazakhstan)
  ↓ create case  /cases/new
  ↓ upload report + simulated extraction  /cases/[id]/verify
  ↓ clinician confirms / edits / removes each proposed term
  ↓ Find matches  → deterministic federated search
  ↓ ODY-742, Germany surfaced as a strong potential match
  ↓ WHY this match  /matches/[id]
  ↓ compare cases  /matches/[id]/compare
  ↓ request clinical connection
  ↓ switch to Dr Brandt (Germany) → accept
  ↓ collaboration room: evidence stays visible beside the discussion
  ↓ both clinicians verify clinical relevance
  ↓ knowledge contribution recorded  /knowledge
```

Two further states are real, not mocked screens:

- **No strong match** — run a search on `ODY-027`. Nothing clears the review threshold, and the case
  stays in the network for re-evaluation.
- **Not yet searched** — a case that has never been compared is distinct from one with no match.

### Switching clinician

The whole story runs across two people. The chip in the header switches between Dr Seitkali (KZ) and
Dr Brandt (DE). Switching changes whose cases, notifications and verification tasks you see; the
underlying data is shared.

## Languages

English and Russian, switchable from the header at any point; the choice is remembered.

Structured clinical vocabulary — HPO terms, analytes, imaging features, statuses — renders in the
reader's language, because in the data model those are codes rather than text. That is the product
thesis made visible: structure is what survives a border. Free text a clinician types (discussion
notes, verification notes) stays exactly as written.

The matching engine emits sentences as a key plus data (`Phrase` in `src/store/types.ts`), never as
a finished string, so an explanation like *"7 phenotype features overlap, including…"* is assembled
in whichever language is active. The same applies to notifications and audit entries, which are
stored as keys and re-render when the language changes.

| | |
| --- | --- |
| `src/i18n/dict.ts` | Interface strings, both languages |
| `src/i18n/content.ts` | Russian rendering of the synthetic clinical content, keyed by the English source; anything unmapped falls back to English rather than showing a marker |
| `src/i18n/i18n.tsx` | Provider and the `t` / `C` / `P` helpers |
| `src/i18n/lang.ts` | Language primitives, including Russian's three plural forms |

## What is real and what is simulated

| | |
| --- | --- |
| **Matching engine** | Real code, deterministic, derived from structured fields — `src/store/matching.ts`. Same pair always gives the same numbers. Labelled **SIMULATED MATCHING ENGINE**: the weighting is a product simulation, not a validated clinical method. |
| **AI extraction** | **SIMULATED.** No model is called. A fixed synthetic document maps to a fixed list of proposed terms, each with the sentence it came from — `src/store/extraction.ts`. |
| **Clinical verification** | Real state transition. Confirms that the *case connection* is clinically relevant — never that a patient has a disease. Two independent clinicians are required. |
| **Audit log** | Every action writes an event. Visible at `/admin`. |
| **Backend** | None. No database, no auth, no medical API, no blockchain. `localStorage` only. |

### How a match is scored

Eight evidence groups, each computed independently and weighted:

| Group | Derived from | Weight |
| --- | --- | --- |
| Phenotype similarity | Jaccard over present HPO terms × severity concordance bonus | 22% |
| Clinical trajectory | Milestone onset alignment within an 8-month window × event ordering | 16% |
| Genetic evidence | Shared gene, identical variant, allele completeness, classification concordance | 18% |
| Laboratory pattern | Analyte coverage × value proximity | 12% |
| Imaging pattern | Jaccard over structured radiological features | 12% |
| Temporal similarity | First-abnormality proximity and length of the diagnostic course | 8% |
| Family pattern | Consanguinity concordance and shared regional ancestry | 6% |
| Negative evidence | Jaccard over canonicalised exclusions | 6% |

Scores are truncated, never rounded up. Candidates below **55** are never surfaced; **80+** is labelled
a strong potential match. For the demo pair the engine returns **85** overall (phenotype 91,
trajectory 87, genetics 77, laboratory 75, imaging 100, temporal 91, family 54, negative 100).

## Architecture

```
app/
  enter/                     demo entry — pick a clinician, no account
  (app)/                     authenticated shell: nav, notifications, clinician switcher
    dashboard  cases  cases/new  cases/[id]  cases/[id]/verify  cases/[id]/matches
    matches  matches/[id]  matches/[id]/compare
    collaboration  collaboration/[id]  knowledge  network  notifications  settings  admin
src/
  store/types.ts             domain models (Case, Match, Collaboration, Contribution, …)
  store/seed.ts              synthetic seed data
  store/matching.ts          deterministic matching engine
  store/extraction.ts        simulated AI extraction
  store/store.tsx            reducer + context + localStorage, writes audit events
  lib/compare.ts             builds the side-by-side comparison
  ui/theme.css               Bio Glass design tokens and components
  ui/app.css                 application shell and interaction components
  ui/primitives.tsx          Panel, Button, Pill, Modal, Tabs, StepBar, toasts…
  components/kit.tsx         token-driven visualisations (map, radar, pedigree, trajectory)
```

**Connecting a real API later:** `src/store/seed.ts` is the only source of data and is shaped like an
API response. Components dispatch intent (`{ type: "runMatching", caseId }`) and never fetch, so the
action bodies in `reducer` can be replaced with network calls without touching the UI.

## Design

The interface is **Bio Glass** — the direction chosen from the earlier exploration. Ice and mint on a
soft atmospheric ground; glass is rationed to the shell bar and one focal panel per screen, with
everything else flat. Tokens live in `src/ui/theme.css` and are the single source of truth.

The design lab that produced it is still in the repository at `/design-lab` for reference. It is not
linked from the application: those screens are static mockups.

## Testing

```bash
npm run e2e       # 70 assertions across the whole P0 flow, fails on any console error
node scripts/sweep-app.mjs   # every route at 1500 / 1100 / 390 px, checks for overflow and errors
```

Helper scripts need packages deliberately kept out of `package.json` so they are not installed on
every deploy:

```bash
npm i -D playwright-core world-atlas topojson-client d3-geo
```

`scripts/build-world.mjs` regenerates the committed `src/data/world.ts` from Natural Earth.
