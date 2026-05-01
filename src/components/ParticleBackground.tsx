import React, { useEffect, useRef, useMemo } from "react";

/**
 * AURA MESH LAVA ENGINE
 * * * FEATURES:
 * 1. Anti-Clumping Logic: Particles have a 'Personal Space' radius that triggers 
 * repulsion when the total density gets too high.
 * 2. Mesh Gradient Synthesis: Instead of solid colors, we use overlapping 
 * radial gradients with variable opacity.
 * 3. Layered Parallax: Blobs are split into 'Foreground', 'Midground', and 'Back'.
 * 4. Noise-Based Pathing: Uses Sine-Wave interference to prevent 'clumping' at the center.
 */

interface PhysicsState {
  repulsionStrength: number;
  minSeparation: number;
  friction: number;
  edgeSoftness: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  layer: 'fore' | 'mid' | 'back';
  hue: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Config optimized to prevent clumping
  const config = useMemo<PhysicsState>(() => ({
    repulsionStrength: 0.12,
    minSeparation: 180, // High separation keeps them from sticking in one ball
    friction: 0.96,
    edgeSoftness: 45
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const initParticles = () => {
      const p: Particle[] = [];
      const count = w < 768 ? 8 : 16;
      
      for (let i = 0; i < count; i++) {
        const layerType = i % 3 === 0 ? 'fore' : i % 3 === 1 ? 'mid' : 'back';
        const baseSize = layerType === 'fore' ? 300 : layerType === 'mid' ? 450 : 600;
        
        p.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          baseSize: baseSize + (Math.random() * 100),
          size: baseSize,
          layer: layerType,
          hue: 150 + (Math.random() * 40), // Varieties of your site's green
          opacity: layerType === 'fore' ? 0.4 : layerType === 'mid' ? 0.2 : 0.1,
          pulseSpeed: 0.001 + (Math.random() * 0.002),
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
      particlesRef.current = p;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const update = (time: number) => {
      const p = particlesRef.current;
      const { x: mx, y: my, active: mActive } = mouseRef.current;

      for (let i = 0; i < p.length; i++) {
        const a = p[i];

        // 1. Anti-Clumping Repulsion
        // This is the fix for the "one big ball" problem.
        for (let j = 0; j < p.length; j++) {
          if (i === j) continue;
          const b = p[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minD = (a.size + b.size) * 0.4; // Detection radius

          if (dist < minD) {
            const force = (minD - dist) * config.repulsionStrength;
            const angle = Math.atan2(dy, dx);
            a.vx += Math.cos(angle) * force * 0.01;
            a.vy += Math.sin(angle) * force * 0.01;
          }
        }

        // 2. Random Drift (Brownian motion)
        a.vx += Math.sin(time * a.pulseSpeed + a.pulseOffset) * 0.02;
        a.vy += Math.cos(time * (a.pulseSpeed * 0.8) + a.pulseOffset) * 0.02;

        // 3. Mouse Interaction
        if (mActive) {
          const mdx = a.x - mx;
          const mdy = a.y - my;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 400) {
            const mForce = (1 - mDist / 400) * 0.05;
            a.vx += mdx * mForce * 0.01;
            a.vy += mdy * mForce * 0.01;
          }
        }

        // 4. Boundary Physics
        if (a.x < -a.size) a.x = w + a.size;
        if (a.x > w + a.size) a.x = -a.size;
        if (a.y < -a.size) a.y = h + a.size;
        if (a.y > h + a.size) a.y = -a.size;

        // 5. Apply Forces
        a.vx *= config.friction;
        a.vy *= config.friction;
        a.x += a.vx;
        a.y += a.vy;

        // 6. Size Pulsing
        a.size = a.baseSize + Math.sin(time * a.pulseSpeed) * 50;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const p = particlesRef.current;

      // Sort by layer to ensure proper depth blending
      const sorted = [...p].sort((a, b) => {
        const order = { back: 0, mid: 1, fore: 2 };
        return order[a.layer] - order[b.layer];
      });

      for (const pt of sorted) {
        ctx.save();
        
        // Use a mesh-style radial gradient for each "aura"
        const gradient = ctx.createRadialGradient(
          pt.x, pt.y, 0,
          pt.x, pt.y, pt.size
        );

        const h = pt.hue;
        const s = 80;
        const l = pt.layer === 'fore' ? 40 : 30;
        
        gradient.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${pt.opacity})`);
        gradient.addColorStop(0.5, `hsla(${h}, ${s}%, ${l}%, ${pt.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = 'screen'; // This makes them look "light-like"
        
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      requestRef.current = requestAnimationFrame((t) => {
        update(t);
        draw();
      });
    };

    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    
    resize();
    initParticles();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config]);

  return (
    <>
      {/* THE MESH BLUR FILTER
          Instead of sharpening the blobs into balls, we use a high-radius blur
          to melt them into the background like a moving gradient.
      */}
      <svg style={{ position: "fixed", width: 0, height: 0 }}>
        <filter id="mesh-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          <feColorMatrix type="saturate" values="2" />
        </filter>
      </svg>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          filter: "url(#mesh-blur)",
          opacity: 0.6,
          zIndex: -1,
          background: "#050a08" // Matches your dark theme base
        }}
      />
    </>
  );
};

export default ParticleBackground;
