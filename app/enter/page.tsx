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
import { DISCLAIMER, PRODUCT } from "@/data/odyssey";

export default function EnterPage() {
  const { state, dispatch, ready } = useStore();
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
            <div className="og-eyebrow" style={{ marginTop: 4 }}>{PRODUCT.tagline}</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Disclaimer /></div>
        </header>

        <section className="ody-rise" style={{ marginTop: "clamp(34px, 6vw, 64px)", maxWidth: "24ch" }}>
          <h1 className="og-h1" style={{ fontSize: "clamp(34px, 5.4vw, 54px)", lineHeight: 1.04 }}>
            The answer may already exist.
          </h1>
        </section>
        <p className="og-lede ody-rise" style={{ marginTop: 20, "--d": "90ms" } as React.CSSProperties}>
          ODYSSEY connects clinicians whose unresolved cases describe the same disease. It does not diagnose. It
          surfaces a potential match, explains the evidence behind it, and puts two doctors in the same room to decide
          what it means.
        </p>

        <section className="og-glass ody-rise" style={{ marginTop: "clamp(30px, 5vw, 48px)", padding: "clamp(22px, 3vw, 30px)", "--d": "180ms" } as React.CSSProperties}>
          <div className="og-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="og-eyebrow">Enter the demonstration</div>
              <h2 className="og-h2" style={{ marginTop: 8, fontSize: 17 }}>Choose which clinician you are</h2>
            </div>
            <span className="og-pill">No account required</span>
          </div>

          <p className="og-small" style={{ marginTop: 12, maxWidth: "70ch" }}>
            The full story runs across two clinicians on opposite sides of the network. Start as Dr. Seitkali in
            Kazakhstan to follow the case that needs an answer — you can switch sides at any point from the header.
          </p>

          <div className="og-stack" style={{ marginTop: 20 }}>
            {(Object.values(state.doctors)).map((d) => {
              const cases = ready ? selectCasesOf(state, d.id).length : 0;
              return (
                <button key={d.id} className="og-docoption" data-on={picked === d.id} onClick={() => setPicked(d.id)}>
                  <Avatar initials={d.initials} side={d.id === "doc-a" ? "a" : "b"} />
                  <span>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>
                      {d.name} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>— {d.country}</span>
                    </span>
                    <span className="og-small">{d.role} · {d.institution}, {d.city}</span>
                    <span className="og-small" style={{ display: "block", marginTop: 4 }}>
                      {cases} case{cases === 1 ? "" : "s"} in the network · {d.accreditation}
                    </span>
                  </span>
                  <span className="og-pill" data-tone={picked === d.id ? "teal" : undefined}>
                    {picked === d.id ? "Selected" : d.countryCode}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="og-between" style={{ marginTop: 22 }}>
            <span className="og-small">{DISCLAIMER}. Nothing here is a medical record.</span>
            <Button onClick={enter}>
              Enter demo as {state.doctors[picked].name.replace("Dr. ", "Dr ")}
              <span aria-hidden>→</span>
            </Button>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <div className="og-eyebrow">What you will walk through</div>
          <ol className="og-grid" data-cols="auto" style={{ marginTop: 14, listStyle: "none", padding: 0 }}>
            {[
              ["Structure a case", "An unresolved paediatric case is turned into comparable clinical signals."],
              ["Upload a report", "Simulated AI-assisted extraction proposes phenotype terms; you verify each one."],
              ["Search the network", "A deterministic matching engine ranks every other case in the network."],
              ["Understand why", "The system explains which evidence made the two cases comparable."],
              ["Connect and verify", "Two clinicians compare evidence and record whether the link is real."],
              ["Contribute knowledge", "The verified connection becomes part of the network record."],
            ].map(([t, b], i) => (
              <li key={t} className="og-flat ody-rise" style={{ padding: "16px 18px", "--d": `${240 + i * 60}ms` } as React.CSSProperties}>
                <div className="og-mono og-small" style={{ color: "var(--teal-deep)" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 8 }}>{t}</div>
                <div className="og-small" style={{ marginTop: 5 }}>{b}</div>
              </li>
            ))}
          </ol>
        </section>

        <footer style={{ marginTop: 44, paddingTop: 20, borderTop: "1px solid var(--line)" }} className="og-between">
          <span className="og-small">
            Prototype · synthetic data · no backend, no patient records, no diagnostic claims.
          </span>
          <button
            className="og-small og-link"
            style={{ background: "none", border: 0, cursor: "pointer" }}
            onClick={() => { dispatch({ type: "reset" }); window.location.reload(); }}
          >
            Reset demonstration data
          </button>
        </footer>
      </div>
    </div>
  );
}
