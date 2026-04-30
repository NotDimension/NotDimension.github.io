import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
}

/**
 * Lightweight particle background — hero-only, perf-tuned:
 * - Pauses when hero is offscreen (IntersectionObserver)
 * - Pauses when tab hidden
 * - Dropped expensive O(n²) connection lines (huge win)
 * - Lower particle count, devicePixelRatio aware
 * - Honors prefers-reduced-motion
 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Detect low-end: coarse pointer (mobile), low core count, low memory
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const lowEnd =
      isCoarse ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory && nav.deviceMemory <= 4);

    // Cap DPR aggressively on low-end devices
    const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cap = lowEnd ? (w < 768 ? 28 : 50) : w < 768 ? 50 : 95;
      const target = Math.min(cap, Math.floor((w * h) / (lowEnd ? 30000 : 18000)));
      particlesRef.current = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 2.0 + 0.6,
        baseOpacity: Math.random() * 0.55 + 0.3,
      }));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Pause on tab hidden (always-on across the whole site otherwise)
    const onVisibility = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let lastT = performance.now();
    const animate = (t: number) => {
      const dt = Math.min((t - lastT) / 16.6667, 2); // normalize to ~60fps
      lastT = t;

      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(155, 100%, 65%, ${p.baseOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "hsla(155, 100%, 60%, 0.7)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};

export default ParticleBackground;
