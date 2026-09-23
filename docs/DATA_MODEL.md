# Data model

The entities ODYSSEY reasons about, and — for each one — whether it exists in code today or is part
of the production vision.

> **How to read the status column**
>
> | Status | Meaning |
> | --- | --- |
> | **IMPLEMENTED** | A TypeScript type in [`src/store/types.ts`](../src/store/types.ts), populated by the synthetic seed and used by running code. It is **not** a database table — there is no database. |
> | **PARTIAL** | Something in the implemented model covers part of this concept, but not the concept as a production system would need it. |
> | **CONCEPTUAL / FUTURE** | Does not exist in this repository. Part of the production data model, described here so the direction is legible. |

---

## 1. Overview

```
           MedicalOrganization ─────┐          (conceptual)
                                    │
                   User ── Doctor ──┴── owns ──► PatientCase
                                                    │
                                        ClinicalProfile (the case's evidence)
                                          ├── Phenotype          HPO-coded
                                          ├── GeneticEvidence
                                          ├── LaboratoryEvidence
                                          ├── ImagingEvidence
                                          ├── TimelineEvent
                                          ├── TreatmentHistory
                                          └── NegativeEvidence
                                                    │
                                        matching engine
                                                    ▼
                                    Match ── MatchEvidence (8 dimensions)
                                       │
                            clinician verification
                                       ▼
                                 Collaboration ── Verification
                                       │            DecisionEntry
                                       │            Message · RoomDocument
                                       ▼
                             KnowledgeContribution
                                       │
                                       ▼
                                  KnowledgeItem      (conceptual)

  Cross-cutting:  Consent (conceptual) · Notification · AuditEvent
```

---

## 2. Identity and organisations

### `User` — **CONCEPTUAL / FUTURE**

No user entity, no account, no credential, no session exists. `/enter` selects a demo persona.
A production `User` would carry authentication identity, credentials, session state, roles and
organisational membership, and would be distinct from the clinical `Doctor` profile.

### `Doctor` — **IMPLEMENTED**

```ts
type Doctor = {
  id: "doc-a" | "doc-b";
  name; initials; role; department;
  institution; city; country; countryCode;
  networkId; accreditation;
};
```

Two synthetic clinicians exist: Dr A. Seitkali (Kazakhstan) and Dr M. Brandt (Germany). The union
type `DoctorId` is literally two values — the demo's clinician switcher, not an identity system.

> **Production:** `Doctor` becomes a profile attached to an authenticated `User`, with verified
> professional credentials, licence jurisdiction, and organisational affiliation as first-class
> verified facts rather than strings.

### `MedicalOrganization` — **PARTIAL**

Institution is currently a **string field** on `Doctor` and on `CaseRecord`, plus a synthetic list
of network nodes used to draw the network map.

> **Production:** a real entity — legal identity, jurisdiction, data-governance policy, participating
> departments, consent scope, and the data-residency rules that determine what may leave the
> organisation. This is the entity federated matching is built around
> ([FEDERATED_ARCHITECTURE.md](FEDERATED_ARCHITECTURE.md)).

---

## 3. The case and its clinical profile

### `PatientCase` → `CaseRecord` — **IMPLEMENTED**

The central entity. Note what it does **not** contain: no patient name, no date of birth, no
identifier that could point at a person. Age is an age *group*, onset is in months from birth.

```ts
type CaseRecord = {
  id; ownerId;                       // ODY-001, doc-a
  country; countryCode; institution; clinician;
  ageGroup; sex; phenotypeCluster;
  status: CaseStatus;
  headline; narrative; enrolled;
  createdAt; updatedAt;
  odysseyMonths;                     // length of the diagnostic course
  phenotypes:       Phenotype[];
  genetics:         GeneticFinding[];
  geneticSummary:   string;
  timeline:         TimelineEvent[];
  milestones:       Record<string, number>;
  labs:             LabRow[];
  imaging:          { modality; age; finding; impression; features[] }[];
  family:           { pedigree; consanguinity; consanguinityNote; siblings; notes; regionalAncestry };
  treatments:       { intervention; duration; response; tone }[];
  negativeEvidence: string[];
  signals:          string[];
  completeness:     { label; value }[];
};
```

**`CaseStatus` — IMPLEMENTED, four states:**

```
Unresolved → Under review → Match proposed → Clinically Corroborated
```

### `ClinicalProfile` — **PARTIAL (implemented as the case's own fields)**

There is no separate `ClinicalProfile` entity; the structured evidence lives directly on
`CaseRecord`. Conceptually it is the same thing — *the comparable representation of a case* — and
the split matters in production, where a case may have several profile versions over time and
matching must run against a specific, immutable version.

### `Phenotype` — **IMPLEMENTED**

