/**
 * ODYSSEY — Global Rare Disease Match Network
 * Shared synthetic dataset. Every design concept renders THIS data.
 *
 * DEMONSTRATION DATA — NOT FOR CLINICAL USE.
 * No real patients, institutions, clinicians or genomic results are represented.
 */

export const DISCLAIMER = "DEMONSTRATION DATA — NOT FOR CLINICAL USE";

export const PRODUCT = {
  name: "ODYSSEY",
  tagline: "Global Rare Disease Match Network",
  principle: "Do not simply store knowledge. Connect knowledge.",
  promise: "The answer may already exist.",
} as const;

/* ------------------------------------------------------------------ */
/* Clinician                                                           */
/* ------------------------------------------------------------------ */

export const doctor = {
  name: "Dr. A. Seitkali",
  shortName: "Seitkali",
  initials: "AS",
  role: "Clinical Geneticist",
  department: "Division of Pediatric Neurogenetics",
  institution: "National Research Center for Maternal & Child Health",
  city: "Astana",
  country: "Kazakhstan",
  countryCode: "KZ",
  networkId: "ODY-CLIN-4471",
  accreditation: "Verified network clinician · Tier II data access",
  localTime: "07:42",
  greeting: "Good morning",
} as const;

export const counterpart = {
  name: "Dr. M. Brandt",
  shortName: "Brandt",
  initials: "MB",
  role: "Consultant in Neurometabolic Disease",
  department: "Institute for Rare Neurological Disorders",
  institution: "Universitätsklinikum Heidelberg",
  city: "Heidelberg",
  country: "Germany",
  countryCode: "DE",
  networkId: "ODY-CLIN-1180",
  accreditation: "Verified network clinician · Tier II data access",
  localTime: "03:42",
} as const;

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export type AttentionItem = {
  id: string;
  label: string;
  count: number;
  detail: string;
  tone: "neutral" | "signal" | "alert" | "positive";
  href?: string;
};

export const attention: AttentionItem[] = [
  {
    id: "unresolved",
    label: "Unresolved cases",
    count: 12,
    detail: "No confirmed molecular or clinical diagnosis",
    tone: "neutral",
  },
  {
    id: "matches",
    label: "Potential matches",
    count: 4,
    detail: "Awaiting your clinical review",
    tone: "signal",
  },
  {
    id: "verification",
    label: "Verification requests",
    count: 2,
    detail: "Colleagues requesting your assessment",
    tone: "alert",
  },
  {
    id: "collaboration",
    label: "Cross-border collaboration",
    count: 1,
    detail: "Active secure room · KZ ↔ DE",
    tone: "positive",
  },
];

export type QueueRow = {
  id: string;
  caseId: string;
  summary: string;
  country: string;
  countryCode: string;
  ageGroup: string;
  status: "Unresolved" | "Under review" | "Match proposed" | "Verified";
  completeness: number;
  signals: number;
  updated: string;
  priority: "Routine" | "Elevated" | "Urgent";
};

export const caseQueue: QueueRow[] = [
  {
    id: "q1",
    caseId: "ODY-001",
    summary: "Progressive hypotonia, refractory seizures, developmental regression",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Child · 4y",
    status: "Match proposed",
    completeness: 82,
    signals: 7,
    updated: "14 min ago",
    priority: "Elevated",
  },
  {
    id: "q2",
    caseId: "ODY-014",
    summary: "Episodic ataxia with lactate elevation, normal exome",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Child · 7y",
    status: "Under review",
    completeness: 64,
    signals: 5,
    updated: "2 h ago",
    priority: "Routine",
  },
  {
    id: "q3",
    caseId: "ODY-027",
    summary: "Neonatal cholestasis, dysmorphism, consanguineous pedigree",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Infant · 5m",
    status: "Unresolved",
    completeness: 47,
    signals: 3,
    updated: "Yesterday",
    priority: "Urgent",
  },
  {
    id: "q4",
    caseId: "ODY-039",
    summary: "Adolescent-onset dystonia, basal ganglia signal change",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Adolescent · 13y",
    status: "Unresolved",
    completeness: 71,
    signals: 4,
    updated: "2 d ago",
    priority: "Routine",
  },
  {
    id: "q5",
    caseId: "ODY-052",
    summary: "Recurrent rhabdomyolysis, exercise intolerance, sibling affected",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Child · 9y",
    status: "Under review",
    completeness: 58,
    signals: 4,
    updated: "3 d ago",
    priority: "Routine",
  },
  {
    id: "q6",
    caseId: "ODY-068",
    summary: "Immune dysregulation with sterile osteomyelitis",
    country: "Kazakhstan",
    countryCode: "KZ",
    ageGroup: "Child · 6y",
    status: "Verified",
    completeness: 94,
    signals: 8,
    updated: "5 d ago",
    priority: "Routine",
  },
];

export type ActivityEvent = {
  id: string;
  kind: "match" | "verification" | "contribution" | "join" | "search";
  title: string;
  detail: string;
  origin: string;
  time: string;
};

export const networkActivity: ActivityEvent[] = [
  {
    id: "a1",
    kind: "match",
    title: "Potential match surfaced",
    detail: "ODY-001 ↔ ODY-742 · 7 concordant signal groups",
    origin: "KZ → DE",
    time: "14 min",
  },
  {
    id: "a2",
    kind: "verification",
    title: "Verification requested",
    detail: "ODY-208 phenotype set awaiting second clinician",
    origin: "Norway",
    time: "1 h",
  },
  {
    id: "a3",
    kind: "contribution",
    title: "Knowledge contribution accepted",
    detail: "Negative evidence panel added to cohort C-114",
    origin: "Japan",
    time: "3 h",
  },
  {
    id: "a4",
    kind: "join",
    title: "Institution joined the network",
    detail: "Paediatric genomics unit · Tier II access",
    origin: "Brazil",
    time: "6 h",
  },
  {
    id: "a5",
    kind: "search",
    title: "Federated query completed",
    detail: "1,284 cohorts queried · no identifiable data transferred",
    origin: "Network",
    time: "8 h",
  },
  {
    id: "a6",
    kind: "match",
    title: "Connection confirmed by clinicians",
    detail: "ODY-311 ↔ ODY-509 · novel phenotype expansion",
    origin: "CA ↔ IT",
    time: "11 h",
  },
];

