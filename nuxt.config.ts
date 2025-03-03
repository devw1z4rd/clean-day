export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt', 
    '@nuxt/icon', 
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Clean Day',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Приложение для отслеживания прогресса в отказе от курения'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  components: true,

  compatibilityDate: '2025-03-03',
})