import { m } from "framer-motion";

const socials = [
  { name: "Discord", url: "https://discord.com/users/753556348784083024", icon: "https://cdn.simpleicons.org/discord/000000" },
  { name: "YouTube", url: "https://www.youtube.com/@NotDimension", icon: "https://cdn.simpleicons.org/youtube/000000" },
  { name: "Spotify", url: "https://open.spotify.com/user/31z2sjm4nmep3ecjeibav25czjsa", icon: "https://cdn.simpleicons.org/spotify/000000" },
  { name: "Steam", url: "https://steamcommunity.com/id/notdimension", icon: "https://cdn.simpleicons.org/steam/000000" },
  { name: "GitHub", url: "https://github.com/NotDimension", icon: "https://cdn.simpleicons.org/github/000000" },
  { name: "NameMC", url: "https://namemc.com/profile/NotDimension.1", icon: "https://cdn.simpleicons.org/namemc/000000" },
];

const ConnectSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <m.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-sm font-mono text-primary mb-10 tracking-widest uppercase">
            // Connect With Me
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socials.map((social, i) => (
              <m.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="glass-card rounded-lg px-5 py-3 flex items-center gap-3 group transition-all duration-300 cursor-pointer"
              >
                <img src={social.icon} alt={social.name} width="16" height="16" loading="lazy" decoding="async" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm font-mono text-secondary-foreground group-hover:text-foreground transition-colors">
                  {social.name}
                </span>
              </m.a>
            ))}
          </div>
        </m.div>

      </div>
    </section>
  );
};

export default ConnectSection;
