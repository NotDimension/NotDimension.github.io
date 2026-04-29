import { useEffect, useRef } from "react";

/**
 * Tiny pixel-art ginger tabby that chases the mouse cursor.
 * - Pure <canvas>, no React re-renders, no per-frame allocations.
 * - Disabled on touch devices, reduced-motion, and small screens.
 * - Pauses when tab hidden.
 */
const SPRITE_W = 16;
const SPRITE_H = 12;
const SCALE = 2; // 16x12 -> 32x24 on screen

// Palette
const O = "#e8833a"; // orange
const D = "#a85718"; // dark orange (stripes)
const W = "#f7f2e8"; // white spots
const P = "#3a2410"; // outline / paws
const E = "#1b1208"; // eye
const N = "#d96b5a"; // nose pink
const T = null;       // transparent

// Two frames so the tail/legs wiggle while moving.
// 16x12 grid (col, row). Cat faces RIGHT by default; flipped when moving left.
const FRAME_A: (string | null)[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,P],
  [T,T,T,T,T,T,T,T,T,T,T,P,O,P,P,O],
  [T,T,T,T,T,P,P,P,P,P,P,O,O,O,O,O],
  [T,T,T,T,P,O,W,O,O,W,O,O,O,O,D,O],
  [T,T,T,P,O,O,O,O,O,O,O,W,W,O,O,O],
  [T,T,P,O,E,O,O,N,O,O,E,O,W,W,O,D],
  [T,T,P,O,O,O,O,O,O,O,O,O,O,O,O,O],
  [T,T,P,O,W,O,D,O,O,D,O,O,W,O,D,O],
  [T,T,T,P,O,O,O,O,O,O,O,O,O,O,O,T],
  [T,T,T,P,O,O,O,O,O,O,O,O,O,O,T,T],
  [T,T,T,P,P,T,P,P,T,T,P,P,T,P,T,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

const FRAME_B: (string | null)[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T],
  [T,T,T,T,T,T,T,T,T,T,T,P,O,P,P,T],
  [T,T,T,T,T,P,P,P,P,P,P,O,O,O,O,P],
  [T,T,T,T,P,O,W,O,O,W,O,O,O,O,D,O],
  [T,T,T,P,O,O,O,O,O,O,O,W,W,O,O,O],
  [T,T,P,O,E,O,O,N,O,O,E,O,W,W,O,D],
  [T,T,P,O,O,O,O,O,O,O,O,O,O,O,O,O],
  [T,T,P,O,W,O,D,O,O,D,O,O,W,O,D,O],
  [T,T,T,P,O,O,O,O,O,O,O,O,O,O,O,T],
  [T,T,T,T,P,O,O,O,O,O,O,O,O,O,T,T],
  [T,T,T,P,T,P,P,T,P,P,T,T,P,P,T,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

function paintFrame(ctx: CanvasRenderingContext2D, frame: (string | null)[][]) {
  ctx.clearRect(0, 0, SPRITE_W * SCALE, SPRITE_H * SCALE);
  for (let y = 0; y < SPRITE_H; y++) {
    const row = frame[y];
    for (let x = 0; x < SPRITE_W; x++) {
      const c = row[x];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }
}

const CursorCat = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't show on touch / small screens / reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isSmall = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isSmall || reduceMotion) return;

    const wrap = wrapRef.current;
    const ca = canvasARef.current;
    const cb = canvasBRef.current;
    if (!wrap || !ca || !cb) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    [ca, cb].forEach((c) => {
      c.width = SPRITE_W * SCALE * dpr;
      c.height = SPRITE_H * SCALE * dpr;
      c.style.width = `${SPRITE_W * SCALE}px`;
      c.style.height = `${SPRITE_H * SCALE}px`;
      const cx = c.getContext("2d");
      if (!cx) return;
      cx.imageSmoothingEnabled = false;
      cx.scale(dpr, dpr);
    });
    paintFrame(ca.getContext("2d")!, FRAME_A);
    paintFrame(cb.getContext("2d")!, FRAME_B);

    // Cat trails the cursor with offset so it's "chasing", not under it
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx - 80;
    let cy = my + 60;
    let facing: 1 | -1 = 1;
    let frameToggle = 0;
    let frameAccum = 0;
    let lastT = performance.now();
    let visible = true;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onVis = () => { visible = !document.hidden; };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    const W_OFFSET = SPRITE_W * SCALE / 2;
    const H_OFFSET = SPRITE_H * SCALE / 2;

    const tick = (t: number) => {
      const dt = Math.min((t - lastT) / 16.6667, 3);
      lastT = t;
      if (!visible) { raf = requestAnimationFrame(tick); return; }

      // Target: a bit behind the cursor (so the cat chases)
      const targetX = mx - 40;
      const targetY = my + 30;
      const dx = targetX - cx;
      const dy = targetY - cy;
      const dist = Math.hypot(dx, dy);

      // Smooth follow (lerp), faster when far away
      const ease = Math.min(0.18, 0.06 + dist * 0.0015);
      cx += dx * ease * dt * 0.6;
      cy += dy * ease * dt * 0.6;

      if (Math.abs(dx) > 4) facing = dx > 0 ? 1 : -1;

      // Animate frame only when moving
      const moving = dist > 6;
      if (moving) {
        frameAccum += dt;
        if (frameAccum > 6) { frameToggle ^= 1; frameAccum = 0; }
      }

      const tx = cx - W_OFFSET;
      const ty = cy - H_OFFSET;
      wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) scaleX(${facing})`;
      ca.style.opacity = frameToggle === 0 ? "1" : "0";
      cb.style.opacity = frameToggle === 1 ? "1" : "0";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[60]"
      style={{
        width: SPRITE_W * SCALE,
        height: SPRITE_H * SCALE,
        willChange: "transform",
        imageRendering: "pixelated",
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
      }}
    >
      <canvas
        ref={canvasARef}
        className="absolute inset-0"
        style={{ imageRendering: "pixelated", transition: "opacity 60ms linear" }}
      />
      <canvas
        ref={canvasBRef}
        className="absolute inset-0"
        style={{ imageRendering: "pixelated", transition: "opacity 60ms linear", opacity: 0 }}
      />
    </div>
  );
};

export default CursorCat;
