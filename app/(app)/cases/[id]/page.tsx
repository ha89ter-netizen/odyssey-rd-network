"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore, completenessOverall, selectMatchesOf } from "@/store/store";
import { Panel, SectionHead, Pill, Button, ScoreBar, Tabs, Empty, Banner, relTime, Disclaimer } from "@/ui/primitives";
import { Pedigree, Ring } from "@/components/kit";
import { FindMatches } from "@/components/FindMatches";

type TabId = "overview" | "phenotype" | "genetics" | "timeline" | "laboratory" | "family" | "treatment" | "evidence";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "phenotype", label: "Phenotype" },
  { id: "genetics", label: "Genetics" },
  { id: "timeline", label: "Clinical timeline" },
  { id: "laboratory", label: "Laboratory" },
  { id: "family", label: "Family history" },
  { id: "treatment", label: "Treatment response" },
  { id: "evidence", label: "Evidence" },
];

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const [tab, setTab] = React.useState<TabId>("overview");
  const c = state.cases[id];

  if (!c) {
    return <Empty title="Case not found" body={`No case with reference ${id} exists in this demonstration.`} action={<Link href="/cases"><Button>Back to cases</Button></Link>} />;
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
            <Link href="/cases" className="og-small og-link">Cases</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{c.id}</span>
          </div>
          <div className="og-row" style={{ gap: 11, marginTop: 10 }}>
            <h1 className="og-h1">{c.id}</h1>
            <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : "amber"}>{c.status}</Pill>
            {!mine && <Pill>Network case · read only</Pill>}
          </div>
          <p className="og-lede" style={{ marginTop: 12 }}>{c.headline}</p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          {mine && <FindMatches record={c} label={searched ? "Re-run network search" : "Find matches"} />}
          {matches.length > 0 && (
            <Link href={`/cases/${c.id}/matches`}><Button variant="ghost">View {matches.length} result{matches.length === 1 ? "" : "s"}</Button></Link>
          )}
        </div>
      </header>

      {unverified.length > 0 && mine && (
        <div className="og-sec">
          <Banner tone="amber">
            <b>{unverified.length} extracted term{unverified.length === 1 ? "" : "s"} await your verification.</b>{" "}
            AI-assisted extraction proposed them from an uploaded document; they are not part of the case, and will not
            be used for matching, until you confirm them.{" "}
            <Link href={`/cases/${c.id}/verify`} className="og-link">Review now</Link>
          </Banner>
        </div>
      )}

      <div className="og-sec og-grid" data-cols="side">
        <div>
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <Panel style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            {tab === "overview" && (
              <div className="og-stack">
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-2)", margin: 0 }}>{c.narrative}</p>
                <dl className="og-kv" style={{ marginTop: 6 }}>
                  <dt>Country</dt><dd>{c.country}</dd>
                  <dt>Institution</dt><dd>{c.institution}</dd>
                  <dt>Clinician</dt><dd>{c.clinician}</dd>
                  <dt>Age group</dt><dd>{c.ageGroup}</dd>
                  <dt>Sex</dt><dd>{c.sex}</dd>
                  <dt>Cluster</dt><dd>{c.phenotypeCluster}</dd>
                  <dt>Enrolled</dt><dd className="og-mono">{c.enrolled}</dd>
                  <dt>Updated</dt><dd>{relTime(c.updatedAt, state.clock)}</dd>
                </dl>
              </div>
            )}

            {tab === "phenotype" && (
              c.phenotypes.length === 0 ? (
                <Empty title="No phenotype recorded" body="Upload a clinical document to propose terms, or add them by hand." icon="◔"
                  action={mine ? <Link href={`/cases/${c.id}/verify`}><Button>Upload a document</Button></Link> : undefined} />
              ) : (
                <table className="og-table">
                  <thead><tr><th>Term</th><th style={{ width: 104 }}>HPO</th><th style={{ width: 84 }}>Onset</th><th style={{ width: 92 }}>Severity</th><th style={{ width: 96 }}>Status</th><th style={{ width: 120 }}>Verification</th></tr></thead>
                  <tbody>
                    {c.phenotypes.map((p) => (
                      <tr key={p.hpo}>
                        <td style={{ fontWeight: 600, color: p.status === "Absent" || p.verification === "rejected" ? "var(--ink-4)" : undefined, textDecoration: p.verification === "rejected" ? "line-through" : undefined }}>{p.term}</td>
                        <td className="og-mono og-small">{p.hpo}</td>
                        <td className="og-mono">{p.onset}</td>
                        <td className="og-small">{p.severity}</td>
                        <td><Pill tone={p.status === "Absent" ? "coral" : p.status === "Present" ? "ice" : undefined}>{p.status}</Pill></td>
                        <td>
                          <Pill tone={p.verification === "verified" ? "teal" : p.verification === "rejected" ? "coral" : "amber"}>
                            {p.verification === "verified" ? "Doctor verified" : p.verification === "rejected" ? "Rejected" : "AI extracted"}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === "genetics" && (
              c.genetics.length === 0 ? <Empty title="No genetic information" body="Nothing recorded for this case yet." icon="◇" /> : (
                <div className="og-stack">
                  <p className="og-small" style={{ margin: 0 }}>{c.geneticSummary}</p>
                  {c.genetics.map((g, i) => (
                    <div key={i} style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div className="og-between">
                        <span className="og-mono" style={{ fontSize: 12.5, color: g.gene === "—" ? "var(--ink-3)" : "var(--teal-deep)" }}>
                          {g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}
                        </span>
                        <Pill tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</Pill>
                      </div>
                      <div className="og-small" style={{ marginTop: 5 }}>
                        {g.zygosity !== "—" && `${g.zygosity} · ${g.inheritance} · `}{g.note}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "timeline" && (
              c.timeline.length === 0 ? <Empty title="No timeline recorded" body="Clinical events establish the trajectory, which is often more discriminating than any single finding." icon="◷" /> : (
                <div className="og-tl">
                  {c.timeline.map((t, i) => (
                    <div key={i} className="og-tl-item ody-rise" data-kind={t.kind} style={{ "--d": `${i * 45}ms` } as React.CSSProperties}>
                      <div className="og-row" style={{ gap: 14, alignItems: "baseline" }}>
                        <span className="og-mono og-small" style={{ width: 62, flex: "none" }}>{t.age}</span>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.label}</div>
                          <div className="og-small" style={{ marginTop: 3 }}>{t.detail}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "laboratory" && (
              c.labs.length === 0 ? <Empty title="No laboratory results" body="Values with units and local reference ranges make a case comparable across sites." icon="◈" /> : (
                <table className="og-table">
                  <thead><tr><th>Analyte</th><th style={{ width: 90 }}>Matrix</th><th style={{ width: 88 }}>Value</th><th style={{ width: 78 }}>Unit</th><th style={{ width: 100 }}>Reference</th></tr></thead>
                  <tbody>
                    {c.labs.map((l, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{l.analyte}</td>
                        <td className="og-small">{l.matrix}</td>
                        <td className="og-mono" style={{ color: l.flag === "high" ? "var(--coral)" : l.flag === "low" ? "var(--ice)" : undefined }}>
                          {l.value}{l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}
                        </td>
                        <td className="og-mono og-small">{l.unit}</td>
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
                  <dt>Pedigree</dt><dd>{c.family.pedigree}</dd>
                  <dt>Consanguinity</dt><dd>{c.family.consanguinityNote}</dd>
                  <dt>Siblings</dt><dd>{c.family.siblings}</dd>
                  <dt>Ancestry</dt><dd>{c.family.regionalAncestry}</dd>
                  <dt>Notes</dt><dd>{c.family.notes || "—"}</dd>
                </dl>
              </div>
            )}

            {tab === "treatment" && (
              c.treatments.length === 0 ? <Empty title="No treatment response recorded" body="Interventions with duration and measured response are strong matching signals." icon="◉" /> : (
                <table className="og-table">
                  <thead><tr><th>Intervention</th><th style={{ width: 110 }}>Duration</th><th>Response</th></tr></thead>
                  <tbody>
                    {c.treatments.map((t) => (
                      <tr key={t.intervention}>
                        <td style={{ fontWeight: 600 }}>{t.intervention}</td>
                        <td className="og-mono og-small">{t.duration}</td>
                        <td style={{ color: t.tone === "positive" ? "var(--teal-deep)" : t.tone === "negative" ? "var(--coral)" : undefined }}>{t.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === "evidence" && (
              <div className="og-grid" data-cols="2">
                <div>
                  <div className="og-eyebrow">Imaging</div>
                  {c.imaging.length === 0 ? <p className="og-small">No structured imaging recorded.</p> : c.imaging.map((im, i) => (
                    <div key={i} style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{im.modality} · {im.age}</div>
                      <div className="og-small" style={{ marginTop: 3 }}>{im.finding}</div>
                      <div className="og-small" style={{ marginTop: 2, fontStyle: "italic" }}>{im.impression}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="og-eyebrow">Negative evidence</div>
                  <p className="og-small" style={{ marginTop: 6 }}>What has been ruled out narrows the differential as much as what is present.</p>
                  {c.negativeEvidence.length === 0 ? <p className="og-small">None documented.</p> : c.negativeEvidence.map((n, i) => (
                    <div key={i} className="og-row" style={{ gap: 10, padding: "6px 0", fontSize: 12.5, color: "var(--ink-2)" }}>
                      <span style={{ color: "var(--coral)" }}>×</span>{n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </div>

        <aside className="og-stack">
          <Panel glass title="Case completeness" action={<span className="og-num" style={{ fontSize: 18 }}>{overall}%</span>}>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--teal)", marginBottom: 16 }}>
              <Ring value={overall} size={92} thickness={6} delay={200}>
                <span className="og-num" style={{ fontSize: 22, color: "var(--ink)" }}>{overall}</span>
              </Ring>
            </div>
            {c.completeness.map((b, i) => (
              <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 58px 30px", gap: 12, alignItems: "center", marginBottom: 9 }}>
                <span style={{ fontSize: 12.5 }}>{b.label}</span>
                <ScoreBar value={b.value} delay={150 + i * 40} />
                <span className="og-mono og-small" style={{ textAlign: "right" }}>{b.value}</span>
              </div>
            ))}
            <p className="og-small" style={{ marginTop: 12 }}>
              Completeness governs how much the matching engine can compare. It is not a measure of case severity.
            </p>
          </Panel>

          <Panel title="Potential matching signals" action={<Pill tone="teal">{c.signals.length}</Pill>} padded={false}>
            {c.signals.length === 0 ? (
              <div style={{ padding: 18 }}><p className="og-small" style={{ margin: 0 }}>Signals appear once phenotype, laboratory or imaging data has been recorded.</p></div>
            ) : c.signals.map((s, i) => (
              <div key={i} className="og-listrow" style={{ gridTemplateColumns: "26px 1fr" }}>
                <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12.5 }}>{s}</span>
              </div>
            ))}
          </Panel>

          {mine && (
            <Panel title="Actions">
              <div className="og-stack">
                <Link href={`/cases/${c.id}/verify`}><Button variant="ghost" block>Upload document &amp; extract</Button></Link>
                <FindMatches record={c} label={searched ? "Re-run network search" : "Find matches"} variant="ghost" />
                {matches.length > 0 && <Link href={`/cases/${c.id}/matches`}><Button variant="ghost" block>View match results</Button></Link>}
              </div>
            </Panel>
          )}
        </aside>
      </div>
    </>
  );
}
