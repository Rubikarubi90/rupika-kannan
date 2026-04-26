import { ChevronUp } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { WhatsAppButton } from "./WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const currentYear = new Date().getFullYear();
  const footerLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Main content — offset for sticky navbar */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/assets/logo.png"
                  alt="Rupika Kannan Logo"
                  className="w-12 h-12 object-contain rounded-full bg-primary-foreground/10"
                />
                <h3 className="font-display font-bold text-lg">
                  Rupika Kannan
                </h3>
              </div>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                Communicative English Tutor in Dharmapuri. Empowering students
                with confident English communication.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-primary-foreground/60">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2">
                {["About", "Experience", "Skills", "Services", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(item.toLowerCase())
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-sm text-primary-foreground/75 hover:text-primary-foreground transition-smooth"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-primary-foreground/60">
                Contact
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-primary-foreground/75">
                <li>
                  <a
                    href="tel:+919791595982"
                    className="hover:text-primary-foreground transition-smooth"
                  >
                    +91 97915 95982
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:rrubika90@gmail.com"
                    className="hover:text-primary-foreground transition-smooth"
                  >
                    rrubika90@gmail.com
                  </a>
                </li>
                <li>Dharmapuri, Tamil Nadu, India</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/55">
            <p>© {currentYear} Rupika Kannan. All rights reserved.</p>
            <p>
              Built with love using{" "}
              <a
                href={footerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary-foreground transition-smooth"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          data-ocid="scroll_top_button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-card border border-border shadow-lifted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-fade-in"
          style={{ animation: "fade-in 0.3s ease-out both" }}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
