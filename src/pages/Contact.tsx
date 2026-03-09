import { motion } from "framer-motion";
import { MessageSquare, Mail, Clock, Users, ExternalLink } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const responseTimes = [
  { label: "Discord (Active)", time: "Within minutes", color: "text-primary" },
  { label: "Discord (Off-peak)", time: "Within hours", color: "text-accent" },
  { label: "Email", time: "1–2 days", color: "text-muted-foreground" },
];

const communities = [
  { name: "ShadySMP", role: "Co-Owner", members: "450", icon: "/images/icons/shady.png", discord: "https://discord.gg/Jg48d8xbcD" },
  { name: "Discord Collective", role: "Manager", members: "60", icon: "/images/icons/collective.png", discord: "https://discord.gg/nUMJ52Pycj" },
];

const Contact = () => (
  <div className="page-container noise-overlay relative z-10 min-h-screen">
    <PageHeader title="Get In Touch" subtitle="Have a question or want to collaborate? I'm always open to connecting." />
    <div className="px-4 pb-24">
      <div className="container max-w-3xl mx-auto space-y-20">
        {/* Contact methods */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Ways to Reach Me</h2>
          <div className="grid gap-4">
            <motion.a href="https://discord.com/users/753556348784083024" target="_blank" rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
              className="role-card rounded-xl p-6 group cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">Discord</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">Recommended</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">The best way to contact me. I'm active daily and respond quickly.</p>
                  <code className="text-sm font-mono text-foreground">notdimension</code>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </motion.a>

            <motion.a href="mailto:notdimension@gmail.com"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="role-card rounded-xl p-6 group cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">Email</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">For formal inquiries</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">For formal communication. Responses may take 1-2 business days.</p>
                  <code className="text-sm font-mono text-foreground">notdimension@gmail.com</code>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </motion.a>
          </div>
        </section>

        {/* Response times */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Response Times</h2>
          <div className="grid grid-cols-3 gap-3">
            {responseTimes.map((r, i) => (
              <motion.div key={r.label}
                initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <Clock className="w-4 h-4 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                <p className={`text-sm font-mono font-semibold ${r.color}`}>{r.time}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Communities */}
        <section>
          <h2 className="text-sm font-mono text-primary mb-6 tracking-widest uppercase">// Find Me In These Communities</h2>
          <div className="grid gap-3">
            {communities.map((c, i) => (
              <motion.a key={c.name} href={c.discord} target="_blank" rel="noopener noreferrer"
                initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="role-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img src={c.icon} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-sm">{c.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{c.role} • {c.members} members</p>
                </div>
                <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default Contact;
