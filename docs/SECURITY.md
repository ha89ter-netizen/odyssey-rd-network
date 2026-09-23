# Privacy and security

> **Read this first.** ODYSSEY P0 is a front-end prototype running on **synthetic data**. This
> document separates what exists today from what a production system would need. The second part is
> **planned architecture and does not exist in this repository.**

---

## Part 1 — Current prototype

### What exists

| | |
| --- | --- |
| **Data** | **Synthetic only.** 17 authored cases, 2 authored clinicians. No real patient, clinician, institution or genomic result is represented. |
| **Storage** | `localStorage` — one JSON blob under `odyssey.mvp.v1`, language under `odyssey.lang`. Per-browser, per-device. |
| **Backend** | None. The Next.js server renders pages and holds no state. |
| **Database** | None. |
| **Authentication** | None. |
| **Network traffic** | Static assets only. No clinical data is transmitted anywhere, because there is no server to transmit it to. |
| **Third-party services** | None at runtime. No analytics, no tracking, no telemetry, no external API. |
| **Audit** | Client-side. Twelve audited actions, visible at `/admin`. |

### What this means in practice

**Nothing you do in the demo leaves your browser.** There is no account, so there is nothing to
breach; no server, so there is nothing to intercept; no database, so there is nothing to exfiltrate.

That is a property of a prototype with no backend — not a security achievement. It is also why the
demo is safe to share publicly.

### What is deliberately absent from the data model

The case model has **no field for a patient name, date of birth, address, contact details or any
national/medical record identifier.** Age is an age *group*; onset is recorded in months from birth.
This is not an oversight to be filled in later — it is the shape a rare-disease matching record
should have, and keeping it that way from P0 means the production system inherits it.

### Known weaknesses of the current state

Stated plainly:

- **The audit log has none of an audit log's guarantees.** Client-side, mutable, erasable. It
  demonstrates the concept of traceability and provides none of its assurances.
- **The clinician switcher is not authorisation.** Anyone can be anyone.
- **There is no consent entity at all.**
- **There is no access control.** Every case in the demo dataset is readable by the running client,
  because it all lives in one browser.

### If you fork this

**Do not put real patient data into this prototype.** Not de-identified data, not "just one case",
not for a pilot. It has no authentication, no access control, no encryption at rest, no consent
model and no server-side audit. It is not built to hold anything real, and nothing about it should
be read as implying it is.

---

## Part 2 — Production architecture vision

**Everything below is PLANNED. None of it is implemented.** It is documented so the direction is
legible and so the P0 shortcuts above are understood as shortcuts rather than as design.

### The governing principle

> # Search globally, expose minimally.

Original clinical documents should remain within the responsible medical organisation wherever
possible. For matching, the architecture should expose only the **minimum necessary structured
representation** required for discovery — and nothing else until a human has approved it.

```
potential match  →  permission  →  clinician verification  →  permitted interaction
       │                │                    │                         │
  minimal signal   consent-scoped       a human decides         scoped disclosure,
   leaves the         release                                    fully audited
  organisation
```

Disclosure escalates in steps, and every step requires a reason. The system never jumps from
*"a similar record may exist"* to *"here is the record."*

### Planned controls

| Control | Purpose |
| --- | --- |
| **Pseudonymisation** | Clinical records are referenced by pseudonymous case identifiers; the re-identification mapping never leaves the originating organisation. |
| **De-identification** | Structured representations used for matching carry no direct identifiers and no free-text narrative that could re-identify. |
| **RBAC** | Roles per organisation — clinician, verifier, administrator, auditor — with permissions scoped to a case and to an organisation. |
| **Consent management** | A first-class entity: who consented, to what disclosure, for which purpose, under which jurisdiction, for how long, and how it is withdrawn. Every cross-organisation disclosure traceable to a consent record. |
| **Server-side audit logs** | Append-only, tamper-evident, independently reviewable. Every access, disclosure, match, verification and export recorded. |
| **Encryption** | In transit and at rest, with key management scoped per organisation. |
| **Minimum necessary disclosure** | Each stage releases only what that stage needs. A match signal is not a record. |
| **Secure storage** | Data residency honoured per organisation and jurisdiction. |
| **Secure clinician-to-clinician collaboration** | Authenticated identities, verified professional credentials, consent-scoped case access, server-side audit of everything said and shared. |
| **Jurisdiction-aware governance** | Policy evaluated per organisation pair. Some data may be compared but not moved; some may not be compared at all. The architecture must express that, not assume permission. |
| **Federated architecture** | Local evaluation, minimal signals in transit — see [FEDERATED_ARCHITECTURE.md](FEDERATED_ARCHITECTURE.md). |

### Why federation is a privacy decision, not a scaling decision

The obvious way to build a global matching network is to centralise every record and run queries
against the pile. It would work, and it would be the wrong thing to build.

A single global repository of the world's rare-disease records is a permanent, concentrated,
extremely high-value target, and every participating institution would have to accept that risk
forever in exchange for occasional benefit. Most cannot, and most should not.

Federated evaluation — each organisation scoring candidates locally and returning only a minimal
signal — means the network can grow without any organisation surrendering custody of its records.
That is what makes participation possible for institutions with strict governance, which are exactly
the institutions holding the most valuable rare-disease data.

> **Global discovery without unnecessary centralisation of raw clinical records.**

### Regulatory posture

Any production deployment would need, at minimum: a lawful basis for processing in each
jurisdiction, a data protection impact assessment, data processing agreements with each participating
organisation, ethics approval where required, clarity on medical-device classification in each
jurisdiction, and a defined breach-notification path.

**None of this has been done.** ODYSSEY is not a medical device, is not certified or approved by any
regulatory authority, and holds no regulatory clearance anywhere.

---

## Reporting a security issue

There is currently no production system, no user data and no attack surface beyond a static site.

If you find something that matters anyway — in the code, in the documentation, or in a claim made
here that does not hold — open an issue. Documentation that overstates the security posture of a
medical prototype is itself a security problem, and is treated as one.
