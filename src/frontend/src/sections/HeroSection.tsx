import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function CountUp({ target, suffix = "", duration = 2500 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function startAnimation() {
      if (started.current) return;
      started.current = true;

      const start = Math.min(50, Math.floor(target * 0.08));
      const startTime = performance.now();

      function update(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
        const current = Math.floor(start + (target - start) * eased);
        setCount(current);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(update);
        } else {
          setCount(target);
        }
      }

      rafId.current = requestAnimationFrame(update);
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === "undefined") {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );

    observer.observe(el);

    // Fallback: if already in viewport (e.g. page just loaded), fire immediately
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0;
    if (inView) {
      observer.disconnect();
      startAnimation();
    }

    return () => {
      observer.disconnect();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration]);

  const display = count >= target ? target : count;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const HERO_DOTS = [
  { size: 8, top: "12%", left: "6%", duration: "5s", delay: "0s" },
  { size: 5, top: "22%", left: "85%", duration: "7s", delay: "1s" },
  { size: 10, top: "68%", left: "9%", duration: "6.5s", delay: "2s" },
  { size: 6, top: "78%", left: "82%", duration: "4.5s", delay: "0.5s" },
  { size: 7, top: "45%", left: "92%", duration: "8s", delay: "1.5s" },
  { size: 4, top: "55%", left: "3%", duration: "6s", delay: "3s" },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-[calc(100vh-4rem)] flex items-center section-white overflow-hidden"
      style={{
        backgroundImage: "url(/assets/generated/hero-bg.dim_1200x600.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-card/85 backdrop-blur-[2px]" />

      {/* Floating hero dots */}
      {HERO_DOTS.map((dot) => (
        <div
          key={dot.top + dot.left}
          className="hero-dot pointer-events-none"
          style={{
            width: dot.size,
            height: dot.size,
            top: dot.top,
            left: dot.left,
            ["--duration" as string]: dot.duration,
            ["--delay" as string]: dot.delay,
          }}
        />
      ))}

      <div className="relative z-10 container-wide px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-10 md:py-14">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-5">
                Communicative English Tutor
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Empowering students with{" "}
              <span className="text-primary">confident English</span>{" "}
              communication
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg"
            >
              Personalized Spoken English, Phonics, and ESL training from
              Dharmapuri, India — designed to build fluency, confidence, and
              real-world communication skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                data-ocid="hero.book_demo_button"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base animate-cta-pulse btn-shimmer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a Demo Class
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                data-ocid="hero.learn_more_button"
                className="px-6 py-3 rounded-lg border border-border bg-card text-foreground font-semibold text-base transition-smooth hover:bg-muted hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Learn About My Approach
              </button>
            </motion.div>

            {/* Stats with count-up */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex gap-8"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary font-display">
                  <CountUp target={600} suffix="+" duration={2500} />
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Students Mentored
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary font-display">
                  <CountUp target={2} suffix="+" duration={1500} />
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Years Experience
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary font-display">
                  <CountUp target={5} suffix="+" duration={1200} />
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Programs Offered
                </span>
              </div>
            </motion.div>
          </div>

          {/* Profile Image — floating animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-primary/15 blur-xl" />
              <motion.img
                src="/assets/generated/rupika-profile.dim_400x400.jpg"
                alt="Rupika Kannan — Communicative English Tutor in Dharmapuri"
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full object-cover shadow-lifted border-4 border-card"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 -right-2 bg-card rounded-xl px-3 py-2 shadow-lifted border border-border">
                <p className="text-xs font-semibold text-primary">
                  Indo Euro Organization
                </p>
                <p className="text-xs text-muted-foreground">2024 – 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
