/* ============================================================
   day-detail.js — full-screen modal showing one day's snapshot.
   Shared by the Drive mini-calendar and the big Calendar screen.
   ============================================================ */
import { el } from "./ui.js";
import { getState, getDayLog } from "./store.js";

export function openDayDetail(dateKey) {
  const log = getDayLog(dateKey);
  const state = getState();
  const w = state.weights.find((x) => x.date === dateKey);
  const session = state.workoutLog.find((s) => s.date === dateKey);

  const ov = el("div", { style: "position:fixed;inset:0;z-index:80;background:rgba(5,6,8,.96);display:flex;flex-direction:column;align-items:center;padding:24px;overflow:auto" });
  const close = el("button.btn ghost sm", { text: "✕ Close", onclick: () => ov.remove(), style: "align-self:flex-end" });
  const body = el("div.card", { style: "max-width:520px;width:100%;margin-top:14px" });
  const lines = [];
  lines.push(`<h2 style="font-family:var(--ff-display);font-size:2rem;color:var(--lime);margin:0 0 10px">${dateKey}</h2>`);
  if (log.checks && log.checks.__won) lines.push(`<p class="pill lime">🏆 DAY WON</p>`);
  if (w) lines.push(`<p><b>Weight:</b> ${w.kg.toFixed(1)} kg</p>`);
  if (log.water) lines.push(`<p><b>Water:</b> ${log.water.toFixed(2)} L</p>`);
  if (log.steps) lines.push(`<p><b>Steps:</b> ${log.steps.toLocaleString()}</p>`);
  if (log.workoutDone || session) lines.push(`<p><b>Workout:</b> done${session ? ` (${session.workoutId})` : ""}</p>`);
  const checks = Object.entries(log.checks || {}).filter(([k, v]) => v && !k.startsWith("__")).map(([k]) => k).join(", ");
  if (checks) lines.push(`<p><b>Checked:</b> ${checks}</p>`);
  if (log.notes) lines.push(`<p><b>Note:</b> <em>${log.notes.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</em></p>`);
  if (log.customMeals && log.customMeals.length) {
    const k = log.customMeals.reduce((s, m) => s + (m.kcal || 0), 0);
    const p = log.customMeals.reduce((s, m) => s + (m.protein || 0), 0);
    lines.push(`<p><b>Logged extras:</b> ${log.customMeals.length} (${k} kcal · ${Math.round(p)}g P)</p>`);
  }
  if (lines.length === 1) lines.push(`<p class="muted">Nothing logged this day.</p>`);
  body.innerHTML = lines.join("");
  ov.appendChild(close); ov.appendChild(body);
  document.body.appendChild(ov);
}
