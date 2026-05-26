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

/* Each option is interchangeable. Pick ONE lunch + ONE dinner per day. */
export const LUNCHES = [
  { id: "L1", name: "Chicken & rice", macros: "≈650 kcal · 64g P",
    ingredients: ["220g raw chicken breast", "50g dry white rice", "200g veg (zucchini, carrot, green beans)", "10g olive oil", "lemon, cumin, parsley"],
    steps: ["Start the rice (see basics).", "Season and pan-cook the chicken.", "Sauté the veg in the same pan.", "Plate rice + chicken + veg, squeeze lemon."] },
  { id: "L2", name: "Tuna & potato bowl", macros: "≈620 kcal · 60g P",
    ingredients: ["2 cans tuna in water (drained ~200g)", "300g raw potato", "10g olive oil", "lemon, parsley", "side salad"],
    steps: ["Boil the potatoes.", "Drain tuna well.", "Combine potato + tuna, drizzle oil + lemon, salt, parsley.", "Add chopped lettuce/cucumber/tomato on the side."] },
  { id: "L3", name: "Chicken & couscous", macros: "≈650 kcal · 63g P",
    ingredients: ["220g raw chicken breast", "50g dry couscous", "200g veg", "10g olive oil", "cumin, lemon"],
    steps: ["Couscous in a bowl + 60ml boiling water + pinch salt + few drops oil. Cover 5 min, fluff.", "Pan-cook the chicken.", "Steam the veg.", "Combine, finish with lemon + cumin."] },
];

export const DINNERS = [
  { id: "D1", name: "Eggs & cheese plate", macros: "≈520 kcal · 48g P",
    ingredients: ["3 whole eggs + 3 egg whites", "30g hard cheese", "50g bread/baguette", "salad + 5g olive oil"],
    steps: ["Boil eggs 8–9 min OR make an omelette in a non-stick pan with a touch of oil (3–4 min, fold).", "Slice cheese + bread.", "Dress salad with oil + lemon."] },
  { id: "D2", name: "Sardines & potato", macros: "≈510 kcal · 44g P · omega-3",
    ingredients: ["120g canned sardines (drained)", "250g raw potato", "salad, lemon, parsley"],
    steps: ["Boil the potatoes.", "Drain sardines, lay over potato.", "Lemon + parsley, salad on the side."] },
  { id: "D3", name: "Chicken & bread", macros: "≈500 kcal · 52g P",
    ingredients: ["180g raw chicken breast", "60g bread", "grilled veg (pepper, zucchini)", "5g olive oil, cumin"],
    steps: ["Season and pan/grill the chicken.", "Grill/sauté the veg.", "Serve with bread."] },
];

export const SNACK = {
  id: "S", name: "Whey shake (+oats on workout days)", macros: "≈226–376 kcal · 54–59g P", time: "16:00",
  ingredients: ["2 scoops whey ISO", "~300ml cold water", "workout days: +40g oats"],
  steps: ["Shake whey + water in a bottle.", "Workout days: soak 40g oats in 150ml water 5 min (or microwave 90s) — eat as porridge with cinnamon or stir into the shake."] };

export const DAILY_EXTRAS = "Top-up: 30g hard cheese + 1 small fruit (banana/clementine) ≈ 215 kcal, 8g P.";

export const GROCERY = [
  { item: "Chicken breast", qty: "1.5 kg" },
  { item: "Eggs", qty: "18–24" },
  { item: "Canned tuna (in water)", qty: "5 cans" },
  { item: "Canned sardines", qty: "3 cans" },
  { item: "Hard/aged cheese", qty: "300 g" },
  { item: "White rice", qty: "1 kg" },
  { item: "Potatoes", qty: "2 kg" },
  { item: "Couscous", qty: "500 g" },
  { item: "Oats", qty: "500 g" },
  { item: "Bread / baguette", qty: "4–5 (fresh)" },
  { item: "Bananas / clementines", qty: "7" },
  { item: "Olive oil", qty: "1 bottle" },
  { item: "Lemons", qty: "6–7" },
  { item: "Zucchini", qty: "4" },
  { item: "Carrots", qty: "6" },
  { item: "Green beans", qty: "500 g" },
  { item: "Bell peppers", qty: "3" },
  { item: "Lettuce", qty: "1–2 heads" },
  { item: "Cucumbers", qty: "4" },
  { item: "Tomatoes", qty: "6" },
  { item: "Cumin, paprika, salt, pepper, herbs", qty: "as needed" },
  { item: "Coffee / plain tea", qty: "as needed" },
];

export const SUPPLEMENTS = [
  { id: "creatine", name: "Creatine monohydrate", dose: "5 g", when: "with Meal 1 (any time, daily)" },
  { id: "whey", name: "Whey ISO protein", dose: "2 scoops", when: "4pm snack (+ post-workout)" },
  { id: "omega3", name: "Omega-3", dose: "per label", when: "with Meal 1 (needs fat)" },
  { id: "d3k2", name: "Vitamin D3 + K2", dose: "per label", when: "with Meal 1 (fat-soluble)" },
];

