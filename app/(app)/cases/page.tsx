"use client";

import * as React from "react";
import Link from "next/link";
import { useStore, selectCasesOf, completenessOverall } from "@/store/store";
import { Panel, SectionHead, Button, Pill, ScoreBar, Empty, relTime } from "@/ui/primitives";
import type { CaseStatus } from "@/store/types";

const FILTERS: (CaseStatus | "All")[] = ["All", "Unresolved", "Under review", "Match proposed", "Clinically Corroborated"];

export default function CasesPage() {
  const { state } = useStore();
  const id = state.currentDoctorId!;
  const all = selectCasesOf(state, id);
  const [filter, setFilter] = React.useState<CaseStatus | "All">("All");
  const [q, setQ] = React.useState("");

  const cases = all.filter((c) => {
    if (filter !== "All" && c.status !== filter) return false;
    if (!q.trim()) return true;
    const hay = `${c.id} ${c.headline} ${c.phenotypeCluster} ${c.ageGroup} ${c.phenotypes.map((p) => p.term).join(" ")}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div>
          <div className="og-eyebrow">Case register</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Cases</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {all.length} case{all.length === 1 ? "" : "s"} submitted from {state.doctors[id].institution}. Structured
            records only — source documents never leave your institution.
          </p>
        </div>
        <Link href="/cases/new"><Button>+ New case</Button></Link>
      </header>

      <div className="og-sec og-between" style={{ gap: 12 }}>
        <div className="og-row" style={{ gap: 6 }}>
          {FILTERS.map((f) => (
            <button key={f} className="og-navlink" data-on={filter === f} onClick={() => setFilter(f)} style={{ border: "1px solid var(--line)" }}>
              {f}
              <span className="og-small" style={{ opacity: 0.7 }}>
                {f === "All" ? all.length : all.filter((c) => c.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <input
          className="og-input"
          style={{ maxWidth: 280 }}
          placeholder="Search cases, phenotypes…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search cases"
        />
      </div>

      <section className="og-sec">
        <Panel padded={false}>
          {cases.length === 0 ? (
            <Empty
              title="No cases match"
              body={q ? `Nothing in this register matches “${q}”.` : "No cases with this status."}
              action={<Button variant="ghost" onClick={() => { setQ(""); setFilter("All"); }}>Clear filters</Button>}
            />
          ) : (
            <>
              <div className="og-listrow" style={{ gridTemplateColumns: "90px 1fr 120px 150px 130px", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-4)", background: "rgba(255,255,255,0.5)" }}>
                <span>Case</span><span>Presentation</span><span>Cluster</span><span>Status</span><span>Completeness</span>
              </div>
              {cases.map((c, i) => (
                <Link key={c.id} href={`/cases/${c.id}`} className="og-listrow ody-fadein" style={{ gridTemplateColumns: "90px 1fr 120px 150px 130px", "--d": `${i * 30}ms` } as React.CSSProperties}>
                  <span className="og-mono" style={{ fontSize: 12.5, color: c.status === "Clinically Corroborated" ? "var(--teal-deep)" : "var(--ink)" }}>{c.id}</span>
                  <span>
                    <span style={{ display: "block", fontSize: 13 }}>{c.headline}</span>
                    <span className="og-small">{c.ageGroup} · {c.sex} · updated {relTime(c.updatedAt, state.clock)}</span>
                  </span>
                  <span className="og-small">{c.phenotypeCluster}</span>
                  <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : c.status === "Under review" ? "amber" : undefined}>{c.status}</Pill>
                  <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <ScoreBar value={completenessOverall(c)} delay={i * 30} />
                    <span className="og-mono og-small">{completenessOverall(c)}</span>
                  </span>
                </Link>
              ))}
            </>
          )}
        </Panel>
      </section>
    </>
  );
}
