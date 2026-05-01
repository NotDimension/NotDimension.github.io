import { useEffect, useRef, useMemo } from "react";

/**
 * HIGH-FIDELITY, PROGRESIVE-GLOW, PERFORMANCE-OPTIMIZED LAVA LAMP
 * * Core Architectural Fixes:
 * 1. Substance Shader: Instead of blurring solid circles, we use advanced multi-stop radial 
 * gradients with a distinct "hot-spot" center and a "cool shadow" edge. This provides 
 * the visual depth and the "pretty" shadowy effect you want.
 * 2. Optimized Metaball Filter: We use a hidden SVG Alpha Threshold filter (the standard "goo" technique).
 * This ensures that when blobs overlap, they merge seamlessly instead of just clumping, 
 * creating a true, continuous fluid look.
 * 3. Offscreen Buffer Performance: The heavy physics and rendering calculations happen on a 
 * smaller internal canvas. This is then smoothly upscaled using GPU hardware acceleration, 
 * ensuring buttery-smooth performance even on lower-end devices.
 * 4. Repulsion Physics: A constant n-body distance-checking loop ensures that if too many blobs merge 
 * into one big "ball," a localized repulsion force is triggered to break them apart, keeping 
 * the movement varied and organic.
 */

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  mass: number;
  phaseX: number;
  phaseY: number;
  viscosity: number;
  wanderSpeed: number;
  isDroplet: boolean;
  baseHue: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  // World physics constants (unique per session)
  const worldRef = useRef({
    viscosity: 0.94 + Math.random() * 0.03, // 0.94 - 0.97
    friction: 0.96 + Math.random() * 0.02,  // 0.96 - 0.98
    wobbleFactor: 0.5 + Math.random() * 0.5,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // PERFORMANCE OPTIMIZATION: We render at a fraction of screen resolution.
    // The "soft" nature of lava blobs means the browser's hardware upscaling
    // handles it perfectly, looking great while using a fraction of the CPU/GPU power.
    const SCALE = 0.35; 
    let w = 0;
    let h = 0;

    // Use a unique ID for color mapping
    let blobIdCounter = 0;

    const initBlobs = (count: number) => {
      const newBlobs: Blob[] = [];
      const minBase = Math.min(window.innerWidth, window.innerHeight);
      
      for (let i = 0; i < count; i++) {
        // We create a mix of large main blobs and tiny "droplets"
        const isDroplet = Math.random() > 0.75;
        
        // Use a slight variations in hue for a shadowy, non-solid look (based on site theme)
        const baseHue = 150 + Math.random() * 15;
        
        // Base sizes are scaled based on the larger offscreen buffer
        const baseR = isDroplet 
          ? (0.05 + Math.random() * 0.03) * minBase * 1.5
          : (0.10 + Math.random() * 0.15) * minBase * 1.5;

        newBlobs.push({
          id: blobIdCounter++,
          // Ensure they start across the whole screen horizontally
          x: (Math.random() * 1.4 - 0.2) * w, 
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          r: baseR,
          baseR: baseR,
          mass: baseR * baseR,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          viscosity: 0.93 + Math.random() * 0.05,
          wanderSpeed: (isDroplet ? 1.0 : 0.4) + Math.random(),
          isDroplet,
          baseHue: baseHue
        });
      }
      return newBlobs;
    };

    const blobsRef = useRef<Blob[]>([]);

    const resize = () => {
      w = Math.max(1, Math.floor(window.innerWidth * SCALE));
      h = Math.max(1, Math.floor(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const count = window.innerWidth < 768 ? 9 : 18;
      if (blobsRef.current.length === 0) {
        blobsRef.current = initBlobs(count);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // --- MAIN DRAWING ROUTINE (Shadowy, Procedural Glow) ---
    const drawBlobShader = (ctx: CanvasRenderingContext2D, b: Blob, time: number) => {
      // 1. Calculate the core glow (HotSpot)
      // This part is bright and slightly shifted toward lime
      const coreHue = b.baseHue + 15;
      const coreSat = 100;
      const coreLight = 60 + Math.sin(time * 0.5 + b.id) * 5;
      const coreColor = `hsla(${coreHue}, ${coreSat}%, ${coreLight}%, 0.8)`;

      // 2. Calculate the main substance (Emerald/Dark Green)
      const subHue = b.baseHue;
      const subSat = 100;
      const subLight = 35 + Math.sin(time * 0.3 + b.id) * 3;
      const subColor = `hsla(${subHue}, ${subSat}%, ${subLight}%, 0.55)`;

      // 3. Calculate the edge shadow (Deep Dark Green/Transparent)
      const shadowHue = b.baseHue - 10;
      const shadowSat = 100;
      const shadowLight = 15;
      const shadowColor = `hsla(${shadowHue}, ${shadowSat}%, ${shadowLight}%, 0.0)`;

      // Draw complex, deep radial gradient (No perfect solid circles!)
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 1.5);
      
      // Multi-stop gradient creates the visual 'goo' depth and shadows
      grad.addColorStop(0, coreColor); // The 'hot' core
      grad.addColorStop(0.35, subColor); // The main emerald substance
      grad.addColorStop(0.85, subColor); // Extending the shadowy mass
      grad.addColorStop(1, shadowColor); // Melting into the transparent edge shadow

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time: number) => {
      const timeSec = time * 0.001;
      
      // Clear with full transparency so the SVG Alpha-Threshold works cleanly
      ctx.clearRect(0, 0, w, h);
      
      const blobs = blobsRef.current;
      const world = worldRef.current;

      // PHYSICS CYCLE
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        
        // 1. Organic Drift & Brownian Noise
        b.vx += Math.sin(timeSec * b.wanderSpeed + b.phaseX) * 0.04 * world.wobbleFactor;
        b.vy += Math.cos(timeSec * (b.wanderSpeed * 0.8) + b.phaseY) * 0.04 * world.wobbleFactor;
        
        // 2. Buoyancy/Viscosity (simulating liquid density)
        b.vy += (0.01 + Math.sin(b.phaseX + b.id) * 0.01);

        // Cap speed
        const speedSq = b.vx * b.vx + b.vy * b.vy;
        const maxSpeedSq = 1.0;
        if (speedSq > maxSpeedSq) {
          const speed = Math.sqrt(speedSq);
          b.vx = (b.vx / speed) * maxSpeedSq;
          b.vy = (b.vy / speed) * maxSpeedSq;
        }

        // Apply Forces
        b.vx *= b.viscosity;
        b.vy *= b.viscosity;
        b.x += b.vx;
        b.y += b.vy;

        // Soft Wall Boundaries (Elastic)
        const margin = b.r;
        if (b.y < -margin * 0.5) { b.y = h + margin; b.vy *= -1.0; b.vx *= 1.2;}
        if (b.y > h + margin * 0.5) { b.y = -margin; b.vy *= -1.0; b.vx *= 1.2;}
        if (b.x < -margin) { b.x = w + margin; b.vx *= 0.9; }
        if (b.x > w + margin) { b.x = -margin; b.vx *= 0.9; }

        // Pulse radius for 'breathing' effect
        b.r = b.baseR * (1 + Math.sin(timeSec * 2 + b.phaseY) * 0.08);
      }

      // 2. n-Body Collision Check (ANTI-CLUMPING LOGIC)
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const combinedRadius = a.r + b.r;
          
          // Collision Detection based on combined radii
          if (dist < combinedRadius * 1.5) {
            // Push apart to prevent clumping into one big ball
            const pushMag = (combinedRadius * 1.5 - dist) * 0.0006;
            const fx = (dx / dist) * pushMag;
            const fy = (dy / dist) * pushMag;
            
            // Share momentum inversely proportional to area (mass)
            a.vx += fx * (b.mass / (a.mass + b.mass));
            a.vy += fy * (b.mass / (a.mass + b.mass));
            b.vx -= fx * (a.mass / (a.mass + b.mass));
            b.vy -= fy * (a.mass / (a.mass + b.mass));
          }
        }
      }

      // RENDERING CYCLE
      for (let i = 0; i < blobs.length; i++) {
        drawBlobShader(ctx, blobs[i], timeSec);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* THE SECRET SAUCE: The SVG Goo Filter.
          This blurs the fuzzy particles together, and the feColorMatrix aggressively 
          crunches the Alpha Channel threshold, physically merging the liquid 
          substance while allowing the glow cores to stay clear.
      */}
      <svg style={{ position: "fixed", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="lava-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 18 -9"
              result="goo"
            />
            {/* Creates true depth by layering the morphed gooey mass 
                onto itself with blending mode.
            */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          // Apply the SVG goo/threshold filter pipeline
          filter: "url(#lava-goo)", 
          
          // The buffer is upscaled on the GPU
          width: '100vw',
          height: '100vh',
          imageRendering: 'auto', // Clean scaling
          
          opacity: 0.6, // Transparent background effect
          zIndex: -1,   // Behind main content
          mixBlendMode: 'screen', // Makes the green pop against dark backgrounds
        }}
      />
    </>
  );
};

export default ParticleBackground;
