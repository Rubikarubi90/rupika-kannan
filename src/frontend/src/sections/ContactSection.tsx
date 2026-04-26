import { CheckCircle, Mail, MapPin, Phone, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiInstagram } from "react-icons/si";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: "", email: "", phone: "", message: "" };

// ─── Booking Confirmation Modal ───────────────────────────────────────────────

const CONFETTI_ITEMS = [
  { color: "bg-primary", tx: "-50px", ty: "-70px", rotate: "20deg" },
  { color: "bg-amber-400", tx: "55px", ty: "-65px", rotate: "-15deg" },
  { color: "bg-primary/60", tx: "-70px", ty: "30px", rotate: "45deg" },
  { color: "bg-amber-300", tx: "70px", ty: "25px", rotate: "-30deg" },
  { color: "bg-primary/40", tx: "-30px", ty: "-80px", rotate: "10deg" },
  { color: "bg-amber-500", tx: "35px", ty: "-75px", rotate: "-40deg" },
  { color: "bg-primary", tx: "0px", ty: "-85px", rotate: "5deg" },
  { color: "bg-amber-400", tx: "-65px", ty: "-30px", rotate: "35deg" },
];

function BookingModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      onClick={onClose}
      data-ocid="contact.booking_modal"
    >
      <motion.div
        initial={{ scale: 0.7, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card rounded-3xl border border-border shadow-[0_24px_64px_-12px_rgba(45,80,22,0.3)] p-8 max-w-md w-full text-center overflow-hidden"
      >
        {/* Confetti burst */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {CONFETTI_ITEMS.map((item, i) => (
            <div
              key={`conf-${item.tx}-${item.ty}`}
              className={`absolute w-3 h-3 rounded-sm ${item.color}`}
              style={{
                ["--tx" as string]: item.tx,
                ["--ty" as string]: item.ty,
                animation: `confetti-fall 1.4s ease-out ${i * 0.06}s both`,
                transform: `rotate(${item.rotate})`,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-ocid="contact.booking_modal.close_button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 280,
            damping: 16,
          }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            You're All Set! 🎉
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-foreground font-medium text-base mb-3 leading-relaxed">
            Thank you for booking a demo session. We will get in touch with you
            soon.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Get ready to transform your English communication skills! 🌟 Rupika
            Ma'am looks forward to meeting you.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          type="button"
          onClick={onClose}
          data-ocid="contact.booking_modal.confirm_button"
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold btn-shimmer transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Got it!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function ContactSection() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email is required.";
    if (!form.message.trim()) e.message = "Please write a message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const wa = `https://wa.me/919791595982?text=${encodeURIComponent(
      `Hi Rupika! My name is ${form.name}.\nEmail: ${form.email}${form.phone ? `\nPhone: ${form.phone}` : ""}\n\n${form.message}`,
    )}`;
    window.open(wa, "_blank");
    setShowModal(true);
    setForm(INITIAL_FORM);
  };

  return (
    <>
      <AnimatePresence>
        {showModal && <BookingModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <section
        id="contact"
        data-ocid="contact.section"
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
              Get in Touch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Contact
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Ready to start your English learning journey? Reach out and let's
              talk about how I can help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
                <h3 className="font-semibold text-foreground mb-5">
                  Contact Information
                </h3>
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+919791595982"
                    data-ocid="contact.phone_link"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-smooth">
                      <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-smooth" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                        +91 97915 95982
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:rrubika90@gmail.com"
                    data-ocid="contact.email_link"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-smooth">
                      <Mail className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-smooth" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                        rrubika90@gmail.com
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground">
                        Dharmapuri, Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
                <h3 className="font-semibold text-foreground mb-4">
                  Social Media
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/karutha_penney"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="contact.instagram_link"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary transition-smooth group"
                  >
                    <SiInstagram className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-smooth" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/rupika-kannan-a34219272"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="contact.linkedin_link"
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary transition-smooth group"
                  >
                    <span className="sr-only">LinkedIn Profile</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-primary group-hover:fill-primary-foreground transition-smooth"
                      xmlns="http://www.w3.org/2000/svg"
                      focusable="false"
                      role="img"
                      aria-label="LinkedIn"
                    >
                      <title>LinkedIn</title>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919791595982"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="contact.whatsapp_link"
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-[#25D366] transition-smooth group"
                  >
                    <span className="sr-only">Chat on WhatsApp</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-primary group-hover:fill-white transition-smooth"
                      xmlns="http://www.w3.org/2000/svg"
                      focusable="false"
                      role="img"
                      aria-label="WhatsApp"
                    >
                      <title>WhatsApp</title>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Closing line */}
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <p className="font-display text-lg font-bold leading-snug mb-2">
                  Eager to inspire and guide students towards confident
                  communication.
                </p>
                <p className="text-primary-foreground/75 text-sm">
                  Whether you're a student, parent, or school — I'd love to help
                  you achieve your English goals.
                </p>
              </div>
            </motion.div>

            {/* Contact Form / Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
                <h3 className="font-semibold text-foreground mb-1">
                  Book a Demo Class
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill in the form and I'll get back to you via WhatsApp.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      onBlur={() => {
                        if (!form.name.trim())
                          setErrors((e) => ({
                            ...e,
                            name: "Your name is required.",
                          }));
                        else setErrors((e) => ({ ...e, name: undefined }));
                      }}
                      placeholder="Your full name"
                      data-ocid="contact.name_input"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    />
                    {errors.name && (
                      <p
                        data-ocid="contact.name.field_error"
                        className="mt-1.5 text-xs text-destructive"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      onBlur={() => {
                        if (
                          !form.email.trim() ||
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                        )
                          setErrors((e) => ({
                            ...e,
                            email: "A valid email is required.",
                          }));
                        else setErrors((e) => ({ ...e, email: undefined }));
                      }}
                      placeholder="your@email.com"
                      data-ocid="contact.email_input"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    />
                    {errors.email && (
                      <p
                        data-ocid="contact.email.field_error"
                        className="mt-1.5 text-xs text-destructive"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Phone Number{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      data-ocid="contact.phone_input"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      onBlur={() => {
                        if (!form.message.trim())
                          setErrors((e) => ({
                            ...e,
                            message: "Please write a message.",
                          }));
                        else setErrors((e) => ({ ...e, message: undefined }));
                      }}
                      placeholder="Tell me about your English learning goals or which program you're interested in..."
                      data-ocid="contact.message_textarea"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-smooth"
                    />
                    {errors.message && (
                      <p
                        data-ocid="contact.message.field_error"
                        className="mt-1.5 text-xs text-destructive"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-ocid="contact.submit_button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold btn-shimmer transition-smooth hover:opacity-90 hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Send className="w-4 h-4" />
                    Send via WhatsApp
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    This will open WhatsApp with your message pre-filled for
                    Rupika.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