```ts
type Phenotype = {
  hpo;                                            // "HP:0001263"
  term; onset; severity: Mild | Moderate | Severe;
  status: "Present" | "Absent" | "Resolved";
  source: "Clinical note" | "AI extraction" | "Referral letter" | "Examination";
  verification: "unverified" | "verified" | "rejected";
  confidence?; evidence?; page?;                  // only for AI-extracted terms
};
```

The three fields that carry the product's safety model:

- **`source`** — where the term came from. AI-proposed terms are marked as such, permanently.
- **`verification`** — an AI proposal starts `unverified` and is **not used by the matching engine**
  until a clinician confirms it. `rejected` terms are excluded from scoring.
- **`evidence` / `page`** — the sentence and page the proposal was drawn from, so a clinician can
  check the claim against the source instead of trusting the extractor.

### `GeneticEvidence` → `GeneticFinding` — **IMPLEMENTED**

```ts
type GeneticFinding = {
  gene; variant; zygosity; classification; inheritance; note;
  category: "sequencing" | "nuclear-variant" | "mitochondrial" | "enzymology";
};
```

Variants are recorded in HGVS-style notation in the synthetic data. There is **no** variant
normalisation service, no ClinVar lookup and no genomic API — see [LIMITATIONS.md](LIMITATIONS.md).

### `LaboratoryEvidence` → `LabRow` — **IMPLEMENTED**

```ts
type LabRow = { analyte; matrix; value; numeric: number | null; unit; ref; flag: "high"|"low"|"normal" };
```

`analyte + matrix` is the comparison key, `numeric` enables value proximity, `flag` enables direction
concordance. There is no unit harmonisation across laboratories — a production requirement.

### `ImagingEvidence` — **IMPLEMENTED (inline)**

```ts
{ modality; age; finding; impression; features: string[] }
```

`features` is the load-bearing field: structured feature **codes** (`putaminal-t2`,
`brainstem-involvement`, `mrs-lactate-peak`, `cerebellar-atrophy`) rather than prose. Codes are what
the engine compares and what the interface can render in either language.

### `TimelineEvent` — **IMPLEMENTED**

```ts
{ age; ageMonths; label; detail; kind: "onset"|"investigation"|"treatment"|"regression"|"stable"|"referral" }
```

Alongside it, `milestones: Record<string, number>` holds milestone onset in months — the direct
input to clinical-trajectory scoring.

### `TreatmentHistory` — **IMPLEMENTED (inline)**

```ts
{ intervention; duration; response; tone: "positive" | "neutral" | "negative" }
```

### Negative evidence — **IMPLEMENTED**

`negativeEvidence: string[]` — what was excluded. The engine canonicalises these to comparison keys
so differently worded exclusions still align. A negative result is evidence; most systems discard it.

---

## 4. Matching

### `Match` — **IMPLEMENTED**

```ts
type Match = {
  id; sourceCaseId; targetCaseId;
  score;                       // 0–100, truncated
  labelKey;                    // "match.label.strong" | "…moderate" | "…weak"
  dimensions:      MatchDimension[];
  explanation:     Phrase[];   // why these cases are similar
  divergences:     Phrase[];   // where they disagree
  sharedPhenotypes; uniqueToSource; uniqueToTarget;
  status: MatchStatus;
  createdAt; requestedBy?; requestNote?;
};
```

**`MatchStatus` — IMPLEMENTED, six states:**

```
surfaced ──► dismissed
     │
     └────► requested ──► declined
                  │
                  └─────► accepted ──► verified
```

### `MatchEvidence` → `MatchDimension` — **IMPLEMENTED**

One per evidence group, eight per match:

```ts
type MatchDimension = {
  id: "phenotype"|"trajectory"|"genetics"|"laboratory"|"imaging"|"temporal"|"family"|"negative";
  labelKey; score; weight;
  direction: "supporting" | "divergent";
  summary: Phrase; aValue: Phrase; bValue: Phrase;
};
```

This is what makes matching explainable rather than opaque: the contribution of each evidence group
is a stored, inspectable value, not a post-hoc narration of a single number.

### `Phrase` — **IMPLEMENTED**

```ts
type Phrase = { key; params?; lists?; listsLower? };
```

