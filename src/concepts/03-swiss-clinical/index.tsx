"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { WorldMap, TrajectoryChart, Pedigree, Spark, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap, journey,
} from "@/data/odyssey";

const NAV: { id: ScreenId; n: string; label: string }[] = [
  { id: "dashboard", n: "01", label: "Overview" },
  { id: "create", n: "02", label: "New case" },
  { id: "case", n: "03", label: "Case" },
  { id: "match", n: "04", label: "Match" },
  { id: "compare", n: "05", label: "Comparison" },
  { id: "room", n: "06", label: "Collaboration" },
];

export default function SwissClinical({ screen }: { screen: ScreenId }) {
  return (
    <div className="c03 ody-surface">
      <header className="c03-head">
        <div className="c03-head-in">
          <div className="c03-logo">
            ODYSSEY<sup>RDN</sup>
          </div>
          <nav className="c03-nav">
            {NAV.map((n) => (
              <span key={n.id} className="c03-navitem" data-on={n.id === screen}>
                <b>{n.n}</b>
                {n.label}
              </span>
            ))}
          </nav>
          <div className="c03-headright">
            <span className="c03-num">{doctor.city.toUpperCase()} {doctor.localTime}</span>
            <span>{doctor.name}</span>
          </div>
        </div>
      </header>

      <div className="c03-page">
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

const Disclaimer = () => <span className="c03-disclaimer">{DISCLAIMER}</span>;

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 8" }} className="ody-rise">
          <div className="c03-label c03-red">{PRODUCT.tagline}</div>
          <h1 className="c03-display" style={{ marginTop: 20 }}>
            {doctor.greeting},<br />
            {doctor.name}
          </h1>
        </div>
        <div style={{ gridColumn: "9 / span 4", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 16 }} className="ody-rise">
          <Disclaimer />
          <p className="c03-body" style={{ margin: 0 }}>
            {doctor.department}, {doctor.institution}. Four of your twelve unresolved cases returned candidate
            relationships overnight. One of them crosses a border.
          </p>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 3" }} className="c03-label">Cases requiring attention</div>
          <div style={{ gridColumn: "4 / span 9" }} className="c03-small">Ordered by clinical urgency, not recency</div>
        </div>
        <div className="c03-grid" style={{ marginTop: 26, rowGap: 34 }}>
          {attention.map((a, i) => (
            <div key={a.id} style={{ gridColumn: `${1 + i * 3} / span 3` }} className="c03-stat ody-rise" data-red={a.tone === "signal" || a.tone === "alert"}>
              <div className="c03-stat-n c03-num">{String(a.count).padStart(2, "0")}</div>
              <div className="c03-stat-l">{a.label}</div>
              <div className="c03-stat-d">{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* the moment — editorial, asymmetric */}
      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 26 }}>
          <div style={{ gridColumn: "1 / span 5" }} className="ody-rise">
            <span className="c03-tag" data-red="true">New · 14 minutes ago</span>
            <h2 className="c03-title" style={{ marginTop: 20 }}>
              A case in Astana and a case in Heidelberg describe the same disease course.
            </h2>
            <p className="c03-body" style={{ marginTop: 16, color: "var(--ink-2)" }}>
              Seven of eight independent evidence groups are concordant — imaging pattern, lactate profile, treatment
              response, and an identical coding variant of uncertain significance. One group diverges.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <button className="c03-btn">Review evidence</button>
              <button className="c03-btn" data-variant="ghost">Defer</button>
            </div>
          </div>
          <div style={{ gridColumn: "7 / span 6" }} className="ody-fadein">
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--ink)", paddingBottom: 10 }}>
              <span className="c03-label">{caseKZ.id} Kazakhstan</span>
              <span className="c03-label c03-red">{caseDE.id} Germany</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 3" }} className="c03-label">Case queue</div>
          <div style={{ gridColumn: "4 / span 9" }} className="c03-small">12 unresolved · 6 shown</div>
        </div>
        <table className="c03-table" style={{ marginTop: 22 }}>
          <thead>
            <tr>
              <th style={{ width: 96 }}>Case</th>
              <th>Presentation</th>
              <th style={{ width: 110 }}>Age</th>
              <th style={{ width: 150 }}>Status</th>
              <th style={{ width: 150 }}>Completeness</th>
              <th style={{ width: 90 }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {caseQueue.map((r, i) => (
              <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 120)}>
                <td className="c03-num" style={{ fontWeight: 600 }}>{r.caseId}</td>
                <td>{r.summary}</td>
                <td className="c03-small">{r.ageGroup}</td>
                <td>
                  <span className="c03-tag" data-red={r.status === "Match proposed"} data-mute={r.status === "Unresolved"}>{r.status}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="c03-bar" style={{ flex: 1, height: 6 }} data-red={r.caseId === "ODY-001"}>
                      <i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 200) }} />
                    </div>
                    <span className="c03-num c03-small">{r.completeness}</span>
                  </div>
                </td>
                <td className="c03-small c03-num">{r.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 22 }}>
          <div style={{ gridColumn: "1 / span 7" }}>
            <div className="c03-label">Network activity</div>
            <div style={{ marginTop: 18 }}>
              {networkActivity.map((a, i) => (
                <div key={a.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "84px 1fr 60px", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--line-soft)", ...stagger(i, 55, 180) }}>
                  <span className="c03-label" style={{ color: a.kind === "match" ? "var(--red)" : "var(--ink-4)" }}>{a.origin}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                    <div className="c03-small" style={{ marginTop: 3 }}>{a.detail}</div>
                  </div>
                  <span className="c03-small c03-num" style={{ textAlign: "right" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: "9 / span 4" }}>
            <div className="c03-label">Matching outcomes · 90 days</div>
            <div style={{ marginTop: 18 }}>
              {contributionMetrics.map((m, i) => (
                <div key={m.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}>
                    <span>{m.label}</span>
                    <span className="c03-num" style={{ fontWeight: 600 }}>{m.value}<span style={{ color: "var(--ink-4)", fontWeight: 400 }}>/{m.of}</span></span>
                  </div>
                  <div className="c03-bar" data-red={i === 2}><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--ink)", marginTop: 26, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div className="c03-label">Federated queries / month</div>
                <div className="c03-num" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 8 }}>52</div>
              </div>
              <div className="c03-red"><Spark data={querySeries} w={130} h={36} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 22, rowGap: 30 }}>
          {networkStats.map((s, i) => (
            <div key={s.id} style={{ gridColumn: `${1 + i * 3} / span 3` }}>
              <div className="c03-num" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.04em" }}>{s.value}</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>{s.label}</div>
              <div className="c03-small" style={{ marginTop: 4 }}>{s.delta}</div>
            </div>
          ))}
          <div style={{ gridColumn: "1 / span 12", marginTop: 12 }}>
            <p className="c03-title" style={{ maxWidth: "22ch" }}>{PRODUCT.principle}</p>
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
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 7" }} className="ody-rise">
          <div className="c03-label c03-red">02 — New case</div>
          <h1 className="c03-display" style={{ marginTop: 18 }}>Create<br />case</h1>
        </div>
        <div style={{ gridColumn: "9 / span 4", alignSelf: "end", display: "flex", flexDirection: "column", gap: 14 }}>
          <Disclaimer />
          <p className="c03-body" style={{ margin: 0 }}>
            Structure is what makes a case comparable across languages, systems and borders. Nine sections; each one
            becomes a matchable signal.
          </p>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 26 }}>
          <div style={{ gridColumn: "1 / span 3" }}>
            <div className="c03-label">Sections · 3 of 9</div>
            <div style={{ marginTop: 16 }}>
              {intakeSteps.map((s, i) => (
                <div key={s.id} className="c03-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
                  <span className="c03-step-n c03-num">{s.index}</span>
                  <div>
                    <div className="c03-step-l" style={{ fontSize: 13 }}>{s.label}</div>
                    {s.state === "active" && <div className="c03-small" style={{ marginTop: 5 }}>{s.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: "5 / span 8" }}>
            <h2 className="c03-title">{active.index} — {active.label}</h2>
            <p className="c03-small" style={{ marginTop: 8, maxWidth: "58ch" }}>{active.description}</p>
            <div style={{ marginTop: 22, borderTop: "1px solid var(--ink)" }}>
              {active.fields.map((f) => (
                <div key={f.label} className="c03-field">
                  <div>
                    <div className="c03-label" style={{ color: "var(--ink-3)" }}>{f.label}</div>
                    {f.hint && <div className="c03-small" style={{ marginTop: 6 }}>{f.hint}</div>}
                  </div>
                  {f.kind === "chips" ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {f.value.split(" · ").map((v) => (
                        <span key={v} className="c03-tag" data-mute="true" style={{ textTransform: "none", letterSpacing: "0.01em", fontSize: 11.5, fontWeight: 400 }}>{v}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="c03-input">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 26 }}>
          <div style={{ gridColumn: "1 / span 4" }}>
            <div className="c03-label c03-red">09 — Documents</div>
            <h2 className="c03-title" style={{ marginTop: 16 }}>AI-assisted extraction.<br />Clinician verification.</h2>
            <p className="c03-body" style={{ marginTop: 16, color: "var(--ink-2)" }}>
              The uploaded report is parsed at your institution. The assistant proposes phenotype terms and shows the
              exact sentence each was drawn from. Nothing enters the matching index until you confirm it.
            </p>
            <div style={{ marginTop: 22, borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="c03-num">{aiExtraction.document}</span>
                <span className="c03-small">{aiExtraction.pages} pp</span>
              </div>
              <div className="c03-small" style={{ marginTop: 5 }}>{aiExtraction.processedAt}</div>
              <button className="c03-btn" data-variant="ghost" style={{ marginTop: 18 }}>Upload medical report</button>
            </div>
          </div>

          <div style={{ gridColumn: "6 / span 7" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--ink)", paddingBottom: 9 }}>
              <span className="c03-label">Phenotypes detected · {aiExtraction.terms.length}</span>
              <span className="c03-label">Confirm / Edit / Reject</span>
            </div>
            {aiExtraction.terms.map((t, i) => (
              <div key={t.hpo} className="c03-term ody-fadein" style={stagger(i, 55, 140)}>
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 500, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                    <span className="c03-small c03-num">{t.hpo}</span>
                    <span className="c03-small c03-num">{t.page}</span>
                  </div>
                  <div className="c03-quote">{t.evidence}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="c03-num" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: t.confidence < 0.7 ? "var(--ink-4)" : undefined }}>
                    {Math.round(t.confidence * 100)}%
                  </div>
                  <div className="c03-small">extraction confidence</div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {t.state === "confirmed" ? (
                      <span className="c03-tag">✓ Confirmed</span>
                    ) : t.state === "rejected" ? (
                      <span className="c03-tag" data-mute="true">Rejected</span>
                    ) : (
                      <>
                        <span className="c03-tag" data-red="true">Confirm</span>
                        <span className="c03-tag">Edit</span>
                        <span className="c03-tag" data-mute="true">Reject</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, gap: 16, flexWrap: "wrap" }}>
              <span className="c03-small">3 confirmed · 3 awaiting review · 1 rejected. Only confirmed terms are indexed.</span>
              <button className="c03-btn">Verify and continue</button>
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
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 7" }} className="ody-rise">
          <div className="c03-label c03-red">Case intelligence</div>
          <h1 className="c03-display" style={{ marginTop: 18 }}>{c.id}</h1>
          <p className="c03-title" style={{ marginTop: 22, maxWidth: "30ch", fontWeight: 400 }}>{c.headline}</p>
        </div>
        <div style={{ gridColumn: "9 / span 4", alignSelf: "end" }}>
          <dl className="c03-kv">
            <div><dt>Country</dt><dd>{c.country}</dd></div>
            <div><dt>Age group</dt><dd>{c.ageGroup}</dd></div>
            <div><dt>Status</dt><dd><span className="c03-tag" data-red="true">{c.status}</span></dd></div>
            <div><dt>Genetic status</dt><dd>Unresolved</dd></div>
            <div><dt>Completeness</dt><dd className="c03-num">{c.completeness}%</dd></div>
          </dl>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 22 }}>
          <div style={{ gridColumn: "1 / span 2" }} className="c03-label">Summary</div>
          <p style={{ gridColumn: "3 / span 8", fontSize: 17, lineHeight: 1.62, margin: 0, letterSpacing: "-0.012em" }}>{c.narrative}</p>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 2" }} className="c03-label">Phenotype<br />profile</div>
          <div style={{ gridColumn: "3 / span 10" }}>
            <table className="c03-table">
              <thead><tr><th>Term</th><th style={{ width: 110 }}>HPO</th><th style={{ width: 90 }}>Onset</th><th style={{ width: 96 }}>Severity</th><th style={{ width: 96 }}>Status</th><th style={{ width: 130 }}>Source</th></tr></thead>
              <tbody>
                {c.phenotypes.map((p, i) => (
                  <tr key={p.hpo} className="ody-fadein" style={stagger(i, 38, 100)}>
                    <td style={{ fontWeight: 500, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                    <td className="c03-num c03-small">{p.hpo}</td>
                    <td className="c03-num">{p.onset}</td>
                    <td>{p.severity}</td>
                    <td><span className="c03-tag" data-mute={p.status !== "Present"} data-red={p.status === "Absent"}>{p.status}</span></td>
                    <td className="c03-small">{p.source}{!p.verified && <span className="c03-red"> · unverified</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 2" }} className="c03-label">Genetics</div>
          <div style={{ gridColumn: "3 / span 5" }}>
            <p className="c03-body" style={{ marginTop: 0, color: "var(--ink-2)" }}>{c.geneticSummary}</p>
            <div style={{ marginTop: 18, borderTop: "1px solid var(--ink)" }}>
              {c.genetics.map((g, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "baseline" }}>
                    <span className="c03-num" style={{ fontSize: 13, fontWeight: 500 }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                    <span className="c03-tag" data-mute={!g.classification.startsWith("VUS")} data-red={g.classification.startsWith("VUS")}>{g.classification}</span>
                  </div>
                  <div className="c03-small" style={{ marginTop: 5 }}>{g.zygosity !== "—" && `${g.zygosity} · ${g.inheritance} · `}{g.note}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "9 / span 4" }}>
            <div className="c03-label">Case completeness</div>
            <div style={{ marginTop: 16 }}>
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 70px 30px", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5 }}>{b.label}</span>
                  <div className="c03-bar" style={{ height: 6 }} data-red={b.value < 70}><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 180) }} /></div>
                  <span className="c03-num c03-small" style={{ textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
            <div className="c03-label" style={{ marginTop: 30 }}>Family pattern</div>
            <div style={{ marginTop: 10 }}><Pedigree consanguineous affected={[0, 2]} size={210} /></div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 2" }} className="c03-label">Clinical<br />timeline</div>
          <div style={{ gridColumn: "3 / span 6" }}>
            <div className="c03-tl">
              {c.timeline.map((t, i) => (
                <div key={i} className="c03-tl-row ody-fadein" style={stagger(i, 45, 100)}>
                  <div className="c03-tl-age c03-num">{t.age}</div>
                  <div className="c03-tl-body" data-kind={t.kind}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.label}</div>
                    <div className="c03-small" style={{ marginTop: 3 }}>{t.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "10 / span 3" }}>
            <div className="c03-label">Potential matching signals</div>
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none" }}>
              {c.signals.map((s, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "9px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <span className="c03-num c03-small" style={{ fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>{s}</span>
                </li>
              ))}
            </ol>
            <div className="c03-label" style={{ marginTop: 28 }}>Negative evidence</div>
            <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none" }}>
              {c.negativeEvidence.map((n, i) => (
                <li key={i} className="c03-small" style={{ padding: "6px 0", display: "flex", gap: 8 }}><span className="c03-red">×</span>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ MATCH ------------------------------ */

function Match() {
  return (
    <>
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 12" }} className="ody-rise">
          <div className="c03-label c03-red">Potential cross-border match · {match.id}</div>
        </div>
        <div style={{ gridColumn: "1 / span 8", marginTop: 20 }} className="ody-rise">
          <h1 className="c03-display">
            {caseKZ.id}<br />
            <span style={{ color: "var(--ink-4)" }}>↓</span><br />
            <span className="c03-red">{caseDE.id}</span>
          </h1>
        </div>
        <div style={{ gridColumn: "9 / span 4", alignSelf: "end", display: "flex", flexDirection: "column", gap: 16 }}>
          <Disclaimer />
          <div>
            <div className="c03-title">{match.confidenceLabel}</div>
            <p className="c03-body" style={{ marginTop: 10, color: "var(--ink-2)" }}>{match.confidenceNote}</p>
          </div>
          <dl className="c03-kv">
            <div><dt>Concordant</dt><dd className="c03-num">{match.concordantGroups} of {match.totalGroups} groups</dd></div>
            <div><dt>Divergent</dt><dd className="c03-num">{match.divergences} group</dd></div>
            <div><dt>Surfaced</dt><dd>{match.surfaced}</dd></div>
            <div><dt>Review</dt><dd>{match.reviewStatus}</dd></div>
          </dl>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 22 }}>
          {[caseKZ, caseDE].map((c, i) => (
            <div key={c.id} style={{ gridColumn: i === 0 ? "1 / span 6" : "7 / span 6" }}>
              <div className="c03-label" style={{ color: i === 1 ? "var(--red)" : undefined }}>{i === 0 ? "Your case" : "Network case"}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
                <span className="c03-num" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.04em" }}>{c.id}</span>
                <span style={{ fontSize: 15 }}>{c.country}</span>
              </div>
              <div className="c03-small" style={{ marginTop: 8 }}>{c.institution}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 3" }}>
            <div className="c03-label">Evidence supporting similarity</div>
            <p className="c03-small" style={{ marginTop: 10 }}>
              Each group is scored independently. A score expresses similarity of recorded evidence — not the
              probability of a diagnosis.
            </p>
          </div>
          <div style={{ gridColumn: "4 / span 9" }}>
            <div className="c03-ev">
              {matchEvidence.map((e, i) => (
                <div key={e.id} className="c03-ev-row ody-fadein" style={stagger(i, 55, 100)}>
                  <span className="c03-ev-n c03-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{e.label}</div>
                    <span className="c03-tag" data-mute={e.direction !== "divergent"} data-red={e.direction === "divergent"} style={{ marginTop: 8, display: "inline-block" }}>
                      {e.direction === "divergent" ? "Divergent" : e.weight}
                    </span>
                  </div>
                  <div>
                    <div className="c03-body">{e.summary}</div>
                    <div style={{ display: "flex", gap: 22, marginTop: 8, flexWrap: "wrap" }}>
                      <span className="c03-small c03-num">KZ {e.kzValue}</span>
                      <span className="c03-small c03-num c03-red">DE {e.deValue}</span>
                    </div>
                  </div>
                  <div>
                    <div className="c03-num" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.045em", textAlign: "right", color: e.direction === "divergent" ? "var(--ink-4)" : undefined }}>{e.score}</div>
                    <div className="c03-bar" style={{ marginTop: 8 }} data-red={e.direction !== "divergent"}>
                      <i className="ody-growx" style={{ width: `${e.score}%`, ...stagger(i, 55, 180) }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 3" }} className="c03-label">How this<br />match was found</div>
          <div style={{ gridColumn: "4 / span 5" }}>
            {match.reasoningSteps.map((s, i) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <span className="c03-num c03-small" style={{ fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.label}</div>
                  <div className="c03-small" style={{ marginTop: 4 }}>{s.detail}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 22 }}>
              {[[match.cohortsQueried.toLocaleString(), "Cohorts"], [String(match.countriesQueried), "Countries"], [match.candidatesScreened.toLocaleString(), "Screened"], [String(match.candidatesReturned), "Returned"]].map(([v, l], i) => (
                <div key={l}>
                  <div className="c03-num" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.03em", color: i === 3 ? "var(--red)" : undefined }}>{v}</div>
                  <div className="c03-small" style={{ marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "10 / span 3" }}>
            <div className="c03-label">Where the cases diverge</div>
            {match.divergenceNotes.map((d, i) => (
              <p key={i} className="c03-body" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line-soft)" }}>{d}</p>
            ))}
            <div className="c03-notice" style={{ marginTop: 26 }}>
              <b>Requires clinician review.</b> No conclusion is drawn by the system.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button className="c03-btn">Request collaboration</button>
              <button className="c03-btn" data-variant="ghost">Not a match</button>
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 3" }} className="c03-label">Other candidates<br />from the same query</div>
          <div style={{ gridColumn: "4 / span 9" }}>
            {otherCandidates.map((o) => (
              <div key={o.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "baseline" }}>
                <span className="c03-num" style={{ fontWeight: 600 }}>{o.id}</span>
                <span className="c03-body">{o.country} — {o.note}</span>
                <span className="c03-num" style={{ textAlign: "right", fontSize: 17, fontWeight: 600 }}>{o.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 8" }} className="ody-rise">
          <div className="c03-label c03-red">Evidence comparison · {match.id}</div>
          <h1 className="c03-display" style={{ marginTop: 18 }}>Kazakhstan<br />Germany</h1>
        </div>
        <div style={{ gridColumn: "9 / span 4", alignSelf: "end", display: "flex", flexDirection: "column", gap: 14 }}>
          <Disclaimer />
          <p className="c03-body" style={{ margin: 0 }}>
            Every recorded signal, aligned. Rows where the two cases diverge are marked rather than smoothed over.
          </p>
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 24 }}>
          <div style={{ gridColumn: "1 / span 4" }}>
            <div className="c03-label">Phenotype overlap</div>
            <svg viewBox="0 0 160 92" style={{ width: "100%", maxWidth: 260, marginTop: 14 }} aria-hidden>
              <circle className="ody-nodein" cx="60" cy="46" r="38" fill="none" stroke="var(--ink)" strokeWidth="1" />
              <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--red)" fillOpacity="0.1" stroke="var(--red)" strokeWidth="1" />
              <text x="34" y="51" textAnchor="middle" fontSize="13" fontWeight="600">{phenotypeOverlap.onlyKZ}</text>
              <text x="80" y="52" textAnchor="middle" fontSize="20" fontWeight="600">{phenotypeOverlap.shared}</text>
              <text x="126" y="51" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--red)">{phenotypeOverlap.onlyDE}</text>
            </svg>
            <p className="c03-small" style={{ marginTop: 12 }}>
              Seven shared HPO terms — individually common, rare in combination.
            </p>
          </div>
          <div style={{ gridColumn: "5 / span 4" }}>
            <div className="c03-label">Clinical trajectory · months</div>
            <div style={{ marginTop: 14, "--track-a": "var(--ink)", "--track-b": "var(--red)" } as React.CSSProperties}>
              <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={124} rowLabels />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              <span className="c03-small">● ODY-001</span>
              <span className="c03-small c03-red">● ODY-742</span>
            </div>
          </div>
          <div style={{ gridColumn: "9 / span 4" }}>
            <div className="c03-label">Family pattern</div>
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <Pedigree consanguineous affected={[0, 2]} size={150} />
              <div className="c03-red"><Pedigree consanguineous={false} affected={[1]} size={150} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-cmp" style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 9, marginTop: 16 }}>
          <span className="c03-label">Signal</span>
          <span className="c03-label">ODY-001 · Kazakhstan</span>
          <span className="c03-label c03-red">ODY-742 · Germany</span>
          <span className="c03-label" style={{ textAlign: "right" }}>Agreement</span>
        </div>
        {comparisonGroups.map((g, gi) => (
          <div key={g.group}>
            <div style={{ padding: "18px 0 8px" }}>
              <span className="c03-label" style={{ fontSize: 11 }}>{g.group}</span>
            </div>
            {g.rows.map((r, i) => (
              <div key={r.label} className="c03-cmp ody-fadein" style={stagger(i, 22, gi * 45)}>
                <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                <span>{r.kz}</span>
                <span style={{ color: r.agreement === "only-de" ? "var(--red)" : undefined }}>{r.de}</span>
                <span style={{ textAlign: "right" }}>
                  <span className="c03-tag" data-mute={r.agreement !== "match"} data-red={r.agreement === "differ"} style={{ fontSize: 9 }}>{LABEL[r.agreement]}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="c03-sec c03-rule-thick">
        <div className="c03-grid" style={{ marginTop: 22, alignItems: "end" }}>
          <p style={{ gridColumn: "1 / span 7", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            <b>Requires clinician review.</b> This comparison describes similarity between two recorded cases. It does
            not establish a diagnosis for either patient, and no conclusion is drawn by the system.
          </p>
          <div style={{ gridColumn: "10 / span 3", textAlign: "right" }}>
            <button className="c03-btn">Open collaboration room</button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <section className="c03-grid" style={{ paddingTop: 56 }}>
        <div style={{ gridColumn: "1 / span 8" }} className="ody-rise">
          <div className="c03-label c03-red">Secure collaboration · {collaboration.roomId}</div>
          <h1 className="c03-display" style={{ marginTop: 18 }}>{caseKZ.id}<br />{caseDE.id}</h1>
        </div>
        <div style={{ gridColumn: "9 / span 4", alignSelf: "end", display: "flex", flexDirection: "column", gap: 16 }}>
          <Disclaimer />
          {collaboration.participants.map((p) => (
            <div key={p.networkId} style={{ borderTop: "1px solid var(--ink)", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                <span className="c03-label">{p.countryCode}</span>
              </div>
              <div className="c03-small" style={{ marginTop: 4 }}>{p.role} · {p.institution}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c03-sec c03-rule-thick">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.stages.length}, 1fr)`, marginTop: 22, gap: 0 }}>
          {s.stages.map((st, i) => (
            <div key={st} className="ody-fadein" style={{ borderTop: `3px solid ${i <= s.stageIndex ? "var(--red)" : "var(--line-soft)"}`, paddingTop: 10, paddingRight: 16, ...stagger(i, 90) }}>
              <div className="c03-num c03-small" style={{ fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 13, marginTop: 6, fontWeight: i === s.stageIndex ? 600 : 400, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)" }}>{st}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c03-sec c03-rule">
        <div className="c03-grid" style={{ marginTop: 16 }}>
          <div style={{ gridColumn: "1 / span 8" }}>
            <div className="c03-label">Clinical discussion</div>
            <p className="c03-small" style={{ marginTop: 8 }}>{collaboration.security}</p>
            <div style={{ marginTop: 20, borderTop: "1px solid var(--ink)" }}>
              {collaboration.messages.map((m, i) => (
                <div key={m.id} className="c03-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
                  {m.author !== "system" ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div className="c03-small" style={{ marginTop: 4 }}>{m.role}</div>
                      <div className="c03-small c03-num" style={{ marginTop: 8 }}>{m.time} ago</div>
                    </div>
                  ) : (
                    <div className="c03-label c03-red">System</div>
                  )}
                  <div>
                    {m.kind === "proposal" && <span className="c03-tag" data-red="true" style={{ marginBottom: 10, display: "inline-block" }}>Proposal</span>}
                    <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: m.author === "system" ? "var(--ink-2)" : undefined }}>{m.body}</p>
                    {m.attachment && (
                      <div style={{ marginTop: 14, borderTop: "1px solid var(--line-soft)", paddingTop: 10, display: "flex", justifyContent: "space-between", gap: 14 }}>
                        <span className="c03-num" style={{ fontSize: 12.5 }}>{m.attachment.label}</span>
                        <span className="c03-small">{m.attachment.meta}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center" }}>
              <div className="c03-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
              <button className="c03-btn">Send</button>
            </div>
          </div>

          <div style={{ gridColumn: "10 / span 3" }}>
            <div className="c03-label">Verification status</div>
            <div style={{ marginTop: 14, borderTop: "3px solid var(--red)", paddingTop: 12 }}>
              <div style={{ fontSize: 13 }}>✓ {s.verificationA}</div>
              <div className="c03-small" style={{ marginTop: 4 }}>Evidence supports a clinically meaningful similarity</div>
              <div style={{ fontSize: 13, marginTop: 16, color: "var(--ink-3)" }}>○ {s.verificationB}</div>
              <div className="c03-small" style={{ marginTop: 4 }}>Awaiting second clinician</div>
              <p className="c03-small" style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line-soft)" }}>
                A connection enters the network record only when two independent clinicians verify it.
              </p>
            </div>

            <div className="c03-label" style={{ marginTop: 32 }}>Shared evidence</div>
            <div style={{ marginTop: 12 }}>
              {collaboration.documents.map((d) => (
                <div key={d.label} style={{ padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="c03-num" style={{ fontSize: 12 }}>{d.label}</div>
                  <div className="c03-small" style={{ marginTop: 3 }}>{d.meta}</div>
                </div>
              ))}
            </div>

            <div className="c03-label" style={{ marginTop: 32 }}>Decision log</div>
            <div style={{ marginTop: 12 }}>
              {collaboration.decisionLog.map((d) => (
                <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 44px", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div>
                    <div style={{ fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</div>
                    <div className="c03-small" style={{ marginTop: 2 }}>{d.actor}</div>
                  </div>
                  <span className="c03-small c03-num" style={{ textAlign: "right" }}>{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
