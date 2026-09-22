"use client";

import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer, Metric, Banner, absTime, relTime } from "@/ui/primitives";

export default function KnowledgePage() {
  const { state } = useStore();
  const contributions = state.contributions;
  const verifiedMatches = Object.values(state.matches).filter((m) => m.status === "verified");
  const corroborated = Object.values(state.cases).filter((c) => c.status === "Clinically Corroborated").length;

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">Network knowledge</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Knowledge contributions</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            What two clinicians verified together becomes part of the network record. Not a diagnosis — a documented,
            corroborated relationship between cases.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric label="Verified contributions" value={contributions.length} tone="teal" detail="Corroborated by two clinicians each" />
        <Metric label="Confirmed connections" value={verifiedMatches.length} detail="Case pairs held as related" />
        <Metric label="Corroborated cases" value={corroborated} detail="No longer standing alone in the network" />
        <Metric label="Contributing clinicians" value={new Set(contributions.flatMap((c) => c.contributors)).size} detail="Across member institutions" />
      </div>

      {contributions.length === 0 ? (
        <div className="og-sec">
          <Panel glass>
            <Empty
              title="No contributions recorded yet"
              body="A contribution is created automatically when two clinicians independently verify that a case connection is clinically relevant."
              icon="◆"
              action={<Link href="/matches"><Button>Review potential matches</Button></Link>}
            />
          </Panel>
        </div>
      ) : (
        <>
          <div className="og-sec">
            <SectionHead label="How knowledge compounds" note="Each verified connection makes the next case easier to place." />
            <Panel glass>
              <div className="og-row" style={{ justifyContent: "center", gap: 0, flexWrap: "wrap", padding: "10px 0" }}>
                {[
                  { t: contributions[0].caseIds[0], s: "Unresolved case" },
                  { t: "+", s: "" },
                  { t: contributions[0].caseIds[1], s: "Network case" },
                  { t: "↓", s: "" },
                  { t: "Verified pattern", s: contributions[0].evidence },
                  { t: "↓", s: "" },
                  { t: "Network knowledge", s: "Available to future queries" },
                ].map((n, i) => (
                  n.t === "+" || n.t === "↓" ? (
                    <span key={i} className="og-num ody-fadein" style={{ fontSize: 20, color: "var(--ink-4)", padding: "0 18px", "--d": `${i * 90}ms` } as React.CSSProperties}>
                      {n.t === "↓" ? "→" : n.t}
                    </span>
                  ) : (
                    <div key={i} className="og-flat ody-rise" style={{ padding: "14px 18px", minWidth: 150, textAlign: "center", "--d": `${i * 90}ms` } as React.CSSProperties}>
                      <div className="og-mono" style={{ fontSize: 13, fontWeight: 700, color: i >= 4 ? "var(--teal-deep)" : "var(--ink)" }}>{n.t}</div>
                      {n.s && <div className="og-small" style={{ marginTop: 5 }}>{n.s}</div>}
                    </div>
                  )
                ))}
              </div>
              <p className="og-small" style={{ textAlign: "center", marginTop: 14, maxWidth: "64ch", marginInline: "auto" }}>
                This verified pattern may help surface future relevant cases. It is a prototype representation of the
                network-learning idea — it does not claim to improve diagnostic accuracy.
              </p>
            </Panel>
          </div>

          <div className="og-sec">
            <SectionHead label="Contributions" note={`${contributions.length} recorded`} />
            <div className="og-stack">
              {contributions.map((c) => (
                <Panel key={c.id} title={c.title} action={<Pill tone="teal">✓ {c.status}</Pill>}>
                  <div className="og-grid" data-cols="side">
                    <div>
                      <dl className="og-kv">
                        <dt>Cases</dt>
                        <dd>
                          {c.caseIds.map((cid, i) => (
                            <span key={cid}>
                              <Link href={`/cases/${cid}`} className="og-link og-mono">{cid}</Link>
                              {i < c.caseIds.length - 1 && <span style={{ color: "var(--ink-4)" }}> ↔ </span>}
                            </span>
                          ))}
                        </dd>
                        <dt>Contributors</dt><dd>{c.contributors.join(" · ")}</dd>
                        <dt>Evidence</dt><dd>{c.evidence}</dd>
                        <dt>Recorded</dt><dd className="og-mono">{absTime(c.createdAt)} <span className="og-small">({relTime(c.createdAt, state.clock)})</span></dd>
                      </dl>
                    </div>
                    <div>
                      <div className="og-eyebrow">What was established</div>
                      <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.75, color: "var(--ink-2)" }}>
                        {c.detail.map((d, i) => <li key={i} style={{ marginBottom: 5 }}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="og-sec">
        <Banner tone="amber">
          <b>Clinically corroborated does not mean diagnosed.</b> It records that two independent clinicians reviewed
          the evidence and agreed the connection between the cases is real and worth keeping.
        </Banner>
      </div>
    </>
  );
}
