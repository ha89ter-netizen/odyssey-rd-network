/**
 * Shared, token-driven visual primitives.
 * Nothing here carries its own colour: every element paints with
 * `currentColor` or a CSS variable, so each concept restyles it entirely.
 */
import * as React from "react";
import { WORLD_PATH, WORLD_DOTS } from "@/data/world";
import { project, type NetworkNode } from "@/data/odyssey";

/* ---------------------------------------------------------------- */
/* Numeric + line charts                                             */
/* ---------------------------------------------------------------- */

export function Spark({
  data,
  w = 120,
  h = 28,
  area = false,
  strokeWidth = 1.5,
  className,
}: {
  data: number[];
  w?: number;
  h?: number;
  area?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / span) * (h - strokeWidth * 2) - strokeWidth,
  ]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} aria-hidden="true">
      {area && <path d={`${d}L${w},${h}L0,${h}Z`} fill="currentColor" opacity={0.1} />}
      <path d={d} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={strokeWidth * 1.4} fill="currentColor" />
    </svg>
  );
}

export function Meter({
  value,
  height = 3,
  delay = 0,
  className,
  trackClassName,
}: {
  value: number;
  height?: number;
  delay?: number;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={trackClassName} style={{ height, width: "100%", background: "currentColor", opacity: 1 }}>
      <div
        className={`ody-growx ${className ?? ""}`}
        style={{ height, width: `${value}%`, background: "currentColor", "--d": `${delay}ms` } as React.CSSProperties}
      />
    </div>
  );
}

/** Circular completeness indicator. */
export function Ring({
  value,
  size = 64,
  thickness = 4,
  trackOpacity = 0.16,
  delay = 0,
  children,
}: {
  value: number;
  size?: number;
  thickness?: number;
  trackOpacity?: number;
  delay?: number;
  children?: React.ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={thickness} opacity={trackOpacity} />
        <circle
          className="ody-drawin"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="butt"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          style={{ "--dash": c, "--d": `${delay}ms` } as React.CSSProperties}
        />
      </svg>
      {children && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{children}</div>
      )}
    </div>
  );
}

/** 8-axis evidence radar. Axes are evidence groups, never a diagnosis. */
export function Radar({
  values,
  labels,
  size = 260,
  rings = 4,
  delay = 0,
  showLabels = true,
}: {
  values: number[];
  labels?: string[];
  size?: number;
  rings?: number;
  delay?: number;
  showLabels?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - (showLabels ? 42 : 8);
  const n = values.length;
  const pt = (i: number, v: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * R * (v / 100), cy + Math.sin(a) * R * (v / 100)];
  };
  const poly = values.map((v, i) => pt(i, v).map((x) => x.toFixed(1)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ maxWidth: size, overflow: "visible" }} aria-hidden="true">
      {Array.from({ length: rings }).map((_, ri) => (
        <polygon
          key={ri}
          points={values
            .map((_, i) => pt(i, ((ri + 1) / rings) * 100).map((x) => x.toFixed(1)).join(","))
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.18}
        />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeWidth={0.5} opacity={0.18} />;
      })}
      <polygon
        className="ody-fadein"
        points={poly}
        fill="var(--radar-fill, currentColor)"
        fillOpacity="var(--radar-fill-opacity, 0.14)"
        stroke="var(--radar-stroke, currentColor)"
        strokeWidth={1.4}
        style={{ "--d": `${delay}ms` } as React.CSSProperties}
      />
      {values.map((v, i) => {
        const [x, y] = pt(i, v);
        return (
          <circle
            key={i}
            className="ody-nodein"
            cx={x}
            cy={y}
            r={2.4}
            fill="var(--radar-stroke, currentColor)"
            style={{ "--d": `${delay + 200 + i * 70}ms` } as React.CSSProperties}
          />
        );
      })}
      {showLabels &&
        labels?.map((l, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * (R + 16);
          const y = cy + Math.sin(a) * (R + 16);
          const anchor = Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={8.5}
              letterSpacing="0.06em"
              fill="currentColor"
              opacity={0.62}
              style={{ textTransform: "uppercase" }}
            >
              {l}
            </text>
          );
        })}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Geography                                                          */
/* ---------------------------------------------------------------- */

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }, lift = 0.24) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * len * lift;
  const cy = my + (dx / len) * len * lift;
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
}

export type MapVariant = "outline" | "dots" | "both";

