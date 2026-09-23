# Architecture

How the ODYSSEY P0 prototype is built, and how to read the code.

> **Scope of this document.** Everything described under *Current implementation* exists in this
> repository and runs. Everything under *Production vision* is **planned** and does not exist.

---

## 1. The shape of the system

```
          ┌─────────────────────────────────────────────────────┐
          │  UI LAYER                                           │
          │  app/**            routes and pages                 │
          │  src/ui/**         design tokens + primitives       │
          │  src/components/** shell, visualisations, widgets   │
          └────────────────────────┬────────────────────────────┘
                                   │  dispatch({ type, …payload })
                                   │  components declare INTENT, never fetch
          ┌────────────────────────▼────────────────────────────┐
          │  DOMAIN STATE                                       │
          │  src/store/store.tsx                                │
          │  reducer · React Context · localStorage · audit     │
          └────────────────────────┬────────────────────────────┘
                                   │  pure function calls
          ┌────────────────────────▼────────────────────────────┐
          │  DOMAIN LOGIC (pure, deterministic, testable)       │
          │  src/store/matching.ts    similarity engine         │
          │  src/store/extraction.ts  simulated extraction      │
          │  src/lib/compare.ts       comparison builder        │
          └────────────────────────┬────────────────────────────┘
                                   │
          ┌────────────────────────▼────────────────────────────┐
          │  DATA                                               │
          │  src/store/seed.ts   synthetic dataset              │
          │  shaped like an API response                        │
          └─────────────────────────────────────────────────────┘
```

The important property: **the layers only point downward.** The engine does not know about React,
the reducer does not know about routes, and the UI never reaches past the reducer. That is what
makes the matching engine independently testable (`scripts/check-engine.ts` imports it directly,
with no browser involved).

---

## 2. Directory map

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Redirects to `/enter`. |
| `app/enter/` | Demo entry. Pick a clinician; no account, no password. |
| `app/(app)/` | Route group holding the application shell (nav, notifications, clinician switcher, disclaimer bar). |
| `app/design-lab/` | The earlier visual exploration that produced the current interface. **Static mockups**, not the product; not linked from the application. |
| `src/store/types.ts` | Domain models. The single source of truth for the shape of a case, a match, a collaboration. |
| `src/store/seed.ts` | The synthetic dataset: 2 clinicians, 17 cases, a frozen demo clock. |
| `src/store/matching.ts` | The deterministic matching engine. |
| `src/store/extraction.ts` | The simulated extraction pipeline. |
| `src/store/store.tsx` | Reducer, Context provider, `localStorage` persistence, audit trail, selectors. |
| `src/lib/compare.ts` | Builds the side-by-side comparison table from two case records. |
| `src/lib/concepts.ts` | Metadata for the design lab. |
| `src/i18n/` | `dict.ts` (810 UI keys), `content.ts` (245 clinical strings), `i18n.tsx` (provider + helpers), `lang.ts` (language primitives, Russian plurals). |
| `src/ui/theme.css` | The Bio Glass design tokens — colour, type, surface, spacing. Single source of truth for the visual language. |
| `src/ui/app.css` | Application shell and interaction components. |
| `src/ui/primitives.tsx` | `Panel`, `Button`, `Pill`, `Metric`, `Tabs`, `StepBar`, `Modal`, `Banner`, `ScoreBar`, toasts. |
| `src/components/AppShell.tsx` | Nav, notification bell, language toggle, clinician switcher, disclaimer bar. |
| `src/components/FindMatches.tsx` | The search action and its staged progress dialog. |
| `src/components/CallPanel.tsx` | The simulated secure call in the collaboration room. |
| `src/components/kit.tsx` | Token-driven visualisations: world map, radar, pedigree, trajectory chart, meters. |
| `src/data/odyssey.ts` | Dataset for the design lab, plus the network node/edge list used by the network map. |
| `src/data/world.ts` | Generated world-map path data (from `scripts/build-world.mjs`). |
| `scripts/` | Test harness, engine check, screenshot and screen-recording tooling. |
| `docs/` | This documentation. |

---

## 3. Routes

All application routes are client components inside the `(app)` route group, which supplies the
shell.

| Route | Screen |
| --- | --- |
| `/enter` | Choose a demo clinician |
| `/dashboard` | The clinician's cases, open matches and verification tasks |
| `/cases` | Case list |
| `/cases/new` | Case creation form |
| `/cases/[id]` | Case record — 8 evidence tabs, completeness, matching signals |
| `/cases/[id]/verify` | Document upload → simulated extraction → term-by-term clinician review |
| `/cases/[id]/matches` | Network search results for one case |
| `/matches` | All matches for the current clinician |
| `/matches/[id]` | **Why this match** — explanation, evidence profile, dimensions |
| `/matches/[id]/compare` | Side-by-side comparison of the two case records |
| `/collaboration` | Collaboration rooms |
| `/collaboration/[id]` | The room: discussion, evidence, decision log, documents, secure call |
| `/knowledge` | Recorded knowledge contributions |
| `/network` | Network map, member institutions, connections |
| `/notifications` | Notification feed |
| `/settings` | Profile, language, demo reset |
| `/admin` | The audit log |

