/* ============================================================
   data.js — ALL coaching content for Taha (from the design spec).
   Pure data, no logic. Edit numbers here to retune the program.
   ============================================================ */

export const PROFILE = {
  name: "Taha",
  dob: "2000-01-18",
  heightCm: 174,
  startWeightKg: 112.7,
  startDate: "2026-05-26",
  goalWeightKg: 80,
};

/* Calorie engine. Target auto-recalculates every 15 kg lost (see calc.js).
   Base 1650 at start (~2,950 TDEE − 1,300 deficit); −100 per 15 kg lost. */
export const CALORIE = {
  baseTarget: 1650,
  stepPerTier: 100,     // drop target 100 kcal each 15 kg lost
  tierKg: 15,           // recompute every 15 kg
  floor: 1400,          // never prescribe below this
  activityFactor: 1.4,  // sedentary + 10k steps
  deficit: 1300,
};

export const TARGETS = {
  kcal: 1650,
  proteinG: 130,        // from the two fixed meals (132 g)
  fatG: 31,
  carbsG: 148,
  waterL: 3,
  steps: 10000,
};

/* 18:6 intermittent fast. */
export const EATING_WINDOW = {
  fastUntil: "14:00",
  stopEating: "20:00",
  note: "18:6 fast. Window 14:00–20:00. Outside it: water, black coffee, plain/green tea only — no milk, no sugar, no calories.",
};

/* Steps are the primary fat-loss engine and knee-safe. Split into two walks. */
export const STEPS_PLAN = {
  total: 10000,
  morning: 5000,   // fasted, ~08:30
  evening: 5000,   // ~18:00
  note: "10,000 steps/day, split 5,000 fasted morning + 5,000 evening. This is the engine — non-negotiable.",
};

/* Low-FODMAP / IBS hard rules. */
export const EXCLUDED_FOODS = [
  "Onion & garlic (incl. any powder containing them)",
  "Beans, lentils, chickpeas (legumes)",
  "Fried & very fatty food",
  "Spicy food (harissa, hot pepper)",
  "Milk & yogurt (lactose)",
  "Oats above 60 g/day (fructan load)",
];

export const SEASONING_RULES =
  "Allowed spices ONLY: cumin, paprika, salt, black pepper. " +
  "NEVER: onion, garlic, or any powder containing them; no harissa/hot pepper. " +
  "Tuna in water only. Introduce fiber gradually — do not push above ~20 g/day. Hard/aged cheese is fine.";

export const RECIPE_BASICS = [
  { name: "Boiled rice", steps: "Rinse 50g dry white rice. Add to pot with 120ml water + pinch salt. Boil, cover, simmer ~12 min until water absorbed. Rest 5 min." },
  { name: "Boiled potato", steps: "Peel & cube 250–300g potato. Boil in salted water 15–20 min until fork-tender. Drain." },
  { name: "Pan chicken", steps: "Cut chicken into strips, season (salt, cumin, pepper, lemon). Cook in half the olive oil over medium heat 4–5 min per side until no pink inside." },
  { name: "Sautéed/steamed veg", steps: "Chop veg, sauté in remaining oil 6–8 min (or steam 8 min). Salt + parsley." },
];

/* ONE BIG MEAL A DAY (~1200 kcal, ~75g P) + 3 whey scoops across the day
   + an optional small bite if hungry before the fast. Air-fryer first.
   No pasta. Same simple ingredients on repeat. */
