"use client";

import * as React from "react";
import Link from "next/link";
import {
  useStore, selectCasesOf, selectUnresolved, selectOpenMatches, selectVerificationTasks,
  selectCollaborationsOf, selectNotificationsOf, completenessOverall,
} from "@/store/store";
import { Panel, SectionHead, Metric, Pill, Button, ScoreBar, Empty, Banner } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges } from "@/data/odyssey";

export default function DashboardPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
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
      key: m.id, href: `/matches/${m.id}`,
      label: t("dash.reviewMatch", { a: m.sourceCaseId, b: m.targetCaseId }),
      meta: t("dash.similarity", { label: t(m.labelKey as "match.label.strong"), n: m.score }),
      tone: "teal" as const,
    })),
    ...tasks.map((task) => ({
      key: task.href + task.label, href: task.href, label: task.label,
      meta: task.kind === "request" ? t("dash.awaitingResponse") : t("dash.awaitingVerification"),
      tone: "amber" as const,
    })),
  ];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div>
          <div className="og-eyebrow">{C(doctor.institution)} · {C(doctor.city)}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("dash.greeting", { name: C(doctor.name) })}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("dash.unresolvedLine", { n: unresolved.length })}{" "}
            {openMatches.length > 0
              ? t("dash.matchesWaiting", { n: openMatches.length })
              : t("dash.noMatchesLine")}
          </p>
        </div>
        <Link href="/cases/new"><Button>{t("nav.newCase")}</Button></Link>
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric href="/cases" label={t("dash.mUnresolved")} value={unresolved.length} detail={t("dash.mUnresolvedD")} />
        <Metric href="/matches" label={t("dash.mMatches")} value={openMatches.length} tone="teal" detail={t("dash.mMatchesD")} />
        <Metric href="/matches" label={t("dash.mVerification")} value={tasks.length} tone={tasks.length ? "amber" : undefined} detail={t("dash.mVerificationD")} />
        <Metric href="/collaboration" label={t("dash.mCollab")} value={collabs.length} detail={t("dash.mCollabD")} />
      </div>

      {pending.length > 0 && (
        <section className="og-sec">
          <SectionHead label={t("dash.pending")} note={t("dash.pendingNote")} />
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
            label={t("dash.recentCases")}
            note={t("dash.casesInCare", { n: cases.length })}
            action={<Link href="/cases" className="og-small og-link">{t("common.viewAll")}</Link>}
          />
          <Panel padded={false}>
            {recent.length === 0 ? (
              <Empty title={t("dash.noCases")} body={t("dash.noCasesBody")} action={<Link href="/cases/new"><Button>{t("dash.createCase")}</Button></Link>} />
            ) : recent.map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`} className="og-listrow" style={{ gridTemplateColumns: "84px 1fr 180px 116px" }}>
                <span className="og-mono" style={{ fontSize: 12.5, color: c.status === "Clinically Corroborated" ? "var(--teal-deep)" : "var(--ink)" }}>{c.id}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13 }}>{C(c.headline)}</span>
                  <span className="og-small">{C(c.ageGroup)} · {C(c.phenotypeCluster)} · {t("cases.updated", { t: relTime(c.updatedAt, now) })}</span>
                </span>
                <Pill tone={c.status === "Clinically Corroborated" ? "teal" : c.status === "Match proposed" ? "ice" : undefined}>{c.status === "Clinically Corroborated" ? t("status.CorroboratedShort") : t(`status.${c.status}` as "status.Unresolved")}</Pill>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <ScoreBar value={completenessOverall(c)} />
                  <span className="og-mono og-small">{completenessOverall(c)}</span>
                </span>
              </Link>
            ))}
          </Panel>
        </section>

        <div className="og-stack">
          <Panel title={t("dash.mMatches")} action={<Link href="/matches" className="og-small og-link">{t("common.all")}</Link>} padded={false}>
            {openMatches.length === 0 ? (
              <div style={{ padding: "18px 18px 22px" }}>
                <p className="og-small" style={{ margin: 0 }}>{t("dash.noMatchesWaiting")}</p>
              </div>
            ) : openMatches.slice(0, 4).map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>{m.sourceCaseId} ↔ {m.targetCaseId}</span>
                  <span className="og-small">{C(state.cases[m.targetCaseId]?.country ?? "")} · {t(m.labelKey as "match.label.strong")}</span>
                </span>
                <span className="og-num" style={{ fontSize: 20, color: "var(--teal-deep)" }}>{m.score}</span>
              </Link>
            ))}
          </Panel>

          <Panel title={t("dash.networkActivity")} meta={t("dash.acrossInstitutions")} padded={false}>
            {notifications.length === 0 ? (
              <div style={{ padding: "18px" }}><p className="og-small" style={{ margin: 0 }}>{t("dash.activityEmpty")}</p></div>
            ) : notifications.map((n) => (
              <Link key={n.id} href={n.href} className="og-listrow" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: n.read ? 500 : 700 }}>{t(n.titleKey as "ntf.match", n.titleParams)}</span>
                  <span className="og-small">{t(n.detailKey as "ntf.matchBody", n.detailParams)}</span>
                </span>
                <span className="og-mono og-small">{relTime(n.createdAt, now)}</span>
              </Link>
            ))}
          </Panel>

          <Panel title={t("dash.theNetwork")} meta={t("dash.institutionsShown", { n: networkNodes.length })}>
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
              {t("st.principle")} <Link href="/network" className="og-link">{t("dash.explore")}</Link>
            </p>
          </Panel>
        </div>
      </div>

      <section className="og-sec">
        <Banner>
          <b>{t("dash.bannerLead")}</b> {t("dash.banner").replace(t("dash.bannerLead") + " ", "")}
        </Banner>
      </section>
    </>
  );
}
