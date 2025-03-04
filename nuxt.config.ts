export default defineNuxtConfig({
  ssr: false,
  
  app: {
    baseURL: '/clean-day/',
    buildAssetsDir: '/_nuxt/'
  },
  
  nitro: {
    preset: 'github-pages'
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
})