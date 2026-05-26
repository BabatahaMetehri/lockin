/* ============================================================
   app.js — bootstrap: service worker, PIN gate, launch router.
   ============================================================ */
import { isPinSet, createPin, unlock } from "./pin.js";
import { initRouter } from "./router.js";

/* ---- service worker (offline + installable) ---- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {/* ignore on file:// */});
  });
}

const lockEl = document.getElementById("lock-screen");
const appEl = document.getElementById("app");
const dotsEl = document.getElementById("pin-dots");
const keypadEl = document.getElementById("keypad");
const titleEl = document.getElementById("lock-title");
const subEl = document.getElementById("lock-sub");
const errEl = document.getElementById("lock-error");

const PIN_LEN = 4;
let mode = "unlock";          // 'create' | 'confirm' | 'unlock'
let buffer = "";
let firstEntry = "";

function renderDots() {
  dotsEl.innerHTML = "";
  for (let i = 0; i < PIN_LEN; i++) {
    const d = document.createElement("span");
    d.className = "pin-dot" + (i < buffer.length ? " on" : "");
    dotsEl.appendChild(d);
  }
}

function buildKeypad() {
  keypadEl.innerHTML = "";
  const keys = ["1","2","3","4","5","6","7","8","9","del","0","go"];
  for (const k of keys) {
    const b = document.createElement("button");
    b.className = "key" + (k === "go" ? " go" : "") + (k === "del" ? " wide" : "");
    b.textContent = k === "del" ? "⌫" : k === "go" ? "✓" : k;
    b.addEventListener("click", () => onKey(k));
    keypadEl.appendChild(b);
  }
}

function onKey(k) {
  errEl.textContent = "";
  if (k === "del") { buffer = buffer.slice(0, -1); renderDots(); return; }
  if (k === "go") { submit(); return; }
  if (buffer.length < PIN_LEN) buffer += k;
  renderDots();
  if (buffer.length === PIN_LEN) setTimeout(submit, 120);
}

async function submit() {
  if (buffer.length !== PIN_LEN) { fail("Enter 4 digits"); return; }
  if (mode === "create") {
    firstEntry = buffer; buffer = ""; mode = "confirm";
    titleEl.textContent = "Confirm your PIN";
    subEl.textContent = "Enter it again to lock it in.";
    renderDots();
    return;
  }
  if (mode === "confirm") {
    if (buffer !== firstEntry) {
      buffer = ""; firstEntry = ""; mode = "create";
      titleEl.textContent = "Create a PIN";
      fail("Didn't match — start again");
      renderDots();
      return;
    }
    await createPin(buffer);
    enterApp();
    return;
  }
  // unlock
  const ok = await unlock(buffer);
  if (ok) { enterApp(); }
  else { buffer = ""; renderDots(); fail("Wrong PIN"); }
}

function fail(msg) {
  errEl.textContent = msg;
  const card = lockEl.querySelector(".lock-card");
  card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
}

function enterApp() {
  buffer = ""; firstEntry = "";
  lockEl.hidden = true;
  appEl.hidden = false;
  initRouter();
}

function startLock() {
  buildKeypad();
  renderDots();
  lockEl.hidden = false;
  appEl.hidden = true;
  if (!isPinSet()) {
    mode = "create";
    titleEl.textContent = "Create a PIN";
    subEl.textContent = "4 digits. This also encrypts your photos & videos — don't forget it.";
  } else {
    mode = "unlock";
    titleEl.textContent = "Enter your PIN";
    subEl.textContent = "Welcome back. Lock in.";
  }
  // hardware keyboard support
  window.addEventListener("keydown", onHardwareKey);
}

function onHardwareKey(e) {
  if (lockEl.hidden) return;
  if (/^[0-9]$/.test(e.key)) onKey(e.key);
  else if (e.key === "Backspace") onKey("del");
  else if (e.key === "Enter") onKey("go");
}

startLock();
