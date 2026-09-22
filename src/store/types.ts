/**
 * ODYSSEY MVP — domain models.
 *
 * Everything here is synthetic. The shapes are deliberately close to what a
 * real API would return, so `src/store/seed.ts` can later be swapped for
 * fetch calls without touching components.
 */

export type DoctorId = "doc-a" | "doc-b";

export type Doctor = {
  id: DoctorId;
  name: string;
  initials: string;
  role: string;
  department: string;
  institution: string;
  city: string;
  country: string;
  countryCode: string;
  networkId: string;
  accreditation: string;
};

export type PhenotypeStatus = "Present" | "Absent" | "Resolved";
export type PhenotypeSource = "Clinical note" | "AI extraction" | "Referral letter" | "Examination";
/** AI-proposed terms start unverified; a clinician must confirm before they are indexed. */
export type VerificationState = "unverified" | "verified" | "rejected";

export type Phenotype = {
  hpo: string;
  term: string;
  onset: string;
  severity: "Mild" | "Moderate" | "Severe";
  status: PhenotypeStatus;
  source: PhenotypeSource;
  verification: VerificationState;
  /** Only set for AI-extracted terms. */
  confidence?: number;
  evidence?: string;
  page?: string;
};

export type GeneticFinding = {
  gene: string;
  variant: string;
  zygosity: string;
  classification: string;
  inheritance: string;
  note: string;
  category: "sequencing" | "nuclear-variant" | "mitochondrial" | "enzymology";
};

export type TimelineEvent = {
  age: string;
  ageMonths: number;
  label: string;
  detail: string;
  kind: "onset" | "investigation" | "treatment" | "regression" | "stable" | "referral";
};

export type LabRow = {
  analyte: string;
  matrix: string;
  value: string;
  numeric: number | null;
  unit: string;
  ref: string;
  flag: "high" | "low" | "normal";
};

export type CaseStatus = "Unresolved" | "Under review" | "Match proposed" | "Clinically Corroborated";

/** Milestone onset in months — the input to clinical-trajectory scoring. */
export type Milestones = Record<string, number>;

export type CaseRecord = {
  id: string;
  ownerId: DoctorId;
  country: string;
  countryCode: string;
  institution: string;
  clinician: string;
  ageGroup: string;
  sex: string;
  phenotypeCluster: string;
  status: CaseStatus;
  headline: string;
  narrative: string;
  enrolled: string;
  createdAt: number;
  updatedAt: number;
  /** Months from birth to submission — used for temporal similarity. */
  odysseyMonths: number;
  phenotypes: Phenotype[];
  genetics: GeneticFinding[];
  geneticSummary: string;
  timeline: TimelineEvent[];
  milestones: Milestones;
  labs: LabRow[];
  imaging: { modality: string; age: string; finding: string; impression: string; features: string[] }[];
  family: { pedigree: string; consanguinity: boolean; consanguinityNote: string; siblings: string; notes: string; regionalAncestry: string };
  treatments: { intervention: string; duration: string; response: string; tone: "positive" | "neutral" | "negative" }[];
  negativeEvidence: string[];
  signals: string[];
  /** Cached so the dashboard does not recompute on every render. */
  completeness: { label: string; value: number }[];
};

export type MatchDimensionId =
  | "phenotype" | "trajectory" | "genetics" | "laboratory" | "imaging" | "temporal" | "family" | "negative";

/** A sentence the engine assembles as a key plus data, so it can render in any language. */
export type Phrase = {
  key: string;
  params?: Record<string, string | number>;
  /** Params whose values are clinical content needing translation before joining. */
  lists?: Record<string, string[]>;
  /** Same, but lower-cased so the terms sit inside a sentence. */
  listsLower?: Record<string, string[]>;
};

export type MatchDimension = {
  id: MatchDimensionId;
  /** Dictionary key, e.g. "dim.phenotype". */
  labelKey: string;
  /** 0–100 similarity of recorded evidence. Never a diagnostic probability. */
  score: number;
  weight: number;
  direction: "supporting" | "divergent";
  summary: Phrase;
  aValue: Phrase;
  bValue: Phrase;
};

