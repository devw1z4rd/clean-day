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
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        }
      ]
    }
  },
  
  nitro: {
    preset: 'github-pages'
  }
})