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

const MENU: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Workspace" },
  { id: "create", label: "Intake" },
  { id: "case", label: "Case" },
  { id: "match", label: "Match" },
  { id: "compare", label: "Diff" },
  { id: "room", label: "Consult" },
];

const CMD_HINT: Record<ScreenId, string> = {
  dashboard: "open case ODY-001",
  create: "extract phenotypes from neuro-summary-2026-02.pdf",
  case: "run federated query · ODY-001",
  match: "explain match ODY-M-2261",
  compare: "diff ODY-001 ODY-742 --group=genetics",
  room: "verify connection ODY-M-2261",
};

export default function MedicalOS({ screen }: { screen: ScreenId }) {
  return (
    <div className="c09 ody-surface">
      <div className="c09-menubar">
        <span className="c09-logo">ODYSSEY</span>
        {MENU.map((m) => <span key={m.id} className="c09-menu" data-on={m.id === screen}>{m.label}</span>)}
        <div className="c09-right">
          <span style={{ color: "var(--green)" }}>● INDEX LIVE</span>
          <span>412 NODES</span>
          <span>{doctor.initials} · {doctor.networkId}</span>
        </div>
      </div>

      <div className="c09-cmd">
        <span style={{ color: "var(--accent)" }}>❯</span>
        <div className="c09-cmd-input">
          <b>{CMD_HINT[screen]}</b>
          <span className="ody-blink" style={{ color: "var(--accent)" }}>▌</span>
        </div>
        <span className="c09-kbd">⌘K</span>
        <span className="c09-kbd">⌘⇧F</span>
        <span className="c09-kbd">?</span>
      </div>

      {screen === "dashboard" && <Dashboard />}
      {screen === "create" && <Create />}
      {screen === "case" && <CaseIntel />}
      {screen === "match" && <Match />}
      {screen === "compare" && <Compare />}
      {screen === "room" && <Room />}

      <div className="c09-statusbar">
        <span className="ok">READY</span>
        <span>{doctor.city.toUpperCase()} {doctor.localTime}</span>
        <span>LATENCY 41ms</span>
        <span>COHORTS 1,284</span>
        <span className="warn">◆ {DISCLAIMER}</span>
        <span style={{ marginLeft: "auto" }}>TIER II DATA ACCESS · AUDIT ON</span>
      </div>
    </div>
  );
}

const Pane = ({ children }: { children: React.ReactNode }) => <div className="c09-main">{children}</div>;

const Head = ({ label, title, right }: { label: string; title: string; right?: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 16 }}>
    <div>
      <div className="c09-eyebrow">{label}</div>
      <h1 className="c09-h1" style={{ marginTop: 9 }}>{title}</h1>
    </div>
    {right}
  </div>
);

