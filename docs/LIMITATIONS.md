# Honest limitations

What this prototype does **not** do.

This page exists because a medical prototype that overstates itself is worse than one that does
less. If you are evaluating ODYSSEY, read this before the README's feature list.

> **Summary in one line:** ODYSSEY P0 is a **front-end prototype running on synthetic data in a
> browser**. The matching engine is real deterministic code. Almost everything around it — the
> extraction, the backend, the security model, the federation — is either simulated or planned.

---

## 1. Extraction is simulated

**No AI model is called anywhere in this repository.**

[`src/store/extraction.ts`](../src/store/extraction.ts) maps a fixed synthetic document to a fixed
list of proposed terms. There is no OCR, no NLP, no LLM, no API key, no network request. The
"confidence" values are authored constants.

What the simulation *does* demonstrate faithfully: proposals carry the source sentence and page,
arrive `unverified`, are excluded from matching until confirmed, and are labelled **SIMULATED AI
EXTRACTION** on screen — a test asserts the label survives refactors.

**Real clinical document extraction is a P2 item** ([ROADMAP.md](ROADMAP.md)) and is a substantially
harder problem than the rest of the product combined.

## 2. The matching weights are a product simulation

The eight evidence groups and their weights (22 / 18 / 16 / 12 / 12 / 8 / 6 / 6) are **an
engineering construction, not a clinically validated model.**

They were chosen to be defensible and legible, not because any study supports them. The formulas —
Jaccard overlap, an 8-month milestone window, value proximity ratios — are reasonable similarity
mathematics applied to clinical fields. That is not the same as clinical validity.

**No clinical validation has been performed.** No sensitivity, specificity, diagnostic yield or
inter-rater agreement has been measured. The engine has never been run against real clinical data.

A similarity score expresses *similarity of recorded evidence between two records*. It is not a
diagnostic probability and carries no clinical claim. Every screen that shows a score says so.

## 3. No production backend

There is no server-side application. No API. Three runtime dependencies: `next`, `react`,
`react-dom`. The Next.js server renders pages; it holds no state and makes no decisions.

## 4. No production database

No PostgreSQL, no ORM, no migrations, no persistence beyond the browser. The entities in
[DATA_MODEL.md](DATA_MODEL.md) are TypeScript types, not tables.

## 5. No server-side authentication

`/enter` selects a demo persona. There is **no login, no password, no session, no token, no identity
provider and no authorisation check anywhere.** The clinician switcher in the header is a
demonstration affordance — anyone can be anyone.

In production, "which clinician are you" is the question that gates every disclosure in the system.
Here it is a button.

## 6. State lives in `localStorage`

All application state is a single JSON blob under `odyssey.mvp.v1` (schema version 1), with the
language under `odyssey.lang`. Consequences:

- state is per-browser and per-device — nothing is shared between two real people;
- clearing site data resets the demo;
- there is no concurrency, no conflict resolution, no server-side truth;
- **the audit log has none of the guarantees an audit log needs.** It demonstrates the *concept* of
  traceability. It is client-side, mutable, and trivially erasable.

## 7. No external APIs

No integration with HPO services, ClinVar, OMIM, Orphanet, gnomAD, PubMed, any EHR, any registry,
any genomic database or any clinical-trial system. HPO codes and HGVS-style variant notation appear
in the synthetic data because that is the right shape — nothing validates or resolves them.

## 8. Doctor switching is manual and demo-oriented

The whole two-clinician story runs in one browser tab, switched by hand. The dual-verification
requirement is enforced in the reducer (one clinician cannot satisfy both sides), but this is
application logic operating on a demo persona, not an authorisation boundary.

## 9. Synthetic data only, and a small amount of it

**17 cases. 2 clinicians. 1 designed match pair.**

No real patients, clinicians, institutions, variants or laboratory values are represented. Any
resemblance to a real case is coincidental — the data was authored to exercise the engine.

