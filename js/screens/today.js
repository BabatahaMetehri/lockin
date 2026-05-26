/* ============================================================
   today.js — the anti-thinking screen. Everything you do today.
   ============================================================ */
import { el, card, checkRow, statBox } from "../ui.js";
import {
  getSettings, getState, getDayLog, toggleCheck, setDayLog, todayKey, latestWeight, logWeight,
} from "../store.js";
import { currentStreak, fastingStatus, fmtCountdown, lockedInDays, rankFor, daysSince } from "../calc.js";
import { burst } from "../confetti.js";
import {
  WORKOUTS, WEEK_SCHEDULE, LUNCHES, DINNERS, SNACK, SUPPLEMENTS,
  DAILY_LINES, EATING_WINDOW, DAILY_EXTRAS, TARGETS, COOLDOWN, WARMUP, RANKS,
} from "../data.js";

export function renderToday(root, { go, refresh }) {
  const s = getSettings();
  const date = todayKey();
  const log = getDayLog(date);
  const d = new Date();
  const streak = currentStreak(getState().dayLogs, d);

  const dayName = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const sched = (s.schedule && s.schedule[d.getDay()]) || WEEK_SCHEDULE[d.getDay()];
  const rank = rankFor(RANKS, lockedInDays(getState().dayLogs));
  const dayNum = daysSince(s.startDate, d) + 1;

  // ---- header ----
  root.appendChild(el("header.page-head", {}, [
    el("div.row-between", {}, [
      el("p.kicker", { text: `Day ${dayNum} · ${dayName}` }),
      el("span.pill " + (streak > 0 ? "orange" : "mut"), { html: `🔥 ${streak} day streak` }),
    ]),
    el("h1", { html: 'TODAY — <span class="accent">LOCK IN</span>' }),
    el("div.row-between", { style: "margin-top:6px" }, [
      el("span.pill lime", { html: `${rank.current.icon} ${rank.current.title}` }),
      rank.next ? el("small.note", { text: `${rank.toNext} more day${rank.toNext === 1 ? "" : "s"} → ${rank.next.title}` }) : el("small.note", { text: "Top rank reached 🏆" }),
    ]),
  ]));

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
      el("div", { style: "font-size:2.4rem" }, [document.createTextNode(fasting ? "⏳" : "✅")]),
    ]),
  ]));

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
    const items = [!!log.checks.m1, !!log.checks.snack, !!log.checks.m2, !!log.checks.extra];
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
    trainCard.appendChild(checkRow({ label: `Walked ${TARGETS.steps.toLocaleString()} steps`, done: !!log.checks.walk, onToggle: () => { toggleCheck(date, "walk"); updateMeter(); } }));
  } else if (sched === "rest") {
    trainCard.appendChild(el("p", { html: "<b>Rest day.</b> Recover. A short walk is welcome but not required." }));
    trainCard.appendChild(checkRow({ label: "Rested / light movement", done: !!log.checks.rest, onToggle: () => { toggleCheck(date, "rest"); updateMeter(); } }));
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
  mealCard.appendChild(checkRow({ label: "Meal 1 (12:30) — lunch", sub: optList(LUNCHES), done: !!log.checks.m1, onToggle: () => { toggleCheck(date, "m1"); updateMeter(); } }));
  mealCard.appendChild(checkRow({ label: "Snack (16:00) — whey shake", sub: SNACK.macros, done: !!log.checks.snack, onToggle: () => { toggleCheck(date, "snack"); updateMeter(); } }));
  mealCard.appendChild(checkRow({ label: "Meal 2 (19:30) — dinner", sub: optList(DINNERS), done: !!log.checks.m2, onToggle: () => { toggleCheck(date, "m2"); updateMeter(); } }));
  mealCard.appendChild(checkRow({ label: "Top-up", sub: DAILY_EXTRAS, done: !!log.checks.extra, onToggle: () => { toggleCheck(date, "extra"); updateMeter(); } }));
  mealCard.appendChild(el("button.btn ghost sm", { text: "See recipes & portions →", onclick: () => go("meals"), style: "margin-top:6px" }));
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
      el("span.streak-fire", { text: (log.water || 0).toFixed(1), style: "font-size:2rem;color:var(--lime)" }),
      el("span.muted", { html: ` / ${waterTarget} L` }),
    ]));
    const minus = el("button.btn ghost sm", { text: "−0.25L", onclick: () => { log.water = Math.max(0, (log.water || 0) - 0.25); setDayLog(date, { water: log.water }); renderWater(); updateMeter(); } });
    const plus = el("button.btn sm", { text: "+0.25L", onclick: () => { log.water = (log.water || 0) + 0.25; setDayLog(date, { water: log.water }); renderWater(); updateMeter(); } });
    waterRow.appendChild(el("div", { style: "display:flex;gap:8px" }, [minus, plus]));
  };
  renderWater();
  trackCard.appendChild(waterRow);
  trackCard.appendChild(el("hr.divider"));
  const stepInp = el("input.input", { type: "number", inputmode: "numeric", placeholder: `Steps today (goal ${TARGETS.steps})`, value: log.steps || "" });
  stepInp.addEventListener("change", () => { setDayLog(date, { steps: parseInt(stepInp.value || "0", 10) }); updateMeter(); });
  trackCard.appendChild(el("label.field", {}, [el("span", { text: "Steps walked" }), stepInp]));
  root.appendChild(trackCard);

  root.appendChild(el("button.btn ghost", { text: "🧊 Meal prep plan (cook once)", onclick: () => go("meals"), style: "margin-top:6px" }));
  root.appendChild(el("p.note", { text: "Tip: just go top to bottom. When everything's checked, today is won.", style: "text-align:center;margin-top:14px" }));

  updateMeter(); // initialise the mission meter from saved state
}

function optList(arr) { return arr.map((o) => o.name).join("  •  "); }
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
