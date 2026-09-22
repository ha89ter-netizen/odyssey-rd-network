import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
const BASE = process.env.BASE ?? "http://localhost:4311";
const exe = [`${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`].find(existsSync);
const PATHS = ["/enter","/dashboard","/cases","/cases/new","/cases/ODY-001","/cases/ODY-001/verify","/cases/ODY-001/matches","/cases/ODY-027/matches","/matches","/collaboration","/knowledge","/network","/notifications","/settings","/admin"];
const b = await chromium.launch({ executablePath: exe });
let problems = 0;
for (const w of [1500, 1100, 390]) {
  const page = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = [];
  page.on("pageerror", e => errs.push(String(e).slice(0,140)));
  page.on("console", m => { if (m.type()==="error") errs.push(m.text().slice(0,140)); });
  await page.goto(`${BASE}/enter`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Enter demo as", exact: false }).first().click();
  await page.waitForTimeout(700);
  if (process.env.LANG_RU) {
    await page.getByRole("button", { name: "РУ", exact: true }).first().click();
    await page.waitForTimeout(600);
  }
  for (const p of PATHS) {
    errs.length = 0;
    await page.goto(`${BASE}${p}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(280);
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, len: document.body.innerText.length }));
    const overflow = m.sw - m.cw;
    if (overflow > 2 || m.len < 120 || errs.length) { problems++; console.log(`[${w}px] ${p}  overflow=${overflow}  text=${m.len}  errors=${errs.slice(0,1).join("|") || "-"}`); }
  }
  await page.close();
}
console.log(problems === 0 ? `SWEEP CLEAN — ${PATHS.length * 3} checks` : `SWEEP: ${problems} issue(s)`);
await b.close();
