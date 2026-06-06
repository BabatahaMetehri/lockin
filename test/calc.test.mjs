import assert from "node:assert/strict";
import { bmi, bmiCategory, totalLost, progressPct, weeklyRate, currentStreak, ageFrom,
  lockedInDays, rankFor, fastingStatus, fmtCountdown, etaToGoal, daysSince, dietBreakStatus,
  calorieTargetFor, masterClockNow, latestRollingAvg, rollingAvgSeries } from "../js/calc.js";
import { RANKS, MASTER_CLOCK } from "../js/data.js";

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("  ok -", name); };

console.log("calc.test.mjs");

t("bmi for 112.7kg @175cm ~36.8", () => {
  const v = bmi(112.7, 175);
  assert.ok(Math.abs(v - 36.8) < 0.1, `got ${v}`);
});

t("bmiCategory boundaries", () => {
  assert.equal(bmiCategory(36.8), "Obese II");
  assert.equal(bmiCategory(24.9), "Normal");
  assert.equal(bmiCategory(80 / (1.75 * 1.75)), "Overweight"); // goal 80kg -> 26.1
});

t("totalLost", () => {
  assert.ok(Math.abs(totalLost(112.7, 100) - 12.7) < 1e-9);
});

t("progressPct 112.7 -> 80", () => {
  assert.equal(progressPct(112.7, 112.7, 80), 0);
  assert.ok(Math.abs(progressPct(112.7, 96.35, 80) - 50) < 0.01);
  assert.equal(progressPct(112.7, 80, 80), 100);
  assert.equal(progressPct(112.7, 70, 80), 100); // clamped
});

t("weeklyRate ~ -1kg/week", () => {
  const w = [
    { date: "2026-05-01", kg: 112 },
    { date: "2026-05-08", kg: 111 },
    { date: "2026-05-15", kg: 110 },
  ];
  const r = weeklyRate(w, 30);
  assert.ok(Math.abs(r - -1) < 0.05, `got ${r}`);
});

t("currentStreak counts consecutive active days", () => {
  const today = new Date(2026, 4, 26); // May 26 2026
  const logs = {
    "2026-05-26": { checks: { x: true } },
    "2026-05-25": { water: 2 },
    "2026-05-24": { workoutDone: true },
    // 23rd missing -> break
    "2026-05-22": { steps: 5000 },
  };
  assert.equal(currentStreak(logs, today), 3);
});

t("currentStreak 0 when today empty", () => {
  const today = new Date(2026, 4, 26);
  assert.equal(currentStreak({ "2026-05-25": { water: 1 } }, today), 0);
});

t("ageFrom DOB 2000-01-18 on 2026-05-26 = 26", () => {
  assert.equal(ageFrom("2000-01-18", new Date(2026, 4, 26)), 26);
});

t("lockedInDays counts active days only", () => {
  const logs = { a: { checks: { x: true } }, b: { water: 1 }, c: { checks: {} }, d: {} };
  assert.equal(lockedInDays(logs), 2);
});

t("rankFor returns current + next", () => {
  let r = rankFor(RANKS, 0); assert.equal(r.current.title, "Rookie"); assert.equal(r.next.title, "Committed");
  r = rankFor(RANKS, 14); assert.equal(r.current.title, "Locked In"); assert.equal(r.toNext, 30 - 14);
  r = rankFor(RANKS, 500); assert.equal(r.current.title, "Unbreakable"); assert.equal(r.next, null);
});

t("fastingStatus: before window = fasting, inside = eating", () => {
  const at = (h, m) => new Date(2026, 4, 26, h, m);
  assert.equal(fastingStatus(at(9, 0), "12:30", "20:00").state, "fasting");
  assert.equal(fastingStatus(at(14, 0), "12:30", "20:00").state, "eating");
  assert.equal(fastingStatus(at(22, 0), "12:30", "20:00").state, "fasting");
  // 9:00 -> 12:30 is 3h30m
  assert.equal(fmtCountdown(fastingStatus(at(9, 0), "12:30", "20:00").untilMs), "3h 30m");
});

