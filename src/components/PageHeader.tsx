import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({ title, subtitle, backTo = "/" }: { title: string; subtitle: string; backTo?: string }) => (
  <div className="pt-8 pb-16 px-4">
    <div className="container max-w-3xl mx-auto">
      <m.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </m.div>
      <m.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold mb-3"
      >
        {title}
      </m.h1>
      <m.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-lg"
      >
        {subtitle}
      </m.p>
    </div>
  </div>
);

export default PageHeader;
