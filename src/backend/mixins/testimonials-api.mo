import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/testimonials";
import TestimonialsLib "../lib/testimonials";

// =============================================================================
// ADMIN MANAGEMENT — BACKEND ONLY
// =============================================================================
// The editTestimonial, deleteTestimonial, setAdmin, getAdmin, and isAdmin
// methods are intentionally NOT exposed in the frontend UI. They are accessible
// ONLY through the canister's Candid interface (e.g. the Candid UI at
// https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/ or via dfx/ic-repl).
//
// Admin setup (one-time):
//   1. Open the Candid UI for this canister.
//   2. Call setAdmin() — it registers YOUR caller principal as the admin.
//      This can only be done once; subsequent calls are ignored.
//
// Admin management (ongoing):
//   3. Call editTestimonial(id, name, role, content, rating) to update a review.
//   4. Call deleteTestimonial(id) to permanently remove a review.
//   These calls will fail ("Unauthorized") unless your Internet Identity
//   principal matches the stored admin principal.
// =============================================================================

mixin (
  testimonials : List.List<Types.Testimonial>,
  adminPrincipal : List.List<Principal>,
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
  // Admin-only: manage testimonials via Candid UI — NOT exposed in the frontend
  // ---------------------------------------------------------------------------

  /// Edit an existing testimonial by id.
  /// ADMIN ONLY — call from Candid UI with your Internet Identity principal.
  public shared ({ caller }) func editTestimonial(
    id : Types.TestimonialId,
    name : Text,
    role : Text,
    content : Text,
    rating : Nat,
  ) : async Bool {
    requireAdmin(caller);
    let input : Types.UpdateTestimonialInput = { name; role; content; rating };
    TestimonialsLib.update(testimonials, id, input);
  };

  /// Delete a testimonial by id.
  /// ADMIN ONLY — call from Candid UI with your Internet Identity principal.
  public shared ({ caller }) func deleteTestimonial(id : Types.TestimonialId) : async Bool {
    requireAdmin(caller);
    TestimonialsLib.delete(testimonials, id);
  };

  /// Register the caller as admin. Only works once — if an admin is already set,
  /// this call is silently ignored.
  /// CALL THIS ONCE from the Candid UI using your Internet Identity to become admin.
  public shared ({ caller }) func setAdmin() : async () {
    if (adminPrincipal.isEmpty()) {
      adminPrincipal.add(caller);
    };
  };

  /// Return the stored admin principal (public info — useful for verification).
  public query func getAdmin() : async ?Principal {
    adminPrincipal.first();
  };

  /// Return true if the caller is the registered admin.
  public query ({ caller }) func isAdmin() : async Bool {
    switch (adminPrincipal.first()) {
      case (?admin) Principal.equal(caller, admin);
      case null false;
    };
  };

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private func requireAdmin(caller : Principal) {
    switch (adminPrincipal.first()) {
      case (?admin) {
        if (not Principal.equal(caller, admin)) {
          Runtime.trap("Unauthorized: admin only");
        };
      };
      case null {
        Runtime.trap("No admin set — call setAdmin() first from the Candid UI");
      };
    };
  };
};
