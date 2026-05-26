# LOCK IN App — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Build in order; commit after each task.

**Goal:** Build "LOCK IN", an offline-first, PIN-locked, private PWA (phone + PC) that tells Taha exactly what to eat, train, and take each day, and tracks weight, workouts, media, streaks, and progress — all stored locally.

**Architecture:** Static front-end, no backend, no build step. Vanilla JS ES modules. Data in localStorage (structured) + IndexedDB (encrypted media). Service worker for offline + installability. A single content module holds all coaching data (meals, recipes, grocery, workouts, supplements) from the spec. Pure-logic modules (calculations, crypto, store) are unit-tested with Node; UI is verified by running the app.

**Tech Stack:** HTML, CSS (custom, dark, responsive), vanilla JS (ES modules), Web Crypto API (AES-GCM + PBKDF2), IndexedDB, localStorage, hand-rolled SVG line chart (no external libs → fully offline). Hosting: any static host (GitHub Pages / Netlify drop) or local `npx serve` for testing.

---

## File Structure

```
weight loss/
├─ index.html                 # app shell, screen containers, PIN gate
├─ manifest.webmanifest       # PWA metadata (name, icons, display, theme)
├─ sw.js                      # service worker: cache app shell for offline
├─ css/
│  └─ styles.css              # dark, mobile-first, responsive (desktop multi-column)
├─ js/
│  ├─ app.js                  # bootstrap: PIN gate, router, render Today on load
│  ├─ router.js               # hash-based screen switching + bottom nav
│  ├─ store.js                # localStorage read/write, schema, defaults
│  ├─ calc.js                 # PURE: BMI, TDEE est, total lost, weekly rate, streak, progress%
│  ├─ crypto.js               # PURE-ish: PBKDF2 key from PIN, AES-GCM encrypt/decrypt blobs
│  ├─ db.js                   # IndexedDB wrapper for encrypted media
│  ├─ pin.js                  # PIN set / verify (hash + salt), lock screen logic
│  ├─ backup.js               # export/import JSON (+ base64 media) backup file
│  ├─ chart.js               # PURE: build SVG path from weight points
│  ├─ data.js                 # ALL coaching content (targets, meals, recipes, grocery, workouts, supps, milestones)
│  └─ screens/
│     ├─ today.js             # anti-thinking daily checklist
│     ├─ weight.js            # log + chart + progress bar + stats
│     ├─ meals.js             # plan, recipes, grocery list
│     ├─ workouts.js          # 4 workouts + session mode (log reps, beat-last-time)
│     ├─ media.js             # encrypted photo/video gallery + compare
│     ├─ motivation.js        # streak, milestones, "why", daily line
│     └─ settings.js          # PIN change, targets, schedule, backup
├─ icons/                     # PWA icons (generated)
├─ test/
│  ├─ calc.test.mjs           # Node tests for calc.js
│  ├─ chart.test.mjs          # Node tests for chart.js
│  └─ crypto.test.mjs         # Node tests for crypto round-trip (webcrypto)
└─ README.md                  # how to run locally + install on phone/PC + deploy
```

---

## Task 1: Project skeleton + PWA shell (offline + installable)

**Files:** Create `index.html`, `css/styles.css`, `manifest.webmanifest`, `sw.js`, `icons/`, `README.md`.

- [ ] Create `index.html` with: meta viewport, theme-color, manifest link, a `#lock-screen` (PIN entry) hidden container, a `#app` container with a `<main id="screen">` and a bottom `<nav>` (Today/Weight/Meals/Workouts/Media/More). Register service worker. Load `js/app.js` as module.
- [ ] Create `css/styles.css`: dark theme, CSS variables, mobile-first; bottom nav fixed; `@media (min-width:800px)` → sidebar nav + centered max-width content (desktop layout). Large tap targets, big checkboxes, progress bar styles.
- [ ] Create `manifest.webmanifest`: name "LOCK IN", short_name, standalone display, theme/background colors, icon entries (192/512).
- [ ] Generate simple icons into `icons/` (solid color + "LI" mark, 192 & 512 PNG).
- [ ] Create `sw.js`: cache-first for app shell files; bump cache version constant.
- [ ] Create `README.md`: run via `npx serve` (or `python -m http.server`), open on phone via same Wi-Fi / deploy to Netlify drop or GitHub Pages, then Add to Home Screen / Install.
- [ ] Verify: `npx serve` the folder, load in browser, confirm app shell renders, no console errors, SW registers (Application tab).
- [ ] Commit.

