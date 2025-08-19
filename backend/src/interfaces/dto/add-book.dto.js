class AddBookDTO {
  constructor({ title, author, year, coverBase64, review, rating, userId}) {
    if (!title) throw new Error("Title is required");
    if (review?.length > 500) throw new Error("Review too long");
    if (rating && (rating < 1 || rating > 5)) throw new Error("Rating must be 1–5");

    this.title = title?.toLowerCase();
    this.author = author;
    this.year = year;
    this.coverBase64 = coverBase64;
    this.review = review;
    this.rating = rating;
    this.userId = userId;
  }
}
module.exports = AddBookDTO;
