<template>
  <div class="auth-page">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Contraseña" required>
      <button type="submit">Ingresar</button>
    </form>
    <p>
      ¿No tienes cuenta? <NuxtLink to="/register">Regístrate</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/search') // redirige al buscador
  } catch {
    alert('Error al iniciar sesión')
  }
}
</script>

