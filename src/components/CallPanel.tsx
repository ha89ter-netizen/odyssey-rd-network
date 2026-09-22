"use client";

import * as React from "react";
import { Avatar, Pill, Button } from "@/ui/primitives";
import { useI18n } from "@/i18n/i18n";
import type { Doctor } from "@/store/types";

/**
 * The two clinicians on a call inside the room, with the evidence still on
 * screen beside them. Participants are shown as identity tiles rather than
 * video frames: this is a prototype, and inventing faces for clinicians who do
 * not exist would misrepresent the product.
 */
export function CallPanel({ a, b, me, onEnd }: { a: Doctor; b: Doctor; me: string; onEnd: () => void }) {
  const { t, C } = useI18n();
  const [secs, setSecs] = React.useState(0);
  const [speaking, setSpeaking] = React.useState(1);

  React.useEffect(() => {
    const tick = window.setInterval(() => setSecs((s) => s + 1), 1000);
    const turn = window.setInterval(() => setSpeaking((s) => (s === 0 ? 1 : 0)), 4200);
    return () => { window.clearInterval(tick); window.clearInterval(turn); };
  }, []);

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <section className="og-glass ody-rise" style={{ overflow: "hidden" }}>
      <div className="og-h">
        <div className="og-row" style={{ gap: 10 }}>
          <span className="og-callpulse" aria-hidden />
          <h2 className="og-h2">{t("co.callLive")}</h2>
        </div>
        <span className="og-mono og-small">{mmss}</span>
      </div>

      <div className="og-b">
        <div className="og-callgrid">
          {[a, b].map((d, i) => (
            <div key={d.id} className="og-calltile" data-speaking={speaking === i}>
              <Avatar initials={d.initials} side={d.id === "doc-a" ? "a" : "b"} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {C(d.name)}{d.id === me ? ` ${t("co.you")}` : ""}
                </div>
                <div className="og-small">{C(d.city)}, {C(d.country)}</div>
              </div>
              <span className="og-callbars" aria-hidden><i /><i /><i /></span>
            </div>
          ))}
        </div>

        <div className="og-row" style={{ gap: 8, marginTop: 14 }}>
          <Pill tone="teal">◈ {t("co.callMic")}</Pill>
          <Pill>{t("co.callCam")}</Pill>
          <Pill>{t("co.callShare")}</Pill>
          <span className="og-spacer" />
          <Button variant="ghost" onClick={onEnd} style={{ borderColor: "rgba(204,107,90,.45)", color: "var(--coral)" }}>
            {t("co.callEnd")}
          </Button>
        </div>

        <p className="og-small" style={{ marginTop: 12 }}>{t("co.callNote")}</p>
      </div>
    </section>
  );
}
