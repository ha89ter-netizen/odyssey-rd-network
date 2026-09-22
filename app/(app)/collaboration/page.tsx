"use client";

import Link from "next/link";
import { useStore, selectCollaborationsOf } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer, Avatar } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";

export default function CollaborationListPage() {
  const { state } = useStore();
  const { t, C } = useI18n();
  const relTime = useRelTime();
  const me = state.currentDoctorId!;
  const rooms = selectCollaborationsOf(state, me);

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">{t("co.secure")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("nav.collaboration")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("co.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <SectionHead label={t("co.yourRooms")} note={t("co.open", { n: rooms.length })} />
        <Panel padded={false}>
          {rooms.length === 0 ? (
            <Empty
              title={t("co.none")}
              body={t("co.noneBody")}
              icon="◈"
              action={<Link href="/matches"><Button>{t("co.viewMatches")}</Button></Link>}
            />
          ) : rooms.map((c) => {
            const other = c.doctorAId === me ? state.doctors[c.doctorBId] : state.doctors[c.doctorAId];
            const verified = c.verifications.length;
            return (
              <Link key={c.id} href={`/collaboration/${c.id}`} className="og-listrow" style={{ gridTemplateColumns: "44px 1fr 170px 130px" }}>
                <Avatar initials={other.initials} side={other.id === "doc-a" ? "a" : "b"} />
                <span>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{c.caseAId} ↔ {c.caseBId}</span>
                  <span className="og-small">{t("co.with", { name: C(other.name), country: C(other.country), t: relTime(c.openedAt, state.clock) })}</span>
                </span>
                <span className="og-small">{t("co.messages", { n: c.messages.length })}</span>
                <Pill tone={verified >= 2 ? "teal" : verified === 1 ? "amber" : "ice"}>
                  {verified >= 2 ? t("co.corroborated") : t("co.verifiedOf", { n: verified })}
                </Pill>
              </Link>
            );
          })}
        </Panel>
      </div>
    </>
  );
}
