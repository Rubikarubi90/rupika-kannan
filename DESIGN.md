# Design Brief

## Direction

Rupika Kannan Portfolio — Professional, refined portfolio website for a Communicative English Tutor with forest green accent and minimal, light aesthetic.

## Tone

Elegant minimalism with professional warmth; clean, intentional spacing and refined surfaces express expertise and approachability without decoration.

## Differentiation

Forest green primary on light backgrounds with deliberate section-surface alternation and serif display typography creates a sophisticated, educator-focused identity distinct from generic service websites.

## Color Palette

| Token      | OKLCH           | Role                          |
| ---------- | --------------- | ----------------------------- |
| background | 0.99 0.005 155  | Primary light surface         |
| foreground | 0.18 0.015 155  | Primary text, dark green tone |
| card       | 1.0 0.0 155     | White card backgrounds        |
| primary    | 0.45 0.18 155   | Forest green CTAs & accents   |
| secondary  | 0.96 0.008 155  | Soft grey section backgrounds |
| muted      | 0.94 0.01 155   | Lighter grey for subtle zones |
| accent     | 0.45 0.18 155   | Same as primary (forest green)|

## Typography

- Display: Fraunces — elegant serif for headings and hero text, projects educational authority
- Body: General Sans — clean, readable sans-serif for paragraphs and UI labels
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base leading-relaxed`

## Elevation & Depth

Minimal shadow hierarchy with subtle card shadows (lifted: 0 4px 12px) for surface separation; header features visible dark green border-bottom for navigation clarity.

## Structural Zones

| Zone    | Background           | Border                   | Notes                                  |
| ------- | -------------------- | ------------------------ | -------------------------------------- |
| Header  | White (background)   | Dark green bottom border | Navigation with logo, sticky optional |
| Content | Alternating white/grey | —                        | Sections alternate bg-background/bg-secondary for visual rhythm |
| Footer  | Soft grey (secondary) | Dark green top border    | Contact info and social links centered|

## Spacing & Rhythm

Spacious padding (6rem vertical sections, 2rem horizontal margins) creates breathing room; micro-spacing uses 0.5rem/1rem for text grouping; cards use 1.5rem padding for generous internal space.

## Component Patterns

- Buttons: Primary dark green background with white text, soft border-radius (rounded-lg), hover scale & shadow lift, transition-smooth
- Cards: White background, subtle shadow (shadow-card), rounded corners, hover:scale-105 with transition-smooth, border: none
- Badges: Small rounded pill shapes, muted background with foreground text, uppercase label style

## Motion

- Entrance: fade-in-up (0.6s ease-out) on page load for hero and sections
- Hover: scale-105 + shadow-lifted for cards and buttons, transition-smooth (0.3s)
- Decorative: none; prioritize clarity and professionalism over animation

## Constraints

- Never use raw colors—always use design tokens (oklch variables) or Tailwind semantic classes
- Maintain AA+ contrast on light backgrounds (dark green primary at 0.45 L, white text for CTAs)
- No gradients or decorative elements; clean lines and typography-first hierarchy only
- Mobile-first responsive design with clear breakpoints (sm, md, lg)

## Signature Detail

Forest green (`0.45 0.18 155` OKLCH) deployed as tonal accent instead of saturated primary creates understated sophistication—a "quiet confidence" appropriate for an educator's portfolio.
