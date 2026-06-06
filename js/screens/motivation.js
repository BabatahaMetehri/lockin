/* ============================================================
   motivation.js — streak, milestone badges, your "why", daily line.
   ============================================================ */
import { el, card, pageHead, statBox } from "../ui.js";
import { getState, getSettings, setSettings, latestWeight, getDayLog } from "../store.js";
import { currentStreak, totalLost, lockedInDays, rankFor, weeklyRate, etaToGoal } from "../calc.js";
import { MILESTONES, DAILY_LINES, RANKS } from "../data.js";
import { buildMonth } from "../calendar.js";
import { openDayDetail } from "../day-detail.js";
import { heroQuote } from "../quotes.js";

export function renderMotivation(root) {
  const s = getSettings();
  const state = getState();
  const streak = currentStreak(state.dayLogs, new Date());
  const lost = totalLost(s.startWeightKg, latestWeight());
  const days = lockedInDays(state.dayLogs);
  const rank = rankFor(RANKS, days);

  root.appendChild(pageHead("Drive", "Why you don't quit this time"));

  // big vibrant motivation quote (relocated off the rail home)
  root.appendChild(heroQuote());

  // streak hero
  root.appendChild(card(null, [
    el("div", { style: "text-align:center;padding:8px 0" }, [
      el("div.streak-fire", { html: `🔥 ${streak}` }),
      el("p.kicker", { text: streak === 1 ? "day streak" : "day streak", style: "margin-top:6px" }),
      el("p.muted", { text: streak > 0 ? "Don't break the chain." : "Do anything today to start the chain.", style: "margin:6px 0 0" }),
    ]),
  ]));

  // rank
  const rankCard = card('🎖️ <span class="tag">Your rank</span>', []);
  rankCard.appendChild(el("div.row-between", {}, [
    el("div", {}, [
      el("div.streak-fire", { html: `${rank.current.icon} ${rank.current.title}`, style: "font-size:2.2rem;color:var(--lime)" }),
      el("small.note", { text: `${days} locked-in day${days === 1 ? "" : "s"}` }),
    ]),
    rank.next ? el("span.pill mut", { text: `${rank.toNext} → ${rank.next.title}` }) : el("span.pill lime", { text: "MAX 🏆" }),
  ]));
  const ladder = el("div", { style: "display:flex;gap:6px;flex-wrap:wrap;margin-top:12px" });
  RANKS.forEach((r) => ladder.appendChild(el("span.pill " + (days >= r.min ? "lime" : "mut"), { html: `${r.icon} ${r.title}`, style: "font-size:.62rem" })));
  rankCard.appendChild(ladder);
  root.appendChild(rankCard);

  // ---- WEEKLY REVIEW ----
  const wr = weeklyReview(state, new Date());
  const wrCard = card('📊 <span class="tag">This week</span>', []);
  wrCard.appendChild(el("div.stat-row", {}, [
    statBox(wr.daysWon + "/7", "days won", "lime"),
    statBox(wr.workouts, "workouts", "lime"),
    statBox(wr.avgWeight ? wr.avgWeight.toFixed(1) : "—", "avg kg"),
    statBox(wr.weightDelta == null ? "—" : (wr.weightDelta <= 0 ? "−" : "+") + Math.abs(wr.weightDelta).toFixed(1), "vs last wk", wr.weightDelta < 0 ? "lime" : wr.weightDelta > 0 ? "orange" : ""),
  ]));
  wrCard.appendChild(el("p", { html: wr.message, style: "margin:6px 0 0" }));
  root.appendChild(wrCard);

  // ---- monthly streak calendar ----
  const now = new Date();
  const calCard = card('🗓️ <span class="tag">This month</span>', []);
  const { weeks, monthLabel } = buildMonth(now.getFullYear(), now.getMonth(), state.dayLogs, now, s.startDate);
  calCard.appendChild(el("p.kicker", { text: monthLabel, style: "margin-bottom:8px" }));
  const calGrid = el("div.cal");
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((h) => calGrid.appendChild(el("div.h", { text: h })));
  weeks.forEach((wk) => wk.forEach((c) => {
    calGrid.appendChild(el("div.d " + c.status, { text: c.day != null ? String(c.day) : "" }));
  }));
  calCard.appendChild(calGrid);
  calCard.appendChild(el("p.note", { html: '<span class="pill lime" style="font-size:.6rem">FULL</span> day won · <span class="pill mut" style="font-size:.6rem">DIM</span> any activity · <span class="pill orange" style="font-size:.6rem">RED</span> missed', style: "margin-top:10px" }));
  calCard.appendChild(el("button.btn ghost", { text: "📅 Open big bird's-eye calendar →", style: "margin-top:10px", onclick: () => { location.hash = "calendar"; } }));
  root.appendChild(calCard);

  // goal ETA
  const rate = weeklyRate(state.weights);
  const eta = etaToGoal(latestWeight(), s.goalWeightKg, rate);
  const etaCard = card('📅 <span class="tag">Projected finish</span>', []);
  if (eta && eta.weeks > 0) {
    const dateStr = eta.date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    etaCard.appendChild(el("div.stat-row", {}, [
      statBox(Math.ceil(eta.weeks), "weeks to 80kg", "lime"),
      statBox(Math.abs(rate).toFixed(2), "kg / week", "lime"),
    ]));
    etaCard.appendChild(el("p", { html: `At your current pace you hit <b>80 kg around ${dateStr}</b>. Keep stacking days.` , style: "margin-bottom:0" }));
  } else {
    etaCard.appendChild(el("p.muted", { text: "Log a couple of weigh-ins a week apart and I'll project your finish date here.", style: "margin:0" }));
  }
  root.appendChild(etaCard);

  // why
  const whyCard = card('🎯 <span class="tag">My why</span>', []);
  const ta = el("textarea.input", { rows: "3", placeholder: "Write why you're doing this. Read it when you want to quit." }, []);
  ta.value = s.whyText || "";
  const save = el("button.btn", { text: "Save my why", style: "margin-top:10px", onclick: () => { setSettings({ whyText: ta.value.trim() }); save.textContent = "Saved ✓"; setTimeout(() => save.textContent = "Save my why", 1200); } });
  whyCard.appendChild(ta); whyCard.appendChild(save);
  root.appendChild(whyCard);

  // milestones
  const msCard = card('🏅 <span class="tag">Milestones</span> ' + `<span class="pill lime">−${lost.toFixed(1)} kg</span>`, []);
  const grid = el("div.badge-grid");
  MILESTONES.forEach((m) => {
    const unlocked = lost >= m.kg - 1e-6;
    grid.appendChild(el("div.badge" + (unlocked ? " unlocked" : ""), {}, [
      el("div.ico", { text: m.icon }),
      el("div.lbl", { text: m.label }),
    ]));
  });
  msCard.appendChild(grid);
  root.appendChild(msCard);

  // calendar day drill-down
  document.querySelectorAll(".cal .d").forEach((cell, i) => {
    const txt = cell.textContent.trim(); if (!txt) return;
    cell.style.cursor = "pointer";
    cell.addEventListener("click", () => {
      const day = parseInt(txt, 10);
      const k = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      openDayDetail(k);
    });
  });

  // all daily lines
  const linesCard = card('📣 <span class="tag">Reminders</span>', []);
  DAILY_LINES.forEach((l) => linesCard.appendChild(el("p", { text: "› " + l, style: "color:var(--muted);margin:6px 0" })));
  root.appendChild(linesCard);
}

