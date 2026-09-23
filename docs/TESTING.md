# Testing

What is tested, how to run it, and the results actually observed — not a claim that everything
passes.

> **Verified at commit `e77fd35`.** Every result on this page was produced by running the command
> shown, against a production build, on the date this document was written. If you change the code,
> re-run before trusting the table.

---

## Results

| Command | Result |
| --- | --- |
| `npm run typecheck` | **clean** — no errors |
| `npm run build` | **succeeds** — 24 routes |
| `npm run e2e` | **70 / 70 — P0 FLOW PASSED** · 0 console errors |
| `npm run e2e:ru` | **19 / 19 — RUSSIAN UI PASSED** · 0 console errors |
| `npm run sweep` | **SWEEP CLEAN — 45 checks** |
| `LANG_RU=1 npm run sweep` | **SWEEP CLEAN — 45 checks** |
| `scripts/check-engine.ts` | determinism confirmed; thresholds behave as documented |

There is **no CI pipeline in this repository**. No workflow runs these suites on push, and no test
gate protects a deployment. They are run locally, on demand. Adding CI is a P1 item
([ROADMAP.md](ROADMAP.md)).

---

## Prerequisites

The harness uses `playwright-core` (already a dev dependency) plus a local Chromium headless shell.
The scripts look for it at the standard Playwright cache path:

```
~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell
```

If Playwright browsers are not installed:

```bash
npx playwright install chromium
```

**The suites drive a production build**, not the dev server — dev-mode compilation makes timing
assertions unreliable:

```bash
npm run build
PORT=4311 npm run start
```

All three browser suites default to `http://localhost:4311`, overridable with `BASE`.

---

## `npm run e2e` — the P0 flow

[`scripts/e2e.mjs`](../scripts/e2e.mjs) · **70 assertions**

Drives the entire product story in a headless browser, as a user would. It asserts *state
transitions and derived values*, not the presence of pixels — assertion 04, for example, checks that
the dashboard's unresolved count is derived from the data rather than hard-coded, and assertion 14
checks that the explanation text contains values the engine actually computed.

| Assertions | Covers |
| ---: | --- |
| 01–08 | Landing, demo entry, dashboard, derived counts, case record, completeness, phenotype tab |
| 09–17 | Search, ODY-742 surfaced, strong-match label, the WHY explanation, evidence dimensions, comparison |
| 18–24 | Connection request → clinician switch → Doctor B sees it → accept → room opens |
| 25–35 | Room discussion, evidence beside it, messaging, **dual independent verification**, corroboration, knowledge contribution |
| 36–39 | Network view · **the no-match case** · the standing-query state |
| 40–44 | Audit log records contribution, verification, acceptance and match generation |
| 45–54 | Every application route renders |
| 55–70 | Create → upload → **simulated extraction** → the simulated label is still shown → clinician confirmation → terms move to doctor-verified (2 → 9) → search reaches a real result state; design lab still renders |

**The run fails on any console error.** A silent React warning is a failure, not a nuisance.

Assertion 65 exists specifically to stop the *SIMULATED AI EXTRACTION* label from being lost in a
refactor. Assertion 69 accepts **either** a match or a no-match outcome — the test asserts that the
flow reaches a real result state, not that a match is always found.

---

## `npm run e2e:ru` — the Russian interface

[`scripts/e2e-ru.mjs`](../scripts/e2e-ru.mjs) · **19 checks**

Localisation of a product like this is not a string-replacement problem, so the suite goes past the
chrome:

| Check | Why it matters |
| --- | --- |
| 05 | Clinical content (case headline) renders in Russian |
| 07 | An **HPO term** renders in Russian — structured vocabulary, not UI text |
| 11 | An **engine-generated sentence** renders in Russian — proving `Phrase` resolution works |
| **14** | **No English sentences remain on the match screen** — the check that catches a half-translated screen |
| 19 | The language choice survives a reload |

Check 14 is the one that has caught real regressions: imaging feature names left untranslated, and a
Russian sentence assembled with the wrong grammatical case.

---

## `npm run sweep` — responsive and runtime health

[`scripts/sweep-app.mjs`](../scripts/sweep-app.mjs)

