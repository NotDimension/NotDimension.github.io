import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients - Forest Green */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(155_100%_45%/0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(155_60%_30%/0.08)_0%,transparent_50%)]" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Profile picture */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, x: -40 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent/40 via-primary/20 to-transparent blur-md group-hover:blur-lg transition-all duration-700 opacity-60 group-hover:opacity-80" />
              <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-primary/30 glow-border">
                <img
                  src="/images/profile.png"
                  alt="NotDimension"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-accent border-4 border-background shadow-lg shadow-accent/30 animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center md:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-3"
            >
              <span className="inline-block text-xs font-mono text-accent/70 tracking-[0.3em] uppercase bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                Minecraft Server Developer
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-bold tracking-tight font-mono flex flex-wrap gap-1 justify-center md:justify-start leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            >
              {"NotDimension".split("").map((char, i) => (
                <motion.span
                  key={i}
                  whileHover={{ y: -8, scale: 1.3, rotate: 5, color: "#10b981" }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="cursor-default"
                >
                  {char}
                </motion.span>
              ))}
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
              className="flex items-center gap-4 justify-center md:justify-start flex-wrap"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm font-mono">South Africa</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-sm font-mono">Available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