/* ---------- Training: no equipment required. ---------- */
export const TRAINING_NOTE =
  "NO equipment required. The only 'weight' is a backpack/bag you fill (water bottles, books, rice/flour bags) — " +
  "start ~5kg, add more to progress. Two filled bottles = light dumbbells. Uses a chair, sturdy table, wall, door + towel. " +
  "If you have none of these, the bodyweight version still works.";

export const OVERLOAD_RULE =
  "BEAT LAST TIME. Progress in this order: +1–2 reps → add a set → slow the lowering to 3 seconds → harder variation → add weight to the backpack.";

export const WORKOUTS = {
  A: { id: "A", title: "Lower — Squat focus", exercises: [
    { name: "Squat", scheme: "4 × 12–20", how: "Bodyweight → hold a loaded backpack at chest to make it harder." },
    { name: "Reverse lunge", scheme: "3 × 10 / leg", how: "Bodyweight → hold backpack or bottles." },
    { name: "Hip hinge / RDL", scheme: "3 × 12–15", how: "Hands on hips → hold backpack/bottles. Push hips back, flat back." },
    { name: "Glute bridge", scheme: "3 × 15–20", how: "Lie down, drive hips up. Backpack on hips to progress." },
    { name: "Calf raises", scheme: "3 × 20", how: "On a step edge if available for more range." },
    { name: "Wall sit (finisher)", scheme: "3 × max hold", how: "Back on wall, thighs parallel to floor, hold." },
    { name: "Leg raises", scheme: "3 × 15", how: "Lie on back, lift straight legs, lower slow." },
    { name: "Plank", scheme: "3 × max", how: "Forearms down, straight line, brace." },
  ]},
  B: { id: "B", title: "Upper — Push focus", exercises: [
    { name: "Push-ups", scheme: "4 × AMRAP", how: "Progression: hands on table/wall → on knees → standard → feet on chair." },
    { name: "Pike push-ups", scheme: "3 × 8–12", how: "Hips high, head toward floor (shoulders). Elevate feet to progress." },
    { name: "Overhead press", scheme: "3 × 10–12", how: "Two filled bottles or backpack pressed from shoulders to overhead." },
    { name: "Chair dips", scheme: "3 × 12", how: "Hands on chair edge, lower body, push up (triceps)." },
    { name: "Bicep curls", scheme: "3 × 12", how: "Bottles or backpack, curl slow." },
    { name: "Dead bug", scheme: "3 × 12", how: "On back, opposite arm/leg extend, brace core." },
    { name: "Side plank", scheme: "3 × max / side", how: "On forearm, hips up, straight line." },
  ]},
  C: { id: "C", title: "Lower — Posterior / glute focus", exercises: [
    { name: "Tempo squat", scheme: "4 × 12", how: "3 seconds down. Bodyweight → backpack." },
    { name: "Split squat", scheme: "3 × 10 / leg", how: "Rear foot on a chair, drop straight down." },
    { name: "Single-leg glute bridge", scheme: "3 × 12 / leg", how: "One foot planted, other leg straight, drive hips up." },
    { name: "Good morning / hip hinge", scheme: "3 × 15", how: "Hands behind head → backpack on shoulders. Hinge at hips." },
    { name: "Single-leg calf raise", scheme: "3 × 15 / leg", how: "Balance on one foot, raise slow." },
    { name: "Bicycle crunches", scheme: "3 × 20", how: "Elbow to opposite knee, alternating." },
    { name: "Hollow hold", scheme: "3 × max", how: "On back, low back pressed down, arms/legs off floor." },
  ]},
  D: { id: "D", title: "Upper — Pull focus (no bar)", exercises: [
    { name: "Rows", scheme: "4 × 8–12", how: "Pick what you can set up: (a) lie under a sturdy table, pull chest to edge; (b) towel over the top of a closed latched door, hold both ends, lean back & pull; (c) broom handle across two chairs, row under it." },
    { name: "Bent-over rows", scheme: "3 × 12", how: "Backpack or two bottles, hinge forward, row to ribs." },
    { name: "Towel rows (single arm)", scheme: "3 × 12", how: "Door + towel as above, one arm at a time." },
    { name: "Reverse snow angels", scheme: "3 × 15", how: "Lie face-down, arms sweep from sides to overhead (rear delts/back)." },
    { name: "Bicep curls", scheme: "3 × 12", how: "Bottles/backpack." },
    { name: "Plank shoulder taps", scheme: "3 × 20", how: "Plank, tap opposite shoulder without rocking hips." },
    { name: "Leg raises", scheme: "3 × 15", how: "Lie on back, lift straight legs." },
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
