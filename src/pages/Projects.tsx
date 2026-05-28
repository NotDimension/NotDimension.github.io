import { m } from "framer-motion";
import { ExternalLink, Users, Wrench, Archive } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { currentRoles } from "@/data/roles";
import { useDiscordInvite, formatMembers } from "@/hooks/useDiscordInvite";

const liveProjects = currentRoles.map((r) => ({
  name: r.name,
  role: r.role,
  members: r.members,
  icon: r.icon,
  discord: r.discord,
  desc: r.description ?? "",
}));

const technicalCreations = [
  { title: "Plugin Configurations", desc: "Custom YAML & JSON configurations for plugins like EssentialsX, LuckPerms, and more.", tags: ["Economy", "Ranks", "Custom Items"] },
  { title: "Custom Documentation", desc: "Comprehensive server guides, staff handbooks, and community rules used across multiple SMPs.", tags: ["Guides", "Handbooks"] },
];

const archivedProjects = [
  { name: "OceanMC", role: "Owner", members: "300", icon: "/images/icons/ocean.png", note: "Closed in December 2025" },
  { name: "SteakySMP", role: "Co‑Owner", members: "1.5k", icon: "/images/icons/steaky.png", note: "Left in October 2025" },
  { name: "ShatterMC", role: "Senior Admin", members: "260", icon: "/images/icons/shatter.png", note: "Left in November 2025" },
  { name: "BonkMC", role: "Moderator", members: "4.6k", icon: "/images/icons/bonk.png", note: "Left in December 2025" },
  { name: "Nebular SMP", role: "Co-Owner", members: "200", icon: "/images/icons/nebular.png", note: "Left in October 2025" },
  { name: "Discord Collective", role: "Manager", members: "60+", icon: "/images/icons/collective.png", note: "Innactive server." },
  { name: "Shade Network", role: "Owner", members: "350", icon: "/images/icons/shade.png", note: "Left Early April 2026" },
  { name: "Prism SMP (Now AxonMC)", role: "Owner/Staff Manager", members: "700", icon: "/images/icons/axon.png", note: "Left Early April 2026" },
  { name: "Echo Network", role: "Helper", members: "4k", icon: "/images/icons/echo.png", note: "Removed due to inactivity." },
];

const LiveProjectCard = ({ p, i }: { p: (typeof liveProjects)[number]; i: number }) => {
  const live = useDiscordInvite(p.discord);
  const iconSrc = live?.iconUrl || p.icon;
  const displayName = live?.name || p.name;
  const memberLabel = live?.memberCount != null ? formatMembers(live.memberCount) : p.members;
  return (
    <m.a
      href={p.discord}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="role-card rounded-xl p-6 flex items-start gap-5 group cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
        <img
          src={iconSrc}
          alt={displayName}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(p.icon)) e.currentTarget.src = p.icon;
          }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground truncate">{displayName}</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">Active</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <p className="text-sm text-primary font-mono mb-1">{p.role}</p>
        {p.desc && <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-3 h-3" />
          <span className="text-xs font-mono">{memberLabel} members</span>
        </div>
      </div>
    </m.a>
  );
};

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
              <LiveProjectCard key={p.name} p={p} i={i} />
            ))}
          </div>
        </section>

        {/* Technical */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Technical Creations</h2>
          <div className="grid gap-4">
            {technicalCreations.map((t, i) => (
              <m.div key={t.title}
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
              </m.div>
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
              <m.div key={p.name}
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
              </m.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default Projects;
