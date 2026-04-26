import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { Testimonial } from "../backend";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Star display ─────────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number | bigint }) {
  const n = Number(rating);
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`w-3.5 h-3.5 ${i <= n ? "fill-amber-400 text-amber-400" : "text-border"}`}
        />
      ))}
    </div>
  );
}

// ─── Interactive star picker ──────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="flex gap-1"
      aria-label="Star rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          data-ocid={`testimonials.rating_star.${n}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Star
            aria-hidden="true"
            className={`w-6 h-6 transition-colors duration-150 ${
              n <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-border hover:text-amber-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial: t,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <motion.div
      data-ocid={`testimonials.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
        delay: Math.min(index, 5) * 0.07,
      }}
      className="bg-card rounded-2xl border border-border p-6 shadow-xs hover-lift flex flex-col"
    >
      <StarDisplay rating={t.rating} />
      <p className="text-sm text-muted-foreground leading-relaxed mt-4 flex-1">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">
            {t.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {t.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 5000);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length > 3) start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [testimonials.length, start]);

  const perPage = 3;
  const pages = Math.ceil(testimonials.length / perPage);
  const safeIdx = Math.min(idx, pages - 1);
  const slice = testimonials.slice(
    safeIdx * perPage,
    safeIdx * perPage + perPage,
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {slice.map((t, i) => (
            <TestimonialCard
              key={String(t.id)}
              testimonial={t}
              index={safeIdx * perPage + i}
            />
          ))}
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={`page-dot-${pageNum}`}
              type="button"
              aria-label={`Page ${pageNum}`}
              data-ocid={`testimonials.page_dot.${pageNum}`}
              onClick={() => {
                setIdx(pageNum - 1);
                start();
              }}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                pageNum - 1 === safeIdx
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Thank You Modal ──────────────────────────────────────────────────────────

const SPARKLE_POSITIONS = [
  { tx: "-60px", ty: "-60px" },
  { tx: "0px", ty: "-80px" },
  { tx: "60px", ty: "-60px" },
  { tx: "80px", ty: "0px" },
  { tx: "60px", ty: "60px" },
  { tx: "0px", ty: "80px" },
  { tx: "-60px", ty: "60px" },
  { tx: "-80px", ty: "0px" },
];

function ThankYouModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      onClick={onClose}
      data-ocid="testimonials.thankyou_modal"
    >
      <motion.div
        initial={{ scale: 0.7, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card rounded-3xl border border-border shadow-[0_20px_60px_-10px_rgba(45,80,22,0.25)] p-8 max-w-sm w-full text-center overflow-hidden"
      >
        {/* Sparkle particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          {SPARKLE_POSITIONS.map((pos, i) => (
            <div
              key={`sp-${pos.tx}-${pos.ty}`}
              className="absolute w-2 h-2 rounded-full bg-amber-400"
              style={{
                ["--tx" as string]: pos.tx,
                ["--ty" as string]: pos.ty,
                animation: `sparkle-float 1.2s ease-out ${i * 0.08}s both`,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-ocid="testimonials.thankyou_modal.close_button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Glowing checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Animated stars */}
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [1, 0.75, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                <Star className="w-7 h-7 fill-amber-400 text-amber-400 drop-shadow-sm" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="font-display text-xl font-bold text-foreground mb-2"
        >
          Thank you for your honest review! 🌟
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground text-sm leading-relaxed mb-7"
        >
          Your feedback means the world to us. It helps more students discover
          the joy of confident English communication.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          type="button"
          onClick={onClose}
          data-ocid="testimonials.thankyou_modal.confirm_button"
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-shimmer transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Submission form ──────────────────────────────────────────────────────────

interface SubmitFormProps {
  onSubmit: (
    name: string,
    role: string,
    content: string,
    rating: bigint,
  ) => Promise<void>;
  isSubmitting: boolean;
}

function SubmitForm({ onSubmit, isSubmitting }: SubmitFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!role.trim()) e.role = "Please enter your role (e.g. Student, Parent).";
    if (!content.trim() || content.trim().length < 20)
      e.content = "Please write at least 20 characters.";
    if (rating === 0) e.rating = "Please select a star rating.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSubmit(name.trim(), role.trim(), content.trim(), BigInt(rating));
    setShowModal(true);
    setName("");
    setRole("");
    setContent("");
    setRating(0);
    setErrors({});
  }

  return (
    <>
      <AnimatePresence>
        {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="bg-primary/8 border-b border-border px-6 sm:px-8 py-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Share Your Experience
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
            Leave a Review
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Studied or partnered with Rupika Ma'am? We'd love to hear from you!
          </p>
        </div>

        <div className="px-6 sm:px-8 py-8">
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            noValidate
            data-ocid="testimonials.form"
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="review-name"
                  className="text-sm font-semibold text-foreground"
                >
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="e.g. Kavya Krishnan"
                  data-ocid="testimonials.name_input"
                  className={`w-full rounded-lg border ${errors.name ? "border-destructive" : "border-input"} bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors`}
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="testimonials.name.field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="review-role"
                  className="text-sm font-semibold text-foreground"
                >
                  Your Role <span className="text-primary">*</span>
                </label>
                <input
                  id="review-role"
                  type="text"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (errors.role) setErrors((p) => ({ ...p, role: "" }));
                  }}
                  placeholder="e.g. Student, Parent, Teacher"
                  data-ocid="testimonials.role_input"
                  className={`w-full rounded-lg border ${errors.role ? "border-destructive" : "border-input"} bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors`}
                />
                {errors.role && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="testimonials.role.field_error"
                  >
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="review-content"
                className="text-sm font-semibold text-foreground"
              >
                Your Review <span className="text-primary">*</span>
              </label>
              <textarea
                id="review-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors((p) => ({ ...p, content: "" }));
                }}
                placeholder="Share how Rupika Ma'am helped you or your child improve in English..."
                rows={4}
                data-ocid="testimonials.review_textarea"
                className={`w-full rounded-lg border ${errors.content ? "border-destructive" : "border-input"} bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none`}
              />
              <div className="flex items-center justify-between">
                {errors.content ? (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="testimonials.review.field_error"
                  >
                    {errors.content}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {content.length} chars
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">
                Your Rating <span className="text-primary">*</span>
              </p>
              <div className="flex items-center gap-3">
                <StarPicker
                  value={rating}
                  onChange={(n) => {
                    setRating(n);
                    if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
                  }}
                />
                {rating > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {
                      ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                        rating
                      ]
                    }
                  </span>
                )}
              </div>
              {errors.rating && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="testimonials.rating.field_error"
                >
                  {errors.rating}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                data-ocid="testimonials.submit_button"
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-shimmer transition-smooth hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lifted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isSubmitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function TestimonialsSection() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const queryClient = useQueryClient();

  const {
    data: testimonials = [],
    isLoading,
    isError,
  } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !actorLoading,
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      name,
      role,
      content,
      rating,
    }: {
      name: string;
      role: string;
      content: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitTestimonial(name, role, content, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  async function handleSubmit(
    name: string,
    role: string,
    content: string,
    rating: bigint,
  ) {
    await submitMutation.mutateAsync({ name, role, content, rating });
  }

  return (
    <section
      id="testimonials"
      data-ocid="testimonials.section"
      className="section-white section-padding"
    >
      <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Student Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Testimonials
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Real feedback from students, parents, and schools who experienced
            the transformation.
          </p>
        </motion.div>

        {/* Testimonials content */}
        {isLoading || actorLoading ? (
          <div
            data-ocid="testimonials.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-6 space-y-4 animate-pulse"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-3.5 h-3.5 rounded bg-muted" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-4/6" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-muted" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-2.5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            data-ocid="testimonials.error_state"
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-sm">
              Unable to load reviews right now. Please refresh the page.
            </p>
          </div>
        ) : testimonials.length === 0 ? (
          <div
            data-ocid="testimonials.empty_state"
            className="text-center py-12"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">No reviews yet</p>
            <p className="text-muted-foreground text-sm">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <Carousel testimonials={testimonials} />
        )}

        {/* Submission form */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mt-16"
        >
          <SubmitForm
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
        </motion.div>
      </div>
    </section>
  );
}
