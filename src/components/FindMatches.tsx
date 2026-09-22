"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "@/ui/primitives";
import { useStore } from "@/store/store";
import { useI18n } from "@/i18n/i18n";
import type { CaseRecord } from "@/store/types";

const STAGES = [1, 2, 3, 4] as const;

/**
 * Runs the simulated federated search. The staged progress is theatre for the
 * demo; the matching itself is synchronous and deterministic.
 */
export function FindMatches({ record, label, variant = "solid" }: {
  record: CaseRecord; label?: string; variant?: "solid" | "ghost";
}) {
  const { state, dispatch } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [running, setRunning] = React.useState(false);
  const [stage, setStage] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);

  const start = () => {
    setRunning(true);
    setStage(0);
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    STAGES.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(window.setTimeout(() => setStage(i), i * 460));
    });
    // Dispatch and navigate once the last stage has been shown.
    timers.current.push(window.setTimeout(() => {
      dispatch({ type: "runMatching", caseId: record.id });
      router.push(`/cases/${record.id}/matches`);
      setRunning(false);
    }, STAGES.length * 460 + 320));
  };

  const cohorts = Object.keys(state.cases).length;

  return (
    <>
      <Button variant={variant} onClick={start} disabled={running}>
        {running ? t("search.searching") : (label ?? t("case.findMatches"))}
      </Button>

      <Modal open={running} onClose={() => { /* deliberately not dismissible mid-query */ }} title={t("search.title")}>
        <p className="og-small" style={{ marginTop: 0 }}>{t("search.intro", { id: record.id, n: cohorts })}</p>
        <div className="og-stack" style={{ marginTop: 18 }}>
          {STAGES.map((n, i) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 12, opacity: i <= stage ? 1 : 0.35 }}>
              <span style={{ color: i < stage ? "var(--teal-deep)" : "var(--ink-3)", fontSize: 12 }}>
                {i < stage ? "✓" : i === stage ? "◔" : "○"}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: i === stage ? 700 : 500 }}>{t(`search.s${n}` as "search.s1")}</div>
                <div className="og-small" style={{ marginTop: 2 }}>{t(`search.s${n}d` as "search.s1d")}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="og-prog" style={{ marginTop: 18 }}>
          <i style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
        </div>
      </Modal>
    </>
  );
}
