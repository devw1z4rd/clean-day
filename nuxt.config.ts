export default defineNuxtConfig({
  ssr: false, 
  app: {
    baseURL: '/clean-day/'
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
  }
})