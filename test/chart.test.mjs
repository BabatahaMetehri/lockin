import assert from "node:assert/strict";
import { buildWeightChart } from "../js/chart.js";

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("  ok -", name); };

console.log("chart.test.mjs");

t("empty input", () => {
  const c = buildWeightChart([], 320, 140);
  assert.equal(c.empty, true);
  assert.equal(c.dots.length, 0);
});

t("single point centered", () => {
  const c = buildWeightChart([{ date: "2026-05-26", kg: 100 }], 320, 140, 8);
  assert.equal(c.dots.length, 1);
  assert.ok(Math.abs(c.dots[0].x - 160) < 1, `x=${c.dots[0].x}`);
});

t("two points: first left, last right; higher kg = higher up (smaller y)", () => {
  const c = buildWeightChart([
    { date: "2026-05-01", kg: 112 },
    { date: "2026-05-15", kg: 108 },
  ], 320, 140, 8);
  assert.equal(c.dots.length, 2);
  assert.ok(c.dots[0].x < c.dots[1].x);
  // 112 is the max -> should be at top (smaller y) than 108
  assert.ok(c.dots[0].y < c.dots[1].y, `y0=${c.dots[0].y} y1=${c.dots[1].y}`);
  assert.ok(c.line.startsWith("M"));
  assert.ok(c.area.endsWith("Z"));
});

t("goal line produces goalY within bounds", () => {
  const c = buildWeightChart([
    { date: "2026-05-01", kg: 112 },
    { date: "2026-05-15", kg: 100 },
  ], 320, 140, 8, 80);
  assert.ok(c.goalY !== null);
  assert.ok(c.goalY >= 0 && c.goalY <= 140);
});

console.log(`PASSED ${pass} chart tests\n`);
