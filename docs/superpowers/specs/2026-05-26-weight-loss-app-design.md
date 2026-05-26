# LOCK IN — Weight Loss Coaching App — Design Spec

**Date:** 2026-05-26
**Owner:** Taha (user)
**Status:** Approved direction, pending spec review

---

## 1. Who this is for (athlete profile)

- **Name/locale:** Taha — Algeria
- **Sex / age:** Male, 26 (DOB 2000-01-18)
- **Height:** 175 cm
- **Start weight:** 112.7 kg (2026-05-26) → BMI ~36.8
- **Goal weight:** 80 kg (lose ~32.7 kg)
- **Experience:** Has done aggressive cuts before; experienced dieter.
- **Psychology (the most important design input):** Has started and quit many times. Wants **zero decisions to make** — meals and workouts must be pre-decided and presented as orders to follow. Distraction and "having to think" are the failure modes. The app must remove all friction and ambiguity, and actively sustain motivation.
- **Work/lifestyle:** Works from home (sedentary base). Currently cannot go to a gym → home training only.
- **Equipment:** No professional gear. Bodyweight + improvised load: a **20 L water bag (~20 kg)**. Sturdy table, chair, doorway, towel available.

### Medical / dietary constraints (hard rules)
- **IBS (irritable bowel syndrome)** + **lactose intolerant.**
- **EXCLUDE entirely:** onion, garlic, beans/lentils/chickpeas (legumes), fried & very fatty food, spicy food (harissa/hot pepper), milk and yogurt (lactose).
- **Allowed dairy:** hard/aged cheese only (low lactose) — OK.
- **No other diagnosed conditions; cleared (by self-report) to train hard and diet aggressively.**

### Supplements on hand
- Omega-3, Vitamin D3 + K2, Creatine monohydrate, Whey ISO protein (isolate, low-lactose → IBS-safe), 1.8 kg.

---

## 2. Coaching plan — Nutrition

### Targets
- **Calories:** 1,800 kcal/day (deficit ~1,100 from ~3,000 TDEE → ~1 kg/week fat loss + larger week-1 water drop).
- **Protein:** 180 g/day (muscle protection + satiety — non-negotiable).
- **Fat:** ~50 g/day. **Carbs:** ~155 g/day. (Fill from the meals below.)
- **Adjustment rule (coach logic):** If weekly weight loss stalls for 2+ weeks at full adherence, drop to 1,600 kcal. If energy/hunger is unmanageable, hold at 1,800 and trust the process.

### Eating pattern — 16:8 intermittent fasting
- **Fasting window:** ~8:00 PM → 12:30 PM next day. Allowed during fast: **water, black coffee, plain/green tea (no milk, no sugar).**
- **Eating window:** **12:30 PM → 8:00 PM.** Three eating events: Meal 1, afternoon shake/snack, Meal 2.

### Daily structure (default day)

| Time | Event | What |
|------|-------|------|
| 12:30 PM | **Meal 1 (lunch)** | Choose 1 lunch option below (~650 kcal, ~64 g P) |
| 4:00 PM | **Snack** | Whey ISO shake (2 scoops in water) + 40 g oats *(oats optional/training days)* (~376 kcal, ~59 g P) |
| 7:30 PM | **Meal 2 (dinner)** | Choose 1 dinner option below (~510 kcal, ~53 g P) |
| — | **Extras to top up** | 30 g hard cheese + 1 small fruit (banana/clementine) (~215 kcal, ~8 g P) |

**Approx daily total: ~1,750–1,800 kcal, ~182 g protein.** All portions are *cooked* weights unless noted.

### Lunch options (interchangeable — pick whichever, no thinking)
**L1 — Chicken & rice:** 180 g chicken breast + 150 g white rice + 200 g IBS-safe veg (zucchini, carrot, green beans) + 10 g olive oil. *(~650 kcal, 64 g P)*
**L2 — Tuna & potato bowl:** 2 cans tuna in water (drained ~200 g) + 250 g boiled potato + 10 g olive oil + lemon/parsley + side salad. *(~620 kcal, 60 g P)*
**L3 — Chicken & couscous:** 180 g chicken + 150 g cooked couscous + 200 g veg + 10 g olive oil. *(~650 kcal, 63 g P)*

