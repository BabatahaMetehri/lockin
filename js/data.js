/* ============================================================
   data.js — ALL coaching content for Taha (from the design spec).
   Pure data, no logic. Edit numbers here to retune the program.
   ============================================================ */

export const PROFILE = {
  name: "Taha",
  dob: "2000-01-18",
  heightCm: 175,
  startWeightKg: 112.7,
  startDate: "2026-05-26",
  goalWeightKg: 80,
};

export const TARGETS = {
  kcal: 1800,
  proteinG: 180,
  fatG: 50,
  carbsG: 155,
  waterL: 3,
  steps: 8000,
};

export const EATING_WINDOW = {
  fastUntil: "12:30",
  stopEating: "20:00",
  note: "Fast 8pm → 12:30pm. During the fast: water, black coffee, plain/green tea only (no milk, no sugar).",
};

export const EXCLUDED_FOODS = [
  "Onion & garlic", "Beans, lentils, chickpeas (legumes)",
  "Fried & very fatty food", "Spicy food (harissa, hot pepper)",
  "Milk & yogurt (lactose)",
];

export const SEASONING_RULES =
  "Season with: cumin, lemon, salt, mild black pepper, sweet paprika, parsley, coriander, mint, olive oil. " +
  "NEVER: onion/garlic, harissa/hot pepper. Hard/aged cheese is fine.";

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
  { id: "creatine", name: "Creatine monohydrate", dose: "5 g", when: "with Meal 1 (any time, daily)" },
  { id: "whey", name: "Whey ISO protein", dose: "2 scoops", when: "4pm snack (+ post-workout)" },
  { id: "omega3", name: "Omega-3", dose: "per label", when: "with Meal 1 (needs fat)" },
  { id: "d3k2", name: "Vitamin D3 + K2", dose: "per label", when: "with Meal 1 (fat-soluble)" },
];

/* ---------- Training: BEGINNER scaling for a 113kg untrained start. ----------
   Each exercise has a `kind`:
     'reps'         — count reps per set (button/+ counter)
     'time'         — hold for N seconds (built-in timer)
     'reps_weight'  — reps + load (filled bottles, backpack)
   `video` is a YouTube SEARCH url so the link never rots.
   `target` defines starting sets / reps / seconds. Beat last time = progress. */
export const TRAINING_NOTE =
  "NO gear needed. Optional load: a backpack/bottles filled with water, books or rice — start LIGHT (2–3 kg). " +
  "Workouts are short (~20–25 min) and scaled to a 113 kg beginner. Wall push-ups are 100% fine — start there.";

export const OVERLOAD_RULE =
  "BEAT LAST TIME. Progress order: +1 rep → +5 sec hold → +1 set → harder variation → add a bit of load.";

const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q + " tutorial proper form");