/** Summarise the last 7 days vs the 7 before. */
function weeklyReview(state, now) {
  const day = (n) => { const d = new Date(now); d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  let daysWon = 0, workouts = 0, weightsSum = 0, weightsN = 0;
  for (let i = 0; i < 7; i++) {
    const k = day(i); const log = state.dayLogs[k];
    if (log) { if (log.checks && log.checks.__won) daysWon++; if (log.workoutDone) workouts++; }
    const w = state.weights.find((x) => x.date === k);
    if (w) { weightsSum += w.kg; weightsN++; }
  }
  const avgWeight = weightsN ? weightsSum / weightsN : null;
  let prevSum = 0, prevN = 0;
  for (let i = 7; i < 14; i++) { const k = day(i); const w = state.weights.find((x) => x.date === k); if (w) { prevSum += w.kg; prevN++; } }
  const prevAvg = prevN ? prevSum / prevN : null;
  const weightDelta = (avgWeight != null && prevAvg != null) ? avgWeight - prevAvg : null;
  let message;
  if (daysWon >= 5) message = "🔥 Outstanding week — keep the chain.";
  else if (daysWon >= 3) message = "Solid week. Push for 5 next week.";
  else if (workouts > 0 || daysWon > 0) message = "You showed up. Build on it next week.";
  else message = "Reset this week. Open the app and check one thing today.";
  return { daysWon, workouts, avgWeight, weightDelta, message };
}