export const LUNCHES = [
  { id: "M1", name: "Air-fryer chicken & rice", macros: "≈1150 kcal · 80g P", budget: "€€", time: "20 min",
    ingredients: ["250g raw chicken breast", "120g dry rice", "200g potato (cubed)", "10g olive oil", "cumin, salt, lemon"],
    steps: [
      "Start the rice (rinse, simmer, rest — see basics).",
      "Season chicken (salt, cumin, pepper, drizzle of oil). Air-fryer 180°C / 18–20 min, flip halfway.",
      "Cube potato, toss with a little oil + salt + cumin. Air-fryer 200°C / 15 min, shake basket once.",
      "Plate everything, squeeze lemon. Done.",
    ] },
  { id: "M2", name: "Tuna rice bowl (no cook)", macros: "≈1050 kcal · 65g P", budget: "€", time: "12 min",
    ingredients: ["120g dry rice", "2 cans tuna in water (drained ~200g)", "10g olive oil", "lemon, cumin, salt"],
    steps: [
      "Cook the rice.",
      "Drain the tuna well.",
      "Pile tuna on rice, drizzle olive oil + lemon + cumin. That's it.",
    ] },
  { id: "M3", name: "Sardines & air-fryer potato", macros: "≈1050 kcal · 55g P · omega-3", budget: "€", time: "20 min",
    ingredients: ["300g potato (wedges)", "1–2 cans sardines (drained)", "10g olive oil", "lemon, cumin, parsley"],
    steps: [
      "Cube potato into wedges. Toss with oil + salt + cumin.",
      "Air-fryer 200°C / 15–18 min, shake once.",
      "Drain sardines, lay over the hot wedges. Squeeze lemon. Done.",
    ] },
  { id: "M4", name: "Air-fryer chicken & potato", macros: "≈1150 kcal · 78g P", budget: "€€", time: "22 min",
    ingredients: ["250g raw chicken breast", "300g potato (wedges)", "10g olive oil", "cumin, salt, lemon"],
    steps: [
      "Season chicken. Air-fryer 180°C / 18–20 min.",
      "While chicken is going, cube the potato + season.",
      "After chicken is done, air-fryer the potato at 200°C / 15 min.",
      "Plate, squeeze lemon. Done.",
    ] },
];

/* Optional small bite if hungry before 8pm. Skip if you're not hungry. */
export const DINNERS = [
  { id: "OPT1", name: "2 boiled eggs + 30g cheese + 1 banana", macros: "≈360 kcal · 20g P", budget: "€", time: "10 min",
    ingredients: ["2 eggs", "30g hard cheese", "1 banana"],
    steps: ["Boil the eggs 9 min.", "Slice cheese.", "Eat together with the banana."] },
  { id: "OPT2", name: "Skip — drink water, fast starts", macros: "0 kcal", budget: "€", time: "0 min",
    ingredients: ["water", "(maybe a black coffee)"],
    steps: ["You're not hungry. Don't eat. Hydrate. The fast does the work."] },
];

export const SNACK = {
  id: "S", name: "Whey shake — 3 scoops across the day", macros: "≈340 kcal · 81g P",
  ingredients: ["3 scoops whey ISO total", "water"],
  steps: ["Split as you like — e.g. 1 scoop morning (in coffee), 1 mid-afternoon, 1 evening.", "The shake is the protein backbone — never skip it."] };

export const DAILY_EXTRAS = "Optional: handful of oats with one of the shakes on workout days.";

/* ============================================================
   FIXED PLAN (the spec's two meals — no swaps). 18:6 window.
   Each meal has an ingredient table; totals are precomputed.
   ============================================================ */
export const FIXED_MEALS = [
  {
    id: "meal1", time: "14:00", name: "The Big Plate",
    note: "Window opens. This is the Vitamin D3 fat-pairing meal. Take Omega-3 + D3/K2 + 5 g creatine with it.",
    ingredients: [
      { item: "Chicken breast", raw: "200 g", prep: "Air fryer", kcal: 220, p: 46, c: 0, f: 4 },
      { item: "White rice (dry)", raw: "70 g", prep: "Stove", kcal: 250, p: 5, c: 55, f: 1 },
      { item: "White potato", raw: "200 g", prep: "Air fryer", kcal: 154, p: 4, c: 35, f: 0 },
      { item: "Cucumber", raw: "150 g", prep: "Raw", kcal: 16, p: 1, c: 3, f: 0 },
      { item: "Carrot", raw: "80 g", prep: "Raw / air fryer", kcal: 33, p: 1, c: 8, f: 0 },
      { item: "Olive oil", raw: "8 g", prep: "Drizzle", kcal: 70, p: 0, c: 0, f: 8 },
    ],
    total: { kcal: 743, p: 57, c: 101, f: 13, fiber: 8 },
  },
  {
    id: "meal2", time: "19:30", name: "The Protein Close",
    note: "Last food before the window closes at 20:00. Take 1 scoop ISO protein with it.",
    ingredients: [
      { item: "Canned tuna (in water, drained)", raw: "1 can ~120 g", prep: "—", kcal: 130, p: 28, c: 0, f: 2 },
      { item: "Oats (dry)", raw: "60 g", prep: "Stove, water", kcal: 228, p: 8, c: 40, f: 4 },
      { item: "Egg", raw: "2 large", prep: "Air fryer / stove", kcal: 156, p: 13, c: 1, f: 11 },
      { item: "Cucumber / carrot", raw: "120 g", prep: "Raw", kcal: 20, p: 1, c: 4, f: 0 },
      { item: "ISO protein (lactose-free)", raw: "1 scoop ~30 g", prep: "Water", kcal: 115, p: 25, c: 2, f: 1 },
    ],
    total: { kcal: 649, p: 75, c: 47, f: 18, fiber: 8 },
  },
];

