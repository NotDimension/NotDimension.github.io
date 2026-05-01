import React, { useEffect, useRef } from 'react';

/**
 * KINETIC MAGNETISM GRID
 * - Aesthetic: Industrial, tactile, responsive.
 * - Performance: Static grid (No physics integration needed).
 * - Interaction: 100% mouse-driven orientation.
 */

const SETTINGS = {
  GRID_GAP: 40,         // Space between receptors
  LINE_LENGTH: 15,      // Length of each "needle"
  COLOR: '#10b981',     // Theme Emerald
  BG: '#020617',        // Dark Slate
};

const KineticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.fillStyle = SETTINGS.BG;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = SETTINGS.COLOR;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      // Iterate through the screen in a grid
      for (let x = SETTINGS.GRID_GAP / 2; x < w; x += SETTINGS.GRID_GAP) {
        for (let y = SETTINGS.GRID_GAP / 2; y < h; y += SETTINGS.GRID_GAP) {
          
          // 1. Calculate angle to mouse
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const angle = Math.atan2(dy, dx);
          
          // 2. Calculate distance for scale (optional "pinch" effect)
          const dist = Math.sqrt(dx * dx + dy * dy);
          const strength = Math.min(150 / dist, 2); // Get "excited" when mouse is near

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // 3. Draw the "Needle"
          ctx.beginPath();
          ctx.globalAlpha = Math.max(0.1, 1 - dist / 600); // Fade out far from mouse
          ctx.moveTo(-SETTINGS.LINE_LENGTH * strength, 0);
          ctx.lineTo(SETTINGS.LINE_LENGTH * strength, 0);
          ctx.stroke();
          
          ctx.restore();
        }
      }
      
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

export default KineticBackground;
