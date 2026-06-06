/* ============================================================
   workouts.js — beginner workouts + type-aware logging:
     reps        → big +/- counter
     time        → built-in timer
     reps_weight → reps + load fields
   Each exercise has a "Watch tutorial" link.
   Custom exercises (settings.customExercises) appear under their workout.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { WORKOUTS, OVERLOAD_RULE, TRAINING_NOTE, WARMUP, COOLDOWN, WEEK_SCHEDULE, BANDS_EXTRA } from "../data.js";
import { logWorkout, getLastWorkout, setDayLog, todayKey, getSettings, getState } from "../store.js";
import { toast } from "../router.js";
import { beep, vibrate, chime } from "../feedback.js";
import { buildWeightChart } from "../chart.js";

/** Walk history, return the personal best for an exercise of a given kind. */
function bestFor(name, kind) {
  let best = null;
  const wl = getState().workoutLog || [];
  for (const session of wl) {
    for (const ex of session.exercises) {
      if (ex.name !== name) continue;
      for (const set of ex.sets) {
        let val;
        if (kind === "time") val = set.seconds || 0;
        else if (kind === "reps_weight") val = (set.reps || 0) * Math.max(1, set.load || 1);
        else val = set.reps || 0;
        if (val > 0 && (best == null || val > best.value)) best = { value: val, set, kind };
      }
    }
  }
  return best;
}
function prDisplay(best) {
  if (!best) return null;
  if (best.kind === "time") return `🥇 PR ${best.set.seconds}s`;
  if (best.kind === "reps_weight") return `🥇 PR ${best.set.reps}×${best.set.load}kg`;
  return `🥇 PR ${best.set.reps} reps`;
}

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
  // Resistance-band unlock: Upper = B/D, Lower = A/C.
  let bands = [];
  if (getSettings().bandsArrived) {
    bands = (id === "B" || id === "D") ? BANDS_EXTRA.upper : (id === "A" || id === "C") ? BANDS_EXTRA.lower : [];
  }
  return [...base, ...bands, ...custom];
}

