/* ============================================================
   reminders.js — local daily notifications (no server).
   Fires via the service worker. Uses Notification Triggers when
   available (reliable even when closed); otherwise falls back to
   setTimeout while the app is open.
   ============================================================ */
import { getSettings, setSettings } from "./store.js";
import { DEFAULT_REMINDERS } from "./data.js";

let timers = [];

export function getReminders() {
  const s = getSettings();
  if (!s.reminders) setSettings({ reminders: DEFAULT_REMINDERS.map((r) => ({ ...r })) });
  return getSettings().reminders;
}

export function setReminders(list) { setSettings({ reminders: list }); }

export function permission() {
  return ("Notification" in window) ? Notification.permission : "unsupported";
}

export async function enableNotifications() {
  if (!("Notification" in window)) return "unsupported";
  const res = await Notification.requestPermission();
  if (res === "granted") scheduleAll();
  return res;
}

function nextOccurrence(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1); // tomorrow if already passed
  return t;
}

async function reg() {
  if (!("serviceWorker" in navigator)) return null;
  try { return await navigator.serviceWorker.ready; } catch { return null; }
}

const triggersSupported = ("Notification" in window) && ("showTrigger" in Notification.prototype);

/** Schedule all enabled reminders. Triggers path covers the next 3 days. */
export async function scheduleAll() {
  if (permission() !== "granted") return;
  const r = await reg();
  if (!r) return;

  // clear foreground timers
  timers.forEach(clearTimeout); timers = [];

  const list = getReminders().filter((x) => x.on);

  if (triggersSupported) {
    // cancel previously scheduled triggered notifications by tag, then reschedule
    try {
      const existing = await r.getNotifications({ includeTriggered: true });
      existing.filter((n) => n.tag && n.tag.startsWith("lockin-")).forEach((n) => n.close());
    } catch { /* ignore */ }
    for (const rem of list) {
      for (let day = 0; day < 3; day++) {
        const when = nextOccurrence(rem.time); when.setDate(when.getDate() + day);
        try {
          await r.showNotification(`LOCK IN — ${rem.label}`, {
            body: rem.body, icon: "icons/icon.svg", badge: "icons/icon.svg",
            tag: `lockin-${rem.id}-${when.toDateString()}`,
            showTrigger: new TimestampTrigger(when.getTime()),
          });
        } catch { /* ignore individual failures */ }
      }
    }
  } else {
    // foreground fallback: fire today's remaining reminders while app stays open
    for (const rem of list) {
      const when = nextOccurrence(rem.time);
      const delay = when.getTime() - Date.now();
      if (delay > 0 && delay < 24 * 3600 * 1000) {
        timers.push(setTimeout(() => fire(rem.label, rem.body, `lockin-${rem.id}`), delay));
      }
    }
  }
}

async function fire(label, body, tag) {
  const r = await reg();
  const opts = { body, icon: "icons/icon.svg", badge: "icons/icon.svg", tag, renotify: true };
  if (r) r.showNotification(`LOCK IN — ${label}`, opts);
  else if (permission() === "granted") new Notification(`LOCK IN — ${label}`, opts);
}

export async function fireTest() {
  if (permission() !== "granted") { const p = await enableNotifications(); if (p !== "granted") return p; }
  await fire("Test", "Reminders are working. Lock in. 💪", "lockin-test");
  return "granted";
}

export const reminderInfo = triggersSupported
  ? "Reminders are scheduled on your phone and fire even when the app is closed."
  : "Reminders fire while the app is open or running in the background. For guaranteed alarms when fully closed, also set them in your phone's Clock app.";
