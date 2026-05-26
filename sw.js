/* LOCK IN service worker — cache app shell for offline use.
   Bump CACHE version whenever app files change. */
const CACHE = "lockin-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-maskable.svg",
  "./js/app.js",
  "./js/router.js",
  "./js/store.js",
  "./js/calc.js",
  "./js/crypto.js",
  "./js/db.js",
  "./js/pin.js",
  "./js/backup.js",
  "./js/chart.js",
  "./js/data.js",
  "./js/ui.js",
  "./js/backup.js",
  "./js/screens/today.js",
  "./js/screens/weight.js",
  "./js/screens/meals.js",
  "./js/screens/workouts.js",
  "./js/screens/media.js",
  "./js/screens/motivation.js",
  "./js/screens/settings.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Network-first for Google Fonts (then cache); cache-first for everything local.
  if (url.origin.includes("fonts.googleapis.com") || url.origin.includes("fonts.gstatic.com")) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const cached = await c.match(e.request);
        const fetched = fetch(e.request).then((res) => { c.put(e.request, res.clone()); return res; }).catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      // runtime-cache same-origin GETs
      if (e.request.method === "GET" && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
