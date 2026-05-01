import React, { useEffect, useRef, useState } from "react";

/**
 * ULTRA-STABLE CHAOTIC LAVA ENGINE (V7)
 * - Fixes the "Blank Screen" bug via React Hydration checks.
 * - Non-circular geometry: Every blob is a 16-point mutated polygon.
 * - Thermodynamic flow: Rising heat and sinking cold physics.
 * - Optimized for performance: Sub-scaled simulation buffer.
 */

const SETTINGS = {
  SIM_SCALE: 1,           // Higher performance (renders at 40% size)
  BLOB_COUNT: 12,          // Density
  BASE_HUE: 155,           // Emerald Green
  GOO_STRENGTH: 22,        // Matrix threshold
  VERTICES: 64,            // Points per blob (more = more gooey/chaotic)
  WOBBLE_STRENGTH: 0.40    // How much they deviate from circles
};

interface Vertex {
  x: number; y: number; baseX: number; baseY: number; offset: number;
}

interface LavaBlob {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number; baseR: number;
  temp: number;
  vertices: Vertex[];
  noiseSeed: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const blobsRef = useRef<LavaBlob[]>([]);

  // Prevent "Blank Screen" by waiting for client-side mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth * SETTINGS.SIM_SCALE;
    let h = window.innerHeight * SETTINGS.SIM_SCALE;

    const init = () => {
      w = window.innerWidth * SETTINGS.SIM_SCALE;
      h = window.innerHeight * SETTINGS.SIM_SCALE;
      canvas.width = w;
      canvas.height = h;

      const newBlobs: LavaBlob[] = [];
      for (let i = 0; i < SETTINGS.BLOB_COUNT; i++) {
        const baseR = (h * 0.1) + (Math.random() * h * 0.15);
        
        // Generate a ring of points instead of a circle
        const vertices: Vertex[] = [];
        for (let v = 0; v < SETTINGS.VERTICES; v++) {
          const angle = (v / SETTINGS.VERTICES) * Math.PI * 2;
          vertices.push({
            x: 0, y: 0,
            baseX: Math.cos(angle),
            baseY: Math.sin(angle),
            offset: Math.random() * 100
          });
        }

        newBlobs.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          baseR, r: baseR,
          temp: Math.random(),
          vertices,
          noiseSeed: Math.random() * 1000
        });
      }
      blobsRef.current = newBlobs;
    };

    const update = (time: number) => {
      blobsRef.current.forEach(b => {
        // 1. Thermodynamics
        if (b.y > h * 0.8) b.temp += 0.01;
        else if (b.y < h * 0.2) b.temp -= 0.008;
        b.temp = Math.max(0.1, Math.min(1.1, b.temp));

        // 2. Physics Forces
        b.vy -= (b.temp - 0.5) * 0.04; // Buoyancy
        b.vx += Math.sin(time * 0.001 + b.id) * 0.03; // Drift
        
        b.vx *= 0.97; b.vy *= 0.97;
        b.x += b.vx; b.y += b.vy;

        // 3. Screen Wrap
        const pad = b.r * 2;
        if (b.x < -pad) b.x = w + pad;
        if (b.x > w + pad) b.x = -pad;
        if (b.y < -pad) b.y = h + pad;
        if (b.y > h + pad) b.y = -pad;

        // 4. Geometry Deformation (The "Goo" Logic)
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const stretch = 1 + (speed * 0.15);
        const angle = Math.atan2(b.vy, b.vx);

        b.vertices.forEach((v, i) => {
          // Add organic wobble noise
          const wobble = 1 + Math.sin(time * 0.002 + v.offset) * SETTINGS.WOBBLE_STRENGTH;
          
          // Rotation & Velocity Stretching matrix
          let tx = v.baseX * b.r * wobble;
          let ty = v.baseY * b.r * wobble;

          // Stretch along velocity vector
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const rotatedX = (tx * cosA + ty * sinA) * stretch;
          const rotatedY = (ty * cosA - tx * sinA);

          v.x = b.x + (rotatedX * cosA - rotatedY * sinA);
          v.y = b.y + (rotatedY * cosA + rotatedX * sinA);
        });
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      
      blobsRef.current.forEach(b => {
        // Multi-stop Shadowy Gradient
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 1.5);
        grad.addColorStop(0, `hsla(${SETTINGS.BASE_HUE}, 100%, 60%, 0.8)`);
        grad.addColorStop(0.5, `hsla(${SETTINGS.BASE_HUE}, 100%, 30%, 0.6)`);
        grad.addColorStop(1, `hsla(${SETTINGS.BASE_HUE}, 100%, 10%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(b.vertices[0].x, b.vertices[0].y);
        for (let i = 1; i < b.vertices.length; i++) {
          ctx.lineTo(b.vertices[i].x, b.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
      });

      update(time);
      requestRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", init);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-black">
      {/* SVG filter defined inside the component to ensure it exists before the canvas tries to use it */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="lava-goo-stable" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={`1 0 0 0 0 
                     0 1 0 0 0 
                     0 0 1 0 0 
                     0 0 0 ${SETTINGS.GOO_STRENGTH} -11`}
          />
          <feComposite in="SourceGraphic" operator="atop" />
        </filter>
      </svg>

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: "url(#lava-goo-stable)",
          opacity: 0.5,
          mixBlendMode: "screen",
          transform: "scale(1.1)", // Crop edges
        }}
      />
    </div>
  );
};

export default ParticleBackground;
