// src/components/ScrollReveal.tsx
import { ReactNode, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ScrollReveal = ({ children, className = "", delay = 0 }: ScrollRevealProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: "-80px 0px -80px 0px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay },
      });
    }
  }, [controls, inView, delay]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
