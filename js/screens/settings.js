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

  // ---- refeed day ----
  const rfCard = card('🍚 <span class="tag">Refeed day (planned higher carbs)</span>', []);
  rfCard.appendChild(el("p.muted", { text: "Pick ONE day a week where the deficit pauses — more rice/potato, same protein, no junk. Keeps fat loss and morale going on long cuts.", style: "font-size:.85rem" }));
  const rfSel = el("select.input", {}, [["", "Off (no refeed)"], ...DAY_NAMES.map((n, i) => [String(i), n])].map(([v, t]) => el("option", { value: v, text: t, ...(String(s.refeedDay ?? "") === v ? { selected: true } : {}) })));
  rfSel.addEventListener("change", () => { setSettings({ refeedDay: rfSel.value === "" ? null : parseInt(rfSel.value, 10) }); toast("Refeed day saved"); });
  rfCard.appendChild(rfSel);
  root.appendChild(rfCard);

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

  // ---- install on this device ----
  if (window.__installEvent) {
    root.appendChild(card('📲 <span class="tag">Install app</span>', [
      el("p", { text: "Add LOCK IN to your home screen / desktop for one-tap launch and offline use." }),
      el("button.btn big", { text: "📲 Install on this device", onclick: async () => {
        const ev = window.__installEvent; if (!ev) return;
        ev.prompt(); const choice = await ev.userChoice;
        window.__installEvent = null;
        toast(choice.outcome === "accepted" ? "Installed 🎉" : "Maybe later");
        refresh();
      } }),
    ]));
  }

  // ---- auto-lock ----
  const lockCard = card('🔐 <span class="tag">Auto-lock</span>', []);
  const lockSel = el("select.input", {}, [
    ["1","After 1 min"],["3","After 3 min"],["5","After 5 min"],["15","After 15 min"],["0","Never (not recommended)"],
  ].map(([v, t]) => el("option", { value: v, text: t, ...((s.autoLockMinutes ?? 5).toString() === v ? { selected: true } : {}) })));
  lockSel.addEventListener("change", () => { setSettings({ autoLockMinutes: parseInt(lockSel.value, 10) }); toast("Auto-lock saved — applies on next unlock"); });
  lockCard.appendChild(lockSel);
  lockCard.appendChild(el("p.note", { text: "App re-locks behind your PIN when idle. Touch/scroll resets the timer.", style: "margin-top:8px" }));
  root.appendChild(lockCard);

  // ---- custom exercises ----
  const cxCard = card('🧩 <span class="tag">Custom exercises</span>', []);
  const customs = (s.customExercises || []).slice();
  function reCx() {
    [...cxCard.querySelectorAll(".cx-row")].forEach((n) => n.remove());
    customs.forEach((c, i) => {
      const r = el("div.gr-row cx-row", { style: "grid-template-columns:1fr 1fr 1fr 60px" }, [
        el("span", { html: `<b>${c.name}</b><br><small style="color:var(--muted)">Workout ${c.workoutId} · ${c.kind} · ${c.scheme}</small>` }),
        el("span", { text: c.kind, style: "font-size:.78rem;color:var(--muted)" }),
        el("span", { text: c.scheme, style: "font-size:.78rem;color:var(--muted)" }),
        el("button.btn warn sm", { text: "✕", onclick: () => { customs.splice(i, 1); setSettings({ customExercises: customs }); reCx(); } }),
      ]);
      cxCard.insertBefore(r, addBtn);
    });
  }
  const nameInp = el("input.input", { placeholder: "Exercise name" });
  const woSel = el("select.input", {}, ["A","B","C","D"].map((id) => el("option", { value: id, text: "Workout " + id })));
  const kindSel = el("select.input", {}, [["reps","Reps"],["time","Time (seconds)"],["reps_weight","Reps + weight"]].map(([v,t]) => el("option", { value: v, text: t })));
  const schemeInp = el("input.input", { placeholder: "e.g. 3 × 10" });
  const howInp = el("input.input", { placeholder: "Short how-to (optional)" });
  const addBtn = el("button.btn", { text: "+ Add custom exercise", onclick: () => {
    if (!nameInp.value.trim()) return;
    customs.push({ workoutId: woSel.value, name: nameInp.value.trim(), kind: kindSel.value, scheme: schemeInp.value || "3 × 10", how: howInp.value, target: { sets: 3, reps: 10 }, video: "https://www.youtube.com/results?search_query=" + encodeURIComponent(nameInp.value + " form") });
    setSettings({ customExercises: customs });
    nameInp.value = ""; schemeInp.value = ""; howInp.value = "";
    reCx(); toast("Added");
  }});
  cxCard.appendChild(addBtn);
  cxCard.appendChild(el("hr.divider"));
  cxCard.appendChild(el("label.field", {}, [el("span", { text: "Name" }), nameInp]));
  cxCard.appendChild(el("label.field", {}, [el("span", { text: "Workout" }), woSel]));
  cxCard.appendChild(el("label.field", {}, [el("span", { text: "Type" }), kindSel]));
  cxCard.appendChild(el("label.field", {}, [el("span", { text: "Scheme (display)" }), schemeInp]));
  cxCard.appendChild(el("label.field", {}, [el("span", { text: "How (optional)" }), howInp]));
  reCx();
  root.appendChild(cxCard);

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
