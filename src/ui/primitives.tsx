"use client";

import * as React from "react";
import { useI18n } from "@/i18n/i18n";

export const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(" ");

/* --------------------------------- surfaces --------------------------------- */

export function Panel({
  glass, title, meta, action, children, className, style, padded = true,
}: {
  glass?: boolean; title?: React.ReactNode; meta?: React.ReactNode; action?: React.ReactNode;
  children: React.ReactNode; className?: string; style?: React.CSSProperties; padded?: boolean;
}) {
  return (
    <section className={cx(glass ? "og-glass" : "og-solid", className)} style={style}>
      {(title || action) && (
        <header className="og-h">
          <div>
            {typeof title === "string" ? <h2 className="og-h2">{title}</h2> : title}
            {meta && <div className="og-small" style={{ marginTop: 3 }}>{meta}</div>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? "og-b" : undefined}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="og-eyebrow">{children}</div>;
}

export function SectionHead({ label, note, action }: { label: string; note?: string; action?: React.ReactNode }) {
  return (
    <div className="og-sechead">
      <div>
        <Eyebrow>{label}</Eyebrow>
        {note && <div className="og-small" style={{ marginTop: 7, maxWidth: "70ch" }}>{note}</div>}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------- controls --------------------------------- */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost"; block?: boolean };
export function Button({ variant = "solid", block, className, style, ...rest }: BtnProps) {
  return (
    <button
      className={cx("og-btn", className)}
      data-variant={variant === "ghost" ? "ghost" : undefined}
      style={{ ...(block ? { width: "100%", justifyContent: "center" } : null), ...style }}
      {...rest}
    />
  );
}

export function Pill({ tone, children, style }: { tone?: "teal" | "ice" | "amber" | "coral"; children: React.ReactNode; style?: React.CSSProperties }) {
  return <span className="og-pill" data-tone={tone} style={style}>{children}</span>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="og-label">{label}</label>
      {children}
      {hint && <div className="og-hint">{hint}</div>}
    </div>
  );
}

/* --------------------------------- data views --------------------------------- */

export function ScoreBar({ value, tone = "teal", delay = 0 }: { value: number; tone?: "teal" | "amber"; delay?: number }) {
  return (
    <div className="og-bar">
      <i
        className="ody-growx"
        style={{
          width: `${value}%`,
          background: tone === "amber" ? "var(--amber)" : undefined,
          "--d": `${delay}ms`,
        } as React.CSSProperties}
      />
    </div>
  );
}

export function Metric({ label, value, detail, tone, href }: {
  label: string; value: React.ReactNode; detail?: string; tone?: "teal" | "coral" | "amber"; href?: string;
}) {
  const color = tone === "teal" ? "var(--teal-deep)" : tone === "coral" ? "var(--coral)" : tone === "amber" ? "var(--amber)" : "var(--ink)";
  const inner = (
    <>
      <div className="og-metric-l">{label}</div>
      <div className="og-metric-n" style={{ color }}>{value}</div>
      {detail && <div className="og-metric-d">{detail}</div>}
    </>
  );
  if (href) return <a className="og-flat og-metric" href={href}>{inner}</a>;
  return <div className="og-flat og-metric">{inner}</div>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="og-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === value} className="og-tab" data-on={t.id === value} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function StepBar({ stages, index }: { stages: string[]; index: number }) {
  return (
    <div className="og-stepbar">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="og-stepdot" data-state={i < index ? "done" : i === index ? "current" : "todo"}>
              {i < index ? "✓" : i + 1}
            </span>
            <span style={{ fontSize: 12.5, color: i <= index ? "var(--ink)" : "var(--ink-4)", fontWeight: i === index ? 700 : 500, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < stages.length - 1 && <span className="og-steprail" data-done={i < index} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export function Empty({ title, body, action, icon = "◎" }: { title: string; body: string; action?: React.ReactNode; icon?: string }) {
  return (
    <div className="og-empty">
      <div className="og-empty-icon" style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
      <p className="og-small" style={{ maxWidth: "48ch", margin: "10px auto 0" }}>{body}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

export function Disclaimer({ style }: { style?: React.CSSProperties }) {
  const { t } = useI18n();
  return <span className="og-disclaimer" style={style}>◆ {t("common.disclaimer")}</span>;
}

export function Banner({ tone, children }: { tone?: "amber" | "plain"; children: React.ReactNode }) {
  return (
    <div className="og-banner" data-tone={tone}>
      <span aria-hidden style={{ color: tone === "amber" ? "var(--amber)" : "var(--teal-deep)" }}>◆</span>
      <span>{children}</span>
    </div>
  );
}

export function Avatar({ initials, side }: { initials: string; side?: "a" | "b" }) {
  return <span className="og-av" data-a={side === "a" ? "true" : undefined}>{initials}</span>;
}

/* --------------------------------- modal --------------------------------- */

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="og-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="og-glass og-modal ody-rise" onClick={(e) => e.stopPropagation()}>
        <div className="og-modal-h">
          <h2 className="og-h1" style={{ fontSize: 21 }}>{title}</h2>
          <button className="og-iconbtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="og-modal-b">{children}</div>
        {footer && <div className="og-modal-b" style={{ paddingTop: 0, display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>{footer}</div>}
      </div>
    </div>
  );
}

/* --------------------------------- toasts --------------------------------- */

type Toast = { id: number; title: string; body?: string; tone?: "ok" | "info" };
const ToastCtx = React.createContext<(t: Omit<Toast, "id">) => void>(() => {});
export const useToast = () => React.useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Toast[]>([]);
  const push = React.useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { ...t, id }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="og-toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="og-toast ody-rise" data-tone={t.tone === "info" ? "info" : undefined}>
            <i />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.title}</div>
              {t.body && <div className="og-small" style={{ marginTop: 3 }}>{t.body}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* --------------------------------- time --------------------------------- */

export function relTime(at: number, now: number): string {
  const d = Math.max(0, now - at);
  const m = Math.round(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} d ago`;
  return new Date(at).toISOString().slice(0, 10);
}

export function absTime(at: number) {
  return new Date(at).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}
