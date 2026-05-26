/* ============================================================
   workouts.js — workout list + session mode (log sets, beat last time).
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { WORKOUTS, OVERLOAD_RULE, TRAINING_NOTE, WARMUP, COOLDOWN, WEEK_SCHEDULE } from "../data.js";
import { logWorkout, getLastWorkout, setDayLog, todayKey, getSettings } from "../store.js";
import { toast } from "../router.js";

let pendingOpen = null;
window.addEventListener("open-workout", (e) => { pendingOpen = e.detail; });

export function renderWorkouts(root) {
  if (pendingOpen && WORKOUTS[pendingOpen]) {
    const id = pendingOpen; pendingOpen = null;
    return renderSession(root, id);
  }
  renderList(root);
}

function renderList(root) {
  root.appendChild(pageHead("Train", "4 days / week · home"));

  root.appendChild(card('🏋️ <span class="tag">No gear needed</span>', [
    el("p", { text: TRAINING_NOTE }),
    el("p.macro-line", { text: OVERLOAD_RULE }),
  ]));

  const s = getSettings();
  const sched = s.schedule || WEEK_SCHEDULE;
  const todayId = sched[new Date().getDay()];

  Object.values(WORKOUTS).forEach((w) => {
    const isToday = w.id === todayId;
    const c = card(`<span class="tag">Workout ${w.id}</span> ${w.title}` + (isToday ? ' <span class="pill lime">TODAY</span>' : ""), []);
    const ul = el("ul.list-reset");
    w.exercises.forEach((ex) => ul.appendChild(el("li", { html: `<b>${ex.name}</b> — <span class="accent">${ex.scheme}</span>`, style: "padding:6px 0;border-bottom:1px solid var(--line)" })));
    c.appendChild(ul);
    c.appendChild(el("button.btn", { text: "▶ Start session", onclick: () => { location.hash = "workouts"; renderSession(clear(root), w.id); }, style: "margin-top:12px" }));
    root.appendChild(c);
  });
}

function renderSession(root, id) {
  const w = WORKOUTS[id];
  const last = getLastWorkout(id);
  const lastMap = {};
  if (last) last.exercises.forEach((e) => { lastMap[e.name] = e.sets; });

  root.appendChild(el("header.page-head", {}, [
    el("button.btn ghost sm", { text: "← All workouts", onclick: () => renderList(clear(root)) }),
    el("p.kicker", { text: `Workout ${w.id}`, style: "margin-top:12px" }),
    el("h1", { text: w.title }),
  ]));
  root.appendChild(card(null, [el("p.muted", { html: `<b>Warm-up:</b> ${WARMUP}` })]));

  const session = []; // {name, sets:[{reps,load}]}

  w.exercises.forEach((ex) => {
    const setCount = parseInt((ex.scheme.match(/^(\d+)/) || [])[1] || "3", 10);
    const lastSets = lastMap[ex.name];
    const c = card(`<span style="font-size:1.05rem">${ex.name}</span>`, []);
    c.appendChild(el("p.accent", { text: ex.scheme, style: "font-weight:700;margin-top:-6px" }));
    c.appendChild(el("p.muted", { text: ex.how, style: "font-size:.85rem" }));
    if (lastSets && lastSets.length) {
      const summary = lastSets.map((s) => s.load ? `${s.reps}×${s.load}kg` : `${s.reps}`).join(", ");
      c.appendChild(el("p", { html: `🎯 <b>Beat last time:</b> ${summary}`, style: "color:var(--orange);font-size:.85rem" }));
    }
    const exEntry = { name: ex.name, sets: [] };
    for (let i = 0; i < setCount; i++) {
      const prev = lastSets && lastSets[i];
      const reps = el("input.input", { type: "number", inputmode: "numeric", placeholder: "reps", value: "" });
      const load = el("input.input", { type: "number", inputmode: "numeric", placeholder: "kg", value: "" });
      const setObj = { reps: 0, load: 0 };
      reps.addEventListener("change", () => setObj.reps = parseInt(reps.value || "0", 10));
      load.addEventListener("change", () => setObj.load = parseFloat(load.value || "0"));
      exEntry.sets.push(setObj);
      c.appendChild(el("div.set-row", {}, [
        el("span.n", { text: "#" + (i + 1) }),
        reps, el("span.muted", { text: "reps" }),
        load, el("span.muted", { text: "kg" }),
        prev ? el("span.note", { text: `(was ${prev.reps}${prev.load ? "×" + prev.load : ""})` }) : null,
      ]));
    }
    session.push(exEntry);
    root.appendChild(c);
  });

  root.appendChild(card(null, [el("p.muted", { html: `<b>Cool-down:</b> ${COOLDOWN}` })]));

  root.appendChild(el("button.btn", { text: "✅ Finish & log workout", style: "margin-bottom:30px", onclick: () => {
    const entry = {
      date: todayKey(), workoutId: id,
      exercises: session.map((e) => ({ name: e.name, sets: e.sets.filter((s) => s.reps > 0).map((s) => ({ reps: s.reps, load: s.load || 0 })) })).filter((e) => e.sets.length),
    };
    logWorkout(entry);
    setDayLog(todayKey(), { workoutDone: true });
    toast("Workout logged 💪");
    renderList(clear(root));
  }}));
}

function clear(root) { root.innerHTML = ""; return root; }
