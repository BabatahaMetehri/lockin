/* ============================================================
   crypto.js — PIN hashing + AES-GCM encryption of media blobs.
   Uses Web Crypto (browser) / node:crypto webcrypto (tests).
   ============================================================ */
const subtle = (globalThis.crypto && globalThis.crypto.subtle) || null;

const enc = new TextEncoder();
const PBKDF2_ITERS = 150000;

function randomBytes(n) {
  const a = new Uint8Array(n);
  globalThis.crypto.getRandomValues(a);
  return a;
}

export function toB64(bytes) {
  let s = "";
  const a = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s);
}
export function fromB64(b64) {
  const s = atob(b64);
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}

async function importPinKey(pin) {
  return subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveBits", "deriveKey"]);
}

/** Hash a PIN for verification (NOT the encryption key). Returns {hash, salt} base64. */
export async function hashPin(pin, saltB64) {
  const salt = saltB64 ? fromB64(saltB64) : randomBytes(16);
  const keyMaterial = await importPinKey(pin);
  const bits = await subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERS, hash: "SHA-256" },
    keyMaterial, 256
  );
  return { hash: toB64(new Uint8Array(bits)), salt: toB64(salt) };
}

export async function verifyPin(pin, hashB64, saltB64) {
  const { hash } = await hashPin(pin, saltB64);
  return hash === hashB64;
}

/** Derive an AES-GCM key from PIN + salt (separate domain from the hash via different salt usage). */
export async function deriveKey(pin, saltB64) {
  const salt = fromB64(saltB64);
  const keyMaterial = await importPinKey(pin);
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/** Encrypt an ArrayBuffer/Uint8Array. Returns {iv, cipher} as base64. */
export async function encryptBytes(key, bytes) {
  const iv = randomBytes(12);
  const cipher = await subtle.encrypt({ name: "AES-GCM", iv }, key, bytes);
  return { iv: toB64(iv), cipher: toB64(new Uint8Array(cipher)) };
}

/** Decrypt -> returns Uint8Array. */
export async function decryptBytes(key, ivB64, cipherB64) {
  const iv = fromB64(ivB64);
  const plain = await subtle.decrypt({ name: "AES-GCM", iv }, key, fromB64(cipherB64));
  return new Uint8Array(plain);
}
