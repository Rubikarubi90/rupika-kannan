import { motion } from "motion/react";
import type { Skill } from "../types";

const SKILLS: Skill[] = [
  { id: 1, label: "ESL Activity Design", icon: "🎨" },
  { id: 2, label: "Engaging Songs", icon: "🎵" },
  { id: 3, label: "Creative Teaching Methods", icon: "💡" },
  { id: 4, label: "Ice-breaker Activities", icon: "🧊" },
  { id: 5, label: "Fluency Development", icon: "🗣️" },
  { id: 6, label: "Lesson Planning", icon: "📋" },
  { id: 7, label: "Spoken English Training", icon: "🎤" },
  { id: 8, label: "Classroom Management", icon: "🏫" },
  { id: 9, label: "Student Engagement", icon: "✨" },
  { id: 10, label: "Confidence Building", icon: "🌟" },
  { id: 11, label: "Communication Skills", icon: "💬" },
  { id: 12, label: "School Programs", icon: "📚" },
  { id: 13, label: "Bulletin Board Designer", icon: "📌" },
];

const HIGHLIGHTS = [
  {
    icon: "🎯",
    title: "Student-Centered",
    desc: "Each session is designed around individual learner needs and goals.",
  },
  {
    icon: "🚀",
    title: "Results-Driven",
    desc: "Measurable fluency improvement tracked across every student cohort.",
  },
  {
    icon: "🌍",
    title: "Real-World Ready",
    desc: "English skills applied to daily life, academic, and professional scenarios.",
  },
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      data-ocid="skills.section"
      className="section-grey section-padding"
    >
      <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            What I Do Best
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Skills &amp; Expertise
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            A blend of modern teaching methodologies and deep English language
            expertise — designed to make every learner thrive.
          </p>
        </motion.div>

        {/* Skill pills — staggered pop-in */}
        <div className="flex flex-wrap justify-center gap-3">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.id}
              data-ocid={`skills.item.${i + 1}`}
              initial={{ opacity: 0, scale: 0.78 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
                delay: i * 0.055,
              }}
              whileHover={{ scale: 1.08, y: -3 }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-foreground text-sm font-medium shadow-xs hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-card cursor-default transition-smooth"
            >
              <span role="img" aria-label={skill.label}>
                {skill.icon}
              </span>
              {skill.label}
            </motion.div>
          ))}
        </div>

        {/* Highlight strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
                delay: 0.2 + i * 0.1,
              }}
              className="flex flex-col items-center text-center bg-card rounded-2xl border border-border p-6 shadow-xs hover-lift"
            >
              <span className="text-4xl mb-3">{item.icon}</span>
              <h4 className="font-semibold text-foreground mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