export const networkStats = [
  { id: "institutions", label: "Member institutions", value: "412", delta: "+6 this quarter" },
  { id: "countries", label: "Countries", value: "58", delta: "+2 this quarter" },
  { id: "cases", label: "Federated case records", value: "128,406", delta: "no raw data leaves site" },
  { id: "matches", label: "Clinician-confirmed connections", value: "2,187", delta: "+143 this quarter" },
];

export const contributionMetrics = [
  { id: "c1", label: "Potential matches surfaced", value: 46, of: 60, note: "last 90 days" },
  { id: "c2", label: "Reviewed by clinicians", value: 38, of: 46, note: "83% review rate" },
  { id: "c3", label: "Confirmed connections", value: 11, of: 38, note: "human verified" },
  { id: "c4", label: "Knowledge contributions", value: 9, of: 11, note: "published to network" },
];

/** 12-month sparkline: federated queries run from this institution. */
export const querySeries = [18, 22, 19, 27, 31, 26, 34, 38, 35, 44, 41, 52];

/* ------------------------------------------------------------------ */
/* Case model                                                          */
/* ------------------------------------------------------------------ */

export type Phenotype = {
  hpo: string;
  term: string;
  onset: string;
  severity: "Mild" | "Moderate" | "Severe";
  status: "Present" | "Absent" | "Resolved";
  verified: boolean;
  source: "Clinical note" | "AI extraction" | "Referral letter" | "Examination";
};

export type TimelineEvent = {
  age: string;
  label: string;
  detail: string;
  kind: "onset" | "investigation" | "treatment" | "regression" | "stable" | "referral";
};

export type LabRow = {
  analyte: string;
  value: string;
  unit: string;
  ref: string;
  flag: "high" | "low" | "normal";
  matrix: string;
};

export type GeneticFinding = {
  gene: string;
  variant: string;
  zygosity: string;
  classification: string;
  inheritance: string;
  note: string;
};

export type CaseRecord = {
  id: string;
  country: string;
  countryCode: string;
  region: string;
  institution: string;
  clinician: string;
  ageGroup: string;
  sex: string;
  status: string;
  enrolled: string;
  lastUpdated: string;
  headline: string;
  narrative: string;
  completeness: number;
  completenessBreakdown: { label: string; value: number }[];
  phenotypes: Phenotype[];
  genetics: GeneticFinding[];
  geneticSummary: string;
  timeline: TimelineEvent[];
  labs: LabRow[];
  imaging: { modality: string; age: string; finding: string; impression: string }[];
  family: { pedigree: string; consanguinity: string; siblings: string; notes: string };
  treatments: { intervention: string; duration: string; response: string; tone: "positive" | "neutral" | "negative" }[];
  negativeEvidence: string[];
  signals: string[];
};

