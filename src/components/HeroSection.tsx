import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(210_100%_55%/0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(200_90%_50%/0.04)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
          {/* Profile picture - bigger, on the left */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, x: -40 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative group">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 via-accent/20 to-transparent blur-md group-hover:blur-lg transition-all duration-700 opacity-60 group-hover:opacity-80" />
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-primary/30 glow-border">
                <img
                  src="/images/profile.png"
                  alt="NotDimension"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Status dot */}
              <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30 animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Text - on the right */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-3"
            >
              <span className="inline-block text-xs font-mono text-primary/60 tracking-[0.3em] uppercase bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                Minecraft Server Developer
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-mono leading-none"
            >
              <span className="text-primary glow-text">Not</span>
              <span className="text-foreground">Dimension</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-5"
            >
              Building communities, configuring servers, and crafting exceptional
              Minecraft experiences from South Africa.
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono">South Africa</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-sm font-mono">Available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-muted-foreground/50 tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-primary/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
