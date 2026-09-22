"use client";

import * as React from "react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Pill, Tabs, SectionHead, Disclaimer, Metric, Empty, absTime, Banner } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";

type Tab = "overview" | "cases" | "matches" | "queue" | "contributions" | "audit";

export default function AdminPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
  const [tab, setTab] = React.useState<Tab>("overview");

  const cases = Object.values(state.cases);
  const matches = Object.values(state.matches);
  const queue = [
    ...matches.filter((m) => m.status === "requested").map((m) => ({ id: m.id, what: t("ad.qRequest", { a: m.sourceCaseId, b: m.targetCaseId }), who: C(state.doctors[state.cases[m.targetCaseId].ownerId].name), state: t("ad.qAwaitingResponse") })),
    ...Object.values(state.collaborations).flatMap((c) =>
      [c.doctorAId, c.doctorBId]
        .filter((d) => !c.verifications.some((v) => v.by === d))
        .map((d) => ({ id: c.id + d, what: t("ad.qVerification", { a: c.caseAId, b: c.caseBId }), who: C(state.doctors[d].name), state: t("ad.qAwaitingVerification") })),
    ),
  ];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">{t("ad.eyebrow")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("ad.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("ad.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <Tabs
          tabs={[
            { id: "overview", label: t("ad.tabOverview") },
            { id: "cases", label: `${t("ad.tabCases")} (${cases.length})` },
            { id: "matches", label: `${t("ad.tabMatches")} (${matches.length})` },
            { id: "queue", label: `${t("ad.tabQueue")} (${queue.length})` },
            { id: "contributions", label: `${t("ad.tabContributions")} (${state.contributions.length})` },
            { id: "audit", label: `${t("ad.tabAudit")} (${state.audit.length})` },
          ]}
          value={tab}
          onChange={setTab}
        />
        <Panel style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} padded={tab === "overview"}>
          {tab === "overview" && (
            <div className="og-stack">
              <div className="og-grid" data-cols="auto">
                <Metric label={t("ad.mClinicians")} value={Object.keys(state.doctors).length} detail={t("ad.mCliniciansD")} />
                <Metric label={t("ad.tabCases")} value={cases.length} detail={t("ad.mCasesD", { n: cases.filter((c) => c.status === "Unresolved").length })} />
                <Metric label={t("ad.tabMatches")} value={matches.length} tone="teal" detail={t("ad.mMatchesD", { n: matches.filter((m) => m.status === "verified").length })} />
                <Metric label={t("ad.mAudit")} value={state.audit.length} detail={t("ad.mAuditD")} />
              </div>
              <Banner tone="plain">
                {t("ad.prototypeNote")}
              </Banner>
              <div>
                <SectionHead label={t("ad.users")} />
                <table className="og-table">
                  <thead><tr><th>{t("ad.colClinician")}</th><th>{t("ad.colRole")}</th><th>{t("ad.colInstitution")}</th><th style={{ width: 90 }}>{t("ad.colCountry")}</th><th style={{ width: 130 }}>{t("ad.colNetworkId")}</th></tr></thead>
                  <tbody>
                    {Object.values(state.doctors).map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 600 }}>{C(d.name)}</td>
                        <td className="og-small">{C(d.role)}</td>
                        <td className="og-small">{C(d.institution)}</td>
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
              <thead><tr><th style={{ width: 92 }}>{t("cases.colCase")}</th><th>{t("cases.colPresentation")}</th><th style={{ width: 120 }}>{t("ad.colOwner")}</th><th style={{ width: 110 }}>{t("ad.colCountry")}</th><th style={{ width: 160 }}>{t("cases.colStatus")}</th></tr></thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td><Link href={`/cases/${c.id}`} className="og-mono og-link">{c.id}</Link></td>
                    <td className="og-small">{C(c.headline)}</td>
                    <td className="og-small">{C(state.doctors[c.ownerId].name)}</td>
                    <td className="og-small">{C(c.country)}</td>
                    <td><Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : undefined}>{t(`status.${c.status}` as "status.Unresolved")}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "matches" && (
            matches.length === 0 ? <Empty title={t("ad.noMatches")} body={t("ad.noMatchesBody")} icon="◎" /> : (
              <table className="og-table">
                <thead><tr><th style={{ width: 170 }}>{t("ad.colPair")}</th><th style={{ width: 70 }}>{t("md.colScore")}</th><th>{t("ad.colLabel")}</th><th style={{ width: 120 }}>{t("cases.colStatus")}</th><th style={{ width: 120 }}>{t("ad.colCreated")}</th></tr></thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td><Link href={`/matches/${m.id}`} className="og-mono og-link">{m.sourceCaseId} ↔ {m.targetCaseId}</Link></td>
                      <td className="og-mono" style={{ color: "var(--teal-deep)" }}>{m.score}</td>
                      <td className="og-small">{t(m.labelKey as "match.label.strong")}</td>
                      <td><Pill tone={m.status === "verified" ? "teal" : undefined}>{t(`match.status.${m.status}` as "match.status.accepted")}</Pill></td>
                      <td className="og-mono og-small">{relTime(m.createdAt, state.clock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "queue" && (
            queue.length === 0 ? <Empty title={t("ad.queueEmpty")} body={t("ad.queueEmptyBody")} icon="✓" /> : (
              <table className="og-table">
                <thead><tr><th>{t("ad.colItem")}</th><th style={{ width: 200 }}>{t("ad.colAssigned")}</th><th style={{ width: 180 }}>{t("ad.colState")}</th></tr></thead>
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
            state.contributions.length === 0 ? <Empty title={t("ad.noContributions")} body={t("ad.noContributionsBody")} icon="◆" /> : (
              <table className="og-table">
                <thead><tr><th>{t("ad.colContribution")}</th><th style={{ width: 170 }}>{t("kn.fCases")}</th><th style={{ width: 220 }}>{t("kn.fContributors")}</th><th style={{ width: 150 }}>{t("ad.colRecorded")}</th></tr></thead>
                <tbody>
                  {state.contributions.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{t("kn.title1")}</td>
                      <td className="og-mono og-small">{c.caseIds.join(" ↔ ")}</td>
                      <td className="og-small">{c.contributors.map((n) => C(n)).join(", ")}</td>
                      <td className="og-mono og-small">{absTime(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "audit" && (
            <table className="og-table">
              <thead><tr><th style={{ width: 210 }}>{t("ad.colAction")}</th><th style={{ width: 150 }}>{t("ad.colActor")}</th><th style={{ width: 160 }}>{t("ad.colSubject")}</th><th>{t("ad.colDetail")}</th><th style={{ width: 160 }}>{t("ad.colTimestamp")}</th></tr></thead>
              <tbody>
                {state.audit.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{t(`au.${e.action}` as "au.case.created")}</td>
                    <td className="og-small">{e.actorId === "system" ? t("ad.system") : C(state.doctors[e.actorId]?.name ?? "")}</td>
                    <td className="og-mono og-small">{e.subject}</td>
                    <td className="og-small">{t(e.detailKey as "aud.seeded", e.detailParams)}</td>
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