export const caseKZ: CaseRecord = {
  id: "ODY-001",
  country: "Kazakhstan",
  countryCode: "KZ",
  region: "Central Asia",
  institution: "National Research Center for Maternal & Child Health",
  clinician: doctor.name,
  ageGroup: "Child",
  sex: "Female",
  status: "Unresolved",
  enrolled: "2026-02-14",
  lastUpdated: "14 minutes ago",
  headline: "Progressive infantile encephalopathy of unknown molecular cause",
  narrative:
    "Term infant, uneventful perinatal course. Truncal hypotonia noted at 5 months. Acquisition of early milestones followed by plateau at 11 months and regression after a febrile illness at 16 months. Seizure onset at 14 months, progressing to pharmacoresistant epilepsy. Trio exome and subsequent genome sequencing non-diagnostic.",
  completeness: 82,
  completenessBreakdown: [
    { label: "Phenotype", value: 95 },
    { label: "Genetics", value: 90 },
    { label: "Timeline", value: 88 },
    { label: "Laboratory", value: 84 },
    { label: "Imaging", value: 76 },
    { label: "Family history", value: 70 },
    { label: "Treatment response", value: 80 },
    { label: "Negative evidence", value: 62 },
  ],
  phenotypes: [
    { hpo: "HP:0001263", term: "Global developmental delay", onset: "8 months", severity: "Severe", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0001252", term: "Hypotonia", onset: "5 months", severity: "Moderate", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0001250", term: "Seizure", onset: "14 months", severity: "Severe", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0001249", term: "Intellectual disability", onset: "24 months", severity: "Severe", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0002376", term: "Developmental regression", onset: "16 months", severity: "Severe", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0002151", term: "Increased serum lactate", onset: "18 months", severity: "Moderate", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0000639", term: "Nystagmus", onset: "12 months", severity: "Mild", status: "Present", verified: false, source: "AI extraction" },
    { hpo: "HP:0011968", term: "Feeding difficulties", onset: "6 months", severity: "Moderate", status: "Resolved", verified: true, source: "Referral letter" },
    { hpo: "HP:0001156", term: "Brachydactyly", onset: "—", severity: "Mild", status: "Absent", verified: true, source: "Examination" },
  ],
  genetics: [
    { gene: "—", variant: "Trio exome sequencing", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Coverage 98.4% at 20×. No P/LP variant in disease-associated genes." },
    { gene: "—", variant: "Genome sequencing (short read)", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Structural variant and mitochondrial analysis included." },
    { gene: "NDUFAF6", variant: "c.532G>C p.(Ala178Pro)", zygosity: "Heterozygous", classification: "VUS", inheritance: "Maternal", note: "Second allele not identified. Re-analysis pending." },
    { gene: "MT-ND5", variant: "m.13513G>A", zygosity: "Heteroplasmy 4%", classification: "Below threshold", inheritance: "Maternal", note: "Blood only. Muscle not yet tested." },
  ],
  geneticSummary: "Unresolved. One monoallelic VUS in a complex I assembly factor; second allele not identified. Mitochondrial re-analysis and long-read sequencing proposed.",
  timeline: [
    { age: "Birth", label: "Term delivery", detail: "39+2 weeks, birth weight 3.29 kg, Apgar 9/10", kind: "stable" },
    { age: "5 months", label: "Truncal hypotonia", detail: "First documented neurological abnormality", kind: "onset" },
    { age: "8 months", label: "Developmental delay", detail: "Fails to sit unsupported; referred to paediatric neurology", kind: "referral" },
    { age: "11 months", label: "Developmental plateau", detail: "No new milestones acquired", kind: "stable" },
    { age: "14 months", label: "Seizure onset", detail: "Focal to bilateral tonic–clonic; EEG multifocal epileptiform", kind: "onset" },
    { age: "16 months", label: "Regression after febrile illness", detail: "Loss of head control and babbling; lactate 4.1 mmol/L", kind: "regression" },
    { age: "18 months", label: "Metabolic work-up", detail: "CSF lactate elevated; muscle biopsy deferred", kind: "investigation" },
    { age: "22 months", label: "Trio exome non-diagnostic", detail: "Reported as no primary finding", kind: "investigation" },
    { age: "2y 8m", label: "Ketogenic diet initiated", detail: "Partial seizure reduction (~40%)", kind: "treatment" },
    { age: "3y 6m", label: "Genome sequencing non-diagnostic", detail: "Re-analysis scheduled at 12 months", kind: "investigation" },
    { age: "4y 1m", label: "Submitted to ODYSSEY network", detail: "Federated query across 58 countries", kind: "referral" },
  ],
  labs: [
    { analyte: "Lactate", value: "4.1", unit: "mmol/L", ref: "0.5–2.2", flag: "high", matrix: "Plasma" },
    { analyte: "Lactate", value: "3.4", unit: "mmol/L", ref: "1.1–2.4", flag: "high", matrix: "CSF" },
    { analyte: "Pyruvate", value: "0.19", unit: "mmol/L", ref: "0.03–0.10", flag: "high", matrix: "Plasma" },
    { analyte: "Lactate/pyruvate ratio", value: "21.6", unit: "ratio", ref: "< 20", flag: "high", matrix: "Plasma" },
    { analyte: "Alanine", value: "648", unit: "µmol/L", ref: "150–450", flag: "high", matrix: "Plasma" },
    { analyte: "Ammonia", value: "38", unit: "µmol/L", ref: "< 50", flag: "normal", matrix: "Plasma" },
    { analyte: "Creatine kinase", value: "142", unit: "U/L", ref: "< 190", flag: "normal", matrix: "Serum" },
    { analyte: "Acylcarnitine profile", value: "Non-specific", unit: "—", ref: "—", flag: "normal", matrix: "DBS" },
  ],
  imaging: [
    { modality: "MRI brain", age: "17 months", finding: "Symmetric T2 hyperintensity of the putamen and dorsal brainstem", impression: "Pattern consistent with a mitochondrial leukoencephalopathy" },
    { modality: "MR spectroscopy", age: "17 months", finding: "Lactate doublet at 1.33 ppm", impression: "Supports impaired oxidative metabolism" },
    { modality: "MRI brain (repeat)", age: "3y 4m", finding: "Progression of putaminal signal, mild cerebellar atrophy", impression: "Progressive course" },
  ],
  family: {
    pedigree: "Two affected among four siblings; parents unaffected",
    consanguinity: "First-cousin parents (F ≈ 0.0625)",
    siblings: "Younger brother, 2y — early hypotonia under evaluation",
    notes: "No extended family history of neurological disease reported. Maternal lineage from a regionally isolated population.",
  },
  treatments: [
    { intervention: "Levetiracetam", duration: "14 months", response: "Partial, then loss of effect", tone: "neutral" },
    { intervention: "Ketogenic diet", duration: "17 months", response: "≈40% seizure reduction, sustained", tone: "positive" },
    { intervention: "Coenzyme Q10 + riboflavin", duration: "11 months", response: "No measurable change", tone: "neutral" },
    { intervention: "Valproate", duration: "3 weeks", response: "Discontinued — hepatic transaminase rise", tone: "negative" },
  ],
  negativeEvidence: [
    "No cardiac involvement on echocardiography at 3y 6m",
    "No hepatic involvement (normal synthetic function)",
    "Hearing thresholds normal on ABR",
    "No retinal dystrophy on ERG",
    "Newborn screening panel negative",
    "Congenital disorders of glycosylation panel normal",
  ],
  signals: [
    "Regression precipitated by febrile illness",
    "Elevated lactate/pyruvate ratio with alanine elevation",
    "Bilateral putaminal T2 signal change",
    "Monoallelic VUS in complex I assembly factor",
    "Consanguineous pedigree, second sibling affected",
    "Partial but sustained response to ketogenic diet",
    "Absence of cardiac and hepatic involvement",
  ],
};

export const caseDE: CaseRecord = {
  id: "ODY-742",
  country: "Germany",
  countryCode: "DE",
  region: "Western Europe",
  institution: "Universitätsklinikum Heidelberg",
  clinician: counterpart.name,
  ageGroup: "Child",
  sex: "Male",
  status: "Unresolved · under re-analysis",
  enrolled: "2025-09-03",
  lastUpdated: "2 days ago",
  headline: "Progressive encephalopathy with putaminal involvement, molecularly unsolved",
  narrative:
    "Second child of non-consanguineous parents. Hypotonia from 6 months, plateau at 12 months, marked regression following gastroenteritis at 15 months. Pharmacoresistant epilepsy from 13 months. Exome and genome non-diagnostic; long-read sequencing performed 2026-01 and under re-analysis.",
  completeness: 88,
  completenessBreakdown: [
    { label: "Phenotype", value: 96 },
    { label: "Genetics", value: 94 },
    { label: "Timeline", value: 90 },
    { label: "Laboratory", value: 92 },
    { label: "Imaging", value: 88 },
    { label: "Family history", value: 74 },
    { label: "Treatment response", value: 86 },
    { label: "Negative evidence", value: 78 },
  ],
  phenotypes: [
    { hpo: "HP:0001263", term: "Global developmental delay", onset: "9 months", severity: "Severe", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0001252", term: "Hypotonia", onset: "6 months", severity: "Moderate", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0001250", term: "Seizure", onset: "13 months", severity: "Severe", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0001249", term: "Intellectual disability", onset: "26 months", severity: "Severe", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0002376", term: "Developmental regression", onset: "15 months", severity: "Severe", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0002151", term: "Increased serum lactate", onset: "15 months", severity: "Moderate", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0000639", term: "Nystagmus", onset: "14 months", severity: "Mild", status: "Present", verified: true, source: "Examination" },
    { hpo: "HP:0002015", term: "Dysphagia", onset: "20 months", severity: "Moderate", status: "Present", verified: true, source: "Clinical note" },
    { hpo: "HP:0001647", term: "Cardiac involvement", onset: "—", severity: "Mild", status: "Absent", verified: true, source: "Examination" },
  ],
  genetics: [
    { gene: "—", variant: "Trio exome sequencing", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Reported 2025-04." },
    { gene: "—", variant: "Genome sequencing (short read)", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Reported 2025-08." },
    { gene: "NDUFAF6", variant: "c.532G>C p.(Ala178Pro)", zygosity: "Heterozygous", classification: "VUS", inheritance: "Paternal", note: "Same nucleotide substitution as ODY-001." },
    { gene: "NDUFAF6", variant: "c.420+784C>T (deep intronic)", zygosity: "Heterozygous", classification: "VUS — candidate", inheritance: "Maternal", note: "Long-read sequencing 2026-01. Predicted cryptic exon inclusion; RNA studies pending." },
  ],
  geneticSummary: "Biallelic VUS in NDUFAF6 — one coding, one deep intronic candidate identified only after long-read sequencing. RNA studies pending. Not yet reportable as diagnostic.",
  timeline: [
    { age: "Birth", label: "Term delivery", detail: "38+5 weeks, birth weight 3.05 kg, unremarkable", kind: "stable" },
    { age: "6 months", label: "Hypotonia", detail: "Central hypotonia on physiotherapy assessment", kind: "onset" },
    { age: "9 months", label: "Developmental delay", detail: "Referred to neuropaediatrics", kind: "referral" },
    { age: "12 months", label: "Developmental plateau", detail: "Milestone acquisition ceases", kind: "stable" },
    { age: "13 months", label: "Seizure onset", detail: "Focal seizures, multifocal EEG", kind: "onset" },
    { age: "15 months", label: "Regression after gastroenteritis", detail: "Loss of sitting; lactate 3.8 mmol/L", kind: "regression" },
    { age: "16 months", label: "MRI: putaminal signal change", detail: "Bilateral symmetric T2 hyperintensity", kind: "investigation" },
    { age: "19 months", label: "Exome non-diagnostic", detail: "Re-analysis at 12 months requested", kind: "investigation" },
    { age: "2y 4m", label: "Ketogenic diet initiated", detail: "≈35% seizure reduction", kind: "treatment" },
    { age: "3y 1m", label: "Long-read sequencing", detail: "Deep intronic candidate identified", kind: "investigation" },
    { age: "3y 9m", label: "Listed for federated matching", detail: "Consent for cross-border comparison on file", kind: "referral" },
  ],
  labs: [
    { analyte: "Lactate", value: "3.8", unit: "mmol/L", ref: "0.5–2.2", flag: "high", matrix: "Plasma" },
    { analyte: "Lactate", value: "3.1", unit: "mmol/L", ref: "1.1–2.4", flag: "high", matrix: "CSF" },
    { analyte: "Pyruvate", value: "0.17", unit: "mmol/L", ref: "0.03–0.10", flag: "high", matrix: "Plasma" },
    { analyte: "Lactate/pyruvate ratio", value: "22.4", unit: "ratio", ref: "< 20", flag: "high", matrix: "Plasma" },
    { analyte: "Alanine", value: "592", unit: "µmol/L", ref: "150–450", flag: "high", matrix: "Plasma" },
    { analyte: "Ammonia", value: "41", unit: "µmol/L", ref: "< 50", flag: "normal", matrix: "Plasma" },
    { analyte: "Complex I activity", value: "31", unit: "% of control", ref: "> 60", flag: "low", matrix: "Muscle" },
    { analyte: "Creatine kinase", value: "168", unit: "U/L", ref: "< 190", flag: "normal", matrix: "Serum" },
  ],
  imaging: [
    { modality: "MRI brain", age: "16 months", finding: "Bilateral symmetric putaminal T2 hyperintensity, brainstem involvement", impression: "Leigh-like radiological pattern" },
    { modality: "MR spectroscopy", age: "16 months", finding: "Lactate peak present", impression: "Impaired oxidative metabolism" },
    { modality: "MRI brain (repeat)", age: "3y 2m", finding: "Stable putaminal change, mild vermian atrophy", impression: "Slowly progressive" },
  ],
  family: {
    pedigree: "Single affected child of two; sister unaffected at 7y",
    consanguinity: "None reported",
    siblings: "Sister, 7y — neurologically normal",
    notes: "Paternal grandparents from the same regional community. No known family history of metabolic disease.",
  },
  treatments: [
    { intervention: "Levetiracetam", duration: "10 months", response: "Partial, then loss of effect", tone: "neutral" },
    { intervention: "Ketogenic diet", duration: "19 months", response: "≈35% seizure reduction, sustained", tone: "positive" },
    { intervention: "Thiamine + riboflavin", duration: "14 months", response: "No measurable change", tone: "neutral" },
    { intervention: "Valproate", duration: "5 weeks", response: "Discontinued — transaminase rise", tone: "negative" },
  ],
  negativeEvidence: [
    "No cardiac involvement on serial echocardiography",
    "No hepatic involvement",
    "Normal ABR",
    "No retinal dystrophy on ERG",
    "Expanded newborn screening negative",
    "Congenital disorders of glycosylation panel normal",
  ],
  signals: [
    "Regression precipitated by intercurrent illness",
    "Elevated lactate/pyruvate ratio with alanine elevation",
    "Bilateral putaminal T2 signal change",
    "Biallelic NDUFAF6 VUS including deep intronic candidate",
    "Isolated complex I deficiency in muscle (31% of control)",
    "Partial but sustained response to ketogenic diet",
    "Absence of cardiac and hepatic involvement",
  ],
};

export const cases: Record<string, CaseRecord> = { [caseKZ.id]: caseKZ, [caseDE.id]: caseDE };

/* ------------------------------------------------------------------ */
/* Match                                                               */
/* ------------------------------------------------------------------ */

export type EvidenceDimension = {
  id: string;
  label: string;
  score: number; // 0–100 similarity of evidence, NOT diagnostic probability
  weight: "High" | "Moderate" | "Supporting";
  direction: "supporting" | "neutral" | "divergent";
  summary: string;
  kzValue: string;
  deValue: string;
};

export const matchEvidence: EvidenceDimension[] = [
  {
    id: "phenotype",
    label: "Phenotype similarity",
    score: 91,
    weight: "High",
    direction: "supporting",
    summary: "7 of 8 core HPO terms shared, including three rare in combination.",
    kzValue: "8 terms · 7 shared",
    deValue: "9 terms · 7 shared",
  },
  {
    id: "trajectory",
    label: "Clinical trajectory",
    score: 88,
    weight: "High",
    direction: "supporting",
    summary: "Plateau then illness-triggered regression within a 3-month window of each other.",
    kzValue: "Plateau 11m → regression 16m",
    deValue: "Plateau 12m → regression 15m",
  },
  {
    id: "genetics",
    label: "Genetic similarity",
    score: 84,
    weight: "High",
    direction: "supporting",
    summary: "Identical coding VUS in NDUFAF6; counterpart case carries a second, deep intronic allele.",
    kzValue: "NDUFAF6 c.532G>C het",
    deValue: "NDUFAF6 c.532G>C + c.420+784C>T",
  },
  {
    id: "family",
    label: "Family pattern",
    score: 54,
    weight: "Moderate",
    direction: "divergent",
    summary: "Consanguinity present in ODY-001 and absent in ODY-742; shared regional ancestry noted in both.",
    kzValue: "First-cousin parents, sibling affected",
    deValue: "Non-consanguineous, sibling unaffected",
  },
  {
    id: "laboratory",
    label: "Laboratory evidence",
    score: 86,
    weight: "High",
    direction: "supporting",
    summary: "Concordant lactate, pyruvate, L/P ratio and alanine. Complex I assay available only in ODY-742.",
    kzValue: "L/P 21.6 · Ala 648",
    deValue: "L/P 22.4 · Ala 592 · CI 31%",
  },
  {
    id: "imaging",
    label: "Imaging pattern",
    score: 89,
    weight: "High",
    direction: "supporting",
    summary: "Bilateral symmetric putaminal T2 hyperintensity with brainstem involvement in both.",
    kzValue: "Putamen + dorsal brainstem",
    deValue: "Putamen + brainstem",
  },
  {
    id: "negative",
    label: "Negative evidence",
    score: 93,
    weight: "Supporting",
    direction: "supporting",
    summary: "Both cases exclude cardiac, hepatic, auditory and retinal involvement — narrowing the differential together.",
    kzValue: "6 exclusions documented",
    deValue: "6 exclusions documented",
  },
  {
    id: "temporal",
    label: "Temporal similarity",
    score: 81,
    weight: "Moderate",
    direction: "supporting",
    summary: "Onset ages align within 1–2 months at every recorded milestone.",
    kzValue: "Onset 5m · seizures 14m",
    deValue: "Onset 6m · seizures 13m",
  },
];

export const match = {
  id: "ODY-M-2261",
  source: caseKZ.id,
  target: caseDE.id,
  confidenceLabel: "Strong potential match",
  confidenceNote: "Evidence-similarity assessment. Not a diagnosis. Requires clinician review.",
  aggregate: 86,
  concordantGroups: 7,
  totalGroups: 8,
  divergences: 1,
  surfaced: "14 minutes ago",
  cohortsQueried: 1284,
  countriesQueried: 58,
  candidatesScreened: 128406,
  candidatesReturned: 4,
  reviewStatus: "Awaiting clinician review",
  proposedAction: "Open secure collaboration with the submitting clinician of ODY-742",
  reasoningSteps: [
    { id: "r1", label: "Structured signals extracted", detail: "8 signal groups normalised to HPO, HGVS, LOINC and RadLex" },
    { id: "r2", label: "Federated query dispatched", detail: "1,284 cohorts · 58 countries · no identifiable data transferred" },
    { id: "r3", label: "Candidate screening", detail: "128,406 records screened against phenotype + trajectory constraints" },
    { id: "r4", label: "Evidence comparison", detail: "4 candidates returned; ODY-742 ranked highest on 7 of 8 groups" },
    { id: "r5", label: "Human review required", detail: "No conclusion is drawn by the system. A clinician must assess." },
  ],
  divergenceNotes: [
    "Consanguinity differs between the two families — shared regional ancestry may still explain a founder allele.",
    "Complex I enzymology available only in ODY-742. Muscle biopsy not yet performed in ODY-001.",
    "Second NDUFAF6 allele in ODY-001 not identified; short-read sequencing would not detect a deep intronic variant.",
  ],
  nextSteps: [
    "Clinician review of evidence comparison by both submitting sites",
    "Targeted re-analysis of ODY-001 for the deep intronic NDUFAF6 candidate",
    "RNA studies to demonstrate cryptic exon inclusion",
    "If concordant, joint submission to the gene–disease curation panel",
  ],
} as const;

/** Other candidates returned by the same federated query. */
export const otherCandidates = [
  { id: "ODY-318", country: "Türkiye", countryCode: "TR", score: 63, note: "Shared phenotype core, divergent imaging" },
  { id: "ODY-556", country: "Canada", countryCode: "CA", score: 58, note: "Similar trajectory, no lactate elevation" },
  { id: "ODY-904", country: "Japan", countryCode: "JP", score: 51, note: "Overlapping genetics, later onset" },
];

/* ------------------------------------------------------------------ */
/* Comparison rows (derived, explicit for readability)                 */
/* ------------------------------------------------------------------ */

export type CompareRow = { label: string; kz: string; de: string; agreement: "match" | "partial" | "differ" | "only-de" | "only-kz" };

export const comparisonGroups: { group: string; rows: CompareRow[] }[] = [
  {
    group: "Identity",
    rows: [
      { label: "Case", kz: "ODY-001", de: "ODY-742", agreement: "differ" },
      { label: "Country", kz: "Kazakhstan", de: "Germany", agreement: "differ" },
      { label: "Age group", kz: "Child · 4y", de: "Child · 3y 9m", agreement: "match" },
      { label: "Sex", kz: "Female", de: "Male", agreement: "differ" },
      { label: "Status", kz: "Unresolved", de: "Unresolved · re-analysis", agreement: "partial" },
    ],
  },
  {
    group: "Phenotype",
    rows: [
      { label: "Global developmental delay", kz: "Present · severe · 8m", de: "Present · severe · 9m", agreement: "match" },
      { label: "Hypotonia", kz: "Present · moderate · 5m", de: "Present · moderate · 6m", agreement: "match" },
      { label: "Seizure", kz: "Present · severe · 14m", de: "Present · severe · 13m", agreement: "match" },
      { label: "Developmental regression", kz: "Present · 16m (febrile)", de: "Present · 15m (gastroenteritis)", agreement: "match" },
      { label: "Intellectual disability", kz: "Present · severe", de: "Present · severe", agreement: "match" },
      { label: "Increased serum lactate", kz: "Present · 18m", de: "Present · 15m", agreement: "match" },
      { label: "Nystagmus", kz: "Present · mild (unverified)", de: "Present · mild", agreement: "partial" },
      { label: "Dysphagia", kz: "Not documented", de: "Present · 20m", agreement: "only-de" },
    ],
  },
  {
    group: "Genetics",
    rows: [
      { label: "Exome", kz: "Non-diagnostic", de: "Non-diagnostic", agreement: "match" },
      { label: "Genome (short read)", kz: "Non-diagnostic", de: "Non-diagnostic", agreement: "match" },
      { label: "Long-read sequencing", kz: "Not performed", de: "Performed 2026-01", agreement: "only-de" },
      { label: "NDUFAF6 c.532G>C", kz: "Heterozygous (maternal)", de: "Heterozygous (paternal)", agreement: "match" },
      { label: "NDUFAF6 c.420+784C>T", kz: "Not assessed", de: "Heterozygous (maternal)", agreement: "only-de" },
      { label: "Mitochondrial analysis", kz: "m.13513G>A 4% (blood)", de: "Negative", agreement: "differ" },
    ],
  },
  {
    group: "Laboratory",
    rows: [
      { label: "Plasma lactate", kz: "4.1 mmol/L ↑", de: "3.8 mmol/L ↑", agreement: "match" },
      { label: "CSF lactate", kz: "3.4 mmol/L ↑", de: "3.1 mmol/L ↑", agreement: "match" },
      { label: "Lactate/pyruvate ratio", kz: "21.6 ↑", de: "22.4 ↑", agreement: "match" },
      { label: "Alanine", kz: "648 µmol/L ↑", de: "592 µmol/L ↑", agreement: "match" },
      { label: "Complex I activity (muscle)", kz: "Not performed", de: "31% of control ↓", agreement: "only-de" },
    ],
  },
  {
    group: "Imaging",
    rows: [
      { label: "Putaminal T2 hyperintensity", kz: "Bilateral symmetric", de: "Bilateral symmetric", agreement: "match" },
      { label: "Brainstem involvement", kz: "Dorsal brainstem", de: "Brainstem", agreement: "match" },
      { label: "MRS lactate peak", kz: "Present", de: "Present", agreement: "match" },
      { label: "Cerebellar atrophy", kz: "Mild at 3y 4m", de: "Mild vermian at 3y 2m", agreement: "match" },
    ],
  },
  {
    group: "Family history",
    rows: [
      { label: "Consanguinity", kz: "First cousins", de: "None reported", agreement: "differ" },
      { label: "Affected siblings", kz: "Younger brother under evaluation", de: "Sister unaffected", agreement: "differ" },
      { label: "Regional ancestry", kz: "Isolated maternal lineage", de: "Shared regional community (paternal)", agreement: "partial" },
    ],
  },
  {
    group: "Treatment response",
    rows: [
      { label: "Levetiracetam", kz: "Partial → loss of effect", de: "Partial → loss of effect", agreement: "match" },
      { label: "Ketogenic diet", kz: "≈40% reduction, sustained", de: "≈35% reduction, sustained", agreement: "match" },
      { label: "Valproate", kz: "Stopped — transaminase rise", de: "Stopped — transaminase rise", agreement: "match" },
      { label: "Vitamin cofactors", kz: "No change", de: "No change", agreement: "match" },
    ],
  },
  {
    group: "Negative evidence",
    rows: [
      { label: "Cardiac involvement", kz: "Excluded", de: "Excluded", agreement: "match" },
      { label: "Hepatic involvement", kz: "Excluded", de: "Excluded", agreement: "match" },
      { label: "Hearing loss", kz: "Excluded (ABR)", de: "Excluded (ABR)", agreement: "match" },
      { label: "Retinal dystrophy", kz: "Excluded (ERG)", de: "Excluded (ERG)", agreement: "match" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Create case workflow                                                */
/* ------------------------------------------------------------------ */

export type IntakeStep = {
  id: string;
  index: string;
  label: string;
  description: string;
  fields: { label: string; value: string; hint?: string; kind?: "text" | "select" | "chips" | "upload" | "area" }[];
  state: "complete" | "active" | "pending";
};

export const intakeSteps: IntakeStep[] = [
  {
    id: "identity",
    index: "01",
    label: "Case identity",
    description: "Pseudonymised record. No direct identifiers are collected or transmitted.",
    state: "complete",
    fields: [
      { label: "Case reference", value: "ODY-001", hint: "Generated by the network" },
      { label: "Submitting institution", value: "National Research Center for Maternal & Child Health", kind: "select" },
      { label: "Country", value: "Kazakhstan", kind: "select" },
      { label: "Age group", value: "Child (2–11 years)", kind: "select", hint: "Banded to prevent re-identification" },
      { label: "Sex", value: "Female", kind: "select" },
      { label: "Consent for cross-border comparison", value: "On file · reviewed 2026-02-14", kind: "select" },
    ],
  },
  {
    id: "phenotype",
    index: "02",
    label: "Clinical phenotype",
    description: "Terms are normalised to the Human Phenotype Ontology.",
    state: "active",
    fields: [
      { label: "Observed phenotypes", value: "Global developmental delay · Hypotonia · Seizure · Developmental regression · Intellectual disability", kind: "chips" },
      { label: "Explicitly absent", value: "Cardiac involvement · Retinal dystrophy · Hearing loss", kind: "chips", hint: "Negative evidence is as valuable as positive" },
      { label: "Age at first abnormality", value: "5 months" },
    ],
  },
  {
    id: "genetics",
    index: "03",
    label: "Genetics",
    description: "Variants in HGVS notation. Raw sequence data never leaves your institution.",
    state: "pending",
    fields: [
      { label: "Tests performed", value: "Trio exome · Genome (short read) · mtDNA panel", kind: "chips" },
      { label: "Reported variants", value: "NDUFAF6 c.532G>C p.(Ala178Pro) — heterozygous, VUS" },
      { label: "Diagnostic outcome", value: "Non-diagnostic", kind: "select" },
    ],
  },
  { id: "timeline", index: "04", label: "Clinical timeline", description: "Ordered events establish trajectory, which is often more discriminating than any single finding.", state: "pending", fields: [{ label: "Events recorded", value: "11 events · birth to 4y 1m" }] },
  { id: "laboratory", index: "05", label: "Laboratory", description: "Values with units and local reference ranges.", state: "pending", fields: [{ label: "Panels", value: "Metabolic · Organic acids · Acylcarnitine · CSF", kind: "chips" }] },
  { id: "imaging", index: "06", label: "Imaging", description: "Structured findings. Images remain at the originating site.", state: "pending", fields: [{ label: "Studies", value: "MRI brain ×2 · MR spectroscopy" }] },
  { id: "family", index: "07", label: "Family history", description: "Pedigree structure and consanguinity coefficient.", state: "pending", fields: [{ label: "Pedigree", value: "Two affected of four siblings · first-cousin parents" }] },
  { id: "treatment", index: "08", label: "Treatment response", description: "Interventions with duration and measured response.", state: "pending", fields: [{ label: "Interventions", value: "4 recorded" }] },
  { id: "documents", index: "09", label: "Documents", description: "Reports are processed locally. Extraction is assistive and must be verified.", state: "pending", fields: [{ label: "Upload medical report", value: "neuro-summary-2026-02.pdf · 1.4 MB", kind: "upload" }] },
];

export type ExtractedTerm = {
  hpo: string;
  term: string;
  confidence: number;
  evidence: string;
  page: string;
  state: "unreviewed" | "confirmed" | "edited" | "rejected";
};

export const aiExtraction = {
  document: "neuro-summary-2026-02.pdf",
  pages: 7,
  processedAt: "processed locally · 2.3 s",
  model: "Phenotype extraction assistant",
  notice:
    "AI-assisted extraction. Terms below are proposed from the uploaded document and carry no diagnostic meaning until a clinician confirms them.",
  terms: [
    { hpo: "HP:0001263", term: "Global developmental delay", confidence: 0.96, evidence: "\"…has not acquired independent sitting by 8 months and shows delay across all domains…\"", page: "p. 2", state: "confirmed" },
    { hpo: "HP:0001252", term: "Hypotonia", confidence: 0.94, evidence: "\"…marked truncal hypotonia with preserved deep tendon reflexes…\"", page: "p. 2", state: "confirmed" },
    { hpo: "HP:0001250", term: "Seizure", confidence: 0.98, evidence: "\"…focal seizures with secondary generalisation, first documented at 14 months…\"", page: "p. 3", state: "confirmed" },
    { hpo: "HP:0001249", term: "Intellectual disability", confidence: 0.88, evidence: "\"…profound cognitive impairment on structured assessment…\"", page: "p. 5", state: "unreviewed" },
    { hpo: "HP:0002376", term: "Developmental regression", confidence: 0.91, evidence: "\"…loss of previously acquired head control following a febrile episode…\"", page: "p. 3", state: "unreviewed" },
    { hpo: "HP:0000639", term: "Nystagmus", confidence: 0.62, evidence: "\"…intermittent ocular instability noted by parents…\"", page: "p. 4", state: "unreviewed" },
    { hpo: "HP:0001744", term: "Splenomegaly", confidence: 0.41, evidence: "\"…spleen not palpably enlarged…\"", page: "p. 6", state: "rejected" },
  ] as ExtractedTerm[],
};

/* ------------------------------------------------------------------ */
/* Collaboration room                                                  */
/* ------------------------------------------------------------------ */

export type Message = {
  id: string;
  author: "A" | "B" | "system";
  name: string;
  role: string;
  time: string;
  body: string;
  attachment?: { label: string; meta: string };
  kind?: "note" | "proposal" | "system";
};

export const collaboration = {
  roomId: "ODY-ROOM-2261",
  title: "ODY-001 ↔ ODY-742",
  opened: "12 days ago",
  security: "End-to-end encrypted · both institutions' data governance approved · audit log immutable",
  participants: [
    { side: "A" as const, ...doctor },
    { side: "B" as const, ...counterpart },
  ],
  status: {
    stage: "Evidence review",
    stages: ["Match proposed", "Evidence review", "Joint assessment", "Verification", "Confirmed connection"],
    stageIndex: 1,
    verificationA: "Confirmed by Dr. Seitkali",
    verificationB: "Pending — Dr. Brandt",
  },
  messages: [
    { id: "m0", author: "system", name: "ODYSSEY", role: "", time: "12 d", body: "Secure room opened following mutual acceptance of potential match ODY-M-2261. Identifiable data is not shared in this room.", kind: "system" },
    { id: "m1", author: "A", name: doctor.name, role: doctor.role, time: "12 d", body: "Thank you for accepting. Our case has the same coding NDUFAF6 substitution but we never found a second allele. Short-read genome was reported as non-diagnostic in 2025.", kind: "note" },
    { id: "m2", author: "B", name: counterpart.name, role: counterpart.role, time: "11 d", body: "We were in exactly that position until January. Long-read sequencing identified a deep intronic candidate, c.420+784C>T, predicted to create a cryptic exon. Short-read would not have called it.", kind: "note", attachment: { label: "ODY-742-longread-summary.pdf", meta: "Structured summary · no raw sequence · 412 KB" } },
    { id: "m3", author: "A", name: doctor.name, role: doctor.role, time: "11 d", body: "That would explain a great deal. Our imaging is very close to yours — bilateral putaminal signal change with dorsal brainstem involvement.", kind: "note", attachment: { label: "ODY-001-imaging-findings.json", meta: "Structured findings · RadLex coded · 18 KB" } },
    { id: "m4", author: "B", name: counterpart.name, role: counterpart.role, time: "9 d", body: "Agreed. One difference worth recording: your family is consanguineous and ours is not. Our paternal grandparents come from the same regional community, so a founder allele remains plausible.", kind: "note" },
    { id: "m5", author: "A", name: doctor.name, role: doctor.role, time: "6 d", body: "I propose we treat this as a candidate gene–disease relationship rather than a diagnosis, and request targeted re-analysis of our genome data for the intronic region.", kind: "proposal" },
    { id: "m6", author: "B", name: counterpart.name, role: counterpart.role, time: "4 d", body: "Supported. If the variant is present, RNA studies from fibroblasts would be the decisive evidence. Our laboratory can run them under a collaboration agreement.", kind: "note" },
    { id: "m7", author: "system", name: "ODYSSEY", role: "", time: "2 d", body: "Verification recorded by Dr. Seitkali: evidence supports a clinically meaningful similarity. Awaiting second clinician verification.", kind: "system" },
  ] as Message[],
  documents: [
    { label: "Evidence comparison — ODY-001 / ODY-742", meta: "Generated 2 d ago · 8 signal groups", kind: "Comparison" },
    { label: "ODY-742-longread-summary.pdf", meta: "Shared by Dr. Brandt · 412 KB", kind: "Report" },
    { label: "ODY-001-imaging-findings.json", meta: "Shared by Dr. Seitkali · 18 KB", kind: "Structured data" },
    { label: "Data governance approval — KZ", meta: "Ethics ref. 2026/114 · valid to 2027-02", kind: "Governance" },
    { label: "Data governance approval — DE", meta: "Ethics ref. S-2025/338 · valid to 2027-09", kind: "Governance" },
  ],
  decisionLog: [
    { id: "d1", time: "12 d", actor: "Both clinicians", action: "Accepted potential match for review", state: "done" as const },
    { id: "d2", time: "11 d", actor: "Dr. Brandt", action: "Shared long-read structured summary", state: "done" as const },
    { id: "d3", time: "9 d", actor: "Both clinicians", action: "Recorded family-pattern divergence as unresolved", state: "done" as const },
    { id: "d4", time: "6 d", actor: "Dr. Seitkali", action: "Proposed targeted re-analysis of ODY-001", state: "done" as const },
    { id: "d5", time: "2 d", actor: "Dr. Seitkali", action: "Verified evidence similarity", state: "done" as const },
    { id: "d6", time: "—", actor: "Dr. Brandt", action: "Second verification", state: "pending" as const },
    { id: "d7", time: "—", actor: "Curation panel", action: "Joint submission of gene–disease evidence", state: "blocked" as const },
  ],
};

/* ------------------------------------------------------------------ */
/* Network geography (stylised equirectangular coordinates)            */
/* ------------------------------------------------------------------ */

export type NetworkNode = {
  id: string;
  label: string;
  country: string;
  code: string;
  lat: number;
  lon: number;
  cases: number;
  tier: "primary" | "member" | "observer";
};

export const networkNodes: NetworkNode[] = [
  { id: "kz", label: "Astana", country: "Kazakhstan", code: "KZ", lat: 51.17, lon: 71.43, cases: 412, tier: "primary" },
  { id: "de", label: "Heidelberg", country: "Germany", code: "DE", lat: 49.4, lon: 8.69, cases: 3186, tier: "primary" },
  { id: "uk", label: "London", country: "United Kingdom", code: "GB", lat: 51.5, lon: -0.12, cases: 4210, tier: "member" },
  { id: "fr", label: "Paris", country: "France", code: "FR", lat: 48.86, lon: 2.35, cases: 2874, tier: "member" },
  { id: "no", label: "Oslo", country: "Norway", code: "NO", lat: 59.91, lon: 10.75, cases: 986, tier: "member" },
  { id: "it", label: "Milan", country: "Italy", code: "IT", lat: 45.46, lon: 9.19, cases: 1744, tier: "member" },
  { id: "tr", label: "Ankara", country: "Türkiye", code: "TR", lat: 39.93, lon: 32.86, cases: 1312, tier: "member" },
  { id: "in", label: "Bengaluru", country: "India", code: "IN", lat: 12.97, lon: 77.59, cases: 2208, tier: "member" },
  { id: "jp", label: "Tokyo", country: "Japan", code: "JP", lat: 35.68, lon: 139.69, cases: 2960, tier: "member" },
  { id: "au", label: "Melbourne", country: "Australia", code: "AU", lat: -37.81, lon: 144.96, cases: 1508, tier: "member" },
  { id: "br", label: "São Paulo", country: "Brazil", code: "BR", lat: -23.55, lon: -46.63, cases: 1106, tier: "observer" },
  { id: "za", label: "Cape Town", country: "South Africa", code: "ZA", lat: -33.92, lon: 18.42, cases: 604, tier: "observer" },
  { id: "us", label: "Boston", country: "United States", code: "US", lat: 42.36, lon: -71.06, cases: 5312, tier: "member" },
  { id: "ca", label: "Toronto", country: "Canada", code: "CA", lat: 43.65, lon: -79.38, cases: 1902, tier: "member" },
  { id: "eg", label: "Cairo", country: "Egypt", code: "EG", lat: 30.04, lon: 31.24, cases: 742, tier: "observer" },
  { id: "kr", label: "Seoul", country: "South Korea", code: "KR", lat: 37.57, lon: 126.98, cases: 1420, tier: "member" },
];

export const networkEdges: { from: string; to: string; strength: number; active?: boolean }[] = [
  { from: "kz", to: "de", strength: 1, active: true },
  { from: "de", to: "uk", strength: 0.5 },
  { from: "de", to: "fr", strength: 0.45 },
  { from: "de", to: "it", strength: 0.4 },
  { from: "uk", to: "us", strength: 0.55 },
  { from: "us", to: "ca", strength: 0.5 },
  { from: "kz", to: "tr", strength: 0.35 },
  { from: "kz", to: "in", strength: 0.3 },
  { from: "in", to: "jp", strength: 0.35 },
  { from: "jp", to: "kr", strength: 0.4 },
  { from: "jp", to: "au", strength: 0.3 },
  { from: "fr", to: "eg", strength: 0.25 },
  { from: "eg", to: "za", strength: 0.2 },
  { from: "us", to: "br", strength: 0.25 },
  { from: "no", to: "uk", strength: 0.3 },
  { from: "tr", to: "de", strength: 0.3 },
];

/** Equirectangular projection into the shared viewBox "0 0 100 50". */
export function project(lat: number, lon: number) {
  return { x: ((lon + 180) / 360) * 100, y: ((90 - lat) / 180) * 50 };
}

/* ------------------------------------------------------------------ */
/* The narrative spine of the product                                  */
/* ------------------------------------------------------------------ */

export const journey = [
  { id: "j1", label: "Unknown case", detail: "A case with no answer after exome and genome sequencing" },
  { id: "j2", label: "Global search", detail: "Federated query across 1,284 cohorts in 58 countries" },
  { id: "j3", label: "Potential match", detail: "ODY-742, Heidelberg — 7 of 8 signal groups concordant" },
  { id: "j4", label: "Evidence", detail: "Signal-by-signal comparison, including what is absent" },
  { id: "j5", label: "Doctor ↔ Doctor", detail: "Secure clinical collaboration between two institutions" },
  { id: "j6", label: "Verified connection", detail: "Human clinicians establish meaning; knowledge returns to the network" },
];

/* ------------------------------------------------------------------ */
/* Derived comparison aids                                             */
/* ------------------------------------------------------------------ */

/** Milestone onset in months — the "clinical trajectory" evidence group. */
export const trajectory = {
  milestones: ["Hypotonia", "Developmental delay", "Plateau", "Seizure onset", "Regression", "Imaging change"],
  kz: [5, 8, 11, 14, 16, 17],
  de: [6, 9, 12, 13, 15, 16],
  maxMonths: 20,
};

export const phenotypeOverlap = {
  shared: 7,
  onlyKZ: 1,
  onlyDE: 2,
  sharedTerms: [
    "Global developmental delay",
    "Hypotonia",
    "Seizure",
    "Intellectual disability",
    "Developmental regression",
    "Increased serum lactate",
    "Nystagmus",
  ],
  kzTerms: ["Feeding difficulties (resolved)"],
  deTerms: ["Dysphagia", "Complex I deficiency (muscle)"],
};
