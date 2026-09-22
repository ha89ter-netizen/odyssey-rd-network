/** Verifies the Russian interface, including engine-generated sentences. */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:4311";
const exe = [`${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`].find(existsSync);
const errors = [];
let n = 0;
const ok = (m) => console.log(`  ✓ ${String(++n).padStart(2, "0")}  ${m}`);
const bad = (m) => { errors.push(m); console.log(`  ✗ ${String(++n).padStart(2, "0")}  ${m}`); };

const b = await chromium.launch({ executablePath: exe });
const page = await b.newPage({ viewport: { width: 1500, height: 950 } });
const ce = [];
page.on("pageerror", (e) => ce.push(String(e).slice(0, 160)));
page.on("console", (m) => { if (m.type() === "error") ce.push(m.text().slice(0, 160)); });

const has = async (text, label) => {
  try { await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: 12000 }); ok(label ?? `«${text}»`); }
  catch { bad(label ?? `НЕТ «${text}»`); }
};
const btn = async (name) => { const x = page.getByRole("button", { name, exact: false }).first(); await x.waitFor({ timeout: 12000 }); await x.click(); await page.waitForTimeout(500); };

console.log("\nRUSSIAN UI\n");

await page.goto(`${BASE}/enter`, { waitUntil: "networkidle" });
await btn("Enter demo as");
await page.waitForTimeout(700);

// switch to Russian via the header toggle
await page.getByRole("button", { name: "РУ", exact: true }).first().click();
await page.waitForTimeout(700);
ok("switched to Russian");

await has("Доброе утро", "dashboard greeting");
await has("Неразрешённые случаи", "metric labels");
await has("Обзор", "navigation");

await page.goto(`${BASE}/cases/ODY-001`, { waitUntil: "networkidle" });
await has("Прогрессирующая младенческая энцефалопатия", "case headline (clinical content)");
await has("Полнота случая", "completeness panel");
await page.getByRole("tab", { name: "Фенотип", exact: false }).first().click();
await page.waitForTimeout(400);
await has("Общая задержка развития", "HPO term rendered in Russian");
await has("Подтверждено врачом", "verification state");

await btn("Найти совпадения");
await page.waitForURL("**/matches", { timeout: 15000 }).catch(() => bad("search did not complete"));
await page.waitForTimeout(900);
await has("Сильное потенциальное совпадение", "match label");
await btn("Почему это совпадение");
await page.waitForTimeout(900);
await has("Почему это совпадение найдено", "why panel");
await has("фенотипических признаков", "engine sentence in Russian");
await has("Сходство фенотипа", "dimension label");
await has("Доказательства, поддерживающие сходство", "evidence panel");
const body = await page.locator("body").innerText();
/[A-Za-z]{4,} [A-Za-z]{4,} [A-Za-z]{4,} [A-Za-z]{4,}/.test(body.replace(/ODY-\d+|NDUFAF6|HP:\d+|HGVS|HPO|MR|T2|ODYSSEY|DEMONSTRATION DATA[^·]*/g, ""))
  ? bad("English sentences still leaking into the Russian UI")
  : ok("no English sentences left on the match screen");

await page.goto(`${BASE}/matches`, { waitUntil: "networkidle" });
await has("Совпадения", "matches page");
await page.goto(`${BASE}/knowledge`, { waitUntil: "networkidle" });
await has("Вклады в знание", "knowledge page");
await page.goto(`${BASE}/network`, { waitUntil: "networkidle" });
await has("Учреждения", "network page");
await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" });
await has("Язык интерфейса", "language control in settings");

// persistence across reload
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);
await has("Язык интерфейса", "language persists across reload");

console.log("\nCONSOLE\n");
ce.length === 0 ? console.log("  ✓ no console errors") : ce.slice(0, 6).forEach((e) => console.log("  ✗ " + e));
console.log(`\n${errors.length === 0 && ce.length === 0 ? "RUSSIAN UI PASSED" : `FAILURES: ${errors.length} + ${ce.length} console`}\n`);
await b.close();
process.exit(errors.length || ce.length ? 1 : 0);
