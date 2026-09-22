import { openStage } from "./driver.mjs";
import { SCENES, ORDER } from "./scenes.mjs";

const OUT = process.env.OUT ?? "/tmp/ody-video";
const BASE = process.env.BASE ?? "http://localhost:4311";
const only = process.env.SCENES ? process.env.SCENES.split(",") : ORDER;
const W = Number(process.env.W ?? 1600);
const H = Number(process.env.H ?? 900);

const stage = await openStage({ width: W, height: H, dir: OUT, base: BASE });

// Partial runs need the demo already entered, otherwise the scene starts on a blank page.
if (only[0] !== "opening") {
  await stage.page.goto(`${BASE}/enter`, { waitUntil: "networkidle" });
  await stage.page.getByRole("button", { name: "Enter demo as", exact: false }).first().click();
  await stage.page.waitForURL("**/dashboard", { timeout: 20000 });
  await stage.sync();
  await stage.wait(600);
  console.log("  · bootstrapped into the demo");
}

const t0 = Date.now();
for (const name of only) {
  const t = Date.now();
  try {
    await SCENES[name](stage);
    console.log(`  ✓ ${name.padEnd(14)} ${((Date.now() - t) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`  ✗ ${name.padEnd(14)} ${String(e.message).slice(0, 120)}`);
    break;
  }
}
const path = await stage.close();
console.log(`\ntotal ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log("raw:", path);
