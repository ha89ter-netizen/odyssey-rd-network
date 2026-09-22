"use client";

import * as React from "react";
import Link from "next/link";
import { useStore, selectCasesOf, completenessOverall } from "@/store/store";
import { Panel, SectionHead, Button, Pill, ScoreBar, Empty } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import type { CaseStatus } from "@/store/types";

const FILTERS: (CaseStatus | "All")[] = ["All", "Unresolved", "Under review", "Match proposed", "Clinically Corroborated"];

export default function CasesPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
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
          <div className="og-eyebrow">{t("cases.register")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("cases.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("cases.lede", { n: all.length, inst: C(state.doctors[id].institution) })}
          </p>
        </div>
        <Link href="/cases/new"><Button>{t("nav.newCase")}</Button></Link>
      </header>

      <div className="og-sec og-between" style={{ gap: 12 }}>
        <div className="og-row" style={{ gap: 6 }}>
          {FILTERS.map((f) => (
            <button key={f} className="og-navlink" data-on={filter === f} onClick={() => setFilter(f)} style={{ border: "1px solid var(--line)" }}>
              {f === "All" ? t("common.all") : t(`status.${f}` as "status.Unresolved")}
              <span className="og-small" style={{ opacity: 0.7 }}>
                {f === "All" ? all.length : all.filter((c) => c.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <input
          className="og-input"
          style={{ maxWidth: 280 }}
          placeholder={t("cases.searchPlaceholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("cases.searchPlaceholder")}
        />
      </div>

      <section className="og-sec">
        <Panel padded={false}>
          {cases.length === 0 ? (
            <Empty
              title={t("cases.noMatch")}
              body={q ? t("cases.noMatchQuery", { q }) : t("cases.noMatchStatus")}
              action={<Button variant="ghost" onClick={() => { setQ(""); setFilter("All"); }}>{t("cases.clearFilters")}</Button>}
            />
          ) : (
            <>
              <div className="og-listrow" style={{ gridTemplateColumns: "90px 1fr 120px 150px 130px", fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-4)", background: "rgba(255,255,255,0.5)" }}>
                <span>{t("cases.colCase")}</span><span>{t("cases.colPresentation")}</span><span>{t("cases.colCluster")}</span><span>{t("cases.colStatus")}</span><span>{t("cases.colCompleteness")}</span>
              </div>
              {cases.map((c, i) => (
                <Link key={c.id} href={`/cases/${c.id}`} className="og-listrow ody-fadein" style={{ gridTemplateColumns: "90px 1fr 120px 150px 130px", "--d": `${i * 30}ms` } as React.CSSProperties}>
                  <span className="og-mono" style={{ fontSize: 12.5, color: c.status === "Clinically Corroborated" ? "var(--teal-deep)" : "var(--ink)" }}>{c.id}</span>
                  <span>
                    <span style={{ display: "block", fontSize: 13 }}>{C(c.headline)}</span>
                    <span className="og-small">{C(c.ageGroup)} · {C(c.sex)} · {t("cases.updated", { t: relTime(c.updatedAt, state.clock) })}</span>
                  </span>
                  <span className="og-small">{C(c.phenotypeCluster)}</span>
                  <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : c.status === "Under review" ? "amber" : undefined}>{t(`status.${c.status}` as "status.Unresolved")}</Pill>
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
