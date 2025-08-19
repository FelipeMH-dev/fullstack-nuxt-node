const BookModel = require("../models/book.model");
const mongoose = require("mongoose");
class BookRepository {
  async addBook(bookEntity) {
    const book = new BookModel(bookEntity);
    return book.save();
  }

  async update(id, updateData) {
    return BookModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return BookModel.findByIdAndDelete(id);
  }

  async findById(id) {
    return BookModel.findById(id);
  }

  async list(userId) {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
  const books = await BookModel.find(matchStage).lean();
  return books;
}
  async findByTitles(titles, userId) {
    return BookModel.find({ title: { $in: titles }, userId });
  }
}

module.exports = BookRepository;
