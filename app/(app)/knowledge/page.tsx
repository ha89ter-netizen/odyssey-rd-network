"use client";

import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer, Metric, Banner, absTime } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";

export default function KnowledgePage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
  const contributions = state.contributions;
  const verifiedMatches = Object.values(state.matches).filter((m) => m.status === "verified");
  const corroborated = Object.values(state.cases).filter((c) => c.status === "Clinically Corroborated").length;

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">{t("kn.eyebrow")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("kn.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("kn.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric label={t("kn.mContributions")} value={contributions.length} tone="teal" detail={t("kn.mContributionsD")} />
        <Metric label={t("kn.mConnections")} value={verifiedMatches.length} detail={t("kn.mConnectionsD")} />
        <Metric label={t("kn.mCases")} value={corroborated} detail={t("kn.mCasesD")} />
        <Metric label={t("kn.mClinicians")} value={new Set(contributions.flatMap((c) => c.contributors)).size} detail={t("kn.mCliniciansD")} />
      </div>

      {contributions.length === 0 ? (
        <div className="og-sec">
          <Panel glass>
            <Empty
              title={t("kn.none")}
              body={t("kn.noneBody")}
              icon="◆"
              action={<Link href="/matches"><Button>{t("kn.reviewMatches")}</Button></Link>}
            />
          </Panel>
        </div>
      ) : (
        <>
          <div className="og-sec">
            <SectionHead label={t("kn.compoundsTitle")} note={t("kn.compoundsNote")} />
            <Panel glass>
              <div className="og-row" style={{ justifyContent: "center", gap: 0, flexWrap: "wrap", padding: "10px 0" }}>
                {[
                  { t: contributions[0].caseIds[0], s: t("kn.nodeUnresolved") },
                  { t: "+", s: "" },
                  { t: contributions[0].caseIds[1], s: t("kn.nodeNetwork") },
                  { t: "↓", s: "" },
                  { t: t("kn.nodePattern"), s: t("kn.evidenceSignals", { n: contributions[0].caseIds.length ? Number(contributions[0].evidence.match(/\d+/)?.[0] ?? 0) : 0 }) },
                  { t: "↓", s: "" },
                  { t: t("kn.nodeKnowledge"), s: t("kn.nodeKnowledgeD") },
                ].map((n, i) => (
                  n.t === "+" || n.t === "↓" ? (
                    <span key={i} className="og-num ody-fadein" style={{ fontSize: 20, color: "var(--ink-4)", padding: "0 18px", "--d": `${i * 90}ms` } as React.CSSProperties}>
                      {n.t === "↓" ? "→" : n.t}
                    </span>
                  ) : (
                    <div key={i} className="og-flat ody-rise" style={{ padding: "14px 18px", minWidth: 150, textAlign: "center", "--d": `${i * 90}ms` } as React.CSSProperties}>
                      <div className="og-mono" style={{ fontSize: 13, fontWeight: 700, color: i >= 4 ? "var(--teal-deep)" : "var(--ink)" }}>{n.t}</div>
                      {n.s && <div className="og-small" style={{ marginTop: 5 }}>{n.s}</div>}
                    </div>
                  )
                ))}
              </div>
              <p className="og-small" style={{ textAlign: "center", marginTop: 14, maxWidth: "64ch", marginInline: "auto" }}>
                {t("kn.compoundsDisclaimer")}
              </p>
            </Panel>
          </div>

          <div className="og-sec">
            <SectionHead label={t("kn.contributions")} note={t("kn.recorded", { n: contributions.length })} />
            <div className="og-stack">
              {contributions.map((c) => (
                <Panel key={c.id} title={t("kn.title1")} action={<Pill tone="teal">✓ {t("match.status.verified")}</Pill>}>
                  <div className="og-grid" data-cols="side">
                    <div>
                      <dl className="og-kv">
                        <dt>{t("kn.fCases")}</dt>
                        <dd>
                          {c.caseIds.map((cid, i) => (
                            <span key={cid}>
                              <Link href={`/cases/${cid}`} className="og-link og-mono">{cid}</Link>
                              {i < c.caseIds.length - 1 && <span style={{ color: "var(--ink-4)" }}> ↔ </span>}
                            </span>
                          ))}
                        </dd>
                        <dt>{t("kn.fContributors")}</dt><dd>{c.contributors.map((n) => C(n)).join(" · ")}</dd>
                        <dt>{t("kn.fEvidence")}</dt><dd>{t("kn.evidenceSignals", { n: Number(c.evidence.match(/\d+/)?.[0] ?? 0) })}</dd>
                        <dt>{t("kn.fRecorded")}</dt><dd className="og-mono">{absTime(c.createdAt)} <span className="og-small">({relTime(c.createdAt, state.clock)})</span></dd>
                      </dl>
                    </div>
                    <div>
                      <div className="og-eyebrow">{t("kn.established")}</div>
                      <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.75, color: "var(--ink-2)" }}>
                        <li style={{ marginBottom: 5 }}>{t("kn.detailShared", { n: Number(c.evidence.match(/\d+/)?.[0] ?? 0), a: c.caseIds[0], b: c.caseIds[1] })}</li>
                        {c.detail.slice(2).map((d, i) => <li key={i} style={{ marginBottom: 5 }}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="og-sec">
        <Banner tone="amber">
          <b>{t("kn.notDiagnosed")}</b> {t("kn.notDiagnosedBody")}
        </Banner>
      </div>
    </>
  );
}
