"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, Banner, Disclaimer, SectionHead } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { FindMatches } from "@/components/FindMatches";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges } from "@/data/odyssey";
import { SURFACE_THRESHOLD } from "@/store/matching";

export default function CaseMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const { t, C, P } = useI18n();
  const relTime = useRelTime();
  const c = state.cases[id];

  if (!c) return <Empty title={t("case.notFound")} body={t("case.notFoundBody", { id })} action={<Link href="/cases"><Button>{t("case.backToCases")}</Button></Link>} />;

  const results = Object.values(state.matches)
    .filter((m) => m.sourceCaseId === c.id && m.status !== "dismissed")
    .sort((a, b) => b.score - a.score);
  const searched = state.searched.includes(c.id);
  const cohorts = Object.keys(state.cases).length;

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "64ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/cases" className="og-small og-link">{t("nav.cases")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <Link href={`/cases/${c.id}`} className="og-small og-link og-mono">{c.id}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">{t("case.breadcrumbSearch")}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("res.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("res.lede", { id: c.id, n: cohorts - 1, t: SURFACE_THRESHOLD })}
          </p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          <FindMatches record={c} label={t("res.rerun")} variant="ghost" />
        </div>
      </header>

      {!searched ? (
        <div className="og-sec">
          <Panel glass>
            <Empty
              title={t("res.notSearched")}
              body={t("res.notSearchedBody")}
              icon="◎"
              action={<FindMatches record={c} />}
            />
          </Panel>
        </div>
      ) : results.length === 0 ? (
        /* ------------------------- no-match state ------------------------- */
        <div className="og-sec og-grid" data-cols="side">
          <Panel glass>
            <div className="og-empty" style={{ paddingTop: 30 }}>
              <div className="og-empty-icon" style={{ background: "rgba(192,138,46,0.12)", color: "var(--amber)", fontSize: 20 }}>◌</div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{t("res.noMatch")}</div>
              <p className="og-small" style={{ maxWidth: "56ch", margin: "12px auto 0" }}>
                {t("res.noMatchBody")}
              </p>
              <p className="og-lede" style={{ maxWidth: "58ch", margin: "20px auto 0", fontSize: 14.5 }}>
                {t("res.noMatchStanding")}
              </p>
              <div className="og-row" style={{ justifyContent: "center", marginTop: 22 }}>
                <Link href={`/cases/${c.id}/verify`}><Button variant="ghost">{t("res.addEvidence")}</Button></Link>
                <FindMatches record={c} label={t("res.searchAgain")} variant="ghost" />
              </div>
            </div>
          </Panel>
          <div className="og-stack">
            <Panel title={t("res.improveOdds")}>
              <div className="og-stack">
                {c.completeness.filter((b) => b.value < 70).slice(0, 4).map((b) => (
                  <div key={b.label}>
                    <div className="og-between" style={{ fontSize: 12.5 }}>
                      <span>{C(b.label)}</span><span className="og-mono og-small">{b.value}%</span>
                    </div>
                    <ScoreBar value={b.value} />
                  </div>
                ))}
                {c.completeness.every((b) => b.value >= 70) && (
                  <p className="og-small" style={{ margin: 0 }}>{t("res.wellStructured")}</p>
                )}
              </div>
              <p className="og-small" style={{ marginTop: 14 }}>
                {t("res.completenessLever")}
              </p>
            </Panel>
            <Panel title={t("res.standingQuery")}>
              <p className="og-small" style={{ marginTop: 0 }}>
                {t("res.standingQueryBody", { id: c.id })}
              </p>
            </Panel>
          </div>
        </div>
      ) : (
        /* ------------------------- results ------------------------- */
        <>
          <div className="og-sec">
            <Banner>
              <b>{t("res.aboveThreshold", { n: results.length })}</b> {t("res.scoreNote")}
            </Banner>
          </div>

          {results[0] && (
            <div className="og-sec">
              <SectionHead label={t("res.topCandidate")} note={t("res.topCandidateNote")} />
              <Panel glass padded={false}>
                <div className="og-grid" data-cols="side" style={{ gap: 0 }}>
                  <div style={{ padding: "24px 26px" }}>
                    <div className="og-row" style={{ gap: 10 }}>
                      <Pill tone="teal">{t(results[0].labelKey as "match.label.strong")}</Pill>
                      <span className="og-small">{t("res.surfacedAgo", { t: relTime(results[0].createdAt, state.clock) })}</span>
                    </div>
                    <div className="og-row" style={{ gap: 18, marginTop: 18 }}>
                      <div>
                        <div className="og-num" style={{ fontSize: 28 }}>{c.id}</div>
                        <div className="og-small">{C(c.country)}</div>
                      </div>
                      <svg width="70" height="16" viewBox="0 0 70 16" fill="none" aria-hidden>
                        <path className="ody-drawin" style={{ "--dash": 60, "--d": "300ms" } as React.CSSProperties} d="M2 8h56" stroke="var(--teal)" strokeWidth="1.4" strokeDasharray="60" />
                        <path d="M55 4l5 4-5 4" stroke="var(--teal)" strokeWidth="1.4" fill="none" />
                      </svg>
                      <div>
                        <div className="og-num" style={{ fontSize: 28, color: "var(--teal-deep)" }}>{results[0].targetCaseId}</div>
                        <div className="og-small">{C(state.cases[results[0].targetCaseId]?.country ?? "")}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div className="og-num" style={{ fontSize: 40, color: "var(--teal-deep)" }}>{results[0].score}</div>
                        <div className="og-eyebrow">{t("res.evidenceSimilarity")}</div>
                      </div>
                    </div>
                    <p className="og-small" style={{ marginTop: 16 }}>{results[0].explanation[0] ? P(results[0].explanation[0]) : ""}</p>
                    <div className="og-row" style={{ marginTop: 20 }}>
                      <Link href={`/matches/${results[0].id}`}><Button>{t("res.whyMatch")}</Button></Link>
                      <Link href={`/matches/${results[0].id}/compare`}><Button variant="ghost">{t("res.compare")}</Button></Link>
                    </div>
                  </div>
                  <div style={{ padding: 20, borderLeft: "1px solid var(--line)" }}>
                    <WorldMap
                      nodes={networkNodes} edges={networkEdges}
                      highlight={["kz", "de"]} labels={["kz", "de"]}
                      crop="2 2 82 30" className="w-full" labelSize={1.7}
                    />
                    <p className="og-small" style={{ marginTop: 10 }}>
                      {t("res.noDataCrossed")}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          <div className="og-sec">
            <SectionHead label={t("res.allCandidates")} note={t("res.aboveThresholdShort", { n: results.length })} />
            <Panel padded={false}>
              {results.map((m) => {
                const tgt = state.cases[m.targetCaseId];
                return (
                  <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "100px 1fr 130px 120px 90px" }}>
                    <span className="og-mono" style={{ fontSize: 12.5, color: "var(--teal-deep)" }}>{m.targetCaseId}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 13 }}>{C(tgt?.headline ?? "")}</span>
                      <span className="og-small">{C(tgt?.country ?? "")} · {C(tgt?.institution ?? "")}</span>
                    </span>
                    <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : m.status === "requested" ? "amber" : undefined}>
                      {m.status === "surfaced" ? t(m.labelKey as "match.label.strong") : t(`match.status.${m.status}` as "match.status.accepted")}
                    </Pill>
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <ScoreBar value={m.score} />
                    </span>
                    <span className="og-num" style={{ fontSize: 20, textAlign: "right", color: "var(--teal-deep)" }}>{m.score}</span>
                  </Link>
                );
              })}
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