`npm run build` produces 24 routes including the design lab's statically generated concept screens.

---

## 4. State management

**Current implementation.** A `useReducer` + React Context store in `src/store/store.tsx`, persisted
to `localStorage`.

```ts
const STORAGE_KEY   = "odyssey.mvp.v1";
const STATE_VERSION = 1;
```

Hydration happens **after mount**, so the server-rendered and client-rendered markup agree; the
provider gates rendering on a `ready` flag rather than reading storage during render. A stored state
whose `version` does not match `STATE_VERSION` is discarded rather than migrated.

### Actions

Components dispatch intent. They never fetch, and they never compute domain results inline:

```ts
| { type: "enter";               doctorId }
| { type: "switchDoctor";        doctorId }
| { type: "createCase";          draft }
| { type: "uploadDocument";      caseId, fileName }
| { type: "completeExtraction";  caseId, fileName, terms }
| { type: "reviewPhenotype";     caseId, hpo, decision: "verified" | "rejected" }
| { type: "editPhenotype";       caseId, hpo, patch }
| { type: "runMatching";         caseId }
| { type: "dismissMatch";        matchId }
| { type: "requestConnection";   matchId, note }
| { type: "respondConnection";   matchId, accept }
| { type: "sendMessage";         collaborationId, body }
| { type: "verifyRelevance";     collaborationId, notes }
| { type: "readNotification" } | { type: "readAllNotifications" }
| { type: "reset" } | { type: "hydrate"; state }
```

### State shape

```ts
type AppState = {
  version: number;
  currentDoctorId: DoctorId | null;
  doctors:         Record<DoctorId, Doctor>;
  cases:           Record<string, CaseRecord>;
  caseOrder:       string[];
  matches:         Record<string, Match>;
  collaborations:  Record<string, Collaboration>;
  contributions:   Contribution[];
  notifications:   AppNotification[];
  audit:           AuditEvent[];
  searched:        string[];   // cases the engine has been run against
  clock:           number;
};
```

`searched` deserves a note: it is what allows the interface to distinguish **"not yet searched"**
from **"searched, nothing found"**. Those are different clinical situations and collapsing them
would be a safety problem, not a UI simplification.

### Audit trail

Every mutation also writes an `AuditEvent`. Twelve actions are audited:

```
session.started · case.created · document.uploaded · extraction.completed
phenotype.verified · phenotype.rejected · match.generated
connection.requested · connection.accepted · connection.declined
verification.completed · contribution.recorded
```

Events store a dictionary **key plus parameters**, not a rendered sentence, so the log re-renders
correctly in either language. Visible at `/admin`.

### Why this shape

`src/store/seed.ts` is the only source of data and is deliberately shaped like an API response:
entities keyed by id, ordering held separately, timestamps as epoch numbers, references by id rather
than by object.

**Production vision.** Because components dispatch intent rather than fetching, the action bodies in
`reducer` can be replaced with network calls without touching a single component. The domain model
in `src/store/types.ts` is intended to survive that migration unchanged.

---

## 5. The matching engine

`src/store/matching.ts` — pure, deterministic, no randomness. Same pair in, same numbers out.

```
scorePair(a, b)
  ├── phenotypeScore    Jaccard over present HPO terms × severity concordance
  ├── trajectoryScore   milestone alignment (8-month window) × event ordering
  ├── geneticsScore     shared gene · identical variant · allele completeness · classification
  ├── laboratoryScore   analyte coverage × value proximity
  ├── imagingScore      Jaccard over structured feature codes
  ├── temporalScore     onset proximity + diagnostic-course length ratio
  ├── familyScore       consanguinity concordance + regional ancestry
  └── negativeScore     Jaccard over canonicalised exclusions
        ↓
  weighted sum → Math.floor → overall score
        ↓
  dimensions[] · explanation[] · divergences[] — assembled from the same computed facts
```

Design decisions worth knowing:

- **Truncation, never rounding.** `pct = x => Math.floor(x * 100)`. A score is never rounded up.
- **The explanation is derived, not narrated.** `explanation` and `divergences` are built from the
  same intermediate values that produced the score, so the "why" can never drift from the number.
- **Sentences are structured, not finished.** Every generated sentence is a `Phrase`
  (`{ key, params, lists, listsLower }`), resolved into the active language by the UI.
