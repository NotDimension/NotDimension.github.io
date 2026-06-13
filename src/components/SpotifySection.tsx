import { m } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const useIsDark = () => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

const SpotifySection = () => {
  const isDark = useIsDark();
  const themeParam = isDark ? "" : "&theme=0";
  const artistSrc = `https://open.spotify.com/embed/artist/3tlXnStJ1fFhdScmQeLpuG?utm_source=generator$$${themeParam}`;
  const playlistSrc = `https://open.spotify.com/embed/playlist/7sfUAINykAmpLJOwnUS5Bn?utm_source=generator$$${themeParam}`;
  
  return (
    <section className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <m.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-sm font-mono mb-8 tracking-widest uppercase">
            // What I'm Listening To
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Brent Faiyaz artist embed */}
            <m.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-xl p-6 space-y-4"
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
                  key={artistSrc}
                  src={artistSrc}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg w-full"
                  title="Brent Faiyaz on Spotify"
                />
              </div>
            </m.div>

            {/* Lo-fi / chill playlist embed */}
            <m.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Dimensions Playlist</h3>
                  <p className="text-xs text-muted-foreground">My Own Custom Playlist :D</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  key={playlistSrc}
                  src={playlistSrc}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg w-full"
                  title="Lo-fi playlist on Spotify"
                />
              </div>
            </m.div>
          </div>

          {/* Spotify profile link */}
          <m.a
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
              src={isDark ? "https://cdn.simpleicons.org/spotify/ffffff" : "https://cdn.simpleicons.org/spotify/000000"}
              alt="Spotify"
              width="16"
              height="16"
              loading="lazy"
              decoding="async"
              className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
            />
            View my Spotify profile
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </m.a>
        </m.div>
      </div>
    </section>
  );
};

export default SpotifySection;
