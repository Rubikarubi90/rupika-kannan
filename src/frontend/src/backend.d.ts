import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type TestimonialId = bigint;
export interface Testimonial {
    id: TestimonialId;
    content: string;
    name: string;
    role: string;
    timestamp: Timestamp;
    rating: bigint;
}
export interface backendInterface {
    deleteTestimonial(id: TestimonialId): Promise<boolean>;
    editTestimonial(id: TestimonialId, name: string, role: string, content: string, rating: bigint): Promise<boolean>;
    getAdmin(): Promise<Principal | null>;
    getTestimonials(): Promise<Array<Testimonial>>;
    isAdmin(): Promise<boolean>;
    setAdmin(): Promise<void>;
    submitTestimonial(name: string, role: string, content: string, rating: bigint): Promise<TestimonialId>;
}
