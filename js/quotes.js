/* ============================================================
   quotes.js — pick & render the big vibrant hero quote.
   ============================================================ */
import { el } from "./ui.js";
import { HERO_QUOTES } from "./data.js";

let cursor = -1;

export function pickHeroForToday() {
  const d = new Date();
  return HERO_QUOTES[(d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % HERO_QUOTES.length];
}

/** Renders the hero. Tap to cycle to the next quote. */
export function heroQuote(initial) {
  let cur = initial || pickHeroForToday();
  const node = el("div.hero-quote " + cur.vibe, {}, [
    el("div.hq-text", { text: cur.line }),
    el("div.hq-tap", { text: "Tap for another →" }),
  ]);
  node.addEventListener("click", () => {
    if (cursor < 0) cursor = HERO_QUOTES.indexOf(cur);
    cursor = (cursor + 1) % HERO_QUOTES.length;
    cur = HERO_QUOTES[cursor];
    node.className = "hero-quote " + cur.vibe;
    node.querySelector(".hq-text").textContent = cur.line;
  });
  return node;
}
