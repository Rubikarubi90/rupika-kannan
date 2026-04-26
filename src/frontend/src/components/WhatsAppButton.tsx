import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = "919791595982";
  const message = encodeURIComponent(
    "Hello Rupika! I'd like to book a demo English class. Please share the details.",
  );
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-lifted hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      style={{ position: "fixed" }}
    >
      {/* Sonar ping ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          animation: "sonar-ring 3s ease-out infinite",
          background: "#25D366",
          borderRadius: "9999px",
          pointerEvents: "none",
        }}
      />
      <MessageCircle className="w-5 h-5 fill-white relative z-10" />
      <span className="text-sm font-semibold hidden sm:inline relative z-10">
        Chat on WhatsApp
      </span>
    </a>
  );
}
