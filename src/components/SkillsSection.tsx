import { motion } from "framer-motion";
import {
  Server, Users, MessageSquare, Wrench, FileText, Palette,
  Settings, BookOpen, BarChart3, Calendar, Shield, Zap,
} from "lucide-react";

const coreSkills = [
  { icon: Server, label: "Server Administration", desc: "Setting up, maintaining, and optimizing Minecraft servers for peak performance" },
  { icon: Users, label: "Staff Management", desc: "Recruiting, training, and coordinating moderation teams across multiple servers" },
  { icon: MessageSquare, label: "Community Engagement", desc: "Building active communities through events, announcements, and player interaction" },
  { icon: Wrench, label: "Plugin Configuration", desc: "Custom YAML & JSON configs for EssentialsX, LuckPerms, and 20+ other plugins" },
  { icon: FileText, label: "Logs & Documentation", desc: "Server log analysis, debugging, and creating comprehensive staff handbooks" },
  { icon: Palette, label: "Graphic Design", desc: "Creating banners, logos, promotional materials, and server branding assets" },
];

const dailyTasks = [
  { icon: Settings, text: "Server maintenance & monitoring" },
  { icon: Shield, text: "Staff coordination & training" },
  { icon: Zap, text: "Plugin installation & configuration" },
  { icon: Calendar, text: "Community events & engagement" },
  { icon: BarChart3, text: "Server logs analysis & debugging" },
  { icon: BookOpen, text: "Creating guides & promo materials" },
];

const SkillsSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Skills & Expertise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {coreSkills.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <skill.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{skill.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Daily Responsibilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dailyTasks.map((task, i) => (
              <motion.div
                key={task.text}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-3 py-3 px-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <task.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-secondary-foreground">{task.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
