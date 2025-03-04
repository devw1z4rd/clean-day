export default defineNuxtConfig({
  ssr: true,
  app: {
    baseURL: '/clean-day/'
  },
  nitro: {
    preset: 'github-pages',
    prerender: {
      failOnError: false,
      routes: [] 
    }
  },
  routeRules: {
    '/': { ssr: true, prerender: false }, 
    '/**': { ssr: true }
  },
  devtools: { enabled: true },
  typescript: {
    strict: true
  },
  experimental: {
    renderJsonPayloads: true
  }
})