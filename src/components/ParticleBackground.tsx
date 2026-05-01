import React, { useEffect, useRef, useMemo } from "react";

/**
 * ULTRA-HIGH-FIDELITY PROCEDURAL LAVA LAMP
 * * Technical Architecture:
 * 1. Metaball Geometry: Uses a custom SVG filter pipeline to handle surface tension.
 * 2. Multi-Pass Compositing: Separates base liquid, glow cores, and shadow maps.
 * 3. N-Body Interaction Physics: Real-time force calculation between all particles.
 * 4. Fluid Dynamics: Simulated viscosity, thermal buoyancy, and drag.
 * 5. Procedural Variance: Every session generates a unique "viscosity" profile.
 */

// --- TYPES & INTERFACES ---

interface PhysicsConfig {
  gravity: number;
  viscosity: number;
  attraction: number;
  repulsion: number;
  thermalShift: number;
}

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  mass: number;
  color: string;
  glowColor: string;
  phase: number;
  temperature: number;
  tempDir: number;
  noiseSeed: number;
  isDroplet: boolean;
}

// --- CONSTANTS ---

const BASE_HUE = 155; // Your site's emerald/green
const GLOW_OFFSET = 15; // Shift for the inner "hot" glow
const MAX_BLOBS = 22;

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Procedurally generate the "vibe" for this specific user session
  const sessionConfig = useMemo<PhysicsConfig>(() => ({
    gravity: 0.03 + Math.random() * 0.04,
    viscosity: 0.94 + Math.random() * 0.03,
    attraction: 0.0007 + Math.random() * 0.0005,
    repulsion: 0.8,
    thermalShift: 0.01 + Math.random() * 0.01
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Use a slight downscale for the internal buffer to make the SVG filter cheaper
    const dpr = window.devicePixelRatio || 1;
    const renderScale = 0.85; 

    let width = 0;
    let height = 0;

    // --- INITIALIZATION ---

    const createBlob = (id: number, isInitial = false): Blob => {
      const isDroplet = Math.random() > 0.7;
      const baseSize = Math.min(window.innerWidth, window.innerHeight);
      const radius = isDroplet 
        ? (0.03 + Math.random() * 0.04) * baseSize 
        : (0.08 + Math.random() * 0.12) * baseSize;

      return {
        id,
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + radius,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: radius,
        targetRadius: radius,
        mass: Math.pow(radius, 2),
        color: `hsla(${BASE_HUE}, 100%, 40%, 0.9)`,
        glowColor: `hsla(${BASE_HUE + GLOW_OFFSET}, 100%, 65%, 1)`,
        phase: Math.random() * Math.PI * 2,
        temperature: Math.random(),
        tempDir: Math.random() > 0.5 ? 1 : -1,
        noiseSeed: Math.random() * 1000,
        isDroplet
      };
    };

    const init = () => {
      width = window.innerWidth * renderScale;
      height = window.innerHeight * renderScale;
      canvas.width = width;
      canvas.height = height;
      
      const count = window.innerWidth < 768 ? 10 : MAX_BLOBS;
      const initialBlobs: Blob[] = [];
      for (let i = 0; i < count; i++) {
        initialBlobs.push(createBlob(i, true));
      }
      blobsRef.current = initialBlobs;
    };

    // --- PHYSICS ENGINE ---

    const updatePhysics = (time: number) => {
      const blobs = blobsRef.current;
      const { x: mx, y: my, active: mActive } = mouseRef.current;
      const scaledMx = mx * renderScale;
      const scaledMy = my * renderScale;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // 1. Thermal Buoyancy (Vertical movement)
        b.temperature += b.tempDir * sessionConfig.thermalShift;
        if (b.temperature > 1 || b.temperature < 0) b.tempDir *= -1;
        
        const lift = (b.temperature - 0.5) * sessionConfig.gravity;
        b.vy -= lift;

        // 2. Horizontal "Drift" (Simulating convection currents)
        const drift = Math.sin(time * 0.001 + b.phase) * 0.15;
        b.vx += drift;

        // 3. N-Body Attraction (The "Goo" Logic)
        for (let j = i + 1; j < blobs.length; j++) {
          const other = blobs[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const minSafeDist = (b.radius + other.radius) * sessionConfig.repulsion;

          // Surface Tension / Attraction
          if (dist < (b.radius + other.radius) * 2.5) {
            const force = (dist - minSafeDist) * sessionConfig.attraction;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            const totalMass = b.mass + other.mass;
            b.vx += fx * (other.mass / totalMass);
            b.vy += fy * (other.mass / totalMass);
            other.vx -= fx * (b.mass / totalMass);
            other.vy -= fy * (b.mass / totalMass);
          }
        }

        // 4. Cursor Influence
        if (mActive) {
          const mdx = b.x - scaledMx;
          const mdy = b.y - scaledMy;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const mThreshold = 250 * renderScale;

          if (mDist < mThreshold) {
            const mPush = (1 - mDist / mThreshold) * 0.4;
            b.vx += (mdx / mDist) * mPush;
            b.vy += (mdy / mDist) * mPush;
          }
        }

        // 5. Viscosity & Integration
        b.vx *= sessionConfig.viscosity;
        b.vy *= sessionConfig.viscosity;
        b.x += b.vx;
        b.y += b.vy;

        // 6. Boundary Logic (Elastic walls)
        const pad = b.radius;
        if (b.x < -pad) b.x = width + pad;
        if (b.x > width + pad) b.x = -pad;
        if (b.y < -pad) {
            b.y = -pad;
            b.vy *= -0.5;
            b.tempDir = 1; // Start heating up
        }
        if (b.y > height + pad) {
            b.y = height + pad;
            b.vy *= -0.5;
            b.tempDir = -1; // Start cooling down
        }

        // 7. Organic Pulsing
        b.radius = b.targetRadius * (1 + Math.sin(time * 0.002 + b.noiseSeed) * 0.08);
      }
    };

    // --- RENDERING PASSES ---

    const draw = (time: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const blobs = blobsRef.current;

      // PASS 1: The Liquid Core (Solid silhouettes for the SVG Goo filter)
      ctx.save();
      ctx.fillStyle = `hsl(${BASE_HUE}, 100%, 35%)`;
      
      for (const b of blobs) {
        ctx.beginPath();
        // Morph the shape based on velocity for a gooey stretch
        const angle = Math.atan2(b.vy, b.vx);
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const stretch = Math.min(speed * 0.15, 0.4);
        
        ctx.ellipse(
          b.x, b.y, 
          b.radius * (1 + stretch), 
          b.radius * (1 - stretch * 0.5), 
          angle, 0, Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      // PASS 2: Internal Highlights (Subsurface Scattering simulation)
      // This adds depth by drawing a lighter, smaller shape inside each glob
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      for (const b of blobs) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `hsla(${BASE_HUE + 10}, 100%, 70%, 0.6)`);
        grad.addColorStop(0.6, `hsla(${BASE_HUE}, 100%, 45%, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      requestRef.current = requestAnimationFrame((t) => {
        updatePhysics(t);
        draw(t);
      });
    };

    // --- EVENT LISTENERS ---

    const handleResize = () => {
      init();
    };

    const handlePointer = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("pointerleave", handlePointerLeave);

    init();
    draw(0);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [sessionConfig]);

  return (
    <>
      {/* ADVANCED FILTER PIPELINE 
          This is what makes the circles "gooey".
          - Gaussian Blur: Blurs the shapes together.
          - Color Matrix: Re-sharpens the edges based on alpha density.
          - Drop Shadow: Adds the depth onto the site's background image.
      */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="lava-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 45 -18"
              result="goo"
            />
            {/* Creates the 3D depth effect */}
            <feDropShadow dx="0" dy="15" stdDeviation="15" floodOpacity="0.5" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          filter: "url(#lava-goo)",
          opacity: 0.45,
          zIndex: 0,
          mixBlendMode: "plus-lighter" // Ensures it glows against your dark hero image
        }}
      />
    </>
  );
};

export default ParticleBackground;
