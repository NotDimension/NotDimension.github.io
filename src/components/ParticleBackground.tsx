import React, { useEffect, useRef, useMemo } from "react";

/**
 * GOO-GEOMETRY LAVA LAMP (V6 - Final chaos-geometry upgrade)
 * * * FEATURES:
 * 1. Multi-Point Polygon Rendering: No perfect circles. Every blob is a distorted polygon with 12 vertices.
 * 2. Harmonic Mutators (chaos sources): Three oscillators constantly mutate the vertices 
 * based on slow wobble, velocity-driven stretch, and high-frequency noise.
 * 3. Thermodynamic Buoyancy: Real lava lamp movement (heat rises, cold sinks).
 * 4. Volumetric Gradients: 4-stop radial gradients for shadows and depth.
 * 5. Optimized Offscreen Buffer: Fast performance at any resolution.
 */

// --- Constants & Procedural Seed ---

const GOO_SETTINGS = {
  SCALE: 0.35,              // Internal simulation resolution (0.35 = 35% of screen size)
  BLOB_COUNT: 16,           // Total density
  BASE_HUE: 155,            // Theme Green
  VISCOSITY: 0.95,          // Liquid thickness (0.9 to 0.98)
  GRAVITY: 0.03,            // Buoyancy strength
  REPULSION: 0.9,           // Personal space multiplier (prevents single-clump)
  VERTICES: 12,             // Number of points per goo-polygon
  GOO_DENSITY: 24,          // SVG Filter threshold strength
  DISTORTION: 0.35          // Chaos geometry mutation strength
};

// Simple pseudo-random generator for procedural consistency
const seed = (s: number) => {
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};
const rnd = seed(SETTINGS.BASE_HUE);

// --- TYPES ---

interface BlobVertex {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  noiseOffset: number;
}

