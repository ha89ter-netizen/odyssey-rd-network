import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const OUT = process.env.SHOT_DIR;
const BASE = "http://localhost:4311";
const targets = process.argv.slice(2);

const exe = [
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
].find(existsSync);

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const t of targets) {
  const [path, name, opt] = t.split("|");
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: opt === "full", animations: "disabled" });
  console.log("shot", name);
}
await browser.close();
