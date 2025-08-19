const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  coverBase64: { type: String },
  review: { type: String, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