export const WORKOUTS = {
  A: { id: "A", title: "Lower — beginner", duration: "~20 min", exercises: [
    { name: "Bodyweight squat",   kind: "reps", target: { sets: 3, reps: 8 },   scheme: "3 × 8",     how: "Stand shoulder-width. Sit back like onto a chair. Knees track over toes. Don't need to go deep — quality > depth.", video: yt("bodyweight squat") },
    { name: "Glute bridge",       kind: "reps", target: { sets: 3, reps: 10 },  scheme: "3 × 10",    how: "On your back, knees bent. Drive hips up squeezing glutes. Pause 1 sec at top.", video: yt("glute bridge") },
    { name: "Wall sit",           kind: "time", target: { sets: 3, seconds: 20 }, scheme: "3 × 20s", how: "Back flat on wall, thighs parallel to floor (or close). Hold. The timer is built in.", video: yt("wall sit") },
    { name: "Calf raises",        kind: "reps", target: { sets: 3, reps: 12 },  scheme: "3 × 12",    how: "Stand tall, raise onto toes, slow down.", video: yt("calf raise") },
    { name: "Dead bug",           kind: "reps", target: { sets: 3, reps: 6 },   scheme: "3 × 6 / side", how: "On back, arms up, knees up 90°. Lower opposite arm + leg slowly. Core stays flat.", video: yt("dead bug core") },
    { name: "Plank (knees OK)",   kind: "time", target: { sets: 3, seconds: 15 }, scheme: "3 × 15s", how: "Forearms down. Knees OK to start. Straight line from head to whatever's on the floor.", video: yt("plank beginner") },
  ]},
  B: { id: "B", title: "Upper — push, beginner", duration: "~20 min", exercises: [
    { name: "Wall push-up",       kind: "reps", target: { sets: 3, reps: 8 },   scheme: "3 × 8",     how: "Stand arm's length from wall. Hands flat. Lower chest to wall, push back. When this gets easy, move to incline push-ups on a table.", video: yt("wall push up beginner") },
    { name: "Incline push-up",    kind: "reps", target: { sets: 3, reps: 6 },   scheme: "3 × 6",     how: "Hands on a sturdy table or kitchen counter. Body straight. Lower chest, push up. Easier than knee push-ups for big guys.", video: yt("incline push up") },
    { name: "Chair-supported pike", kind: "reps", target: { sets: 3, reps: 6 }, scheme: "3 × 6",     how: "Hands on chair seat, hips high, lower head toward hands. Shoulders.", video: yt("pike push up beginner") },
    { name: "Chair dips (shallow)", kind: "reps", target: { sets: 3, reps: 6 }, scheme: "3 × 6",     how: "Hands on chair edge, knees BENT (feet flat). Lower a few inches, push up. Don't go deep — protect shoulders.", video: yt("chair tricep dip beginner") },
    { name: "Bottle overhead press", kind: "reps_weight", target: { sets: 3, reps: 10, load: 1 }, scheme: "3 × 10", how: "Two filled water bottles at shoulders. Press up overhead. Start light — 0.5–1 L each.", video: yt("overhead press dumbbell beginner") },
    { name: "Plank (knees OK)",   kind: "time", target: { sets: 3, seconds: 15 }, scheme: "3 × 15s", how: "Same plank as Workout A.", video: yt("plank beginner") },
  ]},
  C: { id: "C", title: "Lower — variation", duration: "~20 min", exercises: [
    { name: "Step-up to chair",   kind: "reps", target: { sets: 3, reps: 8 },   scheme: "3 × 8 / leg", how: "Sturdy chair (not a fold-up). Step up driving through the heel. Step down. Alternate.", video: yt("step up exercise") },
    { name: "Wall sit",           kind: "time", target: { sets: 3, seconds: 30 }, scheme: "3 × 30s", how: "5 sec longer than Workout A.", video: yt("wall sit") },
    { name: "Reverse lunge",      kind: "reps", target: { sets: 3, reps: 6 },   scheme: "3 × 6 / leg", how: "Step backward into a lunge, knee toward (not on) floor, push back. Hold a wall for balance.", video: yt("reverse lunge beginner") },
    { name: "Bird dog",           kind: "reps", target: { sets: 3, reps: 8 },   scheme: "3 × 8 / side", how: "On hands and knees. Extend opposite arm + leg, hold 1 sec, return. Slow.", video: yt("bird dog exercise") },
    { name: "Glute bridge",       kind: "reps", target: { sets: 3, reps: 12 },  scheme: "3 × 12",    how: "Same as A, +2 reps.", video: yt("glute bridge") },
    { name: "March in place",     kind: "time", target: { sets: 3, seconds: 60 }, scheme: "3 × 60s", how: "Lift knees high, pump arms. Easy cardio finisher.", video: yt("march in place cardio") },
  ]},
  D: { id: "D", title: "Upper — pull + core (no bar)", duration: "~20 min", exercises: [
    { name: "Towel row (door)",   kind: "reps", target: { sets: 3, reps: 8 },   scheme: "3 × 8",     how: "Towel over the top of a closed, LATCHED door. Hold both ends, lean back, pull chest toward the door.", video: yt("door towel row no bar") },
    { name: "Bent-over row",      kind: "reps_weight", target: { sets: 3, reps: 10, load: 1 }, scheme: "3 × 10", how: "Two filled bottles or a backpack. Hinge forward (flat back), row to ribs.", video: yt("bent over row dumbbell") },
    { name: "Bicep curl",         kind: "reps_weight", target: { sets: 3, reps: 10, load: 1 }, scheme: "3 × 10", how: "Bottles or backpack. Slow, controlled.", video: yt("bicep curl dumbbell") },
    { name: "Reverse snow angel", kind: "reps", target: { sets: 3, reps: 10 },  scheme: "3 × 10",    how: "Lie face-down, sweep arms from sides to overhead, then back. Rear delts/back.", video: yt("reverse snow angel exercise") },
    { name: "Dead bug",           kind: "reps", target: { sets: 3, reps: 6 },   scheme: "3 × 6 / side", how: "Same as A.", video: yt("dead bug core") },
    { name: "Plank (knees OK)",   kind: "time", target: { sets: 3, seconds: 20 }, scheme: "3 × 20s", how: "Workout D plank is 5 sec longer.", video: yt("plank beginner") },
  ]},
};

