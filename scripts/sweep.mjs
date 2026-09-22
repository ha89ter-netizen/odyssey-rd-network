import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const CONCEPTS = ["01-clinical-command","02-molecular-atlas","03-swiss-clinical","05-precision-laboratory","06-global-network","08-bio-glass","09-medical-os"];
const SCREENS = ["dashboard","create","case","match","compare","room"];
const exe = [
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
].find(existsSync);

const widths = [1600, 1180, 390];
const browser = await chromium.launch({ executablePath: exe });
let problems = 0;
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
  for (const c of CONCEPTS) {
    for (const s of SCREENS) {
      errors.length = 0;
      await page.goto(`http://localhost:4311/design-lab/${c}/${s}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(220);
      const m = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        h: document.body.scrollHeight,
      }));
      const overflow = m.scrollW - m.clientW;
      const short = m.h < 700;
      if (overflow > 2 || short || errors.length) {
        problems++;
        console.log(`[${w}px] ${c}/${s}  overflow=${overflow}px  height=${m.h}  errors=${errors.length ? errors.slice(0,2).join(" | ") : "-"}`);
      }
    }
  }
  await page.close();
}
console.log(problems === 0 ? "SWEEP CLEAN — 180 checks, no overflow or console errors" : `SWEEP: ${problems} issue(s)`);
await browser.close();