The dataset is small enough that the matching engine's behaviour at scale is unknown. It currently
compares one case against every other case; that is `O(n)` per search and would not survive a
network of real size without indexing and candidate pre-filtering.

## 10. No clinical validation

Restated separately because it is the single most important limitation:

**No clinician has evaluated whether ODYSSEY's matches are clinically meaningful. No study, no
retrospective evaluation, no expert review, no ethics approval and no regulatory assessment has been
performed.**

ODYSSEY is not a medical device. It is not certified or approved by any regulatory authority. It
must not be used for clinical decision-making.

## 11. Production security architecture is conceptual

Everything in [SECURITY.md](SECURITY.md) under *Production architecture vision* — pseudonymisation,
de-identification, RBAC, consent management, server-side audit, encryption, minimum-necessary
disclosure, jurisdiction-aware governance — **is planned and does not exist.**

There is no consent entity in the data model at all. In a production rare-disease network, consent
is one of the most important entities in the system.

## 12. The "standing query" is described but not implemented

The no-match screen tells the clinician:

> *"ODY-027 stays indexed. When a new case is submitted anywhere in the network, it is scored
> against yours automatically, and you are notified if it clears the threshold."*

**That behaviour does not exist.** Creating a case does not re-score previously searched cases and
does not generate notifications for them — the `createCase` reducer adds the case and stops.

What *is* implemented is the state model that re-evaluation would need: unresolved cases stay in the
network, and `state.searched` distinguishes *not searched* from *no match*. The automatic part is a
**product concept shown as interface copy**, and it should be re-worded or implemented before this
screen is shown to a real clinician. Automatic re-evaluation is a P4 item
([ROADMAP.md](ROADMAP.md), [KNOWLEDGE_NETWORK.md](KNOWLEDGE_NETWORK.md)).

## 13. The collaboration room is a client-side demo

The room, its discussion, its decision log and its "secure call" all run in one browser on local
state. There is no server, no transport encryption of clinical payloads, no identity verification,
no access control and no real call. The call panel shows identity tiles, not video, and is labelled
as a demonstration.

---

## Also true, and worth saying

**No CI pipeline.** No workflow runs the test suites on push. No test gate protects a deployment.
Tests are run locally, on demand ([TESTING.md](TESTING.md)).

**No unit tests.** Coverage comes from end-to-end suites and the engine check.

**Chromium only.** Safari and Firefox are untested. No real-device mobile testing.

**No accessibility audit.** Semantic HTML and ARIA labels are used; no automated a11y suite or
screen-reader testing has been run.

**No traction, no users, no partnerships.** ODYSSEY is not used by any clinician, hospital,
registry or research group. There are no pilot sites, no institutional agreements, no revenue and no
clinical outcomes. Nothing in this repository should be read as implying otherwise.

**The `/design-lab` route is not the product.** It holds the earlier visual exploration and its
screens are static mockups.

**No license file.** All rights reserved by the authors until one is added.

---

## What *is* real

For balance, the claims that hold up:

| | |
| --- | --- |
| **The matching engine** | Real, deterministic application logic. Same pair → identical numbers, every time. Verifiable by running `scripts/check-engine.ts` without a browser. |
| **The explanation** | Derived from the same intermediate values that produced the score, so it cannot drift from the number. |
| **The thresholds** | Really enforced — 16 of 17 candidates are discarded for the demo case. |
| **The no-match case** | A genuine engine result (0 above threshold), not a mock screen. |
| **Verification gating** | AI-proposed terms genuinely do not enter scoring until confirmed. |
| **Dual verification** | Genuinely requires two distinct clinicians. |
| **The audit trail** | Every mutation writes an event — client-side, but real and complete. |
| **Localisation** | 810 UI keys in both languages, 245 clinical strings, and engine sentences assembled per-language rather than translated after the fact. |
| **The test suites** | Real, and they really fail on a console error. |
