import React, { useEffect, useRef } from 'react';

/**
 * CSS GRADIENT BACKGROUND + CURSOR SPOTLIGHT
 * - Zero canvas. Pure CSS radial gradients.
 * - One rAF-throttled pointermove updates two CSS vars for an interactive glow.
 * - Reduced blur for crisper visuals and lower GPU cost.
 * - Disabled on touch / reduced motion.
 */
const Background: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
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
      ref={ref}
      aria-hidden="true"
      className="bg-root fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      <style>{`
        .bg-root {
          --mx: 50vw;
          --my: 50vh;
          background-color: #f1f2f4;
          background-image:
            radial-gradient(420px circle at var(--mx) var(--my), rgba(120,130,140,0.22), transparent 65%),
            radial-gradient(50vmax 50vmax at 20% 30%, rgba(180,185,195,0.40), transparent 60%),
            radial-gradient(45vmax 45vmax at 80% 70%, rgba(200,205,210,0.35), transparent 60%),
            radial-gradient(35vmax 35vmax at 50% 95%, rgba(150,160,170,0.28), transparent 60%);
          filter: none;
          will-change: background-position;
          animation: bgDrift 60s ease-in-out infinite alternate;
        }
        @keyframes bgDrift {
          0%   { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 0 0, -3% 2%, 2% -2%, -1% -3%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-root { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Background;
