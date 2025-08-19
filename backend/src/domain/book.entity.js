class Book {
  constructor({ id, title, author, year, coverBase64, review = "", rating = null, userId }) {
    if (!title) throw new Error("El título es obligatorio");
    if (!author) throw new Error("El autor es obligatorio");
    if (rating !== null && (rating < 1 || rating > 5)) throw new Error("Rating debe estar entre 1 y 5");

    this.id = id;                     // ID único, generado por MongoDB
    this.title = title;               // Título del libro
    this.author = author;             // Autor
    this.year = year;                 // Año de publicación
    this.coverBase64 = coverBase64;   // Portada en Base64
    this.review = review;             // Review del usuario
    this.rating = rating;             // Calificación del 1 al 5
    this.userId = userId;             // Usuario propietario del libro
  }
}

module.exports = Book;
