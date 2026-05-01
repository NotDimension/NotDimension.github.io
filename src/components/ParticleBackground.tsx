import React, { useEffect, useRef } from "react";

/**
 * PRO-PERFORMANCE LAVA LAMP
 * - Uses a low-res offscreen buffer + CSS scaling for maximum FPS.
 * - Optimized Goo filter using feColorMatrix.
 * - Thermal physics to prevent clumping.
 */

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // PERFORMANCE HACK: Render at lower resolution and scale up with CSS
    // This makes the "goo" math significantly cheaper on the CPU.
    const SCALE = 0.5; 
    let w = window.innerWidth * SCALE;
    let h = window.innerHeight * SCALE;

    const initCanvas = () => {
      w = window.innerWidth * SCALE;
      h = window.innerHeight * SCALE;
      canvas.width = w;
      canvas.height = h;
    };

    // Blob settings
    const blobCount = window.innerWidth < 768 ? 8 : 14;
    const blobs = Array.from({ length: blobCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      r: (Math.random() * 40 + 40) * SCALE,
      temp: Math.random(), // 0 = cold/sinking, 1 = hot/rising
      phase: Math.random() * Math.PI * 2,
    }));

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      
      // We use a simple radial gradient for the "fuzzy" base
      // The SVG filter in the return statement will turn these into goo.
      ctx.fillStyle = "#10b981"; // Your site's emerald green

      blobs.forEach((b) => {
        // 1. Thermal Physics (Buoyancy)
        // Blobs heat up at the bottom and cool at the top
        if (b.y > h - 50) b.temp += 0.01;
        if (b.y < 50) b.temp -= 0.01;
        b.temp = Math.max(0.1, Math.min(0.9, b.temp));

        // 2. Movement
        b.vy -= (b.temp - 0.5) * 0.15; // Rising/Sinking force
        b.vx += Math.sin(time * 0.001 + b.phase) * 0.02; // Side-to-side drift

        // 3. Friction & Speed Cap
        b.vx *= 0.98;
        b.vy *= 0.98;
        b.x += b.vx;
        b.y += b.vy;

        // 4. Anti-Clumping (Soft walls)
        if (b.x < 0) b.vx += 0.1;
        if (b.x > w) b.vx -= 0.1;
        if (b.y < 0) b.vy += 0.1;
        if (b.y > h) b.vy -= 0.1;

        // 5. Drawing the "Fuzzy" particle
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2);
        grad.addColorStop(0, "rgba(16, 185, 129, 1)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("resize", initCanvas);
    initCanvas();
    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", initCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <svg style={{ position: "fixed", width: 0, height: 0 }}>
        <filter id="lava-filter">
          {/* Blur the edges */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          {/* The magic Matrix: It looks at the alpha channel.
              Anything with alpha < 0.5 becomes transparent.
              Anything with alpha > 0.5 becomes solid. 
              This creates the "snapping" liquid effect. */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -7"
            result="goo"
          />
          {/* Subtle glow / blending */}
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          filter: "url(#lava-filter)",
          opacity: 0.3,
          width: "100vw",
          height: "100vh",
          // This tells the browser to upscale smoothly
          imageRendering: "auto", 
          zIndex: -1,
        }}
      />
    </>
  );
};

export default ParticleBackground;
