const BookValidator = require("../../interfaces/validators/book.validator");
const BookMapper = require("../../interfaces/mappers/book.mapper");
const AddBookDTO = require("../../interfaces/dto/add-book.dto");
const BookRepository = require("../../infrastructure/db/repositories/book.repository");
const { urlToBase64 } = require("../../shared/helpers/image.helper");
class AddBookUseCase {
  constructor() {
    this.bookRepo = new BookRepository();
  }

  async execute(bookData) {
    const dto = new AddBookDTO(bookData);
    BookValidator.validateAddBook(dto);
   if (dto.coverBase64 && dto.coverBase64.startsWith("http")) {
      const base64Cover = await urlToBase64(dto.coverBase64);
      if (base64Cover) {
        dto.coverBase64 = base64Cover; // reemplazamos la URL por la imagen base64
      }
    }
    const entity = BookMapper.toDomain(dto);
    const savedBook = await this.bookRepo.addBook(entity);

    return BookMapper.toResponse(savedBook);
  }
}

module.exports = AddBookUseCase;
