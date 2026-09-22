"use client";

import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Pill, SectionHead, Disclaimer, Metric, Banner } from "@/ui/primitives";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges, PRODUCT } from "@/data/odyssey";

export default function NetworkPage() {
  const { state } = useStore();
  const cases = Object.values(state.cases);
  const countries = new Set(cases.map((c) => c.country));
  const institutions = new Set(cases.map((c) => c.institution));
  const matches = Object.values(state.matches).filter((m) => m.status !== "dismissed");
  const verified = matches.filter((m) => m.status === "verified");

  const byCountry = [...countries].map((country) => ({
    country,
    cases: cases.filter((c) => c.country === country).length,
    corroborated: cases.filter((c) => c.country === country && c.status === "Clinically Corroborated").length,
  })).sort((a, b) => b.cases - a.cases);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">The network</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Network</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {PRODUCT.principle} Institutions hold their own records; only structured signals are ever compared.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric label="Cases in the network" value={cases.length} detail="Structured, comparable records" />
        <Metric label="Institutions" value={institutions.size} detail="Holding their own source data" />
        <Metric label="Countries" value={countries.size} detail="Cross-border comparison enabled" />
        <Metric label="Verified connections" value={verified.length} tone="teal" detail="Corroborated by two clinicians" />
      </div>

      <div className="og-sec">
        <Panel glass padded={false}>
          <div style={{ padding: "18px 20px 0" }}>
            <div className="og-between">
              <div>
                <div className="og-eyebrow">Live connection</div>
                <div style={{ fontSize: 16, marginTop: 6 }}>
                  Every node is a member institution. Highlighted nodes are the two sides of the demonstration case pair.
                </div>
              </div>
              <div className="og-row">
                <span className="og-small">● Member institution</span>
                <span className="og-small" style={{ color: "var(--teal-deep)" }}>● Demonstration pair</span>
              </div>
            </div>
          </div>
          <WorldMap
            nodes={networkNodes} edges={networkEdges} variant="both"
            highlight={["kz", "de"]} labels={["kz", "de", "us", "jp", "br", "au", "za", "in"]}
            crop="0 3 100 37" nodeScale={0.85} labelSize={1.15}
            className="w-full"
          />
        </Panel>
      </div>

      <div className="og-sec og-grid" data-cols="side">
        <div>
          <SectionHead label="Cases by country" note="Derived from the records in this demonstration" />
          <Panel padded={false}>
            {byCountry.map((r) => (
              <div key={r.country} className="og-listrow" style={{ gridTemplateColumns: "1fr 120px 130px" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{r.country}</span>
                <span className="og-small">{r.cases} case{r.cases === 1 ? "" : "s"}</span>
                <Pill tone={r.corroborated ? "teal" : undefined}>{r.corroborated} corroborated</Pill>
              </div>
            ))}
          </Panel>

          <div className="og-sec">
            <SectionHead label="Connections" note="Case pairs the network is holding" />
            <Panel padded={false}>
              {matches.length === 0 ? (
                <div style={{ padding: 20 }}><p className="og-small" style={{ margin: 0 }}>No connections yet. Run a network search from a case.</p></div>
              ) : matches.map((m) => (
                <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr 140px 80px" }}>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>{m.sourceCaseId} ↔ {m.targetCaseId}</span>
                    <span className="og-small">{state.cases[m.sourceCaseId]?.country} → {state.cases[m.targetCaseId]?.country}</span>
                  </span>
                  <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : undefined}>{m.status}</Pill>
                  <span className="og-num" style={{ fontSize: 17, textAlign: "right", color: "var(--teal-deep)" }}>{m.score}</span>
                </Link>
              ))}
            </Panel>
          </div>
        </div>

        <div className="og-stack">
          <Panel title="Member institutions" meta={`${networkNodes.length} shown`} padded={false}>
            {networkNodes.slice(0, 10).map((n) => (
              <div key={n.id} className="og-listrow" style={{ gridTemplateColumns: "34px 1fr auto" }}>
                <span className="og-mono og-small" style={{ border: "1px solid var(--line)", borderRadius: 4, textAlign: "center", padding: "2px 0" }}>{n.code}</span>
                <span>
                  <span style={{ display: "block", fontSize: 12.5 }}>{n.label}, {n.country}</span>
                  <span className="og-small">{n.tier === "primary" ? "Primary node" : n.tier === "member" ? "Member" : "Observer"}</span>
                </span>
                <span className="og-mono og-small">{n.cases.toLocaleString()}</span>
              </div>
            ))}
          </Panel>
          <Banner>
            <b>Federated by design.</b> A query is evaluated where the data lives. Institutions return a similarity
            assessment, never a patient record.
          </Banner>
        </div>
      </div>
    </>
  );
}
