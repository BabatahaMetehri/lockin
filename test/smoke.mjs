/* Headless smoke test: loads the app, sets PIN, clicks through every screen,
   logs a weight, and fails if any console error / page error occurs. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = process.cwd();
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml" };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const file = join(ROOT, p);
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://localhost:${port}/index.html`;

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.addInitScript(() => {
  if (!localStorage.getItem("lockin.state.v1")) {
    localStorage.setItem("lockin.state.v1", JSON.stringify({ settings: { onboarded: true } }));
  }
});
await page.goto(base, { waitUntil: "networkidle" });

// --- create PIN 1234 twice ---
async function typePin(pin) {
  for (const d of pin) await page.click(`.key:has-text("${d}")`);
}
await page.waitForSelector("#lock-screen:not([hidden])");
await typePin("1234");           // create
await page.waitForTimeout(250);
await typePin("1234");           // confirm
await page.waitForSelector("#app:not([hidden])", { timeout: 5000 });
console.log("  ok - PIN create + enter app");

// --- Rail home renders (right-now action + topbar) ---
await page.waitForSelector(".rail-now .rail-action");
await page.waitForSelector(".topbar .tb-streak");
console.log("  ok - rail home renders (right-now + topbar)");

// --- open full-day checklist + toggle a supplement check ---
await page.click('.collapse-h:has-text("Full day")');
await page.waitForTimeout(150);
await page.click('.check:has-text("Omega-3")');
console.log("  ok - full-day check toggled");

// --- visit each screen via hash ---
for (const route of ["weight", "meals", "workouts", "media", "motivation", "calendar", "settings", "today"]) {
  await page.evaluate((r) => { location.hash = r; }, route);
  await page.waitForTimeout(200);
  await page.waitForSelector("#screen .page-head, #screen .card", { timeout: 4000 });
  console.log("  ok - screen:", route);
}

// --- log a weight on the weight screen ---
await page.evaluate(() => { location.hash = "weight"; });
await page.waitForTimeout(250);
await page.fill('#screen input[type="number"]', "111.5");
await page.click('#screen .btn:has-text("Save")');
await page.waitForTimeout(200);
const hasStat = await page.locator('#screen .stat .v').first().textContent();
console.log("  ok - logged weight, current stat:", hasStat);

// --- reload requires PIN again ---
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#lock-screen:not([hidden])");
await typePin("1234");
await page.waitForSelector("#app:not([hidden])", { timeout: 5000 });
console.log("  ok - reload re-locks then unlocks; data persists");
const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem("lockin.state.v1")).weights.length);
if (persisted < 1) throw new Error("weight did not persist");
console.log("  ok - weight persisted:", persisted, "entry");

await browser.close();
server.close();

if (errors.length) {
  console.error("\nERRORS:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("\nSMOKE TEST PASSED — no console/page errors.");
