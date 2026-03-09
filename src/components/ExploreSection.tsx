import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FolderOpen, Mail, User, ArrowRight } from "lucide-react";

const pages = [
  {
    title: "Projects",
    description: "Live & archived server work — a showcase of Minecraft server projects and technical configurations.",
    icon: FolderOpen,
    path: "/projects",
  },
  {
    title: "Contact",
    description: "Get in touch — preferred contact methods, response times, and community Discord servers.",
    icon: Mail,
    path: "/contact",
  },
  {
    title: "About Me",
    description: "Background, timeline & interests — my journey, core principles, and personal interests.",
    icon: User,
    path: "/about",
  },
];

const ExploreSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">// Explore More</h2>
          <div className="grid gap-4">
            {pages.map((page, i) => (
              <motion.div
                key={page.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={page.path}
                  className="role-card rounded-xl p-6 flex items-center gap-5 group cursor-pointer block"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <page.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-base mb-1">{page.title}</h3>
                    <p className="text-xs text-muted-foreground">{page.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreSection;
