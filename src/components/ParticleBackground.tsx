import React, { useEffect, useRef } from 'react';

/**
 * GENERATIVE TOPOGRAPHY
 * - Aesthetic: Flowing 3D terrain / abstract waves.
 * - Performance: Mathematical sine-wave rendering (High FPS).
 * - Interaction: Waves subtly follow mouse movement.
 */

const SETTINGS = {
  LINE_COUNT: 25,        // Number of horizontal ribbons
  SENSITIVITY: 0.002,    // Speed of flow
  WAVE_STRENGTH: 60,     // Vertical height of waves
  COLOR: '#10b981',      // Your emerald green
  BG: '#020617',         // Dark slate background
};

const TopoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let tick = 0;

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      tick += 1;
      ctx.fillStyle = SETTINGS.BG;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1.5;
      
      // Create the "Topographic" layers
      for (let i = 0; i < SETTINGS.LINE_COUNT; i++) {
        ctx.beginPath();
        
        // Dynamic opacity based on "depth"
        const opacity = (i / SETTINGS.LINE_COUNT) * 0.4;
        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;

        // Vertical spacing
        const baseY = (h / SETTINGS.LINE_COUNT) * i;

        for (let x = 0; x <= w; x += 10) {
          // The Magic Math: Nested sine waves + Mouse influence
          const mouseInfluence = (mouseRef.current.x / w) * 2;
          const distortion = Math.sin(x * 0.005 + tick * SETTINGS.SENSITIVITY + i) * Math.cos(x * 0.002 + i * 0.5) * SETTINGS.WAVE_STRENGTH;
          
          const y = baseY + distortion + (mouseRef.current.y * 0.05);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
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

export default TopoBackground;
