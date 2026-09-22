import { notFound } from "next/navigation";
import { CONCEPTS, SCREENS, findConcept, type ScreenId } from "@/lib/concepts";
import { LabFrame } from "@/components/LabFrame";
import { ConceptRenderer } from "@/concepts/registry";

export function generateStaticParams() {
  return CONCEPTS.flatMap((c) => SCREENS.map((s) => ({ concept: c.id, screen: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string; screen: string }> }) {
  const { concept, screen } = await params;
  const c = findConcept(concept);
  const s = SCREENS.find((x) => x.id === screen);
  return { title: c && s ? `${c.num} ${c.name} · ${s.label} — ODYSSEY Design Lab` : "ODYSSEY Design Lab" };
}

export default async function Page({ params }: { params: Promise<{ concept: string; screen: string }> }) {
  const { concept, screen } = await params;
  if (!findConcept(concept) || !SCREENS.some((s) => s.id === screen)) notFound();
  return (
    <LabFrame conceptId={concept} screen={screen as ScreenId}>
      <ConceptRenderer conceptId={concept} screen={screen as ScreenId} />
    </LabFrame>
  );
}
