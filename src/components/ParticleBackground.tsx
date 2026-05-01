import { useEffect, useRef } from "react";

/**
 * Lava-lamp ring background — Monster-livery vibe.
 *
 * Each "blob" is actually a deforming ring (concentric stroked outlines) so the
 * middle is see-through. Shapes are built from a Fourier-noised polar curve
 * that breathes and twists like a lava-lamp glob. Cursor warps the nearest
 * ring outward.
 *
 * Perf: drawn on a low-res offscreen canvas then upscaled, giving a soft glow
 * for free. DPR=1 internal. Pause on hidden tab. Honors prefers-reduced-motion.
 */

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  // Deformation harmonics
  a1: number; a2: number; a3: number;
  p1: number; p2: number; p3: number;
  spin: number;       // rotation rate
  rot: number;        // current rotation
  rings: number;      // how many concentric rings
  jitter: number;     // cursor-driven swell
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

    // Render at slightly higher fraction than before so the ring strokes stay crisp.
    const SCALE = lowEnd ? 0.45 : 0.6;

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

      const count = lowEnd ? 5 : cssW < 768 ? 6 : 9;
      const baseR = Math.min(w, h);
      blobsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: (Math.random() * 0.1 + 0.13) * baseR,
        hue: 150 + Math.random() * 18,
        a1: 0.18 + Math.random() * 0.12,
        a2: 0.08 + Math.random() * 0.1,
        a3: 0.04 + Math.random() * 0.06,
        p1: Math.random() * Math.PI * 2,
        p2: Math.random() * Math.PI * 2,
        p3: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.0035,
        rot: Math.random() * Math.PI * 2,
        rings: lowEnd ? 3 : 4,
        jitter: 0,
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

    // Build a deforming polar shape into the current path.
    const buildShape = (
      b: Blob,
      radius: number,
      time: number,
      steps: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        // Three sin harmonics → wobbly, organic outline that morphs over time
        const k =
          1 +
          b.a1 * Math.sin(3 * a + b.p1 + time * 0.6) +
          b.a2 * Math.sin(5 * a + b.p2 - time * 0.8) +
          b.a3 * Math.sin(2 * a + b.p3 + time * 0.4);
        const rr = radius * k + b.jitter * Math.sin(4 * a + time);
        const x = b.x + Math.cos(a + b.rot) * rr;
        const y = b.y + Math.sin(a + b.rot) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawFrame = (time: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const blobs = blobsRef.current;
      const m = mouseRef.current;
      const steps = lowEnd ? 56 : 80;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // Drift
        b.vx += Math.sin(time * 0.3 + b.p1) * 0.004 * dt;
        b.vy += Math.cos(time * 0.27 + b.p2) * 0.004 * dt;

        // Cursor push + swell
        if (m.active) {
          const dx = b.x - m.x;
          const dy = b.y - m.y;
          const dist2 = dx * dx + dy * dy;
          const influence = 220 * SCALE * 1.6;
          if (dist2 < influence * influence) {
            const dist = Math.sqrt(dist2) || 0.001;
            const force = (1 - dist / influence) * 0.7;
            b.vx += (dx / dist) * force * dt;
            b.vy += (dy / dist) * force * dt;
            b.jitter = Math.min(b.jitter + 0.8 * dt, b.r * 0.25);
          }
        }
        b.jitter *= 0.95;

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
        b.rot += b.spin * dt;

        const pad = b.r * 1.6;
        if (b.x < -pad) b.x = w + pad;
        else if (b.x > w + pad) b.x = -pad;
        if (b.y < -pad) b.y = h + pad;
        else if (b.y > h + pad) b.y = -pad;

        // Soft inner halo (filled, very faint, see-through center)
        const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.2, b.x, b.y, b.r * 1.15);
        grad.addColorStop(0, `hsla(${b.hue}, 100%, 55%, 0)`);
        grad.addColorStop(0.6, `hsla(${b.hue}, 100%, 55%, 0.12)`);
        grad.addColorStop(1, `hsla(${b.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        buildShape(b, b.r, time, steps);
        ctx.fill();

        // Concentric deforming rings — the lava-lamp / Monster-claw vibe
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let r = 0; r < b.rings; r++) {
          const t = r / (b.rings - 1 || 1); // 0..1 (inner..outer)
          const radius = b.r * (0.45 + t * 0.85);
          const alpha = 0.85 - t * 0.55;
          const lineW = (lowEnd ? 1.4 : 2) * (1.4 - t * 0.7);
          ctx.strokeStyle = `hsla(${b.hue}, 100%, ${60 - t * 10}%, ${alpha})`;
          ctx.lineWidth = lineW;
          buildShape(b, radius, time + r * 0.4, steps);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    if (reduceMotion) {
      drawFrame(0, 0);
      return () => {
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const targetFrameMs = lowEnd ? 1000 / 40 : 1000 / 60;
    let lastT = performance.now();
    let acc = 0;

    const animate = (t: number) => {
      const delta = t - lastT;
      lastT = t;
      animRef.current = requestAnimationFrame(animate);

      if (!visibleRef.current) return;
      acc += delta;
      if (acc < targetFrameMs) return;
      const dt = Math.min(acc / 16.6667, 2);
      acc = 0;

      drawFrame(t * 0.001, dt);
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
        opacity: 0.9,
        imageRendering: "auto",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleBackground;
