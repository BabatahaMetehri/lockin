/* ============================================================
   settings.js — targets, goal, schedule, PIN change, backup.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { getSettings, setSettings } from "../store.js";
import { exportAll, importAll } from "../backup.js";
import { getMediaKey, setMediaKey } from "../pin.js";
import { hashPin, verifyPin, deriveKey, encryptBytes, decryptBytes } from "../crypto.js";
import { getAllMedia, putMedia } from "../db.js";
import { WORKOUTS } from "../data.js";
import { toast, go } from "../router.js";
import { getReminders, setReminders, enableNotifications, permission, fireTest, scheduleAll, reminderInfo } from "../reminders.js";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function renderSettings(root, { refresh }) {
  const s = getSettings();
  root.appendChild(pageHead("Settings", "Tune the mission"));

  // ---- goal & targets ----
  const goalCard = card('🎯 <span class="tag">Goal & targets</span>', []);
  const goal = numField("Goal weight (kg)", s.goalWeightKg);
  const kcal = numField("Daily calories", s.kcal);
  const protein = numField("Protein (g)", s.proteinG);
  const steps = numField("Step goal", s.steps);
  const water = numField("Water goal (L)", s.waterL, "0.1");
  [goal, kcal, protein, steps, water].forEach((f) => goalCard.appendChild(f.field));
  goalCard.appendChild(el("button.btn", { text: "Save targets", onclick: () => {
    setSettings({
      goalWeightKg: +goal.input.value || s.goalWeightKg,
      kcal: +kcal.input.value || s.kcal,
      proteinG: +protein.input.value || s.proteinG,
      steps: +steps.input.value || s.steps,
      waterL: +water.input.value || s.waterL,
    });
    toast("Targets saved");
  }}));
  root.appendChild(goalCard);

  // ---- weekly schedule ----
  const schCard = card('🗓️ <span class="tag">Workout schedule</span>', []);
  const sched = { ...s.schedule };
  const opts = [["rest", "Rest"], ["walk", "Walk"], ...Object.values(WORKOUTS).map((w) => [w.id, `Workout ${w.id} (${w.title})`])];
  for (let day = 0; day < 7; day++) {
    const sel = el("select.input", {}, opts.map(([v, t]) => el("option", { value: v, text: t, ...(sched[day] === v ? { selected: true } : {}) })));
    sel.addEventListener("change", () => { sched[day] = sel.value; });
    schCard.appendChild(el("label.field", {}, [el("span", { text: DAY_NAMES[day] }), sel]));
  }
  schCard.appendChild(el("button.btn", { text: "Save schedule", onclick: () => { setSettings({ schedule: sched }); toast("Schedule saved"); refresh(); } }));
  root.appendChild(schCard);

  // ---- reminders ----
  const remCard = card('🔔 <span class="tag">Daily reminders</span>', []);
  const perm = permission();
  if (perm === "unsupported") {
    remCard.appendChild(el("p.muted", { text: "This browser doesn't support notifications. Try installing the app to your home screen." }));
  } else {
    if (perm !== "granted") {
      remCard.appendChild(el("button.btn", { text: "🔔 Turn on notifications", onclick: async () => {
        const r = await enableNotifications();
        toast(r === "granted" ? "Notifications on" : "Permission " + r);
        if (r === "granted") refresh();
      }}));
    } else {
      remCard.appendChild(el("p.pill lime", { text: "Notifications ON", style: "display:inline-block" }));
    }
    const list = getReminders().map((r) => ({ ...r }));
    const rows = el("div", { style: "margin-top:12px" });
    list.forEach((rem) => {
      const time = el("input.input", { type: "time", value: rem.time, style: "width:120px" });
      time.addEventListener("change", () => { rem.time = time.value; });
      const toggle = el("button.btn " + (rem.on ? "sm" : "ghost sm"), { text: rem.on ? "ON" : "OFF" });
      toggle.addEventListener("click", () => { rem.on = !rem.on; toggle.textContent = rem.on ? "ON" : "OFF"; toggle.className = "btn " + (rem.on ? "sm" : "ghost sm"); });
      rows.appendChild(el("div.row-between", { style: "padding:8px 0;border-bottom:1px solid var(--line)" }, [
        el("span", { text: rem.label, style: "flex:1" }), time, toggle,
      ]));
    });
    remCard.appendChild(rows);
    remCard.appendChild(el("button.btn", { text: "Save reminders", style: "margin-top:10px", onclick: async () => { setReminders(list); await scheduleAll(); toast("Reminders saved"); } }));
    remCard.appendChild(el("button.btn ghost sm", { text: "Send test notification", style: "margin-top:8px", onclick: () => fireTest() }));
    remCard.appendChild(el("p.note", { text: reminderInfo, style: "margin-top:10px" }));
  }
  root.appendChild(remCard);

  // ---- backup ----
  const backupCard = card('💾 <span class="tag">Backup & restore</span>', []);
  backupCard.appendChild(el("p.muted", { text: "Export saves everything (logs + encrypted photos) to one file. Back up weekly so you never lose progress." }));
  backupCard.appendChild(el("button.btn", { text: "⬇ Export backup", onclick: () => exportAll().then(() => toast("Backup downloaded")), style: "margin-bottom:10px" }));
  const importFile = el("input", { type: "file", accept: "application/json", style: "display:none" });
  importFile.addEventListener("change", async () => {
    const f = importFile.files && importFile.files[0]; if (!f) return;
    if (!confirm("Importing REPLACES current data with the backup. Continue?")) return;
    try { await importAll(f); toast("Restored — reloading"); setTimeout(() => location.reload(), 800); }
    catch (e) { alert("Import failed: " + e.message); }
  });
  backupCard.appendChild(el("button.btn ghost", { text: "⬆ Import backup", onclick: () => importFile.click() }));
  backupCard.appendChild(importFile);
  backupCard.appendChild(el("p.note", { text: "Restoring needs the PIN that was set when the backup was made.", style: "margin-top:8px" }));
  root.appendChild(backupCard);

  // ---- change PIN ----
  const pinCard = card('🔒 <span class="tag">Change PIN</span>', []);
  const oldP = numField("Current PIN", "", "1", "password");
  const newP = numField("New 4-digit PIN", "", "1", "password");
  [oldP, newP].forEach((f) => pinCard.appendChild(f.field));
  pinCard.appendChild(el("button.btn warn", { text: "Change PIN (re-encrypts photos)", onclick: () => changePinFlow(oldP.input.value, newP.input.value) }));
  root.appendChild(pinCard);

  root.appendChild(el("p.note", { text: "LOCK IN · all data stored only on this device.", style: "text-align:center;margin-top:18px" }));
}

function numField(label, value, step = "1", type = "number") {
  const input = el("input.input", { type, inputmode: type === "number" ? "decimal" : "text", step, value: value === "" ? "" : value });
  const field = el("label.field", {}, [el("span", { text: label }), input]);
  return { field, input };
}

async function changePinFlow(oldPin, newPin) {
  const s = getSettings();
  if (!/^\d{4}$/.test(newPin)) { alert("New PIN must be 4 digits."); return; }
  if (!(await verifyPin(oldPin, s.pinHash, s.pinSalt))) { alert("Current PIN is wrong."); return; }
  try {
    const oldKey = await deriveKey(oldPin, s.pinSalt);
    const { hash, salt } = await hashPin(newPin);
    const newKey = await deriveKey(newPin, salt);
    // re-encrypt all media with the new key
    const media = await getAllMedia();
    for (const m of media) {
      const bytes = await decryptBytes(oldKey, m.iv, m.cipher);
      const { iv, cipher } = await encryptBytes(newKey, bytes);
      await putMedia({ ...m, iv, cipher });
    }
    setSettings({ pinHash: hash, pinSalt: salt });
    setMediaKey(newKey);
    toast("PIN changed 🔒");
  } catch (e) {
    alert("Could not change PIN: " + e.message);
  }
}
