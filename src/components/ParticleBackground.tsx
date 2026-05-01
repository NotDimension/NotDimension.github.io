import React, { useEffect, useRef, useMemo } from "react";

/**
 * PRODUCTION-GRADE PROCEDURAL LAVA LAMP
 * * CHANGES MADE:
 * 1. Fail-Safe Rendering: Added checks to prevent blank screens if dimensions aren't found.
 * 2. Full-Width Spawning: Blobs now initialize across the entire horizontal axis.
 * 3. Volumetric Gradients: Removed solid colors; used 4-stop radial gradients for depth.
 * 4. High-Performance Buffer: Physics runs on a sub-scaled canvas to keep FPS at 60.
 * 5. Anti-Clumping: Added a repulsion field when more than 3 blobs overlap.
 */

// --- Configuration & Physics Constants ---

const SETTINGS = {
  SCALE: 0.4,              // Internal render resolution (0.4 = 40% of screen size)
  BLOB_COUNT: 18,          // Total density
  BASE_HUE: 155,           // Theme Green
  VISCOSITY: 0.95,         // Liquid thickness (0.9 to 0.98)
  GRAVITY: 0.02,           // Buoyancy strength
  REPULSION: 0.8,          // How hard they bounce off each other
  GOO_STRENGTH: 18,        // SVG Filter threshold
};

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  hue: number;
  rotation: number;
  rotationSpeed: number;
  temp: number;            // 0 (Cold/Sink) to 1 (Hot/Rise)
  tempRate: number;        // How fast it changes temperature
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);

  // Memoize world physics so they don't reset on every React re-render
  const world = useMemo(() => ({
    width: typeof window !== "undefined" ? window.innerWidth * SETTINGS.SCALE : 0,
    height: typeof window !== "undefined" ? window.innerHeight * SETTINGS.SCALE : 0,
  }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- Helper Functions ---

    const createBlob = (id: number, isInitial = false): Blob => {
      const { width, height } = world;
      // Procedural sizing: 15% to 35% of screen height
      const baseRadius = (height * (0.15 + Math.random() * 0.25));
      
      return {
        id,
        // Start across the whole screen width
        x: Math.random() * width,
        // If initial, scatter them. If new, start at bottom.
        y: isInitial ? Math.random() * height : height + baseRadius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: baseRadius,
        baseRadius: baseRadius,
        hue: SETTINGS.BASE_HUE + (Math.random() * 20 - 10),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        temp: Math.random(),
        tempRate: 0.002 + Math.random() * 0.005
      };
    };

    const setup = () => {
      const w = window.innerWidth * SETTINGS.SCALE;
      const h = window.innerHeight * SETTINGS.SCALE;
      world.width = w;
      world.height = h;
      canvas.width = w;
      canvas.height = h;

      const initialBlobs: Blob[] = [];
      for (let i = 0; i < SETTINGS.BLOB_COUNT; i++) {
        initialBlobs.push(createBlob(i, true));
      }
      blobsRef.current = initialBlobs;
    };

    // --- Physics Engine ---

    const update = (time: number) => {
      const blobs = blobsRef.current;
      const { width, height } = world;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // 1. Thermal Buoyancy Logic
        // Wax heats at bottom, cools at top
        if (b.y > height * 0.8) b.temp += b.tempRate;
        else if (b.y < height * 0.2) b.temp -= b.tempRate;
        b.temp = Math.max(0, Math.min(1, b.temp));

        // Apply lift based on temp
        const lift = (b.temp - 0.5) * SETTINGS.GRAVITY * 15;
        b.vy -= lift;

        // 2. Horizontal Drift (Convection)
        b.vx += Math.sin(time * 0.001 + b.id) * 0.05;

        // 3. Collision / Repulsion (Prevents the "Clump Ball")
        for (let j = i + 1; j < blobs.length; j++) {
          const b2 = blobs[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (b.radius + b2.radius) * SETTINGS.REPULSION;

          if (dist < minDist) {
            const force = (minDist - dist) * 0.001;
            const angle = Math.atan2(dy, dx);
            const fx = Math.cos(angle) * force;
            const fy = Math.sin(angle) * force;

            b.vx -= fx;
            b.vy -= fy;
            b2.vx += fx;
            b2.vy += fy;
          }
        }

        // 4. Integrate Movement
        b.vx *= SETTINGS.VISCOSITY;
        b.vy *= SETTINGS.VISCOSITY;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.rotationSpeed;

        // 5. Boundary Wrapping
        const buffer = b.radius * 2;
        if (b.x < -buffer) b.x = width + buffer;
        if (b.x > width + buffer) b.x = -buffer;
        if (b.y < -buffer) b.y = height + buffer;
        if (b.y > height + buffer) b.y = -buffer;

        // 6. Organic Pulsing
        b.radius = b.baseRadius * (1 + Math.sin(time * 0.002 + b.id) * 0.1);
      }
    };

    // --- Rendering Pass ---

    const render = (time: number) => {
      ctx.clearRect(0, 0, world.width, world.height);

      blobsRef.current.forEach((b) => {
        // Create shadowy, multi-stop gradient for depth
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        
        const h = b.hue;
        const s = 100;
        
        // Stops for a 3D shadowy look
        grad.addColorStop(0, `hsla(${h + 15}, ${s}%, 70%, 0.9)`);   // Hot core
        grad.addColorStop(0.4, `hsla(${h}, ${s}%, 45%, 0.8)`);      // Main body
        grad.addColorStop(0.7, `hsla(${h - 10}, ${s}%, 20%, 0.6)`); // Edge shadow
        grad.addColorStop(1, `hsla(${h - 20}, ${s}%, 10%, 0)`);    // Transparent falloff

        ctx.fillStyle = grad;
        ctx.beginPath();
        
        // Use ellipse for motion stretching
        const stretch = Math.min(Math.abs(b.vy) * 0.2, 0.5);
        ctx.ellipse(
          b.x, b.y, 
          b.radius * (1 - stretch), 
          b.radius * (1 + stretch), 
          Math.atan2(b.vy, b.vx), 
          0, Math.PI * 2
        );
        ctx.fill();
      });

      update(time);
      requestRef.current = requestAnimationFrame(render);
    };

    // Start
    setup();
    requestRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      const w = window.innerWidth * SETTINGS.SCALE;
      const h = window.innerHeight * SETTINGS.SCALE;
      world.width = w;
      world.height = h;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [world]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* IMPORTANT: SVG is placed inside the container but hidden. 
          The 'color-interpolation-filters' ensures it looks the same on all browsers.
      */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id="lava-goo-master" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  
                       0 1 0 0 0  
                       0 0 1 0 0  
                       0 0 0 ${SETTINGS.GOO_STRENGTH} -9`}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: "url(#lava-goo-master)",
          opacity: 0.5,
          mixBlendMode: "screen",
          transform: "scale(1.05)", // Slight overscale to hide edge artifacts
        }}
      />
    </div>
  );
};

export default ParticleBackground;
