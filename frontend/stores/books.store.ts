import { defineStore } from 'pinia'
import { BooksService } from '@/services/books.service'
import type { Book } from '@/types/book.interface'
import { useRuntimeConfig } from 'nuxt/app'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [] as Book[],
    selectedBook: null as Book | null,
    booksService: null as BooksService | null,
  }),

  actions: {
    initService() {
      if (!this.booksService) {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        this.booksService = new BooksService(apiBase)
      }
    },

    async loadBooks() {
      this.initService()
      this.books = await this.booksService!.getBooks()
    },

    async searchBooks(query: string) {
      this.initService()
      const result = await this.booksService!.searchBooks(query)
      return result
    },

    async getMyLibrary() {
      this.initService()
      const result = await this.booksService!.getMyLibrary()
      return result
    },

    async addBook(book: Book) {
      this.initService()
      const newBook = await this.booksService!.addBook(book)
      this.books.push(newBook)
    },

    async updateBook(id: string, book: Partial<Book>) {
      this.initService()
      const updated = await this.booksService!.updateBook(id, book)
      const index = this.books.findIndex(b => b.id === id)
      if (index !== -1) this.books[index] = updated
    },

    async deleteBook(id: string) {
      this.initService()
      await this.booksService!.deleteBook(id)
      this.books = this.books.filter(b => b.id !== id)
    },

    async selectBook(id: string) {
      this.initService()
      this.selectedBook = await this.booksService!.getBookById(id)
    },
  },
})
