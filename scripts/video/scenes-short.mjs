/**
 * The one-minute cut: site → clinician → case → match → message → reply →
 * meeting → title. No case creation, no detours. Timings are explicit here
 * rather than paced globally, because every beat is budgeted.
 */

export const SCENES = {
  /* 1 — the site */
  async site(s) {
    await s.goto("/enter", { settle: 700 });
    await s.read("h1.og-h1", { ms: 900, duration: 520 });
  },

  /* 2 — choosing the clinician */
  async pickDoctor(s) {
    await s.hover(".og-docoption", { nth: 1, duration: 400, dwell: 240 });
    await s.click(".og-docoption", { nth: 0, duration: 340, dwell: 180, after: 260 });
    await s.click("button:has-text('Enter demo as')", { duration: 420, dwell: 220, after: 1100 });
  },

  /* 3 — choosing the case */
  async pickCase(s) {
    await s.read("h1.og-h1", { ms: 700, duration: 460 });
    await s.click("a.og-listrow:has-text('ODY-001')", { duration: 480, dwell: 280, after: 1100 });
    await s.read(".og-lede", { ms: 950, duration: 420 });
  },

  /* 4 — matching */
  async matching(s) {
    await s.click("button:has-text('Find matches')", { nth: 0, duration: 460, dwell: 240, after: 260 });
    await s.hold(2400);                                        // the four federated query stages
    await s.page.waitForURL("**/matches", { timeout: 20000 });
    await s.sync();
    await s.hold(600);
    await s.read(".og-glass", { nth: 0, ms: 1500, duration: 460 });            // 85 · ODY-742 · strong potential match
    await s.click("a:has-text('Why this match?')", { duration: 440, dwell: 200, after: 1150 });
    await s.read(".og-glass", { nth: 0, ms: 1100, duration: 420 });   // the reasons
    await s.scroll(600, { duration: 600 });
    await s.hold(1100);                                        // the eight evidence groups
  },

  /* 5 — the message to the second clinician */
  async message(s) {
    await s.scroll(280, { duration: 520 });
    await s.click("button:has-text('Request clinical connection')", { duration: 460, dwell: 240, after: 850 });
    await s.type(".og-modal textarea", "Same variant — no second allele here.", { cps: 42 });
    await s.click("button:has-text('Send request')", { duration: 400, dwell: 200, after: 1200 });
  },

  /* 6 — the reply */
  async reply(s) {
    await s.click(".og-whochip", { duration: 460, dwell: 190, after: 620 });
    await s.click(".og-scrim .og-docoption:has-text('Brandt')", { duration: 400, dwell: 220, after: 1250 });
    await s.read("h1.og-h1", { ms: 620, duration: 400 });
    await s.click("a.og-listrow", { nth: 0, duration: 420, dwell: 230, after: 1150 });
    await s.read(".og-glass", { nth: 0, ms: 1150, duration: 400 });  // the incoming request
    await s.click("button:has-text('Accept')", { duration: 380, dwell: 230, after: 1650 });
  },

  /* 7 — the meeting */
  async meeting(s) {
    await s.read("h1.og-h1", { ms: 560, duration: 380 });
    await s.click("button:has-text('Start secure call')", { duration: 440, dwell: 230, after: 880 });
    await s.read(".og-callgrid", { ms: 1800, duration: 420 });  // both clinicians, evidence still beside them
    await s.type("textarea", "Long-read found a deep intronic candidate.", { nth: 0, cps: 46 });
    await s.click("button:has-text('Send')", { nth: 0, duration: 360, dwell: 190, after: 1050 });
    await s.hold(850);
  },

  /* 8 — title */
  async outro(s) {
    await s.goto("/enter", { settle: 900 });
    await s.moveTo(s.width * 0.8, s.height * 0.88, { duration: 700 });
    await s.hold(2400);
  },
};

export const ORDER = ["site", "pickDoctor", "pickCase", "matching", "message", "reply", "meeting", "outro"];
