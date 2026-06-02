import assert from "node:assert/strict";
import { buildMonth } from "../js/calendar.js";

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("  ok -", name); };

console.log("calendar.test.mjs");

t("Monday-first layout: May 2026 starts Fri so first row has 4 outside cells", () => {
  // May 1 2026 is a Friday → Mon-first index 4
  const { weeks } = buildMonth(2026, 4, {}, new Date(2026, 4, 26));
  assert.equal(weeks[0].slice(0, 4).every((c) => c.status === "outside"), true);
  assert.equal(weeks[0][4].day, 1);
});

t("today + dayWon + missed classification", () => {
  const today = new Date(2026, 4, 26);
  const logs = {
    "2026-05-25": { workoutDone: true },                 // partial
    "2026-05-26": { checks: { __won: true, m1: true } }, // today + full
    "2026-05-24": {},                                    // missed (no activity)
  };
  const { weeks } = buildMonth(2026, 4, logs, today, "2026-05-01");
  const flat = weeks.flat();
  const d24 = flat.find((c) => c.day === 24);
  const d25 = flat.find((c) => c.day === 25);
  const d26 = flat.find((c) => c.day === 26);
  const d27 = flat.find((c) => c.day === 27);
  assert.equal(d24.status, "missed");
  assert.equal(d25.status, "partial");
  assert.ok(d26.status.includes("full") && d26.status.includes("today"));
  assert.equal(d27.status, "future");
});

t("days before startDate are 'outside'", () => {
  const today = new Date(2026, 4, 26);
  const { weeks } = buildMonth(2026, 4, {}, today, "2026-05-15");
  const flat = weeks.flat();
  const d5 = flat.find((c) => c.day === 5);
  const d20 = flat.find((c) => c.day === 20);
  assert.equal(d5.status, "outside");
  assert.equal(d20.status, "missed");
});

console.log(`PASSED ${pass} calendar tests\n`);
