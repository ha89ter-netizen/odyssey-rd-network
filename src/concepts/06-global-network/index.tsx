"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { WorldMap, TrajectoryChart, Pedigree, Spark, Ring, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap, journey,
} from "@/data/odyssey";

const NAV: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Network" },
  { id: "create", label: "Contribute a case" },
  { id: "case", label: "Case" },
  { id: "match", label: "Connections" },
  { id: "compare", label: "Comparison" },
  { id: "room", label: "Collaboration" },
];

export default function GlobalNetwork({ screen }: { screen: ScreenId }) {
  return (
    <div className="c06 ody-surface">
      <header className="c06-top">
        <div className="c06-mark">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="8.4" stroke="#4fc79f" strokeWidth="1" />
            <ellipse cx="10" cy="10" rx="4" ry="8.4" stroke="#7d93ad" strokeWidth="0.7" />
            <path d="M1.9 7.4h16.2M1.9 12.6h16.2" stroke="#7d93ad" strokeWidth="0.7" />
            <circle cx="14.6" cy="6.4" r="1.6" fill="#4fc79f" />
          </svg>
          ODYSSEY
        </div>
        <nav className="c06-nav">
          {NAV.map((n) => <span key={n.id} className="c06-navitem" data-on={n.id === screen}>{n.label}</span>)}
        </nav>
        <div className="c06-topright">
          <span>412 INSTITUTIONS · 58 COUNTRIES</span>
          <span className="c06-flag"><i />{doctor.countryCode} · {doctor.city.toUpperCase()}</span>
        </div>
      </header>

      <div className="c06-page">
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

const Disclaimer = () => <span className="c06-disclaimer">◆ {DISCLAIMER}</span>;

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c06-sechead">
    <div>
      <div className="c06-eyebrow">{label}</div>
      {note && <div className="c06-small" style={{ marginTop: 7 }}>{note}</div>}
    </div>
    {right}
  </div>
);

/** The signature: Kazakhstan → network → Germany, shown as hops. */
function HopChain({ compact = false }: { compact?: boolean }) {
  return (
    <div className="c06-hop" style={{ gap: compact ? 8 : 12 }}>
      <div className="c06-hop-node ody-rise">
        <span className="c06-eyebrow">Origin</span>
        <span className="c06-num" style={{ fontSize: 17 }}>{caseKZ.id}</span>
        <span className="c06-small">{caseKZ.country} · {caseKZ.institution.split(" ").slice(0, 3).join(" ")}…</span>
      </div>
      <div className="c06-hop-line" data-active="true" style={{ "--d": "300ms" } as React.CSSProperties} />
      <div className="c06-hop-node ody-rise" style={{ ...stagger(1, 160), borderColor: "var(--navy)" }}>
        <span className="c06-eyebrow">Federated query</span>
        <span className="c06-num" style={{ fontSize: 17 }}>{match.cohortsQueried.toLocaleString()}</span>
        <span className="c06-small">cohorts · {match.countriesQueried} countries · no data transferred</span>
      </div>
      <div className="c06-hop-line" data-active="true" />
      <div className="c06-hop-node ody-rise" style={{ ...stagger(2, 160), borderColor: "var(--green)" }}>
        <span className="c06-eyebrow" style={{ color: "var(--green)" }}>Candidate</span>
        <span className="c06-num" style={{ fontSize: 17, color: "var(--green)" }}>{caseDE.id}</span>
        <span className="c06-small">{caseDE.country} · {caseDE.institution}</span>
      </div>
      <div className="c06-hop-line" />
      <div className="c06-hop-node ody-rise" style={stagger(3, 160)}>
        <span className="c06-eyebrow">Human verification</span>
        <span className="c06-num" style={{ fontSize: 17 }}>1 / 2</span>
        <span className="c06-small">clinicians verified</span>
      </div>
    </div>
  );
}

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c06-eyebrow">{PRODUCT.tagline}</div>
          <h1 className="c06-h1" style={{ marginTop: 14 }}>{doctor.greeting}, {doctor.name}</h1>
          <p className="c06-lede" style={{ marginTop: 12 }}>
            Your institution is one of 412 nodes. Twelve of your cases are unresolved; overnight the network returned
            four candidate connections, one of them across a border.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c06-sec">
        <div className="c06-stage ody-fadein">
          <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "baseline" }}>
            <div>
              <div className="c06-eyebrow">Live connection · {match.surfaced}</div>
              <div style={{ fontSize: 17, marginTop: 6 }}>
                <b style={{ fontWeight: 600 }}>Astana</b> <span style={{ color: "var(--ink-4)" }}>→</span> federated query <span style={{ color: "var(--ink-4)" }}>→</span> <b style={{ fontWeight: 600, color: "var(--green)" }}>Heidelberg</b>
              </div>
            </div>
            <div style={{ display: "flex", gap: 22 }}>
              {[["412", "Institutions"], ["58", "Countries"], ["2,187", "Confirmed connections"]].map(([v, l]) => (
                <div key={l}>
                  <div className="c06-num" style={{ fontSize: 19 }}>{v}</div>
                  <div className="c06-small" style={{ fontSize: 11 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <WorldMap
            nodes={networkNodes}
            edges={networkEdges}
            variant="both"
            highlight={["kz", "de"]}
            labels={["kz", "de", "us", "jp", "br", "au", "za", "in"]}
            className="c06-stage-map"
            crop="0 3 100 37"
            nodeScale={0.85}
            labelSize={1.15}
          />
          <div className="c06-stage-cap">
            <span className="c06-small" style={{ maxWidth: "58ch" }}>
              Each node is a member institution. Lines are established clinical connections. The highlighted line is
              the candidate connection awaiting your review — no identifiable data crossed it.
            </span>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span className="c06-small">● Member institution</span>
              <span className="c06-small" style={{ color: "var(--green)" }}>● Candidate connection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="c06-sec">
        <SecHead label="How this connection formed" note="Six stages from an unresolved case to a verified contribution" />
        <HopChain />
      </div>

      <div className="c06-sec">
        <SecHead label="Cases requiring attention" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          {attention.map((a, i) => (
            <div key={a.id} className="c06-card c06-card-b ody-rise" style={stagger(i, 70, 100)}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="c06-num" style={{ fontSize: 34, color: a.tone === "signal" ? "var(--green)" : a.tone === "alert" ? "var(--red)" : "var(--navy)" }}>
                  {String(a.count).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.label}</span>
              </div>
              <div className="c06-small" style={{ marginTop: 10 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <div>
          <SecHead label="Your unresolved cases" note="12 in the network index · 6 shown" />
          <div className="c06-card">
            <table className="c06-table">
              <thead><tr><th style={{ width: 92 }}>Case</th><th>Presentation</th><th style={{ width: 136 }}>Status</th><th style={{ width: 126 }}>Completeness</th><th style={{ width: 78 }}>Updated</th></tr></thead>
              <tbody>
                {caseQueue.map((r, i) => (
                  <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 120)}>
                    <td className="c06-mono" style={{ color: r.caseId === "ODY-001" ? "var(--green)" : undefined, fontWeight: 500 }}>{r.caseId}</td>
                    <td style={{ color: "var(--ink-2)" }}>{r.summary}</td>
                    <td><span className="c06-chip" data-tone={r.status === "Match proposed" ? "green" : r.status === "Verified" ? "navy" : undefined}>{r.status}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="c06-bar" style={{ flex: 1 }} data-green={r.completeness >= 80}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 200) }} /></div>
                        <span className="c06-mono c06-small">{r.completeness}</span>
                      </div>
                    </td>
                    <td className="c06-mono c06-small">{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="c06-sec">
            <SecHead label="Member institutions" note="Nodes contributing to the queries you run" />
            <div className="c06-card c06-card-b">
              {networkNodes.slice(0, 8).map((n, i) => (
                <div key={n.id} className="c06-inst ody-fadein" style={stagger(i, 45, 180)}>
                  <span className="c06-inst-code">{n.code}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}, {n.country}</div>
                    <div className="c06-small">{n.tier === "primary" ? "Primary node" : n.tier === "member" ? "Member institution" : "Observer"}</div>
                  </div>
                  <span className="c06-mono c06-small">{n.cases.toLocaleString()} cases</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <SecHead label="Network activity" />
            <div className="c06-card c06-card-b">
              {networkActivity.map((a, i) => (
                <div key={a.id} className="ody-fadein" style={{ padding: "11px 0", borderBottom: i < networkActivity.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 55, 200) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</span>
                    <span className="c06-mono c06-small">{a.time}</span>
                  </div>
                  <div className="c06-small" style={{ marginTop: 3 }}>{a.detail}</div>
                  <span className="c06-chip" style={{ marginTop: 7, height: 19 }}>{a.origin}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Your contribution</h2><span className="c06-eyebrow">90 days</span></div>
            <div className="c06-card-b">
              {contributionMetrics.map((m, i) => (
                <div key={m.id} style={{ marginBottom: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                    <span>{m.label}</span>
                    <span className="c06-mono">{m.value}<span style={{ color: "var(--ink-4)" }}>/{m.of}</span></span>
                  </div>
                  <div className="c06-bar" data-green={i >= 2}><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div className="c06-eyebrow">Queries / month</div>
                  <div className="c06-num" style={{ fontSize: 24, marginTop: 5 }}>52</div>
                </div>
                <div style={{ color: "var(--green)" }}><Spark data={querySeries} w={130} h={34} area /></div>
              </div>
            </div>
          </div>

          <div className="c06-notice">
            <span style={{ color: "var(--green)" }}>◆</span>
            <span><b>{PRODUCT.principle}</b> A case returned to the network is worth more than a case stored in it.</span>
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
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c06-eyebrow">Contribute a case to the network</div>
          <h1 className="c06-h1" style={{ marginTop: 14 }}>Create case</h1>
          <p className="c06-lede" style={{ marginTop: 12 }}>
            Your case stays at your institution. What joins the network is a structured description of it — enough to be
            compared, never enough to identify anyone.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "minmax(210px, 270px) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <aside>
          <SecHead label="Sections · 3 of 9" />
          <div className="c06-card">
            {intakeSteps.map((s, i) => (
              <div key={s.id} className="c06-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
                <span className="c06-mono c06-small" style={{ color: s.state === "active" ? "var(--green)" : undefined }}>{s.index}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: s.state === "active" ? 600 : 400 }}>{s.label}</div>
                  {s.state === "active" && <div className="c06-small" style={{ marginTop: 4 }}>{s.description}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="c06-notice" style={{ marginTop: 16 }}>
            <span style={{ color: "var(--navy)" }}>◆</span>
            <span><b>Data residency.</b> Raw records, images and sequence files never leave {doctor.country}. Only structured signals are queried.</span>
          </div>
        </aside>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="c06-chip" data-tone="navy">HPO normalised</span>} />
          <div className="c06-card c06-card-b">
            {active.fields.map((f) => (
              <div key={f.label} className="c06-field">
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{f.label}</div>
                  {f.hint && <div className="c06-small" style={{ marginTop: 5 }}>{f.hint}</div>}
                </div>
                {f.kind === "chips" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {f.value.split(" · ").map((v) => (
                      <span key={v} className="c06-chip" style={{ textTransform: "none", letterSpacing: "0.01em", fontFamily: "var(--font-ui)", fontSize: 11.5 }}>{v}</span>
                    ))}
                  </div>
                ) : (
                  <div className="c06-input">{f.value}</div>
                )}
              </div>
            ))}
          </div>

          <div className="c06-sec">
            <SecHead label="09 — Documents" note="Parsed at your institution. AI-assisted extraction requires clinician verification." />
            <div className="c06-card">
              <div className="c06-card-h">
                <div>
                  <div className="c06-mono" style={{ fontSize: 13 }}>{aiExtraction.document}</div>
                  <div className="c06-small" style={{ marginTop: 3 }}>{aiExtraction.pages} pages · {aiExtraction.processedAt}</div>
                </div>
                <button className="c06-btn" data-variant="ghost">Upload medical report</button>
              </div>
              <div className="c06-card-b" style={{ paddingBottom: 6 }}>
                <div className="c06-notice">
                  <span style={{ color: "var(--amber)" }}>◆</span>
                  <span><b>AI-assisted extraction.</b> {aiExtraction.notice.replace("AI-assisted extraction. ", "")}</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", marginTop: 12 }}>
                {aiExtraction.terms.map((t, i) => (
                  <div key={t.hpo} className="c06-term ody-fadein" style={stagger(i, 55, 140)}>
                    <div>
                      <div style={{ display: "flex", gap: 11, alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 500, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                        <span className="c06-mono c06-small">{t.hpo} · {t.page}</span>
                      </div>
                      <div className="c06-quote">{t.evidence}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, minWidth: 170 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", justifyContent: "flex-end" }}>
                        <span className="c06-mono c06-small">{Math.round(t.confidence * 100)}%</span>
                        <div className="c06-bar" style={{ width: 70 }} data-green={t.confidence > 0.8}><i style={{ width: `${t.confidence * 100}%` }} /></div>
                      </div>
                      {t.state === "confirmed" ? (
                        <span className="c06-chip" data-tone="green">✓ Confirmed</span>
                      ) : t.state === "rejected" ? (
                        <span className="c06-chip" data-tone="red">Rejected</span>
                      ) : (
                        <div style={{ display: "flex", gap: 6 }}>
                          <span className="c06-chip" data-tone="green">Confirm</span>
                          <span className="c06-chip">Edit</span>
                          <span className="c06-chip">Reject</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="c06-card-b" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span className="c06-small">3 confirmed · 3 awaiting review · 1 rejected</span>
                <button className="c06-btn">Contribute to network</button>
              </div>
            </div>
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
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "66ch" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <h1 className="c06-h1">{c.id}</h1>
            <span className="c06-chip" data-tone="amber">{c.status}</span>
            <span className="c06-chip" data-tone="green">1 candidate connection</span>
          </div>
          <p className="c06-lede" style={{ marginTop: 14 }}>{c.headline}</p>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <dl className="c06-kv">
            <dt>Country</dt><dd>{c.country}</dd>
            <dt>Institution</dt><dd style={{ maxWidth: 220 }}>{c.institution}</dd>
            <dt>Age group</dt><dd>{c.ageGroup}</dd>
            <dt>Genetic status</dt><dd>Unresolved</dd>
          </dl>
          <div style={{ textAlign: "center", color: "var(--green)" }}>
            <Ring value={c.completeness} size={70} thickness={4} delay={300}>
              <span className="c06-num" style={{ fontSize: 17, color: "var(--navy)" }}>{c.completeness}</span>
            </Ring>
            <div className="c06-eyebrow" style={{ marginTop: 7 }}>Complete</div>
          </div>
        </div>
      </header>

      <div className="c06-sec">
        <div className="c06-stage" style={{ padding: "16px 20px" }}>
          <div className="c06-eyebrow">Where this case sits in the network</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 24, alignItems: "center", marginTop: 8 }}>
            <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz"]} labels={["kz"]} crop="2 2 82 30" className="w-full" />
            <div>
              <p className="c06-small" style={{ marginBottom: 14 }}>
                {c.id} is indexed from Astana. When you run a federated query, {match.cohortsQueried.toLocaleString()}{" "}
                cohorts across {match.countriesQueried} countries evaluate its signals locally and return only a
                similarity assessment.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><div className="c06-num" style={{ fontSize: 19 }}>{c.signals.length}</div><div className="c06-small">Signal groups</div></div>
                <div><div className="c06-num" style={{ fontSize: 19, color: "var(--green)" }}>4</div><div className="c06-small">Candidates returned</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical summary" />
          <p className="c06-lede" style={{ maxWidth: "none" }}>{c.narrative}</p>

          <div className="c06-sec">
            <SecHead label="Phenotype profile" note="8 present · 1 explicitly absent" />
            <div className="c06-card">
              <table className="c06-table">
                <thead><tr><th>Term</th><th style={{ width: 104 }}>HPO</th><th style={{ width: 82 }}>Onset</th><th style={{ width: 88 }}>Severity</th><th style={{ width: 92 }}>Status</th><th style={{ width: 120 }}>Source</th></tr></thead>
                <tbody>
                  {c.phenotypes.map((p, i) => (
                    <tr key={p.hpo} className="ody-fadein" style={stagger(i, 36, 100)}>
                      <td style={{ fontWeight: 500, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                      <td className="c06-mono c06-small">{p.hpo}</td>
                      <td className="c06-mono">{p.onset}</td>
                      <td>{p.severity}</td>
                      <td><span className="c06-chip" data-tone={p.status === "Absent" ? "red" : p.status === "Present" ? "navy" : undefined}>{p.status}</span></td>
                      <td className="c06-small">{p.source}{!p.verified && <span style={{ color: "var(--amber)" }}> · unverified</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="c06-sec">
            <SecHead label="Clinical timeline" />
            <div className="c06-tl">
              {c.timeline.map((t, i) => (
                <div key={i} className="c06-tl-item ody-rise" data-kind={t.kind} style={stagger(i, 50, 120)}>
                  <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                    <span className="c06-mono c06-small" style={{ width: 62, flex: "none" }}>{t.age}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.label}</div>
                      <div className="c06-small" style={{ marginTop: 3 }}>{t.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 22 }}>
          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Case completeness</h2><span className="c06-num">{c.completeness}%</span></div>
            <div className="c06-card-b">
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 56px 30px", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5 }}>{b.label}</span>
                  <div className="c06-bar" data-green={b.value >= 85}><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 200) }} /></div>
                  <span className="c06-mono c06-small" style={{ textAlign: "right" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Genetic information</h2></div>
            <div className="c06-card-b">
              <p className="c06-small" style={{ marginTop: 0 }}>{c.geneticSummary}</p>
              {c.genetics.map((g, i) => (
                <div key={i} style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span className="c06-mono" style={{ fontSize: 12.5 }}>{g.gene === "—" ? g.variant : `${g.gene} ${g.variant}`}</span>
                    <span className="c06-chip" data-tone={g.classification.startsWith("VUS") ? "amber" : undefined}>{g.classification}</span>
                  </div>
                  <div className="c06-small" style={{ marginTop: 4 }}>{g.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Potential matching signals</h2><span className="c06-chip" data-tone="green">{c.signals.length}</span></div>
            <div className="c06-card-b">
              {c.signals.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "8px 0", borderBottom: i < c.signals.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span className="c06-mono c06-small">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 12.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Family pattern</h2></div>
            <div className="c06-card-b"><Pedigree consanguineous affected={[0, 2]} size={210} /></div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Negative evidence</h2></div>
            <div className="c06-card-b">
              {c.negativeEvidence.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, padding: "6px 0", color: "var(--ink-2)" }}><span style={{ color: "var(--red)" }}>×</span>{n}</div>
              ))}
            </div>
          </div>
        </aside>
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
          <div className="c06-eyebrow">Potential cross-border match · {match.id}</div>
          <h1 className="c06-h1" style={{ marginTop: 14 }}>Kazakhstan → Germany</h1>
          <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
            <span className="c06-chip" data-tone="green" style={{ height: 26 }}>{match.confidenceLabel}</span>
            <span className="c06-small">{match.confidenceNote}</span>
          </div>
        </div>
        <Disclaimer />
      </header>

      <div className="c06-sec">
        <div className="c06-stage">
          <WorldMap nodes={networkNodes} edges={networkEdges} variant="both" highlight={["kz", "de"]} labels={["kz", "de"]} crop="0 3 100 34" className="c06-stage-map" nodeScale={0.85} labelSize={1.15} />
          <div className="c06-stage-cap">
            <div style={{ display: "flex", gap: 34, flexWrap: "wrap" }}>
              {[caseKZ, caseDE].map((c, i) => (
                <div key={c.id}>
                  <div className="c06-eyebrow" style={{ color: i === 1 ? "var(--green)" : undefined }}>{i === 0 ? "Your case" : "Candidate"}</div>
                  <div className="c06-num" style={{ fontSize: 19, marginTop: 5, color: i === 1 ? "var(--green)" : "var(--navy)" }}>{c.id}</div>
                  <div className="c06-small">{c.institution}, {i === 0 ? doctor.city : counterpart.city}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="c06-num" style={{ fontSize: 26, color: "var(--green)" }}>{match.concordantGroups}/{match.totalGroups}</div>
              <div className="c06-small">evidence groups concordant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="c06-sec">
        <SecHead label="The path this connection took" />
        <HopChain />
      </div>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <div>
          <SecHead label="Evidence supporting similarity" note="Each group is assessed independently. A score describes similarity of recorded evidence, not the probability of a diagnosis." />
          <div className="c06-card c06-card-b">
            {matchEvidence.map((e, i) => (
              <div key={e.id} className="c06-ev-row ody-fadein" style={stagger(i, 55, 100)}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.label}</div>
                  <span className="c06-chip" data-tone={e.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 7, height: 19 }}>
                    {e.direction === "divergent" ? "Divergent" : e.weight}
                  </span>
                </div>
                <div>
                  <div className="c06-num" style={{ fontSize: 22, color: e.direction === "divergent" ? "var(--amber)" : "var(--green)" }}>{e.score}</div>
                  <div className="c06-bar" style={{ marginTop: 6 }} data-green={e.direction !== "divergent"}>
                    <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--amber)" : undefined, ...stagger(i, 55, 180) }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{e.summary}</div>
                </div>
                <div>
                  <div className="c06-mono c06-small">KZ {e.kzValue}</div>
                  <div className="c06-mono c06-small" style={{ color: "var(--green)", marginTop: 3 }}>DE {e.deValue}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="c06-sec">
            <SecHead label="Where the cases diverge" note="Divergence is recorded, not hidden" />
            <div className="c06-card c06-card-b">
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
          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">How this match was found</h2></div>
            <div className="c06-card-b">
              {match.reasoningSteps.map((s, i) => (
                <div key={s.id} className="ody-fadein" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, paddingBottom: 15, ...stagger(i, 80, 200) }}>
                  <span className="c06-mono c06-small" style={{ color: "var(--green)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div className="c06-small" style={{ marginTop: 3 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card" style={{ borderColor: "var(--green)" }}>
            <div className="c06-card-b">
              <div className="c06-eyebrow" style={{ color: "var(--green)" }}>Requires clinician review</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, marginTop: 10 }}>{match.proposedAction}.</p>
              <ol style={{ margin: "14px 0 0", paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 5 }}>{n}</li>)}
              </ol>
              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button className="c06-btn">Request collaboration</button>
                <button className="c06-btn" data-variant="ghost">Not a match</button>
              </div>
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Other candidates</h2><span className="c06-eyebrow">Same query</span></div>
            <div className="c06-card-b">
              {otherCandidates.map((o, i) => (
                <div key={o.id} className="c06-inst" style={{ borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                  <span className="c06-inst-code">{o.countryCode}</span>
                  <div>
                    <div className="c06-mono" style={{ fontSize: 12.5 }}>{o.id}</div>
                    <div className="c06-small">{o.note}</div>
                  </div>
                  <span className="c06-num" style={{ fontSize: 16, color: "var(--ink-3)" }}>{o.score}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------ COMPARE ------------------------------ */

const LABEL: Record<string, string> = { match: "Concordant", partial: "Partial", differ: "Differs", "only-de": "742 only", "only-kz": "001 only" };

function Compare() {
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 22, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div className="c06-eyebrow">Case comparison · {match.id}</div>
          <h1 className="c06-h1" style={{ marginTop: 14 }}>{caseKZ.id} Kazakhstan · {caseDE.id} Germany</h1>
        </div>
        <Disclaimer />
      </header>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div className="c06-card c06-card-b ody-rise">
          <div className="c06-eyebrow">Phenotype overlap</div>
          <svg viewBox="0 0 160 92" style={{ width: "100%", marginTop: 12 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="var(--navy)" fillOpacity="0.06" stroke="var(--navy)" strokeWidth="0.8" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--green)" fillOpacity="0.1" stroke="var(--green)" strokeWidth="0.8" />
            <text x="34" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--navy)">{phenotypeOverlap.onlyKZ}</text>
            <text x="80" y="52" textAnchor="middle" fontSize="19" fontFamily="var(--font-data)" fill="var(--navy)">{phenotypeOverlap.shared}</text>
            <text x="126" y="51" textAnchor="middle" fontSize="13" fontFamily="var(--font-data)" fill="var(--green)">{phenotypeOverlap.onlyDE}</text>
          </svg>
        </div>
        <div className="c06-card c06-card-b ody-rise" style={stagger(1, 110)}>
          <div className="c06-eyebrow">Clinical trajectory · months</div>
          <div style={{ marginTop: 12, color: "var(--ink-3)", "--track-a": "var(--navy)", "--track-b": "var(--green)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={118} rowLabels />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
            <span className="c06-small">● {caseKZ.id}</span>
            <span className="c06-small" style={{ color: "var(--green)" }}>● {caseDE.id}</span>
          </div>
        </div>
        <div className="c06-card c06-card-b ody-rise" style={stagger(2, 110)}>
          <div className="c06-eyebrow">Family pattern</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <div style={{ color: "var(--navy)" }}><Pedigree consanguineous affected={[0, 2]} size={144} /></div>
            <div style={{ color: "var(--green)" }}><Pedigree consanguineous={false} affected={[1]} size={144} /></div>
          </div>
        </div>
      </div>

      <div className="c06-sec">
        <div className="c06-card">
          <div className="c06-cmp" style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-data)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", padding: "13px 18px" }}>
            <span>Signal</span><span style={{ color: "var(--navy)" }}>{caseKZ.id} · KZ</span><span style={{ color: "var(--green)" }}>{caseDE.id} · DE</span><span style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "13px 18px 7px", borderBottom: "1px solid var(--line)" }}>
                <span className="c06-eyebrow">{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c06-cmp ody-fadein" style={stagger(i, 22, gi * 45)}>
                  <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                  <span>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--green)" : undefined }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="c06-chip" data-tone={r.agreement === "match" ? "green" : r.agreement === "differ" ? "amber" : r.agreement.startsWith("only") ? "navy" : undefined} style={{ height: 18, fontSize: 9 }}>{LABEL[r.agreement]}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="c06-sec" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="c06-notice" style={{ maxWidth: "68ch" }}>
          <span style={{ color: "var(--green)" }}>◆</span>
          <span><b>Requires clinician review.</b> This comparison describes similarity between two recorded cases; it does not establish a diagnosis.</span>
        </div>
        <button className="c06-btn">Open collaboration room</button>
      </div>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <header className="ody-rise" style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div className="c06-eyebrow">Secure collaboration · {collaboration.roomId}</div>
          <h1 className="c06-h1" style={{ marginTop: 14 }}>{collaboration.title}</h1>
          <div style={{ display: "flex", gap: 10, marginTop: 13, flexWrap: "wrap" }}>
            <span className="c06-chip" data-tone="green">◈ End-to-end encrypted</span>
            <span className="c06-chip">Opened {collaboration.opened}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {collaboration.participants.map((p, i) => (
            <div key={p.networkId} className="c06-card c06-card-b" style={{ minWidth: 230 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="c06-avatar" data-b={i === 1}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
                  <div className="c06-small">{p.role}</div>
                </div>
              </div>
              <div className="c06-small" style={{ marginTop: 10 }}>{p.institution}, {p.city}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="c06-sec">
        <div className="c06-card c06-card-b">
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {s.stages.map((st, i) => (
              <React.Fragment key={st}>
                <div className="ody-fadein" style={{ display: "flex", alignItems: "center", gap: 10, ...stagger(i, 90) }}>
                  <span style={{ width: 22, height: 22, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 10, fontFamily: "var(--font-data)", background: i < s.stageIndex ? "var(--green)" : i === s.stageIndex ? "var(--navy)" : "var(--surface-2)", color: i <= s.stageIndex ? "#fff" : "var(--ink-4)", border: i > s.stageIndex ? "1px solid var(--line-2)" : "none" }}>
                    {i < s.stageIndex ? "✓" : i + 1}
                  </span>
                  <span style={{ fontSize: 12.5, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)", fontWeight: i === s.stageIndex ? 600 : 400 }}>{st}</span>
                </div>
                {i < s.stages.length - 1 && <span style={{ flex: 1, minWidth: 20, height: 1, background: i < s.stageIndex ? "var(--green)" : "var(--line)", margin: "0 14px" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="c06-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" note={collaboration.security} />
          <div className="c06-card c06-card-b">
            {collaboration.messages.map((m, i) => (
              <div key={m.id} className="c06-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
                {m.author !== "system" && <div className="c06-avatar" data-b={m.author === "B"}>{m.author === "A" ? doctor.initials : counterpart.initials}</div>}
                <div>
                  <div style={{ display: "flex", gap: 11, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.author === "system" ? "var(--ink-3)" : undefined }}>{m.author === "system" ? "ODYSSEY" : m.name}</span>
                    {m.author !== "system" && <span className="c06-small">{m.role}</span>}
                    <span className="c06-mono c06-small" style={{ marginLeft: "auto" }}>{m.time}</span>
                    {m.kind === "proposal" && <span className="c06-chip" data-tone="green" style={{ height: 18, fontSize: 9 }}>Proposal</span>}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.72, color: "var(--ink-2)", margin: "8px 0 0" }}>{m.body}</p>
                  {m.attachment && (
                    <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 3, padding: "10px 13px", background: "var(--surface-2)" }}>
                      <div className="c06-mono" style={{ fontSize: 12 }}>{m.attachment.label}</div>
                      <div className="c06-small" style={{ marginTop: 2 }}>{m.attachment.meta}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <div className="c06-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
              <button className="c06-btn">Send</button>
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 22 }}>
          <div className="c06-card" style={{ borderColor: "var(--green)" }}>
            <div className="c06-card-h"><h2 className="c06-h2">Verification status</h2><span className="c06-chip" data-tone="amber">1 of 2</span></div>
            <div className="c06-card-b">
              <div style={{ display: "flex", gap: 11, paddingBottom: 13, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--green)" }}>✓</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationA}</div><div className="c06-small" style={{ marginTop: 3 }}>Evidence supports a clinically meaningful similarity</div></div>
              </div>
              <div style={{ display: "flex", gap: 11, paddingTop: 13 }}>
                <span style={{ color: "var(--amber)" }}>○</span>
                <div><div style={{ fontSize: 13 }}>{s.verificationB}</div><div className="c06-small" style={{ marginTop: 3 }}>Awaiting second clinician</div></div>
              </div>
              <p className="c06-small" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                A connection joins the network record only when two independent clinicians verify it.
              </p>
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Shared evidence</h2><span className="c06-eyebrow">{collaboration.documents.length} items</span></div>
            <div className="c06-card-b">
              {collaboration.documents.map((d, i) => (
                <div key={d.label} style={{ padding: "10px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span className="c06-mono" style={{ fontSize: 12 }}>{d.label}</span>
                    <span className="c06-chip" style={{ height: 18, fontSize: 9 }}>{d.kind}</span>
                  </div>
                  <div className="c06-small" style={{ marginTop: 3 }}>{d.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="c06-card">
            <div className="c06-card-h"><h2 className="c06-h2">Decision log</h2><span className="c06-eyebrow">Immutable</span></div>
            <div className="c06-card-b">
              <div className="c06-tl">
                {collaboration.decisionLog.map((d) => (
                  <div key={d.id} className="c06-tl-item" data-kind={d.state === "done" ? "treatment" : "stable"} style={{ paddingBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</span>
                      <span className="c06-mono c06-small">{d.time}</span>
                    </div>
                    <div className="c06-small" style={{ marginTop: 2 }}>{d.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Disclaimer />
        </aside>
      </div>
    </>
  );
}
