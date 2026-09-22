"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Panel, Button, Field, Banner, Disclaimer, StepBar, useToast, Pill } from "@/ui/primitives";
import type { NewCaseDraft } from "@/store/store";
import { useI18n } from "@/i18n/i18n";

const SECTION_KEYS = ["new.s1", "new.s2", "new.s3", "new.s4"] as const;

/** Next free reference in the ODY-### series. */
function nextCaseId(existing: string[]) {
  const nums = existing.map((id) => Number(id.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `ODY-${String(next).padStart(3, "0")}`;
}

export default function NewCasePage() {
  const { state, dispatch } = useStore();
  const { t, C } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const doctor = state.doctors[state.currentDoctorId!];
  const [step, setStep] = React.useState(0);

  const [draft, setDraft] = React.useState<NewCaseDraft>(() => ({
    id: nextCaseId(Object.keys(state.cases)),
    ageGroup: "Child · 4y",
    sex: "Female",
    country: doctor.country,
    phenotypeCluster: "Neurological",
    headline: "",
    narrative: "",
    geneticSummary: "",
    familyNotes: "",
    consanguinity: false,
    labNote: "",
    imagingNote: "",
    treatmentNote: "",
  }));

  const set = <K extends keyof NewCaseDraft>(k: K, v: NewCaseDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const canSubmit = draft.headline.trim().length > 3;

  const submit = () => {
    dispatch({ type: "createCase", draft });
    toast({ title: t("aud.caseCreated", { id: draft.id, cluster: C(draft.phenotypeCluster), age: C(draft.ageGroup) }), body: t("new.next1") });
    router.push(`/cases/${draft.id}/verify`);
  };

  return (
    <>
      <header className="ody-rise og-between" style={{ alignItems: "flex-start", padding: "6px 4px 0" }}>
        <div style={{ maxWidth: "62ch" }}>
          <div className="og-row" style={{ gap: 10 }}>
            <Link href="/cases" className="og-small og-link">{t("nav.cases")}</Link>
            <span className="og-small" aria-hidden>/</span>
            <span className="og-small">{t("new.breadcrumb")}</span>
          </div>
          <h1 className="og-h1" style={{ marginTop: 12 }}>{t("new.title")}</h1>
          <p className="og-lede" style={{ marginTop: 10 }}>
            {t("new.lede")}
          </p>
        </div>
        <Disclaimer />
      </header>

      <div className="og-sec">
        <Panel glass><StepBar stages={SECTION_KEYS.map((k) => t(k))} index={step} /></Panel>
      </div>

      <div className="og-sec og-grid" data-cols="side">
        <Panel title={t(SECTION_KEYS[step])} meta={t("new.sectionOf", { n: step + 1, total: SECTION_KEYS.length })}>
          {step === 0 && (
            <div className="og-stack">
              <div className="og-grid" data-cols="2">
                <Field label={t("new.fRef")} hint={t("new.fRefHint")}>
                  <input className="og-input og-mono" value={draft.id} readOnly />
                </Field>
                <Field label={t("case.fCountry")}>
                  <input className="og-input" value={draft.country} onChange={(e) => set("country", e.target.value)} />
                </Field>
              </div>
              <div className="og-grid" data-cols="2">
                <Field label={t("case.fAgeGroup")} hint={t("new.fAgeHint")}>
                  <select className="og-select" value={draft.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
                    {["Infant · <1y", "Infant · 9m", "Child · 2y", "Child · 4y", "Child · 7y", "Adolescent · 13y", "Adult"].map((a) => <option key={a} value={a}>{C(a)}</option>)}
                  </select>
                </Field>
                <Field label={t("case.fSex")}>
                  <select className="og-select" value={draft.sex} onChange={(e) => set("sex", e.target.value)}>
                    {["Female", "Male", "Not recorded"].map((a) => <option key={a} value={a}>{C(a)}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={t("row.Phenotype cluster")} hint={t("new.fClusterHint")}>
                <select className="og-select" value={draft.phenotypeCluster} onChange={(e) => set("phenotypeCluster", e.target.value)}>
                  {["Neurological", "Metabolic", "Neuromuscular", "Hepatic", "Cardiac", "Immune", "Movement disorder", "Ophthalmic", "Dermatologic", "Multisystem"].map((a) => <option key={a} value={a}>{C(a)}</option>)}
                </select>
              </Field>
              <Banner tone="plain">
                {t("new.institutionLine", { inst: C(doctor.institution), city: C(doctor.city) })}
              </Banner>
            </div>
          )}

          {step === 1 && (
            <div className="og-stack">
              <Field label={t("new.fHeadline")} hint={t("new.fHeadlineHint")}>
                <input className="og-input" placeholder={t("new.fHeadlinePh")} value={draft.headline} onChange={(e) => set("headline", e.target.value)} />
              </Field>
              <Field label={t("new.fHistory")} hint={t("new.fHistoryHint")}>
                <textarea className="og-textarea" rows={6} placeholder={t("new.fHistoryPh")} value={draft.narrative} onChange={(e) => set("narrative", e.target.value)} />
              </Field>
              <Banner>
                {t("new.phenotypeNote")}
              </Banner>
            </div>
          )}

          {step === 2 && (
            <div className="og-stack">
              <Field label={t("new.fGenetics")} hint={t("new.fGeneticsHint")}>
                <textarea className="og-textarea" rows={3} placeholder={t("new.fGeneticsPh")} value={draft.geneticSummary} onChange={(e) => set("geneticSummary", e.target.value)} />
              </Field>
              <Field label={t("new.fLab")} hint={t("new.fLabHint")}>
                <input className="og-input" placeholder={t("new.fLabPh")} value={draft.labNote} onChange={(e) => set("labNote", e.target.value)} />
              </Field>
              <Field label={t("new.fImaging")} hint={t("new.fImagingHint")}>
                <input className="og-input" placeholder={t("new.fImagingPh")} value={draft.imagingNote} onChange={(e) => set("imagingNote", e.target.value)} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="og-stack">
              <Field label={t("new.fFamily")} hint={t("new.fFamilyHint")}>
                <textarea className="og-textarea" rows={3} placeholder={t("new.fFamilyPh")} value={draft.familyNotes} onChange={(e) => set("familyNotes", e.target.value)} />
              </Field>
              <label className="og-check">
                <input type="checkbox" checked={draft.consanguinity} onChange={(e) => set("consanguinity", e.target.checked)} />
                {t("new.consanguinity")}
              </label>
              <Field label={t("new.fTreatment")} hint={t("new.fTreatmentHint")}>
                <input className="og-input" placeholder={t("new.fTreatmentPh")} value={draft.treatmentNote} onChange={(e) => set("treatmentNote", e.target.value)} />
              </Field>
              <Banner tone="amber">
                {t("new.syntheticWarn")}
              </Banner>
            </div>
          )}

          <div className="og-between" style={{ marginTop: 22 }}>
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>{t("common.back")}</Button>
            {step < SECTION_KEYS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>{t("common.continue")}</Button>
            ) : (
              <Button onClick={submit} disabled={!canSubmit}>{t("new.submit")}</Button>
            )}
          </div>
          {step === SECTION_KEYS.length - 1 && !canSubmit && (
            <p className="og-small" style={{ marginTop: 10, color: "var(--amber)" }}>
              {t("new.needHeadline")}
            </p>
          )}
        </Panel>

        <aside className="og-stack">
          <Panel glass title={t("new.preview")}>
            <div className="og-row" style={{ gap: 10 }}>
              <span className="og-mono" style={{ fontSize: 16, fontWeight: 700 }}>{draft.id}</span>
              <Pill tone="amber">{t("status.Unresolved")}</Pill>
            </div>
            <p style={{ fontSize: 14, marginTop: 10, color: "var(--ink-2)" }}>
              {draft.headline || <span style={{ color: "var(--ink-4)" }}>{t("new.noPresentation")}</span>}
            </p>
            <dl className="og-kv" style={{ marginTop: 14 }}>
              <dt>{t("case.fCountry")}</dt><dd>{C(draft.country)}</dd>
              <dt>{t("case.fAgeGroup")}</dt><dd>{C(draft.ageGroup)}</dd>
              <dt>{t("case.fSex")}</dt><dd>{C(draft.sex)}</dd>
              <dt>{t("case.fCluster")}</dt><dd>{C(draft.phenotypeCluster)}</dd>
            </dl>
          </Panel>
          <Panel title={t("new.whatNext")}>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.85, color: "var(--ink-2)" }}>
              <li>{t("new.next1")}</li>
              <li>{t("new.next2")}</li>
              <li>{t("new.next3")}</li>
              <li>{t("new.next4")}</li>
            </ol>
          </Panel>
        </aside>
      </div>
    </>
  );
}
