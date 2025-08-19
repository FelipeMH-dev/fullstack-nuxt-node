<template>
  <div class="layout">
    <header>
      <h1>Library SPA</h1>

      <!-- Botón hamburguesa -->
      <button class="burger" @click="toggleMenu" aria-label="Abrir menú">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <!-- Navegación -->
      <nav :class="{ open: menuOpen }">
        <NuxtLink to="/search" @click="closeMenu">Buscador</NuxtLink>
        <NuxtLink to="/library" @click="closeMenu">Mi Biblioteca</NuxtLink>
        <button @click="logout">Cerrar sesión</button>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'AppLayout' // antes: 'Layout'
})
const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const logout = () => {
  auth.logout()
  router.push('/')
  closeMenu()
}
</script>