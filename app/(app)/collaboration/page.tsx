"use client";

import Link from "next/link";
import { useStore, selectCollaborationsOf } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer, relTime, Avatar } from "@/ui/primitives";

export default function CollaborationListPage() {
  const { state } = useStore();
  const me = state.currentDoctorId!;
  const rooms = selectCollaborationsOf(state, me);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">Secure clinical collaboration</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Collaboration</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            Rooms open only when both clinicians agree to connect. No identifiable patient data is exchanged; the
            record of what was decided is immutable.
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <SectionHead label="Your rooms" note={`${rooms.length} open`} />
        <Panel padded={false}>
          {rooms.length === 0 ? (
            <Empty
              title="No collaborations yet"
              body="Review a potential match and request a clinical connection. When the other clinician accepts, a room opens here."
              icon="◈"
              action={<Link href="/matches"><Button>View matches</Button></Link>}
            />
          ) : rooms.map((c) => {
            const other = c.doctorAId === me ? state.doctors[c.doctorBId] : state.doctors[c.doctorAId];
            const verified = c.verifications.length;
            return (
              <Link key={c.id} href={`/collaboration/${c.id}`} className="og-listrow" style={{ gridTemplateColumns: "44px 1fr 170px 130px" }}>
                <Avatar initials={other.initials} side={other.id === "doc-a" ? "a" : "b"} />
                <span>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{c.caseAId} ↔ {c.caseBId}</span>
                  <span className="og-small">With {other.name}, {other.country} · opened {relTime(c.openedAt, state.clock)}</span>
                </span>
                <span className="og-small">{c.messages.length} messages</span>
                <Pill tone={verified >= 2 ? "teal" : verified === 1 ? "amber" : "ice"}>
                  {verified >= 2 ? "Corroborated" : `${verified} of 2 verified`}
                </Pill>
              </Link>
            );
          })}
        </Panel>
      </div>
    </>
  );
}
