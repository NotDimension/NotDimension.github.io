import React, { useEffect, useRef, useMemo } from "react";

/**
 * THERMODYNAMIC LAVA ENGINE (V5 - FINAL PERFORMANCE TUNED)
 * * * FEATURES:
 * 1. Heat-Source Physics: Blobs heat at bottom (buoyancy increases) and cool at top.
 * 2. Size Diversity: Randomization between massive 'mother' blobs and tiny 'satellite' droplets.
 * 3. Performance Profiling: Uses a low-res simulation buffer to minimize per-pixel filter math.
 * 4. Advanced Goo: Multi-stop gradients with sRGB color interpolation for better depth.
 */

interface PhysicsConfig {
  viscosity: number;
  heatPower: number;
  coolRate: number;
  friction: number;
  spread: number;
}

interface LavaBlob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  temp: number;      // 0 (Cold) to 1 (Hot)
  targetTemp: number;
  noiseX: number;
  noiseY: number;
  hue: number;
  mass: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const blobsRef = useRef<LavaBlob[]>([]);

  // Procedural session constants
  const config = useMemo<PhysicsConfig>(() => ({
    viscosity: 0.96 + Math.random() * 0.02,
    heatPower: 0.04 + Math.random() * 0.02,
    coolRate: 0.005,
    friction: 0.98,
    spread: 0.75
  }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // PERFORMANCE OPTIMIZATION
    // We run the simulation at 35% resolution. The SVG blur filter
    // re-interpolates the edges, so it looks high-res but runs much faster.
    const SIM_SCALE = 0.35;
    let w = window.innerWidth * SIM_SCALE;
    let h = window.innerHeight * SIM_SCALE;

    const initBlobs = () => {
      const count = window.innerWidth < 768 ? 12 : 20;
      const b: LavaBlob[] = [];
      
      for (let i = 0; i < count; i++) {
        // High randomization in sizes
        const sizeVariance = Math.random();
        let baseR;
        
        if (sizeVariance > 0.85) {
          baseR = (h * 0.18) + (Math.random() * h * 0.1); // Huge blobs
        } else if (sizeVariance > 0.4) {
          baseR = (h * 0.08) + (Math.random() * h * 0.08); // Medium blobs
        } else {
          baseR = (h * 0.03) + (Math.random() * h * 0.04); // Tiny satellite droplets
        }

        b.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          baseRadius: baseR,
          radius: baseR,
          temp: Math.random(),
          targetTemp: 0,
          noiseX: Math.random() * 100,
          noiseY: Math.random() * 100,
          hue: 155 + (Math.random() * 25 - 12), // Variants of your site green
          mass: baseR * baseR
        });
      }
      blobsRef.current = b;
    };

    const updatePhysics = (time: number) => {
      const blobs = blobsRef.current;
      const dt = 1.0; // Delta time normalization

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // 1. THERMODYNAMICS (LAVA LAMP MOVEMENT)
        // Blobs gain heat at the bottom (h) and lose it at the top (0)
        const heatZone = h * 0.85;
        const coolZone = h * 0.15;

        if (b.y > heatZone) {
          b.temp += 0.015 * dt;
        } else if (b.y < coolZone) {
          b.temp -= 0.01 * dt;
        }
        b.temp = Math.max(0, Math.min(1.2, b.temp));

        // 2. APPLY FORCES
        // Buoyancy force (rising/sinking)
        const buoyancy = (b.temp - 0.5) * config.heatPower;
        b.vy -= buoyancy * dt;

        // Sideways drift (Convection)
        b.vx += Math.sin(time * 0.001 + b.noiseX) * 0.05;

        // 3. INTER-BLOB INTERACTION (Anti-Clumping)
        for (let j = i + 1; j < blobs.length; j++) {
          const other = blobs[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const minD = (b.radius + other.radius) * config.spread;

          if (dist < minD) {
            // Surface tension attraction vs volumetric repulsion
            const force = (dist - minD) * 0.0005;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            b.vx += fx;
            b.vy += fy;
            other.vx -= fx;
            other.vy -= fy;
          }
        }

        // 4. INTEGRATION
        b.vx *= config.viscosity;
        b.vy *= config.viscosity;
        b.x += b.vx;
        b.y += b.vy;

        // 5. SOFT BOUNDARIES
        const pad = b.radius * 1.5;
        if (b.x < -pad) b.x = w + pad;
        if (b.x > w + pad) b.x = -pad;
        if (b.y < -pad) b.y = h + pad;
        if (b.y > h + pad) b.y = -pad;

        // 6. ORGANIC PULSING
        b.radius = b.baseRadius * (1 + Math.sin(time * 0.002 + b.noiseY) * 0.05);
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const blobs = blobsRef.current;

      blobs.forEach(b => {
        // Multi-stop radial gradient for the "Shadowy" look
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 1.4);
        
        const hVal = b.hue;
        const s = 100;
        
        // Shadow and Light stops
        grad.addColorStop(0, `hsla(${hVal + 10}, ${s}%, 70%, 0.9)`); // Glow core
        grad.addColorStop(0.3, `hsla(${hVal}, ${s}%, 45%, 0.7)`);    // Mid color
        grad.addColorStop(0.7, `hsla(${hVal - 20}, ${s}%, 20%, 0.4)`); // Shadow edge
        grad.addColorStop(1, `hsla(${hVal - 20}, ${s}%, 10%, 0)`);    // Fade out

        ctx.fillStyle = grad;
        ctx.beginPath();
        
        // Stretch based on vertical velocity (Gooey effect)
        const stretch = Math.min(Math.abs(b.vy) * 0.15, 0.4);
        ctx.ellipse(
          b.x, b.y, 
          b.radius * (1 - stretch), 
          b.radius * (1 + stretch), 
          Math.atan2(b.vy, b.vx), 
          0, Math.PI * 2
        );
        ctx.fill();
      });

      updatePhysics(time);
      requestRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      w = window.innerWidth * SIM_SCALE;
      h = window.innerHeight * SIM_SCALE;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    initBlobs();
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] bg-[#020617]">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="ultimate-lava-goo" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 22 -11"
              result="goo"
            />
            {/* Blends the sharp goo with the original soft glow cores */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: "url(#ultimate-lava-goo)",
          opacity: 0.5,
          mixBlendMode: "screen",
          transform: "scale(1.1)", // Hides edges
        }}
      />
    </div>
  );
};

export default ParticleBackground;
