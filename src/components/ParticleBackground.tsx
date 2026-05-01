import { useEffect, useRef } from "react";

/**
 * Advanced Gooey Lava Lamp Background
 * * CORE FEATURES:
 * - SVG Alpha-Thresholding: The gold standard for web "goo". It blurs the 
 * shapes and crunches the alpha channel so they physically merge like liquid.
 * - N-Body Physics: Blobs calculate distance to each other. They attract to simulate
 * surface tension, and repel to preserve volume.
 * - Brownian Motion & Chaos: Complex sine wave interference makes paths unpredictable.
 * - Mass & Velocity Variance: Big blobs move slow and have high inertia; small 
 * droplets zip around erratically.
 */

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;       // The resting radius
  r: number;           // The current radius (pulses over time)
  mass: number;        // Affects momentum and collision pushback
  phaseX: number;      // Seed for random horizontal wandering
  phaseY: number;      // Seed for random vertical wandering
  wanderSpeed: number; // How fast this specific blob changes direction
  temperature: number; // Drives vertical buoyancy
  isDroplet: boolean;  // Small fast blobs behave slightly differently
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // We scale down the internal canvas resolution slightly because the SVG 
    // Goo filter is computationally heavy. This keeps the frame rate buttery.
    const pixelRatio = window.devicePixelRatio > 1 ? 1 : 0.75;
    
    let w = 0;
    let h = 0;

    // --- PHYSICS CONSTANTS ---
    const ATTRACTION_DIST_MULTIPLIER = 2.2; // How far away they start pulling each other
    const REPULSION_DIST_MULTIPLIER = 0.8;  // How close before they violently push away
    const SURFACE_TENSION = 0.0008;         // Strength of the merge pull
    const VISCOSITY = 0.94;                 // Friction (lower = more sliding, higher = stopping)
    const BASE_HUE = 155;                   // The theme's green

    const initBlobs = () => {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 12 : 20;
      const newBlobs: Blob[] = [];

      for (let i = 0; i < count; i++) {
        // Generate a mix of large main globs and tiny droplets
        const isDroplet = Math.random() > 0.6;
        
        // Base radius relative to screen size
        const minSize = isMobile ? 20 : 30;
        const maxSize = isMobile ? 80 : 140;
        const radius = isDroplet 
          ? minSize + Math.random() * 20 
          : minSize + 40 + Math.random() * (maxSize - minSize);

        newBlobs.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          baseR: radius,
          r: radius,
          mass: radius * radius, // Area = mass
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          wanderSpeed: (isDroplet ? 1.5 : 0.5) + Math.random(),
          temperature: Math.random(),
          isDroplet,
        });
      }
      blobsRef.current = newBlobs;
    };

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      w = cssW * pixelRatio;
      h = cssH * pixelRatio;
      
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      
      if (blobsRef.current.length === 0) {
        initBlobs();
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX * pixelRatio;
      mouseRef.current.y = e.clientY * pixelRatio;
      mouseRef.current.active = true;
    };
    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // --- MAIN ANIMATION LOOP ---
    const render = (time: number) => {
      const timeSec = time * 0.001;
      
      // Clear with absolute transparency so the SVG filter works cleanly
      ctx.clearRect(0, 0, w, h);
      
      const blobs = blobsRef.current;
      const m = mouseRef.current;

      // 1. APPLY FORCES & INTERACTION
      for (let i = 0; i < blobs.length; i++) {
        const a = blobs[i];

        // Brownian Motion (Unpredictable wandering via noise/sine waves)
        // Droplets move faster and more erratically
        const driftForce = a.isDroplet ? 0.15 : 0.05;
        a.vx += Math.sin(timeSec * a.wanderSpeed + a.phaseX) * driftForce;
        a.vy += Math.cos(timeSec * (a.wanderSpeed * 0.8) + a.phaseY) * driftForce;

        // Thermal Buoyancy (Hot rises, cold sinks gently)
        a.temperature += Math.sin(timeSec * 0.2 + a.id) * 0.01;
        const buoyancy = (a.temperature - 0.5) * 0.08;
        a.vy -= buoyancy;

        // Blob-to-Blob Interaction (The Goo Mechanics)
        for (let j = i + 1; j < blobs.length; j++) {
          const b = blobs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const combinedRadius = a.r + b.r;

          if (dist < combinedRadius * ATTRACTION_DIST_MULTIPLIER) {
            // They are close enough to feel each other
            const forceMag = (dist - combinedRadius * REPULSION_DIST_MULTIPLIER) * SURFACE_TENSION;
            
            const fx = (dx / dist) * forceMag;
            const fy = (dy / dist) * forceMag;

            // Apply force inversely proportional to mass (heavy things move less)
            a.vx += fx * (b.mass / (a.mass + b.mass));
            a.vy += fy * (b.mass / (a.mass + b.mass));
            b.vx -= fx * (a.mass / (a.mass + b.mass));
            b.vy -= fy * (a.mass / (a.mass + b.mass));
          }
        }

        // Mouse Interaction (Gently pushes the goo away like a magnetic field)
        if (m.active) {
          const dx = a.x - m.x;
          const dy = a.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 250 * pixelRatio;
          
          if (dist < influenceRadius) {
            const force = (influenceRadius - dist) * 0.0005;
            a.vx += (dx / dist) * force;
            a.vy += (dy / dist) * force;
          }
        }

        // Breathing effect (Radius pulses slightly over time)
        a.r = a.baseR * (1 + Math.sin(timeSec * 2 + a.phaseX) * 0.1);

        // Apply Velocity & Viscosity
        a.vx *= VISCOSITY;
        a.vy *= VISCOSITY;
        a.x += a.vx;
        a.y += a.vy;

        // Boundaries (Soft bouncing against screen edges)
        const margin = a.r;
        if (a.x < -margin) { a.x = -margin; a.vx *= -1; }
        if (a.x > w + margin) { a.x = w + margin; a.vx *= -1; }
        if (a.y < -margin) { a.y = h + margin; a.y = -margin; a.vy *= -1; } // Wrapping from top
        if (a.y > h + margin) { a.y = -margin; a.vy *= 0.5; } // Dropping off bottom wraps to top
      }

      // 2. DRAWING
      // We draw solid, bright circles. The SVG filter handles turning this into "goo".
      ctx.fillStyle = `hsl(${BASE_HUE}, 100%, 45%)`;
      ctx.beginPath();
      
      for (let i = 0; i < blobs.length; i++) {
        const a = blobs[i];
        // Draw the main circle
        ctx.moveTo(a.x, a.y);
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      }
      ctx.fill();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <>
      {/* THE SECRET SAUCE: The SVG Goo Filter.
        This blurs the sharp canvas circles, and the feColorMatrix aggressively clamps 
        the alpha channel. This creates the "surface tension" where circles snap together.
      */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="goo">
            {/* Blur the incoming graphics */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            {/* Crunch the alpha channel. 
              The matrix multiplies alpha by 30, and subtracts 15. 
              This makes fuzzy edges completely transparent, and centers completely solid.
            */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 30 -15"
              result="goo"
            />
            {/* Draw the original color back over the morphed geometry */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          // Apply the SVG filter to the entire canvas element
          filter: "url(#goo)",
          opacity: 0.25, // Lower opacity so it acts like a background aura
          mixBlendMode: "screen", // Makes the green pop dynamically against dark backgrounds
        }}
      />
    </>
  );
};

export default ParticleBackground;
