import { ApiService } from "./api.service";
import type { Book } from "@/types/book.interface";
import { useRuntimeConfig } from 'nuxt/app'

export class BooksService extends ApiService {


  // 🔍 Buscar libros en OpenLibrary vía API interna
  async searchBooks(query: string): Promise<Book[]> {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string
   const res = await this.api.get(`${apiBase}/books/search`, {
    params: { q: query },
  });
    return res.data;
  }

  // 📚 Listar libros guardados en mi biblioteca 
  async getMyLibrary(): Promise<Book[]> {
    const res = await this.api.get("/books/my-library");
    return res.data;
  }
  // 📖 CRUD de libros
  async getBooks(): Promise<Book[]> {
    const res = await this.api.get("/books");
    return res.data;
  }

  // 🔍 Obtener un libro específico desde la biblioteca
  async getBookById(id: string): Promise<Book> {
    const res = await this.api.get(`/books/my-library/${id}`);
    return res.data;
  }
  // ➕ Guardar un libro en la biblioteca
  async addBook(book: Book): Promise<Book> {
    const res = await this.api.post("/books/my-library", book);
    return res.data;
  }

  // ✏️ Actualizar información del libro (ej: review y calificación)
  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const res = await this.api.put(`/books/my-library/${id}`, book);
    return res.data;
  }

  // ❌ Eliminar un libro de la biblioteca
  async deleteBook(id: string): Promise<void> {
    await this.api.delete(`/books/my-library/${id}`);
  }
}
