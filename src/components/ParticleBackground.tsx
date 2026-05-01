import React, { useEffect, useRef } from 'react';

/**
 * CYBER-GRID TERMINAL BACKGROUND
 * - Unique ASCII-based aesthetic.
 * - Ultra-low CPU usage.
 * - Interactive mouse-glow effect.
 */

const SETTINGS = {
  FONT_SIZE: 16,
  COLOR: '#10b981', // Your theme green
  BG_COLOR: '#020617',
  CHARACTERS: '01', // You can add 'Minecraft' or other strings here
  FADE_SPEED: 0.05,
};

const BinaryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let columns: number;
    let rows: number;
    let drops: number[];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / SETTINGS.FONT_SIZE);
      rows = Math.floor(canvas.height / SETTINGS.FONT_SIZE);
      drops = new Array(columns).fill(0);
    };

    const draw = () => {
      // Create a fading effect by drawing a semi-transparent rectangle
      ctx.fillStyle = `rgba(2, 6, 23, ${SETTINGS.FADE_SPEED})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${SETTINGS.FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * SETTINGS.FONT_SIZE;
        const y = drops[i] * SETTINGS.FONT_SIZE;

        // Check distance to mouse for a custom "glow" color
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.fillStyle = '#34d399'; // Brighter green near mouse
        } else {
          ctx.fillStyle = SETTINGS.COLOR;
        }

        const char = SETTINGS.CHARACTERS.charAt(
          Math.floor(Math.random() * SETTINGS.CHARACTERS.length)
        );

        ctx.fillText(char, x, y);

        // Reset drop to top randomly after it hits bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background: SETTINGS.BG_COLOR }}
    />
  );
};

export default BinaryBackground;
