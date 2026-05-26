/* ============================================================
   weight.js — log weight, trend chart, progress bar, stats.
   ============================================================ */
import { el, card, pageHead, statBox } from "../ui.js";
import { getState, getSettings, logWeight, deleteWeight, latestWeight, todayKey } from "../store.js";
import { bmi, bmiCategory, totalLost, progressPct, weeklyRate } from "../calc.js";
import { buildWeightChart } from "../chart.js";

export function renderWeight(root, { refresh }) {
  const s = getSettings();
  const state = getState();
  const weights = state.weights;
  const current = latestWeight();
  const start = s.startWeightKg;
  const goal = s.goalWeightKg;

  root.appendChild(pageHead("Weight", "Track the drop"));

  // ---- log form ----
  const logCard = card('⚖️ <span class="tag">Log weigh-in</span>', []);
  const inp = el("input.input", { type: "number", inputmode: "decimal", step: "0.1", placeholder: "kg", style: "flex:1" });
  const dateInp = el("input.input", { type: "date", value: todayKey(), style: "flex:1" });
  const btn = el("button.btn", { text: "Save", onclick: () => {
    const v = parseFloat(inp.value); if (!v) return;
    logWeight(v, dateInp.value || todayKey()); inp.value = ""; refresh();
  }});
  logCard.appendChild(el("div", { style: "display:flex;gap:8px;flex-wrap:wrap" }, [inp, dateInp]));
  logCard.appendChild(el("div", { style: "margin-top:10px" }, [btn]));
  root.appendChild(logCard);

  // ---- big stats ----
  const lost = totalLost(start, current);
  const rate = weeklyRate(weights);
  const bmiVal = bmi(current, s.heightCm);
  root.appendChild(card(null, [
    el("div.stat-row", {}, [
      statBox(current.toFixed(1), "Current kg", "lime"),
      statBox((lost >= 0 ? "−" : "+") + Math.abs(lost).toFixed(1), "kg lost", lost > 0 ? "lime" : ""),
      statBox(rate ? (rate <= 0 ? "−" : "+") + Math.abs(rate).toFixed(2) : "—", "kg / week", rate < 0 ? "lime" : rate > 0 ? "orange" : ""),
      statBox(bmiVal.toFixed(1), bmiCategory(bmiVal)),
    ]),
  ]));

  // ---- progress bar ----
  const pct = progressPct(start, current, goal);
  const progCard = card('🎯 <span class="tag">Mission: ' + start + " → " + goal + " kg</span>", []);
  progCard.appendChild(el("div.progress-wrap", {}, [
    el("div.progress-track", {}, [el("div.progress-fill", { style: `width:${pct}%` })]),
    el("div.progress-labels", {}, [
      el("span", { text: `${pct.toFixed(0)}% there` }),
      el("span", { text: `${Math.max(0, current - goal).toFixed(1)} kg to go` }),
    ]),
  ]));
  root.appendChild(progCard);

  // ---- chart ----
  const chartCard = card('📉 <span class="tag">Trend</span>', []);
  if (weights.length === 0) {
    chartCard.appendChild(el("p.muted", { text: "Log a few weigh-ins to see your line drop." }));
  } else {
    chartCard.appendChild(buildChartSvg(weights, goal));
  }
  root.appendChild(chartCard);

  // ---- history ----
  if (weights.length) {
    const histCard = card('🗓️ <span class="tag">History</span>', []);
    [...weights].reverse().forEach((w) => {
      histCard.appendChild(el("div.grocery-item", {}, [
        el("span", { text: w.date }),
        el("div", { style: "display:flex;gap:12px;align-items:center" }, [
          el("span.q", { text: w.kg.toFixed(1) + " kg" }),
          el("button.btn ghost sm", { text: "✕", title: "Delete", onclick: () => { deleteWeight(w.date); refresh(); } }),
        ]),
      ]));
    });
    root.appendChild(histCard);
  }
}

function buildChartSvg(weights, goal) {
  const W = 320, H = 150;
  const c = buildWeightChart(weights, W, H, 10, goal);
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", "100%");
  svg.style.display = "block";

  if (c.goalY != null) {
    const gl = document.createElementNS(ns, "line");
    gl.setAttribute("x1", 0); gl.setAttribute("x2", W);
    gl.setAttribute("y1", c.goalY); gl.setAttribute("y2", c.goalY);
    gl.setAttribute("stroke", "#ff5b35"); gl.setAttribute("stroke-dasharray", "4 4"); gl.setAttribute("stroke-width", "1.5");
    svg.appendChild(gl);
  }
  if (c.area) {
    const area = document.createElementNS(ns, "path");
    area.setAttribute("d", c.area); area.setAttribute("fill", "rgba(198,241,53,.12)");
    svg.appendChild(area);
  }
  if (c.line) {
    const line = document.createElementNS(ns, "path");
    line.setAttribute("d", c.line); line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#c6f135"); line.setAttribute("stroke-width", "2.5");
    line.setAttribute("stroke-linejoin", "round"); line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);
  }
  c.dots.forEach((d) => {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", d.x); dot.setAttribute("cy", d.y); dot.setAttribute("r", 3);
    dot.setAttribute("fill", "#0a0b0d"); dot.setAttribute("stroke", "#c6f135"); dot.setAttribute("stroke-width", "2");
    svg.appendChild(dot);
  });
  return svg;
}