export function WorldMap({
  nodes,
  edges,
  variant = "outline",
  highlight = [],
  activeEdge,
  labels = [],
  className,
  animate = true,
  nodeScale = 1,
  labelSize = 1.9,
  crop,
}: {
  nodes: NetworkNode[];
  edges: { from: string; to: string; strength: number; active?: boolean }[];
  variant?: MapVariant;
  highlight?: string[];
  activeEdge?: { from: string; to: string };
  labels?: string[];
  className?: string;
  animate?: boolean;
  nodeScale?: number;
  /** Label type size in viewBox units — lower it when the map is rendered wide. */
  labelSize?: number;
  /** viewBox override, e.g. "18 4 62 34" to crop to Europe–Asia. */
  crop?: string;
}) {
  const pos = new Map(nodes.map((n) => [n.id, project(n.lat, n.lon)]));
  const active = activeEdge ?? edges.find((e) => e.active);
  const activeD =
    active && pos.get(active.from) && pos.get(active.to)
      ? arcPath(pos.get(active.from)!, pos.get(active.to)!, 0.3)
      : null;

  return (
    <svg viewBox={crop ?? "0 0 100 50"} className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {(variant === "outline" || variant === "both") && (
        <path d={WORLD_PATH} fill="var(--map-land, currentColor)" fillOpacity="var(--map-land-opacity, 0.07)" stroke="var(--map-coast, none)" strokeWidth={0.12} />
      )}
      {(variant === "dots" || variant === "both") && (
        <g fill="var(--map-dot, currentColor)" fillOpacity="var(--map-dot-opacity, 0.22)">
          {WORLD_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.22} />
          ))}
        </g>
      )}

      <g fill="none" stroke="var(--map-line, currentColor)" strokeOpacity="var(--map-line-opacity, 0.3)">
        {edges.map((e, i) => {
          const a = pos.get(e.from);
          const b = pos.get(e.to);
          if (!a || !b || e === active) return null;
          return (
            <path
              key={`${e.from}-${e.to}`}
              className={animate ? "ody-drawin" : undefined}
              d={arcPath(a, b)}
              strokeWidth={0.12 + e.strength * 0.16}
              style={animate ? ({ "--dash": 90, "--d": `${240 + i * 55}ms` } as React.CSSProperties) : undefined}
            />
          );
        })}
      </g>

      {activeD && (
        <>
          <path
            className={animate ? "ody-drawin" : undefined}
            d={activeD}
            fill="none"
            stroke="var(--map-active, currentColor)"
            strokeWidth={0.42}
            strokeLinecap="round"
            style={animate ? ({ "--dash": 90, "--d": "900ms" } as React.CSSProperties) : undefined}
          />
          {animate && (
            <circle className="ody-travel" r={0.6} fill="var(--map-active, currentColor)" style={{ offsetPath: `path("${activeD}")` } as React.CSSProperties} />
          )}
        </>
      )}

      <g>
        {nodes.map((n, i) => {
          const p = pos.get(n.id)!;
          const isHi = highlight.includes(n.id);
          const r = (isHi ? 0.9 : n.tier === "member" ? 0.5 : 0.38) * nodeScale;
          return (
            <g key={n.id}>
              {isHi && <circle cx={p.x} cy={p.y} r={r * 1.6} fill="var(--map-active, currentColor)" className="ody-beacon" />}
              <circle
                className={animate ? "ody-nodein" : undefined}
                cx={p.x}
                cy={p.y}
                r={r}
                fill={isHi ? "var(--map-active, currentColor)" : "var(--map-node, currentColor)"}
                fillOpacity={isHi ? 1 : "var(--map-node-opacity, 0.55)"}
                style={animate ? ({ "--d": `${120 + i * 45}ms` } as React.CSSProperties) : undefined}
              />
              {labels.includes(n.id) && (
                <text
                  x={p.x + r + labelSize * 0.5}
                  y={p.y + labelSize * 0.34}
                  fontSize={labelSize}
                  fill="var(--map-label, currentColor)"
                  letterSpacing="0.04em"
                  className={animate ? "ody-fadein" : undefined}
                  style={animate ? ({ "--d": "1600ms" } as React.CSSProperties) : undefined}
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Clinical glyphs                                                    */
/* ---------------------------------------------------------------- */

/** Minimal pedigree: squares = male, circles = female, filled = affected. */
export function Pedigree({
  consanguineous,
  affected,
  size = 148,
}: {
  consanguineous: boolean;
  affected: number[];
  size?: number;
}) {
  const w = size;
  const h = size * 0.62;
  const s = w / 100;
  const kids = [28, 46, 64, 82];
  return (
    <svg viewBox={`0 0 100 62`} width={w} height={h} aria-hidden="true" style={{ overflow: "visible" }}>
      <g stroke="currentColor" strokeWidth={0.8} fill="none" opacity={0.9}>
        <rect x={30} y={6} width={9} height={9} />
        <circle cx={65.5} cy={10.5} r={4.5} />
        <line x1={39} y1={10.5} x2={61} y2={10.5} />
        {consanguineous && <line x1={39} y1={12.6} x2={61} y2={12.6} />}
        <line x1={50} y1={10.5} x2={50} y2={26} />
        <line x1={kids[0]} y1={26} x2={kids[kids.length - 1]} y2={26} />
        {kids.map((x, i) => (
          <line key={i} x1={x} y1={26} x2={x} y2={34} />
        ))}
      </g>
      {kids.map((x, i) =>
        i % 2 === 0 ? (
          <rect
            key={i}
            x={x - 4.5}
            y={34}
            width={9}
            height={9}
            stroke="currentColor"
            strokeWidth={0.8}
            fill={affected.includes(i) ? "currentColor" : "none"}
          />
        ) : (
          <circle
            key={i}
            cx={x}
            cy={38.5}
            r={4.5}
            stroke="currentColor"
            strokeWidth={0.8}
            fill={affected.includes(i) ? "currentColor" : "none"}
          />
        ),
      )}
      <text x={50} y={54} textAnchor="middle" fontSize={4} fill="currentColor" opacity={0.55} letterSpacing="0.08em">
        {consanguineous ? "CONSANGUINEOUS · F ≈ 0.0625" : "NON-CONSANGUINEOUS"}
      </text>
      <text x={kids[0]} y={49.5} textAnchor="middle" fontSize={3.4} fill="currentColor" opacity={0.45}>
        II-1
      </text>
      <text x={kids[1]} y={49.5} textAnchor="middle" fontSize={3.4} fill="currentColor" opacity={0.45}>
        II-2
      </text>
      <text x={kids[2]} y={49.5} textAnchor="middle" fontSize={3.4} fill="currentColor" opacity={0.45}>
        II-3
      </text>
      <text x={kids[3]} y={49.5} textAnchor="middle" fontSize={3.4} fill="currentColor" opacity={0.45}>
        II-4
      </text>
    </svg>
  );
}

/** Two-track milestone comparison in months. Rows are milestones, not time series. */
export function TrajectoryChart({
  milestones,
  a,
  b,
  max,
  labelA,
  labelB,
  height = 132,
  rowLabels = false,
  labelWidth = 128,
}: {
  milestones: string[];
  a: number[];
  b: number[];
  max: number;
  labelA: string;
  labelB: string;
  height?: number;
  /** Render each milestone's name beside its row instead of leaving the rows unlabelled. */
  rowLabels?: boolean;
  labelWidth?: number;
}) {
  const W = 100;
  const rowH = 100 / (milestones.length + 1);
  const x = (m: number) => 6 + (m / max) * (W - 12);
  const chart = (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }} aria-hidden>
      <g stroke="currentColor" strokeOpacity={0.14} strokeWidth={0.2}>
        {[0, 5, 10, 15, 20].map((m) => (
          <line key={m} x1={x(m)} y1={2} x2={x(m)} y2={98} />
        ))}
      </g>
      {milestones.map((_, i) => {
        const y = rowH * (i + 1);
        return (
          <g key={i}>
            <line x1={x(Math.min(a[i], b[i]))} y1={y} x2={x(Math.max(a[i], b[i]))} y2={y} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.45} />
            <circle className="ody-nodein" cx={x(a[i])} cy={y} r={1.1} fill="var(--track-a, currentColor)" style={{ "--d": `${i * 90}ms` } as React.CSSProperties} />
            <circle className="ody-nodein" cx={x(b[i])} cy={y} r={1.1} fill="var(--track-b, currentColor)" style={{ "--d": `${i * 90 + 45}ms` } as React.CSSProperties} />
          </g>
        );
      })}
    </svg>
  );

  if (!rowLabels) return chart;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `minmax(0, ${labelWidth}px) minmax(0, 1fr)`, gap: 10 }}>
      <div style={{ position: "relative", height }}>
        {milestones.map((m, i) => (
          <span
            key={m}
            style={{
              position: "absolute",
              right: 0,
              top: `${rowH * (i + 1)}%`,
              transform: "translateY(-50%)",
              fontSize: 10.5,
              lineHeight: 1.1,
              textAlign: "right",
              opacity: 0.72,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {m}
          </span>
        ))}
      </div>
      {chart}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Abstract structure (used as restrained environment, not decoration)*/
/* ---------------------------------------------------------------- */

/** Deterministic node lattice — a phenotype/graph motif, not a starfield. */
export function NodeField({ seed = 7, count = 34, className }: { seed?: number; count?: number; className?: string }) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const pts = Array.from({ length: count }, () => ({ x: rnd() * 100, y: rnd() * 100 }));
  const links: [number, number][] = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .filter((o) => o.j !== i)
      .sort((u, v) => u.d - v.d)
      .slice(0, 2);
    near.forEach((o) => {
      if (o.d < 26) links.push([i, o.j]);
    });
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth={0.12} strokeOpacity={0.5}>
        {links.map(([i, j], k) => (
          <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} />
        ))}
      </g>
      <g fill="currentColor">
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i % 7 === 0 ? 0.55 : 0.3} fillOpacity={i % 7 === 0 ? 0.9 : 0.5} />
        ))}
      </g>
    </svg>
  );
}

/** Calibration ruler — measurement marks used by the laboratory concept. */
export function Ruler({ ticks = 40, major = 5, className }: { ticks?: number; major?: number; className?: string }) {
  return (
    <svg viewBox={`0 0 ${ticks * 4} 12`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {Array.from({ length: ticks + 1 }).map((_, i) => (
        <line
          key={i}
          x1={i * 4}
          y1={0}
          x2={i * 4}
          y2={i % major === 0 ? 9 : 4}
          stroke="currentColor"
          strokeWidth={0.7}
          opacity={i % major === 0 ? 0.8 : 0.35}
        />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Small helpers                                                      */
/* ---------------------------------------------------------------- */

export function stagger(i: number, step = 55, base = 0): React.CSSProperties {
  return { "--d": `${base + i * step}ms` } as React.CSSProperties;
}

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");
