"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { WorldMap, TrajectoryChart, Pedigree, Spark, Radar, stagger } from "@/components/kit";
import {
  DISCLAIMER, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

const NAV: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Today" },
  { id: "create", label: "New case" },
  { id: "case", label: "Case" },
  { id: "match", label: "Match" },
  { id: "compare", label: "Comparison" },
  { id: "room", label: "Collaboration" },
];

export default function HumanMachine({ screen }: { screen: ScreenId }) {
  return (
    <div className="c10 ody-surface">
      <header className="c10-top">
        <span className="c10-brand">ODYSSEY</span>
        <nav className="c10-nav">
          {NAV.map((n) => <span key={n.id} className="c10-navitem" data-on={n.id === screen}>{n.label}</span>)}
        </nav>
        <div className="c10-motto">
          <span className="m">The system finds the signal</span>
          <span style={{ color: "var(--ink-4)" }}>·</span>
          <span className="h">clinicians establish the meaning</span>
        </div>
      </header>

      <div className="c10-page">
        {screen === "dashboard" && <Dashboard />}
        {screen === "create" && <Create />}
        {screen === "case" && <CaseIntel />}
        {screen === "match" && <Match />}
        {screen === "compare" && <Compare />}
        {screen === "room" && <Room />}
      </div>
    </div>
  );
}

const Disclaimer = () => <span className="c10-disclaimer">◆ {DISCLAIMER}</span>;

const Handoff = ({ machine, human }: { machine: string; human: string }) => (
  <div className="c10-handoff ody-fadein">
    <span className="m">{machine}</span>
    <svg className="arrow" width="34" height="10" viewBox="0 0 34 10" fill="none" aria-hidden>
      <path className="ody-drawin" style={{ "--dash": 28, "--d": "400ms" } as React.CSSProperties} d="M0 5h26" stroke="currentColor" strokeWidth="1" strokeDasharray="28" />
      <path d="M23 2l4 3-4 3" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
    <span className="h">{human}</span>
  </div>
);

