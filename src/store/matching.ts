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
import type { CaseRecord, Match, MatchDimension, MatchDimensionId, Phenotype, Phrase } from "./types";

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

/** Imaging features are codes; the reader sees them in their own language. */
const FEATURE_KEY: Record<string, string> = {
  "putaminal-t2": "bilateral putaminal T2 hyperintensity",
  "brainstem-involvement": "brainstem involvement",
  "mrs-lactate-peak": "MR spectroscopy lactate peak",
  "cerebellar-atrophy": "cerebellar atrophy",
};

/** The variants a case reports, as a phrase. */
function variantLabel(c: CaseRecord): Phrase {
  const list = c.genetics.filter((g) => g.gene !== "—").map((g) => `${g.gene} ${g.variant}`);
  return list.length ? { key: "raw", lists: { text: [list.join(" · ")] } } : { key: "val.noVariant" };
}

export function scorePair(a: CaseRecord, b: CaseRecord): Omit<Match, "id" | "status" | "createdAt"> {
  const ph_ = phenotypeScore(a, b);
  const tr = trajectoryScore(a, b);
  const gn = geneticsScore(a, b);
  const lb = laboratoryScore(a, b);
  const im = imagingScore(a, b);
  const tm = temporalScore(a, b);
  const fm = familyScore(a, b);
  const ng = negativeScore(a, b);

  const termOf = (c: CaseRecord, hpo: string) => present(c).find((x) => x.hpo === hpo)?.term ?? hpo;
  const sharedTerms = ph_.shared.map((h) => termOf(a, h));
  const uniqueA = present(a).filter((x) => !ph_.shared.includes(x.hpo)).map((x) => x.term);
  const uniqueB = present(b).filter((x: Phenotype) => !ph_.shared.includes(x.hpo)).map((x) => x.term);

  const ph = (key: string, params?: Record<string, string | number>, lists?: Record<string, string[]>, listsLower?: Record<string, string[]>) => ({ key, params, lists, listsLower });

  const dims: MatchDimension[] = [
    {
      id: "phenotype", labelKey: "dim.phenotype", score: pct(ph_.score), weight: WEIGHTS.phenotype,
      direction: ph_.score >= 0.6 ? "supporting" : "divergent",
      summary: ph("sum.phenotype", { shared: ph_.shared.length, total: present(a).length, a: a.id, b: b.id }),
      aValue: ph("val.terms", { n: present(a).length, shared: ph_.shared.length }),
      bValue: ph("val.terms", { n: present(b).length, shared: ph_.shared.length }),
    },
    {
      id: "trajectory", labelKey: "dim.trajectory", score: pct(tr.score), weight: WEIGHTS.trajectory,
      direction: tr.score >= 0.6 ? "supporting" : "divergent",
      summary: tr.keys.length
        ? ph("sum.trajectory", { d: tr.maxDelta, n: tr.keys.length })
        : ph("sum.trajectoryNone"),
      aValue: ph("val.plateau", { p: a.milestones.plateau || "—", r: a.milestones.regression || "—" }),
      bValue: ph("val.plateau", { p: b.milestones.plateau || "—", r: b.milestones.regression || "—" }),
    },
    {
      id: "genetics", labelKey: "dim.genetics", score: pct(gn.score), weight: WEIGHTS.genetics,
      direction: gn.score >= 0.6 ? "supporting" : "divergent",
      summary: gn.sharedGenes.length
        ? ph("sum.genetics", { genes: gn.sharedGenes.join(", "), identical: gn.identical.length ? "\u0000identical" : "" })
        : ph("sum.geneticsNone"),
      aValue: variantLabel(a),
      bValue: variantLabel(b),
    },
    {
      id: "laboratory", labelKey: "dim.laboratory", score: pct(lb.score), weight: WEIGHTS.laboratory,
      direction: lb.score >= 0.6 ? "supporting" : "divergent",
      summary: lb.onlyB.length
        ? ph("sum.laboratoryWithExtra", { agree: lb.concordantFlags, shared: lb.shared.length, b: b.id }, { list: lb.onlyB })
        : ph("sum.laboratory", { agree: lb.concordantFlags, shared: lb.shared.length }),
      aValue: ph("val.analytes", { n: a.labs.length }),
      bValue: ph("val.analytes", { n: b.labs.length }),
    },
    {
      id: "imaging", labelKey: "dim.imaging", score: pct(im.score), weight: WEIGHTS.imaging,
      direction: im.score >= 0.6 ? "supporting" : "divergent",
      summary: im.shared.length
        ? ph("sum.imaging", undefined, { list: im.shared.map((f) => FEATURE_KEY[f] ?? f) })
        : ph("sum.imagingNone"),
      aValue: a.imaging.length ? ph("raw", undefined, { text: [a.imaging[0].finding] }) : ph("val.noImaging"),
      bValue: b.imaging.length ? ph("raw", undefined, { text: [b.imaging[0].finding] }) : ph("val.noImaging"),
    },
    {
      id: "temporal", labelKey: "dim.temporal", score: pct(tm.score), weight: WEIGHTS.temporal,
      direction: tm.score >= 0.6 ? "supporting" : "divergent",
      summary: ph("sum.temporal", { a: tm.firstA, b: tm.firstB }),
      aValue: ph("val.onset", { o: tm.firstA, m: a.odysseyMonths }),
      bValue: ph("val.onset", { o: tm.firstB, m: b.odysseyMonths }),
    },
    {
      id: "family", labelKey: "dim.family", score: pct(fm.score), weight: WEIGHTS.family,
      direction: fm.consanguinityAgrees ? "supporting" : "divergent",
      summary: fm.consanguinityAgrees ? ph("sum.familySame") : ph("sum.familyDiffer"),
      aValue: ph("raw", undefined, { text: [a.family.consanguinityNote] }),
      bValue: ph("raw", undefined, { text: [b.family.consanguinityNote] }),
    },
    {
      id: "negative", labelKey: "dim.negative", score: pct(ng.score), weight: WEIGHTS.negative,
      direction: ng.score >= 0.6 ? "supporting" : "divergent",
      summary: ng.shared.length ? ph("sum.negative", { n: ng.shared.length }) : ph("sum.negativeNone"),
      aValue: ph("val.exclusions", { n: a.negativeEvidence.length }),
      bValue: ph("val.exclusions", { n: b.negativeEvidence.length }),
    },
  ];

  const overall = Math.floor(dims.reduce((s, d) => s + d.score * d.weight, 0));
  const labelKey =
    overall >= STRONG_THRESHOLD ? "match.label.strong"
    : overall >= 65 ? "match.label.moderate"
    : "match.label.weak";

  /* Structured explanation — assembled from the computed facts above, not generated prose. */
  const explanation: Phrase[] = [];
  if (ph_.shared.length) {
    explanation.push(ph("why.phenotype", { n: ph_.shared.length }, undefined, { list: sharedTerms.slice(0, 3) }));
  }
  if (tr.keys.length && tr.score >= 0.6) {
    explanation.push(ph("why.trajectory", { d: tr.maxDelta, n: tr.maxDelta }));
  }
  if (gn.sharedGenes.length) {
    explanation.push(ph("why.genetics", { genes: gn.sharedGenes.join(", "), identical: gn.identical.length ? "\u0000identical" : "" }));
  }
  if (lb.concordantFlags >= 3) {
    explanation.push(ph("why.laboratory", { n: lb.concordantFlags }));
  }
  if (im.shared.length >= 2) {
    explanation.push(ph("why.imaging", undefined, { list: im.shared.map((f) => FEATURE_KEY[f] ?? f) }));
  }
  const extras = [...uniqueB.slice(0, 2), ...lb.onlyB.slice(0, 2)];
  if (extras.length) {
    explanation.push(ph("why.extra", { a: a.id, b: b.id }, undefined, { list: extras }));
  }
  if (ng.shared.length >= 3) {
    explanation.push(ph("why.negative", { n: ng.shared.length }));
  }

  const divergences: Phrase[] = [];
  for (const d of dims) if (d.direction === "divergent") divergences.push(d.summary);
  if (gn.sharedGenes.length && gn.identical.length && b.genetics.length > a.genetics.length) {
    divergences.push(ph("div.investigations", { a: a.id, b: b.id }));
  }

  return {
    sourceCaseId: a.id, targetCaseId: b.id, score: overall, labelKey,
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
