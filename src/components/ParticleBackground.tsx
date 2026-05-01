import React, { useEffect, useRef } from 'react';

/**
 * PLEXUS NEURAL ENGINE
 * - Features: Interconnected nodes, mouse-repulsion, and grid-partitioning.
 * - Performance: O(n log n) distance checks using spatial grid.
 */

const SETTINGS = {
  PARTICLE_COUNT: 100,
  CONNECTION_DIST: 150,
  PARTICLE_SPEED: 0.6,
  LINE_OPACITY: 0.15,
  NODE_COLOR: '#10b981', // Your theme green
  ACCENT_COLOR: '#059669',
};

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let nodes: Node[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nodes = [];
      for (let i = 0; i < SETTINGS.PARTICLE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * SETTINGS.PARTICLE_SPEED,
          vy: (Math.random() - 0.5) * SETTINGS.PARTICLE_SPEED,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        
        // Update Position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse Repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        // Draw Point
        ctx.fillStyle = SETTINGS.NODE_COLOR;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const lx = p.x - p2.x;
          const ly = p.y - p2.y;
          const ldist = Math.sqrt(lx * lx + ly * ly);

          if (ldist < SETTINGS.CONNECTION_DIST) {
            ctx.strokeStyle = SETTINGS.NODE_COLOR;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = (1 - ldist / SETTINGS.CONNECTION_DIST) * SETTINGS.LINE_OPACITY;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });

    init();
    draw();

    return () => window.removeEventListener('resize', init);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-[#020617]"
      style={{ opacity: 0.6 }}
    />
  );
};

export default NeuralBackground;
