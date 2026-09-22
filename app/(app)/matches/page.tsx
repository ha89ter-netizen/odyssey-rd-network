"use client";

import * as React from "react";
import Link from "next/link";
import { useStore, selectMatchesOf, selectCasesOf } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, SectionHead, Disclaimer, relTime } from "@/ui/primitives";
import { FindMatches } from "@/components/FindMatches";

export default function MatchesPage() {
  const { state } = useStore();
  const me = state.currentDoctorId!;
  const matches = selectMatchesOf(state, me);
  const cases = selectCasesOf(state, me);
  const unsearched = cases.filter((c) => !state.searched.includes(c.id) && c.status !== "Clinically Corroborated");

  const incoming = matches.filter((m) => m.status === "requested" && state.cases[m.targetCaseId]?.ownerId === me);
  const others = matches.filter((m) => !incoming.includes(m));

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">Potential matches</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Matches</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            Every candidate the network has surfaced for your cases. A score expresses similarity of recorded evidence
            — never a diagnosis.
          </p>
        </div>
        <Disclaimer />
      </header>

      {incoming.length > 0 && (
        <div className="og-sec">
          <SectionHead label="Requests awaiting your response" note="Another clinician wants to open a secure channel about one of your cases." />
          <Panel glass padded={false}>
            {incoming.map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>
                    {m.sourceCaseId} ↔ {m.targetCaseId}
                  </span>
                  <span className="og-small">
                    From {state.doctors[state.cases[m.sourceCaseId].ownerId].name}, {state.cases[m.sourceCaseId].country}
                  </span>
                </span>
                <Pill tone="amber">Awaiting you</Pill>
                <span className="og-num" style={{ fontSize: 19, color: "var(--teal-deep)" }}>{m.score}</span>
              </Link>
            ))}
          </Panel>
        </div>
      )}

      <div className="og-sec">
        <SectionHead label="All matches" note={`${others.length} in your register`} />
        <Panel padded={false}>
          {others.length === 0 ? (
            <Empty
              title="No matches yet"
              body="Open a case and run a network search. Candidates below the review threshold are never shown."
              icon="◎"
              action={<Link href="/cases"><Button>Go to cases</Button></Link>}
            />
          ) : others.map((m) => {
            const src = state.cases[m.sourceCaseId];
            const tgt = state.cases[m.targetCaseId];
            return (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "150px 1fr 150px 110px 70px" }}>
                <span className="og-mono" style={{ fontSize: 12.5 }}>{src.id} ↔ {tgt.id}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13 }}>{tgt.headline}</span>
                  <span className="og-small">{src.country} → {tgt.country} · surfaced {relTime(m.createdAt, state.clock)}</span>
                </span>
                <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : m.status === "requested" ? "amber" : undefined}>
                  {m.status === "surfaced" ? m.label : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                </Pill>
                <ScoreBar value={m.score} />
                <span className="og-num" style={{ fontSize: 19, textAlign: "right", color: "var(--teal-deep)" }}>{m.score}</span>
              </Link>
            );
          })}
        </Panel>
      </div>

      {unsearched.length > 0 && (
        <div className="og-sec">
          <SectionHead label="Cases not yet searched" note="These have never been compared against the network." />
          <Panel padded={false}>
            {unsearched.slice(0, 6).map((c) => (
              <div key={c.id} className="og-listrow" style={{ gridTemplateColumns: "100px 1fr auto" }}>
                <Link href={`/cases/${c.id}`} className="og-mono og-link" style={{ fontSize: 12.5 }}>{c.id}</Link>
                <span className="og-small">{c.headline}</span>
                <FindMatches record={c} label="Search" variant="ghost" />
              </div>
            ))}
          </Panel>
        </div>
      )}
    </>
  );
}
