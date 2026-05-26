/* ============================================================
   meals.js — full plan, step-by-step recipes, grocery checklist.
   ============================================================ */
import { el, card, pageHead, collapse } from "../ui.js";
import { toggleGrocery, getState } from "../store.js";
import {
  TARGETS, EATING_WINDOW, LUNCHES, DINNERS, SNACK, DAILY_EXTRAS,
  RECIPE_BASICS, GROCERY, SEASONING_RULES, EXCLUDED_FOODS, MEAL_PREP, BUDGET_NOTE,
} from "../data.js";

export function renderMeals(root) {
  root.appendChild(pageHead("Meals", "Pre-decided · cheap · IBS-safe"));

  // budget note
  root.appendChild(card('💸 <span class="tag">Eat cheap</span>', [el("p", { text: BUDGET_NOTE })]));

  // ---- BATCH MEAL PREP (cook once) ----
  const prep = card('🧊 <span class="tag">PREP DAY — cook once, eat all week</span>', []);
  prep.appendChild(el("p", { text: MEAL_PREP.intro }));
  const batchBody = el("div");
  MEAL_PREP.batch.forEach((b) => batchBody.appendChild(el("div", { style: "padding:8px 0;border-bottom:1px solid var(--line)" }, [
    el("div", { html: `<b>${b.item}</b> — ${b.cook}` }),
    el("div.sub", { html: `<span class="accent">${b.yields}</span> · store: ${b.store}`, style: "font-size:.8rem;color:var(--muted)" }),
  ])));
  prep.appendChild(collapse("📦 Batch quantities & storage", batchBody, true));
  const stepsBody = el("ol.recipe", {}, MEAL_PREP.prepDay.map((st) => el("li", { text: st })));
  prep.appendChild(collapse("👨‍🍳 The prep-day order (do it in one go)", stepsBody, false));
  const ruleBody = el("ul", {}, MEAL_PREP.storage.map((r) => el("li", { text: r, style: "margin-bottom:4px" })));
  prep.appendChild(collapse("🧪 Storage & food-safety rules", ruleBody, false));
  prep.appendChild(el("p.note", { text: MEAL_PREP.containers, style: "margin-top:10px" }));
  root.appendChild(prep);

  // targets
  root.appendChild(card('🎯 <span class="tag">Daily target</span>', [
    el("div.stat-row", {}, [
      el("div.stat", {}, [el("div.v lime", { text: TARGETS.kcal }), el("div.k", { text: "kcal" })]),
      el("div.stat", {}, [el("div.v lime", { text: TARGETS.proteinG + "g" }), el("div.k", { text: "protein" })]),
      el("div.stat", {}, [el("div.v", { text: TARGETS.carbsG + "g" }), el("div.k", { text: "carbs" })]),
      el("div.stat", {}, [el("div.v", { text: TARGETS.fatG + "g" }), el("div.k", { text: "fat" })]),
    ]),
    el("p.muted", { text: EATING_WINDOW.note, style: "font-size:.85rem;margin-bottom:0" }),
  ]));

  // lunches
  const lunchCard = card('🍗 <span class="tag">Meal 1 — Lunch (pick one)</span>', []);
  LUNCHES.forEach((m) => lunchCard.appendChild(recipeBlock(m)));
  root.appendChild(lunchCard);

  // snack
  const snackCard = card('🥤 <span class="tag">Snack — 16:00</span>', []);
  snackCard.appendChild(recipeBlock(SNACK));
  root.appendChild(snackCard);

  // dinners
  const dinnerCard = card('🍳 <span class="tag">Meal 2 — Dinner (pick one)</span>', []);
  DINNERS.forEach((m) => dinnerCard.appendChild(recipeBlock(m)));
  root.appendChild(dinnerCard);

  // extras + basics + rules
  root.appendChild(card('➕ <span class="tag">Daily top-up</span>', [el("p", { text: DAILY_EXTRAS })]));

  const basicsBody = el("div");
  RECIPE_BASICS.forEach((b) => basicsBody.appendChild(el("p", { html: `<b>${b.name}:</b> ${b.steps}` })));
  root.appendChild(card('📖 <span class="tag">Cooking basics</span>', [basicsBody]));

  root.appendChild(card('🧂 <span class="tag">Seasoning</span>', [el("p", { text: SEASONING_RULES })]));

  const exCard = card('🚫 <span class="tag">Never eat (IBS)</span>', []);
  EXCLUDED_FOODS.forEach((f) => exCard.appendChild(el("div.grocery-item", {}, [el("span", { text: f }), el("span.q", { text: "✕" })])));
  root.appendChild(exCard);

  // grocery checklist
  const grocCard = card('🛒 <span class="tag">Weekly grocery list</span>', []);
  const got = getState().grocery;
  GROCERY.forEach((g) => {
    const row = el("div.grocery-item" + (got[g.item] ? ".got" : ""), {}, [
      el("span", { html: g.item + (g.tag ? ` <span class="pill mut" style="font-size:.6rem">${g.tag}</span>` : "") }),
      el("span.q", { text: g.qty }),
    ]);
    row.style.cursor = "pointer";
    row.addEventListener("click", () => { const on = toggleGrocery(g.item); row.classList.toggle("got", on); });
    grocCard.appendChild(row);
  });
  grocCard.appendChild(el("p.note", { text: "Tap an item to cross it off while shopping.", style: "margin-top:10px" }));
  root.appendChild(grocCard);
}

function recipeBlock(m) {
  const body = el("div.recipe", {}, [
    el("p.macro-line", { text: m.macros }),
    el("p", { html: "<b>Ingredients:</b> " + m.ingredients.join(", ") }),
    el("p", { html: "<b>Steps:</b>" }),
    el("ol", {}, m.steps.map((st) => el("li", { text: st }))),
  ]);
  const price = m.budget ? ` <span class="pill lime" style="font-size:.6rem">${m.budget}</span>` : "";
  return collapse(`<b>${m.name}</b>${price}`, body, false);
}
