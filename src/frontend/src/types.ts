// Re-export backend types for use throughout the app
export type { Testimonial, TestimonialId } from "./backend";

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Skill {
  id: number;
  label: string;
  icon?: string;
}

export interface Experience {
  id: number;
  organization: string;
  location: string;
  period: string;
  school: string;
  highlights: string[];
  studentsCount: string;
}

export interface NavLink {
  label: string;
  href: string;
}
