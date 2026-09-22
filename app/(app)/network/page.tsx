"use client";

import Link from "next/link";
import { useStore } from "@/store/store";
import { Panel, Pill, SectionHead, Disclaimer, Metric, Banner } from "@/ui/primitives";
import { WorldMap } from "@/components/kit";
import { networkNodes, networkEdges } from "@/data/odyssey";
import { useI18n } from "@/i18n/i18n";

export default function NetworkPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
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
          <div className="og-eyebrow">{t("nw.eyebrow")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("nw.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("st.principle")} {t("nw.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="auto">
        <Metric label={t("nw.mCases")} value={cases.length} detail={t("nw.mCasesD")} />
        <Metric label={t("nw.mInstitutions")} value={institutions.size} detail={t("nw.mInstitutionsD")} />
        <Metric label={t("nw.mCountries")} value={countries.size} detail={t("nw.mCountriesD")} />
        <Metric label={t("nw.mVerified")} value={verified.length} tone="teal" detail={t("nw.mVerifiedD")} />
      </div>

      <div className="og-sec">
        <Panel glass padded={false}>
          <div style={{ padding: "18px 20px 0" }}>
            <div className="og-between">
              <div>
                <div className="og-eyebrow">{t("nw.liveConnection")}</div>
                <div style={{ fontSize: 16, marginTop: 6 }}>
                  {t("nw.mapNote")}
                </div>
              </div>
              <div className="og-row">
                <span className="og-small">● {t("nw.legendMember")}</span>
                <span className="og-small" style={{ color: "var(--teal-deep)" }}>● {t("nw.legendPair")}</span>
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
          <SectionHead label={t("nw.byCountry")} note={t("nw.byCountryNote")} />
          <Panel padded={false}>
            {byCountry.map((r) => (
              <div key={r.country} className="og-listrow" style={{ gridTemplateColumns: "1fr 120px 130px" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{C(r.country)}</span>
                <span className="og-small">{t("nw.nCases", { n: r.cases })}</span>
                <Pill tone={r.corroborated ? "teal" : undefined}>{t("nw.nCorroborated", { n: r.corroborated })}</Pill>
              </div>
            ))}
          </Panel>

          <div className="og-sec">
            <SectionHead label={t("nw.connections")} note={t("nw.connectionsNote")} />
            <Panel padded={false}>
              {matches.length === 0 ? (
                <div style={{ padding: 20 }}><p className="og-small" style={{ margin: 0 }}>{t("nw.noConnections")}</p></div>
              ) : matches.map((m) => (
                <Link key={m.id} href={`/matches/${m.id}`} className="og-listrow" style={{ gridTemplateColumns: "1fr 140px 80px" }}>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>{m.sourceCaseId} ↔ {m.targetCaseId}</span>
                    <span className="og-small">{C(state.cases[m.sourceCaseId]?.country ?? "")} → {C(state.cases[m.targetCaseId]?.country ?? "")}</span>
                  </span>
                  <Pill tone={m.status === "verified" ? "teal" : m.status === "accepted" ? "ice" : undefined}>{t(`match.status.${m.status}` as "match.status.accepted")}</Pill>
                  <span className="og-num" style={{ fontSize: 17, textAlign: "right", color: "var(--teal-deep)" }}>{m.score}</span>
                </Link>
              ))}
            </Panel>
          </div>
        </div>

        <div className="og-stack">
          <Panel title={t("nw.memberInstitutions")} meta={t("nw.shown", { n: networkNodes.length })} padded={false}>
            {networkNodes.slice(0, 10).map((n) => (
              <div key={n.id} className="og-listrow" style={{ gridTemplateColumns: "34px 1fr auto" }}>
                <span className="og-mono og-small" style={{ border: "1px solid var(--line)", borderRadius: 4, textAlign: "center", padding: "2px 0" }}>{n.code}</span>
                <span>
                  <span style={{ display: "block", fontSize: 12.5 }}>{C(n.label)}, {C(n.country)}</span>
                  <span className="og-small">{n.tier === "primary" ? t("nw.primary") : n.tier === "member" ? t("nw.member") : t("nw.observer")}</span>
                </span>
                <span className="og-mono og-small">{n.cases.toLocaleString()}</span>
              </div>
            ))}
          </Panel>
          <Banner>
            <b>{t("nw.federated")}</b> {t("nw.federatedBody")}
          </Banner>
        </div>
      </div>
    </>
  );
}