### Dinner options (interchangeable)
**D1 — Eggs & cheese plate:** 3 whole eggs + 3 egg whites + 30 g hard cheese + 50 g bread/baguette + salad with 5 g olive oil. *(~520 kcal, 48 g P)*
**D2 — Sardines & potato:** 120 g canned sardines (drained) + 200 g boiled potato + salad + lemon. *(~510 kcal, 44 g P + omega-3)*
**D3 — Chicken & bread:** 150 g chicken breast + 60 g bread + grilled veg + 5 g olive oil. *(~500 kcal, 52 g P)*

### Seasoning (IBS-safe flavor)
Cumin, lemon, salt, black pepper (mild), parsley, coriander, mint, olive oil, paprika (sweet, non-spicy). **No** onion/garlic powder, **no** harissa/hot pepper.

### Grocery list (weekly, brainless shopping)
Chicken breast, eggs, canned tuna (in water), canned sardines, hard cheese, whey ISO (have), rice, potatoes, couscous, oats, bread/baguette, olive oil, zucchini, carrots, green beans, lettuce, cucumber, tomato, lemons, bananas/clementines, cumin/herbs, coffee/tea.

### Hydration & cardio (non-negotiable daily)
- **Water:** ≥ 3 L/day.
- **Steps:** **8,000 steps/day** (walking; counts on rest days too).

---

## 3. Coaching plan — Training

- **Frequency:** 4 days/week, ~30–40 min/session. **Upper/Lower split**, 2 upper + 2 lower.
- **Rest days:** Walk 8,000 steps. Optional light mobility.
- **Equipment:** Bodyweight + 20 L water bag (~20 kg), sturdy table (inverted rows), chair (dips/step-ups), doorway/towel (rows), wall (wall sit).
- **Warm-up (5 min):** arm circles, leg swings, bodyweight squats, cat-cow, marching.
- **Cool-down (5 min):** quad/hamstring/chest/shoulder stretches.

### Progressive overload (how he keeps getting results)
The app stores **last session's reps/load per exercise**. Each session the order is: **beat last time** — add 1–2 reps, then add a set, then slow the tempo (3-second lowering), then add water to the bag. This is automatic prompting in the workout screen.

### Workout A — Lower (squat focus)
1. Goblet squat (hold water bag) — 4 × 12–15
2. Reverse lunge (hold bag) — 3 × 10 per leg
3. Romanian deadlift / hip hinge (bag) — 3 × 12
4. Glute bridge (bag on hips) — 3 × 15
5. Calf raises — 3 × 20
6. Wall sit (finisher) — 3 × max hold
7. Core: lying leg raises 3 × 15 + plank 3 × max

### Workout B — Upper (push focus)
1. Push-ups (incline → standard → decline progression) — 4 × AMRAP
2. Pike push-ups (shoulders) — 3 × 8–12
3. Overhead press (water bag) — 3 × 10–12
4. Chair dips (triceps) — 3 × 12
5. Bag bicep curls — 3 × 12
6. Core: dead bug 3 × 12 + side plank 3 × max/side

### Workout C — Lower (posterior/glute focus)
1. Bag squat (tempo, 3s down) — 4 × 12
2. Bulgarian split squat (rear foot on chair) — 3 × 10 per leg
3. Single-leg glute bridge — 3 × 12 per leg
4. Good morning / hip hinge (bag on shoulders) — 3 × 12
5. Calf raises (single leg) — 3 × 15 per leg
6. Core: bicycle crunches 3 × 20 + hollow hold 3 × max

### Workout D — Upper (pull focus, no bar)
1. Inverted table rows (under sturdy table) — 4 × 8–12
2. Bag bent-over rows — 3 × 12
3. Towel/doorframe rows — 3 × 12
4. Reverse snow angels (prone Y-T-W, rear delts/back) — 3 × 15
5. Bag bicep curls — 3 × 12
6. Core: plank shoulder taps 3 × 20 + leg raises 3 × 15

### Weekly schedule (default; app shows "today")
Mon = A, Tue = B, Wed = walk, Thu = C, Fri = D, Sat = walk, Sun = rest. (Adjustable in app.)

---

## 4. Coaching plan — Supplement schedule (daily checklist)

| Supplement | Dose | When | Why |
|-----------|------|------|-----|
| Creatine monohydrate | 5 g | With Meal 1 (any time, daily — consistency > timing) | Strength/muscle retention in deficit |
| Whey ISO protein | 2 scoops | 4 PM snack (+ post-workout on training days) | Hit 180 g protein, IBS-safe |
| Omega-3 | per label | With Meal 1 (needs dietary fat) | Anti-inflammatory; supports adherence |
| Vitamin D3 + K2 | per label | With Meal 1 (fat-soluble) | Hormonal/bone health while dieting |

---

## 5. The App

