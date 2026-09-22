/**
 * Demo driver: drives the real product in a recorded browser with a scripted,
 * human-looking cursor. Nothing on screen is mocked — every pixel is the
 * running application.
 */
import { chromium } from "playwright-core";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";

const CURSOR_JS = readFileSync(new URL("./cursor.js", import.meta.url), "utf8");

const EXES = [
  `${homedir()}/Library/Caches/ms-playwright/chromium-1228/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
  `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
];

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rand = (a, b) => a + Math.random() * (b - a);

/** Scales every deliberate pause, but never the motion itself, so a tighter cut
    still moves like a hand rather than a fast-forward. */
const PACE = Number(process.env.PACE ?? 1);

export async function openStage({ width = 1920, height = 1080, dir, base }) {
  const executablePath = EXES.find(existsSync);
  const browser = await chromium.launch({
    executablePath,
    args: ["--force-device-scale-factor=1", "--hide-scrollbars", "--disable-lcd-text"],
  });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    recordVideo: { dir, size: { width, height } },
    reducedMotion: "no-preference",
  });
  await context.addInitScript(CURSOR_JS);
  const page = await context.newPage();
  return new Stage({ browser, context, page, width, height, base });
}

class Stage {
  constructor({ browser, context, page, width, height, base }) {
    Object.assign(this, { browser, context, page, width, height, base });
    this.pos = { x: width * 0.5, y: height * 0.72 };
  }

  async sync() {
    await this.page.evaluate(() => window.__odyCursorInit?.()).catch(() => {});
    await this.page.evaluate(([x, y]) => window.__odyMove?.(x, y), [this.pos.x, this.pos.y]).catch(() => {});
  }

  async goto(path, { settle = 900 } = {}) {
    await this.page.goto(`${this.base}${path}`, { waitUntil: "networkidle" });
    await this.sync();
    await this.hold(settle);
  }

  wait(ms) { return this.page.waitForTimeout(ms); }

  /** A deliberate pause — subject to PACE. */
  hold(ms) { return this.page.waitForTimeout(Math.max(80, ms * PACE)); }

  /** Eased travel with a small approach correction, like a real hand. */
  async moveTo(x, y, { duration = 620, settle = 140 } = {}) {
    const from = { ...this.pos };
    const steps = Math.max(12, Math.round(duration / 16));
    // gentle arc so the path is never a dead straight line
    const nx = -(y - from.y), ny = x - from.x;
    const len = Math.hypot(nx, ny) || 1;
    const bow = Math.min(46, len * 0.12) * (Math.random() < 0.5 ? -1 : 1);
    for (let i = 1; i <= steps; i++) {
      const t = easeInOut(i / steps);
      const arc = Math.sin(Math.PI * (i / steps)) * bow;
      const px = from.x + (x - from.x) * t + (nx / len) * arc;
      const py = from.y + (y - from.y) * t + (ny / len) * arc;
      this.pos = { x: px, y: py };
      await this.page.mouse.move(px, py);
      await this.page.evaluate(([a, b]) => window.__odyMove?.(a, b), [px, py]).catch(() => {});
      await this.wait(16);
    }
    this.pos = { x, y };
    await this.page.mouse.move(x, y);
    await this.page.evaluate(([a, b]) => window.__odyMove?.(a, b), [x, y]).catch(() => {});
    if (settle) await this.hold(settle);
  }

  async box(selector, { nth = 0 } = {}) {
    const loc = this.page.locator(selector).nth(nth);
    await loc.waitFor({ state: "visible", timeout: 20000 });
    await loc.scrollIntoViewIfNeeded();
    await this.hold(260);
    const b = await loc.boundingBox();
    if (!b) throw new Error(`no box for ${selector}`);
    return b;
  }

  async hover(selector, { nth = 0, duration = 620, dwell = 420 } = {}) {
    const b = await this.box(selector, { nth });
    const x = b.x + b.width / 2 + rand(-6, 6);
    const y = b.y + b.height / 2 + rand(-4, 4);
    await this.moveTo(x, y, { duration });
    await this.page.evaluate(([a, c]) => window.__odyRing?.(true, a, c), [x, y]).catch(() => {});
    await this.hold(dwell);
    return { x, y };
  }

  async click(selector, { nth = 0, duration = 640, dwell = 420, after = 700 } = {}) {
    const { x, y } = await this.hover(selector, { nth, duration, dwell });
    await this.page.evaluate(() => window.__odyDown?.(true)).catch(() => {});
    await this.page.evaluate(([a, b]) => window.__odyRipple?.(a, b), [x, y]).catch(() => {});
    await this.hold(110);
    await this.page.mouse.click(x, y);
    await this.page.evaluate(() => window.__odyDown?.(false)).catch(() => {});
    await this.page.evaluate(() => window.__odyRing?.(false)).catch(() => {});
    await this.hold(after);
    await this.sync();
  }

  /** Click a control, then type at a human cadence. */
  async type(selector, text, { nth = 0, cps = 22 } = {}) {
    await this.click(selector, { nth, dwell: 260, after: 220 });
    for (const ch of text) {
      await this.page.keyboard.type(ch);
      await this.wait(1000 / cps + rand(-14, 26));   // typing cadence stays human
    }
    await this.hold(320);
  }

  async select(selector, value, { nth = 0 } = {}) {
    await this.hover(selector, { nth, dwell: 300 });
    await this.page.locator(selector).nth(nth).selectOption(value);
    await this.hold(420);
  }

  /** Reads a region for a beat, as a person would. */
  async read(selector, { nth = 0, ms = 1200 } = {}) {
    await this.hover(selector, { nth, dwell: 0, duration: 700 });
    await this.hold(ms);
    await this.page.evaluate(() => window.__odyRing?.(false)).catch(() => {});
  }

  async scroll(px, { duration = 900 } = {}) {
    const steps = Math.max(10, Math.round(duration / 16));
    for (let i = 0; i < steps; i++) {
      await this.page.mouse.wheel(0, px / steps);
      await this.wait(16);
    }
    await this.hold(260);
  }

  async close() {
    const video = this.page.video();
    await this.context.close();
    await this.browser.close();
    return video ? await video.path() : null;
  }
}
