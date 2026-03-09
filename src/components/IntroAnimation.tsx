import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => {
      setPhase(3);
      onComplete();
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* Scanning Lines */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.12 : 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px] bg-primary/20"
                style={{ top: `${(i + 1) * 15}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              />
            ))}
          </motion.div>

          {/* Central Content */}
          <div className="relative text-center">
            {/* Brackets */}
            <motion.div
              className="text-primary/40 font-mono text-7xl md:text-9xl font-thin mb-6"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{
                opacity: phase >= 0 ? 1 : 0,
                letterSpacing: phase >= 1 ? "0.15em" : "0.5em",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {"< >"}
            </motion.div>

            {/* Name */}
            <motion.h1
              className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl font-bold font-mono"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                scale: phase >= 1 ? 1 : 0.8,
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-primary glow-text">Not</span>
              <span className="text-foreground">Dimension</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-20 text-base md:text-lg font-mono text-muted-foreground tracking-[0.3em] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                y: phase >= 2 ? 0 : 8,
              }}
              transition={{ duration: 0.5 }}
            >
              Initializing...
            </motion.p>
          </div>

          {/* Corner accents */}
          {[
            "top-6 left-6",
            "top-6 right-6 rotate-90",
            "bottom-6 left-6 -rotate-90",
            "bottom-6 right-6 rotate-180",
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-10 h-10`}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.25 : 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
            >
              <div className="w-full h-[1px] bg-primary" />
              <div className="w-[1px] h-full bg-primary" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
