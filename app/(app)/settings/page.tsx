"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, SectionHead, Disclaimer, Banner, Modal, Avatar } from "@/ui/primitives";
import { DISCLAIMER, PRODUCT } from "@/data/odyssey";

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const me = state.doctors[state.currentDoctorId!];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div>
          <div className="og-eyebrow">Account</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>Settings</h1>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          <Panel glass title="Clinician profile" meta="Synthetic demonstration identity">
            <div className="og-row" style={{ gap: 14 }}>
              <Avatar initials={me.initials} side={me.id === "doc-a" ? "a" : "b"} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{me.name}</div>
                <div className="og-small">{me.role}</div>
              </div>
            </div>
            <dl className="og-kv" style={{ marginTop: 16 }}>
              <dt>Department</dt><dd>{me.department}</dd>
              <dt>Institution</dt><dd>{me.institution}</dd>
              <dt>Location</dt><dd>{me.city}, {me.country}</dd>
              <dt>Network ID</dt><dd className="og-mono">{me.networkId}</dd>
              <dt>Access</dt><dd>{me.accreditation}</dd>
            </dl>
          </Panel>

          <Panel title="Demonstration controls">
            <div className="og-stack">
              <div className="og-between">
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Switch clinician</div>
                  <div className="og-small">Move to the other side of the network without losing state.</div>
                </div>
                <Button variant="ghost" onClick={() => {
                  dispatch({ type: "switchDoctor", doctorId: me.id === "doc-a" ? "doc-b" : "doc-a" });
                  router.push("/dashboard");
                }}>
                  Switch to {me.id === "doc-a" ? "Dr. Brandt (DE)" : "Dr. Seitkali (KZ)"}
                </Button>
              </div>
              <div className="og-between" style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Reset demonstration</div>
                  <div className="og-small">Return every case, match and room to its seeded state.</div>
                </div>
                <Button variant="ghost" onClick={() => setConfirming(true)}>Reset data</Button>
              </div>
            </div>
          </Panel>

          <Panel title="Data and safety">
            <div className="og-stack">
              <Banner tone="amber"><b>{DISCLAIMER}.</b> Every case, clinician, variant and result in this environment is synthetic.</Banner>
              <div className="og-small" style={{ lineHeight: 1.8 }}>
                <p style={{ marginTop: 0 }}>
                  <b>ODYSSEY is not a diagnostic system.</b> It surfaces potential matches between recorded cases,
                  explains the evidence behind them, and records what clinicians decide. It does not diagnose, and no
                  output should be read as a clinical recommendation.
                </p>
                <p>
                  <b>No backend.</b> This prototype stores its state in your browser only. There is no server, no
                  database, no authentication and no external API. Clearing site data resets it.
                </p>
                <p style={{ marginBottom: 0 }}>
                  <b>Matching is simulated.</b> The engine is deterministic and derived from structured fields, but the
                  weighting is a product simulation and has not been clinically validated.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="og-stack">
          <Panel title="About">
            <div className="og-eyebrow">{PRODUCT.tagline}</div>
            <p style={{ fontSize: 15, marginTop: 10, lineHeight: 1.7 }}>“{PRODUCT.promise}”</p>
            <p className="og-small" style={{ marginTop: 10 }}>{PRODUCT.principle}</p>
            <dl className="og-kv" style={{ marginTop: 16 }}>
              <dt>Build</dt><dd className="og-mono">MVP prototype</dd>
              <dt>Design</dt><dd>Bio Glass</dd>
              <dt>Data</dt><dd>Synthetic seed</dd>
            </dl>
          </Panel>
          <Panel title="State">
            <dl className="og-kv">
              <dt>Cases</dt><dd className="og-mono">{Object.keys(state.cases).length}</dd>
              <dt>Matches</dt><dd className="og-mono">{Object.keys(state.matches).length}</dd>
              <dt>Rooms</dt><dd className="og-mono">{Object.keys(state.collaborations).length}</dd>
              <dt>Contributions</dt><dd className="og-mono">{state.contributions.length}</dd>
              <dt>Audit events</dt><dd className="og-mono">{state.audit.length}</dd>
            </dl>
          </Panel>
        </div>
      </div>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Reset demonstration data?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button onClick={() => { dispatch({ type: "reset" }); router.push("/enter"); }}>Reset everything</Button>
          </>
        }
      >
        <p className="og-small" style={{ marginTop: 0 }}>
          Every case you created, match you generated, message you sent and verification you recorded will be
          discarded, and the seeded synthetic records restored. This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
