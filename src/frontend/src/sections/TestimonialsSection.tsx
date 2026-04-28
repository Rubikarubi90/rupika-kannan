import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Star, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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

// ─── Context menu overlay ─────────────────────────────────────────────────────

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function ContextMenu({ x, y, onEdit, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleScroll() {
      onClose();
    }
    // Use a small delay so the mouseup that ends the long-press doesn't
    // immediately register as "click outside"
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener(
        "touchstart",
        handleClickOutside as unknown as EventListener,
      );
    }, 50);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener(
        "touchstart",
        handleClickOutside as unknown as EventListener,
      );
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  const menuW = 168;
  const menuH = 100;
  const safeX = Math.min(x, window.innerWidth - menuW - 8);
  const safeY = Math.min(y, window.innerHeight - menuH - 8);

  return (
    <motion.div
      ref={menuRef}
      data-ocid="testimonials.dropdown_menu"
      initial={{ opacity: 0, scale: 0.88, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{ position: "fixed", left: safeX, top: safeY, zIndex: 9999 }}
      className="bg-card border border-border rounded-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)] overflow-hidden min-w-[168px]"
    >
      <button
        type="button"
        data-ocid="testimonials.edit_button"
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors duration-150 focus-visible:outline-none focus-visible:bg-primary/10"
      >
        <Pencil className="w-4 h-4 text-primary flex-shrink-0" />
        Edit Review
      </button>
      <div className="h-px bg-border mx-3" />
      <button
        type="button"
        data-ocid="testimonials.delete_button"
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150 focus-visible:outline-none focus-visible:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4 flex-shrink-0" />
        Delete Review
      </button>
    </motion.div>
  );
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────

interface DeleteConfirmProps {
  testimonialName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({
  testimonialName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      onClick={onCancel}
      data-ocid="testimonials.dialog"
    >
      <motion.div
        initial={{ scale: 0.88, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border shadow-[0_20px_60px_-10px_rgba(0,0,0,0.22)] p-7 max-w-sm w-full"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-destructive/12 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-foreground mb-1">
              Delete this review?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're about to permanently delete the review by{" "}
              <span className="font-semibold text-foreground">
                {testimonialName}
              </span>
              . This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            data-ocid="testimonials.cancel_button"
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="testimonials.confirm_button"
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  testimonial: Testimonial;
  onSave: (
    name: string,
    role: string,
    content: string,
    rating: bigint,
  ) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function EditModal({ testimonial, onSave, onClose, isSaving }: EditModalProps) {
  const [name, setName] = useState(testimonial.name);
  const [role, setRole] = useState(testimonial.role);
  const [content, setContent] = useState(testimonial.content);
  const [rating, setRating] = useState(Number(testimonial.rating));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!role.trim()) e.role = "Role is required.";
    if (!content.trim() || content.trim().length < 10)
      e.content = "Review must be at least 10 characters.";
    if (rating === 0) e.rating = "Please select a rating.";
    return e;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSave(name.trim(), role.trim(), content.trim(), BigInt(rating));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      onClick={onClose}
      data-ocid="testimonials.dialog"
    >
      <motion.div
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border shadow-[0_20px_60px_-10px_rgba(45,80,22,0.22)] w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2.5">
            <Pencil className="w-4 h-4 text-primary" />
            <h3 className="font-display text-base font-bold text-foreground">
              Edit Review
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="testimonials.close_button"
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} noValidate className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-name"
                className="text-sm font-semibold text-foreground"
              >
                Name <span className="text-primary">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
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
                htmlFor="edit-role"
                className="text-sm font-semibold text-foreground"
              >
                Role <span className="text-primary">*</span>
              </label>
              <input
                id="edit-role"
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) setErrors((p) => ({ ...p, role: "" }));
                }}
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
              htmlFor="edit-content"
              className="text-sm font-semibold text-foreground"
            >
              Review <span className="text-primary">*</span>
            </label>
            <textarea
              id="edit-content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((p) => ({ ...p, content: "" }));
              }}
              rows={4}
              data-ocid="testimonials.review_textarea"
              className={`w-full rounded-lg border ${errors.content ? "border-destructive" : "border-input"} bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none`}
            />
            {errors.content && (
              <p
                className="text-xs text-destructive"
                data-ocid="testimonials.review.field_error"
              >
                {errors.content}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">
              Rating <span className="text-primary">*</span>
            </p>
            <StarPicker
              value={rating}
              onChange={(n) => {
                setRating(n);
                if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
              }}
            />
            {errors.rating && (
              <p
                className="text-xs text-destructive"
                data-ocid="testimonials.rating.field_error"
              >
                {errors.rating}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              data-ocid="testimonials.cancel_button"
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              data-ocid="testimonials.save_button"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Testimonial card with long-press ─────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
}

function TestimonialCard({
  testimonial: t,
  index,
  onEdit,
  onDelete,
}: TestimonialCardProps) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const pressCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  function openMenu(x: number, y: number) {
    setMenuPos({ x, y });
    // Provide haptic feedback on mobile if available
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function clearTimer() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  // Desktop: right-click context menu
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    didLongPress.current = true;
    openMenu(e.clientX, e.clientY);
  }

  // Touch: 500ms long-press
  function handleTouchStart(e: React.TouchEvent) {
    didLongPress.current = false;
    const touch = e.touches[0];
    pressCoords.current = { x: touch.clientX, y: touch.clientY };
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      openMenu(touch.clientX, touch.clientY);
    }, 500);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    clearTimer();
    // Prevent the synthetic click from firing after a long-press
    if (didLongPress.current) {
      e.preventDefault();
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - pressCoords.current.x);
    const dy = Math.abs(touch.clientY - pressCoords.current.y);
    // Cancel if moved more than 10px
    if (dx > 10 || dy > 10) clearTimer();
  }

  function handleTouchCancel() {
    clearTimer();
    didLongPress.current = false;
  }

  // Desktop mouse long-press (500ms hold)
  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    didLongPress.current = false;
    pressCoords.current = { x: e.clientX, y: e.clientY };
    const { clientX, clientY } = e;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      openMenu(clientX, clientY);
    }, 500);
  }

  function handleMouseUp() {
    clearTimer();
  }

  function handleMouseMove(e: React.MouseEvent) {
    const dx = Math.abs(e.clientX - pressCoords.current.x);
    const dy = Math.abs(e.clientY - pressCoords.current.y);
    // Cancel if mouse drifted more than 10px
    if (dx > 10 || dy > 10) clearTimer();
  }

  function handleMouseLeave() {
    clearTimer();
  }

  return (
    <>
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
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchCancel}
        className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col cursor-default select-none relative group"
        title="Long-press or right-click to manage"
      >
        {/* Subtle hint dot — visible on hover only */}
        <div
          aria-hidden="true"
          className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

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

      <AnimatePresence>
        {menuPos && (
          <ContextMenu
            x={menuPos.x}
            y={menuPos.y}
            onEdit={() => onEdit(t)}
            onDelete={() => onDelete(t)}
            onClose={() => {
              setMenuPos(null);
              didLongPress.current = false;
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface CarouselProps {
  testimonials: Testimonial[];
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
}

function Carousel({ testimonials, onEdit, onDelete }: CarouselProps) {
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
              onEdit={onEdit}
              onDelete={onDelete}
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
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    try {
      await onSubmit(name.trim(), role.trim(), content.trim(), BigInt(rating));
      // Only show thank-you and reset on success
      setShowModal(true);
      setName("");
      setRole("");
      setContent("");
      setRating(0);
      setErrors({});
    } catch {
      toast.error("Could not submit your review. Please try again.");
    }
  }

  return (
    <>
      <AnimatePresence>
        {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
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
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-colors hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

  const [editTarget, setEditTarget] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const {
    data: testimonials = [],
    isLoading,
    isError,
  } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getTestimonials();
      return result;
    },
    enabled: !!actor && !actorLoading,
    refetchOnWindowFocus: false,
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
    onError: () => {
      toast.error("Could not submit your review. Please try again.");
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      role,
      content,
      rating,
    }: {
      id: bigint;
      name: string;
      role: string;
      content: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const ok = await actor.editTestimonial(id, name, role, content, rating);
      if (!ok) throw new Error("Edit not permitted");
      return ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setEditTarget(null);
      toast.success("Review updated successfully.");
    },
    onError: () => {
      toast.error("Could not update the review. Please try again.");
      setEditTarget(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const ok = await actor.deleteTestimonial(id);
      if (!ok) throw new Error("Delete not permitted");
      return ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setDeleteTarget(null);
      toast.success("Review deleted.");
    },
    onError: () => {
      toast.error("Could not delete the review. Please try again.");
      setDeleteTarget(null);
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

  async function handleEdit(
    name: string,
    role: string,
    content: string,
    rating: bigint,
  ) {
    if (!editTarget) return;
    await editMutation.mutateAsync({
      id: editTarget.id,
      name,
      role,
      content,
      rating,
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
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
          <Carousel
            testimonials={testimonials}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
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

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <EditModal
            testimonial={editTarget}
            onSave={handleEdit}
            onClose={() => setEditTarget(null)}
            isSaving={editMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmDialog
            testimonialName={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
