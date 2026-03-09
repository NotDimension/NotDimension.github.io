import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-28 px-4 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-sm font-mono text-primary mb-4 tracking-widest uppercase">
            // About Me
          </h2>
          <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
            Minecraft server developer specializing in{" "}
            <span className="text-foreground font-medium border-b border-primary/30">plugin configuration</span>,{" "}
            <span className="text-foreground font-medium border-b border-primary/30">staff management</span>, and{" "}
            <span className="text-foreground font-medium border-b border-primary/30">community engagement</span>.
            Experienced in growing servers from small communities to hundreds of members,
            focusing on creating exceptional gameplay experiences.
          </p>
          
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: "9+", label: "Servers Managed" },
              { value: "35k+", label: "Community Members" },
              { value: "7+", label: "Months Experience" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="text-center py-4 rounded-lg bg-secondary/20 border border-border/50"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary font-mono mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
