import { useEffect, useRef } from "react";

/**
 * Realistic lava-lamp background.
 *
 * - Solid, soft, gooey blobs (filled — no rings) that slowly rise/sink
 *   like wax in a lava lamp, with buoyancy + thermal cycling.
 * - Big blobs occasionally "shed" a smaller droplet that rises away.
 * - Random subtle pulses make some blobs swell briefly.
 * - Cursor does NOT push blobs — instead, hovering near a blob shifts its
 *   hue toward a brighter green for a soft glow response.
 * - Perf: low-res offscreen canvas + heavy blur for cheap metaballs.
 */

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;          // current radius
  baseR: number;      // resting radius
  pulse: number;      // transient swell (0..1)
  pulseTimer: number; // seconds until next random pulse
  hue: number;        // current hue (animates toward target)
  targetHue: number;
  temp: number;       // thermal cycle 0..1 (drives rise/sink)
  tempDir: 1 | -1;
  phase: number;
  shedTimer: number;  // seconds until next droplet shed (large blobs only)
  alive: boolean;
}

const BASE_HUE = 152;     // site green
const HOT_HUE = 162;      // brighter, more lime — "hot"
const HOVER_HUE = 168;    // hover response

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

    // Low internal res + blur = cheap metaballs
    const SCALE = lowEnd ? 0.3 : 0.42;

    let w = 0;
    let h = 0;

    const makeBlob = (opts?: Partial<Blob>): Blob => {
      const baseR =
        opts?.baseR ?? (Math.random() * 0.07 + 0.08) * Math.min(w, h);
      return {
        x: opts?.x ?? Math.random() * w,
        y: opts?.y ?? Math.random() * h,
        vx: opts?.vx ?? (Math.random() - 0.5) * 0.05,
        vy: opts?.vy ?? (Math.random() - 0.5) * 0.05,
        r: baseR,
        baseR,
        pulse: 0,
        pulseTimer: 2 + Math.random() * 6,
        hue: BASE_HUE + Math.random() * 6,
        targetHue: BASE_HUE + Math.random() * 6,
        temp: Math.random(),
        tempDir: Math.random() < 0.5 ? 1 : -1,
        phase: Math.random() * Math.PI * 2,
        shedTimer: 6 + Math.random() * 10,
        alive: true,
      };
    };

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      w = Math.max(1, Math.floor(cssW * SCALE));
      h = Math.max(1, Math.floor(cssH * SCALE));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const count = lowEnd ? 6 : cssW < 768 ? 7 : 11;
      blobsRef.current = Array.from({ length: count }, () => makeBlob());
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

    const blurPx = lowEnd ? 16 : 22;

    const drawBlob = (b: Blob) => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 100%, 60%, 0.85)`);
      grad.addColorStop(0.55, `hsla(${b.hue}, 100%, 50%, 0.5)`);
      grad.addColorStop(1, `hsla(${b.hue}, 100%, 45%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFrame = (timeSec: number, dt: number, dtSec: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.filter = `blur(${blurPx}px)`;
      ctx.globalCompositeOperation = "lighter";

      const blobs = blobsRef.current;
      const m = mouseRef.current;
      const mouseInfluence = 180 * SCALE * 1.6;

      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        if (!b.alive) {
          blobs.splice(i, 1);
          continue;
        }

        // ----- Thermal buoyancy: blobs cycle hot↔cool, driving rise/sink -----
        b.temp += b.tempDir * 0.04 * dtSec;
        if (b.temp > 1) { b.temp = 1; b.tempDir = -1; }
        else if (b.temp < 0) { b.temp = 0; b.tempDir = 1; }

        // Hot blobs rise (negative y), cool blobs sink. Very gentle.
        const buoyancy = (b.temp - 0.5) * -0.06; // px/frame
        b.vy += buoyancy * dt;

        // Tiny lateral wobble — convection currents
        b.vx += Math.sin(timeSec * 0.4 + b.phase) * 0.0025 * dt;

        // Heavy damping = slow, viscous wax motion
        b.vx *= 0.94;
        b.vy *= 0.96;

        // Cap speed
        const sp = Math.hypot(b.vx, b.vy);
        const maxSp = 0.55;
        if (sp > maxSp) {
          b.vx = (b.vx / sp) * maxSp;
          b.vy = (b.vy / sp) * maxSp;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Bounce softly off top/bottom (the "lamp" walls), wrap horizontally
        if (b.y < b.r * 0.3) {
          b.y = b.r * 0.3;
          b.vy = Math.abs(b.vy) * 0.5;
          b.tempDir = -1; // cools at top
        } else if (b.y > h - b.r * 0.3) {
          b.y = h - b.r * 0.3;
          b.vy = -Math.abs(b.vy) * 0.5;
          b.tempDir = 1; // heats at bottom
        }
        const padX = b.r * 1.5;
        if (b.x < -padX) b.x = w + padX;
        else if (b.x > w + padX) b.x = -padX;

        // ----- Random pulse: occasional swell -----
        b.pulseTimer -= dtSec;
        if (b.pulseTimer <= 0) {
          b.pulse = 1;
          b.pulseTimer = 4 + Math.random() * 8;
        }
        b.pulse *= Math.pow(0.5, dtSec * 1.2); // decay ~1.2/sec

        const breath = 1 + Math.sin(timeSec * 0.5 + b.phase) * 0.05;
        b.r = b.baseR * breath * (1 + b.pulse * 0.35);

        // ----- Hue: thermal + hover response -----
        let hueTarget = BASE_HUE + (HOT_HUE - BASE_HUE) * b.temp;
        if (m.active) {
          const dx = b.x - m.x;
          const dy = b.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseInfluence * mouseInfluence) {
            const k = 1 - Math.sqrt(d2) / mouseInfluence;
            hueTarget = hueTarget + (HOVER_HUE - hueTarget) * k;
          }
        }
        b.targetHue = hueTarget;
        b.hue += (b.targetHue - b.hue) * Math.min(1, dtSec * 3);

        // ----- Shedding: large blobs occasionally spawn a small droplet -----
        b.shedTimer -= dtSec;
        if (
          b.shedTimer <= 0 &&
          b.baseR > Math.min(w, h) * 0.11 &&
          blobs.length < 16
        ) {
          b.shedTimer = 8 + Math.random() * 12;
          // Shed upward if hot, downward if cool
          const dir = b.temp > 0.5 ? -1 : 1;
          const droplet = makeBlob({
            x: b.x + (Math.random() - 0.5) * b.r * 0.4,
            y: b.y + dir * b.r * 0.6,
            vx: (Math.random() - 0.5) * 0.15,
            vy: dir * 0.25,
            baseR: b.baseR * (0.35 + Math.random() * 0.2),
          });
          droplet.temp = b.temp;
          droplet.tempDir = b.tempDir;
          droplet.hue = b.hue;
          blobs.push(droplet);
          // Parent slightly shrinks then recovers
          b.baseR *= 0.92;
        }

        drawBlob(b);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
    };

    if (reduceMotion) {
      drawFrame(0, 0, 0);
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
      const dtSec = acc / 1000;
      acc = 0;

      drawFrame(t * 0.001, dt, dtSec);
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
        imageRendering: "auto",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleBackground;
