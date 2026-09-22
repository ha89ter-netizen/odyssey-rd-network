"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CONCEPTS, SCREENS, type ScreenId } from "@/lib/concepts";
import { DISCLAIMER } from "@/data/odyssey";

/**
 * Lab chrome. Deliberately neutral, deliberately meta — it must never be
 * mistaken for part of the concept being evaluated.
 */
export function LabFrame({ conceptId, screen, children }: { conceptId: string; screen: ScreenId; children: React.ReactNode }) {
  const router = useRouter();
  const index = CONCEPTS.findIndex((c) => c.id === conceptId);
  const concept = CONCEPTS[index];
  const screenIndex = SCREENS.findIndex((s) => s.id === screen);
  const [open, setOpen] = React.useState(false);

  const go = React.useCallback(
    (ci: number, si: number) => {
      const c = CONCEPTS[(ci + CONCEPTS.length) % CONCEPTS.length];
      const s = SCREENS[(si + SCREENS.length) % SCREENS.length];
      router.push(`/design-lab/${c.id}/${s.id}`);
    },
    [router],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (/^[1-9]$/.test(e.key)) go(Number(e.key) - 1, screenIndex);
      else if (e.key === "0") go(9, screenIndex);
      else if (e.key === "ArrowRight" || e.key === "]") go(index, screenIndex + 1);
      else if (e.key === "ArrowLeft" || e.key === "[") go(index, screenIndex - 1);
      else if (e.key === "ArrowDown") go(index + 1, screenIndex);
      else if (e.key === "ArrowUp") go(index - 1, screenIndex);
      else if (e.key.toLowerCase() === "g") setOpen((v) => !v);
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, screenIndex]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--lab-bg)" }}>
      <header
        style={{
          position: "fixed",
          insetInline: 0,
          top: 0,
          height: "var(--lab-chrome-h)",
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 12px",
          background: "rgba(11,13,15,0.94)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--lab-line)",
          color: "var(--lab-fg)",
          fontFamily: "var(--f-jet), ui-monospace, monospace",
          fontSize: 11,
        }}
      >
        <Link
          href="/design-lab"
          style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: "inherit", flexShrink: 0 }}
        >
          <span style={{ letterSpacing: "0.22em", fontWeight: 600 }}>ODYSSEY</span>
          <span style={{ color: "var(--lab-dim)", letterSpacing: "0.14em" }} className="hidden sm:inline">
            DESIGN LAB
          </span>
        </Link>

        <div style={{ width: 1, height: 18, background: "var(--lab-line)", flexShrink: 0 }} />

        <nav style={{ display: "flex", gap: 2, overflowX: "auto", flex: "1 1 auto", scrollbarWidth: "none" }}>
          {CONCEPTS.map((c, i) => {
            const on = c.id === conceptId;
            return (
              <Link
                key={c.id}
                href={`/design-lab/${c.id}/${screen}`}
                title={`${c.num} — ${c.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0 9px",
                  height: 26,
                  borderRadius: 2,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  color: on ? "#0b0d0f" : "var(--lab-dim)",
                  background: on ? "var(--lab-accent)" : "transparent",
                  border: `1px solid ${on ? "transparent" : "var(--lab-line)"}`,
                  transition: "color 160ms, background 160ms, border-color 160ms",
                }}
              >
                <span style={{ fontWeight: 600, letterSpacing: "0.08em" }}>{c.num}</span>
                <span style={{ display: on ? "inline" : "none", letterSpacing: "0.04em" }}>{c.name}</span>
                <span
                  aria-hidden
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 99,
                    background: c.swatches[2],
                    display: on ? "none" : "inline-block",
                    opacity: 0.85,
                  }}
                />
              </Link>
            );
          })}
        </nav>

        <div style={{ width: 1, height: 18, background: "var(--lab-line)", flexShrink: 0 }} className="hidden md:block" />

        <nav style={{ display: "flex", gap: 2, flexShrink: 0 }} className="hidden md:flex">
          {SCREENS.map((s, i) => {
            const on = s.id === screen;
            return (
              <Link
                key={s.id}
                href={`/design-lab/${conceptId}/${s.id}`}
                style={{
                  padding: "0 8px",
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.06em",
                  color: on ? "var(--lab-fg)" : "var(--lab-dim)",
                  background: on ? "#1a2026" : "transparent",
                  transition: "color 160ms, background 160ms",
                }}
              >
                <span style={{ opacity: 0.5, marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>
                {s.short}
              </Link>
            );
          })}
        </nav>

        <select
          className="md:hidden"
          value={screen}
          onChange={(e) => router.push(`/design-lab/${conceptId}/${e.target.value}`)}
          style={{
            height: 26,
            background: "#151a1f",
            color: "var(--lab-fg)",
            border: "1px solid var(--lab-line)",
            borderRadius: 2,
            fontSize: 11,
            padding: "0 6px",
            fontFamily: "inherit",
          }}
        >
          {SCREENS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.short}
            </option>
          ))}
        </select>

        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            flexShrink: 0,
            height: 26,
            padding: "0 10px",
            borderRadius: 2,
            border: "1px solid var(--lab-line)",
            background: open ? "#1a2026" : "transparent",
            color: "var(--lab-dim)",
            fontFamily: "inherit",
            fontSize: 11,
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          INFO
        </button>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: "var(--lab-chrome-h) 0 0 0",
            zIndex: 89,
            background: "rgba(8,10,12,0.72)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, 92vw)",
              height: "100%",
              overflowY: "auto",
              background: "#101418",
              borderLeft: "1px solid var(--lab-line)",
              color: "var(--lab-fg)",
              padding: 22,
              fontFamily: "var(--f-jet), ui-monospace, monospace",
              fontSize: 12,
              lineHeight: 1.65,
            }}
          >
            <div style={{ color: "var(--lab-dim)", letterSpacing: "0.18em", fontSize: 10 }}>CURRENT DIRECTION</div>
            <h2 style={{ margin: "8px 0 4px", fontSize: 20, letterSpacing: "-0.01em", fontWeight: 500 }}>
              {concept.num} — {concept.name}
            </h2>
            <p style={{ color: "#a7b0b8", margin: "0 0 18px" }}>{concept.thesis}</p>
            <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", margin: 0, color: "#a7b0b8" }}>
              <dt style={{ color: "var(--lab-dim)" }}>Type</dt>
              <dd style={{ margin: 0 }}>{concept.type}</dd>
              <dt style={{ color: "var(--lab-dim)" }}>Scheme</dt>
              <dd style={{ margin: 0 }}>{concept.scheme}</dd>
              <dt style={{ color: "var(--lab-dim)" }}>Screen</dt>
              <dd style={{ margin: 0 }}>{SCREENS[screenIndex].label}</dd>
            </dl>

            <div style={{ height: 1, background: "var(--lab-line)", margin: "20px 0" }} />

            <div style={{ color: "var(--lab-dim)", letterSpacing: "0.18em", fontSize: 10, marginBottom: 10 }}>KEYBOARD</div>
            {[
              ["1 – 9, 0", "switch design direction"],
              ["↑ / ↓", "previous / next direction"],
              ["← / →", "previous / next screen"],
              ["G", "toggle this panel"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "#a7b0b8" }}>
                <span style={{ color: "var(--lab-fg)" }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}

            <div style={{ height: 1, background: "var(--lab-line)", margin: "20px 0" }} />
            <p style={{ color: "#8a939b", margin: 0 }}>
              All ten directions render the same synthetic case pair — ODY-001 (Kazakhstan) and ODY-742 (Germany) — so
              they can be compared on identical content. {DISCLAIMER}.
            </p>
          </aside>
        </div>
      )}

      <main style={{ paddingTop: "var(--lab-chrome-h)" }}>{children}</main>
    </div>
  );
}