Every sentence the engine produces. A key plus data, never a finished string — see
[ARCHITECTURE.md §7](ARCHITECTURE.md#7-internationalisation).

---

## 5. Collaboration

### `Collaboration` — **IMPLEMENTED (client-side)**

```ts
type Collaboration = {
  id; matchId; caseAId; caseBId; doctorAId; doctorBId;
  openedAt; stageIndex;
  messages:     Message[];
  documents:    RoomDocument[];
  decisionLog:  DecisionEntry[];
  verifications: Verification[];
};
```

The room id is derived deterministically from the match (`col-${matchId}`).

> **This is a demo, not a secure production channel.** No server, no transport encryption of clinical
> payloads, no access control beyond the demo clinician switcher.

### `Message` — **IMPLEMENTED**

```ts
{ id; author: DoctorId | "system"; body; bodyKey?; bodyParams?; at; kind?; attachment? }
```

Clinician-written text is stored as written (`body`). System messages store a key (`bodyKey`) so
they re-render in the active language. **Clinical testimony is never machine-translated.**

### `Verification` — **IMPLEMENTED**

```ts
{ by: DoctorId; at: number; notes: string }
```

Two independent verifications — one per clinician — are required before a connection is corroborated.
A clinician cannot verify twice to satisfy the requirement alone.

### `DecisionEntry` — **IMPLEMENTED**

```ts
{ id; actor?; actorKey?; actionKey; at: number | null; state: "done" | "pending" | "blocked" }
```

An auditable record of who did what, and what is still outstanding.

### `Consent` — **CONCEPTUAL / FUTURE**

**Does not exist.** In production this is one of the most important entities in the system: who
consented, to what disclosure, for which purpose, under which jurisdiction, for how long, and how it
is withdrawn. Every cross-organisation disclosure should be traceable to a consent record. See
[SECURITY.md](SECURITY.md).

---

## 6. Knowledge

### `KnowledgeContribution` → `Contribution` — **IMPLEMENTED (local state)**

```ts
type Contribution = {
  id; title; caseIds: string[]; contributors: string[];
  evidence; detail: string[];
  status: "Verified"; createdAt;
};
```

Created when both clinicians have independently verified clinical relevance. Both cases then move to
*Clinically Corroborated*.

### `KnowledgeItem` — **CONCEPTUAL / FUTURE**

**Does not exist.** The reusable unit of the future knowledge base: a structured pattern derived from
confirmed connections, with provenance, verification status, source references, and a link back to
the contributions that produced it. See [KNOWLEDGE_NETWORK.md](KNOWLEDGE_NETWORK.md).

### Contribution attribution / reward ledger — **CONCEPTUAL / FUTURE**

**Does not exist in any form.** There is no reward, credit, token, ledger or payment code anywhere in
this repository. `Contribution.contributors` records *who contributed*, and nothing else.

Explicit product principles for any future attribution system:

- **No payment for a diagnosis.**
- **No payment for a referral.**
- **No sale of patient medical data.**

---

## 7. Cross-cutting

### `Notification` → `AppNotification` — **IMPLEMENTED**

```ts
{ id; to: DoctorId; kind; titleKey; titleParams?; detailKey; detailParams?; href; read }
```

Seven kinds: `match`, `connection-request`, `connection-accepted`, `connection-declined`,
`verification-requested`, `verification-complete`, `contribution`. Stored as **keys**, so the feed
re-renders in the active language.

### `AuditEvent` — **IMPLEMENTED (client-side)**

```ts
{ id; actorId: DoctorId | "system"; action: AuditAction; subject; detailKey; detailParams?; at }
```

Twelve audited actions:

```
session.started · case.created · document.uploaded · extraction.completed
phenotype.verified · phenotype.rejected · match.generated
connection.requested · connection.accepted · connection.declined
verification.completed · contribution.recorded
```

Visible at `/admin`.

> **Production:** the audit log must be **server-side and append-only**. A client-side log in
> `localStorage` demonstrates the concept of traceability; it provides none of its guarantees.

---

## 8. Summary

| Entity | Status |
| --- | --- |
| `Doctor` | **IMPLEMENTED** |
| `PatientCase` / `CaseRecord` | **IMPLEMENTED** |
| `Phenotype` | **IMPLEMENTED** |
| `GeneticEvidence` | **IMPLEMENTED** |
| `LaboratoryEvidence` | **IMPLEMENTED** |
| `ImagingEvidence` | **IMPLEMENTED** |
| `TimelineEvent` | **IMPLEMENTED** |
| `TreatmentHistory` | **IMPLEMENTED** |
| `Match` | **IMPLEMENTED** |
| `MatchEvidence` / `MatchDimension` | **IMPLEMENTED** |
| `Collaboration` | **IMPLEMENTED** *(client-side demo)* |
| `Verification` | **IMPLEMENTED** |
| `Notification` | **IMPLEMENTED** |
| `AuditEvent` | **IMPLEMENTED** *(client-side)* |
| `KnowledgeContribution` | **IMPLEMENTED** *(local state)* |
| `ClinicalProfile` | **PARTIAL** — fields on the case, not a versioned entity |
| `MedicalOrganization` | **PARTIAL** — a string, not an entity |
| `User` | **CONCEPTUAL / FUTURE** |
| `Consent` | **CONCEPTUAL / FUTURE** |
| `KnowledgeItem` | **CONCEPTUAL / FUTURE** |
| Contribution reward ledger | **CONCEPTUAL / FUTURE** — no code exists |

**None of the implemented entities is a database table.** There is no database. They are TypeScript
types populated from a synthetic seed and persisted to `localStorage`.
