import { useAuthStore } from '@/stores/auth.store'

export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    await authStore.login(email, password)
  }

  const register = async (user: { username: string; email: string; password: string }) => {
    return await authStore.register(user)
  }

  const logout = () => authStore.logout()

  const isLoggedIn = () => authStore.isLoggedIn

  return { login, register, logout, isLoggedIn, authStore }
}
