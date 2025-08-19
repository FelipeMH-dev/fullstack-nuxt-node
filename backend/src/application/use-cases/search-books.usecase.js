const OpenLibraryApi = require("../../infrastructure/external/openlibrary.api");
const LastSearchRepository = require("../../infrastructure/db/repositories/last-search.repository");
const BookRepository = require("../../infrastructure/db/repositories/book.repository");

class SearchBooksUseCase {
  constructor(broker) {
    this.broker = broker;
    this.openLibrary = new OpenLibraryApi();
    this.lastSearchRepo = new LastSearchRepository();
    this.bookRepo = new BookRepository();
  }

  async execute(userId, query, token) {
    // await this.lastSearchRepo.addSearch(userId, query);
    const existingBooks = await this.bookRepo.findByTitles([query], userId);
    const externalBooks = await this.openLibrary.search(query);
    let results = await Promise.all(
      externalBooks.map(async (book) => {
        const existing = existingBooks.find(
          (b) => b.title.toLowerCase() === book.title.toLowerCase()
        );
        if (existing) {
         const coverBase64 = await this.broker.call(
            "books.getFrontCover",
            { id: existing._id },
            { meta: { headers: { authorization: `Bearer ${token}` } } }
          );
          book.coverBase64 = coverBase64;
        }
        if (!book.coverBase64) return null;
        return book;
      })
    );
    results = results.filter((book) => book !== null);
    return results.slice(0, 10);
  }
}

module.exports = SearchBooksUseCase;
