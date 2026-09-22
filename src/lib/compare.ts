/**
 * Builds the side-by-side comparison from two case records.
 * Pure and deterministic — the same pair always produces the same table.
 */
import type { CaseRecord } from "@/store/types";
import type { DictKey } from "@/i18n/dict";

/** The comparison composes sentences, so it needs the caller's translator. */
export type Tr = {
  t: (key: DictKey, params?: Record<string, string | number>) => string;
  C: (value: string) => string;
};

export type Agreement = "shared" | "partial" | "differs" | "only-a" | "only-b";

export type CompareRow = { label: string; a: string; b: string; agreement: Agreement };
export type CompareGroup = { group: string; rows: CompareRow[] };

const MILESTONE_KEY: Record<string, DictKey> = {
  hypotonia: "ms.hypotonia",
  developmentalDelay: "ms.developmentalDelay",
  plateau: "ms.plateau",
  seizureOnset: "ms.seizureOnset",
  regression: "ms.regression",
  imagingChange: "ms.imagingChange",
};

function unionRows<T>(
  missing: string,
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
    if (x) return { label: label(x), a: value(x), b: missing, agreement: "only-a" };
    return { label: label(y!), a: missing, b: value(y!), agreement: "only-b" };
  });
}

export function buildComparison(a: CaseRecord, b: CaseRecord, tr: Tr): CompareGroup[] {
  const MISSING = tr.t("common.notRecorded");
  const months = (n: number) => (n > 0 ? tr.t("common.months", { n }) : MISSING);

  const identity: CompareRow[] = [
    { label: tr.t("row.Case"), a: a.id, b: b.id, agreement: "differs" },
    { label: tr.t("row.Country"), a: tr.C(a.country), b: tr.C(b.country), agreement: a.country === b.country ? "shared" : "differs" },
    { label: tr.t("row.Age group"), a: tr.C(a.ageGroup), b: tr.C(b.ageGroup), agreement: a.ageGroup === b.ageGroup ? "shared" : "partial" },
    { label: tr.t("row.Sex"), a: tr.C(a.sex), b: tr.C(b.sex), agreement: a.sex === b.sex ? "shared" : "differs" },
    { label: tr.t("row.Phenotype cluster"), a: tr.C(a.phenotypeCluster), b: tr.C(b.phenotypeCluster), agreement: a.phenotypeCluster === b.phenotypeCluster ? "shared" : "differs" },
    { label: tr.t("row.Status"), a: tr.t(`status.${a.status}` as DictKey), b: tr.t(`status.${b.status}` as DictKey), agreement: a.status === b.status ? "shared" : "partial" },
  ];

  const phenotype = unionRows(
    MISSING,
    a.phenotypes.filter((p) => p.verification !== "rejected"),
    b.phenotypes.filter((p) => p.verification !== "rejected"),
    (p) => p.hpo,
    (p) => tr.C(p.term),
    (p) => `${tr.t(`status.${p.status}` as DictKey)}${p.status === "Present" ? ` · ${tr.t(`status.${p.severity}` as DictKey).toLowerCase()}` : ""}${p.onset !== "—" ? ` · ${tr.C(p.onset)}` : ""}`,
    (x, y) => x.status === y.status && x.severity === y.severity,
  );

  const timeline = Object.keys(MILESTONE_KEY).map<CompareRow>((k) => {
    const av = a.milestones[k] ?? 0, bv = b.milestones[k] ?? 0;
    const agreement: Agreement =
      av > 0 && bv > 0 ? (Math.abs(av - bv) <= 2 ? "shared" : "partial")
      : av > 0 ? "only-a" : bv > 0 ? "only-b" : "differs";
    return { label: tr.t(MILESTONE_KEY[k]), a: months(av), b: months(bv), agreement };
  }).filter((r) => !(r.a === MISSING && r.b === MISSING));

  const genetics = unionRows(
    MISSING,
    a.genetics, b.genetics,
    (g) => `${g.gene}|${g.variant}`,
    (g) => (g.gene === "—" ? tr.C(g.variant) : `${g.gene} ${g.variant}`),
    (g) => `${tr.C(g.classification)}${g.zygosity !== "—" ? ` · ${tr.C(g.zygosity)}` : ""}`,
  );

  const laboratory = unionRows(
    MISSING,
    a.labs, b.labs,
    (l) => `${l.analyte}|${l.matrix}`,
    (l) => `${tr.C(l.analyte)} (${tr.C(l.matrix).toLowerCase()})`,
    (l) => `${tr.C(l.value)}${l.unit !== "—" ? ` ${tr.C(l.unit)}` : ""}${l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}`,
    (x, y) => x.flag === y.flag,
  );

  const family: CompareRow[] = [
    { label: tr.t("row.Consanguinity"), a: tr.C(a.family.consanguinityNote), b: tr.C(b.family.consanguinityNote), agreement: a.family.consanguinity === b.family.consanguinity ? "shared" : "differs" },
    { label: tr.t("row.Pedigree"), a: tr.C(a.family.pedigree), b: tr.C(b.family.pedigree), agreement: "partial" },
    { label: tr.t("row.Siblings"), a: tr.C(a.family.siblings), b: tr.C(b.family.siblings), agreement: "partial" },
    { label: tr.t("row.Regional ancestry"), a: tr.C(a.family.regionalAncestry), b: tr.C(b.family.regionalAncestry), agreement: a.family.regionalAncestry !== "—" && b.family.regionalAncestry !== "—" ? "partial" : "differs" },
  ];

  const treatment = unionRows(
    MISSING,
    a.treatments, b.treatments,
    (t) => t.intervention.toLowerCase(),
    (t) => tr.C(t.intervention),
    (t) => tr.C(t.response),
    (x, y) => x.tone === y.tone,
  );

  const imaging = unionRows(
    MISSING,
    a.imaging.flatMap((i) => i.features.map((f) => ({ f, finding: i.finding }))),
    b.imaging.flatMap((i) => i.features.map((f) => ({ f, finding: i.finding }))),
    (x) => x.f,
    (x) => tr.C(FEATURE_TEXT[x.f] ?? x.f),
    (x) => tr.C(x.finding),
    () => true,
  );

  const negative = unionRows(
    MISSING,
    a.negativeEvidence.map((s) => ({ s })),
    b.negativeEvidence.map((s) => ({ s })),
    (x) => x.s.replace(/[^a-z]/gi, "").slice(0, 14).toLowerCase(),
    (x) => tr.C(x.s),
    () => tr.t("row.excluded"),
  );

  return [
    { group: tr.t("grp.Identity"), rows: identity },
    { group: tr.t("grp.Phenotype"), rows: phenotype },
    { group: tr.t("grp.Clinical timeline"), rows: timeline },
    { group: tr.t("grp.Genetics"), rows: genetics },
    { group: tr.t("grp.Laboratory"), rows: laboratory },
    { group: tr.t("grp.Imaging"), rows: imaging },
    { group: tr.t("grp.Family history"), rows: family },
    { group: tr.t("grp.Treatment response"), rows: treatment },
    { group: tr.t("grp.Negative evidence"), rows: negative },
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

export const AGREEMENT_KEY: Record<Agreement, DictKey> = {
  shared: "agree.shared",
  partial: "agree.partial",
  differs: "agree.differs",
  "only-a": "agree.only",
  "only-b": "agree.only",
};

/** Imaging feature codes as English text, so the content dictionary can translate them. */
const FEATURE_TEXT: Record<string, string> = {
  "putaminal-t2": "bilateral putaminal T2 hyperintensity",
  "brainstem-involvement": "brainstem involvement",
  "mrs-lactate-peak": "MR spectroscopy lactate peak",
  "cerebellar-atrophy": "cerebellar atrophy",
};
