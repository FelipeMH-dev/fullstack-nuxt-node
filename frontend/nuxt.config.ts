// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/scss/main.scss'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:4000',
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api"
    }
  },
  modules: [
    "@pinia/nuxt",
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/fonts'
  ],
  typescript: {
    strict: true,
    typeCheck: true
  }
})