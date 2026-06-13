import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

const getInitialTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "dark";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 right-4 z-[9998] w-10 h-10 rounded-lg flex items-center justify-center bg-card/80 backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-all duration-300 text-foreground"
    >
      <span className="relative w-5 h-5 block">
        <Sun
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0) scale(1)",
          }}
        />
        <Moon
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
