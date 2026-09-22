"use client";

import * as React from "react";
import Link from "next/link";
import {
  useStore, selectCasesOf, selectUnresolved, selectOpenMatches, selectVerificationTasks,
  selectCollaborationsOf, selectNotificationsOf, completenessOverall,
} from "@/store/store";
import { Panel, SectionHead, Metric, Pill, Button, ScoreBar, Empty, relTime, Banner } from "@/ui/primitives";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges, PRODUCT } from "@/data/odyssey";

export default function DashboardPage() {
  const { state } = useStore();
  const id = state.currentDoctorId!;
  const doctor = state.doctors[id];

  const cases = selectCasesOf(state, id);
  const unresolved = selectUnresolved(state, id);
  const openMatches = selectOpenMatches(state, id);
  const tasks = selectVerificationTasks(state, id);
  const collabs = selectCollaborationsOf(state, id);
  const notifications = selectNotificationsOf(state, id).slice(0, 6);
  const now = state.clock;

  const recent = [...cases].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
  const pending = [
    ...openMatches.map((m) => ({
      key: m.id, href: `/matches/${m.id}`, label: `Review potential match — ${m.sourceCaseId} ↔ ${m.targetCaseId}`,
      meta: `${m.label} · similarity ${m.score}`, tone: "teal" as const,
    })),
    ...tasks.map((t) => ({ key: t.href + t.label, href: t.href, label: t.label, meta: t.kind === "request" ? "Awaiting your response" : "Awaiting your verification", tone: "amber" as const })),
  ];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div>
          <div className="og-eyebrow">{doctor.institution} · {doctor.city}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Good morning, {doctor.name}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {unresolved.length} of your cases are unresolved.{" "}
            {openMatches.length > 0
              ? `${openMatches.length} potential ${openMatches.length === 1 ? "match is" : "matches are"} waiting for your review.`
              : "Run a federated search on a case to look for related records across the network."}
          </p>
        </div>
        <Link href="/cases/new"><Button>+ New case</Button></Link>
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric href="/cases" label="Unresolved cases" value={unresolved.length} detail="No confirmed molecular or clinical diagnosis" />
        <Metric href="/matches" label="Potential matches" value={openMatches.length} tone="teal" detail="Awaiting your clinical review" />
        <Metric href="/matches" label="Verification requests" value={tasks.length} tone={tasks.length ? "amber" : undefined} detail="Colleagues requesting your assessment" />
        <Metric href="/collaboration" label="Active collaborations" value={collabs.length} detail="Secure cross-border rooms" />
      </div>

      {pending.length > 0 && (
        <section className="og-sec">
          <SectionHead label="Pending actions" note="Everything here is waiting on a decision from you." />
          <Panel glass padded={false}>
            {pending.map((p) => (
              <Link key={p.key} href={p.href} className="og-listrow" style={{ gridTemplateColumns: "10px 1fr auto" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: p.tone === "amber" ? "var(--amber)" : "var(--teal)" }} />
                <span>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{p.label}</span>
                  <span className="og-small">{p.meta}</span>
                </span>
                <span className="og-small" aria-hidden>→</span>
              </Link>
            ))}
          </Panel>
        </section>
      )}

      <div className="og-sec og-grid" data-cols="side">
        <section>
          <SectionHead
            label="Recent cases"
            note={`${cases.length} case${cases.length === 1 ? "" : "s"} in your care`}
            action={<Link href="/cases" className="og-small og-link">View all</Link>}
          />
          <Panel padded={false}>
            {recent.length === 0 ? (
              <Empty title="No cases yet" body="Create your first case to begin structuring it for the network." action={<Link href="/cases/new"><Button>Create a case</Button></Link>} />
            ) : recent.map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`} className="og-listrow" style={{ gridTemplateColumns: "84px 1fr 180px 116px" }}>
                <span className="og-mono" style={{ fontSize: 12.5, color: c.status === "Clinically Corroborated" ? "var(--teal-deep)" : "var(--ink)" }}>{c.id}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13 }}>{c.headline}</span>
                  <span className="og-small">{c.ageGroup} · {c.phenotypeCluster} · updated {relTime(c.updatedAt, now)}</span>
                </span>
                <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : undefined}>{c.status === "Clinically Corroborated" ? "Corroborated" : c.status}</Pill>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <ScoreBar value={completenessOverall(c)} />
                  <span className="og-mono og-small">{completenessOverall(c)}</span>
                </span>
              </Link>
            ))}
          </Panel>
        </section>

        <div className="og-stack">
          <Panel title="Potential matches" action={<Link href="/matches" className="og-small og-link">All</Link>} padded={false}>
            {openMatches.length === 0 ? (
              <div style={{ padding: "18px 18px 22px" }}>
                <p className="og-small" style={{ margin: 0 }}>
                  No matches are waiting. Open a case and run <b>Find matches</b> to query the network.
                </p>
              </div>
            ) : openMatches.slice(0, 4).map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>{m.sourceCaseId} ↔ {m.targetCaseId}</span>
                  <span className="og-small">{state.cases[m.targetCaseId]?.country} · {m.label}</span>
                </span>
                <span className="og-num" style={{ fontSize: 20, color: "var(--teal-deep)" }}>{m.score}</span>
              </Link>
            ))}
          </Panel>

          <Panel title="Network activity" meta="Across member institutions" padded={false}>
            {notifications.length === 0 ? (
              <div style={{ padding: "18px" }}><p className="og-small" style={{ margin: 0 }}>Nothing yet. Activity appears here as the network responds to your cases.</p></div>
            ) : notifications.map((n) => (
              <Link key={n.id} href={n.href} className="og-listrow" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
                  <span className="og-small">{n.detail}</span>
                </span>
                <span className="og-mono og-small">{relTime(n.createdAt, now)}</span>
              </Link>
            ))}
          </Panel>

          <Panel title="The network" meta={`${networkNodes.length} institutions shown`}>
            <WorldMap
              nodes={networkNodes}
              edges={networkEdges}
              highlight={["kz", "de"]}
              labels={["kz", "de"]}
              crop="2 2 82 30"
              className="w-full"
              labelSize={1.7}
            />
            <p className="og-small" style={{ marginTop: 10 }}>
              {PRODUCT.principle} <Link href="/network" className="og-link">Explore the network</Link>
            </p>
          </Panel>
        </div>
      </div>

      <section className="og-sec">
        <Banner>
          <b>This is a demonstration.</b> Every case, clinician and result is synthetic. Matching is a deterministic
          product simulation, not a clinical method, and no output here is a diagnosis.
        </Banner>
      </section>
    </>
  );
}
