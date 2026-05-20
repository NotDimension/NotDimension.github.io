import React, { useEffect, useRef } from 'react';

/**
 * OPTIMIZED DARK GRADIENT BACKGROUND + PROMINENT SPOTLIGHT
 * - Layers separated: Static ambient blobs and the interactive spotlight are on different layers.
 * - This prevents the browser from repainting the complex static gradients on every mouse move.
 * - Dark mode colors with prominent, high-contrast atmospheric glows.
 * - Math.round() added to prevent sub-pixel rendering lag.
 */
const Background: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let running = false;

    const tick = () => {
      // ease toward target
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      
      // Rounding to integers stops the GPU from calculating sub-pixels, boosting performance
      el.style.setProperty('--mx', `${Math.round(x)}px`);
      el.style.setProperty('--my', `${Math.round(y)}px`);
      
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="bg-base fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      {/* Spotlight Layer - Isolated on its own div for maximum performance */}
      <div ref={spotlightRef} className="bg-spotlight absolute inset-0" />

      <style>{`
        .bg-base {
          background-color: #030712; /* Deep, almost-black slate */
          background-image:
            radial-gradient(50vmax 50vmax at 20% 30%, rgba(59, 130, 246, 0.15), transparent 70%), /* Vibrant blue */
            radial-gradient(60vmax 60vmax at 80% 70%, rgba(139, 92, 246, 0.15), transparent 70%), /* Deep purple */
            radial-gradient(40vmax 40vmax at 50% 90%, rgba(14, 165, 233, 0.12), transparent 70%); /* Bright sky blue */
          animation: bgDrift 40s ease-in-out infinite alternate;
        }

        .bg-spotlight {
          --mx: 50vw;
          --my: 50vh;
          /* Prominent spotlight: larger radius, crisp white/cyan tint */
          background-image: radial-gradient(
            600px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.08),
            transparent 60%
          );
          will-change: background-image;
        }

        @keyframes bgDrift {
          0%   { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: -5% 3%, 4% -4%, -2% -3%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bg-base { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Background;
