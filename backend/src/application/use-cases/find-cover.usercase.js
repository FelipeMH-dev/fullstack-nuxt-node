const BookRepository = require("../../infrastructure/db/repositories/book.repository");
const BookMapper = require("../../interfaces/mappers/book.mapper");
const { urlToBase64 } = require("../../shared/helpers/image.helper");

class FindCoverUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }
  
  async execute(bookId) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new Error("Libro no encontrado");
    if (book.coverBase64) return book.coverBase64
    throw new Error("El libro no tiene portada almacenada");
  }
}

module.exports = FindCoverUseCase;
