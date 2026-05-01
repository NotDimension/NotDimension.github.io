import { useEffect, useRef } from "react";

/**
 * Optimized Sharp Lava Lamp Background
 * - Procedurally generated physics (unique per visitor)
 * - Solid blobs (no blur filter) using gradient stops
 * - Performance optimized: no heavy CSS filters
 */

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  pulse: number;
  pulseTimer: number;
  hue: number;
  targetHue: number;
  temp: number;
  tempDir: 1 | -1;
  phase: number;
  shedTimer: number;
  alive: boolean;
  viscosity: number; // Unique per-blob movement factor
}

const BASE_HUE = 152;
const HOT_HUE = 162;
const HOVER_HUE = 168;

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  
  // Procedural world constants (unique per session)
  const worldRef = useRef({
    gravity: 0.04 + Math.random() * 0.04,
    wobbleSpeed: 0.3 + Math.random() * 0.4,
    viscosity: 0.92 + Math.random() * 0.05
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd = (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 4);

    // Using higher resolution since we removed the expensive blur filter
    const SCALE = window.devicePixelRatio || 1;

    let w = 0;
    let h = 0;

    const makeBlob = (opts?: Partial<Blob>): Blob => {
      const baseR = opts?.baseR ?? (Math.random() * 0.06 + 0.07) * Math.min(window.innerWidth, window.innerHeight);
      return {
        x: opts?.x ?? Math.random() * w,
        y: opts?.y ?? Math.random() * h,
        vx: opts?.vx ?? (Math.random() - 0.5) * 0.5,
        vy: opts?.vy ?? (Math.random() - 0.5) * 0.5,
        r: baseR,
        baseR,
        pulse: 0,
        pulseTimer: 2 + Math.random() * 6,
        hue: BASE_HUE + Math.random() * 4,
        targetHue: BASE_HUE,
        temp: Math.random(),
        tempDir: Math.random() < 0.5 ? 1 : -1,
        phase: Math.random() * Math.PI * 2,
        shedTimer: 10 + Math.random() * 15,
        alive: true,
        viscosity: 0.94 + Math.random() * 0.04, // Procedural drag
      };
    };

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      w = cssW * SCALE;
      h = cssH * SCALE;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const count = lowEnd ? 5 : cssW < 768 ? 6 : 9;
      blobsRef.current = Array.from({ length: count }, () => makeBlob());
    };
    
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onPointer = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX * SCALE;
      mouseRef.current.y = e.clientY * SCALE;
      mouseRef.current.active = true;
    };
    
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", () => { mouseRef.current.active = false; });

    const drawBlob = (b: Blob) => {
      // Instead of Global Blur, we use a sharp-step radial gradient for solid look
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 100%, 60%, 0.8)`);
      grad.addColorStop(0.85, `hsla(${b.hue}, 100%, 45%, 0.6)`);
      grad.addColorStop(0.98, `hsla(${b.hue}, 100%, 40%, 0.1)`);
      grad.addColorStop(1, `hsla(${b.hue}, 100%, 40%, 0)`);
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      // Use a slightly oval shape based on velocity for "gooey" stretching
      const stretch = Math.min(Math.abs(b.vy) * 0.1, 0.2);
      ctx.ellipse(b.x, b.y, b.r * (1 - stretch), b.r * (1 + stretch), 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFrame = (timeSec: number, dtSec: number) => {
      ctx.clearRect(0, 0, w, h);
      
      const blobs = blobsRef.current;
      const m = mouseRef.current;
      const world = worldRef.current;
      const mouseInfluence = 200 * SCALE;

      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        
        // Buoyancy Logic
        b.temp += b.tempDir * 0.05 * dtSec;
        if (b.temp > 1) { b.temp = 1; b.tempDir = -1; }
        else if (b.temp < 0) { b.temp = 0; b.tempDir = 1; }

        const buoyancy = (b.temp - 0.5) * -world.gravity;
        b.vy += buoyancy;

        // Convection Wobble
        b.vx += Math.sin(timeSec * world.wobbleSpeed + b.phase) * 0.01;

        // Friction / Viscosity
        b.vx *= b.viscosity;
        b.vy *= b.viscosity;

        b.x += b.vx * (dtSec * 60);
        b.y += b.vy * (dtSec * 60);

        // Soft Wall Bounce
        if (b.y < b.r) {
          b.vy += 0.05;
          b.tempDir = -1;
        } else if (b.y > h - b.r) {
          b.vy -= 0.05;
          b.tempDir = 1;
        }

        // Horizontal Wrap
        const wrapPad = b.r * 2;
        if (b.x < -wrapPad) b.x = w + wrapPad;
        else if (b.x > w + wrapPad) b.x = -wrapPad;

        // Hover Response
        let hueTarget = BASE_HUE + (HOT_HUE - BASE_HUE) * b.temp;
        if (m.active) {
          const dx = b.x - m.x;
          const dy = b.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseInfluence * mouseInfluence) {
            const k = 1 - Math.sqrt(d2) / mouseInfluence;
            hueTarget = hueTarget + (HOVER_HUE - hueTarget) * k;
            // Subtle "attraction" to mouse for gooey feel
            b.vx -= dx * 0.0001;
            b.vy -= dy * 0.0001;
          }
        }
        
        b.hue += (hueTarget - b.hue) * 0.1;
        
        // Pulse Logic
        b.pulseTimer -= dtSec;
        if (b.pulseTimer <= 0) {
          b.pulse = 1;
          b.pulseTimer = 5 + Math.random() * 10;
        }
        b.pulse *= 0.96;
        b.r = b.baseR * (1 + b.pulse * 0.15 + Math.sin(timeSec + b.phase) * 0.03);

        drawBlob(b);
      }
    };

    if (reduceMotion) {
      drawFrame(0, 0);
      return;
    }

    const animate = (t: number) => {
      const dtSec = 0.016; // Stable step for physics
      drawFrame(t * 0.001, dtSec);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.6,
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleBackground;