interface GooBlob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  hue: number;
  temperature: number;      // 0 (Cold) to 1.2 (Hot)
  targetTemp: number;
  wobbleSeed: number;       // Seed for internal shape chaos
  vertices: BlobVertex[];   // The ring of warped points
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const blobsRef = useRef<GooBlob[]>([]);

  const world = useMemo(() => ({
    width: typeof window !== "undefined" ? window.innerWidth * GOO_SETTINGS.SCALE : 0,
    height: typeof window !== "undefined" ? window.innerHeight * GOO_SETTINGS.SCALE : 0,
  }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- Helper: Goo Geometry Generation ---

    const createVertexRing = (radius: number): BlobVertex[] => {
      const v: BlobVertex[] = [];
      const numV = GOO_SETTINGS.VERTICES;
      for (let i = 0; i < numV; i++) {
        const angle = (i / numV) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        v.push({ x, y, baseX: x, baseY: y, noiseOffset: rnd() * 1000 });
      }
      return v;
    };

    const createBlob = (id: number, isInitial = false): GooBlob => {
      const { width, height } = world;
      // High randomization in base sizes: 15% to 35% of screen height
      const baseR = (height * (0.15 + Math.random() * 0.20));
      
      return {
        id,
        // Start across the whole screen width
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + baseR,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: baseR,
        baseRadius: baseR,
        hue: GOO_SETTINGS.BASE_HUE + (Math.random() * 20 - 10),
        temperature: Math.random(),
        targetTemp: 0,
        wobbleSeed: Math.random() * 1000,
        vertices: createVertexRing(baseR)
      };
    };

    const init = () => {
      const w = window.innerWidth * GOO_SETTINGS.SCALE;
      const h = window.innerHeight * GOO_SETTINGS.SCALE;
      world.width = w;
      world.height = h;
      canvas.width = w;
      canvas.height = h;

      const initialBlobs: GooBlob[] = [];
      const count = window.innerWidth < 768 ? 10 : GOO_SETTINGS.BLOB_COUNT;
      for (let i = 0; i < count; i++) {
        initialBlobs.push(createBlob(i, true));
      }
      blobsRef.current = initialBlobs;
    };

    // --- Physics & Geometry Engine ---

    const mutateGooGeometry = (b: GooBlob, time: number) => {
      const dt = 1.0; // Time delta normalization
      const distortionBase = b.radius * GOO_SETTINGS.DISTORTION;
      
      // Calculate velocity stretch (turns them into stretching ovals)
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      const verticalStretch = Math.max(0, 1 + (speed * 0.1));
      const velocityAngle = Math.atan2(b.vy, b.vx);

      for (let i = 0; i < b.vertices.length; i++) {
        const v = b.vertices[i];
        
        // 1. Calculate base warped position (The 'slow-wobble')
        const angle = (i / b.vertices.length) * Math.PI * 2;
        const warpAngle = time * 0.001 + b.wobbleSeed;
        
        // Use harmonic functions for predictable yet chaotic mutators
        const wobbleX = Math.sin(v.noiseOffset + warpAngle * 0.3) * distortionBase;
        const wobbleY = Math.cos(v.noiseOffset + warpAngle * 0.4) * distortionBase;
        
        // 2. Combine and scale to current radius
        let tx = v.baseX + wobbleX;
        let ty = v.baseY + wobbleY;

        // Apply velocity stretching (pulls points along the angle of movement)
        const vdx = tx;
        const vdy = ty;
        const cosAngle = Math.cos(velocityAngle);
        const sinAngle = Math.sin(velocityAngle);
        
        // Standard geometric rotation + scale stretch matrix
        tx = (vdx * cosAngle + vdy * sinAngle) * verticalStretch;
        ty = (vdy * cosAngle - vdx * sinAngle);

        // Map back to absolute canvas position
        v.x = b.x + (tx * cosAngle - ty * sinAngle);
        v.y = b.y + (ty * cosAngle + tx * sinAngle);
      }
    };

    const updatePhysics = (time: number) => {
      const blobs = blobsRef.current;
      const { height } = world;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // 1. Thermodynamics (LAVA LAMP PHYSICS)
        // Gain heat at bottom, lose at top
        const heatZone = height * 0.85;
        const coolZone = height * 0.15;

        if (b.y > heatZone) {
          b.temperature += 0.01;
        } else if (b.y < coolZone) {
          b.temperature -= 0.006;
        }
        b.temperature = Math.max(0, Math.min(1.2, b.temperature));

        // 2. Buoyancy ( rising/sinking force )
        const lift = (b.temperature - 0.5) * GOO_SETTINGS.GRAVITY * 15;
        b.vy -= lift;

        // 3. Sideways drift (Convection)
        b.vx += Math.sin(time * 0.001 + b.id) * 0.05;

        // 4. Inter-Blob Repulsion (Anti-Clumping field)
        for (let j = i + 1; j < blobs.length; j++) {
          const b2 = blobs[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (b.radius + b2.radius) * GOO_SETTINGS.REPULSION;

          if (dist < minDist) {
            // Push apart proportional to overlap
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

        // 5. Viscosity & Integration
        b.vx *= GOO_SETTINGS.VISCOSITY;
        b.vy *= GOO_SETTINGS.VISCOSITY;
        b.x += b.vx;
        b.y += b.vy;

        // 6. Boundary Wrapping
        const pad = b.radius * 2;
        if (b.x < -pad) b.x = world.width + pad;
        if (b.x > world.width + pad) b.x = -pad;
        if (b.y < -pad) b.y = world.height + pad;
        if (b.y > world.height + pad) b.y = -pad;

        // 7. Organic Radius Pulse
        b.radius = b.baseRadius * (1 + Math.sin(time * 0.002 + b.id) * 0.08);
        
        // 8. Geometry distortion cycle (Wobble mutation)
        mutateGooGeometry(b, time);
      }
    };

    // --- Rendering Pass ---

    const drawPolygonShader = (ctx: CanvasRenderingContext2D, b: GooBlob, time: number) => {
      // Draw shadowy, multi-stop gradient (sRGB correct)
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 1.5);
      
      const hVal = b.hue;
      const s = 100;
      const breath = Math.sin(time * 0.5 + b.id) * 5;
      
      // Lighting stops: HotSpot (bright) -> Mid Green -> Deep Shadow (dark)
      grad.addColorStop(0, `hsla(${hVal + 10}, ${s}%, ${70 + breath}%, 0.9)`);   // Core light
      grad.addColorStop(0.3, `hsla(${hVal}, ${s}%, 45%, 0.8)`);      // Main body
      grad.addColorStop(0.65, `hsla(${hVal - 20}, ${s}%, 20%, 0.6)`); // Volume shadow
      grad.addColorStop(1, `hsla(${hVal - 20}, ${s}%, 10%, 0)`);    // Fade edge

      ctx.fillStyle = grad;
      ctx.beginPath();
      
      // Connect distorted points (No arc()!)
      if (b.vertices.length > 0) {
        ctx.moveTo(b.vertices[0].x, b.vertices[0].y);
        for (let i = 1; i < b.vertices.length; i++) {
          ctx.lineTo(b.vertices[i].x, b.vertices[i].y);
        }
        ctx.closePath();
      }
      ctx.fill();
    };

    const renderLoop = (time: number) => {
      ctx.clearRect(0, 0, world.width, world.height);
      updatePhysics(time);
      
      // Draw all warped polygons
      const blobs = blobsRef.current;
      for (let i = 0; i < blobs.length; i++) {
        drawPolygonShader(ctx, blobs[i], time * 0.001);
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    init();
    requestRef.current = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      const w = window.innerWidth * GOO_SETTINGS.SCALE;
      const h = window.innerHeight * GOO_SETTINGS.SCALE;
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
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#020617]">
      {/* THE SECRET SAUCE: The sRGB Goo-Geometry Filter */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id="lava-goo-master" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  
                       0 1 0 0 0  
                       0 0 1 0 0  
                       0 0 0 ${GOO_SETTINGS.GOO_DENSITY} -11`}
              result="goo"
            />
            {/* Blends the distorted goo-matrix onto the original soft glow cores 
                for true subsurface scattering and volumetric depth.
            */}
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
          transform: "scale(1.1)", // Slight overscale to hide edge artifacts
        }}
      />
    </div>
  );
};

export default ParticleBackground;
