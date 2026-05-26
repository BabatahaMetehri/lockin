/* ============================================================
   chart.js — PURE. Build an SVG line-chart path from weight points.
   Returns geometry only; the screen wraps it in <svg>.
   ============================================================ */

/**
 * @param {{date:string, kg:number}[]} points  sorted or unsorted
 * @param {number} w  inner width
 * @param {number} h  inner height
 * @param {number} pad padding inside the viewBox
 * @param {number} [goalKg]
 * @returns {{ line:string, area:string, dots:{x,y,kg,date}[], min:number, max:number, goalY:number|null, w:number, h:number }}
 */
export function buildWeightChart(points, w = 320, h = 140, pad = 8, goalKg) {
  const pts = [...(points || [])].sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length === 0) {
    return { line: "", area: "", dots: [], min: 0, max: 0, goalY: null, w, h, empty: true };
  }
  const kgs = pts.map((p) => p.kg);
  let min = Math.min(...kgs, goalKg ?? Infinity);
  let max = Math.max(...kgs);
  if (min === max) { min -= 1; max += 1; }
  const range = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const x = (i) => pad + (pts.length === 1 ? innerW / 2 : (i / (pts.length - 1)) * innerW);
  const y = (kg) => pad + (1 - (kg - min) / range) * innerH;

  const dots = pts.map((p, i) => ({ x: x(i), y: y(p.kg), kg: p.kg, date: p.date }));
  const line = dots.map((d, i) => `${i === 0 ? "M" : "L"}${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" ");
  const area = line
    ? `${line} L${dots[dots.length - 1].x.toFixed(1)},${(h - pad).toFixed(1)} L${dots[0].x.toFixed(1)},${(h - pad).toFixed(1)} Z`
    : "";
  const goalY = goalKg != null ? y(goalKg) : null;

  return { line, area, dots, min, max, goalY, w, h, empty: false };
}
