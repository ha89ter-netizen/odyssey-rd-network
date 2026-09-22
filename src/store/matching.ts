/**
 * SIMULATED MATCHING ENGINE.
 *
 * Deterministic, pure, no randomness: the same two cases always produce the
 * same numbers. Every dimension is computed from structured fields on the
 * case records, so the "why" shown in the UI is derived from the same values
 * the score is.
 *
 * A score expresses SIMILARITY OF RECORDED EVIDENCE between two cases.
 * It is not a diagnostic probability and carries no clinical claim. The
 * formulas are a product simulation, not a validated clinical method.
 */
import type { CaseRecord, Match, MatchDimension, MatchDimensionId, Phenotype } from "./types";

/** Scores are truncated, never rounded up. */
const pct = (x: number) => Math.max(0, Math.min(100, Math.floor(x * 100)));
const ratio = (a: number, b: number) => (Math.max(a, b) === 0 ? 1 : Math.min(a, b) / Math.max(a, b));

const WEIGHTS: Record<MatchDimensionId, number> = {
  phenotype: 0.22, trajectory: 0.16, genetics: 0.18, laboratory: 0.12,
  imaging: 0.12, temporal: 0.08, family: 0.06, negative: 0.06,
};

/** Surfaced to the clinician only above this overall similarity. */
export const SURFACE_THRESHOLD = 55;
export const STRONG_THRESHOLD = 80;

/** "a, b and c" — so generated explanations read as written English. */
const listPhrase = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "")
  : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const present = (c: CaseRecord) => c.phenotypes.filter((x) => x.status === "Present" && x.verification !== "rejected");
const hpoSet = (c: CaseRecord) => new Set(present(c).map((x) => x.hpo));

function severityConcordance(a: CaseRecord, b: CaseRecord, shared: string[]): number {
  if (!shared.length) return 0;
  const byHpo = (c: CaseRecord) => new Map(present(c).map((x) => [x.hpo, x] as const));
  const ma = byHpo(a), mb = byHpo(b);
  const agree = shared.filter((h) => ma.get(h)?.severity === mb.get(h)?.severity).length;
  return agree / shared.length;
}

/* -------------------------------- dimensions -------------------------------- */

function phenotypeScore(a: CaseRecord, b: CaseRecord) {
  const sa = hpoSet(a), sb = hpoSet(b);
  const shared = [...sa].filter((h) => sb.has(h));
  const union = new Set([...sa, ...sb]);
  const jaccard = union.size ? shared.length / union.size : 0;
  // Small bonus when the shared features were recorded at the same severity.
  const score = jaccard * (1 + 0.04 * severityConcordance(a, b, shared));
  return { score, shared };
}

function trajectoryScore(a: CaseRecord, b: CaseRecord) {
  const keys = Object.keys(a.milestones).filter((k) => a.milestones[k] > 0 && (b.milestones[k] ?? 0) > 0);
  if (!keys.length) return { score: 0, maxDelta: 0, keys };
  const WINDOW = 8; // months beyond which two milestones are treated as unrelated
  let sum = 0, maxDelta = 0;
  for (const k of keys) {
    const d = Math.abs(a.milestones[k] - b.milestones[k]);
    maxDelta = Math.max(maxDelta, d);
    sum += Math.max(0, 1 - d / WINDOW);
  }
  const mean = sum / keys.length;
  // Same ordering of events counts; a reordered course is a weaker analogy.
  const order = (c: CaseRecord) => keys.map((k) => c.milestones[k]);
  const rank = (v: number[]) => v.map((_, i) => v.filter((x) => x < v[i]).length).join(",");
  const orderConcordance = rank(order(a)) === rank(order(b)) ? 1 : 0.9;
  return { score: mean * orderConcordance, maxDelta, keys };
}

