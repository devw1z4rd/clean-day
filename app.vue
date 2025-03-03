<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <nav class="bg-primary-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg" >
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center">
          <span class="text-xl mr-1">✨</span>
          <span class="font-bold text-lg">Clean Day</span>
        </NuxtLink>
        
        <div class="hidden md:flex space-x-4">
          <NuxtLink to="/" class="px-3 py-2 rounded hover:bg-primary-700">Главная</NuxtLink>
          <NuxtLink to="/statistics" class="px-3 py-2 rounded hover:bg-primary-700">Статистика</NuxtLink>
          <NuxtLink to="/achievements" class="px-3 py-2 rounded hover:bg-primary-700">Достижения</NuxtLink>
          <NuxtLink to="/settings" class="px-3 py-2 rounded hover:bg-primary-700">Настройки</NuxtLink>
        </div>
        
        <button 
          class="md:hidden px-2 py-1 rounded bg-primary-700"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          Меню
        </button>
      </div>
    </nav>
    
    <div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 text-white">
      <div class="container mx-auto py-2">
        <div class="flex flex-col space-y-2 px-4 py-2">
          <NuxtLink to="/" @click="mobileMenuOpen = false" class="px-3 py-2 rounded hover:bg-gray-800">Главная</NuxtLink>
          <NuxtLink to="/statistics" @click="mobileMenuOpen = false" class="px-3 py-2 rounded hover:bg-gray-800">Статистика</NuxtLink>
          <NuxtLink to="/achievements" @click="mobileMenuOpen = false" class="px-3 py-2 rounded hover:bg-gray-800">Достижения</NuxtLink>
          <NuxtLink to="/settings" @click="mobileMenuOpen = false" class="px-3 py-2 rounded hover:bg-gray-800">Настройки</NuxtLink>
        </div>
      </div>
    </div>
    
    <main class="container mx-auto px-4 py-6">
      <div class="w-full max-w-5xl mx-auto">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const mobileMenuOpen = ref(false);

onMounted(() => {
  userStore.initialize();
});
</script>