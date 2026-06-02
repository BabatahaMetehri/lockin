/* ============================================================
   onboarding.js — first-run 3-step wizard. Sets the foundation
   so the user has zero decisions to make from Day 1.
   Renders as a full-screen overlay; calls onDone() when finished.
   ============================================================ */
import { el } from "./ui.js";
import { getSettings, setSettings } from "./store.js";
import { GROCERY, CURRENCY } from "./data.js";
import { chime } from "./feedback.js";

export function renderOnboarding(onDone) {
  const s = getSettings();
  let step = 0;
  const data = {
    whyText: s.whyText || "",
    startWeightKg: s.startWeightKg,
    goalWeightKg: s.goalWeightKg,
    prices: { ...(s.prices || {}) },
  };

  const ov = el("div", { style: "position:fixed;inset:0;z-index:70;background:radial-gradient(900px 500px at 50% 0%, #15181d, #0a0b0d);overflow:auto;padding:24px;display:flex;flex-direction:column;align-items:center" });
  document.body.appendChild(ov);

  const wrap = el("div", { style: "width:min(420px,100%);margin-top:8px" });
  const head = el("div", { style: "text-align:center;margin-bottom:18px" }, [
    el("div", { html: '<span style="color:var(--lime)">◆</span> LOCK<span style="color:var(--lime)">IN</span>', style: "font-family:var(--ff-display);font-size:2rem;letter-spacing:.05em" }),
    el("p.kicker", { id: "ob-step", style: "margin-top:6px" }),
  ]);
  wrap.appendChild(head);
  const body = el("div"); wrap.appendChild(body);
  const dots = el("div", { style: "display:flex;justify-content:center;gap:8px;margin-top:18px" });
  for (let i = 0; i < 3; i++) dots.appendChild(el("span", { style: "width:8px;height:8px;border-radius:50%;background:var(--muted-2);transition:.2s" }));
  wrap.appendChild(dots);
  ov.appendChild(wrap);

  function go(n) {
    step = n;
    document.getElementById("ob-step").textContent = `Step ${n + 1} of 3`;
    [...dots.children].forEach((d, i) => d.style.background = i <= n ? "var(--lime)" : "var(--muted-2)");
    body.innerHTML = "";
    if (n === 0) body.appendChild(stepWhy());
    else if (n === 1) body.appendChild(stepGoal());
    else body.appendChild(stepPrices());
  }

  function stepWhy() {
    const c = el("section.card");
    c.appendChild(el("h2", { html: '🎯 <span class="tag">Your why</span>' }));
    c.appendChild(el("p.muted", { text: "Write ONE sentence — the reason you don't quit this time. You'll see it on every Today screen, especially when you want to quit.", style: "font-size:.9rem" }));
    const ta = el("textarea.input", { rows: "4", placeholder: "e.g. I want to feel strong and confident at my brother's wedding." });
    ta.value = data.whyText;
    ta.addEventListener("input", () => data.whyText = ta.value);
    c.appendChild(ta);
    c.appendChild(el("button.btn big", { text: "Next →", style: "margin-top:14px", onclick: () => go(1) }));
    setTimeout(() => ta.focus(), 100);
    return c;
  }

  function stepGoal() {
    const c = el("section.card");
    c.appendChild(el("h2", { html: '📉 <span class="tag">Your numbers</span>' }));
    c.appendChild(el("p.muted", { text: "Confirm where you're starting and where you're going.", style: "font-size:.9rem" }));
    const start = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", value: data.startWeightKg });
    start.addEventListener("change", () => data.startWeightKg = parseFloat(start.value) || data.startWeightKg);
    const goal = el("input.input", { type: "number", inputmode: "decimal", step: "0.5", value: data.goalWeightKg });
    goal.addEventListener("change", () => data.goalWeightKg = parseFloat(goal.value) || data.goalWeightKg);
    c.appendChild(el("label.field", {}, [el("span", { text: "Starting weight (kg)" }), start]));
    c.appendChild(el("label.field", {}, [el("span", { text: "Goal weight (kg)" }), goal]));
    c.appendChild(el("div", { style: "display:flex;gap:8px" }, [
      el("button.btn ghost", { text: "← Back", onclick: () => go(0) }),
      el("button.btn big", { text: "Next →", style: "flex:1", onclick: () => go(2) }),
    ]));
    return c;
  }

  function stepPrices() {
    const c = el("section.card");
    c.appendChild(el("h2", { html: '🛒 <span class="tag">Set your prices</span>' }));
    c.appendChild(el("p.muted", { text: `Set what you actually pay (${CURRENCY}). Editing these once gives you a live weekly cost. Or skip — you can do it later from Meals.`, style: "font-size:.9rem" }));
    GROCERY.slice(0, 6).forEach((g) => {
      const val = data.prices[g.id] != null ? data.prices[g.id] : g.price;
      const inp = el("input.input", { type: "number", inputmode: "numeric", value: val, style: "width:90px" });
      inp.addEventListener("change", () => data.prices[g.id] = parseFloat(inp.value) || val);
      c.appendChild(el("div.row-between", { style: "padding:6px 0;border-bottom:1px solid var(--line)" }, [
        el("span", { text: `${g.item}`, style: "flex:1;font-size:.9rem" }),
        el("span.muted", { text: g.unit, style: "font-size:.75rem" }),
        inp,
      ]));
    });
    c.appendChild(el("p.note", { text: "Showing the 6 most-used items; the rest live in Meals.", style: "margin-top:10px" }));
    c.appendChild(el("div", { style: "display:flex;gap:8px" }, [
      el("button.btn ghost", { text: "← Back", onclick: () => go(1) }),
      el("button.btn big huge", { text: "🔒 LOCK IN", style: "flex:1", onclick: finish }),
    ]));
    return c;
  }

  function finish() {
    setSettings({
      whyText: data.whyText.trim(),
      startWeightKg: data.startWeightKg,
      goalWeightKg: data.goalWeightKg,
      prices: data.prices,
      onboarded: true,
    });
    chime();
    ov.remove();
    onDone && onDone();
  }

  go(0);
}
