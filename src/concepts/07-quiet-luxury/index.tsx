"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { WorldMap, TrajectoryChart, Pedigree, Spark, stagger } from "@/components/kit";
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
  { id: "compare", label: "Comparison" },
  { id: "room", label: "Consultation" },
];

export default function QuietLuxury({ screen }: { screen: ScreenId }) {
  return (
    <div className="c07 ody-surface">
      <header className="c07-head">
        <div className="c07-head-in">
          <span className="c07-brand">ODYSSEY</span>
          <nav className="c07-nav">
            {NAV.map((n) => <span key={n.id} className="c07-navitem" data-on={n.id === screen}>{n.label}</span>)}
          </nav>
          <span className="c07-who">{doctor.name} · {doctor.city}</span>
        </div>
      </header>

      <div className="c07-page">
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

const Disclaimer = () => <span className="c07-disclaimer">{DISCLAIMER}</span>;

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c07-sechead">
    <div>
      <div className="c07-eyebrow">{label}</div>
      {note && <div className="c07-small" style={{ marginTop: 10, maxWidth: "56ch" }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 72, alignItems: "end" }}>
        <div>
          <div className="c07-eyebrow">{PRODUCT.tagline}</div>
          <h1 className="c07-display" style={{ marginTop: 26 }}>
            {doctor.greeting},<br />
            {doctor.name}
          </h1>
          <div className="c07-hair" style={{ margin: "34px 0" }} />
          <p className="c07-lede">
            Twelve of your cases remain unresolved. Four returned potential matches overnight; one of them is in
            Heidelberg, and it has been waiting eighteen months to be found.
          </p>
        </div>
        <div style={{ display: "grid", gap: 22 }}>
          <Disclaimer />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 25, fontStyle: "italic", lineHeight: 1.45, color: "var(--navy)", margin: 0, fontWeight: 300 }}>
            {PRODUCT.promise}
          </p>
          <div className="c07-small">{doctor.department}<br />{doctor.institution}</div>
        </div>
      </section>

      <section className="c07-sec">
        <SecHead label="Cases requiring attention" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 44 }}>
          {attention.map((a, i) => (
            <div key={a.id} className="ody-rise" style={stagger(i, 90, 120)}>
              <div className="c07-num" style={{ fontSize: 62, lineHeight: 1, color: a.tone === "signal" ? "var(--brass)" : "var(--navy)" }}>
                {String(a.count).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 14.5, marginTop: 18 }}>{a.label}</div>
              <div className="c07-small" style={{ marginTop: 8 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c07-sec">
        <div className="c07-panel" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 56, alignItems: "center" }}>
          <div className="ody-rise">
            <span className="c07-tag" data-tone="brass">Potential cross-border match · {match.surfaced}</span>
            <h2 className="c07-h2" style={{ marginTop: 22 }}>
              {caseKZ.id} and {caseDE.id} describe the same disease course.
            </h2>
            <p className="c07-body" style={{ marginTop: 20 }}>
              Seven of eight evidence groups are concordant, including the imaging pattern, the lactate profile and an
              identical coding variant of uncertain significance. One group diverges and is recorded as such.
            </p>
            <p className="c07-small" style={{ marginTop: 16 }}>{match.confidenceNote}</p>
            <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
              <button className="c07-btn">Review evidence</button>
              <button className="c07-btn" data-variant="ghost">Defer</button>
            </div>
          </div>
          <div className="ody-fadein">
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
              <div>
                <div className="c07-label">Astana</div>
                <div className="c07-num" style={{ fontSize: 26, marginTop: 6 }}>{caseKZ.id}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="c07-label">Heidelberg</div>
                <div className="c07-num" style={{ fontSize: 26, marginTop: 6, color: "var(--brass)" }}>{caseDE.id}</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} crop="2 2 82 30" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="c07-sec">
        <SecHead label="Unresolved cases" note="Twelve in the index; six shown." right={<span className="c07-small">Completeness governs match precision</span>} />
        <table className="c07-table">
          <thead><tr><th style={{ width: 100 }}>Case</th><th>Presentation</th><th style={{ width: 120 }}>Age</th><th style={{ width: 150 }}>Status</th><th style={{ width: 130 }}>Completeness</th></tr></thead>
          <tbody>
            {caseQueue.map((r, i) => (
              <tr key={r.id} className="ody-fadein" style={stagger(i, 50, 140)}>
                <td className="c07-fig" style={{ color: r.caseId === "ODY-001" ? "var(--brass)" : "var(--navy)", fontSize: 13 }}>{r.caseId}</td>
                <td>{r.summary}</td>
                <td className="c07-small">{r.ageGroup}</td>
                <td><span className="c07-tag" data-tone={r.status === "Match proposed" ? "brass" : r.status === "Verified" ? "green" : undefined}>{r.status}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="c07-bar" style={{ flex: 1 }}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 50, 220) }} /></div>
                    <span className="c07-fig">{r.completeness}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: 72, alignItems: "start" }}>
        <div>
          <SecHead label="Network activity" />
          <ul className="c07-list">
            {networkActivity.map((a, i) => (
              <li key={a.id} className="ody-fadein" style={stagger(i, 55, 180)}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "baseline" }}>
                  <span style={{ fontSize: 15 }}>{a.title}</span>
                  <span className="c07-fig">{a.time}</span>
                </div>
                <div className="c07-small" style={{ marginTop: 5 }}>{a.detail}</div>
                <span className="c07-tag" style={{ marginTop: 10, display: "inline-block" }}>{a.origin}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SecHead label="Your contribution" note="Last ninety days" />
          {contributionMetrics.map((m, i) => (
            <div key={m.id} style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14 }}>{m.label}</span>
                <span className="c07-num" style={{ fontSize: 21 }}>{m.value}<span style={{ color: "var(--ink-4)", fontSize: 14 }}> / {m.of}</span></span>
              </div>
              <div className="c07-bar" style={{ marginTop: 10 }}><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
              <div className="c07-small" style={{ marginTop: 7 }}>{m.note}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 38, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <div>
              <div className="c07-label">Federated queries / month</div>
              <div className="c07-num" style={{ fontSize: 38, marginTop: 8 }}>52</div>
            </div>
            <div style={{ color: "var(--brass)" }}><Spark data={querySeries} w={140} h={38} /></div>
          </div>
        </div>
      </section>

      <section className="c07-sec">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 44 }}>
          {networkStats.map((s) => (
            <div key={s.id}>
              <div className="c07-num" style={{ fontSize: 34 }}>{s.value}</div>
              <div style={{ fontSize: 13.5, marginTop: 10 }}>{s.label}</div>
              <div className="c07-small" style={{ marginTop: 5 }}>{s.delta}</div>
            </div>
          ))}
        </div>
        <p className="c07-h2" style={{ marginTop: 64, maxWidth: "20ch" }}>{PRODUCT.principle}</p>
      </section>
    </>
  );
}

