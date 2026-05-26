/* ============================================================
   motivation.js — streak, milestone badges, your "why", daily line.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { getState, getSettings, setSettings, latestWeight } from "../store.js";
import { currentStreak, totalLost } from "../calc.js";
import { MILESTONES, DAILY_LINES } from "../data.js";

export function renderMotivation(root) {
  const s = getSettings();
  const state = getState();
  const streak = currentStreak(state.dayLogs, new Date());
  const lost = totalLost(s.startWeightKg, latestWeight());

  root.appendChild(pageHead("Drive", "Why you don't quit this time"));

  // streak hero
  root.appendChild(card(null, [
    el("div", { style: "text-align:center;padding:8px 0" }, [
      el("div.streak-fire", { html: `🔥 ${streak}` }),
      el("p.kicker", { text: streak === 1 ? "day streak" : "day streak", style: "margin-top:6px" }),
      el("p.muted", { text: streak > 0 ? "Don't break the chain." : "Do anything today to start the chain.", style: "margin:6px 0 0" }),
    ]),
  ]));

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
