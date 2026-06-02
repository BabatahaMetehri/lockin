/* ============================================================
   feedback.js — small tactile/audio cues. All silently no-op on
   browsers without support (e.g. iOS Safari blocks vibrate).
   ============================================================ */
let ctx = null;
function audio() {
  try { return ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)()); } catch { return null; }
}

export function vibrate(pattern = 30) {
  if (navigator.vibrate) try { navigator.vibrate(pattern); } catch { /* ignore */ }
}

export function beep(freq = 880, ms = 120, gain = 0.05) {
  const a = audio(); if (!a) return;
  try {
    const o = a.createOscillator(); const g = a.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g).connect(a.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000);
    o.stop(a.currentTime + ms / 1000 + 0.02);
  } catch { /* ignore */ }
}

/** Two-tone success chime. */
export function chime() {
  beep(660, 110); setTimeout(() => beep(880, 160), 130); setTimeout(() => beep(1320, 220), 280);
  vibrate([40, 60, 40, 60, 80]);
}

/** Short click feedback. */
export function tap() { vibrate(15); }
