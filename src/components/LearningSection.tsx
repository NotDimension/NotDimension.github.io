import { m } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

const courses = [
  {
    title: "MOOC Java Programming I & II",
    description: "Learning Java programming through comprehensive online courses.",
    eta: "3 months",
    url: "https://java-programming.mooc.fi/",
  },
  {
    title: "Object-Oriented Java Course",
    description: "Developing object-oriented programming skills in Java.",
    eta: "2 months",
    url: "https://www.coursera.org/learn/object-oriented-java",
  },
];

const LearningSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <m.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary mb-8 tracking-widest uppercase">
            // Currently Learning
          </h2>
          <div className="grid gap-3">
            {courses.map((course, i) => (
              <m.a
                key={course.title}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-lg p-5 group transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{course.title}</h3>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
                    <span className="inline-block text-xs font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
                      ETA: {course.eta}
                    </span>
                  </div>
                </div>
              </m.a>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default LearningSection;