export const MEALS_DAILY_TOTAL = { kcal: 1392, p: 132, c: 148, f: 31, fiber: 16 };

/* Zero-calorie munching strategy — converts the desk-chewing habit. */
export const SNACK_HACKS = [
  { id: "cuke-spears", name: "Ice-Brined Cucumber Spears", tag: "desk default", kcal: "~15 kcal / bowl",
    how: "Cucumber spears in a jar of ice water + pinch of salt + splash of vinegar. Chill 1h+. Snap-crunchy at the desk." },
  { id: "carrot-chips", name: "Air-Fryer Carrot & Radish Chips", tag: "crunchy", kcal: "~40 kcal / batch",
    how: "Paper-thin slices, tiny mist of oil, salt + paprika. ~160°C, shake often until crisp." },
  { id: "cuke-crisps", name: "Air-Fryer Cucumber Crisps", tag: "near-zero", kcal: "~0 kcal",
    how: "Thin rounds, salt, pat dry. Air-fry low + slow to leathery-crisp." },
];
export const MUNCH_RULE = "Outside the eating window, the urge = water or black coffee, NOT food. Crunch on the brined cucumber if you must chew.";

export const BUDGET_NOTE =
  "Eat cheap on purpose: eggs, potatoes, rice, pasta, oats and canned fish are your protein-and-energy backbone — all cheap. " +
  "Chicken is the priciest thing here, so it's only ~2 days a week. Your whey covers a big slice of protein and you already own it. " +
  "Buy whatever veg is cheapest and in season (carrots and potatoes are the cheapest). Skip anything on this list you can't afford this week — it still works.";

/* Each item has a qty and a default price PER UNIT (DZD — Algeria).
   Prices are EDITABLE in the app and saved in settings.prices.
   The Meals screen multiplies qty × price → weekly cost total. */
export const CURRENCY = "DZD";
export const GROCERY = [
  { id: "rice",     item: "White rice",         qty: 1,   unit: "kg",   price: 150,  tag: "base" },
  { id: "chicken",  item: "Chicken breast",     qty: 1,   unit: "kg",   price: 700,  tag: "priciest" },
  { id: "potato",   item: "Potatoes",           qty: 2,   unit: "kg",   price: 70,   tag: "cheap" },
  { id: "tuna",     item: "Tuna (in water)",    qty: 5,   unit: "cans", price: 130 },
  { id: "sardines", item: "Sardines",           qty: 3,   unit: "cans", price: 180 },
  { id: "eggs",     item: "Eggs",               qty: 14,  unit: "eggs", price: 25,   tag: "cheap protein" },
  { id: "cheese",   item: "Hard cheese",        qty: 0.2, unit: "kg",   price: 1500 },
  { id: "oil",      item: "Olive oil",          qty: 0.25,unit: "L",    price: 800 },
  { id: "lemon",    item: "Lemons",             qty: 5,   unit: "units",price: 20 },
  { id: "carrot",   item: "Carrots",            qty: 1,   unit: "kg",   price: 80 },
  { id: "banana",   item: "Bananas",            qty: 7,   unit: "units",price: 50 },
  { id: "spice",    item: "Cumin / salt / pepper", qty: 0, unit: "—",   price: 0, tag: "once" },
];

export const SUPPLEMENTS = [
  { id: "omega3", name: "Omega-3 fish oil", dose: "per label", when: "with Meal 1 (14:00) — needs dietary fat" },
  { id: "d3k2", name: "Vitamin D3 + K2", dose: "per label", when: "with Meal 1 (14:00) — fat-soluble" },
  { id: "creatine", name: "Creatine monohydrate", dose: "5 g", when: "with Meal 1 (timing flexible, just be consistent)" },
  { id: "iso", name: "ISO protein (lactose-free)", dose: "1 scoop", when: "with Meal 2 (19:30)" },
];

