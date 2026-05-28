// Centralized roles/servers data. Static fallbacks used when the Discord
// invite API can't be reached (expired invites, rate limits, etc).

export interface RoleEntry {
  name: string;
  role: string;
  /** Static fallback member count as a string ("45k", "450", "1.5k"). */
  members: string;
  /** Numeric value of the static fallback used for aggregate totals. */
  staticMembers: number;
  /** Local fallback icon shown if the Discord CDN icon is unavailable. */
  icon: string;
  /** Discord invite URL. The hook extracts the code for live data. */
  discord: string;
  description?: string;
  /** Optional note shown in archived/inactive lists. */
  note?: string;
  /** Marks roles that are no longer active (invite may be expired). */
  archived?: boolean;
}

export const currentRoles: RoleEntry[] = [
  { name: "SMP Finder", role: "Admin", members: "48k", staticMembers: 48000, icon: "/images/icons/smpfinder.png", discord: "https://discord.gg/pQ8tvD533J", description: "Helping players find and join the best SMP servers." },
  { name: "smpfinder.com", role: "Moderator", members: "1.3k", staticMembers: 1300, icon: "/images/icons/smpfinder.png", discord: "https://discord.gg/XvKk2W6KXx", description: "Community hub for the smpfinder.com server list — moderating chat and helping members." },
  { name: "ShadySMP", role: "Co-Owner", members: "450", staticMembers: 450, icon: "/images/icons/shady.png", discord: "https://discord.gg/Uq6C8dgP3K", description: "A community-oriented SMP with custom plugins, events, and a growing player base." },
];

export const previousRoles: RoleEntry[] = [
  { name: "ShatterMC", role: "Senior Admin", members: "260", staticMembers: 260, icon: "/images/icons/shatter.png", discord: "https://discord.gg/sfSnvmtFfA", description: "Managed server operations and staff coordination.", archived: true },
  { name: "OceanMC", role: "Owner", members: "300", staticMembers: 300, icon: "/images/icons/ocean.png", discord: "https://discord.gg/YEgAUe8UMp", description: "Founded and managed a custom ocean-themed SMP.", archived: true },
  { name: "SteakySMP (Now RambleSMP)", role: "Co-Owner", members: "2k", staticMembers: 2000, icon: "/images/icons/steaky.png", discord: "https://discord.gg/nGVcVzK6", description: "Co-managed a large community SMP with events and plugins.", archived: true },
  { name: "BonkMC", role: "Moderator", members: "6k", staticMembers: 6000, icon: "/images/icons/bonk.png", discord: "https://discord.gg/XV4EGPxHqc", description: "Moderated one of the larger community servers." },
  { name: "Nebular SMP", role: "Overseer/Co-Owner", members: "200", staticMembers: 200, icon: "/images/icons/nebular.png", discord: "https://discord.gg/YYwWMXxKAz", description: "Oversaw server operations and community growth.", archived: true },
  { name: "Discord Collective", role: "Manager", members: "120", staticMembers: 120, icon: "/images/icons/collective.png", discord: "https://discord.gg/nUMJ52Pycj", description: "A server focused on community and events with engaged members." },
  { name: "Shade Network", role: "Owner", members: "350", staticMembers: 350, icon: "/images/icons/shade.png", discord: "https://discord.gg/yRSHNEnb7Z", description: "A community-oriented Network with Economy and Lifesteal gamemodes." },
  { name: "Prism SMP (Now AxonMC)", role: "Owner/Staff Manager", members: "800", staticMembers: 800, icon: "/images/icons/axon.png", discord: "https://discord.gg/cVBDxNxP5c", description: "Led a thriving SMP community with custom gameplay systems.", archived: true },
  { name: "Echo Network", role: "Helper", members: "4k", staticMembers: 4000, icon: "/images/icons/echo.png", discord: "https://discord.gg/fVZPJuEcaQ", description: "An economy server based in NA! Helped with tickets and reports." },
];

export const allRoles: RoleEntry[] = [...currentRoles, ...previousRoles];

/** Sum of the static fallback counts, used until live data resolves. */
export const staticTotalMembers = allRoles.reduce((sum, r) => sum + r.staticMembers, 0);
