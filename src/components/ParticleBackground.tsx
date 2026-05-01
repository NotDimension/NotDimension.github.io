import React, { useEffect, useRef } from 'react';

/**
 * SHATTERED PRISM BACKGROUND
 * - Aesthetic: 3D floating shards / geometric depth.
 * - Performance: Ultra-optimized (No physics, just trigonometry).
 * - Interaction: Shards "tilt" toward the mouse.
 */

const SETTINGS = {
  SHARD_COUNT: 35,
  MAX_SIZE: 40,
  MIN_SIZE: 15,
  COLOR: '#10b981', // Your Emerald Green
  BG: '#020617',
};

const PrismBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let shards: any[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      shards = [];
      for (let i = 0; i < SETTINGS.SHARD_COUNT; i++) {
        shards.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * (SETTINGS.MAX_SIZE - SETTINGS.MIN_SIZE) + SETTINGS.MIN_SIZE,
          speed: 0.2 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          sides: Math.floor(Math.random() * 3) + 3, // Randomly Triangles, Squares, or Pentagons
          opacity: 0.1 + Math.random() * 0.3
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = SETTINGS.BG;
      ctx.fillRect(0, 0, w, h);

      shards.forEach(s => {
        // Subtle drift
        s.y -= s.speed;
        s.angle += s.rotSpeed;

        // Mouse "Tilt" calculation
        const dx = mouseRef.current.x - s.x;
        const dy = mouseRef.current.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const tiltX = (dx / w) * 20;
        const tiltY = (dy / h) * 20;

        // Reset if goes off screen
        if (s.y < -50) {
          s.y = h + 50;
          s.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(s.x + tiltX, s.y + tiltY);
        ctx.rotate(s.angle);
        
        // Draw the polygon
        ctx.beginPath();
        ctx.strokeStyle = SETTINGS.COLOR;
        ctx.globalAlpha = s.opacity;
        ctx.lineWidth = 1;

        for (let i = 0; i < s.sides; i++) {
          const x = s.size * Math.cos((i * 2 * Math.PI) / s.sides);
          const y = s.size * Math.sin((i * 2 * Math.PI) / s.sides);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.stroke();

        // Add a subtle "shimmer" dot in the center
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = SETTINGS.COLOR;
        ctx.fill();
        
        ctx.restore();
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
      className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
};

export default PrismBackground;
