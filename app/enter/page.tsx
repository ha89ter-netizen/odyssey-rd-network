"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import "@/ui/theme.css";
import "@/ui/app.css";
import { NodeField } from "@/components/kit";
import { Avatar, Button, Disclaimer } from "@/ui/primitives";
import { useStore } from "@/store/store";
import { selectCasesOf } from "@/store/store";
import type { DoctorId } from "@/store/types";
import { useI18n } from "@/i18n/i18n";

export default function EnterPage() {
  const { state, dispatch, ready } = useStore();
  const { t, C } = useI18n();
  const router = useRouter();
  const [picked, setPicked] = React.useState<DoctorId>("doc-a");

  const enter = () => {
    dispatch({ type: "enter", doctorId: picked });
    router.push("/dashboard");
  };

  return (
    <div className="og og-app ody-surface" style={{ minHeight: "100vh" }}>
      <div className="og-atmos" aria-hidden>
        <NodeField seed={17} count={46} className="og-atmos-net" />
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "clamp(28px, 6vw, 72px) clamp(18px, 4vw, 40px) 72px" }}>
        <header className="ody-rise" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="30" height="30" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M6 3c0 5 10 5 10 10M16 3c0 5-10 5-10 10M6 19c0-3 10-3 10-6" stroke="var(--teal)" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="6" cy="3" r="1.7" fill="var(--ice)" /><circle cx="16" cy="3" r="1.7" fill="var(--ice)" />
            <circle cx="11" cy="13" r="1.7" fill="var(--teal)" />
          </svg>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "0.2em" }}>ODYSSEY</div>
            <div className="og-eyebrow" style={{ marginTop: 4 }}>{t("enter.tagline")}</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Disclaimer /></div>
        </header>

        <section className="ody-rise" style={{ marginTop: "clamp(34px, 6vw, 64px)", maxWidth: "24ch" }}>
          <h1 className="og-h1" style={{ fontSize: "clamp(34px, 5.4vw, 54px)", lineHeight: 1.04 }}>
            {t("enter.title")}
          </h1>
        </section>
        <p className="og-lede ody-rise" style={{ marginTop: 20, "--d": "90ms" } as React.CSSProperties}>
          {t("enter.lede")}
        </p>

        <section className="og-glass ody-rise" style={{ marginTop: "clamp(30px, 5vw, 48px)", padding: "clamp(22px, 3vw, 30px)", "--d": "180ms" } as React.CSSProperties}>
          <div className="og-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="og-eyebrow">{t("enter.heading")}</div>
              <h2 className="og-h2" style={{ marginTop: 8, fontSize: 17 }}>{t("enter.chooseWho")}</h2>
            </div>
            <span className="og-pill">{t("enter.noAccount")}</span>
          </div>

          <p className="og-small" style={{ marginTop: 12, maxWidth: "70ch" }}>
            {t("enter.chooseNote")}
          </p>

          <div className="og-stack" style={{ marginTop: 20 }}>
            {(Object.values(state.doctors)).map((d) => {
              const cases = ready ? selectCasesOf(state, d.id).length : 0;
              return (
                <button key={d.id} className="og-docoption" data-on={picked === d.id} onClick={() => setPicked(d.id)}>
                  <Avatar initials={d.initials} side={d.id === "doc-a" ? "a" : "b"} />
                  <span>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>
                      {C(d.name)} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>— {C(d.country)}</span>
                    </span>
                    <span className="og-small">{C(d.role)} · {C(d.institution)}, {C(d.city)}</span>
                    <span className="og-small" style={{ display: "block", marginTop: 4 }}>
                      {t("enter.casesInNetwork", { n: cases })} · {C(d.accreditation)}
                    </span>
                  </span>
                  <span className="og-pill" data-tone={picked === d.id ? "teal" : undefined}>
                    {picked === d.id ? t("enter.selected") : d.countryCode}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="og-between" style={{ marginTop: 22 }}>
            <span className="og-small">{t("common.disclaimer")}. {t("enter.nothingMedical")}</span>
            <Button onClick={enter}>
              {t("enter.enterAs", { name: C(state.doctors[picked].name) })}
              <span aria-hidden>→</span>
            </Button>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <div className="og-eyebrow">{t("enter.walkTitle")}</div>
          <ol className="og-grid" data-cols="auto" style={{ marginTop: 14, listStyle: "none", padding: 0 }}>
            {([1, 2, 3, 4, 5, 6] as const).map((n, i) => (
              <li key={n} className="og-flat ody-rise" style={{ padding: "16px 18px", "--d": `${240 + i * 60}ms` } as React.CSSProperties}>
                <div className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(n).padStart(2, "0")}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 8 }}>{t(`enter.step${n}.t` as "enter.step1.t")}</div>
                <div className="og-small" style={{ marginTop: 5 }}>{t(`enter.step${n}.b` as "enter.step1.b")}</div>
              </li>
            ))}
          </ol>
        </section>

        <footer style={{ marginTop: 44, paddingTop: 20, borderTop: "1px solid var(--line)" }} className="og-between">
          <span className="og-small">{t("enter.footer")}</span>
          <button
            className="og-small og-link"
            style={{ background: "none", border: 0, cursor: "pointer" }}
            onClick={() => { dispatch({ type: "reset" }); window.location.reload(); }}
          >
            {t("enter.reset")}
          </button>
        </footer>
      </div>
    </div>
  );
}
