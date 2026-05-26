/* ============================================================
   pin.js — PIN lifecycle + the in-memory media encryption key.
   The derived AES key is held ONLY in memory while unlocked.
   ============================================================ */
import { hashPin, verifyPin, deriveKey } from "./crypto.js";
import { getSettings, setSettings } from "./store.js";

let _mediaKey = null;

export function isPinSet() {
  const s = getSettings();
  return !!(s.pinHash && s.pinSalt);
}

export async function createPin(pin) {
  const { hash, salt } = await hashPin(pin);
  setSettings({ pinHash: hash, pinSalt: salt });
  _mediaKey = await deriveKey(pin, salt);
}

export async function unlock(pin) {
  const s = getSettings();
  const ok = await verifyPin(pin, s.pinHash, s.pinSalt);
  if (!ok) return false;
  _mediaKey = await deriveKey(pin, s.pinSalt);
  return true;
}

export function lock() { _mediaKey = null; }
export function isUnlocked() { return !!_mediaKey; }
export function getMediaKey() { return _mediaKey; }
export function setMediaKey(k) { _mediaKey = k; }

/** Change PIN. Re-derives the media key; caller must re-encrypt existing media. */
export async function changePin(oldPin, newPin) {
  const s = getSettings();
  if (!(await verifyPin(oldPin, s.pinHash, s.pinSalt))) return false;
  const { hash, salt } = await hashPin(newPin);
  setSettings({ pinHash: hash, pinSalt: salt });
  _mediaKey = await deriveKey(newPin, salt);
  return true;
}
