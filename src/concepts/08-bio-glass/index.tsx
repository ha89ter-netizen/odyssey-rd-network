"use client";

import * as React from "react";
import "@/ui/theme.css";
import type { ScreenId } from "@/lib/concepts";
import { NodeField, WorldMap, TrajectoryChart, Pedigree, Spark, Ring, Radar, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

const NAV: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Overview" },
  { id: "create", label: "New case" },
  { id: "case", label: "Case" },
  { id: "match", label: "Match" },
  { id: "compare", label: "Compare" },
  { id: "room", label: "Collaboration" },
];

export default function BioGlass({ screen }: { screen: ScreenId }) {
  return (
    <div className="og ody-surface">
      <div className="og-atmos">
        <NodeField seed={41} count={40} className="og-atmos-net" />
      </div>

      <header className="og-top">
        <div className="og-mark">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M6 3c0 5 10 5 10 10M16 3c0 5-10 5-10 10M6 19c0-3 10-3 10-6" stroke="var(--teal)" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="6" cy="3" r="1.7" fill="var(--ice)" /><circle cx="16" cy="3" r="1.7" fill="var(--ice)" />
            <circle cx="11" cy="13" r="1.7" fill="var(--teal)" />
          </svg>
          ODYSSEY
        </div>
        <nav className="og-nav">
          {NAV.map((n) => <span key={n.id} className="og-navitem" data-on={n.id === screen}>{n.label}</span>)}
        </nav>
        <div className="og-topright">
          <span>412 INSTITUTIONS</span>
          <span style={{ color: "var(--teal-deep)" }}>● INDEX LIVE</span>
          <span>{doctor.initials} · {doctor.countryCode}</span>
        </div>
      </header>

      <div className="og-page">
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

const Disclaimer = () => <span className="og-disclaimer">◆ {DISCLAIMER}</span>;

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="og-sechead">
    <div>
      <div className="og-eyebrow">{label}</div>
      {note && <div className="og-small" style={{ marginTop: 7 }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-end", padding: "8px 4px 0" }}>
        <div>
          <div className="og-eyebrow">{PRODUCT.tagline}</div>
          <h1 className="og-h1" style={{ marginTop: 14 }}>{doctor.greeting}, {doctor.name}</h1>
          <p className="og-lede" style={{ marginTop: 12 }}>
            Twelve cases unresolved. Four candidate relationships returned overnight; one of them crosses a border and
            is waiting for your assessment.
          </p>
        </div>
        <Disclaimer />
      </header>

      {/* the one floating layer */}
      <section className="og-sec">
        <div className="og-glass ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", overflow: "hidden" }}>
          <div style={{ padding: "26px 28px 28px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span className="og-pill" data-tone="teal">Potential match</span>
              <span className="og-small">{match.surfaced}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22, flexWrap: "wrap" }}>
              <div>
                <div className="og-num" style={{ fontSize: 30 }}>{caseKZ.id}</div>
                <div className="og-small">{caseKZ.country}</div>
              </div>
              <svg width="80" height="18" viewBox="0 0 80 18" fill="none" aria-hidden>
                <path className="ody-drawin" style={{ "--dash": 80, "--d": "500ms" } as React.CSSProperties} d="M2 9C22 9 30 3 44 3s24 6 34 6" stroke="var(--teal)" strokeWidth="1.4" strokeDasharray="80" />
                <circle className="ody-nodein" style={{ "--d": "1200ms" } as React.CSSProperties} cx="44" cy="3" r="2.6" fill="var(--teal)" />
              </svg>
              <div>
                <div className="og-num" style={{ fontSize: 30, color: "var(--teal-deep)" }}>{caseDE.id}</div>
                <div className="og-small">{caseDE.country}</div>
              </div>
            </div>
            <p className="og-lede" style={{ marginTop: 20, fontSize: 14.5 }}>
              {match.concordantGroups} of {match.totalGroups} evidence groups concordant across phenotype, imaging,
              laboratory and treatment response. {match.confidenceNote}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <button className="og-btn">Review evidence</button>
              <button className="og-btn" data-variant="ghost">Defer</button>
            </div>
          </div>
          <div style={{ borderLeft: "1px solid var(--line)", padding: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="og-eyebrow">Federated query</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
              {[[match.cohortsQueried.toLocaleString(), "Cohorts"], [String(match.countriesQueried), "Countries"], [match.candidatesScreened.toLocaleString(), "Screened"], [String(match.candidatesReturned), "Returned"]].map(([v, l], i) => (
                <div key={l} className="ody-fadein" style={stagger(i, 80, 300)}>
                  <div className="og-num" style={{ fontSize: 21, color: i === 3 ? "var(--teal-deep)" : undefined }}>{v}</div>
                  <div className="og-small" style={{ fontSize: 11 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" labelSize={1.7} />
            </div>
          </div>
        </div>
      </section>

      <section className="og-sec">
        <SecHead label="Cases requiring attention" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {attention.map((a, i) => (
            <div key={a.id} className="og-flat ody-rise" style={{ padding: "18px 20px", ...stagger(i, 70, 120) }}>
              <div className="og-small" style={{ fontSize: 12.5 }}>{a.label}</div>
              <div className="og-num" style={{ fontSize: 38, marginTop: 8, color: a.tone === "signal" ? "var(--teal-deep)" : a.tone === "alert" ? "var(--coral)" : "var(--ink)" }}>
                {String(a.count).padStart(2, "0")}
              </div>
              <div className="og-small" style={{ marginTop: 8 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <SecHead label="Unresolved cases" note="12 in the index · 6 shown" />
          <div className="og-solid">
            <table className="og-table">
              <thead><tr><th style={{ width: 92 }}>Case</th><th>Presentation</th><th style={{ width: 130 }}>Status</th><th style={{ width: 130 }}>Completeness</th></tr></thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 140)}>
                    <td className="og-mono" style={{ color: r.caseId === "ODY-001" ? "var(--teal-deep)" : undefined }}>{r.caseId}</td>
                    <td style={{ color: "var(--ink-2)" }}>{r.summary}<div className="og-small" style={{ marginTop: 3 }}>{r.ageGroup} · {r.updated}</div></td>
                    <td><span className="og-pill" data-tone={r.status === "Match proposed" ? "teal" : r.status === "Verified" ? "ice" : undefined}>{r.status}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="og-bar" style={{ flex: 1 }}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 220) }} /></div>
                        <span className="og-mono og-small">{r.completeness}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <SecHead label="Network activity" />
            <div className="og-solid og-b">
              {networkActivity.map((a, i) => (
                <div key={a.id} className="ody-fadein" style={{ padding: "11px 0", borderBottom: i < networkActivity.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 55, 200) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</span>
                    <span className="og-mono og-small">{a.time}</span>
                  </div>
                  <div className="og-small" style={{ marginTop: 3 }}>{a.detail}</div>
                  <span className="og-pill" style={{ marginTop: 8, height: 20, fontSize: 9 }}>{a.origin}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Matching outcomes</h2><span className="og-eyebrow">90 days</span></div>
            <div className="og-b">
              {contributionMetrics.map((m, i) => (
                <div key={m.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                    <span>{m.label}</span>
                    <span className="og-mono">{m.value}<span style={{ color: "var(--ink-4)" }}>/{m.of}</span></span>
                  </div>
                  <div className="og-bar"><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div className="og-eyebrow">Queries / month</div>
                  <div className="og-num" style={{ fontSize: 26, marginTop: 4 }}>52</div>
                </div>
                <div style={{ color: "var(--teal)" }}><Spark data={querySeries} w={132} h={36} area /></div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {networkStats.map((s) => (
              <div key={s.id} className="og-flat" style={{ padding: "14px 16px" }}>
                <div className="og-num" style={{ fontSize: 21 }}>{s.value}</div>
                <div className="og-small" style={{ marginTop: 5, fontSize: 11.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end", padding: "8px 4px 0" }}>
        <div>
          <div className="og-eyebrow">New case</div>
          <h1 className="og-h1" style={{ marginTop: 14 }}>Create case</h1>
          <p className="og-lede" style={{ marginTop: 12 }}>
            Nine sections turn a clinical picture into structured signals. The record stays at your institution; only
            the signals are queried.
          </p>
        </div>
        <Disclaimer />
      </header>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "minmax(200px, 260px) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <aside className="og-solid">
          <div className="og-h"><h2 className="og-h2">Sections</h2><span className="og-mono og-small">3 / 9</span></div>
          {intakeSteps.map((s, i) => (
            <div key={s.id} className="og-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
              <span className="og-mono og-small" style={{ color: s.state === "active" ? "var(--teal-deep)" : undefined }}>{s.index}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: s.state === "active" ? 700 : 500 }}>{s.label}</div>
                {s.state === "active" && <div className="og-small" style={{ marginTop: 4 }}>{s.description}</div>}
              </div>
            </div>
          ))}
        </aside>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="og-pill" data-tone="ice">HPO normalised</span>} />
          <div className="og-solid og-b">
            {active.fields.map((f) => (
              <div key={f.label} className="og-field">
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{f.label}</div>
                  {f.hint && <div className="og-small" style={{ marginTop: 5 }}>{f.hint}</div>}
                </div>
                {f.kind === "chips" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {f.value.split(" · ").map((v) => (
                      <span key={v} className="og-pill" style={{ textTransform: "none", letterSpacing: "0.01em", fontFamily: "var(--font-ui)", fontSize: 11.5 }}>{v}</span>
                    ))}
                  </div>
                ) : (
                  <div className="og-input">{f.value}</div>
                )}
              </div>
            ))}
          </div>

          <div className="og-sec">
            <SecHead label="09 — Documents · AI-assisted extraction" note="Parsed at your institution. Terms require clinician verification before indexing." />
            <div className="og-glass" style={{ overflow: "hidden" }}>
              <div className="og-h" style={{ borderColor: "rgba(255,255,255,0.7)" }}>
                <div>
                  <div className="og-mono" style={{ fontSize: 13 }}>{aiExtraction.document}</div>
                  <div className="og-small" style={{ marginTop: 3 }}>{aiExtraction.pages} pages · {aiExtraction.processedAt}</div>
                </div>
                <button className="og-btn" data-variant="ghost">Upload report</button>
              </div>
              <div className="og-b" style={{ paddingBottom: 6 }}>
                <div className="og-notice">
                  <span style={{ color: "var(--teal-deep)" }}>◆</span>
                  <span><b>AI-assisted extraction, not diagnosis.</b> {aiExtraction.notice.replace("AI-assisted extraction. ", "")}</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                {aiExtraction.terms.map((t, i) => (
                  <div key={t.hpo} className="og-term ody-fadein" style={stagger(i, 55, 140)}>
                    <div>
                      <div style={{ display: "flex", gap: 11, alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                        <span className="og-mono og-small">{t.hpo} · {t.page}</span>
                      </div>
                      <div className="og-quote">{t.evidence}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", justifyContent: "flex-end" }}>
                        <span className="og-mono og-small">{Math.round(t.confidence * 100)}%</span>
                        <div className="og-bar" style={{ width: 66, height: 4 }}><i style={{ width: `${t.confidence * 100}%` }} /></div>
                      </div>
                      {t.state === "confirmed" ? (
                        <span className="og-pill" data-tone="teal">✓ Confirmed</span>
                      ) : t.state === "rejected" ? (
                        <span className="og-pill" data-tone="coral">Rejected</span>
                      ) : (
                        <div style={{ display: "flex", gap: 6 }}>
                          <span className="og-pill" data-tone="teal">Confirm</span>
                          <span className="og-pill">Edit</span>
                          <span className="og-pill">Reject</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="og-b" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span className="og-small">3 confirmed · 3 awaiting review · 1 rejected</span>
                <button className="og-btn">Verify and index</button>
              </div>
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
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-start", padding: "8px 4px 0" }}>
        <div style={{ maxWidth: "64ch" }}>
          <div style={{ display: "flex", gap: 11, alignItems: "center", flexWrap: "wrap" }}>
            <h1 className="og-h1">{c.id}</h1>
            <span className="og-pill" data-tone="amber">{c.status}</span>
            <span className="og-pill" data-tone="teal">1 potential match</span>
          </div>
          <p className="og-lede" style={{ marginTop: 13 }}>{c.headline}</p>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <dl className="og-kv">
            <dt>Country</dt><dd>{c.country}</dd>
            <dt>Age group</dt><dd>{c.ageGroup}</dd>
            <dt>Genetic</dt><dd>Unresolved</dd>
          </dl>
          <div style={{ textAlign: "center", color: "var(--teal)" }}>
            <Ring value={c.completeness} size={74} thickness={5} delay={300}>
              <span className="og-num" style={{ fontSize: 18, color: "var(--ink)" }}>{c.completeness}</span>
            </Ring>
            <div className="og-eyebrow" style={{ marginTop: 7 }}>Complete</div>
          </div>
        </div>
      </header>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical summary" />
          <div className="og-glass og-b">
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--ink-2)", margin: 0 }}>{c.narrative}</p>
          </div>

          <div className="og-sec">
            <SecHead label="Phenotype profile" note="8 present · 1 explicitly absent" />
            <div className="og-solid">
              <table className="og-table">
                <thead><tr><th>Term</th><th style={{ width: 100 }}>HPO</th><th style={{ width: 80 }}>Onset</th><th style={{ width: 88 }}>Severity</th><th style={{ width: 92 }}>Status</th></tr></thead>
                <tbody>
                  {c.phenotypes.map((p, i) => (
                    <tr key={p.hpo} className="ody-fadein" style={stagger(i, 36, 100)}>
                      <td style={{ fontWeight: 600, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>
                        {p.term}
                        {!p.verified && <span className="og-small" style={{ color: "var(--amber)" }}> · unverified</span>}
                      </td>
                      <td className="og-mono og-small">{p.hpo}</td>
                      <td className="og-mono">{p.onset}</td>
                      <td className="og-small">{p.severity}</td>
                      <td><span className="og-pill" data-tone={p.status === "Absent" ? "coral" : p.status === "Present" ? "ice" : undefined}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="og-sec">
            <SecHead label="Clinical timeline" />
            <div className="og-solid og-b">
              <div className="og-tl">
                {c.timeline.map((t, i) => (
                  <div key={i} className="og-tl-item ody-rise" data-kind={t.kind} style={stagger(i, 50, 120)}>
                    <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                      <span className="og-mono og-small" style={{ width: 62, flex: "none" }}>{t.age}</span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.label}</div>
                        <div className="og-small" style={{ marginTop: 3 }}>{t.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 22 }}>
          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Case completeness</h2><span className="og-num">{c.completeness}%</span></div>
            <div className="og-b">
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 56px 30px", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5 }}>{b.label}</span>
                  <div className="og-bar" style={{ height: 4 }}><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 200) }} /></div>
                  <span className="og-mono og-small" style={{ textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Genetic information</h2></div>
            <div className="og-b">
              <p className="og-small" style={{ marginTop: 0 }}>{c.geneticSummary}</p>
              {c.genetics.map((g, i) => (
                <div key={i} style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span className="og-mono" style={{ fontSize: 12.5 }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                    <span className="og-pill" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                  </div>
                  <div className="og-small" style={{ marginTop: 4 }}>{g.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Potential matching signals</h2><span className="og-pill" data-tone="teal">{c.signals.length}</span></div>
            <div className="og-b">
              {c.signals.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "8px 0", borderBottom: i < c.signals.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span className="og-mono og-small">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 12.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Family pattern</h2></div>
            <div className="og-b" style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={210} /></div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Negative evidence</h2></div>
            <div className="og-b">
              {c.negativeEvidence.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, padding: "6px 0", color: "var(--ink-2)" }}><span style={{ color: "var(--coral)" }}>×</span>{n}</div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

/* ------------------------------ MATCH ------------------------------ */

function Match() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end", padding: "8px 4px 0" }}>
        <div>
          <div className="og-eyebrow">Potential cross-border match · {match.id}</div>
          <h1 className="og-h1" style={{ marginTop: 14 }}>{caseKZ.id} ↔ {caseDE.id}</h1>
          <div style={{ display: "flex", gap: 12, marginTop: 13, alignItems: "center", flexWrap: "wrap" }}>
            <span className="og-pill" data-tone="teal" style={{ height: 27 }}>{match.confidenceLabel}</span>
            <span className="og-small">{match.confidenceNote}</span>
          </div>
        </div>
        <Disclaimer />
      </header>

      <section className="og-sec">
        <div className="og-glass ody-rise" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", overflow: "hidden" }}>
          {[caseKZ, caseDE].map((c, i) => (
            <div key={c.id} style={{ padding: "22px 24px", borderRight: i === 0 ? "1px solid var(--line)" : undefined }}>
              <div className="og-eyebrow">{i === 0 ? "Your case" : "Network case"}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
                <span className="og-num" style={{ fontSize: 28, color: i === 1 ? "var(--teal-deep)" : undefined }}>{c.id}</span>
                <span style={{ fontSize: 15 }}>{c.country}</span>
              </div>
              <div className="og-small" style={{ marginTop: 7 }}>{c.institution}</div>
              <dl className="og-kv" style={{ marginTop: 14 }}>
                <dt>Age</dt><dd>{c.ageGroup}</dd>
                <dt>Status</dt><dd>{c.status}</dd>
                <dt>Complete</dt><dd className="og-mono">{c.completeness}%</dd>
              </dl>
            </div>
          ))}
          <div style={{ padding: "22px 24px", borderLeft: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--ink-4)", "--radar-fill": "var(--teal)", "--radar-stroke": "var(--teal-deep)", "--radar-fill-opacity": 0.14 } as React.CSSProperties}>
            <Radar values={matchEvidence.map((e) => e.score)} labels={["PHEN", "TRAJ", "GEN", "FAM", "LAB", "IMG", "NEG", "TIME"]} size={230} />
          </div>
        </div>
      </section>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <SecHead label="Evidence supporting similarity" note="Each group assessed independently. A score describes similarity of recorded evidence, not the probability of a diagnosis." />
          <div className="og-solid og-b">
            {matchEvidence.map((e, i) => (
              <div key={e.id} className="og-ev-row ody-fadein" style={stagger(i, 55, 100)}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.label}</div>
                  <span className="og-pill" data-tone={e.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 7, height: 20 }}>
                    {e.direction === "divergent" ? "Divergent" : e.weight}
                  </span>
                </div>
                <div>
                  <div className="og-num" style={{ fontSize: 24, color: e.direction === "divergent" ? "var(--amber)" : "var(--teal-deep)" }}>{e.score}</div>
                  <div className="og-bar" style={{ marginTop: 6, height: 5 }}>
                    <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : undefined, ...stagger(i, 55, 180) }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{e.summary}</div>
                  <div style={{ display: "flex", gap: 18, marginTop: 7, flexWrap: "wrap" }}>
                    <span className="og-mono og-small">KZ {e.kzValue}</span>
                    <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>DE {e.deValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="og-sec">
            <SecHead label="Where the cases diverge" note="Divergence is recorded, not hidden" />
            <div className="og-solid og-b">
              {match.divergenceNotes.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, padding: "11px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                  <span style={{ color: "var(--amber)" }}>△</span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 22 }}>
          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">How this match was found</h2></div>
            <div className="og-b">
              {match.reasoningSteps.map((s, i) => (
                <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, paddingBottom: 15, ...stagger(i, 80, 200) }}>
                  <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                    <div className="og-small" style={{ marginTop: 3 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="og-glass og-b">
            <div className="og-eyebrow">Requires clinician review</div>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, marginTop: 10 }}>{match.proposedAction}.</p>
            <ol style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
              {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 5 }}>{n}</li>)}
            </ol>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button className="og-btn">Request collaboration</button>
              <button className="og-btn" data-variant="ghost">Not a match</button>
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Other candidates</h2><span className="og-eyebrow">Same query</span></div>
            <div className="og-b">
              {otherCandidates.map((o, i) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div className="og-mono" style={{ fontSize: 12.5 }}>{o.id} · {o.country}</div>
                    <div className="og-small" style={{ marginTop: 3 }}>{o.note}</div>
                  </div>
                  <span className="og-num" style={{ fontSize: 17, color: "var(--ink-3)" }}>{o.score}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 22, flexWrap: "wrap", alignItems: "flex-end", padding: "8px 4px 0" }}>
        <div>
          <div className="og-eyebrow">Case comparison · {match.id}</div>
          <h1 className="og-h1" style={{ marginTop: 14 }}>Kazakhstan / Germany</h1>
        </div>
        <Disclaimer />
      </header>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
        <div className="og-solid og-b ody-rise">
          <div className="og-eyebrow">Phenotype overlap</div>
          <svg viewBox="0 0 160 92" style={{ width: "100%", marginTop: 12 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.8" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--teal)" fillOpacity="0.14" stroke="var(--teal)" strokeWidth="0.8" />
            <text x="34" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--ink-2)">{phenotypeOverlap.onlyKZ}</text>
            <text x="80" y="52" textAnchor="middle" fontSize="19" fontFamily="var(--font-data)" fill="var(--ink)">{phenotypeOverlap.shared}</text>
            <text x="126" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--teal-deep)">{phenotypeOverlap.onlyDE}</text>
          </svg>
        </div>
        <div className="og-solid og-b ody-rise" style={stagger(1, 110)}>
          <div className="og-eyebrow">Clinical trajectory · months</div>
          <div style={{ marginTop: 12, color: "var(--ink-4)", "--track-a": "var(--ink-2)", "--track-b": "var(--teal)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={118} rowLabels />
          </div>
        </div>
        <div className="og-solid og-b ody-rise" style={stagger(2, 110)}>
          <div className="og-eyebrow">Family pattern</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={144} /></div>
            <div style={{ color: "var(--teal)" }}><Pedigree consanguineous={false} affected={[1]} size={144} /></div>
          </div>
        </div>
      </section>

      <section className="og-sec">
        <div className="og-solid" style={{ overflow: "hidden" }}>
          <div className="og-cmp" style={{ background: "rgba(255,255,255,0.55)", borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", padding: "13px 18px" }}>
            <span>Signal</span><span>{caseKZ.id} · KZ</span><span style={{ color: "var(--teal-deep)" }}>{caseDE.id} · DE</span><span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "13px 18px 7px", borderBottom: "1px solid var(--line)" }}>
                <span className="og-eyebrow">{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="og-cmp ody-fadein" style={stagger(i, 22, gi * 45)}>
                  <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                  <span>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--teal-deep)" : undefined }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="og-pill" data-tone={r.agreement === "match" ? "teal" : r.agreement === "differ" ? "amber" : r.agreement.startsWith("only") ? "ice" : undefined} style={{ height: 19, fontSize: 9 }}>{LABEL[r.agreement]}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="og-sec" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="og-notice" style={{ maxWidth: "68ch" }}>
          <span style={{ color: "var(--teal-deep)" }}>◆</span>
          <span><b>Requires clinician review.</b> This comparison describes similarity between two recorded cases; it does not establish a diagnosis.</span>
        </div>
        <button className="og-btn">Open collaboration room</button>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-start", padding: "8px 4px 0" }}>
        <div>
          <div className="og-eyebrow">Secure collaboration · {collaboration.roomId}</div>
          <h1 className="og-h1" style={{ marginTop: 14 }}>{collaboration.title}</h1>
          <div style={{ display: "flex", gap: 10, marginTop: 13, flexWrap: "wrap" }}>
            <span className="og-pill" data-tone="teal">◈ End-to-end encrypted</span>
            <span className="og-pill">Opened {collaboration.opened}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {collaboration.participants.map((p, i) => (
            <div key={p.networkId} className="og-glass" style={{ padding: "14px 18px", minWidth: 225 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="og-av" data-a={i === 0}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{p.name}</div>
                  <div className="og-small">{p.city}, {p.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="og-sec">
        <div className="og-solid og-b">
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {s.stages.map((st, i) => (
              <React.Fragment key={st}>
                <div className="ody-fadein" style={{ display: "flex", alignItems: "center", gap: 10, ...stagger(i, 90) }}>
                  <span style={{ width: 24, height: 24, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 10, fontFamily: "var(--font-data)", background: i < s.stageIndex ? "var(--teal)" : i === s.stageIndex ? "var(--ink)" : "rgba(15,42,51,0.07)", color: i <= s.stageIndex ? "#fff" : "var(--ink-4)" }}>
                    {i < s.stageIndex ? "✓" : i + 1}
                  </span>
                  <span style={{ fontSize: 12.5, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)", fontWeight: i === s.stageIndex ? 700 : 500 }}>{st}</span>
                </div>
                {i < s.stages.length - 1 && <span style={{ flex: 1, minWidth: 20, height: 2, borderRadius: 99, background: i < s.stageIndex ? "var(--teal)" : "rgba(15,42,51,0.08)", margin: "0 14px" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="og-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" note={collaboration.security} />
          <div className="og-solid og-b">
            {collaboration.messages.map((m, i) => (
              <div key={m.id} className="og-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
                {m.author !== "system" && <div className="og-av" data-a={m.author === "A"}>{m.author === "A" ? doctor.initials : counterpart.initials}</div>}
                <div>
                  <div style={{ display: "flex", gap: 11, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: m.author === "system" ? "var(--ink-3)" : undefined }}>{m.author === "system" ? "ODYSSEY" : m.name}</span>
                    {m.author !== "system" && <span className="og-small">{m.role}</span>}
                    <span className="og-mono og-small" style={{ marginLeft: "auto" }}>{m.time}</span>
                    {m.kind === "proposal" && <span className="og-pill" data-tone="teal" style={{ height: 19, fontSize: 9 }}>Proposal</span>}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.72, color: "var(--ink-2)", margin: "8px 0 0" }}>{m.body}</p>
                  {m.attachment && (
                    <div style={{ marginTop: 12, borderRadius: 10, border: "1px solid var(--line)", background: "rgba(255,255,255,0.6)", padding: "10px 14px" }}>
                      <div className="og-mono" style={{ fontSize: 12 }}>{m.attachment.label}</div>
                      <div className="og-small" style={{ marginTop: 2 }}>{m.attachment.meta}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <div className="og-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
              <button className="og-btn">Send</button>
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 22 }}>
          <div className="og-glass og-b">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 className="og-h2">Verification status</h2>
              <span className="og-pill" data-tone="amber">1 of 2</span>
            </div>
            <div style={{ display: "flex", gap: 11, paddingBottom: 13, borderBottom: "1px solid var(--line)" }}>
              <span style={{ color: "var(--teal-deep)" }}>✓</span>
              <div><div style={{ fontSize: 13 }}>{s.verificationA}</div><div className="og-small" style={{ marginTop: 3 }}>Evidence supports a clinically meaningful similarity</div></div>
            </div>
            <div style={{ display: "flex", gap: 11, paddingTop: 13 }}>
              <span style={{ color: "var(--amber)" }}>○</span>
              <div><div style={{ fontSize: 13 }}>{s.verificationB}</div><div className="og-small" style={{ marginTop: 3 }}>Awaiting second clinician</div></div>
            </div>
            <p className="og-small" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              A connection enters the network record only when two independent clinicians verify it.
            </p>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Shared evidence</h2><span className="og-eyebrow">{collaboration.documents.length}</span></div>
            <div className="og-b">
              {collaboration.documents.map((d, i) => (
                <div key={d.label} style={{ padding: "10px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span className="og-mono" style={{ fontSize: 12 }}>{d.label}</span>
                    <span className="og-pill" style={{ height: 19, fontSize: 9 }}>{d.kind}</span>
                  </div>
                  <div className="og-small" style={{ marginTop: 3 }}>{d.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="og-solid">
            <div className="og-h"><h2 className="og-h2">Decision log</h2><span className="og-eyebrow">Immutable</span></div>
            <div className="og-b">
              <div className="og-tl">
                {collaboration.decisionLog.map((d) => (
                  <div key={d.id} className="og-tl-item" data-kind={d.state === "done" ? "treatment" : "stable"} style={{ paddingBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</span>
                      <span className="og-mono og-small">{d.time}</span>
                    </div>
                    <div className="og-small" style={{ marginTop: 2 }}>{d.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Disclaimer />
        </aside>
      </section>
    </>
  );
}
