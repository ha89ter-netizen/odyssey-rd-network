/**
 * Synthetic seed data. DEMONSTRATION DATA — NOT FOR CLINICAL USE.
 *
 * No real patients, clinicians, institutions or genomic results are
 * represented. Values are internally consistent so the matching engine
 * produces meaningful, deterministic output — they are not clinical truth.
 */
import type {
  AppState, CaseRecord, Doctor, DoctorId, GeneticFinding, LabRow, Phenotype, TimelineEvent,
} from "./types";

/** Fixed demo clock so every run of the demo is identical. */
export const DEMO_NOW = new Date("2026-09-22T07:42:00.000Z").getTime();
export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;

export const doctors: Record<DoctorId, Doctor> = {
  "doc-a": {
    id: "doc-a",
    name: "Dr. A. Seitkali",
    initials: "AS",
    role: "Clinical Geneticist",
    department: "Division of Pediatric Neurogenetics",
    institution: "National Research Center for Maternal & Child Health",
    city: "Astana",
    country: "Kazakhstan",
    countryCode: "KZ",
    networkId: "ODY-CLIN-4471",
    accreditation: "Verified network clinician · Tier II data access",
  },
  "doc-b": {
    id: "doc-b",
    name: "Dr. M. Brandt",
    initials: "MB",
    role: "Consultant in Neurometabolic Disease",
    department: "Institute for Rare Neurological Disorders",
    institution: "Universitätsklinikum Heidelberg",
    city: "Heidelberg",
    country: "Germany",
    countryCode: "DE",
    networkId: "ODY-CLIN-1180",
    accreditation: "Verified network clinician · Tier II data access",
  },
};

const p = (
  hpo: string, term: string, onset: string, severity: Phenotype["severity"],
  status: Phenotype["status"], source: Phenotype["source"], verification: Phenotype["verification"],
): Phenotype => ({ hpo, term, onset, severity, status, source, verification });

const lab = (analyte: string, matrix: string, value: string, numeric: number | null, unit: string, ref: string, flag: LabRow["flag"]): LabRow =>
  ({ analyte, matrix, value, numeric, unit, ref, flag });

const ev = (age: string, ageMonths: number, label: string, detail: string, kind: TimelineEvent["kind"]): TimelineEvent =>
  ({ age, ageMonths, label, detail, kind });

/* ------------------------------------------------------------------ */
/* ODY-001 — Kazakhstan, the case the demo starts from                 */
/* ------------------------------------------------------------------ */

