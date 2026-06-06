/* ============================================================
   store.js — localStorage-backed state (logs, settings, schedule).
   Media (photos/videos) live in IndexedDB (db.js), NOT here.
   ============================================================ */
import { PROFILE, TARGETS, WEEK_SCHEDULE, EATING_WINDOW } from "./data.js";

const KEY = "lockin.state.v1";
const SPEC_VERSION = 2; // bump to push fixed-plan config changes onto existing users

function defaultState() {
  return {
    settings: {
      pinHash: null, pinSalt: null,
      specVersion: SPEC_VERSION,
      startDate: PROFILE.startDate,
      startWeightKg: PROFILE.startWeightKg,
      heightCm: PROFILE.heightCm,
      goalWeightKg: PROFILE.goalWeightKg,
      kcal: TARGETS.kcal, proteinG: TARGETS.proteinG,
      steps: TARGETS.steps, waterL: TARGETS.waterL,
      fastUntil: EATING_WINDOW.fastUntil, stopEating: EATING_WINDOW.stopEating,
      calorieTier: 0,        // F1: which 15kg recalc tier the target reflects
      bandsArrived: false,   // unlocks band exercises
      whyText: "",
      schedule: { ...WEEK_SCHEDULE },
    },
    weights: [],          // [{date:'YYYY-MM-DD', kg:Number}]
    dayLogs: {},          // { 'YYYY-MM-DD': { checks:{}, water, steps, workoutDone, notes, cleanFast } }
    workoutLog: [],       // [{date, workoutId, exercises:[{name, kind, sets:[{reps,load,seconds}]}]}]
    symptomLog: [],       // [{date, type}] for guardrails + correlation
    grocery: {},          // { itemId: true } -> checked off
  };
}

let _state = null;

export function load() {
  if (_state) return _state;
  try {
    const raw = localStorage.getItem(KEY);
    _state = raw ? migrate(JSON.parse(raw)) : defaultState();
  } catch {
    _state = defaultState();
  }
  return _state;
}

function migrate(s) {
  const d = defaultState();
  const merged = {
    ...d, ...s,
    settings: { ...d.settings, ...(s.settings || {}) },
    symptomLog: s.symptomLog || [],
  };
  // Spec bump: force the new fixed-plan config onto pre-v2 users (keeps their
  // logs, weights, why, goal, prices, PIN — only the rigid plan values change).
  if ((s.settings?.specVersion || 0) < SPEC_VERSION) {
    merged.settings.heightCm = PROFILE.heightCm;
    merged.settings.kcal = TARGETS.kcal;
    merged.settings.proteinG = TARGETS.proteinG;
    merged.settings.steps = TARGETS.steps;
    merged.settings.waterL = TARGETS.waterL;
    merged.settings.fastUntil = EATING_WINDOW.fastUntil;
    merged.settings.stopEating = EATING_WINDOW.stopEating;
    merged.settings.schedule = { ...WEEK_SCHEDULE };
    merged.settings.reminders = undefined; // rebuilt from the new Master Clock
    merged.settings.specVersion = SPEC_VERSION;
  } else {
    merged.settings.schedule = { ...d.settings.schedule, ...((s.settings || {}).schedule || {}) };
  }
  return merged;
}

export function save() {
  localStorage.setItem(KEY, JSON.stringify(_state));
}

export function getState() { return load(); }
export function getSettings() { return load().settings; }
export function setSettings(patch) { Object.assign(load().settings, patch); save(); }

/* ---------- dates ---------- */
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------- weight ---------- */
export function logWeight(kg, date = todayKey()) {
  const s = load();
  const i = s.weights.findIndex((w) => w.date === date);
  if (i >= 0) s.weights[i].kg = kg;
  else s.weights.push({ date, kg });
  s.weights.sort((a, b) => a.date.localeCompare(b.date));
  save();
}
export function deleteWeight(date) {
  const s = load();
  s.weights = s.weights.filter((w) => w.date !== date);
  save();
}
export function latestWeight() {
  const s = load();
  return s.weights.length ? s.weights[s.weights.length - 1].kg : s.settings.startWeightKg;
}

/* ---------- day logs ---------- */
export function getDayLog(date = todayKey()) {
  const s = load();
  if (!s.dayLogs[date]) s.dayLogs[date] = { checks: {}, water: 0, steps: 0, workoutDone: false, mood: "", notes: "" };
  return s.dayLogs[date];
}
export function setDayLog(date, patch) {
  const log = getDayLog(date);
  Object.assign(log, patch);
  save();
}
export function toggleCheck(date, id) {
  const log = getDayLog(date);
  log.checks[id] = !log.checks[id];
  save();
  return log.checks[id];
}

/* ---------- workouts ---------- */
export function logWorkout(entry) {
  const s = load();
  s.workoutLog.push(entry);
  save();
}
export function getLastWorkout(workoutId) {
  const s = load();
  for (let i = s.workoutLog.length - 1; i >= 0; i--) {
    if (s.workoutLog[i].workoutId === workoutId) return s.workoutLog[i];
  }
  return null;
}

/* ---------- ad-hoc / off-plan meals ---------- */
export function addCustomMeal(date, meal) {
  const log = getDayLog(date);
  log.customMeals = log.customMeals || [];
  log.customMeals.push({ id: "cm_" + Date.now(), ...meal });
  save();
}
export function deleteCustomMeal(date, id) {
  const log = getDayLog(date);
  log.customMeals = (log.customMeals || []).filter((m) => m.id !== id);
  save();
}

/* ---------- symptom log (drives guardrails) ---------- */
export function addSymptom(type, date = todayKey()) {
  const s = load();
  s.symptomLog = s.symptomLog || [];
  s.symptomLog.push({ date, type });
  save();
}
export function getSymptoms() { return load().symptomLog || []; }
export function symptomsOn(date) { return (load().symptomLog || []).filter((x) => x.date === date); }
export function recentSymptomTypes(days = 3, now = new Date()) {
  const cutoff = now.getTime() - days * 86400000;
  const types = new Set();
  (load().symptomLog || []).forEach((x) => { if (new Date(x.date).getTime() >= cutoff) types.add(x.type); });
  return [...types];
}

/* ---------- clean-fast honesty check (F7) ---------- */
export function setCleanFast(date, value) { setDayLog(date, { cleanFast: value }); }

/* ---------- grocery ---------- */
export function toggleGrocery(item) {
  const s = load();
  s.grocery[item] = !s.grocery[item];
  save();
  return s.grocery[item];
}

/* ---------- import/export ---------- */
export function exportState() { return JSON.parse(JSON.stringify(load())); }
export function replaceState(newState) {
  _state = migrate(newState);
  save();
}
