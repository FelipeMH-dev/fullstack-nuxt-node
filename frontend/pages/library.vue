<template>
  <Layout>
    <div class="library-page">
      <h1>Mi Biblioteca</h1>

      <!-- Filtros -->
      <div class="filters">
        <input v-model="search" placeholder="Buscar por título o autor">
        <select v-model="sortOrder">
          <option value="asc">Calificación Ascendente</option>
          <option value="desc">Calificación Descendente</option>
        </select>
        <label>
          <input type="checkbox" v-model="onlyWithReview">
          Solo con review
        </label>
      </div>

      <ul class="books-list">
        <li v-for="book in filteredBooks" :key="book.id">
          <img :src="book.coverBase64 ? book.coverBase64 : '/images/not-found-book.png'" alt="Portada del libro"
            width="100" height="150">

          <!-- Estrellas dinámicas -->
          <div class="book-rating">
            <span v-for="n in 5" :key="n" :class="{ filled: n <= (book.rating ?? 0) }">
              ★
            </span>
          </div>

          <h3>{{ book.title }}</h3>
          <h4>{{ book.author }}</h4>
          <p>{{ book.review }}</p>
          <div class="buttons">
            <button @click="openModal(book)">Editar</button>
            <button @click="openDeleteModal(book)">Eliminar</button>
          </div>
        </li>
      </ul>

      <p v-if="loading">Cargando biblioteca...</p>
      <p v-if="error">{{ error }}</p>

      <!-- Modal de edición -->
      <div v-if="selectedBook" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <!-- Botón cerrar -->
          <button class="close-button" @click="closeModal">&times;</button>
          <h2>{{ selectedBook.title }}</h2>
          <p><strong>Autor:</strong> {{ selectedBook.author }}</p>
          <p><strong>Año:</strong> {{ selectedBook.year }}</p>
          <img :src="selectedBook.coverBase64 ? selectedBook.coverBase64 : '/images/not-found-book.png'"
            alt="Portada del libro" width="150" height="225">

          <textarea v-model="review" placeholder="Escribe tu review (máx. 500 caracteres)" maxlength="500"></textarea>

          <div class="rating">
            <label v-for="n in 5" :key="n" :class="{ selected: n <= (rating ?? 0) }">
              <input v-model="rating" type="radio" :value="n">
              <span>★</span>
            </label>
          </div>

          <button :disabled="rating === null || isSaving" class="save-button" @click="saveBook">
            Guardar
          </button>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Modal de confirmación para eliminar -->
      <div v-if="deleteBookModal" class="modal-backdrop" @click.self="closeDeleteModal">
        <div class="modal">
          <h2>Confirmar eliminación</h2>
          <p>¿Estás seguro de que quieres eliminar <strong>{{ bookToDelete?.title }}</strong>?</p>
          <div class="buttons" style="justify-content: center; margin-top: 1rem;">
            <button @click="confirmDelete" class="delete">Eliminar</button>
            <button @click="closeDeleteModal" class="cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBooks } from '@/composables/useBooks'
import type { Book } from '@/types/book.interface'
import Layout from '@/components/Layout.vue'

const { getMyLibrary, deleteBook, updateBook } = useBooks()

const books = ref<Book[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const sortOrder = ref('asc')
const onlyWithReview = ref(false) // filtro de solo libros con review

// Modal de edición
const selectedBook = ref<Book | null>(null)
const review = ref('')
const rating = ref<number | null>(null)
const successMessage = ref('')
const isSaving = ref(false)

// Modal de confirmación para eliminar
const deleteBookModal = ref(false)
const bookToDelete = ref<Book | null>(null)

// Cargar biblioteca
const loadLibrary = async () => {
  loading.value = true
  error.value = null
  try {
    books.value = await getMyLibrary()
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo cargar la biblioteca'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadLibrary())

// Filtrado de libros
const filteredBooks = computed(() => {
  return books.value
    .filter(b => (b.title + b.author).toLowerCase().includes(search.value.toLowerCase()))
    .filter(b => !onlyWithReview.value || (b.review && b.review.trim() !== ''))
    .sort((a, b) => {
      const ratingA = typeof a.rating === 'number' ? a.rating : 0
      const ratingB = typeof b.rating === 'number' ? b.rating : 0
      return sortOrder.value === 'asc' ? ratingA - ratingB : ratingB - ratingA
    })
})

// Modal de edición
const openModal = (book: Book) => {
  selectedBook.value = book
  review.value = book.review || ''
  rating.value = book.rating ?? null
  successMessage.value = ''
}

const closeModal = () => {
  selectedBook.value = null
  review.value = ''
  rating.value = null
  successMessage.value = ''
}

const saveBook = async () => {
  if (!selectedBook.value || rating.value === null) return

  isSaving.value = true

  await updateBook(selectedBook.value.id, {
    ...selectedBook.value,
    review: review.value,
    rating: rating.value
  })

  successMessage.value = 'Libro actualizado correctamente!'
  isSaving.value = false

  loadLibrary()
  closeModal()
}

// Modal de confirmación eliminar
const openDeleteModal = (book: Book) => {
  bookToDelete.value = book
  deleteBookModal.value = true
}

const closeDeleteModal = () => {
  bookToDelete.value = null
  deleteBookModal.value = false
}

const confirmDelete = async () => {
  if (!bookToDelete.value) return
  await deleteBook(bookToDelete.value.id)
  closeDeleteModal()
  loadLibrary()
}
</script>
