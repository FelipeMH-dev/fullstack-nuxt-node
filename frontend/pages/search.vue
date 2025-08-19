<template>
  <Layout>
    <div class="search-page">
      <h1>Buscador de Libros</h1>
      <div class="search-input-wrapper" ref="wrapperRef">
        <input v-model="searchText" placeholder="Escribe el nombre de un libro para continuar"
          @focus="showAutocomplete = true" @input="filterAutocomplete">
        <ul v-if="showAutocomplete && filteredLastSearches.length" class="autocomplete-list">
          <li v-for="item in filteredLastSearches" :key="item" @click="selectAutocomplete(item)">
            {{ item }}
          </li>
        </ul>
      </div>

      <button @click="handleSearch">Buscar</button>

      <div v-if="books.length">
        <h2>Resultados</h2>
        <ul>
          <li v-for="book in books" :key="book.id">
            <a href="#" @click.prevent="openModal(book)">
              <img :src="book.coverBase64 ? book.coverBase64 : '/images/not-found-book.png'" alt="" width="100"
                height="150">
              <span class="title">{{ book.title }}</span>
            </a>
          </li>
        </ul>
      </div>
      <p v-else-if="searched">No encontramos libros con el título ingresado</p>

      <!-- Modal -->
      <div v-if="selectedBook" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <h2>{{ selectedBook.title }}</h2>
          <p><strong>Autor:</strong> {{ selectedBook.author }}</p>
          <p><strong>Año:</strong> {{ selectedBook.year }}</p>
          <img :src="selectedBook.coverBase64 ? selectedBook.coverBase64 : '/images/not-found-book.png'" alt=""
            width="150" height="225">

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
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useBooks } from '@/composables/useBooks'
import type { Book } from '@/types/book.interface'
import Layout from '@/components/Layout.vue'

const { searchBooks, addBook } = useBooks()
const searchText = ref('')
const books = ref<Book[]>([])
const searched = ref(false)
const isSaving = ref(false)
// LocalStorage para últimas búsquedas
const lastSearches = ref<string[]>([])
const showAutocomplete = ref(false)
const filteredLastSearches = ref<string[]>([])

// Modal y detalle del libro
const selectedBook = ref<Book | null>(null)
const review = ref('')
const rating = ref<number | null>(null)
const successMessage = ref('')

// Ref para detectar clicks fuera del input
const wrapperRef = ref<HTMLElement | null>(null)

// Cargar últimas búsquedas solo en cliente
onMounted(() => {
  lastSearches.value = JSON.parse(localStorage.getItem('lastSearches') || '[]')

  // Evento para cerrar autocompletado al hacer click fuera
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Función que cierra el autocompletado si el click fue fuera del wrapper
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    showAutocomplete.value = false
  }
}

// Función de búsqueda
const handleSearch = async () => {
  if (!searchText.value) return

  books.value = await searchBooks(searchText.value)
  searched.value = true

  updateLastSearches(searchText.value)
  filterAutocomplete()
}

// Actualizar últimas búsquedas en localStorage (máximo 5)
const updateLastSearches = (query: string) => {
  lastSearches.value = lastSearches.value.filter(item => item !== query)
  lastSearches.value.unshift(query)
  if (lastSearches.value.length > 5) lastSearches.value.pop()

  if (import.meta.client) {
    localStorage.setItem('lastSearches', JSON.stringify(lastSearches.value))
  }
}

// Filtrar autocompletado según texto
const filterAutocomplete = () => {
  filteredLastSearches.value = lastSearches.value.filter(item =>
    item.toLowerCase().includes(searchText.value.toLowerCase())
  )
}

// Seleccionar una opción del autocompletado
const selectAutocomplete = (item: string) => {
  searchText.value = item
  showAutocomplete.value = false
  filterAutocomplete()
}

// Abrir modal de detalle
const openModal = (book: Book) => {
  selectedBook.value = book
  review.value = ''
  rating.value = null
  successMessage.value = ''
}

// Cerrar modal
const closeModal = () => {
  selectedBook.value = null
}

const saveBook = async () => {
  if (!selectedBook.value || rating.value === null) return

  isSaving.value = true

  await addBook({
    ...selectedBook.value,
    review: review.value, 
    rating: rating.value
  })

  successMessage.value = 'Libro guardado correctamente en tu biblioteca!'

  // Limpiar review y rating
  review.value = ''
  rating.value = null

  isSaving.value = false
}
</script>
