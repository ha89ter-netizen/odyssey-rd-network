"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, SectionHead, Pill, Button, Empty, Banner, Modal, Field, useToast, Disclaimer, StepBar } from "@/ui/primitives";
import { FindMatches } from "@/components/FindMatches";
import { DEMO_DOCUMENTS, extractFrom, LOW_CONFIDENCE, likelyNegation, type ExtractedTerm } from "@/store/extraction";
import type { Phenotype } from "@/store/types";

type Phase = "choose" | "uploaded" | "analyzing" | "complete";

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
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

  if (!c) return <Empty title="Case not found" body={`No case with reference ${id}.`} action={<Link href="/cases"><Button>Back to cases</Button></Link>} />;

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
      toast({ title: "AI-assisted extraction complete", body: `${terms.length} phenotype terms proposed — each needs your verification.` });
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
            <Link href="/cases" className="og-small og-link">Cases</Link>
            <span className="og-small" aria-hidden>/</span>
            <Link href={`/cases/${c.id}`} className="og-small og-link og-mono">{c.id}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">Document &amp; extraction</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>AI-assisted extraction</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            The document is parsed locally. The assistant proposes phenotype terms and shows the sentence each was
            drawn from — nothing enters the case, or the matching index, until you confirm it.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <Panel glass>
          <StepBar stages={["Upload document", "Simulated extraction", "Clinician verification", "Ready for matching"]} index={stageIndex} />
        </Panel>
      </div>

      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          {phase === "choose" && (
            <Panel title="Upload medical report" meta="Synthetic documents only">
              <div className="og-stack">
                {DEMO_DOCUMENTS.map((d) => (
                  <button key={d.id} className="og-docoption" data-on={docId === d.id} onClick={() => setDocId(d.id)}>
                    <span style={{ fontSize: 18 }} aria-hidden>▤</span>
                    <span>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{d.label}</span>
                      <span className="og-small og-mono">{d.fileName} · {d.pages} pages · {d.sizeLabel}</span>
                      <span className="og-small" style={{ display: "block", marginTop: 4 }}>{d.description}</span>
                    </span>
                    <Pill tone={docId === d.id ? "teal" : undefined}>{docId === d.id ? "Selected" : "Select"}</Pill>
                  </button>
                ))}

                <div className="og-drop">
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Or choose a file from your machine</div>
                  <p className="og-small" style={{ maxWidth: "52ch", margin: "8px auto 14px" }}>
                    Nothing is uploaded anywhere. The file never leaves this browser — the demo uses the selected
                    synthetic report above so that extraction stays deterministic.
                  </p>
                  <label>
                    <input type="file" style={{ display: "none" }} onChange={onPick} accept=".pdf,.txt,.doc,.docx" />
                    <span className="og-btn" data-variant="ghost" style={{ cursor: "pointer" }}>Choose file…</span>
                  </label>
                </div>

                <div className="og-between">
                  <span className="og-small">Selected: <b className="og-mono">{DEMO_DOCUMENTS.find((d) => d.id === docId)?.fileName}</b></span>
                  <Button onClick={() => startUpload(DEMO_DOCUMENTS.find((d) => d.id === docId)!.fileName, docId)}>
                    Upload &amp; extract
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {(phase === "uploaded" || phase === "analyzing") && (
            <Panel glass title={phase === "uploaded" ? "Document uploaded" : "Analyzing clinical information…"} meta={fileName}>
              <div className={phase === "analyzing" ? "og-scan" : undefined} style={{ padding: "8px 0 4px" }}>
                <div className="og-prog"><i style={{ width: `${Math.max(8, progress)}%` }} /></div>
              </div>
              <div className="og-stack" style={{ marginTop: 16 }}>
                {[
                  ["Document received", phase !== "uploaded"],
                  ["Text layer parsed", progress >= 40],
                  ["Candidate terms mapped to HPO", progress >= 66],
                  ["Source sentences attached", progress >= 88],
                ].map(([label, done]) => (
                  <div key={String(label)} className="og-row" style={{ gap: 12, opacity: done ? 1 : 0.4 }}>
                    <span style={{ color: done ? "var(--teal-deep)" : "var(--ink-3)" }}>{done ? "✓" : "○"}</span>
                    <span style={{ fontSize: 13 }}>{label}</span>
                  </div>
                ))}
              </div>
              <Banner tone="amber">
                <b>SIMULATED AI EXTRACTION.</b> No medical model is called. This demonstration maps a fixed synthetic
                document to a fixed list of proposed terms so the result is identical every time.
              </Banner>
            </Panel>
          )}

          {phase === "complete" && (
            proposed.length === 0 ? (
              <Empty title="Nothing proposed" body="The extraction returned no candidate terms for this document." icon="◌"
                action={<Button onClick={() => setPhase("choose")}>Try another document</Button>} />
            ) : (
              <Panel
                title="Detected clinical signals"
                meta={`${proposed.length} proposed · ${reviewed} reviewed · ${awaiting.length} awaiting you`}
                action={
                  <div className="og-row" style={{ gap: 8 }}>
                    <Pill tone="amber">SIMULATED AI EXTRACTION</Pill>
                    <Pill tone={awaiting.length ? "amber" : "teal"}>{awaiting.length ? "Verification required" : "All verified"}</Pill>
                  </div>
                }
                padded={false}
              >
                <div style={{ padding: "16px 18px 0" }}>
                  <Banner tone="amber">
                    <b>SIMULATED AI EXTRACTION · AI extracted → Doctor verified.</b> No medical model was called:
                    a fixed synthetic document maps to a fixed list of proposals. Confidence describes how sure the
                    parser is about the sentence, not about the patient. Only confirmed terms are indexed and matched.
                  </Banner>
                </div>

                {proposed.map((t) => {
                  const ex = t as ExtractedTerm;
                  const low = (ex.confidence ?? 1) < LOW_CONFIDENCE;
                  const negation = ex.evidence ? likelyNegation(ex) : false;
                  return (
                    <div key={t.hpo} className="og-term" style={{ alignItems: "start" }}>
                      <div>
                        <div className="og-row" style={{ gap: 11 }}>
                          <span style={{ fontSize: 14.5, fontWeight: 700, textDecoration: t.verification === "rejected" ? "line-through" : undefined, color: t.verification === "rejected" ? "var(--ink-4)" : undefined }}>
                            {t.term}
                          </span>
                          <span className="og-mono og-small">{t.hpo}</span>
                          {ex.page && <span className="og-mono og-small">{ex.page}</span>}
                          {t.verification === "verified" && <Pill tone="teal">✓ Doctor verified</Pill>}
                          {t.verification === "rejected" && <Pill tone="coral">Removed</Pill>}
                        </div>
                        {ex.evidence && <div className="og-quote">{ex.evidence}</div>}
                        {negation && t.verification === "unverified" && (
                          <div className="og-small" style={{ marginTop: 8, color: "var(--amber)" }}>
                            ⚠ The source sentence looks like a negation — check before confirming.
                          </div>
                        )}
                        {low && t.verification === "unverified" && !negation && (
                          <div className="og-small" style={{ marginTop: 8, color: "var(--amber)" }}>
                            ⚠ Low parser confidence — the wording was ambiguous.
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
                        {t.verification === "unverified" ? (
                          <div className="og-row" style={{ gap: 6, justifyContent: "flex-end" }}>
                            <Button style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: t.hpo, decision: "verified" })}>Confirm</Button>
                            <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => setEditing(t)}>Edit</Button>
                            <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: t.hpo, decision: "rejected" })}>Remove</Button>
                          </div>
                        ) : (
                          <Button variant="ghost" style={{ height: 30, fontSize: 12 }} onClick={() => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: t.hpo, decision: t.verification === "verified" ? "rejected" : "verified" })}>
                            {t.verification === "verified" ? "Undo" : "Restore"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="og-b og-between">
                  <span className="og-small">
                    {awaiting.length === 0
                      ? "Every proposed term has been reviewed. The case is ready for network matching."
                      : `${awaiting.length} term${awaiting.length === 1 ? "" : "s"} still need your decision.`}
                  </span>
                  <div className="og-row">
                    {awaiting.length > 0 && (
                      <Button variant="ghost" onClick={() => {
                        awaiting.forEach((t) => dispatch({ type: "reviewPhenotype", caseId: c.id, hpo: t.hpo, decision: "verified" }));
                        toast({ title: "All remaining terms confirmed", tone: "info" });
                      }}>Confirm all remaining</Button>
                    )}
                    {awaiting.length === 0 && <FindMatches record={c} label="Find matches" />}
                    <Link href={`/cases/${c.id}`}><Button variant="ghost">Back to case</Button></Link>
                  </div>
                </div>
              </Panel>
            )
          )}
        </div>

        <aside className="og-stack">
          <Panel title="Human in the loop">
            <p className="og-small" style={{ marginTop: 0 }}>
              ODYSSEY never adds a clinical finding on its own. Extraction is assistive: it reads, proposes and cites.
              A clinician decides.
            </p>
            <div className="og-stack" style={{ marginTop: 14 }}>
              {[
                ["AI extracted", "Proposed from the document, with its source sentence", proposed.length],
                ["Doctor verified", "Confirmed by you — indexed and matchable", proposed.filter((p) => p.verification === "verified").length],
                ["Removed", "Rejected by you — never indexed", proposed.filter((p) => p.verification === "rejected").length],
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

          <Panel title="Why this matters">
            <p className="og-small" style={{ marginTop: 0 }}>
              An unverified term can still be wrong in a way only a clinician spots — a negated sentence, a
              second-hand report, a finding that belongs to a sibling. Verification is what makes the network record
              trustworthy.
            </p>
          </Panel>
        </aside>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit proposed term"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!editing) return;
              dispatch({ type: "editPhenotype", caseId: c.id, hpo: editing.hpo, patch: { term: editing.term, onset: editing.onset, severity: editing.severity, status: editing.status } });
              toast({ title: "Term edited and confirmed", body: editing.term });
              setEditing(null);
            }}>Save &amp; confirm</Button>
          </>
        }
      >
        {editing && (
          <div className="og-stack">
            <Field label="Term"><input className="og-input" value={editing.term} onChange={(e) => setEditing({ ...editing, term: e.target.value })} /></Field>
            <Field label="Age at onset" hint="As recorded in the clinical record."><input className="og-input" value={editing.onset} onChange={(e) => setEditing({ ...editing, onset: e.target.value })} /></Field>
            <div className="og-grid" data-cols="2">
              <Field label="Severity">
                <select className="og-select" value={editing.severity} onChange={(e) => setEditing({ ...editing, severity: e.target.value as Phenotype["severity"] })}>
                  {["Mild", "Moderate", "Severe"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className="og-select" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Phenotype["status"] })}>
                  {["Present", "Absent", "Resolved"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <p className="og-small" style={{ margin: 0 }}>Saving records the term as clinician-verified with your edits.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
