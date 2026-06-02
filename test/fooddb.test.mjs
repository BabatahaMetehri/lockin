import assert from "node:assert/strict";
import { FOOD_DB, searchLocal } from "../js/fooddb.js";

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("  ok -", name); };

console.log("fooddb.test.mjs");

t("DB has entries and shape is right", () => {
  assert.ok(FOOD_DB.length >= 40, `only ${FOOD_DB.length} foods`);
  for (const f of FOOD_DB) {
    assert.ok(f.id && f.name && typeof f.kcal === "number" && typeof f.protein === "number", "bad food: " + JSON.stringify(f));
  }
});

t("'ri' finds rice variants", () => {
  const hits = searchLocal("ri");
  const names = hits.map((h) => h.name);
  assert.ok(names.some((n) => /white rice/i.test(n)));
  assert.ok(names.some((n) => /brown rice/i.test(n)));
});

t("case-insensitive + alias match (poulet -> chicken)", () => {
  const hits = searchLocal("POULET");
  assert.ok(hits.some((h) => /chicken/i.test(h.name)));
});

t("empty query returns nothing", () => {
  assert.deepEqual(searchLocal(""), []);
  assert.deepEqual(searchLocal("   "), []);
});

t("respects limit", () => {
  assert.ok(searchLocal("e", 3).length <= 3);
});

console.log(`PASSED ${pass} fooddb tests\n`);
