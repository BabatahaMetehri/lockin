/* ============================================================
   meals.js — the FIXED plan: two plates (no swaps), snack hacks,
   IBS rules, batch prep, and the live weekly-cost tool.
   ============================================================ */
import { el, card, pageHead, collapse } from "../ui.js";
import { toggleGrocery, getState, getSettings, setSettings } from "../store.js";
import {
  TARGETS, EATING_WINDOW, FIXED_MEALS, MEALS_DAILY_TOTAL, SNACK_HACKS, MUNCH_RULE,
  GROCERY, SEASONING_RULES, EXCLUDED_FOODS, MEAL_PREP, CURRENCY,
} from "../data.js";

export function renderMeals(root) {
  const s = getSettings();
  root.appendChild(pageHead("Meals", "Fixed plan · no swaps · IBS-safe"));

  // ---- daily target ----
  root.appendChild(card('🎯 <span class="tag">Daily target</span>', [
    el("div.stat-row", {}, [
      el("div.stat", {}, [el("div.v lime", { text: s.kcal || TARGETS.kcal }), el("div.k", { text: "kcal" })]),
      el("div.stat", {}, [el("div.v lime", { text: (s.proteinG || TARGETS.proteinG) + "g" }), el("div.k", { text: "protein" })]),
      el("div.stat", {}, [el("div.v", { text: (s.steps || TARGETS.steps).toLocaleString() }), el("div.k", { text: "steps" })]),
      el("div.stat", {}, [el("div.v", { text: (s.waterL || TARGETS.waterL) + "L" }), el("div.k", { text: "water" })]),
    ]),
    el("p.muted", { text: EATING_WINDOW.note, style: "font-size:.85rem;margin-bottom:0" }),
  ]));

  // ---- the two fixed plates with ingredient tables ----
  FIXED_MEALS.forEach((meal) => {
    const c = card(`🍽️ <span class="tag">${meal.time} · ${meal.name}</span>`, []);
    c.appendChild(el("p.muted", { text: meal.note, style: "font-size:.85rem;margin-top:0" }));
    const tbl = el("table.meal-tbl");
    tbl.appendChild(el("tr", {}, [th("Ingredient"), th("Raw"), th("Prep"), th("kcal"), th("P")]));
    meal.ingredients.forEach((i) => tbl.appendChild(el("tr", {}, [
      td(i.item), td(i.raw), td(i.prep, "muted"), td(String(i.kcal)), td(i.p + "g"),
    ])));
    tbl.appendChild(el("tr.meal-total", {}, [td("TOTAL"), td(""), td(""), td(String(meal.total.kcal)), td(meal.total.p + "g")]));
    c.appendChild(tbl);
    root.appendChild(c);
  });

  root.appendChild(card(null, [
    el("p", { html: `<b>Daily totals (meals):</b> ${MEALS_DAILY_TOTAL.kcal} kcal · ${MEALS_DAILY_TOTAL.p}g protein · ${MEALS_DAILY_TOTAL.c}g carb · ${MEALS_DAILY_TOTAL.f}g fat · ${MEALS_DAILY_TOTAL.fiber}g fiber` }),
    el("p.note", { text: "Munching snacks + cooking variance fill the rest to your daily target." }),
  ]));

  // ---- snack hacks (zero-calorie munching) ----
  const snackCard = card('🥒 <span class="tag">Desk munching (near-zero kcal)</span>', []);
  snackCard.appendChild(el("p.muted", { text: MUNCH_RULE, style: "font-size:.85rem;margin-top:0" }));
  SNACK_HACKS.forEach((h) => snackCard.appendChild(el("div", { style: "padding:8px 0;border-bottom:1px solid var(--line)" }, [
    el("div", { html: `<b>${h.name}</b> <span class="pill lime" style="font-size:.6rem">${h.kcal}</span>` }),
    el("div.sub", { text: h.how, style: "font-size:.82rem;color:var(--muted);margin-top:2px" }),
  ])));
  root.appendChild(snackCard);

  // ---- IBS / low-FODMAP rules ----
  root.appendChild(card('🧂 <span class="tag">Seasoning & IBS rules</span>', [el("p", { text: SEASONING_RULES })]));
  const exCard = card('🚫 <span class="tag">Never eat (low-FODMAP)</span>', []);
  EXCLUDED_FOODS.forEach((f) => exCard.appendChild(el("div.grocery-item", {}, [el("span", { text: f }), el("span.q", { text: "✕" })])));
  root.appendChild(exCard);

  // ---- batch meal prep ----
  const prep = card('🧊 <span class="tag">PREP DAY — cook once, eat all week</span>', []);
  prep.appendChild(el("p", { text: MEAL_PREP.intro }));
  const batchBody = el("div");
  MEAL_PREP.batch.forEach((b) => batchBody.appendChild(el("div", { style: "padding:8px 0;border-bottom:1px solid var(--line)" }, [
    el("div", { html: `<b>${b.item}</b> — ${b.cook}` }),
    el("div.sub", { html: `<span class="accent">${b.yields}</span> · store: ${b.store}`, style: "font-size:.8rem;color:var(--muted)" }),
  ])));
  prep.appendChild(collapse("📦 Batch quantities & storage", batchBody, false));
  const stepsBody = el("ol.recipe", {}, MEAL_PREP.prepDay.map((st) => el("li", { text: st })));
  prep.appendChild(collapse("👨‍🍳 The prep-day order", stepsBody, false));
  const ruleBody = el("ul", {}, MEAL_PREP.storage.map((r) => el("li", { text: r, style: "margin-bottom:4px" })));
  prep.appendChild(collapse("🧪 Storage & food-safety rules", ruleBody, false));
  root.appendChild(prep);

  // ---- weekly cost tracker ----
  root.appendChild(buildCostTool());
}

