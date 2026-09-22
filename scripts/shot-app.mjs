/** Screenshots of the running MVP. Replays enough of the flow to reach each screen. */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
const OUT = process.env.SHOT_DIR;
const BASE = process.env.BASE ?? "http://localhost:4311";
const exe = [`${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`].find(existsSync);
const W = Number(process.env.W ?? 1500);

const b = await chromium.launch({ executablePath: exe });
const page = await b.newPage({ viewport: { width: W, height: 1000 } });
const btn = async (n) => { const x = page.getByRole("button", { name: n, exact: false }).first(); await x.waitFor({ timeout: 15000 }); await x.click(); await page.waitForTimeout(500); };

// enter as Doctor A and drive the flow far enough that every screen has content
await page.goto(`${BASE}/enter`, { waitUntil: "networkidle" });
await btn("Enter demo as");
await page.waitForTimeout(600);
await page.goto(`${BASE}/cases/ODY-001`, { waitUntil: "networkidle" });
await btn("Find matches");
await page.waitForURL("**/matches", { timeout: 15000 });
await page.waitForTimeout(900);
await btn("Why this match");
await page.waitForTimeout(900);
const matchUrl = page.url();
await btn("Request clinical connection");
await page.locator("textarea").first().fill("Same coding variant here, but we never identified a second allele.");
await btn("Send request");
await page.waitForTimeout(600);
await page.locator(".og-whochip").first().click();
await page.locator(".og-scrim .og-docoption").filter({ hasText: "Brandt" }).first().click();
await page.waitForTimeout(900);
await page.goto(matchUrl, { waitUntil: "networkidle" });
await btn("Accept");
await page.waitForTimeout(1400);
const roomUrl = page.url();
await page.locator("textarea").first().fill("Long-read sequencing here found a deep intronic candidate in the same gene.");
await btn("Send");
await page.waitForTimeout(500);
await btn("Verify clinical relevance");
await page.locator("textarea").first().fill("Shared variant and identical imaging pattern justify joint re-analysis.");
await btn("Confirm clinical relevance");
await page.waitForTimeout(900);
await page.locator(".og-whochip").first().click();
await page.locator(".og-scrim .og-docoption").filter({ hasText: "Seitkali" }).first().click();
await page.waitForTimeout(900);
await page.goto(roomUrl, { waitUntil: "networkidle" });
await btn("Verify clinical relevance");
await page.locator("textarea").first().fill("Agreed. Targeted re-analysis of our genome data is warranted.");
await btn("Confirm clinical relevance");
await page.waitForTimeout(1000);

const targets = process.argv.slice(2);
for (const t of targets) {
  const [path, name, opt] = t.split("|");
  await page.goto(`${BASE}${path.replace("{match}", new URL(matchUrl).pathname).replace("{room}", new URL(roomUrl).pathname)}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: opt === "full", animations: "disabled" });
  console.log("shot", name);
}
await b.close();