t("etaToGoal projects weeks when losing, null when not", () => {
  const eta = etaToGoal(100, 80, -1); // 20kg at 1kg/wk = 20 weeks
  assert.ok(Math.abs(eta.weeks - 20) < 1e-6);
  assert.equal(etaToGoal(100, 80, 0), null);
  assert.equal(etaToGoal(100, 80, 0.5), null); // gaining
  assert.equal(etaToGoal(80, 80, -1).weeks, 0); // already there
});

t("daysSince", () => {
  assert.equal(daysSince("2026-05-20", new Date(2026, 4, 26)), 6);
});

t("dietBreakStatus: never / active / past", () => {
  assert.deepEqual(dietBreakStatus({}, new Date(2026, 4, 26)), { active: false, never: true });
  // active on day 0 and day 6, not on day 7
  const s = { dietBreakStartDate: "2026-05-20" };
  assert.equal(dietBreakStatus(s, new Date(2026, 4, 20)).active, true);
  assert.equal(dietBreakStatus(s, new Date(2026, 4, 26)).active, true);
  assert.equal(dietBreakStatus(s, new Date(2026, 4, 27)).active, false);
  // 10 days after start = 3 days since end
  assert.equal(dietBreakStatus(s, new Date(2026, 4, 30)).daysSinceEnd, 3);
});

t("calorieTargetFor: 1650 base, −100 per 15kg, floored", () => {
  assert.equal(calorieTargetFor(112.7, 112.7).target, 1650);
  assert.equal(calorieTargetFor(112.7, 112.7).tier, 0);
  assert.equal(calorieTargetFor(112.7, 97.7).target, 1550); // −15kg
  assert.equal(calorieTargetFor(112.7, 97.7).tier, 1);
  assert.equal(calorieTargetFor(112.7, 82.7).target, 1450); // −30kg
  assert.equal(calorieTargetFor(112.7, 80).target, 1450);   // −32.7kg still tier 2
  assert.equal(calorieTargetFor(112.7, 40, { floor: 1400 }).target, 1400); // floored
});

t("calorieTargetFor: nextRecalcWeight", () => {
  assert.ok(Math.abs(calorieTargetFor(112.7, 112.7).nextRecalcWeight - 97.7) < 1e-9);
  assert.ok(Math.abs(calorieTargetFor(112.7, 97.7).nextRecalcWeight - 82.7) < 1e-9);
});

t("masterClockNow resolves current/next", () => {
  const at = (h, m) => new Date(2026, 5, 3, h, m);
  // 14:30 → current is meal1 (14:00), next is work2 (15:00)
  let r = masterClockNow(at(14, 30), MASTER_CLOCK);
  assert.equal(r.current.id, "meal1");
  assert.equal(r.next.id, "work2");
  // 06:00 (before first 08:00) → carry-over: current = last (sleep), next = wake
  r = masterClockNow(at(6, 0), MASTER_CLOCK);
  assert.equal(r.current.id, "sleep");
  assert.equal(r.next.id, "wake");
  // 23:00 (after last) → current = sleep, next wraps to wake
  r = masterClockNow(at(23, 0), MASTER_CLOCK);
  assert.equal(r.current.id, "sleep");
  assert.equal(r.next.id, "wake");
});

t("rolling 7-day average smooths and reports latest", () => {
  const w = [
    { date: "2026-06-01", kg: 110 },
    { date: "2026-06-02", kg: 112 }, // noise spike
    { date: "2026-06-03", kg: 109 },
  ];
  const series = rollingAvgSeries(w, 7);
  assert.equal(series.length, 3);
  assert.equal(series[0].kg, 110);
  assert.ok(Math.abs(latestRollingAvg(w, 7) - 110.3) < 0.05); // (110+112+109)/3
  assert.equal(latestRollingAvg([], 7), null);
});

console.log(`PASSED ${pass} calc tests\n`);
