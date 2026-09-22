"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, selectNotificationsOf } from "@/store/store";
import { Panel, Button, Pill, Empty, SectionHead, Disclaimer, relTime } from "@/ui/primitives";

const KIND_LABEL: Record<string, string> = {
  match: "Potential match",
  "connection-request": "Connection request",
  "connection-accepted": "Connection accepted",
  "connection-declined": "Connection declined",
  "verification-requested": "Verification requested",
  "verification-complete": "Verification complete",
  contribution: "Knowledge contribution",
};

export default function NotificationsPage() {
  const { state, dispatch } = useStore();
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
          <div className="og-eyebrow">Activity</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Notifications</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {unread > 0 ? `${unread} unread.` : "Nothing unread."} Everything the network has raised for you, newest first.
          </p>
        </div>
        <div className="og-row" style={{ justifyContent: "flex-end" }}>
          <Disclaimer />
          {unread > 0 && <Button variant="ghost" onClick={() => dispatch({ type: "readAllNotifications" })}>Mark all read</Button>}
        </div>
      </header>

      <div className="og-sec">
        <SectionHead label="Inbox" note={`${items.length} item${items.length === 1 ? "" : "s"}`} />
        <Panel padded={false}>
          {items.length === 0 ? (
            <Empty
              title="Nothing yet"
              body="Notifications appear when the network surfaces a match, a colleague requests a connection, or a verification completes."
              icon="◔"
              action={<Link href="/cases"><Button>Go to cases</Button></Link>}
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
                <span style={{ display: "block", fontSize: 13.5, fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
                <span className="og-small">{n.detail}</span>
              </span>
              <Pill tone={n.kind === "contribution" ? "teal" : n.kind === "connection-request" ? "amber" : undefined}>
                {KIND_LABEL[n.kind] ?? n.kind}
              </Pill>
              <span className="og-mono og-small" style={{ textAlign: "right" }}>{relTime(n.createdAt, state.clock)}</span>
            </button>
          ))}
        </Panel>
      </div>
    </>
  );
}
