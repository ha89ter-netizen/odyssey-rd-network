"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { Meter, Ring, Spark, TrajectoryChart, WorldMap, Pedigree, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

/* ---------------------------------------------------------------- */

const RAIL: { id: ScreenId | string; label: string; d: string }[] = [
  { id: "dashboard", label: "Overview", d: "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" },
  { id: "create", label: "New case", d: "M10 4v12M4 10h12" },
  { id: "case", label: "Case intelligence", d: "M4 16V7l6-3 6 3v9M4 16h12M8 16v-4h4v4" },
  { id: "match", label: "Matches", d: "M6 10a4 4 0 0 1 4-4M14 10a4 4 0 0 1-4 4M3 10h3M14 10h3" },
  { id: "compare", label: "Comparison", d: "M10 3v14M5 7l-2 3 2 3M15 7l2 3-2 3" },
  { id: "room", label: "Collaboration", d: "M4 15v-1a3 3 0 0 1 3-3h1M16 15v-1a3 3 0 0 0-3-3h-1M7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0M11 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0" },
];

const Glyph = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" aria-hidden>
    <path d={d} />
  </svg>
);

const CRUMBS: Record<ScreenId, string[]> = {
  dashboard: ["Network", "Overview"],
  create: ["Cases", "New case", "ODY-001"],
  case: ["Cases", "ODY-001", "Intelligence"],
  match: ["Matches", "ODY-M-2261"],
  compare: ["Matches", "ODY-M-2261", "Evidence comparison"],
  room: ["Collaboration", "ODY-ROOM-2261"],
};

/* ---------------------------------------------------------------- */

