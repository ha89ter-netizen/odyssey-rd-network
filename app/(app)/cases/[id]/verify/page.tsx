"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, SectionHead, Pill, Button, Empty, Banner, Modal, Field, useToast, Disclaimer, StepBar } from "@/ui/primitives";
import { FindMatches } from "@/components/FindMatches";
import { useI18n } from "@/i18n/i18n";
import { DEMO_DOCUMENTS, extractFrom, LOW_CONFIDENCE, likelyNegation, type ExtractedTerm } from "@/store/extraction";
import type { Phenotype } from "@/store/types";

type Phase = "choose" | "uploaded" | "analyzing" | "complete";

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const { t, C } = useI18n();
  const router = useRouter();
  const toast = useToast();

  const c = state.cases[id];
  const pendingExisting = c?.phenotypes.filter((p) => p.verification === "unverified") ?? [];

  const [phase, setPhase] = React.useState<Phase>(pendingExisting.length ? "complete" : "choose");
  const [docId, setDocId] = React.useState(DEMO_DOCUMENTS[0].id);
  const [fileName, setFileName] = React.useState(DEMO_DOCUMENTS[0].fileName);
  const [progress, setProgress] = React.useState(0);
  const [editing, setEditing] = React.useState<Phenotype | null>(null);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  if (!c) return <Empty title={t("case.notFound")} body={t("case.notFoundBody", { id })} action={<Link href="/cases"><Button>{t("case.backToCases")}</Button></Link>} />;

  const startUpload = (name: string, chosenDoc: string) => {
    setFileName(name);
    setDocId(chosenDoc);
    setPhase("uploaded");
    dispatch({ type: "uploadDocument", caseId: c.id, fileName: name });
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    timers.current.push(window.setTimeout(() => { setPhase("analyzing"); setProgress(18); }, 620));
    [40, 66, 88].forEach((v, i) => timers.current.push(window.setTimeout(() => setProgress(v), 900 + i * 420)));
    timers.current.push(window.setTimeout(() => {
      setProgress(100);
      const terms = extractFrom(chosenDoc);
      dispatch({ type: "completeExtraction", caseId: c.id, fileName: name, terms });
      setPhase("complete");
      toast({ title: t("vf.confirmedToast"), body: t("vf.confirmedToastBody", { n: terms.length }) });
    }, 2300));
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f.name, docId);
  };

  const proposed = c.phenotypes.filter((p) => p.source === "AI extraction");
  const awaiting = proposed.filter((p) => p.verification === "unverified");
  const reviewed = proposed.length - awaiting.length;
  const stageIndex = phase === "choose" ? 0 : phase === "complete" ? (awaiting.length ? 2 : 3) : 1;

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "66ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/cases" className="og-small og-link">{t("nav.cases")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <Link href={`/cases/${c.id}`} className="og-small og-link og-mono">{c.id}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">{t("case.breadcrumbDoc")}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("vf.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("vf.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <Panel glass>
          <StepBar stages={[t("vf.stage1"), t("vf.stage2"), t("vf.stage3"), t("vf.stage4")]} index={stageIndex} />
        </Panel>
      </div>

      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          {phase === "choose" && (
            <Panel title={t("vf.uploadTitle")} meta={t("vf.syntheticOnly")}>
              <div className="og-stack">
                {DEMO_DOCUMENTS.map((d) => (
                  <button key={d.id} className="og-docoption" data-on={docId === d.id} onClick={() => setDocId(d.id)}>
                    <span style={{ fontSize: 18 }} aria-hidden>▤</span>
                    <span>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{C(d.label)}</span>
                      <span className="og-small og-mono">{d.fileName} · {t("vf.pages", { n: d.pages })} · {d.sizeLabel}</span>
                      <span className="og-small" style={{ display: "block", marginTop: 4 }}>{C(d.description)}</span>
                    </span>
                    <Pill tone={docId === d.id ? "teal" : undefined}>{docId === d.id ? t("enter.selected") : t("vf.select")}</Pill>
                  </button>
                ))}

                <div className="og-drop">
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t("vf.orChoose")}</div>
                  <p className="og-small" style={{ maxWidth: "52ch", margin: "8px auto 14px" }}>
                    {t("vf.orChooseBody")}
                  </p>
                  <label>
                    <input type="file" style={{ display: "none" }} onChange={onPick} accept=".pdf,.txt,.doc,.docx" />
                    <span className="og-btn" data-variant="ghost" style={{ cursor: "pointer" }}>{t("vf.chooseFile")}</span>
                  </label>
                </div>

                <div className="og-between">
                  <span className="og-small">{t("vf.selected", { name: DEMO_DOCUMENTS.find((d) => d.id === docId)?.fileName ?? "" })}</span>
                  <Button onClick={() => startUpload(DEMO_DOCUMENTS.find((d) => d.id === docId)!.fileName, docId)}>
                    {t("vf.uploadExtract")}
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {(phase === "uploaded" || phase === "analyzing") && (
            <Panel glass title={phase === "uploaded" ? t("vf.uploaded") : t("vf.analyzing")} meta={fileName}>
              <div className={phase === "analyzing" ? "og-scan" : undefined} style={{ padding: "8px 0 4px" }}>
                <div className="og-prog"><i style={{ width: `${Math.max(8, progress)}%` }} /></div>
              </div>
              <div className="og-stack" style={{ marginTop: 16 }}>
                {[
                  [t("vf.p1"), phase !== "uploaded"],
                  [t("vf.p2"), progress >= 40],
                  [t("vf.p3"), progress >= 66],
                  [t("vf.p4"), progress >= 88],
                ].map(([label, done]) => (
                  <div key={String(label)} className="og-row" style={{ gap: 12, opacity: done ? 1 : 0.4 }}>
                    <span style={{ color: done ? "var(--teal-deep)" : "var(--ink-3)" }}>{done ? "✓" : "○"}</span>
                    <span style={{ fontSize: 13 }}>{label}</span>
                  </div>
                ))}
              </div>
              <Banner tone="amber">
                <b>{t("vf.simulatedLabel")}.</b> {t("vf.simulatedBody")}
              </Banner>
            </Panel>
          )}

          {phase === "complete" && (
            proposed.length === 0 ? (
              <Empty title={t("vf.nothingProposed")} body={t("vf.nothingProposedBody")} icon="◌"
                action={<Button onClick={() => setPhase("choose")}>{t("vf.tryAnother")}</Button>} />
            ) : (
              <Panel
                title={t("vf.detected")}
                meta={t("vf.detectedMeta", { n: proposed.length, reviewed, await: awaiting.length })}
                action={
                  <div className="og-row" style={{ gap: 8 }}>
                    <Pill tone="amber">{t("vf.simulatedLabel")}</Pill>
                    <Pill tone={awaiting.length ? "amber" : "teal"}>{awaiting.length ? t("vf.verificationRequired") : t("vf.allVerified")}</Pill>
                  </div>
                }
                padded={false}
              >
                <div style={{ padding: "16px 18px 0" }}>
                  <Banner tone="amber">
                    <b>{t("vf.simulatedLabel")} · {t("vf.humanLoopBanner")}</b> {t("vf.humanLoopBody")}
                  </Banner>
                </div>

                {proposed.map((term) => {
                  const ex = term as ExtractedTerm;
                  const low = (ex.confidence ?? 1) < LOW_CONFIDENCE;
                  const negation = ex.evidence ? likelyNegation(ex) : false;
                  return (
                    <div key={term.hpo} className="og-term" style={{ alignItems: "start" }}>
                      <div>
                        <div className="og-row" style={{ gap: 11 }}>
                          <span style={{ fontSize: 14.5, fontWeight: 700, textDecoration: term.verification === "rejected" ? "line-through" : undefined, color: term.verification === "rejected" ? "var(--ink-4)" : undefined }}>
                            {C(term.term)}
                          </span>
                          <span className="og-mono og-small">{term.hpo}</span>
                          {ex.page && <span className="og-mono og-small">{ex.page}</span>}
                          {term.verification === "verified" && <Pill tone="teal">✓ {t("status.verified")}</Pill>}
                          {term.verification === "rejected" && <Pill tone="coral">{t("vf.removed")}</Pill>}
                        </div>
                        {ex.evidence && <div className="og-quote">{ex.evidence}</div>}
                        {negation && term.verification === "unverified" && (
                          <div className="og-small" style={{ marginTop: 8, color: "var(--amber)" }}>
                            ⚠ {t("vf.negationWarn")}
                          </div>
                        )}
                        {low && term.verification === "unverified" && !negation && (
                          <div className="og-small" style={{ marginTop: 8, color: "var(--amber)" }}>
                            ⚠ {t("vf.lowConfidenceWarn")}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, minWidth: 190 }}>
                        <div className="og-row" style={{ gap: 9, justifyContent: "flex-end", width: "100%" }}>
                          <span className="og-mono og-small">{Math.round((ex.confidence ?? 1) * 100)}%</span>
                          <div className="og-bar" style={{ width: 66, height: 4 }}>
                            <i style={{ width: `${(ex.confidence ?? 1) * 100}%`, background: low ? "var(--amber)" : undefined }} />
                          </div>
                        </div>
                        {term.verification === "unverified" ? (
                          <div className="og-row" style={{ gap: 6, justifyContent: "flex-end" }}>
                            <Button style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: term.hpo, decision: "verified" })}>{t("common.confirm")}</Button>
                            <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => setEditing(term)}>{t("common.edit")}</Button>
                            <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: term.hpo, decision: "rejected" })}>{t("common.remove")}</Button>
                          </div>
                        ) : (
                          <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: term.hpo, decision: term.verification === "verified" ? "rejected" : "verified" })}>
                            {term.verification === "verified" ? t("common.undo") : t("common.restore")}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="og-b og-between">
                  <span className="og-small">
                    {awaiting.length === 0
                      ? t("vf.allReviewed")
                      : t("vf.stillAwaiting", { n: awaiting.length })}
                  </span>
                  <div className="og-row">
                    {awaiting.length > 0 && (
                      <Button variant="ghost" onClick={() => {
                        awaiting.forEach((x) => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: x.hpo, decision: "verified" }));
                        toast({ title: t("vf.allConfirmedToast"), tone: "info" });
                      }}>{t("vf.confirmAll")}</Button>
                    )}
                    {awaiting.length === 0 && <FindMatches record={c} />}
                    <Link href={`/cases/${c.id}`}><Button variant="ghost">{t("vf.backToCase")}</Button></Link>
                  </div>
                </div>
              </Panel>
            )
          )}
        </div>

        <aside className="og-stack">
          <Panel title={t("vf.humanTitle")}>
            <p className="og-small" style={{ marginTop: 0 }}>
              {t("vf.humanBody")}
            </p>
            <div className="og-stack" style={{ marginTop: 14 }}>
              {[
                [t("vf.rowExtracted"), t("vf.rowExtractedD"), proposed.length],
                [t("vf.rowVerified"), t("vf.rowVerifiedD"), proposed.filter((p) => p.verification === "verified").length],
                [t("vf.rowRemoved"), t("vf.rowRemovedD"), proposed.filter((p) => p.verification === "rejected").length],
              ].map(([t, d, n]) => (
                <div key={String(t)} className="og-between" style={{ paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>{t}</span>
                    <span className="og-small">{d}</span>
                  </span>
                  <span className="og-num" style={{ fontSize: 20 }}>{n as number}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title={t("vf.whyTitle")}>
            <p className="og-small" style={{ marginTop: 0 }}>
              {t("vf.whyBody")}
            </p>
          </Panel>
        </aside>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={t("vf.editTitle")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
            <Button onClick={() => {
              if (!editing) return;
              dispatch({ type: "editPhenotype", caseId: c.id, hpo: editing.hpo, patch: { term: editing.term, onset: editing.onset, severity: editing.severity, status: editing.status } });
              toast({ title: t("vf.editedToast"), body: C(editing.term) });
              setEditing(null);
            }}>{t("vf.editSave")}</Button>
          </>
        }
      >
        {editing && (
          <div className="og-stack">
            <Field label={t("vf.fTerm")}><input className="og-input" value={editing.term} onChange={(e) => setEditing({ ...editing, term: e.target.value })} /></Field>
            <Field label={t("vf.fOnset")} hint={t("vf.fOnsetHint")}><input className="og-input" value={editing.onset} onChange={(e) => setEditing({ ...editing, onset: e.target.value })} /></Field>
            <div className="og-grid" data-cols="2">
              <Field label={t("case.colSeverity")}>
                <select className="og-select" value={editing.severity} onChange={(e) => setEditing({ ...editing, severity: e.target.value as Phenotype["severity"] })}>
                  {["Mild", "Moderate", "Severe"].map((s) => <option key={s} value={s}>{t(`status.${s}` as "status.Mild")}</option>)}
                </select>
              </Field>
              <Field label={t("cases.colStatus")}>
                <select className="og-select" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Phenotype["status"] })}>
                  {["Present", "Absent", "Resolved"].map((s) => <option key={s} value={s}>{t(`status.${s}` as "status.Present")}</option>)}
                </select>
              </Field>
            </div>
            <p className="og-small" style={{ margin: 0 }}>{t("vf.editNote")}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
