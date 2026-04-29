import { motion } from "framer-motion";
import { ExternalLink, Users, Crown, Shield, Star } from "lucide-react";

interface Role {
  name: string;
  role: string;
  members: string;
  icon: string;
  discord: string;
  description?: string;
}

const roleIcon = (role: string) => {
  if (role.includes("Owner")) return Crown;
  if (role.includes("Admin") || role.includes("Manager") || role.includes("Overseer")) return Shield;
  return Star;
};

const currentRoles: Role[] = [
  { name: "SMP Finder", role: "Admin/SRA", members: "45k", icon: "/images/icons/smpfinder.png", discord: "https://discord.gg/pQ8tvD533J", description: "Helping players find and join the best SMP servers." },
  { name: "ShadySMP", role: "Co-Owner", members: "450", icon: "/images/icons/shady.png", discord: "https://discord.gg/Jg48d8xbcD", description: "A community-oriented SMP with custom plugins, events, and a growing player base." },
];

const previousRoles: Role[] = [
  
  { name: "ShatterMC", role: "Senior Admin", members: "260", icon: "/images/icons/shatter.png", discord: "https://discord.gg/sfSnvmtFfA", description: "Managed server operations and staff coordination." },
  { name: "OceanMC", role: "Owner", members: "300", icon: "/images/icons/ocean.png", discord: "https://discord.gg/YEgAUe8UMp", description: "Founded and managed a custom ocean-themed SMP." },
  { name: "SteakySMP (Now RambleSMP)", role: "Co-Owner", members: "2k", icon: "/images/icons/steaky.png", discord: "https://discord.gg/nGVcVzK6", description: "Co-managed a large community SMP with events and plugins." },
  { name: "BonkMC", role: "Moderator", members: "7k", icon: "/images/icons/bonk.png", discord: "https://discord.gg/XV4EGPxHqc", description: "Moderated one of the larger community servers." },
  { name: "Nebular SMP", role: "Overseer/Co-Owner", members: "200", icon: "/images/icons/nebular.png", discord: "https://discord.gg/YYwWMXxKAz", description: "Oversaw server operations and community growth." },
  { name: "Discord Collective", role: "Manager", members: "120", icon: "/images/icons/collective.png", discord: "https://discord.gg/nUMJ52Pycj", description: "A server focused on community and events with engaged members." },
  { name: "Shade Network", role: "Owner", members: "350", icon: "/images/icons/shade.png", discord: "https://discord.gg/yRSHNEnb7Z", description: "A community-oriented Network with Economy and Lifesteal gamemodes." },
  { name: "Prism SMP", role: "Staff Manager", members: "800", icon: "/images/icons/prism.png", discord: "https://discord.gg/cVBDxNxP5c", description: "Led a thriving SMP community with custom gameplay systems." },
  { name: "Echo Network", role: "Helper", members: "4k", icon: "/images/icons/echo.png", discord: "https://discord.gg/fVZPJuEcaQ", description: "A economy server based in NA! Helped with tickets and reports." },
];

const RoleCard = ({ role, index }: { role: Role; index: number }) => {
  const RoleIcon = roleIcon(role.role);
  return (
    <motion.a
      href={role.discord}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="role-card rounded-xl p-6 flex items-start gap-5 group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary ring-1 ring-border group-hover:ring-primary/30 transition-all">
        <img src={role.icon} alt={role.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground text-base truncate">{role.name}</h3>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <RoleIcon className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm text-primary font-mono font-medium">{role.role}</span>
        </div>
        {role.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{role.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{role.members} members</span>
        </div>
      </div>
    </motion.a>
  );
};

const RolesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Current Roles</h2>
          <div className="grid gap-4 mb-20">
            {currentRoles.map((role, i) => (
              <RoleCard key={role.name} role={role} index={i} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Previous Roles</h2>
          <div className="grid gap-4">
            {previousRoles.map((role, i) => (
              <RoleCard key={role.name} role={role} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RolesSection;
