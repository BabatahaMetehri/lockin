/* ============================================================
   calendar.js (screen) — bird's-eye Calendar.
   Big month grid. Each day shows scheduled workout, refeed/diet-break
   tags, and small icons for what was logged (⚖️ photo 🎬 🎙 ✍).
   Tap any cell -> openDayDetail. Prev/Next month navigation.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { getState, getSettings } from "../store.js";
import { getAllMedia } from "../db.js";
import { buildMonth } from "../calendar.js";
import { WEEK_SCHEDULE, WORKOUTS } from "../data.js";
import { openDayDetail } from "../day-detail.js";

let viewYear = null, viewMonth = null;

export async function renderCalendar(root) {
  const now = new Date();
  if (viewYear == null) { viewYear = now.getFullYear(); viewMonth = now.getMonth(); }

  root.appendChild(pageHead("Calendar", "Bird's-eye view"));

  // ---- month nav ----
  const monthEl = el("h2", { text: "", style: "font-family:var(--ff-display);font-size:1.6rem;flex:1;text-align:center;margin:0" });
  const nav = el("div", { style: "display:flex;align-items:center;gap:10px;margin-bottom:14px" }, [
    el("button.btn ghost sm", { text: "← Prev", onclick: () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } rerender(root); } }),
    monthEl,
    el("button.btn ghost sm", { text: "Today", onclick: () => { viewYear = now.getFullYear(); viewMonth = now.getMonth(); rerender(root); } }),
    el("button.btn ghost sm", { text: "Next →", onclick: () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } rerender(root); } }),
  ]);
  root.appendChild(nav);

  const s = getSettings();
  const state = getState();

  // load encrypted media (we just need dates / types, not the bytes)
  let mediaByDate = {};
  try {
    const media = await getAllMedia();
    media.forEach((m) => { (mediaByDate[m.date] = mediaByDate[m.date] || []).push(m); });
  } catch { /* unlocked but db unavailable — empty map */ }

  const { weeks, monthLabel } = buildMonth(viewYear, viewMonth, state.dayLogs, now, s.startDate);
  monthEl.textContent = monthLabel;

  // ---- grid ----
  const grid = el("div.bigcal");
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((h) => grid.appendChild(el("div.bigcal-h", { text: h })));
  weeks.forEach((wk) => wk.forEach((c) => grid.appendChild(buildCell(c, s, state, mediaByDate, viewYear, viewMonth))));
  root.appendChild(grid);

  // ---- legend ----
  root.appendChild(card(null, [legend()]));
}

function rerender(root) { root.innerHTML = ""; renderCalendar(root); }

function buildCell(c, settings, state, mediaByDate, year, month) {
  if (!c.day) return el("div.bigcal-d outside");
  const dateKey = c.dateKey;
  const d = new Date(year, month, c.day);
  const dow = d.getDay();

  const scheduled = (settings.schedule && settings.schedule[dow]) || WEEK_SCHEDULE[dow];

  // diet break window?
  let dietBreak = false;
  if (settings.dietBreakStartDate) {
    const [y, m, dd] = settings.dietBreakStartDate.split("-").map(Number);
    const start = new Date(y, m - 1, dd);
    const days = Math.round((d - start) / 86400000);
    dietBreak = days >= 0 && days < 7;
  }
  const refeed = settings.refeedDay != null && settings.refeedDay !== "" && parseInt(settings.refeedDay, 10) === dow;

  const log = state.dayLogs[dateKey];
  const weighed = state.weights.some((w) => w.date === dateKey);
  const hasNote = !!(log && log.notes);
  const items = mediaByDate[dateKey] || [];
  const hasPhoto = items.some((m) => m.type === "photo");
  const hasVideo = items.some((m) => m.type === "video");
  const hasVoice = items.some((m) => m.type === "audio");
  const workoutDone = !!(log && log.workoutDone);

  const cell = el("button.bigcal-d " + c.status, { type: "button" });
  if (dietBreak) cell.classList.add("dietbreak");
  if (refeed) cell.classList.add("refeed");

  cell.appendChild(el("span.bigcal-num", { text: c.day }));

  // top-right scheduled workout pill
  if (["A","B","C","D"].includes(scheduled)) {
    cell.appendChild(el("span.bigcal-pill" + (workoutDone ? " done" : ""), { text: scheduled }));
  } else if (scheduled === "walk") {
    cell.appendChild(el("span.bigcal-pill walk", { text: "W" }));
  } else if (scheduled === "rest") {
    cell.appendChild(el("span.bigcal-pill rest", { text: "R" }));
  }

  // tag row (refeed / diet break)
  const tags = el("div.bigcal-tags");
  if (refeed) tags.appendChild(el("span", { text: "🍱" }));
  if (dietBreak) tags.appendChild(el("span", { text: "🟧" }));
  if (tags.childNodes.length) cell.appendChild(tags);

  // logged-events row (bottom)
  const ev = el("div.bigcal-events");
  if (weighed) ev.appendChild(el("span", { text: "⚖" }));
  if (hasPhoto) ev.appendChild(el("span", { text: "📸" }));
  if (hasVideo) ev.appendChild(el("span", { text: "🎬" }));
  if (hasVoice) ev.appendChild(el("span", { text: "🎙" }));
  if (hasNote) ev.appendChild(el("span", { text: "✍" }));
  if (ev.childNodes.length) cell.appendChild(ev);

  cell.addEventListener("click", () => openDayDetail(dateKey));
  return cell;
}

function legend() {
  const item = (sw, lbl) => el("span.lg-item", {}, [el("span.lg-sw", { html: sw }), el("span", { text: lbl })]);
  return el("div.lg", {}, [
    el("p.kicker", { text: "Legend", style: "width:100%;margin-bottom:4px" }),
    item('<span class="bigcal-pill" style="position:static">A</span>', "Workout day (A/B/C/D)"),
    item('<span class="bigcal-pill walk" style="position:static">W</span>', "Walk day"),
    item('<span class="bigcal-pill rest" style="position:static">R</span>', "Rest day"),
    item('<span class="bigcal-pill done" style="position:static">A</span>', "Workout done"),
    item("🍱", "Refeed day"),
    item("🟧", "Diet break week"),
    item('<span style="display:inline-block;width:14px;height:14px;background:var(--lime);border-radius:3px"></span>', "Day won 🏆"),
    item('<span style="display:inline-block;width:14px;height:14px;background:rgba(198,241,53,.2);border:1px solid rgba(198,241,53,.4);border-radius:3px"></span>', "Activity logged"),
    item('<span style="display:inline-block;width:14px;height:14px;background:rgba(255,91,53,.08);border:1px solid rgba(255,91,53,.25);border-radius:3px"></span>', "Missed"),
    item("⚖", "Weighed-in"),
    item("📸 🎬 🎙 ✍", "Photo / video / voice / note"),
  ]);
}
