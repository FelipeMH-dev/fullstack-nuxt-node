const BookValidator = require("../../interfaces/validators/book.validator");
const UpdateBookDTO = require("../../interfaces/dto/update-book.dto");
const BookRepository = require("../../infrastructure/db/repositories/book.repository");
const BookMapper = require("../../interfaces/mappers/book.mapper");

class UpdateBookUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }

  async execute(bookId, bookData) {
    const dto = new UpdateBookDTO(bookData);
    BookValidator.validateUpdateBook(dto);

    const updatedBook = await this.bookRepo.update(bookId, dto);
    if (!updatedBook) throw new Error("Libro no encontrado");

    return BookMapper.toResponse(updatedBook);
  }
}

module.exports = UpdateBookUseCase;
