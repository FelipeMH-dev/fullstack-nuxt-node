class UpdateBookDTO {
  constructor({ review, rating }) {
    if (review?.length > 500) throw new Error("Review too long (max 500)");
    if (rating && (rating < 1 || rating > 5)) throw new Error("Rating must be 1..5");
    this.review = review ?? null;
    this.rating = rating ?? null;
  }
}
module.exports = UpdateBookDTO;