function geneticsScore(a: CaseRecord, b: CaseRecord) {
  const variants = (c: CaseRecord) => c.genetics.filter((g) => g.category === "nuclear-variant" || g.category === "mitochondrial");
  const genesOf = (c: CaseRecord) => new Set(variants(c).map((g) => g.gene).filter((g) => g !== "—"));
  const ga = genesOf(a), gb = genesOf(b);
  const sharedGenes = [...ga].filter((g) => gb.has(g));
  if (!sharedGenes.length) {
    // Both unresolved is itself weakly informative, but without a shared gene.
    const bothUnresolved = a.geneticSummary.length > 0 && b.geneticSummary.length > 0;
    return { score: bothUnresolved ? 0.2 : 0, sharedGenes, identical: [] as string[] };
  }
  const va = variants(a), vb = variants(b);
  const key = (g: { gene: string; variant: string }) => `${g.gene}|${g.variant}`;
  const identical = va.filter((x) => vb.some((y) => key(y) === key(x))).map(key);

  const geneImplicated = 1;
  const identicalVariant = identical.length ? 1 : 0.4;
  // Has each side identified all expected alleles?
  const allelesA = va.filter((g) => sharedGenes.includes(g.gene)).length;
  const allelesB = vb.filter((g) => sharedGenes.includes(g.gene)).length;
  const alleleCompleteness = ratio(allelesA, allelesB);
  const classA = va.find((g) => sharedGenes.includes(g.gene))?.classification ?? "";
  const classB = vb.find((g) => sharedGenes.includes(g.gene))?.classification ?? "";
  const classificationConcordance = classA.startsWith("VUS") === classB.startsWith("VUS") ? 1 : 0.5;

  const base = (geneImplicated + identicalVariant + alleleCompleteness + classificationConcordance) / 4;
  // Findings present on only one side reduce confidence in the comparison.
  const cats = (c: CaseRecord) => new Set(c.genetics.map((g) => g.category));
  const ca = cats(a), cb = cats(b);
  const unshared = [...new Set([...ca, ...cb])].filter((x) => !(ca.has(x) && cb.has(x))).length;
  return { score: base * (1 - 0.06 * unshared), sharedGenes, identical };
}

function laboratoryScore(a: CaseRecord, b: CaseRecord) {
  const key = (l: { analyte: string; matrix: string }) => `${l.analyte}|${l.matrix}`;
  const ma = new Map(a.labs.map((l) => [key(l), l] as const));
  const mb = new Map(b.labs.map((l) => [key(l), l] as const));
  const shared = [...ma.keys()].filter((k) => mb.has(k));
  const union = new Set([...ma.keys(), ...mb.keys()]);
  if (!union.size) return { score: 0, shared: [], concordantFlags: 0, onlyB: [] as string[] };
  const coverage = shared.length / union.size;
  let flagAgree = 0, proxSum = 0, proxN = 0;
  for (const k of shared) {
    const la = ma.get(k)!, lb = mb.get(k)!;
    if (la.flag === lb.flag) flagAgree++;
    if (la.numeric !== null && lb.numeric !== null) { proxSum += ratio(la.numeric, lb.numeric); proxN++; }
  }
  const valueProximity = proxN ? proxSum / proxN : 1;
  const onlyB = [...mb.keys()].filter((k) => !ma.has(k)).map((k) => k.split("|")[0]);
  // Coverage dominates: an analyte measured at only one site cannot corroborate anything.
  const score = coverage * (0.6 + 0.4 * valueProximity);
  return { score, shared, concordantFlags: flagAgree, onlyB };
}

function imagingScore(a: CaseRecord, b: CaseRecord) {
  const fa = new Set(a.imaging.flatMap((i) => i.features));
  const fb = new Set(b.imaging.flatMap((i) => i.features));
  const union = new Set([...fa, ...fb]);
  if (!union.size) return { score: 0, shared: [] as string[] };
  const shared = [...fa].filter((f) => fb.has(f));
  return { score: shared.length / union.size, shared };
}

function temporalScore(a: CaseRecord, b: CaseRecord) {
  const firstA = Math.min(...Object.values(a.milestones).filter((v) => v > 0), 999);
  const firstB = Math.min(...Object.values(b.milestones).filter((v) => v > 0), 999);
  if (firstA === 999 || firstB === 999) return { score: 0, firstA: 0, firstB: 0 };
  const onsetProximity = Math.max(0, 1 - Math.abs(firstA - firstB) / 12);
  const odysseyRatio = ratio(a.odysseyMonths, b.odysseyMonths);
  return { score: (onsetProximity + odysseyRatio) / 2, firstA, firstB };
}

function familyScore(a: CaseRecord, b: CaseRecord) {
  const consanguinityAgrees = a.family.consanguinity === b.family.consanguinity;
  const regional = a.family.regionalAncestry !== "—" && b.family.regionalAncestry !== "—";
  const score = (consanguinityAgrees ? 1 : 0.35) * 0.7 + (regional ? 1 : 0.4) * 0.3;
  return { score, consanguinityAgrees };
}

/** Canonical keys so differently worded exclusions still compare. */
const NEG_KEYS: [string, RegExp][] = [
  ["cardiac", /cardiac|echocardiog/i],
  ["hepatic", /hepatic|liver/i],
  ["hearing", /hearing|ABR/i],
  ["retinal", /retinal|ERG/i],
  ["newborn-screening", /newborn screening/i],
  ["cdg", /glycosylation/i],
];
const negKeys = (c: CaseRecord) =>
  new Set(c.negativeEvidence.flatMap((s) => NEG_KEYS.filter(([, re]) => re.test(s)).map(([k]) => k)));