### 5.1 Platform & approach
**Offline-first Progressive Web App (PWA).** Static front-end (HTML/CSS/vanilla JS, no backend, no accounts). Installed via **"Add to Home Screen"** on his phone; works offline after first load.

**Rationale:** zero install friction, zero cost, no login to quit over, runs on any phone, and — critically — **all personal data (logs + photos) stays on the device.** Rejected alternatives: native app (install/build friction), cloud app (photos would leave the device — violates privacy requirement).

**Hosting:** static files deployed to a free static host (e.g., GitHub Pages / Netlify) to get an HTTPS URL needed for PWA install + service worker. **Only the app shell is hosted; the user's data and photos never leave the phone.** A local-server option is documented as a fallback.

### 5.2 Security & privacy
- **PIN lock screen** gates the whole app. PIN is hashed (PBKDF2/SHA-256) — never stored in plaintext.
- **Progress photos are encrypted at rest** using the Web Crypto API with an AES-GCM key derived from the PIN (PBKDF2). Photos are stored only in the device's IndexedDB.
- **No network calls with personal data.** Nothing is uploaded.

### 5.3 Data storage
- **localStorage:** settings, daily checklists, weight log, workout logs, journal, streak data (small structured JSON).
- **IndexedDB:** progress photos (encrypted binary blobs).
- **Backup/restore:** **Export** button writes a single JSON backup file (logs + base64 photos) to download; **Import** restores it. Solves the "I lose my progress and quit" failure mode. Prompt to back up weekly.

### 5.4 Data model (sketch)
```
settings   = { pinHash, salt, startDate, startWeightKg, heightCm, goalWeightKg,
               calorieTarget, proteinTarget, stepGoal, waterGoalL, whyText }
weights    = [ { date, kg } ]
dayLogs    = { [date]: { meals:{m1,snack,m2}, supps:{creatine,whey,omega3,d3k2},
               workoutId|null, workoutDone, steps, waterL, mood, ibsFlare, notes } }
workoutLog = [ { date, workoutId, exercises:[ { name, sets:[ {reps, load} ] } ] } ]
photos     = (IndexedDB) [ { id, date, label, encBlob, iv } ]
```
Streak, total lost, weekly rate, and progress % are **derived** from this data.

### 5.5 Screens / features
1. **TODAY (home / anti-thinking screen)** — opens directly here. Shows today's date + streak at top, then a single scrollable checklist of orders:
   - Today's meals (Meal 1 / shake / Meal 2) with portions, tap to check off.
   - Today's workout (name + exercises) or "Walk day," with a "Start workout" button → session mode.
   - Supplement checklist.
   - Water (tap to add glasses) + step goal reminder.
   - "Log today's weight" prompt (if not logged).
   - A motivating line + current streak. **If he just does what's on this screen, he's compliant.**
2. **Weight** — quick log; trend line chart (smoothed); current weight, total lost, weekly rate, BMI, and **progress bar 112.7 → 80 kg** with milestone markers.
3. **Meals** — full plan: daily template, all lunch/dinner options with portions & macros, seasoning rules, and the weekly grocery list.
4. **Workouts** — the 4 workouts (A–D) with full exercise detail and text descriptions; **session mode** to check off sets and log reps/load, with "beat last time" prompts.
5. **Photos** — PIN-locked private gallery; add photo with date/label; **side-by-side compare** (e.g., start vs latest).
6. **Motivation** — streak counter, **milestone badges** (first 5 kg, 10 kg, every −5 kg to 80), his written **"Why I'm doing this"** (shown on the Today screen), and a daily reminder/quote.
7. **Settings** — set/change PIN, edit targets & goal weight, **Export/Import backup**, edit weekly workout schedule.

### 5.6 Look & feel
Mobile-first, dark theme, large tap targets, minimal text, big satisfying check-offs and progress visuals. Motivating and clean — not clinical. (Polish handled with the frontend-design skill during implementation.)

---

## 6. Out of scope (YAGNI)
- No cloud sync / multi-device. - No social/sharing. - No barcode scanner or full food database (meals are fixed). - No wearable/step auto-sync (manual step entry against the 8k goal). - No notifications server (in-app reminders only; optional local notification as a stretch).

## 7. Success criteria
- Opening the app tells Taha exactly what to eat, what workout to do, and what to take **without a single decision.**
- Weight, photos, workouts, and adherence are all logged in one place, privately, behind a PIN.
- Backup/restore prevents data loss.
- Visible streak + progress bar + milestones sustain motivation.
- Works installed on his phone, offline.
