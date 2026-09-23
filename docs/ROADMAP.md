# Roadmap

Where ODYSSEY is, and what each subsequent phase has to solve.

> Phases are ordered by dependency, not by date. No timeline is claimed. P1 must exist before P2
> means anything, and P2 must exist before P3 is safe.

---

## P0 — Current prototype ✅

**Status: complete and running.** <https://odyssey-rd-network.vercel.app>

A front-end prototype on synthetic data, browser-local state, no backend.

**What it actually delivers:**

- **A deterministic matching engine** — eight weighted evidence groups, real application logic, same
  pair → identical numbers. Independently runnable without a browser.
- **Explainability** — every reason derived from the same values that produced the score;
  divergences and gaps surfaced, not hidden.
- **The verification gate** — AI-proposed terms genuinely excluded from scoring until a clinician
  confirms them.
- **The full P0 flow** — create → upload → simulated extraction → clinician verification → search →
  match → explanation → comparison → connection request → acceptance → collaboration room → dual
  verification → knowledge contribution.
- **Real negative states** — *no strong match* and *not yet searched*, tracked and displayed
  separately.
- **Client-side audit trail** — twelve audited actions at `/admin`.
- **EN / RU** — 810 UI keys both languages, 245 clinical strings, engine sentences assembled
  per-language rather than translated after the fact.
- **A real test harness** — 70 end-to-end assertions, 19 Russian checks, 45 responsive checks per
  language, all failing on any console error.

**What it explicitly does not deliver:** extraction (simulated), backend, database, authentication,
consent, security architecture, federation, external integrations, clinical validation. See
[LIMITATIONS.md](LIMITATIONS.md).

---

## P1 — Production foundation

**The phase that turns a prototype into a system.** Nothing in P2–P4 is meaningful without it.

| Work | Notes |
| --- | --- |
| **Backend API** | Replace the reducer's action bodies with calls. The action names and domain model are designed to survive this unchanged ([ARCHITECTURE.md](ARCHITECTURE.md#4-state-management)). |
| **PostgreSQL** | The entities in [DATA_MODEL.md](DATA_MODEL.md) become real tables, with versioned clinical profiles. |
| **Authentication** | Real identity. Verified professional credentials, not a persona switcher. |
| **RBAC** | Roles scoped per organisation and per case: clinician, verifier, administrator, auditor. |
| **Consent management** | The entity that does not exist yet, and one of the most important in the system: who consented, to what, for which purpose, under which jurisdiction, for how long, withdrawable. |
| **Secure storage** | Encryption in transit and at rest; key management per organisation; data residency honoured. |
| **Persistent cases** | Server-side truth, concurrency, conflict handling, history. |
| **Organisations** | A real entity, not a string field. |
| **Server-side audit** | Append-only and tamper-evident. The client-side log becomes a view of it. |
| **CI** | The test suites run on push; no deployment without a passing gate. |

**Engine versioning** belongs here: every stored match must record which engine version produced it,
or a six-month-old score becomes uninterpretable.

---

## P2 — Medical intelligence

**The phase where the simulated parts become real.** Individually harder than all of P1.

| Work | Notes |
| --- | --- |
| **Real document extraction** | Replace the simulation. Must preserve per-value provenance and never raise a term's verification state on its own. |
| **Clinical NLP** | Negation, hypotheticals, family-vs-patient attribution, temporal expressions. Getting negation wrong is a patient-safety bug, not a quality issue. |
| **HPO normalisation** | Real term resolution, synonym handling, ontology-aware similarity — a parent/child relationship is not the same as an unrelated term, which the current Jaccard treats identically. |
| **Genetic normalisation** | HGVS validation, transcript resolution, classification context. |
| **Literature integration** | Connect a case to published descriptions, with sources shown. |
| **Stronger similarity engine** | Ontology-aware, evaluated, and **versioned**. |
| **Evidence provenance** | Every value traceable to its source document, page and sentence. |

> **Clinical evaluation is a precondition, not a deliverable of this phase.** Any claim of clinical
> utility requires retrospective evaluation against real cases with known outcomes, expert review,
> and published methodology. Until then the weighting remains what it is today: a product
> simulation ([LIMITATIONS.md](LIMITATIONS.md)).

---

## P3 — Network

**The phase that makes it a network rather than an application.**

