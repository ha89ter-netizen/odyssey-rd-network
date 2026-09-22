"use client";

/**
 * Application state.
 *
 * A reducer + context, persisted to localStorage. There is no backend: this
 * module is the entire data layer, and every mutation also writes an audit
 * event so the UI can show traceability.
 *
 * To connect a real API later, replace the action bodies in `reducer` with
 * calls and keep the same action names — components only dispatch intent.
 */
import * as React from "react";
import type {
  AppNotification, AppState, AuditAction, CaseRecord, Collaboration, Contribution,
  DoctorId, Match, MatchStatus, Phenotype,
} from "./types";
import { buildSeedState, DEMO_NOW, doctors, MIN, HOUR, DAY } from "./seed";
import { runMatching, SURFACE_THRESHOLD, STRONG_THRESHOLD } from "./matching";
import type { ExtractedTerm } from "./extraction";

const STORAGE_KEY = "odyssey.mvp.v1";
const STATE_VERSION = 1;

/* --------------------------------- actions --------------------------------- */

export type Action =
  | { type: "enter"; doctorId: DoctorId }
  | { type: "switchDoctor"; doctorId: DoctorId }
  | { type: "createCase"; draft: NewCaseDraft }
  | { type: "uploadDocument"; caseId: string; fileName: string }
  | { type: "completeExtraction"; caseId: string; fileName: string; terms: ExtractedTerm[] }
  | { type: "reviewPhenotype"; caseId: string; hpo: string; decision: "verified" | "rejected" }
  | { type: "editPhenotype"; caseId: string; hpo: string; patch: Partial<Phenotype> }
  | { type: "runMatching"; caseId: string }
  | { type: "dismissMatch"; matchId: string }
  | { type: "requestConnection"; matchId: string; note: string }
  | { type: "respondConnection"; matchId: string; accept: boolean }
  | { type: "sendMessage"; collaborationId: string; body: string }
  | { type: "verifyRelevance"; collaborationId: string; notes: string }
  | { type: "readNotification"; id: string }
  | { type: "readAllNotifications" }
  | { type: "reset" }
  | { type: "hydrate"; state: AppState };

export type NewCaseDraft = {
  id: string;
  ageGroup: string;
  sex: string;
  country: string;
  phenotypeCluster: string;
  headline: string;
  narrative: string;
  geneticSummary: string;
  familyNotes: string;
  consanguinity: boolean;
  labNote: string;
  imagingNote: string;
  treatmentNote: string;
};

/* --------------------------------- helpers --------------------------------- */

