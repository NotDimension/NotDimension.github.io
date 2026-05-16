import React from 'react';

/**
 * STATIC CSS GRADIENT BACKGROUND
 * - Zero JS, zero canvas, zero rAF.
 * - Pure CSS radial gradients with a subtle slow drift animation.
 * - Respects prefers-reduced-motion (animation auto-disabled).
 */
const Background: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#020617' }}
    >
      <div className="bg-gradients absolute inset-0" />
      <style>{`
        .bg-gradients {
          background:
            radial-gradient(60vmax 60vmax at 20% 30%, rgba(16,185,129,0.18), transparent 60%),
            radial-gradient(55vmax 55vmax at 80% 70%, rgba(5,150,105,0.16), transparent 60%),
            radial-gradient(45vmax 45vmax at 50% 90%, rgba(52,211,153,0.12), transparent 60%),
            radial-gradient(40vmax 40vmax at 90% 10%, rgba(6,78,59,0.25), transparent 60%);
          filter: blur(40px);
          will-change: transform;
          animation: bgDrift 40s ease-in-out infinite alternate;
        }
        @keyframes bgDrift {
          0%   { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-2%, 1%, 0) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-gradients { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Background;
