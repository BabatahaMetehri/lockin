/* ============================================================
   router.js — hash routing + nav (bottom bar on mobile, side on desktop).
   ============================================================ */
import { renderToday } from "./screens/today.js";
import { renderWeight } from "./screens/weight.js";
import { renderMeals } from "./screens/meals.js";
import { renderWorkouts } from "./screens/workouts.js";
import { renderMedia } from "./screens/media.js";
import { renderMotivation } from "./screens/motivation.js";
import { renderSettings } from "./screens/settings.js";

const ICONS = {
  today: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  weight: '<path d="M4 20h16"/><path d="M7 20V8l5-3 5 3v12"/><path d="M9 12h6"/>',
  meals: '<path d="M4 3v7a3 3 0 003 3v8"/><path d="M11 3v18"/><path d="M18 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  workouts: '<path d="M4 7v10M20 7v10M7 9v6M17 9v6"/><path d="M7 12h10"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-4 4"/>',
  motivation: '<path d="M12 3l2.5 6 6 .5-4.5 4 1.4 6L12 16l-5.4 3.5L8 13.5 3.5 9.5l6-.5z"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};

const ROUTES = {
  today: { label: "Today", icon: "today", render: renderToday },
  weight: { label: "Weight", icon: "weight", render: renderWeight },
  meals: { label: "Meals", icon: "meals", render: renderMeals },
  workouts: { label: "Train", icon: "workouts", render: renderWorkouts },
  media: { label: "Photos", icon: "media", render: renderMedia },
  motivation: { label: "Drive", icon: "motivation", render: renderMotivation },
  settings: { label: "Settings", icon: "more", render: renderSettings },
};

const BOTTOM = ["today", "weight", "meals", "workouts", "more"];
const SIDE = ["today", "weight", "meals", "workouts", "media", "motivation", "settings"];

const screenEl = () => document.getElementById("screen");

function svg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

function buildNav() {
  const bottom = document.getElementById("bottomnav");
  bottom.innerHTML = "";
  BOTTOM.forEach((key) => {
    const isMore = key === "more";
    const route = isMore ? { label: "More", icon: "more" } : ROUTES[key];
    const b = document.createElement("button");
    b.className = "navbtn";
    b.dataset.key = isMore ? "settings" : key; // "more" opens settings hub
    b.innerHTML = `${svg(route.icon)}<span>${route.label}</span>`;
    b.addEventListener("click", () => go(b.dataset.key));
    bottom.appendChild(b);
  });

  const side = document.getElementById("sidenav");
  side.innerHTML = `<div class="brand"><span class="brand-mark">◆</span> LOCK<span class="brand-accent">IN</span></div>`;
  SIDE.forEach((key) => {
    const route = ROUTES[key];
    const b = document.createElement("button");
    b.className = "sidebtn";
    b.dataset.key = key;
    b.innerHTML = `${svg(route.icon)}<span>${route.label}</span>`;
    b.addEventListener("click", () => go(key));
    side.appendChild(b);
  });
}

function setActive(key) {
  document.querySelectorAll(".navbtn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  document.querySelectorAll(".sidebtn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
}

export function go(key) {
  if (!ROUTES[key]) key = "today";
  if (location.hash !== "#" + key) { location.hash = key; return; } // hashchange will render
  render(key);
}

function render(key) {
  const route = ROUTES[key] || ROUTES.today;
  setActive(key);
  const el = screenEl();
  el.innerHTML = "";
  route.render(el, { go, refresh: () => render(key) });
  el.scrollTop = 0; window.scrollTo(0, 0);
}

function current() {
  const key = (location.hash || "#today").slice(1);
  return ROUTES[key] ? key : "today";
}

export function initRouter() {
  buildNav();
  window.addEventListener("hashchange", () => render(current()));
  render(current());
}

export function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2300);
}
