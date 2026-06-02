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

  // ---- more fruits ----
  { id: "peach",          name: "Peach (1 medium ≈ 150 g)",   kcal: 39,  protein: 0.9, defaultGrams: 150, aliases: ["peche", "khoukh"] },
  { id: "pear",           name: "Pear (1 medium ≈ 178 g)",    kcal: 57,  protein: 0.4, defaultGrams: 178, aliases: ["poire"] },
  { id: "plum",           name: "Plum (1 ≈ 66 g)",            kcal: 46,  protein: 0.7, defaultGrams: 66,  aliases: ["prune"] },
  { id: "apricot",        name: "Apricot (1 ≈ 35 g)",         kcal: 48,  protein: 1.4, defaultGrams: 35,  aliases: ["abricot", "mechmach"] },
  { id: "cherries",       name: "Cherries",                   kcal: 50,  protein: 1.0, defaultGrams: 100, aliases: ["cerises"] },
  { id: "strawberry",     name: "Strawberries",               kcal: 32,  protein: 0.7, defaultGrams: 150, aliases: ["fraise"] },
  { id: "blueberry",      name: "Blueberries",                kcal: 57,  protein: 0.7, defaultGrams: 100, aliases: ["myrtille"] },
  { id: "raspberry",      name: "Raspberries",                kcal: 52,  protein: 1.2, defaultGrams: 100, aliases: ["framboise"] },
  { id: "blackberry",     name: "Blackberries",               kcal: 43,  protein: 1.4, defaultGrams: 100, aliases: ["mure"] },
  { id: "kiwi",           name: "Kiwi (1 ≈ 76 g)",            kcal: 61,  protein: 1.1, defaultGrams: 76 },
  { id: "mango",          name: "Mango",                      kcal: 60,  protein: 0.8, defaultGrams: 165, aliases: ["mangue"] },
  { id: "pineapple",      name: "Pineapple",                  kcal: 50,  protein: 0.5, defaultGrams: 165, aliases: ["ananas"] },
  { id: "papaya",         name: "Papaya",                     kcal: 43,  protein: 0.5, defaultGrams: 145 },
  { id: "cantaloupe",     name: "Cantaloupe / melon",         kcal: 34,  protein: 0.8, defaultGrams: 160, aliases: ["melon"] },
  { id: "fig",            name: "Fig (1 ≈ 50 g)",             kcal: 74,  protein: 0.8, defaultGrams: 50,  aliases: ["figue", "karmous"] },
  { id: "pomegranate",    name: "Pomegranate",                kcal: 83,  protein: 1.7, defaultGrams: 150, aliases: ["grenade", "roman"] },
  { id: "grapefruit",     name: "Grapefruit (1/2 ≈ 123 g)",   kcal: 42,  protein: 0.8, defaultGrams: 123, aliases: ["pamplemousse"] },
  { id: "lemon",          name: "Lemon (1 ≈ 58 g)",           kcal: 29,  protein: 1.1, defaultGrams: 58,  aliases: ["citron"] },
  { id: "lime",           name: "Lime",                       kcal: 30,  protein: 0.7, defaultGrams: 50 },
  { id: "persimmon",      name: "Persimmon",                  kcal: 70,  protein: 0.6, defaultGrams: 168, aliases: ["kaki"] },
  { id: "coconut",        name: "Coconut (flesh)",            kcal: 354, protein: 3.3, defaultGrams: 80,  aliases: ["noix de coco"] },
  { id: "avocado",        name: "Avocado (1/2 ≈ 100 g)",      kcal: 160, protein: 2.0, defaultGrams: 100, aliases: ["avocat"] },
  { id: "prickly-pear",   name: "Prickly pear (sabra)",       kcal: 41,  protein: 0.7, defaultGrams: 100, aliases: ["sabra", "karmous nasara", "figue de barbarie"] },
  { id: "mandarin",       name: "Mandarin",                   kcal: 53,  protein: 0.8, defaultGrams: 100, aliases: ["mandarine"] },

  // ---- more vegetables ----
  { id: "broccoli",       name: "Broccoli",                   kcal: 34,  protein: 2.8, defaultGrams: 150, aliases: ["brocoli"] },
  { id: "cauliflower",    name: "Cauliflower",                kcal: 25,  protein: 1.9, defaultGrams: 150, aliases: ["chou-fleur"] },
  { id: "cabbage",        name: "Cabbage",                    kcal: 25,  protein: 1.3, defaultGrams: 100, aliases: ["chou"] },
  { id: "kale",           name: "Kale",                       kcal: 49,  protein: 4.3, defaultGrams: 100 },
  { id: "asparagus",      name: "Asparagus",                  kcal: 20,  protein: 2.2, defaultGrams: 100, aliases: ["asperge"] },
  { id: "beet",           name: "Beetroot",                   kcal: 43,  protein: 1.6, defaultGrams: 100, aliases: ["betterave"] },
  { id: "sweet-corn",     name: "Sweet corn",                 kcal: 86,  protein: 3.2, defaultGrams: 150, aliases: ["mais"] },
  { id: "peas",           name: "Green peas (cooked)",        kcal: 81,  protein: 5.4, defaultGrams: 100, aliases: ["petits pois"] },
  { id: "mushroom",       name: "Mushrooms",                  kcal: 22,  protein: 3.1, defaultGrams: 100, aliases: ["champignon"] },
  { id: "leek",           name: "Leek",                       kcal: 61,  protein: 1.5, defaultGrams: 100, aliases: ["poireau"] },
  { id: "artichoke",      name: "Artichoke",                  kcal: 47,  protein: 3.3, defaultGrams: 120, aliases: ["artichaut"] },
  { id: "okra",           name: "Okra (mloukhia)",            kcal: 33,  protein: 1.9, defaultGrams: 100, aliases: ["mloukhia", "gombo"] },
  { id: "pumpkin",        name: "Pumpkin",                    kcal: 26,  protein: 1.0, defaultGrams: 150, aliases: ["citrouille", "potiron"] },
  { id: "butternut",      name: "Butternut squash",           kcal: 45,  protein: 1.0, defaultGrams: 150 },
  { id: "celery",         name: "Celery",                     kcal: 16,  protein: 0.7, defaultGrams: 100, aliases: ["celeri"] },
  { id: "brussels",       name: "Brussels sprouts",           kcal: 43,  protein: 3.4, defaultGrams: 100, aliases: ["choux de bruxelles"] },

  // ---- chocolate, sweets, desserts ----
  { id: "dark-choc",      name: "Dark chocolate (70%)",       kcal: 600, protein: 8,   defaultGrams: 25,  aliases: ["chocolat noir"] },
  { id: "milk-choc",      name: "Milk chocolate",             kcal: 535, protein: 7.6, defaultGrams: 25,  aliases: ["chocolat au lait"] },
  { id: "white-choc",     name: "White chocolate",            kcal: 539, protein: 6,   defaultGrams: 25,  aliases: ["chocolat blanc"] },
  { id: "snickers",       name: "Snickers bar (1 = 52 g)",    kcal: 488, protein: 8.7, defaultGrams: 52 },
  { id: "mars-bar",       name: "Mars bar (1 = 51 g)",        kcal: 449, protein: 4.7, defaultGrams: 51 },
  { id: "twix",           name: "Twix (1 = 50 g)",            kcal: 502, protein: 5,   defaultGrams: 50 },
  { id: "bounty",         name: "Bounty (1 = 57 g)",          kcal: 491, protein: 4.4, defaultGrams: 57 },
  { id: "kitkat",         name: "Kit Kat (4 fingers = 45 g)", kcal: 518, protein: 6.7, defaultGrams: 45, aliases: ["kit kat"] },
  { id: "kinder-bueno",   name: "Kinder Bueno (1 = 43 g)",    kcal: 558, protein: 8.6, defaultGrams: 43 },
  { id: "nutella",        name: "Nutella",                    kcal: 539, protein: 6.3, defaultGrams: 20 },
  { id: "choc-cookie",    name: "Chocolate chip cookie (1 ≈ 30 g)", kcal: 502, protein: 6.4, defaultGrams: 30 },
  { id: "brownie",        name: "Brownie",                    kcal: 466, protein: 6,   defaultGrams: 60 },
  { id: "choc-cake",      name: "Chocolate cake",             kcal: 371, protein: 4.3, defaultGrams: 100, aliases: ["gateau au chocolat"] },
  { id: "ice-cream-v",    name: "Ice cream (vanilla)",        kcal: 207, protein: 3.5, defaultGrams: 100, aliases: ["glace", "creme glacee"] },
  { id: "ice-cream-c",    name: "Ice cream (chocolate)",      kcal: 216, protein: 3.8, defaultGrams: 100 },
  { id: "donut",          name: "Donut (1 ≈ 60 g)",           kcal: 452, protein: 4.9, defaultGrams: 60, aliases: ["beignet", "doughnut"] },
  { id: "croissant",      name: "Croissant (1 ≈ 57 g)",       kcal: 406, protein: 8.2, defaultGrams: 57 },
  { id: "pain-choc",      name: "Pain au chocolat (1 ≈ 70 g)",kcal: 414, protein: 7,   defaultGrams: 70, aliases: ["chocolatine"] },
  { id: "baklava",        name: "Baklava (1 piece ≈ 50 g)",   kcal: 428, protein: 6.8, defaultGrams: 50 },
  { id: "sponge-cake",    name: "Sponge cake",                kcal: 297, protein: 4.4, defaultGrams: 100, aliases: ["gateau"] },
  { id: "cheesecake",     name: "Cheesecake",                 kcal: 321, protein: 5.5, defaultGrams: 100 },
  { id: "gummy-bears",    name: "Gummy bears",                kcal: 318, protein: 6.9, defaultGrams: 30, aliases: ["bonbons"] },
  { id: "hard-candy",     name: "Hard candy",                 kcal: 394, protein: 0,   defaultGrams: 20 },
  { id: "milkshake-c",    name: "Milkshake (chocolate)",      kcal: 119, protein: 3.6, defaultGrams: 350 },

  // ---- soups ----
  { id: "soup-chick",     name: "Chicken noodle soup",        kcal: 38,  protein: 2.6, defaultGrams: 300, aliases: ["soupe poulet"] },
  { id: "soup-tomato",    name: "Tomato soup",                kcal: 42,  protein: 1.2, defaultGrams: 300, aliases: ["soupe tomate"] },
  { id: "soup-veg",       name: "Vegetable soup",             kcal: 25,  protein: 1.5, defaultGrams: 300, aliases: ["soupe legumes"] },
  { id: "soup-mush",      name: "Mushroom soup (creamy)",     kcal: 56,  protein: 2.1, defaultGrams: 300 },
  { id: "miso-soup",      name: "Miso soup",                  kcal: 35,  protein: 2.2, defaultGrams: 250 },
  { id: "lentil-soup",    name: "Lentil soup",                kcal: 57,  protein: 4.3, defaultGrams: 300 },
  { id: "fr-onion-soup",  name: "French onion soup",          kcal: 38,  protein: 1.6, defaultGrams: 300, aliases: ["soupe oignon"] },
  { id: "minestrone",     name: "Minestrone",                 kcal: 30,  protein: 1.8, defaultGrams: 300 },
  { id: "pho",            name: "Pho (Vietnamese)",           kcal: 80,  protein: 6,   defaultGrams: 400 },
  { id: "chorba",         name: "Chorba (Algerian)",          kcal: 75,  protein: 5,   defaultGrams: 300, aliases: ["chorba frik"] },

  // ---- pizza / burger / sandwich / fast food ----
  { id: "pizza-margh",    name: "Pizza Margherita",           kcal: 270, protein: 11,  defaultGrams: 150, aliases: ["pizza"] },
  { id: "pizza-pep",      name: "Pizza pepperoni",            kcal: 296, protein: 13,  defaultGrams: 150 },
  { id: "pizza-cheese",   name: "Pizza cheese (4-fromages)",  kcal: 280, protein: 12,  defaultGrams: 150, aliases: ["quatre fromages"] },
  { id: "cheeseburger",   name: "Cheeseburger",               kcal: 254, protein: 13,  defaultGrams: 150 },
  { id: "hamburger",      name: "Hamburger",                  kcal: 250, protein: 13,  defaultGrams: 150 },
  { id: "big-burger",     name: "Big burger (Big Mac size)",  kcal: 245, protein: 11,  defaultGrams: 220 },
  { id: "chicken-burger", name: "Chicken burger",             kcal: 235, protein: 14,  defaultGrams: 180 },
  { id: "hot-dog",        name: "Hot dog (1 ≈ 80 g)",         kcal: 363, protein: 12.5, defaultGrams: 80 },
  { id: "wrap-chick",     name: "Chicken wrap",               kcal: 220, protein: 13,  defaultGrams: 220 },
  { id: "kebab",          name: "Kebab / döner",              kcal: 215, protein: 13,  defaultGrams: 300 },
  { id: "shawarma",       name: "Shawarma (chicken)",         kcal: 200, protein: 12,  defaultGrams: 300 },
  { id: "falafel",        name: "Falafel (1 ball ≈ 17 g)",    kcal: 333, protein: 13,  defaultGrams: 17 },
  { id: "panini",         name: "Panini",                     kcal: 270, protein: 12,  defaultGrams: 200 },
  { id: "club-sandwich",  name: "Club sandwich",              kcal: 240, protein: 12,  defaultGrams: 250 },
  { id: "tuna-sandwich",  name: "Tuna sandwich",              kcal: 235, protein: 14,  defaultGrams: 200 },

  // ---- pasta dishes ----
  { id: "pasta-tomato",   name: "Pasta with tomato sauce",    kcal: 100, protein: 3,   defaultGrams: 250, aliases: ["pates tomate"] },
  { id: "spaghetti-bol",  name: "Spaghetti bolognese",        kcal: 134, protein: 8,   defaultGrams: 300 },
  { id: "lasagna",        name: "Lasagna",                    kcal: 132, protein: 8,   defaultGrams: 300, aliases: ["lasagne"] },
  { id: "carbonara",      name: "Pasta carbonara",            kcal: 199, protein: 7,   defaultGrams: 250 },
  { id: "mac-cheese",     name: "Mac & cheese",               kcal: 164, protein: 7,   defaultGrams: 250 },
  { id: "pasta-pesto",    name: "Pasta with pesto",           kcal: 170, protein: 6,   defaultGrams: 250 },

  // ---- Asian dishes ----
  { id: "fried-rice",     name: "Fried rice",                 kcal: 163, protein: 4,   defaultGrams: 250, aliases: ["riz frit"] },
  { id: "sushi-roll",     name: "Sushi roll",                 kcal: 131, protein: 5,   defaultGrams: 150 },
  { id: "sushi-piece",    name: "Sushi (1 piece ≈ 20 g)",     kcal: 35,  protein: 1.5, defaultGrams: 20 },
  { id: "pad-thai",       name: "Pad Thai",                   kcal: 165, protein: 6,   defaultGrams: 300 },
  { id: "chow-mein",      name: "Chow mein",                  kcal: 137, protein: 5,   defaultGrams: 300 },
  { id: "dumplings",      name: "Dumplings / gyoza",          kcal: 198, protein: 9,   defaultGrams: 100 },
  { id: "spring-roll",    name: "Spring roll (fried, 1 ≈ 50 g)", kcal: 250, protein: 6, defaultGrams: 50, aliases: ["nem"] },
  { id: "teriyaki-chick", name: "Teriyaki chicken",           kcal: 170, protein: 21,  defaultGrams: 200 },
  { id: "sweet-sour",     name: "Sweet & sour chicken",       kcal: 200, protein: 11,  defaultGrams: 250 },
  { id: "tofu",           name: "Tofu",                       kcal: 76,  protein: 8,   defaultGrams: 100 },
  { id: "ramen",          name: "Ramen (with broth)",         kcal: 60,  protein: 3,   defaultGrams: 500 },

  // ---- Indian / Middle Eastern ----
  { id: "chick-curry",    name: "Chicken curry",              kcal: 165, protein: 12,  defaultGrams: 300 },
  { id: "butter-chicken", name: "Butter chicken",             kcal: 240, protein: 14,  defaultGrams: 300 },
  { id: "biryani",        name: "Biryani",                    kcal: 175, protein: 9,   defaultGrams: 300 },
  { id: "naan",           name: "Naan bread (1 ≈ 90 g)",      kcal: 309, protein: 9,   defaultGrams: 90 },
  { id: "hummus",         name: "Hummus",                     kcal: 166, protein: 7.9, defaultGrams: 50, aliases: ["houmous"] },
  { id: "tabbouleh",      name: "Tabbouleh",                  kcal: 165, protein: 4,   defaultGrams: 150, aliases: ["taboule"] },
  { id: "fattoush",       name: "Fattoush salad",             kcal: 110, protein: 3,   defaultGrams: 200 },

  // ---- more Algerian / North-African ----
  { id: "frik",           name: "Frik soup",                  kcal: 80,  protein: 5,   defaultGrams: 300 },
  { id: "tlitli",         name: "Tlitli",                     kcal: 130, protein: 6,   defaultGrams: 300 },
  { id: "lham-lahlou",    name: "Lham lahlou (sweet lamb)",   kcal: 230, protein: 8,   defaultGrams: 250 },
  { id: "dolma",          name: "Dolma (stuffed veg)",        kcal: 150, protein: 7,   defaultGrams: 250 },
  { id: "bourek",         name: "Bourek (1 ≈ 50 g)",          kcal: 250, protein: 10,  defaultGrams: 50, aliases: ["brik"] },
  { id: "kefta",          name: "Kefta (meatballs)",          kcal: 250, protein: 18,  defaultGrams: 150, aliases: ["boulettes"] },
  { id: "merguez",        name: "Merguez sausage (1 ≈ 50 g)", kcal: 290, protein: 14,  defaultGrams: 50 },
  { id: "makroud",        name: "Makroud (sweet)",            kcal: 380, protein: 5,   defaultGrams: 50 },
  { id: "samsa",          name: "Samsa (sweet)",              kcal: 410, protein: 6,   defaultGrams: 50 },
  { id: "mhajeb",         name: "Mhajeb (1 ≈ 150 g)",         kcal: 250, protein: 6,   defaultGrams: 150 },
  { id: "msemmen",        name: "Msemmen (1 ≈ 100 g)",        kcal: 280, protein: 6,   defaultGrams: 100, aliases: ["rghaif"] },
  { id: "matlou",         name: "Matlou (Algerian flatbread)", kcal: 270, protein: 8.5, defaultGrams: 80 },
  { id: "mahjouba",       name: "Mahjouba (stuffed crepe)",   kcal: 240, protein: 6,   defaultGrams: 150 },

  // ---- breakfast ----
  { id: "cornflakes",     name: "Cornflakes",                 kcal: 378, protein: 7.5, defaultGrams: 30 },
  { id: "granola",        name: "Granola",                    kcal: 471, protein: 10,  defaultGrams: 50 },
  { id: "muesli",         name: "Muesli",                     kcal: 354, protein: 9.7, defaultGrams: 50 },
  { id: "weetabix",       name: "Weetabix (2 biscuits ≈ 37 g)", kcal: 358, protein: 11, defaultGrams: 37 },
  { id: "pancake",        name: "Pancake (1 ≈ 38 g)",         kcal: 227, protein: 6,   defaultGrams: 38, aliases: ["crepe"] },
  { id: "waffle",         name: "Waffle (1 ≈ 33 g)",          kcal: 291, protein: 7,   defaultGrams: 33, aliases: ["gaufre"] },
  { id: "french-toast",   name: "French toast (1 slice ≈ 65 g)", kcal: 229, protein: 7.5, defaultGrams: 65, aliases: ["pain perdu"] },
  { id: "scrambled-eggs", name: "Scrambled eggs (2 eggs)",    kcal: 166, protein: 11,  defaultGrams: 110 },
  { id: "omelette",       name: "Omelette (plain, 2 eggs)",   kcal: 154, protein: 11,  defaultGrams: 110 },
  { id: "bagel",          name: "Bagel (1 ≈ 95 g)",           kcal: 254, protein: 10,  defaultGrams: 95 },

  // ---- snacks ----
  { id: "chips-potato",   name: "Potato chips",               kcal: 536, protein: 7,   defaultGrams: 30, aliases: ["crisps"] },
  { id: "tortilla-chips", name: "Tortilla chips",             kcal: 489, protein: 7,   defaultGrams: 30 },
  { id: "doritos",        name: "Doritos / nacho chips",      kcal: 498, protein: 7,   defaultGrams: 30 },
  { id: "pretzels",       name: "Pretzels",                   kcal: 380, protein: 10,  defaultGrams: 30, aliases: ["bretzel"] },
  { id: "popcorn",        name: "Popcorn (plain, popped)",    kcal: 387, protein: 12,  defaultGrams: 40 },
  { id: "popcorn-but",    name: "Popcorn (buttered)",         kcal: 446, protein: 7,   defaultGrams: 40 },
  { id: "crackers",       name: "Crackers (saltines)",        kcal: 421, protein: 9,   defaultGrams: 30 },
  { id: "digestive",      name: "Digestive biscuit (1 ≈ 15 g)", kcal: 472, protein: 6.7, defaultGrams: 15, aliases: ["biscuit"] },
  { id: "energy-bar",     name: "Energy bar (generic)",       kcal: 380, protein: 10,  defaultGrams: 50 },
  { id: "granola-bar",    name: "Granola bar",                kcal: 462, protein: 9,   defaultGrams: 40 },
  { id: "mixed-nuts",     name: "Mixed nuts",                 kcal: 607, protein: 19,  defaultGrams: 30 },
  { id: "sunflower-seeds",name: "Sunflower seeds",            kcal: 584, protein: 21,  defaultGrams: 30, aliases: ["zriaa"] },
  { id: "pumpkin-seeds",  name: "Pumpkin seeds",              kcal: 559, protein: 30,  defaultGrams: 30 },
  { id: "raisins",        name: "Raisins",                    kcal: 299, protein: 3,   defaultGrams: 30, aliases: ["zbib"] },
  { id: "trail-mix",      name: "Trail mix",                  kcal: 462, protein: 14,  defaultGrams: 40 },

  // ---- dairy / yogurt (note: high lactose — Taha avoids) ----
  { id: "yogurt-plain",   name: "Yogurt (plain)",             kcal: 59,  protein: 3.5, defaultGrams: 150, aliases: ["yaourt"] },
  { id: "yogurt-fruit",   name: "Yogurt (fruit)",             kcal: 95,  protein: 3.5, defaultGrams: 150 },
  { id: "greek-yogurt",   name: "Greek yogurt",               kcal: 73,  protein: 10,  defaultGrams: 150 },
  { id: "cottage-cheese", name: "Cottage cheese",             kcal: 98,  protein: 11,  defaultGrams: 100 },
  { id: "milk-whole",     name: "Whole milk",                 kcal: 61,  protein: 3.2, defaultGrams: 250, aliases: ["lait entier"] },
  { id: "milk-skim",      name: "Skim milk",                  kcal: 35,  protein: 3.4, defaultGrams: 250 },
  { id: "cream-heavy",    name: "Cream (heavy)",              kcal: 340, protein: 2.8, defaultGrams: 30, aliases: ["creme"] },

  // ---- more cheeses ----
  { id: "parmesan",       name: "Parmesan",                   kcal: 431, protein: 38,  defaultGrams: 15 },
  { id: "brie",           name: "Brie",                       kcal: 334, protein: 21,  defaultGrams: 30 },
  { id: "camembert",      name: "Camembert",                  kcal: 300, protein: 20,  defaultGrams: 30 },
  { id: "cream-cheese",   name: "Cream cheese",               kcal: 342, protein: 6,   defaultGrams: 30 },
  { id: "ricotta",        name: "Ricotta",                    kcal: 174, protein: 11,  defaultGrams: 50 },

  // ---- drinks (with calories) ----
  { id: "coffee-black",   name: "Coffee (black)",             kcal: 1,   protein: 0,   defaultGrams: 240, aliases: ["cafe noir"] },
  { id: "coffee-milk",    name: "Coffee with milk",           kcal: 32,  protein: 1.7, defaultGrams: 240, aliases: ["cafe au lait"] },
  { id: "latte",          name: "Caffè latte",                kcal: 60,  protein: 3,   defaultGrams: 240 },
  { id: "cappuccino",     name: "Cappuccino",                 kcal: 56,  protein: 3,   defaultGrams: 240 },
  { id: "sprite",         name: "Sprite / 7Up",               kcal: 38,  protein: 0,   defaultGrams: 330 },
  { id: "lemonade",       name: "Lemonade",                   kcal: 40,  protein: 0,   defaultGrams: 330 },
  { id: "apple-juice",    name: "Apple juice",                kcal: 46,  protein: 0.1, defaultGrams: 250 },
  { id: "mango-juice",    name: "Mango juice",                kcal: 54,  protein: 0.4, defaultGrams: 250 },
  { id: "milkshake-v",    name: "Milkshake (vanilla)",        kcal: 112, protein: 3.4, defaultGrams: 350 },
  { id: "smoothie",       name: "Fruit smoothie",             kcal: 50,  protein: 1.5, defaultGrams: 350 },
  { id: "beer",           name: "Beer (regular)",             kcal: 43,  protein: 0.5, defaultGrams: 330 },
  { id: "red-wine",       name: "Red wine",                   kcal: 85,  protein: 0.1, defaultGrams: 150, aliases: ["vin rouge"] },
  { id: "white-wine",     name: "White wine",                 kcal: 82,  protein: 0.1, defaultGrams: 150, aliases: ["vin blanc"] },
  { id: "hot-chocolate",  name: "Hot chocolate",              kcal: 77,  protein: 3.5, defaultGrams: 250, aliases: ["chocolat chaud"] },
  { id: "iced-tea",       name: "Iced tea (sweetened)",       kcal: 30,  protein: 0,   defaultGrams: 330 },

  // ---- condiments / sauces / sugars ----
  { id: "ketchup",        name: "Ketchup",                    kcal: 112, protein: 1.7, defaultGrams: 15 },
  { id: "mayo",           name: "Mayonnaise",                 kcal: 680, protein: 1,   defaultGrams: 15, aliases: ["mayonnaise"] },
  { id: "mustard",        name: "Mustard",                    kcal: 66,  protein: 4.4, defaultGrams: 10, aliases: ["moutarde"] },
  { id: "bbq-sauce",      name: "BBQ sauce",                  kcal: 172, protein: 0.8, defaultGrams: 15 },
  { id: "hot-sauce",      name: "Hot sauce",                  kcal: 7,   protein: 1,   defaultGrams: 5,  aliases: ["harissa"] },
  { id: "soy-sauce",      name: "Soy sauce",                  kcal: 53,  protein: 8,   defaultGrams: 10 },
  { id: "honey",          name: "Honey",                      kcal: 304, protein: 0.3, defaultGrams: 20, aliases: ["miel", "asal"] },
  { id: "sugar",          name: "Sugar (white)",              kcal: 387, protein: 0,   defaultGrams: 4,  aliases: ["sucre"] },
  { id: "jam-strawberry", name: "Jam (strawberry)",           kcal: 250, protein: 0.4, defaultGrams: 20, aliases: ["confiture"] },
  { id: "peanut-butter",  name: "Peanut butter",              kcal: 588, protein: 25,  defaultGrams: 30, aliases: ["beurre cacahuete"] },
  { id: "tahini",         name: "Tahini (sesame paste)",      kcal: 595, protein: 17,  defaultGrams: 15, aliases: ["tehina"] },

  // ---- more proteins (deli, processed, seafood) ----
  { id: "bacon",          name: "Bacon (cooked)",             kcal: 541, protein: 37,  defaultGrams: 25 },
  { id: "sausage-pork",   name: "Sausage (pork)",             kcal: 301, protein: 13,  defaultGrams: 80, aliases: ["saucisse"] },
  { id: "ham",            name: "Ham (deli)",                 kcal: 145, protein: 21,  defaultGrams: 50, aliases: ["jambon"] },
  { id: "salami",         name: "Salami",                     kcal: 372, protein: 22,  defaultGrams: 30 },
  { id: "turkey-breast",  name: "Turkey breast (cooked)",     kcal: 135, protein: 30,  defaultGrams: 150, aliases: ["dinde"] },
  { id: "nuggets",        name: "Chicken nuggets",            kcal: 297, protein: 14,  defaultGrams: 100 },
  { id: "fish-sticks",    name: "Fish sticks / fingers",      kcal: 240, protein: 14,  defaultGrams: 100 },
  { id: "shrimp",         name: "Shrimp (cooked)",            kcal: 99,  protein: 24,  defaultGrams: 100, aliases: ["crevette"] },
  { id: "calamari",       name: "Calamari (fried)",           kcal: 175, protein: 15,  defaultGrams: 100, aliases: ["calmar"] },
  { id: "octopus",        name: "Octopus (cooked)",           kcal: 164, protein: 30,  defaultGrams: 100, aliases: ["poulpe"] },
  { id: "anchovy",        name: "Anchovy (canned)",           kcal: 210, protein: 29,  defaultGrams: 30, aliases: ["anchois"] },
  { id: "smoked-salmon",  name: "Smoked salmon",              kcal: 117, protein: 18,  defaultGrams: 50 },

  // ---- legumes (Taha avoids — IBS — but adding for completeness) ----
  { id: "lentils-c",      name: "Lentils (cooked)",           kcal: 116, protein: 9,   defaultGrams: 150, aliases: ["lentilles", "adas"] },
  { id: "chickpeas-c",    name: "Chickpeas (cooked)",         kcal: 164, protein: 8.9, defaultGrams: 150, aliases: ["pois chiches", "hommos"] },
  { id: "kidney-beans",   name: "Kidney beans (cooked)",      kcal: 127, protein: 8.7, defaultGrams: 150, aliases: ["haricots rouges"] },
  { id: "white-beans",    name: "White beans (cooked)",       kcal: 139, protein: 9.7, defaultGrams: 150, aliases: ["haricots blancs"] },
  { id: "black-beans",    name: "Black beans (cooked)",       kcal: 132, protein: 8.9, defaultGrams: 150 },
  { id: "fava-beans",     name: "Fava beans (cooked)",        kcal: 110, protein: 7.6, defaultGrams: 150, aliases: ["feves", "ful"] },
  { id: "edamame",        name: "Edamame",                    kcal: 121, protein: 11,  defaultGrams: 100 },

  // ---- more grains ----
  { id: "quinoa",         name: "Quinoa (cooked)",            kcal: 120, protein: 4.4, defaultGrams: 200 },
  { id: "bulgur",         name: "Bulgur (cooked)",            kcal: 83,  protein: 3.1, defaultGrams: 150 },
  { id: "barley",         name: "Barley (cooked)",            kcal: 123, protein: 2.3, defaultGrams: 150, aliases: ["orge", "frik"] },
  { id: "buckwheat",      name: "Buckwheat (cooked)",         kcal: 92,  protein: 3.4, defaultGrams: 150 },

  // ---- existing Algerian dishes (kept) ----
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
