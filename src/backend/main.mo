import List "mo:core/List";
import Types "types/testimonials";
import TestimonialsApi "mixins/testimonials-api";



actor {
  let testimonials = List.empty<Types.Testimonial>();
  let adminPrincipal = List.empty<Principal>();

  include TestimonialsApi(testimonials, adminPrincipal);
};
