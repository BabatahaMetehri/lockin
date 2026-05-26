/* ============================================================
   backup.js — export / import the whole journey to a file.
   Media stays ENCRYPTED in the backup; restoring requires the
   PIN that was active when the backup was made.
   ============================================================ */
import { exportState, replaceState } from "./store.js";
import { getAllMedia, putMedia, clearMedia } from "./db.js";

export async function exportAll() {
  const media = await getAllMedia(); // records already hold {iv, cipher} (encrypted)
  const payload = {
    app: "LOCK IN",
    version: 1,
    exportedAt: new Date().toISOString(),
    state: exportState(),
    media,
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lockin-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export async function importAll(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  if (!payload || payload.app !== "LOCK IN" || !payload.state) {
    throw new Error("Not a valid LOCK IN backup file.");
  }
  replaceState(payload.state);
  await clearMedia();
  for (const m of payload.media || []) await putMedia(m);
  return true;
}
