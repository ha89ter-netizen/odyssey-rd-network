"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Pill, SectionHead, Disclaimer, Banner, Modal, Avatar } from "@/ui/primitives";
import { useI18n } from "@/i18n/i18n";

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const { t, C, lang, setLang } = useI18n();
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const me = state.doctors[state.currentDoctorId!];

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-end", padding: "6px 4px 0" }}>
        <div>
          <div className="og-eyebrow">{t("st.eyebrow")}</div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("st.title")}</h1>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec og-grid" data-cols="side">
        <div className="og-stack">
          <Panel glass title={t("st.profile")} meta={t("st.profileMeta")}>
            <div className="og-row" style={{ gap: 14 }}>
              <Avatar initials={me.initials} side={me.id === "doc-a" ? "a" : "b"} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{C(me.name)}</div>
                <div className="og-small">{C(me.role)}</div>
              </div>
            </div>
            <dl className="og-kv" style={{ marginTop: 16 }}>
              <dt>{t("st.fDepartment")}</dt><dd>{C(me.department)}</dd>
              <dt>{t("st.fInstitution")}</dt><dd>{C(me.institution)}</dd>
              <dt>{t("st.fLocation")}</dt><dd>{C(me.city)}, {C(me.country)}</dd>
              <dt>{t("st.fNetworkId")}</dt><dd className="og-mono">{me.networkId}</dd>
              <dt>{t("st.fAccess")}</dt><dd>{C(me.accreditation)}</dd>
            </dl>
          </Panel>

          <Panel title={t("st.demoControls")}>
            <div className="og-stack">
              <div className="og-between">
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t("st.switchTitle")}</div>
                  <div className="og-small">{t("st.switchBody")}</div>
                </div>
                <Button variant="ghost" onClick={() => {
                  dispatch({ type: "switchDoctor", doctorId: me.id === "doc-a" ? "doc-b" : "doc-a" });
                  router.push("/dashboard");
                }}>
                  {t("st.switchTo", { name: C(me.id === "doc-a" ? "Dr. M. Brandt" : "Dr. A. Seitkali") })}
                </Button>
              </div>
              <div className="og-between" style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t("st.langTitle")}</div>
                  <div className="og-small" style={{ maxWidth: "52ch" }}>{t("st.langBody")}</div>
                </div>
                <div className="og-row" style={{ gap: 8 }}>
                  {(["en", "ru"] as const).map((l) => (
                    <Button key={l} variant={l === lang ? "solid" : "ghost"} onClick={() => setLang(l)}>
                      {l === "en" ? "English" : "Русский"}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="og-between" style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t("st.resetTitle")}</div>
                  <div className="og-small">{t("st.resetBody")}</div>
                </div>
                <Button variant="ghost" onClick={() => setConfirming(true)}>{t("st.resetBtn")}</Button>
              </div>
            </div>
          </Panel>

          <Panel title={t("st.safety")}>
            <div className="og-stack">
              <Banner tone="amber"><b>{t("common.disclaimer")}.</b> {t("st.everythingSynthetic")}</Banner>
              <div className="og-small" style={{ lineHeight: 1.8 }}>
                <p style={{ marginTop: 0 }}>
                  <b>{t("st.safety1")}</b> {t("st.safety1b")}
                </p>
                <p>
                  <b>{t("st.safety2")}</b> {t("st.safety2b")}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <b>{t("st.safety3")}</b> {t("st.safety3b")}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="og-stack">
          <Panel title={t("st.about")}>
            <div className="og-eyebrow">{t("enter.tagline")}</div>
            <p style={{ fontSize: 15, marginTop: 10, lineHeight: 1.7 }}>“{t("st.promise")}”</p>
            <p className="og-small" style={{ marginTop: 10 }}>{t("st.principle")}</p>
            <dl className="og-kv" style={{ marginTop: 16 }}>
              <dt>{t("st.build")}</dt><dd className="og-mono">{t("st.buildV")}</dd>
              <dt>{t("st.design")}</dt><dd>Bio Glass</dd>
              <dt>{t("st.data")}</dt><dd>{t("st.dataV")}</dd>
            </dl>
          </Panel>
          <Panel title={t("st.state")}>
            <dl className="og-kv">
              <dt>{t("st.sCases")}</dt><dd className="og-mono">{Object.keys(state.cases).length}</dd>
              <dt>{t("st.sMatches")}</dt><dd className="og-mono">{Object.keys(state.matches).length}</dd>
              <dt>{t("st.sRooms")}</dt><dd className="og-mono">{Object.keys(state.collaborations).length}</dd>
              <dt>{t("st.sContributions")}</dt><dd className="og-mono">{state.contributions.length}</dd>
              <dt>{t("st.sAudit")}</dt><dd className="og-mono">{state.audit.length}</dd>
            </dl>
          </Panel>
        </div>
      </div>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title={t("st.resetConfirm")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { dispatch({ type: "reset" }); router.push("/enter"); }}>{t("st.resetEverything")}</Button>
          </>
        }
      >
        <p className="og-small" style={{ marginTop: 0 }}>
          {t("st.resetConfirmBody")}
        </p>
      </Modal>
    </>
  );
}
