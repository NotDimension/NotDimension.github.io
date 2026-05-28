import { ReactNode, useEffect, useRef, useState } from "react";
import { m, useAnimation } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Lightweight scroll reveal using native IntersectionObserver — no extra deps.
 * One-shot reveal, GPU-friendly transform/opacity only.
 */
const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  y = 24,
}: ScrollRevealProps) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
          });
          obs.disconnect();
        }
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [controls, delay, seen]);

  return (
    <div ref={ref} className={className}>
      <m.div
        initial={{ opacity: 0, y }}
        animate={controls}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </m.div>
    </div>
  );
};

export default ScrollReveal;
