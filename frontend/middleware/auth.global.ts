import { useAuthStore } from '@/stores/auth.store'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn && to.path !== '/' && to.path !== '/register') {
    return navigateTo('/')
  }
})
