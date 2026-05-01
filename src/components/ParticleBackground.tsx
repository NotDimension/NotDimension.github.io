import { useEffect, useRef } from "react";

/**
 * Lava-lamp / metaball background.
 * - Soft, gooey blobs slowly drift, merge and split (Lando Norris "monster helmet" vibe).
 * - Cursor warps the field: nearby blobs are gently pushed/pulled and grow.
 * - Uses the site's green accent palette only.
 * - Perf: low-res offscreen canvas + blur filter (cheap metaballs without per-pixel math),
 *   DPR cap, pause when tab hidden, honors prefers-reduced-motion.
 */

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;       // base radius
  rJitter: number; // animated breathing
  hue: number;     // slight hue shift inside green range
  phase: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const lowEnd =
      isCoarse ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory && nav.deviceMemory <= 4);

    // Render the metaball field at a fraction of screen res — looks identical after blur,
    // and is dramatically cheaper. This is the key perf trick.
    const SCALE = lowEnd ? 0.28 : 0.4;
    const dpr = 1; // internal canvas — no need for DPR

    let w = 0;
    let h = 0;

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      w = Math.max(1, Math.floor(cssW * SCALE));
      h = Math.max(1, Math.floor(cssH * SCALE));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const count = lowEnd ? 6 : cssW < 768 ? 7 : 10;
      blobsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: (Math.random() * 0.08 + 0.09) * Math.min(w, h),
        rJitter: 0,
        hue: 150 + Math.random() * 18, // 150–168, all greens
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onVisibility = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX * SCALE;
      mouseRef.current.y = e.clientY * SCALE;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    if (!isCoarse) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }

    // Static frame for reduced motion
    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.filter = "blur(18px)";
      for (const b of blobsRef.current) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `hsla(${b.hue}, 100%, 55%, 0.55)`);
        grad.addColorStop(1, `hsla(${b.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.filter = "none";
    };

    if (reduceMotion) {
      drawStatic();
      return () => {
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    // Throttle to ~45fps on low-end, ~60 elsewhere
    const targetFrameMs = lowEnd ? 1000 / 40 : 1000 / 60;
    let lastT = performance.now();
    let acc = 0;

    const blurPx = lowEnd ? 14 : 20;

    const animate = (t: number) => {
      const delta = t - lastT;
      lastT = t;
      animRef.current = requestAnimationFrame(animate);

      if (!visibleRef.current) return;
      acc += delta;
      if (acc < targetFrameMs) return;
      acc = 0;

      const dt = Math.min(delta / 16.6667, 2);

      ctx.clearRect(0, 0, w, h);

      // Soft glow: large blur turns overlapping circles into gooey metaballs
      ctx.filter = `blur(${blurPx}px)`;
      ctx.globalCompositeOperation = "lighter";

      const blobs = blobsRef.current;
      const m = mouseRef.current;
      const now = t * 0.001;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // Lava-lamp drift: gentle organic motion
        b.phase += 0.004 * dt;
        b.vx += Math.sin(now * 0.3 + b.phase) * 0.004 * dt;
        b.vy += Math.cos(now * 0.27 + b.phase * 1.3) * 0.004 * dt;

        // Cursor influence (push outward, pull slightly when very near)
        if (m.active) {
          const dx = b.x - m.x;
          const dy = b.y - m.y;
          const dist2 = dx * dx + dy * dy;
          const influence = (lowEnd ? 140 : 180) * SCALE * 2;
          if (dist2 < influence * influence) {
            const dist = Math.sqrt(dist2) || 0.001;
            const force = (1 - dist / influence) * 0.6;
            b.vx += (dx / dist) * force * dt;
            b.vy += (dy / dist) * force * dt;
            b.rJitter = Math.min(b.rJitter + 0.6 * dt, b.r * 0.35);
          }
        }
        b.rJitter *= 0.96;

        // Damping & soft speed cap
        b.vx *= 0.985;
        b.vy *= 0.985;
        const sp = Math.hypot(b.vx, b.vy);
        const maxSp = 0.9;
        if (sp > maxSp) {
          b.vx = (b.vx / sp) * maxSp;
          b.vy = (b.vy / sp) * maxSp;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wrap around edges so the field always feels alive
        const pad = b.r * 1.5;
        if (b.x < -pad) b.x = w + pad;
        else if (b.x > w + pad) b.x = -pad;
        if (b.y < -pad) b.y = h + pad;
        else if (b.y > h + pad) b.y = -pad;

        const breath = 1 + Math.sin(now * 0.6 + b.phase) * 0.08;
        const r = b.r * breath + b.rJitter;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, `hsla(${b.hue}, 100%, 58%, 0.55)`);
        grad.addColorStop(0.55, `hsla(${b.hue}, 100%, 50%, 0.22)`);
        grad.addColorStop(1, `hsla(${b.hue}, 100%, 45%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (!isCoarse) {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.85,
        // Browser upscales the low-res canvas smoothly — adds to the gooey feel
        imageRendering: "auto",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleBackground;
