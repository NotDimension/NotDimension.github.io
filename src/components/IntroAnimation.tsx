import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { nameHoverAnimationConfig } from "@/hooks/useConsistentHoverAnimation";

interface IntroProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // name starts appearing
    const t2 = setTimeout(() => setPhase(2), 1600);  // fade everything out
    const t3 = setTimeout(() => onComplete(), 2200); // end intro
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <m.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Particles render globally from App.tsx */}

          {/* Profile Picture - Updated with Accent Ring & Matching Glow */}
          <m.div
            className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-6 border-[3px] border-accent/40 shadow-[0_0_30px_hsl(var(--accent)/0.15)]"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="/images/profile.png"
              alt="NotDimension"
              width="160"
              height="160"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
          </m.div>

          {/* Name Reveal - Updated with Consistent Hover Animation */}
          <m.h1
            className="flex flex-wrap justify-center text-4xl md:text-6xl font-bold font-mono gap-1 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {"NotDimension".split("").map((char, i) => (
              <m.span
                key={i}
                className="inline-block name-letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.3, y: -10, transition: nameHoverAnimationConfig.transition }}
                style={{ display: "inline-block", pointerEvents: "auto" }}
              >
                {char}
              </m.span>
            ))}
          </m.h1>

          {/* Subtitle */}
          <m.p
            className="mt-4 text-sm md:text-base text-muted-foreground tracking-[0.2em] uppercase font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Loading Portfolio...
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