/* ------------------------------ CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <>
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 72, alignItems: "end" }}>
        <div>
          <div className="c07-eyebrow">New case</div>
          <h1 className="c07-display" style={{ marginTop: 24 }}>Create case</h1>
          <div className="c07-hair" style={{ margin: "32px 0" }} />
          <p className="c07-lede">
            Nine sections. Each one turns clinical observation into something that can be compared with an observation
            made anywhere else in the world.
          </p>
        </div>
        <Disclaimer />
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "minmax(200px, 260px) minmax(0, 1fr)", gap: 72, alignItems: "start" }}>
        <aside>
          <div className="c07-label">Sections · three of nine</div>
          <div style={{ marginTop: 24 }}>
            {intakeSteps.map((s, i) => (
              <div key={s.id} className="c07-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
                <span className="c07-step-n">{s.index}</span>
                <div>
                  <div className="c07-step-l" style={{ fontSize: 14 }}>{s.label}</div>
                  {s.state === "active" && <div className="c07-small" style={{ marginTop: 6 }}>{s.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} />
          {active.fields.map((f) => (
            <div key={f.label} className="c07-field">
              <div>
                <div className="c07-label">{f.label}</div>
                {f.hint && <div className="c07-small" style={{ marginTop: 8 }}>{f.hint}</div>}
              </div>
              {f.kind === "chips" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", alignItems: "baseline" }}>
                  {f.value.split(" · ").map((v) => (
                    <span key={v} style={{ fontSize: 14.5 }}>{v}</span>
                  ))}
                </div>
              ) : (
                <div className="c07-input">{f.value}</div>
              )}
            </div>
          ))}

          <div className="c07-sec">
            <SecHead
              label="09 — Documents"
              note="The report is read at your institution. Extraction proposes; the clinician decides."
              right={<button className="c07-btn" data-variant="ghost">Upload report</button>}
            />
            <div className="c07-notice" style={{ marginBottom: 34 }}>
              <b>AI-assisted extraction.</b> Each term below carries the sentence it came from. Nothing enters the
              matching index until you confirm it.
            </div>
            <div className="c07-small" style={{ marginBottom: 20 }}>
              {aiExtraction.document} · {aiExtraction.pages} pages · {aiExtraction.processedAt}
            </div>
            {aiExtraction.terms.map((t, i) => (
              <div key={t.hpo} className="c07-term ody-fadein" style={stagger(i, 55, 140)}>
                <div>
                  <div style={{ display: "flex", gap: 18, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 19, fontFamily: "var(--font-display)", color: t.state === "rejected" ? "var(--ink-4)" : "var(--navy)", textDecoration: t.state === "rejected" ? "line-through" : undefined }}>{t.term}</span>
                    <span className="c07-fig">{t.hpo}</span>
                  </div>
                  <div className="c07-quote">{t.evidence}</div>
                  <div className="c07-small" style={{ marginTop: 10 }}>{aiExtraction.document}, {t.page}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="c07-num" style={{ fontSize: 26, color: t.confidence < 0.7 ? "var(--ink-4)" : "var(--navy)" }}>{Math.round(t.confidence * 100)}%</div>
                  <div className="c07-small">extraction confidence</div>
                  <div style={{ marginTop: 16, display: "flex", gap: 16, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {t.state === "confirmed" ? (
                      <span className="c07-tag" data-tone="green">Confirmed</span>
                    ) : t.state === "rejected" ? (
                      <span className="c07-tag" data-tone="red">Rejected</span>
                    ) : (
                      <>
                        <span className="c07-tag" data-tone="brass">Confirm</span>
                        <span className="c07-tag">Edit</span>
                        <span className="c07-tag">Reject</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginTop: 34, flexWrap: "wrap" }}>
              <span className="c07-small">Three confirmed · three awaiting review · one rejected</span>
              <button className="c07-btn">Confirm and continue</button>
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
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 72, alignItems: "end" }}>
        <div>
          <div className="c07-eyebrow">Case intelligence</div>
          <h1 className="c07-display" style={{ marginTop: 22 }}>{c.id}</h1>
          <div className="c07-hair" style={{ margin: "30px 0" }} />
          <p className="c07-lede">{c.headline}</p>
        </div>
        <dl className="c07-kv">
          <div><dt>Country</dt><dd>{c.country}</dd></div>
          <div><dt>Age group</dt><dd>{c.ageGroup}</dd></div>
          <div><dt>Status</dt><dd>{c.status}</dd></div>
          <div><dt>Completeness</dt><dd>{c.completeness}%</dd></div>
        </dl>
      </section>

      <section className="c07-sec">
        <SecHead label="Clinical summary" />
        <p className="c07-body" style={{ fontSize: 17, maxWidth: "74ch" }}>{c.narrative}</p>
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 1fr)", gap: 72, alignItems: "start" }}>
        <div>
          <SecHead label="Phenotype profile" note="Eight present, one explicitly absent. Terms normalised to the Human Phenotype Ontology." />
          <table className="c07-table">
            <thead><tr><th>Term</th><th style={{ width: 110 }}>HPO</th><th style={{ width: 90 }}>Onset</th><th style={{ width: 100 }}>Severity</th><th style={{ width: 110 }}>Status</th></tr></thead>
            <tbody>
              {c.phenotypes.map((p, i) => (
                <tr key={p.hpo} className="ody-fadein" style={stagger(i, 38, 100)}>
                  <td style={{ color: p.status === "Absent" ? "var(--ink-4)" : "var(--navy)", fontSize: 15 }}>{p.term}</td>
                  <td className="c07-fig">{p.hpo}</td>
                  <td className="c07-fig">{p.onset}</td>
                  <td className="c07-small">{p.severity}</td>
                  <td><span className="c07-tag" data-tone={p.status === "Absent" ? "red" : p.status === "Present" ? undefined : "green"}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="c07-sec">
            <SecHead label="Clinical timeline" />
            {c.timeline.map((t, i) => (
              <div key={i} className="c07-tl-item ody-fadein" style={stagger(i, 48, 120)}>
                <div className="c07-tl-age">{t.age}</div>
                <div>
                  <div style={{ fontSize: 16, color: "var(--navy)" }}>{t.label}</div>
                  <div className="c07-small" style={{ marginTop: 5 }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="c07-sec">
            <SecHead label="Genetic information" note={c.geneticSummary} />
            {c.genetics.map((g, i) => (
              <div key={i} style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, color: "var(--navy)" }}>{g.gene === "—" ? g.variant : `${g.gene} · ${g.variant}`}</span>
                  <span className="c07-tag" data-tone={g.classification.startsWith("VUS") ? "brass" : undefined}>{g.classification}</span>
                </div>
                <div className="c07-small" style={{ marginTop: 7 }}>{g.zygosity !== "—" && `${g.zygosity} · ${g.inheritance} · `}{g.note}</div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ display: "grid", gap: 56 }}>
          <div>
            <div className="c07-label">Case completeness</div>
            <div className="c07-num" style={{ fontSize: 54, marginTop: 12 }}>{c.completeness}%</div>
            <div style={{ marginTop: 22 }}>
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 64px 30px", gap: 16, alignItems: "center", padding: "9px 0" }}>
                  <span style={{ fontSize: 13 }}>{b.label}</span>
                  <div className="c07-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 200) }} /></div>
                  <span className="c07-fig" style={{ textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="c07-label">Potential matching signals</div>
            <ul className="c07-list" style={{ marginTop: 16 }}>
              {c.signals.map((s, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 14 }}>
                  <span className="c07-fig">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 13.5 }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="c07-label">Family pattern</div>
            <div style={{ marginTop: 18, color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={230} /></div>
            <div className="c07-small" style={{ marginTop: 14 }}>{c.family.notes}</div>
          </div>

          <div>
            <div className="c07-label">Negative evidence</div>
            <ul className="c07-list" style={{ marginTop: 16 }}>
              {c.negativeEvidence.map((n, i) => (
                <li key={i} style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{n}</li>
              ))}
            </ul>
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
      <section className="ody-rise" style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        <div className="c07-eyebrow">Potential cross-border match</div>
        <h1 className="c07-display" style={{ marginTop: 26 }}>
          {caseKZ.id} <span style={{ color: "var(--brass)" }}>·</span> {caseDE.id}
        </h1>
        <div className="c07-hair" style={{ margin: "34px auto" }} />
        <p className="c07-lede" style={{ margin: "0 auto" }}>
          {match.confidenceLabel}. Seven of eight independent evidence groups are concordant. {match.confidenceNote}
        </p>
        <div style={{ marginTop: 28 }}><Disclaimer /></div>
      </section>

      <section className="c07-sec">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 72 }}>
          {[caseKZ, caseDE].map((c, i) => (
            <div key={c.id} className="ody-rise" style={{ textAlign: i === 0 ? "left" : "right", ...stagger(i, 140, 100) }}>
              <span className="c07-tag" data-tone={i === 1 ? "brass" : undefined} data-align={i === 1 ? "right" : undefined}>
                {i === 0 ? "Your case" : "Network case"}
              </span>
              <div className="c07-num" style={{ fontSize: 42, marginTop: 16, color: i === 1 ? "var(--brass)" : "var(--navy)" }}>{c.id}</div>
              <div style={{ fontSize: 17, marginTop: 8 }}>{c.country}</div>
              <div className="c07-small" style={{ marginTop: 10 }}>{c.institution}</div>
              <div className="c07-small">{c.clinician} · {c.ageGroup}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c07-sec">
        <SecHead
          label="Evidence supporting similarity"
          note="Each group is assessed independently. A score expresses the similarity of recorded evidence — not the probability of a diagnosis."
        />
        {matchEvidence.map((e, i) => (
          <div key={e.id} className="c07-ev ody-fadein" style={stagger(i, 60, 100)}>
            <div>
              <div className="c07-h2" style={{ fontSize: 21 }}>{e.label}</div>
              <span className="c07-tag" data-tone={e.direction === "divergent" ? "red" : "brass"} style={{ marginTop: 12, display: "inline-block" }}>
                {e.direction === "divergent" ? "Divergent" : e.weight}
              </span>
            </div>
            <div>
              <div className="c07-body">{e.summary}</div>
              <div style={{ display: "flex", gap: 34, marginTop: 14, flexWrap: "wrap" }}>
                <span className="c07-fig">{caseKZ.id} · {e.kzValue}</span>
                <span className="c07-fig" style={{ color: "var(--brass)" }}>{caseDE.id} · {e.deValue}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="c07-num" style={{ fontSize: 42, color: e.direction === "divergent" ? "var(--ink-4)" : "var(--navy)" }}>{e.score}</div>
              <div className="c07-bar" style={{ marginTop: 12 }}><i className="ody-growx" style={{ width: `${e.score}%`, ...stagger(i, 60, 200) }} /></div>
            </div>
          </div>
        ))}
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 72, alignItems: "start" }}>
        <div>
          <SecHead label="How this match was found" />
          {match.reasoningSteps.map((s, i) => (
            <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 20, padding: "16px 0", borderBottom: "1px solid var(--line)", ...stagger(i, 80, 200) }}>
              <span className="c07-fig">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={{ fontSize: 15, color: "var(--navy)" }}>{s.label}</div>
                <div className="c07-small" style={{ marginTop: 5 }}>{s.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 30, marginTop: 34 }}>
            {[[match.cohortsQueried.toLocaleString(), "Cohorts queried"], [String(match.countriesQueried), "Countries"], [match.candidatesScreened.toLocaleString(), "Records screened"], [String(match.candidatesReturned), "Candidates returned"]].map(([v, l], i) => (
              <div key={l}>
                <div className="c07-num" style={{ fontSize: 26, color: i === 3 ? "var(--brass)" : "var(--navy)" }}>{v}</div>
                <div className="c07-small" style={{ marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SecHead label="Where the cases diverge" note="Divergence is recorded, not hidden." />
          {match.divergenceNotes.map((d, i) => (
            <p key={i} className="c07-body" style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>{d}</p>
          ))}
          <div className="c07-notice" style={{ marginTop: 20 }}>
            <b>{match.reviewStatus}.</b> {match.proposedAction}.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <button className="c07-btn">Request collaboration</button>
            <button className="c07-btn" data-variant="ghost">Not a match</button>
          </div>
        </div>
      </section>

      <section className="c07-sec">
        <SecHead label="Other candidates from the same query" />
        {otherCandidates.map((o, i) => (
          <div key={o.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 80px", gap: 26, padding: "18px 0", borderBottom: "1px solid var(--line)", alignItems: "baseline" }}>
            <span className="c07-fig" style={{ fontSize: 13 }}>{o.id} · {o.countryCode}</span>
            <span className="c07-body" style={{ margin: 0 }}>{o.country} — {o.note}</span>
            <span className="c07-num" style={{ fontSize: 24, textAlign: "right" }}>{o.score}</span>
          </div>
        ))}
      </section>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 72, alignItems: "end" }}>
        <div>
          <div className="c07-eyebrow">Case comparison</div>
          <h1 className="c07-display" style={{ marginTop: 24 }}>Kazakhstan<br />&amp; Germany</h1>
        </div>
        <div style={{ display: "grid", gap: 20 }}>
          <Disclaimer />
          <p className="c07-lede" style={{ fontSize: 15 }}>
            Every recorded signal set beside its counterpart. What is absent is shown as deliberately as what is
            present.
          </p>
        </div>
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 56 }}>
        <div className="ody-rise">
          <div className="c07-label">Phenotype overlap</div>
          <svg viewBox="0 0 160 92" style={{ width: "100%", maxWidth: 250, marginTop: 18 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="none" stroke="var(--ink-3)" strokeWidth="0.6" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--brass)" fillOpacity="0.07" stroke="var(--brass)" strokeWidth="0.6" />
            <text x="33" y="51" textAnchor="middle" fontSize="14" fontFamily="var(--font-display)" fill="var(--ink-2)">{phenotypeOverlap.onlyKZ}</text>
            <text x="80" y="53" textAnchor="middle" fontSize="23" fontFamily="var(--font-display)" fill="var(--navy)">{phenotypeOverlap.shared}</text>
            <text x="127" y="51" textAnchor="middle" fontSize="14" fontFamily="var(--font-display)" fill="var(--brass)">{phenotypeOverlap.onlyDE}</text>
          </svg>
        </div>
        <div className="ody-rise" style={stagger(1, 120)}>
          <div className="c07-label">Clinical trajectory · months</div>
          <div style={{ marginTop: 18, color: "var(--ink-4)", "--track-a": "var(--navy)", "--track-b": "var(--brass)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={128} />
          </div>
        </div>
        <div className="ody-rise" style={stagger(2, 120)}>
          <div className="c07-label">Family pattern</div>
          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={150} /></div>
            <div style={{ color: "var(--brass)" }}><Pedigree consanguineous={false} affected={[1]} size={150} /></div>
          </div>
        </div>
      </section>

      <section className="c07-sec">
        <div className="c07-cmp" style={{ borderBottom: "1px solid var(--line-2)", paddingBottom: 16 }}>
          <span className="c07-label">Signal</span>
          <span className="c07-label">{caseKZ.id} · Kazakhstan</span>
          <span className="c07-label" style={{ color: "var(--brass)" }}>{caseDE.id} · Germany</span>
          <span className="c07-label" style={{ textAlign: "right" }}>Agreement</span>
        </div>
        {comparisonGroups.map((g, gi) => (
          <div key={g.group}>
            <div style={{ padding: "34px 0 12px" }}>
              <span className="c07-eyebrow">{g.group}</span>
            </div>
            {g.rows.map((r, i) => (
              <div key={r.label} className="c07-cmp ody-fadein" style={stagger(i, 22, gi * 45)}>
                <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                <span>{r.kz}</span>
                <span style={{ color: r.agreement === "only-de" ? "var(--brass)" : undefined }}>{r.de}</span>
                <span style={{ textAlign: "right" }}>
                  <span className="c07-tag" data-tone={r.agreement === "match" ? "green" : r.agreement === "differ" ? "red" : "brass"} data-align="right">{LABEL[r.agreement]}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="c07-sec" style={{ display: "flex", justifyContent: "space-between", gap: 34, flexWrap: "wrap", alignItems: "center" }}>
        <div className="c07-notice" style={{ maxWidth: "62ch" }}>
          <b>Requires clinician review.</b> This comparison describes similarity between two recorded cases. It does not
          establish a diagnosis for either patient.
        </div>
        <button className="c07-btn">Open consultation</button>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 72, alignItems: "end" }}>
        <div>
          <div className="c07-eyebrow">Consultation · {collaboration.roomId}</div>
          <h1 className="c07-display" style={{ marginTop: 24 }}>{caseKZ.id} &amp; {caseDE.id}</h1>
          <div className="c07-hair" style={{ margin: "30px 0" }} />
          <p className="c07-lede">{collaboration.security}.</p>
        </div>
        <div style={{ display: "grid", gap: 26 }}>
          <Disclaimer />
          {collaboration.participants.map((p) => (
            <div key={p.networkId}>
              <div style={{ fontSize: 19, fontFamily: "var(--font-display)", color: "var(--navy)" }}>{p.name}</div>
              <div className="c07-small" style={{ marginTop: 5 }}>{p.role} · {p.institution}, {p.city}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c07-sec">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.stages.length}, 1fr)`, gap: 26, borderTop: "1px solid var(--line-2)", paddingTop: 20 }}>
          {s.stages.map((st, i) => (
            <div key={st} className="ody-fadein" style={stagger(i, 90)}>
              <span className="c07-tag" data-tone={i <= s.stageIndex ? "brass" : undefined}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ fontSize: 14.5, marginTop: 10, color: i <= s.stageIndex ? "var(--navy)" : "var(--ink-4)" }}>{st}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c07-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 72, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" />
          {collaboration.messages.map((m, i) => (
            <div key={m.id} className="c07-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
              {m.author !== "system" ? (
                <div>
                  <div style={{ fontSize: 17, fontFamily: "var(--font-display)", color: "var(--navy)" }}>{m.name}</div>
                  <div className="c07-small" style={{ marginTop: 5 }}>{m.role}</div>
                  <div className="c07-fig" style={{ marginTop: 10 }}>{m.time} ago</div>
                </div>
              ) : (
                <div className="c07-eyebrow">Record · {m.time} ago</div>
              )}
              <div>
                {m.kind === "proposal" && <span className="c07-tag" data-tone="brass" style={{ marginBottom: 14, display: "inline-block" }}>Proposal</span>}
                <p style={{ fontSize: m.author === "system" ? 14 : 16.5, lineHeight: 1.82, margin: 0, color: m.author === "system" ? "var(--ink-3)" : "var(--ink-2)", fontWeight: 300 }}>{m.body}</p>
                {m.attachment && (
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                    <span className="c07-fig">{m.attachment.label}</span>
                    <span className="c07-small">{m.attachment.meta}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 18, marginTop: 30, alignItems: "center" }}>
            <div className="c07-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
            <button className="c07-btn">Send</button>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 56 }}>
          <div>
            <div className="c07-label">Verification status</div>
            <div style={{ marginTop: 20 }}>
              <div style={{ paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
                <span className="c07-tag" data-tone="green">Verified</span>
                <div style={{ fontSize: 15, marginTop: 10, color: "var(--navy)" }}>{s.verificationA}</div>
                <div className="c07-small" style={{ marginTop: 5 }}>Evidence supports a clinically meaningful similarity</div>
              </div>
              <div style={{ paddingTop: 18 }}>
                <span className="c07-tag">Pending</span>
                <div style={{ fontSize: 15, marginTop: 10, color: "var(--ink-3)" }}>{s.verificationB}</div>
                <div className="c07-small" style={{ marginTop: 5 }}>Awaiting second clinician</div>
              </div>
            </div>
            <p className="c07-small" style={{ marginTop: 22 }}>
              A connection enters the network record only when two independent clinicians verify it.
            </p>
          </div>

          <div>
            <div className="c07-label">Shared evidence</div>
            <ul className="c07-list" style={{ marginTop: 16 }}>
              {collaboration.documents.map((d) => (
                <li key={d.label}>
                  <div className="c07-fig" style={{ fontSize: 12.5 }}>{d.label}</div>
                  <div className="c07-small" style={{ marginTop: 4 }}>{d.meta}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="c07-label">Decision log</div>
            <ul className="c07-list" style={{ marginTop: 16 }}>
              {collaboration.decisionLog.map((d) => (
                <li key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 54px", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13.5, color: d.state === "blocked" ? "var(--ink-4)" : "var(--ink)" }}>{d.action}</div>
                    <div className="c07-small" style={{ marginTop: 3 }}>{d.actor}</div>
                  </div>
                  <span className="c07-fig" style={{ textAlign: "right" }}>{d.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