**15 routes × 3 viewport widths (1500 / 1100 / 390 px) = 45 checks.**

```bash
npm run sweep              # English
LANG_RU=1 npm run sweep    # Russian — the same 45 checks
```

Routes swept: `/enter`, `/dashboard`, `/cases`, `/cases/new`, `/cases/ODY-001`,
`/cases/ODY-001/verify`, `/cases/ODY-001/matches`, `/cases/ODY-027/matches`, `/matches`,
`/collaboration`, `/knowledge`, `/network`, `/notifications`, `/settings`, `/admin`.

Each check fails on:

- **horizontal overflow** — `scrollWidth - clientWidth > 2px`;
- **an empty page** — less than 120 characters of rendered text, which catches a route that renders
  its shell but not its content;
- **any console error or page error.**

Running it in Russian matters: Russian strings are commonly 20–30% longer, and the 390 px pass is
where that shows up first.

---

## `scripts/check-engine.ts` — engine determinism

Imports the matching engine directly, with no browser involved.

```bash
npx tsc scripts/check-engine.ts src/store/*.ts \
  --outDir /tmp/eng --module nodenext --moduleResolution nodenext \
  --target es2022 --skipLibCheck
node /tmp/eng/scripts/check-engine.js
```

Observed output:

```
ODY-001 → 1 surfaced (threshold 55)
   ODY-742    85  match.label.strong
   ODY-128    31  match.label.weak
   ODY-556    27  match.label.weak
   ODY-136    26  match.label.weak
   dimensions: phenotype=91 trajectory=87 genetics=77 laboratory=75
               imaging=100 temporal=91 family=54 negative=100
   why:
     · why.phenotype   {"n":7}
     · why.trajectory  {"d":1,"n":1}
     · why.genetics    {"genes":"NDUFAF6"}
     · why.laboratory  {"n":7}
     · why.imaging     {}
     · why.extra       {"a":"ODY-001","b":"ODY-742"}
     · why.negative    {"n":6}

ODY-027 → 0 surfaced (threshold 55)
   ODY-093    37  match.label.weak

deterministic: yes
```

This confirms four things that matter more than any UI assertion:

1. **Determinism** — the same pair produces identical numbers on repeated runs.
2. **The threshold is real** — 16 of 17 candidates are discarded for ODY-001.
3. **The no-match case genuinely produces no match** — it is not a hard-coded screen.
4. **The explanation is data** — each reason is a key plus computed parameters.

---

## What is *not* tested

Stated so nobody assumes otherwise:

- **No unit tests.** There is no unit-test runner in the project. Domain logic is covered
  indirectly, through the end-to-end suites and the engine check.
- **No clinical validation.** The matching weights have never been evaluated against clinical
  ground truth. No such evaluation exists, and no dataset in this repository could support one.
- **No accessibility audit.** Semantic HTML and ARIA labels are used, but no automated a11y suite
  and no screen-reader testing has been run.
- **No performance or load testing.** There is no server to load.
- **No security testing.** There is no backend, no authentication and no API surface to test.
- **No cross-browser matrix.** Everything is run in Chromium. Safari and Firefox are untested.
- **No mobile-device testing.** The 390 px sweep checks layout at phone width in a desktop browser;
  it is not a real-device test.

See [LIMITATIONS.md](LIMITATIONS.md).

---

## Reproducing the screenshots

The images in [`docs/assets/`](assets/) are real screenshots of the running application, captured by
driving the actual flow — not mockups:

```bash
npm run build && PORT=4311 npm run start

SHOT_DIR=docs/assets W=1500 node scripts/shot-app.mjs \
  "/dashboard|01-dashboard" \
  "/cases/ODY-001/verify|02-extraction-review" \
  "{match}|03-why-this-match" \
  "{match}/compare|04-case-comparison" \
  "{room}|05-collaboration-room" \
  "/cases/ODY-027/matches|06-not-yet-searched" \
  "/knowledge|07-knowledge-contribution"
```

`06-no-strong-match.png` is captured separately, because reaching it requires actually running the
search on `ODY-027` rather than only navigating to the route.

`{match}` and `{room}` are substituted with the URLs reached by actually playing the flow, so the
screenshots show real application state. `LANG_RU=1` captures the Russian interface.
