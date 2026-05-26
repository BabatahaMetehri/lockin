/* ============================================================
   today.js — the anti-thinking screen. Everything you do today.
   ============================================================ */
import { el, card, checkRow, statBox } from "../ui.js";
import {
  getSettings, getState, getDayLog, toggleCheck, setDayLog, todayKey, latestWeight, logWeight,
} from "../store.js";
import { currentStreak } from "../calc.js";
import {
  WORKOUTS, WEEK_SCHEDULE, LUNCHES, DINNERS, SNACK, SUPPLEMENTS,
  DAILY_LINES, EATING_WINDOW, DAILY_EXTRAS, TARGETS, COOLDOWN, WARMUP,
} from "../data.js";

export function renderToday(root, { go, refresh }) {
  const s = getSettings();
  const date = todayKey();
  const log = getDayLog(date);
  const d = new Date();
  const streak = currentStreak(getState().dayLogs, d);

  const dayName = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const sched = (s.schedule && s.schedule[d.getDay()]) || WEEK_SCHEDULE[d.getDay()];

  // ---- header ----
  root.appendChild(el("header.page-head", {}, [
    el("div.row-between", {}, [
      el("p.kicker", { text: dayName }),
      el("span.pill " + (streak > 0 ? "orange" : "mut"), { html: `🔥 ${streak} day streak` }),
    ]),
    el("h1", { html: 'TODAY — <span class="accent">LOCK IN</span>' }),
  ]));

  // ---- motivation line + why ----
  const line = DAILY_LINES[d.getDate() % DAILY_LINES.length];
  root.appendChild(card(null, [
    el("p", { text: line, style: "font-size:1.05rem;font-weight:700;margin:0 0 6px" }),
    s.whyText
      ? el("p.muted", { html: `Your why: <em>${escapeHtml(s.whyText)}</em>` })
      : el("button.btn ghost sm", { text: "✎ Write why you're doing this", onclick: () => go("motivation") }),
  ]));

  // ---- weigh-in prompt ----
  const weighedToday = getState().weights.some((w) => w.date === date);
  const weighCard = card('⚖️ <span class="tag">Weigh-in</span>', []);
  if (weighedToday) {
    weighCard.appendChild(el("p", { html: `Logged: <b>${latestWeight().toFixed(1)} kg</b> today. ✅` }));
  } else {
    const inp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", placeholder: "Today's weight (kg)" });
    const btn = el("button.btn", { text: "Log weight", onclick: () => {
      const v = parseFloat(inp.value); if (!v) return;
      logWeight(v, date); refresh();
    }});
    weighCard.appendChild(el("div", { style: "display:flex;gap:10px" }, [inp, btn]));
    weighCard.querySelector("input").style.flex = "1";
  }
  root.appendChild(weighCard);

  // ---- today's training ----
  const trainCard = card('🏋️ <span class="tag">Training</span>', []);
  if (sched === "walk") {
    trainCard.appendChild(el("p", { html: `<b>Walk day.</b> Hit your ${TARGETS.steps.toLocaleString()} steps. Optional light stretching.` }));
    trainCard.appendChild(checkRow({ label: `Walked ${TARGETS.steps.toLocaleString()} steps`, done: !!log.checks.walk, onToggle: () => toggleCheck(date, "walk") }));
  } else if (sched === "rest") {
    trainCard.appendChild(el("p", { html: "<b>Rest day.</b> Recover. A short walk is welcome but not required." }));
    trainCard.appendChild(checkRow({ label: "Rested / light movement", done: !!log.checks.rest, onToggle: () => toggleCheck(date, "rest") }));
  } else {
    const w = WORKOUTS[sched];
    trainCard.appendChild(el("p", { html: `Today: <b>Workout ${w.id} — ${w.title}</b> · ${w.exercises.length} exercises` }));
    trainCard.appendChild(el("p.muted", { text: WARMUP, style: "font-size:.85rem" }));
    const startBtn = el("button.btn", { text: log.workoutDone ? "✅ Done — open again" : "▶ Start workout", onclick: () => { location.hash = "workouts"; setTimeout(() => window.dispatchEvent(new CustomEvent("open-workout", { detail: w.id })), 50); } });
    trainCard.appendChild(startBtn);
    if (log.workoutDone) trainCard.appendChild(el("p.muted", { text: COOLDOWN, style: "font-size:.85rem;margin-top:8px" }));
  }
  root.appendChild(trainCard);

  // ---- meals ----
  const mealCard = card('🍽️ <span class="tag">Eat (' + EATING_WINDOW.fastUntil + "–" + EATING_WINDOW.stopEating + ")</span>", []);
  mealCard.appendChild(el("p.muted", { text: EATING_WINDOW.note, style: "font-size:.82rem;margin-top:0" }));
  mealCard.appendChild(checkRow({ label: "Meal 1 (12:30) — lunch", sub: optList(LUNCHES), done: !!log.checks.m1, onToggle: () => toggleCheck(date, "m1") }));
  mealCard.appendChild(checkRow({ label: "Snack (16:00) — whey shake", sub: SNACK.macros, done: !!log.checks.snack, onToggle: () => toggleCheck(date, "snack") }));
  mealCard.appendChild(checkRow({ label: "Meal 2 (19:30) — dinner", sub: optList(DINNERS), done: !!log.checks.m2, onToggle: () => toggleCheck(date, "m2") }));
  mealCard.appendChild(checkRow({ label: "Top-up", sub: DAILY_EXTRAS, done: !!log.checks.extra, onToggle: () => toggleCheck(date, "extra") }));
  mealCard.appendChild(el("button.btn ghost sm", { text: "See recipes & portions →", onclick: () => go("meals"), style: "margin-top:6px" }));
  root.appendChild(mealCard);

  // ---- supplements ----
  const suppCard = card('💊 <span class="tag">Supplements</span>', []);
  SUPPLEMENTS.forEach((sup) => {
    suppCard.appendChild(checkRow({ label: `${sup.name} — ${sup.dose}`, sub: sup.when, done: !!log.checks["sup_" + sup.id], onToggle: () => toggleCheck(date, "sup_" + sup.id) }));
  });
  root.appendChild(suppCard);

  // ---- water + steps trackers ----
  const trackCard = card('💧 <span class="tag">Water & steps</span>', []);
  const waterTarget = s.waterL || TARGETS.waterL;
  const waterRow = el("div.row-between", {}, []);
  const renderWater = () => {
    waterRow.innerHTML = "";
    waterRow.appendChild(el("div", {}, [
      el("span.streak-fire", { text: (log.water || 0).toFixed(1), style: "font-size:2rem;color:var(--lime)" }),
      el("span.muted", { html: ` / ${waterTarget} L` }),
    ]));
    const minus = el("button.btn ghost sm", { text: "−0.25L", onclick: () => { log.water = Math.max(0, (log.water || 0) - 0.25); setDayLog(date, { water: log.water }); renderWater(); } });
    const plus = el("button.btn sm", { text: "+0.25L", onclick: () => { log.water = (log.water || 0) + 0.25; setDayLog(date, { water: log.water }); renderWater(); } });
    waterRow.appendChild(el("div", { style: "display:flex;gap:8px" }, [minus, plus]));
  };
  renderWater();
  trackCard.appendChild(waterRow);
  trackCard.appendChild(el("hr.divider"));
  const stepInp = el("input.input", { type: "number", inputmode: "numeric", placeholder: `Steps today (goal ${TARGETS.steps})`, value: log.steps || "" });
  stepInp.addEventListener("change", () => setDayLog(date, { steps: parseInt(stepInp.value || "0", 10) }));
  trackCard.appendChild(el("label.field", {}, [el("span", { text: "Steps walked" }), stepInp]));
  root.appendChild(trackCard);

  root.appendChild(el("p.note", { text: "Tip: just go top to bottom. When everything's checked, today is won.", style: "text-align:center;margin-top:14px" }));
}

function optList(arr) { return arr.map((o) => o.name).join("  •  "); }
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
