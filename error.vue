<template>
  <div class="min-h-screen glass-background flex flex-col transition-colors duration-300">
    <UNotifications />

    <nav 
      class="backdrop-blur-2xl text-white sticky top-0 z-50 border-b shadow-xl transition-all duration-500 ease-in-out bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 py-3 px-4"
    >
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center">
          <span class="font-bold text-lg text-gray-900 dark:text-white drop-shadow-sm">Clean Day</span>
        </NuxtLink>
        
        <div class="hidden md:flex space-x-4">
          <NuxtLink to="/" class="px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm">Главная</NuxtLink>
          <NuxtLink to="/achievements" class="px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm">Достижения</NuxtLink>
          <NuxtLink to="/settings" class="px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm">Настройки</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-50 animate-float animation-delay-4000"></div>
        <div class="absolute bottom-40 right-10 w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-40 animate-float animation-delay-6000"></div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        <div class="text-center mb-12">
          <div class="relative mb-8">
            <h1 class="text-8xl md:text-9xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-500 to-purple-600">
              {{ is404 ? '404' : error?.statusCode || 'Ошибка' }}
            </h1>
            <div class="absolute inset-0 text-8xl md:text-9xl lg:text-[10rem] font-black text-primary-100 dark:text-primary-900 opacity-20 blur-sm">
              {{ is404 ? '404' : error?.statusCode || 'Ошибка' }}
            </div>
          </div>

          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {{ is404 ? 'Эта страница исчезла как дым' : 'Что-то пошло не так' }}
          </h2>
          
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ errorMessage }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <UCard 
            class="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 backdrop-blur-sm"
            :ui="{ body: { base: 'p-6' } }"
          >
            <div @click="handleError" class="block">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <UIcon name="i-heroicons-home" class="text-white text-2xl" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Главная</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Вернуться к отслеживанию прогресса</p>
              </div>
            </div>
          </UCard>

          <UCard 
            class="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 backdrop-blur-sm"
            :ui="{ body: { base: 'p-6' } }"
          >
            <div @click="() => clearError({ redirect: '/achievements' })" class="block">
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <UIcon name="i-heroicons-trophy" class="text-white text-2xl" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Достижения</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Посмотреть свои успехи</p>
              </div>
            </div>
          </UCard>

          <UCard 
            class="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 backdrop-blur-sm md:col-span-2 lg:col-span-1"
            :ui="{ body: { base: 'p-6' } }"
          >
            <div @click="() => clearError({ redirect: '/settings' })" class="block">
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <UIcon name="i-heroicons-cog-6-tooth" class="text-white text-2xl" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройки</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Персонализировать приложение</p>
              </div>
            </div>
          </UCard>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <UButton 
            @click="handleError"
            color="primary" 
            size="xl"
            icon="i-heroicons-home"
            class="group px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span class="group-hover:animate-pulse">Главная</span>
          </UButton>
          
          <UButton 
            @click="goBack" 
            color="white" 
            variant="soft"
            size="xl"
            icon="i-heroicons-arrow-uturn-left"
            class="px-6 py-4 rounded-2xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
          >
            Назад
          </UButton>
        </div>
      </div>
    </main>

    <footer class="mt-auto bg-gray-200/80 dark:bg-gray-900/80 py-4 border-t border-gray-300/50 dark:border-gray-800/50 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
            Clean Day — одна привычка минус, тысяча возможностей плюс
          </div>
          <div class="text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <span>made with ❤️ from </span>
            <a href="https://github.com/devw1z4rd" target="_blank" rel="noopener noreferrer"
               class="text-primary-600 dark:text-primary-400 hover:underline transition-colors ml-1">
              devw1z4rd
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  error: Object
})

const is404 = computed(() => props.error?.statusCode === 404)

const errorMessage = computed(() => {
  if (is404.value) {
    return 'Возможно, она растворилась в воздухе, как последняя затяжка. Но не волнуйтесь — мы поможем вам найти правильный путь!'
  }
  
  if (props.error?.statusCode === 500) {
    return 'На сервере произошла ошибка. Наши разработчики уже работают над её устранением!'
  }
  
  return props.error?.message || 'Произошла неожиданная ошибка. Попробуйте обновить страницу или вернуться на главную.'
})

const handleError = async () => {
  await clearError({ redirect: '/' })
}

const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('clean-day-user')
    let theme = 'system'
    
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        theme = parsed.theme || 'system'
      } catch (e) {
      }
    }
    
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    
    applyTheme(theme)
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    })
  }
})

useHead({
  title: `${is404.value ? '404 - Страница не найдена' : 'Ошибка'} | Clean Day`,
  meta: [
    {
      name: 'description',
      content: 'Страница не найдена или произошла ошибка в приложении Clean Day для отслеживания отказа от курения.'
    }
  ]
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(-5px) rotate(-1deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

.glass-background {
  background: 
    radial-gradient(ellipse 1000px 600px at 15% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse 800px 800px at 85% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
    
    repeating-linear-gradient(
      135deg,
      transparent 0px,
      transparent 60px,
      rgba(59, 130, 246, 0.015) 60px,
      rgba(59, 130, 246, 0.015) 61px,
      transparent 61px,
      transparent 120px
    ),
    
    radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.02) 1px, transparent 1px),
    
    #f3f4f6;
  
  background-size: 
    1400px 800px,
    1200px 1200px,
    240px 240px,
    80px 80px,
    100% 100%;
  
  background-attachment: fixed;
}

.dark .glass-background {
  background: 
    radial-gradient(ellipse 1000px 600px at 15% 80%, rgba(30, 58, 138, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 800px 800px at 85% 20%, rgba(29, 78, 216, 0.04) 0%, transparent 50%),
    
    repeating-linear-gradient(
      135deg,
      transparent 0px,
      transparent 60px,
      rgba(59, 130, 246, 0.02) 60px,
      rgba(59, 130, 246, 0.02) 61px,
      transparent 61px,
      transparent 120px
    ),
    
    radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.015) 1px, transparent 1px),
    
    #030712;
  
  background-size: 
    1400px 800px,
    1200px 1200px,
    240px 240px,
    80px 80px,
    100% 100%;
  
  background-attachment: fixed;
}

nav {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.dark nav {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
}

nav {
  transform: translateZ(0);
  will-change: background-color, backdrop-filter, padding, box-shadow;
}

.transition-all {
  transition: all 0.3s ease;
}

@media (max-width: 640px) {
  .text-8xl {
    font-size: 4rem;
  }
  
  .text-9xl {
    font-size: 5rem;
  }
}

.backdrop-blur-xl {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

@supports not (background-clip: text) {
  .bg-clip-text {
    background: none;
    color: theme('colors.primary.500');
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  .dark .backdrop-blur-sm {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

* {
  transition-property: transform, box-shadow, background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

button:focus,
a:focus {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
}
</style>