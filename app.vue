<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';
import { useSyncStore } from '~/stores/sync';

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (theme === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

onMounted(async () => {
  if (process.client && typeof window !== 'undefined') {
    await nextTick();
    try {
      const userStore = useUserStore();
      const syncStore = useSyncStore();
      
      userStore.initialize();
      
      await syncStore.initialize();
      
      await syncStore.processUrlParams();
      
      applyTheme(userStore.theme || 'system');
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (userStore.theme === 'system') {
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      });
    } catch (error) {
      console.error('Error initializing stores in app.vue:', error);
    }
  }
});
</script>