/* weekday (0=Sun..6=Sat) -> workout id or "walk"/"rest" */
export const WEEK_SCHEDULE = {
  0: "rest",  // Sun
  1: "A",     // Mon
  2: "B",     // Tue
  3: "walk",  // Wed
  4: "C",     // Thu
  5: "D",     // Fri
  6: "walk",  // Sat
};

export const WARMUP = "5 min: arm circles, leg swings, bodyweight squats, cat-cow, marching in place.";
export const COOLDOWN = "5 min: stretch quads, hamstrings, chest, shoulders.";

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

/* ---------- Default daily reminders (times the user can edit) ---------- */
export const DEFAULT_REMINDERS = [
  { id: "weigh",  label: "Weigh in",        time: "08:00", on: true,  body: "Step on the scale and log it. 5 seconds." },
  { id: "fast",   label: "Break your fast", time: "12:30", on: true,  body: "Eating window open. Time for Meal 1." },
  { id: "shake",  label: "Protein shake",   time: "16:00", on: true,  body: "2 scoops whey. Hit your 180g protein." },
  { id: "train",  label: "Workout",         time: "18:00", on: true,  body: "Time to train. Beat last time." },
  { id: "dinner", label: "Dinner",          time: "19:30", on: true,  body: "Meal 2. Last food before the fast." },
  { id: "wind",   label: "Wind down",       time: "21:00", on: false, body: "Stop eating. Water only. Check today's wins." },
];

/* Big, vibrant hero quotes — shown front and center every time the app
   opens. Short and punchy so they fit in a giant display font. */
/* ---------- Refeed (planned higher-carb day) ----------
   Aggressive deficits stall and burn you out. ONE planned higher-carb day
   per week keeps fat loss going and hormones happy. NOT a free-for-all. */
export const REFEED = {
  intro: "Today is your planned refeed. The deficit pauses for ONE day so the next 6 days work better. Eat the same clean foods — just MORE carbs.",
  rules: [
    "Hit your normal 180 g protein (don't drop it).",
    "Add ~50% more rice / potato / oats — fill the tank.",
    "Keep fats moderate (no fried, no junk).",
    "No alcohol, no sweets, no off-plan eating — just bigger portions of your usual meals.",
    "Calories rise to roughly maintenance (~2,800–3,000 kcal). That's the point. Do NOT feel guilty.",
    "Tomorrow you go straight back to 1,800 kcal. The fast resumes. No 'cheat week.'",
  ],
  example:
    "Example refeed day: Air-fryer chicken (250g) + 180g dry rice + 300g potato + olive oil " +
    "+ 3 scoops whey + 2 boiled eggs + a banana. Same foods, bigger portions.",
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
