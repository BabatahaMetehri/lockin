/* ============================================================
   media.js — private, encrypted photo/video gallery + compare.
   ============================================================ */
import { el, card, pageHead } from "../ui.js";
import { putMedia, getAllMedia, getMedia, deleteMedia } from "../db.js";
import { getMediaKey, isUnlocked } from "../pin.js";
import { encryptBytes, decryptBytes } from "../crypto.js";
import { todayKey } from "../store.js";
import { toast } from "../router.js";

let filter = "all";        // all | body | face
let compareMode = false;
let selection = [];

export async function renderMedia(root) {
  root.appendChild(pageHead("Photos", "Private · encrypted on-device"));

  if (!isUnlocked()) {
    root.appendChild(card(null, [el("p", { text: "Locked. Re-open the app and enter your PIN to view media." })]));
    return;
  }

  // ---- add ----
  const addCard = card('📸 <span class="tag">Add photo / video</span>', []);
  const catSel = el("select.input", {}, [
    el("option", { value: "body", text: "Body" }),
    el("option", { value: "face", text: "Face" }),
  ]);
  const labelInp = el("input.input", { placeholder: "Label (optional, e.g. 'front')" });
  const fileInp = el("input", { type: "file", accept: "image/*,video/*", capture: "environment", style: "display:none" });
  const pickBtn = el("button.btn", { text: "Choose / capture", onclick: () => fileInp.click() });
  const status = el("p.muted", { text: "", style: "font-size:.85rem" });

  fileInp.addEventListener("change", async () => {
    const file = fileInp.files && fileInp.files[0];
    if (!file) return;
    status.textContent = "Encrypting…";
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      const { iv, cipher } = await encryptBytes(getMediaKey(), buf);
      const record = {
        id: "m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        date: todayKey(),
        type: file.type.startsWith("video") ? "video" : "photo",
        category: catSel.value,
        label: labelInp.value || "",
        mime: file.type || (file.type.startsWith("video") ? "video/mp4" : "image/jpeg"),
        iv, cipher,
      };
      await putMedia(record);
      labelInp.value = ""; fileInp.value = "";
      status.textContent = "";
      toast("Saved & encrypted 🔒");
      await renderGallery(galleryHost);
    } catch (err) {
      status.textContent = "Failed: " + err.message;
    }
  });

  addCard.appendChild(el("label.field", {}, [el("span", { text: "Category" }), catSel]));
  addCard.appendChild(el("label.field", {}, [el("span", { text: "Label" }), labelInp]));
  addCard.appendChild(pickBtn);
  addCard.appendChild(fileInp);
  addCard.appendChild(status);

  // ---- voice note recorder ----
  const recWrap = el("div", { style: "margin-top:12px;border-top:1px solid var(--line);padding-top:12px" });
  const recBtn = el("button.btn ghost", { text: "🎙️ Record voice note" });
  const recStatus = el("p.muted", { text: "", style: "font-size:.85rem" });
  let mediaRec = null, chunks = [], stream = null, ticking = null;
  recBtn.addEventListener("click", async () => {
    if (mediaRec && mediaRec.state === "recording") { mediaRec.stop(); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRec = new MediaRecorder(stream);
      mediaRec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mediaRec.onstop = async () => {
        clearInterval(ticking);
        stream.getTracks().forEach((t) => t.stop());
        recBtn.textContent = "🎙️ Record voice note"; recBtn.classList.add("ghost");
        const blob = new Blob(chunks, { type: mediaRec.mimeType || "audio/webm" });
        recStatus.textContent = "Encrypting…";
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const { iv, cipher } = await encryptBytes(getMediaKey(), bytes);
        await putMedia({
          id: "m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
          date: todayKey(), type: "audio", category: "voice",
          label: labelInp.value || "voice note", mime: blob.type, iv, cipher,
        });
        labelInp.value = ""; recStatus.textContent = "";
        toast("Voice note saved 🔒");
        await renderGallery(galleryHost);
      };
      mediaRec.start();
      const t0 = Date.now();
      recBtn.textContent = "⏹ Stop recording"; recBtn.classList.remove("ghost");
      ticking = setInterval(() => { recStatus.textContent = "Recording… " + Math.floor((Date.now() - t0) / 1000) + "s"; }, 250);
    } catch (e) { recStatus.textContent = "Mic blocked: " + e.message; }
  });
  recWrap.appendChild(recBtn);
  recWrap.appendChild(recStatus);
  addCard.appendChild(recWrap);

  addCard.appendChild(el("p.note", { text: "Tip: keep videos short (10–30s) so they stay fast and don't fill your phone.", style: "margin-top:10px" }));
  root.appendChild(addCard);

  // ---- controls ----
  const controls = card(null, []);
  const filterRow = el("div", { style: "display:flex;gap:8px;flex-wrap:wrap" }, [
    filterBtn("all", "All"), filterBtn("body", "Body"), filterBtn("face", "Face"), filterBtn("voice", "Voice"),
  ]);
  controls.appendChild(filterRow);
  const cmpBtn = el("button.btn " + (compareMode ? "" : "ghost") + " sm", {
    text: compareMode ? "Comparing — pick 2 (tap to exit)" : "⇆ Compare two",
    style: "margin-top:10px",
    onclick: () => { compareMode = !compareMode; selection = []; renderMedia(clear(root)); },
  });
  controls.appendChild(cmpBtn);
  root.appendChild(controls);

  function filterBtn(val, txt) {
    return el("button.btn " + (filter === val ? "sm" : "ghost sm"), { text: txt, onclick: () => { filter = val; renderMedia(clear(root)); } });
  }

  // ---- gallery ----
  const galleryHost = card('🖼️ <span class="tag">Gallery</span>', []);
  root.appendChild(galleryHost);
  await renderGallery(galleryHost);
}

