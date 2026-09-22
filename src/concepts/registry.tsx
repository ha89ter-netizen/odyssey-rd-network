"use client";

import type { ScreenId } from "@/lib/concepts";
import C01 from "./01-clinical-command";
import C02 from "./02-molecular-atlas";
import C03 from "./03-swiss-clinical";
import C04 from "./04-evidence-archive";
import C05 from "./05-precision-laboratory";
import C06 from "./06-global-network";
import C07 from "./07-quiet-luxury";
import C08 from "./08-bio-glass";
import C09 from "./09-medical-os";
import C10 from "./10-human-machine";

export type ConceptComponent = (props: { screen: ScreenId }) => React.ReactNode;

const registry: Record<string, ConceptComponent> = {
  "01-clinical-command": C01,
  "02-molecular-atlas": C02,
  "03-swiss-clinical": C03,
  "04-evidence-archive": C04,
  "05-precision-laboratory": C05,
  "06-global-network": C06,
  "07-quiet-luxury": C07,
  "08-bio-glass": C08,
  "09-medical-os": C09,
  "10-human-machine": C10,
};

export function ConceptRenderer({ conceptId, screen }: { conceptId: string; screen: ScreenId }) {
  const Concept = registry[conceptId];
  if (!Concept) return null;
  // key forces a fresh mount so entrance motion replays on every switch
  return <Concept key={`${conceptId}:${screen}`} screen={screen} />;
}