const Split = ({ bias, machine, human }: { bias?: "machine" | "human"; machine: React.ReactNode; human: React.ReactNode }) => (
  <div className="c10-split" data-bias={bias}>
    <div className="c10-pane-m">{machine}</div>
    <div className="c10-seam" />
    <div className="c10-pane-h">{human}</div>
  </div>
);

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c10-sechead">
    <div>
      <div className="h-label">{label}</div>
      {note && <div className="h-small" style={{ marginTop: 7, maxWidth: "62ch" }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">Global Rare Disease Match Network</div>
          <h1 className="h-display" style={{ marginTop: 16 }}>{doctor.greeting}, {doctor.name}</h1>
          <p className="h-lede" style={{ marginTop: 16 }}>
            While you were away the system read 128,406 records and found four cases worth your attention. It has not
            decided anything. That part is yours.
          </p>
        </div>
        <Disclaimer />
      </header>

      <section className="c10-sec">
        <Handoff machine="Overnight · federated query complete" human="Awaiting clinical judgement" />
        <Split
          bias="machine"
          machine={
            <>
              <div className="m-label">What the system found</div>
              <h2 className="m-title" style={{ marginTop: 12 }}>Potential cross-border match · {match.id}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, flexWrap: "wrap" }}>
                <div>
                  <div className="m-num" style={{ fontSize: 26 }}>{caseKZ.id}</div>
                  <div className="m-sub">{caseKZ.country.toUpperCase()}</div>
                </div>
                <svg width="66" height="12" viewBox="0 0 66 12" fill="none" aria-hidden>
                  <path className="ody-drawin" style={{ "--dash": 56, "--d": "500ms" } as React.CSSProperties} d="M0 6h54" stroke="var(--blue)" strokeWidth="1.1" strokeDasharray="56" />
                  <path d="M51 3l4 3-4 3" stroke="var(--blue)" strokeWidth="1.1" fill="none" />
                </svg>
                <div>
                  <div className="m-num" style={{ fontSize: 26, color: "var(--blue)" }}>{caseDE.id}</div>
                  <div className="m-sub">{caseDE.country.toUpperCase()}</div>
                </div>
              </div>

              <div className="m-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 20 }}>
                {[[match.cohortsQueried.toLocaleString(), "COHORTS"], [String(match.countriesQueried), "COUNTRIES"], [match.candidatesScreened.toLocaleString(), "SCREENED"], [String(match.candidatesReturned), "RETURNED"]].map(([v, l], i) => (
                  <div key={l} className="m-cell ody-fadein" style={stagger(i, 70, 200)}>
                    <div className="m-num" style={{ fontSize: 17, color: i === 3 ? "var(--blue)" : undefined }}>{v}</div>
                    <div className="m-sub" style={{ marginTop: 5 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="m-sub" style={{ marginBottom: 8 }}>EVIDENCE GROUPS · {match.concordantGroups} CONCORDANT / {match.divergences} DIVERGENT</div>
                {matchEvidence.slice(0, 4).map((e, i) => (
                  <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 44px 74px", gap: 12, alignItems: "center", padding: "6px 0" }}>
                    <span className="m-body">{e.label}</span>
                    <span className="m-num" style={{ fontSize: 13, textAlign: "right", color: e.direction === "divergent" ? "var(--amber)" : undefined }}>{e.score}</span>
                    <div className="m-bar"><i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : undefined, ...stagger(i, 60, 260) }} /></div>
                  </div>
                ))}
                <div className="m-sub" style={{ marginTop: 8 }}>+ 4 further groups</div>
              </div>

              <div style={{ marginTop: 18 }}>
                <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" labelSize={1.7} />
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">What it cannot decide</div>
              <h2 className="h-title" style={{ marginTop: 12 }}>
                Whether these two children have the same disease is a clinical judgement, not a computation.
              </h2>
              <p className="h-body" style={{ marginTop: 16 }}>
                The system can say that seven of eight evidence groups align, that the imaging pattern is the same and
                that both families carry the same coding variant. It cannot say what that means for a four-year-old in
                Astana.
              </p>
              <div className="h-note" style={{ marginTop: 20 }}>
                “{match.confidenceNote}”
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
                <button className="c10-btn">Review the evidence</button>
                <button className="c10-btn" data-variant="ghost">Defer to case conference</button>
              </div>

              <div style={{ marginTop: 34 }}>
                <div className="h-label">Also waiting for you</div>
                <ul className="h-list" style={{ marginTop: 12 }}>
                  {attention.map((a, i) => (
                    <li key={a.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 18, alignItems: "baseline", ...stagger(i, 70, 200) }}>
                      <span className="h-num" style={{ fontSize: 28, color: a.tone === "signal" ? "var(--sienna)" : "var(--ink)" }}>
                        {String(a.count).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="h-sub" style={{ fontSize: 15.5 }}>{a.label}</div>
                        <div className="h-small" style={{ marginTop: 3 }}>{a.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        />
      </section>

      <section className="c10-sec">
        <SecHead label="Your unresolved cases" note="Twelve cases without an answer. Completeness is the system's contribution; interpretation is yours." />
        <div className="m-box">
          <table className="m-table">
            <thead><tr><th style={{ width: 92 }}>Case</th><th>Presentation</th><th style={{ width: 118 }}>Status</th><th style={{ width: 128 }}>Completeness</th><th style={{ width: 76 }}>Updated</th></tr></thead>
            <tbody>
              {caseQueue.map((r, i) => (
                <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 120)}>
                  <td className="m-mono" style={{ color: r.caseId === "ODY-001" ? "var(--blue)" : undefined }}>{r.caseId}</td>
                  <td style={{ fontFamily: "var(--font-human)", fontSize: 14, color: "var(--ink-2)" }}>{r.summary}</td>
                  <td><span className="m-tag" data-tone={r.status === "Match proposed" ? "blue" : r.status === "Verified" ? "green" : undefined}>{r.status}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div className="m-bar" style={{ flex: 1 }}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 200) }} /></div>
                      <span className="m-mono" style={{ fontSize: 10.5 }}>{r.completeness}</span>
                    </div>
                  </td>
                  <td className="m-mono" style={{ fontSize: 10.5 }}>{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="c10-sec">
        <Split
          machine={
            <>
              <div className="m-label">Machine · network log</div>
              <div style={{ marginTop: 14 }}>
                {networkActivity.map((a, i) => (
                  <div key={a.id} className="m-row ody-fadein" style={{ gridTemplateColumns: "56px 1fr auto", ...stagger(i, 50, 180) }}>
                    <span className="m-sub" style={{ color: a.kind === "match" ? "var(--blue)" : undefined }}>{a.origin}</span>
                    <div>
                      <div className="m-body" style={{ color: "var(--mach-ink)" }}>{a.title}</div>
                      <div className="m-sub" style={{ marginTop: 3 }}>{a.detail}</div>
                    </div>
                    <span className="m-sub">{a.time}</span>
                  </div>
                ))}
              </div>
              <div className="m-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginTop: 18 }}>
                {networkStats.map((s) => (
                  <div key={s.id} className="m-cell">
                    <div className="m-num" style={{ fontSize: 18 }}>{s.value}</div>
                    <div className="m-sub" style={{ marginTop: 4 }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">Human · what came of it</div>
              <p className="h-body" style={{ marginTop: 14 }}>
                Of 46 potential matches the system surfaced in the last ninety days, clinicians reviewed 38 and
                confirmed 11. Nine of those became knowledge that went back to the network.
              </p>
              <div style={{ marginTop: 20 }}>
                {contributionMetrics.map((m, i) => (
                  <div key={m.id} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 14 }}>{m.label}</span>
                      <span className="h-num" style={{ fontSize: 19 }}>{m.value}<span style={{ color: "var(--ink-4)", fontSize: 13 }}> / {m.of}</span></span>
                    </div>
                    <div className="m-bar" style={{ marginTop: 8, background: "var(--line-h)" }}>
                      <i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, background: i >= 2 ? "var(--sienna)" : "var(--blue)", ...stagger(i, 70, 300) }} />
                    </div>
                    <div className="h-small" style={{ marginTop: 5 }}>{m.note}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line-h)" }}>
                <div>
                  <div className="h-label">Federated queries / month</div>
                  <div className="h-num" style={{ fontSize: 30, marginTop: 6 }}>52</div>
                </div>
                <div style={{ color: "var(--sienna)" }}><Spark data={querySeries} w={138} h={36} /></div>
              </div>
            </>
          }
        />
      </section>
    </>
  );
}

/* ------------------------------ CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">New case</div>
          <h1 className="h-display" style={{ marginTop: 14 }}>Create case</h1>
          <p className="h-lede" style={{ marginTop: 14 }}>
            The machine proposes structure. You decide what is true about your patient.
          </p>
        </div>
        <Disclaimer />
      </header>

      <section className="c10-sec" style={{ display: "grid", gridTemplateColumns: "minmax(190px, 240px) minmax(0, 1fr)", gap: 32, alignItems: "start" }}>
        <aside>
          <div className="h-label">Sections · 3 of 9</div>
          <ul className="h-list" style={{ marginTop: 14 }}>
            {intakeSteps.map((s, i) => (
              <li key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 12, padding: "11px 0", ...stagger(i, 40) }}>
                <span className="m-mono" style={{ fontSize: 10, color: s.state === "active" ? "var(--sienna)" : "var(--ink-4)" }}>{s.index}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: s.state === "active" ? 600 : 400, color: s.state === "complete" ? "var(--ink-3)" : "var(--ink)" }}>{s.label}</div>
                  {s.state === "active" && <div className="h-small" style={{ marginTop: 4 }}>{s.description}</div>}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="m-tag" data-tone="blue">HPO normalised</span>} />
          {active.fields.map((f) => (
            <div key={f.label} className="c10-field">
              <div>
                <div className="h-label" style={{ color: "var(--ink-3)" }}>{f.label}</div>
                {f.hint && <div className="h-small" style={{ marginTop: 5 }}>{f.hint}</div>}
              </div>
              {f.kind === "chips" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {f.value.split(" · ").map((v) => <span key={v} className="h-tag">{v}</span>)}
                </div>
              ) : (
                <div className="c10-input">{f.value}</div>
              )}
            </div>
          ))}

          <div className="c10-sec">
            <SecHead label="09 — Documents" />
            <Handoff machine="Extraction complete · 7 terms proposed · 2.3 s" human="Confirm, edit or reject each one" />
            <div style={{ marginTop: 2 }}>
              {aiExtraction.terms.map((t, i) => (
                <Split
                  key={t.hpo}
                  bias="machine"
                  machine={
                    <div className="ody-fadein" style={stagger(i, 55, 140)}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                        <span className="m-mono" style={{ fontSize: 11, color: "var(--blue)" }}>{t.hpo}</span>
                        <span className="m-sub">{aiExtraction.document} · {t.page}</span>
                      </div>
                      <div className="m-title" style={{ marginTop: 8, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--mach-ink-3)" : undefined }}>
                        {t.term}
                      </div>
                      <div className="m-body" style={{ marginTop: 8, fontStyle: "italic" }}>{t.evidence}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                        <span className="m-sub">CONFIDENCE {t.confidence.toFixed(2)}</span>
                        <div className="m-bar" style={{ flex: 1, maxWidth: 140 }}>
                          <i style={{ width: `${t.confidence * 100}%`, background: t.confidence < 0.7 ? "var(--amber)" : undefined }} />
                        </div>
                      </div>
                    </div>
                  }
                  human={
                    <div className="ody-fadein" style={stagger(i, 55, 200)}>
                      <div className="h-label">Clinician verification</div>
                      {t.state === "confirmed" ? (
                        <>
                          <div className="h-sub" style={{ marginTop: 10 }}>Confirmed by {doctor.name}</div>
                          <p className="h-small" style={{ marginTop: 6 }}>Consistent with the examination findings at 8 months.</p>
                          <span className="h-tag" data-tone="green" style={{ marginTop: 10 }}>✓ In the matching index</span>
                        </>
                      ) : t.state === "rejected" ? (
                        <>
                          <div className="h-sub" style={{ marginTop: 10 }}>Rejected</div>
                          <p className="h-small" style={{ marginTop: 6 }}>The sentence states the spleen was <em>not</em> enlarged. Negation missed by the parser.</p>
                          <span className="h-tag" data-tone="amber" style={{ marginTop: 10 }}>Excluded · reason recorded</span>
                        </>
                      ) : (
                        <>
                          <p className="h-body" style={{ marginTop: 10 }}>
                            {t.confidence < 0.7
                              ? "Low confidence. The parent report is second-hand; consider examining before accepting."
                              : "Awaiting your decision."}
                          </p>
                          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                            <button className="c10-btn" style={{ height: 32, fontSize: 12 }}>Confirm</button>
                            <button className="c10-btn" data-variant="ghost" style={{ height: 32, fontSize: 12 }}>Edit</button>
                            <button className="c10-btn" data-variant="ghost" style={{ height: 32, fontSize: 12 }}>Reject</button>
                          </div>
                        </>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, marginTop: 24, flexWrap: "wrap" }}>
              <span className="h-small">Three confirmed · three awaiting your review · one rejected. Only confirmed terms are indexed.</span>
              <button className="c10-btn">Confirm remaining and continue</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ CASE ------------------------------ */

function CaseIntel() {
  const c = caseKZ;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">Case intelligence</div>
          <h1 className="h-display" style={{ marginTop: 14 }}>{c.id}</h1>
          <p className="h-lede" style={{ marginTop: 14 }}>{c.headline}</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="h-tag" data-tone="amber">{c.status}</span>
          <span className="h-tag" data-tone="sienna">1 potential match</span>
          <Disclaimer />
        </div>
      </header>

      <section className="c10-sec">
        <Handoff machine="Structured signals · 8 groups · 82% complete" human="The clinical story behind them" />
        <Split
          machine={
            <>
              <div className="m-label">Machine · structured record</div>
              <div className="m-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginTop: 14 }}>
                {[["COUNTRY", c.country], ["AGE GROUP", c.ageGroup], ["GENETIC STATUS", "Unresolved"], ["ENROLLED", c.enrolled]].map(([l, v]) => (
                  <div key={l} className="m-cell">
                    <div className="m-sub">{l}</div>
                    <div className="m-body" style={{ color: "var(--mach-ink)", marginTop: 5 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div className="m-box" style={{ marginTop: 16 }}>
                <div className="m-box-h"><span className="m-label">Phenotype terms</span><span className="m-sub">8 PRESENT · 1 ABSENT</span></div>
                <table className="m-table">
                  <tbody>
                    {c.phenotypes.map((p, i) => (
                      <tr key={p.hpo} className="ody-fadein" style={stagger(i, 34, 100)}>
                        <td style={{ color: p.status === "Absent" ? "var(--mach-ink-3)" : "var(--mach-ink)" }}>{p.term}</td>
                        <td className="m-mono" style={{ fontSize: 10.5, width: 92 }}>{p.hpo}</td>
                        <td className="m-mono" style={{ fontSize: 10.5, width: 68 }}>{p.onset}</td>
                        <td style={{ width: 78 }}><span className="m-tag" data-tone={p.status === "Absent" ? "red" : undefined}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="m-box" style={{ marginTop: 16 }}>
                <div className="m-box-h"><span className="m-label">Completeness</span><span className="m-num">{c.completeness}%</span></div>
                <div className="m-box-b">
                  {c.completenessBreakdown.map((b, i) => (
                    <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 62px 28px", gap: 12, alignItems: "center", marginBottom: 9 }}>
                      <span className="m-body">{b.label}</span>
                      <div className="m-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 45, 200) }} /></div>
                      <span className="m-mono" style={{ fontSize: 10.5, textAlign: "right" }}>{b.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="m-box" style={{ marginTop: 16 }}>
                <div className="m-box-h"><span className="m-label">Genetics</span></div>
                <div className="m-box-b">
                  {c.genetics.map((g, i) => (
                    <div key={i} style={{ padding: "9px 0", borderBottom: i < 3 ? "1px solid var(--mach-line)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                        <span className="m-mono" style={{ fontSize: 11.5, color: g.gene === "—" ? "var(--mach-ink-3)" : "var(--blue)" }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                        <span className="m-tag" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                      </div>
                      <div className="m-sub" style={{ marginTop: 4 }}>{g.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">Human · clinical narrative</div>
              <p className="h-body" style={{ marginTop: 14, fontFamily: "var(--font-human)", fontSize: 16.5, lineHeight: 1.72 }}>{c.narrative}</p>

              <div style={{ marginTop: 26 }}>
                <div className="h-label">Clinical timeline</div>
                {c.timeline.map((t, i) => (
                  <div key={i} className="c10-tl-item ody-fadein" style={stagger(i, 45, 120)}>
                    <div className="c10-tl-age">{t.age}</div>
                    <div>
                      <div className="h-sub" style={{ fontSize: 15.5 }}>{t.label}</div>
                      <div className="h-small" style={{ marginTop: 3 }}>{t.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 26 }}>
                <div className="h-label">What the clinician is watching</div>
                <div className="h-note" style={{ marginTop: 12 }}>
                  “The regression after a febrile illness is the part that does not fit an ordinary delay. The younger
                  brother is now two and beginning to show the same hypotonia. That is what makes this urgent.”
                </div>
                <div className="h-small" style={{ marginTop: 10 }}>{doctor.name} · {doctor.role}</div>
              </div>

              <div style={{ marginTop: 26 }}>
                <div className="h-label">Family pattern</div>
                <div style={{ marginTop: 12, color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={230} /></div>
                <p className="h-small" style={{ marginTop: 10 }}>{c.family.notes}</p>
              </div>

              <div style={{ marginTop: 26 }}>
                <div className="h-label">What has been excluded</div>
                <ul className="h-list" style={{ marginTop: 10 }}>
                  {c.negativeEvidence.map((n, i) => (
                    <li key={i} style={{ fontSize: 13.5, color: "var(--ink-2)", padding: "9px 0" }}>{n}</li>
                  ))}
                </ul>
              </div>
            </>
          }
        />
      </section>
    </>
  );
}

/* ------------------------------ MATCH ------------------------------ */

function Match() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">Potential cross-border match · {match.id}</div>
          <h1 className="h-display" style={{ marginTop: 14 }}>{caseKZ.id} and {caseDE.id}</h1>
        </div>
        <Disclaimer />
      </header>

      <section className="c10-sec">
        <Handoff machine="Similarity computed across 8 evidence groups" human="Meaning established by two clinicians" />
        <Split
          machine={
            <>
              <div className="m-label">Machine · what was measured</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 14 }}>
                <span className="m-num" style={{ fontSize: 44, color: "var(--blue)" }}>{match.aggregate}</span>
                <div>
                  <div className="m-title">Aggregate evidence similarity</div>
                  <div className="m-sub" style={{ marginTop: 4 }}>NOT A DIAGNOSTIC PROBABILITY</div>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                {matchEvidence.map((e, i) => (
                  <div key={e.id} className="m-row ody-fadein" style={{ gridTemplateColumns: "1fr 40px 96px", alignItems: "center", ...stagger(i, 50, 100) }}>
                    <div>
                      <div className="m-body" style={{ color: "var(--mach-ink)" }}>{e.label}</div>
                      <div className="m-sub" style={{ marginTop: 3 }}>{e.direction === "divergent" ? "DIVERGENT" : e.weight.toUpperCase()}</div>
                    </div>
                    <span className="m-num" style={{ fontSize: 15, textAlign: "right", color: e.direction === "divergent" ? "var(--amber)" : undefined }}>{e.score}</span>
                    <div className="m-bar" style={{ height: 5 }}>
                      <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : undefined, ...stagger(i, 50, 200) }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", placeItems: "center", marginTop: 22, color: "var(--mach-ink-3)", "--radar-fill": "var(--blue)", "--radar-stroke": "var(--blue)", "--radar-fill-opacity": 0.1 } as React.CSSProperties}>
                <Radar values={matchEvidence.map((e) => e.score)} labels={["PHEN", "TRAJ", "GEN", "FAM", "LAB", "IMG", "NEG", "TIME"]} size={250} />
              </div>

              <div className="m-box" style={{ marginTop: 20 }}>
                <div className="m-box-h"><span className="m-label">Query provenance</span></div>
                <div className="m-box-b">
                  {match.reasoningSteps.map((s, i) => (
                    <div key={s.id} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, paddingBottom: 11 }}>
                      <span className="m-mono" style={{ fontSize: 9.5, color: "var(--blue)" }}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="m-body" style={{ color: "var(--mach-ink)" }}>{s.label}</div>
                        <div className="m-sub" style={{ marginTop: 3 }}>{s.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">Human · what it might mean</div>
              <h2 className="h-title" style={{ marginTop: 14 }}>
                Two children, 4,000 km apart, with the same variant and the same brain.
              </h2>
              <p className="h-body" style={{ marginTop: 16 }}>
                Both cases carry the identical coding change in NDUFAF6. In Heidelberg a second, deep intronic allele was
                found only after long-read sequencing — a test ODY-001 has not had. If the same allele is present in
                Astana, two unsolved cases become one candidate gene–disease relationship.
              </p>

              <div className="h-note" style={{ marginTop: 20 }}>
                “I would not call this a diagnosis. I would call it the first time in three years that the case has had
                somewhere to go.”
              </div>
              <div className="h-small" style={{ marginTop: 10 }}>{doctor.name}, on accepting the match for review</div>

              <div style={{ marginTop: 28 }}>
                <div className="h-label">Where the cases diverge</div>
                {match.divergenceNotes.map((d, i) => (
                  <p key={i} className="h-body" style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < 2 ? "1px solid var(--line-h)" : "none" }}>{d}</p>
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <div className="h-label">What happens next</div>
                <ol style={{ margin: "12px 0 0", paddingLeft: 20, fontSize: 14.5, lineHeight: 1.8, color: "var(--ink-2)" }}>
                  {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 6 }}>{n}</li>)}
                </ol>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
                <button className="c10-btn">Request collaboration</button>
                <button className="c10-btn" data-variant="ghost">Not a match</button>
              </div>

              <div style={{ marginTop: 30 }}>
                <div className="h-label">Other candidates the system returned</div>
                <ul className="h-list" style={{ marginTop: 10 }}>
                  {otherCandidates.map((o) => (
                    <li key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 44px", gap: 14, alignItems: "baseline" }}>
                      <div>
                        <div style={{ fontSize: 14 }}>{o.id} · {o.country}</div>
                        <div className="h-small" style={{ marginTop: 3 }}>{o.note}</div>
                      </div>
                      <span className="m-num" style={{ fontSize: 15, textAlign: "right" }}>{o.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        />
      </section>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">Case comparison · {match.id}</div>
          <h1 className="h-display" style={{ marginTop: 14 }}>Kazakhstan / Germany</h1>
        </div>
        <Disclaimer />
      </header>

      <section className="c10-sec">
        <Handoff machine="Every recorded signal aligned automatically" human="Read by two clinicians, row by row" />
        <div className="m-box" style={{ marginTop: 2 }}>
          <div className="c10-cmp" style={{ background: "var(--mach-2)", borderBottom: "1px solid var(--mach-line)", fontFamily: "var(--font-mach)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mach-ink-3)", padding: "12px 14px" }}>
            <span>Signal</span><span>{caseKZ.id} · KZ</span><span style={{ color: "var(--blue)" }}>{caseDE.id} · DE</span><span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "12px 14px 6px", borderBottom: "1px solid var(--mach-line)", background: "#fff" }}>
                <span className="m-label">{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c10-cmp ody-fadein" style={{ background: "#fff", ...stagger(i, 20, gi * 40) }}>
                  <span style={{ color: "var(--mach-ink-3)" }}>{r.label}</span>
                  <span style={{ color: "var(--mach-ink)" }}>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--blue)" : "var(--mach-ink)" }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="m-tag" data-tone={r.agreement === "match" ? "green" : r.agreement === "differ" ? "amber" : r.agreement.startsWith("only") ? "blue" : undefined}>{LABEL[r.agreement]}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="c10-sec">
        <Split
          machine={
            <>
              <div className="m-label">Machine · computed views</div>
              <div className="m-box" style={{ marginTop: 14 }}>
                <div className="m-box-h"><span className="m-label">Phenotype overlap</span></div>
                <div className="m-box-b">
                  <svg viewBox="0 0 160 88" style={{ width: "100%" }} aria-hidden>
                    <circle className="ody-nodein" cx="60" cy="44" r="36" fill="var(--mach-ink)" fillOpacity="0.05" stroke="var(--mach-ink-3)" strokeWidth="0.7" />
                    <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="44" r="36" fill="var(--blue)" fillOpacity="0.09" stroke="var(--blue)" strokeWidth="0.7" />
                    <text x="36" y="49" textAnchor="middle" fontSize="12" fontFamily="var(--font-mach)" fill="var(--mach-ink-2)">{phenotypeOverlap.onlyKZ}</text>
                    <text x="80" y="50" textAnchor="middle" fontSize="17" fontFamily="var(--font-mach)" fill="var(--mach-ink)">{phenotypeOverlap.shared}</text>
                    <text x="124" y="49" textAnchor="middle" fontSize="12" fontFamily="var(--font-mach)" fill="var(--blue)">{phenotypeOverlap.onlyDE}</text>
                  </svg>
                </div>
              </div>
              <div className="m-box" style={{ marginTop: 14 }}>
                <div className="m-box-h"><span className="m-label">Trajectory · months</span></div>
                <div className="m-box-b">
                  <div style={{ color: "var(--mach-ink-3)", "--track-a": "var(--mach-ink)", "--track-b": "var(--blue)" } as React.CSSProperties}>
                    <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="KZ" labelB="DE" height={118} />
                  </div>
                </div>
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">Human · what the clinicians noticed</div>
              <ul className="h-list" style={{ marginTop: 14 }}>
                <li>
                  <div className="h-sub">The regression trigger is the same</div>
                  <p className="h-body" style={{ marginTop: 6 }}>
                    Both children lost skills after an ordinary childhood infection — febrile illness in one,
                    gastroenteritis in the other, within a month of the same age.
                  </p>
                </li>
                <li>
                  <div className="h-sub">Valproate was stopped for the same reason</div>
                  <p className="h-body" style={{ marginTop: 6 }}>
                    Transaminase rise in both, weeks apart in the course. A small detail, and not one a database would
                    have been asked to compare.
                  </p>
                </li>
                <li>
                  <div className="h-sub">The families differ, but the region does not</div>
                  <p className="h-body" style={{ marginTop: 6 }}>
                    One pedigree is consanguineous and the other is not. Both trace to the same regional community, which
                    keeps a founder allele plausible.
                  </p>
                </li>
              </ul>
              <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={160} /></div>
                <div style={{ color: "var(--sienna)" }}><Pedigree consanguineous={false} affected={[1]} size={160} /></div>
              </div>
            </>
          }
        />
      </section>

      <section className="c10-sec" style={{ display: "flex", justifyContent: "space-between", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
        <p className="h-body" style={{ maxWidth: "64ch", margin: 0 }}>
          <b style={{ color: "var(--sienna)" }}>Requires clinician review.</b> A comparison describes similarity between
          two recorded cases. It does not establish a diagnosis for either patient.
        </p>
        <button className="c10-btn">Open collaboration room</button>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="h-label">Collaboration · {collaboration.roomId}</div>
          <h1 className="h-display" style={{ marginTop: 14 }}>{doctor.shortName} &amp; {counterpart.shortName}</h1>
          <p className="h-lede" style={{ marginTop: 14 }}>
            Two clinicians who had never met, reading each other's evidence. {collaboration.security}.
          </p>
        </div>
        <Disclaimer />
      </header>

      <section className="c10-sec">
        <Handoff machine="Match proposed by the system · 12 days ago" human="Verified by clinicians · 1 of 2" />
        <Split
          bias="human"
          machine={
            <>
              <div className="m-label">Machine · room state</div>
              <div className="m-box" style={{ marginTop: 14 }}>
                <div className="m-box-h"><span className="m-label">Stage</span><span className="m-sub">{s.stageIndex + 1}/{s.stages.length}</span></div>
                <div className="m-box-b">
                  {s.stages.map((st, i) => (
                    <div key={st} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 10, padding: "7px 0", ...stagger(i, 80) }}>
                      <span style={{ color: i < s.stageIndex ? "var(--green)" : i === s.stageIndex ? "var(--blue)" : "var(--mach-ink-3)", fontSize: 11 }}>
                        {i < s.stageIndex ? "■" : i === s.stageIndex ? "▶" : "□"}
                      </span>
                      <span className="m-body" style={{ color: i <= s.stageIndex ? "var(--mach-ink)" : undefined }}>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="m-box" style={{ marginTop: 14 }}>
                <div className="m-box-h"><span className="m-label">Shared evidence</span><span className="m-sub">{collaboration.documents.length}</span></div>
                <div className="m-box-b">
                  {collaboration.documents.map((d, i) => (
                    <div key={d.label} style={{ padding: "8px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--mach-line)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span className="m-mono" style={{ fontSize: 11 }}>{d.label}</span>
                        <span className="m-tag">{d.kind}</span>
                      </div>
                      <div className="m-sub" style={{ marginTop: 3 }}>{d.meta}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="m-box" style={{ marginTop: 14 }}>
                <div className="m-box-h"><span className="m-label">Decision log</span><span className="m-sub">IMMUTABLE</span></div>
                <div className="m-box-b">
                  {collaboration.decisionLog.map((d, i) => (
                    <div key={d.id} style={{ display: "grid", gridTemplateColumns: "14px 1fr 38px", gap: 9, padding: "7px 0", borderBottom: i < collaboration.decisionLog.length - 1 ? "1px solid var(--mach-line)" : undefined }}>
                      <span style={{ color: d.state === "done" ? "var(--green)" : d.state === "pending" ? "var(--amber)" : "var(--mach-ink-3)", fontSize: 10 }}>{d.state === "done" ? "■" : "□"}</span>
                      <div>
                        <div className="m-body" style={{ color: d.state === "blocked" ? "var(--mach-ink-3)" : "var(--mach-ink)" }}>{d.action}</div>
                        <div className="m-sub" style={{ marginTop: 2 }}>{d.actor}</div>
                      </div>
                      <span className="m-sub" style={{ textAlign: "right" }}>{d.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          }
          human={
            <>
              <div className="h-label">Human · the conversation</div>
              {collaboration.messages.map((m, i) => (
                <div key={m.id} className="c10-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
                  {m.author !== "system" ? (
                    <div>
                      <div className="h-sub" style={{ fontSize: 15.5 }}>{m.name}</div>
                      <div className="h-small" style={{ marginTop: 4 }}>{m.role}</div>
                      <div className="m-sub" style={{ marginTop: 8 }}>{m.time} AGO</div>
                    </div>
                  ) : (
                    <div className="m-label">System · {m.time} ago</div>
                  )}
                  <div>
                    {m.kind === "proposal" && <span className="h-tag" data-tone="sienna" style={{ marginBottom: 10 }}>Proposal</span>}
                    <p style={{ fontFamily: m.author === "system" ? "var(--font-ui)" : "var(--font-human)", fontSize: m.author === "system" ? 12.5 : 16, lineHeight: 1.72, margin: 0, color: m.author === "system" ? "var(--mach-ink-2)" : "var(--ink-2)" }}>
                      {m.body}
                    </p>
                    {m.attachment && (
                      <div style={{ marginTop: 14, border: "1px solid var(--mach-line)", background: "var(--mach)", padding: "10px 13px" }}>
                        <div className="m-mono" style={{ fontSize: 11.5 }}>{m.attachment.label}</div>
                        <div className="m-sub" style={{ marginTop: 3 }}>{m.attachment.meta}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 22, alignItems: "center" }}>
                <div className="c10-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
                <button className="c10-btn">Send</button>
              </div>

              <div style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid var(--line-h)" }}>
                <div className="h-label">Verification</div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ paddingBottom: 14, borderBottom: "1px solid var(--line-h)" }}>
                    <span className="h-tag" data-tone="green">Verified</span>
                    <div className="h-sub" style={{ marginTop: 10, fontSize: 15.5 }}>{s.verificationA}</div>
                    <p className="h-small" style={{ marginTop: 5 }}>Evidence supports a clinically meaningful similarity</p>
                  </div>
                  <div style={{ paddingTop: 14 }}>
                    <span className="h-tag" data-tone="amber">Pending</span>
                    <div className="h-sub" style={{ marginTop: 10, fontSize: 15.5, color: "var(--ink-3)" }}>{s.verificationB}</div>
                    <p className="h-small" style={{ marginTop: 5 }}>Awaiting second clinician</p>
                  </div>
                </div>
                <div className="h-note" style={{ marginTop: 18 }}>
                  “A connection enters the network record only when two independent clinicians agree it is real. The
                  system never verifies its own suggestion.”
                </div>
              </div>
            </>
          }
        />
      </section>
    </>
  );
}
