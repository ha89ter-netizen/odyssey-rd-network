/**
 * SIMULATED AI EXTRACTION.
 *
 * No model is called. A fixed, synthetic document maps to a fixed list of
 * proposed phenotype terms, each carrying the sentence it was "drawn from".
 * This is a product simulation of AI-assisted extraction, so the demo is
 * deterministic and never depends on a network call.
 *
 * Nothing here is diagnostic. Proposed terms are not part of the case until
 * a clinician confirms them.
 */
import type { Phenotype } from "./types";

export type DemoDocument = {
  id: string;
  fileName: string;
  label: string;
  pages: number;
  sizeLabel: string;
  description: string;
};

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: "neuro-summary",
    fileName: "neuro-summary-2026-02.pdf",
    label: "Neurology discharge summary",
    pages: 7,
    sizeLabel: "1.4 MB",
    description: "Paediatric neurology summary covering birth to 4 years, including EEG and MRI reports.",
  },
  {
    id: "metabolic-panel",
    fileName: "metabolic-workup-2025-11.pdf",
    label: "Metabolic work-up report",
    pages: 4,
    sizeLabel: "820 KB",
    description: "Plasma and CSF metabolite panel with interpretation.",
  },
];

export type ExtractedTerm = Phenotype & { confidence: number; evidence: string; page: string };

const term = (
  hpo: string, name: string, onset: string, severity: Phenotype["severity"],
  confidence: number, evidence: string, page: string,
): ExtractedTerm => ({
  hpo, term: name, onset, severity, status: "Present",
  source: "AI extraction", verification: "unverified", confidence, evidence, page,
});

/** Deterministic: the same document always yields the same proposals, in this order. */
const BY_DOCUMENT: Record<string, ExtractedTerm[]> = {
  "neuro-summary": [
    term("HP:0001263", "Global developmental delay", "8 months", "Severe", 0.96,
      "…has not acquired independent sitting by 8 months and shows delay across all domains…", "p. 2"),
    term("HP:0001252", "Hypotonia", "5 months", "Moderate", 0.94,
      "…marked truncal hypotonia with preserved deep tendon reflexes…", "p. 2"),
    term("HP:0001250", "Seizure", "14 months", "Severe", 0.98,
      "…focal seizures with secondary generalisation, first documented at 14 months…", "p. 3"),
    term("HP:0002376", "Developmental regression", "16 months", "Severe", 0.91,
      "…loss of previously acquired head control following a febrile episode…", "p. 3"),
    term("HP:0001249", "Intellectual disability", "24 months", "Severe", 0.88,
      "…profound cognitive impairment on structured assessment…", "p. 5"),
    term("HP:0000639", "Nystagmus", "12 months", "Mild", 0.62,
      "…intermittent ocular instability noted by parents…", "p. 4"),
    term("HP:0001744", "Splenomegaly", "—", "Mild", 0.41,
      "…spleen not palpably enlarged…", "p. 6"),
  ],
  "metabolic-panel": [
    term("HP:0002151", "Increased serum lactate", "18 months", "Moderate", 0.97,
      "…plasma lactate 4.1 mmol/L (reference 0.5–2.2) on two separate samples…", "p. 1"),
    term("HP:0003348", "Hyperalaninemia", "18 months", "Moderate", 0.89,
      "…alanine 648 µmol/L, consistent with chronic lactate elevation…", "p. 2"),
    term("HP:0011968", "Feeding difficulties", "6 months", "Moderate", 0.74,
      "…required nasogastric supplementation between 6 and 11 months…", "p. 3"),
  ],
};

export function extractFrom(documentId: string): ExtractedTerm[] {
  return (BY_DOCUMENT[documentId] ?? BY_DOCUMENT["neuro-summary"]).map((t) => ({ ...t }));
}

/**
 * A term is low confidence if the parser itself is unsure about the text.
 * This says nothing about the patient — only about the sentence.
 */
export const LOW_CONFIDENCE = 0.7;

/** Terms the parser proposed but whose source sentence is a negation. */
export function likelyNegation(t: ExtractedTerm): boolean {
  return /\bnot\b|\bno\b|\bwithout\b|\bdenies\b/i.test(t.evidence);
}
