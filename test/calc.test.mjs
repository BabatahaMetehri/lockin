import assert from "node:assert/strict";
import { bmi, bmiCategory, totalLost, progressPct, weeklyRate, currentStreak, ageFrom } from "../js/calc.js";

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

console.log(`PASSED ${pass} calc tests\n`);