/* ---------- Training: 4-day Upper/Lower, knee-safe. ----------
   ZERO running, ZERO jumping (hard rule — knee protection at high bodyweight).
   Intensity comes from TEMPO + mechanical disadvantage, not impact.
   `tempo` is lower-pause-up in seconds (e.g. "3-1-1").
   Each exercise keeps the logger shape: kind + target + scheme. */
export const TRAINING_NOTE =
  "4 days/week Upper/Lower. ZERO running, ZERO jumping — ever (knee protection). " +
  "Intensity = slow tempo + mechanical disadvantage. No gear except chairs + a table; resistance bands unlock more when they arrive.";

export const OVERLOAD_RULE =
  "BEAT LAST TIME. Progress order: +1 rep → slower negative → +1 set → harder variation → (bands) more tension.";

const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q + " tutorial proper form");

export const WORKOUTS = {
  A: { id: "A", title: "Lower (Mon)", duration: "~25 min", exercises: [
    { name: "Chair-assisted squat", kind: "reps", target: { sets: 4, reps: 15 }, tempo: "3-1-1", scheme: "4 × 15 · 3-1-1", how: "Hold the chair for balance, sit down to the seat, stand. Controlled — 3s down, 1s pause, 1s up.", video: yt("chair assisted squat") },
    { name: "Bulgarian split squat", kind: "reps", target: { sets: 3, reps: 10 }, tempo: "3-0-1", scheme: "3 × 10 / leg · 3-0-1", how: "Rear foot on a chair, hold the table. Front shin vertical. 3s down. (Regress to box squat if knees hurt.)", video: yt("bulgarian split squat") },
    { name: "Glute bridge", kind: "reps", target: { sets: 4, reps: 20 }, tempo: "2-2-1", scheme: "4 × 20 · 2-2-1", how: "On the floor, drive hips up, squeeze and PAUSE 2s at the top.", video: yt("glute bridge") },
    { name: "Calf raise (on stair/book)", kind: "reps", target: { sets: 4, reps: 25 }, tempo: "2-1-2", scheme: "4 × 25 · 2-1-2", how: "Toes on a stair edge or thick book. Full range, slow.", video: yt("calf raise") },
    { name: "Wall sit", kind: "time", target: { sets: 3, seconds: 40 }, scheme: "3 × max hold", how: "Back flat on wall, thighs parallel to floor. Hold to failure.", video: yt("wall sit") },
  ]},
  B: { id: "B", title: "Upper (Tue)", duration: "~25 min", exercises: [
    { name: "Incline push-up (hands on table)", kind: "reps", target: { sets: 4, reps: 12 }, tempo: "4-0-1", scheme: "4 × 12 · 4-0-1", how: "Hands on a sturdy table, body straight. SLOW 4s negative, push back up.", video: yt("incline push up") },
    { name: "Table-edge inverted row", kind: "reps", target: { sets: 4, reps: 10 }, tempo: "2-1-2", scheme: "4 × 10 · 2-1-2", how: "Lie under a sturdy table, grab the edge, pull chest to it. Pause 1s at top.", video: yt("table inverted row") },
    { name: "Pike push-up", kind: "reps", target: { sets: 3, reps: 8 }, tempo: "3-0-1", scheme: "3 × 8 · 3-0-1", how: "Hips high (upside-down V), lower head toward floor. Shoulders.", video: yt("pike push up") },
    { name: "Chair dips", kind: "reps", target: { sets: 3, reps: 12 }, tempo: "3-0-1", scheme: "3 × 12 · 3-0-1", how: "Hands on chair edge, feet on floor, lower and press. Don't shrug.", video: yt("chair tricep dip") },
    { name: "Plank", kind: "time", target: { sets: 3, seconds: 30 }, scheme: "3 × max hold", how: "Forearms down, brace hard, straight line. Hold to failure.", video: yt("plank") },
  ]},
  C: { id: "C", title: "Lower (Thu)", duration: "~25 min", exercises: [
    { name: "Tempo squat", kind: "reps", target: { sets: 4, reps: 12 }, tempo: "5-0-1", scheme: "4 × 12 · 5-0-1", how: "Bodyweight squat with a brutal 5-second descent. Control the whole way.", video: yt("tempo squat") },
    { name: "Reverse lunge", kind: "reps", target: { sets: 3, reps: 10 }, tempo: "2-0-1", scheme: "3 × 10 / leg · 2-0-1", how: "Step BACK into a lunge (knee-friendly), push back to standing. Hold a wall if needed.", video: yt("reverse lunge") },
    { name: "Single-leg glute bridge", kind: "reps", target: { sets: 3, reps: 12 }, tempo: "2-1-1", scheme: "3 × 12 / leg · 2-1-1", how: "One foot planted, other leg straight, drive hips up.", video: yt("single leg glute bridge") },
    { name: "Wall sit", kind: "time", target: { sets: 3, seconds: 45 }, scheme: "3 × max hold", how: "Same as Day A, push the time.", video: yt("wall sit") },
    { name: "Standing calf raise", kind: "reps", target: { sets: 4, reps: 30 }, tempo: "1-1-1", scheme: "4 × 30 · 1-1-1", how: "High reps, steady rhythm, full range.", video: yt("standing calf raise") },
  ]},
  D: { id: "D", title: "Upper (Fri)", duration: "~25 min", exercises: [
    { name: "Push-up (floor; knees if needed)", kind: "reps", target: { sets: 4, reps: 8 }, tempo: "3-0-1", scheme: "4 × max · 3-0-1", how: "Full floor push-up, or on knees. 3s negative. Go to failure each set.", video: yt("push up beginner") },
    { name: "Inverted row", kind: "reps", target: { sets: 4, reps: 8 }, tempo: "2-1-2", scheme: "4 × max · 2-1-2", how: "Under the table, pull chest to edge, to failure.", video: yt("table inverted row") },
    { name: "Pike push-up", kind: "reps", target: { sets: 3, reps: 10 }, tempo: "3-0-1", scheme: "3 × 10 · 3-0-1", how: "As Day B, +2 reps.", video: yt("pike push up") },
    { name: "Chair dip", kind: "reps", target: { sets: 3, reps: 15 }, tempo: "3-0-1", scheme: "3 × 15 · 3-0-1", how: "As Day B, +3 reps.", video: yt("chair tricep dip") },
    { name: "Hollow-body hold", kind: "time", target: { sets: 3, seconds: 20 }, scheme: "3 × max hold", how: "On back, low back pressed down, arms + legs off the floor. Hold.", video: yt("hollow body hold") },
  ]},
};

