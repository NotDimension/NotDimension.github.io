import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";

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
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Particle Background - Now using the Emerald/White logic */}
          <ParticleBackground />

          {/* Profile Picture - Updated with Emerald Glow */}
          <motion.div
            className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-6 border-2 border-accent/40 shadow-lg shadow-accent/10"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="/images/profile.png"
              alt="NotDimension"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Name Reveal - Updated Hover to Emerald Green */}
          <motion.h1
            className="flex flex-wrap justify-center text-4xl md:text-6xl font-bold font-mono gap-1 text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {"NotDimension".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.3, y: -5, color: "#10b981" }} // Emerald Green Hover
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle - Using Accent color for a forest vibe */}
          <motion.p
            className="mt-4 text-sm md:text-base text-accent/60 tracking-[0.2em] uppercase font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Initializing Environment...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
