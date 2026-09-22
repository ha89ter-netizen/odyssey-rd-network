/**
 * The demo, scene by scene. Every screen is the running product; the cursor is
 * the only thing drawn on top. Scene order follows the storyboard, with the
 * narrative carried by ODY-001 because that is the case the engine actually
 * scores at 85 against ODY-742.
 */

export const SCENES = {
  /* ---------------- 1. opening ---------------- */
  async opening(s) {
    await s.goto("/enter", { settle: 1600 });
    await s.read("h1.og-h1", { ms: 1500 });
    await s.read(".og-lede", { ms: 1400 });
    await s.hover(".og-docoption", { nth: 1, dwell: 700 });
    await s.hover(".og-docoption", { nth: 0, dwell: 500 });
    await s.click(".og-docoption", { nth: 0, dwell: 320, after: 500 });
    await s.click("button:has-text('Enter demo as')", { after: 2000 });
  },

  /* ---------------- 2. doctor dashboard ---------------- */
  async dashboard(s) {
    await s.read("h1.og-h1", { ms: 1400 });
    for (let i = 0; i < 4; i++) await s.hover(".og-metric", { nth: i, duration: 460, dwell: 560 });
    await s.hold(500);
    await s.read(".og-panel, .og-solid", { ms: 900 }).catch(() => {});
    await s.click("a.og-navlink:has-text('Cases')", { after: 1700 });
  },

  /* ---------------- 3. create a case ---------------- */
  async createCase(s) {
    await s.read("h1.og-h1", { ms: 1100 });
    await s.click("a:has-text('+ New case')", { nth: 0, after: 2000 });
    await s.read("h1.og-h1", { ms: 1200 });
    await s.read(".og-glass", { nth: 0, ms: 1000 });
    await s.hover(".og-input", { nth: 0, dwell: 800 });              // the network-issued reference
    await s.hover(".og-select", { nth: 0, dwell: 520 });             // age group, banded
    await s.hover(".og-select", { nth: 2, dwell: 520 });             // phenotype cluster
    await s.click("button:has-text('Continue')", { after: 1300 });
    await s.type(".og-input", "Progressive infantile encephalopathy of unknown cause", { nth: 0, cps: 30 });
    await s.type("textarea", "Hypotonia from 5 months, plateau at 11 months, regression after a febrile illness.", { cps: 32 });
    await s.click("button:has-text('Continue')", { after: 1200 });
    await s.hold(700);
    await s.click("button:has-text('Continue')", { after: 1200 });
    await s.hold(700);
    await s.click("button:has-text('Create case')", { after: 2400 });
  },

  /* ---------------- 4. medical document ---------------- */
  async upload(s) {
    await s.page.waitForURL("**/verify", { timeout: 20000 });
    await s.sync();
    await s.read("h1.og-h1", { ms: 1400 });
    await s.read(".og-glass", { nth: 0, ms: 1100 });                  // the four-step bar
    await s.hover(".og-docoption", { nth: 1, dwell: 620 });
    await s.click(".og-docoption", { nth: 0, dwell: 460, after: 600 });
    await s.hover(".og-drop", { dwell: 700 });
    await s.click("button:has-text('Upload & extract')", { after: 900 });
    // let the simulated extraction play out on screen
    await s.hold(2600);
  },

  /* ---------------- 5. AI extraction + clinician verification ---------------- */
  async extraction(s) {
    await s.page.waitForSelector("text=Detected clinical signals", { timeout: 20000 });
    await s.sync();
    await s.read(".og-banner", { ms: 1800 });
    await s.hover(".og-term", { nth: 0, dwell: 900 });
    await s.hover(".og-term", { nth: 2, dwell: 900 });
    await s.scroll(420, { duration: 800 });
    await s.hover(".og-term", { nth: 5, dwell: 1100 });      // the low-confidence one
    await s.click("button:has-text('Edit')", { nth: 0, after: 1100 });
    await s.read(".og-modal", { ms: 1200 });
    await s.click("button:has-text('Save & confirm')", { after: 1300 });
    await s.scroll(260, { duration: 600 });
    await s.click("button:has-text('Confirm')", { nth: 0, after: 900 });
    await s.click("button:has-text('Confirm all remaining')", { after: 1400 });
    await s.scroll(320, { duration: 700 });
  },

  /* ---------------- 5b. the case that has been waiting ---------------- */
  async toUnresolved(s) {
    await s.scroll(-1400, { duration: 800 });
    await s.click("a.og-navlink:has-text('Cases')", { after: 2000 });
    await s.read("h1.og-h1", { ms: 1000 });
    await s.hover("a.og-listrow", { nth: 2, dwell: 400 });
    await s.click("a.og-listrow:has-text('ODY-001')", { after: 2200 });
    await s.read("h1.og-h1", { ms: 1300 });
    await s.read(".og-lede", { ms: 1600 });
    await s.hover(".og-glass", { nth: 0, dwell: 1200 });              // completeness
    await s.scroll(360, { duration: 800 });
    await s.hold(900);
    await s.scroll(-360, { duration: 600 });
  },

  /* ---------------- 6. matching ---------------- */
  async matching(s) {
    await s.click("button:has-text('Find matches')", { nth: 0, after: 400 });
    await s.hold(2600);                                        // the four query stages
    await s.page.waitForURL("**/matches", { timeout: 20000 });
    await s.sync();
    await s.hold(1400);
    await s.read("h1.og-h1", { ms: 1100 });
    await s.read(".og-glass", { nth: 0, ms: 2200 });            // 85 · strong potential match
    await s.click("a:has-text('Why this match?')", { after: 2200 });
  },

  /* ---------------- 7. why did it match ---------------- */
  async why(s) {
    await s.read("h1.og-h1", { ms: 1300 });
    await s.read(".og-glass", { nth: 0, ms: 2600 });            // the seven reasons
    await s.scroll(520, { duration: 900 });
    await s.hold(900);
    for (const i of [0, 2, 6]) await s.hover(".og-dimrow", { nth: i + 1, duration: 520, dwell: 900 });
    await s.scroll(560, { duration: 900 });
    await s.hold(1100);
    await s.scroll(520, { duration: 800 });
    await s.hold(1200);
  },

  /* ---------------- 8. case comparison ---------------- */
  async compare(s) {
    await s.scroll(-1400, { duration: 900 });
    await s.click("a:has-text('Compare cases first')", { after: 2200 });
    await s.read("h1.og-h1", { ms: 1200 });
    for (let i = 0; i < 4; i++) await s.hover(".og-metric", { nth: i, duration: 420, dwell: 520 });
    await s.scroll(700, { duration: 900 });
    await s.hold(1100);
    await s.scroll(700, { duration: 900 });
    await s.hold(1400);
  },

  /* ---------------- 9. request connection ---------------- */
  async request(s) {
    await s.scroll(-2600, { duration: 900 });
    await s.click("a:has-text('Back to match')", { after: 2000 });
    await s.scroll(700, { duration: 800 });
    await s.click("button:has-text('Request clinical connection')", { after: 1400 });
    await s.read(".og-modal", { ms: 1400 });
    await s.type(".og-modal textarea", "Same coding variant here, but we never found a second allele.", { cps: 26 });
    await s.click("button:has-text('Send request')", { after: 2000 });
    await s.scroll(-900, { duration: 700 });
    await s.hold(1400);
  },

  /* ---------------- 10. the second clinician ---------------- */
  async secondDoctor(s) {
    await s.click(".og-whochip", { after: 1200 });
    await s.read(".og-modal", { ms: 900 });
    await s.click(".og-scrim .og-docoption:has-text('Brandt')", { after: 2400 });
    await s.read("h1.og-h1", { ms: 1400 });
    await s.hover(".og-metric", { nth: 2, dwell: 800 });
    await s.click("a.og-listrow", { nth: 0, after: 2400 });      // the pending request
    await s.read(".og-glass", { nth: 0, ms: 1800 });
    await s.click("button:has-text('Accept')", { after: 2600 });
  },

  /* ---------------- 11. collaboration room ---------------- */
  async room(s) {
    await s.read("h1.og-h1", { ms: 1300 });
    await s.read(".og-glass", { nth: 0, ms: 1400 });              // stage bar
    await s.hover("button.og-tab", { nth: 1, dwell: 400 });
    await s.click("button.og-tab", { nth: 1, after: 1500 });      // phenotype comparison
    await s.hold(1200);
    await s.click("button.og-tab", { nth: 2, after: 1500 });      // timeline comparison
    await s.hold(1400);
    await s.click("button.og-tab", { nth: 0, after: 1200 });
    await s.type("textarea", "Long-read sequencing here found a deep intronic candidate in the same gene.", { cps: 28 });
    await s.click("button:has-text('Send')", { after: 1600 });
  },

  /* ---------------- 12. dual verification ---------------- */
  async verify(s) {
    await s.scroll(520, { duration: 800 });
    await s.read(".og-glass", { nth: 1, ms: 1600 });
    await s.click("button:has-text('Verify clinical relevance')", { after: 1400 });
    await s.read(".og-modal", { ms: 1500 });
    await s.type(".og-modal textarea", "Shared variant and identical imaging pattern justify joint re-analysis.", { cps: 30 });
    await s.click("button:has-text('Confirm clinical relevance')", { after: 2200 });
    await s.hold(900);

    // back to the first clinician for the second verification
    await s.scroll(-900, { duration: 700 });
    await s.click(".og-whochip", { after: 1100 });
    await s.click(".og-scrim .og-docoption:has-text('Seitkali')", { after: 2200 });
    await s.click("a.og-navlink:has-text('Collaboration')", { after: 1800 });
    await s.click("a.og-listrow", { nth: 0, after: 2200 });
    await s.scroll(520, { duration: 800 });
    await s.click("button:has-text('Verify clinical relevance')", { after: 1400 });
    await s.type(".og-modal textarea", "Agreed. Targeted re-analysis of our genome data is warranted.", { cps: 30 });
    await s.click("button:has-text('Confirm clinical relevance')", { after: 2600 });
    await s.scroll(-900, { duration: 800 });
    await s.hold(2000);                                           // clinically corroborated
  },

  /* ---------------- 13. knowledge contribution ---------------- */
  async knowledge(s) {
    await s.click("a.og-navlink:has-text('Knowledge')", { after: 2200 });
    await s.read("h1.og-h1", { ms: 1300 });
    for (let i = 0; i < 4; i++) await s.hover(".og-metric", { nth: i, duration: 420, dwell: 480 });
    await s.scroll(520, { duration: 900 });
    await s.hold(2400);                                           // case A + case B → network knowledge
    await s.scroll(560, { duration: 900 });
    await s.hold(1800);
  },

  /* ---------------- 14. the network ---------------- */
  async network(s) {
    await s.scroll(-1200, { duration: 800 });
    await s.click("a.og-navlink:has-text('Network')", { after: 2400 });
    await s.read("h1.og-h1", { ms: 1200 });
    for (let i = 0; i < 4; i++) await s.hover(".og-metric", { nth: i, duration: 420, dwell: 460 });
    await s.scroll(420, { duration: 1000 });
    await s.hold(3200);                                           // the map, connections drawing
    await s.scroll(300, { duration: 900 });
    await s.hold(2200);
  },

  /* ---------------- final card ---------------- */
  async closing(s) {
    await s.goto("/enter", { settle: 2200 });
    await s.moveTo(s.width * 0.78, s.height * 0.86, { duration: 900 });
    await s.hold(3600);                                           // "The answer may already exist."
  },
};

export const ORDER = [
  "opening", "dashboard", "createCase", "upload", "extraction", "toUnresolved",
  "matching", "why", "compare", "request", "secondDoctor", "room", "verify",
  "knowledge", "network", "closing",
];
