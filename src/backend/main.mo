import List "mo:core/List";
import Types "types/testimonials";
import TestimonialsApi "mixins/testimonials-api";



actor {
  let testimonials = List.empty<Types.Testimonial>();
  // Kept for stable compatibility — previously used for admin access control.
  // No longer referenced; edit/delete are now open to all callers.
  let adminPrincipal = List.empty<Principal>();

  include TestimonialsApi(testimonials);
};
