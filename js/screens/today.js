/* ============================================================
   today.js — the anti-thinking home: vibrant quote + the day in one tap.
   ============================================================ */
import { el, card, checkRow } from "../ui.js";
import {
  getSettings, getState, getDayLog, toggleCheck, setDayLog, todayKey, latestWeight, logWeight,
} from "../store.js";
import { fastingStatus, fmtCountdown } from "../calc.js";
import { burst } from "../confetti.js";
import { heroQuote } from "../quotes.js";
import {
  WORKOUTS, WEEK_SCHEDULE, LUNCHES, DINNERS, SNACK, SUPPLEMENTS,
  EATING_WINDOW, DAILY_EXTRAS, TARGETS, WARMUP,
} from "../data.js";

export function renderToday(root, { go, refresh }) {
  const s = getSettings();
  const date = todayKey();
  const log = getDayLog(date);
  const d = new Date();
  const sched = (s.schedule && s.schedule[d.getDay()]) || WEEK_SCHEDULE[d.getDay()];

  // ---- BIG vibrant hero quote ----
  root.appendChild(heroQuote());

  // ---- fasting / eating window countdown ----
  const fs = fastingStatus(d, s.fastUntil || EATING_WINDOW.fastUntil, s.stopEating || EATING_WINDOW.stopEating);
  const fasting = fs.state === "fasting";
  root.appendChild(card(null, [
    el("div.row-between", {}, [
      el("div", {}, [
        el("p.kicker", { text: fasting ? "🚫 Fasting" : "🍽️ Eating window open" }),
        el("div.streak-fire", { text: fmtCountdown(fs.untilMs), style: "font-size:2.4rem;color:" + (fasting ? "var(--orange)" : "var(--lime)") }),
        el("small.note", { text: fs.label }),
      ]),
      el("div", { style: "font-size:2.6rem" }, [fasting ? "⏳" : "✅"]),
    ]),
  ]));

  // ---- quick log tiles (big buttons) ----
  const quick = el("section.card");
  quick.appendChild(el("h2", { html: '⚡ <span class="tag">Quick log</span>' }));
  quick.appendChild(el("div.tile-grid", {}, [
    tile("⚖️", "Weight",  "log today", () => go("weight")),
    tile("📸", "Photo",   "progress shot", () => go("media")),
    tile("🎙️", "Voice",   "record note", () => go("media")),
    tile("✍️", "Note",    "how do I feel", () => document.getElementById("notes-jump")?.scrollIntoView({ behavior: "smooth" })),
  ]));
  root.appendChild(quick);

  // ---- today's mission completion meter (live + DAY WON celebration) ----
  const meterFill = el("div.progress-fill", { style: "width:0%" });
  const meterLabel = el("span", { text: "0 done" });
  root.appendChild(card('✅ <span class="tag">Today\'s mission</span>', [
    el("div.progress-wrap", {}, [
      el("div.progress-track", {}, [meterFill]),
      el("div.progress-labels", {}, [meterLabel, el("span", { text: "win the day" })]),
    ]),
  ]));
  function tasksStatus() {
    const log = getDayLog(date);
    const items = [!!log.checks.m1, !!log.checks.snack, !!log.checks.m2];
    SUPPLEMENTS.forEach((su) => items.push(!!log.checks["sup_" + su.id]));
    if (sched === "walk") items.push(!!log.checks.walk);
    else if (sched === "rest") items.push(!!log.checks.rest);
    else items.push(!!log.workoutDone);
    items.push(getState().weights.some((w) => w.date === date));
    items.push((log.water || 0) >= (s.waterL || TARGETS.waterL));
    items.push((log.steps || 0) >= (s.steps || TARGETS.steps));
    return { done: items.filter(Boolean).length, total: items.length };
  }
  function updateMeter() {
    const { done, total } = tasksStatus();
    meterFill.style.width = Math.round((done / total) * 100) + "%";
    meterLabel.textContent = `${done}/${total} done`;
    const log = getDayLog(date);
    if (done === total && !log.checks.__won) {
      log.checks.__won = true; setDayLog(date, { checks: log.checks });
      burst();
      const banner = el("div.toast", { text: "🏆 DAY WON — streak locked" });
      document.body.appendChild(banner); setTimeout(() => banner.remove(), 2400);
    }
  }

  // ---- weigh-in prompt ----
  const weighedToday = getState().weights.some((w) => w.date === date);
  const weighCard = card('⚖️ <span class="tag">Weigh-in</span>', []);
  if (weighedToday) {
    weighCard.appendChild(el("p", { html: `Logged: <b>${latestWeight().toFixed(1)} kg</b> today. ✅` }));
  } else {
    const inp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", placeholder: "Today's weight (kg)", style: "flex:1" });
    const btn = el("button.btn big", { text: "Log weight", onclick: () => {
      const v = parseFloat(inp.value); if (!v) return;
      logWeight(v, date); refresh();
    }});
    weighCard.appendChild(el("div", { style: "display:flex;gap:10px;flex-wrap:wrap" }, [inp, btn]));
  }
  root.appendChild(weighCard);

  // ---- today's training ----
  const trainCard = card('🏋️ <span class="tag">Training</span>', []);
  if (sched === "walk") {
    trainCard.appendChild(el("p", { html: `<b>Walk day.</b> Hit your ${TARGETS.steps.toLocaleString()} steps. Optional light stretching.` }));
    trainCard.appendChild(checkRow({ label: `Walked ${TARGETS.steps.toLocaleString()} steps`, done: !!log.checks.walk, onToggle: () => { toggleCheck(date, "walk"); updateMeter(); } }));
  } else if (sched === "rest") {
    trainCard.appendChild(el("p", { html: "<b>Rest day.</b> Recover. A short walk is welcome but not required." }));
    trainCard.appendChild(checkRow({ label: "Rested / light movement", done: !!log.checks.rest, onToggle: () => { toggleCheck(date, "rest"); updateMeter(); } }));
  } else {
    const w = WORKOUTS[sched];
    trainCard.appendChild(el("p", { html: `Today: <b>${w.title}</b> · ${w.duration || w.exercises.length + " exercises"}` }));
    trainCard.appendChild(el("p.muted", { text: WARMUP, style: "font-size:.85rem" }));
    trainCard.appendChild(el("button.btn huge", { text: log.workoutDone ? "✅ Done — open again" : "▶ Start workout", onclick: () => { location.hash = "workouts"; setTimeout(() => window.dispatchEvent(new CustomEvent("open-workout", { detail: w.id })), 50); } }));
  }
  root.appendChild(trainCard);

  // ---- meals (1 big meal + 3 scoops shake + optional bite) ----
  const mealCard = card('🍽️ <span class="tag">Eat (' + EATING_WINDOW.fastUntil + "–" + EATING_WINDOW.stopEating + ")</span>", []);
  mealCard.appendChild(el("p.muted", { text: EATING_WINDOW.note, style: "font-size:.82rem;margin-top:0" }));
  mealCard.appendChild(checkRow({ label: "Main meal (~13:00)", sub: optList(LUNCHES), done: !!log.checks.m1, onToggle: () => { toggleCheck(date, "m1"); updateMeter(); } }));
  mealCard.appendChild(checkRow({ label: SNACK.name, sub: SNACK.macros, done: !!log.checks.snack, onToggle: () => { toggleCheck(date, "snack"); updateMeter(); } }));
  mealCard.appendChild(checkRow({ label: "Optional small bite (only if hungry)", sub: optList(DINNERS), done: !!log.checks.m2, onToggle: () => { toggleCheck(date, "m2"); updateMeter(); } }));
  mealCard.appendChild(el("button.btn ghost", { text: "📖 See recipes & weekly cost →", onclick: () => go("meals"), style: "margin-top:6px" }));
  root.appendChild(mealCard);

  // ---- supplements ----
  const suppCard = card('💊 <span class="tag">Supplements</span>', []);
  SUPPLEMENTS.forEach((sup) => {
    suppCard.appendChild(checkRow({ label: `${sup.name} — ${sup.dose}`, sub: sup.when, done: !!log.checks["sup_" + sup.id], onToggle: () => { toggleCheck(date, "sup_" + sup.id); updateMeter(); } }));
  });
  root.appendChild(suppCard);

  // ---- water + steps trackers ----
  const trackCard = card('💧 <span class="tag">Water & steps</span>', []);
  const waterTarget = s.waterL || TARGETS.waterL;
  const waterRow = el("div.row-between", {}, []);
  const renderWater = () => {
    waterRow.innerHTML = "";
    waterRow.appendChild(el("div", {}, [
      el("span", { text: (log.water || 0).toFixed(2), style: "font-family:var(--ff-display);font-size:2rem;color:var(--lime)" }),
      el("span.muted", { html: ` / ${waterTarget} L` }),
    ]));
    const minus = el("button.btn ghost", { text: "−0.25L", onclick: () => { log.water = Math.max(0, (log.water || 0) - 0.25); setDayLog(date, { water: log.water }); renderWater(); updateMeter(); } });
    const plus = el("button.btn", { text: "+0.25L", onclick: () => { log.water = (log.water || 0) + 0.25; setDayLog(date, { water: log.water }); renderWater(); updateMeter(); } });
    waterRow.appendChild(el("div", { style: "display:flex;gap:8px" }, [minus, plus]));
  };
  renderWater();
  trackCard.appendChild(waterRow);
  trackCard.appendChild(el("hr.divider"));
  const stepInp = el("input.input", { type: "number", inputmode: "numeric", placeholder: `Steps today (goal ${TARGETS.steps})`, value: log.steps || "" });
  stepInp.addEventListener("change", () => { setDayLog(date, { steps: parseInt(stepInp.value || "0", 10) }); updateMeter(); });
  trackCard.appendChild(el("label.field", {}, [el("span", { text: "Steps walked" }), stepInp]));
  root.appendChild(trackCard);

  // ---- written notes (today's journal) ----
  const notesCard = card('✍️ <span class="tag">Today\'s note</span>', []);
  notesCard.id = "notes-jump";
  const ta = el("textarea.input", { rows: "4", placeholder: "How are you feeling? Energy, hunger, IBS, mood, wins…" });
  ta.value = log.notes || "";
  ta.addEventListener("change", () => setDayLog(date, { notes: ta.value }));
  notesCard.appendChild(ta);
  notesCard.appendChild(el("p.note", { text: "Auto-saves as you tap away." }));
  root.appendChild(notesCard);

  // ---- why (editable) ----
  const whyCard = card('🎯 <span class="tag">Why I\'m doing this</span>', []);
  if (s.whyText) whyCard.appendChild(el("p", { html: `<em>${escapeHtml(s.whyText)}</em>` }));
  whyCard.appendChild(el("button.btn ghost", { text: s.whyText ? "Edit my why" : "Write my why", onclick: () => go("motivation") }));
  root.appendChild(whyCard);

  updateMeter(); // initialise from saved state
}

function tile(ico, lbl, sub, onClick) {
  const t = el("button.tile lime", {}, [
    el("span.ico", { text: ico }), el("span.lbl", { text: lbl }), el("span.sub", { text: sub }),
  ]);
  t.addEventListener("click", onClick);
  return t;
}
function optList(arr) { return arr.map((o) => o.name).join("  •  "); }
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