/* Unlocked once the user marks resistance bands as arrived (settings.bandsArrived).
   Fills the back/pull-volume gap. */
export const BANDS_EXTRA = {
  upper: [
    { name: "Band row", kind: "reps_weight", target: { sets: 3, reps: 12, load: 0 }, scheme: "3 × 12", how: "Anchor the band, row to ribs.", video: yt("resistance band row") },
    { name: "Band pull-apart", kind: "reps", target: { sets: 3, reps: 15 }, scheme: "3 × 15", how: "Arms straight, pull the band apart across your chest. Rear delts/upper back.", video: yt("band pull apart") },
    { name: "Band overhead press", kind: "reps_weight", target: { sets: 3, reps: 12, load: 0 }, scheme: "3 × 12", how: "Stand on the band, press overhead.", video: yt("band overhead press") },
  ],
  lower: [
    { name: "Band squat", kind: "reps", target: { sets: 3, reps: 15 }, scheme: "3 × 15", how: "Stand on the band, hold at shoulders, squat.", video: yt("band squat") },
    { name: "Band good-morning", kind: "reps", target: { sets: 3, reps: 12 }, scheme: "3 × 12", how: "Band over neck/shoulders, hinge at hips, flat back.", video: yt("band good morning") },
  ],
};

/* weekday (0=Sun..6=Sat) -> workout id or "rest". Steps are mandatory every day. */
export const WEEK_SCHEDULE = {
  0: "rest",  // Sun
  1: "A",     // Mon — Lower
  2: "B",     // Tue — Upper
  3: "rest",  // Wed
  4: "C",     // Thu — Lower
  5: "D",     // Fri — Upper
  6: "rest",  // Sat
};

export const WARMUP = "5 min: arm circles, leg swings, slow bodyweight squats, cat-cow, marching in place. No jumping.";
export const COOLDOWN = "5 min: stretch quads, hamstrings, chest, shoulders, hip flexors.";

