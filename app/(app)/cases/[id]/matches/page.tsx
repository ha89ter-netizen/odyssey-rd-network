"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, Banner, Disclaimer, SectionHead, relTime } from "@/ui/primitives";
import { FindMatches } from "@/components/FindMatches";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges } from "@/data/odyssey";
import { SURFACE_THRESHOLD } from "@/store/matching";

export default function CaseMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const c = state.cases[id];

  if (!c) return <Empty title="Case not found" body={`No case with reference ${id}.`} action={<Link href="/cases"><Button>Back to cases</Button></Link>} />;

  const results = Object.values(state.matches)
    .filter((m) => m.sourceCaseId === c.id && m.status !== "dismissed")
    .sort((a, b) => b.score - a.score);
  const searched = state.searched.includes(c.id);
  const cohorts = Object.keys(state.cases).length;

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "64ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/cases" className="og-small og-link">Cases</Link>
            <span className="og-small" aria-hidden>/</span>
            <Link href={`/cases/${c.id}`} className="og-small og-link og-mono">{c.id}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">Network search</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Network search results</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {c.id} was compared against {cohorts - 1} other records held across member institutions.
            Candidates below the review threshold of {SURFACE_THRESHOLD} are not surfaced.
          </p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          <FindMatches record={c} label="Re-run search" variant="ghost" />
        </div>
      </header>

      {!searched ? (
        <div className="og-sec">
          <Panel glass>
            <Empty
              title="This case has not been searched yet"
              body="Run a federated query to compare it against every other record in the network."
              icon="◎"
              action={<FindMatches record={c} label="Find matches" />}
            />
          </Panel>
        </div>
      ) : results.length === 0 ? (
        /* ------------------------- no-match state ------------------------- */
        <div className="og-sec og-grid" data-cols="side">
          <Panel glass>
            <div className="og-empty" style={{ paddingTop: 30 }}>
              <div className="og-empty-icon" style={{ background: "rgba(192,138,46,0.12)", color: "var(--amber)", fontSize: 20 }}>◌</div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>No strong match found yet</div>
              <p className="og-small" style={{ maxWidth: "56ch", margin: "12px auto 0" }}>
                Every record in the network was evaluated. Nothing reached the review threshold, so nothing is being
                put in front of you — a weak signal is worse than none.
              </p>
              <p className="og-lede" style={{ maxWidth: "58ch", margin: "20px auto 0", fontSize: 14.5 }}>
                Your case remains in the network and can be re-evaluated when new relevant evidence or cases become
                available.
              </p>
              <div className="og-row" style={{ justifyContent: "center", marginTop: 22 }}>
                <Link href={`/cases/${c.id}/verify`}><Button variant="ghost">Add more evidence</Button></Link>
                <FindMatches record={c} label="Search again" variant="ghost" />
              </div>
            </div>
          </Panel>
          <div className="og-stack">
            <Panel title="What would improve the odds">
              <div className="og-stack">
                {c.completeness.filter((b) => b.value < 70).slice(0, 4).map((b) => (
                  <div key={b.label}>
                    <div className="og-between" style={{ fontSize: 12.5 }}>
                      <span>{b.label}</span><span className="og-mono og-small">{b.value}%</span>
                    </div>
                    <ScoreBar value={b.value} />
                  </div>
                ))}
                {c.completeness.every((b) => b.value >= 70) && (
                  <p className="og-small" style={{ margin: 0 }}>This case is already well structured — the network simply does not hold a comparable record yet.</p>
                )}
              </div>
              <p className="og-small" style={{ marginTop: 14 }}>
                Completeness is the main lever you control. Negative evidence — what has been ruled out — is often the
                cheapest way to make a case more comparable.
              </p>
            </Panel>
            <Panel title="Standing query">
              <p className="og-small" style={{ marginTop: 0 }}>
                {c.id} stays indexed. When a new case is submitted anywhere in the network, it is scored against yours
                automatically, and you are notified if it clears the threshold.
              </p>
            </Panel>
          </div>
        </div>
      ) : (
        /* ------------------------- results ------------------------- */
        <>
          <div className="og-sec">
            <Banner>
              <b>{results.length} candidate{results.length === 1 ? "" : "s"} above the review threshold.</b>{" "}
              Scores express similarity of recorded evidence between two cases. They are not diagnostic probabilities
              and require clinician review.
            </Banner>
          </div>

          {results[0] && (
            <div className="og-sec">
              <SectionHead label="Top candidate" note="Ranked highest across the weighted evidence groups." />
              <Panel glass padded={false}>
                <div className="og-grid" data-cols="side" style={{ gap: 0 }}>
                  <div style={{ padding: "24px 26px" }}>
                    <div className="og-row" style={{ gap: 10 }}>
                      <Pill tone="teal">{results[0].label}</Pill>
                      <span className="og-small">surfaced {relTime(results[0].createdAt, state.clock)}</span>
                    </div>
                    <div className="og-row" style={{ gap: 18, marginTop: 18 }}>
                      <div>
                        <div className="og-num" style={{ fontSize: 28 }}>{c.id}</div>
                        <div className="og-small">{c.country}</div>
                      </div>
                      <svg width="70" height="16" viewBox="0 0 70 16" fill="none" aria-hidden>
                        <path className="ody-drawin" style={{ "--dash": 60, "--d": "300ms" } as React.CSSProperties} d="M2 8h56" stroke="var(--teal)" strokeWidth="1.4" strokeDasharray="60" />
                        <path d="M55 4l5 4-5 4" stroke="var(--teal)" strokeWidth="1.4" fill="none" />
                      </svg>
                      <div>
                        <div className="og-num" style={{ fontSize: 28, color: "var(--teal-deep)" }}>{results[0].targetCaseId}</div>
                        <div className="og-small">{state.cases[results[0].targetCaseId]?.country}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div className="og-num" style={{ fontSize: 40, color: "var(--teal-deep)" }}>{results[0].score}</div>
                        <div className="og-eyebrow">evidence similarity</div>
                      </div>
                    </div>
                    <p className="og-small" style={{ marginTop: 16 }}>{results[0].explanation[0]}</p>
                    <div className="og-row" style={{ marginTop: 20 }}>
                      <Link href={`/matches/${results[0].id}`}><Button>Why this match?</Button></Link>
                      <Link href={`/matches/${results[0].id}/compare`}><Button variant="ghost">Compare cases</Button></Link>
                    </div>
                  </div>
                  <div style={{ padding: 20, borderLeft: "1px solid var(--line)" }}>
                    <WorldMap
                      nodes={networkNodes} edges={networkEdges}
                      highlight={["kz", "de"]} labels={["kz", "de"]}
                      crop="2 2 82 30" className="w-full" labelSize={1.7}
                    />
                    <p className="og-small" style={{ marginTop: 10 }}>
                      No identifiable data crossed a border. Member institutions scored the case locally and returned
                      only a similarity assessment.
                    </p>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          <div className="og-sec">
            <SectionHead label="All candidates" note={`${results.length} above threshold`} />
            <Panel padded={false}>
              {results.map((m) => {
                const t = state.cases[m.targetCaseId];
                return (
                  <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "100px 1fr 130px 120px 90px" }}>
                    <span className="og-mono" style={{ fontSize: 12.5, color: "var(--teal-deep)" }}>{m.targetCaseId}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 13 }}>{t?.headline}</span>
                      <span className="og-small">{t?.country} · {t?.institution}</span>
                    </span>
                    <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : m.status === "requested" ? "amber" : undefined}>
                      {m.status === "surfaced" ? m.label : m.status}
                    </Pill>
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <ScoreBar value={m.score} />
                    </span>
                    <span className="og-num" style={{ fontSize: 20, textAlign: "right", color: "var(--teal-deep)" }}>{m.score}</span>
                  </Link>
                );
              })}
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