const Sec = ({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) => (
  <div className="c09-panel" style={{ marginBottom: 14 }}>
    <div className="c09-panel-h"><span>{label}</span>{right}</div>
    {children}
  </div>
);

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <div className="c09-work" data-panes="3">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Case explorer</span><span>12</span></div>
        {caseQueue.map((r) => (
          <div key={r.id} className="c09-side-item" data-on={r.caseId === "ODY-001"}>
            <div>
              <div className="c09-mono" style={{ fontSize: 11.5, color: r.caseId === "ODY-001" ? "var(--accent)" : "var(--ink)" }}>{r.caseId}</div>
              <div className="c09-small" style={{ marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{r.summary}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="c09-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{r.completeness}%</div>
              <div style={{ marginTop: 5 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, background: r.status === "Match proposed" ? "var(--accent)" : r.status === "Verified" ? "var(--green)" : "var(--ink-4)" }} />
              </div>
            </div>
          </div>
        ))}
        <div className="c09-side-h" style={{ marginTop: 0 }}><span>Saved queries</span></div>
        {["Mitochondrial · unresolved", "Regression after illness", "Putaminal T2 + lactate", "Consanguineous pedigrees"].map((q) => (
          <div key={q} className="c09-side-item">
            <span className="c09-small">{q}</span>
            <span className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>⌘{q.length % 9}</span>
          </div>
        ))}
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head
            label="Workspace"
            title={`${doctor.greeting}, ${doctor.name}`}
            right={
              <div style={{ display: "flex", gap: 20 }}>
                {attention.map((a) => (
                  <div key={a.id} style={{ textAlign: "right" }}>
                    <div className="c09-num" style={{ fontSize: 22, color: a.tone === "signal" ? "var(--accent)" : a.tone === "alert" ? "var(--red)" : "var(--ink)" }}>
                      {String(a.count).padStart(2, "0")}
                    </div>
                    <div className="c09-eyebrow" style={{ marginTop: 4 }}>{a.label.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            }
          />

          <Sec label="Active alert · potential cross-border match" right={<span className="c09-tag" data-tone="accent">{match.surfaced}</span>}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)" }}>
              <div className="c09-panel-b">
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div className="c09-num" style={{ fontSize: 22 }}>{caseKZ.id}</div>
                    <div className="c09-small">{caseKZ.country}</div>
                  </div>
                  <svg width="70" height="14" viewBox="0 0 70 14" fill="none" aria-hidden>
                    <path className="ody-drawin" style={{ "--dash": 60, "--d": "400ms" } as React.CSSProperties} d="M0 7h58" stroke="var(--accent)" strokeWidth="1.1" strokeDasharray="60" />
                    <path d="M55 4l4 3-4 3" stroke="var(--accent)" strokeWidth="1.1" fill="none" />
                  </svg>
                  <div>
                    <div className="c09-num" style={{ fontSize: 22, color: "var(--accent)" }}>{caseDE.id}</div>
                    <div className="c09-small">{caseDE.country}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div className="c09-num" style={{ fontSize: 26, color: "var(--accent)" }}>{match.concordantGroups}/{match.totalGroups}</div>
                    <div className="c09-eyebrow">groups concordant</div>
                  </div>
                </div>
                <p className="c09-body" style={{ marginTop: 14 }}>
                  Imaging pattern, lactate profile, treatment response and an identical coding VUS align.
                  {" "}{match.confidenceNote}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <button className="c09-btn">Open match</button>
                  <button className="c09-btn" data-variant="ghost">Diff cases</button>
                  <button className="c09-btn" data-variant="ghost">Dismiss</button>
                </div>
              </div>
              <div style={{ borderLeft: "1px solid var(--line)", padding: 12 }}>
                <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" labelSize={1.6} />
              </div>
            </div>
          </Sec>

          <Sec label="Case queue" right={<span>12 unresolved · 6 shown</span>}>
            <table className="c09-table">
              <thead><tr><th style={{ width: 84 }}>ID</th><th>Presentation</th><th style={{ width: 76 }}>Age</th><th style={{ width: 118 }}>Status</th><th style={{ width: 118 }}>Complete</th><th style={{ width: 68 }}>Updated</th></tr></thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 40, 100)}>
                    <td className="c09-mono" style={{ color: r.caseId === "ODY-001" ? "var(--accent)" : undefined }}>{r.caseId}</td>
                    <td style={{ color: "var(--ink-2)" }}>{r.summary}</td>
                    <td className="c09-small">{r.ageGroup}</td>
                    <td><span className="c09-tag" data-tone={r.status === "Match proposed" ? "accent" : r.status === "Verified" ? "green" : undefined}>{r.status}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="c09-bar" style={{ flex: 1 }} data-cyan={r.completeness < 70}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 40, 180) }} /></div>
                        <span className="c09-mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{r.completeness}</span>
                      </div>
                    </td>
                    <td className="c09-mono c09-small">{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Sec label="Network log">
              <div className="c09-panel-b">
                {networkActivity.map((a, i) => (
                  <div key={a.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 10, padding: "6px 0", borderBottom: i < networkActivity.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 50, 200) }}>
                    <span className="c09-mono" style={{ fontSize: 9, color: a.kind === "match" ? "var(--accent)" : "var(--ink-4)" }}>{a.origin}</span>
                    <div>
                      <div style={{ fontSize: 11.5 }}>{a.title}</div>
                      <div className="c09-small" style={{ marginTop: 2 }}>{a.detail}</div>
                    </div>
                    <span className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </Sec>

            <Sec label="Matching outcomes · 90d" right={<span>n=60</span>}>
              <div className="c09-panel-b">
                {contributionMetrics.map((m, i) => (
                  <div key={m.id} style={{ marginBottom: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 5 }}>
                      <span>{m.label}</span>
                      <span className="c09-mono">{m.value}<span style={{ color: "var(--ink-4)" }}>/{m.of}</span></span>
                    </div>
                    <div className="c09-bar"><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 60, 280) }} /></div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                  <div>
                    <div className="c09-eyebrow">Queries / month</div>
                    <div className="c09-num" style={{ fontSize: 20, marginTop: 4 }}>52</div>
                  </div>
                  <div style={{ color: "var(--accent)" }}><Spark data={querySeries} w={120} h={30} area /></div>
                </div>
              </div>
            </Sec>
          </div>
        </div>
      </Pane>

      <aside className="c09-inspect">
        <div className="c09-side-h"><span>Inspector · ODY-001</span><span className="c09-tag" data-tone="amber">Unresolved</span></div>
        <div style={{ padding: 12 }}>
          <dl className="c09-kv">
            <dt>Country</dt><dd>{caseKZ.country}</dd>
            <dt>Age</dt><dd>{caseKZ.ageGroup}</dd>
            <dt>Enrolled</dt><dd className="c09-mono">{caseKZ.enrolled}</dd>
            <dt>Complete</dt><dd className="c09-mono">{caseKZ.completeness}%</dd>
            <dt>Signals</dt><dd className="c09-mono">{caseKZ.signals.length} groups</dd>
          </dl>
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Phenotype</div>
          {caseKZ.phenotypes.slice(0, 6).map((p) => (
            <div key={p.hpo} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontSize: 11.5 }}>{p.term}</span>
              <span className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>{p.hpo.replace("HP:", "")}</span>
            </div>
          ))}
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Completeness</div>
          {caseKZ.completenessBreakdown.map((b, i) => (
            <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 48px 24px", gap: 8, alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 11 }}>{b.label}</span>
              <div className="c09-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 45, 200) }} /></div>
              <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--ink-4)", textAlign: "right" }}>{b.value}</span>
            </div>
          ))}
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Network</div>
          {networkStats.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="c09-small">{s.label}</span>
              <span className="c09-mono" style={{ fontSize: 11 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ CREATE ------------------------------ */

function Create() {
  const active = intakeSteps[1];
  return (
    <div className="c09-work">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Intake sections</span><span>3/9</span></div>
        {intakeSteps.map((s, i) => (
          <div key={s.id} className="c09-step ody-fadein" data-state={s.state} style={stagger(i, 36)}>
            <span className="c09-mono" style={{ fontSize: 10, color: s.state === "active" ? "var(--accent)" : "var(--ink-4)" }}>{s.index}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: s.state === "active" ? 600 : 400 }}>{s.label}</div>
              {s.state === "active" && <div className="c09-small" style={{ marginTop: 4 }}>{s.description}</div>}
            </div>
          </div>
        ))}
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head label="Intake" title="Create case" right={<span className="c09-disclaimer">◆ {DISCLAIMER}</span>} />

          <Sec label={`${active.index} — ${active.label}`} right={<span className="c09-tag" data-tone="cyan">HPO NORMALISED</span>}>
            <div className="c09-panel-b">
              <p className="c09-small" style={{ marginBottom: 12 }}>{active.description}</p>
              {active.fields.map((f) => (
                <div key={f.label} className="c09-field">
                  <div>
                    <div className="c09-eyebrow" style={{ letterSpacing: "0.1em" }}>{f.label}</div>
                    {f.hint && <div className="c09-small" style={{ marginTop: 4 }}>{f.hint}</div>}
                  </div>
                  {f.kind === "chips" ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {f.value.split(" · ").map((v) => (
                        <span key={v} className="c09-tag" style={{ textTransform: "none", letterSpacing: "0.01em", fontFamily: "var(--font-ui)", fontSize: 11, height: 20 }}>{v}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="c09-input">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </Sec>

          <Sec label="09 — Documents · extraction output" right={<span className="c09-mono">{aiExtraction.document} · {aiExtraction.processedAt}</span>}>
            <div className="c09-panel-b" style={{ paddingBottom: 8 }}>
              <div className="c09-notice">
                <span style={{ color: "var(--accent)" }}>◆</span>
                <span><b>AI-assisted extraction.</b> {aiExtraction.notice.replace("AI-assisted extraction. ", "")}</span>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              <div className="c09-term" style={{ background: "var(--pane-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)" }}>
                <span>Proposed term / source</span><span>Confidence · action</span>
              </div>
              {aiExtraction.terms.map((t, i) => (
                <div key={t.hpo} className="c09-term ody-fadein" style={stagger(i, 50, 120)}>
                  <div>
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                      <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>{t.hpo} · {t.page}</span>
                    </div>
                    <div className="c09-quote">{t.evidence}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="c09-mono" style={{ fontSize: 11 }}>{t.confidence.toFixed(2)}</span>
                      <div className="c09-bar" style={{ flex: 1 }} data-cyan={t.confidence < 0.7}><i style={{ width: `${t.confidence * 100}%` }} /></div>
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {t.state === "confirmed" ? (
                        <span className="c09-tag" data-tone="green">✓ CONFIRMED</span>
                      ) : t.state === "rejected" ? (
                        <span className="c09-tag" data-tone="red">REJECTED</span>
                      ) : (
                        <>
                          <span className="c09-tag" data-tone="accent">CONFIRM ⏎</span>
                          <span className="c09-tag">EDIT E</span>
                          <span className="c09-tag">REJECT ⌫</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="c09-panel-b" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="c09-small">3 confirmed · 3 pending · 1 rejected — only confirmed terms are indexed</span>
              <button className="c09-btn">Verify and index</button>
            </div>
          </Sec>
        </div>
      </Pane>
    </div>
  );
}

/* ------------------------------ CASE ------------------------------ */

function CaseIntel() {
  const c = caseKZ;
  return (
    <div className="c09-work" data-panes="3">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Case explorer</span><span>12</span></div>
        {caseQueue.map((r) => (
          <div key={r.id} className="c09-side-item" data-on={r.caseId === c.id}>
            <div>
              <div className="c09-mono" style={{ fontSize: 11.5, color: r.caseId === c.id ? "var(--accent)" : "var(--ink)" }}>{r.caseId}</div>
              <div className="c09-small" style={{ marginTop: 3, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.summary}</div>
            </div>
            <span className="c09-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{r.completeness}%</span>
          </div>
        ))}
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head
            label={`Case · ${c.institution}`}
            title={c.id}
            right={
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span className="c09-tag" data-tone="amber">{c.status}</span>
                <span className="c09-tag" data-tone="accent">1 MATCH</span>
                <span className="c09-disclaimer">◆ {DISCLAIMER}</span>
              </div>
            }
          />
          <p className="c09-body" style={{ marginTop: -6, marginBottom: 16, maxWidth: "88ch" }}>{c.narrative}</p>

          <Sec label="Phenotype profile" right={<span>8 present · 1 absent</span>}>
            <table className="c09-table">
              <thead><tr><th>Term</th><th style={{ width: 94 }}>HPO</th><th style={{ width: 74 }}>Onset</th><th style={{ width: 80 }}>Severity</th><th style={{ width: 82 }}>Status</th><th style={{ width: 112 }}>Source</th></tr></thead>
              <tbody>
                {c.phenotypes.map((p, i) => (
                  <tr key={p.hpo} className="ody-fadein" style={stagger(i, 32, 80)}>
                    <td style={{ fontWeight: 500, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                    <td className="c09-mono c09-small">{p.hpo}</td>
                    <td className="c09-mono">{p.onset}</td>
                    <td className="c09-small">{p.severity}</td>
                    <td><span className="c09-tag" data-tone={p.status === "Absent" ? "red" : p.status === "Present" ? "cyan" : undefined}>{p.status}</span></td>
                    <td className="c09-small">{p.source}{!p.verified && <span style={{ color: "var(--amber)" }}> ·unv</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Sec label="Genetics">
              <div className="c09-panel-b">
                <p className="c09-small" style={{ marginTop: 0 }}>{c.geneticSummary}</p>
                {c.genetics.map((g, i) => (
                  <div key={i} style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                      <span className="c09-mono" style={{ fontSize: 11.5, color: g.gene === "—" ? "var(--ink-3)" : "var(--accent)" }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                      <span className="c09-tag" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                    </div>
                    <div className="c09-small" style={{ marginTop: 3 }}>{g.note}</div>
                  </div>
                ))}
              </div>
            </Sec>

            <Sec label="Laboratory">
              <table className="c09-table">
                <thead><tr><th>Analyte</th><th style={{ width: 62 }}>Matrix</th><th style={{ width: 70 }}>Value</th><th style={{ width: 78 }}>Ref</th></tr></thead>
                <tbody>
                  {c.labs.map((l) => (
                    <tr key={l.analyte + l.matrix}>
                      <td>{l.analyte}</td>
                      <td className="c09-small">{l.matrix}</td>
                      <td className="c09-mono" style={{ color: l.flag === "high" ? "var(--red)" : l.flag === "low" ? "var(--cyan)" : undefined }}>
                        {l.value}{l.flag === "high" ? " ↑" : l.flag === "low" ? " ↓" : ""}
                      </td>
                      <td className="c09-mono c09-small">{l.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Sec>
          </div>

          <Sec label="Clinical timeline" right={<span>{c.timeline.length} events</span>}>
            <div className="c09-panel-b">
              <div className="c09-tl">
                {c.timeline.map((t, i) => (
                  <div key={i} className="c09-tl-item ody-fadein" data-kind={t.kind} style={stagger(i, 40, 100)}>
                    <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                      <span className="c09-mono" style={{ fontSize: 10, color: "var(--ink-4)", width: 58, flex: "none" }}>{t.age}</span>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{t.label}</div>
                        <div className="c09-small" style={{ marginTop: 2 }}>{t.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Sec>
        </div>
      </Pane>

      <aside className="c09-inspect">
        <div className="c09-side-h"><span>Evidence inspector</span><span className="c09-mono">{c.completeness}%</span></div>
        <div style={{ padding: 12 }}>
          <div className="c09-eyebrow" style={{ marginBottom: 8 }}>Matching signals</div>
          {c.signals.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="c09-mono" style={{ fontSize: 9, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: 11.5 }}>{s}</span>
            </div>
          ))}
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Negative evidence</div>
          {c.negativeEvidence.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 11, color: "var(--ink-2)" }}>
              <span style={{ color: "var(--red)" }}>×</span>{n}
            </div>
          ))}
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Family</div>
          <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={280} /></div>
          <div className="c09-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Treatment response</div>
          {c.treatments.map((t) => (
            <div key={t.intervention} style={{ padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 11.5 }}>{t.intervention}</span>
                <span className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>{t.duration}</span>
              </div>
              <div className="c09-small" style={{ marginTop: 2, color: t.tone === "positive" ? "var(--green)" : t.tone === "negative" ? "var(--red)" : "var(--ink-3)" }}>{t.response}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ MATCH ------------------------------ */

function Match() {
  return (
    <div className="c09-work" data-panes="3">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Candidates</span><span>{match.candidatesReturned}</span></div>
        <div className="c09-side-item" data-on>
          <div>
            <div className="c09-mono" style={{ fontSize: 11.5, color: "var(--accent)" }}>{caseDE.id}</div>
            <div className="c09-small" style={{ marginTop: 3 }}>{caseDE.country} · Heidelberg</div>
          </div>
          <span className="c09-num" style={{ fontSize: 14, color: "var(--accent)" }}>{match.aggregate}</span>
        </div>
        {otherCandidates.map((o) => (
          <div key={o.id} className="c09-side-item">
            <div>
              <div className="c09-mono" style={{ fontSize: 11.5 }}>{o.id}</div>
              <div className="c09-small" style={{ marginTop: 3, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.country} · {o.note}</div>
            </div>
            <span className="c09-num" style={{ fontSize: 14, color: "var(--ink-3)" }}>{o.score}</span>
          </div>
        ))}
        <div className="c09-side-h"><span>Query</span></div>
        <div style={{ padding: 12 }}>
          <dl className="c09-kv">
            <dt>Cohorts</dt><dd className="c09-mono">{match.cohortsQueried.toLocaleString()}</dd>
            <dt>Countries</dt><dd className="c09-mono">{match.countriesQueried}</dd>
            <dt>Screened</dt><dd className="c09-mono">{match.candidatesScreened.toLocaleString()}</dd>
            <dt>Returned</dt><dd className="c09-mono" style={{ color: "var(--accent)" }}>{match.candidatesReturned}</dd>
          </dl>
        </div>
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head
            label={`Potential cross-border match · ${match.id}`}
            title={`${caseKZ.id} ↔ ${caseDE.id}`}
            right={
              <div style={{ textAlign: "right" }}>
                <div className="c09-num" style={{ fontSize: 34, color: "var(--accent)" }}>{match.aggregate}</div>
                <div className="c09-eyebrow">aggregate evidence similarity</div>
              </div>
            }
          />
          <div className="c09-notice" style={{ marginBottom: 16 }}>
            <span style={{ color: "var(--accent)" }}>◆</span>
            <span><b>{match.confidenceLabel}.</b> {match.confidenceNote} No conclusion is drawn by the system.</span>
          </div>

          <Sec label="Evidence groups" right={<span>{match.concordantGroups} concordant · {match.divergences} divergent</span>}>
            <div className="c09-panel-b">
              {matchEvidence.map((e, i) => (
                <div key={e.id} className="c09-ev ody-fadein" style={stagger(i, 48, 90)}>
                  <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.label}</div>
                    <span className="c09-tag" data-tone={e.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 5 }}>
                      {e.direction === "divergent" ? "DIVERGENT" : e.weight.toUpperCase()}
                    </span>
                  </div>
                  <div className="c09-num" style={{ fontSize: 17, color: e.direction === "divergent" ? "var(--amber)" : "var(--accent)" }}>{e.score}</div>
                  <div>
                    <div className="c09-body" style={{ fontSize: 12 }}>{e.summary}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 5, flexWrap: "wrap" }}>
                      <span className="c09-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>KZ {e.kzValue}</span>
                      <span className="c09-mono" style={{ fontSize: 10, color: "var(--accent)" }}>DE {e.deValue}</span>
                    </div>
                  </div>
                  <div className="c09-bar" style={{ height: 6 }}>
                    <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : undefined, ...stagger(i, 48, 180) }} />
                  </div>
                </div>
              ))}
            </div>
          </Sec>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Sec label="Query provenance">
              <div className="c09-panel-b">
                {match.reasoningSteps.map((s, i) => (
                  <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, paddingBottom: 11, ...stagger(i, 70, 180) }}>
                    <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div style={{ fontSize: 12 }}>{s.label}</div>
                      <div className="c09-small" style={{ marginTop: 2 }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Sec>
            <Sec label="Divergence log" right={<span>{match.divergenceNotes.length}</span>}>
              <div className="c09-panel-b">
                {match.divergenceNotes.map((d, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, padding: "7px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                    <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--amber)" }}>△{i + 1}</span>
                    <span style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
            </Sec>
          </div>
        </div>
      </Pane>

      <aside className="c09-inspect">
        <div className="c09-side-h"><span>Evidence profile</span></div>
        <div style={{ padding: 12, display: "grid", placeItems: "center", color: "var(--ink-4)" }}>
          <Radar values={matchEvidence.map((e) => e.score)} labels={["PHEN", "TRAJ", "GEN", "FAM", "LAB", "IMG", "NEG", "TIME"]} size={266} />
        </div>
        <div className="c09-side-h"><span>Required action</span><span className="c09-tag" data-tone="amber">PENDING</span></div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{match.reviewStatus}</div>
          <p className="c09-small" style={{ marginTop: 6 }}>{match.proposedAction}.</p>
          <ol style={{ margin: "10px 0 0", paddingLeft: 16, fontSize: 11, color: "var(--ink-2)", lineHeight: 1.65 }}>
            {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 4 }}>{n}</li>)}
          </ol>
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            <button className="c09-btn">Request collab</button>
            <button className="c09-btn" data-variant="ghost">Reject</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "CONC", partial: "PART", differ: "DIFF", "only-de": "DE ONLY", "only-kz": "KZ ONLY" };

function Compare() {
  return (
    <div className="c09-work">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Diff groups</span><span>{comparisonGroups.length}</span></div>
        {comparisonGroups.map((g, i) => (
          <div key={g.group} className="c09-side-item" data-on={i === 2}>
            <span style={{ fontSize: 11.5 }}>{g.group}</span>
            <span className="c09-mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>{g.rows.length}</span>
          </div>
        ))}
        <div className="c09-side-h"><span>Legend</span></div>
        <div style={{ padding: 12, display: "grid", gap: 8 }}>
          {[["CONC", "green", "Concordant"], ["PART", undefined, "Partial"], ["DIFF", "amber", "Differs"], ["DE ONLY", "cyan", "Single-site"]].map(([t, tone, l]) => (
            <div key={t as string} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="c09-tag" data-tone={tone as string}>{t}</span>
              <span className="c09-small">{l}</span>
            </div>
          ))}
        </div>
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head label={`Diff · ${match.id}`} title={`${caseKZ.id} ⟷ ${caseDE.id}`} right={<span className="c09-disclaimer">◆ {DISCLAIMER}</span>} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 14 }}>
            <Sec label="Phenotype overlap">
              <div className="c09-panel-b">
                <svg viewBox="0 0 160 88" style={{ width: "100%" }} aria-hidden>
                  <circle className="ody-nodein" cx="60" cy="44" r="36" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.7" />
                  <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="44" r="36" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeWidth="0.7" />
                  <text x="36" y="49" textAnchor="middle" fontSize="12" fontFamily="var(--font-data)" fill="var(--ink-2)">{phenotypeOverlap.onlyKZ}</text>
                  <text x="80" y="50" textAnchor="middle" fontSize="17" fontFamily="var(--font-data)" fill="var(--ink)">{phenotypeOverlap.shared}</text>
                  <text x="124" y="49" textAnchor="middle" fontSize="12" fontFamily="var(--font-data)" fill="var(--accent)">{phenotypeOverlap.onlyDE}</text>
                </svg>
              </div>
            </Sec>
            <Sec label="Trajectory · months">
              <div className="c09-panel-b">
                <div style={{ color: "var(--ink-4)", "--track-a": "var(--cyan)", "--track-b": "var(--accent)" } as React.CSSProperties}>
                  <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="KZ" labelB="DE" height={110} />
                </div>
              </div>
            </Sec>
            <Sec label="Family pattern">
              <div className="c09-panel-b" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ color: "var(--cyan)" }}><Pedigree consanguineous affected={[0, 2]} size={140} /></div>
                <div style={{ color: "var(--accent)" }}><Pedigree consanguineous={false} affected={[1]} size={140} /></div>
              </div>
            </Sec>
          </div>

          <div className="c09-panel">
            <div className="c09-cmp" style={{ background: "var(--pane-2)", borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", padding: "9px 12px" }}>
              <span>Signal</span><span style={{ color: "var(--cyan)" }}>{caseKZ.id} · KZ</span><span style={{ color: "var(--accent)" }}>{caseDE.id} · DE</span><span style={{ textAlign: "right" }}>Agreement</span>
            </div>
            {comparisonGroups.map((g, gi) => (
              <div key={g.group}>
                <div style={{ padding: "9px 12px 5px", borderBottom: "1px solid var(--line)", background: "var(--pane-2)" }}>
                  <span className="c09-eyebrow" style={{ color: "var(--ink-3)" }}>{g.group}</span>
                </div>
                {g.rows.map((r, i) => (
                  <div key={r.label} className="c09-cmp ody-fadein" style={stagger(i, 18, gi * 36)}>
                    <span style={{ color: "var(--ink-4)" }}>{r.label}</span>
                    <span style={{ color: "var(--ink-2)" }}>{r.kz}</span>
                    <span style={{ color: r.agreement === "only-de" ? "var(--accent)" : "var(--ink-2)" }}>{r.de}</span>
                    <span style={{ textAlign: "right" }}>
                      <span className="c09-tag" data-tone={r.agreement === "match" ? "green" : r.agreement === "differ" ? "amber" : r.agreement.startsWith("only") ? "cyan" : undefined}>{LABEL[r.agreement]}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center", marginTop: 14 }}>
            <div className="c09-notice" style={{ maxWidth: "70ch" }}>
              <span style={{ color: "var(--accent)" }}>◆</span>
              <span><b>Requires clinician review.</b> A diff describes similarity between recorded evidence; it does not establish a diagnosis for either patient.</span>
            </div>
            <button className="c09-btn">Open consult</button>
          </div>
        </div>
      </Pane>
    </div>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <div className="c09-work" data-panes="3">
      <aside className="c09-side">
        <div className="c09-side-h"><span>Participants</span><span>2</span></div>
        {collaboration.participants.map((p, i) => (
          <div key={p.networkId} className="c09-side-item" data-on={i === 0}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
              <div className="c09-small" style={{ marginTop: 3 }}>{p.city}, {p.country}</div>
            </div>
            <span className="c09-tag" data-tone={i === 0 ? "green" : "amber"}>{i === 0 ? "VERIF" : "PEND"}</span>
          </div>
        ))}
        <div className="c09-side-h"><span>Shared evidence</span><span>{collaboration.documents.length}</span></div>
        {collaboration.documents.map((d) => (
          <div key={d.label} className="c09-side-item">
            <div>
              <div className="c09-mono" style={{ fontSize: 10.5, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label}</div>
              <div className="c09-small" style={{ marginTop: 2 }}>{d.kind}</div>
            </div>
          </div>
        ))}
      </aside>

      <Pane>
        <div className="c09-pad">
          <Head
            label={`Consult · ${collaboration.roomId}`}
            title={collaboration.title}
            right={<span className="c09-tag" data-tone="green">◈ E2E ENCRYPTED</span>}
          />

          <Sec label="Stage" right={<span>{s.stage}</span>}>
            <div className="c09-panel-b">
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                {s.stages.map((st, i) => (
                  <React.Fragment key={st}>
                    <div className="ody-fadein" style={{ display: "flex", alignItems: "center", gap: 8, ...stagger(i, 80) }}>
                      <span style={{ width: 8, height: 8, background: i < s.stageIndex ? "var(--green)" : i === s.stageIndex ? "var(--accent)" : "var(--line-2)" }} />
                      <span style={{ fontSize: 11.5, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)" }}>{st}</span>
                    </div>
                    {i < s.stages.length - 1 && <span style={{ flex: 1, minWidth: 16, height: 1, background: i < s.stageIndex ? "var(--accent-dim)" : "var(--line)", margin: "0 12px" }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Sec>

          <Sec label="Clinical discussion" right={<span>{collaboration.messages.length} entries · immutable</span>}>
            <div className="c09-panel-b">
              {collaboration.messages.map((m, i) => (
                <div key={m.id} className="c09-msg ody-fadein" data-side={m.author} style={stagger(i, 55, 80)}>
                  {m.author !== "system" ? (
                    <div>
                      <div className="c09-mono" style={{ fontSize: 9, color: m.author === "B" ? "var(--accent)" : "var(--cyan)", letterSpacing: "0.1em" }}>
                        CLINICIAN {m.author}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{m.name}</div>
                      <div className="c09-small" style={{ marginTop: 2 }}>{m.time} ago</div>
                    </div>
                  ) : (
                    <div className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.12em" }}>SYSTEM · {m.time} AGO</div>
                  )}
                  <div>
                    {m.kind === "proposal" && <span className="c09-tag" data-tone="accent" style={{ marginBottom: 6 }}>PROPOSAL</span>}
                    <p style={{ fontSize: 12.5, lineHeight: 1.68, margin: 0, color: m.author === "system" ? "var(--ink-3)" : "var(--ink-2)" }}>{m.body}</p>
                    {m.attachment && (
                      <div style={{ marginTop: 9, border: "1px solid var(--line-2)", background: "var(--pane-2)", padding: "7px 10px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <span className="c09-mono" style={{ fontSize: 11 }}>{m.attachment.label}</span>
                        <span className="c09-small">{m.attachment.meta}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <div className="c09-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…  <span className="c09-kbd" style={{ marginLeft: 8 }}>⌘⏎</span></div>
                <button className="c09-btn">Send</button>
              </div>
            </div>
          </Sec>
        </div>
      </Pane>

      <aside className="c09-inspect">
        <div className="c09-side-h"><span>Verification</span><span className="c09-tag" data-tone="amber">1 / 2</span></div>
        <div style={{ padding: 12 }}>
          <div style={{ display: "flex", gap: 10, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
            <span style={{ color: "var(--green)" }}>■</span>
            <div><div style={{ fontSize: 12 }}>{s.verificationA}</div><div className="c09-small" style={{ marginTop: 2 }}>Evidence supports a clinically meaningful similarity</div></div>
          </div>
          <div style={{ display: "flex", gap: 10, paddingTop: 10 }}>
            <span style={{ color: "var(--amber)" }}>□</span>
            <div><div style={{ fontSize: 12 }}>{s.verificationB}</div><div className="c09-small" style={{ marginTop: 2 }}>Awaiting second clinician</div></div>
          </div>
          <p className="c09-small" style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
            Two independent clinician verifications are required before a connection enters the network record.
          </p>
        </div>

        <div className="c09-side-h"><span>Decision log</span><span>immutable</span></div>
        <div style={{ padding: 12 }}>
          {collaboration.decisionLog.map((d) => (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "14px 1fr 38px", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ color: d.state === "done" ? "var(--green)" : d.state === "pending" ? "var(--amber)" : "var(--ink-4)", fontSize: 10 }}>{d.state === "done" ? "■" : "□"}</span>
              <div>
                <div style={{ fontSize: 11.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</div>
                <div className="c09-small" style={{ marginTop: 2 }}>{d.actor}</div>
              </div>
              <span className="c09-mono" style={{ fontSize: 9, color: "var(--ink-4)", textAlign: "right" }}>{d.time}</span>
            </div>
          ))}
        </div>

        <div className="c09-side-h"><span>Governance</span></div>
        <div style={{ padding: 12 }}>
          <p className="c09-small">{collaboration.security}</p>
        </div>
      </aside>
    </div>
  );
}
