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
export function estTDEE(kg, cm, age, activity = 1.45) {
  return bmrMale(kg, cm, age) * activity;
}

export function ageFrom(dob, now = new Date()) {
  const b = new Date(dob);
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}
