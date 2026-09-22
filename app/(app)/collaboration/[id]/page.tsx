"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/store/store";
import {
  Panel, Button, Pill, Empty, Banner, Disclaimer, Tabs, StepBar, Modal, Field,
  useToast, absTime, Avatar, ScoreBar,
} from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";
import { TrajectoryChart } from "@/components/kit";
import { buildComparison } from "@/lib/compare";

type EvTab = "summary" | "phenotype" | "timeline" | "documents";
const STAGE_KEYS = ["co.stage1", "co.stage2", "co.stage3", "co.stage4", "co.stage5"] as const;

export default function CollaborationRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const { t, C, P } = useI18n();
  const relTime = useRelTime();
  const toast = useToast();
  const [tab, setTab] = React.useState<EvTab>("summary");
  const [draft, setDraft] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const threadRef = React.useRef<HTMLDivElement>(null);

  const col = state.collaborations[id];
  React.useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [col?.messages.length]);

  if (!col) return <Empty title={t("co.notFound")} body={t("co.notFoundBody")} action={<Link href="/collaboration"><Button>{t("co.allRooms")}</Button></Link>} />;

  const me = state.currentDoctorId!;
  const a = state.cases[col.caseAId];
  const b = state.cases[col.caseBId];
  const match = state.matches[col.matchId];
  const docA = state.doctors[col.doctorAId];
  const docB = state.doctors[col.doctorBId];
  const iAmParticipant = me === col.doctorAId || me === col.doctorBId;
  const myVerification = col.verifications.find((v) => v.by === me);
  const bothVerified = col.verifications.length >= 2;

  const send = () => {
    if (!draft.trim()) return;
    dispatch({ type: "sendMessage", collaborationId: col.id, body: draft });
    setDraft("");
  };

  const submitVerification = () => {
    dispatch({ type: "verifyRelevance", collaborationId: col.id, notes: notes.trim() || t("co.defaultNote") });
    setVerifying(false);
    setNotes("");
    toast({
      title: t("co.verifiedToast"),
      body: col.verifications.length >= 1 ? t("co.verifiedToastBoth") : t("co.verifiedToastOne"),
    });
  };

  const groups = buildComparison(a, b, { t, C });
  const phenotypeRows = groups.find((g) => g.group === t("grp.Phenotype"))?.rows ?? [];
  const keys = ["hypotonia", "developmentalDelay", "plateau", "seizureOnset", "regression", "imagingChange"];
  const labels = keys.map((k) => t(`ms.${k}` as "ms.hypotonia"));
  const av = keys.map((k) => a.milestones[k] ?? 0);
  const bv = keys.map((k) => b.milestones[k] ?? 0);
  const plottable = av.every((v) => v > 0) && bv.every((v) => v > 0);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/collaboration" className="og-small og-link">{t("nav.collaboration")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{col.id.slice(0, 11)}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{a.id} ↔ {b.id}</h1>
          <div className="og-row" style={{ gap: 10, marginTop: 12 }}>
            <Pill tone="teal">◈ {t("co.encrypted")}</Pill>
            <Pill>{t("co.openedAgo", { t: relTime(col.openedAt, state.clock) })}</Pill>
            <Pill>{t("co.auditImmutable")}</Pill>
          </div>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end", alignItems: "flex-start" }}>
          <Disclaimer />
          {[docA, docB].map((d, i) => (
            <div key={d.id} className="og-flat" style={{ padding: "12px 16px", minWidth: 190 }}>
              <div className="og-row" style={{ gap: 11 }}>
                <Avatar initials={d.initials} side={i === 0 ? "a" : "b"} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{C(d.name)}{d.id === me ? ` ${t("co.you")}` : ""}</div>
                  <div className="og-small">{C(d.city)}, {C(d.country)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="og-sec">
        <Panel glass><StepBar stages={STAGE_KEYS.map((k) => t(k))} index={col.stageIndex} /></Panel>
      </div>

      {bothVerified && (
        <div className="og-sec">
          <Banner>
            <b>{t("co.corroboratedBanner")}</b> {t("co.corroboratedBody")}{" "}
            <Link href="/knowledge" className="og-link">{t("co.viewIt")}</Link>
          </Banner>
        </div>
      )}

      <div className="og-sec og-grid" data-cols="2">
        {/* ------------------------- evidence stays visible ------------------------- */}
        <div>
          <Tabs
            tabs={[
              { id: "summary", label: t("co.tabSummary") },
              { id: "phenotype", label: t("co.tabPhenotype") },
              { id: "timeline", label: t("co.tabTimeline") },
              { id: "documents", label: t("co.tabDocuments") },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Panel style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            {tab === "summary" && (
              <div className="og-stack">
                {[a, b].map((c, i) => (
                  <div key={c.id} style={{ paddingBottom: 14, borderBottom: i === 0 ? "1px solid var(--line)" : undefined }}>
                    <div className="og-between">
                      <Link href={`/cases/${c.id}`} className="og-mono og-link" style={{ fontSize: 14, fontWeight: 700 }}>{c.id}</Link>
                      <Pill tone={i === 1 ? "teal" : undefined}>{C(c.country)}</Pill>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", marginTop: 8 }}>{C(c.headline)}</p>
                    <div className="og-small">{C(c.institution)} · {C(c.ageGroup)} · {t(`status.${c.status}` as "status.Unresolved")}</div>
                  </div>
                ))}
                {match && (
                  <div>
                    <div className="og-eyebrow">{t("co.evidenceSimilarity")}</div>
                    <div className="og-row" style={{ gap: 14, marginTop: 8 }}>
                      <span className="og-num" style={{ fontSize: 30, color: "var(--teal-deep)" }}>{match.score}</span>
                      <span className="og-small" style={{ maxWidth: "36ch" }}>
                        {t("co.similarityLine", { label: t(match.labelKey as "match.label.strong"), n: match.dimensions.filter((d) => d.direction === "supporting").length, total: match.dimensions.length })}
                      </span>
                    </div>
                    <div className="og-stack" style={{ marginTop: 14 }}>
                      {match.dimensions.map((d) => (
                        <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 54px 34px", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 12.5 }}>{t(d.labelKey as "dim.phenotype")}</span>
                          <ScoreBar value={d.score} tone={d.direction === "divergent" ? "amber" : "teal"} />
                          <span className="og-mono og-small" style={{ textAlign: "right" }}>{d.score}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href={`/matches/${match.id}/compare`} className="og-small og-link">{t("co.openFullComparison")}</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "phenotype" && (
              <table className="og-table">
                <thead><tr><th>{t("case.colTerm")}</th><th>{a.id}</th><th>{b.id}</th></tr></thead>
                <tbody>
                  {phenotypeRows.map((r, i) => (
                    <tr key={r.label + i}>
                      <td style={{ fontWeight: 600 }}>{r.label}</td>
                      <td className="og-small" style={{ color: r.a === t("common.notRecorded") ? "var(--ink-4)" : undefined }}>{r.a}</td>
                      <td className="og-small" style={{ color: r.b === t("common.notRecorded") ? "var(--ink-4)" : r.agreement === "only-b" ? "var(--teal-deep)" : undefined }}>{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "timeline" && (
              plottable ? (
                <>
                  <div style={{ color: "var(--ink-4)", "--track-a": "var(--ink-2)", "--track-b": "var(--teal)" } as React.CSSProperties}>
                    <TrajectoryChart milestones={labels} a={av} b={bv} max={24} labelA={a.id} labelB={b.id} height={150} rowLabels labelWidth={120} />
                  </div>
                  <div className="og-row" style={{ gap: 18, marginTop: 10 }}>
                    <span className="og-small">● {a.id}</span>
                    <span className="og-small" style={{ color: "var(--teal-deep)" }}>● {b.id}</span>
                    <span className="og-small" style={{ marginLeft: "auto" }}>{t("cmp.monthsFromBirth")}</span>
                  </div>
                </>
              ) : <p className="og-small">{t("cmp.notPlottable")}</p>
            )}

            {tab === "documents" && (
              <div className="og-stack">
                {col.documents.map((d, i) => (
                  <div key={i} className="og-flat" style={{ padding: "12px 14px" }}>
                    <div className="og-between">
                      <span className="og-mono" style={{ fontSize: 12.5 }}>{t(d.labelKey as "co.docSignals", d.labelParams)}</span>
                      <Pill>{t(d.kindKey as "co.kindComparison")}</Pill>
                    </div>
                    <div className="og-small" style={{ marginTop: 4 }}>{t(d.metaKey as "co.docSignalsMeta", d.metaParams)}</div>
                  </div>
                ))}
                <p className="og-small" style={{ margin: 0 }}>{t("co.docsNote")}</p>
              </div>
            )}
          </Panel>
        </div>

        {/* ------------------------- discussion & decisions ------------------------- */}
        <div className="og-stack">
          <Panel title={t("co.discussion")} meta={t("co.discussionMeta")} padded={false}>
            <div ref={threadRef} style={{ maxHeight: 420, overflowY: "auto", padding: "4px 18px" }}>
              {col.messages.map((msg) => {
                if (msg.author === "system") {
                  return (
                    <div key={msg.id} className="og-msg" data-side="system">
                      <div>
                        <div className="og-eyebrow">{t("co.system")} · {relTime(msg.at, state.clock)}</div>
                        <p className="og-small" style={{ margin: "6px 0 0" }}>{msg.bodyKey ? t(msg.bodyKey as "co.roomOpened", msg.bodyParams) : msg.body}</p>
                      </div>
                    </div>
                  );
                }
                const d = state.doctors[msg.author];
                return (
                  <div key={msg.id} className="og-msg">
                    <Avatar initials={d.initials} side={msg.author === "doc-a" ? "a" : "b"} />
                    <div>
                      <div className="og-row" style={{ gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{C(d.name)}{d.id === me ? ` ${t("co.you")}` : ""}</span>
                        <span className="og-small">{d.countryCode}</span>
                        <span className="og-mono og-small" style={{ marginLeft: "auto" }}>{relTime(msg.at, state.clock)}</span>
                      </div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-2)", margin: "7px 0 0" }}>{msg.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="og-b" style={{ borderTop: "1px solid var(--line)" }}>
              {iAmParticipant ? (
                <div className="og-row" style={{ gap: 10, alignItems: "flex-end" }}>
                  <textarea
                    className="og-textarea"
                    style={{ minHeight: 62, flex: "1 1 220px", width: "auto" }}
                    placeholder={t("co.writeNote")}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
                  />
                  <Button onClick={send} disabled={!draft.trim()}>{t("common.send")}</Button>
                </div>
              ) : (
                <p className="og-small" style={{ margin: 0 }}>{t("co.notParticipant")}</p>
              )}
              {iAmParticipant && <div className="og-small" style={{ marginTop: 8 }}>{t("co.toSend")}</div>}
            </div>
          </Panel>

          <Panel glass title={t("co.verificationStatus")} action={<Pill tone={bothVerified ? "teal" : "amber"}>{t("co.verifiedOf", { n: col.verifications.length })}</Pill>}>
            {[docA, docB].map((d) => {
              const v = col.verifications.find((x) => x.by === d.id);
              return (
                <div key={d.id} style={{ display: "flex", gap: 11, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: v ? "var(--teal-deep)" : "var(--amber)" }}>{v ? "✓" : "○"}</span>
                  <div>
                    <div style={{ fontSize: 13 }}>{v ? t("co.confirmedBy", { name: C(d.name) }) : t("co.pendingBy", { name: C(d.name) })}</div>
                    <div className="og-small" style={{ marginTop: 3 }}>
                      {v ? v.notes : t("co.awaitingAssessment")}
                    </div>
                    {v && <div className="og-small og-mono" style={{ marginTop: 3 }}>{absTime(v.at)}</div>}
                  </div>
                </div>
              );
            })}
            <p className="og-small" style={{ marginTop: 12 }}>
              {t("co.twoRequired")}
            </p>
            {iAmParticipant && !myVerification && (
              <Button block style={{ marginTop: 14 }} onClick={() => setVerifying(true)}>{t("co.verifyBtn")}</Button>
            )}
            {myVerification && !bothVerified && (
              <Banner tone="amber">
                {t("co.youVerified", { name: C(me === col.doctorAId ? docB.name : docA.name) })}
              </Banner>
            )}
          </Panel>

          <Panel title={t("co.decisionLog")} meta={t("co.immutable")} padded={false}>
            {col.decisionLog.map((d) => (
              <div key={d.id} className="og-listrow" style={{ gridTemplateColumns: "18px 1fr auto" }}>
                <span style={{ color: d.state === "done" ? "var(--teal-deep)" : d.state === "pending" ? "var(--amber)" : "var(--ink-4)", fontSize: 11 }}>
                  {d.state === "done" ? "■" : "□"}
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{t(d.actionKey as "co.decVerify")}</span>
                  <span className="og-small">{d.actorKey ? t(d.actorKey as "co.network") : C(d.actor ?? "")}</span>
                </span>
                <span className="og-mono og-small">{d.at ? relTime(d.at, state.clock) : "—"}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <Modal
        open={verifying}
        onClose={() => setVerifying(false)}
        title={t("co.verifyTitle")}
        footer={<><Button variant="ghost" onClick={() => setVerifying(false)}>{t("common.cancel")}</Button><Button onClick={submitVerification}>{t("co.verifyConfirm")}</Button></>}
      >
        <Banner tone="amber">
          <b>{t("co.verifyWarn")}</b> {t("co.verifyWarnBody", { a: a.id, b: b.id })}
        </Banner>
        <div style={{ marginTop: 16 }}>
          <Field label={t("co.verifyNotes")} hint={t("co.verifyNotesHint")}>
            <textarea
              className="og-textarea" rows={4}
              placeholder={t("co.verifyPh")}
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
