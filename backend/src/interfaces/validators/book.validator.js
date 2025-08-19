class BookValidator {
  static validateAddBook(dto) {
    if (!dto.title || !dto.author) {
      throw new Error("El título y el autor son obligatorios");
    }
    if (dto.review && dto.review.length > 500) {
      throw new Error("La review no puede superar los 500 caracteres");
    }
    if (dto.rating && (dto.rating < 1 || dto.rating > 5)) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }
  }

  static validateUpdateBook(dto) {
    if (dto.review && dto.review.length > 500) {
      throw new Error("La review no puede superar los 500 caracteres");
    }
    if (dto.rating && (dto.rating < 1 || dto.rating > 5)) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }
  }
}

module.exports = BookValidator;
