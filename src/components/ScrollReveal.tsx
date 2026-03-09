// src/components/ScrollReveal.tsx
import { ReactNode, useEffect, useRef } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const ScrollReveal = ({ children, className = "", delay = 0 }: ScrollRevealProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, margin: "-100px 0px -100px 0px" });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      transition={{ delay }}
      layout
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
