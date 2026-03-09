import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

const SpotifySection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">
            // What I'm Listening To
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Brent Faiyaz artist embed */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Favourite Artist</h3>
                  <p className="text-xs text-muted-foreground">Brent Faiyaz</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://open.spotify.com/embed/artist/3tlXnStJ1fFhdScmQeLpuG?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title="Brent Faiyaz on Spotify"
                />
              </div>
            </motion.div>

            {/* Lo-fi / chill playlist embed */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Coding Vibes</h3>
                  <p className="text-xs text-muted-foreground">Lo-fi & RNB</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title="Lo-fi playlist on Spotify"
                />
              </div>
            </motion.div>
          </div>

          {/* Spotify profile link */}
          <motion.a
            href="https://open.spotify.com/user/31z2sjm4nmep3ecjeibav25czjsa"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors group"
          >
            <img
              src="https://cdn.simpleicons.org/spotify/ffffff"
              alt="Spotify"
              className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
            />
            View my Spotify profile
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default SpotifySection;
