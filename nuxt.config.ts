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
    },
    hooks: {
      'prerender:route': (route) => {
        console.log(`Prerendering ${route}`)
      }
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

  plugins: [
    '~/plugins/pinia-persistence.ts',
    '~/plugins/spa-redirect.client.ts'
  ],

  compatibilityDate: '2025-03-04'
})