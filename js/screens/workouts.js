/* ============================================================
   workouts.js — beginner workouts + type-aware logging:
     reps        → big +/- counter
     time        → built-in timer
     reps_weight → reps + load fields
   Each exercise has a "Watch tutorial" link.
   Custom exercises (settings.customExercises) appear under their workout.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { WORKOUTS, OVERLOAD_RULE, TRAINING_NOTE, WARMUP, COOLDOWN, WEEK_SCHEDULE } from "../data.js";
import { logWorkout, getLastWorkout, setDayLog, todayKey, getSettings } from "../store.js";
import { toast } from "../router.js";

let pendingOpen = null;
window.addEventListener("open-workout", (e) => { pendingOpen = e.detail; });

export function renderWorkouts(root) {
  if (pendingOpen && (WORKOUTS[pendingOpen] || pendingOpen)) {
    const id = pendingOpen; pendingOpen = null;
    return renderSession(root, id);
  }
  renderList(root);
}

function exercisesFor(id) {
  const base = (WORKOUTS[id] && WORKOUTS[id].exercises) || [];
  const custom = (getSettings().customExercises || []).filter((c) => c.workoutId === id);
  return [...base, ...custom];
}

function renderList(root) {
  root.appendChild(pageHead("Train", "Beginner-scaled · ~20 min"));

  root.appendChild(card('🏋️ <span class="tag">No gear needed</span>', [
    el("p", { text: TRAINING_NOTE }),
    el("p.macro-line", { text: OVERLOAD_RULE }),
  ]));

  const s = getSettings();
  const sched = s.schedule || WEEK_SCHEDULE;
  const todayId = sched[new Date().getDay()];

  Object.values(WORKOUTS).forEach((w) => {
    const isToday = w.id === todayId;
    const exs = exercisesFor(w.id);
    const c = card(`<span class="tag">Workout ${w.id}</span> ${w.title}` + (isToday ? ' <span class="pill lime">TODAY</span>' : ""), []);
    if (w.duration) c.appendChild(el("p.muted", { text: w.duration, style: "font-size:.8rem;margin-top:-6px" }));
    const ul = el("ul.list-reset");
    exs.forEach((ex) => ul.appendChild(el("li", { html: `<b>${ex.name}</b> — <span class="accent">${ex.scheme}</span>`, style: "padding:6px 0;border-bottom:1px solid var(--line)" })));
    c.appendChild(ul);
    c.appendChild(el("button.btn big", { text: "▶ Start session", onclick: () => renderSession(clear(root), w.id), style: "margin-top:12px" }));
    root.appendChild(c);
  });
}

function renderSession(root, id) {
  const w = WORKOUTS[id];
  const exs = exercisesFor(id);
  const last = getLastWorkout(id);
  const lastMap = {};
  if (last) last.exercises.forEach((e) => { lastMap[e.name] = e.sets; });

  root.appendChild(el("header.page-head", {}, [
    el("button.btn ghost sm", { text: "← All workouts", onclick: () => renderList(clear(root)) }),
    el("p.kicker", { text: `Workout ${w.id}`, style: "margin-top:12px" }),
    el("h1", { text: w.title }),
  ]));
  root.appendChild(card(null, [el("p.muted", { html: `<b>Warm-up:</b> ${WARMUP}` })]));

  const session = []; // {name, kind, sets:[...]}

  exs.forEach((ex) => {
    const wrap = el("div.ex-card");
    wrap.appendChild(el("div.ex-head", {}, [
      el("div", {}, [el("div.ex-name", { text: ex.name }), el("div.ex-how", { text: ex.how || "" })]),
      el("div.ex-scheme", { text: ex.scheme }),
    ]));
    if (ex.video) wrap.appendChild(el("a.ex-video", { href: ex.video, target: "_blank", rel: "noopener noreferrer", html: "▶ Watch tutorial" }));

    const prev = lastMap[ex.name];
    if (prev && prev.length) {
      const summary = prev.map((s) => s.seconds ? `${s.seconds}s` : s.load ? `${s.reps}×${s.load}kg` : `${s.reps}`).join(", ");
      wrap.appendChild(el("p.ex-prev", { html: `🎯 Beat last: ${summary}` }));
    }

    const entry = { name: ex.name, kind: ex.kind || "reps", sets: [] };
    const sets = (ex.target && ex.target.sets) || 3;
    for (let i = 0; i < sets; i++) {
      if (entry.kind === "time") wrap.appendChild(timerRow(i, ex.target, prev && prev[i], entry));
      else if (entry.kind === "reps_weight") wrap.appendChild(weightRow(i, ex.target, prev && prev[i], entry));
      else wrap.appendChild(repRow(i, ex.target, prev && prev[i], entry));
    }
    session.push(entry);
    root.appendChild(wrap);
  });

  root.appendChild(card(null, [el("p.muted", { html: `<b>Cool-down:</b> ${COOLDOWN}` })]));

  root.appendChild(el("button.btn huge", { text: "✅ Finish & log workout", style: "margin-bottom:30px", onclick: () => {
    const entry = {
      date: todayKey(), workoutId: id,
      exercises: session.map((e) => ({
        name: e.name,
        sets: e.sets.filter((s) => s.reps > 0 || s.seconds > 0).map((s) => ({ ...s })),
      })).filter((e) => e.sets.length),
    };
    logWorkout(entry);
    setDayLog(todayKey(), { workoutDone: true });
    toast("Workout logged 💪");
    renderList(clear(root));
  }}));
}

/* ---- reps counter row ---- */
function repRow(i, target, prev, entry) {
  const setObj = { reps: 0, load: 0 };
  entry.sets.push(setObj);
  const goal = target && target.reps ? `goal ${target.reps}` : "";
  const prevStr = prev ? `prev ${prev.reps}` : "";
  const v = el("span.v", { text: "0" });
  const minus = el("button", { text: "−", onclick: () => { setObj.reps = Math.max(0, setObj.reps - 1); v.textContent = setObj.reps; mark(row, setObj.reps); } });
  const plus = el("button.plus", { text: "+", onclick: () => { setObj.reps += 1; v.textContent = setObj.reps; mark(row, setObj.reps); } });
  const row = el("div.rep-row", {}, [
    el("span.rn", { text: "#" + (i + 1) }),
    el("div.rp", {}, [minus, v, plus]),
    el("span.target", { text: [prevStr, goal].filter(Boolean).join(" · ") }),
  ]);
  function mark(r, n) { r.classList.toggle("done", n > 0); }
  return row;
}

