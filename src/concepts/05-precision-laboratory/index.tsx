"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { Ruler, WorldMap, TrajectoryChart, Pedigree, Spark, Radar, stagger } from "@/components/kit";
import {
  DISCLAIMER, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

const RAIL: { id: ScreenId; code: string; label: string }[] = [
  { id: "dashboard", code: "M-01", label: "INSTRUMENT" },
  { id: "create", code: "M-02", label: "INTAKE" },
  { id: "case", code: "M-03", label: "SPECIMEN" },
  { id: "match", code: "M-04", label: "CORRELATION" },
  { id: "compare", code: "M-05", label: "DIFFERENTIAL" },
  { id: "room", code: "M-06", label: "CONSULT" },
];

export default function PrecisionLaboratory({ screen }: { screen: ScreenId }) {
  const active = RAIL.find((r) => r.id === screen)!;
  return (
    <div className="c05 ody-surface">
      <div className="c05-frame">
        <aside className="c05-rail">
          <div className="c05-rail-mark">
            <b>ODYSSEY</b>
            <span>RARE DISEASE MATCH INSTRUMENT</span>
            <span style={{ color: "#8fbf10" }}>BUILD 4.2.1 · CALIBRATED 2026-09-18</span>
          </div>
          <div style={{ paddingTop: 10 }}>
            {RAIL.map((r) => (
              <div key={r.id} className="c05-railitem" data-on={r.id === screen}>
                <i>{r.code}</i>
                {r.label}
              </div>
            ))}
          </div>
          <div className="c05-rail-foot">
            OPERATOR {doctor.initials}<br />
            SITE KZ-AST-01<br />
            TIER II DATA ACCESS<br />
            <span style={{ color: "#8fbf10" }}>INDEX SYNC OK</span>
          </div>
        </aside>

        <div>
          <div className="c05-topbar">
            <span style={{ color: "var(--ink)" }}>{active.code} / {active.label}</span>
            <span className="c05-live">FEDERATED INDEX LIVE</span>
            <span>LATENCY 41 ms</span>
            <span>COHORTS 1,284</span>
            <span style={{ marginLeft: "auto" }}>{doctor.city.toUpperCase()} {doctor.localTime}</span>
            <span style={{ color: "var(--red)" }}>◆ DEMONSTRATION DATA</span>
          </div>

          <div className="c05-page">
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

const Disclaimer = () => <span className="c05-disclaimer">◆ {DISCLAIMER}</span>;

const Mod = ({ id, title, right, children, style }: { id: string; title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) => (
  <div className="c05-mod" style={style}>
    <div className="c05-mod-h">
      <span><span className="c05-mod-id">{id}</span> &nbsp;{title}</span>
      {right}
    </div>
    <div className="c05-mod-b">{children}</div>
  </div>
);

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <>
    <div className="c05-sechead">
      <div>
        <div className="c05-eyebrow">{label}</div>
        {note && <div className="c05-small" style={{ marginTop: 6 }}>{note}</div>}
      </div>
      {right}
    </div>
    <Ruler ticks={56} major={5} className="c05-cal" />
  </>
);

/** Horizontal measurement readout with a target marker. */
function Scale({ value, target, signal, delay = 0 }: { value: number; target?: number; signal?: boolean; delay?: number }) {
  return (
    <div className="c05-scale">
      {[0, 20, 40, 60, 80, 100].map((m) => (
        <span key={m} className="c05-scale-mark" style={{ left: `${m}%`, height: m % 40 === 0 ? 11 : 6 }} />
      ))}
      <span className="c05-scale-fill ody-growx" data-signal={signal} style={{ width: `${value}%`, ...stagger(0, 0, delay) }} />
      {target !== undefined && <span className="c05-scale-target" style={{ left: `${target}%` }} />}
    </div>
  );
}

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c05-eyebrow">Operator session · {doctor.networkId}</div>
          <h1 className="c05-h1" style={{ marginTop: 12 }}>{doctor.greeting}, {doctor.name}</h1>
          <p className="c05-body" style={{ marginTop: 10, maxWidth: "70ch" }}>
            {doctor.institution}. Twelve unresolved cases under measurement. Four returned candidate correlations in the
            last index cycle.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c05-sec">
        <SecHead label="Cases requiring attention" note="Values are counts, not estimates" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginTop: 14 }}>
          {attention.map((a, i) => (
            <div key={a.id} className="c05-tile ody-rise" data-signal={a.tone === "signal"} style={stagger(i, 70, 80)}>
              <div className="c05-tile-u">{a.label}</div>
              <div className="c05-tile-n" style={{ color: a.tone === "signal" ? "var(--signal-2)" : a.tone === "alert" ? "var(--red)" : "var(--ink)" }}>
                {String(a.count).padStart(2, "0")}
              </div>
              <div className="c05-small" style={{ marginTop: 10 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="c05-sec">
        <SecHead label="Correlation detected" note={`Cycle complete ${match.surfaced} · ${match.candidatesReturned} candidates above threshold`} right={<button className="c05-btn">Open correlation</button>} />
        <div className="c05-mod" style={{ marginTop: 14, borderColor: "var(--signal-2)" }}>
          <div className="c05-mod-h" style={{ background: "rgba(143,191,16,0.08)", color: "var(--signal-2)" }}>
            <span><span className="c05-mod-id">M-04</span> &nbsp;CROSS-BORDER CORRELATION · {match.id}</span>
            <span className="c05-chip" data-tone="signal">{match.confidenceLabel}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.1fr)" }}>
            {[caseKZ, caseDE].map((c, i) => (
              <div key={c.id} style={{ padding: 16, borderRight: "1px solid var(--line)" }} className="ody-rise">
                <div className="c05-eyebrow">{i === 0 ? "Specimen A · local" : "Specimen B · network"}</div>
                <div className="c05-readout" style={{ fontSize: 24, marginTop: 10, color: i === 1 ? "var(--signal-2)" : undefined }}>{c.id}</div>
                <div className="c05-small" style={{ marginTop: 4 }}>{c.country} · {c.ageGroup}</div>
                <dl className="c05-kv" style={{ marginTop: 14 }}>
                  <dt>Status</dt><dd>{c.status}</dd>
                  <dt>Complete</dt><dd className="c05-mono">{c.completeness}%</dd>
                  <dt>Groups</dt><dd className="c05-mono">{c.signals.length}</dd>
                </dl>
              </div>
            ))}
            <div style={{ padding: 16 }}>
              <div className="c05-eyebrow">Aggregate evidence similarity</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                <span className="c05-readout" style={{ fontSize: 40, color: "var(--signal-2)" }}>{match.aggregate}</span>
                <span className="c05-small">of 100 · not a diagnostic probability</span>
              </div>
              <div style={{ marginTop: 10 }}><Scale value={match.aggregate} target={70} signal delay={300} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span className="c05-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>0</span>
                <span className="c05-mono" style={{ fontSize: 9, color: "var(--red)" }}>REVIEW THRESHOLD 70</span>
                <span className="c05-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>100</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div>
          <SecHead label="Case queue" note="12 unresolved · 6 shown · completeness governs correlation power" />
          <div className="c05-mod" style={{ marginTop: 14 }}>
            <table className="c05-table">
              <thead><tr><th style={{ width: 86 }}>ID</th><th>Presentation</th><th style={{ width: 120 }}>Status</th><th style={{ width: 160 }}>Completeness</th><th style={{ width: 74 }}>Updated</th></tr></thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 120)}>
                    <td className="n" style={{ color: r.caseId === "ODY-001" ? "var(--signal-2)" : undefined }}>{r.caseId}</td>
                    <td style={{ color: "var(--ink-2)" }}>{r.summary}<div className="c05-small" style={{ marginTop: 3 }}>{r.ageGroup} · {r.signals} groups</div></td>
                    <td><span className="c05-chip" data-tone={r.status === "Match proposed" ? "signal" : r.status === "Verified" ? "blue" : undefined}>{r.status}</span></td>
                    <td><Scale value={r.completeness} target={75} signal={r.completeness >= 75} delay={200 + i * 45} /></td>
                    <td className="n c05-small">{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div>
            <SecHead label="Index activity" />
            <Mod id="M-07" title="NETWORK LOG" style={{ marginTop: 14 }}>
              {networkActivity.map((a, i) => (
                <div key={a.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "58px 1fr auto", gap: 10, padding: "9px 0", borderBottom: i < networkActivity.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 55, 200) }}>
                  <span className="c05-mono" style={{ fontSize: 9, color: a.kind === "match" ? "var(--signal-2)" : "var(--ink-4)", letterSpacing: "0.08em" }}>{a.origin}</span>
                  <div>
                    <div style={{ fontSize: 12.5 }}>{a.title}</div>
                    <div className="c05-small" style={{ marginTop: 2 }}>{a.detail}</div>
                  </div>
                  <span className="c05-mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>{a.time}</span>
                </div>
              ))}
            </Mod>
          </div>

          <Mod id="M-08" title="YIELD · 90 DAYS" right={<span className="c05-mono">n = 60</span>}>
            {contributionMetrics.map((m, i) => (
              <div key={m.id} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span>{m.label}</span>
                  <span className="c05-mono">{m.value}<span style={{ color: "var(--ink-4)" }}>/{m.of}</span></span>
                </div>
                <div className="c05-bar" data-signal={i === 2}><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              <div>
                <div className="c05-eyebrow">Queries / month</div>
                <div className="c05-readout" style={{ fontSize: 22, marginTop: 5 }}>52</div>
              </div>
              <div style={{ color: "var(--signal-2)" }}><Spark data={querySeries} w={130} h={34} /></div>
            </div>
          </Mod>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {networkStats.slice(0, 4).map((s) => (
              <div key={s.id} className="c05-tile">
                <div className="c05-tile-u">{s.label}</div>
                <div className="c05-readout" style={{ fontSize: 20, marginTop: 8 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 22, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c05-eyebrow">M-02 / INTAKE</div>
          <h1 className="c05-h1" style={{ marginTop: 12 }}>Create case</h1>
          <p className="c05-body" style={{ marginTop: 10, maxWidth: "72ch" }}>
            Nine measurement sections. Each recorded value carries its unit, its reference range and its provenance;
            only then can it be compared with a value recorded at another site.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "minmax(200px, 250px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div>
          <SecHead label="Sections" note="3 of 9 complete" />
          <div className="c05-mod" style={{ marginTop: 14 }}>
            {intakeSteps.map((s, i) => (
              <div key={s.id} className="c05-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
                <span className="c05-step-n">{s.index}</span>
                <div>
                  <div style={{ fontWeight: s.state === "active" ? 600 : 400 }}>{s.label}</div>
                  {s.state === "active" && <div className="c05-small" style={{ marginTop: 4 }}>{s.description}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="c05-notice" style={{ marginTop: 14 }}>
            <span style={{ color: "var(--signal-2)" }}>▮</span>
            <span><b>Completeness 82%.</b> Negative evidence contributes most to correlation precision at this stage.</span>
          </div>
        </div>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="c05-chip" data-tone="blue">HPO NORMALISED</span>} />
          <Mod id="F-02" title="PHENOTYPE INPUT" style={{ marginTop: 14 }}>
            {active.fields.map((f) => (
              <div key={f.label} className="c05-field">
                <div>
                  <div className="c05-eyebrow" style={{ letterSpacing: "0.12em" }}>{f.label}</div>
                  {f.hint && <div className="c05-small" style={{ marginTop: 5 }}>{f.hint}</div>}
                </div>
                {f.kind === "chips" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {f.value.split(" · ").map((v) => (
                      <span key={v} className="c05-chip" style={{ textTransform: "none", letterSpacing: "0.01em", fontFamily: "var(--font-ui)", fontSize: 11 }}>{v}</span>
                    ))}
                  </div>
                ) : (
                  <div className="c05-input">{f.value}</div>
                )}
              </div>
            ))}
          </Mod>

          <div className="c05-sec">
            <SecHead label="09 — Documents · AI-assisted extraction" note="Parsed locally. Terms require operator verification before indexing." />
            <Mod
              id="X-09"
              title="EXTRACTION OUTPUT"
              right={<span className="c05-mono">{aiExtraction.document} · {aiExtraction.pages} pp · {aiExtraction.processedAt}</span>}
              style={{ marginTop: 14 }}
            >
              <div className="c05-notice" style={{ borderColor: "var(--amber)", background: "rgba(192,123,18,0.06)" }}>
                <span style={{ color: "var(--amber)" }}>▲</span>
                <span><b>Assistive output, not a measurement.</b> Extraction confidence describes the parser's certainty about the text — it says nothing about the patient. A clinician confirms, edits or rejects every term.</span>
              </div>
              <div style={{ marginTop: 14, border: "1px solid var(--line)" }}>
                <div className="c05-term" style={{ background: "var(--surface-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)" }}>
                  <span>Proposed term / source sentence</span>
                  <span>Confidence · verification</span>
                </div>
                {aiExtraction.terms.map((t, i) => (
                  <div key={t.hpo} className="c05-term ody-fadein" style={stagger(i, 55, 140)}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                        <span className="c05-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{t.hpo} · {t.page}</span>
                      </div>
                      <div className="c05-quote">{t.evidence}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span className="c05-readout" style={{ fontSize: 17, color: t.confidence < 0.7 ? "var(--amber)" : "var(--ink)" }}>{t.confidence.toFixed(2)}</span>
                        <span className="c05-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>0.00–1.00</span>
                      </div>
                      <Scale value={t.confidence * 100} target={70} signal={t.confidence >= 0.7} delay={200 + i * 55} />
                      <div style={{ marginTop: 9, display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {t.state === "confirmed" ? (
                          <span className="c05-chip" data-tone="signal">✓ CONFIRMED</span>
                        ) : t.state === "rejected" ? (
                          <span className="c05-chip" data-tone="red">REJECTED</span>
                        ) : (
                          <>
                            <span className="c05-chip" data-tone="signal">CONFIRM</span>
                            <span className="c05-chip">EDIT</span>
                            <span className="c05-chip">REJECT</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 14, flexWrap: "wrap" }}>
                <span className="c05-small">3 confirmed · 3 pending verification · 1 rejected. Only confirmed terms enter the index.</span>
                <button className="c05-btn">Verify and index</button>
              </div>
            </Mod>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ CASE ------------------------------ */

function CaseIntel() {
  const c = caseKZ;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c05-eyebrow">M-03 / SPECIMEN RECORD</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
            <h1 className="c05-h1">{c.id}</h1>
            <span className="c05-chip" data-tone="amber">{c.status}</span>
            <span className="c05-chip" data-tone="signal">1 CORRELATION</span>
          </div>
          <p className="c05-body" style={{ marginTop: 10, maxWidth: "76ch" }}>{c.headline}</p>
        </div>
        <dl className="c05-kv">
          <dt>Country</dt><dd>{c.country}</dd>
          <dt>Age group</dt><dd>{c.ageGroup}</dd>
          <dt>Genetic</dt><dd>Unresolved</dd>
          <dt>Complete</dt><dd className="c05-mono">{c.completeness}%</dd>
        </dl>
      </header>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div>
          <SecHead label="Phenotype profile" note="8 present · 1 explicitly absent" />
          <Mod id="P-01" title="OBSERVED TERMS" style={{ marginTop: 14 }} right={<span className="c05-mono">HPO 2026-07 RELEASE</span>}>
            <table className="c05-table">
              <thead><tr><th>Term</th><th style={{ width: 98 }}>HPO</th><th style={{ width: 74 }}>Onset</th><th style={{ width: 82 }}>Severity</th><th style={{ width: 86 }}>Status</th><th style={{ width: 118 }}>Source</th></tr></thead>
              <tbody>
                {c.phenotypes.map((p, i) => (
                  <tr key={p.hpo} className="ody-fadein" style={stagger(i, 36, 100)}>
                    <td style={{ fontWeight: 500, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                    <td className="n" style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.hpo}</td>
                    <td className="n">{p.onset}</td>
                    <td>{p.severity}</td>
                    <td><span className="c05-chip" data-tone={p.status === "Absent" ? "red" : p.status === "Present" ? undefined : "blue"}>{p.status}</span></td>
                    <td className="c05-small">{p.source}{!p.verified && <span style={{ color: "var(--amber)" }}> · unverified</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Mod>

          <div className="c05-sec">
            <SecHead label="Laboratory" note="Values with local reference ranges. Flagged values fall outside range." />
            <Mod id="L-01" title="ANALYTE PANEL" style={{ marginTop: 14 }}>
              <table className="c05-table">
                <thead><tr><th>Analyte</th><th style={{ width: 88 }}>Matrix</th><th style={{ width: 86 }}>Value</th><th style={{ width: 74 }}>Unit</th><th style={{ width: 92 }}>Reference</th><th style={{ width: 150 }}>Deviation</th></tr></thead>
                <tbody>
                  {c.labs.map((l, i) => (
                    <tr key={l.analyte + l.matrix} className="ody-fadein" style={stagger(i, 36, 120)}>
                      <td style={{ fontWeight: 500 }}>{l.analyte}</td>
                      <td className="c05-small">{l.matrix}</td>
                      <td className="n" style={{ color: l.flag === "high" ? "var(--red)" : l.flag === "low" ? "var(--blue)" : undefined, fontWeight: 500 }}>
                        {l.value}{l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}
                      </td>
                      <td className="n c05-small">{l.unit}</td>
                      <td className="n c05-small">{l.ref}</td>
                      <td>
                        {l.flag !== "normal" ? (
                          <Scale value={l.flag === "high" ? 82 : 22} target={60} delay={200 + i * 40} />
                        ) : (
                          <span className="c05-chip" style={{ height: 18 }}>IN RANGE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Mod>
          </div>

          <div className="c05-sec">
            <SecHead label="Clinical timeline" note="Event sequence with age at onset" />
            <div className="c05-tl" style={{ marginTop: 14 }}>
              {c.timeline.map((t, i) => (
                <React.Fragment key={i}>
                  <div className="c05-tl-age ody-fadein" style={stagger(i, 45, 100)}>{t.age}</div>
                  <div className="c05-tl-axis" data-kind={t.kind} />
                  <div className="c05-tl-body ody-fadein" style={stagger(i, 45, 100)}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
                    <div className="c05-small" style={{ marginTop: 2 }}>{t.detail}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div>
            <SecHead label="Case completeness" note="Per-section coverage against index requirements" />
            <Mod id="C-01" title="COVERAGE" right={<span className="c05-readout">{c.completeness}%</span>} style={{ marginTop: 14 }}>
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>{b.label}</span>
                    <span className="c05-mono">{b.value}</span>
                  </div>
                  <Scale value={b.value} target={75} signal={b.value >= 75} delay={200 + i * 45} />
                </div>
              ))}
            </Mod>
          </div>

          <Mod id="G-01" title="GENETIC RESULTS">
            <p className="c05-small" style={{ marginTop: 0 }}>{c.geneticSummary}</p>
            {c.genetics.map((g, i) => (
              <div key={i} style={{ padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <span className="c05-mono" style={{ fontSize: 12 }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                  <span className="c05-chip" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                </div>
                <div className="c05-small" style={{ marginTop: 4 }}>{g.zygosity !== "—" && `${g.zygosity} · ${g.inheritance} · `}{g.note}</div>
              </div>
            ))}
          </Mod>

          <Mod id="S-01" title="MATCHING SIGNALS" right={<span className="c05-mono">{c.signals.length}</span>}>
            {c.signals.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "8px 0", borderBottom: i < c.signals.length - 1 ? "1px solid var(--line)" : undefined }}>
                <span className="c05-mono" style={{ fontSize: 10, color: "var(--signal-2)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12.5 }}>{s}</span>
              </div>
            ))}
          </Mod>

          <Mod id="F-01" title="FAMILY PATTERN">
            <Pedigree consanguineous affected={[0, 2]} size={200} />
            <dl className="c05-kv" style={{ marginTop: 12 }}>
              <dt>Pedigree</dt><dd>{c.family.pedigree}</dd>
              <dt>F coeff</dt><dd className="c05-mono">0.0625</dd>
            </dl>
          </Mod>

          <Mod id="N-01" title="NEGATIVE EVIDENCE" right={<span className="c05-mono">{c.negativeEvidence.length} EXCLUSIONS</span>}>
            {c.negativeEvidence.map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 9, fontSize: 12, padding: "5px 0", color: "var(--ink-2)" }}>
                <span style={{ color: "var(--red)" }}>×</span>{n}
              </div>
            ))}
          </Mod>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ MATCH ------------------------------ */

function Match() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c05-eyebrow">M-04 / CORRELATION · {match.id}</div>
          <h1 className="c05-h1" style={{ marginTop: 12 }}>{caseKZ.id} ↔ {caseDE.id}</h1>
          <p className="c05-body" style={{ marginTop: 10, maxWidth: "74ch" }}>
            {match.confidenceLabel}. {match.confidenceNote}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="c05-eyebrow">Aggregate evidence similarity</div>
          <div className="c05-readout" style={{ fontSize: 52, color: "var(--signal-2)", lineHeight: 1 }}>{match.aggregate}</div>
          <div className="c05-small">{match.concordantGroups} of {match.totalGroups} groups concordant</div>
          <div style={{ marginTop: 10 }}><Disclaimer /></div>
        </div>
      </header>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div>
          <SecHead label="Evidence supporting similarity" note="Per-group similarity against a review threshold of 70. A score describes recorded evidence, not diagnostic probability." />
          <Mod id="E-01" title="GROUP MEASUREMENTS" style={{ marginTop: 14 }} right={<span className="c05-mono" style={{ color: "var(--red)" }}>▎THRESHOLD 70</span>}>
            <div className="c05-ev">
              {matchEvidence.map((e, i) => (
                <div key={e.id} className="c05-ev-row ody-fadein" style={stagger(i, 55, 100)}>
                  <span className="c05-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.label}</div>
                    <span className="c05-chip" data-tone={e.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 6 }}>
                      {e.direction === "divergent" ? "DIVERGENT" : e.weight.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="c05-small" style={{ color: "var(--ink-2)", fontSize: 12.5 }}>{e.summary}</div>
                    <div style={{ display: "flex", gap: 18, marginTop: 6, flexWrap: "wrap" }}>
                      <span className="c05-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>A {e.kzValue}</span>
                      <span className="c05-mono" style={{ fontSize: 10.5, color: "var(--signal-2)" }}>B {e.deValue}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span className="c05-readout" style={{ fontSize: 20, color: e.direction === "divergent" ? "var(--amber)" : "var(--ink)" }}>{e.score}</span>
                      <span className="c05-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>/100</span>
                    </div>
                    <Scale value={e.score} target={70} signal={e.direction !== "divergent"} delay={200 + i * 55} />
                  </div>
                </div>
              ))}
            </div>
          </Mod>

          <div className="c05-sec">
            <SecHead label="Divergence log" note="Recorded, not suppressed" />
            <Mod id="D-01" title="UNRESOLVED DIFFERENCES" style={{ marginTop: 14 }}>
              {match.divergenceNotes.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 10, padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                  <span className="c05-mono" style={{ fontSize: 10, color: "var(--amber)" }}>△{i + 1}</span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{d}</span>
                </div>
              ))}
            </Mod>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <Mod id="R-01" title="EVIDENCE PROFILE">
            <div style={{ display: "grid", placeItems: "center", color: "var(--ink-3)", "--radar-fill": "var(--signal)", "--radar-stroke": "var(--signal-2)", "--radar-fill-opacity": 0.12 } as React.CSSProperties}>
              <Radar values={matchEvidence.map((e) => e.score)} labels={["PHEN", "TRAJ", "GEN", "FAM", "LAB", "IMG", "NEG", "TIME"]} size={252} />
            </div>
          </Mod>

          <Mod id="Q-01" title="QUERY PROVENANCE">
            {match.reasoningSteps.map((s, i) => (
              <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, paddingBottom: 13, ...stagger(i, 80, 200) }}>
                <span className="c05-mono" style={{ fontSize: 10, color: "var(--signal-2)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.label}</div>
                  <div className="c05-small" style={{ marginTop: 3 }}>{s.detail}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              {[[match.cohortsQueried.toLocaleString(), "COHORTS"], [String(match.countriesQueried), "COUNTRIES"], [match.candidatesScreened.toLocaleString(), "SCREENED"], [String(match.candidatesReturned), "RETURNED"]].map(([v, l], i) => (
                <div key={l}>
                  <div className="c05-readout" style={{ fontSize: 17, color: i === 3 ? "var(--signal-2)" : undefined }}>{v}</div>
                  <div className="c05-tile-u" style={{ marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </Mod>

          <Mod id="A-01" title="REQUIRED ACTION" style={{ borderColor: "var(--signal-2)" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{match.reviewStatus}</div>
            <p className="c05-small" style={{ marginTop: 7 }}>{match.proposedAction}.</p>
            <ol style={{ margin: "12px 0 0", paddingLeft: 17, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>
              {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 5 }}>{n}</li>)}
            </ol>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button className="c05-btn">Request collaboration</button>
              <button className="c05-btn" data-variant="ghost">Reject</button>
            </div>
          </Mod>

          <Mod id="O-01" title="OTHER CANDIDATES" right={<span className="c05-mono">BELOW THRESHOLD</span>}>
            {otherCandidates.map((o, i) => (
              <div key={o.id} style={{ padding: "9px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span className="c05-mono" style={{ fontSize: 12 }}>{o.id} · {o.country}</span>
                  <span className="c05-readout" style={{ fontSize: 14, color: "var(--ink-3)" }}>{o.score}</span>
                </div>
                <div className="c05-small" style={{ marginTop: 3 }}>{o.note}</div>
              </div>
            ))}
          </Mod>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "CONCORDANT", partial: "PARTIAL", differ: "DIFFERS", "only-de": "B ONLY", "only-kz": "A ONLY" };

function Compare() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 22, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c05-eyebrow">M-05 / DIFFERENTIAL · {match.id}</div>
          <h1 className="c05-h1" style={{ marginTop: 12 }}>Specimen A / Specimen B</h1>
          <p className="c05-body" style={{ marginTop: 10, maxWidth: "70ch" }}>
            A = {caseKZ.id}, Kazakhstan. B = {caseDE.id}, Germany. Every recorded signal aligned; divergences flagged.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <Mod id="V-01" title="PHENOTYPE OVERLAP">
          <svg viewBox="0 0 160 88" style={{ width: "100%" }} aria-hidden>
            <rect x="12" y="20" width="70" height="48" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.7" className="ody-nodein" />
            <rect x="60" y="20" width="88" height="48" fill="var(--signal)" fillOpacity="0.12" stroke="var(--signal-2)" strokeWidth="0.7" className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} />
            <text x="36" y="48" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--ink-2)">{phenotypeOverlap.onlyKZ}</text>
            <text x="71" y="49" textAnchor="middle" fontSize="18" fontFamily="var(--font-data)" fill="var(--ink)">{phenotypeOverlap.shared}</text>
            <text x="110" y="48" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--signal-2)">{phenotypeOverlap.onlyDE}</text>
            <text x="36" y="14" textAnchor="middle" fontSize="7" fontFamily="var(--font-data)" fill="var(--ink-4)" letterSpacing="0.1em">A ONLY</text>
            <text x="71" y="80" textAnchor="middle" fontSize="7" fontFamily="var(--font-data)" fill="var(--ink-4)" letterSpacing="0.1em">SHARED</text>
            <text x="110" y="14" textAnchor="middle" fontSize="7" fontFamily="var(--font-data)" fill="var(--ink-4)" letterSpacing="0.1em">B ONLY</text>
          </svg>
        </Mod>
        <Mod id="V-02" title="TRAJECTORY · MONTHS">
          <div style={{ color: "var(--ink-3)", "--track-a": "var(--ink)", "--track-b": "var(--signal-2)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="A" labelB="B" height={116} />
          </div>
          <Ruler ticks={40} major={10} className="c05-cal" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {[0, 5, 10, 15, 20].map((m) => <span key={m} className="c05-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>{m}m</span>)}
          </div>
        </Mod>
        <Mod id="V-03" title="FAMILY PATTERN">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={142} /></div>
            <div style={{ color: "var(--signal-2)" }}><Pedigree consanguineous={false} affected={[1]} size={142} /></div>
          </div>
        </Mod>
      </div>

      <div className="c05-sec">
        <SecHead label="Signal-by-signal differential" note="8 groups · 34 rows" />
        <div className="c05-mod" style={{ marginTop: 14 }}>
          <div className="c05-cmp" style={{ background: "var(--surface-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", borderBottom: "1px solid var(--line-2)" }}>
            <span>Signal</span><span>A · {caseKZ.id} KZ</span><span style={{ color: "var(--signal-2)" }}>B · {caseDE.id} DE</span><span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "11px 14px 6px", borderBottom: "1px solid var(--line)" }}>
                <span className="c05-eyebrow">{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c05-cmp ody-fadein" style={stagger(i, 20, gi * 40)}>
                  <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                  <span>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--signal-2)" : undefined }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="c05-chip" data-tone={r.agreement === "match" ? "signal" : r.agreement === "differ" ? "amber" : r.agreement.startsWith("only") ? "blue" : undefined} style={{ height: 17, fontSize: 8.5 }}>{LABEL[r.agreement]}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="c05-sec" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="c05-notice" style={{ maxWidth: "70ch" }}>
          <span style={{ color: "var(--red)" }}>◆</span>
          <span><b>Requires clinician review.</b> The instrument reports similarity between recorded evidence. It does not establish a diagnosis for either patient.</span>
        </div>
        <button className="c05-btn">Open consult channel</button>
      </div>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div className="c05-eyebrow">M-06 / CONSULT CHANNEL · {collaboration.roomId}</div>
          <h1 className="c05-h1" style={{ marginTop: 12 }}>{collaboration.title}</h1>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <span className="c05-chip" data-tone="signal">◈ E2E ENCRYPTED</span>
            <span className="c05-chip">OPENED {collaboration.opened.toUpperCase()}</span>
            <span className="c05-chip">AUDIT LOG IMMUTABLE</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {collaboration.participants.map((p, i) => (
            <div key={p.networkId} className="c05-tile" data-signal={i === 1} style={{ minWidth: 210 }}>
              <div className="c05-tile-u">{i === 0 ? "OPERATOR A" : "OPERATOR B"}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{p.name}</div>
              <div className="c05-small" style={{ marginTop: 3 }}>{p.role}</div>
              <div className="c05-small">{p.city}, {p.country}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="c05-sec">
        <SecHead label="Channel stage" />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.stages.length}, 1fr)`, gap: 8, marginTop: 14 }}>
          {s.stages.map((st, i) => (
            <div key={st} className="c05-tile ody-fadein" data-signal={i === s.stageIndex} style={{ padding: "10px 12px", ...stagger(i, 90) }}>
              <div className="c05-mono" style={{ fontSize: 9, color: i <= s.stageIndex ? "var(--signal-2)" : "var(--ink-4)" }}>
                {String(i + 1).padStart(2, "0")} {i < s.stageIndex ? "COMPLETE" : i === s.stageIndex ? "ACTIVE" : "PENDING"}
              </div>
              <div style={{ fontSize: 12.5, marginTop: 6, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)" }}>{st}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="c05-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" note="No identifiable patient data is exchanged on this channel" />
          <Mod id="T-01" title="TRANSCRIPT" style={{ marginTop: 14 }} right={<span className="c05-mono">{collaboration.messages.length} ENTRIES</span>}>
            {collaboration.messages.map((m, i) => (
              <div key={m.id} className="c05-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
                {m.author !== "system" ? (
                  <div>
                    <div className="c05-mono" style={{ fontSize: 10, color: m.author === "B" ? "var(--signal-2)" : "var(--ink-4)", letterSpacing: "0.1em" }}>
                      OPERATOR {m.author}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 5 }}>{m.name}</div>
                    <div className="c05-small" style={{ marginTop: 2 }}>{m.time} ago</div>
                  </div>
                ) : (
                  <div className="c05-mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.12em" }}>SYSTEM · {m.time} AGO</div>
                )}
                <div>
                  {m.kind === "proposal" && <span className="c05-chip" data-tone="signal" style={{ marginBottom: 8 }}>PROPOSAL</span>}
                  <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: m.author === "system" ? "var(--ink-3)" : "var(--ink-2)" }}>{m.body}</p>
                  {m.attachment && (
                    <div style={{ marginTop: 10, border: "1px solid var(--line)", background: "var(--surface-2)", padding: "8px 12px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <span className="c05-mono" style={{ fontSize: 11.5 }}>{m.attachment.label}</span>
                      <span className="c05-small">{m.attachment.meta}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <div className="c05-input" style={{ flex: 1, color: "var(--ink-4)" }}>Enter clinical note…</div>
              <button className="c05-btn">Send</button>
            </div>
          </Mod>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <Mod id="V-01" title="VERIFICATION STATE" right={<span className="c05-chip" data-tone="amber">1 / 2</span>} style={{ borderColor: "var(--signal-2)" }}>
            <div style={{ display: "flex", gap: 10, paddingBottom: 11, borderBottom: "1px solid var(--line)" }}>
              <span style={{ color: "var(--signal-2)" }}>■</span>
              <div><div style={{ fontSize: 12.5 }}>{s.verificationA}</div><div className="c05-small" style={{ marginTop: 3 }}>Evidence supports a clinically meaningful similarity</div></div>
            </div>
            <div style={{ display: "flex", gap: 10, paddingTop: 11 }}>
              <span style={{ color: "var(--amber)" }}>□</span>
              <div><div style={{ fontSize: 12.5 }}>{s.verificationB}</div><div className="c05-small" style={{ marginTop: 3 }}>Awaiting second clinician</div></div>
            </div>
            <p className="c05-small" style={{ marginTop: 13, paddingTop: 11, borderTop: "1px solid var(--line)" }}>
              Two independent clinician verifications are required before a connection enters the network record.
            </p>
          </Mod>

          <Mod id="E-02" title="SHARED EVIDENCE" right={<span className="c05-mono">{collaboration.documents.length}</span>}>
            {collaboration.documents.map((d, i) => (
              <div key={d.label} style={{ padding: "9px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--line)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span className="c05-mono" style={{ fontSize: 11.5 }}>{d.label}</span>
                  <span className="c05-chip" style={{ height: 17, fontSize: 8.5 }}>{d.kind}</span>
                </div>
                <div className="c05-small" style={{ marginTop: 3 }}>{d.meta}</div>
              </div>
            ))}
          </Mod>

          <Mod id="L-02" title="DECISION LOG" right={<span className="c05-mono">IMMUTABLE</span>}>
            {collaboration.decisionLog.map((d, i) => (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "16px 1fr 44px", gap: 10, padding: "8px 0", borderBottom: i < collaboration.decisionLog.length - 1 ? "1px solid var(--line)" : undefined }}>
                <span style={{ color: d.state === "done" ? "var(--signal-2)" : d.state === "pending" ? "var(--amber)" : "var(--ink-4)", fontSize: 11 }}>
                  {d.state === "done" ? "■" : "□"}
                </span>
                <div>
                  <div style={{ fontSize: 12, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</div>
                  <div className="c05-small" style={{ marginTop: 2 }}>{d.actor}</div>
                </div>
                <span className="c05-mono" style={{ fontSize: 9.5, color: "var(--ink-4)", textAlign: "right" }}>{d.time}</span>
              </div>
            ))}
          </Mod>
          <Disclaimer />
        </div>
      </div>
    </>
  );
}
