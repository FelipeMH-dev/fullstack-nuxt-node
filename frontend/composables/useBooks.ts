// composables/useBooks.ts
import { useBooksStore } from '@/stores/books.store'
import type { Book } from '@/types/book.interface'

export const useBooks = () => {
  const booksStore = useBooksStore()

  const loadBooks = async () => await booksStore.loadBooks()
  const addBook = async (book: Book) => await booksStore.addBook(book)
  const updateBook = async (id: string, book: Partial<Book>) => await booksStore.updateBook(id, book)
  const deleteBook = async (id: string) => await booksStore.deleteBook(id)
  const selectBook = async (id: string) => await booksStore.selectBook(id)
  const searchBooks = async (query: string) => await booksStore.searchBooks(query)
  const getMyLibrary = async () => await booksStore.getMyLibrary() 
  return { booksStore, loadBooks, addBook, updateBook, deleteBook, selectBook, searchBooks, getMyLibrary }
}
