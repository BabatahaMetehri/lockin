/* ============================================================
   calc.js — PURE functions. No DOM, no storage. Unit-tested.
   ============================================================ */

export function bmi(kg, cm) {
  if (!kg || !cm) return 0;
  const m = cm / 100;
  return kg / (m * m);
}

export function bmiCategory(value) {
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Normal";
  if (value < 30) return "Overweight";
  if (value < 35) return "Obese I";
  if (value < 40) return "Obese II";
  return "Obese III";
}

export function totalLost(startKg, currentKg) {
  return startKg - currentKg;
}

/** 0..100, clamped. */
export function progressPct(startKg, currentKg, goalKg) {
  const span = startKg - goalKg;
  if (span <= 0) return 0;
  const done = startKg - currentKg;
  return Math.max(0, Math.min(100, (done / span) * 100));
}

/** kg per week from the most recent N days of weigh-ins (default 14). */
export function weeklyRate(weights, days = 14) {
  if (!weights || weights.length < 2) return 0;
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1];
  const lastTime = new Date(last.date).getTime();
  const cutoff = lastTime - days * 86400000;
  const window = sorted.filter((w) => new Date(w.date).getTime() >= cutoff);
  const first = window.length >= 2 ? window[0] : sorted[0];
  const dt = (new Date(last.date).getTime() - new Date(first.date).getTime()) / 86400000;
  if (dt <= 0) return 0;
  return ((last.kg - first.kg) / dt) * 7; // negative = losing
}

/**
 * Current streak (consecutive days up to today) where the day counts as
 * "done" if it has any activity logged (a check, water, steps, or workout).
 */
