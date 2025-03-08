export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],
  ssr: false,
  compatibilityDate: '2025-03-06',
  
  app: {
    baseURL: '/clean-day/',  
    buildAssetsDir: '/_nuxt/',
  },
  
  nitro: {
    preset: 'github-pages'
  }
})