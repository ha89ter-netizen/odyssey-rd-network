"use client";

import * as React from "react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Pill, Tabs, SectionHead, Disclaimer, Metric, Empty, absTime, relTime, Banner } from "@/ui/primitives";

type Tab = "overview" | "cases" | "matches" | "queue" | "contributions" | "audit";

const ACTION_LABEL: Record<string, string> = {
  "case.created": "Case created",
  "document.uploaded": "Document uploaded",
  "extraction.completed": "AI extraction completed",
  "phenotype.verified": "Phenotype verified",
  "phenotype.rejected": "Phenotype rejected",
  "match.generated": "Match generated",
  "connection.requested": "Connection requested",
  "connection.accepted": "Connection accepted",
  "connection.declined": "Connection declined",
  "verification.completed": "Clinical verification completed",
  "contribution.recorded": "Knowledge contribution recorded",
  "session.started": "Session started",
};

export default function AdminPage() {
  const { state } = useStore();
  const [tab, setTab] = React.useState<Tab>("overview");

  const cases = Object.values(state.cases);
  const matches = Object.values(state.matches);
  const queue = [
    ...matches.filter((m) => m.status === "requested").map((m) => ({ id: m.id, what: `Connection request — ${m.sourceCaseId} ↔ ${m.targetCaseId}`, who: state.doctors[state.cases[m.targetCaseId].ownerId].name, state: "Awaiting response" })),
    ...Object.values(state.collaborations).flatMap((c) =>
      [c.doctorAId, c.doctorBId]
        .filter((d) => !c.verifications.some((v) => v.by === d))
        .map((d) => ({ id: c.id + d, what: `Clinical verification — ${c.caseAId} ↔ ${c.caseBId}`, who: state.doctors[d].name, state: "Awaiting verification" })),
    ),
  ];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">Network operations</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Admin &amp; audit</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            A read-only view of the demonstration state. Every action in the product writes an audit event.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "cases", label: `Cases (${cases.length})` },
            { id: "matches", label: `Matches (${matches.length})` },
            { id: "queue", label: `Verification queue (${queue.length})` },
            { id: "contributions", label: `Contributions (${state.contributions.length})` },
            { id: "audit", label: `Audit (${state.audit.length})` },
          ]}
          value={tab}
          onChange={setTab}
        />
        <Panel style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} padded={tab === "overview"}>
          {tab === "overview" && (
            <div className="og-stack">
              <div className="og-grid" data-cols="auto">
                <Metric label="Clinicians" value={Object.keys(state.doctors).length} detail="Demo personas" />
                <Metric label="Cases" value={cases.length} detail={`${cases.filter((c) => c.status === "Unresolved").length} unresolved`} />
                <Metric label="Matches" value={matches.length} tone="teal" detail={`${matches.filter((m) => m.status === "verified").length} verified`} />
                <Metric label="Audit events" value={state.audit.length} detail="Immutable trail" />
              </div>
              <Banner tone="plain">
                This is a lightweight prototype view. A production system would sit behind role-based access control,
                with an append-only audit store and institutional data-governance controls.
              </Banner>
              <div>
                <SectionHead label="Users" />
                <table className="og-table">
                  <thead><tr><th>Clinician</th><th>Role</th><th>Institution</th><th style={{ width: 90 }}>Country</th><th style={{ width: 130 }}>Network ID</th></tr></thead>
                  <tbody>
                    {Object.values(state.doctors).map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 600 }}>{d.name}</td>
                        <td className="og-small">{d.role}</td>
                        <td className="og-small">{d.institution}</td>
                        <td><Pill>{d.countryCode}</Pill></td>
                        <td className="og-mono og-small">{d.networkId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "cases" && (
            <table className="og-table">
              <thead><tr><th style={{ width: 92 }}>Case</th><th>Presentation</th><th style={{ width: 120 }}>Owner</th><th style={{ width: 110 }}>Country</th><th style={{ width: 160 }}>Status</th></tr></thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td><Link href={`/cases/${c.id}`} className="og-mono og-link">{c.id}</Link></td>
                    <td className="og-small">{c.headline}</td>
                    <td className="og-small">{state.doctors[c.ownerId].name}</td>
                    <td className="og-small">{c.country}</td>
                    <td><Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : undefined}>{c.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "matches" && (
            matches.length === 0 ? <Empty title="No matches generated" body="Run a network search from a case to populate this table." icon="◎" /> : (
              <table className="og-table">
                <thead><tr><th style={{ width: 170 }}>Pair</th><th style={{ width: 70 }}>Score</th><th>Label</th><th style={{ width: 120 }}>Status</th><th style={{ width: 120 }}>Created</th></tr></thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td><Link href={`/matches/${m.id}`} className="og-mono og-link">{m.sourceCaseId} ↔ {m.targetCaseId}</Link></td>
                      <td className="og-mono" style={{ color: "var(--teal-deep)" }}>{m.score}</td>
                      <td className="og-small">{m.label}</td>
                      <td><Pill tone={m.status === "verified" ? "teal" : undefined}>{m.status}</Pill></td>
                      <td className="og-mono og-small">{relTime(m.createdAt, state.clock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "queue" && (
            queue.length === 0 ? <Empty title="Queue is empty" body="Nothing is awaiting a clinician response or verification." icon="✓" /> : (
              <table className="og-table">
                <thead><tr><th>Item</th><th style={{ width: 200 }}>Assigned to</th><th style={{ width: 180 }}>State</th></tr></thead>
                <tbody>
                  {queue.map((q) => (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 600 }}>{q.what}</td>
                      <td className="og-small">{q.who}</td>
                      <td><Pill tone="amber">{q.state}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "contributions" && (
            state.contributions.length === 0 ? <Empty title="No contributions" body="Contributions are recorded when two clinicians verify a connection." icon="◆" /> : (
              <table className="og-table">
                <thead><tr><th>Contribution</th><th style={{ width: 170 }}>Cases</th><th style={{ width: 220 }}>Contributors</th><th style={{ width: 150 }}>Recorded</th></tr></thead>
                <tbody>
                  {state.contributions.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td className="og-mono og-small">{c.caseIds.join(" ↔ ")}</td>
                      <td className="og-small">{c.contributors.join(", ")}</td>
                      <td className="og-mono og-small">{absTime(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "audit" && (
            <table className="og-table">
              <thead><tr><th style={{ width: 210 }}>Action</th><th style={{ width: 150 }}>Actor</th><th style={{ width: 160 }}>Subject</th><th>Detail</th><th style={{ width: 160 }}>Timestamp</th></tr></thead>
              <tbody>
                {state.audit.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{ACTION_LABEL[e.action] ?? e.action}</td>
                    <td className="og-small">{e.actorId === "system" ? "System" : state.doctors[e.actorId]?.name}</td>
                    <td className="og-mono og-small">{e.subject}</td>
                    <td className="og-small">{e.detail}</td>
                    <td className="og-mono og-small">{absTime(e.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </>
  );
}