let seq = 0;
const uid = (prefix: string) => `${prefix}-${(seq += 1).toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;

function audit(state: AppState, actorId: DoctorId | "system", action: AuditAction, subject: string, detail: string): AppState {
  return {
    ...state,
    clock: state.clock + MIN,
    audit: [{ id: uid("aud"), actorId, action, subject, detail, at: state.clock + MIN }, ...state.audit],
  };
}

function notify(state: AppState, n: Omit<AppNotification, "id" | "read" | "createdAt">): AppState {
  return {
    ...state,
    notifications: [{ ...n, id: uid("ntf"), read: false, createdAt: state.clock }, ...state.notifications],
  };
}

function setMatchStatus(state: AppState, matchId: string, status: MatchStatus, patch: Partial<Match> = {}): AppState {
  const m = state.matches[matchId];
  if (!m) return state;
  return { ...state, matches: { ...state.matches, [matchId]: { ...m, ...patch, status } } };
}

function patchCase(state: AppState, caseId: string, patch: Partial<CaseRecord>): AppState {
  const c = state.cases[caseId];
  if (!c) return state;
  return { ...state, cases: { ...state.cases, [caseId]: { ...c, ...patch, updatedAt: state.clock } } };
}

/** Completeness recomputed from what the record actually contains. */
function recomputeCompleteness(c: CaseRecord): CaseRecord["completeness"] {
  const cap = (n: number) => Math.max(8, Math.min(100, n));
  const verified = c.phenotypes.filter((p) => p.verification === "verified").length;
  return [
    { label: "Phenotype", value: cap(verified * 12) },
    { label: "Genetics", value: cap(c.genetics.length * 20) },
    { label: "Timeline", value: cap(c.timeline.length * 9) },
    { label: "Laboratory", value: cap(c.labs.length * 12) },
    { label: "Imaging", value: cap(c.imaging.length * 28) },
    { label: "Family history", value: cap(c.family.notes.length > 2 ? 70 : 25) },
    { label: "Treatment response", value: cap(c.treatments.length * 22) },
    { label: "Negative evidence", value: cap(c.negativeEvidence.length * 16) },
  ];
}

export function completenessOverall(c: CaseRecord) {
  return Math.round(c.completeness.reduce((s, x) => s + x.value, 0) / c.completeness.length);
}

/* --------------------------------- reducer --------------------------------- */

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "reset":
      return buildSeedState();

    case "enter": {
      const s = { ...state, currentDoctorId: action.doctorId };
      return audit(s, action.doctorId, "session.started", "Demo session",
        `${doctors[action.doctorId].name} entered the demonstration environment`);
    }

    case "switchDoctor":
      return { ...state, currentDoctorId: action.doctorId };

    case "createCase": {
      const d = action.draft;
      const owner = state.currentDoctorId ?? "doc-a";
      const doc = doctors[owner];
      const now = state.clock;
      const newCase: CaseRecord = {
        id: d.id,
        ownerId: owner,
        country: d.country,
        countryCode: d.country === "Kazakhstan" ? "KZ" : d.country === "Germany" ? "DE" : "--",
        institution: doc.institution,
        clinician: doc.name,
        ageGroup: d.ageGroup,
        sex: d.sex,
        phenotypeCluster: d.phenotypeCluster,
        status: "Unresolved",
        headline: d.headline || "Unresolved case",
        narrative: d.narrative,
        enrolled: new Date(now).toISOString().slice(0, 10),
        createdAt: now,
        updatedAt: now,
        odysseyMonths: 48,
        phenotypes: [],
        genetics: d.geneticSummary
          ? [{ gene: "—", variant: "Reported investigations", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: d.geneticSummary, category: "sequencing" }]
          : [],
        geneticSummary: d.geneticSummary,
        timeline: [],
        milestones: { hypotonia: 0, developmentalDelay: 0, plateau: 0, seizureOnset: 0, regression: 0, imagingChange: 0 },
        labs: d.labNote ? [{ analyte: d.labNote, matrix: "Reported", value: "—", numeric: null, unit: "—", ref: "—", flag: "normal" }] : [],
        imaging: d.imagingNote ? [{ modality: "Reported imaging", age: "—", finding: d.imagingNote, impression: "—", features: [] }] : [],
        family: {
          pedigree: d.familyNotes || "Not documented",
          consanguinity: d.consanguinity,
          consanguinityNote: d.consanguinity ? "Consanguinity reported" : "None reported",
          siblings: "—",
          notes: d.familyNotes,
          regionalAncestry: "—",
        },
        treatments: d.treatmentNote ? [{ intervention: d.treatmentNote, duration: "—", response: "Recorded", tone: "neutral" }] : [],
        negativeEvidence: [],
        signals: [],
        completeness: [],
      };
      newCase.completeness = recomputeCompleteness(newCase);
      const s: AppState = {
        ...state,
        cases: { ...state.cases, [newCase.id]: newCase },
        caseOrder: [newCase.id, ...state.caseOrder],
      };
      return audit(s, owner, "case.created", newCase.id, `Case ${newCase.id} created — ${newCase.phenotypeCluster.toLowerCase()} cluster, ${newCase.ageGroup}`);
    }

    case "uploadDocument":
      return audit(state, state.currentDoctorId ?? "system", "document.uploaded", action.caseId,
        `${action.fileName} uploaded and queued for AI-assisted extraction`);

    case "completeExtraction": {
      const c = state.cases[action.caseId];
      if (!c) return state;
      const existing = new Set(c.phenotypes.map((p) => p.hpo));
      const added = action.terms.filter((t) => !existing.has(t.hpo));
      const merged = [...c.phenotypes, ...added];
      const updated: CaseRecord = { ...c, phenotypes: merged };
      const s = patchCase(state, action.caseId, { phenotypes: merged, completeness: recomputeCompleteness(updated) });
      return audit(s, "system", "extraction.completed", action.caseId,
        `AI-assisted extraction proposed ${added.length} phenotype terms from ${action.fileName} — awaiting clinician verification`);
    }

    case "reviewPhenotype": {
      const c = state.cases[action.caseId];
      if (!c) return state;
      const phenotypes = c.phenotypes.map((p) => (p.hpo === action.hpo ? { ...p, verification: action.decision } : p));
      const t = c.phenotypes.find((p) => p.hpo === action.hpo);
      const updated = { ...c, phenotypes };
      const s = patchCase(state, action.caseId, { phenotypes, completeness: recomputeCompleteness(updated) });
      return audit(s, state.currentDoctorId ?? "system",
        action.decision === "verified" ? "phenotype.verified" : "phenotype.rejected",
        action.caseId,
        `${t?.term ?? action.hpo} ${action.decision === "verified" ? "confirmed by clinician" : "rejected by clinician"}`);
    }

    case "editPhenotype": {
      const c = state.cases[action.caseId];
      if (!c) return state;
      const phenotypes = c.phenotypes.map((p) => (p.hpo === action.hpo ? { ...p, ...action.patch, verification: "verified" as const } : p));
      const updated = { ...c, phenotypes };
      const s = patchCase(state, action.caseId, { phenotypes, completeness: recomputeCompleteness(updated) });
      return audit(s, state.currentDoctorId ?? "system", "phenotype.verified", action.caseId,
        `${action.patch.term ?? action.hpo} edited and confirmed by clinician`);
    }

    case "runMatching": {
      const source = state.cases[action.caseId];
      if (!source) return state;
      const results = runMatching(source, Object.values(state.cases));
      const surfaced = results.filter((r) => r.score >= SURFACE_THRESHOLD);
      const matches = { ...state.matches };
      // Preserve any match already acted upon; refresh the rest.
      for (const r of surfaced) {
        const existing = Object.values(state.matches).find(
          (m) => m.sourceCaseId === r.sourceCaseId && m.targetCaseId === r.targetCaseId,
        );
        if (existing && existing.status !== "surfaced") continue;
        const id = existing?.id ?? uid("mat");
        matches[id] = { ...r, id, status: "surfaced", createdAt: state.clock };
      }
      let s: AppState = {
        ...state,
        matches,
        searched: state.searched.includes(action.caseId) ? state.searched : [...state.searched, action.caseId],
      };
      if (surfaced.length) {
        s = patchCase(s, action.caseId, { status: source.status === "Unresolved" ? "Match proposed" : source.status });
        const top = surfaced[0];
        const topId = Object.entries(matches).find(([, m]) => m.targetCaseId === top.targetCaseId && m.sourceCaseId === top.sourceCaseId)?.[0];
        s = notify(s, {
          to: source.ownerId,
          kind: "match",
          title: top.score >= STRONG_THRESHOLD ? "Strong potential match surfaced" : "Potential match surfaced",
          detail: `${source.id} ↔ ${top.targetCaseId} · ${top.dimensions.filter((d) => d.direction === "supporting").length} of ${top.dimensions.length} evidence groups concordant`,
          href: topId ? `/matches/${topId}` : "/matches",
        });
      }
      return audit(s, state.currentDoctorId ?? "system", "match.generated", action.caseId,
        `Federated query returned ${surfaced.length} candidate${surfaced.length === 1 ? "" : "s"} above the review threshold (${results.length} records evaluated)`);
    }

    case "dismissMatch":
      return audit(setMatchStatus(state, action.matchId, "dismissed"), state.currentDoctorId ?? "system",
        "match.generated", action.matchId, "Match dismissed by clinician as not relevant");

    case "requestConnection": {
      const m = state.matches[action.matchId];
      if (!m) return state;
      const source = state.cases[m.sourceCaseId];
      const target = state.cases[m.targetCaseId];
      const from = state.currentDoctorId ?? source.ownerId;
      let s = setMatchStatus(state, action.matchId, "requested", { requestedBy: from, requestNote: action.note });
      s = notify(s, {
        to: target.ownerId,
        kind: "connection-request",
        title: "New collaboration request",
        detail: `${doctors[from].name}, ${doctors[from].country} — regarding ${source.id} ↔ ${target.id}`,
        href: `/matches/${action.matchId}`,
      });
      return audit(s, from, "connection.requested", `${source.id} ↔ ${target.id}`,
        `Clinical connection requested by ${doctors[from].name}`);
    }

    case "respondConnection": {
      const m = state.matches[action.matchId];
      if (!m) return state;
      const source = state.cases[m.sourceCaseId];
      const target = state.cases[m.targetCaseId];
      const responder = state.currentDoctorId ?? target.ownerId;
      if (!action.accept) {
        let s = setMatchStatus(state, action.matchId, "declined");
        s = notify(s, {
          to: source.ownerId, kind: "connection-declined",
          title: "Collaboration request declined",
          detail: `${doctors[responder].name} declined the request regarding ${source.id}`,
          href: `/matches/${action.matchId}`,
        });
        return audit(s, responder, "connection.declined", `${source.id} ↔ ${target.id}`, "Connection request declined");
      }
      // Deterministic: callers can navigate straight to the room without waiting for state.
      const collabId = `col-${action.matchId}`;
      const collab: Collaboration = {
        id: collabId,
        matchId: action.matchId,
        caseAId: source.id,
        caseBId: target.id,
        doctorAId: source.ownerId,
        doctorBId: target.ownerId,
        openedAt: state.clock,
        stageIndex: 1,
        messages: [
          {
            id: uid("msg"), author: "system", kind: "system", at: state.clock,
            body: `Secure room opened following mutual acceptance of the potential match between ${source.id} and ${target.id}. No identifiable patient data is exchanged in this room.`,
          },
        ],
        documents: [
          { label: `Evidence comparison — ${source.id} / ${target.id}`, meta: `Generated on request · ${m.dimensions.length} evidence groups`, kind: "Comparison" },
          { label: `${source.id}-structured-signals.json`, meta: `Shared by ${doctors[source.ownerId].name} · HPO coded`, kind: "Structured data" },
          { label: `${target.id}-structured-signals.json`, meta: `Shared by ${doctors[target.ownerId].name} · HPO coded`, kind: "Structured data" },
        ],
        decisionLog: [
          { id: uid("dec"), actor: "Both clinicians", action: "Accepted potential match for review", at: state.clock, state: "done" },
          { id: uid("dec"), actor: doctors[source.ownerId].name, action: "Verify clinical relevance", at: null, state: "pending" },
          { id: uid("dec"), actor: doctors[target.ownerId].name, action: "Verify clinical relevance", at: null, state: "pending" },
          { id: uid("dec"), actor: "Network", action: "Record knowledge contribution", at: null, state: "blocked" },
        ],
        verifications: [],
      };
      let s = setMatchStatus(state, action.matchId, "accepted");
      s = { ...s, collaborations: { ...s.collaborations, [collabId]: collab } };
      s = notify(s, {
        to: source.ownerId, kind: "connection-accepted",
        title: "Collaboration request accepted",
        detail: `${doctors[responder].name} accepted — secure room open for ${source.id} ↔ ${target.id}`,
        href: `/collaboration/${collabId}`,
      });
      return audit(s, responder, "connection.accepted", `${source.id} ↔ ${target.id}`,
        `Connection accepted by ${doctors[responder].name}; secure collaboration room opened`);
    }

    case "sendMessage": {
      const col = state.collaborations[action.collaborationId];
      if (!col || !action.body.trim()) return state;
      const author = state.currentDoctorId ?? col.doctorAId;
      const messages = [...col.messages, { id: uid("msg"), author, body: action.body.trim(), at: state.clock, kind: "note" as const }];
      const s: AppState = {
        ...state,
        collaborations: { ...state.collaborations, [col.id]: { ...col, messages, stageIndex: Math.max(col.stageIndex, 1) } },
      };
      return { ...s, clock: s.clock + MIN };
    }

    case "verifyRelevance": {
      const col = state.collaborations[action.collaborationId];
      if (!col) return state;
      const by = state.currentDoctorId ?? col.doctorAId;
      if (col.verifications.some((v) => v.by === by)) return state;
      const verifications = [...col.verifications, { by, at: state.clock, notes: action.notes }];
      const both = verifications.length >= 2;
      const decisionLog = col.decisionLog.map((d) =>
        d.action === "Verify clinical relevance" && d.actor === doctors[by].name && d.state === "pending"
          ? { ...d, at: state.clock, state: "done" as const }
          : both && d.action === "Record knowledge contribution"
            ? { ...d, at: state.clock, state: "done" as const }
            : d,
      );
      let collaborations = {
        ...state.collaborations,
        [col.id]: { ...col, verifications, decisionLog, stageIndex: both ? 4 : 3 },
      };
      let s: AppState = { ...state, collaborations };
      const source = state.cases[col.caseAId];
      const target = state.cases[col.caseBId];
      const other = by === col.doctorAId ? col.doctorBId : col.doctorAId;

      s = audit(s, by, "verification.completed", `${source.id} ↔ ${target.id}`,
        `Clinical relevance verified by ${doctors[by].name}`);

      if (!both) {
        s = notify(s, {
          to: other, kind: "verification-requested",
          title: "Second verification required",
          detail: `${doctors[by].name} verified clinical relevance of ${source.id} ↔ ${target.id}. Your assessment is required.`,
          href: `/collaboration/${col.id}`,
        });
        return s;
      }

      // Both clinicians agreed — record the contribution and corroborate both cases.
      const match = state.matches[col.matchId];
      const contribution: Contribution = {
        id: uid("con"),
        title: "Verified cross-border case connection",
        caseIds: [source.id, target.id],
        contributors: [doctors[col.doctorAId].name, doctors[col.doctorBId].name],
        evidence: `${match?.sharedPhenotypes.length ?? 0} overlapping phenotype signals`,
        detail: [
          `${match?.sharedPhenotypes.length ?? 0} phenotype features shared between ${source.id} and ${target.id}`,
          `${match?.dimensions.filter((d) => d.direction === "supporting").length ?? 0} of ${match?.dimensions.length ?? 0} evidence groups concordant`,
          ...verifications.map((v) => `${doctors[v.by].name}: ${v.notes}`),
        ],
        status: "Verified",
        createdAt: s.clock,
      };
      s = { ...s, contributions: [contribution, ...s.contributions] };
      s = setMatchStatus(s, col.matchId, "verified");
      s = patchCase(s, source.id, { status: "Clinically Corroborated" });
      s = patchCase(s, target.id, { status: "Clinically Corroborated" });
      for (const to of [col.doctorAId, col.doctorBId]) {
        s = notify(s, {
          to, kind: "contribution",
          title: "Knowledge contribution recorded",
          detail: `${source.id} ↔ ${target.id} is now a clinically corroborated connection in the network record`,
          href: `/knowledge`,
        });
      }
      return audit(s, "system", "contribution.recorded", `${source.id} ↔ ${target.id}`,
        "Knowledge contribution recorded — connection clinically corroborated by two independent clinicians");
    }

    case "readNotification":
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) };

    case "readAllNotifications":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };

    default:
      return state;
  }
}

/* --------------------------------- context --------------------------------- */

type Ctx = { state: AppState; dispatch: React.Dispatch<Action>; ready: boolean };
const StoreContext = React.createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, buildSeedState);
  const [ready, setReady] = React.useState(false);

  // Hydrate from localStorage after mount so server and client markup agree.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed?.version === STATE_VERSION) dispatch({ type: "hydrate", state: parsed });
      }
    } catch {
      /* private mode, blocked storage, corrupt value — fall back to the seed */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — the demo still works, it just will not persist */
    }
  }, [state, ready]);

  const value = React.useMemo(() => ({ state, dispatch, ready }), [state, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/* -------------------------------- selectors -------------------------------- */

export function useDoctor() {
  const { state } = useStore();
  return state.currentDoctorId ? state.doctors[state.currentDoctorId] : null;
}

export const selectCasesOf = (s: AppState, id: DoctorId) => s.caseOrder.map((c) => s.cases[c]).filter((c) => c && c.ownerId === id);
export const selectUnresolved = (s: AppState, id: DoctorId) => selectCasesOf(s, id).filter((c) => c.status === "Unresolved" || c.status === "Under review");
export const selectMatchesOf = (s: AppState, id: DoctorId) =>
  Object.values(s.matches)
    .filter((m) => m.status !== "dismissed")
    .filter((m) => s.cases[m.sourceCaseId]?.ownerId === id || s.cases[m.targetCaseId]?.ownerId === id)
    .sort((a, b) => b.score - a.score);
export const selectOpenMatches = (s: AppState, id: DoctorId) => selectMatchesOf(s, id).filter((m) => m.status === "surfaced");
export const selectVerificationTasks = (s: AppState, id: DoctorId) => {
  const tasks: { kind: "request" | "verify"; matchId?: string; collaborationId?: string; label: string; href: string }[] = [];
  for (const m of Object.values(s.matches)) {
    if (m.status === "requested" && s.cases[m.targetCaseId]?.ownerId === id) {
      tasks.push({ kind: "request", matchId: m.id, label: `Collaboration request — ${m.sourceCaseId} ↔ ${m.targetCaseId}`, href: `/matches/${m.id}` });
    }
  }
  for (const c of Object.values(s.collaborations)) {
    const mine = c.doctorAId === id || c.doctorBId === id;
    if (mine && !c.verifications.some((v) => v.by === id)) {
      tasks.push({ kind: "verify", collaborationId: c.id, label: `Verify clinical relevance — ${c.caseAId} ↔ ${c.caseBId}`, href: `/collaboration/${c.id}` });
    }
  }
  return tasks;
};
export const selectCollaborationsOf = (s: AppState, id: DoctorId) =>
  Object.values(s.collaborations).filter((c) => c.doctorAId === id || c.doctorBId === id).sort((a, b) => b.openedAt - a.openedAt);
export const selectNotificationsOf = (s: AppState, id: DoctorId) =>
  s.notifications.filter((n) => n.to === id).sort((a, b) => b.createdAt - a.createdAt);
export const selectUnread = (s: AppState, id: DoctorId) => selectNotificationsOf(s, id).filter((n) => !n.read).length;

export { DEMO_NOW, MIN, HOUR, DAY, SURFACE_THRESHOLD, STRONG_THRESHOLD };
