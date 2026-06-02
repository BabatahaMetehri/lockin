/* Verifies the encrypted media pipeline in a real browser:
   upload an image -> AES-GCM encrypt -> IndexedDB -> decrypt -> rendered. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = process.cwd();
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  try { let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
    const file = join(ROOT, p); const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }); res.end(body);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/index.html`;

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.message));

await page.addInitScript(() => {
  if (!localStorage.getItem("lockin.state.v1")) {
    localStorage.setItem("lockin.state.v1", JSON.stringify({ settings: { onboarded: true } }));
  }
});
await page.goto(base, { waitUntil: "networkidle" });
const typePin = async (pin) => { for (const d of pin) await page.click(`.key:has-text("${d}")`); };
await typePin("1234"); await page.waitForTimeout(250); await typePin("1234");
await page.waitForSelector("#app:not([hidden])");

await page.evaluate(() => { location.hash = "media"; });
await page.waitForSelector('#screen input[type="file"]', { state: "attached" });

// a 1x1 red PNG
const pngB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buf = Buffer.from(pngB64, "base64");
await page.setInputFiles('#screen input[type="file"]', { name: "test.png", mimeType: "image/png", buffer: buf });

// wait for it to be encrypted + stored + rendered as a blob <img>
await page.waitForSelector(".media-cell img", { timeout: 6000 });
const src = await page.getAttribute(".media-cell img", "src");
if (!src || !src.startsWith("blob:")) throw new Error("media not rendered from decrypted blob: " + src);
console.log("  ok - image encrypted, stored, decrypted & rendered");

// confirm what's stored in IndexedDB is ciphertext (not the raw png)
const stored = await page.evaluate(() => new Promise((resolve, reject) => {
  const r = indexedDB.open("lockin-media", 1);
  r.onsuccess = () => { const tx = r.result.transaction("media", "readonly").objectStore("media").getAll();
    tx.onsuccess = () => resolve(tx.result); tx.onerror = () => reject(tx.error); };
  r.onerror = () => reject(r.error);
}));
if (!stored.length || !stored[0].cipher || !stored[0].iv) throw new Error("no encrypted record stored");
const decoded = Buffer.from(stored[0].cipher, "base64").toString("latin1");
if (decoded.includes("PNG")) throw new Error("stored bytes are NOT encrypted (found PNG header)");
console.log("  ok - stored record is ciphertext (no PNG header), has iv");

await browser.close(); server.close();
if (errors.length) { console.error("\nERRORS:\n" + errors.join("\n")); process.exit(1); }
console.log("\nMEDIA SMOKE PASSED.");
