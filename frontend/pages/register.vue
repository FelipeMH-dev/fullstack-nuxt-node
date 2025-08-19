<template>
  <div class="register-page">
    <h1>Registro</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="Nombre" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Contraseña" required>
      <button type="submit">Registrarse</button>
    </form>
    <p>
      ¿Ya tienes cuenta? <NuxtLink to="/">Inicia sesión</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  try {
    await register({ username: name.value,password: password.value, email: email.value  })
    alert('Registro exitoso')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Error al registrar')
  }
}
</script>
