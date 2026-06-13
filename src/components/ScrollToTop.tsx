// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ enabled = true }: { enabled?: boolean }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!enabled) return;

    // Wait until DOM has rendered
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  }, [pathname, enabled]);

  return null;
};

export default ScrollToTop;
