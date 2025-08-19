import { useAuthStore } from '@/stores/auth.store'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Si la ruta requiere autenticación y el user no está logeado, redirige
  if (!auth.isLoggedIn && to.path !== '/' && to.path !== '/register') {
    return navigateTo('/')
  }
})
