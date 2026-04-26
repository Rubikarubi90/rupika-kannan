import Common "common";

module {
  public type TestimonialId = Common.TestimonialId;
  public type Timestamp = Common.Timestamp;

  public type Testimonial = {
    id : TestimonialId;
    name : Text;
    role : Text;
    content : Text;
    rating : Nat;
    timestamp : Timestamp;
  };

  public type CreateTestimonialInput = {
    name : Text;
    role : Text;
    content : Text;
    rating : Nat;
  };

  public type UpdateTestimonialInput = {
    name : Text;
    role : Text;
    content : Text;
    rating : Nat;
  };
};
