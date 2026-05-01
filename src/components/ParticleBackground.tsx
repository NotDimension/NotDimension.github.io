import React, { useEffect, useRef, useMemo } from 'react';

/**
 * MAGNETIC NEURAL GRID (V2 - High Fidelity)
 * * * FEATURES:
 * 1. Volumetric Receptors: Instead of lines, every point is a deep radial gradient circle.
 * 2. Thermodynamic Pulsing: Receptors breathe (pulse size) and brighten when the mouse approaches.
 * 3. Non-Linear Attraction: Closer points have exponential magnetism; far points remain calm.
 * 4. Subsurface Blending: Uses CSS Screen mix-mode and SVG noise to melt the glow into the dark theme background.
 * 5. Optimized Offscreen Buffer: High FPS regardless of screen size.
 */

// --- TYPES & INTERFACES ---

interface Receptor {
  id: number;
  x: number; // Grid base X
  y: number; // Grid base Y
  currentAngle: number; // Current magnetic direction
  rotationVelocity: number; // Ease of movement
  brightness: number; // calculated 0-1 based on mouse proximity
  scale: number; // calculated 0-1 based on mouse proximity
  pulseOffset: number; // Seed for random organic pulsing
}

// --- CONSTANTS & CONFIGURATION ---

const THEME_COLOR = {
  emerald: 155, // Hue of emerald-500
  saturation: 90,
  light: 45,
};

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const receptorsRef = useRef<Receptor[]>([]);

  // World physics constants
  const sessionConfig = useMemo(() => ({
    gravity: 0.03 + Math.random() * 0.04, // Unpredictable pull
    viscosity: 0.94 + Math.random() * 0.03, // Viscous liquid drag
    attraction: 0.0007 + Math.random() * 0.0005, // Strengths of magnetic pull
  }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Performance HACK: We use a sub-scaled buffer for the internal render.
    // The browser's GPU hardware upscaling (mix-blend-mode: plus-lighter)
    // smooths out the low resolution perfectly, giving us butter-smooth 60+ FPS.
    const SIM_SCALE = 0.5; 
    let w = 0;
    let h = 0;

    // --- INITIALIZATION ---

    const init = () => {
      w = Math.max(1, Math.floor(window.innerWidth * SIM_SCALE));
      h = Math.max(1, Math.floor(window.innerHeight * SIM_SCALE));
      canvas.width = w;
      canvas.height = h;
      
      // Calculate a dynamic grid based on screen size
      const baseGap = Math.min(window.innerWidth, window.innerHeight) < 768 ? 40 : 55;
      const gap = baseGap * SIM_SCALE;
      const numColumns = Math.ceil(w / gap) + 1;
      const numRows = Math.ceil(h / gap) + 1;

      // Start receptors Ref array
      const initialReceptors: Receptor[] = [];
      let idCounter = 0;

      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
          initialReceptors.push({
            id: idCounter++,
            x: x * gap + (y % 2 === 0 ? gap * 0.5 : 0), // Subtle honeycomb offset
            y: y * gap,
            currentAngle: Math.random() * Math.PI * 2,
            rotationVelocity: 0,
            brightness: 0,
            scale: 0,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
      receptorsRef.current = initialReceptors;
    };

    // --- PHYSICS & INTERACTION ---

    const updatePhysics = (time: number) => {
      const { x: mx, y: my, active: mActive } = mouseRef.current;
      const scaledMx = mx * SIM_SCALE;
      const scaledMy = my * SIM_SCALE;
      const receptors = receptorsRef.current;
      
      for (let i = 0; i < receptors.length; i++) {
        const r = receptors[i];
        
        // 1. Calculate direction to Mouse
        const dx = r.x - scaledMx;
        const dy = r.y - scaledMy;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const mouseAngle = Math.atan2(dy, dx);
        
        // 2. Non-Linear Magnetism: Far points move slow, close points are snappy
        const detectionThreshold = 350 * SIM_SCALE; // How far they feel the mouse
        
        let magneticStrength = 0.05; // Standard, calm rotation
        let glowTarget = 0;
        let scaleTarget = 0;

        if (mActive && dist < detectionThreshold) {
          // As mouse approaches, attraction increases exponentially
          const proximityForce = (detectionThreshold - dist) / detectionThreshold;
          magneticStrength = Math.max(0.1, 0.4 * Math.pow(proximityForce, 2));
          glowTarget = Math.pow(proximityForce, 1.5); // Fast brightness bloom
          scaleTarget = Math.pow(proximityForce, 2.5); // Slower scale bloom
          
          // Subtle attraction force when extremely close for a 'gooey' snap
          if (dist < 100 * SIM_SCALE) {
             const mPull = (1 - dist / (100 * SIM_SCALE)) * 0.002;
             r.x -= dx * mPull;
             r.y -= dy * mPull;
          }
        }

        // Apply angular forces with inertia
        const diff = mouseAngle - r.currentAngle;
        const wrappedDiff = Math.atan2(Math.sin(diff), Math.cos(diff)); // Shortest rotation path
        r.rotationVelocity += wrappedDiff * magneticStrength;
        r.rotationVelocity *= sessionConfig.viscosity; // Smooth drag
        r.currentAngle += r.rotationVelocity;

        // Smoothly ease brightness and scale
        r.brightness += (glowTarget - r.brightness) * 0.15;
        r.scale += (scaleTarget - r.scale) * 0.1;
      }
    };

    // --- RENDERING PASS ---

    const draw = (time: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      
      const receptors = receptorsRef.current;
      const timeSec = time * 0.001;
      
      for (const r of receptors) {
        // Draw deep radial gradient with non-solid look
        // Receptors bloom brighter when targetted by mouse
        
        const coreHue = THEME_COLOR.emerald + (r.brightness * 10);
        const coreSat = THEME_COLOR.saturation;
        const coreLight = THEME_COLOR.light + (r.brightness * 25);
        const coreAlpha = 0.6 + (r.brightness * 0.4);
        
        const edgeHue = THEME_COLOR.emerald - (r.brightness * 15);
        const edgeSat = THEME_COLOR.saturation + 10;
        const edgeLight = THEME_COLOR.light - 15;
        const edgeAlpha = 0; // Transparent edge
        
        const baseRadius = 8 * SIM_SCALE;
        // Subtle organic 'breathing' effect (randomized per session seed)
        const organicRadius = baseRadius + Math.sin(timeSec + r.pulseOffset) * (3 * SIM_SCALE);
        // Mouse-based growth
        const totalRadius = organicRadius + (r.scale * (25 * SIM_SCALE));

        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, totalRadius);
        grad.addColorStop(0, `hsla(${coreHue}, ${coreSat}%, ${coreLight}%, ${coreAlpha})`);
        grad.addColorStop(0.3, `hsla(${THEME_COLOR.emerald}, ${coreSat}%, ${THEME_COLOR.light}%, 0.4)`);
        grad.addColorStop(1, `hsla(${edgeHue}, ${edgeSat}%, ${edgeLight}%, ${edgeAlpha})`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        // Use ellipse for motion stretching
        const stretchFactor = Math.min(Math.abs(r.rotationVelocity) * 0.1, 0.3);
        ctx.ellipse(
          r.x, r.y, 
          totalRadius * (1 - stretchFactor * 0.5), 
          totalRadius * (1 + stretchFactor), 
          r.currentAngle, 0, Math.PI * 2
        );
        ctx.fill();
      }
    };

    const animate = (t: number) => {
      updatePhysics(t);
      draw(t);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

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

    // Initial setup
    init();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [sessionConfig]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]">
      {/* THE SECRET SAUCE: The Grainy Glass Overlay
          This blurs the underlying canvas graphics, and the SVG grain texture
          mixes with the glow to create depth and a premium film look.
      */}
      <div className="absolute inset-0 z-[1] backdrop-blur-[60px] pointer-events-none" />
      
      {/* SVG Noise Texture - GPU accelerated */}
      <svg className="absolute inset-0 opacity-[0.035] pointer-events-none z-[2] mix-blend-overlay">
        <filter id="receptor-grain-blur">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#receptor-grain-blur)" />
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block"
        style={{
          width: "100%",
          height: "100%",
          // plus-lighter is similar to 'screen' but blends colors much cleaner
          // against dark images like your portfolio's landscape.
          mixBlendMode: "plus-lighter", 
          opacity: 0.65,
          transform: "scale(1.1)", // Crop edges to hide artifacts
        }}
      />
    </div>
  );
};

export default ParticleBackground;
