/* ============================================================
   now.js — the RAIL home (F11). Surfaces exactly ONE thing to do
   right now (from the Master Clock). Everything else is one tap
   away inside the collapsible "Full day". Rail, not a cockpit.
   ============================================================ */
import { el, card, checkRow, collapse } from "../ui.js";
import {
  getSettings, getState, getDayLog, toggleCheck, setDayLog, setSettings,
  todayKey, latestWeight, logWeight,
} from "../store.js";
import {
  fastingStatus, fmtCountdown, masterClockNow, calorieTargetFor,
  latestRollingAvg,
} from "../calc.js";
import { burst } from "../confetti.js";
import { tap, chime } from "../feedback.js";
import { buildLogger } from "../food-logger.js";
import {
  MASTER_CLOCK, FIXED_MEALS, SUPPLEMENTS, WORKOUTS, WEEK_SCHEDULE,
  EATING_WINDOW, TARGETS, WARMUP, STEPS_PLAN, CALORIE, SNACK_HACKS, MUNCH_RULE,
} from "../data.js";

const CLOCK_ICON = { wake: "☀️", walk: "🚶", work: "💻", train: "🏋️", meal: "🍽️", fast: "💧", warn: "⏰", sleep: "🌙" };

export function renderNow(root, { go, refresh }) {
  const s = getSettings();
  const date = todayKey();
  const d = new Date();
  const log = getDayLog(date);
  const sched = (s.schedule && s.schedule[d.getDay()]) || WEEK_SCHEDULE[d.getDay()];

  // recompute "day won" and fire celebration once
  function coreDone() {
    const l = getDayLog(date);
    const items = [
      !!l.checks.meal1, !!l.checks.meal2,
      ...SUPPLEMENTS.map((su) => !!l.checks["sup_" + su.id]),
      sched === "rest" ? !!l.checks.rest : !!l.workoutDone,
      getState().weights.some((w) => w.date === date),
      (l.water || 0) >= (s.waterL || TARGETS.waterL),
      (l.steps || 0) >= (s.steps || TARGETS.steps),
    ];
    return { done: items.filter(Boolean).length, total: items.length };
  }
  function checkWin() {
    const { done, total } = coreDone();
    const l = getDayLog(date);
    if (done === total && !l.checks.__won) {
      l.checks.__won = true; setDayLog(date, { checks: l.checks });
      burst(); chime();
      const banner = el("div.toast", { text: "🏆 DAY WON — locked" });
      document.body.appendChild(banner); setTimeout(() => banner.remove(), 2400);
    }
  }

  // ---------- F1: calorie recalc prompt ----------
  const curW = latestRollingAvg(getState().weights) ?? latestWeight();
  const ct = calorieTargetFor(s.startWeightKg, curW, CALORIE);
  if (ct.tier > (s.calorieTier || 0)) {
    const rc = el("section.card", { style: "border-color:rgba(198,241,53,.6);background:linear-gradient(180deg,rgba(198,241,53,.1),var(--bg-2))" });
    rc.appendChild(el("h2", { html: '📉 <span class="tag accent">New calorie target</span>' }));
    rc.appendChild(el("p", { html: `You've crossed a 15 kg milestone. To keep losing, your target drops to <b>${ct.target} kcal/day</b> (was ${s.kcal}).` }));
    rc.appendChild(el("button.btn big", { text: `Accept ${ct.target} kcal`, onclick: () => { setSettings({ kcal: ct.target, calorieTier: ct.tier }); refresh(); } }));
    root.appendChild(rc);
  }

  // ---------- THE RIGHT-NOW RAIL ----------
  const { current, next } = masterClockNow(d, MASTER_CLOCK);
  const rail = el("section.card rail-now " + current.type);
  rail.appendChild(el("p.kicker", { html: `${CLOCK_ICON[current.type] || "▸"} RIGHT NOW · ${current.time}` }));
  rail.appendChild(el("div.rail-action", { text: current.action }));
  const ctx = ctxControl(current.id);
  if (ctx) rail.appendChild(ctx);
  rail.appendChild(el("p.rail-next", { html: `<span class="muted">Next ${next.time}:</span> ${next.action}` }));
  root.appendChild(rail);

  // ---------- fasting countdown ----------
  const fs = fastingStatus(d, s.fastUntil || EATING_WINDOW.fastUntil, s.stopEating || EATING_WINDOW.stopEating);
  const fasting = fs.state === "fasting";
  root.appendChild(card(null, [
    el("div.row-between", {}, [
      el("div", {}, [
        el("p.kicker", { text: fasting ? "🚫 Fasting" : "🍽️ Window open" }),
        el("div", { text: fmtCountdown(fs.untilMs), style: "font-family:var(--ff-display);font-size:2.4rem;line-height:1;color:" + (fasting ? "var(--orange)" : "var(--lime)") }),
        el("small.note", { text: fs.label }),
      ]),
      el("div", { style: "font-size:2.6rem" }, [fasting ? "⏳" : "✅"]),
    ]),
  ]));

  // ---------- FULL DAY (everything else, one tap away) ----------
  root.appendChild(collapse('📋 <b>Full day checklist</b>', buildFullDay(), false));

  // contextual control builder
  function ctxControl(id) {
    if (id === "meal1" || id === "meal2") {
      const meal = FIXED_MEALS.find((m) => m.id === id) || FIXED_MEALS[0];
      const box = el("div", { style: "margin-top:10px" });
      box.appendChild(checkRow({ label: `${meal.name} (${meal.total.kcal} kcal · ${meal.total.p}g P)`, sub: meal.note, done: !!log.checks[id], onToggle: () => { toggleCheck(date, id); tap(); checkWin(); } }));
      const supps = SUPPLEMENTS.filter((su) => su.when.includes(meal.time.slice(0, 5)) || (id === "meal1" && su.id !== "iso") || (id === "meal2" && su.id === "iso"));
      supps.forEach((su) => box.appendChild(checkRow({ label: `${su.name} — ${su.dose}`, done: !!log.checks["sup_" + su.id], onToggle: () => { toggleCheck(date, "sup_" + su.id); tap(); checkWin(); } })));
      box.appendChild(el("button.btn ghost sm", { text: "See the plate →", onclick: () => go("meals"), style: "margin-top:4px" }));
      return box;
    }
    if (id === "train") {
      if (sched === "rest") {
        const box = el("div", { style: "margin-top:10px" });
        box.appendChild(checkRow({ label: "Rest day — light movement only", done: !!log.checks.rest, onToggle: () => { toggleCheck(date, "rest"); tap(); checkWin(); } }));
        return box;
      }
      const w = WORKOUTS[sched];
      const box = el("div", { style: "margin-top:10px" });
      box.appendChild(el("p.muted", { text: `${w.title} · ${w.duration} · ${WARMUP}`, style: "font-size:.82rem" }));
      box.appendChild(el("button.btn huge", { text: log.workoutDone ? "✅ Logged — open again" : "▶ Start workout", onclick: () => { location.hash = "workouts"; setTimeout(() => window.dispatchEvent(new CustomEvent("open-workout", { detail: w.id })), 50); } }));
      return box;
    }
    if (id === "walk1" || id === "walk2") return stepControl();
    if (id === "wake" || id === "postw" || id === "close") return waterControl();
    if (id === "wind") {
      const box = el("div", { style: "margin-top:10px" });
      const weighed = getState().weights.some((w) => w.date === date);
      if (weighed) box.appendChild(el("p", { html: `Weight logged: <b>${latestWeight().toFixed(1)} kg</b> ✅` }));
      else {
        const inp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", placeholder: "Weight (kg)", style: "flex:1" });
        box.appendChild(el("div", { style: "display:flex;gap:8px" }, [inp, el("button.btn", { text: "Log", onclick: () => { const v = parseFloat(inp.value); if (!v) return; logWeight(v, date); checkWin(); refresh(); } })]));
      }
      return box;
    }
    if (id === "work1") {
      return el("p.muted", { html: `🥒 ${MUNCH_RULE}`, style: "margin-top:8px;font-size:.85rem" });
    }
    return null;
  }

  function stepControl() {
    const box = el("div", { style: "margin-top:10px" });
    const lbl = el("div", { style: "font-family:var(--ff-display);font-size:2rem;color:var(--lime)" });
    const render = () => { lbl.textContent = `${(getDayLog(date).steps || 0).toLocaleString()} / ${STEPS_PLAN.total.toLocaleString()}`; };
    render();
    const add = (n) => { const l = getDayLog(date); setDayLog(date, { steps: (l.steps || 0) + n }); render(); tap(); checkWin(); };
    box.appendChild(lbl);
    box.appendChild(el("div", { style: "display:flex;gap:8px;margin-top:8px;flex-wrap:wrap" }, [
      el("button.btn sm", { text: "+1,000", onclick: () => add(1000) }),
      el("button.btn sm", { text: "+2,500", onclick: () => add(2500) }),
      el("button.btn sm", { text: "+5,000", onclick: () => add(5000) }),
    ]));
    return box;
  }

  function waterControl() {
    const box = el("div", { style: "margin-top:10px" });
    const lbl = el("div", { style: "font-family:var(--ff-display);font-size:2rem;color:var(--lime)" });
    const render = () => { lbl.textContent = `${(getDayLog(date).water || 0).toFixed(2)} / ${s.waterL || TARGETS.waterL} L`; };
    render();
    const add = (n) => { const l = getDayLog(date); setDayLog(date, { water: Math.max(0, (l.water || 0) + n) }); render(); tap(); checkWin(); };
    box.appendChild(lbl);
    box.appendChild(el("div", { style: "display:flex;gap:8px;margin-top:8px" }, [
      el("button.btn ghost sm", { text: "−0.25L", onclick: () => add(-0.25) }),
      el("button.btn sm", { text: "+0.25L", onclick: () => add(0.25) }),
      el("button.btn sm", { text: "+0.5L", onclick: () => add(0.5) }),
    ]));
    return box;
  }

  // ---------- the full-day checklist (collapsed by default) ----------
  function buildFullDay() {
    const wrap = el("div");

    // meals + supplements
    const mealCard = card('🍽️ <span class="tag">Meals (14:00 & 19:30)</span>', []);
    FIXED_MEALS.forEach((meal) => {
      mealCard.appendChild(checkRow({ label: `${meal.time} · ${meal.name}`, sub: `${meal.total.kcal} kcal · ${meal.total.p}g P`, done: !!log.checks[meal.id], onToggle: () => { toggleCheck(date, meal.id); tap(); checkWin(); } }));
    });
    SUPPLEMENTS.forEach((su) => mealCard.appendChild(checkRow({ label: `${su.name} — ${su.dose}`, sub: su.when, done: !!log.checks["sup_" + su.id], onToggle: () => { toggleCheck(date, "sup_" + su.id); tap(); checkWin(); } })));
    mealCard.appendChild(el("button.btn ghost sm", { text: "📖 Plates, snack hacks & cost →", onclick: () => go("meals"), style: "margin-top:6px" }));
    wrap.appendChild(mealCard);

    // training
    const trainCard = card('🏋️ <span class="tag">Training</span>', []);
    if (sched === "rest") trainCard.appendChild(checkRow({ label: "Rest day (steps still count)", done: !!log.checks.rest, onToggle: () => { toggleCheck(date, "rest"); checkWin(); } }));
    else {
      const w = WORKOUTS[sched];
      trainCard.appendChild(el("p", { html: `Today: <b>${w.title}</b> · ${w.duration}` }));
      trainCard.appendChild(el("button.btn", { text: log.workoutDone ? "✅ Done — open again" : "▶ Start workout", onclick: () => { location.hash = "workouts"; setTimeout(() => window.dispatchEvent(new CustomEvent("open-workout", { detail: w.id })), 50); } }));
    }
    wrap.appendChild(trainCard);

    // water + steps
    const trackCard = card('💧 <span class="tag">Water & steps</span>', []);
    trackCard.appendChild(waterControl());
    trackCard.appendChild(el("hr.divider"));
    trackCard.appendChild(stepControl());
    trackCard.appendChild(el("p.note", { text: STEPS_PLAN.note, style: "margin-top:8px" }));
    wrap.appendChild(trackCard);

    // weigh-in
    const weighCard = card('⚖️ <span class="tag">Weigh-in</span>', []);
    const weighed = getState().weights.some((w) => w.date === date);
    if (weighed) weighCard.appendChild(el("p", { html: `Logged: <b>${latestWeight().toFixed(1)} kg</b> ✅` }));
    else {
      const inp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", placeholder: "Weight (kg)", style: "flex:1" });
      weighCard.appendChild(el("div", { style: "display:flex;gap:8px" }, [inp, el("button.btn", { text: "Log", onclick: () => { const v = parseFloat(inp.value); if (!v) return; logWeight(v, date); checkWin(); refresh(); } })]));
    }
    wrap.appendChild(weighCard);

    // off-plan logger
    wrap.appendChild(buildLogger(date));

    // note
    const notesCard = card('✍️ <span class="tag">Today\'s note</span>', []);
    const ta = el("textarea.input", { rows: "3", placeholder: "Energy, hunger, IBS, mood, wins…" });
    ta.value = log.notes || "";
    ta.addEventListener("change", () => setDayLog(date, { notes: ta.value }));
    notesCard.appendChild(ta);
    wrap.appendChild(notesCard);

    return wrap;
  }
}
