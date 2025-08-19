<template>
  <div class="layout">
    <header>
      <h1>Library SPA</h1>
      <nav>
        <NuxtLink to="/search">Buscador</NuxtLink>
        <NuxtLink to="/library">Mi Biblioteca</NuxtLink>
        <button @click="logout">Cerrar sesión</button>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AppLayout'
})

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>
