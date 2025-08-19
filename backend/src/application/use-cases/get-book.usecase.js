const BookRepository = require("../../infrastructure/db/repositories/book.repository");
const BookMapper = require("../../interfaces/mappers/book.mapper");

class GetBookUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }

  async execute(bookId) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new Error("Libro no encontrado");
    return BookMapper.toResponse(book);
  }
}

module.exports = GetBookUseCase;
