import { motion } from "motion/react";

const HIGHLIGHTS = [
  {
    emoji: "🎯",
    title: "Personalized Learning",
    desc: "Every student learns differently. I tailor lessons to individual pace, learning style, and goals for maximum fluency growth.",
  },
  {
    emoji: "🎵",
    title: "Engaging Methods",
    desc: "Songs, games, ice-breaker activities, and real-world simulations make English enjoyable and memorable.",
  },
  {
    emoji: "🔤",
    title: "Phonics & Pronunciation",
    desc: "Structured phonics training gives students a strong foundation in reading and speaking with clarity and precision.",
  },
  {
    emoji: "🏫",
    title: "School & Institution Programs",
    desc: "Proven track record with 600+ students across Senthil Matric Higher Secondary School — ready to scale to any institution.",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      data-ocid="about.section"
      className="section-grey section-padding"
    >
      <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Decorative block — slide in from left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/10" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-primary/8" />
            <div className="relative bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl" role="img" aria-label="Teacher">
                  👩‍🏫
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                About Me
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm Rupika Kannan — a dedicated Communicative English Tutor with
                2+ years of experience empowering students across Dharmapuri,
                India.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Personalized tutoring from{" "}
                <strong className="text-foreground">Dharmapuri, India</strong>,
                focusing on confidence, fluency, and practical communication. My
                teaching philosophy centers on making English approachable, fun,
                and deeply relevant to real life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I am passionate about guiding students toward confident
                communication and care deeply about every learner's success.
              </p>
            </div>
          </motion.div>

          {/* Highlights — fade in from right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                What I Bring
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground mt-2 mb-4">
                Eager to inspire and guide students towards confident
                communication
              </h3>
            </div>

            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.1 + i * 0.08,
                }}
                whileHover={{ x: 4 }}
                className="flex gap-4 bg-card rounded-xl p-4 border border-border hover-lift"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">
                  {item.emoji}
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
