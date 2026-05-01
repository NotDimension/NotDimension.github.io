import React, { useEffect, useRef } from 'react';

/**
 * LIQUID BOKEH MESH
 * - Aesthetic: Ultra-minimalist blurred light orbs.
 * - Performance: 10/10 (Only 6 objects, GPU-blurred).
 * - Interaction: Orbs gravitate toward mouse with smooth easing.
 */

const SETTINGS = {
  ORB_COUNT: 6,
  COLOR_PALETTE: ['#10b981', '#059669', '#34d399', '#064e3b'], // Emerald shades
  BG: '#020617',
};

const BokehBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let orbs: any[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      orbs = [];
      for (let i = 0; i < SETTINGS.ORB_COUNT; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          targetX: Math.random() * w,
          targetY: Math.random() * h,
          radius: Math.random() * (w * 0.3) + w * 0.2, // Huge soft orbs
          color: SETTINGS.COLOR_PALETTE[i % SETTINGS.COLOR_PALETTE.length],
          speed: 0.005 + Math.random() * 0.01
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = SETTINGS.BG;
      ctx.fillRect(0, 0, w, h);

      orbs.forEach(orb => {
        // Smoothly move toward a target
        orb.x += (orb.targetX - orb.x) * orb.speed;
        orb.y += (orb.targetY - orb.y) * orb.speed;

        // Mouse influence: subtly pull targets toward mouse
        const dx = mouseRef.current.x - orb.x;
        const dy = mouseRef.current.y - orb.y;
        orb.targetX += dx * 0.001;
        orb.targetY += dy * 0.001;

        // If orb reaches target, pick a new random target
        if (Math.abs(orb.x - orb.targetX) < 10) {
          orb.targetX = Math.random() * w;
          orb.targetY = Math.random() * h;
        }

        // Draw the soft orb
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
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
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* This layer is the "Glass" that makes it look cool */}
      <div 
        className="absolute inset-0 backdrop-blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%)'
        }}
      />
    </div>
  );
};

export default BokehBackground;
