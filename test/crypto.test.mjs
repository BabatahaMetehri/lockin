import assert from "node:assert/strict";
import { hashPin, verifyPin, deriveKey, encryptBytes, decryptBytes, toB64, fromB64 } from "../js/crypto.js";

let pass = 0;
const t = async (name, fn) => { await fn(); pass++; console.log("  ok -", name); };

console.log("crypto.test.mjs");

await t("b64 round-trip", () => {
  const bytes = new Uint8Array([0, 1, 2, 250, 255, 128]);
  assert.deepEqual(Array.from(fromB64(toB64(bytes))), Array.from(bytes));
});

await t("PIN hash verifies correctly / rejects wrong", async () => {
  const { hash, salt } = await hashPin("1234");
  assert.equal(await verifyPin("1234", hash, salt), true);
  assert.equal(await verifyPin("9999", hash, salt), false);
});

await t("encrypt then decrypt round-trips with correct PIN", async () => {
  const { salt } = await hashPin("4321");
  const key = await deriveKey("4321", salt);
  const data = new TextEncoder().encode("progress photo bytes ⚡");
  const { iv, cipher } = await encryptBytes(key, data);
  const back = await decryptBytes(key, iv, cipher);
  assert.equal(new TextDecoder().decode(back), "progress photo bytes ⚡");
});

await t("wrong PIN cannot decrypt", async () => {
  const { salt } = await hashPin("0000");
  const key = await deriveKey("0000", salt);
  const data = new Uint8Array([9, 8, 7, 6, 5]);
  const { iv, cipher } = await encryptBytes(key, data);
  const wrongKey = await deriveKey("1111", salt);
  let threw = false;
  try { await decryptBytes(wrongKey, iv, cipher); } catch { threw = true; }
  assert.equal(threw, true, "decrypt with wrong key should throw");
});

console.log(`PASSED ${pass} crypto tests\n`);
