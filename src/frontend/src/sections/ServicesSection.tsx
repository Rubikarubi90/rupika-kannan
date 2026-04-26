import { motion } from "motion/react";
import type { Service } from "../types";

const SERVICES: Service[] = [
  {
    id: 1,
    icon: "🎤",
    title: "Spoken English Classes",
    description:
      "Structured spoken English courses focused on clarity, fluency, and confident everyday communication for students of all ages.",
  },
  {
    id: 2,
    icon: "🔤",
    title: "Phonics Training for Kids",
    description:
      "Targeted phonics training using proven techniques to help young learners read, write, and pronounce English with accuracy.",
  },
  {
    id: 3,
    icon: "🎨",
    title: "ESL Activity Sessions",
    description:
      "Engaging English as a Second Language sessions using creative activities, songs, and games to make learning enjoyable.",
  },
  {
    id: 4,
    icon: "🏫",
    title: "School Training Programs",
    description:
      "Comprehensive English language programs tailored for schools and institutions — scalable to any class size or grade level.",
  },
  {
    id: 5,
    icon: "👤",
    title: "One-on-One Coaching",
    description:
      "Personalized coaching sessions addressing specific English challenges, pronunciation, grammar, or interview preparation.",
  },
  {
    id: 6,
    icon: "📱",
    title: "Online Demo Class",
    description:
      "A free introductory online class to experience the teaching style and find the right learning path for your goals.",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      data-ocid="services.section"
      className="section-white section-padding"
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
            What I Offer
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Services
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Flexible programs designed for students, parents, schools, and
            institutions looking for quality English education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              data-ocid={`services.item.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.07 }}
              whileHover={{
                rotateX: 3,
                rotateY: -3,
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-xs cursor-default group"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-smooth group-hover:bg-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-2xl">{service.icon}</span>
              </motion.div>
              <h3 className="font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Not sure where to start? Book a free demo class and find out.
          </p>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="services.book_demo_button"
            className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold btn-shimmer animate-cta-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Book a Free Demo Class
          </button>
        </motion.div>
      </div>
    </section>
  );
}
