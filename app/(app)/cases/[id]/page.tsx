"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore, completenessOverall, selectMatchesOf } from "@/store/store";
import { Panel, SectionHead, Pill, Button, ScoreBar, Tabs, Empty, Banner, Disclaimer } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { Pedigree, Ring } from "@/components/kit";
import { FindMatches } from "@/components/FindMatches";

type TabId = "overview" | "phenotype" | "genetics" | "timeline" | "laboratory" | "family" | "treatment" | "evidence";
const TAB_IDS: TabId[] = ["overview", "phenotype", "genetics", "timeline", "laboratory", "family", "treatment", "evidence"];

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
  const [tab, setTab] = React.useState<TabId>("overview");
  const c = state.cases[id];

  if (!c) {
    return <Empty title={t("case.notFound")} body={t("case.notFoundBody", { id })} action={<Link href="/cases"><Button>{t("case.backToCases")}</Button></Link>} />;
  }

  const mine = c.ownerId === state.currentDoctorId;
  const overall = completenessOverall(c);
  const unverified = c.phenotypes.filter((p) => p.verification === "unverified");
  const matches = selectMatchesOf(state, state.currentDoctorId!).filter((m) => m.sourceCaseId === c.id || m.targetCaseId === c.id);
  const searched = state.searched.includes(c.id);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "66ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/cases" className="og-small og-link">{t("nav.cases")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{c.id}</span>
          </div>
          <div className="og-row" style={{ gap: 11, marginTop: 10 }}>
            <h1 className="og-h1">{c.id}</h1>
            <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : "amber"}>{t(`status.${c.status}` as "status.Unresolved")}</Pill>
            {!mine && <Pill>{t("case.readOnly")}</Pill>}
          </div>
          <p className="og-lede" style={{ marginTop: 12 }}>{C(c.headline)}</p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          {mine && <FindMatches record={c} label={searched ? t("case.rerun") : t("case.findMatches")} />}
          {matches.length > 0 && (
            <Link href={`/cases/${c.id}/matches`}><Button variant="ghost">{t("case.viewNResults", { n: matches.length })}</Button></Link>
          )}
        </div>
      </header>

      {unverified.length > 0 && mine && (
        <div className="og-sec">
          <Banner tone="amber">
            <b>{t("case.unverifiedBanner", { n: unverified.length })}</b> {t("case.unverifiedBody")}{" "}
            <Link href={`/cases/${c.id}/verify`} className="og-link">{t("case.reviewNow")}</Link>
          </Banner>
        </div>
      )}

      <div className="og-sec og-grid" data-cols="side">
        <div>
          <Tabs tabs={TAB_IDS.map((x) => ({ id: x, label: t(`case.tab.${x}` as "case.tab.overview") }))} value={tab} onChange={setTab} />
          <Panel style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            {tab === "overview" && (
              <div className="og-stack">
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-2)", margin: 0 }}>{C(c.narrative)}</p>
                <dl className="og-kv" style={{ marginTop: 6 }}>
                  <dt>{t("case.fCountry")}</dt><dd>{C(c.country)}</dd>
                  <dt>{t("case.fInstitution")}</dt><dd>{C(c.institution)}</dd>
                  <dt>{t("case.fClinician")}</dt><dd>{C(c.clinician)}</dd>
                  <dt>{t("case.fAgeGroup")}</dt><dd>{C(c.ageGroup)}</dd>
                  <dt>{t("case.fSex")}</dt><dd>{C(c.sex)}</dd>
                  <dt>{t("case.fCluster")}</dt><dd>{C(c.phenotypeCluster)}</dd>
                  <dt>{t("case.fEnrolled")}</dt><dd className="og-mono">{c.enrolled}</dd>
                  <dt>{t("case.fUpdated")}</dt><dd>{relTime(c.updatedAt, state.clock)}</dd>
                </dl>
              </div>
            )}

            {tab === "phenotype" && (
              c.phenotypes.length === 0 ? (
                <Empty title={t("case.noPhenotype")} body={t("case.noPhenotypeBody")} icon="◔"
                  action={mine ? <Link href={`/cases/${c.id}/verify`}><Button>{t("case.uploadDoc")}</Button></Link> : undefined} />
              ) : (
                <table className="og-table">
                  <thead><tr><th>{t("case.colTerm")}</th><th style={{ width: 104 }}>HPO</th><th style={{ width: 84 }}>{t("case.colOnset")}</th><th style={{ width: 92 }}>{t("case.colSeverity")}</th><th style={{ width: 96 }}>{t("cases.colStatus")}</th><th style={{ width: 120 }}>{t("case.colVerification")}</th></tr></thead>
                  <tbody>
                    {c.phenotypes.map((p) => (
                      <tr key={p.hpo}>
                        <td style={{ fontWeight: 600, color: p.status === "Absent" || p.verification === "rejected" ? "var(--ink-4)" : undefined, textDecoration: p.verification === "rejected" ? "line-through" : undefined }}>{C(p.term)}</td>
                        <td className="og-mono og-small">{p.hpo}</td>
                        <td className="og-mono">{C(p.onset)}</td>
                        <td className="og-small">{t(`status.${p.severity}` as "status.Mild")}</td>
                        <td><Pill tone={p.status === "Absent" ? "coral" : p.status === "Present" ? "ice" : undefined}>{t(`status.${p.status}` as "status.Present")}</Pill></td>
                        <td>
                          <Pill tone={p.verification === "verified" ? "teal" : p.verification === "rejected" ? "coral" : "amber"}>
                            {t(`status.${p.verification}` as "status.verified")}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === "genetics" && (
              c.genetics.length === 0 ? <Empty title={t("case.noGenetics")} body={t("case.noGeneticsBody")} icon="◇" /> : (
                <div className="og-stack">
                  <p className="og-small" style={{ margin: 0 }}>{C(c.geneticSummary)}</p>
                  {c.genetics.map((g, i) => (
                    <div key={i} style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div className="og-between">
                        <span className="og-mono" style={{ fontSize: 12.5, color: g.gene === "—" ? "var(--ink-3)" : "var(--teal-deep)" }}>
                          {g.gene === "—" ? C(g.variant) : `${g.gene} ${g.variant}`}
                        </span>
                        <Pill tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{C(g.classification)}</Pill>
                      </div>
                      <div className="og-small" style={{ marginTop: 5 }}>
                        {g.zygosity !== "—" && `${C(g.zygosity)} · ${C(g.inheritance)} · `}{C(g.note)}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "timeline" && (
              c.timeline.length === 0 ? <Empty title={t("case.noTimeline")} body={t("case.noTimelineBody")} icon="◷" /> : (
                <div className="og-tl">
                  {c.timeline.map((tl, i) => (
                    <div key={i} className="og-tl-item ody-rise" data-kind={tl.kind} style={{ "--d": `${i * 45}ms` } as React.CSSProperties}>
                      <div className="og-row" style={{ gap: 14, alignItems: "baseline" }}>
                        <span className="og-mono og-small" style={{ width: 62, flex: "none" }}>{C(tl.age)}</span>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{C(tl.label)}</div>
                          <div className="og-small" style={{ marginTop: 3 }}>{C(tl.detail)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "laboratory" && (
              c.labs.length === 0 ? <Empty title={t("case.noLabs")} body={t("case.noLabsBody")} icon="◈" /> : (
                <table className="og-table">
                  <thead><tr><th>{t("case.colAnalyte")}</th><th style={{ width: 90 }}>{t("case.colMatrix")}</th><th style={{ width: 88 }}>{t("case.colValue")}</th><th style={{ width: 78 }}>{t("case.colUnit")}</th><th style={{ width: 100 }}>{t("case.colReference")}</th></tr></thead>
                  <tbody>
                    {c.labs.map((l, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{C(l.analyte)}</td>
                        <td className="og-small">{C(l.matrix)}</td>
                        <td className="og-mono" style={{ color: l.flag === "high" ? "var(--coral)" : l.flag === "low" ? "var(--ice)" : undefined }}>
                          {C(l.value)}{l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}
                        </td>
                        <td className="og-mono og-small">{C(l.unit)}</td>
                        <td className="og-mono og-small">{l.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === "family" && (
              <div className="og-grid" data-cols="2">
                <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous={c.family.consanguinity} affected={c.family.consanguinity ? [0, 2] : [1]} size={240} /></div>
                <dl className="og-kv">
                  <dt>{t("case.fPedigree")}</dt><dd>{C(c.family.pedigree)}</dd>
                  <dt>{t("case.fConsanguinity")}</dt><dd>{C(c.family.consanguinityNote)}</dd>
                  <dt>{t("case.fSiblings")}</dt><dd>{C(c.family.siblings)}</dd>
                  <dt>{t("case.fAncestry")}</dt><dd>{C(c.family.regionalAncestry)}</dd>
                  <dt>{t("case.fNotes")}</dt><dd>{C(c.family.notes) || "—"}</dd>
                </dl>
              </div>
            )}

            {tab === "treatment" && (
              c.treatments.length === 0 ? <Empty title={t("case.noTreatments")} body={t("case.noTreatmentsBody")} icon="◉" /> : (
                <table className="og-table">
                  <thead><tr><th>{t("case.colIntervention")}</th><th style={{ width: 110 }}>{t("case.colDuration")}</th><th>{t("case.colResponse")}</th></tr></thead>
                  <tbody>
                    {c.treatments.map((tx) => (
                      <tr key={tx.intervention}>
                        <td style={{ fontWeight: 600 }}>{C(tx.intervention)}</td>
                        <td className="og-mono og-small">{C(tx.duration)}</td>
                        <td style={{ color: tx.tone === "positive" ? "var(--teal-deep)" : tx.tone === "negative" ? "var(--coral)" : undefined }}>{C(tx.response)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === "evidence" && (
              <div className="og-grid" data-cols="2">
                <div>
                  <div className="og-eyebrow">{t("case.imaging")}</div>
                  {c.imaging.length === 0 ? <p className="og-small">{t("case.noImaging")}</p> : c.imaging.map((im, i) => (
                    <div key={i} style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{C(im.modality)} · {C(im.age)}</div>
                      <div className="og-small" style={{ marginTop: 3 }}>{C(im.finding)}</div>
                      <div className="og-small" style={{ marginTop: 2, fontStyle: "italic" }}>{C(im.impression)}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="og-eyebrow">{t("case.negativeEvidence")}</div>
                  <p className="og-small" style={{ marginTop: 6 }}>{t("case.negativeNote")}</p>
                  {c.negativeEvidence.length === 0 ? <p className="og-small">{t("case.noneDocumented")}</p> : c.negativeEvidence.map((n, i) => (
                    <div key={i} className="og-row" style={{ gap: 10, padding: "6px 0", fontSize: 12.5, color: "var(--ink-2)" }}>
                      <span style={{ color: "var(--coral)" }}>×</span>{C(n)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </div>

        <aside className="og-stack">
          <Panel glass title={t("case.completeness")} action={<span className="og-num" style={{ fontSize: 18 }}>{overall}%</span>}>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--teal)", marginBottom: 16 }}>
              <Ring value={overall} size={92} thickness={6} delay={200}>
                <span className="og-num" style={{ fontSize: 22, color: "var(--ink)" }}>{overall}</span>
              </Ring>
            </div>
            {c.completeness.map((b, i) => (
              <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 58px 30px", gap: 12, alignItems: "center", marginBottom: 9 }}>
                <span style={{ fontSize: 12.5 }}>{C(b.label)}</span>
                <ScoreBar value={b.value} delay={150 + i * 40} />
                <span className="og-mono og-small" style={{ textAlign: "right" }}>{b.value}</span>
              </div>
            ))}
            <p className="og-small" style={{ marginTop: 12 }}>
              {t("case.completenessNote")}
            </p>
          </Panel>

          <Panel title={t("case.matchingSignals")} action={<Pill tone="teal">{c.signals.length}</Pill>} padded={false}>
            {c.signals.length === 0 ? (
              <div style={{ padding: 18 }}><p className="og-small" style={{ margin: 0 }}>{t("case.signalsEmpty")}</p></div>
            ) : c.signals.map((s, i) => (
              <div key={i} className="og-listrow" style={{ gridTemplateColumns: "26px 1fr" }}>
                <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12.5 }}>{C(s)}</span>
              </div>
            ))}
          </Panel>

          {mine && (
            <Panel title={t("case.actions")}>
              <div className="og-stack">
                <Link href={`/cases/${c.id}/verify`}><Button variant="ghost" block>{t("case.uploadExtract")}</Button></Link>
                <FindMatches record={c} label={searched ? t("case.rerun") : t("case.findMatches")} variant="ghost" />
                {matches.length > 0 && <Link href={`/cases/${c.id}/matches`}><Button variant="ghost" block>{t("case.viewResults")}</Button></Link>}
              </div>
            </Panel>
          )}
        </aside>
      </div>
    </>
  );
}