export default function ClinicalCommand({ screen }: { screen: ScreenId }) {
  return (
    <div className="c01 ody-surface">
      <div className="c01-frame">
        <aside className="c01-rail">
          <div className="c01-mark">OD</div>
          {RAIL.map((r) => (
            <div key={r.id} className="c01-railbtn" data-on={r.id === screen}>
              <Glyph d={r.d} />
              <span>{r.label}</span>
            </div>
          ))}
        </aside>

        <div>
          <div className="c01-topbar">
            <div className="c01-crumbs">
              {CRUMBS[screen].map((c, i, a) => (
                <React.Fragment key={c}>
                  {i === a.length - 1 ? <b>{c}</b> : <span>{c}</span>}
                  {i < a.length - 1 && <i>/</i>}
                </React.Fragment>
              ))}
            </div>
            <div className="c01-search">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="5" cy="5" r="3.5" /><path d="M8 8l3 3" /></svg>
              Search cases, phenotypes, genes
              <span className="c01-kbd">⌘K</span>
            </div>
            <div className="c01-who">
              <div className="c01-avatar">{doctor.initials}</div>
              <div className="hidden lg:block" style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{doctor.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{doctor.institution}</div>
              </div>
            </div>
          </div>

          <div className="c01-page">
            {screen === "dashboard" && <Dashboard />}
            {screen === "create" && <Create />}
            {screen === "case" && <CaseIntel />}
            {screen === "match" && <Match />}
            {screen === "compare" && <Compare />}
            {screen === "room" && <Room />}
          </div>
        </div>
      </div>
    </div>
  );
}

const Disclaimer = () => <div className="c01-disclaimer"><span className="c01-dot" />{DISCLAIMER}</div>;

const SectionHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c01-sechead">
    <div>
      <div className="c01-eyebrow">{label}</div>
      {note && <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ------------------------------ 1. DASHBOARD ------------------------------ */

function Dashboard() {
  const toneVar: Record<string, string> = { neutral: "var(--ink-4)", signal: "var(--accent)", alert: "var(--alert)", positive: "var(--ok)" };
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="c01-eyebrow">{PRODUCT.tagline}</div>
          <h1 className="c01-h1" style={{ marginTop: 14 }}>
            {doctor.greeting}, {doctor.name}
          </h1>
          <p className="c01-lede" style={{ marginTop: 12 }}>
            {doctor.department} · {doctor.institution}, {doctor.city}. Four cases in your queue have surfaced potential
            matches since your last session.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <Disclaimer />
          <div className="c01-mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
            {doctor.city.toUpperCase()} {doctor.localTime} · {doctor.networkId}
          </div>
        </div>
      </header>

      <div className="c01-sec">
        <SectionHead label="Cases requiring attention" note="Ordered by clinical urgency, not by recency." />
        <div className="c01-tiles">
          {attention.map((a, i) => (
            <div key={a.id} className="c01-tile ody-rise" style={{ ...stagger(i, 70, 80), "--tone": toneVar[a.tone] } as React.CSSProperties}>
              <div className="c01-tile-n" style={{ color: a.tone === "neutral" ? "var(--ink)" : toneVar[a.tone] }}>
                {String(a.count).padStart(2, "0")}
              </div>
              <div className="c01-tile-l">{a.label}</div>
              <div className="c01-tile-d">{a.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* the moment */}
      <div className="c01-sec">
        <div
          className="c01-panel ody-rise"
          style={{ ...stagger(0, 0, 320), borderColor: "var(--accent)", display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)" } as React.CSSProperties}
        >
          <div style={{ padding: "22px 24px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="c01-chip" data-tone="accent">New · {match.surfaced}</span>
              <span className="c01-eyebrow">Potential cross-border match</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20, flexWrap: "wrap" }}>
              <div>
                <div className="c01-num" style={{ fontSize: 26 }}>{caseKZ.id}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>{caseKZ.country} · {caseKZ.ageGroup}</div>
              </div>
              <svg width="72" height="16" viewBox="0 0 72 16" fill="none" aria-hidden>
                <path className="ody-drawin" style={{ "--dash": 72, "--d": "600ms" } as React.CSSProperties} d="M0 8h62" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="72" />
                <path d="M58 4l5 4-5 4" stroke="var(--accent)" strokeWidth="1.2" fill="none" className="ody-fadein" style={{ "--d": "1300ms" } as React.CSSProperties} />
              </svg>
              <div>
                <div className="c01-num" style={{ fontSize: 26, color: "var(--accent)" }}>{caseDE.id}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>{caseDE.country} · {caseDE.ageGroup}</div>
              </div>
            </div>
            <p className="c01-lede" style={{ marginTop: 18, fontSize: 13.5 }}>
              {match.concordantGroups} of {match.totalGroups} evidence groups are concordant, including imaging pattern,
              lactate profile and an identical coding variant of uncertain significance. {match.confidenceNote}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <button className="c01-btn">Review evidence</button>
              <button className="c01-btn" data-variant="ghost">Defer to case conference</button>
            </div>
          </div>
          <div style={{ borderLeft: "1px solid var(--line)", background: "var(--surface-2)", position: "relative", minHeight: 210, display: "grid", placeItems: "center", padding: 16 }}>
            <WorldMap
              nodes={networkNodes}
              edges={networkEdges}
              highlight={["kz", "de"]}
              labels={["kz", "de"]}
              crop="2 2 82 30"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="c01-sec">
<SectionHead
            label="Case queue"
            note="12 unresolved · 6 shown"
            right={<span className="c01-eyebrow">Completeness drives match quality</span>}
          />
          <div className="c01-panel">
            <table className="c01-table">
              <thead>
                <tr>
                  <th style={{ width: 92 }}>Case</th>
                  <th>Presentation</th>
                  <th style={{ width: 96 }}>Age</th>
                  <th style={{ width: 128 }}>Status</th>
                  <th style={{ width: 128 }}>Completeness</th>
                  <th style={{ width: 78 }}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 200)}>
                    <td className="num" style={{ fontWeight: 500 }}>
                      {r.caseId}
                      {r.priority === "Urgent" && <span style={{ color: "var(--alert)", marginLeft: 6 }}>▲</span>}
                    </td>
                    <td style={{ color: "var(--ink-2)" }}>{r.summary}</td>
                    <td style={{ color: "var(--ink-3)", fontSize: 12 }}>{r.ageGroup}</td>
                    <td>
                      <span
                        className="c01-chip"
                        data-tone={r.status === "Match proposed" ? "accent" : r.status === "Verified" ? "ok" : undefined}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="c01-bar" style={{ flex: 1 }}>
                          <i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 260) }} />
                        </div>
                        <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", width: 26 }}>{r.completeness}</span>
                      </div>
                    </td>
                    <td className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 34, alignItems: "start" }}>
        <section>

          <SectionHead label="Network activity" note="Across 412 member institutions" />
          <div className="c01-panel c01-panel-b">
            {networkActivity.map((a, i) => (
              <div key={a.id} className="c01-feed-item ody-fadein" style={stagger(i, 55, 260)}>
                <span className="c01-mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-4)", textTransform: "uppercase" }}>
                  {a.origin}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.5 }}>{a.detail}</div>
                </div>
                <span className="c01-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHead label="Your contribution" note="Signals you returned to the network" />
          <div className="c01-panel" >
            <div className="c01-panel-h">
              <h2 className="c01-h2">Matching outcomes</h2>
              <span className="c01-eyebrow">Last 90 days</span>
            </div>
            <div className="c01-panel-b">
              {contributionMetrics.map((m, i) => (
                <div key={m.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}>
                    <span>{m.label}</span>
                    <span className="c01-mono" style={{ color: "var(--ink-3)" }}>
                      {m.value} <span style={{ color: "var(--ink-4)" }}>/ {m.of}</span>
                    </span>
                  </div>
                  <div className="c01-bar">
                    <i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 360) }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 5 }}>{m.note}</div>
                </div>
              ))}
              <div className="c01-rule" style={{ margin: "18px 0 14px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div className="c01-eyebrow">Federated queries / month</div>
                  <div className="c01-num" style={{ fontSize: 24, marginTop: 6 }}>52</div>
                </div>
                <div style={{ color: "var(--accent)" }}>
                  <Spark data={querySeries} w={132} h={34} area />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="c01-sec">
        <SectionHead label="Network" note={PRODUCT.principle} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {networkStats.map((s, i) => (
            <div key={s.id} style={{ background: "var(--surface)", padding: "18px 20px" }} className="ody-fadein">
              <div className="c01-num" style={{ fontSize: 26 }}>{s.value}</div>
              <div style={{ fontSize: 12.5, marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>{s.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ 2. CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="c01-eyebrow">New case · structured intake</div>
          <h1 className="c01-h1" style={{ marginTop: 14 }}>Create case</h1>
          <p className="c01-lede" style={{ marginTop: 12 }}>
            Every field becomes a matchable signal. Structure is what allows a case in Astana to be compared with a case
            in Heidelberg without either institution sharing identifiable data.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "minmax(230px, 300px) minmax(0, 1fr)", gap: 34, alignItems: "start" }}>
        <aside>
          <SectionHead label="Sections" note="3 of 9 complete" />
          <div className="c01-steps">
            {intakeSteps.map((s, i) => (
              <div key={s.id} className="c01-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
                <span className="c01-mono" style={{ fontSize: 11, color: s.state === "active" ? "var(--accent)" : "var(--ink-4)" }}>{s.index}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: s.state === "active" ? 600 : 400 }}>{s.label}</div>
                  {s.state === "active" && <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{s.description}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="c01-notice" style={{ marginTop: 16 }}>
            <span style={{ color: "var(--accent)" }}>◆</span>
            <span><b>Completeness 82%.</b> Adding negative evidence and family history would raise match precision most.</span>
          </div>
        </aside>

        <div>
          <SectionHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="c01-chip" data-tone="accent">HPO normalised</span>} />
          <div className="c01-panel c01-panel-b">
            {active.fields.map((f) => (
              <div key={f.label} className="c01-field">
                <label style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                  {f.label}
                  {f.hint && <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4, lineHeight: 1.5 }}>{f.hint}</div>}
                </label>
                <div className="c01-field-v">
                  {f.kind === "chips" ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {f.value.split(" · ").map((v) => (
                        <span key={v} className="c01-chip" style={{ textTransform: "none", letterSpacing: "0.01em", fontSize: 11.5, fontFamily: "var(--font-ui)" }}>
                          {v}
                        </span>
                      ))}
                      <span className="c01-chip" data-tone="accent" style={{ cursor: "pointer" }}>+ Add term</span>
                    </div>
                  ) : (
                    <div className="c01-input">{f.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="c01-sec">
            <SectionHead label="09 — Documents" note="Reports are parsed at your institution. Nothing is transmitted before you verify it." />
            <div className="c01-panel">
              <div className="c01-panel-h">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="var(--ink-3)" strokeWidth="1.1"><path d="M3 1h8l4 4v14H3z" /><path d="M11 1v4h4" /><path d="M6 10h6M6 13h6M6 16h3" /></svg>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{aiExtraction.document}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{aiExtraction.pages} pages · {aiExtraction.processedAt}</div>
                  </div>
                </div>
                <button className="c01-btn" data-variant="ghost">Upload medical report</button>
              </div>

              <div className="c01-panel-b" style={{ paddingBottom: 0 }}>
                <div className="c01-notice" style={{ borderColor: "var(--accent)", background: "var(--accent-wash)" }}>
                  <span style={{ color: "var(--accent)" }}>◆</span>
                  <span><b>AI-assisted extraction.</b> {aiExtraction.notice.replace("AI-assisted extraction. ", "")}</span>
                </div>
              </div>

              <div className="c01-panel-b" style={{ paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <div className="c01-eyebrow">Phenotypes detected · {aiExtraction.terms.length}</div>
                  <div className="c01-eyebrow">Doctor verification required</div>
                </div>
                <div style={{ border: "1px solid var(--line)" }}>
                  {aiExtraction.terms.map((t, i) => (
                    <div key={t.hpo} className="c01-term ody-fadein" style={stagger(i, 60, 200)}>
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, fontWeight: 500, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>
                            {t.term}
                          </span>
                          <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{t.hpo}</span>
                          <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{t.page}</span>
                        </div>
                        <div className="c01-quote">{t.evidence}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="c01-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{Math.round(t.confidence * 100)}%</span>
                          <span className="c01-conf">
                            {[0, 1, 2, 3, 4].map((n) => (
                              <i key={n} data-on={t.confidence * 5 > n} />
                            ))}
                          </span>
                        </div>
                        {t.state === "confirmed" ? (
                          <span className="c01-chip" data-tone="ok">✓ Confirmed</span>
                        ) : t.state === "rejected" ? (
                          <span className="c01-chip" data-tone="alert">Rejected</span>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <span className="c01-chip" data-tone="accent" style={{ cursor: "pointer" }}>Confirm</span>
                            <span className="c01-chip" style={{ cursor: "pointer" }}>Edit</span>
                            <span className="c01-chip" style={{ cursor: "pointer" }}>Reject</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    3 confirmed · 3 awaiting review · 1 rejected. Only confirmed terms enter the matching index.
                  </span>
                  <button className="c01-btn">Confirm remaining and continue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ 3. CASE INTELLIGENCE ------------------------------ */

function CaseIntel() {
  const c = caseKZ;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "70ch" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 className="c01-h1">Case {c.id}</h1>
            <span className="c01-chip" data-tone="warn">{c.status}</span>
            <span className="c01-chip" data-tone="accent">1 potential match</span>
          </div>
          <p className="c01-lede" style={{ marginTop: 14 }}>{c.headline}</p>
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          <div>
            <div className="c01-eyebrow">Country</div>
            <div style={{ marginTop: 7, fontSize: 15 }}>{c.country}</div>
          </div>
          <div>
            <div className="c01-eyebrow">Age group</div>
            <div style={{ marginTop: 7, fontSize: 15 }}>{c.ageGroup}</div>
          </div>
          <div>
            <div className="c01-eyebrow">Genetic status</div>
            <div style={{ marginTop: 7, fontSize: 15 }}>Unresolved</div>
          </div>
          <div style={{ textAlign: "center", color: "var(--accent)" }}>
            <Ring value={c.completeness} size={62} thickness={3} delay={300}>
              <span className="c01-num" style={{ fontSize: 15, color: "var(--ink)" }}>{c.completeness}</span>
            </Ring>
            <div className="c01-eyebrow" style={{ marginTop: 6 }}>Complete</div>
          </div>
        </div>
      </header>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 34, alignItems: "start" }}>
        <div>
          <SectionHead label="Clinical summary" />
          <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--ink-2)", maxWidth: "78ch", margin: 0 }}>{c.narrative}</p>

          <div className="c01-sec">
            <SectionHead label="Phenotype profile" note={`${c.phenotypes.filter((p) => p.status === "Present").length} present · ${c.phenotypes.filter((p) => p.status === "Absent").length} explicitly absent`} />
            <div className="c01-panel">
              <table className="c01-table">
                <thead>
                  <tr><th>Term</th><th style={{ width: 104 }}>HPO</th><th style={{ width: 88 }}>Onset</th><th style={{ width: 92 }}>Severity</th><th style={{ width: 104 }}>Status</th><th style={{ width: 118 }}>Source</th></tr>
                </thead>
                <tbody>
                  {c.phenotypes.map((p, i) => (
                    <tr key={p.hpo} className="ody-fadein" style={stagger(i, 40, 120)}>
                      <td style={{ fontWeight: 500, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                      <td className="num" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{p.hpo}</td>
                      <td className="num" style={{ fontSize: 12 }}>{p.onset}</td>
                      <td style={{ fontSize: 12 }}>{p.severity}</td>
                      <td>
                        <span className="c01-chip" data-tone={p.status === "Present" ? undefined : p.status === "Absent" ? "alert" : "ok"} style={{ height: 20 }}>{p.status}</span>
                      </td>
                      <td style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                        {p.source}
                        {!p.verified && <span style={{ color: "var(--warn)" }}> · unverified</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="c01-sec">
            <SectionHead label="Genetic information" note={c.geneticSummary} />
            <div className="c01-panel">
              <table className="c01-table">
                <thead><tr><th style={{ width: 96 }}>Gene</th><th>Finding</th><th style={{ width: 128 }}>Zygosity</th><th style={{ width: 128 }}>Classification</th></tr></thead>
                <tbody>
                  {c.genetics.map((g, i) => (
                    <tr key={i}>
                      <td className="num" style={{ fontWeight: 500 }}>{g.gene}</td>
                      <td>
                        <div className="c01-mono" style={{ fontSize: 12.5 }}>{g.variant}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>{g.note}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>{g.zygosity}</td>
                      <td>
                        <span className="c01-chip" data-tone={g.classification.startsWith("VUS") ? "warn" : undefined} style={{ height: 20 }}>{g.classification}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="c01-sec">
            <SectionHead label="Clinical timeline" note="Trajectory is often more discriminating than any single finding." />
            <div className="c01-timeline" style={{ marginTop: 20 }}>
              {c.timeline.map((t, i) => (
                <div key={i} className="c01-tl-item ody-rise" data-kind={t.kind} style={stagger(i, 55, 150)}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span className="c01-mono" style={{ fontSize: 11.5, color: "var(--ink-4)", width: 64, flex: "none" }}>{t.age}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.label}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{t.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 18, position: "sticky", top: "calc(var(--lab-chrome-h) + var(--bar) + 18px)" }}>
          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Case completeness</h2><span className="c01-num" style={{ fontSize: 15 }}>{c.completeness}%</span></div>
            <div className="c01-panel-b">
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 56px 34px", gap: 10, alignItems: "center", marginBottom: 9 }}>
                  <span style={{ fontSize: 12.5 }}>{b.label}</span>
                  <div className="c01-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 55, 200) }} /></div>
                  <span className="c01-mono" style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Potential matching signals</h2><span className="c01-chip" data-tone="accent">{c.signals.length}</span></div>
            <div className="c01-panel-b">
              {c.signals.map((s, i) => (
                <div key={i} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 10, padding: "8px 0", borderBottom: i < c.signals.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 50, 260) }}>
                  <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Laboratory</h2><span className="c01-eyebrow">Latest</span></div>
            <table className="c01-table">
              <tbody>
                {c.labs.slice(0, 5).map((l) => (
                  <tr key={l.analyte + l.matrix}>
                    <td style={{ fontSize: 12.5 }}>{l.analyte}<div style={{ fontSize: 11, color: "var(--ink-4)" }}>{l.matrix}</div></td>
                    <td className="num" style={{ textAlign: "right", color: l.flag === "high" ? "var(--alert)" : l.flag === "low" ? "var(--accent)" : "var(--ink)" }}>
                      {l.value} {l.flag === "high" ? "↑" : l.flag === "low" ? "↓" : ""}
                      <div style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{l.ref} {l.unit}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Family pattern</h2></div>
            <div className="c01-panel-b" style={{ color: "var(--ink-2)" }}>
              <Pedigree consanguineous affected={[0, 2]} size={200} />
              <dl className="c01-kv" style={{ marginTop: 14 }}>
                <dt>Pedigree</dt><dd>{c.family.pedigree}</dd>
                <dt>Siblings</dt><dd>{c.family.siblings}</dd>
              </dl>
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Negative evidence</h2><span className="c01-eyebrow">Narrows the field</span></div>
            <div className="c01-panel-b">
              {c.negativeEvidence.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, padding: "6px 0", color: "var(--ink-2)" }}>
                  <span style={{ color: "var(--ink-4)" }}>—</span>{n}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------ 4. MATCH ------------------------------ */

function Match() {
  return (
    <>
      <header className="ody-rise">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span className="c01-chip" data-tone="accent">{match.id}</span>
          <div className="c01-eyebrow">Potential cross-border match</div>
        </div>
        <h1 className="c01-h1" style={{ marginTop: 16 }}>
          {caseKZ.id} <span style={{ color: "var(--ink-4)" }}>↔</span> {caseDE.id}
        </h1>
        <div style={{ display: "flex", gap: 26, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
          <span className="c01-chip" data-tone="accent" style={{ height: 26 }}>{match.confidenceLabel}</span>
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
            {match.concordantGroups} of {match.totalGroups} evidence groups concordant · {match.divergences} divergence
          </span>
          <Disclaimer />
        </div>
      </header>

      <div className="c01-sec">
        <div className="c01-panel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[caseKZ, caseDE].map((c, i) => (
            <div key={c.id} className="ody-rise" style={{ padding: "20px 22px", borderRight: i === 0 ? "1px solid var(--line)" : undefined, ...stagger(i, 120, 80) }}>
              <div className="c01-eyebrow">{i === 0 ? "Your case" : "Network case"}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
                <span className="c01-num" style={{ fontSize: 24, color: i === 1 ? "var(--accent)" : undefined }}>{c.id}</span>
                <span style={{ fontSize: 14 }}>{c.country}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.6 }}>{c.institution}</div>
              <dl className="c01-kv" style={{ marginTop: 16 }}>
                <dt>Age group</dt><dd>{c.ageGroup}</dd>
                <dt>Status</dt><dd>{c.status}</dd>
                <dt>Completeness</dt><dd className="c01-mono">{c.completeness}%</dd>
                <dt>Enrolled</dt><dd className="c01-mono">{c.enrolled}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 34, alignItems: "start" }}>
        <section>
          <SectionHead
            label="Evidence supporting similarity"
            note="Each group is scored independently. A score expresses similarity of recorded evidence — not the probability of a diagnosis."
          />
          <div className="c01-panel c01-panel-b">
            <div className="c01-ev-row" style={{ paddingTop: 0, color: "var(--ink-4)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-data)" }}>
              <span>Evidence group</span><span>Similarity</span><span>Weight / direction</span><span>What was compared</span>
            </div>
            {matchEvidence.map((e, i) => (
              <div key={e.id} className="c01-ev-row ody-fadein" style={stagger(i, 65, 120)}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{e.label}</div>
                  <div className="c01-mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 5 }}>
                    {e.kzValue}
                  </div>
                  <div className="c01-mono" style={{ fontSize: 11, color: "var(--accent)", marginTop: 2 }}>
                    {e.deValue}
                  </div>
                </div>
                <div>
                  <div className="c01-num" style={{ fontSize: 19, color: e.direction === "divergent" ? "var(--warn)" : "var(--ink)" }}>{e.score}</div>
                  <div className="c01-bar" style={{ marginTop: 7 }}>
                    <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--warn)" : "var(--accent)", ...stagger(i, 65, 200) }} />
                  </div>
                </div>
                <div>
                  <span className="c01-chip" data-tone={e.direction === "divergent" ? "warn" : e.weight === "High" ? "accent" : undefined} style={{ height: 20 }}>
                    {e.weight}
                  </span>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 7 }}>
                    {e.direction === "divergent" ? "Divergent — requires explanation" : "Supporting"}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{e.summary}</div>
              </div>
            ))}
          </div>

          <div className="c01-sec">
            <SectionHead label="Where the cases diverge" note="Divergence is recorded, not hidden. It is often where the clinical insight is." />
            <div className="c01-panel c01-panel-b">
              {match.divergenceNotes.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, padding: "11px 0", borderBottom: i < match.divergenceNotes.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span style={{ color: "var(--warn)" }}>▲</span>
                  <span style={{ fontSize: 13, lineHeight: 1.65, color: "var(--ink-2)" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside style={{ display: "grid", gap: 18 }}>
          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">How this match was found</h2></div>
            <div className="c01-panel-b">
              {match.reasoningSteps.map((s, i) => (
                <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 12, paddingBottom: 16, ...stagger(i, 90, 200) }}>
                  <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.55 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
              <div className="c01-rule" style={{ margin: "4px 0 14px" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><div className="c01-num" style={{ fontSize: 20 }}>{match.cohortsQueried.toLocaleString()}</div><div className="c01-eyebrow" style={{ marginTop: 5 }}>Cohorts queried</div></div>
                <div><div className="c01-num" style={{ fontSize: 20 }}>{match.countriesQueried}</div><div className="c01-eyebrow" style={{ marginTop: 5 }}>Countries</div></div>
                <div><div className="c01-num" style={{ fontSize: 20 }}>{match.candidatesScreened.toLocaleString()}</div><div className="c01-eyebrow" style={{ marginTop: 5 }}>Records screened</div></div>
                <div><div className="c01-num" style={{ fontSize: 20, color: "var(--accent)" }}>{match.candidatesReturned}</div><div className="c01-eyebrow" style={{ marginTop: 5 }}>Candidates returned</div></div>
              </div>
            </div>
          </div>

          <div className="c01-panel" style={{ borderColor: "var(--accent)" }}>
            <div className="c01-panel-b">
              <div className="c01-eyebrow">Required next</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}>{match.reviewStatus}</div>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.65, marginTop: 10 }}>{match.proposedAction}.</p>
              <ol style={{ margin: "14px 0 0", paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 5 }}>{n}</li>)}
              </ol>
              <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
                <button className="c01-btn">Request collaboration</button>
                <button className="c01-btn" data-variant="ghost">Not a match</button>
              </div>
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Other candidates</h2><span className="c01-eyebrow">Same query</span></div>
            <div className="c01-panel-b">
              {otherCandidates.map((o, i) => (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "10px 0", borderBottom: i < otherCandidates.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div className="c01-mono" style={{ fontSize: 12.5 }}>{o.id} · {o.country}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>{o.note}</div>
                  </div>
                  <span className="c01-num" style={{ fontSize: 15, color: "var(--ink-3)" }}>{o.score}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------ 5. COMPARE ------------------------------ */

const AGREE_LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "ODY-742 only", "only-kz": "ODY-001 only" };

function Compare() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="c01-eyebrow">Evidence comparison · {match.id}</div>
          <h1 className="c01-h1" style={{ marginTop: 14 }}>Kazakhstan / Germany</h1>
          <p className="c01-lede" style={{ marginTop: 12 }}>
            Every recorded signal, aligned. Rows where the cases diverge are marked rather than smoothed over.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Concordant", "Partial", "Differs", "Single-site"].map((l, i) => (
            <span key={l} className="c01-chip" data-tone={i === 0 ? "ok" : i === 1 ? undefined : i === 2 ? "warn" : "accent"}>{l}</span>
          ))}
        </div>
      </header>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        <div className="c01-panel c01-panel-b ody-rise">
          <div className="c01-eyebrow">Phenotype overlap</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16 }}>
            <svg width="150" height="86" viewBox="0 0 150 86" aria-hidden>
              <circle className="ody-nodein" cx="56" cy="43" r="36" fill="var(--ink)" fillOpacity="0.07" stroke="var(--ink-3)" strokeWidth="1" />
              <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="94" cy="43" r="36" fill="var(--accent)" fillOpacity="0.09" stroke="var(--accent)" strokeWidth="1" />
              <text x="33" y="48" textAnchor="middle" fontSize="15" fill="var(--ink)" fontFamily="var(--font-data)">{phenotypeOverlap.onlyKZ}</text>
              <text x="75" y="48" textAnchor="middle" fontSize="19" fill="var(--ink)" fontFamily="var(--font-data)">{phenotypeOverlap.shared}</text>
              <text x="117" y="48" textAnchor="middle" fontSize="15" fill="var(--accent)" fontFamily="var(--font-data)">{phenotypeOverlap.onlyDE}</text>
            </svg>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              <b>{phenotypeOverlap.shared} shared HPO terms.</b> Three of them are individually common but rare in
              combination, which is what drove the candidate ranking.
            </div>
          </div>
        </div>

        <div className="c01-panel c01-panel-b ody-rise" style={stagger(1, 110)}>
          <div className="c01-eyebrow">Clinical trajectory · months</div>
          <div style={{ marginTop: 14, "--track-a": "var(--ink)", "--track-b": "var(--accent)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="ODY-001" labelB="ODY-742" height={116} rowLabels />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "var(--ink)" }}>● ODY-001</span>
            <span style={{ fontSize: 11, color: "var(--accent)" }}>● ODY-742</span>
            <span style={{ fontSize: 11, color: "var(--ink-4)", marginLeft: "auto" }}>0 — 20 months</span>
          </div>
        </div>

        <div className="c01-panel c01-panel-b ody-rise" style={stagger(2, 110)}>
          <div className="c01-eyebrow">Family pattern</div>
          <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink)" }}><Pedigree consanguineous affected={[0, 2]} size={158} /><div style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center" }}>ODY-001</div></div>
            <div style={{ color: "var(--accent)" }}><Pedigree consanguineous={false} affected={[1]} size={158} /><div style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center" }}>ODY-742</div></div>
          </div>
        </div>
      </div>

      <div className="c01-sec">
        <div className="c01-panel">
          <div className="c01-cmp-row c01-cmp-head" style={{ borderBottom: "1px solid var(--line-strong)", fontFamily: "var(--font-data)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", padding: "12px 16px" }}>
            <span>Signal</span>
            <span style={{ color: "var(--ink)" }}>ODY-001 · Kazakhstan</span>
            <span style={{ color: "var(--accent)" }}>ODY-742 · Germany</span>
            <span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "14px 16px 8px", borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
                <span className="c01-eyebrow" style={{ color: "var(--ink-2)" }}>{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c01-cmp-row ody-fadein" style={stagger(i, 26, gi * 60)}>
                  <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                  <span>{r.kz}</span>
                  <span style={{ color: r.agreement.startsWith("only-de") ? "var(--accent)" : undefined }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span
                      className="c01-chip"
                      data-tone={r.agreement === "match" ? "ok" : r.agreement === "differ" ? "warn" : r.agreement.startsWith("only") ? "accent" : undefined}
                      style={{ height: 19, fontSize: 9.5 }}
                    >
                      {AGREE_LABEL[r.agreement]}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="c01-sec" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="c01-notice" style={{ maxWidth: "68ch" }}>
          <span style={{ color: "var(--accent)" }}>◆</span>
          <span>
            <b>Requires clinician review.</b> This comparison describes similarity between two recorded cases. It does
            not establish a diagnosis for either patient, and no conclusion is drawn by the system.
          </span>
        </div>
        <button className="c01-btn">Open collaboration room</button>
      </div>
    </>
  );
}

/* ------------------------------ 6. ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="c01-eyebrow">Secure collaboration · {collaboration.roomId}</div>
          <h1 className="c01-h1" style={{ marginTop: 14 }}>{collaboration.title}</h1>
          <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
            <span className="c01-chip" data-tone="ok">◈ {collaboration.security.split(" · ")[0]}</span>
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Opened {collaboration.opened}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {collaboration.participants.map((p) => (
            <div key={p.networkId} style={{ background: "var(--surface)", padding: "14px 18px", minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="c01-avatar" style={{ background: p.side === "B" ? "var(--accent)" : "var(--ink)" }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 9 }}>{p.institution}, {p.city}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="c01-sec">
        <div className="c01-panel c01-panel-b">
          <div className="c01-stage" style={{ flexWrap: "wrap", rowGap: 10 }}>
            {s.stages.map((st, i) => (
              <div key={st} className="c01-stage-i ody-fadein" data-state={i < s.stageIndex ? "done" : i === s.stageIndex ? "current" : "todo"} style={stagger(i, 90)}>
                <span className="c01-mono" style={{ fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                {st}
                {i < s.stageIndex && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="c01-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 34, alignItems: "start" }}>
        <section>
          <SectionHead label="Clinical discussion" note="Immutable audit log. No identifiable patient data is exchanged in this room." />
          <div className="c01-panel c01-panel-b">
            {collaboration.messages.map((m, i) => (
              <div key={m.id} className="c01-msg ody-rise" data-side={m.author} style={stagger(i, 70, 100)}>
                {m.author !== "system" && <div className="c01-msg-av">{m.author === "A" ? doctor.initials : counterpart.initials}</div>}
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: m.author === "system" ? 400 : 600, color: m.author === "system" ? "var(--ink-3)" : undefined }}>
                      {m.author === "system" ? "System" : m.name}
                    </span>
                    {m.author !== "system" && <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{m.role}</span>}
                    <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--ink-4)", marginLeft: "auto" }}>{m.time}</span>
                    {m.kind === "proposal" && <span className="c01-chip" data-tone="accent" style={{ height: 19, fontSize: 9.5 }}>Proposal</span>}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.7, color: m.author === "system" ? "var(--ink-3)" : "var(--ink-2)", margin: "8px 0 0" }}>{m.body}</p>
                  {m.attachment && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, border: "1px solid var(--line)", padding: "9px 12px", background: "var(--surface-2)" }}>
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="var(--ink-3)" strokeWidth="1"><path d="M2 1h7l3 3v11H2z" /><path d="M9 1v3h3" /></svg>
                      <div>
                        <div className="c01-mono" style={{ fontSize: 12 }}>{m.attachment.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{m.attachment.meta}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center" }}>
              <div className="c01-input" style={{ color: "var(--ink-4)" }}>Write a clinical note…</div>
              <button className="c01-btn" data-variant="ghost">Attach evidence</button>
              <button className="c01-btn">Send</button>
            </div>
          </div>
        </section>

        <aside style={{ display: "grid", gap: 18 }}>
          <div className="c01-panel" style={{ borderColor: "var(--accent)" }}>
            <div className="c01-panel-h"><h2 className="c01-h2">Verification status</h2><span className="c01-chip" data-tone="warn">1 of 2</span></div>
            <div className="c01-panel-b">
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--ok)" }}>✓</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationA}</div><div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>Evidence supports a clinically meaningful similarity</div></div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingTop: 12 }}>
                <span style={{ color: "var(--warn)" }}>○</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationB}</div><div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>Awaiting second clinician</div></div>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                A connection becomes part of the network record only when two independent clinicians verify it.
              </p>
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Shared evidence</h2><span className="c01-eyebrow">{collaboration.documents.length} items</span></div>
            <div className="c01-panel-b">
              {collaboration.documents.map((d, i) => (
                <div key={d.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "10px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div className="c01-mono" style={{ fontSize: 12 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 3 }}>{d.meta}</div>
                  </div>
                  <span className="c01-chip" style={{ height: 19, fontSize: 9.5 }}>{d.kind}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c01-panel">
            <div className="c01-panel-h"><h2 className="c01-h2">Decision log</h2><span className="c01-eyebrow">Immutable</span></div>
            <div className="c01-panel-b">
              <div className="c01-timeline">
                {collaboration.decisionLog.map((d, i) => (
                  <div key={d.id} className="c01-tl-item" data-kind={d.state === "done" ? "treatment" : "stable"} style={{ paddingBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : "var(--ink)" }}>{d.action}</span>
                      <span className="c01-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{d.time}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>{d.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="c01-notice">
            <span style={{ color: "var(--ink-4)" }}>◈</span>
            <span>{collaboration.security}</span>
          </div>
          <Disclaimer />
        </aside>
      </div>
    </>
  );
}
