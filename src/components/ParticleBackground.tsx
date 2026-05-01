import React, { useEffect, useRef } from 'react';

/**
 * FROSTED AURORA MESH
 * - Unique aesthetic: High-end "Glassmorphism"
 * - Interactivity: Liquid-style mouse tracking
 * - Performance: Uses CSS Blur and SVG Noise filters (GPU Accelerated)
 */

const AuroraBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      // Smoothly update CSS variables for the "glow" position
      containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[-1] bg-[#020617] overflow-hidden"
    >
      {/* The "Aurora" Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main interactive glow */}
        <div 
          className="absolute transition-transform duration-300 ease-out pointer-events-none"
          style={{
            left: 'var(--mouse-x)',
            top: 'var(--mouse-y)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Static secondary accent - Top Right */}
        <div 
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Static secondary accent - Bottom Left */}
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* THE UNIQUE PART: The Grainy Glass Overlay */}
      <div className="absolute inset-0 backdrop-blur-[120px] pointer-events-none" />
      
      {/* SVG Noise Texture for that premium "paper/film" feel */}
      <svg className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.6" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default AuroraBackground;
