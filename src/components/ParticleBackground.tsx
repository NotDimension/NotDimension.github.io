import React from 'react';

/**
 * OPTIMIZED FLOATING PARTICLE BACKGROUND
 * - Light-mode aesthetic: Pure white base background.
 * - Floating gray dots: Subtle neutral gray particles float up and drift across the screen.
 * - Non-interactive: No mouse tracking or pointer event listeners needed.
 * - Max performance: Uses hardware-accelerated CSS keyframe animations instead of JS loops.
 */
const Background: React.FC = () => {
  // Generates 30 random particle styles for a natural, organic distribution
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 3 + 2; // Size between 2px and 5px
    const left = Math.random() * 100;   // Starting horizontal placement (%)
    const delay = Math.random() * -20;  // Negative delay so they don't all spawn at once
    const duration = Math.random() * 15 + 15; // Speed variance (15s to 30s)
    const opacity = Math.random() * 0.25 + 0.15; // Prominent but clean gray visibility

    return {
      key: i,
      style: {
        position: 'absolute' as const,
        bottom: '-10px',
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#4b5563', // Beautiful zinc/gray-600 dot color
        borderRadius: '50%',
        opacity: opacity,
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
      {/* Dynamic Gray Particle Container */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div key={p.key} style={p.style} />
        ))}
      </div>

      <style>{`
        .bg-base {
          background-color: #ffffff; /* Base background pure white */
          background-image:
            radial-gradient(60vmax 60vmax at 0% 0%, rgba(243, 244, 246, 0.6), transparent 80%),
            radial-gradient(60vmax 60vmax at 100% 100%, rgba(229, 231, 235, 0.5), transparent 80%);
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: inherit;
          }
          90% {
            opacity: inherit;
          }
          100% {
            /* Gently sways left and right while ascending past the top of the viewport */
            transform: translateY(-105vh) translateX(50px);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Background;