## Task 2: Data layer — content + store + calculations (with Node tests)

**Files:** Create `js/data.js`, `js/store.js`, `js/calc.js`, `js/chart.js`, `test/calc.test.mjs`, `test/chart.test.mjs`.

- [ ] Create `js/data.js`: export all coaching content from the spec — `TARGETS` (1800 kcal, 180 P, fat 50, carbs 155, water 3L, steps 8000), `EATING_WINDOW`, `LUNCHES`/`DINNERS`/`SNACK` (with portions, macros, step-by-step recipes), `RECIPE_BASICS`, `GROCERY` (item+qty table), `WORKOUTS` A–D (exercises with sets/reps/progression notes + fallback options), `WEEK_SCHEDULE`, `SUPPLEMENTS`, `MILESTONES` (every −5 kg 112.7→80), `SEASONING_RULES`, `EXCLUDED_FOODS`.
- [ ] Create `js/store.js`: `getState()/setState()`, namespaced localStorage key, default state (settings with startWeight 112.7, startDate, height 175, goalWeight 80, targets from data.js), helpers: `logWeight`, `getDayLog(date)`, `setDayLog`, `logWorkout`, `getLastWorkout(id)`.
- [ ] Create `js/calc.js` (pure functions): `bmi(kg,cm)`, `totalLost(start,current)`, `progressPct(start,current,goal)`, `weeklyRate(weights)`, `currentStreak(dayLogs)`, `estTDEE(...)`.
- [ ] Create `js/chart.js` (pure): `weightPath(points,width,height)` → returns SVG path string + axis bounds.
- [ ] Write `test/calc.test.mjs` and `test/chart.test.mjs` (Node's built-in `assert`, run with `node`). Cover: BMI value, progress 112.7→80 at various weights, streak with gaps, chart path for known points.
- [ ] Run `node test/calc.test.mjs && node test/chart.test.mjs`. Expected: all pass.
- [ ] Commit.

## Task 3: Security — crypto + PIN gate + IndexedDB media store (with Node test)

**Files:** Create `js/crypto.js`, `js/pin.js`, `js/db.js`, `test/crypto.test.mjs`. Modify `js/app.js`.

- [ ] Create `js/crypto.js`: `deriveKey(pin, salt)` via PBKDF2→AES-GCM; `encryptBlob(key, blob)`→{iv,cipher}; `decryptBlob(key, iv, cipher)`→blob.
- [ ] Write `test/crypto.test.mjs` using Node `webcrypto`: derive key, encrypt then decrypt sample bytes, assert round-trip equality; assert wrong PIN fails. Run with `node`. Expected: pass.
- [ ] Create `js/pin.js`: `setPin(pin)` (store PBKDF2 hash + salt in settings), `verifyPin(pin)`, holds derived media key in memory after unlock.
- [ ] Create `js/db.js`: IndexedDB open + `putMedia(record)`, `getAllMedia()`, `getMedia(id)`, `deleteMedia(id)` (stores encrypted blobs).
- [ ] Modify `js/app.js`: on load, if no PIN set → first-run "create PIN" flow; else show lock screen; on correct PIN derive key, hide lock, render app. Wrong PIN → shake/error.
- [ ] Verify in browser: first run sets PIN; reload requires PIN; wrong PIN rejected; correct PIN unlocks.
- [ ] Commit.

## Task 4: Router + Today screen (the anti-thinking core)

**Files:** Create `js/router.js`, `js/screens/today.js`. Modify `js/app.js`, `index.html`.

- [ ] Create `js/router.js`: hash-based; maps routes to screen render functions; highlights active nav item.
- [ ] Create `js/screens/today.js`: render for today's date — header (date + streak from calc), then checklist sections: today's workout (from WEEK_SCHEDULE → WORKOUTS, or "Walk 8,000 steps" on rest days) with "Start workout" button; meals (Meal 1 options, shake, Meal 2 options) as check items; supplements checklist; water tap-counter (→3L); steps reminder; "Log weight" button if not logged today; the user's "why" line. Check-offs persist to dayLog via store.
- [ ] Wire default route → Today; render on unlock.
- [ ] Verify: Today shows correct workout for the weekday, check-offs persist across reload, streak increments when a day is completed.
- [ ] Commit.

## Task 5: Weight screen (log + chart + progress)

**Files:** Create `js/screens/weight.js`.

- [ ] Render: number input + "Save today's weight"; current weight, total lost, weekly rate, BMI (calc.js); progress bar 112.7→80 with % and milestone ticks; SVG trend chart from chart.js over logged weights; list of recent entries (editable/deletable).
- [ ] Verify: logging several weights updates chart, stats, and progress bar correctly.
- [ ] Commit.

## Task 6: Meals screen (plan + recipes + grocery)

**Files:** Create `js/screens/meals.js`.

- [ ] Render from data.js: daily structure/timing, targets, all lunch/dinner/snack options with portions + macros + collapsible step-by-step recipes + RECIPE_BASICS, seasoning rules, excluded foods, and the weekly grocery list as a checkable shopping list.
- [ ] Verify: all spec content present and readable on mobile + desktop.
- [ ] Commit.

## Task 7: Workouts screen + session mode (progressive overload)

**Files:** Create `js/screens/workouts.js`.

- [ ] Render list of Workouts A–D with full exercise detail + fallback options (from data.js). Each has "Start session".
- [ ] Session mode: for each exercise show target sets/reps, last session's reps/load (store.getLastWorkout) with "beat last time" prompt, inputs to log reps/load per set, mark sets done; on finish save workoutLog + mark today's workout done.
- [ ] Verify: complete a session, reload, start same workout → previous numbers shown as targets to beat.
- [ ] Commit.

## Task 8: Media gallery (encrypted photos + videos, compare)

**Files:** Create `js/screens/media.js`.

- [ ] Add capture/upload (`<input type=file accept=image/*,video/*>` with capture); category (body/face) + date + label; encrypt via crypto.js, store via db.js.
- [ ] Gallery grid (decrypt to object URLs on view), filter by category, delete; **compare mode**: pick two photos side-by-side (e.g., start vs latest).
- [ ] Verify: add a photo and a short video, reload + re-unlock, confirm they decrypt and display; compare two photos.
- [ ] Commit.

## Task 9: Motivation + Settings + Backup

**Files:** Create `js/screens/motivation.js`, `js/screens/settings.js`, `js/backup.js`.

- [ ] `motivation.js`: big streak counter, milestone badges (locked/unlocked from MILESTONES vs total lost), editable "Why I'm doing this" (also shown on Today), a daily rotating reminder line.
- [ ] `backup.js`: `exportAll()` → downloads JSON (settings + logs + base64 of decrypted media) ; `importAll(file)` → restores state + media. Include a clear warning that backup is plaintext (keep the file safe).
- [ ] `settings.js`: change PIN (re-encrypt media key flow or re-derive), edit goal weight + targets + step/water goals, edit weekly workout schedule, Export/Import buttons, "back up weekly" reminder.
- [ ] Verify: export produces a file; import on a fresh load restores weights, logs, and media; changing goal updates the progress bar.
- [ ] Commit.

## Task 10: Final polish + offline verification + cache list

**Files:** Modify `sw.js`, `css/styles.css`, `README.md`.

- [ ] Add all real asset paths to `sw.js` cache list; bump version.
- [ ] Polish pass with frontend-design principles: spacing, motivating progress visuals, satisfying check animations, desktop multi-column on Today/Weight.
- [ ] Verify offline: load app, go offline (DevTools), reload → app still works; install to home screen (phone) / install (desktop).
- [ ] Update README with final run/install/deploy steps.
- [ ] Commit.

---

## Self-Review

- **Spec coverage:** profile/targets → data.js+store (T2); 16:8 meals+recipes+grocery → T6/data.js; no-equipment training+overload → T7/data.js; supplements → Today (T4); PWA phone+PC → T1/T10; PIN + encrypted media → T3/T8; localStorage+IndexedDB → T2/T3; backup → T9; Today/Weight/Meals/Workouts/Media/Motivation/Settings → T4–T9; look&feel responsive → T1/T10; photos **and videos**, body/face → T8. All covered.
- **Placeholders:** none — each task states concrete files, content source (data.js / spec), and a verification.
- **Type consistency:** store helpers (`getDayLog/setDayLog/logWorkout/getLastWorkout`), media record shape `{id,date,type,category,label,encBlob,iv}`, and crypto signatures are referenced consistently across T2/T3/T7/T8/T9.
