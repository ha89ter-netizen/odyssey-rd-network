"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "@/ui/theme.css";
import "@/ui/app.css";
import { NodeField } from "@/components/kit";
import { Avatar, Modal, Button } from "@/ui/primitives";
import { DISCLAIMER } from "@/data/odyssey";
import {
  useStore, selectOpenMatches, selectCollaborationsOf, selectUnread, selectVerificationTasks,
} from "@/store/store";
import type { DoctorId } from "@/store/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cases", label: "Cases" },
  { href: "/matches", label: "Matches", count: "matches" as const },
  { href: "/collaboration", label: "Collaboration", count: "collab" as const },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/network", label: "Network" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, dispatch, ready } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [switching, setSwitching] = React.useState(false);
  const [menu, setMenu] = React.useState(false);

  const id = state.currentDoctorId;

  // Nobody has entered the demo yet — send them to the door.
  React.useEffect(() => {
    if (ready && !id) router.replace("/enter");
  }, [ready, id, router]);

  if (!ready || !id) {
    return (
      <div className="og og-app" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div className="og-small">Loading demonstration environment…</div>
      </div>
    );
  }

  const doctor = state.doctors[id];
  const counts = {
    matches: selectOpenMatches(state, id).length + selectVerificationTasks(state, id).filter((t) => t.kind === "request").length,
    collab: selectCollaborationsOf(state, id).length,
  };
  const unread = selectUnread(state, id);

  const switchTo = (to: DoctorId) => {
    dispatch({ type: "switchDoctor", doctorId: to });
    setSwitching(false);
    router.push("/dashboard");
  };

  return (
    <div className="og og-app ody-surface">
      <div className="og-atmos" aria-hidden>
        <NodeField seed={41} count={40} className="og-atmos-net" />
      </div>

      <div className="og-shell">
        <div className="og-disclaimer-bar">◆ {DISCLAIMER} · SYNTHETIC RECORDS ONLY</div>

        <header className="og-top">
          <Link href="/dashboard" className="og-brandmark">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M6 3c0 5 10 5 10 10M16 3c0 5-10 5-10 10M6 19c0-3 10-3 10-6" stroke="var(--teal)" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="6" cy="3" r="1.7" fill="var(--ice)" /><circle cx="16" cy="3" r="1.7" fill="var(--ice)" />
              <circle cx="11" cy="13" r="1.7" fill="var(--teal)" />
            </svg>
            ODYSSEY
          </Link>

          <nav className="og-nav" aria-label="Primary">
            {NAV.map((n) => {
              const on = pathname === n.href || pathname.startsWith(n.href + "/");
              const c = n.count ? counts[n.count] : 0;
              return (
                <Link key={n.href} href={n.href} className="og-navlink" data-on={on}>
                  {n.label}
                  {c > 0 && <span className="og-navcount">{c}</span>}
                </Link>
              );
            })}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/notifications" className="og-iconbtn" data-dot={unread > 0} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M4 6.5a4 4 0 0 1 8 0c0 3 1 4 1 4H3s1-1 1-4Z" /><path d="M6.6 13a1.6 1.6 0 0 0 2.8 0" />
              </svg>
            </Link>

            <button className="og-whochip" onClick={() => setSwitching(true)} aria-label="Switch demo clinician">
              <Avatar initials={doctor.initials} side={doctor.id === "doc-a" ? "a" : "b"} />
              <span>{doctor.countryCode} · {doctor.name.replace("Dr. ", "")}</span>
            </button>

            <div style={{ position: "relative" }}>
              <button className="og-iconbtn" onClick={() => setMenu((v) => !v)} aria-label="More">⋯</button>
              {menu && (
                <div
                  className="og-glass"
                  style={{ position: "absolute", right: 0, top: 40, zIndex: 60, minWidth: 190, padding: 6, borderRadius: 12 }}
                  onMouseLeave={() => setMenu(false)}
                >
                  {[["/settings", "Settings"], ["/admin", "Admin & audit"]].map(([href, label]) => (
                    <Link key={href} href={href} className="og-navlink" style={{ display: "block", borderRadius: 8 }} onClick={() => setMenu(false)}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="og-shell-main">
          <div className="og-page">{children}</div>
        </main>
      </div>

      <Modal
        open={switching}
        onClose={() => setSwitching(false)}
        title="Switch clinician"
        footer={<Button variant="ghost" onClick={() => setSwitching(false)}>Cancel</Button>}
      >
        <p className="og-small" style={{ marginTop: 0 }}>
          The demonstration has two clinicians on opposite sides of the network. Switching changes whose cases,
          notifications and verification tasks you see — the underlying data is shared.
        </p>
        <div className="og-stack" style={{ marginTop: 16 }}>
          {(Object.values(state.doctors)).map((d) => (
            <button
              key={d.id}
              className="og-docoption"
              data-on={d.id === id}
              onClick={() => switchTo(d.id)}
            >
              <Avatar initials={d.initials} side={d.id === "doc-a" ? "a" : "b"} />
              <span>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>{d.name}</span>
                <span className="og-small">{d.role} · {d.institution}, {d.city}</span>
              </span>
              <span className="og-pill" data-tone={d.id === id ? "teal" : undefined}>{d.countryCode}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
