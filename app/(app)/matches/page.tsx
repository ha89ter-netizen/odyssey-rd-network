"use client";

import * as React from "react";
import Link from "next/link";
import { useStore, selectMatchesOf, selectCasesOf } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, SectionHead, Disclaimer } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { FindMatches } from "@/components/FindMatches";

export default function MatchesPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
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
          <div className="og-eyebrow">{t("dash.mMatches")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("nav.matches")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("res.scoreNote")}
          </p>
        </div>
        <Disclaimer />
      </header>

      {incoming.length > 0 && (
        <div className="og-sec">
          <SectionHead label={t("dash.awaitingResponse")} note={t("md.newRequest")} />
          <Panel glass padded={false}>
            {incoming.map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>
                    {m.sourceCaseId} ↔ {m.targetCaseId}
                  </span>
                  <span className="og-small">
                    {C(state.doctors[state.cases[m.sourceCaseId].ownerId].name)}, {C(state.cases[m.sourceCaseId].country)}
                  </span>
                </span>
                <Pill tone="amber">{t("dash.awaitingResponse")}</Pill>
                <span className="og-num" style={{ fontSize: 19, color: "var(--teal-deep)" }}>{m.score}</span>
              </Link>
            ))}
          </Panel>
        </div>
      )}

      <div className="og-sec">
        <SectionHead label={t("md.allMatches")} note={t("res.aboveThresholdShort", { n: others.length })} />
        <Panel padded={false}>
          {others.length === 0 ? (
            <Empty
              title={t("dash.noMatchesWaiting")}
              body={t("res.scoreNote")}
              icon="◎"
              action={<Link href="/cases"><Button>{t("nt.goToCases")}</Button></Link>}
            />
          ) : others.map((m) => {
            const src = state.cases[m.sourceCaseId];
            const tgt = state.cases[m.targetCaseId];
            return (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "150px 1fr 150px 110px 70px" }}>
                <span className="og-mono" style={{ fontSize: 12.5 }}>{src.id} ↔ {tgt.id}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13 }}>{C(tgt.headline)}</span>
                  <span className="og-small">{C(src.country)} → {C(tgt.country)} · {t("res.surfacedAgo", { t: relTime(m.createdAt, state.clock) })}</span>
                </span>
                <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : m.status === "requested" ? "amber" : undefined}>
                  {m.status === "surfaced" ? t(m.labelKey as "match.label.strong") : t(`match.status.${m.status}` as "match.status.accepted")}
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
          <SectionHead label={t("res.notSearched")} note={t("res.notSearchedBody")} />
          <Panel padded={false}>
            {unsearched.slice(0, 6).map((c) => (
              <div key={c.id} className="og-listrow" style={{ gridTemplateColumns: "100px 1fr auto" }}>
                <Link href={`/cases/${c.id}`} className="og-mono og-link" style={{ fontSize: 12.5 }}>{c.id}</Link>
                <span className="og-small">{C(c.headline)}</span>
                <FindMatches record={c} label={t("res.searchAgain")} variant="ghost" />
              </div>
            ))}
          </Panel>
        </div>
      )}
    </>
  );
}