/* Milestones: every 5kg lost from 112.7 down to 80 */
export const MILESTONES = (() => {
  const out = [{ kg: 2, icon: "✦", label: "First 2 kg" }];
  for (let lost = 5; lost <= 33; lost += 5) out.push({ kg: lost, icon: "★", label: `−${lost} kg` });
  out.push({ kg: 32.7, icon: "◆", label: "GOAL 80 kg" });
  return out.sort((a, b) => a.kg - b.kg);
})();

/* ---------- Batch meal prep: cook once, eat all week ---------- */
export const MEAL_PREP = {
  intro: "One air-fryer + one pot session (~60 min). Cook everything, portion into containers, and you're done thinking about food for the week.",
  // Batch quantities aligned with the weekly grocery list (≈7 days)
  batch: [
    { item: "Chicken breast (air fryer)", cook: "Season ~1 kg chicken (salt, cumin, pepper, lemon). Air-fry at 180°C / 20–25 min (do in 2 batches if needed, flip halfway).", yields: "~5 portions of ~150 g cooked", store: "Fridge 3 days · freeze the rest" },
    { item: "Potato wedges (air fryer)", cook: "Cube ~2 kg potatoes, toss with oil + salt + cumin. Air-fry at 200°C / 15–18 min per batch, shaking once.", yields: "~6 potato servings", store: "Fridge 4 days" },
    { item: "White rice", cook: "Cook a big pot (~250 g dry → ~750 g cooked) while the air fryer runs.", yields: "~4 rice servings", store: "Fridge ≤3 days OR freeze. Cool fast, reheat until steaming hot" },
    { item: "Eggs", cook: "Hard-boil ~8 eggs, 9 min, in the pot before the rice.", yields: "evening snacks for the week", store: "Fridge 5–7 days in shell" },
    { item: "Carrots & zucchini", cook: "Chop, toss with oil/salt, air-fry 200°C / 10 min (after the chicken).", yields: "veg side for the week", store: "Fridge 4 days" },
    { item: "Tuna / sardines", cook: "No prep — canned. Open on the day.", yields: "—", store: "Pantry" },
  ],
  prepDay: [
    "Put a pot of salted water on. Heat the air fryer to 180°C.",
    "Boil the eggs first (9 min). Cool in cold water and set aside.",
    "Season the chicken. Air-fry at 180°C / 20–25 min (flip halfway). Do in 2 batches if it won't all fit.",
    "While the chicken cooks: cube the potatoes, toss with oil/salt/cumin.",
    "Cook the rice in the same pot you boiled the eggs in.",
    "After the chicken, air-fry the potato wedges at 200°C / 15–18 min.",
    "Finally air-fry the chopped carrot/zucchini 200°C / 10 min.",
    "Let everything cool ~20 min, then portion into containers. Label them. Fridge 3 days · freeze the rest.",
  ],
  storage: [
    "Use airtight containers. Fridge max 3–4 days; freeze anything beyond that.",
    "Rice safety: cool within ~1 hour and always reheat until steaming hot.",
    "Reheat chicken until hot all the way through.",
    "Add lemon, olive oil and fresh salad on the day — don't pre-dress.",
    "Eat sardines fresh from the can (oily fish is best not stored cooked).",
  ],
  containers: "Aim for 7 lunch containers + 7 dinner containers (or fewer if you freeze half and defrost as you go). Write the day on each lid.",
};

/* ---------- Ranks: level up by stacking disciplined days ---------- */
export const RANKS = [
  { min: 0,   title: "Rookie",       icon: "●" },
  { min: 3,   title: "Committed",    icon: "◆" },
  { min: 7,   title: "Disciplined",  icon: "★" },
  { min: 14,  title: "Locked In",    icon: "✦" },
  { min: 30,  title: "Relentless",   icon: "▲" },
  { min: 60,  title: "Machine",      icon: "⬢" },
  { min: 100, title: "Unbreakable",  icon: "♦" },
];

/* ============================================================
   THE IMMUTABLE MASTER CLOCK — drives the rail home + notifications.
   `id` is stable, `action` is the single thing to do, `type` styles it,
   `notify` rows fire a notification, `body` is the push text.
   ============================================================ */
