import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(210_100%_55%/0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-2 border-primary/30 glow-border">
            <img src="/images/profile.png" alt="NotDimension" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-mono"
        >
          <span className="text-primary glow-text">Not</span>
          <span className="text-foreground">Dimension</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground font-mono mb-6"
        >
          Minecraft Server Developer
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono">South Africa</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent mx-auto animate-pulse-glow" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
