export default defineNuxtConfig({
  ssr: false,

  app: {
    baseURL: '/clean-day/'
  },

  nitro: {
    preset: 'github-pages',
    prerender: {
      failOnError: false,
      routes: ['/']
    }
  },

  devtools: { enabled: true },

  typescript: {
    strict: true
  },

  experimental: {
    renderJsonPayloads: true
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

  compatibilityDate: '2025-03-04'
})