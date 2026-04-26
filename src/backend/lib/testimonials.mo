import List "mo:core/List";
import Int "mo:core/Int";
import Types "../types/testimonials";

module {
  public type Testimonial = Types.Testimonial;
  public type TestimonialId = Types.TestimonialId;
  public type CreateTestimonialInput = Types.CreateTestimonialInput;
  public type UpdateTestimonialInput = Types.UpdateTestimonialInput;

  /// Create a new testimonial and add it to the list. Returns the new testimonial.
  public func create(
    testimonials : List.List<Testimonial>,
    input : CreateTestimonialInput,
    timestamp : Int,
  ) : Testimonial {
    let newId : Nat = testimonials.foldLeft<Nat, Testimonial>(
      0,
      func(maxId, t) { if (t.id > maxId) t.id else maxId },
    ) + 1;
    let t : Testimonial = {
      id = newId;
      name = input.name;
      role = input.role;
      content = input.content;
      rating = input.rating;
      timestamp = timestamp;
    };
    testimonials.add(t);
    t;
  };

  /// Return all testimonials sorted by timestamp descending.
  public func listAll(testimonials : List.List<Testimonial>) : [Testimonial] {
    let arr = testimonials.toArray();
    arr.sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  /// Find a testimonial by id.
  public func findById(
    testimonials : List.List<Testimonial>,
    id : TestimonialId,
  ) : ?Testimonial {
    testimonials.find(func(t) { t.id == id });
  };

  /// Update an existing testimonial by id. Returns true if found and updated.
  public func update(
    testimonials : List.List<Testimonial>,
    id : TestimonialId,
    input : UpdateTestimonialInput,
  ) : Bool {
    var found = false;
    testimonials.mapInPlace(
      func(t) {
        if (t.id == id) {
          found := true;
          { t with name = input.name; role = input.role; content = input.content; rating = input.rating };
        } else {
          t;
        };
      }
    );
    found;
  };

  /// Delete a testimonial by id. Returns true if found and deleted.
  public func delete(
    testimonials : List.List<Testimonial>,
    id : TestimonialId,
  ) : Bool {
    let sizeBefore = testimonials.size();
    let kept = testimonials.filter(func(t) { t.id != id });
    testimonials.clear();
    testimonials.append(kept);
    testimonials.size() < sizeBefore;
  };
};
