/**
 * Builds the side-by-side comparison from two case records.
 * Pure and deterministic — the same pair always produces the same table.
 */
import type { CaseRecord } from "@/store/types";

export type Agreement = "shared" | "partial" | "differs" | "only-a" | "only-b";

export type CompareRow = { label: string; a: string; b: string; agreement: Agreement };
export type CompareGroup = { group: string; rows: CompareRow[] };

const MISSING = "Not recorded";

function unionRows<T>(
  as: T[], bs: T[],
  key: (t: T) => string,
  label: (t: T) => string,
  value: (t: T) => string,
  equal: (x: T, y: T) => boolean = (x, y) => value(x) === value(y),
): CompareRow[] {
  const ma = new Map(as.map((x) => [key(x), x] as const));
  const mb = new Map(bs.map((x) => [key(x), x] as const));
  const keys = [...new Set([...ma.keys(), ...mb.keys()])];
  return keys.map((k) => {
    const x = ma.get(k), y = mb.get(k);
    if (x && y) return { label: label(x), a: value(x), b: value(y), agreement: equal(x, y) ? "shared" : "partial" };
    if (x) return { label: label(x), a: value(x), b: MISSING, agreement: "only-a" };
    return { label: label(y!), a: MISSING, b: value(y!), agreement: "only-b" };
  });
}

const MILESTONE_LABEL: Record<string, string> = {
  hypotonia: "Hypotonia",
  developmentalDelay: "Developmental delay",
  plateau: "Developmental plateau",
  seizureOnset: "Seizure onset",
  regression: "Regression",
  imagingChange: "Imaging change",
};

export function buildComparison(a: CaseRecord, b: CaseRecord): CompareGroup[] {
  const months = (n: number) => (n > 0 ? `${n} months` : MISSING);

  const identity: CompareRow[] = [
    { label: "Case", a: a.id, b: b.id, agreement: "differs" },
    { label: "Country", a: a.country, b: b.country, agreement: a.country === b.country ? "shared" : "differs" },
    { label: "Age group", a: a.ageGroup, b: b.ageGroup, agreement: a.ageGroup === b.ageGroup ? "shared" : "partial" },
    { label: "Sex", a: a.sex, b: b.sex, agreement: a.sex === b.sex ? "shared" : "differs" },
    { label: "Phenotype cluster", a: a.phenotypeCluster, b: b.phenotypeCluster, agreement: a.phenotypeCluster === b.phenotypeCluster ? "shared" : "differs" },
    { label: "Status", a: a.status, b: b.status, agreement: a.status === b.status ? "shared" : "partial" },
  ];

  const phenotype = unionRows(
    a.phenotypes.filter((p) => p.verification !== "rejected"),
    b.phenotypes.filter((p) => p.verification !== "rejected"),
    (p) => p.hpo,
    (p) => p.term,
    (p) => `${p.status}${p.status === "Present" ? ` · ${p.severity.toLowerCase()}` : ""}${p.onset !== "—" ? ` · ${p.onset}` : ""}`,
    (x, y) => x.status === y.status && x.severity === y.severity,
  );

  const timeline = Object.keys(MILESTONE_LABEL).map<CompareRow>((k) => {
    const av = a.milestones[k] ?? 0, bv = b.milestones[k] ?? 0;
    const agreement: Agreement =
      av > 0 && bv > 0 ? (Math.abs(av - bv) <= 2 ? "shared" : "partial")
      : av > 0 ? "only-a" : bv > 0 ? "only-b" : "differs";
    return { label: MILESTONE_LABEL[k], a: months(av), b: months(bv), agreement };
  }).filter((r) => !(r.a === MISSING && r.b === MISSING));

  const genetics = unionRows(
    a.genetics, b.genetics,
    (g) => `${g.gene}|${g.variant}`,
    (g) => (g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`),
    (g) => `${g.classification}${g.zygosity !== "—" ? ` · ${g.zygosity}` : ""}`,
  );

  const laboratory = unionRows(
    a.labs, b.labs,
    (l) => `${l.analyte}|${l.matrix}`,
    (l) => `${l.analyte} (${l.matrix.toLowerCase()})`,
    (l) => `${l.value}${l.unit !== "—" ? ` ${l.unit}` : ""}${l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}`,
    (x, y) => x.flag === y.flag,
  );

  const family: CompareRow[] = [
    { label: "Consanguinity", a: a.family.consanguinityNote, b: b.family.consanguinityNote, agreement: a.family.consanguinity === b.family.consanguinity ? "shared" : "differs" },
    { label: "Pedigree", a: a.family.pedigree, b: b.family.pedigree, agreement: "partial" },
    { label: "Siblings", a: a.family.siblings, b: b.family.siblings, agreement: "partial" },
    { label: "Regional ancestry", a: a.family.regionalAncestry, b: b.family.regionalAncestry, agreement: a.family.regionalAncestry !== "—" && b.family.regionalAncestry !== "—" ? "partial" : "differs" },
  ];

  const treatment = unionRows(
    a.treatments, b.treatments,
    (t) => t.intervention.toLowerCase(),
    (t) => t.intervention,
    (t) => t.response,
    (x, y) => x.tone === y.tone,
  );

  const imaging = unionRows(
    a.imaging.flatMap((i) => i.features.map((f) => ({ f, finding: i.finding }))),
    b.imaging.flatMap((i) => i.features.map((f) => ({ f, finding: i.finding }))),
    (x) => x.f,
    (x) => x.f.replace(/-/g, " ").replace(/^\w/, (m) => m.toUpperCase()),
    (x) => x.finding,
    () => true,
  );

  const negative = unionRows(
    a.negativeEvidence.map((s) => ({ s })),
    b.negativeEvidence.map((s) => ({ s })),
    (x) => x.s.replace(/[^a-z]/gi, "").slice(0, 14).toLowerCase(),
    (x) => x.s.replace(/^No /, "").replace(/^Normal /, "").replace(/^Expanded /, ""),
    () => "Excluded",
  );

  return [
    { group: "Identity", rows: identity },
    { group: "Phenotype", rows: phenotype },
    { group: "Clinical timeline", rows: timeline },
    { group: "Genetics", rows: genetics },
    { group: "Laboratory", rows: laboratory },
    { group: "Imaging", rows: imaging },
    { group: "Family history", rows: family },
    { group: "Treatment response", rows: treatment },
    { group: "Negative evidence", rows: negative },
  ].filter((g) => g.rows.length > 0);
}

export function summarise(groups: CompareGroup[]) {
  const rows = groups.flatMap((g) => g.rows);
  return {
    shared: rows.filter((r) => r.agreement === "shared").length,
    partial: rows.filter((r) => r.agreement === "partial").length,
    differs: rows.filter((r) => r.agreement === "differs").length,
    onlyA: rows.filter((r) => r.agreement === "only-a").length,
    onlyB: rows.filter((r) => r.agreement === "only-b").length,
    total: rows.length,
  };
}

export const AGREEMENT_LABEL: Record<Agreement, string> = {
  shared: "Shared",
  partial: "Partial",
  differs: "Differs",
  "only-a": "Only A",
  "only-b": "Only B",
};
