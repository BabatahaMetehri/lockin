/* Verifies the PWA precaches its app shell so it works offline.
   The service worker's install fetches & stores every shell asset; this
   test confirms the cache ends up containing the key files.
   (We assert cache contents rather than navigator.serviceWorker.controller,
   which Playwright manages out-of-band and reports unreliably in headless.)
   Hard 40s timeout so it can never hang. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = process.cwd();
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  try { const b = await readFile(join(ROOT, p)); res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/index.html`;

const hard = setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 40000);
const browser = await chromium.launch();
const page = await browser.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto(base, { waitUntil: "load" });

// Poll the SW cache until the shell is fully stored.
const cached = await page.waitForFunction(async () => {
  if (!("caches" in window)) return false;
  if (!(await caches.keys()).includes("lockin-v6")) return false;
  const c = await caches.open("lockin-v6");
  const keys = (await c.keys()).map((k) => new URL(k.url).pathname);
  const need = ["/index.html", "/css/styles.css", "/js/app.js", "/js/data.js", "/manifest.webmanifest"];
  return need.every((n) => keys.some((k) => k.endsWith(n))) ? keys.length : false;
}, null, { timeout: 25000, polling: 400 });

void cached; // resolving the waitForFunction above IS the assertion:
// it only returns truthy once index.html + css + app.js + data.js + manifest
// are all present in the SW cache, proving the shell precaches for offline.
console.log("  ok - app shell precached for offline (index + css + app + data + manifest all stored)");

clearTimeout(hard);
await browser.close(); server.close();
if (errs.length) { console.error("pageerrors:\n" + errs.join("\n")); process.exit(1); }
console.log("\nOFFLINE SMOKE PASSED.");
process.exit(0);
