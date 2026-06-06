/* ============================================================
   food-logger.js — the off-plan "Logged extras" widget with live
   local-DB autocomplete. Shared by the home + day view.
   ============================================================ */
import { el } from "./ui.js";
import { getDayLog, addCustomMeal, deleteCustomMeal } from "./store.js";
import { searchLocal } from "./fooddb.js";
import { tap } from "./feedback.js";

export function buildLogger(date) {
  const c = el("section.card", {}, [el("h2", { html: '🍴 <span class="tag">Logged extras (off-plan)</span>' })]);
  const log = getDayLog(date);
  const list = el("div");
  const totalLine = el("p.macro-line", { style: "margin:0 0 10px" });

  function renderList() {
    list.innerHTML = "";
    const meals = log.customMeals || [];
    let k = 0, p = 0;
    meals.forEach((m) => {
      k += m.kcal || 0; p += m.protein || 0;
      list.appendChild(el("div.grocery-item", { style: "align-items:center" }, [
        el("div", {}, [
          el("div", { html: `<b>${m.name}</b>` }),
          el("div.sub", { text: `${m.grams ? m.grams + "g · " : ""}${m.kcal} kcal · ${m.protein}g P`, style: "font-size:.78rem;color:var(--muted)" }),
        ]),
        el("button.btn ghost sm", { text: "✕", onclick: () => { deleteCustomMeal(date, m.id); renderList(); } }),
      ]));
    });
    totalLine.textContent = meals.length ? `Total: ${k} kcal · ${Math.round(p)}g P` : "Nothing logged off-plan today.";
  }
  renderList();

  const q = el("input.input", { placeholder: "Type to search foods (e.g. ri, chicken, tuna…)", autocomplete: "off" });
  const dropdown = el("div.ac-list");
  const adder = el("div.ac-adder", { hidden: true });

  function clearAll() { dropdown.innerHTML = ""; dropdown.hidden = true; adder.innerHTML = ""; adder.hidden = true; }

  q.addEventListener("input", () => {
    adder.hidden = true; adder.innerHTML = "";
    const text = q.value.trim();
    if (!text) { dropdown.hidden = true; dropdown.innerHTML = ""; return; }
    const items = searchLocal(text, 8);
    dropdown.innerHTML = "";
    if (!items.length) dropdown.appendChild(el("p.muted", { text: "No match. Add it manually below ↓", style: "padding:10px;margin:0;font-size:.85rem" }));
    else items.forEach((it) => dropdown.appendChild(suggestionRow(it)));
    dropdown.hidden = false;
  });
  q.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { clearAll(); q.value = ""; }
    if (e.key === "ArrowDown" && dropdown.firstChild) { e.preventDefault(); dropdown.firstChild.focus(); }
  });

  function suggestionRow(it) {
    const row = el("button.ac-row", { type: "button" });
    row.appendChild(el("div", {}, [
      el("div.ac-name", { text: it.name }),
      el("div.ac-mac", { text: `${it.kcal} kcal · ${it.protein}g P / 100g` }),
    ]));
    row.appendChild(el("span.pill lime", { text: "+" }));
    row.addEventListener("click", () => openAdder(it));
    return row;
  }

  function openAdder(it) {
    dropdown.hidden = true; dropdown.innerHTML = "";
    q.value = it.name;
    adder.hidden = false; adder.innerHTML = "";
    const grams = el("input.input", { type: "number", inputmode: "numeric", value: it.defaultGrams || 100, style: "width:110px;text-align:center" });
    const preview = el("p.macro-line", { text: "", style: "margin:8px 0 0" });
    function update() {
      const g = parseFloat(grams.value) || 0;
      const k = Math.round(it.kcal * g / 100);
      const p = Math.round(it.protein * g / 100 * 10) / 10;
      preview.textContent = g > 0 ? `= ${k} kcal · ${p}g protein   (for ${g}g)` : "Enter grams…";
    }
    update();
    grams.addEventListener("input", update);
    const addBtn = el("button.btn big", { text: "✓ Log this", onclick: () => {
      const g = parseFloat(grams.value); if (!g) { grams.focus(); return; }
      addCustomMeal(date, { name: it.name, grams: g, kcal: Math.round(it.kcal * g / 100), protein: Math.round(it.protein * g / 100 * 10) / 10 });
      q.value = ""; clearAll(); renderList(); tap(); q.focus();
    }});
    const cancel = el("button.btn ghost sm", { text: "Cancel", onclick: () => { q.value = ""; clearAll(); q.focus(); } });
    adder.appendChild(el("p", { html: `<b>${it.name}</b>`, style: "margin:0 0 10px" }));
    adder.appendChild(el("div", { style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap" }, [grams, el("span.muted", { text: "grams" }), el("div", { style: "flex:1;min-width:80px" }), addBtn, cancel]));
    adder.appendChild(preview);
    setTimeout(() => grams.select(), 50);
  }

  const m = { name: "", kcal: "", protein: "", grams: "" };
  const mn = el("input.input", { placeholder: "Name", oninput: (e) => m.name = e.target.value });
  const mg = el("input.input", { type: "number", placeholder: "grams (optional)", oninput: (e) => m.grams = +e.target.value });
  const mk = el("input.input", { type: "number", placeholder: "kcal", oninput: (e) => m.kcal = +e.target.value });
  const mp = el("input.input", { type: "number", placeholder: "protein g", oninput: (e) => m.protein = +e.target.value });
  const addManual = el("button.btn", { text: "+ Log this", onclick: () => {
    if (!m.name || !m.kcal) return;
    addCustomMeal(date, { name: m.name, grams: m.grams || null, kcal: m.kcal, protein: m.protein || 0 });
    [mn, mg, mk, mp].forEach((i) => i.value = ""); m.name = m.kcal = m.protein = ""; m.grams = "";
    renderList(); tap();
  }});

  c.appendChild(totalLine);
  c.appendChild(list);
  c.appendChild(el("hr.divider"));
  c.appendChild(q);
  c.appendChild(dropdown);
  c.appendChild(adder);
  c.appendChild(el("hr.divider"));
  c.appendChild(el("p.kicker", { text: "Not in the list? Add it yourself", style: "margin-bottom:6px" }));
  c.appendChild(el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px" }, [mn, mg, mk, mp]));
  c.appendChild(addManual);
  return c;
}
