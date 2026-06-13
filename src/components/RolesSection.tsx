import { m } from "framer-motion";
import { ExternalLink, Users, Crown, Shield, Star } from "lucide-react";
import { useDiscordInvite, formatMembers } from "@/hooks/useDiscordInvite";
import { useImagePalette } from "@/hooks/useImagePalette";
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
  const isPlaceholder = iconSrc === "/placeholder.svg";
  const palette = useImagePalette(isPlaceholder ? undefined : iconSrc);
  const bannerStyle: React.CSSProperties = live?.bannerUrl && !role.noBanner
    ? {
        backgroundImage: `url(${live.bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage: palette
          ? `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
          : `linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%)`,
      };
  return (
    <m.a
      href={role.discord}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="role-card rounded-xl overflow-hidden flex flex-col group cursor-pointer min-w-0"
    >
      <div
        className="relative w-full aspect-[7/2]"
        style={bannerStyle}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </div>
      <div className="flex items-start gap-3 sm:gap-5 p-4 sm:p-6 -mt-8 sm:-mt-10 relative">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary ring-2 ring-card transition-all duration-300 hover:scale-[1.06] hover:ring-accent/50 hover:shadow-[0_0_22px_hsl(var(--accent)/0.3)]">
          <img
            src={iconSrc}
            alt={displayName}
            width="64"
            height="64"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.endsWith(role.icon)) img.src = role.icon;
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pt-6 sm:pt-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground text-base truncate">{displayName}</h3>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <RoleIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm text-primary font-mono font-medium">{role.role}</span>
          </div>
          {(live?.description || role.description) && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{live?.description || role.description}</p>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{memberLabel} members</span>
          </div>
        </div>
      </div>
    </m.a>
  );
};

const RolesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <m.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-sm font-mono mb-8 tracking-widest uppercase">// Current Roles</h2>
          <div className="grid gap-4 mb-20">
            {currentRoles.map((role, i) => (
              <RoleCard key={role.name} role={role} index={i} />
            ))}
          </div>
        </m.div>

        <m.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-sm font-mono mb-8 tracking-widest uppercase">// Previous Roles</h2>
          <div className="grid gap-4">
            {previousRoles.map((role, i) => (
              <RoleCard key={role.name} role={role} index={i} />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default RolesSection;
