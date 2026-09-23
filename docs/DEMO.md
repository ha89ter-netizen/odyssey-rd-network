# Demo scenarios

Three scenarios you can run yourself, at <https://odyssey-rd-network.vercel.app> or locally with
`npm run dev`.

> **All data is synthetic.** The cases, clinicians, institutions, variants, laboratory values and
> scores below are demonstration data. No real patient, clinician, institution or genomic result is
> represented.

**Reset at any time** from `/settings`, or by clearing site data. Scenario A is asserted end to end
by `npm run e2e` (70 assertions).

---

## The cast

| | |
| --- | --- |
| **Dr A. Seitkali** | Clinical Geneticist · National Research Center for Maternal & Child Health · Astana, Kazakhstan |
| **Dr M. Brandt** | Consultant in Neurometabolic Disease · Universitätsklinikum Heidelberg · Germany |
| **ODY-001** | *Progressive infantile encephalopathy of unknown molecular cause* · Child · 4y · Kazakhstan |
| **ODY-742** | *Progressive encephalopathy with putaminal involvement, molecularly unsolved* · Child · 3y 9m · Germany |

The demo network holds **17 synthetic cases** across both clinicians.

The two doctors have never met. Neither knows the other's case exists.

---

## Scenario A — International match

**The question:** two children, 4 000 km apart, both undiagnosed for years. Is it the same thing?

### 1 · Enter

Open `/enter` and choose **Dr A. Seitkali**. No account, no password — this is a demo persona
switcher, not authentication.

You land on `/dashboard`: her cases, open matches, and verification tasks.

### 2 · Create a case

`/cases/new`. A three-step form: identification, clinical picture, evidence. The case is created
with status **Unresolved** and appears immediately in `/cases`.

> Nothing here asks for a patient name or date of birth. The model has no field for either.

### 3 · Upload a report

Open the new case → **Verify extracted terms**, or go straight to `/cases/[id]/verify`.

Choose one of the two synthetic documents — *Neurology discharge summary* (7 pages) or *Metabolic
work-up report* (4 pages) — and upload it.

### 4 · Simulated extraction

The panel is labelled **SIMULATED AI EXTRACTION** and stays labelled after it finishes.

> **No model is called.** The document maps to a fixed list of proposed terms. This is a product
> simulation of AI-assisted extraction — see [LIMITATIONS.md](LIMITATIONS.md).

Each proposal arrives with:

- the **HPO code** and term,
- **onset** and **severity**,
- a **confidence** value,
- **the sentence it was drawn from**, and the page number.

Low-confidence proposals are flagged. So are proposals drawn from a sentence containing a negation,
because *"has **not** acquired independent sitting by 8 months"* supports the term *global
developmental delay* — but a clinician, not a regex, should be the one to say so.

### 5 · Clinician verification

Confirm, edit or reject each term individually.

**This step is not decorative.** A proposed term carries `verification: "unverified"` and is
**excluded from the matching engine** until a clinician confirms it. Rejected terms never enter
scoring. AI proposes; the clinician decides what the case actually says.

Watch the **case completeness** figure move as terms are confirmed. Completeness governs how much
the engine has to compare — it is not a measure of case severity, and the interface says so.

### 6 · Search the network

Open **ODY-001** and press **Find matches**.

The dialog shows what the search is doing:

```
✓ Normalising structured signals        Phenotype terms mapped to HPO; variants to HGVS
✓ Dispatching federated query           Member institutions evaluate locally
✓ Screening candidate records           Every case in the network is scored against yours
✓ Ranking by evidence similarity        Candidates below the review threshold are discarded
```

It is labelled **SIMULATED MATCHING ENGINE — deterministic, and running entirely in your browser**,
because that is exactly what it is. The federation language describes the intended production
architecture ([FEDERATED_ARCHITECTURE.md](FEDERATED_ARCHITECTURE.md)); in P0 all 17 cases live in
the same browser tab.

### 7 · ODY-742 surfaces

```
ODY-001 ↔ ODY-742        85 / 100        STRONG POTENTIAL MATCH
Kazakhstan → Germany     7 of 8 evidence groups concordant
```

Beside the score: *"Not a diagnostic probability. Requires clinician review."*

Only one candidate clears the review threshold of 55. The others — 31, 27, 26 — are never shown.

### 8 · Why did it match?

`/matches/[id]` — the screen that makes the product worth building.

**Why this match was surfaced** — *assembled from the structured evidence, not generated prose:*

> 1. 7 phenotype features overlap, including global developmental delay, hypotonia and seizure.
> 2. The clinical trajectories show the same progression, aligning to within 1 month at every
>    recorded milestone.
> 3. Both cases contain unresolved genetic findings in NDUFAF6, and the same coding variant is
>    present in each.
> 4. 7 laboratory analytes are abnormal in the same direction in both cases.
> 5. Imaging shows the same pattern: bilateral putaminal T2 hyperintensity, brainstem involvement,
>    MR spectroscopy lactate peak and cerebellar atrophy.
> 6. ODY-742 records dysphagia and complex I activity, which ODY-001 has not assessed — potentially
>    relevant for clinician review.
> 7. Both cases exclude the same 6 organ systems, which narrows the differential in the same
>    direction.

