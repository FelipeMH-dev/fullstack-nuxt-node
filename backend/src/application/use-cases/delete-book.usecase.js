const BookRepository = require("../../infrastructure/db/repositories/book.repository");

class DeleteBookUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }

  async execute(bookId) {
    const deleted = await this.bookRepo.delete(bookId);
    if (!deleted) throw new Error("Libro no encontrado");
    return { message: "Libro eliminado exitosamente" };
  }
}

module.exports = DeleteBookUseCase;
