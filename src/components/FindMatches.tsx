"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "@/ui/primitives";
import { useStore } from "@/store/store";
import type { CaseRecord } from "@/store/types";

const STAGES = [
  { label: "Normalising structured signals", detail: "Phenotype terms mapped to HPO; variants to HGVS" },
  { label: "Dispatching federated query", detail: "Member institutions evaluate locally — no identifiable data is transmitted" },
  { label: "Screening candidate records", detail: "Every case in the network is scored against yours" },
  { label: "Ranking by evidence similarity", detail: "Candidates below the review threshold are discarded" },
];

/**
 * Runs the simulated federated search. The staged progress is theatre for the
 * demo; the matching itself is synchronous and deterministic.
 */
export function FindMatches({ record, label = "Find matches", variant = "solid" }: {
  record: CaseRecord; label?: string; variant?: "solid" | "ghost";
}) {
  const { state, dispatch } = useStore();
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
        {running ? "Searching…" : label}
      </Button>

      <Modal open={running} onClose={() => { /* deliberately not dismissible mid-query */ }} title="Searching the network">
        <p className="og-small" style={{ marginTop: 0 }}>
          Case <b className="og-mono">{record.id}</b> is being compared against {cohorts} records held across member
          institutions. <b>SIMULATED MATCHING ENGINE</b> — deterministic, and running entirely in your browser.
        </p>
        <div className="og-stack" style={{ marginTop: 18 }}>
          {STAGES.map((s, i) => (
            <div key={s.label} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 12, opacity: i <= stage ? 1 : 0.35 }}>
              <span style={{ color: i < stage ? "var(--teal-deep)" : "var(--ink-3)", fontSize: 12 }}>
                {i < stage ? "✓" : i === stage ? "◔" : "○"}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: i === stage ? 700 : 500 }}>{s.label}</div>
                <div className="og-small" style={{ marginTop: 2 }}>{s.detail}</div>
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
