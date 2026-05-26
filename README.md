# LOCK IN — your private weight-loss coach

A no-excuses, offline, **100% private** weight-loss app. Everything (logs, photos, videos) stays **only on your device**, locked behind a PIN. Open it and just do what's on the **TODAY** screen.

## Run it on your PC (to test)

You need a tiny local web server (the app uses service workers + modules, which don't work from `file://`).

**Option A — Node (recommended):**
```
npx serve .
```
Then open the printed `http://localhost:3000` (or similar) in Chrome/Edge.

**Option B — Python:**
```
python -m http.server 8080
```
Then open `http://localhost:8080`.

To **install** on PC: in Chrome/Edge, click the install icon in the address bar ("Install LOCK IN").

## Run it on your phone

Two ways:

1. **Same Wi-Fi (quick test):** run a server on your PC (above), find your PC's local IP (e.g. `192.168.1.20`), then on your phone open `http://192.168.1.20:3000`.
2. **Deploy once, use forever (best):** drag this whole folder onto **[netlify.com/drop](https://app.netlify.com/drop)** (free, no account needed for a quick deploy) or push to **GitHub Pages**. You get an `https://…` link. Open it on your phone → browser menu → **Add to Home Screen**. It now works like an app, fully offline.

> Your data never leaves your phone — deploying only hosts the (empty) app, not your information.

## First run
1. Create a 4-digit PIN (this also encrypts your photos/videos — don't forget it).
2. The app is pre-loaded with your full plan. Start with the **TODAY** screen.
3. **Back up weekly:** Settings → Export. Save the file somewhere safe. If you ever switch phones or clear your browser, Settings → Import restores everything.

## Tech (for the curious)
Static PWA: HTML + CSS + vanilla JS (ES modules). Data in `localStorage`; photos/videos encrypted (AES-GCM, key from your PIN) in IndexedDB. No backend, no accounts, no tracking.

## Tests
Pure-logic unit tests run with Node:
```
node test/calc.test.mjs
node test/chart.test.mjs
node test/crypto.test.mjs
```
