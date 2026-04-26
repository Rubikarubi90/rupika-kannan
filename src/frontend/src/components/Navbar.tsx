import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavLink } from "../types";

const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  return (
    <header
      data-ocid="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-smooth ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-card border-b border-border"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-ocid="navbar.logo_link"
          className="flex items-center gap-2.5 leading-tight text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
        >
          <img
            src="/assets/logo.png"
            alt="Rupika Kannan Logo"
            className="w-9 h-9 object-contain rounded-full bg-primary/5"
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-primary tracking-tight">
              Rupika Kannan
            </span>
            <span className="text-xs text-muted-foreground font-medium hidden sm:block">
              Communicative English Tutor
            </span>
          </div>
        </button>

        {/* Desktop Links — with underline slide animation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                type="button"
                data-ocid={`navbar.${link.label.toLowerCase()}_link`}
                onClick={() => scrollToSection(link.href)}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:text-primary hover:bg-muted nav-underline ${
                  isActive
                    ? "text-primary font-semibold bg-muted active"
                    : "text-foreground"
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: isActive ? "70%" : "0%" }}
                />
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => scrollToSection("#contact")}
            data-ocid="navbar.book_demo_button"
            className="ml-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold btn-shimmer transition-smooth hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lifted"
          >
            Book a Demo
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          data-ocid="navbar.hamburger_toggle"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          data-ocid="navbar.mobile_menu"
          className="md:hidden bg-card border-t border-border animate-slide-down"
        >
          <nav
            className="flex flex-col px-4 py-3 gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                data-ocid={`navbar.mobile.${link.label.toLowerCase()}_link`}
                onClick={() => {
                  scrollToSection(link.href);
                  setMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-md text-sm font-medium text-left transition-smooth hover:text-primary hover:bg-muted ${
                  activeSection === link.href.replace("#", "")
                    ? "text-primary font-semibold bg-muted"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                scrollToSection("#contact");
                setMenuOpen(false);
              }}
              data-ocid="navbar.mobile.book_demo_button"
              className="mt-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center transition-smooth hover:opacity-90"
            >
              Book a Demo Class
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
