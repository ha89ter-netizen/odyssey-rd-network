"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, selectNotificationsOf } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer } from "@/ui/primitives";
import { useI18n, useRelTime } from "@/i18n/i18n";

export default function NotificationsPage() {
  const { state, dispatch } = useStore();
  const { t } = useI18n();
  const relTime = useRelTime();
  const router = useRouter();
  const me = state.currentDoctorId!;
  const items = selectNotificationsOf(state, me);
  const unread = items.filter((n) => !n.read).length;

  const open = (id: string, href: string) => {
    dispatch({ type: "readNotification", id });
    router.push(href);
  };

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-eyebrow">{t("nt.eyebrow")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("nt.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {unread > 0 ? t("nt.unread", { n: unread }) : t("nt.allRead")} {t("nt.lede")}
          </p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          {unread > 0 && <Button variant="ghost" onClick={() => dispatch({ type: "readAllNotifications" })}>{t("nt.markAll")}</Button>}
        </div>
      </header>

      <div className="og-sec">
        <SectionHead label={t("nt.inbox")} note={t("nt.items", { n: items.length })} />
        <Panel padded={false}>
          {items.length === 0 ? (
            <Empty
              title={t("nt.none")}
              body={t("nt.noneBody")}
              icon="◔"
              action={<Link href="/cases"><Button>{t("nt.goToCases")}</Button></Link>}
            />
          ) : items.map((n) => (
            <button
              key={n.id}
              onClick={() => open(n.id, n.href)}
              className="og-listrow"
              style={{ gridTemplateColumns: "10px 1fr 160px 100px", width: "100%", textAlign: "left", background: n.read ? "transparent" : "rgba(47,157,140,0.05)", border: 0, borderBottom: "1px solid var(--line)", cursor: "pointer" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: n.read ? "var(--line-2)" : "var(--teal)" }} />
              <span>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: n.read ? 500 : 700 }}>{t(n.titleKey as "ntf.match", n.titleParams)}</span>
                <span className="og-small">{t(n.detailKey as "ntf.matchBody", n.detailParams)}</span>
              </span>
              <Pill tone={n.kind === "contribution" ? "teal" : n.kind === "connection-request" ? "amber" : undefined}>
                {t(`nt.kind.${n.kind}` as "nt.kind.match")}
              </Pill>
              <span className="og-mono og-small" style={{ textAlign: "right" }}>{relTime(n.createdAt, state.clock)}</span>
            </button>
          ))}
        </Panel>
      </div>
    </>
  );
}
