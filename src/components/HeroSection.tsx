import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import { nameHoverAnimationConfig, useThemeAwareHoverColor } from "@/hooks/useConsistentHoverAnimation";

const HeroSection = () => {
  const name = "NotDimension";
  const [isLoaded, setIsLoaded] = useState(false);
  const backgroundPath = "/bg-landscape.jpg";
  useThemeAwareHoverColor();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6">
      {/* 1. HIDDEN LOADER: Triggers the fade-in once the image is in browser cache */}
      <img
        src={backgroundPath}
        onLoad={() => setIsLoaded(true)}
        className="hidden"
        alt=""
      />

      {/* 2. DYNAMIC BACKGROUND: Fades in only when fully loaded */}
      <AnimatePresence>
        {isLoaded && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `var(--hero-overlay), url(${backgroundPath})`,
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
          />
        )}
      </AnimatePresence>

      {/* Theme-aware red halo overlays the background image */}
      <div className="hero-green-halo" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24">

          {/* PROFILE IMAGE */}
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative cursor-pointer group"
            style={{ willChange: "transform" }}
          >
            {/* Soft gray halo */}
            <div
              className="absolute -inset-6 rounded-full bg-foreground/5 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
              style={{ willChange: "opacity", transform: "translateZ(0)" }}
            />

            {/* Image container with accent ring */}
            <div
              className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[3px] border-accent/40 shadow-[0_0_40px_hsl(var(--accent)/0.15)] transition-[transform,box-shadow,border-color] duration-500 group-hover:border-accent group-hover:shadow-[0_0_50px_hsl(var(--accent)/0.3)]"
              style={{ transform: "translateZ(0)" }}
            >
              <img
                src="/images/profile.png"
                alt="NotDimension"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                style={{ willChange: "transform" }}
              />
            </div>

            {/* STATUS DOT */}
            <div className="status-online absolute bottom-6 right-6 w-6 h-6 rounded-full border-4 border-background z-20" />
          </m.div>

          {/* TEXT CONTENT */}
          <div className="text-center md:text-left w-full min-w-0">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <span className="inline-block text-xs sm:text-sm font-mono text-foreground tracking-[0.2em] sm:tracking-[0.25em] uppercase bg-background/80 px-3 sm:px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                Experienced Admin & Developer
              </span>
            </m.div>

            {/* NAME WITH INDIVIDUAL LETTER HOVER */}
            <h1 
              className="text-[clamp(1.8rem,8vw,7rem)] font-bold font-mono tracking-tighter mb-4 transition-colors duration-300 flex justify-center md:justify-start flex-nowrap whitespace-nowrap leading-[1.1]"
              style={{
                color: "var(--name-text-color, hsl(var(--foreground)))"
              }}
            >
              {name.split("").map((char, index) => (
                <m.span
                  key={index}
                  className="inline-block cursor-default name-letter"
                  initial={{ scale: 1, y: 0 }}
                  whileHover={{ scale: 1.3, y: -10, transition: nameHoverAnimationConfig.transition }}
                  style={{ pointerEvents: "auto" }}
                >
                  {char === " " ? "\u00A0" : char}
                </m.span>
              ))}
            </h1>

            <m.p 
              className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Building communities, configuring servers, and crafting exceptional 
              Minecraft experiences from South Africa.
            </m.p>

            {/* BADGES */}
            <m.div 
              className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 text-sm font-mono text-muted-foreground flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 group">
                <MapPin className="w-4 h-4 text-accent transition-transform group-hover:scale-110" /> 
                <span>South Africa</span>
              </div>
              <div className="w-px h-4 bg-border/50" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> 
                <span>Available</span>
              </div>
            </m.div>
          </div>
        </div>
      </div>
      
      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
        <m.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-accent" />
        </m.div>
      </div>
    </section>
  );
};

export default HeroSection;
