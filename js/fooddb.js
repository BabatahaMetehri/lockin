/* ============================================================
   fooddb.js — curated local food database (~60 items).
   All values per 100 g unless `defaultGrams` indicates a typical
   single-unit weight (e.g. one egg ≈ 50 g). Numbers are USDA-style
   averages — close enough for fat-loss tracking, no network needed.
   ============================================================ */

export const FOOD_DB = [
  // ---- rice ----
  { id: "rice-w-cooked",  name: "White rice (cooked)",        kcal: 130, protein: 2.7, defaultGrams: 200, aliases: ["riz blanc", "riz cuit"] },
  { id: "rice-w-dry",     name: "White rice (dry, raw)",      kcal: 365, protein: 7.1, defaultGrams: 50 },
  { id: "rice-brown",     name: "Brown rice (cooked)",        kcal: 112, protein: 2.6, defaultGrams: 200 },
  { id: "rice-basmati",   name: "Basmati rice (cooked)",      kcal: 121, protein: 3.0, defaultGrams: 200 },
  { id: "rice-jasmine",   name: "Jasmine rice (cooked)",      kcal: 129, protein: 2.7, defaultGrams: 200 },

  // ---- bread / wheat ----
  { id: "bread-w",        name: "White bread",                kcal: 265, protein: 9,   defaultGrams: 50 },
  { id: "bread-wg",       name: "Whole grain bread",          kcal: 247, protein: 13,  defaultGrams: 50 },
  { id: "baguette",       name: "Baguette",                   kcal: 270, protein: 8,   defaultGrams: 50 },
  { id: "khobz",          name: "Khobz (Algerian bread)",     kcal: 270, protein: 8.5, defaultGrams: 60, aliases: ["khoubz", "khobz dar"] },
  { id: "couscous-c",     name: "Couscous (cooked)",          kcal: 112, protein: 3.8, defaultGrams: 150 },
  { id: "couscous-d",     name: "Couscous (dry)",             kcal: 376, protein: 13,  defaultGrams: 50 },
  { id: "oats-d",         name: "Oats (dry, raw)",            kcal: 389, protein: 17,  defaultGrams: 40, aliases: ["oatmeal"] },
  { id: "oats-c",         name: "Oats (cooked porridge)",     kcal: 71,  protein: 2.5, defaultGrams: 250 },

  // ---- potatoes ----
  { id: "potato-b",       name: "Potato (boiled)",            kcal: 87,  protein: 2,   defaultGrams: 250, aliases: ["pomme de terre"] },
  { id: "potato-bk",      name: "Potato (baked, with skin)",  kcal: 93,  protein: 2.5, defaultGrams: 250 },
  { id: "potato-air",     name: "Potato wedges (air-fryer)",  kcal: 130, protein: 2.5, defaultGrams: 200 },
  { id: "sweet-potato",   name: "Sweet potato (baked)",       kcal: 90,  protein: 2,   defaultGrams: 200, aliases: ["patate douce"] },
  { id: "fries",          name: "French fries",               kcal: 312, protein: 3.4, defaultGrams: 150 },

  // ---- chicken ----
  { id: "chicken-b-c",    name: "Chicken breast (cooked, no skin)", kcal: 165, protein: 31, defaultGrams: 180, aliases: ["poulet", "blanc de poulet"] },
  { id: "chicken-b-r",    name: "Chicken breast (raw)",       kcal: 120, protein: 23,  defaultGrams: 200 },
  { id: "chicken-th-c",   name: "Chicken thigh (cooked, no skin)", kcal: 209, protein: 26, defaultGrams: 150 },
  { id: "chicken-roast",  name: "Roast chicken (with skin)",  kcal: 239, protein: 27,  defaultGrams: 150 },

  // ---- fish / canned ----
  { id: "tuna-w",         name: "Tuna in water (drained)",    kcal: 116, protein: 26,  defaultGrams: 100, aliases: ["thon"] },
  { id: "tuna-o",         name: "Tuna in oil (drained)",      kcal: 198, protein: 29,  defaultGrams: 100 },
  { id: "sardines-w",     name: "Sardines in water (drained)", kcal: 124, protein: 22, defaultGrams: 100, aliases: ["sardine"] },
  { id: "sardines-o",     name: "Sardines in oil (drained)",  kcal: 208, protein: 25,  defaultGrams: 100 },
  { id: "salmon-c",       name: "Salmon (cooked)",            kcal: 208, protein: 22,  defaultGrams: 150, aliases: ["saumon"] },
  { id: "white-fish",     name: "White fish (cooked)",        kcal: 108, protein: 22,  defaultGrams: 150 },
  { id: "mackerel",       name: "Mackerel (cooked)",          kcal: 262, protein: 24,  defaultGrams: 150 },

  // ---- red meat ----
  { id: "beef-lean",      name: "Lean beef (cooked)",         kcal: 217, protein: 31,  defaultGrams: 150, aliases: ["boeuf"] },
  { id: "lamb-lean",      name: "Lean lamb (cooked)",         kcal: 206, protein: 28,  defaultGrams: 150, aliases: ["agneau"] },
  { id: "ground-beef",    name: "Ground beef 90% lean (cooked)", kcal: 196, protein: 26, defaultGrams: 150 },

  // ---- eggs ----
  { id: "egg-whole",      name: "Egg, whole (1 large = 50 g)", kcal: 155, protein: 13, defaultGrams: 50, aliases: ["oeuf"] },
  { id: "egg-white",      name: "Egg white (1 large = 33 g)", kcal: 52,  protein: 11,  defaultGrams: 33 },

  // ---- dairy / cheese (hard cheese is IBS-safe) ----
  { id: "cheddar",        name: "Cheddar cheese",             kcal: 402, protein: 25,  defaultGrams: 30, aliases: ["fromage"] },
  { id: "mozzarella",     name: "Mozzarella",                 kcal: 280, protein: 22,  defaultGrams: 30 },
  { id: "hard-cheese",    name: "Hard / aged cheese (generic)", kcal: 370, protein: 25, defaultGrams: 30, aliases: ["jben", "fromage dur"] },
  { id: "feta",           name: "Feta",                       kcal: 264, protein: 14,  defaultGrams: 30 },

  // ---- protein supplements ----
  { id: "whey-scoop",     name: "Whey protein (1 scoop ≈ 30 g)", kcal: 110, protein: 27, defaultGrams: 30, aliases: ["protein", "iso", "whey iso"] },

  // ---- vegetables ----
  { id: "carrot",         name: "Carrots",                    kcal: 41,  protein: 0.9, defaultGrams: 100, aliases: ["carotte"] },
  { id: "zucchini",       name: "Zucchini / courgette",       kcal: 17,  protein: 1.2, defaultGrams: 150, aliases: ["courgette"] },
  { id: "cucumber",       name: "Cucumber",                   kcal: 16,  protein: 0.7, defaultGrams: 150, aliases: ["concombre"] },
  { id: "tomato",         name: "Tomato",                     kcal: 18,  protein: 0.9, defaultGrams: 120, aliases: ["tomate"] },
  { id: "lettuce",        name: "Lettuce",                    kcal: 15,  protein: 1.4, defaultGrams: 50, aliases: ["salade"] },
  { id: "bell-pepper",    name: "Bell pepper",                kcal: 31,  protein: 1.0, defaultGrams: 100, aliases: ["poivron"] },
  { id: "green-beans",    name: "Green beans",                kcal: 35,  protein: 1.8, defaultGrams: 100, aliases: ["haricots verts"] },
  { id: "eggplant",       name: "Eggplant / aubergine",       kcal: 25,  protein: 1.0, defaultGrams: 150, aliases: ["aubergine"] },
  { id: "spinach",        name: "Spinach",                    kcal: 23,  protein: 2.9, defaultGrams: 100, aliases: ["epinard"] },

  // ---- fruits ----
  { id: "banana",         name: "Banana (1 medium ≈ 118 g)",  kcal: 89,  protein: 1.1, defaultGrams: 118 },
  { id: "apple",          name: "Apple (1 medium ≈ 182 g)",   kcal: 52,  protein: 0.3, defaultGrams: 182, aliases: ["pomme"] },
  { id: "orange",         name: "Orange (1 medium ≈ 131 g)",  kcal: 47,  protein: 0.9, defaultGrams: 131 },
  { id: "clementine",     name: "Clementine (1 ≈ 74 g)",      kcal: 47,  protein: 0.9, defaultGrams: 74 },
  { id: "dates",          name: "Dates",                      kcal: 282, protein: 2.5, defaultGrams: 30, aliases: ["tmar"] },
  { id: "grapes",         name: "Grapes",                     kcal: 69,  protein: 0.7, defaultGrams: 100, aliases: ["raisin"] },
  { id: "watermelon",     name: "Watermelon",                 kcal: 30,  protein: 0.6, defaultGrams: 200, aliases: ["pasteque"] },

  // ---- nuts / fats / oils ----
  { id: "almonds",        name: "Almonds",                    kcal: 579, protein: 21,  defaultGrams: 30, aliases: ["amandes", "louz"] },
  { id: "peanuts",        name: "Peanuts",                    kcal: 567, protein: 26,  defaultGrams: 30, aliases: ["cacahuetes"] },
  { id: "olive-oil",      name: "Olive oil (1 tbsp ≈ 14 g)",  kcal: 884, protein: 0,   defaultGrams: 14, aliases: ["huile d'olive", "zit"] },
  { id: "butter",         name: "Butter",                     kcal: 717, protein: 0.9, defaultGrams: 14, aliases: ["beurre"] },

  // ---- drinks (only the ones that have calories) ----
  { id: "soda",           name: "Soda (cola, regular)",       kcal: 42,  protein: 0,   defaultGrams: 330, aliases: ["coca"] },
  { id: "oj",             name: "Orange juice",               kcal: 45,  protein: 0.7, defaultGrams: 250, aliases: ["jus d'orange"] },
  { id: "energy-drink",   name: "Energy drink (regular)",     kcal: 45,  protein: 0,   defaultGrams: 250 },

  // ---- common Algerian dishes (rough averages — best estimate) ----
  { id: "harira",         name: "Harira soup",                kcal: 80,  protein: 5,   defaultGrams: 300 },
  { id: "tajine-chicken", name: "Chicken tajine",             kcal: 150, protein: 15,  defaultGrams: 300, aliases: ["tagine"] },
  { id: "couscous-dish",  name: "Couscous w/ meat & veg",     kcal: 165, protein: 9,   defaultGrams: 350 },
  { id: "shakshuka",      name: "Shakshuka",                  kcal: 110, protein: 7,   defaultGrams: 250 },
];

/**
 * Substring match against name + aliases (case-insensitive).
 * @param {string} query
 * @param {number} [limit=8]
 * @returns {Array<typeof FOOD_DB[0]>}
 */
export function searchLocal(query, limit = 8) {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  for (const item of FOOD_DB) {
    const hay = (item.name + " " + (item.aliases || []).join(" ")).toLowerCase();
    if (hay.includes(q)) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}
