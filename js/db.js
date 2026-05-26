/* ============================================================
   db.js — IndexedDB wrapper for ENCRYPTED media records.
   A record: { id, date, type:'photo'|'video', category:'body'|'face',
               label, mime, iv, cipher }  (iv/cipher are base64)
   ============================================================ */
const DB_NAME = "lockin-media";
const STORE = "media";
let _db = null;

function open() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function tx(mode) {
  return open().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

export async function putMedia(record) {
  const store = await tx("readwrite");
  return new Promise((resolve, reject) => {
    const r = store.put(record);
    r.onsuccess = () => resolve(record.id);
    r.onerror = () => reject(r.error);
  });
}

export async function getAllMedia() {
  const store = await tx("readonly");
  return new Promise((resolve, reject) => {
    const r = store.getAll();
    r.onsuccess = () => resolve((r.result || []).sort((a, b) => (b.date || "").localeCompare(a.date || "")));
    r.onerror = () => reject(r.error);
  });
}

export async function getMedia(id) {
  const store = await tx("readonly");
  return new Promise((resolve, reject) => {
    const r = store.get(id);
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => reject(r.error);
  });
}

export async function deleteMedia(id) {
  const store = await tx("readwrite");
  return new Promise((resolve, reject) => {
    const r = store.delete(id);
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}

export async function clearMedia() {
  const store = await tx("readwrite");
  return new Promise((resolve, reject) => {
    const r = store.clear();
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}
