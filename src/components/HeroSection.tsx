import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Central Emerald Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(155_100%_45%/0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          
          {/* PROFILE IMAGE CONTAINER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Soft Ambient Glow behind the profile */}
            <div className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl animate-pulse" />
            
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-accent/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <img
                src="/images/profile.png"
                alt="NotDimension"
                className="w-full h-full object-cover"
              />
            </div>

            {/* STATUS DOT - Pinned to the profile image specifically */}
            <div className="absolute bottom-6 right-6 w-6 h-6 rounded-full bg-accent border-4 border-[#030d08] shadow-[0_0_15px_rgba(16,185,129,0.6)] z-20" />
          </motion.div>

          {/* TEXT CONTENT */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-block text-xs font-mono text-accent tracking-[0.4em] uppercase bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-6">
                Minecraft Server Developer
              </span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-bold font-mono tracking-tighter mb-4 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              NotDimension
            </motion.h1>

            <motion.p 
              className="text-muted-foreground text-lg md:text-xl max-w-md mb-8 leading-relaxed font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Building communities, configuring servers, and crafting exceptional 
              Minecraft experiences from South Africa.
            </motion.p>

            {/* INFO BADGES */}
            <motion.div 
              className="flex items-center gap-6 text-sm font-mono text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2 group cursor-default">
                <MapPin className="w-4 h-4 text-accent transition-transform group-hover:scale-110" /> 
                <span className="group-hover:text-primary transition-colors">South Africa</span>
              </div>
              
              <div className="w-px h-4 bg-border/50" />
              
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> 
                <span className="group-hover:text-primary transition-colors">Available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* SCROLL INDICATOR */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
