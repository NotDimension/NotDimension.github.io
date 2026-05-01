import React, { useEffect, useRef } from 'react';

/**
 * LUMINOUS FLOW FIELD (Ultra-Light Edition)
 * - Performance: Near-zero CPU impact (GPU-heavy rendering).
 * - Aesthetic: High-end generative silk / light trails.
 * - Interaction: Flow follows mouse velocity.
 */

const SETTINGS = {
  PARTICLE_COUNT: 40,    // Low count + long trails = high performance
  MAX_FORCE: 0.1,
  MAX_SPEED: 2.5,
  COLOR: '#10b981',      // Emerald Green
  TRAIL_STRENGTH: 0.08,  // How long the trails last
};

const FlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: disable alpha buffer
    if (!ctx) return;

    let w: number, h: number;
    let particles: any[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < SETTINGS.PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          history: []
        });
      }
    };

    const draw = () => {
      // THE TRICK: Don't clear the screen. Draw a faint black box to "fade" old frames.
      ctx.fillStyle = `rgba(2, 6, 23, ${SETTINGS.TRAIL_STRENGTH})`;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = SETTINGS.COLOR;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      particles.forEach(p => {
        // Simple Physics
        p.x += p.vx;
        p.y += p.vy;

        // Mouse influence
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          p.vx += dx * 0.0005;
          p.vy += dy * 0.0005;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > SETTINGS.MAX_SPEED) {
          p.vx = (p.vx / speed) * SETTINGS.MAX_SPEED;
          p.vy = (p.vy / speed) * SETTINGS.MAX_SPEED;
        }

        // Draw the segment
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx, p.y - p.vy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      });

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-[#020617]"
    />
  );
};

export default FlowBackground;
