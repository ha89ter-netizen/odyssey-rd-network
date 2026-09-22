import Link from "next/link";
import { CONCEPTS, SCREENS } from "@/lib/concepts";
import { DISCLAIMER, PRODUCT, journey, networkStats } from "@/data/odyssey";

export const metadata = { title: "ODYSSEY Design Lab — 10 directions" };

export default function DesignLabIndex() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d0f",
        color: "#e9ecef",
        fontFamily: "var(--f-jet), ui-monospace, monospace",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "clamp(28px,6vw,72px) clamp(20px,4vw,48px) 96px" }}>
        <header style={{ borderBottom: "1px solid #242a30", paddingBottom: 28, marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 20px" }}>
            <h1 style={{ margin: 0, fontSize: "clamp(28px,5vw,44px)", letterSpacing: "0.26em", fontWeight: 500 }}>
              ODYSSEY
            </h1>
            <span style={{ color: "#7c858e", letterSpacing: "0.14em", fontSize: 12 }}>{PRODUCT.tagline.toUpperCase()}</span>
          </div>
          <p style={{ color: "#a7b0b8", maxWidth: "62ch", marginTop: 18, fontSize: 13, lineHeight: 1.8 }}>
            Design exploration. Ten visual directions for the same product, rendered against one shared synthetic
            dataset so they can be judged on identical content rather than on different demos.
          </p>
          <p style={{ color: "#e8e4dc", marginTop: 14, fontSize: 13, letterSpacing: "0.04em" }}>
            “{PRODUCT.promise}” &nbsp;·&nbsp; {PRODUCT.principle}
          </p>
        </header>

        <section style={{ marginBottom: 48 }}>
          <div style={{ color: "#7c858e", fontSize: 10, letterSpacing: "0.22em", marginBottom: 18 }}>
            THE SPINE OF THE PRODUCT
          </div>
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 1,
              background: "#242a30",
              border: "1px solid #242a30",
            }}
          >
            {journey.map((j, i) => (
              <li key={j.id} className="ody-rise" style={{ background: "#0f1317", padding: "16px 16px 20px", "--d": `${i * 70}ms` } as React.CSSProperties}>
                <div style={{ color: "#4d5560", fontSize: 10, letterSpacing: "0.18em" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#e9ecef" }}>{j.label}</div>
                <div style={{ marginTop: 6, fontSize: 11, color: "#7c858e", lineHeight: 1.6 }}>{j.detail}</div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <div style={{ color: "#7c858e", fontSize: 10, letterSpacing: "0.22em" }}>TEN DIRECTIONS</div>
            <div style={{ color: "#4d5560", fontSize: 10, letterSpacing: "0.14em" }}>
              {SCREENS.length} SCREENS EACH · SAME DATA
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {CONCEPTS.map((c, i) => (
              <article
                key={c.id}
                className="ody-rise"
                style={{ border: "1px solid #242a30", background: "#0f1317", "--d": `${120 + i * 55}ms` } as React.CSSProperties}
              >
                <Link href={`/design-lab/${c.id}/dashboard`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ display: "flex", height: 6 }}>
                    {c.swatches.map((s) => (
                      <div key={s} style={{ flex: 1, background: s }} />
                    ))}
                  </div>
                  <div style={{ padding: "18px 18px 8px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ color: "#4d5560", fontSize: 11, letterSpacing: "0.14em" }}>{c.num}</span>
                      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, letterSpacing: "-0.005em" }}>{c.name}</h2>
                    </div>
                    <p style={{ color: "#8f98a1", fontSize: 12, lineHeight: 1.7, margin: "12px 0 16px", minHeight: 62 }}>{c.thesis}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#4d5560", fontSize: 10, letterSpacing: "0.08em" }}>
                      <span>{c.type}</span>
                      <span>{c.scheme.toUpperCase()}</span>
                    </div>
                  </div>
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 1, padding: "12px 18px 16px" }}>
                  {SCREENS.map((s) => (
                    <Link
                      key={s.id}
                      href={`/design-lab/${c.id}/${s.id}`}
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.06em",
                        color: "#7c858e",
                        textDecoration: "none",
                        border: "1px solid #1e242a",
                        padding: "4px 7px",
                      }}
                    >
                      {s.short}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid #242a30", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
            {networkStats.map((s) => (
              <div key={s.id}>
                <div style={{ fontSize: 18, letterSpacing: "-0.01em" }} className="tnum">
                  {s.value}
                </div>
                <div style={{ color: "#4d5560", fontSize: 10, letterSpacing: "0.12em", marginTop: 4 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{ color: "#b98a4b", fontSize: 10, letterSpacing: "0.16em", alignSelf: "flex-end" }}>{DISCLAIMER}</div>
        </footer>
      </div>
    </div>
  );
}
