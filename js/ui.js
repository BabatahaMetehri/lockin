/* ============================================================
   ui.js — tiny DOM helpers shared by screens.
   ============================================================ */

/** Create an element. el('div.card', {id:'x'}, [child, 'text']) */
export function el(spec, attrs = {}, children = []) {
  const [tag, ...classes] = spec.split(".");
  const node = document.createElement(tag || "div");
  if (classes.length) node.className = classes.join(" ");
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v != null && v !== false) node.setAttribute(k, v === true ? "" : v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

export function pageHead(title, subtitle) {
  return el("header.page-head", {}, [
    el("p.kicker", { text: subtitle || "" }),
    el("h1", { text: title }),
  ]);
}

const CHECK_SVG = '<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>';

/** A tappable checklist row. */
export function checkRow({ label, sub, done, onToggle }) {
  const row = el("button.check" + (done ? ".done" : ""), {}, [
    el("span.box", { html: CHECK_SVG }),
    el("div", {}, [
      el("div.label", { text: label }),
      sub ? el("div.sub", { text: sub }) : null,
    ]),
  ]);
  row.addEventListener("click", () => {
    const nowDone = row.classList.toggle("done");
    onToggle && onToggle(nowDone);
  });
  return row;
}

export function card(titleHtml, children) {
  const c = el("section.card");
  if (titleHtml) c.appendChild(el("h2", { html: titleHtml }));
  for (const ch of [].concat(children)) if (ch) c.appendChild(ch);
  return c;
}

export function collapse(titleHtml, contentNode, open = false) {
  const head = el("div.collapse-h" + (open ? ".open" : ""), { html: `<span>${titleHtml}</span><span class="chev">▸</span>` });
  const body = el("div", {}, [contentNode]);
  body.hidden = !open;
  head.addEventListener("click", () => { const o = head.classList.toggle("open"); body.hidden = !o; });
  return el("div", {}, [head, body]);
}

export function statBox(value, key, cls = "") {
  return el("div.stat", {}, [el("div.v " + cls, { text: value }), el("div.k", { text: key })]);
}