/* ---- timer row (kind=time) ---- */
function timerRow(i, target, prev, entry) {
  const setObj = { reps: 0, seconds: 0 };
  entry.sets.push(setObj);
  const goal = target && target.seconds ? target.seconds : 20;
  const disp = el("div.tdisp", { text: "0s" });
  let interval = null, t0 = 0;
  const btn = el("button.start", { text: "Start" });
  btn.addEventListener("click", () => {
    if (interval) { // stop
      clearInterval(interval); interval = null;
      btn.textContent = "Start"; btn.className = "start";
    } else { // start
      t0 = Date.now() - (setObj.seconds * 1000);
      btn.textContent = "Stop"; btn.className = "stop";
      interval = setInterval(() => {
        setObj.seconds = Math.floor((Date.now() - t0) / 1000);
        disp.textContent = setObj.seconds + "s";
        disp.classList.toggle("urgent", setObj.seconds >= goal);
        setObj.reps = setObj.seconds; // count "rep" for tasks complete
      }, 200);
    }
  });
  return el("div.timer-row", {}, [
    el("span.rn", { text: "#" + (i + 1) }), disp, btn,
    el("span.target", { text: `goal ${goal}s${prev ? ` · prev ${prev.seconds || 0}s` : ""}`, style: "font-size:.7rem;color:var(--muted)" }),
  ]);
}

/* ---- reps + load row (kind=reps_weight) ---- */
function weightRow(i, target, prev, entry) {
  const setObj = { reps: 0, load: 0 };
  entry.sets.push(setObj);
  const reps = el("input.input", { type: "number", inputmode: "numeric", placeholder: "reps", value: "" });
  const load = el("input.input", { type: "number", inputmode: "decimal", placeholder: "kg", value: "" });
  reps.addEventListener("change", () => setObj.reps = parseInt(reps.value || "0", 10));
  load.addEventListener("change", () => setObj.load = parseFloat(load.value || "0"));
  return el("div.rw-row", {}, [
    el("span.rn", { text: "#" + (i + 1) }),
    reps, el("span.muted", { text: "reps" }),
    load, el("span.muted", { text: "kg" }),
    prev ? el("span.target", { text: `prev ${prev.reps}×${prev.load || 0}kg` }) : null,
  ]);
}

function clear(root) { root.innerHTML = ""; return root; }
