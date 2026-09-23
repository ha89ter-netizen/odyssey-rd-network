# The knowledge network

Why ODYSSEY's value is meant to compound, and what part of that exists today.

---

## The idea

A match is not the product. **A verified connection is.**

When two clinicians independently confirm that two cases are clinically related, something exists
that did not exist before: a structured, human-verified statement about a pattern. That statement
can be compared against future cases.

```
Case A  ──┐
          ├──►  Confirmed relationship  ──►  Structured knowledge  ──┐
Case B  ──┘                                                          │
                                                                     ▼
                                                            Case C ──┤
                                                                     ├──►  and so on
                                                            Case D ──┘
```

> ### Knowledge compounds over time.

The network's value grows with the number of **verified connections** in it — not with the number of
records in it. A million unconnected records is a storage problem. A thousand verified connections
is a knowledge base.

---

## Why a single case is nearly useless and two are not

One unresolved rare case is an anecdote. There is no way to tell which of its features are the
disease and which are noise.

Two cases that match across independent evidence groups — phenotype, trajectory, genetics,
laboratory, imaging — start to separate signal from coincidence. The features they share are
candidates for the actual phenotype of whatever this is; the features they do not share are
candidates for individual variation.

That separation is **new information**, and it did not exist in either record alone.

```
Case A alone            →  a list of findings, unweighted
Case A + Case B         →  which findings recur, and which do not
+ clinician verification →  a statement someone is accountable for
+ Case C                 →  the pattern tested against a third instance
```

This is also why the system surfaces **divergences** and **gaps** as prominently as agreements. The
places two cases disagree are where the next investigation should go.

---

## What exists in P0

**Implemented — running on local state:**

| | |
| --- | --- |
| **Dual verification** | Two distinct clinicians must independently verify clinical relevance. One cannot satisfy both sides — enforced in the reducer. |
| **`Contribution`** | Created on the second verification: title, contributing case ids, contributors, evidence, detail. Visible at `/knowledge`. |
| **Status propagation** | Both cases move to **Clinically Corroborated**. |
| **Audit** | `verification.completed` and `contribution.recorded` events. |
| **Re-evaluation state** | Cases that produced no match stay in the network and remain eligible when new cases arrive (`state.searched`). |

**What does not exist:**

| | |
| --- | --- |
| ❌ | A `KnowledgeItem` entity — the reusable, structured pattern derived from contributions |
| ❌ | Any feedback loop from a contribution back into the matching engine |
| ❌ | Re-evaluation actually running when a new case arrives |
| ❌ | Any knowledge base, feed, search or query interface over contributions |
| ❌ | Any attribution, credit, reward or ledger mechanism — **no such code exists anywhere in this repository** |

**A contribution in P0 is a record that two clinicians agreed. It does not yet make the engine any
better.** That loop is the product's central promise and is a P2/P4 item
([ROADMAP.md](ROADMAP.md)).

---

## The intended loop

```
   new case
      │
      ▼
   matched against
   individual cases  ──── and ────  verified patterns
      │                                    ▲
      ▼                                    │
   potential match                         │
      │                                    │
      ▼                                    │
   clinician verification                  │
      │                                    │
      ▼                                    │
   knowledge contribution ─────────────────┘
      │
      ▼
   pattern available to every future case
```

The closing arrow is the one that matters and the one that does not exist yet.

For it to be built responsibly, several things must be true, and stating them now is cheaper than
discovering them later:

1. **Provenance is mandatory.** Every derived pattern must carry the cases and clinicians it came
   from. A pattern nobody is accountable for should not influence a clinical suggestion.
2. **Verification does not transfer.** That A and B are related does not make C related to either.
   A pattern match is still a *potential* match requiring its own clinician review.
3. **Contradiction is information.** A case that matches a pattern on six groups and contradicts it
   on two must surface the contradiction, not average it away.
4. **Patterns can be wrong, and must be revocable.** Two clinicians can agree and both be mistaken.
   A pattern must be withdrawable, and everything it influenced must be traceable.
5. **Confidence must not inflate with reuse.** A pattern cited many times is not thereby more true.
   Popularity is not evidence.

---

## Re-evaluation over time

The case that produced nothing today is not finished.

```
   2026   ODY-027 searched → 0 candidates above threshold
          case remains in the network
                    │
   later   a new case arrives from another country
                    │
                    ▼
          ODY-027 re-evaluated automatically
                    │
                    ▼
          a match that could not have existed before
```

For a rare-disease network this is arguably the **most valuable behaviour in the system**, because
the most common outcome for a genuinely rare case is *no match yet*. A network that only helps on
the day you search is a search engine. A network that keeps looking is infrastructure.

**Status: conceptual.** P0 keeps unresolved cases in the network and distinguishes *not searched*
from *no match*, which is the state model re-evaluation needs. It does not re-run anything.

> ⚠ **Known inconsistency.** The no-match screen's *Standing query* panel currently tells the
> clinician that the case "is scored automatically when a new case is submitted anywhere in the
> network." That is the intended behaviour, not the implemented one — `createCase` does not re-score
> previously searched cases. The copy should be re-worded or the behaviour implemented; it is
> recorded in [LIMITATIONS.md](LIMITATIONS.md) rather than left for a reader to discover.

---

## ODYSSEY Knowledge — future

**Conceptual / planned. Does not exist.**

A professional medical knowledge network above the contribution layer: research, clinical questions,
case insights, expert answers, AI summaries and source checks — structured as a feed, with explicit
labels on every item:

| Label | Meaning |
| --- | --- |
| **Verified by clinician** | A qualified expert has reviewed and confirmed |
| **Source-backed** | Traceable to a citable source, not yet expert-reviewed |
| **Unverified** | Neither |

**AI may** check sources, detect contradictions, summarise, and ask for evidence.

**AI may not** declare medical information to be true. Clinical verification is determined by a
qualified expert. This is the same boundary the matching engine already respects
([MEDICAL_SAFETY.md](MEDICAL_SAFETY.md)).

---

## Contribution attribution — future

**Conceptual / planned. No code exists.**

Clinical insight is currently unrewarded infrastructure work. A doctor who recognises a pattern and
documents it well creates value for every future case and receives nothing for it. A future
attribution system could record and recognise that contribution.

Binding principles for anything built here:

- **No payment for a diagnosis.**
- **No payment for a referral.**
- **No sale of patient medical data.**

Any incentive that could bias a clinical judgment is disqualified by construction. Attribution may
recognise *that someone contributed verified knowledge* — never *what they concluded about a
patient*.

`Contribution.contributors` records who contributed. That is the whole of it today. There is no
reward, credit, token, ledger or payment code anywhere in this repository.

---

## Honest position

| Claim | Status |
| --- | --- |
| Two clinicians can verify a connection and record a contribution | ✅ **implemented** |
| Cases become *Clinically Corroborated* | ✅ **implemented** |
| Unresolved cases remain eligible for future matching | ✅ **state exists**, re-evaluation not implemented |
| Contributions improve future matching | ❌ **conceptual** |
| A knowledge base exists | ❌ **conceptual** |
| Attribution or reward exists | ❌ **conceptual, no code** |
| The network effect has been demonstrated clinically | ❌ **no** |

> The compounding network effect is **product architecture and intent**. It is not a demonstrated
> clinical outcome. No clinical effectiveness, diagnostic yield or patient benefit has been measured
> — and with 17 synthetic cases, none could be.