export const MASTER_CLOCK = [
  { id: "wake",   time: "08:00", action: "Wake. 500 ml water. Black coffee.",          type: "wake",    notify: true,  body: "Up. 500 ml water + black coffee." },
  { id: "walk1",  time: "08:30", action: "Fasted walk #1 — 5,000 steps",               type: "walk",    notify: true,  body: "Fasted walk #1 — knock out 5,000 steps." },
  { id: "work1",  time: "09:30", action: "Shower. Green tea. Start work (cucumber spears at the desk).", type: "work", notify: true, body: "Start work. Green tea + brined cucumber at the desk." },
  { id: "train",  time: "12:30", action: "TRAIN — today's workout (fasted is fine)",    type: "train",   notify: true,  body: "Train now. Today's workout — fasted is fine." },
  { id: "postw",  time: "13:30", action: "Post-workout: water only (window not open yet)", type: "fast", notify: false, body: "" },
  { id: "meal1",  time: "14:00", action: "WINDOW OPENS — Meal 1 + Omega-3 + D3/K2 + 5 g creatine", type: "meal", notify: true, body: "Window open. Meal 1 + Omega-3 + D3/K2 + creatine." },
  { id: "work2",  time: "15:00", action: "Back to work",                                type: "work",    notify: false, body: "" },
  { id: "walk2",  time: "18:00", action: "Walk #2 — 5,000 steps",                       type: "walk",    notify: true,  body: "Walk #2 — last 5,000 steps." },
  { id: "meal2",  time: "19:30", action: "Meal 2 + 1 scoop ISO protein",               type: "meal",    notify: true,  body: "Meal 2 + ISO protein. Last food of the day." },
  { id: "warn",   time: "19:45", action: "Window closes in 15 minutes",                type: "warn",    notify: true,  body: "Window closes in 15 min. Finish eating." },
  { id: "close",  time: "20:00", action: "WINDOW CLOSED — water / tea only now",        type: "warn",    notify: true,  body: "Window closed. Water / tea only from here." },
  { id: "wind",   time: "20:30", action: "Wind-down. Log your weight data.",            type: "work",    notify: true,  body: "Wind down. Log today's data." },
  { id: "screens",time: "22:00", action: "Screens off",                                 type: "sleep",   notify: true,  body: "Screens off. Protect tomorrow." },
  { id: "sleep",  time: "22:30", action: "SLEEP (non-negotiable)",                      type: "sleep",   notify: true,  body: "Sleep now. Non-negotiable." },
];

/* Reminders are derived from the Master Clock notify rows (editable on/off). */
export const DEFAULT_REMINDERS = MASTER_CLOCK
  .filter((r) => r.notify)
  .map((r) => ({ id: r.id, label: r.action.length > 38 ? r.action.slice(0, 36) + "…" : r.action, time: r.time, on: true, body: r.body }));

/* ============================================================
   EXPECTED TIMELINE — projected trendline (overlay actual rolling avg).
   ============================================================ */
export const TIMELINE = [
  { month: 0, kg: 112.7, event: "Start" },
  { month: 1, kg: 107.2, event: "Fast initial drop" },
  { month: 2, kg: 102.7 },
  { month: 3, kg: 98.7 },
  { month: 4, kg: 94.7, event: "Recalc → ~1,550 kcal" },
  { month: 5, kg: 91.2 },
  { month: 6, kg: 87.7 },
  { month: 7, kg: 84.7, event: "Recalc → ~1,450 kcal" },
  { month: 8, kg: 81.7 },
  { month: 9, kg: 80.0, event: "GOAL" },
];
export const TIMELINE_NOTE = "Aggressive but realistic: ~1.1 kg/week early, slowing as you lighten. Full window ≈ 8–9 months.";

/* ---------- Safety guardrails (fire from the symptom log) ---------- */
export const GUARDRAILS = {
  knee: "Knee pain logged → regress Bulgarian split squats / lunges to box squats until you're down 10 kg. Never run or jump.",
  ibs: "Morning cramping logged → move coffee from 08:00 to 14:00 (with food); make 08:00 green tea instead.",
  bloating: "Protein-powder bloating logged → split the scoop across the day, or swap it for a 3rd egg.",
  energy: "Energy crash / binge logged → the fix is bumping Meal 1 rice 70 g → 90 g, NOT guilt. Sustainable beats optimal.",
  calcium: "No dairy → eat canned sardines-with-bones 2×/week (cheap, low-FODMAP, also omega-3).",
};

