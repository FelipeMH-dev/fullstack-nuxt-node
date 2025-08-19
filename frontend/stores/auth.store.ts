import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth.service'
import type { User } from '@/types/user.interface'
import { useRuntimeConfig } from 'nuxt/app'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: import.meta.client ? localStorage.getItem('token') : null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    getAuthService() {
      const config = useRuntimeConfig()
      return new AuthService(config.public.apiBase as string)
    },
    async login(email: string, password: string) {
       const authService = this.getAuthService()
      const res = await authService.login(email, password)
      this.user = res.user
      this.token = res.token

      if (import.meta.client) {
        localStorage.setItem('token', res.token)
      }
    },

    async register(user: User) {
      const authService = this.getAuthService()
      const newUser = await authService.register(user)
      return newUser
    },

    logout() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('token')
      }
    },

    restoreSession() {
      if (import.meta.client) {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          this.token = savedToken
        }
      }
    },
  },
})