- **Negative evidence is canonicalised.** Differently worded exclusions ("cardiac work-up normal",
  "echocardiography unremarkable") map to the same key before comparison.
- **Ranking is stable.** Ties break on case id, so ordering is reproducible.

Full weighting and thresholds: [the README](../README.md#matching-engine).

---

## 6. The extraction pipeline — simulated

`src/store/extraction.ts`.

```
DEMO_DOCUMENTS  →  extractFrom(documentId)  →  ExtractedTerm[]
                                                 ├── hpo, term, onset, severity
                                                 ├── confidence
                                                 ├── evidence  (the source sentence)
                                                 ├── page
                                                 ├── negated
                                                 └── verification: "unverified"
```

**No model is called.** A fixed synthetic document maps to a fixed list of proposals, so the demo is
deterministic and never depends on a network call.

Two safety-relevant details:

- Every proposal arrives `unverified` and is **not part of the case** until a clinician confirms it.
- `LOW_CONFIDENCE = 0.7` flags weak proposals, and negation is carried as an explicit `negated: true`
  field on the data rather than inferred from the text at review time. (An earlier regex-based
  approach misread *"has **not** acquired independent sitting"* as a negation of *global
  developmental delay* — the term the sentence actually supports. Explicit beats inferred.)

---

## 7. Internationalisation

```
src/i18n/lang.ts      Lang type, LANGS, Russian 3-form plural rules, pick()
src/i18n/dict.ts      810 UI keys × { en, ru }
src/i18n/content.ts   245 clinical strings, keyed by the English source
src/i18n/i18n.tsx     provider + t / tt / L / C / CList / P
```

| Helper | Resolves |
| --- | --- |
| `t(key, params)` | A UI dictionary key |
| `tt(key, params)` | A key only known at runtime; falls back to the raw value |
| `C(value)` | A piece of seeded clinical content |
| `CList(values)` | Clinical content translated and list-joined |
| `P(phrase)` | A `Phrase` produced by the matching engine |

The `Phrase` type is the load-bearing idea:

```ts
type Phrase = {
  key: string;
  params?: PhraseParams;
  lists?: Record<string, string[]>;       // clinical content → translate, then join
  listsLower?: Record<string, string[]>;  // …lower-cased for mid-sentence grammar
};
```

The engine emits `{ key: "why.phenotype", params: { n: 7 }, listsLower: { list: [...] } }`. The UI
resolves it. Nothing generated is ever a finished string in storage, which is why switching language
re-renders the explanations, notifications and audit log correctly instead of leaving stale English
behind.

Free clinician-authored text (discussion notes, verification notes) is stored and displayed exactly
as written, in whatever language it was written in.

---

## 8. Design system

`src/ui/theme.css` holds the **Bio Glass** token set — the visual direction selected from the
earlier exploration. Colour, type scale, surfaces and spacing are CSS custom properties on a single
`.og` root, and every component reads tokens rather than literal values.

Glass is rationed deliberately: the shell bar and one focal panel per screen; everything else is
flat. `src/ui/app.css` carries the shell and interaction components on top.

Motion is subtle and purposeful (entry rise, progress, verification), and every animation is covered
by a `prefers-reduced-motion` rule.

One architectural gotcha, recorded because it caused a real bug: an element with a *finished*
`transform` animation still computes to a matrix, which makes it a containing block for
`position: fixed` descendants. `Modal` therefore renders through `createPortal(…, document.body)`
rather than inline.

---

## 9. Testing architecture

| Script | What it drives |
| --- | --- |
| `scripts/e2e.mjs` | The whole P0 flow in a headless browser — 70 assertions, fails on any console error |
| `scripts/e2e-ru.mjs` | The Russian interface, including engine-generated sentences — 19 checks |
| `scripts/sweep-app.mjs` | 15 routes × 3 viewport widths, checking for layout overflow and errors |
| `scripts/check-engine.ts` | Imports the engine directly and asserts determinism and thresholds |
| `scripts/shot-app.mjs` | Drives the real flow and captures the screenshots used in this documentation |
| `scripts/video/` | Screen-recording harness with an injected cursor overlay |

The tests drive a **production build**, not the dev server. Details in [TESTING.md](TESTING.md).

---

## 10. What a developer should read first

1. `src/store/types.ts` — the whole domain in one file.
2. `src/store/seed.ts` — what a case actually looks like.
3. `src/store/matching.ts` — the product thesis, in code.
4. `src/store/store.tsx` — how state moves.
5. `app/(app)/matches/[id]/page.tsx` — how a match is explained to a clinician.

Roughly an hour end to end. There is no hidden infrastructure to discover: the four files above plus
the seed are the entire data layer.
