"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { NodeField, Radar, Ring, Spark, WorldMap, TrajectoryChart, Pedigree, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

const NAV: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Atlas" },
  { id: "create", label: "Submit case" },
  { id: "case", label: "Case" },
  { id: "match", label: "Matches" },
  { id: "compare", label: "Evidence" },
  { id: "room", label: "Collaboration" },
];

export default function MolecularAtlas({ screen }: { screen: ScreenId }) {
  return (
    <div className="c02 ody-surface">
      <nav className="c02-nav">
        <div className="c02-mark">
          <svg className="c02-mark-sig" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="6" r="2.2" fill="var(--accent)" />
            <circle cx="5" cy="16" r="2.2" fill="var(--accent)" opacity="0.55" />
            <circle cx="19" cy="16" r="2.2" fill="var(--accent)" opacity="0.55" />
            <circle cx="12" cy="13" r="1.4" fill="var(--ink-3)" />
            <path d="M12 6L5 16M12 6l7 10M12 6v7M5 16h14" stroke="var(--accent-dim)" strokeWidth="0.8" />
          </svg>
          <span className="c02-wordmark">ODYSSEY</span>
        </div>
        <div className="c02-navlinks">
          {NAV.map((n) => (
            <span key={n.id} className="c02-navlink" data-on={n.id === screen}>{n.label}</span>
          ))}
        </div>
        <div className="c02-navright">
          <span>412 INSTITUTIONS · 58 COUNTRIES</span>
          <span style={{ color: "var(--accent)" }}>● FEDERATED INDEX LIVE</span>
          <span>{doctor.initials} · {doctor.countryCode}</span>
        </div>
      </nav>

      <div className="c02-page">
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

const Disclaimer = () => <span className="c02-disclaimer">◆ {DISCLAIMER}</span>;

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c02-sechead">
    <div>
      <div className="c02-eyebrow">{label}</div>
      {note && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 8 }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ---------------- signature visual: bipartite evidence graph ---------------- */

function EvidenceGraph({ compact = false }: { compact?: boolean }) {
  const H = compact ? 260 : 330;
  const rows = matchEvidence;
  const midY = H / 2;
  return (
    <svg viewBox={`0 0 600 ${H}`} style={{ width: "100%", height: "auto", maxWidth: 1000, margin: "0 auto", display: "block" }} aria-hidden>
      <defs>
        <radialGradient id="c02core" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(63,208,224,0.55)" />
          <stop offset="100%" stopColor="rgba(63,208,224,0)" />
        </radialGradient>
      </defs>
      {rows.map((e, i) => {
        const y = 26 + (i * (H - 52)) / (rows.length - 1);
        const div = e.direction === "divergent";
        const d = `M112,${midY} C210,${midY} 230,${y} 300,${y} C370,${y} 390,${midY} 488,${midY}`;
        return (
          <g key={e.id}>
            <path
              className="ody-drawin"
              d={d}
              fill="none"
              stroke={div ? "var(--amber)" : "var(--accent)"}
              strokeOpacity={div ? 0.5 : 0.18 + (e.score / 100) * 0.42}
              strokeWidth={div ? 1 : 0.6 + (e.score / 100) * 1.8}
              style={{ "--dash": 620, "--d": `${300 + i * 110}ms` } as React.CSSProperties}
            />
            <circle
              className="ody-nodein"
              cx={300}
              cy={y}
              r={2.6}
              fill={div ? "var(--amber)" : "var(--accent)"}
              style={{ "--d": `${900 + i * 110}ms` } as React.CSSProperties}
            />
            <text x={310} y={y - 3} fontSize="10.5" fill="var(--ink-2)" fontFamily="var(--font-ui)" stroke="var(--bg)" strokeWidth="3.4" paintOrder="stroke">{e.label}</text>
            <text x={310} y={y + 9} fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-data)" letterSpacing="0.08em" stroke="var(--bg)" strokeWidth="3" paintOrder="stroke">
              {div ? "DIVERGENT" : `SIMILARITY ${e.score}`}
            </text>
            <text x={292} y={y + 3} fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-data)" textAnchor="end">
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      {[{ x: 112, id: caseKZ.id, c: caseKZ.country }, { x: 488, id: caseDE.id, c: caseDE.country }].map((n, i) => (
        <g key={n.id}>
          <circle cx={n.x} cy={midY} r={46} fill="url(#c02core)" className="ody-fadein" style={{ "--d": `${i * 200}ms` } as React.CSSProperties} />
          <circle cx={n.x} cy={midY} r={24} fill="var(--bg)" stroke="var(--accent)" strokeWidth="1" />
          <text x={n.x} y={midY + 1} textAnchor="middle" fontSize="10" fill="var(--accent)" fontFamily="var(--font-data)">{n.id.replace("ODY-", "")}</text>
          <text x={n.x} y={midY + 42} textAnchor="middle" fontSize="10.5" fill="var(--ink-2)" fontFamily="var(--font-ui)">{n.c}</text>
          <text x={n.x} y={midY - 34} textAnchor="middle" fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-data)" letterSpacing="0.14em">{n.id}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------- phenotype constellation for one case ---------------- */

function PhenotypeGraph() {
  const terms = caseKZ.phenotypes.filter((p) => p.status !== "Absent");
  const R = 96;
  return (
    <svg viewBox="0 0 320 250" style={{ width: "100%" }} aria-hidden>
      <circle cx={160} cy={125} r={R + 26} fill="none" stroke="var(--line)" strokeWidth="0.6" />
      <circle cx={160} cy={125} r={R - 34} fill="none" stroke="var(--line)" strokeWidth="0.6" />
      {terms.map((t, i) => {
        const a = (i / terms.length) * Math.PI * 2 - Math.PI / 2;
        const r = t.verified ? R : R - 30;
        const x = 160 + Math.cos(a) * r;
        const y = 125 + Math.sin(a) * r;
        const anchor = Math.abs(Math.cos(a)) < 0.25 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
        return (
          <g key={t.hpo}>
            <line x1={160} y1={125} x2={x} y2={y} stroke="var(--accent)" strokeOpacity={t.verified ? 0.3 : 0.12} strokeWidth="0.7" className="ody-drawin" style={{ "--dash": 120, "--d": `${200 + i * 90}ms` } as React.CSSProperties} />
            <circle className="ody-nodein" cx={x} cy={y} r={t.severity === "Severe" ? 4.6 : 3.2} fill={t.verified ? "var(--accent)" : "var(--bg)"} stroke="var(--accent)" strokeWidth="0.8" style={{ "--d": `${600 + i * 90}ms` } as React.CSSProperties} />
            <text x={x + (anchor === "end" ? -8 : anchor === "start" ? 8 : 0)} y={y + (anchor === "middle" ? (Math.sin(a) > 0 ? 14 : -9) : 3)} textAnchor={anchor} fontSize="8.4" fill="var(--ink-2)" fontFamily="var(--font-ui)">
              {t.term.length > 24 ? t.term.slice(0, 22) + "…" : t.term}
            </text>
          </g>
        );
      })}
      <circle cx={160} cy={125} r={19} fill="var(--bg)" stroke="var(--accent)" />
      <text x={160} y={122} textAnchor="middle" fontSize="8.5" fill="var(--accent)" fontFamily="var(--font-data)">ODY</text>
      <text x={160} y={132} textAnchor="middle" fontSize="8.5" fill="var(--accent)" fontFamily="var(--font-data)">001</text>
    </svg>
  );
}

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <section className="c02-hero ody-fadein">
        <NodeField seed={19} count={44} className="c02-hero-field" />
        <div className="c02-hero-inner">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div className="c02-eyebrow">{PRODUCT.tagline}</div>
            <Disclaimer />
          </div>
          <h1 className="c02-h1" style={{ marginTop: 20 }}>
            {doctor.greeting}, {doctor.name}
          </h1>
          <p className="c02-lede" style={{ marginTop: 16 }}>
            Twelve of your cases remain molecularly unresolved. Overnight, the federated index returned four candidate
            relationships — one of them crosses a border.
          </p>
          <div style={{ display: "flex", gap: 42, marginTop: 32, flexWrap: "wrap" }}>
            {attention.map((a, i) => (
              <div key={a.id} className="ody-rise" style={stagger(i, 90, 200)}>
                <div className={`c02-num ${a.tone === "signal" ? "c02-glow" : ""}`} style={{ fontSize: 40, color: a.tone === "signal" ? "var(--accent)" : a.tone === "alert" ? "var(--rose)" : a.tone === "positive" ? "var(--green)" : "var(--ink)" }}>
                  {String(a.count).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 13, marginTop: 8 }}>{a.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="c02-sec">
        <SecHead label="Potential cross-border match · surfaced 14 minutes ago" note="Seven independent evidence groups connect a case in Astana with a case in Heidelberg." right={<button className="c02-btn">Review evidence</button>} />
        <div className="c02-panel" data-accent="true" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)" }}>
          <div style={{ padding: "22px 24px" }}>
            <EvidenceGraph compact />
          </div>
          <div style={{ borderLeft: "1px solid var(--line)", padding: "22px 24px", display: "flex", flexDirection: "column" }}>
            <div className="c02-eyebrow">Federated query</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 16 }}>
              {[["Cohorts queried", match.cohortsQueried.toLocaleString()], ["Countries", String(match.countriesQueried)], ["Records screened", match.candidatesScreened.toLocaleString()], ["Candidates returned", String(match.candidatesReturned)]].map(([l, v], i) => (
                <div key={l} className="ody-fadein" style={stagger(i, 80, 300)}>
                  <div className="c02-num" style={{ fontSize: 20, color: i === 3 ? "var(--accent)" : "var(--ink)" }}>{v}</div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 5, letterSpacing: "0.06em" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, marginTop: 22, minHeight: 130 }}>
              <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full h-full" />
            </div>
            <p style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.7, marginTop: 14 }}>
              No identifiable data left either institution. Only structured signals were compared.
            </p>
          </div>
        </div>
      </section>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 26, alignItems: "start" }}>
        <div>
          <SecHead label="Unresolved case queue" note="12 cases · ordered by clinical urgency" />
          <div className="c02-panel">
            <table className="c02-table">
              <thead><tr><th style={{ width: 96 }}>Case</th><th>Presentation</th><th style={{ width: 120 }}>Status</th><th style={{ width: 130 }}>Signal completeness</th></tr></thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 50, 160)}>
                    <td className="c02-mono" style={{ color: r.caseId === "ODY-001" ? "var(--accent)" : "var(--ink)" }}>{r.caseId}</td>
                    <td style={{ color: "var(--ink-2)" }}>
                      {r.summary}
                      <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>{r.ageGroup} · {r.signals} signal groups · {r.updated}</div>
                    </td>
                    <td><span className="c02-chip" data-tone={r.status === "Match proposed" ? "accent" : r.status === "Verified" ? "green" : undefined}>{r.status}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="c02-bar" style={{ flex: 1 }}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 50, 260) }} /></div>
                        <span className="c02-mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.completeness}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SecHead label="Network activity" />
          <div className="c02-panel c02-panel-b">
            {networkActivity.map((a, i) => (
              <div key={a.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", gap: 14, padding: "12px 0", borderBottom: i < networkActivity.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 60, 220) }}>
                <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: 99, background: a.kind === "match" ? "var(--accent)" : a.kind === "verification" ? "var(--amber)" : "var(--ink-4)", boxShadow: a.kind === "match" ? "0 0 10px var(--accent)" : undefined }} />
                <div>
                  <div style={{ fontSize: 13 }}>{a.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 3 }}>{a.detail}</div>
                  <div className="c02-mono" style={{ fontSize: 9.5, color: "var(--accent-dim)", marginTop: 5, letterSpacing: "0.12em" }}>{a.origin.toUpperCase()}</div>
                </div>
                <span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{a.time}</span>
              </div>
            ))}
          </div>

          <div className="c02-panel" style={{ marginTop: 20 }}>
            <div className="c02-panel-h"><h2 className="c02-h2">Matching outcomes</h2><span className="c02-eyebrow">90 days</span></div>
            <div className="c02-panel-b">
              {contributionMetrics.map((m, i) => (
                <div key={m.id} style={{ marginBottom: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7, color: "var(--ink-2)" }}>
                    <span>{m.label}</span>
                    <span className="c02-mono">{m.value}<span style={{ color: "var(--ink-4)" }}> / {m.of}</span></span>
                  </div>
                  <div className="c02-bar"><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 320) }} /></div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div className="c02-eyebrow">Queries / month</div>
                  <div className="c02-num" style={{ fontSize: 24, marginTop: 6 }}>52</div>
                </div>
                <div style={{ color: "var(--accent)" }}><Spark data={querySeries} w={140} h={36} area /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c02-sec">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {networkStats.map((s) => (
            <div key={s.id} style={{ background: "var(--panel)", padding: "20px 22px" }}>
              <div className="c02-num" style={{ fontSize: 26 }}>{s.value}</div>
              <div style={{ fontSize: 12.5, marginTop: 9, color: "var(--ink-2)" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 5 }}>{s.delta}</div>
            </div>
          ))}
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
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }} className="ody-rise">
        <div>
          <div className="c02-eyebrow">Structured intake</div>
          <h1 className="c02-h1" style={{ marginTop: 16 }}>Submit case to the index</h1>
          <p className="c02-lede" style={{ marginTop: 14 }}>
            A case becomes matchable only once it is structured. Free text cannot be compared across languages, systems
            or borders — signals can.
          </p>
        </div>
        <Disclaimer />
      </div>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <aside className="c02-panel">
          <div className="c02-panel-h"><h2 className="c02-h2">Sections</h2><span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>3 / 9</span></div>
          {intakeSteps.map((s, i) => (
            <div key={s.id} className="c02-step ody-fadein" data-state={s.state} style={stagger(i, 45)}>
              <span className="c02-mono" style={{ fontSize: 10.5, color: s.state === "active" ? "var(--accent)" : "var(--ink-4)" }}>{s.index}</span>
              <div>
                <div style={{ fontSize: 13 }}>{s.label}</div>
                {s.state === "active" && <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 5, lineHeight: 1.6 }}>{s.description}</div>}
              </div>
            </div>
          ))}
        </aside>

        <div>
          <div className="c02-panel">
            <div className="c02-panel-h">
              <h2 className="c02-h2">{active.index} — {active.label}</h2>
              <span className="c02-chip" data-tone="accent">HPO normalised</span>
            </div>
            <div className="c02-panel-b">
              {active.fields.map((f) => (
                <div key={f.label} className="c02-field">
                  <div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{f.label}</div>
                    {f.hint && <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 5, lineHeight: 1.55 }}>{f.hint}</div>}
                  </div>
                  {f.kind === "chips" ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {f.value.split(" · ").map((v) => (
                        <span key={v} className="c02-chip" style={{ textTransform: "none", letterSpacing: "0.01em", fontFamily: "var(--font-ui)", fontSize: 11.5 }}>{v}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="c02-input">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="c02-sec">
            <SecHead label="09 — Documents · AI-assisted extraction" note="The document is parsed at your institution. Nothing enters the index until you confirm it." />
            <div className="c02-panel">
              <div className="c02-panel-h">
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div className="c02-node-badge">PDF</div>
                  <div>
                    <div className="c02-mono" style={{ fontSize: 13 }}>{aiExtraction.document}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 3 }}>{aiExtraction.pages} pages · {aiExtraction.processedAt}</div>
                  </div>
                </div>
                <button className="c02-btn" data-variant="ghost">Upload medical report</button>
              </div>
              <div className="c02-panel-b">
                <div className="c02-notice">
                  <span>◆</span>
                  <span><b>AI-assisted extraction, not diagnosis.</b> The assistant proposes phenotype terms with the sentence each was drawn from. A clinician confirms, edits or rejects every term.</span>
                </div>

                <div style={{ marginTop: 20 }}>
                  {aiExtraction.terms.map((t, i) => (
                    <div key={t.hpo} className="c02-term ody-fadein" style={stagger(i, 60, 150)}>
                      <div>
                        <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, color: t.state === "rejected" ? "var(--ink-4)" : "var(--ink)", textDecoration: t.state === "rejected" ? "line-through" : undefined }}>{t.term}</span>
                          <span className="c02-mono" style={{ fontSize: 10.5, color: "var(--accent-dim)" }}>{t.hpo}</span>
                          <span className="c02-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{t.page}</span>
                        </div>
                        <div className="c02-quote">{t.evidence}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 11, alignItems: "flex-end" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{Math.round(t.confidence * 100)}%</span>
                          <div style={{ width: 54, height: 2, background: "var(--line-2)" }}>
                            <div style={{ width: `${t.confidence * 100}%`, height: "100%", background: t.confidence > 0.8 ? "var(--accent)" : "var(--amber)" }} />
                          </div>
                        </div>
                        {t.state === "confirmed" ? (
                          <span className="c02-chip" data-tone="green">✓ Confirmed</span>
                        ) : t.state === "rejected" ? (
                          <span className="c02-chip" data-tone="rose">Rejected</span>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <span className="c02-chip" data-tone="accent">Confirm</span>
                            <span className="c02-chip">Edit</span>
                            <span className="c02-chip">Reject</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>3 confirmed · 3 awaiting review · 1 rejected</span>
                  <button className="c02-btn">Verify and index case</button>
                </div>
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
      <div className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "68ch" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div className="c02-eyebrow">Case intelligence</div>
            <span className="c02-chip" data-tone="amber">{c.status}</span>
            <span className="c02-chip" data-tone="accent">1 potential match</span>
          </div>
          <h1 className="c02-h1" style={{ marginTop: 18 }}>{c.id}</h1>
          <p className="c02-lede" style={{ marginTop: 14 }}>{c.headline}</p>
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "flex-start" }}>
          <dl className="c02-kv">
            <dt>Country</dt><dd>{c.country}</dd>
            <dt>Age group</dt><dd>{c.ageGroup}</dd>
            <dt>Genetic</dt><dd>Unresolved</dd>
            <dt>Enrolled</dt><dd className="c02-mono">{c.enrolled}</dd>
          </dl>
          <div style={{ textAlign: "center", color: "var(--accent)" }}>
            <Ring value={c.completeness} size={78} thickness={2} delay={300}>
              <span className="c02-num" style={{ fontSize: 19, color: "var(--ink)" }}>{c.completeness}</span>
            </Ring>
            <div className="c02-eyebrow" style={{ marginTop: 8 }}>Complete</div>
          </div>
        </div>
      </div>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)", gap: 26, alignItems: "start" }}>
        <div className="c02-panel">
          <div className="c02-panel-h"><h2 className="c02-h2">Phenotype profile</h2><span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>8 PRESENT · 1 ABSENT</span></div>
          <div className="c02-panel-b">
            <PhenotypeGraph />
            <p style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.7, marginTop: 4 }}>
              Outer ring: clinician-verified terms. Inner ring: proposed by extraction, not yet verified. Node size
              reflects recorded severity.
            </p>
          </div>
        </div>

        <div className="c02-panel">
          <div className="c02-panel-h"><h2 className="c02-h2">Signals</h2><span className="c02-chip" data-tone="accent">{c.signals.length} groups</span></div>
          <table className="c02-table">
            <thead><tr><th>Term</th><th style={{ width: 96 }}>HPO</th><th style={{ width: 80 }}>Onset</th><th style={{ width: 90 }}>Severity</th><th style={{ width: 94 }}>Status</th></tr></thead>
            <tbody>
              {c.phenotypes.map((p, i) => (
                <tr key={p.hpo} className="ody-fadein" style={stagger(i, 40, 100)}>
                  <td style={{ color: p.status === "Absent" ? "var(--ink-4)" : "var(--ink)" }}>
                    {p.term}
                    {!p.verified && <span style={{ color: "var(--amber)", fontSize: 11 }}> · unverified</span>}
                  </td>
                  <td className="c02-mono" style={{ fontSize: 11, color: "var(--ink-4)" }}>{p.hpo}</td>
                  <td className="c02-mono" style={{ fontSize: 11.5 }}>{p.onset}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-2)" }}>{p.severity}</td>
                  <td><span className="c02-chip" data-tone={p.status === "Absent" ? "rose" : p.status === "Resolved" ? undefined : "accent"}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 26, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical timeline" note={c.narrative} />
          <div className="c02-tl">
            {c.timeline.map((t, i) => (
              <div key={i} className="c02-tl-item ody-rise" data-kind={t.kind} style={stagger(i, 55, 120)}>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="c02-mono" style={{ fontSize: 11, color: "var(--accent-dim)", width: 62, flex: "none", letterSpacing: "0.06em" }}>{t.age}</span>
                  <div>
                    <div style={{ fontSize: 13.5 }}>{t.label}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 4 }}>{t.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Genetic information</h2></div>
            <div className="c02-panel-b">
              <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.7, marginTop: 0 }}>{c.geneticSummary}</p>
              {c.genetics.map((g, i) => (
                <div key={i} style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span className="c02-mono" style={{ fontSize: 12.5, color: g.gene === "—" ? "var(--ink-3)" : "var(--accent)" }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                    <span className="c02-chip" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 5 }}>{g.zygosity !== "—" && `${g.zygosity} · ${g.inheritance} · `}{g.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Case completeness</h2><span className="c02-num">{c.completeness}%</span></div>
            <div className="c02-panel-b">
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 64px 30px", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{b.label}</span>
                  <div className="c02-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 200) }} /></div>
                  <span className="c02-mono" style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Potential matching signals</h2></div>
            <div className="c02-panel-b">
              {c.signals.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "9px 0", borderBottom: i < c.signals.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span className="c02-mono" style={{ fontSize: 10, color: "var(--accent-dim)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Negative evidence</h2><span className="c02-eyebrow">Narrows the field</span></div>
            <div className="c02-panel-b">
              {c.negativeEvidence.map((n, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "var(--ink-3)", padding: "6px 0", display: "flex", gap: 10 }}>
                  <span style={{ color: "var(--rose)" }}>×</span>{n}
                </div>
              ))}
            </div>
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
      <div className="ody-rise" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="c02-eyebrow">Potential cross-border match · {match.id}</div>
          <h1 className="c02-h1" style={{ marginTop: 16 }}>
            {caseKZ.id} <span style={{ color: "var(--accent-dim)" }}>↔</span> <span className="c02-glow">{caseDE.id}</span>
          </h1>
          <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
            <span className="c02-chip" data-tone="accent" style={{ height: 27 }}>{match.confidenceLabel}</span>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{match.confidenceNote}</span>
          </div>
        </div>
        <Disclaimer />
      </div>

      <section className="c02-sec">
        <div className="c02-panel" data-accent="true" style={{ padding: "18px 22px 8px" }}>
          <EvidenceGraph />
        </div>
      </section>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 26, alignItems: "start" }}>
        <div>
          <SecHead label="Evidence supporting similarity" note="Each group is assessed independently. A similarity score describes recorded evidence, not the probability of a diagnosis." />
          <div className="c02-panel c02-panel-b">
            {matchEvidence.map((e, i) => (
              <div key={e.id} className="c02-ev-row ody-fadein" style={stagger(i, 60, 100)}>
                <div>
                  <div style={{ fontSize: 13.5 }}>{e.label}</div>
                  <span className="c02-chip" data-tone={e.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 8, height: 20 }}>{e.weight}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.65 }}>{e.summary}</div>
                  <div style={{ display: "flex", gap: 20, marginTop: 9, flexWrap: "wrap" }}>
                    <span className="c02-mono" style={{ fontSize: 11, color: "var(--ink-4)" }}>KZ {e.kzValue}</span>
                    <span className="c02-mono" style={{ fontSize: 11, color: "var(--accent)" }}>DE {e.deValue}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="c02-num" style={{ fontSize: 22, color: e.direction === "divergent" ? "var(--amber)" : "var(--accent)" }}>{e.score}</div>
                  <div className="c02-bar" style={{ marginTop: 8 }}>
                    <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : "var(--accent)", boxShadow: "none", ...stagger(i, 60, 200) }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="c02-sec">
            <SecHead label="Where the cases diverge" note="Divergence is recorded, not hidden." />
            <div className="c02-panel c02-panel-b">
              {match.divergenceNotes.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                  <span style={{ color: "var(--amber)" }}>△</span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div className="c02-panel c02-panel-b">
            <div className="c02-eyebrow">Evidence profile</div>
            <div style={{ display: "grid", placeItems: "center", marginTop: 12, color: "var(--ink-3)" }}>
              <Radar
                values={matchEvidence.map((e) => e.score)}
                labels={["PHEN", "TRAJ", "GEN", "FAM", "LAB", "IMG", "NEG", "TIME"]}
                size={272}
              />
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">How this was found</h2></div>
            <div className="c02-panel-b">
              {match.reasoningSteps.map((s, i) => (
                <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, paddingBottom: 16, ...stagger(i, 80, 200) }}>
                  <span className="c02-mono" style={{ fontSize: 10, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 13 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4, lineHeight: 1.6 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="c02-panel" data-accent="true">
            <div className="c02-panel-b">
              <div className="c02-eyebrow">Requires clinician review</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, marginTop: 10 }}>{match.proposedAction}.</p>
              <ol style={{ margin: "14px 0 0", paddingLeft: 18, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.75 }}>
                {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 6 }}>{n}</li>)}
              </ol>
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <button className="c02-btn">Request collaboration</button>
                <button className="c02-btn" data-variant="ghost">Not a match</button>
              </div>
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Other candidates</h2><span className="c02-eyebrow">Same query</span></div>
            <div className="c02-panel-b">
              {otherCandidates.map((o, i) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div className="c02-mono" style={{ fontSize: 12.5 }}>{o.id} · {o.country}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 3 }}>{o.note}</div>
                  </div>
                  <span className="c02-num" style={{ fontSize: 16, color: "var(--ink-3)" }}>{o.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const TONE: Record<string, string | undefined> = { match: "green", partial: undefined, differ: "amber", "only-de": "accent", "only-kz": "accent" };
const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <div className="ody-rise" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 22, alignItems: "flex-end" }}>
        <div>
          <div className="c02-eyebrow">Evidence comparison · {match.id}</div>
          <h1 className="c02-h1" style={{ marginTop: 16 }}>Kazakhstan / Germany</h1>
        </div>
        <Disclaimer />
      </div>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20 }}>
        <div className="c02-panel c02-panel-b ody-rise">
          <div className="c02-eyebrow">Phenotype overlap</div>
          <svg viewBox="0 0 160 92" style={{ width: "100%", marginTop: 14 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.8" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--accent)" fillOpacity="0.09" stroke="var(--accent)" strokeWidth="0.8" />
            <text x="35" y="51" textAnchor="middle" fontSize="13" fill="var(--ink-2)" fontFamily="var(--font-data)">{phenotypeOverlap.onlyKZ}</text>
            <text x="80" y="51" textAnchor="middle" fontSize="18" fill="var(--accent)" fontFamily="var(--font-data)">{phenotypeOverlap.shared}</text>
            <text x="125" y="51" textAnchor="middle" fontSize="13" fill="var(--ink-2)" fontFamily="var(--font-data)">{phenotypeOverlap.onlyDE}</text>
          </svg>
          <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.7, marginTop: 10 }}>
            {phenotypeOverlap.shared} shared HPO terms. Individually common; rare in combination.
          </p>
        </div>

        <div className="c02-panel c02-panel-b ody-rise" style={stagger(1, 110)}>
          <div className="c02-eyebrow">Clinical trajectory · months</div>
          <div style={{ marginTop: 14, color: "var(--ink-3)", "--track-a": "var(--ink)", "--track-b": "var(--accent)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={122} rowLabels />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>● ODY-001</span>
            <span style={{ fontSize: 11, color: "var(--accent)" }}>● ODY-742</span>
          </div>
        </div>

        <div className="c02-panel c02-panel-b ody-rise" style={stagger(2, 110)}>
          <div className="c02-eyebrow">Family pattern</div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink-3)" }}><Pedigree consanguineous affected={[0, 2]} size={150} /></div>
            <div style={{ color: "var(--accent)" }}><Pedigree consanguineous={false} affected={[1]} size={150} /></div>
          </div>
        </div>
      </section>

      <section className="c02-sec">
        <div className="c02-panel">
          <div className="c02-cmp" style={{ borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-data)", fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-4)", padding: "14px 18px" }}>
            <span>Signal</span><span style={{ color: "var(--ink-2)" }}>ODY-001 · KZ</span><span style={{ color: "var(--accent)" }}>ODY-742 · DE</span><span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "14px 18px 9px", background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>
                <span className="c02-eyebrow" style={{ color: "var(--ink-3)" }}>{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c02-cmp ody-fadein" style={stagger(i, 24, gi * 50)}>
                  <span style={{ color: "var(--ink-4)" }}>{r.label}</span>
                  <span style={{ color: "var(--ink-2)" }}>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--accent)" : "var(--ink-2)" }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}><span className="c02-chip" data-tone={TONE[r.agreement]} style={{ height: 19, fontSize: 9 }}>{LABEL[r.agreement]}</span></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="c02-sec" style={{ display: "flex", gap: 20, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <div className="c02-notice" style={{ maxWidth: "70ch" }}>
          <span>◆</span>
          <span><b>Requires clinician review.</b> This comparison describes similarity between two recorded cases. It does not establish a diagnosis for either patient.</span>
        </div>
        <button className="c02-btn">Open collaboration room</button>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <div className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div className="c02-eyebrow">Secure collaboration · {collaboration.roomId}</div>
          <h1 className="c02-h1" style={{ marginTop: 16 }}>{collaboration.title}</h1>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <span className="c02-chip" data-tone="green">◈ End-to-end encrypted</span>
            <span className="c02-chip">Opened {collaboration.opened}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {collaboration.participants.map((p, i) => (
            <div key={p.networkId} className="c02-panel" style={{ padding: "14px 18px", minWidth: 220, borderColor: i === 1 ? "var(--accent-dim)" : undefined }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="c02-node-badge" style={{ width: 36, height: 36, fontSize: 10 }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-4)" }}>{p.city}, {p.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="c02-sec">
        <div className="c02-panel c02-panel-b">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, alignItems: "center" }}>
            {s.stages.map((st, i) => (
              <React.Fragment key={st}>
                <div className="ody-fadein" style={{ display: "flex", alignItems: "center", gap: 10, ...stagger(i, 90) }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: i < s.stageIndex ? "var(--green)" : i === s.stageIndex ? "var(--accent)" : "var(--line-2)", boxShadow: i === s.stageIndex ? "0 0 14px var(--accent)" : undefined }} />
                  <span style={{ fontSize: 12.5, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)" }}>{st}</span>
                </div>
                {i < s.stages.length - 1 && <span style={{ flex: 1, minWidth: 24, height: 1, background: i < s.stageIndex ? "var(--accent-dim)" : "var(--line)", margin: "0 16px" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="c02-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 26, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" note="No identifiable patient data is exchanged in this room." />
          <div className="c02-panel c02-panel-b">
            {collaboration.messages.map((m, i) => (
              <div key={m.id} className="c02-msg ody-rise" data-side={m.author} style={stagger(i, 70, 100)}>
                {m.author !== "system" && <div className="c02-node-badge" style={{ borderColor: m.author === "B" ? "var(--accent)" : "var(--line-2)" }}>{m.author === "A" ? doctor.initials : counterpart.initials}</div>}
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: m.author === "system" ? "var(--ink-4)" : "var(--ink)" }}>{m.author === "system" ? "ODYSSEY" : m.name}</span>
                    {m.author !== "system" && <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{m.role}</span>}
                    <span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: "auto" }}>{m.time}</span>
                    {m.kind === "proposal" && <span className="c02-chip" data-tone="accent" style={{ height: 19, fontSize: 9 }}>Proposal</span>}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-2)", margin: "9px 0 0" }}>{m.body}</p>
                  {m.attachment && (
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 13, border: "1px solid var(--line-2)", background: "var(--bg-2)", padding: "10px 14px" }}>
                      <span style={{ color: "var(--accent)" }}>▣</span>
                      <div>
                        <div className="c02-mono" style={{ fontSize: 12 }}>{m.attachment.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{m.attachment.meta}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <div className="c02-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
              <button className="c02-btn">Send</button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div className="c02-panel" data-accent="true">
            <div className="c02-panel-h"><h2 className="c02-h2">Verification status</h2><span className="c02-chip" data-tone="amber">1 of 2</span></div>
            <div className="c02-panel-b">
              <div style={{ display: "flex", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--green)" }}>✓</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationA}</div><div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>Evidence supports a clinically meaningful similarity</div></div>
              </div>
              <div style={{ display: "flex", gap: 12, paddingTop: 14 }}>
                <span style={{ color: "var(--amber)" }}>○</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationB}</div><div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>Awaiting second clinician</div></div>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.7, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                A connection enters the network record only when two independent clinicians verify it.
              </p>
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Shared evidence</h2></div>
            <div className="c02-panel-b">
              {collaboration.documents.map((d, i) => (
                <div key={d.label} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div className="c02-mono" style={{ fontSize: 12 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 3 }}>{d.meta}</div>
                  </div>
                  <span className="c02-chip" style={{ height: 19, fontSize: 9 }}>{d.kind}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c02-panel">
            <div className="c02-panel-h"><h2 className="c02-h2">Decision log</h2><span className="c02-eyebrow">Immutable</span></div>
            <div className="c02-panel-b">
              <div className="c02-tl">
                {collaboration.decisionLog.map((d) => (
                  <div key={d.id} className="c02-tl-item" data-kind={d.state === "done" ? "treatment" : "stable"} style={{ paddingBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : "var(--ink-2)" }}>{d.action}</span>
                      <span className="c02-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{d.time}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 3 }}>{d.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Disclaimer />
        </div>
      </section>
    </>
  );
}
