import { motion } from "framer-motion";
import { Heart, Music, Gamepad2, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const principles = [
  "Community-first decision making",
  "Transparency in communication",
  "Continuous learning & improvement",
  "High-quality, stable technical infrastructure",
];

const timeline = [
  { month: "May 2025", events: ["Started first moderation role, learning community dynamics"] },
  { month: "June 2025", events: ["Joined CashflowSMP as Owner"] },
  { month: "July 2025", events: ["Joined PrismSMP as Admin"] },
  { month: "August 2025", events: ["Promoted to Owner at PrismSMP", "Created OceanMC", "Joined Nebular SMP as Overseer"] },
  { month: "September 2025", events: ["Promoted to Co-Owner at Nebular SMP", "SMP Finder: Promoted to Senior Moderator"] },
  { month: "October 2025", events: ["Left Nebular SMP"] },
  { month: "November 2025", events: ["ShatterMC: Jr. Mod → Sr. Admin (left 20th Nov)", "Became Co-Owner at ShadySMP (25th Nov)"] },
  { month: "December 2025", events: ["Closed OceanMC", "Left PrismSMP", "Promoted to Manager at Discord Collective"] },
  { month: "Ongoing", events: ["Currently Co-Owner at ShadySMP"] },
];

const interests = [
  { icon: Music, title: "Music", items: ["Favourite artist: Brent Faiyaz", "Genres: RNB, Lo-fi & Piano"] },
  { icon: Gamepad2, title: "Gaming", items: ["Terraria, FIFA22, Cricket22", "Minecraft SMPs for creativity"] },
  { icon: Trophy, title: "Sports", items: ["Cricket, Football & Rugby", "Following leagues & staying active"] },
];

const About = () => (
  <div className="page-container noise-overlay relative z-10 min-h-screen">
    <PageHeader title="About Me" subtitle="My journey, core principles, and personal interests beyond Minecraft." />
    <div className="px-4 pb-24">
      <div className="container max-w-3xl mx-auto space-y-20">
        {/* Background */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Background</h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            className="text-secondary-foreground leading-relaxed mb-8"
          >
            I've been managing Minecraft servers for several months, starting as a community helper and progressing to server ownership and senior roles. My focus has always been on creating engaging, harmonious environments where players can enjoy the game together.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {principles.map((p, i) => (
              <motion.div key={p}
                initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                className="flex items-center gap-3 py-3 px-4 rounded-lg bg-secondary/30"
              >
                <Heart className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-sm text-secondary-foreground">{p}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Journey</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-px timeline-line" />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div key={t.month}
                  initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="relative"
                >
                  <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full timeline-dot" />
                  <h3 className="text-sm font-mono font-semibold text-foreground mb-1">{t.month}</h3>
                  <ul className="space-y-1">
                    {t.events.map(e => (
                      <li key={e} className="text-xs text-muted-foreground">• {e}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Beyond Servers</h2>
          <div className="grid gap-4">
            {interests.map((int, i) => (
              <motion.div key={int.title}
                initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <int.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm mb-2">{int.title}</h3>
                    <ul className="space-y-1">
                      {int.items.map(item => (
                        <li key={item} className="text-xs text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default About;
