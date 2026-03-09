import { motion } from "framer-motion";
import { ExternalLink, Users, Wrench, BookOpen, Archive } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const liveProjects = [
  { name: "ShadySMP", role: "Co‑Owner", members: "450+", icon: "/images/icons/shady.png", discord: "https://discord.gg/Jg48d8xbcD", desc: "A community‑oriented SMP with custom plugins, events, and a growing player base." },
  { name: "SMP Finder", role: "Senior Moderator", members: "27k+", icon: "/images/icons/smpfinder.png", discord: "https://discord.gg/cuP8bPZgYv", desc: "A large Discord server helping players find, partner, and join SMPs." },
  { name: "Discord Collective", role: "Manager", members: "60+", icon: "/images/icons/collective.png", discord: "https://discord.gg/nUMJ52Pycj", desc: "A server focused on Community and Events with engaged members." },
];

const technicalCreations = [
  { title: "Plugin Configurations", desc: "Custom YAML & JSON configurations for plugins like EssentialsX, LuckPerms, and more.", tags: ["Economy", "Ranks", "Custom Items"] },
  { title: "Custom Documentation", desc: "Comprehensive server guides, staff handbooks, and community rules used across multiple SMPs.", tags: ["Guides", "Handbooks"] },
];

const archivedProjects = [
  { name: "Prism SMP", role: "Owner", members: "700", icon: "/images/icons/prism.png", note: "Left in November 2025" },
  { name: "OceanMC", role: "Owner", members: "300", icon: "/images/icons/ocean.png", note: "Closed in December 2025" },
  { name: "SteakySMP", role: "Co‑Owner", members: "1.5k", icon: "/images/icons/steaky.png", note: "Left in October 2025" },
  { name: "ShatterMC", role: "Senior Admin", members: "260", icon: "/images/icons/shatter.png", note: "Left in November 2025" },
  { name: "BonkMC", role: "Moderator", members: "4.6k", icon: "/images/icons/bonk.png", note: "Left in December 2025" },
  { name: "Nebular SMP", role: "Co-Owner", members: "200", icon: "/images/icons/nebular.png", note: "Left in October 2025" },
];

const Projects = () => (
  <div className="page-container noise-overlay relative z-10 min-h-screen">
    <PageHeader title="Projects" subtitle="A showcase of Minecraft server projects I've been involved with." />
    <div className="px-4 pb-24">
      <div className="container max-w-3xl mx-auto space-y-20">
        {/* Live */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Live Projects</h2>
          <div className="grid gap-4">
            {liveProjects.map((p, i) => (
              <motion.a key={p.name} href={p.discord} target="_blank" rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="role-card rounded-xl p-6 flex items-start gap-5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                  <img src={p.icon} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{p.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-primary font-mono mb-1">{p.role}</p>
                  <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3 h-3" /><span className="text-xs font-mono">{p.members} members</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Technical */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Technical Creations</h2>
          <div className="grid gap-4">
            {technicalCreations.map((t, i) => (
              <motion.div key={t.title}
                initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <Wrench className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {t.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Archived */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase flex items-center gap-2">
            <Archive className="w-4 h-4" /> Archived Projects
          </h2>
          <div className="grid gap-3">
            {archivedProjects.map((p, i) => (
              <motion.div key={p.name}
                initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="glass-card rounded-lg p-4 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img src={p.icon} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{p.role} • {p.members} members</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono flex-shrink-0">{p.note}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default Projects;