const caseKZ: CaseRecord = {
  id: "ODY-001",
  ownerId: "doc-a",
  country: "Kazakhstan",
  countryCode: "KZ",
  institution: doctors["doc-a"].institution,
  clinician: doctors["doc-a"].name,
  ageGroup: "Child · 4y",
  sex: "Female",
  phenotypeCluster: "Neurological",
  status: "Unresolved",
  headline: "Progressive infantile encephalopathy of unknown molecular cause",
  narrative:
    "Term infant, uneventful perinatal course. Truncal hypotonia noted at 5 months. Acquisition of early milestones followed by plateau at 11 months and regression after a febrile illness at 16 months. Seizure onset at 14 months, progressing to pharmacoresistant epilepsy. Trio exome and subsequent genome sequencing non-diagnostic.",
  enrolled: "2026-02-14",
  createdAt: DEMO_NOW - 220 * DAY,
  updatedAt: DEMO_NOW - 14 * MIN,
  odysseyMonths: 49,
  phenotypes: [
    p("HP:0001263", "Global developmental delay", "8 months", "Severe", "Present", "Examination", "verified"),
    p("HP:0001252", "Hypotonia", "5 months", "Moderate", "Present", "Examination", "verified"),
    p("HP:0001250", "Seizure", "14 months", "Severe", "Present", "Clinical note", "verified"),
    p("HP:0001249", "Intellectual disability", "24 months", "Severe", "Present", "Examination", "verified"),
    p("HP:0002376", "Developmental regression", "16 months", "Severe", "Present", "Clinical note", "verified"),
    p("HP:0002151", "Increased serum lactate", "18 months", "Moderate", "Present", "Clinical note", "verified"),
    p("HP:0000639", "Nystagmus", "12 months", "Mild", "Present", "Examination", "verified"),
    p("HP:0011968", "Feeding difficulties", "6 months", "Moderate", "Resolved", "Referral letter", "verified"),
    p("HP:0001156", "Brachydactyly", "—", "Mild", "Absent", "Examination", "verified"),
  ],
  genetics: [
    { gene: "—", variant: "Trio exome sequencing", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Coverage 98.4% at 20×. No P/LP variant in disease-associated genes.", category: "sequencing" },
    { gene: "—", variant: "Genome sequencing (short read)", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Structural variant and mitochondrial analysis included.", category: "sequencing" },
    { gene: "NDUFAF6", variant: "c.532G>C p.(Ala178Pro)", zygosity: "Heterozygous", classification: "VUS", inheritance: "Maternal", note: "Second allele not identified. Re-analysis pending.", category: "nuclear-variant" },
    { gene: "MT-ND5", variant: "m.13513G>A", zygosity: "Heteroplasmy 4%", classification: "Below threshold", inheritance: "Maternal", note: "Blood only. Muscle not yet tested.", category: "mitochondrial" },
  ],
  geneticSummary:
    "Unresolved. One monoallelic VUS in a complex I assembly factor; second allele not identified. Mitochondrial re-analysis and long-read sequencing proposed.",
  timeline: [
    ev("Birth", 0, "Term delivery", "39+2 weeks, birth weight 3.29 kg, Apgar 9/10", "stable"),
    ev("5 months", 5, "Truncal hypotonia", "First documented neurological abnormality", "onset"),
    ev("8 months", 8, "Developmental delay", "Fails to sit unsupported; referred to paediatric neurology", "referral"),
    ev("11 months", 11, "Developmental plateau", "No new milestones acquired", "stable"),
    ev("14 months", 14, "Seizure onset", "Focal to bilateral tonic–clonic; EEG multifocal epileptiform", "onset"),
    ev("16 months", 16, "Regression after febrile illness", "Loss of head control and babbling; lactate 4.1 mmol/L", "regression"),
    ev("17 months", 17, "MRI: putaminal signal change", "Symmetric T2 hyperintensity, putamen and dorsal brainstem", "investigation"),
    ev("18 months", 18, "Metabolic work-up", "CSF lactate elevated; muscle biopsy deferred", "investigation"),
    ev("22 months", 22, "Trio exome non-diagnostic", "Reported as no primary finding", "investigation"),
    ev("2y 8m", 32, "Ketogenic diet initiated", "Partial seizure reduction (~40%)", "treatment"),
    ev("3y 6m", 42, "Genome sequencing non-diagnostic", "Re-analysis scheduled at 12 months", "investigation"),
    ev("4y 1m", 49, "Submitted to ODYSSEY network", "Federated query across member institutions", "referral"),
  ],
  milestones: { hypotonia: 5, developmentalDelay: 8, plateau: 11, seizureOnset: 14, regression: 16, imagingChange: 17 },
  labs: [
    lab("Lactate", "Plasma", "4.1", 4.1, "mmol/L", "0.5–2.2", "high"),
    lab("Lactate", "CSF", "3.4", 3.4, "mmol/L", "1.1–2.4", "high"),
    lab("Pyruvate", "Plasma", "0.19", 0.19, "mmol/L", "0.03–0.10", "high"),
    lab("Lactate/pyruvate ratio", "Plasma", "21.6", 21.6, "ratio", "< 20", "high"),
    lab("Alanine", "Plasma", "648", 648, "µmol/L", "150–450", "high"),
    lab("Ammonia", "Plasma", "38", 38, "µmol/L", "< 50", "normal"),
    lab("Creatine kinase", "Serum", "142", 142, "U/L", "< 190", "normal"),
    lab("Acylcarnitine profile", "DBS", "Non-specific", null, "—", "—", "normal"),
  ],
  imaging: [
    { modality: "MRI brain", age: "17 months", finding: "Symmetric T2 hyperintensity of the putamen and dorsal brainstem", impression: "Pattern consistent with a mitochondrial leukoencephalopathy", features: ["putaminal-t2", "brainstem-involvement"] },
    { modality: "MR spectroscopy", age: "17 months", finding: "Lactate doublet at 1.33 ppm", impression: "Supports impaired oxidative metabolism", features: ["mrs-lactate-peak"] },
    { modality: "MRI brain (repeat)", age: "3y 4m", finding: "Progression of putaminal signal, mild cerebellar atrophy", impression: "Progressive course", features: ["putaminal-t2", "cerebellar-atrophy"] },
  ],
  family: {
    pedigree: "Two affected among four siblings; parents unaffected",
    consanguinity: true,
    consanguinityNote: "First-cousin parents (F ≈ 0.0625)",
    siblings: "Younger brother, 2y — early hypotonia under evaluation",
    notes: "No extended family history of neurological disease reported.",
    regionalAncestry: "Regionally isolated maternal lineage",
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
  completeness: [
    { label: "Phenotype", value: 87 },
    { label: "Genetics", value: 62 },
    { label: "Timeline", value: 94 },
    { label: "Laboratory", value: 84 },
    { label: "Imaging", value: 76 },
    { label: "Family history", value: 80 },
    { label: "Treatment response", value: 80 },
    { label: "Negative evidence", value: 62 },
  ],
};

/* ------------------------------------------------------------------ */
/* ODY-742 — Germany, the case the network returns                     */
/* ------------------------------------------------------------------ */

const caseDE: CaseRecord = {
  id: "ODY-742",
  ownerId: "doc-b",
  country: "Germany",
  countryCode: "DE",
  institution: doctors["doc-b"].institution,
  clinician: doctors["doc-b"].name,
  ageGroup: "Child · 3y 9m",
  sex: "Male",
  phenotypeCluster: "Neurological",
  status: "Clinically Corroborated",
  headline: "Progressive encephalopathy with putaminal involvement, molecularly unsolved",
  narrative:
    "Second child of non-consanguineous parents. Hypotonia from 6 months, plateau at 12 months, marked regression following gastroenteritis at 15 months. Pharmacoresistant epilepsy from 13 months. Exome and genome non-diagnostic; long-read sequencing performed 2026-01 and under re-analysis.",
  enrolled: "2025-09-03",
  createdAt: DEMO_NOW - 384 * DAY,
  updatedAt: DEMO_NOW - 2 * DAY,
  odysseyMonths: 45,
  phenotypes: [
    p("HP:0001263", "Global developmental delay", "9 months", "Severe", "Present", "Examination", "verified"),
    p("HP:0001252", "Hypotonia", "6 months", "Moderate", "Present", "Examination", "verified"),
    p("HP:0001250", "Seizure", "13 months", "Severe", "Present", "Clinical note", "verified"),
    p("HP:0001249", "Intellectual disability", "26 months", "Severe", "Present", "Examination", "verified"),
    p("HP:0002376", "Developmental regression", "15 months", "Severe", "Present", "Clinical note", "verified"),
    p("HP:0002151", "Increased serum lactate", "15 months", "Moderate", "Present", "Clinical note", "verified"),
    p("HP:0000639", "Nystagmus", "14 months", "Mild", "Present", "Examination", "verified"),
    p("HP:0002015", "Dysphagia", "20 months", "Moderate", "Present", "Clinical note", "verified"),
    p("HP:0001647", "Cardiac involvement", "—", "Mild", "Absent", "Examination", "verified"),
  ],
  genetics: [
    { gene: "—", variant: "Trio exome sequencing", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Reported 2025-04.", category: "sequencing" },
    { gene: "—", variant: "Genome sequencing (short read)", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "Reported 2025-08.", category: "sequencing" },
    { gene: "NDUFAF6", variant: "c.532G>C p.(Ala178Pro)", zygosity: "Heterozygous", classification: "VUS", inheritance: "Paternal", note: "Same nucleotide substitution as ODY-001.", category: "nuclear-variant" },
    { gene: "NDUFAF6", variant: "c.420+784C>T (deep intronic)", zygosity: "Heterozygous", classification: "VUS — candidate", inheritance: "Maternal", note: "Long-read sequencing 2026-01. Predicted cryptic exon inclusion; RNA studies pending.", category: "nuclear-variant" },
    { gene: "—", variant: "Complex I activity, muscle", zygosity: "—", classification: "Reduced — 31% of control", inheritance: "—", note: "Isolated complex I deficiency.", category: "enzymology" },
  ],
  geneticSummary:
    "Biallelic VUS in NDUFAF6 — one coding, one deep intronic candidate identified only after long-read sequencing. RNA studies pending. Not yet reportable as diagnostic.",
  timeline: [
    ev("Birth", 0, "Term delivery", "38+5 weeks, birth weight 3.05 kg, unremarkable", "stable"),
    ev("6 months", 6, "Hypotonia", "Central hypotonia on physiotherapy assessment", "onset"),
    ev("9 months", 9, "Developmental delay", "Referred to neuropaediatrics", "referral"),
    ev("12 months", 12, "Developmental plateau", "Milestone acquisition ceases", "stable"),
    ev("13 months", 13, "Seizure onset", "Focal seizures, multifocal EEG", "onset"),
    ev("15 months", 15, "Regression after gastroenteritis", "Loss of sitting; lactate 3.8 mmol/L", "regression"),
    ev("16 months", 16, "MRI: putaminal signal change", "Bilateral symmetric T2 hyperintensity", "investigation"),
    ev("19 months", 19, "Exome non-diagnostic", "Re-analysis at 12 months requested", "investigation"),
    ev("2y 4m", 28, "Ketogenic diet initiated", "≈35% seizure reduction", "treatment"),
    ev("3y 1m", 37, "Long-read sequencing", "Deep intronic candidate identified", "investigation"),
    ev("3y 9m", 45, "Listed for federated matching", "Consent for cross-border comparison on file", "referral"),
  ],
  milestones: { hypotonia: 6, developmentalDelay: 9, plateau: 12, seizureOnset: 13, regression: 15, imagingChange: 16 },
  labs: [
    lab("Lactate", "Plasma", "3.8", 3.8, "mmol/L", "0.5–2.2", "high"),
    lab("Lactate", "CSF", "3.1", 3.1, "mmol/L", "1.1–2.4", "high"),
    lab("Pyruvate", "Plasma", "0.17", 0.17, "mmol/L", "0.03–0.10", "high"),
    lab("Lactate/pyruvate ratio", "Plasma", "22.4", 22.4, "ratio", "< 20", "high"),
    lab("Alanine", "Plasma", "592", 592, "µmol/L", "150–450", "high"),
    lab("Ammonia", "Plasma", "41", 41, "µmol/L", "< 50", "normal"),
    lab("Creatine kinase", "Serum", "168", 168, "U/L", "< 190", "normal"),
    lab("Complex I activity", "Muscle", "31", 31, "% of control", "> 60", "low"),
  ],
  imaging: [
    { modality: "MRI brain", age: "16 months", finding: "Bilateral symmetric putaminal T2 hyperintensity, brainstem involvement", impression: "Leigh-like radiological pattern", features: ["putaminal-t2", "brainstem-involvement"] },
    { modality: "MR spectroscopy", age: "16 months", finding: "Lactate peak present", impression: "Impaired oxidative metabolism", features: ["mrs-lactate-peak"] },
    { modality: "MRI brain (repeat)", age: "3y 2m", finding: "Stable putaminal change, mild vermian atrophy", impression: "Slowly progressive", features: ["putaminal-t2", "cerebellar-atrophy"] },
  ],
  family: {
    pedigree: "Single affected child of two; sister unaffected at 7y",
    consanguinity: false,
    consanguinityNote: "None reported",
    siblings: "Sister, 7y — neurologically normal",
    notes: "No known family history of metabolic disease.",
    regionalAncestry: "Paternal grandparents from the same regional community",
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
  completeness: [
    { label: "Phenotype", value: 96 },
    { label: "Genetics", value: 94 },
    { label: "Timeline", value: 90 },
    { label: "Laboratory", value: 92 },
    { label: "Imaging", value: 88 },
    { label: "Family history", value: 74 },
    { label: "Treatment response", value: 86 },
    { label: "Negative evidence", value: 78 },
  ],
};

/* ------------------------------------------------------------------ */
/* Queue filler — enough real records for dashboard counts to be real  */
/* ------------------------------------------------------------------ */

type FillerSpec = {
  id: string; owner: DoctorId; ageGroup: string; sex: string; cluster: string;
  status: CaseRecord["status"]; headline: string; terms: [string, string][];
  milestones: Milestones; days: number; completeness: number;
};
type Milestones = Record<string, number>;

function filler(s: FillerSpec): CaseRecord {
  const doc = doctors[s.owner];
  const genes: GeneticFinding[] = [
    { gene: "—", variant: "Trio exome sequencing", zygosity: "—", classification: "Non-diagnostic", inheritance: "—", note: "No primary finding reported.", category: "sequencing" },
  ];
  return {
    id: s.id,
    ownerId: s.owner,
    country: doc.country,
    countryCode: doc.countryCode,
    institution: doc.institution,
    clinician: doc.name,
    ageGroup: s.ageGroup,
    sex: s.sex,
    phenotypeCluster: s.cluster,
    status: s.status,
    headline: s.headline,
    narrative: `${s.headline}. Structured for federated comparison; no molecular diagnosis to date.`,
    enrolled: "2026-01-01",
    createdAt: DEMO_NOW - s.days * DAY,
    updatedAt: DEMO_NOW - Math.round(s.days / 3) * DAY,
    odysseyMonths: 36,
    phenotypes: s.terms.map(([hpo, term]) => p(hpo, term, "—", "Moderate", "Present", "Clinical note", "verified")),
    genetics: genes,
    geneticSummary: "Non-diagnostic to date.",
    timeline: [ev("Birth", 0, "Term delivery", "Unremarkable perinatal course", "stable")],
    milestones: s.milestones,
    labs: [lab("Lactate", "Plasma", "1.8", 1.8, "mmol/L", "0.5–2.2", "normal")],
    imaging: [],
    family: { pedigree: "Not documented", consanguinity: false, consanguinityNote: "Not reported", siblings: "—", notes: "—", regionalAncestry: "—" },
    treatments: [],
    negativeEvidence: [],
    signals: s.terms.map(([, t]) => t),
    completeness: [
      { label: "Phenotype", value: s.completeness },
      { label: "Genetics", value: Math.max(20, s.completeness - 25) },
      { label: "Timeline", value: Math.max(20, s.completeness - 10) },
      { label: "Laboratory", value: Math.max(20, s.completeness - 15) },
      { label: "Imaging", value: Math.max(15, s.completeness - 30) },
      { label: "Family history", value: Math.max(15, s.completeness - 20) },
      { label: "Treatment response", value: Math.max(15, s.completeness - 18) },
      { label: "Negative evidence", value: Math.max(10, s.completeness - 35) },
    ],
  };
}

const fillers: FillerSpec[] = [
  { id: "ODY-014", owner: "doc-a", ageGroup: "Child · 7y", sex: "Male", cluster: "Neurological", status: "Under review", headline: "Episodic ataxia with lactate elevation, normal exome", terms: [["HP:0002066", "Gait ataxia"], ["HP:0002151", "Increased serum lactate"], ["HP:0001250", "Seizure"]], milestones: { hypotonia: 18, developmentalDelay: 24, plateau: 36, seizureOnset: 30, regression: 40, imagingChange: 42 }, days: 90, completeness: 64 },
  { id: "ODY-027", owner: "doc-a", ageGroup: "Infant · 5m", sex: "Female", cluster: "Hepatic", status: "Unresolved", headline: "Neonatal cholestasis, dysmorphism, consanguineous pedigree", terms: [["HP:0001396", "Cholestasis"], ["HP:0001939", "Abnormality of metabolism"], ["HP:0001510", "Growth delay"]], milestones: { hypotonia: 2, developmentalDelay: 3, plateau: 4, seizureOnset: 0, regression: 0, imagingChange: 3 }, days: 40, completeness: 47 },
  { id: "ODY-039", owner: "doc-a", ageGroup: "Adolescent · 13y", sex: "Male", cluster: "Movement disorder", status: "Unresolved", headline: "Adolescent-onset dystonia, basal ganglia signal change", terms: [["HP:0001332", "Dystonia"], ["HP:0002134", "Abnormal basal ganglia MRI signal"]], milestones: { hypotonia: 0, developmentalDelay: 0, plateau: 120, seizureOnset: 0, regression: 132, imagingChange: 130 }, days: 120, completeness: 71 },
  { id: "ODY-052", owner: "doc-a", ageGroup: "Child · 9y", sex: "Male", cluster: "Neuromuscular", status: "Under review", headline: "Recurrent rhabdomyolysis, exercise intolerance, sibling affected", terms: [["HP:0003201", "Rhabdomyolysis"], ["HP:0003546", "Exercise intolerance"], ["HP:0003236", "Elevated creatine kinase"]], milestones: { hypotonia: 36, developmentalDelay: 0, plateau: 0, seizureOnset: 0, regression: 0, imagingChange: 0 }, days: 150, completeness: 58 },
  { id: "ODY-068", owner: "doc-a", ageGroup: "Child · 6y", sex: "Female", cluster: "Immune", status: "Clinically Corroborated", headline: "Immune dysregulation with sterile osteomyelitis", terms: [["HP:0002754", "Osteomyelitis"], ["HP:0002960", "Autoimmunity"]], milestones: { hypotonia: 0, developmentalDelay: 0, plateau: 0, seizureOnset: 0, regression: 0, imagingChange: 48 }, days: 300, completeness: 94 },
  { id: "ODY-081", owner: "doc-a", ageGroup: "Child · 3y", sex: "Female", cluster: "Neurological", status: "Unresolved", headline: "Infantile spasms with hypsarrhythmia, unresolved after panel", terms: [["HP:0012469", "Infantile spasms"], ["HP:0001263", "Global developmental delay"]], milestones: { hypotonia: 7, developmentalDelay: 10, plateau: 14, seizureOnset: 6, regression: 20, imagingChange: 22 }, days: 75, completeness: 55 },
  { id: "ODY-093", owner: "doc-a", ageGroup: "Infant · 9m", sex: "Male", cluster: "Metabolic", status: "Unresolved", headline: "Unexplained metabolic acidosis with feeding intolerance", terms: [["HP:0001942", "Metabolic acidosis"], ["HP:0011968", "Feeding difficulties"]], milestones: { hypotonia: 4, developmentalDelay: 6, plateau: 8, seizureOnset: 0, regression: 0, imagingChange: 0 }, days: 30, completeness: 41 },
  { id: "ODY-104", owner: "doc-a", ageGroup: "Child · 5y", sex: "Female", cluster: "Neurological", status: "Unresolved", headline: "Progressive spastic paraparesis, normal metabolic screen", terms: [["HP:0002061", "Lower limb spasticity"], ["HP:0001263", "Global developmental delay"]], milestones: { hypotonia: 12, developmentalDelay: 14, plateau: 24, seizureOnset: 0, regression: 30, imagingChange: 28 }, days: 210, completeness: 66 },
  { id: "ODY-117", owner: "doc-a", ageGroup: "Adolescent · 15y", sex: "Male", cluster: "Ophthalmic", status: "Unresolved", headline: "Bilateral optic atrophy with mild peripheral neuropathy", terms: [["HP:0000648", "Optic atrophy"], ["HP:0009830", "Peripheral neuropathy"]], milestones: { hypotonia: 0, developmentalDelay: 0, plateau: 0, seizureOnset: 0, regression: 156, imagingChange: 150 }, days: 260, completeness: 59 },
  { id: "ODY-128", owner: "doc-a", ageGroup: "Child · 2y", sex: "Male", cluster: "Neurological", status: "Unresolved", headline: "Hypotonia and global delay, exome reanalysis pending", terms: [["HP:0001252", "Hypotonia"], ["HP:0001263", "Global developmental delay"]], milestones: { hypotonia: 4, developmentalDelay: 9, plateau: 15, seizureOnset: 0, regression: 0, imagingChange: 0 }, days: 55, completeness: 52 },
  { id: "ODY-136", owner: "doc-a", ageGroup: "Infant · 11m", sex: "Female", cluster: "Cardiac", status: "Unresolved", headline: "Infantile cardiomyopathy with lactic acidosis", terms: [["HP:0001639", "Hypertrophic cardiomyopathy"], ["HP:0002151", "Increased serum lactate"]], milestones: { hypotonia: 5, developmentalDelay: 8, plateau: 10, seizureOnset: 0, regression: 0, imagingChange: 9 }, days: 65, completeness: 63 },
  { id: "ODY-149", owner: "doc-a", ageGroup: "Child · 8y", sex: "Male", cluster: "Dermatologic", status: "Unresolved", headline: "Progressive poikiloderma with growth restriction", terms: [["HP:0001029", "Poikiloderma"], ["HP:0001510", "Growth delay"]], milestones: { hypotonia: 0, developmentalDelay: 0, plateau: 0, seizureOnset: 0, regression: 0, imagingChange: 0 }, days: 180, completeness: 44 },
  { id: "ODY-318", owner: "doc-b", ageGroup: "Child · 5y", sex: "Female", cluster: "Neurological", status: "Unresolved", headline: "Developmental regression with normal imaging", terms: [["HP:0002376", "Developmental regression"], ["HP:0001263", "Global developmental delay"], ["HP:0001250", "Seizure"]], milestones: { hypotonia: 9, developmentalDelay: 13, plateau: 18, seizureOnset: 22, regression: 24, imagingChange: 0 }, days: 140, completeness: 61 },
  { id: "ODY-556", owner: "doc-b", ageGroup: "Child · 6y", sex: "Male", cluster: "Neurological", status: "Under review", headline: "Encephalopathy with normal lactate and unremarkable MRI", terms: [["HP:0001263", "Global developmental delay"], ["HP:0001252", "Hypotonia"], ["HP:0002376", "Developmental regression"]], milestones: { hypotonia: 8, developmentalDelay: 12, plateau: 16, seizureOnset: 20, regression: 22, imagingChange: 26 }, days: 190, completeness: 57 },
  { id: "ODY-904", owner: "doc-b", ageGroup: "Adolescent · 12y", sex: "Female", cluster: "Neurological", status: "Unresolved", headline: "Later-onset ataxia with overlapping mitochondrial findings", terms: [["HP:0002066", "Gait ataxia"], ["HP:0002151", "Increased serum lactate"]], milestones: { hypotonia: 40, developmentalDelay: 48, plateau: 60, seizureOnset: 0, regression: 72, imagingChange: 70 }, days: 240, completeness: 53 },
];

export function buildSeedState(): AppState {
  const all: CaseRecord[] = [caseKZ, caseDE, ...fillers.map(filler)];
  const cases: Record<string, CaseRecord> = {};
  all.forEach((c) => { cases[c.id] = c; });
  return {
    version: 1,
    currentDoctorId: null,
    doctors,
    cases,
    caseOrder: all.map((c) => c.id),
    matches: {},
    collaborations: {},
    contributions: [],
    notifications: [],
    audit: [
      { id: "aud-seed", actorId: "system", action: "session.started", subject: "ODYSSEY", detail: "Demonstration environment seeded with synthetic records", at: DEMO_NOW - 1 * DAY },
    ],
    searched: [],
    clock: DEMO_NOW,
  };
}

export const SEED_CASE_A = caseKZ.id;
export const SEED_CASE_B = caseDE.id;
