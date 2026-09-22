"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, Empty, Banner, Disclaimer, SectionHead, Metric } from "@/ui/primitives";
import { TrajectoryChart, Pedigree } from "@/components/kit";
import { buildComparison, summarise, AGREEMENT_KEY, type Agreement } from "@/lib/compare";
import { useI18n } from "@/i18n/i18n";

const TONE: Record<Agreement, "teal" | "amber" | "ice" | "coral" | undefined> = {
  shared: "teal", partial: undefined, differs: "amber", "only-a": "ice", "only-b": "ice",
};

export default function ComparePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const { t, C, CList } = useI18n();
  const [onlyDifferences, setOnlyDifferences] = React.useState(false);

  const m = state.matches[id];
  if (!m) return <Empty title={t("md.notFound")} body={t("md.notFoundBody")} action={<Link href="/matches"><Button>{t("md.allMatches")}</Button></Link>} />;

  const a = state.cases[m.sourceCaseId];
  const b = state.cases[m.targetCaseId];
  const groups = buildComparison(a, b, { t, C });
  const sum = summarise(groups);

  const milestoneKeys = ["hypotonia", "developmentalDelay", "plateau", "seizureOnset", "regression", "imagingChange"];
  const labels = milestoneKeys.map((k) => t(`ms.${k}` as "ms.hypotonia"));
  const av = milestoneKeys.map((k) => a.milestones[k] ?? 0);
  const bv = milestoneKeys.map((k) => b.milestones[k] ?? 0);
  const plottable = av.every((v) => v > 0) && bv.every((v) => v > 0);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/matches" className="og-small og-link">{t("nav.matches")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <Link href={`/matches/${m.id}`} className="og-small og-link">{a.id} ↔ {b.id}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">{t("cmp.breadcrumb")}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{C(a.country)} / {C(b.country)}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("cmp.lede")}
          </p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          <Link href={`/matches/${m.id}`}><Button variant="ghost">{t("cmp.backToMatch")}</Button></Link>
        </div>
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric label={t("cmp.mShared")} value={sum.shared} tone="teal" detail={t("cmp.mSharedD")} />
        <Metric label={t("cmp.mPartial")} value={sum.partial} detail={t("cmp.mPartialD")} />
        <Metric label={t("cmp.mOnly", { id: a.id })} value={sum.onlyA} detail={t("cmp.mOnlyAD")} />
        <Metric label={t("cmp.mOnly", { id: b.id })} value={sum.onlyB} tone="amber" detail={t("cmp.mOnlyBD")} />
      </div>

      <div className="og-sec og-grid" data-cols="auto">
        <Panel title={t("cmp.trajectory")} meta={t("cmp.monthsFromBirth")}>
          {plottable ? (
            <>
              <div style={{ color: "var(--ink-4)", "--track-a": "var(--ink-2)", "--track-b": "var(--teal)" } as React.CSSProperties}>
                <TrajectoryChart milestones={labels} a={av} b={bv} max={24} labelA={a.id} labelB={b.id} height={140} rowLabels labelWidth={120} />
              </div>
              <div className="og-row" style={{ gap: 18, marginTop: 10 }}>
                <span className="og-small">● {a.id}</span>
                <span className="og-small" style={{ color: "var(--teal-deep)" }}>● {b.id}</span>
              </div>
            </>
          ) : (
            <p className="og-small" style={{ margin: 0 }}>{t("cmp.notPlottable")}</p>
          )}
        </Panel>

        <Panel title={t("cmp.overlap")}>
          <svg viewBox="0 0 160 92" style={{ width: "100%", maxWidth: 260 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.8" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--teal)" fillOpacity="0.14" stroke="var(--teal)" strokeWidth="0.8" />
            <text x="33" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--ink-2)">{m.uniqueToSource.length}</text>
            <text x="80" y="52" textAnchor="middle" fontSize="19" fontFamily="var(--font-data)" fill="var(--ink)">{m.sharedPhenotypes.length}</text>
            <text x="127" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--teal-deep)">{m.uniqueToTarget.length}</text>
          </svg>
          <p className="og-small" style={{ marginTop: 10 }}>
            {t("cmp.sharedTerms", { n: m.sharedPhenotypes.length, list: CList(m.sharedPhenotypes.slice(0, 4)).toLowerCase() })}
            {m.sharedPhenotypes.length > 4 ? "…" : ""}
          </p>
        </Panel>

        <Panel title={t("cmp.familyPattern")}>
          <div className="og-row" style={{ gap: 12, alignItems: "flex-start" }}>
            <div>
              <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous={a.family.consanguinity} affected={a.family.consanguinity ? [0, 2] : [1]} size={140} /></div>
              <div className="og-small" style={{ textAlign: "center" }}>{a.id}</div>
            </div>
            <div>
              <div style={{ color: "var(--teal)" }}><Pedigree consanguineous={b.family.consanguinity} affected={b.family.consanguinity ? [0, 2] : [1]} size={140} /></div>
              <div className="og-small" style={{ textAlign: "center" }}>{b.id}</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="og-sec">
        <SectionHead
          label={t("cmp.signalBySignal")}
          note={t("cmp.rowsGroups", { rows: sum.total, groups: groups.length })}
          action={
            <label className="og-check">
              <input type="checkbox" checked={onlyDifferences} onChange={(e) => setOnlyDifferences(e.target.checked)} />
              {t("cmp.diffOnly")}
            </label>
          }
        />
        <Panel padded={false}>
          <div className="og-cmprow" style={{ background: "rgba(255,255,255,0.55)", borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)" }}>
            <span>{t("cmp.colSignal")}</span>
            <span>{a.id} · {a.countryCode}</span>
            <span style={{ color: "var(--teal-deep)" }}>{b.id} · {b.countryCode}</span>
            <span style={{ textAlign: "right" }}>{t("cmp.colAgreement")}</span>
          </div>
          {groups.map((g) => {
            const rows = onlyDifferences ? g.rows.filter((r) => r.agreement !== "shared") : g.rows;
            if (!rows.length) return null;
            return (
              <div key={g.group}>
                <div style={{ padding: "13px 16px 7px", borderBottom: "1px solid var(--line)" }}>
                  <span className="og-eyebrow">{g.group}</span>
                </div>
                {rows.map((r, i) => (
                  <div key={g.group + r.label + i} className="og-cmprow ody-fadein" style={{ "--d": `${i * 18}ms` } as React.CSSProperties}>
                    <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                    <span style={{ color: r.a === t("common.notRecorded") ? "var(--ink-4)" : undefined }}>{r.a}</span>
                    <span style={{ color: r.b === t("common.notRecorded") ? "var(--ink-4)" : r.agreement === "only-b" ? "var(--teal-deep)" : undefined }}>{r.b}</span>
                    <span style={{ textAlign: "right" }}>
                      <Pill tone={TONE[r.agreement]} style={{ height: 19, fontSize: 9 }}>
                        {r.agreement === "only-a" ? t("agree.only", { id: a.id }) : r.agreement === "only-b" ? t("agree.only", { id: b.id }) : t(AGREEMENT_KEY[r.agreement])}
                      </Pill>
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </Panel>
      </div>

      <div className="og-sec og-between">
        <Banner>
          <b>{t("cmp.reviewBanner")}</b> {t("cmp.reviewBody")}
        </Banner>
      </div>

      <div className="og-sec og-row" style={{ justifyContent: "flex-end" }}>
        <Link href={`/matches/${m.id}`}><Button>{t("cmp.backToEvidence")}</Button></Link>
      </div>
    </>
  );
}
