"use client";

import * as React from "react";
import "./theme.css";
import type { ScreenId } from "@/lib/concepts";
import { WorldMap, TrajectoryChart, Pedigree, Ring, Spark, stagger } from "@/components/kit";
import {
  DISCLAIMER, PRODUCT, doctor, counterpart, attention, caseQueue, networkActivity, networkStats,
  contributionMetrics, querySeries, caseKZ, caseDE, match, matchEvidence, otherCandidates,
  comparisonGroups, intakeSteps, aiExtraction, collaboration, networkNodes, networkEdges, trajectory,
  phenotypeOverlap,
} from "@/data/odyssey";

const NAV: { id: ScreenId; label: string }[] = [
  { id: "dashboard", label: "Reading room" },
  { id: "create", label: "Deposit case" },
  { id: "case", label: "Case record" },
  { id: "match", label: "Correspondence" },
  { id: "compare", label: "Concordance" },
  { id: "room", label: "Consultation" },
];

export default function EvidenceArchive({ screen }: { screen: ScreenId }) {
  return (
    <div className="c04 ody-surface">
      <div className="c04-grain" />
      <header className="c04-masthead">
        <div className="c04-masthead-in">
          <div className="c04-brandrow">
            <div>
              <h1 className="c04-brand">ODYSSEY</h1>
              <div className="c04-brandsub">{PRODUCT.tagline} · Est. as a federated record</div>
            </div>
            <div className="c04-folio">
              <div>{doctor.institution}</div>
              <div>{doctor.city.toUpperCase()} · {doctor.localTime} · FOLIO {doctor.networkId}</div>
            </div>
          </div>
          <nav className="c04-nav">
            {NAV.map((n) => (
              <span key={n.id} className="c04-navitem" data-on={n.id === screen}>{n.label}</span>
            ))}
          </nav>
        </div>
      </header>

      <div className="c04-page">
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

const Disclaimer = () => <span className="c04-disclaimer">{DISCLAIMER}</span>;

const SecHead = ({ label, note, right }: { label: string; note?: string; right?: React.ReactNode }) => (
  <div className="c04-sechead">
    <div>
      <div className="c04-eyebrow">{label}</div>
      {note && <div className="c04-small" style={{ marginTop: 8 }}>{note}</div>}
    </div>
    {right}
  </div>
);

/* ------------------------------ DASHBOARD ------------------------------ */

function Dashboard() {
  return (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }} className="ody-rise">
        <div>
          <div className="c04-eyebrow">The reading room</div>
          <h2 className="c04-h1" style={{ marginTop: 18 }}>
            {doctor.greeting}, {doctor.name}
          </h2>
          <p className="c04-lede" style={{ marginTop: 20 }}>
            Twelve case records in your care remain without an answer. Overnight the archive returned four
            correspondences — documents held elsewhere in the world that describe something very like them.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
          <Disclaimer />
          <p className="c04-body" style={{ fontStyle: "italic", margin: 0, fontSize: 17, lineHeight: 1.6 }}>
            “{PRODUCT.promise}”
          </p>
          <div className="c04-small">{doctor.department} · {doctor.accreditation}</div>
        </div>
      </section>

      <section className="c04-sec">
        <SecHead label="Cases requiring attention" note="Ordered by clinical urgency" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0, borderTop: "1px solid var(--line)" }}>
          {attention.map((a, i) => (
            <div key={a.id} className="ody-rise" style={{ padding: "22px 24px 24px", borderRight: i < 3 ? "1px solid var(--line)" : undefined, ...stagger(i, 80, 100) }}>
              <div className="c04-num" style={{ fontSize: 46, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, color: a.tone === "signal" ? "var(--burgundy)" : a.tone === "alert" ? "var(--gold)" : "var(--ink)", fontFamily: "var(--font-serif)" }}>
                {String(a.count).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 15, marginTop: 14 }}>{a.label}</div>
              <div className="c04-small" style={{ marginTop: 6 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* the moment, as an archival notice */}
      <section className="c04-sec">
        <div className="c04-leaf" style={{ borderColor: "var(--burgundy)" }}>
          <div className="c04-leaf-h" style={{ background: "rgba(124,31,43,0.05)" }}>
            <span className="c04-eyebrow">Correspondence found · {match.surfaced}</span>
            <span className="c04-tag" data-tone="burgundy">Requires clinician review</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)" }}>
            <div className="c04-leaf-b" style={{ padding: "30px 32px" }}>
              <h3 className="c04-h2" style={{ maxWidth: "26ch" }}>
                A record deposited in Heidelberg describes the same disease course as {caseKZ.id}.
              </h3>
              <p className="c04-body c04-dropcap" style={{ marginTop: 20 }}>
                Seven of eight independent evidence groups are concordant — the imaging pattern, the lactate profile,
                the response to a ketogenic diet, and an identical coding variant of uncertain significance in the same
                gene. One group, the family pattern, diverges and is recorded as such.
              </p>
              <div className="c04-prov">Federated query · {match.cohortsQueried.toLocaleString()} cohorts · {match.countriesQueried} countries · no identifiable data transferred</div>
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <button className="c04-btn">Read the evidence</button>
                <button className="c04-btn" data-variant="ghost">Defer to case conference</button>
              </div>
            </div>
            <div style={{ borderLeft: "1px solid var(--line)", background: "var(--paper-2)", padding: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div className="c04-label">Deposit</div>
                  <div className="c04-num" style={{ fontSize: 19, marginTop: 5 }}>{caseKZ.id}</div>
                  <div className="c04-small">{caseKZ.country}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="c04-label">Correspondent</div>
                  <div className="c04-num" style={{ fontSize: 19, marginTop: 5, color: "var(--burgundy)" }}>{caseDE.id}</div>
                  <div className="c04-small">{caseDE.country}</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <WorldMap nodes={networkNodes} edges={networkEdges} highlight={["kz", "de"]} labels={["kz", "de"]} crop="2 2 82 30" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 44, alignItems: "start" }}>
        <div>
          <SecHead label="Case records in your care" note="12 unresolved · 6 shown" />
          <table className="c04-table">
            <thead><tr><th style={{ width: 96 }}>Folio</th><th>Presentation</th><th style={{ width: 110 }}>Age</th><th style={{ width: 140 }}>Status</th><th style={{ width: 120 }}>Completeness</th></tr></thead>
            <tbody>
              {caseQueue.map((r, i) => (
                <tr key={r.id} className="ody-fadein" style={stagger(i, 45, 120)}>
                  <td className="c04-num" style={{ color: r.caseId === "ODY-001" ? "var(--burgundy)" : undefined }}>{r.caseId}</td>
                  <td style={{ fontFamily: "var(--font-serif)", fontSize: 14.5 }}>{r.summary}</td>
                  <td className="c04-small">{r.ageGroup}</td>
                  <td><span className="c04-tag" data-tone={r.status === "Match proposed" ? "burgundy" : r.status === "Verified" ? "green" : undefined}>{r.status}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="c04-bar" style={{ flex: 1 }}><i className="ody-growx" style={{ width: `${r.completeness}%`, ...stagger(i, 45, 200) }} /></div>
                      <span className="c04-num" style={{ fontSize: 11 }}>{r.completeness}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <SecHead label="Accessions & activity" note="Across 412 depositing institutions" />
          {networkActivity.map((a, i) => (
            <div key={a.id} className="ody-fadein" style={{ padding: "14px 0", borderBottom: "1px dotted var(--line-strong)", ...stagger(i, 55, 180) }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "baseline" }}>
                <span style={{ fontSize: 15 }}>{a.title}</span>
                <span className="c04-small">{a.time}</span>
              </div>
              <div className="c04-small" style={{ marginTop: 4 }}>{a.detail}</div>
              <div className="c04-prov">{a.origin}</div>
            </div>
          ))}

          <div className="c04-sec" style={{ marginTop: 34 }}>
            <SecHead label="Your contribution to the record" note="Last 90 days" />
            {contributionMetrics.map((m, i) => (
              <div key={m.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 7 }}>
                  <span>{m.label}</span>
                  <span className="c04-num">{m.value} <span style={{ color: "var(--ink-4)" }}>/ {m.of}</span></span>
                </div>
                <div className="c04-bar"><i className="ody-growx" style={{ width: `${(m.value / m.of) * 100}%`, ...stagger(i, 70, 300) }} /></div>
                <div className="c04-small" style={{ marginTop: 5 }}>{m.note}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line-strong)" }}>
              <div>
                <div className="c04-label">Federated queries / month</div>
                <div className="c04-num" style={{ fontSize: 28, marginTop: 6, fontFamily: "var(--font-serif)" }}>52</div>
              </div>
              <div style={{ color: "var(--burgundy)" }}><Spark data={querySeries} w={132} h={36} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="c04-sec">
        <div className="c04-rule-orn" style={{ marginBottom: 26 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-3)" }}>{PRODUCT.principle}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 30 }}>
          {networkStats.map((s) => (
            <div key={s.id}>
              <div className="c04-num" style={{ fontSize: 30, fontFamily: "var(--font-serif)", fontWeight: 400 }}>{s.value}</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>{s.label}</div>
              <div className="c04-small" style={{ marginTop: 4 }}>{s.delta}</div>
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
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }} className="ody-rise">
        <div>
          <div className="c04-eyebrow">Deposit a case record</div>
          <h2 className="c04-h1" style={{ marginTop: 18 }}>Create case</h2>
          <p className="c04-lede" style={{ marginTop: 18 }}>
            A deposit is a structured record, not a document. Nine sections describe the case in terms that can be
            compared with a record written in another language, in another decade, in another country.
          </p>
        </div>
        <Disclaimer />
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "minmax(210px, 270px) minmax(0, 1fr)", gap: 44, alignItems: "start" }}>
        <aside>
          <SecHead label="Sections · 3 of 9" />
          {intakeSteps.map((s, i) => (
            <div key={s.id} className="c04-step ody-fadein" data-state={s.state} style={stagger(i, 40)}>
              <span className="c04-step-n">{s.index}</span>
              <div>
                <div className="c04-step-l" style={{ fontSize: 14.5 }}>{s.label}</div>
                {s.state === "active" && <div className="c04-small" style={{ marginTop: 5 }}>{s.description}</div>}
              </div>
            </div>
          ))}
          <div className="c04-notice" style={{ marginTop: 22 }}>
            <b>Completeness 82%.</b> Negative evidence and family history would raise the precision of any future
            correspondence most.
          </div>
        </aside>

        <div>
          <SecHead label={`${active.index} — ${active.label}`} note={active.description} right={<span className="c04-tag" data-tone="burgundy">HPO normalised</span>} />
          <div className="c04-leaf c04-leaf-b">
            {active.fields.map((f) => (
              <div key={f.label} className="c04-field">
                <div>
                  <div className="c04-label">{f.label}</div>
                  {f.hint && <div className="c04-small" style={{ marginTop: 6 }}>{f.hint}</div>}
                </div>
                {f.kind === "chips" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {f.value.split(" · ").map((v) => (
                      <span key={v} className="c04-tag" style={{ textTransform: "none", letterSpacing: "0.01em", fontSize: 11.5 }}>{v}</span>
                    ))}
                  </div>
                ) : (
                  <div className="c04-input">{f.value}</div>
                )}
              </div>
            ))}
          </div>

          <div className="c04-sec">
            <SecHead label="09 — Documents" note="The report is read at your institution. Extraction is assistive; the clinician's hand is the authority." />
            <div className="c04-leaf">
              <div className="c04-leaf-h">
                <div>
                  <div className="c04-num" style={{ fontSize: 14 }}>{aiExtraction.document}</div>
                  <div className="c04-small" style={{ marginTop: 3 }}>{aiExtraction.pages} pages · {aiExtraction.processedAt}</div>
                </div>
                <button className="c04-btn" data-variant="ghost">Upload medical report</button>
              </div>
              <div className="c04-leaf-b">
                <div className="c04-notice">
                  <b>AI-assisted extraction.</b> Each proposed term is shown with the sentence it was drawn from and the
                  page it appears on. Nothing enters the record until a clinician confirms, edits or rejects it.
                </div>

                <div style={{ marginTop: 24 }}>
                  {aiExtraction.terms.map((t, i) => (
                    <div key={t.hpo} className="c04-term ody-fadein" style={stagger(i, 55, 140)}>
                      <div>
                        <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                          <span style={{ fontSize: 18, textDecoration: t.state === "rejected" ? "line-through" : undefined, color: t.state === "rejected" ? "var(--ink-4)" : undefined }}>{t.term}</span>
                          <span className="c04-num c04-small">{t.hpo}</span>
                        </div>
                        <div className="c04-quote">{t.evidence}</div>
                        <div className="c04-prov">{aiExtraction.document}, {t.page}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="c04-num" style={{ fontSize: 22, fontFamily: "var(--font-serif)", color: t.confidence < 0.7 ? "var(--ink-4)" : "var(--ink)" }}>{Math.round(t.confidence * 100)}%</div>
                        <div className="c04-small">extraction confidence</div>
                        <div style={{ marginTop: 12, display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          {t.state === "confirmed" ? (
                            <span className="c04-tag" data-tone="green">✓ Confirmed</span>
                          ) : t.state === "rejected" ? (
                            <span className="c04-tag">Rejected</span>
                          ) : (
                            <>
                              <span className="c04-tag" data-tone="burgundy">Confirm</span>
                              <span className="c04-tag">Edit</span>
                              <span className="c04-tag">Reject</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
                  <span className="c04-small">3 confirmed · 3 awaiting review · 1 rejected</span>
                  <button className="c04-btn">Confirm and deposit</button>
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
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }} className="ody-rise">
        <div>
          <div className="c04-eyebrow">Case record · deposited {c.enrolled}</div>
          <h2 className="c04-h1" style={{ marginTop: 16 }}>{c.id}</h2>
          <p className="c04-lede" style={{ marginTop: 18, fontStyle: "italic" }}>{c.headline}</p>
        </div>
        <div>
          <dl className="c04-kv">
            <div><dt>Country</dt><dd>{c.country}</dd></div>
            <div><dt>Age group</dt><dd>{c.ageGroup}</dd></div>
            <div><dt>Status</dt><dd><span className="c04-tag" data-tone="gold">{c.status}</span></dd></div>
            <div><dt>Institution</dt><dd style={{ fontSize: 13.5 }}>{c.institution}</dd></div>
          </dl>
        </div>
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 48, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical summary" />
          <p className="c04-body c04-dropcap" style={{ fontSize: 16.5, lineHeight: 1.75 }}>{c.narrative}</p>
          <div className="c04-prov">Compiled from 7 clinical documents · last revised {c.lastUpdated}</div>

          <div className="c04-sec">
            <SecHead label="Phenotype profile" note="8 present · 1 explicitly absent · normalised to the Human Phenotype Ontology" />
            <table className="c04-table">
              <thead><tr><th>Term</th><th style={{ width: 106 }}>HPO</th><th style={{ width: 84 }}>Onset</th><th style={{ width: 90 }}>Severity</th><th style={{ width: 94 }}>Status</th><th style={{ width: 126 }}>Source</th></tr></thead>
              <tbody>
                {c.phenotypes.map((p, i) => (
                  <tr key={p.hpo} className="ody-fadein" style={stagger(i, 38, 100)}>
                    <td style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: p.status === "Absent" ? "var(--ink-4)" : undefined }}>{p.term}</td>
                    <td className="c04-num" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{p.hpo}</td>
                    <td className="c04-num">{p.onset}</td>
                    <td>{p.severity}</td>
                    <td><span className="c04-tag" data-tone={p.status === "Absent" ? "burgundy" : p.status === "Resolved" ? undefined : "green"}>{p.status}</span></td>
                    <td className="c04-small">{p.source}{!p.verified && <span style={{ color: "var(--gold)" }}> · unverified</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="c04-sec">
            <SecHead label="Clinical timeline" note="Trajectory is often more discriminating than any single finding" />
            <div className="c04-tl">
              {c.timeline.map((t, i) => (
                <div key={i} className="c04-tl-item ody-rise" data-kind={t.kind} style={stagger(i, 55, 120)}>
                  <div className="c04-tl-age">{t.age}</div>
                  <div style={{ fontSize: 16, marginTop: 5 }}>{t.label}</div>
                  <div className="c04-body" style={{ fontSize: 14, marginTop: 3 }}>{t.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="c04-sec">
            <SecHead label="Genetic information" note={c.geneticSummary} />
            <table className="c04-table">
              <thead><tr><th style={{ width: 92 }}>Gene</th><th>Finding</th><th style={{ width: 132 }}>Zygosity</th><th style={{ width: 130 }}>Classification</th></tr></thead>
              <tbody>
                {c.genetics.map((g, i) => (
                  <tr key={i}>
                    <td className="c04-num">{g.gene}</td>
                    <td>
                      <div className="c04-num" style={{ fontSize: 12.5 }}>{g.variant}</div>
                      <div className="c04-small" style={{ marginTop: 4 }}>{g.note}</div>
                    </td>
                    <td>{g.zygosity}</td>
                    <td><span className="c04-tag" data-tone={g.classification.startsWith("VUS") ? "gold" : undefined}>{g.classification}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 26 }}>
          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Case completeness</h3><span className="c04-num">{c.completeness}%</span></div>
            <div className="c04-leaf-b">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, color: "var(--burgundy)" }}>
                <Ring value={c.completeness} size={92} thickness={3} delay={280}>
                  <span className="c04-num" style={{ fontSize: 22, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>{c.completeness}</span>
                </Ring>
              </div>
              {c.completenessBreakdown.map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "1fr 58px 30px", gap: 12, alignItems: "center", marginBottom: 9 }}>
                  <span style={{ fontSize: 13.5 }}>{b.label}</span>
                  <div className="c04-bar"><i className="ody-growx" style={{ width: `${b.value}%`, ...stagger(i, 50, 200) }} /></div>
                  <span className="c04-num" style={{ fontSize: 11, textAlign: "right", color: "var(--ink-3)" }}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Potential matching signals</h3><span className="c04-tag" data-tone="burgundy">{c.signals.length}</span></div>
            <div className="c04-leaf-b">
              <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {c.signals.map((s, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "9px 0", borderBottom: i < c.signals.length - 1 ? "1px dotted var(--line-strong)" : undefined }}>
                    <span className="c04-num c04-small">{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14 }}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Family pattern</h3></div>
            <div className="c04-leaf-b">
              <Pedigree consanguineous affected={[0, 2]} size={220} />
              <dl className="c04-kv" style={{ marginTop: 14 }}>
                <div><dt>Pedigree</dt><dd style={{ fontSize: 13.5 }}>{c.family.pedigree}</dd></div>
                <div><dt>Notes</dt><dd style={{ fontSize: 13.5 }}>{c.family.notes}</dd></div>
              </dl>
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Negative evidence</h3><span className="c04-small">Narrows the field</span></div>
            <div className="c04-leaf-b">
              {c.negativeEvidence.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, padding: "6px 0" }}>
                  <span style={{ color: "var(--burgundy)" }}>—</span>{n}
                </div>
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
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }}>
        <div>
          <div className="c04-eyebrow">Correspondence · {match.id}</div>
          <h2 className="c04-h1" style={{ marginTop: 16 }}>
            {caseKZ.id} <span style={{ color: "var(--ink-4)", fontSize: "0.6em" }}>and</span> {caseDE.id}
          </h2>
          <p className="c04-lede" style={{ marginTop: 20 }}>
            Two records, deposited eighteen months apart by institutions that have never corresponded, describe the same
            trajectory. {match.confidenceNote}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Disclaimer />
          <div className="c04-tag" data-tone="burgundy" style={{ fontSize: 11, padding: "7px 12px" }}>{match.confidenceLabel}</div>
          <dl className="c04-kv" style={{ width: "100%" }}>
            <div><dt>Concordant</dt><dd className="c04-num">{match.concordantGroups} of {match.totalGroups} groups</dd></div>
            <div><dt>Divergent</dt><dd className="c04-num">{match.divergences} group</dd></div>
            <div><dt>Review</dt><dd>{match.reviewStatus}</dd></div>
          </dl>
        </div>
      </section>

      <section className="c04-sec">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0, borderTop: "2px solid var(--ink)", borderBottom: "1px solid var(--line)" }}>
          {[caseKZ, caseDE].map((c, i) => (
            <div key={c.id} style={{ padding: "24px 28px", borderRight: i === 0 ? "1px solid var(--line)" : undefined }} className="ody-rise">
              <div className="c04-eyebrow" style={{ color: i === 1 ? "var(--burgundy)" : "var(--ink-3)" }}>{i === 0 ? "Your deposit" : "Correspondent record"}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12 }}>
                <span className="c04-num" style={{ fontSize: 28, fontFamily: "var(--font-serif)", fontWeight: 400 }}>{c.id}</span>
                <span style={{ fontSize: 17 }}>{c.country}</span>
              </div>
              <div className="c04-small" style={{ marginTop: 8 }}>{c.institution} · {c.clinician}</div>
              <p className="c04-body" style={{ fontSize: 14, marginTop: 14 }}>{c.headline}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 44, alignItems: "start" }}>
        <div>
          <SecHead label="Evidence supporting similarity" note="Each group assessed independently. A score describes similarity of recorded evidence — never the probability of a diagnosis." />
          {matchEvidence.map((e, i) => (
            <div key={e.id} className="c04-ev-row ody-fadein" style={stagger(i, 55, 100)}>
              <span className="c04-ev-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={{ fontSize: 16.5 }}>{e.label}</div>
                <span className="c04-tag" data-tone={e.direction === "divergent" ? "gold" : undefined} style={{ marginTop: 9 }}>
                  {e.direction === "divergent" ? "Divergent" : e.weight}
                </span>
              </div>
              <div>
                <div className="c04-body" style={{ fontSize: 14.5 }}>{e.summary}</div>
                <div style={{ display: "flex", gap: 24, marginTop: 10, flexWrap: "wrap" }}>
                  <span className="c04-num c04-small">{caseKZ.id} · {e.kzValue}</span>
                  <span className="c04-num c04-small" style={{ color: "var(--burgundy)" }}>{caseDE.id} · {e.deValue}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="c04-num" style={{ fontSize: 28, fontFamily: "var(--font-serif)", color: e.direction === "divergent" ? "var(--gold)" : "var(--ink)" }}>{e.score}</div>
                <div className="c04-bar" style={{ marginTop: 8 }}>
                  <i className="ody-growx" style={{ width: `${e.score}%`, background: e.direction === "divergent" ? "var(--gold)" : "var(--burgundy)", ...stagger(i, 55, 180) }} />
                </div>
              </div>
            </div>
          ))}

          <div className="c04-sec">
            <SecHead label="Where the records diverge" note="Divergence is recorded, not hidden" />
            {match.divergenceNotes.map((d, i) => (
              <p key={i} className="c04-body" style={{ fontSize: 15, paddingLeft: 20, borderLeft: "2px solid var(--gold)", marginBottom: 18 }}>{d}</p>
            ))}
          </div>
        </div>

        <aside style={{ display: "grid", gap: 26 }}>
          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Provenance of this correspondence</h3></div>
            <div className="c04-leaf-b">
              {match.reasoningSteps.map((s, i) => (
                <div key={s.id} className="ody-fadein" style={{ padding: "12px 0", borderBottom: i < 4 ? "1px dotted var(--line-strong)" : undefined, ...stagger(i, 80, 200) }}>
                  <div className="c04-label" style={{ color: "var(--burgundy)" }}>Step {String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontSize: 14.5, marginTop: 5 }}>{s.label}</div>
                  <div className="c04-small" style={{ marginTop: 4 }}>{s.detail}</div>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
                {[[match.cohortsQueried.toLocaleString(), "Cohorts queried"], [String(match.countriesQueried), "Countries"], [match.candidatesScreened.toLocaleString(), "Records screened"], [String(match.candidatesReturned), "Candidates returned"]].map(([v, l], i) => (
                  <div key={l}>
                    <div className="c04-num" style={{ fontSize: 19, fontFamily: "var(--font-serif)", color: i === 3 ? "var(--burgundy)" : undefined }}>{v}</div>
                    <div className="c04-small" style={{ marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="c04-leaf" style={{ borderColor: "var(--burgundy)" }}>
            <div className="c04-leaf-b">
              <div className="c04-eyebrow">Proposed next</div>
              <p className="c04-body" style={{ marginTop: 10 }}>{match.proposedAction}.</p>
              <ol style={{ margin: "14px 0 0", paddingLeft: 20, fontSize: 14, lineHeight: 1.75, color: "var(--ink-2)" }}>
                {match.nextSteps.map((n) => <li key={n} style={{ marginBottom: 6 }}>{n}</li>)}
              </ol>
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <button className="c04-btn">Request collaboration</button>
                <button className="c04-btn" data-variant="ghost">Not a match</button>
              </div>
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Other candidates</h3><span className="c04-small">Same query</span></div>
            <div className="c04-leaf-b">
              {otherCandidates.map((o, i) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: i < 2 ? "1px dotted var(--line-strong)" : undefined }}>
                  <div>
                    <div className="c04-num" style={{ fontSize: 13 }}>{o.id} · {o.country}</div>
                    <div className="c04-small" style={{ marginTop: 3 }}>{o.note}</div>
                  </div>
                  <span className="c04-num" style={{ fontSize: 18, fontFamily: "var(--font-serif)", color: "var(--ink-3)" }}>{o.score}</span>
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
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }}>
        <div>
          <div className="c04-eyebrow">Concordance table · {match.id}</div>
          <h2 className="c04-h1" style={{ marginTop: 16 }}>Kazakhstan &amp; Germany</h2>
          <p className="c04-lede" style={{ marginTop: 18 }}>
            Every recorded signal, set side by side. What is absent from a record is shown as deliberately as what is
            present.
          </p>
        </div>
        <Disclaimer />
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 30 }}>
        <div className="ody-rise">
          <div className="c04-label">Phenotype overlap</div>
          <svg viewBox="0 0 160 92" style={{ width: "100%", maxWidth: 250, marginTop: 14 }} aria-hidden>
            <circle className="ody-nodein" cx="60" cy="46" r="38" fill="var(--ink)" fillOpacity="0.05" stroke="var(--ink-3)" strokeWidth="0.8" />
            <circle className="ody-nodein" style={{ "--d": "180ms" } as React.CSSProperties} cx="100" cy="46" r="38" fill="var(--burgundy)" fillOpacity="0.08" stroke="var(--burgundy)" strokeWidth="0.8" />
            <text x="34" y="51" textAnchor="middle" fontSize="14" fontFamily="var(--font-serif)" fill="var(--ink-2)">{phenotypeOverlap.onlyKZ}</text>
            <text x="80" y="52" textAnchor="middle" fontSize="21" fontFamily="var(--font-serif)" fill="var(--ink)">{phenotypeOverlap.shared}</text>
            <text x="126" y="51" textAnchor="middle" fontSize="14" fontFamily="var(--font-serif)" fill="var(--burgundy)">{phenotypeOverlap.onlyDE}</text>
          </svg>
          <p className="c04-small" style={{ marginTop: 12 }}>Seven shared terms — individually common, rare in combination.</p>
        </div>
        <div className="ody-rise" style={stagger(1, 110)}>
          <div className="c04-label">Clinical trajectory · months</div>
          <div style={{ marginTop: 14, color: "var(--ink-3)", "--track-a": "var(--ink)", "--track-b": "var(--burgundy)" } as React.CSSProperties}>
            <TrajectoryChart milestones={trajectory.milestones} a={trajectory.kz} b={trajectory.de} max={trajectory.maxMonths} labelA="001" labelB="742" height={126} rowLabels />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            <span className="c04-small">● {caseKZ.id}</span>
            <span className="c04-small" style={{ color: "var(--burgundy)" }}>● {caseDE.id}</span>
          </div>
        </div>
        <div className="ody-rise" style={stagger(2, 110)}>
          <div className="c04-label">Family pattern</div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ color: "var(--ink-2)" }}><Pedigree consanguineous affected={[0, 2]} size={152} /></div>
            <div style={{ color: "var(--burgundy)" }}><Pedigree consanguineous={false} affected={[1]} size={152} /></div>
          </div>
        </div>
      </section>

      <section className="c04-sec">
        <div className="c04-leaf">
          <div className="c04-cmp" style={{ borderBottom: "1px solid var(--line-strong)", background: "var(--paper-2)" }}>
            <span className="c04-label">Signal</span>
            <span className="c04-label">{caseKZ.id} · Kazakhstan</span>
            <span className="c04-label" style={{ color: "var(--burgundy)" }}>{caseDE.id} · Germany</span>
            <span className="c04-label" style={{ textAlign: "right" }}>Agreement</span>
          </div>
          {comparisonGroups.map((g, gi) => (
            <div key={g.group}>
              <div style={{ padding: "16px 20px 8px", borderBottom: "1px solid var(--line)" }}>
                <span className="c04-eyebrow">{g.group}</span>
              </div>
              {g.rows.map((r, i) => (
                <div key={r.label} className="c04-cmp ody-fadein" style={stagger(i, 22, gi * 45)}>
                  <span style={{ color: "var(--ink-3)" }}>{r.label}</span>
                  <span style={{ color: "var(--ink)" }}>{r.kz}</span>
                  <span style={{ color: r.agreement === "only-de" ? "var(--burgundy)" : "var(--ink)" }}>{r.de}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="c04-tag" data-tone={r.agreement === "match" ? "green" : r.agreement === "differ" ? "gold" : r.agreement.startsWith("only") ? "burgundy" : undefined} style={{ fontSize: 9 }}>{LABEL[r.agreement]}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="c04-sec" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
        <p className="c04-body" style={{ maxWidth: "64ch", margin: 0, fontSize: 16 }}>
          <b style={{ color: "var(--burgundy)" }}>Requires clinician review.</b> This concordance describes similarity
          between two records. It does not establish a diagnosis for either patient.
        </p>
        <button className="c04-btn">Open consultation</button>
      </section>
    </>
  );
}

/* ------------------------------ ROOM ------------------------------ */

function Room() {
  const s = collaboration.status;
  return (
    <>
      <section className="ody-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 48, alignItems: "end" }}>
        <div>
          <div className="c04-eyebrow">Consultation · {collaboration.roomId}</div>
          <h2 className="c04-h1" style={{ marginTop: 16 }}>{collaboration.title}</h2>
          <p className="c04-lede" style={{ marginTop: 18 }}>
            A written correspondence between two clinicians, kept as part of the record. {collaboration.security}.
          </p>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <Disclaimer />
          {collaboration.participants.map((p) => (
            <div key={p.networkId} style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontSize: 17 }}>{p.name}</span>
                <span className="c04-label">{p.countryCode}</span>
              </div>
              <div className="c04-small" style={{ marginTop: 4 }}>{p.role} · {p.institution}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c04-sec">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.stages.length}, 1fr)`, borderTop: "2px solid var(--ink)" }}>
          {s.stages.map((st, i) => (
            <div key={st} className="ody-fadein" style={{ padding: "14px 18px 16px 0", borderRight: i < s.stages.length - 1 ? "1px solid var(--line)" : undefined, ...stagger(i, 90) }}>
              <div className="c04-label" style={{ color: i <= s.stageIndex ? "var(--burgundy)" : "var(--ink-4)" }}>Stage {String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 15, marginTop: 6, color: i <= s.stageIndex ? "var(--ink)" : "var(--ink-4)" }}>{st}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c04-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 44, alignItems: "start" }}>
        <div>
          <SecHead label="Clinical discussion" note="Immutable. No identifiable patient data is exchanged." />
          {collaboration.messages.map((m, i) => (
            <div key={m.id} className="c04-msg ody-rise" data-side={m.author} style={stagger(i, 65, 80)}>
              {m.author !== "system" ? (
                <div>
                  <div style={{ fontSize: 16 }}>{m.name}</div>
                  <div className="c04-small" style={{ marginTop: 4 }}>{m.role}</div>
                  <div className="c04-prov">{m.time} ago</div>
                </div>
              ) : (
                <div className="c04-eyebrow">Record entry · {m.time} ago</div>
              )}
              <div>
                {m.kind === "proposal" && <span className="c04-tag" data-tone="burgundy" style={{ marginBottom: 12 }}>Proposal</span>}
                <p style={{ fontSize: m.author === "system" ? 14.5 : 16.5, lineHeight: 1.72, margin: 0, color: m.author === "system" ? "var(--ink-2)" : "var(--ink)" }}>{m.body}</p>
                {m.attachment && (
                  <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--paper-2)", border: "1px solid var(--line)" }}>
                    <div className="c04-num" style={{ fontSize: 12.5 }}>{m.attachment.label}</div>
                    <div className="c04-small" style={{ marginTop: 3 }}>{m.attachment.meta}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, marginTop: 22, alignItems: "center" }}>
            <div className="c04-input" style={{ flex: 1, color: "var(--ink-4)" }}>Write a clinical note…</div>
            <button className="c04-btn">Send</button>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 26 }}>
          <div className="c04-leaf" style={{ borderColor: "var(--burgundy)" }}>
            <div className="c04-leaf-h"><h3 className="c04-h3">Verification status</h3><span className="c04-tag" data-tone="gold">1 of 2</span></div>
            <div className="c04-leaf-b">
              <div style={{ paddingBottom: 14, borderBottom: "1px dotted var(--line-strong)" }}>
                <div style={{ fontSize: 15 }}>✓ {s.verificationA}</div>
                <div className="c04-small" style={{ marginTop: 4 }}>Evidence supports a clinically meaningful similarity</div>
              </div>
              <div style={{ paddingTop: 14 }}>
                <div style={{ fontSize: 15, color: "var(--ink-3)" }}>○ {s.verificationB}</div>
                <div className="c04-small" style={{ marginTop: 4 }}>Awaiting second clinician</div>
              </div>
              <p className="c04-small" style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                A connection enters the permanent record only when two independent clinicians verify it.
              </p>
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Shared evidence</h3><span className="c04-small">{collaboration.documents.length} items</span></div>
            <div className="c04-leaf-b">
              {collaboration.documents.map((d, i) => (
                <div key={d.label} style={{ padding: "11px 0", borderBottom: i < collaboration.documents.length - 1 ? "1px dotted var(--line-strong)" : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span className="c04-num" style={{ fontSize: 12.5 }}>{d.label}</span>
                    <span className="c04-tag" style={{ fontSize: 9 }}>{d.kind}</span>
                  </div>
                  <div className="c04-prov">{d.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="c04-leaf">
            <div className="c04-leaf-h"><h3 className="c04-h3">Decision log</h3><span className="c04-small">Immutable</span></div>
            <div className="c04-leaf-b">
              <div className="c04-tl">
                {collaboration.decisionLog.map((d) => (
                  <div key={d.id} className="c04-tl-item" data-kind={d.state === "done" ? "treatment" : "stable"} style={{ paddingBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 14, color: d.state === "blocked" ? "var(--ink-4)" : "var(--ink)" }}>{d.action}</span>
                      <span className="c04-small">{d.time}</span>
                    </div>
                    <div className="c04-small" style={{ marginTop: 2 }}>{d.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
