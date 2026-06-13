import { useEffect, useState } from "react";

export const nameHoverAnimationConfig = {
  scale: 1.3,
  y: -10,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
};

export const nameRestAnimationConfig = {
  scale: 1,
  y: 0,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
};

// Initialize CSS variables synchronously at module load time
// All theming lives in index.css — this hook just removes any inline
// color that may have been set on .name-letter spans so the CSS rule wins.
const initializeColorVars = () => {
  document.querySelectorAll<HTMLElement>(".name-letter").forEach((el) => {
    el.style.removeProperty("color");
  });
};

// Run immediately when module loads (before React renders)
if (typeof document !== "undefined") {
  // Use MutationObserver to catch when elements are added and clean them
  const observer = new MutationObserver(() => {
    initializeColorVars();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
    childList: true,
  });
}

export const useThemeAwareHoverColor = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize on mount
    initializeColorVars();

    // Watch for theme changes and DOM changes
    const updateAndClean = () => {
      initializeColorVars();
    };

    const observer = new MutationObserver(updateAndClean);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return mounted;
};
