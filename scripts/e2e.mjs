/**
 * End-to-end walk of the P0 demo flow, from a clean page load.
 * Fails loudly on console errors, missing elements or dead ends.
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:4311";
const exe = [`${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`].find(existsSync);

const errors = [];
let step = 0;
const ok = (m) => console.log(`  ✓ ${String(++step).padStart(2, "0")}  ${m}`);
const fail = (m) => { errors.push(m); console.log(`  ✗ ${String(++step).padStart(2, "0")}  ${m}`); };

const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`));
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`console: ${m.text().slice(0, 200)}`); });

const TIMEOUT = 15000;

const has = async (text, label) => {
  try {
    await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: TIMEOUT });
    ok(label ?? `sees “${text}”`);
    return true;
  } catch {
    fail(label ?? `MISSING “${text}”`);
    return false;
  }
};
const clickText = async (text, label) => {
  try {
    const el = page.getByText(text, { exact: false }).first();
    await el.waitFor({ state: "visible", timeout: TIMEOUT });
    await el.click();
    await page.waitForTimeout(450);
    ok(label ?? `clicked “${text}”`);
  } catch {
    fail(`cannot click “${text}”`);
  }
};
const clickBtn = async (name, label) => {
  try {
    const b = page.getByRole("button", { name, exact: false }).first();
    await b.waitFor({ state: "visible", timeout: TIMEOUT });
    await b.click();
    await page.waitForTimeout(500);
    ok(label ?? `pressed “${name}”`);
  } catch {
    fail(`button “${name}” not found`);
  }
};

// Warm every route first so a cold dev compile is not mistaken for a failure.
for (const p of ["/enter", "/dashboard", "/cases", "/cases/new", "/cases/ODY-001", "/cases/ODY-001/verify",
                 "/cases/ODY-001/matches", "/matches", "/collaboration", "/knowledge", "/network",
                 "/notifications", "/settings", "/admin"]) {
  await page.goto(`${BASE}${p}`, { waitUntil: "domcontentloaded" }).catch(() => {});
}
consoleErrors.length = 0;

/** The header chip opens a modal; scope the click to it so we do not hit a case byline. */
const switchDoctor = async (surname, label) => {
  try {
    await page.locator(".og-whochip").first().click();
    const opt = page.locator(".og-scrim .og-docoption").filter({ hasText: surname }).first();
    await opt.waitFor({ state: "visible", timeout: TIMEOUT });
    await opt.click();
    await page.waitForTimeout(900);
    ok(label ?? `switched to Dr ${surname}`);
  } catch {
    fail(`could not switch to Dr ${surname}`);
  }
};

console.log("\nP0 FLOW\n");

/* 1 — enter */
await page.goto(`${BASE}/enter`, { waitUntil: "networkidle" });
await has("The answer may already exist.", "landing renders");
await clickBtn("Enter demo as", "entered demo as Dr Seitkali");
await page.waitForURL("**/dashboard", { timeout: 8000 }).catch(() => fail("did not reach dashboard"));
await has("Good morning", "dashboard renders");

/* 2 — dashboard counts are real */
await page.locator(".og-metric-n").first().waitFor({ state: "visible", timeout: TIMEOUT }).catch(() => {});
const unresolved = await page.locator(".og-metric-n").first().innerText().catch(() => "0");
Number(unresolved) > 0 ? ok(`unresolved count derived from data (${unresolved})`) : fail("unresolved count is zero/unreadable");

/* 3 — open ODY-001 */
await page.goto(`${BASE}/cases/ODY-001`, { waitUntil: "networkidle" });
await has("ODY-001", "case intelligence opens");
await has("Case completeness", "completeness panel present");
await clickText("Phenotype", "opened phenotype tab");
await has("HP:0001263", "phenotype terms listed");

/* 4 — find matches */
await page.goto(`${BASE}/cases/ODY-001`, { waitUntil: "networkidle" });
await clickBtn("Find matches", "ran federated search");
await page.waitForURL("**/cases/ODY-001/matches", { timeout: 12000 }).catch(() => fail("search never completed"));
await page.waitForTimeout(700);
await has("ODY-742", "ODY-742 surfaced as a candidate");
await has("Strong potential match", "labelled a strong potential match");

/* 5 — why this match */
await clickBtn("Why this match", "opened the match");
await page.waitForTimeout(800);
await has("Why this match was surfaced", "WHY explanation present");
await has("phenotype features overlap", "explanation is derived from data");
await has("Evidence supporting similarity", "evidence dimensions listed");
const matchUrl = page.url();

/* 6 — compare */
await page.goto(matchUrl.replace(/\/$/, "") + "/compare", { waitUntil: "networkidle" });
await has("Shared signals", "comparison summary present");
await has("Signal by signal", "full comparison table present");

/* 7 — request connection */
await page.goto(matchUrl, { waitUntil: "networkidle" });
await clickBtn("Request clinical connection", "opened request dialog");
await page.locator("textarea").first().fill("Our case carries the same variant but no second allele was found.");
await clickBtn("Send request", "sent the connection request");
await page.waitForTimeout(600);
await has("Connection requested", "pending state shown");

/* 8 — switch to Doctor B and accept */
await switchDoctor("Brandt", "switched to Dr Brandt");
await page.goto(matchUrl, { waitUntil: "networkidle" });
await has("New collaboration request", "Doctor B sees the request");
await clickBtn("Accept", "accepted the connection");
await page.waitForTimeout(1400);
if (page.url().includes("/collaboration/")) ok("collaboration room opened"); else fail(`did not land in a room (at ${page.url()})`);

