# Medical safety

The boundary between what the system may compute and what only a clinician may decide.

---

## The governing principle

> # AI inference ≠ clinical decision

Everything else in this document follows from that line.

```
AI inference  →  evidence  →  clinician interpretation  →  clinical decision
    │               │                    │                        │
 the system      the system          the human                the human
  produces        presents            evaluates                 decides
```

The system's output is an **input to a clinician's reasoning**. It is never the conclusion.

---

## What ODYSSEY does not do

ODYSSEY does **not**:

- **independently diagnose** a patient;
- **prescribe** medication;
- **change** treatment;
- **stop** treatment;
- **replace** a clinician;
- **declare a match to be a confirmed diagnosis.**

And it is not:

- a symptom checker;
- an autonomous diagnostic system;
- a generic chatbot;
- a medical forum;
- a crowdsourcing platform.

> **ODYSSEY is not a medical device.** It is not certified or approved by any regulatory authority
> and must not be used for clinical decision-making, diagnosis or treatment. All data in this
> repository is synthetic. See [LIMITATIONS.md](LIMITATIONS.md).

---

## Division of roles

| AI may | A human must |
| --- | --- |
| Extract structured data from documents | Interpret what the case clinically means |
| Normalise terms to shared vocabularies | Verify that extracted data is correct |
| Compute similarity between records | Judge whether a similarity is clinically meaningful |
| Summarise and organise evidence | Decide what to investigate next |
| Surface potentially relevant sources | Make every clinical decision |

The system is allowed to be **confidently wrong about structure**. It is never allowed to be
confident about **clinical meaning**.

---

## Where the boundary is enforced in code

Not principles on a page — these are implemented behaviours in this repository.

### 1 · Extracted terms do not count until a clinician confirms them

An AI-proposed phenotype carries `verification: "unverified"` and is **excluded from the matching
engine**. Only `verified` terms with `status: "Present"` are scored; `rejected` terms never enter
scoring at all.

```ts
// src/store/matching.ts
const present = (c) => c.phenotypes.filter(
  (x) => x.status === "Present" && x.verification !== "rejected"
);
```

The clinician's review is a gate, not a formality. Skipping it changes the result.

### 2 · Every proposal carries its source

Each extracted term stores `evidence` (the sentence it came from) and `page`, so a clinician can
check the claim against the document rather than trusting the extractor. A claim without a citable
source is not reviewable, and an unreviewable claim has no place in a clinical record.

### 3 · The label never disappears

**SIMULATED AI EXTRACTION** is shown while extraction runs *and after it completes*. An end-to-end
assertion exists specifically to stop the label from being lost in a refactor — losing it after
completion is precisely when it would matter most.

### 4 · A score is never presented as a probability

The match screen shows the number beside the words *"Not a diagnostic probability. Requires
clinician review."* The engine's own source comment states:

> *A score expresses SIMILARITY OF RECORDED EVIDENCE between two cases. It is not a diagnostic
> probability and carries no clinical claim.*

### 5 · Scores are truncated, never rounded up

`Math.floor` everywhere. A system that rounds 84.6 up to 85 to cross a "strong match" threshold is
optimising for its own appearance at a clinician's expense.

### 6 · Below-threshold candidates are never shown

Nothing under 55 reaches a clinician. Showing weak candidates would manufacture the appearance of
productivity and cost clinician attention — the scarcest resource in the entire system.

### 7 · "Not searched" and "no match" are different states

Tracked separately in `state.searched` and displayed differently.

| | |
| --- | --- |
| *Not searched* | Nobody has looked yet. |
| *No strong match* | Somebody looked, and nothing sufficiently similar exists **in the currently available dataset.** |

Collapsing these would let a clinician believe a question had been asked when it had not. Neither
state ever means *"no one has this disease."*

### 8 · Verification verifies a connection, not a diagnosis

The clinical verification step confirms that **two cases are clinically related and worth joint
investigation.** It never asserts that a patient has a disease. Every string in the interface is
worded that way.

### 9 · Two independent clinicians are required

One clinician cannot verify both sides. The second verification stays `pending` until the other
person provides it — enforced in the reducer, not by convention.

### 10 · Divergences are shown, not hidden

Every evidence group scoring below the concordance line is reported as a divergence. In the demo
match, family pattern scores 54 and is displayed as such beside the overall 85. A match that only
shows its agreements is advocacy, not evidence.

### 11 · Gaps are surfaced as gaps

Evidence recorded on one side and not the other appears explicitly — *"ODY-742 records dysphagia and
complex I activity, which ODY-001 has not assessed."* A missing investigation is a reason for
clinician attention, not something to silently absorb into a lower number.

### 12 · Every action is audited

Twelve audited actions covering extraction, verification, connection and contribution. Client-side
in P0 — a demonstration of traceability, not a guarantee of it ([LIMITATIONS.md](LIMITATIONS.md)).

### 13 · Clinician-authored text is never machine-translated

Discussion notes and verification rationales are stored and displayed exactly as written, in the
language they were written in. Structured vocabulary is translated; clinical testimony is not.
Silently paraphrasing a clinician's words into another language would put words in their mouth.

### 14 · The demonstration disclaimer is on every screen

**DEMONSTRATION DATA — NOT FOR CLINICAL USE · SYNTHETIC RECORDS ONLY**, in the shell bar and on
every relevant page.

---

## Language rules

The product's vocabulary is a safety feature. Words the interface uses:

| Permitted | Prohibited |
| --- | --- |
| Potential match | ~~Diagnosis~~ |
| Evidence similarity | ~~Diagnostic probability~~ |
| Strong / moderate / weak potential match | ~~Confirmed disease~~ |
| Requires clinician review | ~~AI found the answer~~ |
| AI-assisted extraction | ~~AI diagnosed~~ |
| Clinically corroborated *(connection)* | ~~Clinically confirmed (diagnosis)~~ |
| No sufficiently strong match in the available dataset | ~~No one has this disease~~ |

**The system must never claim that AI diagnosed a patient.** Not in the interface, not in a
notification, not in the audit log, not in marketing, not in this documentation.

---

## Safety requirements for future work

Binding constraints on P1–P4, not aspirations:

**Extraction (P2).** Real extraction must preserve source provenance per extracted value, must not
raise a term's verification state on its own, must express uncertainty explicitly, and must flag
negation and hypothetical language rather than resolving it silently.

**Matching (P2).** Any change to the weighting must be versioned, and every stored match must record
which engine version produced it. A clinician looking at a six-month-old match must be able to know
what produced that number. Clinical evaluation must precede any claim of clinical utility.

**Collaboration (P1/P3).** Disclosure must be consent-scoped and auditable server-side. A clinician
must be able to see exactly what was disclosed about their case, to whom, and on what basis.

**Health Assistant (P4).** Any patient-facing layer must never diagnose, never prescribe, never tell
a patient to change or stop treatment, always show sources, always distinguish verified from
unverified information, and always state clearly when professional medical help is needed. A
patient-facing assistant carries a strictly higher safety bar than a clinician-facing tool, because
the reader has no professional context to catch an error with.

**Knowledge (P4).** AI may check sources, detect contradictions, summarise, and ask for evidence. AI
may **not** mark medical information as verified. Only a qualified expert determines clinical
verification, and every item must carry an explicit label: *Verified by clinician*, *Source-backed*
or *Unverified*.

---

## If you find a safety problem

Open an issue describing the behaviour and where it appears. Safety issues — anything that could
lead a reader to believe the system makes a clinical claim it does not make — take priority over
features.
