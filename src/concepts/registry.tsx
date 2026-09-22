"use client";

import type { ScreenId } from "@/lib/concepts";
import C01 from "./01-clinical-command";
import C02 from "./02-molecular-atlas";
import C03 from "./03-swiss-clinical";
import C05 from "./05-precision-laboratory";
import C06 from "./06-global-network";
import C08 from "./08-bio-glass";
import C09 from "./09-medical-os";

export type ConceptComponent = (props: { screen: ScreenId }) => React.ReactNode;

const registry: Record<string, ConceptComponent> = {
  "01-clinical-command": C01,
  "02-molecular-atlas": C02,
  "03-swiss-clinical": C03,
  "05-precision-laboratory": C05,
  "06-global-network": C06,
  "08-bio-glass": C08,
  "09-medical-os": C09,
};

export function ConceptRenderer({ conceptId, screen }: { conceptId: string; screen: ScreenId }) {
  const Concept = registry[conceptId];
  if (!Concept) return null;
  // key forces a fresh mount so entrance motion replays on every switch
  return <Concept key={`${conceptId}:${screen}`} screen={screen} />;
}