export function currentStreak(dayLogs, today = new Date()) {
  if (!dayLogs) return 0;
  const isDone = (log) =>
    !!log && (log.workoutDone || (log.water || 0) > 0 || (log.steps || 0) > 0 ||
      (log.checks && Object.values(log.checks).some(Boolean)));
  let streak = 0;
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (;;) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (isDone(dayLogs[key])) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

/** Mifflin-St Jeor BMR for a male. */
export function bmrMale(kg, cm, age) {
  return 10 * kg + 6.25 * cm - 5 * age + 5;
}

/** Rough TDEE estimate at the given activity factor. */
export function estTDEE(kg, cm, age, activity = 1.4) {
  return bmrMale(kg, cm, age) * activity;
}

/**
 * F1 — auto-recalculating calorie target.
 * Target drops one step (default 100 kcal) for every `tierKg` (15) lost,
 * floored. Matches the spec timeline: 1650 → 1550 (−15kg) → 1450 (−30kg).
 * @returns {{ target, tier, lost, nextRecalcWeight }}
 */
export function calorieTargetFor(startKg, currentKg, cfg = {}) {
  const base = cfg.baseTarget ?? 1650;
  const step = cfg.stepPerTier ?? 100;
  const tierKg = cfg.tierKg ?? 15;
  const floor = cfg.floor ?? 1400;
  const lost = Math.max(0, startKg - currentKg);
  const tier = Math.floor(lost / tierKg);
  const target = Math.max(floor, base - step * tier);
  const nextRecalcWeight = startKg - (tier + 1) * tierKg;
  return { target, tier, lost, nextRecalcWeight };
}

/** Minutes since midnight for an "HH:MM" string. (exported for clock math) */
export function minutesOfDay(hhmm) { return toMin(hhmm); }

/**
 * Resolve the current + next Master Clock entries for `now`.
 * Before the first entry of the day, "current" is the last entry (carry-over
 * from last night) and "next" is the first entry.
 * @returns {{ current, next, currentIdx }}
 */
export function masterClockNow(now, clock) {
  const mins = now.getHours() * 60 + now.getMinutes();
  let found = -1;
  for (let i = 0; i < clock.length; i++) {
    if (toMin(clock[i].time) <= mins) found = i; else break;
  }
  if (found === -1) {
    return { current: clock[clock.length - 1], next: clock[0], currentIdx: clock.length - 1 };
  }
  return { current: clock[found], next: clock[found + 1] || clock[0], currentIdx: found };
}

/** 7-day rolling-average weight series (smooths daily noise). */
export function rollingAvgSeries(weights, windowDays = 7) {
  const sorted = [...(weights || [])].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((pt, i) => {
    const cutoff = new Date(pt.date).getTime() - (windowDays - 1) * 86400000;
    const win = sorted.filter((w, j) => j <= i && new Date(w.date).getTime() >= cutoff);
    const avg = win.reduce((s, w) => s + w.kg, 0) / win.length;
    return { date: pt.date, kg: Math.round(avg * 10) / 10 };
  });
}

/** Latest 7-day rolling-average weight (the headline number — not raw daily). */
export function latestRollingAvg(weights, windowDays = 7) {
  const s = rollingAvgSeries(weights, windowDays);
  return s.length ? s[s.length - 1].kg : null;
}

/** Count of days that have any logged activity ("locked-in days"). */
export function lockedInDays(dayLogs) {
  if (!dayLogs) return 0;
  return Object.values(dayLogs).filter((log) =>
    log && (log.workoutDone || (log.water || 0) > 0 || (log.steps || 0) > 0 ||
      (log.checks && Object.values(log.checks).some(Boolean)))
  ).length;
}

/** Given the RANKS table and a day count, return current rank + next threshold. */
export function rankFor(ranks, days) {
  let current = ranks[0];
  let next = null;
  for (let i = 0; i < ranks.length; i++) {
    if (days >= ranks[i].min) { current = ranks[i]; next = ranks[i + 1] || null; }
    else break;
  }
  return { current, next, toNext: next ? next.min - days : 0 };
}

/** Minutes since midnight for "HH:MM". */
function toMin(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }

/**
 * 16:8 fasting status for `now`.
 * @returns {{state:'fasting'|'eating', label:string, untilMs:number}}
 *   untilMs = ms until the window flips (opens if fasting, closes if eating).
 */
export function fastingStatus(now, openStr, closeStr) {
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const open = toMin(openStr), close = toMin(closeStr);
  const minToMs = (m) => Math.round(m * 60000);
  if (mins < open) return { state: "fasting", label: "until eating window", untilMs: minToMs(open - mins) };
  if (mins < close) return { state: "eating", label: "left in eating window", untilMs: minToMs(close - mins) };
  return { state: "fasting", label: "until eating window", untilMs: minToMs(24 * 60 - mins + open) };
}

/** Format ms as "Hh Mm". */
export function fmtCountdown(ms) {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Project when the goal is reached from the current weekly rate.
 * @returns {{weeks:number, date:Date}|null} null if not losing weight.
 */
export function etaToGoal(currentKg, goalKg, ratePerWeek, now = new Date()) {
  if (currentKg <= goalKg) return { weeks: 0, date: new Date(now) };
  if (!ratePerWeek || ratePerWeek >= 0) return null; // not losing
  const weeks = (currentKg - goalKg) / Math.abs(ratePerWeek);
  const date = new Date(now.getTime() + weeks * 7 * 86400000);
  return { weeks, date };
}

/**
 * Diet break status. A break is a 7-day window starting at settings.dietBreakStartDate.
 * Returns:
 *   { active: true, daysIntoBreak }     if today is inside the 7-day window
 *   { active: false, daysSinceEnd }     if a previous break ended N days ago
 *   { active: false, never: true }      if there's never been one
 */
export function dietBreakStatus(settings, now = new Date()) {
  if (!settings || !settings.dietBreakStartDate) return { active: false, never: true };
  const days = daysSince(settings.dietBreakStartDate, now);
  if (days < 7) return { active: true, daysIntoBreak: days };
  return { active: false, daysSinceEnd: days - 7 };
}

/** Whole days since the journey start date (local calendar days). */
export function daysSince(startDate, now = new Date()) {
  const [y, m, d] = String(startDate).split("-").map(Number);
  const s = new Date(y, m - 1, d);
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((n - s) / 86400000));
}

export function ageFrom(dob, now = new Date()) {
  const b = new Date(dob);
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}
