/* ============================================================
   motivation.js — streak, milestone badges, your "why", daily line.
   ============================================================ */
import { el, card, pageHead, statBox } from "../ui.js";
import { getState, getSettings, setSettings, latestWeight } from "../store.js";
import { currentStreak, totalLost, lockedInDays, rankFor, weeklyRate, etaToGoal } from "../calc.js";
import { MILESTONES, DAILY_LINES, RANKS } from "../data.js";

export function renderMotivation(root) {
  const s = getSettings();
  const state = getState();
  const streak = currentStreak(state.dayLogs, new Date());
  const lost = totalLost(s.startWeightKg, latestWeight());
  const days = lockedInDays(state.dayLogs);
  const rank = rankFor(RANKS, days);

  root.appendChild(pageHead("Drive", "Why you don't quit this time"));

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

  // all daily lines
  const linesCard = card('📣 <span class="tag">Reminders</span>', []);
  DAILY_LINES.forEach((l) => linesCard.appendChild(el("p", { text: "› " + l, style: "color:var(--muted);margin:6px 0" })));
  root.appendChild(linesCard);
}
