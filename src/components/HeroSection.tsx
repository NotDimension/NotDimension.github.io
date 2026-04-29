import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Central Glow Overlay - Restrictive to the Hero area */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(155_100%_45%/0.12)_0%,transparent_70%)]" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
          
          {/* Profile Section with Emerald Aura */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* The pulse glow behind the cat profile */}
            <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl animate-pulse" />
            
            <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-accent/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <img
                src="/images/profile.png"
                alt="NotDimension"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status Indicator (Pulse) */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute bottom-5 right-5 w-6 h-6 rounded-full bg-accent border-4 border-background shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
            />
          </motion.div>

          {/* Text Content Section */}
          <div className="text-center md:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="inline-block text-xs font-mono text-accent tracking-[0.4em] uppercase bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-6">
                Minecraft Server Developer
              </span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-bold font-mono tracking-tighter mb-4 text-white drop-shadow-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              NotDimension
            </motion.h1>

            <motion.p 
              className="text-muted-foreground text-lg md:text-xl max-w-md mb-8 leading-relaxed font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Building communities, configuring servers, and crafting exceptional 
              Minecraft experiences from South Africa.
            </motion.p>

            {/* Badges/Info */}
            <motion.div 
              className="flex items-center gap-6 justify-center md:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground group cursor-default">
                <MapPin className="w-4 h-4 text-accent transition-transform group-hover:scale-120" /> 
                <span className="group-hover:text-primary transition-colors">South Africa</span>
              </div>
              
              <div className="w-px h-4 bg-border" />
              
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground group cursor-default">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> 
                <span className="group-hover:text-primary transition-colors">Available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
