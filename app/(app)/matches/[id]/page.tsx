"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, Banner, Disclaimer, SectionHead, Modal, Field, useToast, Avatar } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { Radar } from "@/components/kit";
import { STRONG_THRESHOLD } from "@/store/matching";

/** Short axis labels — truncating the full names produced things like "CLINI". */
const AXIS: Record<string, string> = {
  phenotype: "PHENOTYPE", trajectory: "TRAJECTORY", genetics: "GENETICS", laboratory: "LAB",
  imaging: "IMAGING", temporal: "TEMPORAL", family: "FAMILY", negative: "NEGATIVE",
};

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const { t, C, P } = useI18n();
  const relTime = useRelTime();
  const router = useRouter();
  const toast = useToast();
  const [asking, setAsking] = React.useState(false);
  const [note, setNote] = React.useState("");

  const m = state.matches[id];
  if (!m) return <Empty title={t("md.notFound")} body={t("md.notFoundBody")} action={<Link href="/matches"><Button>{t("md.allMatches")}</Button></Link>} />;

  const source = state.cases[m.sourceCaseId];
  const target = state.cases[m.targetCaseId];
  const me = state.currentDoctorId!;
  const iAmSource = source.ownerId === me;
  const iAmTarget = target.ownerId === me;
  const collab = Object.values(state.collaborations).find((c) => c.matchId === m.id);

  const supporting = m.dimensions.filter((d) => d.direction === "supporting").length;

  const request = () => {
    dispatch({ type: "requestConnection", matchId: m.id, note });
    setAsking(false);
    toast({ title: t("md.sentToast"), body: t("md.sentToastBody", { name: C(state.doctors[target.ownerId].name) }) });
  };

  const respond = (accept: boolean) => {
    dispatch({ type: "respondConnection", matchId: m.id, accept });
    if (accept) {
      toast({ title: t("md.acceptedToast"), body: t("md.acceptedToastBody") });
      router.push(`/collaboration/col-${m.id}`);
    } else {
      toast({ title: t("md.declinedToast"), tone: "info" });
    }
  };

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/matches" className="og-small og-link">{t("nav.matches")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{m.id.slice(0, 11)}</span>
          </div>
          <div className="og-eyebrow" style={{ marginTop: 12 }}>
            {source.countryCode !== target.countryCode ? t("md.crossBorder") : t("md.potential")}
          </div>
          <h1 className="og-h1" style={{ marginTop: 10 }}>{source.id} ↔ {target.id}</h1>
          <div className="og-row" style={{ gap: 12, marginTop: 14 }}>
            <Pill tone={m.score >= STRONG_THRESHOLD ? "teal" : "amber"} style={{ height: 27 }}>{t(m.labelKey as "match.label.strong")}</Pill>
            <span className="og-small">
              {t("md.concordantLine", { n: supporting, total: m.dimensions.length, t: relTime(m.createdAt, state.clock) })}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Disclaimer />
          <div className="og-num" style={{ fontSize: 46, color: "var(--teal-deep)", marginTop: 12 }}>{m.score}</div>
          <div className="og-eyebrow">{t("res.evidenceSimilarity")}</div>
          <div className="og-small" style={{ maxWidth: 210, marginTop: 6 }}>{t("md.notProbability")}</div>
        </div>
      </header>

      {/* status banners drive the demo forward */}
      <div className="og-sec">
        {m.status === "requested" && iAmTarget && (
          <Panel glass>
            <div className="og-between">
              <div className="og-row" style={{ gap: 14 }}>
                <Avatar initials={state.doctors[source.ownerId].initials} side="a" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{t("md.newRequest")}</div>
                  <div className="og-small">
                    {t("md.requestFrom", { name: C(state.doctors[source.ownerId].name), country: C(source.country), id: source.id })}
                  </div>
                  {m.requestNote && <p className="og-small" style={{ marginTop: 8, fontStyle: "italic" }}>“{m.requestNote}”</p>}
                </div>
              </div>
              <div className="og-row">
                <Button onClick={() => respond(true)}>{t("common.accept")}</Button>
                <Button variant="ghost" onClick={() => respond(false)}>{t("common.decline")}</Button>
              </div>
            </div>
          </Panel>
        )}
        {m.status === "requested" && !iAmTarget && (
          <Banner tone="amber">
            <b>{t("md.requested")}</b> {t("md.requestedBody", { name: C(state.doctors[target.ownerId].name), country: C(target.country) })}
          </Banner>
        )}
        {m.status === "accepted" && collab && (
          <Banner>
            <b>{t("md.accepted")}</b> {t("md.acceptedBody", { a: source.id, b: target.id })}{" "}
            <Link href={`/collaboration/${collab.id}`} className="og-link">{t("md.openRoom")}</Link>
          </Banner>
        )}
        {m.status === "verified" && (
          <Banner>
            <b>{t("md.corroborated")}</b> {t("md.corroboratedBody")} <Link href="/knowledge" className="og-link">{t("md.viewContribution")}</Link>
          </Banner>
        )}
        {m.status === "declined" && <Banner tone="amber"><b>{t("md.declined")}</b> {t("md.declinedBody")}</Banner>}
      </div>

      {/* ---------------------------- WHY ---------------------------- */}
      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          <Panel glass title={t("md.whyTitle")} meta={t("md.whyMeta")}>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {m.explanation.map((e, i) => (
                <li key={i} className="ody-rise" style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 12, padding: "11px 0", borderBottom: i < m.explanation.length - 1 ? "1px solid var(--line)" : undefined, "--d": `${i * 70}ms` } as React.CSSProperties}>
                  <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.65 }}>{P(e)}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title={t("md.evidenceTitle")} meta={t("md.evidenceMeta")}>
            <div className="og-dimrow" style={{ fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", paddingTop: 0 }}>
              <span>{t("md.colGroup")}</span><span>{t("md.colScore")}</span><span>{t("md.colWeight")}</span><span>{t("md.colCompared")}</span>
            </div>
            {m.dimensions.map((d, i) => (
              <div key={d.id} className="og-dimrow ody-fadein" style={{ "--d": `${i * 55}ms` } as React.CSSProperties}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t(d.labelKey as "dim.phenotype")}</div>
                  <Pill tone={d.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 7, height: 20 }}>
                    {d.direction === "divergent" ? t("dim.divergent") : t("dim.supporting")}
                  </Pill>
                </div>
                <div className="og-num" style={{ fontSize: 22, color: d.direction === "divergent" ? "var(--amber)" : "var(--teal-deep)" }}>{d.score}</div>
                <div>
                  <ScoreBar value={d.score} tone={d.direction === "divergent" ? "amber" : "teal"} delay={i * 55} />
                  <div className="og-small" style={{ marginTop: 5 }}>{t("common.weight", { n: Math.round(d.weight * 100) })}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{P(d.summary)}</div>
                  <div className="og-row" style={{ gap: 16, marginTop: 7 }}>
                    <span className="og-mono og-small">{source.countryCode} {P(d.aValue)}</span>
                    <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{target.countryCode} {P(d.bValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </Panel>

          {m.divergences.length > 0 && (
            <Panel title={t("md.divergeTitle")} meta={t("md.divergeMeta")}>
              {m.divergences.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, padding: "11px 0", borderBottom: i < m.divergences.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span style={{ color: "var(--amber)" }}>△</span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{P(d)}</span>
                </div>
              ))}
            </Panel>
          )}
        </div>

        <aside className="og-stack">
          <Panel title={t("md.profile")}>
            <div style={{ display: "grid", placeItems: "center", color: "var(--ink-4)", "--radar-fill": "var(--teal)", "--radar-stroke": "var(--teal-deep)", "--radar-fill-opacity": 0.14 } as React.CSSProperties}>
              <Radar
                values={m.dimensions.map((d) => d.score)}
                labels={m.dimensions.map((d) => t(d.labelKey as "dim.phenotype").toUpperCase())}
                size={244}
              />
            </div>
          </Panel>

          <Panel title={t("md.twoCases")}>
            {[source, target].map((c, i) => (
              <div key={c.id} style={{ padding: "12px 0", borderBottom: i === 0 ? "1px solid var(--line)" : undefined }}>
                <div className="og-between">
                  <Link href={`/cases/${c.id}`} className="og-mono og-link" style={{ fontSize: 14 }}>{c.id}</Link>
                  <Pill tone={i === 1 ? "teal" : undefined}>{C(c.country)}</Pill>
                </div>
                <div className="og-small" style={{ marginTop: 6 }}>{C(c.institution)}</div>
                <div className="og-small">{C(c.clinician)} · {C(c.ageGroup)}</div>
              </div>
            ))}
          </Panel>

          <Panel glass title={t("md.nextStep")}>
            {m.status === "surfaced" && iAmSource && (
              <>
                <p className="og-small" style={{ marginTop: 0 }}>
                  {t("md.openChannel", { id: target.id })}
                </p>
                <div className="og-stack" style={{ marginTop: 14 }}>
                  <Button block onClick={() => setAsking(true)}>{t("md.requestConnection")}</Button>
                  <Link href={`/matches/${m.id}/compare`}><Button variant="ghost" block>{t("md.compareFirst")}</Button></Link>
                  <Button variant="ghost" block onClick={() => { dispatch({ type: "dismissMatch", matchId: m.id }); toast({ title: t("md.dismissedToast"), tone: "info" }); router.push("/matches"); }}>
                    {t("md.notAMatch")}
                  </Button>
                </div>
              </>
            )}
            {m.status === "surfaced" && !iAmSource && (
              <p className="og-small" style={{ marginTop: 0 }}>
                {t("md.surfacedFor", { name: C(state.doctors[source.ownerId].name) })}
              </p>
            )}
            {m.status === "requested" && (
              <p className="og-small" style={{ marginTop: 0 }}>
                {iAmTarget ? t("md.respondAbove") : t("md.waitingFor", { name: C(state.doctors[target.ownerId].name) })}
              </p>
            )}
            {(m.status === "accepted" || m.status === "verified") && collab && (
              <div className="og-stack">
                <Link href={`/collaboration/${collab.id}`}><Button block>{t("md.openCollabRoom")}</Button></Link>
                <Link href={`/matches/${m.id}/compare`}><Button variant="ghost" block>{t("res.compare")}</Button></Link>
              </div>
            )}
          </Panel>

          <Panel title={t("md.howFound")}>
            {([
              ["md.hf1", "md.hf1d", { n: m.dimensions.length }],
              ["md.hf2", "md.hf2d", {}],
              ["md.hf3", "md.hf3d", { n: Object.keys(state.cases).length - 1 }],
              ["md.hf4", "md.hf4d", { id: target.id, n: supporting, total: m.dimensions.length }],
              ["md.hf5", "md.hf5d", {}],
            ] as const).map(([tk, dk, params], i) => (
              <div key={tk} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, paddingBottom: 13 }}>
                <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t(tk)}</div>
                  <div className="og-small" style={{ marginTop: 2 }}>{t(dk, params)}</div>
                </div>
              </div>
            ))}
          </Panel>
        </aside>
      </div>

      <Modal
        open={asking}
        onClose={() => setAsking(false)}
        title={t("md.requestTitle")}
        footer={<><Button variant="ghost" onClick={() => setAsking(false)}>{t("common.cancel")}</Button><Button onClick={request}>{t("md.sendRequest")}</Button></>}
      >
        <p className="og-small" style={{ marginTop: 0 }}>
          {t("md.requestIntro", { name: C(state.doctors[target.ownerId].name), inst: C(target.institution) })}
        </p>
        <div style={{ marginTop: 16 }}>
          <Field label={t("md.requestField")} hint={t("md.requestFieldHint")}>
            <textarea
              className="og-textarea" rows={4}
              placeholder={t("md.requestPh")}
              value={note} onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
