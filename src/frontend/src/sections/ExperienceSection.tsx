import { Building2, Calendar, Image, Users, X } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  target: number;
  suffix?: string;
  start?: number;
  duration?: number;
}

function CountUp({
  target,
  suffix = "",
  start = 50,
  duration = 2500,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(start);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setCount(Math.floor(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [isInView, target, start, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface PosterLightboxProps {
  src: string;
  alt: string;
  label: string;
  ocid: string;
}

function PosterThumbnail({ src, alt, label, ocid }: PosterLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        data-ocid={ocid}
        onClick={() => setOpen(true)}
        className="group flex flex-col items-center gap-2 focus:outline-none"
        aria-label={`View ${label}`}
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 shadow-md group-hover:border-primary group-hover:shadow-lg transition-all duration-200">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center">
            <Image className="w-5 h-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        <span className="text-xs font-medium text-primary">{label}</span>
      </button>

      {/* Lightbox modal */}
      {open && (
        <dialog
          open
          className="fixed inset-0 z-50 m-0 flex h-full w-full items-center justify-center bg-transparent p-4"
          aria-label={label}
          data-ocid={`${ocid}_modal`}
          onClose={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            role="presentation"
          />
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 max-w-lg w-full bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="font-semibold text-sm text-foreground">
                {label}
              </span>
              <button
                type="button"
                data-ocid={`${ocid}_close_button`}
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close poster"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <img
              src={src}
              alt={alt}
              className="w-full h-auto max-h-[75vh] object-contain"
            />
          </motion.div>
        </dialog>
      )}
    </>
  );
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      data-ocid="experience.section"
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
            Professional Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Experience
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Real-world teaching experience with measurable impact on student
            outcomes.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Indo Euro Organization */}
          <motion.div
            data-ocid="experience.item.1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden hover-lift"
          >
            <div className="bg-primary px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-primary-foreground">
                  Indo Euro Organization
                </h3>
                <p className="text-primary-foreground/70 text-sm mt-0.5">
                  India
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5" />
                2024 – 2026
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-border">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Workplace
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Senthil Matric Higher Secondary School
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-3 mb-5">
                {[
                  "Conducted interactive Spoken English and confidence-building sessions",
                  "Delivered comprehensive Phonics training to primary and middle school students",
                  "Designed engaging ESL activities — songs, games, and ice-breaker exercises",
                  "Measured and tracked fluency improvement across 600+ learners",
                  "Collaborated with school faculty on English language curriculum planning",
                ].map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Count-up badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  type: "spring",
                  stiffness: 200,
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/8 text-primary w-fit"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  <CountUp
                    target={600}
                    suffix="+ students mentored"
                    start={50}
                    duration={2500}
                  />
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Summer Camp */}
          <motion.div
            data-ocid="experience.item.2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden hover-lift"
          >
            <div className="bg-primary px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-primary-foreground">
                  Summer Camp Facilitator
                </h3>
                <p className="text-primary-foreground/70 text-sm mt-0.5">
                  Dharmapuri, India
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5" />
                2025 – 2026
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Successfully conducting summer camps for the past 2 years,
                fostering knowledge and actively engaging young minds.
              </p>

              {/* Poster thumbnails */}
              <div className="border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                  Session Posters
                </p>
                <div className="flex items-center gap-6">
                  <PosterThumbnail
                    src="/assets/summer-camp-2026.png"
                    alt="Summer Camp 2026 Poster"
                    label="2026 Poster"
                    ocid="experience.summer_camp_2026_poster"
                  />
                  <PosterThumbnail
                    src="/assets/summer-camp-2025.png"
                    alt="Summer Camp 2025 Poster"
                    label="2025 Poster"
                    ocid="experience.summer_camp_2025_poster"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
