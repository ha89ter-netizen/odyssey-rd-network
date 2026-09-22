import { buildSeedState } from "../src/store/seed";
import { runMatching, SURFACE_THRESHOLD } from "../src/store/matching";

const s = buildSeedState();
const all = Object.values(s.cases);
for (const src of ["ODY-001", "ODY-027"]) {
  const results = runMatching(s.cases[src], all);
  const surfaced = results.filter((r) => r.score >= SURFACE_THRESHOLD);
  console.log(`\n${src} → ${surfaced.length} surfaced (threshold ${SURFACE_THRESHOLD})`);
  results.slice(0, 4).forEach((r) => console.log(`   ${r.targetCaseId.padEnd(9)} ${String(r.score).padStart(3)}  ${r.labelKey}`));
  if (src === "ODY-001") {
    const top = results[0];
    console.log("   dimensions:", top.dimensions.map((d) => `${d.id}=${d.score}`).join(" "));
    console.log("   why:");
    top.explanation.forEach((e) => console.log("     ·", e.key, JSON.stringify(e.params ?? {})));
  }
}
const a = runMatching(s.cases["ODY-001"], all)[0].score;
const b = runMatching(s.cases["ODY-001"], all)[0].score;
console.log(`\ndeterministic: ${a === b ? "yes" : "NO — " + a + " vs " + b}`);