/* 9 — room: evidence + message */
await has("Clinical discussion", "discussion present");
await has("Case summary", "evidence remains visible");
await page.locator("textarea").first().fill("Long-read sequencing found a deep intronic candidate here.");
await clickBtn("Send", "sent a message");
await page.waitForTimeout(500);
await has("Long-read sequencing found", "message appears in the thread");

/* 10 — verify as B */
await clickBtn("Verify clinical relevance", "opened verification dialog");
await page.locator("textarea").first().fill("Shared variant and identical imaging pattern justify joint re-analysis.");
await clickBtn("Confirm clinical relevance", "verified as Dr Brandt");
await page.waitForTimeout(900);
const roomUrl = page.url();

/* 11 — switch back to A and verify */
await switchDoctor("Seitkali", "switched back to Dr Seitkali");
await page.goto(roomUrl, { waitUntil: "networkidle" });
await clickBtn("Verify clinical relevance", "opened verification as Dr Seitkali");
await page.locator("textarea").first().fill("Agreed. Targeted re-analysis of our genome data is warranted.");
await clickBtn("Confirm clinical relevance", "verified as Dr Seitkali");
await page.waitForTimeout(1000);
await has("Clinically corroborated", "connection is corroborated");

/* 12 — knowledge contribution */
await page.goto(`${BASE}/knowledge`, { waitUntil: "networkidle" });
await has("Verified cross-border case connection", "knowledge contribution recorded");
await has("How knowledge compounds", "network-learning visual present");

/* 13 — no-match scenario */
await page.goto(`${BASE}/cases/ODY-027`, { waitUntil: "networkidle" });
await clickBtn("Find matches", "searched the no-match case");
await page.waitForURL("**/cases/ODY-027/matches", { timeout: 12000 }).catch(() => fail("no-match search never completed"));
await page.waitForTimeout(700);
await has("No strong match found yet", "no-match state renders");
await has("can be re-evaluated", "standing-query message present");

/* 14 — audit trail */
await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await clickText("Audit (", "opened audit tab");
for (const a of ["Knowledge contribution recorded", "Clinical verification completed", "Connection accepted", "Match generated"]) {
  await has(a, `audit records: ${a}`);
}

/* 15 — every nav destination resolves */
for (const p of ["/dashboard", "/cases", "/cases/new", "/matches", "/collaboration", "/knowledge", "/network", "/notifications", "/settings", "/admin"]) {
  const r = await page.goto(`${BASE}${p}`, { waitUntil: "networkidle" });
  const body = await page.locator("body").innerText();
  if (r?.status() === 200 && body.length > 200) ok(`${p} renders`); else fail(`${p} is empty or errored`);
}

/* ---------------- second branch: a case created from scratch ---------------- */
console.log("\nCREATE → UPLOAD → EXTRACT → VERIFY\n");

await page.goto(`${BASE}/cases/new`, { waitUntil: "networkidle" });
await has("Create case", "creation wizard opens");
await clickBtn("Continue", "section 1 → 2");
await page.locator('input[placeholder*="Progressive infantile"]').first().fill("Unexplained infantile hypotonia with lactate elevation");
await page.locator("textarea").first().fill("Hypotonia from 4 months, plateau at 12 months, exome non-diagnostic.");
ok("entered the clinical picture");
await clickBtn("Continue", "section 2 → 3");
await clickBtn("Continue", "section 3 → 4");
await clickBtn("Create case", "created the case");
await page.waitForURL("**/verify", { timeout: 12000 }).catch(() => fail("did not reach the upload step"));
await has("AI-assisted extraction", "upload step opens");

await clickBtn("Upload & extract", "uploaded a synthetic report");
await page.waitForTimeout(3200);
await has("Detected clinical signals", "extraction completed");
await has("Global developmental delay", "proposed terms listed");
await has("SIMULATED AI EXTRACTION", "extraction is labelled as simulated");

const beforeVerify = await page.getByText("Doctor verified", { exact: false }).count();
await clickBtn("Confirm all remaining", "clinician confirmed the proposed terms");
await page.waitForTimeout(600);
const afterVerify = await page.getByText("Doctor verified", { exact: false }).count();
afterVerify > beforeVerify ? ok(`terms moved to doctor-verified (${beforeVerify} → ${afterVerify})`) : fail("verification did not change state");

await clickBtn("Find matches", "ran a search on the new case");
await page.waitForURL("**/matches", { timeout: 14000 }).catch(() => fail("search on the new case never completed"));
await page.waitForTimeout(800);
const body = await page.locator("body").innerText();
/No strong match found yet|candidates? above the review threshold|Top candidate/.test(body)
  ? ok("new case reached a real result state (match or no-match)")
  : fail("new case ended on an indeterminate screen");

/* ---- the archived design lab is unlinked from the app but must still build ---- */
await page.goto(`${BASE}/design-lab/08-bio-glass/dashboard`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
(await page.locator("body").innerText()).length > 500 ? ok("design lab still renders after theme extraction") : fail("design lab broke");

console.log("\nCONSOLE\n");
if (consoleErrors.length === 0) console.log("  ✓ no console errors");
else consoleErrors.slice(0, 10).forEach((e) => console.log("  ✗ " + e));

console.log(`\n${errors.length === 0 && consoleErrors.length === 0 ? "P0 FLOW PASSED" : `FAILURES: ${errors.length} flow, ${consoleErrors.length} console`}\n`);
await browser.close();
process.exit(errors.length || consoleErrors.length ? 1 : 0);
