import { redirect } from "next/navigation";

export default async function ConceptIndex({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  redirect(`/design-lab/${concept}/dashboard`);
}
