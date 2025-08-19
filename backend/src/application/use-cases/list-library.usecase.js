const BookRepository = require("../../infrastructure/db/repositories/book.repository");
const BookMapper = require("../../interfaces/mappers/book.mapper");

class ListLibraryUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }

  async execute(userId) {
    const books = await this.bookRepo.list(userId);
    return books.map(BookMapper.toResponse);
  }
}

module.exports = ListLibraryUseCase;