Point 6 is the one to notice. **A gap in one record is surfaced explicitly**, as a reason for
clinician attention — not quietly absorbed into a lower number.

**Evidence profile** — the eight groups, each scored independently:

| Group | Score | Weight |
| --- | ---: | ---: |
| Phenotype similarity | 91 | 22% |
| Clinical trajectory | 87 | 16% |
| Genetic evidence | 77 | 18% |
| Laboratory pattern | 75 | 12% |
| Imaging pattern | 100 | 12% |
| Temporal similarity | 91 | 8% |
| Family pattern | 54 | 6% |
| Negative evidence | 100 | 6% |

Family pattern at 54 is reported as a **divergence**, not hidden. An honest match shows where it
disagrees with itself.

### 9 · Compare the cases

`/matches/[id]/compare` — a side-by-side comparison across every evidence group, each row labelled
*shared*, *partial*, *differs*, *only A* or *only B*.

### 10 · Request a connection

**Request clinical connection**, with a note to the other clinician. The match moves to `requested`;
ODY-001 moves to *Match proposed*; Dr Brandt receives a notification.

Nothing about the other case has been disclosed beyond what the match already showed.

### 11 · Switch to Dr Brandt

Use the clinician chip in the header. The view becomes his: his cases, his notifications, his
pending request.

> Two people, one browser. This is a demo affordance, not an identity system.

### 12 · Accept

He opens the request, sees the same evidence from his side, and accepts. A **collaboration room**
opens.

### 13 · The room

`/collaboration/[id]` — the discussion sits beside the evidence, not instead of it: case summary,
evidence comparison, shared documents, a decision log of what has been done and what is outstanding.

**Start secure call** opens a simulated call panel — identity tiles rather than video frames, with
the note that it is a demonstration.

### 14 · Dual verification

Each clinician verifies **clinical relevance of the connection** independently, with a written
rationale.

> They are not verifying a diagnosis. They are verifying that **these two cases are clinically
> related and worth joint investigation.** The interface never phrases it as anything else.

One clinician cannot satisfy the requirement alone — the second verification stays `pending` until
the other person provides it.

### 15 · Knowledge contribution

With both verifications recorded, a **knowledge contribution** is created at `/knowledge`: the
pattern, the contributing cases, the contributors, and the evidence behind it. Both cases move to
**Clinically Corroborated**.

Check `/admin` for the full audit trail — every step from `session.started` to
`contribution.recorded`.

---

## Scenario B — No match

**Run a search on `ODY-027`.**

Verified engine output:

```
ODY-027 → 0 surfaced (threshold 55)
   ODY-093    37
   ODY-128    33
   ODY-136    32
   ODY-081    28
```

Nothing clears the review threshold. The result screen says so plainly.

**What this does not mean:**

> ~~"No one has this disease."~~

**What it means:**

> **"No sufficiently strong match was found in the currently available dataset."**

The case remains in the network and stays eligible for re-evaluation when new cases arrive. This is
a real engine result, not a mock screen — and getting it right matters more than getting a match
right, because a product that only ever demonstrates success is not demonstrating anything.

### The third state: not yet searched

A case that has **never been compared** is tracked separately (`state.searched`) from a case that
was compared and produced nothing. The dashboard shows them differently.

These are different clinical situations:

| | |
| --- | --- |
| *Not searched* | Nobody has looked yet. |
| *No strong match* | Somebody looked, and the network currently holds nothing similar enough. |

Collapsing them would let a clinician believe a question had been asked when it had not. That is a
safety property, not a UI detail.

---

## Scenario C — The network effect over time

**Conceptual — this is the product's reason to exist, and it is not something a single demo session
can demonstrate.**

Today's outcome is not the match. It is that ODY-001 and ODY-742 are now **connected, verified, and
described in structured form**.

```
     2026            ODY-001 unresolved (Kazakhstan)
     2026            ODY-742 unresolved (Germany)
                              │
                     match → verification → contribution
                              ▼
                     a structured, clinician-verified pattern
                              │
     later            ODY-9xx arrives somewhere else
                              ▼
        compared not only against individual cases,
        but against a pattern two clinicians already confirmed
```

```
Old unresolved case + new case → new evidence → new connection → new knowledge
```

Each verified connection makes the next case slightly easier to recognise. The network's value
compounds with the number of **verified** connections in it, not with the number of records in it.

> **This is the intended network effect — product architecture, not a demonstrated clinical
> outcome.** No clinical effectiveness has been measured, and no claim about diagnostic yield is
> being made. See [KNOWLEDGE_NETWORK.md](KNOWLEDGE_NETWORK.md).

---

## Running the demo in Russian

Press **РУ** in the header at any point, including mid-flow.

The whole interface switches, and so do the engine-generated sentences — the explanation above is
assembled from a key and data rather than stored as English text, so it renders as Russian prose
with correct grammar and plural forms rather than as a translated string.

What does **not** switch: free text a clinician typed. A discussion note or a verification rationale
is clinical testimony and stays in the language it was written in.

`npm run e2e:ru` asserts this (19 checks), including that engine-generated sentences contain no
Latin-script leftovers.
