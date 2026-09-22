"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, ScoreBar, Empty, Banner, Disclaimer, SectionHead, Modal, Field, useToast, relTime, Avatar } from "@/ui/primitives";
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
  const router = useRouter();
  const toast = useToast();
  const [asking, setAsking] = React.useState(false);
  const [note, setNote] = React.useState("");

  const m = state.matches[id];
  if (!m) return <Empty title="Match not found" body="This match is not part of the current demonstration state." action={<Link href="/matches"><Button>All matches</Button></Link>} />;

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
    toast({ title: "Connection request sent", body: `${state.doctors[target.ownerId].name} has been notified.` });
  };

  const respond = (accept: boolean) => {
    dispatch({ type: "respondConnection", matchId: m.id, accept });
    if (accept) {
      toast({ title: "Connection accepted", body: "A secure collaboration room is now open." });
      router.push(`/collaboration/col-${m.id}`);
    } else {
      toast({ title: "Request declined", tone: "info" });
    }
  };

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/matches" className="og-small og-link">Matches</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small og-mono">{m.id.slice(0, 11)}</span>
          </div>
          <div className="og-eyebrow" style={{ marginTop: 12 }}>
            {source.countryCode !== target.countryCode ? "Potential cross-border match" : "Potential match"}
          </div>
          <h1 className="og-h1" style={{ marginTop: 10 }}>{source.id} ↔ {target.id}</h1>
          <div className="og-row" style={{ gap: 12, marginTop: 14 }}>
            <Pill tone={m.score >= STRONG_THRESHOLD ? "teal" : "amber"} style={{ height: 27 }}>{m.label}</Pill>
            <span className="og-small">
              {supporting} of {m.dimensions.length} evidence groups concordant · surfaced {relTime(m.createdAt, state.clock)}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Disclaimer />
          <div className="og-num" style={{ fontSize: 46, color: "var(--teal-deep)", marginTop: 12 }}>{m.score}</div>
          <div className="og-eyebrow">evidence similarity</div>
          <div className="og-small" style={{ maxWidth: 210, marginTop: 6 }}>Not a diagnostic probability. Requires clinician review.</div>
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
                  <div style={{ fontSize: 14, fontWeight: 700 }}>New collaboration request</div>
                  <div className="og-small">
                    From {state.doctors[source.ownerId].name}, {source.country} · regarding {source.id}
                  </div>
                  {m.requestNote && <p className="og-small" style={{ marginTop: 8, fontStyle: "italic" }}>“{m.requestNote}”</p>}
                </div>
              </div>
              <div className="og-row">
                <Button onClick={() => respond(true)}>Accept</Button>
                <Button variant="ghost" onClick={() => respond(false)}>Decline</Button>
              </div>
            </div>
          </Panel>
        )}
        {m.status === "requested" && !iAmTarget && (
          <Banner tone="amber">
            <b>Connection requested.</b> Awaiting a response from {state.doctors[target.ownerId].name} ({target.country}).
            To continue the demonstration, switch clinician in the header and respond as them.
          </Banner>
        )}
        {m.status === "accepted" && collab && (
          <Banner>
            <b>Connection accepted.</b> A secure collaboration room is open for {source.id} ↔ {target.id}.{" "}
            <Link href={`/collaboration/${collab.id}`} className="og-link">Open the room</Link>
          </Banner>
        )}
        {m.status === "verified" && (
          <Banner>
            <b>Clinically corroborated.</b> Two independent clinicians verified the relevance of this connection, and a
            knowledge contribution has been recorded. <Link href="/knowledge" className="og-link">View contribution</Link>
          </Banner>
        )}
        {m.status === "declined" && <Banner tone="amber"><b>Request declined.</b> The connection was not taken forward.</Banner>}
      </div>

      {/* ---------------------------- WHY ---------------------------- */}
      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          <Panel glass title="Why this match was surfaced" meta="Assembled from the structured evidence, not generated prose">
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {m.explanation.map((e, i) => (
                <li key={i} className="ody-rise" style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 12, padding: "11px 0", borderBottom: i < m.explanation.length - 1 ? "1px solid var(--line)" : undefined, "--d": `${i * 70}ms` } as React.CSSProperties}>
                  <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.65 }}>{e}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Evidence supporting similarity" meta="Each group is scored independently from the case records">
            <div className="og-dimrow" style={{ fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", paddingTop: 0 }}>
              <span>Evidence group</span><span>Score</span><span>Weight</span><span>What was compared</span>
            </div>
            {m.dimensions.map((d, i) => (
              <div key={d.id} className="og-dimrow ody-fadein" style={{ "--d": `${i * 55}ms` } as React.CSSProperties}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.label}</div>
                  <Pill tone={d.direction === "divergent" ? "amber" : undefined} style={{ marginTop: 7, height: 20 }}>
                    {d.direction === "divergent" ? "Divergent" : "Supporting"}
                  </Pill>
                </div>
                <div className="og-num" style={{ fontSize: 22, color: d.direction === "divergent" ? "var(--amber)" : "var(--teal-deep)" }}>{d.score}</div>
                <div>
                  <ScoreBar value={d.score} tone={d.direction === "divergent" ? "amber" : "teal"} delay={i * 55} />
                  <div className="og-small" style={{ marginTop: 5 }}>weight {Math.round(d.weight * 100)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{d.summary}</div>
                  <div className="og-row" style={{ gap: 16, marginTop: 7 }}>
                    <span className="og-mono og-small">{source.countryCode} {d.aValue}</span>
                    <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{target.countryCode} {d.bValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </Panel>

          {m.divergences.length > 0 && (
            <Panel title="Where the cases diverge" meta="Recorded, not hidden — divergence is often where the insight is">
              {m.divergences.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, padding: "11px 0", borderBottom: i < m.divergences.length - 1 ? "1px solid var(--line)" : undefined }}>
                  <span style={{ color: "var(--amber)" }}>△</span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{d}</span>
                </div>
              ))}
            </Panel>
          )}
        </div>

        <aside className="og-stack">
          <Panel title="Evidence profile">
            <div style={{ display: "grid", placeItems: "center", color: "var(--ink-4)", "--radar-fill": "var(--teal)", "--radar-stroke": "var(--teal-deep)", "--radar-fill-opacity": 0.14 } as React.CSSProperties}>
              <Radar
                values={m.dimensions.map((d) => d.score)}
                labels={m.dimensions.map((d) => AXIS[d.id] ?? d.label.toUpperCase())}
                size={244}
              />
            </div>
          </Panel>

          <Panel title="The two cases">
            {[source, target].map((c, i) => (
              <div key={c.id} style={{ padding: "12px 0", borderBottom: i === 0 ? "1px solid var(--line)" : undefined }}>
                <div className="og-between">
                  <Link href={`/cases/${c.id}`} className="og-mono og-link" style={{ fontSize: 14 }}>{c.id}</Link>
                  <Pill tone={i === 1 ? "teal" : undefined}>{c.country}</Pill>
                </div>
                <div className="og-small" style={{ marginTop: 6 }}>{c.institution}</div>
                <div className="og-small">{c.clinician} · {c.ageGroup}</div>
              </div>
            ))}
          </Panel>

          <Panel glass title="Next step">
            {m.status === "surfaced" && iAmSource && (
              <>
                <p className="og-small" style={{ marginTop: 0 }}>
                  Open a secure channel with the clinician who submitted {target.id}. They decide whether to accept.
                </p>
                <div className="og-stack" style={{ marginTop: 14 }}>
                  <Button block onClick={() => setAsking(true)}>Request clinical connection</Button>
                  <Link href={`/matches/${m.id}/compare`}><Button variant="ghost" block>Compare cases first</Button></Link>
                  <Button variant="ghost" block onClick={() => { dispatch({ type: "dismissMatch", matchId: m.id }); toast({ title: "Match dismissed", tone: "info" }); router.push("/matches"); }}>
                    Not a match
                  </Button>
                </div>
              </>
            )}
            {m.status === "surfaced" && !iAmSource && (
              <p className="og-small" style={{ marginTop: 0 }}>
                This match was surfaced for {state.doctors[source.ownerId].name}. Switch clinician to act on it.
              </p>
            )}
            {m.status === "requested" && (
              <p className="og-small" style={{ marginTop: 0 }}>
                {iAmTarget ? "Accept or decline the request above." : `Waiting for ${state.doctors[target.ownerId].name} to respond.`}
              </p>
            )}
            {(m.status === "accepted" || m.status === "verified") && collab && (
              <div className="og-stack">
                <Link href={`/collaboration/${collab.id}`}><Button block>Open collaboration room</Button></Link>
                <Link href={`/matches/${m.id}/compare`}><Button variant="ghost" block>Compare cases</Button></Link>
              </div>
            )}
          </Panel>

          <Panel title="How this was found">
            {[
              ["Structured signals extracted", `${m.dimensions.length} evidence groups normalised to HPO, HGVS and local units`],
              ["Federated query dispatched", "Member institutions scored locally — no identifiable data transferred"],
              ["Candidate screening", `${Object.keys(state.cases).length - 1} records evaluated against this case`],
              ["Evidence comparison", `${target.id} ranked highest on ${supporting} of ${m.dimensions.length} groups`],
              ["Human review required", "No conclusion is drawn by the system"],
            ].map(([t, d], i) => (
              <div key={String(t)} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, paddingBottom: 13 }}>
                <span className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t}</div>
                  <div className="og-small" style={{ marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </Panel>
        </aside>
      </div>

      <Modal
        open={asking}
        onClose={() => setAsking(false)}
        title="Request clinical connection"
        footer={<><Button variant="ghost" onClick={() => setAsking(false)}>Cancel</Button><Button onClick={request}>Send request</Button></>}
      >
        <p className="og-small" style={{ marginTop: 0 }}>
          A request is sent to <b>{state.doctors[target.ownerId].name}</b> at {target.institution}. No patient-identifiable
          information is shared — only the structured comparison you are both looking at.
        </p>
        <div style={{ marginTop: 16 }}>
          <Field label="Message to the clinician" hint="Optional. What you would like to establish together.">
            <textarea
              className="og-textarea" rows={4}
              placeholder="e.g. Our case carries the same coding variant but we never found a second allele. Did long-read sequencing change anything for you?"
              value={note} onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
