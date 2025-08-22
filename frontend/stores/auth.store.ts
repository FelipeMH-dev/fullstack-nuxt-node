import { defineStore } from "pinia";
import { AuthService } from "@/services/auth.service";
import type { User } from "@/types/user.interface";
import { useRuntimeConfig } from "nuxt/app";
import { decodeJwt } from "jose";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: import.meta.client ? localStorage.getItem("token") : null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    getAuthService() {
      const config = useRuntimeConfig();
      return new AuthService(config.public.apiBase as string);
    },
    async login(email: string, password: string) {
      const authService = this.getAuthService();
      const res = await authService.login(email, password);
      const decoded = decodeJwt(res.token);
      this.user = { id: decoded.id, email: decoded.email } as User;
      this.token = res.token;

      if (import.meta.client) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    },

    async register(user: User) {
      const authService = this.getAuthService();
      const newUser = await authService.register(user);
      return newUser;
    },

    logout() {
      this.user = null;
      this.token = null;
      if (import.meta.client) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },

    restoreSession() {
      if (import.meta.client) {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken) {
          this.token = savedToken;
          try {
            const decoded  = decodeJwt(savedToken)
            this.user = { id: decoded.id, email: decoded.email } as User
          } catch (e) {
            console.error('Token inválido', e)
            this.logout()
          }
        }

        if (savedUser) {
          try {
            this.user = JSON.parse(savedUser);
          } catch {
            this.user = null;
          }
        }
      }
    },
  },
});