export type MatchStatus =
  | "surfaced"        // engine returned it, clinician has not acted
  | "dismissed"       // clinician said not a match
  | "requested"       // connection requested, awaiting the other clinician
  | "declined"
  | "accepted"        // collaboration room open
  | "verified";       // both clinicians verified clinical relevance

export type Match = {
  id: string;
  sourceCaseId: string;
  targetCaseId: string;
  score: number;
  /** Dictionary key, e.g. "match.label.strong". */
  labelKey: string;
  dimensions: MatchDimension[];
  /** Structured, human-readable reasons — not generated prose. */
  explanation: Phrase[];
  divergences: Phrase[];
  sharedPhenotypes: string[];
  uniqueToSource: string[];
  uniqueToTarget: string[];
  status: MatchStatus;
  createdAt: number;
  requestedBy?: DoctorId;
  requestNote?: string;
};

export type Message = {
  id: string;
  author: DoctorId | "system";
  /** Clinician-written text stays as written; system messages use a key. */
  body: string;
  bodyKey?: string;
  bodyParams?: PhraseParams;
  at: number;
  kind?: "note" | "proposal" | "system";
  attachment?: { label: string; meta: string };
};

export type DecisionEntry = {
  id: string;
  actor?: string;
  actorKey?: string;
  actionKey: string;
  at: number | null;
  state: "done" | "pending" | "blocked";
};

export type RoomDocument = {
  labelKey: string;
  labelParams?: PhraseParams;
  metaKey: string;
  metaParams?: PhraseParams;
  kindKey: string;
};

export type Verification = {
  by: DoctorId;
  at: number;
  notes: string;
};

export type Collaboration = {
  id: string;
  matchId: string;
  caseAId: string;
  caseBId: string;
  doctorAId: DoctorId;
  doctorBId: DoctorId;
  openedAt: number;
  stageIndex: number;
  messages: Message[];
  documents: RoomDocument[];
  decisionLog: DecisionEntry[];
  verifications: Verification[];
};

export type Contribution = {
  id: string;
  title: string;
  caseIds: string[];
  contributors: string[];
  evidence: string;
  detail: string[];
  status: "Verified";
  createdAt: number;
};

export type NotificationKind =
  | "match" | "connection-request" | "connection-accepted" | "connection-declined"
  | "verification-requested" | "verification-complete" | "contribution";

export type PhraseParams = Record<string, string | number>;

export type AppNotification = {
  id: string;
  to: DoctorId;
  kind: NotificationKind;
  titleKey: string;
  titleParams?: PhraseParams;
  detailKey: string;
  detailParams?: PhraseParams;
  href: string;
  read: boolean;
  createdAt: number;
};

export type AuditAction =
  | "case.created" | "document.uploaded" | "extraction.completed" | "phenotype.verified"
  | "phenotype.rejected" | "match.generated" | "connection.requested" | "connection.accepted"
  | "connection.declined" | "verification.completed" | "contribution.recorded" | "session.started";

export type AuditEvent = {
  id: string;
  actorId: DoctorId | "system";
  action: AuditAction;
  subject: string;
  detailKey: string;
  detailParams?: PhraseParams;
  at: number;
};

export type UploadState = "idle" | "uploaded" | "analyzing" | "complete";

export type AppState = {
  version: number;
  currentDoctorId: DoctorId | null;
  doctors: Record<DoctorId, Doctor>;
  cases: Record<string, CaseRecord>;
  caseOrder: string[];
  matches: Record<string, Match>;
  collaborations: Record<string, Collaboration>;
  contributions: Contribution[];
  notifications: AppNotification[];
  audit: AuditEvent[];
  /** Cases the engine has been run against, so the UI can distinguish "not searched" from "no match". */
  searched: string[];
  clock: number;
};
