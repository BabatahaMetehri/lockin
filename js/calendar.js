/* ============================================================
   calendar.js — PURE. Build a month grid of day cells with status.
   Status: 'full' (day won) | 'partial' (any activity) | 'missed' | 'future' | 'today'
   ============================================================ */

function key(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }

function isActive(log) {
  return !!log && ((log.checks && Object.values(log.checks).some(Boolean)) || log.workoutDone || (log.water || 0) > 0 || (log.steps || 0) > 0);
}

function dayWon(log) { return !!(log && log.checks && log.checks.__won); }

/**
 * @param {number} year
 * @param {number} month  0-indexed (Jan = 0)
 * @param {Object} dayLogs  the store's dayLogs map
 * @param {Date}   today
 * @param {string} startDate  "YYYY-MM-DD" — anything before this is 'outside'
 * @returns {{ weeks: Array<Array<{day:number, status:string, dateKey:string|null}>>, monthLabel:string }}
 */
export function buildMonth(year, month, dayLogs, today = new Date(), startDate = null) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0); // last day of month
  // Monday-first week — convert Sun=0..Sat=6 → Mon=0..Sun=6
  const startDow = (first.getDay() + 6) % 7;
  const totalCells = Math.ceil((startDow + last.getDate()) / 7) * 7;
  const tKey = key(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const startKey = startDate || null;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDow + 1;
    if (dayNum < 1 || dayNum > last.getDate()) { cells.push({ day: null, status: "outside", dateKey: null }); continue; }
    const d = new Date(year, month, dayNum);
    const k = key(d);
    let status;
    if (k > tKey) status = "future";
    else if (startKey && k < startKey) status = "outside";
    else if (k === tKey) status = dayWon(dayLogs[k]) ? "full today" : isActive(dayLogs[k]) ? "partial today" : "today";
    else if (dayWon(dayLogs[k])) status = "full";
    else if (isActive(dayLogs[k])) status = "partial";
    else status = "missed";
    cells.push({ day: dayNum, status, dateKey: k });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const monthLabel = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return { weeks, monthLabel };
}