export const SYMPTOM_TYPES = [
  { id: "knee", label: "Knee pain", icon: "🦵" },
  { id: "ibs", label: "IBS / cramping", icon: "🌀" },
  { id: "bloating", label: "Bloating", icon: "🎈" },
  { id: "energy", label: "Low energy / binge", icon: "🔋" },
];

/* Big, vibrant hero quotes — shown front and center every time the app
   opens. Short and punchy so they fit in a giant display font. */
/* ---------- Refeed (planned higher-carb day) ----------
   Aggressive deficits stall and burn you out. ONE planned higher-carb day
   per week keeps fat loss going and hormones happy. NOT a free-for-all. */
export const REFEED = {
  intro: "Today is your planned refeed. The deficit pauses for ONE day so the next 6 days work better. Eat the same clean foods — just MORE carbs.",
  rules: [
    "Hit your normal protein (don't drop it).",
    "Add ~50% more rice / potato / oats — fill the tank.",
    "Keep fats moderate (no fried, no junk).",
    "No alcohol, no sweets, no off-plan eating — just bigger portions of your usual meals.",
    "Calories rise to roughly maintenance (~2,800–3,000 kcal). That's the point. Do NOT feel guilty.",
    "Tomorrow you go straight back to your normal target. The fast resumes. No 'cheat week.'",
  ],
  example:
    "Example refeed day: Air-fryer chicken (250g) + 180g dry rice + 300g potato + olive oil " +
    "+ 3 scoops whey + 2 boiled eggs + a banana. Same foods, bigger portions.",
};

/* ---------- Diet break (full WEEK at maintenance, every 8–12 weeks) ----------
   Different from a refeed day. After ~8–12 weeks of cutting, take a WHOLE week
   at maintenance calories. Hormones recover, adherence resets, fat loss resumes.
   This is the difference between losing 30 kg and crashing at week 6. */
export const DIET_BREAK = {
  intro: "Every 8–12 weeks of cutting, you take a FULL WEEK at maintenance (~2,800–3,000 kcal). Not a cheat week. Same clean foods — just bigger portions. This protects muscle, hormones, and your mind.",
  rules: [
    "Calories: maintenance (~2,800–3,000 kcal). Eat to full satisfaction.",
    "Protein stays at your normal target.",
    "Add carbs liberally — rice, potato, oats, fruit. That's the point.",
    "Same clean foods. No fried, no junk, no alcohol.",
    "Train as normal. Walks still happen.",
    "After 7 days, you go straight back to your cut target. Expect the scale to drop fast in week 1 of the new block (water).",
  ],
  cadence: 56, // suggested days between diet breaks (8 weeks)
};

export const HERO_QUOTES = [
  { line: "EARN.\nIT.",                vibe: "lime"   },
  { line: "NO ZERO\nDAYS.",            vibe: "orange" },
  { line: "OUTWORK\nYESTERDAY.",       vibe: "lime"   },
  { line: "DISCIPLINE\n>\nMOTIVATION.",vibe: "duo"    },
  { line: "DON'T BREAK\nTHE CHAIN.",   vibe: "orange" },
  { line: "BUILT,\nNOT BORN.",         vibe: "lime"   },
  { line: "SHOW UP.\nALWAYS.",         vibe: "duo"    },
  { line: "WIN\nTODAY.",               vibe: "lime"   },
  { line: "QUIET WORK.\nLOUD RESULTS.",vibe: "orange" },
  { line: "BE\nUNDENIABLE.",           vibe: "duo"    },
  { line: "PAIN IS\nTEMPORARY.",       vibe: "orange" },
  { line: "STOP MAKING\nEXCUSES.",     vibe: "lime"   },
  { line: "FAT BURNS\nIN SILENCE.",    vibe: "duo"    },
  { line: "FUTURE YOU\nIS WATCHING.",  vibe: "lime"   },
];

export const DAILY_LINES = [
  "Discipline beats motivation. Just do what's on the screen.",
  "You don't have to feel like it. You just have to do it.",
  "The plan is decided. Your only job is to follow it.",
  "Every fast you finish, every workout you log — that's the new you being built.",
  "You've quit before. Not this time. Lock in.",
  "Small. Boring. Consistent. That's how 112 becomes 80.",
  "Hungry is not an emergency. Drink water, keep moving.",
  "Future you is watching what you do right now.",
  "No decisions. No debates. Execute the day.",
  "One day at a time. Don't break the chain.",
];
