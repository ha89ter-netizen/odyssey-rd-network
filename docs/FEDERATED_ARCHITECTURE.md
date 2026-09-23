# Federated architecture

How ODYSSEY intends to search globally without accumulating the world's clinical records in one
place.

> ## ⚠ This document describes PLANNED architecture
>
> **None of it is implemented.** In the P0 prototype, all 17 synthetic cases live in a single
> browser tab and the search runs locally against all of them. The interface uses federation
> language ("member institutions evaluate locally — no identifiable data is transmitted") to
> describe the intended architecture, and labels the whole search **SIMULATED MATCHING ENGINE**.
>
> This document is the design that language is describing. See [LIMITATIONS.md](LIMITATIONS.md).

---

## The problem with the obvious design

The straightforward way to build a global rare-disease matching network is to collect every case
into one database and query it.

It would work. It should not be built.

A single repository of the world's rare-disease records is a permanent, concentrated, extremely
high-value target. Every participating institution would have to accept that risk indefinitely in
exchange for occasional benefit. Institutions with strict data governance — often exactly the ones
holding the most carefully characterised rare-disease cohorts — cannot participate on those terms,
and should not be asked to.

Centralisation also makes the hardest problem in the system permanent: jurisdiction. Data that may
be *compared* across a border frequently may not be *moved* across it. A centralised design has to
either ignore that or refuse those participants. A federated design can express it.

> **Global discovery without unnecessary centralisation of raw clinical records.**

---

## The intended flow

```
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│  Medical Organization A          │        │  Medical Organization B          │
│                                  │        │                                  │
│  raw records · documents         │        │  raw records · documents         │
│  imaging · genomic data          │        │  imaging · genomic data          │
│            │                     │        │            │                     │
│            ▼                     │        │            ▼                     │
│  Local Case Representation       │        │  Local Case Representation       │
│  structured, pseudonymous        │        │  structured, pseudonymous        │
│            │                     │        │            ▲                     │
└────────────┼─────────────────────┘        └────────────┼─────────────────────┘
             │  minimal structured query                 │  scored locally;
             ▼                                           │  only a signal returns
        ┌─────────────────────────────────────────────────────┐
        │  FEDERATED MATCHING LAYER                           │
        │  routing · policy · jurisdiction rules · audit      │
        │  holds no clinical records                          │
        └─────────────────────────┬───────────────────────────┘
                                  ▼
                        Minimal Structured Signal
               { candidate ref, score, dimension scores,
                 evidence-group concordance }   ← no record content
                                  ▼
                           Potential Match
                                  ▼
                        Permission / Consent
                                  ▼
                   Clinician-to-Clinician Interaction
                     scoped disclosure · fully audited
```

**What never moves:** raw documents, imaging files, genomic data, narratives, identifiers.

**What moves:** a structured query, and a score with its evidence-group breakdown.

---

## Stage by stage

### 1 · Local case representation

Each organisation converts its own records into the structured profile — HPO-coded phenotypes,
analyte + matrix + value laboratory rows, imaging feature codes, milestone months, canonicalised
exclusions. This is the representation the P0 data model already uses
([DATA_MODEL.md](DATA_MODEL.md)).

It stays inside the organisation. The re-identification mapping never leaves.

### 2 · Federated matching layer

A routing and policy layer that **holds no clinical records**. Its jobs:

- route a structured query to organisations whose policy permits evaluation;
- evaluate jurisdiction and consent rules per organisation *pair*;
- collect returned signals;
- record every query and every response in an append-only audit log.

If this layer is compromised, the attacker gets query metadata and scores — not clinical records.
That property is the entire point of the design, and it constrains what the layer is permitted to
cache.

### 3 · Local evaluation

Scoring runs **inside** the responding organisation, against its own records. The engine is the same
deterministic code; only its location differs.

This is what makes the P0 engine's design relevant rather than incidental: it is pure, has no
dependencies, needs no network, and produces identical output from identical input. Code shaped like
that can be shipped to run anywhere, and its results can be reproduced and audited by the
organisation that ran it.

### 4 · Minimal structured signal

A response carries a candidate reference, an overall score, per-dimension scores and evidence-group
concordance — and **no record content**.

Enough to decide whether a human should look. Not enough to reconstruct a patient.

### 5 · Permission

Above the threshold, a request for contact goes to the responding organisation and its clinician.
Consent scope, jurisdiction and institutional policy are evaluated **before** any case content is
disclosed.

Refusal is a normal outcome, not an error state.

### 6 · Clinician-to-clinician interaction

Only after permission does scoped case content become visible, and only to the clinicians involved,
and only what the consent covers. Everything disclosed is audited server-side and visible to the
originating organisation.

---

## Design constraints this places on the engine

Federation is not something that can be added later to an arbitrary matching engine. It requires:

| Constraint | Why |
| --- | --- |
| **Deterministic** | Two organisations must compute the same score from the same inputs, and an auditor must be able to reproduce it months later. |
| **Pure, no shared state** | The engine must run correctly in isolation inside someone else's infrastructure. |
| **Structured inputs only** | Comparing free text would require moving free text. |
| **Explainable from the signal alone** | The receiving clinician must understand *why* without being shown the other record. |
| **Versioned** | A stored match must record which engine version produced it, or a score becomes uninterpretable over time. |
| **Truncating, not rounding** | Thresholds are policy boundaries across organisations; they must mean exactly the same thing everywhere. |

The P0 engine already satisfies the first four. **Versioning is not implemented** and is a P1/P2
requirement.

---

## Future connector architecture

**All connectors are FUTURE INTEGRATIONS. None exists in P0.** There is no integration with any
external system whatsoever.

| Connector class | Intended role |
| --- | --- |
| **Medical networks / EHR systems** | Convert institutional records into the local case representation |
| **Genomic databases** | Variant normalisation and classification context |
| **Rare disease registries** | Cohort-level matching against curated, consented collections |
| **Research systems** | Connect an unresolved case to an active research programme |
| **Clinical trial systems** | Surface eligibility for an unresolved case, subject to consent |

Design rules for every connector:

1. **Connectors adapt inward.** External schemas convert to the ODYSSEY representation at the edge;
   the core model does not bend to accommodate a source.
2. **A connector never widens disclosure.** It cannot grant access the consent record does not
   cover.
3. **Provenance is preserved.** Every imported value carries where it came from, so a clinician can
   assess its weight.
4. **Connectors are optional.** The network must function, and degrade honestly, when a source is
   unavailable — a missing connector produces *"not searched"*, never a silent *"no match."*

---

## Honest assessment

What the P0 prototype has actually demonstrated toward this architecture:

| | |
| --- | --- |
| ✅ | A structured case representation that is comparable across institutions and languages |
| ✅ | A deterministic, pure, dependency-free scoring engine that could run anywhere |
| ✅ | An explanation derived entirely from structured signals, not from record content |
| ✅ | A permission step between a surfaced match and any case disclosure |
| ❌ | Any actual federation — there is one browser and one dataset |
| ❌ | Any network protocol, routing layer, or policy engine |
| ❌ | Any consent model — the entity does not exist |
| ❌ | Any connector to any external system |
| ❌ | Engine versioning |

The prototype has shown that the **representation and the scoring** can carry this design. It has
demonstrated nothing about the distributed systems, governance or legal work that the rest of it
requires — and that work is considerably larger than what exists today.