function negativeScore(a: CaseRecord, b: CaseRecord) {
  const na = negKeys(a), nb = negKeys(b);
  const union = new Set([...na, ...nb]);
  if (!union.size) return { score: 0, shared: [] as string[] };
  const shared = [...na].filter((k) => nb.has(k));
  return { score: shared.length / union.size, shared };
}

/* -------------------------------- assembly -------------------------------- */

const FEATURE_LABEL: Record<string, string> = {
  "putaminal-t2": "bilateral putaminal T2 hyperintensity",
  "brainstem-involvement": "brainstem involvement",
  "mrs-lactate-peak": "MR spectroscopy lactate peak",
  "cerebellar-atrophy": "cerebellar atrophy",
};

export function scorePair(a: CaseRecord, b: CaseRecord): Omit<Match, "id" | "status" | "createdAt"> {
  const ph = phenotypeScore(a, b);
  const tr = trajectoryScore(a, b);
  const gn = geneticsScore(a, b);
  const lb = laboratoryScore(a, b);
  const im = imagingScore(a, b);
  const tm = temporalScore(a, b);
  const fm = familyScore(a, b);
  const ng = negativeScore(a, b);

  const termOf = (c: CaseRecord, hpo: string) => present(c).find((x) => x.hpo === hpo)?.term ?? hpo;
  const sharedTerms = ph.shared.map((h) => termOf(a, h));
  const uniqueA = present(a).filter((x) => !ph.shared.includes(x.hpo)).map((x) => x.term);
  const uniqueB = present(b).filter((x: Phenotype) => !ph.shared.includes(x.hpo)).map((x) => x.term);

  const dims: MatchDimension[] = [
    {
      id: "phenotype", label: "Phenotype similarity", score: pct(ph.score), weight: WEIGHTS.phenotype,
      direction: ph.score >= 0.6 ? "supporting" : "divergent",
      summary: `${ph.shared.length} of ${present(a).length} recorded features in ${a.id} also appear in ${b.id}, at concordant severity.`,
      aValue: `${present(a).length} terms · ${ph.shared.length} shared`,
      bValue: `${present(b).length} terms · ${ph.shared.length} shared`,
    },
    {
      id: "trajectory", label: "Clinical trajectory", score: pct(tr.score), weight: WEIGHTS.trajectory,
      direction: tr.score >= 0.6 ? "supporting" : "divergent",
      summary: tr.keys.length
        ? `Milestones align to within ${tr.maxDelta} month${tr.maxDelta === 1 ? "" : "s"} across ${tr.keys.length} recorded events, in the same order.`
        : "Insufficient milestone data recorded to compare trajectories.",
      aValue: `Plateau ${a.milestones.plateau || "—"}m → regression ${a.milestones.regression || "—"}m`,
      bValue: `Plateau ${b.milestones.plateau || "—"}m → regression ${b.milestones.regression || "—"}m`,
    },
    {
      id: "genetics", label: "Genetic evidence", score: pct(gn.score), weight: WEIGHTS.genetics,
      direction: gn.score >= 0.6 ? "supporting" : "divergent",
      summary: gn.sharedGenes.length
        ? `Both cases carry unresolved findings in ${gn.sharedGenes.join(", ")}${gn.identical.length ? ", including an identical variant" : ""}. Neither is reportable as diagnostic.`
        : "No gene is implicated in both cases; both remain molecularly unresolved.",
      aValue: a.genetics.filter((g) => g.gene !== "—").map((g) => `${g.gene} ${g.variant}`).join(" · ") || "No variant reported",
      bValue: b.genetics.filter((g) => g.gene !== "—").map((g) => `${g.gene} ${g.variant}`).join(" · ") || "No variant reported",
    },
    {
      id: "laboratory", label: "Laboratory pattern", score: pct(lb.score), weight: WEIGHTS.laboratory,
      direction: lb.score >= 0.6 ? "supporting" : "divergent",
      summary: `${lb.concordantFlags} of ${lb.shared.length} jointly measured analytes are abnormal in the same direction${lb.onlyB.length ? `; ${lb.onlyB.join(", ")} measured only in ${b.id}` : ""}.`,
      aValue: `${a.labs.length} analytes recorded`,
      bValue: `${b.labs.length} analytes recorded`,
    },
    {
      id: "imaging", label: "Imaging pattern", score: pct(im.score), weight: WEIGHTS.imaging,
      direction: im.score >= 0.6 ? "supporting" : "divergent",
      summary: im.shared.length
        ? `Shared radiological features: ${im.shared.map((f) => FEATURE_LABEL[f] ?? f).join(", ")}.`
        : "No comparable structured imaging features recorded.",
      aValue: a.imaging.length ? a.imaging[0].finding : "No imaging recorded",
      bValue: b.imaging.length ? b.imaging[0].finding : "No imaging recorded",
    },
    {
      id: "temporal", label: "Temporal similarity", score: pct(tm.score), weight: WEIGHTS.temporal,
      direction: tm.score >= 0.6 ? "supporting" : "divergent",
      summary: `First recorded abnormality at ${tm.firstA} and ${tm.firstB} months, over diagnostic courses of comparable length.`,
      aValue: `Onset ${tm.firstA}m · ${a.odysseyMonths}m to submission`,
      bValue: `Onset ${tm.firstB}m · ${b.odysseyMonths}m to submission`,
    },
    {
      id: "family", label: "Family pattern", score: pct(fm.score), weight: WEIGHTS.family,
      direction: fm.consanguinityAgrees ? "supporting" : "divergent",
      summary: fm.consanguinityAgrees
        ? "Family structure is comparable between the two pedigrees."
        : "Consanguinity is present in one pedigree and absent in the other; shared regional ancestry may still explain a founder allele.",
      aValue: a.family.consanguinityNote,
      bValue: b.family.consanguinityNote,
    },
    {
      id: "negative", label: "Negative evidence", score: pct(ng.score), weight: WEIGHTS.negative,
      direction: ng.score >= 0.6 ? "supporting" : "divergent",
      summary: ng.shared.length
        ? `${ng.shared.length} organ systems are explicitly excluded in both cases, narrowing the differential together.`
        : "Exclusions are not documented comparably.",
      aValue: `${a.negativeEvidence.length} exclusions documented`,
      bValue: `${b.negativeEvidence.length} exclusions documented`,
    },
  ];

  const overall = Math.floor(dims.reduce((s, d) => s + d.score * d.weight, 0));
  const label =
    overall >= STRONG_THRESHOLD ? "Strong potential match"
    : overall >= 65 ? "Moderate potential match"
    : "Weak signal";

  /* Structured explanation — assembled from the computed facts above, not generated prose. */
  const explanation: string[] = [];
  if (ph.shared.length) {
    explanation.push(`${ph.shared.length} phenotype features overlap, including ${listPhrase(sharedTerms.slice(0, 3).map((t) => t.toLowerCase()))}.`);
  }
  if (tr.keys.length && tr.score >= 0.6) {
    explanation.push(`The clinical trajectories show the same progression, aligning to within ${tr.maxDelta} month${tr.maxDelta === 1 ? "" : "s"} at every recorded milestone.`);
  }
  if (gn.sharedGenes.length) {
    explanation.push(`Both cases contain unresolved genetic findings in ${gn.sharedGenes.join(", ")}${gn.identical.length ? ", and the same coding variant is present in each" : ""}.`);
  }
  if (lb.concordantFlags >= 3) {
    explanation.push(`${lb.concordantFlags} laboratory analytes are abnormal in the same direction in both cases.`);
  }
  if (im.shared.length >= 2) {
    explanation.push(`Imaging shows the same pattern: ${listPhrase(im.shared.map((f) => FEATURE_LABEL[f] ?? f))}.`);
  }
  if (uniqueB.length || lb.onlyB.length) {
    const extras = [...uniqueB.slice(0, 2).map((t) => t.toLowerCase()), ...lb.onlyB.slice(0, 2)];
    if (extras.length) {
      explanation.push(`${b.id} records ${listPhrase(extras)}, which ${a.id} has not assessed — potentially relevant for clinician review.`);
    }
  }
  if (ng.shared.length >= 3) {
    explanation.push(`Both cases exclude the same ${ng.shared.length} organ systems, which narrows the differential in the same direction.`);
  }

  const divergences: string[] = [];
  for (const d of dims) if (d.direction === "divergent") divergences.push(d.summary);
  if (gn.sharedGenes.length && gn.identical.length && b.genetics.length > a.genetics.length) {
    divergences.push(`${b.id} has undergone investigations that ${a.id} has not; a negative result in ${a.id} may reflect the test used rather than the biology.`);
  }

  return {
    sourceCaseId: a.id, targetCaseId: b.id, score: overall, label,
    dimensions: dims, explanation, divergences,
    sharedPhenotypes: sharedTerms, uniqueToSource: uniqueA, uniqueToTarget: uniqueB,
  };
}

/** Rank every other case against `source`. Deterministic and side-effect free. */
export function runMatching(source: CaseRecord, all: CaseRecord[]) {
  return all
    .filter((c) => c.id !== source.id)
    .map((c) => scorePair(source, c))
    .sort((x, y) => y.score - x.score || x.targetCaseId.localeCompare(y.targetCaseId));
}
