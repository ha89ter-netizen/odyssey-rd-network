"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/store/store";
import {
  Panel, Button, Pill, Empty, Banner, Disclaimer, Tabs, StepBar, Modal, Field,
  useToast, relTime, absTime, Avatar, ScoreBar,
} from "@/ui/primitives";
import { TrajectoryChart } from "@/components/kit";
import { buildComparison } from "@/lib/compare";

type EvTab = "summary" | "phenotype" | "timeline" | "documents";
const STAGES = ["Match proposed", "Evidence review", "Joint assessment", "Verification", "Confirmed connection"];

export default function CollaborationRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
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

  if (!col) return <Empty title="Room not found" body="This collaboration is not part of the current demonstration state." action={<Link href="/collaboration"><Button>All rooms</Button></Link>} />;

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
    dispatch({ type: "verifyRelevance", collaborationId: col.id, notes: notes.trim() || "Clinical relevance confirmed on the evidence presented." });
    setVerifying(false);
    setNotes("");
    toast({
      title: "Clinical relevance confirmed",
      body: col.verifications.length >= 1 ? "Both clinicians have verified — a knowledge contribution has been recorded." : "The second clinician has been asked to verify.",
    });
  };

  const groups = buildComparison(a, b);
  const phenotypeRows = groups.find((g) => g.group === "Phenotype")?.rows ?? [];
  const keys = ["hypotonia", "developmentalDelay", "plateau", "seizureOnset", "regression", "imagingChange"];
  const labels = ["Hypotonia", "Developmental delay", "Plateau", "Seizure onset", "Regression", "Imaging change"];
  const av = keys.map((k) => a.milestones[k] ?? 0);
  const bv = keys.map((k) => b.milestones[k] ?? 0);
  const plottable = av.every((v) => v > 0) && bv.every((v) => v > 0);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/collaboration" className="og-small og-link">Collaboration</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{col.id.slice(0, 11)}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{a.id} ↔ {b.id}</h1>
          <div className="og-row" style={{ gap: 10, marginTop: 12 }}>
            <Pill tone="teal">◈ End-to-end encrypted</Pill>
            <Pill>Opened {relTime(col.openedAt, state.clock)}</Pill>
            <Pill>Audit log immutable</Pill>
          </div>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end", alignItems: "flex-start" }}>
          <Disclaimer />
          {[docA, docB].map((d, i) => (
            <div key={d.id} className="og-flat" style={{ padding: "12px 16px", minWidth: 190 }}>
              <div className="og-row" style={{ gap: 11 }}>
                <Avatar initials={d.initials} side={i === 0 ? "a" : "b"} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}{d.id === me ? " (you)" : ""}</div>
                  <div className="og-small">{d.city}, {d.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="og-sec">
        <Panel glass><StepBar stages={STAGES} index={col.stageIndex} /></Panel>
      </div>

      {bothVerified && (
        <div className="og-sec">
          <Banner>
            <b>Clinically corroborated.</b> Both clinicians verified that this connection is clinically meaningful.
            A knowledge contribution has been recorded in the network.{" "}
            <Link href="/knowledge" className="og-link">View it</Link>
          </Banner>
        </div>
      )}

      <div className="og-sec og-grid" data-cols="2">
        {/* ------------------------- evidence stays visible ------------------------- */}
        <div>
          <Tabs
            tabs={[
              { id: "summary", label: "Case summary" },
              { id: "phenotype", label: "Phenotype comparison" },
              { id: "timeline", label: "Timeline comparison" },
              { id: "documents", label: "Documents" },
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
                      <Pill tone={i === 1 ? "teal" : undefined}>{c.country}</Pill>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", marginTop: 8 }}>{c.headline}</p>
                    <div className="og-small">{c.institution} · {c.ageGroup} · {c.status}</div>
                  </div>
                ))}
                {match && (
                  <div>
                    <div className="og-eyebrow">Evidence similarity</div>
                    <div className="og-row" style={{ gap: 14, marginTop: 8 }}>
                      <span className="og-num" style={{ fontSize: 30, color: "var(--teal-deep)" }}>{match.score}</span>
                      <span className="og-small" style={{ maxWidth: "36ch" }}>
                        {match.label} · {match.dimensions.filter((d) => d.direction === "supporting").length} of {match.dimensions.length} groups concordant.
                        Not a diagnosis.
                      </span>
                    </div>
                    <div className="og-stack" style={{ marginTop: 14 }}>
                      {match.dimensions.map((d) => (
                        <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 54px 34px", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 12.5 }}>{d.label}</span>
                          <ScoreBar value={d.score} tone={d.direction === "divergent" ? "amber" : "teal"} />
                          <span className="og-mono og-small" style={{ textAlign: "right" }}>{d.score}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href={`/matches/${match.id}/compare`} className="og-small og-link">Open full comparison →</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "phenotype" && (
              <table className="og-table">
                <thead><tr><th>Term</th><th>{a.id}</th><th>{b.id}</th></tr></thead>
                <tbody>
                  {phenotypeRows.map((r, i) => (
                    <tr key={r.label + i}>
                      <td style={{ fontWeight: 600 }}>{r.label}</td>
                      <td className="og-small" style={{ color: r.a === "Not recorded" ? "var(--ink-4)" : undefined }}>{r.a}</td>
                      <td className="og-small" style={{ color: r.b === "Not recorded" ? "var(--ink-4)" : r.agreement === "only-b" ? "var(--teal-deep)" : undefined }}>{r.b}</td>
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
                    <span className="og-small" style={{ marginLeft: "auto" }}>Months from birth</span>
                  </div>
                </>
              ) : <p className="og-small">Not enough milestone data in both cases to plot a trajectory.</p>
            )}

            {tab === "documents" && (
              <div className="og-stack">
                {col.documents.map((d) => (
                  <div key={d.label} className="og-flat" style={{ padding: "12px 14px" }}>
                    <div className="og-between">
                      <span className="og-mono" style={{ fontSize: 12.5 }}>{d.label}</span>
                      <Pill>{d.kind}</Pill>
                    </div>
                    <div className="og-small" style={{ marginTop: 4 }}>{d.meta}</div>
                  </div>
                ))}
                <p className="og-small" style={{ margin: 0 }}>
                  Only structured summaries are exchanged. Source documents, images and sequence files remain at the
                  originating institution.
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* ------------------------- discussion & decisions ------------------------- */}
        <div className="og-stack">
          <Panel title="Clinical discussion" meta="No identifiable patient data is exchanged in this room" padded={false}>
            <div ref={threadRef} style={{ maxHeight: 420, overflowY: "auto", padding: "4px 18px" }}>
              {col.messages.map((msg) => {
                if (msg.author === "system") {
                  return (
                    <div key={msg.id} className="og-msg" data-side="system">
                      <div>
                        <div className="og-eyebrow">System · {relTime(msg.at, state.clock)}</div>
                        <p className="og-small" style={{ margin: "6px 0 0" }}>{msg.body}</p>
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
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{d.name}{d.id === me ? " (you)" : ""}</span>
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
                    placeholder="Write a clinical note…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
                  />
                  <Button onClick={send} disabled={!draft.trim()}>Send</Button>
                </div>
              ) : (
                <p className="og-small" style={{ margin: 0 }}>You are not a participant in this room.</p>
              )}
              {iAmParticipant && <div className="og-small" style={{ marginTop: 8 }}>⌘↵ to send</div>}
            </div>
          </Panel>

          <Panel glass title="Verification status" action={<Pill tone={bothVerified ? "teal" : "amber"}>{col.verifications.length} of 2</Pill>}>
            {[docA, docB].map((d) => {
              const v = col.verifications.find((x) => x.by === d.id);
              return (
                <div key={d.id} style={{ display: "flex", gap: 11, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: v ? "var(--teal-deep)" : "var(--amber)" }}>{v ? "✓" : "○"}</span>
                  <div>
                    <div style={{ fontSize: 13 }}>{v ? `Confirmed by ${d.name}` : `Pending — ${d.name}`}</div>
                    <div className="og-small" style={{ marginTop: 3 }}>
                      {v ? v.notes : "Awaiting assessment of clinical relevance"}
                    </div>
                    {v && <div className="og-small og-mono" style={{ marginTop: 3 }}>{absTime(v.at)}</div>}
                  </div>
                </div>
              );
            })}
            <p className="og-small" style={{ marginTop: 12 }}>
              A connection enters the network record only when two independent clinicians verify it. Verifying confirms
              that the <b>case connection</b> is clinically relevant — it is not a diagnosis for either patient.
            </p>
            {iAmParticipant && !myVerification && (
              <Button block style={{ marginTop: 14 }} onClick={() => setVerifying(true)}>Verify clinical relevance</Button>
            )}
            {myVerification && !bothVerified && (
              <Banner tone="amber">
                You have verified. Switch clinician in the header and verify as {me === col.doctorAId ? docB.name : docA.name} to
                complete the demonstration.
              </Banner>
            )}
          </Panel>

          <Panel title="Decision log" meta="Immutable" padded={false}>
            {col.decisionLog.map((d) => (
              <div key={d.id} className="og-listrow" style={{ gridTemplateColumns: "18px 1fr auto" }}>
                <span style={{ color: d.state === "done" ? "var(--teal-deep)" : d.state === "pending" ? "var(--amber)" : "var(--ink-4)", fontSize: 11 }}>
                  {d.state === "done" ? "■" : "□"}
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 12.5, color: d.state === "blocked" ? "var(--ink-4)" : undefined }}>{d.action}</span>
                  <span className="og-small">{d.actor}</span>
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
        title="Verify clinical relevance"
        footer={<><Button variant="ghost" onClick={() => setVerifying(false)}>Cancel</Button><Button onClick={submitVerification}>Confirm clinical relevance</Button></>}
      >
        <Banner tone="amber">
          <b>This is not a diagnosis.</b> You are confirming that the connection between {a.id} and {b.id} is
          clinically meaningful and worth recording — not that either patient has a particular disease.
        </Banner>
        <div style={{ marginTop: 16 }}>
          <Field label="Verification notes" hint="Recorded permanently in the decision log and the knowledge contribution.">
            <textarea
              className="og-textarea" rows={4}
              placeholder="e.g. The shared variant, identical imaging pattern and matched trajectory make a common mechanism likely. Targeted re-analysis is justified."
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