function renderList(root) {
  root.appendChild(pageHead("Train", "Beginner-scaled · ~20 min"));

  root.appendChild(card('🏋️ <span class="tag">No gear needed</span>', [
    el("p", { text: TRAINING_NOTE }),
    el("p.macro-line", { text: OVERLOAD_RULE }),
    el("button.btn ghost", { text: "📈 My progress (all exercises)", style: "margin-top:10px", onclick: () => renderProgress(clear(root)) }),
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
    exs.forEach((ex) => {
      const pr = prDisplay(bestFor(ex.name, ex.kind || "reps"));
      ul.appendChild(el("li", {
        html: `<b>${ex.name}</b> — <span class="accent">${ex.scheme}</span>` + (pr ? ` <span class="pill orange" style="font-size:.62rem;margin-left:6px">${pr}</span>` : ""),
        style: "padding:6px 0;border-bottom:1px solid var(--line)"
      }));
    });
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
    const pr = prDisplay(bestFor(ex.name, ex.kind || "reps"));
    if (pr) wrap.appendChild(el("p.ex-prev", { html: pr, style: "color:var(--lime)" }));

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
        name: e.name, kind: e.kind,
        sets: e.sets.filter((s) => s.reps > 0 || s.seconds > 0).map((s) => ({ ...s })),
      })).filter((e) => e.sets.length),
    };
    logWorkout(entry);
    setDayLog(todayKey(), { workoutDone: true });
    chime();
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
  let interval = null, t0 = 0, signaled = false;
  const btn = el("button.start", { text: "Start" });
  btn.addEventListener("click", () => {
    if (interval) { // stop
      clearInterval(interval); interval = null;
      btn.textContent = "Start"; btn.className = "start";
    } else { // start
      t0 = Date.now() - (setObj.seconds * 1000);
      btn.textContent = "Stop"; btn.className = "stop";
      signaled = setObj.seconds >= goal;
      interval = setInterval(() => {
        setObj.seconds = Math.floor((Date.now() - t0) / 1000);
        disp.textContent = setObj.seconds + "s";
        const past = setObj.seconds >= goal;
        disp.classList.toggle("urgent", past);
        if (past && !signaled) { signaled = true; beep(1320, 240); vibrate([60, 40, 60]); }
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

/* ---- "My progress" view: line chart of best-set per session per exercise ---- */
function inferKind(sets) {
  if (!sets || !sets.length) return "reps";
  if (sets.some((s) => s.seconds > 0)) return "time";
  if (sets.some((s) => s.load > 0)) return "reps_weight";
  return "reps";
}
function bestVal(sets, kind) {
  if (kind === "time") return Math.max(0, ...sets.map((s) => s.seconds || 0));
  if (kind === "reps_weight") return Math.max(0, ...sets.map((s) => s.load || 0));
  return Math.max(0, ...sets.map((s) => s.reps || 0));
}
function fmtVal(v, kind) {
  if (kind === "time") return v + "s";
  if (kind === "reps_weight") return v + "kg";
  return v + " reps";
}

function renderProgress(root) {
  root.appendChild(el("header.page-head", {}, [
    el("button.btn ghost sm", { text: "← All workouts", onclick: () => renderList(clear(root)) }),
    el("p.kicker", { text: "Beat last time", style: "margin-top:12px" }),
    el("h1", { text: "My progress 📈" }),
  ]));

  const wl = getState().workoutLog || [];
  const map = {}; // name -> { kind, points: [{date, kg}] }
  wl.forEach((session) => session.exercises.forEach((ex) => {
    const kind = ex.kind || inferKind(ex.sets);
    const v = bestVal(ex.sets, kind); if (v <= 0) return;
    (map[ex.name] = map[ex.name] || { kind, points: [] }).points.push({ date: session.date, kg: v });
  }));

  const names = Object.keys(map).sort();
  if (!names.length) {
    root.appendChild(card(null, [el("p.muted", { text: "Log a workout first, then come back to see your line climb here." })]));
    return;
  }

  names.forEach((name) => {
    const { kind, points } = map[name];
    points.sort((a, b) => a.date.localeCompare(b.date));
    const best = Math.max(...points.map((p) => p.kg));
    const last = points[points.length - 1].kg;
    const sessions = points.length;
    const c = el("div.ex-card");
    c.appendChild(el("div.ex-head", {}, [
      el("div", {}, [el("div.ex-name", { text: name }), el("div.ex-how", { text: `${sessions} session${sessions === 1 ? "" : "s"} · type: ${kind.replace("_", " + ")}` })]),
      el("div.ex-scheme", { text: fmtVal(best, kind) }),
    ]));
    c.appendChild(el("p.ex-prev", { html: `latest: <b>${fmtVal(last, kind)}</b> · best: <b>${fmtVal(best, kind)}</b>` }));
    if (points.length >= 1) c.appendChild(progressionSvg(points));
    else c.appendChild(el("p.muted", { text: "Need 2+ sessions to draw a line." }));
    root.appendChild(c);
  });
}

function progressionSvg(points) {
  const W = 320, H = 90;
  const c = buildWeightChart(points, W, H, 8);
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", "100%");
  svg.style.display = "block";
  if (c.area) {
    const a = document.createElementNS(ns, "path");
    a.setAttribute("d", c.area); a.setAttribute("fill", "rgba(198,241,53,.12)"); svg.appendChild(a);
  }
  if (c.line) {
    const l = document.createElementNS(ns, "path");
    l.setAttribute("d", c.line); l.setAttribute("fill", "none"); l.setAttribute("stroke", "#c6f135");
    l.setAttribute("stroke-width", "2.5"); l.setAttribute("stroke-linejoin", "round"); l.setAttribute("stroke-linecap", "round");
    svg.appendChild(l);
  }
  c.dots.forEach((d) => {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", d.x); dot.setAttribute("cy", d.y); dot.setAttribute("r", 3);
    dot.setAttribute("fill", "#0a0b0d"); dot.setAttribute("stroke", "#c6f135"); dot.setAttribute("stroke-width", "2");
    svg.appendChild(dot);
  });
  return svg;
}

function clear(root) { root.innerHTML = ""; return root; }
