import React from 'react';

/**
 * Theme-aware floating particle background.
 * Uses CSS variables (--particle-bg, --particle-color) so it inverts
 * cleanly between light and dark modes.
 */
const Background: React.FC = () => {
  const hc = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  // @ts-expect-error deviceMemory is non-standard
  const mem = typeof navigator !== "undefined" ? navigator.deviceMemory || 4 : 4;
  const isTouch = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const baseCount = reduced ? 0 : Math.min(30, Math.max(8, Math.round((hc + mem) * (isTouch ? 1 : 1.5))));

  const particles = Array.from({ length: baseCount }).map((_, i) => {
    const size = Math.random() * 3 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * -20;
    const duration = Math.random() * 15 + 15;
    const opacity = Math.random() * 0.25 + 0.15;

    return {
      key: i,
      style: {
        position: 'absolute' as const,
        bottom: '-10px',
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'var(--particle-color)',
        borderRadius: '50%',
        opacity,
        animation: `floatUp ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      },
    };
  });

  return (
    <div
      aria-hidden="true"
      className="bg-base fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div key={p.key} style={p.style} />
        ))}
      </div>

      <style>{`
        .bg-base {
          background-color: hsl(var(--background));
          background-image:
            radial-gradient(60vmax 60vmax at 0% 0%, var(--particle-tint-a), transparent 80%),
            radial-gradient(60vmax 60vmax at 100% 100%, var(--particle-tint-b), transparent 80%);
          transition: background-color 0.5s ease;
        }

        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: inherit; }
          90%  { opacity: inherit; }
          100% { transform: translateY(-105vh) translateX(50px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          div { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Background;
