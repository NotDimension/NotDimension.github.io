import React, { useEffect, useRef } from 'react';

/**
 * OPTIMIZED LIGHT GRADIENT BACKGROUND + CURSOR SPOTLIGHT
 * - Shifted to a bright, clean light-mode aesthetic.
 * - Base background is pure white.
 * - Mouse movement updates a prominent, smooth light-to-mid gray radial gradient overlay.
 * - Highly optimized: Spotlight layer is completely isolated to protect frame rates.
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
      
      // Keep rendering crisp and light on the GPU
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
      {/* Spotlight Layer - Handles the gray cursor gradient dynamically */}
      <div ref={spotlightRef} className="bg-spotlight absolute inset-0" />

      <style>{`
        .bg-base {
          background-color: #ffffff; /* Base background pure white */
          background-image:
            radial-gradient(50vmax 50vmax at 10% 20%, rgba(243, 244, 246, 0.8), transparent 80%),   /* Soft top-left gray */
            radial-gradient(60vmax 60vmax at 90% 80%, rgba(229, 231, 235, 0.6), transparent 80%);  /* Soft bottom-right gray */
          animation: bgDrift 30s ease-in-out infinite alternate;
        }

        .bg-spotlight {
          --mx: 50vw;
          --my: 50vh;
          /* Prominent cursor spotlight creating a sleek light gray tracking effect */
          background-image: radial-gradient(
            550px circle at var(--mx) var(--my),
            rgba(209, 213, 219, 0.45),
            rgba(229, 231, 235, 0.2) 50%,
            transparent 80%
          );
          will-change: background-image;
        }

        @keyframes bgDrift {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: -3% 2%, 3% -2%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bg-base { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Background;
