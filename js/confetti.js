/* ============================================================
   confetti.js — tiny canvas confetti burst. No dependencies.
   ============================================================ */
const COLORS = ["#c6f135", "#ff5b35", "#f2f4f0", "#9bc026"];

export function burst(count = 90, durationMs = 1500) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:90;pointer-events:none";
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width = innerWidth * dpr;
  const H = canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const cx = W / 2, cy = H * 0.35;
  const parts = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (4 + Math.random() * 9) * dpr;
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6 * dpr,
      size: (5 + Math.random() * 7) * dpr,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    };
  });

  const start = performance.now();
  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.35 * dpr;            // gravity
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - t / durationMs);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (t < durationMs) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}