| Work | Notes |
| --- | --- |
| **Federated connectors** | Local evaluation, minimal signals in transit — [FEDERATED_ARCHITECTURE.md](FEDERATED_ARCHITECTURE.md). |
| **Rare disease registries** | Cohort-level matching against curated, consented collections. |
| **Research networks** | Connect an unresolved case to an active research programme. |
| **Clinical trial matching** | Surface eligibility for an unresolved case, subject to consent. |
| **Secure collaboration** | The real version of the P0 demo room: authenticated identities, consent-scoped access, server-side audit of everything shared. |
| **Notifications** | Cross-organisation, respecting jurisdiction and consent. |

This phase is where **governance, not engineering, becomes the constraint**. The protocol work is
tractable; the institutional agreements, data-processing agreements and jurisdictional analysis are
the long pole.

---

## P4 — Knowledge ecosystem

**The phase where the network effect closes.**

| Work | Notes |
| --- | --- |
| **ODYSSEY Knowledge Base** | `KnowledgeItem` as a real entity: structured patterns from verified contributions, with provenance, revocability, and contradiction handling ([KNOWLEDGE_NETWORK.md](KNOWLEDGE_NETWORK.md)). |
| **Feedback into matching** | New cases compared against verified patterns, not only individual cases. **This closes the loop the whole product is built around.** |
| **Automatic re-evaluation** | Unresolved cases re-checked when new cases arrive — arguably the highest-value behaviour in a rare-disease network. |
| **ODYSSEY Health Assistant** | A patient-facing layer above the Knowledge Base. |
| **Expert Q&A · knowledge feed** | Professional network: research, clinical questions, case insights, expert answers. |
| **Source-backed answers** | Every claim traceable; every item labelled *Verified by clinician* / *Source-backed* / *Unverified*. |
| **Clinician verification** | Only a qualified expert marks something verified. AI may check sources, detect contradictions, summarise and ask for evidence — never declare truth. |
| **Contribution attribution** | Recognition for verified knowledge. **No payment for a diagnosis. No payment for a referral. No sale of patient data.** |

### ODYSSEY Health Assistant — boundaries

Defined now because a patient-facing layer carries a strictly higher safety bar than a
clinician-facing tool: the reader has no professional context to catch an error with.

**It may:** explain medical terms · explain verified disease information · find relevant materials ·
show sources · explain a document · help prepare questions for a doctor · summarise verified
information · give basic first-aid principles from trusted sources · state clearly when professional
medical help is needed.

**It may not:** diagnose · prescribe · change treatment · tell a patient to stop treatment · replace
a doctor.

---

## Scaling path

```
one clinic  →  city  →  country  →  international network
```

**There is deliberately no separate architecture per country.** One product architecture connects
additional organisations and data sources; jurisdiction is expressed as policy inside the federation
layer rather than as a forked system.

```
more organisations → more cases → more potential connections
                   → more verified knowledge → potentially more useful future matching
```

> This is the **intended network effect**, not guaranteed clinical effectiveness. No clinical
> outcome, diagnostic yield or patient benefit has been measured.

---

## Business model

Directional. **No figures, projections, pipeline or revenue are claimed, and none exist.**

**Potential monetisation:** subscriptions for medical organisations · licensing for research centres
· scientific and international programme funding · permitted matching programmes related to clinical
research or trials.

**Explicit principle: medical data is not sold.**

**Cost centres:** software development · support · secure storage · processing · cybersecurity ·
legal and regulatory · medical-organisation onboarding · scientific validation · matching-algorithm
improvement.

Two of those are routinely underestimated and will dominate: **regulatory/legal**, and **medical
organisation onboarding** — every new institution is a governance negotiation, not a signup form.

---

## Target users

**Primary:** doctors · medical organisations · undiagnosed patients and families · research centres ·
rare disease organisations.

**Potential partners:** pharma · biotech · scientific foundations · government rare disease
programmes · international rare disease programmes.

> **ODYSSEY currently has no users, no pilot sites, no institutional agreements and no partners.**
> The lists above describe who the product is designed for, not who uses it.

---

## Current position

| Phase | Status |
| --- | --- |
| **P0** | ✅ Complete — prototype running, tested, documented |
| **P1** | ⬜ Not started |
| **P2** | ⬜ Not started |
| **P3** | ⬜ Not started |
| **P4** | ⬜ Not started |

P0 has demonstrated that the **representation, the scoring and the clinical-safety model** work and
can carry the rest of the design. It has demonstrated nothing about the backend, governance, legal
or clinical-validation work — and that work is considerably larger than what exists today.