async function renderGallery(host) {
  // clear all but the title
  [...host.children].forEach((c, i) => { if (i > 0) c.remove(); });
  let items = await getAllMedia();
  if (filter !== "all") items = items.filter((m) => m.category === filter);

  if (!items.length) {
    host.appendChild(el("p.muted", { text: "No media yet. Add your first progress shot above." }));
    return;
  }

  // audio notes render as a full-width list (not square tiles)
  const audio = items.filter((m) => m.type === "audio");
  const visual = items.filter((m) => m.type !== "audio");
  for (const m of audio) {
    const url = await toObjectURL(m).catch(() => null);
    host.appendChild(el("div.grocery-item", { style: "align-items:center" }, [
      el("div", {}, [
        el("div", { html: `🎙️ <b>${m.label || "voice note"}</b>` }),
        el("div.sub", { text: m.date, style: "font-size:.78rem;color:var(--muted)" }),
        url ? el("audio", { src: url, controls: true, style: "margin-top:6px;width:100%" }) : el("span.muted", { text: "decrypt error" }),
      ]),
      el("button.btn warn sm", { text: "✕", onclick: async () => { if (confirm("Delete this voice note?")) { await deleteMedia(m.id); renderGallery(host); } } }),
    ]));
  }

  if (!visual.length && !audio.length) { host.appendChild(el("p.muted", { text: "Nothing here yet." })); return; }
  if (!visual.length) return;

  const grid = el("div.media-grid");
  for (const m of visual) {
    const cell = el("div.media-cell" + (selection.includes(m.id) ? ".sel" : ""));
    cell.appendChild(el("span.media-badge pill " + (m.type === "video" ? "orange" : "lime"), { text: m.type === "video" ? "▶" : m.category[0].toUpperCase() }));
    try {
      const url = await toObjectURL(m);
      const media = m.type === "video"
        ? el("video", { src: url, muted: true, playsinline: true })
        : el("img", { src: url, alt: m.label || m.category });
      cell.appendChild(media);
    } catch {
      cell.appendChild(el("div.meta", { text: "decrypt error" }));
    }
    cell.appendChild(el("div.meta", { text: `${m.date}${m.label ? " · " + m.label : ""}` }));
    cell.addEventListener("click", () => onCellClick(m, host));
    grid.appendChild(cell);
  }
  host.appendChild(grid);
}

async function onCellClick(m, host) {
  if (compareMode) {
    if (selection.includes(m.id)) selection = selection.filter((x) => x !== m.id);
    else { selection.push(m.id); if (selection.length > 2) selection.shift(); }
    if (selection.length === 2) return showCompare(selection);
    return renderGallery(host);
  }
  showViewer(m);
}

async function showCompare(ids) {
  const a = await getMedia(ids[0]); const b = await getMedia(ids[1]);
  const ua = await toObjectURL(a); const ub = await toObjectURL(b);
  const overlay = makeOverlay();
  overlay.appendChild(el("h2", { text: "Compare", style: "margin-bottom:10px" }));
  overlay.appendChild(el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:760px" }, [
    compareCol(a, ua), compareCol(b, ub),
  ]));
  overlay.appendChild(closeBtn(overlay));
}

function compareCol(m, url) {
  return el("div", { style: "text-align:center" }, [
    m.type === "video" ? el("video", { src: url, controls: true, style: "width:100%;border-radius:10px" })
                        : el("img", { src: url, style: "width:100%;border-radius:10px" }),
    el("p.muted", { text: `${m.date}${m.label ? " · " + m.label : ""}`, style: "font-size:.78rem" }),
  ]);
}

async function showViewer(m) {
  const url = await toObjectURL(m);
  const overlay = makeOverlay();
  const media = m.type === "video"
    ? el("video", { src: url, controls: true, autoplay: true, style: "max-width:100%;max-height:70vh;border-radius:12px" })
    : el("img", { src: url, style: "max-width:100%;max-height:70vh;border-radius:12px" });
  overlay.appendChild(media);
  overlay.appendChild(el("p.muted", { text: `${m.type} · ${m.category} · ${m.date}${m.label ? " · " + m.label : ""}` }));
  overlay.appendChild(el("div", { style: "display:flex;gap:10px" }, [
    el("button.btn warn sm", { text: "Delete", onclick: async () => { if (confirm("Delete this permanently?")) { await deleteMedia(m.id); overlay.remove(); location.reload(); } } }),
    closeBtn(overlay, true),
  ]));
}

function makeOverlay() {
  const ov = el("div", { style: "position:fixed;inset:0;z-index:80;background:rgba(5,6,8,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;overflow:auto" });
  document.body.appendChild(ov);
  return ov;
}
function closeBtn(overlay, inline) {
  return el("button.btn " + (inline ? "ghost sm" : "ghost"), { text: "Close", onclick: () => overlay.remove(), style: inline ? "" : "max-width:200px" });
}

async function toObjectURL(m) {
  const bytes = await decryptBytes(getMediaKey(), m.iv, m.cipher);
  const blob = new Blob([bytes], { type: m.mime || "image/jpeg" });
  return URL.createObjectURL(blob);
}

function clear(root) { root.innerHTML = ""; return root; }