function th(t) { return el("th", { text: t }); }
function td(t, cls) { return el("td" + (cls ? "." + cls : ""), { text: t }); }

function buildCostTool() {
  const userPrices = getSettings().prices || {};
  const userQtys = getSettings().qtys || {};
  const got = getState().grocery;
  const totalEl = el("span.cost-bar", { text: "0 " + CURRENCY });
  const grocCard = card('🛒 <span class="tag">Weekly cost</span>', []);
  grocCard.appendChild(el("div.row-between", {}, [totalEl, el("small.note", { text: "tap row to cross off · prices save" })]));
  grocCard.appendChild(el("div.gr-row", { style: "border-bottom:2px solid var(--line);font-weight:700;color:var(--muted);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase" }, [
    el("span", { text: "Item" }), el("span", { text: "Qty" }), el("span", { text: "@" }), el("span", { style: "text-align:right", text: "Total" }),
  ]));

  function recalc() {
    let total = 0;
    GROCERY.forEach((g) => {
      const qty = (userQtys[g.id] != null ? userQtys[g.id] : g.qty);
      const price = (userPrices[g.id] != null ? userPrices[g.id] : g.price);
      total += (qty * price) || 0;
    });
    totalEl.textContent = Math.round(total).toLocaleString() + " " + CURRENCY;
  }

  GROCERY.forEach((g) => {
    const qty = userQtys[g.id] != null ? userQtys[g.id] : g.qty;
    const price = userPrices[g.id] != null ? userPrices[g.id] : g.price;
    const lineTotal = el("span.total", { text: Math.round(qty * price).toLocaleString() });
    const itemEl = el("span", { html: `${g.item}<br><small style="color:var(--muted)">${g.unit}${g.tag ? " · " + g.tag : ""}</small>` });
    const qtyInp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", value: qty });
    const priceInp = el("input.input", { type: "number", inputmode: "numeric", value: price });
    const update = () => {
      const q = parseFloat(qtyInp.value || "0"), p = parseFloat(priceInp.value || "0");
      userQtys[g.id] = q; userPrices[g.id] = p;
      setSettings({ qtys: userQtys, prices: userPrices });
      lineTotal.textContent = Math.round(q * p).toLocaleString();
      recalc();
    };
    qtyInp.addEventListener("change", update);
    priceInp.addEventListener("change", update);
    const row = el("div.gr-row" + (got[g.id] ? " got" : ""), {}, [itemEl, qtyInp, priceInp, lineTotal]);
    itemEl.style.cursor = "pointer";
    itemEl.addEventListener("click", () => { const on = toggleGrocery(g.id); row.classList.toggle("got", on); });
    grocCard.appendChild(row);
  });
  recalc();
  grocCard.appendChild(el("p.note", { text: `Prices in ${CURRENCY}. Edit once; total updates live.`, style: "margin-top:12px" }));
  return grocCard;
}
