import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/testimonials";
import TestimonialsLib "../lib/testimonials";

// =============================================================================
// TESTIMONIALS API — open to all callers (no admin gate)
// =============================================================================
// submitTestimonial  — anyone can post a review
// getTestimonials    — anyone can read reviews
// editTestimonial    — open (no auth required; owner manages via the site UI)
// deleteTestimonial  — open (no auth required; owner manages via the site UI)
// =============================================================================

mixin (
  testimonials : List.List<Types.Testimonial>,
) {

  // ---------------------------------------------------------------------------
  // Visitor-facing: submit a testimonial (open to all callers)
  // ---------------------------------------------------------------------------

  /// Submit a new testimonial. Anyone can call this.
  public shared func submitTestimonial(
    name : Text,
    role : Text,
    content : Text,
    rating : Nat,
  ) : async Types.TestimonialId {
    let input : Types.CreateTestimonialInput = { name; role; content; rating };
    let t = TestimonialsLib.create(testimonials, input, Time.now());
    t.id;
  };

  /// Return all testimonials ordered by timestamp descending. Query — free and fast.
  public query func getTestimonials() : async [Types.Testimonial] {
    TestimonialsLib.listAll(testimonials);
  };

  // ---------------------------------------------------------------------------
  // Management: edit and delete — open to all callers (no login required)
  // ---------------------------------------------------------------------------

  /// Edit an existing testimonial by id. Returns true if found and updated.
  public shared func editTestimonial(
    id : Types.TestimonialId,
    name : Text,
    role : Text,
    content : Text,
    rating : Nat,
  ) : async Bool {
    let input : Types.UpdateTestimonialInput = { name; role; content; rating };
    TestimonialsLib.update(testimonials, id, input);
  };

  /// Delete a testimonial by id. Returns true if found and deleted.
  public shared func deleteTestimonial(id : Types.TestimonialId) : async Bool {
    TestimonialsLib.delete(testimonials, id);
  };

};
