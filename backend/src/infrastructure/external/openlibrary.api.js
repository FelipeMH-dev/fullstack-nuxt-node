const axios = require("axios");

class OpenLibraryApi {
  constructor() {
    this.baseURL = "https://openlibrary.org";
  }

  async search(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search.json`, {
        params: { q: query }
      });

      return response.data.docs.slice(0, 10).map(doc => ({
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(", ") : "Desconocido",
        year: doc.first_publish_year || null,
        coverBase64: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null
      }));
    } catch (err) {
      console.error("Error buscando en OpenLibrary:", err.message);
      return [];
    }
  }
}

module.exports = OpenLibraryApi;
