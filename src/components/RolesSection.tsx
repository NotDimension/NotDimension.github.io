import { motion } from "framer-motion";
import { ExternalLink, Users, Crown, Shield, Star } from "lucide-react";
import { useDiscordInvite, formatMembers } from "@/hooks/useDiscordInvite";
import { currentRoles, previousRoles, type RoleEntry } from "@/data/roles";

const roleIcon = (role: string) => {
  if (role.includes("Owner")) return Crown;
  if (role.includes("Admin") || role.includes("Manager") || role.includes("Overseer")) return Shield;
  return Star;
};

const RoleCard = ({ role, index }: { role: RoleEntry; index: number }) => {
  const RoleIcon = roleIcon(role.role);
  const live = useDiscordInvite(role.discord);
  const iconSrc = live?.iconUrl || role.icon;
  const displayName = live?.name || role.name;
  const memberLabel = live?.memberCount != null ? formatMembers(live.memberCount) : role.members;
  return (
    <motion.a
      href={role.discord}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="role-card rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-5 group cursor-pointer min-w-0"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary ring-1 ring-border group-hover:ring-primary/30 transition-all">
        <img
          src={iconSrc}
          alt={displayName}
          width="64"
          height="64"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith(role.icon)) img.src = role.icon;
          }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground text-base truncate">{displayName}</h3>
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
          <span className="text-xs font-mono">{memberLabel} members</span>
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
